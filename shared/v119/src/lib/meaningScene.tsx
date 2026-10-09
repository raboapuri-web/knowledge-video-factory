import '@fontsource/noto-sans-jp/400.css';
import '@fontsource/noto-sans-jp/700.css';
import {Circle, Line, Node, Rect, Txt, type View2D} from '@motion-canvas/2d';
import {all, waitFor, type ThreadGenerator} from '@motion-canvas/core';

/* V119: every meaning scene is one continuous space with seven causal states.
   Never insert children directly into view after subtitle layers exist. */
interface Cue {text:string;display:string;start:number;end:number}
interface MeaningScene {id:string;chapter:string;motif:string;title:string;cues:Cue[];duration:number}
const P={bg:'#09121D',forest:'#112C2A',sea:'#0B2938',deep:'#050D22',leaf:'#29483E',
  paper:'#E9ECE5',muted:'#8EA9B0',red:'#E65A58',gold:'#D7B178',cyan:'#71C3C3',
  blue:'#64A1D9',line:'#31545B',shadow:'#17313C',green:'#88B797'};
const FONT='Noto Sans JP, Noto Sans CJK JP, sans-serif';
const txt=(s:string,x:number,y:number,sz=33,col=P.paper,weight=600)=>
 new Txt({text:s,x,y,fontFamily:FONT,fontSize:sz,fill:col,fontWeight:weight});
const c=(p:Node,x:number,y:number,r:number,fill=P.paper,stroke?:string)=>
 p.add(new Circle({x,y,width:r*2,height:r*2,fill,stroke:stroke??fill,lineWidth:stroke?3:0}));
const r=(p:Node,x:number,y:number,w:number,h:number,fill=P.shadow,rad=8)=>
 p.add(new Rect({x,y,width:w,height:h,fill,radius:rad}));
const l=(p:Node,pts:number[][],col=P.line,w=4)=>
 p.add(new Line({points:pts,stroke:col,lineWidth:w,lineCap:'round',lineJoin:'round'}));
const label=(p:Node,s:string,x:number,y:number,col=P.gold,sz=32)=>
 p.add(txt(s,x,y,sz,col,700));
function tree(p:Node,x:number,y:number,scale=1){
 const g=new Node({x,y,scale});r(g,0,155,25,280,'#6C6453');
 for(const [dx,dy,z] of [[-65,-65,72],[0,-155,95],[80,-66,70],[-110,20,48],[117,5,53]] as const)
  c(g,dx,dy,z,P.leaf);
 p.add(g);
}
function stick(p:Node,x:number,y:number,s=1,col=P.gold){
 const g=new Node({x,y,scale:s});
 l(g,[[0,-88],[3,-30],[-5,85]],col,15);
 c(g,0,-99,12,col);l(g,[[-8,-100],[-37,-130]],col,3);l(g,[[8,-100],[36,-128]],col,3);
 for(const [yy,spread] of [[-44,82],[10,96],[65,85]] as const){
  l(g,[[0,yy],[-spread/2,yy-19],[-spread,yy+15]],col,5);
  l(g,[[0,yy],[spread/2,yy-19],[spread,yy+15]],col,5);
 }
 p.add(g);
}
function bird(p:Node,x:number,y:number,s=1,col=P.paper){
 const g=new Node({x,y,scale:s});
 c(g,0,0,49,col);c(g,38,-25,26,col);
 l(g,[[-36,5],[-118,-42],[-73,42]],col,21);
 l(g,[[0,-10],[-65,-79],[-97,-82]],P.muted,12);
 l(g,[[59,-20],[91,-10],[60,0]],P.gold,7);
 c(g,47,-32,4,P.bg);p.add(g);
}
function egg(p:Node,x:number,y:number,s=1,fill=P.paper){
 const g=new Node({x,y,scale:s});g.add(new Circle({width:23,height:33,fill,stroke:P.gold,lineWidth:2}));p.add(g);
}
function spider(p:Node,x:number,y:number,s=1,fill=P.paper){
 const g=new Node({x,y,scale:s});c(g,-30,-4,40,fill);c(g,34,0,23,fill);
 for(let i=0;i<4;i++)for(const side of [-1,1]){
  const yy=-37+i*25;l(g,[[side*12,yy],[side*80,yy-34],[side*124,yy+20]],P.muted,5);
 }
 c(g,40,-9,5,P.bg);p.add(g);
}
function web(p:Node,x:number,y:number,s=1){
 const g=new Node({x,y,scale:s});
 for(let i=0;i<10;i++){
  const a=2*Math.PI*i/10;
  l(g,[[0,0],[Math.cos(a)*268,Math.sin(a)*260]],'#52747A',2);
 }
 for(const radius of [65,122,181,241]){
  const pts=[] as number[][];
  for(let i=0;i<=20;i++){const a=i*Math.PI/10;pts.push([Math.cos(a)*radius,Math.sin(a)*radius*.95]);}
  l(g,pts,'#52747A',2);
 }
 p.add(g);
}
function termite(p:Node,x:number,y:number,s=1,blue=false){
 const g=new Node({x,y,scale:s});
 c(g,-39,0,32,'#D1B99C');c(g,20,0,41,'#C7A67D');c(g,70,0,19,'#D9C3A3');
 for(const side of [-1,1])for(const q of [-30,5,45])
  l(g,[[q,side*12],[q+15,side*62],[q+35,side*90]],'#C7A67D',5);
 if(blue){c(g,14,-45,23,'#6BB1E7');c(g,-27,-48,15,'#4D97CE');}
 p.add(g);
}
function caterpillar(p:Node,x:number,y:number,s=1,col=P.green){
 const g=new Node({x,y,scale:s});
 for(let i=0;i<8;i++){c(g,i*39-137,Math.sin(i*.5)*8,32,col);l(g,[[i*39-137,21],[i*39-144,48]],'#718F71',5);}
 c(g,151,-24,5,P.bg);g.add(new Circle({x:163,y:-24,width:8,height:8,fill:P.bg}));p.add(g);
}
function wasp(p:Node,x:number,y:number,s=1){
 const g=new Node({x,y,scale:s});
 c(g,-43,0,21,P.gold);c(g,2,0,28,'#2E353B');c(g,46,-2,19,P.gold);
 l(g,[[-65,-1],[-130,-1]],P.gold,8);
 g.add(new Circle({x:-4,y:-40,width:87,height:35,fill:P.paper,opacity:.65,rotation:-25}));
 g.add(new Circle({x:4,y:35,width:87,height:35,fill:P.paper,opacity:.65,rotation:25}));
 for(let i=-1;i<=1;i++)l(g,[[i*30,15],[i*36,62]],P.gold,4);
 p.add(g);
}
function cocoon(p:Node,x:number,y:number,s=1){
 const g=new Node({x,y,scale:s});
 r(g,0,0,31,74,P.paper,15);
 l(g,[[-17,-12],[16,5]],'#C6B8A2',2);l(g,[[-15,18],[14,27]],'#C6B8A2',2);p.add(g);
}
function slug(p:Node,x:number,y:number,s=1,headOnly=false){
 const g=new Node({x,y,scale:s});
 if(!headOnly){
  g.add(new Circle({x:-56,y:28,width:240,height:100,fill:P.green,stroke:'#5FAD82',lineWidth:4}));
  for(let i=0;i<6;i++)c(g,-143+i*31,25+(i%2)*12,10,'#C3CE8E');
 }
 c(g,82,-16,43,'#8BC99D');c(g,91,-23,5,P.bg);
 l(g,[[75,-38],[65,-90]],'#B3D4A7',5);l(g,[[101,-38],[121,-83]],'#B3D4A7',5);
 p.add(g);
}
function angler(p:Node,x:number,y:number,s=1,male=false){
 const g=new Node({x,y,scale:s});
 const body=male?42:187;g.add(new Circle({width:body*2,height:body*1.6,fill:'#425C79',stroke:'#83A4B2',lineWidth:3}));
 l(g,[[body*.65,0],[body*1.6,-body*.4],[body*1.3,body*.5]],'#425C79',male?10:35);
 c(g,-body*.44,-body*.15,Math.max(5,body*.10),P.paper);c(g,-body*.49,-body*.16,Math.max(2,body*.045),P.bg);
 if(!male){l(g,[[-body*.25,-body*.6],[-body*.35,-body*1.23],[body*.2,-body*1.45]],P.blue,7);c(g,body*.24,-body*1.45,23,P.gold);}
 p.add(g);
}
function human(p:Node,x:number,y:number,s=1,col=P.paper){
 const g=new Node({x,y,scale:s});c(g,0,-64,30,col);r(g,0,47,63,142,col,24);
 l(g,[[-19,98],[-27,195]],col,17);l(g,[[19,98],[27,195]],col,17);
 l(g,[[-29,6],[-78,77]],col,14);l(g,[[29,6],[78,77]],col,14);p.add(g);
}
function setting(parent:Node,chapter:string){
 const water=['chapter4','chapter5'].includes(chapter);
 const bg=chapter==='chapter5'?P.deep:water?P.sea:chapter==='prologue'||chapter==='epilogue'?P.forest:P.bg;
 r(parent,0,0,1920,1080,bg,0);
 if(chapter==='prologue'||chapter==='epilogue'||chapter==='chapter2'||chapter==='chapter3'){
  for(let i=0;i<6;i++)tree(parent,-870+i*340,130+(i%2)*45,.34+(i%3)*.09);
 }else if(water){
  for(let i=0;i<24;i++)c(parent,-920+(i*277)%1830,-310+(i*143)%560,1+(i%3),P.cyan);
  for(let i=0;i<6;i++)l(parent,[[-920+i*360,330],[-875+i*360,200+(i%3)*25]],'#255765',9);
 }else{
  for(let i=0;i<8;i++){l(parent,[[-900+i*240,310],[-830+i*240,-280]],'#243C42',2);}
 }
 // Persistent rules remain above the reserved bottom subtitle zone.
 r(parent,0,354,1920,2,'#35545D',0);
}
function stageLabel(p:Node,word:string,x=500,y=258,color=P.gold){
 if(!word)return;
 r(p,x,y,395,73,'#10222B',10);label(p,word,x,y,color,28);
}
function generateVisuals(root:Node,scene:MeaningScene):Node[]{
 const steps=Array.from({length:7},(_,i)=>new Node({opacity:0,x:i%2===0?36:-36,y:i%3===0?18:-16}));
 steps.forEach(p=>root.add(p));
 const [a,b,d,e,f,g,h]=steps;
 const motif=scene.motif;
 // The scene retains one world-space. Each of its seven layers encodes a causal state.
 if(['worldmap','islands'].includes(motif)){
  for(const [x,y,w,q] of [[-600,30,350,240],[0,-70,420,300],[580,70,310,220]] as const){r(a,x,y,w,q,'#294849',55);}
  for(let i=0;i<8;i++)c(a,-800+i*220,240+(i%2)*22,8,P.gold);
  label(b,'大陸',-615,-207);label(b,'海',350,-140,P.cyan);
  r(d,-215,40,195,125,'#102A37',40);label(d,'隔たり',-215,40,P.red);
  bird(e,-350,-190,.65);bird(f,320,-110,.75);
  stick(g,590,60,.65);label(h,motif==='islands'?'飛べない昆虫の分布':'移動が分布を変える',0,289,P.gold,42);
 }else if(['stick','returnforest'].includes(motif)){
  tree(a,-480,0,1.35);tree(a,505,-35,1);
  stick(b,-500,25,1.08);
  l(d,[[-510,100],[-545,-200]],'#7A664E',13);
  label(e,'枝への擬態',150,-190);
  bird(f,550,-120,.85);
  egg(g,140,90,2.3);egg(g,220,140,2.3);
  label(h,motif==='returnforest'?'生き物は未来を知らない':'翅を持たない',210,254,P.red,36);
 }else if(motif==='bird'||motif==='eggs'){
  tree(a,-590,60,1.18);stick(b,-525,0,.85);
  bird(d,60,-120,1.4);c(e,230,-65,140,'#1B3C47');
  for(let i=0;i<6;i++)egg(e,180+(i%3)*41,-100+Math.floor(i/3)*61,1.15);
  l(f,[[370,-90],[455,-20],[560,50]],P.gold,7);
  for(let i=0;i<5;i++)egg(g,415+i*60,180+i%2*24,1.2);
  stick(h,660,156,.48,P.cyan);label(h,'次の世代へ',430,300);
 }else if(['overview','gallery'].includes(motif)){
  const xs=[-730,-445,-160,125,405,685];
  stick(a,xs[0],-5,.7);
  spider(b,xs[1],0,.60);
  termite(d,xs[2],10,.7,true);
  wasp(e,xs[3],0,.67);
  slug(f,xs[4],5,.65);
  angler(g,xs[5],30,.40);
  label(h,scene.id==='P05'?'生存本能とは何か':'同じ進化、異なる戦略',0,285,P.gold,39);
 }else if(['spider','feeding','energy','tradeoff'].includes(motif)){
  web(a,-420,-15,.73);spider(b,-445,-8,.95,P.gold);
  for(let i=0;i<5;i++)spider(d,-120+i*81,200-(i%2)*26,.24,P.paper);
  if(motif==='feeding'){c(e,-410,-12,45,'#CE8D7D');label(e,'栄養を与える',105,-140);}
  else if(motif==='energy'){r(e,300,-110,520,135,'#1E4145');label(e,'95% の資源',300,-110,P.gold,60);}
  else if(motif==='tradeoff'){label(e,'今の子育て',200,-105);label(e,'将来の繁殖',560,-105,P.cyan);}
  else label(e,'母親の巣',235,-180);
  l(f,[[-170,46],[90,46],[305,80]],P.gold,8);
  for(let i=0;i<5;i++)spider(g,-120+i*90,170,.32,P.green);
  label(h,motif==='tradeoff'?'限られた資源をどう配分するか':'身体は次世代の資源となる',270,298,P.red,33);
 }else if(['colony','termite','aging','kin'].includes(motif)){
  r(a,-480,100,560,420,'#4B4036',170);
  for(let i=0;i<7;i++)termite(b,-640+i*90,170-(i%2)*60,.37,i>=4);
  termite(d,185,40,1.38,motif!=='colony');
  if(motif==='aging'){termite(e,560,50,1.15,true);label(e,'老いた働き個体',350,-180);}
  else if(motif==='kin'){for(let i=0;i<5;i++)c(e,400+(i%2)*86,-150+Math.floor(i/2)*86,29,P.cyan);label(e,'血縁集団',530,-240);}
  else {c(e,200,-30,37,P.blue);label(e,'青い結晶',480,-200);}
  for(let i=0;i<8;i++)c(f,75+(i*46)%330,-34+(i*59)%160,9,P.gold);
  r(g,260,194,460,94,'#9B463F',26);label(g,'危険な防衛',260,194,P.paper);
  label(h,motif==='kin'?'r × B > C':'個体の死と集団の生存',170,302,P.gold,motif==='kin'?59:34);
 }else if(['conflict','compare'].includes(motif)){
  r(a,-410,-55,510,480,'#173B3B',29);r(a,410,-55,510,480,'#3B272E',29);
  label(b,'利益を得る側',-415,-214,P.cyan,40);
  label(d,'損失を負う側',415,-214,P.red,40);
  wasp(e,-410,0,1.1);caterpillar(f,407,10,.95);
  l(g,[[-150,30],[145,30]],P.gold,9);
  label(h,'誰の適応度なのか',0,290,P.gold,43);
 }else if(['caterpillar','emerge','guard'].includes(motif)){
  l(a,[[-850,130],[780,140]],'#44795A',24);r(a,-430,240,1130,80,'#244E3B',50);
  caterpillar(b,-410,35,1.1);
  wasp(d,85,-130,.9);
  for(let i=0;i<6;i++)cocoon(e,100+i*65,128,.85);
  if(motif==='guard'){wasp(f,695,40,.57);label(f,'天敵の接近',550,-145,P.red);}
  else label(f,motif==='emerge'?'幼虫は外へ出る':'寄生バチの幼虫',400,-145);
  caterpillar(g,-320,37,1.15,P.gold);
  label(h,'宿主は繭を守る',270,290,P.gold,40);
 }else if(['ocean','detach','regrow','chloroplast'].includes(motif)){
  for(let i=0;i<8;i++)l(a,[[-835+i*230,260],[-806+i*230,78],[-748+i*230,22]],'#478A6D',8);
  slug(b,-390,0,1.12);
  if(motif==='detach'){slug(d,130,-104,1.2,true);slug(e,410,98,.95);label(f,'頭部だけが生存',370,-208);}
  else if(motif==='regrow'){slug(d,30,-60,1.12,true);slug(e,320,-60,1.22);label(f,'新しい身体',470,-210);}
  else if(motif==='chloroplast'){
   for(let i=0;i<12;i++)c(d,45+(i%4)*70,-170+Math.floor(i/4)*74,20,P.green);
   slug(e,410,100,.85);label(f,'盗葉緑体',368,-205);
  }else{slug(d,235,0,1.17);label(e,'心臓も再生する',330,-210);}
  l(g,[[-40,60],[190,60]],P.cyan,8);
  label(h,motif==='detach'?'身体を失っても生きる':'身体の完全性 ≠ 生存',180,288,P.gold,39);
 }else if(['deepsea','angler','fusion','immunity'].includes(motif)){
  angler(a,-320,85,.92);
  angler(b,510,-80,.18,true);
  if(motif!=='deepsea'){
   angler(d,-70,100,.2,true);
   l(e,[[-125,105],[-185,105]],P.red,12);
  }else label(d,'出会いの希少性',320,-175);
  if(motif==='immunity'){
   for(let i=0;i<9;i++)c(f,165+(i%3)*95,-205+Math.floor(i/3)*84,14,i%3?P.cyan:P.red);
   label(g,'免疫遺伝子の変化',380,140,P.gold,35);
  }else if(motif==='fusion')label(f,'血液循環の共有',355,-215);
  else label(f,'一度出会った相手を確保',400,-205);
  label(h,motif==='immunity'?'重要な機能すら変化する':'独立した個体の境界',260,293,P.gold,40);
 }else if(motif==='adaptation'||motif==='fitness'){
  for(let i=0;i<7;i++)c(a,-700+i*225,110,36,i%2?P.green:P.cyan);
  l(b,[[-790,60],[-660,-30],[-560,-10],[-450,-120]],P.gold,5);
  l(d,[[-450,-120],[-200,-70],[45,-165],[300,-140],[610,-245]],P.red,9);
  for(let i=0;i<6;i++)c(e,-650+i*230,-20-(i%3)*75,9,P.paper);
  label(f,'変異',-450,200);label(f,'遺伝',0,200);label(f,'自然選択',455,200);
  label(g,'長寿を採点する機構ではない',0,-295,P.gold,42);
  label(h,'繁殖成功の違いが残る',0,290,P.red,42);
 }else if(['age','timeline'].includes(motif)){
  l(a,[[-770,212],[760,212]],P.gold,7);
  for(let i=0;i<7;i++){c(b,-680+i*212,212,17,i<4?P.cyan:P.red);label(d,String(i*10)+'歳',-680+i*212,270,P.muted,23);}
  l(e,[[-750,-180],[-530,-210],[-280,-35],[0,70],[250,145],[600,195]],P.cyan,7);
  l(f,[[-750,160],[-560,80],[-310,-20],[-80,-95],[310,-142],[640,-192]],P.red,7);
  label(g,'若い時期の利益',-420,-264,P.cyan,37);
  label(h,'晩年のコスト',445,-264,P.red,37);
 }else if(['feelings','agency','absence','closing'].includes(motif)){
  human(a,-445,20,1.45);
  c(b,250,-130,73,motif==='feelings'?P.red:P.cyan);
  label(d,motif==='feelings'?'空腹・恐怖':motif==='absence'?'進化には意志がない':'何を大切に生きるか',280,-122,P.paper,37);
  l(e,[[-170,30],[80,30]],P.gold,7);
  r(f,325,140,590,102,'#174046',20);label(f,motif==='feelings'?'行動を促す信号':'生きる目的は別の問い',325,139,P.gold,35);
  label(g,'進化の説明 ≠ 人生の規範',0,300,P.gold,42);
  human(h,605,-70,.72,P.gold);
 }else{
  tree(a,-575,95,1.15);stick(b,-530,0,.85);
  bird(d,40,-170,1.2);spider(e,300,50,.8);
  slug(f,455,70,.7);angler(g,640,120,.32);
  label(h,'何を生き残りと呼ぶのか',30,295,P.gold,36);
 }
 return steps;
}
function* subtitles(cues:Cue[],labelNode:Txt,duration:number):ThreadGenerator{
 let now=0;
 for(const cue of cues){
  if(cue.start>now)yield* waitFor(cue.start-now);
  labelNode.text(cue.display);now=cue.start;
 }
 if(duration>now)yield* waitFor(duration-now);
 labelNode.text('');
}
function* showSteps(stages:Node[],duration:number):ThreadGenerator{
 // Seven causal reveals, with a meaningful continuous-world change at every beat.
 const at=[.025,.155,.285,.415,.545,.675,.815];
 let cursor=0;
 for(let i=0;i<stages.length;i++){
  const start=duration*at[i];
  if(start>cursor)yield* waitFor(start-cursor);
  cursor=start;
  const anim=Math.min(1.2,Math.max(.32,duration*.032));
  yield* all(stages[i].opacity(1,anim),stages[i].x(0,anim),stages[i].y(0,anim));
  cursor+=anim;
 }
 if(duration*.92>cursor){yield* waitFor(duration*.92-cursor);cursor=duration*.92;}
 // Focus on the consequence; never pan the whole screen meaninglessly.
 yield* all(stages[6].scale(1.045,.55),stages[2].opacity(.75,.55));
 cursor+=.55;
 if(duration>cursor)yield* waitFor(duration-cursor);
}
export function* playMeaningScene(view:View2D,scene:MeaningScene):ThreadGenerator{
 view.fill(P.bg);
 const contentLayer=new Node({});
 const headingLayer=new Node({});
 const subtitleBacking=new Node({});
 const subtitleTextLayer=new Node({});
 // Explicit immutable painter order; no later root insertions are allowed.
 view.add(contentLayer);
 view.add(headingLayer);
 view.add(subtitleBacking);
 view.add(subtitleTextLayer);
 setting(contentLayer,scene.chapter);
 const stages=generateVisuals(contentLayer,scene);
 r(headingLayer,0,-471,1920,136,'#07111A',0);
 headingLayer.add(txt(scene.title,0,-451,Math.min(49,scene.title.length>22?36:45),P.paper,700));
 headingLayer.add(txt(scene.chapter==='prologue'?'PROLOGUE':scene.chapter==='epilogue'?'EPILOGUE':scene.chapter.toUpperCase(),-794,-506,22,P.gold,700));
 headingLayer.add(txt(scene.id,828,-506,22,P.muted));
 // All subtitle roots are created last. Bottom 170px are permanently reserved.
 r(subtitleBacking,0,460,1920,170,'#02070D',0);
 const caption=txt('',0,458,42,P.paper,650);
 caption.lineHeight(59);
 subtitleTextLayer.add(caption);
 yield* all(showSteps(stages,scene.duration),subtitles(scene.cues,caption,scene.duration));
}
