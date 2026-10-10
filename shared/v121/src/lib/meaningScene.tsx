import '@fontsource/noto-sans-jp/400.css';
import '@fontsource/noto-sans-jp/700.css';
import {Circle, Line, Node, Rect, Txt, type View2D} from '@motion-canvas/2d';
import {all, waitFor, type ThreadGenerator} from '@motion-canvas/core';
import visualPlan from '../../content/visual_plan.json';

interface Cue{text:string;display:string;start:number;end:number}
interface MeaningScene{id:string;chapter:string;motif:string;title:string;narration:string;cues:Cue[];duration:number}
interface Plan{kind:string;motion:string;labels:string[]}
const P={bg:'#09131A',deep:'#11242D',paper:'#F0EBE1',muted:'#8397A2',red:'#C95652',gold:'#C7A15B',cyan:'#72AEB8',teal:'#70988D',blue:'#58778C',green:'#718C73',line:'#304650',brown:'#745F50',cream:'#D8D0C1',purple:'#7C7192'};
const FONT='Noto Sans JP, Noto Sans CJK JP, sans-serif';
const hash=(s:string)=>[...s].reduce((a,c)=>((a*33)^c.charCodeAt(0))>>>0,121);
const tx=(s:string,x:number,y:number,sz=32,col=P.paper,w=600)=>new Txt({text:s,x,y,fontFamily:FONT,fontSize:sz,fill:col,fontWeight:w});
const rr=(p:Node,x:number,y:number,w:number,h:number,fill=P.deep,r=12,stroke?:string)=>p.add(new Rect({x,y,width:w,height:h,fill,radius:r,stroke:stroke??fill,lineWidth:stroke?2:0}));
const cc=(p:Node,x:number,y:number,r:number,fill=P.paper)=>p.add(new Circle({x,y,width:r*2,height:r*2,fill}));
const ln=(p:Node,pts:[number,number][],col=P.line,w=4)=>p.add(new Line({points:pts,stroke:col,lineWidth:w,lineCap:'round',lineJoin:'round'}));
const ar=(p:Node,a:[number,number],b:[number,number],col=P.gold,w=6)=>p.add(new Line({points:[a,b],stroke:col,lineWidth:w,endArrow:true,arrowSize:14}));
const lab=(p:Node,s:string,x:number,y:number,col=P.gold,sz=29)=>p.add(tx(s,x,y,sz,col,700));
function person(p:Node,x:number,y:number,s=.7,col=P.paper){const g=new Node({x,y,scale:s});cc(g,0,-52,24,col);rr(g,0,24,52,112,col,18);ln(g,[[-15,72],[-25,148]],col,12);ln(g,[[15,72],[25,148]],col,12);ln(g,[[-22,-2],[-62,55]],col,10);ln(g,[[22,-2],[62,55]],col,10);p.add(g);}
function desk(p:Node,x:number,y:number,w=230){rr(p,x,y,w,34,P.brown,8);ln(p,[[x-w*.38,y+16],[x-w*.38,y+105]],P.paper,7);ln(p,[[x+w*.38,y+16],[x+w*.38,y+105]],P.paper,7);}
function house(p:Node,x:number,y:number,w=560,h=430,fill='#17303A'){rr(p,x,y,w,h,fill,18,P.line);ln(p,[[x-w*.52,y-h*.5],[x,y-h*.78],[x+w*.52,y-h*.5]],P.gold,8);}
function book(p:Node,x:number,y:number,s=1,col=P.cyan){const g=new Node({x,y,scale:s});rr(g,-52,0,95,120,col,8);rr(g,52,0,95,120,col,8);ln(g,[[0,-55],[0,55]],P.paper,3);p.add(g);}
function gear(p:Node,x:number,y:number,r=62,col=P.blue){cc(p,x,y,r,col);cc(p,x,y,r*.38,P.bg);}
function card(p:Node,s:string,x:number,y:number,w=255,col=P.cyan){rr(p,x,y,w,74,'#142B34',13,col);lab(p,s,x,y,col,25);}
function meter(p:Node,s:string,x:number,y:number,v:number,col=P.cyan){lab(p,s,x-275,y,col,24);rr(p,x+10,y,520,28,'#223640',7);rr(p,x-250+260*v,y,520*v,28,col,7);}
function paper(p:Node,x:number,y:number,w=300,h=390,title=''){rr(p,x,y,w,h,'#E5E1D8',10,'#899397');if(title)lab(p,title,x,y-h*.38,P.bg,25);for(let i=0;i<6;i++)ln(p,[[x-w*.35,y-h*.18+i*42],[x+w*(i===5?.08:.35),y-h*.18+i*42]],'#90989A',4);}
function clock(p:Node,x:number,y:number,label='21:00'){cc(p,x,y,72,P.deep);cc(p,x,y,67,P.paper);ln(p,[[x,y],[x+28,y-32]],P.bg,6);ln(p,[[x,y],[x,y-44]],P.bg,6);lab(p,label,x,y+108,P.gold,24);}
function uniqueBackdrop(p:Node,scene:MeaningScene,plan:Plan){rr(p,0,0,1920,1080,P.bg,0);const h=hash(scene.motif+plan.kind+plan.motion);for(let i=0;i<9;i++){const x=-850+((h>>(i%12))%1700),y=-305+((h>>(i%8+2))%540);cc(p,x,y,2+(i%3),i%2?P.gold:P.cyan);}for(let i=0;i<5;i++){const x=-760+i*380+((h>>(i+3))&45)-22;ln(p,[[x,330],[x+((h>>(i+8))&80)-40,-320]],'#142B34',2);}rr(p,0,340,1920,3,'#29414A',0);}
function roomBase(p:Node){house(p,-460,30,650,490,'#17313A');house(p,460,30,650,490,'#2C2B2A');desk(p,-460,120,300);desk(p,460,120,300);}
function makeStages(root:Node,scene:MeaningScene,plan:Plan):Node[]{const h=hash(scene.motif);const stages=Array.from({length:8},(_,i)=>new Node({opacity:0,x:(i%2?1:-1)*(24+((h>>(i%10))&22)),y:(i%3-1)*(12+((h>>(i+3))&16))}));stages.forEach(s=>root.add(s));const[a,b,c,d,e,f,g,k]=stages;const L=plan.labels;
 switch(plan.kind){
  case'dual_home':
   roomBase(a);clock(b,-670,-205,L[0]);clock(b,670,-205,L[0]);person(c,-460,35,.72,P.cyan);person(c,460,35,.72,P.paper);book(d,-460,70,.55,P.gold);if(scene.motif==='interrupted_study'){cc(e,560,150,26,P.red);ar(e,[560,150],[420,95],P.red);lab(f,L[5],465,245,P.red,29);}else if(scene.motif==='return_nine_pm'){card(e,'学校の自習室',0,-230,330,P.cyan);card(f,'付箋→翌日質問',0,225,340,P.gold);}else{card(e,L[2],-460,255,250,P.cyan);card(f,L[5],460,255,250,P.red);}lab(g,L[6],0,-275,P.paper,39);lab(k,L[7],0,292,P.gold,41);break;
  case'classroom':
   rr(a,0,15,1450,600,'#102630',18,P.line);for(let r=0;r<3;r++)for(let i=0;i<5;i++){desk(a,-520+i*260,-60+r*145,180);person(b,-520+i*260,-120+r*145,.32,i%2?P.paper:P.cyan);}rr(c,0,-230,770,105,'#27434B',8);lab(c,L[0],0,-230,P.paper,30);paper(d,-260,55,260,320,scene.motif==='same_test'?'88':'答案');paper(d,260,55,260,320,scene.motif==='same_test'?'62':'評価');if(scene.motif==='classroom_code'){person(e,-250,140,.55,P.cyan);ln(e,[[-250,65],[-250,-30]],P.cyan,9);person(f,250,140,.55,P.paper);}else{lab(e,L[5],0,235,P.red,37);}lab(g,L[6],0,-285,P.paper,38);lab(k,L[7],0,300,P.gold,40);break;
  case'gear_lab':case'gear_chain':case'score_machine':
   for(let i=0;i<6;i++)gear(a,-520+i*210,20+(i%2)*70,54+(i%3)*8,i%2?P.cyan:P.gold);for(let i=0;i<6;i++)lab(b,L[Math.min(i,L.length-1)],-520+i*210,-95+(i%2)*70,P.paper,20);ar(c,[-640,200],[640,200],P.gold,7);card(d,L[0],-430,255,260,P.cyan);card(e,L[7],430,255,300,P.gold);if(scene.motif==='conversion_efficiency'){lab(f,'努力 10',-430,-245,P.paper,42);lab(g,'成果 15 / 6',430,-245,P.red,42);}else{lab(f,L[3],0,-250,P.red,36);lab(g,L[6],0,280,P.paper,34);}k.scale(1.04);break;
  case'concept_stage':case'balance':case'venn_machine':case'double_edge':case'hope_stage':
   card(a,L[0],-420,-65,330,P.cyan);card(b,L[1],420,-65,330,P.gold);cc(c,0,35,95,P.red);ar(d,[-250,-40],[-90,15],P.cyan);ar(d,[250,-40],[90,15],P.gold);card(e,L[4],-390,210,300,P.blue);card(f,L[5],390,210,300,P.red);lab(g,L[6],0,-265,P.paper,39);lab(k,L[7],0,300,P.gold,41);break;
  case'historical_estate':
   house(a,-430,40,650,500,'#322B29');house(a,450,70,500,380,'#203039');person(b,-430,40,.8,P.gold);person(c,450,100,.7,P.paper);book(d,-350,0,.6,P.cream);rr(e,520,165,270,70,P.brown,10);lab(e,L[4],520,165,P.paper,25);card(f,L[5],0,-245,320,P.red);lab(g,L[6],0,270,P.red,41);lab(k,L[7],0,315,P.paper,32);break;
  case'stairs':
   for(let i=0;i<7;i++)rr(a,-520+i*165,220-i*65,165,48,i<3?'#27404A':'#31484D',4);person(b,-540,150,.5,P.cyan);person(c,250,20,.5,P.gold);if(scene.motif==='unequal_start'){ln(d,[[-690,260],[-540,150]],P.red,9);ln(e,[[650,260],[250,20]],P.cyan,9);}else{['試験','大学','企業'].forEach((s,i)=>card(d,s,-330+i*330,-195,260,i===0?P.cyan:P.gold));}lab(f,L[5],0,-280,P.paper,37);lab(g,L[6],0,292,P.gold,40);lab(k,L[7],520,-260,P.red,30);break;
  case'book_future':
   book(a,-380,20,1.7,P.gold);lab(a,'1958',-380,-185,P.paper,43);card(b,'知能',150,-90,250,P.cyan);card(c,'努力',450,-90,250,P.gold);ar(d,[150,-30],[310,70],P.cyan);ar(d,[450,-30],[310,70],P.gold);card(e,'社会的地位',310,135,350,P.red);lab(f,L[5],0,270,P.paper,32);lab(g,L[6],0,-270,P.red,39);lab(k,L[7],0,310,P.gold,36);break;
  case'blame_board':
   card(a,'出生',-480,-100,280,P.muted);card(b,'努力不足',480,-100,340,P.red);ar(c,[-260,-100],[260,-100],P.gold);paper(d,-300,130,240,280,'身分');paper(e,300,130,240,280,'試験');lab(f,L[5],0,255,P.paper,34);lab(g,L[6],0,-265,P.red,42);lab(k,L[7],0,305,P.gold,33);break;
  case'museum_class':
   rr(a,0,10,1500,600,'#10262F',18,P.line);for(let i=0;i<4;i++){rr(a,-540+i*360,-110,250,180,['#4C5D62','#635648','#4D6570','#6A5E50'][i],8);rr(a,-540+i*360,-110,180,110,P.cream,4);}person(b,-390,170,.55,P.cyan);person(b,390,170,.55,P.paper);book(c,-390,30,.5,P.gold);card(d,'家族との美術館',-390,260,330,P.cyan);card(e,'同じ課題',390,260,300,P.gold);lab(f,L[5],0,-245,P.paper,35);lab(g,L[6],0,300,P.red,38);lab(k,L[7],0,-295,P.gold,34);break;
  case'capital_cards':
   ['身体化','客体化','制度化'].forEach((s,i)=>card(a,s,-430+i*430,-105,330,[P.cyan,P.gold,P.red][i]));['話し方・知識','本・文化財','学歴・資格'].forEach((s,i)=>card(b,s,-430+i*430,55,330,P.paper));ar(c,[-430,105],[-220,205],P.cyan);ar(c,[0,105],[0,205],P.gold);ar(c,[430,105],[220,205],P.red);lab(d,'家庭生活で蓄積',0,250,P.paper,39);lab(e,L[6],0,-270,P.gold,38);lab(f,L[7],0,305,P.red,34);g.scale(1.03);k.opacity(.9);break;
  case'dinner_guidance':
   rr(a,0,115,1150,240,P.brown,22);person(b,-320,-25,.55,P.cyan);person(b,320,-25,.55,P.paper);['学部','推薦','奨学金','OC'].forEach((s,i)=>card(c,s,-450+i*300,135,220,i%2?P.gold:P.cyan));paper(d,490,-120,250,300,'進路希望');lab(e,L[5],490,110,P.red,28);lab(f,L[6],0,-270,P.paper,38);lab(g,L[7],0,300,P.gold,39);k.scale(1.02);break;
  case'evaluation_lab':
   card(a,'家庭文化',-440,-90,330,P.cyan);ar(b,[-260,-90],[0,-20],P.gold);card(c,'学校評価',0,-20,330,P.gold);ar(d,[180,-20],[390,80],P.red);card(e,'才能に見える',440,80,360,P.red);['言葉','文章','距離感'].forEach((s,i)=>card(f,s,-360+i*360,220,280,P.paper));lab(g,L[6],0,-275,P.paper,38);lab(k,L[7],0,302,P.gold,34);break;
  case'timeline_day':case'schedule_grid':
   for(let i=0;i<8;i++){const x=-700+i*200;rr(a,x,40,150,350,'#132B34',8);lab(a,String(15+i)+':00',x,-165,P.muted,20);}if(scene.motif==='after_school_paths'){person(b,-640,60,.45,P.cyan);ar(c,[-560,60],[-180,60],P.cyan);ar(c,[-560,130],[260,130],P.red);card(d,'塾',-100,60,220,P.cyan);card(e,'買物→妹迎え',350,130,330,P.red);}else{['勉強','家事','兄弟','用事'].forEach((s,i)=>card(b,s,-520+i*340,-50+(i%2)*150,260,i===0?P.cyan:P.red));}lab(f,L[6],0,-270,P.paper,38);lab(g,L[7],0,300,P.gold,39);k.scale(1.03);break;
  case'data_chart':
   ln(a,[[-600,230],[-600,-200]],P.paper,5);ln(a,[[-600,230],[600,230]],P.paper,5);rr(b,-240,50,250,360,P.cyan,8);rr(c,240,125,250,210,P.red,8);lab(d,scene.motif==='pisa_gap'?'上位25%':'不利な層',-240,275,P.paper,25);lab(e,scene.motif==='pisa_gap'?'下位25%':'上位成績へ',240,275,P.paper,25);lab(f,scene.motif==='pisa_gap'?'81点差':'12%',0,-255,P.gold,52);lab(g,L[6],0,315,P.paper,33);lab(k,L[7],0,-305,P.red,29);break;
  case'network':
   cc(a,0,30,76,P.red);L.slice(1,7).forEach((s,i)=>{const ang=-Math.PI/2+i*Math.PI*2/6,x=Math.cos(ang)*500,y=30+Math.sin(ang)*230;cc(b,x,y,48,i%2?P.cyan:P.gold);lab(c,s,x,y+78,P.paper,22);ln(d,[[0,30],[x,y]],P.line,4);});lab(e,'学習成果',0,35,P.paper,28);lab(f,L[0],0,-275,P.gold,40);lab(g,L[6],0,305,P.red,31);k.scale(1.03);break;
  case'growth_timeline':
   ln(a,[[-650,230],[650,230]],P.line,8);['小1','小3','小6','中3'].forEach((s,i)=>{const x=-540+i*360;cc(b,x,230,18,P.gold);lab(b,s,x,285,P.paper,25);});ln(c,[[-540,140],[-180,70],[180,-30],[540,-165]],P.cyan,12);ln(d,[[-540,150],[-180,125],[180,105],[540,75]],P.red,12);lab(e,'差が拡大',520,-230,P.gold,35);lab(f,L[5],0,-275,P.paper,32);lab(g,L[6],0,310,P.red,31);k.scale(1.02);break;
  case'snowball':
   ln(a,[[-720,-190],[680,250]],P.line,14);for(let i=0;i<5;i++){const x=-540+i*280,y=-135+i*92,r=35+i*(scene.motif==='reading_snowball'?15:9);cc(b,x,y,r,scene.motif==='reading_snowball'?P.cyan:P.red);lab(c,L[Math.min(i+1,7)],x,y-r-34,P.paper,20);}lab(d,L[0],-580,-265,P.gold,34);lab(e,L[6],300,305,P.paper,28);lab(f,L[7],540,250,P.red,29);g.scale(1.02);k.opacity(.9);break;
  case'policy_invoice':
   paper(a,-360,30,430,480,'構造への対応');['住宅','労働時間','学習場所'].forEach((s,i)=>card(b,s,-360,-80+i*110,300,P.red));paper(c,360,30,350,390,'本人');card(d,'努力しよう',360,30,260,P.cyan);lab(e,'制度変更 = 高コスト',-360,300,P.red,30);lab(f,'言葉 = ほぼ0円',360,300,P.gold,31);lab(g,L[6],0,-285,P.paper,35);lab(k,L[7],0,320,P.gold,32);break;
  case'bicycle_hill':
   ln(a,[[-760,250],[700,-240]],P.line,18);cc(b,-380,80,62,P.cyan);cc(b,-210,25,62,P.cyan);ln(b,[[-380,80],[-295,-5],[-210,25],[-380,80]],P.cyan,10);rr(c,-265,-55,180,120,P.red,12);lab(c,'荷物',-265,-55,P.paper,25);ar(d,[-90,0],[140,-80],P.gold);card(e,'もっとこげ',260,-185,280,P.red);card(f,'荷物を降ろす',260,10,300,P.cyan);card(g,'整備する',260,150,260,P.gold);lab(k,L[7],0,300,P.paper,33);break;
  case'support_bridge':case'policy_room':
   ['場所','情報','学習支援','食事','健康','奨学金'].forEach((s,i)=>card(a,s,-520+(i%3)*520,-105+Math.floor(i/3)*170,330,i%2?P.gold:P.cyan));person(b,0,245,.46,P.paper);ar(c,[-500,145],[-80,220],P.cyan);ar(c,[500,145],[80,220],P.gold);lab(d,'本人が努力',0,295,P.paper,31);lab(e,L[6],0,-285,P.red,37);lab(f,L[7],0,330,P.gold,30);g.scale(1.02);k.opacity(.9);break;
  case'interview_scaffold':case'scaffold_steps':
   person(a,0,90,.72,P.paper);card(b,'難関大学',0,-80,330,P.gold);['本棚','塾','送迎','静かな部屋','情報','再挑戦余裕'].forEach((s,i)=>{const x=-520+(i%3)*520,y=190+Math.floor(i/3)*105;card(c,s,x,y,310,i%2?P.cyan:P.teal);ln(d,[[x,y-35],[0,135]],P.line,3);});lab(e,'「自分も努力した」',0,-245,P.paper,38);lab(f,L[6],0,325,P.red,29);lab(g,L[7],0,-305,P.gold,30);k.scale(1.02);break;
  case'race_track':
   ln(a,[[-700,250],[700,250]],P.paper,8);for(let i=0;i<3;i++){const y=120-i*130;ln(a,[[-650,y],[650,y]],i===0?P.red:i===1?P.gold:P.cyan,10);}for(let i=0;i<4;i++)rr(b,-150+i*110,120,65,80,P.brown,4);for(let i=0;i<4;i++)rr(c,80+i*95,-10,18,90,P.red,2);person(d,-560,110,.38,P.paper);person(e,-560,-20,.38,P.paper);person(f,-560,-150,.38,P.paper);lab(g,L[6],0,-285,P.gold,37);lab(k,L[7],0,305,P.paper,33);break;
  case'exam_sheet':
   paper(a,0,20,540,620,'答案');lab(b,'62',0,-40,P.red,86);['静かな部屋','本棚','親学歴','塾','睡眠','兄弟世話'].forEach((s,i)=>card(c,s,-560+(i%3)*560,-100+Math.floor(i/3)*170,330,i%2?P.cyan:P.gold));c.opacity(.62);lab(d,'答案には印刷されない',0,310,P.paper,34);lab(e,L[6],0,-290,P.red,35);lab(f,L[7],0,350,P.gold,29);g.scale(1.02);k.opacity(.9);break;
  case'backpack_scale':
   person(a,-420,70,.7,P.cyan);person(a,420,70,.7,P.paper);rr(b,420,20,180,170,P.red,18);['家事','情報不足','不安'].forEach((s,i)=>card(c,s,420,-120+i*110,250,P.red));ln(d,[[-650,255],[650,255]],P.paper,8);cc(e,-420,255,32,P.cyan);cc(e,420,255,70,P.red);lab(f,'同じ1時間',0,-260,P.gold,42);lab(g,L[6],0,315,P.paper,31);lab(k,L[7],0,355,P.gold,28);break;
  default:
   card(a,L[0],-430,-90,330,P.cyan);card(b,L[1],430,-90,330,P.gold);ar(c,[-250,-60],[250,-60],P.gold);card(d,L[3],-430,120,330,P.paper);card(e,L[4],430,120,330,P.red);lab(f,L[6],0,-270,P.paper,37);lab(g,L[7],0,300,P.gold,38);k.scale(1.04);
 }
 return stages;
}
function* subtitleFlow(cues:Cue[],node:Txt,duration:number):ThreadGenerator{let now=0;for(const cue of cues){if(cue.start>now)yield* waitFor(cue.start-now);node.text(cue.display);now=cue.start;}if(duration>now)yield* waitFor(duration-now);node.text('');}
function* stageFlow(stages:Node[],duration:number,motif:string):ThreadGenerator{const h=hash(motif);const base=[.015,.12,.235,.35,.465,.58,.695,.81];let cursor=0;for(let i=0;i<stages.length;i++){const jitter=((h>>(i%13))&7)*.0025;const at=duration*Math.min(.86,base[i]+jitter);if(at>cursor)yield* waitFor(at-cursor);cursor=at;const d=Math.min(.86,Math.max(.28,duration*.024));yield* all(stages[i].opacity(1,d),stages[i].x(0,d),stages[i].y(0,d),stages[i].scale(i===7?1.025:1,d));cursor+=d;if(i>=3)stages[i-3].opacity(.79);}const end=duration*.925;if(end>cursor){yield* waitFor(end-cursor);cursor=end;}yield* all(stages[7].scale(1.05,.4),stages[2].opacity(.68,.4));cursor+=.4;if(duration>cursor)yield* waitFor(duration-cursor);}
export function* playMeaningScene(view:View2D,scene:MeaningScene):ThreadGenerator{
 view.fill(P.bg);const contentLayer=new Node({});const headingLayer=new Node({});const subtitleBacking=new Node({});const subtitleTextLayer=new Node({});
 view.add(contentLayer);view.add(headingLayer);view.add(subtitleBacking);view.add(subtitleTextLayer);
 const plan=(visualPlan as Record<string,Plan>)[scene.motif];if(!plan)throw new Error('V121 visual plan missing '+scene.motif);
 uniqueBackdrop(contentLayer,scene,plan);const stages=makeStages(contentLayer,scene,plan);
 rr(headingLayer,0,-474,1920,132,'#071119',0);headingLayer.add(tx(scene.title,0,-453,scene.title.length>23?34:43,P.paper,700));headingLayer.add(tx(scene.chapter==='prologue'?'PROLOGUE':scene.chapter==='epilogue'?'EPILOGUE':scene.chapter.toUpperCase(),-800,-508,22,P.gold,700));headingLayer.add(tx(scene.id,830,-508,21,P.muted,600));
 rr(subtitleBacking,0,460,1920,170,'#02070D',0);const caption=tx('',0,458,42,P.paper,650);caption.lineHeight(59);subtitleTextLayer.add(caption);
 yield* all(stageFlow(stages,scene.duration,scene.motif),subtitleFlow(scene.cues,caption,scene.duration));
}