import React from 'react';
import {AbsoluteFill,Img,interpolate,staticFile,useCurrentFrame} from 'remotion';
import {Actor,Phone,Cake} from './actors-and-props';
import {OfficeWorkerRig} from '../../shared/asset-library/人物テンプレート/office-worker-rig';
import {OfficeWomanRig} from '../../shared/asset-library/人物テンプレート/office-woman-rig';
import {ParentFatherRig} from '../../shared/asset-library/人物テンプレート/PARENT_FATHER';
import {ParentMotherRig} from '../../shared/asset-library/人物テンプレート/PARENT_MOTHER';
import {V46_CHILD_RIG_BOY} from '../../shared/asset-library/人物テンプレート/V46_CHILD_RIG_BOY';
import {V46_CHILD_RIG_GIRL} from '../../shared/asset-library/人物テンプレート/V46_CHILD_RIG_GIRL';

const clamp=(n:number)=>Math.max(0,Math.min(1,n));
const ph=(t:number,a:number,b:number)=>clamp((t-a)/(b-a));
const asset=(p:string)=>staticFile('assets/library/'+p.replace('shared/asset-library/',''));
const P=({x,y,w,h,children,style={}}:{x:number;y:number;w:number;h:number;children?:React.ReactNode;style?:React.CSSProperties})=><div style={{position:'absolute',left:x,top:y,width:w,height:h,...style}}>{children}</div>;
const Bg=({scene,t,index}:{scene:any;t:number;index:number})=>{
 const p=scene.backgroundBindings?.[0]?.filePath;
 const dx=Math.sin(t*Math.PI*2+index*.7)*18,dy=Math.cos(t*Math.PI*1.4+index)*10,sc=1.045+.025*Math.sin(t*Math.PI+index);
 return <AbsoluteFill style={{overflow:'hidden',background:'#05080d'}}>
  {p?<Img src={asset(p)} style={{width:'100%',height:'100%',objectFit:'cover',transform:`translate(${dx}px,${dy}px) scale(${sc})`,filter:'saturate(.92) contrast(1.04)'}}/>:null}
  <AbsoluteFill style={{background:'linear-gradient(180deg,rgba(3,6,10,.12),rgba(3,6,10,.34))'}}/>
 </AbsoluteFill>;
};
const Glow=({x,y,r=120,opacity=.35}:{x:number;y:number;r?:number;opacity?:number})=><div style={{position:'absolute',left:x-r,top:y-r,width:r*2,height:r*2,borderRadius:'50%',background:`radial-gradient(circle,rgba(239,211,126,${opacity}),transparent 70%)`,filter:'blur(4px)'}}/>;
const PersonIcon=({x,y,s=1,opacity=1}:{x:number;y:number;s?:number;opacity?:number})=><svg viewBox="0 0 100 160" style={{position:'absolute',left:x,top:y,width:100*s,height:160*s,opacity}}><circle cx="50" cy="32" r="25" fill="#e7e4db"/><path d="M17 155V99q0-39 33-39t33 39v56z" fill="#9eabb8"/></svg>;
const SymbolCard=({x,y,w=220,h=120,kind='money',t=1,delay=0}:{x:number;y:number;w?:number;h?:number;kind?:string;t?:number;delay?:number})=>{
 const q=ph(t,delay,Math.min(.98,delay+.24)); const y0=y+(1-q)*90;
 return <div style={{position:'absolute',left:x,top:y0,width:w,height:h,borderRadius:18,background:'linear-gradient(145deg,#e6dcc0,#8e9daa)',border:'4px solid #d5c28b',boxShadow:'0 14px 36px #0009',opacity:q,transform:`rotate(${(1-q)*8-2}deg) scale(${.86+.14*q})`}}>
  <svg viewBox="0 0 220 120" width="100%" height="100%">
   {kind==='money'?<><circle cx="110" cy="60" r="38" fill="#5b755f"/><path d="M95 45h30M95 60h30M110 34v52" stroke="#e9dfad" strokeWidth="8"/></>:
    kind==='house'?<><path d="M45 65 110 20l65 45v40H45z" fill="#6f7f8d"/><rect x="92" y="66" width="36" height="39" fill="#e8dcc0"/></>:
    kind==='clock'?<><circle cx="110" cy="60" r="42" fill="#28333e" stroke="#e5dcc2" strokeWidth="7"/><path d="M110 60V32M110 60l25 14" stroke="#e5dcc2" strokeWidth="7" strokeLinecap="round"/></>:
    kind==='school'?<><rect x="55" y="38" width="110" height="70" fill="#718392"/><path d="M45 40 110 12l65 28" fill="#d4c084"/><rect x="98" y="69" width="24" height="39" fill="#eadfc6"/></>:
    kind==='heart'?<path d="M110 98 55 48q-13-32 17-37 24-4 38 19 14-23 38-19 30 5 17 37z" fill="#b76b72"/>:
    kind==='work'?<><rect x="55" y="35" width="110" height="72" rx="8" fill="#596b7b"/><path d="M88 35v-15h44v15" stroke="#e2d7b7" strokeWidth="8" fill="none"/></>:
    <circle cx="110" cy="60" r="42" fill="#75879a"/>}
  </svg>
 </div>;
};
const DoorRow=({t,bright=true}:{t:number;bright?:boolean})=><AbsoluteFill style={{background:'radial-gradient(circle at 50% 50%,#141c28,#030507 70%)'}}>
 {[0,1,2].map((i)=>{const q=ph(t,.08+i*.22,.32+i*.22);return <div key={i} style={{position:'absolute',left:265+i*520,top:210,width:350,height:620,perspective:1000}}>
   <Glow x={175} y={310} r={210} opacity={bright?.16+.30*q:.08}/>
   <div style={{position:'absolute',inset:10,border:'15px solid #8a7653',boxShadow:'0 20px 55px #000c'}}/>
   <div style={{position:'absolute',left:25,top:25,width:300,height:570,background:bright?`rgba(239,220,152,${.10+.26*q})`:'#151a20'}}/>
   <div style={{position:'absolute',left:25,top:25,width:300,height:570,background:'linear-gradient(90deg,#33271f,#70563c)',border:'6px solid #a1875e',transformOrigin:'left center',transform:`rotateY(${-85*q}deg)`}}/>
  </div>})}
 </AbsoluteFill>;
const Crown=({t,x=710,y=250,scale=1}:{t:number;x?:number;y?:number;scale?:number})=><svg viewBox="0 0 500 360" style={{position:'absolute',left:x,top:y,width:500*scale,height:360*scale,filter:'drop-shadow(0 20px 30px #000b)',transform:`rotate(${Math.sin(t*Math.PI*2)*2}deg) scale(${.95+.05*ph(t,.05,.35)})`}}>
 <path d="M40 270 20 65l125 100L250 35l105 130L480 65l-20 205z" fill="url(#g)" stroke="#d8c588" strokeWidth="12"/>
 <defs><linearGradient id="g"><stop stopColor="#2e333b"/><stop offset=".5" stopColor="#9a8c68"/><stop offset="1" stopColor="#222832"/></linearGradient></defs>
 {[[135,205],[250,155],[365,205]].map((p,i)=><circle key={i} cx={p[0]} cy={p[1]} r="24" fill={i===1?'#a75e63':'#667f94'}/>)}
</svg>;
const MoleRat=({x,y,s=.7,t=0,phase=0,queen=false,flip=false}:{x:number;y:number;s?:number;t?:number;phase?:number;queen?:boolean;flip?:boolean})=>{
 const bob=Math.sin((t+phase)*Math.PI*6)*7,run=Math.sin((t+phase)*Math.PI*8)*14;
 return <svg viewBox="0 0 320 180" style={{position:'absolute',left:x,top:y+bob,width:320*s,height:180*s,transform:`${flip?'scaleX(-1)':''} rotate(${run*.08}deg)`,filter:'drop-shadow(0 8px 8px #0008)'}}>
  <ellipse cx="160" cy="95" rx={queen?112:92} ry={queen?62:49} fill={queen?'#d49b91':'#c98f87'} stroke="#8f645f" strokeWidth="6"/>
  <circle cx="245" cy="85" r={queen?50:42} fill={queen?'#dca39a':'#d29a91'} stroke="#8f645f" strokeWidth="6"/>
  <circle cx="260" cy="72" r="5" fill="#17191c"/><path d="M278 91h35M278 102h30" stroke="#f4eadc" strokeWidth="12" strokeLinecap="round"/>
  <path d="M96 129 70 156M142 136 128 169M198 136 213 168M242 126 269 151" stroke="#b97d76" strokeWidth="11" strokeLinecap="round"/>
  <path d="M68 91q-34-18-45 10" fill="none" stroke="#ad766f" strokeWidth="7"/>
 </svg>;
};
const Tunnel=({t,count=7,queen=false}:{t:number;count?:number;queen?:boolean})=><AbsoluteFill style={{background:'#160f0b',overflow:'hidden'}}>
 <svg viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}}>
  <rect width="1920" height="1080" fill="#21150f"/>
  {Array.from({length:7},(_,i)=><path key={i} d={`M-100 ${120+i*145} C420 ${50+i*160} 650 ${220+i*100} 1020 ${135+i*135} S1550 ${70+i*145} 2020 ${160+i*120}`} stroke="#0a0807" strokeWidth="92" fill="none" strokeLinecap="round"/>)}
  <path d="M960 -80V1160" stroke="#0a0807" strokeWidth="88"/>
 </svg>
 {Array.from({length:count},(_,i)=>{const dir=i%2===0,xx=(dir?(-250+(t*2300+i*250)%2400):(1800-(t*2200+i*280)%2350));return <MoleRat key={i} x={xx} y={95+(i%6)*145} s={.48+(i%3)*.05} t={t} phase={i*.11} flip={!dir}/>})}
 {queen?<MoleRat x={790} y={400} s={1.15} t={t} queen/>:null}
 </AbsoluteFill>;
const Network=({t,n=12}:{t:number;n?:number})=><svg viewBox="0 0 1920 1080" style={{position:'absolute',inset:0,width:'100%',height:'100%'}}>
 {Array.from({length:n},(_,i)=>{const a=i/n*Math.PI*2,x=960+Math.cos(a)*520,y=520+Math.sin(a)*340,q=ph(t,.03+i*.035,.25+i*.035);return <React.Fragment key={i}><path d={`M960 520L${x} ${y}`} stroke="#c7b982" strokeWidth="8" opacity={q*.75} pathLength={1} strokeDasharray={1} strokeDashoffset={1-q}/><circle cx={x} cy={y} r={28+8*Math.sin(t*12+i)} fill="#8799a8" opacity={q}/></React.Fragment>})}
 <circle cx="960" cy="520" r={72+12*Math.sin(t*8)} fill="#d2bd77" opacity=".9"/>
</svg>;
const ClockRing=({t}:{t:number})=><svg viewBox="0 0 600 600" style={{position:'absolute',left:660,top:210,width:600,height:600,filter:'drop-shadow(0 12px 25px #000b)'}}>
 <circle cx="300" cy="300" r="245" fill="#111923" stroke="#d4c59b" strokeWidth="18"/>
 <circle cx="300" cy="300" r="18" fill="#e2d5ad"/>
 <path d={`M300 300 L300 105`} stroke="#e2d5ad" strokeWidth="15" transform={`rotate(${t*620} 300 300)`}/>
 <path d="M300 300L420 300" stroke="#9bb0c0" strokeWidth="12" transform={`rotate(${t*110} 300 300)`}/>
</svg>;
const GenericMotion=({scene,t,index}:{scene:any;t:number;index:number})=>{
 const m=scene.visualMode as string;
 if(scene.chapterId==='chapter3'&&!/return_tokyo|no_human_queen|time_resource_split|city_division|faceless_conditions|underground_surface_split|society_queen|small_decisions|zoom_out_mass/.test(m)){
   if(m==='queen_colony'||m==='colony_rule')return <Tunnel t={t} count={10} queen/>;
   if(m==='molerat_reveal')return <Tunnel t={t} count={1}/>;
   if(m==='lab_remove_queen')return <AbsoluteFill style={{background:'#071019'}}><Tunnel t={t*.35} count={6} queen/><div style={{position:'absolute',left:790+650*ph(t,.35,.8),top:400,opacity:1-ph(t,.5,.9)}}><MoleRat x={0} y={0} s={1.15} t={t} queen/></div></AbsoluteFill>;
   return <Tunnel t={t} count={8}/>;
 }
 if(/prospect_theory|resource_allocation|kin_selection|kin_network|city_care_network|collective_parenting/.test(m))return <AbsoluteFill style={{background:'rgba(3,7,12,.84)'}}><Network t={t} n={m==='city_care_network'?18:12}/></AbsoluteFill>;
 if(/choice_respect|choice_fork|choice_origin|choice_corridor|valid_life/.test(m))return <DoorRow t={t}/>;
 if(/faceless_queen|society_queen|society_is_queen|queen_overlay/.test(m))return <AbsoluteFill style={{background:'rgba(2,4,7,.7)'}}><Crown t={t}/>{Array.from({length:7},(_,i)=><SymbolCard key={i} x={170+i*235} y={760-90*(i%2)} kind={['money','clock','house','work','school','money','clock'][i]} t={t} delay={i*.07}/>)}</AbsoluteFill>;
 if(/hours_expand|day_squeezed|promotion_overtime|time_tradeoff|tomorrow_work/.test(m))return <AbsoluteFill><ClockRing t={t}/>{Array.from({length:5},(_,i)=><SymbolCard key={i} x={170+i*320} y={760} kind="work" t={t} delay={i*.1}/>)}</AbsoluteFill>;
 if(/worker_budget|status_pressure|housing_escalator|hard_world|parenting_standard|choice_weight|small_decisions/.test(m))return <AbsoluteFill>{['money','house','school','clock','work'].map((k,i)=><SymbolCard key={k} x={250+i*300} y={260+(i%2)*260} kind={k} t={t} delay={i*.11}/>)}</AbsoluteFill>;
 if(/education_contagion|love_to_barrier/.test(m))return <AbsoluteFill>{Array.from({length:7},(_,i)=><SymbolCard key={i} x={130+i*250} y={250+100*Math.sin(i)} kind={i%2?'school':'heart'} t={t} delay={i*.08}/>)}</AbsoluteFill>;
 if(/dry_land|descent_to_underground/.test(m))return <AbsoluteFill style={{background:'#392719'}}><P x={0} y={0} w={1920} h={420} style={{background:'#a67a48'}}/><svg viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}}><path d="M0 420H1920" stroke="#d4a66a" strokeWidth="18"/><path d="M960 420 C720 540 1200 660 930 790 S720 960 1040 1120" stroke="#090807" strokeWidth="95" fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1-ph(t,.05,.85)}/></svg></AbsoluteFill>;
 if(/zoom_out_mass|organization_zoomout|office_machine/.test(m))return <AbsoluteFill>{Array.from({length:28},(_,i)=>{const q=ph(t,.02+i*.018,.25+i*.018);return <PersonIcon key={i} x={100+(i%7)*260} y={150+Math.floor(i/7)*200} s={.55} opacity={q}/>})}</AbsoluteFill>;
 if(/mirror_society|colony_city_parallel|underground_surface_split|colony_memory/.test(m))return <AbsoluteFill><P x={0} y={0} w={1920} h={520} style={{overflow:'hidden'}}><Tunnel t={t} count={6} queen={m!=='colony_memory'}/></P><P x={0} y={540} w={1920} h={540} style={{background:'rgba(5,9,14,.7)'}}><Network t={t} n={10}/></P></AbsoluteFill>;
 if(/loss_present|work_pushes_family|future_recedes|unknown_future/.test(m))return <AbsoluteFill>{Array.from({length:4},(_,i)=><SymbolCard key={i} x={220+i*350} y={300+i%2*260} kind={['clock','money','work','house'][i]} t={1-t*.35} delay={0}/>) }<div style={{position:'absolute',left:1450+300*t,top:620,opacity:1-.55*t}}><PersonIcon x={0} y={0} s={1}/><PersonIcon x={110} y={20} s={.75}/></div></AbsoluteFill>;
 if(/train_arrives/.test(m))return <AbsoluteFill><div style={{position:'absolute',left:1920-2200*ph(t,.08,.72),top:365,width:2100,height:500,background:'#384956',border:'16px solid #1e2830',boxShadow:'0 25px 50px #000c'}}>{Array.from({length:8},(_,i)=><div key={i} style={{position:'absolute',left:90+i*250,top:70,width:180,height:180,background:'#9cb2bc88',border:'8px solid #202a31'}}><PersonIcon x={35} y={25} s={.7}/></div>)}</div></AbsoluteFill>;
 return <AbsoluteFill>{Array.from({length:5},(_,i)=><SymbolCard key={i} x={170+i*330} y={210+(i%2)*310} kind={['money','house','clock','work','heart'][i]} t={t} delay={i*.09}/>)}</AbsoluteFill>;
};
const Actors=({scene,t}:{scene:any;t:number})=>{
 const a=scene.actors||[]; const walk=ph(t,.05,.75);
 return <>{a.map((role:string,i:number)=>{
  const x=220+i*570+120*Math.sin(t*Math.PI*2+i),y=380+20*Math.cos(t*6+i);
  if(role==='hero')return <Actor key={role+i} kind="hero" x={x} y={y} scale={.68} motion={/train|night_flow/.test(scene.visualMode)?'walk':'idle'}/>;
  if(role==='peer')return <Actor key={role} kind="peer" x={330} y={360} scale={.62}/>;
  if(role==='peerSpouse')return <Actor key={role} kind="mother" x={980} y={370} scale={.62}/>;
  if(role==='peerBoy')return <Actor key={role} kind="boy" x={720} y={560} scale={.48}/>;
  if(role==='peerGirl')return <Actor key={role} kind="girl" x={1180} y={560} scale={.48}/>;
  if(role==='workerWoman')return <OfficeWomanRig key={role+i} x={x} y={y} scale={.65} action={/overtime|machine/.test(scene.visualMode)?'walk':'idle'} suitColor="#675667" pantsColor="#454451" shirtColor="#eee4d5" hairColor="#362f35"/>;
  return <OfficeWorkerRig key={role+i} x={x} y={y} scale={.65} action={/arrival|machine|overtime/.test(scene.visualMode)?'walk':'idle'} suitColor={role==='chapter2Man'?'#475a52':'#4b5365'} pantsColor="#343c45" shirtColor="#eee6d5" hairColor={role==='chapter2Man'?'#5a4435':'#2e343b'}/>;
 })}</>;
};
const EpilogueSpecial=({scene,t}:{scene:any;t:number})=>{
 const m=scene.visualMode;
 if(m==='hero_station_photo')return <><Actors scene={scene} t={t}/><Phone x={1060} y={400} scale={2.1} screen="photo" tilt={-5+5*Math.sin(t*3)}/></>;
 if(m==='peer_family_photo')return <AbsoluteFill style={{background:'rgba(5,7,10,.55)'}}><Actor kind="peer" x={360} y={300} scale={.62}/><Actor kind="mother" x={1110} y={310} scale={.62}/><Actor kind="boy" x={650} y={510} scale={.50}/><Actor kind="girl" x={1000} y={510} scale={.50}/><Cake x={810} y={760} scale={1.8}/></AbsoluteFill>;
 if(m==='close_photo')return <><Actors scene={scene} t={t}/><Phone x={1050} y={400} scale={2.0} screen="photo" tilt={-8} glow/><div style={{position:'absolute',left:1030,top:380,width:220,height:380,background:`rgba(0,0,0,${ph(t,.3,.8)})`,borderRadius:28}}/></>;
 return null;
};
export const LaterScene=({scene,index,frames}:{scene:any;index:number;frames:number})=>{
 const frame=useCurrentFrame(),t=clamp(frame/Math.max(1,frames-1));
 const special=scene.chapterId==='epilogue'?<EpilogueSpecial scene={scene} t={t}/>:null;
 return <AbsoluteFill style={{background:'#05080d',overflow:'hidden'}}>
  <Bg scene={scene} t={t} index={index}/>
  <div style={{position:'absolute',inset:0,transform:`translateX(${Math.sin((t+index*.13)*Math.PI*2)*8}px)`}}>
   <GenericMotion scene={scene} t={t} index={index}/>
   {special||<Actors scene={scene} t={t}/>}
  </div>
  <AbsoluteFill style={{background:`rgba(0,0,0,${.08+.05*Math.sin(t*Math.PI)})`,pointerEvents:'none'}}/>
 </AbsoluteFill>;
};
