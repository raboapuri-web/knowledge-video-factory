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
      {rise(txt('GRANOVETTER  /  1973',0,371,29,C.gold,800,false))}
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
        const y=-165+i*170,w=v*14;
        const r=createRef<Rect>();bars.push({ref:r,w,x:-130+w/2});
        return <Node key={'b'+i}>
          {txt(labels[i],-595,y,38,C.secondary,480,false)}
          <Rect x={-130} y={y} width={920} height={85} radius={4} fill={C.panel} opacity={0.8}/>
          <Rect ref={r} x={-130} y={y} width={0} height={85} radius={4} fill={i===0?C.dim:i===1?C.rust:C.teal}/>
          {txt(v.toFixed(1)+'%',600,y,72,i===0?C.paper:i===1?C.rust:C.teal,380,false)}
        </Node>;
      })}
      {rise(txt('頻繁には会わない相手  83.4%',0,370,47,C.gold,1400,false))}
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
