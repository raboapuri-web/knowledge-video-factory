import React from 'react';
import {R,L,P,q,lerp} from './primitives';
const gold='#d5ad70',cream='#e6d7c0',ink='#222b38',steel='#a9aeb0',ruby='#924d55',cloth='#8c515b',wood='#805c45',leaf='#829078';
const tag=(v:string)=>v.toLowerCase();
const Person=({kind,p=0}:{kind:string;p?:number})=>{
 const monarch=kind==='henry',medieval=!['viewer','audience','athlete','artisan'].includes(kind);
 const royalty=['henry','noble','courtiers'].includes(kind),priest=kind==='preacher';
 const knight=kind==='knight',modern=['viewer','audience','artisan'].includes(kind);
 const stride=kind==='townsmen'||kind==='viewer'?Math.sin(p*10)*19:0;
 const coat=priest?'#4c4745':monarch?'#904c4e':knight?'#8d969c':royalty?'#6e5268':modern?'#536c75':'#826e5d';
 const cape=royalty?'#693e4c':knight?'#576a6b':'none';
 const arm=kind==='preacher'?lerp(30,-72,p):kind==='artisan'?lerp(50,-40,p):Math.sin(p*8)*12;
 return <g>
 <ellipse cx={0} cy={205} rx={135} ry={16} fill={ink} opacity=".32"/>
 <g transform={'translate('+stride+' 0)'}>
 <path d="M-62 64 L-60 215 M62 64 L62 215" stroke={knight?steel:'#c3aa8d'} strokeWidth="39" strokeLinecap="round"/>
 <path d="M-74 60 L-91 194 L-27 208 L-16 88Z M74 60 L91 194 L27 208 L16 88Z" fill={knight?'#68757a':'#64534f'} opacity=".65"/>
 {cape!=='none'&&<P d="M-84 -91 Q-156 22 -110 192 L-25 181 L0 -58 L30 181 L110 192 Q154 -13 84 -91Z" c={cape}/>}
 <P d="M-83 -77 Q0 -119 83 -77 L114 103 Q2 155 -114 103Z" c={coat} stroke="#282833" sw={6}/>
 {monarch&&<g><P d="M-86 -77 L-159 -28 L-82 7 L0 -55 L84 7 L158 -28 L84 -77Z" c="#b3a084"/>{[0,1,2,3,4].map(i=><circle key={i} cx={-84+i*42} cy={-52+i%2*14} r={9} fill={gold}/>)}</g>}
 {medieval&&<g><L x={-56} y={-45} X={-56} Y={83} c={gold} sw={7}/><L x={56} y={-45} X={56} Y={83} c={gold} sw={7}/></g>}
 <g transform={'rotate('+arm+' -92 -72)'}><L x={-85} y={-64} X={-136} Y={70} c={knight?steel:'#c5aa8f'} sw={26}/></g>
 <g transform={'rotate('+(-arm)+' 92 -72)'}><L x={85} y={-64} X={140} Y={70} c={knight?steel:'#c5aa8f'} sw={26}/></g>
 {medieval&&<g><P d="M-65 89 Q0 62 65 89 L51 188 Q0 202 -51 188Z" c={knight?'#89969a':'#68605e'}/><P d="M-35 120 Q0 111 35 120 Q52 167 18 191 L-18 191 Q-52 168 -35 120Z" c={knight?'#aab2b3':royalty?'#a37a64':'#8b6f5b'} stroke={gold} sw={4}/></g>}
 <ellipse cx={0} cy={-153} rx={56} ry={68} fill={knight?'#c6ad92':'#dfbda0'} stroke="#53423d" strokeWidth={5}/>
 <P d={monarch?'M-53 -159 Q-72 -220 -13 -226 Q46 -225 58 -166 L33 -189 Q0 -169 -53 -159Z':'M-55 -157 Q-66 -224 0 -226 Q67 -224 55 -158 L25 -191 Q-12 -174 -55 -157Z'} c={modern?'#383b3e':'#544036'}/>
 <circle cx={-19} cy={-153} r={4.5} fill={ink}/><circle cx={20} cy={-153} r={4.5} fill={ink}/>
 {(monarch||priest)&&<P d="M-42 -112 Q-31 -68 0 -78 Q38 -68 47 -115 L22 -91 L0 -95 L-20 -91Z" c={monarch?'#9a7b5f':'#675649'}/>}
 {monarch&&<g><P d="M-65 -209 L-50 -256 L-19 -229 L0 -273 L23 -227 L55 -260 L66 -208Z" c={gold} stroke="#ae8653" sw={6}/>{[-38,0,38].map(x=><circle key={x} cx={x} cy={-220} r={7} fill={ruby}/>)}</g>}
 {knight&&<g><P d="M-65 -215 L-32 -292 H32 L65 -215 L50 -177 H-50Z" c={steel}/><P d="M-10 -294 L0 -350 L10 -294Z" c={gold}/></g>}
 </g></g>;
};
const Crowd=({kind,p}:{kind:string;p:number})=><g>{Array.from({length:kind==='courtiers'?5:kind==='audience'?7:4},(_,i)=><g key={i} transform={'translate('+(-280+i*140)+' '+(i%2*40)+') scale('+(.47+i%3*.07)+')'}><Person kind={kind==='townsmen'?'townsmen':kind==='audience'?'viewer':'noble'} p={q(p-i*.09)}/></g>)}</g>;
const Padded=({material='cloth',style='codpiece',p=0}:{material?:string;style?:string;p?:number})=>{
 const metal=material==='metal',fabric=metal?'#a2aaae':material==='velvet'?'#87505b':'#b08b6c';
 return <g><path d="M-205 -176 Q-110 -223 0 -206 Q116 -230 207 -165 L186 2 Q124 68 95 205 L-95 205 Q-127 51 -190 8Z" fill={style==='belly'?'#82515c':'#6b5760'} stroke="#3c3037" strokeWidth="7"/>
 <path d="M-207 -164 L205 -164 L174 -97 L-175 -97Z" fill={metal?'#677279':'#a28565'}/>
 <path d={style==='belly'?'M-77 -100 Q85 -120 174 32 Q228 139 103 179 L-30 175 Q-83 86 -77 -100Z':style==='breeches'?'M-167 -67 Q-244 22 -195 164 Q-115 231 -8 151 L25 3 Q101 206 180 173 Q238 52 174 -67Z':'M-88 -83 Q0 -143 92 -70 Q133 19 111 112 Q75 197 6 211 Q-83 175 -119 79 Q-128 -21 -88 -83Z'} fill={fabric} stroke={metal?'#687379':'#5a3d3d'} strokeWidth={9}/>
 {Array.from({length:6},(_,i)=><path key={i} d={'M'+(-54+i*21)+' -75 Q'+(-30+i*17)+' '+(35+i%2*12)+' '+(-28+i*12)+' 153'} stroke={metal?'#d4d9da':gold} strokeWidth={3+i%3} fill="none" opacity=".7"/>)}
 <circle cx={0} cy={-109} r={13} fill={gold}/>{metal&&<circle cx={2} cy={65} r={35} fill="#839198" stroke={gold} strokeWidth={8}/>}
 </g>;
};
const Mannequin=({p=0}:{p?:number})=><g><ellipse cy="232" rx="130" ry="22" fill="#1e2935" opacity=".35"/><L x={0} y={90} X={0} Y={238} c={wood} sw={16}/><L x={-100} y={230} X={100} Y={230} c={wood} sw={18}/><ellipse cx={0} cy={-235} rx={42} ry={51} fill="#c1a27e"/><P d="M-85 -170 Q0 -220 85 -170 L110 80 L-110 80Z" c="#9d7e65" stroke={gold} sw={6}/><Padded p={p}/></g>;
const Statue=({p=0,draped=false}:{p?:number;draped?:boolean})=><g><R x={-165} y={200} w={330} h={45} c="#b4b3ac"/><R x={-105} y={165} w={210} h={35} c="#d2d1c9"/><P d="M-88 -100 Q0 -140 88 -100 L118 46 L55 142 L-55 142 L-118 46Z" c="#d7d3c7" stroke="#bbb7af" sw={6}/><ellipse cx={0} cy={-195} rx={62} ry={71} fill="#e0dbd0" stroke="#b7b3ac" strokeWidth="5"/><path d="M-75 -203 Q-63 -280 0 -270 Q69 -267 67 -199" fill="none" stroke="#c4c0b5" strokeWidth="19"/><path d="M-68 104 Q-125 174 -87 201 M68 104 Q125 174 87 201" fill="none" stroke="#d8d5ca" strokeWidth="54"/><P d="M-112 62 Q-15 16 114 72 L90 169 Q0 193 -90 162Z" c={draped?'#c2c1b8':'#d1cfc6'}/>{draped&&<path d="M-105 85 Q-12 127 90 70 M-85 117 Q0 159 95 116" stroke="#8f9392" strokeWidth="5" fill="none"/>}</g>;
const page=(txt:string)=> <g><R x={-192} y={-245} w={384} h={500} c="#deccac" stroke="#a88a63" sw={9}/>{Array.from({length:7},(_,i)=><g key={i}><L x={-137} y={-164+i*57} X={130-(i%3)*25} Y={-164+i*57} c="#816e5a" sw={6} o={.7}/><L x={-137} y={-144+i*57} X={89-(i%2)*21} Y={-144+i*57} c="#b09b7f" sw={3}/></g>)}<text x={0} y={-190} fontFamily="Noto Sans JP" fontSize={24} textAnchor="middle" fill={ink}>{txt}</text></g>;
export const VisualProp=({kind,p=0}:{kind:string;p?:number})=>{
 if(['henry','noble','preacher','viewer','knight','artisan','athlete'].includes(kind))return <Person kind={kind} p={p}/>;
 if(['courtiers','townsmen','audience','silhouettes'].includes(kind))return <Crowd kind={kind==='silhouettes'?'audience':kind} p={p}/>;
 if(kind==='portrait')return <g><R x={-275} y={-340} w={550} h={650} c="#8a6f4e" stroke={gold} sw={22}/><R x={-230} y={-306} w={460} h={574} c="#46414a"/><g transform="translate(0 80) scale(.71)"><Person kind="henry" p={p}/></g></g>;
 if(kind==='mannequin'||kind==='silhouette')return <Mannequin p={p}/>;
 if(['codpiece','metal-codpiece','garment','fabric','cloth','velvet','padding','long-doublet','short-doublet','belly-doublet','breeches','hose','gap','underwear','plates'].includes(kind)){
  if(kind==='hose')return <g><P d="M-120 -240 Q-55 -275 -6 -216 L-36 184 Q-88 270 -146 193Z" c="#69636b" stroke={gold} sw={7}/><P d="M8 -218 Q70 -276 135 -236 L153 192 Q95 267 42 190Z" c="#565761" stroke={gold} sw={7}/><R x={-145} y={-236} w={284} h={37} c="#bfa97f"/></g>;
  if(kind==='padding')return <g><P d="M-180 170 Q-255 -100 -70 -150 Q200 -215 194 76 Q151 256 -180 170Z" c="#d4c6b1" stroke="#a79b8d" sw={8}/>{Array.from({length:7},(_,i)=><path key={i} d={'M'+(-130+i*38)+' -135 Q'+(25+i*16)+' '+(0+i%3*25)+' '+(-130+i*30)+' 145'} fill="none" stroke="#f0e2cb" strokeWidth="6"/>)}</g>;
  if(kind==='fabric'||kind==='cloth'||kind==='velvet')return <g><P d="M-190 -180 L155 -235 L205 175 Q20 112 -205 219Z" c={kind==='velvet'?'#8e4d5b':'#b49575'} stroke="#79655d" sw={8}/>{[0,1,2,3].map(i=><path key={i} d={'M'+(-142+i*83)+' -173 Q'+(-154+i*83)+' 5 '+(-175+i*78)+' 185'} fill="none" stroke={gold} strokeWidth="4" opacity=".7"/>)}</g>;
  return <Padded material={kind==='metal-codpiece'||kind==='plates'?'metal':kind==='garment'?'velvet':'cloth'} style={kind==='belly-doublet'?'belly':kind==='breeches'?'breeches':'codpiece'} p={p}/>;
 }
 if(['statue','draped-statue','statues'].includes(kind))return kind==='statues'?<g><g transform="translate(-145 10) scale(.7)"><Statue/></g><g transform="translate(150 -10) scale(.85)"><Statue draped/></g></g>:<Statue draped={kind==='draped-statue'} p={p}/>;
 if(['book','scroll','heir-scroll','research-paper','rulebook','ledger','museum-label'].includes(kind))return page(({book:'古典書',scroll:'喜劇の巻物','heir-scroll':'王位継承', 'research-paper':'研究資料',rulebook:'礼儀と規範',ledger:'支払記録','museum-label':'収蔵品記録'} as Record<string,string>)[kind]);
 if(kind==='embroidery')return <g><P d="M-195 -215 H192 L172 220 H-180Z" c={cloth} stroke={gold} sw={10}/>{[0,1,2,3,4].map(i=><g key={i}><path d={'M'+(-150+i*70)+' -130 q-45 62 12 105 q59 -28 5 -88 M'+(-150+i*70)+' 38 q-45 62 12 105 q59 -28 5 -88'} fill="none" stroke={gold} strokeWidth="7"/><circle cx={-138+i*70} cy={-25} r={12} fill="#d9c49a"/></g>)}</g>;
 if(kind==='crown')return <g><P d="M-230 -75 L-190 138 H190 L230 -75 L118 38 L70 -128 L0 10 L-70 -128 L-118 38Z" c={gold} stroke="#8d6b47" sw={11}/>{[-145,0,145].map((x,i)=><circle key={i} cx={x} cy={90} r={25} fill={i%2?ruby:'#628989'} stroke={cream} strokeWidth="6"/>)}</g>;
 if(kind==='jewel'||kind==='coins')return <g>{[0,1,2,3,4,5,6].map(i=><g key={i} transform={'translate('+(-200+i%4*117)+' '+(-160+Math.floor(i/4)*150)+')'}>{kind==='jewel'?<P d="M0 -60 L58 -13 L0 67 L-58 -13Z" c={i%2?ruby:'#73a7a6'} stroke={gold} sw={9}/>:<g><ellipse cx={0} cy={0} rx={52} ry={45} fill={gold} stroke="#987b50" strokeWidth="8"/><circle cx={0} cy={0} r={22} fill="none" stroke="#f4deb4" strokeWidth="5"/></g>}</g>)}</g>;
 if(['needle','scissors','brush','calipers','ruler','hammer','laces','pattern'].includes(kind)){
  if(kind==='needle'||kind==='laces')return <g><L x={-170} y={115} X={160} Y={-166} c={kind==='needle'?steel:gold} sw={kind==='needle'?10:15}/><path d="M-170 115 Q-300 100 -245 -95 T20 -140" fill="none" stroke={gold} strokeWidth="6"/><circle cx={-167} cy={112} r={14} fill="#c8b69c"/></g>;
  if(kind==='scissors'||kind==='calipers')return <g><L x={-195} y={205} X={155} Y={-205} c={steel} sw={15}/><L x={180} y={205} X={-145} Y={-205} c={steel} sw={15}/><circle r={20} fill={gold}/><circle cx={-190} cy={200} r={45} fill="none" stroke={gold} strokeWidth="16"/><circle cx={180} cy={202} r={45} fill="none" stroke={gold} strokeWidth="16"/></g>;
  if(kind==='hammer')return <g><L x={-65} y={195} X={90} Y={-200} c={wood} sw={28}/><R x={-70} y={-265} w={350} h={100} c={steel} stroke="#6a7379" sw={8}/></g>;
  if(kind==='brush')return <g><L x={-140} y={205} X={145} Y={-140} c={wood} sw={28}/><P d="M160 -165 L255 -260 L222 -130 L165 -113Z" c={gold}/></g>;
  if(kind==='pattern')return <g><R x={-210} y={-210} w={420} h={430} c="#d3b998" stroke="#82644f" sw={7}/>{[0,1,2].map(i=><path key={i} d={'M'+(-170+i*90)+' -170 Q'+(-90+i*120)+' 25 '+(-158+i*112)+' 177'} fill="none" stroke="#5d625e" strokeWidth="5" strokeDasharray="10 9"/>)}</g>;
  return <g><R x={-195} y={-13} w={390} h={65} c="#b9b1a0"/>{Array.from({length:11},(_,i)=><L key={i} x={-165+i*32} y={-10} X={-165+i*32} Y={i%2?17:35} c={ink} sw={3}/>)}</g>;
 }
 if(kind==='magnifier')return <g><circle cx={-45} cy={-55} r={142} fill="#b2d0d0" opacity=".46" stroke={gold} strokeWidth="19"/><L x={58} y={54} X={245} Y={243} c={wood} sw={37}/></g>;
 if(['shield','armor'].includes(kind))return <g>{kind==='shield'?<P d="M0 -230 L205 -145 L174 116 Q95 240 0 282 Q-95 240 -174 116 L-205 -145Z" c="#838e94" stroke={gold} sw={18}/>:<g><P d="M-142 -208 L-75 -263 L76 -263 L145 -204 L180 40 L112 185 L-113 185 L-185 40Z" c="#859297" stroke={gold} sw={10}/><P d="M-80 -137 Q0 -187 80 -137 L65 102 Q0 153 -65 102Z" c="#bec4c4"/></g>}</g>;
 if(kind==='frames')return <g>{[-225,225].map((x,i)=><g key={i} transform={'translate('+x+' 0) scale(.62)'}><R x={-215} y={-276} w={430} h={552} c="#b59663" stroke={gold} sw={17}/>{i?<Mannequin/>:<Statue draped/>}</g>)}</g>;
 if(kind==='balance')return <g><L x={0} y={-250} X={0} Y={220} c={gold} sw={15}/><L x={-236} y={-145} X={236} Y={-145} c={gold} sw={18}/>{[-205,205].map(x=><g key={x}><L x={x} y={-145} X={x} Y={70} c={cream} sw={5}/><P d={'M'+(x-104)+' 68 Q'+x+' 172 '+(x+104)+' 68Z'} c="#b39b7c"/></g>)}</g>;
 if(kind==='clock')return <g><circle r={228} fill="#3d4350" stroke={gold} strokeWidth="20"/>{Array.from({length:12},(_,i)=><L key={i} x={170*Math.cos(i*Math.PI/6)} y={170*Math.sin(i*Math.PI/6)} X={196*Math.cos(i*Math.PI/6)} Y={196*Math.sin(i*Math.PI/6)} c={cream} sw={8}/>)}<g transform={'rotate('+(p*250)+')'}><L x={0} y={0} X={-8} Y={-140} c={gold} sw={13}/></g><L x={0} y={0} X={140} Y={30} c={cream} sw={9}/></g>;
 if(kind==='wine-cup'||kind==='pottery')return <g><ellipse cx={0} cy={-125} rx={162} ry={48} fill="#a27e5f" stroke="#64463b" strokeWidth="8"/><P d="M-162 -121 Q-210 102 -110 198 Q0 245 110 198 Q210 102 162 -121Z" c="#b28b60" stroke="#715246" sw={10}/>{[-1,0,1].map(i=><path key={i} d={'M'+(i*85-35)+' -70 Q'+(i*75+45)+' 70 '+(i*70-35)+' 155'} fill="none" stroke="#6b4d43" strokeWidth="13"/>)}</g>;
 if(kind==='satyr-symbol'||kind==='fertility-symbol')return <g><ellipse cy={28} rx={204} ry={228} fill="#b58b60" stroke="#704b3a" strokeWidth="14"/>{kind==='satyr-symbol'?<g><circle cx={0} cy={-48} r={81} fill="#5b5048"/><P d="M-73 -72 L-174 -208 L-58 -125 M74 -72 L174 -208 L58 -125" c="#e4d0a8"/><circle cx={-29} cy={-49} r={9} fill={gold}/><circle cx={29} cy={-49} r={9} fill={gold}/><P d="M-42 33 Q0 65 42 33" c="none" stroke={gold} sw={9}/></g>:<g>{[0,1,2,3,4].map(i=><ellipse key={i} cx={(i-2)*58} cy={(i%2)*75} rx={28} ry={48} fill={i%2?ruby:'#d8c278'}/>)}</g>}</g>;
 if(['curtain','tents'].includes(kind))return <g><path d="M-220 -240 Q-80 -175 -25 -240 V220 Q-100 132 -210 220Z" fill={ruby}/><path d="M220 -240 Q80 -175 25 -240 V220 Q100 132 210 220Z" fill="#8f5c61"/><L x={-220} y={-232} X={220} Y={-232} c={gold} sw={15}/></g>;
 if(kind==='gate'||kind==='pulpit'||kind==='theatre')return <g><R x={-205} y={-195} w={410} h={420} c="#9b8c78"/><path d="M-150 215 V-10 Q0 -205 150 -10 V215Z" fill="#3a4650"/><R x={-230} y={208} w={460} h={44} c={gold}/></g>;
 if(kind==='street'||kind==='worktable')return <g><R x={-265} y={-105} w={530} h={280} c={kind==='street'?'#9b8570':wood}/><R x={-215} y={175} w={56} h={150} c="#755a47"/><R x={175} y={175} w={56} h={150} c="#755a47"/></g>;
 if(kind==='family-tree')return <g><circle cx={0} cy={-190} r={49} fill={gold}/>{[-170,0,170].map((x,i)=><g key={i}><L x={0} y={-138} X={x} Y={18} c={gold} sw={8}/><circle cx={x} cy={88} r={56} fill={i%2?ruby:'#779292'} stroke={gold} strokeWidth={7}/></g>)}</g>;
 if(kind==='gaze'||kind==='mirror')return <g><ellipse cx={0} cy={0} rx={243} ry={175} fill="#d5c5a8" stroke={gold} strokeWidth={16}/><ellipse cx={0} cy={0} rx={142} ry={142} fill="#405965"/><circle cx={0} cy={0} r={79} fill={kind==='mirror'?'#8aa5a9':'#1b2d3a'}/><circle cx={0} cy={0} r={43} fill="#18202a"/><circle cx={-32} cy={-40} r={23} fill="#edf6ef" opacity=".6"/></g>;
 if(['arrows','question-mark','symbol-cards','advertisement'].includes(kind)){
  if(kind==='arrows')return <g><path d="M-260 -70 H180 L112 -140 M180 -70 L112 0 M260 105 H-160 L-96 35 M-160 105 L-96 177" fill="none" stroke={gold} strokeWidth="19" strokeLinecap="round"/></g>;
  if(kind==='question-mark')return <g><text x={0} y={135} fontSize={440} fontFamily="Noto Sans JP" fontWeight="900" textAnchor="middle" fill={gold}>?</text></g>;
  if(kind==='advertisement')return <g><R x={-195} y={-280} w={390} h={570} c="#344e59" stroke={gold} sw={15}/><R x={-170} y={-235} w={340} h={370} c="#9d957e"/><g transform="translate(0 80) scale(.7)"><Padded/></g><text x={0} y={218} fill={cream} textAnchor="middle" fontSize={32} fontFamily="Noto Sans JP">MEN'S STYLE</text></g>;
  return <g>{[-160,0,160].map((x,i)=><g key={i} transform={'translate('+x+' '+(i%2*50)+')'}><R x={-70} y={-158} w={142} h={295} c={i%2?'#baa27d':'#6b7c7e'} stroke={gold} sw={6}/><circle cx={0} cy={-62} r={33} fill={gold}/><L x={-41} y={28} X={40} Y={28} c={cream} sw={6}/></g>)}</g>;
 }
 throw new Error('V103 unknown semantic visual object: '+kind);
};
