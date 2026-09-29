import React from 'react';
import {C,R,L,P,Person,Vehicle,Ring,q,lerp} from './primitives';

const G='#d6b47e',W='#f1eade',RUBY='#a45a59',SEA='#77a5a1',INK='#263744',PAPER='#dbc8a9';
const list=(s:string)=>new Set(s.trim().split(/\s+/));
export const objectGroups:Record<string,Set<string>>={
 people:list('officers general pikemen pike-formation mercenaries swiss-soldiers refugees family households scholar neutral-diplomat diplomats delegates multilingual-people voters debate-delegates generic-strategist border-officer'),
 landscapes:list('lake mountain village ravine town-mountain mountain-cross-section swiss-aerial fortress un-building swiss-flag peace-symbol'),
 maps:list('occupied-map neighbor-map encircled-map western-front-map swiss-border-map cantons-map buffer-map postwar-map relief-map cold-war-map alliance-map europe-treaty-map invasion-1798 trade-1940-map trade-routes pass-route trade-moral-crossroads france-hypothesis austria-hypothesis war-damage-map war-hypothesis'),
 documents:list('archive-scroll neutrality-treaty westphalia-scroll republic-decree treaty-border history-book strategy-board reduit-plan unexecuted-plan trade-ledger gold-ledger gold-provenance audit-document archive-files admission-ledger refusal-document mercenary-contract diplomatic-letter diplomatic-letters diplomatic-seals hague-convention policy-folder initiative-document sanctions-document government-concern support-argument trust-concern strategic-ledger cost-ledger diplomatic-letters year-1515 year-1618 year-1815 year-1907 year-1942 year-1996 year-2022 year-1942 citizen-application'),
 diagrams:list('neutrality-scales cost-scales border-paths border-arrow border-arrows army-markers troop-markers fortress-markers city-markers defense-positions troop-chokepoint causal-branches supply-lines diplomacy-routes embassy-link neutrality-band neutral-buffer trade-routes treaty-fortress deterrence-symbol division-line bloc-arrows three-pillars four-pillars pike-flag flag-shield policy-options policy-branches sanctions-versus-arms territory-rules alliance-partnership switzerland-map country-cards neutral-diplomacy-diagram two-rulebooks two-churches neutrality-seal threat-arrow diplomatic-seals referendum-chart un-timeline war-timeline history-ribbon timeline-1515 year-1515 year-1618 year-1815 year-1907 year-1942 year-1996 year-2022 question'),
 artifacts:list('swiss-soldiers pike-formation battle-formations swiss-aerial village fortress gold-vault gold-ingot border-post factory-bank factory-train trade-crates supply-items cargo-train mountain-train supply-train country-cards open-gate closed-gate ballot-2026 vote-chart'),
 simulations:list('hypothetical-arrow hypothetical-occupation hypothetical-siege france-hypothesis austria-hypothesis invasion-1798 war-hypothesis'),
};
const memberships=Object.fromEntries(Object.entries(objectGroups).flatMap(([g,s])=>[...s].map(k=>[k,g])));
export const categoryFor=(kind:string)=>{
 const g=memberships[kind];
 if(!g)throw Error('V106 visual object unassigned, no generic substitution: '+kind);
 return g;
};
const title:Record<string,string>={
 'neutrality-treaty':'1815年　永世中立','westphalia-scroll':'ヴェストファーレン条約　1648',
 'archive-scroll':'歴史資料','republic-decree':'1798年　新体制','unexecuted-plan':'スイス侵攻計画案　実施されず',
 'initiative-document':'中立イニシアチブ','hague-convention':'1907年　ハーグ条約',
 'government-concern':'政府側の主張','support-argument':'提案側の主張','sanctions-document':'経済制裁',
 'refusal-document':'入国を拒否する記録','admission-ledger':'入国・受入れ記録','gold-ledger':'金の取引',
 'gold-provenance':'金の由来を調査','strategic-ledger':'戦略上の負担','cost-ledger':'利益と費用',
 'neutral-diplomacy-diagram':'仲介・利益代表','history-book':'スイス中立の歴史',
 'mercenary-contract':'傭兵の契約','audit-document':'歴史資料の調査','policy-folder':'中立政策',
 'citizen-application':'自国民の保護','diplomatic-letter':'外交文書','diplomatic-letters':'外交連絡',
 'diplomatic-seals':'外交上の承認','year-1515':'1515','year-1618':'1618','year-1815':'1815',
 'year-1907':'1907','year-1942':'1942','year-1996':'1996年','year-2022':'2022',
 'timeline-1515':'1515年以降','reduit-plan':'国家堡塁','trade-ledger':'通商記録',
 'neutrality-seal':'中立','country-cards':'ヨーロッパの国々','neutrality-scales':'中立の法と実際',
 'cost-scales':'侵攻の利益と負担','treaty-border':'承認と国境','question':'？',
};
const badge=(s:string,y=295)=><g><R x={-245} y={y} w={490} h={58} rx={8} c="#172630" o={.92}/><text x={0} y={y+38} textAnchor="middle" fontSize={32} fontWeight={740} fill={W} fontFamily="Noto Sans JP,sans-serif">{s}</text></g>;
const SwissCross=({x=0,y=0,s=1}:{x?:number;y?:number;s?:number})=><g transform={'translate('+x+' '+y+') scale('+s+')'}><R x={-35} y={-103} w={70} h={206} c={W}/><R x={-103} y={-35} w={206} h={70} c={W}/></g>;
const PersonActor=({kind,p=0,verb='stand'}:{kind:string;p?:number;verb?:string})=>{
 const soldier=/soldiers|officers|general|pikemen|mercenaries/.test(kind),historical=kind==='pikemen'||kind==='mercenaries',political=/diplomat|delegates|strategist/.test(kind);
 const pose=verb==='march'||verb==='walk'||verb==='approach'||verb==='enter'?'walk':verb==='point'||verb==='present'?'point':verb==='unpack'||verb==='receive'?'carry':verb==='review'||verb==='examine'?'read':'stand';
 const role=soldier?'soldier':political?'diplomat':kind==='scholar'?'teacher':kind==='voters'?'modern':kind==='refugees'?'traveler':kind==='border-officer'?'police':kind==='family'?'modern':'modern';
 const groups=/officers|soldiers|pikemen|mercenaries|voters|diplomats|delegates|people|refugees|households/.test(kind);
 const count=groups?(kind==='officers'?4:kind==='pikemen'?5:kind==='refugees'?3:4):1;
 return <g>{Array.from({length:count},(_,i)=>{
 const x=groups?-270+i*178:0,sc=groups?.60+(i%3)*.06:1.04;
 return <g key={i} transform={'translate('+x+' '+(groups?80+i%2*28:0)+') scale('+sc+')'}>
  <Person x={0} y={-90} s={1} pose={pose} p={p} role={role as any} dir={i%2?-1:1}/>
  {soldier&&<g><P d="M-58 -133 Q-69 -215 0 -230 Q65 -215 58 -133Z" c={historical?'#6d6f68':'#596f66'}/><R x={-66} y={-148} w={132} h={18} c="#35494b"/>{historical&&<L x={95} y={-225} X={91} Y={260} c="#c4ad85" sw={8}/>}</g>}
  {kind==='scholar'&&<g><R x={-44} y={-106} w={36} h={7} c={INK}/><R x={12} y={-106} w={36} h={7} c={INK}/><L x={-7} y={-100} X={11} Y={-100} c={INK} sw={5}/></g>}
  {political&&<g><P d="M-20 19 L0 83 L20 19 L0 11Z" c={RUBY}/><R x={-56} y={-74} w={110} h={13} c="#444550"/></g>}
  {(kind==='refugees'||kind==='family')&&<g><R x={-70} y={125} w={68} h={77} c="#a58f75" stroke="#604b45" sw={5}/><L x={-35} y={129} X={-35} Y={112} c="#604b45" sw={9}/></g>}
 </g>})}</g>;
};
const mountain=(kind:string,p:number)=><g>
 <P d="M-440 245 L-260 -100 L-110 65 L70 -272 L260 4 L430 245Z" c="#536671" stroke="#aeb6af" sw={8}/>
 <P d="M-25 -135 L70 -272 L155 -116 L92 -163 L61 -113Z M-302 -31 L-260 -100 L-220 -28Z" c="#d4d8d3"/>
 <P d="M-430 250 L-280 80 L-70 201 L145 50 L445 250Z" c="#394c53"/>
 {kind==='lake'&&<g><path d="M-445 245 Q0 206 445 245 V330 H-445Z" fill="#4d7785"/>{[0,1,2].map(i=><L key={i} x={-360+i*230} y={266+i*18} X={30+i*230} Y={266+i*18} c="#aec2ba" sw={4} o={.43}/>)}</g>}
 {kind==='fortress'&&<g><R x={-86} y={44} w={207} h={146} c="#90978f" stroke="#555f64" sw={10}/><R x={3} y={72} w={71} h={109} c="#29323b"/><R x={-70} y={78} w={50} h={22} c="#272f31"/></g>}
 {kind==='village'&&[0,1,2].map(i=><g key={i}><R x={-298+i*200} y={105+i%2*32} w={126} h={96} c="#93816f"/><P d={'M'+(-310+i*200)+' '+(105+i%2*32)+' l76 -62 75 62Z'} c="#514746"/></g>)}
 {kind==='mountain-cross-section'&&<g><path d="M-438 245 H442" stroke={G} strokeWidth="11" strokeDasharray="24 18"/><path d="M-315 165 Q0 -10 347 170" fill="none" stroke="#d7c186" strokeWidth="8"/><path d="M-305 166 L-215 167 M260 163 L335 166" stroke={RUBY} strokeWidth="15"/></g>}
 <g opacity={q(p)}><circle cx={350} cy={-192} r={44} fill={G} opacity=".46"/></g>
 </g>;
const Paper=({kind,p}:{kind:string;p:number})=>{
 const txt=title[kind]||({
'gold-provenance':'取引の来歴','archive-files':'公文書','strategy-board':'作戦計画','treaty-fortress':'外交と防衛',
'initiative-document':'中立の制度','policy-options':'政策上の選択','trust-concern':'中立への懸念',
'trade-ledger':'輸出・輸入の記録','sanctions-document':'経済的な措置','hague-convention':'中立法'
}as Record<string,string>)[kind]||'記録・資料';
 return <g transform={'rotate('+lerp(-4,2,p)+')'}><R x={-255} y={-270} w={510} h={520} c="#d6c4a6" stroke="#8d7c66" sw={9}/>
  <P d="M172 -270 L255 -183 L172 -183Z" c="#b2a080"/><R x={-212} y={-214} w={425} h={65} c="#584f4d" o={.78}/>
  <text x={0} y={-170} fill={W} fontSize={txt.length>14?25:31} textAnchor="middle" fontFamily="Noto Sans JP" fontWeight={700}>{txt}</text>
  {Array.from({length:6},(_,i)=><g key={i}><R x={-194} y={-115+i*58} w={375-i%3*45} h={7} c="#877861" o={.58}/><R x={-194} y={-96+i*58} w={296-i%2*72} h={4} c="#95876c" o={.47}/></g>)}
  <g opacity={q((p-.45)*3)}><circle cx={118} cy={133} r={60} fill="none" stroke={RUBY} strokeWidth={10}/><path d="M75 129 L105 154 L161 97" fill="none" stroke={RUBY} strokeWidth={12}/></g>
 </g>;
};
const MapSubject=({kind,p}:{kind:string;p:number})=>{
 const old=/1515|1618|1798|1815|history|westphalia/.test(kind),t=q(p);
 const sensitive=/hypothetical|hypothesis|war-hypothesis/.test(kind);
 return <g><R x={-540} y={-320} w={1080} h={640} rx={16} c={old?'#bbad90':'#98a39e'} stroke={G} sw={10} o={.88}/>
 <path d="M-480 -134 L-300 -240 L-101 -173 L23 -224 L191 -115 L315 -176 L493 -47 L453 177 L304 237 L166 173 L15 262 L-160 163 L-353 218 L-486 29Z" fill="#7f9391" opacity=".72" stroke="#e2dbc7" strokeWidth="10"/>
 <path d="M-196 80 L-125 -24 L15 -85 L189 -52 L218 69 L102 142 L-39 123Z" fill="#a95e58" stroke="#f6efdd" strokeWidth="9"/>
 <SwissCross x={25} y={41} s={.32}/>
 {['buffer-map','neighbor-map','encircled-map','cold-war-map','postwar-map','alliance-map'].includes(kind)&&<g>
  <R x={-441} y={-100} w={194} h={125} c="#536e86" o={.65}/><R x={290} y={-90} w={178} h={125} c="#94735b" o={.58}/>
  <text x={-344} y={-126} textAnchor="middle" fill={INK} fontSize={28} fontWeight={700} fontFamily="Noto Sans JP">西側</text><text x={365} y={-117} textAnchor="middle" fill={INK} fontSize={28} fontWeight={700} fontFamily="Noto Sans JP">東側</text>
 </g>}
 {['relief-map','reduit-plan','troop-chokepoint'].includes(kind)&&<g><P d="M-186 70 L-105 -33 L-40 28 L15 -65 L124 70Z" c="#e3e3d9" o={.75}/><L x={-150} y={83} X={175} Y={83} c={G} sw={10} dash="20 12"/></g>}
 {kind==='invasion-1798'&&<g><L x={-360} y={-25} X={-190+165*t} Y={15} c={RUBY} sw={23} p={t}/>{badge('1798年　侵攻の概念図',210)}</g>}
 {(kind==='occupied-map'||kind==='encircled-map'||kind==='western-front-map')&&<g><path d="M-425 -193 L-130 -235 L-40 -160 L-125 -78 L-289 -69Z" fill={RUBY} opacity=".82"/><path d="M260 -160 L452 -45 L398 167 L215 194 L245 85Z" fill="#7e7271" opacity=".82"/></g>}
 {kind==='trade-routes'&&[0,1,2].map(i=><path key={i} d={'M'+(-400+i*10)+' '+(-190+i*180)+' Q0 '+(-260+i*90)+' '+(360-i*5)+' '+(-180+i*130)} stroke={i%2?G:SEA} strokeWidth="9" strokeDasharray="18 12" fill="none" strokeDashoffset={260*(1-t)}/>)}
 <text x={0} y={264} textAnchor="middle" fontSize={32} fontWeight={650} fill={INK} fontFamily="Noto Sans JP">{sensitive?'仮定のシミュレーション':(title[kind]||'地理・国際関係の概念図')}</text>
 </g>;
};
const Icon=(kind:string,p:number)=> {
 if(/train|rail/.test(kind))return <g><R x={-300} y={-105} w={600} h={220} rx={18} c="#657b81" stroke={G} sw={11}/>{[0,1,2,3,4].map(i=><R key={i} x={-256+i*111} y={-64} w={72} h={68} c="#b5bcb6"/>)}{[-198,10,200].map(x=><g key={x}><circle cx={x} cy={127} r={38} fill="#243643" stroke={G} strokeWidth="10"/><circle cx={x} cy={127} r={18} fill="#a5a49c"/></g>)}<P d="M-300 -30 L-390 130 L-300 103Z" c="#6b777b"/></g>;
 if(/gold/.test(kind))return <g>{[0,1,2,3,4,5].map(i=><g key={i} opacity={q(p*2-i*.18)}><P d={'M'+(-205+i%3*145)+' '+(-30+Math.floor(i/3)*130)+' l96 -38 101 42 -98 36Z'} c="#e7c576" stroke="#a67d45" sw={8}/><R x={-205+i%3*145} y={5+Math.floor(i/3)*130} w={101} h={71} c="#b68d4c"/></g>)}</g>;
 if(/flag|neutrality-seal|peace-symbol/.test(kind))return <g><R x={-235} y={-238} w={470} h={472} c="#aa5156" stroke={G} sw={9}/><SwissCross s={.73}/></g>;
 if(kind==='fortress')return mountain('fortress',p);
 if(/factory|warehouse|bank/.test(kind))return <g><R x={-320} y={-105} w={640} h={312} c="#64797f"/>{[0,1,2].map(i=><R key={i} x={-270+i*190} y={-65} w={128} h={121} c="#acc2ba"/>)}<R x={165} y={-300} w={82} h={204} c="#8c8273"/><P d="M-330 -105 L-180 -225 -30 -105 140 -225 290 -105Z" c="#7d736d"/><R x={-60} y={65} w={120} h={142} c="#34434b"/></g>;
 if(/gate|border-post/.test(kind))return <g><R x={-280} y={-65} w={570} h={235} c="#83877c"/><R x={-229} y={-16} w={191} h={188} c="#3c5056"/><L x={-26} y={-220} X={-26} Y={173} c={G} sw={12}/><g transform={'rotate('+(-58*(kind==='closed-gate'?1-p:p))+' -26 -188)'}><R x={-26} y={-200} w={400} h={35} c="#d7d8d2"/>{[0,1,2,3,4].map(i=><R key={i} x={i*76} y={-200} w={35} h={35} c="#b05e5d"/>)}</g></g>;
 if(/chur|church/.test(kind))return <g>{[-160,160].map((x,i)=><g key={x}><R x={x-126} y={-110} w={252} h={320} c={i?'#a5917e':'#b6a78d'}/><P d={'M'+(x-140)+' -110 L'+x+' -256 L'+(x+140)+' -110Z'} c="#655e5c"/><R x={x-41} y={-21} w={82} h={231} c="#3e4549"/></g>)}</g>;
 if(/alliance|sanctions|territory|neutrality/.test(kind))return <g><circle r={215} fill="#486977" stroke={G} strokeWidth="15"/><SwissCross s={.63}/></g>;
 return null;
};
const diagramLabel=(key:string)=>({
'neutral-buffer':['フランス','スイス','オーストリア'],'neutrality-scales':['軍事的中立','外交・経済'],
'cost-scales':['侵攻による利益','占領の負担'],'three-pillars':['地理・防衛','外交','経済'],
'four-pillars':['地理','軍事','外交','経済'],'sanctions-versus-arms':['経済制裁','軍事支援'],
'policy-branches':['中立法','中立政策'],'policy-options':['軍事的中立','外交上の協力'],
'border-paths':['入国の許可','入国の拒否'],'alliance-partnership':['軍事同盟','協力関係'],
'treaty-fortress':['国際的承認','自国の防衛'],'two-rulebooks':['中立法','中立政策']
} as Record<string,string[]>)[key]||[];
const Diagram=({kind,p}:{kind:string;p:number})=>{
 const lbl=diagramLabel(kind),e=q(p);
 if(kind==='vote-chart')return <g><R x={-465} y={-290} w={930} h={630} rx={20} c="#243e49" stroke={G} sw={10}/><text x={0} y={-215} textAnchor="middle" fill={W} fontSize={43} fontWeight={750} fontFamily="Noto Sans JP">2026年9月27日　国民投票</text>
 <text x={-388} y={-90} fill={W} fontSize={37} fontFamily="Noto Sans JP">反対　70.15%</text><R x={-387} y={-62} w={720*.7015*e} h={72} c="#8ba8a5"/>
 <text x={-388} y={100} fill={W} fontSize={37} fontFamily="Noto Sans JP">賛成　29.85%</text><R x={-387} y={126} w={720*.2985*e} h={72} c={G}/>
 <text x={0} y={259} textAnchor="middle" fill={W} fontSize={27} fontFamily="Noto Sans JP">連邦統計局　暫定公式最終結果</text></g>;
 if(lbl.length)return <g>{lbl.map((s,i)=>{const x=(i-(lbl.length-1)/2)*(lbl.length===4?227:lbl.length===3?290:405);return <g key={i} opacity={q((e-i*.12)*2.2)} transform={'translate('+x+' '+(lbl.length===4?80:0)+')'}><R x={-lbl.length*24-87} y={-150} w={lbl.length*48+174} h={350} rx={18} c={i%2?'#435e67':'#6c6862'} stroke={G} sw={8}/><text x={0} y={18} textAnchor="middle" fill={W} fontSize={lbl.length===4?29:32} fontWeight={760} fontFamily="Noto Sans JP">{s}</text><L x={-100} y={85} X={100} Y={85} c={G} sw={10} o={.8}/></g>})}</g>;
 if(kind==='question')return <text x={0} y={130} fontSize={450} fill={G} fontFamily="Noto Sans JP" textAnchor="middle" fontWeight={850}>？</text>;
 if(/year-|timeline|war-timeline|history-ribbon|un-timeline/.test(kind))return <g><L x={-425} y={135} X={425} Y={135} c={G} sw={11}/>{[0,1,2,3].map(i=><g key={i}><circle cx={-345+i*227} cy={135} r={16} fill={i%2?SEA:G}/><R x={-425+i*227} y={-105} w={157} h={85} c="#68737a" stroke={G} sw={4}/></g>)}{badge(title[kind]||'歴史の時間軸',230)}</g>;
 if(/arrow|position|marker|routes|lines|troop|division|band|path|branch|chokepoint|bloc|trade|deterrence|embassy|rule|flag|pike/.test(kind))return <g>{[0,1,2].map(i=><g key={i}><circle cx={-275+i*273} cy={-148+i%2*145} r={58} fill={i===1?'#bb8f64':'#67858b'} stroke={G} strokeWidth="7"/><path d={'M'+(-275+i*273)+' '+(-92+i%2*145)+' L'+(-200+i*220)+' 170'} stroke={i%2?SEA:G} strokeWidth="12" strokeDasharray="30 16" fill="none" opacity={e}/></g>)}</g>;
 return <g>{Icon(kind,p)||<g><circle r={165} fill="none" stroke={G} strokeWidth="18"/></g>}<Ring x={0} y={0} p={p} r={230} c={SEA}/></g>;
};
export const SwissSubject=({kind,p=0,verb='reveal'}:{kind:string;p?:number;verb?:string})=>{
 const group=categoryFor(kind);
 if(group==='people')return <PersonActor kind={kind} p={p} verb={verb}/>;
 if(group==='landscapes'){
  if(kind==='swiss-flag'||kind==='peace-symbol')return Icon(kind,p);
  if(kind==='un-building')return <g><R x={-410} y={-150} w={820} h={380} c="#a5b9b4" stroke={G} sw={12}/>{[0,1,2,3,4,5,6].map(i=><R key={i} x={-364+i*102} y={-105} w={57} h={292} c="#6a9599"/>)}</g>;
  return mountain(kind,p);
 }
 if(group==='maps'||group==='simulations')return <MapSubject kind={kind} p={p}/>;
 if(group==='documents')return <Paper kind={kind} p={p}/>;
 if(group==='diagrams')return <Diagram kind={kind} p={p}/>;
 if(group==='artifacts'){
  if(kind==='vote-chart')return <Diagram kind={kind} p={p}/>;
  if(kind==='battle-formations')return <PersonActor kind="pikemen" p={p} verb={verb}/>;
  if(kind==='ballot-2026')return <g><Paper kind="initiative-document" p={p}/><text x={0} y={248} fill={INK} textAnchor="middle" fontSize={35} fontFamily="Noto Sans JP">投票用紙</text></g>;
  if(kind==='country-cards')return <Diagram kind="three-pillars" p={p}/>;
  if(kind==='swiss-soldiers')return <PersonActor kind={kind} p={p} verb={verb}/>;
  if(kind==='pike-formation')return <PersonActor kind="pikemen" p={p} verb={verb}/>;
  if(kind==='fortress')return mountain('fortress',p);
  if(kind==='swiss-aerial'||kind==='village')return mountain(kind,p);
  const obj=Icon(kind,p);if(obj)return obj;
  if(kind==='open-gate'||kind==='closed-gate')return Icon(kind,p);
  if(kind==='trade-crates'||kind==='supply-items')return <g>{[0,1,2,3].map(i=><g key={i} opacity={q(p*2-i*.18)}><R x={-320+(i%2)*290} y={-170+Math.floor(i/2)*174} w={255} h={159} c={i%2?'#8d765b':'#b09366'} stroke={G} sw={7}/><L x={-295+(i%2)*290} y={-146+Math.floor(i/2)*174} X={-101+(i%2)*290} Y={-36+Math.floor(i/2)*174} c="#5a5345" sw={6}/></g>)}</g>;
  throw Error('V106 object missing bespoke artifact art: '+kind);
 }
 throw Error('Unsupported V106 object category '+group);
};
