import React from 'react';
import {C,R,L,P,Paper,Person,House,School,Vehicle,Coin,Ring,q,lerp} from './primitives';
export const K={ink:'#17232e',night:'#10202e',paper:'#f1e9da',gold:'#d6b278',red:'#bd6663',teal:'#79aba4',blue:'#7795a7',stone:'#8e8276',wood:'#795f4c'};
export const Text=({x,y,t,s=38,c=K.paper,anchor='middle',opacity=1}:{x:number;y:number;t:string;s?:number;c?:string;anchor?:'start'|'middle'|'end';opacity?:number})=><text x={x} y={y} textAnchor={anchor} fontFamily="Noto Sans JP,sans-serif" fontWeight={740} fontSize={s} fill={c} opacity={opacity}>{t}</text>;
export const easing=(p:number)=>q(p)*q(p)*(3-2*q(p));
const H=(s:string)=>[...s].reduce((h,ch)=>((h*33)^ch.charCodeAt(0))>>>0,713);
const human=new Set('man teacher child family parentchild couple person people'.split(' '));
const documents=new Set('files folders survey checklist speech cards timecard textbook papers arrows planner paycheck ledgers bill calendar chart ledger notebook'.split(' '));
const misc=new Set('pencilcase shadow hands door briefcase bargraph toy anger phone dishes taskboard doors steps schoolbag umbrella helicopter threecircles triad pan blocks city ball housework map clock homes twohomes silhouette mask emotions apartment shield network bridge gamepad sunrise balance weight house'.split(' '));
export const supportedObjects=new Set([...human,...documents,...misc]);
const SW=({x=0,y=0,w=380,h=340,c=K.gold}:{x?:number;y?:number;w?:number;h?:number;c?:string})=><g><R x={x} y={y} w={w} h={h} rx={22} c={c}/><R x={x+25} y={y+25} w={w-50} h={h-50} rx={11} c="#223844" o={.6}/></g>;
export const Subject=({kind,p=0}:{kind:string;p?:number})=>{
 const e=easing(p);
 if(!supportedObjects.has(kind))throw Error('V105 unknown primary object '+kind);
 const doc=['files','folders','survey','checklist','timecard','textbook','papers','planner','paycheck','ledgers','bill','calendar','ledger','notebook'];
 if(kind==='man'||kind==='teacher'||kind==='child'||kind==='person')return <Person x={0} y={-70} role={kind==='child'?'child':kind==='teacher'?'teacher':'modern'} pose={kind==='teacher'?'point':kind==='man'?'write':'stand'} s={1.12} p={p}/>;
 if(kind==='family'||kind==='couple'||kind==='people'||kind==='parentchild')return <g>{(kind==='couple'?[-150,150]:kind==='parentchild'?[-130,160]:[-225,0,225]).map((x,i)=><Person key={i} x={x} y={kind==='parentchild'&&i===1?0:-70} role={kind==='parentchild'&&i===1?'child':i===1?'teacher':'modern'} pose={i%2?'point':'stand'} s={kind==='parentchild'&&i===1?.63:.73} p={p}/>)}</g>;
 if(doc.includes(kind))return <g>{(kind==='files'||kind==='papers'||kind==='folders'||kind==='ledgers'?[-1,0,1]:[0]).map((k,i)=><g key={i} transform={'translate('+(k*27)+' '+(k*-39-e*16)+') rotate('+(k*6)+')'}><R x={-158} y={-225} w={316} h={438} rx={12} c={kind==='folders'?'#a8b4aa':kind==='bill'?'#d8cfc1':K.paper} stroke={K.wood} sw={5}/>{kind==='calendar'||kind==='planner'?<g>{Array.from({length:20},(_,z)=><R key={z} x={-126+(z%5)*52} y={-118+Math.floor(z/5)*63} w={38} h={46} rx={3} c={z<Math.floor(e*20)?K.teal:'#c1c7c0'}/>)}</g>:kind==='checklist'?<g>{Array.from({length:4},(_,z)=><g key={z}><R x={-114} y={-138+z*75} w={28} h={28} c={z<Math.floor(e*5)?K.teal:'#d3d0bf'} stroke={K.ink}/><L x={-70} y={-126+z*75} X={106} Y={-126+z*75} c={K.stone} sw={11}/></g>)}</g>:kind==='paycheck'?<g><Text x={0} y={-90} t="給与" s={46} c={K.ink}/><Text x={0} y={45} t="¥" s={130} c={K.gold}/></g>:<g>{Array.from({length:6},(_,z)=><R key={z} x={-116} y={-136+z*57} w={224-(z%3)*43} h={8} c={z===3?K.red:'#9ca6a2'}/>)}</g>}</g>)}</g>;
 if(kind==='hands')return <g>{[-175,175].map((x,i)=><g key={i}><ellipse cx={x} cy={-50} rx={72} ry={110} fill="#d6b394" stroke={K.ink} strokeWidth={6}/><R x={x-62} y={35} w={124} h={250} rx={26} c={i?K.blue:K.teal}/><L x={x-25} y={-124} X={i?0:25} Y={-162} c="#d6b394" sw={23}/></g>)}</g>;
 if(kind==='door')return <g><R x={-185} y={-295} w={370} h={606} c="#a18d79" stroke={K.paper} sw={13}/><P d={'M-142 -250 L'+lerp(140,65,e)+' -216 L'+lerp(140,65,e)+' 263 L-142 262Z'} c="#526e7b"/><circle cx={lerp(85,25,e)} cy={45} r={14} fill={K.gold}/></g>;
 if(kind==='briefcase')return <g><R x={-235} y={-116} w={470} h={350} rx={25} c="#55534d" stroke={K.gold} sw={9}/><R x={-100} y={-179} w={200} h={88} rx={23} c="#d4b78b"/><R x={-192} y={-60} w={385} h={37} c="#9c8766"/><R x={-42} y={-70} w={84} h={62} rx={9} c={K.gold}/></g>;
 if(kind==='speech')return <g><P d="M-255 -185 Q-260 -250 -190 -255 H200 Q260 -245 255 -170 V100 Q250 160 175 165 H-85 L-200 240 L-155 165 H-175 Q-255 160 -255 85Z" c={K.paper}/>{[0,1,2].map(i=><R key={i} x={-177} y={-137+i*75} w={306-i*43} h={16} rx={8} c={i===1?K.gold:K.blue} o={q((e-i*.13)*3)}/>)}</g>;
 if(kind==='cards'||kind==='arrows')return <g>{[0,1,2].map(i=><g key={i} transform={'translate('+(-230+i*230)+' '+(-80+(i%2)*45)+' ) rotate('+(-8+i*8)+')'}><R x={-100} y={-145} w={200} h={285} rx={15} c={[K.blue,K.gold,K.teal][i]}/><L x={-60} y={20} X={60} Y={20} c={K.paper} sw={13} p={q(e*2-i*.15)}/></g>)}</g>;
 if(kind==='pencilcase')return <g><R x={-235} y={-68} w={470} h={150} rx={40} c="#8a6770" stroke={K.paper} sw={9}/><L x={-180} y={-28} X={180} Y={-28} c={K.gold} sw={10}/>{[0,1,2].map(i=><R key={i} x={-155+i*140} y={-112-40*e} w={22} h={130} c={[K.teal,K.gold,K.blue][i]}/>)}</g>;
 if(kind==='bargraph'||kind==='chart')return <g><L x={-240} y={200} X={245} Y={200} c={K.paper} sw={12}/>{[180,285,145,350].map((h,i)=><R key={i} x={-215+i*132} y={200-h*e} w={94} h={h*e} c={i%2?K.gold:K.teal}/>)}</g>;
 if(kind==='toy'||kind==='ball')return <g><circle cx={0} cy={0} r={150} fill={K.gold} stroke={K.paper} strokeWidth={8}/><P d="M-130 12 Q0 -65 120 3 M0 -148 Q-38 0 0 148" c="none" stroke={K.red} sw={11}/></g>;
 if(kind==='anger'||kind==='emotions')return <g>{[0,1,2].map(i=><circle key={i} cx={kind==='anger'?0:-130+i*130} cy={i%2?55:-35} r={kind==='anger'?155+i*60*e:88} fill={kind==='anger'?'none':[K.red,K.gold,K.teal][i]} stroke={K.red} strokeWidth={kind==='anger'?13:0} opacity={kind==='anger'?.7-i*.16:1}/>)}<Text x={0} y={32} t={kind==='anger'?'!':'…'} s={125} c={K.paper}/></g>;
 if(kind==='phone')return <g><R x={-142} y={-270} w={284} h={520} rx={30} c="#24313b" stroke={K.paper} sw={9}/><R x={-117} y={-223} w={234} h={411} rx={11} c="#607f90"/>{[0,1,2].map(i=><R key={i} x={-84} y={-160+i*105} w={162} h={62} rx={12} c={i===1?K.gold:K.teal} o={q((e-i*.12)*3)}/>)}</g>;
 if(kind==='dishes'||kind==='pan')return <g><ellipse cx={-15} cy={75} rx={232} ry={65} fill="#bdc5c0"/><ellipse cx={-15} cy={76} rx={166} ry={41} fill={kind==='pan'?'#494f53':'#6f8993'}/><L x={165} y={45} X={360} Y={-65} c={kind==='pan'?K.wood:K.paper} sw={19}/>{kind==='pan'&&<L x={-20} y={-135} X={15+55*e} Y={48} c={K.gold} sw={13}/>}</g>;
 if(kind==='taskboard')return <g><SW x={-315} y={-270} w={630} h={540} c="#758b8a"/>{[0,1,2,3].map(i=><g key={i}><R x={-262+(i%2)*260} y={-203+Math.floor(i/2)*197} w={204} h={143} rx={11} c={i%2?K.gold:K.paper}/><R x={-226+(i%2)*260} y={-170+Math.floor(i/2)*197} w={130} h={14} c={K.ink} o={.63}/></g>)}</g>;
 if(kind==='doors')return <g>{[-210,70].map((x,i)=><g key={i} transform={'translate('+x+' 0)'}><R x={0} y={-285} w={188} h={556} c={i?K.blue:K.gold} stroke={K.paper} sw={10}/><R x={28} y={-250} w={120} h={430} c="#263845" o={.5}/><circle cx={155} cy={25} r={12} fill={K.paper}/></g>)}</g>;
 if(kind==='steps')return <g>{[0,1,2,3,4].map(i=><R key={i} x={-390+i*144} y={180-i*91} w={145} h={92+i*91} c={i%2?K.blue:K.stone}/>)}</g>;
 if(kind==='schoolbag')return <g><R x={-190} y={-170} w={380} h={425} rx={67} c="#786b7e"/><R x={-140} y={-245} w={280} h={142} rx={52} c="#62576c"/><R x={-143} y={0} w={286} h={156} rx={22} c="#9d889a"/><R x={-12} y={-105} w={24} h={235} c={K.gold}/></g>;
 if(kind==='umbrella')return <g><P d="M-290 0 Q-220 -260 0 -266 Q220 -260 290 0 Q200 -60 116 0 Q30 -60 -45 0 Q-152 -70 -290 0Z" c={K.blue}/><L x={0} y={-253} X={0} Y={223} c={K.paper} sw={16}/><P d="M0 223 Q23 294 85 231" c="none" stroke={K.paper} sw={15}/></g>;
 if(kind==='helicopter')return <g><R x={-160} y={-72} w={325} h={155} rx={75} c={K.teal}/><R x={145} y={-30} w={170} h={23} c={K.gold}/><L x={-240} y={-150} X={240} Y={-150} c={K.paper} sw={19}/><L x={0} y={-139} X={0} Y={-90} c={K.paper} sw={10}/><L x={-130} y={120} X={145} Y={120} c={K.gold} sw={14}/></g>;
 if(kind==='threecircles'||kind==='triad')return <g>{[0,1,2].map(i=><g key={i}><circle cx={[-152,152,0][i]} cy={[-85,-85,160][i]} r={151} fill={[K.teal,K.gold,K.blue][i]} opacity={.72}/><Text x={[-152,152,0][i]} y={[-80,-80,170][i]} t={['自律','能力','関係'][i]} s={49} c={K.ink}/></g>)}</g>;
 if(kind==='blocks'||kind==='city'||kind==='homes'||kind==='twohomes'||kind==='apartment'||kind==='house'){
  const count=kind==='house'?1:kind==='twohomes'?2:kind==='city'?5:3;
  return <g>{Array.from({length:count},(_,i)=><g key={i} transform={'translate('+(-270+i*(count===5?137:245))+' '+(i%2*60)+') scale('+(count===5?.47:count===1?1.18:.7)+')'}><House x={-130} y={-50} s={1.05} c={i%2?'#a88a76':'#889b96'}/></g>)}</g>;
 }
 if(kind==='housework')return <g><Subject kind="dishes" p={p}/><g transform="translate(-260 -210) scale(.53)"><Subject kind="calendar" p={p}/></g><g transform="translate(270 -220) scale(.52)"><Subject kind="bill" p={p}/></g></g>;
 if(kind==='map')return <g><P d="M-305 -230 L-48 -300 L90 -186 L330 -211 L275 230 L-23 287 L-190 196 L-310 236Z" c="#9fb1a4"/>{[0,1,2].map(i=><circle key={i} cx={-150+i*145} cy={-75+i%2*95} r={18+15*e} fill={i%2?K.gold:K.red}/>)}</g>;
 if(kind==='clock')return <g><circle cx={0} cy={0} r={250} fill="#e9e2d3" stroke={K.ink} strokeWidth={15}/><L x={0} y={0} X={160*Math.sin(e*6.28)} Y={-160*Math.cos(e*6.28)} c={K.ink} sw={14}/><L x={0} y={0} X={-120*Math.cos(e*3.14)} Y={120*Math.sin(e*3.14)} c={K.red} sw={11}/></g>;
 if(kind==='balance'||kind==='weight')return <g><L x={0} y={-235} X={0} Y={255} c={K.paper} sw={19}/><L x={-290} y={-120} X={290} Y={-120} c={K.gold} sw={21}/>{[-200,200].map((x,i)=><g key={i}><L x={x} y={-115} X={x} Y={100+(i?45:-25)*e} c={K.paper} sw={7}/><R x={x-130} y={95+(i?45:-25)*e} w={260} h={25} c={i?K.red:K.teal}/></g>)}</g>;
 if(kind==='shadow'||kind==='silhouette')return <g><P d="M-230 250 L-185 -190 Q-185 -355 0 -350 Q185 -355 185 -190 L230 250Z" c="#4e6473"/><circle cx={0} cy={-255} r={107} fill="#293e4d"/><Person x={0} y={-50} role="child" s={.52} p={p} pose="stand"/></g>;
 if(kind==='mask')return <g><ellipse cx={0} cy={0} rx={185} ry={250} fill={K.paper}/><ellipse cx={-65} cy={-40} rx={28} ry={19} fill={K.ink}/><ellipse cx={65} cy={-40} rx={28} ry={19} fill={K.ink}/><P d="M-80 90 Q0 135 80 90" c="none" stroke={K.ink} sw={9}/><R x={220} y={-220} w={160} h={375} rx={30} c={K.red} o={.6*e}/></g>;
 if(kind==='shield')return <g><P d="M0 -280 L270 -175 L225 105 Q175 230 0 330 Q-175 230 -225 105 L-270 -175Z" c="#677985" stroke={K.gold} sw={17}/><Text x={0} y={55} t="仕事" s={70}/></g>;
 if(kind==='network'||kind==='bridge')return <g>{[-260,0,260].map((x,i)=><g key={i}><circle cx={x} cy={i%2?120:-95} r={74} fill={i%2?K.gold:K.teal}/>{i<2&&<L x={x+64} y={i%2?120:-95} X={x+220} Y={i%2?-95:120} c={K.paper} sw={13} p={e}/>}</g>)}</g>;
 if(kind==='gamepad')return <g><P d="M-245 -95 Q-290 155 -215 190 Q-153 200 -95 105 H95 Q165 200 222 190 Q305 130 245 -95 Q100 -165 -245 -95Z" c="#526b7a"/><L x={-155} y={5} X={-75} Y={5} c={K.paper} sw={13}/><L x={-115} y={-35} X={-115} Y={45} c={K.paper} sw={13}/><circle cx={126} cy={0} r={15} fill={K.gold}/><circle cx={170} cy={43} r={15} fill={K.teal}/></g>;
 if(kind==='sunrise')return <g><circle cx={0} cy={-32+135*(1-e)} r={210} fill={K.gold}/><R x={-520} y={148} w={1040} h={230} c="#243c4b"/>{[-330,-165,0,165,330].map((x,i)=><L key={i} x={x} y={100} X={x*1.3} Y={-80} c={K.paper} sw={6} o={.38*e}/>)}</g>;
 throw Error('V105 missing hand-authored object drawing '+kind);
};

const inner=new Set('classroom gesture office meeting institution kitchen home objects phone desk darkroom calendar planning detail argument audit budget household nightroom dialogue interior relationship learning action clock school nursery payday return collaboration research document'.split(' '));
const outside=new Set('commute street stairs architecture transition park city finale map'.split(' '));
const abstract=new Set('comparison silhouette data emotion diagram split choice timeline scale metaphor causality theory two-worlds montage history balance symbolic mosaic doors'.split(' '));
export const supportedFamilies=new Set([...inner,...outside,...abstract]);
export const Backdrop=({family,environment,p=0}:{family:string;environment:string;p?:number})=>{
 if(!supportedFamilies.has(family))throw Error('V105 unsupported visual family '+family);
 const n=H(environment),shift=(n%4)*42,tone=n%3,e=easing(p);
 if(outside.has(family)){
  const park=family==='park',commute=family==='commute',morning=family==='finale';
  return <g data-setting={environment}><R x={0} y={0} w={1920} h={1080} c={morning?'#b5a68d':park?'#859f91':tone===0?'#617988':'#8b9294'}/><R x={0} y={782} w={1920} h={298} c={park?'#637b62':morning?'#9e8e77':'#697276'}/>
   {family==='map'?<g>{[0,1,2].map(i=><g key={i}><R x={170+i*520} y={130} w={435} h={545} c={i%2?'#768d94':'#aeb6af'}/><R x={220+i*520} y={220} w={300} h={340} c={K.paper} o={.6}/></g>)}</g>:
   Array.from({length:5},(_,i)=><g key={i}><R x={-110+i*447+shift} y={215+(i%3)*83} w={362} h={570-(i%3)*83} c={park?'#6e8d74':morning?'#ac9580':i%2?'#8d9b9d':'#b0aca2'}/>{[0,1,2].map(k=><R key={k} x={-63+i*447+shift+k*95} y={270+(i%3)*83} w={67} h={148} c={park?'#86a88d':'#4e6571'} o={park?.2:.6}/>)}</g>)}
   {park&&[0,1,2].map(i=><g key={i}><L x={140+i*670} y={720} X={110+i*670} Y={440} c="#665841" sw={26}/><circle cx={110+i*670} cy={425} r={148} fill="#557765" opacity={.87}/></g>)}
   {commute&&<g><R x={0} y={552} w={1920} h={214} c="#d6d9d2"/>{[0,1,2,3,4].map(i=><R key={i} x={135+i*361} y={575} w={284} h={160} c="#65818f" stroke={K.paper} sw={9}/>)}</g>}
   {morning&&<circle cx={1500} cy={200+110*(1-e)} r={135} fill={K.gold} opacity={.77}/>}
   </g>;
 }
 if(inner.has(family)){
  const school=family==='classroom'||family==='school'||family==='nursery';
  const work=['office','meeting','institution','research','payday','collaboration','audit','learning'].includes(family);
  const kitchen=['kitchen','home','household','action'].includes(family);
  const dark=['darkroom','nightroom','return','clock'].includes(family);
  const bg=dark?'#303b49':work?'#89999c':school?'#aeb4a8':kitchen?'#b0a69b':tone?'#7c8686':'#978e85';
  return <g data-setting={environment}><R x={0} y={0} w={1920} h={1080} c={bg}/><R x={0} y={795} w={1920} h={285} c={dark?'#3e3738':work?'#76736e':'#85705e'}/>
  {school?<g><R x={130+shift} y={100} w={1090} h={540} c="#425950" stroke="#d4c7a7" sw={23}/><R x={190+shift} y={650} w={1020} h={31} c="#ae9673"/><R x={1410} y={190} w={380} h={480} c="#c7d6d2" stroke="#e7e3d5" sw={14}/></g>:work?<g><R x={90+shift} y={95} w={1030} h={480} c={dark?'#243f4e':'#a9c1c4'} stroke={K.paper} sw={21}/>{[0,1,2].map(i=><R key={i} x={160+shift+i*260} y={155} w={170} h={323} c={dark?'#263f4c':'#7193a4'} o={.8}/>)}</g>:kitchen?<g><R x={108+shift} y={120} w={800} h={350} c="#9faca6" stroke={K.paper} sw={19}/><R x={90} y={590} w={1650} h={195} c="#998875"/><R x={185} y={555} w={540} h={55} c={K.paper}/><R x={1260} y={320} w={440} h={290} c="#ddd6c3"/></g>:<g><R x={170+shift} y={115} w={630} h={470} c={dark?'#1e2e3a':'#b9c4c2'} stroke="#c7beb0" sw={24}/><R x={980} y={275} w={710} h={335} c={dark?'#405267':'#71818a'} rx={34}/></g>}
  {work&&<g><R x={230} y={710} w={1370} h={58} c="#6e6154"/><R x={310} y={759} w={42} h={160} c="#635449"/><R x={1450} y={759} w={42} h={160} c="#635449"/></g>}
  {school&&[0,1,2].map(i=><R key={i} x={245+i*510} y={734} w={330} h={59} c="#8b7764"/>)}
  {family==='nightroom'&&<g><R x={1100} y={500} w={590} h={260} rx={27} c="#4c6373"/><R x={1130} y={430} w={540} h={114} rx={24} c="#607487"/></g>}
  </g>;
 }
 return <g data-setting={environment}><R x={0} y={0} w={1920} h={1080} c={tone?'#192938':'#213341'}/><R x={100+shift} y={113} w={1730-shift*2} h={780} rx={30} c={tone?'#263947':'#314454'} o={.66}/>
  {family==='split'||family==='two-worlds'||family==='comparison'?<g><R x={960} y={0} w={960} h={1080} c="#584c4d" o={.42}/><L x={960} y={105} X={960} Y={900} c={K.gold} sw={10} o={.65}/></g>:null}
  {family==='timeline'||family==='history'?<g><L x={190} y={762} X={1740} Y={762} c={K.gold} sw={12} p={e}/>{[0,1,2,3,4].map(i=><circle key={i} cx={260+i*335} cy={762} r={21} fill={i%2?K.teal:K.gold}/>)}</g>:null}
  {family==='data'||family==='diagram'||family==='theory'||family==='causality'?<g>{[0,1,2,3].map(i=><L key={i} x={250} y={325+i*120} X={1695} Y={325+i*120} c={K.paper} sw={2} o={.09}/>)}</g>:null}
  {family==='emotion'||family==='silhouette'||family==='metaphor'||family==='symbolic'?<g>{[0,1,2].map(i=><circle key={i} cx={270+i*680} cy={190+i%2*130} r={90+i*35} fill="none" stroke={i%2?K.teal:K.gold} strokeWidth={10} opacity={.13}/>)}</g>:null}
 </g>;
};
