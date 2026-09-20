import React from 'react';
import raw from './scene-data.json';

type Scene={id:string;phase:string;variant:number;narration:string;bgGroup:string;bgSeed:number;shotKind:string;visual:string};
const scenes=raw as Scene[];
const C={ink:'#07111c',night:'#0b1623',wall:'#1c2d3e',wall2:'#314c5b',paper:'#e6e3d9',muted:'#abbcc5',teal:'#6fb5ae',red:'#d46c73',gold:'#e6bd79',green:'#9cbfa6',blue:'#7294b8',dark:'#243441'};
const lim=(p:number)=>Math.max(0,Math.min(1,p));
const smooth=(p:number)=>{const q=lim(p);return q*q*(3-2*q)};
const tween=(a:number,b:number,p:number)=>a+(b-a)*smooth(p);
const rng=(s:number,k:number)=>((s*977+837*k+k*k*39)%10007)/10007;
const match=(s:string,re:RegExp)=>re.test(s);
const Box=({x,y,w,h,fill=C.wall2,r=8,o=1}:{x:number;y:number;w:number;h:number;fill?:string;r?:number;o?:number})=><rect x={x} y={y} width={w} height={h} rx={r} fill={fill} opacity={o}/>;
const Trace=({x,y,X,Y,stroke=C.paper,sw=7,p=1,o=1}:{x:number;y:number;X:number;Y:number;stroke?:string;sw?:number;p?:number;o?:number})=><line x1={x} y1={y} x2={tween(x,X,p)} y2={tween(y,Y,p)} stroke={stroke} strokeWidth={sw} opacity={o} strokeLinecap="round"/>;
const Page=({x,y,s=1,a=0,stamp=false,o=1,marks=5}:{x:number;y:number;s?:number;a?:number;stamp?:boolean;o?:number;marks?:number})=><g opacity={o} transform={'translate('+x+' '+y+') rotate('+a+') scale('+s+')'}><Box x={0} y={0} w={188} h={244} fill={C.paper} r={4}/><path d="M142 0 L188 46 L143 46Z" fill="#becbd0"/>{Array.from({length:marks},(_,i)=><Box key={i} x={25} y={34+32*i} w={i%3===0?110:140} h={7} fill="#667584" r={2} o={.68}/>)}{stamp&&<g><circle cx={138} cy={181} r={29} fill="none" stroke={C.red} strokeWidth={7}/><Trace x={117} y={180} X={132} Y={194} stroke={C.red} sw={6}/><Trace x={132} y={194} X={160} Y={163} stroke={C.red} sw={6}/></g>}</g>;
const Folder=({x,y,p=0,open=false,s=1,accent=C.gold}:{x:number;y:number;p?:number;open?:boolean;s?:number;accent?:string})=><g transform={'translate('+x+' '+y+') scale('+s+')'}><path d="M0 30 h100 l30 -23 h165 q18 0 18 19 v190 H0Z" fill={accent} opacity=".82"/><path d={open?'M0 60 H315 L280 235 H-18 Z':'M0 44 H310 L302 230 H0Z'} fill="#bba784"/><Box x={24} y={70} w={252} h={11} fill={C.paper} r={3} o={.45+p*.4}/></g>;
const Laptop=({x,y,s=1,p=.5,mode='proposal'}:{x:number;y:number;s?:number;p?:number;mode?:'proposal'|'email'|'budget'|'calendar'|'chart'})=><g transform={'translate('+x+' '+y+') scale('+s+')'}><Box x={0} y={0} w={490} h={315} fill="#263c4c" r={19}/><Box x={17} y={15} w={456} h={277} fill="#0b1927" r={8}/><Box x={-27} y={309} w={544} h={20} fill="#83949b" r={7}/><Box x={177} y={308} w={130} h={5} fill="#4b5b65" r={2}/>
 {mode==='proposal'&&<g><Page x={124} y={36} s={.83} o={.95} stamp={p>.76}/><Box x={345} y={62} w={86} h={11} fill={C.teal} r={2} o={.5}/><Box x={345} y={91} w={66} h={11} fill={C.teal} r={2} o={.5}/></g>}
 {mode==='email'&&<g><Box x={40} y={48} w={380} h={30} fill={C.wall2}/>{Array.from({length:4},(_,i)=><g key={i}><Box x={40} y={101+i*43} w={380} h={31} fill={i<=Math.floor(p*4)?C.red:C.wall2} o={i<=Math.floor(p*4)?.7:.4}/><circle cx={66} cy={116+i*43} r={8} fill={C.gold}/></g>)}</g>}
 {mode==='budget'&&<g><Box x={45} y={44} w={392} h={230} fill="#1b3444"/>{Array.from({length:4},(_,i)=><g key={i}><Box x={70} y={73+i*52} w={i===3?Math.min(300,90+300*p):150+i*29} h={21} fill={i===3?C.red:C.teal} r={4}/></g>)}</g>}
 {mode==='calendar'&&<g>{Array.from({length:5},(_,i)=><g key={i}><Box x={43+i*83} y={74} w={67} h={143} fill={i===2?C.gold:'#32516a'} r={5} o={.7}/><Box x={50+i*83} y={136} w={53} h={Math.max(12,60*p)} fill={i===2?C.teal:C.red} r={5}/></g>)}</g>}
 {mode==='chart'&&<g>{Array.from({length:6},(_,i)=><Box key={i} x={55+i*62} y={226-tween(20,47+i*22,p)} w={42} h={tween(20,47+i*22,p)} fill={i%3===0?C.gold:C.teal}/>)}</g>}
 </g>;
const Actor=({x,y=500,s=1,role='worker',stress=false,hand=0,walk=0,coat}:{x:number;y?:number;s?:number;role?:'worker'|'boss'|'client';stress?:boolean;hand?:number;walk?:number;coat?:string})=>{
 const suit=coat||(role==='boss'?'#647d8c':role==='client'?'#b6a798':'#98afb0');
 return <g transform={'translate('+x+' '+y+') scale('+s+')'}>
 <ellipse cx="0" cy="2" rx="64" ry="77" fill={role==='client'?'#d4b69f':'#cba68e'}/>
 <path d={role==='boss'?'M-69 0 C-81 -89 81 -110 67 -2 L55 -47 L-44 -28Z':'M-66 -12 Q-78 -97 6 -101 Q74 -94 70 -3 L39 -54 L-63 -36Z'} fill={role==='boss'?'#293847':'#352f32'}/>
 <circle cx="-23" cy="-5" r="5" fill="#293540"/><circle cx="22" cy="-5" r="5" fill="#293540"/>
 <path d={stress?'M-19 42 Q0 22 22 42':'M-19 34 Q0 43 22 34'} fill="none" stroke="#564b49" strokeWidth="5"/>
 <path d="M-60 79 Q0 66 60 79 L82 287 H-83Z" fill={suit}/><path d="M-21 84 L0 112 L21 84 L10 264 L0 281 L-10 264Z" fill="#29455a"/>
 <Trace x={-65} y={108} X={-96-hand} Y={265-hand} stroke={suit} sw={24}/><Trace x={64} y={108} X={93+hand} Y={267-hand} stroke={suit} sw={24}/>
 <Trace x={-36} y={277} X={-41+walk} Y={449} stroke="#435567" sw={30}/><Trace x={36} y={277} X={42-walk} Y={449} stroke="#435567" sw={30}/>
 </g>;
};
const Clock=({x=1440,y=170,r=82,h=9,m=17}:{x?:number;y?:number;r?:number;h?:number;m?:number})=><g><circle cx={x} cy={y} r={r} fill="#182839" stroke="#adbdc3" strokeWidth="12"/>{Array.from({length:12},(_,i)=>{const a=i*Math.PI/6;return <circle key={i} cx={x+Math.sin(a)*r*.8} cy={y-Math.cos(a)*r*.8} r="4" fill={C.paper}/>})}<Trace x={x} y={y} X={x+Math.sin(h*Math.PI/6)*r*.45} Y={y-Math.cos(h*Math.PI/6)*r*.45} sw={9}/><Trace x={x} y={y} X={x+Math.sin(m*Math.PI/30)*r*.7} Y={y-Math.cos(m*Math.PI/30)*r*.7} stroke={C.red} sw={6}/></g>;
const Phone=({x,y,p=0,good=false}:{x:number;y:number;p?:number;good?:boolean})=><g><Box x={x} y={y} w={260} h={450} fill="#475868" r={28}/><Box x={x+13} y={y+16} w={234} h={409} fill="#112334" r={17}/>{Array.from({length:5},(_,i)=><Box key={i} x={x+32} y={y+50+i*65} w={190-i%3*29} h={18} fill={good?C.teal:i<Math.floor(p*6)?C.red:C.muted} o={.55}/>)}</g>;
const Overlay=({x,y,w,h,fill=C.gold,alpha=1}:{x:number;y:number;w:number;h:number;fill?:string;alpha?:number})=><g opacity={alpha}><rect x={x} y={y} width={w} height={h} rx={10} fill={fill}/></g>;
const Ring=({x,y,r=75,p=1,color=C.gold}:{x:number;y:number;r?:number;p?:number;color?:string})=><circle cx={x} cy={y} r={tween(13,r,p)} fill="none" stroke={color} strokeWidth={9} opacity={p*.9}/>;
const Arrow=({x,y,X,Y,p=1,color=C.gold}:{x:number;y:number;X:number;Y:number;p?:number;color?:string})=><g><Trace x={x} y={y} X={X} Y={Y} stroke={color} sw={9} p={p}/>{p>.85&&<path d={'M'+(X-30)+' '+(Y-16)+' L'+X+' '+Y+' L'+(X-30)+' '+(Y+16)} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>}</g>;
const Plate=({m}:{m:Scene})=>{
 const s=m.bgSeed,phase=m.phase;
 const part=phase.includes('car')?'car':phase.includes('boundary')?'boundary':phase.includes('information')||phase.includes('head_')?'archive':phase.includes('responsibility')?'client':phase.includes('checkpoint')?'checkpoint':phase.includes('work_returns')||phase.includes('prep_')?'planning':phase.includes('thinking')?'meeting':phase.includes('skill')?'training':phase.includes('help')?'corridor':phase.includes('opening')||phase.includes('ending')?'opening':'studio';
 const dark=['opening_attempt','checkpoint_bad','thinking_collapse','help_empty','responsibility_bad','work_returns'].includes(phase);
 const wx=130+Math.floor(rng(s,1)*360),wy=110+Math.floor(rng(s,2)*85),ww=390+Math.floor(rng(s,3)*220);
 const deskX=70+Math.floor(rng(s,4)*110),deskY=770+Math.floor(rng(s,5)*90);
 const wall=dark?'#1c2734':['#1c313c','#263746','#21313b','#26373d','#233b43'][s%5];
 return <g data-static-continuity-plate={m.bgGroup}>
 <rect width="1920" height="1080" fill={wall}/>
 <path d={'M0 0 L'+(700+Math.round(rng(s,6)*750))+' 0 L'+(580+Math.round(rng(s,7)*770))+' 1080 L0 1080Z'} fill="#4f7586" opacity={.11+rng(s,8)*.18}/>
 <path d="M0 900 L1920 885 L1920 1080 L0 1080Z" fill="#101e2a"/>
 {part==='car'?<g><path d="M0 630 L1920 620 L1920 1080 H0Z" fill="#253f4e"/><path d="M250 520 L1100 320 L1800 530" stroke="#788f9c" strokeWidth="22" fill="none"/>{Array.from({length:9},(_,i)=><Trace key={i} x={150+i*209} y={680} X={190+i*209} Y={680} stroke={C.paper} o={.25} sw={7}/>)}</g>:<g><Box x={wx} y={wy} w={ww} h={380} fill="#7d909b" r={3}/><Box x={wx+13} y={wy+13} w={ww-26} h={354} fill={dark?'#132639':'#395f70'} r={2}/>{Array.from({length:9},(_,i)=><g key={i}><Box x={wx+20+i*(ww-45)/9} y={wy+175+(i%3)*20} w={22+(i%3)*11} h={160-(i%4)*21} fill={dark?'#121d2b':'#1e404d'} r={1}/><Box x={wx+20+i*(ww-45)/9} y={wy+183+(i%3)*20} w={20} h={12} fill={C.gold} o={dark?.24:.06}/></g>)}<Trace x={wx+ww/2} y={wy+10} X={wx+ww/2} Y={wy+370} stroke="#91a5ae" sw={8}/><Trace x={wx+10} y={wy+195} X={wx+ww-10} Y={wy+195} stroke="#91a5ae" sw={8}/></g>}
 {part==='archive'?<g>{Array.from({length:4},(_,i)=><g key={i}><Box x={840+i*240} y={190} w={193} h={540} fill="#203543"/>{Array.from({length:4},(_,j)=><g key={j}><Box x={860+i*240} y={240+j*113} w={155} h={20} fill="#91a3a7" o={.55}/><Box x={871+i*240} y={266+j*113} w={25} h={73} fill={j%2?C.gold:C.teal} o={.67}/><Box x={917+i*240} y={270+j*113} w={53} h={66} fill={C.paper} o={.35}/></g>)}</g>)}</g>:null}
 {part==='checkpoint'||part==='planning'||part==='training'?<g><Box x={890} y={135} w={860} h={570} fill="#d5dcd8" r={6}/><Box x={912} y={159} w={816} h={519} fill="#243d4b" r={4}/>{Array.from({length:4},(_,i)=><Trace key={i} x={970} y={230+i*96} X={1680} Y={230+i*96} stroke={C.muted} sw={4} o={.25}/>)}</g>:null}
 {part==='client'?<g><Box x={590} y={200} w={1220} h={405} fill="#27404a" r={5}/><Box x={610} y={220} w={1180} h={360} fill="#39515a" r={5} o={.8}/>{Array.from({length:5},(_,i)=><Box key={i} x={630+i*231} y={255} w={190} h={302} fill={i%2?'#273e4c':'#2b4855'} r={3}/>)}</g>:null}
 {part==='corridor'?<g>{Array.from({length:4},(_,i)=><g key={i}><Box x={770+i*278} y={170} w={205} h={590} fill="#2b4450" r={5}/><Box x={792+i*278} y={200} w={161} h={535} fill="#152b39" r={2}/><circle cx={925+i*278} cy="480" r="8" fill={C.gold}/></g>)}</g>:null}
 {part==='boundary'?<g><Box x={810} y={135} w={900} h={520} fill="#243d4c" r={14}/>{Array.from({length:9},(_,i)=><Box key={i} x={850+i*96} y={220} w={68} h={365} fill={i%2?C.blue:C.teal} o={.06+(i%4)*.04} r={2}/>)}</g>:null}
 {part==='meeting'||part==='studio'?<g><Box x={860} y={130} w={780} h={450} fill="#233846" r={6}/><Box x={885} y={160} w={730} h={398} fill="#293f4b" r={4}/></g>:null}
 {part==='opening'||part==='meeting'||part==='checkpoint'||part==='client'||part==='planning'||part==='training'||part==='studio'||part==='archive'||part==='corridor'||part==='boundary'?<g><path d={'M'+deskX+' '+deskY+' L1780 '+(deskY-22)+' L1880 975 L-40 988Z'} fill="#364956"/><Trace x={deskX} y={deskY} X={1800} Y={deskY-16} stroke="#82969e" sw={18} o={.8}/></g>:null}
 <circle cx={1660-Math.round(rng(s,9)*150)} cy={112+Math.round(rng(s,10)*40)} r={37+Math.round(rng(s,11)*26)} fill={C.gold} opacity=".1"/>
 <rect x="0" y="0" width="1920" height="1080" fill="none" stroke={C.ink} strokeWidth="30" opacity=".25"/>
 </g>;
};
const DeskScene=({m,p,good=false,final=false}:{m:Scene;p:number;good?:boolean;final?:boolean})=>{
 const t=m.narration,x=good?1340:1350,worker=good?500:495;
 return <g data-foreground={m.visual}>
 <Actor x={worker} y={420} s={.82} stress={!good&&match(t,/分から|困|怒|止まる|終わって|孤立|一人/)}/><Actor x={x} y={380} s={.81} role="boss" hand={match(t,/渡|指示|引き受け|説明/)?tween(0,27,p):0}/>
 <Clock x={970} y={190} h={9} m={17}/>
 {match(t,/資料|提案|案件|説明|初め|月曜日|席|目的|権限/)&&<g><Page x={850} y={710} s={.7} o={tween(.35,1,p)} stamp={good&&p>.8}/><Folder x={1040} y={755} s={.52} p={p} open={good}/></g>}
 {match(t,/予算|三十万円|条件|納期|水曜日|確認|判断|相談/)&&<g><Page x={1140} y={650} s={.75} stamp={good&&p>.36}/>{good&&<g><Ring x={1340} y={785} r={93} p={p} color={C.teal}/><Arrow x={1390} y={700} X={750} Y={630} p={p} color={C.teal}/></g>}</g>}
 {match(t,/時計|金曜日|期限|終わ|戻|出勤/)&&<Ring x={970} y={190} p={p} r={118} color={good?C.teal:C.red}/>}
 {match(t,/残|孤立|一人|何も|分から|立ち去|待|まだ/)&&!good&&<g><path d={'M1260 440 L'+tween(1330,1680,p)+' 440'} stroke={C.red} strokeWidth="8" opacity=".8"/><Ring x={500} y={485} r={115} p={p} color={C.red}/></g>}
 {good&&match(t,/責任|引き受け|説明|案が通ら|困った|支え/)&&<g><path d="M1470 500 Q1000 220 590 515" stroke={C.teal} strokeWidth="10" fill="none" strokeDasharray="27 12" opacity={tween(.1,.85,p)}/></g>}
 {final&&match(t,/孤立|一人|自分の判断|上司はもう|似て/)&&<g><Actor x={x} y={380} s={.81} role="boss" coat="#5e8d87"/><Arrow x={1100} y={520} X={675} Y={550} color={C.gold} p={p}/></g>}
 </g>;
};
const Attempt=({m,p}:{m:Scene;p:number})=>{const t=m.narration;return <g><Actor x={255} y={550} s={.72} stress/><Laptop x={685} y={275} s={1.08} p={p} mode={match(t,/メール|取引|関係部署/)?'email':'proposal'}/>
 {match(t,/過去|資料|フォルダ|企画|修正/)&&Array.from({length:4},(_,i)=><Page key={i} x={390+i*92} y={655-i*29} s={.53} a={i*7-11} o={i<=Math.floor(p*5)?1:.24} stamp={i<2&&match(t,/違う|大胆|弱い/)}/>)}
 {match(t,/上司|インパクト|約束|まだ|怒/)&&<g><Actor x={1570} y={470} s={.7} role="boss" hand={tween(0,40,p)}/><Trace x={1470} y={440} X={1190} Y={495} stroke={C.red} sw={12} p={p}/></g>}
 {match(t,/金曜日|期限|まだ/)&&<Clock x={1470} y={170} h={5} m={53}/>}</g>};
const Authority=({m,p,car=false}:{m:Scene;p:number;car?:boolean})=>{
 const t=m.narration;
 if(car)return <g><path d="M460 640 Q520 440 850 445 H1180 Q1440 465 1520 655 L1590 795 H400Z" fill="#647f8b"/><path d="M490 575 Q900 325 1440 575" stroke="#d4e0df" strokeWidth="28" fill="none"/><circle cx="670" cy="795" r="125" fill="#172733" stroke="#9fb6bc" strokeWidth="40"/><circle cx="1340" cy="795" r="125" fill="#172733" stroke="#9fb6bc" strokeWidth="40"/>
 <Actor x={790} y={330} s={.49} stress/><Actor x={1180} y={285} s={.57} role="boss"/>
 <circle cx={mix(850,1190,p)} cy={495} r="91" fill="none" stroke={C.gold} strokeWidth="20"/><Trace x={850} y={495} X={1165} Y={455} stroke={C.red} sw={17} p={p}/><Trace x={1225} y={470} X={1440} Y={500} stroke={C.red} sw={17} p={p}/>
 {match(t,/事故|運転|責め|曲がれ|止まれ/)&&<Ring x={930} y={575} p={p} r={170} color={C.red}/>}</g>;
 return <g><Actor x={340} y={510} s={.7} stress/><Actor x={1540} y={480} s={.7} role="boss"/><Laptop x={730} y={295} s={.9} mode="proposal" p={p}/>{[0,1,2,3].map((_,i)=>{const x=540+i*310;return <g key={i}><Box x={x} y={740} w={224} h={96} fill={i===0?C.teal:i<=Math.floor(p*4)?C.red:C.wall2} o={.68} r={14}/>{i>0&&<Trace x={x-70} y={780} X={x-25} Y={780} stroke={C.gold} p={p} sw={11}/>}</g>})}
 {match(t,/予算|承認|契約|他部署|決め|権限/)&&<g><Page x={1060} y={660} s={.48} stamp={p>.55}/><Ring x={1560} y={520} p={p} r={105} color={C.red}/></g>}</g>;
};
const Boundary=({m,p,good}:{m:Scene;p:number;good:boolean})=>{const t=m.narration;return <g><Actor x={320} y={485} s={.75} stress={!good}/><Actor x={1610} y={485} s={.75} role="boss"/><Laptop x={700} y={320} p={p} mode="budget"/>
 {Array.from({length:8},(_,i)=><g key={i}><Box x={625+i*116} y={760} w={91} h={79} fill={good?(i<=5?C.teal:C.dark):(i%2?C.red:C.gold)} o={good?i<Math.ceil(p*8)?.84:.16:.25+.6*p} r={8}/></g>)}
 {good?<g><Trace x={1240} y={670} X={1240} Y={860} stroke={C.gold} sw={18}/><Ring x={850} y={740} r={132} p={p} color={C.teal}/>{match(t,/契約|事前|相談/)&&<Page x={1500} y={680} s={.53} stamp/>}</g>:<g><circle cx={tween(780,1440,p)} cy={655} r="72" stroke={C.red} strokeWidth="14" fill="none"/>{match(t,/質問|聞|いちいち/)&&Array.from({length:3},(_,i)=><Ring key={i} x={705+i*140} y={190+i*44} p={p} r={80} color={C.red}/>)}</g>}
 </g>};
const Thinking=({m,p}:{m:Scene;p:number})=>{const t=m.narration;return <g><Actor x={350} y={500} s={.78} stress/><Actor x={1560} y={480} s={.72} role="boss" hand={tween(0,46,p)}/>
 <Laptop x={705} y={265} s={.95} p={p} mode="proposal"/>
 {Array.from({length:5},(_,i)=><g key={i}><Page x={480+i*217} y={730-((i%2)*52)} s={.48} a={i*4-8} stamp={i<=Math.floor(p*5)} o={i<=Math.floor(p*5)?1:.25}/><Trace x={545+i*220} y={700} X={545+i*220} Y={585} stroke={i%2?C.red:C.gold} sw={8} p={p}/></g>)}
 {match(t,/怒|失敗|安全|主体|提案|報告/)&&<g><Ring x={370} y={460} p={p} color={C.red} r={155}/><path d="M650 215 Q1010 65 1430 215" stroke={C.red} strokeWidth="8" fill="none" opacity=".6"/></g>}
 </g>};
const Checkpoint=({m,p,good}:{m:Scene;p:number;good:boolean})=>{const t=m.narration;return <g><Actor x={300} y={480} s={.73} stress={!good}/><Actor x={1500} y={440} s={.71} role="boss"/><Laptop x={755} y={315} s={.88} mode={match(t,/水曜日|月曜日|金曜日/)?'calendar':'proposal'} p={p}/>
 {[0,1,2,3,4].map((_,i)=><g key={i}><Box x={510+i*244} y={790} w={214} h={80} fill={i===2?C.gold:C.wall2} o={good?(i===2?.9:.6):(i<=Math.floor(p*5)?C.red===C.red?.72:.5:.2)} r={8}/>{i===2&&good&&<Ring x={617+i*244} y={831} r={76} p={p} color={C.teal}/>}</g>)}
 {good&&match(t,/修正|納期|方向|資料|部分/)&&<g><Page x={1410} y={700} s={.55} stamp={p>.4}/><Arrow x={1360} y={430} X={1220} Y={420} p={p} color={C.teal}/></g>}
 {!good&&match(t,/違う|間違|赤|修正|完成/)&&<g>{Array.from({length:5},(_,i)=><Trace key={i} x={720+i*70} y={230} X={900+i*70} Y={650} stroke={C.red} sw={12} p={p} o={.82}/>)}</g>}
 </g>};
const Information=({m,p,good}:{m:Scene;p:number;good:boolean})=>{const t=m.narration;return <g><Actor x={315} y={465} s={.72} stress={!good}/><Actor x={1560} y={425} s={.73} role="boss"/><Laptop x={830} y={335} s={.85} p={p} mode="proposal"/>
 {good?<g>{Array.from({length:5},(_,i)=><Page key={i} x={650+i*190} y={720-((i%3)*45)} s={.46} stamp={i<=Math.floor(p*5)} o={i<=Math.floor(p*5)?1:.12}/>)}
 <Arrow x={1430} y={340} X={690} Y={345} p={p} color={C.teal}/></g>:<g><circle cx={1530} cy={278} r={160} fill="#1d3b48" stroke={C.gold} strokeWidth="11"/>{Array.from({length:5},(_,i)=><g key={i}><Page x={1460+i*24} y={210+i*19} s={.28} o={i<=Math.floor(p*5)?1:.25}/><Arrow x={1490+i*8} y={300} X={1250-i*24} Y={570} p={i%2?0:p} color={C.red}/></g>)}
 {match(t,/去年|資料に|頭の中|情報/)&&<Ring x={1530} y={278} p={p} r={188} color={C.red}/>}</g>}
 </g>};
const Help=({m,p,good}:{m:Scene;p:number;good:boolean})=>{const t=m.narration;return <g><Actor x={310} y={500} s={.76} stress={!good}/><Actor x={1550} y={470} s={.76} role="boss"/>
 <Page x={750} y={350} s={1.05} stamp={good&&p>.65}/>
 {good?<g>{Array.from({length:4},(_,i)=><g key={i}><Box x={640+i*245} y={745} w={214} h={116} fill={i<=Math.floor(p*4)?C.teal:C.wall2} r={13} o={.8}/><Trace x={665+i*245} y={799} X={713+i*245} Y={825} stroke={C.paper} sw={8} p={p}/></g>)}
 {match(t,/一緒|二つ|相談|遅れ|調整/)&&<Arrow x={1470} y={560} X={480} Y={565} p={p} color={C.gold}/>}</g>:<g>{Array.from({length:6},(_,i)=><Ring key={i} x={780+i*145} y={240+(i%2)*120} p={p} r={52+(i%3)*23} color={C.red}/>)}<Phone x={1030} y={470} p={p}/></g>}
 </g>};
const Responsibility=({m,p,good}:{m:Scene;p:number;good:boolean})=>{const t=m.narration;return <g><Actor x={290} y={425} s={.8} role="client" stress/><Actor x={1000} y={440} s={.74} stress={!good}/><Actor x={1630} y={430} s={.78} role="boss" hand={good?tween(0,23,p):-tween(0,45,p)}/>
 <Page x={760} y={720} s={.7} stamp={!good}/>
 {good?<g><path d={'M1625 545 Q1330 '+tween(250,410,p)+' 1000 545'} fill="none" stroke={C.teal} strokeWidth="14"/><path d={'M1010 545 Q690 '+tween(420,330,p)+' 360 545'} fill="none" stroke={C.gold} strokeWidth="12"/>{match(t,/責任|説明|対応|原因|本人/)&&<Ring x={1590} y={520} p={p} r={147} color={C.teal}/>}</g>:<g><Trace x={1530} y={660} X={1830} Y={660} stroke={C.red} sw={14} p={p}/><Ring x={1010} y={490} p={p} r={130} color={C.red}/></g>}
 </g>};
const WorkReturns=({m,p}:{m:Scene;p:number})=>{const t=m.narration;return <g><Actor x={290} y={455} s={.77} role="boss" stress/><Laptop x={950} y={290} s={.89} p={p} mode="email"/>
 {Array.from({length:14},(_,i)=>{const x=610+(i%7)*140,y=680+Math.floor(i/7)*115;return <g key={i}><Page x={x} y={y} s={.42} a={i%2?6:-9} o={i<Math.floor(p*15)?1:.17} stamp={i%3===0&&i<Math.floor(p*15)}/></g>})}
 {match(t,/戻|通知|メール|確認|修正|電話/)&&<g><Phone x={1490} y={330} p={p}/><Arrow x={1420} y={570} X={440} Y={580} p={p} color={C.red}/></g>}
 </g>};
const Preparation=({m,p}:{m:Scene;p:number})=>{const t=m.narration;return <g><Actor x={370} y={490} s={.68} role="boss"/><Actor x={1510} y={490} s={.68}/>
 <Laptop x={740} y={275} s={.91} mode={match(t,/予算|範囲/)?'budget':match(t,/確認|機会/)?'calendar':'chart'} p={p}/>
 {Array.from({length:5},(_,i)=>{const x=875+i*145,y=195+i%2*118;return <g key={i} opacity={i<=Math.floor(p*5)?1:.12}><Page x={x} y={y} s={.4} stamp={i%2===0}/><Trace x={x+40} y={y+110} X={430} Y={600} stroke={C.teal} sw={4} p={p}/></g>})}
 {match(t,/判断|減ら|仕事|増え|共有/)&&<Arrow x={680} y={540} X={1410} Y={545} p={p} color={C.gold}/>}
 </g>};
const Skill=({m,p}:{m:Scene;p:number})=>{const t=m.narration;return <g><Actor x={360} y={470} s={.75} role="boss"/><Actor x={1480} y={470} s={.75} stress={match(t,/毎日|一時間|そこまで/)}/>
 {Array.from({length:3},(_,i)=><g key={i}><Box x={690+i*260} y={345} w={215} h={365} fill={i===0?C.gold:i===1?C.teal:C.blue} o={i===Math.floor(p*3)?.75:.3} r={10}/><Page x={723+i*260} y={390} s={.73} stamp={i<Math.ceil(p*3)}/></g>)}
 {match(t,/初め|経験|難し|影響|確認/)&&<g><Ring x={900+Math.round(p*450)} y={550} p={p} color={C.teal} r={112}/><Arrow x={550} y={620} X={1300} Y={625} p={p} color={C.gold}/></g>}
 </g>};
const Motion:Record<string,React.FC<{m:Scene;p:number}>>={
 opening_call:({m,p})=><DeskScene m={m} p={p}/>,
 opening_attempt:Attempt,
 opening_other:({m,p})=><DeskScene m={m} p={p} good/>,
 authority_task:({m,p})=><Authority m={m} p={p}/>,
 authority_car:({m,p})=><Authority m={m} p={p} car/>,
 boundary_unknown:({m,p})=><Boundary m={m} p={p} good={false}/>,
 boundary_clear:({m,p})=><Boundary m={m} p={p} good/>,
 thinking_collapse:Thinking,
 checkpoint_bad:({m,p})=><Checkpoint m={m} p={p} good={false}/>,
 checkpoint_good:({m,p})=><Checkpoint m={m} p={p} good/>,
 head_information:({m,p})=><Information m={m} p={p} good={false}/>,
 information_shared:({m,p})=><Information m={m} p={p} good/>,
 help_empty:({m,p})=><Help m={m} p={p} good={false}/>,
 help_defined:({m,p})=><Help m={m} p={p} good/>,
 responsibility_bad:({m,p})=><Responsibility m={m} p={p} good={false}/>,
 responsibility_good:({m,p})=><Responsibility m={m} p={p} good/>,
 work_returns:WorkReturns,
 prep_investment:Preparation,
 skill_adjust:Skill,
 ending_return:({m,p})=><DeskScene m={m} p={p} good final/>
};
export const SceneVisual=({n,progress}:{n:number;progress:number})=>{
 const m=scenes[n-1]??scenes[0],p=lim(progress);
 const Scene=Motion[m.phase];
 if(!Scene)throw new Error('Missing semantic motion scene: '+m.phase);
 const z=m.shotKind==='detail'?1.023:m.shotKind==='macro'?1.04:1;
 // The environmental plate is fully time invariant; group seed changes only at a cut.
 return <svg viewBox="0 0 1920 1080" width="1920" height="1080" style={{position:'absolute',inset:0,overflow:'hidden'}}>
  <Plate m={m}/>
  <g data-narration-specific-foreground={m.visual} transform={'translate('+((1-z)*960)+' '+((1-z)*540)+') scale('+z+')'}><Scene m={m} p={p}/></g>
 </svg>;
};