import '@fontsource/noto-sans-jp/400.css';
import '@fontsource/noto-sans-jp/700.css';
import {Circle, Line, Node, Rect, Txt, type View2D} from '@motion-canvas/2d';
import {all, waitFor, type ThreadGenerator} from '@motion-canvas/core';

interface Cue{text:string;display:string;start:number;end:number}
interface MeaningScene{id:string;chapter:string;motif:string;title:string;narration:string;cues:Cue[];duration:number}
const P={bg:'#08131B',bg2:'#12252E',paper:'#EEE9DF',muted:'#8498A2',red:'#C94F4D',gold:'#C9A35F',cyan:'#71AEB9',teal:'#6D9589',blue:'#56788F',green:'#6F8D72',line:'#30454F',shadow:'#182B34',brown:'#755E4B',cream:'#D7D0C2'};
const FONT='Noto Sans JP, Noto Sans CJK JP, sans-serif';
const q=(v:number)=>Math.max(0,Math.min(1,v));
const hash=(s:string)=>[...s].reduce((a,c)=>((a*33)^c.charCodeAt(0))>>>0,120);
const txt=(s:string,x:number,y:number,sz=33,col=P.paper,weight=600)=>new Txt({text:s,x,y,fontFamily:FONT,fontSize:sz,fill:col,fontWeight:weight});
const rect=(p:Node,x:number,y:number,w:number,h:number,fill=P.shadow,r=10,stroke?:string)=>p.add(new Rect({x,y,width:w,height:h,fill,radius:r,stroke:stroke??fill,lineWidth:stroke?2:0}));
const circle=(p:Node,x:number,y:number,r:number,fill=P.paper)=>p.add(new Circle({x,y,width:r*2,height:r*2,fill}));
const line=(p:Node,pts:[number,number][],col=P.line,w=4)=>p.add(new Line({points:pts,stroke:col,lineWidth:w,lineCap:'round',lineJoin:'round'}));
const arrow=(p:Node,a:[number,number],b:[number,number],col=P.gold,w=6)=>p.add(new Line({points:[a,b],stroke:col,lineWidth:w,endArrow:true,arrowSize:14}));
const label=(p:Node,s:string,x:number,y:number,col=P.gold,sz=31)=>p.add(txt(s,x,y,sz,col,700));
function person(p:Node,x:number,y:number,s=1,col=P.paper){const g=new Node({x,y,scale:s});circle(g,0,-52,24,col);rect(g,0,25,52,112,col,18);line(g,[[-16,74],[-24,150]],col,13);line(g,[[16,74],[24,150]],col,13);line(g,[[-24,-1],[-66,58]],col,11);line(g,[[24,-1],[66,58]],col,11);p.add(g);}
function building(p:Node,x:number,y:number,w:number,h:number,tag=''){rect(p,x,y,w,h,'#18313B',7,P.line);for(let i=-2;i<=2;i++)for(let j=-1;j<=1;j++)rect(p,x+i*w*.16,y+j*h*.22,22,30,(i+j)%3?'#34505C':'#566A70',3);if(tag)label(p,tag,x,y+h*.59,P.gold,24);}
function truck(p:Node,x:number,y:number,s=1){const g=new Node({x,y,scale:s});rect(g,-35,0,210,92,'#566E78',12);rect(g,105,18,95,70,'#3A5360',10);circle(g,-85,55,25,'#171E22');circle(g,105,55,25,'#171E22');p.add(g);}
function shelf(p:Node,x:number,y:number,s=1){const g=new Node({x,y,scale:s});rect(g,0,0,330,410,'#45565D',5);for(let r=0;r<4;r++){rect(g,0,-135+r*90,300,10,'#A9A298',0);for(let i=0;i<5;i++)rect(g,-110+i*55,-170+r*90,34,52,[P.gold,P.red,P.teal,P.cream][(i+r)%4],4);}p.add(g);}
function bed(p:Node,x:number,y:number,s=1){const g=new Node({x,y,scale:s});rect(g,0,10,290,86,'#556A72',13);rect(g,-92,-35,92,45,P.cream,10);line(g,[[-145,52],[-145,112]],P.paper,7);line(g,[[145,52],[145,112]],P.paper,7);p.add(g);}
function pin(p:Node,x:number,y:number,s=1,col=P.paper){const g=new Node({x,y,scale:s});line(g,[[0,-80],[0,80]],col,6);circle(g,0,-88,12,col);p.add(g);}
function gear(p:Node,x:number,y:number,r=55,col=P.blue){circle(p,x,y,r,col);circle(p,x,y,r*.38,P.bg);}
function card(p:Node,s:string,x:number,y:number,w=260,col=P.cyan){rect(p,x,y,w,76,'#152D36',13,col);label(p,s,x,y,col,27);}
function meter(p:Node,s:string,x:number,y:number,v:number,col=P.cyan){label(p,s,x-260,y,col,26);rect(p,x+20,y,520,28,'#223640',8);rect(p,x-240+q(v)*260,y,520*q(v),28,col,8);}
function skyline(p:Node,seed:number){for(let i=0;i<8;i++){const w=120+(seed>>(i%10)&63),h=190+((seed>>(i%7))&180),x=-820+i*235+((seed>>(i%5))&31)-15;building(p,x,255-h/2,w,h);}}
function setting(p:Node,scene:MeaningScene){
 rect(p,0,0,1920,1080,P.bg,0);const h=hash(scene.motif);
 const chapterIndex=scene.chapter==='prologue'?0:scene.chapter==='epilogue'?7:Number(scene.chapter.replace('chapter',''));
 if([0,4,7].includes(chapterIndex)){skyline(p,h);rect(p,0,330,1920,150,'#111D22',0);}
 else if([1].includes(chapterIndex)){for(let i=0;i<7;i++){rect(p,-790+i*260,110+(i%2)*30,190,300,'#29353A',7);gear(p,-790+i*260,100+(i%2)*30,45+(i%3)*7,i%2?P.gold:P.blue);}}
 else if([2,5,6].includes(chapterIndex)){for(let i=0;i<9;i++)line(p,[[-900+i*225,320],[-760+i*215,-290]],'#233D47',2);}
 else {for(let i=0;i<7;i++){building(p,-780+i*260,160+(i%2)*35,170,260,i%2?'会社':'仕事');}}
 rect(p,0,354,1920,2,'#35545D',0);
 // Every scene gets a unique environmental fingerprint, not a reused static background.
 for(let i=0;i<6;i++){const x=-830+((h>>(i*4))%1660),y=-290+((h>>(i*3+1))%510);circle(p,x,y,3+(i%3),i%2?P.gold:P.cyan);}
}
function titleWords(scene:MeaningScene){const s=scene.title.replace(/[「」『』？?]/g,'').split(/[、・＝≠]/).filter(Boolean);return s.slice(0,4);}
function stagesFor(root:Node,scene:MeaningScene):Node[]{
 const h=hash(scene.motif),st=Array.from({length:8},(_,i)=>new Node({opacity:0,x:(i%2?1:-1)*(28+((h>>(i%8))&21)),y:(i%3-1)*(14+((h>>(i+2))&15))}));
 st.forEach(x=>root.add(x));const[a,b,c,d,e,f,g,k]=st;const m=scene.motif,words=titleWords(scene);
 if(['night_city','night_network','morning_illusion','return_347','network_not_pyramid'].includes(m)){
  skyline(a,h);truck(b,-550,170,.9);person(c,-380,120,.72,P.gold);building(d,10,20,360,390,m==='night_network'?'介護・設備':'物流');person(e,40,95,.66,P.cyan);building(f,470,35,300,360,m==='morning_illusion'?'駅':'オフィス');person(g,500,115,.62,P.paper);label(k,words[0]??'分業ネットワーク',0,-275,P.gold,44);
 }else if(['rank_question','four_axes','label_mix','category_split','five_cards','easy_metrics','no_bottom','better_question','final_question'].includes(m)){
  const labels=m==='four_axes'?['低賃金','参入容易','低威信','必要性']:m==='five_cards'?['低賃金','低威信','参入容易','肉体労働']:m==='easy_metrics'?['年収','学歴','資格','会社名']:m==='category_split'?['賃金','参入障壁','労働条件','交渉力']:['市場価格','社会的威信','必要性','代替性'];
  labels.forEach((s,i)=>card(a,s,-510+i*340,-100+(i%2)*170,250,i===0?P.red:i===3?P.gold:P.cyan));
  if(m==='rank_question'){person(b,-500,130,.8,P.paper);person(c,500,130,.8,P.gold);arrow(d,[-340,130],[340,130],P.red,8);}
  else{for(let i=0;i<4;i++)arrow(b,[-500+i*340,-35+(i%2)*170],[-330+i*230,170],P.gold,5);}
  card(e,'一枚の札',0,165,360,P.red);label(f,'別々の変数',0,-260,P.paper,43);label(g,words[0]??'分類を分解',0,270,P.gold,39);k.add(new Circle({x:0,y:0,width:700,height:430,stroke:P.line,lineWidth:5}));
 }else if(['pin_factory','pin_output','simple_not_useless'].includes(m)){
  for(let i=0;i<7;i++){gear(a,-700+i*230,120-(i%2)*38,48,i%2?P.gold:P.blue);pin(b,-700+i*230,-35+(i%2)*28,.6);}
  if(m==='pin_output'){label(c,'1人',-420,-220,P.paper,42);label(c,'ほぼ1本',-420,-130,P.red,48);label(d,'10人',420,-220,P.paper,42);label(d,'約48,000本',420,-130,P.cyan,48);}
  else if(m==='simple_not_useless'){rect(c,0,40,1620,8,P.gold,0);circle(d,0,40,65,P.red);label(e,'1工程停止',0,-160,P.red,40);for(let i=0;i<5;i++)gear(f,-500+i*250,195,50,i>1?P.muted:P.blue);}
  else{['伸ばす','整える','切る','尖らす','頭','包装'].forEach((s,i)=>card(c,s,-630+i*250,-155+(i%2)*120,190,i%2?P.cyan:P.gold));}
  label(g,'分業',0,285,P.gold,50);label(k,words[0]??'単純化と補完',0,-285,P.paper,40);
 }else if(['modern_network','hospital_chain','enabling_work','person_vs_function','ranking_collapse'].includes(m)){
  const nodes=m==='hospital_chain'?['医師','清掃','看護補助','給食','廃棄物','設備']:m==='enabling_work'?['保育','親の労働','物流','工場','清掃','施設']:['物流','家庭','保育','オフィス','清掃','設備'];
  nodes.forEach((s,i)=>{const ang=-Math.PI/2+i*Math.PI*2/nodes.length,x=Math.cos(ang)*480,y=Math.sin(ang)*225;circle(a,x,y,46,i%2?P.teal:P.blue);label(b,s,x,y+75,P.paper,23);line(c,[[0,0],[x,y]],P.line,4);});
  circle(d,0,0,74,m==='hospital_chain'?P.red:P.gold);
  if(m==='hospital_chain'||m==='person_vs_function'){rect(e,0,0,150,150,P.bg,20,P.red);label(f,m==='hospital_chain'?'工程を消す':'機能を消す',0,0,P.red,31);}
  else if(m==='ranking_collapse'){line(e,[[-620,-220],[0,120],[620,-220]],P.red,10);label(f,'塔 → ネットワーク',0,265,P.gold,38);}
  else label(e,'別の仕事を可能にする',0,255,P.gold,38);
  label(g,words[0]??'相互依存',0,-280,P.paper,40);k.scale(1.02);
 }else if(['water_diamond','salary_score','entry_supply','essential_workers','monopsony'].includes(m)){
  if(m==='water_diamond'){card(a,'水 150円',-420,-20,330,P.cyan);card(b,'ダイヤ 100万円',420,-20,360,P.gold);label(c,'必要性',-420,170,P.paper,34);label(d,'価格',420,170,P.paper,34);}
  else if(m==='monopsony'){building(a,0,30,440,520,'巨大工場');for(let i=0;i<6;i++)person(b,-620+i*230,210,.42,i%2?P.paper:P.cyan);label(c,'近隣求人ほぼ無し',0,-245,P.red,40);}
  else if(m==='essential_workers'){['物流','小売','清掃','医療','介護'].forEach((s,i)=>card(a,s,-520+i*260,-45+(i%2)*130,210,i%2?P.cyan:P.gold));label(b,'社会に必要',-330,220,P.paper,38);label(c,'高給とは限らない',350,220,P.red,38);}
  else{meter(a,'希少性',0,-150,.8,P.gold);meter(b,'労働供給',0,-60,.45,P.cyan);meter(c,'企業需要',0,30,.7,P.teal);meter(d,'転職可能性',0,120,.35,P.red);}
  label(e,'賃金',0,250,P.gold,48);arrow(f,[-350,210],[0,250],P.gold);arrow(g,[350,210],[0,250],P.gold);label(k,words[0]??'市場条件',0,-275,P.paper,41);
 }else if(['compensating_diff','bad_job_low_pay','mobility_friction','career_rpg','prestige'].includes(m)){
  if(m==='career_rpg'){['医師','弁護士','介護','運転','清掃','会社員'].forEach((s,i)=>card(a,s,-520+(i%3)*520,-115+Math.floor(i/3)*180,330,i>2?P.muted:P.cyan));['教育費','資格','地域','子育て'].forEach((s,i)=>card(b,s,-500+i*330,250,250,P.red));}
  else if(m==='mobility_friction'){['資格時間','転居','子育て','介護','無収入期間'].forEach((s,i)=>card(a,s,-560+i*280,-40+(i%2)*145,235,P.red));person(b,0,210,.65,P.paper);label(c,'転職摩擦',0,-250,P.gold,44);}
  else if(m==='prestige'){['収入','学歴','服装','身体労働','接客','汚れ'].forEach((s,i)=>card(a,s,-560+(i%3)*560,-110+Math.floor(i/3)*180,340,i%2?P.gold:P.cyan));label(b,'職業威信',0,270,P.red,43);}
  else{card(a,'条件の良い仕事',-390,-40,450,P.cyan);card(b,'危険・夜勤・暑さ',390,-40,450,P.red);label(c,'理論上は賃金上乗せ',0,180,P.gold,38);if(m==='bad_job_low_pay')label(d,'現実：きつくて安い仕事',0,-230,P.red,43);}
  label(e,words[0]??'仕事条件',0,290,P.paper,38);arrow(f,[-210,80],[210,80],P.gold);g.opacity(.9);k.scale(1.03);
 }else if(['remove_button','morning_breakdown','office_breakdown'].includes(m)){
  if(m==='remove_button'){rect(a,0,-20,430,180,P.red,40);label(b,'低賃金職を停止',0,-20,P.paper,39);skyline(c,h);}
  else{skyline(a,h);if(m==='morning_breakdown'){shelf(b,-500,100,.75);truck(c,70,160,.72);bed(d,520,120,.7);label(e,'生活基盤から停止',0,-250,P.red,43);}else{building(b,-470,40,330,390,'オフィス');building(c,0,40,330,390,'工場');building(d,470,40,330,390,'病院');label(e,'上層へ波及',0,-250,P.red,43);}}
  for(let i=0;i<5;i++)circle(f,-500+i*250,270,20,i<3?P.red:P.muted);line(g,[[-620,270],[620,270]],P.red,8);label(k,words[0]??'停止の連鎖',0,310,P.gold,39);
 }else if(['not_equal','market_vs_social','essential_gap','price_not_total','salary_components'].includes(m)){
  line(a,[[0,-240],[0,240]],P.line,6);card(b,'市場価格',-380,-80,380,P.blue);card(c,'社会的必要性',380,-80,400,P.gold);
  if(m==='salary_components'){['能力','希少性','求人','地域','資格','交渉力','移動'].forEach((s,i)=>card(d,s,-520+(i%4)*350,70+Math.floor(i/4)*120,260,i%2?P.cyan:P.teal));label(e,'給与へ合成',0,290,P.gold,39);}
  else{meter(d,'価格',-380,130,.55,P.blue);meter(e,'必要性',380,130,.85,P.gold);label(f,m==='essential_gap'?'必要 ≠ 高給':'別の物差し',0,280,P.red,42);}
  label(g,words[0]??'価値を分ける',0,-285,P.paper,41);k.scale(1.04);
 }else{
  skyline(a,h);for(let i=0;i<5;i++)person(b,-520+i*260,160,.45,i%2?P.cyan:P.paper);label(c,scene.title,0,-220,P.gold,38);line(d,[[-600,60],[600,60]],P.line,6);arrow(e,[-450,160],[450,160],P.gold);label(f,'原因',-350,270,P.cyan);label(g,'構造',0,270,P.paper);label(k,'帰結',350,270,P.red);
 }
 return st;
}
function* subtitles(cues:Cue[],node:Txt,duration:number):ThreadGenerator{let now=0;for(const cue of cues){if(cue.start>now)yield* waitFor(cue.start-now);node.text(cue.display);now=cue.start;}if(duration>now)yield* waitFor(duration-now);node.text('');}
function* showSteps(st:Node[],duration:number,motif:string):ThreadGenerator{
 const h=hash(motif);const base=[.018,.12,.235,.35,.465,.58,.695,.81];let cursor=0;
 for(let i=0;i<st.length;i++){const jitter=((h>>(i%12))&7)*.003;const start=duration*Math.min(.86,base[i]+jitter);if(start>cursor)yield* waitFor(start-cursor);cursor=start;const anim=Math.min(.92,Math.max(.28,duration*.025));yield* all(st[i].opacity(1,anim),st[i].x(0,anim),st[i].y(0,anim),st[i].scale(1+(i===7?.025:0),anim));cursor+=anim;if(i>=3)st[i-3].opacity(.82);}
 const end=duration*.925;if(end>cursor){yield* waitFor(end-cursor);cursor=end;}yield* all(st[7].scale(1.055,.42),st[2].opacity(.68,.42));cursor+=.42;if(duration>cursor)yield* waitFor(duration-cursor);
}
export function* playMeaningScene(view:View2D,scene:MeaningScene):ThreadGenerator{
 view.fill(P.bg);const contentLayer=new Node({});const headingLayer=new Node({});const subtitleBacking=new Node({});const subtitleTextLayer=new Node({});
 view.add(contentLayer);view.add(headingLayer);view.add(subtitleBacking);view.add(subtitleTextLayer);
 setting(contentLayer,scene);const st=stagesFor(contentLayer,scene);
 rect(headingLayer,0,-471,1920,136,'#07111A',0);headingLayer.add(txt(scene.title,0,-451,Math.min(48,scene.title.length>22?35:44),P.paper,700));
 headingLayer.add(txt(scene.chapter==='prologue'?'PROLOGUE':scene.chapter==='epilogue'?'EPILOGUE':scene.chapter.toUpperCase(),-794,-506,22,P.gold,700));headingLayer.add(txt(scene.id,828,-506,22,P.muted));
 rect(subtitleBacking,0,460,1920,170,'#02070D',0);const caption=txt('',0,458,42,P.paper,650);caption.lineHeight(59);subtitleTextLayer.add(caption);
 yield* all(showSteps(st,scene.duration,scene.motif),subtitles(scene.cues,caption,scene.duration));
}