import React from 'react';
import {staticFile} from 'remotion';

const hash=(s:string)=>[...s].reduce((a,c)=>(a*33+c.charCodeAt(0))>>>0,110);
export const families='office-night office-day desk meeting client bedroom abstract research slack transit road network training presentation vacation return corridor lunch home dashboard archive phone calendar'.split(' ');
const assetMap:Record<string,string>={
 'lib-client':'BG_V46_CLIENT_MEETING_ROOM.png',
 'lib-workspace':'BG_V46_PEER_COMPANY_WORKSPACE.png',
 'lib-break':'BG_V46_OFFICE_BREAK_ROOM.png',
 'lib-research':'BG_kenkyu.png',
 'lib-office':'BG_office.png',
 'lib-dark':'BG_darkroom.png',
 'lib-peer-office':'BG_V46_PEER_COMPANY_OFFICE.png',
 'lib-street-night':'BG_V46_OFFICE_STREET_NIGHT.png',
 'lib-room-night':'BG_ROOM_NIGHT_ON.png',
 'lib-room-day':'BG_ROOM_DAY.png'
};
const assetFor=(e:string)=>Object.entries(assetMap).find(([k])=>e.startsWith(k))?.[1]??null;
const desk=(x:number,y:number,w:number)=><g><rect x={x} y={y} width={w} height="30" rx="7" fill="#6a5d53"/><rect x={x+25} y={y+30} width="20" height="155" fill="#41484d"/><rect x={x+w-45} y={y+30} width="20" height="155" fill="#41484d"/></g>;
const screen=(x:number,y:number,w:number,h:number,seed:number)=><g><rect x={x} y={y} width={w} height={h} rx="12" fill="#172832" stroke="#80939a" strokeWidth="7"/>{[0,1,2,3].map(i=><rect key={i} x={x+35} y={y+35+i*30} width={Math.max(80,w-85-((seed+i*47)%120))} height="11" rx="5" fill={i===1?"#ab5e5a":"#76a09a"} opacity=".72"/>)}</g>;
const chairs=(y:number,n=6)=><g>{Array.from({length:n},(_,i)=><g key={i} transform={'translate('+(170+i*(1540/Math.max(1,n-1)))+' '+y+')'}><rect x="-34" y="0" width="68" height="84" rx="22" fill="#45545d"/><rect x="-22" y="82" width="12" height="90" fill="#333c42"/><rect x="10" y="82" width="12" height="90" fill="#333c42"/></g>)}</g>;

export const Backdrop=({environment,family}:{environment:string;family:string})=>{
 if(!families.includes(family))throw Error('V110 unsupported background family '+family);
 const seed=hash(environment),asset=assetFor(environment),bg=['#17242d','#202b33','#252b34','#293139'][seed%4];
 return <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}}>
 <rect width="1920" height="1080" fill={bg}/>
 {asset?<><image href={staticFile('assets/v110/'+asset)} x="0" y="0" width="1920" height="1080" preserveAspectRatio="xMidYMid slice"/><rect width="1920" height="1080" fill="#09131a" opacity=".28"/></>:null}
 {!asset&&(family==='office-night'||family==='office-day'||family==='desk')&&<g><rect y="825" width="1920" height="255" fill={family==='office-night'?'#343c41':'#535a5e'}/>{[0,1,2].map(i=><g key={i}>{desk(130+i*600,620+(i%2)*70,500)}{screen(220+i*600,360+(i%2)*70,320,190,seed+i)}</g>)}{family==='office-night'?<rect width="1920" height="1080" fill="#08121b" opacity=".36"/>:null}</g>}
 {!asset&&(family==='meeting'||family==='client'||family==='presentation')&&<g><rect y="810" width="1920" height="270" fill="#4c5357"/><rect x="150" y="135" width="1620" height="530" rx="24" fill="#303c44"/>{screen(650,200,620,340,seed)}{desk(280,670,1360)}{chairs(720,family==='presentation'?8:6)}</g>}
 {!asset&&family==='bedroom'&&<g><rect y="830" width="1920" height="250" fill="#39393c"/><rect x="170" y="350" width="1050" height="420" rx="36" fill="#4c5660"/><rect x="230" y="400" width="340" height="130" rx="30" fill="#c9c0ae"/><rect x="1250" y="180" width="420" height="500" rx="20" fill="#1d2930"/><circle cx="1430" cy="300" r="55" fill="#c8a463" opacity=".5"/></g>}
 {!asset&&family==='research'&&<g><rect y="830" width="1920" height="250" fill="#4b555c"/>{[0,1,2].map(i=><g key={i}>{screen(110+i*610,210+(i%2)*85,500,300,seed+i)}{desk(160+i*610,650+(i%2)*40,400)}</g>)}</g>}
 {!asset&&family==='slack'&&<g><rect x="100" y="105" width="1720" height="745" rx="26" fill="#152630" stroke="#7e9198" strokeWidth="8"/>{Array.from({length:8},(_,i)=><g key={i}><circle cx="190" cy={205+i*75} r="22" fill={i%2?'#729b95':'#ad5c58'}/><rect x="240" y={185+i*75} width={480+((i*91)%500)} height="38" rx="12" fill="#30454f"/></g>)}</g>}
 {!asset&&family==='transit'&&<g><rect y="790" width="1920" height="290" fill="#4a5156"/>{[0,1,2,3].map(i=><rect key={i} x={80+i*470} y="140" width="400" height="430" rx="18" fill="#22323c"/>)}<rect x="300" y="640" width="1320" height="90" rx="26" fill="#5f676c"/>{chairs(695,7)}</g>}
 {!asset&&family==='road'&&<g><rect y="0" width="1920" height="1080" fill="#202d35"/>{[-2,-1,0,1,2].map(i=><path key={i} d={'M'+(240+i*300)+' 1080 Q'+(500+i*200)+' 650 930 440'} fill="none" stroke="#6e777b" strokeWidth="70"/>)}<rect x="820" y="330" width="280" height="250" rx="18" fill="#4d413c"/><rect x="860" y="390" width="200" height="110" fill="#18242b"/></g>}
 {!asset&&family==='network'&&<g>{Array.from({length:18},(_,i)=>{const x=120+((seed+i*157)%1680),y=100+((seed*3+i*97)%760);return <g key={i}><circle cx={x} cy={y} r={20+(i%4)*7} fill={i%3? '#729b95':'#c8a463'} opacity=".75"/>{i>0?<line x1={x} y1={y} x2={120+((seed+(i-1)*157)%1680)} y2={100+((seed*3+(i-1)*97)%760)} stroke="#718088" strokeWidth="4" opacity=".35"/>:null}</g>})}</g>}
 {!asset&&family==='training'&&<g><rect y="830" width="1920" height="250" fill="#535a5e"/>{[0,1,2,3].map(i=><g key={i}>{desk(120+i*430,620+(i%2)*60,350)}<rect x={180+i*430} y={380+(i%2)*60} width="230" height="160" rx="12" fill="#d8cfba"/></g>)}</g>}
 {!asset&&family==='vacation'&&<g><rect width="1920" height="1080" fill="#273841"/><circle cx="1530" cy="230" r="100" fill="#cbb56f" opacity=".75"/><path d="M0 760 Q400 650 800 760 T1600 730 T1920 760 V1080 H0Z" fill="#4f6b70"/><path d="M0 820 Q500 760 950 830 T1920 800 V1080 H0Z" fill="#8b8068"/></g>}
 {!asset&&family==='return'&&<g><rect y="825" width="1920" height="255" fill="#535a5e"/>{[0,1,2].map(i=><g key={i}>{desk(150+i*580,620,470)}{screen(235+i*580,380,300,180,seed+i)}</g>)}<path d="M120 150 H1800" stroke="#c8a463" strokeWidth="8" opacity=".35"/></g>}
 {!asset&&family==='corridor'&&<g><rect y="820" width="1920" height="260" fill="#5b6063"/>{[0,1,2,3].map(i=><rect key={i} x={100+i*470} y={160+(i%2)*40} width="360" height={610-(i%2)*40} rx="14" fill="#303b43"/>)}<path d="M690 1080 L880 500 L1040 500 L1230 1080Z" fill="#767a7c" opacity=".5"/></g>}
 {!asset&&family==='lunch'&&<g><rect y="830" width="1920" height="250" fill="#75695d"/>{[0,1,2].map(i=><g key={i}><rect x={130+i*610} y="170" width="460" height="300" rx="18" fill="#39464d"/>{desk(150+i*610,650,420)}</g>)}</g>}
 {!asset&&family==='home'&&<g><rect y="830" width="1920" height="250" fill="#554c45"/><rect x="180" y="170" width="560" height="510" rx="22" fill="#2d3a42"/><rect x="980" y="230" width="680" height="440" rx="26" fill="#413b38"/>{desk(1060,690,520)}</g>}
 {!asset&&(family==='dashboard'||family==='archive'||family==='calendar')&&<g><rect x="90" y="100" width="1740" height="760" rx="28" fill="#172730"/>{[0,1,2,3].map(i=><g key={i}><rect x={145+i*410} y="175" width="335" height="250" rx="14" fill="#263a45"/><rect x={145+i*410} y="475" width="335" height="300" rx="14" fill="#2b4048"/></g>)}</g>}
 {!asset&&family==='phone'&&<g><rect x="710" y="90" width="500" height="870" rx="70" fill="#151f25" stroke="#8d9da1" strokeWidth="14"/><rect x="760" y="185" width="400" height="650" rx="20" fill="#233743"/>{Array.from({length:7},(_,i)=><rect key={i} x="800" y={250+i*72} width={230+(i%3)*60} height="34" rx="10" fill={i%2?'#6e9290':'#684f55'}/>)}</g>}
 {!asset&&family==='abstract'&&<g>{Array.from({length:20},(_,i)=><circle key={i} cx={(seed*17+i*137)%1900} cy={100+((seed*11+i*83)%800)} r={35+(i%5)*23} fill="none" stroke={i%2?'#82a09d':'#c3a76a'} strokeWidth="5" opacity=".17"/>)}</g>}
 <rect width="1920" height="1080" fill="#07101a" opacity=".06"/>
 </svg>;
};