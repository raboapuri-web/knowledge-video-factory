import '@fontsource/noto-sans-jp/400.css';
import '@fontsource/noto-sans-jp/700.css';
import {Circle, Line, Node, Rect, Txt, type View2D} from '@motion-canvas/2d';
import {all, waitFor, type ThreadGenerator} from '@motion-canvas/core';
import visualPlan from '../../content/visual_plan.json';

type Cue={text:string;display:string;start:number;end:number};
type Scene={id:string;chapter:string;motif:string;title:string;narration:string;cues:Cue[];duration:number};
type Plan={kind:string;motion:string;labels:string[]};
export const MICRO_BEATS_PER_SCENE=16;

const K={bg:'#08111B',deep:'#10202B',wall:'#18303B',floor:'#324B55',paper:'#F0ECE2',muted:'#9EAFB7',red:'#CF5753',gold:'#D7AE69',cyan:'#6EB5B6',teal:'#6F988A',blue:'#607F9A',green:'#718D72',brown:'#735F4E',sand:'#A8926C',ice:'#9FC0CC',ink:'#17252E',soil:'#4E4035',fog:'#87979B',orange:'#B87850'};
const F='Noto Sans JP, Noto Sans CJK JP, sans-serif';
const hash=(s:string)=>[...s].reduce((a,c)=>((a*33)^c.charCodeAt(0))>>>0,122);
const tx=(s:string,x:number,y:number,sz=30,col=K.paper,w=700)=>new Txt({text:s,x,y,fontFamily:F,fontSize:sz,fill:col,fontWeight:w});
function rr(p:Node,x:number,y:number,w:number,h:number,fill:string,r=10,stroke?:string){const q=new Rect({x,y,width:w,height:h,fill,radius:r,stroke:stroke??fill,lineWidth:stroke?2:0});p.add(q);return q}
function cc(p:Node,x:number,y:number,r:number,fill:string){const q=new Circle({x,y,width:r*2,height:r*2,fill});p.add(q);return q}
function ln(p:Node,pts:[number,number][],col=K.muted,w=5){const q=new Line({points:pts,stroke:col,lineWidth:w,lineCap:'round',lineJoin:'round'});p.add(q);return q}
function label(p:Node,s:string,x:number,y:number,col=K.paper,sz=24,w=700){const q=tx(s,x,y,sz,col,w);p.add(q);return q}
function card(p:Node,s:string,x:number,y:number,w=250,col=K.cyan){rr(p,x,y,w,68,K.deep,12,col);label(p,s,x,y,col,23)}
function person(p:Node,x:number,y:number,s=.7,col=K.paper){const g=new Node({x,y,scale:s});p.add(g);cc(g,0,-60,24,col);rr(g,0,24,60,118,col,18);ln(g,[[-20,-5],[-58,55]],col,11);ln(g,[[20,-5],[58,55]],col,11);ln(g,[[-18,78],[-22,150]],col,13);ln(g,[[18,78],[22,150]],col,13);return g}
function sitting(p:Node,x:number,y:number,s=.7,col=K.paper){const g=new Node({x,y,scale:s});p.add(g);cc(g,0,-58,24,col);rr(g,0,20,60,110,col,18);ln(g,[[-18,70],[-55,108]],col,13);ln(g,[[18,70],[55,108]],col,13);ln(g,[[-55,108],[-10,110]],col,13);ln(g,[[55,108],[12,110]],col,13);return g}
function laptop(p:Node,x:number,y:number,s=.8,closed=false){const g=new Node({x,y,scale:s});p.add(g);if(closed){rr(g,0,8,190,24,'#32454F',5);ln(g,[[-110,25],[110,25]],K.muted,10)}else{rr(g,0,-20,180,108,'#273A45',7);rr(g,0,-24,154,80,'#0E1921',4);ln(g,[[-112,50],[112,50]],K.muted,11)}return g}
function phone(p:Node,x:number,y:number,s=.8){const g=new Node({x,y,scale:s});p.add(g);rr(g,0,0,132,224,K.ink,20,K.muted);rr(g,0,-4,104,184,'#244452',12);cc(g,0,92,5,K.muted);return g}
function book(p:Node,x:number,y:number,s=.7,col=K.cyan){const g=new Node({x,y,scale:s});p.add(g);rr(g,-48,0,88,120,col,8);rr(g,48,0,88,120,col,8);ln(g,[[0,-57],[0,57]],K.paper,3);return g}
function mug(p:Node,x:number,y:number,s=.7,col=K.paper){const g=new Node({x,y,scale:s});p.add(g);rr(g,0,0,76,68,col,8);cc(g,45,0,23,col);cc(g,45,0,14,K.bg);return g}
function clock(p:Node,x:number,y:number,labelText='14:00'){cc(p,x,y,58,K.paper);cc(p,x,y,51,K.deep);ln(p,[[x,y],[x+22,y-24]],K.paper,5);ln(p,[[x,y],[x,y-33]],K.paper,5);label(p,labelText,x,y+83,K.gold,22)}
function tree(p:Node,x:number,y:number,s=1,leaf=K.green,bare=false){ln(p,[[x,y+90*s],[x,y-32*s]],K.brown,16*s);if(!bare){cc(p,x,y-72*s,55*s,leaf);cc(p,x-38*s,y-50*s,39*s,leaf);cc(p,x+40*s,y-48*s,38*s,leaf)}}
function seed(p:Node,x:number,y:number,s=1,col=K.brown){const g=new Node({x,y,scale:s,rotation:-18});p.add(g);rr(g,0,0,42,66,col,22);return g}
function sprout(p:Node,x:number,y:number,s=1){ln(p,[[x,y+30*s],[x,y-35*s]],K.green,7*s);cc(p,x-18*s,y-38*s,15*s,K.green);cc(p,x+18*s,y-48*s,15*s,K.teal)}
function bug(p:Node,x:number,y:number,s=1,col=K.gold){const g=new Node({x,y,scale:s});p.add(g);cc(g,0,0,28,col);cc(g,0,-34,18,col);for(const yy of[-15,10,30]){ln(g,[[-20,yy],[-48,yy-18]],col,5);ln(g,[[20,yy],[48,yy-18]],col,5)}return g}
function gear(p:Node,x:number,y:number,r=50,col=K.blue){cc(p,x,y,r,col);cc(p,x,y,r*.38,K.bg)}
function meter(p:Node,x:number,y:number,w:number,v:number,col=K.cyan){rr(p,x,y,w,24,'#243943',7);rr(p,x-w*(1-v)/2,y,w*v,24,col,7)}
function battery(p:Node,x:number,y:number,w:number,v:number,col=K.cyan){rr(p,x,y,w,72,'#182933',10,K.muted);rr(p,x-w*(1-v)/2,y,w*v-10,54,col,6);rr(p,x+w/2+12,y,18,28,K.muted,3)}
function windowFrame(p:Node,x:number,y:number,w=340,h=240,sky='#203D4A'){rr(p,x,y,w,h,sky,5,K.paper);ln(p,[[x,y-h/2],[x,y+h/2]],K.paper,4);ln(p,[[x-w/2,y],[x+w/2,y]],K.paper,4)}
function desk(p:Node,x:number,y:number,w=420){rr(p,x,y,w,30,K.brown,5);ln(p,[[x-w*.38,y+12],[x-w*.38,y+110]],K.paper,7);ln(p,[[x+w*.38,y+12],[x+w*.38,y+110]],K.paper,7)}
function sofa(p:Node,x:number,y:number,w=470){rr(p,x,y,w,160,'#29404A',30);rr(p,x,y-65,w-40,80,'#314C57',24);rr(p,x-w*.43,y+55,50,95,'#314C57',18);rr(p,x+w*.43,y+55,50,95,'#314C57',18)}
function paper(p:Node,x:number,y:number,w=300,h=380,title=''){rr(p,x,y,w,h,'#E9E4D9',8,'#7D898C');if(title)label(p,title,x,y-h*.38,K.ink,24);for(let i=0;i<5;i++)ln(p,[[x-w*.34,y-h*.14+i*48],[x+w*(i===4?.12:.34),y-h*.14+i*48]],'#92999A',4)}
function calendar(p:Node,x:number,y:number,w=330,h=260){rr(p,x,y,w,h,'#E7E1D5',10,K.muted);rr(p,x,y-h*.38,w,48,K.red,8);for(let c=0;c<4;c++)for(let r=0;r<3;r++)cc(p,x-110+c*72,y-35+r*65,8,'#A1AAA8')}
function house(p:Node,x:number,y:number,w=340,h=240,col='#304047'){rr(p,x,y,w,h,col,8);ln(p,[[x-w*.55,y-h*.5],[x,y-h*.82],[x+w*.55,y-h*.5]],K.brown,10);rr(p,x,y+35,70,110,K.deep,4)}
function tinyPlant(p:Node,x:number,y:number){rr(p,x,y+28,74,50,K.brown,7);ln(p,[[x,y+5],[x,y-40]],K.green,6);cc(p,x-18,y-35,15,K.green);cc(p,x+18,y-50,16,K.teal)}
function worldBase(root:Node,scene:Scene){rr(root,0,0,1920,1080,K.bg,0);const h=hash(scene.motif);for(let i=0;i<14;i++){const x=-900+((h>>(i%14))%1800),y=-330+((h>>(i%10+2))%560);cc(root,x,y,1.5+(i%3),i%2?K.gold:K.cyan)}rr(root,0,342,1920,3,'#263E48',0)}
function stages8(){return Array.from({length:8},()=>new Node({opacity:0}))}
function roomShell(p:Node,day=true){rr(p,0,-10,1920,900,day?'#132A35':'#0D1B24',0);rr(p,0,270,1920,270,'#263C43',0);windowFrame(p,560,-130,430,270,day?'#6C8791':'#142A35');sofa(p,-380,160,500);desk(p,320,205,360)}
function winterForest(p:Node){rr(p,0,0,1920,930,'#172832',0);rr(p,0,245,1920,390,'#D5DFDF',0);for(let i=0;i<8;i++)tree(p,-780+i*220,105+(i%2)*20,.75,'#41565B',true);cc(p,700,-270,63,K.ice);for(let i=0;i<30;i++)cc(p,-860+(i*137)%1720,-320+(i*83)%590,3+(i%2),K.paper)}
function soilCut(p:Node,desert=false){rr(p,0,-130,1920,610,desert?'#6E5A3E':'#18303A',0);rr(p,0,235,1920,340,desert?'#98784C':K.soil,0)}
function researchBoard(p:Node){rr(p,0,0,1920,920,'#142630',0);rr(p,0,0,1480,690,'#E8E2D6',12);rr(p,0,305,1510,28,K.brown,3)}
function factoryShell(p:Node){rr(p,0,0,1920,920,'#14252E',0);for(let i=0;i<5;i++){rr(p,-700+i*350,25,250,470,'#273E48',4);rr(p,-700+i*350,-150,160,130,'#365765',3)}rr(p,0,250,1540,55,'#50626A',4)}
function officeShell(p:Node){rr(p,0,0,1920,920,'#102631',0);desk(p,0,205,620);laptop(p,0,100,1);for(let i=0;i<4;i++)windowFrame(p,-630+i*420,-160,300,190,'#25414D')}
function roadShell(p:Node,fog=false){rr(p,0,0,1920,930,fog?'#26343A':'#122834',0);ln(p,[[0,325],[0,-335]],'#536B74',130);ln(p,[[-18,325],[-18,-335]],K.paper,4);if(fog)rr(p,0,-60,1920,680,K.fog,0).opacity(.22)}

function buildScene(root:Node,scene:Scene,plan:Plan):Node[]{
 worldBase(root,scene);const s=stages8();s.forEach(n=>root.add(n));const[a,b,c,d,e,f,g,h]=s;const L=plan.labels;
 switch(scene.motif){
  case'idle_room':
   roomShell(a,true);clock(b,700,-260,'14:00');laptop(c,330,185,.9,true);mug(c,455,175,.75,K.muted);sitting(d,-380,120,.72,K.paper);phone(e,-555,205,.42);card(f,'成果 0',560,205,220,K.red);label(g,'何もしていない',0,-270,K.paper,38);label(h,'それは異常か？',0,300,K.gold,42);break;
  case'social_feed':
   roomShell(a,true);phone(b,0,15,1.65);['転職報告','海外出張','最高売上'].forEach((x,i)=>card(c,x,0,-105+i*120,310,i===2?K.gold:K.cyan));sitting(d,-620,160,.48,K.paper);card(e,'自分の部屋',600,-70,270,K.muted);card(f,'空白期間',600,45,270,K.red);label(g,'活動だけが可視化される',0,-290,K.paper,34);label(h,'停止だけが異常に見える',0,300,K.gold,38);break;
  case'hibernator_den':
   winterForest(a);rr(b,0,320,1920,220,K.soil,0);rr(b,0,250,650,250,'#251F1B',120);sitting(c,0,245,.55,K.sand);['心拍','体温','酸素'].forEach((x,i)=>{label(d,x,-520+i*520,-30,K.paper,24);meter(d,-520+i*520,35,300,.82-i*.18,i===0?K.red:K.cyan)});label(e,'出力を落とす',0,-250,K.gold,40);battery(f,0,165,430,.72,K.cyan);label(g,'資源を保存',0,290,K.paper,32);label(h,'未来へ生き延びる',0,-300,K.gold,38);break;
  case'human_adds_tasks':
   officeShell(a);person(b,0,80,.72,K.paper);['資格','副業','投資','語学','運動'].forEach((x,i)=>card(c,x,-520+(i%3)*520,-85+Math.floor(i/3)*130,250,i%2?K.red:K.gold));calendar(d,590,165,300,250);label(e,'環境悪化',-520,250,K.red,33);label(f,'→ 活動を追加',0,250,K.paper,36);battery(g,520,250,300,.28,K.red);label(h,'逆方向の戦略',0,-290,K.gold,40);break;
  case'central_question':
   winterForest(a);rr(a,0,0,12,700,K.muted,0);sitting(b,-430,150,.55,K.sand);person(c,430,115,.55,K.paper);battery(d,-430,270,300,.7,K.cyan);battery(d,430,270,300,.25,K.red);card(e,'活動停止',-430,-170,260,K.cyan);card(f,'活動追加',430,-170,260,K.red);label(g,'止まることは適応か？',0,-290,K.paper,40);label(h,'次に動くための停止',0,310,K.gold,41);break;
  case'autumn_fattening':
   rr(a,0,0,1920,930,'#3A312A',0);rr(a,0,245,1920,390,'#5C4A35',0);for(let i=0;i<8;i++)tree(a,-780+i*220,105,.7,i%2?K.gold:K.orange);sitting(b,-300,120,.48,K.sand);for(let i=0;i<7;i++)cc(c,-520+i*95,190+(i%2)*22,17,K.brown);label(d,'脂肪を蓄える',-330,-210,K.gold,30);rr(e,420,175,520,210,'#2A211C',100);label(e,'巣穴を準備',420,175,K.paper,28);cc(f,650,-250,55,K.gold);label(f,'日照が短くなる',430,-250,K.paper,25);label(g,'停止は事前に設計される',0,292,K.paper,34);label(h,'冬になる前から始まる',0,-300,K.gold,39);break;
  case'torpor_cycle':
   researchBoard(a);ln(b,[[-610,100],[-430,100],[-330,-140],[-150,-140],[-40,100],[150,100],[260,-140],[450,-140],[590,100]],K.cyan,10);card(c,'通常',-480,210,210,K.gold);card(c,'トーパー',-110,210,230,K.cyan);card(c,'短い覚醒',290,210,260,K.red);meter(d,-280,-15,390,.22,K.cyan);label(d,'代謝',-560,-15,K.ink,24);meter(e,280,-15,390,.78,K.red);label(e,'覚醒',560,-15,K.ink,24);battery(f,0,-235,380,.24,K.cyan);label(g,'完全OFFではない',0,305,K.ink,31);label(h,'低電力モード',0,-300,K.red,42);break;
  case'energy_budget':
   researchBoard(a);card(b,'食物 ↓',-420,-120,300,K.red);card(b,'寒さ ↑',420,-120,300,K.red);label(c,'収入',-420,30,K.ink,30);meter(c,-420,80,360,.28,K.red);label(d,'支出',420,30,K.ink,30);meter(d,420,80,360,.88,K.red);label(e,'赤字',0,185,K.red,54);meter(f,0,260,700,.46,K.cyan);label(f,'代謝を下げて支出を抑える',0,300,K.ink,28);label(g,'活動量を下げる',0,-245,K.ink,31);label(h,'収支を生存側へ戻す',0,-305,K.red,38);break;
  case'two_winter_paths':
   winterForest(a);rr(a,0,0,8,680,K.muted,0);person(b,-430,95,.5,K.paper);person(b,430,95,.5,K.cyan);for(let i=0;i<4;i++)cc(c,-620+i*120,190,16,K.gold);rr(d,430,175,470,170,'#251F1B',85);battery(e,-430,280,300,.16,K.red);battery(f,430,280,300,.64,K.cyan);card(g,'動き続ける',-430,-190,280,K.red);card(g,'出力を落とす',430,-190,280,K.cyan);label(h,'春まで残る資源が違う',0,-300,K.gold,38);break;
  case'spring_result':
   winterForest(a);label(b,'冬の成果 = 0',-510,-220,K.red,38);card(c,'餌集めなし',-510,-80,270,K.muted);card(c,'繁殖なし',-510,30,270,K.muted);rr(d,0,245,1920,390,'#4A523E',0);for(let i=0;i<8;i++)sprout(d,-760+i*210,210,.8);sitting(e,380,150,.5,K.sand);cc(f,700,-260,66,K.gold);label(g,'雪解け',430,-120,K.paper,30);label(h,'長期成果 = 春に生きている',0,-300,K.gold,39);break;
  case'diapause_insect':
   rr(a,0,0,1920,930,'#24372F',0);bug(b,-520,70,1.15,K.gold);cc(c,560,-220,58,K.gold);label(c,'日長 ↓',560,-130,K.paper,26);ln(d,[[-250,220],[-120,140],[30,80],[180,25],[330,-20]],K.cyan,8);bug(d,330,-20,.7,K.cyan);card(e,'発育停止',0,210,300,K.red);card(f,'脂質蓄積',360,210,300,K.gold);rr(g,-360,210,250,120,'#223A32',60);label(g,'隠れ場所',-360,210,K.paper,25);label(h,'悪条件の前に止まる',0,-290,K.gold,40);break;
  case'seed_waiting':
   soilCut(a,false);for(let i=0;i<9;i++)seed(b,-700+i*170,230+(i%2)*35,.7,i%3?K.brown:K.sand);['水分','温度','光'].forEach((x,i)=>card(c,x,-350+i*350,-170,250,i===1?K.gold:K.cyan));for(let i=0;i<3;i++)sprout(d,-430+i*220,210,.8);for(let i=0;i<5;i++)seed(e,170+i*130,245,.65,K.brown);label(f,'発芽を保留',430,40,K.gold,32);label(g,'条件が良くても全員は出ない',0,-260,K.paper,32);label(h,'未来へ残る個体を持つ',0,305,K.gold,37);break;
  case'desert_bethedge':
   soilCut(a,true);cc(a,690,-260,70,K.gold);for(let i=0;i<10;i++)seed(b,-650+i*145,240,.62,K.brown);for(let i=0;i<3;i++)sprout(c,-520+i*160,205,.9);for(let i=0;i<18;i++)ln(d,[[-700+i*80,-240],[-720+i*80,-175]],K.cyan,4);for(let i=0;i<3;i++)rr(e,-520+i*160,185,10,60,K.muted,3);label(f,'3個は今年へ',-360,40,K.paper,30);label(g,'7個は土中に残る',390,40,K.gold,31);label(h,'全員が同じ雨に賭けない',0,-290,K.paper,38);break;
  case'microbial_seedbank':
   researchBoard(a);for(let i=0;i<18;i++)cc(b,-560+(i%6)*210,-120+Math.floor(i/6)*130,22+(i%3)*5,i%2?K.cyan:K.gold);for(let i=0;i<12;i++)cc(c,-480+(i%6)*190,-95+Math.floor(i/6)*170,18,K.muted);card(d,'環境悪化',0,-245,280,K.red);for(let i=0;i<7;i++)cc(e,-420+i*140,150,20,K.teal);card(f,'低代謝で残る',0,270,330,K.teal);card(g,'環境改善',430,-245,280,K.cyan);label(h,'再活性化できる貯蔵庫',0,-300,K.red,38);break;
  case'dormancy_reframe':
   researchBoard(a);['哺乳類','昆虫','植物','微生物'].forEach((x,i)=>card(b,x,-510+(i%2)*1020,-120+Math.floor(i/2)*190,320,[K.ice,K.gold,K.green,K.cyan][i]));sitting(c,-510,-120,.28,K.sand);bug(d,510,-120,.55,K.gold);seed(e,-510,70,.7,K.green);for(let i=0;i<4;i++)cc(f,465+i*30,65+(i%2)*25,14,K.cyan);label(g,'停止 → 保存 → 再活性化',0,285,K.ink,34);label(h,'「できない」ではなく戦略',0,-295,K.red,38);break;
  case'seasonal_village':
   rr(a,0,0,1920,930,'#23372F',0);for(let i=0;i<4;i++){const x=-660+i*440;house(a,x,80,280,190,i===3?'#3D4142':'#4B4940');label(a,['春','夏','秋','冬'][i],x,-230,[K.green,K.gold,K.orange,K.ice][i],31)}for(let i=0;i<5;i++)sprout(b,-800+i*80,225,.55);cc(c,-220,-160,58,K.gold);for(let i=0;i<6;i++)cc(d,220+i*40,205,14,K.orange);rr(e,650,160,260,120,K.brown,12);label(e,'修理',650,160,K.paper,26);label(f,'仕事は続く',0,-70,K.paper,30);label(g,'ただし強度は変わる',0,290,K.gold,33);label(h,'活動には季節の波があった',0,-300,K.paper,37);break;
  case'factory_flattening':
   factoryShell(a);for(let i=0;i<5;i++)gear(b,-620+i*310,155,44,i%2?K.gold:K.blue);['蒸気','照明','空調','保存','物流'].forEach((x,i)=>card(c,x,-600+i*300,-200,220,i%2?K.cyan:K.gold));ln(d,[[-700,245],[700,245]],K.red,9);label(d,'一年中 同じ出力',0,290,K.red,32);for(let i=0;i<4;i++)cc(e,-390+i*260,-70,40,[K.green,K.gold,K.orange,K.ice][i]);label(f,'季節差 ↓',0,-70,K.paper,28);label(g,'稼働率は平らになる',0,-300,K.paper,35);label(h,'工業化が活動の波を削る',0,320,K.gold,37);break;
  case'office_four_seasons':
   officeShell(a);['1月','4月','8月','11月'].forEach((x,i)=>{label(b,x,-630+i*420,-280,[K.ice,K.green,K.gold,K.orange][i],25);cc(c,-630+i*420,-160,30,[K.ice,K.green,K.gold,K.orange][i])});clock(d,650,175,'09:00');person(e,0,95,.45,K.paper);label(f,'同じ机',0,265,K.paper,28);label(g,'同じ時刻',350,265,K.paper,28);label(h,'季節だけが変わる',0,-320,K.gold,41);break;
  case'growth_dashboard':
   researchBoard(a);ln(b,[[-580,210],[-580,-190]],K.ink,5);ln(b,[[-580,210],[610,210]],K.ink,5);ln(c,[[-520,165],[-260,80],[0,20],[260,-90],[520,-165]],K.cyan,12);['給与','技能','人脈','資産'].forEach((x,i)=>card(d,x,-450+i*300,265,230,i%2?K.gold:K.cyan));label(e,'前年比',430,-245,K.ink,30);card(f,'停滞 = 警告',430,-150,300,K.red);label(g,'人生のKPI',-360,-250,K.red,38);label(h,'右肩上がりだけが正常？',0,320,K.ink,37);break;
  case'season_logic':
   researchBoard(a);const cols=[K.green,K.gold,K.orange,K.ice];['春','夏','秋','冬'].forEach((x,i)=>{const ang=-Math.PI/2+i*Math.PI/2,xx=-330+Math.cos(ang)*210,yy=20+Math.sin(ang)*150;cc(b,xx,yy,58,cols[i]);label(b,x,xx,yy,K.bg,24)});ln(c,[[260,210],[390,100],[480,-20],[590,-190]],K.red,10);label(c,'直線成長',470,255,K.red,28);meter(d,-330,265,330,.68,K.cyan);meter(e,-330,300,330,.32,K.ice);label(f,'循環',-330,-230,K.ink,31);label(g,'環境に合わせて出力を変える',220,-245,K.ink,31);label(h,'常時成長は自然の標準ではない',0,320,K.red,36);break;
  case'afterwork_body':
   roomShell(a,false);clock(b,680,-250,'23:00');sitting(c,-380,120,.62,K.paper);phone(d,-530,215,.45);['メール','会議','返信','明日'].forEach((x,i)=>card(e,x,250+(i%2)*320,-100+Math.floor(i/2)*130,250,i%2?K.red:K.cyan));rr(f,-380,-40,250,95,'#162832',45,K.red);label(f,'頭内オフィス',-380,-40,K.red,26);label(g,'身体は家',-380,285,K.paper,30);label(h,'心理はまだ会社',350,285,K.gold,34);break;
  case'detachment_evidence':
   researchBoard(a);label(b,'86 論文',-430,-190,K.ink,38);label(b,'91 サンプル',0,-190,K.ink,38);label(b,'38,124 人',430,-190,K.red,38);card(c,'心理的離脱',0,-60,330,K.cyan);meter(d,-330,80,360,.7,K.cyan);label(d,'疲労 ↓',-330,125,K.ink,25);meter(e,330,80,360,.76,K.gold);label(e,'睡眠 / WB',330,125,K.ink,25);label(f,'平均的な関連',0,230,K.ink,31);label(g,'離れる力',0,-260,K.red,34);label(h,'回復と結びつく',0,310,K.red,38);break;
  case'vacation_evidence':
   researchBoard(a);ln(b,[[-620,190],[-200,80],[120,-120],[430,-60],[620,15]],K.cyan,11);['前','休暇中','直後','数日後'].forEach((x,i)=>label(c,x,-540+i*360,260,K.ink,24));label(d,'32研究',-480,-225,K.red,40);card(e,'well-being ↑',0,-220,330,K.cyan);card(f,'心理的離脱',380,-110,300,K.gold);label(g,'効果は即ゼロではない',0,305,K.ink,31);label(h,'休むこと自体が介入になる',0,-300,K.red,37);break;
  case'add_more_when_tired':
   officeShell(a);sitting(b,-420,115,.6,K.muted);battery(c,-420,270,300,.18,K.red);calendar(d,400,25,410,330);['副業','資格','早朝運動'].forEach((x,i)=>card(e,x,400,-80+i*100,280,K.red));rr(f,400,230,310,52,K.deep,8);label(f,'睡眠 6h → 4h',400,230,K.gold,25);label(g,'疲労なのに負荷を足す',-260,-250,K.paper,34);label(h,'季節判定を誤る',0,320,K.gold,39);break;
  case'human_low_power':
   researchBoard(a);label(b,'OUTPUT',0,-230,K.ink,30);meter(b,0,-175,700,.38,K.cyan);['競争','通知','残業'].forEach((x,i)=>{card(c,x,-420+i*420,-40,250,K.red);label(c,'OFF',-420+i*420,25,K.red,22)});['睡眠','身体','人間関係'].forEach((x,i)=>{card(d,x,-420+i*420,145,250,K.cyan);label(d,'ON',-420+i*420,210,K.cyan,22)});battery(e,0,285,420,.72,K.teal);label(f,'最低限を維持',0,-105,K.ink,29);label(g,'完全停止ではない',0,325,K.ink,30);label(h,'人間版「低電力」',0,-305,K.red,40);break;
  case'stuck_writer':
   rr(a,0,0,1920,930,'#101D27',0);desk(a,-180,190,720);laptop(b,-180,70,1.05);clock(b,650,-250,'01:00');paper(c,330,65,260,300,'原稿');label(c,'書く → 消す',330,95,K.red,25);laptop(d,-180,70,1.05,true);cc(e,650,-250,62,K.gold);label(e,'翌朝',650,-155,K.paper,26);for(let i=0;i<10;i++)ln(f,[[250+i*32,-100],[235+i*32,-40]],K.cyan,4);label(f,'シャワー',390,-125,K.cyan,23);cc(g,-40,-70,36,K.gold);label(g,'!',-40,-70,K.bg,34);label(h,'止まった後に別の形で動く',0,310,K.gold,35);break;
  case'incubation_effect':
   researchBoard(a);label(b,'2009',-500,-230,K.red,42);paper(c,-280,30,330,390,'メタ分析');card(d,'問題を脇へ',250,-90,320,K.cyan);card(e,'低負荷活動',250,35,320,K.gold);card(f,'発散思考',250,160,320,K.teal);label(g,'平均効果あり',0,285,K.ink,33);label(h,'ただし条件依存',0,-305,K.red,37);break;
  case'mental_detour':
   roadShell(a,false);for(let i=0;i<6;i++)rr(b,-10,210-i*85,80,46,i<4?K.red:K.muted,5);ln(c,[[0,40],[220,-25],[420,-115],[620,-205]],K.gold,12);label(c,'迂回路',420,-50,K.gold,27);card(d,'集中',-370,-100,230,K.red);card(e,'離れる',370,110,230,K.cyan);cc(f,620,-205,35,K.cyan);label(g,'別の連想',560,-250,K.paper,26);label(h,'翌日、別方向から到達',0,310,K.gold,38);break;
  case'creative_fallow':
   rr(a,0,0,1920,930,'#14242D',0);rr(a,-520,40,430,560,'#243841',8);rr(a,520,40,430,560,'#243841',8);label(b,'作品',-520,-230,K.paper,30);label(b,'素材',520,-230,K.paper,30);label(c,'空',-520,60,K.muted,58);['読書','映画','会話','失敗試作'].forEach((x,i)=>card(d,x,520,-110+i*100,290,i%2?K.gold:K.cyan));book(e,330,190,.55,K.gold);paper(f,690,175,180,220,'メモ');paper(g,-120,20,280,340,'次の作品');label(h,'出力ゼロでも入力は蓄積する',0,315,K.gold,36);break;
  case'career_fallow':
   researchBoard(a);paper(b,-430,40,390,500,'履歴書');rr(c,-430,35,300,130,'#F2EEE5',5,K.red);label(c,'空白',-430,35,K.red,34);['働き方','価値観','生活','関係'].forEach((x,i)=>card(d,x,250+(i%2)*340,-80+Math.floor(i/2)*140,250,i%2?K.cyan:K.gold));label(e,'情報収集',250,230,K.ink,26);label(f,'未決定',590,230,K.red,26);label(g,'前提を組み替える',0,-250,K.ink,35);label(h,'空白 = 再編成期間',0,315,K.red,39);break;
  case'foggy_crossroad':
   roadShell(a,true);card(b,'転職',-420,-80,260,K.cyan);card(b,'起業',420,-80,260,K.red);sitting(c,0,170,.45,K.paper);rr(d,0,-40,1500,450,K.fog,0).opacity(.2);ln(e,[[0,80],[0,-30],[300,-180]],K.gold,12);card(f,'第三の道',460,-220,300,K.gold);label(g,'待つ',0,280,K.paper,31);label(h,'情報が増えるまで決めない',0,-300,K.gold,38);break;
  case'real_option_factory':
   researchBoard(a);card(b,'現金 1億',-430,-150,320,K.cyan);paper(c,360,-40,420,460,'工場計画');gear(d,360,100,58,K.blue);label(e,'不可逆',360,205,K.red,30);clock(f,-430,60,'6か月');card(g,'選択権を保持',-430,220,340,K.gold);label(h,'「待つ」ことにも価値がある',0,-300,K.red,38);break;
  case'irreversible_choice':
   rr(a,0,0,1920,930,'#142630',0);['住宅','転職','起業','結婚'].forEach((x,i)=>{const xx=-570+i*380;rr(b,xx,30,250,430,'#253943',8,K.muted);rr(b,xx,70,130,250,'#12212A',4);label(b,x,xx,-210,[K.cyan,K.gold,K.red,K.teal][i],25)});person(c,-760,170,.4,K.paper);rr(d,-190,70,130,250,'#0A1319',4);label(d,'CLOSE',-190,70,K.red,22);card(e,'戻るコスト',0,285,310,K.red);label(f,'保留',570,215,K.gold,29);label(g,'扉を閉じない',570,275,K.paper,27);label(h,'不可逆ほど待つ価値が増える',0,-305,K.gold,37);break;
  case'seed_option':
   soilCut(a,false);seed(b,0,205,1.15,K.brown);sprout(c,-380,170,1.1);rr(c,-380,-10,230,120,'#5B724F',50);seed(d,380,215,.95,K.brown);card(e,'今 発芽',-380,-170,260,K.red);card(f,'休眠維持',380,-170,280,K.cyan);label(g,'環境不安定',0,-260,K.paper,31);label(h,'選択肢を土中に保存する',0,305,K.gold,38);break;
  case'wait_not_quit':
   rr(a,0,0,1920,930,'#152932',0);['A','B','C'].forEach((x,i)=>{const xx=-480+i*480;rr(b,xx,-20,280,430,'#263D47',8,K.muted);label(b,'選択肢 '+x,xx,-220,[K.cyan,K.gold,K.teal][i],25)});sitting(c,0,170,.5,K.paper);clock(d,620,-250,'--:--');label(e,'未決定',0,-105,K.red,34);label(f,'情報待ち',0,270,K.paper,28);label(g,'扉は閉じていない',0,-285,K.paper,33);label(h,'待つ ≠ 放棄',0,315,K.gold,43);break;
  case'endless_pause':
   roomShell(a,false);sitting(b,-380,120,.62,K.muted);calendar(c,430,25,350,270);['1週間','1か月','半年','1年'].forEach((x,i)=>card(d,x,430,-105+i*95,250,i===3?K.red:K.muted));for(let i=0;i<6;i++)cc(e,-120+i*70,270,4,K.muted);label(f,'部屋は同じ',-380,-210,K.paper,28);label(g,'永久停止？',410,275,K.red,35);label(h,'止まり続ければよいのか',0,-300,K.gold,40);break;
  case'wake_cues':
   winterForest(a);rr(a,0,0,8,690,K.muted,0);sitting(b,-520,155,.42,K.sand);sprout(c,0,210,.95);bug(d,520,150,.72,K.gold);cc(e,-520,-185,55,K.gold);for(let i=0;i<12;i++)ln(e,[[-170+i*30,-250],[-180+i*30,-205]],K.cyan,4);card(f,'雪解け',-520,280,230,K.cyan);card(f,'水分・温度',0,280,270,K.green);card(f,'光・温度',520,280,270,K.gold);label(g,'出口条件',0,-260,K.paper,35);label(h,'条件が変われば再び動く',0,-315,K.gold,38);break;
  case'protect_core':
   researchBoard(a);card(b,'仕事',-520,-110,250,K.red);label(b,'OFF',-520,-45,K.red,23);['睡眠','身体','生活基盤','人間関係','好奇心'].forEach((x,i)=>card(c,x,-420+(i%3)*420,75+Math.floor(i/3)*120,250,K.cyan));label(d,'ON',0,20,K.cyan,24);battery(e,520,-110,300,.67,K.teal);label(f,'守る核',520,-25,K.paper,25);label(g,'止めるものを選ぶ',0,-250,K.ink,34);label(h,'全部を止めない',0,320,K.red,40);break;
  case'restart_reserve':
   researchBoard(a);battery(b,-380,20,420,.54,K.cyan);label(b,'予備電力',-380,95,K.ink,27);gear(c,380,20,78,K.muted);card(d,'資源保存',-380,190,300,K.teal);card(e,'状態確認',380,190,300,K.gold);meter(f,380,-135,360,.72,K.cyan);label(f,'環境改善',380,-85,K.ink,24);gear(g,380,20,78,K.cyan);label(h,'再起動できる停止',0,-295,K.red,42);break;
  case'winter_with_exit':
   winterForest(a);ln(b,[[-720,240],[-420,140],[-120,110],[180,20],[520,-120]],K.gold,13);person(c,-680,190,.42,K.paper);['休職','無職','創作停滞','進路未定'].forEach((x,i)=>card(d,x,-520+i*350,285,250,i%2?K.muted:K.cyan));cc(e,650,-250,60,K.gold);sprout(f,520,-120,.75);label(g,'細い接点を残す',0,-250,K.paper,32);label(h,'冬に「出口」を残す',0,-310,K.gold,42);break;
  case'return_room':
   roomShell(a,true);clock(b,700,-260,'14:00');phone(c,-535,210,.4);rr(c,-535,210,100,10,K.red,3);windowFrame(d,560,-130,430,270,'#8AA7AF');mug(e,320,185,.75,K.paper);book(e,430,175,.48,K.gold);person(f,-380,120,.55,K.paper);ln(f,[[-380,200],[-650,260]],K.gold,7);tinyPlant(g,-60,210);label(h,'成果は少なくても、状態は保たれる',0,-300,K.gold,35);break;
  case'invisible_work':
   rr(a,0,-130,1920,610,'#1C3038',0);rr(a,0,240,1920,350,K.soil,0);label(b,'地上：静か',-590,-210,K.muted,28);for(let i=0;i<4;i++)seed(c,-520+i*150,230,.7,K.brown);rr(d,330,235,420,170,'#251F1B',90);sitting(d,330,220,.35,K.sand);for(let i=0;i<6;i++)cc(e,560+i*35,255+(i%2)*30,14,K.cyan);label(f,'外から見れば 0',0,-110,K.red,31);label(g,'内部では保存が続く',0,95,K.paper,31);label(h,'見えない仕事',0,-300,K.gold,43);break;
  case'old_identity_box':
   roomShell(a,true);rr(b,300,180,430,230,K.brown,12);card(c,'社員証',-520,-90,250,K.cyan);book(c,-520,70,.5,K.gold);paper(d,-260,20,230,300,'昔の目標');label(e,'箱へ',300,90,K.paper,30);rr(f,560,-95,350,230,'#1A303B',4,K.muted);label(f,'壁：空白',560,-95,K.muted,29);label(g,'次の目標は貼らない',0,295,K.paper,31);label(h,'古い自分が終わるのを待つ',0,-300,K.gold,37);break;
  case'four_disciplines':
   researchBoard(a);['冬眠','心理的離脱','インキュベーション','リアル・オプション'].forEach((x,i)=>card(b,x,-490+(i%2)*980,-120+Math.floor(i/2)*180,380,[K.ice,K.cyan,K.gold,K.red][i]));label(c,'別の研究領域',0,-245,K.ink,31);rr(d,0,210,880,105,'#D9D2C7',18,K.muted);label(d,'活動し続けることだけが合理的ではない',0,210,K.ink,27);label(e,'保存',-300,300,K.cyan,25);label(f,'離脱',-100,300,K.gold,25);label(g,'待機',100,300,K.teal,25);label(g,'選択肢',320,300,K.red,25);label(h,'共通する発想',0,-305,K.red,40);break;
  case'four_seasons':
   rr(a,0,0,1920,930,'#10242D',0);const cs=[K.green,K.gold,K.orange,K.ice];['春 成長','夏 活動','秋 蓄積','冬 停止'].forEach((x,i)=>{const ang=-Math.PI/2+i*Math.PI/2,xx=Math.cos(ang)*430,yy=Math.sin(ang)*230;cc(b,xx,yy,92,cs[i]);label(b,x,xx,yy,K.bg,24)});cc(c,0,0,110,K.deep);label(c,'人生',0,0,K.paper,31);label(d,'×',0,230,K.red,95);rr(e,0,230,150,110,K.deep,20);label(f,'停止も季節の一部',0,305,K.paper,30);label(g,'次の季節へ保存する',0,-255,K.gold,34);label(h,'「何もしない時期」は空白ではない',0,-315,K.paper,37);break;
  default:
   researchBoard(a);card(b,L[0],-420,-80,320,K.cyan);card(c,L[1],420,-80,320,K.gold);card(d,L[3],-420,120,320,K.paper);card(e,L[4],420,120,320,K.red);label(f,L[5],0,-245,K.ink,31);label(g,L[6],0,285,K.ink,31);label(h,L[7],0,-305,K.red,38);
 }
 return s;
}

function offsetFor(scene:Scene,i:number):[number,number,number]{
 const p=hash(scene.motif)%8;const mag=34+(i%3)*14;
 switch(p){case 0:return[i%2?mag:-mag,0,.94];case 1:return[0,i%2?mag:-mag,.94];case 2:return[i%2?mag:-mag,i%3?18:-18,.9];case 3:return[0,0,.82];case 4:return[i<4?-mag:mag,i%2?18:-18,.92];case 5:return[i%3===0?mag:0,i%2?mag:-mag,.95];case 6:return[i%2?-mag:mag,i<4?-20:20,.9];default:return[0,i<4?mag:-mag,.88]}
}
function settleTarget(scene:Scene,plan:Plan,i:number):{x:number;y:number;r:number;s:number;opacity:number}{
 let x=0,y=0,r=0,s=1.012,opacity=1;const h=hash(scene.motif+plan.motion+i);
 if(plan.motion.includes('overload')){x=(i-3.5)*5;r=(i%2?1:-1)*(2+i*.45);s=1.018}
 else if(plan.motion.includes('descent')){y=i>=2?8+i*2:0;s=i>4?.99:1.012}
 else if(plan.motion.includes('season')){x=(i%2?1:-1)*((h%8)+3);opacity=i<3?.84:1}
 else if(plan.motion.includes('partial')){opacity=i===4?.55:1;y=i>4?-6:0}
 else if(plan.motion.includes('calendar')){opacity=i<6?.82:1}
 else if(plan.motion.includes('hidden')){y=i>=3?10:0;s=1.018}
 else if(plan.motion.includes('cycle')||plan.motion.includes('complete')){r=(i%2?1:-1)*1.6;s=1.02}
 else if(plan.motion.includes('traffic')||plan.motion.includes('detour')){x=i>2?(i%2?10:-10):0}
 else if(plan.motion.includes('doors')){s=i<4?.985:1.02;opacity=i<2?.8:1}
 else if(plan.motion.includes('wait')||plan.motion.includes('option')){y=i>4?-7:0;s=1.016}
 else{x=((h%11)-5)*1.3;y=(((h>>4)%9)-4)*1.1;r=((h>>7)%5-2)*.35}
 return{x,y,r,s,opacity};
}
function* microStageFlow(stages:Node[],scene:Scene,plan:Plan):ThreadGenerator{
 const base=[.015,.12,.225,.33,.435,.54,.645,.75];let cursor=0;
 for(let i=0;i<8;i++){
  const [ox,oy,os]=offsetFor(scene,i);stages[i].x(ox);stages[i].y(oy);stages[i].scale(os);stages[i].rotation(i%2?1.2:-1.2);
  const jitter=((hash(scene.motif+i.toString())>>3)&7)*.002;const at=scene.duration*Math.min(.82,base[i]+jitter);
  if(at>cursor)yield* waitFor(at-cursor);cursor=at;
  const reveal=Math.min(.52,Math.max(.2,scene.duration*.016));
  yield* all(stages[i].opacity(1,reveal),stages[i].x(0,reveal),stages[i].y(0,reveal),stages[i].scale(1,reveal),stages[i].rotation(0,reveal));cursor+=reveal;
  const target=settleTarget(scene,plan,i);const settle=Math.min(.44,Math.max(.18,scene.duration*.014));
  yield* all(stages[i].x(target.x,settle),stages[i].y(target.y,settle),stages[i].rotation(target.r,settle),stages[i].scale(target.s,settle),stages[i].opacity(target.opacity,settle));cursor+=settle;
  if(i>=3){const old=stages[i-3];old.opacity(plan.motion.includes('calendar')?.45:.74)}
 }
 const end=scene.duration*.9;if(end>cursor){yield* waitFor(end-cursor);cursor=end}
 yield* all(stages[7].scale(1.035,.36),stages[6].opacity(.88,.36));cursor+=.36;
 if(scene.duration>cursor)yield* waitFor(scene.duration-cursor);
}
function* cameraFlow(node:Node,duration:number,motif:string):ThreadGenerator{
 const p=hash(motif)%6;const dx=[14,-16,10,-10,18,-14][p],dy=[-6,8,7,-8,3,-4][p];
 node.scale(1.008);const q=duration/4;
 yield* all(node.x(dx,q),node.y(dy,q),node.scale(1.014,q));
 yield* all(node.x(-dx*.55,q),node.y(-dy*.6,q),node.scale(1.02,q));
 yield* all(node.x(dx*.35,q),node.y(dy*.25,q),node.scale(1.012,q));
 yield* all(node.x(0,Math.max(.01,duration-3*q)),node.y(0,Math.max(.01,duration-3*q)),node.scale(1.008,Math.max(.01,duration-3*q)));
}
function* subtitleFlow(cues:Cue[],caption:Txt,duration:number):ThreadGenerator{let t=0;for(const c of cues){if(c.start>t)yield* waitFor(c.start-t);caption.text(c.display);t=c.start}if(duration>t)yield* waitFor(duration-t);caption.text('')}

export function* playMeaningScene(view:View2D,scene:Scene):ThreadGenerator{
 const plan=(visualPlan as Record<string,Plan>)[scene.motif];if(!plan)throw new Error('V122 visual plan missing: '+scene.motif);
 view.fill(K.bg);const contentLayer=new Node({});const headingLayer=new Node({});const subtitleBacking=new Node({});const subtitleTextLayer=new Node({});
 view.add(contentLayer);view.add(headingLayer);view.add(subtitleBacking);view.add(subtitleTextLayer);
 const stages=buildScene(contentLayer,scene,plan);
 rr(headingLayer,0,-474,1920,132,'#071019',0);const part=scene.chapter==='prologue'?'PROLOGUE':scene.chapter==='epilogue'?'EPILOGUE':scene.chapter.toUpperCase();
 headingLayer.add(tx(part,-800,-508,22,K.gold,700));headingLayer.add(tx(scene.id,830,-508,21,K.muted,600));headingLayer.add(tx(scene.title,0,-452,scene.title.length>35?29:scene.title.length>23?34:43,K.paper,700));
 rr(subtitleBacking,0,460,1920,170,'#02060B',0).opacity(.93);const caption=tx('',0,458,41,K.paper,650);caption.lineHeight(58);subtitleTextLayer.add(caption);
 yield* all(microStageFlow(stages,scene,plan),cameraFlow(contentLayer,scene.duration,scene.motif),subtitleFlow(scene.cues,caption,scene.duration));
}
