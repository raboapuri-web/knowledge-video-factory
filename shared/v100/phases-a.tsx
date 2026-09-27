import React from 'react';
import {C,R,L,P,Ring,Person,Vehicle,Paper,Coin,q,lerp} from './primitives';
import {Stadium,CrowdRow,Flag,Newspaper,PrintingPress,SteamTrain,LectureHall} from './myth-primitives';

export const renderStadiumOpening=(v:number,p:number)=>{
 switch(v){
  case 0:return <Stadium p={p}/>;
  case 1:return <g><Stadium p={1}/><CrowdRow x={230} y={555} n={10} p={p}/><Person x={150} y={500} s={.45} pose="carry" p={p} role="worker"/><Person x={1680} y={520} s={.38} pose="stand" p={p} role="child"/></g>;
  case 2:return <g><R x={0} y={0} w={1920} h={1080} c="#314754"/>{Array.from({length:18},(_,i)=><Person key={i} x={170+(i%9)*190} y={350+Math.floor(i/9)*310} s={.42} pose={i%3===0?'sit':'stand'} p={q(p-i*.025)} role={i%6===0?'child':'modern'}/>)}<L x={960} y={120} X={960} Y={950} c={C.paper} sw={5} o={.3}/></g>;
  case 3:return <g><Stadium p={1}/><CrowdRow x={240} y={560} n={11} p={p} stand/><Ring x={960} y={420} p={p} c={C.gold}/></g>;
  case 4:return <g><R x={0} y={0} w={1920} h={1080} c="#243744"/><CrowdRow x={190} y={520} n={12} p={1} stand/>{Array.from({length:6},(_,i)=><g key={i} transform={'translate('+(260+i*270)+' 260)'}><g transform={'translate(0 '+lerp(0,90,q(p-i*.08))+')'}><R x={-55} y={-70} w={110} h={55} rx={8} c={C.paper}/></g></g>)}</g>;
  case 5:return <g><Stadium p={1}/><Flag x={960} y={120} p={p} s={.8} c={C.red}/><CrowdRow x={230} y={555} n={11} p={1} stand/>{Array.from({length:8},(_,i)=><Ring key={i} x={350+i*170} y={560+(i%2)*30} p={q(p-i*.05)} r={90} c={C.gold}/>)}</g>;
  case 6:return <g><R x={0} y={0} w={1920} h={1080} c="#0f1b25"/><g transform={'translate('+lerp(0,-350,p)+' '+lerp(0,-190,p)+') scale('+lerp(1,1.55,p)+')'}><Stadium p={1}/></g><Ring x={960} y={540} p={p} r={410} c={C.teal}/></g>;
  case 7:return <g><R x={0} y={0} w={1920} h={1080} c="#162630"/><Flag x={500} y={250} p={p} s={1.05} c={C.red}/><g transform="translate(930 280)"><circle cx={0} cy={0} r="110" fill={C.gold}/>{Array.from({length:5},(_,i)=><path key={i} d={'M0 0 L'+(180*Math.cos(i*1.256))+' '+(180*Math.sin(i*1.256))} stroke={C.paper} strokeWidth="11" opacity={q(p-i*.12)}/>)}</g><CrowdRow x={320} y={650} n={9} p={p} stand/></g>;
  default:throw new Error('stadium_opening variant '+v);
 }
};

export const renderRationalState=(v:number,p:number)=>{
 switch(v){
  case 0:return <g><R x={0} y={0} w={1920} h={1080} c="#20323d"/>{Array.from({length:5},(_,i)=><R key={i} x={180+i*310} y={180+(i%2)*80} w={250} h={560-(i%2)*90} c={i%2?'#6f8186':'#7d8f92'}/>)}<Person x={300} y={520} s={.55} pose="walk" p={p}/><Vehicle x={1180} y={760} p={p} kind="bus"/></g>;
  case 1:return <g><R x={0} y={0} w={1920} h={1080} c="#172732"/><R x={270} y={180} w={1380} h={620} rx={32} c="#263b47"/>{Array.from({length:6},(_,i)=><g key={i}><circle cx={450+(i%3)*510} cy={340+Math.floor(i/3)*260} r="72" fill={i%2?C.teal:C.gold}/><L x={450+(i%3)*510} y={415+Math.floor(i/3)*260} X={450+(i%3)*510} Y={495+Math.floor(i/3)*260} c={C.paper} sw={8} p={q(p-i*.08)}/></g>)}</g>;
  case 2:return <g><R x={0} y={0} w={1920} h={1080} c="#5d6668"/><R x={180} y={150} w={1560} h={560} c="#c8c6bb"/>{Array.from({length:4},(_,i)=><Paper key={i} x={260+i*350} y={230} w={260} h={360} chart={i%2===1}/>)}<Person x={480} y={500} s={.55} pose="write" p={p} role="clerk"/><Person x={1430} y={500} s={.55} pose="read" p={p} role="clerk"/></g>;
  case 3:return <g><R x={0} y={0} w={1920} h={1080} c="#1a2b36"/><circle cx={960} cy={500} r="230" fill={C.paper}/><L x={960} y={500} X={960} Y={330} c={C.red} sw={14} p={p}/><L x={960} y={500} X={lerp(960,1110,p)} Y={500} c={C.blue} sw={14}/><Ring x={960} y={500} p={p} r={320} c={C.gold}/></g>;
  case 4:return <g><R x={0} y={0} w={1920} h={1080} c="#4b5559"/><R x={220} y={160} w={1480} h={560} c="#d1cec1"/><Paper x={350} y={230} w={330} h={390} chart/><Paper x={800} y={230} w={330} h={390}/><Paper x={1250} y={230} w={330} h={390} chart/><Vehicle x={630} y={770} p={p} kind="truck"/><Person x={1390} y={520} s={.5} pose="point" p={p} role="clerk"/></g>;
  case 5:return <g><R x={0} y={0} w={1920} h={1080} c="#0d1720"/><P d="M220 780 C540 380 760 410 960 560 C1180 730 1400 610 1710 300" c="none" stroke={C.teal} sw={16}/><circle cx={220} cy={780} r={70} fill={C.gold}/><circle cx={960} cy={560} r={70} fill={C.red}/><circle cx={1710} cy={300} r={70} fill={C.blue}/><Ring x={960} y={560} p={p} r={200} c={C.paper}/></g>;
  default:throw new Error('rational_state variant '+v);
 }
};

export const renderMythReplacement=(v:number,p:number)=>{
 switch(v){
  case 0:return <g><R x={0} y={0} w={1920} h={1080} c="#2f3d47"/><R x={160} y={210} w={430} h={520} c="#6c5a50"/><P d="M190 210 L375 90 L560 210Z" c="#4a403a"/><R x={1330} y={210} w={430} h={520} c="#73858c"/><Flag x={1470} y={180} p={p} s={.72} c={C.red}/><L x={720} y={540} X={1190} Y={540} c={C.gold} sw={14} p={p}/></g>;
  case 1:return <g><R x={0} y={0} w={1920} h={1080} c="#1b2b36"/><circle cx={520} cy={540} r={180} fill="#6c5b52"/><circle cx={1400} cy={540} r={180} fill={C.blue}/><L x={700} y={540} X={1220} Y={540} c={C.gold} sw={16} p={p}/><Ring x={1400} y={540} p={p} c={C.red}/></g>;
  case 2:return <g><R x={0} y={0} w={1920} h={1080} c="#5b6363"/>{Array.from({length:5},(_,i)=><g key={i}><R x={220+i*300} y={250+(i%2)*80} w={230} h={330} c={i%2?C.paper:C.gold}/><circle cx={335+i*300} cy={210+(i%2)*80} r="55" fill={i%2?C.teal:C.red}/></g>)}<L x={290} y={700} X={1610} Y={700} c={C.paper} sw={8} p={p}/></g>;
  case 3:return <g><R x={0} y={0} w={1920} h={1080} c="#111d27"/><Paper x={350} y={250} w={400} h={480}/><R x={1180} y={250} w={380} h={480} c="#202f39" stroke={C.gold}/><Ring x={540} y={490} p={p} c={C.red}/><Ring x={1370} y={490} p={1-p} c={C.teal}/></g>;
  case 4:return <g><R x={0} y={0} w={1920} h={1080} c="#283b48"/><Person x={420} y={500} s={.72} pose="stand" p={p}/><Person x={1500} y={500} s={.72} pose="stand" p={p} role="modern"/>{Array.from({length:4},(_,i)=><circle key={i} cx={760+i*140} cy={520+(i%2)*90} r="62" fill={i%2?C.gold:C.teal}/>) }<L x={560} y={520} X={1360} Y={520} c={C.paper} sw={7} p={p}/></g>;
  case 5:return <g><R x={0} y={0} w={1920} h={1080} c="#17252f"/><R x={180} y={180} w={480} h={600} c="#65737a"/><R x={720} y={180} w={480} h={600} c="#7b8078"/><R x={1260} y={180} w={480} h={600} c="#8d7863"/><Ring x={960} y={480} p={p} r={340} c={C.gold}/></g>;
  case 6:return <g><R x={0} y={0} w={1920} h={1080} c="#0e1821"/><circle cx={960} cy={540} r="95" fill={C.paper}/>{Array.from({length:10},(_,i)=>{const a=i/10*Math.PI*2,x=960+Math.cos(a)*460,y=540+Math.sin(a)*300;return <g key={i}><L x={960} y={540} X={x} Y={y} c={i%2?C.gold:C.teal} sw={7} p={q(p-i*.05)}/><circle cx={x} cy={y} r="32" fill={i%2?C.gold:C.teal}/></g>})}<Ring x={960} y={540} p={p} r={220} c={C.red}/></g>;
  default:throw new Error('myth_replacement variant '+v);
 }
};

export const renderPrintStation=(v:number,p:number)=>{
 switch(v){
  case 0:return <g><R x={0} y={0} w={1920} h={1080} c="#697b83"/><R x={0} y={740} w={1920} h={340} c="#6e665c"/><L x={0} y={690} X={1920} Y={690} c={C.steel} sw={20}/><SteamTrain x={980} y={650} p={p} s={1.05}/></g>;
  case 1:return <g><R x={0} y={0} w={1920} h={1080} c="#6a7476"/><Person x={420} y={480} s={.68} pose="carry" p={p} role="worker"/>{Array.from({length:4},(_,i)=><Newspaper key={i} x={760+i*170} y={430+(i%2)*40} p={q(p-i*.1)} s={.52} open={false}/>)}<Person x={1560} y={490} s={.58} pose="walk" p={p} role="traveler"/></g>;
  case 2:return <g><R x={0} y={0} w={1920} h={1080} c="#243540"/><Person x={520} y={490} s={.66} pose="sit" p={p} role="traveler"/><Newspaper x={930} y={430} p={p} s={1.05}/><SteamTrain x={1500} y={740} p={1-p} s={.72}/></g>;
  case 3:return <g><R x={0} y={0} w={960} h={1080} c="#40535e"/><R x={960} y={0} w={960} h={1080} c="#786d61"/><Person x={430} y={500} s={.72} pose="sit" p={p}/><Newspaper x={430} y={390} p={p} s={.68}/><Person x={1490} y={500} s={.72} pose="sit" p={p}/><Newspaper x={1490} y={390} p={1-p} s={.68}/><L x={960} y={0} X={960} Y={1080} c={C.paper} sw={12}/></g>;
  case 4:return <g><R x={0} y={0} w={1920} h={1080} c="#101b23"/><circle cx={600} cy={540} r="150" fill={C.blue}/><circle cx={1320} cy={540} r="150" fill={C.gold}/><L x={750} y={540} X={1170} Y={540} c={C.teal} sw={12} p={p}/><Ring x={960} y={540} p={p} r={130} c={C.red}/></g>;
  case 5:return <g><R x={0} y={0} w={1920} h={1080} c="#4a433b"/><Newspaper x={960} y={500} p={p} s={2}/>{Array.from({length:3},(_,i)=><Ring key={i} x={700+i*260} y={470+(i%2)*110} p={q(p-i*.1)} r={105} c={i===0?C.red:i===1?C.teal:C.gold}/>)}</g>;
  default:throw new Error('print_station variant '+v);
 }
};

export const renderImaginedCommunity=(v:number,p:number)=>{
 switch(v){
  case 0:return <g><R x={0} y={0} w={1920} h={1080} c="#172530"/><circle cx={960} cy={540} r="150" fill={C.paper}/>{Array.from({length:14},(_,i)=>{const a=i/14*Math.PI*2,x=960+Math.cos(a)*560,y=540+Math.sin(a)*340;return <g key={i}><circle cx={x} cy={y} r="36" fill={i%2?C.teal:C.gold}/><L x={x} y={y} X={960} Y={540} c={C.steel} sw={4} p={q(p-i*.04)}/></g>})}</g>;
  case 1:return <g><R x={0} y={0} w={1920} h={1080} c="#263a46"/>{Array.from({length:12},(_,i)=><Person key={i} x={170+(i%6)*300} y={310+Math.floor(i/6)*420} s={.48} pose="stand" p={p} role={i%4===0?'child':'modern'}/>)}<R x={830} y={160} w={260} h={760} c="none" stroke={C.red} sw={18} o={q(p)}/></g>;
  case 2:return <g><R x={0} y={0} w={1920} h={1080} c="#5d5348"/><PrintingPress x={520} y={540} p={p} s={1.05}/><Newspaper x={1350} y={480} p={p} s={1.1}/><L x={760} y={540} X={1200} Y={500} c={C.gold} sw={12} p={p}/></g>;
  case 3:return <g><R x={0} y={0} w={1920} h={1080} c="#718177"/><R x={0} y={700} w={1920} h={380} c="#7f715f"/>{Array.from({length:5},(_,i)=><R key={i} x={90+i*370} y={370+(i%2)*60} w={280} h={280} c={i%2?'#8a735d':'#987f66'}/>)}<Person x={350} y={500} s={.62} pose="walk" p={p}/><Person x={1450} y={500} s={.62} pose="walk" p={1-p}/></g>;
  default:throw new Error('imagined_community variant '+v);
 }
};

export const renderVillageScale=(v:number,p:number)=>{
 switch(v){
  case 0:return <g><R x={0} y={0} w={1920} h={1080} c="#9bab94"/><R x={0} y={700} w={1920} h={380} c="#7c8a68"/>{Array.from({length:6},(_,i)=><g key={i}><R x={80+i*300} y={430+(i%2)*50} w={230} h={220} c="#8b735c"/><P d={'M60 '+(430+(i%2)*50)+' L195 '+(330+(i%2)*50)+' L330 '+(430+(i%2)*50)+'Z'} c="#5e4d40"/></g>)}</g>;
  case 1:return <g><R x={0} y={0} w={1920} h={1080} c="#8da08d"/><Person x={300} y={490} s={.62} pose="carry" p={p} role="worker"/><Person x={700} y={490} s={.62} pose="push" p={p} role="farmer"/><Person x={1100} y={500} s={.56} pose="sit" p={p} role="modern"/><Person x={1500} y={500} s={.56} pose="carry" p={p} role="modern"/></g>;
  case 2:return <g><R x={0} y={0} w={1920} h={1080} c="#1a2933"/>{Array.from({length:30},(_,i)=><circle key={i} cx={120+(i%10)*180} cy={220+Math.floor(i/10)*280} r="28" fill={i%3===0?C.gold:i%3===1?C.teal:C.blue}/>) }<Ring x={960} y={540} p={p} r={430} c={C.red}/></g>;
  case 3:return <g><R x={0} y={0} w={640} h={1080} c="#5c6d75"/><R x={640} y={0} w={640} h={1080} c="#7c8d94"/><R x={1280} y={0} w={640} h={1080} c="#8d7d70"/><Person x={320} y={500} s={.62} pose="walk" p={p}/><Person x={960} y={500} s={.62} pose="carry" p={p} role="worker"/><Person x={1600} y={500} s={.62} pose="point" p={p} role="teacher"/></g>;
  case 4:return <g><R x={0} y={0} w={1920} h={1080} c="#182632"/><circle cx={960} cy={540} r="115" fill={C.paper}/>{Array.from({length:24},(_,i)=>{const a=i/24*Math.PI*2,x=960+Math.cos(a)*620,y=540+Math.sin(a)*370;return <g key={i}><circle cx={x} cy={y} r="22" fill={i%2?C.gold:C.teal}/><L x={x} y={y} X={960} Y={540} c={C.steel} sw={3} p={q(p-i*.02)}/></g>})}</g>;
  case 5:return <g><R x={0} y={0} w={1920} h={1080} c="#40515b"/><R x={220} y={180} w={1480} h={600} c="#7d8580"/><Person x={460} y={500} s={.62} pose="write" p={p} role="clerk"/><Paper x={760} y={250} w={300} h={380} chart/><Paper x={1160} y={250} w={300} h={380}/></g>;
  case 6:return <g><R x={0} y={0} w={1920} h={1080} c="#11202a"/><Person x={430} y={500} s={.75} pose="stand" p={p}/><circle cx={1400} cy={500} r="140" fill={C.gold}/><L x={610} y={500} X={1260} Y={500} c={C.paper} sw={10} p={p}/><Ring x={930} y={500} p={p} r={210} c={C.red}/></g>;
  case 7:return <g><R x={0} y={0} w={1920} h={1080} c="#0d1720"/><circle cx={960} cy={540} r={lerp(80,200,p)} fill={C.paper}/>{Array.from({length:10},(_,i)=><Ring key={i} x={350+i*135} y={530+(i%2)*70} p={q(p-i*.06)} r={70} c={i%2?C.teal:C.gold}/>)}</g>;
  default:throw new Error('village_scale variant '+v);
 }
};

export const renderFrenchRevolution=(v:number,p:number)=>{
 switch(v){
  case 0:return <g><R x={0} y={0} w={1920} h={1080} c="#958b7d"/><R x={0} y={750} w={1920} h={330} c="#75655a"/>{Array.from({length:10},(_,i)=><Person key={i} x={160+i*170+lerp(-90,90,p)} y={490+(i%2)*25} s={.5} pose="walk" p={p} role="modern"/>)}<Flag x={500} y={250} p={p} s={.58} c={C.red}/></g>;
  case 1:return <g><R x={0} y={0} w={1920} h={1080} c="#74685e"/><R x={250} y={200} w={450} h={520} c="#69584c"/><R x={1220} y={200} w={450} h={520} c="#82705c"/>{Array.from({length:8},(_,i)=><Person key={i} x={400+i*150} y={500+(i%2)*20} s={.45} pose="push" p={p} role="modern"/>)}<L x={960} y={160} X={960} Y={860} c={C.red} sw={12} p={p}/></g>;
  case 2:return <g><R x={0} y={0} w={1920} h={1080} c="#16242e"/><circle cx={560} cy={540} r="170" fill="#6b584e"/><circle cx={1360} cy={540} r="170" fill={C.blue}/><L x={730} y={540} X={1190} Y={540} c={C.gold} sw={14} p={p}/></g>;
  case 3:return <g><R x={0} y={0} w={1920} h={1080} c="#5f554c"/><R x={240} y={160} w={1440} h={620} c="#887868"/>{Array.from({length:8},(_,i)=><R key={i} x={320+(i%4)*340} y={230+Math.floor(i/4)*280} w={250} h={180} c={i%2?C.paper:C.gold}/>) }<Ring x={960} y={540} p={p} r={360} c={C.red}/></g>;
  case 4:return <g><R x={0} y={0} w={1920} h={1080} c="#968a75"/><R x={0} y={760} w={1920} h={320} c="#756354"/>{Array.from({length:14},(_,i)=><Person key={i} x={120+i*125} y={510+(i%2)*20} s={.4} pose="walk" p={p} role={i%4===0?'soldier':'modern'}/>)}<Flag x={920} y={210} p={p} s={.65} c={C.red}/></g>;
  default:throw new Error('french_revolution variant '+v);
 }
};
