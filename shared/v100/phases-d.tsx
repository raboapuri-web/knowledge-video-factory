import React from 'react';
import {C,R,L,P,Ring,Person,Vehicle,Paper,q,lerp} from './primitives';
import {FutureCity,SchoolPhoto,SymbolRemoval,ServiceState,Stadium,CrowdRow,Flag,VisualThesis} from './myth-primitives';

export const renderFutureCity=(v:number,p:number)=>{
 switch(v){
  case 0:return <FutureCity p={p} model/>;
  case 1:return <g><R x={0} y={0} w={1920} h={1080} c="#455a66"/><FutureCity p={p}/><R x={0} y={0} w={1920} h={1080} c={C.night} o={.16}/><Ring x={960} y={520} p={p} r={320} c={C.gold}/></g>;
  case 2:return <g><R x={0} y={0} w={1920} h={1080} c="#13232d"/><circle cx={960} cy={540} r="125" fill={C.paper}/>{Array.from({length:6},(_,i)=><g key={i}><circle cx={360+i*240} cy={400+(i%2)*230} r="70" fill={i%2?C.teal:C.gold}/><L x={360+i*240} y={400+(i%2)*230} X={960} Y={540} c={C.steel} sw={5} p={q(p-i*.08)}/></g>)}</g>;
  case 3:return <g><R x={0} y={0} w={1920} h={1080} c="#28404c"/><R x={230} y={210} w={540} h={520} c="#819398"/><R x={1150} y={210} w={540} h={520} c="#95a79e"/><L x={770} y={470} X={1150} Y={470} c={C.gold} sw={14} p={p}/><Ring x={960} y={470} p={p} c={C.teal}/></g>;
  case 4:return <g><R x={0} y={0} w={1920} h={1080} c="#0e1922"/><P d="M250 800 C540 530 700 590 960 430 C1200 280 1440 330 1680 170" c="none" stroke={C.teal} sw={16}/><circle cx={250} cy={800} r="62" fill={C.gold}/><circle cx={960} cy={430} r="62" fill={C.red}/><circle cx={1680} cy={170} r="62" fill={C.blue}/><Ring x={960} y={430} p={p} r={180} c={C.paper}/></g>;
  default:throw new Error('future_city variant '+v);
 }
};

export const renderFutureGenerations=(v:number,p:number)=>{
 switch(v){
  case 0:return <g><R x={0} y={0} w={1920} h={1080} c="#536771"/><R x={220} y={690} w={1480} h={90} c="#6e7471"/>{Array.from({length:8},(_,i)=><R key={i} x={300+i*170} y={630-(i%3)*80} w={95} h={60+(i%3)*80} c={i%2?C.teal:C.gold} o={q(p-i*.05)}/>)}</g>;
  case 1:return <g><R x={0} y={0} w={1920} h={1080} c="#1c2e38"/><Person x={520} y={500} s={.7} pose="stand" p={p}/><L x={700} y={500} X={1220} Y={500} c={C.gold} sw={12} p={p}/><R x={1260} y={300} w={340} h={360} c="#879a9c"/></g>;
  case 2:return <g><R x={0} y={0} w={1920} h={1080} c="#263943"/><Person x={430} y={500} s={.72} pose="stand" p={p}/><Person x={960} y={510} s={.48} pose="stand" p={p} role="child"/><Person x={1490} y={500} s={.72} pose="stand" p={p}/><L x={570} y={500} X={1350} Y={500} c={C.paper} sw={7} p={p}/></g>;
  case 3:return <g><R x={0} y={0} w={1920} h={1080} c="#15252f"/>{Array.from({length:4},(_,i)=><g key={i}><Person x={380+i*390} y={500} s={.58+i*.06} pose="stand" p={q(p-i*.08)} role={i===0?'child':'modern'}/><Ring x={380+i*390} y={480} p={q(p-i*.08)} r={90} c={i%2?C.teal:C.gold}/></g>)}</g>;
  case 4:return <g><R x={0} y={0} w={1920} h={1080} c="#10202a"/><circle cx={610} cy={540} r="120" fill={C.gold}/><circle cx={1310} cy={540} r="120" fill={C.teal}/><L x={730} y={540} X={1190} Y={540} c={C.paper} sw={12} p={p}/><Ring x={960} y={540} p={p} r={210} c={C.red}/></g>;
  case 5:return <g><R x={0} y={0} w={1920} h={1080} c="#0e1922"/><circle cx={960} cy={540} r="110" fill={C.paper}/>{Array.from({length:10},(_,i)=>{const a=i/10*Math.PI*2,x=960+Math.cos(a)*520,y=540+Math.sin(a)*330;return <g key={i}><circle cx={x} cy={y} r="34" fill={i<5?C.gold:C.teal}/><L x={x} y={y} X={960} Y={540} c={C.steel} sw={4} p={q(p-i*.05)}/></g>})}</g>;
  default:throw new Error('future_generations variant '+v);
 }
};

export const renderSchoolPhoto=(v:number,p:number)=>{
 switch(v){
  case 0:return <SchoolPhoto p={p}/>;
  case 1:return <g><R x={0} y={0} w={1920} h={1080} c="#aab9b4"/>{Array.from({length:8},(_,i)=><Person key={i} x={260+i*200} y={500+(i%2)*30} s={.52} pose="stand" p={p} role="child"/>)}<Ring x={960} y={500} p={p} r={310} c={C.gold}/></g>;
  case 2:return <g><R x={0} y={0} w={1920} h={1080} c="#243743"/>{Array.from({length:4},(_,i)=><R key={i} x={170+i*440} y={230} w={360} h={500} c={i%2?'#6f8188':'#8b7867'}/>) }<L x={290} y={800} X={1610} Y={800} c={C.paper} sw={8} p={p}/></g>;
  case 3:return <SchoolPhoto p={p} narrow/>;
  case 4:return <g><R x={0} y={0} w={1920} h={1080} c="#172630"/><R x={350} y={180} w={1220} h={650} c="none" stroke={C.red} strokeWidth={26}/>{Array.from({length:12},(_,i)=><Person key={i} x={500+(i%4)*300} y={390+Math.floor(i/4)*170} s={.36} pose="stand" p={p} role="child"/>)}<R x={350} y={180} w={lerp(0,220,p)} h={650} c={C.black} o={.75}/><R x={lerp(1570,1350,p)} y={180} w={220} h={650} c={C.black} o={.75}/></g>;
  case 5:return <g><R x={0} y={0} w={1920} h={1080} c="#0e1922"/><Person x={760} y={500} s={.75} pose="stand" p={p} role="child"/><Person x={1160} y={500} s={.75} pose="stand" p={p} role="child"/><L x={960} y={180} X={960} Y={850} c={C.red} sw={14} p={p}/><Ring x={960} y={500} p={p} r={190} c={C.paper}/></g>;
  default:throw new Error('school_photo variant '+v);
 }
};

export const renderMythBoundary=(v:number,p:number)=>{
 switch(v){
  case 0:return <g><R x={0} y={0} w={1920} h={1080} c="#121f29"/><circle cx={960} cy={540} r={lerp(120,250,p)} fill={C.paper}/><Ring x={960} y={540} p={p} r={350} c={C.red}/></g>;
  case 1:return <g><R x={0} y={0} w={1920} h={1080} c="#263944"/>{Array.from({length:14},(_,i)=><Person key={i} x={160+(i%7)*250} y={360+Math.floor(i/7)*360} s={.42} pose="stand" p={p} role={i%5===0?'child':'modern'}/>)}<R x={230} y={160} w={1460} h={650} c="none" stroke={C.red} strokeWidth={lerp(10,40,p)}/></g>;
  case 2:return <g><R x={0} y={0} w={1920} h={1080} c="#172732"/><circle cx={560} cy={540} r="170" fill={C.gold}/><circle cx={1360} cy={540} r="170" fill={C.red}/><L x={730} y={540} X={1190} Y={540} c={C.paper} sw={13} p={p}/><Ring x={1360} y={540} p={p} c={C.paper}/></g>;
  case 3:return <g><R x={0} y={0} w={1920} h={1080} c="#514a43"/><Paper x={260} y={240} w={350} h={450}/><Paper x={785} y={240} w={350} h={450}/><Paper x={1310} y={240} w={350} h={450}/><L x={435} y={760} X={1485} Y={760} c={C.gold} sw={9} p={p}/></g>;
  case 4:return <g><R x={0} y={0} w={1920} h={1080} c="#1a2b35"/><R x={260} y={220} w={420} h={500} c="#75858b"/><R x={750} y={220} w={420} h={500} c="#8f7f6c"/><R x={1240} y={220} w={420} h={500} c="#6e8188"/><Ring x={960} y={500} p={p} r={310} c={C.red}/></g>;
  case 5:return <g><R x={0} y={0} w={1920} h={1080} c="#0f1b24"/><circle cx={960} cy={540} r="100" fill={C.paper}/>{Array.from({length:8},(_,i)=>{const a=i/8*Math.PI*2,x=960+Math.cos(a)*500,y=540+Math.sin(a)*320;return <g key={i}><circle cx={x} cy={y} r="45" fill={i%2?C.teal:C.gold}/><L x={x} y={y} X={960} Y={540} c={C.steel} sw={4} p={q(p-i*.07)}/></g>})}</g>;
  case 6:return <g><R x={0} y={0} w={1920} h={1080} c="#14232d"/><R x={260} y={200} w={1400} h={600} c="none" stroke={C.paper} strokeWidth="12"/><R x={260} y={200} w={lerp(700,0,p)} h={600} c={C.red} o={.28}/><R x={960+lerp(0,700,p)} y={200} w={700-lerp(0,700,p)} h={600} c={C.red} o={.28}/><Ring x={960} y={500} p={p} r={260} c={C.gold}/></g>;
  default:throw new Error('myth_boundary variant '+v);
 }
};

export const renderMythlessState=(v:number,p:number)=>{
 switch(v){
  case 0:return <SymbolRemoval p={p}/>;
  case 1:return <g><R x={0} y={0} w={1920} h={1080} c="#6b7b80"/><Flag x={400} y={210} p={0} s={.62} c={C.red}/><R x={760} y={230} w={300} h={380} c={C.paper}/><R x={1220} y={250} w={350} h={300} c={C.gold}/>{Array.from({length:3},(_,i)=><L key={i} x={300+i*420} y={190} X={600+i*420} Y={700} c={C.red} sw={16} p={p}/>)}</g>;
  case 2:return <g><R x={0} y={0} w={1920} h={1080} c="#1c2d38"/><R x={250} y={170} w={1420} h={620} c="#7c8784"/>{Array.from({length:5},(_,i)=><Paper key={i} x={330+i*260} y={250+(i%2)*50} w={200} h={300} chart={i%2===0}/>)}<Person x={960} y={570} s={.55} pose="point" p={p} role="teacher"/></g>;
  case 3:return <g><R x={0} y={0} w={1920} h={1080} c="#243743"/><Paper x={710} y={170} w={500} h={650}/><R x={820} y={260} w={280} h={18} c={C.ink}/>{Array.from({length:10},(_,i)=><R key={i} x={820} y={320+i*40} w={240-(i%3)*30} h={6} c={C.steel}/>)}</g>;
  case 4:return <ServiceState p={p}/>;
  case 5:return <g><R x={0} y={0} w={1920} h={1080} c="#273944"/><R x={260} y={190} w={420} h={500} c="#829291"/><R x={750} y={190} w={420} h={500} c="#c1cbc8"/><R x={1240} y={190} w={420} h={500} c="#74848a"/><Ring x={960} y={500} p={p} r={320} c={C.gold}/></g>;
  case 6:return <g><R x={0} y={0} w={1920} h={1080} c="#101c25"/><circle cx={960} cy={540} r="115" fill={C.paper}/>{Array.from({length:12},(_,i)=>{const a=i/12*Math.PI*2,x=960+Math.cos(a)*540,y=540+Math.sin(a)*340;return <g key={i}><circle cx={x} cy={y} r="30" fill={i%2?C.teal:C.gold}/><L x={x} y={y} X={960} Y={540} c={C.steel} sw={4} p={q(p-i*.05)}/></g>})}</g>;
  default:throw new Error('mythless_state variant '+v);
 }
};

export const renderMythlessQuestion=(v:number,p:number)=>{
 switch(v){
  case 0:return <g><R x={0} y={0} w={1920} h={1080} c="#0f1b24"/><circle cx={960} cy={500} r="150" fill={C.paper}/><Ring x={960} y={500} p={p} r={300} c={C.red}/></g>;
  case 1:return <g><R x={0} y={0} w={960} h={1080} c="#5c6b72"/><R x={960} y={0} w={960} h={1080} c="#7e8b8b"/><Paper x={260} y={260} w={330} h={430} chart/><Paper x={1330} y={260} w={330} h={430} chart/><L x={960} y={80} X={960} Y={1000} c={C.paper} sw={12}/></g>;
  case 2:return <g><R x={0} y={0} w={1920} h={1080} c="#223540"/><Vehicle x={420} y={720} p={p} kind="bus"/><Vehicle x={1500} y={720} p={1-p} kind="bus"/><L x={960} y={180} X={960} Y={900} c={C.red} sw={14} p={p}/></g>;
  case 3:return <g><R x={0} y={0} w={1920} h={1080} c="#1a2a34"/><R x={200} y={260} w={400} h={420} c="#7d8987"/><R x={760} y={260} w={400} h={420} c="#8d7d6c"/><R x={1320} y={260} w={400} h={420} c="#71858c"/><L x={400} y={760} X={1520} Y={760} c={C.gold} sw={10} p={p}/></g>;
  case 4:return <g><R x={0} y={0} w={1920} h={1080} c="#14232d"/><circle cx={960} cy={540} r="120" fill={C.paper}/>{Array.from({length:8},(_,i)=>{const a=i/8*Math.PI*2,x=960+Math.cos(a)*500,y=540+Math.sin(a)*310;return <g key={i}><circle cx={x} cy={y} r="42" fill={i%2?C.gold:C.teal}/><L x={x} y={y} X={960} Y={540} c={C.steel} sw={5} p={q(p-i*.07)}/></g>})}</g>;
  case 5:return <g><R x={0} y={0} w={1920} h={1080} c="#1c2d38"/><Person x={460} y={500} s={.7} pose="stand" p={p}/><Person x={1460} y={500} s={.7} pose="stand" p={p}/><L x={600} y={500} X={1320} Y={500} c={C.paper} sw={8} p={p}/><Ring x={960} y={500} p={p} c={C.red}/></g>;
  case 6:return <g><R x={0} y={0} w={1920} h={1080} c="#514b44"/><Paper x={390} y={230} w={420} h={500}/><Paper x={1110} y={230} w={420} h={500}/><L x={810} y={480} X={1110} Y={480} c={C.gold} sw={12} p={p}/></g>;
  case 7:return <g><R x={0} y={0} w={1920} h={1080} c="#21333e"/>{Array.from({length:10},(_,i)=><Person key={i} x={190+i*165} y={520+(i%2)*30} s={.42} pose="stand" p={p} role={i%4===0?'child':'modern'}/>)}<Ring x={960} y={540} p={p} r={340} c={C.teal}/></g>;
  case 8:return <g><R x={0} y={0} w={1920} h={1080} c="#0d1720"/><circle cx={960} cy={540} r={lerp(80,200,p)} fill={C.paper}/><L x={960} y={540} X={600} Y={300} c={C.gold} sw={9} p={p}/><L x={960} y={540} X={1320} Y={300} c={C.teal} sw={9} p={p}/><Ring x={960} y={540} p={p} r={280} c={C.red}/></g>;
  default:throw new Error('mythless_question variant '+v);
 }
};

export const renderStadiumReturn=(v:number,p:number)=>{
 switch(v){
  case 0:return <Stadium p={1} night/>;
  case 1:return <g><Stadium p={1} night/><CrowdRow x={220} y={560} n={11} p={1-p}/><Person x={960} y={620} s={.48} pose="carry" p={p} role="worker"/></g>;
  case 2:return <g><R x={0} y={0} w={1920} h={1080} c="#0d1720"/><Stadium p={0} night/>{Array.from({length:8},(_,i)=><R key={i} x={180+i*210} y={120} w={22} h={330} c="#d0d8d8" o={1-q(p-i*.08)}/>)}</g>;
  case 3:return <g><R x={0} y={0} w={1920} h={1080} c="#1c2d37"/>{Array.from({length:8},(_,i)=><Person key={i} x={240+i*205} y={500+(i%2)*50} s={.45} pose="walk" p={p} role={i%5===0?'child':'modern'}/>)}<L x={960} y={150} X={960} Y={900} c={C.paper} sw={5} o={.25}/></g>;
  case 4:return <g><R x={0} y={0} w={640} h={1080} c="#546872"/><R x={640} y={0} w={640} h={1080} c="#7a8788"/><R x={1280} y={0} w={640} h={1080} c="#8b7b6d"/><Person x={320} y={500} s={.62} pose="write" p={p} role="clerk"/><Person x={960} y={500} s={.62} pose="point" p={p} role="teacher"/><Person x={1600} y={500} s={.62} pose="carry" p={p} role="worker"/></g>;
  case 5:return <g><R x={0} y={0} w={1920} h={1080} c="#152630"/><circle cx={960} cy={540} r="120" fill={C.paper}/>{Array.from({length:10},(_,i)=>{const a=i/10*Math.PI*2,x=960+Math.cos(a)*530,y=540+Math.sin(a)*330;return <g key={i}><circle cx={x} cy={y} r="34" fill={i%2?C.teal:C.gold}/><L x={x} y={y} X={960} Y={540} c={C.steel} sw={4} p={q(p-i*.05)}/></g>})}</g>;
  case 6:return <g><R x={0} y={0} w={1920} h={1080} c="#0e1821"/><Flag x={960} y={180} p={p} s={.76} c={C.red}/><Ring x={960} y={520} p={p} r={280} c={C.gold}/><CrowdRow x={300} y={650} n={9} p={p} stand/></g>;
  default:throw new Error('stadium_return variant '+v);
 }
};

export const renderFinalThesis=(v:number,p:number)=>{
 switch(v){
  case 0:return <g><R x={0} y={0} w={1920} h={1080} c="#5b5147"/><Paper x={350} y={240} w={360} h={450}/><Paper x={780} y={240} w={360} h={450}/><Paper x={1210} y={240} w={360} h={450}/><L x={530} y={760} X={1390} Y={760} c={C.gold} sw={10} p={p}/></g>;
  case 1:return <g><R x={0} y={0} w={1920} h={1080} c="#20313b"/><R x={250} y={210} w={420} h={500} c="#6f7e82"/><R x={750} y={210} w={420} h={500} c="#8a7867"/><R x={1250} y={210} w={420} h={500} c="#75888b"/><Ring x={960} y={500} p={p} r={320} c={C.red}/></g>;
  case 2:return <g><R x={0} y={0} w={1920} h={1080} c="#172731"/><circle cx={960} cy={540} r="120" fill={C.paper}/>{Array.from({length:8},(_,i)=>{const a=i/8*Math.PI*2,x=960+Math.cos(a)*500,y=540+Math.sin(a)*310;return <g key={i}><circle cx={x} cy={y} r="44" fill={i%2?C.gold:C.teal}/><L x={x} y={y} X={960} Y={540} c={C.steel} sw={5} p={q(p-i*.07)}/></g>})}</g>;
  case 3:return <g><R x={0} y={0} w={1920} h={1080} c="#111d26"/><Person x={460} y={500} s={.7} pose="stand" p={p}/><Person x={1460} y={500} s={.7} pose="stand" p={p}/><L x={600} y={500} X={1320} Y={500} c={C.gold} sw={11} p={p}/><Ring x={960} y={500} p={p} c={C.red}/></g>;
  case 4:return <VisualThesis p={p}/>;
  case 5:return <g><R x={0} y={0} w={1920} h={1080} c="#20333e"/><Paper x={400} y={250} w={350} h={430} chart/><Paper x={1170} y={250} w={350} h={430}/><L x={750} y={470} X={1170} Y={470} c={C.paper} sw={10} p={p}/><Ring x={960} y={470} p={p} c={C.teal}/></g>;
  case 6:return <g><R x={0} y={0} w={1920} h={1080} c="#12212b"/>{Array.from({length:18},(_,i)=><circle key={i} cx={160+(i%9)*200} cy={300+Math.floor(i/9)*420} r="34" fill={i%3===0?C.gold:i%3===1?C.teal:C.blue}/>)}<Ring x={960} y={510} p={p} r={370} c={C.red}/></g>;
  case 7:return <g><R x={0} y={0} w={1920} h={1080} c="#5a5148"/><Paper x={300} y={250} w={300} h={430}/><R x={810} y={250} w={300} h={430} c="#7f8f92"/><R x={1320} y={250} w={300} h={430} c="#8b7a68"/><L x={450} y={760} X={1470} Y={760} c={C.gold} sw={9} p={p}/></g>;
  case 8:return <g><R x={0} y={0} w={1920} h={1080} c="#11202a"/><circle cx={960} cy={540} r="110" fill={C.paper}/>{Array.from({length:12},(_,i)=>{const a=i/12*Math.PI*2,x=960+Math.cos(a)*560,y=540+Math.sin(a)*340;return <g key={i}><circle cx={x} cy={y} r="32" fill={i%2?C.teal:C.gold}/><L x={x} y={y} X={960} Y={540} c={C.steel} sw={4} p={q(p-i*.05)}/></g>})}</g>;
  case 9:return <g><R x={0} y={0} w={1920} h={1080} c="#162630"/><R x={250} y={210} w={1420} h={560} c="none" stroke={C.paper} strokeWidth="10"/><Flag x={520} y={260} p={p} s={.55} c={C.red}/><Paper x={810} y={280} w={300} h={360}/><Ring x={1390} y={480} p={p} c={C.gold}/></g>;
  case 10:return <g><R x={0} y={0} w={1920} h={1080} c="#0e1922"/><P d="M240 780 C520 620 710 650 960 470 C1190 300 1440 370 1680 200" c="none" stroke={C.teal} sw={16}/><circle cx={240} cy={780} r="60" fill={C.gold}/><circle cx={960} cy={470} r="60" fill={C.red}/><circle cx={1680} cy={200} r="60" fill={C.blue}/><Ring x={960} y={470} p={p} r={180} c={C.paper}/></g>;
  case 11:return <g><R x={0} y={0} w={1920} h={1080} c="#263a45"/>{Array.from({length:10},(_,i)=><Person key={i} x={190+i*165} y={520+(i%2)*35} s={.42} pose="stand" p={p} role={i%4===0?'child':'modern'}/>)}<L x={240} y={700} X={1680} Y={700} c={C.gold} sw={8} p={p}/></g>;
  case 12:return <g><R x={0} y={0} w={1920} h={1080} c="#1a2b35"/><Paper x={330} y={250} w={350} h={430}/><Paper x={785} y={250} w={350} h={430}/><Paper x={1240} y={250} w={350} h={430}/><Ring x={960} y={500} p={p} r={310} c={C.red}/></g>;
  case 13:return <g><R x={0} y={0} w={1920} h={1080} c="#13212b"/><circle cx={960} cy={540} r="110" fill={C.paper}/>{Array.from({length:14},(_,i)=>{const a=i/14*Math.PI*2,x=960+Math.cos(a)*560,y=540+Math.sin(a)*340;return <g key={i}><circle cx={x} cy={y} r="28" fill={i%3===0?C.gold:i%3===1?C.teal:C.red}/><L x={x} y={y} X={960} Y={540} c={C.steel} sw={4} p={q(p-i*.04)}/></g>})}</g>;
  case 14:return <g><R x={0} y={0} w={1920} h={1080} c="#0d1720"/><R x={380} y={200} w={1160} h={620} c="none" stroke={C.paper} strokeWidth="12"/><Person x={670} y={500} s={.7} pose="stand" p={p}/><Person x={1250} y={500} s={.7} pose="stand" p={p}/><L x={800} y={500} X={1120} Y={500} c={C.gold} sw={11} p={p}/></g>;
  case 15:return <VisualThesis p={p}/>;
  default:throw new Error('final_thesis variant '+v);
 }
};
