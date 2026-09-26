import React from 'react';
import {AbsoluteFill,Img,staticFile,useCurrentFrame} from 'remotion';
import {V46_ADULT_MAN_RIG} from '../../shared/asset-library/人物テンプレート/V46_ADULT_MAN_RIG';
import {ParentFatherRig} from '../../shared/asset-library/人物テンプレート/PARENT_FATHER';
import {ParentMotherRig} from '../../shared/asset-library/人物テンプレート/PARENT_MOTHER';
import {V46_CHILD_RIG_BOY} from '../../shared/asset-library/人物テンプレート/V46_CHILD_RIG_BOY';
import {V46_CHILD_RIG_GIRL} from '../../shared/asset-library/人物テンプレート/V46_CHILD_RIG_GIRL';

const A=(p:string)=>staticFile('assets/library/'+p.replace('shared/asset-library/',''));
const clamp=(n:number)=>Math.max(0,Math.min(1,n));
const ph=(t:number,a:number,b:number)=>clamp((t-a)/(b-a));
const ease=(t:number)=>t*t*(3-2*t);

const Bg=({path,shade=.12}:{path:string;shade?:number})=><AbsoluteFill style={{background:'#06090d',overflow:'hidden'}}>
 <Img src={A(path)} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
 <AbsoluteFill style={{background:'linear-gradient(180deg,rgba(4,7,11,'+shade+'),rgba(4,7,11,'+(shade+.18)+'))'}}/>
</AbsoluteFill>;
const Street=()=> <Bg path="shared/asset-library/背景/BG_V46_OFFICE_STREET_NIGHT.png"/>;
const Station=()=> <Bg path="shared/asset-library/背景/BG_densha.png" shade={.08}/>;
const PeerHome=()=> <Bg path="shared/asset-library/背景/BG_V46_PEER_LIVING_ROOM.png" shade={.05}/>;
const Room=()=> <Bg path="shared/asset-library/背景/BG_oneroom_night.png" shade={.08}/>;
const Office=()=> <Bg path="shared/asset-library/背景/BG_office.png" shade={.12}/>;
const City=()=> <Bg path="shared/asset-library/背景/BG_TOWN_DAY_WIDE.png" shade={.08}/>;
const Cafe=()=> <Bg path="shared/asset-library/背景/BG_cafenaiso.png" shade={.06}/>;
const Park=()=> <Bg path="shared/asset-library/背景/BG_kouen.png" shade={.07}/>;
const Movie=()=> <Bg path="shared/asset-library/背景/BG_MOVIE.png" shade={.08}/>;

const Man=({x=760,y=330,s=.7,walk=false,think=false}:{x?:number;y?:number;s?:number;walk?:boolean;think?:boolean})=><V46_ADULT_MAN_RIG x={x} y={y} scale={s} tieVisible={false} action={walk?'walk':'idle'} pose={think?{rightShoulder:-48,rightElbow:-92,headTilt:-8}:{}}/>;
const Person=({x,y,s=1,o=1}:{x:number;y:number;s?:number;o?:number})=><svg viewBox="0 0 100 165" style={{position:'absolute',left:x,top:y,width:100*s,height:165*s,opacity:o}}><circle cx="50" cy="33" r="26" fill="#e7deca"/><path d="M16 160V98q0-38 34-38t34 38v62z" fill="#6f7e8d"/></svg>;
const Family=({x,y,s=1}:{x:number;y:number;s?:number})=><div style={{position:'absolute',left:x,top:y,width:520,height:650,transform:'scale('+s+')',transformOrigin:'top left'}}><ParentFatherRig x={0} y={0} scale={.68}/><ParentMotherRig x={160} y={7} scale={.67}/><V46_CHILD_RIG_BOY x={315} y={140} scale={.46}/></div>;

const Cake=({x,y,s=1}:{x:number;y:number;s?:number})=><svg viewBox="0 0 220 180" style={{position:'absolute',left:x,top:y,width:220*s,height:180*s}}><ellipse cx="110" cy="142" rx="90" ry="24" fill="#8f6a59"/><rect x="28" y="75" width="164" height="68" rx="16" fill="#e5c2a2"/><path d="M28 92q28 22 55 0t55 0t54 0v28H28z" fill="#f4e1cb"/>{[65,110,155].map(i=><React.Fragment key={i}><rect x={i-4} y="42" width="8" height="35" fill="#d1b56b"/><path d={'M'+i+' 39q-8-14 0-24q8 10 0 24z'} fill="#e5854d"/></React.Fragment>)}</svg>;
const Phone=({x,y,s=1,photo=true,close=0}:{x:number;y:number;s?:number;photo?:boolean;close?:number})=><div style={{position:'absolute',left:x,top:y,width:170*s,height:320*s,borderRadius:28*s,background:'#111820',border:(10*s)+'px solid #2e3942',boxShadow:'0 18px 40px #000a',transform:'rotate(-5deg)'}}><div style={{position:'absolute',left:12*s,top:28*s,right:12*s,bottom:20*s,borderRadius:18*s,background:photo?'linear-gradient(#b8c5ce,#667d8b)':'#080b0e',overflow:'hidden'}}>{photo?<><div style={{position:'absolute',left:16*s,top:70*s,width:48*s,height:48*s,borderRadius:'50%',background:'#e7deca'}}/><div style={{position:'absolute',left:75*s,top:64*s,width:48*s,height:48*s,borderRadius:'50%',background:'#e7deca'}}/><div style={{position:'absolute',left:45*s,top:145*s,width:70*s,height:55*s,borderRadius:12*s,background:'#d9b285'}}/></>:null}<div style={{position:'absolute',inset:0,background:'rgba(0,0,0,'+close+')'}}/></div></div>;

const Money=({x,y,s=1}:{x:number;y:number;s?:number})=><svg viewBox="0 0 120 120" style={{position:'absolute',left:x,top:y,width:120*s,height:120*s}}><circle cx="60" cy="60" r="48" fill="#526d59" stroke="#d8c58b" strokeWidth="7"/><path d="M35 40h50M35 62h50M60 27v66" stroke="#efe3b4" strokeWidth="9"/></svg>;
const Clock=({x,y,s=1,rot=0}:{x:number;y:number;s?:number;rot?:number})=><svg viewBox="0 0 120 120" style={{position:'absolute',left:x,top:y,width:120*s,height:120*s}}><circle cx="60" cy="60" r="50" fill="#17202a" stroke="#d8c58b" strokeWidth="8"/><path d="M60 60V28M60 60l27 16" stroke="#eee0ae" strokeWidth="8" strokeLinecap="round" transform={'rotate('+rot+' 60 60)'}/></svg>;
const House=({x,y,s=1}:{x:number;y:number;s?:number})=><svg viewBox="0 0 180 150" style={{position:'absolute',left:x,top:y,width:180*s,height:150*s}}><path d="M15 72 90 15l75 57v70H15z" fill="#68798a" stroke="#d4c28b" strokeWidth="6"/><rect x="74" y="88" width="34" height="54" fill="#eee3c8"/></svg>;
const Heart=({x,y,s=1}:{x:number;y:number;s?:number})=><svg viewBox="0 0 120 110" style={{position:'absolute',left:x,top:y,width:120*s,height:110*s}}><path d="M60 100 12 51Q0 15 31 12q19-2 29 18 10-20 29-18 31 3 19 39z" fill="#b86d73"/></svg>;

const Arrow=({x1,y1,x2,y2,o=.8,w=8}:{x1:number;y1:number;x2:number;y2:number;o?:number;w?:number})=><svg viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}}><defs><marker id="earr" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto"><path d="M0 0L12 6 0 12z" fill="#d7c385"/></marker></defs><path d={'M'+x1+' '+y1+' L'+x2+' '+y2} stroke="#d7c385" strokeWidth={w} opacity={o} markerEnd="url(#earr)"/></svg>;
const Card=({x,y,w=250,h=160,o=1,children}:{x:number;y:number;w?:number;h?:number;o?:number;children?:React.ReactNode})=><div style={{position:'absolute',left:x,top:y,width:w,height:h,borderRadius:22,background:'rgba(14,21,29,.9)',border:'5px solid #c8b67c',boxShadow:'0 18px 42px #0008',opacity:o}}>{children}</div>;

const Crowd=({t,count=20,thin=false}:{t:number;count?:number;thin?:boolean})=><>{Array.from({length:count},(_,i)=>{const q=ease(ph(t,.02+i*.014,.18+i*.014));const shift=thin?420*q*(i%2?1:-1):0;return <Person key={i} x={80+(i%8)*225+shift} y={110+Math.floor(i/8)*230} s={.48} o={thin?Math.max(.1,1-q*.7):q}/>})}</>;
const Split=({left,right}:{left:React.ReactNode;right:React.ReactNode})=><><div style={{position:'absolute',left:0,top:0,width:955,height:1080,overflow:'hidden'}}>{left}</div><div style={{position:'absolute',left:965,top:0,width:955,height:1080,overflow:'hidden'}}>{right}</div><div style={{position:'absolute',left:955,top:0,width:10,height:1080,background:'#d8c486'}}/></>;

const Road=({t,reverse=false}:{t:number;reverse?:boolean})=><svg viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}}><path d="M960 1080V650" stroke="#6a655b" strokeWidth="180"/><path d="M960 650 C830 520 610 390 280 230" stroke={reverse?'#4b5056':'#6f7c6f'} strokeWidth={reverse?95:165} fill="none"/><path d="M960 650 C1120 500 1410 410 1690 270" stroke={reverse?'#6f7c6f':'#4b5056'} strokeWidth={reverse?165:95} fill="none"/><circle cx="960" cy="650" r={50+8*Math.sin(t*8)} fill="#d4c17f"/></svg>;
const Doors=({t}:{t:number})=><>{Array.from({length:5},(_,i)=>{const q=ease(ph(t,.03+i*.08,.28+i*.08));return <div key={i} style={{position:'absolute',left:210+i*300,top:200+(i%2)*90,width:200,height:500,border:'9px solid #7f8b95',background:'rgba(15,22,30,.7)',transform:'perspective(700px) rotateY('+(q*(i%2?35:-35))+'deg)',transformOrigin:i%2?'left':'right'}}><div style={{position:'absolute',right:20,top:240,width:18,height:18,borderRadius:'50%',background:'#d3bd7b'}}/></div>})}</>;

const Colony=({t}:{t:number})=><AbsoluteFill style={{background:'#24160f'}}><svg viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}}><ellipse cx="470" cy="340" rx="350" ry="220" fill="#080605" stroke="#5e3a26" strokeWidth="40"/><ellipse cx="1260" cy="330" rx="430" ry="250" fill="#080605" stroke="#5e3a26" strokeWidth="40"/><ellipse cx="720" cy="790" rx="400" ry="220" fill="#080605" stroke="#5e3a26" strokeWidth="40"/><ellipse cx="1510" cy="760" rx="300" ry="200" fill="#080605" stroke="#5e3a26" strokeWidth="40"/><path d="M760 360H850M1040 540 850 690M1450 560l40 30" stroke="#070504" strokeWidth="92" strokeLinecap="round"/></svg>{Array.from({length:14},(_,i)=><div key={i} style={{position:'absolute',left:130+(i%5)*340+40*Math.sin(t*7+i),top:220+Math.floor(i/5)*280,width:95,height:52,borderRadius:'50%',background:i===11?'#d69d93':'#c98f87',boxShadow:i===11?'0 0 28px #d8c58b':'none'}}/>)}</AbsoluteFill>;

const Conditions=({t}:{t:number})=><>{[
 ['money',250,230],['clock',610,210],['house',970,230],['work',1320,210],['heart',1580,250]
].map((a,i)=>{const q=ease(ph(t,.03+i*.07,.28+i*.07));return <Card key={String(a[0])} x={Number(a[1])} y={Number(a[2])} w={210} h={150} o={q}><div style={{position:'absolute',left:45,top:20}}>{a[0]==='money'?<Money x={0} y={0}/>:a[0]==='clock'?<Clock x={0} y={0}/>:a[0]==='house'?<House x={0} y={0} s={.72}/>:a[0]==='heart'?<Heart x={0} y={10}/>:<div style={{width:120,height:100,background:'#765f66',borderRadius:18}}/>}</div></Card>})}</>;

const Train=({t,enter=false}:{t:number;enter?:boolean})=><div style={{position:'absolute',left:(enter?1920-2150*ease(ph(t,.04,.78)):-120),top:365,width:2100,height:500,background:'#384956',border:'16px solid #1e2830',boxShadow:'0 25px 50px #000c'}}>{Array.from({length:8},(_,i)=><div key={i} style={{position:'absolute',left:90+i*250,top:70,width:180,height:180,background:'#9cb2bc88',border:'8px solid #202a31'}}><Person x={35} y={25} s={.7}/></div>)}</div>;

export const EpilogueScene=({scene,index,frames}:{scene:any;index:number;frames:number})=>{
 const frame=useCurrentFrame();
 const t=frames<=1?0:frame/(frames-1);
 const q=ease(ph(t,.04,.82));
 const q2=ease(ph(t,.48,.95));
 switch(index){
  case 0:return <AbsoluteFill><Street/><Clock x={1450} y={130} s={1.35} rot={t*180}/><Man x={260+850*q} y={410} s={.56} walk/></AbsoluteFill>;
  case 1:return <AbsoluteFill><Street/><Crowd t={t} count={22} thin/><div style={{position:'absolute',left:180,top:120,width:1460,height:470,background:'repeating-linear-gradient(90deg,rgba(246,216,132,'+(1-q)+') 0 55px,transparent 55px 115px)',opacity:.45}}/><Arrow x1={520} y1={720} x2={1550} y2={720} o={.65}/></AbsoluteFill>;
  case 2:return <AbsoluteFill><Station/><Man x={360} y={380} s={.64} think/><Phone x={1040} y={310} s={1.25} photo close={1-q}/><div style={{position:'absolute',left:0,right:0,bottom:0,height:200,background:'rgba(0,0,0,.18)'}}/></AbsoluteFill>;
  case 3:return <AbsoluteFill><PeerHome/><V46_CHILD_RIG_BOY x={530} y={440} scale={.62}/><V46_CHILD_RIG_GIRL x={1030} y={440} scale={.62}/><Cake x={810} y={700} s={1.5}/><div style={{position:'absolute',left:400,top:280,width:1120,height:600,border:'18px solid rgba(255,255,255,.8)',boxShadow:'0 20px 50px #0009',transform:'scale('+(1+.05*q)+')'}}/></AbsoluteFill>;
  case 4:return <AbsoluteFill><PeerHome/><V46_CHILD_RIG_BOY x={570} y={510} scale={.48}/><V46_CHILD_RIG_GIRL x={1010} y={510} scale={.48}/><ParentFatherRig x={330} y={280} scale={.62}/><ParentMotherRig x={1240} y={280} scale={.62}/><Cake x={830} y={730}/><div style={{position:'absolute',left:430,top:245,width:1060,height:640,border:'16px solid rgba(255,255,255,.78)'}}/></AbsoluteFill>;
  case 5:return <AbsoluteFill><Room/><Man x={720} y={350} s={.72}/><Clock x={1260} y={210}/><Money x={420} y={220}/><div style={{position:'absolute',left:650,top:760,width:650,height:24,background:'#6f866f'}}/></AbsoluteFill>;
  case 6:return <AbsoluteFill><Split left={<><Cafe/><Man x={300} y={390} s={.55}/><Money x={600} y={230}/></>} right={<><Park/><Man x={320} y={390} s={.55} walk/><Heart x={610} y={230}/></>}/></AbsoluteFill>;
  case 7:return <AbsoluteFill><Office/><Man x={300} y={350} s={.68}/>{Array.from({length:5},(_,i)=><Card key={i} x={860+i*145} y={610-i*95} w={180} h={100}><div style={{position:'absolute',inset:24,background:'#677887',borderRadius:12}}/></Card>)}<Arrow x1={650} y1={520} x2={1050} y2={450}/></AbsoluteFill>;
  case 8:return <AbsoluteFill><Room/><Man x={330} y={350} s={.7}/><Road t={t}/><div style={{position:'absolute',left:250,top:160,width:520,height:100,borderRadius:50,background:'#5f7564'}}/></AbsoluteFill>;
  case 9:return <AbsoluteFill style={{background:'#0a0f15'}}><Man x={790} y={360} s={.72}/><div style={{position:'absolute',left:720,top:770,width:480,height:24,background:'#d4c17f'}}/></AbsoluteFill>;
  case 10:return <AbsoluteFill style={{background:'#080c12'}}><Man x={790} y={390} s={.62}/><Card x={120} y={160} w={460} h={650}><Bg path="shared/asset-library/背景/BG_town.png" shade={.1}/><Money x={250} y={220}/><Clock x={240} y={510}/></Card><Card x={730} y={120} w={460} h={650}><City/><Money x={860} y={210}/><Clock x={850} y={500}/></Card><Card x={1340} y={180} w={460} h={650}><Bg path="shared/asset-library/背景/BG_V46_RESIDENTIAL_STREET_NIGHT.png"/><Money x={1470} y={240}/><Clock x={1460} y={530}/></Card></AbsoluteFill>;
  case 11:return <AbsoluteFill style={{background:'#0a0f15'}}><Doors t={t}/><Man x={810} y={360} s={.62}/></AbsoluteFill>;
  case 12:return <AbsoluteFill style={{background:'#0a0f15'}}><Doors t={t}/><Conditions t={t}/><Man x={810} y={500} s={.5}/></AbsoluteFill>;
  case 13:return <AbsoluteFill><Colony t={t}/><div style={{position:'absolute',left:1260,top:560,width:430,height:280,border:'10px solid #d4c17f',borderRadius:150}}/></AbsoluteFill>;
  case 14:return <AbsoluteFill><Split left={<><City/><Family x={250} y={360} s={.54}/></>} right={<><Office/><Man x={290} y={370} s={.58}/><Crowd t={t} count={10}/></>}/><Arrow x1={760} y1={520} x2={1160} y2={520}/></AbsoluteFill>;
  case 15:return <AbsoluteFill style={{background:'#0a0f15'}}><Split left={<><Colony t={t}/></>} right={<><City/><Family x={180} y={360} s={.45}/><Man x={520} y={390} s={.5}/></>}/></AbsoluteFill>;
  case 16:return <AbsoluteFill style={{background:'#0a0f15'}}><div style={{position:'absolute',left:630,top:120,width:660,height:480,borderRadius:220,border:'10px solid #d4c17f',opacity:1-q}}/><Conditions t={t}/><div style={{position:'absolute',left:700,top:160,width:520,height:380,border:'12px solid #9c605b',transform:'rotate(-12deg)',opacity:q}}/></AbsoluteFill>;
  case 17:return <AbsoluteFill style={{background:'#0a0f15'}}><Conditions t={t}/><Man x={790} y={500} s={.5}/></AbsoluteFill>;
  case 18:return <AbsoluteFill><Room/><Man x={280} y={360} s={.64}/>{Array.from({length:12},(_,i)=>{const a=i/12*Math.PI*2;const r=240+180*q;return <div key={i} style={{position:'absolute',left:870+Math.cos(a)*r,top:500+Math.sin(a)*r*.55,width:28,height:28,borderRadius:'50%',background:i%3?'#778794':'#d4c17f'}}/>})}<Conditions t={t}/></AbsoluteFill>;
  case 19:return <AbsoluteFill><Park/><Man x={760} y={360} s={.68} walk/><div style={{position:'absolute',left:180,top:780,width:1550,height:34,background:'#6f866f',borderRadius:17}}/></AbsoluteFill>;
  case 20:return <AbsoluteFill><Park/><Man x={760} y={360} s={.68}/><div style={{position:'absolute',left:590,top:230,width:740,height:520,border:'10px solid #d4c17f',borderRadius:260,opacity:.38}}/></AbsoluteFill>;
  case 21:return <AbsoluteFill style={{background:'#0a0f15'}}><Man x={280} y={390} s={.62}/>{[0,1,2].map((i)=><Card key={i} x={760+i*250} y={650-i*145} w={210} h={120}><div style={{position:'absolute',inset:25,background:i===0?'#6f866f':i===1?'#68798a':'#7b6655',borderRadius:15}}/></Card>)}<Family x={1390+260*q} y={300} s={.48}/><Arrow x1={650} y1={540} x2={1390+180*q} y2={500}/></AbsoluteFill>;
  case 22:return <AbsoluteFill style={{background:'#0a0f15'}}>{Array.from({length:4},(_,i)=><React.Fragment key={i}><div style={{position:'absolute',left:140+i*420,top:160+(i%2)*140,width:280,height:520,border:'8px solid #7f8b95',borderRadius:30}}/><Person x={230+i*420} y={350+(i%2)*140} s={.7}/><Arrow x1={280+i*420} y1={720+(i%2)*60} x2={960} y2={850} o={q}/></React.Fragment>)}<div style={{position:'absolute',left:700,top:820,width:520,height:90,borderRadius:45,background:'#584c3e',border:'8px solid #d4c17f'}}/></AbsoluteFill>;
  case 23:return <AbsoluteFill style={{background:'#0a0f15'}}><Road t={t}/><Man x={790} y={430} s={.62}/><div style={{position:'absolute',left:590,top:160,width:740,height:140,borderRadius:70,background:'#18212b',border:'8px solid #d4c17f'}}/><Arrow x1={960} y1={640} x2={960} y2={300}/></AbsoluteFill>;
  case 24:return <AbsoluteFill><Station/><Man x={360} y={390} s={.64}/><Phone x={1040} y={320} s={1.2} photo close={q}/></AbsoluteFill>;
  case 25:return <AbsoluteFill><Station/><Train t={t} enter/><Man x={260} y={410} s={.56}/></AbsoluteFill>;
  case 26:return <AbsoluteFill><Station/><Train t={1}/><Man x={340+720*q} y={410} s={.56} walk/><div style={{position:'absolute',left:980,top:390,width:130,height:320,background:'#1d2730',opacity:q}}/></AbsoluteFill>;
  case 27:return <AbsoluteFill style={{background:'#0a0f15'}}><Clock x={800} y={260} s={2.2} rot={t*360}/><div style={{position:'absolute',left:620,top:760,width:680,height:30,background:'#6f866f',transform:'scaleX('+q+')',transformOrigin:'left'}}/></AbsoluteFill>;
  case 28:return <AbsoluteFill><City/><Man x={220} y={400} s={.58}/><Card x={620} y={180} w={270} h={170}><div style={{position:'absolute',inset:30,background:'#6f7f8d',borderRadius:15}}/></Card><Arrow x1={880} y1={400} x2={1270} y2={500}/><Family x={1300} y={340} s={.48}/></AbsoluteFill>;
  case 29:return <AbsoluteFill><Room/><Man x={360} y={380} s={.65} think/><div style={{position:'absolute',left:1130,top:560,width:180,height:230,border:'8px solid #7f8b95',borderRadius:20}}/><Family x={1380} y={350} s={.42}/><div style={{position:'absolute',left:1320,top:250,width:460,height:520,background:'rgba(5,8,12,'+(.3+.5*q)+')'}}/></AbsoluteFill>;
  case 30:return <AbsoluteFill style={{background:'#070a0e'}}><Split left={<Colony t={t}/>} right={<><City/><Crowd t={t} count={24}/><Family x={530} y={360} s={.42}/></>}/><div style={{position:'absolute',left:760,top:100,width:400,height:880,background:'linear-gradient(90deg,transparent,rgba(212,193,127,'+(.12+.12*Math.sin(t*4))+'),transparent)'}}/></AbsoluteFill>;
  default:return <AbsoluteFill style={{background:'#070a0e'}}/>;
 }
};
