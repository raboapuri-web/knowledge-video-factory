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

const selectBackground=(scene:any,index:number)=>{
 const m=String(scene.visualMode||'');
 const ch=String(scene.chapterId||'');
 const pick=(xs:string[])=>xs[Math.abs(index)%xs.length];
 if(ch==='chapter2'){
  if(/city_arrival/.test(m))return 'shared/asset-library/背景/BG_V46_SUBWAY_ENTRANCE.png';
  if(/salary_up|work_pushes_family/.test(m))return 'shared/asset-library/背景/BG_office.png';
  if(/consumption_up/.test(m))return pick(['shared/asset-library/背景/BG_cafenaiso.png','shared/asset-library/背景/BG_supermarket.png']);
  if(/social_comparison/.test(m))return 'shared/asset-library/背景/BG_SNS.png';
  if(/parenting_standard/.test(m))return pick(['shared/asset-library/背景/BG_school.png','shared/asset-library/背景/BG_V46_RESIDENTIAL_STREET_NIGHT.png','shared/asset-library/背景/BG_TOWN_DAY_WIDE.png']);
  if(/freedom_lifestyle|single_life/.test(m))return pick(['shared/asset-library/背景/BG_MOVIE.png','shared/asset-library/背景/BG_cafenaiso.png','shared/asset-library/背景/BG_TOWN_NIGHT_WIDE.png','shared/asset-library/背景/BG_kouen.png']);
  if(/relative_poverty|status_pressure|city_choice|hard_world|world_shapes_choice/.test(m))return pick(['shared/asset-library/背景/BG_TOWN_DAY_WIDE.png','shared/asset-library/背景/BG_V46_RESIDENTIAL_STREET_NIGHT.png','shared/asset-library/背景/BG_hudousan.png','shared/asset-library/背景/BG_office.png']);
  if(/choice_|prospect_theory|loss_present|future_gain_blur|self_selection|resource_/.test(m))return pick(['shared/asset-library/背景/BG_darkroom.png','shared/asset-library/背景/BG_syosai.png','shared/asset-library/背景/BG_kenkyu.png']);
  if(/descent_to_underground/.test(m))return 'shared/asset-library/背景/BG_V46_CH1_RURAL_FIELD.png';
 }
 if(ch==='chapter3'){
  if(/dry_land/.test(m))return 'shared/asset-library/背景/BG_V46_CH1_RURAL_FIELD.png';
  if(/environment_switch|kin_selection|latent_reproduction/.test(m))return 'shared/asset-library/背景/BG_kenkyu.png';
  if(/time_resource_split|city_division|zoom_out_mass/.test(m))return pick(['shared/asset-library/背景/BG_TOWN_DAY_WIDE.png','shared/asset-library/背景/BG_office.png','shared/asset-library/背景/BG_town.png']);
  if(/faceless_conditions/.test(m))return 'shared/asset-library/背景/BG_darkroom.png';
  return 'shared/asset-library/背景/BG_darkroom.png';
 }
 if(ch==='chapter4'){
  if(/office_machine|office_system|promotion_overtime|organization_zoomout|money_cycle/.test(m))return pick(['shared/asset-library/背景/BG_office.png','shared/asset-library/背景/BG_V46_PEER_COMPANY_OFFICE.png','shared/asset-library/背景/BG_V46_PEER_COMPANY_WORKSPACE.png','shared/asset-library/背景/BG_V46_CLIENT_MEETING_ROOM.png']);
  if(/owner_home/.test(m))return pick(['shared/asset-library/背景/BG_V46_PEER_LIVING_ROOM.png','shared/asset-library/背景/BG_ROOM_DAY.png']);
  if(/worker_budget|career_fear|care_worker_home/.test(m))return pick(['shared/asset-library/背景/BG_oneroom_night.png','shared/asset-library/背景/BG_ROOM_DAY.png','shared/asset-library/背景/BG_office.png']);
  if(/city_demand|housing_escalator|pressure_on_all/.test(m))return pick(['shared/asset-library/背景/BG_TOWN_DAY_WIDE.png','shared/asset-library/背景/BG_V46_RESIDENTIAL_STREET_NIGHT.png','shared/asset-library/背景/BG_hudousan.png']);
  if(/education_contagion|dependent_child/.test(m))return pick(['shared/asset-library/背景/BG_school.png','shared/asset-library/背景/BG_ROOM_DAY.png']);
  if(/kramer_theory/.test(m))return 'shared/asset-library/背景/BG_kenkyu.png';
  if(/village_care|history_pullback/.test(m))return pick(['shared/asset-library/背景/BG_V46_CH1_RURAL_HOME.png','shared/asset-library/背景/BG_V46_CH1_RURAL_FIELD.png']);
  if(/city_care_network|collective_parenting|caregiver_paradox/.test(m))return pick(['shared/asset-library/背景/BG_hospital.png','shared/asset-library/背景/BG_school.png','shared/asset-library/背景/BG_TOWN_DAY_WIDE.png','shared/asset-library/背景/BG_office.png']);
  return pick(['shared/asset-library/背景/BG_darkroom.png','shared/asset-library/背景/BG_town.png']);
 }
 if(ch==='epilogue'){
  if(/friday_return|night_flow/.test(m))return pick(['shared/asset-library/背景/BG_V46_OFFICE_STREET_NIGHT.png','shared/asset-library/背景/BG_V46_OFFICE_STREET_NIGHT2.png']);
  if(/hero_station_photo|train_arrives/.test(m))return pick(['shared/asset-library/背景/BG_densha.png','shared/asset-library/背景/BG_subway.png']);
  if(/peer_family_photo/.test(m))return 'shared/asset-library/背景/BG_V46_PEER_LIVING_ROOM.png';
  if(/hero_life/.test(m))return pick(['shared/asset-library/背景/BG_cafenaiso.png','shared/asset-library/背景/BG_kouen.png','shared/asset-library/背景/BG_TOWN_NIGHT_WIDE.png']);
  if(/hero_acceptance|tomorrow_work|unknown_future/.test(m))return pick(['shared/asset-library/背景/BG_oneroom_night.png','shared/asset-library/背景/BG_office.png']);
  if(/alternate_self/.test(m))return 'shared/asset-library/背景/BG_TOWN_DAY_WIDE.png';
  if(/human_roles|supports_child_elsewhere/.test(m))return pick(['shared/asset-library/背景/BG_TOWN_DAY_WIDE.png','shared/asset-library/背景/BG_school.png','shared/asset-library/背景/BG_hospital.png']);
  if(/valid_life/.test(m))return pick(['shared/asset-library/背景/BG_kouen.png','shared/asset-library/背景/BG_cafenaiso.png']);
  return 'shared/asset-library/背景/BG_darkroom.png';
 }
 return scene.backgroundBindings?.[0]?.filePath;
};

const Bg=({scene,t,index}:{scene:any;t:number;index:number})=>{
 const p=selectBackground(scene,index);
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

const PanelImage=({path,x,y,w,h,opacity=1}:{path:string;x:number;y:number;w:number;h:number;opacity?:number})=><div style={{position:'absolute',left:x,top:y,width:w,height:h,overflow:'hidden',borderRadius:24,border:'5px solid rgba(230,220,190,.55)',boxShadow:'0 18px 46px #0009',opacity}}><Img src={asset(path)} style={{width:'100%',height:'100%',objectFit:'cover'}}/></div>;
const Family=({x,y,s=1,opacity=1}:{x:number;y:number;s?:number;opacity?:number})=><div style={{position:'absolute',left:x,top:y,opacity,transform:'scale('+s+')',transformOrigin:'top left'}}><PersonIcon x={0} y={0} s={1}/><PersonIcon x={115} y={8} s={.95}/><PersonIcon x={55} y={155} s={.62}/><PersonIcon x={145} y={165} s={.56}/></div>;
const Arrow=({x1,y1,x2,y2,opacity=.8,w=8}:{x1:number;y1:number;x2:number;y2:number;opacity?:number;w?:number})=><svg viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}}><defs><marker id="arr" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="#d5c18a"/></marker></defs><path d={'M'+x1+' '+y1+' L'+x2+' '+y2} stroke="#d5c18a" strokeWidth={w} opacity={opacity} markerEnd="url(#arr)"/></svg>;
const PeopleGrid=({t,count=28}:{t:number;count?:number})=><>{Array.from({length:count},(_,i)=>{const q=ph(t,.01+i*.015,.18+i*.015);return <PersonIcon key={i} x={80+(i%8)*225} y={105+Math.floor(i/8)*215} s={.48+(i%3)*.04} opacity={q}/>})}</>;
const SocialWindows=({t}:{t:number})=><>{Array.from({length:6},(_,i)=>{const q=ph(t,.05+i*.09,.24+i*.09);return <div key={i} style={{position:'absolute',left:110+(i%3)*590,top:120+Math.floor(i/3)*420,width:500,height:330,borderRadius:24,background:'rgba(8,13,20,.86)',border:'5px solid #8396a6',boxShadow:'0 18px 42px #0009',opacity:q,transform:'translateY('+(1-q)*70+'px)'}}><PersonIcon x={65} y={70} s={.72}/><Family x={220} y={65} s={.58}/></div>})}</>;
const OfficeFlow=({t}:{t:number})=><><PeopleGrid t={t} count={20}/><svg viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}}><path d="M120 860 C520 690 770 920 1040 735 S1510 650 1800 440" fill="none" stroke="#d7c58b" strokeWidth="15" strokeDasharray="24 18" strokeDashoffset={-t*180}/></svg><SymbolCard x={1460} y={180} kind="money" t={t}/></>;
const Budget=({t}:{t:number})=><><div style={{position:'absolute',left:190,top:480,width:1540,height:95,borderRadius:48,background:'#1a222c',border:'7px solid #c9b77c'}}><div style={{height:'100%',width:(82-50*ph(t,.1,.86))+'%',background:'linear-gradient(90deg,#8aa08c,#d3bd7d)',borderRadius:40}}/></div>{['house','work','school','clock'].map((k,i)=><SymbolCard key={k} x={260+i*370} y={655} kind={k} t={t} delay={i*.1}/>)}</>;
const WorldSplit=({t,left='shared/asset-library/背景/BG_TOWN_DAY_WIDE.png',right='shared/asset-library/背景/BG_V46_RESIDENTIAL_STREET_NIGHT.png'}:{t:number;left?:string;right?:string})=><AbsoluteFill><PanelImage path={left} x={0} y={0} w={950} h={1080}/><PanelImage path={right} x={970} y={0} w={950} h={1080}/><div style={{position:'absolute',left:930,top:0,width:60,height:1080,background:'#080b10'}}/><PersonIcon x={870} y={430} s={1.25}/><div style={{position:'absolute',left:920,top:480,width:80,height:80,borderRadius:'50%',background:'#d6c486',boxShadow:'0 0 70px #d6c486aa',transform:'scale('+(0.8+.2*Math.sin(t*8))+')'}}/></AbsoluteFill>;
const ChoiceLayers=({t}:{t:number})=><AbsoluteFill>{Array.from({length:5},(_,i)=>{const q=ph(t,.06+i*.1,.28+i*.1);return <div key={i} style={{position:'absolute',left:330+i*250,top:230+i*105,width:1020-i*120,height:560-i*70,border:'7px solid rgba(205,190,140,'+(.25+.13*i)+')',borderRadius:28,opacity:q,transform:'translateY('+(1-q)*60+'px)'}}/>})}<PersonIcon x={895} y={430} s={1.15}/></AbsoluteFill>;
const FutureFamily=({t}:{t:number})=>{const q=ph(t,.12,.9);return <AbsoluteFill><Family x={1190-300*q} y={330} s={1.15} opacity={.18+.78*q}/><div style={{position:'absolute',left:1080-220*q,top:240,width:620,height:620,borderRadius:'50%',background:'radial-gradient(circle,rgba(235,215,155,.22),transparent 70%)',filter:'blur('+(20-16*q)+'px)'}}/><PersonIcon x={330} y={430} s={1.3}/><Arrow x1={600} y1={540} x2={1080-180*q} y2={540} opacity={.35+.5*q}/></AbsoluteFill>};
const ResourceDots=({t}:{t:number})=><>{Array.from({length:28},(_,i)=>{const lane=i%3;const q=ph(t,.02+i*.015,.58+i*.012);const x=250+(1250*q),y=250+lane*250+Math.sin(i*2.1)*35;return <div key={i} style={{position:'absolute',left:x,top:y,width:22,height:22,borderRadius:'50%',background:'#d8c27f',boxShadow:'0 0 15px #d8c27faa'}}/>})}{['work','house','heart'].map((k,i)=><SymbolCard key={k} x={1450} y={155+i*250} kind={k} t={t}/>)}</>;
const MoleTasks=({t}:{t:number})=><AbsoluteFill style={{background:'#130e0b'}}>{Array.from({length:9},(_,i)=><MoleRat key={i} x={100+(i%3)*590+Math.sin(t*7+i)*90} y={130+Math.floor(i/3)*280} s={.48+(i%2)*.06} t={t} phase={i*.07} flip={i%2===1}/>) }<svg viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}}><path d="M80 360H1840M80 720H1840" stroke="#6e553c" strokeWidth="8" strokeDasharray="20 18"/></svg></AbsoluteFill>;
const QueenOrbit=({t}:{t:number})=><AbsoluteFill style={{background:'radial-gradient(circle at 50% 50%,#251711,#0a0807 72%)'}}><MoleRat x={760} y={360} s={1.35} t={t} queen/>{Array.from({length:8},(_,i)=>{const a=t*3+i/8*Math.PI*2;return <MoleRat key={i} x={835+Math.cos(a)*610} y={440+Math.sin(a)*300} s={.42} t={t} phase={i*.09} flip={Math.cos(a)<0}/>})}</AbsoluteFill>;
const ColonyRule=({t}:{t:number})=><AbsoluteFill style={{background:'#110c09'}}><div style={{position:'absolute',left:1250,top:180,width:520,height:720,borderRadius:260,background:'radial-gradient(circle,#6f5438,#1b120c 65%)',border:'8px solid #8e704b'}}><MoleRat x={100} y={250} s={.8} t={t} queen/></div>{Array.from({length:14},(_,i)=><MoleRat key={i} x={80+(i%4)*280} y={110+Math.floor(i/4)*230} s={.38} t={t} phase={i*.04} flip={i%2===1}/>)}</AbsoluteFill>;
const LabSwitch=({t}:{t:number})=><AbsoluteFill><PanelImage path="shared/asset-library/背景/BG_kenkyu.png" x={80} y={100} w={820} h={820}/><PanelImage path="shared/asset-library/背景/BG_darkroom.png" x={1020} y={100} w={820} h={820}/><MoleRat x={260+650*ph(t,.1,.75)} y={420} s={.72} t={t}/><svg viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}}><path d="M880 520H1040" stroke="#d7c58b" strokeWidth="18" markerEnd="url(#arr)"/></svg></AbsoluteFill>;
const CityCare=({t}:{t:number})=><AbsoluteFill><Family x={785} y={390} s={1.15}/>{['shared/asset-library/背景/BG_school.png','shared/asset-library/背景/BG_hospital.png','shared/asset-library/背景/BG_office.png','shared/asset-library/背景/BG_supermarket.png','shared/asset-library/背景/BG_TOWN_DAY_WIDE.png','shared/asset-library/背景/BG_kitchen.png'].map((p,i)=>{const a=i/6*Math.PI*2,x=810+Math.cos(a)*680,y=410+Math.sin(a)*360,q=ph(t,.04+i*.06,.28+i*.06);return <React.Fragment key={p}><PanelImage path={p} x={x} y={y} w={260} h={170} opacity={q}/><Arrow x1={x+130} y1={y+85} x2={960} y2={540} opacity={q*.62} w={5}/></React.Fragment>})}</AbsoluteFill>;
const ScaleChoice=({t}:{t:number})=><svg viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}}><path d="M960 260V810M520 420H1400" stroke="#d6c186" strokeWidth="24"/><path d="M520 420 360 690M520 420 680 690M1400 420 1240 690M1400 420 1560 690" stroke="#d6c186" strokeWidth="12"/><path d="M300 690H740M1180 690H1620" stroke="#d6c186" strokeWidth="18"/><g transform={'translate(0 '+(25*Math.sin(t*5))+')'}><circle cx="420" cy="630" r="42" fill="#8aa2b4"/><circle cx="510" cy="630" r="42" fill="#8aa2b4"/><circle cx="600" cy="630" r="42" fill="#8aa2b4"/></g><g transform={'translate(0 '+(-25*Math.sin(t*5))+')'}><circle cx="1320" cy="630" r="42" fill="#d1b975"/><circle cx="1410" cy="630" r="42" fill="#d1b975"/></g></svg>;
const PathsConverge=({t}:{t:number})=><svg viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}}>{[180,360,540,720,900].map((y,i)=><path key={y} d={'M80 '+y+' C650 '+(y+(i-2)*80)+' 930 540 1760 540'} fill="none" stroke={i%2?'#8da2b1':'#d4bf82'} strokeWidth="16" pathLength={1} strokeDasharray={1} strokeDashoffset={1-ph(t,.04+i*.08,.55+i*.08)}/>) }<circle cx="1760" cy="540" r="86" fill="#d0bc7c"/></svg>;

const GenericMotion=({scene,t,index}:{scene:any;t:number;index:number})=>{
 const m=String(scene.visualMode||'');
 const ch=String(scene.chapterId||'');

 if(ch==='chapter2'){
  if(m==='city_arrival')return <AbsoluteFill><PanelImage path="shared/asset-library/背景/BG_V46_SUBWAY_ENTRANCE.png" x={80} y={100} w={820} h={820}/><PanelImage path="shared/asset-library/背景/BG_TOWN_DAY_WIDE.png" x={1020} y={100} w={820} h={820}/><div style={{position:'absolute',left:180+850*ph(t,.05,.82),top:570}}><PersonIcon x={0} y={0} s={1.1}/></div><Arrow x1={820} y1={540} x2={1100} y2={540}/></AbsoluteFill>;
  if(m==='salary_up')return <AbsoluteFill>{Array.from({length:8},(_,i)=><div key={i} style={{position:'absolute',left:260+i*170,bottom:150,width:110,height:(90+i*78)*ph(t,.05+i*.04,.45+i*.04),background:'linear-gradient(#d9c37f,#5f7865)',borderRadius:'18px 18px 0 0'}}/>)}<SymbolCard x={760} y={190} kind="money" t={t}/></AbsoluteFill>;
  if(m==='consumption_up')return <AbsoluteFill><PanelImage path="shared/asset-library/背景/BG_cafenaiso.png" x={70} y={120} w={540} h={720}/><PanelImage path="shared/asset-library/背景/BG_supermarket.png" x={690} y={120} w={540} h={720}/><PanelImage path="shared/asset-library/背景/BG_TOWN_NIGHT_WIDE.png" x={1310} y={120} w={540} h={720}/><Cake x={855} y={650} scale={1.5}/></AbsoluteFill>;
  if(m==='relative_poverty')return <AbsoluteFill><PersonIcon x={300} y={420} s={1.3}/>{Array.from({length:5},(_,i)=><div key={i} style={{position:'absolute',left:700+i*210,top:690-i*115,width:150,height:150,borderRadius:24,border:'7px solid #c6b57f',background:'#26323d',transform:'scale('+(.82+.18*ph(t,.05+i*.08,.4+i*.08))+')'}}/>)}<Arrow x1={500} y1={520} x2={1450} y2={260}/></AbsoluteFill>;
  if(m==='social_comparison')return <AbsoluteFill><SocialWindows t={t}/></AbsoluteFill>;
  if(m==='parenting_standard')return <AbsoluteFill>{['school','house','clock','money'].map((k,i)=><SymbolCard key={k} x={280+i*330} y={720-i*135} kind={k} t={t} delay={i*.08}/>)}<Family x={180} y={500} s={.85}/><Family x={1390} y={250} s={.7}/></AbsoluteFill>;
  if(m==='freedom_lifestyle')return <AbsoluteFill><PanelImage path="shared/asset-library/背景/BG_MOVIE.png" x={80} y={130} w={520} h={760}/><PanelImage path="shared/asset-library/背景/BG_cafenaiso.png" x={700} y={130} w={520} h={760}/><PanelImage path="shared/asset-library/背景/BG_TOWN_NIGHT_WIDE.png" x={1320} y={130} w={520} h={760}/><PersonIcon x={870} y={480} s={1}/></AbsoluteFill>;
  if(/choice_respect|choice_fork/.test(m))return <DoorRow t={t}/>;
  if(m==='choice_origin')return <AbsoluteFill><DoorRow t={t}/>{Array.from({length:7},(_,i)=><div key={i} style={{position:'absolute',left:250+i*220,top:820-50*(i%2),width:110,height:110,borderRadius:'50%',border:'12px solid #9f8d60',transform:'rotate('+(t*250+i*35)+'deg)'}}/> )}</AbsoluteFill>;
  if(m==='single_life')return <AbsoluteFill><PanelImage path="shared/asset-library/背景/BG_MOVIE.png" x={80} y={120} w={520} h={790}/><PanelImage path="shared/asset-library/背景/BG_cafenaiso.png" x={700} y={120} w={520} h={790}/><PanelImage path="shared/asset-library/背景/BG_kouen.png" x={1320} y={120} w={520} h={790}/><PersonIcon x={870+120*Math.sin(t*5)} y={490} s={1}/></AbsoluteFill>;
  if(m==='prospect_theory')return <AbsoluteFill style={{background:'rgba(3,7,12,.7)'}}><svg viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}}><path d="M180 540H1740M960 120V950" stroke="#8796a1" strokeWidth="8"/><path d="M260 770 C640 760 700 610 960 540 C1220 470 1350 240 1680 220" fill="none" stroke="#d4c17f" strokeWidth="18" pathLength={1} strokeDasharray={1} strokeDashoffset={1-ph(t,.08,.85)}/><circle cx="960" cy="540" r="28" fill="#d7c584"/></svg></AbsoluteFill>;
  if(m==='loss_present')return <AbsoluteFill><PersonIcon x={300} y={430} s={1.3}/>{['clock','money','work','house'].map((k,i)=>{const q=ph(t,.1+i*.1,.6+i*.08);return <div key={k} style={{transform:'translateX('+(q*520)+'px)',opacity:1-.5*q}}><SymbolCard x={650+i*160} y={240+i*150} kind={k} t={1} /></div>})}</AbsoluteFill>;
  if(m==='future_gain_blur')return <FutureFamily t={t}/>;
  if(m==='hard_world')return <AbsoluteFill><PanelImage path="shared/asset-library/背景/BG_office.png" x={0} y={0} w={960} h={1080}/><PanelImage path="shared/asset-library/背景/BG_hudousan.png" x={960} y={0} w={960} h={1080}/><div style={{position:'absolute',left:840-260*ph(t,.2,.8),top:0,width:220,height:1080,background:'#0a0d12cc'}}/><div style={{position:'absolute',left:860+260*ph(t,.2,.8),top:0,width:220,height:1080,background:'#0a0d12cc'}}/><PersonIcon x={900} y={470} s={1.05}/></AbsoluteFill>;
  if(m==='world_shapes_choice')return <WorldSplit t={t}/>;
  if(m==='choice_stamp')return <ChoiceLayers t={t}/>;
  if(m==='self_selection')return <AbsoluteFill><PeopleGrid t={t} count={32}/><div style={{position:'absolute',left:650,top:280,width:620,height:520,borderRadius:300,border:'22px solid #d3bd7b',boxShadow:'0 0 80px #d3bd7b55'}}/></AbsoluteFill>;
  if(m==='resource_allocation')return <AbsoluteFill><ResourceDots t={t}/></AbsoluteFill>;
  if(m==='resource_loop')return <AbsoluteFill><ResourceDots t={t}/><svg viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}}><path d="M180 900H1740" stroke="#687785" strokeWidth="30" strokeDasharray="40 30" strokeDashoffset={-t*220}/></svg><Family x={1490} y={720} s={.6} opacity={.3}/></AbsoluteFill>;
  if(m==='work_pushes_family')return <AbsoluteFill><ClockRing t={t}/>{Array.from({length:7},(_,i)=><SymbolCard key={i} x={100+i*230} y={760} kind="work" t={t} delay={i*.05}/>)}<Family x={1420+250*ph(t,.2,.9)} y={240} s={.72} opacity={1-.6*ph(t,.2,.9)}/></AbsoluteFill>;
  if(m==='descent_to_underground')return <AbsoluteFill style={{background:'#342315'}}><PanelImage path="shared/asset-library/背景/BG_V46_CH1_RURAL_FIELD.png" x={0} y={0} w={1920} h={430}/><svg viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}}><path d="M960 420 C780 560 1190 650 920 800 S790 980 1050 1120" stroke="#070605" strokeWidth="110" fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1-ph(t,.05,.9)}/></svg></AbsoluteFill>;
  if(m==='status_pressure'||m==='city_choice')return <AbsoluteFill>{index%3===0?<Budget t={t}/>:index%3===1?<SocialWindows t={t}/>:<FutureFamily t={1-t*.35}/>}</AbsoluteFill>;
 }

 if(ch==='chapter3'){
  if(m==='dry_land')return <AbsoluteFill style={{background:'#2a1b10'}}><PanelImage path="shared/asset-library/背景/BG_V46_CH1_RURAL_FIELD.png" x={0} y={0} w={1920} h={500}/><div style={{position:'absolute',left:0,top:500,width:1920,height:580,background:'#1c100b'}}/><svg viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}}><path d="M950 500 C830 650 1180 730 930 920" stroke="#050505" strokeWidth="100" fill="none"/></svg></AbsoluteFill>;
  if(m==='tunnel_rush')return <Tunnel t={t} count={10}/>;
  if(m==='molerat_reveal')return <AbsoluteFill style={{background:'radial-gradient(circle,#36231d,#070605 70%)'}}><MoleRat x={560} y={310} s={2.4} t={t}/></AbsoluteFill>;
  if(m==='colony_jobs')return <MoleTasks t={t}/>;
  if(m==='colony_rule')return <ColonyRule t={t}/>;
  if(m==='queen_colony')return <QueenOrbit t={t}/>;
  if(m==='molerat_motion')return index%2===0?<Tunnel t={t} count={7}/>:<MoleTasks t={t}/>;
  if(m==='eusociality')return <AbsoluteFill>{[360,960,1560].map((x,i)=><div key={x} style={{position:'absolute',left:x-220,top:240,width:440,height:440,borderRadius:'50%',border:'12px solid #a78d62',background:'#1b1511cc'}}>{Array.from({length:7},(_,j)=><div key={j} style={{position:'absolute',left:190+Math.cos(j)*120,top:190+Math.sin(j)*120,width:32,height:32,borderRadius:'50%',background:i===2?'#cf9187':'#81909b'}}/> )}</div>) }<MoleRat x={790} y={700} s={.7} t={t}/></AbsoluteFill>;
  if(m==='kin_selection'||m==='kin_network')return <AbsoluteFill style={{background:'rgba(3,7,12,.76)'}}><Network t={t} n={m==='kin_network'?18:12}/>{Array.from({length:7},(_,i)=><div key={i} style={{position:'absolute',left:160+i*250,top:820,width:50,height:50,borderRadius:'50%',background:'#d1b979',boxShadow:'0 0 20px #d1b979'}}/> )}</AbsoluteFill>;
  if(m==='survival_together')return <AbsoluteFill><div style={{position:'absolute',left:0,top:0,width:960,height:1080,background:'#160f0b'}}><MoleRat x={300} y={430} s={.8} t={t}/></div><div style={{position:'absolute',left:960,top:0,width:960,height:1080,background:'#25170f'}}>{Array.from({length:7},(_,i)=><MoleRat key={i} x={40+(i%3)*290} y={160+Math.floor(i/3)*260} s={.45} t={t} phase={i*.08}/>)}</div></AbsoluteFill>;
  if(m==='latent_reproduction')return <AbsoluteFill>{Array.from({length:10},(_,i)=><React.Fragment key={i}><MoleRat x={110+(i%5)*350} y={180+Math.floor(i/5)*420} s={.52} t={t} phase={i*.05}/><div style={{position:'absolute',left:250+(i%5)*350,top:180+Math.floor(i/5)*420,width:36,height:36,borderRadius:'50%',background:i===Math.floor(ph(t,.35,.8)*10)?'#e2c56e':'#3a3e43',boxShadow:i===Math.floor(ph(t,.35,.8)*10)?'0 0 38px #e2c56e':'none'}}/></React.Fragment>)}</AbsoluteFill>;
  if(m==='environment_switch')return <LabSwitch t={t}/>;
  if(m==='time_resource_split')return <AbsoluteFill><Budget t={t}/><Family x={1320} y={220} s={.75}/></AbsoluteFill>;
  if(m==='city_division')return <AbsoluteFill><PanelImage path="shared/asset-library/背景/BG_V46_PEER_LIVING_ROOM.png" x={60} y={100} w={850} h={850}/><PanelImage path="shared/asset-library/背景/BG_office.png" x={1010} y={100} w={850} h={850}/><Family x={260} y={450} s={.8}/><PeopleGrid t={t} count={12}/></AbsoluteFill>;
  if(m==='faceless_conditions')return <AbsoluteFill style={{background:'rgba(2,4,7,.72)'}}><Crown t={t} x={710} y={140} scale={1}/>{['money','house','clock','school','work'].map((k,i)=><SymbolCard key={k} x={180+i*320} y={720} kind={k} t={t} delay={i*.08}/>)}</AbsoluteFill>;
  if(m==='underground_surface_split')return <AbsoluteFill><div style={{position:'absolute',left:0,top:0,width:1920,height:520,overflow:'hidden'}}><PanelImage path="shared/asset-library/背景/BG_TOWN_DAY_WIDE.png" x={0} y={0} w={1920} h={520}/><PeopleGrid t={t} count={18}/></div><div style={{position:'absolute',left:0,top:540,width:1920,height:540,overflow:'hidden'}}><Tunnel t={t} count={8} queen/></div></AbsoluteFill>;
  if(m==='zoom_out_mass')return <AbsoluteFill><PeopleGrid t={t} count={32}/><div style={{position:'absolute',left:0,top:0,width:1920,height:1080,transform:'scale('+(1-.18*ph(t,.2,.9))+')'}}/></AbsoluteFill>;
 }

 if(ch==='chapter4'){
  if(m==='office_machine')return <AbsoluteFill><OfficeFlow t={t}/></AbsoluteFill>;
  if(m==='owner_home')return <AbsoluteFill><PanelImage path="shared/asset-library/背景/BG_V46_PEER_COMPANY_OFFICE.png" x={60} y={120} w={820} h={820}/><PanelImage path="shared/asset-library/背景/BG_V46_PEER_LIVING_ROOM.png" x={1040} y={120} w={820} h={820}/><Arrow x1={850} y1={540} x2={1090} y2={540}/><Family x={1280} y={520} s={.72}/></AbsoluteFill>;
  if(m==='worker_budget')return <AbsoluteFill><Budget t={t}/></AbsoluteFill>;
  if(m==='promotion_overtime')return <AbsoluteFill><ClockRing t={t}/>{Array.from({length:6},(_,i)=><SymbolCard key={i} x={140+i*270} y={760} kind="work" t={t} delay={i*.07}/>)}</AbsoluteFill>;
  if(m==='time_tradeoff')return <AbsoluteFill><ScaleChoice t={t}/><SymbolCard x={260} y={220} kind="work" t={t}/><SymbolCard x={1430} y={220} kind="heart" t={t}/></AbsoluteFill>;
  if(m==='career_fear')return <AbsoluteFill><OfficeWomanRig x={360} y={380} scale={.72} action="idle" suitColor="#675667" pantsColor="#454451" shirtColor="#eee4d5" hairColor="#362f35"/><DoorRow t={t}/></AbsoluteFill>;
  if(m==='organization_zoomout')return <AbsoluteFill><PeopleGrid t={t} count={32}/></AbsoluteFill>;
  if(m==='office_system')return index%3===0?<AbsoluteFill><OfficeFlow t={t}/></AbsoluteFill>:index%3===1?<AbsoluteFill><Network t={t} n={16}/></AbsoluteFill>:<AbsoluteFill><PeopleGrid t={t} count={28}/></AbsoluteFill>;
  if(m==='faceless_queen'||m==='society_is_queen')return <AbsoluteFill style={{background:'rgba(2,4,7,.68)'}}><Crown t={t} x={710} y={120}/>{['money','house','clock','work','school'].map((k,i)=><SymbolCard key={k} x={180+i*320} y={735} kind={k} t={t} delay={i*.08}/>)}</AbsoluteFill>;
  if(m==='money_cycle')return <AbsoluteFill><Network t={t} n={10}/>{Array.from({length:5},(_,i)=><SymbolCard key={i} x={220+i*330} y={760} kind={i%2?'work':'money'} t={t} delay={i*.07}/>)}</AbsoluteFill>;
  if(m==='city_demand')return <AbsoluteFill><PeopleGrid t={t} count={24}/>{Array.from({length:5},(_,i)=><SymbolCard key={i} x={260+i*300} y={190-i*18} kind="house" t={t} delay={i*.08}/>)}</AbsoluteFill>;
  if(m==='housing_escalator')return <AbsoluteFill>{Array.from({length:6},(_,i)=><div key={i} style={{position:'absolute',left:250+i*230,top:760-i*105,width:210,height:120,background:'#6f7f8d',border:'7px solid #d1be85'}}><div style={{position:'absolute',left:70,top:-80}}><PersonIcon x={0} y={0} s={.45}/></div></div>)}</AbsoluteFill>;
  if(m==='education_contagion')return <AbsoluteFill>{Array.from({length:14},(_,i)=><SymbolCard key={i} x={80+(i%7)*260} y={170+Math.floor(i/7)*410} kind={i%2?'school':'heart'} t={t} delay={i*.035}/>)}</AbsoluteFill>;
  if(m==='pressure_on_all')return <AbsoluteFill><OfficeWorkerRig x={350} y={380} scale={.65} action="idle" suitColor="#4b5365" pantsColor="#343c45" shirtColor="#eee6d5" hairColor="#2e343b"/><OfficeWomanRig x={1220} y={380} scale={.65} action="idle" suitColor="#675667" pantsColor="#454451" shirtColor="#eee4d5" hairColor="#362f35"/>{[250,500,750,1000,1250,1500].map((x,i)=><Arrow key={x} x1={x} y1={150} x2={i<3?520:1380} y2={520} opacity={ph(t,.05+i*.06,.35+i*.06)}/>)}</AbsoluteFill>;
  if(m==='emergent_result')return <AbsoluteFill><PathsConverge t={t}/><Family x={1490} y={430} s={.75} opacity={.45}/></AbsoluteFill>;
  if(m==='no_ban')return <AbsoluteFill><DoorRow t={t}/><div style={{position:'absolute',left:670,top:160,width:580,height:580,borderRadius:'50%',border:'18px solid #d4bf82',opacity:.65}}/></AbsoluteFill>;
  if(m==='history_pullback')return <AbsoluteFill><PanelImage path="shared/asset-library/背景/BG_V46_CH1_RURAL_FIELD.png" x={80} y={140} w={520} h={740}/><PanelImage path="shared/asset-library/背景/BG_town.png" x={700} y={140} w={520} h={740}/><PanelImage path="shared/asset-library/背景/BG_TOWN_DAY_WIDE.png" x={1320} y={140} w={520} h={740}/><Arrow x1={1700} y1={930} x2={250} y2={930}/></AbsoluteFill>;
  if(m==='dependent_child')return <AbsoluteFill><V46_CHILD_RIG_GIRL x={820} y={390} scale={.75}/><ParentFatherRig x={280} y={360} scale={.62} action="idle"/><ParentMotherRig x={1320} y={360} scale={.62} action="idle"/>{['heart','house','money'].map((k,i)=><SymbolCard key={k} x={590+i*280} y={760} kind={k} t={t} delay={i*.1}/>)}</AbsoluteFill>;
  if(m==='cooperative_circle'||m==='collective_parenting')return <AbsoluteFill><Family x={790} y={390} s={1}/>{Array.from({length:10},(_,i)=>{const a=i/10*Math.PI*2;return <PersonIcon key={i} x={900+Math.cos(a)*650} y={460+Math.sin(a)*330} s={.48} opacity={ph(t,.03+i*.04,.25+i*.04)}/>})}</AbsoluteFill>;
  if(m==='kramer_theory')return <AbsoluteFill style={{background:'rgba(6,10,15,.7)'}}><div style={{position:'absolute',left:360,top:120,width:1200,height:820,background:'#e8e0ca',border:'10px solid #685b48',transform:'rotate(-1deg)'}}><Network t={t} n={10}/></div></AbsoluteFill>;
  if(m==='village_care')return <AbsoluteFill><PanelImage path="shared/asset-library/背景/BG_V46_CH1_RURAL_HOME.png" x={0} y={0} w={1920} h={1080}/><ParentFatherRig x={280} y={360} scale={.6} action="idle"/><ParentMotherRig x={1260} y={360} scale={.6} action="idle"/><V46_CHILD_RIG_BOY x={820} y={520} scale={.58}/></AbsoluteFill>;
  if(m==='city_care_network')return <CityCare t={t}/>;
  if(m==='caregiver_paradox')return <AbsoluteFill><PanelImage path="shared/asset-library/背景/BG_school.png" x={60} y={100} w={850} h={850}/><PanelImage path="shared/asset-library/背景/BG_oneroom_night.png" x={1010} y={100} w={850} h={850}/><OfficeWomanRig x={330} y={390} scale={.62} action="idle" suitColor="#675667" pantsColor="#454451" shirtColor="#eee4d5" hairColor="#362f35"/><Budget t={t}/></AbsoluteFill>;
  if(m==='care_worker_home')return <AbsoluteFill><OfficeWomanRig x={330} y={390} scale={.66} action="idle" suitColor="#675667" pantsColor="#454451" shirtColor="#eee4d5" hairColor="#362f35"/><Budget t={t}/></AbsoluteFill>;
  if(m==='choice_weight')return <AbsoluteFill><ScaleChoice t={t}/>{['money','clock','work','house'].map((k,i)=><SymbolCard key={k} x={250+i*390} y={780} kind={k} t={t} delay={i*.08}/>)}</AbsoluteFill>;
  if(m==='question_not_command')return <AbsoluteFill><PathsConverge t={t}/><div style={{position:'absolute',left:855,top:330,width:210,height:210,borderRadius:'50%',border:'24px solid #d3bf83',borderTopColor:'transparent',transform:'rotate('+(t*120)+'deg)'}}/></AbsoluteFill>;
  if(m==='queen_overlay')return <AbsoluteFill><div style={{position:'absolute',left:0,top:0,width:1920,height:520,overflow:'hidden'}}><QueenOrbit t={t}/></div><div style={{position:'absolute',left:0,top:540,width:1920,height:540,overflow:'hidden'}}><PanelImage path="shared/asset-library/背景/BG_TOWN_DAY_WIDE.png" x={0} y={0} w={1920} h={540}/><Crown t={t} x={720} y={20} scale={.8}/></div></AbsoluteFill>;
 }

 if(ch==='epilogue'){
  if(m==='friday_return'||m==='night_flow')return <AbsoluteFill><PeopleGrid t={t} count={18}/></AbsoluteFill>;
  if(m==='hero_life')return <AbsoluteFill><PanelImage path="shared/asset-library/背景/BG_cafenaiso.png" x={80} y={120} w={520} h={790}/><PanelImage path="shared/asset-library/背景/BG_kouen.png" x={700} y={120} w={520} h={790}/><PanelImage path="shared/asset-library/背景/BG_TOWN_NIGHT_WIDE.png" x={1320} y={120} w={520} h={790}/><Actor kind="hero" x={840} y={430} scale={.7}/></AbsoluteFill>;
  if(m==='hero_acceptance')return <AbsoluteFill><Actor kind="hero" x={650} y={370} scale={.78}/>{['work','money','heart'].map((k,i)=><SymbolCard key={k} x={980+i*230} y={310+i*170} kind={k} t={t} delay={i*.1}/>)}</AbsoluteFill>;
  if(m==='epilogue_flow')return <AbsoluteFill><Actor kind="hero" x={790} y={390} scale={.76}/><PathsConverge t={t}/></AbsoluteFill>;
  if(m==='alternate_self')return <AbsoluteFill><PanelImage path="shared/asset-library/背景/BG_town.png" x={30} y={100} w={590} h={850}/><PanelImage path="shared/asset-library/背景/BG_TOWN_DAY_WIDE.png" x={665} y={100} w={590} h={850}/><PanelImage path="shared/asset-library/背景/BG_V46_RESIDENTIAL_STREET_NIGHT.png" x={1300} y={100} w={590} h={850}/>{[190,825,1460].map((x,i)=><Actor key={x} kind="hero" x={x} y={480} scale={.58}/>)}</AbsoluteFill>;
  if(m==='choice_corridor')return <DoorRow t={t}/>;
  if(m==='colony_memory')return <QueenOrbit t={t}/>;
  if(m==='human_roles')return <AbsoluteFill><PanelImage path="shared/asset-library/背景/BG_V46_PEER_LIVING_ROOM.png" x={60} y={100} w={850} h={850}/><PanelImage path="shared/asset-library/背景/BG_office.png" x={1010} y={100} w={850} h={850}/><Family x={260} y={500} s={.75}/><PeopleGrid t={t} count={12}/></AbsoluteFill>;
  if(m==='conditions_not_queen')return <AbsoluteFill><Crown t={1-t} x={710} y={110}/>{['money','house','clock','work','school'].map((k,i)=><SymbolCard key={k} x={180+i*320} y={720} kind={k} t={t} delay={i*.08}/>)}</AbsoluteFill>;
  if(m==='valid_life')return <AbsoluteFill><PanelImage path="shared/asset-library/背景/BG_kouen.png" x={100} y={100} w={1720} h={880}/><Actor kind="hero" x={720+220*ph(t,.1,.8)} y={430} scale={.72}/></AbsoluteFill>;
  if(m==='future_recedes')return <AbsoluteFill><Actor kind="hero" x={320} y={420} scale={.76}/><Family x={1320+180*ph(t,.2,.9)} y={330} s={.9} opacity={1-.55*ph(t,.2,.9)}/>{['house','money','clock','work'].map((k,i)=><SymbolCard key={k} x={720+i*210} y={250+i*140} kind={k} t={t} delay={i*.08}/>)}</AbsoluteFill>;
  if(m==='same_outcome_many_paths')return <AbsoluteFill><PathsConverge t={t}/></AbsoluteFill>;
  if(m==='train_arrives')return <AbsoluteFill><div style={{position:'absolute',left:1920-2200*ph(t,.08,.72),top:365,width:2100,height:500,background:'#384956',border:'16px solid #1e2830',boxShadow:'0 25px 50px #000c'}}>{Array.from({length:8},(_,i)=><div key={i} style={{position:'absolute',left:90+i*250,top:70,width:180,height:180,background:'#9cb2bc88',border:'8px solid #202a31'}}><PersonIcon x={35} y={25} s={.7}/></div>)}</div></AbsoluteFill>;
  if(m==='tomorrow_work')return <AbsoluteFill><ClockRing t={t}/><SymbolCard x={850} y={790} kind="work" t={t}/></AbsoluteFill>;
  if(m==='supports_child_elsewhere')return <AbsoluteFill><Actor kind="hero" x={250} y={430} scale={.7}/><CityCare t={t}/><Family x={1460} y={420} s={.62}/></AbsoluteFill>;
  if(m==='unknown_future')return <AbsoluteFill><Actor kind="hero" x={520} y={410} scale={.78}/><div style={{position:'absolute',left:1080,top:500,width:340,height:210,border:'8px solid #8596a5',borderRadius:30,opacity:.6}}/><Family x={1420} y={330} s={.62} opacity={.18+.2*Math.sin(t*4)}/></AbsoluteFill>;
 }

 if(/prospect_theory|resource_allocation|kin_selection|kin_network|city_care_network|collective_parenting/.test(m))return <AbsoluteFill style={{background:'rgba(3,7,12,.84)'}}><Network t={t} n={m==='city_care_network'?18:12}/></AbsoluteFill>;
 if(/choice_respect|choice_fork|choice_origin|choice_corridor|valid_life/.test(m))return <DoorRow t={t}/>;
 if(/faceless_queen|society_queen|society_is_queen|queen_overlay/.test(m))return <AbsoluteFill style={{background:'rgba(2,4,7,.7)'}}><Crown t={t}/>{Array.from({length:7},(_,i)=><SymbolCard key={i} x={170+i*235} y={760-90*(i%2)} kind={['money','clock','house','work','school','money','clock'][i]} t={t} delay={i*.07}/>)}</AbsoluteFill>;
 if(/hours_expand|day_squeezed|promotion_overtime|time_tradeoff|tomorrow_work/.test(m))return <AbsoluteFill><ClockRing t={t}/>{Array.from({length:5},(_,i)=><SymbolCard key={i} x={170+i*320} y={760} kind="work" t={t} delay={i*.1}/>)}</AbsoluteFill>;
 if(/worker_budget|status_pressure|housing_escalator|hard_world|parenting_standard|choice_weight|small_decisions/.test(m))return <AbsoluteFill>{['money','house','school','clock','work'].map((k,i)=><SymbolCard key={k} x={250+i*300} y={260+(i%2)*260} kind={k} t={t} delay={i*.11}/>)}</AbsoluteFill>;
 if(/education_contagion|love_to_barrier/.test(m))return <AbsoluteFill>{Array.from({length:7},(_,i)=><SymbolCard key={i} x={130+i*250} y={250+100*Math.sin(i)} kind={i%2?'school':'heart'} t={t} delay={i*.08}/>)}</AbsoluteFill>;
 if(/zoom_out_mass|organization_zoomout|office_machine/.test(m))return <AbsoluteFill><PeopleGrid t={t} count={28}/></AbsoluteFill>;
 if(/mirror_society|colony_city_parallel|underground_surface_split|colony_memory/.test(m))return <AbsoluteFill><P x={0} y={0} w={1920} h={520} style={{overflow:'hidden'}}><Tunnel t={t} count={6} queen={m!=='colony_memory'}/></P><P x={0} y={540} w={1920} h={540} style={{background:'rgba(5,9,14,.7)'}}><Network t={t} n={10}/></P></AbsoluteFill>;
 if(/loss_present|work_pushes_family|future_recedes|unknown_future/.test(m))return <FutureFamily t={1-t*.3}/>;
 return index%3===0?<AbsoluteFill><Network t={t} n={12}/></AbsoluteFill>:index%3===1?<AbsoluteFill><PeopleGrid t={t} count={24}/></AbsoluteFill>:<AbsoluteFill>{['money','house','clock','work','heart'].map((k,i)=><SymbolCard key={i} x={170+i*330} y={210+(i%2)*310} kind={k} t={t} delay={i*.09}/>)}</AbsoluteFill>;
};


const Actors=({scene,t}:{scene:any;t:number})=>{
 const a=scene.actors||[];
 const n=parseInt(String(scene.sceneId||'0').match(/\d+$/)?.[0]||'0',10);
 const m=String(scene.visualMode||'');
 if(/social_comparison|prospect_theory|resource_allocation|kin_selection|kin_network|office_machine|organization_zoomout|city_care_network|collective_parenting|queen_colony|colony_rule|tunnel_rush|molerat_motion|colony_jobs|peer_family_photo/.test(m))return null;
 return <>{a.map((role:string,i:number)=>{
  const base=120+((n*347+i*521)%1180),x=base+90*Math.sin(t*Math.PI*2+i),y=340+((n*53+i*97)%170)+18*Math.cos(t*6+i);
  if(role==='hero')return <Actor key={role+i} kind="hero" x={x} y={y} scale={.64+(n%3)*.04} motion={/train|night_flow|friday_return/.test(m)?'walk':'idle'}/>;
  if(role==='peer')return <Actor key={role+i} kind="peer" x={x} y={y} scale={.60}/>;
  if(role==='peerSpouse')return <Actor key={role+i} kind="mother" x={x} y={y} scale={.60}/>;
  if(role==='peerBoy')return <Actor key={role+i} kind="boy" x={x} y={y+150} scale={.46}/>;
  if(role==='peerGirl')return <Actor key={role+i} kind="girl" x={x} y={y+150} scale={.46}/>;
  if(role==='workerWoman')return <OfficeWomanRig key={role+i} x={x} y={y} scale={.61+(n%2)*.04} action={/overtime|machine|arrival/.test(m)?'walk':'idle'} suitColor="#675667" pantsColor="#454451" shirtColor="#eee4d5" hairColor="#362f35"/>;
  return <OfficeWorkerRig key={role+i} x={x} y={y} scale={.61+(n%2)*.04} action={/arrival|machine|overtime/.test(m)?'walk':'idle'} suitColor={role==='chapter2Man'?'#475a52':'#4b5365'} pantsColor="#343c45" shirtColor="#eee6d5" hairColor={role==='chapter2Man'?'#5a4435':'#2e343b'}/>;
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
