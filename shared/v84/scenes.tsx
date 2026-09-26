import React from 'react';
import {AbsoluteFill,Img,staticFile} from 'remotion';
import {OfficeWorkerRig} from '../../shared/asset-library/人物テンプレート/office-worker-rig';
import {OfficeWomanRig} from '../../shared/asset-library/人物テンプレート/office-woman-rig';
import {RESEARCHER_MAN} from '../../shared/asset-library/人物テンプレート/RESEARCHER_MAN';
import {RESEARCHER_WOMAN} from '../../shared/asset-library/人物テンプレート/RESEARCHER_WOMAN';
import {PASSERBY} from '../../shared/asset-library/人物テンプレート/PASSERBY';

type Beat={id:string;phase:string;variant:number;narration:string;visual:string;bgGroup:string;bgSeed:number;foreground:string;shotKind:string};
const C={ink:'#07131d',deep:'#102433',slate:'#263f50',blue:'#39657b',cyan:'#7fb9bf',paper:'#ece7dc',gold:'#d7b46c',red:'#b65f60',teal:'#6fa39b',green:'#7c9a77',skin:'#d6ae90',steel:'#9db0b8',white:'#f7f4eb'};
const clamp=(v:number)=>Math.max(0,Math.min(1,v));
const lerp=(a:number,b:number,t:number)=>a+(b-a)*clamp(t);
const R=({x,y,w,h,c=C.paper,o=1,rx=0}:{x:number;y:number;w:number;h:number;c?:string;o?:number;rx?:number})=><rect x={x} y={y} width={w} height={h} rx={rx} fill={c} opacity={o}/>;
const L=({x,y,X,Y,c=C.steel,s=5,o=1}:{x:number;y:number;X:number;Y:number;c?:string;s?:number;o?:number})=><line x1={x} y1={y} x2={X} y2={Y} stroke={c} strokeWidth={s} opacity={o} strokeLinecap="round"/>;
const Dot=({x,y,r=8,c=C.gold,o=1}:{x:number;y:number;r?:number;c?:string;o?:number})=><circle cx={x} cy={y} r={r} fill={c} opacity={o}/>;
const Pulse=({x,y,p,r=120,c=C.gold}:{x:number;y:number;p:number;r?:number;c?:string})=><circle cx={x} cy={y} r={lerp(8,r,p)} fill="none" stroke={c} strokeWidth={7} opacity={.78-p*.7}/>;
const Svg=({children}:{children:React.ReactNode})=><svg viewBox="0 0 1920 1080" width="1920" height="1080" style={{position:'absolute',inset:0}}>{children}</svg>;
const TemplateBg=({file,p,seed,night=false}:{file:string;p:number;seed:number;night?:boolean})=>{
 const z=1.07+(seed%4)*.012,tx=-45-Math.sin(p*Math.PI*1.4+seed)*38,ty=-28-Math.cos(p*Math.PI*1.1+seed)*16;
 return <AbsoluteFill style={{overflow:'hidden',background:C.deep}}>
  <Img src={staticFile('assets/library/背景/'+file)} style={{width:'100%',height:'100%',objectFit:'cover',transform:`translate(${tx}px,${ty}px) scale(${z})`,filter:night?'brightness(.58) saturate(.78)':'brightness(.83) saturate(.82)'}}/>
  <Svg><R x={0} y={0} w={1920} h={1080} c={night?C.ink:C.deep} o={night?.18:.07}/>{Array.from({length:8},(_,i)=><g key={i}><Dot x={120+i*238+(p*50)%80} y={110+(i%3)*56} r={4+i%3} c={i%2?C.gold:C.cyan} o={.16+.08*Math.sin(p*7+i)}/></g>)}</Svg>
 </AbsoluteFill>;
};
const Monitor=({x,y,w=420,h=250,p=0,mode='code'}:{x:number;y:number;w?:number;h?:number;p?:number;mode?:string})=><g><R x={x} y={y} w={w} h={h} c="#06101a" rx={10}/><R x={x+17} y={y+17} w={w-34} h={h-45} c={mode==='alert'?'#3b2428':'#17384b'} rx={5}/>
 {Array.from({length:6},(_,i)=><R key={i} x={x+38} y={y+43+i*27} w={(w-95)*(mode==='bars'?(i+2)/8:.38+.08*((i+p*3)%4))} h={8} c={i===4&&mode==='alert'?C.red:i%2?C.cyan:C.gold} o={.78} rx={3}/>)}
 <R x={x+w*.46} y={y+h} w={w*.08} h={55} c={C.steel}/><R x={x+w*.33} y={y+h+50} w={w*.34} h={15} c={C.steel} rx={5}/></g>;
const Rack=({x,y,p,seed}:{x:number;y:number;p:number;seed:number})=><g><R x={x} y={y} w={205} h={680} c="#182b39" rx={4}/>{Array.from({length:9},(_,i)=><g key={i}><R x={x+18} y={y+24+i*70} w={168} h={49} c="#07121c" rx={3}/><Dot x={x+158} y={y+48+i*70} r={5} c={(i+seed)%3===0?C.gold:C.teal} o={.48+.45*Math.abs(Math.sin(p*12+i+seed))}/><R x={x+35} y={y+42+i*70} w={88} h={7} c={C.blue} o={.66}/></g>)}</g>;
const ServerHall=({p,alt=false}:{p:number;alt?:boolean})=><Svg><R x={0} y={0} w={1920} h={1080} c={alt?'#152d3b':'#0b1b27'}/><R x={0} y={815} w={1920} h={265} c="#354b55"/>{Array.from({length:7},(_,i)=><Rack key={i} x={alt?95+i*272:35+i*278} y={alt?105+(i%2)*18:80} p={p} seed={i+(alt?9:0)}/>)}
 {Array.from({length:5},(_,i)=><g key={i}><R x={0} y={70+i*140} w={1920} h={6} c={C.cyan} o={.035+.035*Math.sin(p*9+i)}/></g>)}<path d={`M0 ${900+Math.sin(p*2)*8} H1920`} stroke={C.gold} strokeWidth="4" opacity=".28"/></Svg>;
const DataFlow=({p,kind='network'}:{p:number;kind?:string})=><Svg><R x={0} y={0} w={1920} h={1080} c={kind==='race'?'#111d2c':'#0f2230'}/>{Array.from({length:12},(_,i)=>{const a=i*Math.PI*2/12;const x=960+Math.cos(a)*520,y=500+Math.sin(a)*320;return <g key={i}><L x={960} y={500} X={x} Y={y} c={i%2?C.teal:C.blue} s={5} o={.45}/><Dot x={x} y={y} r={28+(i%3)*7} c={i%3===0?C.gold:C.teal} o={.86}/><Dot x={lerp(960,x,(p*1.7+i*.08)%1)} y={lerp(500,y,(p*1.7+i*.08)%1)} r={9} c={C.white}/></g>})}<Pulse x={960} y={500} p={p} r={220} c={C.gold}/><Dot x={960} y={500} r={86} c={C.slate}/></Svg>;
const Warehouse=({p}:{p:number})=><Svg><R x={0} y={0} w={1920} h={1080} c="#8ea0a4"/><R x={0} y={790} w={1920} h={290} c="#6e7775"/>{Array.from({length:5},(_,i)=><g key={i}><R x={80+i*370} y={130} w={310} h={610} c="#53636a"/>{Array.from({length:4},(_,j)=><g key={j}><R x={105+i*370} y={225+j*130} w={260} h={18} c={C.steel}/><R x={135+i*370+((j+i)%3)*55} y={170+j*130} w={95} h={50} c={j%2?C.gold:C.teal} rx={5}/></g>)}</g>)}
 <path d="M0 885 H1920" stroke={C.gold} strokeWidth="18"/>{Array.from({length:5},(_,i)=><g key={i} transform={`translate(${((p*1100+i*430)%2300)-250} ${820+(i%2)*65})`}><R x={0} y={0} w={170} h={65} c="#283b48" rx={14}/><R x={48} y={-53} w={78} h={55} c={C.blue} rx={8}/><Dot x={38} y={69} r={18} c={C.ink}/><Dot x={140} y={69} r={18} c={C.ink}/></g>)}</Svg>;
const Boardroom=({p}:{p:number})=><Svg><R x={0} y={0} w={1920} h={1080} c="#7f9298"/><R x={0} y={780} w={1920} h={300} c="#756e67"/><R x={120} y={80} w={1680} h={510} c="#9bb8c1"/>{Array.from({length:10},(_,i)=><R key={i} x={165+i*155+(p*50)%90} y={190+(i%3)*78} w={35} h={130} c={C.white} o={.18}/>)}
 <R x={325} y={670} w={1270} h={80} c="#5d4f45" rx={35}/><R x={400} y={740} w={48} h={265} c={C.deep}/><R x={1470} y={740} w={48} h={265} c={C.deep}/><Monitor x={1170} y={210} w={430} h={270} p={p} mode="bars"/></Svg>;
const ExamRoom=({p}:{p:number})=><Svg><R x={0} y={0} w={1920} h={1080} c="#b0b2aa"/><R x={0} y={805} w={1920} h={275} c="#938d80"/>{Array.from({length:4},(_,r)=>Array.from({length:5},(_,i)=><g key={r+'-'+i}><R x={130+i*350} y={230+r*135} w={220} h={42} c="#776654"/><R x={150+i*350} y={270+r*135} w={22} h={90} c={C.deep}/><R x={310+i*350} y={270+r*135} w={22} h={90} c={C.deep}/></g>))}<ClockFace x={1610} y={165} p={p}/></Svg>;
const ClockFace=({x,y,p}:{x:number;y:number;p:number})=><g><circle cx={x} cy={y} r={90} fill={C.paper} stroke={C.deep} strokeWidth={13}/><L x={x} y={y} X={x+Math.sin(p*8)*62} Y={y-Math.cos(p*8)*62} c={C.red} s={6}/><L x={x} y={y} X={x+Math.sin(p*2+1)*43} Y={y-Math.cos(p*2+1)*43} c={C.deep} s={9}/></g>;
const CommandCenter=({p}:{p:number})=><Svg><R x={0} y={0} w={1920} h={1080} c="#101d2c"/><R x={0} y={810} w={1920} h={270} c="#263843"/>{Array.from({length:4},(_,i)=><Monitor key={i} x={110+i*430} y={145+(i%2)*35} w={350} h={230} p={p+i*.1} mode={i===2?'alert':'bars'}/>)}
 <circle cx={960} cy={650} r={240} fill="#0b2633" stroke={C.teal} strokeWidth={4}/>{Array.from({length:8},(_,i)=><g key={i}><L x={960} y={650} X={960+Math.cos(i*Math.PI/4+p*.4)*225} Y={650+Math.sin(i*Math.PI/4+p*.4)*225} c={C.teal} s={3} o={.45}/><Dot x={960+Math.cos(i*.8+p*1.2)*170} y={650+Math.sin(i*.8+p*1.2)*170} r={7} c={i%3===0?C.red:C.gold}/></g>)}</Svg>;
const CustomOffice=({p,admin=false}:{p:number;admin?:boolean})=><Svg><R x={0} y={0} w={1920} h={1080} c={admin?'#a7aaa3':'#88979b'}/><R x={0} y={810} w={1920} h={270} c="#89847c"/>{Array.from({length:4},(_,i)=><g key={i}><R x={110+i*445} y={155} w={360} h={570} c={admin?'#d9d6ca':'#cad1cf'}/><R x={145+i*445} y={195} w={290} h={40} c={i%2?C.teal:C.gold}/>{Array.from({length:4},(_,j)=><R key={j} x={155+i*445} y={305+j*80} w={260-(j%2)*40} h={12} c="#87999c" o={.75}/>)}</g>)}<R x={380} y={690} w={1160} h={75} c="#6f5d4d"/></Svg>;
const RewardLab=({p}:{p:number})=><AbsoluteFill><TemplateBg file="BG_kenkyu.png" p={p} seed={9}/><Svg><R x={155} y={700} w={1450} h={75} c="#6a5d54" o={.9}/>{Array.from({length:7},(_,i)=><g key={i} transform={`translate(${250+i*190} ${675})`}><R x={0} y={0} w={70} h={55} c={i%3===0?C.red:C.paper} rx={6}/><Dot x={35} y={-15-Math.sin(p*7+i)*20} r={9} c={C.gold}/></g>)}<Monitor x={1160} y={250} w={430} h={280} p={p} mode="alert"/></Svg></AbsoluteFill>;
const phaseBackground=(b:Beat,p:number)=>{
 switch(b.phase){
  case 'datacenter_night': return <ServerHall p={p}/>;
  case 'shutdown_document': return <Svg><R x={0} y={0} w={1920} h={1080} c="#101d2a"/><Monitor x={220} y={160} w={1480} h={700} p={p} mode="alert"/>{Array.from({length:7},(_,i)=><g key={i} transform={`translate(${350+i*180} ${620-Math.sin(p*4+i)*35})`}><R x={0} y={0} w={135} h={95} c={i===4?C.red:C.paper} rx={8}/><R x={18} y={23} w={95} h={8} c={C.slate}/><R x={18} y={43} w={70} h={8} c={C.steel}/></g>)}</Svg>;
  case 'logistics_morning': return <Warehouse p={p}/>;
  case 'orthogonality': return <Svg><R x={0} y={0} w={1920} h={1080} c="#172b30"/><R x={240} y={120} w={1440} h={720} c="#26493e" rx={8}/><L x={420} y={730} X={420} Y={260} c={C.paper} s={8}/><L x={420} y={730} X={1510} Y={730} c={C.paper} s={8}/>{Array.from({length:7},(_,i)=><Dot key={i} x={540+i*145} y={650-i*50+(i%2)*90} r={21} c={i%2?C.gold:C.teal}/>) }<Dot x={lerp(520,1450,p)} y={lerp(650,300,p)} r={38} c={C.red}/></Svg>;
  case 'instrumental_convergence': return <DataFlow p={p}/>;
  case 'researcher_analogy': return <TemplateBg file="BG_syosai.png" p={p} seed={5}/>;
  case 'reward_hacking_lab': return <RewardLab p={p}/>;
  case 'alignment_definition': return <Svg><R x={0} y={0} w={1920} h={1080} c="#18242e"/>{Array.from({length:5},(_,i)=><g key={i}><circle cx={370+i*295} cy={410+(i%2)*110} r={118} fill={i%2?C.slate:C.blue} opacity=".75"/><Dot x={370+i*295} y={410+(i%2)*110} r={38} c={i===2?C.red:C.gold}/></g>)}{Array.from({length:4},(_,i)=><L key={i} x={370+i*295} y={410+(i%2)*110} X={665+i*295} Y={410+((i+1)%2)*110} c={C.teal} s={8} o={.5}/>)}</Svg>;
  case 'alignment_faking_experiment': return <Svg><R x={0} y={0} w={1920} h={1080} c="#445b68"/><R x={0} y={800} w={1920} h={280} c="#6d7475"/><Monitor x={180} y={170} w={690} h={420} p={p} mode="bars"/><Monitor x={1050} y={170} w={690} h={420} p={1-p} mode="alert"/><R x={760} y={690} w={400} h={80} c="#6c5e52"/><Pulse x={960} y={520} p={p} r={240} c={C.red}/></Svg>;
  case 'scheming_eval': return <Svg><R x={0} y={0} w={1920} h={1080} c="#677981"/><R x={0} y={800} w={1920} h={280} c="#85827a"/><Monitor x={270} y={180} w={620} h={400} p={p} mode="alert"/><R x={1020} y={160} w={610} h={460} c="#d5d8d0"/>{Array.from({length:7},(_,i)=><R key={i} x={1070} y={205+i*52} w={420+(i%2)*65} h={12} c={i===3?C.red:C.slate} o={.75}/>) }<R x={375} y={700} w={1170} h={70} c="#66574b"/></Svg>;
  case 'evaluation_awareness': return <ExamRoom p={p}/>;
  case 'agent_office': return <TemplateBg file="BG_office.png" p={p} seed={12}/>;
  case 'agent_long_horizon': return <Svg><R x={0} y={0} w={1920} h={1080} c="#9aa7a8"/><R x={0} y={810} w={1920} h={270} c="#817b72"/><R x={180} y={130} w={1560} h={590} c="#e3dfd3"/>{Array.from({length:12},(_,i)=><g key={i}><R x={250+i*118} y={260+(i%4)*90} w={90} h={52} c={i<Math.floor(p*13)?C.teal:C.gold} rx={8}/>{i<11&&<L x={340+i*118} y={286+(i%4)*90} X={365+i*118} Y={286+((i+1)%4)*90} c={C.slate} s={4}/>}</g>)}<ClockFace x={1550} y={610} p={p}/></Svg>;
  case 'ai_research_lab': return <TemplateBg file="BG_kenkyu.png" p={p} seed={17}/>;
  case 'self_improvement_loop': return <Svg><R x={0} y={0} w={1920} h={1080} c="#101f2c"/>{Array.from({length:5},(_,i)=><g key={i}><Monitor x={180+i*335} y={185+(i%2)*270} w={270} h={180} p={(p+i*.15)%1} mode="bars"/>{i<4&&<path d={`M${450+i*335} ${275+(i%2)*270} Q${520+i*335} ${120+(i%2)*650} ${560+i*335} ${275+((i+1)%2)*270}`} stroke={C.gold} strokeWidth="8" fill="none" opacity=".55"/>}</g>)}<path d={`M210 885 C480 ${870-p*150}, 700 ${760-p*210}, 990 ${680-p*260} S1450 ${430-p*180}, 1730 ${250-p*80}`} stroke={C.teal} strokeWidth="15" fill="none"/></Svg>;
  case 'cyber_ops': return <CommandCenter p={p}/>;
  case 'environment_access': return <DataFlow p={p}/>;
  case 'boardroom_competition': return <Boardroom p={p}/>;
  case 'finance_ai': return <TemplateBg file="BG_bank.png" p={p} seed={21}/>;
  case 'public_admin': return <CustomOffice p={p} admin/>;
  case 'military_decision': return <CommandCenter p={p}/>;
  case 'gradual_disempowerment': return <AbsoluteFill><TemplateBg file="BG_town.png" p={p} seed={24}/><Svg>{Array.from({length:7},(_,i)=><g key={i}><R x={155+i*245} y={165+(i%3)*100} w={165} h={110} c={i<Math.floor(p*8)?C.slate:C.paper} o={.78} rx={12}/><Dot x={235+i*245} y={220+(i%3)*100} r={21} c={i<Math.floor(p*8)?C.gold:C.teal}/></g>)}</Svg></AbsoluteFill>;
  case 'dependency_lockin': return <Svg><R x={0} y={0} w={1920} h={1080} c="#172734"/>{Array.from({length:13},(_,i)=>{const a=i*Math.PI*2/13,x=960+Math.cos(a)*560,y=500+Math.sin(a)*340;return <g key={i}><L x={960} y={500} X={x} Y={y} c={i%3===0?C.red:C.teal} s={7} o={.5}/><Dot x={x} y={y} r={30} c={i%2?C.slate:C.blue}/></g>})}<R x={790} y={390} w={340} h={220} c="#4d2329" rx={24}/><circle cx={960} cy={500} r={82} fill={C.red}/><Pulse x={960} y={500} p={p} r={260} c={C.red}/></Svg>;
  case 'race_game': return <Svg><R x={0} y={0} w={960} h={1080} c="#173247"/><R x={960} y={0} w={960} h={1080} c="#3d2831"/><L x={960} y={0} X={960} Y={1080} c={C.paper} s={8} o={.4}/>{[0,1,2,3].map(i=><g key={i}><Monitor x={120+i%2*380} y={160+Math.floor(i/2)*420} w={320} h={220} p={(p+i*.12)%1}/><Monitor x={1080+i%2*380} y={160+Math.floor(i/2)*420} w={320} h={220} p={(1-p+i*.1)%1} mode="alert"/></g>)}<path d={`M150 880 H${150+p*650} M1770 930 H${1770-p*650}`} stroke={C.gold} strokeWidth="18"/></Svg>;
  case 'datacenter_return': return <ServerHall p={p} alt/>;
  case 'final_monitor': return <TemplateBg file="BG_darkroom.png" p={p} seed={31} night/>;
  default: throw Error('V84 missing world '+b.phase);
 }
};
const TemplateCharacters=({b,p}:{b:Beat;p:number})=>{
 const n=b.narration;
 if(b.phase==='researcher_analogy')return <><RESEARCHER_MAN x={340} y={275} scale={.78} action={/研究費|設備/.test(n)?'point':'idle'} talking={/研究者|考える/.test(n)}/></>;
 if(b.phase==='ai_research_lab')return <><RESEARCHER_MAN x={250} y={285} scale={.76} action={/実験|コード/.test(n)?'point':'idle'}/><RESEARCHER_WOMAN x={1200} y={285} scale={.76} action={/論文|分析/.test(n)?'inspectFlask':'idle'} mirror/></>;
 if(b.phase==='agent_office')return <><OfficeWorkerRig x={270} y={285} scale={.78} action={/仕事|作業|進め/.test(n)?'point':'idle'} talking/><OfficeWomanRig x={1240} y={300} scale={.74} action="idle" mirror/></>;
 if(b.phase==='boardroom_competition')return <><OfficeWorkerRig x={290} y={318} scale={.68} action="point"/><OfficeWomanRig x={1280} y={318} scale={.68} action="idle" mirror/></>;
 if(b.phase==='finance_ai')return <><OfficeWorkerRig x={320} y={300} scale={.72} action="idle"/><OfficeWomanRig x={1210} y={300} scale={.72} action="point" mirror/></>;
 if(b.phase==='gradual_disempowerment')return <PASSERBY x={0} y={50} scale={.88} action="walk" walkSpeed={.8}/>;
 if(b.phase==='datacenter_night'||b.phase==='datacenter_return'||b.phase==='final_monitor')return <OfficeWorkerRig x={270+(b.variant%3)*80} y={330} scale={.65} action={/歩|通路/.test(n)?'walk':'idle'} showBriefcase={false} tieVisible={false}/>;
 return null;
};
const SemanticForeground=({b,p}:{b:Beat;p:number})=>{
 const n=b.narration;
 return <Svg>
  {/停止|電源|置き換え/.test(n)&&<g><R x={1420} y={225} w={270} h={180} c="#48282e" rx={20}/><circle cx={1555} cy={315} r={55} fill={C.red}/><Pulse x={1555} y={315} p={p} r={160} c={C.red}/></g>}
  {/資源|電力|サーバー|ネットワーク/.test(n)&&<g>{Array.from({length:5},(_,i)=><g key={i}><Dot x={240+i*335} y={860-(i%2)*90} r={30} c={i%2?C.teal:C.gold}/><L x={240+i*335} y={860-(i%2)*90} X={960} Y={700} c={C.cyan} s={5} o={.35}/></g>)}</g>}
  {/利益|競争|市場|金融/.test(n)&&<path d={`M230 760 C520 730 650 ${650-p*120} 920 ${610-p*150} S1390 ${440-p*160} 1660 ${350-p*180}`} stroke={C.gold} strokeWidth="13" fill="none" opacity=".72"/>}
  {/人間|人類|社会/.test(n)&&<g>{Array.from({length:5},(_,i)=><g key={i} transform={`translate(${650+i*145} ${820+(i%2)*20})`}><circle cy={-58} r={23} fill={C.skin}/><R x={-28} y={-30} w={56} h={95} c={i%2?C.blue:C.teal} rx={19}/></g>)}</g>}
  {/AI|モデル|システム/.test(n)&&<g transform="translate(930 530)"><R x={-130} y={-95} w={260} h={190} c="#1d4052" rx={24}/>{Array.from({length:4},(_,i)=><Dot key={i} x={-72+i*48} y={-20+Math.sin(p*8+i)*12} r={13} c={i%2?C.gold:C.cyan}/>)}</g>}
 </Svg>;
};
export const SceneVisual=({beat,progress,backgroundOnly=false}:{beat:Beat;progress:number;backgroundOnly?:boolean})=>{
 const p=clamp(progress),seed=beat.bgSeed;
 const camScale=1.01+(beat.variant%5)*.008+Math.sin(p*Math.PI)*.018;
 const dx=Math.sin(p*2.6+seed)*24,dy=Math.cos(p*2.1+seed)*13;
 return <AbsoluteFill style={{overflow:'hidden',background:C.ink}}>
  <div style={{position:'absolute',inset:0,transform:`translate(${dx}px,${dy}px) scale(${camScale})`,transformOrigin:'50% 50%'}}>
   {phaseBackground(beat,p)}
  </div>
  {!backgroundOnly&&<><TemplateCharacters b={beat} p={p}/><SemanticForeground b={beat} p={p}/></>}
  <Svg><R x={0} y={0} w={1920} h={1080} c={C.ink} o={.055}/>{Array.from({length:3},(_,i)=><R key={i} x={0} y={i*360+(p*70)%40} w={1920} h={2} c={C.white} o={.035}/>)}</Svg>
 </AbsoluteFill>;
};
