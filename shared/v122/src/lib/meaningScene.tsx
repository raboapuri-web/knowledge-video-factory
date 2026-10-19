import '@fontsource/noto-sans-jp/400.css';
import '@fontsource/noto-sans-jp/700.css';
import {Circle, Line, Node, Rect, Txt, type View2D} from '@motion-canvas/2d';
import {all, waitFor, type ThreadGenerator} from '@motion-canvas/core';
import visualPlan from '../../content/visual_plan.json';

type Cue={text:string;display:string;start:number;end:number};
type Scene={id:string;chapter:string;motif:string;title:string;narration:string;cues:Cue[];duration:number};
type Plan={kind:string;motion:string;labels:string[]};
export const MICRO_BEATS_PER_SCENE=24;

const K={bg:'#071015',deep:'#101A20',ink:'#172127',paper:'#F0EADF',muted:'#9DA7A7',red:'#B24A4A',crimson:'#742C31',gold:'#C8A55F',bronze:'#927247',jade:'#6D9A80',blue:'#55768B',cyan:'#74A7AB',earth:'#62503E',stone:'#4B5152',black:'#030608',white:'#FBF8F1',dust:'#C0B39A',night:'#091017',sky:'#385063',green:'#5D7657',orange:'#B06D45',violet:'#756E91',pink:'#C88998'};
const F='Noto Sans JP, Noto Sans CJK JP, sans-serif';
const hash=(s:string)=>[...s].reduce((a,c)=>((a*33)^c.charCodeAt(0))>>>0,129);
const tx=(s:string,x:number,y:number,sz=30,col=K.paper,w=700)=>new Txt({text:s,x,y,fontFamily:F,fontSize:sz,fill:col,fontWeight:w});
function rr(p:Node,x:number,y:number,w:number,h:number,fill:string,r=8,stroke?:string){const q=new Rect({x,y,width:w,height:h,fill,radius:r,stroke:stroke??fill,lineWidth:stroke?2:0});p.add(q);return q}
function cc(p:Node,x:number,y:number,r:number,fill:string){const q=new Circle({x,y,width:r*2,height:r*2,fill});p.add(q);return q}
function ln(p:Node,pts:[number,number][],col=K.muted,w=5){const q=new Line({points:pts,stroke:col,lineWidth:w,lineCap:'round',lineJoin:'round'});p.add(q);return q}
function label(p:Node,s:string,x:number,y:number,col=K.paper,sz=25,w=700){const q=tx(s,x,y,sz,col,w);p.add(q);return q}
function card(p:Node,s:string,x:number,y:number,w=280,col=K.gold){rr(p,x,y,w,68,K.deep,10,col);label(p,s,x,y,col,21)}
function bar(p:Node,x:number,y:number,w:number,v:number,col:string,textLabel?:string){rr(p,x,y,w,30,'#263238',6);rr(p,x-w*(1-v)/2,y,Math.max(8,w*v),30,col,6);if(textLabel)label(p,textLabel,x,y-42,col,20);}
function timeline(p:Node,y:number,items:{x:number;label:string;col:string}[]){ln(p,[[items[0].x,y],[items[items.length-1].x,y]],K.muted,7);for(const it of items){cc(p,it.x,y,14,it.col);label(p,it.label,it.x,y+48,it.col,20);}}
function person(p:Node,x:number,y:number,s=.7,col=K.paper){const g=new Node({x,y,scale:s});p.add(g);cc(g,0,-60,24,col);rr(g,0,20,60,118,col,16);ln(g,[[-18,-4],[-55,55]],col,10);ln(g,[[18,-4],[55,55]],col,10);ln(g,[[-18,80],[-26,150]],col,12);ln(g,[[18,80],[26,150]],col,12);return g}
function bowingPerson(p:Node,x:number,y:number,s=.6,col=K.paper){const g=person(p,x,y,s,col);g.rotation(18);return g}
function table(p:Node,x:number,y:number,w=700){rr(p,x,y,w,30,K.earth,4);ln(p,[[x-w*.4,y+15],[x-w*.4,y+115]],K.dust,7);ln(p,[[x+w*.4,y+15],[x+w*.4,y+115]],K.dust,7)}
function scroll(p:Node,x:number,y:number,w=340,h=180,title=''){rr(p,x,y,w,h,'#D8C9A9',5,K.bronze);cc(p,x-w/2,y,15,K.bronze);cc(p,x+w/2,y,15,K.bronze);if(title)label(p,title,x,y,K.ink,21)}
function shrineGate(p:Node,x=0,y=0,s=1,col=K.red){ln(p,[[x-190*s,y+170*s],[x-190*s,y-150*s]],col,20*s);ln(p,[[x+190*s,y+170*s],[x+190*s,y-150*s]],col,20*s);ln(p,[[x-260*s,y-140*s],[x+260*s,y-140*s]],col,24*s);ln(p,[[x-220*s,y-90*s],[x+220*s,y-90*s]],col,15*s)}
function shrine(p:Node,x=0,y=0,s=1){rr(p,x,y+60*s,520*s,280*s,'#4A2C2D',4);ln(p,[[x-330*s,y-80*s],[x,y-210*s],[x+330*s,y-80*s]],K.red,28*s);rr(p,x,y+40*s,180*s,210*s,'#24191B',4,K.gold);shrineGate(p,x,y+210*s,.45*s,K.red)}
function temple(p:Node,x=0,y=0,s=1){rr(p,x,y+80*s,560*s,260*s,'#3B332A',4);ln(p,[[x-340*s,y-70*s],[x,y-190*s],[x+340*s,y-70*s]],K.bronze,24*s);for(let i=-1;i<=1;i++)rr(p,x+i*150*s,y+70*s,85*s,180*s,'#241E1B',4,K.dust)}
function cross(p:Node,x:number,y:number,s=1,col=K.white){rr(p,x,y,34*s,220*s,col,4);rr(p,x,y-25*s,150*s,34*s,col,4)}
function chapel(p:Node){rr(p,0,0,1920,920,'#2A2730',0);for(let i=0;i<5;i++)ln(p,[[-760+i*380,250],[-760+i*380,-170]],'#4B4454',7);cross(p,0,-125,1.1,K.gold);for(let i=0;i<5;i++)rr(p,-600+i*300,140,180,55,'#514843',5);}
function gravestone(p:Node,x:number,y:number,s=.7){rr(p,x,y,120*s,220*s,'#676C6C',8);rr(p,x,y+125*s,190*s,36*s,'#555A5A',4)}
function altar(p:Node,x:number,y:number,s=1){rr(p,x,y,420*s,500*s,'#3A2A20',8,K.bronze);rr(p,x,y-90*s,250*s,220*s,'#1E1713',4);cc(p,x,y-80*s,52*s,K.gold);rr(p,x-120*s,y+95*s,45*s,120*s,K.red,5);rr(p,x+120*s,y+95*s,45*s,120*s,K.red,5);rr(p,x,y+120*s,150*s,35*s,K.dust,4)}
function survey(p:Node){rr(p,0,0,1920,920,'#101C23',0);graphAxes(p);}
function graphAxes(p:Node){ln(p,[[-620,230],[-620,-250]],K.paper,4);ln(p,[[-620,230],[650,230]],K.paper,4)}
function village(p:Node){rr(p,0,0,1920,920,'#20241F',0);rr(p,0,220,1920,300,'#384134',0);for(let i=0;i<5;i++){rr(p,-650+i*325,70,230,150,'#5A493A',3);ln(p,[[-780+i*325,-10],[-650+i*325,-100],[-520+i*325,-10]],K.earth,18);}}
function mountainSite(p:Node){rr(p,0,0,1920,920,'#18221D',0);ln(p,[[-900,180],[-500,-160],[-160,30],[180,-220],[560,-50],[900,-180]],K.green,120);rr(p,0,230,1920,240,'#394A38',0)}
function meijiOffice(p:Node){rr(p,0,0,1920,920,'#1B2024',0);table(p,0,170,950);for(let i=0;i<4;i++)scroll(p,-450+i*300,-80,240,130,['神','仏','祭祀','行政'][i]);}
function classificationDesk(p:Node){rr(p,0,0,1920,920,'#101820',0);table(p,0,200,1100);['宗教','非宗教','慣習','公共儀礼'].forEach((x,i)=>card(p,x,-450+i*300,-170,230,[K.red,K.blue,K.gold,K.jade][i]));}
function hotelPlanning(p:Node){rr(p,0,0,1920,920,'#211C22',0);table(p,0,180,900);for(let i=0;i<3;i++)scroll(p,-330+i*330,-70,270,160,['神前式','人前式','チャペル'][i]);}
function cityNight(p:Node){rr(p,0,0,1920,920,K.night,0);for(let i=0;i<8;i++){rr(p,-760+i*220,40+(i%3)*60,150,500-(i%3)*70,'#1A252E',2);for(let j=0;j<4;j++)rr(p,-790+i*220, -100+j*90+(i%3)*60,28,36,j%2?K.gold:'#2C3A42',2);}}
function homeRoom(p:Node){rr(p,0,0,1920,920,'#29231F',0);rr(p,0,180,1920,260,'#4A3A2B',0);rr(p,-500,-20,500,520,'#352A21',3);rr(p,450,-40,560,420,'#1B2025',3);}
function stages8(){return Array.from({length:8},()=>new Node({opacity:0}));}
function worldBase(root:Node,scene:Scene){const pal=['#071015','#0A1116','#0C161B','#11181B','#121515','#15120F'];rr(root,0,0,1920,1080,pal[hash(scene.motif)%pal.length],0);for(let i=0;i<9;i++)cc(root,-840+(hash(scene.motif+i.toString())%1680),-350+(hash('r'+scene.motif+i)%550),1.4+(i%3),i%2?K.gold:K.dust);rr(root,0,344,1920,3,'#273239',0)}
function addSceneText(p:Node,plan:Plan,v:number){const L=plan.labels;if(v%3===0){card(p,L[1]??'',-390,270,260,K.gold);card(p,L[2]??'',0,270,260,K.jade);card(p,L[3]??'',390,270,260,K.red);}else if(v%3===1){label(p,L[1]??'',-420,270,K.gold,23);label(p,L[2]??'',0,270,K.paper,23);label(p,L[3]??'',420,270,K.jade,23);}else{card(p,L[1]??'',-300,280,300,K.blue);card(p,L[2]??'',300,280,300,K.red);}}

function prologue(root:Node,s:Node[],plan:Plan,v:number){const[a,b,c,d,e,f,g,h]=s;
 if(v===0){rr(a,0,0,1920,920,'#15222A',0);shrineGate(b,0,-50,.85);for(let i=0;i<9;i++)person(c,-650+i*160,170,.22,K.paper);bowingPerson(d,0,20,.35,K.paper);card(e,'家族の健康',-300,250,260,K.gold);card(f,'仕事の成功',300,250,260,K.jade);label(g,'1月1日 11:00',0,-285,K.paper,28);}
 else if(v===1){chapel(a);person(b,-140,80,.35,K.paper);person(b,140,80,.35,K.white);cross(c,0,-120,.85,K.gold);ln(d,[[-120,70],[120,70]],K.gold,6);cc(e,0,70,24,K.gold);card(f,'誓い',0,260,220,K.paper);label(g,'半年後',0,-270,K.gold,31);}
 else if(v===2){rr(a,0,0,1920,920,'#171617',0);temple(b,0,-40,.82);for(let i=0;i<6;i++)person(c,-500+i*200,170,.25,K.black);scroll(d,0,-20,240,130,'戒名');gravestone(e,520,160,.55);card(f,'読経・焼香・墓参り',0,280,360,K.dust);label(g,'数年後',0,-270,K.muted,30);}
 else if(v===3){rr(a,0,0,1920,920,'#0E161C',0);shrineGate(b,-500,-20,.42);cross(c,0,-10,.55,K.gold);temple(d,500,30,.5);person(e,0,170,.38,K.paper);['神道？','キリスト教？','仏教？'].forEach((x,i)=>card(f,x,-500+i*500,260,250,[K.red,K.gold,K.jade][i]));label(g,'「宗教は特に…」',0,-245,K.paper,31);}
 else if(v===4){survey(a);bar(b,0,-120,900,.46,K.gold,'仏教');bar(c,0,0,900,.42,K.blue,'宗教なし');bar(d,0,120,900,.04,K.red,'神道');person(e,520,-70,.32,K.paper);card(f,'宗教なしでも祈る',330,250,330,K.jade);label(g,'所属 ≠ 行動',0,-260,K.paper,30);}
 else if(v===5){rr(a,0,0,1920,920,'#11191E',0);person(b,0,-40,.42,K.paper);shrineGate(c,-520,100,.35);gravestone(d,-170,120,.45);altar(e,210,100,.55);scroll(f,520,100,260,160,'お守り');ln(g,[[-480,210],[480,210]],K.gold,5);}
 else{timeline(a,20,[{x:-650,label:'神仏習合',col:K.gold},{x:-320,label:'寺請',col:K.jade},{x:0,label:'神仏分離',col:K.red},{x:320,label:'国家神道',col:K.blue},{x:650,label:'無宗教',col:K.paper}]);label(b,'日本は何教なのか？',0,-250,K.paper,40);card(c,'問いそのものを疑う',0,250,350,K.gold);}
 addSceneText(h,plan,v);
}
function chapterA(root:Node,s:Node[],plan:Plan,v:number){const[a,b,c,d,e,f,g,h]=s;
 if(v===0){survey(a);bar(b,0,-100,900,.77,K.cyan,'総人口');bar(c,0,60,900,1.0,K.gold,'宗教団体の信者合計');label(d,'人口 < 信者数',0,235,K.red,35);}
 else if(v===1){rr(a,0,0,1920,920,'#10181D',0);for(let i=0;i<8;i++)person(b,-600+i*170,150,.24,K.paper);for(let i=0;i<5;i++)cc(c,-400+i*200,-80,38,K.red);for(let i=0;i<5;i++)cc(d,-300+i*200,20,38,K.gold);label(e,'同じ人が複数回カウント',0,-250,K.paper,29);}
 else if(v===2){person(a,0,30,.4,K.paper);shrineGate(b,-420,40,.38);temple(c,420,70,.4);ln(d,[[-260,60],[-70,40]],K.red,5);ln(d,[[260,60],[70,40]],K.gold,5);card(e,'氏子',-420,250,220,K.red);card(f,'檀家',420,250,220,K.gold);}
 else if(v===3){rr(a,0,0,1920,920,'#121B1F',0);person(b,0,0,.38,K.paper);['初詣','受験祈願','仏壇','葬儀'].forEach((x,i)=>card(c,x,-510+i*340,150+(i%2)*80,250,[K.red,K.gold,K.jade,K.blue][i]));ln(d,[[-480,80],[480,80]],K.dust,4);label(e,'場面ごとに使う',0,-245,K.paper,30);}
 else if(v===4){classificationDesk(a);['キリスト教徒','イスラム教徒','仏教徒','無宗教'].forEach((x,i)=>scroll(b,-450+i*300,40,240,130,x));card(c,'一人一箱',0,260,250,K.red);label(d,'普遍的なモデル？',0,-245,K.paper,29);}
 else{survey(a);bar(b,-50,-120,850,.28,K.red,'所属');bar(c,-50,0,850,.62,K.gold,'儀礼');bar(d,-50,120,850,.48,K.jade,'祖先・寺社');label(e,'測り方で見える姿が変わる',0,270,K.paper,28);card(f,'測定問題',480,-210,240,K.gold);}
 addSceneText(h,plan,v);
}
function chapterB(root:Node,s:Node[],plan:Plan,v:number){const[a,b,c,d,e,f,g,h]=s;mountainSite(a);
 if(v===0){shrine(b,-350,30,.5);temple(c,350,30,.5);person(d,0,150,.3,K.paper);ln(e,[[-140,60],[140,60]],K.gold,5);card(f,'同じ聖地',0,270,260,K.gold);}
 else if(v===1){shrine(b,-420,40,.42);temple(c,420,40,.42);ln(d,[[-230,40],[230,40]],K.gold,8);cc(e,0,40,70,K.gold);label(e,'神仏習合',0,40,K.ink,18);card(f,'対立ではなく複合',0,270,310,K.jade);}
 else if(v===2){cc(b,-370,-20,110,K.gold);label(b,'仏・菩薩',-370,-20,K.ink,23);cc(c,370,-20,110,K.red);label(c,'神',370,-20,K.paper,26);ln(d,[[-240,-20],[240,-20]],K.gold,7);card(e,'本地垂迹',0,160,260,K.gold);label(f,'異なる姿で現れる',0,270,K.paper,26);}
 else if(v===3){shrineGate(b,-420,30,.42);temple(c,420,70,.42);person(d,0,160,.35,K.paper);card(e,'神道？',-350,260,230,K.red);card(f,'仏教？',350,260,230,K.gold);label(g,'「なぜ一つに決める？」',0,-245,K.paper,30);}
 else if(v===4){bannerMix(b,-480,60,'祭り',K.red);bannerMix(c,-160,60,'供養',K.gold);bannerMix(d,160,60,'修行',K.jade);bannerMix(e,480,60,'祈願',K.blue);ln(f,[[-480,170],[480,170]],K.dust,5);card(g,'一人の生活に共存',0,270,330,K.paper);}
 else{classificationDesk(b);scroll(c,-350,40,300,150,'神道的');scroll(d,0,40,300,150,'仏教的');scroll(e,350,40,300,150,'民間信仰');label(f,'後世の分類',0,220,K.gold,27);label(g,'当時の自己理解とは限らない',0,-245,K.paper,28);}
 addSceneText(h,plan,v);
}
function bannerMix(p:Node,x:number,y:number,t:string,c:string){rr(p,x,y,190,300,'#22292B',6,c);label(p,t,x,y,c,24);}
function chapterC(root:Node,s:Node[],plan:Plan,v:number){const[a,b,c,d,e,f,g,h]=s;village(a);
 if(v===0){person(b,-520,170,.35,K.paper);temple(c,380,40,.55);ln(d,[[-400,150],[180,80]],K.gold,6);scroll(e,-120,-40,300,140,'寺へ証明を求める');card(f,'キリシタンではない',0,270,300,K.red);}
 else if(v===1){scroll(b,-420,-30,360,180,'寺請証文');temple(c,380,50,.55);for(let i=0;i<5;i++)person(d,-400+i*180,180,.22,K.paper);ln(e,[[-260,20],[220,40]],K.gold,5);card(f,'宗教 + 住民管理',0,270,320,K.gold);}
 else if(v===2){temple(b,0,-30,.52);for(let i=0;i<4;i++){person(c,-450+i*300,160,.22,K.paper);scroll(d,-450+i*300,30,210,95,['祖父','父','子','孫'][i]);}ln(e,[[-450,230],[450,230]],K.jade,6);card(f,'世代を越える檀家関係',0,285,360,K.jade);}
 else if(v===3){temple(b,-420,40,.42);['出生','結婚','死亡','葬儀','法事'].forEach((x,i)=>card(c,x,-120+(i%3)*300,-40+Math.floor(i/3)*120,240,[K.gold,K.blue,K.red,K.jade,K.paper][i]));card(d,'社会インフラ',380,260,300,K.gold);label(e,'寺が人生の節目へ入る',0,-250,K.paper,29);}
 else if(v===4){scroll(b,-430,-20,390,520,'何を信じる？');scroll(c,430,-20,390,520,'どの寺と結びつく？');ln(d,[[-150,-20],[150,-20]],K.gold,7);card(e,'所属は家単位',0,260,280,K.jade);}
 else{temple(b,0,-20,.5);gravestone(c,-430,160,.48);altar(d,420,80,.45);person(e,0,170,.3,K.paper);card(f,'葬送仏教の長い制度史',0,285,390,K.gold);label(g,'信仰心と儀礼参加が分離',0,-250,K.paper,27);}
 addSceneText(h,plan,v);
}
function chapterD(root:Node,s:Node[],plan:Plan,v:number){const[a,b,c,d,e,f,g,h]=s;
 if(v===0){mountainSite(a);shrine(b,-350,30,.45);temple(c,350,30,.45);scroll(d,0,-120,320,150,'1868年 命令');ln(e,[[-180,-60],[-360,40]],K.red,6);ln(e,[[180,-60],[360,40]],K.gold,6);card(f,'分けなさい',0,270,270,K.red);}
 else if(v===1){rr(a,0,0,1920,920,'#171D20',0);shrine(b,-420,20,.5);temple(c,420,20,.5);ln(d,[[0,-190],[0,230]],K.red,10);card(e,'神',-420,260,210,K.red);card(f,'仏',420,260,210,K.gold);label(g,'行政が境界線を引く',0,-245,K.paper,29);}
 else if(v===2){temple(b,0,20,.5);scroll(c,-420,20,240,160,'仏像');scroll(d,420,20,240,160,'寺領');ln(e,[[-300,80],[-550,180]],K.red,7);ln(e,[[300,80],[550,180]],K.red,7);card(f,'地域によっては破壊へ',0,270,350,K.red);label(g,'神仏分離 ≠ 廃仏毀釈',0,-245,K.paper,27);}
 else if(v===3){mountainSite(a);shrine(b,-480,30,.38);temple(c,-120,50,.35);label(d,'昨日',-300,-200,K.dust,28);shrine(e,430,30,.5);ln(f,[[0,-250],[0,260]],K.red,7);label(g,'今日：制度上分離',420,-220,K.paper,27);}
 else if(v===4){shrineGate(b,-430,50,.48);temple(c,430,70,.45);card(d,'自然な違い？',0,-150,280,K.paper);timeline(e,230,[{x:-450,label:'長い習合',col:K.gold},{x:0,label:'1868',col:K.red},{x:450,label:'明確な分離',col:K.blue}]);}
 else{classificationDesk(a);scroll(b,-380,40,320,150,'神道');scroll(c,380,40,320,150,'仏教');person(d,0,120,.35,K.paper);card(e,'どちら？',0,-130,250,K.red);label(f,'質問自体が近代的',0,275,K.gold,29);}
 addSceneText(h,plan,v);
}
function chapterE(root:Node,s:Node[],plan:Plan,v:number){const[a,b,c,d,e,f,g,h]=s;classificationDesk(a);
 if(v===0){scroll(b,-420,40,320,150,'religion');scroll(c,420,40,320,150,'宗教');ln(d,[[-230,40],[230,40]],K.gold,8);card(e,'近代の翻訳・概念化',0,270,340,K.gold);}
 else if(v===1){card(b,'信教の自由',0,-120,320,K.jade);['仏教','キリスト教','神社祭祀','祖先祭祀'].forEach((x,i)=>scroll(c,-450+i*300,80,240,130,x));label(d,'何が宗教？',0,255,K.paper,29);}
 else if(v===2){['宗教','道徳','慣習','公共儀礼'].forEach((x,i)=>rr(b,-450+i*300,80,240,200,'#1C272D',8,[K.red,K.blue,K.gold,K.jade][i]));['仏教','教会','祖先','神社'].forEach((x,i)=>card(c,x,-450+i*300,-80,200,[K.red,K.blue,K.gold,K.jade][i]));ln(d,[[-450,-40],[-450,10]],K.red,5);ln(e,[[-150,-40],[150,10]],K.gold,5);ln(f,[[450,-40],[450,10]],K.jade,5);}
 else if(v===3){cc(b,-380,30,125,K.red);label(b,'宗教',-380,30,K.paper,30);cc(c,380,30,125,K.blue);label(c,'非宗教',380,30,K.paper,26);ln(d,[[-250,30],[250,30]],K.gold,9);card(e,'境界は制度で動く',0,270,340,K.gold);}
 else if(v===4){timeline(b,20,[{x:-600,label:'習合',col:K.gold},{x:-200,label:'分離',col:K.red},{x:200,label:'分類',col:K.blue},{x:600,label:'所属',col:K.jade}]);card(c,'宗教を輸入',-330,260,280,K.red);card(d,'物差しも再編',330,260,300,K.gold);label(e,'近代化',0,-240,K.paper,34);}
 else{person(b,0,40,.4,K.paper);card(c,'宗教あり',-350,120,280,K.red);card(d,'宗教なし',350,120,280,K.blue);ln(e,[[-180,100],[180,100]],K.gold,5);label(f,'自己認識も分類語で作られる',0,280,K.paper,27);card(g,'無宗教',0,-150,260,K.gold);}
 addSceneText(h,plan,v);
}
function chapterF(root:Node,s:Node[],plan:Plan,v:number){const[a,b,c,d,e,f,g,h]=s;meijiOffice(a);
 if(v===0){scroll(b,-430,-50,360,160,'神社局');scroll(c,430,-50,360,160,'宗教行政');ln(d,[[0,-190],[0,220]],K.red,7);card(e,'別の行政枠',0,270,280,K.gold);}
 else if(v===1){shrine(b,0,-30,.55);person(c,0,170,.28,K.paper);card(d,'神職',-380,220,220,K.red);card(e,'祭祀',0,220,220,K.gold);card(f,'「宗教ではない」',380,220,300,K.blue);label(g,'奇妙な整理',0,-250,K.paper,29);}
 else if(v===2){card(b,'信教の自由',-350,-80,300,K.jade);card(c,'国家儀礼',350,-80,300,K.red);ln(d,[[-140,-60],[140,-60]],K.gold,7);person(e,0,140,.35,K.paper);card(f,'両立させる論理',0,275,300,K.gold);}
 else if(v===3){['神社制度','皇室祭祀','教育','行政','国民儀礼'].forEach((x,i)=>card(b,x,-500+(i%3)*500,-80+Math.floor(i/3)*130,300,[K.red,K.gold,K.blue,K.jade,K.paper][i]));ln(c,[[-480,150],[480,150]],K.dust,4);label(d,'国家神道＝制度の組み合わせ',0,280,K.paper,28);}
 else if(v===4){shrineGate(b,-420,20,.4);gravestone(c,0,90,.45);altar(d,420,20,.42);card(e,'宗教ではなく習慣',0,250,340,K.gold);label(f,'直接の因果ではなく歴史的背景',0,-240,K.paper,26);}
 else{classificationDesk(a);['自由','教育','行政','公共'].forEach((x,i)=>scroll(b,-450+i*300,50,240,130,x));card(c,'分類が扱いを変える',0,260,340,K.red);label(d,'分類＝権力',0,-245,K.gold,32);}
 addSceneText(h,plan,v);
}
function chapterG(root:Node,s:Node[],plan:Plan,v:number){const[a,b,c,d,e,f,g,h]=s;hotelPlanning(a);
 if(v===0){person(b,-180,100,.33,K.paper);person(b,180,100,.33,K.white);['料理','衣装','花','写真'].forEach((x,i)=>card(c,x,-450+i*300,-100,220,[K.gold,K.pink,K.jade,K.blue][i]));scroll(d,0,100,320,150,'式の形式を選ぶ');}
 else if(v===1){chapel(a);person(b,-140,80,.3,K.paper);person(b,140,80,.3,K.white);cross(c,0,-120,.7,K.gold);card(d,'改宗ではない',0,250,280,K.blue);label(e,'様式として選ばれる',0,-245,K.paper,29);}
 else if(v===2){person(b,0,20,.4,K.paper);card(c,'強い無神論',-360,140,300,K.red);card(d,'特定宗教に属さない',360,140,340,K.jade);ln(e,[[-150,120],[150,120]],K.gold,6);card(f,'無宗教',0,-150,260,K.gold);}
 else if(v===3){person(b,0,0,.4,K.paper);rr(c,0,170,900,150,'#1B252A',8,K.muted);label(c,'「宗教に強く傾倒していません」',0,170,K.paper,25);card(d,'社会的な距離',0,-150,290,K.gold);}
 else if(v===4){['七五三','厄除け','安産','葬儀','法事'].forEach((x,i)=>card(b,x,-500+(i%3)*500,-70+Math.floor(i/3)*120,300,[K.red,K.gold,K.jade,K.blue,K.paper][i]));person(c,0,200,.3,K.paper);card(d,'所属宣言なしで利用',0,290,360,K.jade);}
 else{survey(a);bar(b,-40,-120,850,.24,K.red,'所属');bar(c,-40,0,850,.52,K.gold,'信念');bar(d,-40,120,850,.76,K.jade,'実践');label(e,'三つを分けて見る',0,275,K.paper,29);card(f,'所属弱い・実践残る',420,-210,320,K.gold);}
 addSceneText(h,plan,v);
}
function chapterH(root:Node,s:Node[],plan:Plan,v:number){const[a,b,c,d,e,f,g,h]=s;
 if(v===0){cityNight(a);shrineGate(b,420,80,.32);person(c,-420,150,.3,K.paper);ln(d,[[-300,140],[280,100]],K.gold,5);card(e,'明日の商談',-420,-120,260,K.red);bowingPerson(f,420,120,.28,K.paper);}
 else if(v===1){survey(a);person(b,-480,80,.3,K.paper);bar(c,50,-50,800,.25,K.gold,'宗教なし層でも祈る人');shrineGate(d,460,100,.28);label(e,'自己認識 ≠ 祈り',0,260,K.paper,29);}
 else if(v===2){homeRoom(a);altar(b,-360,20,.62);rr(c,420,10,250,320,'#2C2A25',6,K.dust);label(c,'家族写真',420,10,K.paper,24);person(d,0,180,.28,K.paper);card(e,'家庭の宗教空間',0,280,320,K.gold);}
 else if(v===3){homeRoom(a);cc(b,-360,-20,75,K.gold);label(b,'祖父母',-360,-20,K.ink,22);person(c,360,120,.35,K.paper);ln(d,[[-280,10],[240,90]],K.gold,4);card(e,'「見守っている」',0,260,300,K.jade);label(f,'身近な超越者',0,-245,K.paper,29);}
 else if(v===4){altar(b,-420,10,.5);person(c,420,120,.35,K.paper);card(d,'外から：宗教儀礼',-360,260,320,K.red);card(e,'本人：家族の習慣',360,260,320,K.gold);ln(f,[[-150,80],[150,80]],K.dust,5);}
 else{rr(a,0,0,1920,920,'#10191E',0);cc(b,-430,20,110,K.red);label(b,'所属',-430,20,K.paper,26);cc(c,0,20,110,K.gold);label(c,'信念',0,20,K.ink,26);cc(d,430,20,110,K.jade);label(d,'実践',430,20,K.ink,26);ln(e,[[-300,20],[-120,20],[120,20],[300,20]],K.dust,5);card(f,'三つはずれる',0,270,300,K.paper);}
 addSceneText(h,plan,v);
}
function chapterI(root:Node,s:Node[],plan:Plan,v:number){const[a,b,c,d,e,f,g,h]=s;
 if(v===0){rr(a,0,0,1920,920,'#121A1E',0);shrineGate(b,-520,60,.32);chapelMini(c,-170,60);gravestone(d,180,80,.45);altar(e,520,40,.36);ln(f,[[-520,190],[520,190]],K.gold,5);label(g,'同じ一日',0,-245,K.paper,31);}
 else if(v===1){person(b,0,-40,.38,K.paper);['正月','死者','結婚','祭り','受験'].forEach((x,i)=>card(c,x,-480+i*240,150+(i%2)*60,210,[K.red,K.gold,K.blue,K.jade,K.paper][i]));card(d,'場面が選ぶ',0,280,270,K.gold);}
 else if(v===2){shrineGate(b,-500,70,.3);temple(c,-170,90,.3);cross(d,170,20,.45,K.gold);rr(e,500,70,190,190,'#283128',5,K.jade);label(e,'地域祭り',500,70,K.paper,18);['祝い','葬送','結婚','共同体'].forEach((x,i)=>label(f,x,-500+i*330,250,[K.red,K.gold,K.blue,K.jade][i],21));}
 else if(v===3){scroll(b,-430,-20,380,520,'民族性');scroll(c,430,-20,380,520,'制度史');ln(d,[[-150,-20],[150,-20]],K.gold,7);card(e,'「何でも混ぜる民族」では足りない',0,270,420,K.red);}
 else if(v===4){timeline(a,10,[{x:-650,label:'神仏習合',col:K.gold},{x:-390,label:'寺請',col:K.jade},{x:-130,label:'神仏分離',col:K.red},{x:130,label:'宗教概念',col:K.blue},{x:390,label:'国家神道',col:K.violet},{x:650,label:'無宗教',col:K.paper}]);person(b,0,190,.3,K.paper);card(c,'一人の生活に歴史層が重なる',0,290,430,K.gold);}
 else{classificationDesk(a);person(b,0,140,.32,K.paper);card(c,'「何教？」',-330,-40,280,K.red);card(d,'「何をする？」',330,-40,300,K.jade);ln(e,[[-120,-20],[120,-20]],K.gold,6);label(f,'質問を変える',0,270,K.paper,29);}
 addSceneText(h,plan,v);
}
function chapelMini(p:Node,x:number,y:number){rr(p,x,y,230,280,'#322B34',4);cross(p,x,y-40,.42,K.gold);}
function chapterJ(root:Node,s:Node[],plan:Plan,v:number){const[a,b,c,d,e,f,g,h]=s;
 if(v===0){cityNight(a);for(let i=0;i<6;i++)person(b,-500+i*200,210,.22,K.paper);temple(c,500,60,.32);ln(d,[[-400,180],[400,80]],K.muted,4);card(e,'都市化・人口移動',0,-170,320,K.gold);}
 else if(v===1){survey(a);bar(b,-30,-80,850,.75,K.gold,'育った宗教');bar(c,-30,80,850,.43,K.blue,'成人後の所属');ln(d,[[420,-80],[420,80]],K.red,6);card(e,'離脱',480,0,180,K.red);}
 else if(v===2){village(a);temple(b,0,-20,.45);for(let i=0;i<5;i++)person(c,-480+i*240,180,.22,i<2?K.paper:K.muted);card(d,'檀家関係の弱まり',0,280,340,K.red);label(e,'家族構造も変化',0,-245,K.paper,29);}
 else if(v===3){graphAxes(a);ln(b,[[-560,-160],[-300,-80],[0,20],[300,100],[560,160]],K.red,9);ln(c,[[-560,170],[-300,120],[0,80],[300,50],[560,30]],K.gold,9);label(d,'所属',-430,-190,K.red,24);label(e,'儀礼',-430,160,K.gold,24);card(f,'世俗化 ≠ 消滅',0,280,300,K.paper);}
 else if(v===4){altar(b,-420,20,.45);shrineGate(c,0,40,.3);gravestone(d,420,100,.42);card(e,'文化・家族習慣へ溶け込む',0,270,390,K.gold);label(f,'宗教という名前が薄れる',0,-245,K.paper,28);}
 else{survey(a);bar(b,-40,-100,850,.34,K.red,'強い所属');bar(c,-40,40,850,.71,K.gold,'儀礼参加');bar(d,-40,180,850,.56,K.jade,'祖先との関係');card(e,'世俗的 + 儀礼的',0,-210,320,K.paper);}
 addSceneText(h,plan,v);
}
function chapterK(root:Node,s:Node[],plan:Plan,v:number){const[a,b,c,d,e,f,g,h]=s;
 if(v===0){rr(a,0,0,1920,920,'#10181E',0);person(b,0,-30,.4,K.paper);shrineGate(c,-520,130,.3);cross(d,-170,80,.38,K.gold);temple(e,180,130,.3);altar(f,520,80,.3);card(g,'「無宗教です」',0,270,300,K.blue);}
 else if(v===1){person(b,0,0,.4,K.paper);card(c,'神や祖先を否定',-360,150,320,K.red);card(d,'一つの所属を否定',360,150,340,K.jade);ln(e,[[-150,130],[150,130]],K.gold,6);label(f,'どちらを意味している？',0,-240,K.paper,28);}
 else if(v===2){['神社','墓参り','仏壇','無宗教'].forEach((x,i)=>card(b,x,-450+i*300,80,240,[K.red,K.gold,K.jade,K.blue][i]));ln(c,[[-450,160],[450,160]],K.dust,5);card(d,'共通言語',0,270,280,K.gold);}
 else if(v===3){scroll(b,-430,-10,400,540,'統計の宗教');scroll(c,430,-10,400,540,'比喩としての無宗教');ln(d,[[-150,-10],[150,-10]],K.gold,6);card(e,'「最大の宗教」は比喩',0,270,340,K.red);}
 else if(v===4){rr(a,0,0,1920,920,'#0F181D',0);cc(b,-420,20,100,K.red);label(b,'所属',-420,20,K.paper,24);cc(c,0,20,100,K.gold);label(c,'信念',0,20,K.ink,24);cc(d,420,20,100,K.jade);label(d,'実践',420,20,K.ink,24);person(e,0,185,.28,K.paper);card(f,'別々のルールで動く',0,285,340,K.gold);}
 else{classificationDesk(a);card(b,'日本は何教？',-350,-50,300,K.red);card(c,'日本人は宗教をどう使う？',350,-50,390,K.jade);ln(d,[[-120,-30],[120,-30]],K.gold,7);card(e,'問いを作り直す',0,270,300,K.gold);}
 addSceneText(h,plan,v);
}
function epilogue(root:Node,s:Node[],plan:Plan,v:number){const[a,b,c,d,e,f,g,h]=s;
 if(v===0){rr(a,0,0,1920,920,'#091017',0);shrineGate(b,0,0,.58);for(let i=0;i<5;i++)person(c,-400+i*200,180,.18,K.muted);label(d,'1月1日 夜',0,-250,K.paper,30);card(e,'参拝客が減る',0,270,280,K.gold);}
 else if(v===1){rr(a,0,0,1920,920,'#0C1318',0);shrineGate(b,-500,80,.28);altar(c,0,60,.33);chapelMini(d,500,80);ln(e,[[-500,220],[500,220]],K.gold,5);card(f,'同じ町、同じ夜',0,285,320,K.paper);}
 else if(v===2){person(b,0,-20,.35,K.paper);card(c,'何教？',-480,130,220,K.red);card(d,'正月は？',-160,130,220,K.gold);card(e,'葬儀は？',160,130,220,K.jade);card(f,'誰に祈る？',480,130,240,K.blue);label(g,'質問が見える宗教を変える',0,275,K.paper,28);}
 else if(v===3){['どこへ行く','誰に手を合わせる','死者をどう扱う','何を選ぶ'].forEach((x,i)=>scroll(b,-450+i*300,60,250,150,x));person(c,0,210,.28,K.paper);card(d,'行動を見る',0,-150,260,K.gold);}
 else if(v===4){person(b,0,10,.4,K.paper);shrineGate(c,-440,140,.26);altar(d,0,130,.28);gravestone(e,440,160,.34);card(f,'関係はある／名前はない',0,285,360,K.gold);label(g,'宗教 without 宗教ラベル',0,-240,K.paper,28);}
 else{timeline(a,10,[{x:-650,label:'習合',col:K.gold},{x:-390,label:'寺請',col:K.jade},{x:-130,label:'分離',col:K.red},{x:130,label:'国家',col:K.blue},{x:390,label:'世俗化',col:K.violet},{x:650,label:'無宗教',col:K.paper}]);card(b,'神道だけでもない',-350,245,300,K.red);card(c,'仏教だけでもない',0,245,300,K.gold);card(d,'無宗教だけでもない',350,245,320,K.blue);label(e,'「日本は何教？」という問いが狭い',0,-245,K.paper,32);}
 addSceneText(h,plan,v);
}
function buildScene(root:Node,scene:Scene,plan:Plan):Node[]{worldBase(root,scene);const s=stages8();s.forEach(n=>root.add(n));switch(scene.motif){
case 'newyear_shrine_queue':prologue(root,s,plan,0);break;case 'chapel_wedding':prologue(root,s,plan,1);break;case 'buddhist_funeral':prologue(root,s,plan,2);break;case 'religion_identity_question':prologue(root,s,plan,3);break;case 'survey_paradox':prologue(root,s,plan,4);break;case 'central_paradox':prologue(root,s,plan,5);break;case 'journey_through_history':prologue(root,s,plan,6);break;
case 'population_table':chapterA(root,s,plan,0);break;case 'religion_count_exceeds_population':chapterA(root,s,plan,1);break;case 'ujiko_danka_overlap':chapterA(root,s,plan,2);break;case 'one_person_many_rituals':chapterA(root,s,plan,3);break;case 'western_membership_model':chapterA(root,s,plan,4);break;case 'measurement_problem':chapterA(root,s,plan,5);break;
case 'ancient_sacred_site':chapterB(root,s,plan,0);break;case 'shinbutsu_shugo':chapterB(root,s,plan,1);break;case 'honji_suijaku':chapterB(root,s,plan,2);break;case 'modern_categories_fail':chapterB(root,s,plan,3);break;case 'ritual_ecology':chapterB(root,s,plan,4);break;case 'historian_labels':chapterB(root,s,plan,5);break;
case 'edo_village_temple':chapterC(root,s,plan,0);break;case 'terauke_certificate':chapterC(root,s,plan,1);break;case 'danka_system':chapterC(root,s,plan,2);break;case 'buddhism_as_social_infrastructure':chapterC(root,s,plan,3);break;case 'belonging_before_belief':chapterC(root,s,plan,4);break;case 'institutional_memory':chapterC(root,s,plan,5);break;
case 'meiji_order_arrives':chapterD(root,s,plan,0);break;case 'shinbutsu_bunri':chapterD(root,s,plan,1);break;case 'haibutsu_kishaku':chapterD(root,s,plan,2);break;case 'before_after_sacred_space':chapterD(root,s,plan,3);break;case 'modern_naturalness':chapterD(root,s,plan,4);break;case 'question_transformed':chapterD(root,s,plan,5);break;
case 'religion_word_import':chapterE(root,s,plan,0);break;case 'freedom_of_religion_problem':chapterE(root,s,plan,1);break;case 'classification_desk':chapterE(root,s,plan,2);break;case 'religion_nonreligion_boundary':chapterE(root,s,plan,3);break;case 'modern_category_creation':chapterE(root,s,plan,4);break;case 'category_shapes_identity':chapterE(root,s,plan,5);break;
case 'shrine_bureaucracy':chapterF(root,s,plan,0);break;case 'not_religion_claim':chapterF(root,s,plan,1);break;case 'freedom_and_compulsion':chapterF(root,s,plan,2);break;case 'state_shinto_structure':chapterF(root,s,plan,3);break;case 'habit_not_religion_memory':chapterF(root,s,plan,4);break;case 'classification_is_power':chapterF(root,s,plan,5);break;
case 'wedding_planning_room':chapterG(root,s,plan,0);break;case 'christian_style_without_conversion':chapterG(root,s,plan,1);break;case 'mushukyo_self_description':chapterG(root,s,plan,2);break;case 'distance_from_religious_intensity':chapterG(root,s,plan,3);break;case 'ritual_as_service':chapterG(root,s,plan,4);break;case 'belonging_and_practice_split':chapterG(root,s,plan,5);break;
case 'salaryman_shrine':chapterH(root,s,plan,0);break;case 'prayer_without_identity':chapterH(root,s,plan,1);break;case 'home_altar':chapterH(root,s,plan,2);break;case 'ancestor_as_near_transcendence':chapterH(root,s,plan,3);break;case 'ritual_without_religion_label':chapterH(root,s,plan,4);break;case 'identity_behavior_gap':chapterH(root,s,plan,5);break;
case 'day_of_many_religions':chapterI(root,s,plan,0);break;case 'situation_over_membership':chapterI(root,s,plan,1);break;case 'functional_specialization':chapterI(root,s,plan,2);break;case 'not_national_character':chapterI(root,s,plan,3);break;case 'historical_layers':chapterI(root,s,plan,4);break;case 'question_does_not_fit':chapterI(root,s,plan,5);break;
case 'secular_city':chapterJ(root,s,plan,0);break;case 'leaving_religion':chapterJ(root,s,plan,1);break;case 'temple_without_danka':chapterJ(root,s,plan,2);break;case 'secularization_not_disappearance':chapterJ(root,s,plan,3);break;case 'religion_dissolves_into_life':chapterJ(root,s,plan,4);break;case 'secular_but_ritual':chapterJ(root,s,plan,5);break;
case 'return_to_man':chapterK(root,s,plan,0);break;case 'what_mushukyo_denies':chapterK(root,s,plan,1);break;case 'mushukyo_as_common_language':chapterK(root,s,plan,2);break;case 'not_largest_religion_literal':chapterK(root,s,plan,3);break;case 'mushukyo_paradox_resolved':chapterK(root,s,plan,4);break;case 'question_reframed':chapterK(root,s,plan,5);break;
case 'night_shrine':epilogue(root,s,plan,0);break;case 'three_spaces_same_city':epilogue(root,s,plan,1);break;case 'ask_three_questions':epilogue(root,s,plan,2);break;case 'look_at_actions':epilogue(root,s,plan,3);break;case 'religion_without_name':epilogue(root,s,plan,4);break;case 'final_answer':epilogue(root,s,plan,5);break;
default:throw new Error('V129 missing dedicated scene '+scene.motif);}return s;}
function offsetFor(scene:Scene,i:number):[number,number,number]{const p=hash(scene.motif+scene.id)%12,mag=20+(i%4)*9;switch(p){case 0:return[i%2?mag:-mag,0,.94];case 1:return[0,i%2?mag:-mag,.94];case 2:return[i%2?mag:-mag,i%3?13:-13,.92];case 3:return[0,0,.85];case 4:return[i<4?-mag:mag,i%2?13:-13,.94];case 5:return[i%3===0?mag:0,i%2?mag:-mag,.95];case 6:return[i%2?-mag:mag,i<4?-14:14,.92];case 7:return[i<4?-mag:mag,0,.9];case 8:return[0,i<4?mag:-mag,.9];case 9:return[i%2?mag:-mag,i%2?-10:10,.93];case 10:return[i<2?0:(i%2?mag:-mag),i>5?-12:12,.91];default:return[i%3===0?-mag:mag*.5,i%2?11:-11,.93];}}
function settleTarget(scene:Scene,plan:Plan,i:number){const z=hash(scene.motif+plan.motion+i);let x=((z%13)-6)*1.1,y=(((z>>4)%11)-5),r=((z>>8)%7-3)*.3,s=1.01,opacity=1;const m=plan.motion;if(m.includes('shrine')||m.includes('temple'))x=i<4?-8:8;if(m.includes('classification')||m.includes('survey'))y=i>3?-7:5;if(m.includes('history')||m.includes('layer'))r=i%2?.7:-.7;if(m.includes('mushukyo')||m.includes('identity'))s=1.022;if(m.includes('secular'))x=i%2?7:-7;return{x,y,r,s,opacity};}
function* microStageFlow(stages:Node[],scene:Scene,plan:Plan):ThreadGenerator{const base=[.02,.12,.23,.34,.45,.56,.67,.78];let cursor=0;for(let i=0;i<8;i++){const[ox,oy,os]=offsetFor(scene,i);stages[i].x(ox);stages[i].y(oy);stages[i].scale(os);stages[i].rotation(i%2?.8:-.8);const at=scene.duration*Math.min(.82,base[i]+(((hash(scene.motif+i.toString())>>3)&7)*.002));if(at>cursor)yield* waitFor(at-cursor);cursor=at;const reveal=Math.min(.44,Math.max(.16,scene.duration*.012));yield* all(stages[i].opacity(1,reveal),stages[i].x(0,reveal),stages[i].y(0,reveal),stages[i].scale(1,reveal),stages[i].rotation(0,reveal));cursor+=reveal;const t=settleTarget(scene,plan,i),settle=Math.min(.33,Math.max(.14,scene.duration*.009));yield* all(stages[i].x(t.x,settle),stages[i].y(t.y,settle),stages[i].rotation(t.r,settle),stages[i].scale(t.s,settle),stages[i].opacity(t.opacity,settle));cursor+=settle;const accent=Math.min(.25,Math.max(.11,scene.duration*.007));yield* all(stages[i].scale(t.s*(i%2?1.012:.996),accent),stages[i].opacity(i%3===0?.92:1,accent));cursor+=accent;if(i>=3)stages[i-3].opacity(.72);}const end=scene.duration*.91;if(end>cursor){yield* waitFor(end-cursor);cursor=end;}if(scene.duration>cursor)yield* waitFor(scene.duration-cursor);}
function* cameraFlow(node:Node,duration:number,motif:string):ThreadGenerator{const p=hash(motif)%8,dx=[11,-13,10,-9,15,-11,8,-10][p],dy=[-5,7,6,-7,3,-4,8,-6][p];node.scale(1.006);const q=duration/6;yield* all(node.x(dx,q),node.y(dy,q),node.scale(1.012,q));yield* all(node.x(-dx*.4,q),node.y(-dy*.55,q),node.scale(1.018,q));yield* all(node.x(dx*.55,q),node.y(dy*.18,q),node.scale(1.014,q));yield* all(node.x(-dx*.22,q),node.y(-dy*.22,q),node.scale(1.02,q));yield* all(node.x(dx*.12,q),node.y(dy*.08,q),node.scale(1.013,q));const tail=Math.max(.01,duration-5*q);yield* all(node.x(0,tail),node.y(0,tail),node.scale(1.008,tail));}
function* subtitleFlow(cues:Cue[],caption:Txt,duration:number):ThreadGenerator{let t=0;for(const c of cues){if(c.start>t)yield* waitFor(c.start-t);caption.text(c.display);t=c.start;}if(duration>t)yield* waitFor(duration-t);caption.text('');}
export function* playMeaningScene(view:View2D,scene:Scene):ThreadGenerator{const plan=(visualPlan as Record<string,Plan>)[scene.motif];if(!plan)throw new Error('V129 visual plan missing: '+scene.motif);view.fill(K.bg);const contentLayer=new Node({});const headingLayer=new Node({});const subtitleBacking=new Node({});const subtitleTextLayer=new Node({});view.add(contentLayer);view.add(headingLayer);view.add(subtitleBacking);view.add(subtitleTextLayer);const stages=buildScene(contentLayer,scene,plan);rr(headingLayer,0,-474,1920,132,'#05090D',0);const part=scene.chapter==='prologue'?'PROLOGUE':scene.chapter==='epilogue'?'EPILOGUE':scene.chapter.toUpperCase();headingLayer.add(tx(part,-800,-508,22,K.gold,700));headingLayer.add(tx(scene.id,830,-508,21,K.muted,600));headingLayer.add(tx(scene.title,0,-452,scene.title.length>35?27:scene.title.length>25?31:40,K.paper,700));rr(subtitleBacking,0,460,1920,170,'#020406',0).opacity(.92);const caption=tx('',0,458,40,K.paper,650);caption.lineHeight(57);subtitleTextLayer.add(caption);yield* all(microStageFlow(stages,scene,plan),cameraFlow(contentLayer,scene.duration,scene.motif),subtitleFlow(scene.cues,caption,scene.duration));}
