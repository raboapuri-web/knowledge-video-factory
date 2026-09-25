import React from 'react';
import {AbsoluteFill,Img,interpolate,staticFile,useCurrentFrame} from 'remotion';
import {OfficeWorkerRig} from '../../shared/asset-library/人物テンプレート/office-worker-rig';
import {OfficeWomanRig} from '../../shared/asset-library/人物テンプレート/office-woman-rig';
import {ParentFatherRig} from '../../shared/asset-library/人物テンプレート/PARENT_FATHER';
import {ParentMotherRig} from '../../shared/asset-library/人物テンプレート/PARENT_MOTHER';
import {V46_CHILD_RIG_BOY} from '../../shared/asset-library/人物テンプレート/V46_CHILD_RIG_BOY';
import {V46_CHILD_RIG_GIRL} from '../../shared/asset-library/人物テンプレート/V46_CHILD_RIG_GIRL';

const clamp=(n:number)=>Math.max(0,Math.min(1,n));
const phase=(t:number,a:number,b:number)=>clamp((t-a)/(b-a));
const fade=(t:number,a=0,b=.16)=>phase(t,a,b);
const asset=(p:string)=>staticFile('assets/library/'+p.replace('shared/asset-library/',''));
const bgPath=(scene:any)=>scene.backgroundBindings?.[0]?.filePath;
const Background=({scene,shade=.18}:{scene:any;shade?:number})=>{
 const p=bgPath(scene);
 return <AbsoluteFill style={{background:'#080d13'}}>
  {p?<Img src={asset(p)} style={{width:'100%',height:'100%',objectFit:'cover'}}/>:null}
  <AbsoluteFill style={{background:`rgba(2,6,11,${shade})`}}/>
 </AbsoluteFill>;
};
const P=({children,x,y,w,h,style={}}:{children?:React.ReactNode;x:number;y:number;w:number;h:number;style?:React.CSSProperties})=>
 <div style={{position:'absolute',left:x,top:y,width:w,height:h,...style}}>{children}</div>;
const Text=({children,x,y,w=500,size=46,align='center',opacity=1}:{children:React.ReactNode;x:number;y:number;w?:number;size?:number;align?:'left'|'center'|'right';opacity?:number})=>
 <P x={x} y={y} w={w} h={120} style={{fontFamily:'Noto Sans CJK JP,sans-serif',fontSize:size,fontWeight:900,lineHeight:1.25,textAlign:align,color:'#f5f0e3',textShadow:'0 4px 12px #000',opacity}}>{children}</P>;
const Card=({x,y,label,opacity=1,scale=1}:{x:number;y:number;label:string;opacity?:number;scale?:number})=>
 <div style={{position:'absolute',left:x,top:y,width:300*scale,height:160*scale,borderRadius:18,background:'linear-gradient(145deg,#f3ead8,#cfc5ad)',border:'4px solid #857b68',boxShadow:'0 14px 34px rgba(0,0,0,.4)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Noto Sans CJK JP,sans-serif',fontSize:46*scale,fontWeight:900,color:'#20262e',opacity}}>{label}</div>;
const WorkingMan=({x,y,scale=.72,pose={}}:{x:number;y:number;scale?:number;pose?:any})=>
 <OfficeWorkerRig x={x} y={y} scale={scale} suitColor="#495a45" pantsColor="#37443b" shirtColor="#e7dfcc" hairColor="#66503e" skinColor="#d7aa86" shoeColor="#252722" pose={pose}/>;
const WorkingWoman=({x,y,scale=.72,pose={}}:{x:number;y:number;scale?:number;pose?:any})=>
 <OfficeWomanRig x={x} y={y} scale={scale} suitColor="#725b4d" pantsColor="#4c4540" shirtColor="#efe0c6" hairColor="#2d3037" skinColor="#e6b99c" shoeColor="#2a2928" pose={pose}/>;
const FarmFather=({x,y,scale=.66}:{x:number;y:number;scale?:number})=>
 <ParentFatherRig x={x} y={y} scale={scale} topColor="#786849" shirtColor="#c9b78f" pantsColor="#5c513e" hairColor="#4d3b2b" shoeColor="#3b342a"/>;
const FarmMother=({x,y,scale=.66}:{x:number;y:number;scale?:number})=>
 <ParentMotherRig x={x} y={y} scale={scale} topColor="#826b52" shirtColor="#d2c19a" pantsColor="#554a3c" hairColor="#4e3a2d" shoeColor="#3a332b"/>;
const FarmBoy=({x,y,scale=.54,variant=0}:{x:number;y:number;scale?:number;variant?:number})=>
 <V46_CHILD_RIG_BOY x={x} y={y} scale={scale} topColor={variant?'#8b704a':'#756241'} pantsColor="#65543d" hairColor={variant?'#564534':'#3c342d'} shoeColor="#44392d"/>;
const FarmGirl=({x,y,scale=.52}:{x:number;y:number;scale?:number})=>
 <V46_CHILD_RIG_GIRL x={x} y={y} scale={scale} topColor="#886a50" pantsColor="#665244" hairColor="#46372f" shoeColor="#40352d"/>;
const Hero=({x=730,y=250,scale=.78,pose={}}:{x?:number;y?:number;scale?:number;pose?:any})=>
 <OfficeWorkerRig x={x} y={y} scale={scale} pose={pose} suitColor="#304966" pantsColor="#26394d" shirtColor="#f3f5f6" hairColor="#27303a" skinColor="#dbad8d"/>;

const TopDownCards=({t}:{t:number})=>{
 const a=phase(t,.06,.24),b=phase(t,.36,.52),c=phase(t,.66,.82);
 const handX=interpolate(t,[0,.22,.35,.50,.64,.80],[1500,1170,1500,1230,1500,1320],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
 return <AbsoluteFill style={{background:'linear-gradient(100deg,#322a22,#564635)'}}>
  <P x={180} y={120} w={1560} h={760} style={{background:'#6c5239',border:'24px solid #3f3024',boxShadow:'inset 0 0 80px #2f2117',borderRadius:12}}/>
  <Card x={390} y={375} label="給料" opacity={a}/>
  <Card x={805} y={375} label="家賃" opacity={b}/>
  <Card x={1220} y={375} label="教育費" opacity={c}/>
  <svg viewBox="0 0 500 260" style={{position:'absolute',left:handX,top:360,width:500,height:260,transform:'rotate(-7deg)',filter:'drop-shadow(0 13px 18px #0008)'}}>
   <rect x="260" y="78" width="250" height="108" rx="52" fill="#26394d"/>
   <path d="M280 70 C235 60 196 88 175 117 C155 145 165 178 196 193 C225 207 255 194 284 171 L355 116 C376 99 368 69 344 60 C326 53 303 56 280 70Z" fill="#dbad8d"/>
   <rect x="157" y="118" width="138" height="30" rx="15" fill="#dbad8d" transform="rotate(-8 157 118)"/>
  </svg>
 </AbsoluteFill>;
};
const HeroTear=({scene,t}:{scene:any;t:number})=>{
 const q=phase(t,.05,.45),tear=phase(t,.42,.75);
 return <AbsoluteFill><Background scene={scene} shade={.32}/>
  <Hero x={730} y={250+22*q} scale={.78} pose={{bodyLean:8*q,headTilt:10*q,leftShoulder:18*q,rightShoulder:-18*q}}/>
  <svg viewBox="0 0 80 130" style={{position:'absolute',left:912,top:332+tear*46,width:30,height:54,opacity:tear,filter:'drop-shadow(0 0 8px #aee8ff)'}}>
   <path d="M40 0 C64 38 72 55 72 78 A32 32 0 1 1 8 78 C8 55 16 38 40 0Z" fill="#8ed7f0"/>
  </svg>
  <Card x={285} y={790} label="給料" opacity={.75} scale={.62}/><Card x={510} y={790} label="家賃" opacity={.75} scale={.62}/><Card x={735} y={790} label="教育費" opacity={.75} scale={.62}/>
 </AbsoluteFill>;
};
const WealthBadge=({t}:{t:number})=>{
 const turn=interpolate(phase(t,.28,.78),[0,1],[0,180]);
 return <AbsoluteFill style={{background:'radial-gradient(circle at 50% 40%,#283448,#070b11 68%,#020305 100%)',perspective:1200,alignItems:'center',justifyContent:'center'}}>
  <div style={{position:'absolute',left:660,top:245,width:600,height:600,transformStyle:'preserve-3d',transform:`rotateY(${turn}deg)`}}>
   <div style={{position:'absolute',inset:0,borderRadius:'50%',backfaceVisibility:'hidden',background:'radial-gradient(circle at 28% 22%,#fff4b0,#d0ad4d 24%,#8d692b 52%,#3b2d19 80%)',border:'16px ridge #d8c184',boxShadow:'inset 0 0 45px #fff3,0 28px 80px #000c',display:'flex',alignItems:'center',justifyContent:'center'}}>
    <svg viewBox="0 0 300 300" width="350"><path d="M55 220 L118 154 L158 183 L242 77" stroke="#f8f0cf" strokeWidth="24" fill="none" strokeLinecap="round"/><path d="M211 78 H242 V111" stroke="#f8f0cf" strokeWidth="24" fill="none" strokeLinecap="round"/><circle cx="83" cy="101" r="42" fill="#f3e2a0" opacity=".82"/><path d="M68 101h30M83 86v30" stroke="#715421" strokeWidth="7"/></svg>
   </div>
   <div style={{position:'absolute',inset:0,borderRadius:'50%',backfaceVisibility:'hidden',transform:'rotateY(180deg)',background:'radial-gradient(circle at 28% 22%,#eef2f5,#9aa8b5 25%,#566372 53%,#202731 83%)',border:'16px ridge #c6cdd3',boxShadow:'inset 0 0 45px #fff4,0 28px 80px #000c',display:'flex',alignItems:'center',justifyContent:'center'}}>
    <svg viewBox="0 0 300 300" width="350"><circle cx="150" cy="105" r="43" fill="#eef2f5"/><path d="M82 236 Q83 161 150 161 Q217 161 218 236" fill="#eef2f5"/><circle cx="226" cy="192" r="32" fill="#eef2f5"/><path d="M54 55 L250 251" stroke="#b51d29" strokeWidth="27" strokeLinecap="round"/></svg>
   </div>
  </div>
 </AbsoluteFill>;
};
const WorkerIcons=({t}:{t:number})=>{
 const count=Math.min(6,1+Math.floor(phase(t,.12,.88)*6));
 return <AbsoluteFill style={{background:'#020305',alignItems:'center',justifyContent:'center'}}>
  <div style={{display:'flex',gap:38,alignItems:'flex-end'}}>{Array.from({length:6},(_,i)=><svg key={i} viewBox="0 0 100 160" width="150" height="240" style={{opacity:i<count?1:.08,transform:`translateY(${i<count?0:28}px)`,transition:'none',filter:i<count?'drop-shadow(0 0 12px #b6c6d566)':'none'}}>
   <circle cx="50" cy="35" r="27" fill="#d8dee4"/><path d="M18 154V102q0-43 32-43t32 43v52z" fill="#9eabb8" stroke="#edf0f2" strokeWidth="3"/>
  </svg>)}</div>
 </AbsoluteFill>;
};
const WindingRoad=({t}:{t:number})=>{
 const draw=phase(t,.05,.86);
 return <AbsoluteFill style={{background:'#020305'}}>
  <svg viewBox="0 0 1920 1080" style={{position:'absolute',inset:0,width:'100%',height:'100%'}}>
   <path d="M930 1080 C540 930 1380 825 970 680 C590 545 1310 430 980 300 C720 198 1180 105 955 -40" fill="none" stroke="#232b34" strokeWidth="116" strokeLinecap="round"/>
   <path d="M930 1080 C540 930 1380 825 970 680 C590 545 1310 430 980 300 C720 198 1180 105 955 -40" fill="none" stroke="#d6d8d5" strokeWidth="12" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1-draw} style={{filter:'drop-shadow(0 0 12px #d4e7ff88)'}}/>
   {[
    {x:690,y:820,s:'住'},{x:1190,y:555,s:'食'},{x:750,y:286,s:'学'}
   ].map((a,i)=><g key={a.s} opacity={phase(t,.26+i*.17,.42+i*.17)}><circle cx={a.x} cy={a.y} r="63" fill="#101923" stroke="#d9c993" strokeWidth="7"/><text x={a.x} y={a.y+19} textAnchor="middle" fontFamily="Noto Sans CJK JP" fontSize="55" fontWeight="900" fill="#f0e6c7">{a.s}</text></g>)}
  </svg>
 </AbsoluteFill>;
};
const IconPerson=({x,y,scale=1,opacity=1}:{x:number;y:number;scale?:number;opacity?:number})=><svg viewBox="0 0 100 160" style={{position:'absolute',left:x,top:y,width:100*scale,height:160*scale,opacity}}><circle cx="50" cy="35" r="25" fill="#e7e4db"/><path d="M17 155V100q0-39 33-39t33 39v55z" fill="#a9b3bc"/></svg>;

const ResourceFlow=({t}:{t:number})=><AbsoluteFill style={{background:'#070b11'}}>
 <IconPerson x={870} y={390} scale={1.5}/><Text x={770} y={665} w={380} size={42}>子供</Text>
 <svg viewBox="0 0 1920 1080" style={{position:'absolute',inset:0,width:'100%',height:'100%'}}>
  <path d="M700 520 C520 500 430 420 300 350" stroke="#d8b96b" strokeWidth="16" fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1-phase(t,.08,.45)}/>
  <path d="M1215 520 C1410 500 1510 430 1640 350" stroke="#8fb7d2" strokeWidth="16" fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1-phase(t,.42,.82)}/>
  <path d="M305 350l43-10-20 39z" fill="#d8b96b"/><path d="M1215 520l42-17-11 43z" fill="#8fb7d2"/>
 </svg>
 <Text x={130} y={245} w={500} size={38}>家の仕事・収穫</Text><Text x={1300} y={245} w={500} size={38}>住居・食事・教育・時間</Text>
 <Text x={145} y={835} w={520} size={34}>昔：子供から家族へ</Text><Text x={1265} y={835} w={520} size={34}>今：家族から子供へ</Text>
</AbsoluteFill>;

const SimpleChart=({t}:{t:number})=><AbsoluteFill style={{background:'#05090f'}}>
 <svg viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}}>
  <path d="M250 850H1680M300 900V190" stroke="#7c8790" strokeWidth="6"/>
  <path d="M330 760 C620 690 850 560 1120 420 C1320 310 1490 250 1650 205" stroke="#d7bd6b" strokeWidth="18" fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1-phase(t,.08,.62)}/>
  <path d="M330 305 C610 360 860 470 1110 610 C1320 720 1500 780 1650 820" stroke="#7daac9" strokeWidth="18" fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1-phase(t,.3,.9)}/>
 </svg>
 <Text x={1150} y={145} w={520} size={42}>豊かさ ↑</Text><Text x={1120} y={820} w={550} size={42}>出生率 ↓</Text>
</AbsoluteFill>;
const BudgetSplit=({t}:{t:number})=><AbsoluteFill style={{background:'#05090f'}}>
 <Text x={660} y={110} w={600} size={52}>同じ予算</Text>
 <P x={830} y={235} w={260} h={90} style={{borderRadius:16,background:'#d2b96c',boxShadow:'0 12px 30px #0008'}}/>
 <svg viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}}><path d="M960 325 C870 430 600 430 480 560M960 325 C1050 430 1320 430 1440 560" stroke="#ddd" strokeWidth="12" fill="none"/></svg>
 {[0,1,2].map(i=><IconPerson key={i} x={280+i*190} y={625} scale={.95} opacity={phase(t,.25+i*.08,.48+i*.08)}/>)}
 <IconPerson x={1360} y={590} scale={1.25} opacity={phase(t,.45,.7)}/>
 <Text x={190} y={830} w={690} size={34}>3人へ分ける</Text><Text x={1160} y={830} w={650} size={34}>1人へ集中</Text>
</AbsoluteFill>;
const Checklist=({t}:{t:number})=><AbsoluteFill style={{background:'rgba(4,8,12,.68)'}}>
 {['貯蓄','仕事','住まい'].map((x,i)=>{const q=phase(t,.12+i*.22,.3+i*.22);return <div key={x} style={{position:'absolute',left:570,top:240+i*170,width:780,height:110,borderRadius:16,border:'3px solid #c7c0aa',background:'#1a222bcf',color:'#f4ead1',fontFamily:'Noto Sans CJK JP',fontSize:48,fontWeight:800,padding:'22px 36px',boxSizing:'border-box'}}><span style={{display:'inline-block',width:68,height:68,border:'4px solid #d7cbab',marginRight:35,verticalAlign:'middle',position:'relative'}}>{q>.5?<span style={{position:'absolute',left:10,top:-8,fontSize:62}}>✓</span>:null}</span>{x}</div>})}
</AbsoluteFill>;

export const Chapter1Scene=({scene,index,frames}:{scene:any;index:number;frames:number})=>{
 const frame=useCurrentFrame(),t=clamp(frame/Math.max(1,frames-1));
 switch(index){
  case 0:return <AbsoluteFill><Background scene={scene} shade={.28}/><Hero x={720} y={250} scale={.78}/><Card x={230} y={730} label="給料" opacity={fade(t)}/><Card x={610} y={730} label="家賃" opacity={fade(t,.16,.34)}/><Card x={990} y={730} label="生活費" opacity={fade(t,.34,.52)}/></AbsoluteFill>;
  case 1:return <TopDownCards t={t}/>;
  case 2:return <HeroTear scene={scene} t={t}/>;
  case 3:return <AbsoluteFill><Background scene={scene} shade={.32}/><P x={610} y={300} w={700} h={470} style={{background:'#e8dec7',border:'8px solid #75634b',transform:`perspective(800px) rotateX(${10-8*t}deg)`,boxShadow:'0 20px 60px #000a'}}><div style={{fontFamily:'serif',fontSize:55,color:'#4b3c2b',padding:70,textAlign:'center'}}>HISTORY</div><div style={{height:5,background:'#826e54',margin:'0 70px'}}/></P></AbsoluteFill>;
  case 4:return <AbsoluteFill><Background scene={scene} shade={.12}/><FarmFather x={230} y={330}/><FarmMother x={1270} y={330}/><FarmBoy x={620} y={520}/><FarmGirl x={900} y={525}/><FarmBoy x={1120} y={540} scale={.48} variant={1}/></AbsoluteFill>;
  case 5:return <AbsoluteFill><Background scene={scene} shade={.35}/><FarmFather x={280} y={350}/><FarmBoy x={680} y={520}/><FarmGirl x={960} y={520}/><FarmBoy x={1220} y={545} scale={.47} variant={1}/><P x={180} y={760} w={470} h={100} style={{background:'#c3aa79aa',borderRadius:18}}/><P x={1450} y={680} w={150} h={100} style={{background:'#d2c7af99',borderRadius:14}}/></AbsoluteFill>;
  case 6:return <AbsoluteFill><Background scene={scene} shade={.24}/><P x={50} y={80} w={560} h={790}><Img src={asset('shared/asset-library/背景/BG_town.png')} style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:20}}/></P><P x={680} y={80} w={560} h={790}><Img src={asset('shared/asset-library/背景/BG_hospital.png')} style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:20}}/></P><P x={1310} y={80} w={560} h={790}><Img src={asset('shared/asset-library/背景/BG_office.png')} style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:20}}/></P></AbsoluteFill>;
  case 7:return <SimpleChart t={t}/>;
  case 8:return <WealthBadge t={t}/>;
  case 9:return <ResourceFlow t={t}/>;
  case 10:return <AbsoluteFill><Background scene={scene} shade={.14}/><FarmFather x={260} y={350}/><FarmMother x={1300} y={350}/><FarmBoy x={770} y={520}/><FarmGirl x={990} y={530}/><P x={720} y={820} w={150} h={90} style={{background:'#9a7049',borderRadius:10}}/></AbsoluteFill>;
  case 11:return <AbsoluteFill><Background scene={scene} shade={.1}/><FarmBoy x={260+450*t} y={520} variant={0}/><FarmGirl x={820} y={525}/><FarmBoy x={1260} y={535} scale={.5} variant={1}/><P x={640} y={770} w={120} h={120} style={{background:'#8f6d3e',borderRadius:16}}/><P x={1390} y={720} w={180} h={90} style={{background:'#79623d',borderRadius:10}}/></AbsoluteFill>;
  case 12:return <AbsoluteFill><Background scene={scene} shade={.2}/><FarmMother x={430} y={350}/><FarmBoy x={900} y={520}/><FarmGirl x={1170} y={530}/><P x={760} y={735} w={210} h={100} style={{background:'#c7a876',borderRadius:14}}/><P x={1100} y={760} w={180} h={80} style={{background:'#90775b',borderRadius:14}}/></AbsoluteFill>;
  case 13:return <WorkerIcons t={t}/>;
  case 14:return <AbsoluteFill style={{background:'#060a10'}}><Text x={680} y={115} w={560} size={48}>現代の家庭</Text><P x={760} y={360} w={400} h={180} style={{borderRadius:24,background:'#263746',border:'3px solid #9fb4c5'}}><Text x={20} y={45} w={360} size={38}>給与</Text></P><svg viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}}><path d="M960 545 L520 790M960 545 L960 820M960 545 L1400 790" stroke="#d9c987" strokeWidth="14"/></svg><Text x={280} y={820} w={460} size={34}>住まい</Text><Text x={730} y={850} w={460} size={34}>食事</Text><Text x={1190} y={820} w={460} size={34}>教育</Text></AbsoluteFill>;
  case 15:return <WindingRoad t={t}/>;
  case 16:return <AbsoluteFill><Background scene={scene} shade={.38}/><svg viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}}><circle cx="960" cy="520" r={160+250*phase(t,.25,.85)} fill="none" stroke="#ecdfb9" strokeWidth="10" opacity={.7}/><path d="M960 520 L690 280M960 520 L1260 280M960 520 L960 130" stroke="#e9e1ca" strokeWidth="9"/></svg></AbsoluteFill>;
  case 17:return <AbsoluteFill><Background scene={scene} shade={.42}/><P x={750} y={680} w={420} h={140} style={{background:'#e1d6bc',borderRadius:70}}/><svg viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}}>{[0,1,2].map(i=><path key={i} d={`M960 680 C${860+i*110} 500 ${630+i*330} 340 ${470+i*500} 180`} stroke={i===1?'#e1c66f':'#92aec1'} strokeWidth="16" fill="none"/>)}</svg></AbsoluteFill>;
  case 18:return <AbsoluteFill style={{background:'#05090f'}}><IconPerson x={875} y={390} scale={1.4}/>{['住居','食事','教育','時間'].map((x,i)=>{const r=150+i*78;return <div key={x} style={{position:'absolute',left:960-r,top:505-r,width:r*2,height:r*2,borderRadius:'50%',border:`7px solid rgba(210,190,130,${.9-i*.12})`,opacity:phase(t,.12+i*.14,.3+i*.14)}}/>})}</AbsoluteFill>;
  case 19:return <AbsoluteFill><Background scene={scene} shade={.25}/><P x={500} y={180} w={920} h={700} style={{background:'#e8e0cc',border:'9px solid #675d4c',transform:'rotate(-2deg)',boxShadow:'0 20px 60px #0009'}}><Text x={130} y={90} w={660} size={46}>1960</Text><Text x={120} y={210} w={680} size={38}>子供の人数</Text><Text x={120} y={370} w={680} size={38}>一人あたりの資源</Text><div style={{position:'absolute',left:140,top:540,width:600,height:18,background:'#866f4e'}}/></P></AbsoluteFill>;
  case 20:return <BudgetSplit t={t}/>;
  case 21:return <AbsoluteFill style={{background:'#05090f'}}><IconPerson x={440} y={510} scale={1.25}/>{Array.from({length:5},(_,i)=><Card key={i} x={880} y={180+i*135} label={['住居','食事','教育','時間','安全'][i]} opacity={phase(t,.08+i*.12,.28+i*.12)} scale={.72}/>)}<Text x={1110} y={850} w={600} size={36}>同じ条件の枠は少なくなる</Text></AbsoluteFill>;
  case 22:return <AbsoluteFill><Background scene={scene} shade={.16}/><WorkingMan x={430} y={350}/><WorkingWoman x={1050} y={350}/><P x={780} y={700} w={360} h={150} style={{background:'#f1e2bdcc',borderRadius:18}}/><P x={245} y={120} w={220} h={120} style={{background:'#685440',borderRadius:20}}/><P x={1460} y={130} w={220} h={120} style={{background:'#685440',borderRadius:20}}/></AbsoluteFill>;
  case 23:return <AbsoluteFill><Background scene={scene} shade={.16}/><WorkingMan x={420} y={350}/><WorkingWoman x={1070} y={350}/><svg viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}}><path d="M300 780H1620M455 730V830M1465 730V830" stroke="#e8d6a5" strokeWidth="11" strokeDasharray="18 12"/></svg><P x={820} y={760} w={280} h={110} style={{background:'#d7ccb6',borderRadius:14}}><Text x={10} y={22} w={260} size={31}>貯金</Text></P></AbsoluteFill>;
  case 24:return <AbsoluteFill><Background scene={scene} shade={.28}/><WorkingMan x={360} y={365}/><WorkingWoman x={1140} y={365}/><P x={670} y={210} w={580} h={520} style={{background:'#e7dfcc',borderRadius:20,boxShadow:'0 20px 50px #0009'}}>{['朝 送る','夕 迎える','病気 欠勤'].map((x,i)=><div key={x} style={{fontFamily:'Noto Sans CJK JP',fontSize:42,fontWeight:800,color:'#353c43',margin:'65px 70px'}}>{x}</div>)}</P></AbsoluteFill>;
  case 25:return <AbsoluteFill><Background scene={scene} shade={.38}/><WorkingMan x={290} y={420} scale={.55}/><WorkingWoman x={1270} y={420} scale={.55}/>{Array.from({length:6},(_,i)=><Card key={i} x={720} y={120+i*130} label={`学年 ${i+1}`} opacity={phase(t,.08+i*.11,.25+i*.11)} scale={.68}/>)}</AbsoluteFill>;
  case 26:return <AbsoluteFill><Background scene={scene} shade={.38}/><WorkingMan x={330} y={400}/><WorkingWoman x={1210} y={400}/><Checklist t={t}/></AbsoluteFill>;
  case 27:return <AbsoluteFill><Background scene={scene} shade={.33}/><WorkingMan x={300} y={370} pose={{rightShoulder:-35}}/><WorkingWoman x={1180} y={370} pose={{leftShoulder:35}}/><P x={710} y={160} w={500} h={650} style={{background:'#111a23cc',borderRadius:24}}>{['責任','勉強','残業'].map((x,i)=><Text key={x} x={40} y={80+i*180} w={420} size={44} opacity={phase(t,.08+i*.23,.28+i*.23)}>{x}</Text>)}</P></AbsoluteFill>;
  case 28:return <AbsoluteFill><Background scene={scene} shade={.25}/><P x={410} y={620} w={1100} h={180} style={{background:'#4c4034',borderRadius:22}}/><P x={560} y={420} w={170} h={240} style={{border:'12px solid #665542',borderBottom:'none'}}/><P x={1190} y={420} w={170} h={240} style={{border:'12px solid #665542',borderBottom:'none'}}/><WorkingMan x={230+530*phase(t,0,.45)} y={350} scale={.58}/><WorkingWoman x={1300-530*phase(t,.55,1)} y={350} scale={.58}/><Text x={755} y={205} w={420} size={54}>時間だけが進む</Text></AbsoluteFill>;
  case 29:return <AbsoluteFill><Background scene={scene} shade={.26}/><WorkingMan x={310} y={390}/><WorkingWoman x={1240} y={390}/><div style={{position:'absolute',left:610,top:150,width:700,height:115,borderRadius:18,background:'#d0b765'}}/><Text x={650} y={170} w={620} size={45}>収入 ↑</Text><P x={810} y={390} w={300} h={400} style={{background:'#171e27cc',borderRadius:20}}><Text x={30} y={70} w={240} size={38}>仕事</Text><Text x={30} y={210} w={240} size={38}>時計</Text></P></AbsoluteFill>;
  case 30:return <AbsoluteFill><Background scene={scene} shade={.15}/><FarmBoy x={500+350*t} y={520} variant={0}/><P x={1150} y={740} w={260} h={120} style={{background:'#7b623d',borderRadius:16}}/></AbsoluteFill>;
  case 31:return <AbsoluteFill><Background scene={scene} shade={.28}/><WorkingMan x={300} y={370}/><WorkingWoman x={1230} y={370}/>{Array.from({length:6},(_,i)=><Card key={i} x={760+(i%2)*230} y={170+Math.floor(i/2)*180} label={['仕事','貯蓄','住居','時間','教育','安心'][i]} opacity={phase(t,.05+i*.1,.22+i*.1)} scale={.62}/>)}</AbsoluteFill>;
  case 32:return <AbsoluteFill><Background scene={scene} shade={.35}/><WorkingMan x={350} y={370}/><WorkingWoman x={1120} y={370}/><Text x={760} y={130} w={400} size={60}>{String(2026+Math.floor(phase(t,.05,.95)*6))}</Text><P x={700} y={300} w={520} h={520} style={{border:'5px solid #8b96a0',borderRadius:18}}>{Array.from({length:12},(_,i)=><div key={i} style={{display:'inline-block',width:95,height:70,margin:16,background:i<Math.floor(t*12)?'#a66f5d':'#343c45',borderRadius:8}}/>)}</P></AbsoluteFill>;
  case 33:return <AbsoluteFill style={{background:'#04070b'}}><P x={835} y={250} w={250} h={250} style={{borderRadius:'50%',border:'22px solid #c8b98e'}}/><div style={{position:'absolute',left:958,top:375,width:14,height:95,background:'#e7dfc5',transformOrigin:'top',transform:`rotate(${t*250}deg)`}}/>{Array.from({length:5},(_,i)=><Card key={i} x={170+i*310} y={760} label="仕事" opacity={phase(t,.08+i*.12,.28+i*.12)} scale={.62}/>)}
   <div style={{position:'absolute',left:1450+260*t,top:250,opacity:1-t*.65}}><IconPerson x={0} y={0} scale={1.3}/><IconPerson x={120} y={20} scale={.9}/></div></AbsoluteFill>;
  case 34:return <AbsoluteFill><Background scene={scene} shade={.35}/><WorkingMan x={310} y={390}/><WorkingWoman x={1210} y={390}/>{['住居','貯蓄','仕事'].map((x,i)=><Card key={x} x={580+i*280} y={650} label={x} opacity={1} scale={.65}/>)}<Card x={810} y={180} label="さらに必要？" opacity={phase(t,.42,.72)} scale={1}/></AbsoluteFill>;
  case 35:return <AbsoluteFill><Background scene={scene} shade={.28}/>{[
    {x:150,y:160,l:'同僚'},{x:610,y:130,l:'親子'},{x:1060,y:160,l:'住まい'},{x:1420,y:190,l:'旅行'},
    {x:400,y:520,l:'教育'},{x:980,y:520,l:'投稿'}
   ].map((a,i)=><P key={a.l} x={a.x} y={a.y} w={320} h={190} style={{borderRadius:18,background:'rgba(24,34,44,.88)',border:'3px solid #98a8b5',opacity:phase(t,.06+i*.11,.24+i*.11),boxShadow:'0 16px 38px #0008'}}><Text x={10} y={55} w={300} size={37}>{a.l}</Text></P>)}</AbsoluteFill>;
  default:return <AbsoluteFill><Background scene={scene}/></AbsoluteFill>;
 }
};
