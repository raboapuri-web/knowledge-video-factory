import '@fontsource/noto-sans-jp/400.css';
import '@fontsource/noto-sans-jp/700.css';
import {Circle, Line, Node, Rect, Txt, type View2D} from '@motion-canvas/2d';
import {all, waitFor, type ThreadGenerator} from '@motion-canvas/core';
import visualPlan from '../../content/visual_plan.json';

type Cue={text:string;display:string;start:number;end:number};
type Scene={id:string;chapter:string;motif:string;title:string;narration:string;cues:Cue[];duration:number};
type Plan={kind:string;motion:string;labels:string[]};
export const MICRO_BEATS_PER_SCENE=24;

const K={bg:'#080D11',deep:'#111820',ink:'#182126',paper:'#EEE7D8',muted:'#9D9A91',red:'#A93F3F',crimson:'#6E252B',gold:'#C6A15B',bronze:'#8F6A3E',jade:'#698D78',blue:'#516D80',cyan:'#719DA1',earth:'#5F4A36',stone:'#44494A',black:'#030506',white:'#F7F3EA',dust:'#B9AA8D',night:'#0B1117',sky:'#334957',green:'#596C4E',orange:'#A8653F'};
const F='Noto Sans JP, Noto Sans CJK JP, sans-serif';
const hash=(s:string)=>[...s].reduce((a,c)=>((a*33)^c.charCodeAt(0))>>>0,127);
const tx=(s:string,x:number,y:number,sz=30,col=K.paper,w=700)=>new Txt({text:s,x,y,fontFamily:F,fontSize:sz,fill:col,fontWeight:w});
function rr(p:Node,x:number,y:number,w:number,h:number,fill:string,r=8,stroke?:string){const q=new Rect({x,y,width:w,height:h,fill,radius:r,stroke:stroke??fill,lineWidth:stroke?2:0});p.add(q);return q}
function cc(p:Node,x:number,y:number,r:number,fill:string){const q=new Circle({x,y,width:r*2,height:r*2,fill});p.add(q);return q}
function ln(p:Node,pts:[number,number][],col=K.muted,w=5){const q=new Line({points:pts,stroke:col,lineWidth:w,lineCap:'round',lineJoin:'round'});p.add(q);return q}
function label(p:Node,s:string,x:number,y:number,col=K.paper,sz=25,w=700){const q=tx(s,x,y,sz,col,w);p.add(q);return q}
function card(p:Node,s:string,x:number,y:number,w=280,col=K.gold){rr(p,x,y,w,68,K.deep,10,col);label(p,s,x,y,col,21)}
function person(p:Node,x:number,y:number,s=.7,col=K.paper){const g=new Node({x,y,scale:s});p.add(g);cc(g,0,-60,24,col);rr(g,0,20,60,118,col,16);ln(g,[[-18,-4],[-55,55]],col,10);ln(g,[[18,-4],[55,55]],col,10);ln(g,[[-18,80],[-26,150]],col,12);ln(g,[[18,80],[26,150]],col,12);return g}
function horse(p:Node,x:number,y:number,s=.8,col=K.earth){const g=new Node({x,y,scale:s});p.add(g);rr(g,0,20,160,70,col,30);cc(g,92,-15,34,col);ln(g,[[-55,50],[-72,120]],col,10);ln(g,[[-10,50],[-15,120]],col,10);ln(g,[[45,50],[60,120]],col,10);ln(g,[[80,35],[100,110]],col,10);return g}
function gate(p:Node,x=0,y=0,w=980,h=500){rr(p,x,y,w,h,'#2D2927',4,K.dust);rr(p,x,y+80,w*.28,h*.68,K.black,2);rr(p,x-w*.38,y-80,w*.18,h*.42,'#3B3330',2);rr(p,x+w*.38,y-80,w*.18,h*.42,'#3B3330',2);ln(p,[[x-w*.52,y-h*.52],[x+w*.52,y-h*.52]],K.red,18)}
function palace(p:Node){rr(p,0,0,1920,920,'#161718',0);rr(p,0,-210,1250,200,'#38282A',0);for(let i=0;i<7;i++)rr(p,-720+i*240,15,120,480,'#4A352E',4);rr(p,0,265,1500,70,'#352D29',0)}
function table(p:Node,x:number,y:number,w=700){rr(p,x,y,w,30,K.earth,4);ln(p,[[x-w*.4,y+15],[x-w*.4,y+115]],K.dust,7);ln(p,[[x+w*.4,y+15],[x+w*.4,y+115]],K.dust,7)}
function scroll(p:Node,x:number,y:number,w=340,h=180,title=''){rr(p,x,y,w,h,'#D8C9A9',5,K.bronze);cc(p,x-w/2,y,16,K.bronze);cc(p,x+w/2,y,16,K.bronze);if(title)label(p,title,x,y,K.ink,21)}
function banner(p:Node,x:number,y:number,h=260,col=K.red,title=''){ln(p,[[x,y-h*.6],[x,y+h*.65]],K.dust,8);rr(p,x+82,y-h*.25,160,h*.5,col,2);if(title)label(p,title,x+82,y-h*.25,K.paper,18)}
function wallCity(p:Node){rr(p,0,0,1920,920,'#242629',0);rr(p,0,145,1700,260,'#605747',0);for(let i=0;i<7;i++)rr(p,-720+i*240,-25,150,350,'#6B5F4E',2);rr(p,0,-210,520,160,'#514436',0)}
function mapGrid(p:Node){rr(p,0,0,1920,920,'#1C2424',0);for(let i=-4;i<=4;i++)ln(p,[[-800,i*80],[800,i*80]],'#34403A',2);for(let i=-8;i<=8;i++)ln(p,[[i*100,-340],[i*100,340]],'#34403A',2)}
function archive(p:Node){rr(p,0,0,1920,920,'#1E1B18',0);for(let i=0;i<5;i++){rr(p,-700+i*350,-50,220,560,'#3A2E25',5);for(let j=0;j<5;j++)scroll(p,-700+i*350,-220+j*100,150,65,'');}}
function court(p:Node){palace(p);rr(p,0,-125,400,150,'#5A3A2D',8,K.gold);person(p,0,-75,.45,K.gold);}
function infoPyramid(p:Node){rr(p,0,0,1920,920,'#101820',0);const ys=[220,100,-20,-140];const ws=[1200,900,600,300];for(let i=0;i<4;i++)rr(p,0,ys[i],ws[i],75,[K.stone,K.blue,K.jade,K.gold][i],6);}
function steppe(p:Node){rr(p,0,0,1920,920,'#25312A',0);rr(p,0,180,1920,440,'#53634A',0);ln(p,[[-900,-40],[-520,-180],[-120,-80],[260,-210],[650,-100],[900,-170]],K.sky,80);}
function historyRoom(p:Node){rr(p,0,0,1920,920,'#171513',0);table(p,0,185,900);for(let i=0;i<5;i++)scroll(p,-420+i*210,-40,170,110,['実録','詔','奏','史','記'][i]);cc(p,0,-210,90,K.gold);}
function graphAxes(p:Node){ln(p,[[-620,230],[-620,-250]],K.paper,4);ln(p,[[-620,230],[650,230]],K.paper,4);}
function stages8(){return Array.from({length:8},()=>new Node({opacity:0}));}
function worldBase(root:Node,scene:Scene){const pal=['#080D11','#0D1115','#111719','#131618','#0A1217','#181512'];rr(root,0,0,1920,1080,pal[hash(scene.motif)%pal.length],0);for(let i=0;i<10;i++)cc(root,-840+((hash(scene.motif+i.toString())%1680)),-350+((hash('y'+scene.motif+i)%560)),1.5+(i%3),i%2?K.gold:K.dust);rr(root,0,344,1920,3,'#282D2E',0)}

function addSceneText(p:Node,plan:Plan,variant:number){
  const L=plan.labels;
  if(variant%3===0){card(p,L[1],-420,250,260,K.gold);card(p,L[2],0,250,260,K.jade);card(p,L[3],420,250,260,K.red);}
  else if(variant%3===1){label(p,L[1],-430,260,K.gold,24);label(p,L[2],0,260,K.paper,24);label(p,L[3],430,260,K.jade,24);}
  else{card(p,L[1],-300,270,300,K.blue);card(p,L[2],300,270,300,K.red);}
}
function prologue(root:Node,s:Node[],plan:Plan,v:number){const[a,b,c,d,e,f,g,h]=s;
  if(v===0){rr(a,0,0,1920,920,K.night,0);gate(b,0,20);horse(c,-520,210,.42,K.earth);horse(c,520,210,.42,K.earth);for(let i=0;i<6;i++)person(d,-600+i*240,130,.27,K.stone);label(e,'626年・長安',0,-285,K.gold,32);ln(f,[[-350,-70],[350,-70]],K.red,5);label(g,'夜明け前',0,285,K.paper,27);}
  else if(v===1){rr(a,0,0,1920,920,K.night,0);gate(b,0,20);person(c,-560,150,.38,K.paper);person(c,560,150,.38,K.red);for(let i=0;i<5;i++)person(d,-120+i*60,40,.22,K.stone);ln(e,[[-500,100],[-120,40]],K.gold,7);ln(e,[[500,100],[120,40]],K.red,7);label(f,'門へ近づく二つの側',0,270,K.paper,26);}
  else if(v===2){gate(a,0,20);banner(b,-420,60,280,K.red,'建成');banner(c,420,60,280,K.blue,'世民');ln(d,[[-260,30],[260,30]],K.crimson,12);rr(e,0,200,700,80,K.black,6);label(e,'皇太子 → 秦王',0,200,K.gold,26);label(f,'流血の後に皇位へ',0,-255,K.paper,30);}
  else if(v===3){rr(a,0,0,1920,920,'#121116',0);person(b,0,70,.55,K.gold);for(let i=0;i<6;i++)person(c,-550+i*220,220,.24,K.stone);card(d,'粛清',-420,-120,250,K.red);card(e,'恐怖',0,-120,250,K.crimson);card(f,'迎合',420,-120,250,K.muted);label(g,'普通ならこの道へ',0,290,K.paper,27);}
  else if(v===4){court(a);person(b,-440,110,.42,K.paper);ln(c,[[-330,80],[-90,-30]],K.gold,7);scroll(d,-400,-110,300,140,'魏徴');card(e,'旧敵の側近',-400,220,280,K.red);card(f,'宮廷へ残す',360,220,280,K.jade);label(g,'排除しない',0,-260,K.paper,29);}
  else if(v===5){steppe(a);horse(b,-480,120,.45,K.earth);horse(b,480,120,.45,K.earth);banner(c,-520,-70,260,K.red,'皇帝');banner(d,520,-70,260,K.blue,'天可汗');ln(e,[[-300,0],[300,0]],K.gold,7);label(f,'二つの政治世界',0,260,K.paper,28);}
  else{rr(a,0,0,1920,920,'#090D11',0);person(b,-460,80,.45,K.gold);infoPyramid(c);cc(d,430,30,120,K.paper);label(d,'組織',430,30,K.ink,27);ln(e,[[-300,20],[270,20]],K.gold,8);card(f,'自分が賢い',-350,250,280,K.red);card(g,'組織を賢くする',350,250,320,K.jade);}
  addSceneText(h,plan,v);
}
function chapterA(root:Node,s:Node[],plan:Plan,v:number){const[a,b,c,d,e,f,g,h]=s;
  if(v===0){mapGrid(a);for(let i=0;i<7;i++)banner(b,-650+i*210,80+(i%2)*90,180,[K.red,K.blue,K.gold,K.jade][i%4],String(i+1));ln(c,[[-720,-170],[-350,-80],[0,-210],[380,-70],[720,-190]],K.crimson,9);label(d,'隋末',0,-280,K.gold,34);}
  else if(v===1){rr(a,0,0,1920,920,'#1B1816',0);for(let i=0;i<6;i++)scroll(b,-580+i*230,-40,190,100,['運河','徴発','遠征','兵役','税','高句麗'][i]);bar(c,-100,230,1100,.92,K.red,'国家負担');label(d,'能力を使い切る国家',0,-270,K.paper,31);}
  else if(v===2){wallCity(a);horse(b,-520,100,.5,K.earth);person(c,-420,30,.4,K.gold);for(let i=0;i<5;i++)banner(d,-100+i*170,30,190,[K.red,K.blue,K.jade,K.gold][i%4],['王','竇','唐','軍','城'][i]);ln(e,[[-380,80],[430,40]],K.gold,8);label(f,'戦場が最初の教室',0,-270,K.paper,31);}
  else if(v===3){wallCity(a);rr(b,0,180,600,100,K.earth,4);scroll(c,-360,-80,280,150,'占領');scroll(d,360,-80,280,150,'統治');ln(e,[[-160,-80],[160,-80]],K.gold,8);card(f,'翌月も動く町',0,280,300,K.jade);}
  else if(v===4){rr(a,0,0,1920,920,'#1A1D18',0);for(let i=0;i<7;i++)rr(b,-600+i*200,170,120,250,K.earth,2);for(let i=0;i<7;i++)ln(c,[[-600+i*200,120],[-600+i*200,-80]],K.gold,4);card(d,'徴税',-380,-180,240,K.red);card(e,'徴兵',0,-180,240,K.crimson);card(f,'翌年の生産',380,-180,280,K.jade);}
  else if(v===5){mapGrid(a);rr(b,0,20,700,380,K.stone,8);label(b,'隋',0,20,K.paper,70);ln(c,[[-350,-150],[350,190]],K.red,14);card(d,'反面教師',0,280,280,K.gold);label(e,'強大でも崩れる',0,-250,K.paper,29);}
  else{graphAxes(a);ln(b,[[-560,180],[-300,100],[-50,-40],[220,-130],[520,-185]],K.cyan,10);ln(c,[[-560,-180],[-300,-80],[-50,30],[220,100],[520,160]],K.red,10);label(d,'国家能力',-450,-200,K.cyan,25);label(e,'社会負担',-450,160,K.red,25);cc(f,-50,-5,28,K.gold);card(g,'自制',300,270,240,K.gold);}
  addSceneText(h,plan,v);
}
function chapterB(root:Node,s:Node[],plan:Plan,v:number){const[a,b,c,d,e,f,g,h]=s;archive(a);
  if(v===0){['隋','高祖','唐'].forEach((x,i)=>scroll(b,-420+i*420,-120,300,160,x));ln(c,[[-270,-80],[270,-80]],K.gold,7);card(d,'継承',0,220,260,K.jade);}
  else if(v===1){person(b,-520,130,.42,K.gold);for(let i=0;i<6;i++)scroll(c,-260+i*105,-80,90,110,String(i+1));card(d,'全部作り直す？',380,210,320,K.red);ln(e,[[-400,80],[250,80]],K.crimson,7);}
  else if(v===2){scroll(b,-420,-30,430,560,'旧制度');scroll(c,420,-30,430,560,'編集後');['残す','削る','直す'].forEach((x,i)=>card(d,x,0,-120+i*120,240,[K.jade,K.red,K.gold][i]));ln(e,[[-180,-30],[180,-30]],K.gold,8);}
  else if(v===3){for(let i=0;i<5;i++)scroll(b,-500+i*250,-40,210,150,['州県','法','税','軍','人事'][i]);person(c,0,180,.35,K.gold);label(d,'制度は皇帝より長生きする',0,-260,K.paper,29);}
  else if(v===4){scroll(b,-350,-30,420,500,'継続');scroll(c,350,-30,420,500,'改善');ln(d,[[-120,-20],[120,-20]],K.gold,8);bar(e,0,255,850,.72,K.jade,'社会への衝撃を抑える');}
  else{person(b,-500,90,.42,K.gold);for(let i=0;i<5;i++)person(c,-180+i*180,110,.28,[K.paper,K.jade,K.blue,K.gold,K.red][i]);ln(d,[[-380,70],[-120,80],[180,80],[430,80]],K.gold,5);card(e,'全部知る必要はない',0,-150,360,K.jade);card(f,'配置して編集する',0,260,330,K.gold);}
  addSceneText(h,plan,v);
}
function chapterC(root:Node,s:Node[],plan:Plan,v:number){const[a,b,c,d,e,f,g,h]=s;court(a);
  if(v===0){for(let i=0;i<6;i++)person(b,-620+i*245,180,.27,K.paper);for(let i=0;i<5;i++)scroll(c,-480+i*240,80,180,85,['税','軍','地方','財政','人事'][i]);label(d,'朝議',0,-260,K.gold,33);}
  else if(v===1){for(let i=0;i<5;i++)scroll(b,-500+i*250,80,190,100,['敵弱い','余裕有','平穏','順調','賛成'][i]);ln(c,[[-500,160],[0,-40],[500,160]],K.red,5);card(d,'皇帝が聞きたい情報',0,250,360,K.red);}
  else if(v===2){person(b,-500,120,.42,K.paper);scroll(c,-500,-100,310,150,'李建成旧臣');ln(d,[[-360,80],[-120,-20]],K.red,6);card(e,'魏徴',-500,245,220,K.gold);card(f,'危険人物？',350,245,270,K.red);}
  else if(v===3){person(b,-430,120,.42,K.paper);scroll(c,-430,-100,330,150,'諫言');ln(d,[[-300,40],[-80,-30]],K.gold,8);rr(e,350,80,340,240,K.deep,10,K.red);label(e,'浪費・遠征・人事',350,80,K.red,24);card(f,'反対するから価値がある',200,260,390,K.jade);}
  else if(v===4){scroll(b,-420,-20,430,540,'貞観政要');scroll(c,420,-20,430,540,'史実');ln(d,[[-160,-20],[160,-20]],K.gold,6);label(e,'≠ 録音記録',0,210,K.red,31);card(f,'政治的教訓書',0,285,310,K.gold);}
  else if(v===5){rr(b,-430,20,400,520,'#32383A',16,K.dust);person(b,-430,20,.34,K.gold);person(c,420,120,.4,K.paper);ln(d,[[260,80],[-220,40]],K.gold,7);card(e,'鏡',-430,265,220,K.gold);card(f,'自分の過ちを映す',350,265,330,K.jade);}
  else{person(b,0,60,.5,K.gold);for(let i=0;i<5;i++)cc(c,-420+i*210,180,55,[K.red,K.jade,K.gold,K.blue,K.paper][i]);ln(d,[[-420,180],[0,60],[420,180]],K.dust,4);card(e,'正しい皇帝',-330,280,280,K.red);card(f,'訂正される皇帝',330,280,300,K.jade);}
  addSceneText(h,plan,v);
}
function chapterD(root:Node,s:Node[],plan:Plan,v:number){const[a,b,c,d,e,f,g,h]=s;
  if(v===0){infoPyramid(a);person(b,0,-180,.38,K.gold);['村','州','省','皇帝'].forEach((x,i)=>label(c,x,0,225-i*120,K.paper,22));for(let i=0;i<5;i++)cc(d,-500+i*250,270,22,K.red);card(e,'直接見えない',430,-170,270,K.red);}
  else if(v===1){infoPyramid(a);['飢饉','被害大','やや不足','概ね平穏'].forEach((x,i)=>scroll(b,-430+i*290,220-i*120,250,85,x));ln(c,[[-430,190],[440,-130]],K.red,6);label(d,'上へ行くほど薄まる',0,-260,K.paper,29);}
  else if(v===2){court(a);person(b,-480,120,.38,K.paper);scroll(c,-480,-80,300,140,'反対意見');person(d,0,-70,.36,K.gold);ln(e,[[-350,70],[-120,-20]],K.gold,6);card(f,'翌日も同じ席',350,220,300,K.jade);}
  else if(v===3){rr(a,0,0,1920,920,'#101318',0);person(b,0,-60,.48,K.red);for(let i=0;i<7;i++)person(c,-600+i*200,180,.26,K.muted);ln(d,[[-600,100],[600,100]],K.red,12);card(e,'命令は速い',-330,270,260,K.red);card(f,'情報は止まる',330,270,260,K.muted);}
  else if(v===4){graphAxes(a);ln(b,[[-560,-150],[-250,-60],[0,30],[250,110],[560,170]],K.red,10);ln(c,[[-560,170],[-250,90],[0,10],[250,-100],[560,-180]],K.jade,10);label(d,'命令速度',-420,-190,K.red,24);label(e,'修正能力',-420,160,K.jade,24);cc(f,0,20,28,K.gold);}
  else{infoPyramid(a);for(let i=0;i<5;i++)ln(b,[[-500+i*250,220],[-250+i*125,-120]],K.gold,4);cc(c,0,-170,70,K.gold);label(c,'TOP',0,-170,K.ink,19);card(d,'正しい情報が届く構造',0,280,390,K.gold);label(e,'情報アーキテクチャ',0,-260,K.paper,31);}
  addSceneText(h,plan,v);
}
function chapterE(root:Node,s:Node[],plan:Plan,v:number){const[a,b,c,d,e,f,g,h]=s;palace(a);
  if(v===0){const names=['房玄齢','杜如晦','魏徴','長孫無忌'];names.forEach((x,i)=>{person(b,-480+i*320,100,.32,[K.blue,K.red,K.jade,K.gold][i]);card(c,x,-480+i*320,230,220,[K.blue,K.red,K.jade,K.gold][i]);});}
  else if(v===1){person(b,0,-40,.44,K.gold);for(let i=0;i<6;i++)person(c,-550+i*220,180,.28,K.paper);for(let i=0;i<6;i++)ln(d,[[0,20],[-550+i*220,140]],K.dust,3);card(e,'同じ価値観',-330,280,260,K.red);card(f,'同じ盲点',330,280,260,K.crimson);}
  else if(v===2){person(b,-380,80,.42,K.blue);person(c,380,80,.42,K.red);scroll(d,-380,-110,300,150,'構想');scroll(e,380,-110,300,150,'決断');ln(f,[[-180,70],[180,70]],K.gold,7);card(g,'異なる役割',0,270,280,K.jade);}
  else if(v===3){for(let i=0;i<5;i++)person(b,-500+i*250,100,.3,i<3?K.gold:K.paper);scroll(c,0,-130,360,150,'門閥・家門');card(d,'科挙だけではない',0,230,320,K.red);label(e,'初唐 ≠ 完全能力主義',0,-265,K.paper,28);}
  else if(v===4){for(let i=0;i<4;i++)cc(b,-450+i*300,-50,95,[K.red,K.blue,K.gold,K.jade][i]);for(let i=0;i<4;i++)ln(c,[[-450+i*300,40],[0,180]],K.dust,4);cc(d,0,180,110,K.paper);label(d,'宮廷',0,180,K.ink,23);card(e,'偏りを調整',0,295,280,K.gold);}
  else{person(b,0,-60,.45,K.gold);const xs=[-520,-260,0,260,520];xs.forEach((x,i)=>{cc(c,x,140,60,[K.blue,K.red,K.jade,K.gold,K.paper][i]);ln(d,[[0,10],[x,100]],K.dust,3);});card(e,'最高の答えが出やすい配置',0,285,430,K.jade);label(f,'トップの知性 < 組織の知性',0,-260,K.gold,29);}
  addSceneText(h,plan,v);
}
function chapterF(root:Node,s:Node[],plan:Plan,v:number){const[a,b,c,d,e,f,g,h]=s;steppe(a);
  if(v===0){for(let i=0;i<6;i++)horse(b,-600+i*240,120,.32,i<3?K.earth:K.stone);banner(c,-420,-60,250,K.red,'唐');banner(d,420,-60,250,K.blue,'突厥');ln(e,[[-250,20],[250,20]],K.gold,9);label(f,'630年前後',0,-270,K.gold,31);}
  else if(v===1){person(b,0,20,.48,K.gold);banner(c,-430,-20,260,K.red,'皇帝');banner(d,430,-20,260,K.blue,'天可汗');ln(e,[[-250,20],[250,20]],K.gold,6);card(f,'二つの称号',0,270,280,K.gold);}
  else if(v===2){const xs=[-520,-260,0,260,520];xs.forEach((x,i)=>banner(b,x,50,220,[K.red,K.blue,K.jade,K.gold,K.orange][i],['部族','州','首領','官職','唐'][i]));ln(c,[[-520,160],[520,160]],K.dust,5);card(d,'在来統治を利用',0,270,310,K.jade);}
  else if(v===3){mapGrid(a);cc(b,0,0,120,K.gold);for(let i=0;i<8;i++){const ang=i*Math.PI/4;const x=Math.cos(ang)*520,y=Math.sin(ang)*250;cc(c,x,y,45,K.muted);ln(d,[[0,0],[x,y]],K.red,3);}bar(e,0,285,900,.88,K.red,'直接統治コスト');}
  else if(v===4){horse(b,-500,90,.4,K.earth);rr(c,0,30,500,250,K.stone,8);label(c,'勝利',0,30,K.paper,40);scroll(d,500,30,360,200,'統治');ln(e,[[-280,60],[-180,40],[180,40],[300,40]],K.gold,8);card(f,'戦争 → 制度',0,270,280,K.jade);}
  else{mapGrid(a);rr(b,-380,0,430,430,K.deep,8,K.red);label(b,'中央',-380,0,K.red,38);rr(c,380,0,430,430,K.deep,8,K.blue);label(c,'周辺',380,0,K.blue,38);ln(d,[[-150,0],[150,0]],K.gold,8);card(e,'異なる仕組みを接続',0,270,360,K.gold);label(f,'柔軟な帝国',0,-265,K.paper,31);}
  addSceneText(h,plan,v);
}
function chapterG(root:Node,s:Node[],plan:Plan,v:number){const[a,b,c,d,e,f,g,h]=s;
  if(v===0){court(a);person(b,0,-40,.48,K.gold);for(let i=0;i<5;i++)scroll(c,-500+i*250,140,190,95,['統一','突厥','安定','使節','成功'][i]);for(let i=0;i<5;i++)ln(d,[[-500+i*250,90],[0,0]],K.gold,3);card(e,'成功が人を変える',0,270,320,K.red);}
  else if(v===1){mapGrid(a);banner(b,-520,-40,260,K.red,'唐');banner(c,520,-40,260,K.blue,'高句麗');for(let i=0;i<7;i++)horse(d,-500+i*170,170,.26,K.earth);ln(e,[[-350,0],[350,0]],K.red,9);card(f,'645年',0,-220,220,K.gold);}
  else if(v===2){scroll(a,-430,0,420,560,'隋の失敗');scroll(b,430,0,420,560,'太宗の遠征');ln(c,[[-170,0],[170,0]],K.gold,7);card(d,'反面教師へ近づく',0,260,340,K.red);label(e,'成功後のリスク認識',0,-250,K.paper,29);}
  else if(v===3){palace(a);for(let i=0;i<4;i++)person(b,-420+i*280,100,.34,[K.red,K.blue,K.gold,K.jade][i]);for(let i=0;i<4;i++)banner(c,-420+i*280,-100,180,[K.red,K.blue,K.gold,K.jade][i],['皇太子','魏王','晋王','派閥'][i]);ln(d,[[-420,160],[420,160]],K.crimson,7);card(e,'643年・継承再編',0,275,330,K.gold);}
  else if(v===4){graphAxes(a);ln(b,[[-560,180],[-320,100],[-50,-20],[250,-120],[560,-180]],K.gold,10);ln(c,[[-560,-160],[-320,-80],[-50,10],[250,90],[560,170]],K.red,10);label(d,'成功',-420,-190,K.gold,25);label(e,'過信リスク',-420,160,K.red,25);cc(f,-50,0,28,K.paper);}
  else{rr(a,0,0,1920,920,'#111316',0);rr(b,-360,20,420,520,'#2A3031',14,K.dust);person(b,-360,20,.34,K.gold);person(c,360,100,.42,K.paper);ln(d,[[220,70],[-150,40]],K.gold,7);card(e,'成功するほど鏡が必要',0,280,380,K.gold);label(f,'権威↑ → 諫言価値↑',0,-260,K.jade,29);}
  addSceneText(h,plan,v);
}
function chapterH(root:Node,s:Node[],plan:Plan,v:number){const[a,b,c,d,e,f,g,h]=s;historyRoom(a);
  if(v===0){person(b,-420,90,.36,K.paper);scroll(c,-250,-40,310,160,'今日の記録');scroll(d,180,-40,310,160,'後世の史書');ln(e,[[-80,-20],[20,-20]],K.gold,7);label(f,'歴史官',-420,250,K.gold,27);}
  else if(v===1){person(b,420,70,.4,K.gold);scroll(c,0,-40,450,210,'実録');ln(d,[[280,50],[120,-10]],K.gold,7);card(e,'皇帝が閲覧を求める',220,260,340,K.red);label(f,'自分の記録を意識',0,-260,K.paper,29);}
  else if(v===2){person(b,0,-70,.46,K.gold);for(let i=0;i<4;i++)scroll(c,-450+i*300,120,240,110,['諫言受容','節制','寛容','反省'][i]);ln(d,[[-450,60],[0,-20],[450,60]],K.gold,4);card(e,'後世への自己演出？',0,280,350,K.red);}
  else if(v===3){scroll(b,-380,-20,440,560,'実際の治世');scroll(c,380,-20,440,560,'貞観の治');ln(d,[[-160,-20],[160,-20]],K.gold,7);card(e,'史実',-260,270,220,K.jade);card(f,'記憶',260,270,220,K.gold);}
  else if(v===4){scroll(b,-420,-20,430,560,'理想化');scroll(c,420,-20,430,560,'実績');ln(d,[[-160,-20],[160,-20]],K.paper,7);label(e,'どちらか一方にしない',0,275,K.paper,28);card(f,'分けて読む',0,-220,260,K.gold);}
  else{person(b,-430,90,.4,K.gold);scroll(c,0,-30,420,520,'統治の物語');for(let i=0;i<4;i++)person(d,320+i*110,160,.22,K.paper);ln(e,[[-220,20],[250,120]],K.gold,6);card(f,'政治遺産',420,280,260,K.jade);label(g,'国家 + 物語',0,-260,K.gold,31);}
  addSceneText(h,plan,v);
}
function chapterI(root:Node,s:Node[],plan:Plan,v:number){const[a,b,c,d,e,f,g,h]=s;
  if(v===0){rr(a,0,0,1920,920,'#0E1317',0);person(b,0,-40,.46,K.gold);for(let i=0;i<6;i++)scroll(c,-550+i*220,150,190,100,['長期','領土','即位','軍事','法','記憶'][i]);card(d,'なぜ李世民？',0,280,300,K.gold);label(e,'比較の軸が多すぎる',0,-260,K.paper,28);}
  else if(v===1){person(a,-520,80,.42,K.gold);for(let i=0;i<5;i++)person(b,-150+i*170,100,.28,[K.paper,K.jade,K.blue,K.red,K.gold][i]);ln(c,[[-390,70],[-110,70],[80,70],[260,70],[520,70]],K.dust,4);card(d,'全部自分で決めない',0,270,330,K.jade);label(e,'異論を残す',0,-260,K.gold,30);}
  else if(v===2){archive(a);scroll(b,-430,-20,420,520,'既存制度');scroll(c,430,-20,420,520,'必要な修正');ln(d,[[-160,-20],[160,-20]],K.gold,7);card(e,'毎年作り替えない',0,270,320,K.jade);}
  else if(v===3){steppe(a);horse(b,-500,100,.4,K.earth);scroll(c,500,40,400,220,'外交・行政');ln(d,[[-250,50],[250,50]],K.gold,8);card(e,'勝利を統治へ翻訳',0,270,350,K.gold);}
  else if(v===4){graphAxes(a);ln(b,[[-560,-160],[-250,-80],[0,20],[280,100],[560,160]],K.red,9);ln(c,[[-560,170],[-250,100],[0,20],[280,-80],[560,-160]],K.jade,9);cc(d,0,20,32,K.gold);card(e,'誤りを局所化',0,280,290,K.gold);label(f,'修正可能性',0,-250,K.paper,30);}
  else{historyRoom(a);scroll(b,0,-20,500,560,'統治の教科書');person(c,-480,120,.3,K.paper);person(c,480,120,.3,K.paper);card(d,'ランキング1位？',-330,280,280,K.red);card(e,'千年の教材',330,280,280,K.jade);label(f,'後世が読み直す型',0,-260,K.gold,30);}
  addSceneText(h,plan,v);
}
function epilogue(root:Node,s:Node[],plan:Plan,v:number){const[a,b,c,d,e,f,g,h]=s;
  if(v===0){rr(a,0,0,1920,920,K.night,0);gate(b,0,20);person(c,0,120,.42,K.paper);label(d,'28歳',0,-240,K.gold,34);card(e,'未来はまだ決まっていない',0,270,360,K.paper);}
  else if(v===1){mapGrid(a);timeline(b,20,[{x:-620,label:'626',col:K.red},{x:0,label:'637',col:K.gold},{x:620,label:'649',col:K.jade}]);banner(c,-500,-100,220,K.red,'内戦');banner(d,500,-100,220,K.jade,'帝国');label(e,'23年間',0,250,K.paper,30);}
  else if(v===2){historyRoom(a);for(let i=0;i<6;i++)scroll(b,-520+i*210,40,180,120,['魏徴','諫言','節制','鏡','貞観','君主'][i]);for(let i=0;i<5;i++)person(c,-420+i*210,230,.2,K.paper);card(d,'死後も読まれる',0,-190,300,K.gold);}
  else if(v===3){rr(a,0,0,1920,920,'#111316',0);person(b,0,-40,.46,K.gold);['兄弟殺害','遠征','継承問題','歴史評価'].forEach((x,i)=>scroll(c,-450+i*300,150,250,110,x));card(d,'聖人ではない',0,285,280,K.red);label(e,'だから制度を見る',0,-250,K.paper,30);}
  else if(v===4){person(a,-520,80,.42,K.gold);infoPyramid(b);for(let i=0;i<5;i++)cc(c,-420+i*210,180,50,[K.red,K.jade,K.gold,K.blue,K.paper][i]);ln(d,[[-420,180],[0,-100],[420,180]],K.dust,4);card(e,'自分一人より賢い国家',0,285,390,K.jade);}
  else{rr(a,0,0,1920,920,'#05080B',0);person(b,-420,70,.44,K.gold);for(let i=0;i<6;i++)person(c,-150+i*130,130,.25,[K.paper,K.jade,K.blue,K.red,K.gold,K.muted][i]);ln(d,[[-300,80],[500,140]],K.gold,6);card(e,'正しさ',-320,270,250,K.red);card(f,'修正可能性',320,270,280,K.jade);label(g,'組織全体を賢くする',0,-255,K.gold,31);}
  addSceneText(h,plan,v);
}

function buildScene(root:Node,scene:Scene,plan:Plan):Node[]{
  worldBase(root,scene);const s=stages8();s.forEach(n=>root.add(n));
  switch(scene.motif){
    case 'xuanwu_before_dawn':prologue(root,s,plan,0);break;case 'ambush_tension':prologue(root,s,plan,1);break;case 'brothers_fall':prologue(root,s,plan,2);break;case 'expected_tyrant_path':prologue(root,s,plan,3);break;case 'weizheng_turn':prologue(root,s,plan,4);break;case 'heavenly_khan_preview':prologue(root,s,plan,5);break;case 'central_leadership_question':prologue(root,s,plan,6);break;
    case 'sui_collapse_road':chapterA(root,s,plan,0);break;case 'sui_burden_machine':chapterA(root,s,plan,1);break;case 'young_general_campaign':chapterA(root,s,plan,2);break;case 'occupation_is_not_rule':chapterA(root,s,plan,3);break;case 'state_consumes_people':chapterA(root,s,plan,4);break;case 'sui_as_negative_example':chapterA(root,s,plan,5);break;case 'first_rule_of_governance':chapterA(root,s,plan,6);break;
    case 'inherited_bureaucracy':chapterB(root,s,plan,0);break;case 'new_ruler_temptation':chapterB(root,s,plan,1);break;case 'editor_not_inventor':chapterB(root,s,plan,2);break;case 'documents_on_table':chapterB(root,s,plan,3);break;case 'institutional_continuity':chapterB(root,s,plan,4);break;case 'editor_leadership':chapterB(root,s,plan,5);break;
    case 'morning_court':chapterC(root,s,plan,0);break;case 'information_distortion':chapterC(root,s,plan,1);break;case 'weizheng_origin':chapterC(root,s,plan,2);break;case 'weizheng_remonstrates':chapterC(root,s,plan,3);break;case 'zhenguan_zhengyao_caution':chapterC(root,s,plan,4);break;case 'mirror_metaphor':chapterC(root,s,plan,5);break;case 'self_correction_system':chapterC(root,s,plan,6);break;
    case 'emperor_cannot_see_all':chapterD(root,s,plan,0);break;case 'bad_news_filter':chapterD(root,s,plan,1);break;case 'safe_dissent_signal':chapterD(root,s,plan,2);break;case 'fear_vs_information':chapterD(root,s,plan,3);break;case 'strong_leader_paradox':chapterD(root,s,plan,4);break;case 'information_architecture':chapterD(root,s,plan,5);break;
    case 'talent_roster':chapterE(root,s,plan,0);break;case 'homophily_trap':chapterE(root,s,plan,1);break;case 'different_roles':chapterE(root,s,plan,2);break;case 'not_modern_meritocracy':chapterE(root,s,plan,3);break;case 'balance_elites':chapterE(root,s,plan,4);break;case 'organization_smarter_than_leader':chapterE(root,s,plan,5);break;
    case 'steppe_after_victory':chapterF(root,s,plan,0);break;case 'heavenly_khan_title':chapterF(root,s,plan,1);break;case 'jimi_governance':chapterF(root,s,plan,2);break;case 'direct_rule_cost':chapterF(root,s,plan,3);break;case 'war_to_governance':chapterF(root,s,plan,4);break;case 'hybrid_empire':chapterF(root,s,plan,5);break;
    case 'success_changes_ruler':chapterG(root,s,plan,0);break;case 'goguryeo_campaign':chapterG(root,s,plan,1);break;case 'old_warning_returns':chapterG(root,s,plan,2);break;case 'succession_crisis':chapterG(root,s,plan,3);break;case 'success_overconfidence':chapterG(root,s,plan,4);break;case 'need_for_mirror_grows':chapterG(root,s,plan,5);break;
    case 'historians_at_night':chapterH(root,s,plan,0);break;case 'taizong_reads_history':chapterH(root,s,plan,1);break;case 'performance_for_posterity':chapterH(root,s,plan,2);break;case 'zhenguan_as_constructed_memory':chapterH(root,s,plan,3);break;case 'myth_does_not_erase_rule':chapterH(root,s,plan,4);break;case 'ruler_of_state_and_story':chapterH(root,s,plan,5);break;
    case 'why_him':chapterI(root,s,plan,0);break;case 'not_know_everything':chapterI(root,s,plan,1);break;case 'not_constant_reform':chapterI(root,s,plan,2);break;case 'victory_after_victory':chapterI(root,s,plan,3);break;case 'error_containment':chapterI(root,s,plan,4);break;case 'teaching_model':chapterI(root,s,plan,5);break;
    case 'return_xuanwu':epilogue(root,s,plan,0);break;case 'twenty_three_years_later':epilogue(root,s,plan,1);break;case 'books_after_death':epilogue(root,s,plan,2);break;case 'imperfect_human_system':epilogue(root,s,plan,3);break;case 'make_state_smarter':epilogue(root,s,plan,4);break;case 'final_definition':epilogue(root,s,plan,5);break;
    default:throw new Error('V127 missing dedicated scene '+scene.motif);
  }
  return s;
}
function offsetFor(scene:Scene,i:number):[number,number,number]{const p=hash(scene.motif+scene.id)%12,mag=22+(i%4)*9;switch(p){case 0:return[i%2?mag:-mag,0,.94];case 1:return[0,i%2?mag:-mag,.94];case 2:return[i%2?mag:-mag,i%3?14:-14,.92];case 3:return[0,0,.84];case 4:return[i<4?-mag:mag,i%2?14:-14,.94];case 5:return[i%3===0?mag:0,i%2?mag:-mag,.95];case 6:return[i%2?-mag:mag,i<4?-15:15,.92];case 7:return[i<4?-mag:mag,0,.9];case 8:return[0,i<4?mag:-mag,.9];case 9:return[i%2?mag:-mag,i%2?-10:10,.93];case 10:return[i<2?0:(i%2?mag:-mag),i>5?-12:12,.91];default:return[i%3===0?-mag:mag*.5,i%2?11:-11,.93];}}
function settleTarget(scene:Scene,plan:Plan,i:number){const z=hash(scene.motif+plan.motion+i);let x=((z%13)-6)*1.15,y=(((z>>4)%11)-5),r=((z>>8)%7-3)*.32,s=1.01,opacity=1;const m=plan.motion;if(m.includes('xuanwu')||m.includes('campaign'))x=i<4?-9:9;if(m.includes('information')||m.includes('news'))y=i>3?-8:5;if(m.includes('mirror'))s=1.026;if(m.includes('history')||m.includes('memory'))r=i%2?.7:-.7;if(m.includes('empire')||m.includes('steppe'))x=i%2?8:-8;if(m.includes('success'))s=i>4?1.024:1.008;return{x,y,r,s,opacity};}
function* microStageFlow(stages:Node[],scene:Scene,plan:Plan):ThreadGenerator{const base=[.02,.12,.23,.34,.45,.56,.67,.78];let cursor=0;for(let i=0;i<8;i++){const[ox,oy,os]=offsetFor(scene,i);stages[i].x(ox);stages[i].y(oy);stages[i].scale(os);stages[i].rotation(i%2?.8:-.8);const at=scene.duration*Math.min(.82,base[i]+(((hash(scene.motif+i.toString())>>3)&7)*.002));if(at>cursor)yield* waitFor(at-cursor);cursor=at;const reveal=Math.min(.44,Math.max(.16,scene.duration*.012));yield* all(stages[i].opacity(1,reveal),stages[i].x(0,reveal),stages[i].y(0,reveal),stages[i].scale(1,reveal),stages[i].rotation(0,reveal));cursor+=reveal;const t=settleTarget(scene,plan,i),settle=Math.min(.33,Math.max(.14,scene.duration*.009));yield* all(stages[i].x(t.x,settle),stages[i].y(t.y,settle),stages[i].rotation(t.r,settle),stages[i].scale(t.s,settle),stages[i].opacity(t.opacity,settle));cursor+=settle;const accent=Math.min(.25,Math.max(.11,scene.duration*.007));yield* all(stages[i].scale(t.s*(i%2?1.012:.996),accent),stages[i].opacity(i%3===0?.92:1,accent));cursor+=accent;if(i>=3)stages[i-3].opacity(.72);}const end=scene.duration*.91;if(end>cursor){yield* waitFor(end-cursor);cursor=end;}if(scene.duration>cursor)yield* waitFor(scene.duration-cursor);}
function* cameraFlow(node:Node,duration:number,motif:string):ThreadGenerator{const p=hash(motif)%8,dx=[11,-13,10,-9,15,-11,8,-10][p],dy=[-5,7,6,-7,3,-4,8,-6][p];node.scale(1.006);const q=duration/6;yield* all(node.x(dx,q),node.y(dy,q),node.scale(1.012,q));yield* all(node.x(-dx*.4,q),node.y(-dy*.55,q),node.scale(1.018,q));yield* all(node.x(dx*.55,q),node.y(dy*.18,q),node.scale(1.014,q));yield* all(node.x(-dx*.22,q),node.y(-dy*.22,q),node.scale(1.02,q));yield* all(node.x(dx*.12,q),node.y(dy*.08,q),node.scale(1.013,q));const tail=Math.max(.01,duration-5*q);yield* all(node.x(0,tail),node.y(0,tail),node.scale(1.008,tail));}
function* subtitleFlow(cues:Cue[],caption:Txt,duration:number):ThreadGenerator{let t=0;for(const c of cues){if(c.start>t)yield* waitFor(c.start-t);caption.text(c.display);t=c.start;}if(duration>t)yield* waitFor(duration-t);caption.text('');}
export function* playMeaningScene(view:View2D,scene:Scene):ThreadGenerator{const plan=(visualPlan as Record<string,Plan>)[scene.motif];if(!plan)throw new Error('V127 visual plan missing: '+scene.motif);view.fill(K.bg);const contentLayer=new Node({});const headingLayer=new Node({});const subtitleBacking=new Node({});const subtitleTextLayer=new Node({});view.add(contentLayer);view.add(headingLayer);view.add(subtitleBacking);view.add(subtitleTextLayer);const stages=buildScene(contentLayer,scene,plan);rr(headingLayer,0,-474,1920,132,'#05090D',0);const part=scene.chapter==='prologue'?'PROLOGUE':scene.chapter==='epilogue'?'EPILOGUE':scene.chapter.toUpperCase();headingLayer.add(tx(part,-800,-508,22,K.gold,700));headingLayer.add(tx(scene.id,830,-508,21,K.muted,600));headingLayer.add(tx(scene.title,0,-452,scene.title.length>35?27:scene.title.length>25?31:40,K.paper,700));rr(subtitleBacking,0,460,1920,170,'#020406',0).opacity(.92);const caption=tx('',0,458,40,K.paper,650);caption.lineHeight(57);subtitleTextLayer.add(caption);yield* all(microStageFlow(stages,scene,plan),cameraFlow(contentLayer,scene.duration,scene.motif),subtitleFlow(scene.cues,caption,scene.duration));}
