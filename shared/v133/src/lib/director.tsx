import '@fontsource/noto-sans-jp/400.css';
import '@fontsource/noto-sans-jp/700.css';
import {Node, Rect, Circle, Line, Txt, type View2D} from '@motion-canvas/2d';
import {all, waitFor, type ThreadGenerator} from '@motion-canvas/core';

/** V133: 73 scene-specific states, measured sentence audio, permanent topmost captions.
 * No imported footage, no generic stock visuals, no rotating cards or chart distortion.
 * All imagery is original flat vector art, with 16 distinct compositional families.
 */
interface Cue{text:string;display:string;start:number;end:number}
interface Shot{id:string;chapter:string;section:string;visual:string;title:string;note:string;
 cues:Cue[];duration:number;durationSource:string;sceneIndex:number;sceneTotal:number;}
type Art={family:string;nodes:Node[];hands:Node[];drops:Circle[];bars:Rect[];focus:Node|null};
const C={bg:'#091321',navy:'#112839',panel:'#1A3646',line:'#53738A',
 cream:'#F2ECDD',gray:'#ABC2CA',red:'#E66D67',teal:'#64D6BE',gold:'#EDBE6C',
 blue:'#7AB6F0',violet:'#AA95D9',white:'#FBF9F3',dark:'#040B13'};
const FONT='Noto Sans JP, Noto Sans CJK JP, sans-serif';
function rect(p:Node,x:number,y:number,w:number,h:number,fill:string,r=10){
 const o=new Rect({x,y,width:w,height:h,fill,radius:r});p.add(o);return o;}
function dot(p:Node,x:number,y:number,d:number,fill:string){
 const o=new Circle({x,y,width:d,height:d,fill});p.add(o);return o;}
function line(p:Node,pts:[number,number][],color=C.line,lw=5){
 const o=new Line({points:pts,stroke:color,lineWidth:lw,lineCap:'round',lineJoin:'round'});p.add(o);return o;}
function label(p:Node,t:string,x:number,y:number,sz=34,col=C.cream){
 const o=new Txt({text:t,x,y,fontFamily:FONT,fontSize:sz,fontWeight:700,fill:col,textAlign:'center'});p.add(o);return o;}
function slab(p:Node,x:number,y:number,w:number,h:number,t:string,c=C.teal){
 const n=new Node({x,y});p.add(n);rect(n,0,0,w,h,C.panel,18);
 rect(n,0,-h/2+9,w-24,8,c,4);label(n,t,0,0,t.length>12?25:t.length>8?29:37,C.cream);return n;}
function humanoid(p:Node,x:number,y:number,c=C.blue){
 const n=new Node({x,y});p.add(n);dot(n,0,-85,58,C.cream);rect(n,0,10,96,150,c,25);
 line(n,[[-29,76],[-35,142]],c,14);line(n,[[29,76],[35,142]],c,14);
 line(n,[[-48,-22],[-86,50]],c,12);line(n,[[48,-22],[83,50]],c,12);return n;}
function familyOf(v:string):string{
 if(['castle','lady','blood','return'].includes(v))return 'tragedy';
 if(['hands','wash','soap','wipe','shower','clean','mirror'].includes(v))return 'washing';
 if(['bar'].includes(v))return 'bar';
 if(['study','replicate','meta2018','meta2024','replicate2','evidence','warning','douglas'].includes(v))return 'research';
 if(['shrine','torii','temizu','misogi','kegare','underworld'].includes(v))return 'shinto';
 if(['baptism','threshold','ritual'].includes(v))return 'rite';
 if(['soil','table','order'].includes(v))return 'soil';
 if(['worker','suit','reveal'].includes(v))return 'people';
 if(['disgust','pathogen','odor','words','judgement','bias','purity','exclusion'].includes(v))return 'disgust';
 if(['memory','letters','objects','choice','volunteer','body','metaphor','mind'].includes(v))return 'experiment';
 if(['meeting','silence','company'].includes(v))return 'office';
 if(['ledger','apology','path','forgive','past'].includes(v))return 'accountability';
 if(['self','tease','challenge','question','split','irony','bridge'].includes(v))return 'thesis';
 return 'statement';
}
function art(s:Shot,p:Node):Art{
 const v=s.visual,f=familyOf(v),n:Node[]=[],hands:Node[]=[],drops:Circle[]=[],bars:Rect[]=[];
 const accent=s.chapter==='chapter2'?C.gold:s.chapter==='chapter3'?C.violet:s.chapter==='chapter4'?C.red:C.teal;
 let focus:Node|null=null;
 if(f==='tragedy'){
  rect(p,0,40,1640,560,'#0D1928',12);
  for(let j=0;j<6;j++){rect(p,-635+j*255,-45,116,380,'#1D3445',6);
   rect(p,-635+j*255,-40,80,285,'#0A1521',30);}
  const candle=new Node({x:v==='return'?550:-580,y:185});p.add(candle);
  rect(candle,0,70,26,155,C.cream,4);dot(candle,0,-23,35,C.gold);hands.push(candle);
  const woman=humanoid(p,100,15,C.red);woman.scale(1.18);n.push(woman);
  if(v==='blood'){for(let k=0;k<9;k++)drops.push(dot(p,-390+k*94,204,27,C.red));}
  label(p,v==='castle'?'眠らない王城':v==='lady'?'眠ったまま歩く女':v==='return'?'もう一度、あの城へ':'洗えない過去',0,-290,56);
 }else if(f==='washing'){
  rect(p,0,156,1370,300,C.panel,16);rect(p,0,262,1320,26,C.line,8);
  for(let i=0;i<2;i++){const h=new Node({x:i?-142:142,y:40});p.add(h);
   rect(h,0,0,165,70,C.cream,35);rect(h,i?64:-64,-30,58,135,C.cream,24);
   hands.push(h);}
  for(let i=0;i<12;i++)drops.push(dot(p,-90+(i%4)*60,-250+Math.floor(i/4)*45,13,C.blue));
  if(v==='mirror'){rect(p,0,-180,520,155,'#416076',33);
   label(p,'鏡の向こうの自分',0,-187,37,C.cream);}
  else label(p,v==='shower'?'身体は清潔になった':v==='wipe'?'手を拭くという行為':
   v==='clean'?'清潔≠善良':'罪の染みは見えるか？',0,-294,46);
 }else if(f==='bar'){
  line(p,[[-590,245],[600,245]],C.gray,6);
  const vals=[74,41],cs=[C.teal,C.red],labs=['手を拭かなかった','手を拭いた'];
  vals.forEach((value,i)=>{const x=i===0?-335:335;const height=value*4.65;
   const b=rect(p,x,245-height/2,250,height,cs[i],8);bars.push(b);
   label(p,value+'％',x,245-height-45,64,cs[i]);label(p,labs[i],x,304,31,C.cream);});
  label(p,'2006年の一実験',0,-320,30,C.gray);
 }else if(f==='research'){
  const names=v==='meta2018'?['2006','2018','独立追試']:v==='meta2024'?['230実験','42,000人超','限界あり']:
    v==='replicate2'?['2008 原著','2014 追試','再現せず']:v==='douglas'?['1966','人類学','秩序']:
    ['仮説','実験','追試'];
  for(let i=0;i<3;i++)n.push(slab(p,-540+i*540,-15,445,290,names[i],[C.blue,C.gold,C.red][i]));
  for(let i=0;i<3;i++){const doc=new Node({x:-540+i*540,y:203});p.add(doc);rect(doc,0,0,135,115,'#D1DCE0',5);
   for(let j=0;j<4;j++)rect(doc,0,-38+j*23,100-j*9,4,C.line,2);hands.push(doc);}
  label(p,v==='meta2018'?'独立研究室では明確な効果を確認できず':
   v==='meta2024'?'関連は報告／結論の一般化は不可':
   v==='warning'?'最初の実験は結論ではない':'研究は追試で確かめる',0,-311,39,C.cream);
 }else if(f==='shinto'){
  // Geometry-inspired torii + water, no reused photos or false historical footage.
  rect(p,0,223,1500,30,'#263A4B',5);
  rect(p,-300,-68,42,435,C.red,6);rect(p,300,-68,42,435,C.red,6);
  rect(p,0,-258,900,32,C.red,5);rect(p,0,-203,755,33,C.red,5);
  const basin=rect(p,0,219,630,140,'#527C8D',20);n.push(basin);
  for(let i=0;i<9;i++)drops.push(dot(p,-210+i*52,-90+(i%3)*22,14,C.blue));
  label(p,v==='kegare'?'穢れと悪事は別の概念':
    v==='misogi'?'穢れから清浄へ':v==='underworld'?'黄泉から現世へ':'清めるという境界',0,14,44,C.cream);
 }else if(f==='rite'){
  rect(p,-410,18,650,505,C.panel,20);rect(p,410,18,650,505,C.panel,20);
  label(p,'古い状態',-410,-128,56,C.red);label(p,'新しい状態',410,-128,56,C.teal);
  dot(p,-410,75,120,C.red);dot(p,410,75,120,C.teal);
  const stream=rect(p,0,50,60,325,C.blue,18);bars.push(stream);
  label(p,'水・儀礼・変化',0,308,39,C.gold);
  if(v==='baptism')label(p,'洗礼の意味は教派で異なる',0,-310,33,C.gray);
 }else if(f==='soil'){
  rect(p,-430,10,620,395,v==='table'?'#7E6960':'#274D39',16);
  rect(p,430,10,620,395,v==='soil'?'#274D39':'#7E6960',16);
  for(let j=0;j<8;j++){const x=-620+(j%4)*115,y=-30+Math.floor(j/4)*120;
   n.push(dot(p,x,y,40,'#BD9072'));n.push(dot(p,x+860,y,40,'#BD9072'));}
  label(p,'畑の土',-430,292,44,C.cream);label(p,'食卓の土',430,292,44,C.cream);
  label(p,'同じ土 ／ 違う位置',0,-312,43,C.gold);
 }else if(f==='people'){
  const a=humanoid(p,-440,-15,C.teal);const b=humanoid(p,430,-15,C.blue);
  n.push(a,b);rect(p,-440,218,550,85,C.panel,12);rect(p,430,218,550,85,C.panel,12);
  label(p,'汗と泥の作業着',-440,219,32,C.cream);
  label(p,'清潔なスーツ',430,219,32,C.cream);
  if(v==='reveal'){label(p,'水道修理の仕事',-440,-280,37,C.teal);
    label(p,'顧客を騙す仕事',430,-280,37,C.red);}
  else label(p,'誰を信用する？',0,-290,47,C.gold);
 }else if(f==='disgust'){
  const base=['食品の腐敗','身体の嫌悪','道徳判断'];
  if(v==='words'){base[0]='汚いやり方';base[1]='虫唾が走る';base[2]='吐き気がする';}
  if(v==='purity'||v==='exclusion'){base[0]='嫌悪感';base[1]='不純の烙印';base[2]='排除の危険';}
  base.forEach((t,i)=>{n.push(slab(p,-550+i*550,28,455,280,t,[C.gold,C.violet,C.red][i]));});
  label(p,'嫌悪 ≠ 道徳的な証拠',0,-304,48,C.cream);
 }else if(f==='experiment'){
  const names=v==='choice'?['鉛筆','ウェットティッシュ']:v==='memory'?['善い行動','悪い行動']:
    v==='metaphor'?['温かい人','重い責任']:v==='objects'?['洗浄用品','その他用品']:
    v==='volunteer'?['不快感','善行への動機']:['身体感覚','心の解釈'];
  names.forEach((t,i)=>{const x=names.length===3?-510+i*510:i?-430:430;
   n.push(slab(p,x,20,655,340,t,i?C.red:C.teal));});
  label(p,v==='letters'?'C L E A N ／ W A S H':v==='choice'?'どちらを選ぶ？':
    v==='memory'?'記憶を呼び起こす実験':'人間の認知は身体と結びつく',0,-305,43,C.cream);
 }else if(f==='office'){
  rect(p,0,255,1550,80,'#2C4455',10);
  for(let i=0;i<4;i++)n.push(humanoid(p,-580+i*387,-70,i===2?C.red:C.blue));
  rect(p,0,143,1500,29,'#41576A',8);
  label(p,v==='meeting'?'誰の手柄か？':v==='silence'?'あなたは何も言わなかった':
    '別の善行で不正は消えない',0,-320,45,C.gold);
 }else if(f==='accountability'){
  const names=v==='path'||v==='forgive'?['認める','償う','次を変える']:
    v==='ledger'?['悪行','善行','相殺？']:['不快感','反省','責任'];
  names.forEach((t,i)=>{const x=-550+i*550;n.push(slab(p,x,40,445,300,t,
    i===0?C.red:i===1?C.gold:C.teal));});
  label(p,'気分の回復 ≠ 責任の解消',0,-305,45,C.cream);
 }else if(f==='thesis'||f==='statement'){
  rect(p,-450,0,810,420,C.panel,17);rect(p,450,0,810,420,C.panel,17);
  label(p,f==='thesis'?'自分は善人だ':'自分が感じること',-450,-15,49,C.teal);
  label(p,f==='thesis'?'善人として行動する':'現実に起きたこと',450,-15,44,C.red);
  const mismatch=label(p,'≠',0,230,82,C.gold);n.push(mismatch);
  label(p,'この二つは同じではありません',0,-307,39,C.cream);
 }
 // Dynamic micro-state objects are always behind subtitles and header.
 return {family:f,nodes:n,hands,drops,bars,focus};
}
function* move(a:Art,s:Shot,i:number,duration:number):ThreadGenerator{
 const count=s.cues.length,phase=(i+1)/count;
 const step=Math.min(.52,Math.max(.16,duration*.20));
 const seq:ThreadGenerator[]=[];
 if(a.family==='bar'){
   const vals=[74,41];
   a.bars.forEach((b,j)=>{const h=vals[j]*4.65*(.65+.35*phase);
      seq.push(b.height(h,step));seq.push(b.y(245-h/2,step));});
 }else if(a.family==='washing'){
   a.hands.forEach((h,j)=>seq.push(h.x((j?-142:142)+(i%2?24:-24)*(j?-1:1),step)));
   a.drops.forEach((d,j)=>{if(j%Math.max(2,Math.ceil(a.drops.length/4))===i%Math.max(2,Math.ceil(a.drops.length/4)))
     seq.push(d.y(-220+(i%5)*68,step));});
 }else if(a.family==='shinto'||a.family==='rite'){
   a.drops.slice(i%3,i%3+4).forEach((d,j)=>seq.push(d.y(-100+phase*300+j*18,step)));
   a.bars.forEach(b=>seq.push(b.height(270*(.82+phase*.18),step)));
 }else if(a.family==='soil'){
   if(a.nodes.length)seq.push(a.nodes[i%a.nodes.length].y(-50+(i%3)*35,step));
 }else if(a.family==='office'){
   if(a.nodes.length){const person=a.nodes[i%a.nodes.length];seq.push(person.y(i%2?10:-30,step));}
 }else if(a.family==='tragedy'){
   if(a.hands.length)seq.push(a.hands[0].y(185+(i%2?14:-14),step));
   if(a.nodes.length)seq.push(a.nodes[0].x(100+phase*90,step));
 }else if(a.nodes.length){
   const picked=a.nodes[Math.floor((i/count)*a.nodes.length)%a.nodes.length];
   // Activate a different semantic object as narration progresses.
   seq.push(picked.scale(1+(i%3)*.035,step));
   if(i%2===0)seq.push(picked.y((i%4)*7,step));
 }
 if(seq.length)yield* all(...seq);else yield* waitFor(step);
 // Long sentences still advance meaning between individual cue boundaries.
 yield* waitFor(Math.max(.01,duration-step));
}
export function* playScene(view:View2D,s:Shot):ThreadGenerator{
 if(s.durationSource!=='VOICEVOX_MEASURED')throw new Error('Unmeasured narration: '+s.id);
 const content=new Node({}),heading=new Node({}),captionBase=new Node({}),subtitle=new Node({});
 view.add(content);view.add(heading);view.add(captionBase);view.add(subtitle);
 view.fill(C.bg);
 rect(content,0,0,1920,1080,C.bg,0);
 rect(content,0,0,1870,956,C.navy,6);
 line(content,[[-922,-397],[922,-397]],C.line,3);
 line(content,[[-922,363],[922,363]],C.line,3);
 const diagram=art(s,content);
 label(content,s.note,0,340,s.note.length>33?23:s.note.length>24?27:31,C.gray);
 rect(heading,0,-472,1920,135,C.dark,0);
 label(heading,s.chapter==='prologue'?'PROLOGUE':s.chapter==='epilogue'?'EPILOGUE':
   'CHAPTER '+s.chapter.replace('chapter',''),-745,-479,25,C.gold);
 label(heading,s.title,15,-480,s.title.length>17?36:43,C.white);
 label(heading,s.section,730,-481,25,C.gray);
 rect(captionBase,0,455,1920,170,'#02070E',0).opacity(.98);
 const sub=label(subtitle,'',0,457,41,C.white);
 sub.width(1580);sub.lineHeight(59);
 sub.textAlign('center');
 for(let i=0;i<s.cues.length;i++){
   const cue=s.cues[i];const d=cue.end-cue.start;
   if(!(d>0))throw new Error('Invalid cue timing: '+s.id);
   sub.text(cue.display);
   yield* move(diagram,s,i,d);
 }
 sub.text('');
}
