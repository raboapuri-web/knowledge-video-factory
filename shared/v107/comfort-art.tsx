import React from 'react';
import {C,R,L,P,Ring,Person,Vehicle,Paper,Coin,House,Hospital,School,q,lerp} from './primitives';

export const K={night:'#111d27',ink:'#1e2c36',paper:'#efe7d8',gold:'#d8b477',red:'#b9625f',teal:'#72a49e',blue:'#66889a',stone:'#8d8378',wood:'#765e4b',mist:'#b9c6c2'};
export const ease=(p:number)=>{const x=q(p);return x*x*(3-2*x)};
export const TXT=({x,y,t,s=38,c=K.paper,anchor='middle',o=1}:{x:number;y:number;t:string;s?:number;c?:string;anchor?:'start'|'middle'|'end';o?:number})=><text x={x} y={y} textAnchor={anchor} fontFamily="Noto Sans JP,sans-serif" fontWeight={760} fontSize={s} fill={c} opacity={o}>{t}</text>;
const list=(s:string)=>s.split(/\s+/);
export const objectGroups:Record<string,string[]>={
 human:list('man people couple farmer seneca epicurus philosophers hand hands'),
 home:list('aircon alarm elevator escalator fireplace firewood bucket pan takeout snack water door stairs villa hotel hospital mall'),
 device:list('phone inbox laptop ui presentation button'),
 document:list('book paper scroll taskcard roadmap timeline labels'),
 structure:list('housepair transport utilities furniture screw shelf bedpair bridge mountain obstacles friction window paths podium treadmill'),
 data:list('balance scale bargraph baseline curve meter nodes cycle distance markers marker paradox question loop fear shadow flame skills blocks comfortgrid'),
 exercise:list('barbell'),
 logistics:list('deliverybag')
};
const memberships=new Map(Object.entries(objectGroups).flatMap(([g,a])=>a.map(k=>[k,g])));
export const categoryFor=(kind:string)=>{const v=memberships.get(kind);if(!v)throw Error('V107 unsupported object '+kind);return v};

const Doc=({kind,p}:{kind:string;p:number})=><g>
 <R x={-215} y={-285} w={430} h={560} rx={12} c={K.paper} stroke={K.wood} sw={6}/>
 {kind==='scroll'&&<g><circle cx={-215} cy={-275} r={24} fill={K.wood}/><circle cx={215} cy={275} r={24} fill={K.wood}/></g>}
 {kind==='book'&&<L x={0} y={-270} X={0} Y={260} c={K.wood} sw={9}/>}
 {kind==='timeline'?<g><L x={-155} y={70} X={165} Y={70} c={K.gold} sw={10} p={p}/>{[-135,-40,55,150].map((x,i)=><circle key={i} cx={x} cy={70} r={17} fill={i%2?K.teal:K.gold} opacity={q((p-i*.13)*3)}/>)}</g>:
 kind==='roadmap'?<g><P d={'M-150 180 Q-50 20 40 -45 Q120 -110 170 -210'} c="none" stroke={K.gold} sw={12}/>{[-1,0,1].map((i)=><circle key={i} cx={i*80} cy={100-i*110} r={18} fill={K.teal}/>)}</g>:
 Array.from({length:7},(_,i)=><R key={i} x={-150} y={-190+i*60} w={300-(i%3)*50} h={9} c={i===3?K.red:K.stone} o={.75}/>)}
</g>;

const Device=({kind,p}:{kind:string;p:number})=>{
 if(kind==='phone')return <g><R x={-145} y={-285} w={290} h={560} rx={32} c="#23323c" stroke={K.paper} sw={8}/><R x={-115} y={-230} w={230} h={430} rx={12} c="#55798b"/>{[0,1,2].map((i)=><R key={i} x={-82} y={-155+i*115} w={164} h={70} rx={11} c={i%2?K.gold:K.teal} o={q((p-i*.14)*3)}/>)}</g>;
 if(kind==='laptop')return <g><R x={-250} y={-190} w={500} h={340} rx={18} c="#344956" stroke={K.paper} sw={8}/><R x={-215} y={-150} w={430} h={255} c="#7a9aa5"/><P d="M-310 175 H310 L250 250 H-250Z" c="#2d3940"/></g>;
 if(kind==='presentation')return <g><R x={-300} y={-230} w={600} h={420} c="#d8d7c9" stroke={K.wood} sw={7}/><R x={-225} y={-155} w={410} h={38} c={K.blue}/>{[160,260,110].map((h,i)=><R key={i} x={-205+i*145} y={150-h*p} w={95} h={h*p} c={i%2?K.gold:K.teal}/>)}</g>;
 if(kind==='button')return <g><circle r={190} fill="#4b5d67" stroke={K.paper} strokeWidth={13}/><circle r={110} fill={K.red}/><TXT x={0} y={18} t="回避" s={46}/></g>;
 if(kind==='inbox')return <g><R x={-300} y={-220} w={600} h={440} c="#617984" rx={25}/>{[0,1,2,3].map((i)=><R key={i} x={-235} y={-160+i*90} w={470} h={62} rx={10} c={i===0?K.red:K.paper} o={i===0?.86:.52}/>)}</g>;
 return <g>{[0,1,2,3,4].map((i)=><R key={i} x={-290+i*120} y={-120+(i%2)*90} w={105} h={105} rx={18} c={i%2?K.gold:K.teal} o={q((p-i*.1)*3)}/>)}</g>;
};

const Human=({kind,p}:{kind:string;p:number})=>{
 if(kind==='hands'||kind==='hand')return <g>{(kind==='hand'?[0]:[-1,1]).map((i,idx)=><g key={idx} transform={'translate('+(i*150)+' 0)'}><ellipse cy={-80} rx={70} ry={105} fill="#d5b08f" stroke={K.ink} strokeWidth={6}/><R x={-55} y={5} w={110} h={250} rx={25} c={idx%2?K.blue:K.teal}/></g>)}</g>;
 const roles=kind==='couple'?['modern','teacher']:kind==='people'?['modern','worker','teacher']:kind==='farmer'?['farmer']:kind==='seneca'||kind==='epicurus'||kind==='philosophers'?['lord',...(kind==='philosophers'?['monk'] as const:[])]:['modern'];
 return <g>{roles.map((role,i)=><Person key={i} x={(i-(roles.length-1)/2)*230} y={-85+(i%2)*18} role={role as any} pose={kind==='farmer'?'carry':kind==='seneca'||kind==='epicurus'?'read':i%2?'point':'stand'} s={roles.length>1?.8:1.08} p={p}/>)}</g>;
};

const Home=({kind,p}:{kind:string;p:number})=>{
 const e=ease(p);
 if(kind==='aircon')return <g><R x={-315} y={-120} w={630} h={230} rx={25} c="#dce3df" stroke={K.ink} sw={6}/>{[-180,-60,60,180].map((x,i)=><path key={i} d={'M'+x+' 120 Q'+(x+30)+' '+(190+40*e)+' '+(x-20)+' '+(260+60*e)} stroke={K.blue} strokeWidth={9} fill="none" opacity={.65}/>)}</g>;
 if(kind==='alarm'||kind==='clock')return <g><circle r={235} fill={K.paper} stroke={K.ink} strokeWidth={13}/><L x={0} y={0} X={150*Math.sin(e*6.28)} Y={-150*Math.cos(e*6.28)} c={K.ink} sw={13}/><L x={0} y={0} X={-100*Math.cos(e*3.14)} Y={100*Math.sin(e*3.14)} c={K.red} sw={9}/></g>;
 if(kind==='elevator')return <g><R x={-290} y={-320} w={580} h={650} c="#7d8989" stroke={K.paper} sw={10}/><L x={0} y={-310} X={0} Y={320} c={K.ink} sw={8}/><TXT x={0} y={-355} t={String(1+Math.floor(p*9))} s={48} c={K.gold}/></g>;
 if(kind==='escalator'||kind==='stairs')return <g>{[0,1,2,3,4,5].map((i)=><R key={i} x={-360+i*110} y={180-i*75} w={125} h={75+i*75} c={kind==='stairs'?(i%2?K.stone:'#75695e'):'#586d77'}/>)}</g>;
 if(kind==='fireplace'||kind==='firewood')return <g><R x={-280} y={-90} w={560} h={350} c="#63524a"/><P d="M-150 260 V-30 Q0 -190 150 -30 V260Z" c="#20262a"/>{[-80,0,80].map((x,i)=><P key={i} d={'M'+x+' 150 Q'+(x-70)+' '+(40-80*e)+' '+x+' '+(-40-70*e)+' Q'+(x+70)+' '+(45-50*e)+' '+x+' 150Z'} c={i%2?K.gold:K.red}/>)}</g>;
 if(kind==='bucket')return <g><P d="M-180 -120 L180 -120 L130 240 L-130 240Z" c="#70848a" stroke={K.ink} sw={7}/><path d="M-150 -120 Q0 -330 150 -120" fill="none" stroke={K.wood} strokeWidth={15}/></g>;
 if(kind==='pan')return <g><ellipse rx={230} ry={105} fill="#41494e" stroke={K.paper} strokeWidth={7}/><L x={210} y={0} X={430} Y={-100} c={K.wood} sw={25}/>{[-80,20,90].map((x,i)=><circle key={i} cx={x+25*Math.sin(e*6+i)} cy={-5-30*Math.cos(e*5+i)} r={45-i*7} fill={i%2?K.gold:K.teal}/>)}</g>;
 if(kind==='takeout')return <g><R x={-260} y={-160} w={520} h={330} rx={30} c="#d8caa9" stroke={K.wood} sw={7}/><R x={-210} y={-105} w={420} h={50} c={K.red} o={.7}/></g>;
 if(kind==='snack')return <g><P d="M-160 -260 L190 -235 L150 250 L-180 230Z" c="#b88a68"/>{[0,1,2].map(i=><circle key={i} cx={-70+i*75} cy={-20+i%2*65} r={40} fill={i%2?K.gold:K.red} opacity={1-.2*e}/>)}</g>;
 if(kind==='water')return <g><P d="M-170 -260 H170 L120 250 H-120Z" c="#a8c9cf" o={.72}/><P d={'M-120 '+(100-260*e)+' H120 L100 220 H-100Z'} c={K.blue} o={.75}/></g>;
 if(kind==='door')return <g><R x={-210} y={-320} w={420} h={650} c="#8b7766" stroke={K.paper} sw={10}/><P d={'M-170 -270 L'+lerp(160,40,e)+' -220 L'+lerp(160,40,e)+' 270 L-170 280Z'} c="#405865"/><circle cx={lerp(105,15,e)} cy={40} r={14} fill={K.gold}/></g>;
 if(kind==='hospital')return <Hospital x={-150} y={-150} s={1}/>;
 if(kind==='hotel'||kind==='villa'||kind==='mall')return <g><R x={-360} y={-250} w={720} h={500} c={kind==='hotel'?'#a9927f':kind==='villa'?'#8b765f':'#8ba1a4'}/>{[0,1,2,3,4].map(i=><R key={i} x={-290+i*120} y={-160+(i%2)*120} w={85} h={95} c="#c4d0c9"/>)}</g>;
 return <g><House x={-160} y={-150} s={1.1}/></g>;
};

const Data=({kind,p}:{kind:string;p:number})=>{
 const e=ease(p);
 if(kind==='bargraph'||kind==='baseline'||kind==='meter'||kind==='curve')return <g><L x={-300} y={220} X={310} Y={220} c={K.paper} sw={10}/><L x={-300} y={220} X={-300} Y={-250} c={K.paper} sw={10}/>
 {kind==='curve'?<P d={'M-280 110 Q-80 '+(-150*e)+' 70 20 Q190 '+(200-300*e)+' 300 -130'} c="none" stroke={K.gold} sw={13}/>:kind==='baseline'?<g><L x={-270} y={120} X={260} Y={-150*e} c={K.gold} sw={14}/><TXT x={60} y={-190*e} t="普通" s={34}/></g>:[150,260,110,330].map((h,i)=><R key={i} x={-255+i*145} y={220-h*e} w={95} h={h*e} c={i%2?K.gold:K.teal}/>)}</g>;
 if(kind==='balance'||kind==='scale')return <g><L x={0} y={-260} X={0} Y={260} c={K.paper} sw={18}/><g transform={'rotate('+lerp(-9,9,e)+' 0 -100)'}><L x={-320} y={-100} X={320} Y={-100} c={K.gold} sw={20}/></g>{[-220,220].map((x,i)=><R key={i} x={x-120} y={60+(i?35:-35)*e} w={240} h={28} c={i?K.red:K.teal}/>)}</g>;
 if(kind==='comfortgrid')return <g>{[0,1,2,3].map(i=><g key={i} transform={'translate('+(-220+(i%2)*440)+' '+(-160+Math.floor(i/2)*320)+')'}><R x={-140} y={-110} w={280} h={220} rx={25} c={i%2?K.gold:K.teal}/><TXT x={0} y={12} t={['冷房','配達','移動','動画'][i]} s={38} c={K.ink}/></g>)}</g>;
 if(kind==='question')return <TXT x={0} y={80} t="？" s={330} c={K.gold}/>;
 if(kind==='paradox')return <g><Arrowish x1={-310} y1={-120} x2={220} y2={-120} c={K.teal}/><Arrowish x1={220} y1={140} x2={-310} y2={140} c={K.red}/><TXT x={0} y={15} t="快適 ↔ 弱さ" s={52}/></g>;
 if(kind==='shadow'||kind==='fear')return <g><P d="M-220 250 L-170 -180 Q0 -350 170 -180 L220 250Z" c="#465967" o={.72}/><circle cy={-240} r={120} fill="#2c3d49"/><Ring x={0} y={-50} p={e} r={230} c={K.red}/></g>;
 if(kind==='flame')return <P d="M0 260 Q-210 80 -55 -80 Q-40 -230 30 -300 Q60 -150 145 -80 Q260 80 0 260Z" c={K.gold}/>;
 if(kind==='cycle')return <g>{[0,1,2].map(i=><path key={i} d={'M'+(-250+i*250)+' 100 Q'+(-120+i*250)+' -220 '+(20+i*250)+' 80'} fill="none" stroke={i%2?K.teal:K.gold} strokeWidth={15} strokeDasharray="950" strokeDashoffset={950*(1-e)}/>)}</g>;
 if(kind==='distance')return <g><L x={-330} y={120} X={330} Y={120} c={K.paper} sw={13} p={e}/>{[-290,0,290].map((x,i)=><circle key={i} cx={x} cy={120} r={24} fill={i===1?K.red:K.gold}/>)}</g>;
 if(kind==='nodes'||kind==='markers'||kind==='marker'||kind==='skills'||kind==='blocks')return <g>{[0,1,2,3].map(i=><g key={i}><R x={-310+(i%2)*330} y={-220+Math.floor(i/2)*260} w={250} h={170} rx={22} c={i%2?K.gold:K.teal} o={q((e-i*.1)*3)}/>{kind==='skills'&&<TXT x={-185+(i%2)*330} y={-120+Math.floor(i/2)*260} t={['考える','工夫','待つ','話す'][i]} s={31} c={K.ink}/>}</g>)}</g>;
 if(kind==='loop')return <g><circle r={250} fill="none" stroke={K.red} strokeWidth={18} strokeDasharray="55 24"/><path d="M175 -175 L300 -155 L225 -60Z" fill={K.red}/></g>;
 if(kind==='treadmill')return <g><R x={-330} y={130} w={660} h={105} rx={50} c="#485a65"/><Person x={-80+120*e} y={-70} s={.8} pose="walk" role="modern" p={p}/><R x={235} y={-190} w={60} h={335} c={K.wood}/></g>;
 return <g><Ring x={0} y={0} p={e} r={230} c={K.gold}/><TXT x={0} y={18} t={kind.slice(0,8)} s={35}/></g>;
};
const Arrowish=({x1,y1,x2,y2,c}:{x1:number;y1:number;x2:number;y2:number;c:string})=><g><L x={x1} y={y1} X={x2} Y={y2} c={c} sw={14}/><P d={'M'+(x2-35)+' '+(y2-25)+' L'+x2+' '+y2+' L'+(x2-35)+' '+(y2+25)} c="none" stroke={c} sw={9}/></g>;

const Structure=({kind,p}:{kind:string;p:number})=>{
 const e=ease(p);
 if(kind==='barbell')return <g><L x={-350} y={0} X={350} Y={0} c={K.paper} sw={24}/>{[-260,-220,220,260].map((x,i)=><R key={i} x={x-25} y={-125} w={50} h={250} c={i%2?K.red:K.gold}/>)}</g>;
 if(kind==='mountain')return <g><P d="M-390 250 L-110 -270 L30 -80 L160 -340 L420 250Z" c="#66777c"/><P d="M-110 -270 L-35 -135 L-180 -115Z" c={K.paper}/><P d="M160 -340 L235 -190 L95 -195Z" c={K.paper}/></g>;
 if(kind==='bridge')return <g><P d="M-360 160 Q0 -260 360 160" c="none" stroke={K.wood} sw={28}/><L x={-330} y={160} X={330} Y={160} c={K.paper} sw={18}/>{[-240,-120,0,120,240].map(x=><L key={x} x={x} y={160} X={x} Y={-140+Math.abs(x)*.45} c={K.wood} sw={7}/>)}</g>;
 if(kind==='transport')return <Vehicle x={0} y={80} p={p} kind={p<.33?'wagon':p<.66?'bus':'car'}/>;
 if(kind==='utilities')return <g><R x={-290} y={-185} w={580} h={370} c="#77898b"/><L x={-180} y={-240} X={-180} Y={220} c={K.blue} sw={28}/><L x={0} y={-240} X={0} Y={220} c={K.gold} sw={28}/><L x={180} y={-240} X={180} Y={220} c={K.red} sw={28}/></g>;
 if(kind==='furniture'||kind==='shelf')return <g><R x={-310} y={-260} w={620} h={520} c="#806a56" stroke={K.ink} sw={8}/>{[-150,0,150].map(y=><R key={y} x={-280} y={y} w={560} h={25} c="#59483b"/>)}</g>;
 if(kind==='screw')return <g transform={'rotate('+(e*540)+')'}><R x={-35} y={-250} w={70} h={500} c="#aeb9ba"/><P d="M-110 -250 H110 L65 -340 H-65Z" c="#aeb9ba"/></g>;
 if(kind==='bedpair')return <g>{[-220,120].map((x,i)=><g key={i}><R x={x} y={-80} w={300} h={220} c={i?K.stone:'#b7a88d'}/><R x={x+20} y={-140} w={120} h={75} c={K.paper}/></g>)}</g>;
 if(kind==='obstacles'||kind==='friction'||kind==='window'||kind==='paths')return <g>{[0,1,2,3].map(i=><R key={i} x={-330+i*185} y={120-(i%2)*120} w={120} h={120+(i%2)*120} c={i%2?K.red:K.gold} rx={12} o={.75}/>)}</g>;
 if(kind==='podium')return <g><R x={-210} y={-80} w={420} h={320} c="#775f4f"/><R x={-270} y={-130} w={540} h={60} c="#a58d72"/><L x={0} y={-130} X={0} Y={-300} c={K.ink} sw={12}/><circle cy={-325} r={30} fill={K.red}/></g>;
 if(kind==='treadmill')return <Data kind="treadmill" p={p}/>;
 return <Data kind={kind} p={p}/>;
};

export const ComfortSubject=({kind,p=0}:{kind:string;p?:number})=>{
 const cat=categoryFor(kind);
 if(cat==='human')return <Human kind={kind} p={p}/>;
 if(cat==='device')return <Device kind={kind} p={p}/>;
 if(cat==='document')return <Doc kind={kind} p={p}/>;
 if(cat==='home')return <Home kind={kind} p={p}/>;
 if(cat==='data')return <Data kind={kind} p={p}/>;
 if(cat==='exercise'||cat==='structure')return <Structure kind={kind} p={p}/>;
 if(cat==='logistics')return <g><R x={-190} y={-210} w={380} h={420} rx={45} c="#8e725c"/><L x={-120} y={-215} X={-75} Y={-315} c={K.paper} sw={14}/><L x={120} y={-215} X={75} Y={-315} c={K.paper} sw={14}/></g>;
 throw Error('V107 missing object renderer '+kind);
};
