import React from 'react';
import {C,R,L,P,Ring,Person,Vehicle,Paper,Coin,House,Factory,q,lerp} from './primitives';
import {T,Mother,Child,FlatA,FlatB,Office,RentalStreet,Realtor,Diner,SickHome,MedicaidDesk,Letter,Phone,HomeBudget,StepGraph,PriceTag,FlowCoins,SupplyMap,SymbolicBoundary,ResearchDesk,Deadline,FormDesk,Construction} from './welfare-primitives';

export const renderLandlordDecision=(v:number,p:number):React.ReactNode=>{
 switch(v){
 case 0:return <g><Realtor p={p}/><Person x={495} y={485} s={.77} role="merchant" pose="point" p={p}/><Person x={1520} y={485} s={.77} role="clerk" pose="read" p={p}/><Paper x={980} y={570} w={330} h={240}/></g>;
 case 1:return <g><R x={0} y={0} w={1920} h={1080} c="#233640"/><R x={185} y={140} w={1550} h={810} c="#46636b"/><House x={365} y={325} s={1.3}/><PriceTag x={1250} y={395} price="€ 650" p={p}/><L x={850} y={670} X={1330} Y={670} c={C.gold} sw={15} p={p}/></g>;
 case 2:return <g><SupplyMap p={p}/>{Array.from({length:7},(_,i)=><circle key={i} cx={530+i*155} cy={710-(i%3)*80} r={26} fill={C.paper} opacity={q(p-i*.085)}/>)}<Ring x={970} y={555} p={p} r={285} c={C.red}/></g>;
 case 3:return <g><Realtor/><g transform={'translate(0 '+lerp(120,0,p)+')'}><PriceTag x={935} y={485} price="€ 850" p={p}/></g><Person x={1550} y={490} s={.68} pose="write" p={p} role="clerk"/><Ring x={960} y={485} p={p} r={230} c={C.gold}/></g>;
 case 4:return <g><FlowCoins p={p}/><L x={680} y={705} X={1230} Y={705} c={C.gold} sw={13} p={p}/><T x={960} y={175} size={49}>補助の利益が家賃へ移る場合</T></g>;
 default:throw new Error('landlord_decision variant '+v);
 }
};

export const renderFackAnalysis=(v:number,p:number):React.ReactNode=>{
 switch(v){
 case 0:return <g><ResearchDesk p={p}/><T x={960} y={135} size={56}>フランスの住宅補助改革</T><Paper x={1110} y={290} w={410} h={360} chart/><Ring x={1190} y={500} p={p} r={190}/></g>;
 case 1:return <g><R x={0} y={0} w={1920} h={1080} c="#182b35"/><T x={960} y={170} size={57}>補助１ユーロの帰着</T><R x={290} y={325} w={lerp(100,1010,p)} h={270} rx={15} c={C.red}/><R x={1300} y={325} w={lerp(10,280,p)} h={270} rx={15} c={C.teal}/><T x={790} y={485} size={96}>78¢</T><T x={1440} y={485} size={88}>22¢</T><T x={790} y={660} size={48}>家賃上昇</T><T x={1440} y={660} size={48}>家計に残る部分</T></g>;
 case 2:return <g><R x={0} y={0} w={1920} h={1080} c="#273b42"/><circle cx={520} cy={520} r="175" fill={C.gold}/><T x={520} y={548} size={112}>€1</T><L x={720} y={520} X={lerp(720,1400,p)} Y={520} c={C.red} sw={22}/><R x={1350} y={355} w={390} h={370} rx={27} c="#746457"/><House x={1390} y={425} s={.85}/><Ring x={1490} y={500} p={p} r={200}/></g>;
 case 3:return <g><R x={0} y={0} w={1920} h={1080} c="#8a9da5"/><R x={0} y={760} w={1920} h={320} c="#777d76"/>{Array.from({length:4},(_,i)=><House key={i} x={155+i*420} y={360+(i%2)*55} s={1.12} c={i%2?'#a3937f':'#8a8577'}/>)}<Ring x={960} y={480} p={p} r={350} c={C.red}/><T x={960} y={170} size={56}>住宅の供給は急に増えない</T></g>;
 case 4:return <g><R x={0} y={0} w={1920} h={1080} c="#20343f"/><R x={125} y={190} w={770} h={700} c="#5a6f70"/><R x={1025} y={190} w={770} h={700} c="#6d6459"/><House x={345} y={435} s={1.18}/><House x={1205} y={435} s={1.18} c="#a38a75"/><L x={940} y={195} X={940} Y={885} c={C.paper} sw={13}/><T x={960} y={135} size={47}>研究結果は地域と時期に依存する</T></g>;
 default:throw new Error('fack_analysis variant '+v);
 }
};

export const renderRentalOutsider=(v:number,p:number):React.ReactNode=>{
 switch(v){
 case 0:return <g><Realtor p={p}/><Mother x={1310} y={480} s={.71} which="a" pose="read" p={p}/><PriceTag x={790} y={540} price="€ 850" p={p}/><Coin x={1145} y={775} p={p} r={36}/></g>;
 case 1:return <g><R x={0} y={0} w={1920} h={1080} c="#374651"/><R x={240} y={160} w={1450} h={745} rx={23} c="#a4b0ae"/><Person x={490} y={445} s={.82} pose="read" p={p} role="modern"/><Paper x={1060} y={255} w={420} h={450} chart/><R x={1110} y={715} w={330} h={110} c={C.red}/><T x={1275} y={787} size={49}>対象外</T></g>;
 case 2:return <g><Realtor/><Person x={475} y={490} s={.79} pose="point" p={p} role="modern"/><PriceTag x={1300} y={415} price="€ 980" p={p}/><Ring x={1330} y={480} p={p} r={240} c={C.red}/></g>;
 case 3:return <g><RentalStreet p={p}/><Person x={420} y={470} s={.69} pose="walk" p={p} role="modern"/><Vehicle x={1510} y={850} p={p} kind="bus"/><L x={490} y={780} X={1490} Y={780} c={C.gold} sw={11} p={p} dash="40 15"/></g>;
 case 4:return <g><SymbolicBoundary p={p}/><R x={210} y={185} w={670} h={110} c={C.teal}/><T x={545} y={258} size={46}>補助を利用</T><R x={1060} y={185} w={670} h={110} c={C.red}/><T x={1395} y={258} size={46}>補助を利用できない</T><Ring x={960} y={570} p={p} r={310}/></g>;
 default:throw new Error('rental_outsider variant '+v);
 }
};

export const renderMarketSpillover=(v:number,p:number):React.ReactNode=>{
 switch(v){
 case 0:return <g><Construction p={p}/><T x={960} y={140} size={56}>新しい住宅を供給する</T></g>;
 case 1:return <g><RentalStreet p={p}/><R x={1060} y={140} w={650} h={180} rx={18} c={C.paper}/><T x={1385} y={250} size={49} c={C.ink}>建設には時間が必要</T><Ring x={1350} y={480} p={p} r={240} c={C.gold}/></g>;
 case 2:return <g><SupplyMap p={p}/>{Array.from({length:7},(_,i)=><Ring key={i} x={320+i*215} y={760-(i%3)*70} p={q(p-i*.1)} r={85} c={i%2?C.red:C.gold}/>)}</g>;
 case 3:return <g><R x={0} y={0} w={1920} h={1080} c="#1b2d37"/><R x={200} y={210} w={610} h={570} c="#5d7779"/><R x={1100} y={210} w={610} h={570} c="#987967"/>{Array.from({length:8},(_,i)=><circle key={i} cx={300+(i%4)*130} cy={330+Math.floor(i/4)*190} r="42" fill={C.paper}/>)}{Array.from({length:3},(_,i)=><House key={i} x={1140+i*185} y={450} s={.56}/>)}<L x={830} y={500} X={1080} Y={500} c={C.red} sw={14} p={p}/><T x={505} y={185} size={43}>需要</T><T x={1405} y={185} size={43}>住宅供給</T></g>;
 case 4:return <g><R x={0} y={0} w={1920} h={1080} c="#2a3740"/><Paper x={250} y={170} w={600} h={660}/><Paper x={1050} y={170} w={600} h={660} chart/><L x={870} y={510} X={1030} Y={510} c={C.gold} sw={16} p={p}/><T x={960} y={950} size={50}>制度と市場を一緒に見る</T></g>;
 default:throw new Error('market_spillover variant '+v);
 }
};

export const renderWorkingFamily=(v:number,p:number):React.ReactNode=>{
 switch(v){
 case 0:return <g><R x={0} y={0} w={1920} h={1080} c="#1a2c37"/><T x={960} y={165} size={64}>1990年代以降の就労支援</T><Paper x={480} y={300} w={420} h={460} chart/><Paper x={1060} y={300} w={420} h={460}/><Ring x={960} y={520} p={p} r={225}/></g>;
 case 1:return <g><Diner p={p}/><Mother x={1130} y={510} s={.71} which="a" pose="walk" p={p}/><R x={940} y={665} w={155} h={95} c={C.paper}/><Coin x={925} y={760} p={p} r={26}/></g>;
 case 2:return <g><FlatA evening/><Mother x={1070} y={475} s={.71} which="a" pose="read" p={p}/><Child x={450} y={660} s={.51} p={p}/><Paper x={1220} y={600} w={330} h={275} chart/><Ring x={1370} y={660} p={p} r={215} c={C.teal}/></g>;
 case 3:return <g><ResearchDesk p={p}/><R x={1110} y={300} w={465} h={360} c={C.paper}/><L x={1160} y={600} X={1480} Y={365} c={C.teal} sw={15} p={p}/><T x={960} y={900} size={49}>子ども向け支援の対象を比較</T></g>;
 case 4:return <g><R x={0} y={0} w={1920} h={1080} c="#233642"/><R x={175} y={200} w={690} h={660} c="#5b7970"/><R x={1080} y={200} w={690} h={660} c="#79665c"/><Mother x={510} y={475} s={.74} which="a" pose="carry" p={p}/><Mother x={1430} y={475} s={.74} which="b" pose="sit" p={p}/><L x={950} y={245} X={950} Y={850} c={C.paper} sw={15} p={p}/></g>;
 default:throw new Error('working_family variant '+v);
 }
};

export const renderUnableToWork=(v:number,p:number):React.ReactNode=>{
 switch(v){
 case 0:return <g><SickHome p={p}/><Mother x={1340} y={460} s={.65} which="b" pose="sit" p={p}/><Paper x={1140} y={655} w={250} h={180}/></g>;
 case 1:return <g><R x={0} y={0} w={1920} h={1080} c="#6a797a"/><R x={140} y={160} w={1630} h={690} c="#a9b4ad"/><Mother x={530} y={500} s={.79} which="b" pose="reach" p={p}/><Person x={1380} y={510} s={.68} role="modern" pose="sit" p={p}/><L x={690} y={625} X={1160} Y={625} c={C.gold} sw={12} p={p}/></g>;
 case 2:return <g><R x={0} y={0} w={1920} h={1080} c="#172a34"/><R x={250} y={180} w={1420} h={720} rx={25} c="#44606a"/><T x={960} y={280} size={58}>勤労所得が受給条件</T><R x={395} y={425} w={390} h={310} c={C.teal}/><R x={1140} y={425} w={390} h={310} c={C.red}/><L x={820} y={585} X={1100} Y={585} c={C.gold} sw={18} p={p}/></g>;
 case 3:return <g><R x={0} y={0} w={1920} h={1080} c="#1e2e39"/><R x={0} y={0} w={940} h={1080} c="#526c6a"/><R x={980} y={0} w={940} h={1080} c="#6b605b"/><Mother x={510} y={475} s={.78} which="a" pose="walk" p={p}/><Mother x={1400} y={475} s={.78} which="b" pose="sit" p={p}/><T x={470} y={165} size={44}>仕事のある家庭</T><T x={1450} y={165} size={44}>働くことが難しい家庭</T><L x={960} y={230} X={960} Y={890} c={C.paper} sw={15}/></g>;
 case 4:return <g><SymbolicBoundary p={p}/><R x={270} y={215} w={505} h={120} c="#6da69c"/><R x={1150} y={215} w={505} h={120} c="#a77565"/><T x={520} y={296}>制度の想定内</T><T x={1400} y={296}>条件から外れる</T></g>;
 default:throw new Error('unable_to_work variant '+v);
 }
};

export const renderMedicaidEnvelopes=(v:number,p:number):React.ReactNode=>{
 switch(v){
 case 0:return <g><MedicaidDesk p={p}/><Paper x={715} y={340} w={350} h={350}/><T x={960} y={135} size={56}>2023年　資格の再確認</T></g>;
 case 1:return <g><R x={0} y={0} w={1920} h={1080} c="#283b45"/><R x={180} y={180} w={1560} h={730} c="#5a737b"/>{Array.from({length:7},(_,i)=><g key={i} transform={'translate('+(225+i*205)+' '+lerp(-110,0,q(p-i*.075))+')'}><Paper x={0} y={250} w={175} h={270}/></g>)}<T x={960} y={900} size={49}>世帯へ更新通知が届く</T></g>;
 case 2:return <g><FlatB evening/><Mother x={1050} y={485} s={.7} which="b" pose="read" p={p}/><Paper x={720} y={620} w={230} h={220}/><Paper x={1220} y={610} w={230} h={240}/><Letter x={1475} y={550} p={p} approved={false} s={.46}/></g>;
 case 3:return <g><FormDesk p={p}/><R x={870} y={700} w={370} h={115} c={C.red}/><T x={1055} y={774} size={50}>不足書類</T><Ring x={1040} y={560} p={p} r={245} c={C.gold}/></g>;
 case 4:return <g><Office night p={p}/><Mother x={540} y={505} s={.68} which="b" pose="call" p={p}/><Phone x={1230} y={400} p={p} calling/><R x={1440} y={310} w={280} h={190} c={C.paper}/><T x={1580} y={420} size={46} c={C.ink}>勤務時間</T></g>;
 default:throw new Error('medicaid_envelopes variant '+v);
 }
};
