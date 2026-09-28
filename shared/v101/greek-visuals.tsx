import React from 'react';
import {C,R,L,P,q,lerp} from './primitives';

/*
 * V101 deliberately separates environment (no frame-dependent state) from the
 * foreground and its narration-indexed movement. Adjacent sentences in the
 * same environment therefore keep the background pixel-identical.
 */
export type StoryScene={
 id:string;phase:string;variant:number;narration:string;environment:string;
 primary:string;secondaries:string[];motion:string;label:string;
 actionId:string;sentenceIndex:number;subpart:number;subparts:number;
};
const navy='#111826',deep='#07121e',cream='#e4d6bd',marble='#d8c6a5',gold='#e0b46b',bronze='#8a6143',sea='#244e61',teal='#66999c',blood='#963e44',purple='#75627e',olive='#6b7555';
const clamp=q, rnd=(n:number)=>{const x=Math.sin(n*82.417)*43958.5453;return x-Math.floor(x)};
const hash=(s:string)=>Array.from(s).reduce((v,c)=>(v*31+c.charCodeAt(0))>>>0,7);
const path=(d:string,fill:string,stroke?:string,sw=3,opacity=1)=><path d={d} fill={fill} stroke={stroke||'none'} strokeWidth={sw} strokeLinejoin="round" strokeLinecap="round" opacity={opacity}/>;
const text=(x:number,y:number,t:string,size=34,color=cream)=><text x={x} y={y} fill={color} fontFamily="Noto Sans JP, sans-serif" fontWeight="700" fontSize={size} textAnchor="middle" paintOrder="stroke" stroke="rgba(8,15,22,.48)" strokeWidth="5">{t}</text>;
const actorLabels:Record<string,string>={zeus:'ゼウス',poseidon:'ポセイドン',athena:'アテナ',hera:'ヘラ',hades:'ハデス',demeter:'デメテル',persephone:'ペルセポネ',cronus:'クロノス',rhea:'レア',gaia:'ガイア',uranus:'ウラノス',prometheus:'プロメテウス',epimetheus:'エピメテウス',pandora:'パンドラ',heracles:'ヘラクレス',perseus:'ペルセウス',theseus:'テセウス',ariadne:'アリアドネ',daedalus:'ダイダロス',odysseus:'オデュッセウス',achilles:'アキレウス',hesiod:'ヘシオドス',homer:'ホメロス',hephaestus:'ヘパイストス',hermes:'ヘルメス',apollo:'アポロン',aphrodite:'アフロディテ',ares:'アレス',alcmena:'アルクメネ',cyclops:'キュクロプス'};
const actors=new Set('zeus poseidon athena hera hades demeter persephone cronus rhea gaia uranus prometheus epimetheus pandora heracles perseus theseus ariadne daedalus odysseus achilles hesiod homer hephaestus hermes apollo aphrodite ares alcmena cyclops medusa smith priest hero human proud-human fisherman fisher merchant farmer artisan sailor traveler guest host poet storyteller human-limits'.split(' '));
const collectives=new Set('gods heroes titans children companions siblings freed-siblings helpful-titans fishermen sailors worshippers shades family'.split(' '));
const names=new Set([...actors,...collectives]);
const motifColor=(name:string)=>{
 if(/poseidon|sea|ship|waves|sail/.test(name))return teal;
 if(/athena|owl|olive|perseus/.test(name))return '#8d9d86';
 if(/zeus|lightning|fire|torch|sun/.test(name))return gold;
 if(/hades|cronus|uranus|shadow|dark|tartarus/.test(name))return purple;
 if(/hera|pandora|rhea|persephone|ariadne|aphrodite/.test(name))return '#bd8b7b';
 if(/heracles|achilles|ares|lion|hydra/.test(name))return '#bb8060';
 if(/demeter|gaia|tree|grain|farmer/.test(name))return olive;
 return '#8b9b9a';
};
const labels:Record<string,string>={chaos:'カオス',tartarus:'タルタロス',eros:'エロス',elpis:'エルピス',glory:'クレオス',fire:'火',lightning:'雷',jar:'壺',shield:'盾',labyrinth:'迷宮',thread:'糸',ithaca:'イタケー',prophecy:'予言',cosmos:'世界',boundary:'限界',storm:'嵐',withered_grain:'不作',home:'故郷',map:'地図',trojan_walls:'トロイア',future_stars:'未来'};
const labelOf=(kind:string)=>actorLabels[kind]||labels[kind]||'';

export const Backdrop=({environment}:{environment:string})=>{
 const key=hash(environment),r1=rnd(key+21),r2=rnd(key+53);
 const water=/sea|harbor|port|aegean|ship|shore|depart|ithaca-dusk/.test(environment);
 const abyss=/void|vacuum|primordial|cosmic|lineage|celestial|lineage|fate/.test(environment);
 const underground=/subterranean|hades|crete-cave|medusa-sanctuary|labyrinth-interior|pandora-chamber/.test(environment);
 const palace=/olympus|cronus|succession|hera-chamber|rhea-chamber|court|heroes|god/.test(environment);
 const archive=/library|archive|tablet|mosaic|map|timeline|chess|strategy|architect|metis/.test(environment);
 const workshop=/forge|atelier|craft|night-forge/.test(environment);
 const wilderness=/forest|marsh|meadow|field|mountain|cliff|human-village|island/.test(environment);
 const ritual=/temple|altar|guest-house|granary|athens-acropolis|city/.test(environment);
 const labyrinth=/labyrinth/.test(environment);
 const storm=/storm|titan-battlefield|sea-obstacles/.test(environment);
 const base=abyss?'#080b1b':underground?'#1d1c28':water?'#203f54':palace?'#333047':archive?'#473d35':workshop?'#342c2e':wilderness?'#3a514d':ritual?'#5b524b':'#1b2937';
 const horizon=water?690:archive?790:underground?750:830;
 const cloudTint=water?'#73949a':abyss?'#6b557d':wilderness?'#8d9982':'#b3a193';
 const night=/night|void|vacuum|cosmic|storm|hades|underworld|fate|prometheus|sea-obstacles/.test(environment);
 return <g data-static-environment={environment}>
  <defs>
   <linearGradient id={'sky-'+key} x1="0" x2="0" y1="0" y2="1">
    <stop offset="0%" stopColor={night?'#070e21':base}/>
    <stop offset="100%" stopColor={night?'#3b4056':water?'#8c9e92':'#ab8c73'}/>
   </linearGradient>
   <linearGradient id={'water-'+key} x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#376c7a"/><stop offset="100%" stopColor="#112f43"/></linearGradient>
   <radialGradient id={'light-'+key}><stop offset="0%" stopColor={gold} stopOpacity=".8"/><stop offset="100%" stopColor={gold} stopOpacity="0"/></radialGradient>
  </defs>
  <R x={0} y={0} w={1920} h={1080} c={'url(#sky-'+key+')'}/>
  {(night||abyss)&&Array.from({length:47},(_,i)=><circle key={i} cx={35+rnd(key+i*43)*1850} cy={20+rnd(key+i*53)*650} r={1+3*rnd(key+i*41)} fill={cream} opacity={.14+.55*rnd(key+i*31)}/>)}
  {(!underground&&!archive&&!workshop)&&<g><circle cx={1500-620*r1} cy={140+150*r2} r={night?85:118} fill={night?'#cad1c7':'#f1cb8b'} opacity=".82"/>{Array.from({length:5},(_,i)=><ellipse key={i} cx={160+i*400+130*r1} cy={130+(i%3)*95} rx={120+i%2*45} ry={27+i%3*13} fill={cloudTint} opacity={.14+i*.025}/>)}</g>}
  {water&&<g>
   {Array.from({length:4},(_,i)=>path('M'+(-60+i*520)+' 700 Q'+(120+i*490)+' '+(460+i%2*80)+' '+(350+i*520)+' 700 Z',i%2?'#53665f':'#405b59',undefined,2,.8))}
   <R x={0} y={680} w={1920} h={400} c={'url(#water-'+key+')'}/>
   {Array.from({length:13},(_,i)=><path key={i} d={'M'+(i*170-40)+' '+(734+i%5*62)+' q80 -12 160 0'} fill="none" stroke="#a9c7bf" strokeWidth={2+(i%3)} opacity=".2"/>)}
   {/harbor|port|shore|crete-harbor|aegean-trade/.test(environment)&&<g><P d="M0 805 H570 L700 955 H0Z" c="#84715f"/>{Array.from({length:5},(_,i)=><g key={i}><R x={60+i*115} y={790} w={20} h={160} c="#6b5142"/><L x={70+i*115} y={807} X={70+i*115} Y={930} c="#3f312d" sw={3}/></g>)}<R x={95} y={690} w={100} h={85} c="#bba58a"/></g>}
  </g>}
  {abyss&&<g>
   <ellipse cx={960} cy={620} rx={600+150*r1} ry={320+80*r2} fill={'url(#light-'+key+')'} opacity=".5"/>
   {environment==='primordial-creation'&&<P d="M-40 930 Q420 490 800 755 T1960 705 L1960 1080 H0Z" c="#5b7560"/>}
   {environment==='earth-and-sky'&&<P d="M0 850 Q480 520 940 770 T1920 590 L1920 1080 H0Z" c="#547260"/>}
   {environment==='lineage-mosaic'&&Array.from({length:8},(_,i)=><L key={i} x={220+i*175} y={850} X={960} Y={190+i%3*65} sw={3} c={gold} o={.22}/>)}
  </g>}
  {underground&&<g>
   <P d={'M0 0 H1920 V280 Q1470 '+(100+100*r1)+' 1140 250 T360 290 L0 220Z'} c="#111420"/>
   <P d="M0 1080 V780 L210 600 L320 825 L580 620 L730 850 L1000 640 L1200 860 L1480 650 L1700 820 L1920 655 V1080Z" c="#24252b"/>
   {environment==='subterranean-prison'&&Array.from({length:9},(_,i)=><R key={i} x={130+i*180} y={170} w={17} h={720} c="#313643"/>)}
   {environment==='crete-cave'&&<g><ellipse cx={1060} cy={490} rx={360} ry={240} fill="#ad835a" opacity=".25"/><P d="M590 850 L870 530 L970 730 L1220 490 L1510 850Z" c="#6a604e"/></g>}
   {/hades/.test(environment)&&<g><R x={85} y={480} w={380} h={430} c="#343543"/>{Array.from({length:4},(_,i)=><R key={i} x={102+i*100} y={500} w={22} h={370} c="#5d5762"/>)}<P d="M0 920 Q650 800 1200 940 T1920 880" c="none" stroke="#536977" sw={44}/></g>}
   {/labyrinth/.test(environment)&&<g>{Array.from({length:5},(_,i)=><path key={i} d={'M'+(300+i*150)+' 170 V'+(830-i*44)+' H'+(1680-i*150)+' V'+(260+i*62)} fill="none" stroke={i%2?'#8d7c70':'#675d5a'} strokeWidth="54" opacity=".65"/>)}</g>}
  </g>}
  {(palace||ritual)&&<g>
   <R x={0} y={horizon} w={1920} h={1080-horizon} c={palace?'#5e5660':'#88715b'}/>
   {Array.from({length:palace?6:5},(_,i)=>{const x=95+i*(palace?345:415);return <g key={i}><R x={x} y={185+(i%2)*24} w={palace?80:74} h={630} c="#b7a68c"/><R x={x-17} y={159+(i%2)*24} w={palace?114:108} h={30} c={marble}/><R x={x-17} y={800} w={palace?114:108} h={40} c="#aa997f"/>{Array.from({length:5},(_,j)=><L key={j} x={x+11+j*13} y={220} X={x+11+j*13} Y={790} c="#887e6e" o={.35} sw={2}/>)}</g>})}
   {/olympus-council|cronus-court|early-gods-hall/.test(environment)&&<g><P d="M690 760 L790 530 L1130 530 L1230 760Z" c="#7c6670"/><R x={850} y={360} w={210} h={300} rx={35} c={gold} o={.8}/></g>}
   {/athens-acropolis/.test(environment)&&<P d="M200 820 L570 550 L1220 600 L1650 820Z" c="#5d6e59"/>}
   {/temple-offerings|sacrifice-altar/.test(environment)&&<R x={830} y={680} w={275} h={150} c="#a28d74"/>}
   {/guest-house/.test(environment)&&<g><R x={370} y={640} w={1170} h={55} c="#5f443b"/><R x={460} y={690} w={38} h={210} c="#6b5141"/><R x={1390} y={690} w={38} h={210} c="#6b5141"/></g>}
  </g>}
  {archive&&<g>
   <R x={0} y={780} w={1920} h={300} c="#4e4140"/>
   {/map|timeline|mosaic|architect|strategy/.test(environment)
    ?<g><R x={150} y={115} w={1620} h={660} c="#ad997a" stroke="#e3cd9e" sw={11}/>{Array.from({length:9},(_,i)=><L key={i} x={260+i*150} y={170} X={220+i*163} Y={730} c="#625c4d" sw={2} o={.3}/>)}</g>
    :<g><R x={95} y={170} w={370} h={550} c="#675145"/><R x={1460} y={170} w={340} h={550} c="#665044"/>{Array.from({length:5},(_,i)=><g key={i}><R x={110} y={200+i*96} w={336} h={24} c="#9c8564"/><R x={1475} y={200+i*96} w={310} h={24} c="#9c8564"/>{Array.from({length:4},(_,j)=><R key={j} x={139+j*75} y={218+i*96} w={35} h={66} c={j%2?'#bd9270':'#c9ac85'}/>)}</g>)}<R x={590} y={720} w={750} h={60} c="#775945"/></g>}
  </g>}
  {workshop&&<g><R x={0} y={800} w={1920} h={280} c="#554842"/><R x={145} y={250} w={520} h={550} c="#494144"/><ellipse cx={390} cy={690} rx={220} ry={160} fill="#f0823f" opacity=".84"/><ellipse cx={410} cy={700} rx={140} ry={120} fill="#f7c46b"/><R x={1130} y={750} w={400} h={85} c="#68504d"/><R x={1240} y={630} w={180} h={110} c="#6e7476"/>{Array.from({length:4},(_,i)=><L key={i} x={1070+i*170} y={150} X={1070+i*170} Y={480+(i%2)*80} c="#7d7067" sw={13}/>)}</g>}
  {wilderness&&<g>
   <P d="M0 870 Q350 430 670 720 T1300 650 T1920 700 V1080 H0Z" c={environment.includes('winter')?'#7c806c':'#4d6659'}/>
   <P d="M0 930 Q470 720 880 860 T1920 770 V1080 H0Z" c={environment.includes('marsh')?'#375b57':'#344e48'}/>
   {environment.includes('forest')&&Array.from({length:6},(_,i)=><g key={i}><R x={120+i*330} y={180+(i%2)*80} w={33} h={630} c="#4b403c"/><ellipse cx={120+i*330} cy={295+(i%2)*75} rx={140} ry={195} fill="#485b43"/></g>)}
   {environment.includes('marsh')&&Array.from({length:18},(_,i)=><L key={i} x={60+i*115} y={840+i%3*45} X={65+i*115} Y={650+i%4*27} c="#81926e" sw={5}/>)}
   {environment.includes('meadow')&&Array.from({length:17},(_,i)=><circle key={i} cx={60+i*118} cy={750+i%3*54} r={5+i%2*5} fill={gold} opacity=".8"/>)}
  </g>}
  {/titan-battlefield|trojan-plain/.test(environment)&&<g><P d="M0 850 L170 700 L420 790 L570 510 L950 770 L1270 600 L1530 710 L1920 450 V1080 H0Z" c="#51494c"/>{Array.from({length:6},(_,i)=><P key={i} d={'M'+(100+i*310)+' 840 l75 -300 40 260Z'} c="#6b5b59"/>)}</g>}
  {/cinema-threshold/.test(environment)&&<g><R x={200} y={80} w={1520} h={760} c="#1d1923" stroke={gold} sw={26}/><R x={280} y={145} w={1360} h={620} c="#53616a"/></g>}
  <R x={0} y={0} w={1920} h={1080} c="#080d19" o={.11}/>
 </g>;
};

const actorHue=(name:string)=>motifColor(name);
const armAngle=(motion:string,p:number,side:number)=>{
 if(/hammer|forge|lift|offer|give|bestow|serve|receive/.test(motion))return side>0?-42+64*p:35-24*p;
 if(/battle|grapple|counter|swallow/.test(motion))return side>0?-45+35*Math.sin(p*9):25+21*Math.sin(p*7);
 if(/argue|watch|guide|assist|point|condemn|bless/.test(motion))return side>0?-64*p:22*p;
 if(/walk|advance|approach|step|depart/.test(motion))return side*18*Math.sin(p*10);
 return side*8*Math.sin(p*5);
};
const Actor=({name,motion,p,scale=1}:{name:string;motion:string;p:number;scale?:number})=>{
 const hue=actorHue(name),female=/hera|athena|demeter|persephone|rhea|gaia|pandora|ariadne|aphrodite|alcmena/.test(name);
 const dark=/hades|cronus|uranus/.test(name),hero=/heracles|perseus|theseus|odysseus|achilles/.test(name);
 const stride=/walk|advance|approach|depart|step|sail|arrive/.test(motion)?Math.sin(p*11)*22:0;
 const headY=-155,arm=armAngle(motion,p,1);
 return <g transform={'scale('+scale+')'}>
  <ellipse cx={0} cy={214} rx={114} ry={18} fill="#080b15" opacity=".36"/>
  <path d={'M-57 58 L'+(-64+stride)+' 215 M50 58 L'+(59-stride)+' 215'} stroke="#bea181" strokeWidth={30} strokeLinecap="round"/>
  <P d={female?'M-80 -45 Q0 -78 75 -45 L114 194 Q0 235 -114 194Z':'M-79 -50 Q0 -90 80 -50 L100 210 Q0 224 -95 205Z'} c={hue} stroke="#292a30" sw={6}/>
  <P d="M-67 -24 L73 -9 L49 27 L-70 6Z" c={dark?'#3d3141':'#d6c4a8'} o={.62}/>
  {hero&&<P d="M-64 -50 Q-140 80 -100 205 L-48 205 Q-78 65 -25 -42Z" c={name==='heracles'?'#8a633e':'#9a6d57'}/>}
  <g transform={'translate(-76 -33) rotate('+armAngle(motion,p,-1)+')'}><L x={0} y={0} X={-58} Y={150} c="#d4b594" sw={24}/></g>
  <g transform={'translate(76 -33) rotate('+arm+')'}><L x={0} y={0} X={61} Y={150} c="#d4b594" sw={24}/></g>
  <ellipse cx={0} cy={headY} rx={53} ry={61} fill={dark?'#ad9991':'#d6b89a'} stroke="#534543" strokeWidth={5}/>
  <P d={female?'M-54 -160 Q-60 -228 0 -232 Q78 -212 55 -150 Q28 -195 -28 -182Z':'M-56 -160 Q-65 -226 -8 -227 Q67 -222 56 -161 L24 -186 Q-20 -171 -56 -160Z'} c={dark?'#2f2933':'#38323a'}/>
  <circle cx="-18" cy="-154" r="4.5" fill="#2c2429"/><circle cx="19" cy="-154" r="4.5" fill="#2c2429"/>
  {female&&<g><P d="M-38 -233 L-20 -256 L0 -239 L22 -257 L42 -229Z" c={name==='athena'?'#a2a8a2':gold}/><circle cx={0} cy="-237" r="7" fill="#e4cf91"/></g>}
  {/zeus|poseidon|hades|cronus|uranus/.test(name)&&<g><P d="M-47 -125 Q-8 -102 0 -86 Q22 -103 44 -125 L38 -61 L-14 -70Z" c={name==='zeus'?'#cfbfaa':'#544b4d'}/><P d="M-44 -219 L-24 -241 L-4 -216 L17 -248 L40 -214Z" c={gold}/></g>}
  {name==='athena'&&<g><P d="M-55 -226 L0 -282 L55 -226Z" c="#a38d67"/><L x={106} y={-48} X={105} Y={-260} c={gold} sw={11}/><P d="M105 -275 L88 -234 L122 -234Z" c={marble}/></g>}
  {name==='poseidon'&&<g><L x={120} y={-115} X={120} Y={-390} c={gold} sw={12}/><P d="M93 -346 L120 -409 L147 -346 M120 -373 V-440 M88 -368 V-428 M152 -368 V-428" c="none" stroke={gold} sw={10}/></g>}
  {name==='zeus'&&<P d="M86 -35 L142 -135 L123 -108 L184 -181 L135 -80 L159 -91 L100 20Z" c="#f6d47b" stroke="#a87550" sw={4}/>}
  {name==='heracles'&&<g><L x={110} y={-20} X={150} Y={195} c="#6a4b39" sw={27}/><ellipse cx={158} cy={191} rx={38} ry={26} fill="#70503b"/><P d="M-80 -34 Q-120 -145 -84 -189 L-34 -120Z" c="#b98b58"/></g>}
  {name==='perseus'&&<g><circle cx={-119} cy={35} r={94} fill="#a8a7a3" stroke={gold} strokeWidth="16"/><ellipse cx={-119} cy={32} rx={53} ry={70} fill="#697e86" opacity=".72"/></g>}
  {name==='theseus'&&<g><circle cx={119} cy={52} r={47} fill="none" stroke={gold} strokeWidth="18"/><path d="M150 52 Q260 100 290 225" fill="none" stroke="#e2c79e" strokeWidth="5"/></g>}
  {name==='hermes'&&<g><P d="M-52 -226 Q-88 -275 -116 -248 L-77 -208Z M54 -226 Q92 -278 119 -240 L70 -207Z" c="#d8ceb5"/></g>}
  {name==='ares'&&<g><P d="M-58 -208 L0 -278 L58 -208 L35 -181 H-35Z" c="#8b6061"/><L x={117} y={-70} X={160} Y={210} c="#a0a1a2" sw={10}/></g>}
  {name==='demeter'&&<g>{Array.from({length:5},(_,i)=><g key={i}><L x={115+i*12} y={140} X={120+i*9} Y={-37-i%2*35} c={olive} sw={5}/><ellipse cx={117+i*9} cy={-23-i%2*35} rx={9} ry={25} fill={gold}/></g>)}</g>}
  {name==='pandora'&&<g><circle cx={110} cy={145} r={45} fill="#9b7a62" stroke={gold} strokeWidth="6"/><R x={82} y={81} w={58} h={20} c="#d5ad78"/></g>}
  {name==='medusa'&&Array.from({length:7},(_,i)=><path key={i} d={'M'+(-52+i*18)+' -200 Q'+(-126+i*27)+' '+(-300-i%3*24)+' '+(-120+i*38)+' '+(-326+i%3*19)} fill="none" stroke={i%2?'#72836b':'#9da177'} strokeWidth="14" strokeLinecap="round"/>)}
  {name==='cyclops'&&<g><ellipse cx={0} cy={-160} rx={22} ry={19} fill="#eee2ce"/><circle cx={0} cy={-160} r={10} fill="#3a474d"/></g>}
 </g>;
};
const Collective=({kind,p}:{kind:string;p:number})=><g>{Array.from({length:kind==='family'?3:kind==='gods'?5:4},(_,i)=>{const child=kind==='gods'?['zeus','poseidon','athena','hera','hades'][i]:kind==='family'?['odysseus','pandora','baby'][i]:kind==='heroes'?['heracles','perseus','theseus','odysseus'][i]:kind==='fishermen'?'fisherman':kind==='sailors'?'sailor':kind==='worshippers'?'priest':kind==='titans'?'cronus':'human';return <g key={i} transform={'translate('+(-190+i*115)+' '+((i%2)*15)+') scale(.53)'}><Actor name={child} motion="step" p={q(p-i*.16)}/></g>})}</g>;

const Thing=({kind,p,sub=false}:{kind:string;p:number;sub?:boolean})=>{
 const c=motifColor(kind),opacity=sub ? .76 : 1;
 const jar=/jar|amphora/.test(kind);
 const paper=/scroll|book|tablet|prophecy|storyteller/.test(kind);
 if(jar)return <g opacity={opacity}><ellipse cx={0} cy={-92} rx={98} ry={30} fill="#ac8366" stroke="#6f554a" strokeWidth="7"/><P d="M-95 -78 Q-148 28 -107 165 Q0 240 109 165 Q148 25 97 -78Z" c="#ab8060" stroke="#735443" sw={8}/>{Array.from({length:5},(_,i)=><P key={i} d={'M'+(-80+i*32)+' 25 l20 45 -26 15Z'} c="#d3b388" o={.75}/>)}</g>;
 if(paper)return <g opacity={opacity}><R x={-172} y={-148} w={344} h={292} rx={14} c="#d6bc91" stroke="#927451" sw={7}/><circle cx="-155" cy="-146" r="24" fill="#cba77b"/><circle cx="154" cy="145" r="24" fill="#cba77b"/>{Array.from({length:6},(_,i)=><L key={i} x={-124} y={-87+i*39} X={120-(i%3)*16} Y={-87+i*39} c="#715e51" o={.63} sw={6}/>)}</g>;
 if(kind==='ship'||kind==='ships')return <g opacity={opacity}><P d="M-290 135 Q-240 270 50 265 Q270 250 325 100 L-290 100Z" c="#8c6146" stroke="#382d33" sw={8}/><L x={-7} y={95} X={-7} Y={-255} c="#cbb493" sw={17}/><P d="M0 -237 Q170 -167 205 87 L0 74Z" c="#e1cfaa" stroke="#aa997d" sw={5}/>{Array.from({length:8},(_,i)=><L key={i} x={-195+i*52} y={192} X={-220+i*56} Y={143} c="#e0c9a8" sw={6}/>)}</g>;
 if(kind==='lightning')return <g opacity={opacity}><P d="M-20 -194 L-112 -12 L-29 -17 L-95 193 L139 -79 L35 -69 L102 -187Z" c="#f2d679" stroke="#dd995c" sw={9}/></g>;
 if(kind==='trident')return <g opacity={opacity}><L x={0} y={210} X={0} Y={-190} sw={14} c={gold}/><P d="M-92 -155 Q-92 -210 -75 -236 L-55 -167 Q0 -115 55 -167 L75 -236 Q92 -210 92 -155 L92 -85 L72 -85 L72 -122 Q0 -60 -72 -122 V-85 H-92Z" c={gold}/></g>;
 if(kind==='fire'||kind==='flame'||kind==='embers'||kind==='torch')return <g opacity={opacity}><P d="M-95 190 Q-185 20 -43 -119 Q-50 -10 20 -175 Q202 2 82 190Z" c="#e18146"/><P d="M-57 174 Q-93 39 22 -69 Q99 36 61 174Z" c="#f7ce74"/>{Array.from({length:5},(_,i)=><circle key={i} cx={-105+i*47} cy={-100-(i%3)*42} r={6+(i%3)*3} fill={gold}/>)}</g>;
 if(kind==='anvil'||kind==='metal'||kind==='clay')return <g opacity={opacity}><P d="M-190 -40 H122 L165 -95 H250 L195 14 H98 V155 H-105 V15 H-190Z" c="#707b7b" stroke="#394146" sw={6}/><R x={-170} y={155} w={375} h={42} c="#505b61"/></g>;
 if(kind==='goats')return <g opacity={opacity}>{[0,1,2].map(i=><g key={i} transform={'translate('+(-150+i*145)+' '+(i%2*30)+') scale(.65)'}><ellipse cx={0} cy={50} rx={90} ry={48} fill="#d7d0b2"/><ellipse cx={-64} cy={0} rx={43} ry={40} fill="#d7d0b2"/><L x={-45} y={79} X={-50} Y={180} c="#b5ac96" sw={13}/><L x={45} y={79} X={45} Y={180} c="#b5ac96" sw={13}/><P d="M-88 -27 L-122 -97 L-68 -52 L-38 -97 L-30 -25Z" c="#bbb396"/></g>)}</g>;
 if(kind==='lion')return <g opacity={opacity}><ellipse cx={-25} cy={60} rx={170} ry={105} fill="#b98b56"/><circle cx={-95} cy={-52} r={107} fill="#8c6040"/><circle cx={-95} cy={-42} r={67} fill="#cfa16a"/><circle cx={-117} cy={-49} r={9} fill="#2a2120"/><circle cx={-69} cy={-49} r={9} fill="#2a2120"/><P d="M-115 -4 L-88 15 L-62 -4Z" c="#4a3532"/><L x={105} y={100} X={205} Y={-10} c="#b98b56" sw={26}/></g>;
 if(kind==='hydra')return <g opacity={opacity}><ellipse cx={0} cy={110} rx={165} ry={90} fill="#52694d"/>{Array.from({length:5},(_,i)=><g key={i}><path d={'M'+(-75+i*40)+' 90 Q'+(-210+i*90)+' '+(-85-i%2*75)+' '+(-150+i*85)+' -160'} fill="none" stroke="#5f7d54" strokeWidth="30"/><ellipse cx={-150+i*85} cy={-168} rx={25} ry={30} fill="#729268"/><circle cx={-158+i*85} cy={-176} r="4" fill="#d5c86f"/></g>)}</g>;
 if(kind==='owl')return <g opacity={opacity}><ellipse cx={0} cy={-6} rx={90} ry={120} fill="#a28c70"/><P d="M-72 -40 L-95 -156 L-16 -113 L33 -125 L91 -160 L70 -22Z" c="#9b8f78"/><circle cx={-35} cy={-40} r={28} fill="#eee7d3"/><circle cx={35} cy={-40} r={28} fill="#eee7d3"/><circle cx={-35} cy={-40} r={11} fill="#2d383b"/><circle cx={35} cy={-40} r={11} fill="#2d383b"/><P d="M-11 -17 L0 2 L11 -17Z" c="#dba95e"/></g>;
 if(kind==='shield')return <g opacity={opacity}><circle r={170} fill="#9da4a1" stroke={gold} strokeWidth="24"/><circle r={125} fill="#607885" stroke="#d5c3a1" strokeWidth="8"/><ellipse cx={-37} cy={-48} rx={56} ry={106} fill="#c7d4d2" opacity=".53"/></g>;
 if(kind==='stone'||kind==='wrapped-stone'||kind==='god-stone')return <g opacity={opacity}><P d="M-190 105 L-142 -90 L-16 -167 L145 -85 L186 80 L65 171 L-95 161Z" c={kind==='wrapped-stone'?'#d8c9ad':'#83807b'} stroke="#534f50" sw={7}/>{kind==='wrapped-stone'&&<P d="M-174 60 Q0 -1 177 74 L70 147 L-85 137Z" c="#e6dac2"/>}</g>;
 if(kind==='temple'||kind==='olympus'||kind==='home'||kind==='house'||kind==='gate'||kind==='exit'||kind==='columns'||kind==='trojan-walls'||kind==='cinema')return <g opacity={opacity}><P d="M-260 -128 L0 -256 L260 -128Z" c="#d4c09b"/><R x={-265} y={-130} w={530} h={36} c="#bca889"/>{Array.from({length:5},(_,i)=><g key={i}><R x={-225+i*105} y={-100} w={52} h={254} c="#d9cdb5"/><R x={-235+i*105} y={144} w={72} h={35} c="#b9a789"/></g>)}<R x={-285} y={174} w={570} h={35} c="#9e8c76"/></g>;
 if(kind==='tree'||kind==='olive'||kind==='grain'||kind==='harvest'||kind==='withered-grain')return <g opacity={opacity}>{kind==='tree'||kind==='olive'?<g><R x={-17} y={15} w={38} h={255} c="#675143"/><ellipse cx={0} cy={-38} rx={140} ry={144} fill={kind==='olive'?'#778765':'#526b56'}/>{Array.from({length:12},(_,i)=><ellipse key={i} cx={-108+(i%5)*48} cy={-116+Math.floor(i/5)*75} rx={7} ry={13} fill="#a7a477"/>)}</g>:<g>{Array.from({length:10},(_,i)=><g key={i}><L x={-145+i*31} y={206} X={-140+i*31} Y={-117-i%3*25} c={kind==='withered-grain'?'#766857':'#95a072'} sw={5}/>{Array.from({length:4},(_,j)=><ellipse key={j} cx={-142+i*31} cy={-104+j*36} rx={11} ry={22} fill={kind==='withered-grain'?'#a08c6b':gold}/>)}</g>)}</g>}</g>;
 if(kind==='map'||kind==='globe'||kind==='ithaca'||kind==='islands'||kind==='mountains'||kind==='mountain'||kind==='road')return <g opacity={opacity}><ellipse cx={0} cy={0} rx={235} ry={174} fill="#c9b691" stroke="#806c55" strokeWidth="8"/><P d="M-180 -75 L-100 -116 L-20 -55 L74 -116 L167 -68 L123 48 L22 111 L-78 62 L-160 116Z" c="#84947c"/><P d="M-205 58 Q-75 -100 80 33 T210 -30" c="none" stroke="#8d674d" sw={8}/><circle cx={100} cy={-30} r={16} fill={blood}/></g>;
 if(kind==='labyrinth'||kind==='maze')return <g opacity={opacity}><R x={-230} y={-210} w={460} h={420} c="#c2aa8b"/>{Array.from({length:5},(_,i)=><path key={i} d={'M'+(-190+i*40)+' '+(-165+i*40)+' V'+(165-i*35)+' H'+(190-i*37)+' V'+(-110+i*31)} fill="none" stroke="#695c55" strokeWidth="20"/>)}</g>;
 if(kind==='thread'||kind==='rope'||kind==='libation')return <g opacity={opacity}><circle cx={-80} cy={24} r={85} fill="none" stroke={kind==='thread'?'#ead7b5':'#a7865e'} strokeWidth="30"/>{Array.from({length:3},(_,i)=><path key={i} d={'M-180 '+(-36+i*60)+' Q30 '+(-125+i*70)+' 190 '+(-50+i*65)} fill="none" stroke={kind==='thread'?'#efd2a8':'#b49b73'} strokeWidth="7"/>)}</g>;
 if(kind==='gift'||kind==='gifts'||kind==='cargo'||kind==='meal'||kind==='bread'||kind==='pottery'||kind==='box')return <g opacity={opacity}><R x={-162} y={-90} w={322} h={246} c={kind==='meal'||kind==='bread'?'#c99e65':'#a78567'} stroke="#785b4c" sw={9}/><R x={-174} y={-117} w={350} h={38} c="#d6bb8e"/><L x={0} y={-117} X={0} Y={155} c={gold} sw={14}/>{kind==='meal'&&<ellipse cx={0} cy={15} rx={118} ry={50} fill="#ede0ba"/>}</g>;
 if(kind==='altar'||kind==='throne'||kind==='empty-throne'||kind==='anvil'||kind==='fallen-helmet')return <g opacity={opacity}><R x={-170} y={-65} w={340} h={248} c="#b6a78e" stroke="#6d6560" sw={8}/><R x={-205} y={175} w={410} h={50} c="#887963"/>{kind.includes('throne')&&<R x={-150} y={-238} w={300} h={190} rx={28} c="#a68d75" stroke={gold} sw={8}/>}</g>;
 if(kind==='sword'||kind==='club'||kind==='compass')return <g opacity={opacity}><L x={-70} y={194} X={80} Y={-175} c={kind==='club'?'#856143':'#bbc1bd'} sw={kind==='club'?41:14}/><P d="M77 -192 L55 -125 L97 -125Z" c={kind==='club'?'#70513b':'#c9d3d3'}/><L x={-132} y={65} X={-1} Y={110} c={gold} sw={15}/></g>;
 if(kind==='sky'||kind==='clouds'||kind==='divine-clouds'||kind==='storm'||kind==='storms'||kind==='waves')return <g opacity={opacity}>{Array.from({length:4},(_,i)=><ellipse key={i} cx={-130+i*85} cy={-45+i%2*55} rx={105} ry={55} fill={kind==='waves'?'#76a3a8':'#a9acb0'} opacity={.88}/>)}{kind==='storm'||kind==='storms'?<P d="M-20 -40 L-110 90 L-22 92 L-105 218 L122 12 L24 10 L80 -40Z" c={gold}/>:null}</g>;
 if(kind==='chaos'||kind==='tartarus'||kind==='eros'||kind==='cosmos'||kind==='future-stars'||kind==='stars'||kind==='spirits'||kind==='shadows'||kind==='darkness'||kind==='glory'||kind==='sorrow'||kind==='elpis'||kind==='prophecy'||kind==='choices'||kind==='divine-aid'||kind==='human-limits'||kind==='boundary'||kind==='threshold'||kind==='disguise'||kind==='statues')return <g opacity={opacity}><circle r={134} fill={c} opacity=".17"/><circle r={114} fill="none" stroke={c} strokeWidth="6"/>{Array.from({length:8},(_,i)=><g key={i} transform={'rotate('+(i*45)+')'}><P d="M-9 -122 L0 -175 L9 -122Z" c={c}/></g>)}<circle r={24} fill={gold}/></g>;
 if(kind==='chess'||kind==='tiles'||kind==='strategic-board'||kind==='scale')return <g opacity={opacity}><R x={-205} y={-180} w={410} h={365} c="#afa083" stroke="#655549" sw={9}/>{Array.from({length:36},(_,i)=><R key={i} x={-185+i%6*62} y={-158+Math.floor(i/6)*54} w={60} h={53} c={(i+Math.floor(i/6))%2?'#958570':'#dcc9a4'}/>)}</g>;
 if(kind==='screen')return <g opacity={opacity}><R x={-245} y={-150} w={490} h={310} c="#253c4c" stroke={gold} sw={22}/></g>;
 if(kind==='baby'||kind==='baby-zeus'||kind==='infant'||kind==='cradle')return <g opacity={opacity}><ellipse cx={0} cy={15} rx={150} ry={75} fill="#e6d0b0"/><circle cx="-60" cy="-45" r="54" fill="#d7b698"/><P d="M-25 -13 Q98 -51 132 52 Q0 100 -94 66Z" c={cream}/></g>;
 throw new Error('Unknown V101 art token: '+kind);
};

const translateMotion=(motion:string,p:number,sub=false)=>{
 const z={dx:0,dy:0,scale:1,rotate:0,opacity:1};const t=clamp(p);
 const travel='walk advance approach arrive depart step climb sail navigate return trace follow depart'.split(' ');
 const appear='appear emerge reveal summon grow free assemble equip bestow branch connect reconnect converge offer give receive'.split(' ');
 if(travel.includes(motion)){z.dx=lerp(-115,110,t);z.dy=motion==='climb'?lerp(100,-70,t):0}
 if(appear.includes(motion)){z.scale=lerp(.62,1,t);z.opacity=lerp(.16,1,t)}
 if(/descend|wither|withdraw|shadow/.test(motion)){z.dy=lerp(-75,60,t);z.opacity=motion==='wither'?lerp(1,.38,t):1}
 if(/lift|rise/.test(motion))z.dy=lerp(115,-65,t);
 if(/argue|grapple|battle|counter|persevere/.test(motion))z.dx=16*Math.sin(t*9);
 if(/forge|hammer/.test(motion)){z.rotate=13*Math.sin(t*14);z.dy=18*Math.sin(t*14)}
 if(/swallow-symbol|hide|fade|imprison/.test(motion))z.opacity=lerp(1,.11,t);
 if(/replace|swap/.test(motion))z.dx=lerp(-120,105,t);
 if(/orbit/.test(motion))z.rotate=lerp(-18,18,t);
 if(/overreach|step/.test(motion))z.dx=lerp(-80,96,t);
 if(/kneel/.test(motion))z.dy=lerp(-65,52,t);
 if(/reflect/.test(motion))z.rotate=lerp(-13,13,t);
 if(/tilt|weigh|balance/.test(motion))z.rotate=lerp(-12,12,t);
 if(/petrify/.test(motion))z.opacity=lerp(1,.72,t);
 if(/storm|surge/.test(motion))z.dx=20*Math.sin(t*13);
 if(sub){z.dx=-z.dx*.55;z.dy=-z.dy*.4;z.rotate=-z.rotate*.75;}
 return z;
};
const Mover=({kind,motion,p,x,y,s=1,secondary=false}:{kind:string;motion:string;p:number;x:number;y:number;s?:number;secondary?:boolean})=>{
 const t=translateMotion(motion,p,secondary),dx=x+t.dx,dy=y+t.dy,scale=s*t.scale;
 return <g transform={'translate('+dx+' '+dy+') rotate('+t.rotate+') scale('+scale+')'} opacity={t.opacity}>{collectives.has(kind)?<Collective kind={kind} p={p}/>:actors.has(kind)?<Actor name={kind} motion={motion} p={p}/>:<Thing kind={kind} p={p} sub={secondary}/>}</g>;
};

const EventFX=({scene,p,px,py}:{scene:StoryScene;p:number;px:number;py:number})=>{
 const m=scene.motion,t=clamp(p);
 return <g pointerEvents="none">
  {/lightning|storm|surge|battle|victory|condemn/.test(m)&&<g opacity={.25+.6*Math.sin(t*30)**2}><P d={'M'+(px+180)+' 30 l-98 222 70 -8 -120 221 70 -145 -64 9 110 -299Z'} c="#f3d48a"/><circle cx={px} cy={py-70} r={160+40*t} fill="none" stroke={gold} strokeWidth="8" opacity={.3*(1-t)}/></g>}
  {/forge|hammer/.test(m)&&Array.from({length:18},(_,i)=>{const a=i*2.399;return <circle key={i} cx={px+Math.cos(a)*lerp(10,250,t)} cy={py+80+Math.sin(a)*lerp(10,220,t)} r={2+i%4} fill={i%2?gold:'#f29b5f'} opacity={q((1-t)*1.4)}/>})}
  {/trace|unroll|write|design|connect|branch|return|plan|solve|retrace/.test(m)&&<path d={'M'+(px-330)+' '+(py+110)+' C'+(px-180)+' '+(py-300)+' '+(px+130)+' '+(py+270)+' '+(px+290)+' '+(py-170)} fill="none" stroke={gold} strokeWidth="11" opacity=".76" pathLength="1" strokeDasharray="1" strokeDashoffset={1-t}/>}
  {/offer|give|receive|bestow|serve|pour|bless/.test(m)&&<g><circle cx={px-180+270*t} cy={py-40-160*Math.sin(t*Math.PI)} r="19" fill={gold}/><path d={'M'+(px-195)+' '+(py+5)+' Q'+px+' '+(py-240)+' '+(px+90)+' '+(py+5)} fill="none" stroke={gold} strokeWidth="4" strokeDasharray="10 16" opacity=".6"/></g>}
  {/open-jar/.test(m)&&<g><ellipse cx={px-10} cy={py-165-110*t} rx={94} ry={23} fill="#d2ab7b" stroke="#86634e" strokeWidth="9" transform={'rotate('+(-23*t)+' '+px+' '+(py-165-110*t)+')'}/>{Array.from({length:11},(_,i)=>{const a=i*2.399;return <g key={i}><path d={'M'+(px+i%3*9)+' '+(py-190)+' Q'+(px+Math.cos(a)*115)+' '+(py-315)+' '+(px+Math.cos(a)*lerp(5,380,t))+' '+(py-215+Math.sin(a)*lerp(15,320,t))} fill="none" stroke={i%2?'#aaa2ae':'#c39b7d'} strokeWidth="8" opacity={t*.65}/></g>})}</g>}
  {/swap|replace/.test(m)&&<path d={'M'+(px-350)+' '+(py+80)+' Q'+px+' '+(py+280)+' '+(px+290)+' '+(py+80)} fill="none" stroke={gold} strokeWidth="9" strokeDasharray="18 17" opacity=".6"/>}
  {/sail|navigate|storm|surge/.test(m)&&Array.from({length:4},(_,i)=><path key={i} d={'M'+(px-325)+' '+(py+195+i*25)+' Q'+(px-170)+' '+(py+165+i*25+16*Math.sin(t*15+i))+' '+(px+45)+' '+(py+192+i*25)+' T'+(px+335)+' '+(py+189+i*25)} fill="none" stroke="#88b8bb" strokeWidth="7" opacity=".47"/>)}
  {/petrify/.test(m)&&<g opacity={.6*t}><path d={'M'+(px-120)+' '+(py-150)+' L'+(px+110)+' '+(py+135)+' M'+(px+65)+' '+(py-170)+' L'+(px-135)+' '+(py+80)} fill="none" stroke="#bac1c0" strokeWidth="13"/></g>}
  {/hide|imprison|shadow/.test(m)&&<g><R x={px-235} y={py-290} w={470} h={530} c={deep} o={.26*t}/>{Array.from({length:6},(_,i)=><R key={i} x={px-220+i*80} y={py-280} w={13} h={540} c="#171d29" o={.2+.7*t}/>)}</g>}
  {/partition/.test(m)&&<g>{Array.from({length:3},(_,i)=><path key={i} d={'M960 180 L'+(960+(i-1)*lerp(0,700,t))+' 850'} stroke={gold} strokeWidth="11" opacity=".7"/>)}</g>}
  {/free|emerge|reveal|appear|rise|victory/.test(m)&&<g><circle cx={px} cy={py-60} r={60+230*t} fill="none" stroke={gold} strokeWidth="9" opacity={.7*(1-t)}/></g>}
  {/thread|trace|find/.test(m)&&scene.primary==='theseus'&&<path d={'M'+(px+85)+' '+(py+40)+' Q'+(px-330)+' '+(py+180)+' '+(px-620)+' '+(py-130)} fill="none" stroke="#efcca2" strokeWidth="7" strokeDasharray="1000" strokeDashoffset={1000*(1-t)}/>}
 </g>;
};
export const GreekScene=({scene,progress}:{scene:StoryScene;progress:number})=>{
 const p=clamp(progress),v=scene.variant;
 // Scene-specific foreground; the static environment above is not transformed.
 const mainX=[1080,1250,1050,1370,990][v%5],mainY=[515,480,575,525,500][v%5];
 const secondaries=scene.secondaries.slice(0,3);
 const subpart=scene.subpart??0;
 const primary=subpart===0?scene.primary:(secondaries.find(s=>s!=='blank')||scene.primary);
 const extras=subpart===0?secondaries:[scene.primary,...secondaries.filter(s=>s!==primary)].slice(0,3);
 const movement=subpart===0?scene.motion:'reconnect';
 return <g data-action={scene.actionId}>
  <Backdrop environment={scene.environment}/>
  {extras.map((s,i)=><Mover key={i} kind={s} motion={movement} p={p} x={280+i*260} y={615+i%2*72} s={s==='ship'||s==='trojan-walls'?.68:.63} secondary/>)}
  <Mover kind={primary} motion={scene.motion} p={p} x={mainX} y={mainY} s={primary==='ship'||primary==='trojan-walls'||primary==='temple'||primary==='map'?1.18:1.1}/>
  <EventFX scene={scene} p={p} px={mainX} py={mainY}/>
  {labelOf(primary)&&<g opacity={.15+.85*q(p*2.7)}><R x={mainX-180} y={mainY+260} w={360} h={63} rx={10} c="#15212e" o={.83}/>{text(mainX,mainY+303,labelOf(primary),31)}</g>}
  <R x={0} y={0} w={1920} h={1080} c={deep} o={.045}/>
 </g>;
};
