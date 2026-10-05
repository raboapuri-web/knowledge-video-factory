import React from 'react';
import {R,L,Ring,q,lerp} from './primitives';

export const K={paper:'#f1eadf',ink:'#17262f',gold:'#c8a463',red:'#ad5b57',teal:'#729b95',blue:'#64859b',green:'#72906f',orange:'#b88359'};
export const TXT=({x,y,t,s=36,c=K.paper,a='middle',o=1}:{x:number;y:number;t:string;s?:number;c?:string;a?:'start'|'middle'|'end';o?:number})=><text x={x} y={y} textAnchor={a} fontFamily="Noto Sans JP,sans-serif" fontWeight={760} fontSize={s} fill={c} opacity={o}>{t}</text>;
export const ease=(p:number)=>{const x=q(p);return x*x*(3-2*x)};

const groups:Record<string,string[]>={
 people:'unemployed-man taxpayer-woman landlord doctor municipal police family worker crowd researcher'.split(/\s+/),
 docs:'rent-notice utility-bill wallet resume application law-card hospital-bill tax-ledger mortgage insurance-card medicine-bottle budget-card'.split(/\s+/),
 charts:'savings-fall food-compression support-floor poverty-spiral prerequisite-chain cost-shift housing-trial housing-offset externality-flow crime-branches ssi-timeline budget-transfer denmark-ripple finland-null choice-space life-risk downturn-loop stabilizer-buffer four-reasons risk-ladder ship-decks'.split(/\s+/),
 devices:'phone fridge mailbox charging'.split(/\s+/),
 events:'eviction ambulance job-search interview address-loss station-sleep collapse company-failure illness divorce home-sale welfare-application emergency-exit'.split(/\s+/),
 concepts:'floor-vs-hole taxpayer-recipient social-floor safety-net bill-recipient options-narrow last-insurance fire-extinguisher sinking-ship public-cost'.split(/\s+/)
};
const membership=new Map(Object.entries(groups).flatMap(([g,a])=>a.map(k=>[k,g])));
export const categoryFor=(k:string)=>{const g=membership.get(k);if(!g)throw Error('V111 unsupported object '+k);return g};

const Doc=({kind,p}:{kind:string;p:number})=>{
 const titles:Record<string,string>={ 'rent-notice':'家賃督促','utility-bill':'電気料金',wallet:'財布',resume:'履歴書',application:'申請書','law-card':'生活保護法','hospital-bill':'医療費','tax-ledger':'税・保険料',mortgage:'住宅ローン','insurance-card':'最後の保険','medicine-bottle':'薬','budget-card':'公的支出'};
 const e=ease(p);
 if(kind==='wallet')return <g><R x={-250} y={-150} w={500} h={300} rx={35} c="#604c40" stroke="#9c826a" sw={8}/><R x={-180} y={-90} w={360} h={120} rx={12} c="#d7cfba"/><TXT x={0} y={-10} t="¥2,000" s={70} c={K.ink}/></g>;
 if(kind==='medicine-bottle')return <g><R x={-120} y={-230} w={240} h={420} rx={45} c="#d5d0c3" stroke="#718087" sw={7}/><R x={-85} y={-285} w={170} h={75} rx={15} c="#718087"/><TXT x={0} y={25} t="薬" s={58} c={K.ink}/><L x={-60} y={105} X={60} Y={105} c={K.red} sw={14} p={e}/></g>;
 return <g><R x={-285} y={-335} w={570} h={670} rx={22} c="#ddd4c1" stroke="#665f55" sw={8}/><TXT x={0} y={-255} t={titles[kind]??kind} s={36} c={K.ink}/>{[0,1,2,3,4,5].map(i=><R key={i} x={-215} y={-180+i*74} w={330+((i*47)%110)} h={14} c={i===2&&/notice|bill/.test(kind)?K.red:'#777169'} o={.76}/>)}{kind==='law-card'?<TXT x={0} y={90} t="最低生活保障＋自立助長" s={28} c={K.red}/>:null}{kind==='insurance-card'?<TXT x={0} y={80} t="LAST RESORT" s={40} c={K.gold}/>:null}</g>;
};

const Chart=({kind,p}:{kind:string;p:number})=>{const e=ease(p);
 if(kind==='savings-fall')return <g><L x={-360} y={230} X={360} Y={230} c={K.paper} sw={8}/><L x={-360} y={230} X={-360} Y={-230} c={K.paper} sw={8}/><path d="M-300 -160 Q-120 -80 0 10 T320 205" fill="none" stroke={K.red} strokeWidth="14" strokeDasharray={900*e+' 900'}/><TXT x={180} y={-120} t="貯金" s={30} c={K.gold}/></g>;
 if(kind==='food-compression')return <g>{[['弁当',K.green],['カップ麺',K.gold],['1日2食',K.red],['パン',K.paper]].map(([t,c],i)=><g key={String(t)} transform={'translate('+(-330+i*220)+' 0)'}><circle r={72-(i*7)} fill={String(c)}/><TXT x={0} y={10} t={String(t)} s={22} c={i===3?K.ink:K.paper}/></g>)}</g>;
 if(kind==='support-floor'||kind==='social-floor'||kind==='floor-vs-hole')return <g><rect x="-360" y="110" width="720" height="70" rx="16" fill={K.gold}/><TXT x={0} y={155} t="最低ライン" s={30} c={K.ink}/>{[-2,-1,0,1,2].map(i=><circle key={i} cx={i*125} cy={20-Math.abs(i)*15} r={48} fill={i===0?K.red:K.teal}/>) }<path d="M-350 200 L-120 400 L0 250 L140 430 L350 210" fill="none" stroke="#3a2225" strokeWidth="12" opacity={kind==='floor-vs-hole'?.9:.35}/></g>;
 if(kind==='poverty-spiral')return <g>{['1万円不足','携帯停止','採用連絡なし','収入低下','家賃滞納','住所喪失'].map((t,i)=>{const a=-Math.PI/2+i*Math.PI/3,x=Math.cos(a)*300,y=Math.sin(a)*245;return <g key={t}><circle cx={x} cy={y} r={68} fill={i%2?K.red:K.orange}/><TXT x={x} y={y+7} t={t} s={18}/></g>})}<path d="M0 -175 Q280 -145 220 90 Q120 310 -120 230 Q-310 160 -220 -100 Q-130 -250 0 -175" fill="none" stroke={K.gold} strokeWidth="10" strokeDasharray="21 15"/></g>;
 if(kind==='prerequisite-chain')return <g>{['清潔な服','充電済み携帯','住所','睡眠','面接'].map((t,i)=><g key={t}><R x={-400+i*200} y={-75+(i%2)*100} w={175} h={150} rx={18} c={i===4?K.gold:K.teal}/><TXT x={-312+i*200} y={10+(i%2)*100} t={t} s={19} c={i===4?K.ink:K.paper}/>{i<4?<L x={-220+i*200} y={(i%2)*100} X={-205+i*200} Y={((i+1)%2)*100} c={K.paper} sw={6} p={e}/>:null}</g>)}</g>;
 if(kind==='cost-shift'||kind==='public-cost')return <g><circle cx="-300" cy="0" r="100" fill={K.gold}/><TXT x={-300} y={10} t="福祉" s={30} c={K.ink}/>{['医療','救急','家族','警察'].map((t,i)=>{const y=-240+i*160;return <g key={t}><L x={-180} y={0} X={180} Y={y} c={i%2?K.red:K.teal} sw={9} p={e}/><circle cx={290} cy={y} r={72} fill={i%2?K.red:K.teal}/><TXT x={290} y={y+8} t={t} s={25}/></g>})}</g>;
 if(kind==='housing-trial')return <g>{[['入院','-29%'],['入院日数','-29%'],['救急外来','-24%']].map(([t,n],i)=><g key={String(t)}><TXT x={-330} y={-150+i*150} t={String(t)} s={28} a="start"/><R x={-80} y={-185+i*150} w={500} h={65} rx={12} c="#475a64"/><R x={-80} y={-185+i*150} w={500*(1-Number(String(n).replace(/[^0-9]/g,''))/100)*e} h={65} rx={12} c={K.teal}/><TXT x={500} y={-145+i*150} t={String(n)} s={36} c={K.gold}/></g>)}</g>;
 if(kind==='housing-offset')return <g><R x={-360} y={-180} w={260} h={360} rx={20} c={K.gold}/><TXT x={-230} y={0} t="住宅＋支援" s={26} c={K.ink}/><TXT x={20} y={0} t="→" s={70} c={K.paper}/><R x={140} y={-180} w={300} h={360} rx={20} c={K.teal}/><TXT x={290} y={-30} t="他サービス" s={25}/><TXT x={290} y={35} t="約半分相殺" s={32} c={K.gold}/></g>;
 if(kind==='externality-flow')return <g><R x={-380} y={-180} w={250} h={360} rx={18} c="#5b5d61"/><TXT x={-255} y={10} t="工場" s={34}/><path d="M-130 50 Q0 120 140 30 T430 90" fill="none" stroke="#7c7766" strokeWidth="50"/><TXT x={250} y={-80} t="費用を下流へ" s={30} c={K.gold}/><circle cx={360} cy={120} r={95} fill={K.red}/></g>;
 if(kind==='crime-branches')return <g><circle cx="-330" cy="0" r={90} fill={K.red}/><TXT x={-330} y={10} t="困窮" s={30}/><L x={-230} y={-20} X={80} Y={-150} c={K.gold} sw={9} p={e}/><L x={-230} y={20} X={80} Y={150} c={K.paper} sw={9} p={e}/><circle cx={220} cy={-150} r={100} fill={K.orange}/><TXT x={220} y={-143} t="財産犯罪" s={27}/><circle cx={220} cy={150} r={100} fill={K.blue}/><TXT x={220} y={145} t="重大暴力" s={25}/><TXT x={220} y={185} t="一貫せず" s={19} c={K.gold}/></g>;
 if(kind==='ssi-timeline')return <g><L x={-390} y={0} X={390} Y={0} c={K.paper} sw={10}/>{[['1996',-330],['18歳',-110],['再審査',110],['20年追跡',330]].map(([t,x])=><g key={String(t)}><circle cx={Number(x)} cy={0} r={28} fill={K.gold}/><TXT x={Number(x)} y={-55} t={String(t)} s={24}/></g>)}<path d="M110 20 Q200 110 330 155" fill="none" stroke={K.red} strokeWidth="9"/><TXT x={280} y={205} t="告発 +20%" s={34} c={K.red}/></g>;
 if(kind==='budget-transfer')return <g><R x={-380} y={-180} w={260} h={360} rx={18} c={K.teal}/><TXT x={-250} y={-15} t="福祉" s={36}/><TXT x={-250} y={50} t="↓" s={55} c={K.gold}/><TXT x={0} y={0} t="→" s={75}/><R x={140} y={-220} w={320} h={440} rx={18} c={K.red}/><TXT x={300} y={-70} t="警察" s={28}/><TXT x={300} y={0} t="裁判" s={28}/><TXT x={300} y={70} t="刑務所" s={28}/></g>;
 if(kind==='denmark-ripple')return <g>{Array.from({length:9},(_,i)=>{const a=i*Math.PI*2/9,x=Math.cos(a)*270,y=Math.sin(a)*220;return <g key={i}><L x={0} y={0} X={x} Y={y} c={K.red} sw={6} p={e}/><circle cx={x} cy={y} r={40} fill={i%2?K.teal:K.blue}/></g>})}<circle r={90} fill={K.red}/><TXT x={0} y={12} t="給付削減" s={23}/><TXT x={0} y={320} t="近隣へ波及" s={28} c={K.gold}/></g>;
 if(kind==='finland-null')return <g><R x={-330} y={-170} w={270} h={340} rx={20} c={K.teal}/><TXT x={-195} y={-50} t="2,000人" s={30}/><TXT x={-195} y={20} t="€560" s={42} c={K.gold}/><TXT x={0} y={10} t="→" s={70}/><R x={90} y={-170} w={330} h={340} rx={20} c="#4a5961"/><TXT x={255} y={-25} t="犯罪への" s={28}/><TXT x={255} y={35} t="有意差なし" s={34} c={K.gold}/></g>;
 if(kind==='choice-space'||kind==='options-narrow')return <g><circle cx="-310" cy="0" r={85} fill={K.red}/>{[-2,-1,0,1,2].map(i=><L key={i} x={-220} y={0} X={i*135+200} Y={i*85} c={i%2?K.gold:K.teal} sw={7} p={e}/>) }{[-2,-1,0,1,2].map(i=><circle key={'c'+i} cx={i*135+260} cy={i*85} r={45} fill={i===0?K.red:K.teal}/>)}</g>;
 if(kind==='life-risk')return <g>{['病気','失業','障害','介護','離婚','倒産','死別'].map((t,i)=>{const a=-Math.PI/2+i*Math.PI*2/7,x=Math.cos(a)*300,y=Math.sin(a)*245;return <g key={t}><circle cx={x} cy={y} r={57} fill={i%2?K.blue:K.orange}/><TXT x={x} y={y+7} t={t} s={20}/></g>})}<circle r={90} fill="#334850"/><TXT x={0} y={12} t="人生" s={30}/></g>;
 if(kind==='downturn-loop')return <g>{['失業↑','所得↓','消費↓','売上↓','解雇↑'].map((t,i)=>{const a=-Math.PI/2+i*Math.PI*2/5,x=Math.cos(a)*285,y=Math.sin(a)*235;return <g key={t}><circle cx={x} cy={y} r={70} fill={i%2?K.red:K.orange}/><TXT x={x} y={y+8} t={t} s={22}/></g>})}<path d="M0 -160 Q270 -150 210 85 Q100 300 -130 220 Q-300 130 -210 -100 Q-120 -245 0 -160" fill="none" stroke={K.gold} strokeWidth="10" strokeDasharray="20 15"/></g>;
 if(kind==='stabilizer-buffer')return <g><L x={-360} y={230} X={360} Y={230} c={K.paper} sw={8}/><L x={-360} y={230} X={-360} Y={-230} c={K.paper} sw={8}/><path d="M-300 -150 Q-50 -80 100 170 T320 220" fill="none" stroke={K.red} strokeWidth="13" strokeDasharray={900*e+' 900'}/><path d="M-300 -150 Q-50 -80 100 30 T320 80" fill="none" stroke={K.teal} strokeWidth="13" strokeDasharray={900*e+' 900'}/><TXT x={200} y={-140} t="約60%を初期吸収" s={29} c={K.gold}/></g>;
 if(kind==='four-reasons')return <g>{['最低生活','再起条件','費用移転防止','最後の保険'].map((t,i)=><g key={t}><R x={-390+i*200} y={-160+(i%2)*85} w={180} h={260} rx={18} c={i%2?K.teal:K.blue}/><TXT x={-300+i*200} y={-15+(i%2)*85} t={t} s={19}/></g>)}</g>;
 if(kind==='risk-ladder')return <g>{[0,1,2,3,4].map(i=><R key={i} x={-360+i*150} y={180-i*95} w={135} h={95+i*95} c={i===0?K.red:i===4?K.gold:K.teal}/>)}<TXT x={0} y={320} t="どこまで落ちるか" s={30}/></g>;
 if(kind==='ship-decks'||kind==='sinking-ship')return <g><path d="M-380 180 H380 L300 340 H-300Z" fill="#55565a" stroke={K.gold} strokeWidth="10"/>{[0,1,2].map(i=><R key={i} x={-260} y={-180+i*105} w={520} h={60} rx={10} c={i===2?K.red:'#65777d'}/>)}<path d="M-40 150 L20 205 -30 260 30 315" fill="none" stroke={K.paper} strokeWidth="12"/><rect x="-420" y={220} width="840" height={220} fill="#335d71" opacity={.72}/></g>;
 return <g><Ring x={0} y={0} p={p} r={245} c={K.gold}/><TXT x={0} y={15} t={kind.replaceAll('-','・')} s={27}/></g>;
};

const Concept=({kind,p}:{kind:string;p:number})=>{
 if(kind==='taxpayer-recipient')return <g><R x={-380} y={-170} w={300} h={340} rx={22} c={K.blue}/><TXT x={-230} y={0} t="納税者" s={45}/><TXT x={0} y={15} t="↔" s={75} c={K.gold}/><R x={80} y={-170} w={300} h={340} rx={22} c={K.teal}/><TXT x={230} y={0} t="受給者" s={45}/></g>;
 if(kind==='safety-net'||kind==='last-insurance')return <g><path d="M-380 -120 Q-190 120 0 -20 Q190 120 380 -120" fill="none" stroke={K.gold} strokeWidth="18"/>{[-2,-1,0,1,2].map(i=><circle key={i} cx={i*150} cy={-170+Math.abs(i)*30} r={45} fill={i===0?K.red:K.teal}/>) }<TXT x={0} y={220} t={kind==='last-insurance'?'最後の保険':'社会の床'} s={36}/></g>;
 if(kind==='bill-recipient')return <g><R x={-350} y={-180} w={280} h={360} rx={18} c="#d8cfbc"/><TXT x={-210} y={0} t="請求書" s={38} c={K.ink}/><L x={-60} y={0} X={170} Y={-150} c={K.red} sw={8} p={ease(p)}/><L x={-60} y={0} X={170} Y={0} c={K.red} sw={8} p={ease(p)}/><L x={-60} y={0} X={170} Y={150} c={K.red} sw={8} p={ease(p)}/>{['医療','家族','警察'].map((t,i)=><TXT key={t} x={290} y={-140+i*145} t={t} s={30}/>)}</g>;
 if(kind==='fire-extinguisher')return <g><R x={-100} y={-260} w={200} h={480} rx={80} c={K.red}/><R x={-40} y={-330} w={80} h={100} rx={15} c="#656d71"/><TXT x={0} y={30} t="非常用" s={34}/></g>;
 return <Chart kind={kind==='floor-vs-hole'?'floor-vs-hole':kind==='public-cost'?'public-cost':kind==='sinking-ship'?'sinking-ship':kind==='options-narrow'?'options-narrow':'support-floor'} p={p}/>;
};

export const WelfareSubject=({kind,p}:{kind:string;p:number})=>{const g=categoryFor(kind);
 if(g==='docs')return <Doc kind={kind} p={p}/>;
 if(g==='charts')return <Chart kind={kind} p={p}/>;
 if(g==='concepts')return <Concept kind={kind} p={p}/>;
 if(g==='devices'){
  if(kind==='fridge')return <g><R x={-210} y={-330} w={420} h={660} rx={25} c="#c8ced0" stroke="#67767c" sw={8}/><L x={-210} y={-70} X={210} Y={-70} c="#67767c" sw={7}/><R x={-120} y={30} w={180} h={50} rx={10} c="#d4c49b"/><TXT x={-30} y={65} t="食パン½" s={20} c={K.ink}/></g>;
  if(kind==='mailbox')return <g><R x={-260} y={-190} w={520} h={380} rx={25} c="#445963" stroke="#7c8c91" sw={8}/><R x={-170} y={-60} w={340} h={45} rx={7} c="#151f24"/><TXT x={0} y={90} t="住所" s={42}/></g>;
  if(kind==='charging')return <g><R x={-110} y={-240} w={220} h={480} rx={34} c="#17252d" stroke="#8b999d" sw={8}/><path d="M0 -80 L-45 20 H5 L-20 120 70 -10 H20Z" fill={K.gold}/></g>;
  return <g><R x={-120} y={-250} w={240} h={500} rx={38} c="#192831" stroke="#91a0a4" sw={9}/><circle cx={0} cy={190} r={18} fill={K.gold}/></g>;
 }
 if(g==='events')return <g><Ring x={0} y={0} p={p} r={230} c={K.gold}/><TXT x={0} y={15} t={kind.replaceAll('-','・')} s={32}/></g>;
 if(g==='people'){const label:Record<string,string>={'unemployed-man':'失業者','taxpayer-woman':'会社員',landlord:'大家',doctor:'医療',municipal:'行政',police:'警察',family:'家族',worker:'労働者',crowd:'社会',researcher:'研究'};return <g><circle r={150} fill="#263a43" stroke={kind==='unemployed-man'?K.red:kind==='taxpayer-woman'?K.blue:K.gold} strokeWidth={10}/><TXT x={0} y={15} t={label[kind]??kind} s={34}/></g>}
 throw Error('V111 category renderer missing '+kind);
};