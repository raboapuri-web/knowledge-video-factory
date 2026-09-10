import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';

const C={bg:'#030505',ink:'#080b0a',green:'#173f2c',green2:'#2d6b4a',emerald:'#6ca67f',metal:'#9aa4a0',paper:'#ece6d8',gold:'#c7a25d',red:'#a53e3e',blue:'#76a4bd',purple:'#7d4a95',white:'#f0eee8'};
const clamp=(v:number)=>Math.max(0,Math.min(1,v));
const mix=(p:number,a:number,b:number)=>interpolate(clamp(p),[0,1],[a,b],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});

export type CinematicScene={id:string;start:number;end:number;kind:string;label:string};
export const CINEMATIC_SCENES:CinematicScene[]=[
{id:'s01',start:0,end:24,kind:'lab',label:'研究施設で目覚めるワンダーマン'},
{id:'s02',start:24,end:48,kind:'newsroom',label:'静かな世界の異変'},
{id:'s03',start:48,end:78,kind:'earthPeace',label:'世界から悪が消えた日'},
{id:'s04',start:78,end:97,kind:'doomEarth',label:'世界を救ったのはドゥーム'},
{id:'s05',start:97,end:120,kind:'emperor',label:'Emperor Doom'},
{id:'s06',start:120,end:154,kind:'prism',label:'パープルマンとサイコ・プリズム'},
{id:'s07',start:154,end:178,kind:'earthControl',label:'世界支配の成立'},
{id:'s08',start:178,end:200,kind:'heroesControlled',label:'アベンジャーズも支配下へ'},
{id:'s09',start:200,end:221,kind:'orderedCity',label:'それでも世界は良くなる'},
{id:'s10',start:221,end:250,kind:'cityWalk',label:'ワンダーマンが街を見る'},
{id:'s11',start:250,end:276,kind:'dilemma',label:'本当に壊すべきか'},
{id:'s12',start:276,end:303,kind:'heroesAwaken',label:'仲間を解放する'},
{id:'s13',start:303,end:329,kind:'prismBreak',label:'サイコ・プリズム破壊'},
{id:'s14',start:329,end:351,kind:'earthChaos',label:'平和も一緒に崩れる'},
{id:'s15',start:351,end:380,kind:'comparison',label:'アベンジャーズは世界を悪化させたのか'},
{id:'s16',start:380,end:409,kind:'goldenRoom',label:'幸福な奴隷'},
{id:'s17',start:409,end:436,kind:'permission',label:'非支配としての自由'},
{id:'s18',start:436,end:468,kind:'throneExit',label:'悪い王をどう降ろすか'},
{id:'s19',start:468,end:495,kind:'roadFast',label:'独裁の速さ'},
{id:'s20',start:495,end:525,kind:'roadNoBrake',label:'独裁の怖さ'},
{id:'s21',start:525,end:556,kind:'infoTower',label:'悪いニュースが届かない'},
{id:'s22',start:556,end:592,kind:'alarmDemocracy',label:'鬱陶しい警報装置'},
{id:'s23',start:592,end:620,kind:'parliament',label:'民主主義の欠陥'},
{id:'s24',start:620,end:647,kind:'distributed',label:'権力を分散させる'},
{id:'s25',start:647,end:675,kind:'dataIntro',label:'現実のデータへ'},
{id:'s26',start:675,end:704,kind:'growthChart',label:'民主化と成長'},
{id:'s27',start:704,end:733,kind:'famine',label:'飢饉と民主主義'},
{id:'s28',start:733,end:767,kind:'resilience',label:'短期効率と長期レジリエンス'},
{id:'s29',start:767,end:792,kind:'doom2025',label:'One World Under Doom'},
{id:'s30',start:792,end:808,kind:'welcome',label:'歓迎する人々'},
{id:'s31',start:808,end:824,kind:'heroOpposition',label:'それでも抵抗するヒーロー'},
{id:'s32',start:824,end:850,kind:'aftermath',label:'壊れた窓の前の市民'},
{id:'s33',start:850,end:876,kind:'rebuild',label:'自由は面倒である'},
{id:'s34',start:876,end:898,kind:'doomQuestion',label:'私なら世界を正しくできる'},
{id:'s35',start:898,end:918,kind:'heroesQuestion',label:'お前だけに決めさせない'},
{id:'s36',start:918,end:933,kind:'trap',label:'本当に有能ならドゥームでいいのでは'},
{id:'s37',start:933,end:940,kind:'finalEarth',label:'有能かどうかを誰が決めるのか'}
];

const Grain=()=> <AbsoluteFill style={{opacity:.035,backgroundImage:'radial-gradient(circle,rgba(255,255,255,.7) 0 1px,transparent 1.2px)',backgroundSize:'23px 23px',mixBlendMode:'soft-light',pointerEvents:'none'}}/>;
const Vignette=()=> <AbsoluteFill style={{background:'radial-gradient(ellipse at 50% 45%,transparent 35%,rgba(0,0,0,.18) 68%,rgba(0,0,0,.76) 100%)',pointerEvents:'none'}}/>;
const Camera=({p,children,zoom=1.04,dx=0,dy=0}:{p:number;children:React.ReactNode;zoom?:number;dx?:number;dy?:number})=><div style={{position:'absolute',inset:0,transform:`scale(${mix(p,1,zoom)}) translate(${mix(p,0,dx)}px,${mix(p,0,dy)}px)`,transformOrigin:'50% 50%'}}>{children}</div>;

const Doom=({x=1450,y=480,s=1}:{x?:number;y?:number;s?:number})=><div style={{position:'absolute',left:x,top:y,width:280*s,height:390*s,transform:'translate(-50%,-50%)'}}>
 <div style={{position:'absolute',left:'-18%',top:'-12%',width:'136%',height:'68%',border:`30px solid ${C.green}`,borderBottom:0,borderRadius:'52% 52% 16% 16%'}}/>
 <div style={{position:'absolute',left:'8%',right:'8%',top:'8%',bottom:'5%',clipPath:'polygon(22% 0,78% 0,94% 20%,84% 84%,65% 100%,35% 100%,16% 84%,6% 20%)',background:'linear-gradient(135deg,#c1c7c4,#7b8682 42%,#424b48 100%)',boxShadow:'0 12px 70px rgba(50,110,75,.35)'}}/>
 <div style={{position:'absolute',left:'25%',right:'25%',top:'36%',height:'7%',background:'#101714',clipPath:'polygon(0 0,44% 30%,50% 100%,56% 30%,100% 0,94% 70%,58% 72%,50% 100%,42% 72%,6% 70%)'}}/>
 <div style={{position:'absolute',left:'46%',top:'50%',width:'8%',height:'25%',borderLeft:'4px solid #39413e',borderRight:'4px solid #39413e'}}/>
</div>;

const Human=({x,y,s=1,hero=false,controlled=false}:{x:number;y:number;s?:number;hero?:boolean;controlled?:boolean})=><div style={{position:'absolute',left:x,top:y,transform:`scale(${s})`,transformOrigin:'50% 100%'}}>
 <div style={{position:'absolute',left:-28,top:-158,width:56,height:56,borderRadius:'50%',background:hero?'#c29f83':'#a98671',boxShadow:controlled?'0 0 22px '+C.purple:'none'}}/>
 <div style={{position:'absolute',left:-44,top:-104,width:88,height:108,borderRadius:'22px 22px 8px 8px',background:hero?'#2b5065':'#303b37',border:hero?'3px solid #7196a9':'none'}}/>
 <div style={{position:'absolute',left:-35,top:-10,width:24,height:82,borderRadius:10,background:'#151d1b'}}/><div style={{position:'absolute',right:-35,top:-10,width:24,height:82,borderRadius:10,background:'#151d1b'}}/>
 {controlled&&<><div style={{position:'absolute',left:-17,top:-136,width:11,height:4,background:'#d68bf0',boxShadow:'0 0 10px #d68bf0'}}/><div style={{position:'absolute',left:7,top:-136,width:11,height:4,background:'#d68bf0',boxShadow:'0 0 10px #d68bf0'}}/></>}
</div>;

const Earth=({p,x=960,y=520,size=700,controlled=false,chaos=false,night=true}:{p:number;x?:number;y?:number;size?:number;controlled?:boolean;chaos?:boolean;night?:boolean})=>{
 const r=size/2;return <div style={{position:'absolute',left:x,top:y,width:size,height:size,transform:`translate(-50%,-50%) rotate(${mix(p,-4,4)}deg)`,borderRadius:'50%',background:'radial-gradient(circle at 34% 28%,#2d6d90 0%,#15506c 36%,#092737 67%,#061018 100%)',boxShadow:'0 0 18px rgba(130,205,240,.6),0 0 90px rgba(75,150,190,.24),inset -90px -45px 150px rgba(0,0,0,.67)',overflow:'hidden'}}>
  <div style={{position:'absolute',left:size*.12,top:size*.18,width:size*.30,height:size*.18,background:'#5b7c4f',clipPath:'polygon(0 29%,14% 6%,44% 0,72% 14%,100% 7%,84% 44%,66% 54%,59% 94%,37% 100%,20% 69%,5% 64%)',filter:'drop-shadow(0 0 5px rgba(0,0,0,.3))'}}/>
  <div style={{position:'absolute',left:size*.43,top:size*.20,width:size*.29,height:size*.24,background:'#607f52',clipPath:'polygon(4% 16%,31% 0,64% 8%,95% 31%,84% 47%,63% 44%,57% 69%,38% 100%,26% 70%,5% 56%)'}}/>
  <div style={{position:'absolute',left:size*.57,top:size*.48,width:size*.20,height:size*.27,background:'#59794e',clipPath:'polygon(28% 0,72% 9%,93% 43%,65% 100%,30% 91%,6% 42%)'}}/>
  <div style={{position:'absolute',left:size*.71,top:size*.30,width:size*.16,height:size*.12,background:'#67865a',clipPath:'polygon(0 40%,30% 4%,80% 0,100% 40%,65% 100%,18% 82%)'}}/>
  {Array.from({length:11}).map((_,i)=><div key={i} style={{position:'absolute',left:(i*83%88)+'%',top:(12+(i*47)%72)+'%',width:size*(.10+(i%3)*.04),height:size*(.025+(i%2)*.02),borderRadius:'50%',background:'rgba(240,247,244,.30)',filter:'blur(5px)',transform:`translateX(${mix(p,-14,18)}px) rotate(${i*17}deg)`}}/>)}
  {night&&<div style={{position:'absolute',inset:0,background:'linear-gradient(103deg,transparent 43%,rgba(0,0,0,.12) 52%,rgba(0,0,0,.75) 79%,rgba(0,0,0,.94) 100%)'}}/>}
  {night&&Array.from({length:18}).map((_,i)=><div key={'city'+i} style={{position:'absolute',left:(48+(i*17)%43)+'%',top:(18+(i*31)%62)+'%',width:2+(i%3),height:2+(i%3),borderRadius:'50%',background:'#f3c878',boxShadow:'0 0 7px rgba(245,202,120,.7)',opacity:.4+(i%4)*.12}}/>)}
  {controlled&&Array.from({length:12}).map((_,i)=><div key={'net'+i} style={{position:'absolute',left:r,top:r,width:r*.82,height:2,background:'linear-gradient(90deg,rgba(170,61,73,.08),rgba(200,72,84,.65))',transformOrigin:'0 50%',transform:`rotate(${i*30+mix(p,0,6)}deg)`}}/>)}
  {chaos&&Array.from({length:8}).map((_,i)=><div key={'chaos'+i} style={{position:'absolute',left:(12+i*11)+'%',top:(18+(i%4)*18)+'%',width:14,height:14,borderRadius:'50%',background:C.red,boxShadow:'0 0 24px '+C.red,opacity:.35+.45*Math.sin(p*8+i)}}/>)}
 </div>;
};

const Label=({children}:{children:React.ReactNode})=><div style={{position:'absolute',left:110,top:88,fontFamily:'Noto Sans CJK JP,sans-serif',fontSize:24,fontWeight:800,letterSpacing:4,color:'rgba(235,232,222,.52)'}}>{children}</div>;

const Lab=({p}:{p:number})=><AbsoluteFill style={{background:'linear-gradient(180deg,#0b1112,#030505)'}}><Camera p={p} zoom={1.035} dx={-10}><div style={{position:'absolute',left:150,top:120,width:1620,height:760,border:'4px solid #283330',background:'linear-gradient(180deg,#121d1c,#080c0c)'}}>{Array.from({length:6}).map((_,i)=><div key={i} style={{position:'absolute',left:100+i*250,top:95,width:150,height:500,border:'2px solid #34413e',background:'rgba(255,255,255,.015)'}}/>)}<div style={{position:'absolute',left:690,top:155,width:260,height:420,borderRadius:140,border:'4px solid #49665a',background:'rgba(58,111,86,.16)',boxShadow:'0 0 55px rgba(74,136,103,.12)'}}/><Human x={820} y={660} s={1.35} hero/><div style={{position:'absolute',right:130,top:170,width:400,height:230,border:'2px solid #345142',background:'#06100d'}}><div style={{position:'absolute',left:28,right:28,top:112,height:3,background:C.emerald,boxShadow:'0 0 16px '+C.emerald,transform:`scaleX(${.45+.45*Math.sin(p*4)})`,transformOrigin:'0 50%'}}/></div></div></Camera><Grain/><Vignette/></AbsoluteFill>;

const Newsroom=({p}:{p:number})=><AbsoluteFill style={{background:'#050707'}}><Camera p={p} zoom={1.025} dx={-12}><div style={{position:'absolute',left:160,top:130,width:1600,height:760,background:'linear-gradient(180deg,#111817,#060908)',border:'2px solid #27302e'}}>{Array.from({length:6}).map((_,i)=><div key={i} style={{position:'absolute',left:70+(i%3)*500,top:70+Math.floor(i/3)*300,width:420,height:240,background:i===0?'linear-gradient(160deg,#173b4d,#071014)':'linear-gradient(160deg,#1b2823,#09100d)',border:'1px solid #3a4a45'}}><div style={{position:'absolute',left:24,right:24,bottom:28,height:5,background:i<4?C.emerald:C.gold,transform:`scaleX(${mix(p,.2,1)})`,transformOrigin:'0 50%'}}/></div>)}</div></Camera><Label>WORLD FEED</Label><Grain/><Vignette/></AbsoluteFill>;

const EarthStage=({p,mode}:{p:number;mode:'peace'|'doom'|'control'|'chaos'|'final'})=><AbsoluteFill style={{background:'radial-gradient(circle at 50% 50%,#08131a,#020303 70%)'}}><Camera p={p} zoom={mode==='final'?1.01:1.045}><Earth p={p} size={mode==='doom'?640:760} controlled={mode==='control'||mode==='doom'} chaos={mode==='chaos'} night/>{mode==='doom'&&<Doom x={1490} y={470} s={1.12}/>} {mode==='peace'&&<div style={{position:'absolute',left:120,top:180,width:460}}>{['CONFLICT ↓','CRIME ↓','FAMINE ↓','MARKETS ↑'].map((t,i)=><div key={t} style={{marginBottom:26,fontSize:34,fontFamily:'Noto Sans,sans-serif',letterSpacing:3,color:i===3?C.gold:C.emerald,opacity:mix(p,.15,1)}}>{t}</div>)}</div>}{mode==='final'&&<div style={{position:'absolute',left:0,right:0,bottom:180,textAlign:'center',fontFamily:'Noto Sans CJK JP,sans-serif',fontWeight:900,fontSize:52,letterSpacing:3,color:C.paper,opacity:mix(p,0,1)}}>有能かどうかを、誰が決めるのか</div>}</Camera><Grain/><Vignette/></AbsoluteFill>;

const Emperor=({p}:{p:number})=><AbsoluteFill style={{background:'linear-gradient(180deg,#0a120e,#020303)'}}><Camera p={p} zoom={1.04} dy={-10}><div style={{position:'absolute',left:620,top:180,width:680,height:660,clipPath:'polygon(12% 0,88% 0,100% 100%,0 100%)',background:'linear-gradient(180deg,#242c29,#0d1210)',boxShadow:'0 0 100px rgba(54,102,72,.18)'}}/><div style={{position:'absolute',left:765,top:510,width:390,height:290,background:'linear-gradient(180deg,#373f3b,#131816)',clipPath:'polygon(15% 0,85% 0,100% 100%,0 100%)'}}/><Doom x={960} y={430} s={1.2}/><div style={{position:'absolute',left:180,top:210,fontFamily:'serif',fontSize:88,color:C.gold,opacity:.8}}>1987</div><div style={{position:'absolute',left:180,top:315,fontFamily:'serif',fontSize:42,letterSpacing:8,color:C.paper,opacity:.62}}>EMPEROR DOOM</div></Camera><Grain/><Vignette/></AbsoluteFill>;

const Prism=({p,broken=false}:{p:number;broken?:boolean})=><AbsoluteFill style={{background:'radial-gradient(circle at 48% 45%,#190d22,#040405 66%)'}}><Camera p={p} zoom={broken?1.06:1.03}><div style={{position:'absolute',left:790,top:150,width:340,height:710,clipPath:'polygon(50% 0,92% 18%,78% 100%,22% 100%,8% 18%)',background:'linear-gradient(120deg,#bd7ad9,#703684 42%,#2a1035 78%)',boxShadow:'0 0 90px rgba(154,79,190,.42)',opacity:broken?mix(p,1,.12):1,transform:`rotate(${mix(p,-3,3)}deg)`}}/>{Array.from({length:16}).map((_,i)=><div key={i} style={{position:'absolute',left:960,top:505,width:broken?mix(p,120,620):mix(p,180,760),height:3,background:'linear-gradient(90deg,rgba(210,137,236,.75),rgba(103,49,124,.05))',transformOrigin:'0 50%',transform:`rotate(${i*22.5}deg)`}}/>)}<Doom x={1460} y={470} s={.92}/>{broken&&<div style={{position:'absolute',left:0,right:0,top:500,height:4,background:C.white,boxShadow:'0 0 60px white',opacity:mix(p,0,.8)}}/>}</Camera><Grain/><Vignette/></AbsoluteFill>;

const HeroHall=({p,awaken=false}:{p:number;awaken?:boolean})=><AbsoluteFill style={{background:'linear-gradient(180deg,#111719,#030505)'}}><Camera p={p} zoom={1.025} dx={-8}><div style={{position:'absolute',left:160,top:160,width:1600,height:670,background:'linear-gradient(180deg,#1b282b,#0a0e0f)',border:'1px solid #354348'}}>{Array.from({length:7}).map((_,i)=><Human key={i} x={300+i*190} y={690} s={1.1+(i%2)*.07} hero controlled={!awaken}/>)}</div>{awaken&&<div style={{position:'absolute',left:300,right:300,top:410,height:4,background:C.blue,boxShadow:'0 0 50px '+C.blue,opacity:mix(p,0,.8)}}/>}</Camera><Grain/><Vignette/></AbsoluteFill>;

const OrderedCity=({p,walk=false}:{p:number;walk?:boolean})=><AbsoluteFill style={{background:'linear-gradient(180deg,#172a2c 0%,#0b1513 48%,#050707 100%)'}}><Camera p={p} zoom={1.04} dx={walk?-30:10}>{Array.from({length:13}).map((_,i)=><div key={i} style={{position:'absolute',left:40+i*150,top:180-(i%4)*38,width:120,height:680+(i%3)*60,background:`linear-gradient(180deg,rgba(${35+i*3},${55+i*2},${52+i},.95),#0b100e)`,clipPath:'polygon(5% 0,95% 0,100% 100%,0 100%)'}}/>)}<div style={{position:'absolute',left:0,right:0,bottom:160,height:170,background:'linear-gradient(180deg,#111817,#070a09)'}}>{Array.from({length:walk?8:5}).map((_,i)=><Human key={i} x={250+i*220} y={890} s={.75+(i%3)*.07} hero={walk&&i===1}/>)}</div></Camera><Grain/><Vignette/></AbsoluteFill>;

const Dilemma=({p}:{p:number})=><AbsoluteFill style={{background:'linear-gradient(180deg,#101817,#030404)'}}><Camera p={p} zoom={1.055}><div style={{position:'absolute',left:230,top:140,width:1460,height:760,background:'linear-gradient(180deg,#16221f,#080d0b)',border:'1px solid #2f3b37'}}><Human x={790} y={770} s={2.05} hero/><div style={{position:'absolute',right:150,top:120,width:540,height:420,background:'radial-gradient(circle,#263c35,#08100d 70%)'}}><Earth p={p} x={270} y={210} size={350}/></div></div></Camera><Grain/><Vignette/></AbsoluteFill>;

const Comparison=({p}:{p:number})=><AbsoluteFill style={{background:'#070908'}}><Camera p={p} zoom={1.015}>{['BEFORE','DOOM','AFTER'].map((t,i)=><div key={t} style={{position:'absolute',left:170+i*540,top:180,width:470,height:650,border:'2px solid rgba(215,210,198,.18)',background:i===1?'linear-gradient(180deg,#173b2a,#09100d)':'linear-gradient(180deg,#171c1a,#0b0e0d)'}}><div style={{position:'absolute',left:0,right:0,top:40,textAlign:'center',fontSize:32,letterSpacing:5,color:i===1?C.gold:C.paper}}>{t}</div>{[.7,.48,.62].map((v,j)=><div key={j} style={{position:'absolute',left:70,top:180+j*120,width:320,height:15,background:'rgba(255,255,255,.08)'}}><div style={{height:'100%',width:`${mix(p,.08,i===1?(.30+j*.08):v)*100}%`,background:i===1?C.emerald:(j===0?C.red:C.gold)}}/></div>)}</div>)}</Camera><Grain/><Vignette/></AbsoluteFill>;

const GoldenRoom=({p,permission=false}:{p:number;permission?:boolean})=><AbsoluteFill style={{background:'radial-gradient(circle at 50% 42%,#2a2418,#050606 72%)'}}><Camera p={p} zoom={1.025}><div style={{position:'absolute',left:430,top:120,width:1060,height:760,border:`5px solid ${C.gold}`,background:'linear-gradient(180deg,#2a2d26,#151713)',boxShadow:'0 0 90px rgba(194,159,89,.12)'}}><div style={{position:'absolute',left:90,top:95,width:560,height:420,background:'linear-gradient(180deg,#433d2f,#211f18)',borderRadius:24}}/><Human x={610} y={650} s={1.2}/><div style={{position:'absolute',right:90,top:120,width:220,height:500,border:`8px solid ${C.gold}`,background:'#0b0d0b'}}>{permission&&<div style={{position:'absolute',left:35,right:35,top:210,textAlign:'center',fontSize:48,fontWeight:900,color:C.gold}}>許可</div>}</div></div></Camera><Grain/><Vignette/></AbsoluteFill>;

const ThroneExit=({p}:{p:number})=><AbsoluteFill style={{background:'linear-gradient(180deg,#0d1110,#030404)'}}><Camera p={p} zoom={1.035}><div style={{position:'absolute',left:610,top:190,width:420,height:600,background:'linear-gradient(180deg,#3b4540,#151a17)',clipPath:'polygon(12% 0,88% 0,100% 100%,0 100%)'}}><Doom x={210} y={260} s={.82}/></div><div style={{position:'absolute',right:250,top:260,width:260,height:430,border:'5px solid #697871',background:'#080b0a'}}><div style={{position:'absolute',left:95,top:175,width:70,height:90,background:C.emerald,clipPath:'polygon(0 0,100% 50%,0 100%)',opacity:mix(p,.25,1)}}/></div><div style={{position:'absolute',right:230,top:720,fontSize:30,letterSpacing:5,color:C.paper,opacity:.55}}>EXIT?</div></Camera><Grain/><Vignette/></AbsoluteFill>;

const Road=({p,noBrake=false}:{p:number;noBrake?:boolean})=><AbsoluteFill style={{background:'linear-gradient(180deg,#11181a,#050606)'}}><Camera p={p} zoom={1.02}><div style={{position:'absolute',left:0,right:0,bottom:0,height:720,background:'linear-gradient(180deg,#151b1b,#080909)',clipPath:'polygon(38% 0,62% 0,91% 100%,9% 100%)'}}>{Array.from({length:8}).map((_,i)=><div key={i} style={{position:'absolute',left:956,top:360+i*95,width:8,height:60,background:C.paper,opacity:.55}}/>)}<div style={{position:'absolute',left:760,top:610,width:400,height:150,background:'linear-gradient(180deg,#224e39,#0f2119)',borderRadius:'45px 45px 25px 25px',transform:`translateY(${mix(p,80,-50)}px)`,boxShadow:'0 0 38px rgba(65,135,95,.3)'}}/>{noBrake&&<div style={{position:'absolute',left:1190,top:300,fontSize:72,fontWeight:900,color:C.red,transform:`rotate(${mix(p,-3,2)}deg)`}}>NO BRAKES</div>}</div></Camera><Grain/><Vignette/></AbsoluteFill>;

const InfoTower=({p}:{p:number})=><AbsoluteFill style={{background:'linear-gradient(180deg,#111616,#030404)'}}><Camera p={p} zoom={1.03} dy={-18}><div style={{position:'absolute',left:650,top:90,width:620,height:870,clipPath:'polygon(22% 0,78% 0,100% 100%,0 100%)',background:'linear-gradient(180deg,#293632,#0c100f)',border:'2px solid #384944'}}>{Array.from({length:6}).map((_,i)=><div key={i} style={{position:'absolute',left:130,top:650-i*105,width:360,height:54,background:i<2?'rgba(165,62,62,.38)':i<4?'rgba(199,162,93,.26)':'rgba(86,145,104,.24)',border:'1px solid rgba(255,255,255,.08)',transform:`scaleX(${mix(p,1,i<2?.75:i<4?.48:.24)})`,transformOrigin:'0 50%'}}/>)}<Doom x={310} y={150} s={.62}/></div></Camera><Grain/><Vignette/></AbsoluteFill>;

const Democracy=({p,parliament=false,distributed=false}:{p:number;parliament?:boolean;distributed?:boolean})=><AbsoluteFill style={{background:'linear-gradient(180deg,#101314,#040505)'}}><Camera p={p} zoom={1.02}>{distributed?<>{Array.from({length:9}).map((_,i)=>{const a=i*Math.PI*2/9;return <div key={i} style={{position:'absolute',left:960+Math.cos(a)*330,top:520+Math.sin(a)*280,width:150,height:150,borderRadius:'50%',background:i%3===0?'#284d5d':'#244333',border:'2px solid #637570',transform:'translate(-50%,-50%)'}}/>})}<div style={{position:'absolute',left:870,top:430,width:180,height:180,borderRadius:'50%',border:'4px solid '+C.gold}}/></>:<div style={{position:'absolute',left:170,top:180,width:1580,height:660,border:'2px solid #303a37',background:'linear-gradient(180deg,#181f1d,#090c0b)'}}>{Array.from({length:10}).map((_,i)=><div key={i} style={{position:'absolute',left:80+(i%5)*290,top:110+Math.floor(i/5)*300,width:230,height:170,borderRadius:16,background:i%2?'#203e35':'#283a43',transform:`translateY(${Math.sin(p*4+i)*4}px)`}}/>)}{parliament&&<div style={{position:'absolute',left:480,right:480,top:280,height:100,borderRadius:50,background:C.gold,opacity:.12}}/>}</div>}</Camera><Grain/><Vignette/></AbsoluteFill>;

const Data=({p,type}:{p:number;type:'intro'|'growth'|'famine'|'resilience'})=><AbsoluteFill style={{background:'#070909'}}><Camera p={p} zoom={1.012}><div style={{position:'absolute',left:160,top:130,width:1600,height:760,border:'1px solid #303a38',background:'linear-gradient(180deg,#0d1110,#080a09)'}}>{type==='intro'&&<Earth p={p} x={800} y={380} size={580}/>} {type==='growth'&&<><div style={{position:'absolute',left:140,top:100,bottom:120,width:2,background:'#59635f'}}/><div style={{position:'absolute',left:140,right:100,bottom:120,height:2,background:'#59635f'}}/><svg width="1300" height="520" style={{position:'absolute',left:140,top:100}}><polyline points={`20,430 190,410 360,390 530,330 700,305 870,245 1040,190 1210,120`} fill="none" stroke={C.emerald} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" style={{strokeDasharray:1700,strokeDashoffset:mix(p,1700,0)}}/></svg><div style={{position:'absolute',right:120,top:120,fontSize:72,fontWeight:900,color:C.gold}}>+20%</div></>} {type==='famine'&&<><div style={{position:'absolute',left:140,top:130,width:620,height:460,background:'radial-gradient(circle,#3b2b1d,#16100b 70%)',clipPath:'polygon(0 15%,20% 0,47% 14%,75% 6%,100% 26%,87% 58%,98% 90%,66% 100%,43% 83%,14% 92%,0 61%)'}}/><div style={{position:'absolute',right:180,top:220,width:560,height:300,border:'3px solid #516760'}}>{['PRESS','ELECTION','ACCOUNTABILITY'].map((t,i)=><div key={t} style={{margin:'30px 45px',fontSize:31,letterSpacing:4,color:i===2?C.emerald:C.paper}}>{t}</div>)}</div></>} {type==='resilience'&&<><div style={{position:'absolute',left:150,top:160,width:570,height:450,border:'3px solid '+C.red}}><div style={{position:'absolute',left:70,right:70,top:190,height:16,background:C.red,transform:`scaleX(${mix(p,.1,1)})`,transformOrigin:'0 50%'}}/><div style={{position:'absolute',left:70,top:245,fontSize:30,color:C.paper}}>SPEED</div></div><div style={{position:'absolute',right:150,top:160,width:570,height:450,border:'3px solid '+C.emerald}}><div style={{position:'absolute',left:70,right:70,top:190,height:16,background:C.emerald,transform:`scaleX(${mix(p,.1,.76)})`,transformOrigin:'0 50%'}}/><div style={{position:'absolute',left:70,top:245,fontSize:30,color:C.paper}}>RESILIENCE</div></div></>}</div></Camera><Grain/><Vignette/></AbsoluteFill>;

const Doom2025=({p,welcome=false,opposition=false}:{p:number;welcome?:boolean;opposition?:boolean})=><AbsoluteFill style={{background:'radial-gradient(circle at 50% 40%,#163422,#030404 70%)'}}><Camera p={p} zoom={1.035}><Doom x={960} y={360} s={1.25}/>{Array.from({length:welcome?18:opposition?7:10}).map((_,i)=><Human key={i} x={180+(i%9)*195} y={900-Math.floor(i/9)*120} s={.72+(i%3)*.04} hero={opposition} controlled={false}/>) }{opposition&&<div style={{position:'absolute',left:900,top:680,width:120,height:4,background:C.red,boxShadow:'0 0 28px '+C.red,transform:'rotate(-22deg)'}}/>}</Camera><Grain/><Vignette/></AbsoluteFill>;

const Aftermath=({p,rebuild=false}:{p:number;rebuild?:boolean})=><AbsoluteFill style={{background:'linear-gradient(180deg,#172027,#070909 70%)'}}><Camera p={p} zoom={1.025} dx={rebuild?-12:8}>{Array.from({length:9}).map((_,i)=><div key={i} style={{position:'absolute',left:40+i*220,top:180-(i%3)*35,width:180,height:700,background:'linear-gradient(180deg,#283230,#111615)',clipPath:i===3?'polygon(0 0,100% 0,88% 43%,100% 100%,0 100%)':'none'}}/>)}<div style={{position:'absolute',left:380,top:230,width:360,height:330,border:'14px solid #303c39',background:'rgba(5,8,7,.4)',clipPath:rebuild?'none':'polygon(0 0,100% 0,84% 37%,100% 100%,0 100%)'}}/><Human x={800} y={870} s={1.08}/><Human x={900} y={880} s={.72}/>{rebuild&&<>{Array.from({length:6}).map((_,i)=><div key={i} style={{position:'absolute',left:250+i*270,top:760,width:140,height:20,background:C.gold,opacity:.3}}/>)}</>}</Camera><Grain/><Vignette/></AbsoluteFill>;

const Finale=({p,heroes=false,trap=false}:{p:number;heroes?:boolean;trap?:boolean})=><AbsoluteFill style={{background:'radial-gradient(circle at 50% 42%,#121b17,#030404 72%)'}}><Camera p={p} zoom={1.04}>{heroes?<>{Array.from({length:7}).map((_,i)=><Human key={i} x={350+i*205} y={850} s={1.05+(i%2)*.06} hero/>)}<Doom x={960} y={300} s={.75}/></>:trap?<><Earth p={p} x={640} y={530} size={620}/><div style={{position:'absolute',right:230,top:220,width:500,height:600,background:'linear-gradient(180deg,#2f3935,#111615)',clipPath:'polygon(13% 0,87% 0,100% 100%,0 100%)'}}><Doom x={250} y={260} s={.88}/></div></>:<><div style={{position:'absolute',left:650,top:180,width:620,height:650,background:'linear-gradient(180deg,#2a332f,#111513)',clipPath:'polygon(10% 0,90% 0,100% 100%,0 100%)'}}/><Doom x={960} y={420} s={1.13}/></>}</Camera><Grain/><Vignette/></AbsoluteFill>;

export const CinematicArt=({kind,p}:{kind:string;p:number})=>{
 if(kind==='lab')return <Lab p={p}/>;
 if(kind==='newsroom')return <Newsroom p={p}/>;
 if(kind==='earthPeace')return <EarthStage p={p} mode="peace"/>;
 if(kind==='doomEarth')return <EarthStage p={p} mode="doom"/>;
 if(kind==='emperor')return <Emperor p={p}/>;
 if(kind==='prism')return <Prism p={p}/>;
 if(kind==='earthControl')return <EarthStage p={p} mode="control"/>;
 if(kind==='heroesControlled')return <HeroHall p={p}/>;
 if(kind==='orderedCity')return <OrderedCity p={p}/>;
 if(kind==='cityWalk')return <OrderedCity p={p} walk/>;
 if(kind==='dilemma')return <Dilemma p={p}/>;
 if(kind==='heroesAwaken')return <HeroHall p={p} awaken/>;
 if(kind==='prismBreak')return <Prism p={p} broken/>;
 if(kind==='earthChaos')return <EarthStage p={p} mode="chaos"/>;
 if(kind==='comparison')return <Comparison p={p}/>;
 if(kind==='goldenRoom')return <GoldenRoom p={p}/>;
 if(kind==='permission')return <GoldenRoom p={p} permission/>;
 if(kind==='throneExit')return <ThroneExit p={p}/>;
 if(kind==='roadFast')return <Road p={p}/>;
 if(kind==='roadNoBrake')return <Road p={p} noBrake/>;
 if(kind==='infoTower')return <InfoTower p={p}/>;
 if(kind==='alarmDemocracy')return <Democracy p={p}/>;
 if(kind==='parliament')return <Democracy p={p} parliament/>;
 if(kind==='distributed')return <Democracy p={p} distributed/>;
 if(kind==='dataIntro')return <Data p={p} type="intro"/>;
 if(kind==='growthChart')return <Data p={p} type="growth"/>;
 if(kind==='famine')return <Data p={p} type="famine"/>;
 if(kind==='resilience')return <Data p={p} type="resilience"/>;
 if(kind==='doom2025')return <Doom2025 p={p}/>;
 if(kind==='welcome')return <Doom2025 p={p} welcome/>;
 if(kind==='heroOpposition')return <Doom2025 p={p} opposition/>;
 if(kind==='aftermath')return <Aftermath p={p}/>;
 if(kind==='rebuild')return <Aftermath p={p} rebuild/>;
 if(kind==='doomQuestion')return <Finale p={p}/>;
 if(kind==='heroesQuestion')return <Finale p={p} heroes/>;
 if(kind==='trap')return <Finale p={p} trap/>;
 if(kind==='finalEarth')return <EarthStage p={p} mode="final"/>;
 return <AbsoluteFill style={{background:C.bg}}><Grain/><Vignette/></AbsoluteFill>;
};
