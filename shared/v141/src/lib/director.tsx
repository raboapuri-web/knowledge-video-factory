import {Node, Rect, Circle, Line, Txt, type View2D} from '@motion-canvas/2d';
import {all, waitFor, type ThreadGenerator} from '@motion-canvas/core';
import slideDeck from '../../content/slide-spec.json';

/**
 * V141 PRESENTATION CUT — zero scenic depictions.
 * 100 separate conceptual slides, individually curated visual instructions and narration anchors.
 * The narrator/subtitles are strictly locked to the user's approved script.
 */
type Cue={text:string;speech:string;display:string;start:number;end:number};
type Shot={id:string;chapter:string;section:string;title:string;visual:string;visualInstruction:string;
 motionInstruction:string;narration:string;sceneIndex:number;cues:Cue[];duration:number;durationSource:string};
type Spec={id:string;layout:string;headline:string;labels:string[];effect:number};
type Design={paper:string;ink:string;muted:string;panel:string;panel2:string;key:string;secondary:string;hair:string};
type Layout={parts:Node[];accent:Node[];mode:string};
const INK='#17222B',IVORY='#EEE8D9',RED='#AE3A36',DARK_RED='#8D302F',TEAL='#337F7D',BLUE='#51799A',GOLD='#B38B57';
const SERIF='Noto Serif CJK JP, Noto Serif JP, serif';
const SANS='Noto Sans CJK JP, Noto Sans JP, sans-serif';
const table=(slideDeck as {specs:Spec[]}).specs;
const CHAPTERS=['prologue','chapter1','chapter2','chapter3','chapter4','epilogue'];
function colors(s:Shot):Design {
 const chapter=CHAPTERS.indexOf(s.chapter);
 const light=(chapter===1||chapter===3||chapter===5);
 const accent=chapter===4?RED:chapter===2?GOLD:chapter===3?TEAL:chapter===1?BLUE:RED;
 return light?{paper:'#F5F0E6',ink:INK,muted:'#59676C',panel:'#E9E1D2',panel2:'#DBD3C5',key:accent,secondary:BLUE,hair:'#C3BCB0'}:
 {paper:'#101B24',ink:'#F5F0E6',muted:'#B1B8B4',panel:'#23343E',panel2:'#35444B',key:accent,secondary:'#93B7BB',hair:'#526069'};
}
function N(p:Node,x=0,y=0):Node{const v=new Node({x,y});p.add(v);return v;}
function R(p:Node,x:number,y:number,w:number,h:number,fill:string,r=0):Rect{
 const v=new Rect({x,y,width:w,height:h,fill,radius:r});p.add(v);return v;}
function O(p:Node,x:number,y:number,d:number,fill:string):Circle{
 const v=new Circle({x,y,width:d,height:d,fill});p.add(v);return v;}
function L(p:Node,pts:[number,number][],c:string,w=3):Line{
 const v=new Line({points:pts,stroke:c,lineWidth:w,lineCap:'round',lineJoin:'round'});p.add(v);return v;}
function T(p:Node,v:string,x:number,y:number,size:number,c:string,serif=true,weight=600):Txt{
 const t=new Txt({text:v,x,y,fontFamily:serif?SERIF:SANS,fontSize:size,fontWeight:weight,fill:c,textAlign:'center'});
 p.add(t);return t;
}
function txtSize(s:string,target=41):number{return s.length>24?Math.floor(target*.72):s.length>17?Math.floor(target*.83):target;}
function panel(p:Node,x:number,y:number,w:number,h:number,c:Design,label:string,variant=0):Node{
 const group=N(p,x,y);
 R(group,0,0,w,h,variant===1?c.panel2:c.panel,12);
 R(group,-w/2+10,0,7,h-30,variant===1?c.secondary:c.key,2);
 T(group,label,0,0,txtSize(label,38),c.ink);
 return group;
}
function small(p:Node,v:string,x:number,y:number,c:Design):Txt{
 return T(p,v,x,y,23,c.muted,false,500);
}
function quant(label:string):number {let m=label.match(/([\d.]+)/);return m?Number(m[1]):0;}
function scope(p:Node,c:Design,v:string):void{
 T(p,v,0,290,23,c.muted,false,400);
}
function chain(p:Node,c:Design,labels:string[],xw=1540):Node[]{
 const vals=labels.slice(0,4);const w=(xw-(vals.length-1)*28)/vals.length;
 const a:Node[]=[];
 vals.forEach((v,i)=>{
   const x=-xw/2+w/2+i*(w+28);
   const n=panel(p,x,0,w,180,c,v,i%3===2?1:0);
   a.push(n);
   if(i<vals.length-1){
     const dotX=x+w/2+13;
     O(p,dotX,0,10,c.key);O(p,dotX+13,0,8,c.secondary);
   }
 });
 return a;
}
function cards(p:Node,c:Design,labels:string[]):Node[]{
 const vals=labels.slice(0,4);
 const cols=vals.length===2?2:vals.length===3?3:2;
 const rows=Math.ceil(vals.length/cols);
 const w=cols===3?474:695,h=rows===2?210:316;
 const a:Node[]=[];
 vals.forEach((v,i)=>{
   const x=(i%cols-(cols-1)/2)*(w+34);
   const y=(Math.floor(i/cols)-(rows-1)/2)*(h+31);
   const g=N(p,x,y);R(g,0,0,w,h,c.panel,14);
   T(g,String(i+1).padStart(2,'0'),-w/2+57,-h/2+52,28,c.key,false);
   T(g,v,0,8,txtSize(v,45),c.ink);a.push(g);
 });
 return a;
}
function two(p:Node,c:Design,labels:string[],w=730,h=400):Node[]{
 const a:Node[]=[];
 const v=labels.length>=2?labels:['前','後'];
 for(let i=0;i<2;i++){
   const x=i===0?-400:400, group=N(p,x,4);a.push(group);
   R(group,0,0,w,h,i===0?c.panel:c.panel2,14);
   R(group,0,-h/2+10,w-20,9,i===0?c.secondary:c.key,0);
   T(group,i===0?'A':'B',-w/2+57,-h/2+59,30,c.muted,false);
   T(group,v[i],0,0,txtSize(v[i],48),c.ink);
 }
 if(v[2])small(p,v[2],0,257,c);
 return a;
}
function analyticalText(p:Node,c:Design,labels:string[],title:string):Node[]{
 const group=N(p,0,-22);
 T(group,title,0,-83,93,c.ink);
 L(group,[[-510,19],[510,19]],c.hair,3);
 const a=labels.slice(0,3).map((v,i)=>panel(group,(i-(Math.min(labels.length,3)-1)/2)*505,146,455,115,c,v,i%2));
 return [group,...a];
}
function ratio(p:Node,c:Design,labels:string[]):Layout {
 const n=Math.max(0,Math.min(100,quant(labels[0]||'0')));
 const a:Node[]=[];
 const header=N(p,-280,-85);a.push(header);
 T(header,n+'％',0,0,154,c.key);
 small(p,labels[2]||'面積比',205,-129,c);
 R(p,0,73,1450,115,c.panel2,7);
 const fill=R(p,-725+1450*n/200,73,1450*n/100,115,c.key,6);
 a.push(fill);
 const rem=100-n;
 T(p,labels[0]||String(n),-430,220,31,c.ink,false);
 T(p,labels[1]||String(rem),392,220,31,c.muted,false);
 scope(p,c,'実数に基づく面積・比率比較');
 return {parts:a,accent:[fill,header],mode:'proportion'};
}
function bar2(p:Node,c:Design,labels:string[]):Layout{
 const raw=labels.map(quant);const mx=Math.max(...raw.slice(0,2),1);
 const a:Node[]=[];
 labels.slice(0,2).forEach((v,i)=>{
   const y=-113+i*175, val=i===1&&v.includes('28〜38')?33:raw[i];
   const width=1120*val/mx;
   small(p,v,-475,y-67,c);
   R(p,90,y+9,1120,83,c.panel,7);
   const bar=R(p,-470+width/2,y+9,width,83,i===0?c.secondary:c.key,7);
   a.push(bar);
 });
 scope(p,c,labels[2]||'数値比較');
 return {parts:a,accent:a,mode:'comparison-bars'};
}
function metric(p:Node,c:Design,labels:string[]):Layout {
 const a:Node[]=[];
 const val=labels.slice(0,2);
 val.forEach((v,i)=>{
  const g=N(p,i===0?-410:410,-20);a.push(g);
  R(g,0,0,730,370,c.panel,15);
  T(g,v,0,-12,txtSize(v,100),i===0?c.secondary:c.key);
  R(g,0,160,390,3,c.hair,0);
 });
 if(labels[2])small(p,labels[2],0,257,c);
 return {parts:a,accent:a,mode:'metrics'};
}
function timeline(p:Node,c:Design,labels:string[]):Layout{
 const vals=labels.slice(0,4);const a:Node[]=[];
 L(p,[[-730,42],[730,42]],c.hair,5);
 vals.forEach((v,i)=>{
  const x=vals.length<2?0:-700+i*1400/(vals.length-1);
  const g=N(p,x,42);a.push(g);
  O(g,0,0,50,i===vals.length-1?c.key:c.secondary);
  R(g,0,-80,3,110,c.hair);
  T(g,v,0,i%2===0?141:-152,txtSize(v,36),c.ink);
 });
 scope(p,c,'時系列と転換点');
 return {parts:a,accent:a,mode:'chronology'};
}
function layering(p:Node,c:Design,labels:string[]):Layout{
 const vals=labels.slice(0,4);const a:Node[]=[];
 const h=vals.length===4?104:138;
 vals.forEach((v,i)=>{
   const y=210-i*(h+8);
   const g=N(p,0,y);a.push(g);
   R(g,0,0,1390,h,[c.panel,c.panel2,c.secondary,c.key][i],7);
   const color=i>=2?c.paper:c.ink;
   T(g,v,0,0,txtSize(v,38),color);
   T(g,'0'+(i+1),-640,0,25,color,false);
 });
 scope(p,c,'時間による蓄積／概念モデル');
 return {parts:a,accent:a,mode:'accumulation'};
}
function study(p:Node,c:Design,labels:string[]):Layout{
 const main=N(p,-348,-16);
 R(main,0,0,880,427,c.panel,13);
 R(main,-420,0,11,395,c.key);
 T(main,'RESEARCH',-225,-151,32,c.key,false,600);
 T(main,labels[0]||'実証研究',0,-29,txtSize(labels[0]||'',56),c.ink);
 L(main,[[-349,65],[349,65]],c.hair,2);
 T(main,labels[1]||'対象・条件',0,142,33,c.muted);
 const right=N(p,490,-16);
 R(right,0,0,560,427,c.panel2,13);
 T(right,'EVIDENCE',0,-152,28,c.key,false);
 T(right,labels[2]||'比較・結果',0,1,txtSize(labels[2]||'',43),c.ink);
 scope(p,c,'対象・条件・結果を切り分ける');
 return {parts:[main,right],accent:[main,right],mode:'evidence'};
}
function locator(p:Node,c:Design,labels:string[]):Layout{
 const a:Node[]=[];
 const base=N(p,-290,12);a.push(base);
 R(base,0,0,870,420,c.panel,15);
 for(let i=-3;i<=3;i++)L(base,[[-393+i*105,-172],[-393+i*105,172]],c.hair,1);
 for(let i=-1;i<=2;i++)L(base,[[-414,-160+i*92],[414,-160+i*92]],c.hair,1);
 const pin=O(base,90,-34,48,c.key);a.push(pin);
 O(base,90,-34,17,c.paper);
 const col=N(p,487,10);a.push(col);
 T(col,labels[0]||'地理・史実',0,-115,txtSize(labels[0]||'',53),c.ink);
 L(col,[[-235,-25],[235,-25]],c.key,5);
 T(col,labels[1]||'記録',0,61,41,c.ink);
 T(col,labels[2]||'',0,145,27,c.muted,false);
 scope(p,c,'地理的配置の模式表現／実測地図ではありません');
 return {parts:a,accent:[pin,col],mode:'reference'};
}
function network(p:Node,c:Design,labels:string[]):Layout{
 const names=labels.slice(0,4),a:Node[]=[];
 const ps:[number,number][]=[[-585,-180],[570,-175],[-585,165],[570,165]];
 L(p,[ps[0],ps[1]],c.hair,3);L(p,[ps[0],ps[2]],c.hair,3);L(p,[ps[1],ps[3]],c.hair,3);L(p,[ps[2],ps[3]],c.hair,3);
 L(p,[ps[0],ps[3]],c.hair,2);L(p,[ps[1],ps[2]],c.hair,2);
 names.forEach((v,i)=>{
  const n=N(p,ps[i][0],ps[i][1]);a.push(n);O(n,0,0,190,i===3?c.key:c.panel2);
  T(n,v,0,0,txtSize(v,40),i===3?c.paper:c.ink);
 });
 scope(p,c,'相互作用を可視化した概念ネットワーク');
 return {parts:a,accent:a,mode:'network'};
}
function loop(p:Node,c:Design,labels:string[]):Layout{
 const a:Node[]=[];const names=labels.slice(0,4);
 const ps:[number,number][]=[[-400,-155],[410,-155],[410,175],[-400,175]];
 names.forEach((v,i)=>{
  const g=N(p,ps[i][0],ps[i][1]);a.push(g);
  R(g,0,0,665,168,c.panel,14);R(g,0,-73,629,9,i===names.length-1?c.key:c.secondary);
  T(g,v,0,12,txtSize(v,34),c.ink);
 });
 L(p,[[-40,-157],[48,-157]],c.key,6);L(p,[[410,-35],[410,45]],c.key,6);
 L(p,[[50,176],[-44,176]],c.key,6);L(p,[[-400,58],[-400,-39]],c.key,6);
 scope(p,c,'相互に強化される関係（概念図）');
 return {parts:a,accent:a,mode:'feedback-loop'};
}
function filter(p:Node,c:Design,labels:string[]):Layout{
 const a:Node[]=[];
 T(p,'消火前',-480,-245,45,c.ink);
 T(p,'消火後',485,-245,45,c.ink);
 for(let i=0;i<18;i++){
  const x=-710+(i%6)*85,y=-95+Math.floor(i/6)*100;
  const n=O(p,x,y,45,i%4===0?c.key:c.secondary);a.push(n);
 }
 for(let i=0;i<6;i++){
  const x=300+(i%3)*170,y=-50+Math.floor(i/3)*160;
  const n=O(p,x,y,70,c.key);a.push(n);
 }
 R(p,0,-14,15,420,c.hair,1);
 scope(p,c,'残った火の割合が変わる／模式図（個数は実測値ではない）');
 return {parts:a,accent:a.filter((_,i)=>i>=18),mode:'selection'};
}
function headline(p:Node,c:Design,labels:string[]):Layout{
 const g=N(p,0,-22);
 const first=labels[0]||'事象',second=labels[1]||'評価';
 T(g,first,0,-70,90,c.key);
 T(g,second,0,92,55,c.ink);
 L(g,[[-690,-5],[690,-5]],c.hair,3);
 return {parts:[g],accent:[g],mode:'headline'};
}
function show(p:Node,c:Design,s:Spec):Layout{
 const v=s.labels;
 if(s.layout==='ratio')return ratio(p,c,v);
 if(s.layout==='bar2')return bar2(p,c,v);
 if(s.layout==='metric2')return metric(p,c,v);
 if(s.layout==='timeline')return timeline(p,c,v);
 if(s.layout==='layer'||s.layout==='xray')return layering(p,c,v);
 if(s.layout==='study'||s.layout==='method')return study(p,c,v);
 if(s.layout==='locator')return locator(p,c,v);
 if(s.layout==='cycle')return loop(p,c,v);
 if(s.layout==='network')return network(p,c,v);
 if(s.layout==='filter')return filter(p,c,v);
 if(s.layout==='duel'||s.layout==='contrast'||s.layout==='dilemma'||s.layout==='difference'||s.layout==='inversion'||s.layout==='analogy') {
  const n=two(p,c,v);return {parts:n,accent:n,mode:'opposition'};
 }
 if(s.layout==='matrix'||s.layout==='cards'||s.layout==='competition'||s.layout==='framing') {
  const n=cards(p,c,v);return {parts:n,accent:n,mode:'matrix'};
 }
 if(s.layout==='mechanism'||s.layout==='lifecycle'||s.layout==='path'||s.layout==='cascade'||s.layout==='causal'||s.layout==='gradient') {
  const n=chain(p,c,v);return {parts:n,accent:n,mode:'sequential'};
 }
 if(s.layout==='thesis'||s.layout==='outro'||s.layout==='hypothesis'||s.layout==='divider'||s.layout==='quote') {
  const n=analyticalText(p,c,v,s.layout==='quote'?(v[0]||s.headline):s.headline);
  return {parts:n,accent:n,mode:'typographic'};
 }
 if(s.layout==='scale'||s.layout==='headline')return headline(p,c,v);
 // No generic scenic fallback. Any unhandled layout fails fast during production QA.
 throw new Error('Unplanned editorial slide type '+s.id+' '+s.layout);
}
function* entrance(layout:Layout,effect:number,seconds:number):ThreadGenerator{
 const a=layout.accent;
 if(a.length===0){yield* waitFor(seconds);return;}
 const n=a[effect%a.length],style=effect%10;
 // Semantic layout-based movement, not the same fade/pan copied through all scenes.
 if(layout.mode==='proportion'||layout.mode==='comparison-bars'){
  n.scale(.78);yield* n.scale(1,seconds);
 }else if(layout.mode==='chronology'){
  const to=n.y();n.y(to+65);yield* n.y(to,seconds);
 }else if(layout.mode==='accumulation'){
  const to=n.y();n.y(to+77);yield* n.y(to,seconds);
 }else if(layout.mode==='metrics'||layout.mode==='evidence'){
  const to=n.x();n.x(to+(effect%2?-75:75));yield* n.x(to,seconds);
 }else if(layout.mode==='opposition'){
  const to=n.x();n.x(to+(effect%2?180:-180));yield* n.x(to,seconds);
 }else if(layout.mode==='sequential'){
  n.scale(.86);yield* n.scale(1,seconds);
 }else if(layout.mode==='matrix'){
  const to=n.y();n.y(to+(effect%2?45:-45));yield* n.y(to,seconds);
 }else if(layout.mode==='selection'){
  n.scale(.40);yield* n.scale(1,seconds);
 }else if(layout.mode==='feedback-loop'){
  const to=n.rotation();n.rotation(to+(effect%2?4:-4));yield* n.rotation(to,seconds);
 }else if(layout.mode==='reference'){
  const to=n.x();n.x(to+80);yield* n.x(to,seconds);
 }else if(layout.mode==='network'){
  n.scale(.76);yield* n.scale(1,seconds);
 }else if(layout.mode==='typographic'){
  if(style<5){const to=n.y();n.y(to-45);yield* n.y(to,seconds);}
  else {n.scale(.90);yield* n.scale(1,seconds);}
 }else{
  yield* waitFor(seconds);
 }
}
function* emphasize(layout:Layout,s:Spec,index:number,seconds:number):ThreadGenerator{
 const a=layout.accent;
 if(!a.length||seconds<=0){yield* waitFor(Math.max(0,seconds));return;}
 const n=a[(index+s.effect)%a.length];
 const selector=(s.effect+index)%6;
 const t=Math.min(.36,seconds*.32);
 if(selector===0){
  const x=n.x();yield* n.x(x+22,t);yield* n.x(x,t);
 }else if(selector===1){
  const y=n.y();yield* n.y(y-17,t);yield* n.y(y,t);
 }else if(selector===2){
  yield* n.scale(1.045,t);yield* n.scale(1,t);
 }else if(selector===3){
  const z=n.opacity();yield* n.opacity(.76,t);yield* n.opacity(z,t);
 }else if(selector===4){
  const z=n.rotation();yield* n.rotation(z+1.6,t);yield* n.rotation(z,t);
 }else{
  yield* n.scale(.97,t);yield* n.scale(1,t);
 }
 yield* waitFor(Math.max(.001,seconds-2*t));
}
export function* playScene(view:View2D,s:Shot):ThreadGenerator{
 if(s.durationSource!=='VOICEVOX_MEASURED')throw new Error('Voice not measured for '+s.id);
 const id=Number(s.id.slice(1)),sp=table[id-1];
 if(!sp||sp.id!==s.id)throw new Error('Missing curated presentation design '+s.id);
 const c=colors(s);
 view.fill(c.paper);
 const root=new Node({}),art=new Node({}),header=new Node({}),subtitles=new Node({});
 view.add(root);view.add(art);view.add(header);view.add(subtitles);
 R(root,0,0,1920,1080,c.paper);
 R(root,0,-49,1820,660,c.paper,12);
 R(root,-875,-445,8,86,c.key,0);
 T(header,'考 え る 夜',-729,-460,25,c.key);
 T(header,s.section,0,-460,24,c.muted,false,500);
 T(header,String(id).padStart(3,'0')+' / 100',736,-460,22,c.muted,false,500);
 L(header,[[-825,-408],[825,-408]],c.hair,2);
 T(header,sp.headline,0,-352,txtSize(sp.headline,66),c.ink);
 const lay=show(art,c,sp);
 // Lower band contains only subtitles and a minimal slide reference; no illustration beneath it.
 R(root,0,439,1920,200,c.paper);
 L(root,[[-874,355],[874,355]],c.hair,2);
 T(root,'FIRE ECOLOGY   /   SOCIAL PSYCHOLOGY',-605,386,18,c.muted,false,400);
 T(root,'研究・比較・思考実験を区別する',636,386,18,c.muted,false,400);
 // The very last-added layer: prevents visuals covering the captions.
 const cap=T(subtitles,'',0,463,44,c.ink,false,650);
 cap.width(1750);cap.lineHeight(63);
 const first=s.cues[0].end-s.cues[0].start;
 const intro=Math.min(.32,Math.max(.04,first*.23));
 cap.text(s.cues[0].display);
 yield* entrance(lay,sp.effect,intro);
 for(let j=0;j<s.cues.length;j++){
   const cue=s.cues[j];
   const dt=cue.end-cue.start-(j===0?intro:0);
   if(dt<=0)throw new Error('Zero/negative cue duration '+s.id);
   cap.text(cue.display);
   // Most subtitles get a stable frame; only 2-3 semantically motivated emphasis moments per slide.
   const landmarks=[Math.max(1,Math.floor(s.cues.length/3)),Math.max(2,Math.floor(s.cues.length*2/3))];
   if(j>0&&landmarks.includes(j)&&lay.accent.length>1)yield* emphasize(lay,sp,j,dt);
   else yield* waitFor(dt);
 }
 cap.text('');
}
