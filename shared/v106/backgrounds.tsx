import React from 'react';
import {staticFile} from 'remotion';
import {C,R,L,P,q} from './primitives';

export const environments:Record<string,string[]>={
lake:['rutli-lake-dawn','rutli-village','final-rutli-evening','final-rutli-officers','final-lake-night','final-rutli-stars','swiss-1940-aerial'],
alp:['alpine-bunker-exterior','alpine-fortress-panorama','alpine-ravine','alpine-slope-day','alpine-tunnel-entrance','alpine-strategic-paradox','mountain-siege-hypothesis','final-defense-map'],
historic:['mercenary-camp','mercenary-march','marignano-plain','post-marignano-road','religious-town-square','swiss-market-voices','refugee-road'],
fort:['bunker-war-room','reduit-war-room','operation-plans-archive','deterrence-room','rutli-map-table','rutli-assembly'],
parliament:['confederation-council','vienna-congress-hall','vienna-treaty-table','geneva-conference','public-debate-hall','berne-government-office'],
city:['swiss-plateau-factory','wartime-swiss-street','plateau-family-home','refugee-transition','medieval-recruitment','mobilization-yard','trade-railway'],
warehouse:['trade-warehouse','wartime-bank-vault','gold-refining-diagram','gold-origins-archive','trade-moral-crossroads'],
frontier:['wartime-border-evening','border-refugee-night','refugee-border-gate','swiss-1940-border','armed-neutrality-gate'],
archive:['historic-neutrality-archive','opening-history-book','helvetic-administration','westphalia-archive','historian-study','bergier-archive','refugee-policy-archive','refugee-ledger','gold-origins-archive','final-history-documents','neutrality-law-library','neutrality-policy-desk','neutrality-policy-desk','neutrality-sanctions-chart','diplomatic-split-room','neutral-embassy-room','neutrality-law-chart','referendum-proposal'],
map:['europe-1940-atlas','thirty-years-atlas','confederate-cantons-map','french-revolution-atlas','buffer-state-atlas','swiss-relief-map','reduit-strategy-map','trade-1940-map','postwar-europe-atlas','swiss-cold-war-atlas','modern-crisis-atlas','nato-partnership-atlas','noninvasion-analysis','wartime-economy-network','wartime-neutrality-diagram','cost-benefit-scales','neutral-diplomacy-diagram'],
laboratory:['bergier-archive','historian-study','refugee-policy-archive'],
modern:['geneva-un-palace','referendum-2026-station','referendum-results'],
abstract:['dark-question-space','swiss-neutrality-emblem','alpine-strategic-paradox','two-wars-timeline','great-power-balance','marignano-transition','marignano-outcome','vienna-transition','chapter2-transition','terrain-comparison','trade-moral-crossroads','humanitarian-question','cold-war-transition','neutrality-evolution-timeline','final-swiss-flag','final-three-conditions','final-four-eras','final-neutrality-seal','swiss-1940-border','gold-refining-diagram','gold-origins-archive','refugee-border-gate','refugee-ledger','noninvasion-analysis','neutrality-law-chart','neutrality-sanctions-chart','neutral-diplomacy-diagram','diplomatic-split-room','referendum-proposal','referendum-results','wartime-economy-network','wartime-neutrality-diagram','neutrality-policy-desk','mountain-siege-hypothesis','alpine-strategic-paradox','final-defense-map','trade-1940-map'],
logistics:['trade-railway','trade-warehouse','swiss-plateau-factory','wartime-swiss-street'],
rail:['alpine-tunnel-entrance','trade-railway']
};
const assetBg:Record<string,string>={
'dark-question-space':'BG_darkroom.png','bergier-archive':'BG_kenkyu.png',
'historian-study':'BG_honndana.png','neutrality-law-library':'BG_syosai.png'
};
const label:Record<string,string>={
'rutli-lake-dawn':'1940年7月　リュトリ','rutli-assembly':'リュトリの将校集会',
'europe-1940-atlas':'1940年のヨーロッパ　概念図',
'mercenary-camp':'スイス傭兵の時代','marignano-plain':'1515年　マリニャーノ',
'thirty-years-atlas':'1618〜1648年　三十年戦争',
'french-revolution-atlas':'1798年　フランスの侵攻　概念図',
'vienna-congress-hall':'1815年　ウィーン会議',
'buffer-state-atlas':'ヨーロッパの勢力均衡　概念図',
'swiss-1940-border':'1940年　スイスの国境',
'reduit-war-room':'スイス軍の山岳防衛構想',
'alpine-fortress-panorama':'アルプス　山岳要塞',
'operation-plans-archive':'ドイツ側の侵攻計画案　未実施',
'wartime-bank-vault':'第二次世界大戦中の金融取引',
'bergier-archive':'1990年代以降の歴史調査',
'border-refugee-night':'第二次世界大戦中の国境',
'refugee-policy-archive':'難民政策をめぐる歴史調査',
'geneva-un-palace':'ジュネーブ　国際機関',
'neutrality-law-library':'中立法と中立政策',
'modern-crisis-atlas':'2022年の国際情勢',
'referendum-2026-station':'2026年9月27日　スイス国民投票',
'referendum-results':'スイス連邦統計局　暫定公式最終結果'
};
const hash=(s:string)=>[...s].reduce((a,c)=>(a*33+c.charCodeAt(0))>>>0,37);
export const stageFor=(e:string)=>{
 // Specific sets take priority over generic symbolic overlays.
 for(const kind of ['modern','lake','alp','fort','frontier','historic','parliament','city','warehouse','archive','logistics','rail','map','laboratory','abstract']){
  if(environments[kind].includes(e))return kind;
 }
 throw Error('V106 environment lacks distinct authoring: '+e);
};
const ridge=(seed:number,y:number,color:string,op=1)=>{
 const pts=Array.from({length:16},(_,i)=>{const x=-80+i*144,height=65+((seed+i*91)%135);return x+','+(y-height)}).join(' ');
 return <P d={'M-100 1080 L'+pts.replaceAll(' ',' L')+' L2100 1080Z'} c={color} o={op}/>;
};
const Chalet=({x,y,seed=0}:{x:number;y:number;seed?:number})=><g><R x={x} y={y} w={200} h={150} c={seed%2?'#7b726c':'#8d7566'}/><P d={'M'+(x-20)+' '+y+' l120 -91 120 91Z'} c="#5a4b49"/><R x={x+28} y={y+31} w={48} h={55} c="#dbc3a5"/><R x={x+130} y={y+39} w={40} h={49} c="#434e52"/><R x={x+86} y={y+78} w={46} h={72} c="#514a43"/></g>;
const MilitaryTent=({x,y}:{x:number;y:number})=><g><P d={'M'+x+' '+y+' l170 -280 170 280Z'} c="#887963"/><L x={x+170} y={y-285} X={x+170} Y={y+40} c="#493d34" sw={8}/><P d={'M'+(x+160)+' '+(y-250)+' L'+(x+270)+' '+(y-210)+' L'+(x+160)+' '+(y-168)+'Z'} c="#a45c54"/></g>;
const ARCH=({x,y,w=260,h=420}:{x:number;y:number;w?:number;h?:number})=><g><R x={x} y={y+80} w={w} h={h-80} c="#6e6460"/><P d={'M'+x+' '+(y+81)+' Q'+(x+w/2)+' '+(y-96)+' '+(x+w)+' '+(y+81)+'Z'} c="#6e6460"/><R x={x+30} y={y+120} w={w-60} h={h-122} c="#40424c"/></g>;
const SwissCross=({x,y,s=1}:{x:number;y:number;s?:number})=><g transform={'translate('+x+' '+y+') scale('+s+')'}><R x={-42} y={-146} w={84} h={292} c="#f6f4ec"/><R x={-145} y={-42} w={290} h={84} c="#f6f4ec"/></g>;
const SwissBanner=({x,y,s=1}:{x:number;y:number;s?:number})=><g transform={'translate('+x+' '+y+') scale('+s+')'}><L x={0} y={-245} X={0} Y={243} c="#c5b18e" sw={12}/><P d="M10 -232 Q160 -252 280 -190 L280 -42 Q142 -107 10 -75Z" c="#b84c50"/><SwissCross x={140} y={-143} s={.36}/></g>;
const shelves=(seed:number)=><g>{[0,1,2,3].map(i=><g key={i}><R x={70+i*470+seed%24} y={104} w={402} h={650} c="#544742"/>{Array.from({length:5},(_,j)=><g key={j}><R x={90+i*470+seed%24} y={198+j*104} w={360} h={17} c="#9b8369"/>{Array.from({length:9},(_,k)=><R key={k} x={103+i*470+seed%24+k*39} y={143+j*104} w={28} h={54} c={['#70656d','#a28672','#6b8588','#856b5a'][k%4]}/>)}</g>)}</g>)}</g>;
const europeMap=<g><path d="M-190 200 L-55 75 L145 106 L273 -1 L410 36 L472 137 L664 80 L808 154 L890 60 L1070 76 L1190 -14 L1408 44 L1480 195 L1620 239 L1640 450 L1450 560 L1330 676 L1190 627 L1090 749 L882 702 L778 794 L566 723 L430 812 L221 704 L134 544 L-52 480Z" fill="#c0b69b" opacity=".38" stroke="#b5a281" strokeWidth="12"/>{[0,1,2,3,4,5].map(i=><path key={i} d={'M'+(310+i*225)+' 220 l-35 100 94 76 -70 123'} stroke="#7e8d86" strokeWidth="6" fill="none" opacity=".48"/>)}</g>;
export const Backdrop=({environment}:{environment:string})=>{
 const kind=stageFor(environment),seed=hash(environment),dark=kind==='lake'?'#263d4a':kind==='alp'?'#283b43':kind==='frontier'?'#252c35':kind==='historic'?'#494745':'#252f3c';
 const tint=['#c7b18b','#b6a9a0','#a8b6b4','#ad9997'][seed%4],asset=assetBg[environment];
 const year=label[environment]??environment.replaceAll('-','・').slice(0,31);
 return <g data-background={environment} data-style={kind}>
 <defs>
  <linearGradient id={'sky'+seed} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={dark}/><stop offset="100%" stopColor={kind==='lake'?'#627883':'#675f5a'}/></linearGradient>
  <linearGradient id={'hill'+seed} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#819098"/><stop offset="100%" stopColor="#36424d"/></linearGradient>
  <linearGradient id={'vign'+seed}><stop offset="0%" stopColor="#141e28" stopOpacity="0"/><stop offset="100%" stopColor="#141e28" stopOpacity=".22"/></linearGradient>
 </defs>
 <R x={0} y={0} w={1920} h={1080} c={'url(#sky'+seed+')'}/>
 {asset&&<g><image href={staticFile('assets/v106/'+asset)} x={0} y={0} width={1920} height={1080} preserveAspectRatio="xMidYMid slice"/><R x={0} y={0} w={1920} h={1080} c="#17212a" o={.46}/></g>}
 {(kind==='lake'||kind==='alp')&&<g>
  <circle cx={1510+seed%185} cy={170} r={seed%2?65:90} fill="#d6cbb6" opacity=".30"/>
  {ridge(seed,580,'#8f9698',.68)}{ridge(seed+47,720,'#5e7077',.93)}{ridge(seed+145,885,'#34444b')}
  {kind==='lake'&&<g><P d="M0 760 Q430 680 920 760 T1920 740 L1920 1080 H0Z" c={seed%2?'#385867':'#3a5763'}/>{[0,1,2,3,4,5].map(i=><path key={i} d={'M'+(170+i*270)+' '+(805+i%2*53)+' q115 -20 270 2'} fill="none" stroke="#bdc7b9" strokeWidth="7" opacity=".18"/>)}</g>}
  {environment==='rutli-village'&&[0,1,2,3].map(i=><Chalet key={i} x={70+i*440} y={695-i%2*40} seed={seed+i}/>)}
  {environment.includes('fortress')||environment.includes('bunker')?<g><P d="M710 760 L840 500 H1230 L1380 760Z" c="#5c6667"/><R x={865} y={595} w={320} h={144} c="#353e40" stroke="#a49c80" sw={13}/><R x={995} y={620} w={35} h={130} c="#1b2d35"/><R x={890} y={620} w={48} h={23} c="#b2b9b3"/></g>:null}
  {environment.includes('tunnel')&&<g><P d="M600 900 V560 Q890 250 1180 560 V900Z" c="#59656b"/><P d="M735 900 V560 Q890 380 1045 560 V900Z" c="#161f26"/><L x={770} y={925} X={905} Y={560} c="#9a9388" sw={14}/><L x={995} y={925} X={905} Y={560} c="#9a9388" sw={14}/></g>}
  {environment==='final-rutli-stars'&&[0,1,2,3,4,5,6,7].map(i=><circle key={i} cx={120+i*240} cy={80+(i*43)%140} r={2+i%3} fill="#ecede9" opacity=".7"/>)}
 </g>}
 {kind==='historic'&&<g><R x={0} y={770} w={1920} h={310} c="#756a58"/>{ridge(seed,710,'#62615a')}{[0,1,2,3].map(i=><g key={i}><Chalet x={80+i*470+(seed%29)} y={565+(i%2)*80} seed={seed+i}/></g>)}{environment==='mercenary-camp'&&[0,1,2,3].map(i=><MilitaryTent key={i} x={i*440+100} y={806}/>)}</g>}
 {(kind==='fort'||kind==='parliament'||kind==='archive')&&<g>
  <R x={0} y={804} w={1920} h={276} c={kind==='archive'?'#564a42':'#5d5250'}/>
  {!asset&&(kind==='archive'?shelves(seed):[0,1,2,3,4].map(i=><g key={i}><ARCH x={35+i*390} y={145+(i%2)*25} w={326} h={585-(i%2)*25}/></g>))}
  <R x={160+seed%77} y={730} w={1540} h={100} c={kind==='parliament'?'#8b7669':'#7a6654'}/><R x={245} y={825} w={50} h={220} c="#5e4c42"/><R x={1560} y={825} w={50} h={220} c="#5e4c42"/>
  {kind==='fort'&&<g><R x={700} y={190} w={550} h={400} c="#a89b81" stroke="#5e5550" sw={14}/>{[0,1,2].map(i=><L key={i} x={750+i*144} y={230} X={750+i*144} Y={555} c="#655c50" sw={5}/>)}</g>}
  {kind==='parliament'&&[0,1,2,3].map(i=><R key={i} x={300+i*415} y={760} w={185} h={65} c="#77635a"/>)}
 </g>}
 {kind==='city'&&<g><R x={0} y={786} w={1920} h={294} c="#666567"/>{Array.from({length:7},(_,i)=><g key={i}><R x={i*295-20+(seed%30)} y={230+i%3*100} w={246} h={565-i%3*100} c={['#7b7773','#677179','#8b7c75'][i%3]}/>{[0,1,2].map(j=><R key={j} x={i*295+10+j*65+(seed%30)} y={316+i%3*100} w={44} h={72} c="#cbb69a" o={j===1?.28:.46}/>)}</g>)}<R x={0} y={870} w={1920} h={28} c="#484b51"/><L x={50} y={970} X={1870} Y={970} c="#bbb1a1" sw={8} dash="44 38"/></g>}
 {kind==='warehouse'&&<g><R x={0} y={808} w={1920} h={272} c="#544a46"/>{[0,1,2,3].map(i=><g key={i}><R x={80+i*470} y={210} w={55} h={570} c="#75675b"/><R x={66+i*470} y={265} w={350} h={40} c="#b5a78e"/><R x={105+i*470} y={365} w={240} h={170} c={i%2?'#6f7474':'#877866'}/></g>)}<R x={310} y={730} w={1290} h={100} c="#7c6250"/>{environment==='wartime-bank-vault'&&<g><circle cx={970} cy={438} r={225} fill="#858b85" stroke="#c3ba9f" strokeWidth="23"/><circle cx={970} cy={438} r={155} fill="#5b6567" stroke="#242d31" strokeWidth="13"/>{[0,1,2,3,4,5].map(i=><L key={i} x={970} y={438} X={970+140*Math.cos(i*Math.PI/3)} Y={438+140*Math.sin(i*Math.PI/3)} c="#c6bdac" sw={14}/>)}</g>}</g>}
 {kind==='frontier'&&<g>{ridge(seed,690,'#566168')}{ridge(seed+105,770,'#3f5159')}<R x={0} y={796} w={1920} h={284} c="#626261"/><R x={395} y={445} w={350} h={352} c="#767776"/><P d="M370 445 L575 304 777 445Z" c="#4c4d52"/><R x={462} y={522} w={74} h={91} c="#b1a99b"/><R x={610} y={525} w={66} h={93} c="#363f43"/><R x={745} y={739} w={850} h={25} c="#9e9990"/>{[0,1,2,3,4].map(i=><R key={i} x={800+i*156} y={766} w={18} h={175} c="#b2a38b"/>)}</g>}
 {kind==='modern'&&<g><R x={0} y={810} w={1920} h={270} c="#676c6b"/>{[0,1,2,3,4,5].map(i=><g key={i}><R x={110+i*328} y={230-i%2*60} w={272} h={570+i%2*60} c={i%2?'#7d8784':'#81918d'}/>{[0,1,2].map(j=><R key={j} x={150+i*328+j*72} y={328-i%2*60} w={48} h={70} c="#bec7c1" o={.5}/>)}</g>)}{environment==='geneva-un-palace'&&<g><R x={500} y={360} w={930} h={480} c="#bbc2b9"/>{[0,1,2,3,4,5,6,7].map(i=><R key={i} x={555+i*104} y={390} w={62} h={415} c="#7f9b9e"/>)}</g>}{environment.includes('referendum')&&<g><R x={940} y={600} w={375} h={202} c="#a0b0af"/><R x={1095} y={592} w={96} h={16} c="#24333c"/><SwissBanner x={370} y={530} s={.7}/></g>}</g>}
 {(kind==='map'||kind==='abstract')&&<g><R x={0} y={840} w={1920} h={240} c="#253341"/><R x={100} y={120} w={1720} h={662} rx={22} c={kind==='map'?'#8a8b83':'#2f4350'} stroke={tint} sw={8} o={.76}/>{kind==='map'&&<g transform="translate(160 124) scale(.9)">{europeMap}</g>}{kind==='abstract'&&[0,1,2].map(i=><circle key={i} cx={400+i*550} cy={425+(i%2)*50} r={130+seed%51} fill="none" stroke={tint} strokeWidth="5" opacity=".21"/>)}</g>}
 {(kind==='rail'||kind==='logistics')&&<g><R x={0} y={862} w={1920} h={218} c="#55565a"/>{[0,1].map(i=><L key={i} x={0} y={945+i*66} X={1920} Y={945+i*66} c="#b5a588" sw={9}/>)}</g>}
 <R x={0} y={0} w={1920} h={1080} c="#0b1320" o={.09}/>
 <R x={64} y={64} w={10} h={63} c="#b7a17d"/><text x={96} y={104} fill="#f5eee1" fontSize={28} fontWeight={670} fontFamily="Noto Sans JP,sans-serif" opacity=".85">{year}</text>
 </g>;
};
