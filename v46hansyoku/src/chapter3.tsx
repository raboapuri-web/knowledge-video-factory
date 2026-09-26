import React from 'react';
import {AbsoluteFill,Img,staticFile,useCurrentFrame} from 'remotion';
import {V46_ADULT_MAN_RIG} from '../../shared/asset-library/人物テンプレート/V46_ADULT_MAN_RIG';
import {ParentFatherRig} from '../../shared/asset-library/人物テンプレート/PARENT_FATHER';
import {ParentMotherRig} from '../../shared/asset-library/人物テンプレート/PARENT_MOTHER';
import {V46_CHILD_RIG_BOY} from '../../shared/asset-library/人物テンプレート/V46_CHILD_RIG_BOY';

const clamp=(n:number)=>Math.max(0,Math.min(1,n));
const ph=(t:number,a:number,b:number)=>clamp((t-a)/(b-a));
const ease=(t:number)=>t*t*(3-2*t);
const A=(p:string)=>staticFile('assets/library/'+p.replace('shared/asset-library/',''));

const StaticBg=({path,shade=.18}:{path:string;shade?:number})=><AbsoluteFill style={{overflow:'hidden',background:'#070a0e'}}>
  <Img src={A(path)} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
  <AbsoluteFill style={{background:'linear-gradient(180deg,rgba(4,7,11,'+shade+'),rgba(4,7,11,'+(shade+.16)+'))'}}/>
</AbsoluteFill>;

const DryLand=()=> <AbsoluteFill style={{background:'linear-gradient(#68a8d5 0 40%,#d79a54 40% 100%)'}}>
  <div style={{position:'absolute',top:430,left:0,right:0,height:650,background:'repeating-linear-gradient(164deg,#da9c53 0 85px,#c07b49 85px 170px,#e2ad66 170px 260px)'}}/>
  {Array.from({length:17},(_,i)=><div key={i} style={{position:'absolute',left:45+(i*117)%1840,top:545+(i%4)*110,width:80+(i%3)*28,height:22+(i%2)*18,background:'#6b4938',clipPath:'polygon(5% 100%,25% 20%,72% 0,100% 78%)'}}/>)}
  <div style={{position:'absolute',left:240,top:270,width:18,height:270,background:'#4b3528',transform:'rotate(5deg)'}}/>
  <div style={{position:'absolute',left:100,top:235,width:350,height:110,background:'#5a6747',clipPath:'polygon(0 60%,18% 15%,40% 36%,55% 0,78% 35%,100% 20%,90% 72%,60% 100%,35% 75%,10% 92%)'}}/>
</AbsoluteFill>;

const TunnelBase=()=> <AbsoluteFill style={{background:'#241711'}}>
  <svg viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}}>
    <rect width="1920" height="1080" fill="#261810"/>
    <path d="M-80 250 C420 115 650 300 1020 210 S1540 110 2010 250" stroke="#070605" strokeWidth="115" fill="none" strokeLinecap="round"/>
    <path d="M-60 560 C430 430 710 650 1060 530 S1560 420 2000 570" stroke="#080605" strokeWidth="120" fill="none" strokeLinecap="round"/>
    <path d="M-80 865 C390 730 690 930 1050 820 S1530 720 2020 865" stroke="#070605" strokeWidth="110" fill="none" strokeLinecap="round"/>
    <path d="M1020 -60V1140" stroke="#080605" strokeWidth="100"/>
    {Array.from({length:56},(_,i)=><circle key={i} cx={(i*181)%1900} cy={(i*109)%1050} r={5+(i%5)*3} fill={i%3?'#7d4c32':'#9a6947'} opacity=".8"/>)}
  </svg>
</AbsoluteFill>;

const ColonyBase=()=> <AbsoluteFill style={{background:'#22150f'}}>
  <svg viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}}>
    <rect width="1920" height="1080" fill="#23160f"/>
    <ellipse cx="410" cy="295" rx="330" ry="205" fill="#0a0705" stroke="#5e3a26" strokeWidth="38"/>
    <ellipse cx="1010" cy="300" rx="390" ry="235" fill="#0a0705" stroke="#5e3a26" strokeWidth="38"/>
    <ellipse cx="1510" cy="720" rx="330" ry="225" fill="#0a0705" stroke="#5e3a26" strokeWidth="38"/>
    <ellipse cx="570" cy="790" rx="360" ry="220" fill="#0a0705" stroke="#5e3a26" strokeWidth="38"/>
    <path d="M665 315H620 M1395 520L1250 420 M875 520L690 625 M925 500L1395 650" stroke="#080605" strokeWidth="94" strokeLinecap="round"/>
  </svg>
</AbsoluteFill>;

const LabBase=()=> <AbsoluteFill style={{background:'linear-gradient(180deg,#dde6e9,#bfcbd0)'}}>
  <div style={{position:'absolute',left:70,top:90,width:1780,height:880,borderRadius:28,background:'#eef3f4',border:'8px solid #87969b'}}/>
  <div style={{position:'absolute',left:130,top:170,width:560,height:650,background:'#b8c7cb',borderRadius:20}}/>
  <div style={{position:'absolute',left:760,top:170,width:1010,height:650,background:'#d9e1e3',borderRadius:20}}/>
  {Array.from({length:5},(_,i)=><div key={i} style={{position:'absolute',left:820+i*175,top:690,width:115,height:130,border:'5px solid #7f8d92',borderRadius:16,background:'#eef3f4'}}/>)}
</AbsoluteFill>;

const CityBase=()=> <StaticBg path="shared/asset-library/背景/BG_TOWN_DAY_WIDE.png" shade={.12}/>;
const NightRoom=()=> <StaticBg path="shared/asset-library/背景/BG_oneroom_night.png" shade={.12}/>;
const OfficeBase=()=> <StaticBg path="shared/asset-library/背景/BG_office.png" shade={.16}/>;

const Mole=({x,y,s=.7,t=0,flip=false,queen=false,carry=false,glow=false}:{x:number;y:number;s?:number;t?:number;flip?:boolean;queen?:boolean;carry?:boolean;glow?:boolean})=>{
  const bob=Math.sin(t*8+x*.01)*5,step=Math.sin(t*12+x*.02)*10;
  return <svg viewBox="0 0 330 190" style={{position:'absolute',left:x,top:y+bob,width:330*s,height:190*s,transform:(flip?'scaleX(-1) ':'')+'rotate('+(step*.08)+'deg)',filter:glow?'drop-shadow(0 0 28px #e5cc81)':'drop-shadow(0 8px 8px #0008)'}}>
    <ellipse cx="160" cy="100" rx={queen?116:90} ry={queen?65:49} fill={queen?'#d69d93':'#c98f87'} stroke="#8d615b" strokeWidth="6"/>
    <circle cx="246" cy="88" r={queen?52:42} fill={queen?'#dda59b':'#d09a91'} stroke="#8d615b" strokeWidth="6"/>
    <circle cx="262" cy="76" r="5" fill="#17191c"/>
    <path d="M279 94h34M279 106h30" stroke="#f0e7da" strokeWidth="11" strokeLinecap="round"/>
    <path d="M94 134 70 162M142 141 126 173M197 141 214 172M242 130 270 157" stroke="#b67a73" strokeWidth="10" strokeLinecap="round"/>
    <path d="M68 95q-35-20-48 8" fill="none" stroke="#aa736d" strokeWidth="7"/>
    {carry?<circle cx="95" cy="64" r="20" fill="#bf915e" stroke="#785330" strokeWidth="5"/>:null}
  </svg>;
};

const BabyMoles=({x,y,count=4}:{x:number;y:number;count?:number})=><>{Array.from({length:count},(_,i)=><Mole key={i} x={x+(i%2)*120} y={y+Math.floor(i/2)*85} s={.27} t={i*.1}/>)}</>;

const PersonDot=({x,y,s=1,o=1}:{x:number;y:number;s?:number;o?:number})=><svg viewBox="0 0 100 165" style={{position:'absolute',left:x,top:y,width:100*s,height:165*s,opacity:o}}>
  <circle cx="50" cy="33" r="26" fill="#e5dcc8"/><path d="M16 160V98q0-38 34-38t34 38v62z" fill="#6f7f8e"/>
</svg>;

const Family=({x,y,s=1}:{x:number;y:number;s?:number})=><div style={{position:'absolute',left:x,top:y,width:520,height:650,transform:'scale('+s+')',transformOrigin:'top left'}}>
  <ParentFatherRig x={0} y={0} scale={.7}/>
  <ParentMotherRig x={160} y={8} scale={.68}/>
  <V46_CHILD_RIG_BOY x={315} y={140} scale={.46}/>
</div>;

const Arrow=({x1,y1,x2,y2,o=.85,w=8}:{x1:number;y1:number;x2:number;y2:number;o?:number;w?:number})=><svg viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}}>
  <defs><marker id="c3arr" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto"><path d="M0 0L12 6L0 12z" fill="#d8c486"/></marker></defs>
  <path d={'M'+x1+' '+y1+' L'+x2+' '+y2} stroke="#d8c486" strokeWidth={w} opacity={o} markerEnd="url(#c3arr)"/>
</svg>;

const Card=({x,y,w=260,h=160,children,o=1}:{x:number;y:number;w?:number;h?:number;children?:React.ReactNode;o?:number})=><div style={{position:'absolute',left:x,top:y,width:w,height:h,borderRadius:22,background:'rgba(15,22,30,.92)',border:'5px solid #c8b67c',boxShadow:'0 18px 45px #0008',opacity:o}}>{children}</div>;

const Money=({x,y,s=1}:{x:number;y:number;s?:number})=><svg viewBox="0 0 120 120" style={{position:'absolute',left:x,top:y,width:120*s,height:120*s}}><circle cx="60" cy="60" r="48" fill="#526d59" stroke="#d7c48b" strokeWidth="7"/><path d="M35 40h50M35 62h50M60 27v66" stroke="#f0e4b5" strokeWidth="9"/></svg>;
const Clock=({x,y,s=1,rot=0}:{x:number;y:number;s?:number;rot?:number})=><svg viewBox="0 0 120 120" style={{position:'absolute',left:x,top:y,width:120*s,height:120*s}}><circle cx="60" cy="60" r="50" fill="#17202a" stroke="#d7c48b" strokeWidth="8"/><path d="M60 60V28M60 60l26 16" stroke="#eee0ae" strokeWidth="8" strokeLinecap="round" transform={'rotate('+rot+' 60 60)'}/></svg>;
const House=({x,y,s=1}:{x:number;y:number;s?:number})=><svg viewBox="0 0 180 150" style={{position:'absolute',left:x,top:y,width:180*s,height:150*s}}><path d="M15 72 90 15l75 57v70H15z" fill="#6b7c8c" stroke="#d4c28b" strokeWidth="6"/><rect x="74" y="88" width="34" height="54" fill="#efe4c9"/></svg>;
const School=({x,y,s=1}:{x:number;y:number;s?:number})=><svg viewBox="0 0 200 150" style={{position:'absolute',left:x,top:y,width:200*s,height:150*s}}><rect x="25" y="48" width="150" height="90" fill="#788795" stroke="#d4c28b" strokeWidth="6"/><path d="M15 50 100 12l85 38" fill="#c5af75"/><rect x="88" y="94" width="25" height="44" fill="#efe3c8"/></svg>;

const GeneNode=({x,y,r=28,on=true}:{x:number;y:number;r?:number;on?:boolean})=><div style={{position:'absolute',left:x-r,top:y-r,width:r*2,height:r*2,borderRadius:'50%',background:on?'#e2c873':'#55616c',boxShadow:on?'0 0 24px #e2c873aa':'none'}}/>;

const Ant=({x,y,s=1}:{x:number;y:number;s?:number})=><svg viewBox="0 0 150 100" style={{position:'absolute',left:x,top:y,width:150*s,height:100*s}}><circle cx="35" cy="52" r="18" fill="#222"/><circle cx="72" cy="52" r="23" fill="#222"/><ellipse cx="112" cy="52" rx="28" ry="22" fill="#222"/><path d="M58 38 35 15M58 65 35 88M89 35 75 10M89 69 78 94M25 39 8 22M25 65 8 80" stroke="#222" strokeWidth="7"/></svg>;
const Bee=({x,y,s=1}:{x:number;y:number;s?:number})=><svg viewBox="0 0 160 110" style={{position:'absolute',left:x,top:y,width:160*s,height:110*s}}><ellipse cx="82" cy="62" rx="50" ry="28" fill="#d4ab3d"/><path d="M58 40V84M80 35V89M103 39V85" stroke="#242424" strokeWidth="10"/><ellipse cx="70" cy="28" rx="28" ry="18" fill="#d9e9ef" opacity=".8"/><ellipse cx="102" cy="25" rx="28" ry="18" fill="#d9e9ef" opacity=".8"/><circle cx="30" cy="62" r="18" fill="#292929"/></svg>;

const Split=({left,right}:{left:React.ReactNode;right:React.ReactNode})=><><div style={{position:'absolute',left:0,top:0,width:955,height:1080,overflow:'hidden'}}>{left}</div><div style={{position:'absolute',left:965,top:0,width:955,height:1080,overflow:'hidden'}}>{right}</div><div style={{position:'absolute',left:955,top:0,width:10,height:1080,background:'#d8c486'}}/></>;

const WorkerGrid=({t,count=20}:{t:number;count?:number})=><>{Array.from({length:count},(_,i)=>{const q=ease(ph(t,.02+i*.015,.25+i*.015));return <PersonDot key={i} x={90+(i%8)*220} y={100+Math.floor(i/8)*250} s={.55} o={q}/>})}</>;

const ChoiceRoad=({t}:{t:number})=><svg viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}}>
  <path d="M960 1080V650" stroke="#6b655a" strokeWidth="180"/>
  <path d="M960 650 C850 520 620 370 280 220" stroke="#6f7b6e" strokeWidth="150" fill="none"/>
  <path d="M960 650 C1100 500 1390 390 1690 260" stroke="#4d5157" strokeWidth="90" fill="none"/>
  <circle cx="960" cy="650" r={52+8*Math.sin(t*8)} fill="#d4c17f"/>
</svg>;

const CrownOfConditions=({t}:{t:number})=><svg viewBox="0 0 700 520" style={{position:'absolute',left:610,top:125,width:700,height:520,filter:'drop-shadow(0 18px 30px #000a)'}}>
  <path d="M50 410 25 95l185 145L350 45l140 195L675 95l-25 315z" fill="#323942" stroke="#d4c17f" strokeWidth="13"/>
  <circle cx="200" cy="315" r={30+4*Math.sin(t*7)} fill="#6a846e"/>
  <circle cx="350" cy="260" r={30+4*Math.sin(t*8)} fill="#9a6f65"/>
  <circle cx="500" cy="315" r={30+4*Math.sin(t*9)} fill="#6f8191"/>
</svg>;

const NoCommand=()=> <div style={{position:'absolute',left:690,top:280,width:540,height:340,borderRadius:32,border:'8px solid #87939c',background:'rgba(10,15,21,.82)'}}>
  <div style={{position:'absolute',left:110,top:78,width:320,height:28,background:'#727c84'}}/><div style={{position:'absolute',left:110,top:148,width:240,height:28,background:'#727c84'}}/><div style={{position:'absolute',left:110,top:218,width:280,height:28,background:'#727c84'}}/>
  <div style={{position:'absolute',left:54,top:54,width:430,height:240,border:'12px solid #9d5c58',transform:'rotate(-22deg)'}}/>
</div>;

const LabChart=({t,shift=false}:{t:number;shift?:boolean})=><svg viewBox="0 0 900 520" style={{position:'absolute',left:850,top:235,width:850,height:500}}>
  <line x1="80" y1="430" x2="820" y2="430" stroke="#64747b" strokeWidth="6"/><line x1="80" y1="70" x2="80" y2="430" stroke="#64747b" strokeWidth="6"/>
  <path d={shift?'M80 390 C250 360 390 330 520 230 S730 130 820 105':'M80 330 C230 320 390 310 530 295 S710 280 820 270'} fill="none" stroke={shift?'#b06c65':'#708a75'} strokeWidth="18" pathLength="1" strokeDasharray="1" strokeDashoffset={1-ph(t,.05,.85)}/>
</svg>;

export const Chapter3Scene=({scene,index,frames}:{scene:any;index:number;frames:number})=>{
  const frame=useCurrentFrame();
  const t=frames<=1?0:frame/(frames-1);
  const q=ease(ph(t,.04,.86));
  const q2=ease(ph(t,.46,.95));
  switch(index){
    case 0:return <AbsoluteFill><DryLand/><div style={{position:'absolute',left:0,right:0,top:430+290*q,height:18,background:'#4e3123'}}/><div style={{position:'absolute',left:0,right:0,top:448+290*q,bottom:0,background:'#1b110c',opacity:q}}/></AbsoluteFill>;
    case 1:return <AbsoluteFill><TunnelBase/><div style={{position:'absolute',left:0,right:0,top:0,bottom:0,background:'radial-gradient(circle at 18% 20%,rgba(255,220,130,'+(.18*(1-q))+'),transparent 26%)'}}/><Mole x={-230+1880*q} y={420} s={.5} t={t}/></AbsoluteFill>;
    case 2:return <AbsoluteFill><TunnelBase/><Mole x={280+520*q} y={185} s={.72} t={t}/><Mole x={1450-900*q} y={500} s={.55} t={t} flip/><Mole x={250+1100*q2} y={800} s={.48} t={t}/>{Array.from({length:20},(_,i)=><div key={i} style={{position:'absolute',left:920+(i%5)*34+100*q,top:190+Math.floor(i/5)*32,width:14,height:10,borderRadius:'50%',background:'#a16d48',opacity:q}}/>)}</AbsoluteFill>;
    case 3:return <AbsoluteFill><TunnelBase/><div style={{position:'absolute',left:460,top:180,width:1000,height:720,background:'radial-gradient(circle,#d8b18b33,transparent 65%)'}}/><Mole x={615} y={360} s={2.15} t={t} glow/></AbsoluteFill>;
    case 4:return <AbsoluteFill><ColonyBase/><Mole x={160} y={215} s={.55} t={t}/><Mole x={720} y={225} s={.52} t={t} carry flip/><Mole x={390+260*q} y={720} s={.48} t={t} carry/></AbsoluteFill>;
    case 5:return <AbsoluteFill><ColonyBase/><Mole x={260+500*q} y={250} s={.45} t={t}/><BabyMoles x={1390} y={675} count={5}/><Mole x={1280} y={610} s={.5} t={t} flip/><div style={{position:'absolute',left:260,top:560,width:130,height:90,background:'#9b6e3f',borderRadius:'50%',opacity:q2}}/></AbsoluteFill>;
    case 6:return <AbsoluteFill><ColonyBase/>{[[170,200],[730,210],[1200,660],[350,700]].map((p,i)=><Mole key={i} x={p[0]} y={p[1]} s={.47} t={t} carry={i===1||i===3} flip={i%2===1}/>)}<Arrow x1={470} y1={360} x2={870} y2={380}/><Arrow x1={1180} y1={450} x2={1420} y2={680}/><Arrow x1={770} y1={760} x2={500} y2={390}/></AbsoluteFill>;
    case 7:return <AbsoluteFill><ColonyBase/><div style={{position:'absolute',left:1280,top:515,width:480,height:390,border:'9px solid #c4a468',borderRadius:190,boxShadow:'0 0 50px #c4a46855'}}/>{Array.from({length:10},(_,i)=><Mole key={i} x={100+(i%5)*210} y={130+Math.floor(i/5)*280} s={.35} t={t} flip={i%2===1}/>)}<Arrow x1={1040} y1={510} x2={1280} y2={650} o={q}/></AbsoluteFill>;
    case 8:return <AbsoluteFill><ColonyBase/>{Array.from({length:13},(_,i)=><Mole key={i} x={95+(i%5)*205} y={120+Math.floor(i/5)*250} s={.34} t={t} flip={i%2===1}/>)}<div style={{position:'absolute',left:1250,top:540,width:500,height:340,borderRadius:170,background:'#0b0705',border:'8px solid #6c4d33'}}/></AbsoluteFill>;
    case 9:return <AbsoluteFill><ColonyBase/><Mole x={1320} y={620} s={.95} t={t} queen glow/><Mole x={1100} y={670} s={.45} t={t}/><Mole x={1610} y={690} s={.45} t={t} flip/>{Array.from({length:8},(_,i)=><Mole key={i} x={80+(i%4)*230} y={150+Math.floor(i/4)*310} s={.32} t={t}/>)}</AbsoluteFill>;
    case 10:return <AbsoluteFill><ColonyBase/><Mole x={1300} y={610} s={.85} t={t} queen/><BabyMoles x={1435} y={775} count={4}/><Mole x={180+300*q} y={230} s={.38} t={t} carry/><Mole x={640+250*q2} y={730} s={.38} t={t} carry flip/></AbsoluteFill>;
    case 11:return <AbsoluteFill><ColonyBase/><div style={{position:'absolute',left:190,top:170,width:650,height:720,border:'8px solid #8192a0',borderRadius:45}}/><div style={{position:'absolute',right:190,top:170,width:650,height:720,border:'8px solid #c3a66c',borderRadius:45}}/>{Array.from({length:7},(_,i)=><Mole key={i} x={260+(i%3)*180} y={260+Math.floor(i/3)*170} s={.28} t={t}/>)}<Mole x={1350} y={400} s={.62} t={t} queen/></AbsoluteFill>;
    case 12:return <AbsoluteFill style={{background:'#0c1015'}}><Ant x={220} y={320} s={2.2}/><Bee x={760} y={315} s={2.05}/><Mole x={1280} y={310} s={1.55} t={t}/><div style={{position:'absolute',left:180,right:180,top:770,height:16,background:'#d6c280'}}/></AbsoluteFill>;
    case 13:return <AbsoluteFill style={{background:'#0c1015'}}><div style={{position:'absolute',left:80,top:130,width:530,height:760,border:'7px solid #7f8c96',borderRadius:40}}/><div style={{position:'absolute',left:695,top:130,width:530,height:760,border:'7px solid #7f8c96',borderRadius:40}}/><div style={{position:'absolute',left:1310,top:130,width:530,height:760,border:'7px solid #7f8c96',borderRadius:40}}/><Ant x={230} y={310} s={2}/><Bee x={820} y={320} s={1.8}/><Mole x={1375} y={310} s={1.45} t={t}/>{[0,1,2].map(i=><div key={i} style={{position:'absolute',left:190+i*615,top:670,width:310,height:22,background:'#d6c280',transform:'scaleX('+q+')',transformOrigin:'left'}}/>)}</AbsoluteFill>;
    case 14:return <AbsoluteFill><ColonyBase/><Mole x={260} y={360} s={.72} t={t}/><BabyMoles x={1260} y={615} count={5}/><Arrow x1={650} y1={470} x2={1230} y2={670}/><div style={{position:'absolute',left:690,top:230,width:420,height:420,borderRadius:'50%',border:'10px dashed #d6c280',transform:'rotate('+(t*90)+'deg)'}}/></AbsoluteFill>;
    case 15:return <AbsoluteFill><LabBase/><div style={{position:'absolute',left:125,top:95,fontSize:112,fontWeight:900,color:'#48616d',fontFamily:'serif'}}>1964</div>{Array.from({length:8},(_,i)=>{const a=i/8*Math.PI*2;return <React.Fragment key={i}><GeneNode x={1260+Math.cos(a)*310} y={500+Math.sin(a)*220}/><Arrow x1={1260} y1={500} x2={1260+Math.cos(a)*270} y2={500+Math.sin(a)*190} o={q} w={5}/></React.Fragment>})}<GeneNode x={1260} y={500} r={45}/></AbsoluteFill>;
    case 16:return <AbsoluteFill><LabBase/><GeneNode x={420} y={500} r={42}/><Family x={1220} y={300} s={.68}/>{Array.from({length:18},(_,i)=>{const p=ease(ph(t,.02+i*.02,.55+i*.02));return <div key={i} style={{position:'absolute',left:500+680*p,top:420+(i%3)*70,width:18,height:18,borderRadius:'50%',background:'#e2c873',boxShadow:'0 0 16px #e2c873aa'}}/>})}<Arrow x1={530} y1={510} x2={1180} y2={510}/></AbsoluteFill>;
    case 17:return <AbsoluteFill style={{background:'#0b1016'}}><div style={{position:'absolute',left:260,top:250,width:550,height:500,border:'9px solid #7d8f9d',borderRadius:40}}/><div style={{position:'absolute',right:260,top:250,width:550,height:500,border:'9px solid #c5a66b',borderRadius:40}}/><Mole x={380} y={390} s={.58} t={t}/><BabyMoles x={1280} y={420} count={4}/><Arrow x1={800} y1={500} x2={1160} y2={500}/></AbsoluteFill>;
    case 18:return <AbsoluteFill><ColonyBase/>{Array.from({length:10},(_,i)=>{const a=i/10*Math.PI*2;return <Mole key={i} x={790+Math.cos(a)*560} y={420+Math.sin(a)*300} s={.31} t={t} flip={Math.cos(a)<0}/>})}<svg viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}}>{Array.from({length:10},(_,i)=>{const a=i/10*Math.PI*2,b=(i+2)%10/10*Math.PI*2;return <path key={i} d={'M'+(960+Math.cos(a)*520)+' '+(520+Math.sin(a)*280)+' L'+(960+Math.cos(b)*520)+' '+(520+Math.sin(b)*280)} stroke="#d6c280" strokeWidth="5" opacity=".45"/>})}</svg></AbsoluteFill>;
    case 19:return <AbsoluteFill><ColonyBase/><Mole x={1325} y={610} s={.85} t={t} queen/><BabyMoles x={1450} y={770} count={4}/><Mole x={480} y={440} s={.45} t={t}/><Arrow x1={760} y1={520} x2={1350} y2={650}/></AbsoluteFill>;
    case 20:return <AbsoluteFill style={{background:'#0b1015'}}><Split left={<><div style={{position:'absolute',inset:0,background:'#271810'}}/><Mole x={300} y={440} s={.55} t={t}/><div style={{position:'absolute',left:530,top:210,width:140,height:600,borderRadius:70,background:'#513421'}}/></>} right={<><div style={{position:'absolute',inset:0,background:'#271810'}}/>{Array.from({length:8},(_,i)=><Mole key={i} x={80+(i%4)*200} y={210+Math.floor(i/4)*280} s={.3} t={t}/>)}</>}/></AbsoluteFill>;
    case 21:return <AbsoluteFill><ColonyBase/>{Array.from({length:11},(_,i)=><Mole key={i} x={120+(i%5)*320} y={190+Math.floor(i/5)*300} s={.34} t={t} carry={i%4===0}/>)}<div style={{position:'absolute',left:0,right:0,bottom:0,height:180,background:'linear-gradient(transparent,#4f3323)',opacity:q}}/></AbsoluteFill>;
    case 22:return <AbsoluteFill><ColonyBase/>{Array.from({length:8},(_,i)=><Mole key={i} x={180+(i%4)*360} y={220+Math.floor(i/4)*350} s={.38} t={t} glow={i===5}/>)}<div style={{position:'absolute',left:1240,top:620,width:240,height:180,borderRadius:'50%',border:'12px solid #d6c280',boxShadow:'0 0 60px #d6c28077',opacity:q2}}/></AbsoluteFill>;
    case 23:return <AbsoluteFill><LabBase/><div style={{position:'absolute',left:125,top:95,fontSize:112,fontWeight:900,color:'#48616d',fontFamily:'serif'}}>1995</div><div style={{position:'absolute',left:940,top:220,width:700,height:430,border:'8px solid #7f8d92',borderRadius:28}}/><Mole x={1100} y={350} s={.7} t={t} queen/><Mole x={1360} y={400} s={.4} t={t}/><div style={{position:'absolute',left:1080+600*q,top:335,width:310,height:250,background:'#eef3f4'}}/><LabChart t={t}/></AbsoluteFill>;
    case 24:return <AbsoluteFill><LabBase/><div style={{position:'absolute',left:220,top:250,width:450,height:500,border:'8px solid #87969b',borderRadius:28}}/>{Array.from({length:6},(_,i)=><Mole key={i} x={250+(i%2)*180+80*Math.sin(t*8+i)} y={300+Math.floor(i/2)*130} s={.28} t={t} flip={i%2===1}/>)}<LabChart t={t} shift/></AbsoluteFill>;
    case 25:return <AbsoluteFill><LabBase/>{Array.from({length:7},(_,i)=><Mole key={i} x={180+(i%4)*170} y={250+Math.floor(i/4)*240} s={.27} t={t} glow={i===3}/>)}<div style={{position:'absolute',left:850,top:220,width:800,height:460,border:'8px solid #7f8d92',borderRadius:25}}/><Mole x={1100+180*q} y={350-50*q} s={.65} t={t} glow/><LabChart t={t} shift/></AbsoluteFill>;
    case 26:return <AbsoluteFill><LabBase/><div style={{position:'absolute',left:250,top:210,width:520,height:560,border:'8px solid #7f8d92',borderRadius:28}}/><div style={{position:'absolute',left:1130,top:210,width:520,height:560,border:'8px solid #7f8d92',borderRadius:28,background:'#f8fbfb'}}/><Mole x={340+760*q} y={380} s={.55} t={t}/><LabChart t={t} shift/></AbsoluteFill>;
    case 27:return <AbsoluteFill><LabBase/><Split left={<><div style={{position:'absolute',inset:0,background:'rgba(190,204,210,.72)'}}/><Mole x={300} y={400} s={.55} t={t}/><LabChart t={t}/></>} right={<><div style={{position:'absolute',inset:0,background:'rgba(240,246,247,.8)'}}/><Mole x={300} y={400} s={.55} t={t} glow/><LabChart t={t} shift/></>}/></AbsoluteFill>;
    case 28:return <AbsoluteFill><div style={{position:'absolute',left:0,top:0,width:1920,height:540,overflow:'hidden'}}><TunnelBase/><Mole x={260+1100*q} y={220} s={.45} t={t}/></div><div style={{position:'absolute',left:0,top:540,width:1920,height:540,overflow:'hidden'}}><CityBase/></div><div style={{position:'absolute',left:0,right:0,top:530,height:20,background:'#d6c280'}}/></AbsoluteFill>;
    case 29:return <AbsoluteFill><CityBase/><CrownOfConditions t={t}/><div style={{position:'absolute',left:630,top:180,width:660,height:660,borderRadius:'50%',background:'#0a0f15',opacity:q}}/><WorkerGrid t={t} count={20}/></AbsoluteFill>;
    case 30:return <AbsoluteFill><CityBase/><WorkerGrid t={t} count={24}/><div style={{position:'absolute',left:670,top:190,width:580,height:600,border:'10px solid #9d5c58',borderRadius:35,transform:'rotate(-14deg)',opacity:q}}/><div style={{position:'absolute',left:760,top:260,width:400,height:450,border:'10px solid #9d5c58',borderRadius:35,transform:'rotate(14deg)',opacity:q2}}/></AbsoluteFill>;
    case 31:return <AbsoluteFill><CityBase/><Split left={<><Clock x={270} y={220} s={1.4}/><Money x={580} y={500} s={1.2}/><Family x={230} y={430} s={.5}/></>} right={<><V46_ADULT_MAN_RIG x={280} y={310} scale={.7} tieVisible={false}/><Clock x={610} y={220} s={1.3}/><div style={{position:'absolute',left:180,top:780,width:600,height:30,background:'#9c625d',transform:'scaleX('+(1-q)+')',transformOrigin:'left'}}/></>}/></AbsoluteFill>;
    case 32:return <AbsoluteFill><CityBase/><Family x={1040} y={250} s={.72}/><House x={400} y={210} s={1.25}/><V46_CHILD_RIG_BOY x={600} y={470} scale={.5}/><Arrow x1={770} y1={500} x2={1050} y2={500}/></AbsoluteFill>;
    case 33:return <AbsoluteFill><OfficeBase/><div style={{position:'absolute',left:950,top:145,width:820,height:760,background:'rgba(8,13,18,.18)',borderRadius:30}}/><V46_ADULT_MAN_RIG x={360+620*q} y={315} scale={.72} tieVisible={false} showBriefcase action="walk"/><Clock x={1450} y={185} s={1.15} rot={t*220}/><div style={{position:'absolute',left:210,top:760,width:1470,height:28,background:'#d6c280',transform:'scaleX('+q+')',transformOrigin:'left'}}/></AbsoluteFill>;
    case 34:return <AbsoluteFill><CityBase/><Family x={1280} y={300} s={.56}/>{[['shared/asset-library/背景/BG_supermarket.png',170,180],['shared/asset-library/背景/BG_hudousan.png',520,170],['shared/asset-library/背景/BG_densha.png',840,170],['shared/asset-library/背景/BG_hospital.png',250,590],['shared/asset-library/背景/BG_school.png',650,590]].map((a,i)=>{const z=ease(ph(t,.03+i*.08,.3+i*.08));return <React.Fragment key={String(a[0])}><Card x={Number(a[1])} y={Number(a[2])} w={260} h={155} o={z}><Img src={A(String(a[0]))} style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:16}}/></Card><Arrow x1={Number(a[1])+130} y1={Number(a[2])+80} x2={1280} y2={520} o={z*.75} w={5}/></React.Fragment>})}</AbsoluteFill>;
    case 35:return <AbsoluteFill style={{background:'#0b1016'}}><Split left={<><ColonyBase/><Mole x={250} y={340} s={.55} t={t}/><Mole x={550} y={500} s={.45} t={t} carry/></>} right={<><CityBase/><V46_ADULT_MAN_RIG x={250} y={340} scale={.68} tieVisible={false}/><Family x={540} y={390} s={.42}/></>}/></AbsoluteFill>;
    case 36:return <AbsoluteFill style={{background:'#0a0f15'}}><Split left={<><ColonyBase/>{Array.from({length:8},(_,i)=><Mole key={i} x={80+(i%4)*190} y={230+Math.floor(i/4)*300} s={.28} t={t}/>)}</>} right={<><CityBase/><WorkerGrid t={t} count={16}/></>}/><Arrow x1={770} y1={520} x2={1150} y2={520}/></AbsoluteFill>;
    case 37:return <AbsoluteFill><CityBase/><div style={{position:'absolute',left:160,top:180,width:450,height:650,border:'8px solid #87939c',borderRadius:30}}/><div style={{position:'absolute',left:735,top:180,width:450,height:650,border:'8px solid #87939c',borderRadius:30}}/><div style={{position:'absolute',left:1310,top:180,width:450,height:650,border:'8px solid #87939c',borderRadius:30}}/><PersonDot x={330} y={390} s={1.1}/><PersonDot x={905} y={390} s={1.1}/><PersonDot x={1480} y={390} s={1.1}/><div style={{position:'absolute',left:70,right:70,top:90,height:80,background:'#9d5c58',opacity:q}}/></AbsoluteFill>;
    case 38:return <AbsoluteFill><CityBase/><CrownOfConditions t={t}/><Money x={360} y={720} s={.9}/><House x={700} y={700} s={.9}/><Clock x={1080} y={720} s={.9}/><School x={1430} y={700} s={.85}/>{[0,1,2,3].map(i=><Arrow key={i} x1={420+i*360} y1={700} x2={820+i*100} y2={565} o={q}/>)}</AbsoluteFill>;
    case 39:return <AbsoluteFill><CityBase/><ChoiceRoad t={t}/><V46_ADULT_MAN_RIG x={800} y={470} scale={.58} tieVisible={false}/><Money x={260} y={120}/><Clock x={1450} y={170}/><House x={1420} y={530}/></AbsoluteFill>;
    case 40:return <AbsoluteFill style={{background:'#0a0f15'}}><ColonyBase/><Mole x={1320} y={620} s={.9} t={t} queen/><div style={{position:'absolute',left:1040,top:160,width:700,height:720,border:'10px solid #9d5c58',borderRadius:340,boxShadow:'0 0 60px #9d5c5855'}}/></AbsoluteFill>;
    case 41:return <AbsoluteFill><Split left={<><ColonyBase/><Mole x={330} y={390} s={.62} t={t}/><Mole x={560} y={510} s={.5} t={t} queen/></>} right={<><CityBase/><V46_ADULT_MAN_RIG x={260} y={340} scale={.68} tieVisible={false}/><ChoiceRoad t={t}/></>}/></AbsoluteFill>;
    case 42:return <AbsoluteFill><CityBase/><CrownOfConditions t={t}/><WorkerGrid t={t} count={22}/><div style={{position:'absolute',left:570,top:210,width:780,height:540,borderRadius:270,background:'radial-gradient(circle,rgba(212,193,127,.14),transparent 70%)'}}/></AbsoluteFill>;
    case 43:return <AbsoluteFill><CityBase/><CrownOfConditions t={t}/><NoCommand/><div style={{position:'absolute',left:610,top:125,width:700,height:520,background:'#0a0f15',opacity:q}}/></AbsoluteFill>;
    case 44:return <AbsoluteFill><CityBase/><NoCommand/><V46_ADULT_MAN_RIG x={780} y={340} scale={.72} tieVisible={false}/><Family x={1260} y={370} s={.46}/><div style={{position:'absolute',left:1120,top:220,width:620,height:620,borderRadius:'50%',border:'8px dashed #7e8993',opacity:.35}}/></AbsoluteFill>;
    case 45:return <AbsoluteFill><NightRoom/><V46_ADULT_MAN_RIG x={300} y={330} scale={.7} tieVisible={false}/><Money x={940} y={250} s={1.1}/><Clock x={1220} y={250} s={1.1}/><House x={1470} y={270} s={1.05}/>{[0,1,2].map(i=><Arrow key={i} x1={760} y1={520} x2={990+i*275} y2={360} o={q}/>)}</AbsoluteFill>;
    case 46:return <AbsoluteFill style={{background:'#0b1016'}}><V46_ADULT_MAN_RIG x={250} y={340} scale={.68} tieVisible={false}/>{['money','clock','house','work'].map((k,i)=><Card key={k} x={720+i*250} y={250+i*120} w={210} h={120}><div style={{position:'absolute',inset:25,borderRadius:15,background:i===0?'#607a64':i===1?'#5f6e7e':i===2?'#8c765b':'#765f66'}}/></Card>)}<ChoiceRoad t={t}/></AbsoluteFill>;
    case 47:return <AbsoluteFill><CityBase/><div style={{position:'absolute',left:850,top:430,transform:'scale('+(1-.65*q)+')',transformOrigin:'center'}}><V46_ADULT_MAN_RIG x={0} y={0} scale={.7} tieVisible={false}/></div>{Array.from({length:42},(_,i)=>{const a=i/42*Math.PI*2,r=120+520*q+(i%5)*22;return <PersonDot key={i} x={910+Math.cos(a)*r} y={500+Math.sin(a)*r*.55} s={.34} o={q}/>})}</AbsoluteFill>;
    default:return <AbsoluteFill style={{background:'#080c11'}}/>;
  }
};
