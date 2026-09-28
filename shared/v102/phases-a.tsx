import React from 'react';
import {C,R,L,P,Ring,Person,Vehicle,Paper,Coin,House,Factory,q,lerp} from './primitives';
import {T,Mother,Child,FlatA,FlatB,ApartmentExterior,Nursery,OldCottage,BritainMill,Workhouse,Letter,Phone,ResearchDesk,SymbolicBoundary} from './welfare-primitives';

export const renderIntroMotherA=(v:number,p:number):React.ReactNode=>{
 switch(v){
 case 0:return <g><ApartmentExterior p={p}/><P d="M0 800 Q250 655 515 760" c="none" stroke="#e4e5df" sw={12}/><Mother x={1300} y={610} s={.6} which="a" pose="walk" p={p}/><Child x={1465} y={694} s={.47} p={p}/></g>;
 case 1:return <g><FlatA/><Mother x={1090} y={500} s={.7} which="a" pose="reach" p={p}/><Child x={500} y={695} s={.5} p={p}/>{Array.from({length:6},(_,i)=><R key={i} x={280+i*48} y={880-(i%3)*50} w={43} h={42} c={i%2?C.gold:C.red} o={q(p+i*.2)}/>)}<Letter x={1250} y={560} p={p} s={.54}/></g>;
 case 2:return <g><R x={0} y={0} w={1920} h={1080} c="#394c53"/><Letter x={960} y={475} p={p} approved s={1.55}/><Ring x={960} y={600} p={p} r={300} c={C.teal}/><T x={960} y={925} size={58}>保育所 入所決定</T></g>;
 case 3:return <g><R x={0} y={0} w={960} h={1080} c="#b8b7a8"/><g transform="translate(-240 70) scale(.74)"><FlatA/></g><Mother x={440} y={505} s={.66} which="a" pose="call" p={p}/><R x={960} y={0} w={960} h={1080} c="#7a949d"/><R x={1060} y={130} w={750} h={700} c="#bbcbd0"/><Person x={1460} y={520} s={.65} pose="read" p={p} role="clerk"/><Phone x={1040} y={360} p={p} calling/><L x={920} y={350} X={1050} Y={350} c={C.gold} sw={11} p={p}/></g>;
 case 4:return <g><FlatA evening/><Mother x={1130} y={480} s={.63} which="a" pose="carry" p={p}/><Child x={560} y={665} s={.48} p={p}/><R x={950} y={610} w={190} h={120} rx={17} c={C.ink}/><g transform={'translate(0 '+lerp(-45,0,p)+')'}><R x={982} y={590} w={128} h={68} c={C.teal}/><R x={1020} y={565} w={54} h={35} c={C.paper}/></g><Ring x={1050} y={650} p={p} r={135} c={C.gold}/></g>;
 default:throw new Error('intro_mother_a variant '+v);
 }
};

export const renderIntroMotherB=(v:number,p:number):React.ReactNode=>{
 switch(v){
 case 0:return <g><FlatB/><Mother x={1070} y={475} s={.73} which="b" pose="read" p={p}/><Letter x={1020} y={620} p={p} approved={false} s={.58}/><Child x={340} y={660} s={.51} p={p} coat="#9f9a65"/></g>;
 case 1:return <g><R x={0} y={0} w={1920} h={1080} c="#6c777d"/><R x={280} y={145} w={1360} h={760} rx={33} c="#786e64"/>{Array.from({length:4},(_,i)=><g key={i} transform={'translate('+((i%2)*615)+' '+(Math.floor(i/2)*335)+')'}><Paper x={365} y={205} w={460} h={285}/><L x={460} y={370} X={lerp(460,720,p)} Y={440} c={C.red} sw={10} p={p}/></g>)}<Mother x={1440} y={480} s={.52} which="b" pose="reach" p={p}/></g>;
 case 2:return <g><FlatB/><Mother x={815} y={500} s={.7} which="b" pose="call" p={p}/><Phone x={1230} y={450} p={p} calling/><g opacity={q(p*1.7)}><R x={1450} y={250} w={290} h={180} rx={20} c="#d8d3c5"/><T x={1595} y={355} size={36} c={C.ink}>復帰は未定</T></g></g>;
 case 3:return <g><SymbolicBoundary p={p}/><R x={180} y={120} w={640} h={115} rx={16} c={C.teal}/><T x={500} y={194} size={44}>復帰へ</T><R x={1110} y={120} w={640} h={115} rx={16} c={C.red}/><T x={1430} y={194} size={44}>復帰を延期</T></g>;
 case 4:return <g><R x={0} y={0} w={950} h={1080} c="#9fb8af"/><Nursery p={p}/><R x={955} y={0} w={965} h={1080} c="#9aa6ad"/><g transform="translate(975 0) scale(.492)"><FlatB/><Mother x={1160} y={485} s={.75} which="b" pose="sit" p={p}/></g><L x={950} y={100} X={950} Y={920} c={C.paper} sw={18}/></g>;
 case 5:return <g><R x={0} y={0} w={1920} h={1080} c="#182b37"/><g transform="translate(-80 120) scale(.52)"><FlatA/></g><g transform="translate(990 120) scale(.52)"><FlatB/></g><Mother x={450} y={560} s={.64} which="a" pose="carry" p={p}/><Mother x={1490} y={560} s={.64} which="b" pose="sit" p={p}/><L x={960} y={150} X={960} Y={850} c={C.gold} sw={11}/><Ring x={960} y={580} p={p} r={260} c={C.red}/></g>;
 default:throw new Error('intro_mother_b variant '+v);
 }
};

export const renderChildcareEvidence=(v:number,p:number):React.ReactNode=>{
 switch(v){
 case 0:return <g><ResearchDesk p={p}/><Paper x={620} y={270} w={325} h={350}/><Paper x={1140} y={270} w={325} h={350}/><T x={960} y={900} size={48}>行政記録を比較</T></g>;
 case 1:return <g><R x={0} y={0} w={1920} h={1080} c="#263a43"/>{Array.from({length:2},(_,i)=><g key={i}><R x={225+i*910} y={155} w={760} h={710} rx={20} c={i?C.blue:C.teal} o={.63}/>{Array.from({length:8},(_,j)=><circle key={j} cx={365+i*910+(j%4)*157} cy={370+Math.floor(j/4)*185} r="46" fill={q(p-j*.05)>.1?C.paper:C.slate}/>)}</g>)}<T x={960} y={100} size={48}>入所確率が近い家庭</T><L x={960} y={330} X={960} Y={850} c={C.gold} sw={10} p={p}/></g>;
 case 2:return <g><R x={0} y={0} w={1920} h={1080} c="#172a35"/><T x={960} y={150} size={54}>母親の就業率への影響</T>{[40.3,18.8].map((val,i)=><g key={i}><R x={410+i*770} y={720-val*9} w={330} h={val*9} c={i?C.gold:C.teal} o={q(p*1.3-i*.15)}/><T x={575+i*770} y={690-val*9} size={82}>{String(val)} pt</T><T x={575+i*770} y={805} size={48}>{i?'１歳児':'０歳児'}</T></g>)}<L x={210} y={726} X={1710} Y={726} c={C.paper} sw={7}/></g>;
 case 3:return <g><R x={0} y={0} w={1920} h={1080} c="#5b605f"/><R x={180} y={120} w={1560} h={790} rx={27} c="#8c7b6b"/><Letter x={590} y={410} p={p} s={.85}/><Letter x={1330} y={410} p={p} approved={false} s={.85}/><L x={960} y={145} X={960} Y={850} c={C.red} sw={15} p={p}/></g>;
 case 4:return <g><Nursery p={p}/>{Array.from({length:6},(_,i)=><circle key={i} cx={360+i*235} cy={770} r={40} fill={i<3?C.teal:C.gold} opacity={q(p-i*.08)}/>)}<Mother x={450} y={575} s={.55} which="a" pose="walk" p={p}/><Mother x={1500} y={575} s={.55} which="b" pose="stand" p={p}/><Ring x={960} y={650} p={p} r={310} c={C.red}/></g>;
 default:throw new Error('childcare_evidence variant '+v);
 }
};

export const renderOpeningParadox=(v:number,p:number):React.ReactNode=>{
 switch(v){
 case 0:return <g><R x={0} y={0} w={1920} h={1080} c="#233743"/><SymbolicBoundary p={p}/><T x={960} y={170} size={60}>支援は誰へ届くのか</T></g>;
 case 1:return <g><R x={0} y={0} w={1920} h={1080} c="#182b35"/>{['財源','施設','人員'].map((t,i)=><g key={i}><circle cx={420+i*540} cy={500} r={155} fill={[C.gold,C.blue,C.teal][i]}/><T x={420+i*540} y={520} size={59}>{t}</T><Ring x={420+i*540} y={500} p={q(p-i*.14)} r={245}/></g>)}<L x={240} y={790} X={1700} Y={790} c={C.red} sw={12} p={p}/></g>;
 case 2:return <g><SymbolicBoundary p={p}/><R x={230} y={245} w={570} h={125} rx={20} c="#6ca79b"/><R x={1115} y={245} w={570} h={125} rx={20} c="#a76b62"/><T x={515} y={325} size={48}>支援を利用</T><T x={1400} y={325} size={48}>対象の外側</T></g>;
 case 3:return <g><R x={0} y={0} w={1920} h={1080} c="#142632"/><R x={150} y={175} w={500} h={690} rx={35} c="#3b5260"/><R x={710} y={175} w={500} h={690} rx={35} c="#5d5147"/><R x={1270} y={175} w={500} h={690} rx={35} c="#465b55"/><T x={400} y={405} size={58}>所得</T><T x={960} y={405} size={58}>家賃</T><T x={1520} y={405} size={58}>手続き</T><L x={200} y={640} X={1710} Y={640} c={C.red} sw={13} p={p}/></g>;
 case 4:return <g><R x={0} y={0} w={1920} h={1080} c="#273942"/><House x={230} y={315} s={1.5}/><Mother x={1310} y={480} s={.77} which="b" pose="reach" p={p}/><L x={630} y={580} X={1170} Y={580} c={C.gold} sw={18} p={p}/><Ring x={950} y={580} p={p} r={230}/></g>;
 case 5:return <g><R x={0} y={0} w={1920} h={1080} c="#303b3d"/><BritainMill p={p}/><R x={1080} y={90} w={690} h={240} rx={18} c="#d0bfa2"/><T x={1425} y={230} size={64} c={C.ink}>1834</T></g>;
 default:throw new Error('opening_paradox variant '+v);
 }
};

export const renderBritainVillage=(v:number,p:number):React.ReactNode=>{
 switch(v){
 case 0:return <g><BritainMill p={p}/><Person x={300} y={530} s={.69} pose="walk" p={p} role="farmer"/><R x={1300} y={130} w={320} h={170} c="#78858a"/><T x={1460} y={243}>工場の町</T></g>;
 case 1:return <g><OldCottage night/><Person x={900} y={475} s={.7} pose="sit" p={p} role="farmer"/><Paper x={960} y={620} w={210} h={100}/><Ring x={1410} y={510} p={p} r={165} c={C.orange}/></g>;
 case 2:return <g><OldCottage/><Mother x={720} y={470} s={.65} which="b" pose="sit" p={p}/><Child x={580} y={630} s={.54} p={p} coat="#8f9068"/><L x={740} y={670} X={895} Y={670} c={C.paper} sw={5} dash="14 10" p={p}/></g>;
 case 3:return <g><R x={0} y={0} w={1920} h={1080} c="#4b5c5c"/><R x={220} y={225} w={1500} h={630} c="#bba78a"/><Person x={430} y={485} s={.68} pose="point" p={p} role="farmer"/><Person x={1440} y={485} s={.68} pose="read" p={p} role="clerk"/><Ring x={960} y={520} p={p} r={340} c={C.gold}/></g>;
 case 4:return <g><R x={0} y={0} w={1920} h={1080} c="#22333d"/><Paper x={250} y={180} w={470} h={650}/><Paper x={1200} y={180} w={470} h={650} chart/><L x={735} y={500} X={1150} Y={500} c={C.red} sw={14} p={p}/><T x={960} y={910} size={52}>救済と財政負担</T></g>;
 default:throw new Error('britain_village variant '+v);
 }
};

export const renderWorkhouseGates=(v:number,p:number):React.ReactNode=>{
 switch(v){
 case 0:return <g><R x={0} y={0} w={1920} h={1080} c="#28333d"/><Paper x={470} y={165} w={980} h={680}/><T x={960} y={255} size={60} c={C.ink}>1834</T><L x={520} y={630} X={1390} Y={630} c={C.red} sw={12} p={p}/></g>;
 case 1:return <g><Workhouse p={p}/><Person x={520} y={520} s={.65} pose="carry" p={p} role="farmer"/><Mother x={665} y={525} s={.57} which="b" pose="walk" p={p}/><Child x={790} y={650} s={.46} p={p}/></g>;
 case 2:return <g><Workhouse inside p={p}/><Person x={1260} y={510} s={.58} pose="carry" p={p} role="farmer"/><R x={630} y={795} w={420} h={70} c="#4d4d46"/><L x={905} y={195} X={905} Y={900} c={C.ink} sw={12} p={p}/></g>;
 case 3:return <g><R x={0} y={0} w={1920} h={1080} c="#58635e"/><R x={160} y={180} w={780} h={720} c="#777e70"/><R x={980} y={180} w={780} h={720} c="#6f6e68"/><L x={960} y={160} X={960} Y={930} c={C.paper} sw={24}/><Person x={570} y={510} s={.72} pose="walk" p={p} role="farmer"/><Mother x={1370} y={505} s={.72} which="b" pose="walk" p={1-p}/><Child x={1585} y={630} s={.5} p={p}/></g>;
 case 4:return <g><R x={0} y={0} w={1920} h={1080} c="#5a6260"/><R x={185} y={150} w={1550} h={735} c="#a49b86"/><Paper x={355} y={270} w={510} h={480}/><Paper x={1090} y={270} w={510} h={480}/><T x={960} y={950}>地域ごとの救済方法</T><Ring x={960} y={530} p={p} r={360}/></g>;
 default:throw new Error('workhouse_gates variant '+v);
 }
};

export const renderLessEligibility=(v:number,p:number):React.ReactNode=>{
 switch(v){
 case 0:return <g><R x={0} y={0} w={1920} h={1080} c="#1d2c35"/><R x={0} y={0} w={940} h={1080} c="#58655e"/><R x={980} y={0} w={940} h={1080} c="#77716a"/><Person x={420} y={480} s={.8} pose="push" p={p} role="farmer"/><Person x={1490} y={480} s={.8} pose="sit" p={p} role="farmer"/><L x={960} y={100} X={960} Y={950} c={C.red} sw={16}/><T x={475} y={175}>最低賃金で働く</T><T x={1420} y={175}>救済を受ける</T></g>;
 case 1:return <g><R x={0} y={0} w={1920} h={1080} c="#1e303c"/><g transform="translate(-750 -260) scale(1.92)"><Workhouse p={p}/></g><R x={840} y={190} w={245} h={570} c="#595950" o={.9}/><L x={865} y={445} X={1090} Y={445} c={C.gold} sw={15} p={p}/><Ring x={965} y={505} p={p} r={290} c={C.red}/></g>;
 case 2:return <g><R x={0} y={0} w={1920} h={1080} c="#766b59"/><R x={190} y={90} w={1535} h={855} c="#7f6a55" rx={25}/><Paper x={350} y={220} w={530} h={590} chart/><Paper x={1090} y={225} w={460} h={540}/>{Array.from({length:8},(_,i)=><Coin key={i} x={680+i*90} y={825+(i%2)*22} p={q(p-i*.08)} r={23}/>)}</g>;
 case 3:return <g><R x={0} y={0} w={1920} h={1080} c="#263441"/><Workhouse inside p={p}/><R x={955} y={85} w={14} h={830} c={C.red} o={q(p*1.5)}/><Ring x={965} y={470} p={p} r={285}/></g>;
 case 4:return <g><R x={0} y={0} w={1920} h={1080} c="#192932"/><R x={350} y={240} w={510} h={530} c="#465c61"/><R x={1070} y={240} w={510} h={530} c="#6d5c52"/><Mother x={625} y={495} s={.72} which="a" pose="carry" p={p}/><Mother x={1345} y={495} s={.72} which="b" pose="read" p={p}/><L x={890} y={470} X={1030} Y={470} c={C.red} sw={15} p={p}/></g>;
 default:throw new Error('less_eligibility variant '+v);
 }
};
