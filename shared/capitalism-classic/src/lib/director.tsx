import '@fontsource/noto-sans-jp/400.css';
import '@fontsource/noto-sans-jp/700.css';
import {Node,Rect,Circle,Line,Txt,type View2D} from '@motion-canvas/2d';
import {all,easeOutCubic,easeInOutCubic,waitFor,type ThreadGenerator} from '@motion-canvas/core';

/**
 * Capitalism classic: diegetic animation, NOT a slide deck.
 * Physical locations and characters are authored per scene world.
 * An immutable subtitle layer is ALWAYS drawn on top.
 */
interface Cue {text:string;display:string;start:number;end:number}
interface Shot {id:string;world:string;events:string[];title:string;chapter:string;label:string;cues:Cue[];narration:string;duration:number;durationSource:string;}
const C={night:'#0c1928',ink:'#13283a',sky:'#334d60',dawn:'#b07864',wall:'#3d5964',road:'#455563',paper:'#f0e9d8',pale:'#c2ccd1',gold:'#d7b074',red:'#d76d63',teal:'#71bdab',green:'#598070',wood:'#8c765a',steel:'#7f939a',shadow:'#102331'};
const FONT='Noto Sans JP,sans-serif';
function box(p:Node,x:number,y:number,w:number,h:number,color:string,rad=8){const n=new Rect({x,y,width:w,height:h,fill:color,radius:rad});p.add(n);return n;}
function dot(p:Node,x:number,y:number,r:number,color:string){const n=new Circle({x,y,width:r*2,height:r*2,fill:color});p.add(n);return n;}
function line(p:Node,pts:[number,number][],color=C.paper,w=7){const n=new Line({points:pts,stroke:color,lineWidth:w,lineCap:'round',lineJoin:'round'});p.add(n);return n;}
function txt(p:Node,t:string,x:number,y:number,size=32,color=C.paper){const n=new Txt({text:t,x,y,fontFamily:FONT,fontWeight:700,fontSize:size,fill:color,textAlign:'center'});p.add(n);return n;}
function person(p:Node,x:number,y:number,scale=1,coat=C.paper){
 const n=new Node({x,y,scale});p.add(n);
 dot(n,0,-126,39,'#ddbaa0');
 box(n,0,-10,113,172,coat,23);
 line(n,[[-43,-58],[-81,46]],coat,20);
 line(n,[[44,-57],[76,46]],coat,20);
 line(n,[[-28,65],[-32,170]],C.shadow,21);
 line(n,[[27,65],[32,170]],C.shadow,21);
 return n;
}
function house(p:Node,x:number,y:number,w=340){box(p,x,y,w,300,'#4c646e',6);line(p,[[x-w*.55,y-142],[x,y-285],[x+w*.55,y-142]],C.wood,19);box(p,x-83,y-25,105,104,'#6e92a0',6);box(p,x+87,y+52,78,185,C.wood,4);}
function building(p:Node,x:number,y:number,w:number,h:number,lit=true){
 box(p,x,y,w,h,'#314e5e',5);
 for(let j=0;j<Math.max(1,Math.floor(h/65)-1);j++)for(let i=0;i<3;i++){
  const ww=w*.19;
  box(p,x-w*.27+i*w*.27,y-h*.38+j*65,ww,23,lit&&(i+j)%4===0?C.gold:'#587987',2);
 }
}
function table(p:Node,x=0,y=240,w=650){box(p,x,y,w,29,C.wood,4);line(p,[[x-w*.4,y+14],[x-w*.4,y+130]],'#64594e',15);line(p,[[x+w*.4,y+14],[x+w*.4,y+130]],'#64594e',15);}
function monitor(p:Node,x:number,y:number){box(p,x,y,310,190,C.shadow,12);box(p,x,y-9,274,151,'#4a7484',7);line(p,[[x,y+96],[x,y+149]],C.steel,16);box(p,x,y+149,175,15,C.steel,3);}
function cloud(p:Node,x:number,y:number){dot(p,x-65,y,47,'#82919b');dot(p,x,y-25,65,'#82919b');dot(p,x+75,y,45,'#82919b');}
function rural(p:Node,seed:number){
 box(p,0,0,1920,1080,'#344d51',0);
 dot(p,725,-345,83,seed%2?C.dawn:C.gold);
 for(let i=0;i<7;i++){const x=-950+i*320;box(p,x,225,310,160,(i+seed)%2?'#56735e':'#58705a',2);line(p,[[x-140,190],[x+130,290]],'#7b8661',3);}
 house(p,-590,-10,400);house(p,350,-25,270);
 box(p,0,339,1920,170,'#5a685a',0);
}
function city(p:Node,night=true,seed=0){
 box(p,0,0,1920,1080,night?C.night:'#35576a',0);
 dot(p,690,-345,night?55:98,night?'#d8d1bc':C.gold);
 for(let i=0;i<7;i++)building(p,-855+i*285,-90+(i%3)*34,230,520-(i%3)*92,night);
 box(p,0,305,1920,170,'#3e4d57',0);
 for(let i=0;i<11;i++)box(p,-800+i*180,338,97,7,'#d8ba8c',2);
 if(seed%2===0){box(p,700,90,16,400,'#667782',3);dot(p,700,-116,39,'#dbb37e');}
}
function factory(p:Node,seed:number){
 box(p,0,0,1920,1080,seed%3===0?'#293945':'#334651',0);
 for(let i=0;i<4;i++){box(p,-770+i*520,-236,290,255,seed%2?'#6c8186':'#61757b',12);dot(p,-770+i*520,-160,61,'#354d58');dot(p,-770+i*520,-160,36,'#88979b');}
 box(p,0,285,1920,185,'#455762',0);
 line(p,[[-850,185],[860,185]],C.steel,18);
 for(let i=0;i<12;i++)dot(p,-790+i*145,188,13,C.shadow);
}
function port(p:Node){
 box(p,0,0,1920,1080,'#263c4c',0);dot(p,650,-370,85,C.gold);
 box(p,0,230,1920,365,'#35556b',0);
 for(let i=0;i<6;i++){box(p,-665+i*235,5,185,140,i%2?'#986e58':'#6c858b',8);}
 line(p,[[-790,-270],[-790,158],[600,158]],'#97a2a2',21);
 line(p,[[220,-270],[220,130]],'#97a2a2',13);
 box(p,0,310,1290,75,C.shadow,15);
}
function clinic(p:Node){
 box(p,0,0,1920,1080,'#bdcacd',0);box(p,0,295,1920,190,'#82979e',0);
 for(let i=0;i<4;i++){box(p,-650+i*460,-250,312,420,'#799aa6',9);box(p,-650+i*460,-250,280,391,'#9eb6b9',8);}
 box(p,365,177,730,105,'#ebece8',16);txt(p,'+',-590,-330,96,C.red);
}
function study(p:Node){
 box(p,0,0,1920,1080,'#263643',0);
 for(let i=0;i<6;i++){box(p,-850+i*335,-160,285,490,'#5a615e',8);
  for(let j=0;j<5;j++){box(p,-932+i*335+j*43,-215,25,168,(i+j)%3?C.wood:'#668b90',4);}}
 table(p,0,211,1110);
}
function market(p:Node){box(p,0,0,1920,1080,'#4c6268',0);box(p,0,320,1920,155,'#687269',0);for(let i=0;i<5;i++){box(p,-750+i*370,-140,285,375,'#8b978b',11);for(let j=0;j<4;j++)box(p,-750+i*370,-262+j*92,221,17,C.wood,3);}}
function classroom(p:Node){box(p,0,0,1920,1080,'#536b72',0);box(p,-250,-154,1080,420,'#193e39',12);box(p,0,320,1920,170,'#626c6d',0);for(let i=0;i<3;i++)table(p,-610+i*610,222,365);}
function living(p:Node,night=false){box(p,0,0,1920,1080,night?'#263843':'#5e6d6d',0);box(p,-570,-140,500,415,'#85a0a3',6);box(p,-570,-140,470,385,night?'#1c3445':'#a7c4c0',6);box(p,0,325,1920,170,C.wood,0);box(p,440,181,450,178,'#637d76',40);table(p,-290,255,380);}
function stageFor(p:Node,w:string,index:number){
 if(/village|rustic|harvest|sickbed|old_clinic|bread_counter|mill_machine/.test(w))rural(p,index);
 else if(/train|station|street|city|dawn|commute|wealthy|worker_home|forked|sunrise|poverty_map|town_diorama/.test(w))city(p,!/sunrise|dawn|poverty_map/.test(w),index);
 else if(/factory|mill|oven|refrigerator_assembly|warehouse|industrial|conveyor|lab_patent|clean_|smokestack|laboratory_patent|retrofit/.test(w))factory(p,index);
 else if(/port|cargo|ship|freight|coffee_farm|delivery_street/.test(w))port(p);
 else if(/school|training|class|policy_school/.test(w))classroom(p);
 else if(/clinic|hospital|kenya_comparison|epa_lab/.test(w))clinic(p);
 else if(/shop|market|supermarket|store|convenience|bakery|price_market|night_supermarket/.test(w))market(p);
 else if(/study|planning|theatre|utopia|network|system_wheel|phone_network/.test(w))study(p);
 else if(/apartment|dinner|family|wellbeing|coffee_apartment|fridge_repair/.test(w))living(p,/night/.test(w));
 else if(/office|bpo|investor|startup|giant_corp|recruitment|recruiting|hiring|research_lab|digital_office/.test(w))study(p);
 else city(p,true,index);
 // Unique location objects, not generic slide panels.
 if(/commuter_train|station/.test(w)){box(p,0,87,1550,365,'#557684',16);for(let i=0;i<7;i++)box(p,-610+i*225,-20,160,171,'#a1b6bb',8);}
 if(/phone|network/.test(w)){for(let i=0;i<4;i++)dot(p,-670+i*435,-280,16,i%2?C.gold:C.teal);}
 if(/shop|supermarket|convenience/.test(w)){for(let i=0;i<8;i++)box(p,-760+i*205,-140+(i%3)*50,98,70,i%2?C.gold:'#9baea4',5);}
 if(/soup|kitchen/.test(w)){table(p,155,150,720);dot(p,235,105,76,C.wood);}
 if(/coffee/.test(w)){dot(p,230,120,80,C.paper);dot(p,230,120,66,C.wood);}
 if(/oven|bakery/.test(w)){box(p,530,16,570,415,C.shadow,20);dot(p,530,-13,131,C.gold);}
 if(/rail|cargo/.test(w)){box(p,0,284,1920,50,'#627984',4);for(let i=0;i<5;i++)box(p,-700+i*315,180,260,172,'#738e90',14);}
 if(/nairobi|southafrica|kenya/.test(w)){txt(p,'EAST AFRICA',650,-405,31,C.gold);}
 if(/digital|office|bpo|startup|research_lab|investor|employer|hiring/.test(w)){table(p,250,220,760);monitor(p,480,32);}
 if(/fridge|refrigerator/.test(w)){box(p,430,62,330,580,'#d3dce0',19);line(p,[[315,-100],[315,162]],'#657c87',12);}
 if(/epa|smokestack|pollution|clean_factory|carbon/.test(w)){box(p,625,-65,140,580,C.steel,12);cloud(p,650,-360);}
 if(/system_wheel/.test(w)){dot(p,470,-85,235,C.gold);dot(p,470,-85,175,C.shadow);}
 if(/giant_corp/.test(w)){building(p,580,-36,450,740);txt(p,'ENTERPRISE',580,-328,34,C.paper);}
 if(/hospital/.test(w)){box(p,590,-240,240,176,C.paper,8);txt(p,'+',590,-240,115,C.red);}
}
interface World{content:Node;actors:Node;hero:Node;other:Node;prop:Node;tool:Node;vehicle:Node;smoke:Node;spot:Node;ledger:Txt;sub:Txt;}
function init(view:View2D,s:Shot,index:number):World{
 const content=new Node({});const actors=new Node({});const HUD=new Node({});const backing=new Node({});const subtitle=new Node({});
 view.fill(C.night);view.add(content);view.add(actors);view.add(HUD);view.add(backing);view.add(subtitle);
 stageFor(content,s.world,index);
 const hero=person(actors,-420,60,.83,C.paper),other=person(actors,490,67,.82,C.teal);
 const prop=new Node({x:-120,y:-75,opacity:0});actors.add(prop);
 const tool=new Node({x:360,y:-60,opacity:0});actors.add(tool);
 const vehicle=new Node({x:-720,y:193,opacity:0});actors.add(vehicle);
 const smoke=new Node({x:545,y:-285,opacity:0});actors.add(smoke);
 const spot=new Node({x:0,y:0,opacity:0});actors.add(spot);
 // Diegetic props: phones, packages, bakery trays, factory machines, documents or gauges.
 if(/phone|station|commute|street|worker_home/.test(s.world)){box(prop,0,0,92,155,C.shadow,14);box(prop,0,-8,73,132,'#7eabb7',6);}
 else if(/bread|bake|oven|soup|kitchen|family_dinner/.test(s.world)){dot(prop,0,0,67,C.gold);dot(prop,14,-11,39,'#bd865b');}
 else if(/school|training|study|policy|research|planning|investor|lab/.test(s.world)){box(prop,0,0,240,170,C.paper,8);line(prop,[[-70,-43],[70,-43]],C.red,8);}
 else if(/fridge|refrigerator|clean_factory|epa/.test(s.world)){box(prop,0,0,160,250,C.paper,12);box(prop,0,-42,130,100,'#96b8c2',5);}
 else {box(prop,0,0,170,123,C.wood,9);line(prop,[[-70,-40],[70,-40]],C.steel,7);}
 if(/digital|office|bpo|company|nairobi|startup|hiring/.test(s.world))monitor(tool,0,0);
 else if(/factory|mill|oven|industrial|research|lab|clean|smoke/.test(s.world)){dot(tool,0,0,98,C.steel);dot(tool,0,0,46,C.shadow);}
 else {box(tool,0,0,210,122,'#547685',11);txt(tool,'✓',0,0,64,C.paper);}
 box(vehicle,0,0,330,135,'#698590',22);for(let i=-1;i<=1;i+=2)dot(vehicle,i*108,76,38,C.shadow);
 for(let i=0;i<3;i++)cloud(smoke,(i-1)*85,i%2?-35:25);
 dot(spot,0,0,155,'#c39b62');
 const ledger=txt(actors,'',0,264,29,C.paper);ledger.opacity(0);
 // Minimal scene heading that never competes with image or captions.
 box(HUD,0,-504,1920,73,'#071320',0).opacity(.8);
 txt(HUD,s.chapter==='prologue'?'PROLOGUE':s.chapter==='cta'?'CHANNEL':s.chapter==='epilogue'?'EPILOGUE':'CHAPTER '+s.chapter.slice(-1),-735,-505,27,C.gold);
 // Caption overlay is the last layer; no scene can occlude it.
 box(backing,0,460,1920,160,'#02060d',0).opacity(.94);
 box(backing,0,376,1920,3,C.red,0);
 const sub=txt(subtitle,'',0,467,41,C.paper);sub.width(1670);sub.textAlign('center');sub.lineHeight(58);
 return {content,actors,hero,other,prop,tool,vehicle,smoke,spot,ledger,sub};
}
function has(e:string,pat:RegExp){return pat.test(e.toLowerCase());}
function* perform(w:World,event:string,index:number,t:number):ThreadGenerator{
 const d=Math.min(1.25,Math.max(.18,t));
 const k=index;const a=w.hero,b=w.other,p=w.prop,q=w.tool,v=w.vehicle,m=w.smoke,l=w.ledger;
 if(has(event,/train|tram|bus|truck|courier|ship|wagon|route|arrives|depart|vehicle|freight/)){
  yield* all(v.opacity(1,d),v.x(-450+235*k,d,easeInOutCubic),a.x(-430+82*k,d));
 }else if(has(event,/phone|screen|type|tap|payment|notification|glow|contactless|sign/)){
  yield* all(p.opacity(1,d),p.y(-175+19*k,d),a.x(-415+34*k,d),q.opacity(Math.min(.3+.15*k,.92),d));
 }else if(has(event,/soup|meal|food|dinner|bread|oven|dough|coffee|bag|cart|bowl|farmer|bean|grain|flour|loaf|shelf|stock|market|shop/)){
  yield* all(p.opacity(1,d),p.x(-320+120*k,d),b.x(520-80*k,d),q.opacity(Math.min(.22+.22*k,1),d));
 }else if(has(event,/gear|crank|machine|mill|conveyor|production|assembly|retool|industry|factory|plant|device|equipment/)){
  yield* all(q.opacity(1,d),q.rotation(28+65*k,d),p.x(-100+65*k,d),a.y(50-12*k,d));
 }else if(has(event,/price|earnings|paid|salary|poverty|groups|percentage|gdp|graph|comparison|count|growth|rise|decrease|increase|pollution|emission|meter|capital|offer/)){
  const labels=['増加','変化','比較','検証'];l.text(labels[k%4]); 
  yield* all(l.opacity(.8,d),p.opacity(1,d),p.y(-110-13*k,d),q.opacity(Math.min(.2+.2*k,1),d));
 }else if(has(event,/test|research|document|read|notes|patent|book|page|study|clinic|doctor|hospital|training|school|mentor|retest/)){
  yield* all(p.opacity(1,d),p.rotation(-8+4*k,d),a.x(-430+45*k,d),q.opacity(.25+.17*k,d));
 }else if(has(event,/smoke|sky|haze|filter|coolant|fridge|refriger|clean|energy|cloud|environment|retrofit/)){
  yield* all(m.opacity(k===0?.90:.28,d),m.y(-270-24*k,d),q.opacity(Math.min(.25+.2*k,1),d),p.opacity(.78,d));
 }else if(has(event,/gate|door|entry|enter|exit|fork|choose|path|worker|people|family|child|street|walk|job|employee|customer|consumer|move|person/)){
  yield* all(a.x(-460+75*k,d),b.x(530-55*k,d),p.opacity(Math.min(.2+.24*k,1),d));
 }else if(has(event,/contract|sign|rules|policy|competi|giant|launch|rival|winner|switch|research_repeat/)){
  yield* all(p.opacity(1,d),q.opacity(.8,d),b.x(545-65*k,d),q.rotation(13*k,d));
 }else if(has(event,/light|window|dawn|night|sunrise|return|warm|lamp|camera|sun|future/)){
  yield* all(w.spot.opacity(.15+.14*k,d),b.x(490-38*k,d),a.y(55-7*k,d));
 }else {
  // Every authored event changes a physical actor or object, not a text-card.
  if(k%3===0)yield* all(a.x(-410+76*k,d),p.opacity(.82,d));
  else if(k%3===1)yield* all(b.x(500-81*k,d),q.opacity(.7,d));
  else yield* all(p.rotation(14*k,d),v.opacity(.4,d),v.x(-320+125*k,d));
 }
}
function* continuity(w:World,idx:number,length:number,dur:number):ThreadGenerator{
 // A slow physical progression while the narrator develops the same thought.
 const t=Math.min(.28,dur*.15),p=(idx+1)/Math.max(1,length);
 if(idx%4===0)yield* w.hero.x(-420+140*p,t);
 else if(idx%4===1)yield* w.tool.opacity(.3+.65*p,t);
 else if(idx%4===2)yield* w.other.y(65-38*p,t);
 else yield* w.prop.rotation(-7+14*p,t);
}
export function* playScene(view:View2D,s:Shot):ThreadGenerator{
 if(s.durationSource!=='VOICEVOX_MEASURED')throw new Error('Cannot render without actual VOICEVOX durations: '+s.id);
 if(!s.cues.length||s.events.length<3)throw new Error('Incomplete narrated scene: '+s.id);
 const w=init(view,s,Number(s.id.match(/(\d+)$/)?.[1]||0));
 let done=-1;
 for(let i=0;i<s.cues.length;i++){
  const c=s.cues[i];const d=c.end-c.start;if(d<=0)throw new Error('Invalid audio timing '+s.id);
  if(c.display.includes('\\n'))throw new Error('Literal escape detected in subtitle');
  w.sub.text(c.display);
  const eventIndex=Math.min(s.events.length-1,Math.floor(i*s.events.length/s.cues.length));
  if(eventIndex>done){
   done=eventIndex;
   const t=Math.min(.92,d*.42);
   yield* perform(w,s.events[eventIndex],eventIndex,t);
   yield* waitFor(Math.max(.01,d-t));
  }else{
   const t=Math.min(.28,d*.15);
   yield* continuity(w,i,s.cues.length,d);
   yield* waitFor(Math.max(.01,d-t));
  }
 }
 w.sub.text('');
}
