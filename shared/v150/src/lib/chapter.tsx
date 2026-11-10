// V150 — Bespoke motion design: weak ties / bridges / choice architecture
// Every visual is topic-specific. Narration and subtitles are driven by measured VOICEVOX timing.
import '@fontsource/noto-sans-jp/400.css';
import '@fontsource/noto-sans-jp/700.css';
import {all, createRef, createSignal, delay, waitFor} from '@motion-canvas/core';
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';

const SANS = 'Noto Sans JP';
const SERIF = 'Noto Serif CJK JP';
const BG = '#101115';
const PANEL = '#1B1D22';
const PAPER = '#ECE7DC';
const MUTED = '#A8A6A3';
const RED = '#B54A52';
const TEAL = '#65A6A3';
const GOLD = '#CAB17E';
const HAIR = '#383C43';
const CHAPTERS: Record<string,string> = {
  prologue:'PROLOGUE', chapter1:'CHAPTER 01', chapter2:'CHAPTER 02',
  chapter3:'CHAPTER 03', chapter4:'CHAPTER 04', epilogue:'EPILOGUE',
};

function wrapJa(value: string, chars = 19, maxLines = 4): string {
  const text = String(value || '').replace(/\n/g, '');
  if (text.length <= chars) return text;
  const out: string[] = [];
  for (let i=0;i<text.length;i+=chars) out.push(text.slice(i,i+chars));
  if (out.length > maxLines) return out.slice(0,maxLines-1).concat([out.slice(maxLines-1).join('')]).join('\n');
  return out.join('\n');
}
const is = (s:any, ids:string[]) => ids.includes(s.id);
function family(s:any): string {
  if(is(s,['01','03','30','31','52'])) return 'stats';
  if(is(s,['08','10','15','18','19','20','21','22','25','27','28','29','39','40','43','48','53','54','56','57'])) return 'network';
  if(is(s,['04','11','13','17','24','32','37','42','44'])) return 'compare';
  if(is(s,['05','14','35','45','50','55'])) return 'cards';
  if(is(s,['09','30','38','47'])) return 'list';
  return s.viz === 'flow' ? 'flow' : 'editorial';
}
type Stage = {s:any; ref:any; bits:any[]; bridges:any[]; bars:Array<{ref:any,width:number,x:number}>; counts:Array<{signal:any,target:number}>};

function makeArtwork(s:any, bits:any[], bridges:any[], bars:Array<{ref:any,width:number,x:number}>, counts:Array<{signal:any,target:number}>) {
  const d:string[] = s.display || [];
  const art = (child:any, index=0) => {
    const r=createRef<Node>(); bits.push(r);
    return <Node key={'b'+bits.length+'-'+index} ref={r} opacity={0} scale={0.91}>{child}</Node>;
  };
  const label=(text:string,x:number,y:number,color=PAPER,size=42) => (
    <Txt text={wrapJa(text,18,3)} x={x} y={y} width={710} fontFamily={SANS} fontSize={size} fontWeight={700} fill={color} textAlign={'center'}/>
  );
  const type=family(s);
  if(type==='stats' && s.id==='03'){
    const rows=[['頻繁に会う',16.7],['たまに会う',55.6],['めったに会わない',27.8]];
    return <Node>
      <Txt text={'仕事の情報を得た相手との接触頻度'} y={-315} fontSize={45} fontFamily={SERIF} fontWeight={700} fill={PAPER}/>
      {rows.map(([name,value],i)=>{
        const y=-175+i*174, w=Number(value)*19;
        const r=createRef<Rect>();bars.push({ref:r,width:w,x:-270+w/2});
        return <Node key={'stat'+i}>
          <Txt text={String(name)} x={-580} y={y} fontFamily={SANS} fontSize={40} fill={PAPER}/>
          <Rect ref={r} x={-270} y={y} width={0} height={82} radius={9} fill={i===0?MUTED:i===1?RED:TEAL}/>
          <Txt text={Number(value).toFixed(1)+'%'} x={630} y={y} fontFamily={SANS} fontSize={70} fontWeight={700} fill={i===0?MUTED:i===1?RED:TEAL}/>
        </Node>
      })}
      <Txt text={'親友以外から  83.4%'} y={366} fontFamily={SANS} fontWeight={700} fontSize={56} fill={GOLD}/>
    </Node>;
  }
  if(type==='stats'){
    const stat = s.id==='01'||s.id==='52' ? 83.4 : s.id==='31' ? 60 : 2000;
    const signal=createSignal(0); counts.push({signal,target:stat});
    const unit=s.id==='01'||s.id==='52'?'%':s.id==='31'?'万件':'万人';
    const caption=s.id==='01'?'人生を変えた情報は、親友以外から':
      s.id==='52'?'最初の数字に戻ろう':s.id==='31'?'仕事への移動を分析':'LinkedIn 2022年の大規模実験';
    return <Node>
      {art(<Txt text={caption} y={-295} fontFamily={SERIF} fontSize={49} fontWeight={700} fill={MUTED}/>)}
      <Txt text={()=>s.id==='01'||s.id==='52'?signal().toFixed(1)+unit:Math.round(signal()).toLocaleString('ja-JP')+unit}
        y={-45} fontFamily={SANS} fontSize={205} fontWeight={700} fill={s.id==='52'?GOLD:RED}/>
      <Line points={[[-595,126],[595,126]]} stroke={GOLD} lineWidth={5}/>
      {s.id==='30' ? art(<Node>
        {['5年間','約20億件のつながり','約60万件の仕事の移動'].map((x,i)=>
          <Rect key={'metric'+i} x={(i-1)*440} y={267} width={395} height={105} fill={PANEL} stroke={HAIR} lineWidth={2} radius={12}>
            <Txt text={x} fontFamily={SANS} fontSize={31} fill={PAPER}/>
          </Rect>)}
      </Node>) :
        art(<Txt text={s.id==='01'?'親密さと、新しい機会は別物だ':s.id==='52'?'「知らない世界」から届く情報':s.id==='31'?'弱いつながりの効果を検証':'2,000万人以上の利用者'} y={288} fontFamily={SERIF} fontSize={46} fill={PAPER}/>)}
    </Node>;
  }
  if(type==='network'){
    const left=-475,right=475;
    const link=createRef<Line>();bridges.push(link);
    const tealNodes=[[0,-125],[-135,-80],[128,-75],[-96,125],[110,120],[-25,180]];
    const redNodes=[[0,-115],[-140,-40],[139,-75],[-100,130],[130,135],[30,184]];
    const network=(cx:number,pts:number[][],tone:string,seed:number)=>{
      const links=pts.slice(1).map((p,i)=><Line key={'ln'+seed+'-'+i} points={[[cx+pts[0][0],pts[0][1]],[cx+p[0],p[1]]]} stroke={tone} opacity={0.47} lineWidth={5}/>);
      const dots=pts.map((p,i)=>art(<Circle x={cx+p[0]} y={p[1]} width={i===0?82:43} height={i===0?82:43} fill={tone} stroke={PAPER} lineWidth={i===0?3:0}/>,i));
      return <Node>{links}{dots}</Node>;
    };
    const secondary=s.id==='18'?'人間 = 点   /   関係 = 線':
      s.id==='20'?'細い一本の橋が、情報を運ぶ':
      s.id==='29'?'相関と因果は、同じではない':
      s.id==='39'?'情報を運ぶ / 決断を支える':
      s.id==='40'?'機会と支援は、比較できない':
      s.id==='48'?'人数ではなく、異なる世界':
      s.id==='56'?'見えない選択肢は、選べない':
      (d.length===1?d[0]:d.slice(0,2).join('   /   '));
    return <Node>
      <Txt text={s.id==='21'?'THE STRENGTH OF WEAK TIES':'NETWORK / POSSIBILITY'}
        x={0} y={-350} fontFamily={SANS} fontSize={28} letterSpacing={4} fill={GOLD}/>
      {network(left,tealNodes,TEAL,0)}
      {network(right,redNodes,RED,1)}
      <Line ref={link} points={[[-475,-125],[475,-115]]} stroke={GOLD} lineWidth={13} end={0}/>
      {art(<Circle width={60} height={60} y={-120} fill={GOLD}/>)}
      {art(<Rect x={0} y={310} width={1460} height={105} fill={PANEL} stroke={HAIR} lineWidth={2} radius={9}>
        <Txt text={wrapJa(secondary,33,2)} fontFamily={SERIF} fontSize={44} fontWeight={700} fill={PAPER}/>
      </Rect>)}
    </Node>;
  }
  if(type==='compare'){
    const parse=(v:string)=>{const k=v.indexOf('：');return k>=0?[v.slice(0,k),v.slice(k+1)]:['',v]};
    return <Node>
      {d.slice(0,2).map((txt,i)=>{
        const [head,body]=parse(txt),x=i===0?-438:438,accent=i===0?TEAL:RED;
        return art(<Node key={'col'+i}>
          <Rect x={x} y={0} width={805} height={552} fill={PANEL} stroke={accent} lineWidth={4} radius={15}/>
          <Rect x={x} y={-202} width={805} height={8} fill={accent}/>
          <Txt text={head||('視点 '+(i+1))} x={x} y={-137} fontFamily={SERIF} fontSize={53} fontWeight={700} fill={accent}/>
          <Txt text={wrapJa(body||txt,14,3)} x={x} y={47} fontFamily={SANS} fontSize={51} fill={PAPER} textAlign={'center'}/>
        </Node>,i);
      })}
      <Txt text={'≠'} y={15} fontFamily={SANS} fontWeight={700} fontSize={88} fill={GOLD}/>
    </Node>;
  }
  if(type==='cards' || type==='list' || type==='flow'){
    const n=Math.min(4,d.length);
    const top=-220,step=n<=2?240:n===3?185:150;
    const start=top + (4-n)*35;
    return <Node>
      {d.slice(0,4).map((txt,i)=>{
        const y=start+i*step;
        return art(<Node key={'item'+i}>
          <Rect x={0} y={y} width={1460} height={n===4?115:145} fill={PANEL} stroke={i%2?HAIR:TEAL} lineWidth={2} radius={11}/>
          <Rect x={-670} y={y} width={66} height={66} fill={i===n-1?RED:TEAL} radius={9}>
            <Txt text={String(i+1).padStart(2,'0')} fontFamily={SANS} fontSize={30} fill={BG} fontWeight={700}/>
          </Rect>
          <Txt text={wrapJa(txt,39,2)} x={100} y={y} width={1250} fontFamily={SERIF} fontSize={txt.length>32?38:47} fontWeight={700} fill={PAPER}/>
        </Node>,i);
      })}
    </Node>;
  }
  // High-contrast editorial compositions, with per-slide text rather than generic stock imagery.
  const first=String(d[0]||s.heading);
  const long=first.length>56;
  const chars=long?20:18;
  const size=first.length>70?57:first.length>43?66:first.length>24?78:104;
  return <Node>
    {art(<Txt text={String(s.heading||'').toUpperCase()} y={-288} fontSize={34} fontWeight={700} fontFamily={SANS} letterSpacing={2} fill={GOLD}/>)}
    {art(<Rect width={12} height={Math.min(360,first.length>34?365:215)} x={-710} y={12} fill={RED}/>)}
    {art(<Txt text={wrapJa(first,chars,5)} y={0} x={40} fontFamily={SERIF} fontSize={size} fontWeight={700} width={1430} fill={PAPER}/>)}
    {d[1]?art(<Txt text={wrapJa(d[1],29,2)} y={274} fontFamily={SANS} fontSize={40} fill={TEAL}/>):null}
  </Node>;
}

export function createChapterScene(chapter:string, data:any, timing:any){
  const slides:any[]=(data.slides||[]).filter((s:any)=>s.ch===chapter);
  const measured:any[]=(timing&&timing.slides)||[];
  return makeScene2D(function* (view) {
    view.add(<Rect width={1920} height={1080} fill={BG}/>);
    const stages:Stage[] = slides.map((s:any)=>{
      const ref=createRef<Node>(),bits:any[]=[],bridges:any[]=[],bars:any[]=[],counts:any[]=[];
      const light=s.id==='58';
      view.add(<Node ref={ref} opacity={0} position={[0,60]} scale={0.97}>
        <Rect width={1920} height={1080} fill={light?'#17181B':BG}/>
        <Rect width={1800} height={2} y={-430} fill={HAIR}/>
        <Rect width={1800} height={2} y={378} fill={HAIR}/>
        <Txt text={CHAPTERS[chapter]||chapter.toUpperCase()} x={-725} y={-478} width={370} textAlign={'left'}
          fontSize={30} fontFamily={SANS} fill={GOLD} letterSpacing={3}/>
        <Txt text={s.heading||''} x={-50} y={-478} width={900} textAlign={'center'} fontSize={30} fontFamily={SERIF} fill={MUTED}/>
        <Txt text={s.id+' / 58'} x={735} y={-478} width={300} textAlign={'right'} fontSize={30} fontFamily={SANS} fill={MUTED}/>
        {makeArtwork(s,bits,bridges,bars,counts)}
        <Rect width={1800 * Number(s.id)/58} height={5} x={-900 + 1800 * Number(s.id)/116} y={-429} fill={RED}/>
      </Node>);
      return {s,ref,bits,bridges,bars,counts};
    });
    const subLayer=createRef<Node>(),subTxt=createRef<Txt>();
    view.add(<Node ref={subLayer} opacity={0}>
      <Rect y={443} height={138} width={1720} radius={10} fill={'#050505'} opacity={0.88}/>
      <Rect y={375} height={4} width={340} fill={GOLD}/>
      <Txt ref={subTxt} y={444} width={1590} textAlign={'center'} fontSize={37} fontWeight={700} fontFamily={SANS} fill={PAPER}/>
    </Node>);
    for(let i=0;i<stages.length;i++){
      const stage=stages[i], s=stage.s, t=measured[i]||{duration:5,subs:[]};
      const duration=Math.max(1,t.duration||5);
      const layer=stage.ref();
      const enter= (function*(){
        const direction = i%4===0?-60:i%4===1?60:i%4===2?-38:38;
        layer.position([direction,i%2?25:-25]);
        layer.scale(i%3===0?0.95:1.025);
        yield* all(layer.opacity(1,0.48),layer.position([0,0],0.58),layer.scale(1,0.66));
        if(stage.bits.length) yield* all(...stage.bits.map((r:any,k:number)=>delay(k*0.105,all(r().opacity(1,0.47),r().scale(1,0.58)))));
        if(stage.bridges.length) yield* all(...stage.bridges.map((r:any,k:number)=>delay(k*0.18,r().end(1,1.10))));
        if(stage.bars.length) yield* all(...stage.bars.map((b:any,k:number)=>delay(k*0.22,all(b.ref().width(b.width,0.9),b.ref().x(b.x,0.9)))));
        if(stage.counts.length) yield* all(...stage.counts.map((c:any)=>c.signal(c.target,1.35)));
      })();
      const captions=(function*(){
        let cursor=0;
        for(const sub of (t.subs||[])){
          const start=Math.max(0,sub.start||0), w=start-cursor;
          if(w>0)yield* waitFor(w);
          subTxt().text(wrapJa(String(sub.text||''),38,3));
          subLayer().opacity(1);
          const d=Math.max(0,sub.duration||0);
          if(d>0)yield* waitFor(d);
          cursor=start+d;
        }
        if(duration>cursor)yield* waitFor(duration-cursor);
        subTxt().text('');
        subLayer().opacity(0);
      })();
      const exit=(function*(){
        yield* waitFor(Math.max(0,duration-0.47));
        yield* all(layer.opacity(0,0.45),layer.scale(1.015,0.45));
      })();
      yield* all(enter,captions,exit);
    }
  });
}
