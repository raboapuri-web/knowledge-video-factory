import {playPhysicalScene} from './physicalDirector';
import '@fontsource/noto-sans-jp/400.css';
import '@fontsource/noto-sans-jp/700.css';
import {Circle, Line, Node, Rect, Txt, type View2D} from '@motion-canvas/2d';
import {all, waitFor, type ThreadGenerator} from '@motion-canvas/core';

/** V123 / libertarian Grafton and commons: physical, causally staged motion.
 * The content is permanently below header and subtitle overlay nodes.
 * Each meaning scene holds ONE location and transforms its state six times.
 */
type Cue={text:string;display:string;start:number;end:number};
type Scene={id:string;chapter:string;motif:string;title:string;direction?:string;cues:Cue[];duration:number};
type World={root:Node;hero:Node;other:Node;objects:Node[];labels:Txt[];shroud:Rect;status:Txt;clock:Txt;caption:Txt};
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

/** V123: Grafton 2004-2017. Diegetic environments; persistent props, never card cascade. */
const wildlife = new Set(['porch','bear','dispute','forest','garbage','donut','neighbor','wildlife','firecracker','incident','border','funding','nottrial']);
const civic = new Set(['townhall','meeting','voices','budget','split','scouts','rules','lawsuit','accounting','ledger','counter']);
const infrastructure = new Set(['road','police','fire','library','publicgood','free','insurance','tokyo','dawn']);
const campMotifs = new Set(['truck','camp','map']);
const abstraction = new Set(['portrait','question','philosophy','history','paradox','market','window','hobbes','ostrom','counter','scale','tax','receipt','office','book']);
const townMotifs = new Set([...wildlife,...civic,...infrastructure,...campMotifs,...abstraction]);
const showBear=new Set(['porch','bear','dispute','garbage','donut','neighbor','wildlife','firecracker','incident','border']);
function tree(parent:Node,x:number,y:number,z=1){
 const n=new Node({x,y,scale:z});parent.add(n);
 stroke(n,[[0,180],[0,-42]],'#4E4736',18);
 disk(n,-42,-80,70,'#183F37');disk(n,34,-104,92,'#285143');disk(n,74,-30,69,'#1F483B');
}
function outdoors(p:Node,nightMode=false){
 box(p,0,-15,1920,930,nightMode?'#101C29':'#284957',0);
 disk(p,660,-288,80,nightMode?'#B0B9B4':'#D7B07C');
 for(let j=0;j<8;j++)tree(p,-900+j*265,-90-(j%3)*28,.60+(j%2)*.17);
 box(p,0,259,1920,292,nightMode?'#172D30':'#2A453A',0);
}
function cottage(p:Node){
 outdoors(p,true);
 box(p,-448,72,650,360,'#59645C',6);
 const roof=new Line({points:[[-808,-109],[-449,-349],[-92,-109]],stroke:'#263840',lineWidth:29,lineCap:'round',lineJoin:'round'});p.add(roof);
 box(p,-471,30,170,170,'#B1A38D',4);box(p,-470,30,140,140,'#D6B781',2);
 box(p,-226,144,105,213,'#364953',3);box(p,-222,199,10,10,'#DFC38B',5);
}
function ruralStreet(p:Node){
 outdoors(p,false);
 box(p,0,330,1920,230,'#424C50',0);
 stroke(p,[[-960,334],[960,334]],'#B9B39C',10);
 for(let i=0;i<4;i++)box(p,-700+i*480,336,155,9,'#D5C397',0);
 for(const x of [-650,450]){box(p,x,79,320,270,'#61716D',4);stroke(p,[[x-188,-65],[x,-193],[x+188,-65]],'#2B3F46',21);}
}
function publicHall(p:Node){
 box(p,0,-40,1920,940,'#26323B',0);
 for(let j=0;j<6;j++)box(p,-760+j*295,-190,186,350,'#364551',4);
 box(p,0,250,1920,320,'#4D4A43',0);
 box(p,0,80,940,65,'#786F5D',6);
 box(p,-500,-245,120,20,'#A59474',2);
 box(p,540,-245,120,20,'#A59474',2);
}
function govtDesk(p:Node){
 box(p,0,-20,1920,940,'#202E38',0);
 box(p,-330,-40,1060,625,'#DED6C8',8);
 box(p,-318,-45,1000,565,'#EAE4D8',4);
 box(p,0,285,1920,145,'#504C47',0);
}
function stageBackground(p:Node,m:string){
 if(wildlife.has(m)){cottage(p);if(m==='forest'||m==='wildlife'||m==='border'||m==='funding'||m==='nottrial')outdoors(p,m==='forest');}
 else if(civic.has(m))publicHall(p);
 else if(infrastructure.has(m))ruralStreet(p);
 else if(campMotifs.has(m))outdoors(p,false);
 else if(m==='office')office(p);
 else if(m==='book'||m==='receipt'||m==='tax'||m==='history'||m==='philosophy'||m==='hobbes'||m==='ostrom'||m==='question'||m==='market'||m==='counter'||m==='scale'||m==='paradox'||m==='portrait'||m==='window')documentary(p);
 else govtDesk(p);
}
function bearProp(n:Node,c='#222528'){
 box(n,0,25,236,113,c,66);
 disk(n,-86,-10,62,c);disk(n,-115,-59,23,c);disk(n,-56,-61,23,c);
 box(n,-125,12,58,48,'#45423A',26);disk(n,-108,-13,5,'#E0BE8D');
 for(let x of [-70,77]){box(n,x,89,32,75,c,15);}
}
function binProp(n:Node){
 box(n,0,0,106,156,'#476570',8);box(n,0,-86,122,25,'#273A47',4);
 for(let k=-1;k<=1;k++)box(n,k*25,10,5,94,'#6F8890',3);
}
function houseProp(n:Node){
 box(n,0,40,180,150,'#A7A098',5);
 stroke(n,[[-104,-40],[0,-118],[104,-40]],'#3D4D4D',17);
 box(n,45,65,55,100,'#344A55',3);box(n,-38,17,50,49,'#E9C28B',3);
}
function carProp(n:Node,policeMode=false){
 box(n,0,30,240,77,policeMode?'#B7C0C0':'#A37C57',18);
 box(n,-4,-20,130,73,policeMode?'#CED4D1':'#8EAAA6',14);
 for(const x of [-76,78])disk(n,x,69,23,'#182733');
 if(policeMode){box(n,0,-65,74,14,'#C45457',4);box(n,0,30,44,20,'#253A4E',0);}
}
function roadProp(n:Node){box(n,0,0,230,108,'#48565B',6);for(let i=0;i<2;i++)stroke(n,[[-99+i*195,0],[-55+i*195,-20]],'#D1BA86',7);}
function lecternProp(n:Node){box(n,0,14,210,116,'#756B5D',7);box(n,0,-51,235,18,'#A4937D',4);box(n,0,105,45,85,'#4A443F',2);}
function lampProp(n:Node){stroke(n,[[0,120],[0,-128],[57,-128],[57,-108]],'#586F74',18);disk(n,58,-100,45,'#EBC882');}
function notebookProp(n:Node){box(n,0,0,172,218,'#E7DECD',7);box(n,-70,0,14,210,'#BF604F',3);for(let y=-65;y<82;y+=31)box(n,20,y,105,7,'#53636B',2);}
function ledgerProp(n:Node){box(n,0,0,230,195,'#E1DACA',5);for(let k=0;k<4;k++)box(n,0,-65+k*43,173,7,k>=2?'#B76D68':'#66727A',2);}
function cityOutline(n:Node){
 for(let i=0;i<4;i++){const h=100+i*24;box(n,-180+i*120,50-h/2,92,h,i%2?'#70858A':'#4C6670',4);}
 stroke(n,[[-270,111],[250,111]],'#D1C8B0',8);
}
function buildTownProps(s:Scene,props:Node[]){
 const m=s.motif;
 for(let i=0;i<6;i++){
  const q=props[i],mode=i%3;
  if(m==='forest'){
   if(i===0||i===4)tree(q,0,0,.50+(i===4?.12:0));
   else if(i===1)houseProp(q);
   else if(i===2)carProp(q);
   else if(i===3)lampProp(q);
   else notebookProp(q);
  }else if(showBear.has(m)){
   if(i===0)bearProp(q);
   else if(i===1)binProp(q);
   else if(i===2)houseProp(q);
   else if(i===3){box(q,0,0,115,53,'#9A744B',17);disk(q,0,-5,26,'#D7A967');}
   else if(i===4)bearProp(q,'#384042');
   else {stroke(q,[[-56,50],[0,-75],[52,52]],'#CC956C',12);}
  }else if(['road','police','fire','library','publicgood','free','insurance','tokyo','dawn'].includes(m)){
   if(i===0)houseProp(q);else if(i===1)carProp(q,m==='police'||m==='fire');
   else if(i===2)lampProp(q);else if(i===3)roadProp(q);
   else if(i===4)notebookProp(q);else cityOutline(q);
  }else if(['truck','camp','map'].includes(m)){
   if(i===0)carProp(q);else if(i===1)houseProp(q);else if(i===2)tree(q,0,0,.7);
   else if(i===3)ledgerProp(q);else if(i===4)lecternProp(q);else binProp(q);
  }else if(civic.has(m)){
   if(i===0||i===1)lecternProp(q);else if(i===2)ledgerProp(q);
   else if(i===3)notebookProp(q);else if(i===4)houseProp(q);else carProp(q);
  }else{
   if(i===0)notebookProp(q);else if(i===1)ledgerProp(q);
   else if(i===2)houseProp(q);else if(i===3)lampProp(q);else if(i===4)binProp(q);else cityOutline(q);
  }
 }
}

/** Six physical beats share a persistent scene. The precise movement route differs
 * by scene identity AND story direction, rather than a universal six-object reveal.
 * All actors and equipment are pre-staged and move in the same continuous space.
 */
function* directedMotion(w:World,s:Scene,i:number,seconds:number):ThreadGenerator{
 const P=w.objects,H=w.hero,O=w.other,m=s.motif,d=s.direction??'';
 const chapter=s.id.charCodeAt(0),index=Number(s.id.slice(1))||0;
 const seed=chapter*13+index*29,phase=i/5;
 const t=Math.min(.9,Math.max(.30,seconds*.29));
 const drift=((seed%7)-3)*19,tilt=((seed%9)-4)*1.5;
 const ops:ThreadGenerator[]=[];
 if(showBear.has(m)||m==='forest'||m==='wildlife'){
  if(showBear.has(m)){
   const xs=[-710,-545,-360,-75,215,495],ys=[148,153,134,146,152,143];
   const pace=/追い|逃げ|警戒/.test(d) ? 1.16 : (/餌|ドーナツ/.test(d) ? 0.72 : 1);
   ops.push(P[0].x(xs[i]*pace+drift,t),P[0].y(ys[i]+Math.sin(i+seed)*9,t),P[0].rotation(tilt+(i%2?3:-2),t));
   if(/ゴミ|餌|容器|ドーナツ/.test(d))ops.push(P[1].rotation([0,-3,14,-9,3,0][i],t));
   if(/境界|隣家|危険|襲われ/.test(d))ops.push(H.x(-610+phase*235,t),H.rotation(i>=3?-10:4,t));
   if(/事故|襲撃/.test(d) && i===4)ops.push(w.shroud.opacity(.12,t));
  }else{
   ops.push(H.x(-660+phase*480+drift,t),H.rotation(i%2?4:-4,t));
   ops.push(P[2].scale(.55+phase*.19,t));
  }
 }else if(civic.has(m)||/集会|住民|議会|選挙/.test(d)){
  const switcher=seed%3;
  ops.push(H.x(-630+phase*(180+switcher*42),t),O.x(645-phase*(135+switcher*39),t));
  ops.push(P[0].rotation(tilt+(i%2?8:-5),t));
  ops.push(P[2].x(-70+phase*(80+drift),t));
  if(/対立|反対|混乱|抗議/.test(d))ops.push(H.rotation(i%2?-11:6,t),O.rotation(i%2?8:-9,t));
  if(/予算|帳簿/.test(d))ops.push(P[2].rotation(-6+i*2,t));
 }else if(infrastructure.has(m)||/道路|消防|橋/.test(d)){
  const speed= /通勤|通学|走/.test(d)?1.2:.85;
  ops.push(P[1].x(-710+i*(255*speed)+drift,t),P[1].y(168+Math.sin(i+seed)*6,t));
  ops.push(H.x(-660+phase*390+drift,t));
  if(/補修|ひび|穴|修理/.test(d))ops.push(P[3].rotation(tilt+(i>=3?9:-5),t));
  if(/消防|火災|延焼/.test(d))ops.push(O.x(600-i*47,t),O.rotation(i%2?7:-5,t));
 }else if(campMotifs.has(m)||/移住|引っ越し/.test(d)){
  ops.push(P[0].x(-735+i*(245+(seed%4)*8),t),P[0].y(170,t));
  ops.push(H.x(-740+phase*410,t));
  ops.push(P[3].rotation(tilt+phase*9,t));
 }else{
  const isLedger=/税|予算|明細|寄付|費用|負担/.test(d);
  ops.push(P[0].rotation(tilt+(i%2?-8:6),t),P[0].x(-380+i*(90+seed%14),t));
  ops.push(P[1].x(300-i*(65+seed%9),t),P[1].rotation(-tilt+(i%3)*3,t));
  if(isLedger)ops.push(H.rotation(i%2?-5:5,t));
  else ops.push(H.x(-600+phase*250+drift,t));
  if(/問い|どちら|判断|問題/.test(d)&&i>=4)ops.push(w.shroud.opacity(.065,t));
 }
 yield* all(...ops);
 if(seconds>t)yield* waitFor(seconds-t);
}

function* townMove(w:World,s:Scene,i:number,seconds:number):ThreadGenerator{
 const t=Math.min(.90,Math.max(.40,seconds*.31));
 const P=w.objects,H=w.hero,O=w.other;
 const ops:ThreadGenerator[]=[];
 const m=s.motif;
 const n=parseInt(s.id.slice(1),10)||0;
 const dir=(n%2?1:-1);
 if(showBear.has(m)){
  // One recurring real animal crosses a real property boundary; bins are fixed.
  ops.push(P[0].x([-680,-455,-305,-70,250,490][i]*dir,t));
  ops.push(P[0].rotation([-8,-4,3,1,7,0][i],t));
  ops.push(P[0].y([162,156,110,155,132,145][i],t));
  if(i<3)ops.push(P[1].rotation([0,-6,14][i],t));
  if(i===3||i===4)ops.push(H.x(H.x()+dir*80,t),H.rotation(i===4?12:-7,t));
  if(i===5)ops.push(P[4].opacity(.45,t),w.shroud.opacity(.09,t));
 }else if(civic.has(m)){
  // Rows of seated citizens stay in the frame, while decisions change hands.
  ops.push(P[0].rotation([0,-4,5,2,-6,0][i],t));
  ops.push(P[2].x([-60,-22,35,74,13,-35][i],t));
  ops.push(P[2].rotation([0,2,-5,3,-8,1][i],t));
  ops.push(H.x([-630,-585,-500,-500,-470,-445][i],t));
  ops.push(O.x([630,605,560,515,495,490][i],t));
  if(i>3)ops.push(w.shroud.opacity(.035*(i-3),t));
 }else if(infrastructure.has(m)){
  // Road damage, service vehicles and street fixtures remain persistent.
  ops.push(P[1].x([-660,-390,-100,140,405,620][i],t));
  ops.push(P[1].y([180,170,175,170,175,170][i],t));
  ops.push(P[2].rotation([0,1,-3,2,1,0][i],t));
  ops.push(H.x([-670,-590,-495,-360,-270,-160][i],t));
  if(i>=3)ops.push(P[3].opacity(.70,t),w.shroud.opacity(.045,t));
 }else if(campMotifs.has(m)){
  // Actual migration: a moving truck passes existing improvised homes.
  ops.push(P[0].x([-680,-465,-220,0,330,620][i],t));
  ops.push(P[0].y([165,160,162,159,160,158][i],t));
  ops.push(P[1].rotation([0,0,3,-3,2,0][i],t));
  ops.push(H.x([-750,-615,-510,-400,-330,-240][i],t));
 }else{
  // A physical ledger is opened, passed to a citizen, and weighed against a home.
  ops.push(P[0].rotation([-9,-3,4,0,-8,0][i],t));
  ops.push(P[0].x([-385,-305,-185,-85,65,120][i],t));
  ops.push(P[1].x([260,220,170,115,60,30][i],t));
  ops.push(P[1].rotation([6,3,-4,-8,-2,0][i],t));
  if(i>=3)ops.push(w.shroud.opacity(.02*(i-2),t));
 }
 yield* all(...ops);
 const rest=seconds-t;if(rest>0)yield* waitFor(rest);
}


/** Every authored shot receives location-specific dressing, lighting and depth.
 * Its shot direction is read from the director-approved storyboard (86 unique descriptions).
 * The world exists at frame zero: no repeated icon/card cascade.
 */
function decorateUniqueSet(p:Node,s:Scene){
 const d=s.direction??'', n=Number(s.id.slice(1))||0;
 const chapterSeed=s.id.charCodeAt(0);
 const variant=(chapterSeed*17+n*29)%13;
 const x=-760+variant*107;
 const color=variant%2?'#29434C':'#354E4F';
 // Lived-in texture: different light, windows, geography and furniture each shot.
 if(/書斎|本|研究/.test(d)){
  box(p,-745,-90,205,550,'#26353D',6);
  for(let j=0;j<6;j++){box(p,-750,-320+j*88,167,10,'#72817E',3);
   for(let k=0;k<4;k++)box(p,-815+k*44,-356+j*88,21+((j+k+n)%3)*6,59,['#AB745C','#76958B','#B2A078'][k%3],2);}
 }
 if(/橋|道路|舗装|通学|通勤/.test(d)){
  box(p,-80,250,980,80,'#59646A',0);
  for(let k=0;k<7;k++)box(p,-470+k*145,251,63,6,'#D1C7A0',0);
  if(/補修|ひび割れ|老朽|壊れ/.test(d))stroke(p,[[-90,254],[-50,238],[-35,265],[26,250]],'#192630',8);
 }
 if(/消防|火災|火|設備/.test(d)){
  box(p,605,-84,360,340,'#414C4C',5);
  box(p,605,-70,180,235,'#31444C',3);
  box(p,605,95,258,32,'#9C7E66',3);
  if(/延焼|燃え移|火が/.test(d)){disk(p,780,72,48,'#C5744A');disk(p,744,21,28,'#C58B59');}
 }
 if(/寄付|予算|帳簿|明細|税金|書類/.test(d)){
  box(p,-665,-155,330,440,'#D9D3C7',8);
  for(let j=0;j<7;j++)box(p,-668,-322+j*48,248,4,j%3===0?'#B67566':'#78858A',2);
 }
 if(/集会|会議|議会|住民/.test(d)){
  for(let j=0;j<4;j++)box(p,-600+j*300,145,140,45,'#564E47',5);
 }
 if(/漁師|漁場|湖|水路|魚/.test(d)){
  box(p,0,213,1920,245,'#294E5A',0);
  for(let j=0;j<10;j++)stroke(p,[[-930+j*190,255],[-875+j*190,255]],'#668E94',3);
  stroke(p,[[-120,100],[-40,146],[120,146],[240,100]],'#967A59',15);
 }
 if(/クマ|ゴミ|餌|ドーナツ|隣家/.test(d) && (s.chapter==='chapter3'||s.chapter==='chapter4'||s.motif==='bear')){
  box(p,695,198,108,146,'#324954',8);box(p,695,114,124,23,'#566C6E',5);
 }
 // Frame identity is spatial, not a new piece of on-screen explanatory text.
 box(p,x,-395,72+variant*7,7,color,2).opacity(.26);
}

function setup(view:View2D,s:Scene):World{
 const contentLayer=new Node({});
 const headingLayer=new Node({});
 const subtitleBacking=new Node({});
 const subtitleTextLayer=new Node({});
 view.add(contentLayer);view.add(headingLayer);view.add(subtitleBacking);view.add(subtitleTextLayer);
 view.fill(K.bg);
 const m=s.motif;
 stageBackground(contentLayer,m);
 decorateUniqueSet(contentLayer,s);
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
 if(wildlife.has(m)){hero.opacity(.74);other.opacity(.10);} else if(civic.has(m)){hero.opacity(.88);other.opacity(.88);}else if(abstraction.has(m)){hero.opacity(.35);other.opacity(.12);}
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
 return {root:stage,hero,other,objects,labels,shroud,status,clock,caption:subtitle};
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
 if(townMotifs.has(m)){buildTownProps(s,props);return;}
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

/**
 * Direction revision #2
 *
 * The entire physical composition exists at frame zero. The common animation
 * never spawns a new page/icon/card on every narration beat.
 * Instead it changes a pre-existing prop or a person's physical action.
 * Repeats between scenes are avoided by assigning a different state route to
 * location + scene ID, not simply substituting a different image.
 */
const activeCount:Record<string,number>={
 race:0,office:4,contrast:2,brain:6,feedback:3,question:1,
 book:1,calendar:3,workflow:4,portrait:0,farm:6,
 shopping:4,tunnel:1,debt:3,school:4,study:2,
 judge:2,merit:2,city:0,bureau:3,forms:4,support:3,
};
const namedPhases:Record<string,string[]>={
 P00:['走者が並ぶ','号砲','最初の加速','先頭との差','最後の直線','ゴール'],
 P01:['指示を受ける','資料の確認','電話の予定','会議が迫る','仕事が未完了','叱責される'],
 A02:['出発のつもり','鍵を探す','財布の確認','予定が乱れる','時計が進む','間に合わない'],
 B00:['収穫前','収入前の暮らし','同一人物の課題','収穫','収入後の暮らし','同じ人物の課題'],
 B02:['値札の比較','商品を選ぶ','所持金','家賃の請求','転職の準備','気が散る'],
 B05:['家賃の期限','残高不足','借入の選択','支払い','次月の返済','負担が残る'],
 D00:['制度を調べる','窓口を探す','受付時間','勤務との衝突','資料を集める','相談まで遠い'],
 D01:['窓口へ','書類の記入','不足資料','期限の確認','来訪が必要','手続きの負担'],
 E00:['オフィスに戻る','仕事が進まない','時計を見る','上司が近づく','社員が説明する','行動の条件'],
};
function phaseName(s:Scene,i:number){
 return (namedPhases[s.id]??actionCopy[s.motif]??actionCopy.question)[i];
}
function placePermanentProps(w:World,s:Scene){
 const m=s.motif,count=townMotifs.has(m)?6:activeCount[m]??0;
 for(let i=0;i<w.objects.length;i++){
  const o=w.objects[i];
  o.opacity(i<count?1:0);
  let x=0,y=0,scale=.8;
  if(m==='office'||m==='workflow'){x=-230+i*160;y=122;scale=.60;}
  else if(m==='farm'){x=-700+i*260;y=140;scale=1.1;}
  else if(m==='shopping'){x=-500+i*315;y=-100;scale=.60;}
  else if(m==='school'){x=i%2?-465:465;y=100+Math.floor(i/2)*60;scale=.63;}
  else if(m==='calendar'){x=170+i*150;y=110;scale=.78;}
  else if(m==='bureau'||m==='forms'){x=-140+i*148;y=132;scale=.59;}
  else if(m==='feedback'||m==='debt'){x=-185+i*175;y=138;scale=.66;}
  else if(m==='brain'){x=-425+i*170;y=0;scale=.7;}
  else if(m==='contrast'||m==='merit'||m==='judge'||m==='study'){x=i===0?-410:410;y=10;scale=1.05;}
  else if(m==='support'){x=-160+i*150;y=115;scale=.66;}
  else if(m==='book'){x=110;y=0;scale=1.55;}
  else if(m==='tunnel'){x=150;y=10;scale=1.15;}
  else if(m==='question'){x=70;y=-15;scale=1.7;}
  else if(townMotifs.has(m)){const shifts=[-530,-260,0,245,470,650];x=shifts[i];y=i%2?125:55;scale=i===0?1.0:(i===1?.8:.67);}
  else{x=-200+i*120;y=100;scale=.75;}
  o.x(x);o.y(y);o.scale(scale);
 }
 if(m==='race'){
  w.hero.x(-800);w.hero.y(-62);w.other.x(-800);w.other.y(95);
  w.hero.scale(.93);w.other.scale(.93);
 }
 if(m==='school'){
  w.hero.x(-470);w.other.x(460);w.hero.y(-115);w.other.y(-115);
  w.other.opacity(1);
 }
 if(m==='farm'){
  w.hero.x(-670);w.other.x(620);w.hero.y(80);w.other.y(80);
  w.other.opacity(.8);
 }
 if(['contrast','merit','judge'].includes(m)){
  w.hero.x(-650);w.other.x(645);w.hero.y(40);w.other.y(40);
  w.hero.opacity(.92);w.other.opacity(.9);
 }
 if(m==='portrait'){
  w.hero.opacity(1);w.other.opacity(.95);
 }
 if(['book','study'].includes(m))w.status.text(s.title);
 if(townMotifs.has(m)){w.clock.text(''); if(showBear.has(m)){w.objects[0].x(-680);w.objects[0].y(150);w.objects[0].scale(.85);w.objects[4].opacity(0);} if(civic.has(m)){w.hero.x(-650);w.other.x(650);} if(infrastructure.has(m)){w.objects[1].x(-650);w.objects[1].y(175);}}
 if(['race','office','calendar','farm','bureau','forms','shopping'].includes(m))w.clock.text(' ');
}
/** One coherent action per meaning-beat: movement, uptake, friction, time,
 * evaluation, or a counterfactual. Almost all props stay visible throughout.
 */
function* changeState(w:World,s:Scene,i:number,seconds:number):ThreadGenerator{
 const m=s.motif;
 if(townMotifs.has(m)){yield* directedMotion(w,s,i,seconds);return;}
 const P=w.objects,H=w.hero,O=w.other;
 const t=Math.min(.85,Math.max(.36,seconds*.26));
 const ops:ThreadGenerator[]=[];
 const statusAllowed=['book','study','brain','contrast','merit','judge','question'].includes(m);
 if(statusAllowed && (i===0||i===3))w.status.text(phaseName(s,i));
 if(m==='race'){
  // Only two existing runners: speed is what changes, not the amount of tokens.
  const xfast=[-790,-520,-185,235,620,790][i];
  const xslow=[-790,-590,-390,-125,165,440][i];
  ops.push(H.x(xfast,t),O.x(xslow,t));
  ops.push(H.rotation(i%2?6:-5,t),O.rotation(i%2?-4:5,t));
  if(i===5)w.clock.text('同じ距離、異なる到達点');
 }else if(m==='office'){
  // Papers are never spawned: physical documents migrate between IN/WORK/OUT.
  if(s.id==='P01'){
   const task=[0,1,2][i%3];
   if(i<=2)ops.push(P[task].x(-180+task*110,t),P[task].y(45,t));
   if(i===3)w.clock.text('14:00  会議開始');
   if(i>=4)ops.push(H.rotation(9,t),H.y(93,t));
   if(i===5)ops.push(O.opacity(1,t),O.x(340,t));
  }else if(s.id==='E00'){
   if(i<=2)ops.push(P[i].x(-250+i*100,t),P[i].rotation(8,t));
   if(i===3)ops.push(O.opacity(.93,t),O.x(220,t));
   if(i>=4)ops.push(H.rotation(-4,t),H.x(-490,t),O.x(350,t));
  }else{
   if(i<3)ops.push(P[i].x(-230+i*120,t),P[i].rotation(-5,t));
   else ops.push(P[(i-3)%3].x(340,t),P[(i-3)%3].rotation(8,t));
   if(i>=3)ops.push(H.y(80+i*3,t));
  }
 }else if(m==='calendar'){
  w.clock.text(['14:00','14:04','14:12','14:26','14:51','15:07'][i]);
  // Same appointment slips away while calendar pages are handled.
  ops.push(H.x(-570+i*35,t));
  ops.push(P[i%3].rotation(i%2?10:-9,t),P[i%3].y(100-(i%3)*22,t));
  if(i>=4)ops.push(H.rotation(11,t));
 }else if(m==='workflow'){
  const item=P[i%4];
  if(i<3)ops.push(item.x(-260+i*140,t),item.rotation(-12,t));
  else ops.push(item.x(360-(i-3)*82,t),item.y(92,t));
  ops.push(H.rotation(i%2?5:-5,t));
  if(i>=4)ops.push(O.x(430-i*17,t),O.opacity(.8,t));
 }else if(m==='farm'){
  // A field is planted from the start. Crops grow, harvest is performed.
  if(i<3){
   ops.push(P[i].scale(1.12+i*.12,t),P[i].rotation(i%2?5:-5,t));
   ops.push(H.x(-660+i*95,t));
  }else{
   ops.push(P[i-3].scale(.32,t),P[i-3].rotation(70,t));
   ops.push(H.x(-320+(i-3)*180,t),O.x(450-(i-3)*70,t));
  }
  if(i===4)w.clock.text('収穫後');
  if(i===0)w.clock.text('収穫前');
 }else if(m==='shopping'){
  // Buyer physically handles goods already present on a shelf.
  if(i===0)ops.push(H.x(-700,t),H.rotation(-8,t));
  if(i===1)ops.push(P[0].x(-350,t),P[0].y(40,t));
  if(i===2)ops.push(P[1].x(-300,t),P[1].y(80,t),H.x(-420,t));
  if(i===3)ops.push(H.rotation(12,t),P[0].scale(.53,t));
  if(i>=4)ops.push(H.x(-410+i*13,t),P[1].y(110,t));
  w.clock.text(i<3?'食費を計算':i<5?'家賃の支払い':'求人を確認');
 }else if(m==='school'){
  // Both desks are occupied from frame 1. Books shift, not pop up.
  const target=P[i%4];
  ops.push(target.rotation(i%2?9:-8,t),target.y(100+((i+1)%2)*36,t));
  ops.push(H.rotation(i%2?3:-4,t),O.rotation(i%2?-4:4,t));
  if(i===4)ops.push(O.y(-70,t));
  if(i===5)ops.push(H.y(-70,t));
 }else if(m==='brain'){
  // Background processing compresses attention: same six workload circles.
  const compression=i<3?(1-i*.12):(.58+(i-3)*.11);
  for(let j=0;j<6;j++){
   const base=-425+j*170;
   ops.push(P[j].x(base*compression,t),P[j].scale(.72+(i<3?i*.05:-.05),t));
  }
  if(i>=3)ops.push(w.shroud.opacity(.035*i,t));
 }else if(m==='tunnel'){
  // The world darkens and a visible decision dominates the one focal region.
  const widths=[1,1.04,1.13,1.24,1.16,1.06];
  ops.push(P[0].scale(widths[i],t),H.x(-480+i*30,t));
  ops.push(w.shroud.opacity(.028+i*.022,t));
 }else if(m==='debt'){
  // The same bills slide from current dues to next month's repayment.
  if(i<3)ops.push(P[i].x(-140+i*105,t),P[i].rotation(-9,t));
  else ops.push(P[i-3].x(205+(i-3)*95,t),P[i-3].rotation(11,t));
  if(i>=3)ops.push(w.shroud.opacity((i-2)*.033,t));
  ops.push(H.rotation(i%2?5:-7,t));
 }else if(m==='feedback'){
  // A physical trap: receipts return toward the same person.
  if(i<3)ops.push(P[i].x(-160+i*130,t));
  else ops.push(P[i-3].x(-320+(i-3)*94,t),P[i-3].rotation(12,t));
  ops.push(H.scale(1.13-i*.025,t));
  if(i>=4)ops.push(w.shroud.opacity(.08,t));
 }else if(m==='bureau'||m==='forms'){
  // The counter is one continuous physical barrier; papers do not materialize.
  const slot=i%(m==='bureau'?3:4);
  ops.push(P[slot].x(-60+slot*78,t),P[slot].y(132-(i+1)*8,t),P[slot].rotation(i%2?5:-5,t));
  if(i<4)ops.push(H.x(-555+i*80,t));
  else ops.push(H.x(-260-(i-3)*58,t));
  if(i===3)w.clock.text('受付時間');
  if(i===5)ops.push(w.shroud.opacity(.10,t));
 }else if(m==='support'){
  // Intervention removes barriers: applicant and helper reach same counter.
  if(i<2)ops.push(H.x(-570+i*77,t));
  if(i>=2)ops.push(O.x(520-(i-2)*92,t),O.opacity(.9,t));
  if(i>=3)ops.push(P[i-3].x(420,t),P[i-3].scale(.44,t));
  if(i===5)ops.push(H.x(-145,t));
 }else if(m==='contrast'||m==='merit'||m==='judge'){
  // Physical comparison: two stable groups carry differing social judgments.
  const left=P[0],right=P[1];
  ops.push(left.scale(1.05+(i%3)*.07,t),right.scale(1.22-(i%3)*.08,t));
  if(i<3)ops.push(H.rotation(-2-i*2,t),O.rotation(2+i*2,t));
  else ops.push(H.x(-650+(i-2)*25,t),O.x(645-(i-2)*25,t));
  if(i===5)ops.push(w.shroud.opacity(.07,t));
 }else if(m==='study'){
  // Study records are on the table before narration, compared by moving
  // the same sheets nearer; no invented data points or fake bar heights.
  ops.push(P[0].rotation(-5+i*.7,t),P[1].rotation(5-i*.7,t));
  if(i>2)ops.push(P[0].x(-410+(i-2)*40,t),P[1].x(410-(i-2)*40,t));
 }else if(m==='book'){
  // Turn a book rather than adding a new research card each sentence.
  ops.push(P[0].rotation([-8,-3,5,0,-6,0][i],t));
  ops.push(P[0].x([115,120,75,60,90,95][i],t));
  if(i===3)ops.push(w.shroud.opacity(.06,t));
 }else if(m==='portrait'){
  ops.push(H.x(-565+i*22,t),H.rotation(i%2?4:-5,t));
  ops.push(O.x(510-i*18,t),O.rotation(i%2?-4:5,t));
  if(i>=4)ops.push(w.shroud.opacity(.055,t));
 }else if(m==='city'){
  // The citizen physically traverses a district, no tower/icons pop in.
  ops.push(H.x(-750+i*270,t),H.rotation(i%2?4:-4,t));
  if(i===3)ops.push(O.opacity(1,t),O.x(380,t));
  if(i>=4)ops.push(w.shroud.opacity(.06,t));
 }else if(m==='question'){
  // A held question slowly turns from accusation into a systemic question.
  ops.push(P[0].scale(1.65+(i<3?i*.07:(5-i)*.04),t));
  ops.push(P[0].rotation(-8+i*3,t));
  if(i>=4)ops.push(w.shroud.opacity(.065,t));
 }else{
  ops.push(H.x(H.x()+26,t),H.rotation(i%2?4:-4,t));
 }
 yield* all(...ops);
 const rest=seconds-t;
 if(rest>0)yield* waitFor(rest);
}
function* visual(w:World,s:Scene):ThreadGenerator{
 placePermanentProps(w,s);
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
 // V123 revision 3: no legacy generic six-step performance runs.
 yield* playPhysicalScene(view,scene);
}
