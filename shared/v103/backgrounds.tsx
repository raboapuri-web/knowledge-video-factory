import React from 'react';
import {staticFile} from 'remotion';
import {R,L,P} from './primitives';

const gold='#d1ad76',paper='#e6d7bb',stone='#8d8177',slate='#303845',wine='#794e53';
const assetMap:Record<string,string>={
  '03-greek-ideal:ancient-theatre':'BG_girisya.png',
  '02-kingship:veblen-study':'BG_honndana.png',
  '03-greek-ideal:meaning-diagram':'BG_darkroom.png',
  '04-presentation:goffman-study':'BG_syosai.png'
};
const bk:Record<string,string>={
'gallery-opening':'gallery','gallery-detail':'gallery','portrait-revisit':'gallery',
'return-gallery':'gallery','final-still-life':'gallery',
'tudor-court':'court','royal-court':'court','conspicuous-court':'court','court-status':'court',
'renaissance-library':'library','veblen-study':'library','research-library':'library','goffman-study':'library',
'comparison-stage':'diagram','visual-paradox':'diagram','ancient-reconsider':'diagram',
'meaning-diagram':'diagram','cross-era-gallery':'diagram','three-eras':'diagram',
'medieval-gateway':'street','cobblestone-market':'street',
'hose-demonstration':'tailor','garment-evolution':'tailor','tailor-workshop':'tailor','new-doublet-tailor':'tailor',
'chapel-sermon':'chapel','moral-chapel':'chapel',
'luxury-trade':'market','armory-transition':'armory','armorer-forge':'armory','armor-exhibition':'armory',
'training-yard':'yard','field-of-cloth':'tents',
'museum-gallery':'museum','comparison-gallery':'museum','ancient-theatre':'ancient',
'pottery-workshop':'pottery','performance-stage':'stage',
'tudor-fashion-turn':'timeline','fashion-timeline':'timeline','garment-history':'timeline',
'modern-clothing':'modern','modern-studio':'modern','modern-reflection':'modern',
'medieval-gateway':'street'};
const hash=(s:string)=>[...s].reduce((a,c)=>(a*37+c.charCodeAt(0))>>>0,119);
const polygon=(pts:string,col:string,op=1)=><polygon points={pts} fill={col} opacity={op}/>;
const arch=(x:number,y:number,w:number,h:number)=> <g><R x={x} y={y+60} w={w} h={h-60} c="#28303b"/><path d={'M'+x+' '+(y+60)+' Q'+(x+w/2)+' '+(y-80)+' '+(x+w)+' '+(y+60)+'Z'} fill="#28303b"/><R x={x+25} y={y+100} w={w-50} h={h-90} c="#8f8981" o={.28}/></g>;
export const Backdrop=({environment}:{environment:string})=>{
 const suffix=environment.split(':')[1],kind=bk[suffix];
 if(!kind)throw Error('V103 background has no authored architecture: '+environment);
 const h=hash(environment),v=h%7,w=1920,asset=assetMap[environment],shift=v*31;
 const isOld=kind!=='modern',top=kind==='modern'?'#293b43':kind==='gallery'?'#252838':kind==='court'?'#3b3440':kind==='ancient'?'#6b736c':'#322d36',low=kind==='street'?'#a19b8b':'#5a504d';
 return <g data-static-background={environment}>
  <defs>
   <linearGradient id={'wall-'+h} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={top}/><stop offset="100%" stopColor={low}/></linearGradient>
   <linearGradient id={'stone-'+h} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#bdac91"/><stop offset="100%" stopColor="#655c60"/></linearGradient>
  </defs>
  {asset?<g><image href={staticFile('assets/v103/'+asset)} x={0} y={0} width={w} height={1080} preserveAspectRatio="xMidYMid slice"/><R x={0} y={0} w={1920} h={1080} c="#131827" o={.63}/></g>:<R x={0} y={0} w={w} h={1080} c={'url(#wall-'+h+')'}/>}
  {(kind==='gallery'||kind==='museum')&&<g>
    <R x={0} y={805} w={1920} h={275} c={kind==='museum'?'#77736f':'#51414a'}/>
    {Array.from({length:4},(_,i)=><g key={i} transform={'translate('+(60+i*470+shift%42)+' '+(130+i%2*35)+')'}><R x={0} y={0} w={360} h={470} c="#756550" stroke={gold} sw={14}/><R x={34} y={32} w={292} h={404} c={kind==='museum'?'#a1a39a':'#343844'}/>{kind==='museum'?<g><ellipse cx={172} cy={155} rx={50} ry={65} fill="#d9d4c6"/><R x={110} y={212} w={120} h={156} c="#b6b6b1"/></g>:<g><circle cx={168} cy={156} r={55} fill="#665764"/><R x={118} y={216} w={100} h={152} c="#8f6e5b"/></g>}</g>)}
    {suffix==='gallery-detail'&&<g><R x={620} y={760} w={730} h={42} c={gold}/><R x={655} y={798} w={44} h={220} c={stone}/><R x={1280} y={798} w={44} h={220} c={stone}/></g>}
    {suffix==='return-gallery'&&<g><R x={280} y={700} w={260} h={100} c="#a08767"/><R x={1380} y={700} w={260} h={100} c="#a08767"/></g>}
    {suffix==='final-still-life'&&<R x={450} y={780} w={1040} h={80} c="#8f7355"/>}
  </g>}
  {kind==='court'&&<g><R x={0} y={825} w={1920} h={255} c="#594149"/>
    {Array.from({length:6},(_,i)=><g key={i}><R x={35+i*342} y={120+(i%2)*22} w={86} h={690} c="#a49486"/><R x={20+i*342} y={95+(i%2)*22} w={116} h={34} c="#d6c4a3"/><L x={58+i*342} y={180} X={58+i*342} Y={785} c="#746b67" sw={6}/></g>)}
    <path d={'M'+(360+shift)+' 180 L'+(490+shift)+' 215 L'+(450+shift)+' 620 L'+(300+shift)+' 580Z'} fill="#874b4e"/>
    <path d={'M'+(1530-shift)+' 155 L'+(1640-shift)+' 195 L'+(1615-shift)+' 650 L'+(1460-shift)+' 625Z'} fill="#8b6857"/>
    {suffix==='royal-court'&&<g><R x={850} y={505} w={220} h={305} c="#8d6159" stroke={gold} sw={12}/><R x={755} y={810} w={420} h={45} c={gold}/></g>}
    {suffix==='conspicuous-court'&&<g>{[0,1,2].map((i)=><R key={i} x={175+i*600} y={740} w={220} h={65} c="#9a7350"/>)}</g>}
  </g>}
  {kind==='street'&&<g><R x={0} y={794} w={1920} h={286} c="#827468"/>{Array.from({length:8},(_,i)=><L key={i} x={i*265-60} y={900} X={i*265+180} Y={1060} c="#685d58" sw={3} o={.66}/>)}
    {Array.from({length:5},(_,i)=>{const x=30+i*390+shift%30;return <g key={i}><R x={x} y={350+i%2*45} w={300} h={445-i%2*45} c={i%2?'#8a786b':'#9b8b75'}/>{polygon((x-22)+','+(350+i%2*45)+' '+(x+150)+','+(205+i%2*45)+' '+(x+322)+','+(350+i%2*45),'#574b49')}{[0,1].map(j=><g key={j}>{arch(x+55+j*125,445+i%2*42,85,178)}</g>)}<R x={x+110} y={640} w={88} h={155} c="#433a3b"/></g>})}
    {suffix==='medieval-gateway'&&<g><R x={670} y={220} w={560} h={625} c="#66666b"/>{arch(790,375,320,480)}<R x={810} y={365} w={290} h={30} c="#c4b193"/></g>}
  </g>}
  {kind==='tailor'&&<g><R x={0} y={822} w={1920} h={258} c="#5c4741"/><R x={170+shift} y={635} w={1200} h={115} c="#91735d"/><R x={250+shift} y={742} w={57} h={275} c="#725849"/><R x={1230+shift} y={742} w={57} h={275} c="#725849"/><R x={90} y={195} w={630} h={338} c="#534541"/><R x={130} y={227} w={552} h={274} c="#af9a7d"/><L x={400} y={215} X={400} Y={525} c="#5f5148" sw={8}/>{[0,1,2].map(i=><g key={i}><R x={1450} y={250+i*188} w={350} h={40} c="#82634f"/><R x={1490} y={285+i*188} w={260-i*34} h={90} c={['#824a55','#9b856a','#495e61'][i]}/></g>)}
    {suffix==='garment-evolution'&&<R x={740} y={280} w={540} h={250} c="#b2a080" o={.65}/>}
    {suffix==='new-doublet-tailor'&&<g><ellipse cx={890} cy={600} rx={185} ry={70} fill="#ac8969" opacity=".38"/><R x={820} y={220} w={22} h={260} c="#9e8b76"/></g>}
  </g>}
  {kind==='chapel'&&<g><R x={0} y={832} w={1920} h={248} c="#574d4c"/>{[0,1,2,3].map(i=><g key={i}>{arch(95+i*470+shift%22,125,310,600)}<path d={'M'+(210+i*470)+' 140 L'+(210+i*470)+' 645'} stroke="#d0b08a" strokeWidth="8"/></g>)}<R x={760} y={625} w={390} h={205} c="#82674e"/><R x={750} y={612} w={410} h={38} c={gold}/>{suffix==='moral-chapel'&&<path d="M810 665 L910 450 L1010 665Z" fill="#8e8d86"/>}</g>}
  {kind==='library'&&<g><R x={0} y={815} w={1920} h={265} c="#56443c"/>{!asset&&Array.from({length:4},(_,i)=><g key={i}><R x={45+i*470+shift%38} y={95} w={410} h={630} c="#695143"/>{Array.from({length:5},(_,j)=><g key={j}><R x={65+i*470+shift%38} y={190+j*100} w={365} h={19} c="#a68a65"/>{Array.from({length:8},(_,k)=><R key={k} x={92+i*470+k*42} y={135+j*100} w={28} h={55} c={['#895e50','#b28f61','#52646a','#9b856e'][k%4]}/>)}</g>)}</g>)}<R x={520} y={770} w={930} h={80} c="#a17e5e"/><R x={595} y={845} w={40} h={190} c="#745b49"/><R x={1320} y={845} w={40} h={190} c="#745b49"/></g>}
  {(kind==='diagram'||kind==='timeline')&&<g><R x={0} y={860} w={1920} h={220} c="#28313e" o={.75}/><R x={105} y={110} w={1710} h={670} rx={25} c="#1d2b39" stroke="#8e795c" sw={8} o={.83}/>{kind==='timeline'&&<g><L x={230} y={690} X={1660} Y={690} c={gold} sw={12}/>{[0,1,2,3].map(i=><circle key={i} cx={300+i*420} cy={690} r={19} fill={gold}/>)}</g>}{suffix==='three-eras'&&[0,1,2].map(i=><R key={i} x={250+i*500} y={180} w={370} h={500} c="#8d7861" o={.5}/>)}</g>}
  {kind==='market'&&<g><R x={0} y={823} w={1920} h={257} c="#7a5e4f"/>{[0,1,2,3].map(i=><g key={i}><R x={90+i*470} y={300+i%2*28} w={365} h={480} c="#705a4d"/><R x={65+i*470} y={262+i%2*28} w={415} h={57} c={i%2?'#b69767':'#8d4b4e'} /><R x={125+i*470} y={612} w={275} h={124} c="#9a7a61"/></g>)}</g>}
  {kind==='armory'&&<g><R x={0} y={828} w={1920} h={252} c="#554545"/>{Array.from({length:5},(_,i)=><g key={i}><R x={80+i*375} y={150} w={40} h={650} c="#79685f"/><path d={'M'+(105+i*375)+' 170 Q'+(205+i*375)+' 80 '+(320+i*375)+' 170'} fill="none" stroke="#a18e7a" strokeWidth="23"/><L x={190+i*375} y={215} X={190+i*375} Y={590} c="#b5a893" sw={6}/></g>)}<R x={570+shift} y={720} w={820} h={80} c="#806c5d"/>{suffix==='armorer-forge'&&<g><ellipse cx={260} cy={720} rx={185} ry={155} fill="#ba723d"/><ellipse cx={260} cy={720} rx={90} ry={115} fill="#f2bd6c"/></g>}</g>}
  {kind==='yard'&&<g><R x={0} y={765} w={1920} h={315} c="#8f7e6e"/><path d="M0 750 L380 510 L760 750 L1120 480 L1680 720 L1920 560" fill="none" stroke="#4f5456" strokeWidth="70"/>{[0,1,2,3].map(i=><g key={i}><R x={190+i*460} y={440} w={30} h={330} c="#7b6252"/><path d={'M'+(220+i*460)+' 445 l120 52 -120 65Z'} fill={i%2?'#b79a67':'#7b464a'}/></g>)}</g>}
  {kind==='tents'&&<g><R x={0} y={810} w={1920} h={270} c="#78806a"/>{[0,1,2,3].map(i=>{const x=120+i*450;return <g key={i}><path d={'M'+x+' 760 L'+(x+195)+' 320 L'+(x+385)+' 760Z'} fill={i%2?'#a8a197':'#c5ab7b'} stroke="#705c50" strokeWidth="10"/><path d={'M'+(x+195)+' 320 L'+(x+195)+' 775'} stroke="#534942" strokeWidth="10"/></g>})}</g>}
  {kind==='ancient'&&<g><R x={0} y={838} w={1920} h={242} c="#7c796f" o={.72}/>{[0,1,2,3].map(i=><g key={i}><R x={180+i*470} y={410} w={53} h={430} c="#c4b7a0"/><R x={162+i*470} y={387} w={88} h={24} c="#dfd1b2"/><R x={162+i*470} y={830} w={88} h={28} c="#dfd1b2"/></g>)}</g>}
  {kind==='pottery'&&<g><R x={0} y={810} w={1920} h={270} c="#705349"/><R x={210} y={610} w={1290} h={150} c="#967459"/><R x={340} y={740} w={45} h={290} c="#6e5043"/>{[0,1,2].map(i=><g key={i}><ellipse cx={370+i*500} cy={335} rx={140} ry={45} fill="#ad825d"/><path d={'M'+(230+i*500)+' 345 Q'+(180+i*500)+' 585 '+(370+i*500)+' 600 Q'+(560+i*500)+' 585 '+(510+i*500)+' 345'} fill="#9e7759"/></g>)}</g>}
  {kind==='stage'&&<g><R x={0} y={815} w={1920} h={265} c="#7c5d55"/>{[0,1,2].map(i=><path key={i} d={'M'+(i*700-50)+' 0 Q'+(i*650+100)+' 360 '+(i*700-60)+' 740 L'+(i*700+80)+' 740 L'+(i*700+180)+' 0Z'} fill="#814a4f" opacity=".8"/>) }<path d="M250 130 Q960 350 1670 130" fill="none" stroke={gold} strokeWidth="30"/></g>}
  {kind==='modern'&&<g><R x={0} y={826} w={1920} h={254} c="#545e62"/>{[0,1,2].map(i=><g key={i}><R x={100+i*605} y={155} w={520} h={550} c="#72858a"/><R x={140+i*605} y={195} w={440} h={460} c="#34464f"/><R x={210+i*605} y={720} w={300} h={60} c="#aa9379"/></g>)}</g>}
  {suffix==='final-still-life'&&<g><R x={560} y={762} w={800} h={64} c="#a48963"/><R x={610} y={815} w={36} h={245} c="#8d745e"/><R x={1310} y={815} w={36} h={245} c="#8d745e"/></g>}
  <R x={0} y={0} w={1920} h={1080} c="#090f18" o={.08}/>
 </g>;
};
