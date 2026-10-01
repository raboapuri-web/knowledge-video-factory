import React from 'react';
import {staticFile} from 'remotion';
import {R,L,P} from './primitives';

export const visualFamilies='river japan greece india underworld archive language migration laboratory abstract modern temple map library';
const hash=(s:string)=>[...s].reduce((a,c)=>(a*33+c.charCodeAt(0))>>>0,97);
const assetFor=(e:string)=>{
 if(e.startsWith('lib-darkroom-'))return 'BG_darkroom.png';
 if(e.startsWith('lib-honndana-'))return 'BG_honndana.png';
 if(e.startsWith('lib-kenkyu-'))return 'BG_kenkyu.png';
 if(e.startsWith('lib-syosai-'))return 'BG_syosai.png';
 return null;
};
const ridge=(seed:number,y:number,c:string,o=1)=>{const pts=Array.from({length:14},(_,i)=>[-80+i*155,y-(60+((seed+i*71)%150))]);return <P d={'M-100 1080 '+pts.map(p=>'L'+p[0]+' '+p[1]).join(' ')+' L2100 1080Z'} c={c} o={o}/>};
const stars=(seed:number)=>Array.from({length:26},(_,i)=><circle key={i} cx={(seed*17+i*139)%1900} cy={35+((seed*11+i*83)%330)} r={1+i%3} fill="#efe8d7" opacity={.35+(i%4)*.1}/>);
const columns=()=>[0,1,2,3,4].map(i=><g key={i}><R x={180+i*330} y={270+(i%2)*20} w={58} h={500} c="#c8bca4"/><R x={150+i*330} y={245+(i%2)*20} w={118} h={35} c="#e0d5bf"/><R x={145+i*330} y={770+(i%2)*20} w={128} h={32} c="#9f9482"/></g>);
export const Backdrop=({environment,family}:{environment:string;family:string})=>{
 const seed=hash(environment),asset=assetFor(environment),sky=['#111c29','#1b2634','#2b2631','#283538'][seed%4];
 if(!visualFamilies.split(' ').includes(family))throw Error('V108 unsupported background family '+family);
 return <g data-environment={environment} data-family={family}>
  <R x={0} y={0} w={1920} h={1080} c={sky}/>
  {asset&&<g><image href={staticFile('assets/v108/'+asset)} x={0} y={0} width={1920} height={1080} preserveAspectRatio="xMidYMid slice"/><R x={0} y={0} w={1920} h={1080} c="#101822" o={.42}/></g>}
  {!asset&&family==='river'&&<g>{ridge(seed,620,'#6f7f7a',.65)}{ridge(seed+21,760,'#405861',.92)}<P d="M0 700 Q380 650 790 720 T1500 690 T1920 730 L1920 1080 H0Z" c="#294d5d"/>{[0,1,2,3,4].map(i=><path key={i} d={'M'+(80+i*360)+' '+(780+i%2*70)+' q180 -32 330 0'} fill="none" stroke="#9db5ae" strokeWidth="7" opacity=".18"/>)}</g>}
  {!asset&&family==='japan'&&<g>{ridge(seed,680,'#495952')}{ridge(seed+9,805,'#303f45')}<R x={0} y={820} w={1920} h={260} c="#4c463e"/><g transform="translate(250 410)"><R x={0} y={0} w={26} h={390} c="#8f4d47"/><R x={340} y={0} w={26} h={390} c="#8f4d47"/><R x={-48} y={0} w={460} h={34} c="#a95a50"/><R x={15} y={72} w={340} h={28} c="#944a46"/></g><R x={1250} y={470} w={420} h={330} c="#766557"/><P d="M1190 470 L1460 300 1730 470Z" c="#4d4743"/></g>}
  {!asset&&family==='greece'&&<g><R x={0} y={790} w={1920} h={290} c="#766f61"/><R x={0} y={675} w={1920} h={115} c="#3b5b69"/>{columns()}<P d="M100 250 L960 90 1810 250Z" c="#9b8d78" o={.38}/></g>}
  {!asset&&family==='india'&&<g>{ridge(seed,650,'#5b6058')}{ridge(seed+7,760,'#3e514d')}<P d="M0 735 Q520 690 960 740 T1920 720 L1920 1080 H0Z" c="#31565d"/>{[0,1,2,3].map(i=><g key={i}><R x={180+i*430} y={480-(i%2)*70} w={280} h={300+(i%2)*70} c={i%2?'#8f6f58':'#9f8267'}/><P d={'M'+(150+i*430)+' '+(480-(i%2)*70)+' Q'+(320+i*430)+' '+(300-(i%2)*80)+' '+(490+i*430)+' '+(480-(i%2)*70)+'Z'} c="#b58c65"/></g>)}</g>}
  {!asset&&family==='underworld'&&<g>{stars(seed)}<P d="M0 1080 L0 250 Q330 90 640 310 Q960 40 1290 320 Q1590 120 1920 270 L1920 1080Z" c="#22242b"/><P d="M610 1080 V630 Q960 270 1310 630 V1080Z" c="#080b10"/>{[0,1,2,3,4].map(i=><R key={i} x={775+i*78} y={820-i*62} w={180} h={62+i*62} c="#3d3b42"/>)}</g>}
  {!asset&&family==='archive'&&<g><R x={0} y={820} w={1920} h={260} c="#55483f"/>{[0,1,2,3].map(i=><g key={i}><R x={90+i*455} y={110} w={390} h={690} c="#4f433c"/>{Array.from({length:5},(_,j)=><g key={j}><R x={118+i*455} y={210+j*112} w={335} h={16} c="#8b735e"/>{Array.from({length:8},(_,k)=><R key={k} x={130+i*455+k*38} y={157+j*112} w={26} h={52} c={['#7d6a5d','#9f876e','#667981','#87666a'][k%4]}/>)}</g>)}</g>)}</g>}
  {!asset&&family==='language'&&<g><R x={120} y={120} w={1680} h={720} rx={24} c="#bcae8f" o={.84}/>{Array.from({length:7},(_,i)=><g key={i}><circle cx={300+i*220} cy={250+(i%3)*170} r={34} fill={i%2?'#7b5960':'#5f7777'}/><L x={300+i*220} y={250+(i%3)*170} X={960} Y={710} c="#5b554d" sw={4} o={.45}/></g>)}</g>}
  {!asset&&family==='migration'&&<g>{ridge(seed,650,'#5c5d57')}{ridge(seed+31,780,'#3e484b')}<P d="M0 910 Q420 760 820 860 T1600 800 T1920 840 L1920 1080 H0Z" c="#756756"/>{[0,1,2,3].map(i=><g key={i}><P d={'M'+(170+i*440)+' 820 l135 -190 135 190Z'} c={i%2?'#7d6957':'#88755f'}/><L x={305+i*440} y={625} X={305+i*440} Y={900} c="#4b423b" sw={8}/></g>)}</g>}
  {!asset&&family==='laboratory'&&<g><R x={0} y={840} w={1920} h={240} c="#4b5860"/>{[0,1,2].map(i=><g key={i}><R x={170+i*570} y={250} w={470} h={360} rx={14} c="#233642" stroke="#849a9d" sw={9}/><R x={220+i*570} y={300} w={370} h={230} c="#9bb1ac" o={.25}/><R x={260+i*570} y={640} w={285} h={120} c="#7f8f8a"/></g>)}</g>}
  {!asset&&family==='abstract'&&<g>{stars(seed)}{[0,1,2,3].map(i=><circle key={i} cx={360+i*410} cy={400+(i%2)*160} r={130+(seed+i*37)%90} fill="none" stroke={i%2?'#c7a96d':'#6a9690'} strokeWidth={6} opacity=".28"/>)}</g>}
  {!asset&&family==='modern'&&<g><R x={0} y={800} w={1920} h={280} c="#4d5152"/><R x={180} y={180} w={620} h={540} c="#5e6667"/><R x={240} y={240} w={500} h={410} c="#1c2c39"/><R x={1010} y={260} w={620} h={430} c="#786c5f"/><R x={1110} y={335} w={420} h={260} c="#b3a48d"/></g>}
  {!asset&&family==='temple'&&<g><R x={0} y={810} w={1920} h={270} c="#655a4f"/>{columns()}<R x={340} y={670} w={1240} h={150} c="#857766"/><P d="M260 270 L960 90 1660 270Z" c="#8b765e"/></g>}
  {!asset&&family==='map'&&<g><R x={110} y={110} w={1700} h={730} rx={24} c="#a99d82" o={.78}/><P d="M260 350 L500 245 760 350 950 250 1180 320 1450 240 1650 390 1510 610 1210 700 910 610 640 720 340 620Z" c="#70807d" o={.6}/>{[0,1,2,3].map(i=><path key={i} d={'M'+(280+i*290)+' '+(680-i*60)+' Q960 '+(220+i*90)+' '+(1570-i*170)+' '+(560+i*30)} fill="none" stroke={i%2?'#a85353':'#c8ad70'} strokeWidth={8} strokeDasharray="24 16" opacity=".66"/>)}</g>}
  {!asset&&family==='library'&&<g><R x={0} y={820} w={1920} h={260} c="#51463f"/>{[0,1,2,3,4].map(i=><R key={i} x={85+i*360} y={130} w={310} h={640} c="#4c4039"/>)}{[0,1,2,3,4,5].map(j=>[0,1,2,3,4].map(i=><R key={i+'-'+j} x={110+i*360+(j%3)*12} y={205+j*88} w={250-(j%3)*20} h={18} c="#8f7961"/>))}</g>}
  <R x={0} y={0} w={1920} h={1080} c="#07101a" o={.07}/>
  <R x={70} y={65} w={9} h={54} c="#c5a56d"/><text x={97} y={102} fill="#efe7d7" fontSize={24} fontWeight={650} fontFamily="Noto Sans JP,sans-serif" opacity=".72">{environment.replace(/^lib-[^-]+-/,'').replaceAll('-','・').slice(0,34)}</text>
 </g>;
};