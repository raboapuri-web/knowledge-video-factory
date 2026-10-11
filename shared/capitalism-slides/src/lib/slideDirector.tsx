import {Circle, Line, Node, Rect, Txt, type View2D} from '@motion-canvas/2d';
import {all, easeOutCubic, easeInOutCubic, waitFor, type ThreadGenerator} from '@motion-canvas/core';

interface Cue {text:string;speech:string;display:string;start:number;end:number}
interface Shot {id:string;chapter:string;index:number;title:string;kind:string;labels:string[];metric?:string;source?:string;narration:string;cues:Cue[];duration:number;durationSource:string}
const C={bg:'#090f1a',paper:'#f7f4ed',secondary:'#b2bec9',subtle:'#738597',red:'#ef6e68',teal:'#69d0bb',gold:'#eac380',card:'#172537',card2:'#233447',line:'#40566a',ink:'#101f2e'};
const FONT='Noto Sans JP, sans-serif';
const MAX_CONTENT_WIDTH=1580, CONTENT_CENTER_Y=-45,CONTENT_HEIGHT=690;
const LABEL_LIMIT=21;

function text(content:string,size:number,color:string=C.paper,weight=700,width?:number) {
 return new Txt({text:content,fontFamily:FONT,fontSize:size,fontWeight:weight,fill:color,textAlign:'center',textWrap:true,width});
}
function row(width:number,height:number,gap:number):Rect {
 return new Rect({width,height,layout:true,direction:'row',alignItems:'center',justifyContent:'center',gap});
}
function column(width:number,height:number,gap:number):Rect {
 return new Rect({width,height,layout:true,direction:'column',alignItems:'center',justifyContent:'center',gap});
}
function labelSize(value:string):number{
 if(value.length>17)return 25;
 if(value.length>12)return 30;
 if(value.length>8)return 35;
 return 43;
}
function roundedCard(value:string,width=430,height=230,color=C.card,accent=C.line) {
 const card=column(width,height,24);
 card.fill(color);card.radius(22);card.stroke(accent);card.lineWidth(2);
 const title=text(value,labelSize(value),C.paper,700,width-44);
 card.add(title);
 return card;
}
function smallTag(value:string,width=370){
 const card=column(width,80,8);
 card.radius(14);card.fill(C.card2);card.stroke(C.line);card.lineWidth(2);
 card.add(text(value,value.length>15?23:30,C.paper,700,width-28));
 return card;
}

function makeSlide(s:Shot) {
 const root=column(MAX_CONTENT_WIDTH,CONTENT_HEIGHT,28);
 root.x(0);root.y(CONTENT_CENTER_Y);root.opacity(0);
 const kicker=text(s.chapter.toUpperCase()+'  /  '+String(s.index+1).padStart(2,'0'),23,C.teal,700,1450);
 root.add(kicker);
 root.add(text(s.title,64,C.paper,700,1500));
 const graphic=column(1540,420,14);
 graphic.fill('rgba(16,28,43,0.48)');graphic.radius(26);
 const reveals:Node[]=[];
 const addReveal=(obj:Node)=>{obj.opacity(0.13);reveals.push(obj);return obj;};
 const labels=s.labels.slice(0,4);
 if(s.kind==='metric'||s.kind==='environment') {
   const n=column(1410,270,14);
   const big=s.metric||'約15億人';
   const size=big.length>12?91:big.length>8?118:146;
   addReveal(n);
   n.add(text(big,size,s.kind==='environment'?C.gold:C.teal,700,1380));
   n.add(text(s.kind==='environment'?'経済成長と環境改善の並行':s.title,29,C.secondary,400,1270));
   graphic.add(n);
   const tags=row(1450,96,18);
   for(const lab of labels.slice(0,3))addReveal(tags.add(smallTag(lab,420)) as any);
   graphic.add(tags);
 }else if(s.kind==='compare'||s.kind==='contrast'||s.kind==='caveat'){
   const pair=row(1460,340,30);
   const a=roundedCard(labels[0]||'比較A',670,310,s.kind==='contrast'?'#32202c':C.card,C.red);
   const b=roundedCard(labels[1]||'比較B',670,310,s.kind==='contrast'?'#143631':C.card,C.teal);
   addReveal(a);addReveal(b);pair.add(a);pair.add(b);
   graphic.add(pair);
   if(labels.length>2){const l=text(labels.slice(2).join('  /  '),28,C.secondary,700,1400);graphic.add(l);}
 }else if(s.kind==='process'||s.kind==='timeline'||s.kind==='network'||s.kind==='growth'){
   const cards=row(1510,370,20);
   const items=labels.slice(0,4);
   const width=Math.floor((1480-(items.length-1)*20)/items.length);
   for(let i=0;i<items.length;i++){
     const item=column(width,300,15);
     item.fill(i%2?C.card2:C.card);item.radius(22);
     item.stroke(s.kind==='growth'?C.gold:C.line);item.lineWidth(2);
     item.add(text(s.kind==='timeline'?String(i+1).padStart(2,'0'):s.kind==='growth'?'▮':s.kind==='network'?'●':String(i+1).padStart(2,'0'),55,i%2?C.gold:C.teal,700));
     item.add(text(items[i],labelSize(items[i]),C.paper,700,width-32));
     addReveal(item);
     cards.add(item);
   }
   graphic.add(cards);
 }else if(s.kind==='curve') {
   const group=new Node({});
   const panel=new Rect({width:1330,height:340,fill:C.card,radius:24});
   group.add(panel);
   group.add(new Line({points:[[-520,75],[-300,0],[-110,-95],[80,-150],[270,-80],[470,60]],stroke:C.teal,lineWidth:15,lineCap:'round',lineJoin:'round'}));
   group.add(new Line({points:[[-545,112],[540,112]],stroke:C.subtle,lineWidth:3}));
   group.add(text('競争と革新の関係は単純な直線ではない',38,C.paper,700,1270));
   addReveal(group);graphic.add(group);
 }else if(s.kind==='question'||s.kind==='closing'||s.kind==='title'){
   const question=column(1420,250,15);
   question.add(text(s.kind==='title'?'資本主義は人類の敵なのか？':s.kind==='question'?'何と比較すべきなのか？':s.title,76,s.kind==='closing'?C.gold:C.paper,700,1380));
   addReveal(question);graphic.add(question);
   const tags=row(1480,125,20);
   const width=Math.floor((1460-Math.max(0,labels.length-1)*20)/Math.max(1,labels.length));
   labels.forEach(l=>{const item=smallTag(l,Math.min(600,width));addReveal(item);tags.add(item);});
   graphic.add(tags);
 }else{
   const trio=row(1480,360,20);
   const width=Math.floor((1460-Math.max(0,labels.length-1)*20)/Math.max(1,labels.length));
   labels.forEach(l=>{const v=roundedCard(l,Math.min(670,width),290);addReveal(v);trio.add(v);});
   graphic.add(trio);
 }
 root.add(graphic);
 // Footnotes are reserved in normal layout instead of being drawn over the graph.
 const source=s.source||(['chapter3','chapter5'].includes(s.chapter)?'資料・研究の対象、比較条件に注意':'');
 root.add(text(source||' ',source.length>55?20:23,C.subtle,400,1510));
 return {root,reveals};
}

function createFrame(view:View2D) {
 const slideLayer=new Node({});
 const headerLayer=new Node({});
 const subtitleBacking=new Node({});
 const subtitleLayer=new Node({});
 // Immutable layer order: even if slides are appended later, subtitles render last.
 view.add(slideLayer);view.add(headerLayer);view.add(subtitleBacking);view.add(subtitleLayer);
 view.fill(C.bg);
 const header=new Rect({x:0,y:-475,width:1920,height:120,fill:'#0c1826'});
 headerLayer.add(header);
 const leftMark=new Rect({x:-838,y:-469,width:8,height:46,radius:4,fill:C.red});headerLayer.add(leftMark);
 const logo=text('考える夜',38,C.paper,700);logo.x(-685);logo.y(-475);headerLayer.add(logo);
 const section=text('CAPITALISM / ECONOMIC HISTORY',23,C.secondary,400);section.x(610);section.y(-482);headerLayer.add(section);
 const topRule=new Rect({x:0,y:-412,width:1690,height:2,fill:C.line});headerLayer.add(topRule);
 // Subtitle extends to the very edge. The body never uses y>300.
 const subtitleBox=new Rect({x:0,y:455,width:1920,height:184,fill:'#03070d'});
 subtitleBacking.add(subtitleBox);
 const separator=new Rect({x:0,y:363,width:1920,height:3,fill:C.red});subtitleBacking.add(separator);
 const sub=text('',41,C.paper,700,1730);sub.y(455);sub.lineHeight(60);subtitleLayer.add(sub);
 return {slideLayer,sub};
}
export function* playChapter(view:View2D, shots:Shot[]):ThreadGenerator{
 if(!shots.length)throw new Error('Chapter is empty');
 if(shots.some(s=>s.durationSource!=='VOICEVOX_MEASURED'))throw new Error('Unmeasured VOICEVOX timeline refused');
 const {slideLayer,sub}=createFrame(view);
 let previous:Rect|null=null;
 for(const s of shots){
   const {root,reveals}=makeSlide(s);
   slideLayer.add(root);
   let done=0;
   for(let ci=0;ci<s.cues.length;ci++){
     const cue=s.cues[ci];const duration=cue.end-cue.start;
     if(!(duration>0))throw new Error('Invalid duration '+s.id);
     sub.text(cue.display);if(cue.display.includes('\\n'))throw new Error('Rendered literal newline token');
     let used=0;
     if(ci===0){
       if(previous){
         yield* all(previous.opacity(0,0.20),root.opacity(1,0.20),root.scale(1,0.20,easeOutCubic));
         previous.remove();
       }else{
         yield* root.opacity(1,0.22);
       }
       previous=root;used+=0.22;
     }
     const trigger=Math.floor(ci*reveals.length/s.cues.length);
     const next=Math.floor((ci+1)*reveals.length/s.cues.length);
     if(next>done){
       const start=done;const additions=reveals.slice(start,next);
       const beatTime=Math.min(0.33,Math.max(0.10,(duration-used)*0.44));
       if(additions.length)yield* all(...additions.map(n=>n.opacity(1,beatTime,easeOutCubic)));
       used+=beatTime;done=next;
     }
     yield* waitFor(Math.max(0.02,duration-used));
   }
   // No additional duration between scenes: all narrated text is preserved verbatim.
 }
 sub.text('');
}
