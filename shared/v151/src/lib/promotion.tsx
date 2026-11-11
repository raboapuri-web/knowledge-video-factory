// V151 CINEMATIC REBUILD — original promotion-lottery motion direction.
// No other video's slide engine is imported. Every shot uses authored art-direction.json.
// Topic-specific diagrams are conceptual, not fabricated empirical charts.
import '@fontsource/noto-sans-jp/400.css';
import '@fontsource/noto-sans-jp/700.css';
import {all,createRef,createSignal,delay,waitFor} from '@motion-canvas/core';
import {Circle,Line,Node,Rect,Txt,makeScene2D} from '@motion-canvas/2d';

const SERIF='Noto Serif CJK JP';
const SANS='Noto Sans JP';
const C={bg:'#080F1B',paper:'#F1ECE2',muted:'#ABB7BA',red:'#BE4551',gold:'#D6B77A',teal:'#6AA6A2',navy:'#162436',line:'#31424D',ink:'#0D1724'};
const CHAPTERS:Record<string,string>={prologue:'PROLOGUE',chapter1:'01 / THE PETER PRINCIPLE',chapter2:'02 / THE LOTTERY EXPERIMENT',chapter3:'03 / THE INCENTIVE',chapter4:'04 / THE ALTERNATIVE',epilogue:'EPILOGUE'};
type Wires=Array<any>;
type Bars=Array<{ref:any,w:number,x:number}>;
type Counters=Array<{signal:any,n:number}>;
type Stage={s:any,ref:any,bits:any[],wires:Wires,bars:Bars,counters:Counters};
function wrap(v:string,n=18,limit=3):string{
  const str=String(v||'').replace(/\n/g,'');
  const lines=[];for(let i=0;i<str.length;i+=n)lines.push(str.slice(i,i+n));
  return lines.slice(0,limit).join('\n');
}
function label(t:string,x:number,y:number,sz=44,col=C.paper,w=900){
  return <Txt text={wrap(t,Math.max(8,Math.floor(w/(sz*.98))),3)} x={x} y={y} width={w} fontFamily={SANS} fontSize={sz} fill={col} fontWeight={700} textAlign={'center'}/>;
}
function editorial(t:string,x:number,y:number,sz=73,col=C.paper,w=1300){
  return <Txt text={wrap(t,Math.max(8,Math.floor(w/(sz*.99))),3)} x={x} y={y} width={w} fontFamily={SERIF} fontSize={sz} fill={col} fontWeight={700}/>;
}
function figure(x:number,y:number,scale:number,color:string){
  return <Node x={x} y={y} scale={scale}>
    <Circle y={-75} width={70} height={70} fill={color}/>
    <Rect y={42} width={103} height={150} fill={color} radius={19}/>
    <Line points={[[-38,118],[-53,190]]} stroke={color} lineWidth={25} lineCap={'round'}/>
    <Line points={[[38,118],[53,190]]} stroke={color} lineWidth={25} lineCap={'round'}/>
  </Node>;
}
function artwork(s:any,bits:any[],wires:Wires,bars:Bars,counters:Counters){
  const reveal=(child:any)=>{
    const ref=createRef<Node>();bits.push(ref);
    return <Node ref={ref} opacity={0} scale={0.96}>{child}</Node>;
  };
  const wire=(points:[number,number][],tone=C.gold,width=8)=>{
    const ref=createRef<Line>();wires.push(ref);
    return <Line ref={ref} points={points} stroke={tone} lineWidth={width} lineCap={'round'} end={0}/>;
  };
  const block=(x:number,y:number,w:number,h:number,color=C.navy)=>(
    <Rect x={x} y={y} width={w} height={h} fill={color} radius={12}/>
  );
  const mode=String(s.kind||'hero');
  const a=String(s.a||''),b=String(s.b||''),c=String(s.c||'');
  const h=String(s.title||'');
  if(mode==='hero' || mode==='final'){
    const big=(a.length>11?87:a.length>7?110:160);
    return <Node>
      {reveal(<Rect x={-728} y={-14} width={11} height={390} fill={mode==='final'?C.gold:C.red}/>)}
      {reveal(<Txt text={a} y={-103} x={20} width={1430} fontFamily={SERIF} fontWeight={700} fontSize={big} fill={mode==='final'?C.gold:C.paper}/>)}
      {reveal(<Line points={[[-630,86],[670,86]]} stroke={C.gold} lineWidth={4}/>)}
      {reveal(editorial(b,15,202,b.length>13?50:70,C.paper,1440))}
      {reveal(label(c,0,337,32,C.muted,1320))}
    </Node>;
  }
  if(mode==='lottery'){
    return <Node>
      {reveal(<Node>
        <Rect x={-410} y={47} width={590} height={330} fill={'#14243A'} stroke={C.gold} lineWidth={9} radius={20}/>
        <Rect x={-410} y={-136} width={465} height={13} fill={C.gold}/>
        <Rect x={-410} y={55} width={510} height={247} fill={C.ink} radius={12}/>
        {Array.from({length:14},(_,i)=>{
          const dx=-626+(i%5)*103,dy=-18+Math.floor(i/5)*75;
          return <Rect key={'ticket'+i} x={dx} y={dy} width={67} height={34} rotation={(i%3-1)*13} fill={i%4===0?C.gold:C.paper} opacity={0.77} radius={3}/>;
        })}
      </Node>)}
      {reveal(<Node>
        <Rect x={430} y={-24} width={600} height={280} fill={C.paper} radius={11} rotation={-7}/>
        <Txt text={wrap(a,10,2)} x={435} y={-18} rotation={-7} width={530} fontFamily={SERIF} fontSize={48} fontWeight={700} fill={C.ink}/>
      </Node>)}
      {reveal(label(b,440,255,45,C.gold,780))}
      {reveal(label(c,10,342,31,C.muted,1430))}
    </Node>;
  }
  if(mode==='hierarchy'||mode==='ladder'||mode==='simulation'){
    const names=mode==='hierarchy'?['現場','主任','課長','部長']:mode==='simulation'?['階層 1','階層 2','階層 3','階層 4','階層 5','階層 6']:['担当者','主任','課長','部長'];
    const len=names.length;
    return <Node>
      {names.map((nm,i)=>{
        const y=286-i*(len===6?94:135);
        const w=390-i*(len===6?27:45);
        return reveal(<Node key={'level'+i}>
          {block(-260,y,w,72,i===len-2?C.red:C.navy)}
          <Txt text={nm} x={-260} y={y} fontFamily={SANS} fontWeight={700} fontSize={34} fill={C.paper}/>
        </Node>);
      })}
      {wire([[40,269],[40,-282]],C.gold,8)}
      {reveal(editorial(a,465,-170,68,C.paper,710))}
      {reveal(label(b,465,28,51,C.gold,690))}
      {reveal(label(c,460,231,37,C.teal,720))}
    </Node>;
  }
  if(mode==='compare'||mode==='versus'||mode==='matrix'||mode==='dilemma'){
    const danger=mode==='dilemma'||mode==='matrix';
    return <Node>
      {reveal(<Node>
        <Rect x={-433} y={-10} width={780} height={465} fill={C.navy} stroke={C.teal} lineWidth={4} radius={20}/>
        <Rect x={-433} y={-236} width={780} height={7} fill={C.teal}/>
        {editorial(a,-433,-25,a.length>11?52:70,C.paper,710)}
      </Node>)}
      {reveal(<Txt text={danger?'⇄':'≠'} fontSize={95} fontFamily={SANS} fill={C.gold} fontWeight={700} y={-8}/>)}
      {reveal(<Node>
        <Rect x={433} y={-10} width={780} height={465} fill={C.navy} stroke={C.red} lineWidth={4} radius={20}/>
        <Rect x={433} y={-236} width={780} height={7} fill={C.red}/>
        {editorial(b,433,-25,b.length>11?52:70,C.paper,710)}
      </Node>)}
      {reveal(label(c,0,331,38,C.gold,1600))}
    </Node>;
  }
  if(mode==='research'){
    return <Node>
      {['131','39,000'].map((num,i)=>{
        const x=i===0?-430:430;
        const target=i===0?131:39000;
        const signal=createSignal(0);counters.push({signal,n:target});
        return <Node key={'metric'+i}>
          {reveal(<Rect x={x} y={-15} width={780} height={515} fill={C.navy} stroke={i?C.teal:C.red} lineWidth={3} radius={16}/>)}
          <Txt x={x} y={-72} text={()=>Math.round(signal()).toLocaleString('ja-JP')} fontFamily={SANS} fontSize={i?128:178} fontWeight={700} fill={i?C.gold:C.paper}/>
          {reveal(label(i===0?'アメリカの企業':'営業社員・約',x,127,42,C.muted,660))}
        </Node>;
      })}
      {reveal(label(c,0,336,38,C.gold,1460))}
    </Node>;
  }
  if(mode==='bars'||mode==='scatter'){
    const values=mode==='scatter'?[540,740,440]:[1220,855,610];
    const names=mode==='scatter'?['現在の成績','次の役職','成果の違い']:[a,b,c];
    return <Node>
      {names.map((name,i)=>{
        const y=-198+i*171,ref=createRef<Rect>(),w=values[i],startX=-630;
        bars.push({ref,w,x:startX+w/2});
        return <Node key={'bar'+i}>
          {reveal(label(name,-505,y-59,34,i===0?C.gold:C.paper,680))}
          <Rect ref={ref} x={startX} y={y+18} width={0} height={58} fill={i===0?C.red:i===1?C.teal:C.gold} radius={9}/>
        </Node>;
      })}
      {reveal(label(mode==='scatter'?'概念図｜昇進前後の成績は異なる':h,400,305,37,C.muted,920))}
      {mode==='scatter'?reveal(label('実際の分析データではない',570,366,25,C.gold,700)):null}
    </Node>;
  }
  if(mode==='tournament'||mode==='reward'||mode==='game'){
    const n=mode==='tournament'?10:mode==='game'?2:3;
    return <Node>
      {Array.from({length:n},(_,i)=>{
        const x=n===10?-610+i*137:n===2?-365+i*730:-405+i*405;
        const tone=i===0?C.red:i===n-1?C.gold:C.teal;
        return reveal(<Node key={'candidate'+i}>
          <Circle x={x} y={-95} width={n===10?75:115} height={n===10?75:115} fill={tone}/>
          <Rect x={x} y={37} width={n===10?83:126} height={n===10?145:175} fill={tone} radius={14}/>
          {n===10?label(String(i+1),x,33,27,C.ink,65):null}
        </Node>);
      })}
      {mode==='tournament'?wire([[0,170],[0,247]],C.gold,6):null}
      {reveal(<Node>
        <Rect y={278} width={1510} height={126} fill={C.navy} radius={16}/>
        {label(a+'   /   '+b,0,278,47,C.paper,1450)}
      </Node>)}
      {reveal(label(c,0,-313,34,C.gold,1400))}
    </Node>;
  }
  if(mode==='balance'){
    return <Node>
      {wire([[0,-252],[0,210]],C.gold,10)}
      {wire([[-625,-18],[625,-18]],C.gold,11)}
      {wire([[-470,-18],[-470,150]],C.teal,5)}
      {wire([[470,-18],[470,150]],C.red,5)}
      {reveal(<Node>
        <Rect x={-470} y={175} width={700} height={182} fill={C.navy} stroke={C.teal} lineWidth={3} radius={17}/>
        {label(a,-470,175,48,C.paper,650)}
      </Node>)}
      {reveal(<Node>
        <Rect x={470} y={175} width={700} height={182} fill={C.navy} stroke={C.red} lineWidth={3} radius={17}/>
        {label(b,470,175,48,C.paper,650)}
      </Node>)}
      {reveal(label(c,0,-315,42,C.gold,1400))}
    </Node>;
  }
  if(mode==='fork'||mode==='dualcareer'||mode==='choice'||mode==='flow'){
    const items=mode==='choice'?[a,b,c]:[a,b];
    return <Node>
      {wire([[0,-238],[0,-114]],C.gold,8)}
      {items.map((name,i)=>{
        const x=(i-(items.length-1)/2)*(items.length===3?550:760),y=85;
        return <Node key={'choice'+i}>
          {wire([[0,-114],[x,-17],[x,22]],i===0?C.teal:i===1?C.red:C.gold,6)}
          {reveal(<Node>
            <Rect x={x} y={y} width={items.length===3?488:675} height={245} fill={C.navy} stroke={i===0?C.teal:i===1?C.red:C.gold} lineWidth={3} radius={16}/>
            {editorial(name,x,y,items.length===3?49:62,C.paper,items.length===3?448:615)}
          </Node>)}
        </Node>;
      })}
      {reveal(label(mode==='choice'?'三つの昇進方法':c,0,331,40,C.gold,1490))}
    </Node>;
  }
  if(mode==='ruler'||mode==='exam'||mode==='race'){
    return <Node>
      {reveal(<Node>
        <Rect width={1270} height={182} x={0} y={-210} fill={C.navy} radius={14}/>
        {editorial(a,0,-210,69,C.paper,1160)}
      </Node>)}
      {wire([[-585,-56],[580,-56]],C.gold,13)}
      {Array.from({length:16},(_,i)=><Rect key={'tick'+i} x={-570+i*76} y={-18} width={5} height={i%5===0?88:49} fill={i%5===0?C.red:C.muted}/>)}
      {reveal(<Node>
        <Rect width={1270} height={182} x={0} y={165} fill={C.navy} stroke={C.red} lineWidth={3} radius={14}/>
        {editorial(b,0,165,62,C.paper,1160)}
      </Node>)}
      {reveal(label(c,0,341,37,C.gold,1420))}
    </Node>;
  }
  if(mode==='kitchen'){
    return <Node>
      {reveal(<Node>
        <Rect x={-450} y={40} width={730} height={510} fill={C.navy} radius={20}/>
        <Rect x={-450} y={170} width={470} height={55} fill={C.gold}/>
        <Circle x={-450} y={-113} width={156} height={156} fill={C.paper}/>
        {figure(-450,58,.62,C.paper)}
      </Node>)}
      {wire([[-25,30],[145,30]],C.red,12)}
      {reveal(<Node>
        <Rect x={495} y={40} width={720} height={510} fill={C.navy} radius={20}/>
        <Rect x={495} y={-55} width={460} height={18} fill={C.gold}/>
        <Rect x={495} y={24} width={450} height={310} fill={C.ink}/>
      </Node>)}
      {reveal(label(a,-445,301,43,C.teal,690))}
      {reveal(label(b,480,301,43,C.red,690))}
    </Node>;
  }
  // Purpose-built editorial fallback (should be unused by the 64 authored scenes).
  return <Node>{reveal(editorial(a,0,-120,83,C.paper,1490))}{reveal(editorial(b,0,150,53,C.gold,1200))}</Node>;
}
export function createChapterScene(chapter:string,data:any,timing:any){
  const slides:any[]=(data.slides||[]).filter((s:any)=>s.ch===chapter);
  const measured:any[]=(timing&&timing.slides)||[];
  if(slides.some((s:any)=>!s.kind||!s.title))throw Error('Missing authored cinematic treatment');
  if(slides.length!==measured.length)throw Error('Measured timing and art-direction count mismatch');
  return makeScene2D(function* (view){
    view.add(<Rect width={1920} height={1080} fill={C.bg}/>);
    const stages:Stage[]=slides.map((s:any)=>{
      const ref=createRef<Node>(),bits:any[]=[],wires:any[]=[],bars:any[]=[],counters:any[]=[];
      const seq=Number(s.id);
      view.add(<Node ref={ref} opacity={0} position={[0,35]} scale={0.99}>
        <Rect width={1920} height={1080} fill={C.bg}/>
        {Array.from({length:13},(_,i)=><Line key={'grid'+i} points={[[(-6+i)*160,-435],[(-6+i)*160,380]]} stroke={C.line} opacity={0.13} lineWidth={2}/>)}
        <Line points={[[-905,-425],[905,-425]]} stroke={C.line} lineWidth={3}/>
        <Line points={[[-905,382],[905,382]]} stroke={C.line} lineWidth={3}/>
        <Txt text={CHAPTERS[chapter]||chapter} x={-690} y={-478} width={435} textAlign={'left'} fontFamily={SANS} letterSpacing={2} fill={C.gold} fontSize={27}/>
        <Txt text={s.title} x={-30} y={-477} width={930} fontFamily={SERIF} fill={C.muted} fontSize={30}/>
        <Txt text={s.id+' / 64'} x={762} y={-477} width={200} fontFamily={SANS} fill={C.muted} fontSize={28}/>
        <Rect width={seq*27.75} height={5} x={-905+seq*13.875} y={-425} fill={C.red}/>
        {artwork(s,bits,wires,bars,counters)}
        <Txt text={'考える夜   ·   KANGAERU YORU'} x={-680} y={367} width={430} textAlign={'left'} fontFamily={SANS} fill={C.muted} opacity={0.5} fontSize={21}/>
      </Node>);
      return {s,ref,bits,wires,bars,counters};
    });
    const subtitle=createRef<Node>(),subtitleTxt=createRef<Txt>();
    view.add(<Node ref={subtitle} opacity={0}>
      <Rect x={0} y={448} width={1650} height={132} radius={13} fill={'#060B12'} opacity={0.89}/>
      <Rect x={0} y={379} width={230} height={5} fill={C.gold}/>
      <Txt ref={subtitleTxt} x={0} y={447} width={1540} textAlign={'center'} fontFamily={SANS} fontSize={37} fill={C.paper} fontWeight={700}/>
    </Node>);
    for(let i=0;i<stages.length;i++){
      const st=stages[i],t=measured[i]||{duration:5,subs:[]};
      const dur=Math.max(1,Number(t.duration)||5);
      const layer=st.ref();
      const entrance=(function*(){
        const direction=[[-68,0],[63,-13],[0,55],[-25,-42],[40,24]][Number(st.s.id)%5];
        layer.position(direction);
        layer.scale(Number(st.s.id)%3===0?0.958:1.018);
        yield* all(layer.opacity(1,.60),layer.position([0,0],.77),layer.scale(1,.87));
        if(st.bits.length)yield* all(...st.bits.map((r:any,k:number)=>delay(k*.17,all(r().opacity(1,.45),r().scale(1,.68)))));
        if(st.wires.length)yield* all(...st.wires.map((r:any,k:number)=>delay(k*.14,r().end(1,.90))));
        if(st.bars.length)yield* all(...st.bars.map((bar:any,k:number)=>delay(k*.29,all(bar.ref().width(bar.w,1.05),bar.ref().x(bar.x,1.05)))));
        if(st.counters.length)yield* all(...st.counters.map((ct:any,k:number)=>delay(k*.22,ct.signal(ct.n,1.55))));
        // Slow, restrained camera drift; the graphic-specific reveal above is the primary effect.
        if(dur>5)yield* layer.scale(1.024,Math.max(1,dur-3));
      })();
      const speech=(function*(){
        let cursor=0;
        for(const sub of (t.subs||[])){
          const start=Math.max(0,Number(sub.start)||0),gap=start-cursor;
          if(gap>0)yield* waitFor(gap);
          subtitleTxt().text(wrap(String(sub.text||''),36,3));
          subtitle().opacity(1);
          const length=Math.max(0,Number(sub.duration)||0);
          if(length)yield* waitFor(length);
          cursor=start+length;
        }
        if(dur>cursor)yield* waitFor(dur-cursor);
        subtitleTxt().text('');
        subtitle().opacity(0);
      })();
      const outgoing=(function*(){
        yield* waitFor(Math.max(.2,dur-.54));
        yield* all(layer.opacity(0,.48),layer.scale(1.012,.48));
      })();
      yield* all(entrance,speech,outgoing);
    }
  });
}
