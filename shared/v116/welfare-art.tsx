import React from 'react';
export const K={paper:'#f3ede1',ink:'#15232c',gold:'#c8a15d',red:'#aa5754',teal:'#70a097',blue:'#5d7f96',green:'#6e8f73',orange:'#b47d55',gray:'#7c858b'};
export const q=(v:number)=>Math.max(0,Math.min(1,v));export const ease=(p:number)=>{const x=q(p);return x*x*(3-2*x)};
const R=({x,y,w,h,c=K.paper,rx=18,o=1}:{x:number;y:number;w:number;h:number;c?:string;rx?:number;o?:number})=><rect x={x} y={y} width={w} height={h} rx={rx} fill={c} opacity={o}/>;
const T=({x=0,y=0,t,s=32,c=K.paper}:{x?:number;y?:number;t:string;s?:number;c?:string})=><text x={x} y={y} textAnchor="middle" fontFamily="Noto Sans JP,sans-serif" fontWeight={760} fontSize={s} fill={c}>{t}</text>;
const L=({x1,y1,x2,y2,c=K.paper,s=8,o=1}:{x1:number;y1:number;x2:number;y2:number;c?:string;s?:number;o?:number})=><line x1={x1} y1={y1} x2={x2} y2={y2} stroke={c} strokeWidth={s} opacity={o} strokeLinecap="round"/>;
const labels:Record<string,string>={
 mother:'生活に余裕のない母親',basket:'買い物を削る',support:'可処分所得が減る',manager:'店長の売上表',shift:'シフト削減',middleworker:'中間層のパート',restaurant:'外食を減らす',student:'採用見送り',clothing:'買い物延期',
 twohouseholds:'同じ一万円',bills:'先延ばし支出',savings:'貯蓄へ残る',mpc:'限界消費性向',spendingflow:'支出が所得になる',chain:'一万円の連鎖',heterogeneous:'家計ごとの反応差',
 depression:'1930年代の失業',thrift:'節約のパラドックス',socialsecurity:'1935年の制度化',stabilizer:'自動安定化装置',
 townmap:'地域経済',cashtransfer:'現金移転',multiplier:'地域乗数',spillover:'非受給者への波及',businesscut:'売上→雇用調整',
 budget:'政府の削減案',fiscal:'財政乗数',inequality:'所得分布と需要',saving:'消費と貯蓄',tax:'財源',benefitcliff:'給付の壁',design:'制度設計',
 lifeshock:'人生の所得ショック',safetynet:'セーフティーネット',connected:'財布はつながる',floor:'経済の床'
};
const cards=new Set(['basket','bills','spendingflow','chain','cashtransfer','spillover','connected']);
const charts=new Set(['manager','shift','mpc','heterogeneous','stabilizer','multiplier','fiscal','inequality','saving','budget']);
const people=new Set(['mother','middleworker','student','depression','lifeshock']);
const split=new Set(['twohouseholds','support','restaurant','clothing','tax','benefitcliff']);
const network=new Set(['townmap','businesscut','safetynet','floor']);
export const WelfareSubject=({kind,p,variant=0}:{kind:string;p:number;variant?:number})=>{
 if(!labels[kind])throw Error('V116 unsupported subject '+kind);const e=ease(p),label=labels[kind];
 if(cards.has(kind))return <g><T y={-285} t={label} s={42}/>{Array.from({length:6},(_,i)=>{const x=-310+(i%3)*310,y=-120+Math.floor(i/3)*190;return <g key={i} opacity={kind==='basket'&&i>2?1-e*.75:1}><R x={x-105} y={y-62} w={210} h={124} c={[K.blue,K.teal,K.gold,K.red][(i+variant)%4]} rx={18}/><circle cx={x} cy={y} r={18+8*Math.sin(p*6+i)} fill={K.paper} opacity=".55"/></g>})}</g>;
 if(charts.has(kind))return <g><T y={-285} t={label} s={42}/><L x1={-390} y1={220} x2={390} y2={220} c={K.paper} s={6} o={.45}/><L x1={-390} y1={220} x2={-390} y2={-220} c={K.paper} s={6} o={.45}/>{[0,1,2,3,4].map(i=><R key={i} x={-320+i*145} y={190-(i+1)*75*e} w={85} h={(i+1)*75*e} c={i===variant%5?K.red:i%2?K.teal:K.gold} rx={10}/>)}</g>;
 if(people.has(kind))return <g><T y={-285} t={label} s={40}/>{[-220,0,220].map((x,i)=><g key={i} opacity={i===variant%3?1:.45}><circle cx={x} cy={-80} r={64} fill={i%2?K.gold:K.blue}/><R x={x-62} y={0} w={124} h={170} c={i%2?K.teal:K.gray} rx={28}/></g>)}</g>;
 if(split.has(kind))return <g><T y={-285} t={label} s={42}/><R x={-390} y={-205} w={330} h={420} c={K.blue} rx={24}/><R x={60} y={-205} w={330} h={420} c={kind==='support'||kind==='benefitcliff'?K.red:K.teal} rx={24}/><circle cx={-225} cy={0} r={55+35*e} fill={K.paper} opacity=".55"/><circle cx={225} cy={0} r={55+25*(1-e)} fill={K.paper} opacity=".45"/></g>;
 if(network.has(kind))return <g><T y={-300} t={label} s={40}/>{Array.from({length:8},(_,i)=>{const a=i*Math.PI*2/8,x=Math.cos(a)*315,y=Math.sin(a)*205;return <g key={i}><L x1={0} y1={0} x2={x} y2={y} c={i%2?K.teal:K.gold} s={6} o={.25+.55*e}/><circle cx={x} cy={y} r={48} fill={i%3===0?K.red:K.blue}/></g>})}<circle r={82} fill={K.green}/></g>;
 return <g><R x={-370} y={-230} w={740} h={460} c="#263a45" rx={26}/><T y={-120} t={label} s={42}/>{Array.from({length:5},(_,i)=><R key={i} x={-275} y={-35+i*58} w={500-i*50+(variant%3)*25} h={18} c={i===Math.floor(e*5)?K.red:i%2?K.gray:K.blue} rx={6}/>)}</g>;
};