import React from 'react';
import {C,R,L,P,Ring,Person,Vehicle,Paper,q,lerp} from './primitives';
import {Cemetery,MeijiStreet,Classroom,AdminCutaway,QuakeTown,Flag,Newspaper,SteamTrain} from './myth-primitives';

export const renderCemetery=(v:number,p:number)=>{
 switch(v){
  case 0:return <Cemetery p={p}/>;
  case 1:return <g><R x={0} y={0} w={1920} h={1080} c="#adb9b5"/><R x={0} y={700} w={1920} h={380} c="#71846d"/>{Array.from({length:24},(_,i)=><g key={i} transform={'translate('+(140+(i%8)*220)+' '+(430+Math.floor(i/8)*150)+')'}><R x={-30} y={-72} w={60} h={100} rx={22} c={C.white}/><R x={-52} y={-18} w={104} h={26} c={C.white}/></g>)}</g>;
  case 2:return <g><R x={0} y={0} w={1920} h={1080} c="#7a8985"/><Person x={700} y={500} s={.72} pose="stand" p={p}/><Person x={920} y={520} s={.45} pose="stand" p={p} role="child"/><Ring x={1160} y={450} p={p} r={140} c={C.gold}/></g>;
  case 3:return <g><R x={0} y={0} w={1920} h={1080} c="#12202a"/><circle cx={960} cy={540} r="120" fill={C.paper}/>{Array.from({length:12},(_,i)=>{const a=i/12*Math.PI*2,x=960+Math.cos(a)*520,y=540+Math.sin(a)*330;return <g key={i}><circle cx={x} cy={y} r="38" fill={C.steel}/><L x={x} y={y} X={960} Y={540} c={C.gold} sw={5} p={q(p-i*.05)}/></g>})}</g>;
  case 4:return <g><R x={0} y={0} w={1920} h={1080} c="#192832"/><Cemetery p={1}/><Ring x={830} y={510} p={p} r={180} c={C.red}/></g>;
  default:throw new Error('cemetery variant '+v);
 }
};

export const renderSolidarityTax=(v:number,p:number)=>{
 switch(v){
  case 0:return <g><R x={0} y={0} w={1920} h={1080} c="#2d3f49"/><R x={120} y={600} w={380} h={120} c="#5d6667"/><R x={640} y={240} w={310} h={420} c="#8d9b98"/><R x={1100} y={260} w={310} h={400} c="#b6c4c0"/><R x={1500} y={340} w={240} h={320} c="#7a6f64"/>{Array.from({length:5},(_,i)=><circle key={i} cx={360+i*260} cy={820} r="28" fill={C.gold} transform={'translate(0 '+lerp(120,0,q(p-i*.08))+')'}/>)}</g>;
  case 1:return <g><R x={0} y={0} w={1920} h={1080} c="#111d26"/><Person x={480} y={500} s={.72} pose="stand" p={p}/><circle cx={1440} cy={500} r="140" fill={C.gold}/><L x={620} y={500} X={1300} Y={500} c={C.paper} sw={11} p={p}/><Ring x={960} y={500} p={p} c={C.red}/></g>;
  case 2:return <g><R x={0} y={0} w={1920} h={1080} c="#243541"/>{Array.from({length:10},(_,i)=><Person key={i} x={170+i*165} y={520+(i%2)*40} s={.42} pose="stand" p={p} role={i%4===0?'child':'modern'}/>)}<Ring x={960} y={540} p={p} r={350} c={C.teal}/></g>;
  case 3:return <g><R x={0} y={0} w={1920} h={1080} c="#0e1922"/><circle cx={960} cy={540} r="105" fill={C.paper}/>{Array.from({length:14},(_,i)=>{const a=i/14*Math.PI*2,x=960+Math.cos(a)*560,y=540+Math.sin(a)*330;return <g key={i}><circle cx={x} cy={y} r="30" fill={i%2?C.teal:C.gold}/><L x={x} y={y} X={960} Y={540} c={C.steel} sw={4} p={q(p-i*.04)}/></g>})}</g>;
  default:throw new Error('solidarity_tax variant '+v);
 }
};

export const renderMeijiTokyo=(v:number,p:number)=>{
 switch(v){
  case 0:return <MeijiStreet p={p}/>;
  case 1:return <g><MeijiStreet p={p}/><R x={0} y={0} w={960} h={1080} c="#5f5144" o={.12}/><R x={960} y={0} w={960} h={1080} c="#6f8992" o={.18}/><L x={960} y={100} X={960} Y={980} c={C.paper} sw={8} o={.45}/></g>;
  case 2:return <g><R x={0} y={0} w={1920} h={1080} c="#52636d"/><Vehicle x={430} y={720} p={p} kind="wagon"/><SteamTrain x={1180} y={690} p={p} s={.82}/><Person x={980} y={500} s={.64} pose="walk" p={p} role="clerk"/></g>;
  case 3:return <g><R x={0} y={0} w={1920} h={1080} c="#1a2933"/>{Array.from({length:6},(_,i)=><g key={i}><circle cx={300+(i%3)*660} cy={320+Math.floor(i/3)*360} r="95" fill={i%2?C.teal:C.gold}/><R x={220+(i%3)*660} y={430+Math.floor(i/3)*360} w={160} h={80} c={C.paper}/></g>)}<Ring x={960} y={540} p={p} r={260} c={C.red}/></g>;
  case 4:return <g><R x={0} y={0} w={1920} h={1080} c="#253743"/><R x={220} y={180} w={430} h={520} c="#796758"/><R x={745} y={180} w={430} h={520} c="#7e8e92"/><R x={1270} y={180} w={430} h={520} c="#6d7779"/><L x={435} y={780} X={1485} Y={780} c={C.gold} sw={10} p={p}/></g>;
  default:throw new Error('meiji_tokyo variant '+v);
 }
};

export const renderEducationRescript=(v:number,p:number)=>{
 switch(v){
  case 0:return <g><R x={0} y={0} w={1920} h={1080} c="#5d5045"/><Paper x={700} y={150} w={520} h={690}/><Ring x={960} y={490} p={p} r={280} c={C.gold}/></g>;
  case 1:return <g><R x={0} y={0} w={1920} h={1080} c="#1c2b35"/><circle cx={620} cy={540} r="130" fill={C.gold}/><circle cx={1300} cy={540} r="130" fill={C.red}/><L x={750} y={540} X={1170} Y={540} c={C.paper} sw={14} p={p}/></g>;
  case 2:return <Classroom p={p} old/>;
  case 3:return <g><Classroom p={p} old/><L x={520} y={260} X={1500} Y={260} c={C.gold} sw={9} p={p}/><Flag x={1510} y={130} p={p} s={.45} c={C.red}/></g>;
  case 4:return <g><R x={0} y={0} w={1920} h={1080} c="#7d8a87"/>{Array.from({length:6},(_,i)=><ClassroomCell key={i} x={110+(i%3)*600} y={120+Math.floor(i/3)*460} p={q(p-i*.08)}/>)}</g>;
  case 5:return <g><R x={0} y={0} w={1920} h={1080} c="#576771"/><SteamTrain x={600} y={700} p={p} s={.8}/><Newspaper x={1260} y={390} p={p} s={.82}/><L x={820} y={560} X={1110} Y={460} c={C.gold} sw={10} p={p}/></g>;
  case 6:return <g><R x={0} y={0} w={1920} h={1080} c="#162530"/><circle cx={960} cy={540} r="120" fill={C.paper}/>{Array.from({length:8},(_,i)=>{const a=i/8*Math.PI*2,x=960+Math.cos(a)*520,y=540+Math.sin(a)*330;return <g key={i}><circle cx={x} cy={y} r="45" fill={i%2?C.gold:C.teal}/><L x={x} y={y} X={960} Y={540} c={C.steel} sw={5} p={q(p-i*.06)}/></g>})}</g>;
  case 7:return <g><R x={0} y={0} w={1920} h={1080} c="#1a2a34"/><R x={200} y={230} w={400} h={450} c="#6f5f53"/><R x={760} y={230} w={400} h={450} c="#7d8b8e"/><R x={1320} y={230} w={400} h={450} c="#697b83"/><L x={400} y={760} X={1520} Y={760} c={C.gold} sw={10} p={p}/></g>;
  case 8:return <g><R x={0} y={0} w={1920} h={1080} c="#0d1720"/><Paper x={360} y={240} w={320} h={450}/><Newspaper x={960} y={460} p={p} s={1.1}/><Classroom p={p} old/><R x={0} y={0} w={1920} h={1080} c={C.night} o={.38}/><Ring x={960} y={520} p={p} r={320} c={C.gold}/></g>;
  default:throw new Error('education_rescript variant '+v);
 }
};
const ClassroomCell=({x,y,p}:{x:number;y:number;p:number})=><g transform={'translate('+x+' '+y+') scale(.27)'}><R x={0} y={0} w={1500} h={1100} c="#8d8170"/><R x={180} y={120} w={1100} h={320} c="#4a4139"/>{Array.from({length:8},(_,i)=><Person key={i} x={320+(i%4)*260} y={520+Math.floor(i/4)*240} s={.8} pose="sit" p={p} role="child"/>)}</g>;

export const renderAdministrativeMachine=(v:number,p:number)=>{
 switch(v){
  case 0:return <AdminCutaway p={p}/>;
  case 1:return <g><R x={0} y={0} w={1920} h={1080} c="#263944"/>{Array.from({length:5},(_,i)=><Paper key={i} x={180+i*320} y={230+(i%2)*60} w={240} h={330} chart={i%2===0}/>)}<L x={300} y={760} X={1620} Y={760} c={C.teal} sw={11} p={p}/></g>;
  case 2:return <g><R x={0} y={0} w={1920} h={1080} c="#14232d"/><circle cx={960} cy={540} r="130" fill={C.paper}/>{Array.from({length:8},(_,i)=>{const a=i/8*Math.PI*2,x=960+Math.cos(a)*500,y=540+Math.sin(a)*310;return <g key={i}><R x={x-70} y={y-50} w={140} h={100} rx={16} c={i%2?C.teal:C.gold}/><L x={x} y={y} X={960} Y={540} c={C.steel} sw={5} p={q(p-i*.07)}/></g>})}</g>;
  case 3:return <g><R x={0} y={0} w={1920} h={1080} c="#0f1a23"/><Paper x={500} y={250} w={360} h={460} chart/><Paper x={1060} y={250} w={360} h={460}/><Ring x={960} y={500} p={p} r={240} c={C.red}/></g>;
  default:throw new Error('administrative_machine variant '+v);
 }
};

export const renderDisasterSolidarity=(v:number,p:number)=>{
 switch(v){
  case 0:return <QuakeTown p={p}/>;
  case 1:return <g><R x={0} y={0} w={1920} h={1080} c="#334650"/><Person x={420} y={500} s={.7} pose="stand" p={p}/><R x={1170} y={260} w={440} h={400} c="#756a61"/><Ring x={1380} y={480} p={p} c={C.red}/></g>;
  case 2:return <g><R x={0} y={0} w={1920} h={1080} c="#13212b"/>{Array.from({length:8},(_,i)=><CoinDot key={i} x={320+i*160} y={300+(i%2)*120} p={q(p-i*.07)}/>)}<L x={360} y={700} X={1560} Y={700} c={C.gold} sw={12} p={p}/></g>;
  case 3:return <QuakeTown p={p} repair/>;
  case 4:return <g><R x={0} y={0} w={1920} h={1080} c="#77898d"/><R x={180} y={200} w={500} h={460} c="#8f9d9a"/><R x={780} y={200} w={500} h={460} c="#c1cbc7"/><R x={1380} y={200} w={360} h={460} c="#8b8277"/><Vehicle x={960} y={740} p={p} kind="fire"/></g>;
  case 5:return <g><R x={0} y={0} w={1920} h={1080} c="#111d27"/><Paper x={330} y={260} w={360} h={440}/><Person x={960} y={500} s={.7} pose="point" p={p} role="clerk"/><Ring x={1420} y={500} p={p} c={C.gold}/></g>;
  case 6:return <g><R x={0} y={0} w={1920} h={1080} c="#1c2d37"/><Person x={420} y={500} s={.72} pose="stand" p={p}/><R x={1260} y={300} w={320} h={320} c="#8b9695"/><L x={610} y={500} X={1240} Y={500} c={C.paper} sw={10} p={p}/><Ring x={930} y={500} p={p} r={190} c={C.red}/></g>;
  case 7:return <g><R x={0} y={0} w={1920} h={1080} c="#0e1922"/><circle cx={960} cy={540} r="105" fill={C.paper}/>{Array.from({length:12},(_,i)=>{const a=i/12*Math.PI*2,x=960+Math.cos(a)*530,y=540+Math.sin(a)*330;return <g key={i}><circle cx={x} cy={y} r="32" fill={i%2?C.teal:C.gold}/><L x={x} y={y} X={960} Y={540} c={C.steel} sw={4} p={q(p-i*.05)}/></g>})}</g>;
  default:throw new Error('disaster_solidarity variant '+v);
 }
};
const CoinDot=({x,y,p}:{x:number;y:number;p:number})=><circle cx={x} cy={y+lerp(90,0,p)} r="34" fill={C.gold} stroke={C.wood} strokeWidth="5"/>;

export const renderInstitutionAndStory=(v:number,p:number)=>{
 switch(v){
  case 0:return <g><R x={0} y={0} w={960} h={1080} c="#59666a"/><R x={960} y={0} w={960} h={1080} c="#182732"/><AdminCutaway p={p}/><R x={0} y={0} w={960} h={1080} c={C.night} o={.08}/><Ring x={1450} y={500} p={p} r={190} c={C.gold}/></g>;
  case 1:return <g><R x={0} y={0} w={1920} h={1080} c="#374952"/><Vehicle x={520} y={720} p={p} kind="truck"/><R x={1150} y={290} w={420} h={340} c="#c0cbc8"/><Person x={980} y={500} s={.62} pose="walk" p={p} role="nurse"/></g>;
  case 2:return <g><R x={0} y={0} w={1920} h={1080} c="#14232d"/><Paper x={350} y={240} w={360} h={460} chart/><circle cx={1400} cy={500} r="140" fill={C.gold}/><L x={710} y={500} X={1260} Y={500} c={C.paper} sw={11} p={p}/><Ring x={1000} y={500} p={p} c={C.teal}/></g>;
  case 3:return <g><R x={0} y={0} w={1920} h={1080} c="#0e1922"/><circle cx={960} cy={540} r={lerp(80,190,p)} fill={C.paper}/>{Array.from({length:16},(_,i)=>{const a=i/16*Math.PI*2,x=960+Math.cos(a)*570,y=540+Math.sin(a)*350;return <g key={i}><circle cx={x} cy={y} r="28" fill={i%2?C.teal:C.gold}/><L x={x} y={y} X={960} Y={540} c={C.steel} sw={3} p={q(p-i*.035)}/></g>})}</g>;
  case 4:return <g><R x={0} y={0} w={1920} h={1080} c="#172833"/><R x={260} y={220} w={420} h={500} c="#6e7e83"/><R x={1240} y={220} w={420} h={500} c="#8a7867"/><Person x={470} y={500} s={.58} pose="write" p={p} role="clerk"/><Person x={1450} y={500} s={.58} pose="stand" p={p}/><L x={680} y={500} X={1240} Y={500} c={C.gold} sw={12} p={p}/><Ring x={960} y={500} p={p} r={190} c={C.teal}/></g>;
  default:throw new Error('institution_and_story variant '+v);
 }
};
