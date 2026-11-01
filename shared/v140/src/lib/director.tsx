import {Node,Rect,Circle,Line,Txt,type View2D} from '@motion-canvas/2d';
import {all,waitFor,type ThreadGenerator} from '@motion-canvas/core';
/** V140: One hundred storyboard-anchored authored diagram states.
 * NARRATION: locked to original user manuscript.
 * Each shot has its own core visual structure. Typography is never a substitute for an explanatory diagram.
 * The subtitle Node is added last and remains above ALL layers.
 */
type Cue={text:string;speech:string;display:string;start:number;end:number};
type Shot={id:string;chapter:string;section:string;title:string;visual:string;visualInstruction:string;motionInstruction:string;narration:string;sceneIndex:number;cues:Cue[];duration:number;durationSource:string};
const K={ink:'#101923',dark:'#0A1018',forest:'#162A27',deep:'#0D2228',paper:'#F5F0E3',
  ivory:'#DFD5BF',red:'#B44235',orange:'#DF8355',gold:'#C6AD78',blue:'#729AAE',
  gray:'#79909A',dim:'#52616A',sage:'#759B82',sea:'#355C70',smoke:'#4A4E50'};
const SERIF='Noto Serif CJK JP, Noto Serif JP, serif';
const SANS='Noto Sans CJK JP, Noto Sans JP, sans-serif';
function rect(p:Node,x:number,y:number,w:number,h:number,fill:string,r=0):Rect{
 const o=new Rect({x,y,width:w,height:h,fill,radius:r});p.add(o);return o;}
function circ(p:Node,x:number,y:number,d:number,fill:string):Circle{
 const o=new Circle({x,y,width:d,height:d,fill});p.add(o);return o;}
function tx(p:Node,text:string,x:number,y:number,size=40,color=K.paper,weight=600):Txt{
 const o=new Txt({x,y,text,fontFamily:SERIF,fontSize:size,fontWeight:weight,fill:color,textAlign:'center'});p.add(o);return o;}
function line(p:Node,pts:[number,number][],col=K.ivory,w=3):Line{
 const o=new Line({points:pts,stroke:col,lineWidth:w,lineCap:'round',lineJoin:'round'});p.add(o);return o;}
function arrow(p:Node,x1:number,y1:number,x2:number,y2:number,col=K.orange):Node{
 const n=new Node({});p.add(n);line(n,[[x1,y1],[x2,y2]],col,4);
 const a=Math.atan2(y2-y1,x2-x1);
 line(n,[[x2-18*Math.cos(a-.55),y2-18*Math.sin(a-.55)],[x2,y2],[x2-18*Math.cos(a+.55),y2-18*Math.sin(a+.55)]],col,4);
 return n;}
function card(p:Node,s:string,x:number,y:number,w=390,h=122,col=K.gold):Node{
 const n=new Node({x,y});p.add(n);
 rect(n,0,0,w,h,K.ink,14);
 rect(n,0,-h/2+5,w-8,7,col,3);
 tx(n,s,0,6,s.length>13?26:s.length>7?31:39,K.paper);
 return n;
}
function dots(p:Node,n:number,originX:number,originY:number,cols:number,gapX:number,gapY:number,c=K.gold):Node[]{
 const all:Node[]=[];for(let i=0;i<n;i++)all.push(circ(p,originX+(i%cols)*gapX,originY+Math.floor(i/cols)*gapY,15,c));return all;}
function tree(p:Node,x:number,y:number,scale=1,col=K.ink):Node{
 const n=new Node({x,y,scale});p.add(n);
 line(n,[[0,96],[0,-114]],col,13);line(n,[[-67,10],[0,-100],[67,10]],col,14);
 line(n,[[-54,-37],[0,-143],[54,-37]],col,13);
 line(n,[[-37,-75],[0,-166],[37,-75]],col,12);
 return n;
}
function flame(p:Node,x:number,y:number,s=1,c=K.orange):Node{
 const n=new Node({x,y,scale:s});p.add(n);
 line(n,[[-31,50],[-53,7],[-18,-37],[-8,-90],[13,-52],[34,-20],[43,24],[19,53]],c,23);
 line(n,[[-7,50],[-17,12],[4,-21],[24,17],[12,51]],K.red,11);
 return n;
}
function forest(p:Node,idx=0,burning=false):Node[]{
 const list:Node[]=[];
 rect(p,-385,105,800,155,idx%2?K.deep:K.forest,24);
 line(p,[[-786,205],[-585,45],[-385,105],[-167,-88],[29,91],[232,-25],[430,135]],K.sage,10);
 for(let i=0;i<10;i++)list.push(tree(p,-695+i*150,75+((i*13)%90),.65+((i*11)%5)*.08,i%3===0?K.dim:K.ink));
 if(burning)for(let i=0;i<5;i++)list.push(flame(p,-630+i*270,90-((i*19)%65),.58+i*.04,i%2?K.orange:K.red));
 return list;
}
function human(p:Node,x:number,y:number,bow=false):Node{
 const n=new Node({x,y});p.add(n);
 circ(n,0,-142,105,K.ink);
 rect(n,0,23,152,208,K.ink,18);
 line(n,[[-26,-11],[0,45],[26,-11]],K.paper,5);
 line(n,[[0,35],[0,130]],K.red,10);
 if(bow)n.rotation(16);
 return n;
}
function podium(p:Node):Node[]{
 const o:Node[]=[];
 o.push(human(p,205,-27,true));
 rect(p,205,245,670,102,K.ink,7);rect(p,205,193,660,5,K.gold,0);
 for(let i=0;i<5;i++){
  line(p,[[-280+i*240,173],[-285+i*240,-37+i%2*22]],K.ivory,9);
  circ(p,-285+i*240,-39+i%2*22,35,K.smoke);
 }
 for(let i=0;i<3;i++)rect(p,-645+i*200,-165,120,64,K.ink,7);
 return o;
}
function documents(p:Node,n=5):Node[]{
 const a:Node[]=[];
 for(let i=0;i<n;i++){
  const x=-540+i*260,y=15+((i%2)?44:-28),w=205,h=260;
  const q=new Node({x,y,rotation:(i-2)*-3});p.add(q);a.push(q);
  rect(q,0,0,w,h,K.paper,3);
  rect(q,-10,-88,132,8,K.ink);rect(q,5,-40,152,5,K.gray);
  rect(q,-7,0,120,5,K.gray);rect(q,10,39,156,5,K.gray);
  circ(q,62,91,26,K.red);
 }
 return a;
}
function bars(p:Node,labels:string[],values:number[],max=100,highlight=1):Node[]{
 const out:Node[]=[];let sp=1200/labels.length;
 for(let i=0;i<labels.length;i++){
  const h=330*Math.max(.04,values[i]/max);
  out.push(rect(p,-560+i*sp,155-h/2,Math.min(220,sp-30),h,i===highlight?K.red:K.blue,8));
  tx(p,labels[i],-560+i*sp,216,29,K.paper);
  tx(p,String(values[i]),-560+i*sp,120-h,46,i===highlight?K.orange:K.paper);
 }
 line(p,[[-730,155],[740,155]],K.gray,2);return out;
}
function split(p:Node,left:string,right:string):Node[]{
 const a=card(p,left,-420,0,645,248,K.red),b=card(p,right,420,0,645,248,K.blue);
 return [a,b];
}
function rim(p:Node):Node[]{
 const a:Node[]=[];
 for(let i=0;i<6;i++)a.push(circ(p,0,40,540-i*80,i%2?K.ink:K.ivory));
 for(let i=0;i<5;i++)a.push(line(p,[[i*25-70,-210],[i*22-45,185]],i===3?K.red:K.gray,2));
 return a;
}
function beetle(p:Node):Node[]{
 const a:Node[]=[];
 a.push(circ(p,0,32,260,K.ink));a.push(circ(p,0,-113,108,K.ink));
 line(p,[[0,-140],[-95,-230]],K.ink,7);line(p,[[0,-140],[95,-230]],K.ink,7);
 for(let i=0;i<3;i++){
  let y=-25+i*85;line(p,[[-90,y],[-255,y-85]],K.ink,9);
  line(p,[[90,y],[255,y-85]],K.ink,9);}
 line(p,[[0,-70],[0,158]],K.red,3);
 a.push(circ(p,-305,-115,44,K.orange));a.push(circ(p,306,-115,44,K.gold));
 return a;
}
function cone(p:Node,hot=false):Node[]{
 const a:Node[]=[];
 for(let row=0;row<6;row++)for(let j=0;j<row+1;j++){
  let x=(j-row/2)*95,y=-210+row*80;
  a.push(circ(p,x,y,91,hot?((row+j)%2?K.orange:K.red):K.ink));
  circ(p,x-10,y-9,38,hot?K.gold:K.sage);
 }
 if(hot)for(let i=0;i<9;i++)a.push(circ(p,-320+i*75,240-(i%3)*18,16,K.ivory));
 return a;
}
function map(p:Node,tag='米国西部'):Node[]{
 const a:Node[]=[];rect(p,0,10,1150,480,K.paper,12);
 for(let i=0;i<7;i++)line(p,[[-480+i*155,-220],[-480+i*155,235]],K.gray,2);
 for(let i=0;i<5;i++)line(p,[[-520,-190+i*92],[520,-190+i*92]],K.gray,2);
 a.push(circ(p,-80,20,110,K.red));tx(p,tag,0,-270,46,K.ink);
 tx(p,'模式図',455,222,20,K.smoke,400);return a;
}
function ecology(p:Node,idx:number):Node[]{
 const a:Node[]=[];a.push(...forest(p,idx,idx%3===1));
 if(idx%3===2){for(let i=0;i<6;i++)a.push(circ(p,-470+i*180,195-(i%2)*75,27,K.sage));}
 return a;
}
function data(p:Node,idx:number):Node[]{
 const lookup:Record<number,[string,string,string]>={2:['約32％','陸地の森林','日本約110個分'],
 9:['約560 km²','東京23区の約9割','住宅132軒'],42:['406地点','過去と現代','年輪・衛星・現地調査'],
 43:['11.4年','1700–1880年','過去の平均'],44:['58.8年','現代','火災間隔'],
 46:['42％','高い樹木死亡率','近年火災の一部'],56:['約24,000 ha','わずか1日','大阪市の面積を超える'],
 57:['60人以上','専門家による調査','ヘイマン火災'],65:['62〜72％','火災深刻度の低下','管理処理 vs 未処理'],
 68:['約36％','国立公園の火災影響','1988年'],85:['3,301人','7つの実験','道徳的反復効果']};
 const f=lookup[idx]||['森林火災','研究と記録','観測された違い'];
 const group=new Node({});p.add(group);
 rect(group,0,0,1170,425,K.paper,13);rect(group,-465,0,14,352,K.red,3);
 tx(group,f[0],0,-92,112,K.ink);tx(group,f[1],0,49,42,K.smoke);
 tx(group,f[2],0,151,35,K.red);return [group];
}
function phase(p:Node,labels:string[]):Node[]{
 const a:Node[]=[];const w=1400/labels.length;
 for(let i=0;i<labels.length;i++){
  a.push(card(p,labels[i],-700+w*(i+.5),-5,w-22,174,
   i===labels.length-1?K.red:i%2?K.blue:K.gold));
  if(i<labels.length-1)arrow(p,-700+w*(i+1)-5,0,-700+w*(i+1)+18,0,K.gold);
 }
 return a;
}
function social(p:Node,idx:number):Node[]{
 const a:Node[]=[];
 if(idx%3===0){a.push(...podium(p));}
 else{
   a.push(human(p,0,22,idx%2===0));
   for(let i=0;i<5;i++){
     const x=-640+i*310,y=-190+(i%3)*140;
     a.push(card(p,['またか','期待','？','批判','失望'][i],x,y,230,104,i%2?K.red:K.blue));
   }
 }
 return a;
}
function analysis(p:Node,idx:number):Node[]{
 if(idx===86)return split(p,'初めて見る','繰り返し見る');
 if(idx===87)return split(p,'初見の評価','反復後の評価');
 if(idx===89)return split(p,'行為は同じ','評価が変わる');
 if(idx===90){const a=human(p,0,0);return [a,...split(p,'事実','期待')];}
 if(idx===98)return split(p,'許す行為','激しく非難する行為');
 if(idx===99)return split(p,'問題が起きる','問題が見える');
 if(idx===95)return split(p,'森林の燃料','人間の期待');
 if(idx===96)return split(p,'炎は見えない','期待は見えない');
 if(idx===75)return split(p,'問題が見えない','危険が存在しない');
 return phase(p,['出来事','解釈','反応']);
}
function art(p:Node,s:Shot):Node[]{
 const i=Number(s.id.slice(1)),m:Node[]=[];
 if([1,3].includes(i)){
  m.push(circ(p,0,0,455,K.sea),circ(p,-75,-90,150,K.sage),circ(p,130,54,210,K.sage));
  if(i===3)for(let j=0;j<7;j++)m.push(flame(p,-220+j*70,-110+(j%3)*95,.5,K.red));
 }else if([2,9,42,43,44,46,56,57,65,68,85].includes(i))m.push(...data(p,i));
 else if([6,7,8,22,40,54,55,58,59,67,71,72].includes(i))m.push(...map(p,i>66?'イエローストーン':i<10?'コロラド州':'調査地域'));
 else if([4,5].includes(i)){
  m.push(...phase(p,i===4?['森林消失','水循環','農業への影響']:['水道','食料','都市の気温']));
 }else if([12,15,21,74,76,77,91,97,100].includes(i)){
  m.push(...forest(p,i,i===12||i===91));
  tx(p,i===12?'その山火事、消さないでもらえますか？':i===100?'今夜も、当たり前がひとつ減りました。':s.title,0,-228,i===12?44:37,K.paper);
 }else if([13,14,75,78,79,80,81,82,83,90,95,96,98,99].includes(i))m.push(...analysis(p,i));
 else if([23,24,25,28].includes(i))m.push(...cone(p,i===25||i===28));
 else if([29,30,31,32].includes(i))m.push(...beetle(p));
 else if([41].includes(i))m.push(...rim(p));
 else if([47,64,84].includes(i))m.push(...documents(p,5));
 else if([50,51,52,53].includes(i)){
  m.push(...phase(p,i===50?['弱い火','消火成功','強い火が残る']:i===51?['消しやすい火','消える','抑制バイアス']:i===52?['燃料が残る','火災を選別','深刻化']:['大火災','消火強化','燃料蓄積']));
 }else if([60,61,62,63,66].includes(i)){
  m.push(...forest(p,i,i===61||i===63));
  if(i===62)tx(p,'湿度　風向　気温　燃料',0,-234,35,K.paper);
  if(i===63)tx(p,'森を守るために、森を燃やす',0,-227,51,K.paper);
 }else if([86,87,88,89].includes(i))m.push(...analysis(p,i));
 else if([26,27,69,70,73].includes(i))m.push(...ecology(p,i));
 else if([16,17,18,19,20,33,34,35,36,37,38,39,45,48,49,72,92,93,94].includes(i))m.push(...ecology(p,i));
 else if([10,11,53].includes(i))m.push(...phase(p,['消火する','燃料が残る','時がたつ']));
 else if([85,86,87,88,89,90].includes(i))m.push(...analysis(p,i));
 else m.push(...social(p,i));
 return m;
}
export function* playScene(view:View2D,s:Shot):ThreadGenerator{
 if(s.durationSource!=='VOICEVOX_MEASURED')throw new Error('Audio timing not measured '+s.id);
 view.fill(K.dark);
 const background=new Node({}),visual=new Node({}),head=new Node({}),subtitle=new Node({});
 view.add(background);view.add(visual);view.add(head);view.add(subtitle);
 const n=Number(s.id.slice(1));
 const socialSide=s.chapter==='chapter4'||(n>=78&&n<=90);
 rect(background,0,0,1920,1080,socialSide?'#16232C':K.dark);
 rect(background,0,-65,1820,730,socialSide?'#22333D':'#142124',21);
 for(let j=0;j<4;j++){
  line(background,[[-880,-300+j*157],[880,-300+j*157]],socialSide?'#2B414E':'#20312E',1);
 }
 rect(head,0,-465,1920,150,K.dark);
 tx(head,'考 え る 夜',-720,-460,26,K.gold,600);
 tx(head,s.section,0,-462,s.section.length>17?29:35,K.paper);
 tx(head,String(n).padStart(3,'0')+' / 100',725,-460,24,K.gray);
 const moving=art(visual,s);
 rect(background,0,440,1920,200,K.dark);
 line(background,[[-930,345],[930,345]],K.dim,2);
 tx(background,'火災生態学　×　社会心理学',-656,382,24,K.gold);
 // All visual content ends before subtitles. Subtitle layer is last and always on top.
 const sub=tx(subtitle,'',0,454,45,K.paper,600);sub.width(1790);sub.lineHeight(63);sub.fontFamily(SANS);
 const t=Math.max(.12,Math.min(.6,s.duration*.06));
 const variant=n%5;
 if(variant===0){visual.y(27);yield* visual.y(0,t);}
 else if(variant===1){visual.x(-40);yield* visual.x(0,t);}
 else if(variant===2){visual.scale(.96);yield* visual.scale(1,t);}
 else if(variant===3){visual.opacity(.55);yield* visual.opacity(1,t);}
 else{visual.x(42);yield* visual.x(0,t);}
 // The timing of each cue comes from the synthesized narration, not guessed word rates.
 for(let j=0;j<s.cues.length;j++){
   const cue=s.cues[j],d=cue.end-cue.start;
   sub.text(cue.display);
   if(!(d>0))throw new Error('Nonpositive audio cue '+s.id);
   const motion=Math.min(.35,d*.18);
   if(moving.length && j%3===0){
     const o=moving[(j+n)%moving.length];
     yield* all(o.scale(1.008,motion),waitFor(motion));
     yield* waitFor(Math.max(.001,d-motion));
   }else yield* waitFor(d);
 }
 sub.text('');
}
