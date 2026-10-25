import '@fontsource/noto-sans-jp/400.css';
import '@fontsource/noto-sans-jp/700.css';
import {Node, Rect, Circle, Line, Txt, type View2D} from '@motion-canvas/2d';
import {all, waitFor, type ThreadGenerator} from '@motion-canvas/core';

/** V137 Poverty Premium Motion Canvas / original semantic graphics.
 * 42 meaning-specific visual families, chapter-specific backgrounds and audio-measured cues.
 * Narration is authoritative; all subtitles are the LAST / TOPMOST layer.
 */
interface Cue{text:string;speech:string;display:string;start:number;end:number}
interface Shot{id:string;chapter:string;visual:string;section:string;title:string;note:string;
  narration:string;sceneIndex:number;cues:Cue[];duration:number;durationSource:string}
interface Drawing{family:string;moving:Node[];coins:Circle[];vectors:Line[]}
const P={night:'#090E17',black:'#05080D',slate:'#162535',panel:'#21394A',paper:'#EAE3D2',
  white:'#F4F6EF',muted:'#A7B6C2',gold:'#ECC173',red:'#EE6D65',cyan:'#72D9D2',blue:'#76A8DD',
  green:'#79D3A0',violet:'#A8A5E7',edge:'#486072'};
const FONT='Noto Sans JP, Noto Sans CJK JP, sans-serif';
function rect(p:Node,x:number,y:number,w:number,h:number,color:string,r=8):Rect{
 const a=new Rect({x,y,width:w,height:h,fill:color,radius:r});p.add(a);return a;
}
function circ(p:Node,x:number,y:number,size:number,color:string):Circle{
 const a=new Circle({x,y,width:size,height:size,fill:color});p.add(a);return a;
}
function line(p:Node,pts:[number,number][],color=P.gold,w=5):Line{
 const a=new Line({points:pts,stroke:color,lineWidth:w,lineCap:'round',lineJoin:'round'});p.add(a);return a;
}
function txt(p:Node,t:string,x:number,y:number,size=38,color=P.white,weight=700):Txt{
 const a=new Txt({text:t,x,y,fontSize:size,fontWeight:weight,fontFamily:FONT,fill:color,textAlign:'center'});p.add(a);return a;
}
function chip(p:Node,t:string,x:number,y:number,w=360,h=100,accent=P.gold):Node{
 const g=new Node({x,y});p.add(g);rect(g,0,0,w,h,P.slate,13);
 rect(g,0,-h/2+5,w-12,9,accent,4);
 txt(g,t,0,7,t.length>18?21:t.length>12?27:34,P.white);
 return g;
}
function arrow(p:Node,x0:number,y0:number,x1:number,y1:number,color=P.gold):Line{
 const a=line(p,[[x0,y0],[x1,y1]],color,6);
 const ang=Math.atan2(y1-y0,x1-x0);
 line(p,[[x1-20*Math.cos(ang-.6),y1-20*Math.sin(ang-.6)],[x1,y1],
 [x1-20*Math.cos(ang+.6),y1-20*Math.sin(ang+.6)]],color,6);
 return a;
}
function human(p:Node,x:number,y:number,shirt=P.blue):Node{
 const g=new Node({x,y});p.add(g);
 circ(g,0,-88,56,P.paper);rect(g,0,29,96,172,shirt,18);
 line(g,[[-30,78],[-45,158]],shirt,16);line(g,[[30,78],[45,158]],shirt,16);
 line(g,[[-43,-15],[-88,52]],shirt,14);line(g,[[43,-15],[84,52]],shirt,14);
 return g;
}
function coin(p:Node,x:number,y:number,color=P.gold):Circle{
 const c=circ(p,x,y,60,color);txt(p,'¥',x,y,25,P.night);return c;
}
function paper(p:Node,x:number,y:number,w=470,h=410):Node{
 const n=new Node({x,y});p.add(n);rect(n,0,0,w,h,P.paper,13);
 for(let i=0;i<4;i++)rect(n,-26,-110+i*69,w-100-i%2*75,7,P.edge,0);
 return n;
}
function graph(p:Node,x:number,y:number,values:number[],c=P.cyan):Rect[]{
 const out:Rect[]=[];line(p,[[x-80,y+180],[x+470,y+180]],P.edge,4);
 const scale=240/Math.max(...values);
 values.forEach((v,i)=>{out.push(rect(p,x+i*108,y+180-v*scale,70,v*scale,c,7));});
 return out;
}
function art(s:Shot,root:Node):Drawing{
 const v=s.visual,moving:Node[]=[],coins:Circle[]=[],vectors:Line[]=[];
 const k=s.sceneIndex%4, ox=(k-1.5)*18;
 // Distinct environmental geometry is assigned by meaning, not scene order.
 if(v==='street'){
   for(let i=0;i<8;i++){const x=-700+i*200, h=190+(i*71)%240;
      rect(root,x,195-h/2,145,h,i%2?P.slate:P.panel,3);
      for(let n=0;n<4;n++)rect(root,x-42+n%2*82,-h/2+70+Math.floor(n/2)*69,24,31,P.gold,3);}
   line(root,[[-800,232],[800,232]],P.muted,5);moving.push(human(root,-410+ox,92,P.blue));
   moving.push(chip(root,'給料日まであと数日',395,-125,580,125,P.red));
 }else if(v==='supermarket'){
   for(let i=0;i<4;i++){rect(root,-435+i*285,0,218,520,P.panel,10);
      for(let j=0;j<4;j++)rect(root,-435+i*285,-185+j*116,176,58,
         (i+j)%2?P.gold:P.cyan,7);}
   moving.push(human(root,-575+ox,95,P.blue));
   moving.push(chip(root,'閉店間際のスーパー',0,-283,660,80,P.gold));
 }else if(v==='shelf'){
   rect(root,0,0,1430,500,P.slate,18);
   for(let i=0;i<4;i++){for(let j=0;j<3;j++)coins.push(circ(root,-610+j*105+i*310,-94+i%2*90,64,P.paper));}
   moving.push(chip(root,'4ロール / 320円',-425,217,560,94,P.red));
   moving.push(chip(root,'12ロール / 720円',425,217,560,94,P.cyan));
 }else if(v==='wallet'){
   moving.push(rect(root,-360,36,640,360,P.panel,35));
   rect(root,-360,-96,660,78,P.gold,10);
   for(let i=0;i<3;i++)coins.push(coin(root,-535+i*135,93));
   moving.push(chip(root,'手元の現金 500円',385,-82,600,190,P.red));
   txt(root,'買えない選択肢',365,178,46,P.paper);
 }else if(v==='unitprice'){
   const a=chip(root,'4ロール  80円 / 個',-425,-133,620,145,P.red);
   const b=chip(root,'12ロール  60円 / 個',425,-133,620,145,P.cyan);
   moving.push(a,b);
   moving.push(rect(root,-425,82,610,95,P.red,5));
   moving.push(rect(root,324,82,480,95,P.cyan,5));
   txt(root,'単位価格の差 25％',0,269,52,P.gold);
 }else if(v==='choice'){
   circ(root,-570,0,126,P.gold);vectors.push(arrow(root,-460,-20,-90,-160,P.cyan));
   vectors.push(arrow(root,-460,28,-90,190,P.red));
   moving.push(chip(root,'まとまった現金',320,-170,700,145,P.cyan));
   moving.push(chip(root,'今すぐ必要な支払い',320,170,700,145,P.red));
 }else if(v==='premium'){
   paper(root,-470,0,600,470);
   txt(root,'POVERTY PREMIUM',-470,-155,34,P.night);
   moving.push(chip(root,'同じ必需品',360,-132,600,145,P.blue));
   moving.push(chip(root,'追加料金',360,95,600,185,P.red));
   vectors.push(arrow(root,-115,18,75,18,P.gold));
 }else if(v==='bulk'){
   rect(root,-430,77,500,242,P.panel,25);
   for(let i=0;i<3;i++)for(let j=0;j<3;j++)coins.push(circ(root,-570+i*135,-143+j*98,69,P.paper));
   moving.push(chip(root,'まとめ買いの割引',380,-95,700,180,P.cyan));
   txt(root,'現金・保管場所・運搬',400,161,35,P.muted);
 }else if(v==='ticket'){
   rect(root,-445,-25,520,370,P.paper,16);txt(root,'定期券',-445,-120,56,P.night);
   rect(root,-445,0,400,14,P.blue,0);
   moving.push(chip(root,'毎日の切符',360,-85,680,150,P.red));
   moving.push(chip(root,'まとめ払い',360,125,680,150,P.cyan));
 }else if(v==='storage'){
   line(root,[[-680,-170],[-680,245],[125,245]],P.paper,8);
   for(let i=0;i<3;i++){rect(root,-380+i*220,95,180,180,P.panel,6);
     coins.push(circ(root,-380+i*220,38,50,P.gold));}
   moving.push(chip(root,'保管する場所',420,-105,590,160,P.gold));
   moving.push(chip(root,'運ぶ手段',420,113,590,160,P.cyan));
 }else if(v==='commute'){
   vectors.push(line(root,[[-690,-130],[-310,65],[-20,-70],[360,145],[675,-65]],P.blue,12));
   for(let i=0;i<5;i++)coins.push(circ(root,-690+i*334,[-130,65,-70,145,-65][i],55,P.paper));
   moving.push(human(root,-550,-135,P.gold));
   txt(root,'住む場所と通う費用',0,266,42,P.paper);
 }else if(v==='fridge'){
   rect(root,-440,-20,300,470,P.paper,24);rect(root,-440,-67,265,5,P.edge,0);
   rect(root,410,-20,300,470,P.paper,24);rect(root,410,-67,265,5,P.edge,0);
   txt(root,'購入は安い',-440,263,42,P.red);txt(root,'電気代が低い',410,263,42,P.cyan);
   moving.push(chip(root,'初期費用',-440,-269,410,80,P.red));
   moving.push(chip(root,'長期費用',410,-269,410,80,P.cyan));
 }else if(v==='electricity'){
   coins.push(circ(root,-470,15,240,P.gold));
   line(root,[[-470,-100],[-470,125]],P.night,12);
   moving.push(rect(root,-90,-15,180,360,P.panel,8));
   moving.push(rect(root,175,-60,180,270,P.blue,8));
   moving.push(rect(root,440,10,180,410,P.red,8));
   txt(root,'光熱費の差',200,260,48,P.paper);
 }else if(v==='housing'){
   rect(root,-360,0,720,440,P.panel,8);
   line(root,[[-730,0],[0,0]],P.paper,8);line(root,[[-360,-220],[-360,220]],P.paper,8);
   for(let i=0;i<3;i++)rect(root,-610+i*250,-75,105,120,P.blue,9);
   moving.push(chip(root,'住居の断熱性能',400,-125,620,140,P.cyan));
   moving.push(chip(root,'入居時の条件',400,98,620,140,P.red));
 }else if(v==='shopping'){
   rect(root,-420,130,580,220,P.panel,21);
   for(let i=0;i<5;i++)coins.push(circ(root,-625+i*104,-5+(i%2)*37,77,i%2?P.cyan:P.gold));
   moving.push(chip(root,'購入単位',382,-133,650,130,P.gold));
   moving.push(chip(root,'支払総額',382,77,650,130,P.red));
 }else if(v==='research'){
   paper(root,-415,0,710,520);
   txt(root,'RESEARCH',-415,-206,45,P.night);
   moving.push(chip(root,'統計の対象と条件',390,-118,635,160,P.blue));
   moving.push(chip(root,'日本への一般化は慎重に',390,109,635,158,P.gold));
 }else if(v==='bank'){
   rect(root,-470,-30,710,450,P.panel,8);
   for(let i=0;i<4;i++)rect(root,-715+i*170,7,70,360,P.paper,4);
   txt(root,'銀行',-470,-275,50,P.paper);
   moving.push(human(root,360,80,P.blue));
   moving.push(chip(root,'審査・返済履歴',348,-173,650,120,P.gold));
 }else if(v==='loan'){
   for(let i=0;i<4;i++)coins.push(coin(root,-600+i*154,-24,i<2?P.cyan:P.red));
   vectors.push(arrow(root,100,-30,350,-30,P.gold));
   moving.push(chip(root,'貸す側の条件',525,-115,435,120,P.cyan));
   moving.push(chip(root,'借りる側の負担',525,115,435,120,P.red));
 }else if(v==='interest'){
   coins.push(circ(root,-390,-40,410,P.panel));
   line(root,[[-390,145],[-220,-130]],P.red,15);
   txt(root,'金利',-390,-52,63,P.paper);
   moving.push(chip(root,'信用が高い',350,-145,600,135,P.cyan));
   moving.push(chip(root,'信用が低い',350,115,600,135,P.red));
 }else if(v==='risk'){
   rect(root,-430,-60,630,350,P.panel,20);
   for(let i=0;i<4;i++)coins.push(coin(root,-620+i*132,15,i===3?P.red:P.gold));
   moving.push(chip(root,'貸し倒れリスク',370,-135,650,125,P.red));
   moving.push(chip(root,'取引の合理性',370,98,650,125,P.cyan));
 }else if(v==='insurance'){
   paper(root,-380,0,620,490);txt(root,'INSURANCE',-380,-180,42,P.night);
   moving.push(chip(root,'一括で支払う',405,-138,620,145,P.cyan));
   moving.push(chip(root,'月ごとに支払う',405,102,620,145,P.red));
 }else if(v==='monthly'){
   for(let i=0;i<6;i++)moving.push(chip(root,['1月','2月','3月','4月','5月','6月'][i],
      -560+(i%3)*535,-125+Math.floor(i/3)*253,405,165,i%2?P.blue:P.gold));
   txt(root,'分割払いの追加費用',0,285,38,P.red);
 }else if(v==='contract'){
   moving.push(paper(root,-420,0,600,490));
   moving.push(paper(root,420,0,600,490));
   txt(root,'一括',-420,-210,54,P.night);txt(root,'分割',420,-210,54,P.night);
   txt(root,'追加費用 0',-420,185,38,P.blue);
   txt(root,'手数料・信用費用',420,185,34,P.red);
 }else if(v==='debtcycle'){
   const pos:[number,number][]=[[-470,-155],[445,-155],[445,178],[-470,178]];
   const names=['貯金の不足','高い取引費用','貯金が増えない','不利な契約'];
   pos.forEach(([x,y],i)=>moving.push(chip(root,names[i],x,y,560,138,[P.red,P.gold,P.blue,P.cyan][i])));
   vectors.push(arrow(root,-180,-155,160,-155),arrow(root,445,-65,445,88),
     arrow(root,160,178,-180,178),arrow(root,-470,88,-470,-65));
 }else if(v==='worry'){
   circ(root,-420,-15,330,P.paper);
   line(root,[[-420,-15],[-420,-145]],P.night,11);
   line(root,[[-420,-15],[-300,40]],P.night,7);
   moving.push(chip(root,'家賃の引き落とし',390,-132,670,156,P.red));
   moving.push(chip(root,'給料日まで数日',390,90,670,156,P.gold));
 }else if(v==='clock'){
   rect(root,-380,0,710,490,P.panel,16);
   for(let i=0;i<5;i++)moving.push(rect(root,-640+i*120,-65+i*32,90,205,i%2?P.blue:P.gold,8));
   moving.push(chip(root,'限られた時間',380,-132,650,142,P.red));
   txt(root,'仕事 / 家事 / 手続き',380,96,42,P.paper);
 }else if(v==='focus'){
   for(let i=0;i<5;i++)moving.push(chip(root,['請求書','料金表','期日','家賃','交通費'][i],
      -525+i*255,((i+1)%2)*165-95,240,150,i%2?P.gold:P.red));
   txt(root,'比較する余裕も必要',0,268,41,P.paper);
 }else if(v==='brain'){
   coins.push(circ(root,0,0,300,P.panel));
   for(let i=0;i<8;i++){const a=i*Math.PI/4;const x=Math.cos(a)*540,y=Math.sin(a)*225;
      vectors.push(line(root,[[x*.5,y*.65],[x,y]],i%2?P.gold:P.cyan,3));
      coins.push(circ(root,x,y,60,i%3?P.blue:P.red));}
   txt(root,'注意の配分',0,0,50,P.paper);
 }else if(v==='phone'){
   rect(root,-405,0,435,560,P.paper,47);
   rect(root,-405,-10,370,450,P.night,18);
   txt(root,'料金プラン比較',-405,-168,34,P.paper);
   for(let i=0;i<3;i++)moving.push(rect(root,-405,-60+i*103,280,60,
         i%2?P.blue:P.cyan,8));
   moving.push(chip(root,'見直しには労力がいる',360,-60,660,180,P.gold));
 }else if(v==='forms'){
   moving.push(paper(root,-430,-30,620,500));
   txt(root,'申請書類',-430,-230,44,P.night);
   moving.push(chip(root,'必要な情報を集める',405,-120,645,155,P.gold));
   moving.push(chip(root,'窓口へ提出する',405,105,645,155,P.cyan));
 }else if(v==='application'){
   for(let i=0;i<4;i++)moving.push(human(root,-630+i*280,70,i%2?P.gold:P.blue));
   moving.push(chip(root,'申請の面接',25,-225,585,130,P.gold));
   txt(root,'手続きを改善すると利用率が変わる',0,291,33,P.paper);
 }else if(v==='support'){
   line(root,[[-700,-245],[700,-245],[355,228],[-355,228],[-700,-245]],P.cyan,8);
   moving.push(chip(root,'支援の資格',0,-160,680,125,P.blue));
   moving.push(chip(root,'申請の負担',0,30,580,125,P.red));
   moving.push(chip(root,'支援の利用',0,208,440,91,P.cyan));
 }else if(v==='career'){
   rect(root,-355,54,735,260,P.panel,12);rect(root,-355,-144,460,130,P.slate,15);
   moving.push(human(root,-390,30,P.blue));
   moving.push(chip(root,'今の職場',393,-140,600,130,P.gold));
   moving.push(chip(root,'将来の選択肢',393,102,600,130,P.cyan));
 }else if(v==='interview'){
   rect(root,0,95,1000,65,P.paper,5);
   moving.push(human(root,-430,8,P.blue));moving.push(human(root,430,8,P.gold));
   txt(root,'転職の面接',0,-265,55,P.paper);
   moving.push(chip(root,'交通費と時間',0,246,650,100,P.red));
 }else if(v==='school'){
   rect(root,-400,0,710,440,P.paper,16);
   line(root,[[-400,-207],[-400,207]],P.edge,5);
   for(let i=0;i<4;i++)line(root,[[-650,-95+i*70],[-155,-95+i*70]],P.edge,4);
   moving.push(chip(root,'学び直しの費用',395,-130,630,150,P.gold));
   moving.push(chip(root,'失敗のリスク',395,104,630,150,P.red));
 }else if(v==='ladder'){
   for(let i=0;i<6;i++)moving.push(rect(root,-610+i*228,190-i*75,195,72,
      i%2?P.cyan:P.blue,4));
   moving.push(human(root,-552,95,P.gold));
   txt(root,'機会への参加条件',0,-263,46,P.paper);
 }else if(v==='grant'){
   moving.push(chip(root,'現金給付',-500,-45,560,245,P.gold));
   vectors.push(arrow(root,-180,-45,185,-45,P.cyan));
   moving.push(chip(root,'資産形成への投資',497,-45,650,245,P.cyan));
   txt(root,'実証研究：ケニアの対象世帯',0,270,33,P.muted);
 }else if(v==='assets'){
   moving.push(...graph(root,-500,-80,[1.5,2.2,3.5,5.1,7.8],P.cyan));
   moving.push(chip(root,'資産が選択肢を増やす',360,-102,670,140,P.gold));
   moving.push(chip(root,'不測の出費を吸収',360,108,670,140,P.blue));
 }else if(v==='path'){
   vectors.push(arrow(root,-650,120,-55,-165,P.cyan));
   vectors.push(arrow(root,-650,120,-55,225,P.red));
   moving.push(chip(root,'投資・転職の道',320,-160,640,156,P.cyan));
   moving.push(chip(root,'現状維持の道',320,166,640,156,P.red));
 }else if(v==='future'){
   line(root,[[-720,185],[730,185]],P.gold,9);
   for(let i=0;i<5;i++)coins.push(circ(root,-600+i*290,185,55,i%2?P.cyan:P.red));
   moving.push(chip(root,'今日の生活',-430,-85,560,160,P.red));
   moving.push(chip(root,'将来の節約',410,-85,560,160,P.cyan));
   vectors.push(arrow(root,-135,-85,125,-85,P.gold));
 }else if(v==='scale'){
   line(root,[[0,-210],[0,160]],P.paper,8);line(root,[[-585,-145],[585,-145]],P.paper,12);
   line(root,[[-440,-145],[-440,58]],P.gold,4);line(root,[[440,-145],[440,58]],P.gold,4);
   rect(root,-440,100,350,45,P.red,10);rect(root,440,100,350,45,P.cyan,10);
   moving.push(chip(root,'短期の値段',-455,235,495,90,P.red));
   moving.push(chip(root,'長期の費用',455,235,495,90,P.cyan));
 }else if(v==='ending'){
   rect(root,0,0,1430,555,P.slate,16);
   txt(root,'お金がないことに',0,-152,68,P.paper);
   txt(root,'追加料金が発生する',0,15,79,P.red);
   moving.push(chip(root,'貧困プレミアム',0,226,760,100,P.gold));
 }else{
   throw new Error('Unplanned poverty-premium visual '+s.id+' / '+v);
 }
 // Topic-specific body copy: new text and geometry per narration scene.
 txt(root,s.note,0,326,25,P.muted,400);
 return {family:v,moving,coins,vectors};
}
function* evolve(d:Drawing,s:Shot,ci:number,secs:number):ThreadGenerator{
 const t=Math.max(.11,Math.min(.69,secs*.32));
 const a:ThreadGenerator[]=[];
 const idx=(s.sceneIndex*3+ci)%Math.max(1,d.moving.length);
 const phase=(ci+1)/Math.max(1,s.cues.length);
 const action=(s.sceneIndex*17+ci*11)%7;
 if(d.moving.length){
   const n=d.moving[idx];
   if(action===0)a.push(n.opacity(.53+.45*phase,t));
   else if(action===1)a.push(n.scale(1.03+.09*phase,t));
   else if(action===2)a.push(n.y(n.y()+8+(ci%2)*7,t));
   else if(action===3)a.push(n.x(n.x()+(ci%2?13:-13),t));
   else if(action===4)a.push(n.opacity(.67+.30*phase,t));
   else if(action===5)a.push(n.scale(1+.10*phase,t));
   else a.push(n.opacity(.66+.30*phase,t));
 }
 if(d.coins.length){
   const n=d.coins[(ci+s.sceneIndex)%d.coins.length];
   if(action%2)a.push(n.scale(1.04+.09*phase,t));
   else a.push(n.opacity(.52+.46*phase,t));
 }
 if(d.vectors.length && action%3===0){
   const n=d.vectors[(ci+s.sceneIndex)%d.vectors.length];
   a.push(n.opacity(.52+.45*phase,t));
 }
 if(a.length)yield* all(...a);else yield* waitFor(t);
 yield* waitFor(Math.max(.001,secs-t));
}
export function* playScene(view:View2D,s:Shot):ThreadGenerator{
 if(s.durationSource!=='VOICEVOX_MEASURED')throw new Error('Timing not measured '+s.id);
 const content=new Node({}),top=new Node({}),footer=new Node({}),subtitle=new Node({});
 view.add(content);view.add(top);view.add(footer);view.add(subtitle);
 view.fill(P.night);
 rect(content,0,0,1920,1080,P.night,0);
 rect(content,0,0,1810,945,P.black,13);
 line(content,[[-865,-359],[865,-359]],P.edge,2);
 const family=art(s,content);
 rect(top,0,-472,1920,136,P.night,0);
 txt(top,s.chapter==='prologue'?'PROLOGUE':s.chapter==='epilogue'?'EPILOGUE':
  'CHAPTER '+s.chapter.replace('chapter',''),-770,-465,21,P.gold);
 txt(top,s.title,0,-466,s.title.length>19?29:s.title.length>13?34:40,P.paper);
 txt(top,'POVERTY PREMIUM / V137',754,-465,19,P.muted);
 rect(footer,0,451,1920,178,P.night,0).opacity(.99);
 const sub=txt(subtitle,'',0,453,43,P.white);sub.width(1660);sub.lineHeight(63);
 for(let i=0;i<s.cues.length;i++){
  const cue=s.cues[i],dt=cue.end-cue.start;
  if(!(dt>0))throw new Error('Bad measured cue '+s.id);
  sub.text(cue.display);
  yield* evolve(family,s,i,dt);
 }
 sub.text('');
}
