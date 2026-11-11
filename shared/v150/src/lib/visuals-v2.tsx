// V150 V2 | directed visual grammar: each storyboard beat gets its own visual metaphor.
// Motion Canvas 3.17.2. All diagrams are original, deterministic and narration-led.
import {createRef, createSignal} from '@motion-canvas/core';
import {Circle, Line, Node, Rect, Txt} from '@motion-canvas/2d';
export const C = {
  bg:'#0B1017', paper:'#F4F0E8', secondary:'#BBC4C7', dim:'#768492',
  gold:'#D8B36F', teal:'#63B8B1', rust:'#E57768', blue:'#587BBA',
  line:'#304050', panel:'#17232D', white:'#FFFFFF', dark:'#121A20'
};
const SF='Noto Sans JP', MF='Noto Serif JP';
const ids=(n:number,a:number[])=>a.includes(n);
function fit(t:string,step=18,limit=4):string{
  const s=String(t||'').replace(/\n/g,'');
  if(s.length<=step)return s;
  const lines=[];for(let k=0;k<s.length;k+=step)lines.push(s.slice(k,k+step));
  if(lines.length>limit){return [...lines.slice(0,limit-1),lines.slice(limit-1).join('')].join('\n');}
  return lines.join('\n');
}
function txt(t:string,x=0,y=0,size=52,color=C.paper,width=1500,serif=true,align:'center'|'left'|'right'='center'){
  return <Txt text={fit(t,Math.max(10,Math.floor(width/(size*1.12))),4)} x={x} y={y} width={width}
    fontFamily={serif?MF:SF} fontWeight={700} textAlign={align} fontSize={size} fill={color} />;
}
function human(x:number,y:number,c:string,scale=1,active=false){
  return <Node x={x} y={y} scale={scale}>
    <Circle width={active?94:68} height={active?94:68} y={-80} fill={c} stroke={active?C.gold:C.paper} lineWidth={active?7:1}/>
    <Rect width={active?136:104} height={124} y={38} fill={c} radius={47}/>
    <Rect width={94} height={10} y={100} fill={C.bg} opacity={0.5}/>
  </Node>;
}
function card(label:string,x:number,y:number,w:number,h:number,tone=C.teal,index=''){
  return <Node x={x} y={y}>
    <Rect width={w} height={h} radius={14} fill={C.panel} stroke={tone} lineWidth={2}/>
    <Rect width={w-22} height={h-22} radius={9} stroke={C.line} lineWidth={1}/>
    {index?<Txt text={index} x={-w/2+58} y={-h/2+42} fontFamily={SF} fontSize={25} fill={tone}/>:null}
    {txt(label,0,8,label.length>34?34:label.length>20?39:46,C.paper,w-85)}
  </Node>;
}
function halo(x:number,y:number,d:number,c:string,opacity=0.10){
  return <Circle x={x} y={y} width={d} height={d} fill={c} opacity={opacity}/>;
}
const leftPts=[[-232,-130],[-78,-212],[40,-133],[-120,40],[75,80],[-215,155],[165,-4]];
const rightPts=[[0,-125],[165,-205],[210,-20],[-10,80],[135,180],[-170,125],[-160,-30]];
export type Design = {node:any, reveals:any[], strokes:any[], bars:Array<{ref:any,w:number,x:number}>, numbers:Array<{sig:any,target:number}>};
export function buildDesign(s:any):Design{
  const n=Number(s.id),d:string[]=s.display||[];
  const reveals:any[]=[],strokes:any[]=[],bars:Array<{ref:any,w:number,x:number}>=[],numbers:Array<{sig:any,target:number}>=[];
  const rise=(child:any)=>{const r=createRef<Node>();reveals.push(r);return <Node ref={r} opacity={0} y={30}>{child}</Node>};
  const draw=(points:any,color=C.gold,width=7)=>{const r=createRef<Line>();strokes.push(r);return <Line ref={r} points={points} lineWidth={width} stroke={color} end={0} lineCap={'round'}/>};
  function mesh(cx:number,cy:number,pts:number[][],tone:string,mode=0){
    const lines=pts.slice(1).map((p,i)=><Line key={'n-l'+n+':'+i} points={[[cx+pts[0][0],cy+pts[0][1]],[cx+p[0],cy+p[1]]]} stroke={tone} lineWidth={mode?4:5} opacity={mode?0.27:0.37}/>);
    const dots=pts.map((p,i)=><Circle key={'n-c'+n+':'+i} x={cx+p[0]} y={cy+p[1]} width={i?30:61} height={i?30:61} fill={tone} stroke={i?C.bg:C.paper} lineWidth={i?0:3}/>);
    return <Node>{lines}{dots}</Node>;
  }
  let art:any;
  // OPEN + FINAL: typography is the protagonist, not a generic chart.
  if(n===1){
    const sig=createSignal(0);numbers.push({sig,target:83.4});
    art=<Node>
      {halo(-700,200,850,C.rust,.10)}{halo(680,-170,720,C.teal,.10)}
      {rise(txt('人生を変えるのは、誰だ。',0,-307,70,C.paper,1410))}
      <Txt text={()=>sig().toFixed(1)+'%'} x={-35} y={12} fontFamily={SF} fontSize={258} fontWeight={700} fill={C.rust}/>
      <Rect width={1210} height={4} y={174} fill={C.gold}/>
      {rise(txt('仕事の情報は、親密な人間関係から届くとは限らない',0,247,49,C.paper,1450))}
      {rise(txt('GRANOVETTER  /  1973',0,341,29,C.gold,800,false))}
    </Node>;
  }else if(n===58){
    art=<Node>
      {halo(-620,-70,800,C.teal,.07)}{halo(620,170,810,C.gold,.07)}
      {mesh(-610,130,leftPts,C.teal,1)}{mesh(570,130,rightPts,C.rust,1)}
      {draw([[-450,110],[450,110]],C.gold,12)}
      {rise(txt('あなたを一番よく知る人が、',0,-235,68,C.paper,1450))}
      {rise(txt('未来を一番広く知るとは限らない。',0,-104,69,C.paper,1520))}
      {rise(txt('考える夜',0,310,91,C.gold,700))}
    </Node>;
  }else if(n===2 || n===21 || n===23){
    const year=n===23?'1980s':n===21?'1973':'1973';
    const name=n===23?'RONALD BURT':'MARK GRANOVETTER';
    const topic=n===23?'STRUCTURAL HOLES':'THE STRENGTH OF WEAK TIES';
    art=<Node>
      <Rect x={15} y={-6} width={1230} height={760} fill={C.paper} radius={7} rotation={-1.6}/>
      <Rect x={15} y={-6} width={1160} height={700} stroke={C.dark} lineWidth={3} radius={3} rotation={-1.6}/>
      {rise(txt(year+'  /  研究',-470,-281,38,C.dark,440,false,'left'))}
      {rise(txt(name,0,-180,63,C.dark,1110))}
      {rise(txt(topic,0,-84,43,C.rust,1100,false))}
      <Rect width={740} height={4} y={0} fill={C.dark} opacity={.7}/>
      {rise(txt(d[0]||s.heading,0,145,53,C.dark,975))}
      {rise(txt('社会学 × 情報のネットワーク',0,284,34,C.blue,970,false))}
    </Node>;
  }else if(n===3){
    const values=[16.7,55.6,27.8],labels=['頻繁に会う相手','たまに会う相手','めったに会わない相手'];
    art=<Node>
      {rise(txt('転職情報を得た相手との接触頻度',0,-334,61,C.paper,1490))}
      {values.map((v,i)=>{
        const y=-165+i*170,w=v*10;
        const r=createRef<Rect>();bars.push({ref:r,w,x:-255+w/2});
        return <Node key={'b'+i}>
          {txt(labels[i],-595,y,38,C.secondary,480,false)}
          <Rect x={88} y={y} width={685} height={85} radius={4} fill={C.panel} opacity={0.8}/>
          <Rect ref={r} x={-255} y={y} width={0} height={85} radius={4} fill={i===0?C.dim:i===1?C.rust:C.teal}/>
          {txt(v.toFixed(1)+'%',600,y,72,i===0?C.paper:i===1?C.rust:C.teal,380,false)}
        </Node>;
      })}
      {rise(txt('頻繁には会わない相手  83.4%',0,325,47,C.gold,1400,false))}
    </Node>;
  }else if(n===30 || n===31 || n===52){
    const value=n===52?83.4:n===31?60:2000;
    const sig=createSignal(0);numbers.push({sig,target:value});
    const unit=n===52?'%':n===31?'万件':'万人以上';
    const label=n===31?'仕事の移動を分析':n===52?'最初の数字に戻ろう':'2022年  /  LinkedInの大規模実験';
    art=<Node>
      {halo(-420,0,700,C.rust,.11)}
      {rise(txt(label,0,-300,59,C.paper,1500))}
      <Txt text={()=>sig().toFixed(n===52?1:0)+unit} y={-26} fontFamily={SF} fontWeight={700} fontSize={210} fill={n===52?C.gold:C.teal}/>
      <Rect y={150} width={1260} height={4} fill={C.rust}/>
      {n===30?rise(<Node>
        {card('実験期間  約5年間',-500,289,430,140,C.gold,'01')}
        {card('新しいつながり  約20億件',0,289,430,140,C.teal,'02')}
        {card('求人・転職との関係',500,289,430,140,C.rust,'03')}
      </Node>):n===31?rise(txt('つながりの強さが就職に及ぼす影響を調べた',0,275,49,C.paper,1550)):rise(txt('「親密さ」と「情報の新しさ」は、同じではない',0,275,52,C.paper,1490))}
    </Node>;
  }else if(ids(n,[7,18,19,20,22,25,27,28,39,40,53,54,56])){
    const variant=n%4;
    const leftx=n===18?-550:-570,rightx=n===18?550:570;
    art=<Node>
      {halo(-590,-15,660,C.teal,.08)}{halo(590,-15,660,C.rust,.08)}
      {mesh(leftx,25,leftPts,C.teal,variant===1?1:0)}
      {mesh(rightx,25,rightPts,C.rust,variant===1?1:0)}
      {ids(n,[7,20,25,28,39,53,54,56])?draw([[-420,-94],[420,-100]],C.gold,14):null}
      {n===18?rise(txt('点 = 人間     線 = 関係',0,-325,61,C.paper,1370)):rise(txt(s.heading,0,-325,65,C.paper,1510))}
      {ids(n,[22,39,40,53,54])?rise(<Node>{card(d[0]||'親友：理解と支え',-455,324,655,110,C.teal)}
        {card(d[1]||'知人：異世界への橋',455,324,655,110,C.rust)}</Node>):
        rise(txt(n===28?'強い絆だけでは、社会はつながらない':n===56?'見えている世界からしか選べない':n===20?'一本の細い線が、情報を運ぶ':d[0]||'橋が生まれる',0,340,48,C.gold,1460))}
    </Node>;
  }else if(ids(n,[5,45,50])){
    // Three tactile postcards: a colleague, an old friend, another worldview.
    art=<Node>
      {rise(txt(s.heading,0,-347,65,C.paper,1490))}
      {d.slice(0,3).map((entry,i)=>{
        const x=-530+i*530,y=i===1?10:-13,ang=i===0?-3:i===2?3:0;
        return rise(<Node key={'postcard'+i} x={x} y={y} rotation={ang}>
          <Rect width={480} height={535} radius={8} fill={C.paper}/>
          <Rect width={442} height={335} y={-72} radius={5} fill={i===0?C.teal:i===1?C.blue:C.rust} opacity={.78}/>
          <Circle y={-165} width={137} height={137} fill={C.paper} opacity={.85}/>
          <Rect y={-40} width={220} height={120} radius={60} fill={C.paper} opacity={.85}/>
          {txt('0'+(i+1),-168,-198,30,C.dark,110,false)}
          {txt(entry,0,188,39,C.dark,406)}
        </Node>);
      })}
    </Node>;
  }else if(n===8){
    art=<Node>{rise(txt(s.heading,0,-336,64,C.paper,1400))}
      <Circle width={680} height={680} y={60} stroke={C.teal} lineWidth={3} opacity={.38}/>
      {human(-395,35,C.teal,1.4)}{human(0,-120,C.teal,1.37,true)}{human(395,35,C.teal,1.4)}
      {draw([[-320,17],[0,-143],[320,17],[-320,17]],C.gold,6)}
      {rise(txt('友人たちは、同じ世界を共有している',0,341,50,C.paper,1450))}
    </Node>;
  }else if(n===11){
    art=<Node>{rise(txt('異なる業界から来た、もう一人',0,-322,66,C.paper,1480))}
      {human(-450,0,C.teal,1.5,true)}{human(475,0,C.rust,1.5,true)}
      <Circle x={-450} width={490} height={490} stroke={C.teal} lineWidth={5} opacity={.45}/>
      <Circle x={475} width={490} height={490} stroke={C.rust} lineWidth={5} opacity={.45}/>
      {draw([[-150,-36],[168,-36]],C.gold,8)}
      {rise(txt('同じ日常では、見えない情報がある',0,335,51,C.gold,1500))}
    </Node>;
  }else if(n===12){
    art=<Node>
      {rise(txt('何気ない一言が、未来を変える',0,-340,64,C.paper,1550))}
      <Rect width={1450} height={445} y={-6} radius={28} fill={C.paper}/>
      {rise(txt('“',-641,-183,135,C.rust,150,false))}
      {rise(txt(d[0]||'',0,-13,63,C.dark,1285))}
      {rise(txt('— たまに会う知人',430,168,35,C.blue,540,false))}
      {draw([[-100,261],[0,321],[100,261]],C.gold,10)}
    </Node>;
  }else if(n===19){
    art=<Node>{rise(txt('社会は、小さな集団の集合である',0,-350,61,C.paper,1510))}
      {mesh(-515,35,leftPts.slice(0,5),C.teal,1)}
      {mesh(0,35,leftPts.slice(0,5),C.blue,1)}
      {mesh(515,35,leftPts.slice(0,5),C.rust,1)}
      {rise(txt('学校',-495,311,53,C.teal,310))}
      {rise(txt('仕事',15,311,53,C.paper,310))}
      {rise(txt('趣味',540,311,53,C.rust,310))}
    </Node>;
  }else if(n===29){
    art=<Node>{rise(txt('相関関係は、原因の証明ではない',0,-350,65,C.paper,1510))}
      <Rect x={-300} y={7} width={670} height={515} fill={C.panel} stroke={C.line} lineWidth={3}/>
      <Line points={[[-605,205],[-605,-205]]} stroke={C.paper} lineWidth={5}/>
      <Line points={[[-605,205],[15,205]]} stroke={C.paper} lineWidth={5}/>
      {Array.from({length:21},(_,i)=>{
        const x=-552+(i%7)*79,y=162-((i*11)%7)*45-((i%7)*24);
        return <Circle key={'scatter'+i} x={x} y={y} width={19} height={19} fill={i%2?C.teal:C.gold}/>;
      })}
      {rise(txt('相関 ≠ 因果',475,-17,87,C.rust,720))}
      {rise(txt('つながりが転職に効いたのか？',380,213,43,C.paper,720))}
    </Node>;
  }else if(n===34){
    art=<Node>{rise(txt('親友を捨てて、人脈を増やす？',0,-340,69,C.paper,1520))}
      <Node x={-440} y={30}>
        {Array.from({length:81},(_,i)=><Circle key={'contacts'+i} x={(i%9-4)*55} y={(Math.floor(i/9)-4)*48} width={14} height={14} fill={C.dim}/>)}
      </Node>
      <Rect width={6} height={485} fill={C.line}/>
      {human(470,-10,C.teal,2,true)}
      {rise(txt('数の多さ',-420,339,48,C.secondary,570))}
      {rise(txt('関係の深さ',460,339,48,C.gold,570))}
    </Node>;
  }else if(n===35){
    art=<Node>{rise(txt('目の前に、魅力的な仕事がある',0,-339,66,C.paper,1490))}
      <Rect width={1280} height={520} fill={C.paper} radius={16} rotation={-1.5}/>
      <Rect x={-495} y={-180} width={150} height={110} radius={9} fill={C.teal}/>
      {txt('JOB OFFER',-180,-196,60,C.dark,760,false)}
      {d.slice(0,3).map((v,i)=>rise(<Node key={'job'+i}>
        <Circle x={-480} y={-38+i*130} width={37} height={37} fill={C.rust}/>
        {txt(v,110,-38+i*130,57,C.dark,890)}
      </Node>))}
      {rise(txt('だが、転職は情報だけでは決まらない',0,331,44,C.gold,1440))}
    </Node>;
  }else if(n===36){
    art=<Node>
      {halo(-20,15,800,C.rust,.20)}
      {rise(txt('それでも、決断の前には不安がある',0,-346,64,C.paper,1530))}
      {human(-400,50,C.paper,1.75,true)}
      <Circle x={-400} y={-35} width={475} height={475} stroke={C.gold} lineWidth={6} opacity={.40}/>
      {rise(card(d[0]||'新しい環境でやっていけるだろうか',340,-23,875,290,C.rust,'?'))}
      {rise(txt('情報はある。勇気はどうする？',0,328,50,C.gold,1410))}
    </Node>;
  }else if(n===38){
    art=<Node>{rise(txt('親友が知っているのは、履歴書の外側だ',0,-339,63,C.paper,1560))}
      {human(-540,20,C.teal,1.65,true)}
      {d.slice(0,3).map((v,i)=>rise(<Node key={'memory'+i}>
        <Rect x={260} y={-180+i*176} width={930} height={148} fill={C.panel} stroke={i===1?C.gold:C.teal} lineWidth={2} radius={9}/>
        <Rect x={-130} y={-180+i*176} width={9} height={118} fill={C.rust}/>
        {txt(v,260,-180+i*176,46,C.paper,810)}
      </Node>))}
    </Node>;
  }else if(n===41){
    art=<Node>{rise(txt('出会いは扉を開き、友情は帰る場所を作る',0,-340,58,C.paper,1550))}
      <Rect x={-445} y={15} width={420} height={570} fill={'#253845'} stroke={C.teal} lineWidth={8} radius={8}/>
      <Rect x={-445} y={12} width={320} height={492} fill={C.bg} stroke={C.gold} lineWidth={5}/>
      {draw([[-540,70],[-250,-30]],C.gold,10)}
      <Circle x={-325} y={16} width={15} height={15} fill={C.paper}/>
      <Rect x={455} y={75} width={590} height={390} radius={44} stroke={C.rust} lineWidth={12}/>
      <Rect x={455} y={-135} width={355} height={116} fill={C.rust} radius={50}/>
      {rise(txt('新しい世界',-430,318,49,C.teal,540))}
      {rise(txt('戻れる場所',465,318,49,C.rust,540))}
    </Node>;
  }else if(n===42){
    art=<Node>{rise(txt('同じ学校にいた二人が、別の世界へ',0,-349,63,C.paper,1550))}
      {human(0,-70,C.paper,1.1,true)}
      {draw([[0,20],[-500,190]],C.teal,10)}
      {draw([[0,20],[500,190]],C.rust,10)}
      {human(-520,185,C.teal,1.3)}{human(520,185,C.rust,1.3)}
      {rise(txt('会社員',-520,351,48,C.teal,580))}
      {rise(txt('海外で働く',520,351,48,C.rust,580))}
    </Node>;
  }else if(n===43 || n===44){
    art=<Node>{rise(txt(s.heading,0,-347,65,C.paper,1510))}
      <Line points={[[-710,0],[710,0]]} stroke={C.line} lineWidth={11}/>
      {draw([[-710,0],[710,0]],C.gold,6)}
      {[-620,0,620].map((x,i)=><Node key={'timeline'+i}>
        <Circle x={x} width={i===1?66:49} height={i===1?66:49} fill={i===1?C.gold:i===0?C.teal:C.rust}/>
        {rise(txt(i===0?'同じ世界':i===1?'別々の時間':'新しい経験',x,101,45,i===0?C.teal:i===1?C.gold:C.rust,530))}
      </Node>)}
      {rise(txt(d[0]||'違う経験が、再び交差する',0,307,47,C.paper,1420))}
    </Node>;
  }else if(n===49){
    art=<Node>
      {rise(txt('人脈を増やすことが目的ではない',0,-341,65,C.paper,1540))}
      <Rect width={1070} height={555} x={-30} y={-14} stroke={C.line} lineWidth={13} radius={12}/>
      <Rect width={465} height={536} x={-293} y={-13} fill={C.panel}/>
      <Rect width={453} height={536} x={225} y={-13} fill={C.bg} stroke={C.gold} lineWidth={8} rotation={-12}/>
      {draw([[230,0],[655,-75]],C.gold,11)}
      {rise(txt('知らない世界への扉を閉ざさない',0,318,51,C.gold,1490))}
    </Node>;
  }else if(n===55){
    art=<Node>{rise(txt('自分の意志で選んでいるつもりでも',0,-351,64,C.paper,1550))}
      {human(0,-162,C.paper,.95,true)}
      {draw([[0,-65],[0,25],[-570,110]],C.teal,8)}
      {draw([[0,25],[0,110]],C.gold,8)}
      {draw([[0,25],[570,110]],C.rust,8)}
      {d.slice(0,3).map((v,i)=>rise(card(v,(-1+i)*540,269,475,190,i===0?C.teal:i===1?C.gold:C.rust,String(i+1))))}
    </Node>;
  }else if(n===57){
    art=<Node>{rise(txt('もう一度、誰かの世界を聞いてみる',0,-343,67,C.paper,1560))}
      {human(-560,0,C.teal,1.5,true)}{human(570,0,C.rust,1.5,true)}
      {draw([[-389,-95],[385,-95]],C.gold,12)}
      {rise(card(d[0]||'何年も会っていない知人',-445,290,775,100,C.teal))}
      {rise(card(d[1]||'普段は話さない人',455,290,775,100,C.rust))}
    </Node>;
  }else if(ids(n,[4,5,8,11,12,13,34,35,36,37,38,41,42,43,45,50,57])){
    const people=ids(n,[4,8,13,34,37,38,41,42,43]);
    art=<Node>
      {rise(txt(s.heading,0,-337,66,C.paper,1550))}
      {people?<Node>
        {human(-570,-10,C.teal,1.4,true)}
        {human(-310,18,C.teal,1.07)}
        {human(350,-15,C.rust,1.38,true)}
        {human(595,35,C.rust,.91)}
        {draw([[-174,-54],[174,-54]],C.gold,9)}
      </Node>:<Node>
        {human(-440,40,n===36?C.rust:C.teal,1.6,true)}
        <Circle x={-440} y={-36} width={315} height={315} stroke={C.gold} lineWidth={4} opacity={.6}/>
      </Node>}
      {people?rise(<Node>{card(d[0]||'親密な人間関係',-458,279,680,137,C.teal,'A')}
        {card(d[1]||d[0]||'新しい世界',460,279,680,137,C.rust,'B')}</Node>):
        rise(<Node>{card(d[0]||s.heading,250,-66,790,145,C.gold,'01')}
          {d[1]?card(d[1],250,128,790,137,C.teal,'02'):null}
          {d[2]?card(d[2],250,316,790,126,C.rust,'03'):null}</Node>)}
    </Node>;
  }else if(ids(n,[9,10,14,15,16,47,48])){
    const gap=n===48?250:145, crowded=n!==48;
    art=<Node>
      {rise(txt(s.heading,0,-330,63,C.paper,1450))}
      {halo(-420,50,740,C.teal,.10)}
      <Node x={-420} y={12}>
        {Array.from({length:9},(_,i)=>{const x=((i%3)-1)*gap,y=(Math.floor(i/3)-1)*128;
          return <Node key={'grid'+i}>
            {i? <Line points={[[0,0],[x,y]]} lineWidth={3} stroke={C.teal} opacity={.40}/>:null}
            <Circle x={x} y={y} width={i===4?80:48} height={i===4?80:48} fill={C.teal} stroke={i===4?C.paper:C.teal} lineWidth={3}/>
          </Node>})}
      </Node>
      {draw([[-150,0],[300,0]],C.gold,10)}
      {rise(<Node>{card(crowded?'同じ情報が循環する':'接点の数',410,-107,645,155,C.rust)}
       {card(n===48?'異なる世界が広がる':'見えていない情報',410,120,645,155,C.gold)}</Node>)}
      {d.length?rise(txt(d[0],0,351,43,C.secondary,1470)):null}
    </Node>;
  }else if(ids(n,[24,32,44,55])){
    art=<Node>
      {rise(txt(s.heading,0,-346,63,C.paper,1430))}
      {rise(<Node>
        {card(d[0]||'世界 A',-440,-10,790,445,C.teal,'01')}
        {card(d[1]||'世界 B',440,-10,790,445,C.rust,'02')}
      </Node>)}
      {draw([[-110,240],[110,240]],C.gold,10)}
      {rise(txt(n===55?'出会わなければ、選択肢にすらならなかった':n===32?'効果は、状況によって変わる':'世界が違えば、常識も違う',0,354,47,C.gold,1470))}
    </Node>;
  }else if(ids(n,[17,26,29,33,46,49,51])){
    const main=d[0]||s.heading;
    art=<Node>
      {halo(-470,-120,690,C.rust,.10)}
      {rise(txt(String(n).padStart(2,'0')+'   /   QUESTION',0,-348,31,C.gold,700,false))}
      {rise(<Rect y={-20} width={1400} height={405} fill={C.panel} radius={13} stroke={C.line} lineWidth={2}/>)}
      {rise(txt(main,0,-32,main.length>42?61:main.length>26?69:83,C.paper,1280))}
      {d[1]?rise(txt(d[1],0,310,49,C.teal,1450)):rise(txt(s.heading,0,310,47,C.secondary,1400))}
    </Node>;
  }else{
    const main=d[0]||s.heading;
    art=<Node>
      {rise(txt(s.heading.toUpperCase(),0,-326,57,C.gold,1500))}
      <Rect x={-740} y={-9} width={9} height={358} fill={C.rust}/>
      {rise(txt(main,0,-50,main.length>34?61:main.length>20?73:91,C.paper,1420))}
      {d[1]?rise(txt(d[1],0,283,44,C.teal,1330)):null}
    </Node>;
  }
  return {node:<Node>{art}</Node>,reveals,strokes,bars,numbers};
}
