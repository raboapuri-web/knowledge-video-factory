import React from 'react';
import {R,L,P,Ring,q,lerp} from './primitives';

export const K={paper:'#f0eadf',ink:'#182731',gold:'#c8a564',red:'#ad5c58',teal:'#769c97',blue:'#66869b',muted:'#657079'};
export const TXT=({x,y,t,s=36,c=K.paper,a='middle',o=1}:{x:number;y:number;t:string;s?:number;c?:string;a?:'start'|'middle'|'end';o?:number})=><text x={x} y={y} textAnchor={a} fontFamily="Noto Sans JP,sans-serif" fontWeight={740} fontSize={s} fill={c} opacity={o}>{t}</text>;
export const ease=(p:number)=>{const x=q(p);return x*x*(3-2*x)};

const groups:Record<string,string[]>={
 people:'confident-worker quiet-worker manager colleague researcher expert novice team'.split(/\\s+/),
 docs:'project-board report old-data contract proposal memo checklist'.split(/\\s+/),
 charts:'quartile-chart percentile-gap regression-chart confidence-gauge confidence-accuracy status-ladder forecast-tree contribution-wheel feedback-loop evaluation-dashboard score-axis'.split(/\\s+/),
 concepts:'metacognition-loop double-burden invisible-error ability-mask spotlight mirror-question competence-vs-confidence uncertainty branches status-signal fire-crisis prevented-failure'.split(/\\s+/),
 devices:'phone laptop server-log monitor'.split(/\\s+/),
 events:'delivery sales-conversation client-call correction handoff promotion'.split(/\\s+/)
};
const membership=new Map(Object.entries(groups).flatMap(([g,a])=>a.map(k=>[k,g])));
export const categoryFor=(k:string)=>{const g=membership.get(k);if(!g)throw Error('V109 unsupported object '+k);return g};

const Doc=({kind,p}:{kind:string;p:number})=>{const bad=kind==='old-data'||kind==='proposal';return <g>
 <R x={-280} y={-330} w={560} h={660} rx={22} c="#ddd4c1" stroke="#665f55" sw={8}/>
 <TXT x={0} y={-255} t={kind==='contract'?'契約書':kind==='proposal'?'企画書':kind==='old-data'?'昨年データ':kind==='memo'?'メモ':kind==='checklist'?'確認項目':kind==='report'?'報告書':'案件一覧'} s={35} c={K.ink}/>
 {[0,1,2,3,4,5].map(i=><R key={i} x={-210} y={-180+i*75} w={330+((i*47)%100)} h={14} c={i===2&&bad?K.red:'#76736c'} o={.75}/>)}
 {bad&&<Ring x={110} y={-30} p={p} r={90} c={K.red}/>}
 {kind==='checklist'&&[0,1,2].map(i=><g key={i}><R x={-200} y={90+i*75} w={32} h={32} c={i<Math.floor(ease(p)*4)?K.teal:'#b4aa99'}/><L x={-195} y={105+i*75} X={-178} Y={121+i*75} c={K.paper} sw={5}/></g>)}
 </g>};

const Chart=({kind,p}:{kind:string;p:number})=>{const e=ease(p);
 if(kind==='quartile-chart')return <g><L x={-360} y={230} X={360} Y={230} c={K.paper} sw={8}/>{[0,1,2,3].map(i=><g key={i}><R x={-320+i*180} y={160-(i+1)*95*e} w={120} h={(i+1)*95*e} c={i===0?K.red:K.teal}/><TXT x={-260+i*180} y={285} t={'Q'+(i+1)} s={24}/></g>)}</g>;
 if(kind==='percentile-gap')return <g><L x={-340} y={220} X={340} Y={220} c={K.paper} sw={8}/><L x={-340} y={220} X={-340} Y={-220} c={K.paper} sw={8}/><circle cx={-255} cy={145} r={30} fill={K.red}/><circle cx={80} cy={-40} r={30} fill={K.gold}/><L x={-255} y={145} X={80} Y={-40} c={K.gold} sw={10} p={e}/><TXT x={-255} y={205} t="12" s={30}/><TXT x={80} y={-85} t="62" s={30}/></g>;
 if(kind==='regression-chart')return <g><L x={-360} y={220} X={360} Y={220} c={K.paper} sw={8}/><L x={-360} y={220} X={-360} Y={-230} c={K.paper} sw={8}/>{Array.from({length:12},(_,i)=>{const x=-310+i*55,y=150-(i*20)+(((i*71)%150)-75);return <circle key={i} cx={x} cy={y} r={16} fill={i<4?K.red:K.teal} opacity={.75}/>})}<L x={-300} y={130} X={300} Y={-120} c={K.gold} sw={8} p={e}/></g>;
 if(kind==='confidence-gauge')return <g><path d="M-260 90 A260 260 0 0 1 260 90" fill="none" stroke="#60717a" strokeWidth={42}/><path d="M-260 90 A260 260 0 0 1 140 -115" fill="none" stroke={K.gold} strokeWidth={42}/><L x={0} y={90} X={lerp(-180,160,e)} Y={lerp(40,-120,e)} c={K.red} sw={14}/><TXT x={0} y={180} t="自信" s={36}/></g>;
 if(kind==='confidence-accuracy')return <g><L x={-350} y={230} X={350} Y={230} c={K.paper} sw={8}/><L x={-350} y={230} X={-350} Y={-230} c={K.paper} sw={8}/>{Array.from({length:26},(_,i)=>{const x=-300+((i*83)%620),y=150-((i*47)%330)+(i%3)*35;return <circle key={i} cx={x} cy={y} r={10} fill={i%4?K.teal:K.red} opacity=".65"/>})}<TXT x={230} y={-180} t="r ≈ .22" s={48} c={K.gold}/></g>;
 if(kind==='status-ladder')return <g>{[0,1,2,3,4].map(i=><R key={i} x={-340+i*150} y={180-i*95} w={130} h={95+i*95} c={i%2?K.teal:'#65757c'}/>)}<circle cx={260} cy={-210} r={66} fill={K.gold}/></g>;
 if(kind==='feedback-loop')return <g>{[0,1,2,3].map(i=>{const a=-Math.PI/2+i*Math.PI/2,x=Math.cos(a)*250,y=Math.sin(a)*250;return <g key={i}><circle cx={x} cy={y} r={74} fill={i%2?K.teal:K.gold}/><TXT x={x} y={y+9} t={['自信','可視性','地位','発言機会'][i]} s={22} c={K.ink}/></g>})}<path d="M0 -176 Q250 -176 176 0 Q176 250 0 176 Q-250 176 -176 0 Q-176 -250 0 -176" fill="none" stroke={K.paper} strokeWidth="10" strokeDasharray="20 16"/></g>;
 if(kind==='contribution-wheel')return <g>{['発案','計画','修正','支援','顧客'].map((t,i)=>{const a=-Math.PI/2+i*Math.PI*2/5,x=Math.cos(a)*260,y=Math.sin(a)*260;return <g key={t}><L x={0} y={0} X={x} Y={y} c={K.gold} sw={7} p={e}/><circle cx={x} cy={y} r={70} fill={i===0?K.red:K.teal}/><TXT x={x} y={y+8} t={t} s={24}/></g>})}<circle r={90} fill="#2b3941"/><TXT x={0} y={12} t="成功" s={31}/></g>;
 if(kind==='evaluation-dashboard')return <g>{['予測→結果','発言→成果','担当→修正','防いだ失敗'].map((t,i)=><g key={t} transform={'translate('+(-330+i*220)+' 0)'}><R x={-85} y={-240} w={170} h={480} rx={14} c={i%2?'#617b7c':'#75685e'}/><TXT x={0} y={-185} t={t} s={18}/>{[0,1,2,3].map(j=><R key={j} x={-52} y={-90+j*78} w={(60+j*24)*e} h={22} c={j===2?K.gold:K.paper} o={.72}/>)}</g>)}</g>;
 if(kind==='forecast-tree')return <g><circle cx="-260" cy="-120" r="72" fill={K.red}/><circle cx="260" cy="-120" r="72" fill={K.teal}/>{[-1,0,1].map(i=><g key={i}><L x={-190} y={-90} X={i*190} Y={190} c={K.gold} sw={7} p={e}/><L x={190} y={-90} X={i*190} Y={190} c={K.gold} sw={7} p={e}/><circle cx={i*190} cy={190} r={52} fill="#64747c"/></g>)}</g>;
 if(kind==='score-axis')return <g><L x={-360} y={80} X={360} Y={80} c={K.paper} sw={12}/>{[0,1,2,3,4].map(i=><g key={i}><L x={-330+i*165} y={60} X={-330+i*165} Y={100} c={K.paper} sw={6}/><TXT x={-330+i*165} y={145} t={String(i*25)} s={24}/></g>)}<circle cx={lerp(-294,294,e)} cy={80} r={28} fill={K.red}/></g>;
 return <g><Ring x={0} y={0} p={p} r={250} c={K.gold}/><TXT x={0} y={15} t={kind} s={30}/></g>;
};

const Concept=({kind,p}:{kind:string;p:number})=>{
 if(kind==='double-burden')return <g><circle cx="-190" cy="0" r="130" fill="#6c5f5b"/><circle cx="190" cy="0" r="130" fill="#5b6f73"/><TXT x={-190} y={-20} t="仕事" s={32}/><TXT x={-190} y={25} t="できない" s={30}/><TXT x={190} y={-20} t="失敗に" s={32}/><TXT x={190} y={25} t="気づけない" s={28}/><L x={-50} y={0} X={50} Y={0} c={K.gold} sw={12} p={ease(p)}/></g>;
 if(kind==='metacognition-loop')return <g><circle r={105} fill="#30424a"/><TXT x={0} y={12} t="自分" s={30}/>{['知る','間違い','判断'].map((t,i)=>{const a=-Math.PI/2+i*Math.PI*2/3,x=Math.cos(a)*265,y=Math.sin(a)*230;return <g key={t}><circle cx={x} cy={y} r={78} fill={i%2?K.teal:K.gold}/><TXT x={x} y={y+7} t={t} s={24} c={K.ink}/></g>})}</g>;
 if(kind==='fire-crisis')return <g>{[0,1,2,3,4].map(i=><P key={i} d={'M'+(-220+i*110)+' 180 Q'+(-190+i*110)+' '+(-180-(i%2)*80)+' '+(-130+i*110)+' 180Z'} c={i%2?K.gold:K.red} o={.75}/>)}</g>;
 if(kind==='status-signal')return <g><circle r={130} fill={K.gold}/>{[0,1,2,3].map(i=><Ring key={i} x={0} y={0} p={q((ease(p)-i*.12)*1.4)} r={170+i*70} c={i%2?K.red:K.gold}/>)}</g>;
 if(kind==='competence-vs-confidence')return <g><R x={-360} y={-190} w={300} h={380} rx={20} c="#526a72"/><R x={60} y={-190} w={300} h={380} rx={20} c="#7e625d"/><TXT x={-210} y={-20} t="能力" s={54}/><TXT x={210} y={-20} t="自信" s={54}/><TXT x={0} y={20} t="≠" s={88} c={K.gold}/></g>;
 if(kind==='mirror-question')return <g><ellipse cx={0} cy={0} rx={240} ry={310} fill="#263942" stroke={K.gold} strokeWidth={12}/><TXT x={0} y={55} t="？" s={220}/></g>;
 if(kind==='prevented-failure')return <g><R x={-300} y={-210} w={600} h={420} rx={20} c="#34464c"/><Ring x={0} y={0} p={p} r={150} c={K.teal}/><P d="M-100 15 L-25 95 125 -95" c="none" stroke={K.gold} sw={30}/></g>;
 return <g><Ring x={0} y={0} p={p} r={240} c={K.gold}/><TXT x={0} y={20} t={kind.replaceAll('-','・')} s={28}/></g>;
};

export const OfficeSubject=({kind,p}:{kind:string;p:number})=>{
 const g=categoryFor(kind);
 if(g==='docs')return <Doc kind={kind} p={p}/>;
 if(g==='charts')return <Chart kind={kind} p={p}/>;
 if(g==='concepts')return <Concept kind={kind} p={p}/>;
 if(g==='devices')return kind==='phone'?<g><R x={-120} y={-250} w={240} h={500} rx={38} c="#1b2830" stroke="#91a0a4" sw={9}/><circle cx={0} cy={190} r={18} fill={K.gold}/></g>:<g><R x={-260} y={-180} w={520} h={320} rx={18} c="#1c2d36" stroke="#85979a" sw={9}/><R x={-210} y={-120} w={420} h={210} c="#55717a" o={.4}/></g>;
 if(g==='events')return <g><Ring x={0} y={0} p={p} r={230} c={K.gold}/><TXT x={0} y={15} t={kind.replaceAll('-','・')} s={34}/></g>;
 if(g==='people')return <g><circle r={150} fill="#273a43" stroke={kind==='confident-worker'?K.red:kind==='quiet-worker'?K.teal:K.gold} strokeWidth={10}/><TXT x={0} y={15} t={kind==='confident-worker'?'自信満々':kind==='quiet-worker'?'静かな社員':kind==='manager'?'上司':kind==='researcher'?'研究者':kind==='expert'?'専門家':kind==='novice'?'初心者':'チーム'} s={34}/></g>;
 throw Error('V109 category renderer missing '+kind);
};