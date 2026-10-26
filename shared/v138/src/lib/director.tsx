import '@fontsource/noto-sans-jp/400.css';
import '@fontsource/noto-sans-jp/700.css';
import {Node,Rect,Circle,Line,Txt,type View2D} from '@motion-canvas/2d';
import {all,waitFor,type ThreadGenerator} from '@motion-canvas/core';
/** V138 custom Motion Canvas dramaturgy. All art is original 2D geometry. */
interface Cue {id:string;text:string;speech:string;display:string;start:number;end:number;action:string;phase:number;focus:string}
interface Shot {id:string;chapter:string;section:string;title:string;narration:string;visual:string;focus:string;note:string;
sceneIndex:number;cues:Cue[];duration:number;durationSource:string;context:string;paletteVariant:number}
interface Drawing {family:string;nodes:Node[];orbs:Circle[];bars:Rect[];labels:Txt[]}
const P={bg:'#080C14',night:'#0D1422',panel:'#142437',panel2:'#203750',paper:'#EEECE3',
muted:'#AFC2D0',faint:'#4D6778',cyan:'#66C7DC',amber:'#E6BA65',red:'#E87172',
pink:'#D78BBF',green:'#76C5A4',ink:'#101B26',white:'#FFFFFF'};
const FONT='Noto Sans JP, Noto Sans CJK JP, sans-serif';
function rect(p:Node,x:number,y:number,w:number,h:number,c:string,r=12):Rect{
 const n=new Rect({x,y,width:w,height:h,fill:c,radius:r});p.add(n);return n;}
function circle(p:Node,x:number,y:number,d:number,c:string):Circle{
 const n=new Circle({x,y,width:d,height:d,fill:c});p.add(n);return n;}
function trace(p:Node,pts:[number,number][],c=P.amber,w=6):Line{
 const n=new Line({points:pts,stroke:c,lineWidth:w,lineCap:'round',lineJoin:'round'});p.add(n);return n;}
function txt(p:Node,t:string,x:number,y:number,z=38,c=P.paper,weight=700):Txt{
 const n=new Txt({text:t,x,y,fontSize:z,fontWeight:weight,fontFamily:FONT,fill:c,textAlign:'center'});p.add(n);return n;}
function tile(p:Node,t:string,x:number,y:number,w=420,h=120,color=P.cyan):Node{
 const g=new Node({x,y});p.add(g);rect(g,0,0,w,h,P.panel2,15);
 rect(g,0,-h/2+8,w-24,7,color,2);
 txt(g,t,0,1,t.length>13?26:t.length>9?32:38,P.paper);return g;}
function avatar(p:Node,x:number,y:number,shirt=P.cyan):Node{
 const g=new Node({x,y});p.add(g);
 circle(g,0,-72,61,P.paper);rect(g,0,51,125,176,shirt,27);
 trace(g,[[-48,-3],[-92,63]],shirt,17);trace(g,[[48,-3],[92,63]],shirt,17);
 trace(g,[[-33,117],[-40,167]],shirt,19);trace(g,[[33,117],[40,167]],shirt,19);return g;}
function arrow(p:Node,x1:number,y1:number,x2:number,y2:number,color=P.amber):void{
 trace(p,[[x1,y1],[x2,y2]],color,6);trace(p,[[x2-16,y2-15],[x2,y2],[x2-16,y2+15]],color,6);}
function phone(p:Node,x:number,y:number):Node{
 const g=new Node({x,y});p.add(g);rect(g,0,0,384,585,P.paper,38);
 rect(g,0,0,354,540,P.ink,22);rect(g,0,-262,130,13,P.faint,6);return g;}
function bars(p:Node,arr:number[],x0:number,y0:number,gap:number,color=P.cyan):Rect[]{
 return arr.map((h,i)=>rect(p,x0+i*gap,y0-h/2,Math.min(gap-22,78),h,
   i===arr.length-1?P.amber:color,8));}
function spine(p:Node,x:number,y:number,n:number):void{
 for(let i=0;i<n;i++)rect(p,x+i*115,y,89,350-((i*13)%4)*39,
 [P.red,P.cyan,P.amber,P.green,P.pink][i%5],4);}
function gridMark(p:Node,v:number):void{
 const color=[P.cyan,P.amber,P.red,P.green,P.pink][v%5];
 for(let i=0;i<5;i++){
  const a=-640+i*300;
  trace(p,[[a,-350],[a+80,-350]],color,2);
  circle(p,a+80,-350,6,color);
 }
}
function confetti(p:Node,x:number,y:number):Circle[]{
 const out:Circle[]=[];for(let j=0;j<9;j++){
 const a=j*6.28/9;out.push(circle(p,x+Math.cos(a)*195,y+Math.sin(a)*120,15,
 [P.amber,P.cyan,P.pink][j%3]));}return out;}
function titleRow(p:Node,name:string,sub:string):void{
 txt(p,name,-5,-310,45,P.paper);
 txt(p,sub,0,275,26,P.muted,400);
}
function art(s:Shot,root:Node):Drawing{
 const v=s.visual,k=s.sceneIndex,nodes:Node[]=[],orbs:Circle[]=[],b:Rect[]=[],labels:Txt[]=[];
 gridMark(root,s.paletteVariant);
 const offset=(k%3-1)*15;
if(v==='bedroom'){
rect(root,0,135,1460,160,P.panel2,14);rect(root,-500,55,510,230,P.paper,18);rect(root,-510,-60,160,70,P.cyan);
rect(root,480,-155,180,350,P.panel,9);circle(root,480,-212,75,P.amber);
nodes.push(avatar(root,-370,-60,P.green));nodes.push(phone(root,305,-65));titleRow(root,'22:18　仕事帰り','ただ時間を埋めるつもりだった');
}
else if(v==='phone'){
nodes.push(phone(root,-365,-15));b.push(rect(root,-365,-75,296,205,P.pink,12));
nodes.push(tile(root,'何気なく見た動画',360,-125,630,150,P.cyan));
nodes.push(tile(root,'視聴完了',370,92,390,100,P.amber));
}
else if(v==='feed'){
const g=phone(root,-495,-15);for(let i=0;i<4;i++)nodes.push(tile(root,
['旅行','料理','新しいアイドル','音楽'][i],-495,-175+i*120,260,86,[P.green,P.amber,P.red,P.cyan][i]));
nodes.push(tile(root,'おすすめが変わる',335,-20,620,180,P.red));
}
else if(v==='backstage'){
rect(root,0,-60,1250,385,P.panel2,15);for(let i=0;i<3;i++){rect(root,-410+i*410,-60,270,230,P.ink,8);
 nodes.push(avatar(root,-410+i*410,-120,[P.cyan,P.pink,P.green][i]));}
titleRow(root,'舞台裏の物語','挫折・練習・仲間の笑顔');
}
else if(v==='calendar'){
for(let i=0;i<4;i++)nodes.push(tile(root,['出会い','1週間','1か月','半年'][i],
-570+i*380,30,300,210,i===3?P.red:P.cyan));
trace(root,[[-600,178],[630,178]],P.amber,8);titleRow(root,'好きになるまでの時間','一本の動画が日常を変える');
}
else if(v==='ticket'){
rect(root,-350,-8,600,335,P.paper,14);for(let i=0;i<4;i++)trace(root,[[-585,-100+i*45],[-115,-100+i*45]],P.faint,5);
nodes.push(tile(root,'LIVE TICKET',-350,160,485,92,P.red));
nodes.push(avatar(root,420,-48,P.green));titleRow(root,'遠征費とチケット','気づけば旅の準備をしていた');
}
else if(v==='venue'){
rect(root,0,-157,1140,160,P.panel2,8);for(let i=0;i<9;i++){
 b.push(rect(root,-610+i*152,-190+(i%3)*16,82,70,[P.pink,P.cyan,P.amber][i%3],8));
 orbs.push(circle(root,-615+i*153,137+(i%2)*27,22,[P.cyan,P.pink][i%2]));}
nodes.push(avatar(root,0,-64,P.red));titleRow(root,'熱狂の会場','何千の光のなかで涙が落ちる');
}
else if(v==='tears'){
nodes.push(avatar(root,-320,-40,P.green));orbs.push(circle(root,-290,-107,19,P.cyan));
nodes.push(tile(root,'人生が豊かになった',345,-50,710,175,P.amber));
titleRow(root,'本物の幸福','喜びが嘘だとは言えない');
}
else if(v==='choice'){
nodes.push(tile(root,'自分で選んだ',-410,-30,650,265,P.cyan));
nodes.push(tile(root,'選ばされた',410,-30,650,265,P.red));
trace(root,[[0,-194],[0,209]],P.amber,9);titleRow(root,'一つの選択、二つの説明','どちらも成り立つのか');
}
else if(v==='laboratory'){
rect(root,0,-40,1250,400,P.panel2,14);for(let j=0;j<5;j++)orbs.push(circle(root,-530+j*260,-85,60,P.cyan));
b.push(...bars(root,[95,140,185,235,275],-510,191,250,P.red));
titleRow(root,'1968年　心理学実験','単純接触効果');
}
else if(v==='glyphs'){
for(let j=0;j<7;j++)nodes.push(tile(root,['◇','Ξ','Ж','♧','∆','◈','⊕'][j],
-605+j*200,-35,144,200,[P.cyan,P.red,P.amber,P.pink,P.green][j%5]));
titleRow(root,'見知らぬ記号','繰り返すだけで評価が変わる場合がある');
}
else if(v==='broadcast'){
rect(root,-385,-55,545,375,P.panel2,25);nodes.push(avatar(root,-385,-100,P.pink));
nodes.push(tile(root,'TV / RADIO',400,-125,515,125,P.cyan));
for(let i=0;i<4;i++)orbs.push(circle(root,180+i*142,125,55,P.amber));
}
else if(v==='algorithm'){
nodes.push(phone(root,-535,-35));orbs.push(circle(root,245,-155,130,P.red));
for(let i=0;i<5;i++){orbs.push(circle(root,20+i*145,80+(i%2)*68,78,[P.cyan,P.amber,P.green][i%3]));
 trace(root,[[245,-80],[20+i*145,55+(i%2)*68]],P.faint,4);}
titleRow(root,'推薦アルゴリズム','視聴行動から次の候補へ');
}
else if(v==='filter'){
for(let i=0;i<6;i++)nodes.push(tile(root,['料理','旅','映画','推し','推し','推し'][i],
-430+(i%3)*430,-160+Math.floor(i/3)*245,320,175,i>=3?P.red:P.cyan));
titleRow(root,'画面の面積が変わる','偶然だった出会いが日常になる');
}
else if(v==='bookshelf'){
spine(root,-610,-30,10);nodes.push(tile(root,'目立つ本',-335,184,380,90,P.red));
titleRow(root,'書店の入り口','手に取ったのは、誰が並べた一冊か');
}
else if(v==='unseen'){
for(let i=0;i<11;i++)orbs.push(circle(root,-610+i*125,-60+((i*7)%4)*55,48,i===6?P.amber:P.faint));
nodes.push(tile(root,'画面に出なかった候補',0,225,900,98,P.red));
titleRow(root,'見えない選択肢','知らなかったものは選べない');
}
else if(v==='options'){
nodes.push(tile(root,'見せられた候補',-430,-60,650,240,P.cyan));
nodes.push(tile(root,'まだ知らない候補',430,-60,650,240,P.red));
arrow(root,-90,0,80,0);
}
else if(v==='loop'){
for(let i=0;i<4;i++)nodes.push(tile(root,['見る','好きになる','また見る','さらに好き'][i],
i%2?360:-360,i<2?-135:108,605,152,[P.cyan,P.red,P.pink,P.amber][i]));
trace(root,[[0,-210],[0,190]],P.amber,6);
}
else if(v==='fork'){
trace(root,[[0,170],[0,-65],[-520,-245]],P.amber,9);trace(root,[[0,-65],[520,-245]],P.cyan,9);
nodes.push(tile(root,'選択の自由',-510,-160,530,110,P.green));
nodes.push(tile(root,'選択肢の設計',510,-160,530,110,P.red));
}
else if(v==='studio'){
rect(root,-400,-40,700,355,P.panel2,16);nodes.push(avatar(root,-400,-40,P.amber));
nodes.push(tile(root,'1956　メディア研究',385,-90,610,180,P.cyan));
titleRow(root,'画面越しの親密さ','疑似社会的相互作用');
}
else if(v==='radio'){
rect(root,-460,-35,430,355,P.panel2,24);nodes.push(avatar(root,-460,-50,P.amber));
for(let i=0;i<4;i++)orbs.push(circle(root,60+i*195,35,104,P.cyan));
titleRow(root,'一人から何万人へ','同じ言葉を自分に向けたと感じる');
}
else if(v==='portrait'){
nodes.push(avatar(root,-380,-25,P.cyan));nodes.push(tile(root,'知っていること',330,-155,655,140,P.amber));
nodes.push(tile(root,'知られていないこと',330,84,655,140,P.red));
}
else if(v==='daily'){
for(let i=0;i<4;i++)nodes.push(tile(root,['朝食','移動','練習','深夜'][i],
-550+i*366,-30,300,250,[P.green,P.cyan,P.amber,P.pink][i]));
titleRow(root,'一日の断片','毎日の投稿が親しさを作る');
}
else if(v==='livestream'){
nodes.push(phone(root,-420,-20));nodes.push(avatar(root,-420,-100,P.pink));
for(let i=0;i<4;i++)nodes.push(tile(root,['コメント','ありがとう','いいね','届いた？'][i],
280+(i%2)*235,-210+i*124,260,86,[P.red,P.green,P.cyan,P.amber][i]));
titleRow(root,'配信中の一瞬','数万人の中の私');
}
else if(v==='practice'){
nodes.push(avatar(root,-425,-25,P.green));rect(root,325,-125,645,70,P.panel2);
b.push(...bars(root,[80,140,180,260,320],80,203,118,P.cyan));
titleRow(root,'努力の過程','失敗と成長が物語になる');
}
else if(v==='story'){
for(let i=0;i<4;i++)nodes.push(tile(root,['落選','練習','再挑戦','初舞台'][i],
-545+i*365,-25,295,225,[P.red,P.cyan,P.amber,P.green][i]));
titleRow(root,'編集された人生','どの順番で知ったか');
}
else if(v==='intimacy'){
nodes.push(avatar(root,-480,-20,P.green));nodes.push(avatar(root,480,-20,P.pink));
orbs.push(circle(root,0,-30,195,P.amber));titleRow(root,'親密さという錯覚？','ただし救われる夜もある');
}
else if(v==='distance'){
nodes.push(tile(root,'ファンが知る人生',-440,-45,650,265,P.cyan));
nodes.push(tile(root,'相手が知るファン',440,-45,650,265,P.red));
trace(root,[[0,-260],[0,218]],P.amber,8);
}
else if(v==='identity'){
nodes.push(avatar(root,0,-75,P.green));for(let i=0;i<5;i++)nodes.push(tile(root,
['仕事','家族','国','趣味','ファン'][i],-590+i*290,207,235,102,[P.cyan,P.amber,P.pink,P.red,P.green][i]));
titleRow(root,'私は何者か','所属も自分の輪郭になる');
}
else if(v==='stadium'){
rect(root,0,-190,1260,140,P.panel2,8);for(let i=0;i<8;i++)orbs.push(circle(root,-590+i*170,75+(i%2)*55,56,P.cyan));
nodes.push(tile(root,'WE WON',0,-175,630,110,P.amber));
titleRow(root,'勝ったのは誰か','客席から生まれる「私たち」');
}
else if(v==='victory'){
rect(root,0,-135,1190,225,P.panel2);nodes.push(tile(root,'第1位',0,-165,430,220,P.amber));
orbs.push(...confetti(root,0,32));titleRow(root,'他人の成功が自分の喜び','私は間違っていなかった');
}
else if(v==='crowd'){
for(let i=0;i<11;i++)orbs.push(circle(root,-610+i*120,-80+(i%3)*80,34,[P.cyan,P.pink,P.amber][i%3]));
nodes.push(tile(root,'同じ色の光',0,219,600,110,P.green));
}
else if(v==='belong'){
nodes.push(avatar(root,0,-60,P.pink));for(let i=0;i<5;i++)orbs.push(circle(root,-480+i*240,135,125,P.cyan));
titleRow(root,'ここに居場所がある','見知らぬ人と同じ言葉を話す');
}
else if(v==='criticism'){
nodes.push(tile(root,'作品への批評',-390,-25,650,265,P.cyan));
nodes.push(tile(root,'自分への攻撃？',420,-25,650,265,P.red));
titleRow(root,'批判が痛みに変わる','集団は自己認識の一部だから');
}
else if(v==='argument'){
for(let i=0;i<4;i++)nodes.push(tile(root,
['批判','反論','拡散','対立'][i],-520+i*350,0,300,200,[P.cyan,P.red,P.amber,P.pink][i]));
titleRow(root,'SNS上の衝突','守っているのは誰の価値か');
}
else if(v==='ranking'){
b.push(...bars(root,[100,185,240,305,365],-520,210,260,P.pink));
nodes.push(tile(root,'応援の順位',0,-205,630,105,P.amber));
titleRow(root,'協力と競争','同じ推しでも対立する');
}
else if(v==='scorecard'){
for(let i=0;i<4;i++)nodes.push(tile(root,
['グッズ','投票','遠征','継続年数'][i],-540+i*360,-55,305,270,[P.red,P.cyan,P.amber,P.green][i]));
titleRow(root,'愛情が数字になる','気持ちには本来、点数がない');
}
else if(v==='solidarity'){
for(let i=0;i<6;i++)orbs.push(circle(root,-520+i*210,-100+(i%2)*170,100,P.cyan));
nodes.push(tile(root,'同じ名前を持つ共同体',0,219,940,110,P.amber));
}
else if(v==='church'){
rect(root,-410,-16,655,450,P.panel2);for(let i=0;i<4;i++)rect(root,-645+i*150,-12,100,300,P.paper,2);
nodes.push(tile(root,'知らせる → 集まる',435,-25,660,230,P.cyan));
titleRow(root,'CHURCH MARKETING','信仰と組織運営を分けて考える');
}
else if(v==='ritual'){
nodes.push(tile(root,'信仰の共同体',-435,-25,655,290,P.amber));
nodes.push(tile(root,'ファンダム',435,-25,655,290,P.cyan));titleRow(root,'同じではない。しかし比較できる','所属欲求という共通点');
}
else if(v==='novel'){
rect(root,-345,-20,460,450,P.paper,6);rect(root,-345,-20,419,398,P.ink,3);
txt(root,'物語の力',-345,-30,57,P.amber);
nodes.push(tile(root,'仕掛ける側',400,-135,590,112,P.red));
nodes.push(tile(root,'のめり込む側',400,42,590,112,P.cyan));
}
else if(v==='producer'){
rect(root,-505,-20,420,355,P.panel2);nodes.push(avatar(root,-505,-55,P.cyan));
for(let i=0;i<3;i++)nodes.push(tile(root,['出会い','共感','行動'][i],55+i*240,-90+i*80,225,150,[P.cyan,P.amber,P.red][i]));
}
else if(v==='funnel'){
for(let i=0;i<4;i++)nodes.push(tile(root,['認知','共感','参加','継続'][i],
-525+i*350,-130+i*75,310,145,[P.cyan,P.amber,P.pink,P.red][i]));titleRow(root,'熱狂の導線','偶然ではなく、設計することもできる');
}
else if(v==='discord'){
nodes.push(tile(root,'私は自由に選んだ',-430,-32,650,280,P.cyan));
nodes.push(tile(root,'なぜやめられない',430,-32,650,280,P.red));
titleRow(root,'認知的不協和','行動と信念の食い違い');
}
else if(v==='experiment'){
rect(root,-450,-45,470,330,P.panel2);nodes.push(avatar(root,-450,-75,P.cyan));
nodes.push(tile(root,'軽い加入条件',310,-150,680,135,P.green));
nodes.push(tile(root,'厳しい加入条件',310,71,680,135,P.red));
}
else if(v==='investment'){
nodes.push(tile(root,'時間',-475,-30,550,245,P.cyan));
nodes.push(tile(root,'お金',170,-30,500,245,P.red));
nodes.push(tile(root,'続ける理由',545,211,580,98,P.amber));
}
else if(v==='receipt'){
rect(root,-450,-35,505,385,P.paper,9);for(let i=0;i<5;i++)trace(root,[[-645,-159+i*66],[-245,-159+i*66]],P.faint,7);
nodes.push(tile(root,'特典',340,-115,580,140,P.amber));
nodes.push(tile(root,'購入の記録',340,120,580,140,P.red));
}
else if(v==='campaign'){
nodes.push(tile(root,'購入',-520,-35,390,260,P.cyan));
nodes.push(tile(root,'投票',0,-35,390,260,P.amber));
nodes.push(tile(root,'順位',520,-35,390,260,P.red));
arrow(root,-310,10,-220,10);arrow(root,320,10,360,10);
}
else if(v==='ladder'){
for(let i=0;i<5;i++)b.push(rect(root,-500+i*255,190-i*74,180,100+i*60,
 [P.cyan,P.green,P.amber,P.pink,P.red][i],10));
titleRow(root,'目標は階段になる','一つ達成すれば次が現れる');
}
else if(v==='economy'){
nodes.push(tile(root,'ファンの幸福',-430,-27,680,280,P.cyan));
nodes.push(tile(root,'企業の利益',430,-27,680,280,P.amber));
trace(root,[[-62,-140],[62,-140]],P.green,8);trace(root,[[62,110],[-62,110]],P.red,8);
}
else if(v==='boundary'){
nodes.push(tile(root,'本人の幸福',-420,-35,690,250,P.green));
nodes.push(tile(root,'過度な負担',420,-35,690,250,P.red));
trace(root,[[0,-260],[0,210]],P.amber,10);
}
else if(v==='theories'){
for(let i=0;i<4;i++)nodes.push(tile(root,
['単純接触','親密さ','所属','正当化'][i],-540+i*360,-5,315,280,[P.cyan,P.green,P.pink,P.amber][i]));
}
else if(v==='library'){
spine(root,-580,-80,10);nodes.push(tile(root,'誰が並べた？',0,218,620,108,P.red));
titleRow(root,'出会いの偶然と設計','私たちの好みは孤立して生まれない');
}
else if(v==='mirror'){
rect(root,0,-45,710,440,P.amber,12);rect(root,0,-45,674,405,P.ink,8);
nodes.push(avatar(root,0,-35,P.cyan));titleRow(root,'選び直す私','自分の言葉で答えられるか');
}
else if(v==='balance'){
trace(root,[[-575,100],[575,100]],P.amber,12);trace(root,[[0,-220],[0,100]],P.amber,10);
orbs.push(circle(root,-430,80,215,P.green),circle(root,430,80,215,P.red));
nodes.push(tile(root,'私の幸福',-435,230,455,86,P.green));
nodes.push(tile(root,'企業の目標',435,230,455,86,P.red));
}
else if(v==='exit'){
rect(root,0,-5,1300,470,P.panel2,12);rect(root,375,-10,260,435,P.ink,0);
nodes.push(avatar(root,-380,0,P.pink));nodes.push(tile(root,'離れる自由',410,194,500,97,P.green));
}
else if(v==='question'){
nodes.push(tile(root,'本当に選んだ？',-390,-28,650,265,P.cyan));
nodes.push(tile(root,'選ばされた？',410,-28,650,265,P.red));
trace(root,[[0,-250],[0,228]],P.amber,8);
}
else if(v==='ending'){
rect(root,0,-15,1390,475,P.ink,20);
txt(root,'選んだ。',-380,-45,83,P.cyan);txt(root,'選ばされた。',390,-45,83,P.red);
txt(root,'その二つは矛盾しない',0,198,46,P.amber);
}
else {throw new Error('Missing authored semantic art: '+v+' / '+s.id);}
return {family:v,nodes,orbs,bars:b,labels};
}
function* progress(d:Drawing,s:Shot,c:Cue,i:number,seconds:number):ThreadGenerator{
 const a=c.action,phase=(i+1)/Math.max(1,s.cues.length);
 const duration=Math.min(.62,Math.max(.13,seconds*.31));
 const anim:ThreadGenerator[]=[];
 const n=d.nodes.length?d.nodes[i%d.nodes.length]:null;
 const alt=d.nodes.length>1?d.nodes[(i+1)%d.nodes.length]:null;
 const orb=d.orbs.length?d.orbs[i%d.orbs.length]:null;
 const bar=d.bars.length?d.bars[i%d.bars.length]:null;
 // Semantic actions are generated separately for each spoken line.
 // Displacement, grouping and data-state changes alternate; no global fade/slide template.
 if(a==='reach'&&n){anim.push(n.x(n.x()+((i%2)?-42:42),duration));}
 else if(a==='swap'&&n&&alt){
  const x=n.x();const x2=alt.x();anim.push(n.x(x+(x2-x)*.18,duration),alt.x(x2+(x-x2)*.18,duration));
 }else if(a==='reveal'&&n){anim.push(n.opacity(.72+.26*phase,duration));}
 else if(a==='trace'&&bar){anim.push(bar.height(Math.min(430,bar.height()+15+12*phase),duration));}
 else if(a==='count'&&orb){anim.push(orb.scale(1.05+.14*phase,duration));}
 else if(a==='split'&&n){anim.push(n.x(n.x()+(i%2===0?-33:33),duration));}
 else if(a==='rotate'&&n){anim.push(n.rotation(n.rotation()+((i%2)?-3.5:3.5),duration));}
 else if(a==='sort'&&n){anim.push(n.y(n.y()+(i%2===0?-22:22),duration));}
 else if(a==='pulse'&&orb){anim.push(orb.opacity(.48+.48*phase,duration));}
 else if(a==='fold'&&bar){anim.push(bar.width(Math.max(17,bar.width()-4),duration));}
 else if(a==='route'&&n){anim.push(n.x(n.x()+((i%3)-1)*40,duration));}
 else if(a==='assemble'&&n){anim.push(n.scale(1+.025*phase,duration));}
 else if(n){anim.push(n.y(n.y()+((i%2)?-15:15),duration));}
 else if(orb){anim.push(orb.scale(1+.07*phase,duration));}
 else if(bar){anim.push(bar.opacity(.72+.24*phase,duration));}
 if(anim.length)yield* all(...anim);else yield* waitFor(duration);
 yield* waitFor(Math.max(.001,seconds-duration));
}
export function* playScene(view:View2D,s:Shot):ThreadGenerator{
 if(s.durationSource!=='VOICEVOX_MEASURED')throw new Error('VOICEVOX_MEASURED required: '+s.id);
 const content=new Node({}),header=new Node({}),subBase=new Node({}),subtitle=new Node({});
 view.fill(P.bg);view.add(content);view.add(header);view.add(subBase);view.add(subtitle);
 rect(content,0,0,1920,1080,P.bg,0);rect(content,0,-42,1870,820,P.night,10);
 // Every meaning scene starts from the preceding paragraph's semantic state, not a generic photo.
 const layer=new Node({x:(s.sceneIndex%3-1)*9});content.add(layer);
 const d=art(s,layer);
 txt(content,s.note,0,329,26,P.muted,400);
 trace(header,[[-890,-409],[890,-409]],P.faint,2);
 rect(header,0,-470,1920,122,P.bg,0);
 txt(header,s.chapter==='prologue'?'PROLOGUE':s.chapter==='epilogue'?'EPILOGUE':
   'CHAPTER '+s.chapter.replace('chapter',''),-757,-468,23,P.amber);
 txt(header,s.section,0,-468,38,P.paper);
 txt(header,'CHURCH MARKETING',763,-468,19,P.muted,400);
 rect(subBase,0,450,1920,185,P.bg,0).opacity(.99);
 trace(subBase,[[-884,355],[884,355]],P.faint,2);
 const sub=txt(subtitle,'',0,450,43,P.paper,700);
 sub.width(1710);sub.lineHeight(63);
 for(let i=0;i<s.cues.length;i++){
  const c=s.cues[i],dt=c.end-c.start;
  if(!(dt>0)||c.display.includes('\\n'))throw new Error('Cue invalid '+c.id);
  sub.text(c.display);
  yield* progress(d,s,c,i,dt);
 }
 sub.text('');
}
