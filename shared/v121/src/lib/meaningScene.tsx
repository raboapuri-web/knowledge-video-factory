import '@fontsource/noto-sans-jp/400.css';
import '@fontsource/noto-sans-jp/700.css';
import {Circle, Line, Node, Rect, Txt, type View2D} from '@motion-canvas/2d';
import {all, waitFor, type ThreadGenerator} from '@motion-canvas/core';

/** V121 / poverty-and-brain: physical, causally staged motion.
 * The content is permanently below header and subtitle overlay nodes.
 * Each meaning scene holds ONE location and transforms its state six times.
 */
type Cue={text:string;display:string;start:number;end:number};
type Scene={id:string;chapter:string;motif:string;title:string;cues:Cue[];duration:number};
type World={root:Node;hero:Node;other:Node;objects:Node[];labels:Txt[];shroud:Rect;status:Txt;clock:Txt};
const K={bg:'#08111D',night:'#101F2D',wall:'#182D3C',floor:'#314957',
 paper:'#F2F1E9',muted:'#AEC0C8',red:'#D85B57',gold:'#E1B97C',
 cyan:'#69C0B7',blue:'#7297C5',ink:'#18242E',surface:'#233F50'};
const F='Noto Sans JP, Noto Sans CJK JP, sans-serif';
function txt(value:string,x:number,y:number,size=30,color=K.paper,weight=700){
 return new Txt({text:value,x,y,fontFamily:F,fontSize:size,fill:color,fontWeight:weight});
}
function box(n:Node,x:number,y:number,w:number,h:number,color:string,r=8){
 const q=new Rect({x,y,width:w,height:h,radius:r,fill:color});n.add(q);return q;
}
function disk(n:Node,x:number,y:number,r:number,color:string){
 const q=new Circle({x,y,width:2*r,height:2*r,fill:color});n.add(q);return q;
}
function stroke(n:Node,points:[number,number][],color=K.muted,w=6){
 const s=new Line({points,stroke:color,lineWidth:w,lineCap:'round',lineJoin:'round'});n.add(s);return s;
}
function human(parent:Node,x:number,y:number,s=1,color=K.paper){
 const n=new Node({x,y,scale:s});parent.add(n);
 disk(n,0,-90,29,color);box(n,0,5,82,134,color,22);
 stroke(n,[[-33,-35],[-66,66]],color,15);stroke(n,[[33,-35],[70,62]],color,15);
 stroke(n,[[-23,72],[-27,163]],color,17);stroke(n,[[22,72],[27,163]],color,17);
 return n;
}
function page(parent:Node,x:number,y:number,color=K.paper){
 const n=new Node({x,y});parent.add(n);
 box(n,0,0,130,160,color,7);for(let j=0;j<5;j++)box(n,-6,(-47+j*23),85,5,K.wall,2);
 return n;
}
function room(p:Node){
 box(p,0,-35,1920,930,K.night,0);
 box(p,-510,-20,590,480,K.wall,10);box(p,560,-50,350,270,'#294251',6);
 box(p,560,-50,326,246,'#0E1C29',4);stroke(p,[[-960,288],[960,288]],K.floor,13);
}
function office(p:Node){
 room(p);box(p,30,176,1040,33,'#7D7971',7);
 box(p,370,20,316,198,K.ink,9);box(p,370,7,275,151,'#233F4B',4);
 box(p,370,143,250,15,K.muted,3);box(p,-600,-200,220,90,'#314A58',6);
}
function arena(p:Node){
 box(p,0,-20,1920,930,'#102736',0);
 for(let j=0;j<5;j++){stroke(p,[[-950,-235+j*132],[950,-235+j*132]],'#496879',5);}
 for(let j=0;j<9;j++){box(p,-850+j*220,-325,150,17,j%2?'#213B4B':'#2B4A5B',0);}
 box(p,830,0,17,640,K.paper,0);
}
function rural(p:Node){
 box(p,0,-90,1920,880,'#152A31',0);box(p,0,185,1920,360,'#385345',0);
 for(let k=0;k<13;k++){const x=-870+k*145;stroke(p,[[x,240],[x+28,75]],'#83A270',8);}
 disk(p,700,-258,82,'#D5A66B');box(p,-620,-45,410,265,'#304852',6);
 box(p,-620,-120,355,120,'#1D303D',4);
}
function school(p:Node){
 room(p);
 for(const x of [-450,450]){
  box(p,x,155,550,27,'#6C7273',5);
  box(p,x-175,240,22,145,K.floor,0);box(p,x+175,240,22,145,K.floor,0);
 }
 box(p,0,0,4,650,'#465661',0);
}
function documentary(p:Node){
 box(p,0,-20,1920,930,'#14232D',0);
 box(p,0,5,1420,690,'#C5BEAF',10);box(p,5,-15,1340,625,'#E9E3D5',8);
 box(p,0,300,1450,36,'#6B625A',4);
}
function city(p:Node){
 box(p,0,0,1920,930,'#0F1D2B',0);
 for(let j=0;j<8;j++){
  const h=270+(j*73)%250,x=-830+j*235;
  box(p,x,270-h/2,210,h,j%3===0?'#344650':'#223543',1);
  for(let k=0;k<4;k++)for(let a=0;a<2;a++)
   box(p,x-55+a*110,120-h+k*80,30,38,((k+j+a)%3===0)?'#B49773':'#365367',2);
 }
 stroke(p,[[-950,305],[950,305]],'#576F79',8);
}
function setup(view:View2D,s:Scene):World{
 const contentLayer=new Node({});
 const headingLayer=new Node({});
 const subtitleBacking=new Node({});
 const subtitleTextLayer=new Node({});
 view.add(contentLayer);view.add(headingLayer);view.add(subtitleBacking);view.add(subtitleTextLayer);
 view.fill(K.bg);
 const m=s.motif;
 if(m==='race')arena(contentLayer);
 else if(['office','workflow','calendar','debt'].includes(m))office(contentLayer);
 else if(m==='farm')rural(contentLayer);
 else if(m==='school')school(contentLayer);
 else if(['book','study','judge','merit','brain','feedback','contrast','question','tunnel'].includes(m))documentary(contentLayer);
 else if(['bureau','forms','support'].includes(m)){
  room(contentLayer);box(contentLayer,110,200,1230,130,'#344C56',4);
  contentLayer.add(txt('相談・受付',520,-272,34,K.paper));
 }
 else if(m==='shopping'){
  room(contentLayer);
  for(let j=0;j<4;j++){
   box(contentLayer,-500+j*315,-145,255,360,'#243F4E',9);
   for(let k=0;k<3;k++)box(contentLayer,-500+j*315,-285+k*112,240,10,'#74828A',3);
  }
 }
 else if(m==='city')city(contentLayer);
 else room(contentLayer);
 const stage=new Node({});contentLayer.add(stage);
 // Titles and subtitles are immutable higher-level siblings.
 box(headingLayer,0,-472,1920,137,'#07101A',0);
 const part=s.chapter==='prologue'?'PROLOGUE':s.chapter==='epilogue'?'EPILOGUE':s.chapter.toUpperCase();
 headingLayer.add(txt(part,-794,-508,23,K.gold));
 headingLayer.add(txt(s.id,828,-508,23,K.muted));
 headingLayer.add(txt(s.title,0,-448,s.title.length>19?36:43,K.paper));
 box(subtitleBacking,0,455,1920,170,'#02060B',0).opacity(.91);
 const subtitle=txt('',0,456,41,K.paper);subtitle.lineHeight(58);
 subtitleTextLayer.add(subtitle);
 const hero=human(stage,-580,64,1.13,m==='race'?K.paper:K.cyan);
 const other=human(stage,560,64,1.13,K.paper);
 if(['book','study','brain','judge','feedback','question'].includes(m)){hero.opacity(0);other.opacity(0);}
 if(['office','workflow','calendar','debt','shopping','bureau','forms','support','portrait'].includes(m))other.opacity(.22);
 const shroud=new Rect({width:1920,height:785,fill:'#691B31',opacity:0});stage.add(shroud);
 const objects:Node[]=[];
 for(let i=0;i<6;i++){
  const node=new Node({opacity:0,x:660,y:-100,scale:.65});
  stage.add(node);objects.push(node);
 }
 const labels:Txt[]=[];
 const status=txt('',0,312,30,K.gold);stage.add(status);
 const clock=txt('',670,-285,33,K.paper);stage.add(clock);
 // Place all physical props before the first animation. Nothing is appended to view.
 buildProps(s,stage,objects);
 // Store subtitle as a private part of the higher-layer tree, never under contentLayer.
 (stage as unknown as {subtitleText:Txt}).subtitleText=subtitle;
 return {root:stage,hero,other,objects,labels,shroud,status,clock};
}
const actionCopy:Record<string,string[]>={
 race:['スタート','走り出す','少しずつ差が開く','差はさらに広がる','ゴールへ','同じ努力でも異なる'],
 office:['三つの指示','資料に取り組む','電話の時間','会議の時間','仕事が滞る','評価だけが残る'],
 contrast:['左の条件','右の条件','同じ人物','異なる負担','見える結果','見えない条件'],
 brain:['記憶','注意','計画','同時進行','容量に限界','他の仕事を圧迫'],
 feedback:['仕事','失敗','叱責','収入の不安','生活の負担','さらに困難になる'],
 question:['何が原因か','努力という説明','個人差','生活環境','社会の要求','問いを残す'],
 book:['ルポ','取材記録','見過ごした困難','病後の経験','解釈が変わる','見えない背景'],
 calendar:['予定を確認','用意を始める','忘れ物に気づく','やり直す','時間が過ぎる','約束に遅れる'],
 workflow:['目標を立てる','作業を整理','注意を保つ','別の仕事が入る','予定が崩れる','もう一度組み直す'],
 portrait:['外から見える結果','本人の努力','周囲の評価','誤解が生じる','支援の有無','条件を見る'],
 farm:['収穫前','現金が乏しい','認知課題','収穫が進む','現金が入る','収穫後の課題'],
 shopping:['商品の比較','残額を確認','家賃を思い出す','カードの請求','求人票を見る','心配が残る'],
 tunnel:['差し迫る危機','そこに集中','周辺が見えない','時間が進む','別の課題を逃す','狭まる選択'],
 debt:['明日の家賃','現金不足','借入を検討','今月を乗り切る','返済が増える','来月の負担'],
 school:['同じ教科書','静かな部屋','生活音のある部屋','同じ試験','異なる環境','結果だけでは測れない'],
 study:['研究を確認','実験の条件','比較を読む','限界を見る','仮説と区別','断定しない'],
 judge:['失敗が起こる','原因を考える','怠慢という評価','隠れた制約','解釈が変わる','対応が変わる'],
 merit:['努力を評価','成果の差','成功した側','失敗した側','人格への評価','公正なのか'],
 city:['学校','職場','銀行','行政','生活の各所','求められる能力'],
 bureau:['窓口を探す','制度を調べる','相談の時間','仕事の都合','必要な資料','届きにくい支援'],
 forms:['制度を知る','申請書を探す','説明を読む','資料をそろえる','期限を守る','大きな負担'],
 support:['複雑な手続き','困難を特定','担当者が支える','書類を簡潔に','暮らしを整える','選択肢を取り戻す'],
};
function buildProps(s:Scene,stage:Node,props:Node[]){
 const m=s.motif;
 for(let i=0;i<6;i++){
  const p=props[i];
  if(m==='race'){
   box(p,0,16,88,113,i%2?K.red:K.cyan,22);disk(p,0,-66,34,K.paper);
  }else if(['office','workflow','calendar','bureau','forms','study','book','feedback','debt'].includes(m)){
   if(m==='calendar'){
    box(p,0,0,130,141,K.paper,6);box(p,0,-55,130,26,i%2?K.red:K.cyan,2);
    for(let j=0;j<3;j++)for(let k=0;k<3;k++)disk(p,-40+j*40,-17+k*32,7,'#687A82');
   }else if(m==='debt'||m==='feedback'){
    box(p,0,5,135,110,i>=3?K.red:'#E9E2D4',7);
    box(p,0,-12,97,9,K.ink,1);box(p,0,17,70,7,K.ink,1);
   }else if(m==='book'){box(p,0,0,200,258,'#614A45',6);box(p,12,-2,155,207,'#E8DED0',3);}
   else page(p,0,0,i>=4?'#DFBDBB':K.paper);
  }else if(m==='farm'){
    stroke(p,[[0,100],[10,-20]],'#B5A476',12);
    for(let j=0;j<4;j++)disk(p,j%2?-20:30,-20-j*24,12,i>2?K.gold:'#5E8065');
  }else if(m==='shopping'){
    box(p,0,0,150,122,i>=3?'#D4B078':K.paper,14);
    box(p,0,30,145,20,'#90765A',3);
    disk(p,-20,-20,15,K.red);disk(p,25,-20,16,K.cyan);
  }else if(m==='school'){
    box(p,0,0,165,210,K.paper,6);box(p,-10,10,130,7,'#576875',2);
    box(p,-10,55,110,6,'#576875',2);
  }else if(m==='city'){
    box(p,0,0,160,195,i>=3?'#63717C':'#9EACAE',4);
    for(let k=0;k<3;k++)box(p,-35+k*35,-20,18,60,'#315464',2);
  }else if(m==='tunnel'){
    box(p,0,0,165,120,i>=3?'#D1B6B0':'#B1C7C3',15);
    box(p,0,0,105,11,K.ink,3);
  }else if(m==='judge'||m==='merit'||m==='contrast'){
    box(p,0,0,180,110,i%2?K.red:K.cyan,12);
    disk(p,0,-30,20,K.paper);
  }else if(m==='support'){
    box(p,0,0,165,142,i>2?K.cyan:K.paper,9);
    box(p,0,-28,115,9,K.ink,2);box(p,0,7,115,9,K.ink,2);
  }else if(m==='brain'){
    disk(p,0,0,67,i>=4?K.red:K.blue);
    for(let k=0;k<5;k++)disk(p,Math.cos(k*1.256)*36,Math.sin(k*1.256)*36,11,K.paper);
  }else{
    disk(p,0,0,81,i>=4?K.red:K.blue);disk(p,0,-15,29,K.paper);
  }
 }
}
function statePosition(m:string,i:number):[number,number]{
 if(m==='race')return [-750+i*250,120+(i%2)*55];
 if(m==='office')return [250+i*54,5-i*34];
 if(m==='farm')return [-500+i*185,65+(i%2)*25];
 if(m==='school')return [i%2?-465:465,-110+Math.floor(i/2)*90];
 if(m==='bureau'||m==='forms')return [-320+i*120,90-i*22];
 if(m==='city')return [-660+i*260,40];
 if(m==='shopping')return [-380+i*160,-40+(i%2)*90];
 if(m==='feedback'||m==='debt')return [-360+i*153,-45+Math.floor(i/3)*138];
 if(m==='calendar')return [-355+i*145,15];
 if(m==='book')return [-485+i*177,2];
 if(m==='tunnel')return [-520+i*215,-15+(i%2)*80];
 if(m==='contrast'||m==='judge'||m==='merit')return [i%2?-445:445,-120+Math.floor(i/2)*139];
 if(m==='brain')return [-395+i*162,-30+(i%2)*80];
 if(m==='support')return [-405+i*165,12];
 return [-360+i*160,-20+(i%2)*80];
}
function* changeState(w:World,s:Scene,i:number,seconds:number):ThreadGenerator{
 const m=s.motif,now=w.objects[i],prior=i?w.objects[i-1]:null;
 const [x,y]=statePosition(m,i);
 now.x(i%2?950:-950);now.y(y-80);now.scale(.4);
 const speed=Math.min(.75,Math.max(.24,seconds*.21));
 const actions:ThreadGenerator[]=[
  now.x(x,speed),now.y(y,speed),now.opacity(1,speed),now.scale(m==='book'?.86:m==='farm'?.94:.8,speed)
 ];
 w.status.text((actionCopy[m]??actionCopy.question)[i]);
 if(prior && !['farm','city','school','forms','office','feedback','debt','bureau','workflow'].includes(m)){
  actions.push(prior.opacity(m==='race'?.55:.06,speed),prior.scale(.48,speed));
 }
 if(m==='race'){
  // Physical rivalry: the two runners do not share a speed.
  actions.push(w.hero.x(-730+i*240,speed),w.other.x(-730+i*270,speed));
  w.hero.y(-70);w.other.y(105);
  if(i===5)actions.push(w.shroud.opacity(.08,speed));
 }else if(m==='office'||m==='workflow'){
  // The desk fills while the worker remains physically occupied.
  actions.push(w.hero.x(-590+i*18,speed));
  if(i===2)actions.push(w.other.opacity(1,speed),w.other.x(410,speed));
  if(i>=4)actions.push(w.hero.y(90+i*7,speed),w.shroud.opacity(.1,speed));
 }else if(m==='farm'){
  // Crop growth, harvest and economic condition change without cutting locations.
  if(i===3)actions.push(w.hero.x(-300,speed),w.other.x(400,speed));
  if(i>=4)actions.push(w.shroud.opacity(0,speed));
 }else if(m==='calendar'||m==='forms'||m==='bureau'){
  actions.push(w.hero.x(-620+i*65,speed));
  if(i>=3)actions.push(w.other.opacity(1,speed),w.other.x(650-i*40,speed));
  if(i===5)actions.push(w.shroud.opacity(.10,speed));
 }else if(m==='shopping'){
  actions.push(w.hero.x(-650+i*57,speed));
  if(i>2)actions.push(w.shroud.opacity(.07,speed));
 }else if(m==='tunnel'){
  if(i>2)actions.push(w.shroud.opacity(.03*i,speed),w.hero.scale(1-i*.047,speed));
 }else if(m==='debt'||m==='feedback'){
  actions.push(w.hero.x(-580+i*24,speed),w.shroud.opacity(.022*i,speed));
 }else if(m==='school'){
  if(i>=3)actions.push(w.shroud.opacity(.05,speed));
  actions.push(w.hero.x(-460,speed),w.other.x(460,speed));
 }else if(m==='contrast'||m==='merit'||m==='judge'){
  actions.push(w.hero.opacity(i%2===0?.95:.37,speed),w.other.opacity(i%2===0?.37:.95,speed));
  w.hero.x(-510);w.other.x(510);
 }else if(m==='support'){
  actions.push(w.hero.x(-480+i*28,speed));
  if(i>=2)actions.push(w.other.opacity(.94,speed),w.other.x(350-i*35,speed));
 }else if(m==='portrait'){
  actions.push(w.hero.x(-510+i*15,speed),w.hero.scale(i>=3?1.03:1.15,speed));
 }else if(m==='city'){
  actions.push(w.hero.x(-680+i*175,speed));
 }
 yield* all(...actions);
 const roomTime=Math.max(0,seconds-speed);
 if(roomTime>1){
  const micro=Math.min(.43,roomTime*.18);
  if(m==='race')yield* all(w.hero.x(w.hero.x()+32,micro),w.other.x(w.other.x()+38,micro));
  else if(['office','calendar','workflow','bureau','forms','debt'].includes(m))yield* now.rotation(i%2?3:-3,micro);
  else if(m==='tunnel')yield* now.scale(.9,micro);
  else if(m==='book')yield* now.rotation(i%2?-4:4,micro);
  else yield* now.y(y-14,micro);
  if(roomTime>micro)yield* waitFor(roomTime-micro);
 }else if(roomTime>0)yield* waitFor(roomTime);
}
function* visual(w:World,s:Scene):ThreadGenerator{
 const step=s.duration/6;
 for(let i=0;i<6;i++)yield* changeState(w,s,i,step);
}
function* captions(cues:Cue[],element:Txt,duration:number):ThreadGenerator{
 let elapsed=0;
 for(const cue of cues){
  if(cue.start>elapsed)yield* waitFor(cue.start-elapsed);
  element.text(cue.display);
  elapsed=cue.start;
 }
 if(duration>elapsed)yield* waitFor(duration-elapsed);
 element.text('');
}
export function* playMeaningScene(view:View2D,scene:Scene):ThreadGenerator{
 const w=setup(view,scene);
 const caption=(w.root as unknown as {subtitleText:Txt}).subtitleText;
 yield* all(visual(w,scene),captions(scene.cues,caption,scene.duration));
}
