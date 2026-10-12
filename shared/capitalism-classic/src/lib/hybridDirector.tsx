import '@fontsource/noto-sans-jp/400.css';
import '@fontsource/noto-sans-jp/700.css';
import {Node,Rect,Circle,Line,Txt,type View2D} from '@motion-canvas/2d';
import {all,easeInOutCubic,easeOutCubic,waitFor,type ThreadGenerator} from '@motion-canvas/core';
import {playScene as playDiegetic} from './director';

/**
 * Semantic visual director: scenes are justified by WHAT the narration argues,
 * not a random or repetitive "figure enters and object appears" animation.
 * "scene" alone hands off to the older illustrated Motion Canvas approach.
 * All remaining modes are diagram-first and have explicitly written labels.
 */
type Mode=
 'scene'|'quote'|'process'|'contrast'|'question'|'manifesto'|'book'|'claim'|
 'bread'|'mechanism'|'network'|'metric'|'ecosystem'|'barpairs'|'evaluation'|
 'overload'|'circulation'|'analogy'|'choices'|'trend'|'matrix'|'market'|
 'research'|'horizon'|'dilemma'|'recap'|'rules';
interface Cue{text:string;display:string;start:number;end:number}
interface Shot {
 id:string;chapter:string;world:string;events:string[];mode:string;headline:string;
 labels:string[];metric?:string;source?:string;
 cues:Cue[];duration:number;durationSource:string;
}
const FONT='Noto Sans JP, sans-serif';
const C={bg:'#0b1320',bg2:'#101e30',paper:'#f5f2ec',muted:'#b0bfca',
 muted2:'#8194a2',red:'#ee756b',teal:'#69c8b1',gold:'#e4c07f',
 blue:'#729ec4',panel:'#1a293e',panel2:'#20364a',rule:'#395066'};
type Piece={node:Node;kind?:'bar'|'normal';target?:number};
// Explicit pixel line-height is required by Motion Canvas. A unitless 1.3
// is treated as roughly 1px and causes superimposed lines inside labels.
const glyphUnits=(value:string)=>[...value].reduce((sum,ch)=>sum+(/[\u0020-\u007e]/.test(ch)?0.57:1),0);
const normalizeText=(value:string)=>value.replace(/\\n/g,'\n').replace(/\r/g,'');
/** Deterministic Japanese line-breaking; no implicit textWrap / overflow. */
function layoutLabel(raw:string,maxSize:number,insideWidth:number,insideHeight:number,maxLines=2){
 const value=normalizeText(raw);
 const sourceLines=value.split('\n');
 for(let size=Math.floor(maxSize);size>=18;size--){
  const available=Math.max(1,insideWidth/(size*1.06));
  const lines:string[]=[];
  for(const source of sourceLines){
   let text='';let used=0;
   for(const char of source){
    const unit=glyphUnits(char);
    if(text && used+unit>available){lines.push(text);text='';used=0;}
    text+=char;used+=unit;
   }
   lines.push(text);
  }
  const lineHeight=Math.ceil(size*1.24);
  if(lines.length<=maxLines &&
     lines.length*lineHeight<=insideHeight &&
     lines.every(x=>glyphUnits(x)*size*1.06<=insideWidth+1)){
    return {text:lines.join('\n'),fontSize:size,lineHeight,lines};
  }
 }
 throw new Error('Unfittable label within '+insideWidth+'x'+insideHeight+': '+raw);
}
const add=(parent:Node,node:Node)=>{parent.add(node);return node;};
const txt=(parent:Node,content:string,x:number,y:number,size=42,color=C.paper,width=0,weight=700):Txt=>{
 const value=normalizeText(content);
 const fitted=width>0?layoutLabel(value,size,width,Math.ceil(size*1.32),1):{
  text:value,fontSize:size,lineHeight:Math.ceil(size*1.24),
 };
 const t=new Txt({text:fitted.text,x,y,fontFamily:FONT,fontSize:fitted.fontSize,
  fontWeight:weight,fill:color,textAlign:'center',lineHeight:fitted.lineHeight,
  textWrap:false,...(width>0?{width}:{})});
 parent.add(t);return t;
};
/** For graphic containers, fit up to two lines without clipping/overlap. */
function fittingText(parent:Node,value:string,x:number,y:number,maxSize:number,color:string,w:number,h:number,maxLines=2){
 const v=layoutLabel(value,maxSize,w,h,maxLines);
 return add(parent,new Txt({text:v.text,x,y,fontFamily:FONT,fontSize:v.fontSize,
  fontWeight:700,fill:color,textAlign:'center',lineHeight:v.lineHeight,
  textWrap:false,width:w}));
}
const box=(parent:Node,x:number,y:number,w:number,h:number,fill=C.panel,r=18):Rect=>{
 const a=new Rect({x,y,width:w,height:h,fill,radius:r});
 parent.add(a);return a;
};
const dot=(p:Node,x:number,y:number,d:number,color:string)=>add(p,new Circle({x,y,width:d,height:d,fill:color}));
const segment=(p:Node,points:[number,number][],color:string=C.muted2,w=7)=>add(p,new Line({points,stroke:color,lineWidth:w,lineJoin:'round',lineCap:'round'}));
const piece=(p:Piece[],node:Node,kind?:Piece['kind'],target?:number)=>{
 node.opacity(0);node.scale(.88);p.push({node,kind,target});return node;
};
function chip(parent:Node,x:number,y:number,label:string,accent=C.teal,width=360,height=130):Node{
 const g=add(parent,new Node({x,y}));
 const rect=box(g,0,0,width,height,C.panel,18);rect.stroke(C.rule);rect.lineWidth(2);
 box(g,-width*.5+8,0,6,height*.64,accent,4);
 fittingText(g,label,0,0,label.length>17?29:35,C.paper,width-52,height-18);
 return g;
}
function arrow(parent:Node,x1:number,y1:number,x2:number,y2:number,color=C.gold):Node{
 const g=add(parent,new Node({}));
 segment(g,[[x1,y1],[x2,y2]],color,7);
 const a=Math.atan2(y2-y1,x2-x1),m=19;
 segment(g,[[x2-m*Math.cos(a-.55),y2-m*Math.sin(a-.55)],[x2,y2],[x2-m*Math.cos(a+.55),y2-m*Math.sin(a+.55)]],color,6);
 return g;
}
function icon(parent:Node,x:number,y:number,id:string,color:string):Node {
 const root=add(parent,new Node({x,y}));
 if(id==='coins'){
  for(let i=0;i<3;i++)box(root,-58+i*53,42-i*28,45,105+56*i,color,7);
 }else if(id==='branch'){
  segment(root,[[0,65],[0,-15],[-96,-100]],color,9);
  segment(root,[[0,-15],[95,-100]],color,9);dot(root,0,65,19,color);
 }else if(id==='world'){
  dot(root,0,0,140,'#284b62');
  for(let a of [0,Math.PI*.5,Math.PI,Math.PI*1.5])dot(root,Math.cos(a)*70,Math.sin(a)*70,22,color);
 }else if(id==='book'){
  box(root,-58,0,115,174,color,9);box(root,57,0,115,174,C.paper,9);
  segment(root,[[0,-81],[0,82]],C.bg2,7);
 }else if(id==='people'){
  for(let i=-1;i<=1;i++){dot(root,i*80,-32,41,color);box(root,i*80,57,61,93,color,19);}
 }else{
  dot(root,0,0,110,color);dot(root,0,0,45,C.panel);
 }
 return root;
}
function centered(value:string){return value.replace(/\\n/g,'\n');}

function init(view:View2D,s:Shot){
 view.fill(C.bg);
 const under=new Node({}),main=new Node({}),header=new Node({}),footer=new Node({}),caption=new Node({});
 // The subtitle is deliberately always painted LAST and is never a descendant of main.
 view.add(under);view.add(main);view.add(header);view.add(footer);view.add(caption);
 box(under,0,0,1920,1080,C.bg,0);
 const accent=s.chapter==='chapter3'?C.teal:s.chapter==='chapter5'?C.blue:s.chapter==='chapter1'?C.gold:C.red;
 box(under,-865,0,25,830,C.bg2,4).opacity(.84);
 box(under,0,343,1750,2,C.rule,0);
 box(header,0,-496,1920,92,C.bg2,0);
 box(header,-825,-495,7,47,accent,3);
 txt(header,'考える夜',-682,-494,36,C.paper);
 txt(header,s.chapter==='cta'?'考える夜 / ご案内':s.chapter==='prologue'?'考える夜 / 序章':s.chapter==='epilogue'?'考える夜 / 結論':('考える夜 / 第'+s.chapter.replace('chapter','')+'章'),632,-494,22,C.muted);
 if(!['quote','claim','manifesto'].includes(s.mode))txt(header,s.headline,0,-353,57,C.paper,1670);
 // Subtitle-safe region begins at y=376; central diagrams remain above y=282.
 box(footer,0,460,1920,163,'#02060c',0);
 box(footer,0,377,1920,3,accent,0);
 const subtitle=txt(caption,'',0,461,41,C.paper,1690);
 subtitle.lineHeight(58);
 // Source note is within the diagram region. Never obscure it with subtitles.
 if(s.source)txt(header,centered(s.source),0,307,18,C.muted,1700,400);
 return {main,subtitle,accent};
}
function build(s:Shot,parent:Node,accent:string):Piece[]{
 const P:Piece[]=[]; const L=s.labels; const mode=s.mode;
 const group=add(parent,new Node({y:0}));
 const show=(g:Node)=>piece(P,g);
 const label=(value:string,x:number,y:number,size=38,color=C.paper,w=0)=>txt(group,value,x,y,size,color,w);
 if(mode==='quote'||mode==='manifesto'||mode==='claim'){
  const a=add(group,new Node({x:0,y:-45}));
  txt(a,s.headline,0,0,mode==='manifesto'?64:73,mode==='claim'?C.red:accent,1530);
  show(a);
  const n=L.length;
  const cardWidth=n===1?670:n===2?615:n===3?455:n===4?340:270;
  const step=cardWidth+22,total=(n-1)*step;
  L.forEach((x,i)=>show(chip(group,-total/2+i*step,175,x,i===0?C.red:accent,cardWidth,110)));
  if(mode==='claim'){
   const line=add(group,new Node({}));
   segment(line,[[-610,88],[610,88]],C.red,5);
   show(line);
  }
 }else if(mode==='question'||mode==='contrast'||mode==='choices'||mode==='dilemma'||mode==='analogy'){
  const left=chip(group,-425,14,L[0],mode==='contrast'?C.red:accent,650,275);show(left);
  const right=chip(group,425,14,L[1]||'もう一つの選択肢',C.teal,650,275);show(right);
  const sign=add(group,new Node({}));
  txt(sign,mode==='question'?'VS':mode==='choices'?'？':mode==='dilemma'?'×':'≠',0,0,75,C.gold);show(sign);
  if(L[2])show(chip(group,0,237,L[2],C.gold,670,78));
 }else if(mode==='process'||mode==='mechanism'){
  const n=L.length,w=n===4?345:425,gap=n===4?380:490;
  L.forEach((v,i)=>{
   const x=(i-(n-1)/2)*gap;
   const item=add(group,new Node({x,y:5}));
   dot(item,0,-80,74,i%2?accent:C.gold);
   txt(item,String(i+1).padStart(2,'0'),0,-80,36,C.bg);
   chip(item,0,65,v,i%2?accent:C.gold,w,146);
   show(item);
   if(i<n-1){const connector=arrow(group,x+w*.5,20,x+gap-w*.5,20,C.muted2);show(connector);}
  });
 }else if(mode==='bread'){
  const shelves=add(group,new Node({}));
  const left=add(shelves,new Node({x:-425,y:0}));
  const right=add(shelves,new Node({x:425,y:0}));
  for(let i=0;i<10;i++)dot(left,-230+(i%5)*115,-60+Math.floor(i/5)*100,42,C.gold);
  for(let i=0;i<30;i++)dot(right,-247+(i%10)*55,-83+Math.floor(i/10)*80,26,C.gold);
  txt(left,'100個',0,177,62,C.paper);txt(right,'300個',0,177,62,C.teal);
  box(left,0,92,660,6,C.rule,2);box(right,0,92,660,6,C.rule,2);
  show(left);show(right);const sep=arrow(group,-60,18,60,18,C.red);show(sep);
 }else if(mode==='metric'){
  const headline=add(group,new Node({y:-18}));
  txt(headline,s.metric||'?',0,-44,141,accent,1420);
  txt(headline,s.headline,0,94,35,C.paper,1430);
  show(headline);
  const n=L.length,step=n===3?450:650;
  L.forEach((v,i)=>show(chip(group,(i-(n-1)/2)*step,228,v,i===0?C.gold:C.teal,Math.min(410,1200/n),83)));
 }else if(mode==='trend'||mode==='barpairs'){
  const n=2;
  L.slice(0,2).forEach((v,i)=>{
   const x=i===0?-427:427,part=add(group,new Node({x,y:0}));
   const plate=box(part,0,0,695,344,C.panel,21);
   plate.stroke(i===0?C.gold:accent);plate.lineWidth(3);
   txt(part,v,0,-85,v.length>22?35:43,C.paper,620);
   const up=(s.id==='cap-chapter5-02'?i===0:true);
   const arrowColor=up?C.teal:C.red;
   arrow(part,0,85,0,up?10:152,arrowColor);
   txt(part,i===0?'基準との変化':'別の指標',0,120,25,C.muted,610);
   show(part);
  });
  if(mode==='barpairs' && s.metric)show(chip(group,0,217,s.metric,C.gold,650,64));
 }else if(mode==='network'||mode==='circulation'){
  const positions=[[-550,-40],[0,-155],[550,-40],[0,169]];
  const count=Math.min(L.length,4);
  const hub=add(group,new Node({x:0,y:4}));
  dot(hub,0,0,150,C.panel2);txt(hub,mode==='network'?'価格':'交換',0,0,43,accent);
  show(hub);
  for(let i=0;i<count;i++){
   const [x,y]=positions[i],part=add(group,new Node({x,y}));
   dot(part,0,0,102,i%2===0?C.gold:C.teal);
   txt(part,L[i],0,0,L[i].length>8?29:36,C.bg,320);
   show(part);
   const connector=arrow(group,x*.77,y*.72,x*.18,y*.19,C.muted2);show(connector);
  }
 }else if(mode==='ecosystem'||mode==='rules'||mode==='evaluation'||mode==='matrix'){
  const n=L.length,positions=n===4?[[-460,-96],[460,-96],[-460,139],[460,139]]:[[-490,10],[0,-80],[490,10]];
  L.forEach((v,i)=>{
   const [x,y]=positions[i%positions.length],node=add(group,new Node({x,y}));
   const diameter=n===4?230:300;
   dot(node,0,0,diameter,i===0?C.gold:i===1?accent:C.teal);
   // The text's ACTUAL fitted bounds must be smaller than the enclosing circle.
   fittingText(node,v,0,0,n===4?32:37,C.bg,diameter*.77,diameter*.61,2);
   show(node);
  });
  if(mode==='rules')show(chip(group,0,235,'市場を機能させる条件',C.red,740,76));
 }else if(mode==='overload'){
  const central=add(group,new Node({x:0,y:70}));
  box(central,0,0,650,178,C.panel2,23);txt(central,'中央機関が全部把握する？',0,0,43,C.paper,590);
  show(central);
  const positions=[[-640,-145],[-315,-190],[0,-220],[315,-190],[640,-145]];
  L.forEach((v,i)=>{
   const [x,y]=positions[i],node=chip(group,x,y,v,C.red,285,98);
   show(node);
  });
 }else if(mode==='market'){
  const worker=add(group,new Node({}));
  icon(worker,0,-25,'people',C.gold);
  txt(worker,L[1],0,155,37,C.paper);show(worker);
  for(let i=0;i<2;i++){
   const x=i===0?-600:600;
   const n=chip(group,x,0,L[i===0?0:2],i===0?C.red:C.teal,350,190);show(n);
   show(arrow(group,x+(i===0?180:-180),0,i===0?-120:120,-10,i===0?C.red:C.teal));
  }
  if(s.metric)show(chip(group,0,242,s.metric,C.gold,720,78));
 }else if(mode==='research'){
  if(s.id==='cap-chapter4-04'){
   const panel=add(group,new Node({}));
   segment(panel,[[-590,162],[-590,-163]],C.muted2,4);
   segment(panel,[[-590,162],[625,162]],C.muted2,4);
   const curvedPath=add(group,new Node({}));
   segment(curvedPath,[[-542,130],[-400,-18],[-250,-112],[-65,-165],[140,-110],[335,-5],[560,122]],C.teal,13);
   txt(panel,'革新',-650,-147,28,C.muted);txt(panel,'競争の強さ',480,219,29,C.muted);
   show(panel);show(curvedPath);
  }else{
   show(chip(group,0,-55,'所得と幸福は単純な比例関係ではない',accent,1330,165));
   const n=L.length;
   L.forEach((v,i)=>show(chip(group,(i-(n-1)/2)*485,168,v,i===0?C.gold:C.teal,420,114)));
  }
 }else if(mode==='horizon'){
  const giant=add(group,new Node({x:-450,y:0}));
  box(giant,0,0,380,345,C.panel2,15);
  for(let i=0;i<3;i++)for(let j=0;j<3;j++)box(giant,-116+j*116,-83+i*85,64,37,C.blue,6);
  txt(giant,L[0],0,215,39,C.paper,420);show(giant);
  const entrant=add(group,new Node({x:445,y:35}));
  box(entrant,0,0,280,250,C.gold,10);txt(entrant,L[1],0,190,39,C.paper,440);show(entrant);
  show(arrow(group,-205,-40,205,-40,C.red));
  show(chip(group,0,267,L[2],C.teal,540,78));
 }else if(mode==='recap'){
  const positions=[[-590,-64],[-295,115],[0,-107],[295,115],[590,-64]];
  L.forEach((v,i)=>{
   const [x,y]=positions[i],node=add(group,new Node({x,y}));
   dot(node,0,0,165,i%2?C.teal:C.gold);
   txt(node,v,0,0,37,C.bg,200);show(node);
  });
 }else if(mode==='book'){
  const shape=add(group,new Node({x:-315,y:15}));icon(shape,0,0,'book',C.gold);show(shape);
  const desc=add(group,new Node({x:350,y:12}));
  txt(desc,L[0]||'参考文献',0,-54,55,C.paper,810);
  txt(desc,L[1]||'研究',0,64,43,accent,810);show(desc);
 }else{
  throw new Error('Undefined semantic design '+String(mode)+' in '+s.id);
 }
 return P;
}
/** Mode-specific transitions: not the same pop-in for every element. */
function* enterPiece(s:Shot,p:Piece,d:number,index:number):ThreadGenerator{
 const n=p.node,mode=s.mode;
 if(['process','mechanism','horizon','market'].includes(mode)){
   const x=n.x();n.x(x+(index%2===0?-52:52));
   yield* all(n.x(x,d,easeOutCubic),n.opacity(1,d),n.scale(1,d,easeOutCubic));
 }else if(['quote','claim','manifesto','recap','book'].includes(mode)){
   const y=n.y();n.y(y+36);
   yield* all(n.y(y,d,easeOutCubic),n.opacity(1,d),n.scale(1,d,easeOutCubic));
 }else if(['network','circulation','research','ecosystem','rules'].includes(mode)){
   const angle=n.rotation();n.rotation(angle+(index%2===0?9:-9));
   yield* all(n.rotation(angle,d,easeInOutCubic),n.opacity(1,d),n.scale(1,d,easeOutCubic));
 }else if(['trend','barpairs','bread','metric'].includes(mode)){
   const y=n.y();n.y(y+24);
   yield* all(n.opacity(1,d),n.y(y,d,easeOutCubic),n.scale(1,d,easeInOutCubic));
 }else if(['choices','contrast','question','dilemma','analogy'].includes(mode)){
   const x=n.x();n.x(x+(index%2===0?-35:35));
   yield* all(n.x(x,d,easeInOutCubic),n.opacity(1,d),n.scale(1,d,easeOutCubic));
 }else{
   yield* all(n.opacity(1,d,easeOutCubic),n.scale(1,d,easeInOutCubic));
 }
}
export function* playScene(view:View2D,s:Shot):ThreadGenerator {
 if(s.mode==='scene'){
  yield* playDiegetic(view,s as any);return;
 }
 if(s.durationSource!=='VOICEVOX_MEASURED')throw new Error('Measured voice timings required '+s.id);
 const {main,subtitle,accent}=init(view,s);
 // Semantic diagrams use the content field, not a tiny centered presentation slide.
 // All authored visual bounding boxes remain inside the 1920×1080 subtitle-safe area.
 main.scale(1.15);
 const pieces=build(s,main,accent);
 if(pieces.length<2)throw new Error('No multi-state visual story for '+s.id);
 let completed=0;
 for(let i=0;i<s.cues.length;i++){
  const cue=s.cues[i],d=cue.end-cue.start;
  if(!(d>0))throw new Error('Zero voice duration '+s.id);
  if(cue.display.includes('\\n'))throw new Error('Rendered literal backslash n');
  subtitle.text(cue.display);
  const upto=Math.max(completed,Math.min(pieces.length,Math.ceil((i+1)*pieces.length/s.cues.length)));
  const entering=pieces.slice(completed,upto);
  let used=0;
  if(entering.length){
   used=Math.min(.48,d*.30);
   yield* all(...entering.map((p,k)=>enterPiece(s,p,used,completed+k)));
   completed=upto;
  }
  yield* waitFor(Math.max(.01,d-used));
 }
 subtitle.text('');
}
