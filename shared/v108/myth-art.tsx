import React from 'react';
import {R,L,P,Ring,q,lerp} from './primitives';
export const K={paper:'#efe6d6',ink:'#20313b',gold:'#d0ad6b',red:'#a95754',teal:'#6f9d96',blue:'#66889a',stone:'#83796f',wood:'#765e4b',night:'#101923'};
export const ease=(p:number)=>{const x=q(p);return x*x*(3-2*x)};
export const TXT=({x,y,t,s=36,c=K.paper,a='middle',o=1}:{x:number;y:number;t:string;s?:number;c?:string;a?:'start'|'middle'|'end';o?:number})=><text x={x} y={y} textAnchor={a} fontFamily="Noto Sans JP,sans-serif" fontWeight={740} fontSize={s} fill={c} opacity={o}>{t}</text>;
const list=(s:string)=>s.split(/\s+/);
export const objectGroups:Record<string,string[]>={
 serpent:list('orochi hydra kaliya vritra naga serpent'),
 hero:list('susanoo heracles krishna izanagi izanami orpheus eurydice zeus dyaus jupiter indra savitri satyavan yama storyteller trader child scholar'),
 artifact:list('sword sake-jars fire lyre torch boulder scroll book tablet thunder crown'),
 diagram:list('trio-comparison etymology-tree language-tree phylo-tree timeline trade-route river-map family-tree memory-cards attention-grid human-brain myth-tree convergence divergence question evidence-scale story-cards'),
 place:list('river yomi underworld temple market village camp laboratory library shrine mountain')
};
const membership=new Map(Object.entries(objectGroups).flatMap(([g,a])=>a.map(k=>[k,g])));
export const categoryFor=(k:string)=>{const g=membership.get(k);if(!g)throw Error('V108 unsupported object '+k);return g};
const Actor=({kind,p}:{kind:string;p:number})=>{const divine=/zeus|dyaus|jupiter|indra|krishna|susanoo/.test(kind),female=/izanami|eurydice|savitri/.test(kind),e=ease(p),robe=kind==='heracles'?'#8d6752':female?'#8b6a72':divine?'#6f7f92':'#786f66';return <g>
 <circle cx={0} cy={-175} r={74} fill="#c9a789" stroke={K.ink} strokeWidth={8}/>
 <P d="M-105 -96 Q0 -145 105 -96 L142 178 L-142 178Z" c={robe} stroke={K.ink} sw={8}/>
 <L x={-86} y={-55} X={-168+28*e} Y={78-18*e} c="#c9a789" sw={27}/><L x={86} y={-55} X={168-18*e} Y={78+20*e} c="#c9a789" sw={27}/>
 <L x={-62} y={174} X={-88} Y={314} c="#383d43" sw={31}/><L x={62} y={174} X={88} Y={314} c="#383d43" sw={31}/>
 {divine&&<Ring x={0} y={-178} p={p} r={116} c={K.gold}/>}
 {kind==='zeus'&&<P d="M145 -120 l70 55 -54 36 66 28 -118 96 35 -74 -58 -30Z" c={K.gold}/>}
 {kind==='susanoo'&&<g><L x={118} y={15} X={250} Y={-120} c={K.paper} sw={15}/><P d="M245 -126 l50 -25 -18 55Z" c={K.paper}/></g>}
 {kind==='heracles'&&<g><R x={-132} y={-76} w={70} h={244} c="#7c563d"/><R x={128} y={-90} w={34} h={260} c="#5a4737"/></g>}
 {kind==='krishna'&&<g><circle cx={0} cy={-176} r={72} fill="#668aa8" opacity=".65"/><P d="M-70 -252 Q0 -330 70 -252 Q0 -282 -70 -252Z" c={K.gold}/></g>}
 {kind==='orpheus'&&<g transform="translate(155 5) scale(.58)"><ellipse cx={0} cy={0} rx={110} ry={150} fill="none" stroke={K.gold} strokeWidth={18}/>{[-45,0,45].map(x=><L key={x} x={x} y={-120} X={x} Y={120} c={K.gold} sw={5}/>)}</g>}
 {kind==='trader'&&<R x={-175} y={-10} w={110} h={145} c="#8e765a"/>}
 {kind==='child'&&<g transform="scale(.78) translate(0 55)"><R x={-145} y={45} w={290} h={190} c="#b4a07e"/></g>}
 </g>};
const Serpent=({kind,p}:{kind:string;p:number})=>{const heads=kind==='orochi'?8:kind==='hydra'?9:kind==='kaliya'?7:kind==='vritra'?3:1,e=ease(p);return <g>
 <path d="M-400 170 C-260 -80 -80 270 60 40 S310 -100 420 155" fill="none" stroke={kind==='kaliya'?'#526c65':'#5d6658'} strokeWidth={92} strokeLinecap="round"/>
 {Array.from({length:heads},(_,i)=>{const ang=(-1.25+(i/(Math.max(1,heads-1)))*2.5),x=Math.sin(ang)*285,y=-70-Math.cos(ang)*145+(1-e)*34;return <g key={i} transform={'translate('+x+' '+y+') rotate('+(ang*32)+')'}><path d="M0 52 C-10 20 -4 -28 0 -115" fill="none" stroke={kind==='hydra'?'#66725f':kind==='kaliya'?'#4d675f':'#5f6657'} strokeWidth={48} strokeLinecap="round"/><ellipse cx={0} cy={-132} rx={48} ry={38} fill={kind==='hydra'?'#777a5f':'#68705d'} stroke={K.ink} strokeWidth={6}/><circle cx={-15} cy={-140} r={5} fill={K.gold}/><circle cx={15} cy={-140} r={5} fill={K.gold}/></g>})}
 {kind==='kaliya'&&<Ring x={0} y={-90} p={p} r={380} c={K.teal}/>}
 </g>};
const Artifact=({kind,p}:{kind:string;p:number})=>{const e=ease(p);
 if(kind==='sword')return <g transform={'rotate('+lerp(-20,8,e)+')'}><R x={-17} y={-250} w={34} h={440} c="#c4c8c4"/><P d="M-17 -250 L0 -330 17 -250Z" c="#d8ddd8"/><R x={-90} y={178} w={180} h={24} c={K.gold}/><R x={-22} y={202} w={44} h={110} c="#6f4e3d"/></g>;
 if(kind==='sake-jars')return <g>{Array.from({length:8},(_,i)=><g key={i} transform={'translate('+((i%4)*150-225)+' '+(Math.floor(i/4)*190-80)+')'} opacity={q(e*2-i*.08)}><P d="M-48 -55 Q0 -90 48 -55 L60 62 Q0 100 -60 62Z" c="#9d8164" stroke={K.gold} sw={5}/><R x={-28} y={-78} w={56} h={28} c="#655244"/></g>)}</g>;
 if(kind==='fire')return <g>{[0,1,2,3,4].map(i=><P key={i} d={'M'+(-140+i*70)+' 120 Q'+(-120+i*70)+' '+(-120-50*Math.sin(e*Math.PI*2+i))+' '+(-80+i*70)+' 120Z'} c={i%2?K.gold:K.red} o={.7}/>)}</g>;
 if(kind==='lyre')return <g><ellipse cx={0} cy={0} rx={190} ry={260} fill="none" stroke={K.gold} strokeWidth={28}/>{[-80,-40,0,40,80].map(x=><L key={x} x={x} y={-210} X={x} Y={210} c={K.paper} sw={7}/>)}</g>;
 if(kind==='torch')return <g><L x={0} y={120} X={0} Y={-120} c="#6f4e39" sw={36}/><P d="M-65 -120 Q0 -300 65 -120 Q0 -30 -65 -120Z" c={K.gold}/><P d="M-35 -120 Q0 -230 35 -120 Q0 -70 -35 -120Z" c={K.red}/></g>;
 if(kind==='boulder')return <g><circle cx={0} cy={0} r={250} fill="#6c6965" stroke="#9a9187" strokeWidth={14}/><path d="M-150 -30 q90 -120 180 -80 M-50 130 q120 -80 210 -20" fill="none" stroke="#4c4c4b" strokeWidth={12}/></g>;
 if(kind==='thunder')return <P d="M-40 -300 L115 -120 18 -80 110 30 -75 285 -10 75 -122 92 10 -100 -78 -125Z" c={K.gold}/>;
 if(kind==='crown')return <P d="M-240 130 L-190 -170 -55 5 0 -230 65 5 200 -175 240 130Z" c={K.gold} stroke="#8c6b3c" sw={9}/>;
 const label=kind==='scroll'?'古い記録':kind==='book'?'物語':kind==='tablet'?'記録':'資料';
 return <g><R x={-280} y={-300} w={560} h={600} rx={18} c="#c8b793" stroke={K.wood} sw={8}/>{[0,1,2,3,4,5].map(i=><R key={i} x={-215} y={-185+i*72} w={430-(i%3)*70} h={12} c={i===2?K.red:'#72675a'} o={.72}/>)}<TXT x={0} y={240} t={label} s={31} c={K.ink}/></g>;
};
const Diagram=({kind,p}:{kind:string;p:number})=>{const e=ease(p);
 if(kind==='question')return <TXT x={0} y={170} t="？" s={420} c={K.gold}/>;
 if(kind==='trio-comparison')return <g>{['日本','ギリシア','インド'].map((t,i)=><g key={t} transform={'translate('+(-360+i*360)+' 0)'} opacity={q((e-i*.12)*2)}><circle r={120} fill={i===0?'#8e5954':i===1?'#657d8d':'#6b8a78'} stroke={K.gold} strokeWidth={8}/><TXT x={0} y={20} t={t} s={36}/></g>)}</g>;
 if(kind==='etymology-tree'||kind==='language-tree'||kind==='phylo-tree'||kind==='myth-tree'||kind==='family-tree'){const names=kind==='etymology-tree'?['*Dyēus','Zeus','Dyaus','Jupiter']:kind==='phylo-tree'?['祖先物語','A','B','C']:kind==='language-tree'?['祖語','西','南','東']:['物語','伝承A','伝承B','伝承C'];return <g><L x={0} y={-250} X={0} Y={-80} c={K.gold} sw={10} p={e}/>{[-330,-110,110,330].map((x,i)=><g key={i}><L x={0} y={-80} X={x} Y={145} c={i%2?K.teal:K.gold} sw={8} p={q(e-i*.1)}/><circle cx={x} cy={180} r={84} fill={i?'#596f78':'#785c58'} stroke={K.paper} strokeWidth={6}/><TXT x={x} y={192} t={names[i]||''} s={26}/></g>)}</g>}
 if(kind==='trade-route'||kind==='river-map'){return <g><R x={-520} y={-280} w={1040} h={560} rx={20} c="#9d927a" o={.78}/><path d="M-430 145 Q-240 -210 0 25 T430 -145" fill="none" stroke={K.gold} strokeWidth={15} strokeDasharray="32 20" strokeDashoffset={850*(1-e)}/>{[-410,-120,180,420].map((x,i)=><circle key={i} cx={x} cy={i%2?0:130} r={30} fill={i%2?K.teal:K.red}/>)}</g>}
 if(kind==='attention-grid'){return <g>{Array.from({length:16},(_,i)=>{const x=-360+(i%4)*240,y=-250+Math.floor(i/4)*170,is=i===10;return <g key={i} opacity={q((e-i*.025)*1.4)}>{is?<path d={'M'+(x-70)+' '+y+' q80 -90 150 0 q-80 90 -150 0'} fill="none" stroke={K.red} strokeWidth="20"/>:<circle cx={x} cy={y} r={45} fill={i%2?K.gold:K.teal}/>}</g>})}</g>}
 if(kind==='memory-cards'||kind==='story-cards'){return <g>{[0,1,2].map(i=><g key={i} transform={'translate('+(-360+i*360)+' 0)'}><R x={-130} y={-235} w={260} h={470} rx={18} c="#c6b999" stroke={i===1?K.gold:'#665c52'} sw={10}/><TXT x={0} y={-80} t={i===0?'日常':i===1?'少し不思議':'不思議すぎる'} s={25} c={K.ink}/><R x={-90} y={20} w={180} h={18} c={i===1?K.red:'#827565'}/><R x={-90} y={78} w={(90+70*i)*e} h={35} c={i===1?K.gold:K.teal}/></g>)}</g>}
 if(kind==='human-brain')return <g><path d="M-250 40 Q-310 -150 -130 -250 Q0 -350 130 -250 Q315 -160 250 35 Q330 180 140 230 Q0 320 -145 230 Q-330 180 -250 40Z" fill="#876d72" stroke={K.paper} strokeWidth={11}/>{[0,1,2,3,4].map(i=><path key={i} d={'M'+(-165+i*70)+' '+(-150+i%2*80)+' q70 45 125 0'} fill="none" stroke={K.gold} strokeWidth="8"/>)}</g>;
 if(kind==='evidence-scale')return <g><L x={0} y={-250} X={0} Y={230} c={K.gold} sw={12}/><L x={-330} y={-90} X={330} Y={-90} c={K.gold} sw={10}/><P d="M-410 -85 L-250 -85 -330 70Z" c="#657f82"/><P d="M250 -85 L410 -85 330 70Z" c="#8a675f"/><TXT x={-330} y={145} t="類似" s={29}/><TXT x={330} y={145} t="証拠" s={29}/></g>;
 if(kind==='convergence'||kind==='divergence')return <g>{[-330,0,330].map((x,i)=><g key={i}><circle cx={x} cy={-160} r={55} fill={i%2?K.gold:K.teal}/><L x={x} y={-100} X={kind==='convergence'?0:x*1.25} Y={220} c={i%2?K.gold:K.teal} sw={11} p={e}/></g>)}</g>;
 return <g><Ring x={0} y={0} p={p} r={250} c={K.gold}/><TXT x={0} y={18} t={kind.replaceAll('-','・')} s={34}/></g>;
};
const Place=({kind,p}:{kind:string;p:number})=><g><R x={-430} y={-220} w={860} h={440} rx={18} c="#536269" o={.72}/><TXT x={0} y={20} t={kind==='underworld'||kind==='yomi'?'死者の世界':kind==='laboratory'?'実験室':kind==='market'?'古代の市場':kind==='library'?'書物の部屋':kind==='shrine'?'神話と系譜':kind} s={52}/><Ring x={0} y={0} p={p} r={310} c={K.gold}/></g>;
export const MythSubject=({kind,p}:{kind:string;p:number})=>{const g=categoryFor(kind);if(g==='serpent')return <Serpent kind={kind} p={p}/>;if(g==='hero')return <Actor kind={kind} p={p}/>;if(g==='artifact')return <Artifact kind={kind} p={p}/>;if(g==='diagram')return <Diagram kind={kind} p={p}/>;if(g==='place')return <Place kind={kind} p={p}/>;throw Error('V108 object category missing '+kind);};