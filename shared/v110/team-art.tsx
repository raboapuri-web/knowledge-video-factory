import React from 'react';
import {R,L,P,Ring,q,lerp} from './primitives';

export const K={paper:'#f2ecdf',ink:'#17262f',gold:'#c8a463',red:'#ad5c58',teal:'#729b95',blue:'#64859b',green:'#6e9478'};
export const TXT=({x,y,t,s=36,c=K.paper,a='middle',o=1}:{x:number;y:number;t:string;s?:number;c?:string;a?:'start'|'middle'|'end';o?:number})=><text x={x} y={y} textAnchor={a} fontFamily="Noto Sans JP,sans-serif" fontWeight={760} fontSize={s} fill={c} opacity={o}>{t}</text>;
export const ease=(p:number)=>{const x=q(p);return x*x*(3-2*x)};

const groups:Record<string,string[]>={
 people:'sasaki tanaka client team researcher'.split(/\s+/),
 docs:'proposal estimate email handbook role-card schedule mistake-sheet price-card'.split(/\s+/),
 charts:'calendar-loop ownership-boundary delegation-bridge dependence-loop slack-storm bottleneck-gate knowledge-network central-node cross-training safe-zone time-exchange future-capacity vacation-map shared-leadership hero-system'.split(/\s+/),
 devices:'phone laptop slack-screen'.split(/\s+/),
 events:'client-call mouse-grab handoff presentation sick-day train-reply vacation return-office'.split(/\s+/),
 concepts:'control-web single-point-failure answer-drop autonomy uncertainty responsibility-control wait-hand decision-rights quality-shield'.split(/\s+/)
};
const membership=new Map(Object.entries(groups).flatMap(([g,a])=>a.map(k=>[k,g])));
export const categoryFor=(k:string)=>{const g=membership.get(k);if(!g)throw Error('V110 unsupported object '+k);return g};

const Doc=({kind,p}:{kind:string;p:number})=>{const e=ease(p),bad=kind==='mistake-sheet';const title:Record<string,string>={proposal:'企画書',estimate:'見積書',email:'顧客メール',handbook:'判断基準','role-card':'役割',schedule:'予定表','mistake-sheet':'金額ミス','price-card':'5%'};return <g>
<R x={-280} y={-330} w={560} h={660} rx={22} c="#ddd4c1" stroke="#665f55" sw={8}/>
<TXT x={0} y={-255} t={title[kind]??kind} s={36} c={K.ink}/>
{[0,1,2,3,4,5].map(i=><R key={i} x={-215} y={-175+i*72} w={325+((i*53)%105)} h={14} c={bad&&i===2?K.red:'#777169'} o={.76}/>)}
{bad?<><Ring x={80} y={-30} p={p} r={105} c={K.red}/><TXT x={80} y={-15} t="×" s={76} c={K.red}/></>:null}
{kind==='handbook'&&['自分で決める','相談する','上げる'].map((t,i)=><g key={t}><R x={-205} y={80+i*75} w={34} h={34} c={i<Math.floor(e*4)?K.green:'#a89e8f'}/><TXT x={15} y={107+i*75} t={t} s={22} c={K.ink}/></g>)}
{kind==='price-card'?<TXT x={0} y={60} t="5%" s={120} c={K.red}/>:null}
</g>};

const Chart=({kind,p}:{kind:string;p:number})=>{const e=ease(p);
if(kind==='calendar-loop')return <g>{['今月','翌月','翌月','半年後'].map((t,i)=><g key={t+i} transform={'translate('+(-300+i*200)+' 0)'}><R x={-75} y={-160} w={150} h={190} rx={18} c="#d9d0bd"/><TXT x={0} y={-105} t={t} s={22} c={K.ink}/><L x={-30} y={-20} X={35} Y={45} c={i<3?K.red:K.gold} sw={9} p={e}/></g>)}</g>;
if(kind==='ownership-boundary')return <g><circle r={235} fill="#293c44" stroke={K.gold} strokeWidth="10"/>{['顧客A','資料','判断','知識'].map((t,i)=>{const a=-Math.PI/2+i*Math.PI/2,x=Math.cos(a)*155,y=Math.sin(a)*155;return <g key={t}><circle cx={x} cy={y} r={57} fill={i%2?K.teal:K.red}/><TXT x={x} y={y+7} t={t} s={20}/></g>})}<TXT x={0} y={18} t="自分の領域" s={30} c={K.gold}/></g>;
if(kind==='delegation-bridge')return <g><circle cx="-270" cy="0" r="90" fill={K.red}/><circle cx="270" cy="0" r="90" fill={K.teal}/><L x={-175} y={0} X={175} Y={0} c={K.gold} sw={24} p={e}/><TXT x={-270} y={12} t="上司" s={28}/><TXT x={270} y={12} t="部下" s={28}/><TXT x={0} y={-45} t="判断権" s={28} c={K.gold}/></g>;
if(kind==='dependence-loop')return <g>{['任せない','育たない','任せられない'].map((t,i)=>{const a=-Math.PI/2+i*Math.PI*2/3,x=Math.cos(a)*245,y=Math.sin(a)*215;return <g key={t}><circle cx={x} cy={y} r={90} fill={i===2?K.red:K.teal}/><TXT x={x} y={y+8} t={t} s={22}/></g>})}<path d="M0 -125 Q220 -80 150 125 Q0 260 -150 125 Q-220 -80 0 -125" fill="none" stroke={K.gold} strokeWidth="11" strokeDasharray="22 15"/></g>;
if(kind==='slack-storm')return <g>{Array.from({length:9},(_,i)=>{const x=-330+(i%3)*320,y=-190+Math.floor(i/3)*170;return <g key={i} opacity={q((e-i/12)*1.8)}><R x={x} y={y} w={230} h={100} rx={18} c={i%2?'#3e5964':'#604b52'}/><TXT x={x+115} y={y+58} t={['確認お願いします','承認お願いします','判断お願いします'][i%3]} s={18}/></g>})}</g>;
if(kind==='bottleneck-gate')return <g>{[-2,-1,0,1,2].map(i=><g key={i}><L x={i*155} y={-260} X={i*75} Y={-20} c={K.paper} sw={8} p={e}/><circle cx={i*155} cy={-280} r={28} fill={K.teal}/></g>)}<R x={-120} y={-30} w={240} h={150} rx={20} c="#6e5c53"/><TXT x={0} y={58} t="佐々木" s={30}/>{[-2,-1,0,1,2].map(i=><circle key={'q'+i} cx={i*78} cy={210} r={24} fill={i%2?K.red:K.gold}/>)}</g>;
if(kind==='knowledge-network'||kind==='shared-leadership')return <g>{['顧客','数字','技術','価格','履歴','判断'].map((t,i)=>{const a=-Math.PI/2+i*Math.PI/3,x=Math.cos(a)*280,y=Math.sin(a)*235;return <g key={t}><L x={0} y={0} X={x} Y={y} c={K.gold} sw={6} p={e}/><circle cx={x} cy={y} r={64} fill={i%2?K.teal:K.blue}/><TXT x={x} y={y+7} t={kind==='shared-leadership'?'人':t} s={22}/></g>})}<circle r={78} fill="#354850"/><TXT x={0} y={10} t={kind==='shared-leadership'?'共有':'誰が知る？'} s={24}/></g>;
if(kind==='central-node')return <g>{[-2,-1,0,1,2].map(i=>{const x=i*160,y=-230+Math.abs(i)*55;return <g key={i}><L x={x} y={y} X={0} Y={100} c={K.red} sw={8} p={e}/><circle cx={x} cy={y} r={54} fill={K.teal}/></g>})}<circle cx={0} cy={120} r={120+80*e} fill="#6c4c52"/><TXT x={0} y={130} t="佐々木" s={30}/></g>;
if(kind==='cross-training')return <g>{['顧客','見積','障害','例外'].map((t,i)=><g key={t} transform={'translate('+(-330+i*220)+' 0)'}><R x={-75} y={-160} w={150} h={210} rx={18} c={i%2?K.teal:K.blue}/><TXT x={0} y={-55} t={t} s={24}/><L x={0} y={70} X={((i%2)?-1:1)*100} Y={200} c={K.gold} sw={7} p={e}/></g>)}</g>;
if(kind==='safe-zone')return <g>{[['自分で決める',K.green],['相談',K.gold],['上げる',K.red]].map(([t,c],i)=><g key={String(t)}><R x={-390+i*270} y={-180} w={240} h={360} rx={22} c={String(c)} o={.8}/><TXT x={-270+i*270} y={15} t={String(t)} s={24}/></g>)}</g>;
if(kind==='time-exchange')return <g>{[['自分でやる','1h',K.red],['教える','2h',K.gold],['任せる','3h',K.teal]].map(([t,n,c],i)=><g key={String(t)} transform={'translate('+(-310+i*310)+' 0)'}><circle r={100} fill={String(c)}/><TXT x={0} y={-8} t={String(n)} s={44}/><TXT x={0} y={150} t={String(t)} s={25}/></g>)}</g>;
if(kind==='future-capacity')return <g><L x={-340} y={220} X={350} Y={220} c={K.paper} sw={8}/><L x={-340} y={220} X={-340} Y={-230} c={K.paper} sw={8}/><path d="M-300 150 Q-80 140 80 30 T320 -190" fill="none" stroke={K.teal} strokeWidth="14" strokeDasharray={900*e+' 900'}/><path d="M-300 80 Q-50 90 320 70" fill="none" stroke={K.red} strokeWidth="12" strokeDasharray={900*e+' 900'}/><TXT x={160} y={-135} t="未来の能力" s={28} c={K.teal}/></g>;
if(kind==='vacation-map')return <g>{['顧客A 田中','例外 山本','障害 鈴木'].map((t,i)=><g key={t}><R x={-360+i*260} y={-100+i*40} w={230} h={170} rx={20} c={i%2?K.teal:K.blue}/><TXT x={-245+i*260} y={-5+i*40} t={t} s={22}/></g>)}</g>;
if(kind==='hero-system')return <g><circle cx="-330" cy="0" r="110" fill={K.red}/><TXT x={-330} y={10} t="1人" s={30}/><TXT x={0} y={10} t="→" s={70} c={K.gold}/>{Array.from({length:6},(_,i)=>{const a=-Math.PI/2+i*Math.PI/3,x=330+Math.cos(a)*210,y=Math.sin(a)*180;return <circle key={i} cx={x} cy={y} r={55} fill={i%2?K.teal:K.blue}/>})}</g>;
return <g><Ring x={0} y={0} p={p} r={240} c={K.gold}/><TXT x={0} y={18} t={kind.replaceAll('-','・')} s={27}/></g>;
};

const Concept=({kind,p}:{kind:string;p:number})=>{const e=ease(p);
if(kind==='control-web'||kind==='single-point-failure')return <g><circle r={kind==='control-web'?105:145} fill={K.red}/><TXT x={0} y={10} t="自分" s={30}/>{Array.from({length:7},(_,i)=>{const a=-Math.PI/2+i*Math.PI*2/7,x=Math.cos(a)*300,y=Math.sin(a)*245;return <g key={i}><L x={0} y={0} X={x} Y={y} c={kind==='control-web'?K.gold:K.paper} sw={7} p={e}/><circle cx={x} cy={y} r={42} fill={K.teal}/></g>})}{kind==='single-point-failure'?<P d="M-25 -95 L20 -30 -18 20 28 85" c="none" stroke={K.gold} sw={14}/>:null}</g>;
if(kind==='answer-drop')return <g><R x={-190} y={-285} w={380} h={130} rx={18} c={K.gold}/><TXT x={0} y={-205} t="正解" s={34} c={K.ink}/><L x={0} y={-145} X={0} Y={20} c={K.paper} sw={12} p={e}/><path d="M-280 220 Q-130 40 0 200 Q130 40 280 220" fill="none" stroke="#51656e" strokeWidth="10" strokeDasharray="14 15"/></g>;
if(kind==='responsibility-control')return <g><R x={-360} y={-170} w={300} h={340} rx={22} c="#536b72"/><R x={60} y={-170} w={300} h={340} rx={22} c="#785c5d"/><TXT x={-210} y={0} t="責任" s={52}/><TXT x={210} y={0} t="支配" s={52}/><TXT x={0} y={22} t="≠" s={84} c={K.gold}/></g>;
if(kind==='wait-hand')return <g><circle cx="-170" cy="0" r={92} fill={K.red}/><L x={-60} y={0} X={230} Y={0} c={K.gold} sw={18} p={e}/><R x={220} y={-115} w={155} h={230} rx={50} c="#c3a27d"/><TXT x={-170} y={15} t="待つ" s={30}/></g>;
if(kind==='decision-rights')return <g>{['作業','判断','責任'].map((t,i)=><g key={t}><R x={-360+i*270} y={-120} w={230} h={240} rx={20} c={i===0?'#566a74':i===1?K.gold:K.red}/><TXT x={-245+i*270} y={10} t={t} s={36} c={i===1?K.ink:K.paper}/></g>)}</g>;
if(kind==='quality-shield')return <g><P d="M0 -270 L230 -160 190 100 0 280 -190 100 -230 -160Z" c="#33484f" stroke={K.gold} sw={12}/><TXT x={0} y={5} t="品質" s={54}/></g>;
return <g><Ring x={0} y={0} p={p} r={240} c={K.gold}/><TXT x={0} y={15} t={kind.replaceAll('-','・')} s={28}/></g>;
};

export const TeamSubject=({kind,p}:{kind:string;p:number})=>{const g=categoryFor(kind);
if(g==='docs')return <Doc kind={kind} p={p}/>;
if(g==='charts')return <Chart kind={kind} p={p}/>;
if(g==='concepts')return <Concept kind={kind} p={p}/>;
if(g==='devices')return kind==='phone'?<g><R x={-120} y={-250} w={240} h={500} rx={38} c="#192831" stroke="#91a0a4" sw={9}/><circle cx={0} cy={190} r={18} fill={K.gold}/></g>:<g><R x={-270} y={-185} w={540} h={330} rx={18} c="#1b2d36" stroke="#87989b" sw={9}/><R x={-220} y={-125} w={440} h={220} c="#536f78" o={.42}/></g>;
if(g==='events')return <g><Ring x={0} y={0} p={p} r={230} c={K.gold}/><TXT x={0} y={15} t={kind.replaceAll('-','・')} s={34}/></g>;
if(g==='people'){const label:Record<string,string>={sasaki:'佐々木',tanaka:'田中',client:'顧客',team:'チーム',researcher:'研究'};return <g><circle r={150} fill="#263a43" stroke={kind==='sasaki'?K.red:kind==='tanaka'?K.teal:K.gold} strokeWidth={10}/><TXT x={0} y={15} t={label[kind]??kind} s={36}/></g>}
throw Error('V110 category renderer missing '+kind);
};