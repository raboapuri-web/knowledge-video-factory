import '@fontsource/noto-sans-jp/400.css';
import '@fontsource/noto-sans-jp/700.css';
import {Circle, Line, Node, Rect, Txt, type View2D} from '@motion-canvas/2d';
import {all, waitFor, type ThreadGenerator} from '@motion-canvas/core';
import visualPlan from '../../content/visual_plan.json';

type Cue={text:string;display:string;start:number;end:number};
type Scene={id:string;chapter:string;motif:string;title:string;narration:string;cues:Cue[];duration:number};
type Plan={kind:string;motion:string;labels:string[]};
export const MICRO_BEATS_PER_SCENE=20;

const K={
 bg:'#071018',deep:'#0D1B24',navy:'#132A36',slate:'#29434F',paper:'#F1EBDD',muted:'#9CAEB5',
 red:'#D45752',gold:'#D5AE68',cyan:'#6DB8BD',teal:'#6E9B8D',blue:'#6C88A5',green:'#738D72',
 brown:'#765F4B',sand:'#A99069',ice:'#A8C7CF',ink:'#17252E',soil:'#4E4036',orange:'#BD7C4D',
 white:'#F7F4EC',black:'#04090D',sea:'#173C4D',sky:'#496C7A',gray:'#65747A'
};
const F='Noto Sans JP, Noto Sans CJK JP, sans-serif';
const hash=(s:string)=>[...s].reduce((a,c)=>((a*33)^c.charCodeAt(0))>>>0,124);
const tx=(s:string,x:number,y:number,sz=30,col=K.paper,w=700)=>new Txt({text:s,x,y,fontFamily:F,fontSize:sz,fill:col,fontWeight:w});
function rr(p:Node,x:number,y:number,w:number,h:number,fill:string,r=10,stroke?:string){const q=new Rect({x,y,width:w,height:h,fill,radius:r,stroke:stroke??fill,lineWidth:stroke?2:0});p.add(q);return q}
function cc(p:Node,x:number,y:number,r:number,fill:string){const q=new Circle({x,y,width:r*2,height:r*2,fill});p.add(q);return q}
function ln(p:Node,pts:[number,number][],col=K.muted,w=5){const q=new Line({points:pts,stroke:col,lineWidth:w,lineCap:'round',lineJoin:'round'});p.add(q);return q}
function label(p:Node,s:string,x:number,y:number,col=K.paper,sz=25,w=700){const q=tx(s,x,y,sz,col,w);p.add(q);return q}
function card(p:Node,s:string,x:number,y:number,w=260,col=K.cyan){rr(p,x,y,w,68,K.deep,12,col);label(p,s,x,y,col,23)}
function paper(p:Node,x:number,y:number,w=320,h=410,title=''){rr(p,x,y,w,h,'#EAE4D8',8,'#899497');if(title)label(p,title,x,y-h*.38,K.ink,24);for(let i=0;i<5;i++)ln(p,[[x-w*.34,y-h*.14+i*48],[x+w*(i===4?.12:.34),y-h*.14+i*48]],'#90989A',4)}
function person(p:Node,x:number,y:number,s=.7,col=K.paper){const g=new Node({x,y,scale:s});p.add(g);cc(g,0,-58,24,col);rr(g,0,24,62,118,col,18);ln(g,[[-20,-4],[-58,56]],col,11);ln(g,[[20,-4],[58,56]],col,11);ln(g,[[-18,78],[-25,150]],col,13);ln(g,[[18,78],[25,150]],col,13);return g}
function desk(p:Node,x:number,y:number,w=520){rr(p,x,y,w,28,K.brown,4);ln(p,[[x-w*.4,y+12],[x-w*.4,y+110]],K.paper,7);ln(p,[[x+w*.4,y+12],[x+w*.4,y+110]],K.paper,7)}
function ballot(p:Node,x:number,y:number,labelText='投票箱'){rr(p,x,y,330,260,'#334A54',18,K.paper);rr(p,x,y-78,190,18,K.black,5);label(p,labelText,x,y+35,K.paper,27)}
function monitor(p:Node,x:number,y:number,w=430,h=240){rr(p,x,y,w,h,'#1B303A',12,K.muted);rr(p,x,y,w-34,h-34,K.black,8);ln(p,[[x,y+h/2],[x,y+h/2+70]],K.muted,9);ln(p,[[x-90,y+h/2+72],[x+90,y+h/2+72]],K.muted,9)}
function building(p:Node,x:number,y:number,w=360,h=420,title=''){rr(p,x,y,w,h,'#263D47',8,K.muted);for(let r=0;r<4;r++)for(let c=0;c<3;c++)rr(p,x-95+c*95,y-110+r*80,48,46,'#5F7A86',4);if(title)label(p,title,x,y-h*.58,K.paper,25)}
function crowd(p:Node,x:number,y:number,n=9,col=K.paper){for(let i=0;i<n;i++){const xx=x+(i-(n-1)/2)*82;cc(p,xx,y-35-(i%2)*12,16,col);rr(p,xx,y+8,34,62,col,12)}}
function bar(p:Node,x:number,y:number,w:number,v:number,col:string,txtLabel?:string){rr(p,x,y,w,32,'#243842',6);rr(p,x-w*(1-v)/2,y,Math.max(8,w*v),32,col,6);if(txtLabel)label(p,txtLabel,x,y-44,col,22)}
function timeline(p:Node,y:number,items:{x:number;year:string;col:string}[]){ln(p,[[items[0].x,y],[items[items.length-1].x,y]],K.muted,7);for(const it of items){cc(p,it.x,y,15,it.col);label(p,it.year,it.x,y+50,it.col,22)}}
function islandChain(p:Node,x=0,y=0,s=1){const pts=[[-420,40,74],[-300,-40,48],[-160,10,58],[-20,-30,82],[135,15,68],[285,-35,45],[410,20,38]];for(const [dx,dy,r] of pts)cc(p,x+dx*s,y+dy*s,r*s,K.green)}
function airstrip(p:Node,x:number,y:number,w=560){rr(p,x,y,w,115,'#3A4850',4,K.paper);for(let i=-2;i<=2;i++)rr(p,x+i*90,y,42,8,K.paper,2)}
function gavel(p:Node,x:number,y:number,s=.8){rr(p,x,y,150*s,55*s,K.brown,10);rr(p,x+100*s,y+70*s,45*s,190*s,K.brown,10);rr(p,x-20*s,y+120*s,260*s,34*s,K.sand,5)}
function stamp(p:Node,x:number,y:number,txtLabel='承認',col=K.red){rr(p,x,y,220,95,'#00000000',10,col);label(p,txtLabel,x,y,col,31)}
function receipt(p:Node,x:number,y:number){paper(p,x,y,270,440,'RECEIPT');['食料','光熱','家賃','合計'].forEach((s,i)=>label(p,s,x-55,y-90+i*70,K.ink,21));['↑','↑','→','↑↑'].forEach((s,i)=>label(p,s,x+75,y-90+i*70,i===3?K.red:K.ink,24))}
function mapFrame(p:Node,title=''){rr(p,0,0,1500,720,'#102530',14,K.muted);if(title)label(p,title,0,-318,K.paper,29);islandChain(p,0,40,1.25)}
function axes(p:Node){ln(p,[[-600,260],[-600,-260]],K.paper,5);ln(p,[[-600,260],[650,260]],K.paper,5)}
function ratioRing(p:Node,x:number,y:number,a:string,b:string){cc(p,x,y,150,K.deep);cc(p,x,y,126,K.cyan);cc(p,x,y,82,K.deep);label(p,a,x,y-12,K.paper,30);label(p,b,x,y+34,K.gold,24)}
function worldBase(root:Node,scene:Scene){const palettes=['#071018','#0B1721','#101A24','#101E27','#111A20','#08151C'];rr(root,0,0,1920,1080,palettes[hash(scene.motif)%palettes.length],0);const h=hash(scene.motif);for(let i=0;i<13;i++){cc(root,-850+((h>>(i%12))%1700),-350+((h>>(i%9+2))%600),1.5+(i%3),i%2?K.gold:K.cyan)}rr(root,0,344,1920,3,'#233A45',0)}
function stages8(){return Array.from({length:8},()=>new Node({opacity:0}))}

function buildScene(root:Node,scene:Scene,plan:Plan):Node[]{
 worldBase(root,scene);const s=stages8();s.forEach(n=>root.add(n));const[a,b,c,d,e,f,g,h]=s;
 switch(scene.motif){
  case'election_night_2026':
   rr(a,0,0,1920,920,'#141F28',0);building(a,-560,40,520,510,'那覇・選挙事務所');monitor(b,430,-40,620,330);label(b,'当選確実',430,-60,K.red,48);crowd(c,-520,210,8,K.paper);paper(d,420,205,430,220,'古謝玄太');for(let i=0;i<7;i++)cc(d,270+i*50,235,18,i===6?K.red:K.gold);label(e,'2026.09.13',0,-300,K.gold,32);card(f,'現職を破り初当選',430,250,380,K.cyan);label(g,'県政交代',-400,-230,K.paper,38);label(h,'辺野古容認候補が勝利',0,320,K.red,40);break;
  case'headline_acceptance':
   monitor(a,0,0,1180,560);label(b,'沖縄「辺野古容認」へ？',0,-120,K.paper,52);card(c,'12年ぶり県政交代',0,10,430,K.red);rr(d,0,105,1050,6,K.muted,0);label(e,'見出しは分かりやすい',-280,190,K.cyan,28);label(f,'文脈は削られる',300,190,K.gold,28);label(g,'本当に「受け入れた」のか',0,275,K.paper,37);label(h,'？',640,-205,K.red,94);break;
  case'rewind_2019':
   rr(a,0,0,1920,920,'#0E2029',0);timeline(b,0,[{x:-620,year:'2026',col:K.red},{x:-200,year:'2023',col:K.gold},{x:220,year:'2019',col:K.cyan},{x:620,year:'1996',col:K.muted}]);label(c,'REWIND',0,-210,K.gold,42);rr(d,220,0,36,36,K.cyan,18);ballot(e,220,110,'県民投票');label(f,'2019.02.24',220,-170,K.paper,31);card(g,'賛成 / 反対 / どちらでもない',-300,240,580,K.cyan);label(h,'一問だけを尋ねた',0,320,K.gold,38);break;
  case'referendum_numbers':
   rr(a,0,0,1920,920,'#142630',0);label(b,'県民投票 2019',0,-280,K.paper,36);bar(c,0,-120,1050,.717,K.red,'反対 71.7%');bar(d,0,20,1050,.19,K.cyan,'賛成 19.0%');bar(e,0,160,1050,.087,K.muted,'どちらでもない 8.7%');label(f,'434,273票',420,-120,K.white,27);label(g,'単一争点では反対が多数',0,280,K.gold,34);label(h,'数字は明確だった',0,-340,K.red,38);break;
  case'contradiction_wall':
   rr(a,0,0,1920,920,'#1A2228',0);paper(b,-420,0,500,580,'2019');label(b,'反対 71.7%',-420,20,K.red,42);paper(c,420,0,500,580,'2026');label(c,'古謝氏 当選',420,20,K.cyan,40);ln(d,[[-120,0],[120,0]],K.gold,8);label(e,'矛盾？',0,-110,K.gold,42);label(f,'7年で反転？',0,95,K.paper,34);label(g,'同じものを測ったのか',0,260,K.muted,31);label(h,'ここからが本題',0,-310,K.red,39);break;
  case'thesis_public_opinion':
   rr(a,0,0,1920,920,'#090F15',0);label(b,'民意',0,-170,K.white,86);['賛否','重要度','選挙','制度'].forEach((x,i)=>card(c,x,-510+i*340,30,260,[K.red,K.gold,K.cyan,K.teal][i]));label(d,'誰の意思？',-300,165,K.paper,32);label(e,'何を測る？',300,165,K.paper,32);label(f,'どの範囲？',-300,260,K.muted,28);label(g,'どの時点？',300,260,K.muted,28);label(h,'民主主義の測定問題',0,-300,K.gold,42);break;
  case'map_to_question':
   mapFrame(a,'辺野古から日本全体へ');card(b,'基地',-520,235,230,K.red);card(c,'地方自治',-180,235,260,K.cyan);card(d,'安全保障',180,235,260,K.gold);card(e,'選挙',520,235,230,K.teal);rr(f,0,20,980,260,'#0B1820',130,K.muted);label(f,'同じ地図に重なる',0,20,K.paper,34);label(g,'沖縄だけの問題ではない',0,-245,K.gold,35);label(h,'日本の民主主義を見る',0,310,K.white,41);break;

  case'two_ballot_boxes':
   rr(a,0,0,1920,920,'#13242D',0);ballot(b,-430,40,'2019 県民投票');ballot(c,430,40,'2026 知事選');label(d,'似た箱',0,-210,K.paper,34);ln(e,[[-130,40],[130,40]],K.gold,7);label(f,'違う問い',0,40,K.gold,39);card(g,'政策への賛否',-430,260,300,K.red);card(h,'誰に県政を任せるか',430,260,360,K.cyan);break;
  case'single_issue_ballot':
   ballot(a,0,60,'辺野古埋め立て');card(b,'賛成',-420,-140,260,K.cyan);card(c,'反対',0,-140,260,K.red);card(d,'どちらでもない',420,-140,320,K.muted);['観光','子育て','所得','候補者'].forEach((x,i)=>{card(e,x,-510+i*340,245,230,K.gray)});rr(f,0,245,1450,100,K.black,18);label(g,'他の政策をいったん外す',0,245,K.paper,31);label(h,'単一争点を直接測る',0,-290,K.gold,39);break;
  case'governor_ballot_bundle':
   rr(a,0,0,1920,920,'#10242D',0);['基地','物価','賃金','観光','教育','交通','子育て','実績'].forEach((x,i)=>card(b,x,-570+(i%4)*380,-150+Math.floor(i/4)*120,250,[K.red,K.gold,K.cyan,K.teal][i%4]));ln(c,[[-580,100],[0,210],[580,100]],K.muted,8);paper(d,0,210,420,180,'投票用紙');label(e,'候補者名',0,225,K.ink,34);label(f,'8つの判断',-380,300,K.paper,27);label(g,'→ 1つの名前',380,300,K.gold,29);label(h,'政策の詰め合わせ',0,-300,K.red,39);break;
  case'supermarket_voter':
   rr(a,0,0,1920,920,'#28343A',0);for(let i=0;i<4;i++){rr(a,-590+i*390,80,290,420,'#394A50',6);for(let j=0;j<4;j++)rr(a,-590+i*390,-40+j*90,210,46,'#6A7778',4)}receipt(b,560,10);person(c,-430,100,.65,K.paper);card(d,'辺野古は反対',-430,-150,330,K.red);card(e,'物価が苦しい',-430,-40,330,K.gold);label(f,'どちらを今回重く見る？',-250,250,K.paper,31);bar(g,360,250,520,.78,K.red,'家計負担');label(h,'賛否だけでは票は読めない',0,-300,K.gold,38);break;
  case'issue_salience':
   rr(a,0,0,1920,920,'#12212A',0);ln(b,[[-600,0],[600,0]],K.paper,8);cc(c,-420,0,90,K.red);cc(c,260,0,54,K.cyan);label(c,'基地',-420,0,K.black,25);label(c,'物価',260,0,K.black,22);label(d,'大きさ = 重要度',0,150,K.paper,30);label(e,'同じ「反対」でも',0,-185,K.muted,29);bar(f,-250,245,430,.82,K.red,'重要度 高');bar(g,320,245,430,.34,K.cyan,'重要度 低');label(h,'イシュー・サリエンス',0,-305,K.gold,40);break;
  case'retrospective_vote':
   rr(a,0,0,1920,920,'#18252B',0);paper(b,-400,0,480,560,'県政 成績表');['生活','景気','実績','期待'].forEach((x,i)=>{label(b,x,-470,-110+i*90,K.ink,24);label(b,['B','C','B','?'][i],-300,-110+i*90,i===1?K.red:K.ink,27)});building(c,430,20,430,500,'県庁');label(d,'過去を採点',430,-230,K.gold,31);card(e,'回顧投票',430,180,300,K.cyan);card(f,'経済投票',430,270,300,K.red);label(g,'選挙は公約だけではない',0,-300,K.paper,34);label(h,'次の任期を任せるか',0,320,K.gold,38);break;
  case'first_answer':
   rr(a,0,0,1920,920,'#101C24',0);card(b,'容認候補が当選',-410,-70,360,K.cyan);label(c,'≠',0,-70,K.red,74);card(d,'県民全体が賛成',410,-70,380,K.red);card(e,'2019反対多数',-410,120,360,K.red);label(f,'≠',0,120,K.gold,74);card(g,'永久に固定',410,120,340,K.muted);label(h,'まず二つを分ける',0,-300,K.paper,40);break;

  case'okinawa_1945':
   rr(a,0,0,1920,920,'#2A2623',0);islandChain(b,0,10,1.35);label(c,'1945',-650,-260,K.red,52);for(let i=0;i<7;i++)rr(d,-600+i*200,170-(i%2)*60,150,90,'#3D4547',4);card(e,'沖縄戦後',-420,270,280,K.paper);card(f,'米軍統治',0,270,280,K.red);card(g,'基地化',420,270,280,K.gold);label(h,'本土とは異なる戦後',0,-320,K.paper,40);break;
  case'us_admin_land':
   rr(a,0,0,1920,920,'#293138',0);for(let i=0;i<5;i++)building(a,-650+i*330,80,230,320);airstrip(b,0,-170,780);card(c,'住宅',-570,270,250,K.paper);card(d,'騒音',-190,270,250,K.red);card(e,'事故不安',190,270,250,K.gold);card(f,'土地',570,270,250,K.cyan);label(g,'生活空間と軍事施設が隣接',0,-290,K.paper,34);label(h,'基地問題が日常へ入る',0,320,K.gold,39);break;
  case'reversion_1972':
   rr(a,0,0,1920,920,'#19303A',0);label(b,'1972',-650,-270,K.gold,52);building(c,-420,60,420,470,'復帰式典');airstrip(d,430,70,620);card(e,'行政制度 → 日本へ',-420,280,330,K.cyan);card(f,'基地 → 残る',430,280,300,K.red);ln(g,[[-60,-210],[-60,260]],K.paper,6);label(h,'復帰と負担軽減は同義ではない',0,-315,K.paper,37);break;
  case'burden_map':
   mapFrame(a,'基地負担の地理');ratioRing(b,-430,20,'0.6%','国土面積');ratioRing(c,430,20,'約70%','専用施設');ln(d,[[-210,20],[210,20]],K.gold,8);label(e,'沖縄',0,150,K.paper,32);label(f,'全国安全保障',-420,260,K.cyan,27);label(g,'地域負担',420,260,K.red,27);label(h,'利益と負担の場所が違う',0,-300,K.gold,39);break;
  case'incident_1995':
   rr(a,0,0,1920,920,'#17191C',0);label(b,'1995',-690,-270,K.red,54);crowd(c,0,70,13,K.paper);for(let i=0;i<9;i++)rr(d,-640+i*160,-100-(i%2)*40,130,58,'#EAE4D8',4);label(d,'抗議',0,-115,K.ink,31);card(e,'基地負担',-350,245,300,K.red);card(f,'怒りが可視化',0,245,320,K.gold);card(g,'整理縮小',350,245,300,K.cyan);label(h,'政治課題が再燃する',0,-310,K.paper,39);break;
  case'saco_1996':
   rr(a,0,0,1920,920,'#15242B',0);paper(b,-400,0,520,600,'SACO 1996');airstrip(c,430,-70,590);card(d,'普天間返還',430,85,320,K.cyan);card(e,'代替施設が条件',430,185,350,K.red);label(f,'5〜7年',-400,100,K.gold,37);label(g,'機能を別の場所へ',0,285,K.paper,31);label(h,'返還は「移転」とセット',0,-310,K.gold,39);break;
  case'henoko_paradox':
   rr(a,0,0,1920,920,'#112732',0);airstrip(b,-430,20,560);label(b,'普天間',-430,-110,K.paper,31);islandChain(c,430,40,.58);label(c,'辺野古',430,-110,K.paper,31);card(d,'返還',-430,220,280,K.cyan);card(e,'建設',430,220,280,K.red);ln(f,[[-150,20],[150,20]],K.gold,11);label(g,'同じ政策',0,95,K.gold,30);label(h,'立つ場所で意味が反転する',0,-300,K.paper,39);break;

  case'nago_referendum_1997':
   rr(a,0,0,1920,920,'#14262E',0);ballot(b,-360,40,'名護市民投票');label(c,'1997.12',420,-220,K.gold,40);bar(d,370,-40,620,.55,K.red,'反対側 過半');card(e,'海上ヘリ基地',370,75,320,K.cyan);card(f,'条件付き反対を含む',370,180,380,K.red);label(g,'直接投票',-360,265,K.paper,28);label(h,'2019より前に同じ構図',0,-305,K.gold,39);break;
  case'mayor_after_referendum':
   rr(a,0,0,1920,920,'#182831',0);ballot(b,-520,10,'市民投票');building(c,500,30,420,470,'名護市役所');ln(d,[[-230,10],[230,10]],K.gold,8);card(e,'受入表明 → 辞職',0,-90,360,K.red);card(f,'市長選',0,80,280,K.cyan);card(g,'別の結果',0,190,300,K.gold);label(h,'住民投票と代表選挙のねじれ',0,-310,K.paper,37);break;
  case'relocation_1999':
   mapFrame(a,'1999 辺野古沿岸へ');cc(b,210,30,48,K.red);card(c,'知事が移設先発表',-420,220,360,K.cyan);card(d,'市長 条件付き受入',0,220,360,K.gold);card(e,'政府 閣議決定',420,220,340,K.red);ln(f,[[-420,130],[0,70],[210,30]],K.cyan,5);ln(g,[[420,130],[210,30]],K.red,5);label(h,'長期対立の中心へ',0,-305,K.paper,39);break;
  case'nested_publics':
   rr(a,0,0,1920,920,'#0F2028',0);for(const [r,col] of [[330,K.gray],[270,K.blue],[210,K.cyan],[150,K.gold],[90,K.red]] as [number,string][])cc(b,0,20,r,col);cc(c,0,20,55,K.deep);['日米安保','日本','沖縄県','名護市','辺野古'].forEach((x,i)=>label(d,x,520,-180+i*90,[K.gray,K.blue,K.cyan,K.gold,K.red][i],25));label(e,'どの円を主語にする？',0,-300,K.paper,36);label(f,'多数派',-480,270,K.cyan,30);label(g,'範囲で変わる',0,270,K.gold,30);label(h,'「民意」の主語問題',480,270,K.red,31);break;
  case'externality_security':
   rr(a,0,0,1920,920,'#102A35',0);islandChain(b,-340,10,.78);for(let i=0;i<8;i++)cc(c,240+(i%4)*130,-100+Math.floor(i/4)*150,22,K.cyan);card(d,'抑止・防衛',430,-230,320,K.cyan);card(e,'騒音・土地・事故不安',-340,235,400,K.red);ln(f,[[-80,40],[190,-20]],K.gold,8);label(g,'利益は広く',430,230,K.paper,28);label(h,'負担は局地へ集中',0,-300,K.gold,40);break;
  case'nimby_parallel':
   rr(a,0,0,1920,920,'#18252C',0);['原発','処分場','ダム','空港','刑務所','基地'].forEach((x,i)=>{const xx=-560+(i%3)*560,yy=-110+Math.floor(i/3)*210;rr(b,xx,yy,350,145,'#293E47',10,[K.gold,K.red,K.cyan,K.blue,K.teal,K.red][i]);label(b,x,xx,yy,K.paper,28)});label(c,'社会全体では必要？',-360,250,K.paper,28);label(d,'自宅の近くでは？',360,250,K.gold,28);label(e,'全国利益',-500,-280,K.cyan,27);label(f,'近隣負担',500,-280,K.red,27);label(g,'配置の政治',0,310,K.paper,32);label(h,'辺野古だけの構造ではない',0,-335,K.gold,38);break;
  case'two_majorities':
   rr(a,0,0,1920,920,'#101E27',0);cc(b,-380,20,210,K.cyan);cc(c,380,20,210,K.red);label(b,'全国多数',-380,20,K.black,31);label(c,'地域多数',380,20,K.black,31);ln(d,[[-150,20],[150,20]],K.gold,12);label(e,'安全保障を支持',-380,265,K.paper,25);label(f,'負担には反対',380,265,K.paper,25);label(g,'どちらも多数',0,-225,K.gold,35);label(h,'多数決だけでは範囲を決められない',0,-315,K.paper,36);break;

  case'nakaima_approval_2013':
   rr(a,0,0,1920,920,'#263038',0);desk(b,0,190,760);paper(c,0,-20,560,480,'埋立承認 2013');stamp(d,0,40,'承認',K.red);building(e,-610,30,330,430,'沖縄県庁');card(f,'行政上の扉',480,160,300,K.cyan);label(g,'一枚の決裁',480,250,K.paper,28);label(h,'翌年、政治が反転する',0,-310,K.gold,39);break;
  case'onaga_2014':
   rr(a,0,0,1920,920,'#17252C',0);building(b,0,40,520,520,'沖縄県庁');paper(c,-420,-10,280,360,'旧方針');paper(d,420,-10,280,360,'新方針');stamp(c,-420,45,'承認',K.muted);stamp(d,420,45,'反対',K.red);person(e,0,125,.55,K.paper);label(f,'2014 知事選',0,-245,K.gold,34);ln(g,[[-180,0],[180,0]],K.cyan,8);label(h,'知事交代で県の方向も変わる',0,315,K.paper,37);break;
  case'cancel_lawsuit':
   rr(a,0,0,1920,920,'#121B21',0);building(b,-560,20,360,430,'県庁');building(c,0,20,360,430,'霞が関');building(d,560,20,360,430,'裁判所');ln(e,[[-380,20],[-180,20]],K.red,7);ln(e,[[180,20],[380,20]],K.gold,7);gavel(f,560,160,.55);card(g,'取消 / 是正 / 訴訟',0,270,420,K.cyan);label(h,'工事現場が制度闘争へ',0,-310,K.paper,39);break;
  case'tamaki_2018':
   rr(a,0,0,1920,920,'#18313A',0);label(b,'2018',-660,-260,K.gold,50);crowd(c,0,100,9,K.paper);paper(d,-360,-20,300,380,'翁長県政');paper(e,360,-20,300,380,'玉城県政');ln(f,[[-140,0],[140,0]],K.cyan,8);card(g,'辺野古反対を継承',0,265,360,K.red);label(h,'争点は県政の中心に残る',0,-310,K.paper,38);break;
  case'referendum_2019_again':
   rr(a,0,0,1920,920,'#142630',0);ballot(b,-420,50,'県民投票');bar(c,380,-80,650,.717,K.red,'反対 71.7%');card(d,'単一争点',380,55,300,K.cyan);card(e,'直接請求',380,155,300,K.gold);label(f,'象徴性',-420,255,K.paper,29);label(g,'政策への直接回答',380,265,K.paper,28);label(h,'後の議論で強い基準になる',0,-310,K.gold,38);break;
  case'soft_seabed_2020':
   rr(a,0,-150,1920,580,K.sea,0);rr(a,0,225,1920,370,K.soil,0);airstrip(b,-280,-120,720);for(let i=0;i<8;i++)cc(c,-550+i*150,250+(i%2)*30,28,K.sand);ln(d,[[-520,-10],[-420,240]],K.gold,7);ln(d,[[-300,-10],[-240,250]],K.gold,7);card(e,'軟弱地盤',360,130,300,K.red);card(f,'2020 設計変更申請',360,230,360,K.cyan);card(g,'2021 不承認',360,-30,300,K.red);label(h,'技術問題が権限争いへ',0,-300,K.paper,39);break;
  case'supreme_substitution_2023':
   rr(a,0,0,1920,920,'#111D25',0);paper(b,-520,0,360,500,'設計変更');stamp(c,-520,40,'不承認',K.red);building(d,0,0,360,430,'裁判所');gavel(e,0,135,.48);paper(f,520,0,360,500,'代執行');stamp(g,520,40,'国が承認',K.gold);ln(g,[[-300,-40],[-160,-40]],K.muted,6);label(h,'知事の代わりに国が承認',0,-310,K.paper,40);break;

  case'campaign_2026':
   rr(a,0,0,1920,920,'#243039',0);for(let i=0;i<6;i++){paper(a,-680+i*270,-40,210,300,['候補A','候補B','候補C','候補D','候補E','候補F'][i]);}crowd(b,0,235,12,K.paper);['基地','物価','所得','子育て'].forEach((x,i)=>card(c,x,-510+i*340,110,250,[K.red,K.gold,K.cyan,K.teal][i]));label(d,'2026 知事選',0,-300,K.paper,40);label(e,'複数争点',-360,305,K.cyan,28);label(f,'複数候補',0,305,K.gold,28);label(g,'一票',360,305,K.red,28);label(h,'単一争点投票ではない',0,-345,K.gold,37);break;
  case'economy_front':
   rr(a,0,0,1920,920,'#2A3337',0);receipt(b,-450,0);building(c,430,20,420,460,'県内企業');bar(d,430,-70,520,.82,K.red,'物価');bar(e,430,45,520,.48,K.cyan,'所得');card(f,'家計',430,170,250,K.gold);card(g,'企業活動',430,265,280,K.teal);label(h,'経済政策が前面へ',0,-310,K.paper,41);break;
  case'kojar_position':
   rr(a,0,0,1920,920,'#142631',0);paper(b,-430,10,540,600,'古謝氏');card(c,'辺野古移設 容認',-430,-60,370,K.red);card(d,'返還時期の明確化',-430,60,370,K.gold);['所得','新産業','子育て'].forEach((x,i)=>card(e,x,360,-120+i*120,300,[K.cyan,K.teal,K.gold][i]));label(f,'基地だけではない',360,260,K.paper,28);label(g,'複合的な政策束',0,-270,K.cyan,31);label(h,'一票の理由は一つとは限らない',0,315,K.paper,36);break;
  case'tamaki_position':
   rr(a,0,0,1920,920,'#14242E',0);paper(b,-430,10,540,600,'玉城氏');card(c,'辺野古移設 反対',-430,-60,370,K.red);['物価高','社会保障','交通'].forEach((x,i)=>card(d,x,360,-120+i*120,300,[K.gold,K.cyan,K.teal][i]));card(e,'県政実績',-430,85,320,K.cyan);label(f,'生活政策も提示',360,260,K.paper,28);label(g,'二つの県政像',0,-270,K.gold,31);label(h,'基地一問の選挙ではない',0,315,K.paper,37);break;
  case'exit_priority':
   rr(a,0,0,1920,920,'#15242B',0);label(b,'期待する政策',0,-270,K.paper,34);bar(c,0,-100,1050,.78,K.gold,'景気・物価高');bar(d,0,45,1050,.39,K.red,'基地問題');bar(e,0,190,1050,.46,K.cyan,'子育て等');label(f,'出口調査',-520,285,K.muted,24);label(g,'優先順位の変化？',300,285,K.paper,30);label(h,'態度消滅とは別問題',0,-325,K.gold,37);break;
  case'vote_compression':
   rr(a,0,0,1920,920,'#101B23',0);person(b,-560,80,.62,K.paper);['辺野古反対','経済評価','県政不満','政府協調'].forEach((x,i)=>card(c,x,-170+(i%2)*430,-100+Math.floor(i/2)*130,330,[K.red,K.cyan,K.gold,K.teal][i]));ln(d,[[330,40],[540,40]],K.gold,8);paper(e,650,40,300,330,'投票用紙');label(f,'一人の名前',650,55,K.ink,29);label(g,'複数判断 → 1票',0,285,K.paper,31);label(h,'投票は圧縮装置',0,-310,K.gold,40);break;
  case'what_changed':
   rr(a,0,0,1920,920,'#12202A',0);['賛否が反転','重要度が変化','両方'].forEach((x,i)=>{rr(b,-450+i*450,10,360,270,'#263A44',12,[K.red,K.gold,K.cyan][i]);label(b,x,-450+i*450,10,K.paper,27)});label(c,'2026結果',0,-230,K.white,36);ln(d,[[0,-170],[-450,-70]],K.red,5);ln(e,[[0,-170],[0,-70]],K.gold,5);ln(f,[[0,-170],[450,-70]],K.cyan,5);label(g,'選挙結果だけでは識別できない',0,270,K.paper,32);label(h,'確実な事実と推論を分ける',0,-315,K.gold,38);break;

  case'salience_axes':
   rr(a,0,0,1920,920,'#0F1B23',0);axes(b);label(b,'重要度 ↑',-690,-230,K.paper,24);label(b,'反対',-430,310,K.red,25);label(b,'賛成',430,310,K.cyan,25);cc(c,-320,-120,38,K.red);cc(d,-320,165,38,K.gold);label(e,'同じ反対',40,20,K.paper,31);ln(f,[[-250,-105],[-80,-20]],K.muted,5);ln(g,[[-250,155],[-80,55]],K.muted,5);label(h,'賛否 × 重要度の二軸',0,-310,K.gold,40);break;
  case'intensity_importance':
   rr(a,0,0,1920,920,'#111E27',0);paper(b,0,70,430,350,'投票用紙');label(b,'候補者名',0,100,K.ink,33);for(let i=0;i<4;i++)cc(c,-560+i*120,-40,34,[K.red,K.red,K.gold,K.cyan][i]);label(d,'強い反対',-430,-120,K.red,25);for(let i=0;i<4;i++)cc(e,320+i*95,-40,20,[K.red,K.gold,K.cyan,K.teal][i]);label(f,'弱い反対',455,-120,K.gold,25);label(g,'重みは用紙に残らない',0,280,K.paper,31);label(h,'結果だけでは強度が見えない',0,-305,K.gold,38);break;
  case'issue_voting_limits':
   rr(a,0,0,1920,920,'#15232B',0);paper(b,-450,0,440,560,'理想的な有権者');['政策理解','候補比較','一致投票'].forEach((x,i)=>card(c,x,-450,-90+i*110,300,K.cyan));paper(d,450,0,440,560,'現実の有権者');['情報不足','複数争点','時間不足'].forEach((x,i)=>card(e,x,450,-90+i*110,300,K.red));label(f,'争点投票研究',0,-285,K.gold,32);label(g,'理想 ≠ 常に現実',0,285,K.paper,31);label(h,'票は完全な政策計算ではない',0,-335,K.paper,37);break;
  case'retrospective_eval':
   rr(a,0,0,1920,920,'#19272E',0);paper(b,-420,0,500,590,'現職への成績表');['生活実感','景気','行政','期待'].forEach((x,i)=>{label(b,x,-500,-110+i*90,K.ink,22);label(b,['B','C','B','?'][i],-300,-110+i*90,i===1?K.red:K.ink,25)});person(c,430,80,.62,K.paper);card(d,'満足',430,-90,260,K.cyan);card(e,'不満',430,20,260,K.red);card(f,'回顧投票',430,140,300,K.gold);label(g,'過去の評価が票へ入る',0,285,K.paper,31);label(h,'政策賛否以外の経路',0,-310,K.gold,39);break;
  case'cohort_change':
   rr(a,0,0,1920,920,'#102029',0);timeline(b,20,[{x:-620,year:'1996',col:K.gold},{x:0,year:'2011',col:K.muted},{x:620,year:'2026',col:K.cyan}]);person(c,-620,120,.45,K.paper);label(c,'20歳',-620,255,K.paper,25);person(d,620,120,.65,K.paper);label(d,'50歳',620,275,K.paper,25);cc(e,0,-120,28,K.cyan);label(e,'当時未出生',0,-175,K.cyan,24);crowd(f,0,250,7,K.muted);label(g,'有権者集団も入れ替わる',0,-275,K.paper,32);label(h,'30年の問題は同じ人だけではない',0,-330,K.gold,36);break;
  case'habituation_or_conversion':
   rr(a,0,0,1920,920,'#111D24',0);person(b,0,220,.48,K.paper);const paths=[['転向',-540,K.red],['慣れ',-180,K.gold],['諦め',180,K.muted],['現実適応',540,K.cyan]] as [string,number,string][];for(const [txtt,x,col] of paths){ln(c,[[0,160],[x,-130]],col,8);card(d,txtt,x,-190,240,col)}label(e,'同じ「一票」へ収束することもある',0,300,K.paper,29);label(f,'反対維持 + 重要度低下',0,40,K.teal,28);label(g,'心理は別物',0,-285,K.paper,31);label(h,'外から区別しにくい',0,-335,K.gold,38);break;
  case'cannot_infer':
   rr(a,0,0,1920,920,'#0E1921',0);card(b,'選挙結果',-430,0,320,K.cyan);ln(c,[[-250,0],[-50,0]],K.red,9);label(c,'×',-150,0,K.red,58);card(d,'有権者の内面',430,0,360,K.red);card(e,'2019',-430,190,240,K.red);card(f,'2026',430,190,240,K.cyan);label(g,'慎重な推論が必要',0,-235,K.paper,34);label(h,'選挙結果は読心術ではない',0,-310,K.gold,40);break;

  case'construction_progress':
   rr(a,0,-120,1920,640,K.sea,0);rr(a,0,250,1920,300,K.soil,0);airstrip(b,0,-80,900);bar(c,0,180,1100,.995,K.red,'辺野古側埋立 約99.5%');label(d,'2026年5月',0,-255,K.paper,32);card(e,'政治対立',-420,285,300,K.cyan);card(f,'物理工事',420,285,300,K.red);ln(g,[[-220,285],[220,285]],K.gold,6);label(h,'二つの時間は同じ速度ではない',0,-315,K.gold,37);break;
  case'fait_accompli':
   rr(a,0,0,1920,920,'#101D25',0);bar(b,0,-70,1100,.88,K.red,'工事進行');['造るべきか','止めるか','完成後どうする'].forEach((x,i)=>card(c,x,-450+i*450,90,330,[K.cyan,K.gold,K.red][i]));for(let i=0;i<3;i++)rr(d,-450+i*450,210,250-(i*45),34,[K.cyan,K.gold,K.red][i],5);label(e,'選択肢が狭くなる',0,280,K.paper,31);label(f,'不可逆性',0,-210,K.red,35);label(g,'賛成への転向とは別',0,-270,K.muted,29);label(h,'政策の進行が問いを変える',0,-330,K.gold,38);break;
  case'security_environment':
   mapFrame(a,'東アジアの安全保障環境');for(let i=0;i<5;i++)cc(b,300+i*90,-120+i*45,28,K.red);card(c,'南西地域',-360,230,300,K.cyan);card(d,'防衛体制強化',0,230,330,K.red);card(e,'30年間の変化',360,230,330,K.gold);label(f,'1996と2026は同じ条件ではない',0,-250,K.paper,31);label(g,'評価も変わり得る',0,300,K.muted,28);label(h,'安全保障側の時間も進む',0,-315,K.gold,39);break;
  case'local_autonomy_limits':
   rr(a,0,0,1920,920,'#121E26',0);building(b,-430,20,430,500,'沖縄県');building(c,430,20,430,500,'国');ln(d,[[-180,20],[180,20]],K.red,12);card(e,'地方自治',-430,275,300,K.cyan);card(f,'法定権限',430,275,300,K.red);label(g,'2023 代執行',0,-230,K.gold,33);label(h,'国策を地方はどこまで止められるか',0,-310,K.paper,36);break;
  case'legitimacy_layers':
   rr(a,0,0,1920,920,'#101B23',0);paper(b,-430,0,480,560,'国の正当性');card(c,'国政選挙',-430,-80,300,K.cyan);card(c,'安全保障',-430,40,300,K.gold);paper(d,430,0,480,560,'県の正当性');card(e,'知事選',430,-80,300,K.cyan);card(e,'地域負担',430,40,300,K.red);ln(f,[[-140,0],[140,0]],K.gold,8);label(g,'両方とも選挙由来',0,270,K.paper,29);label(h,'正当性が衝突する',0,-310,K.gold,40);break;
  case'national_analogy':
   rr(a,0,0,1920,920,'#26323A',0);for(let i=0;i<5;i++)building(a,-650+i*320,110,230,330);person(b,-550,230,.4,K.paper);['原発','処分場','基地'].forEach((x,i)=>{rr(c,220+i*260,-40,220,180,'#3B4850',8,[K.gold,K.red,K.cyan][i]);label(c,x,220+i*260,-40,K.paper,25)});label(d,'もし自分の町なら',0,-250,K.gold,38);card(e,'全国利益',-350,300,300,K.cyan);card(f,'局地負担',350,300,300,K.red);label(g,'本州にも同じ構造',0,205,K.paper,29);label(h,'距離を縮めて考える',0,-315,K.paper,39);break;
  case'democratic_design':
   rr(a,0,0,1920,920,'#14242C',0);label(b,'多数決',0,-250,K.white,42);['補償','対話','権限配分','情報公開','異議申立て'].forEach((x,i)=>{const xx=-520+(i%3)*520,yy=-60+Math.floor(i/3)*150;card(c,x,xx,yy,300,[K.cyan,K.gold,K.red,K.teal,K.blue][i])});ln(d,[[-520,20],[0,170],[520,20]],K.muted,5);label(e,'決定後も仕事は残る',0,270,K.paper,32);label(f,'公平性',-380,320,K.cyan,27);label(g,'正統性',380,320,K.gold,27);label(h,'民主主義は投票で終わらない',0,-320,K.gold,39);break;

  case'return_two_boxes':
   rr(a,0,0,1920,920,'#10212A',0);ballot(b,-430,40,'2019 県民投票');ballot(c,430,40,'2026 知事選');card(d,'辺野古をどう思う？',-430,260,360,K.red);card(e,'誰に県政を任せる？',430,260,380,K.cyan);label(f,'箱は似ている',0,-210,K.paper,31);label(g,'問いは違う',0,-120,K.gold,36);label(h,'比較の出発点へ戻る',0,-310,K.paper,39);break;
  case'both_are_public_opinion':
   rr(a,0,0,1920,920,'#121F27',0);paper(b,-420,0,500,540,'2019');label(b,'反対 71.7%',-420,0,K.red,40);paper(c,420,0,500,540,'2026');label(c,'古謝氏 当選',420,0,K.cyan,38);ln(d,[[-110,0],[110,0]],K.gold,8);label(e,'どちらも制度上の結果',0,150,K.paper,30);label(f,'時点が違う',-270,270,K.muted,26);label(g,'問いが違う',270,270,K.muted,26);label(h,'片方を偽物にしない',0,-310,K.gold,40);break;
  case'public_opinion_moves':
   rr(a,0,0,1920,920,'#101D26',0);ln(b,[[-650,150],[-300,50],[0,100],[260,-30],[620,-120]],K.gold,10);['物価','年齢','安全保障','実績'].forEach((x,i)=>cc(c,-480+i*320,-80+(i%2)*120,55,[K.red,K.cyan,K.gold,K.teal][i]));label(c,'物価',-480,-80,K.black,20);label(c,'年齢',-160,40,K.black,20);label(c,'安保',160,-80,K.black,20);label(c,'実績',480,40,K.black,20);cc(d,120,55,30,K.paper);label(e,'社会の重心',120,120,K.paper,27);label(f,'固定されない',0,270,K.muted,29);label(g,'移動し続ける',0,-250,K.gold,32);label(h,'民意は石碑ではなく重心',0,-315,K.paper,39);break;
  case'majority_not_end':
   rr(a,0,0,1920,920,'#111D24',0);cc(b,-340,20,230,K.cyan);label(b,'多数',-340,20,K.black,36);cc(c,390,20,90,K.red);label(c,'地域',390,20,K.black,26);ln(d,[[-90,20],[280,20]],K.gold,8);card(e,'選挙勝利',-340,280,300,K.cyan);card(f,'負担継続',390,280,300,K.red);label(g,'決定後にも残る声',0,-230,K.paper,31);label(h,'多数決 = 問題終了ではない',0,-310,K.gold,39);break;
  case'burden_distribution':
   mapFrame(a,'最後に残る地理');ratioRing(b,-420,20,'0.6%','国土');ratioRing(c,420,20,'約70%','専用施設');card(d,'安全保障の費用',-420,255,330,K.cyan);card(e,'地域に集中',420,255,300,K.red);label(f,'選挙結果が変わっても',0,-230,K.paper,30);label(g,'地理は残る',0,-165,K.gold,33);label(h,'分配の問題',0,-315,K.red,41);break;
  case'final_question':
   rr(a,0,0,1920,920,'#090F15',0);label(b,'賛成？',-360,-50,K.cyan,58);label(c,'反対？',360,-50,K.red,58);label(d,'それだけではない',0,80,K.paper,34);paper(e,0,235,900,150,'');label(e,'選挙で勝った者は個別政策をどこまで代表するのか',0,235,K.ink,28);label(f,'候補者への一票',-420,-230,K.muted,26);label(g,'政策への委任',420,-230,K.muted,26);label(h,'民意の射程',0,-315,K.gold,42);break;
  case'henoko_as_mirror':
   rr(a,0,-110,1920,660,K.sea,0);rr(a,0,245,1920,250,K.soil,0);islandChain(b,0,-70,.8);for(let i=0;i<5;i++)ln(c,[[-700+i*350,80],[-620+i*350,130]],K.ice,4);['国家','地方','多数','少数'].forEach((x,i)=>card(d,x,-510+i*340,235,250,[K.cyan,K.gold,K.red,K.teal][i]));label(e,'安全保障 × 自治',0,-235,K.paper,34);label(f,'全国利益 × 地域負担',0,-165,K.gold,31);label(g,'沖縄だけの政治ではない',0,315,K.paper,32);label(h,'辺野古の海は民主主義の鏡',0,-320,K.gold,41);break;
  default:
   rr(a,0,0,1920,920,K.navy,0);card(b,plan.labels[0],-420,-80,320,K.cyan);card(c,plan.labels[1],420,-80,320,K.gold);card(d,plan.labels[3],-420,120,320,K.paper);card(e,plan.labels[4],420,120,320,K.red);label(f,plan.labels[5],0,-245,K.paper,31);label(g,plan.labels[6],0,285,K.paper,31);label(h,plan.labels[7],0,-305,K.red,38);
 }
 return s;
}

function offsetFor(scene:Scene,i:number):[number,number,number]{
 const p=hash(scene.motif+scene.id)%10;const mag=28+(i%4)*13;
 switch(p){
  case 0:return[i%2?mag:-mag,0,.94];case 1:return[0,i%2?mag:-mag,.94];case 2:return[i%2?mag:-mag,i%3?18:-18,.9];
  case 3:return[0,0,.82];case 4:return[i<4?-mag:mag,i%2?18:-18,.92];case 5:return[i%3===0?mag:0,i%2?mag:-mag,.95];
  case 6:return[i%2?-mag:mag,i<4?-20:20,.9];case 7:return[i<4?-mag:mag,0,.88];case 8:return[0,i<4?mag:-mag,.88];
  default:return[i%2?mag:-mag,i%2?-12:12,.91]
 }
}
function settleTarget(scene:Scene,plan:Plan,i:number):{x:number;y:number;r:number;s:number;opacity:number}{
 const h=hash(scene.motif+plan.motion+i);let x=((h%13)-6)*1.5,y=(((h>>4)%11)-5)*1.2,r=((h>>8)%7-3)*.45,s=1.012,opacity=1;
 if(plan.motion.includes('collapse')){s=i<3?.97:1.025;opacity=i<2?.78:1}
 if(plan.motion.includes('rewind')){x=i<4?10:-10;r=(i%2?1:-1)*1.2}
 if(plan.motion.includes('compress')){x=i<6?(6-i)*4:0;s=i>5?1.025:1.006}
 if(plan.motion.includes('shift')){x=(i-3.5)*3.5;y=i>4?-8:4}
 if(plan.motion.includes('rise')){y=i>2?-10:6;s=1.02}
 if(plan.motion.includes('map')){s=1.018;x=(i%2?1:-1)*6}
 if(plan.motion.includes('court')||plan.motion.includes('authority')){x=i%2?8:-8;r=i%2?.8:-.8}
 if(plan.motion.includes('bar')){s=i>3?1.025:1.008;y=i>4?-6:0}
 if(plan.motion.includes('paths')){x=i>3?(i%2?12:-12):0}
 if(plan.motion.includes('mirror')){y=i>3?-7:4;s=1.02}
 return{x,y,r,s,opacity};
}
function* microStageFlow(stages:Node[],scene:Scene,plan:Plan):ThreadGenerator{
 const base=[.012,.115,.218,.321,.424,.527,.63,.733];let cursor=0;
 for(let i=0;i<8;i++){
  const [ox,oy,os]=offsetFor(scene,i);stages[i].x(ox);stages[i].y(oy);stages[i].scale(os);stages[i].rotation(i%2?1.1:-1.1);
  const jitter=((hash(scene.motif+i.toString())>>3)&7)*.002;const at=scene.duration*Math.min(.82,base[i]+jitter);
  if(at>cursor)yield* waitFor(at-cursor);cursor=at;
  const reveal=Math.min(.48,Math.max(.19,scene.duration*.014));
  yield* all(stages[i].opacity(1,reveal),stages[i].x(0,reveal),stages[i].y(0,reveal),stages[i].scale(1,reveal),stages[i].rotation(0,reveal));cursor+=reveal;
  const t=settleTarget(scene,plan,i);const settle=Math.min(.4,Math.max(.17,scene.duration*.012));
  yield* all(stages[i].x(t.x,settle),stages[i].y(t.y,settle),stages[i].rotation(t.r,settle),stages[i].scale(t.s,settle),stages[i].opacity(t.opacity,settle));cursor+=settle;
  if(i>=3)stages[i-3].opacity(.74);
 }
 const end=scene.duration*.9;if(end>cursor){yield* waitFor(end-cursor);cursor=end}
 yield* all(stages[7].scale(1.035,.34),stages[6].opacity(.86,.34));cursor+=.34;
 if(scene.duration>cursor)yield* waitFor(scene.duration-cursor);
}
function* cameraFlow(node:Node,duration:number,motif:string):ThreadGenerator{
 const p=hash(motif)%8;const dx=[14,-16,11,-10,18,-14,9,-12][p],dy=[-6,8,7,-8,3,-4,9,-7][p];
 node.scale(1.006);const q=duration/4;
 yield* all(node.x(dx,q),node.y(dy,q),node.scale(1.013,q));
 yield* all(node.x(-dx*.55,q),node.y(-dy*.6,q),node.scale(1.021,q));
 yield* all(node.x(dx*.35,q),node.y(dy*.25,q),node.scale(1.014,q));
 yield* all(node.x(0,Math.max(.01,duration-3*q)),node.y(0,Math.max(.01,duration-3*q)),node.scale(1.008,Math.max(.01,duration-3*q)));
}
function* subtitleFlow(cues:Cue[],caption:Txt,duration:number):ThreadGenerator{let t=0;for(const c of cues){if(c.start>t)yield* waitFor(c.start-t);caption.text(c.display);t=c.start}if(duration>t)yield* waitFor(duration-t);caption.text('')}

export function* playMeaningScene(view:View2D,scene:Scene):ThreadGenerator{
 const plan=(visualPlan as Record<string,Plan>)[scene.motif];if(!plan)throw new Error('V124 visual plan missing: '+scene.motif);
 view.fill(K.bg);const contentLayer=new Node({});const headingLayer=new Node({});const subtitleBacking=new Node({});const subtitleTextLayer=new Node({});
 view.add(contentLayer);view.add(headingLayer);view.add(subtitleBacking);view.add(subtitleTextLayer);
 const stages=buildScene(contentLayer,scene,plan);
 rr(headingLayer,0,-474,1920,132,'#061018',0);const part=scene.chapter==='prologue'?'PROLOGUE':scene.chapter==='epilogue'?'EPILOGUE':scene.chapter.toUpperCase();
 headingLayer.add(tx(part,-800,-508,22,K.gold,700));headingLayer.add(tx(scene.id,830,-508,21,K.muted,600));headingLayer.add(tx(scene.title,0,-452,scene.title.length>33?28:scene.title.length>23?33:42,K.paper,700));
 rr(subtitleBacking,0,460,1920,170,'#02060B',0).opacity(.94);const caption=tx('',0,458,40,K.paper,650);caption.lineHeight(57);subtitleTextLayer.add(caption);
 yield* all(microStageFlow(stages,scene,plan),cameraFlow(contentLayer,scene.duration,scene.motif),subtitleFlow(scene.cues,caption,scene.duration));
}
