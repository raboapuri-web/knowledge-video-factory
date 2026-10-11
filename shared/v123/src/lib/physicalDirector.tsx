import '@fontsource/noto-sans-jp/400.css';
import '@fontsource/noto-sans-jp/700.css';
import {Node,Rect,Circle,Line,Txt,type View2D} from '@motion-canvas/2d';
import {all,waitFor,type ThreadGenerator} from '@motion-canvas/core';
import performances from '../../content/physical-performances-v3.json';

/**
 * V123 / physical storyboard revision 3.
 * 86 authored performances, 26 practical environments, 69 prop types.
 *
 * There is no universal six-beat move: every shot has its own FOUR purposeful
 * physical events, set, lens and actors. New physical elements are not presented
 * as endlessly arriving infographic cards. They exist in the world from frame 0.
 * All art remains below the caption band in independent immutable root siblings.
 */
type Cue={text:string;display:string;start:number;end:number};
export type NarrativeScene={id:string;chapter:string;motif:string;title:string;direction?:string;cues:Cue[];duration:number};
type Perf={id:string;chapter:string;set:string;actors:string[];events:string[];lens:string;direction:string};
type Puppet={root:Node;accent:Node;body:Node};
const PLANS=new Map<string,Perf>((performances.shots as Perf[]).map(x=>[x.id,x]));
const C={navy:'#0B1824',dusk:'#1B323B',coal:'#1D2934',slate:'#4A656F',green:'#2C5546',
  ochre:'#E7BC81',paper:'#EEE8D9',muted:'#B6C6C4',red:'#D85A53',teal:'#6EBDAE',blue:'#7399BA',
  stone:'#6D7470',wood:'#816E5B',warm:'#B99572',black:'#18232A'};
const FONT='Noto Sans JP,Noto Sans CJK JP,sans-serif';
const skySets=new Set(['urban','lakeside','roadside','homestead','asphalt','station','firemap','porch','garden','woods','fence','river','bridge','fishing','nightstreet','nighttown']);
const waterSets=new Set(['lakeside','fishing','river']);
const civicSets=new Set(['bureau','counter','hall','council','maproom','ledger']);
function rect(parent:Node,x:number,y:number,w:number,h:number,fill:string,r=6){
 const q=new Rect({x,y,width:w,height:h,fill,radius:r});parent.add(q);return q;
}
function circ(parent:Node,x:number,y:number,r:number,fill:string){
 const q=new Circle({x,y,width:r*2,height:r*2,fill});parent.add(q);return q;
}
function stroke(parent:Node,points:[number,number][],color:string,width=7){
 const q=new Line({points,stroke:color,lineWidth:width,lineCap:'round',lineJoin:'round'});parent.add(q);return q;
}
function label(parent:Node,t:string,x:number,y:number,size=29,fill=C.paper){
 const q=new Txt({text:t,x,y,fontFamily:FONT,fontSize:size,fontWeight:700,fill});parent.add(q);return q;
}
function tree(p:Node,x:number,y:number,sc=1,season=0){
 const n=new Node({x,y,scale:sc});p.add(n);
 stroke(n,[[0,175],[0,-95]],'#554938',19);
 circ(n,-47,-93,69,season?'#596F52':'#214A3F');
 circ(n,45,-125,87,season?'#AF7750':'#316052');
 circ(n,24,-185,53,season?'#C08A61':'#285343');
 return n;
}
function windows(p:Node,x:number,y:number,count:number,color:string){
 for(let i=0;i<count;i++)rect(p,x+(i%3)*60,y+Math.floor(i/3)*72,30,36,(i%4?color:C.ochre),2);
}
function house(p:Node,x:number,y:number,w=330,col='#58646A'){
 rect(p,x,y+35,w,280,col,7);
 stroke(p,[[x-w*.58,y-111],[x,y-257],[x+w*.58,y-111]],'#35434C',29);
 rect(p,x-72,y+36,82,76,'#D3AF7C',2);
 rect(p,x+86,y+115,90,142,'#30434D',3);
}
function desk(p:Node,x=0,y=185){
 rect(p,x,y,1220,55,'#73695F',7);rect(p,x-420,y+95,37,160,'#5C564E',0);rect(p,x+420,y+95,37,160,'#5C564E',0);
}
function floor(p:Node,color='#33464D'){
 rect(p,0,250,2200,520,color,0);
 stroke(p,[[-1000,270],[1000,270]],'#58717A',8);
}
function backdrop(p:Node,scene:NarrativeScene,perf:Perf){
 const kind=perf.set;const dark=/night|woods|porch|firemap/.test(kind);
 rect(p,0,0,2250,1100,skySets.has(kind)?dark?'#12212B':'#294958':'#152834',0);
 if(skySets.has(kind)){
  circ(p,715,-280,dark?68:84,dark?'#B9C0B9':'#D6B579');
  for(let k=0;k<8;k++)tree(p,-975+k*295,-110+(k%3)*38,.54+(k%2)*.14,(scene.id.charCodeAt(0)+k)%5===0?1:0);
  rect(p,0,230,2250,340,waterSets.has(kind)?'#244D5A':'#315344',0);
 }
 if(kind==='urban'||kind==='nightstreet'||kind==='nighttown'){
  for(let i=0;i<8;i++){
   const h=260+(i*37)%240,x=-900+i*255;
   rect(p,x,153-h/2,215,h,i%2?'#344B57':'#263A47',3);
   windows(p,x-58,27-h,6,'#607480');
  }
  floor(p,'#435259');
  for(let j=0;j<10;j++)rect(p,-880+j*185,324,94,9,'#D4CFB9',0);
 }
 if(kind==='lakeside'||kind==='fishing'||kind==='river'){
  floor(p,'#244D5A');
  for(let j=0;j<16;j++)stroke(p,[[-970+j*130,245+(j%4)*43],[-900+j*130,245+(j%4)*43]],'#78969A',4);
 }
 if(kind==='homestead'){house(p,-370,-60,420);rect(p,580,60,210,290,'#5F675D',4);stroke(p,[[480,-160],[580,-245],[688,-160]],'#313F45',18);}
 if(kind==='roadside'||kind==='asphalt'||kind==='bridge'){
  floor(p,'#445358');
  for(let j=0;j<8;j++)rect(p,-900+j*260,320,140,10,'#C8BF9F',0);
  if(kind==='bridge'){rect(p,0,218,1240,95,'#5A5E63',4);for(let j=0;j<7;j++)stroke(p,[[-625+j*195,180],[-625+j*195,305]],'#8D9594',13);}
 }
 if(kind==='porch'||kind==='garden'||kind==='fence'){
  house(p,-450,-65,470);house(p,570,-42,345,'#65736F');
  if(kind==='fence'||kind==='garden')for(let j=0;j<14;j++)rect(p,-850+j*132,185,12,190,'#A39B88',2);
 }
 if(kind==='woods'){for(let j=0;j<6;j++)tree(p,-750+j*280,35,.84+(j%2)*.17);}
 if(kind==='station'){
  rect(p,-55,-120,1200,650,'#3D4B51',5);
  for(let j=0;j<3;j++)rect(p,-405+j*405,-60,322,440,'#273E48',3);
  rect(p,0,252,1200,72,'#8A857C',0);
 }
 if(kind==='firemap'){house(p,-515,60,310);house(p,575,60,310);for(let j=0;j<7;j++)rect(p,-680+j*210,292,28,95,'#78837C',3);}
 if(kind==='kitchen'||kind==='living'){
  rect(p,0,-45,2250,940,'#304752',0);floor(p,'#59605F');
  rect(p,-590,-126,390,290,'#6D898B',5);
  rect(p,-590,-126,340,239,'#1C3948',3);
  stroke(p,[[-590,-266],[-590,11]],'#D1B995',13);
  desk(p,140,180);
 }
 if(kind==='desk'||kind==='library'){
  rect(p,0,-25,2250,1000,kind==='library'?'#23323B':'#253946',0);
  if(kind==='library')for(let row=0;row<4;row++){
   rect(p,-680,-260+row*155,490,19,'#786755',4);
   for(let k=0;k<10;k++)rect(p,-885+k*42,-317+row*155,25,92,['#886B5A','#607F77','#C1986F'][k%3],2);
  }
  desk(p,0,185);
 }
 if(kind==='tavern'){
  rect(p,0,-25,2250,1000,'#2C292D',0);
  for(let k=0;k<6;k++)rect(p,-800+k*315,-210,155,200,'#483638',7);
  desk(p);
 }
 if(kind==='maproom'||kind==='ledger'||kind==='bureau'||kind==='counter'){
  rect(p,0,-25,2250,1000,'#283D48',0);
  rect(p,-190,-50,1330,675,'#D4CCBA',10);
  rect(p,-180,-58,1250,600,'#E9E1D0',6);
  if(kind==='bureau'||kind==='counter')desk(p,165,182);
  else for(let k=0;k<10;k++)stroke(p,[[-760+k*160,-300],[-730+k*160,202]],'#C6BEAD',2);
 }
 if(kind==='hall'||kind==='council'){
  rect(p,0,-45,2250,1020,'#27343D',0);floor(p,'#4E4E4A');
  for(let k=0;k<6;k++){
   rect(p,-790+k*310,170,240,34,'#786C5E',5);
   rect(p,-790+k*310,232,17,70,'#504B43',0);
  }
  rect(p,0,-90,1050,360,'#35444C',6);
 }
 if(kind==='fishing')rect(p,0,272,1280,34,'#809CA2',0);
 // Different physical camera coverage by shot, not a fixed six-card staging.
 if(perf.lens==='overhead')stroke(p,[[-900,-320],[850,-320]],'#B0B2A0',3);
 if(perf.lens==='silhouette')rect(p,0,-390,2250,60,'#26353A',0).opacity(.25);
}

/** Actor geometry is diegetic: objects used by people, not identical concept cards. */
function makePuppet(parent:Node,kind:string,x:number,y:number,scale:number):Puppet{
 const root=new Node({x,y,scale});parent.add(root);
 const body=new Node({});root.add(body);
 const accent=new Node({});root.add(accent);
 const k=kind;
 const isHuman=['citizen','worker','firefighter','clerk','crowd','finger'].includes(k);
 const vehicle=['truck','trashtruck','firetruck','train'].includes(k);
 const paper=['receipt','folder','paper','notice','ledger','map','book','envelope','photo','ballot'].includes(k);
 if(isHuman){
  if(k==='finger'){
   rect(body,0,24,46,135,'#D4B19A',22);circ(body,0,-54,27,'#DBB99D');
  }else{
   const col=k==='firefighter'?'#A98A61':k==='worker'?'#7F9194':k==='clerk'?'#6D8796':C.paper;
   circ(body,0,-106,33,'#E2BCA0');
   rect(body,0,3,k==='crowd'?120:93,138,col,22);
   stroke(body,[[-37,-39],[-75,74]],col,17);stroke(body,[[36,-43],[79,58]],col,17);
   stroke(body,[[-23,73],[-34,172]],'#5D6370',16);stroke(body,[[22,73],[33,172]],'#5D6370',16);
   if(k==='firefighter'){rect(body,0,-145,98,17,C.ochre,5);circ(body,0,-158,37,'#A48B59');}
   if(k==='clerk')rect(body,0,16,14,87,C.red,2);
  }
 }
 else if(vehicle){
  rect(body,0,45,k==='train'?450:320,125,k==='firetruck'?C.red:k==='trashtruck'?'#627F74':'#7E8C91',20);
  rect(body,-110,-14,145,102,'#A2BBC0',15);
  rect(body,-110,-32,110,63,'#3B6270',6);
  for(const dx of [-118,111]){circ(body,dx,113,35,C.black);circ(body,dx,113,17,C.muted);}
  if(k==='firetruck'){rect(accent,57,-31,220,15,C.paper,2);rect(accent,155,10,22,25,C.ochre,2);}
  if(k==='trashtruck')rect(body,71,28,127,115,'#41645A',8);
 }
 else if(k==='bear'){
  rect(body,10,25,263,126,'#272E32',63);circ(body,-105,-10,77,'#2C3033');
  circ(body,-147,-76,24,'#30363A');circ(body,-71,-80,23,'#30363A');
  rect(body,-137,30,82,52,'#43413B',28);
  for(const dx of [-91,112])rect(body,dx,105,45,85,'#262A2F',15);
  circ(accent,-122,-29,7,C.ochre);
 }
 else if(k==='cub'){circ(body,0,10,56,'#393B3A');circ(body,-33,-41,18,'#454542');circ(body,38,-42,18,'#454542');}
 else if(k==='fish'){rect(body,0,0,135,65,'#7DA4A0',36);stroke(body,[[50,2],[114,-49],[114,49],[50,2]],'#80AFAC',8);circ(accent,-35,-7,6,C.black);}
 else if(k==='boat'){stroke(body,[[-155,42],[-83,105],[84,105],[155,42]],'#A48965',20);stroke(body,[[0,50],[0,-105]],'#D6D3B8',9);rect(body,45,-32,98,13,C.paper,2);}
 else if(paper){
  const col=k==='ledger'?'#D2C5B0':k==='book'?'#86635F':'#E5DBCA';
  rect(body,0,0,k==='map'?310:210,k==='map'?230:275,col,5);
  if(k==='book')rect(body,-82,0,19,263,'#4B4445',2);
  if(k==='map')for(let j=0;j<3;j++)stroke(body,[[-116+j*110,-98],[-82+j*110,98]],'#7B9898',4);
  else for(let j=0;j<6;j++)rect(body,-5,-100+j*35,j%3===0?145:163,6,j%3===0?'#B67A6C':'#7C8684',2);
  rect(accent,0,104,175,10,k==='receipt'?C.red:C.blue,2);
  if(k==='ballot')rect(body,0,0,210,135,C.paper,2);
 }
 else if(k==='donut'){circ(body,0,0,70,'#B78359');circ(body,0,0,24,'#324650');for(let i=0;i<8;i++)rect(body,Math.cos(i)*45,Math.sin(i)*45,11,4,['#EFC78D','#D65E69'][i%2],1);}
 else if(k==='bin'){rect(body,0,0,145,215,'#486670',12);rect(body,0,-119,166,29,'#293E45',4);for(let i=0;i<4;i++)rect(body,-50+i*33,14,6,145,'#7B9A9B',3);}
 else if(k==='signal'||k==='traffic'){rect(body,0,0,110,285,C.black,20);for(let i=0;i<3;i++)circ(body,0,-87+i*87,26,['#B95351','#AA9167','#4B9076'][i]);stroke(body,[[0,148],[0,255]],'#8B9292',14);circ(accent,0,-87,18,'#E57265');}
 else if(k==='tap'){stroke(body,[[-140,-25],[-140,-121],[6,-121],[6,-20]],'#9AAEB3',24);rect(body,-45,-143,95,18,'#768E98',3);rect(accent,5,70,9,185,'#6AA8BD',4);accent.opacity(.04);}
 else if(k==='window'||k==='door'||k==='gate'){rect(body,0,0,260,325,'#627D81',7);rect(body,0,0,221,287,k==='window'?'#D7B88C':'#354F59',2);rect(accent,65,17,13,14,C.ochre,6);}
 else if(k==='house'){house(body,0,-40,260);accent.opacity(.01);}
 else if(k==='lamp'){stroke(body,[[0,160],[0,-128],[89,-128]],'#657B80',19);circ(body,87,-106,40,'#B6A17D');circ(accent,88,-106,52,'#E6BB76');accent.opacity(.05);}
 else if(k==='clock'){circ(body,0,0,105,C.paper);circ(body,0,0,91,C.black);stroke(accent,[[0,-51],[0,0],[40,0]],C.ochre,9);}
 else if(k==='coffin'){rect(body,0,35,275,120,'#4D3F3D',8);stroke(body,[[-145,0],[145,0]],'#967B70',13);}
 else if(k==='glass'){rect(body,0,32,103,145,'#63868A',9);rect(accent,0,65,87,68,'#9A6753',7);}
 else if(k==='notice'||k==='sign'){rect(body,0,0,270,145,'#D8CBB2',7);label(body,k==='sign'?'LIVE FREE':"NOTICE",0,-15,24,C.black);stroke(body,[[0,76],[0,196]],'#8B8779',14);}
 else if(k==='pen'||k==='shovel'||k==='ruler'){stroke(body,[[-40,135],[35,-135]],k==='shovel'?'#A49C86':k==='ruler'?'#C3AB79':'#718C9E',k==='shovel'?21:14);if(k==='shovel')rect(body,-57,154,92,75,'#909D9B',7);}
 else if(k==='wallet'){rect(body,0,0,240,155,'#816253',14);rect(accent,48,10,95,21,'#A58D74',3);}
 else if(k==='coin'){circ(body,0,0,65,'#D9AF68');circ(accent,0,0,47,'#B9925E');}
 else if(k==='computer'){rect(body,0,-25,315,195,'#344A55',7);rect(body,0,-25,284,162,'#B9C0B5',3);stroke(body,[[0,75],[0,180]],'#9B9F9B',17);}
 else if(k==='scale'){stroke(body,[[0,140],[0,-135]],'#B8A88D',18);stroke(body,[[-185,-55],[185,-55]],C.ochre,11);for(let q of [-1,1])stroke(body,[[q*160,-55],[q*160,65]],'#B8A88D',6);for(let q of [-1,1])rect(body,q*160,90,140,14,'#A38D70',5);}
 else if(k==='stamp'){rect(body,0,-3,95,145,'#816751',9);rect(accent,0,81,185,26,'#B45B57',4);}
 else if(k==='toolbox'){rect(body,0,38,240,140,'#A57357',15);rect(body,0,-26,125,22,C.ochre,9);}
 else if(k==='shovel'){stroke(body,[[-45,130],[39,-105]],'#967F60',20);}
 else if(k==='road'||k==='bridgeplank'){rect(body,0,0,k==='road'?480:350,100,'#55656A',4);for(let i=0;i<3;i++)rect(body,-118+i*115,5,56,8,'#CFBA91',0);}
 else if(k==='barrier'){stroke(body,[[-128,95],[-128,-96],[128,-96],[128,95]],'#D5BC86',18);for(let i=0;i<4;i++)rect(body,-88+i*58,-102,24,18,C.red,2);}
 else if(k==='flame'){circ(body,0,0,73,'#CC653C');circ(accent,0,-45,47,'#E9A258');}
 else if(k==='smoke'||k==='cloud'){for(let i=0;i<5;i++)circ(body,-80+i*41,-(i%2)*32,43,k==='cloud'?'#A2B2B5':'#6A7780');}
 else if(k==='moon'){circ(body,0,0,88,'#D5C1A0');}
 else if(k==='leaf'){for(let i=0;i<7;i++)circ(body,-60+i*18,-25+(i%3)*31,21,'#647B5B');}
 else if(k==='tree'){tree(body,0,0,.70);}
 else if(k==='bucket'){rect(body,0,33,180,140,'#819397',8);stroke(body,[[-95,-55],[0,-135],[95,-55]],'#A6B1B3',9);rect(accent,0,55,164,59,'#5B92A1',7);}
 else if(k==='coop'){rect(body,0,12,240,155,'#796957',5);stroke(body,[[-135,-60],[0,-156],[135,-60]],'#5E554F',17);rect(body,0,40,79,101,'#323A3B',3);}
 else if(k==='donation'){rect(body,0,25,216,159,'#B8B0A0',9);rect(body,0,-60,100,18,'#4D575B',4);}
 else if(k==='key'){circ(body,-35,-40,46,C.ochre);circ(body,-35,-40,20,'#354B54');stroke(body,[[6,-10],[91,110]],C.ochre,23);}
 else if(k==='shadow'){rect(body,0,0,235,255,'#3E4F55',15);body.opacity(.55);}
 else if(k==='table'){rect(body,0,40,420,38,'#756858',6);stroke(body,[[-170,61],[-170,190]],'#756858',17);stroke(body,[[170,61],[170,190]],'#756858',17);}
 else if(k==='helmet'){circ(body,0,0,81,C.ochre);rect(body,0,45,191,17,'#D3A86F',6);}
 else if(k==='leash'){stroke(body,[[-95,70],[-45,-80],[85,-45]],'#A9A18D',12);}
 else if(k==='train'){rect(body,0,0,470,190,'#A1A8A6',18);}
 else {rect(body,0,0,170,160,'#748B8E',9);circ(accent,0,0,26,C.ochre);}
 return {root,body,accent};
}
function actorLayout(p:Perf,i:number){
 const placements:Record<string,[number,number,number][]>={
  close:[[-575,30,1.1],[50,60,1.15],[565,-15,1]],
  overhead:[[-565,-90,.84],[50,85,.90],[570,-105,.84]],
  wide:[[-620,55,.80],[-10,85,.87],[610,55,.80]],
  ground:[[-575,55,1.00],[0,175,1.15],[590,30,.96]],
  tracking:[[-675,50,.95],[-80,95,.93],[575,45,1.02]],
  split:[[-610,15,1.06],[540,50,1.04],[0,175,.78]],
  'two-shot':[[-520,45,1.1],[460,45,1.07],[30,165,.76]],
  still:[[-510,-15,1.06],[60,70,.97],[575,85,.81]],
  montage:[[-575,-30,.78],[-30,145,1.02],[590,-30,.78]],
  silhouette:[[-635,-15,.9],[0,120,.95],[650,-15,.84]],
  interior:[[-600,80,1.05],[40,45,1.00],[615,-5,.9]],
  dramatic:[[-660,55,.93],[-40,60,1.08],[640,-60,.77]],
  night:[[-625,40,.83],[0,100,1.07],[600,-20,.86]],
  low:[[-600,65,.92],[-15,105,1.09],[615,50,.91]],
  side:[[-610,30,1.02],[-5,145,.83],[620,35,1.02]],
  pan:[[-680,45,.87],[-45,105,.96],[640,30,.88]],
  cutaway:[[-610,0,1.05],[-10,150,.76],[625,-15,.98]]
 };
 const places=placements[p.lens]??placements.wide;
 const q=places[i]??places[0];
 return {x:q[0],y:q[1],scale:q[2]};
}
/** Distinct verbs physically change the object or its immediate environment. */
function* act(w:Puppet,verb:string,d:number,index:number):ThreadGenerator{
 const n=w.root,a=w.accent;const x=n.x(),y=n.y(),r=n.rotation();
 const shift=index===0?1:index===1?-1:1;
 const move=(dx:number,dy:number)=>[n.x(x+dx,d),n.y(y+dy,d)] as ThreadGenerator[];
 let ops:ThreadGenerator[]=[];
 switch(verb){
  case 'flow':case 'rain':case 'fill':ops=[a.opacity(1,d),a.scale(1.36,d)];break;
  case 'stop':case 'diminish':case 'dim':case 'fade':ops=[a.opacity(0,d),n.opacity(.55,d)];break;
  case 'cycle':case 'flash':case 'light':case 'ignite':ops=[a.opacity(.94,d),a.scale(1.22,d)];break;
  case 'drive':case 'drift':case 'pace':case 'walk':case 'detour':case 'cross':case 'queue':case 'exit':case 'return':{
   const xx=verb==='return'?-310:verb==='drive'||verb==='cross'?390:verb==='detour'?240:190;
   ops=move(xx*shift,verb==='drift'?-35:verb==='detour'?75:0);break;
  }
  case 'approach':case 'peek':case 'gather':ops=[n.x(x+135*shift,d),n.scale(1.12,d)];break;
  case 'withdraw':case 'retreat':case 'evade':ops=[n.x(x-200*shift,d),n.y(y+24,d),n.scale(.92,d)];break;
  case 'fold':case 'close':case 'lock':case 'park':ops=[n.rotation(r+(-14*shift),d),n.scale(.87,d)];break;
  case 'open':case 'unfold':case 'shelter':ops=[n.rotation(r+13*shift,d),n.scale(1.16,d)];break;
  case 'lift':case 'raise':case 'wear':case 'carry':case 'load':case 'pour':case 'catch':ops=[n.y(y-104,d),n.rotation(r-16*shift,d)];break;
  case 'drop':case 'lower':case 'unload':case 'release':ops=[n.y(y+108,d),n.rotation(r+23*shift,d)];break;
  case 'repair':case 'restore':case 'ready':case 'balance':case 'settle':ops=[n.rotation(0,d),n.y(y-22,d),a.opacity(.86,d)];break;
  case 'crack':case 'break':case 'tip':case 'tangle':ops=[n.rotation(r+38*shift,d),n.y(y+35,d),n.scale(.88,d)];break;
  case 'spin':case 'turn':case 'look':case 'sniff':case 'hover':ops=[n.rotation(r+24*shift,d),n.x(x+41*shift,d)];break;
  case 'sway':case 'shake':case 'pull':ops=[n.rotation(r+(index%2?14:-15),d),n.y(y-22,d)];break;
  case 'open-door':case 'split':ops=[n.x(x-125,d),n.rotation(r-22,d)];break;
  case 'submit':case 'pass':case 'handshake':case 'help':ops=[n.x(x+151*shift,d),n.y(y-50,d),n.rotation(r-14*shift,d)];break;
  case 'reject':case 'disagree':case 'block':case 'protest':ops=[n.x(x-90*shift,d),n.rotation(r+17*shift,d),a.opacity(.85,d)];break;
  case 'write':case 'mark':case 'note':case 'trace':case 'circle':case 'crossout':ops=[n.rotation(r+9*shift,d),n.x(x+37,d),n.y(y+12,d)];break;
  case 'count':case 'compare':case 'weigh':case 'inspect':case 'pay':case 'question':ops=[n.scale(1.10,d),n.rotation(r+8*shift,d)];break;
  case 'vote':case 'stamp':case 'pound':case 'press':ops=[n.y(y+76,d),n.scale(.90,d),a.opacity(1,d)];break;
  case 'unfold-map':case 'zoom':ops=[n.scale(1.29,d),n.rotation(r-5*shift,d)];break;
  case 'heat':case 'expand':case 'rise':ops=[n.y(y-100,d),n.scale(1.35,d),a.opacity(.76,d)];break;
  case 'ignore':case 'wait':case 'still':case 'rest':case 'sit':case 'hold':ops=[n.opacity(.72,d),n.y(y+34,d)];break;
  case 'brake':case 'stop-car':ops=[n.rotation(r-8*shift,d),n.x(x+45*shift,d)];break;
  case 'negotiate':case 'sign':case 'scroll':case 'read':case 'post':ops=[n.x(x+72*shift,d),n.rotation(r+6*shift,d),a.opacity(.8,d)];break;
  default:ops=[n.rotation(r+12*shift,d),n.y(y-28,d)];break;
 }
 yield* all(...ops);
}
/** Narrative-specific event tempo, instead of a universal recurring six-beat animation. */
function* physicalPerformance(stage:Node,scene:NarrativeScene,perf:Perf,actors:Puppet[]):ThreadGenerator{
 const n=perf.events.length;
 const weights=perf.events.map((e,i)=>1+(e.includes('drive')||e.includes('cross')?.3:0)+(i===2?.15:0));
 const norm=weights.reduce((a,b)=>a+b,0);
 for(let i=0;i<n;i++){
  const [idxS,verb]=perf.events[i].split('.');
  const ai=Number(idxS),part=Math.max(.35,scene.duration*weights[i]/norm);
  const motion=Math.min(part*.38,1.6+(i%2)*.22);
  const ops:ThreadGenerator[]=[act(actors[ai],verb,motion,ai)];
  // Camera is tied to drama: close objects in intimate shots; the set stays in frame.
  if(i===1 && (perf.lens==='tracking'||perf.lens==='pan')){
   ops.push(stage.x((perf.id.charCodeAt(0)%2?-30:30),motion));
  }else if(i===n-1 && (perf.lens==='close'||perf.lens==='dramatic')){
   ops.push(stage.scale(1.035,motion));
  }else if(i===2 && perf.lens==='overhead'){
   ops.push(stage.rotation(1.25,motion));
  }
  yield* all(...ops);
  if(part>motion)yield* waitFor(part-motion);
 }
}
function* subtitles(scene:NarrativeScene,element:Txt):ThreadGenerator{
 let clock=0;
 for(const cue of scene.cues){
  if(cue.start>clock)yield* waitFor(cue.start-clock);
  element.text(cue.display);clock=cue.start;
 }
 if(scene.duration>clock)yield* waitFor(scene.duration-clock);
 element.text('');
}
export function* playPhysicalScene(view:View2D,scene:NarrativeScene):ThreadGenerator{
 const perf=PLANS.get(scene.id);if(!perf)throw new Error('No authored physical performance for '+scene.id);
 const worldLayer=new Node({}),titleLayer=new Node({}),backLayer=new Node({}),subtitleLayer=new Node({});
 view.add(worldLayer);view.add(titleLayer);view.add(backLayer);view.add(subtitleLayer);view.fill(C.navy);
 const world=new Node({});worldLayer.add(world);
 backdrop(world,scene,perf);
 const order=perf.actors.map((kind,i)=>{
  const loc=actorLayout(perf,i);
  return makePuppet(world,kind,loc.x,loc.y,loc.scale);
 });
 // Consistent editorial typography, independent of the moving physical world.
 rect(titleLayer,0,-469,1920,142,'#07111B',0);
 const part=scene.chapter==='prologue'?'PROLOGUE':scene.chapter==='epilogue'?'EPILOGUE':scene.chapter==='cta'?'CTA':scene.chapter.toUpperCase();
 label(titleLayer,part,-786,-508,24,C.ochre);
 label(titleLayer,scene.id,836,-507,23,C.muted);
 label(titleLayer,scene.title,0,-452,scene.title.length>20?34:42,C.paper);
 rect(backLayer,0,456,1920,172,'#02070E',0).opacity(.94);
 const caption=label(subtitleLayer,'',0,454,41,C.paper);caption.lineHeight(58);
 yield* all(physicalPerformance(world,scene,perf,order),subtitles(scene,caption));
}
