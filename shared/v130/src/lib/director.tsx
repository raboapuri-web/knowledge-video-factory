import '@fontsource/noto-sans-jp/400.css';
import '@fontsource/noto-sans-jp/700.css';
import {Node, Rect, Circle, Line, Txt, type View2D} from '@motion-canvas/2d';
import {all, waitFor, type ThreadGenerator} from '@motion-canvas/core';

/** V130: chapter-accurate Motion Canvas diagrams.
 * No camera tilt, no literal escaped-newline subtitles, no generic card-fade conveyor.
 * One continuous stateful space per semantic paragraph, 4 overlay layers in fixed Z order.
 */
interface Cue {display:string;text:string;start:number;end:number}
interface Shot {id:string;chapter:string;section:string;visual:string;title:string;note:string;cues:Cue[];duration:number;durationSource:string;sceneIndex:number;sceneTotal:number}
type P={root:Node;nodes:Node[];bars:Rect[];marks:Txt[];moving:Node[];mode:string};
const C={bg:'#091421',navy:'#122432',panel:'#1B3442',line:'#517184',paper:'#F5EDE0',muted:'#ACBCC4',teal:'#5ED3BE',red:'#E66E65',gold:'#E7C47D',blue:'#78B4E1',green:'#4A917F',dark:'#050D16'};
const FONT='Noto Sans JP, Noto Sans CJK JP, sans-serif';
function box(p:Node,x:number,y:number,w:number,h:number,fill:string,r=12){const v=new Rect({x,y,width:w,height:h,fill,radius:r});p.add(v);return v;}
function circle(p:Node,x:number,y:number,r:number,c:string){const v=new Circle({x,y,width:r*2,height:r*2,fill:c});p.add(v);return v;}
function ln(p:Node,points:[number,number][],color=C.line,w=7){const v=new Line({points,stroke:color,lineWidth:w,lineCap:'round',lineJoin:'round'});p.add(v);return v;}
function txt(p:Node,str:string,x:number,y:number,size=34,color=C.paper,bold=700){const v=new Txt({text:str,x,y,fontFamily:FONT,fontSize:size,fontWeight:bold,fill:color,textAlign:'center'});p.add(v);return v;}
function card(p:Node,x:number,y:number,w:number,h:number,heading:string,metric:string,color=C.teal){
 const n=new Node({x,y});p.add(n);box(n,0,0,w,h,C.panel,18);box(n,0,-h/2+7,w-24,8,color,3);
 txt(n,heading,0,-h*.25,30,C.muted);txt(n,metric,0,h*.05,65,color);return n;
}
function cycle(p:Node,labels:string[],y=18,spacing=470){
 const arr:Node[]=[];const start=-((labels.length-1)*spacing)/2;
 labels.forEach((v,i)=>{const n=new Node({x:start+i*spacing,y});p.add(n);
  circle(n,0,0,103,i%2?C.panel:'#224453');txt(n,v,0,0,v.length>7?29:35,i===labels.length-1?C.red:C.paper);
  arr.push(n);
  if(i<labels.length-1){ln(p,[[start+i*spacing+115,y],[start+(i+1)*spacing-115,y]],C.gold,6);circle(p,start+i*spacing+spacing*.5,y,8,C.gold);}
 });return arr;
}
function columns(p:Node,headers:string[],values:string[],colors:string[]){
 const n:Node[]=[];const w=1520/headers.length;
 headers.forEach((t,i)=>{const x=-760+w*(i+.5);n.push(card(p,x,0,w-27,325,t,values[i],colors[i%colors.length]));});
 return n;
}
function axes(p:Node){
 ln(p,[[-660,255],[-660,-270]],C.muted,6);ln(p,[[-660,255],[720,255]],C.muted,6);
 for(let i=0;i<5;i++){const y=255-i*125;ln(p,[[-668,y],[720,y]],'#274654',2);}
}
function bars(p:Node,labels:string[],values:number[],colors:string[]){
 axes(p);const n:Rect[]=[];const max=Math.max(...values,1);
 const width=950/values.length;
 values.forEach((v,i)=>{const x=-430+i*width;const h=440*v/max;const b=box(p,x,255-h/2,width*.52,h,colors[i%colors.length],8);n.push(b);
  txt(p,labels[i],x,308,27,C.paper);txt(p,String(v),x,202-h,39,colors[i%colors.length]);
 });return n;
}
function money(p:Node,x:number,y:number,c=C.gold){
 const n=new Node({x,y});p.add(n);box(n,0,0,160,85,c,11);circle(n,-49,0,17,C.paper);txt(n,'¥',38,-1,38,C.bg);return n;
}
function people(p:Node,x:number,y:number,coat=C.teal){
 const n=new Node({x,y});p.add(n);circle(n,0,-66,28,C.paper);box(n,0,26,85,120,coat,25);
 ln(n,[[-22,67],[-26,131]],C.muted,11);ln(n,[[22,67],[26,131]],C.muted,11);return n;
}
function building(p:Node,x:number,y:number,label:string){
 const n=new Node({x,y});p.add(n);box(n,0,0,240,225,C.panel,7);for(let k=0;k<6;k++)box(n,-70+(k%3)*68,-55+Math.floor(k/3)*77,43,48,C.blue,3);txt(n,label,0,150,29,C.paper);return n;
}
function renderArt(s:Shot,layer:Node):P{
 const root=new Node({});layer.add(root);
 // Each type gets a distinct diagram grammar, while all objects remain permanent.
 const active:Node[]=[];const metric:Txt[]=[];const moving:Node[]=[];let bs:Rect[]=[];
 const v=s.visual;
 if(v==='hive'||v==='luxury'||v==='shutdown'){
   for(let i=0;i<18;i++){const x=-670+(i%9)*164,y=-200+Math.floor(i/9)*245;
    const col=(i%3===0?C.gold:i%3===1?C.teal:C.blue);const cell=circle(root,x,y,56,col);
    cell.opacity(v==='shutdown'&&i%2===0?.22:.78);moving.push(cell);}
   const n=new Node({x:0,y:180});root.add(n);txt(n,v==='shutdown'?'善人になった後の失業':v==='luxury'?'欲望が雇用を生む':'繁栄していた蜂たちの社会',0,0,42,C.paper);active.push(n);
 } else if(v==='street'||v==='factory'||v==='house'||v==='capacity'||v==='idle'){
   box(root,0,90,1660,370,C.navy,8);
   for(let i=0;i<5;i++){const b=building(root,-670+i*330,-77,
     v==='street'?['居酒屋','小売店','工場','事務所','家計'][i]:
     v==='house'?['住宅','融資','銀行','企業','家計'][i]:
     v==='factory'?['倉庫','工場','設備','商品','需要'][i]:
     v==='idle'?['工場','求人','店舗','倉庫','失業'][i]:['設備','労働','生産','消費','物価'][i]);
     active.push(b);}
   const n=box(root,0,273,1480,19,v==='idle'?C.red:C.gold,4);bs.push(n);
 } else if(v==='wallet'||v==='household'||v==='allocation'||v==='debt'||v==='support'){
    active.push(...columns(root,
      v==='debt'?['資産価値','借金','返済']:v==='support'?['所得保障','消費','雇用']:['現在の消費','将来の備え','生活の安定'],
      v==='debt'?['↓','残る','負担↑']:v==='support'?['支える','保つ','守る']:['減らす','増やす','守る'],
      [C.red,C.gold,C.teal]));
 } else if(v==='supply'||v==='ledger'||v==='network'||v==='regions'||v==='employment'){
   const labels=v==='supply'?['居酒屋','洋服店','工場']:v==='regions'?['家計','地元の店','雇用']:v==='employment'?['住宅資産','消費','雇用']:v==='ledger'?['支出','売上','賃金']:['あなたの支出','誰かの所得','次の支出'];
   active.push(...cycle(root,labels,1,540));
   for(let i=0;i<4;i++)moving.push(money(root,-590+i*370,264,C.gold));
 } else if(v==='audience'||v==='judgement'){
   for(let i=0;i<8;i++){const p=people(root,-650+i*187,75,i%3===0?C.red:C.teal);active.push(p);}
   txt(root,v==='audience'?'一人だけ立つ → 全員が立つ':'悪人探しでは説明できない',0,-270,44,C.paper);
 } else if(v==='model'||v==='baseline'||v==='rate'||v==='demand'||v==='collapse'||v==='compare'||v==='investment'||v==='incomes'||v==='accounting'||v==='definitions'){
   if(v==='rate'){
     active.push(...columns(root,['以前の貯蓄率','新しい貯蓄率'],['20％','30％'],[C.blue,C.red]));
     bs=[box(root,-430,266,560,38,C.blue,5),box(root,430,266,420,38,C.red,5)];
   }else if(v==='collapse'||v==='compare'){
     active.push(...columns(root,['節約前：所得','節約後：所得','実現貯蓄'],['1,000万円','約667万円','200万円'],[C.blue,C.red,C.gold]));
     bs=[box(root,-310,278,560,22,C.blue,5),box(root,385,278,374,22,C.red,5)];
   }else if(v==='investment'){
     active.push(...columns(root,['企業投資','社会の所得','実現貯蓄'],['150万円','500万円','150万円'],[C.red,C.blue,C.gold]));
   }else if(v==='demand'){
     active.push(...columns(root,['消費','投資','合計需要'],['700万円','200万円','900万円'],[C.red,C.teal,C.gold]));
   }else if(v==='baseline'){
     active.push(...columns(root,['消費','貯蓄','投資'],['800万円','200万円','200万円'],[C.blue,C.gold,C.teal]));
   }else if(v==='definitions'){
     active.push(...columns(root,['期間の貯蓄','預金残高'],['新たな所得の残り','蓄積された資産'],[C.teal,C.blue]));
   }else if(v==='accounting'){
     active.push(...columns(root,['実現した貯蓄','事後的な投資'],['S','I'],[C.gold,C.teal]));
     txt(root,'S ＝ I',0,254,59,C.paper);
   }else{
     active.push(...columns(root,['家計の消費','企業の投資','社会の所得'],['C','I','Y'],[C.blue,C.teal,C.gold]));
     txt(root,'Y ＝ C ＋ I',0,258,51,C.paper);
   }
 } else if(v==='loop'||v==='feedback'||v==='cycle'||v==='debttrap'){
   const labels=v==='debttrap'?['借金を返す','消費が減る','雇用が減る','返済力が減る']:
      v==='loop'?['消費減少','売上減少','所得減少','さらに消費減']:['不安','消費縮小','企業投資減','失業'];
   for(let i=0;i<4;i++){const angle=i*Math.PI/2-Math.PI/2,x=480*Math.cos(angle),y=215*Math.sin(angle);
     const n=card(root,x,y,350,146,labels[i],String(i+1).padStart(2,'0'),[C.red,C.gold,C.teal,C.blue][i]);active.push(n);}
   circle(root,0,0,105,C.bg);txt(root,'悪循環',0,0,46,C.red);
 } else if(v==='bank'||v==='credit'||v==='balance'||v==='money'||v==='expectation'){
   const arr=v==='bank'?['家計貯蓄','銀行','企業投資']:v==='credit'?['低金利','需要不足','投資見送り']:
      v==='money'?['銀行貸出','新しい預金','返済・規制']:v==='balance'?['返済能力','採算性','金融規制']:['将来需要','期待利益','投資判断'];
   active.push(...cycle(root,arr,0,520));
   moving.push(money(root,-640,258));moving.push(money(root,40,258));
 } else if(v==='book'||v==='research'||v==='imf'||v==='timeline'){
   box(root,-380,-15,640,575,C.panel,20);box(root,-677,-15,20,553,C.red,6);
   for(let j=0;j<9;j++){box(root,-400,-214+j*57,430-(j%3)*45,6,C.line,3);}
   txt(root,v==='imf'?'IMF・2013':v==='book'?'1714':'研究',-380,-280,42,C.gold);
   active.push(card(root,440,-50,680,435,v==='timeline'?'思想史':v==='imf'?'成長予測':v==='book'?'蜂の寓話':'研究と実証',v==='book'?'風刺':v==='imf'?'予測誤差':'検証',C.teal));
 } else if(v==='counter'||v==='identity'||v==='paradox'||v==='thesis'||v==='ending'||v==='qualification'||v==='caveat'||v==='conditions'||v==='decision'){
    const a=v==='counter'?['貯蓄は悪？','答えは違う']:v==='qualification'?['示された証拠','示されない主張']:v==='conditions'?['需要不足','供給不足']:
    v==='decision'?['支出の効果','長期の費用']:v==='caveat'?['説明用モデル','現実の経済']:
    ['個人の最適','社会全体の結果'];
    active.push(...columns(root,a,['合理的','必ずしも一致しない'],[C.teal,C.red]));
    const mark=txt(root,v==='ending'?'考える夜':'≠',0,257,v==='ending'?54:84,C.gold);metric.push(mark);
 } else if(v==='government'||v==='institutions'||v==='inflation'||v==='policy'||v==='research'||v==='inequality'){
   const arr=v==='government'?['インフラ','所得保障','税と社会保障']:v==='inflation'?['需要過多','供給制約','物価上昇']:v==='inequality'?['借入','住宅価格','消費縮小']:['家計','企業','公共部門'];
   active.push(...cycle(root,arr,0,515));
 } else {
   active.push(...columns(root,['個人の行動','社会への影響','判断する条件'],['合理性','相互依存','需給'],[C.teal,C.red,C.gold]));
 }
 // Fixed at the bottom of the drawable content area. Never overlaps bottom captions.
 txt(root,s.note,0,341,s.note.length>35?23:28,C.muted,400);
 return {root,nodes:active,bars:bs,marks:metric,moving,mode:v};
}
function* animate(p:P,s:Shot,i:number,dur:number):ThreadGenerator{
 const n=Math.max(1,s.cues.length),fraction=(i+1)/n,d=Math.min(.62,Math.max(.16,dur*.22));
 const k=Math.min(p.nodes.length-1,Math.floor(i*p.nodes.length/n));
 const cur=p.nodes[Math.max(0,k)];
 const v=p.mode;
 if(v==='hive'||v==='luxury'||v==='shutdown'){
   const idx=Math.min(p.moving.length-1,Math.floor(i*p.moving.length/n));
   const changes:ThreadGenerator[]=[];
   for(let j=0;j<p.moving.length;j++)if(j===idx)changes.push(p.moving[j].scale(v==='shutdown'?.38:1.25,d));
   if(cur)changes.push(cur.y(180+(i%2?7:-7),d));
   if(changes.length)yield* all(...changes);else yield* waitFor(d);
 }else if(v==='rate'||v==='collapse'||v==='compare'||v==='demand'||v==='investment'||v==='baseline'||v==='model'){
   const transitions:ThreadGenerator[]=[];
   if(cur)transitions.push(cur.scale(1.03,d));
   if(p.bars.length)for(let j=0;j<p.bars.length;j++)transitions.push(p.bars[j].width((j===0?560:420)*(1-.15*fraction),d));
   if(transitions.length)yield* all(...transitions);else yield* waitFor(d);
 }else if(v==='loop'||v==='feedback'||v==='cycle'||v==='debttrap'){
   if(cur)yield* all(cur.scale(1.08,d),cur.opacity(1,d));else yield* waitFor(d);
 }else if(v==='street'||v==='factory'||v==='house'||v==='idle'||v==='capacity'){
   if(cur)yield* all(cur.y(-77+(i%2?16:-12),d),cur.opacity(i%3===1?.68:1,d));else yield* waitFor(d);
 }else if(v==='supply'||v==='ledger'||v==='network'||v==='regions'||v==='employment'){
   if(p.moving.length){const coin=p.moving[i%p.moving.length];yield* all(coin.x(-580+fraction*1160,d),coin.opacity(i%2?.40:1,d));}
   else if(cur)yield* cur.scale(1.09,d);else yield* waitFor(d);
 }else if(v==='audience'||v==='judgement'){
   if(cur)yield* cur.y(-20-(i%3)*28,d);else yield* waitFor(d);
 }else if(v==='bank'||v==='credit'||v==='balance'||v==='money'||v==='expectation'){
   if(p.moving.length){const coin=p.moving[i%p.moving.length];yield* all(coin.x(-550+fraction*1070,d),coin.opacity(fraction>.8?.2:1,d));}
   else if(cur)yield* cur.scale(1.05,d);else yield* waitFor(d);
 }else if(v==='book'||v==='research'||v==='imf'||v==='timeline'){
   if(cur)yield* all(cur.x(440+(i%2?-25:25),d),cur.scale(1.02,d));else yield* waitFor(d);
 }else{
   if(cur)yield* all(cur.scale(1.025,d),cur.opacity(i%2?.82:1,d));else yield* waitFor(d);
 }
 yield* waitFor(Math.max(.01,dur-d));
}
export function* playScene(view:View2D,s:Shot):ThreadGenerator{
 if(s.durationSource!=='VOICEVOX_MEASURED')throw new Error('VOICEVOX measured timing missing: '+s.id);
 const back=new Node({}),header=new Node({}),captionBack=new Node({}),caption=new Node({});
 // Strict fixed Z order; never add content on top of captions.
 view.add(back);view.add(header);view.add(captionBack);view.add(caption);
 view.fill(C.bg);
 box(back,0,0,1920,1080,C.bg,0);
 box(back,0,0,1860,955,C.navy,5);
 // film-like fine separator lines, always horizontal
 ln(back,[[-930,-392],[930,-392]],'#3B5765',3);
 ln(back,[[-930,370],[930,370]],'#3B5765',3);
 const stage=renderArt(s,back);
 box(header,0,-477,1920,126,C.dark,0);
 txt(header,s.chapter==='prologue'?'PROLOGUE':s.chapter==='epilogue'?'EPILOGUE':'CHAPTER '+s.chapter.replace('chapter',''),-752,-489,25,C.gold);
 txt(header,s.title,48,-489,s.title.length>22?34:39,C.paper);
 txt(header,s.section,746,-491,23,C.muted,400);
 box(captionBack,0,455,1920,170,'#02070D',0).opacity(.97);
 const sub=txt(caption,'',0,461,42,C.paper);
 sub.width(1630);sub.lineHeight(59);sub.textAlign('center');
 const count=s.cues.length;
 for(let i=0;i<count;i++){
   const cue=s.cues[i];sub.text(cue.display);
   const duration=cue.end-cue.start;
   if(duration<=0)throw new Error('Bad audio duration '+s.id);
   yield* animate(stage,s,i,duration);
 }
 sub.text('');
}
