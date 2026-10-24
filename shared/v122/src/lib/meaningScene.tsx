import '@fontsource/noto-sans-jp/400.css';
import '@fontsource/noto-sans-jp/700.css';
import {Circle, Line, Node, Rect, Txt, type View2D} from '@motion-canvas/2d';
import {all, waitFor, type ThreadGenerator} from '@motion-canvas/core';
import visualPlan from '../../content/visual_plan.json';

type Cue={text:string;display:string;start:number;end:number};
type Scene={id:string;chapter:string;motif:string;title:string;narration:string;cues:Cue[];duration:number};
type Plan={space:string;diagram:string;labels:string[];action:string;motionSignature:string;backgroundSignature:string;actionProgram:number;camera:number;tempo:number;variant:number};

export const V134_SCENE_COUNT=112;
export const V134_STAGE_COUNT=12;
const F='Noto Sans JP, Noto Sans CJK JP, sans-serif';
const K={bg:'#071015',deep:'#0E1820',panel:'#14232C',panel2:'#1B2D37',paper:'#F0ECE3',muted:'#91A0A8',red:'#C2555E',red2:'#743139',gold:'#D0AA63',blue:'#5B8DB6',cyan:'#6AAAB0',jade:'#70A28A',orange:'#B8784E',violet:'#8477A4',ink:'#03070B',steel:'#3F505B',floor:'#26343D',green:'#5E7D62',brown:'#5E4938',cream:'#D8C8A8'};
const hash=(s:string)=>[...s].reduce((a,c)=>((a*33)^c.charCodeAt(0))>>>0,132);
function rr(p:Node,x:number,y:number,w:number,h:number,fill:string,r=8,stroke?:string,lw=2){const q=new Rect({x,y,width:w,height:h,fill,radius:r,stroke:stroke??fill,lineWidth:stroke?lw:0});p.add(q);return q}
function cc(p:Node,x:number,y:number,r:number,fill:string,stroke?:string,lw=2){const q=new Circle({x,y,width:r*2,height:r*2,fill,stroke:stroke??fill,lineWidth:stroke?lw:0});p.add(q);return q}
function ln(p:Node,pts:[number,number][],col=K.muted,w=5){const q=new Line({points:pts,stroke:col,lineWidth:w,lineCap:'round',lineJoin:'round'});p.add(q);return q}
function tx(p:Node,s:string,x:number,y:number,sz=26,col=K.paper,w=700){const q=new Txt({text:s,x,y,fontFamily:F,fontSize:sz,fill:col,fontWeight:w});p.add(q);return q}
function pill(p:Node,s:string,x:number,y:number,w=300,col=K.gold){rr(p,x,y,w,64,K.deep,10,col);tx(p,s,x,y,19,col)}
function person(p:Node,x:number,y:number,s=.48,col=K.paper){const g=new Node({x,y,scale:s});p.add(g);cc(g,0,-60,24,col);rr(g,0,18,58,115,col,16);ln(g,[[-18,-4],[-54,52]],col,10);ln(g,[[18,-4],[54,52]],col,10);ln(g,[[-18,78],[-28,148]],col,12);ln(g,[[18,78],[28,148]],col,12);return g}
function desk(p:Node,x:number,y:number,w=650){rr(p,x,y,w,24,K.brown,4);ln(p,[[x-w*.4,y+12],[x-w*.4,y+118]],K.cream,7);ln(p,[[x+w*.4,y+12],[x+w*.4,y+118]],K.cream,7)}
function paper(p:Node,x:number,y:number,w=260,h=180,title=''){rr(p,x,y,w,h,'#E6DDC9',4,K.cream);for(let i=0;i<4;i++)rr(p,x,y-42+i*28,w-60,5,'#8D8779',2);if(title)tx(p,title,x,y-h/2+27,17,K.ink)}
function monitor(p:Node,x:number,y:number,w=420,h=240){rr(p,x,y,w,h,'#0A1117',8,K.steel);rr(p,x,y,w-26,h-26,'#10242E',4);ln(p,[[x,y+h/2],[x,y+h/2+48]],K.steel,7);rr(p,x,y+h/2+61,130,12,K.steel,3)}
function arrow(p:Node,a:[number,number],b:[number,number],col=K.gold,w=6){ln(p,[a,b],col,w);cc(p,b[0],b[1],7,col)}
function bar(p:Node,x:number,y:number,w:number,v:number,col:string,label:string){rr(p,x,y,w,26,K.floor,5);rr(p,x-w*(1-v)/2,y,Math.max(8,w*v),26,col,5);tx(p,label,x,y-31,17,col)}
function shelf(p:Node,x:number,y:number,w=480,h=370){rr(p,x,y,w,h,'#2C2420',6,K.brown);for(let r=0;r<3;r++){ln(p,[[x-w*.45,y-110+r*115],[x+w*.45,y-110+r*115]],K.cream,5);for(let i=0;i<6;i++)rr(p,x-w*.38+i*(w*.76/5),y-145+r*115,34,62,[K.red2,K.blue,K.jade,K.gold,K.violet,K.orange][i],2)}}
function building(p:Node,x:number,y:number,w=320,h=420,col=K.panel2){rr(p,x,y,w,h,col,3,K.steel);for(let r=0;r<4;r++)for(let c=0;c<3;c++)rr(p,x-90+c*90,y-135+r*90,34,45,(r+c)%3===0?K.gold:'#263943',2)}
function car(p:Node,x:number,y:number,s=1,col=K.blue){const g=new Node({x,y,scale:s});p.add(g);rr(g,0,12,250,78,col,22,K.paper,2);rr(g,-25,-34,140,54,K.panel2,18,K.paper,2);cc(g,-78,62,28,K.ink,K.paper,4);cc(g,78,62,28,K.ink,K.paper,4);rr(g,-105,8,34,18,K.gold,5);rr(g,105,8,34,18,K.red,5);return g}
function bus(p:Node,x:number,y:number,s=1,col=K.jade){const g=new Node({x,y,scale:s});p.add(g);rr(g,0,0,330,140,col,15,K.paper,2);for(let i=0;i<5;i++)rr(g,-108+i*55,-18,42,42,K.deep,3);cc(g,-105,78,25,K.ink,K.paper,4);cc(g,105,78,25,K.ink,K.paper,4);return g}
function house(p:Node,x:number,y:number,w=260,h=180,col=K.panel2){rr(p,x,y,w,h,col,4,K.steel);ln(p,[[x-w*.58,y-h*.5],[x,y-h*.95],[x+w*.58,y-h*.5]],K.brown,16);rr(p,x,y+40,58,100,K.deep,4);return p}
function tree(p:Node,x:number,y:number,s=1){ln(p,[[x,y+70*s],[x,y-30*s]],K.brown,16*s);cc(p,x,y-80*s,55*s,K.green);cc(p,x-35*s,y-55*s,40*s,K.jade);cc(p,x+35*s,y-55*s,40*s,K.green)}
function clockFace(p:Node,x:number,y:number,r=100){cc(p,x,y,r,K.deep,K.paper,5);for(let q=0;q<12;q++){const a=Math.PI*2*q/12;cc(p,x+Math.sin(a)*r*.78,y-Math.cos(a)*r*.78,5,K.gold)}ln(p,[[x,y],[x+10,y-r*.52]],K.paper,7);ln(p,[[x,y],[x+r*.42,y+15]],K.red,7)}
function road(p:Node,y=130){rr(p,0,y,1920,220,'#252B2F',0);for(let i=0;i<9;i++)rr(p,-850+i*220,y,110,7,K.cream,2)}

function worldBase(root:Node,scene:Scene,plan:Plan){const seed=hash(scene.motif+plan.action+plan.backgroundSignature);const pal=['#071015','#08121A','#0A141B','#0D171C','#111619','#131518','#0D1318'];rr(root,0,0,1920,930,pal[seed%pal.length],0);const horizon=-290+(seed%70);for(let i=0;i<7;i++){const x=-830+i*275+((seed>>(i%8))%35);const h=45+((seed+i*79)%110);rr(root,x,horizon+h/2,150,h,'#101D24',3,'#1D2D35',1)}rr(root,0,336,1920,3,K.floor,0);tx(root,scene.id,-850,312,13,K.muted,500);tx(root,plan.action.split('_').join(' ').toUpperCase(),635,312,12,K.muted,500)}
function stages(){return Array.from({length:12},()=>new Node({opacity:0}))}

function buildSpace(root:Node,s:Node[],scene:Scene,plan:Plan){
 const [a,b,c,d]=s,L=plan.labels,v=plan.variant;
 switch(plan.space){
  case'counter':rr(a,0,0,1500,590,'#101B22',16);desk(a,0,115,1320);person(b,-520,-10,.44,K.paper);person(c,520,-10,.44,K.gold);paper(d,0,40,330,210,L[1]);break;
  case'office':rr(a,0,0,1500,590,'#111B21',15);for(let i=0;i<4;i++){desk(b,-520+i*350,145,260);monitor(c,-520+i*350,-35,190,120)}person(d,-520+(v%4)*350,55,.3,K.gold);break;
  case'village':rr(a,0,150,1920,330,'#253126',0);for(let i=0;i<5;i++){rr(b,-650+i*325,30,240,145,'#594838',4);ln(b,[[-780+i*325,-45],[-650+i*325,-125],[-520+i*325,-45]],K.brown,15)}for(let i=0;i<6;i++)person(c,-610+i*240,185,.22,i===v%6?K.gold:K.paper);cc(d,0,-180,70,K.deep,K.gold);break;
  case'recordsRoom':for(let i=0;i<3;i++)shelf(a,-560+i*560,5,430,420);paper(b,-420,-160,220,150,'FILE');paper(c,0,-120,220,150,'FILE');paper(d,420,-80,220,150,'FILE');break;
  case'archive':shelf(a,-420,15,600,470);rr(b,380,0,570,470,'#30271E',10,K.gold);paper(c,380,-50,360,250,L[1]);tx(d,'ARCHIVE',380,170,25,K.gold);break;
  case'cityNetwork':for(let i=0;i<6;i++)building(a,-700+i*280,45,220,400,[K.panel,K.panel2,'#162830'][i%3]);for(let i=0;i<6;i++)cc(b,-700+i*280,250,12,[K.blue,K.gold,K.jade,K.red,K.cyan,K.violet][i]);ln(c,[[-700,250],[700,250]],K.gold,4);person(d,0,240,.22,K.paper);break;
  case'dataCenter':for(let i=0;i<5;i++){rr(a,-600+i*300,0,230,500,'#0E1A22',8,K.cyan);for(let r=0;r<6;r++)rr(b,-600+i*300,-180+r*72,170,24,r%2?K.blue:K.jade,3)}ln(c,[[-700,250],[700,250]],K.gold,4);cc(d,0,250,25,K.gold);break;
  case'mapRoom':rr(a,0,0,1450,580,'#111D23',18,K.steel);ln(b,[[-650,-200],[-450,-120],[-520,40],[-260,160],[20,30],[240,150],[520,-10],[650,120]],K.green,45);for(let i=0;i<7;i++)cc(c,-550+i*180,-120+(i%3)*95,18,[K.red,K.gold,K.blue,K.jade][i%4]);paper(d,530,-180,260,150,'MAP');break;
  case'nightOffice':rr(a,0,0,1500,590,'#071119',12);for(let i=0;i<5;i++)rr(a,-560+i*280,-120,170,230,'#0E1C25',4);desk(b,0,150,720);monitor(c,190,-45,360,210);person(d,-120,35,.42,K.paper);break;
  case'registry':rr(a,0,0,1500,590,'#141B1F',14);for(let i=0;i<4;i++)shelf(b,-570+i*380,30,300,420);paper(c,-260,-170,250,160,'台帳');paper(d,300,-110,250,160,'戸籍');break;
  case'throneRoom':rr(a,0,0,1500,590,'#21191A',16);rr(b,0,105,360,250,'#4B2C31',12,K.gold);person(c,0,-40,.5,K.gold);for(let i=0;i<7;i++)person(d,-600+i*200,185,.2,K.paper);break;
  case'examHall':rr(a,0,0,1500,590,'#191914',15);for(let r=0;r<2;r++)for(let i=0;i<6;i++){desk(b,-590+i*235,-40+r*210,170);person(c,-590+i*235,-100+r*210,.2,K.paper)}paper(d,0,-250,300,150,'科挙');break;
  case'palace':rr(a,0,0,1500,590,'#211A18',14);for(let i=-2;i<=2;i++)ln(b,[[i*260,250],[i*260,-220]],K.red2,22);ln(c,[[-720,-170],[0,-300],[720,-170]],K.gold,25);person(d,0,120,.38,K.gold);break;
  case'ministry':rr(a,0,0,1500,590,'#111A21',14);for(let i=0;i<3;i++){rr(b,-460+i*460,-20,360,390,K.panel2,12,[K.blue,K.gold,K.jade][i]);tx(c,['係','課','部'][i],-460+i*460,-150,30,[K.blue,K.gold,K.jade][i])}person(d,-460+(v%3)*460,120,.28,K.paper);break;
  case'university':rr(a,0,0,1500,590,'#171619',14);rr(b,0,-20,1000,420,'#202126',10,K.gold);for(let i=0;i<6;i++)rr(b,-360+i*145,-20,70,260,'#33343B',4);tx(c,'SOCIOLOGY',0,-190,31,K.gold);person(d,-550,150,.28,K.paper);break;
  case'kitchen':rr(a,0,0,1500,590,'#181A19',14);desk(b,0,120,1100);for(let i=0;i<4;i++)cc(c,-390+i*260,30,70,[K.red,K.orange,K.jade,K.cream][i]);person(d,-560,-20,.42,K.gold);break;
  case'chainStore':for(let i=0;i<4;i++){rr(a,-540+i*360,30,300,390,'#1A252A',12,K.gold);desk(b,-540+i*360,120,220);person(c,-540+i*360,30,.24,K.paper)}tx(d,'×100',560,-220,45,K.gold);break;
  case'trainStation':rr(a,0,0,1500,590,'#101920',14);ln(b,[[-700,210],[700,210]],K.steel,16);rr(c,-280,60,700,210,'#27343A',10,K.gold);for(let i=0;i<6;i++)person(d,-580+i*210,180,.2,K.paper);break;
  case'campaignOffice':rr(a,0,0,1500,590,'#18161A',14);for(let i=0;i<6;i++)paper(b,-520+(i%3)*520,-120+Math.floor(i/3)*210,320,150,['VOTE','JOB','POST','ALLY','MAIL','OFFICE'][i]);person(c,-610,190,.25,K.red);person(d,610,190,.25,K.gold);break;
  case'railNetwork':for(let i=0;i<6;i++)cc(a,-620+i*250,-130+(i%2)*260,28,[K.red,K.gold,K.blue,K.jade][i%4]);ln(b,[[-620,-130],[-370,130],[-120,-130],[130,130],[380,-130],[630,130]],K.steel,12);for(let i=0;i<5;i++)arrow(c,[-500+i*250,0],[-370+i*250,(i%2? -130:130)],K.gold,4);person(d,0,0,.25,K.paper);break;
  case'civilServiceExam':rr(a,0,0,1500,590,'#131A1F',14);paper(b,-420,0,440,470,'EXAM');for(let i=0;i<7;i++)rr(b,-420,-140+i*47,300,6,K.muted,2);for(let i=0;i<4;i++)person(c,220+i*170,110,.22,i===v%4?K.gold:K.paper);rr(d,430,-150,420,100,K.deep,10,K.gold);tx(d,'MERIT',430,-150,29,K.gold);break;
  case'dataLab':rr(a,0,0,1500,590,'#0F1920',14);ln(b,[[-580,220],[-580,-220]],K.paper,3);ln(b,[[-580,220],[610,220]],K.paper,3);for(let i=0;i<28;i++)cc(c,-520+(i%10)*110,160-Math.floor(i/10)*150-((hash(scene.id+i.toString()))%80),9,i%5===0?K.gold:K.blue);monitor(d,520,-145,300,170);break;
  case'emergencyCenter':rr(a,0,0,1500,590,'#101820',14);for(let i=0;i<4;i++)monitor(b,-510+i*340,-80,290,170);for(let i=0;i<6;i++)person(c,-580+i*220,170,.2,i===v%6?K.gold:K.paper);cc(d,0,-245,35,K.red);break;
  case'disasterDesk':rr(a,0,0,1500,590,'#17191A',14);desk(b,0,145,1180);for(let i=0;i<4;i++)paper(c,-420+i*280,-30,230,170,['本人確認','罹災証明','住所','所得'][i]);person(d,-590,20,.33,K.paper);break;
  case'landMap':rr(a,0,0,1500,590,'#142017',14);for(let r=0;r<4;r++)for(let c0=0;c0<7;c0++)rr(b,-600+c0*200,-180+r*120,170,90,['#334B37','#3B543C','#4A6046'][((r+c0+v)%3)],2,K.cream,1);for(let i=0;i<7;i++)tx(c,String(100+i),-600+i*200,-180+(i%4)*120,16,K.cream);paper(d,530,-220,260,130,'地番');break;
  case'forestGrid':rr(a,0,0,1500,590,'#102016',14);for(let i=0;i<35;i++){const x=-620+(i%9)*155,y=-190+Math.floor(i/9)*125;ln(b,[[x,y+40],[x,y-10]],K.brown,6);cc(c,x,y-25,30,[K.green,K.jade,'#486C52'][i%3])}rr(d,0,0,1380,520,'#00000000',3,K.gold,2);break;
  case'appealsRoom':rr(a,0,0,1500,590,'#121920',14);rr(b,-400,0,500,430,K.panel,16,K.red);rr(c,400,0,500,430,K.panel,16,K.jade);person(d,-400,100,.3,K.paper);break;
  case'apartmentParking':rr(a,0,40,1500,500,'#18232A',12);for(let i=0;i<4;i++)house(a,-560+i*360,-105,250,150,'#26353D');road(b,180);for(let i=0;i<4;i++)car(c,-520+i*340,120,.52,i===v%4?K.gold:K.blue);person(d,-690,125,.25,K.paper);break;
  case'carInterior':rr(a,0,40,1500,500,'#11191F',18);rr(b,0,105,1250,250,'#202B31',90);cc(b,-390,95,145,K.ink,K.steel,18);cc(b,-390,95,68,'#00000000',K.paper,10);rr(c,360,-20,430,220,'#0E2731',16,K.steel);person(d,520,105,.22,K.gold);break;
  case'suburbRoad':road(a,160);for(let i=0;i<5;i++)house(b,-650+i*330,-100,230,140,['#26353D','#2B3434','#2D313B'][i%3]);for(let i=0;i<6;i++)tree(c,-760+i*300,60,.55);car(d,-320+(v%4)*220,105,.6,K.gold);break;
  case'childcareRoute':road(a,150);house(b,-520,-85,380,210,'#3A3030');tx(b,'保育園',-520,-90,27,K.paper);building(c,420,-65,380,330,'#19303A');car(d,-40,110,.58,K.gold);break;
  case'busStop':road(a,170);rr(b,-420,-20,18,290,K.steel,4);rr(b,-420,-155,150,70,K.deep,8,K.gold);tx(b,'BUS',-420,-155,20,K.gold);bus(c,290,100,.65,K.jade);person(d,-610,145,.24,K.paper);break;
  case'busTransfer':rr(a,0,40,1500,500,'#152027',14);for(let i=0;i<3;i++){rr(b,-500+i*500,100,380,160,K.panel2,12,[K.blue,K.gold,K.jade][i]);tx(b,['1番','駅前','2番'][i],-500+i*500,100,24,K.paper)}bus(c,-520,-100,.48,K.blue);bus(d,500,-90,.48,K.jade);break;
  case'daycare':rr(a,0,55,1500,470,'#20262A',16);house(b,0,-55,900,300,'#334A42');tx(b,'保育園',0,-115,34,K.cream);for(let i=0;i<6;i++)person(c,-520+i*205,125,.18,[K.gold,K.blue,K.jade][i%3]);rr(d,480,80,240,130,K.red2,12,K.gold);break;
  case'welfareOffice':rr(a,0,20,1500,520,'#111A21',14);desk(b,0,120,1180);person(c,-500,20,.33,K.paper);person(c,500,20,.33,K.gold);for(let i=0;i<4;i++)paper(d,-360+i*240,-100,190,130,['収入','家賃','預金','資産'][i]);break;
  case'workplace':rr(a,0,20,1500,520,'#111A1D',14);for(let i=0;i<5;i++){desk(b,-560+i*280,130,220);monitor(c,-560+i*280,-15,170,105)}for(let i=0;i<5;i++)person(d,-560+i*280,80,.19,i===v%5?K.gold:K.paper);break;
  case'usedCarLot':rr(a,0,40,1500,500,'#151C20',12);road(a,190);for(let i=0;i<5;i++)car(b,-600+i*300,105,.48,[K.blue,K.jade,K.red,K.gold,K.violet][i]);for(let i=0;i<5;i++)pill(c,['8万','12万','20万','35万','48万'][i],-600+i*300,-150,170,i===v%5?K.gold:K.muted);person(d,620,140,.22,K.paper);break;
  case'repairGarage':rr(a,0,20,1500,520,'#1B1B1A',12);rr(b,0,-30,900,360,'#23272A',8,K.steel);car(c,0,90,.85,K.orange);for(let i=0;i<4;i++)rr(d,-500+i*330,-180,210,65,K.deep,7,[K.red,K.gold,K.blue,K.jade][i]);break;
  case'hospital':rr(a,0,20,1500,520,'#101B1F',14);building(b,0,-20,900,470,'#E3E7E2');rr(c,0,-115,110,110,K.red,6);rr(c,0,-115,35,150,K.paper,0);rr(c,0,-115,150,35,K.paper,0);car(d,520,150,.46,K.gold);break;
  case'retro1963':rr(a,0,40,1500,500,'#241F1A',12);for(let i=0;i<5;i++)house(b,-600+i*300,-60,230,140,'#5A4A39');for(let i=0;i<7;i++)person(c,-650+i*210,150,.18,K.cream);bus(d,360,100,.48,K.orange);tx(d,'1963',-520,-200,54,K.gold);break;
  case'retroStreet':road(a,160);for(let i=0;i<5;i++)house(b,-650+i*330,-100,230,140,'#4D4336');for(let i=0;i<5;i++){cc(c,-580+i*290,120,34,K.ink,K.cream,4);ln(c,[[-580+i*290,120],[-520+i*290,120]],K.cream,5)}car(d,500,105,.43,K.red2);break;
  case'regionalTown':road(a,160);for(let i=0;i<4;i++)building(b,-560+i*370,-60,270,330,['#1A2A31','#24332B','#302B35'][i%3]);for(let i=0;i<5;i++)tree(c,-700+i*330,70,.5);car(d,-100,110,.58,K.gold);break;
  case'clockRoom':rr(a,0,20,1500,520,'#11181D',16);for(let i=0;i<5;i++)clockFace(b,-560+i*280,-20,92);tx(c,'TIME',0,180,46,K.gold);for(let i=0;i<5;i++)bar(d,-560+i*280,250,190,[.2,.45,.6,.78,.92][i],K.jade,['7:30','8:00','9:00','17:00','18:00'][i]);break;
  case'jobMap':rr(a,0,20,1500,520,'#102019',14);for(let i=0;i<9;i++)cc(b,-600+(i%5)*300,-130+Math.floor(i/5)*260,25,[K.blue,K.jade,K.gold,K.red][i%4]);cc(c,0,30,65,K.red);for(let i=0;i<9;i++)ln(c,[[0,30],[-600+(i%5)*300,-130+Math.floor(i/5)*260]],K.steel,3);car(d,0,210,.45,K.gold);break;
  case'smartphoneDesk':desk(a,0,140,1000);rr(b,0,-20,320,520,K.ink,38,K.steel,5);rr(b,0,-20,275,430,'#0C2732',24);for(let i=0;i<5;i++)rr(c,0,-135+i*70,220,48,K.panel2,8,[K.blue,K.jade,K.gold,K.red,K.violet][i]);person(d,-520,90,.28,K.paper);break;
  case'commuterTrain':rr(a,0,20,1500,520,'#182029',14);for(let i=0;i<5;i++)rr(b,-520+i*260,-150,190,150,'#233643',6,K.steel);ln(c,[[-700,150],[700,150]],K.steel,12);for(let i=0;i<10;i++)person(d,-650+i*145,120,.17,i===v%10?K.gold:K.paper);break;
  case'lowIncomeHome':rr(a,0,20,1500,520,'#191816',14);house(b,0,-30,1000,430,'#2A2925');desk(c,-260,120,480);paper(c,-260,40,250,150,'請求書');person(d,350,110,.3,K.paper);break;
  case'newsScreen':rr(a,0,20,1500,520,'#11171C',14);monitor(b,0,0,1100,480);tx(c,'生活保護　車保有を緩和検討',0,-100,38,K.paper);tx(c,'未就学児のひとり親',0,-25,30,K.gold);for(let i=0;i<4;i++)pill(d,['賛成','反対','不公平','必要'][i],-450+i*300,165,230,[K.jade,K.red,K.orange,K.blue][i]);break;
  case'library':rr(a,0,20,1500,520,'#191714',14);for(let i=0;i<4;i++)shelf(b,-560+i*380,15,300,420);paper(c,0,-120,360,240,'RESEARCH');person(d,520,140,.22,K.gold);break;
  case'courtroom':rr(a,0,20,1500,520,'#1A1717',14);rr(b,0,-125,720,180,K.brown,8,K.gold);desk(c,-420,145,360);desk(c,420,145,360);person(d,0,-40,.32,K.gold);break;
  case'communityHall':rr(a,0,20,1500,520,'#171B1B',14);for(let i=0;i<8;i++)person(b,-610+i*175,135,.18,[K.paper,K.gold,K.blue,K.jade][i%4]);rr(c,0,-135,900,180,K.panel2,10,K.gold);tx(d,'社会の納得',0,-135,32,K.gold);break;
  case'carShowroom':rr(a,0,20,1500,520,'#14191D',14);car(b,-350,80,.8,K.red);car(c,350,80,.8,K.blue);tx(d,'自由　豊かさ　移動',0,-190,34,K.gold);break;
  case'nightCity':rr(a,0,20,1500,520,'#070D13',14);for(let i=0;i<6;i++)building(b,-650+i*260,10,210,420,'#0E1C27');for(let i=0;i<6;i++)rr(c,-650+i*260,-80+(i%3)*90,24,30,K.gold,2);person(d,0,210,.22,K.paper);break;
  case'policeStation':rr(a,0,20,1500,520,'#101820',14);building(b,0,-20,900,450,'#172A38');tx(c,'POLICE',0,-170,34,K.blue);for(let i=0;i<4;i++)person(d,-420+i*280,140,.22,i===v%4?K.gold:K.paper);break;
  case'crossroads':road(a,160);rr(b,0,20,260,520,'#20262B',0);rr(b,0,20,1920,150,'#20262B',0);arrow(c,[-520,110],[-120,110],K.gold,6);arrow(c,[120,-170],[120,-40],K.red,6);arrow(c,[520,110],[120,110],K.jade,6);car(d,-420,110,.45,K.gold);break;
  case'prison':rr(a,0,20,1500,520,'#111315',14);for(let i=-3;i<=3;i++)ln(b,[[i*170,-220],[i*170,220]],K.steel,15);for(let i=0;i<5;i++)person(c,-480+i*240,135,.2,K.paper);rr(d,0,-160,600,90,K.deep,8,K.red);tx(d,'INCARCERATION',0,-160,24,K.red);break;
  case'budgetOffice':rr(a,0,20,1500,520,'#111A1F',14);for(let i=0;i<4;i++){paper(b,-450+i*300,-20,240,210,['福祉','警察','司法','医療'][i]);bar(c,-450+i*300,145,210,[.55,.35,.28,.42][i],[K.jade,K.blue,K.red,K.gold][i],['WELFARE','POLICE','COURT','HEALTH'][i])}person(d,620,160,.2,K.paper);break;
  case'debateRoom':rr(a,0,20,1500,520,'#17161A',14);rr(b,-380,0,520,380,K.panel,16,K.blue);rr(c,380,0,520,380,K.panel,16,K.red);person(d,-380,100,.25,K.paper);person(d,380,100,.25,K.paper);break;
  case'mazeRoom':rr(a,0,20,1500,520,'#11191D',14);for(let i=0;i<12;i++){const x=-600+(i%4)*400,y=-170+Math.floor(i/4)*170;rr(b,x,y,300,24,K.steel,4)}person(c,-650,190,.22,K.gold);cc(d,600,-180,28,K.red);break;
  case'toolBench':rr(a,0,20,1500,520,'#191916',14);desk(b,0,150,1100);for(let i=0;i<6;i++){ln(c,[[-500+i*200,-80],[-470+i*200,20]], [K.blue,K.gold,K.jade,K.red][i%4],12);cc(c,-500+i*200,-95,18,K.paper)}person(d,600,125,.22,K.gold);break;
  case'assessmentDesk':rr(a,0,20,1500,520,'#10191F',14);desk(b,0,145,1180);for(let i=0;i<5;i++)paper(c,-480+i*240,-45,190,160,['地域','時間','価値','保険','就労'][i]);person(d,0,115,.24,K.gold);break;
  case'carAuction':rr(a,0,20,1500,520,'#151A1D',14);for(let i=0;i<4;i++){car(b,-500+i*330,90,.5,[K.blue,K.red,K.jade,K.gold][i]);pill(c,['5万','12万','30万','80万'][i],-500+i*330,-150,180,i===v%4?K.gold:K.muted)}person(d,620,140,.2,K.paper);break;
  case'insuranceDesk':rr(a,0,20,1500,520,'#111A20',14);desk(b,0,140,1100);paper(c,-330,-20,330,260,'任意保険');paper(c,330,-20,330,260,'事故責任');person(d,0,100,.24,K.gold);break;
  case'staircase':for(let i=0;i<7;i++)rr(a,-480+i*160,180-i*70,180,70,[K.panel,K.panel2,'#26323A'][i%3],3,K.steel);person(b,-560,180,.2,K.paper);person(c,520,-240,.2,K.gold);tx(d,'支援の崖',0,-250,34,K.red);break;
  case'taxOffice':rr(a,0,20,1500,520,'#111A21',14);desk(b,0,145,1180);for(let i=0;i<5;i++)paper(c,-480+i*240,-40,190,160,['所得税','住民税','保険','車検','燃料'][i]);person(d,560,110,.23,K.paper);break;
  default:rr(a,0,0,1500,590,K.panel,14);tx(b,plan.space,0,-100,28,K.gold);person(c,0,100,.3,K.paper);cc(d,0,0,30,K.red);
 }
}

function buildDiagram(s:Node[],scene:Scene,plan:Plan){
 const [e,f,g,h,i,j,k,l]=s,L=plan.labels,v=plan.variant,seed=hash(plan.action);
 switch(plan.diagram){
  case'handoff':paper(e,-360,30,300,190,L[1]);paper(f,360,30,300,190,L[2]);arrow(g,[-180,30],[180,30],K.gold,9);person(h,-600,110,.25,K.paper);person(i,600,110,.25,K.gold);pill(j,L[3],0,-250,330,K.jade);cc(k,0,30,18,K.gold);ln(l,[[-620,250],[620,250]],K.floor,3);break;
  case'checksum':for(let q=0;q<4;q++){paper(e,-480+q*320,-20,250,170,['条件A','条件B','条件C','判定'][q]);cc(f,-480+q*320,100,18,q===3?K.gold:K.blue)}for(let q=0;q<3;q++)arrow(g,[-350+q*320,30],[-290+q*320,30],K.gold,5);pill(h,L[3],0,-260,340,K.gold);tx(i,'✓',480,120,50,K.jade);cc(j,480,120,48,'#00000000',K.jade);ln(k,[[-550,210],[550,210]],K.muted,3);cc(l,0,210,10,K.gold);break;
  case'barrier':rr(e,0,20,90,440,K.red2,6,K.red);pill(f,L[1],-420,-120,320,K.blue);pill(g,L[2],420,-120,320,K.gold);arrow(h,[-250,-70],[-80,-5],K.blue,7);ln(i,[[80,10],[260,90]],K.red,8);tx(j,'STOP',0,-20,25,K.paper);pill(k,L[3],0,270,350,K.red);cc(l,0,200,14,K.red);break;
  case'dissolve':for(let q=0;q<7;q++)paper(e,-540+q*180,-10,150,120,q<3?'書類':'規則');for(let q=0;q<7;q++)cc(f,-540+q*180,150,15,[K.red,K.gold,K.blue,K.jade][q%4]);tx(g,'→',0,-210,60,K.gold);pill(h,'消してみる',0,-285,300,K.red);for(let q=0;q<5;q++)cc(i,-360+q*180,240,8,K.muted);ln(j,[[-520,210],[520,210]],K.floor,3);pill(k,L[3],450,-250,300,K.muted);cc(l,-450,-250,12,K.gold);break;
  case'fork':cc(e,0,-90,28,K.gold);arrow(f,[0,-55],[-380,110],K.blue,8);arrow(g,[0,-55],[380,110],K.red,8);pill(h,L[1],-420,170,330,K.blue);pill(i,L[2],420,170,330,K.red);pill(j,L[3],0,-270,350,K.gold);person(k,-620,180,.2,K.paper);person(l,620,180,.2,K.paper);break;
  case'network':for(let q=0;q<8;q++){const ang=Math.PI*2*q/8,x=390*Math.cos(ang),y=180*Math.sin(ang);cc(e,x,y,30,[K.blue,K.gold,K.jade,K.red][q%4]);ln(f,[[0,0],[x,y]],K.steel,4)}cc(g,0,0,58,K.gold);tx(g,'中枢',0,0,18,K.ink);pill(h,L[1],-450,-270,300,K.blue);pill(i,L[2],0,-270,300,K.gold);pill(j,L[3],450,-270,300,K.jade);cc(k,0,0,80,'#00000000',K.gold);ln(l,[[-500,250],[500,250]],K.floor,3);break;
  case'split':ln(e,[[0,-230],[0,240]],K.gold,7);pill(f,L[1],-430,-120,330,K.blue);pill(g,L[2],430,-120,330,K.red);person(h,-430,80,.3,K.paper);person(i,430,80,.3,K.paper);arrow(j,[-160,0],[-350,0],K.blue,6);arrow(k,[160,0],[350,0],K.red,6);pill(l,L[3],0,270,360,K.gold);break;
  case'memory':for(let q=0;q<6;q++)paper(e,-500+q*200,-30+(q%2)*90,170,110,'記録');arrow(f,[-500,-170],[500,-170],K.gold,6);pill(g,L[1],-420,230,300,K.blue);pill(h,L[2],0,230,300,K.gold);pill(i,L[3],420,230,300,K.jade);cc(j,-500,-170,18,K.blue);cc(k,500,-170,18,K.gold);tx(l,'MEMORY',0,-260,30,K.paper);break;
  case'pipeline':for(let q=0;q<5;q++){rr(e,-520+q*260,10,210,120,K.panel2,12,[K.blue,K.jade,K.gold,K.orange,K.red][q]);tx(f,['入力','確認','処理','承認','出力'][q],-520+q*260,10,19,K.paper);if(q<4)arrow(g,[-405+q*260,10],[-375+q*260,10],K.gold,4)}pill(h,L[1],-390,-220,300,K.blue);pill(i,L[2],0,-220,300,K.gold);pill(j,L[3],390,-220,300,K.jade);ln(k,[[-620,210],[620,210]],K.floor,3);cc(l,520,10,16,K.red);break;
  case'loop':for(let q=0;q<4;q++){const x=q===0?-350:q===1?350:q===2?350:-350,y=q<2?-90:150;cc(e,x,y,55,[K.blue,K.gold,K.red,K.jade][q])}arrow(f,[-280,-90],[280,-90],K.gold);arrow(g,[350,-20],[350,85],K.gold);arrow(h,[280,150],[-280,150],K.gold);arrow(i,[-350,85],[-350,-20],K.gold);pill(j,L[1],0,-270,340,K.blue);pill(k,L[2],0,275,340,K.red);tx(l,L[3],0,30,27,K.paper);break;
  case'layers':for(let q=0;q<5;q++){rr(e,0,140-q*72,920-q*120,62,[K.panel2,'#1A3033','#29352D','#382D2E','#423521'][q],8,[K.blue,K.jade,K.gold,K.red,K.orange][q]);}pill(f,L[1],-430,-250,300,K.blue);pill(g,L[2],0,-250,300,K.gold);pill(h,L[3],430,-250,300,K.jade);arrow(i,[550,180],[550,-160],K.gold);cc(j,550,-160,14,K.gold);ln(k,[[-520,250],[520,250]],K.floor,3);tx(l,'積み上がる',0,250,23,K.paper);break;
  case'matrix':for(let r=0;r<3;r++)for(let c0=0;c0<4;c0++){rr(e,-450+c0*300,-100+r*120,220,85,K.panel2,8,[K.blue,K.gold,K.jade,K.red][(r+c0)%4]);tx(f,String.fromCharCode(65+r*4+c0),-450+c0*300,-100+r*120,17,K.muted)}pill(g,L[1],-420,-275,300,K.blue);pill(h,L[2],0,-275,300,K.gold);pill(i,L[3],420,-275,300,K.jade);cc(j,0,20,16,K.red);ln(k,[[-560,245],[560,245]],K.floor,3);tx(l,'分類表',0,275,22,K.paper);break;
  case'question':cc(e,0,-20,150,K.deep,K.gold);tx(f,'？',0,-25,150,K.gold);pill(g,L[1],-430,210,320,K.blue);pill(h,L[2],0,210,320,K.red);pill(i,L[3],430,210,320,K.gold);ln(j,[[-580,-220],[580,-220]],K.muted,3);cc(k,0,-20,185,'#00000000',K.muted);tx(l,'問いを残す',0,-285,24,K.paper);break;
  case'scale':ln(e,[[0,-190],[0,180]],K.gold,8);ln(e,[[-620,-120],[620,-120]],K.muted,8);rr(f,-430,80,520,200,K.panel,16,K.blue);rr(g,430,80,520,200,K.panel,16,K.red);tx(h,L[1],-430,80,24,K.blue);tx(i,L[2],430,80,24,K.red);cc(j,0,-190,25,K.gold);pill(k,L[3],0,265,360,K.gold);ln(l,[[-430,-120],[-430,0]],K.blue,4);break;
  case'overflow':for(let q=0;q<10;q++)paper(e,-600+(q%5)*300,-120+Math.floor(q/5)*190,230,130,['税','兵','土地','戸籍','穀物'][q%5]);cc(f,0,-260,58,K.gold);for(let q=0;q<5;q++)arrow(g,[0,-210],[-600+q*300,-160],K.red,4);pill(h,L[1],-430,260,300,K.blue);pill(i,L[2],0,260,300,K.gold);pill(j,L[3],430,260,300,K.red);tx(k,'容量超過',0,0,28,K.red);cc(l,0,0,70,'#00000000',K.red);break;
  case'ledger':rr(e,0,10,1050,500,'#D7C8A8',8,K.gold);for(let r=0;r<6;r++)ln(f,[[-460,-180+r*72],[460,-180+r*72]],'#746C60',3);for(let c0=0;c0<4;c0++)ln(g,[[-460+c0*300,-210],[-460+c0*300,210]],'#746C60',3);pill(h,L[1],-410,-265,300,K.blue);pill(i,L[2],0,-265,300,K.gold);pill(j,L[3],410,-265,300,K.jade);tx(k,'台帳',0,250,24,K.paper);cc(l,420,185,14,K.red);break;
  case'flow':for(let q=0;q<4;q++){cc(e,-480+q*320,20,48,[K.blue,K.gold,K.jade,K.red][q]);if(q<3)arrow(f,[-420+q*320,20],[-220+q*320,20],K.gold,6)}pill(g,L[1],-430,-220,320,K.blue);pill(h,L[2],0,-220,320,K.gold);pill(i,L[3],430,-220,320,K.jade);arrow(j,[480,90],[-480,170],K.muted,4);tx(k,'戻る情報',0,205,20,K.muted);cc(l,-480,170,14,K.muted);break;
  case'timeline':ln(e,[[-650,20],[650,20]],K.gold,8);for(let q=0;q<5;q++){cc(f,-560+q*280,20,20,[K.blue,K.jade,K.gold,K.orange,K.red][q]);tx(g,String(q+1),-560+q*280,70,17,K.paper)}pill(h,L[1],-430,-220,310,K.blue);pill(i,L[2],0,-220,310,K.gold);pill(j,L[3],430,-220,310,K.red);arrow(k,[-650,140],[650,140],K.muted,4);tx(l,'時間',0,195,20,K.muted);break;
  case'sieve':for(let q=0;q<9;q++)cc(e,-560+q*140,-170,22,[K.blue,K.gold,K.jade,K.red][q%4]);ln(f,[[-600,-110],[-250,60],[250,60],[600,-110]],K.gold,7);for(let q=0;q<4;q++)cc(g,-210+q*140,130,26,K.gold);pill(h,L[1],-420,250,300,K.blue);pill(i,L[2],0,250,300,K.gold);pill(j,L[3],420,250,300,K.jade);tx(k,'選抜',0,20,27,K.paper);cc(l,0,150,75,'#00000000',K.gold);break;
  case'comparison':rr(e,-420,20,650,450,K.panel,18,K.blue);rr(f,420,20,650,450,K.panel,18,K.gold);tx(g,L[1],-420,-140,27,K.blue);tx(h,L[2],420,-140,27,K.gold);pill(i,L[3],0,275,380,K.red);ln(j,[[0,-205],[0,215]],K.floor,4);cc(k,-420,70,65,K.blue);cc(l,420,70,65,K.gold);break;
  case'container':rr(e,0,20,950,460,K.panel,20,K.gold);cc(f,0,-40,90,K.red);tx(f,'権力',0,-40,24,K.paper);arrow(g,[0,60],[0,150],K.gold,8);rr(h,0,170,460,110,K.deep,12,K.gold);tx(h,'役職',0,170,26,K.gold);pill(i,L[1],-430,-250,300,K.blue);pill(j,L[2],0,-250,300,K.gold);pill(k,L[3],430,-250,300,K.jade);cc(l,0,170,18,K.gold);break;
  case'partition':rr(e,0,0,1200,500,K.panel,16,K.steel);for(let q=0;q<4;q++){rr(f,-450+q*300,0,250,380,'#162A34',10,[K.blue,K.jade,K.gold,K.red][q]);tx(g,['担当A','担当B','担当C','担当D'][q],-450+q*300,-130,20,K.paper)}pill(h,L[1],-420,270,300,K.blue);pill(i,L[2],0,270,300,K.gold);pill(j,L[3],420,270,300,K.jade);ln(k,[[-300,-190],[-300,190]],K.floor,2);cc(l,450,130,14,K.red);break;
  case'hierarchy':for(let q=0;q<5;q++){const w=1050-q*150;rr(e,0,180-q*85,w,62,[K.steel,K.blue,K.jade,K.gold,K.red][q],7)}arrow(f,[600,200],[600,-190],K.gold,7);pill(g,L[1],-420,-250,300,K.blue);pill(h,L[2],0,-250,300,K.gold);pill(i,L[3],420,-250,300,K.red);cc(j,0,-160,20,K.red);tx(k,'上へ',640,-20,20,K.paper);ln(l,[[-520,250],[520,250]],K.floor,3);break;
  case'spotlight':cc(e,0,-20,180,K.deep,K.gold);cc(f,0,-20,110,K.panel2);tx(g,L[1],0,-20,24,K.gold);for(let q=0;q<7;q++)cc(h,-600+q*200,180,20,q===v%7?K.gold:K.muted);pill(i,L[2],-350,-250,320,K.blue);pill(j,L[3],350,-250,320,K.red);arrow(k,[0,90],[0,150],K.gold);ln(l,[[-620,240],[620,240]],K.floor,3);break;
  case'collapse':for(let q=0;q<6;q++)rr(e,-500+q*200,120-(q%3)*100,160,220,K.panel2,9,[K.blue,K.jade,K.gold,K.red][q%4]);ln(f,[[-620,-190],[620,190]],K.red,12);pill(g,L[1],-430,-250,300,K.blue);pill(h,L[2],0,-250,300,K.gold);pill(i,L[3],430,-250,300,K.red);cc(j,0,0,45,K.red);tx(k,'停止',0,0,20,K.paper);cc(l,0,0,75,'#00000000',K.red);break;
  case'balance':ln(e,[[0,-180],[0,165]],K.gold,8);ln(e,[[-570,-110],[570,-110]],K.muted,8);cc(f,-420,-110,40,K.blue);cc(g,420,-110,40,K.red);pill(h,L[1],-420,100,320,K.blue);pill(i,L[2],420,100,320,K.red);pill(j,L[3],0,270,380,K.gold);cc(k,0,-180,25,K.gold);ln(l,[[-420,-70],[-420,0]],K.blue,4);break;
  case'target':for(let q=0;q<3;q++)cc(e,0,10,210-q*60,q===2?K.gold:'#00000000',[K.red,K.paper,K.gold][q],8);arrow(f,[-600,-120],[-120,-20],K.gold,10);pill(g,L[1],-430,-250,320,K.blue);pill(h,L[2],0,-250,320,K.gold);pill(i,L[3],430,-250,320,K.red);cc(j,0,10,26,K.gold);tx(k,'目的',0,115,22,K.paper);ln(l,[[-520,250],[520,250]],K.floor,3);break;
  case'scatter':ln(e,[[-590,220],[-590,-220]],K.paper,3);ln(e,[[-590,220],[610,220]],K.paper,3);for(let q=0;q<35;q++){const x=-530+(q%12)*95,y=170-Math.floor(q/12)*145-((seed+q*37)%75);cc(f,x,y,8,q%6===0?K.gold:K.blue)}ln(g,[[-500,160],[470,-150]],K.jade,6);pill(h,L[1],-430,-250,300,K.blue);pill(i,L[2],0,-250,300,K.gold);pill(j,L[3],430,-250,300,K.jade);tx(k,'35',560,-180,45,K.gold);cc(l,470,-150,14,K.jade);break;
  case'grid':for(let r=0;r<4;r++)for(let c0=0;c0<7;c0++)rr(e,-540+c0*180,-150+r*110,150,80,'#1A2D2A',4,K.jade,1);for(let q=0;q<7;q++)tx(f,String(101+q),-540+q*180,-150+(q%4)*110,16,K.cream);pill(g,L[1],-430,-260,300,K.blue);pill(h,L[2],0,-260,300,K.gold);pill(i,L[3],430,-260,300,K.red);ln(j,[[-600,220],[600,220]],K.gold,4);cc(k,0,220,13,K.gold);tx(l,'可読化',0,275,22,K.paper);break;
  case'reverse':arrow(e,[-560,-80],[0,-80],K.blue,8);arrow(f,[560,100],[0,100],K.red,8);cc(g,0,10,60,K.gold);pill(h,L[1],-430,-240,320,K.blue);pill(i,L[2],430,-240,320,K.red);pill(j,L[3],0,260,380,K.gold);tx(k,'戻る',0,10,21,K.ink);ln(l,[[-520,210],[520,210]],K.floor,3);break;
  case'gateway':rr(e,0,20,160,430,K.panel2,8,K.gold);ln(f,[[-80,-195],[-80,235]],K.gold,10);ln(f,[[80,-195],[80,235]],K.gold,10);arrow(g,[-600,20],[-100,20],K.red,7);arrow(h,[100,20],[600,20],K.jade,7);pill(i,L[1],-430,-255,310,K.red);pill(j,L[2],0,-255,310,K.gold);pill(k,L[3],430,-255,310,K.jade);cc(l,0,20,24,K.gold);break;
  case'continuity':for(let q=0;q<5;q++){person(e,-520+q*260,40,.28,q===v%5?K.gold:K.paper);arrow(f,[-430+q*260,40],[-350+q*260,40],K.gold,4)}pill(g,L[1],-430,-230,300,K.blue);pill(h,L[2],0,-230,300,K.gold);pill(i,L[3],430,-230,300,K.jade);ln(j,[[-600,200],[600,200]],K.gold,5);tx(k,'組織は続く',0,255,23,K.paper);cc(l,0,200,15,K.gold);break;
  case'assembly':for(let q=0;q<5;q++){const x=-500+q*250;rr(e,x,20,190,120,K.panel2,10,[K.red,K.blue,K.gold,K.jade,K.violet][q]);tx(f,['規則','役職','記録','試験','手続き'][q],x,20,18,K.paper);if(q<4)arrow(g,[x+100,20],[x+145,20],K.gold,4)}pill(h,L[1],-430,-230,300,K.blue);pill(i,L[2],0,-230,300,K.gold);pill(j,L[3],430,-230,300,K.jade);cc(k,0,200,58,K.gold);tx(l,'官僚制',0,200,20,K.ink);break;
  case'reveal':for(let q=0;q<9;q++)cc(e,-480+(q%5)*240,-120+Math.floor(q/5)*200,30,q===8?K.gold:K.muted);ln(f,[[-540,220],[540,220]],K.floor,4);tx(g,'人間を信じない',0,-230,40,K.gold);pill(h,L[1],-430,260,310,K.blue);pill(i,L[2],0,260,310,K.red);pill(j,L[3],430,260,310,K.jade);cc(k,0,20,130,'#00000000',K.gold);tx(l,'だから続く',0,20,34,K.paper);break;
  case'map':ln(e,[[-620,-140],[-430,-210],[-260,-80],[-80,-140],[120,20],[330,-30],[560,120]],K.green,35);for(let q=0;q<6;q++)cc(f,-500+q*200,-80+(q%3)*90,20,[K.blue,K.gold,K.red,K.jade][q%4]);pill(g,L[1],-430,245,300,K.blue);pill(h,L[2],0,245,300,K.gold);pill(i,L[3],430,245,300,K.jade);paper(j,450,-220,250,130,'行政地図');arrow(k,[300,-130],[100,-20],K.gold,5);cc(l,100,-20,12,K.gold);break;
  case'paradox':cc(e,-300,0,100,K.blue);cc(f,300,0,100,K.red);ln(g,[[-180,0],[180,0]],K.gold,8);tx(h,'=',0,-10,55,K.gold);pill(i,L[1],-420,-230,310,K.blue);pill(j,L[2],420,-230,310,K.red);pill(k,L[3],0,260,380,K.gold);cc(l,0,0,28,K.gold);break;
  case'swap':pill(e,L[1],-430,-80,350,K.blue);pill(f,L[2],430,-80,350,K.red);arrow(g,[-220,-40],[220,110],K.gold,8);arrow(h,[220,-40],[-220,110],K.gold,8);pill(i,L[3],0,250,380,K.gold);tx(j,'手段 ↔ 目的',0,-250,31,K.paper);cc(k,0,30,24,K.gold);ln(l,[[-520,200],[520,200]],K.floor,3);break;
  case'route':for(let q=0;q<5;q++){const x=-520+q*260,y=(q%2?80:-70);cc(e,x,y,34,[K.blue,K.gold,K.jade,K.red,K.violet][q]);if(q<4)arrow(f,[x+40,y],[x+220,(q%2? -70:80)],K.gold,5)}pill(g,L[1],-430,-250,300,K.blue);pill(h,L[2],0,-250,300,K.gold);pill(i,L[3],430,-250,300,K.jade);car(j,0,205,.35,K.gold);ln(k,[[-600,245],[600,245]],K.floor,3);cc(l,520,80,12,K.red);break;
  case'clock':clockFace(e,0,0,180);pill(f,L[1],-430,-250,300,K.blue);pill(g,L[2],0,-250,300,K.gold);pill(h,L[3],430,-250,300,K.jade);for(let q=0;q<4;q++)bar(i,-450+q*300,240,220,[.25,.5,.7,.9][q],[K.blue,K.jade,K.gold,K.red][q],String(q+1));tx(j,'TIME',0,0,30,K.paper);cc(k,0,0,22,K.red);ln(l,[[-560,190],[560,190]],K.floor,3);break;
  case'costStack':for(let q=0;q<6;q++){rr(e,0,190-q*66,780-q*70,52,[K.panel2,K.red2,K.blue,K.jade,K.orange,K.violet][q],7);tx(f,['燃料','保険','税','車検','修理','駐車'][q],0,190-q*66,17,K.paper)}pill(g,L[1],-420,-255,300,K.blue);pill(h,L[2],0,-255,300,K.gold);pill(i,L[3],420,-255,300,K.red);arrow(j,[520,200],[520,-180],K.gold,6);cc(k,520,-180,12,K.gold);tx(l,'維持費',0,255,22,K.paper);break;
  case'radius':cc(e,0,30,65,K.red);for(let q=0;q<4;q++)cc(f,0,30,120+q*80,'#00000000',[K.blue,K.jade,K.gold,K.red][q],3);for(let q=0;q<12;q++){const a=Math.PI*2*q/12;cc(g,Math.cos(a)*(150+(q%4)*75),30+Math.sin(a)*(150+(q%4)*75),10,q%3===0?K.gold:K.paper)}pill(h,L[1],-420,-260,300,K.blue);pill(i,L[2],0,-260,300,K.gold);pill(j,L[3],420,-260,300,K.jade);car(k,0,220,.3,K.gold);tx(l,'求人半径',0,275,20,K.paper);break;
  case'twoWallets':rr(e,-320,20,480,330,K.panel,15,K.blue);rr(f,320,20,480,330,K.panel,15,K.red);tx(g,'自分の負担',-320,-80,24,K.blue);tx(h,'社会の負担',320,-80,24,K.red);for(let q=0;q<4;q++)cc(i,-420+q*70,80,18,K.gold);for(let q=0;q<4;q++)cc(j,220+q*70,80,18,K.gold);arrow(k,[-80,20],[80,20],K.gold,7);pill(l,L[3],0,260,380,K.gold);break;
  case'carin':for(let q=0;q<5;q++){const a=-Math.PI/2+Math.PI*2*q/5,x=Math.cos(a)*350,y=Math.sin(a)*180;cc(e,x,y,62,[K.blue,K.jade,K.gold,K.red,K.violet][q]);tx(f,['C','A','R','I','N'][q],x,y,26,K.paper)}cc(g,0,0,70,K.deep,K.gold);tx(g,'判断',0,0,20,K.gold);pill(h,L[1],-430,260,300,K.blue);pill(i,L[2],0,260,300,K.gold);pill(j,L[3],430,260,300,K.jade);ln(k,[[-500,-220],[500,-220]],K.floor,3);tx(l,'deservingness',0,-255,22,K.paper);break;
  case'threshold':ln(e,[[-600,100],[600,100]],K.paper,4);ln(f,[[0,-220],[0,220]],K.red,9);for(let q=0;q<7;q++)cc(g,-500+q*170,100-(q%3)*80,24,q<3?K.blue:K.gold);pill(h,L[1],-420,-260,300,K.blue);pill(i,L[2],0,-260,300,K.gold);pill(j,L[3],420,-260,300,K.red);tx(k,'境界',0,-140,25,K.red);arrow(l,[-200,210],[200,210],K.gold,5);break;
  case'symbol':car(e,0,30,.9,K.gold);pill(f,'移動',-420,-220,260,K.blue);pill(g,'自由',0,-220,260,K.gold);pill(h,'豊かさ',420,-220,260,K.red);cc(i,0,30,200,'#00000000',K.gold,4);for(let q=0;q<5;q++)cc(j,-300+q*150,230,12,[K.blue,K.jade,K.gold,K.red,K.violet][q]);tx(k,'象徴化',0,270,21,K.paper);ln(l,[[-520,200],[520,200]],K.floor,3);break;
  case'bar':ln(e,[[-580,220],[-580,-220]],K.paper,3);ln(e,[[-580,220],[620,220]],K.paper,3);for(let q=0;q<4;q++){const hgt=[.2,.4,.6,.85][q]*360;rr(f,-380+q*260,220-hgt/2,150,hgt,[K.blue,K.jade,K.gold,K.red][q],5)}pill(g,L[1],-430,-260,300,K.blue);pill(h,L[2],0,-260,300,K.gold);pill(i,L[3],430,-260,300,K.red);tx(j,'増加',540,-140,24,K.red);arrow(k,[430,120],[540,-80],K.red,5);cc(l,540,-80,12,K.red);break;
  case'choiceSet':for(let q=0;q<7;q++){const a=Math.PI*2*q/7,x=Math.cos(a)*380,y=Math.sin(a)*180;rr(e,x,y,170,80,K.panel2,8,[K.blue,K.jade,K.gold,K.red][q%4]);tx(f,['仕事','食事','住居','医療','合法','違法','支援'][q],x,y,17,K.paper)}cc(g,0,0,70,K.deep,K.gold);tx(g,'選択',0,0,20,K.gold);pill(h,L[1],-420,260,300,K.blue);pill(i,L[2],0,260,300,K.gold);pill(j,L[3],420,260,300,K.red);cc(k,0,0,95,'#00000000',K.gold);ln(l,[[-500,-230],[500,-230]],K.floor,3);break;
  case'budgetShift':for(let q=0;q<4;q++){rr(e,-450+q*300,30,230,300,K.panel,10,[K.jade,K.blue,K.red,K.gold][q]);tx(f,['福祉','警察','司法','医療'][q],-450+q*300,-70,20,K.paper)}arrow(g,[-330,40],[-100,40],K.gold,6);arrow(g,[30,40],[270,40],K.gold,6);pill(h,L[1],-420,-260,300,K.jade);pill(i,L[2],0,-260,300,K.gold);pill(j,L[3],420,-260,300,K.red);tx(k,'同じ財布',0,230,26,K.paper);cc(l,0,230,45,'#00000000',K.gold);break;
  case'externality':cc(e,0,0,75,K.red);for(let q=0;q<6;q++){const a=Math.PI*2*q/6,x=Math.cos(a)*380,y=Math.sin(a)*190;cc(f,x,y,40,[K.blue,K.jade,K.gold,K.red,K.violet,K.orange][q]);arrow(g,[0,0],[x,y],K.steel,4)}pill(h,L[1],-420,260,300,K.blue);pill(i,L[2],0,260,300,K.gold);pill(j,L[3],420,260,300,K.red);tx(k,'波及',0,0,20,K.paper);cc(l,0,0,105,'#00000000',K.red,3);break;
  default:rr(e,0,0,1100,500,K.panel,15,K.gold);tx(f,plan.diagram,0,-80,28,K.gold);pill(g,L[1],-350,150,300,K.blue);pill(h,L[2],0,150,300,K.gold);pill(i,L[3],350,150,300,K.jade);cc(j,0,0,30,K.red);ln(k,[[-500,240],[500,240]],K.floor,3);cc(l,500,240,10,K.gold);
 }
}

const STEPS=[1,5,7,11];
function orderFor(program:number){const start=program%12,step=STEPS[Math.floor(program/12)%4],phase=Math.floor(program/48)%2;let arr=Array.from({length:12},(_,i)=>(start+i*step)%12);if(phase){arr=[...arr.slice(6),...arr.slice(0,6)];for(let i=0;i<12;i+=3){const t=arr[i];arr[i]=arr[i+2];arr[i+2]=t}}return arr}
function initStage(n:Node,slot:number,plan:Plan){const p=plan.actionProgram,mode=p%9,side=(slot+p)%2?1:-1,mag=45+((p*17+slot*29)%105);n.opacity(0);n.scale(.88+((p+slot)%5)*.025);if(mode===0){n.x(side*mag);n.y(0)}else if(mode===1){n.x(0);n.y(side*mag)}else if(mode===2){n.x(side*mag);n.y(-side*(25+slot%4*18))}else if(mode===3){n.x(side*(20+slot*15));n.y(side*mag)}else if(mode===4){n.x(side*mag*.55);n.y(-mag*.45)}else if(mode===5){n.x(-side*mag*.6);n.y(mag*.35)}else if(mode===6){n.x(side*(70+slot*8));n.y(0)}else if(mode===7){n.x(0);n.y(-80-(slot%3)*25)}else{n.x(side*(35+(slot%5)*12));n.y(side*(35+((slot+2)%4)*16))}}
function* directorFlow(s:Node[],scene:Scene,plan:Plan):ThreadGenerator{
 const order=orderFor(plan.actionProgram),d=scene.duration,slot=d/12;
 s.forEach((n,idx)=>initStage(n,idx,plan));
 for(let step=0;step<12;step++){
  const idx=order[step],n=s[idx];
  const reveal=Math.min(.22,slot*.42),accent=Math.min(.10,slot*.22);
  let spent=reveal;
  yield* all(n.opacity(1,reveal),n.x(0,reveal),n.y(0,reveal),n.scale(1,reveal));
  const verb=(plan.actionProgram+step)%7;
  if(verb===0){yield* n.scale(1.045,accent);yield* n.scale(1,accent);spent+=accent*2}
  else if(verb===1){yield* n.x((step%2?1:-1)*(9+plan.variant*2),accent);yield* n.x(0,accent);spent+=accent*2}
  else if(verb===2){yield* n.y((step%2?1:-1)*(8+plan.variant),accent);yield* n.y(0,accent);spent+=accent*2}
  else if(verb===3&&step>2){const prev=s[order[step-2]];yield* all(prev.opacity(.48,accent),n.scale(1.03,accent));yield* all(prev.opacity(.88,accent),n.scale(1,accent));spent+=accent*2}
  else if(verb===4){yield* n.opacity(.72,accent);yield* n.opacity(1,accent);spent+=accent*2}
  else if(verb===5&&step>3){const prev=s[order[step-3]];yield* all(prev.x(-12,accent),n.x(12,accent));yield* all(prev.x(0,accent),n.x(0,accent));spent+=accent*2}
  else{yield* n.scale(.985,accent);yield* n.scale(1,accent);spent+=accent*2}
  if(spent<slot)yield* waitFor(slot-spent);
 }
}
function* cameraFlow(n:Node,d:number,plan:Plan):ThreadGenerator{const q=d/5;n.x(0);n.y(0);n.scale(1);switch(plan.camera%14){
 case 0:yield* waitFor(d);break;case 1:yield* n.scale(1.024,d);break;case 2:yield* n.scale(.992,q);yield* n.scale(1.02,q*2);yield* n.scale(1,q*2);break;
 case 3:yield* n.x(-16,q);yield* n.x(8,q);yield* n.x(-5,q);yield* n.x(3,q);yield* n.x(0,q);break;
 case 4:yield* n.x(16,q);yield* n.x(-8,q);yield* n.x(5,q);yield* n.x(-3,q);yield* n.x(0,q);break;
 case 5:yield* n.y(-11,q);yield* n.y(6,q);yield* n.y(-4,q);yield* n.y(2,q);yield* n.y(0,q);break;
 case 6:yield* n.y(11,q);yield* n.y(-6,q);yield* n.y(4,q);yield* n.y(-2,q);yield* n.y(0,q);break;
 case 7:yield* n.scale(1.012,q);yield* n.scale(1.03,q);yield* n.scale(1.018,q);yield* n.scale(1.035,q);yield* n.scale(1,q);break;
 case 8:yield* n.scale(.988,q);yield* n.scale(1.012,q);yield* n.scale(1.026,q);yield* n.scale(1.008,q);yield* n.scale(1,q);break;
 case 9:yield* n.x(-12,q);yield* n.x(-4,q);yield* n.x(10,q);yield* n.x(4,q);yield* n.x(0,q);break;
 case 10:yield* n.y(-8,q);yield* n.y(-2,q);yield* n.y(9,q);yield* n.y(3,q);yield* n.y(0,q);break;
 case 11:yield* n.scale(1.018,q*2);yield* waitFor(q);yield* n.scale(1.008,q);yield* n.scale(1,q);break;
 case 12:yield* n.x(10,q);yield* n.x(5,q);yield* n.x(-9,q);yield* n.x(-4,q);yield* n.x(0,q);break;
 default:yield* n.scale(.994,q);yield* n.scale(1.018,q);yield* n.scale(1.004,q);yield* n.scale(1.028,q);yield* n.scale(1,q);break;
}}
function* subtitleFlow(cues:Cue[],caption:Txt,duration:number):ThreadGenerator{
 let cursor=0;
 for(const c of cues){
  if(c.start>cursor)yield* waitFor(c.start-cursor);
  caption.text(c.display);
  if(c.end>c.start)yield* waitFor(c.end-c.start);
  caption.text('');
  cursor=c.end;
 }
 if(duration>cursor)yield* waitFor(duration-cursor);
}
export function* playMeaningScene(view:View2D,scene:Scene):ThreadGenerator{
 const plan=(visualPlan as Record<string,Plan>)[scene.motif];if(!plan)throw new Error('V134 visual plan missing '+scene.motif);view.fill(K.bg);
 const contentLayer=new Node({}),headingLayer=new Node({}),subtitleBacking=new Node({}),subtitleTextLayer=new Node({});view.add(contentLayer);view.add(headingLayer);view.add(subtitleBacking);view.add(subtitleTextLayer);
 worldBase(contentLayer,scene,plan);const ss=stages();ss.forEach(x=>contentLayer.add(x));buildSpace(contentLayer,ss,scene,plan);buildDiagram(ss.slice(4),scene,plan);
 rr(headingLayer,0,-474,1920,132,K.ink,0);tx(headingLayer,'考える夜',-805,-505,24,K.gold);tx(headingLayer,scene.chapter.toUpperCase(),-690,-445,18,K.muted);tx(headingLayer,scene.title,0,-465,scene.title.length>19?30:37,K.paper);tx(headingLayer,scene.id,840,-505,20,K.muted);
 rr(subtitleBacking,0,458,1920,176,'#020406',0).opacity(.96);const caption=new Txt({text:'',x:0,y:458,fontFamily:F,fontSize:40,fill:'#00000000',fontWeight:650,lineHeight:57});subtitleTextLayer.add(caption);
 yield* all(directorFlow(ss,scene,plan),cameraFlow(contentLayer,scene.duration,plan),waitFor(scene.duration));
}
