// V153 Kangaeru Yoru / cinematic vector-essay engine.
// The narration is a verbatim source transcript. Art and timing alone are re-authored.
// Intentional motion-language: typographic editorial, shadow theatre, evidence photography,
// social graphs, analytical charts, internal courtroom, and layered memory artefacts.
import '@fontsource/noto-sans-jp/400.css';
import '@fontsource/noto-sans-jp/700.css';
import {all, createRef, delay, waitFor} from '@motion-canvas/core';
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';

const F='Noto Sans JP';
const C={bg:'#0C111B', bg2:'#151A24', panel:'#1A202B', paper:'#F0ECE2',
  ink:'#1B2028', muted:'#959CA6', red:'#C13B4B', teal:'#72A9A0',
  gold:'#D8B482', line:'#34404A', lightline:'#D6CEBF'};
const chName:Record<string,string>={prologue:'PROLOGUE',chapter1:'CHAPTER 01',
  chapter2:'CHAPTER 02',chapter3:'CHAPTER 03',chapter4:'CHAPTER 04',epilogue:'EPILOGUE'};
const chTitle:Record<string,string>={prologue:'誰も覚えていない。',
 chapter1:'他人は、あなたの失敗を覚えていない',
 chapter2:'存在しない観客を、あなたは作り出している',
 chapter3:'なぜ忘れたい記憶ほど、何度も蘇るのか',
 chapter4:'あなたは他人ではなく、自分の頭の中の観客に生きている',
 epilogue:'誰も見ていない舞台で、あなたは何度も頭を下げている'};

function wrap(s:string,n=19,max=3){
  const a=String(s||'').replace(/\n/g,'');
  if(a.length<=n)return a;
  const chunks=[];for(let i=0;i<a.length;i+=n)chunks.push(a.slice(i,i+n));
  return chunks.length<=max?chunks.join('\n'):chunks.slice(0,max-1).concat(chunks.slice(max-1).join('')).join('\n');
}
function T(value:string,x:number,y:number,size=54,color=C.paper,w=700,width=1450,align:'left'|'center'|'right'='center'){
 return <Txt text={value} x={x} y={y} fill={color} fontFamily={F} fontWeight={w} fontSize={size}
  width={width} textAlign={align} lineHeight={size*1.39}/>;
}
function R(x:number,y:number,w:number,h:number,fill:string,radius=0,opacity=1){
 return <Rect x={x} y={y} width={w} height={h} fill={fill} radius={radius} opacity={opacity}/>;
}
type Bar={r:any,w:number,x:number};
type Art={node:any, reveals:any[],strokes:any[],bars:Bar[],spins:any[]};
function artwork(s:any):Art{
 const d:string[]=s.display||[],id=Number(s.id)||1,kind=s.viz||'quote';
 const reveals:any[]=[],strokes:any[]=[],bars:Bar[]=[],spins:any[]=[];
 const lead=d[0]||'',second=d[1]||'';
 const p=(node:any)=>{
  const ref=createRef<Node>();reveals.push(ref);
  return <Node ref={ref} opacity={0} position={[0,33]}>{node}</Node>;
 };
 const stroke=(points:number[][],color=C.teal,width=5)=>{
  const ref=createRef<Line>();strokes.push(ref);
  return <Line ref={ref} points={points as any} stroke={color} lineWidth={width} end={0}
   lineCap={'round'} lineJoin={'round'}/>;
 };
 const bar=(x:number,y:number,w:number,h:number,color:string)=>{
  const ref=createRef<Rect>();bars.push({r:ref,w,x});
  return <Rect ref={ref} x={x-w/2} y={y} width={0} height={h} fill={color} radius={4}/>;
 };
 const motif=(idx:number)=>{
  const motifs=[];
  for(let i=0;i<5;i++)motifs.push(<Rect key={'m'+i} width={5} height={40+i*11}
    x={625+i*26} y={160-i*13} fill={i===idx%5?C.red:C.gold} opacity={.45}/>);
  return motifs;
 };
 let body:any=null;
 if(kind==='title'){
  const no=s.ch==='prologue'?'00':s.ch==='epilogue'?'05':String(Number((s.ch||'0').replace(/\D/g,''))||0).padStart(2,'0');
  body=<>
   {T(no,575,-32,374,C.paper,700,570,'center')}
   <Rect x={565} y={-110} width={4} height={360} fill={C.red} opacity={.95}/>
   {p(<>{T(chName[s.ch]||'ESSAY',-475,-230,32,C.gold,700,690,'left')}
     {R(-720,-166,200,5,C.red)}
     {T(wrap(chTitle[s.ch]||lead,16,3),-405,-32,68,C.paper,700,765,'left')}</>)}
   {p(T(wrap(lead,23,2),-450,282,30,C.muted,400,710,'left'))}
  </>;
 }else if(kind==='shirt'){
  body=<>
   {p(<>{T('THE EXPERIMENT',-510,-325,36,C.gold,700,675,'left')}
     {T('着ている本人だけが、',-460,-220,48,C.paper,700,770,'left')}
     {T('見られていると思った。',-460,-147,44,C.paper,700,770,'left')}</>)}
   {p(<>
     <Rect x={360} y={0} width={365} height={500} fill={C.paper} radius={28}/>
     <Rect x={127} y={-139} width={205} height={196} rotation={-27} fill={C.paper} radius={24}/>
     <Rect x={594} y={-139} width={205} height={196} rotation={27} fill={C.paper} radius={24}/>
     <Circle x={360} y={-194} width={145} height={86} fill={C.bg}/>
     <Circle x={359} y={-10} width={204} height={204} fill={C.ink}/>
     <Circle x={358} y={-50} width={98} height={100} fill={'#D4C3A5'}/>
     <Rect x={358} y={69} width={146} height={82} fill={'#D4C3A5'} radius={36}/>
     {T('BARRY',360,160,35,C.ink,700,290)}
     {T('MANILOW',360,204,31,C.ink,700,290)}
     {R(359,268,280,4,C.red)}
   </>)}
   {p(T('2000 / SPOTLIGHT EFFECT',-410,282,29,C.muted,700,850,'left'))}
  </>;
 }else if(kind==='numbers'){
  body=<>
    {p(T('自分への注目を、過大評価する',0,-320,63,C.paper))}
    {p(<>{T('予想',-615,-135,48,C.paper,700,240,'left')}
      {R(-70,-120,1130,76,C.panel,4)}
      {T('46%',665,-119,99,C.red,700,250,'center')}</>)}
    {bar(-70,-120,1040,76,C.red)}
    {p(<>{T('実際',-615,55,48,C.paper,700,240,'left')}
      {R(-70,70,1130,76,C.panel,4)}
      {T('23%',665,72,99,C.teal,700,250,'center')}</>)}
    {bar(-70,70,520,76,C.teal)}
    {stroke([[-630,192],[630,192]],C.line,3)}
    {p(T('同じ部屋。まるで違う、二つの数字。',0,282,36,C.gold,400))}
  </>;
 }else if(kind==='spotlight'||kind==='stage'){
  body=<>
   <Circle x={230} y={-440} width={670} height={670} stroke={C.gold} lineWidth={2} opacity={.23}/>
   <Line points={[[15,-350],[445,-350],[735,270],[-285,270]]} closed={true}
    fill={C.gold} opacity={.095}/>
   {p(<>
     <Circle x={230} y={25} width={440} height={440} stroke={C.gold} lineWidth={3} opacity={.35}/>
     <Circle x={230} y={35} width={255} height={255} stroke={C.red} lineWidth={6} opacity={.6}/>
     <Circle x={230} y={-30} width={96} height={96} fill={C.paper}/>
     <Rect x={230} y={110} width={142} height={170} fill={C.paper} radius={60}/>
     {R(230,258,980,7,C.red)}
   </>)}
   {p(<>{T('WHO IS WATCHING?',-454,-280,40,C.gold,700,790,'left')}
    {T(wrap(lead,13,3),-410,-53,67,C.paper,700,700,'left')}</>)}
   {p(T('空席だらけの観客席。',-420,278,34,C.muted,400,740,'left'))}
   {Array.from({length:8},(_,i)=><Circle key={'eye'+i} x={-540+i*158} y={320}
     width={27} height={27} fill={C.teal} opacity={.23}/>)}
  </>;
 }else if(kind==='conference'){
  body=<>
    {p(T('沈黙の会議',-470,-328,78,C.paper,700,870,'left'))}
    {p(<>
     <Rect x={40} y={94} width={1380} height={285} fill={C.panel} radius={120} stroke={C.line} lineWidth={4}/>
     <Rect x={40} y={92} width={1060} height={138} fill={C.bg} radius={70}/>
     {Array.from({length:8},(_,i)=>{
       const x=-525+i*157,top=i%2===0;
       return <Node key={'m'+i}>
        <Circle x={x} y={top?-152:328} width={78} height={78} fill={i===4?C.red:C.muted} opacity={i===4?.9:.55}/>
        <Rect x={x} y={top?-75:385} width={108} height={40} fill={C.panel} radius={19}/>
       </Node>;
     })}
     <Rect x={10} y={90} width={170} height={100} fill={C.paper} rotation={-12}/>
     <Rect x={230} y={90} width={170} height={100} fill={C.paper} rotation={12}/>
    </>)}
    {p(T('質問したい。でも、誰も手を挙げない。',0,-256,43,C.gold,700))}
  </>;
 }else if(kind==='audience'){
  const tiles=[];
  for(let i=0;i<35;i++){
    const xx=-675+(i%7)*222,yy=-200+Math.floor(i/7)*109;
    tiles.push(<Node key={'a'+i}>
      <Circle x={xx} y={yy} width={56} height={56}
       fill={i===17?C.red:C.paper} opacity={i===17?1:.18}/>
      <Rect x={xx} y={yy+43} width={88} height={37} fill={i===17?C.red:C.paper}
       radius={20} opacity={i===17?1:.12}/>
    </Node>);
  }
  body=<>{p(T('他人の頭の中は、見えない。',0,-335,60,C.paper))}
    {p(tiles)}
    {p(<>{R(0,325,1300,2,C.line)}
      {T(wrap(lead,34,2),0,360,34,C.gold,700)}</>)}
  </>;
 }else if(kind==='memory'){
  body=<>
    <Rect x={-80} y={25} width={1100} height={560} rotation={-9} fill={C.panel}
      stroke={C.line} lineWidth={3}/>
    <Rect x={65} y={2} width={1120} height={582} rotation={5} fill={C.panel}
      stroke={C.teal} lineWidth={4}/>
    {p(<>
      <Rect x={0} y={0} width={1075} height={530} fill={'#0B1018'}
       stroke={C.red} lineWidth={4}/>
      {Array.from({length:17},(_,i)=><Rect key={'sl'+i} width={15} height={28}
        x={-505+i*63} y={-236} fill={C.paper} opacity={.40}/>)}
      {Array.from({length:17},(_,i)=><Rect key={'su'+i} width={15} height={28}
        x={-505+i*63} y={240} fill={C.paper} opacity={.40}/>)}
      {T('MEMORY / RECONSTRUCTION',0,-180,32,C.red,700)}
      {T(wrap(lead,20,3),0,-4,66,C.paper,700,920)}
      {T(wrap(second,31,1),0,150,31,C.muted,400,930)}
      <Circle x={-470} y={189} width={18} height={18} fill={C.red}/>
      {T('REC',-389,187,30,C.red,700,100)}
    </>)}
  </>;
 }else if(kind==='loop'){
  const spin=createRef<Node>();spins.push(spin);
  body=<>
    {p(T('RUMINATION',-470,-319,43,C.gold,700,810,'left'))}
    <Node ref={spin}>
      <Circle x={205} y={15} width={612} height={612} stroke={C.line} lineWidth={4}/>
      <Circle x={205} y={15} width={476} height={476} stroke={C.teal} lineWidth={9} opacity={.6}/>
      <Circle x={205} y={15} width={333} height={333} stroke={C.red} lineWidth={8}/>
      {Array.from({length:6},(_,i)=>{
        const angle=i*Math.PI/3;
        return <Circle key={'or'+i} x={205+308*Math.cos(angle)} y={15+308*Math.sin(angle)}
          width={i%3===0?37:22} height={i%3===0?37:22} fill={i%3===0?C.red:C.gold}/>;
      })}
    </Node>
    {p(<>{T('反芻',205,15,108,C.paper,700,300)}
      {T('思い出す',-453,-35,59,C.paper,700,620,'left')}
      {T('↓',-336,52,69,C.red,700,100)}
      {T('また考える',-453,151,53,C.paper,700,660,'left')}</>)}
    {p(T('過去は一度。再生は何度でも。',0,356,38,C.muted,400))}
  </>;
 }else if(kind==='clock'){
  body=<>
    {p(T('同じ過去、違う時間',0,-335,70,C.paper))}
    {[-400,400].map((x,i)=><Node key={'clk'+i}>
     <Circle x={x} y={5} width={425} height={425} stroke={i?C.red:C.teal} lineWidth={9}/>
     <Circle x={x} y={5} width={20} height={20} fill={C.paper}/>
     {Array.from({length:12},(_,z)=>{
       const a=z*Math.PI/6;
       return <Circle key={'t'+z} x={x+185*Math.sin(a)} y={5-185*Math.cos(a)}
         width={7} height={7} fill={C.muted}/>;
     })}
     {stroke([[x,5],[x+115, i?-100:125]],i?C.red:C.teal,9)}
     {stroke([[x,5],[x-42,i?125:-110]],C.paper,7)}
     {p(T(i?'頭の中の時間':'現実の時間',x,287,39,i?C.red:C.teal,700,510))}
    </Node>)}
    {p(T('→',0,35,117,C.gold,700,200))}
  </>;
 }else if(kind==='mirror'){
  body=<>
   {p(T('同じ出来事。見えている世界は違う。',0,-334,57,C.paper))}
   {p(<>
     <Rect x={-421} y={40} width={650} height={470} stroke={C.red} lineWidth={7} fill={C.panel}/>
     <Rect x={421} y={40} width={650} height={470} stroke={C.teal} lineWidth={3} fill={C.panel}/>
     <Circle x={-420} y={-43} width={165} height={165} fill={C.paper}/>
     <Rect x={-420} y={119} width={220} height={160} fill={C.paper} radius={60}/>
     <Circle x={420} y={-10} width={85} height={85} fill={C.paper} opacity={.52}/>
     <Rect x={420} y={110} width={128} height={82} fill={C.paper} opacity={.5} radius={35}/>
     {T('自分の視点',-423,228,39,C.red)}
     {T('他人の視点',423,228,39,C.teal)}
   </>)}
   {p(T(wrap(lead,24,2),0,345,36,C.gold,700))}
  </>;
 }else if(kind==='fork'){
  body=<>
   {p(T('REFLECTION / RUMINATION',0,-333,41,C.gold,700))}
   {p(<>
    <Line points={[[0,-238],[0,300]]} stroke={C.line} lineWidth={3}/>
    {T('反省',-421,-126,112,C.teal,700,570)}
    {T('↗',-421,47,167,C.teal,700,520)}
    {T('次に何を変えるか',-421,240,37,C.paper,700,690)}
    {T('反芻',421,-126,112,C.red,700,570)}
    {T('↻',421,47,167,C.red,700,520)}
    {T('なぜあんなことを…',421,240,37,C.paper,700,690)}
   </>)}
  </>;
 }else if(kind==='courtroom'){
  body=<>
    {p(<>{T('THE COURT INSIDE YOUR HEAD',0,-334,40,C.gold,700)}
     {R(0,-275,1420,5,C.red)}</>)}
    {['検察官','証人','裁判官'].map((name,i)=>{
      const x=(i-1)*485;
      return p(<Node key={'ju'+i}>
       <Rect x={x} y={115+i*20} width={400} height={235+i*38} fill={C.panel}
        stroke={i===1?C.red:C.gold} lineWidth={3}/>
       <Circle x={x} y={-99} width={100} height={100} fill={C.paper}/>
       <Rect x={x} y={9} width={150} height={113} fill={C.paper} radius={37}/>
       {T(name,x,211+i*28,47,C.paper,700,400)}
      </Node>);
    })}
    {p(T('三人とも、同じ自分。',0,345,55,C.red))}
  </>;
 }else if(kind==='verdict'){
  body=<>
    <Rect width={1340} height={710} y={0} fill={C.paper} rotation={-3}/>
    <Rect width={1230} height={612} y={0} stroke={C.lightline} lineWidth={4} rotation={-3}/>
    {p(<>{T('CASE  No.'+String(id).padStart(3,'0'),-429,-241,36,C.ink,700,440,'left')}
      {T('架空の法廷',415,-240,35,C.ink,700,470,'right')}
      {R(0,-173,1150,3,C.ink,.1)}
      {T('有 罪 ？',0,-5,170,C.red,700,1050)}
      {T('証拠：自分の記憶',0,179,45,C.ink,700,800)}
      {T('証言：想像した評価',0,250,45,C.ink,700,800)}</>)}
  </>;
 }else if(kind==='empty'){
  body=<>
   {p(T('NO AUDIENCE.',0,-324,47,C.gold,700))}
   {Array.from({length:3},(_,row)=>Array.from({length:11-row*2},(_,j)=>{
      const len=11-row*2;
      return <Node key={'seat'+row+'-'+j} opacity={.45-row*.10}>
       <Rect x={(j-(len-1)/2)*(125+row*8)} y={-135+row*168}
        width={98+row*11} height={88+row*12} stroke={C.muted} lineWidth={3}
        fill={C.panel} radius={22}/>
       <Rect x={(j-(len-1)/2)*(125+row*8)} y={-89+row*168}
         width={121+row*10} height={18} fill={C.line} radius={7}/>
      </Node>;
    }))}
   {p(T('誰も、そこにはいない。',0,332,52,C.paper))}
  </>;
 }else if(kind==='research'){
  const m=String(s.heading||'').match(/(19|20)\d{2}/);
  const year=m?m[0]:'RESEARCH';
  body=<>
   <Rect width={1460} height={670} fill={C.paper} rotation={-2}/>
   <Rect width={1430} height={650} fill={C.paper} stroke={C.lightline} lineWidth={3}/>
   {p(<>
     {T('RESEARCH ARCHIVE  /  SOCIAL PSYCHOLOGY',-530,-276,32,C.ink,700,1200,'left')}
     {R(0,-229,1300,4,C.red)}
     {T(year,-370,-79,166,C.red,700,640)}
     {T('FIELD NOTES',420,-69,49,C.ink,700,560)}
     {T(wrap(String(s.heading||''),27,2),0,78,58,C.ink,700,1290)}
     {T(wrap(lead,35,2),0,236,31,'#5D6265',400,1280)}
   </>)}
  </>;
 }else if(kind==='quote'){
  body=<>
    {p(<>
      <Rect x={-740} y={-213} width={11} height={375} fill={C.red}/>
      {T(wrap(lead,16,3),40,-64,79,C.paper,700,1370,'left')}
    </>)}
    {p(T(wrap(second,32,2),-370,277,36,C.gold,400,1050,'left'))}
    {motif(id)}
  </>;
 }else {
  // Deliberately remove the generic PowerPoint card family: alternate between
  // editorial evidence, opposing hypotheses, and diagrammatic thought.
  const mode=id%3;
  if(mode===0){
   body=<>
    {p(T('A THOUGHT EXPERIMENT',-472,-298,34,C.gold,700,900,'left'))}
    {p(T(wrap(lead,17,3),-365,-32,74,C.paper,700,990,'left'))}
    {stroke([[-720,210],[680,210]],C.red,6)}
    {p(T(wrap(second,32,2),-351,286,39,C.muted,400,1030,'left'))}
   </>;
  }else if(mode===1){
   body=<>
    {p(T(wrap(lead,22,3),0,-194,78,C.paper,700,1510))}
    {p(<>{R(0,-40,1190,4,C.red)}
      <Circle x={-370} y={160} width={200} height={200} stroke={C.red} lineWidth={6}/>
      <Circle x={370} y={160} width={200} height={200} stroke={C.teal} lineWidth={6}/>
      {stroke([[-266,160],[262,160]],C.gold,6)}
      {T(wrap(second,27,2),0,344,39,C.muted,400,1250)}</>)}
   </>;
  }else{
   body=<>
    {p(T('01  /  02',0,-306,41,C.gold,700))}
    {p(<>
      {T(wrap(lead,14,3),-370,-3,67,C.paper,700,710)}
      {T(wrap(second,14,3),370,-3,67,C.paper,700,710)}
      {R(0,-30,4,500,C.red)}
      {R(-368,271,545,6,C.teal)}
      {R(368,271,545,6,C.red)}
    </>)}
   </>;
  }
 }
 return {node:<Node>{body}</Node>,reveals,strokes,bars,spins};
}
function isPaperScene(s:any){return s.viz==='research'||s.viz==='verdict';}
export function createChapterScene(chapter:string,data:any,timing:any){
 const slides:any[]=(data.slides||[]).filter((s:any)=>s.ch===chapter);
 const timed:any[]=(timing&&timing.slides)||[],total=Number(data.meta?.renderUnits||slides.length);
 return makeScene2D(function*(view){
  view.add(<Rect width={1920} height={1080} fill={C.bg}/>);
  const stages:any[]=[];
  for(const s of slides){
   const layer=createRef<Node>(),camera=createRef<Node>(),n=Number(s.id)||1;
   const art=artwork(s),paper=isPaperScene(s);
   const back=paper?C.paper:(n%9===1?'#101824':n%7===0?'#111520':C.bg);
   const fg=paper?C.ink:C.paper;
   view.add(<Node ref={layer} opacity={0}>
    <Rect width={1920} height={1080} fill={back}/>
    <Circle x={n%2===0?-770:830} y={-360} width={870} height={870}
      fill={paper?C.gold:C.red} opacity={paper?.035:.055}/>
    <Circle x={n%2===0?830:-740} y={420} width={770} height={770}
      fill={paper?C.red:C.teal} opacity={paper?.035:.055}/>
    {Array.from({length:12},(_,i)=><Rect key={'grid'+i} width={1} height={850}
      x={-760+i*135} y={0} fill={paper?C.lightline:C.line} opacity={.14}/>)}
    <Node ref={camera}>{art.node}</Node>
    {R(-820,-475,62,4,C.red)}
    {T('考える夜',-720,-475,26,fg,700,270,'left')}
    {T(chName[chapter]||'',-190,-473,25,paper?C.red:C.gold,700,550,'left')}
    {T(String(s.id).padStart(2,'0')+'  /  '+total,779,-473,27,paper?C.ink:C.muted,400,330,'right')}
    {R(0,-512,1760,2,paper?C.lightline:C.line,.2)}
    {R(-880+n/total*880,-512,1760*n/total,4,C.red)}
   </Node>);
   stages.push({s,layer,camera,art});
  }
  const capLayer=createRef<Node>(),sub=createRef<Txt>(),underline=createRef<Rect>();
  view.add(<Node ref={capLayer} opacity={0}>
    <Rect width={1840} height={187} y={440} fill={'#070B11'} opacity={.95}/>
    <Rect width={1840} height={2} y={346} fill={C.line}/>
    <Rect ref={underline} width={0} height={4} x={-920} y={347} fill={C.gold}/>
    <Txt ref={sub} text={''} x={0} y={442} width={1720} textAlign={'center'}
      fontFamily={F} fontWeight={700} fontSize={40} fill={C.paper}
      lineHeight={57}/>
  </Node>);
  for(let k=0;k<stages.length;k++){
   const st=stages[k],t=timed[k]||{duration:6,subs:[]},duration=Math.max(2,Number(t.duration||6));
   const layer=st.layer(),cam=st.camera(),id=Number(st.s.id)||k+1;
   const entrances=(function*(){
    const dx=id%4===0?-88:id%4===1?88:id%4===2?-40:45;
    layer.opacity(0);layer.position([dx,id%3===0?30:-22]);
    layer.scale(id%3===0?.94:1.025);
    yield* all(layer.opacity(1,.66),layer.position([0,0],.78),layer.scale(1,.83));
    if(st.art.reveals.length)yield* all(...st.art.reveals.map((x:any,j:number)=>
      delay(Math.min(.14*j,.78),all(x().opacity(1,.57),x().position([0,0],.66)))));
    if(st.art.strokes.length)yield* all(...st.art.strokes.map((x:any,j:number)=>
      delay(.12*j,x().end(1,1.3))));
    if(st.art.bars.length)yield* all(...st.art.bars.map((b:Bar,j:number)=>
      delay(j*.36,all(b.r().width(b.w,1.55),b.r().x(b.x,1.55)))));
   })();
   const slowCamera=(function*(){
    const a=(id%2?1:-1);
    cam.position([a*-19,id%3===0?-11:8]);cam.scale(.989);
    yield* all(cam.position([a*23,id%3===0?11:-8],duration),
      cam.scale(1.039,duration));
   })();
   const kinetic=(function*(){
    if(st.art.spins.length)yield* all(...st.art.spins.map((x:any)=>
      x().rotation(id%2===0?19:-19,duration)));
   })();
   const subs=(function*(){
    let cursor=0;capLayer().opacity(1);
    for(const u of t.subs||[]){
     const start=Math.max(0,Number(u.start||0));
     if(start>cursor)yield* waitFor(start-cursor);
     const q=String(u.text||'');
     const size=q.length>68?32:q.length>46?36:40;
     sub().fontSize(size);sub().text(wrap(q,q.length>68?31:29,3));
     underline().width(0);underline().x(-920);
     const len=Math.max(.05,Number(u.duration||.5));
     yield* all(underline().width(1840,len),underline().x(0,len));
     cursor=start+len;
    }
    if(duration>cursor)yield* waitFor(duration-cursor);
    capLayer().opacity(0);sub().text('');
   })();
   const exit=(function*(){
    yield* waitFor(Math.max(.5,duration-.60));
    yield* all(layer.opacity(0,.52),layer.scale(1.045,.60));
   })();
   yield* all(entrances,slowCamera,kinetic,subs,exit);
  }
 });
}
