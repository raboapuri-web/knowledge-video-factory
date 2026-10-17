import '@fontsource/noto-sans-jp/400.css';
import '@fontsource/noto-sans-jp/700.css';
import {Circle, Line, Node, Rect, Txt, type View2D} from '@motion-canvas/2d';
import {all, waitFor, type ThreadGenerator} from '@motion-canvas/core';
import visualPlan from '../../content/visual_plan.json';

type Cue={text:string;display:string;start:number;end:number};
type Scene={id:string;chapter:string;motif:string;title:string;narration:string;cues:Cue[];duration:number};
type Plan={kind:string;motion:string;labels:string[]};
const F='Noto Sans JP, Noto Sans CJK JP, sans-serif';
const K={bg:'#0A1017',panel:'#121C27',mid:'#283949',paper:'#EEECE4',muted:'#A3ADB7',red:'#D05B65',blue:'#5E91BF',gold:'#E1BE7A',jade:'#69AC9E',violet:'#9B83C8',white:'#FFFFFF',dark:'#060A0F'};
export const MICRO_BEATS_PER_SCENE=24;
const hash=(s:string)=>[...s].reduce((a,c)=>((a*33)^c.charCodeAt(0))>>>0,127);
const sw=(v:number)=>Math.max(0.6,Math.min(1.08,v));
function rect(p:Node,x:number,y:number,w:number,h:number,fill:string,r=10,stroke?:string){const n=new Rect({x,y,width:w,height:h,fill,radius:r,stroke:stroke??fill,lineWidth:stroke?2:0});p.add(n);return n;}
function circ(p:Node,x:number,y:number,r:number,c:string,stroke?:string){const n=new Circle({x,y,width:r*2,height:r*2,fill:c,stroke:stroke??c,lineWidth:stroke?3:0});p.add(n);return n;}
function line(p:Node,pts:[number,number][],c=K.muted,w=5){const n=new Line({points:pts,stroke:c,lineWidth:w,lineCap:'round',lineJoin:'round'});p.add(n);return n;}
function txt(p:Node,text:string,x:number,y:number,size=32,color=K.paper,weight=700){const n=new Txt({text,x,y,fontFamily:F,fontSize:size,fill:color,fontWeight:weight});p.add(n);return n;}
function pill(p:Node,t:string,x:number,y:number,c=K.gold,w=310){rect(p,x,y,w,78,K.panel,14,c);txt(p,t,x,y,26,c);}
function person(p:Node,x:number,y:number,col:string,s=1){const n=new Node({x,y,scale:s});p.add(n);circ(n,0,-53,22,col);rect(n,0,24,53,90,col,20);line(n,[[-18,13],[-43,67]],col,9);line(n,[[18,13],[43,67]],col,9);line(n,[[-15,60],[-20,118]],col,10);line(n,[[15,60],[20,118]],col,10);return n;}
function note(p:Node,t:string,x:number,y:number,w=420,c=K.blue){rect(p,x,y,w,128,K.panel,16,c);txt(p,t,x,y,Math.min(29,t.length>17?23:28),K.paper);}
function stage(){return Array.from({length:8},()=>new Node({opacity:0}));}
function background(root:Node,scene:Scene){const cc=[K.bg,'#0C131B','#0C1420','#11141B','#101A1C','#141118'];rect(root,0,0,1920,1080,cc[hash(scene.motif)%cc.length],0);for(let i=-8;i<=8;i++)line(root,[[i*120,-395],[i*120,335]],'#1E2A35',1);for(let i=-4;i<=4;i++)line(root,[[-960,i*90],[960,i*90]],'#17232D',1);}
function miniGraph(p:Node,x:number,y:number,c:string){line(p,[[x-170,y+85],[x-170,y-80]],K.muted,3);line(p,[[x-170,y+85],[x+180,y+85]],K.muted,3);line(p,[[x-150,y+65],[x-80,y+30],[x-10,y+45],[x+70,y-12],[x+155,y-40]],c,7);}
function draw(root:Node,scene:Scene,plan:Plan):Node[]{
 background(root,scene);
 const s=stage();s.forEach(n=>root.add(n));const [a,b,c,d,e,f,g,h]=s;
 const l=plan.labels;const mode=plan.kind;const v=hash(plan.motion)%3;
 const left=v===1?-400:-460,right=v===1?400:460;
 // Each mode uses a distinct information architecture rather than one generic card template.
 switch(mode){
 case 'forum':
   rect(a,-490,0,750,480,K.panel,22,K.mid);txt(a,'DISCUSSION',-705,-185,27,K.muted);
   note(b,l[1],-420,-90,630,K.blue);note(c,l[2],355,-10,540,K.red);
   note(d,l[3],300,175,480,K.gold);line(e,[[-90,-90],[60,-10]],K.gold,8);
   circ(f,45,-10,24,K.gold);txt(g,'意見の内容は、どこへ？',0,-280,33,K.paper);txt(h,'投稿例は再構成です',0,304,17,K.muted);break;
 case 'label':
   person(a,-530,10,K.paper,1.2);pill(b,l[1],-150,-165,K.jade,350);
   pill(c,l[2],250,10,K.red,350);rect(d,250,10,370,96,'#351D2A',11,K.red);
   line(e,[[-340,20],[25,20]],K.red,9);txt(f,'人物に貼られたラベル',110,190,29,K.gold);
   circ(g,-200,180,47,K.red);txt(h,l[3],-180,260,30,K.paper);break;
 case 'matrix':
   txt(a,'意見は一つずつ判断できる',0,-282,38,K.gold);
   for(let i=0;i<10;i++){rect(b,-675+i*150,0,92,92,i===9?K.jade:K.mid,14);}
   pill(c,l[1],-410,170,K.red,330);pill(d,l[2],410,170,K.jade,330);
   txt(e,'9 : 1',0,-135,65,K.paper);line(f,[[-80,-105],[85,-105]],K.gold,4);
   txt(g,l[3],0,280,33,K.gold);circ(h,675,0,18,K.gold);break;
 case 'mirror':
   rect(a,-420,0,680,500,K.panel,24,K.blue);rect(b,420,0,680,500,K.panel,24,K.red);
   person(c,-560,-40,K.blue,.85);person(d,560,-40,K.red,.85);
   txt(e,l[1],-420,170,27,K.paper);txt(f,l[2],420,170,27,K.paper);
   circ(g,0,0,85,K.dark,K.gold);txt(g,'≠',0,0,65,K.gold);txt(h,l[3],0,-275,35,K.gold);break;
 case 'tribes':
   rect(a,-460,0,750,550,'#182733',25,K.blue);rect(b,460,0,750,550,'#301F2A',25,K.red);
   for(let i=0;i<8;i++){person(c,-740+(i%4)*170,-120+Math.floor(i/4)*180,K.blue,.48);person(d,180+(i%4)*170,-120+Math.floor(i/4)*180,K.red,.48);}
   line(e,[[0,-270],[0,245]],K.gold,7);circ(f,0,-20,43,K.gold);
   txt(g,l[1],-440,265,28,K.paper);txt(g,l[2],440,265,28,K.paper);txt(h,l[3],0,-320,32,K.gold);break;
 case 'choice':
   circ(a,0,0,48,K.gold);line(b,[[0,0],[-320,-140],[-580,-140]],K.blue,9);
   line(c,[[0,0],[320,-140],[580,-140]],K.red,9);
   pill(d,l[1],-500,-190,K.blue,360);pill(e,l[2],500,-190,K.red,360);
   note(f,l[3],0,190,600,K.gold);circ(g,-560,-140,14,K.blue);circ(h,560,-140,14,K.red);break;
 case 'question':
   circ(a,0,-30,200,K.panel,K.gold);txt(b,'？',0,-35,250,K.gold);
   pill(c,l[1],-500,190,K.blue,370);pill(d,l[2],0,190,K.red,370);pill(e,l[3],500,190,K.gold,370);
   line(f,[[-600,-190],[600,-190]],K.muted,3);txt(g,'問いを問い直す',0,-300,36,K.paper);circ(h,0,-30,230,'#00000000',K.muted);break;
 case 'experiment':
   txt(a,'最小集団実験 〈概念図〉',0,-280,34,K.gold);
   for(let i=0;i<6;i++){circ(b,-540+(i%3)*120,-70+Math.floor(i/3)*110,27,K.blue);circ(c,300+(i%3)*120,-70+Math.floor(i/3)*110,27,K.red);}
   pill(d,l[1],-420,195,K.blue,335);pill(e,l[2],420,195,K.red,335);
   line(f,[[0,-240],[0,200]],K.gold,4);txt(g,l[3],0,-205,26,K.paper);circ(h,0,260,17,K.gold);break;
 case 'balance':
   line(a,[[0,-180],[0,180]],K.gold,9);line(a,[[-690,-140],[690,-140]],K.muted,9);
   line(b,[[-485,-140],[-485,70]],K.blue,5);line(c,[[485,-140],[485,70]],K.red,5);
   rect(d,-485,95,630,200,K.panel,18,K.blue);rect(e,485,95,630,200,K.panel,18,K.red);
   txt(f,l[1],-485,60,31,K.blue);txt(f,l[2],485,60,31,K.red);
   txt(g,l[3],0,280,31,K.gold);circ(h,0,-185,29,K.gold);break;
 case 'filter':
   pill(a,l[1],-600,-90,K.blue,420);line(b,[[-365,-90],[-180,-90]],K.gold,10);
   rect(c,0,-90,285,285,K.mid,25,K.gold);txt(c,'分類',0,-90,49,K.paper);
   line(d,[[180,-90],[365,-90]],K.red,10);pill(e,l[2],600,-90,K.red,420);
   pill(f,l[3],0,240,K.gold,500);circ(g,0,-90,180,'#00000000',K.gold);txt(h,'入力 → 解釈 → 判断',0,-300,30,K.muted);break;
 case 'family':
   person(a,-460,10,K.blue,1);person(b,460,10,K.red,1);person(c,0,40,K.gold,.78);
   line(d,[[-270,40],[-75,55]],K.blue,5);line(e,[[270,40],[75,55]],K.red,5);
   pill(f,l[1],-450,230,K.blue,340);pill(g,l[2],450,230,K.red,340);txt(h,l[3],0,-270,35,K.gold);break;
 case 'scale':
   miniGraph(a,-420,10,K.blue);miniGraph(b,430,10,K.red);
   pill(c,l[1],-460,220,K.blue,320);pill(d,l[2],440,220,K.red,320);
   txt(e,'同じ単位で測れる？',0,-275,40,K.gold);
   line(f,[[-20,-150],[20,160]],K.gold,6);circ(g,0,0,37,K.gold);txt(h,l[3],0,288,27,K.paper);break;
 case 'book':
   rect(a,-250,-10,550,500,'#2D3543',20,K.gold);rect(b,70,-10,7,500,K.gold,2);
   txt(c,l[1],-255,-145,33,K.paper);txt(d,l[2],-255,-40,29,K.gold);
   pill(e,l[3],480,-135,K.jade,360);line(f,[[90,-10],[280,-80]],K.gold,5);
   txt(g,'思想と研究',425,90,46,K.paper);rect(h,475,196,540,8,K.gold,2);break;
 case 'elephant':
   circ(a,-190,70,128,K.mid);rect(a,-220,162,230,110,K.mid,35);circ(a,-320,-40,77,K.mid);
   line(b,[[-315,10],[-360,170]],K.muted,24);line(c,[[-250,195],[-250,270]],K.mid,30);line(c,[[-130,195],[-130,270]],K.mid,30);
   person(d,-80,-160,K.gold,.62);pill(e,l[1],-450,-252,K.blue,300);pill(f,l[2],450,-252,K.gold,300);
   line(g,[[10,40],[400,65]],K.red,8);pill(h,l[3],440,190,K.red,430);break;
 case 'network':
   for(let i=0;i<7;i++){const x=-590+i*190,y=(i%3-1)*120;circ(a,x,y,37,i%2?K.blue:K.jade);if(i>0)line(b,[[x-150,0],[x,y]],K.mid,4);}
   pill(c,l[1],-480,230,K.blue,330);pill(d,l[2],0,230,K.red,330);pill(e,l[3],480,230,K.jade,330);
   circ(f,0,-180,80,K.panel,K.gold);txt(g,'私たち',0,-180,27,K.paper);line(h,[[0,-100],[0,90]],K.gold,4);break;
 case 'columns':
   rect(a,-430,0,720,505,K.panel,25,K.blue);rect(b,430,0,720,505,K.panel,25,K.red);
   txt(c,l[1],-430,-170,38,K.blue);txt(d,l[2],430,-170,38,K.red);
   for(let i=0;i<4;i++){rect(e,-430,-60+i*75,520,20,K.blue,4);rect(f,430,-60+i*75,520,20,K.red,4);}
   pill(g,l[3],0,288,K.gold,580);line(h,[[0,-250],[0,220]],K.mid,3);break;
 case 'logic':
   circ(a,-280,0,220,'#17374A',K.blue);circ(b,280,0,220,'#422330',K.red);
   txt(c,'A',-280,-60,85,K.blue);txt(d,'B',280,-60,85,K.red);
   pill(e,l[1],-350,160,K.blue,375);pill(f,l[2],350,160,K.red,375);
   txt(g,'AND',0,-240,52,K.gold);pill(h,l[3],0,292,K.gold,460);break;
 case 'podium':
   rect(a,-370,80,320,260,K.mid,9);rect(b,0,130,320,180,K.mid,9);rect(c,370,170,320,100,K.mid,9);
   txt(d,l[1],-370,-85,33,K.red);txt(e,l[2],370,-20,33,K.blue);
   line(f,[[-510,-190],[510,225]],K.red,12);txt(g,'勝敗で測れない',0,-275,40,K.gold);pill(h,l[3],0,280,K.gold,370);break;
 case 'research':
   rect(a,0,0,1320,520,K.panel,22,K.gold);txt(b,'研究',-525,-190,38,K.gold);
   pill(c,l[1],-350,-85,K.blue,430);pill(d,l[2],350,-85,K.red,390);
   line(e,[[-350,65],[0,140],[350,65]],K.gold,9);circ(f,0,145,41,K.gold);
   txt(g,l[3],0,240,35,K.paper);txt(h,'※模式化した説明。数値は表示しません',0,313,19,K.muted);break;
 case 'bridge':
   rect(a,-585,130,520,270,'#1D3340',30,K.blue);rect(b,585,130,520,270,'#332332',30,K.red);
   line(c,[[-360,120],[360,120]],K.gold,24);person(d,-580,20,K.blue,.86);person(e,580,20,K.red,.86);
   pill(f,l[1],-490,-200,K.blue,400);pill(g,l[2],490,-200,K.red,400);txt(h,l[3],0,250,32,K.gold);break;
 case 'spectrum':
   line(a,[[-700,20],[700,20]],K.gold,13);for(let i=0;i<3;i++){const x=-600+i*600;circ(b,x,20,37,[K.blue,K.jade,K.red][i]);}
   pill(c,l[1],-590,175,K.blue,380);pill(d,l[2],0,-150,K.jade,380);pill(e,l[3],590,175,K.red,380);
   txt(f,'一枚岩ではない',0,-280,46,K.paper);circ(g,0,20,90,'#00000000',K.gold);line(h,[[-700,70],[700,70]],K.mid,3);break;
 case 'timeline':
   line(a,[[-660,0],[660,0]],K.gold,10);for(let i=0;i<3;i++){circ(b,-580+i*580,0,33,[K.blue,K.gold,K.red][i]);}
   pill(c,l[1],-580,-145,K.blue,380);pill(d,l[2],0,155,K.gold,380);pill(e,l[3],580,-145,K.red,380);
   txt(f,'複数の段階・複数の視点',0,-285,35,K.paper);line(g,[[-580,35],[-580,80]],K.blue,3);line(h,[[580,35],[580,80]],K.red,3);break;
 case 'magnifier':
   for(let i=0;i<7;i++)person(a,-600+i*200,140,i===3?K.gold:K.mid,.5);
   circ(b,0,25,160,'#151D27',K.gold);circ(c,0,25,132,K.panel,K.paper);txt(d,'主張',0,25,47,K.gold);
   pill(e,l[1],-480,-220,K.blue,360);pill(f,l[2],470,-220,K.red,360);
   line(g,[[100,125],[290,285]],K.gold,20);txt(h,l[3],0,298,28,K.paper);break;
 case 'nested':
   rect(a,0,0,1310,545,'#19222F',24,K.gold);rect(b,-250,5,460,325,K.panel,18,K.blue);rect(c,340,5,460,325,K.panel,18,K.red);
   for(let i=0;i<3;i++)person(d,-390+i*140,-30,K.blue,.55);for(let i=0;i<3;i++)person(e,200+i*140,-30,K.red,.55);
   pill(f,l[1],-280,230,K.blue,385);pill(g,l[2],340,230,K.red,385);txt(h,l[3],0,-305,36,K.gold);break;
 case 'person':
   person(a,-290,0,K.paper,1.9);circ(b,225,10,180,K.panel,K.blue);txt(c,l[1],225,-60,27,K.paper);
   pill(d,l[2],395,150,K.red,400);line(e,[[-150,35],[55,35]],K.gold,7);
   txt(f,l[3],0,-285,38,K.gold);circ(g,-290,0,240,'#00000000',K.muted);rect(h,-290,275,450,10,K.blue,4);break;
 case 'compass':
   circ(a,0,0,115,K.panel,K.gold);txt(b,'怒り',0,0,48,K.gold);
   line(c,[[0,-110],[-450,-200]],K.blue,8);line(d,[[90,60],[480,120]],K.jade,8);line(e,[[-50,95],[-270,230]],K.red,8);
   pill(f,l[1],-520,-240,K.blue,320);pill(g,l[2],510,170,K.jade,320);pill(h,l[3],-360,278,K.red,330);break;
 case 'loop':
   for(let i=0;i<4;i++){const theta=i*Math.PI/2,cx=290*Math.cos(theta),cy=155*Math.sin(theta);circ(a,cx,cy,62,[K.blue,K.red,K.gold,K.jade][i]);}
   line(b,[[270,-100],[390,10],[300,80]],K.gold,8);line(c,[[-270,100],[-390,-10],[-300,-80]],K.gold,8);
   pill(d,l[1],0,-260,K.blue,340);pill(e,l[2],480,240,K.red,350);
   pill(f,l[3],-480,240,K.gold,350);txt(g,'反応が次の反応を生む',0,308,26,K.paper);circ(h,0,0,75,K.panel,K.gold);break;
 case 'target':
   circ(a,0,0,230,K.panel,K.red);circ(b,0,0,165,K.bg,K.paper);circ(c,0,0,95,K.panel,K.gold);
   line(d,[[-590,-100],[-110,-20]],K.gold,14);txt(e,l[1],-500,-200,30,K.paper);
   pill(f,l[2],480,-165,K.jade,390);pill(g,l[3],480,175,K.red,440);circ(h,0,0,30,K.gold);break;
 default:throw new Error('Missing V130 original visual mode: '+mode);
 }
 return s;
}
function* choreography(stages:Node[],scene:Scene,plan:Plan):ThreadGenerator{
 const seed=hash(plan.motion),duration=scene.duration;
 let clock=0;
 for(let i=0;i<8;i++){
   const stage=stages[i],phase=i/8,at=duration*(.018+i*.106);
   const direction=((seed+i*3)%8),offset=22+(i%4)*13;
   const dx=[-offset,offset,0,0,-offset,offset,-offset,offset][direction];
   const dy=[0,0,-offset,offset,-offset,-offset,offset,offset][direction];
   stage.x(dx);stage.y(dy);stage.scale(sw(.92+(seed%4)*.015));stage.rotation((i%2?1:-1)*1.1);
   if(at>clock){yield* waitFor(at-clock);clock=at;}
   const reveal=Math.min(.42,Math.max(.14,duration*.013));
   yield* all(stage.opacity(1,reveal),stage.x(0,reveal),stage.y(0,reveal),stage.rotation(0,reveal),stage.scale(1,reveal));clock+=reveal;
   const tilt=(seed%3-1)*2,settle=Math.min(.3,Math.max(.12,duration*.007));
   yield* all(stage.scale(i%2?1.017:1.007,settle),stage.rotation(tilt,settle));clock+=settle;
   const micro=Math.min(.25,Math.max(.1,duration*.006));
   yield* all(stage.rotation(0,micro),stage.scale(1,micro),stage.opacity(i>5?.98:1,micro));clock+=micro;
   if(i>=4)stages[i-4].opacity(.87);
 }
 if(duration>clock)yield* waitFor(duration-clock);
}
function* cameraFlow(root:Node,duration:number,motif:string):ThreadGenerator{
 const z=hash(motif)%6,dx=[-8,7,-5,10,-6,5][z],dy=[3,-4,6,-5,-3,4][z];
 const q=duration/5;
 yield* all(root.x(dx,q),root.y(dy,q),root.scale(1.01,q));
 yield* all(root.x(-dx*.65,q),root.y(-dy*.45,q),root.scale(1.012,q));
 yield* all(root.x(dx*.45,q),root.y(dy*.5,q),root.scale(1.008,q));
 yield* all(root.x(-dx*.25,q),root.y(-dy*.3,q),root.scale(1.011,q));
 yield* all(root.x(0,q),root.y(0,q),root.scale(1,q));
}
function* subtitles(cues:Cue[],caption:Txt,duration:number):ThreadGenerator{
 let time=0;for(const c of cues){if(c.start>time)yield* waitFor(c.start-time);caption.text(c.display);time=c.start;}if(duration>time)yield* waitFor(duration-time);caption.text('');
}
export function* playMeaningScene(view:View2D,scene:Scene):ThreadGenerator{
 const plan=(visualPlan as Record<string,Plan>)[scene.motif];if(!plan)throw new Error('V130 missing visual plan '+scene.motif);
 view.fill(K.bg);
 const contentLayer=new Node({});const headingLayer=new Node({});const subtitleBacking=new Node({});const subtitleTextLayer=new Node({});
 view.add(contentLayer);view.add(headingLayer);view.add(subtitleBacking);view.add(subtitleTextLayer);
 const stages=draw(contentLayer,scene,plan);
 rect(headingLayer,0,-470,1920,140,K.dark,0);txt(headingLayer,'考える夜',-796,-506,25,K.gold);txt(headingLayer,scene.chapter.toUpperCase(),-700,-445,19,K.muted);
 txt(headingLayer,scene.title,0,-474,scene.title.length>18?31:39,K.paper);txt(headingLayer,scene.id,840,-508,21,K.muted);
 rect(subtitleBacking,0,455,1920,174,'#020407',0).opacity(.97);
 const caption=txt(subtitleTextLayer,'',0,455,40,K.paper,650);caption.lineHeight(58);
 yield* all(choreography(stages,scene,plan),cameraFlow(contentLayer,scene.duration,scene.motif),subtitles(scene.cues,caption,scene.duration));
}
