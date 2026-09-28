import React from 'react';
import {C,R,L,P,Ring,Person,Vehicle,Paper,Coin,House,School,Hospital,q,lerp} from './primitives';
import {T,Mother,Child,FlatA,FlatB,ApartmentExterior,Nursery,OldCottage,Workhouse,Grocery,Office,MedicaidDesk,Letter,Phone,HomeBudget,StepGraph,PriceTag,SymbolicBoundary,ResearchDesk,Deadline,FormDesk,Construction,Diner} from './welfare-primitives';

export const renderMedicaidProcedural=(v:number,p:number):React.ReactNode=>{
 switch(v){
 case 0:return <g><Office p={p}/><Mother x={490} y={510} s={.7} which="b" pose="call" p={p}/><Phone x={1300} y={425} p={p} calling/><Ring x={1280} y={415} p={p} r={215} c={C.red}/></g>;
 case 1:return <g><Deadline p={p}/><Paper x={260} y={600} w={290} h={250}/><T x={960} y={120} size={56}>提出期限が近づく</T></g>;
 case 2:return <g><R x={0} y={0} w={1920} h={1080} c="#172a34"/><R x={165} y={135} w={1590} h={830} rx={32} c="#304855"/><T x={960} y={230} size={52}>2024年９月公表の集計</T><T x={580} y={535} size={129} c={C.paper}>2,500万＋</T><T x={1450} y={535} size={129} c={C.gold}>69%</T><T x={585} y={670} size={47}>登録終了した人数</T><T x={1450} y={670} size={47}>手続き上の理由</T><L x={1050} y={350} X={1050} Y={770} c={C.red} sw={11} p={p}/></g>;
 case 3:return <g><MedicaidDesk p={p}/><R x={900} y={340} w={320} h={310} c="#8f9b99"/><Paper x={930} y={365} w={260} h={245}/><L x={900} y={700} X={1240} Y={700} c={C.red} sw={15} p={p}/><Person x={470} y={480} s={.65} pose="point" p={p} role="clerk"/></g>;
 case 4:return <g><R x={0} y={0} w={1920} h={1080} c="#1b2c37"/><R x={130} y={145} w={760} h={790} c="#466d68"/><R x={1030} y={145} w={760} h={790} c="#765c56"/><T x={510} y={260} size={51}>受給資格</T><T x={1410} y={260} size={51}>書類手続き</T><Paper x={365} y={390} w={310} h={350}/><Paper x={1255} y={390} w={310} h={350}/><L x={915} y={230} X={915} Y={910} c={C.paper} sw={16}/><Ring x={1410} y={575} p={p} r={210} c={C.red}/></g>;
 default:throw new Error('medicaid_procedural variant '+v);
 }
};

export const renderAdministrativeBurden=(v:number,p:number):React.ReactNode=>{
 switch(v){
 case 0:return <g><FormDesk p={p}/><T x={960} y={125} size={57}>制度を利用するまでの手続き</T><Ring x={1060} y={530} p={p} r={240} c={C.gold}/></g>;
 case 1:return <g><R x={0} y={0} w={1920} h={1080} c="#1d2d36"/><R x={140} y={195} w={1640} h={680} c="#47616a"/><R x={220} y={280} w={420} h={410} c={C.paper}/><R x={750} y={280} w={420} h={410} c={C.paper}/><R x={1280} y={280} w={420} h={410} c={C.paper}/>{['知る','そろえる','提出する'].map((s,i)=><T key={i} x={430+i*530} y={540} c={C.ink} size={52}>{s}</T>)}<L x={655} y={500} X={735} Y={500} c={C.gold} sw={13} p={p}/><L x={1185} y={500} X={1265} Y={500} c={C.gold} sw={13} p={p}/></g>;
 case 2:return <g><R x={0} y={0} w={1920} h={1080} c="#273842"/><R x={0} y={0} w={935} h={1080} c="#5c7a79"/><R x={985} y={0} w={935} h={1080} c="#78605b"/><Mother x={460} y={480} s={.78} which="a" pose="read" p={p}/><Mother x={1450} y={480} s={.78} which="b" pose="call" p={p}/><Paper x={690} y={365} w={200} h={250}/><Ring x={1460} y={505} p={p} r={225}/></g>;
 case 3:return <g><FlatB evening/><Mother x={1090} y={480} s={.73} which="b" pose="sit" p={p}/><Child x={380} y={685} s={.55} p={p}/><R x={530} y={260} w={310} h={220} rx={15} c={C.paper}/><T x={685} y={398} size={44} c={C.ink}>必要な支援</T><L x={860} y={460} X={1050} Y={460} c={C.gold} sw={15} p={p}/></g>;
 case 4:return <g><R x={0} y={0} w={1920} h={1080} c="#1e303e"/><R x={210} y={220} w={540} h={660} rx={30} c="#496b70"/><R x={1170} y={220} w={540} h={660} rx={30} c="#836960"/><T x={480} y={340} size={54}>資格を満たす</T><T x={1440} y={340} size={54}>申請を完了</T><L x={770} y={550} X={1140} Y={550} c={C.red} sw={16} p={p} dash="28 16"/><Ring x={960} y={550} p={p} r={245} c={C.gold}/></g>;
 default:throw new Error('administrative_burden variant '+v);
 }
};

export const renderSupportBenefits=(v:number,p:number):React.ReactNode=>{
 switch(v){
 case 0:return <g><R x={0} y={0} w={1920} h={1080} c="#1b2d38"/><R x={260} y={215} w={1400} h={640} rx={34} c="#54716d"/><Mother x={640} y={500} s={.78} which="a" pose="carry" p={p}/><Child x={1220} y={655} s={.67} p={p}/><Ring x={960} y={530} p={p} r={285} c={C.gold}/></g>;
 case 1:return <g><R x={0} y={0} w={1920} h={1080} c="#a8b5a8"/><R x={0} y={765} w={1920} h={315} c="#81796b"/><R x={210} y={320} w={1490} h={405} c="#bdbdad"/><Mother x={440} y={475} s={.7} which="a" pose="carry" p={p}/><Paper x={980} y={335} w={415} h={350}/><Coin x={1530} y={720} p={p} r={31}/></g>;
 case 2:return <g><Grocery p={p}/><Mother x={820} y={505} s={.72} which="a" pose="carry" p={p}/><Child x={1070} y={640} s={.55} p={p} coat="#b18a5f"/><R x={1200} y={695} w={255} h={108} c="#8d6e55"/><Ring x={1330} y={655} p={p} r={210} c={C.teal}/></g>;
 case 3:return <g><R x={0} y={0} w={1920} h={1080} c="#344a51"/><R x={160} y={140} w={1600} h={755} c="#739494"/><R x={265} y={250} w={550} h={525} c="#c6bda5"/><Child x={480} y={470} s={.72} p={p}/><R x={1040} y={255} w={525} h={525} c="#91a8a5"/><Person x={1340} y={470} s={.71} pose="walk" p={p} role="modern"/><L x={820} y={510} X={1030} Y={510} c={C.gold} sw={17} p={p}/></g>;
 case 4:return <g><R x={0} y={0} w={1920} h={1080} c="#162934"/><R x={195} y={190} w={720} h={700} c="#4e7474"/><R x={1015} y={190} w={720} h={700} c="#7d5d5c"/><T x={560} y={310} size={49}>支援が届く</T><T x={1370} y={310} size={49}>支援から漏れる</T><Mother x={550} y={480} s={.67} which="a" pose="carry" p={p}/><Mother x={1350} y={480} s={.67} which="b" pose="read" p={p}/><Ring x={960} y={510} p={p} r={280}/></g>;
 default:throw new Error('support_benefits variant '+v);
 }
};

export const renderPolicyTradeoffs=(v:number,p:number):React.ReactNode=>{
 switch(v){
 case 0:return <g><StepGraph p={p} gradual/><T x={960} y={940} size={51}>給付を段階的に減らす場合</T></g>;
 case 1:return <g><R x={0} y={0} w={1920} h={1080} c="#233640"/><R x={260} y={220} w={1400} h={650} rx={25} c="#526d6f"/><Paper x={400} y={330} w={440} h={410} chart/><Paper x={1100} y={330} w={440} h={410} chart/><L x={855} y={525} X={1080} Y={525} c={C.gold} sw={17} p={p}/><T x={960} y={170} size={52}>財源と対象の広がり</T></g>;
 case 2:return <g><Construction p={p}/><House x={1440} y={520} s={.55} c="#aaa08c"/><T x={960} y={140} size={49}>住宅補助と住宅供給</T></g>;
 case 3:return <g><R x={0} y={0} w={1920} h={1080} c="#627680"/><R x={0} y={770} w={1920} h={310} c="#6a716c"/><R x={175} y={270} w={610} h={485} c="#a6a295"/><R x={1140} y={270} w={610} h={485} c="#a6a295"/><L x={810} y={520} X={1100} Y={520} c={C.gold} sw={16} p={p}/><Ring x={960} y={520} p={p} r={180} c={C.red}/><T x={960} y={190} size={54}>土地・費用・時間</T></g>;
 case 4:return <g><MedicaidDesk p={p}/><Paper x={710} y={325} w={510} h={420}/><L x={1300} y={530} X={1450} Y={530} c={C.teal} sw={14} p={p}/><T x={960} y={145} size={52}>手続きを簡単にする</T></g>;
 case 5:return <g><R x={0} y={0} w={1920} h={1080} c="#172a37"/>{['支援の効果','財源','対象','周辺への影響'].map((t,i)=><g key={i}><circle cx={405+(i%2)*1090} cy={310+Math.floor(i/2)*480} r="165" fill={[C.teal,C.gold,C.blue,C.red][i]}/><T x={405+(i%2)*1090} y={325+Math.floor(i/2)*480} size={48}>{t}</T></g>)}<L x={560} y={350} X={1325} Y={735} c={C.paper} sw={12} p={p}/><L x={1325} y={350} X={560} Y={735} c={C.paper} sw={12} p={p}/></g>;
 default:throw new Error('policy_tradeoffs variant '+v);
 }
};

export const renderEpilogueTwoRooms=(v:number,p:number):React.ReactNode=>{
 switch(v){
 case 0:return <g><ApartmentExterior p={p}/><R x={410} y={550} w={190} h={115} c="#d6b37d" o={.8}/><R x={1310} y={550} w={190} h={115} c="#d6b37d" o={.8}/><T x={960} y={160} size={56}>同じマンションの夜</T></g>;
 case 1:return <g><FlatA evening/><Mother x={1065} y={485} s={.75} which="a" pose="write" p={p}/><Child x={440} y={645} s={.49} p={p}/><R x={1120} y={605} w={245} h={136} c={C.teal}/><Ring x={1250} y={660} p={p} r={175} c={C.gold}/></g>;
 case 2:return <g><FlatB evening/><Mother x={1030} y={485} s={.74} which="b" pose="write" p={p}/><Phone x={1385} y={455} p={p}/><Paper x={1400} y={665} w={260} h={205}/><Ring x={1470} y={570} p={p} r={205} c={C.red}/></g>;
 case 3:return <g><R x={0} y={0} w={1920} h={1080} c="#213440"/><R x={0} y={0} w={950} h={1080} c="#577d7b"/><R x={970} y={0} w={950} h={1080} c="#795d57"/><Mother x={450} y={475} s={.79} which="a" pose="carry" p={p}/><Mother x={1470} y={475} s={.79} which="b" pose="sit" p={p}/><L x={960} y={190} X={960} Y={930} c={C.paper} sw={20}/><Ring x={960} y={560} p={p} r={305}/></g>;
 case 4:return <g><SymbolicBoundary p={p}/><T x={960} y={180} size={58}>どちらの家庭も支援を必要としている</T></g>;
 default:throw new Error('epilogue_two_rooms variant '+v);
 }
};

export const renderEpilogueThesis=(v:number,p:number):React.ReactNode=>{
 switch(v){
 case 0:return <g><OldCottage night/><g transform="translate(930 110) scale(.5)"><Workhouse inside p={p}/></g><L x={950} y={160} X={950} Y={900} c={C.red} sw={15}/><Person x={450} y={495} s={.7} pose="sit" p={p} role="farmer"/></g>;
 case 1:return <g><StepGraph p={p}/><R x={280} y={840} w={560} h={110} rx={16} c={C.red}/><T x={560} y={915} size={47}>給付の崖</T></g>;
 case 2:return <g><R x={0} y={0} w={1920} h={1080} c="#192d38"/><House x={290} y={300} s={1.45}/><Mother x={1445} y={490} s={.75} which="b" pose="read" p={p}/><L x={800} y={545} X={1260} Y={545} c={C.gold} sw={16} p={p}/><Ring x={1065} y={545} p={p} r={255} c={C.red}/></g>;
 case 3:return <g><FormDesk p={p}/><R x={680} y={200} w={560} h={125} rx={16} c={C.paper}/><T x={960} y={282} size={49} c={C.ink}>書類の向こう側</T><Ring x={1030} y={555} p={p} r={260} c={C.red}/></g>;
 case 4:return <g><R x={0} y={0} w={1920} h={1080} c="#253943"/>{Array.from({length:6},(_,i)=><g key={i}><R x={190+i*255} y={260+(i%2)*90} w={200} h={365} c={i%2?'#68817c':'#9a8675'}/><circle cx={290+i*255} cy={300+(i%2)*90} r="32" fill={C.paper}/></g>)}<L x={250} y={730} X={1660} Y={730} c={C.gold} sw={12} p={p}/></g>;
 case 5:return <g><SymbolicBoundary p={p}/><R x={250} y={225} w={550} h={145} c={C.teal}/><R x={1125} y={225} w={550} h={145} c={C.red}/><T x={525} y={318} size={49}>誰かを救う</T><T x={1400} y={318} size={49}>別の誰かが外れる</T></g>;
 case 6:return <g><R x={0} y={0} w={1920} h={1080} c="#0d1822"/><L x={960} y={135} X={960} Y={955} c={C.gold} sw={18} p={p}/><Mother x={550} y={490} s={.77} which="a" pose="reach" p={p}/><Mother x={1380} y={490} s={.77} which="b" pose="reach" p={1-p}/><T x={960} y={155} size={54}>その線の外側にも、支援が必要な人がいる</T></g>;
 default:throw new Error('epilogue_thesis variant '+v);
 }
};
