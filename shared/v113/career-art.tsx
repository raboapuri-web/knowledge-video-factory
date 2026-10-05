import React from 'react';
export const K={paper:'#f3ede1',ink:'#15232c',gold:'#c8a15d',red:'#aa5754',teal:'#70a097',blue:'#5d7f96',green:'#6e8f73',orange:'#b47d55',gray:'#7c858b'};
export const q=(v:number)=>Math.max(0,Math.min(1,v));
export const ease=(p:number)=>{const x=q(p);return x*x*(3-2*x)};
const R=({x,y,w,h,c=K.paper,rx=18,o=1,stroke,sw=0}:{x:number;y:number;w:number;h:number;c?:string;rx?:number;o?:number;stroke?:string;sw?:number})=><rect x={x} y={y} width={w} height={h} rx={rx} fill={c} opacity={o} stroke={stroke} strokeWidth={sw}/>;
const T=({x=0,y=0,t,s=32,c=K.paper,a='middle',o=1}:{x?:number;y?:number;t:string;s?:number;c?:string;a?:'start'|'middle'|'end';o?:number})=><text x={x} y={y} textAnchor={a} fontFamily="Noto Sans JP,sans-serif" fontWeight={760} fontSize={s} fill={c} opacity={o}>{t}</text>;
const L=({x1,y1,x2,y2,c=K.paper,s=8,o=1}:{x1:number;y1:number;x2:number;y2:number;c?:string;s?:number;o?:number})=><line x1={x1} y1={y1} x2={x2} y2={y2} stroke={c} strokeWidth={s} opacity={o} strokeLinecap="round"/>;
const labels:Record<string,string>={
 protagonist:'43歳・勤続18年', 'restructure-notice':'組織改編', 'career-form':'専門スキル', 'internal-knowledge':'社内では必要な人', 'portable-question':'外へ何を持っていける？',
 'showa-newhire':'1970年代の新卒', 'job-rotation':'営業→企画→支店→管理', 'internal-promotion':'内部昇進', 'human-capital':'人的資本', 'general-capital':'持ち運べる能力', 'firm-specific':'企業特殊的人的資本', 'tenure-growth':'勤続で社内価値上昇',
 'rookie-question':'新人からの相談', 'approval-route':'稟議ルート', 'company-dialect':'会社専用の方言', 'skill-weights':'能力の重み', 'current-mix':'現在の会社の配合', 'target-mix':'転職先の配合', 'skill-cards':'能力カード', 'bundle-break':'能力・人脈・役職を分解',
 'agent-call':'転職エージェント', 'achievement-proof':'実績を証明できるか', 'asymmetry':'情報の非対称性', signal:'シグナル', 'observable-proof':'外から見える証拠', 'market-price':'市場価格', 'external-contact':'外部市場との接点', 'market-check':'キャリアの査定',
 'new-system':'新業務システム', 'ai-automation':'AI・クラウド・CRM', 'skill-obsolescence':'スキル陳腐化', retraining:'継続学習', 'market-shift':'市場側が変わる', 'two-curves':'社内価値 / 持ち運べる価値',
 'resume-translate':'社内語→市場語', 'portable-core':'持ち運べる核', 'outside-option':'外部選択肢', 'stay-vs-stuck':'残る / 残るしかない', 'career-healthcheck':'キャリア健康診断', 'freedom-exit':'辞められる自由'
};
const bars=new Set(['skill-weights','current-mix','target-mix','tenure-growth','market-price']);
const cards=new Set(['skill-cards','bundle-break','portable-core','general-capital','firm-specific','observable-proof']);
const people=new Set(['protagonist','showa-newhire','rookie-question','agent-call']);
const split=new Set(['portable-question','asymmetry','outside-option','stay-vs-stuck','two-curves']);
const network=new Set(['internal-knowledge','approval-route','company-dialect','external-contact']);
const doc=new Set(['restructure-notice','career-form','achievement-proof','resume-translate','career-healthcheck']);
const tech=new Set(['new-system','ai-automation','skill-obsolescence','retraining','market-shift']);
const theory=new Set(['human-capital','job-rotation','internal-promotion','signal']);

export const CareerSubject=({kind,p,variant=0}:{kind:string;p:number;variant?:number})=>{
 if(!labels[kind])throw Error('V113 unsupported subject '+kind);
 const e=ease(p),label=labels[kind],flip=variant%2===1;
 if(bars.has(kind))return <g><T y={-265} t={label} s={44}/>{[0,1,2,3,4].map(i=><g key={i}><R x={-380} y={-170+i*88} w={180+(i+1)*95+(variant%3)*40} h={46} c={i===4?K.gold:i%2?K.teal:K.blue} rx={9}/><R x={80} y={-170+i*88} w={170+((4-i)+1)*78+(variant%2)*70} h={46} c={i===1?K.red:K.gray} rx={9} o={.8}/></g>)}<L x1={0} y1={-205} x2={0} y2={250} c={K.paper} s={5} o={.3}/></g>;
 if(cards.has(kind))return <g><T y={-270} t={label} s={42}/>{['営業','調整','商品','人脈','社内SYS','管理'].map((t,i)=>{const x=-310+(i%3)*310,y=-130+Math.floor(i/3)*190,dim=(kind==='bundle-break'&&i>=3)||(kind==='firm-specific'&&i<2);return <g key={t} opacity={dim?.35:1} transform={kind==='skill-cards'?`translate(${e*(i>=3?160:80)} 0)`:undefined}><R x={x-105} y={y-62} w={210} h={124} c={i%2?K.teal:K.blue} rx={18}/><T x={x} y={y+10} t={t} s={25}/>{kind==='bundle-break'&&i>=3?<L x1={x-85} y1={y-45} x2={x+85} y2={y+45} c={K.red} s={12}/>:null}</g>})}</g>;
 if(people.has(kind))return <g><R x={-330} y={-240} w={660} h={480} c="#243640" rx={28} stroke={kind==='agent-call'?K.gold:K.blue} sw={8}/><circle cx={flip?150:-150} cy={-65} r={82} fill={kind==='showa-newhire'?K.gray:K.blue}/><R x={(flip?150:-150)-72} y={30} w={144} h={150} c={kind==='showa-newhire'?K.gray:K.teal} rx={28}/><T x={flip?-100:100} y={-90} t={label} s={36}/>{kind==='rookie-question'?<text x={180} y={150} fontFamily="Noto Sans JP" fontSize="95" fill={K.gold}>?</text>:null}</g>;
 if(split.has(kind))return <g><T y={-285} t={label} s={42}/><R x={-390} y={-205} w={330} h={420} c={kind==='stay-vs-stuck'?K.teal:K.blue} rx={24}/><R x={60} y={-205} w={330} h={420} c={kind==='stay-vs-stuck'?K.red:K.gold} rx={24}/><circle cx={-225} cy={0} r={60+35*e} fill={K.paper} opacity=".55"/><circle cx={225} cy={0} r={60+35*(1-e)} fill={K.paper} opacity=".45"/><L x1={-20} y1={0} x2={20} y2={0} c={K.paper} s={8} o={.6}/></g>;
 if(network.has(kind))return <g><T y={-295} t={label} s={40}/>{Array.from({length:7},(_,i)=>{const a=-Math.PI/2+i*Math.PI*2/7,x=Math.cos(a)*300,y=Math.sin(a)*205;return <g key={i}><L x1={0} y1={0} x2={x} y2={y} c={i%2?K.teal:K.gray} s={6} o={.35+.45*e}/><circle cx={x} cy={y} r={48+(i===variant%7?18*e:0)} fill={i===variant%7?K.gold:i%2?K.blue:K.teal}/></g>})}<circle r={78} fill={K.red}/></g>;
 if(doc.has(kind))return <g><T y={-285} t={label} s={42}/><R x={-310} y={-210} w={620} h={430} c="#e2e1d8" rx={20} stroke={K.gray} sw={7}/>{Array.from({length:7},(_,i)=><R key={i} x={-245} y={-145+i*48} w={350+((i+variant)%3)*70} h={12} c={i===Math.floor(e*7)?K.red:K.gray} rx={4}/>) }{kind==='resume-translate'?<><L x1={-260} y1={130} x2={260} y2={-80} c={K.gold} s={10}/><T x={0} y={185} t="成果・規模・再現性" s={27} c={K.ink}/></>:null}</g>;
 if(tech.has(kind))return <g><T y={-290} t={label} s={42}/><R x={-380} y={-200} w={300} h={370} c="#263b46" rx={24}/><R x={80} y={-200} w={300} h={370} c="#173f48" rx={24}/>{Array.from({length:5},(_,i)=><R key={i} x={-335} y={-140+i*58} w={210-(i%2)*40} h={12} c={K.gray} rx={4} o={1-e*.65}/>) }{Array.from({length:6},(_,i)=><circle key={i} cx={135+(i%2)*150} cy={-120+Math.floor(i/2)*100} r={28} fill={i%2?K.gold:K.teal} opacity={.35+.65*e}/>) }<L x1={-35} y1={0} x2={35} y2={0} c={K.red} s={13}/></g>;
 if(theory.has(kind))return <g><T y={-285} t={label} s={42}/>{Array.from({length:5},(_,i)=>{const x=-300+i*150,y=80-Math.abs(2-i)*85;return <g key={i}><circle cx={x} cy={y} r={65} fill={[K.blue,K.teal,K.gold,K.red,K.green][(i+variant)%5]}/>{i<4?<L x1={x+65} y1={y} x2={x+85} y2={80-Math.abs(1-i)*85} c={K.paper} s={7} o={.35+.45*e}/>:null}</g>})}</g>;
 return <g><R x={-365} y={-230} w={730} h={460} c="#263a45" rx={26} stroke={variant%2?K.gold:K.teal} sw={10}/><T y={-105} t={label} s={42}/>{Array.from({length:4},(_,i)=><R key={i} x={-270+(variant%2)*30} y={-20+i*65} w={500-i*55+(variant%3)*35} h={20} c={i===0?K.gold:i%2?K.gray:K.blue} rx={6} o={.8-i*.1}/>)}</g>;
};