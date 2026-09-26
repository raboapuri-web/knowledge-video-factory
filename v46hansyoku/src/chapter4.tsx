import React from 'react';
import {AbsoluteFill,Img,staticFile,useCurrentFrame} from 'remotion';
import {V46_ADULT_MAN_RIG} from '../../shared/asset-library/人物テンプレート/V46_ADULT_MAN_RIG';
import {OfficeWomanRig} from '../../shared/asset-library/人物テンプレート/office-woman-rig';
import {ParentFatherRig} from '../../shared/asset-library/人物テンプレート/PARENT_FATHER';
import {ParentMotherRig} from '../../shared/asset-library/人物テンプレート/PARENT_MOTHER';
import {V46_CHILD_RIG_BOY} from '../../shared/asset-library/人物テンプレート/V46_CHILD_RIG_BOY';
import {V46_CHILD_RIG_GIRL} from '../../shared/asset-library/人物テンプレート/V46_CHILD_RIG_GIRL';

const A=(p:string)=>staticFile('assets/library/'+p.replace('shared/asset-library/',''));
const clamp=(n:number)=>Math.max(0,Math.min(1,n));
const ph=(t:number,a:number,b:number)=>clamp((t-a)/(b-a));
const ease=(t:number)=>t*t*(3-2*t);

const FixedBg=({path,shade=.15}:{path:string;shade?:number})=><AbsoluteFill style={{background:'#070a0e',overflow:'hidden'}}>
 <Img src={A(path)} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
 <AbsoluteFill style={{background:'linear-gradient(180deg,rgba(4,7,11,'+shade+'),rgba(4,7,11,'+(shade+.18)+'))'}}/>
</AbsoluteFill>;
const Office=()=> <FixedBg path="shared/asset-library/背景/BG_office.png"/>;
const OfficePeer=()=> <FixedBg path="shared/asset-library/背景/BG_V46_PEER_COMPANY_OFFICE.png"/>;
const Workspace=()=> <FixedBg path="shared/asset-library/背景/BG_V46_PEER_COMPANY_WORKSPACE.png"/>;
const Home=()=> <FixedBg path="shared/asset-library/背景/BG_V46_PEER_LIVING_ROOM.png" shade={.08}/>;
const Room=()=> <FixedBg path="shared/asset-library/背景/BG_ROOM_DAY.png" shade={.08}/>;
const NightRoom=()=> <FixedBg path="shared/asset-library/背景/BG_oneroom_night.png" shade={.09}/>;
const City=()=> <FixedBg path="shared/asset-library/背景/BG_TOWN_DAY_WIDE.png" shade={.09}/>;
const Town=()=> <FixedBg path="shared/asset-library/背景/BG_town.png" shade={.1}/>;
const SchoolBg=()=> <FixedBg path="shared/asset-library/背景/BG_school.png" shade={.09}/>;
const HospitalBg=()=> <FixedBg path="shared/asset-library/背景/BG_hospital.png" shade={.09}/>;
const RuralHome=()=> <FixedBg path="shared/asset-library/背景/BG_V46_CH1_RURAL_HOME.png" shade={.08}/>;
const RuralField=()=> <FixedBg path="shared/asset-library/背景/BG_V46_CH1_RURAL_FIELD.png" shade={.08}/>;

const Man=({x=760,y=320,s=.7,walk=false,brief=false,think=false}:{x?:number;y?:number;s?:number;walk?:boolean;brief?:boolean;think?:boolean})=><V46_ADULT_MAN_RIG x={x} y={y} scale={s} tieVisible={false} showBriefcase={brief} action={walk?'walk':'idle'} pose={think?{rightShoulder:-45,rightElbow:-88,headTilt:-8}:{}}/>;
const Woman=({x=760,y=320,s=.7,walk=false}:{x?:number;y?:number;s?:number;walk?:boolean})=><OfficeWomanRig x={x} y={y} scale={s} action={walk?'walk':'idle'} suitColor="#675667" pantsColor="#454451" shirtColor="#eee4d5" hairColor="#362f35"/>;

const Person=({x,y,s=1,o=1}:{x:number;y:number;s?:number;o?:number})=><svg viewBox="0 0 100 165" style={{position:'absolute',left:x,top:y,width:100*s,height:165*s,opacity:o}}><circle cx="50" cy="33" r="26" fill="#e6ddca"/><path d="M16 160V98q0-38 34-38t34 38v62z" fill="#70808e"/></svg>;
const Family=({x,y,s=1}:{x:number;y:number;s?:number})=><div style={{position:'absolute',left:x,top:y,width:520,height:650,transform:'scale('+s+')',transformOrigin:'top left'}}><ParentFatherRig x={0} y={0} scale={.68}/><ParentMotherRig x={160} y={7} scale={.67}/><V46_CHILD_RIG_BOY x={315} y={140} scale={.46}/></div>;

const Money=({x,y,s=1}:{x:number;y:number;s?:number})=><svg viewBox="0 0 120 120" style={{position:'absolute',left:x,top:y,width:120*s,height:120*s}}><circle cx="60" cy="60" r="48" fill="#526d59" stroke="#d8c58b" strokeWidth="7"/><path d="M35 40h50M35 62h50M60 27v66" stroke="#efe3b4" strokeWidth="9"/></svg>;
const Clock=({x,y,s=1,rot=0}:{x:number;y:number;s?:number;rot?:number})=><svg viewBox="0 0 120 120" style={{position:'absolute',left:x,top:y,width:120*s,height:120*s}}><circle cx="60" cy="60" r="50" fill="#17202a" stroke="#d8c58b" strokeWidth="8"/><path d="M60 60V28M60 60l27 16" stroke="#eee0ae" strokeWidth="8" strokeLinecap="round" transform={'rotate('+rot+' 60 60)'}/></svg>;
const House=({x,y,s=1}:{x:number;y:number;s?:number})=><svg viewBox="0 0 180 150" style={{position:'absolute',left:x,top:y,width:180*s,height:150*s}}><path d="M15 72 90 15l75 57v70H15z" fill="#68798a" stroke="#d4c28b" strokeWidth="6"/><rect x="74" y="88" width="34" height="54" fill="#eee3c8"/></svg>;
const School=({x,y,s=1}:{x:number;y:number;s?:number})=><svg viewBox="0 0 200 150" style={{position:'absolute',left:x,top:y,width:200*s,height:150*s}}><rect x="25" y="48" width="150" height="90" fill="#788795" stroke="#d4c28b" strokeWidth="6"/><path d="M15 50 100 12l85 38" fill="#c4af75"/><rect x="88" y="94" width="25" height="44" fill="#efe3c8"/></svg>;
const Heart=({x,y,s=1}:{x:number;y:number;s?:number})=><svg viewBox="0 0 120 110" style={{position:'absolute',left:x,top:y,width:120*s,height:110*s}}><path d="M60 100 12 51Q0 15 31 12q19-2 29 18 10-20 29-18 31 3 19 39z" fill="#b86d73"/></svg>;

const Arrow=({x1,y1,x2,y2,o=.85,w=8}:{x1:number;y1:number;x2:number;y2:number;o?:number;w?:number})=><svg viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}}><defs><marker id="c4arr" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto"><path d="M0 0L12 6 0 12z" fill="#d8c486"/></marker></defs><path d={'M'+x1+' '+y1+' L'+x2+' '+y2} stroke="#d8c486" strokeWidth={w} opacity={o} markerEnd="url(#c4arr)"/></svg>;
const Card=({x,y,w=240,h=150,o=1,children}:{x:number;y:number;w?:number;h?:number;o?:number;children?:React.ReactNode})=><div style={{position:'absolute',left:x,top:y,width:w,height:h,borderRadius:22,background:'rgba(15,22,30,.9)',border:'5px solid #c8b67c',boxShadow:'0 18px 42px #0008',opacity:o}}>{children}</div>;
const Bar=({x,y,w=500,h=40,p=.5}:{x:number;y:number;w?:number;h?:number;p?:number})=><div style={{position:'absolute',left:x,top:y,width:w,height:h,borderRadius:h/2,background:'#222b34',border:'5px solid #7b858d'}}><div style={{height:'100%',width:(Math.max(0,Math.min(1,p))*100)+'%',borderRadius:h/2,background:'linear-gradient(90deg,#6d8a72,#d6bf7d)'}}/></div>;

const Workers=({t,count=20,office=true}:{t:number;count?:number;office?:boolean})=><>{Array.from({length:count},(_,i)=>{const q=ease(ph(t,.01+i*.012,.18+i*.012));return <Person key={i} x={80+(i%8)*225} y={110+Math.floor(i/8)*220} s={office?.5:.46} o={q}/>})}</>;

const Conveyor=({t}:{t:number})=><><div style={{position:'absolute',left:130,top:720,width:1660,height:120,borderRadius:30,background:'#232a31',border:'7px solid #7c7468'}}/><div style={{position:'absolute',left:160,top:765,width:1600,height:24,background:'repeating-linear-gradient(90deg,#d1bd7d 0 55px,#59616a 55px 110px)',backgroundPositionX:-t*560}}/>{[0,1,2,3,4].map(i=><Card key={i} x={220+i*300} y={520-(i%2)*65} w={190} h={110}><div style={{position:'absolute',inset:24,background:i%2?'#68798a':'#6b846f',borderRadius:12}}/></Card>)}</>;
const MoneyCycle=({t}:{t:number})=><svg viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}}><circle cx="960" cy="520" r="300" fill="none" stroke="#d3bd7b" strokeWidth="18" strokeDasharray="42 24" strokeDashoffset={-t*240}/><path d="M960 220 1000 275 920 275z" fill="#d3bd7b"/><path d="M1260 520 1205 560 1205 480z" fill="#d3bd7b"/><path d="M960 820 920 765 1000 765z" fill="#d3bd7b"/><path d="M660 520 715 480 715 560z" fill="#d3bd7b"/></svg>;

const Crown=({t,opacity=.9}:{t:number;opacity?:number})=><svg viewBox="0 0 700 520" style={{position:'absolute',left:610,top:110,width:700,height:520,opacity,filter:'drop-shadow(0 18px 30px #000a)',transform:'rotate('+(Math.sin(t*6)*1.8)+'deg)'}}><path d="M50 410 25 95l185 145L350 45l140 195L675 95l-25 315z" fill="rgba(48,55,64,.86)" stroke="#d4c17f" strokeWidth="13"/><circle cx="200" cy="315" r="30" fill="#6a846e"/><circle cx="350" cy="260" r="30" fill="#9a6f65"/><circle cx="500" cy="315" r="30" fill="#6f8191"/></svg>;

const Split=({left,right}:{left:React.ReactNode;right:React.ReactNode})=><><div style={{position:'absolute',left:0,top:0,width:955,height:1080,overflow:'hidden'}}>{left}</div><div style={{position:'absolute',left:965,top:0,width:955,height:1080,overflow:'hidden'}}>{right}</div><div style={{position:'absolute',left:955,top:0,width:10,height:1080,background:'#d8c486'}}/></>;

const Scale=({t}:{t:number})=><svg viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}}><path d="M960 250V820M520 420H1400" stroke="#d6c186" strokeWidth="24"/><path d="M520 420 360 690M520 420 680 690M1400 420 1240 690M1400 420 1560 690" stroke="#d6c186" strokeWidth="12"/><path d="M300 690H740M1180 690H1620" stroke="#d6c186" strokeWidth="18"/><g transform={'translate(0 '+(25*Math.sin(t*5))+')'}><circle cx="410" cy="630" r="42" fill="#8aa2b4"/><circle cx="510" cy="630" r="42" fill="#8aa2b4"/><circle cx="610" cy="630" r="42" fill="#8aa2b4"/></g><g transform={'translate(0 '+(-25*Math.sin(t*5))+')'}><circle cx="1340" cy="630" r="42" fill="#d1b975"/><circle cx="1440" cy="630" r="42" fill="#d1b975"/></g></svg>;

const Road=({t}:{t:number})=><svg viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}}><path d="M960 1080V650" stroke="#6a655b" strokeWidth="180"/><path d="M960 650 C830 520 610 390 280 230" stroke="#6f7c6f" strokeWidth="165" fill="none"/><path d="M960 650 C1120 500 1410 410 1690 270" stroke="#4b5056" strokeWidth="95" fill="none"/><circle cx="960" cy="650" r={50+8*Math.sin(t*8)} fill="#d4c17f"/></svg>;

const VillagePeople=({t}:{t:number})=><>{Array.from({length:7},(_,i)=><Person key={i} x={180+(i%4)*390} y={230+Math.floor(i/4)*350} s={.65-(i%3)*.05} o={ease(ph(t,.04+i*.06,.3+i*.06))}/>)}</>;

const CareNetwork=({t}:{t:number})=><>{[
 ['shared/asset-library/背景/BG_school.png',130,140],
 ['shared/asset-library/背景/BG_hospital.png',620,100],
 ['shared/asset-library/背景/BG_supermarket.png',1120,120],
 ['shared/asset-library/背景/BG_V46_PEER_COMPANY_WORKSPACE.png',350,650],
 ['shared/asset-library/背景/BG_densha.png',950,670]
].map((a,i)=>{const q=ease(ph(t,.05+i*.08,.32+i*.08));return <React.Fragment key={String(a[0])}><Card x={Number(a[1])} y={Number(a[2])} w={330} h={200} o={q}><Img src={A(String(a[0]))} style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:16}}/></Card><Arrow x1={Number(a[1])+165} y1={Number(a[2])+100} x2={1540} y2={530} o={q*.75} w={5}/></React.Fragment>})}<Family x={1450} y={350} s={.55}/></>;

const ChildCenter=({t}:{t:number})=><><V46_CHILD_RIG_GIRL x={820} y={430} scale={.72}/>{Array.from({length:8},(_,i)=>{const a=i/8*Math.PI*2;return <Person key={i} x={900+Math.cos(a)*560} y={470+Math.sin(a)*300} s={.5} o={ease(ph(t,.03+i*.05,.27+i*.05))}/>})}</>;

export const Chapter4Scene=({scene,index,frames}:{scene:any;index:number;frames:number})=>{
 const frame=useCurrentFrame();
 const t=frames<=1?0:frame/(frames-1);
 const q=ease(ph(t,.04,.82));
 const q2=ease(ph(t,.48,.95));
 switch(index){
  case 0:return <AbsoluteFill><OfficePeer/><Workers t={t} count={24}/><div style={{position:'absolute',left:135,top:120,width:1650,height:12,background:'#d4c17f',transform:'scaleX('+q+')',transformOrigin:'left'}}/></AbsoluteFill>;
  case 1:return <AbsoluteFill><OfficePeer/><Man x={120+550*q} y={360} s={.55} walk brief/><Woman x={620+390*q2} y={360} s={.55} walk/><Conveyor t={t}/></AbsoluteFill>;
  case 2:return <AbsoluteFill><OfficePeer/><MoneyCycle t={t}/><Money x={900} y={410} s={1.4}/><Workers t={t} count={15}/></AbsoluteFill>;
  case 3:return <AbsoluteFill><Home/><Man x={260} y={350} s={.72}/><Family x={1180} y={330} s={.58}/><House x={820} y={200} s={1.2}/><Bar x={690} y={720} w={760} p={q}/></AbsoluteFill>;
  case 4:return <AbsoluteFill><Office/><Man x={260} y={360} s={.68}/><Money x={920} y={180} s={1.15}/><House x={1180} y={200}/><Bar x={860} y={580} w={720} p={.9-.65*q}/><Bar x={860} y={690} w={720} p={.18+.12*q}/></AbsoluteFill>;
  case 5:return <AbsoluteFill><Office/><Man x={320} y={350} s={.72}/><div style={{position:'absolute',left:890,top:150,width:160,height:620,background:'#28333c'}}/><div style={{position:'absolute',left:880,top:500-310*q,width:180,height:40,background:'#d3bd7b'}}/><Clock x={1320} y={180} s={1.25} rot={t*280}/></AbsoluteFill>;
  case 6:return <AbsoluteFill><Office/><Man x={340} y={350} s={.72} think/><Clock x={1220} y={210} s={1.35} rot={t*420}/><div style={{position:'absolute',left:1010,top:740,width:570,height:35,background:'#9a625d',transform:'scaleX('+q+')',transformOrigin:'left'}}/></AbsoluteFill>;
  case 7:return <AbsoluteFill><Office/><Split left={<><Clock x={260} y={240} s={1.5} rot={t*360}/><Man x={300} y={470} s={.55}/><Bar x={200} y={800} w={550} p={q}/></>} right={<><Heart x={250} y={230} s={1.5}/><Family x={330} y={470} s={.48}/><Bar x={190} y={800} w={550} p={1-q}/></>}/></AbsoluteFill>;
  case 8:return <AbsoluteFill><Office/><Woman x={320} y={340} s={.72}/><div style={{position:'absolute',left:880,top:170,width:330,height:560,border:'8px solid #d3bd7b',borderRadius:24}}/><div style={{position:'absolute',left:1290,top:170,width:330,height:560,border:'8px solid #8594a0',borderRadius:24}}/><V46_CHILD_RIG_GIRL x={1365} y={420} scale={.48}/><Arrow x1={700} y1={500} x2={950} y2={460}/><Arrow x1={700} y1={500} x2={1350} y2={460} o={.55}/></AbsoluteFill>;
  case 9:return <AbsoluteFill><Office/><Man x={330} y={350} s={.7}/><Card x={900} y={170} w={280} h={190}><Clock x={80} y={30} s={.9}/></Card><Card x={1280} y={400} w={280} h={190}><Heart x={85} y={35} s={.9}/></Card><div style={{position:'absolute',left:850,top:750,width:760,height:26,background:'#6d866f'}}/></AbsoluteFill>;
  case 10:return <AbsoluteFill><Office/><Man x={300} y={350} s={.62}/><Woman x={760} y={350} s={.62}/><Man x={1220} y={350} s={.62}/><div style={{position:'absolute',left:220,top:780,width:1350,height:22,background:'#d4c17f',transform:'scaleX('+(1-.4*q)+')'}}/></AbsoluteFill>;
  case 11:return <AbsoluteFill><Office/><Workers t={t} count={24}/><div style={{position:'absolute',left:620,top:210,width:680,height:520,border:'12px solid #9c605b',borderRadius:36,opacity:q}}/><div style={{position:'absolute',left:700,top:290,width:520,height:360,background:'rgba(9,13,18,.82)',borderRadius:24}}/></AbsoluteFill>;
  case 12:return <AbsoluteFill><OfficePeer/><Split left={<><Family x={250} y={350} s={.54}/><Workers t={t} count={8}/></>} right={<><Workers t={t} count={16}/><Man x={320} y={430} s={.54}/></>}/><Conveyor t={t}/></AbsoluteFill>;
  case 13:return <AbsoluteFill><Room/><Man x={720} y={330} s={.74}/><Crown t={t} opacity={.2}/><div style={{position:'absolute',left:665,top:230,width:590,height:590,border:'10px solid #9c605b',borderRadius:'50%',opacity:q}}/></AbsoluteFill>;
  case 14:return <AbsoluteFill><Room/><Man x={330} y={350} s={.7}/><Money x={950} y={190} s={1.1}/><Clock x={1220} y={190} s={1.1}/><House x={1440} y={200} s={1.05}/>{[0,1,2].map(i=><Arrow key={i} x1={760} y1={520} x2={1010+i*250} y2={330} o={q}/>)}</AbsoluteFill>;
  case 15:return <AbsoluteFill><Room/><Workers t={t} count={20}/><Family x={1330} y={330} s={.52}/><Arrow x1={650} y1={520} x2={1330} y2={520} o={.45}/></AbsoluteFill>;
  case 16:return <AbsoluteFill style={{background:'#080c11'}}><Crown t={t}/><div style={{position:'absolute',left:0,right:0,top:0,bottom:0,background:'radial-gradient(circle at 50% 50%,rgba(214,193,127,.12),transparent 60%)'}}/><div style={{position:'absolute',left:790,top:700,width:340,height:18,background:'#79848d'}}/></AbsoluteFill>;
  case 17:return <AbsoluteFill><Office/><MoneyCycle t={t}/><Clock x={300} y={180} s={1.2} rot={t*260}/><Man x={780} y={350} s={.66}/><Bar x={1140} y={300} w={460} p={q}/></AbsoluteFill>;
  case 18:return <AbsoluteFill><Office/><Conveyor t={t}/>{Array.from({length:6},(_,i)=><Card key={i} x={170+i*270} y={170+(i%2)*120} w={210} h={120}><div style={{position:'absolute',inset:25,background:'#6f7f8d',borderRadius:12}}/></Card>)}</AbsoluteFill>;
  case 19:return <AbsoluteFill><Office/><Man x={320} y={350} s={.7}/><Clock x={1020} y={180} s={1.3} rot={t*330}/><Family x={1260} y={360} s={.46}/><Bar x={980} y={760} w={650} p={1-q}/></AbsoluteFill>;
  case 20:return <AbsoluteFill><City/><Workers t={t} count={28}/>{Array.from({length:5},(_,i)=><House key={i} x={230+i*310} y={190-(i%2)*40} s={.8}/>) }<Bar x={560} y={800} w={800} p={q}/></AbsoluteFill>;
  case 21:return <AbsoluteFill><City/>{Array.from({length:6},(_,i)=><div key={i} style={{position:'absolute',left:220+i*240,top:780-i*105,width:220,height:125,background:'#647687',border:'7px solid #d0bd83'}}><House x={35} y={-95} s={.7}/></div>)}<Man x={260+1050*q} y={660-480*q} s={.45} walk/></AbsoluteFill>;
  case 22:return <AbsoluteFill><SchoolBg/><Family x={250} y={360} s={.5}/><Family x={1250} y={360} s={.5}/>{Array.from({length:7},(_,i)=><React.Fragment key={i}><School x={640+i*115} y={180+55*Math.sin(i)} s={.55}/><Arrow x1={650+i*115} y1={390} x2={1210} y2={480} o={ease(ph(t,.05+i*.06,.35+i*.06))} w={5}/></React.Fragment>)}</AbsoluteFill>;
  case 23:return <AbsoluteFill><Office/><Split left={<><Family x={210} y={360} s={.52}/><School x={620} y={230} s={.9}/></>} right={<><Man x={250} y={400} s={.58}/><Woman x={520} y={400} s={.58}/></>}/>{Array.from({length:6},(_,i)=><Arrow key={i} x1={230+i*280} y1={140} x2={i<3?560:1360} y2={530} o={ease(ph(t,.03+i*.06,.35+i*.06))}/>)}</AbsoluteFill>;
  case 24:return <AbsoluteFill><Office/><Man x={260} y={350} s={.65}/><Woman x={760} y={350} s={.65}/><Family x={1270} y={350} s={.48}/><div style={{position:'absolute',left:180,top:790,width:1500,height:24,background:'linear-gradient(90deg,#6f866f,#d1bd7e)',transform:'scaleX('+q+')',transformOrigin:'left'}}/></AbsoluteFill>;
  case 25:return <AbsoluteFill style={{background:'#0a0f15'}}>{Array.from({length:8},(_,i)=><React.Fragment key={i}><Person x={120+i*210} y={170+(i%2)*120} s={.52}/><Arrow x1={170+i*210} y1={450+(i%2)*120} x2={960} y2={700} o={ease(ph(t,.03+i*.05,.4+i*.05))} w={5}/></React.Fragment>)}<div style={{position:'absolute',left:650,top:680,width:620,height:140,borderRadius:70,background:'#584c3e',border:'8px solid #d1bd7e'}}/></AbsoluteFill>;
  case 26:return <AbsoluteFill style={{background:'#0a0f15'}}><Road t={t}/><Man x={790} y={430} s={.62}/><div style={{position:'absolute',left:710,top:140,width:500,height:120,border:'8px solid #7d8992',borderRadius:28,opacity:.55}}/></AbsoluteFill>;
  case 27:return <AbsoluteFill><Office/><Road t={t}/><Man x={790} y={430} s={.62}/><Clock x={210} y={180}/><Money x={1470} y={210}/><div style={{position:'absolute',left:1250,top:650,width:330,height:90,background:'#6f866f',borderRadius:45}}/></AbsoluteFill>;
  case 28:return <AbsoluteFill style={{background:'#0b1015'}}><City/><div style={{position:'absolute',left:0,right:0,top:0,bottom:0,background:'rgba(4,8,12,'+q+')'}}/><RuralField/><div style={{position:'absolute',left:150,top:160,width:1620,height:18,background:'#d4c17f',transform:'scaleX('+(1-q)+')',transformOrigin:'right'}}/></AbsoluteFill>;
  case 29:return <AbsoluteFill><RuralHome/><V46_CHILD_RIG_GIRL x={790} y={450} scale={.65}/><ParentMotherRig x={300} y={350} scale={.58}/><ParentFatherRig x={1320} y={350} scale={.58}/><Arrow x1={530} y1={500} x2={820} y2={570}/><Arrow x1={1330} y1={500} x2={1040} y2={570}/></AbsoluteFill>;
  case 30:return <AbsoluteFill><RuralHome/><V46_CHILD_RIG_GIRL x={820} y={480} scale={.62}/><Card x={280} y={260} w={300} h={200}><Money x={90} y={35}/></Card><Card x={1320} y={260} w={300} h={200}><Heart x={90} y={45}/></Card><div style={{position:'absolute',left:690,top:210,width:540,height:520,border:'9px dashed #d4c17f',borderRadius:270}}/></AbsoluteFill>;
  case 31:return <AbsoluteFill style={{background:'#0b1015'}}><ChildCenter t={t}/><ParentMotherRig x={240} y={340} scale={.5}/><ParentFatherRig x={1390} y={340} scale={.5}/></AbsoluteFill>;
  case 32:return <AbsoluteFill><FixedBg path="shared/asset-library/背景/BG_kenkyu.png" shade={.05}/><div style={{position:'absolute',left:120,top:100,fontSize:88,fontWeight:900,color:'#516875'}}>Karen Kramer</div><ChildCenter t={t}/><Arrow x1={350} y1={400} x2={890} y2={520}/><Arrow x1={1500} y1={400} x2={1030} y2={520}/></AbsoluteFill>;
  case 33:return <AbsoluteFill><RuralHome/><VillagePeople t={t}/><div style={{position:'absolute',left:760,top:390,width:400,height:300,borderRadius:'50%',background:'rgba(211,189,126,.12)'}}/></AbsoluteFill>;
  case 34:return <AbsoluteFill><RuralHome/><ParentMotherRig x={260} y={350} scale={.56}/><ParentMotherRig x={1160} y={350} scale={.56}/><V46_CHILD_RIG_GIRL x={1320} y={520} scale={.5}/><Money x={420} y={690}/><Arrow x1={520} y1={650} x2={1180} y2={520}/></AbsoluteFill>;
  case 35:return <AbsoluteFill><RuralHome/><V46_CHILD_RIG_BOY x={320} y={500} scale={.52}/><V46_CHILD_RIG_GIRL x={760} y={520} scale={.5}/><Person x={1270} y={380} s={.8}/><Money x={1390} y={600}/><Arrow x1={1330} y1={540} x2={940} y2={560}/></AbsoluteFill>;
  case 36:return <AbsoluteFill><RuralHome/><ChildCenter t={t}/><div style={{position:'absolute',left:0,right:0,top:0,bottom:0,background:'radial-gradient(circle at 50% 55%,transparent 20%,rgba(0,0,0,.32) 72%)'}}/></AbsoluteFill>;
  case 37:return <AbsoluteFill><City/><CareNetwork t={t}/></AbsoluteFill>;
  case 38:return <AbsoluteFill><City/><Card x={120} y={170} w={430} h={280}><SchoolBg/></Card><Card x={690} y={170} w={430} h={280}><SchoolBg/></Card><Card x={1260} y={170} w={430} h={280}><HospitalBg/></Card><V46_CHILD_RIG_BOY x={810} y={570} scale={.5}/><Arrow x1={330} y1={450} x2={850} y2={620}/><Arrow x1={910} y1={450} x2={930} y2={620}/><Arrow x1={1480} y1={450} x2={1020} y2={620}/></AbsoluteFill>;
  case 39:return <AbsoluteFill><City/><Card x={120} y={150} w={430} h={270}><Img src={A('shared/asset-library/背景/BG_supermarket.png')} style={{width:'100%',height:'100%',objectFit:'cover'}}/></Card><Card x={690} y={150} w={430} h={270}><Img src={A('shared/asset-library/背景/BG_hudousan.png')} style={{width:'100%',height:'100%',objectFit:'cover'}}/></Card><Card x={1260} y={150} w={430} h={270}><Img src={A('shared/asset-library/背景/BG_densha.png')} style={{width:'100%',height:'100%',objectFit:'cover'}}/></Card><Family x={760} y={510} s={.48}/>{[330,900,1470].map((x,i)=><Arrow key={x} x1={x} y1={430} x2={880+i*60} y2={600}/>)}</AbsoluteFill>;
  case 40:return <AbsoluteFill><City/><Workers t={t} count={30}/><Family x={1380} y={350} s={.5}/><div style={{position:'absolute',left:110,top:760,width:1510,height:24,background:'#d4c17f',transform:'scaleX('+q+')',transformOrigin:'left'}}/></AbsoluteFill>;
  case 41:return <AbsoluteFill><Office/><Split left={<><Workers t={t} count={15}/><Arrow x1={500} y1={520} x2={830} y2={520}/></>} right={<><NightRoom/><Man x={260} y={390} s={.58}/><Bar x={180} y={750} w={600} p={1-q}/></>}/></AbsoluteFill>;
  case 42:return <AbsoluteFill><NightRoom/><Woman x={300} y={350} s={.66}/><Card x={920} y={180} w={300} h={190}><Money x={90} y={35}/></Card><Card x={1290} y={410} w={300} h={190}><House x={70} y={28}/></Card><Bar x={860} y={760} w={730} p={.2+.18*q}/></AbsoluteFill>;
  case 43:return <AbsoluteFill><SchoolBg/><Woman x={420} y={360} s={.64}/><Clock x={1270} y={180} s={1.2} rot={t*300}/><Card x={1040} y={520} w={500} h={220}><div style={{position:'absolute',left:60,top:50,width:380,height:24,background:'#71808d'}}/><div style={{position:'absolute',left:60,top:105,width:300,height:24,background:'#71808d'}}/></Card></AbsoluteFill>;
  case 44:return <AbsoluteFill style={{background:'#0a0f15'}}><ChildCenter t={t}/><div style={{position:'absolute',left:80,top:80,width:1760,height:900,border:'8px solid #d4c17f',borderRadius:450,transform:'scale('+(1-.18*q)+')'}}/></AbsoluteFill>;
  case 45:return <AbsoluteFill><City/><Workers t={t} count={28}/><Split left={<><Workers t={t} count={12}/></>} right={<><Man x={250} y={380} s={.58}/><Road t={t}/></>}/></AbsoluteFill>;
  case 46:return <AbsoluteFill style={{background:'#0a0f15'}}><Scale t={t}/><Money x={300} y={760}/><Clock x={650} y={760}/><House x={1100} y={760}/><School x={1420} y={740} s={.8}/></AbsoluteFill>;
  case 47:return <AbsoluteFill style={{background:'#0a0f15'}}><Man x={790} y={360} s={.72}/><div style={{position:'absolute',left:690,top:780,width:540,height:22,background:'#d4c17f'}}/></AbsoluteFill>;
  case 48:return <AbsoluteFill style={{background:'#0a0f15'}}><Scale t={t}/><Man x={810} y={300} s={.62}/><Money x={280} y={250}/><Clock x={1450} y={240}/><House x={270} y={620}/><School x={1420} y={600} s={.75}/></AbsoluteFill>;
  case 49:return <AbsoluteFill style={{background:'#0a0f15'}}><div style={{position:'absolute',left:600,top:250,width:720,height:450,borderRadius:35,border:'9px solid #85919a'}}/><div style={{position:'absolute',left:680,top:330,width:560,height:290,border:'12px solid #9d5c58',transform:'rotate(-12deg)'}}/><Man x={820} y={350} s={.62}/></AbsoluteFill>;
  case 50:return <AbsoluteFill><Office/><Road t={t}/><Man x={790} y={430} s={.62}/><Workers t={t} count={18}/></AbsoluteFill>;
  case 51:return <AbsoluteFill style={{background:'#140e0a'}}><div style={{position:'absolute',left:0,right:0,top:0,height:540,background:'#241711'}}/><Crown t={t}/><div style={{position:'absolute',left:0,right:0,top:540,height:540,background:'#0a0f15'}}/></AbsoluteFill>;
  case 52:return <AbsoluteFill><City/><Workers t={t} count={28}/><div style={{position:'absolute',left:620,top:160,width:680,height:420,border:'8px dashed #7f8a92',borderRadius:50,opacity:.22}}/></AbsoluteFill>;
  case 53:return <AbsoluteFill><Office/><Crown t={t} opacity={.25}/><Money x={220} y={720}/><Clock x={560} y={720}/><House x={900} y={720}/><School x={1240} y={700} s={.75}/><div style={{position:'absolute',left:1550,top:730,width:120,height:120,borderRadius:'50%',background:'#9b6b65'}}/></AbsoluteFill>;
  case 54:return <AbsoluteFill><City/><Crown t={t} opacity={.58}/><Workers t={t} count={28}/><Road t={t}/><Man x={790} y={450} s={.58}/></AbsoluteFill>;
  default:return <AbsoluteFill style={{background:'#080c11'}}/>;
 }
};
