import React from 'react';
import raw from './scene-data.json';
type M={id:string;phase:string;variant:number;narration:string;bgGroup:string;bgSeed:number;shotKind:string;visual:string};
const beats=raw as M[];
const K={navy:'#101b29',sand:'#b9a384',sand2:'#d0bd99',bronze:'#b98c52',edge:'#efd4a0',ink:'#283b43',ash:'#66716e',olive:'#687561',red:'#af514d',sea:'#537581',white:'#eee3cb',dark:'#293c4a',blue:'#8eabb0'};
const clamp=(p:number)=>Math.min(1,Math.max(0,p));
const ease=(p:number)=>{const q=clamp(p);return q*q*(3-2*q)};
const it=(a:number,b:number,p:number)=>a+(b-a)*ease(p);
const rand=(s:number,k:number)=>((s*7919+k*1049+k*k*97)%10007)/10007;
const has=(t:string,r:RegExp)=>r.test(t);
const Rect=({x,y,w,h,f=K.ink,o=1,r=0}:{x:number;y:number;w:number;h:number;f?:string;o?:number;r?:number})=><rect x={x} y={y} width={w} height={h} fill={f} opacity={o} rx={r}/>;
const Line=({x,y,X,Y,f=K.edge,sw=6,p=1,o=1}:{x:number;y:number;X:number;Y:number;f?:string;sw?:number;p?:number;o?:number})=><line x1={x} y1={y} x2={it(x,X,p)} y2={it(y,Y,p)} stroke={f} strokeWidth={sw} strokeLinecap="round" opacity={o}/>;
const Arrow=({x,y,X,Y,p=1,f=K.red}:{x:number;y:number;X:number;Y:number;p?:number;f?:string})=><g><Line x={x} y={y} X={X} Y={Y} f={f} p={p} sw={9}/>{p>.86&&<path d={'M'+(X-22)+' '+(Y-16)+' L'+X+' '+Y+' L'+(X-22)+' '+(Y+16)} fill="none" stroke={f} strokeWidth={8}/>}</g>;
const Halo=({x,y,p=1,r=95,f=K.red}:{x:number;y:number;p?:number;r?:number;f?:string})=><circle cx={x} cy={y} r={it(12,r,p)} fill="none" stroke={f} strokeWidth="8" opacity={.9*p}/>;
const Dust=({seed,p=1,x=1000,y=600,n=13}:{seed:number;p?:number;x?:number;y?:number;n?:number})=><g>{Array.from({length:n},(_,i)=>{const d=rand(seed,i+1),q=rand(seed,i+21);return <circle key={i} cx={x+(d-.5)*it(100,820,p)} cy={y+(q-.5)*it(10,210,p)} r={3+d*12} fill={K.sand2} opacity={.25*p}/>})}</g>;
const Actor=({x,y=580,s=1,p=0,enemy=false,back=false,lean=0,shield=true,fallen=false,walking=false,helm=true}:{x:number;y?:number;s?:number;p?:number;enemy?:boolean;back?:boolean;lean?:number;shield?:boolean;fallen?:boolean;walking?:boolean;helm?:boolean})=>{
 const sway=walking?Math.sin(p*Math.PI*4)*13:0,co=enemy?'#a1a0a1':'#bda276',flag=enemy?'#874c4b':'#455c58';
 return <g transform={'translate('+x+' '+(y+sway)+') rotate('+(fallen?it(0,80,p):lean)+' 0 70) scale('+s+')'}>
 <Line x={-23} y={305} X={-30+(walking?Math.sin(p*6*Math.PI)*35:0)} Y={492} f={K.ash} sw={34}/>
 <Line x={23} y={305} X={35-(walking?Math.sin(p*6*Math.PI)*35:0)} Y={492} f={K.ash} sw={34}/>
 <path d="M-70 91 Q0 62 68 91 L76 307 H-75Z" fill={flag}/><path d="M-49 105 L0 125 L48 105 L22 260 H-23Z" fill={co}/>
 <Line x={-60} y={125} X={-112} Y={274} f={co} sw={26}/>
 <Line x={60} y={123} X={113} Y={265} f={co} sw={26}/>
 <ellipse cx={0} cy={0} rx={49} ry={64} fill={co}/>
 {helm&&<g><path d="M-65 -22 Q-55 -106 0 -111 Q57 -107 65 -21 L45 -34 L30 -63 H-30 L-47 -29Z" fill={K.bronze}/><path d="M-20 -105 L-7 -160 L7 -160 L21 -105" fill={enemy?K.red:K.ink}/><Line x={0} y={-155} X={0} Y={-109} f={enemy?K.red:K.ink} sw={8}/></g>}
 {!back&&<g><circle cx={-16} cy={-5} r={4} fill={K.ink}/><circle cx={17} cy={-5} r={4} fill={K.ink}/><path d="M-15 29 Q0 22 16 29" stroke={K.ink} fill="none" strokeWidth={4}/></g>}
 {shield&&<g transform={'translate('+(-115+(back?205:0))+' '+(140+(walking?Math.sin(p*6*Math.PI)*10:0))+')'}><circle r={106} fill={enemy?'#747b7b':K.bronze} stroke={K.edge} strokeWidth={14}/><circle r={76} fill="none" stroke="#f8dca4" strokeWidth={6} opacity=".55"/><circle r={25} fill={K.edge}/><path d="M-58 -5 L0 -63 L58 -5 L0 59Z" fill={K.ink} opacity=".38"/></g>}
 <Line x={106} y={242} X={134} Y={-240} f={K.bronze} sw={12}/>
 <path d="M132 -240 l-18 48 h35Z" fill="#d6d8cc"/>
 </g>;
};
const Row=({x=400,y=560,count=6,step=174,p=0,enemy=false,back=false,gap=-1,move=0,scale=.55,fallen=-1,walking=false,shield=true}:{x?:number;y?:number;count?:number;step?:number;p?:number;enemy?:boolean;back?:boolean;gap?:number;move?:number;scale?:number;fallen?:number;walking?:boolean;shield?:boolean})=><g>{Array.from({length:count},(_,i)=>i===gap?null:<Actor key={i} x={x+i*step+move} y={y+(i%2)*5} s={scale} enemy={enemy} back={back} p={p} fallen={i===fallen} walking={walking} shield={shield}/>)}</g>;
type World='mantinea'|'collision'|'analysis'|'overhead'|'retreat'|'march'|'sparta'|'poetry'|'thermopylae';
const worldOf=(ph:string):World=>{
 if(ph.startsWith('aristodemos'))return 'sparta';
 if(ph==='tyrtaeus_poetry')return 'poetry';
 if(ph==='feigned_retreat')return 'thermopylae';
 if(['shield_closeup','formation_caution','retreat_distinction','rear_rank_caution','casualties','escape_examples','final_answer'].includes(ph))return 'analysis';
 if(['phalanx_overhead','gap_spreads','mantinea_drift','drift_chain','panic_spreads'].includes(ph))return 'overhead';
 if(['retreat_turn','retreat_equipment'].includes(ph))return 'retreat';
 if(['spartans_flute','march_rhythm','rear_rank'].includes(ph))return 'march';
 if(['prologue_impact','prologue_question'].includes(ph))return 'collision';
 return 'mantinea';
};
const Plate=({m}:{m:M})=>{
 const s=m.bgSeed,w=worldOf(m.phase),mount=160+rand(s,1)*180,horizon=570+Math.round(rand(s,2)*145);
 const sky=s%4===0?'#5b7783':s%4===1?'#7a8582':s%4===2?'#9b977f':'#647780';
 return <g data-static-background={m.bgGroup}>
 <rect width={1920} height={1080} fill={sky}/>
 {w==='overhead'?<g><rect width={1920} height={1080} fill="#bea77e"/>{Array.from({length:12},(_,i)=><path key={i} d={'M'+(i*213-100)+' 0 Q'+(i*217-190)+' 500 '+(i*213-100)+' 1080'} fill="none" stroke={i%2?'#a08d69':'#deca9d'} strokeWidth={16+rand(s,i+8)*36} opacity=".35"/>)}</g>:
 w==='analysis'?<g><rect width={1920} height={1080} fill={s%2?'#1c2f3c':'#273c42'}/><path d="M120 160 H1800 V900 H120Z" fill="#d9cdb0" stroke={K.bronze} strokeWidth="22"/><path d="M168 205 H1750 V854 H168Z" fill="#c3b18e"/>{Array.from({length:8},(_,i)=><Line key={i} x={230+i*195} y={235} X={230+i*195} Y={810} f="#a08b67" sw={2} o={.3}/>)}</g>:
 w==='sparta'?<g><rect width={1920} height={1080} fill="#89938b"/><path d={'M0 '+horizon+' Q500 '+(horizon-mount)+' 960 '+(horizon-40)+' Q1470 '+(horizon-mount*.5)+' 1920 '+(horizon+30)+' V1080 H0Z'} fill="#7a8a76"/><Rect x={0} y={735} w={1920} h={345} f="#ad997b"/>{Array.from({length:6},(_,i)=>{const x=85+i*333+Math.round(rand(s,i+11)*60);return <g key={i}><Rect x={x} y={380+(i%3)*40} w={265} h={410} f={i%2?'#bead90':'#d2c2a3'}/><path d={'M'+(x-16)+' '+(370+(i%3)*40)+' L'+(x+130)+' '+(290+(i%3)*40)+' L'+(x+279)+' '+(370+(i%3)*40)+'Z'} fill="#745e53"/><Rect x={x+100} y={600} w={66} h={175} f="#473d35"/></g>})}</g>:
 w==='poetry'?<g><rect width={1920} height={1080} fill="#2b3439"/><Rect x={75} y={80} w={1770} h={910} f="#6b6050"/><Rect x={115} y={125} w={1690} h={820} f="#a78b65"/>{Array.from({length:16},(_,i)=><path key={i} d={'M'+(160+i*101)+' 125 Q'+(270+i*101)+' 450 '+(155+i*101)+' 945'} fill="none" stroke="#bfa579" strokeWidth={4} opacity=".32"/>)}</g>:
 w==='thermopylae'?<g><rect width={1920} height={1080} fill="#85979c"/><path d="M0 620 L80 200 L410 100 L720 540 L1050 175 L1340 245 L1510 500 L1920 85 V1080 H0Z" fill="#647575"/><path d="M0 720 L660 450 L1280 650 L1920 510 V1080 H0Z" fill="#8a8875"/><path d="M0 900 Q790 800 1360 950 Q1630 1080 1920 900 V1080 H0Z" fill="#3c6175"/></g>:
 <g><Rect x={0} y={0} w={1920} h={1080} f={sky}/><path d={'M0 '+horizon+' L180 '+(horizon-mount*.4)+' L510 '+(horizon-mount)+' L840 '+(horizon-40)+' L1170 '+(horizon-mount*.63)+' L1480 '+(horizon-40)+' L1920 '+(horizon-mount*.68)+' V1080 H0Z'} fill={s%2?'#6d7a6a':'#65766d'}/><path d={'M0 '+(horizon+90)+' Q480 '+(horizon-30)+' 920 '+(horizon+120)+' Q1450 '+(horizon+30)+' 1920 '+(horizon+100)+' V1080 H0Z'} fill={s%3?'#b09f7b':'#bba985'}/>{Array.from({length:16},(_,i)=>{const x=rand(s,i+20)*1920,y=horizon+140+rand(s,i+45)*270;return <g key={i}><ellipse cx={x} cy={y} rx={14+rand(s,i+17)*25} ry={4+rand(s,i+3)*7} fill="#7a815f" opacity=".5"/><circle cx={x+9} cy={y-5} r={3} fill="#e4d2a6"/></g>})}</g>}
 <rect x="0" y="0" width="1920" height="1080" fill="none" stroke="#17222a" strokeWidth="26" opacity=".18"/>
 </g>;
};
const Plain=({m,p}:{m:M;p:number})=>{const t=m.narration;return <g><Row x={130} y={535} count={7} step={215} scale={.58} p={p} walking={has(t,/前進|進ん|近づ|歩調/)} move={has(t,/進|前へ|近づ/)?it(0,105,p):0}/><Row x={410} y={375} count={6} step={185} scale={.38} enemy p={p} move={has(t,/敵|近づ/)?it(0,-65,p):0}/><Dust seed={m.bgSeed} p={p} x={960} y={810}/>{has(t,/あなた|盾|隣|構える|最前列/)&&<g><Actor x={480} y={470} s={.95} p={p}/><Actor x={950} y={470} s={.95} p={p}/></g>}{has(t,/逃|後ろ|恐|一人/)&&<Halo x={650} y={650} p={p} f={K.red} r={165}/>}</g>};
const Collision=({m,p}:{m:M;p:number})=>{const t=m.narration;return <g><Row x={115} y={440} step={250} count={6} p={p} scale={.83} fallen={has(t,/膝|倒れ/)?2:-1}/><Row x={200} y={245} step={285} count={6} enemy p={p} scale={.48} move={it(0,-60,p)}/><Dust seed={m.bgSeed} p={p} x={930} y={640} n={24}/>{has(t,/槍|視界|衝撃|ぶつか|怖|逃/)&&<g><Line x={1680} y={290} X={it(1680,650,p)} Y={it(290,620,p)} f={K.bronze} sw={17}/><path d={'M'+it(1680,650,p)+' '+it(290,620,p)+' l34 -25 l-8 70Z'} fill={K.edge}/></g>}{has(t,/隣|膝|倒れ/)&&<Halo x={740} y={550} p={p} r={130}/>}</g>};
const Analysis=({m,p}:{m:M;p:number})=>{const t=m.narration,ph=m.phase;return <g>{ph==='shield_closeup'?<g><Actor x={1030} y={300} s={1.1} p={p}/><circle cx={390} cy={490} r={210} fill={K.bronze} stroke={K.edge} strokeWidth={20}/><circle cx={390} cy={490} r={150} fill="none" stroke={K.ink} strokeWidth={7}/><Line x={1250} y={590} X={1500} Y={80} f={K.bronze} sw={23} p={p}/><Arrow x={570} y={540} X={840} Y={470} p={p}/></g>:
 ph==='casualties'?<g>{Array.from({length:2},(_,i)=>{const x=355+i*680,y=320;return <g key={i}><Rect x={x} y={y} w={420} h={390} f={K.white} r={10}/>{Array.from({length:20},(_,j)=><Rect key={j} x={x+24+(j%5)*78} y={y+40+Math.floor(j/5)*78} w={41} h={48} f={j<(i?3:1)?K.red:K.olive} o={j<(i?3:1)?1:.56} r={6}/>)}<Rect x={x+15} y={745} w={390} h={26} f={i?K.red:K.olive} r={5}/><Rect x={x+15} y={785} w={it(25,i?350:135,p)} h={20} f={i?K.red:K.olive}/></g>})}{has(t,/後ろ|逃|全体|統計/)&&<Halo x={1020} y={510} p={p} r={250} f={K.red}/>}</g>:
 ph==='formation_caution'||ph==='rear_rank_caution'?<g><Row x={350} y={245} count={6} step={210} scale={.57} p={p}/><Row x={340} y={555} count={6} step={230} scale={.53} p={p}/>{Array.from({length:6},(_,i)=><Line key={i} x={400+i*205} y={315} X={400+i*205} Y={640} p={p} f={i%2?K.red:K.olive} sw={4} o={.65}/>)}</g>:
 ph==='escape_examples'?<g><Row x={300} y={225} count={6} step={210} scale={.42} p={p} enemy/><Row x={280} y={580} count={6} step={190} scale={.43} p={p} move={it(0,70,p)}/><Arrow x={410} y={700} X={900} Y={730} p={p} f={K.olive}/><Arrow x={1420} y={680} X={1630} Y={760} p={p} f={K.olive}/></g>:
 ph==='retreat_distinction'?<g><Row x={170} y={230} count={5} step={245} scale={.48} p={p} back move={it(0,-70,p)}/><Row x={200} y={570} count={5} step={250} scale={.46} p={p} move={it(0,170,p)} walking/><Arrow x={410} y={680} X={1310} Y={680} p={p} f={K.olive}/><Actor x={1480} y={450} s={.52} p={p} back walking/></g>:
 ph==='final_answer'?<g><Actor x={950} y={290} s={1.15} p={p}/>{Array.from({length:6},(_,i)=><g key={i}><circle cx={220+i*285} cy={310+(i%2)*90} r={55} fill={i%2?K.bronze:K.olive} opacity={it(0,.83,p)}/><Line x={255+i*285} y={355} X={870} Y={610} f={K.edge} sw={7} p={p} o={.68}/></g>)}</g>:<g><Row x={280} y={330} count={6} step={220} scale={.55} p={p}/><Row x={300} y={585} count={6} step={220} scale={.43} p={p} back/><Halo x={915} y={500} p={p} r={140}/></g>}
 {has(t,/議論|断定|統計|違う|反例|すべて/)&&<g><Line x={230} y={810} X={1690} Y={810} f={K.red} sw={11} p={p} o={.75}/></g>}
 </g>};
const Overhead=({m,p}:{m:M;p:number})=>{const t=m.narration,ph=m.phase;const gap=ph==='gap_spreads'?Math.max(0,Math.floor(p*6)):ph==='panic_spreads'?Math.floor(p*6): -1;
return <g><g transform="translate(90 110)">{Array.from({length:4},(_,row)=><g key={row}>{Array.from({length:8},(_,i)=>{const x=130+i*204+(ph==='mantinea_drift'||ph==='drift_chain'?it(0,(i+1)*11+row*16,p):0),y=180+row*177;const leave=(ph==='panic_spreads'||ph==='gap_spreads')&&(i===gap||ph==='panic_spreads'&&i>0&&i<=gap);const q=ph==='gap_spreads'?row===0&&i===3:leave;return <g key={i} transform={'translate('+x+' '+(y+(q?it(0,110,p):0))+')'} opacity={q?it(1,.19,p):1}><circle r={69} fill={i%2?K.bronze:'#a58858'} stroke={K.edge} strokeWidth={11}/><circle r={42} fill="none" stroke={K.ink} strokeWidth={6}/><circle r={12} fill={K.ink}/><Line x={44} y={-43} X={98} Y={-112} f={K.bronze} sw={9}/></g>})}</g>)}</g>
 {ph==='gap_spreads'&&<g><Rect x={755} y={201} w={100} h={580} f={K.red} o={it(0,.38,p)}/><Arrow x={990} y={200} X={930} Y={480} p={p}/></g>}
 {ph==='mantinea_drift'||ph==='drift_chain'?<g><Arrow x={370} y={970} X={1560} Y={970} f={K.red} p={p}/><Dust seed={m.bgSeed} x={800} y={790} p={p}/></g>:null}
 {ph==='panic_spreads'&&<g>{Array.from({length:5},(_,i)=><Arrow key={i} x={450+i*230} y={600} X={450+i*230} Y={840} p={i/5<p?p:0}/>)}</g>}
 {has(t,/横|盾|隣|隙間/)&&<Halo x={700+Math.round(p*400)} y={480} r={126} p={p}/>}</g>};
const Retreat=({m,p}:{m:M;p:number})=>{const t=m.narration;return <g><Row x={190} y={390} count={7} step={246} scale={.56} p={p}/><Row x={380} y={225} count={6} step={260} scale={.45} enemy p={p}/><Actor x={915+it(0,180,p)} y={390+it(0,150,p)} s={.95} back={p>.2} shield={!has(t,/盾を捨て|装備を捨て/)||p<.7} p={p} walking/>
 {has(t,/後ろ|敵|視界|追/)&&<g><path d={'M930 390 L'+(930-it(0,400,p))+' 250 L'+(930+it(0,500,p))+' 250Z'} fill={K.red} opacity=".19"/><Halo x={1050} y={540} p={p} r={165}/></g>}
 {has(t,/槍を捨て|盾を捨て|装備|走|落と/)&&<g><circle cx={it(900,1360,p)} cy={it(560,865,p)} r={it(0,102,p)} fill={K.bronze} stroke={K.edge} strokeWidth={13} opacity={p}/><Line x={1050} y={560} X={it(1150,1480,p)} Y={it(570,900,p)} f={K.bronze} sw={11} p={p}/></g>}
 <Dust seed={m.bgSeed} p={p} x={1100} y={740}/></g>};
const March=({m,p}:{m:M;p:number})=>{const t=m.narration;return <g><Row x={160} y={385} count={8} step={215} scale={.67} p={p} walking move={it(0,58,p)}/><Row x={340} y={195} count={7} step={210} scale={.47} p={p} walking move={it(0,42,p)}/>{has(t,/笛|音|歩調|リズム/)&&<g><Actor x={1440} y={405} s={.75} shield={false} p={p}/><Line x={1420} y={500} X={1685} Y={485} f={K.edge} sw={16}/><path d="M1610 300 Q1680 240 1710 170" fill="none" stroke={K.edge} strokeWidth={8} opacity={.5+p*.4}/>{Array.from({length:4},(_,i)=><Halo key={i} x={1610} y={340} p={clamp(p-i*.2)} r={70+i*54} f={K.edge}/>)}</g>}
 {has(t,/後ろ|最後列|前列|列|導き/)&&<g><Arrow x={310} y={700} X={1490} Y={700} p={p} f={K.olive}/><Halo x={250} y={515} p={p} r={125}/></g>}
 <Dust seed={m.bgSeed} p={p} x={1000} y={800}/></g>};
const Sparta=({m,p}:{m:M;p:number})=>{const t=m.narration;return <g><Actor x={940} y={440} s={.86} p={p} shield={false} helm={false}/><Row x={150} y={490} count={3} step={320} scale={.52} p={p} shield={false}/><Row x={1180} y={490} count={3} step={295} scale={.52} p={p} shield={false}/>{has(t,/距離|視線|不名誉|話|無視|帰/)&&<g><Line x={960} y={530} X={it(960,1160,p)} Y={495} f={K.red} sw={11}/><Halo x={945} y={520} p={p} r={160} f={K.red}/></g>}
 {has(t,/翌年|プラタイア|戦い/)&&<g><Row x={180} y={330} count={6} step={210} scale={.42} p={p} walking/><Arrow x={520} y={680} X={1450} Y={680} p={p} f={K.olive}/></g>}
 {has(t,/ヘロドトス|記録|内心/)&&<g><Rect x={1390} y={250} w={235} h={310} f={K.white} r={7} o={it(0,.85,p)}/>{Array.from({length:5},(_,i)=><Rect key={i} x={1410} y={280+i*44} w={170-i*8} h={8} f={K.ash} o={p*.7}/>)}</g>}</g>};
const Poetry=({m,p}:{m:M;p:number})=>{const t=m.narration;return <g><Rect x={350} y={160} w={1160} h={760} f="#c7b18a" r={8}/>{Array.from({length:11},(_,i)=><g key={i} opacity={i<Math.ceil(p*11)?1:.13}><Rect x={440} y={225+i*56} w={850-(i%4)*91} h={10} f={K.ink} r={2}/><Rect x={440+(i%3)*26} y={242+i*56} w={560+(i%3)*41} h={4} f={K.ash}/></g>)}
 <Actor x={1560} y={450} s={.62} p={p} shield={false} helm={false}/>
 {has(t,/逃|恐|不名誉|故郷|死/)&&<Halo x={1000} y={540} p={p} r={375} f={K.red}/>}</g>};
const Thermopylae=({m,p}:{m:M;p:number})=>{const t=m.narration;const phase=has(t,/反転|再び|戻|向き|追ってくる/)?p:p*.58;return <g><Row x={120+it(0,250,Math.min(1,phase*2))} y={430} count={6} step={220} scale={.68} back={p<.52} p={p} walking move={p<.52?it(0,110,p*2):it(110,-110,(p-.52)*2)}/><Row x={310} y={240} count={7} step={210} scale={.45} enemy p={p} walking move={it(0,220,p)}/>{p>.45&&<g><Arrow x={1460} y={745} X={540} Y={745} p={(p-.45)/.55} f={K.olive}/></g>}<Dust seed={m.bgSeed} x={980} y={780} p={p} n={22}/></g>};
const Renderers:Record<string,React.FC<{m:M;p:number}>>={
 prologue_field:Plain,prologue_impact:Collision,prologue_question:Collision,
 shield_closeup:Analysis,phalanx_overhead:Overhead,gap_spreads:Overhead,formation_caution:Analysis,
 mantinea_drift:Overhead,drift_chain:Overhead,panic_spreads:Overhead,
 retreat_turn:Retreat,retreat_equipment:Retreat,retreat_distinction:Analysis,
 spartans_flute:March,march_rhythm:March,rear_rank:March,rear_rank_caution:Analysis,
 aristodemos_return:Sparta,aristodemos_city:Sparta,tyrtaeus_poetry:Poetry,
 casualties:Analysis,escape_examples:Analysis,feigned_retreat:Thermopylae,
 final_line:Plain,final_answer:Analysis,final_shields:Plain
};
export const SceneVisual=({n,progress}:{n:number;progress:number})=>{
 const m=beats[n-1]??beats[0],p=clamp(progress);const Animation=Renderers[m.phase];
 if(!Animation)throw new Error('No historic scene for '+m.phase);
 // The environmental plate is fixed for the entire continuity group.
 return <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0,overflow:'hidden'}}>
  <Plate m={m}/><g data-local-animated-foreground={m.visual}><Animation m={m} p={p}/></g>
 </svg>;
};