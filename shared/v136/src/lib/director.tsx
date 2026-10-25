import '@fontsource/noto-sans-jp/400.css';
import '@fontsource/noto-sans-jp/700.css';
import {Node, Rect, Circle, Line, Txt, type View2D} from '@motion-canvas/2d';
import {all, waitFor, type ThreadGenerator} from '@motion-canvas/core';

/** V136 Religion/Cult: 33 authored semantic visual families. No generic fallbacks.
 * All chapter designs remain inside the frame's central safe zone. Subtitle is always
 * the final (topmost) view child and its timings come from measured VOICEVOX output.
 */
interface Cue {text:string;speech:string;display:string;start:number;end:number}
interface Shot {id:string;chapter:string;section:string;visual:string;title:string;note:string;
  narration:string;focus:string;cues:Cue[];duration:number;durationSource:string;sceneIndex:number}
interface Drawing {family:string;nodes:Node[];bars:Rect[];symbols:Circle[]}
const P={bg:'#090F18',panel:'#172537',panel2:'#1C3341',night:'#050A12',
  ink:'#0E1721',text:'#F4F1E8',secondary:'#B2BFCD',faint:'#526D80',
  jade:'#70D3BD',gold:'#E8BC68',red:'#E66B64',blue:'#78A5D7',paper:'#DDD2B5',white:'#FFFFFF'};
const FONT='Noto Sans JP, Noto Sans CJK JP, sans-serif';
function block(p:Node,x:number,y:number,w:number,h:number,color:string,rad=12):Rect{
  const n=new Rect({x,y,width:w,height:h,fill:color,radius:rad});p.add(n);return n;
}
function circ(p:Node,x:number,y:number,d:number,color:string):Circle{
  const n=new Circle({x,y,width:d,height:d,fill:color});p.add(n);return n;
}
function line(p:Node,pts:[number,number][],color=P.gold,w=5):Line{
  const n=new Line({points:pts,stroke:color,lineWidth:w,lineCap:'round',lineJoin:'round'});p.add(n);return n;
}
function write(p:Node,str:string,x:number,y:number,size=39,color=P.text,weight=700):Txt{
  const n=new Txt({text:str,x,y,fontSize:size,fontWeight:weight,fontFamily:FONT,fill:color,textAlign:'center'});p.add(n);return n;
}
function tag(p:Node,s:string,x:number,y:number,w=440,h=125,color=P.blue):Node{
  const g=new Node({x,y});p.add(g);
  block(g,0,0,w,h,P.panel2,14);block(g,0,-h/2+10,w-20,8,color,4);
  write(g,s,0,0,s.length>15?23:s.length>10?30:39);
  return g;
}
function human(p:Node,x:number,y:number,shirt=P.blue):Node{
  const g=new Node({x,y});p.add(g);
  circ(g,0,-85,57,P.paper);block(g,0,28,112,165,shirt,23);
  line(g,[[-31,75],[-45,150]],shirt,16);line(g,[[31,75],[45,150]],shirt,16);
  line(g,[[-50,-15],[-92,70]],shirt,12);line(g,[[50,-15],[92,70]],shirt,12);
  return g;
}
function right(p:Node,a:number,b:number,y:number,color=P.gold):void{
  line(p,[[a,y],[b,y]],color,7);line(p,[[b-20,y-17],[b,y],[b-20,y+17]],color,7);
}
function star(p:Node,x:number,y:number,n=10,color=P.gold):void{
  for(let i=0;i<n;i++){const a=i/n*6.283;circ(p,x+Math.cos(a)*168,y+Math.sin(a)*168,12,color);}
}
function heart(p:Node,x:number,y:number):Node{
  const g=new Node({x,y});p.add(g);
  circ(g,-26,-19,85,P.red);circ(g,26,-19,85,P.red);
  block(g,0,20,105,94,P.red,15);
  return g;
}
function art(s:Shot,root:Node):Drawing{
  const v=s.visual,nodes:Node[]=[],bars:Rect[]=[],symbols:Circle[]=[];
  const heading=s.chapter==='prologue'?'問いを立てる':s.chapter==='chapter1'?'分類への疑問':
     s.chapter==='chapter2'?'ウェーバーと制度化':s.chapter==='chapter3'?'言葉が自由を制限する':
     s.chapter==='chapter4'?'信教の自由と法執行':'自分の常識を問う';
  write(root,heading,0,-332,29,P.secondary,400);
  if(v==='question'){
    symbols.push(circ(root,-320,-10,300,P.panel2),circ(root,310,-10,300,P.panel2));
    write(root,'他人の信仰',-320,-65,46);write(root,'自分の信仰',310,-65,46);
    nodes.push(tag(root,'洗脳？',-320,150,430,106,P.red),tag(root,'自由な意思？',310,150,430,106,P.blue));
    write(root,'判断するのは誰か',0,290,36,P.gold);
  }else if(v==='ritual'){
    for(let j=0;j<4;j++){block(root,-520+j*345,-80,258,425,P.panel2,10);
      line(root,[[-625+j*345,-180],[-415+j*345,-180]],j%2?P.blue:P.gold,8);
      symbols.push(circ(root,-520+j*345,-85,63,P.paper));}
    nodes.push(tag(root,'礼拝・寄付・共同体',0,265,900,96,P.gold));
  }else if(v==='waco'){
    block(root,0,-2,1160,460,P.panel2,12);
    for(let j=0;j<5;j++)block(root,-420+j*210,10,135,118,j%2?P.ink:'#3B5A69',5);
    line(root,[[-610,-258],[610,-258],[610,262],[-610,262],[-610,-258]],P.faint,5);
    nodes.push(tag(root,'1993年　ウェーコ近郊',0,-254,670,92,P.red));
    write(root,'事件の模式図 / 建物配置は再現していない',0,278,24,P.secondary,400);
  }else if(v==='timeline'){
    line(root,[[-680,45],[680,45]],P.gold,8);
    for(let j=0;j<3;j++){const x=-575+j*575;symbols.push(circ(root,x,45,45,j===2?P.red:P.gold));}
    nodes.push(tag(root,'2月28日　捜査',-570,-110,470,120,P.blue));
    nodes.push(tag(root,'51日間　包囲',0,190,470,120,P.gold));
    nodes.push(tag(root,'4月19日　火災',570,-110,470,120,P.red));
  }else if(v==='warrant'){
    block(root,-350,-3,610,510,P.paper,20);write(root,'連邦法に基づく令状',-350,-210,38,P.ink);
    for(let i=0;i<5;i++)line(root,[[-570,-120+i*60],[-130,-120+i*60]],P.faint,6);
    nodes.push(tag(root,'銃器関連捜査',450,-80,470,150,P.blue));
    nodes.push(tag(root,'法執行 ≠ 宗教弾圧',450,142,520,142,P.red));
  }else if(v==='fire'){
    block(root,0,0,1210,420,P.panel2,14);
    for(let i=0;i<4;i++)nodes.push(tag(root,['捜査','交渉','催涙ガス','施設の火災'][i],-440+i*295,-25,250,177,
       i===3?P.red:i===2?P.gold:P.blue));
    write(root,'時系列と因果関係を混同しない',0,247,38,P.paper);
  }else if(v==='constitution'){
    block(root,-450,0,550,510,P.paper,8);
    for(let j=0;j<4;j++)block(root,-660+j*142,12,50,350,P.blue,2);
    block(root,-450,-194,610,45,P.gold,2);
    nodes.push(tag(root,'信じる自由',420,-97,520,130,P.blue));
    nodes.push(tag(root,'違法行為の免責ではない',420,102,620,138,P.red));
  }else if(v==='vocabulary'){
    nodes.push(tag(root,'「宗教」',-440,-30,600,270,P.blue));
    nodes.push(tag(root,'「カルト」',440,-30,600,270,P.red));
    line(root,[[0,-245],[0,204]],P.gold,8);
    write(root,'同じ現象でも、言葉が評価を変える',0,261,34,P.gold);
  }else if(v==='comparison'){
    for(let i=0;i<3;i++){
      const y=-190+i*180;
      nodes.push(tag(root,['献金','共同生活','熱心な布教'][i],-450,y,610,140,P.blue));
      nodes.push(tag(root,['搾取','隔離','勧誘の強制'][i],440,y,610,140,P.red));
    }
    write(root,'違いは行為の条件と強制性',0,300,30,P.gold);
  }else if(v==='dictionary'){
    block(root,0,5,1200,490,P.paper,15);
    write(root,'NRM',0,-150,120,P.ink);
    write(root,'新宗教運動',0,-12,62,P.ink);
    nodes.push(tag(root,'評価ではなく記述する',0,163,800,110,P.blue));
  }else if(v==='minority'){
    for(let j=0;j<7;j++)symbols.push(circ(root,-565+j*175,(j%2)*45-28,j===4?120:82,j===4?P.red:P.blue));
    nodes.push(tag(root,'異質 ＝ 危険 ではない',0,200,910,132,P.gold));
    write(root,'多数派の視線',0,-220,49);
  }else if(v==='evidence'){
    block(root,-450,-8,620,520,P.panel2,18);
    write(root,'レッテル',-450,-190,55,P.red);
    write(root,'印象だけで判断',-450,15,40,P.secondary);
    block(root,440,-8,650,520,P.panel2,18);
    write(root,'検証する',440,-190,55,P.jade);
    for(let i=0;i<3;i++)write(root,['強制の有無','金銭と権利','離脱の自由'][i],440,-40+i*95,34,P.paper);
  }else if(v==='threshold'){
    line(root,[[-700,160],[700,160]],P.gold,12);
    for(let i=0;i<5;i++)symbols.push(circ(root,-650+i*315,160,55,i<2?P.blue:i<4?P.gold:P.red));
    write(root,'自発的',-605,-50,50,P.jade);
    write(root,'圧力と統制',0,-50,50,P.gold);
    write(root,'強制',585,-50,50,P.red);
    write(root,'危険を測るのは奇妙さではない',0,280,35);
  }else if(v==='charisma'){
    nodes.push(human(root,0,-65,P.gold));
    for(let i=0;i<6;i++){const x=-660+i*264;symbols.push(circ(root,x,225,66,P.blue));}
    write(root,'人格への特別な信奉',0,-275,48,P.paper);
    write(root,'カリスマ的支配',0,285,40,P.gold);
  }else if(v==='founder'){
    symbols.push(circ(root,-520,-10,175,P.gold));
    line(root,[[-350,-10],[-60,-10]],P.gold,9);
    for(let i=0;i<3;i++)symbols.push(circ(root,150+i*195,-120+(i%2)*200,132,P.blue));
    write(root,'ひとりの語りが共同体をつくる',0,265,39);
  }else if(v==='succession'){
    nodes.push(tag(root,'創始者',-525,-65,475,215,P.gold));
    nodes.push(tag(root,'文書化された教え',0,-65,490,215,P.blue));
    nodes.push(tag(root,'継承された権威',530,-65,475,215,P.jade));
    right(root,-278,-248,-65);right(root,265,291,-65);
    write(root,'カリスマの日常化',0,225,50,P.gold);
  }else if(v==='institution'){
    for(let j=0;j<4;j++)block(root,-540+j*355,30,260,325,P.panel2,10);
    for(let j=0;j<4;j++)nodes.push(tag(root,['規則','役職','儀礼','伝統'][j],-540+j*355,0,220,155,j%2?P.jade:P.blue));
    write(root,'個人に依存した権威　→　制度',0,-245,46,P.gold);
  }else if(v==='tradition'){
    line(root,[[-690,0],[690,0]],P.gold,8);
    for(let j=0;j<5;j++)symbols.push(circ(root,-640+j*320,0,65,j===0?P.red:P.blue));
    nodes.push(tag(root,'昨日',-560,-150,410,98,P.red));
    nodes.push(tag(root,'百年',0,155,410,98,P.blue));
    nodes.push(tag(root,'千年',560,-150,410,98,P.gold));
    write(root,'古いことは、正しいことの証明か',0,286,34,P.paper);
  }else if(v==='authority'){
    for(let j=0;j<3;j++)nodes.push(tag(root,['カリスマ','伝統','法と制度'][j],-555+j*555,-5,510,260,[P.red,P.gold,P.blue][j]));
    write(root,'人は何を根拠に従うのか',0,255,45,P.paper);
  }else if(v==='feedback'){
    const pts:[number,number][]=[[-490,-150],[440,-150],[440,150],[-490,150],[-490,-150]];
    line(root,pts,P.red,7);
    nodes.push(tag(root,'疑問を持つ',-480,-185,520,128,P.gold));
    nodes.push(tag(root,'未熟さの証拠と呼ばれる',440,-185,650,128,P.red));
    nodes.push(tag(root,'さらに信じる',430,175,550,128,P.blue));
    nodes.push(tag(root,'批判を拒絶',-480,175,520,128,P.red));
  }else if(v==='reframe'){
    nodes.push(tag(root,'長時間労働',-460,-75,660,200,P.red));
    nodes.push(tag(root,'「成長の機会」',460,-75,660,200,P.jade));
    right(root,-94,90,-75,P.gold);
    write(root,'名前を変えれば評価が変わる',0,205,41,P.gold);
  }else if(v==='echo'){
    block(root,0,0,1150,530,P.panel2,260);
    for(let i=0;i<3;i++)symbols.push(circ(root,(i-1)*285,-88,110,P.blue));
    write(root,'正しい言葉だけが循環する',0,116,44);
    nodes.push(tag(root,'反対意見は外へ',0,253,690,98,P.red));
  }else if(v==='bounded'){
    for(let j=0;j<4;j++){block(root,0,0,1330-j*260,580-j*105,[P.panel,P.panel2,P.ink,P.night][j],14);}
    nodes.push(tag(root,'信念体系',-500,-222,420,103,P.gold));
    nodes.push(tag(root,'権威',470,-160,330,103,P.red));
    nodes.push(tag(root,'統制',-260,115,310,98,P.blue));
    nodes.push(tag(root,'制約された選択',255,195,560,104,P.jade));
  }else if(v==='pressure'){
    nodes.push(human(root,-510,-15,P.blue));
    line(root,[[-250,-115],[60,-115]],P.gold,8);
    line(root,[[-110,-180],[-60,-45]],P.red,16);
    nodes.push(tag(root,'所属共同体',400,-98,625,168,P.gold));
    nodes.push(tag(root,'家族や友人との断絶',400,126,625,148,P.red));
  }else if(v==='exit'){
    block(root,0,5,900,505,P.panel2,9);
    block(root,120,-5,340,430,P.night,0);
    block(root,-75,-5,28,430,P.gold,0);
    nodes.push(human(root,-485,0,P.blue));
    nodes.push(tag(root,'離れる自由はあるか',450,215,610,102,P.red));
    write(root,'出口が見えていても、出られるとは限らない',0,-280,36,P.paper);
  }else if(v==='influence'){
    for(let i=0;i<4;i++)nodes.push(tag(root,
      ['人生の意味','特別な仲間','唯一の真実','忠誠の要求'][i],
      -565+i*377,-30+i%2*40,352,240,[P.jade,P.gold,P.blue,P.red][i]));
    write(root,'所属と意味を奪うことへの恐れ',0,265,38);
  }else if(v==='negotiation'){
    nodes.push(tag(root,'法と治安の言葉',-470,-20,650,225,P.blue));
    nodes.push(tag(root,'黙示録と終末の言葉',470,-20,650,225,P.red));
    line(root,[[-125,0],[125,0]],P.gold,8);
    symbols.push(circ(root,0,0,90,P.gold));
    write(root,'話しているのに通じない',0,245,41);
  }else if(v==='translation'){
    block(root,-430,0,640,430,P.panel2,13);
    block(root,430,0,640,430,P.panel2,13);
    write(root,'捜査側',-430,-130,49,P.blue);
    write(root,'信者側',430,-130,49,P.red);
    write(root,'法・安全・退去',-430,20,36);
    write(root,'預言・試練・救済',430,20,36);
    line(root,[[-90,250],[90,250]],P.gold,6);
    write(root,'理解と同意は別である',0,288,39,P.gold);
  }else if(v==='rights'){
    nodes.push(tag(root,'個人の信教の自由',-440,-20,705,280,P.blue));
    nodes.push(tag(root,'他人の生命と安全',440,-20,705,280,P.red));
    write(root,'守る主体は組織ではなく人間',0,274,40,P.gold);
  }else if(v==='dilemma'){
    line(root,[[0,-245],[0,178]],P.gold,9);
    line(root,[[-610,-28],[610,-28]],P.gold,12);
    symbols.push(circ(root,-550,0,150,P.blue),circ(root,550,0,150,P.red));
    nodes.push(tag(root,'信仰の自由',-520,220,545,114,P.blue));
    nodes.push(tag(root,'公共の安全',520,220,545,114,P.red));
    write(root,'強制も放置も、無条件には正しくない',0,-287,38);
  }else if(v==='workplace'){
    block(root,-415,5,660,500,P.panel2,14);
    for(let i=0;i<4;i++)block(root,-620+i*125,-80,85,215,P.blue,2);
    nodes.push(tag(root,'会社の「正しさ」',395,-120,600,148,P.blue));
    nodes.push(tag(root,'異論は許されるか',395,102,600,148,P.red));
  }else if(v==='fandom'){
    for(let i=0;i<5;i++)symbols.push(circ(root,-580+i*290,(i%2)*150-70,135,[P.blue,P.gold,P.jade,P.red,P.blue][i]));
    write(root,'所属したい',0,-260,54);
    nodes.push(tag(root,'内部だけで通じる言葉',0,240,850,106,P.gold));
  }else if(v==='reflection'){
    nodes.push(tag(root,'努力は報われる',-425,-140,650,140,P.blue));
    nodes.push(tag(root,'この組織は正しい',425,-140,650,140,P.gold));
    nodes.push(tag(root,'私は騙されない',0,100,760,170,P.red));
    write(root,'自分だけは例外なのか',0,290,34,P.paper);
  }else if(v==='freedom'){
    line(root,[[0,-230],[0,40]],P.gold,8);
    line(root,[[0,40],[-445,196]],P.jade,11);
    line(root,[[0,40],[445,196]],P.red,11);
    nodes.push(tag(root,'信じる自由',-470,224,545,118,P.jade));
    nodes.push(tag(root,'信じない自由',470,224,545,118,P.red));
  }else if(v==='mirror'){
    block(root,0,0,800,500,P.gold,15);
    block(root,0,0,762,465,P.night,7);
    nodes.push(human(root,0,55,P.blue));
    write(root,'あなたが信じるもの',0,-285,45,P.gold);
    write(root,'疑うことはできるか',0,293,43,P.paper);
  }else if(v==='ending'){
    block(root,0,0,1360,510,P.ink,17);
    write(root,'その信仰を',0,-166,68,P.paper);
    write(root,'捨てる自由はあるか',0,-12,75,P.red);
    nodes.push(tag(root,'信仰する自由は、疑う自由でもある',0,218,1100,106,P.gold));
  }else{throw new Error('Unplanned visual '+s.id+' / '+v);}
  return {family:v,nodes,bars,symbols};
}
function* progress(d:Drawing,s:Shot,i:number,duration:number):ThreadGenerator{
  const t=Math.min(.72,Math.max(.11,duration*.22));
  const anim:ThreadGenerator[]=[];
  const p=(i+1)/Math.max(1,s.cues.length);
  if(['timeline','tradition','succession','institution','comparison','feedback'].includes(d.family)){
    if(d.nodes.length){const x=d.nodes[i%d.nodes.length];anim.push(x.opacity(.78+.20*p,t));}
    if(d.symbols.length){const c=d.symbols[i%d.symbols.length];anim.push(c.scale(1.06+.08*p,t));}
  }else if(['constitution','rights','dilemma','threshold','freedom','bounded'].includes(d.family)){
    if(d.nodes.length)anim.push(d.nodes[i%d.nodes.length].scale(1.01+.06*p,t));
    if(d.symbols.length)anim.push(d.symbols[i%d.symbols.length].opacity(.63+.34*p,t));
  }else if(['waco','warrant','fire','negotiation','translation','exit','pressure'].includes(d.family)){
    if(d.nodes.length)anim.push(d.nodes[i%d.nodes.length].opacity(.7+.27*p,t));
  }else if(['question','ritual','charisma','founder','minority','fandom'].includes(d.family)){
    if(d.symbols.length)anim.push(d.symbols[i%d.symbols.length].scale(1.04+.1*p,t));
    if(d.nodes.length)anim.push(d.nodes[i%d.nodes.length].opacity(.75+.2*p,t));
  }else if(['vocabulary','dictionary','evidence','reframe','echo','influence','authority','workplace','reflection','mirror','ending'].includes(d.family)){
    if(d.nodes.length)anim.push(d.nodes[i%d.nodes.length].scale(1+.065*p,t));
    if(d.symbols.length)anim.push(d.symbols[i%d.symbols.length].opacity(.7+.25*p,t));
  }
  if(anim.length)yield* all(...anim);else yield* waitFor(t);
  yield* waitFor(Math.max(.005,duration-t));
}
export function* playScene(view:View2D,s:Shot):ThreadGenerator{
  if(s.durationSource!=='VOICEVOX_MEASURED')throw new Error('Missing audio-measured timing for '+s.id);
  const content=new Node({}),top=new Node({}),footer=new Node({}),subtitle=new Node({});
  view.add(content);view.add(top);view.add(footer);view.add(subtitle);
  view.fill(P.bg);
  block(content,0,0,1920,1080,P.bg,0);
  block(content,0,0,1840,966,P.night,10);
  line(content,[[-883,-370],[883,-370]],P.faint,2);
  line(content,[[-883,344],[883,344]],P.faint,2);
  const visual=art(s,content);
  write(content,s.note,0,339,23,P.secondary,400);
  block(top,0,-476,1920,126,P.bg,0);
  write(top,s.chapter==='prologue'?'PROLOGUE':s.chapter==='epilogue'?'EPILOGUE':'CHAPTER '+s.chapter.replace('chapter',''),
    -760,-478,22,P.gold);
  write(top,s.title,0,-472,s.title.length>16?32:39,P.paper);
  write(top,'RELIGION / CULT',758,-478,20,P.secondary);
  block(footer,0,453,1920,172,P.bg,0).opacity(.985);
  const sub=write(subtitle,'',0,447,41,P.paper);sub.width(1660);sub.lineHeight(60);
  for(let i=0;i<s.cues.length;i++){
    const cue=s.cues[i],duration=cue.end-cue.start;
    if(!(duration>0))throw new Error('Bad subtitle cue '+s.id);
    sub.text(cue.display);
    yield* progress(visual,s,i,duration);
  }
  sub.text('');
}
