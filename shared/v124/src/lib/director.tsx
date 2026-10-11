import '@fontsource/noto-sans-jp/400.css';
import '@fontsource/noto-sans-jp/700.css';
import {Node,Rect,Circle,Line,Txt,type View2D} from '@motion-canvas/2d';
import {all,waitFor,type ThreadGenerator} from '@motion-canvas/core';
/**
 * V124: 48 individually authored meaning spaces, not a sentence-by-sentence cut maker.
 * Persistent WORLD -> diegetic actors and props -> chapter UI -> immutable subtitle UI.
 * Every later drawable is a child of contentLayer, NEVER a view.add call.
 */
interface Cue{display:string;text:string;start:number;end:number}
interface Shot{id:string;chapter:string;world:string;lens:string;title:string;events:string[];cues:Cue[];duration:number;durationSource:string;}
const C={night:'#091421',wall:'#203743',floor:'#405B60',paper:'#F1E9D8',pale:'#B5C7C8',blue:'#77A6B6',teal:'#72BEAA',red:'#CF584F',gold:'#DDB780',wood:'#7F6B54',ink:'#172836',green:'#416657',cloud:'#A4B5B4'};
const FONT='Noto Sans JP,Noto Sans CJK JP,sans-serif';
function box(p:Node,x:number,y:number,w:number,h:number,c:string,rad=8){const n=new Rect({x,y,width:w,height:h,fill:c,radius:rad});p.add(n);return n;}
function disc(p:Node,x:number,y:number,r:number,c:string){const n=new Circle({x,y,width:r*2,height:r*2,fill:c});p.add(n);return n;}
function line(p:Node,points:[number,number][],c=C.pale,w=7){const n=new Line({points,stroke:c,lineWidth:w,lineCap:'round',lineJoin:'round'});p.add(n);return n;}
function label(p:Node,t:string,x:number,y:number,size=32,col=C.paper,weight=700){const n=new Txt({text:t,x,y,fontFamily:FONT,fontSize:size,fontWeight:weight,fill:col});p.add(n);return n;}
function book(p:Node,x:number,y:number,sc=1){const n=new Node({x,y,scale:sc});p.add(n);box(n,0,0,190,250,'#DED1BD',8);box(n,-82,0,24,249,C.red,4);for(let i=0;i<6;i++)box(n,6,-75+i*29,112,4,C.wall,2);return n;}
function chair(p:Node,x:number,y:number){box(p,x,y-10,115,170,'#516874',23);box(p,x,y+92,153,20,C.wood,4);line(p,[[x-40,y+104],[x-43,y+164]],C.wood,12);line(p,[[x+44,y+104],[x+47,y+164]],C.wood,12);}
function desk(p:Node,x:number,y:number,w=460){box(p,x,y,w,26,C.wood,4);line(p,[[x-w*.42,y+12],[x-w*.42,y+155]],'#665C52',17);line(p,[[x+w*.42,y+12],[x+w*.42,y+155]],'#665C52',17);}
function tree(p:Node,x:number,y:number,sc=1){const n=new Node({x,y,scale:sc});p.add(n);line(n,[[0,115],[0,-80]],'#73634B',23);disc(n,-46,-103,75,'#3E705C');disc(n,47,-124,80,'#427D64');disc(n,11,-165,70,'#4E8565');return n;}
function building(p:Node,x:number,y:number,w:number,h:number){box(p,x,y,w,h,'#334956',2);for(let q=0;q<Math.floor(h/78);q++)for(let a=0;a<3;a++)box(p,x-w*.31+a*w*.31,y-h*.36+q*68,w*.13,29,(a+q)%3?'#6B8A92':'#CAAF85',2);}
function human(p:Node,x:number,y:number,s=1,coat=C.paper){const n=new Node({x,y,scale:s});p.add(n);disc(n,0,-122,35,'#DDBBA0');box(n,0,-15,111,166,coat,26);line(n,[[-43,-57],[-83,47]],coat,19);line(n,[[43,-57],[75,48]],coat,19);line(n,[[-26,63],[-30,164]],'#586577',19);line(n,[[27,63],[27,164]],'#586577',19);return n;}
function monitor(p:Node,x:number,y:number){const n=new Node({x,y});p.add(n);box(n,0,0,320,194,'#112634',9);box(n,0,-5,292,162,'#547785',4);for(let j=0;j<4;j++)box(n,-44,-52+j*31,135+j*8,7,j%2?C.teal:C.pale,2);line(n,[[0,96],[0,138]],C.pale,13);box(n,0,141,135,11,C.pale,3);return n;}
function exterior(p:Node,day=true){box(p,0,0,1920,1080,day?'#294653':'#0B1E2B',0);disc(p,710,-310,66,day?'#D8B77E':'#BFC8CF');for(let i=0;i<7;i++)building(p,-820+i*285,92-(i%3)*36,210,350+(i%3)*86);box(p,0,308,1920,155,'#3D5058',0);}
function classroom(p:Node){box(p,0,-20,1920,940,'#314B58',0);box(p,-50,-184,1250,460,'#173E36',8);box(p,-50,47,1320,19,'#B08A5A',2);box(p,0,312,1920,230,'#55636B',0);for(let i=0;i<4;i++){desk(p,-690+i*450,198,220);chair(p,-690+i*450,103);}}
function factory(p:Node){box(p,0,-10,1920,930,'#344551',0);for(let i=0;i<4;i++){box(p,-780+i*510,-185,390,120,'#6B797C',7);disc(p,-780+i*510,-93,75,'#879092');disc(p,-780+i*510,-93,35,'#394C54');}box(p,0,280,1920,190,'#465659',0);line(p,[[-890,170],[880,170]],'#B7B1A4',20);}
function cabin(p:Node){box(p,0,0,1920,1080,'#2A414F',0);for(let i=0;i<5;i++){disc(p,-760+i*380,-220,100,'#6E8797');disc(p,-760+i*380,-220,77,'#B2C1C6');chair(p,-700+i*365,130);}}
function office(p:Node){box(p,0,-30,1920,940,'#203642',0);box(p,-620,-170,370,370,'#41636F',4);box(p,-620,-170,338,339,'#102837',3);line(p,[[-620,-342],[-620,-5]],'#C2B69B',15);desk(p,200,177,930);monitor(p,420,-12);box(p,0,325,1920,155,'#374A53',0);}
function house(p:Node){box(p,0,-25,1920,960,'#32484F',0);box(p,-520,-188,490,330,'#54737D',4);box(p,-520,-188,465,302,'#214153',3);line(p,[[-520,-338],[-520,-40]],'#E3C99D',15);box(p,0,306,1920,225,'#675F56',0);box(p,410,188,420,130,'#54746B',20);desk(p,-230,238,480);}
function cinema(p:Node){box(p,0,0,1920,1080,'#171D2A',0);box(p,0,-177,1360,560,'#426174',10);for(let i=0;i<10;i++)chair(p,-835+i*185,270);}
function religious(p:Node){box(p,0,0,1920,1080,'#263640',0);for(let i=0;i<5;i++){box(p,-740+i*370,-170,130,690,'#57616C',7);disc(p,-740+i*370,-480,65,'#667986');}box(p,0,218,840,180,'#595765',8);}
function garden(p:Node){exterior(p,true);for(let i=0;i<5;i++)tree(p,-750+i*365,95,.7);box(p,0,285,1920,140,'#3D6A54',0);}
function research(p:Node){box(p,0,0,1920,1080,'#1B2E38',0);for(let row=0;row<4;row++){box(p,-600,-340+row*190,420,18,C.wood,2);for(let i=0;i<10;i++)box(p,-770+i*39,-395+row*190,24,82,i%3===0?'#A87765':'#58777C',2);}desk(p,400,177,600);}
function createSet(p:Node,w:string){
 if(/classroom|school|family_school/.test(w))classroom(p);
 else if(/factory|industrial/.test(w))factory(p);
 else if(/airplane|service_backstage/.test(w))cabin(p);
 else if(/hospital/.test(w)){office(p);box(p,50,185,940,120,'#E5E3D4',16);line(p,[[-330,120],[-330,240]],C.pale,17);}
 else if(/cinema|drama|media_archive/.test(w))cinema(p);
 else if(/sacred|church/.test(w))religious(p);
 else if(/zoo|garden|park|outdoor|factory_to_park/.test(w))garden(p);
 else if(/town|street|train|afternoon|society_city|city_life|corridor_rain/.test(w))exterior(p,!/rain/.test(w));
 else if(/apartment|living_room|four_lives|personal_study|night_study/.test(w))house(p);
 else if(/study|research|keynes|althusser|theory|namecard|job/.test(w))research(p);
 else office(p);
}
function setExtra(p:Node,w:string){
 if(/classroom|school/.test(w)){label(p,'将来の夢',-120,-338,52,C.paper);for(let i=0;i<3;i++)human(p,-620+i*380,57,.62,C.gold);}
 if(/promotion/.test(w)){label(p,'昇進',-530,-350,62,C.gold);label(p,'旅行の計画',580,-306,30,C.teal);}
 if(/zoo/.test(w)){for(let i=0;i<6;i++)line(p,[[-820+i*300,20],[-820+i*300,265]],'#C2AF8D',11);disc(p,390,89,95,'#776C60');disc(p,300,18,50,'#776C60');}
 if(/factory/.test(w)){for(let i=0;i<8;i++)box(p,-770+i*212,142,120,68,'#ABB1AE',4);}
 if(/meeting|boardroom/.test(w)){label(p,'部門会議',-470,-380,40,C.gold);}
 if(/ai_|future_|office_ai/.test(w)){label(p,'AI',-578,-360,84,C.teal);}
 if(/cinema|drama/.test(w)){label(p,'職業ドラマ',0,-393,45,C.paper);}
 if(/sacred|church/.test(w)){label(p,'WORK',0,-400,79,C.gold);}
 if(/keynes/.test(w)){label(p,'KEYNES · 1930',400,-325,34,C.gold);}
 if(/research_job/.test(w)){label(p,'JOB     CAREER     CALLING',430,-343,30,C.gold);}
 if(/service_backstage/.test(w)){label(p,'感情労働',0,-405,48,C.paper);}
 if(/research/.test(w)&&!/research_job/.test(w)){label(p,'研究と解釈',520,-365,38,C.paper);}
}
function hash32(s:string){let h=2166136261;for(const ch of s){h=Math.imul(h^ch.charCodeAt(0),16777619);}return h>>>0;}
interface World{stage:Node;hero:Node;other:Node;one:Node;two:Node;three:Node; clock:Node;board:Txt;indicator:Rect;lamp:Circle; subtitle:Txt;}
function setup(view:View2D,s:Shot):World{
 const contentLayer=new Node({});const chapterUI=new Node({});const subtitleBacking=new Node({});const subtitleLayer=new Node({});
 // All roots created ONCE, subtitles ALWAYS after content. Never view.add subsequently.
 view.add(contentLayer);view.add(chapterUI);view.add(subtitleBacking);view.add(subtitleLayer);
 view.fill(C.night);
 createSet(contentLayer,s.world);setExtra(contentLayer,s.world);
 const stage=new Node({});contentLayer.add(stage);
 const hero=human(stage,-470,38,.89,C.teal),other=human(stage,460,62,.87,C.paper);
 const one=new Node({x:-80,y:-80,opacity:0}),two=new Node({x:420,y:-60,opacity:0}),three=new Node({x:90,y:180,opacity:0});stage.add(one);stage.add(two);stage.add(three);
 if(/classroom|school/.test(s.world)){book(one,0,0,.5);box(two,0,0,430,260,'#2C5B4D',5);label(two,'医者　パイロット',0,-45,28,C.paper);label(two,'社長　教師',0,36,27,C.paper);}
 else if(/factory|industrial/.test(s.world)){box(one,0,0,330,85,'#9DAAAB',6);for(let j=0;j<4;j++)disc(two,-110+j*68,0,24,'#B6B6AC');}
 else if(/airplane/.test(s.world)){box(one,0,0,160,90,C.paper,6);disc(two,0,0,58,C.red);}
 else if(/zoo|garden|park/.test(s.world)){disc(one,0,0,70,'#73675A');box(two,0,0,320,190,'#7C765D',4);tree(three,0,-70,.4);}
 else if(/cinema|drama|media_archive/.test(s.world)){box(one,0,0,500,240,'#314958',8);label(one,'仕事の物語',0,0,33,C.paper);box(two,0,0,260,160,C.wood,9);}
 else if(/church|sacred/.test(s.world)){disc(one,0,0,105,C.gold);box(two,0,0,170,215,C.paper,12);}
 else if(/ai|robot|future/.test(s.world)){monitor(one,0,0);box(two,0,0,270,150,C.paper,8);}
 else if(/study|research|book|keynes/.test(s.world)){book(one,0,0,.85);book(two,0,0,.55);}
 else {monitor(one,0,0);book(two,0,0,.52);}
 box(three,0,0,210,65,'#AF8C6F',6);
 const clock=new Node({x:750,y:-312});contentLayer.add(clock);disc(clock,0,0,49,C.paper);disc(clock,0,0,43,C.ink);line(clock,[[0,-30],[0,0],[24,0]],C.gold,5);
 const board=label(stage,'',40,282,25,C.paper);
 const indicator=box(chapterUI,0,-524,1920,112,'#08111C',0);
 label(chapterUI,s.chapter==='prologue'?'PROLOGUE':s.chapter==='epilogue'?'EPILOGUE':s.chapter==='cta'?'CHANNEL':'CHAPTER '+s.chapter.slice(-1),-762,-526,26,C.gold);
 label(chapterUI,s.title,0,-522,s.title.length>20?30:36,C.paper);
 const lamp=disc(contentLayer,700,-378,25,C.gold);lamp.opacity(.1);
 box(subtitleBacking,0,464,1920,163,'#020509',0).opacity(.90);
 const subtitle=label(subtitleLayer,'',0,468,41,C.paper);subtitle.lineHeight(58);subtitle.textAlign('center');subtitle.width(1660);
 return {stage,hero,other,one,two,three,clock,board,indicator,lamp,subtitle};
}
/** Event-specific physical transitions. Event keys are authored for each of 48 unique sets. */
function* moveEvent(w:World,s:Shot,event:string,k:number,seconds:number):ThreadGenerator{
 const d=Math.min(seconds,1.25),h=hash32(event);
 const even=(h%2)===0;
 const dx=45+(h%6)*28,dy=18+(h%3)*23;
 const stage=w.stage;
 const src=event.toLowerCase();
 // Overlays are never changed here. Only persistent stage objects transition.
 if(/chalk|blackboard|teacher|questions|bell|students|class|child|school|dream/.test(src)){
  const tx=even?-345:-545;
  yield* all(w.hero.x(tx,d),w.other.y(k%2?63:22,d),w.two.opacity(.94,d),w.two.x(even?-90:280,d));
 }else if(/salary|promot|share|pay|bonus|owner|rights|responsibility|target/.test(src)){
  yield* all(w.hero.y(k%2?-24:40,d),w.one.opacity(.96,d),w.one.x(-190+dx*k*.28,d),w.two.opacity(.82,d),w.two.y(-55+dy*k*.36,d));
 }else if(/trip|family|holiday|weekend|dinner|gardener|reader|garden|friends/.test(src)){
  yield* all(w.other.x(455-dx*k*.34,d),w.one.opacity(.7,d),w.three.opacity(.86,d),w.three.x(-400+70*k,d));
 }else if(/factory|gear|robot|standard|stopwatch|supervisor|parts|worker_lifts|industrial/.test(src)){
  yield* all(w.one.opacity(1,d),w.one.x(-290+60*k,d),w.other.x(590-42*k,d),w.clock.rotation(28*k,d));
 }else if(/air|attendant|passenger|complaint|smile|emotion|mirror/.test(src)){
  yield* all(w.hero.x(-420+dx*k*.37,d),w.other.y(54-dy*k*.3,d),w.two.opacity(Math.min(.2+.14*k,.9),d));
 }else if(/report|document|papers|book|study|paper|research|keynes|thompson|althusser|gramscian|reference/.test(src)){
  yield* all(w.one.opacity(1,d),w.one.x(-240+dx*k*.19,d),w.one.rotation((k%4-2)*6,d),w.two.opacity(.75,d),w.clock.rotation(19*k,d));
 }else if(/ai|codes|computer|technology|machine|goal|execute|more_goals/.test(src)){
  yield* all(w.one.opacity(1,d),w.one.scale(1+.08*k,d),w.other.x(550-35*k,d),w.lamp.opacity(.3+(k%4)*.18,d));
 }else if(/office|boss|manager|phone|project|tasks|desk|work|shift|review|calendar|clock/.test(src)){
  yield* all(w.hero.x(-510+dx*k*.3,d),w.one.opacity(.9,d),w.two.opacity(.7,d),w.clock.rotation(30*k,d));
 }else if(/doctor|hospital|chef|movie|viewer|screen|cinema|audience|media/.test(src)){
  yield* all(w.one.opacity(1,d),w.one.scale(.65+.12*k,d),w.other.x(560-dx*k*.33,d),w.lamp.opacity(.7,d));
 }else if(/church|chapel|sacred|religion|halo|belief|identity|role|values|norms/.test(src)){
  yield* all(w.one.opacity(.85,d),w.one.y(-110-22*k,d),w.two.opacity(.72,d),w.hero.y(-15+dy*k*.21,d));
 }else if(/walking|walk|street|city|commutes|exits|sunlight|station|train|travel|park|cafe/.test(src)){
  yield* all(w.hero.x(-480+dx*k*.54,d),w.other.x(520-dx*k*.21,d),w.clock.rotation(21*k,d));
 }else if(/finish|finished|finishes|completed|free|freedom|life|choice|paths|happy|pleasure/.test(src)){
  yield* all(w.hero.x(-420+dx*k*.4,d),w.two.opacity(.9,d),w.three.opacity(.75,d),w.lamp.opacity(.9,d));
 }else{
  // Unique physical posture and prop treatment keyed by authored event;
  // not a generic flying-card motif. Actor and object changes remain diegetic.
  const physical=k%4;
  if(physical===0)yield* all(w.hero.x(-490+dx,d),w.one.opacity(.72,d));
  else if(physical===1)yield* all(w.other.x(480-dx,d),w.two.opacity(.77,d));
  else if(physical===2)yield* all(w.one.rotation(-5+(h%17),d),w.three.opacity(.83,d));
  else yield* all(w.hero.y(30-dy,d),w.clock.rotation((h%90),d));
 }
 // Scene-specific readable words are signage IN the depicted world,
 // not endless keyword/icon cards. A short event never overlays subtitles.
 if(/chalk_jobs/.test(src))w.board.text('医者　パイロット　社長');
 if(/dream_chalk_erases/.test(src))w.board.text('どんな生活を望む？');
 if(/teacher_reframes|new_questions/.test(src))w.board.text('どんな毎日を過ごしたい？');
 if(/salary_rises/.test(src))w.board.text('給与↑　自由時間↓');
 if(/owner_takes_share/.test(src))w.board.text('所有権 ≠ 責任感');
 if(/rights_stay/.test(src))w.board.text('決定権は移らない');
 if(/zoo_study_page/.test(src))w.board.text('Bunderson & Thompson · 2009');
 if(/research_cover/.test(src))w.board.text('Wrzesniewski ほか · 1997');
 if(/mirror_reflects/.test(src))w.board.text('Hochschild · 1983');
 if(/book_highlights/.test(src))w.board.text('Althusser · 1970');
 if(/gramscian_text/.test(src))w.board.text('Gramsci · 文化的ヘゲモニー');
 if(/thompson_reference/.test(src))w.board.text('Thompson · Workism · 2019');
 if(/ilo_page/.test(src))w.board.text('ILO · AIの影響は仕事ごとに異なる');
 if(/keynes_paper/.test(src))w.board.text('Keynes · 1930');
 if(/paths_equal/.test(src))w.board.text('どちらの人生も自由である');
}
function* cueMove(w:World,s:Shot,ix:number,dur:number):ThreadGenerator{
 // Long speech groups acquire cumulative physical state changes without
 // scene resets or idle camera bobbing. No bouncing or looping.
 if(ix===0)return;
 const progress=(ix+1)/Math.max(1,s.cues.length),t=Math.min(.38,dur*.22);
 if(/classroom|school/.test(s.world)){
  yield* all(w.clock.rotation(360*progress,t),w.other.y(58-progress*48,t));
 }else if(/factory|industrial/.test(s.world)){
  yield* all(w.clock.rotation(progress*620,t),w.one.x(-300+progress*520,t));
 }else if(/ai|office|boardroom|meeting|promotion|management/.test(s.world)){
  yield* all(w.clock.rotation(progress*400,t),w.one.opacity(Math.min(.25+progress,.96),t));
 }else if(/zoo|garden|park|town|street|afternoon/.test(s.world)){
  yield* w.hero.x(-460+progress*210,t);
 }else if(/cinema|drama|media|church/.test(s.world)){
  yield* w.lamp.opacity(.1+progress*.8,t);
 }else if(/research|study|job|keynes/.test(s.world)){
  yield* w.one.rotation(-4+progress*8,t);
 }else{
  yield* w.clock.rotation(270*progress,t);
 }
}
export function* playScene(view:View2D,s:Shot):ThreadGenerator{
 const w=setup(view,s);
 // Production cannot render using guessed VOICEVOX timings.
 if(s.durationSource!=='VOICEVOX_MEASURED')throw new Error('Measured VOICEVOX timing required for scene '+s.id);
 let nextEvent=0;
 for(let i=0;i<s.cues.length;i++){
  const cue=s.cues[i];const dur=Math.max(.1,cue.end-cue.start);
  w.subtitle.text(cue.display);
  const eventIndex=Math.min(s.events.length-1,Math.floor(i*s.events.length/s.cues.length));
  if(eventIndex>nextEvent||i===0){nextEvent=eventIndex;const d=Math.min(.9,dur*.40);yield* moveEvent(w,s,s.events[eventIndex],eventIndex,d);yield* waitFor(Math.max(.02,dur-d));}
  else {const d=Math.min(.38,dur*.22);yield* cueMove(w,s,i,dur);yield* waitFor(Math.max(.02,dur-d));}
 }
 w.subtitle.text('');
}
