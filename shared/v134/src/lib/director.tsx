import '@fontsource/noto-sans-jp/400.css';
import '@fontsource/noto-sans-jp/700.css';
import {Node, Rect, Circle, Line, Txt, type View2D} from '@motion-canvas/2d';
import {all, waitFor, type ThreadGenerator} from '@motion-canvas/core';

/** V134 original Motion Canvas scene director. All scenes use true measured VOICEVOX cues.
 * Per-beat families include temples, craftspeople, maps, scrolls, fame/merit charts,
 * audience networks, responsibility diagrams, and reconstruction. No still-image slideshow.
 */
interface Cue {text:string; speech:string; display:string; start:number; end:number}
interface Shot {id:string;chapter:string;section:string;visual:string;title:string;note:string;
 cues:Cue[];duration:number;durationSource:string;sceneIndex:number;sceneTotal:number}
interface Drawing {family:string;actors:Node[];markers:Node[];bars:Rect[];labels:Txt[];anchor:Node|null}
const C={bg:'#080E18',deep:'#101B2A',panel:'#162738',panel2:'#1E3846',
 line:'#517389',white:'#F6F6ED',muted:'#ABC0C8',gold:'#F0C26B',red:'#E86160',
 blue:'#81B5E6',teal:'#60D9C1',stone:'#D0D0BE',dark:'#03080F'};
const FONT='Noto Sans JP, Noto Sans CJK JP, sans-serif';
function rect(p:Node,x:number,y:number,w:number,h:number,fill:string,r=8):Rect{
 const n=new Rect({x,y,width:w,height:h,fill,radius:r});p.add(n);return n;
}
function dot(p:Node,x:number,y:number,d:number,fill:string):Circle{
 const n=new Circle({x,y,width:d,height:d,fill});p.add(n);return n;
}
function edge(p:Node,xy:[number,number][],color=C.line,lw=5):Line{
 const n=new Line({points:xy,stroke:color,lineWidth:lw,lineCap:'round',lineJoin:'round'});p.add(n);return n;
}
function txt(p:Node,t:string,x:number,y:number,size=35,color=C.white):Txt{
 const n=new Txt({text:t,x,y,fontFamily:FONT,fontSize:size,fontWeight:700,fill:color,textAlign:'center'});p.add(n);return n;
}
function slab(p:Node,x:number,y:number,w:number,h:number,title:string,highlight=C.teal):Node{
 const n=new Node({x,y});p.add(n);
 rect(n,0,0,w,h,C.panel2,18);rect(n,0,-h/2+12,w-32,9,highlight,4);
 txt(n,title,0,0,title.length>14?25:title.length>9?31:38);
 return n;
}
function person(p:Node,x:number,y:number,color=C.blue):Node{
 const n=new Node({x,y});p.add(n);
 dot(n,0,-99,59,C.stone);
 rect(n,0,5,100,160,color,23);
 edge(n,[[-29,73],[-42,155]],color,14);edge(n,[[30,73],[40,155]],color,14);
 edge(n,[[-46,-27],[-100,48]],color,13);edge(n,[[46,-27],[97,52]],color,13);
 return n;
}
function familyOf(v:string):string{
 if(['hook','verdict','mirror'].includes(v))return 'mirror';
 if(['phone','feed'].includes(v))return 'media';
 if(['outrage','network','flow','spiral'].includes(v))return 'network';
 if(['chronology','history'].includes(v))return 'time';
 if(['temple','columns','rebuild','builder','labor'].includes(v))return 'temple';
 if(['map','trade'].includes(v))return 'map';
 if(['nameban','stamp','forbidden','curiosity'].includes(v))return 'ban';
 if(['kleos','epic','choice','contrast','reputation','alexander'].includes(v))return 'heroes';
 if(['source','document','historian','research','caveat'].includes(v))return 'source';
 if(['ledger','scale','namebalance','comparison','score','balance'].includes(v))return 'comparison';
 if(['triangle'].includes(v))return 'triangle';
 if(['victim'].includes(v))return 'victim';
 return 'concept';
}
function* move(d:Drawing,s:Shot,i:number,t:number):ThreadGenerator{
 const k=s.cues.length,phase=(i+1)/k;
 const dur=Math.min(.57,Math.max(.12,t*.24));
 const anim:ThreadGenerator[]=[];
 if(d.family==='temple'){
   // Each spoken thought physically adds, repairs, or emphasizes construction.
   d.bars.forEach((b,j)=>{if(j%Math.max(1,Math.ceil(d.bars.length/5))===i%Math.max(1,Math.ceil(d.bars.length/5))){
     anim.push(b.height(250+(s.visual==='rebuild'?80*phase:35*phase),dur));
     anim.push(b.y(47-(s.visual==='rebuild'?40*phase:17*phase),dur));
   }});
   if(d.actors.length)anim.push(d.actors[i%d.actors.length].x(-650+phase*1150,dur));
 }else if(d.family==='network'){
   d.markers.slice(i%4,i%4+5).forEach((n,j)=>anim.push(n.scale(1.16+(phase*.16),dur)));
   if(d.actors.length)anim.push(d.actors[i%d.actors.length].y(-20+((i%3)-1)*20,dur));
 }else if(d.family==='ban'){
   d.bars.forEach((b,j)=>anim.push(b.width(j===0?350+phase*480:610+phase*150,dur)));
   if(d.markers.length)anim.push(d.markers[i%d.markers.length].opacity(.4+.6*phase,dur));
 }else if(d.family==='media'){
   if(d.markers.length){const n=d.markers[i%d.markers.length];anim.push(n.y(-135+(i%4)*68,dur));}
   if(d.bars.length)anim.push(d.bars[i%d.bars.length].width(80+190*phase,dur));
 }else if(d.family==='comparison'||d.family==='heroes'){
   if(d.actors.length)anim.push(d.actors[i%d.actors.length].scale(1+(.08*(i%2+1)),dur));
   if(d.bars.length)anim.push(d.bars[i%d.bars.length].height(80+135*phase,dur));
 }else if(d.family==='source'){
   if(d.markers.length)anim.push(d.markers[i%d.markers.length].x(-330+(i%4)*140,dur));
   if(d.bars.length)anim.push(d.bars[i%d.bars.length].width(80+140*phase,dur));
 }else if(d.family==='map'){
   if(d.markers.length)anim.push(d.markers[i%d.markers.length].scale(1+(.22*phase),dur));
   if(d.actors.length)anim.push(d.actors[i%d.actors.length].x(-540+phase*1030,dur));
 }else if(d.family==='time'){
   if(d.markers.length)anim.push(d.markers[i%d.markers.length].y((i%2?15:-15),dur));
   if(d.actors.length)anim.push(d.actors[i%d.actors.length].x(-570+phase*1140,dur));
 }else if(d.family==='victim'){
   if(d.actors.length)anim.push(d.actors[i%d.actors.length].scale(1+phase*.12,dur));
 }else{
   if(d.markers.length)anim.push(d.markers[i%d.markers.length].scale(1+phase*.1,dur));
   if(d.actors.length)anim.push(d.actors[i%d.actors.length].y(-10+phase*25,dur));
 }
 if(anim.length)yield* all(...anim);else yield* waitFor(dur);
 yield* waitFor(Math.max(.01,t-dur));
}
function art(s:Shot,p:Node):Drawing{
 const f=familyOf(s.visual);const actors:Node[]=[],markers:Node[]=[],bars:Rect[]=[],labels:Txt[]=[];
 let anchor:Node|null=null;
 const accent=s.chapter==='chapter3'?C.red:s.chapter==='chapter4'?C.teal:s.chapter==='epilogue'?C.gold:C.blue;
 // Different chapter narratives share a persistent layout, while in-scene graphic states change.
 const v=s.visual;
 if(f==='mirror'){
   rect(p,-420,0,690,460,C.panel2,22);
   rect(p,420,0,690,460,C.panel,22);
   const human=person(p,-420,-10,C.blue);actors.push(human);
   const inner=slab(p,420,0,540,190,v==='verdict'?'観客が歴史をつくる':v==='hook'?'軽蔑するあなたへ':'その怒りは誰の利益？',C.red);
   markers.push(inner);
   txt(p,'行為',-420,260,30,C.muted);txt(p,'反応',420,260,30,C.muted);
   edge(p,[[-15,35],[15,35]],C.gold,8);
 }else if(f==='media'){
   const phone=new Node({x:-470,y:10});p.add(phone);
   rect(phone,0,0,490,570,C.dark,35);rect(phone,0,0,460,545,C.panel2,25);
   rect(phone,0,-120,395,190,'#314657',12);
   dot(phone,0,-120,70,C.red);txt(phone,'▶',4,-120,31,C.white);
   txt(phone,'迷惑行為',0,5,36,C.white);
   for(let i=0;i<5;i++)markers.push(slab(p,265+i%2*260,-155+Math.floor(i/2)*175,230,128,['怒り','拡散','批判','解説','検索'][i],i%2?C.gold:C.red));
   bars.push(rect(phone,0,235,50,12,C.teal,5));
   actors.push(phone);
 }else if(f==='network'){
   const center=dot(p,-540,5,145,C.red);markers.push(center);
   txt(p,'投稿',-540,5,37,C.white);
   const pts:[[number,number],[number,number]][]=[];
   for(let i=0;i<11;i++){
      const x= -220+(i%4)*275, y=-210+Math.floor(i/4)*208;
      edge(p,[[-450,0],[x,y]],i%3?C.line:C.gold,3);
      const n=dot(p,x,y,67,i%3===0?C.red:i%3===1?C.teal:C.blue);markers.push(n);
   }
   txt(p,'閲覧　→　怒り　→　共有　→　拡散',60,310,43,C.white);
 }else if(f==='time'){
   edge(p,[[-775,70],[765,70]],C.gold,9);
   const years=['紀元前356年','古代の記録','現代'];
   years.forEach((y,i)=>{
      const x=-580+i*580;const n=dot(p,x,70,62,i===0?C.red:i===1?C.blue:C.teal);markers.push(n);
      txt(p,y,x,165,43,C.white);
   });
   const pointer=dot(p,-630,67,21,C.white);actors.push(pointer);
   txt(p,'歴史を横断する名声',0,-215,56,C.gold);
 }else if(f==='map'){
   rect(p,0,0,1570,590,'#15303A',16);
   // Schematic geography, explicitly labelled: not a geographic dataset.
   edge(p,[[-725,-145],[-540,-230],[-310,-160],[-120,-205],[120,-80],[330,-140],[540,-20],[710,130]],C.line,36);
   edge(p,[[-650,130],[-380,155],[-170,90],[80,185],[280,90],[510,175]],C.blue,18);
   markers.push(dot(p,375,95,66,C.gold));txt(p,'エフェソス',425,28,53,C.white);
   txt(p,'地中海世界（模式図）',0,-260,37,C.muted);
   actors.push(dot(p,-540,135,24,C.teal));
 }else if(f==='temple'){
   rect(p,0,250,1500,34,C.stone,4);
   rect(p,0,-240,1440,42,C.stone,2);
   rect(p,0,-209,1350,22,C.gold,2);
   for(let i=0;i<7;i++)bars.push(rect(p,-570+i*190,15,84,235,C.stone,8));
   const top=new Node({x:0,y:-290});p.add(top);
   edge(top,[[-720,75],[0,-28],[720,75]],C.stone,22);
   txt(p,v==='rebuild'?'破壊の後、再び築く':v==='builder'?'無名の職人たち':'アルテミス神殿',0,320,40,C.white);
   if(['builder','labor','rebuild'].includes(v))actors.push(person(p,-650,140,C.teal));
 }else if(f==='ban'){
   rect(p,0,0,1410,590,'#DDD2B6',18);
   rect(p,0,-235,1370,14,C.gold,3);rect(p,0,232,1370,14,C.gold,3);
   txt(p,'ヘロストラトス',0,-68,80,C.dark);
   bars.push(rect(p,0,-37,360,26,C.red,6));
   bars.push(rect(p,0,57,610,11,C.red,4));
   markers.push(slab(p,0,155,690,110,'その名を記録するな',C.red));
 }else if(f==='heroes'){
   const left=slab(p,-430,40,700,415,v==='alexander'?'アレクサンドロス':'英雄の名声',C.blue);
   const right=slab(p,430,40,700,415,'悪名による名声',C.red);
   actors.push(left,right);
   txt(p,'功績',-430,-244,48,C.teal);
   txt(p,'破壊',430,-244,48,C.red);
   txt(p,'≠',0,45,73,C.gold);
 }else if(f==='source'){
   const paper=new Node({x:0,y:0});p.add(paper);
   rect(paper,0,0,1370,570,'#DBD0AF',13);
   txt(paper,v==='research'?'SNS拡散の観察研究':
     v==='historian'?'史料の中に残る名前':
     v==='caveat'?'伝承と確定事実は異なる':'古代の記録を読む',0,-211,46,C.dark);
   for(let i=0;i<6;i++)bars.push(rect(paper,-380, -110+i*63,260,13,'#8F978B',5));
   markers.push(slab(paper,330,25,600,240,v==='research'?'政治投稿56万件以上':
     v==='caveat'?'動機の断定はできない':
     v==='historian'?'歴史家が名を保存':'史料の制約を確認',C.gold));
 }else if(f==='comparison'){
   const titles=v==='score'?['再生回数','社会的な価値']:
    v==='scale'?['知名度','功績']:
    v==='namebalance'?['無名の創造者','有名な破壊者']:
    ['社会が記憶','社会が忘れる'];
   actors.push(slab(p,-435,5,665,410,titles[0],C.teal));
   actors.push(slab(p,435,5,665,410,titles[1],C.red));
   txt(p,'≠',0,-10,90,C.gold);
   bars.push(rect(p,-400,255,185,13,C.teal,6));
   bars.push(rect(p,400,255,185,13,C.red,6));
 }else if(f==='triangle'){
   const xys:[[number,number],[number,number],[number,number]]=[[-550,220],[0,-270],[550,220]];
   const labs=['報道する','注目を与える','責任を問う'];
   edge(p,[xys[0],xys[1],xys[2],xys[0]],C.gold,6);
   xys.forEach((xy,i)=>{markers.push(dot(p,xy[0],xy[1],105,[C.blue,C.red,C.teal][i]));txt(p,labs[i],xy[0],xy[1]+85,38,C.white);});
 }else if(f==='victim'){
   rect(p,0,-15,1600,575,C.panel,20);
   actors.push(person(p,-480,-30,C.red));
   actors.push(person(p,380,-30,C.blue));
   actors.push(person(p,565,10,C.teal));
   txt(p,'加害者',-500,265,43,C.red);txt(p,'被害を受けた側',460,265,43,C.white);
   txt(p,'画面の中央にいるのは誰か？',0,-285,49,C.gold);
 }else{
   markers.push(slab(p,0,-15,1280,400,'名が残ること ≠ 価値を残すこと',accent));
 }
 return {family:f,actors,markers,bars,labels,anchor};
}
export function* playScene(view:View2D,s:Shot):ThreadGenerator{
 if(s.durationSource!=='VOICEVOX_MEASURED')throw new Error('Unmeasured narration: '+s.id);
 const content=new Node({}),heading=new Node({}),captionBase=new Node({}),subtitle=new Node({});
 view.add(content);view.add(heading);view.add(captionBase);view.add(subtitle);
 view.fill(C.bg);
 rect(content,0,0,1920,1080,C.bg,0);
 rect(content,0,0,1870,955,C.deep,10);
 edge(content,[[-915,-382],[915,-382]],C.line,2);
 edge(content,[[-915,359],[915,359]],C.line,2);
 const drawing=art(s,content);
 txt(content,s.note,0,347,28,C.muted);
 rect(heading,0,-480,1920,122,C.dark,0);
 txt(heading,s.chapter==='prologue'?'PROLOGUE':s.chapter==='epilogue'?'EPILOGUE':
 'CHAPTER '+s.chapter.replace('chapter',''),-766,-480,23,C.gold);
 txt(heading,s.title,0,-480,s.title.length>18?35:41,C.white);
 txt(heading,s.section,750,-480,23,C.muted);
 rect(captionBase,0,452,1920,176,C.dark,0).opacity(.98);
 const sub=txt(subtitle,'',0,453,42,C.white);sub.width(1640);sub.lineHeight(60);
 sub.textAlign('center');
 for(let i=0;i<s.cues.length;i++){
   const cue=s.cues[i];const dur=cue.end-cue.start;
   if(!(dur>0))throw new Error('Bad cue duration '+s.id);
   sub.text(cue.display);
   yield* move(drawing,s,i,dur);
 }
 sub.text('');
}
