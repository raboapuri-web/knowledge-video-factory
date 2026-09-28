import React from 'react';
import {C,R,L,P,Ring,Person,Vehicle,Paper,Coin,House,q,lerp} from './primitives';
import {T,Mother,Child,FlatA,FlatB,OldCottage,Workhouse,Parliament,Grocery,Office,RentalStreet,Realtor,Letter,Phone,HomeBudget,StepGraph,PriceTag,SymbolicBoundary,ResearchDesk} from './welfare-primitives';

export const renderWorkhouseDebate=(v:number,p:number):React.ReactNode=>{
 switch(v){
 case 0:return <g><Parliament p={p}/><Ring x={930} y={420} p={p} r={195} c={C.gold}/><T x={960} y={140} size={58}>英国議会　1834</T></g>;
 case 1:return <g><R x={0} y={0} w={1920} h={1080} c="#343b38"/><R x={175} y={145} w={1570} h={820} c="#796952"/><Paper x={580} y={240} w={760} h={540}/><Person x={1450} y={505} s={.71} role="lord" pose="point" p={p}/><L x={720} y={745} X={1230} Y={280} c={C.red} sw={12} p={p}/></g>;
 case 2:return <g><R x={0} y={0} w={1920} h={1080} c="#25343d"/><g transform="translate(-140 0) scale(.62)"><OldCottage night/></g><g transform="translate(930 0) scale(.52)"><Workhouse inside p={p}/></g><L x={960} y={95} X={960} Y={910} c={C.paper} sw={20}/><Person x={640} y={540} s={.56} pose="walk" p={p} role="farmer"/><Ring x={990} y={550} p={p} r={255} c={C.red}/></g>;
 case 3:return <g><R x={0} y={0} w={1920} h={1080} c="#1d2d38"/>{Array.from({length:2},(_,i)=><g key={i}><R x={155+i*930} y={180} w={690} h={690} c={i?'#6b6257':'#64776d'}/><Person x={465+i*930} y={490} s={.8} pose={i?'sit':'push'} p={p} role="farmer"/><T x={500+i*930} y={790} size={45}>{i?'救済の条件':'働く機会'}</T></g>)}<Ring x={960} y={495} p={p} r={175}/></g>;
 case 4:return <g><R x={0} y={0} w={1920} h={1080} c="#293641"/><Paper x={220} y={200} w={500} h={640}/><Paper x={1170} y={210} w={500} h={625}/><L x={760} y={495} X={1140} Y={495} c={C.red} sw={14} p={p}/><R x={830} y={390} w={240} h={215} c="#546971"/><T x={950} y={505} size={45}>資格審査</T></g>;
 default:throw new Error('workhouse_debate variant '+v);
 }
};

export const renderEligibilityLine=(v:number,p:number):React.ReactNode=>{
 switch(v){
 case 0:return <g><R x={0} y={0} w={1920} h={1080} c="#182934"/><R x={230} y={210} w={1460} h={630} rx={35} c="#324e59"/><R x={952} y={250} w={16} h={540} c={C.paper}/><Person x={650} y={465} s={.72} pose="walk" p={p} role="modern"/><Person x={1270} y={465} s={.72} pose="sit" p={p} role="modern"/><T x={960} y={140} size={58}>受給資格の境界</T></g>;
 case 1:return <g><R x={0} y={0} w={1920} h={1080} c="#686b63"/><R x={150} y={145} w={1640} h={720} c="#c5bca7"/><Person x={475} y={480} s={.77} pose="point" p={p} role="clerk"/><Person x={1475} y={480} s={.77} pose="carry" p={p} role="farmer"/><Paper x={785} y={280} w={355} h={440}/><L x={1150} y={510} X={1320} Y={510} c={C.red} sw={10} p={p}/></g>;
 case 2:return <g><R x={0} y={0} w={1920} h={1080} c="#182834"/><g opacity={.8}><R x={150} y={185} w={750} h={660} c="#4b6868"/><R x={1020} y={185} w={750} h={660} c="#7a6155"/></g><Person x={515} y={470} s={.74} pose="read" p={p} role="farmer"/><Mother x={1390} y={470} s={.74} which="b" pose="sit" p={p}/><L x={960} y={215} X={960} Y={820} c={C.paper} sw={13} p={p}/></g>;
 case 3:return <g><R x={0} y={0} w={1920} h={1080} c="#263846"/><R x={225} y={180} w={520} h={680} c="#d1c5a8"/><R x={1190} y={180} w={520} h={680} c="#d1c5a8"/><T x={485} y={345} size={54} c={C.ink}>厳格な条件</T><T x={1450} y={345} size={54} c={C.ink}>広い対象</T><L x={748} y={520} X={1168} Y={520} c={C.gold} sw={15} p={p}/><Paper x={820} y={565} w={280} h={250} chart/></g>;
 case 4:return <g><R x={0} y={0} w={1920} h={1080} c="#28363a"/><Workhouse p={p}/><R x={1300} y={130} w={430} h={190} c={C.paper}/><T x={1515} y={247} size={57} c={C.ink}>救済と生活</T><Ring x={970} y={560} p={p} r={245} c={C.red}/></g>;
 case 5:return <g><R x={0} y={0} w={1920} h={1080} c="#142634"/><L x={280} y={830} X={1600} Y={830} c={C.paper} sw={11}/><L x={280} y={830} X={280} Y={160} c={C.paper} sw={11}/><P d="M330 710 C520 670 680 620 800 540 C980 440 1160 330 1590 275" c="none" stroke={C.teal} sw={17}/><L x={960} y={165} X={960} Y={840} c={C.red} sw={12} dash="18 14" p={p}/><Ring x={960} y={465} p={p} r={170}/><T x={1150} y={200} size={53}>現代の給付制度へ</T></g>;
 default:throw new Error('eligibility_line variant '+v);
 }
};

export const renderUsSupermarket=(v:number,p:number):React.ReactNode=>{
 switch(v){
 case 0:return <g><Grocery p={p}/><Mother x={1255} y={505} s={.7} which="b" pose="walk" p={p}/><Child x={1450} y={650} s={.43} p={p}/><R x={1120} y={725} w={300} h={75} rx={14} c="#56635c"/><Ring x={1240} y={720} p={p} r={140} c={C.gold}/></g>;
 case 1:return <g><R x={0} y={0} w={1920} h={1080} c="#5a6c6e"/><g transform="translate(-350 0) scale(.55)"><Grocery p={p}/></g><Phone x={1180} y={450} p={p}/><Paper x={1390} y={315} w={350} h={410} chart/><Mother x={585} y={535} s={.68} which="b" pose="read" p={p}/></g>;
 case 2:return <g><Office p={p}/><Person x={570} y={465} s={.71} pose="point" p={p} role="clerk"/><Mother x={1280} y={475} s={.71} which="b" pose="reach" p={p}/><R x={750} y={660} w={340} h={145} rx={20} c={C.paper}/><T x={920} y={750} size={58} c={C.ink}>昇給</T></g>;
 case 3:return <g><FlatB evening/><Mother x={1050} y={490} s={.7} which="b" pose="write" p={p}/><Paper x={1120} y={605} w={310} h={235} chart/>{Array.from({length:5},(_,i)=><Coin key={i} x={520+i*62} y={860-(i%2)*25} p={q(p-i*.14)} r={24}/>)}</g>;
 case 4:return <g><R x={0} y={0} w={1920} h={1080} c="#293947"/><R x={255} y={165} w={1410} h={680} rx={30} c="#4a6068"/><T x={960} y={290} size={62}>給料と支援の条件</T><Paper x={380} y={360} w={480} h={390}/><Paper x={1050} y={360} w={480} h={390} chart/><L x={865} y={550} X={1040} Y={550} c={C.red} sw={15} p={p}/></g>;
 default:throw new Error('us_supermarket variant '+v);
 }
};

export const renderBenefitCliff=(v:number,p:number):React.ReactNode=>{
 switch(v){
 case 0:return <g><FlatB/><Mother x={1120} y={475} s={.75} which="b" pose="read" p={p}/><Letter x={1240} y={650} p={p} approved={false} s={.54}/><R x={430} y={305} w={410} h={180} c={C.paper}/><T x={635} y={410} size={51} c={C.ink}>所得基準</T></g>;
 case 1:return <g><HomeBudget p={p}/><R x={1380} y={175} w={290} h={190} rx={17} c={C.teal}/><T x={1525} y={285} size={66}>＋$200</T><Ring x={960} y={495} p={p} r={230} c={C.red}/></g>;
 case 2:return <g><StepGraph p={p}/><T x={960} y={940} size={45}>一定の基準で給付が減る</T></g>;
 case 3:return <g><ResearchDesk p={p}/><g transform="translate(835 230) scale(.42)"><StepGraph p={p}/></g><T x={960} y={870} size={50}>給付の崖を分析</T></g>;
 case 4:return <g><R x={0} y={0} w={1920} h={1080} c="#20313b"/><R x={185} y={235} w={620} h={630} c="#526f71"/><R x={1115} y={235} w={620} h={630} c="#6f6060"/><Mother x={480} y={495} s={.76} which="b" pose="reach" p={p}/><Child x={1410} y={650} s={.67} p={p}/><L x={790} y={565} X={1120} Y={565} c={C.gold} sw={15} p={p}/></g>;
 default:throw new Error('benefit_cliff variant '+v);
 }
};

export const renderUsChoice=(v:number,p:number):React.ReactNode=>{
 switch(v){
 case 0:return <g><HomeBudget p={p}/><Paper x={1430} y={325} w={260} h={370}/><T x={960} y={155} size={50}>昇給後の手取りを計算</T></g>;
 case 1:return <g><Nursery p={p}/><Mother x={1460} y={570} s={.64} which="b" pose="walk" p={p}/><Child x={1595} y={680} s={.5} p={p}/><R x={990} y={320} w={510} h={165} c={C.paper}/><T x={1245} y={430} size={49} c={C.red}>保育費</T><Ring x={1200} y={575} p={p} r={270}/></g>;
 case 2:return <g><R x={0} y={0} w={1920} h={1080} c="#20343d"/><P d="M960 910 L960 485 L430 150" c="none" stroke={C.gold} sw={19}/><P d="M960 485 L1490 150" c="none" stroke={C.teal} sw={19}/><Mother x={960} y={520} s={.7} which="b" pose="reach" p={p}/><R x={215} y={110} w={520} h={135} c="#67776d"/><T x={475} y={205}>現状を維持</T><R x={1190} y={110} w={520} h={135} c="#586f78"/><T x={1450} y={205}>新しい仕事</T></g>;
 case 3:return <g><Office night p={p}/><Mother x={540} y={490} s={.72} which="b" pose="call" p={p}/><Phone x={1170} y={405} p={p} calling/><Paper x={1400} y={290} w={300} h={300}/><Ring x={1480} y={500} p={p} r={180} c={C.red}/></g>;
 case 4:return <g><FlatB evening/><Mother x={1080} y={490} s={.76} which="b" pose="sit" p={p}/><R x={375} y={245} w={385} h={465} rx={22} c="#cfc3a8"/><T x={565} y={480} size={49} c={C.ink}>家族を守る判断</T><Ring x={900} y={535} p={p} r={230} c={C.gold}/></g>;
 default:throw new Error('us_choice variant '+v);
 }
};

export const renderProgramOverlap=(v:number,p:number):React.ReactNode=>{
 switch(v){
 case 0:return <g><R x={0} y={0} w={1920} h={1080} c="#273a44"/>{['食料支援','保育支援','税務'].map((x,i)=><g key={i}><R x={120+i*600} y={210} w={490} h={520} rx={17} c={[C.green,C.teal,C.blue][i]}/><T x={365+i*600} y={330} size={51}>{x}</T><Paper x={250+i*600} y={400} w={250} h={255} chart={i===2}/></g>)}</g>;
 case 1:return <g><R x={0} y={0} w={1920} h={1080} c="#1d2d37"/><R x={430} y={250} w={1060} h={540} rx={20} c="#49656b"/>{Array.from({length:4},(_,i)=><g key={i}><R x={525+i*245} y={390} w={170} h={225} rx={16} c={i%2?C.gold:C.teal}/><T x={610+i*245} y={675} size={34}>制度 {i+1}</T></g>)}<L x={465} y={740} X={1460} Y={740} c={C.red} sw={12} p={p}/></g>;
 case 2:return <g><FlatB evening/><Mother x={430} y={470} s={.66} which="b" pose="write" p={p}/><Paper x={890} y={600} w={275} h={300}/><Paper x={1210} y={580} w={275} h={330} chart/><Paper x={1510} y={600} w={240} h={300}/></g>;
 case 3:return <g><R x={0} y={0} w={1920} h={1080} c="#192e3c"/><R x={245} y={180} w={430} h={660} c="#4c6667"/><R x={750} y={180} w={430} h={660} c="#6b6360"/><R x={1255} y={180} w={430} h={660} c="#507482"/><L x={660} y={480} X={745} Y={480} c={C.gold} sw={14} p={p}/><L x={1180} y={480} X={1250} Y={480} c={C.red} sw={14} p={p}/><Ring x={970} y={510} p={p} r={260}/></g>;
 case 4:return <g><HomeBudget p={p}/><T x={960} y={150} size={54}>家計にはすべてが重なる</T><Ring x={1000} y={530} p={p} r={300} c={C.red}/></g>;
 case 5:return <g><R x={0} y={0} w={1920} h={1080} c="#223846"/><StepGraph p={p} gradual/><T x={960} y={970} size={44}>制度ごとの規則は家計で重なり合う</T></g>;
 default:throw new Error('program_overlap variant '+v);
 }
};

export const renderFranceApartment=(v:number,p:number):React.ReactNode=>{
 switch(v){
 case 0:return <g><RentalStreet p={p}/><Mother x={1470} y={475} s={.72} which="a" pose="walk" p={p}/><T x={960} y={175} size={64}>1990年代　フランス</T></g>;
 case 1:return <g><Realtor p={p}/><Mother x={1170} y={490} s={.66} which="a" pose="read" p={p}/><Paper x={870} y={310} w={330} h={290}/><Coin x={820} y={740} p={p} r={32}/></g>;
 case 2:return <g><R x={0} y={0} w={1920} h={1080} c="#334b55"/><R x={300} y={220} w={1320} h={620} rx={32} c="#688083"/><Letter x={610} y={440} p={p} s={.75}/><Mother x={1320} y={470} s={.72} which="a" pose="reach" p={p}/><Ring x={990} y={515} p={p} r={230} c={C.gold}/></g>;
 case 3:return <g><Realtor/><Paper x={980} y={325} w={380} h={360}/><Mother x={550} y={480} s={.7} which="a" pose="write" p={p}/><T x={1250} y={250} size={48} c={C.ink}>住宅補助を申請</T></g>;
 case 4:return <g><R x={0} y={0} w={1920} h={1080} c="#243944"/><House x={325} y={315} s={1.9}/><Mother x={1370} y={490} s={.78} which="a" pose="walk" p={p}/>{Array.from({length:5},(_,i)=><Coin key={i} x={940+i*80} y={735+(i%2)*30} p={q(p-i*.1)} r={24}/>)}</g>;
 default:throw new Error('france_apartment variant '+v);
 }
};
