import React from 'react';
import {C,R,L,P,Ring,Person,Vehicle,Paper,School,Hospital,q,lerp} from './primitives';

export const Stadium=({p=0,night=false}:{p?:number;night?:boolean})=><g>
 <R x={0} y={0} w={1920} h={1080} c={night?'#111b25':'#7190a0'}/>
 <ellipse cx={960} cy={665} rx={780} ry={360} fill={night?'#263743':'#b8c2b7'} stroke="#d8d1c4" strokeWidth="36"/>
 <ellipse cx={960} cy={665} rx={540} ry={225} fill="#668c66"/>
 {Array.from({length:72},(_,i)=>{const a=i/72*Math.PI*2;const x=960+Math.cos(a)*690;const y=665+Math.sin(a)*310;const show=q(p*1.6-i/95);return <circle key={i} cx={x} cy={y} r={9+(i%3)} fill={i%4===0?C.gold:i%4===1?C.teal:i%4===2?C.red:C.cream} opacity={show}/>})}
 {night&&Array.from({length:8},(_,i)=><R key={i} x={170+i*220} y={100} w={24} h={340} c="#c8d8df" o={.65}/>)}
 </g>;

export const CrowdRow=({x=200,y=540,n=10,p=1,stand=false}:{x?:number;y?:number;n?:number;p?:number;stand?:boolean})=><g>{Array.from({length:n},(_,i)=><Person key={i} x={x+i*130} y={y+(i%2)*10} s={.38} pose={stand?'stand':'sit'} p={q(p-i*.05)} role={i%5===0?'child':'modern'}/>)}</g>;

export const Flag=({x,y,p=0,s=1,c=C.red}:{x:number;y:number;p?:number;s?:number;c?:string})=><g transform={'translate('+x+' '+y+') scale('+s+')'}><L x={0} y={0} X={0} Y={330} c={C.steel} sw={10}/><P d={'M0 20 C'+lerp(70,120,p)+' '+lerp(0,25,p)+' '+lerp(160,210,p)+' '+lerp(45,5,p)+' 260 40 L260 170 C170 '+lerp(135,175,p)+' 80 '+lerp(165,120,p)+' 0 170Z'} c={c}/></g>;

export const Newspaper=({x,y,p=0,s=1,open=true}:{x:number;y:number;p?:number;s?:number;open?:boolean})=><g transform={'translate('+x+' '+y+') scale('+s+') rotate('+lerp(-5,4,p)+')'}>
 <R x={open?-210:-105} y={-150} w={open?420:210} h={300} c={C.paper} stroke={C.wood}/>
 {open&&<L x={0} y={-140} X={0} Y={140} c={C.wood} sw={4}/>}
 {Array.from({length:10},(_,i)=><R key={i} x={(open?-185:-85)+(i%2)*(open?205:0)} y={-105+Math.floor(i/2)*48} w={open?165:150} h={7} c={i===0?C.ink:C.steel} o={.75}/>)}
 <R x={open?-185:-85} y={-130} w={open?350:160} h={16} c={C.ink}/>
 </g>;

export const PrintingPress=({x,y,p=0,s=1}:{x:number;y:number;p?:number;s?:number})=><g transform={'translate('+x+' '+y+') scale('+s+')'}>
 <R x={-220} y={-120} w={440} h={250} c="#4d5960" stroke={C.ink} sw={8}/>
 <circle cx="-130" cy="0" r="75" fill="none" stroke={C.gold} strokeWidth="15" transform={'rotate('+lerp(0,280,p)+' -130 0)'}/>
 <circle cx="85" cy="-20" r="62" fill="none" stroke={C.steel} strokeWidth="15" transform={'rotate('+lerp(0,-330,p)+' 85 -20)'}/>
 <R x={-180} y={90} w={350} h={20} c={C.paper}/>
 <R x={lerp(-160,80,p)} y={65} w={160} h={120} c={C.paper} stroke={C.wood}/>
 </g>;

export const SteamTrain=({x,y,p=0,s=1}:{x:number;y:number;p?:number;s?:number})=><g transform={'translate('+(x+lerp(-280,240,p))+' '+y+') scale('+s+')'}>
 <R x={-260} y={-80} w={370} h={120} c="#374852" rx={15}/><R x={-135} y={-175} w={95} h={95} c="#475963"/>
 <circle cx="-180" cy="55" r="50" fill={C.ink}/><circle cx="15" cy="55" r="50" fill={C.ink}/><R x={85} y={-50} w={180} h={90} c="#5e6f77"/>
 {Array.from({length:5},(_,i)=><circle key={i} cx={-150-i*45+lerp(0,-60,p)} cy={-190-i*20} r={35+i*6} fill="#d4d2c9" opacity={.55-i*.07}/>)}
 </g>;

export const FestivalHill=({p=0}:{p?:number})=><g>
 <R x={0} y={0} w={1920} h={1080} c="#9d9a82"/><R x={0} y={780} w={1920} h={300} c="#8b765e"/>
 <P d="M550 780 Q960 290 1370 780Z" c="#718666"/>
 {Array.from({length:18},(_,i)=>{const x=620+(i%6)*135,y=690-Math.floor(i/6)*120;return <Person key={i} x={x} y={y} s={.28} pose="stand" p={p} role="modern"/>})}
 <Person x={960} y={340} s={.6} pose="point" p={p} role="diplomat"/>
 <Flag x={300} y={320} p={p} s={.7} c={C.blue}/><Flag x={1590} y={320} p={1-p} s={.7} c={C.red}/>
 </g>;

export const Procession=({p=0}:{p?:number})=><g><R x={0} y={0} w={1920} h={1080} c="#9d8f79"/><R x={0} y={730} w={1920} h={350} c="#776558"/>
 {Array.from({length:12},(_,i)=><Person key={i} x={160+i*145+lerp(-90,90,p)} y={480+(i%2)*18} s={.46} pose="walk" p={p} role={i%3===0?'soldier':'modern'}/>)}
 <Flag x={360+lerp(-90,90,p)} y={280} p={p} s={.55} c={C.red}/><Flag x={1040+lerp(-90,90,p)} y={280} p={p} s={.55} c={C.blue}/>
 </g>;

export const CeremonyAging=({p=0,stage=0}:{p?:number;stage?:number})=><g>
 <R x={0} y={0} w={1920} h={1080} c={stage<2?'#8d9b96':'#6d7c80'}/><R x={0} y={760} w={1920} h={320} c="#71685e"/>
 <R x={580} y={270} w={760} h={330} c="#776657"/><Flag x={960} y={150} p={p} s={.58} c={stage%2?C.blue:C.red}/>
 <Person x={650} y={500} s={stage===0?.48:stage===1?.58:.7} pose="stand" p={p} role={stage===0?'child':'modern'}/>
 <Person x={820} y={500} s={.72} pose="stand" p={p} role="modern"/>
 {stage>=2&&<Person x={1010} y={510} s={.47} pose="stand" p={p} role="child"/>}
 </g>;

export const LectureHall=({p=0}:{p?:number})=><g><R x={0} y={0} w={1920} h={1080} c="#6d6258"/><R x={200} y={120} w={1520} h={530} c="#d8cfb9"/>
 <R x={700} y={570} w={520} h={70} c={C.wood}/><Person x={960} y={390} s={.72} pose="point" p={p} role="teacher"/>
 {Array.from({length:15},(_,i)=><Person key={i} x={260+(i%5)*330} y={720+Math.floor(i/5)*90} s={.31} pose="sit" p={p} role="modern"/>)}
 </g>;

export const Museum=({p=0,storage=false}:{p?:number;storage?:boolean})=><g><R x={0} y={0} w={1920} h={1080} c={storage?'#36444c':'#c7c3b7'}/><R x={0} y={780} w={1920} h={300} c={storage?'#555b5e':'#8d8478'}/>
 {storage?Array.from({length:5},(_,i)=><g key={i}><R x={80+i*365} y={100} w={300} h={650} c="#53616a"/>{Array.from({length:6},(_,j)=><R key={j} x={110+i*365} y={145+j*95} w={240} h={55} c={j%2?C.wood:C.paper}/>)}</g>):Array.from({length:4},(_,i)=><g key={i}><R x={150+i*430} y={220} w={300} h={430} c="#e4e0d4"/><R x={190+i*430} y={270} w={220} h={260} c={i%2?C.blue:C.gold}/></g>)}
 {!storage&&<Person x={900} y={500} s={.6} pose="walk" p={p}/>}
 </g>;

export const Cemetery=({p=0}:{p?:number})=><g><R x={0} y={0} w={1920} h={1080} c="#aeb9b5"/><R x={0} y={650} w={1920} h={430} c="#71836c"/>
 {Array.from({length:32},(_,i)=>{const row=Math.floor(i/8),col=i%8;return <g key={i} transform={'translate('+(150+col*220)+' '+(390+row*135)+') scale('+(1-row*.08)+')'}><R x={-32} y={-80} w={64} h={105} rx={25} c={C.white}/><R x={-55} y={-20} w={110} h={28} c={C.white}/></g>})}
 <Person x={690} y={515} s={.58} pose="walk" p={p}/><Person x={860} y={525} s={.42} pose="walk" p={p} role="child"/>
 </g>;

export const MeijiStreet=({p=0}:{p?:number})=><g><R x={0} y={0} w={1920} h={1080} c="#9fa79a"/><R x={0} y={720} w={1920} h={360} c="#806c58"/>
 {Array.from({length:3},(_,i)=><g key={i}><R x={80+i*360} y={360-(i%2)*40} w={300} h={300} c="#8f7358"/><P d={'M60 '+(360-(i%2)*40)+' L230 '+(250-(i%2)*40)+' L400 '+(360-(i%2)*40)+'Z'} c="#5e4c40"/></g>)}
 {Array.from({length:3},(_,i)=><g key={i}><R x={1150+i*250} y={260+(i%2)*50} w={210} h={390} c="#8f9691"/>{Array.from({length:5},(_,j)=><R key={j} x={1190+i*250} y={310+j*60+(i%2)*50} w={130} h={35} c="#b9c7c6"/>)}</g>)}
 <Vehicle x={880} y={690} p={p} kind="wagon"/><Person x={1180} y={470} s={.62} pose="walk" p={p} role="clerk"/><Person x={550} y={480} s={.62} pose="walk" p={1-p} role="farmer"/>
 </g>;

export const Classroom=({p=0,old=false}:{p?:number;old?:boolean})=><g><R x={0} y={0} w={1920} h={1080} c={old?'#8d8170':'#a6b4b2'}/><R x={0} y={780} w={1920} h={300} c="#756b5e"/>
 <R x={180} y={120} w={1560} h={340} c={old?'#493f36':'#42606a'}/>
 <Person x={360} y={440} s={.65} pose="point" p={p} role="teacher"/>
 {Array.from({length:15},(_,i)=><Person key={i} x={620+(i%5)*220} y={520+Math.floor(i/5)*140} s={.33} pose="sit" p={p} role="child"/>)}
 </g>;

export const AdminCutaway=({p=0}:{p?:number})=><g><R x={0} y={0} w={1920} h={1080} c="#263743"/>
 {Array.from({length:4},(_,floor)=><g key={floor}><R x={220} y={120+floor*210} w={1480} h={170} c={floor%2?'#738389':'#829196'}/><L x={220} y={290+floor*210} X={1700} Y={290+floor*210} c={C.ink} sw={8}/>{Array.from({length:4},(_,i)=><Person key={i} x={380+i*340} y={140+floor*210} s={.33} pose={i%2?'write':'read'} p={q(p-floor*.08-i*.03)} role="clerk"/>)}</g>)}
 </g>;

export const QuakeTown=({p=0,repair=false}:{p?:number;repair?:boolean})=><g><R x={0} y={0} w={1920} h={1080} c="#87979c"/><R x={0} y={760} w={1920} h={320} c="#746b62"/>
 {Array.from({length:5},(_,i)=><g key={i} transform={'translate('+(100+i*360)+' '+(350+(i%2)*40)+') rotate('+(repair?0:(i%3-1)*5)+')'}><R x={0} y={0} w={280} h={280} c={repair?'#8b9796':'#83786d'}/><R x={50} y={60} w={70} h={90} c={C.sky}/><R x={160} y={60} w={70} h={90} c={C.sky}/>{!repair&&i%2===0&&<P d="M0 230 L100 180 L180 280Z" c="#5d5550"/>}</g>)}
 {repair&&<><Vehicle x={760} y={720} p={p} kind="truck"/><Person x={1080} y={480} s={.6} pose="push" p={p} role="worker"/></>}
 </g>;

export const FutureCity=({p=0,model=false}:{p?:number;model?:boolean})=><g transform={model?'translate(320 180) scale(.66)':'translate(0 0) scale(1)'}><R x={0} y={0} w={1920} h={1080} c="#91aab7"/><R x={0} y={780} w={1920} h={300} c="#6e7c73"/>
 {Array.from({length:7},(_,i)=><g key={i}><R x={90+i*260} y={190+(i%3)*100} w={190} h={500-(i%3)*80} c={i%2?'#788c96':'#8ba19f'}/>{Array.from({length:5},(_,j)=><R key={j} x={125+i*260} y={240+(i%3)*100+j*70} w={120} h={35} c="#c8d8d4"/>)}</g>)}
 <L x={80} y={710} X={1840} Y={620} c={C.teal} sw={22} p={p}/><Vehicle x={lerp(250,1600,p)} y={690} p={0} kind="bus"/>
 </g>;

export const SchoolPhoto=({p=0,narrow=false}:{p?:number;narrow?:boolean})=><g><R x={0} y={0} w={1920} h={1080} c="#b8c6c0"/><R x={0} y={760} w={1920} h={320} c="#7c8b75"/><R x={250} y={160} w={1420} h={640} c="none" stroke={narrow?C.red:C.paper} sw={narrow?36:18}/>
 {Array.from({length:20},(_,i)=>{const x=390+(i%5)*285,y=360+Math.floor(i/5)*135;const out=narrow&&(i%5===0||i%5===4);return <g key={i} opacity={out?lerp(1,.16,p):1}><Person x={x} y={y} s={.32} pose="stand" p={p} role="child"/></g>})}
 {narrow&&<g><R x={250} y={160} w={lerp(0,250,p)} h={640} c={C.black} o={.72}/><R x={lerp(1670,1420,p)} y={160} w={250} h={640} c={C.black} o={.72}/></g>}
 </g>;

export const SymbolRemoval=({p=0}:{p?:number})=><g><R x={0} y={0} w={1920} h={1080} c="#75858b"/><R x={0} y={780} w={1920} h={300} c="#66635e"/>
 <Flag x={360} y={210} p={0} s={.62} c={C.red}/><R x={720} y={210} w={260} h={350} c={C.paper} stroke={C.wood}/><R x={1120} y={230} w={310} h={260} c={C.gold}/><R x={1510} y={200} w={180} h={330} c={C.blue}/>
 <g opacity={1-p}><L x={290} y={170} X={460} Y={610} c={C.red} sw={16}/><L x={680} y={170} X={1030} Y={610} c={C.red} sw={16}/><L x={1080} y={170} X={1460} Y={610} c={C.red} sw={16}/><L x={1460} y={170} X={1730} Y={610} c={C.red} sw={16}/></g>
 <Person x={960} y={500} s={.7} pose="stand" p={p}/>
 </g>;

export const ServiceState=({p=0}:{p?:number})=><g><R x={0} y={0} w={1920} h={1080} c="#273944"/>
 <School x={120} y={180} s={.65}/><Hospital x={680} y={170} s={.72}/><R x={1320} y={190} w={430} h={320} c="#9aa6a3"/><Vehicle x={1530} y={600} p={p} kind="bus"/>
 <Person x={360} y={560} s={.55} pose="walk" p={p}/><Person x={980} y={560} s={.55} pose="walk" p={p} role="nurse"/><Paper x={760} y={650} w={400} h={230} chart/>
 </g>;

export const VisualThesis=({p=0}:{p?:number})=><g><R x={0} y={0} w={1920} h={1080} c="#0f1b25"/>
 <circle cx={960} cy={540} r={lerp(70,230,p)} fill={C.paper} opacity={.95}/>
 {Array.from({length:12},(_,i)=>{const a=i/12*Math.PI*2,x=960+Math.cos(a)*lerp(520,690,p),y=540+Math.sin(a)*lerp(300,390,p);return <g key={i}><L x={960} y={540} X={x} Y={y} c={i%3===0?C.gold:i%3===1?C.teal:C.red} sw={6} p={q(p-i*.04)}/><circle cx={x} cy={y} r="34" fill={i%3===0?C.gold:i%3===1?C.teal:C.red}/></g>})}
 <Ring x={960} y={540} p={p} r={330} c={C.gold}/>
 </g>;
