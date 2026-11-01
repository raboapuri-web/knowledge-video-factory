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

/* V141 editorial diversity pass: distinct visual grammars rather than recycled A/B cards. */
function beforeAfter(p:Node,c:Design,labels:string[]):Layout{
 const a:Node[]=[];
 const top=N(p,-9,-134);a.push(top);
 R(top,0,0,1510,175,c.panel,14);R(top,-739,0,15,145,c.secondary,2);
 T(top,labels[0]||'以前',0,0,txtSize(labels[0]||'',49),c.ink);
 const bottom=N(p,9,142);a.push(bottom);
 R(bottom,0,0,1510,175,c.panel2,14);R(bottom,739,0,15,145,c.key,2);
 T(bottom,labels[1]||'以後',0,0,txtSize(labels[1]||'',49),c.ink);
 T(p,'↓',0,3,68,c.key,false);
 if(labels[2])small(p,labels[2],0,280,c);
 return {parts:a,accent:a,mode:'before-after'};
}
function dilemmaDiagram(p:Node,c:Design,labels:string[]):Layout{
 const a:Node[]=[];
 const left=N(p,-440,-14);a.push(left);
 R(left,0,0,655,320,c.panel,12);
 T(left,labels[0]||'一方',0,-15,txtSize(labels[0]||'',51),c.ink);
 const right=N(p,440,-14);a.push(right);
 R(right,0,0,655,320,c.panel2,12);
 T(right,labels[1]||'他方',0,-15,txtSize(labels[1]||'',51),c.ink);
 O(p,0,-16,160,c.paper);
 T(p,'≠',0,-19,87,c.key);
 if(labels[2])small(p,labels[2],0,244,c);
 return {parts:a,accent:a,mode:'logical-separation'};
}
function crossing(p:Node,c:Design,labels:string[]):Layout{
 const a:Node[]=[];
 L(p,[[-640,-180],[640,180]],c.key,8);
 L(p,[[-640,180],[640,-180]],c.secondary,8);
 for(let i=0;i<2;i++){
  const x=i===0?-535:535;
  const n=N(p,x,i===0?-115:115);a.push(n);
  R(n,0,0,420,165,i===0?c.panel:c.panel2,12);
  T(n,labels[i]||'視点',0,0,txtSize(labels[i]||'',42),c.ink);
 }
 if(labels[2])T(p,labels[2],0,282,28,c.muted);
 return {parts:a,accent:a,mode:'crossing'};
}
function analogyVenn(p:Node,c:Design,labels:string[]):Layout{
 const a:Node[]=[];
 const left=N(p,-235,-7);a.push(left);
 O(left,0,0,455,c.secondary);
 const right=N(p,235,-7);a.push(right);
 O(right,0,0,455,c.panel2);
 O(p,0,-7,194,c.key);
 T(left,labels[0]||'自然',-50,0,txtSize(labels[0]||'',39),c.paper);
 T(right,labels[1]||'社会',50,0,txtSize(labels[1]||'',39),c.ink);
 T(p,'たとえ',0,-10,29,c.paper);
 if(labels[2])small(p,labels[2],0,281,c);
 return {parts:a,accent:a,mode:'venn-analogy'};
}
function scaleAxis(p:Node,c:Design,labels:string[]):Layout{
 const a:Node[]=[];
 const top=N(p,0,-95);a.push(top);
 T(top,labels[0]||'比較',0,0,txtSize(labels[0]||'',103),c.key);
 const lineY=88;
 L(p,[[-715,lineY],[715,lineY]],c.hair,5);
 for(let i=0;i<9;i++)L(p,[[-700+i*175,lineY-18],[-700+i*175,lineY+20]],c.secondary,3);
 T(p,labels[1]||'尺度',0,182,39,c.ink);
 if(labels[2])small(p,labels[2],0,262,c);
 return {parts:a,accent:a,mode:'scale-axis'};
}
function citeHeadline(p:Node,c:Design,labels:string[]):Layout{
 const a:Node[]=[];
 const big=N(p,0,-70);a.push(big);
 T(big,labels[0]||'報道',0,0,txtSize(labels[0]||'',125),c.key);
 L(p,[[-700,24],[700,24]],c.hair,3);
 if(labels[1])T(p,labels[1],0,132,txtSize(labels[1],51),c.ink);
 if(labels[2])T(p,labels[2],0,222,30,c.muted);
 return {parts:a,accent:a,mode:'news-headline'};
}
function framedTerms(p:Node,c:Design,labels:string[]):Layout{
 const a:Node[]=[];
 labels.slice(0,4).forEach((v,i)=>{
  const x=(i-(Math.min(labels.length,4)-1)/2)*390;
  const n=N(p,x,-15);a.push(n);
  T(n,'0'+(i+1),0,-137,34,c.key,false);
  T(n,v,0,5,txtSize(v,54),c.ink);
  L(n,[[-115,79],[115,79]],i%2?c.secondary:c.key,6);
 });
 return {parts:a,accent:a,mode:'editorial-terms'};
}
function causalTree(p:Node,c:Design,labels:string[]):Layout{
 const a:Node[]=[];
 const top=labels.slice(0,2);
 top.forEach((v,i)=>{
  const n=panel(p,i===0?-395:395,-150,660,158,c,v,i);a.push(n);
  L(p,[[(i===0?-395:395),-65],[0,28]],c.hair,4);
 });
 const middle=panel(p,0,142,900,185,c,labels[2]||'結果',1);a.push(middle);
 if(labels[3])small(p,labels[3],0,280,c);
 return {parts:a,accent:a,mode:'convergence'};
}
function stairMechanism(p:Node,c:Design,labels:string[]):Layout{
 const a:Node[]=[];const vals=labels.slice(0,4),w=1300/vals.length;
 vals.forEach((v,i)=>{
  const x=-650+(i+.5)*w,y=145-i*78;
  const n=N(p,x,y);a.push(n);
  R(n,0,0,w-25,175,i%2?c.panel2:c.panel,10);
  T(n,String(i+1).padStart(2,'0'),0,-110,32,c.key,false);
  T(n,v,0,0,txtSize(v,34),c.ink);
  if(i<vals.length-1)L(p,[[x+w/2,y-15],[x+w/2+15,y-65]],c.secondary,3);
 });
 scope(p,c,'条件から結果へ、段階的に変化する仕組み');
 return {parts:a,accent:a,mode:'stair-steps'};
}
function cascadeDiagram(p:Node,c:Design,labels:string[]):Layout{
 const a:Node[]=[];const vals=labels.slice(0,4);
 vals.forEach((v,i)=>{
  const x=-260+i*140,y=-205+i*125;
  const n=N(p,x,y);a.push(n);
  R(n,0,0,900,102,i===vals.length-1?c.key:c.panel,8);
  T(n,v,0,0,txtSize(v,40),i===vals.length-1?c.paper:c.ink);
  if(i<vals.length-1)L(p,[[x+430,y+58],[x+430,y+70]],c.secondary,4);
 });
 return {parts:a,accent:a,mode:'cascade'};
}
function gradientSteps(p:Node,c:Design,labels:string[]):Layout{
 const vals=labels.slice(0,3);const a:Node[]=[];
 for(let i=0;i<5;i++){
  const n=N(p,-600+i*300,0);a.push(n);
  R(n,0,0,268,140+i*60,[c.panel,c.panel2,c.secondary,c.key,RED][i],9);
  T(n,String(i+1),0,-90,40,c.ink,false);
 }
 T(p,vals[0]||'弱い',-605,252,31,c.ink);
 T(p,vals[2]||'強い',600,252,31,c.key);
 if(vals[1])T(p,vals[1],0,-263,39,c.muted);
 return {parts:a,accent:a,mode:'gradient'};
}
function studyMethod(p:Node,c:Design,labels:string[]):Layout{
 const a:Node[]=[];
 labels.slice(0,4).forEach((v,i)=>{
  const y=-180+i*128;
  const g=N(p,0,y);a.push(g);
  O(g,-615,0,76,i===0?c.key:c.secondary);
  T(g,String(i+1),-615,0,35,c.paper,false);
  R(g,65,0,1220,104,c.panel,9);
  T(g,v,65,0,txtSize(v,37),c.ink);
 });
 return {parts:a,accent:a,mode:'research-procedure'};
}
function xrayDiagram(p:Node,c:Design,labels:string[]):Layout{
 const a:Node[]=[];
 const g=N(p,0,-122);a.push(g);
 R(g,0,0,1450,170,c.panel,10);
 T(g,labels[0]||'見える',0,0,47,c.ink);
 L(p,[[-730,0],[730,0]],c.key,7);
 const lower=N(p,0,141);a.push(lower);
 R(lower,0,0,1450,208,c.panel2,10);
 T(lower,(labels[1]||'内部')+'　／　'+(labels[2]||'条件'),0,0,40,c.ink);
 if(labels[3])small(p,labels[3],0,284,c);
 return {parts:a,accent:a,mode:'xray-layers'};
}
function lifecycle(p:Node,c:Design,labels:string[]):Layout{
 const vals=labels.slice(0,4),a:Node[]=[];const rad=288;
 vals.forEach((v,i)=>{
  const theta=(i/vals.length)*2*Math.PI-Math.PI/2;
  const x=Math.cos(theta)*rad,y=Math.sin(theta)*rad;
  const n=N(p,x,y);a.push(n);
  O(n,0,0,225,i===0?c.secondary:i===vals.length-1?c.key:c.panel);
  T(n,v,0,0,txtSize(v,32),i===vals.length-1?c.paper:c.ink);
 });
 O(p,0,0,116,c.paper);T(p,'循環',0,0,40,c.key);
 scope(p,c,'時間と状態の移り変わり');
 return {parts:a,accent:a,mode:'lifecycle'};
}
function pathDiagram(p:Node,c:Design,labels:string[]):Layout{
 const vals=labels.slice(0,3),a:Node[]=[];
 L(p,[[-645,-80],[650,-80]],c.secondary,7);
 L(p,[[-645,145],[650,145]],c.hair,4);
 vals.forEach((v,i)=>{
  const x=-610+i*610,y=-80;
  const n=N(p,x,y);a.push(n);
  O(n,0,0,77,i===2?c.key:c.secondary);
  T(p,v,x,28,txtSize(v,37),c.ink);
 });
 T(p,'移動／選択の経路',0,239,30,c.muted,false);
 return {parts:a,accent:a,mode:'route-logic'};
}
function typographicQuote(p:Node,c:Design,s:Spec):Layout{
 const a:Node[]=[];
 const quote=N(p,0,-67);a.push(quote);
 T(quote,'「',-724,-45,147,c.key);
 T(quote,s.labels[0]||s.headline,0,0,txtSize(s.labels[0]||s.headline,96),c.ink);
 T(quote,'」',730,28,147,c.key);
 L(p,[[-650,116],[650,116]],c.hair,2);
 if(s.labels[1])T(p,s.labels[1],0,202,37,c.muted);
 return {parts:a,accent:a,mode:'quotation'};
}
function dividerSlide(p:Node,c:Design,s:Spec):Layout{
 const a:Node[]=[];
 const n=N(p,0,-47);a.push(n);
 T(n,s.headline,0,0,txtSize(s.headline,88),c.ink);
 L(p,[[-760,92],[760,92]],c.key,6);
 if(s.labels[0])T(p,s.labels[0],0,200,36,c.muted);
 return {parts:a,accent:a,mode:'chapter-bridge'};
}
function questionSlide(p:Node,c:Design,s:Spec):Layout{
 const n=N(p,0,2);T(n,'？',-550,13,285,c.key);
 T(n,s.labels[0]||'もし',170,-80,75,c.ink);
 T(n,s.labels[1]||s.headline,170,86,txtSize(s.labels[1]||'',52),c.ink);
 return {parts:[n],accent:[n],mode:'hypothesis'};
}
function concludingSlide(p:Node,c:Design,s:Spec):Layout{
 const n=N(p,0,-23);
 T(n,'考える夜',0,-165,48,c.key);
 T(n,s.headline,0,-5,txtSize(s.headline,80),c.ink);
 L(n,[[-710,92],[710,92]],c.hair,3);
 T(n,'FIRE ECOLOGY   ×   SOCIAL PSYCHOLOGY',0,174,24,c.muted,false);
 return {parts:[n],accent:[n],mode:'finale'};
}

function show(p:Node,c:Design,s:Spec):Layout{
 const v=s.labels;
 if(s.layout==='ratio')return ratio(p,c,v);
 if(s.layout==='bar2')return bar2(p,c,v);
 if(s.layout==='metric2')return metric(p,c,v);
 if(s.layout==='timeline')return timeline(p,c,v);
 if(s.layout==='layer')return layering(p,c,v);
 if(s.layout==='study')return study(p,c,v);
 if(s.layout==='locator')return locator(p,c,v);
 if(s.layout==='cycle')return loop(p,c,v);
 if(s.layout==='network')return network(p,c,v);
 if(s.layout==='filter')return filter(p,c,v);
 if(s.layout==='duel'){
  const n=two(p,c,v);return {parts:n,accent:n,mode:'opposition'};
 }
 if(s.layout==='contrast')return beforeAfter(p,c,v);
 if(s.layout==='dilemma')return dilemmaDiagram(p,c,v);
 if(s.layout==='difference')return dilemmaDiagram(p,c,v);
 if(s.layout==='inversion')return crossing(p,c,v);
 if(s.layout==='analogy')return analogyVenn(p,c,v);
 if(s.layout==='matrix'||s.layout==='cards'){
  const n=cards(p,c,v);return {parts:n,accent:n,mode:'matrix'};
 }
 if(s.layout==='competition'||s.layout==='framing') {
  const n=framedTerms(p,c,v);return {parts:n,accent:n,mode:'editorial-terms'};
 }
 if(s.layout==='mechanism')return stairMechanism(p,c,v);
 if(s.layout==='causal')return causalTree(p,c,v);
 if(s.layout==='cascade')return cascadeDiagram(p,c,v);
 if(s.layout==='gradient')return gradientSteps(p,c,v);
 if(s.layout==='method')return studyMethod(p,c,v);
 if(s.layout==='xray')return xrayDiagram(p,c,v);
 if(s.layout==='lifecycle')return lifecycle(p,c,v);
 if(s.layout==='path')return pathDiagram(p,c,v);
 if(s.layout==='quote')return typographicQuote(p,c,s);
 if(s.layout==='divider')return dividerSlide(p,c,s);
 if(s.layout==='hypothesis')return questionSlide(p,c,s);
 if(s.layout==='outro')return concludingSlide(p,c,s);
 if(s.layout==='thesis'){
   const n=analyticalText(p,c,v,s.headline);return {parts:n,accent:n,mode:'typographic'};
 }
 if(s.layout==='scale')return scaleAxis(p,c,v);
 if(s.layout==='headline')return citeHeadline(p,c,v);
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
 }else if(['before-after','logical-separation','crossing','venn-analogy'].includes(layout.mode)){
  const x=n.x();n.x(x+(effect%2?115:-115));yield* n.x(x,seconds);
 }else if(['research-procedure','stair-steps','cascade','xray-layers','route-logic'].includes(layout.mode)){
  const y=n.y();n.y(y+(effect%2?74:-74));yield* n.y(y,seconds);
 }else if(['scale-axis','news-headline','quotation','chapter-bridge','finale','hypothesis','editorial-terms'].includes(layout.mode)){
  n.scale(.90);yield* n.scale(1,seconds);
 }else if(['convergence','gradient','lifecycle'].includes(layout.mode)){
  const x=n.x();n.x(x+45);yield* n.x(x,seconds);
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
