import React from 'react';
import {C,q,lerp,R,L,P,Ring,Person,Vehicle,Gate,Paper,Coin,Hospital,School,FireStation,Factory,MapBlob} from './primitives';

const Dispatch=()=> <><R x={0} y={0} w={1920} h={1080} c="#1b2e38"/><R x={160} y={120} w={1600} h={520} rx={26} c="#2b424e"/><R x={260} y={690} w={1400} h={100} rx={20} c={C.wood}/></>;
const Coins=({p,count=5,x=760,y=580}:{p:number;count?:number;x?:number;y?:number})=><>{Array.from({length:count},(_,i)=><Coin key={i} x={x+i*58} y={y+(i%2)*24} p={q(p-i*.08)} r={23}/>)}</>;

export const renderAdminResponsibility=(v:number,p:number)=>{
 switch(v){
  case 0:return <g><Dispatch/><MapBlob seed={301} p={.2}/><Person x={470} y={500} s={.62} pose="point" p={p} role="clerk"/><Person x={1450} y={500} s={.62} pose="read" p={p} role="clerk"/></g>;
  case 1:return <g><R x={0} y={0} w={1920} h={1080} c="#172630"/><g transform="translate(130 70) scale(.86)"><MapBlob seed={303} p={.15}/></g>{[{x:450,y:350,c:C.red},{x:850,y:650,c:C.gold},{x:1320,y:350,c:C.teal},{x:1500,y:690,c:C.blue}].map((n,i)=><circle key={i} cx={n.x} cy={n.y} r={lerp(22,85,q(p-i*.1))} fill={n.c} opacity={.85}/>)}<Ring x={960} y={540} p={p} c={C.gold}/></g>;
  case 2:return <g><R x={0} y={0} w={1920} h={1080} c="#879591"/><FireStation x={250} y={320} s={.95}/><FireStation x={1340} y={320} s={.95}/><Vehicle x={400} y={760} p={p} kind="fire"/><Vehicle x={1510} y={760} p={1-p} kind="fire"/><Ring x={920} y={620} p={p} c={C.red}/></g>;
  case 3:return <g><R x={0} y={0} w={1920} h={1080} c="#1b2b35"/><Gate x={960} y={660} p={p}/><FireStation x={250} y={310} s={.9}/><Hospital x={1370} y={330} s={.9}/><L x={960} y={170} X={960} Y={930} c={C.red} sw={13} p={1-p}/><Ring x={960} y={540} p={p} c={C.gold}/></g>;
  case 4:return <g><R x={0} y={0} w={1920} h={1080} c="#20343f"/><Paper x={330} y={200} w={420} h={520} chart/><Paper x={1170} y={200} w={420} h={520}/><Person x={960} y={500} s={.6} pose="point" p={p} role="clerk"/><L x={750} y={600} X={1170} Y={600} c={C.red} sw={12} p={p}/></g>;
  case 5:return <g><MapBlob seed={307} p={.2}/><School x={300} y={260} s={.5}/><Hospital x={1260} y={260} s={.5}/><FireStation x={780} y={650} s={.48}/><Person x={960} y={500} s={.55} pose="point" p={p} role="clerk"/><Ring x={960} y={540} p={p} c={C.teal}/></g>;
  case 6:return <g><R x={0} y={0} w={1920} h={1080} c="#12222b"/><R x={610} y={220} w={700} h={520} rx={40} c="#2c424d"/><circle cx={960} cy={480} r="120" fill={C.paper}/>{Array.from({length:6},(_,i)=>{const a=i*Math.PI/3,x=960+Math.cos(a)*360,y=480+Math.sin(a)*230;return <g key={i}><circle cx={x} cy={y} r="65" fill={i%2?C.teal:C.gold}/><L x={960} y={480} X={x} Y={y} c={i%2?C.teal:C.gold} sw={8} p={q(p-i*.08)}/></g>})}<Ring x={960} y={480} p={p} c={C.red}/></g>;
  default:throw new Error('admin_responsibility variant '+v);
 }
};

export const renderColonialMap=(v:number,p:number)=>{
 switch(v){
  case 0:return <g><R x={0} y={0} w={1920} h={1080} c="#62564b"/><R x={210} y={620} w={1500} h={110} rx={24} c={C.wood}/>{Array.from({length:7},(_,i)=><Person key={i} x={330+i*215} y={485+(i%2)*28} s={.46} pose={i===2?'point':'sit'} p={q(p-i*.05)} role="diplomat"/>)}<Paper x={820} y={190} w={300} h={330}/></g>;
  case 1:return <g><R x={0} y={0} w={1920} h={1080} c="#6b5949"/><R x={250} y={120} w={1420} h={820} c="#7c654f"/><R x={340} y={180} w={1240} h={700} c={C.paper}/><R x={540} y={480} w={820} h={34} c={C.wood}/><L x={560} y={465} X={1360} Y={650} c={C.red} sw={12} p={p}/><Person x={1510} y={500} s={.55} pose="point" p={p} role="diplomat"/></g>;
  case 2:return <g><R x={0} y={0} w={1920} h={1080} c="#af9a75"/><P d="M0 720 L420 500 L820 690 L1200 490 L1920 710 L1920 1080 L0 1080Z" c="#8e7956"/><House x={260} y={520} s={.7}/><House x={1200} y={500} s={.72}/><P d="M430 870 C700 720 980 760 1300 700 C1510 660 1700 680 1920 640" c="none" stroke="#695541" sw={22}/><Ring x={960} y={700} p={p} c={C.gold}/></g>;
  case 3:return <g><R x={0} y={0} w={1920} h={1080} c="#a58f70"/><P d="M0 700 L430 480 L860 690 L1250 500 L1920 700 L1920 1080 L0 1080Z" c="#8b7857"/><R x={940} y={250} w={35} h={520} c={C.steel}/><P d="M900 250 L1030 250 L965 170Z" c={C.red}/><Person x={620} y={500} s={.67} pose="walk" p={p} role="farmer"/><Person x={1320} y={500} s={.67} pose="walk" p={1-p} role="farmer"/></g>;
  case 4:return <g><R x={0} y={0} w={960} h={1080} c="#384b55"/><R x={960} y={0} w={960} h={1080} c="#aa9575"/><Paper x={250} y={220} w={450} h={550}/><Person x={490} y={510} s={.58} pose="write" p={p} role="clerk"/><House x={1130} y={520} s={.75}/><Person x={1500} y={520} s={.6} pose="carry" p={p} role="farmer"/><L x={960} y={100} X={960} Y={980} c={C.paper} sw={14}/></g>;
  case 5:return <g><R x={0} y={0} w={1920} h={1080} c="#172630"/><g transform="translate(140 70) scale(.86)"><MapBlob seed={327} p={p}/></g><Person x={520} y={520} s={.6} pose="point" p={p} role="diplomat"/><Person x={1420} y={520} s={.6} pose="point" p={1-p} role="farmer"/><Ring x={960} y={540} p={p} c={C.red}/></g>;
  default:throw new Error('colonial_map variant '+v);
 }
};

export const renderDividedCommunity=(v:number,p:number)=>{
 switch(v){
  case 0:return <g><R x={0} y={0} w={1920} h={1080} c="#b09a74"/><P d="M0 720 L420 490 L820 680 L1200 480 L1920 700 L1920 1080 L0 1080Z" c="#8e7957"/><L x={960} y={130} X={960} Y={950} c={C.red} sw={15} p={1}/><House x={280} y={520} s={.75}/><House x={1250} y={520} s={.75}/></g>;
  case 1:return <g><R x={0} y={0} w={960} h={1080} c="#a89372"/><R x={960} y={0} w={960} h={1080} c="#9e8968"/><Person x={620} y={520} s={.7} pose="point" p={p} role="farmer"/><Person x={1300} y={520} s={.7} pose="point" p={1-p} role="farmer"/><L x={960} y={120} X={960} Y={960} c={C.red} sw={15}/><Ring x={960} y={540} p={p}/></g>;
  case 2:return <g><R x={0} y={0} w={1920} h={1080} c="#a59778"/><P d="M0 920 C500 690 780 760 1050 700 C1360 640 1580 710 1920 650 L1920 1080 L0 1080Z" c="#6d5945"/><R x={940} y={200} w={35} h={600} c={C.steel}/><Vehicle x={420} y={760} p={p} kind="wagon"/><Vehicle x={1500} y={760} p={1-p} kind="wagon" dir={-1}/><Ring x={960} y={700} p={p} c={C.red}/></g>;
  case 3:return <g><R x={0} y={0} w={1920} h={1080} c="#a69372"/><P d="M0 740 L420 500 L820 700 L1230 490 L1920 720 L1920 1080 L0 1080Z" c="#8e7956"/>{Array.from({length:8},(_,i)=><circle key={i} cx={300+(i%4)*430} cy={760+Math.floor(i/4)*120} r="32" fill="#5d5144"/>)}<L x={960} y={130} X={960} Y={960} c={C.red} sw={14}/><Person x={620} y={520} s={.65} pose="walk" p={p} role="farmer"/></g>;
  case 4:return <g><R x={0} y={0} w={1920} h={1080} c="#13232c"/><g transform="translate(120 50) scale(.88)"><MapBlob seed={345} p={.2}/></g>{Array.from({length:7},(_,i)=><circle key={i} cx={370+(i%4)*380} cy={340+Math.floor(i/4)*330} r={lerp(18,58,q(p-i*.08))} fill={i%2?C.red:C.gold}/>)}</g>;
  case 5:return <g><R x={0} y={0} w={960} h={1080} c="#182a34"/><R x={960} y={0} w={960} h={1080} c="#81715e"/><MapBlob seed={349} p={.2}/><L x={960} y={100} X={960} Y={980} c={C.paper} sw={14}/><Person x={1450} y={520} s={.65} pose="point" p={p} role="farmer"/><Ring x={960} y={540} p={p} c={C.gold}/></g>;
  default:throw new Error('divided_community variant '+v);
 }
};

export const renderBorderlessNight=(v:number,p:number)=>{
 switch(v){
  case 0:return <g><R x={0} y={0} w={1920} h={1080} c="#283b48"/><R x={0} y={760} w={1920} h={320} c="#59635f"/><Gate x={650} y={660} p={p}/><Gate x={1270} y={660} p={p}/><R x={945} y={130} w={30} h={700} c={C.red} o={1-p}/><Ring x={960} y={540} p={p} c={C.gold}/></g>;
  case 1:return <g><R x={0} y={0} w={1920} h={1080} c={C.sky}/><P d="M0 950 L1920 710 L1920 1080 L0 1080Z" c="#4d5656"/><Vehicle x={420} y={760} p={p} kind="car"/><Vehicle x={1480} y={760} p={p} kind="truck"/><Person x={960} y={510} s={.68} pose="walk" p={p} role="traveler"/></g>;
  case 2:return <g><R x={0} y={0} w={1920} h={1080} c="#819295"/>{[{x:250,y:190,c:'#7a8e91'},{x:980,y:190,c:'#8c7f70'},{x:250,y:590,c:'#6f7f88'},{x:980,y:590,c:'#8d9078'}].map((n,i)=><R key={i} x={n.x} y={n.y} w={690} h={300} rx={28} c={n.c}/>)}<Person x={560} y={460} s={.52} pose="walk" p={p} role="traveler"/><Person x={1310} y={460} s={.52} pose="point" p={p} role="worker"/><Vehicle x={580} y={810} p={p} kind="truck"/><Person x={1330} y={830} s={.5} pose="carry" p={p} role="traveler"/></g>;
  case 3:return <g><R x={0} y={0} w={1920} h={1080} c="#14242e"/>{Array.from({length:6},(_,i)=><g key={i}><circle cx={280+(i%3)*680} cy={320+Math.floor(i/3)*380} r="88" fill={i%2?C.teal:C.gold}/><Paper x={220+(i%3)*680} y={430+Math.floor(i/3)*380} w={120} h={130}/></g>)}<L x={240} y={850} X={1680} Y={850} c={C.red} sw={9} p={p}/></g>;
  case 4:return <g><R x={0} y={0} w={1920} h={1080} c="#7d9199"/><P d="M0 950 L1920 700 L1920 1080 L0 1080Z" c="#4c5555"/>{Array.from({length:8},(_,i)=><Person key={i} x={250+i*210} y={520+(i%2)*40} s={.45} pose="walk" p={q(p-i*.04)} role="traveler"/>)}<Ring x={960} y={650} p={p} c={C.gold}/></g>;
  case 5:return <g><R x={0} y={0} w={1920} h={1080} c="#182832"/><circle cx={960} cy={540} r={lerp(100,340,p)} fill={C.red} opacity={.18}/>{[{x:350,y:300},{x:620,y:760},{x:1280,y:760},{x:1570,y:300}].map((n,i)=><g key={i}><circle cx={n.x} cy={n.y} r="75" fill={i%2?C.teal:C.gold}/><L x={n.x} y={n.y} X={960} Y={540} c={i%2?C.teal:C.gold} sw={9} p={p}/></g>)}</g>;
  default:throw new Error('borderless_night variant '+v);
 }
};

export const renderBorderlessNoon=(v:number,p:number)=>{
 switch(v){
  case 0:return <g><R x={0} y={0} w={960} h={1080} c="#5b6e78"/><R x={960} y={0} w={960} h={1080} c="#7e7468"/><Factory x={220} y={320} s={1.1}/><Factory x={1240} y={320} s={1.1}/><L x={960} y={110} X={960} Y={970} c={C.red} sw={14}/><Vehicle x={960} y={780} p={p} kind="truck"/></g>;
  case 1:return <g><R x={0} y={0} w={1920} h={1080} c="#172630"/><Paper x={300} y={200} w={450} h={560} chart/><Paper x={1170} y={200} w={450} h={560} chart/><Coins p={p} count={7} x={760} y={780}/><L x={750} y={600} X={1170} Y={600} c={C.red} sw={11} p={p}/></g>;
  case 2:return <g><R x={0} y={0} w={1920} h={1080} c="#20323d"/><Vehicle x={580} y={730} p={p} kind="police"/><Vehicle x={1340} y={730} p={1-p} kind="police" dir={-1}/><circle cx={960} cy={520} r={lerp(80,240,p)} fill={C.red} opacity={.2}/><Ring x={960} y={520} p={p} c={C.red}/></g>;
  case 3:return <g><R x={0} y={0} w={1920} h={1080} c="#192a34"/>{Array.from({length:6},(_,i)=><g key={i}><circle cx={310+i*260} cy={420+(i%2)*180} r="72" fill={i%2?C.teal:C.gold}/><Paper x={255+i*260} y={530+(i%2)*70} w={110} h={140}/></g>)}<L x={200} y={820} X={1720} Y={820} c={C.red} sw={9} p={p}/></g>;
  case 4:return <g><R x={0} y={0} w={1920} h={1080} c="#84a0a6"/><P d="M0 540 C420 420 710 500 960 430 C1230 360 1500 450 1920 340 L1920 1080 L0 1080Z" c="#668e99"/><P d="M0 820 C520 690 850 730 1120 670 C1450 600 1660 650 1920 590 L1920 1080 L0 1080Z" c="#719060"/><R x={360} y={260} w={500} h={120} c="#7f776d"/><L x={610} y={380} X={610} Y={700} c={C.steel} sw={16}/><Ring x={610} y={530} p={p} c={C.red}/></g>;
  case 5:return <g><R x={0} y={0} w={1920} h={1080} c="#89a1a6"/><P d="M0 610 C450 500 750 570 1020 500 C1310 430 1570 500 1920 430 L1920 1080 L0 1080Z" c="#678f99"/><Person x={520} y={510} s={.68} pose="point" p={p} role="farmer"/><Person x={1380} y={510} s={.68} pose="point" p={1-p} role="farmer"/><L x={960} y={160} X={960} Y={920} c={C.red} sw={14} p={p}/></g>;
  case 6:return <g><R x={0} y={0} w={1920} h={1080} c="#c0cfca"/><Hospital x={560} y={260} s={1.5}/>{Array.from({length:8},(_,i)=><Person key={i} x={260+i*190} y={570+(i%2)*35} s={.42} pose="walk" p={q(p-i*.04)} role={i%3===0?'nurse':'modern'}/>)}<Ring x={960} y={500} p={p} c={C.red}/></g>;
  case 7:return <g><R x={0} y={0} w={1920} h={1080} c="#172630"/><L x={960} y={120} X={960} Y={950} c={C.red} sw={12} o={1-p}/>{Array.from({length:7},(_,i)=><g key={i}><circle cx={250+i*235} cy={420+(i%2)*190} r="65" fill={i%2?C.teal:C.gold}/><L x={250+i*235} y={420+(i%2)*190} X={960} Y={760} c={i%2?C.teal:C.gold} sw={6} p={q(p-i*.06)}/></g>)}</g>;
  case 8:return <g><R x={0} y={0} w={1920} h={1080} c="#13232d"/><circle cx={960} cy={540} r="120" fill={C.paper}/>{Array.from({length:10},(_,i)=>{const a=i*Math.PI*2/10,x=960+Math.cos(a)*470,y=540+Math.sin(a)*340;return <g key={i}><circle cx={x} cy={y} r="55" fill={i%2?C.teal:C.gold}/><L x={960} y={540} X={x} Y={y} c={i%2?C.teal:C.gold} sw={7} p={q(p-i*.05)}/></g>})}<Ring x={960} y={540} p={p} c={C.red}/></g>;
  default:throw new Error('borderless_noon variant '+v);
 }
};

export const renderGovernanceReplace=(v:number,p:number)=>{
 switch(v){
  case 0:return <g><R x={0} y={0} w={1920} h={1080} c="#62564b"/><R x={220} y={620} w={1480} h={110} rx={24} c={C.wood}/>{Array.from({length:8},(_,i)=><Person key={i} x={300+i*190} y={480+(i%2)*30} s={.44} pose={i===3?'point':'sit'} p={q(p-i*.04)} role="diplomat"/>)}<Paper x={820} y={190} w={300} h={330}/></g>;
  case 1:return <g><R x={0} y={0} w={1920} h={1080} c="#263945"/><Person x={520} y={500} s={.7} pose="read" p={p} role="police"/><Person x={1400} y={500} s={.7} pose="read" p={1-p} role="police"/><Paper x={790} y={250} w={340} h={420}/><L x={680} y={660} X={1240} Y={660} c={C.teal} sw={11} p={p}/></g>;
  case 2:return <g><R x={0} y={0} w={1920} h={1080} c="#172630"/>{Array.from({length:8},(_,i)=><circle key={i} cx={260+(i%4)*470} cy={340+Math.floor(i/4)*360} r="58" fill={i%2?C.gold:C.teal}/>)}{Array.from({length:7},(_,i)=><L key={i} x={260+(i%4)*470} y={340+Math.floor(i/4)*360} X={260+((i+1)%4)*470} Y={340+Math.floor((i+1)/4)*360} c={C.paper} sw={6} p={q(p-i*.07)}/>)}</g>;
  case 3:return <g><R x={0} y={0} w={1920} h={1080} c="#819198"/><L x={180} y={650} X={1740} Y={650} c={C.steel} sw={18} p={p}/><Vehicle x={420} y={630} p={p} kind="truck"/><Vehicle x={1450} y={630} p={1-p} kind="truck" dir={-1}/><Ring x={960} y={650} p={p} c={C.gold}/></g>;
  case 4:return <g><R x={0} y={0} w={1920} h={1080} c="#5b5046"/><Paper x={330} y={180} w={420} h={560}/><Paper x={1170} y={180} w={420} h={560}/><L x={750} y={600} X={1170} Y={600} c={C.teal} sw={12} p={p}/><Ring x={960} y={600} p={p} c={C.teal}/></g>;
  case 5:return <g><R x={0} y={0} w={1920} h={1080} c="#14242e"/><circle cx={960} cy={540} r="150" fill={C.paper}/>{Array.from({length:8},(_,i)=>{const a=i*Math.PI/4,x=960+Math.cos(a)*430,y=540+Math.sin(a)*320;return <g key={i}><circle cx={x} cy={y} r="68" fill={i%2?C.teal:C.gold}/><L x={960} y={540} X={x} Y={y} c={i%2?C.teal:C.gold} sw={8} p={q(p-i*.07)}/></g>})}</g>;
  case 6:return <g><R x={0} y={0} w={1920} h={1080} c="#182a34"/><Gate x={960} y={650} p={p}/><g opacity={q((p-.25)*1.5)}><circle cx={620} cy={420} r="70" fill={C.gold}/><circle cx={960} cy={300} r="70" fill={C.teal}/><circle cx={1300} cy={420} r="70" fill={C.blue}/><L x={620} y={420} X={960} Y={300} c={C.paper} sw={8} p={p}/><L x={960} y={300} X={1300} Y={420} c={C.paper} sw={8} p={p}/></g></g>;
  case 7:return <g><R x={0} y={0} w={1920} h={1080} c="#12222b"/><R x={650} y={230} w={620} h={480} rx={36} c="#2b414c"/><circle cx={960} cy={470} r="110" fill={C.paper}/>{[370,620,1300,1550].map((x,i)=><g key={i}><circle cx={x} cy={i%2?720:300} r="72" fill={i%2?C.teal:C.gold}/><L x={x} y={i%2?720:300} X={960} Y={470} c={i%2?C.teal:C.gold} sw={9} p={q(p-i*.1)}/></g>)}<Ring x={960} y={470} p={p} c={C.red}/></g>;
  default:throw new Error('governance_replace variant '+v);
 }
};

export const renderFinalBorder=(v:number,p:number)=>{
 switch(v){
  case 0:return <g><R x={0} y={0} w={1920} h={1080} c={C.sky}/><P d="M0 650 L300 280 L540 610 L840 250 L1130 640 L1480 330 L1920 670 L1920 1080 L0 1080Z" c="#607864"/><P d="M0 980 C520 780 930 820 1220 740 C1510 660 1710 730 1920 680 L1920 1080Z" c="#4d5656"/><Vehicle x={430} y={760} p={p} kind="truck"/><R x={1310} y={420} w={22} h={260} c={C.steel}/><R x={1332} y={450} w={230} h={100} rx={8} c={C.paper}/></g>;
  case 1:return <g><R x={0} y={0} w={1920} h={1080} c={C.sky}/><P d="M0 610 L300 300 L580 650 L820 240 L1110 610 L1440 320 L1920 640 L1920 1080 L0 1080Z" c="#667d68"/><P d="M0 820 C430 690 780 840 1110 720 C1450 600 1660 760 1920 700 L1920 1080 L0 1080Z" c="#6e98a4"/><L x={960} y={120} X={960} Y={950} c={C.red} sw={14} o={.2}/></g>;
  case 2:return <g><R x={0} y={0} w={1920} h={1080} c="#1b2b35"/>{[{x:280,c:C.blue},{x:620,c:C.gold},{x:960,c:C.teal},{x:1300,c:C.red},{x:1640,c:C.green}].map((n,i)=><g key={i}><circle cx={n.x} cy={470+(i%2)*160} r="82" fill={n.c}/><L x={n.x} y={550+(i%2)*70} X={960} Y={820} c={n.c} sw={8} p={q(p-i*.08)}/></g>)}</g>;
  case 3:return <g><R x={0} y={0} w={1920} h={1080} c="#13232d"/><circle cx={960} cy={540} r="120" fill={C.paper}/>{Array.from({length:8},(_,i)=>{const a=i*Math.PI/4,x=960+Math.cos(a)*420,y=540+Math.sin(a)*320;return <g key={i}><circle cx={x} cy={y} r="58" fill={i%2?C.teal:C.gold}/><L x={960} y={540} X={x} Y={y} c={i%2?C.teal:C.gold} sw={7} p={q(p-i*.07)}/></g>})}</g>;
  case 4:return <g><MapBlob seed={401} p={p}/><Ring x={960} y={540} p={p} c={C.gold}/></g>;
  case 5:return <g><R x={0} y={0} w={1920} h={1080} c="#6a5b4c"/><R x={240} y={130} w={1440} h={820} c="#816a55"/><Paper x={360} y={210} w={500} h={620}/><Paper x={1060} y={210} w={500} h={620}/><L x={960} y={170} X={960} Y={860} c={C.red} sw={13} p={p}/></g>;
  case 6:return <g><R x={0} y={0} w={1920} h={1080} c="#7a9099"/><P d="M0 950 L1920 700 L1920 1080 L0 1080Z" c="#4d5656"/><Gate x={960} y={650} p={p}/><Vehicle x={420} y={760} p={p} kind="car"/><Vehicle x={1480} y={760} p={p} kind="truck"/><Ring x={960} y={620} p={p} c={C.teal}/></g>;
  case 7:return <g><R x={0} y={0} w={1920} h={1080} c="#172630"/><Person x={580} y={500} s={.72} pose="point" p={p} role="clerk"/><Person x={1340} y={500} s={.72} pose="point" p={1-p} role="clerk"/><L x={960} y={130} X={960} Y={930} c={C.red} sw={15}/><Ring x={960} y={540} p={p} c={C.gold}/></g>;
  case 8:return <g><R x={0} y={0} w={1920} h={1080} c="#1f303a"/><Vehicle x={520} y={730} p={p} kind="police"/><Person x={1280} y={500} s={.72} pose="point" p={p} role="modern"/><L x={820} y={580} X={1160} Y={580} c={C.gold} sw={11} p={p}/><Ring x={960} y={580} p={p}/></g>;
  case 9:return <g><R x={0} y={0} w={1920} h={1080} c="#879397"/><P d="M0 930 C450 730 850 780 1120 720 C1450 650 1680 730 1920 690 L1920 1080 L0 1080Z" c="#4d5656"/><Person x={650} y={520} s={.68} pose="push" p={p} role="worker"/><R x={980} y={710} w={420} h={65} c="#7e7469"/><Person x={1450} y={520} s={.64} pose="point" p={p} role="modern"/></g>;
  case 10:return <g><R x={0} y={0} w={1920} h={1080} c="#152630"/><Coins p={p} count={10} x={320} y={760}/><L x={880} y={700} X={1220} Y={470} c={C.gold} sw={13} p={p}/><School x={1290} y={210} s={.8}/><Hospital x={1270} y={530} s={.65}/></g>;
  case 11:return <g><R x={0} y={0} w={1920} h={1080} c="#172630"/><R x={940} y={120} w={40} h={820} c={C.red} o={.85}/><g opacity={q(p)}><L x={320} y={300} X={820} Y={500} c={C.gold} sw={9} p={p}/><L x={1600} y={300} X={1100} Y={500} c={C.teal} sw={9} p={p}/><circle cx={320} cy={300} r="80" fill={C.gold}/><circle cx={1600} cy={300} r="80" fill={C.teal}/></g></g>;
  case 12:return <g><R x={0} y={0} w={1920} h={1080} c="#12222b"/><R x={650} y={220} w={620} h={500} rx={38} c="#2c424d"/><circle cx={960} cy={470} r="120" fill={C.paper}/>{[370,620,1300,1550].map((x,i)=><g key={i}><circle cx={x} cy={i%2?720:300} r="72" fill={i%2?C.teal:C.gold}/><L x={x} y={i%2?720:300} X={960} Y={470} c={i%2?C.teal:C.gold} sw={9} p={q(p-i*.09)}/></g>)}<Ring x={960} y={470} p={p} c={C.red}/></g>;
  case 13:return <g><R x={0} y={0} w={1920} h={1080} c="#0c1821"/><circle cx={960} cy={540} r="390" fill="#567884"/>{Array.from({length:10},(_,i)=>{const a=i*Math.PI*2/10,x=960+Math.cos(a)*250,y=540+Math.sin(a)*210;return <P key={i} d={'M'+(x-60)+' '+(y-40)+' Q'+x+' '+(y-95)+' '+(x+60)+' '+(y-40)+' Q'+(x+90)+' '+y+' '+(x+45)+' '+(y+55)+' Q'+x+' '+(y+90)+' '+(x-50)+' '+(y+50)+' Q'+(x-90)+' '+y+' '+(x-60)+' '+(y-40)+'Z'} c={i%4===0?C.gold:i%4===1?C.green:i%4===2?C.red:C.teal} o={lerp(.2,1,q(p-i*.04))}/>})}<Ring x={960} y={540} p={p} r={430} c={C.gold}/></g>;
  default:throw new Error('final_border variant '+v);
 }
};
