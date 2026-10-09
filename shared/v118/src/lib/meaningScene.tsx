import '@fontsource/noto-sans-jp/400.css';
import '@fontsource/noto-sans-jp/700.css';
import {Circle, Line, Node, Rect, Txt, type View2D} from '@motion-canvas/2d';
import {all, waitFor, type ThreadGenerator} from '@motion-canvas/core';

// Layer contract, from back to front:
// backplate -> contentLayer -> headingLayer -> subtitleBacking -> subtitleText
// No visual objects are ever inserted into the root view after subtitle creation.
interface Cue {text:string;display:string;start:number;end:number}
interface MeaningScene {id:string; chapter:string; motif:string; title:string; cues:Cue[];duration:number}
const P={bg:'#0A1220',bg2:'#111F30',paper:'#EAE8DF',muted:'#8297A9',red:'#D9494C',gold:'#BE9D68',cyan:'#7FAAB9',line:'#35465A',shadow:'#162436'};
const font='Noto Sans JP, Noto Sans CJK JP, sans-serif';
const t=(s:string,x:number,y:number,size=38,fill=P.paper,weight=600)=>new Txt({text:s,x,y,fontFamily:font,fontSize:size,fontWeight:weight,fill});
const panel=(x:number,y:number,w:number,h:number,fill=P.shadow)=>new Rect({x,y,width:w,height:h,fill,radius:12,stroke:P.line,lineWidth:2});
const rule=(x1:number,y1:number,x2:number,y2:number,color=P.line,width=3)=>new Line({points:[[x1,y1],[x2,y2]],stroke:color,lineWidth:width});
const dot=(x:number,y:number,r:number,color=P.paper)=>new Circle({x,y,width:2*r,height:2*r,fill:color});
function addPerson(parent:Node,x:number,y:number,scale=1,color=P.paper){
 const p=new Node({x,y,scale});
 p.add(dot(0,-37,22,color));
 p.add(new Rect({x:0,y:26,width:39,height:78,fill:color,radius:13}));
 p.add(rule(-12,64,-23,114,color,12));p.add(rule(12,64,23,114,color,12));
 parent.add(p);return p;
}
function microPeople(parent:Node,n:number,x:number,y:number,columns:number,spacing=48,color=P.paper){
 for(let i=0;i<n;i++){
  const cx=x+(i%columns)*spacing,cy=y+Math.floor(i/columns)*spacing;
  parent.add(dot(cx,cy-12,9,color));parent.add(new Rect({x:cx,y:cy+8,width:17,height:26,fill:color,radius:4}));
 }
}
function building(parent:Node,x:number,y:number,w:number,h:number,color=P.shadow){
 parent.add(new Rect({x,y,width:w,height:h,fill:color,stroke:P.line,lineWidth:2}));
 parent.add(rule(x-w*.57,y-h*.5,x+w*.57,y-h*.5,P.gold,8));
 for(let col=-2;col<=2;col++) for(let row=-1;row<=1;row++){
  parent.add(new Rect({x:x+col*w*.16,y:y+row*h*.23,width:Math.min(26,w*.105),height:Math.min(40,h*.15),fill:'#34475B'}));
 }
}
function document(parent:Node,x:number,y:number,w:number,h:number,title:string,mark=false){
 parent.add(new Rect({x,y,width:w,height:h,fill:'#DCDDD6',radius:7,stroke:'#87909A',lineWidth:2}));
 parent.add(t(title,x,y-h*.31,Math.max(18,Math.min(28,w/7)),P.bg,700));
 for(let j=0;j<4;j++)parent.add(rule(x-w*.35,y-h*.12+j*22,x+w*(j===3?.12:.34),y-h*.12+j*22,'#8C97A4',4));
 if(mark)parent.add(new Circle({x:x+w*.23,y:y+h*.26,size:58,stroke:P.red,lineWidth:8}));
}
function pill(parent:Node,s:string,x:number,y:number,w=230,color=P.cyan){
 parent.add(panel(x,y,w,63,P.bg2));parent.add(t(s,x,y,28,color,700));
}
function arrow(parent:Node,x1:number,y1:number,x2:number,y2:number,color=P.red){
 parent.add(new Line({points:[[x1,y1],[x2,y2]],stroke:color,lineWidth:5,endArrow:true,arrowSize:14}));
}
function generateVisuals(root:Node,motif:string,scene:MeaningScene):Node[]{
 // Each child layer depicts a causal step, not a punctuation-based cut.
 const l=Array.from({length:4},(_,i)=>new Node({opacity:0,x:i%2?-45:45,y:0}));
 l.forEach(a=>root.add(a));
 const [a,b,c,d]=l;
 const base=scene.title;
 switch(motif){
  case 'palace':
   building(a,0,40,560,530);
   a.add(rule(-380,315,380,315,P.gold,7));
   addPerson(b,-540,90,1.2,P.paper);addPerson(b,520,90,1.2,P.paper);
   document(c,-420,-100,240,300,'軍の報告');document(c,420,-100,240,300,'国会決議');
   d.add(t('元帥の肖像',0,-155,42,P.gold));d.add(new Rect({x:0,y:5,width:160,height:230,stroke:P.gold,lineWidth:5}));addPerson(d,0,35,1.1,P.gold);break;
  case 'command':
   building(a,-480,45,260,370);building(a,480,45,260,370);
   a.add(t('中央宮殿',0,-220,38,P.gold));
   for(let i=0;i<6;i++)addPerson(b,-320+i*125,220,.45,i%2?P.paper:P.cyan);
   c.add(rule(-370,-120,370,-120,P.red,7));c.add(t('全会一致',0,-176,49,P.paper));
   document(d,0,60,360,260,'命令書',true);break;
  case 'choices':
   ['戦争','経済危機','反乱'].forEach((q,i)=>pill(a,q,-440+i*440,-180,260,i===2?P.red:P.paper));
   b.add(t('退陣後',-430,75,56,P.gold));arrow(b,-250,75,15,75);
   document(c,230,10,290,310,'退陣届');
   d.add(t('翌朝の運命は？',0,266,49,P.red));break;
  case 'fates':
   ['1989 ルーマニア','2006 イラク','2011 リビア'].forEach((q,i)=>{
     const x=-490+i*490;a.add(panel(x,0,355,370));a.add(t(q,x,-133,30,P.gold));addPerson(a,x,40,.78,P.paper);
   });
   b.add(t('処刑',-485,195,34,P.red));c.add(t('裁判後の処刑',0,195,34,P.red));
   d.add(t('拘束時の殺害',486,195,34,P.red));break;
  case 'stat':
   a.add(t(scene.id==='P04'?'1946—2004':'非暴力抵抗運動',0,-205,44,P.gold));
   a.add(panel(0,55,1260,220));
   if(scene.id==='P04'){
    b.add(new Rect({x:-331,y:40,width:592,height:135,fill:P.red,radius:8}));b.add(t('47%',-325,36,76,P.paper,800));
    c.add(new Rect({x:332,y:40,width:650,height:135,fill:'#3D566B',radius:8}));c.add(t('53%',334,37,68,P.paper));
    d.add(t('投獄・殺害・亡命の合計',0,245,35,P.paper));
   } else {
    b.add(new Rect({x:-470,y:42,width:88,height:165,fill:P.red}));b.add(t('3.5%',-468,-65,62,P.red,800));
    c.add(new Rect({x:110,y:42,width:1050,height:165,fill:'#2F4052'}));
    d.add(t('必ず成功する閾値ではない',0,242,36,P.paper));
   }break;
  case 'square':
   a.add(new Rect({x:0,y:60,width:1180,height:490,fill:'#17273A'}));
   microPeople(a,15,-395,-75,5,58,P.paper);
   microPeople(b,32,15,-135,8,54,P.red);
   c.add(t('抗議の拡大',0,-268,51,P.gold));
   d.add(new Rect({x:0,y:275,width:1000,height:8,fill:P.red}));break;
  case 'network':
   ['鉄道','港','銀行','官庁','軍隊'].forEach((q,i)=>{const x=-560+i*280;a.add(dot(x,-88,52,P.cyan));a.add(t(q,x,20,33,P.paper));});
   for(let i=0;i<4;i++)b.add(rule(-560+i*280,-88,-280+i*280,-88,P.gold,5));
   c.add(dot(0,205,65,P.red));c.add(t('元帥',0,207,31,P.paper));
   d.add(t('命令だけでは動かない',0,-253,45,P.red));break;
  case 'heli':
   a.add(panel(0,240,1340,76,'#2E3B46'));microPeople(a,30,-475,140,15,68,P.paper);
   b.add(new Rect({x:-230,y:-140,width:440,height:74,fill:'#8295A4',radius:28}));
   b.add(dot(-430,-150,25,'#AFC1CA'));b.add(rule(-560,-202,72,-202,'#C3CBCB',15));
   c.add(new Rect({x:-200,y:-50,width:230,height:70,fill:P.red,radius:7}));c.add(t('攻撃せず着陸',120,-42,47,P.paper));
   d.add(t('軍の離反',0,-288,55,P.gold));break;
  case 'crowd':
   microPeople(a,44,-540,-130,11,98,P.paper);
   b.add(rule(-640,260,640,260,P.gold,7));
   microPeople(c,20,-455,-25,10,95,P.red);
   d.add(t('服従か、離反か',0,-296,50,P.gold));break;
  case 'council':
   a.add(panel(0,212,1370,95,'#29394D'));
   for(let i=0;i<3;i++){addPerson(b,-440+i*440,-20,1.24,i===1?P.cyan:P.paper);}
   ['陸軍司令官','情報長官','与党幹事長'].forEach((s,i)=>c.add(t(s,-440+i*440,206,31,P.gold)));
   d.add(t('誰が裏切るのか',0,-265,58,P.red));break;
  case 'hierarchy':
   addPerson(a,0,-196,1.2,P.gold);
   ['軍','情報','党'].forEach((q,i)=>{const x=-490+i*490;b.add(dot(x,60,60,P.cyan));b.add(t(q,x,155,46,P.paper));});
   [-490,0,490].forEach(x=>arrow(c,0,-90,x,10,P.red));
   d.add(t('統治能力と政権リスク',0,277,37,P.gold));break;
  case 'general':
   addPerson(a,-440,10,1.65,P.cyan);
   microPeople(b,24,-110,-50,8,80,P.paper);
   c.add(t('支持と信頼が増える',350,-178,44,P.gold));
   arrow(d,270,35,-185,35,P.red);d.add(t('潜在的な競争相手',300,132,39,P.red));break;
  case 'timeline':
   a.add(rule(-650,60,650,60,P.gold,8));
   const years=scene.id==='C23'?['1980','2017','2019']:['1988','1990','1998'];
   years.forEach((v,i)=>{const x=-500+i*500;b.add(dot(x,60,20,i===1?P.red:P.paper));b.add(t(v,x,-12,52,i===1?P.red:P.paper));});
   c.add(t(scene.id==='C23'?'副大統領解任 → 軍が介入':'国民投票 → 退陣 → 司法問題',0,205,37,P.paper));
   d.add(t(scene.id==='C23'?'与党内部の離反':'退陣後の責任追及',0,-234,46,P.gold));break;
  case 'shadows':
   microPeople(a,30,-520,-120,10,109,P.paper);
   b.add(new Rect({x:0,y:-16,width:1300,height:480,fill:'#0D1726',opacity:.65}));
   microPeople(c,8,-435,40,8,121,P.red);
   d.add(t('沈黙 ≠ 支持',0,-245,59,P.red));break;
  case 'cells':
   a.add(panel(-480,0,350,395));a.add(panel(0,0,350,395));a.add(panel(480,0,350,395));
   addPerson(b,-480,45,1.1);addPerson(b,0,45,1.1);addPerson(b,480,45,1.1);
   ['職場','会議室','広場'].forEach((q,i)=>c.add(t(q,-480+i*480,-165,39,P.gold)));
   d.add(t('表面上の静けさ',0,262,46,P.red));break;
  case 'documents':
   document(a,-450,0,350,375,'農業省');document(a,0,0,350,375,'経済省');document(a,450,0,350,375,'情報機関');
   b.add(t('豊作',-450,115,37,P.cyan));b.add(t('成長',0,115,37,P.cyan));b.add(t('支持',450,115,37,P.cyan));
   c.add(new Rect({x:0,y:255,width:1300,height:6,fill:P.red}));
   d.add(t('現実と報告は同じか？',0,-278,44,P.red));break;
  case 'pipeline':
   ['現場','役所','省庁','宮殿'].forEach((q,i)=>{const x=-570+i*380;a.add(dot(x,-80,46,i===3?P.red:P.cyan));a.add(t(q,x,13,31,P.paper));});
   for(let i=0;i<3;i++)arrow(b,-505+i*380,-80,-255+i*380,-80,P.gold);
   c.add(t('数字が整えられてゆく',0,190,46,P.red));
   d.add(t('現実 → 報告',0,-260,46,P.paper));break;
  case 'balances':
   a.add(rule(0,-160,0,210,P.gold,15));a.add(rule(-470,-130,470,-130,P.gold,12));
   b.add(new Rect({x:-380,y:20,width:280,height:80,fill:P.cyan,radius:10}));
   c.add(new Rect({x:380,y:-13,width:280,height:80,fill:P.red,radius:10}));
   d.add(t('利益と代償',0,255,46,P.paper));break;
  case 'night':
   building(a,0,0,640,420,'#0E1A2B');a.add(dot(480,-320,67,'#CEC6B0'));
   b.add(panel(0,263,800,90,'#272E35'));addPerson(b,0,104,1.1,P.paper);
   c.add(t('深夜の執務室',0,-285,49,P.gold));
   d.add(t('出口はどこにある？',0,275,37,P.red));break;
  case 'border':
   a.add(new Rect({x:0,y:10,width:1280,height:480,fill:'#182C3D'}));
   a.add(rule(0,-228,0,250,P.red,8));
   b.add(t('国内',-350,-105,56,P.paper));b.add(t('国外',350,-105,56,P.paper));
   c.add(panel(350,100,420,155));c.add(t('外国メディア',350,99,37,P.gold));
   d.add(t('命令の届かない世界',0,-293,45,P.red));break;
  case 'diplomacy':
   a.add(dot(-480,0,102,P.cyan));a.add(t('国家の利益',-480,157,42,P.paper));
   b.add(dot(480,0,102,P.red));b.add(t('元帥の利益',480,157,42,P.paper));
   arrow(c,-330,0,310,0,P.gold);
   d.add(t('一致するとは限らない',0,-254,47,P.red));break;
  case 'clock':
   a.add(new Circle({x:-430,y:-12,width:315,height:315,stroke:P.gold,lineWidth:14}));
   a.add(rule(-430,-12,-430,-108,P.paper,11));a.add(rule(-430,-12,-346,48,P.paper,8));
   addPerson(b,310,80,1.7,P.paper);
   c.add(t('時間だけは止められない',0,-261,43,P.gold));
   d.add(t('後継者',315,250,40,P.red));break;
  case 'resignation':
   document(a,-415,-40,510,435,'辞任文書');
   addPerson(b,460,70,1.65,P.paper);
   c.add(t('安全の保証',360,-221,44,P.gold));
   d.add(t('誰が約束を守らせる？',0,280,43,P.red));break;
  case 'promise':
   addPerson(a,-450,60,1.35);addPerson(a,450,60,1.35,P.cyan);
   b.add(panel(0,-40,320,145));b.add(t('約束',0,-42,46,P.paper));
   c.add(rule(-215,-35,225,-35,P.gold,7));
   d.add(t('権力移行で力関係が変わる',0,248,41,P.red));break;
  case 'benin':
   a.add(rule(-650,100,650,100,P.gold,8));
   ['1972','1990','1991'].forEach((q,i)=>{const x=-520+i*520;b.add(dot(x,100,25,i===2?P.cyan:P.paper));b.add(t(q,x,-3,50,P.paper));});
   c.add(t('軍事政権 → 国民会議 → 選挙',0,220,45,P.gold));
   d.add(t('民主化の受け入れ',0,-258,49,P.red));break;
  case 'ballot':
   a.add(panel(-400,30,460,430));a.add(t('選挙',-400,-133,51,P.gold));
   b.add(new Rect({x:-400,y:22,width:245,height:16,fill:P.paper}));
   c.add(panel(425,30,510,430));c.add(t('1996',425,-125,66,P.gold));
   d.add(t('平和的退陣、そして復帰',0,276,41,P.paper));break;
  case 'chair':
   a.add(new Rect({x:0,y:68,width:330,height:235,fill:'#5B4A39',radius:35,stroke:P.gold,lineWidth:8}));
   a.add(new Rect({x:0,y:250,width:420,height:43,fill:'#6F523C',radius:9}));
   b.add(rule(-120,267,-135,336,P.gold,15));b.add(rule(120,267,135,336,P.gold,15));
   c.add(t('権力の椅子',0,-260,49,P.gold));
   d.add(t('そこから立ち上がれるか',0,10,42,P.red));break;
  case 'exit':
   a.add(new Rect({x:-180,y:0,width:540,height:590,stroke:P.gold,lineWidth:9}));
   b.add(new Rect({x:-180,y:0,width:515,height:575,fill:'#1A3040',rotation:-14,opacity:.9}));
   c.add(rule(-180,300,430,300,P.gold,6));
   d.add(t('独裁を終わらせる制度',330,-105,48,P.paper));break;
  default:
   a.add(panel(0,0,1160,520));b.add(t(base,0,-180,47,P.paper));
   c.add(rule(-560,210,560,210,P.gold,6));d.add(t('原因 → 変化 → 結果',0,250,42,P.red));
 }
 return l;
}
function* subtitleFlow(cues:Cue[],label:Txt,duration:number):ThreadGenerator{
 let cursor=0;
 for(const cue of cues){
  const wait=Math.max(0,cue.start-cursor);
  if(wait>0) yield* waitFor(wait);
  label.text(cue.display);
  cursor=cue.start;
 }
 if(duration>cursor)yield* waitFor(duration-cursor);
 label.text('');
}
function* visualFlow(layers:Node[],duration:number,motif:string):ThreadGenerator{
 const starts=[0.03,0.20,0.38,0.60]; // causal stages; no background cut
 let cursor=0;
 for(let i=0;i<layers.length;i++){
  const at=duration*starts[i];
  yield* waitFor(Math.max(0,at-cursor)); cursor=at;
  const landing=(motif==='heli' && i===1);
  const councilEntrance=(motif==='council' && i===1);
  const documentSlide=(['documents','resignation','pipeline'].includes(motif) && i===0);
  if(landing){layers[i].x(-340);layers[i].y(-210);}
  if(councilEntrance)layers[i].x(-170);
  if(documentSlide)layers[i].y(-75);
  const anim=landing?Math.min(2.2,duration*.13):councilEntrance?1.3:.72;
  yield* all(layers[i].opacity(1,anim),layers[i].x(0,anim),layers[i].y(0,anim));cursor+=anim;
  if(i===2 && layers[0])layers[0].opacity(.79);
 }
 // After consequence appears, re-balance the staged information without an empty pan.
 const emphasisAt=duration*.80;
 if(emphasisAt>cursor){yield* waitFor(emphasisAt-cursor);cursor=emphasisAt;}
 yield* all(layers[0].opacity(.62,.45),layers[3].scale(1.045,.45));cursor+=.45;
 const endAt=duration*.91;
 if(endAt>cursor){yield* waitFor(endAt-cursor);cursor=endAt;}
 yield* all(layers[1].opacity(.75,.45),layers[2].opacity(.9,.45));cursor+=.45;
 yield* waitFor(Math.max(0,duration-cursor));
}
export function* playMeaningScene(view:View2D,scene:MeaningScene):ThreadGenerator{
 view.fill(P.bg);
 const contentLayer=new Node();
 const headingLayer=new Node();
 const subtitleBacking=new Node();
 const subtitleTextLayer=new Node();
 // Root add once. All later content is attached ONLY to contentLayer.
 // Known painter's order. Adding all roots together prevents unexpected overlap.
 view.add(contentLayer);view.add(headingLayer);view.add(subtitleBacking);view.add(subtitleTextLayer);
 contentLayer.add(new Rect({width:1920,height:1080,fill:P.bg}));
 contentLayer.add(new Rect({x:0,y:-380,width:1810,height:2,fill:P.line}));
 const visuals=generateVisuals(contentLayer,scene.motif,scene);
 headingLayer.add(t(scene.title,-18,-446,54,P.paper,700));
 headingLayer.add(t(scene.chapter==='prologue'?'PROLOGUE':scene.chapter==='epilogue'?'EPILOGUE':scene.chapter.toUpperCase(),-802,-509,25,P.gold,700));
 headingLayer.add(t(scene.id,818,-508,21,P.muted));
 const subtitleBg=new Rect({x:0,y:460,width:1920,height:160,fill:'#02060C',opacity:.90});
 const subtitleTxt=t('',0,458,42,P.paper,650);
 subtitleTxt.lineHeight(60);
 subtitleBacking.add(subtitleBg);subtitleTextLayer.add(subtitleTxt);
 yield* all(visualFlow(visuals,scene.duration,scene.motif),subtitleFlow(scene.cues,subtitleTxt,scene.duration));
}
