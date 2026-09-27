import React from 'react';
import {C,q,lerp,R,L,P,Ring,Person,Vehicle,Gate,Paper,Passport,Coin,Hospital,School,FireStation,Factory,MapBlob} from './primitives';

const Coins=({p,count=5,x=760,y=580}:{p:number;count?:number;x?:number;y?:number})=><>{Array.from({length:count},(_,i)=><Coin key={i} x={x+i*58} y={y+(i%2)*24} p={q(p-i*.08)} r={23}/>)}</>;
const Station=()=> <><R x={0} y={0} w={1920} h={1080} c="#5a6b75"/><R x={0} y={780} w={1920} h={300} c="#605b55"/><R x={110} y={140} w={1700} h={360} c="#465c69"/>{Array.from({length:7},(_,i)=><R key={i} x={170+i*230} y={205} w={170} h={170} c={C.sky}/>)}</>;
const Highway=()=> <><R x={0} y={0} w={1920} h={1080} c={C.sky}/><R x={0} y={720} w={1920} h={360} c="#66736d"/><P d="M560 1080 L800 600 H1120 L1370 1080Z" c="#4e5656"/></>;

export const renderDomesticMarket=(v:number,p:number)=>{
 switch(v){
  case 0:return <g><R x={0} y={0} w={1920} h={1080} c="#8fa094"/><R x={0} y={720} w={1920} h={360} c="#7c6a57"/>{[430,830,1230,1630].map((x,i)=><g key={i}><Gate x={x} y={660} p={0}/><Coins p={p} count={2} x={x-70} y={530}/></g>)}<Vehicle x={260} y={760} p={p} kind="wagon"/></g>;
  case 1:return <g><R x={0} y={0} w={1920} h={1080} c="#817769"/><Person x={460} y={500} s={.7} pose="carry" p={p} role="merchant"/><Person x={1350} y={500} s={.7} pose="write" p={p} role="clerk"/>{Array.from({length:9},(_,i)=><Coin key={i} x={720+i*55} y={590+(i%3)*28} p={q(p-i*.06)} r={22}/>)}<Gate x={960} y={690} p={0}/></g>;
  case 2:return <g><R x={0} y={0} w={1920} h={1080} c="#172630"/>{[390,730,1070,1410].map((x,i)=><g key={i} opacity={1-q((p-i*.12)*1.4)}><Gate x={x} y={650} p={0}/></g>)}<Vehicle x={lerp(260,1640,p)} y={760} p={0} kind="wagon"/><L x={220} y={840} X={1700} Y={840} c={C.gold} sw={12} p={p}/></g>;
  case 3:return <g><R x={0} y={0} w={1920} h={1080} c="#78909a"/><R x={0} y={760} w={1920} h={320} c="#66706e"/><L x={120} y={690} X={1800} Y={690} c={C.steel} sw={20} p={p}/>{Array.from({length:5},(_,i)=><R key={i} x={200+i*340} y={300+(i%2)*70} w={250} h={300} c={i%2?'#708188':'#657982'}/>)}<Vehicle x={lerp(250,1600,p)} y={650} p={0} kind="bus"/></g>;
  case 4:return <g><R x={0} y={0} w={1920} h={1080} c="#13232d"/>{[{x:320,c:C.gold},{x:680,c:C.teal},{x:1040,c:C.blue},{x:1400,c:C.red},{x:1650,c:C.green}].map((n,i)=><g key={i}><circle cx={n.x} cy={430+(i%2)*170} r="82" fill={n.c}/><R x={n.x-45} y={540+(i%2)*70} w={90} h={lerp(20,120,q(p-i*.08))} c={C.paper}/></g>)}<L x={220} y={820} X={1700} Y={820} c={C.paper} sw={9} p={p}/></g>;
  case 5:return <g><MapBlob seed={201} p={1}/><L x={960} y={150} X={960} Y={850} c={C.red} sw={14}/><Vehicle x={560} y={760} p={p} kind="truck"/><Ring x={960} y={540} p={p} c={C.red}/></g>;
  default:throw new Error('domestic_market variant '+v);
 }
};

export const renderBorderTrade=(v:number,p:number)=>{
 switch(v){
  case 0:return <g><Highway/><Vehicle x={480} y={760} p={p} kind="truck"/><Gate x={1060} y={660} p={p}/><Person x={1480} y={500} s={.64} pose="read" p={p} role="clerk"/></g>;
  case 1:return <g><R x={0} y={0} w={1920} h={1080} c="#465864"/><R x={240} y={620} w={1440} h={100} c={C.wood}/><Person x={490} y={500} s={.66} pose="read" p={p} role="clerk"/><Paper x={760} y={220} w={380} h={430}/><Vehicle x={1420} y={690} p={0} kind="truck"/><Ring x={950} y={440} p={p} c={C.teal}/></g>;
  case 2:return <g><R x={0} y={0} w={1920} h={1080} c="#253641"/><Vehicle x={600} y={720} p={0} kind="truck"/><R x={1050} y={250} w={520} h={420} rx={28} c="#40535e"/><Coins p={p} count={8} x={1120} y={500}/><L x={800} y={640} X={1040} Y={520} c={C.gold} sw={13} p={p}/></g>;
  case 3:return <g><R x={0} y={0} w={1920} h={1080} c="#14242e"/><R x={250} y={200} w={560} h={600} rx={30} c="#314651"/><R x={1110} y={200} w={560} h={600} rx={30} c="#314651"/>{Array.from({length:6},(_,i)=><R key={i} x={330+i*58} y={690-(i+1)*52} w={38} h={(i+1)*52} c={C.teal}/>)}{Array.from({length:6},(_,i)=><R key={i} x={1190+i*58} y={690-(i+1)*22} w={38} h={(i+1)*22} c={C.gold}/>)}<L x={820} y={500} X={1100} Y={500} c={C.red} sw={10} p={p}/></g>;
  case 4:return <g><R x={0} y={0} w={1920} h={1080} c="#162630"/><R x={290} y={220} w={520} h={560} rx={28} c="#314651"/><R x={1110} y={220} w={520} h={560} rx={28} c="#314651"/>{Array.from({length:5},(_,i)=><R key={i} x={380+i*65} y={680-(i+1)*60} w={42} h={(i+1)*60} c={C.red} o={lerp(1,.6,p)}/>)}{Array.from({length:5},(_,i)=><R key={i} x={1200+i*65} y={680-(i+1)*38} w={42} h={(i+1)*38} c={C.teal} o={lerp(.4,1,p)}/>)}<Ring x={1370} y={510} p={p} c={C.teal}/></g>;
  case 5:return <g><R x={0} y={0} w={1920} h={1080} c="#1d2c35"/>{[{x:300,y:320,c:C.gold},{x:650,y:680,c:C.teal},{x:1030,y:300,c:C.red},{x:1390,y:680,c:C.blue},{x:1660,y:340,c:C.green}].map((n,i)=><g key={i}><circle cx={n.x} cy={n.y} r="80" fill={n.c}/><L x={n.x} y={n.y} X={960} Y={520} c={n.c} sw={9} p={q(p-i*.08)}/></g>)}<Vehicle x={960} y={800} p={p} kind="truck"/></g>;
  default:throw new Error('border_trade variant '+v);
 }
};

export const renderPassportStation=(v:number,p:number)=>{
 switch(v){
  case 0:return <g><Station/><Vehicle x={880} y={690} p={p} kind="bus"/><Person x={360} y={500} s={.62} pose="carry" p={p} role="traveler"/><Person x={1450} y={500} s={.62} pose="walk" p={p} role="traveler"/></g>;
  case 1:return <g><Station/><L x={120} y={620} X={1800} Y={620} c={C.steel} sw={20}/>{Array.from({length:6},(_,i)=><Person key={i} x={310+i*260} y={500+(i%2)*35} s={.5} pose="walk" p={q(p-i*.04)} role="traveler"/>)}<Gate x={1660} y={670} p={1}/></g>;
  case 2:return <g><R x={0} y={0} w={1920} h={1080} c="#4a5660"/><R x={0} y={760} w={1920} h={320} c="#5e5953"/><Gate x={960} y={680} p={0}/><Person x={560} y={500} s={.7} pose="read" p={p} role="soldier"/><Person x={1320} y={500} s={.7} pose="carry" p={p} role="traveler"/><Ring x={960} y={560} p={p} c={C.red}/></g>;
  case 3:return <g><R x={0} y={0} w={1920} h={1080} c="#172630"/>{Array.from({length:10},(_,i)=><circle key={i} cx={260+(i%5)*350} cy={320+Math.floor(i/5)*400} r="52" fill={i%2?C.teal:C.gold}/>)}<Person x={960} y={500} s={.7} pose="read" p={p} role="clerk"/><L x={960} y={580} X={960} Y={830} c={C.red} sw={11} p={p}/></g>;
  case 4:return <g><R x={0} y={0} w={1920} h={1080} c="#2b3b45"/><Passport x={960} y={470} p={p} s={1.7}/><Gate x={1430} y={700} p={p}/><R x={300} y={620} w={420} h={90} rx={18} c="#42535d"/><L x={720} y={665} X={1200} Y={665} c={C.gold} sw={12} p={p}/></g>;
  default:throw new Error('passport_station variant '+v);
 }
};

export const renderPassportBureaucracy=(v:number,p:number)=>{
 switch(v){
  case 0:return <g><R x={0} y={0} w={1920} h={1080} c="#64584d"/><R x={220} y={620} w={1480} h={110} rx={24} c={C.wood}/>{Array.from({length:7},(_,i)=><Person key={i} x={330+i*210} y={485+(i%2)*28} s={.46} pose="sit" p={q(p-i*.04)} role="diplomat"/>)}<Passport x={960} y={320} p={p} s={.7}/></g>;
  case 1:return <g><R x={0} y={0} w={1920} h={1080} c="#5c5147"/><R x={150} y={100} w={1620} h={840} c="#775f4b"/>{Array.from({length:8},(_,i)=><Passport key={i} x={330+(i%4)*420} y={290+Math.floor(i/4)*430} p={q(p-i*.06)} s={.55+(i%3)*.08}/>)}</g>;
  case 2:return <g><R x={0} y={0} w={960} h={1080} c="#4c5a62"/><R x={960} y={0} w={960} h={1080} c="#6f6255"/><Gate x={490} y={650} p={0}/><Person x={380} y={500} s={.66} pose="carry" p={p} role="traveler"/><Person x={1450} y={500} s={.66} pose="point" p={p} role="diplomat"/><Paper x={1240} y={240} w={330} h={360}/><L x={960} y={100} X={960} Y={980} c={C.paper} sw={14}/></g>;
  case 3:return <g><R x={0} y={0} w={1920} h={1080} c="#24343d"/><Passport x={960} y={500} p={p} s={1.6}/>{Array.from({length:6},(_,i)=><L key={i} x={420+i*210} y={800} X={420+i*210} Y={lerp(780,580,q(p-i*.08))} c={C.gold} sw={9}/>)}</g>;
  case 4:return <g><R x={0} y={0} w={1920} h={1080} c="#263844"/><Passport x={660} y={480} p={p} s={1.05}/><Gate x={1250} y={670} p={p}/><Person x={1500} y={500} s={.64} pose="read" p={p} role="clerk"/><L x={820} y={500} X={1110} Y={610} c={C.gold} sw={11} p={p}/></g>;
  default:throw new Error('passport_bureaucracy variant '+v);
 }
};

export const renderSchengenDrive=(v:number,p:number)=>{
 switch(v){
  case 0:return <g><Highway/><Vehicle x={420} y={760} p={p} kind="car"/><R x={1270} y={400} w={22} h={260} c={C.steel}/><R x={1292} y={435} w={235} h={100} rx={8} c={C.paper}/></g>;
  case 1:return <g><Highway/><Vehicle x={lerp(380,1550,p)} y={760} p={0} kind="car"/><R x={940} y={380} w={22} h={300} c={C.steel}/><R x={962} y={420} w={230} h={100} rx={8} c={C.paper}/><Ring x={1080} y={470} p={p} c={C.teal}/></g>;
  case 2:return <g><R x={0} y={0} w={1920} h={1080} c="#7c929c"/><P d="M0 950 L1920 710 L1920 1080 L0 1080Z" c="#4c5556"/><Gate x={960} y={650} p={1}/><Vehicle x={480} y={760} p={p} kind="car"/><Vehicle x={1420} y={760} p={p} kind="car"/><Ring x={960} y={620} p={p} c={C.gold}/></g>;
  case 3:return <g><R x={0} y={0} w={960} h={1080} c="#596d78"/><R x={960} y={0} w={960} h={1080} c="#7f7468"/><Person x={480} y={500} s={.72} pose="write" p={p} role="clerk"/><Person x={1440} y={500} s={.72} pose="write" p={p} role="clerk"/><Paper x={280} y={220} w={300} h={330}/><Paper x={1280} y={220} w={300} h={330}/><L x={960} y={100} X={960} Y={980} c={C.paper} sw={14}/></g>;
  case 4:return <g><MapBlob seed={231} p={1}/><L x={960} y={150} X={960} Y={850} c={C.red} sw={13}/><circle cx={650} cy={430} r="50" fill={C.blue}/><circle cx={1280} cy={610} r="50" fill={C.gold}/><Ring x={960} y={540} p={p} c={C.teal}/></g>;
  case 5:return <g><R x={0} y={0} w={960} h={1080} c="#536873"/><R x={960} y={0} w={960} h={1080} c="#2d4350"/><Gate x={530} y={650} p={0}/><Gate x={1370} y={650} p={1}/><Vehicle x={380} y={740} p={p} kind="car"/><Vehicle x={1540} y={740} p={p} kind="car"/><L x={960} y={100} X={960} Y={980} c={C.paper} sw={14}/></g>;
  case 6:return <g><R x={0} y={0} w={1920} h={1080} c="#182833"/>{Array.from({length:8},(_,i)=><g key={i}><circle cx={240+i*205} cy={520+(i%2)*140} r="58" fill={i%2?C.teal:C.gold}/>{i<7&&<L x={240+i*205} y={520+(i%2)*140} X={445+i*205} Y={520+((i+1)%2)*140} c={C.paper} sw={7} p={q(p-i*.07)}/>}</g>)}<Vehicle x={960} y={820} p={p} kind="car"/></g>;
  default:throw new Error('schengen_drive variant '+v);
 }
};

export const renderSchengenCooperation=(v:number,p:number)=>{
 switch(v){
  case 0:return <g><R x={0} y={0} w={1920} h={1080} c="#1a2c36"/><R x={180} y={120} w={1560} h={620} rx={30} c="#243c48"/>{Array.from({length:12},(_,i)=><g key={i}><circle cx={300+(i%6)*260} cy={260+Math.floor(i/6)*300} r="42" fill={i%2?C.teal:C.gold}/><L x={300+(i%6)*260} y={302+Math.floor(i/6)*300} X={960} Y={520} c={i%2?C.teal:C.gold} sw={5} p={q(p-i*.04)}/></g>)}<Person x={960} y={520} s={.62} pose="read" p={p} role="police"/></g>;
  case 1:return <g><R x={0} y={0} w={1920} h={1080} c="#71858f"/><Gate x={960} y={660} p={0}/><Vehicle x={460} y={750} p={p} kind="truck"/><Person x={1370} y={500} s={.68} pose="read" p={p} role="clerk"/><Ring x={960} y={600} p={p} c={C.red}/></g>;
  case 2:return <g><R x={0} y={0} w={1920} h={1080} c="#62564b"/><R x={250} y={620} w={1420} h={110} rx={24} c={C.wood}/>{Array.from({length:6},(_,i)=><Person key={i} x={380+i*230} y={485+(i%2)*28} s={.48} pose={i===2?'point':'sit'} p={q(p-i*.05)} role="diplomat"/>)}<Passport x={960} y={330} p={p} s={.65}/></g>;
  case 3:return <g><R x={0} y={0} w={1920} h={1080} c="#152630"/><circle cx={960} cy={540} r="120" fill={C.paper}/>{Array.from({length:9},(_,i)=>{const a=i*Math.PI*2/9,x=960+Math.cos(a)*430,y=540+Math.sin(a)*310;return <g key={i}><circle cx={x} cy={y} r="56" fill={i%2?C.teal:C.gold}/><L x={960} y={540} X={x} Y={y} c={i%2?C.teal:C.gold} sw={8} p={q(p-i*.06)}/></g>})}</g>;
  case 4:return <g><R x={0} y={0} w={1920} h={1080} c="#1c2c35"/><L x={350} y={800} X={1570} Y={800} c={C.red} sw={13} p={1}/>{Array.from({length:5},(_,i)=><g key={i}><circle cx={420+i*270} cy={470+(i%2)*120} r="76" fill={i%2?C.teal:C.blue}/><L x={420+i*270} y={546+(i%2)*120} X={960} Y={800} c={i%2?C.teal:C.blue} sw={7} p={q(p-i*.08)}/></g>)}<Ring x={960} y={800} p={p} c={C.gold}/></g>;
  default:throw new Error('schengen_cooperation variant '+v);
 }
};

export const renderWelfareServices=(v:number,p:number)=>{
 switch(v){
  case 0:return <g><R x={0} y={0} w={1920} h={1080} c="#a0aeaa"/><R x={0} y={760} w={1920} h={320} c="#7a817d"/><Vehicle x={480} y={760} p={p} kind="truck"/><R x={1280} y={560} w={130} h={180} c="#48565c"/><R x={1450} y={560} w={130} h={180} c="#48565c"/><Ring x={1360} y={600} p={p} c={C.teal}/></g>;
  case 1:return <g><R x={0} y={0} w={1920} h={1080} c="#b3c1bb"/><School x={650} y={260} s={1.65}/><Person x={650} y={520} s={.62} pose="point" p={p} role="teacher"/><Person x={1240} y={540} s={.48} pose="stand" p={p} role="child"/><Person x={1410} y={540} s={.48} pose="stand" p={1-p} role="child"/></g>;
  case 2:return <g><R x={0} y={0} w={1920} h={1080} c="#c0cfcb"/><Hospital x={650} y={250} s={1.65}/><Person x={720} y={520} s={.62} pose="carry" p={p} role="nurse"/><Person x={1280} y={530} s={.6} pose="sit" p={p} role="modern"/></g>;
  case 3:return <g><R x={0} y={0} w={1920} h={1080} c="#9ba9a4"/><FireStation x={650} y={250} s={1.65}/><Vehicle x={980} y={750} p={p} kind="fire"/><Person x={480} y={520} s={.62} pose="hold" p={p} role="worker"/></g>;
  case 4:return <g><R x={0} y={0} w={1920} h={1080} c="#162630"/>{Array.from({length:6},(_,i)=><g key={i}><circle cx={300+i*260} cy={420+(i%2)*190} r="78" fill={i%2?C.teal:C.gold}/><Paper x={245+i*260} y={540+(i%2)*80} w={110} h={140}/></g>)}<L x={200} y={830} X={1720} Y={830} c={C.paper} sw={8} p={p}/></g>;
  default:throw new Error('welfare_services variant '+v);
 }
};
