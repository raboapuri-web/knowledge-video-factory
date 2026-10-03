import React from 'react';
import {staticFile} from 'remotion';

const hash=(s:string)=>[...s].reduce((a,c)=>(a*33+c.charCodeAt(0))>>>0,109);
export const families='meeting office client night lunch research test proposal sales stats abstract conference contract incident forecast server evaluation corridor promotion teamwork quiet dashboard'.split(' ');
const assetMap:Record<string,string>={
 'lib-client':'BG_V46_CLIENT_MEETING_ROOM.png',
 'lib-workspace':'BG_V46_PEER_COMPANY_WORKSPACE.png',
 'lib-break':'BG_V46_OFFICE_BREAK_ROOM.png',
 'lib-research':'BG_kenkyu.png',
 'lib-office':'BG_office.png',
 'lib-dark':'BG_darkroom.png'
};
const assetFor=(e:string)=>Object.entries(assetMap).find(([k])=>e.startsWith(k))?.[1]??null;
const desk=(x:number,y:number,w:number)=><g><rect x={x} y={y} width={w} height="30" rx="7" fill="#6a5d53"/><rect x={x+25} y={y+30} width="20" height="155" fill="#41484d"/><rect x={x+w-45} y={y+30} width="20" height="155" fill="#41484d"/></g>;
const screen=(x:number,y:number,w:number,h:number,seed:number)=><g><rect x={x} y={y} width={w} height={h} rx="12" fill="#172832" stroke="#80939a" strokeWidth="7"/>{[0,1,2,3].map(i=><rect key={i} x={x+35} y={y+35+i*30} width={Math.max(80,w-85-((seed+i*47)%120))} height="11" rx="5" fill={i===1?"#ab5e5a":"#76a09a"} opacity=".72"/>)}</g>;
const chairs=(y:number,n=6)=><g>{Array.from({length:n},(_,i)=><g key={i} transform={'translate('+(170+i*(1540/Math.max(1,n-1)))+' '+y+')'}><rect x="-34" y="0" width="68" height="84" rx="22" fill="#45545d"/><rect x="-22" y="82" width="12" height="90" fill="#333c42"/><rect x="10" y="82" width="12" height="90" fill="#333c42"/></g>)}</g>;

export const Backdrop=({environment,family}:{environment:string;family:string})=>{
 if(!families.includes(family))throw Error('V109 unsupported background family '+family);
 const seed=hash(environment),asset=assetFor(environment),bg=['#18242d','#202c34','#252b34','#283139'][seed%4];
 return <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}}>
  <rect width="1920" height="1080" fill={bg}/>
  {asset?<><image href={staticFile('assets/v109/'+asset)} x="0" y="0" width="1920" height="1080" preserveAspectRatio="xMidYMid slice"/><rect width="1920" height="1080" fill="#0b141b" opacity=".28"/></>:null}
  {!asset&&(family==='meeting'||family==='conference')&&<g><rect y="810" width="1920" height="270" fill="#4c5357"/><rect x="150" y="135" width="1620" height="530" rx="24" fill="#303c44"/>{screen(650,200,620,340,seed)}{desk(280,670,1360)}{chairs(720,family==='conference'?8:6)}</g>}
  {!asset&&(family==='office'||family==='client')&&<g><rect y="825" width="1920" height="255" fill="#535a5e"/>{[0,1,2].map(i=><g key={i}>{desk(130+i*600,620+(i%2)*70,500)}{screen(220+i*600,360+(i%2)*70,320,190,seed+i)}</g>)}</g>}
  {!asset&&(family==='night'||family==='quiet')&&<g><rect y="830" width="1920" height="250" fill="#343c41"/><rect width="1920" height="1080" fill="#08121b" opacity=".42"/>{desk(520,690,880)}{screen(760,350,400,260,seed)}<rect x="140" y="120" width="390" height="430" fill="#0c1a27"/><circle cx="320" cy="230" r="45" fill="#c9b676" opacity=".65"/></g>}
  {!asset&&family==='lunch'&&<g><rect y="830" width="1920" height="250" fill="#75695d"/>{[0,1,2].map(i=><g key={i}><rect x={130+i*610} y="170" width="460" height="300" rx="18" fill="#39464d"/>{desk(150+i*610,650,420)}</g>)}</g>}
  {!asset&&(family==='research'||family==='test')&&<g><rect y="830" width="1920" height="250" fill="#4c555c"/>{[0,1,2].map(i=><g key={i}>{screen(110+i*610,210+(i%2)*85,500,300,seed+i)}{desk(160+i*610,650+(i%2)*40,400)}</g>)}</g>}
  {!asset&&(family==='proposal'||family==='contract')&&<g><rect y="840" width="1920" height="240" fill="#5d554d"/>{desk(170,680,1580)}{[0,1,2,3].map(i=><rect key={i} x={260+i*350} y={260+(i%2)*65} width="240" height="320" rx="10" fill="#d8cfba" transform={'rotate('+(-4+i*3)+' '+(380+i*350)+' 420)'}/>)}</g>}
  {!asset&&family==='sales'&&<g><rect y="830" width="1920" height="250" fill="#53595c"/><rect x="150" y="150" width="1620" height="500" rx="24" fill="#2d3941"/>{desk(380,680,1160)}{chairs(725,4)}</g>}
  {!asset&&(family==='stats'||family==='forecast'||family==='dashboard'||family==='evaluation')&&<g><rect x="90" y="100" width="1740" height="760" rx="28" fill={family==='stats'?'#d6d0c1':'#172730'} opacity={family==='stats'?.94:1}/>{family==='stats'?<><line x1="250" y1="730" x2="1630" y2="730" stroke="#353b3f" strokeWidth="8"/><line x1="250" y1="730" x2="250" y2="230" stroke="#353b3f" strokeWidth="8"/></>:null}{family!=='stats'?[0,1,2,3].map(i=><g key={i}><rect x={145+i*410} y="175" width="335" height="250" rx="14" fill="#263a45"/><rect x={145+i*410} y="475" width="335" height="300" rx="14" fill="#2b4048"/></g>):null}</g>}
  {!asset&&family==='incident'&&<g><rect y="830" width="1920" height="250" fill="#3e4549"/>{screen(150,220,680,400,seed)}{screen(1080,220,680,400,seed+4)}{[0,1,2].map(i=><circle key={i} cx={890+i*90} cy={700-i*40} r="26" fill="#a85b57"/>)}</g>}
  {!asset&&family==='server'&&<g><rect y="850" width="1920" height="230" fill="#30383e"/>{[0,1,2,3,4].map(i=><g key={i}><rect x={90+i*355} y="140" width="270" height="640" rx="12" fill="#26343d" stroke="#74858c" strokeWidth="7"/>{[0,1,2,3,4,5].map(j=><rect key={j} x={125+i*355} y={190+j*82} width="200" height="48" rx="7" fill="#17242c"/>)}</g>)}</g>}
  {!asset&&family==='corridor'&&<g><rect y="820" width="1920" height="260" fill="#5b6063"/>{[0,1,2,3].map(i=><rect key={i} x={100+i*470} y={160+(i%2)*40} width="360" height={610-(i%2)*40} rx="14" fill="#303b43"/>)}<path d="M690 1080 L880 500 L1040 500 L1230 1080Z" fill="#767a7c" opacity=".5"/></g>}
  {!asset&&family==='promotion'&&<g><rect y="850" width="1920" height="230" fill="#454c50"/>{[0,1,2,3,4].map(i=><rect key={i} x={230+i*265} y={720-i*115} width="190" height={130+i*115} fill={i%2?"#6f7f84":"#836e62"}/>)}</g>}
  {!asset&&family==='teamwork'&&<g><circle cx="960" cy="470" r="250" fill="#33434b"/>{[0,1,2,3,4].map(i=>{const a=-Math.PI/2+i*Math.PI*2/5,x=960+Math.cos(a)*520,y=470+Math.sin(a)*340;return <g key={i}><line x1="960" y1="470" x2={x} y2={y} stroke="#b09463" strokeWidth="7"/><circle cx={x} cy={y} r="70" fill={i%2?"#657b80":"#7d675f"}/></g>})}</g>}
  {!asset&&family==='abstract'&&<g>{Array.from({length:18},(_,i)=><circle key={i} cx={(seed*17+i*137)%1900} cy={100+((seed*11+i*83)%800)} r={35+(i%5)*23} fill="none" stroke={i%2?"#82a09d":"#c3a76a"} strokeWidth="5" opacity=".17"/>)}</g>}
  <rect width="1920" height="1080" fill="#07101a" opacity=".06"/>
 </svg>;
};