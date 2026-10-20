import '@fontsource/noto-sans-jp/400.css';
import '@fontsource/noto-sans-jp/700.css';
import {Circle, Line, Node, Rect, Txt, type View2D} from '@motion-canvas/2d';
import {all, waitFor, type ThreadGenerator} from '@motion-canvas/core';
import visualPlan from '../../content/visual_plan.json';

type Cue={text:string;display:string;start:number;end:number};
type Scene={id:string;chapter:string;motif:string;title:string;narration:string;cues:Cue[];duration:number};
type Plan={kind:string;motion:string;labels:string[];program:number;camera:number;variant:number};
const F='Noto Sans JP, Noto Sans CJK JP, sans-serif';
const K={bg:'#071015',deep:'#101A22',panel:'#16242D',panel2:'#1C2D37',paper:'#F2EEE6',muted:'#98A6AE',red:'#C35660',red2:'#7E3137',gold:'#D1AE69',blue:'#5D8FB8',cyan:'#65AAB0',jade:'#6FA58C',orange:'#B7784D',violet:'#8378A6',ink:'#05090D',steel:'#41505B',floor:'#26323A',green:'#5D7F63'};
export const V131_SCENE_COUNT=90;
export const MOTION_PROGRAMS=18;
const hash=(s:string)=>[...s].reduce((a,c)=>((a*33)^c.charCodeAt(0))>>>0,131);
function rr(p:Node,x:number,y:number,w:number,h:number,fill:string,r=8,stroke?:string){const q=new Rect({x,y,width:w,height:h,fill,radius:r,stroke:stroke??fill,lineWidth:stroke?2:0});p.add(q);return q}
function cc(p:Node,x:number,y:number,r:number,fill:string,stroke?:string){const q=new Circle({x,y,width:r*2,height:r*2,fill,stroke:stroke??fill,lineWidth:stroke?2:0});p.add(q);return q}
function ln(p:Node,pts:[number,number][],col=K.muted,w=5){const q=new Line({points:pts,stroke:col,lineWidth:w,lineCap:'round',lineJoin:'round'});p.add(q);return q}
function tx(p:Node,s:string,x:number,y:number,sz=28,col=K.paper,w=700){const q=new Txt({text:s,x,y,fontFamily:F,fontSize:sz,fill:col,fontWeight:w});p.add(q);return q}
function pill(p:Node,s:string,x:number,y:number,w=300,col=K.gold){rr(p,x,y,w,66,K.deep,10,col);tx(p,s,x,y,20,col)}
function person(p:Node,x:number,y:number,s=.55,col=K.paper){const g=new Node({x,y,scale:s});p.add(g);cc(g,0,-62,24,col);rr(g,0,20,58,116,col,16);ln(g,[[-18,-5],[-56,55]],col,10);ln(g,[[18,-5],[56,55]],col,10);ln(g,[[-18,80],[-28,150]],col,12);ln(g,[[18,80],[28,150]],col,12);return g}
function desk(p:Node,x:number,y:number,w=620){rr(p,x,y,w,26,'#66513F',4);ln(p,[[x-w*.4,y+13],[x-w*.4,y+125]],'#8B735B',8);ln(p,[[x+w*.4,y+13],[x+w*.4,y+125]],'#8B735B',8)}
function monitor(p:Node,x:number,y:number,w=440,h=250){rr(p,x,y,w,h,'#0A1117',8,K.steel);rr(p,x,y,w-28,h-28,'#12232D',5);ln(p,[[x,y+h/2],[x,y+h/2+55]],K.steel,8);rr(p,x,y+h/2+70,150,14,K.steel,3)}
function bar(p:Node,x:number,y:number,w:number,v:number,col:string,label:string){rr(p,x,y,w,28,K.floor,5);rr(p,x-w*(1-v)/2,y,Math.max(10,w*v),28,col,5);tx(p,label,x,y-34,18,col)}
function folder(p:Node,x:number,y:number,s:string,col=K.gold){rr(p,x,y,300,170,'#D5C5A7',6,col);rr(p,x-90,y-98,110,34,'#D5C5A7',4,col);tx(p,s,x,y,22,K.ink)}
function arrow(p:Node,a:[number,number],b:[number,number],col=K.gold,w=6){ln(p,[a,b],col,w);cc(p,b[0],b[1],8,col)}
function backdrop(root:Node,scene:Scene,plan:Plan){const seed=hash(scene.motif),pal=['#071015','#09131A','#0B141B','#0D1519','#101518','#111318'];rr(root,0,0,1920,930,pal[seed%pal.length],0);rr(root,0,335,1920,3,K.floor,0);const n=3+(seed%5);for(let i=0;i<n;i++){const x=-820+i*(1640/Math.max(1,n-1));const h=80+((seed+i*71)%180);rr(root,x,-260+h/2,120,h,'#101C24',4,'#20303A');}for(let i=0;i<5;i++)cc(root,-760+((seed+i*193)%1520),-350+((seed+i*67)%90),2+(i%2),i%2?K.gold:K.muted);tx(root,'V131 / '+scene.id,820,315,14,K.muted,500);tx(root,plan.kind.toUpperCase(),-780,315,13,K.muted,500)}
function stages(){return Array.from({length:8},()=>new Node({opacity:0}));}
function graphAxes(p:Node,x=0,y=0,w=900,h=430){ln(p,[[x-w/2,y+h/2],[x-w/2,y-h/2]],K.muted,3);ln(p,[[x-w/2,y+h/2],[x+w/2,y+h/2]],K.muted,3)}

function draw(root:Node,scene:Scene,plan:Plan):Node[]{
 backdrop(root,scene,plan);const s=stages();s.forEach(n=>root.add(n));const[a,b,c,d,e,f,g,h]=s,L=plan.labels,v=plan.variant;
 switch(plan.kind){
 case'rankingFloor':monitor(a,0,-70,760,390);for(let i=0;i<5;i++){bar(b,0,-190+i*78,570,[.96,.71,.62,.48,.41][i],[K.gold,K.blue,K.jade,K.muted,K.steel][i],i===0?'佐藤 140%':'社員 '+(i+1));}cc(c,405,-215,34,K.gold);tx(c,'★',405,-215,35,K.ink);person(d,-610,90,.48,K.paper);pill(e,'月曜 9:03',590,230,240,K.muted);tx(f,'売上ランキング',0,-315,34,K.paper);arrow(g,[-470,120],[-270,40],K.gold);pill(h,L[2],-520,250,290,K.gold);break;
 case'promotionDoor':rr(a,330,5,360,570,'#111A20',6,K.gold);rr(b,330,20,250,450,'#0B1115',4);cc(b,420,20,10,K.gold);person(c,-390,80,.62,K.paper);person(d,-70,60,.52,K.gold);folder(e,-230,-150,'昇進通知',K.gold);arrow(f,[-180,60],[180,60],K.gold,8);pill(g,L[1],400,-260,320,K.gold);pill(h,L[3],-470,260,330,K.jade);break;
 case'lossSplit':rr(a,-430,0,760,560,K.deep,18,K.blue);rr(b,430,0,760,560,K.deep,18,K.red);monitor(c,-430,-70,520,300);bar(c,-430,-120,360,.88,K.blue,'旧担当');bar(c,-430,5,360,.52,K.red,'後任');for(let i=0;i<5;i++)person(d,160+i*135,70,.28,i===0?K.red:K.paper);ln(e,[[0,-275],[0,275]],K.gold,5);arrow(f,[-430,150],[-430,250],K.red);arrow(g,[430,-70],[430,190],K.red);pill(h,'二つの損失',0,-300,300,K.gold);break;
 case'micromanageDesk':desk(a,0,150,1180);person(b,-520,20,.48,K.gold);for(let i=0;i<4;i++)folder(c,-180+i*210,60,['提案','見積','メール','報告'][i],i%2?K.red:K.blue);ln(d,[[-330,0],[-250,-40],[-170,20],[-90,-15]],K.red,7);tx(e,'修正',50,-140,60,K.red);arrow(f,[-440,20],[-160,20],K.red);pill(g,L[2],460,-220,320,K.red);pill(h,L[3],420,250,350,K.muted);break;
 case'handoffTable':desk(a,0,140,1050);person(b,-420,15,.5,K.blue);person(c,420,15,.5,K.gold);rr(d,-350,-150,460,150,K.deep,18,K.blue);tx(d,'顧客への説明…',-350,-150,22,K.paper);arrow(e,[-120,-120],[190,-120],K.gold,9);rr(f,360,-150,440,150,K.deep,18,K.gold);tx(f,'ここから私が',360,-150,22,K.paper);pill(g,'主導権が移る',0,260,320,K.red);cc(h,-420,-70,22,K.blue);break;
 case'bottleneck':tx(a,'1時間',-430,-180,62,K.jade);tx(b,'3時間',430,-180,62,K.red);for(let i=0;i<3;i++)rr(c,-540+i*110,20,78,220-i*45,K.jade,8);for(let i=0;i<7;i++)rr(d,120+i*95,20,62,70+(i%3)*55,K.red,8);ln(e,[[-40,-280],[-40,280]],K.gold,5);cc(f,0,180,55,K.gold);tx(f,'待',0,180,28,K.ink);pill(g,'自分でやる誘惑',0,-290,350,K.gold);pill(h,L[3],0,280,280,K.muted);break;
 case'nightOffice':rr(a,0,-70,1500,570,'#091219',12);for(let i=0;i<6;i++)rr(a,-600+i*240,-185,150,210,'#101D26',3);desk(b,0,155,760);person(c,-80,25,.5,K.paper);monitor(d,210,-70,370,220);folder(e,-310,30,'部下の資料',K.red);cc(f,520,-210,70,K.deep,K.gold);tx(f,'23:00',520,-210,26,K.gold);rr(g,-30,-95,300,24,K.gold,4);pill(h,L[1],-510,250,310,K.muted);break;
 case'dualLoss':cc(a,0,-130,62,K.gold);ln(a,[[0,-70],[0,165]],K.gold,9);ln(b,[[-500,-30],[500,-30]],K.gold,9);rr(c,-500,110,560,220,K.deep,18,K.blue);rr(d,500,110,560,220,K.deep,18,K.red);tx(c,'エースを失う',-500,110,28,K.blue);tx(d,'管理で波及',500,110,28,K.red);person(e,-500,-105,.34,K.blue);for(let i=0;i<4;i++)person(f,300+i*130,-80,.24,K.paper);arrow(g,[-500,-40],[-500,170],K.red);arrow(h,[500,-40],[500,170],K.red);break;
 case'playerCoach':rr(a,0,0,1550,590,'#13231B',22,K.green);ln(a,[[-760,0],[760,0]],'#9DB6A0',4);person(b,-420,80,.55,K.paper);cc(c,-330,195,30,K.paper);rr(d,460,90,400,210,'#26231F',10);person(e,460,0,.5,K.gold);folder(f,460,-170,'作戦',K.gold);arrow(g,[-250,70],[240,70],K.red);pill(h,'選手 ≠ 監督',0,-285,340,K.gold);break;
 case'questionDesk':desk(a,0,185,1150);folder(b,-360,20,L[1],K.blue);folder(c,0,20,L[2],K.red);folder(d,360,20,L[3],K.gold);cc(e,0,-170,120,K.deep,K.gold);tx(e,'？',0,-170,120,K.gold);ln(f,[[-360,110],[0,-60],[360,110]],K.muted,4);pill(g,L[0],0,-310,620,K.paper);cc(h,0,260,13,K.gold);break;
 case'factoryShift':for(let i=0;i<5;i++)rr(a,-650+i*325,20,240,330,'#26333A',10,K.steel);for(let i=0;i<12;i++)person(b,-720+i*130,185,.18,K.paper);for(let i=0;i<5;i++)cc(c,-650+i*325,-70,44,K.orange);ln(d,[[-800,260],[800,260]],K.gold,8);tx(e,'数十人 → 数千人',0,-275,42,K.gold);person(f,0,-10,.38,K.red);arrow(g,[0,-60],[0,-200],K.red);pill(h,L[3],520,255,320,K.muted);break;
 case'hierarchyTower':for(let i=0;i<5;i++){const w=1050-i*145;rr(a,0,190-i*105,w,78,[K.steel,K.blue,K.jade,K.gold,K.red][i],8);tx(b,['社員','主任','課長','部長','役員'][i],0,190-i*105,20,K.ink);}arrow(c,[620,200],[620,-230],K.gold,9);person(d,-650,210,.3,K.paper);person(e,-650,-210,.3,K.red);pill(f,'階層化',510,-270,250,K.gold);ln(g,[[-520,120],[-520,-180]],K.muted,4);cc(h,620,-230,18,K.gold);break;
 case'archiveBook':rr(a,-220,0,620,520,'#D8CBAE',16,K.gold);rr(a,120,0,8,520,K.gold,2);tx(b,L[1],-250,-150,30,K.ink);tx(c,L[2],-250,-30,26,K.red);tx(d,L[3],-250,90,24,K.blue);folder(e,480,-90,'ARCHIVE',K.gold);ln(f,[[155,-140],[360,-90]],K.gold,5);pill(g,'制度の歴史',455,180,320,K.paper);cc(h,-510,220,16,K.red);break;
 case'tournamentLadder':for(let i=0;i<5;i++){rr(a,-500+i*250,180-i*90,180,60,K.floor,6,[K.blue,K.jade,K.gold,K.orange,K.red][i]);}person(b,-500,90,.3,K.paper);person(c,500,-260,.3,K.gold);arrow(d,[-420,120],[430,-220],K.gold,8);pill(e,'努力',-420,-220,210,K.blue);pill(f,'昇進',0,-220,210,K.jade);pill(g,'高い報酬',420,-220,250,K.gold);tx(h,'賞品が競争を作る',0,285,28,K.paper);break;
 case'peterStairs':for(let i=0;i<6;i++)rr(a,-600+i*210,210-i*78,190,64,i===5?K.red:K.floor,5);for(let i=0;i<5;i++)person(b,-600+i*210,115-i*78,.22,K.paper);person(c,450,-270,.28,K.red);arrow(d,[-520,160],[410,-245],K.gold,8);pill(e,'成功',-480,-250,200,K.jade);pill(f,'昇進',0,-250,200,K.gold);pill(g,'不適合',470,-250,230,K.red);cc(h,450,-200,18,K.red);break;
 case'collapseRebuild':for(let i=0;i<5;i++)rr(a,0,210-i*95,780-i*90,70,i===4?K.red:K.steel,6);person(b,0,-245,.3,K.paper);ln(c,[[-250,-140],[250,-140]],K.red,7);arrow(d,[0,-80],[0,180],K.red,9);pill(e,L[1],-420,255,300,K.blue);pill(f,L[2],0,255,300,K.gold);pill(g,L[3],420,255,300,K.red);cc(h,0,-140,24,K.red);break;
 case'datasetCloud':graphAxes(a,0,20,1200,520);for(let i=0;i<36;i++){const x=-530+(i%12)*95,y=180-Math.floor(i/12)*140-((hash(scene.id+i.toString())%65));cc(b,x,y,9,i%7===0?K.gold:K.blue);}tx(c,'38,843',520,-230,48,K.gold);tx(d,'131社',520,-155,28,K.paper);folder(e,-480,-235,'2005–2011',K.jade);arrow(f,[-350,-190],[-120,-80],K.gold);pill(g,L[1],0,285,350,K.paper);cc(h,540,215,18,K.red);break;
 case'promotionSlope':graphAxes(a,0,20,1050,500);for(let i=0;i<14;i++){const x=-430+i*68,y=170-i*24+(i%3)*28;cc(b,x,y,10,K.blue);}ln(c,[[-430,165],[450,-180]],K.gold,7);tx(d,'営業成績',0,275,22,K.paper);tx(e,'昇進確率',-610,-40,22,K.paper);arrow(f,[280,20],[450,-180],K.gold);pill(g,'正の関係',430,-260,240,K.jade);cc(h,-430,165,18,K.blue);break;
 case'spotlightMetric':rr(a,-350,0,640,520,K.deep,18,K.gold);tx(b,'140%',-350,-70,110,K.gold);tx(c,'売上',-350,65,32,K.paper);for(let i=0;i<4;i++)pill(d,['育成','調整','傾聴','任せる'][i],250+(i%2)*300,-100+Math.floor(i/2)*150,240,K.muted);cc(e,-350,-70,180,'#00000000',K.gold);ln(f,[[-20,-250],[-20,250]],K.floor,4);pill(g,'見える',-350,220,220,K.gold);pill(h,'見えにくい',400,220,260,K.muted);break;
 case'managerScatter':graphAxes(a,0,20,1150,520);for(let i=0;i<22;i++){const x=-470+i*43,y=-160+i*13+((i%4)-2)*38;cc(b,x,y,10,i%5===0?K.red:K.blue);}ln(c,[[-470,160],[450,-120]],K.red,7);tx(d,'本人の売上 →',150,285,22,K.paper);tx(e,'部下の成果',-620,-70,22,K.paper);pill(f,'逆方向',420,-260,240,K.red);arrow(g,[340,-40],[440,-115],K.red);cc(h,-470,160,17,K.gold);break;
 case'evidenceBoard':rr(a,0,0,1250,520,K.deep,22,K.gold);tx(b,L[1],-350,-120,28,K.blue);tx(c,L[2],0,-120,28,K.paper);tx(d,L[3],350,-120,28,K.red);tx(e,plan.variant%2===0?'6.1%':'0.22SD',0,55,100,K.gold);ln(f,[[-420,150],[420,150]],K.floor,5);pill(g,'論文で確認',0,235,280,K.jade);cc(h,0,55,145,'#00000000',K.gold);break;
 case'teamRipple':person(a,0,-70,.55,K.gold);for(let i=0;i<5;i++){const x=-520+i*260;person(b,x,150,.28,K.paper);ln(c,[[0,10],[x,105]],i%2?K.blue:K.jade,4);}for(let i=0;i<5;i++)cc(d,-520+i*260,260,18,i%2?K.blue:K.jade);pill(e,'一人の判断',-360,-250,280,K.gold);arrow(f,[-190,-210],[0,-130],K.gold);pill(g,'五人へ波及',370,-250,280,K.red);tx(h,L[0],0,300,24,K.paper);break;
 case'counterfactualSwitch':ln(a,[[-700,-120],[700,-120]],K.blue,10);ln(b,[[-700,120],[700,120]],K.gold,10);cc(c,-420,-120,30,K.blue);cc(c,420,120,30,K.gold);arrow(d,[-100,-120],[120,120],K.red,8);pill(e,'現行：売上',-420,-220,280,K.blue);pill(f,'別案：管理適性',420,220,330,K.gold);rr(g,0,0,180,220,K.deep,14,K.red);tx(g,'SWITCH',0,0,22,K.red);cc(h,0,0,20,K.red);break;
 case'hrCards':rr(a,-420,0,650,530,K.deep,20,K.blue);rr(b,420,0,650,530,K.deep,20,K.gold);tx(c,'A',-420,-180,58,K.blue);tx(d,'B',420,-180,58,K.gold);tx(c,'売上トップ',-420,-80,28,K.paper);tx(d,'協働・育成',420,-80,28,K.paper);bar(e,-420,70,420,.95,K.blue,'売上');bar(f,420,70,420,.64,K.gold,'売上');pill(g,'どちらを課長に？',0,260,420,K.red);cc(h,0,-260,18,K.gold);break;
 case'skillShadow':rr(a,-450,0,620,500,K.deep,18,K.gold);tx(b,'見える',-450,-190,30,K.gold);['売上','件数','達成率'].forEach((x,i)=>pill(c,x,-450,-80+i*105,260,K.blue));rr(d,450,0,620,500,'#0A0F13',18,K.steel);tx(e,'見えにくい',450,-190,30,K.muted);['傾聴','調整','育成'].forEach((x,i)=>tx(f,x,450,-80+i*105,25,K.muted));ln(g,[[0,-240],[0,240]],K.floor,4);pill(h,'重要 ≠ 測りやすい',0,290,390,K.red);break;
 case'allocationBoard':for(let i=0;i<4;i++)person(a,-570+i*190,-120,.24,[K.blue,K.jade,K.gold,K.red][i]);for(let i=0;i<4;i++)rr(b,-570+i*380,125,250,120,K.deep,12,[K.blue,K.jade,K.gold,K.red][i%4]);for(let i=0;i<4;i++)arrow(c,[-570+i*190,-40],[-570+i*380,65],[K.blue,K.jade,K.gold,K.red][i]);pill(d,'誰に',-430,-270,210,K.blue);pill(e,'何を',0,-270,210,K.gold);pill(f,'いつ任せる',430,-270,280,K.jade);tx(g,'配置が成果を変える',0,285,27,K.paper);cc(h,0,120,20,K.gold);break;
 case'delegation':person(a,-430,30,.48,K.gold);person(b,430,30,.48,K.blue);folder(c,-180,20,'TASK',K.gold);arrow(d,[-60,20],[250,20],K.gold,9);rr(e,430,-170,300,90,K.deep,12,K.blue);tx(e,'自分でやる',430,-170,20,K.paper);ln(f,[[300,-170],[560,-170]],K.red,6);pill(g,'任せて待つ',0,260,300,K.jade);cc(h,250,20,20,K.gold);break;
 case'filterGate':pill(a,'現在の成果',-560,-40,350,K.blue);arrow(b,[-350,-40],[-120,-40],K.gold,8);rr(c,0,-40,220,260,K.deep,16,K.gold);tx(c,'評価',0,-40,40,K.gold);arrow(d,[120,-40],[350,-40],K.red,8);pill(e,'次の適性',560,-40,330,K.red);tx(f,'代用品にしていないか',0,220,29,K.paper);cc(g,0,-40,135,'#00000000',K.gold);pill(h,L[0],0,-280,460,K.muted);break;
 case'leverDual':ln(a,[[0,-160],[0,175]],K.gold,12);ln(b,[[-520,-80],[520,-80]],K.gold,12);cc(c,0,-80,38,K.gold);rr(d,-500,120,600,220,K.deep,18,K.blue);rr(e,500,120,600,220,K.deep,18,K.red);tx(d,'報酬',-500,120,38,K.blue);tx(e,'配置',500,120,38,K.red);pill(f,'昇進',0,-250,260,K.gold);arrow(g,[0,-40],[-390,60],K.blue);arrow(h,[0,-40],[390,60],K.red);break;
 case'splitTrack':ln(a,[[-700,150],[-180,40],[0,-20]],K.gold,10);ln(b,[[0,-20],[330,-180],[700,-180]],K.blue,10);ln(c,[[0,-20],[330,180],[700,180]],K.jade,10);cc(d,0,-20,30,K.gold);pill(e,'管理職',520,-250,270,K.blue);pill(f,'専門職',520,250,270,K.jade);pill(g,'同じ成功',-470,-220,300,K.gold);tx(h,'道を分ける',0,295,27,K.paper);break;
 case'coderCalendar':monitor(a,-430,-60,520,300);for(let i=0;i<5;i++)ln(b,[[-620,-140+i*55],[-300+(i%2)*80,-140+i*55]],i%2?K.cyan:K.jade,5);rr(c,390,-30,650,440,K.deep,18,K.red);for(let i=0;i<4;i++){rr(d,180+(i%2)*280,-140+Math.floor(i/2)*160,240,100,K.panel2,9,K.red);tx(d,['1on1','採用','会議','評価'][i],180+(i%2)*280,-140+Math.floor(i/2)*160,20,K.paper);}arrow(e,[-100,-20],[60,-20],K.gold);person(f,-650,170,.3,K.paper);person(g,660,170,.3,K.gold);pill(h,'職種が変わる',0,280,320,K.red);break;
 case'incentiveFork':person(a,-650,50,.35,K.paper);arrow(b,[-520,20],[-90,-120],K.blue,8);arrow(c,[-520,80],[-90,150],K.gold,8);rr(d,300,-140,600,190,K.deep,16,K.blue);rr(e,300,150,600,190,K.deep,16,K.gold);tx(d,'良い管理職を選ぶ',300,-140,26,K.blue);tx(e,'今の努力を促す',300,150,26,K.gold);pill(f,'両方欲しい',-270,-260,300,K.red);ln(g,[[0,-35],[0,45]],K.red,6);cc(h,-90,15,28,K.red);break;
 case'selfSelect':for(let i=0;i<6;i++)person(a,-620+i*240,120,.28,i===v?K.gold:K.paper);for(let i=0;i<6;i++)if(i===v)arrow(b,[-620+i*240,35],[-620+i*240,-125],K.gold,7);pill(c,'管理職をやりたい',-350,-250,360,K.gold);pill(d,'希望の強さ',350,-250,300,K.blue);for(let i=0;i<6;i++)rr(e,-620+i*240,245,150,20,i===v?K.gold:K.floor,3);cc(f,-620+v*240,-170,28,K.gold);tx(g,'自己推薦',0,300,25,K.paper);pill(h,L[3],430,250,300,K.red);break;
 case'experimentTeams':for(let t=0;t<3;t++){const x=-520+t*520;rr(a,x,40,430,420,K.deep,18,[K.blue,K.gold,K.jade][t]);person(b,x,-60,.3,K.gold);person(c,x-100,120,.23,K.paper);person(c,x+100,120,.23,K.paper);tx(d,'TEAM '+(t+1),x,-175,22,K.muted);}arrow(e,[-520,-10],[0,-10],K.gold);arrow(f,[0,-10],[520,-10],K.gold);pill(g,'555人',-520,275,220,K.blue);pill(h,'管理職を比較',420,275,320,K.gold);break;
 case'teamRotation':for(let t=0;t<4;t++){const x=-600+t*400;rr(a,x,80,330,320,K.deep,15,[K.blue,K.jade,K.gold,K.red][t]);for(let j=0;j<2;j++)person(b,x-55+j*110,125,.2,K.paper);}person(c,-600,-70,.3,K.gold);arrow(d,[-500,-80],[-210,-80],K.gold);arrow(e,[-100,-80],[190,-80],K.gold);arrow(f,[300,-80],[590,-80],K.gold);pill(g,'同じ管理職',0,-250,320,K.gold);pill(h,'複数チーム',0,285,300,K.paper);break;
 case'dualCareer':ln(a,[[-650,160],[-150,20]],K.gold,9);ln(b,[[-150,20],[370,-170],[700,-170]],K.blue,9);ln(c,[[-150,20],[370,190],[700,190]],K.jade,9);person(d,-650,90,.3,K.paper);pill(e,'MANAGER',520,-245,300,K.blue);pill(f,'EXPERT',520,260,300,K.jade);tx(g,'報酬も地位も両方上がる',0,-290,29,K.paper);cc(h,-150,20,28,K.gold);break;
 case'pilotProject':rr(a,0,30,1150,500,K.deep,20,K.gold);for(let i=0;i<4;i++)person(b,-360+i*240,80,.27,i===0?K.gold:K.paper);folder(c,-360,-120,'小規模PJ',K.gold);for(let i=0;i<3;i++)bar(d,220,-120+i*100,420,[.4,.62,.78][i],[K.blue,K.jade,K.gold][i],['開始','中間','終了'][i]);arrow(e,[-240,-80],[50,-80],K.gold);pill(f,'まず試す',-390,245,250,K.blue);pill(g,'周囲の成果を見る',300,245,360,K.jade);cc(h,470,-120,18,K.gold);break;
 case'branchingCareer':ln(a,[[-720,180],[-220,30],[0,-20]],K.gold,10);const ys=[-230,-75,80,235];const cs=[K.blue,K.gold,K.jade,K.red];for(let i=0;i<4;i++){ln(b,[[0,-20],[360,ys[i]],[700,ys[i]]],cs[i],7);pill(c,['管理','専門','企画','教育'][i],540,ys[i],240,cs[i]);}person(d,-720,105,.3,K.paper);cc(e,0,-20,32,K.gold);pill(f,'一本ではない',-420,-260,300,K.gold);tx(g,'複数の成功経路',0,300,27,K.paper);cc(h,700,ys[v%4],18,cs[v%4]);break;
 default:throw new Error('V131 missing layout '+plan.kind);
 }
 return s;
}
function initStage(n:Node,i:number,p:number,v:number){const side=(i+v)%2?1:-1;const amt=55+((i*17+p*11)%95);n.opacity(0);n.scale(.9+((i+p)%4)*.02);if(p%4===0){n.x(side*amt);n.y(0)}else if(p%4===1){n.x(0);n.y(side*amt)}else if(p%4===2){n.x(side*amt);n.y(side*(20+(i%3)*15))}else{n.x(side*(30+(i%4)*18));n.y(-side*(35+(i%2)*25))}}
function* show(n:Node,d:number,o=1):ThreadGenerator{yield* all(n.opacity(o,d),n.x(0,d),n.y(0,d),n.scale(1,d))}
function* pulse(n:Node,d:number):ThreadGenerator{yield* n.scale(1.04,d);yield* n.scale(1,d)}
function* programFlow(s:Node[],scene:Scene,plan:Plan):ThreadGenerator{
 const p=plan.program%18,d=scene.duration,u=d/12,m=Math.min(.36,Math.max(.11,u*.5)),hold=Math.max(.03,u-m);
 s.forEach((n,i)=>initStage(n,i,p,plan.variant));let spent=0;
 const one=function*(i:number,o=1){yield* show(s[i],m,o);spent+=m;if(hold>0){yield* waitFor(hold);spent+=hold;}};
 const many=function*(ids:number[],o=1){yield* all(...ids.map(i=>show(s[i],m,o)));spent+=m;if(hold>0){yield* waitFor(hold);spent+=hold;}};
 if(p===0){for(let i=0;i<8;i++)yield* one(i)}
 else if(p===1){for(const q of [[0,7],[1,6],[2,5],[3,4]])yield* many(q)}
 else if(p===2){for(const i of [3,4,2,5,1,6,0,7])yield* one(i)}
 else if(p===3){yield* many([0,1,2,3,4,5,6,7],.42);for(const i of [1,4,6]){yield* show(s[i],m,1);spent+=m;yield* pulse(s[i],m*.7);spent+=m*.7}}
 else if(p===4){yield* one(0);yield* many([1,2]);yield* many([3,4,5]);yield* one(6);yield* one(7)}
 else if(p===5){yield* many([0,2,4,6]);yield* many([1,3,5,7]);yield* many([2,3,4,5])}
 else if(p===6){yield* one(0);yield* many([1,2,3,4,5,6]);yield* one(7);yield* all(...s.slice(1,7).map(n=>pulse(n,m)));spent+=m*2}
 else if(p===7){yield* many([0,7]);yield* many([1,6]);yield* many([2,5]);yield* many([3,4]);yield* all(s[3].x(-16,m),s[4].x(16,m));spent+=m;yield* all(s[3].x(0,m),s[4].x(0,m));spent+=m}
 else if(p===8){yield* many([0,1,2]);yield* one(3);yield* many([4,5]);yield* one(6);yield* one(7)}
 else if(p===9){for(const i of [0,2,4,6,1,3,5,7])yield* one(i)}
 else if(p===10){yield* many([0,1,2,3]);yield* many([4,5,6,7]);yield* all(...s.slice(0,4).map(n=>n.x(14,m)),...s.slice(4).map(n=>n.x(-14,m)));spent+=m;yield* all(...s.map(n=>n.x(0,m)));spent+=m}
 else if(p===11){yield* many([0,1,2,3,4,5,6,7],.65);for(const i of [0,2,4,6,7]){yield* pulse(s[i],m);spent+=m*2}}
 else if(p===12){for(const i of [0,1,2,3])yield* one(i);yield* waitFor(u);spent+=u;for(const i of [4,5,6,7])yield* one(i)}
 else if(p===13){for(const i of [0,7,1,6,2,5,3,4])yield* one(i)}
 else if(p===14){yield* many([0,1,2,3,4,5,6,7]);yield* all(...s.slice(1,7).map(n=>n.opacity(.28,m)));spent+=m;yield* all(...s.map(n=>n.opacity(1,m)));spent+=m}
 else if(p===15){yield* many([0,1,2,3,4,5,6,7],.38);for(const i of [1,3,5,7]){yield* s[i].opacity(1,m);spent+=m;yield* pulse(s[i],m*.65);spent+=m*1.3}}
 else if(p===16){for(const i of [7,6,5,4,3,2,1,0])yield* one(i)}
 else{yield* many([0,3,6]);yield* many([1,4,7]);yield* many([2,5]);yield* all(...s.map(n=>n.opacity(1,m)));spent+=m;yield* pulse(s[7],m);spent+=m*2}
 if(spent<d)yield* waitFor(d-spent);
}
function* cameraFlow(n:Node,d:number,plan:Plan):ThreadGenerator{const q=d/4;n.x(0);n.y(0);n.scale(1);switch(plan.camera%10){
 case 0:yield* waitFor(d);break;
 case 1:yield* n.scale(1.022,d);break;
 case 2:yield* n.scale(.99,q);yield* n.scale(1.018,q*2);yield* n.scale(1,q);break;
 case 3:yield* n.x(-18,q);yield* n.x(9,q);yield* n.x(0,q*2);break;
 case 4:yield* n.x(18,q);yield* n.x(-8,q);yield* n.x(0,q*2);break;
 case 5:yield* n.y(-12,q);yield* n.y(6,q);yield* n.y(0,q*2);break;
 case 6:yield* n.y(12,q);yield* n.y(-6,q);yield* n.y(0,q*2);break;
 case 7:yield* n.scale(1.015,q);yield* waitFor(q);yield* n.scale(1.035,q);yield* n.scale(1,q);break;
 case 8:yield* n.scale(.992,q);yield* n.scale(1.026,q);yield* n.scale(1.01,q);yield* n.scale(1,q);break;
 default:yield* n.x(-12,q);yield* n.x(12,q);yield* n.x(-6,q);yield* n.x(0,q);break;
 }}
function* subtitleFlow(cues:Cue[],caption:Txt,duration:number):ThreadGenerator{let t=0;for(const c of cues){if(c.start>t)yield* waitFor(c.start-t);caption.text(c.display);t=c.start;}if(duration>t)yield* waitFor(duration-t);caption.text('')}
export function* playMeaningScene(view:View2D,scene:Scene):ThreadGenerator{
 const plan=(visualPlan as Record<string,Plan>)[scene.motif];if(!plan)throw new Error('V131 visual plan missing '+scene.motif);view.fill(K.bg);
 const contentLayer=new Node({}),headingLayer=new Node({}),subtitleBacking=new Node({}),subtitleTextLayer=new Node({});
 view.add(contentLayer);view.add(headingLayer);view.add(subtitleBacking);view.add(subtitleTextLayer);
 const ss=draw(contentLayer,scene,plan);rr(headingLayer,0,-474,1920,132,K.ink,0);tx(headingLayer,'考える夜',-805,-505,24,K.gold);tx(headingLayer,scene.chapter.toUpperCase(),-690,-445,18,K.muted);tx(headingLayer,scene.title,0,-465,scene.title.length>19?31:38,K.paper);tx(headingLayer,scene.id,840,-505,20,K.muted);
 rr(subtitleBacking,0,458,1920,176,'#020406',0).opacity(.96);const caption=new Txt({text:'',x:0,y:458,fontFamily:F,fontSize:40,fill:K.paper,fontWeight:650,lineHeight:57});subtitleTextLayer.add(caption);
 yield* all(programFlow(ss,scene,plan),cameraFlow(contentLayer,scene.duration,plan),subtitleFlow(scene.cues,caption,scene.duration));
}
