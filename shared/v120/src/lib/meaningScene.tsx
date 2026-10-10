import '@fontsource/noto-sans-jp/400.css';
import '@fontsource/noto-sans-jp/700.css';
import {Circle, Line, Node, Rect, Txt, type View2D} from '@motion-canvas/2d';
import {all, waitFor, type ThreadGenerator} from '@motion-canvas/core';

/** V120: one world-space per meaning beat; objects progress causally in that space.
 * Paint order is immutable: content -> headings -> caption backing -> caption glyphs.
 * No children may be appended directly to view after these roots exist.
 */
interface Cue {text:string;display:string;start:number;end:number}
interface MeaningScene {id:string;chapter:string;motif:string;title:string;cues:Cue[];duration:number}
type Token='girl'|'adult'|'friend'|'teacher'|'family'|'home'|'house'|'building'|'office'|'phone'|
 'money'|'coins'|'bed'|'bag'|'clock'|'book'|'paper'|'letter'|'brain'|'door'|'lock'|'bridge'|
 'net'|'shield'|'chain'|'judge'|'heart'|'lifebuoy'|'help'|'question'|'food'|'sun'|'cross'|'calendar';
type Mode='street'|'home'|'split'|'network'|'bureau'|'market'|'metaphor'|'portrait'|'documentary';
interface Plan {mode:Mode; objects:Token[]; beats:string[]; highlight?:string}
const C={night:'#080E19',navy:'#0B1B29',urban:'#192A36',paper:'#F0EFE7',muted:'#A0B5BF',
  red:'#E65A55',gold:'#DAB477',teal:'#79C9C1',blue:'#7095BF',ink:'#172C39',
  green:'#91C8A7',pink:'#C8A0AD',stroke:'#3B6069'};
const FONT='Noto Sans JP, Noto Sans CJK JP, sans-serif';
const t=(s:string,x:number,y:number,size=31,color=C.paper,bold=600)=>
 new Txt({text:s,x,y,fontFamily:FONT,fontSize:size,fill:color,fontWeight:bold});
const rect=(p:Node,x:number,y:number,w:number,h:number,fill:string,radius=8)=>
 p.add(new Rect({x,y,width:w,height:h,fill,radius}));
const circle=(p:Node,x:number,y:number,r:number,fill:string)=>
 p.add(new Circle({x,y,width:r*2,height:r*2,fill}));
const line=(p:Node,points:[number,number][],stroke:string,width=5)=>
 p.add(new Line({points,stroke,lineWidth:width,lineCap:'round',lineJoin:'round'}));
const gold=C.gold,red=C.red,white=C.paper;
const plans:Record<string,Plan>={
P00:{mode:'street',objects:['building','girl','bag','phone','coins','clock','home'],beats:['繁華街の夜','孤立した少女','小さな荷物','残りわずかな電池','数千円の残金','時間だけが進む','帰れる場所がない']},
P01:{mode:'street',objects:['friend','bed','coins','clock','girl','door','question'],beats:['一泊目は友人','二泊目は有料の宿','所持金が減る','三日目の夜','行き場を失う','閉まる入口','今夜どこで眠る？']},
P02:{mode:'street',objects:['girl','adult','phone','home','money','chain','question'],beats:['ベンチの少女','大人が接近','携帯を提示','住む部屋','すぐ得られる現金','見えない拘束','危険と生存の間']},
P03:{mode:'documentary',objects:['book','paper','girl','building','home','phone','money'],beats:['2014年のルポ','現場を取材する','孤立する少女','性産業の周辺','生活の拠点','通信手段','金銭の提供']},
P04:{mode:'metaphor',objects:['help','home','money','lock','chain','girl','question'],beats:['差し伸べられた手','今夜の住まい','当面の生活費','支配される鍵','離れられない','犠牲となる自由','救済なのか']},
P05:{mode:'network',objects:['shield','home','chain','question','book','brain','bridge'],beats:['正規の制度','生活の必要','非合法な関係','なぜ逆転する？','貧困研究','認知と行動','社会との接続']},
A00:{mode:'home',objects:['home','friend','family','food','office','heart','shield'],beats:['月16万円の生活','シェアハウス','実家の支え','米と野菜が届く','仕事の紹介','病気の看病','つながりが守る']},
A01:{mode:'home',objects:['home','girl','cross','office','letter','money','lock'],beats:['同じ月16万円','ひとりきりの部屋','頼れる家族なし','失業しても孤立','制度の案内なし','家賃が払えない','住居喪失の危険']},
A02:{mode:'split',objects:['coins','heart','family','cross','shield','question','bridge'],beats:['同じ所得でも','人間関係の資源','支えのある側','支えのない側','異なる生活の安全','貧乏と貧困','社会的孤立が分岐']},
A03:{mode:'home',objects:['family','home','heart','cross','girl','bag','door'],beats:['家族という保護','帰る場所','守られる子供','家庭内の危険','家を出る少女','わずかな荷物','逃避としての家出']},
A04:{mode:'network',objects:['girl','teacher','friend','family','cross','door','question'],beats:['家庭が危険','教師を頼れるか','友人はいるか','親戚とつながるか','関係が断たれる','学校にも居場所なし','社会との接点を失う']},
A05:{mode:'bureau',objects:['building','shield','girl','paper','cross','phone','door'],beats:['支援制度はある','守る仕組み','困窮する少女','手続きの案内','知る機会がない','不信感が障壁に','届かない支援']},
A06:{mode:'bureau',objects:['brain','paper','calendar','phone','cross','door','help'],beats:['三つの障害','説明を理解する','書類を用意する','約束を守る','連絡が途絶える','本人には高い壁','怠慢とは限らない']},
A07:{mode:'network',objects:['family','friend','shield','brain','chain','girl','bridge'],beats:['家族との断絶','地域との断絶','制度への距離','認知面の負担','困難が重なる','助けを求められない','橋を架ける必要']},
B00:{mode:'street',objects:['girl','bag','coins','bed','phone','clock','question'],beats:['家出三日目','残る着替え','財布が空になる','泊まる場所なし','誰かに連絡したい','夜が迫る','何が必要か']},
B01:{mode:'market',objects:['home','paper','money','office','phone','lock','question'],beats:['住まいが必要','契約と審査','収入が必要','仕事には住所','通信契約の壁','条件が循環','出口はどこか']},
B02:{mode:'market',objects:['girl','phone','bed','money','home','chain','net'],beats:['困窮する少女','携帯を用意','寮のような住まい','現金の機会','生活を一括提供','依存が始まる','路上の安全網']},
B03:{mode:'split',objects:['office','paper','calendar','girl','cross','money','chain'],beats:['通常の労働市場','年齢や資格','確認と手続き','未成年の弱み','違法側は制約無視','即時の提示','弱みが利用される']},
B04:{mode:'metaphor',objects:['clock','bed','food','money','chain','girl','question'],beats:['時計の進行','今夜の寝床','明日の食事','目前の利益','将来の危険','選択肢の少なさ','生存の優先']},
B05:{mode:'metaphor',objects:['net','girl','bed','shield','chain','lock','question'],beats:['安全網のはずが','少女を受け止める','住まいを与える','一時的な安心','依存の糸','拘束へ変わる','誰のための網か']},
B06:{mode:'split',objects:['adult','shield','girl','cross','lock','question','heart'],beats:['成人の自発的選択','権利の尊重','未成年の少女','性的搾取の構造','生活の支配','自由な選択ではない','必要なのは安全']},
B07:{mode:'bureau',objects:['building','paper','clock','girl','home','money','bridge'],beats:['制度には目的がある','説明と手続き','必要な時間','一方の少女','目前の住居','提示される現金','接続の距離']},
C00:{mode:'documentary',objects:['book','brain','cross','paper','clock','calendar','question'],beats:['取材を続けた鈴木','2015年の脳梗塞','高次脳機能障害','文章を理解する壁','予定通り動けない','作業の順序','意思だけでは困難']},
C01:{mode:'bureau',objects:['letter','paper','calendar','phone','cross','brain','help'],beats:['届いた封筒','申請の書類','期限が過ぎる','電話に出られない','機会を逃す','認知面の困難','怠慢ではないかも']},
C02:{mode:'documentary',objects:['book','brain','paper','question','cross','heart','shield'],beats:['2024年の著書','見えない認知負担','行動が難しい','努力不足なのか','誤解される困難','別の解釈へ','自己責任を再考']},
C03:{mode:'bureau',objects:['building','phone','calendar','paper','girl','lock','question'],beats:['相談窓口','予約の電話','日時を覚える','書類を整える','困難を説明する','手続きが壁になる','救済への入口']},
C04:{mode:'metaphor',objects:['lifebuoy','girl','bridge','cross','shield','help','question'],beats:['水に浮かぶ救命具','泳げない人','岸へ続く距離','自力では届かない','支援のための制度','迎えに行く支援','誰に届くのか']},
C05:{mode:'portrait',objects:['girl','home','cross','adult','paper','lock','heart'],beats:['虐待の記憶','安全ではない家','失われた信頼','初対面の大人','繰り返す質問','恐怖と不安','安心を築く必要']},
C06:{mode:'split',objects:['shield','heart','building','money','lock','girl','question'],beats:['公的な支援','安全と生活再建','責任を負う制度','搾取側の現金','支配の手段','少女から見た距離','目的の違い']},
C07:{mode:'bureau',objects:['calendar','paper','building','friend','girl','bridge','heart'],beats:['2024年4月','女性支援新法','行政と民間の協働','街に出る支援者','孤立する少女','制度から迎えに行く','届く支援を目指す']},
D00:{mode:'home',objects:['girl','home','bed','phone','money','lock','chain'],beats:['屋根のある場所','寮で眠れる','食事と荷物','携帯の提供','生活費の確保','鍵を握る組織','依存が始まる']},
D01:{mode:'market',objects:['office','door','home','phone','money','lock','question'],beats:['関係を辞める自由','出口のドア','住居を失う','通信も止まる','収入がなくなる','離脱の大きな負担','自由な選択か']},
D02:{mode:'network',objects:['girl','adult','heart','money','friend','chain','lock'],beats:['孤立した少女','名を呼ぶ大人','所属の感覚','金を貸す','関係への期待','心理的な依存','離れにくい支配']},
D03:{mode:'split',objects:['judge','girl','question','family','cross','brain','heart'],beats:['自己責任という非難','批判される少女','ほかの道は？','家族との無縁','地域の断絶','制度の障壁','選択の条件を見る']},
D04:{mode:'street',objects:['building','cross','girl','bag','home','food','shield'],beats:['違法組織の摘発','搾取を止める','解放された少女','手元には荷物だけ','住まいの問題','食事の問題','保護も同時に必要']},
D05:{mode:'network',objects:['home','office','shield','cross','money','chain','bridge'],beats:['合法的な生活資源','仕事と住居','制度からの支援','取り残された空白','非合法市場の侵入','困窮の利用','安全な代替手段']},
D06:{mode:'metaphor',objects:['help','home','phone','chain','net','girl','question'],beats:['助けに見える手','提供された住居','連絡手段','拘束の連鎖','搾取の網','自由を失う少女','誰が守るのか']},
E00:{mode:'documentary',objects:['book','girl','question','home','bed','paper','heart'],beats:['鈴木の取材経験','少女の問い','寮を作れなかったか','住まいの必要','今夜の寝床','語ることの距離','生活を支えること']},
E01:{mode:'street',objects:['girl','bag','home','friend','phone','food','bridge'],beats:['冒頭の少女','家を出た夜','安全な宿泊場所','信頼できる支援者','通信手段','温かい食事','違う選択への道']},
E02:{mode:'network',objects:['home','heart','teacher','office','shield','bridge','sun'],beats:['緊急の住まい','傷の回復','教育の継続','就労支援','生活の保障','長期的な支援','安全な未来へ']},
E03:{mode:'metaphor',objects:['coins','family','friend','shield','cross','chain','help'],beats:['お金の欠乏','家族との断絶','地域から孤立','制度へ届かない','選ぶ自由を失う','搾取への依存','誰が最初に救う']},
E04:{mode:'street',objects:['girl','bag','clock','adult','shield','bridge','sun'],beats:['再び夜の街','小さなバッグ','深夜の時計','近づく搾取者','本来の救済','先に手を差し伸べる','次の夜に']}
};
function backdrop(p:Node,scene:MeaningScene,mode:Mode){
 const bg=mode==='street'?'#101C2A':mode==='documentary'?'#12222B':mode==='bureau'?'#0E1A24':C.night;
 rect(p,0,0,1920,1080,bg,0);
 if(mode==='street'){
  for(let i=0;i<13;i++){
   const h=180+(i*97)%350,x=-930+i*155;
   rect(p,x,120-h/2,145,h,i%3===0?'#243846':'#1D2F3D',0);
   for(let j=0;j<4;j++)for(let k=0;k<2;k++)
    rect(p,x-34+k*64,115-h+j*66,18,24,(i+j+k)%4===0?'#806F55':'#344856',1);
  }
  line(p,[[-960,315],[960,315]],'#4C6570',8);
 }else if(mode==='home'){
  rect(p,-510,7,770,600,'#192B35',9);
  line(p,[[-865,260],[-150,260]],'#596C73',6);
  rect(p,400,25,730,565,'#182631',9);
  line(p,[[60,260],[760,260]],'#53636B',6);
 }else if(mode==='split'){
  rect(p,-480,-8,870,665,'#122F35',14);
  rect(p,480,-8,870,665,'#32232E',14);
  rect(p,0,-8,4,668,'#6D6870',0);
 }else if(mode==='network'){
  for(const [x,y] of [[-710,-220],[-350,120],[90,-190],[450,155],[690,-140]] as const)
   circle(p,x,y,55,'#143140');
  for(let i=0;i<5;i++)line(p,[[-780+i*340,-245],[650-i*150,265]],'#294B59',2);
 }else if(mode==='bureau'){
  for(let i=0;i<5;i++)rect(p,-720+i*350,-205,285,420,'#132631',13);
  line(p,[[-910,270],[910,270]],'#31515D',5);
 }else if(mode==='market'){
  for(let i=0;i<5;i++)rect(p,-785+i*370,-100,280,450,'#132734',12);
  line(p,[[-920,265],[920,265]],'#456574',5);
 }else if(mode==='metaphor'){
  circle(p,0,0,360,'#122733');
  for(let i=0;i<6;i++)circle(p,-700+i*280,(i%2)*200-150,16,'#345664');
 }else if(mode==='street'||mode==='home'||mode==='portrait'){
  holder.add(t(caption,0,106,caption.length>11?18:caption.length>8?21:24,accent,700));
 }else if(mode==='documentary'){
  rect(p,0,-20,1300,625,'#E6DECB',12);
  rect(p,12,-16,1260,590,'#F1ECE1',9);
 }else{
  rect(p,0,50,1200,480,'#142D38',18);
 }
}
function tokenDraw(p:Node,token:Token,accent:string){
 const ink=C.ink;
 switch(token){
 case 'girl':case 'adult':case 'friend':case 'teacher':case 'family':{
  const person=token==='girl'?C.pink:token==='adult'?C.red:token==='family'?C.gold:token==='teacher'?C.teal:C.blue;
  circle(p,0,-45,30,person);rect(p,0,35,66,95,person,21);
  line(p,[[-22,65],[-35,132]],person,14);line(p,[[22,65],[35,132]],person,14);
  line(p,[[-33,10],[-71,58]],person,12);line(p,[[33,10],[74,50]],person,12);
  if(token==='girl'){rect(p,0,98,95,5,ink,0);}
  break;
 }
 case 'home':case 'house':{
  rect(p,0,32,148,117,'#A8BBC2',6);line(p,[[-88,-25],[0,-91],[89,-25]],accent,13);
  rect(p,0,48,44,82,ink,2);rect(p,-44,18,26,30,C.gold,1);
  break;
 }
 case 'building':case 'office':{
  rect(p,0,10,130,205,'#8DA7B6',8);
  for(let y=-60;y<=66;y+=58)for(const x of [-35,27])rect(p,x,y,25,29,'#234E62',2);
  rect(p,0,94,39,40,C.night,2);break;
 }
 case 'phone':{
  rect(p,0,5,86,163,'#C4CCD0',16);rect(p,0,-5,68,124,ink,5);
  circle(p,0,62,4,C.paper);rect(p,0,-57,33,4,accent,2);break;
 }
 case 'money':case 'coins':{
  if(token==='money'){rect(p,0,0,178,104,'#507966',7);circle(p,0,0,35,'#B3CC9B');rect(p,-66,0,14,44,C.gold);rect(p,66,0,14,44,C.gold);}
  else{for(let i=0;i<4;i++){rect(p,-48+i*30,49-i*19,40,23,'#B7A16E',5);circle(p,-48+i*30,24-i*19,19,C.gold);}}
  break;
 }
 case 'bed':{
  rect(p,0,44,196,38,C.blue,4);rect(p,-78,-8,38,127,C.paper,3);
  rect(p,-7,12,127,40,'#DEE2D5',17);line(p,[[-100,77],[-100,109]],C.paper,9);line(p,[[96,77],[96,109]],C.paper,9);
  break;
 }
 case 'bag':{rect(p,0,20,132,129,'#866F63',15);line(p,[[-39,-47],[-39,-72],[39,-72],[39,-47]],C.gold,11);rect(p,0,15,45,12,C.gold,3);break;}
 case 'clock':{circle(p,0,0,78,C.paper);circle(p,0,0,69,ink);line(p,[[0,0],[0,-44]],C.paper,9);line(p,[[0,0],[39,19]],accent,8);circle(p,0,0,8,C.paper);break;}
 case 'book':{
  rect(p,-47,0,95,145,C.paper,5);rect(p,47,0,95,145,'#D9D7CB',5);
  line(p,[[0,-74],[0,75]],accent,6);for(let i=0;i<4;i++){line(p,[[-80,-43+i*27],[-23,-43+i*27]],'#667A85',3);line(p,[[20,-43+i*27],[82,-43+i*27]],'#667A85',3);}
  break;
 }
 case 'paper':case 'letter':{
  rect(p,0,0,120,162,C.paper,5);
  for(let i=0;i<4;i++)line(p,[[-43,-53+i*28],[36,-53+i*28]],'#9CA9B1',4);
  if(token==='letter'){line(p,[[-57,-58],[0,4],[57,-58]],accent,5);}
  break;
 }
 case 'brain':{
  for(const [x,y,z] of [[-38,-26,37],[2,-55,42],[43,-23,37],[-27,20,40],[26,24,40]] as const)circle(p,x,y,z,'#C59D9B');
  line(p,[[0,-75],[0,60]],'#754D62',5);break;
 }
 case 'door':{rect(p,0,0,137,220,'#A1AEB2',6);rect(p,0,0,111,197,C.ink,3);circle(p,37,18,8,C.gold);break;}
 case 'lock':{rect(p,0,36,128,96,C.red,12);line(p,[[-38,5],[-38,-48],[38,-48],[38,5]],C.paper,16);circle(p,0,38,11,C.paper);break;}
 case 'bridge':{line(p,[[-100,60],[-28,-34],[29,-34],[100,60]],accent,13);line(p,[[-108,60],[108,60]],C.paper,10);line(p,[[-80,28],[-80,75]],C.paper,7);line(p,[[80,28],[80,75]],C.paper,7);break;}
 case 'net':{
  for(let i=-3;i<=3;i++){line(p,[[-110,i*27],[110,i*27]],C.teal,3);line(p,[[i*33,-91],[i*33,91]],C.teal,3);}
  line(p,[[-117,-99],[117,-99],[117,99],[-117,99],[-117,-99]],accent,8);break;
 }
 case 'shield':{
  line(p,[[0,-99],[88,-62],[73,45],[0,105],[-73,45],[-88,-62],[0,-99]],C.teal,15);
  line(p,[[-31,4],[-5,31],[43,-38]],C.paper,12);break;
 }
 case 'chain':{for(let i=-1;i<=1;i++)circle(p,i*52,i%2*23,34,i===1?C.red:C.muted);line(p,[[-116,0],[114,2]],C.red,10);break;}
 case 'judge':{rect(p,0,78,160,29,C.paper,4);line(p,[[-75,-52],[16,32]],C.gold,18);rect(p,25,18,95,29,C.gold,5);rect(p,-66,-72,84,33,C.gold,5);break;}
 case 'heart':{
  circle(p,-33,-32,48,C.pink);circle(p,33,-32,48,C.pink);
  line(p,[[-79,-8],[0,96],[80,-8]],C.pink,53);break;
 }
 case 'lifebuoy':{
  circle(p,0,0,88,C.paper);circle(p,0,0,53,C.red);circle(p,0,0,39,C.ink);
  for(let i=0;i<4;i++){const a=i*Math.PI/2;circle(p,Math.cos(a)*74,Math.sin(a)*74,13,C.red);}break;
 }
 case 'help':{circle(p,0,-35,41,C.paper);rect(p,0,57,114,105,C.teal,27);line(p,[[48,14],[110,-57]],C.teal,16);circle(p,114,-65,11,C.paper);break;}
 case 'question':{circle(p,0,0,76,'#233B4A');p.add(t('？',0,-4,107,accent,700));break;}
 case 'food':{circle(p,0,23,79,'#D2D6D0');circle(p,0,23,52,'#72967A');circle(p,-28,12,17,C.gold);circle(p,30,34,18,C.red);break;}
 case 'sun':{circle(p,0,0,56,C.gold);for(let i=0;i<8;i++){const a=i*Math.PI/4;line(p,[[Math.cos(a)*75,Math.sin(a)*75],[Math.cos(a)*102,Math.sin(a)*102]],C.gold,9);}break;}
 case 'cross':{rect(p,0,0,138,27,C.red,5);rect(p,0,0,27,138,C.red,5);break;}
 case 'calendar':{rect(p,0,5,145,167,C.paper,8);rect(p,0,-62,145,35,C.red,4);for(let i=0;i<3;i++)for(let j=0;j<3;j++)circle(p,-42+i*42,-15+j*35,8,C.blue);break;}
 }
}
const variantSpots:Record<Mode,[number,number][]>={
 street:[[-710,120],[-510,-90],[-275,105],[-25,-120],[245,90],[515,-105],[742,123]],
 home:[[-730,-90],[-525,130],[-292,-155],[285,-105],[500,135],[728,-155],[0,185]],
 split:[[-710,-115],[-430,110],[-160,-125],[170,-110],[430,115],[700,-140],[0,245]],
 network:[[0,-155],[-550,-155],[-655,125],[-250,120],[280,-130],[610,100],[0,240]],
 bureau:[[-735,-75],[-505,135],[-270,-110],[-15,125],[270,-110],[505,125],[735,-75]],
 market:[[-745,95],[-505,-125],[-265,90],[-20,-120],[260,95],[510,-100],[740,105]],
 metaphor:[[0,-145],[-585,-120],[-615,135],[-300,210],[315,-130],[615,125],[50,210]],
 portrait:[[-705,85],[-500,-130],[-275,135],[0,-155],[265,125],[510,-130],[725,80]],
 documentary:[[-650,-135],[-375,100],[-100,-125],[180,85],[445,-135],[680,98],[0,215]]
};
function buildConnections(p:Node,mode:Mode,positions:[number,number][]):Node[]{
 const lines:Node[]=[];
 for(let i=1;i<positions.length;i++){
  const group=new Node({opacity:0});p.add(group);
  const a=positions[i-1],b=positions[i];
  const stroke=mode==='split'&&i===3?C.red:mode==='home'?C.gold:mode==='network'?C.teal:C.stroke;
  line(group,[[a[0],a[1]],[b[0],b[1]]],stroke,mode==='network'?5:3);
  lines.push(group);
 }
 return lines;
}
function makeBeat(parent:Node,token:Token,caption:string,index:number,mode:Mode,accent:string){
 const spot=variantSpots[mode][index];const startX=spot[0]+(index%2===0?-85:85);
 const holder=new Node({x:startX,y:spot[1]+22,opacity:0,scale:.76});
 parent.add(holder);
 const tile=new Node({y:-20,scale:.60});
 holder.add(tile);tokenDraw(tile,token,accent);
 if(mode==='documentary'){
  rect(holder,0,98,250,52,'#E5DAC7',5);
  holder.add(t(caption,0,96,caption.length>11?18:caption.length>8?21:24,C.ink,700));
 }else{
  rect(holder,0,97,258,54,'#142A37',7);
  holder.add(t(caption,0,97,caption.length>11?18:caption.length>8?21:24,accent,700));
 }
 return {node:holder,targetX:spot[0],targetY:spot[1]};
}
function* animateBeats(beats:{node:Node;targetX:number;targetY:number}[],time:number,links:Node[],mode:Mode):ThreadGenerator{
 const count=beats.length;let elapsed=0;
 for(let i=0;i<count;i++){
  const start=Math.max(0,(time-1.2)*(i/count));
  if(start>elapsed){yield* waitFor(start-elapsed);elapsed=start;}
  const b=beats[i],transition=Math.min(.75,Math.max(.3,time/count*.23));
  const linkMoves=i===0?[]:[links[i-1].opacity(mode==='split'?.55:.85,transition)];
  yield* all(b.node.opacity(1,transition),b.node.x(b.targetX,transition),b.node.y(b.targetY,transition),b.node.scale(1,transition),...linkMoves);
  elapsed+=transition;
  if(i>=3 && i%2===0){
   const older=beats[i-3];
   yield* all(older.node.opacity(.62,.21),older.node.scale(.91,.21));
   elapsed+=.21;
  }
 }
 if(time>elapsed)yield* waitFor(time-elapsed);
}
function* subtitleTrack(cues:Cue[],element:Txt,duration:number):ThreadGenerator{
 let at=0;
 for(const cue of cues){
  if(cue.start>at)yield* waitFor(cue.start-at);
  element.text(cue.display);at=cue.start;
 }
 if(duration>at)yield* waitFor(duration-at);
 element.text('');
}
export function* playMeaningScene(view:View2D,scene:MeaningScene):ThreadGenerator{
 view.fill(C.night);
 const contentLayer=new Node({});
 const headingLayer=new Node({});
 const subtitleBacking=new Node({});
 const subtitleTextLayer=new Node({});
 view.add(contentLayer);
 view.add(headingLayer);
 view.add(subtitleBacking);
 view.add(subtitleTextLayer);
 const plan=plans[scene.id];if(!plan)throw new Error('Missing storyboard '+scene.id);
 backdrop(contentLayer,scene,plan.mode);
 const sceneStage=new Node({});contentLayer.add(sceneStage);
 const connections=new Node({});sceneStage.add(connections);
 const links=buildConnections(connections,plan.mode,variantSpots[plan.mode]);
 const beats=plan.objects.map((token,i)=>makeBeat(sceneStage,token,plan.beats[i],i,plan.mode,i===6?C.red:i%3===0?C.gold:C.teal));
 rect(headingLayer,0,-473,1920,138,'#07101A',0);
 const label=scene.chapter==='prologue'?'PROLOGUE':scene.chapter==='epilogue'?'EPILOGUE':scene.chapter.toUpperCase();
 headingLayer.add(t(label,-790,-507,22,C.gold,700));
 headingLayer.add(t(scene.id,826,-507,22,C.muted,600));
 const headerSize=scene.title.length>19?35:scene.title.length>15?39:45;
 headingLayer.add(t(scene.title,0,-451,headerSize,C.paper,700));
 // The 170-pixel subtitle band always wins over every existing/future content child.
 rect(subtitleBacking,0,459,1920,171,'#020509',0);
 const caption=t('',0,459,42,C.paper,700);caption.lineHeight(59);
 subtitleTextLayer.add(caption);
 yield* all(animateBeats(beats,scene.duration,links,plan.mode),subtitleTrack(scene.cues,caption,scene.duration));
}
