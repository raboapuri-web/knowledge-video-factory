import React from 'react';
import {C,R,L,Ring,Person,Paper,q,lerp} from './primitives';
import {FestivalHill,Procession,CeremonyAging,LectureHall,Museum,Cemetery,Flag} from './myth-primitives';

export const renderFestivalSupreme=(v:number,p:number)=>{
 switch(v){
  case 0:return <FestivalHill p={p}/>;
  case 1:return <g><R x={0} y={0} w={1920} h={1080} c="#8e846f"/><Procession p={p}/><Ring x={960} y={420} p={p} r={240} c={C.gold}/></g>;
  case 2:return <g><R x={0} y={0} w={1920} h={1080} c="#6f6357"/><R x={210} y={170} w={1500} h={560} c="#887768"/>{Array.from({length:10},(_,i)=><Person key={i} x={300+i*145} y={470+(i%2)*30} s={.42} pose="stand" p={q(p-i*.04)} role="modern"/>)}<Flag x={960} y={190} p={p} s={.62} c={C.blue}/></g>;
  case 3:return <g><R x={0} y={0} w={1920} h={1080} c="#17252f"/><circle cx={520} cy={540} r="170" fill="#6a564b"/><circle cx={1400} cy={540} r="170" fill={C.red}/><L x={690} y={540} X={1230} Y={540} c={C.gold} sw={16} p={p}/><Ring x={1400} y={540} p={p} c={C.paper}/></g>;
  case 4:return <g><R x={0} y={0} w={1920} h={1080} c="#344650"/><R x={260} y={220} w={420} h={500} c="#67584e"/><R x={1240} y={220} w={420} h={500} c="#7f8e91"/><L x={680} y={480} X={1240} Y={480} c={C.gold} sw={14} p={p}/><Person x={960} y={480} s={.7} pose="point" p={p} role="diplomat"/></g>;
  case 5:return <g><R x={0} y={0} w={1920} h={1080} c="#8d806d"/><Procession p={p}/><Flag x={360} y={160} p={p} s={.62} c={C.red}/><Flag x={1450} y={160} p={1-p} s={.62} c={C.blue}/></g>;
  case 6:return <g><R x={0} y={0} w={1920} h={1080} c="#111d27"/><circle cx={960} cy={540} r={lerp(80,210,p)} fill={C.paper}/>{Array.from({length:8},(_,i)=>{const a=i/8*Math.PI*2,x=960+Math.cos(a)*520,y=540+Math.sin(a)*320;return <g key={i}><circle cx={x} cy={y} r="48" fill={i%2?C.red:C.blue}/><L x={x} y={y} X={960} Y={540} c={C.gold} sw={6} p={q(p-i*.07)}/></g>})}</g>;
  case 7:return <g><R x={0} y={0} w={1920} h={1080} c="#0e1821"/><R x={330} y={260} w={520} h={430} c="#6b594e"/><R x={1070} y={260} w={520} h={430} c="#73858c"/><Ring x={590} y={475} p={1-p} c={C.red}/><Ring x={1330} y={475} p={p} c={C.gold}/></g>;
  default:throw new Error('festival_supreme variant '+v);
 }
};

export const renderInventedTradition=(v:number,p:number)=>{
 switch(v){
  case 0:return <CeremonyAging p={p} stage={0}/>;
  case 1:return <Procession p={p}/>;
  case 2:return <CeremonyAging p={p} stage={0}/>;
  case 3:return <CeremonyAging p={p} stage={1}/>;
  case 4:return <CeremonyAging p={p} stage={2}/>;
  case 5:return <g><R x={0} y={0} w={1920} h={1080} c="#2b3c47"/><R x={250} y={200} w={420} h={500} c="#8d7a66"/><R x={750} y={200} w={420} h={500} c="#7d8a86"/><R x={1250} y={200} w={420} h={500} c="#687983"/><L x={460} y={760} X={1460} Y={760} c={C.gold} sw={11} p={p}/></g>;
  case 6:return <g><R x={0} y={0} w={1920} h={1080} c="#5e554c"/><Paper x={320} y={220} w={350} h={480}/><Paper x={790} y={220} w={350} h={480}/><Paper x={1260} y={220} w={350} h={480}/><Ring x={960} y={470} p={p} r={320} c={C.red}/></g>;
  case 7:return <g><R x={0} y={0} w={1920} h={1080} c="#162630"/><Flag x={960} y={170} p={p} s={.85} c={C.red}/>{Array.from({length:6},(_,i)=><Ring key={i} x={460+i*200} y={630+(i%2)*50} p={q(p-i*.08)} r={85} c={i%2?C.teal:C.gold}/>)}</g>;
  default:throw new Error('invented_tradition variant '+v);
 }
};

export const renderRitualMemory=(v:number,p:number)=>{
 switch(v){
  case 0:return <g><R x={0} y={0} w={1920} h={1080} c="#1b2b36"/><R x={300} y={230} w={500} h={500} c="#6e5e52"/><R x={1120} y={230} w={500} h={500} c="#7b898a"/><Ring x={960} y={480} p={p} r={220} c={C.gold}/></g>;
  case 1:return <CeremonyAging p={p} stage={0}/>;
  case 2:return <g><R x={0} y={0} w={1920} h={1080} c="#7d837b"/><Person x={650} y={500} s={.72} pose="stand" p={p}/><Person x={860} y={520} s={.45} pose="stand" p={p} role="child"/><Flag x={1250} y={180} p={p} s={.7} c={C.red}/><Ring x={760} y={500} p={p} c={C.teal}/></g>;
  case 3:return <g><R x={0} y={0} w={1920} h={1080} c="#0f1c26"/><R x={680} y={230} w={560} h={480} c="#728188"/><Ring x={960} y={470} p={p} r={300} c={C.gold}/><L x={960} y={710} X={960} Y={900} c={C.paper} sw={10} p={p}/></g>;
  case 4:return <g><R x={0} y={0} w={1920} h={1080} c="#263844"/><Person x={960} y={480} s={.8} pose="stand" p={p}/><Ring x={960} y={520} p={p} r={280} c={C.red}/></g>;
  case 5:return <g><R x={0} y={0} w={1920} h={1080} c="#22333f"/><Flag x={420} y={210} p={p} s={.68} c={C.red}/><circle cx={960} cy={480} r="115" fill={C.gold}/><R x={1320} y={240} w={260} h={360} c="#8b8072"/><L x={600} y={500} X={1240} Y={500} c={C.paper} sw={8} p={p}/></g>;
  case 6:return <g><R x={0} y={0} w={1920} h={1080} c="#101b24"/><circle cx={960} cy={540} r="105" fill={C.paper}/>{Array.from({length:9},(_,i)=>{const a=i/9*Math.PI*2,x=960+Math.cos(a)*500,y=540+Math.sin(a)*320;return <Ring key={i} x={x} y={y} p={q(p-i*.05)} r={70} c={i%3===0?C.red:i%3===1?C.teal:C.gold}/>})}</g>;
  default:throw new Error('ritual_memory variant '+v);
 }
};

export const renderRenanSorbonne=(v:number,p:number)=>{
 switch(v){
  case 0:return <LectureHall p={p}/>;
  case 1:return <g><R x={0} y={0} w={1920} h={1080} c="#14232d"/><circle cx={960} cy={500} r="120" fill={C.paper}/>{['A','B','C'].map((k,i)=><g key={k}><circle cx={480+i*480} cy={720} r="100" fill={i===0?C.red:i===1?C.teal:C.gold}/><L x={480+i*480} y={620} X={960} Y={500} c={C.steel} sw={8} p={q(p-i*.12)}/></g>)}</g>;
  case 2:return <g><R x={0} y={0} w={1920} h={1080} c="#4c5b63"/><Person x={480} y={500} s={.66} pose="stand" p={p}/><Person x={1440} y={500} s={.66} pose="stand" p={p}/><L x={620} y={500} X={1300} Y={500} c={C.gold} sw={12} p={p}/><Ring x={960} y={500} p={p} c={C.teal}/></g>;
  case 3:return <g><R x={0} y={0} w={1920} h={1080} c="#1a2832"/><Paper x={430} y={220} w={420} h={520}/><Paper x={1070} y={220} w={420} h={520}/><L x={850} y={480} X={1070} Y={480} c={C.red} sw={12} p={p}/></g>;
  case 4:return <g><R x={0} y={0} w={1920} h={1080} c="#202f38"/>{Array.from({length:7},(_,i)=><circle key={i} cx={420+i*180} cy={430+(i%2)*160} r="62" fill={i%2?C.teal:C.gold} opacity={i===3?lerp(1,.15,p):1}/>)}<Ring x={960} y={510} p={p} r={290} c={C.red}/></g>;
  case 5:return <g><R x={0} y={0} w={1920} h={1080} c="#0d1720"/><circle cx={960} cy={540} r={lerp(90,210,p)} fill={C.paper}/><L x={960} y={540} X={620} Y={320} c={C.gold} sw={9} p={p}/><L x={960} y={540} X={1300} Y={320} c={C.teal} sw={9} p={p}/></g>;
  default:throw new Error('renan_sorbonne variant '+v);
 }
};

export const renderHistoryClassroom=(v:number,p:number)=>{
 switch(v){
  case 0:return <g><R x={0} y={0} w={1920} h={1080} c="#9aa9a6"/><R x={0} y={780} w={1920} h={300} c="#786f63"/><R x={180} y={120} w={1560} h={350} c="#425a62"/><Person x={360} y={450} s={.66} pose="point" p={p} role="teacher"/>{Array.from({length:12},(_,i)=><Person key={i} x={650+(i%4)*260} y={530+Math.floor(i/4)*150} s={.34} pose="sit" p={p} role="child"/>)}</g>;
  case 1:return <g><R x={0} y={0} w={1920} h={1080} c="#5b5148"/><Paper x={540} y={160} w={840} h={700}/><L x={620} y={250} X={1300} Y={250} c={C.red} sw={9} p={p}/>{Array.from({length:7},(_,i)=><R key={i} x={640} y={320+i*68} w={lerp(180,620,q(p-i*.06))} h={11} c={i%2?C.steel:C.gold}/>)}</g>;
  case 2:return <g><R x={0} y={0} w={1920} h={1080} c="#182833"/>{Array.from({length:18},(_,i)=><R key={i} x={140+(i%6)*280} y={160+Math.floor(i/6)*260} w={220} h={180} c={i%3===0?C.red:i%3===1?C.teal:C.gold} o={i>8?lerp(1,.18,p):1}/>)}</g>;
  case 3:return <g><R x={0} y={0} w={1920} h={1080} c="#243642"/><Paper x={260} y={220} w={360} h={500}/><Paper x={780} y={300} w={360} h={340}/><Paper x={1300} y={390} w={360} h={220}/><L x={440} y={780} X={1480} Y={780} c={C.gold} sw={10} p={p}/></g>;
  case 4:return <Museum p={p} storage={false}/>;
  case 5:return <Museum p={p} storage/>;
  default:throw new Error('history_classroom variant '+v);
 }
};

export const renderMuseumSelection=(v:number,p:number)=>{
 switch(v){
  case 0:return <Museum p={p} storage/>;
  case 1:return <Museum p={p} storage={false}/>;
  case 2:return <g><R x={0} y={0} w={1920} h={1080} c="#151f27"/><R x={180} y={180} w={1560} h={600} fill="none" stroke={C.paper} strokeWidth="10"/>{Array.from({length:16},(_,i)=><circle key={i} cx={300+(i%8)*180} cy={330+Math.floor(i/8)*300} r="50" fill={i===5||i===10?C.gold:C.steel} opacity={i===5||i===10?1:.25}/>)}<Ring x={1200} y={630} p={p} c={C.red}/></g>;
  case 3:return <g><R x={0} y={0} w={1920} h={1080} c="#5d5248"/><Paper x={260} y={220} w={360} h={500}/><Paper x={780} y={220} w={360} h={500}/><Paper x={1300} y={220} w={360} h={500}/><Ring x={960} y={480} p={p} r={360} c={C.gold}/></g>;
  case 4:return <g><R x={0} y={0} w={1920} h={1080} c="#1b2b35"/><Person x={960} y={480} s={.8} pose="stand" p={p} role="diplomat"/><Ring x={960} y={480} p={p} r={260} c={C.gold}/></g>;
  case 5:return <g><R x={0} y={0} w={1920} h={1080} c="#111c25"/><R x={640} y={240} w={640} h={420} c="#4c5860"/><P d="M620 660 L960 340 L1300 660Z" c={C.red}/><Ring x={960} y={530} p={p} c={C.paper}/></g>;
  case 6:return <g><R x={0} y={0} w={1920} h={1080} c="#2a3943"/><L x={250} y={540} X={1670} Y={540} c={C.steel} sw={10} p={p}/>{Array.from({length:5},(_,i)=><g key={i}><circle cx={350+i*300} cy={540} r="45" fill={i===2?C.red:C.gold}/><R x={270+i*300} y={260+(i%2)*90} w={160} h={150} c={i%2?C.teal:C.blue}/></g>)}</g>;
  case 7:return <g><R x={0} y={0} w={1920} h={1080} c="#0e1821"/><circle cx={960} cy={540} r="105" fill={C.paper}/>{Array.from({length:6},(_,i)=><Ring key={i} x={480+i*190} y={470+(i%2)*150} p={q(p-i*.08)} r={80} c={i%2?C.red:C.gold}/>)}</g>;
  default:throw new Error('museum_selection variant '+v);
 }
};

export const renderInauguration=(v:number,p:number)=>{
 switch(v){
  case 0:return <g><R x={0} y={0} w={1920} h={1080} c="#d4d9d8"/><R x={0} y={750} w={1920} h={330} c="#a5aaa6"/><R x={540} y={220} w={840} h={430} c="#e6e2d9"/><Person x={960} y={430} s={.72} pose="point" p={p} role="diplomat"/>{Array.from({length:12},(_,i)=><Person key={i} x={250+(i%6)*285} y={690+Math.floor(i/6)*120} s={.31} pose="stand" p={p} role="modern"/>)}</g>;
  case 1:return <g><R x={0} y={0} w={1920} h={1080} c="#172631"/><Paper x={540} y={220} w={340} h={500}/><Flag x={1320} y={180} p={p} s={.78} c={C.red}/><Person x={960} y={500} s={.62} pose="hold" p={p} role="diplomat"/></g>;
  case 2:return <g><R x={0} y={0} w={1920} h={1080} c="#233540"/><Person x={480} y={490} s={.68} pose="stand" p={p} role="diplomat"/><Person x={1440} y={490} s={.68} pose="stand" p={p} role="diplomat"/><L x={620} y={500} X={1300} Y={500} c={C.gold} sw={12} p={p}/></g>;
  case 3:return <g><R x={0} y={0} w={1920} h={1080} c="#101c25"/><circle cx={960} cy={520} r="150" fill={C.paper}/>{Array.from({length:8},(_,i)=>{const a=i/8*Math.PI*2,x=960+Math.cos(a)*500,y=520+Math.sin(a)*300;return <circle key={i} cx={x} cy={y} r="55" fill={i%2?C.blue:C.gold} opacity={q(p-i*.08)}/>})}<Ring x={960} y={520} p={p} r={250} c={C.red}/></g>;
  case 4:return <g><R x={0} y={0} w={1920} h={1080} c="#1a2a34"/><R x={230} y={250} w={360} h={420} c="#7c6c5e"/><R x={780} y={250} w={360} h={420} c="#6f8288"/><R x={1330} y={250} w={360} h={420} c="#847c70"/><L x={410} y={760} X={1510} Y={760} c={C.gold} sw={10} p={p}/></g>;
  default:throw new Error('inauguration variant '+v);
 }
};
