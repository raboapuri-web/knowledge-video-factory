import '@fontsource/noto-sans-jp/400.css';
import '@fontsource/noto-sans-jp/700.css';
import {Node, Rect, Circle, Line, Txt, type View2D} from '@motion-canvas/2d';
import {all, waitFor, type ThreadGenerator} from '@motion-canvas/core';

/** Original V135 Tesca: 24 explicit meaning-visual families. No generic fallbacks.
 * All chapter designs remain inside the frame's central safe zone. Subtitle is always
 * the final (topmost) view child and its timings come from measured VOICEVOX output.
 */
interface Cue {text:string;speech:string;display:string;start:number;end:number}
interface Shot {id:string;chapter:string;section:string;visual:string;title:string;note:string;
  narration:string;focus:string;cues:Cue[];duration:number;durationSource:string;sceneIndex:number}
interface Drawing {family:string;nodes:Node[];bars:Rect[];symbols:Circle[]}
const P={bg:'#090F18',panel:'#172537',panel2:'#1C3341',night:'#050A12',
  ink:'#0E1721',text:'#F4F1E8',secondary:'#B2BFCD',faint:'#526D80',
  jade:'#70D3BD',gold:'#E8BC68',red:'#E66B64',blue:'#78A5D7',paper:'#DDD2B5',white:'#FFFFFF'};
const FONT='Noto Sans JP, Noto Sans CJK JP, sans-serif';
function block(p:Node,x:number,y:number,w:number,h:number,color:string,rad=12):Rect{
  const n=new Rect({x,y,width:w,height:h,fill:color,radius:rad});p.add(n);return n;
}
function circ(p:Node,x:number,y:number,d:number,color:string):Circle{
  const n=new Circle({x,y,width:d,height:d,fill:color});p.add(n);return n;
}
function line(p:Node,pts:[number,number][],color=P.gold,w=5):Line{
  const n=new Line({points:pts,stroke:color,lineWidth:w,lineCap:'round',lineJoin:'round'});p.add(n);return n;
}
function write(p:Node,str:string,x:number,y:number,size=39,color=P.text,weight=700):Txt{
  const n=new Txt({text:str,x,y,fontSize:size,fontWeight:weight,fontFamily:FONT,fill:color,textAlign:'center'});p.add(n);return n;
}
function tag(p:Node,s:string,x:number,y:number,w=440,h=125,color=P.blue):Node{
  const g=new Node({x,y});p.add(g);
  block(g,0,0,w,h,P.panel2,14);block(g,0,-h/2+10,w-20,8,color,4);
  write(g,s,0,0,s.length>15?23:s.length>10?30:39);
  return g;
}
function human(p:Node,x:number,y:number,shirt=P.blue):Node{
  const g=new Node({x,y});p.add(g);
  circ(g,0,-85,57,P.paper);block(g,0,28,112,165,shirt,23);
  line(g,[[-31,75],[-45,150]],shirt,16);line(g,[[31,75],[45,150]],shirt,16);
  line(g,[[-50,-15],[-92,70]],shirt,12);line(g,[[50,-15],[92,70]],shirt,12);
  return g;
}
function right(p:Node,a:number,b:number,y:number,color=P.gold):void{
  line(p,[[a,y],[b,y]],color,7);line(p,[[b-20,y-17],[b,y],[b-20,y+17]],color,7);
}
function star(p:Node,x:number,y:number,n=10,color=P.gold):void{
  for(let i=0;i<n;i++){const a=i/n*6.283;circ(p,x+Math.cos(a)*168,y+Math.sin(a)*168,12,color);}
}
function heart(p:Node,x:number,y:number):Node{
  const g=new Node({x,y});p.add(g);
  circ(g,-26,-19,85,P.red);circ(g,26,-19,85,P.red);
  block(g,0,20,105,94,P.red,15);
  return g;
}
function art(s:Shot,root:Node):Drawing{
  const v=s.visual, nodes:Node[]=[],bars:Rect[]=[],symbols:Circle[]=[];
  const heading=s.chapter==='chapter1'?'少年と暴力':s.chapter==='chapter2'?'継承された二つの倫理':
    s.chapter==='chapter3'?'五百年越しの宗教対立':s.chapter==='chapter4'?'暴力の反復':'古代と現代の鏡';
  write(root,heading,0,-334,29,P.secondary);
  if(v==='cosmos'){
    symbols.push(circ(root,0,10,330,P.gold));symbols.push(circ(root,0,10,246,P.ink));star(root,0,10,15,P.red);
    write(root,'死んだはずの神々',-525,-130,44);write(root,'現代に戻る',510,125,44,P.gold);
    nodes.push(tag(root,'500年の沈黙',0,247,450,88,P.red));
  }else if(v==='serpent'){
    for(let i=0;i<5;i++)symbols.push(circ(root,-540+i*250,(i%2)*85-40,94,i%2?P.gold:P.red));
    line(root,[[-665,40],[-380,-100],[-80,75],[210,-105],[570,40]],P.gold,13);
    nodes.push(tag(root,'古代の神話 → 現代の欲望',0,235,740,110,P.gold));
  }else if(v==='supply'){
    nodes.push(tag(root,'麻薬',-575,0,375,215,P.red));
    nodes.push(tag(root,'流通網',0,0,375,215,P.gold));
    nodes.push(tag(root,'臓器市場',575,0,375,215,P.jade));
    right(root,-355,-220,0,P.red);right(root,225,360,0,P.gold);
    write(root,'欲望の循環',0,248,43,P.gold);
  }else if(v==='map'){
    nodes.push(tag(root,'メキシコ',-570,20,400,195,P.red));
    nodes.push(tag(root,'ジャカルタ',0,20,400,195,P.gold));
    nodes.push(tag(root,'川崎',570,20,400,195,P.blue));
    right(root,-337,-232,20,P.gold);right(root,235,338,20,P.gold);
    write(root,'犯罪ビジネスの移動経路（模式図）',0,232,31,P.secondary);
  }else if(v==='child'){
    const kid=human(root,-470,15,P.blue);nodes.push(kid);
    tag(root,'居場所のない少年',200,-100,560,170,P.red);
    tag(root,'木を彫る手',200,126,560,170,P.jade);
  }else if(v==='house'){
    line(root,[[-655,-155],[-380,-310],[-105,-155]],P.secondary,14);
    block(root,-380,25,500,340,P.panel2,8);
    nodes.push(human(root,-420,0,P.blue));
    nodes.push(human(root,-170,0,P.red));
    block(root,435,0,570,370,P.panel,20);
    tag(root,'父：暴力',435,-100,460,100,P.red);
    tag(root,'母：孤立',435,60,460,100,P.gold);
  }else if(v==='fracture'){
    nodes.push(tag(root,'支配',-470,-24,550,280,P.red));
    nodes.push(tag(root,'抵抗',470,-24,550,280,P.blue));
    line(root,[[0,-210],[-70,-50],[54,35],[-18,160]],P.red,13);
    write(root,'暴力による断絶',0,260,34,P.secondary);
  }else if(v==='addiction'){
    nodes.push(tag(root,'憎悪した麻薬',-480,-40,620,255,P.red));
    nodes.push(tag(root,'依存という矛盾',485,-40,620,255,P.gold));
    right(root,-120,115,-40,P.red);
    write(root,'逃げた先で、同じ市場へ',0,253,37,P.secondary);
  }else if(v==='craft'){
    line(root,[[-650,40],[-190,40]],P.paper,17);
    line(root,[[-235,40],[50,-165]],P.paper,18);
    // Symbolic wooden bird; no photograph or third-party IP.
    line(root,[[300,105],[430,-70],[535,45]],P.jade,15);
    line(root,[[430,-70],[385,-120]],P.jade,11);
    nodes.push(tag(root,'壊す手',-380,245,435,94,P.red));
    nodes.push(tag(root,'創る手',385,245,435,94,P.jade));
  }else if(v==='stigma'){
    nodes.push(tag(root,'少年の行動',-525,-20,525,205,P.red));
    nodes.push(tag(root,'失われた教育',195,-100,630,150,P.gold));
    nodes.push(tag(root,'家庭の孤立',195,100,630,150,P.blue));
    write(root,'結果だけで裁けるのか',0,260,36,P.text);
  }else if(v==='mentors'){
    nodes.push(tag(root,'バルミロ',-440,-115,650,130,P.red));
    nodes.push(tag(root,'パブロ',440,-115,650,130,P.jade));
    nodes.push(tag(root,'力を殺傷へ',-440,86,650,205,P.red));
    nodes.push(tag(root,'力を創造へ',440,86,650,205,P.jade));
    write(root,'コシモの二つの可能性',0,290,36,P.gold);
  }else if(v==='lineage'){
    nodes.push(tag(root,'祖母 リベルタ',-545,-30,475,208,P.gold));
    nodes.push(tag(root,'バルミロ',0,-30,475,208,P.red));
    nodes.push(tag(root,'コシモ',545,-30,475,208,P.blue));
    right(root,-293,-247,-25,P.gold);right(root,295,341,-25,P.gold);
    write(root,'信仰は次世代へ渡される',0,246,39,P.secondary);
  }else if(v==='solar'){
    symbols.push(circ(root,0,-20,300,P.gold));
    symbols.push(circ(root,0,-20,158,P.red));
    star(root,0,-20,16,P.gold);
    nodes.push(tag(root,'太陽の維持',-580,220,440,110,P.gold));
    nodes.push(tag(root,'供物と信仰',580,220,440,110,P.red));
    write(root,'神々の犠牲 → 人類の負債',0,-256,39,P.text);
  }else if(v==='debt'){
    nodes.push(tag(root,'神々が払った命',-515,-58,630,225,P.gold));
    nodes.push(tag(root,'人間の「命の借金」',515,-58,630,225,P.red));
    right(root,-190,175,-55,P.gold);
    write(root,'供犠は宇宙秩序の返済',0,247,43,P.secondary);
  }else if(v==='conquest'){
    nodes.push(tag(root,'1521年',-500,-105,590,140,P.gold));
    nodes.push(tag(root,'テノチティトラン陥落',435,-105,685,140,P.red));
    right(root,-155,70,-105,P.red);
    block(root,0,117,1385,170,P.panel2,10);
    write(root,'征服 × 植民地化 × キリスト教化',0,117,43);
  }else if(v==='syncretism'){
    symbols.push(circ(root,-220,0,410,P.red));
    symbols.push(circ(root,210,0,410,P.blue));
    write(root,'古代信仰',-360,0,46);write(root,'キリスト教',350,0,46);
    write(root,'消滅ではなく変容',0,277,40,P.gold);
  }else if(v==='market'){
    nodes.push(tag(root,'古代：神々',-510,-128,655,120,P.gold));
    nodes.push(tag(root,'現代：市場',510,-128,655,120,P.jade));
    nodes.push(heart(root,0,57));
    right(root,-470,-100,60,P.red);right(root,120,475,60,P.red);
    write(root,'人間の心臓が供物／商品になる',0,257,36,P.secondary);
  }else if(v==='eclipse'){
    symbols.push(circ(root,-60,-5,370,P.gold));
    symbols.push(circ(root,48,-5,333,P.night));
    star(root,-60,-5,13,P.gold);
    write(root,'日食という別の説明',0,270,44,P.text);
    nodes.push(tag(root,'神話から観察へ',-500,-240,500,112,P.blue));
  }else if(v==='friend'){
    nodes.push(human(root,-430,50,P.blue));
    nodes.push(human(root,420,50,P.jade));
    line(root,[[-250,90],[230,90]],P.gold,8);
    tag(root,'コシモ',-440,-231,440,98,P.blue);
    tag(root,'順太',420,-231,440,98,P.jade);
    write(root,'他者とつながる',0,285,42,P.gold);
  }else if(v==='scripture'){
    block(root,0,-10,1335,540,P.paper,15);
    write(root,'マタイによる福音書 9:13',0,-207,36,P.ink);
    write(root,'「憐れみであって、',0,-24,61,P.ink);
    write(root,'いけにえではない」',0,87,61,P.ink);
    nodes.push(tag(root,'犠牲よりも慈悲',0,246,580,84,P.jade));
  }else if(v==='confront'){
    nodes.push(tag(root,'生贄を求める信仰',-455,-48,715,275,P.red));
    nodes.push(tag(root,'命を守る倫理',455,-48,715,275,P.blue));
    line(root,[[0,-230],[0,191]],P.gold,8);
    write(root,'交わらない二つの正義',0,255,36,P.secondary);
  }else if(v==='mirror'){
    nodes.push(tag(root,'古代：神への供犠',-440,-20,705,290,P.red));
    nodes.push(tag(root,'現代：市場と犠牲',440,-20,705,290,P.blue));
    block(root,0,-12,19,470,P.gold,0);
    write(root,'鏡合わせ',0,265,43,P.gold);
  }else if(v==='ethics'){
    nodes.push(tag(root,'支配',-520,-63,535,200,P.red));
    nodes.push(tag(root,'抵抗',65,-63,535,200,P.blue));
    nodes.push(tag(root,'救済',540,205,535,114,P.jade));
    line(root,[[-233,10],[-174,10]],P.gold,7);
    line(root,[[60,60],[415,183]],P.gold,7);
    write(root,'暴力を拒むための暴力',0,-254,38,P.text);
  }else if(v==='ending'){
    block(root,0,0,790,488,P.panel2,15);
    block(root,0,0,670,420,P.night,5);
    nodes.push(human(root,0,35,P.blue));
    write(root,'映っているのは誰か',0,-255,52,P.gold);
    write(root,'神々は一度も死んでいない',0,283,41,P.red);
  }else{throw new Error('Unplanned semantic family '+s.id+':'+v);}
  return {family:v,nodes,bars,symbols};
}
function* progress(d:Drawing,s:Shot,at:number,duration:number):ThreadGenerator{
  const phase=(at+1)/Math.max(1,s.cues.length), t=Math.min(.62,Math.max(.12,duration*.23));
  const anim:ThreadGenerator[]=[];
  if(['cosmos','solar','eclipse'].includes(d.family)){
    d.symbols.forEach((x,i)=>{if(i===at%d.symbols.length)anim.push(x.scale(1.02+phase*.08,t));});
    if(d.nodes.length)anim.push(d.nodes[at%d.nodes.length].y(238-12*phase,t));
  }else if(['supply','map','lineage','friend','mentors','conquest','syncretism'].includes(d.family)){
    if(d.nodes.length){const target=d.nodes[at%d.nodes.length];anim.push(target.scale(1.04+phase*.05,t));}
    if(d.symbols.length)anim.push(d.symbols[at%d.symbols.length].opacity(.76+.2*phase,t));
  }else if(['house','child','craft','fracture','addiction','stigma'].includes(d.family)){
    if(d.nodes.length)anim.push(d.nodes[at%d.nodes.length].y((at%2?5:-5)*phase,t));
    if(d.bars.length)anim.push(d.bars[at%d.bars.length].width(200+200*phase,t));
  }else if(['market','debt','mirror','ethics','confront','scripture','ending','serpent'].includes(d.family)){
    if(d.nodes.length)anim.push(d.nodes[at%d.nodes.length].opacity(.7+(.3*phase),t));
    if(d.nodes.length>1)anim.push(d.nodes[(at+1)%d.nodes.length].scale(1+.05*phase,t));
  }
  if(anim.length)yield* all(...anim);else yield* waitFor(t);
  yield* waitFor(Math.max(.005,duration-t));
}
export function* playScene(view:View2D,s:Shot):ThreadGenerator{
  if(s.durationSource!=='VOICEVOX_MEASURED')throw new Error('Unmeasured VOICEVOX timeline '+s.id);
  const content=new Node({}),top=new Node({}),footer=new Node({}),subtitle=new Node({});
  view.add(content);view.add(top);view.add(footer);view.add(subtitle);
  view.fill(P.bg);
  block(content,0,0,1920,1080,P.bg,0);
  block(content,0,0,1850,965,P.night,8);
  line(content,[[-898,-381],[898,-381]],P.faint,2);
  line(content,[[-898,346],[898,346]],P.faint,2);
  const draw=art(s,content);
  write(content,s.note,0,350,25,P.secondary,400);
  block(top,0,-477,1920,122,P.bg,0);
  write(top,s.chapter==='prologue'?'PROLOGUE':s.chapter==='epilogue'?'EPILOGUE':
    'CHAPTER '+s.chapter.replace('chapter',''),-765,-475,23,P.gold);
  write(top,s.title,0,-473,s.title.length>15?36:43,P.text);
  write(top,'TESCA / V135',775,-475,22,P.secondary);
  block(footer,0,453,1920,171,P.bg,0).opacity(.98);
  const sub=write(subtitle,'',0,453,41,P.text);sub.width(1630);sub.lineHeight(60);
  for(let i=0;i<s.cues.length;i++){
    const cue=s.cues[i];const t=cue.end-cue.start;
    if(!(t>0))throw new Error('Invalid cue '+s.id);
    sub.text(cue.display);
    yield* progress(draw,s,i,t);
  }
  sub.text('');
}
