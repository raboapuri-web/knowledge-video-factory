import '@fontsource/noto-sans-jp/400.css';
import '@fontsource/noto-sans-jp/700.css';
import {Circle, Line, Node, Rect, Txt, type View2D} from '@motion-canvas/2d';
import {all, waitFor, type ThreadGenerator} from '@motion-canvas/core';
import visualPlan from '../../content/visual_plan.json';

type Cue={text:string;display:string;start:number;end:number};
type Scene={id:string;chapter:string;motif:string;title:string;narration:string;cues:Cue[];duration:number};
type Plan={kind:string;motion:string;labels:string[]};
const K={bg:'#08111B',deep:'#10202B',wall:'#18303B',floor:'#324B55',paper:'#F0ECE2',muted:'#9EAFB7',red:'#CF5753',gold:'#D7AE69',cyan:'#6EB5B6',teal:'#6F988A',blue:'#607F9A',green:'#718D72',brown:'#735F4E',sand:'#A8926C',ice:'#9FC0CC',ink:'#17252E'};
const F='Noto Sans JP, Noto Sans CJK JP, sans-serif';
const hash=(s:string)=>[...s].reduce((a,c)=>((a*33)^c.charCodeAt(0))>>>0,122);
const txt=(v:string,x:number,y:number,size=30,color=K.paper,weight=700)=>new Txt({text:v,x,y,fontFamily:F,fontSize:size,fill:color,fontWeight:weight});
function box(p:Node,x:number,y:number,w:number,h:number,color:string,r=8,stroke?:string){const q=new Rect({x,y,width:w,height:h,fill:color,radius:r,stroke:stroke??color,lineWidth:stroke?2:0});p.add(q);return q}
function disk(p:Node,x:number,y:number,r:number,color:string){const q=new Circle({x,y,width:r*2,height:r*2,fill:color});p.add(q);return q}
function line(p:Node,pts:[number,number][],color=K.muted,w=5){const q=new Line({points:pts,stroke:color,lineWidth:w,lineCap:'round',lineJoin:'round'});p.add(q);return q}
function arrow(p:Node,a:[number,number],b:[number,number],color=K.gold,w=6){const q=new Line({points:[a,b],stroke:color,lineWidth:w,endArrow:true,arrowSize:14});p.add(q);return q}
function human(p:Node,x:number,y:number,s=.7,color=K.paper){const n=new Node({x,y,scale:s});p.add(n);disk(n,0,-74,26,color);box(n,0,12,70,118,color,18);line(n,[[-28,-15],[-58,65]],color,13);line(n,[[28,-15],[58,65]],color,13);line(n,[[-20,68],[-23,145]],color,14);line(n,[[20,68],[23,145]],color,14);return n}
function labelCard(p:Node,s:string,x:number,y:number,w=250,color=K.cyan){box(p,x,y,w,72,K.deep,12,color);p.add(txt(s,x,y,24,color,700))}
function tree(p:Node,x:number,y:number,s=1,leaf=K.green){line(p,[[x,y+100*s],[x,y-40*s]],K.brown,18*s);disk(p,x,y-85*s,62*s,leaf);disk(p,x-45*s,y-55*s,46*s,leaf);disk(p,x+45*s,y-50*s,44*s,leaf)}
function snow(p:Node,seed:number){for(let i=0;i<28;i++){const x=-900+((seed>>(i%16))%1800),y=-360+((seed>>(i%11+2))%650);disk(p,x,y,2+(i%3),K.paper)}}
function clock(p:Node,x:number,y:number,label='14:00'){disk(p,x,y,68,K.paper);disk(p,x,y,61,K.deep);line(p,[[x,y],[x+28,y-30]],K.paper,5);line(p,[[x,y],[x,y-40]],K.paper,5);p.add(txt(label,x,y+100,24,K.gold))}
function book(p:Node,x:number,y:number,s=.7,color=K.cyan){const n=new Node({x,y,scale:s});p.add(n);box(n,-45,0,82,116,color,8);box(n,45,0,82,116,color,8);line(n,[[0,-54],[0,55]],K.paper,3)}
function laptop(p:Node,x:number,y:number,s=.7){const n=new Node({x,y,scale:s});p.add(n);box(n,0,0,180,110,'#273A45',7);box(n,0,-5,155,82,'#0E1921',4);line(n,[[-110,70],[110,70]],K.muted,12)}
function gear(p:Node,x:number,y:number,r=58,color=K.blue){disk(p,x,y,r,color);disk(p,x,y,r*.38,K.bg)}
function meter(p:Node,x:number,y:number,w:number,value:number,color=K.cyan){box(p,x,y,w,25,'#233741',7);box(p,x-w*(1-value)/2,y,w*value,25,color,7)}
function baseBackdrop(root:Node,scene:Scene,plan:Plan){
 box(root,0,0,1920,1080,K.bg,0);
 const h=hash(scene.motif+plan.kind+plan.motion);
 for(let i=0;i<8;i++){const x=-850+((h>>(i%12))%1700),y=-330+((h>>(i%9+2))%590);disk(root,x,y,2+(i%3),i%2?K.gold:K.cyan)}
}
function apartment(root:Node,seed:number){
 box(root,0,-20,1920,900,'#122632',0);box(root,-460,70,650,470,'#203945',12);box(root,520,-90,390,280,'#0E1B25',6);box(root,520,-90,360,250,'#1A303B',4);box(root,0,305,1920,160,'#293E45',0);
 box(root,-430,180,500,32,K.brown,8);box(root,-650,250,24,125,K.paper,0);box(root,-210,250,24,125,K.paper,0);
 laptop(root,-470,115,.7);clock(root,650,-250,'14:00');
 for(let i=0;i<4;i++)box(root,610+i*48,180,34,95,[K.red,K.gold,K.cyan,K.paper][i],4);
 if(seed%2)book(root,-245,-145,.5,K.gold);
}
function forest(root:Node,seed:number,winter=true){
 box(root,0,0,1920,930,winter?'#14232C':'#23382D',0);box(root,0,260,1920,380,winter?'#D7DFDF':'#405A43',0);
 for(let i=0;i<9;i++)tree(root,-820+i*210,130+(i%2)*20,.75,winter?'#344A50':'#657B52');
 if(winter)snow(root,seed);disk(root,720,-260,70,winter?K.ice:K.gold);
}
function den(root:Node,seed:number){
 forest(root,seed,true);box(root,0,330,1920,150,'#4B4038',0);box(root,0,250,620,270,'#261E1B',120);human(root,0,250,.55,K.sand);
}
function biologyLab(root:Node){
 box(root,0,0,1920,930,'#102631',0);box(root,0,20,1500,660,'#183845',16,K.floor);
 for(let i=0;i<5;i++)line(root,[[-650,-210+i*105],[650,-210+i*105]],'#31515E',2);
}
function soil(root:Node,desert=false){
 box(root,0,-150,1920,620,desert?'#6E5A3E':'#19313A',0);box(root,0,230,1920,360,desert?'#9D7D50':'#4D3C31',0);
 if(desert){disk(root,700,-250,85,K.gold);for(let i=0;i<7;i++)line(root,[[-850+i*260,160],[-820+i*260,70]],'#6D573D',7)}
}
function village(root:Node){
 box(root,0,-90,1920,850,'#183038',0);box(root,0,205,1920,390,'#4A5C43',0);
 for(let i=0;i<5;i++){box(root,-720+i*350,80,250,190,'#5A5146',8);line(root,[[-850+i*350,-5],[-720+i*350,-110],[-590+i*350,-5]],K.brown,10)}
 disk(root,720,-270,78,K.gold);
}
function factory(root:Node){
 box(root,0,-40,1920,920,'#162631',0);for(let i=0;i<5;i++){box(root,-700+i*350,60,250,470,'#273E48',4);box(root,-700+i*350,-130,180,160,'#365765',3)}
 for(let i=0;i<5;i++)gear(root,-650+i*325,235,54,i%2?K.gold:K.blue);
}
function office(root:Node){
 box(root,0,-30,1920,920,'#132833',0);box(root,0,220,1250,38,'#6B655C',7);laptop(root,0,80,1.05);for(let i=0;i<4;i++)box(root,-650+i*430,-200,280,160,'#233F4A',7);
}
function research(root:Node){
 box(root,0,0,1920,930,'#14252E',0);box(root,0,0,1450,690,'#E8E2D6',12);box(root,0,300,1500,35,'#6F655B',4);
}
function writer(root:Node){
 box(root,0,0,1920,930,'#121F2A',0);box(root,0,190,850,35,K.brown,8);laptop(root,-120,80,1);book(root,320,80,.7,K.gold);clock(root,620,-240,'01:00');
}
function roadWorld(root:Node,fog=false){
 box(root,0,0,1920,930,fog?'#26343A':'#122834',0);line(root,[[0,310],[0,-300]],'#536B74',100);line(root,[[-15,310],[-15,-300]],K.paper,5);
 if(fog)box(root,0,-60,1920,650,'#A6B1B2',0).opacity(.22);
}
function investment(root:Node){
 box(root,0,0,1920,930,'#122631',0);box(root,-430,30,430,460,'#293F49',8);box(root,420,30,520,500,'#203A46',6);
 for(let i=0;i<4;i++)gear(root,320+i*95,160,38,i%2?K.gold:K.blue);
}
function springWorld(root:Node){
 forest(root,hash('spring'),false);box(root,0,330,1920,110,'#594A3A',0);for(let i=0;i<7;i++){line(root,[[-700+i*230,280],[-700+i*230,210]],K.green,8);disk(root,-700+i*230,195,14,K.cyan)}
}
function seasonWheel(root:Node){
 box(root,0,0,1920,930,'#10242D',0);const cols=[K.cyan,K.gold,K.red,K.ice];for(let i=0;i<4;i++){const a=-Math.PI/2+i*Math.PI/2,x=Math.cos(a)*420,y=Math.sin(a)*220;disk(root,x,y,90,cols[i]);line(root,[[0,0],[x,y]],K.muted,6)}
 disk(root,0,0,105,K.deep);
}
function setupWorld(root:Node,scene:Scene,plan:Plan){
 const seed=hash(scene.motif);baseBackdrop(root,scene,plan);const k=plan.kind;
 if(k.includes('apartment')||k.includes('phone')||k.includes('frozen')||k.includes('identity'))apartment(root,seed);
 else if(k.includes('winter')||k.includes('autumn')||k.includes('spring-emergence'))forest(root,seed,!k.includes('autumn'));
 else if(k.includes('den'))den(root,seed);
 else if(k.includes('physiology')||k.includes('micro')||k.includes('biology-gallery')||k.includes('core-systems')||k.includes('restart'))biologyLab(root);
 else if(k.includes('seed')||k.includes('desert'))soil(root,k.includes('desert'));
 else if(k.includes('village'))village(root);
 else if(k.includes('factory')||k.includes('investment'))factory(root);
 else if(k.includes('office')||k.includes('calendar')||k.includes('human-low-power')||k.includes('home-head'))office(root);
 else if(k.includes('research')||k.includes('study')||k.includes('four-fields'))research(root);
 else if(k.includes('writer')||k.includes('creative')||k.includes('resume'))writer(root);
 else if(k.includes('road')||k.includes('crossroad')||k.includes('waiting')||k.includes('decisions'))roadWorld(root,k.includes('fog')||k.includes('waiting'));
 else if(k.includes('season-circle')||k.includes('season-wheel'))seasonWheel(root);
 else if(k.includes('underground')){forest(root,seed,true);box(root,0,290,1920,210,'#4B3C31',0)}
 else if(k.includes('preindustrial'))village(root);
 else if(k.includes('industrial'))factory(root);
 else if(k.includes('energy-ledger')||k.includes('growth-dashboard')||k.includes('task-stack')||k.includes('thesis'))research(root);
 else springWorld(root);
}
function prop(node:Node,scene:Scene,plan:Plan,i:number){
 const label=plan.labels[i],k=plan.kind,m=scene.motif;
 if(k.includes('winter')||k.includes('autumn')||k.includes('den')){if(i<4){disk(node,0,0,56,i%2?K.ice:K.gold);for(let j=0;j<4;j++)line(node,[[0,0],[Math.cos(j*Math.PI/2)*75,Math.sin(j*Math.PI/2)*75]],K.paper,5)}else human(node,0,20,.38,i>5?K.cyan:K.paper)}
 else if(k.includes('seed')||k.includes('desert')){disk(node,0,15,40,i<4?K.brown:K.green);if(i>=4)line(node,[[0,10],[0,-75]],K.green,9)}
 else if(k.includes('micro')){for(let j=0;j<5;j++)disk(node,(j-2)*28,(j%2)*24,18,i<4?K.blue:K.teal)}
 else if(k.includes('factory')||k.includes('investment')){gear(node,0,5,58,i%2?K.gold:K.blue)}
 else if(k.includes('office')||k.includes('calendar')||k.includes('home-head')){box(node,0,0,140,110,i>=4?K.red:K.paper,10);line(node,[[-45,-20],[45,-20]],K.ink,5);line(node,[[-45,15],[30,15]],K.ink,5)}
 else if(k.includes('writer')||k.includes('creative')||k.includes('resume')){book(node,0,0,.7,i%2?K.gold:K.cyan)}
 else if(k.includes('road')||k.includes('crossroad')||k.includes('waiting')||k.includes('decisions')){box(node,0,0,170,80,i%2?K.gold:K.cyan,12)}
 else if(k.includes('research')||k.includes('study')||k.includes('four-fields')){box(node,0,0,165,130,K.paper,8);line(node,[[-55,-30],[55,-30]],K.ink,5);line(node,[[-55,0],[45,0]],K.ink,5);line(node,[[-55,30],[25,30]],K.ink,5)}
 else if(k.includes('season')||k.includes('growth'))disk(node,0,0,58,[K.cyan,K.gold,K.red,K.ice][i%4]);
 else if(k.includes('phone')){box(node,0,0,120,190,K.ink,18);box(node,0,0,94,154,'#244452',10)}
 else{box(node,0,0,170,90,i%2?K.gold:K.cyan,12)}
 node.add(txt(label,0,105,23,K.paper,700));
 if(m==='energy_budget'&&i<6)meter(node,0,-80,160,Math.max(.15,1-i*.13),i<3?K.red:K.cyan);
}
function initialPosition(i:number,seed:number):[number,number]{const x=-650+(i%4)*430+((seed>>(i%8))&30)-15;const y=-120+Math.floor(i/4)*250+((seed>>(i+3))&20)-10;return [x,y]}
function* animateStates(nodes:Node[],scene:Scene,plan:Plan):ThreadGenerator{
 const seed=hash(scene.motif+plan.motion);const base=[.018,.13,.245,.36,.475,.59,.705,.82];let cursor=0;
 for(let i=0;i<8;i++){
  const [x,y]=initialPosition(i,seed);nodes[i].x(i%2?950:-950);nodes[i].y(y-70);nodes[i].scale(.55);
  const at=scene.duration*Math.min(.87,base[i]+((seed>>(i%11))&5)*.003);
  if(at>cursor)yield* waitFor(at-cursor);cursor=at;const d=Math.min(.78,Math.max(.26,scene.duration*.022));
  yield* all(nodes[i].x(x,d),nodes[i].y(y,d),nodes[i].opacity(1,d),nodes[i].scale(.82,d));cursor+=d;
  if(i>=2){nodes[i-2].opacity(.48);nodes[i-2].scale(.68)}
  if(plan.motion.includes('descent')&&i>=2)nodes[i].y(y+30);
  if(plan.motion.includes('overload')&&i>=4)nodes[i].rotation(i%2?7:-7);
  if(plan.motion.includes('partial-germination')&&i>=4)nodes[i-3].opacity(.12);
  if(plan.motion.includes('season-swap')&&i>=4)nodes[i-4].opacity(.16);
  if(plan.motion.includes('mental-office')&&i>=4)nodes[i].x(x-90);
  if(plan.motion.includes('traffic-detour')&&i>=3)nodes[i].x(x+(i%2?120:-120));
  if(plan.motion.includes('doors-close')&&i>=4)nodes[i-4].scale(.45);
  if(plan.motion.includes('calendar-only')&&i>0)nodes[i-1].opacity(.18);
  if(plan.motion.includes('hidden-processes')&&i>=4)nodes[i].y(y+55);
  if(plan.motion.includes('complete-cycle')&&i===7)nodes.forEach(n=>n.opacity(.92));
 }
 const end=scene.duration*.93;if(end>cursor){yield* waitFor(end-cursor);cursor=end}
 yield* all(nodes[7].scale(1.0,.42),nodes[6].opacity(.78,.42));cursor+=.42;if(scene.duration>cursor)yield* waitFor(scene.duration-cursor)
}
function* subtitleFlow(cues:Cue[],caption:Txt,duration:number):ThreadGenerator{let t=0;for(const c of cues){if(c.start>t)yield* waitFor(c.start-t);caption.text(c.display);t=c.start}if(duration>t)yield* waitFor(duration-t);caption.text('')}
export function* playMeaningScene(view:View2D,scene:Scene):ThreadGenerator{
 const plan=(visualPlan as Record<string,Plan>)[scene.motif];if(!plan)throw new Error('visual plan missing: '+scene.motif);
 view.fill(K.bg);const contentLayer=new Node({});const headingLayer=new Node({});const subtitleBacking=new Node({});const subtitleTextLayer=new Node({});
 view.add(contentLayer);view.add(headingLayer);view.add(subtitleBacking);view.add(subtitleTextLayer);
 setupWorld(contentLayer,scene,plan);const stage=new Node({});contentLayer.add(stage);const nodes:Node[]=[];
 for(let i=0;i<8;i++){const n=new Node({opacity:0});stage.add(n);prop(n,scene,plan,i);nodes.push(n)}
 box(headingLayer,0,-474,1920,132,'#071019',0);const part=scene.chapter==='prologue'?'PROLOGUE':scene.chapter==='epilogue'?'EPILOGUE':scene.chapter.toUpperCase();
 headingLayer.add(txt(part,-800,-508,22,K.gold));headingLayer.add(txt(scene.id,830,-508,21,K.muted));headingLayer.add(txt(scene.title,0,-452,scene.title.length>23?34:43,K.paper,700));
 box(subtitleBacking,0,460,1920,170,'#02060B',0).opacity(.92);const caption=txt('',0,458,41,K.paper,650);caption.lineHeight(58);subtitleTextLayer.add(caption);
 yield* all(animateStates(nodes,scene,plan),subtitleFlow(scene.cues,caption,scene.duration));
}