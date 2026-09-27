import React from 'react';
import {C,q,lerp,R,L,P,Ring,Person,Vehicle,Gate,Paper,Coin,House,Church,Castle,Hospital,School,FireStation,Factory,MapBlob} from './primitives';

const Coins=({p,count=5,x=760,y=580}:{p:number;count?:number;x?:number;y?:number})=><>{Array.from({length:count},(_,i)=><Coin key={i} x={x+i*58} y={y+(i%2)*24} p={q(p-i*.08)} r={23}/>)}</>;
const Hall=({warm=false}:{warm?:boolean})=><><R x={0} y={0} w={1920} h={1080} c={warm?'#66584c':'#465661'}/><R x={120} y={110} w={1680} h={480} c={warm?'#7c6957':'#5e6e76'}/><R x={240} y={620} w={1440} h={100} rx={25} c={C.wood}/></>;

export const renderWestphalia=(v:number,p:number)=>{
 switch(v){
  case 0:return <g><Hall warm/>{Array.from({length:7},(_,i)=><Person key={i} x={300+i*220} y={470+(i%2)*30} s={.45} pose="sit" p={q(p-i*.05)} role="diplomat"/>)}<Paper x={800} y={190} w={320} h={300}/></g>;
  case 1:return <g><R x={0} y={0} w={1920} h={1080} c="#5d5045"/><Person x={520} y={500} s={.7} pose="hold" p={p} role="diplomat"/><Person x={1400} y={500} s={.7} pose="hold" p={1-p} role="diplomat"/><Paper x={780} y={290} w={360} h={430}/><L x={650} y={590} X={1280} Y={590} c={C.gold} sw={12} p={p}/></g>;
  case 2:return <g><R x={0} y={0} w={960} h={1080} c="#5d5045"/><R x={960} y={0} w={960} h={1080} c="#9da98e"/><g transform="translate(80 220) scale(.45)"><Paper x={0} y={0} w={700} h={850}/></g><House x={1110} y={520} s={.9}/><Church x={1440} y={420} s={.72}/><Person x={1280} y={520} s={.6} pose="walk" p={p} role="farmer"/><L x={960} y={90} X={960} Y={980} c={C.paper} sw={14}/></g>;
  case 3:return <g><R x={0} y={0} w={1920} h={1080} c="#101c24"/><L x={220} y={560} X={1700} Y={560} c={C.steel} sw={10} p={p}/>{Array.from({length:7},(_,i)=><g key={i}><circle cx={260+i*240} cy={560} r="29" fill={i===0?C.red:C.gold}/><R x={200+i*240} y={260+(i%2)*110} w={120} h={150} c={i%2?C.teal:C.blue}/><L x={260+i*240} y={530} X={260+i*240} Y={410+(i%2)*110} c={C.steel} sw={5} p={q(p-i*.09)}/></g>)}</g>;
  case 4:return <g><R x={0} y={0} w={1920} h={1080} c="#6c5a4b"/><R x={220} y={110} w={1480} h={840} c="#806a55"/><Paper x={350} y={210} w={520} h={610}/><Paper x={1050} y={210} w={520} h={610}/>{Array.from({length:5},(_,i)=><R key={i} x={410} y={310+i*75} w={380-(i%2)*70} h={8} c={C.red} o={q(p-i*.1)}/>)}<Person x={960} y={520} s={.55} pose="read" p={p} role="diplomat"/></g>;
  case 5:return <g><R x={0} y={0} w={1920} h={1080} c="#1f303a"/>{[{x:260,c:C.gold},{x:600,c:C.teal},{x:960,c:C.blue},{x:1320,c:C.red},{x:1660,c:C.green}].map((a,i)=><g key={i} opacity={q(p-i*.08)}><circle cx={a.x} cy={430+(i%2)*170} r="88" fill={a.c}/><L x={a.x} y={520+(i%2)*80} X={960} Y={760} c={a.c} sw={8} p={p}/></g>)}<R x={720} y={730} w={480} h={130} rx={22} c={C.paper}/><Ring x={960} y={790} p={p} c={C.gold}/></g>;
  default:throw new Error('westphalia_myth variant '+v);
 }
};

export const renderMarketTax=(v:number,p:number)=>{
 switch(v){
  case 0:return <g><R x={0} y={0} w={1920} h={1080} c="#a1aa91"/><R x={0} y={720} w={1920} h={360} c="#7f6a56"/>{Array.from({length:6},(_,i)=><g key={i}><R x={70+i*310} y={500-(i%2)*65} w={230} h={150} c={i%2?C.wood:C.teal}/><P d={'M50 '+(500-(i%2)*65)+' L185 '+(410-(i%2)*65)+' L320 '+(500-(i%2)*65)+'Z'} c={i%2?C.gold:C.red}/></g>)}<Person x={370} y={500} s={.66} pose="carry" p={p} role="merchant"/><Person x={1470} y={500} s={.66} pose="write" p={p} role="clerk"/></g>;
  case 1:return <g><R x={0} y={0} w={1920} h={1080} c="#66594b"/><R x={250} y={650} w={1420} h={100} c={C.wood}/><Person x={540} y={500} s={.72} pose="carry" p={p} role="merchant"/><Person x={1320} y={500} s={.72} pose="write" p={p} role="clerk"/><Coins p={p} count={8} x={770} y={570}/><Paper x={1120} y={240} w={330} h={360}/></g>;
  case 2:return <g><MapBlob seed={101} p={.2}/><circle cx={640} cy={410} r="42" fill={C.gold}/><circle cx={1340} cy={630} r="42" fill={C.red}/><L x={640} y={410} X={1340} Y={630} c={C.red} sw={12} p={p}/><Ring x={1340} y={630} p={p}/></g>;
  case 3:return <g><R x={0} y={0} w={1920} h={1080} c="#87978c"/><P d="M0 820 C450 690 760 760 960 700 C1220 620 1500 740 1920 630 L1920 1080 L0 1080Z" c="#66919c"/><Person x={520} y={500} s={.68} pose="point" p={p} role="clerk"/><Person x={1390} y={500} s={.68} pose="point" p={1-p} role="clerk"/><L x={960} y={180} X={960} Y={930} c={C.red} sw={14} p={p}/></g>;
  case 4:return <g><R x={0} y={0} w={1920} h={1080} c="#273944"/><Gate x={700} y={650} p={p}/><Person x={380} y={500} s={.66} pose="carry" p={p} role="merchant"/><Person x={1260} y={500} s={.66} pose="read" p={p} role="clerk"/><Coins p={p} count={4} x={950} y={550}/><Ring x={1120} y={550} p={p} c={C.red}/></g>;
  case 5:return <g><R x={0} y={0} w={1920} h={1080} c="#13232d"/><Coins p={p} count={10} x={280} y={700}/><L x={820} y={680} X={1180} Y={470} c={C.gold} sw={14} p={p}/><R x={1160} y={270} w={500} h={400} rx={30} c="#40525d"/>{Array.from({length:5},(_,i)=><R key={i} x={1230} y={340+i*55} w={350-(i%2)*80} h={10} c={i%2?C.teal:C.gold}/>)}</g>;
  case 6:return <g><MapBlob seed={106} p={.3}/>{Array.from({length:6},(_,i)=><g key={i}><circle cx={380+(i%3)*500} cy={320+Math.floor(i/3)*340} r="46" fill={i%2?C.gold:C.teal}/><L x={380+(i%3)*500} y={366+Math.floor(i/3)*340} X={960} Y={550} c={i%2?C.gold:C.teal} sw={7} p={q(p-i*.08)}/></g>)}<Ring x={960} y={550} p={p} c={C.red}/></g>;
  default:throw new Error('market_tax variant '+v);
 }
};

export const renderCensusState=(v:number,p:number)=>{
 switch(v){
  case 0:return <g><R x={0} y={0} w={1920} h={1080} c="#737f7d"/><R x={130} y={120} w={1660} h={520} c="#bdbfb5"/>{Array.from({length:6},(_,i)=><Paper key={i} x={180+i*260} y={190+(i%2)*35} w={200} h={300}/>)}<Person x={520} y={500} s={.6} pose="write" p={p} role="clerk"/><Person x={1390} y={500} s={.6} pose="carry" p={p} role="clerk"/></g>;
  case 1:return <g><R x={0} y={0} w={1920} h={1080} c="#5d5045"/><Paper x={300} y={160} w={520} h={700}/><Paper x={1100} y={160} w={520} h={700}/>{Array.from({length:7},(_,i)=><circle key={i} cx={420+i*120} cy={310+(i%2)*50} r="18" fill={i%2?C.red:C.teal} opacity={q(p-i*.08)}/>)}<Person x={960} y={500} s={.55} pose="write" p={p} role="clerk"/></g>;
  case 2:return <g><R x={0} y={0} w={1920} h={1080} c="#8b967f"/><R x={0} y={700} w={1920} h={380} c="#7b755c"/>{Array.from({length:8},(_,i)=><L key={i} x={100+i*240} y={720} X={200+i*240} Y={1050} c={C.soil} sw={16}/>)}<Person x={460} y={510} s={.68} pose="point" p={p} role="surveyor"/><Person x={1450} y={510} s={.68} pose="write" p={p} role="clerk"/><L x={650} y={340} X={1380} Y={340} c={C.red} sw={9} p={p} dash="30 20"/></g>;
  case 3:return <g><R x={0} y={0} w={1920} h={1080} c="#172630"/>{Array.from({length:12},(_,i)=><g key={i}><circle cx={250+(i%6)*285} cy={330+Math.floor(i/6)*320} r="54" fill={i%3===0?C.gold:i%3===1?C.teal:C.blue}/><R x={218+(i%6)*285} y={400+Math.floor(i/6)*320} w={64} h={lerp(10,90,q(p-i*.04))} c={C.paper}/></g>)}</g>;
  case 4:return <g><MapBlob seed={114} p={.25}/><School x={330} y={260} s={.55}/><FireStation x={1190} y={250} s={.55}/><R x={360} y={700} w={260} h={70} c={C.steel}/><R x={1270} y={700} w={260} h={70} c={C.steel}/><L x={500} y={600} X={960} Y={520} c={C.gold} sw={7} p={p}/><L x={1400} y={600} X={960} Y={520} c={C.teal} sw={7} p={p}/></g>;
  case 5:return <g><R x={0} y={0} w={1920} h={1080} c="#37454d"/><Person x={400} y={500} s={.7} pose="read" p={p} role="soldier"/><Paper x={760} y={220} w={400} h={520}/><Person x={1480} y={500} s={.7} pose="write" p={p} role="clerk"/><Ring x={960} y={480} p={p} c={C.red}/></g>;
  case 6:return <g><R x={0} y={0} w={1920} h={1080} c="#101c24"/>{Array.from({length:14},(_,i)=><g key={i} opacity={q(p-i*.035)}><circle cx={200+(i%7)*250} cy={280+Math.floor(i/7)*420} r="35" fill={i%2?C.teal:C.gold}/><L x={200+(i%7)*250} y={320+Math.floor(i/7)*420} X={960} Y={540} c={i%2?C.teal:C.gold} sw={4} p={p}/></g>)}<Ring x={960} y={540} p={p} c={C.red}/></g>;
  default:throw new Error('census_state variant '+v);
 }
};

export const renderPublicGoods=(v:number,p:number)=>{
 switch(v){
  case 0:return <g><R x={0} y={0} w={1920} h={1080} c="#a2afaa"/><FireStation x={690} y={250} s={1.5}/><Vehicle x={950} y={760} p={p} kind="fire"/><Person x={430} y={500} s={.65} pose="hold" p={p} role="worker"/></g>;
  case 1:return <g><R x={0} y={0} w={1920} h={1080} c="#b2c0ba"/><School x={650} y={260} s={1.6}/><Person x={650} y={510} s={.62} pose="point" p={p} role="teacher"/><Person x={1230} y={530} s={.48} pose="stand" p={p} role="child"/><Person x={1390} y={530} s={.48} pose="stand" p={1-p} role="child"/></g>;
  case 2:return <g><R x={0} y={0} w={1920} h={1080} c="#869397"/><P d="M0 930 C450 730 850 780 1120 720 C1450 650 1680 730 1920 690 L1920 1080 L0 1080Z" c="#4c5555"/><Person x={610} y={520} s={.68} pose="push" p={p} role="worker"/><R x={970} y={710} w={420} h={65} c="#7e7469"/><Ring x={1180} y={740} p={p} c={C.gold}/></g>;
  case 3:return <g><R x={0} y={0} w={1920} h={1080} c="#152630"/><Coins p={p} count={12} x={300} y={780}/><circle cx={960} cy={480} r="130" fill={C.paper}/><L x={760} y={700} X={920} Y={560} c={C.gold} sw={13} p={p}/>{[300,620,1300,1620].map((x,i)=><g key={i}><circle cx={x} cy={290+(i%2)*120} r="70" fill={i%2?C.teal:C.blue}/><L x={960} y={480} X={x} Y={290+(i%2)*120} c={i%2?C.teal:C.blue} sw={7} p={q(p-i*.1)}/></g>)}</g>;
  case 4:return <g><R x={0} y={0} w={1920} h={1080} c="#1b2b36"/><circle cx={960} cy={540} r="120" fill={C.paper}/>{[{x:330,y:300,c:C.red},{x:620,y:800,c:C.gold},{x:1300,y:800,c:C.teal},{x:1590,y:300,c:C.blue}].map((n,i)=><g key={i}><circle cx={n.x} cy={n.y} r="92" fill={n.c}/><L x={960} y={540} X={n.x} Y={n.y} c={n.c} sw={10} p={q(p-i*.1)}/></g>)}</g>;
  case 5:return <g><MapBlob seed={125} p={.2}/>{Array.from({length:4},(_,i)=><circle key={i} cx={450+(i%2)*950} cy={340+Math.floor(i/2)*400} r="55" fill={i===0?C.red:i===1?C.gold:i===2?C.blue:C.teal}/>)}<Ring x={960} y={540} p={p} c={C.red}/></g>;
  case 6:return <g><R x={0} y={0} w={960} h={1080} c="#22343e"/><R x={960} y={0} w={960} h={1080} c="#6a6259"/><School x={250} y={330} s={1.2}/><Hospital x={1220} y={330} s={1.2}/><L x={960} y={120} X={960} Y={960} c={C.red} sw={16} p={p}/><Person x={780} y={550} s={.6} pose="point" p={p} role="clerk"/><Person x={1140} y={550} s={.6} pose="point" p={1-p} role="clerk"/></g>;
  default:throw new Error('public_goods variant '+v);
 }
};

export const renderCrimeBoundary=(v:number,p:number)=>{
 switch(v){
  case 0:return <g><R x={0} y={0} w={1920} h={1080} c="#1f303b"/><P d="M0 950 C520 770 930 800 1220 730 C1510 660 1710 720 1920 680 L1920 1080 L0 1080Z" c="#454e52"/><Vehicle x={960} y={760} p={0} kind="car"/><R x={820} y={650} w={70} h={8} c={C.paper}/><R x={1080} y={700} w={90} h={10} c={C.paper}/><Ring x={960} y={740} p={p} c={C.red}/></g>;
  case 1:return <g><R x={0} y={0} w={1920} h={1080} c="#20313c"/><P d="M0 960 L1920 700 L1920 1080 L0 1080Z" c="#454e52"/><Vehicle x={420} y={760} p={p} kind="police"/><Vehicle x={1260} y={760} p={0} kind="car"/><Ring x={1260} y={730} p={p} c={C.red}/></g>;
  case 2:return <g><R x={0} y={0} w={1920} h={1080} c="#253743"/><P d="M0 980 L1920 720 L1920 1080 L0 1080Z" c="#485154"/><Gate x={1250} y={660} p={0}/><Vehicle x={520} y={760} p={p} kind="police"/><BorderPost/></g>;
  case 3:return <g><R x={0} y={0} w={1920} h={1080} c="#243640"/><L x={960} y={120} X={960} Y={950} c={C.red} sw={15} p={1}/><Person x={700} y={520} s={.7} pose="walk" p={p} role="traveler"/><Person x={1250} y={520} s={.7} pose="walk" p={1-p} role="traveler"/><Ring x={960} y={560} p={p}/></g>;
  case 4:return <g><R x={0} y={0} w={1920} h={1080} c="#263943"/><P d="M0 940 L1920 710 L1920 1080 L0 1080Z" c="#4d5557"/><Vehicle x={700} y={760} p={q(p*1.4)} kind="police"/><Gate x={1080} y={660} p={0}/><L x={700} y={650} X={1040} Y={650} c={C.red} sw={12} p={p}/></g>;
  case 5:return <g><R x={0} y={0} w={1920} h={1080} c="#5b5045"/><Paper x={430} y={180} w={430} h={620}/><Paper x={1060} y={180} w={430} h={620}/><Person x={960} y={500} s={.55} pose="read" p={p} role="police"/><L x={820} y={710} X={1100} Y={710} c={C.gold} sw={12} p={p}/></g>;
  case 6:return <g><R x={0} y={0} w={960} h={1080} c="#263b49"/><R x={960} y={0} w={960} h={1080} c="#4f5e65"/><Person x={480} y={500} s={.7} pose="hold" p={p} role="police"/><Person x={1440} y={500} s={.7} pose="hold" p={1-p} role="police"/><L x={620} y={410} X={1300} Y={410} c={C.teal} sw={10} p={p} dash="22 16"/><Ring x={960} y={410} p={p} c={C.teal}/></g>;
  case 7:return <g><R x={0} y={0} w={1920} h={1080} c="#15242d"/><Vehicle x={640} y={720} p={p} kind="police"/><Vehicle x={1280} y={720} p={1-p} kind="police" dir={-1}/><circle cx={960} cy={540} r={lerp(80,260,p)} fill={C.red} opacity={.2}/><L x={760} y={600} X={1160} Y={480} c={C.red} sw={11} p={p}/><L x={1160} y={600} X={760} Y={480} c={C.red} sw={11} p={p}/></g>;
  default:throw new Error('crime_boundary variant '+v);
 }
};
const BorderPost=()=> <g><R x={1420} y={420} w={22} h={280} c={C.steel}/><R x={1442} y={450} w={220} h={90} rx={8} c={C.paper}/></g>;

export const renderPowerStopline=(v:number,p:number)=>{
 switch(v){
  case 0:return <g><R x={0} y={0} w={1920} h={1080} c="#1c2d37"/><Vehicle x={480} y={730} p={p} kind="police"/><Vehicle x={1440} y={730} p={p} kind="police" dir={-1}/><L x={960} y={130} X={960} Y={930} c={C.red} sw={14} p={1}/></g>;
  case 1:return <g><R x={0} y={0} w={1920} h={1080} c="#20333d"/><Vehicle x={710} y={730} p={q(p*.65)} kind="police"/><Vehicle x={1210} y={730} p={q(p*.65)} kind="police" dir={-1}/><L x={960} y={130} X={960} Y={930} c={C.red} sw={16}/><Ring x={960} y={720} p={p} c={C.red}/></g>;
  case 2:return <g><R x={0} y={0} w={1920} h={1080} c="#13232c"/><Person x={520} y={500} s={.74} pose="point" p={p} role="traveler"/><Person x={1400} y={500} s={.74} pose="point" p={1-p} role="police"/><L x={960} y={140} X={960} Y={950} c={C.red} sw={14}/><Ring x={960} y={500} p={p}/></g>;
  case 3:return <g><R x={0} y={0} w={1920} h={1080} c="#172630"/><Person x={650} y={500} s={.75} pose="stand" p={p} role="police"/><Person x={1270} y={500} s={.75} pose="stand" p={p} role="soldier"/><L x={960} y={130} X={960} Y={930} c={C.red} sw={15}/><Ring x={960} y={540} p={p} c={C.gold}/></g>;
  case 4:return <g><R x={0} y={0} w={1920} h={1080} c="#0f1b23"/>{Array.from({length:6},(_,i)=><g key={i}><circle cx={350+(i%3)*610} cy={330+Math.floor(i/3)*360} r="85" fill={i%2?C.red:C.blue}/><L x={350+(i%3)*610} y={330+Math.floor(i/3)*360} X={960} Y={540} c={i%2?C.red:C.blue} sw={12} p={q(p-i*.08)}/></g>)}<Ring x={960} y={540} p={p} r={280} c={C.red}/></g>;
  case 5:return <g><R x={0} y={0} w={1920} h={1080} c="#172630"/><L x={180} y={540} X={1740} Y={540} c={C.paper} sw={10}/><L x={960} y={160} X={960} Y={920} c={C.red} sw={16} p={p}/><Vehicle x={520} y={700} p={p} kind="police"/><Vehicle x={1400} y={700} p={1-p} kind="police" dir={-1}/></g>;
  default:throw new Error('power_stopline variant '+v);
 }
};

export const renderPostwarOrder=(v:number,p:number)=>{
 switch(v){
  case 0:return <g><R x={0} y={0} w={1920} h={1080} c="#777f82"/><R x={0} y={760} w={1920} h={320} c="#746d67"/>{Array.from({length:7},(_,i)=><g key={i}><R x={80+i*285} y={250+(i%2)*100} w={220} h={400-(i%2)*70} c="#6c6966"/><P d={'M80 '+(250+(i%2)*100)+' L180 '+(170+(i%2)*100)+' L300 '+(250+(i%2)*100)+'Z'} c="#595755"/></g>)}<Person x={570} y={510} s={.62} pose="carry" p={p} role="worker"/><Person x={1330} y={510} s={.62} pose="push" p={p} role="worker"/></g>;
  case 1:return <g><Hall/>{Array.from({length:8},(_,i)=><Person key={i} x={280+i*195} y={470+(i%2)*30} s={.42} pose="sit" p={q(p-i*.04)} role="diplomat"/>)}<Paper x={820} y={180} w={280} h={330}/></g>;
  case 2:return <g><R x={0} y={0} w={1920} h={1080} c="#52493f"/><Paper x={560} y={120} w={800} h={820}/>{Array.from({length:7},(_,i)=><R key={i} x={650} y={250+i*75} w={620-(i%3)*80} h={9} c={i===1?C.red:C.steel} o={q(p-i*.08)}/>)}<Ring x={960} y={330} p={p}/></g>;
  case 3:return <g><R x={0} y={0} w={1920} h={1080} c="#15242d"/>{Array.from({length:6},(_,i)=><g key={i}><circle cx={300+i*260} cy={540} r="88" fill={i%2?C.gold:C.teal}/><R x={260+i*260} y={500} w={80} h={80} c={C.paper}/></g>)}<L x={250} y={760} X={1670} Y={760} c={C.paper} sw={9} p={p}/></g>;
  case 4:return <g><MapBlob seed={155} p={1}/><L x={570} y={520} X={1350} Y={520} c={C.red} sw={15} p={p}/><P d="M1320 490 L1390 520 L1320 550Z" c={C.red}/><Ring x={960} y={520} p={p} c={C.red}/></g>;
  case 5:return <g><R x={0} y={0} w={1920} h={1080} c="#172630"/><L x={960} y={130} X={960} Y={930} c={C.red} sw={15}/><Person x={600} y={500} s={.7} pose="point" p={p} role="soldier"/><Person x={1320} y={500} s={.7} pose="point" p={1-p} role="soldier"/><Ring x={960} y={540} p={p} r={250} c={C.gold}/></g>;
  default:throw new Error('postwar_order variant '+v);
 }
};
