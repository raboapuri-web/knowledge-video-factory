import '@fontsource/noto-sans-jp/400.css';
import '@fontsource/noto-sans-jp/700.css';
import {Circle, Line, Node, Rect, Txt, type View2D} from '@motion-canvas/2d';
import {all, waitFor, type ThreadGenerator} from '@motion-canvas/core';
import visualPlan from '../../content/visual_plan.json';

type Cue={text:string;display:string;start:number;end:number};
type Scene={id:string;chapter:string;motif:string;title:string;narration:string;cues:Cue[];duration:number};
type Plan={kind:string;motion:string;labels:string[]};

export const MICRO_BEATS_PER_SCENE=24;

const K={
  bg:'#071018',deep:'#0B1720',navy:'#132A36',slate:'#29434F',paper:'#F2EEE5',muted:'#9BAAB0',
  red:'#D45959',gold:'#D4AE69',cyan:'#6FBAC0',teal:'#79A38E',blue:'#718AA6',green:'#718F74',
  brown:'#775F4B',sand:'#A98F69',ice:'#AFCAD2',ink:'#17252E',soil:'#514238',orange:'#C07F50',
  white:'#FAF7F0',black:'#03080C',wine:'#4A1F2B',pink:'#C88492',cream:'#D8C7A8',violet:'#756B91'
};
const F='Noto Sans JP, Noto Sans CJK JP, sans-serif';

const hash=(s:string)=>[...s].reduce((a,c)=>((a*33)^c.charCodeAt(0))>>>0,126);
const tx=(s:string,x:number,y:number,sz=30,col=K.paper,w=700)=>new Txt({text:s,x,y,fontFamily:F,fontSize:sz,fill:col,fontWeight:w});

function rr(p:Node,x:number,y:number,w:number,h:number,fill:string,r=10,stroke?:string){
  const q=new Rect({x,y,width:w,height:h,fill,radius:r,stroke:stroke??fill,lineWidth:stroke?2:0});
  p.add(q);return q;
}
function cc(p:Node,x:number,y:number,r:number,fill:string){
  const q=new Circle({x,y,width:r*2,height:r*2,fill});p.add(q);return q;
}
function ln(p:Node,pts:[number,number][],col=K.muted,w=5){
  const q=new Line({points:pts,stroke:col,lineWidth:w,lineCap:'round',lineJoin:'round'});p.add(q);return q;
}
function label(p:Node,s:string,x:number,y:number,col=K.paper,sz=25,w=700){
  const q=tx(s,x,y,sz,col,w);p.add(q);return q;
}
function card(p:Node,s:string,x:number,y:number,w=280,col=K.cyan){
  rr(p,x,y,w,70,K.deep,12,col);label(p,s,x,y,col,22);
}
function person(p:Node,x:number,y:number,s=.7,col=K.paper){
  const g=new Node({x,y,scale:s});p.add(g);
  cc(g,0,-62,24,col);rr(g,0,20,62,120,col,18);
  ln(g,[[-18,-4],[-58,52]],col,11);ln(g,[[18,-4],[58,52]],col,11);
  ln(g,[[-18,80],[-28,152]],col,13);ln(g,[[18,80],[28,152]],col,13);
  return g;
}
function sitting(p:Node,x:number,y:number,s=.7,col=K.paper){
  const g=new Node({x,y,scale:s});p.add(g);
  cc(g,0,-58,24,col);rr(g,0,15,60,105,col,18);
  ln(g,[[-18,56],[-70,85]],col,12);ln(g,[[18,56],[70,85]],col,12);
  ln(g,[[-70,85],[-20,112]],col,12);ln(g,[[70,85],[20,112]],col,12);
  return g;
}
function table(p:Node,x:number,y:number,w=620){
  rr(p,x,y,w,34,K.brown,5);
  ln(p,[[x-w*.4,y+15],[x-w*.4,y+125]],K.cream,8);
  ln(p,[[x+w*.4,y+15],[x+w*.4,y+125]],K.cream,8);
}
function desk(p:Node,x:number,y:number,w=620){
  rr(p,x,y,w,30,K.brown,5);
  ln(p,[[x-w*.4,y+14],[x-w*.4,y+110]],K.paper,7);
  ln(p,[[x+w*.4,y+14],[x+w*.4,y+110]],K.paper,7);
}
function phone(p:Node,x:number,y:number,w=260,h=500){
  rr(p,x,y,w,h,'#1A2228',34,K.muted);rr(p,x,y,w-28,h-48,K.black,28);
}
function paper(p:Node,x:number,y:number,w=320,h=420,title=''){
  rr(p,x,y,w,h,'#EEE7DB',8,'#90999C');
  if(title)label(p,title,x,y-h*.38,K.ink,22);
  for(let i=0;i<5;i++)ln(p,[[x-w*.34,y-h*.14+i*50],[x+w*(i===4?.08:.34),y-h*.14+i*50]],'#929A9C',4);
}
function monitor(p:Node,x:number,y:number,w=470,h=270){
  rr(p,x,y,w,h,'#1B3039',12,K.muted);rr(p,x,y,w-32,h-32,K.black,8);
  ln(p,[[x,y+h/2],[x,y+h/2+65]],K.muted,8);ln(p,[[x-85,y+h/2+66],[x+85,y+h/2+66]],K.muted,8);
}
function building(p:Node,x:number,y:number,w=430,h=480,title=''){
  rr(p,x,y,w,h,'#263B45',8,K.muted);
  for(let r0=0;r0<4;r0++)for(let c0=0;c0<3;c0++)rr(p,x-110+c0*110,y-130+r0*86,54,48,'#66808A',4);
  if(title)label(p,title,x,y-h*.58,K.paper,24);
}
function folder(p:Node,x:number,y:number,w=280,h=180,col=K.gold,title=''){
  rr(p,x,y,w,h,'#2A3E47',10,col);rr(p,x-w*.28,y-h*.55,w*.38,38,col,6);
  if(title)label(p,title,x,y,K.paper,21);
}
function bar(p:Node,x:number,y:number,w:number,v:number,col:string,textLabel?:string){
  rr(p,x,y,w,30,'#253942',6);rr(p,x-w*(1-v)/2,y,Math.max(8,w*v),30,col,6);
  if(textLabel)label(p,textLabel,x,y-42,col,20);
}
function axis(p:Node,x=0,y=0){
  ln(p,[[x-600,y+240],[x-600,y-250]],K.paper,5);ln(p,[[x-600,y+240],[x+650,y+240]],K.paper,5);
}
function crowd(p:Node,x:number,y:number,n=8,col=K.paper){
  for(let i=0;i<n;i++){const xx=x+(i-(n-1)/2)*88;cc(p,xx,y-34-(i%2)*8,15,col);rr(p,xx,y+10,32,60,col,10);}
}
function heart(p:Node,x:number,y:number,s=1,col=K.red){
  cc(p,x-18*s,y-12*s,28*s,col);cc(p,x+18*s,y-12*s,28*s,col);
  const q=new Line({points:[[x-42*s,y-8*s],[x,y+52*s],[x+42*s,y-8*s]],closed:true,fill:col,stroke:col,lineWidth:2});p.add(q);return q;
}
function book(p:Node,x:number,y:number,w=250,h=170,col=K.blue,title=''){
  rr(p,x-w*.26,y,w*.48,h,col,6,K.paper);rr(p,x+w*.26,y,w*.48,h,col,6,K.paper);
  ln(p,[[x,y-h*.42],[x,y+h*.42]],K.paper,3);if(title)label(p,title,x,y,K.paper,18);
}
function cafe(p:Node){rr(p,0,0,1920,920,'#241D1C',0);rr(p,0,-250,1920,220,'#362725',0);for(let i=0;i<4;i++)cc(p,-650+i*430,-250,70,K.gold);table(p,0,160,780);}
function izakaya(p:Node){rr(p,0,0,1920,920,'#261A1C',0);rr(p,0,-240,1920,240,'#3B2226',0);for(let i=0;i<5;i++)rr(p,-720+i*360,-250,170,76,'#B76E52',8);table(p,0,180,820);}
function station(p:Node){rr(p,0,0,1920,920,'#101A23',0);ln(p,[[-850,230],[850,230]],K.paper,12);ln(p,[[-850,280],[850,280]],K.muted,4);for(let i=0;i<5;i++)rr(p,-700+i*350,-40,240,360,'#1B3039',6,K.slate);label(p,'23:18',680,-280,K.gold,32);}
function lecture(p:Node){rr(p,0,0,1920,920,'#1A252C',0);for(let r0=0;r0<4;r0++)for(let c0=0;c0<5;c0++)rr(p,-620+c0*310,-120+r0*115,230,70,'#32454D',6);rr(p,0,-310,900,90,'#222E34',4);}
function dorm(p:Node){rr(p,0,0,1920,920,'#20292D',0);for(let i=0;i<5;i++){rr(p,-700+i*350,-20,240,420,'#33444A',8);rr(p,-700+i*350,-20,120,250,'#182328',5);label(p,'R'+(i+1),-700+i*350,-190,K.muted,18);}ln(p,[[-900,245],[900,245]],K.cream,8);}
function office(p:Node){rr(p,0,0,1920,920,'#17242B',0);for(let i=0;i<4;i++){desk(p,-570+i*380,180,300);monitor(p,-570+i*380,25,220,130);}for(let i=0;i<4;i++)rr(p,-570+i*380,-235,270,110,'#263C45',8);}
function wedding(p:Node){rr(p,0,0,1920,920,'#2A2325',0);for(let i=0;i<5;i++){person(p,-600+i*300,80,.34,i%2?K.paper:K.cream);person(p,-520+i*300,80,.34,i%2?K.cream:K.paper);}heart(p,0,-245,.8,K.red);}
function worldMap(p:Node){rr(p,0,0,1920,920,'#10222C',0);for(let i=0;i<18;i++){const h=hash('m'+i);cc(p,-760+(h%1520),-220+((h>>5)%450),28+(i%3)*5,[K.cyan,K.gold,K.teal,K.red][i%4]);}}
function timeline(p:Node,y:number,items:{x:number;label:string;col:string}[]){ln(p,[[items[0].x,y],[items[items.length-1].x,y]],K.muted,7);for(const it of items){cc(p,it.x,y,14,it.col);label(p,it.label,it.x,y+48,it.col,20);}}
function network(p:Node,nodes:{x:number;y:number;t:string;c:string}[]){
  for(let i=0;i<nodes.length;i++)for(let j=i+1;j<nodes.length;j++)if((i+j)%2===0)ln(p,[[nodes[i].x,nodes[i].y],[nodes[j].x,nodes[j].y]],K.slate,3);
  for(const n of nodes){cc(p,n.x,n.y,52,n.c);label(p,n.t,n.x,n.y,K.black,18);}
}
function stages8(){return Array.from({length:8},()=>new Node({opacity:0}));}
function worldBase(root:Node,scene:Scene){
  const pal=['#071018','#0B141C','#101C24','#101E26','#151B21','#0C171D','#121A21','#0F2027'];
  rr(root,0,0,1920,1080,pal[hash(scene.motif)%pal.length],0);
  const h=hash(scene.motif);
  for(let i=0;i<10;i++)cc(root,-850+((h>>(i%9))%1700),-350+((h>>(i%8+1))%550),1.5+(i%3),i%2?K.gold:K.cyan);
  rr(root,0,344,1920,3,'#233A45',0);
}

function buildScene(root:Node,scene:Scene,plan:Plan):Node[]{
  worldBase(root,scene);
  const s=stages8();s.forEach(n=>root.add(n));
  const[a,b,c,d,e,f,g,h]=s;

  switch(scene.motif){
    case 'izakaya_type_list':{
      izakaya(a);sitting(b,-300,80,.55,K.paper);sitting(b,300,80,.55,K.cyan);
      ['落ち着き','知性','趣味','静かな休日'].forEach((x,i)=>card(c,x,-510+i*340,-120,260,[K.gold,K.cyan,K.teal,K.red][i]));
      phone(d,0,-10,230,420);label(d,'理想のタイプ',0,-130,K.paper,22);
      for(let i=0;i<4;i++)rr(e,0,-40+i*60,150,32,[K.gold,K.cyan,K.teal,K.red][i],6);
      label(f,'23:07',620,-260,K.gold,30);label(g,'条件は言葉にできる',0,285,K.paper,28);label(h,'まだ相手はいない',0,-315,K.gold,40);break;
    }
    case 'future_partner_contrast':{
      cafe(a);sitting(b,-260,70,.52,K.paper);sitting(b,260,70,.52,K.pink);
      book(c,-520,-120,230,150,K.blue,'本');cc(c,520,-120,62,K.gold);label(c,'♪',520,-120,K.black,42);
      card(d,'静か',-500,250,240,K.muted);card(d,'よく喋る',500,250,260,K.red);
      ln(e,[[-180,80],[180,80]],K.gold,7);heart(f,0,10,.8,K.red);
      label(g,'数か月後',0,-245,K.gold,31);label(h,'理想と違うのに惹かれる',0,-315,K.paper,39);break;
    }
    case 'preference_paradox':{
      rr(a,0,0,1920,920,'#101820',0);
      paper(b,-430,0,500,570,'過去の理想');heart(c,430,0,1.5,K.red);
      card(d,'静かな人',-430,-40,280,K.cyan);card(d,'趣味が近い',-430,70,280,K.gold);
      label(e,'どちらも本気',0,240,K.paper,31);ln(f,[[-120,0],[120,0]],K.red,8);label(f,'≠',0,0,K.red,60);
      label(g,'自分の好みを知らない？',0,-225,K.muted,28);label(h,'それとも理想の枠組みに限界？',0,-315,K.gold,38);break;
    }
    case 'thesis_map':{
      rr(a,0,0,1920,920,'#0C1820',0);
      const nodes=[{x:-560,y:-110,t:'歴史',c:K.gold},{x:-190,y:-170,t:'理想',c:K.cyan},{x:190,y:-170,t:'対面',c:K.red},{x:560,y:-110,t:'AI',c:K.violet},{x:-420,y:150,t:'近接',c:K.teal},{x:0,y:210,t:'社会',c:K.blue},{x:420,y:150,t:'更新',c:K.orange}];
      network(b,nodes);heart(c,0,0,.9,K.red);label(d,'恋愛',0,0,K.black,25);
      label(e,'理想は存在する',-360,300,K.cyan,28);label(f,'しかし十分ではない',360,300,K.red,28);
      label(g,'複数の研究を一本に',0,-260,K.paper,29);label(h,'なぜ「タイプ外」を好きになるのか',0,-325,K.gold,38);break;
    }
    case 'premodern_marriage_table':{
      rr(a,0,0,1920,920,'#2B2521',0);table(b,0,100,1000);
      person(c,-560,30,.42,K.cream);person(c,-360,30,.42,K.paper);person(c,360,30,.42,K.paper);person(c,560,30,.42,K.cream);
      ['土地','相続','商売','家族'].forEach((x,i)=>folder(d,-480+i*320,-100,250,135,[K.gold,K.cyan,K.teal,K.red][i],x));
      person(e,-120,210,.34,K.paper);person(e,120,210,.34,K.pink);heart(f,0,205,.38,K.red);
      label(g,'恋愛感情は昔にもあった',0,-245,K.paper,28);label(h,'結婚は家族と共同体の制度でもあった',0,-320,K.gold,37);break;
    }
    case 'love_marriage_shift':{
      rr(a,0,0,1920,920,'#181F25',0);
      timeline(b,40,[{x:-650,label:'家の結合',col:K.brown},{x:-220,label:'個人選択',col:K.gold},{x:220,label:'愛情',col:K.red},{x:650,label:'伴侶性',col:K.cyan}]);
      building(c,-560,-120,320,300,'家');heart(d,0,-120,1.0,K.red);person(e,540,-80,.45,K.paper);person(e,660,-80,.45,K.pink);
      ['信頼','会話','精神的支え'].forEach((x,i)=>card(f,x,-330+i*330,250,260,[K.cyan,K.gold,K.teal][i]));
      label(g,'恋愛が発明されたのではない',0,-245,K.muted,28);label(h,'結婚へ求める役割が変わった',0,-320,K.paper,39);break;
    }
    case 'expectation_stack':{
      rr(a,0,0,1920,920,'#111B22',0);person(b,-520,160,.5,K.paper);person(b,520,160,.5,K.pink);
      const xs=['生活','愛情','性的魅力','理解','価値観','支え','成長','将来'];
      xs.forEach((x,i)=>rr(c,0,260-i*65,420-i*12,50,[K.brown,K.red,K.pink,K.cyan,K.gold,K.teal,K.blue,K.orange][i],6));
      xs.forEach((x,i)=>label(d,x,0,260-i*65,K.black,18));
      label(e,'一人へ集中する期待',0,-250,K.gold,31);ln(f,[[-390,140],[-220,70]],K.muted,5);ln(f,[[390,140],[220,70]],K.muted,5);
      label(g,'役割が増えるほど理想像も精密になる',0,305,K.paper,28);label(h,'「誰なら全部を満たす？」',0,-320,K.gold,39);break;
    }
    case 'forecasting_future_self':{
      rr(a,0,0,1920,920,'#0E1B23',0);person(b,-500,110,.5,K.paper);rr(c,460,20,520,520,'#172D37',18,K.cyan);
      label(c,'未来',460,-180,K.cyan,35);person(c,390,70,.34,K.paper);person(c,530,70,.34,K.pink);
      paper(d,-130,30,360,480,'条件表');ln(e,[[-300,30],[220,30]],K.gold,8);
      label(f,'現在の自分が',-500,265,K.paper,27);label(g,'未来の幸福を予測',460,265,K.gold,29);label(h,'理想のタイプ＝未来予測',0,-315,K.paper,40);break;
    }
    case 'ideal_standards_lab':{
      rr(a,0,0,1920,920,'#121C23',0);label(b,'Ideal Standards Model',0,-265,K.gold,36);
      cc(c,-430,20,120,K.cyan);cc(c,0,20,120,K.red);cc(c,430,20,120,K.gold);
      label(c,'温かさ\n信頼',-430,20,K.black,22);label(c,'活力\n魅力',0,20,K.black,22);label(c,'地位\n資源',430,20,K.black,22);
      heart(d,0,245,.55,K.red);ln(e,[[-430,140],[0,205],[430,140]],K.paper,5);
      label(f,'相手評価の物差し',0,300,K.paper,27);label(g,'理想は認知的な基準',0,-205,K.muted,28);label(h,'「理想」は実在する心理構造',0,-325,K.paper,39);break;
    }
    case 'three_ideal_dimensions':{
      rr(a,0,0,1920,920,'#102029',0);axis(b,0,20);
      bar(c,-170,-130,760,.78,K.cyan,'温かさ・信頼');bar(d,-170,0,760,.56,K.red,'活力・魅力');bar(e,-170,130,760,.44,K.gold,'地位・資源');
      person(f,520,60,.5,K.paper);label(g,'人によって重みが違う',300,280,K.paper,28);label(h,'理想は一枚の物差しではない',0,-315,K.gold,39);break;
    }
    case 'worldwide_ideal_study':{
      worldMap(a);label(b,'43 countries',-430,-245,K.gold,32);label(b,'22 languages',0,-245,K.cyan,32);label(b,'N = 10,358',430,-245,K.red,32);
      card(c,'2025',0,-120,240,K.paper);bar(d,0,40,850,.34,K.cyan,'本人特有の理想との一致');bar(e,0,150,850,.68,K.gold,'一般的に望ましい特徴');
      label(f,'理想一致の効果は存在',0,270,K.paper,29);label(g,'ただし万能ではない',0,320,K.muted,26);label(h,'理想は無意味ではない',0,-325,K.gold,40);break;
    }
    case 'map_not_territory':{
      rr(a,0,0,1920,920,'#152028',0);paper(b,-420,10,520,560,'地図');
      ln(b,[[-560,90],[-420,-80],[-250,40],[-480,180]],K.red,7);cc(b,-480,180,18,K.red);
      ln(c,[[100,220],[240,80],[420,-10],[610,-160]],K.gold,12);cc(c,240,80,26,K.cyan);cc(c,420,-10,26,K.red);cc(c,610,-160,26,K.gold);
      card(d,'偶然の店',240,175,260,K.cyan);card(e,'雨宿り',470,95,240,K.red);
      label(f,'地図は役立つ',-420,285,K.paper,27);label(g,'現地は地図より多い',390,285,K.gold,29);label(h,'理想 ≠ 現実そのもの',0,-320,K.paper,40);break;
    }
    case 'speed_dating_hall':{
      rr(a,0,0,1920,920,'#19232A',0);
      for(let i=0;i<4;i++){table(b,-570+i*380,105,260);sitting(b,-620+i*380,0,.29,K.paper);sitting(b,-520+i*380,0,.29,K.pink);}
      label(c,'4 min',0,-245,K.gold,36);cc(d,0,-155,54,K.red);label(d,'ベル',0,-155,K.black,21);
      for(let i=0;i<4;i++)ln(e,[[-500+i*350,230],[-280+i*350,230]],K.cyan,7);
      card(f,'事前の理想',-370,300,300,K.cyan);card(g,'実際の対面',370,300,300,K.red);label(h,'人を本当に会わせる実験',0,-320,K.paper,39);break;
    }
    case 'stated_vs_revealed_preferences':{
      rr(a,0,0,1920,920,'#101B22',0);paper(b,-430,0,500,580,'事前申告');paper(c,430,0,500,580,'実際のデート');
      bar(d,-430,-60,340,.82,K.red,'身体的魅力');bar(d,-430,80,340,.72,K.gold,'収入見込み');
      heart(e,430,-40,1.0,K.red);card(f,'特定相手への関心',430,150,330,K.cyan);
      ln(g,[[-120,0],[120,0]],K.muted,6);label(g,'弱い予測',0,0,K.muted,24);label(h,'「言った好み」と「会った反応」は違う',0,-320,K.gold,36);break;
    }
    case 'living_trait_texture':{
      cafe(a);sitting(b,-280,65,.48,K.paper);sitting(b,280,65,.48,K.pink);
      card(c,'「明るい」',-520,-150,260,K.gold);card(c,'「優しい」',520,-150,260,K.cyan);
      rr(d,0,20,360,120,K.deep,12,K.muted);label(d,'店員が注文を間違える',0,20,K.paper,21);
      ln(e,[[280,110],[430,180]],K.cyan,6);label(e,'穏やかに返す',520,210,K.cyan,23);
      label(f,'ラベル',-430,275,K.muted,24);label(g,'具体的な行動',430,275,K.gold,27);label(h,'形容詞は現実で質感を持つ',0,-315,K.paper,39);break;
    }
    case 'microinteraction_accumulation':{
      rr(a,0,0,1920,920,'#111A21',0);person(b,-360,80,.48,K.paper);person(b,360,80,.48,K.pink);
      const m=['声','返答の間','視線','冗談','安心','疲れ','自分への反応'];
      m.forEach((x,i)=>cc(c,-480+i*160,-130+(i%2)*80,42,[K.cyan,K.gold,K.red,K.teal][i%4]));
      m.forEach((x,i)=>label(d,x,-480+i*160,-130+(i%2)*80,K.black,15));
      for(let i=0;i<6;i++)ln(e,[[-260+i*100,60],[260-i*80,60]],K.muted,3);
      label(f,'数分で情報量が急増',0,270,K.gold,30);label(g,'条件表にない情報',0,-230,K.paper,28);label(h,'対面は変数を増やす',0,-315,K.gold,40);break;
    }
    case 'abstract_to_person':{
      rr(a,0,0,1920,920,'#101920',0);paper(b,-500,0,420,580,'PROFILE A');paper(c,0,0,420,580,'PROFILE B');
      bar(b,-500,-30,260,.8,K.cyan,'優しさ 8');bar(c,0,-30,260,.8,K.cyan,'優しさ 8');
      person(d,500,60,.52,K.paper);card(e,'同じ数値でも',500,-140,290,K.gold);card(f,'現れ方は違う',500,-35,290,K.red);
      label(g,'属性 → 文脈',350,280,K.paper,28);label(h,'人は点数ではなく人物を経験する',0,-315,K.gold,37);break;
    }
    case 'machine_learning_setup':{
      rr(a,0,0,1920,920,'#0E1921',0);phone(b,-540,20,230,430);for(let i=0;i<6;i++)rr(b,-540,-100+i*55,150,24,[K.cyan,K.gold,K.red,K.teal][i%4],4);
      for(let i=0;i<8;i++)folder(c,-200+(i%4)*135,-130+Math.floor(i/4)*130,110,90,[K.cyan,K.gold,K.red,K.teal][i%4],String(i+1));
      monitor(d,520,0,520,320);label(d,'Random Forest',520,-40,K.paper,26);bar(d,520,70,340,.68,K.cyan);
      label(e,'100+ self-reports',0,250,K.gold,28);label(f,'traits + preferences',0,305,K.paper,24);label(g,'2017',520,-225,K.red,29);label(h,'恋愛を機械学習で予測する',0,-320,K.gold,39);break;
    }
    case 'actor_partner_variance':{
      rr(a,0,0,1920,920,'#10202A',0);axis(b,0,30);
      bar(c,-120,-100,780,.18,K.cyan,'actor variance 4–18%');bar(d,-120,40,780,.27,K.gold,'partner variance 7–27%');
      person(e,500,-80,.38,K.paper);heart(e,500,40,.55,K.red);person(f,500,150,.38,K.pink);
      label(g,'惚れやすさ・好かれやすさは一部読める',0,290,K.paper,27);label(h,'一般傾向には予測可能性がある',0,-315,K.gold,38);break;
    }
    case 'relationship_variance_failure':{
      rr(a,0,0,1920,920,'#0C151D',0);const pos=[[-450,-110],[-150,-110],[150,-110],[450,-110],[-450,130],[-150,130],[150,130],[450,130]];
      pos.forEach((p0,i)=>person(b,p0[0],p0[1],.27,i<4?K.paper:K.pink));
      for(let i=0;i<4;i++)for(let j=4;j<8;j++)ln(c,[[pos[i][0],pos[i][1]],[pos[j][0],pos[j][1]]],K.slate,2);
      ln(d,[[-150,-110],[150,130]],K.red,10);heart(e,0,10,.75,K.red);label(f,'A × B',0,190,K.red,30);
      card(g,'relationship variance：予測できず',0,285,500,K.gold);label(h,'「この二人だから」は読めなかった',0,-315,K.paper,38);break;
    }
    case 'interaction_generates_data':{
      rr(a,0,0,1920,920,'#0F1A22',0);person(b,-460,80,.48,K.paper);person(c,460,80,.48,K.pink);
      card(d,'Aが話す',-300,-120,240,K.cyan);card(d,'Bが笑う',300,-120,240,K.gold);
      ln(e,[[-250,-30],[250,-30]],K.gold,8);card(e,'Aが本音を出す',0,20,300,K.red);
      ln(f,[[250,80],[-250,80]],K.cyan,8);card(f,'Bの返答でAが変わる',0,140,390,K.teal);
      label(g,'相互作用が次の入力を作る',0,285,K.paper,29);label(h,'二人の間でデータが生成される',0,-315,K.gold,38);break;
    }
    case 'compatibility_emergence':{
      rr(a,0,0,1920,920,'#0B1720',0);cc(b,-420,30,150,K.cyan);label(b,'A',-420,30,K.black,50);cc(c,420,30,150,K.red);label(c,'B',420,30,K.black,50);
      ln(d,[[-250,30],[250,30]],K.paper,6);cc(e,0,30,115,K.gold);label(e,'関係',0,30,K.black,30);
      heart(f,0,30,.55,K.red);label(g,'接触前には存在しない第三の空間',0,275,K.paper,29);label(h,'相性は「後から生まれる」ことがある',0,-315,K.gold,37);break;
    }
    case 'dorm_corridor':{
      dorm(a);person(b,-650,140,.34,K.paper);person(c,650,140,.34,K.pink);
      ln(d,[[-550,140],[-120,140],[120,140],[550,140]],K.gold,6);card(e,'すれ違う',-330,280,240,K.muted);card(e,'会釈',0,280,220,K.cyan);card(e,'挨拶',330,280,220,K.gold);
      label(f,'知らない人',-650,-260,K.muted,25);label(g,'知っている人',650,-260,K.cyan,25);label(h,'近さが関係の入口を作る',0,-315,K.paper,39);break;
    }
    case 'mere_exposure_classroom':{
      lecture(a);for(let i=0;i<4;i++)person(b,-520+i*350,90,.25,K.pink);
      ['0回','5回','10回','15回'].forEach((x,i)=>card(c,x,-520+i*350,-185,220,[K.muted,K.cyan,K.gold,K.red][i]));
      bar(d,0,245,920,.76,K.cyan,'接触頻度が高いほど好意的評価の傾向');
      label(e,'会話はしない',0,-110,K.paper,25);label(f,'講義室にいるだけ',0,-55,K.muted,23);label(g,'Moreland & Beach, 1992',0,305,K.gold,24);label(h,'繰り返し接触が親しさを変える',0,-315,K.paper,38);break;
    }
    case 'opportunity_structure':{
      rr(a,0,0,1920,920,'#112029',0);const nodes=[{x:-590,y:-120,t:'学校',c:K.cyan},{x:-190,y:-170,t:'職場',c:K.gold},{x:220,y:-160,t:'友人',c:K.teal},{x:600,y:-100,t:'地域',c:K.red},{x:-380,y:150,t:'店',c:K.orange},{x:0,y:210,t:'趣味',c:K.violet},{x:380,y:150,t:'紹介',c:K.blue}];
      network(b,nodes);cc(c,0,20,120,K.paper);label(c,'自分',0,20,K.black,25);
      rr(d,0,20,1050,520,'transparent',20,K.gold);label(e,'生活圏',0,300,K.gold,28);
      label(f,'世界の全員ではない',-360,-260,K.muted,27);label(g,'実際に会える少数',360,-260,K.paper,27);label(h,'環境が候補者を絞る',0,-325,K.gold,40);break;
    }
    case 'corridor_before_preference':{
      rr(a,0,0,1920,920,'#0D1820',0);['座席表','勤務先','住所','友人ネット'].forEach((x,i)=>folder(b,-510+i*340,-100,260,150,[K.cyan,K.gold,K.red,K.teal][i],x));
      const allPeople=[-650,-480,-310,-140,30,200,370,540,710];allPeople.forEach((x,i)=>person(c,x,150,.25,i<5?K.paper:K.muted));
      rr(d,-250,150,920,270,'transparent',14,K.gold);label(e,'実際に出会える範囲',-250,295,K.gold,24);
      card(f,'好み',520,220,220,K.red);ln(g,[[350,220],[200,220]],K.red,6);label(h,'選好より前に「候補」が選ばれる',0,-315,K.paper,38);break;
    }
    case 'assortative_couples':{
      wedding(a);['年齢','教育','宗教性','政治','生活習慣'].forEach((x,i)=>card(b,x,-520+i*260,265,220,[K.cyan,K.gold,K.red,K.teal,K.blue][i]));
      for(let i=0;i<4;i++)ln(c,[[-500+i*300,40],[-420+i*300,40]],K.gold,5);
      label(d,'ランダムより似る',0,-210,K.paper,29);label(e,'assortative mating',0,-265,K.gold,31);
      label(f,'結果として類似',-360,310,K.cyan,24);label(g,'原因は一つではない',360,310,K.red,24);label(h,'自由恋愛でもカップルは似る',0,-330,K.paper,38);break;
    }
    case 'education_funnel':{
      rr(a,0,0,1920,920,'#111A21',0);const ys=[-190,-50,90,230];const ws=[1180,900,620,360];['高校','大学','就職','友人・紹介'].forEach((x,i)=>{rr(b,0,ys[i],ws[i],90,[K.slate,K.blue,K.cyan,K.gold][i],8);label(b,x,0,ys[i],K.paper,23);});
      for(let i=0;i<10;i++)person(c,-560+i*125,-260,.18,i<5?K.paper:K.pink);
      for(let i=0;i<4;i++)person(d,-180+i*120,310,.22,i%2?K.paper:K.pink);
      label(e,'選んだ？',-430,300,K.red,26);label(f,'それとも残った候補が似ていた？',250,300,K.gold,26);label(g,'人生経路が市場を狭める',0,-270,K.paper,29);label(h,'似た人のいる場所へ進む',0,-330,K.gold,39);break;
    }
    case 'social_structure_market':{
      rr(a,0,0,1920,920,'#102029',0);const nodes=[{x:-560,y:-140,t:'教育',c:K.cyan},{x:-180,y:-170,t:'職業',c:K.gold},{x:200,y:-170,t:'所得',c:K.red},{x:570,y:-130,t:'地域',c:K.teal},{x:-330,y:160,t:'友人',c:K.blue},{x:0,y:210,t:'紹介',c:K.violet},{x:350,y:160,t:'接触',c:K.orange}];
      network(b,nodes);heart(c,0,20,.8,K.red);label(d,'恋愛市場',0,20,K.black,20);
      label(e,'社会構造',-480,290,K.paper,28);label(f,'個人の選好',480,290,K.cyan,28);ln(g,[[-260,275],[260,275]],K.gold,6);label(h,'候補者集合は共同制作される',0,-320,K.gold,39);break;
    }
    case 'private_choice_public_structure':{
      rr(a,0,0,1920,920,'#131B21',0);rr(b,0,40,1200,560,'#1D2A31',16,K.slate);heart(c,0,50,1.0,K.red);person(c,-180,90,.35,K.paper);person(c,180,90,.35,K.pink);
      ['学校','職場','都市','制度'].forEach((x,i)=>building(d,-570+i*380,-110,260,270,x));
      label(e,'私的な感情',0,280,K.red,29);label(f,'公的な構造',0,-245,K.cyan,29);label(g,'自由の舞台は先に用意される',0,325,K.paper,26);label(h,'恋愛の背後に社会がいる',0,-325,K.gold,40);break;
    }
    case 'ideal_changes_with_time':{
      rr(a,0,0,1920,920,'#101A22',0);paper(b,-430,0,480,570,'20代前半');paper(c,430,0,480,570,'数年後');
      ['社交的','野心','旅行'].forEach((x,i)=>card(d,x,-430,-100+i*110,280,[K.red,K.gold,K.cyan][i]));
      ['穏やか','日常','競争弱め'].forEach((x,i)=>card(e,x,430,-100+i*110,280,[K.teal,K.blue,K.orange][i]));
      ln(f,[[-140,0],[140,0]],K.gold,8);label(g,'経験',0,210,K.gold,27);label(h,'相手だけでなく理想も動く',0,-315,K.paper,39);break;
    }
    case 'thirteen_year_study':{
      rr(a,0,0,1920,920,'#102029',0);timeline(b,30,[{x:-620,label:'2006',col:K.cyan},{x:0,label:'13 years',col:K.gold},{x:620,label:'再測定',col:K.red}]);
      card(c,'N = 204',-410,-140,260,K.paper);card(d,'rank-order r=.42',0,-140,320,K.cyan);card(e,'profile r=.73',410,-140,300,K.gold);
      bar(f,0,220,900,.73,K.cyan,'安定性');label(g,'それでも変化はある',0,300,K.red,27);label(h,'理想は安定しつつ可変',0,-315,K.paper,39);break;
    }
    case 'self_insight_gap':{
      rr(a,0,0,1920,920,'#101920',0);paper(b,-420,0,500,560,'自分の認識');paper(c,420,0,500,560,'実際の変化');
      bar(d,-420,30,340,.70,K.gold,'「変わった気がする」');bar(e,420,30,340,.20,K.red,'平均の一致 r≈.20');
      ln(f,[[-100,20],[100,20]],K.muted,6);label(g,'自分の好みの変化も完全には読めない',0,285,K.paper,27);label(h,'自己理解にも誤差がある',0,-315,K.gold,40);break;
    }
    case 'experience_rewrites_criteria':{
      rr(a,0,0,1920,920,'#111C23',0);paper(b,-470,0,430,560,'旧条件表');paper(c,470,0,430,560,'更新後');
      ['刺激','冒険','外見'].forEach((x,i)=>card(d,x,-470,-100+i*110,260,[K.red,K.orange,K.pink][i]));
      ['安定','信頼','日常'].forEach((x,i)=>card(e,x,470,-100+i*110,260,[K.cyan,K.teal,K.gold][i]));
      ln(f,[[-200,0],[200,0]],K.gold,8);label(f,'経験',0,-20,K.gold,25);label(g,'項目と重みを書き換える',0,285,K.paper,29);label(h,'恋愛は採点基準まで更新する',0,-315,K.gold,38);break;
    }
    case 'moving_target':{
      rr(a,0,0,1920,920,'#0E1820',0);cc(b,-450,0,130,K.cyan);label(b,'過去の理想',-450,0,K.black,22);cc(c,0,0,130,K.paper);label(c,'現在の自分',0,0,K.black,22);cc(d,450,0,130,K.red);label(d,'現在の相手',450,0,K.black,22);
      ln(e,[[-320,0],[-130,0]],K.gold,7);ln(f,[[130,0],[320,0]],K.gold,7);label(g,'三つとも時間で動く',0,275,K.paper,29);label(h,'恋愛は「移動する標的」を扱う',0,-315,K.gold,39);break;
    }
    case 'restaurant_shared_history':{
      cafe(a);sitting(b,-260,70,.48,K.paper);sitting(b,260,70,.48,K.pink);
      ['二人だけの冗談','旅行の曲','呼び方','声の変化'].forEach((x,i)=>card(c,x,-510+i*340,-145,260,[K.red,K.gold,K.cyan,K.teal][i]));
      heart(d,0,70,.55,K.red);folder(e,0,205,360,150,K.gold,'共有記憶');
      label(f,'第三者には意味不明',-380,290,K.muted,25);label(g,'二人には意味がある',380,290,K.paper,27);label(h,'プロフィール外の共有世界',0,-315,K.gold,39);break;
    }
    case 'relationship_specific_value':{
      rr(a,0,0,1920,920,'#101A21',0);paper(b,-470,0,430,560,'一般属性');folder(c,470,-80,440,170,K.cyan,'共有経験');folder(c,470,110,440,170,K.gold,'支え合い');
      folder(d,470,300,440,120,K.red,'二人の歴史');heart(e,0,20,.7,K.red);ln(f,[[-180,20],[180,20]],K.paper,6);
      label(g,'代替しにくい意味が蓄積',0,285,K.paper,28);label(h,'関係そのものが価値になる',0,-315,K.gold,39);break;
    }
    case 'self_with_partner':{
      rr(a,0,0,1920,920,'#111B22',0);person(b,-500,110,.45,K.paper);person(c,500,110,.45,K.pink);
      card(d,'静かな自分',-500,-120,280,K.muted);card(d,'よく喋る相手',500,-120,300,K.red);
      ln(e,[[-350,60],[-100,60]],K.gold,6);person(e,0,110,.45,K.cyan);card(f,'話す自分',0,-80,260,K.cyan);
      building(g,0,260,330,170,'知らない街');label(h,'好きなのは「その人といる自分」かもしれない',0,-315,K.gold,36);break;
    }
    case 'second_question':{
      rr(a,0,0,1920,920,'#0D1720',0);paper(b,-420,0,520,560,'QUESTION 1');paper(c,420,0,520,560,'QUESTION 2');
      label(d,'相手は\nどんな人？',-420,0,K.cyan,34);label(e,'その人といると\n自分はどんな人？',420,0,K.gold,32);
      heart(f,0,210,.55,K.red);ln(g,[[-130,0],[130,0]],K.paper,6);label(h,'二つ目は会う前には答えられない',0,-315,K.paper,38);break;
    }
    case 'dating_app_filter':{
      rr(a,0,0,1920,920,'#0A151C',0);phone(b,0,0,300,570);person(b,0,-70,.30,K.paper);
      ['年齢','身長','職業','趣味','飲酒','喫煙','休日','結婚'].forEach((x,i)=>{const xx=-620+(i%4)*410;const yy=230+Math.floor(i/4)*80;card(c,x,xx,yy,210,[K.cyan,K.gold,K.red,K.teal][i%4]);});
      label(d,'Swipe',0,200,K.gold,28);ln(e,[[-420,-30],[-160,-30]],K.red,8);ln(f,[[160,-30],[420,-30]],K.cyan,8);
      label(g,'恋愛が検索へ近づく',0,-245,K.paper,29);label(h,'好みをフィルターに変換する',0,-315,K.gold,39);break;
    }
    case 'filter_power_limit':{
      rr(a,0,0,1920,920,'#0F1B23',0);phone(b,-430,0,280,540);
      ['距離','子ども','生活習慣','年齢'].forEach((x,i)=>card(c,x,-430,-130+i*100,220,[K.cyan,K.gold,K.red,K.teal][i]));
      rr(d,430,0,520,540,'#172A33',16,K.muted);label(d,'未来の好み',430,-130,K.paper,31);
      for(let i=0;i<5;i++)cc(e,250+i*90,50+(i%2)*80,28,K.muted);
      label(f,'？',430,170,K.gold,80);ln(g,[[-120,0],[120,0]],K.paper,6);label(h,'精密な検索ほど自己予測を要求する',0,-315,K.gold,37);break;
    }
    case 'counterfactual_office_romance':{
      office(a);person(b,-560,120,.3,K.muted);person(b,-180,120,.3,K.paper);
      card(c,'検索で除外',-560,-160,270,K.red);label(d,'3か月後',0,-245,K.gold,30);
      folder(e,-180,200,200,110,K.red,'失敗');rr(f,-10,120,90,110,K.brown,12);label(f,'☕',-10,120,K.paper,30);
      person(g,200,120,.3,K.pink);card(g,'昼食・冗談・共有時間',380,220,360,K.cyan);label(h,'現実なら評価が変わったかもしれない',0,-315,K.paper,36);break;
    }
    case 'unsearchable_future_value':{
      rr(a,0,0,1920,920,'#0B1720',0);phone(b,-430,0,280,540);label(b,'検索可能',-430,-190,K.cyan,27);
      rr(c,430,0,560,540,'#172A33',18,K.gold);label(c,'まだ未発生',430,-190,K.gold,27);
      heart(d,350,30,.55,K.red);folder(e,510,30,210,150,K.cyan,'共有経験');ln(f,[[-100,0],[100,0]],K.muted,7);
      label(g,'未来にしか存在しない価値',430,220,K.paper,25);label(h,'検索エンジンは未発生の魅力を探せない',0,-315,K.gold,36);break;
    }
    case 'station_platform_return':{
      station(a);sitting(b,-180,90,.42,K.paper);sitting(b,180,90,.42,K.pink);
      ln(c,[[-120,20],[120,20]],K.gold,5);heart(d,0,15,.45,K.red);
      folder(e,0,-130,340,150,K.cyan,'共有情報');label(f,'出会う前には0',-360,270,K.muted,25);label(g,'いまは大量にある',360,270,K.paper,27);
      label(h,'条件表には書けなかった関係',0,-315,K.gold,39);break;
    }
    case 'map_metaphor':{
      rr(a,0,0,1920,920,'#142029',0);paper(b,-480,0,470,560,'地図');ln(b,[[-580,120],[-470,-40],[-350,60],[-510,190]],K.red,7);
      ln(c,[[30,220],[180,80],[340,20],[520,-140]],K.gold,11);cc(c,180,80,25,K.cyan);cc(c,340,20,25,K.red);cc(c,520,-140,25,K.gold);
      card(d,'風',180,175,190,K.cyan);card(e,'偶然の店',340,115,230,K.red);card(f,'雨宿り',520,-45,210,K.gold);
      label(g,'地図にない経験',340,280,K.paper,27);label(h,'理想は地図、恋愛は歩いた道',0,-315,K.gold,39);break;
    }
    case 'relationship_as_new_value':{
      rr(a,0,0,1920,920,'#0E1921',0);paper(b,-500,0,420,560,'理想条件');person(c,420,-40,.42,K.paper);person(c,560,-40,.42,K.pink);
      heart(d,490,100,.6,K.red);['接触','相互反応','共有経験','自己変化'].forEach((x,i)=>card(e,x,-170+i*230,260,210,[K.cyan,K.gold,K.red,K.teal][i]));
      ln(f,[[-250,0],[230,60]],K.gold,7);label(g,'新しい価値',490,220,K.gold,29);label(h,'タイプ外が重要人物になる理由',0,-315,K.paper,38);break;
    }
    case 'final_love_changes_self':{
      rr(a,0,0,1920,920,'#050B10',0);person(b,-420,80,.45,K.paper);person(c,420,80,.45,K.pink);heart(d,0,10,.8,K.red);
      ln(e,[[-260,60],[-80,20],[80,20],[260,60]],K.gold,7);cc(f,0,180,70,K.cyan);label(f,'自分',0,180,K.black,22);
      card(g,'相手を選ぶ過程で、自分も変わる',0,285,520,K.gold);label(h,'恋愛は二人の間で価値を生成する',0,-315,K.white,39);break;
    }
    default:{
      rr(a,0,0,1920,920,K.navy,0);
      card(b,plan.labels[0],-420,-80,320,K.cyan);card(c,plan.labels[1],420,-80,320,K.gold);
      card(d,plan.labels[3],-420,120,320,K.paper);card(e,plan.labels[4],420,120,320,K.red);
      label(f,plan.labels[5],0,-245,K.paper,31);label(g,plan.labels[6],0,285,K.paper,31);label(h,plan.labels[7],0,-305,K.red,38);
    }
  }
  return s;
}

function offsetFor(scene:Scene,i:number):[number,number,number]{
  const p=hash(scene.motif+scene.id)%10;
  const mag=22+(i%4)*10;
  switch(p){
    case 0:return[i%2?mag:-mag,0,.94];
    case 1:return[0,i%2?mag:-mag,.94];
    case 2:return[i%2?mag:-mag,i%3?14:-14,.92];
    case 3:return[0,0,.84];
    case 4:return[i<4?-mag:mag,i%2?14:-14,.94];
    case 5:return[i%3===0?mag:0,i%2?mag:-mag,.95];
    case 6:return[i%2?-mag:mag,i<4?-15:15,.92];
    case 7:return[i<4?-mag:mag,0,.9];
    case 8:return[0,i<4?mag:-mag,.9];
    default:return[i%3===0?-mag:mag*.5,i%2?11:-11,.93];
  }
}
function settleTarget(scene:Scene,plan:Plan,i:number){
  const h=hash(scene.motif+plan.motion+i);
  let x=((h%13)-6)*1.2,y=(((h>>4)%11)-5),r=((h>>8)%7-3)*.35,s=1.01,opacity=1;
  const m=plan.motion;
  if(m.includes('rotate'))r=(i%2?1:-1)*(1.1+i*.12);
  if(m.includes('build')||m.includes('stack'))y=i>4?-8:4;
  if(m.includes('narrow')||m.includes('funnel'))x=i<4?-8:8;
  if(m.includes('grow')||m.includes('blooms')||m.includes('emerge'))s=1.025;
  if(m.includes('fails')||m.includes('dissolve'))opacity=i<3?.82:1;
  if(m.includes('connect')||m.includes('feedback')){x=i%2?-7:7;s=1.018;}
  if(m.includes('reweight')||m.includes('rewrite'))r=i%2?.8:-.8;
  return{x,y,r,s,opacity};
}
function* microStageFlow(stages:Node[],scene:Scene,plan:Plan):ThreadGenerator{
  const base=[.02,.12,.23,.34,.45,.56,.67,.78];
  let cursor=0;
  for(let i=0;i<8;i++){
    const [ox,oy,os]=offsetFor(scene,i);
    stages[i].x(ox);stages[i].y(oy);stages[i].scale(os);stages[i].rotation(i%2?.9:-.9);
    const jitter=((hash(scene.motif+i.toString())>>3)&7)*.002;
    const at=scene.duration*Math.min(.82,base[i]+jitter);
    if(at>cursor)yield* waitFor(at-cursor);
    cursor=at;
    const reveal=Math.min(.46,Math.max(.16,scene.duration*.012));
    yield* all(stages[i].opacity(1,reveal),stages[i].x(0,reveal),stages[i].y(0,reveal),stages[i].scale(1,reveal),stages[i].rotation(0,reveal));
    cursor+=reveal;
    const t=settleTarget(scene,plan,i);
    const settle=Math.min(.34,Math.max(.14,scene.duration*.009));
    yield* all(stages[i].x(t.x,settle),stages[i].y(t.y,settle),stages[i].rotation(t.r,settle),stages[i].scale(t.s,settle),stages[i].opacity(t.opacity,settle));
    cursor+=settle;
    const accent=Math.min(.26,Math.max(.11,scene.duration*.007));
    yield* all(stages[i].scale(t.s*(i%2?1.012:.996),accent),stages[i].opacity(Math.max(.76,t.opacity-(i%3===0?.06:0)),accent));
    cursor+=accent;
    if(i>=3)stages[i-3].opacity(.72);
  }
  const end=scene.duration*.91;
  if(end>cursor){yield* waitFor(end-cursor);cursor=end;}
  if(scene.duration>cursor)yield* waitFor(scene.duration-cursor);
}
function* cameraFlow(node:Node,duration:number,motif:string):ThreadGenerator{
  const p=hash(motif)%8;
  const dx=[12,-14,10,-9,16,-12,8,-10][p],dy=[-5,7,6,-7,3,-4,8,-6][p];
  node.scale(1.006);
  const q=duration/6;
  yield* all(node.x(dx,q),node.y(dy,q),node.scale(1.012,q));
  yield* all(node.x(-dx*.4,q),node.y(-dy*.55,q),node.scale(1.018,q));
  yield* all(node.x(dx*.55,q),node.y(dy*.18,q),node.scale(1.014,q));
  yield* all(node.x(-dx*.22,q),node.y(-dy*.22,q),node.scale(1.020,q));
  yield* all(node.x(dx*.12,q),node.y(dy*.08,q),node.scale(1.013,q));
  const tail=Math.max(.01,duration-5*q);
  yield* all(node.x(0,tail),node.y(0,tail),node.scale(1.008,tail));
}
function* subtitleFlow(cues:Cue[],caption:Txt,duration:number):ThreadGenerator{
  let t=0;
  for(const c of cues){
    if(c.start>t)yield* waitFor(c.start-t);
    caption.text(c.display);t=c.start;
  }
  if(duration>t)yield* waitFor(duration-t);
  caption.text('');
}

export function* playMeaningScene(view:View2D,scene:Scene):ThreadGenerator{
  const plan=(visualPlan as Record<string,Plan>)[scene.motif];
  if(!plan)throw new Error('V126 visual plan missing: '+scene.motif);
  view.fill(K.bg);

  const contentLayer=new Node({});
  const headingLayer=new Node({});
  const subtitleBacking=new Node({});
  const subtitleTextLayer=new Node({});
  view.add(contentLayer);
  view.add(headingLayer);
  view.add(subtitleBacking);
  view.add(subtitleTextLayer);

  const stages=buildScene(contentLayer,scene,plan);

  rr(headingLayer,0,-474,1920,132,'#061018',0);
  const part=scene.chapter==='prologue'?'PROLOGUE':scene.chapter==='epilogue'?'EPILOGUE':scene.chapter.toUpperCase();
  headingLayer.add(tx(part,-800,-508,22,K.gold,700));
  headingLayer.add(tx(scene.id,830,-508,21,K.muted,600));
  headingLayer.add(tx(scene.title,0,-452,scene.title.length>34?27:scene.title.length>24?32:40,K.paper,700));

  rr(subtitleBacking,0,460,1920,170,'#02060B',0).opacity(.92);
  const caption=tx('',0,458,40,K.paper,650);
  caption.lineHeight(57);
  subtitleTextLayer.add(caption);

  yield* all(
    microStageFlow(stages,scene,plan),
    cameraFlow(contentLayer,scene.duration,scene.motif),
    subtitleFlow(scene.cues,caption,scene.duration),
  );
}
