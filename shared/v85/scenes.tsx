import React from 'react';
import {AbsoluteFill,Img,staticFile} from 'remotion';

type Beat={id:string;phase:string;variant:number;narration:string;visual:string;bgGroup:string;bgSeed:number;foreground:string;shotKind:string};
const C={ink:'#111820',deep:'#24313a',slate:'#4d5b62',paper:'#eee9dd',gold:'#d2aa62',red:'#a9504f',teal:'#6a9a91',blue:'#7195a3',skin:'#d4ab8b',wood:'#7b604b',green:'#71866c',sky:'#a9bbc1',white:'#faf7ef'};
const R=({x,y,w,h,c=C.paper,o=1,rx=0}:{x:number;y:number;w:number;h:number;c?:string;o?:number;rx?:number})=><rect x={x} y={y} width={w} height={h} fill={c} opacity={o} rx={rx}/>;
const L=({x,y,X,Y,c=C.ink,s=6,o=1}:{x:number;y:number;X:number;Y:number;c?:string;s?:number;o?:number})=><line x1={x} y1={y} x2={X} y2={Y} stroke={c} strokeWidth={s} opacity={o} strokeLinecap="round"/>;
const O=({x,y,rx,ry,c,o=1}:{x:number;y:number;rx:number;ry:number;c:string;o?:number})=><ellipse cx={x} cy={y} rx={rx} ry={ry} fill={c} opacity={o}/>;
const Svg=({children}:{children:React.ReactNode})=><svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}}>{children}</svg>;
const Person=({x,y,s=1,p=0,walk=false,ancient=false,woman=false}:{x:number;y:number;s?:number;p?:number;walk?:boolean;ancient?:boolean;woman?:boolean})=>{
 const swing=walk?Math.sin(p*7)*28:Math.sin(p*2)*5,cloth=ancient?'#c8b085':woman?'#9e665e':'#596b73';
 return <g transform={`translate(${x} ${y}) scale(${s})`}><path d={`M-28 220 L${-34+swing} 390 M28 220 L${34-swing} 390`} stroke={C.ink} strokeWidth="28" strokeLinecap="round"/><path d="M-65 72 Q0 42 65 72 L78 235 H-78Z" fill={cloth}/><path d={`M-58 100 L${-102+swing} 210 M58 100 L${102-swing} 210`} stroke={cloth} strokeWidth="24" strokeLinecap="round"/><ellipse cy="3" rx="44" ry="53" fill={C.skin}/><path d="M-48 -10 Q-38 -74 0 -78 Q46 -72 48 -10" fill={C.ink}/></g>;
};
const Phone=({x,y,p}:{x:number;y:number;p:number})=><g transform={`translate(${x} ${y}) rotate(${Math.sin(p*4)*4})`}><R x={-86} y={-165} w={172} h={330} c={C.ink} rx={20}/><R x={-72} y={-142} w={144} h={270} c="#dbe0d7" rx={8}/>{Array.from({length:4},(_,i)=><g key={i}><R x={-54} y={-112+i*57+Math.sin(p*5+i)*6} w={104+(i%2)*18} h={26} c={i%2?C.gold:C.teal} rx={6}/></g>)}</g>;
const Steam=({x,y,p,n=8}:{x:number;y:number;p:number;n?:number})=><g>{Array.from({length:n},(_,i)=>{const u=(p+i*.17)%1;return <path key={i} d={`M${x+i*30} ${y-u*210} q${-20+Math.sin(i+p*5)*25} -45 ${Math.sin(i+p*4)*28} -82`} stroke={C.paper} strokeWidth={8+i%3*2} opacity={(1-u)*.45} fill="none"/>})}</g>;
const Template=({file,p,night=false}:{file:string;p:number;night?:boolean})=><AbsoluteFill style={{overflow:'hidden',background:C.deep}}><Img src={staticFile('assets/library/背景/'+file)} style={{width:'100%',height:'100%',objectFit:'cover',transform:`translate(${-35+Math.sin(p*2)*22}px,${-18+Math.cos(p*2)*12}px) scale(${1.06+Math.sin(p*Math.PI)*.012})`,filter:night?'brightness(.55) saturate(.75)':'brightness(.82) saturate(.8)'}}/></AbsoluteFill>;
const Apartment=({p}:{p:number})=><Svg><R x={0} y={0} w={1920} h={1080} c="#56646b"/><R x={0} y={805} w={1920} h={275} c="#8a8377"/><R x={1100} y={120} w={570} h={510} c="#314d5b"/>{Array.from({length:10},(_,i)=><R key={i} x={1140+(i*51+p*70)%480} y={220+(i%3)*70} w={28} h={18} c={C.gold} o={.3+.3*Math.sin(p*7+i)}/>) }<R x={140} y={605} w={720} h={170} c="#c2b6a5" rx={28}/><R x={930} y={690} w={660} h={65} c={C.wood}/><Steam x={1430} y={650} p={p} n={5}/></Svg>;
const Plain=({p}:{p:number})=><Svg><R x={0} y={0} w={1920} h={1080} c="#a7b2a3"/><circle cx="1550" cy="180" r="90" fill="#d9bf79" opacity=".75"/><path d="M0 650 Q420 500 820 650 T1920 620 V1080 H0Z" fill="#7f8768"/><path d="M0 760 Q400 660 920 745 T1920 720 V1080 H0Z" fill="#626f55"/>{Array.from({length:7},(_,i)=><path key={i} d={`M${120+i*285+Math.sin(p*2+i)*18} 790 q40 -150 80 0`} stroke="#59674a" strokeWidth="13" fill="none"/> )}</Svg>;
const Factory=({p}:{p:number})=><Svg><R x={0} y={0} w={1920} h={1080} c="#727f83"/><R x={0} y={800} w={1920} h={280} c="#605b54"/>{Array.from({length:5},(_,i)=><g key={i}><circle cx={250+i*340} cy={390+(i%2)*70} r={95} fill="#39464c" stroke={C.paper} strokeWidth="12"/>{Array.from({length:8},(_,j)=><L key={j} x={250+i*340} y={390+(i%2)*70} X={250+i*340+Math.sin(j*.785+p*5)*82} Y={390+(i%2)*70+Math.cos(j*.785+p*5)*82} c={C.paper} s={6}/>)}</g>)}<path d={`M0 ${700+Math.sin(p*3)*8} H1920`} stroke={C.gold} strokeWidth="22"/></Svg>;
const Graph=({p}:{p:number})=><Svg><R x={0} y={0} w={1920} h={1080} c="#1c2a32"/><L x={250} y={800} X={250} Y={190} c={C.paper} s={8}/><L x={250} y={800} X={1660} Y={800} c={C.paper} s={8}/><path d={`M280 760 C550 720 610 ${650-p*120} 830 ${610-p*160} S1250 ${430-p*180} 1600 ${310-p*120}`} stroke={C.gold} strokeWidth="14" fill="none"/>{Array.from({length:5},(_,i)=><circle key={i} cx={400+i*280} cy={730-i*90} r={34} fill={i===4?C.red:C.teal}/>)}</Svg>;
const Agora=({p}:{p:number})=><Svg><R x={0} y={0} w={1920} h={1080} c="#d2c39e"/><R x={0} y={810} w={1920} h={270} c="#b79868"/>{Array.from({length:6},(_,i)=><g key={i}><R x={150+i*300} y={180} w={42} h={510} c="#ede1c4"/><R x={118+i*300} y={150} w={110} h={35} c="#c8b48c"/></g>)}<circle cx="1570" cy="165" r="90" fill="#d9ae58"/>{Array.from({length:5},(_,i)=><O key={i} x={250+i*330+Math.sin(p*3+i)*20} y={760} rx={70} ry={20} c="#8c7455" o={.25}/>)}</Svg>;
const Ship=({p}:{p:number})=><Svg><R x={0} y={0} w={1920} h={1080} c="#8baab7"/><path d="M0 620 Q220 570 440 620 T880 620 T1320 620 T1760 620 T2200 620 V1080 H0Z" fill="#4c788c"/><path d="M500 620 L1500 620 L1320 820 L650 820Z" fill="#775c45"/><L x={1000} y={255} X={1000} Y={700} c="#4e3e35" s={28}/><path d="M1020 280 L1450 520 L1020 520Z" fill={C.paper} opacity=".88"/>{Array.from({length:6},(_,i)=><path key={i} d={`M${50+i*330} ${540+Math.sin(p*4+i)*15} q80 -40 160 0`} stroke={C.paper} strokeWidth="7" fill="none" opacity=".5"/>)}</Svg>;
const River=({p}:{p:number})=><Svg><R x={0} y={0} w={1920} h={1080} c="#a8bcc2"/><R x={0} y={760} w={1920} h={320} c="#6f846b"/><path d="M0 810 Q450 720 900 810 T1920 800 V1080 H0Z" fill="#7aa1ae"/>{Array.from({length:9},(_,i)=><path key={i} d={`M${100+i*210} ${780+Math.sin(p*4+i)*12} q55 -35 110 0`} stroke={C.paper} strokeWidth="5" fill="none" opacity=".4"/>)}</Svg>;
const Gym=({p}:{p:number})=><Svg><R x={0} y={0} w={1920} h={1080} c="#7f8888"/><R x={0} y={810} w={1920} h={270} c="#58595a"/>{Array.from({length:4},(_,i)=><g key={i}><L x={250+i*430} y={210} X={250+i*430} Y={760} c="#353d42" s={20}/><R x={180+i*430} y={240} w={140} h={28} c={C.red}/></g>)}<L x={580} y={650} X={1340} Y={650} c={C.ink} s={24}/>{[0,1].map(i=><g key={i}><circle cx={560+i*800} cy={650} r={78} fill="#333"/><circle cx={560+i*800} cy={650} r={42} fill="#666"/></g>)}</Svg>;
const Desk=({p}:{p:number})=><Svg><R x={0} y={0} w={1920} h={1080} c="#a9a79d"/><R x={0} y={810} w={1920} h={270} c="#857d70"/><R x={310} y={650} w={1260} h={75} c={C.wood}/><R x={390} y={720} w={42} h={250} c={C.ink}/><R x={1450} y={720} w={42} h={250} c={C.ink}/>{Array.from({length:6},(_,i)=><R key={i} x={580+i*115} y={530-(i%2)*35} w={95} h={120} c={[C.paper,C.gold,C.teal,C.blue,C.red,C.paper][i]} rx={6}/>)}</Svg>;
const Stairs=({p}:{p:number})=><Svg><R x={0} y={0} w={1920} h={1080} c="#8a999d"/>{Array.from({length:9},(_,i)=><g key={i}><R x={240+i*120} y={810-i*70} w={500} h={70} c={i%2?'#b9b4a8':'#9e9b92'}/></g>)}<L x={740} y={200} X={1450} Y={840} c={C.slate} s={16}/><L x={790} y={180} X={1500} Y={820} c={C.slate} s={16}/></Svg>;
const Mountain=({p}:{p:number})=><Svg><R x={0} y={0} w={1920} h={1080} c="#9cb4be"/><path d="M0 820 L380 390 L650 680 L930 280 L1210 650 L1560 360 L1920 790 V1080 H0Z" fill="#5d746b"/><path d="M700 1080 Q820 850 930 690 Q1080 510 1230 390" stroke="#c7af82" strokeWidth="54" fill="none"/>{Array.from({length:5},(_,i)=><O key={i} x={350+i*310+Math.sin(p*3+i)*18} y={270+i%2*90} rx={80} ry={28} c={C.paper} o={.35}/>)}</Svg>;
const phaseBg=(b:Beat,p:number)=>{
 switch(b.phase){
 case 'late_night_comfort': return <Apartment p={p}/>;
 case 'ancestral_plain': return <Plain p={p}/>;
 case 'industrial_comfort': return <Factory p={p}/>;
 case 'comfort_creep': return <Graph p={p}/>;
 case 'phone_dopamine': return <Apartment p={p}/>;
 case 'sweet_tolerance': return <Apartment p={p}/>;
 case 'boredom_everywhere': return <Template file="BG_town.png" p={p}/>;
 case 'mountain_contrast': return <Mountain p={p}/>;
 case 'diogenes_agora': return <Agora p={p}/>;
 case 'jar_minimalism': return <Agora p={p}/>;
 case 'odysseus_binding': return <Ship p={p}/>;
 case 'morning_run': return <River p={p}/>;
 case 'gym_adaptation': return <Gym p={p}/>;
 case 'focus_desk': return <Template file="BG_syosai.png" p={p}/>;
 case 'small_discomforts': return <Stairs p={p}/>;
 case 'return_home': return <Template file="BG_town.png" p={p} night/>;
 case 'final_reflection': return <Template file="BG_syosai.png" p={p} night/>;
 default: throw Error('missing V85 world '+b.phase);
 }
};
const Action=({b,p}:{b:Beat;p:number})=>{
 const n=b.narration,v=b.variant,dx=(v%5-2)*55;
 if(b.phase==='late_night_comfort'||b.phase==='phone_dopamine'||b.phase==='sweet_tolerance'){
  return <Svg><Person x={500+dx} y={410} s={.8} p={p}/>{/スマートフォン|画面|動画/.test(n)&&<Phone x={1350} y={430} p={p}/>} {/夕食|料理|食事|菓子/.test(n)&&<g><R x={1000} y={650} w={300} h={70} c={C.paper} rx={18}/><Steam x={1080} y={630} p={p}/></g>}{/ソファ|座/.test(n)&&<R x={230} y={690} w={730} h={120} c="#b5a895" rx={28}/>}</Svg>;
 }
 if(b.phase==='ancestral_plain')return <Svg>{[0,1,2].map(i=><Person key={i} x={340+i*470+Math.sin(p*2+i)*40} y={430} s={.63} p={p} walk ancient/>)}{/水|水場/.test(n)&&<O x={1450} y={820} rx={190} ry={55} c={C.blue} o={.65}/>}</Svg>;
 if(b.phase==='industrial_comfort')return <Svg>{/工場|作業員|荷物/.test(n)&&<Person x={400+p*180} y={430} s={.72} p={p} walk/>}{/自動車|フォークリフト|機械/.test(n)&&<g transform={`translate(${1100+p*280} 720)`}><R x={0} y={0} w={270} h={80} c={C.red} rx={15}/><O x={60} y={85} rx={26} ry={26} c={C.ink}/><O x={220} y={85} rx={26} ry={26} c={C.ink}/></g>}</Svg>;
 if(b.phase==='comfort_creep')return <Svg>{Array.from({length:4},(_,i)=><g key={i}><R x={380+i*300} y={880-(i+1)*120} w={210} h={80} c={i===v%4?C.red:C.teal} rx={10}/></g>)}</Svg>;
 if(b.phase==='boredom_everywhere')return <Svg><Person x={460+dx} y={430} s={.75} p={p}/>{/電車|窓/.test(n)&&<R x={980} y={180} w={680} h={430} c="#7fa5b1" o={.65}/>} {/スマートフォン|画面/.test(n)&&<Phone x={1360} y={450} p={p}/>}</Svg>;
 if(b.phase==='mountain_contrast')return <Svg><Person x={780+dx+p*120} y={500} s={.62} p={p} walk/>{/水/.test(n)&&<g><R x={1280} y={600} w={80} h={150} c={C.blue} rx={22}/><Steam x={1300} y={600} p={p} n={2}/></g>}</Svg>;
 if(b.phase==='diogenes_agora'||b.phase==='jar_minimalism')return <Svg><Person x={780+dx} y={420} s={.72} p={p} ancient/>{b.phase==='jar_minimalism'&&<O x={1270} y={720} rx={170} ry={240} c={C.wood} o={.85}/>} {/砂|雪|困難/.test(n)&&Array.from({length:16},(_,i)=><Dot key={i} x={250+(i*103+p*65)%1450} y={760+(i%3)*24} r={6+i%3} c={C.gold}/>)}</Svg>;
 if(b.phase==='odysseus_binding')return <Svg><Person x={930} y={380} s={.7} p={p} ancient/>{Array.from({length:5},(_,i)=><L key={i} x={860+i*35} y={430} X={1000} Y={290+i*45} c={C.paper} s={5} o={.8}/>)}{/セイレーン|誘惑/.test(n)&&<g>{[0,1].map(i=><Person key={i} x={260+i*1370} y={430} s={.55} p={p} woman ancient/>)}</g>}</Svg>;
 if(b.phase==='morning_run')return <Svg><Person x={360+p*900} y={470} s={.65} p={p} walk woman/>{/心拍|呼吸|負荷/.test(n)&&<g>{Array.from({length:5},(_,i)=><O key={i} x={1250+i*70} y={340+Math.sin(p*8+i)*25} rx={16} ry={16} c={C.red} o={.7}/>)}</g>}</Svg>;
 if(b.phase==='gym_adaptation')return <Svg><Person x={930} y={350-Math.sin(p*Math.PI)*90} s={.78} p={p}/><L x={700} y={660-Math.sin(p*Math.PI)*90} X={1180} Y={660-Math.sin(p*Math.PI)*90} c={C.ink} s={22}/>{/危険|怪我|極端/.test(n)&&<R x={1450} y={220} w={220} h={110} c={C.red} rx={18}/>}</Svg>;
 if(b.phase==='focus_desk')return <Svg><Person x={470+dx} y={420} s={.7} p={p}/><R x={900} y={620} w={340} h={210} c={C.paper} rx={8}/>{/スマートフォン|通知/.test(n)&&<Phone x={1450} y={480} p={p}/>} {/本|文章|ページ/.test(n)&&<g>{Array.from({length:5},(_,i)=><R key={i} x={930} y={650+i*28} w={250-i*20} h={8} c={C.slate}/>)}</g>}</Svg>;
 if(b.phase==='small_discomforts')return <Svg><Person x={520+p*550} y={500-p*240} s={.62} p={p} walk/>{/スマートフォン|画面/.test(n)&&<Phone x={1500} y={450} p={p}/>}</Svg>;
 if(b.phase==='return_home'||b.phase==='final_reflection')return <Svg><Person x={420+dx+p*80} y={430} s={.72} p={p} walk={/歩|外|戻/.test(n)}/>{/映画|画面|スマートフォン/.test(n)&&<Phone x={1450} y={460} p={p}/>} {/椅子|座/.test(n)&&<R x={1030} y={650} w={370} h={130} c={C.wood} rx={24}/>}</Svg>;
 return <Svg><Person x={500+dx} y={430} s={.75} p={p}/></Svg>;
};
const Dot=({x,y,r=7,c=C.gold,o=1}:{x:number;y:number;r?:number;c?:string;o?:number})=><circle cx={x} cy={y} r={r} fill={c} opacity={o}/>;
export const SceneVisual=({beat,progress,backgroundOnly=false}:{beat:Beat;progress:number;backgroundOnly?:boolean})=>{
 const p=Math.max(0,Math.min(1,progress)),seed=beat.bgSeed,scale=1.012+(beat.variant%4)*.008+Math.sin(p*Math.PI)*.018,dx=Math.sin(p*2.8+seed)*24,dy=Math.cos(p*2.1+seed)*13;
 return <AbsoluteFill style={{overflow:'hidden',background:C.ink}}><div style={{position:'absolute',inset:0,transform:`translate(${dx}px,${dy}px) scale(${scale})`,transformOrigin:'50% 50%'}}>{phaseBg(beat,p)}</div>{!backgroundOnly&&<Action b={beat} p={p}/>}<Svg><R x={0} y={0} w={1920} h={1080} c={C.ink} o={.045}/></Svg></AbsoluteFill>;
};