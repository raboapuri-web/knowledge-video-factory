import '@fontsource/noto-sans-jp/400.css';
import '@fontsource/noto-sans-jp/700.css';
import {Node, Rect, Circle, Line, Txt, type View2D} from '@motion-canvas/2d';
import {all, waitFor, type ThreadGenerator} from '@motion-canvas/core';

/** V139 original vector direction: time, dependency, coordination and effort.
 * Every visual ID is semantic: no stock photography or catch-all fallback.
 * All captions use measured VOICEVOX cue times and a last-added layer.
 */
interface Cue {text:string;speech:string;display:string;start:number;end:number}
interface Shot {id:string;chapter:string;visual:string;section:string;title:string;note:string;
 narration:string;sceneIndex:number;cues:Cue[];duration:number;durationSource:string}
type Art = {moving:Node[];signal:Node[];arrows:Line[]};
const C={bg:'#08111D',card:'#11263B',card2:'#19364B',white:'#F5F3E9',light:'#C4D3DE',
 cyan:'#62D8D1',amber:'#F2C26D',coral:'#F37F7D',blue:'#76A8E6',mint:'#9DD5AC',
 dim:'#627D90',purple:'#AF9FEB'};
const F='Noto Sans JP, Noto Sans CJK JP, sans-serif';
function R(p:Node,x:number,y:number,w:number,h:number,c:string,r=12):Rect {
 const n=new Rect({x,y,width:w,height:h,fill:c,radius:r});p.add(n);return n;
}
function O(p:Node,x:number,y:number,d:number,c:string):Circle {
 const n=new Circle({x,y,width:d,height:d,fill:c});p.add(n);return n;
}
function T(p:Node,t:string,x:number,y:number,size=36,color=C.white,weight=700):Txt {
 const n=new Txt({text:t,x,y,fontSize:size,fontFamily:F,fontWeight:weight,fill:color,textAlign:'center'});p.add(n);return n;
}
function L(p:Node,pts:[number,number][],color=C.cyan,w=5):Line {
 const n=new Line({points:pts,stroke:color,lineWidth:w,lineCap:'round',lineJoin:'round'});p.add(n);return n;
}
function A(p:Node,x1:number,y1:number,x2:number,y2:number,color=C.cyan):Line {
 const n=L(p,[[x1,y1],[x2,y2]],color,5),theta=Math.atan2(y2-y1,x2-x1);
 L(p,[[x2-19*Math.cos(theta-.55),y2-19*Math.sin(theta-.55)],[x2,y2],[x2-19*Math.cos(theta+.55),y2-19*Math.sin(theta+.55)]],color,5);
 return n;
}
function B(p:Node,label:string,x:number,y:number,w=380,h=112,col=C.cyan,size=34):Node {
 const n=new Node({x,y});p.add(n);R(n,0,0,w,h,C.card,15);R(n,0,-h/2+6,w-16,9,col,3);T(n,label,0,7,size,C.white);return n;
}
function person(p:Node,x:number,y:number,c=C.blue):Node {
 const n=new Node({x,y});p.add(n);O(n,0,-67,55,C.white);R(n,0,30,80,145,c,18);
 L(n,[[-22,82],[-31,150]],c,13);L(n,[[22,82],[31,150]],c,13);
 return n;
}
function office(p:Node):Node {
 const n=new Node({});p.add(n);
 for(let i=0;i<5;i++){const x=-670+i*335;R(n,x,78,250,360,i%2?C.card:C.card2,7);
  for(let j=0;j<3;j++){R(n,x-63,-38+j*102,48,45,C.amber,3);R(n,x+63,-38+j*102,48,45,C.blue,3)}}
 L(n,[[-850,260],[850,260]],C.dim,4);return n;
}
function miniPeople(p:Node,n:number,y:number,gap=108,c=C.blue):Node[] {
 const a:Node[]=[];for(let i=0;i<n;i++)a.push(person(p,(i-(n-1)/2)*gap,y,i%2?c:C.amber));return a;
}
function datum(p:Node,label:string,value:string,x:number,y:number,color=C.amber):Node {
 const n=new Node({x,y});p.add(n);R(n,0,0,540,210,C.card,18);
 T(n,value,0,-33,74,color);T(n,label,0,66,26,C.light,400);return n;
}
function bar(p:Node,x:number,y:number,w:number,h:number,col:string):Rect {
 return R(p,x,y-h/2,w,h,col,6);
}
function chart(p:Node,items:{label:string;value:number;color?:string}[],max=100):Node[] {
 const a:Node[]=[];const space=1430/items.length;
 items.forEach((it,i)=>{const x=-710+space*(i+.5),h=Math.max(18,350*it.value/max);
 a.push(bar(p,x,165,Math.min(170,space-24),h,it.color||C.blue));
 T(p,it.label,x,233,26,C.light);T(p,String(it.value),x,122-h,35,C.white);
 }); L(p,[[-770,170],[770,170]],C.dim,3);return a;
}
function chain(p:Node,labels:string[],cols:string[]=[C.amber,C.blue,C.cyan,C.coral]):Node[] {
 const arr:Node[]=[],gap=1480/labels.length,w=Math.min(360,gap-28);
 labels.forEach((s,i)=>{let x=-740+(i+.5)*gap;arr.push(B(p,s,x,0,w,140,cols[i%cols.length],s.length>9?24:32));
 if(i<labels.length-1)A(p,x+w/2+7,0,x+gap-w/2-7,0,C.dim);});return arr;
}
function network(p:Node,n:number):Art {
 const pts:[number,number][]=[];const arrows:Line[]=[],moving:Node[]=[];
 const rad=n<=4?155:228;
 for(let i=0;i<n;i++){let ang=i*2*Math.PI/n-Math.PI/2;pts.push([Math.cos(ang)*rad,Math.sin(ang)*rad+10]);}
 for(let i=0;i<n;i++)for(let j=i+1;j<n;j++){arrows.push(L(p,[pts[i],pts[j]],n>4?C.dim:C.cyan,n>4?2:5));}
 pts.forEach(([x,y],i)=>{moving.push(O(p,x,y,n<=4?90:66,i%2?C.blue:C.amber));T(p,String(i+1),x,y,26,C.bg)});
 return {moving,signal:[],arrows};
}
function twoColumns(p:Node,l:string,r:string,fl:string,fr:string):Node[] {
 const a=B(p,l,-415,-80,680,280,C.coral,l.length>18?29:39),b=B(p,r,415,-80,680,280,C.cyan,r.length>18?29:39);
 T(p,fl,-415,158,27,C.light);T(p,fr,415,158,27,C.light);return [a,b];
}
function wordTable(p:Node,rows:[string,string,string][]):Node[] {
 const a:Node[]=[];
 rows.forEach(([l,m,r],i)=>{const y=-198+i*112;
   a.push(B(p,l,-535,y,400,94,C.blue,30),B(p,m,0,y,400,94,C.amber,30),B(p,r,535,y,400,94,C.cyan,30));});
 return a;
}
function clock(p:Node,x:number,y:number,label:string,color=C.amber):Node {
 const n=new Node({x,y});p.add(n);O(n,0,0,226,C.card);O(n,0,0,190,C.card2);
 for(let i=0;i<12;i++){const t=i*Math.PI/6;L(n,[[Math.sin(t)*80,-Math.cos(t)*80],[Math.sin(t)*91,-Math.cos(t)*91]],C.light,3);}
 L(n,[[0,0],[0,-55]],color,7);L(n,[[0,0],[46,24]],color,6);
 T(p,label,x,y+164,27,C.light);return n;
}
function art(s:Shot,p:Node):Art {
 const v=s.visual,moving:Node[]=[],signal:Node[]=[],arrows:Line[]=[];
 const phase=s.sceneIndex%5;
 if(v==='deadline'){
  moving.push(office(p));moving.push(clock(p,380,-20,'金曜18:00',C.coral));
  moving.push(B(p,'納期まで残りわずか',-400,-140,650,150,C.coral));
 }else if(v==='team-growth'){
  miniPeople(p,3,-80,180).forEach(x=>moving.push(x));
  arrows.push(A(p,-40,210,200,210,C.amber));
  moving.push(B(p,'3人 → 8人',415,205,630,130,C.cyan,55));
 }else if(v==='progress'){
  R(p,0,-105,1240,140,C.card2,20);moving.push(R(p,-182,-105,868,118,C.amber,10));
  T(p,'進捗70％',0,-105,64,C.bg);moving.push(B(p,'残り30％',0,148,730,140,C.coral,47));
 }else if(v==='onboarding'){
  moving.push(...chain(p,['新メンバー','既存担当へ質問','説明に時間','作業が停止']));
  T(p,'追加した人が、追加の仕事を生む',0,235,40,C.amber);
 }else if(v==='meeting'){
  for(let i=0;i<8;i++){const ang=i*Math.PI/4;moving.push(person(p,Math.cos(ang)*560,Math.sin(ang)*180+20,i%2?C.blue:C.amber));}
  R(p,0,35,670,190,C.card2,90);T(p,'進捗確認会議',0,35,52,C.white);
 }else if(v==='bugs'){
  moving.push(...twoColumns(p,'仕様の変更','不具合の修正','作業を増やす','仕事が進まない'));
  arrows.push(A(p,-110,210,110,210,C.coral));
 }else if(v==='paradox'){
  moving.push(datum(p,'人員', '＋5人',-390,-20,C.cyan),datum(p,'残った仕事','未完了',390,-20,C.coral));
  T(p,'人を増やせば、必ず速くなるのか？',0,245,42,C.amber);
 }else if(v==='brooks'){
  moving.push(B(p,'ブルックスの法則',0,-143,1010,150,C.amber,55));
  moving.push(B(p,'遅れている開発への増員',-420,103,650,125,C.blue));
  moving.push(B(p,'さらに遅延',440,103,650,125,C.coral));
  arrows.push(A(p,-85,103,110,103,C.amber));
 }else if(v==='ideal-scale'){
  moving.push(...wordTable(p,[['1人','100時間','100時間'],['2人','÷2','50時間'],['4人','÷4','25時間'],['10人','÷10','10時間']]));
  T(p,'全作業が割れる、という仮定',0,281,34,C.coral);
 }else if(v==='restaurant'){
  moving.push(...chain(p,['店の設計','厨房設備','メニュー','撮影']));
  T(p,'後の工程は、前の工程を待つ',0,240,42,C.coral);
 }else if(v==='dependency'){
  moving.push(...chain(p,['決定待ち','設計','実装','テスト']));
  T(p,'依存関係',0,-224,56,C.amber);T(p,'並列化できない仕事',0,248,38,C.coral);
 }else if(v==='serial'){
  moving.push(...twoColumns(p,'並列できる工程','順番が必要な工程','同時に走る','待ちが発生'));
  T(p,'分割できない仕事は、人数では割れない',0,266,36,C.amber);
 }else if(v==='amdahl'){
  moving.push(B(p,'アムダールの法則',0,-252,760,105,C.amber,44));
  R(p,-280,-39,550,145,C.coral,0);R(p,275,-39,560,145,C.cyan,0);
  T(p,'直列 40％',-280,-39,45,C.bg);T(p,'並列 60％',275,-39,45,C.bg);
  T(p,'直列部分は人数を増やしても残る',0,240,39,C.light);
 }else if(v==='speedup'){
  moving.push(...chart(p,[{label:'1人',value:100,color:C.coral},{label:'4人',value:55,color:C.cyan},{label:'無限人',value:40,color:C.amber}],100));
  T(p,'所要時間：100％ → 55％ → 40％',0,-255,44,C.white);
 }else if(v==='pregnancy'){
  moving.push(B(p,'9人',-455,-107,540,155,C.blue,76));moving.push(B(p,'1か月',455,-107,540,155,C.coral,70));
  T(p,'妊娠の期間は人数で割れない',0,182,54,C.amber);
 }else if(v==='bottleneck'){
  moving.push(...chain(p,['10人分の仕事','1人の承認','実行','完成']));
  R(p,-240,0,370,180,C.coral,13).opacity(.30);
  T(p,'ボトルネック',0,246,47,C.coral);
 }else if(v==='timesheet'){
  moving.push(...wordTable(p,[['100人日','投入した工数','≠完成の速さ'],['200時間','忙しさの記録','≠成果']]));
  T(p,'人月という数字の落とし穴',0,245,42,C.amber);
 }else if(v==='network'){
  const g=network(p,4);moving.push(...g.moving);arrows.push(...g.arrows);
  T(p,'4人の接続：6通り',0,304,46,C.amber);
 }else if(v==='pair-count'){
  const g=network(p,8);moving.push(...g.moving);arrows.push(...g.arrows);
  T(p,'8人の接続：28通り',0,308,46,C.coral);
 }else if(v==='handoff'){
  moving.push(...chain(p,['担当A','確認B','承認C','差し戻しD']));
  T(p,'人が増えるほど受け渡しも増える',0,253,39,C.amber);
 }else if(v==='revision'){
  moving.push(...twoColumns(p,'グラフを更新','文章を更新','数値 2026','数値 2025'));
  T(p,'整合しない修正が新しい仕事に',0,248,40,C.coral);
 }else if(v==='lego'){
  for(let i=0;i<12;i++){const x=-555+(i%6)*220,y=-120+Math.floor(i/6)*146;
   moving.push(R(p,x,y,174,104,[C.cyan,C.amber,C.blue,C.coral][i%4],8));
   for(let j=0;j<3;j++)O(p,x-55+j*55,y-52,28,C.white);}
  T(p,'188個の部品 / LEGO組み立て実験',0,253,39,C.white);
 }else if(v==='labor'){
  moving.push(...chart(p,[{label:'2人チーム',value:72,color:C.cyan},{label:'4人チーム',value:112,color:C.coral}],120));
  T(p,'総労働時間：72 対 112 人・分',0,-258,45,C.white);
  T(p,'完成までの実時間は4人の方が短い',0,308,27,C.light);
 }else if(v==='estimate'){
  moving.push(...twoColumns(p,'増員のメリット','見落とす調整コスト','見えやすい','見えにくい'));
  T(p,'チーム・スケーリングの誤謬',0,265,42,C.amber);
 }else if(v==='coordination'){
  moving.push(...chain(p,['説明','確認','修正','再共有']));
  T(p,'仕事を進めるために生まれた仕事',0,250,39,C.coral);
 }else if(v==='hidden-cost'){
  moving.push(...wordTable(p,[['作業時間','目に見える','計上する'],['教育時間','見えにくい','忘れがち'],['調整時間','見えにくい','忘れがち']]));
 }else if(v==='rope'){
  L(p,[[-750,45],[720,45]],C.amber,18);
  for(let i=0;i<6;i++)moving.push(person(p,-550+i*212,-18,i%2?C.blue:C.cyan));
  T(p,'全員の力を足せば、6倍？',0,-271,49,C.white);
 }else if(v==='ringelmann'){
  moving.push(...chart(p,[{label:'理論上',value:100,color:C.cyan},{label:'8人の実測比',value:49,color:C.coral}],100));
  T(p,'49％ ※古典研究の報告値',0,-261,48,C.white);
 }else if(v==='pseudogroup'){
  moving.push(...twoColumns(p,'本人だけが引く','全員で引くと思う','実際の協力者なし','思い込みだけ'));
  T(p,'力は低下した',0,254,53,C.coral);
 }else if(v==='mask'){
  moving.push(person(p,-475,-55,C.cyan));
  moving.push(B(p,'目隠し・ヘッドホン',350,-145,710,150,C.blue,38));
  moving.push(B(p,'他人の叫び声を録音で再生',350,110,710,150,C.amber,32));
 }else if(v==='effort'){
  moving.push(...chart(p,[{label:'ひとり',value:100,color:C.blue},{label:'他に1人いる認識',value:82,color:C.amber},{label:'他に5人いる認識',value:74,color:C.coral}],100));
  T(p,'声の出力：本人だけが叫ぶ条件',0,-258,39,C.white);
 }else if(v==='accountability'){
  moving.push(...twoColumns(p,'個人の仕事','10人の仕事','自分の責任','責任が曖昧'));
  T(p,'努力と成果が結びつかない',0,264,41,C.amber);
 }else if(v==='unowned'){
  moving.push(...chain(p,['担当は誰？','確認した？','誰かがやる','未完了']));
  T(p,'全員が待つ仕事',0,248,46,C.coral);
 }else if(v==='group-work'){
  moving.push(datum(p,'社会的手抜き','Social Loafing',0,-25,C.amber));
  T(p,'怠惰と断定するのは早い',0,253,39,C.light);
 }else if(v==='disaster'){
  for(let i=0;i<9;i++){const x=-585+(i%3)*560,y=-170+Math.floor(i/3)*170;
   moving.push(R(p,x,y,490,125,i%3?C.card2:C.card,10));
   O(p,x-183,y,35,i%2?C.amber:C.coral);}
  T(p,'災害時のSNS情報',0,270,42,C.white);
 }else if(v==='map'){
  for(let i=0;i<7;i++)L(p,[[-730,-265+i*74],[710,-265+i*74]],C.dim,2);
  for(let j=0;j<8;j++)L(p,[[-720+j*195,-265],[-720+j*195,280]],C.dim,2);
  for(let i=0;i<8;i++)signal.push(O(p,-630+i*175,((i*81)%380)-145,33,i%2?C.coral:C.cyan));
  T(p,'情報を照合して地図にする',0,-305,38,C.white);
 }else if(v==='cooperation'){
  moving.push(...chain(p,['投稿の収集','位置の確認','重複の除去','情報の修正']));
  T(p,'個人の努力が減っても、総合成果は増える',0,246,39,C.mint);
 }else if(v==='meta'){
  moving.push(datum(p,'分析した効果量','208',-485,-30,C.blue));
  moving.push(datum(p,'対象チーム','21,435',485,-30,C.amber));
  T(p,'平均的な相関は、ほぼゼロ',0,262,44,C.cyan);
 }else if(v==='complexity'){
  moving.push(...twoColumns(p,'単純・調整が多い','複雑・知識が多様','増員の不利益','増員の利益'));
  T(p,'人数だけでは説明できない',0,262,43,C.amber);
 }else if(v==='envelopes'){
  for(let i=0;i<12;i++){let x=-610+(i%6)*245,y=-130+Math.floor(i/6)*180;
   moving.push(R(p,x,y,198,122,C.light,5));L(p,[[x-93,y-53],[x,y+20],[x+93,y-53]],C.dim,2);}
  T(p,'独立した封筒の作業は並列化しやすい',0,272,38,C.white);
 }else if(v==='diversity'){
  moving.push(...chain(p,['統計の分析','顧客への調査','競合の商品','新たな発見']));
  T(p,'異なる知識を持ち寄る価値',0,251,43,C.amber);
 }else if(v==='approval'){
  moving.push(...chain(p,['提案','反対','法務確認','合意待ち']));
  T(p,'全員合意が必要だと停止しやすい',0,250,40,C.coral);
 }else if(v==='queue'){
  moving.push(...chain(p,['作業完了','承認待ち','再修正','次の担当']));
  R(p,-235,0,330,164,C.coral,11).opacity(.29);
  T(p,'個人は忙しい / 成果物は待機中',0,245,40,C.white);
 }else if(v==='utilization'){
  moving.push(datum(p,'メンバー稼働率','100％',-395,-26,C.coral));
  moving.push(datum(p,'仕事の完成率','低下',395,-26,C.amber));
  T(p,'忙しさ ≠ 仕事の流れ',0,263,49,C.cyan);
 }else if(v==='gate'){
  moving.push(...chain(p,['案件','判断待ち','作業再開','納品']));
  T(p,'どこで止まっているのか？',0,260,45,C.amber);
 }else if(v==='expert'){
  moving.push(person(p,-490,-55,C.amber));
  for(let i=0;i<4;i++)moving.push(B(p,['相談A','相談B','相談C','相談D'][i],210+(i%2)*380,-170+Math.floor(i/2)*240,330,118,C.blue,32));
  T(p,'重要な判断が1人に集中',0,285,41,C.coral);
 }else if(v==='redesign'){
  moving.push(...twoColumns(p,'人を5人増やす','待ち工程を減らす','教育・調整が追加','流れの改善'));
  T(p,'増員より、仕事の構造を変える',0,269,42,C.amber);
 }else if(v==='autonomy'){
  moving.push(...chain(p,['独立した担当','現場で判断','必要な共有','完了']));
  T(p,'意思決定の権限を明確に',0,261,41,C.mint);
 }else if(v==='timing'){
  moving.push(...twoColumns(p,'初期の増員','終盤の増員','教育する余裕','教育時間がない'));
  T(p,'同じ増員でも時期が違えば結果も違う',0,264,38,C.white);
 }else if(v==='management'){
  moving.push(...chain(p,['承認を減らす','会議を見直す','権限を渡す','完了を速く']));
  T(p,'もっと人を雇う前に、仕組みを疑う',0,256,39,C.amber);
 }else if(v==='idle'){
  moving.push(office(p));moving.push(B(p,'全員が忙しい',-410,-125,620,145,C.coral,44));
  moving.push(B(p,'プロジェクトは未完了',420,155,650,145,C.amber,39));
 }else if(v==='thesis'){
  moving.push(B(p,'人数ではなく、仕事の流れ',0,-83,1380,240,C.cyan,64));
  T(p,'今夜も、当たり前がひとつ減りました。',0,219,38,C.amber);
 }else{
  throw new Error('Unplanned team-size diagram '+s.id+' '+v);
 }
 T(p,s.note,0,328,24,C.dim,400);
 return {moving,signal,arrows};
}
function* change(d:Art,s:Shot,i:number,duration:number):ThreadGenerator{
 const t=Math.max(.08,Math.min(.72,duration*.28)),motions:ThreadGenerator[]=[];
 // Each measured spoken cue changes a concept-related object, not the subtitle layer.
 if(d.moving.length){
   const n=d.moving[(s.sceneIndex*3+i)%d.moving.length];
   const variation=(s.sceneIndex+i)%5;
   if(variation===0)motions.push(n.opacity(.61+.36*(i+1)/s.cues.length,t));
   else if(variation===1)motions.push(n.scale(1.025+.045*(i+1)/s.cues.length,t));
   else if(variation===2)motions.push(n.x(n.x()+((i%2)?-13:13),t));
   else if(variation===3)motions.push(n.y(n.y()+((i%2)?-9:9),t));
   else motions.push(n.opacity(.69+.27*(i+1)/s.cues.length,t));
 }
 if(d.signal.length){
   const n=d.signal[(s.sceneIndex+i)%d.signal.length];
   motions.push(n.scale(1.04+.12*(i+1)/s.cues.length,t));
 }
 if(d.arrows.length && i%3===0)motions.push(d.arrows[(s.sceneIndex+i)%d.arrows.length].opacity(.62+.3*(i+1)/s.cues.length,t));
 if(motions.length)yield* all(...motions);else yield* waitFor(t);
 yield* waitFor(Math.max(.001,duration-t));
}
export function* playScene(view:View2D,s:Shot):ThreadGenerator{
 if(s.durationSource!=='VOICEVOX_MEASURED')throw new Error('VOICEVOX not measured: '+s.id);
 view.fill(C.bg);
 const content=new Node({}),header=new Node({}),footer=new Node({}),subtitle=new Node({});
 view.add(content);view.add(header);view.add(footer);view.add(subtitle);
 R(content,0,0,1920,1080,C.bg,0);
 R(content,0,-38,1810,800,'#0D1B2A',16);
 for(let i=0;i<7;i++)L(content,[[-865,-357+i*110],[865,-357+i*110]],'#163047',1);
 const d=art(s,content);
 R(header,0,-465,1920,145,C.bg,0);
 T(header,s.chapter==='prologue'?'PROLOGUE':s.chapter==='epilogue'?'EPILOGUE':'CHAPTER '+s.chapter.replace('chapter',''),-770,-463,20,C.amber);
 T(header,s.title,0,-460,s.title.length>19?27:s.title.length>12?34:40,C.white);
 T(header,'TEAM SIZE / 139',777,-462,18,C.dim);
 R(footer,0,450,1920,185,C.bg,0);
 L(footer,[[-940,-86],[940,-86]],C.card2,3);
 const cap=T(subtitle,'',0,445,43,C.white);cap.width(1710);cap.lineHeight(63);
 for(let i=0;i<s.cues.length;i++){
  const c=s.cues[i],dt=c.end-c.start;
  if(!(dt>0))throw new Error('Nonpositive measured cue '+s.id);
  cap.text(c.display);
  yield* change(d,s,i,dt);
 }
 cap.text('');
}
