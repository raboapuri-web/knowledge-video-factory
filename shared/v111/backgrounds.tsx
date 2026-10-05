import React from 'react';
import {staticFile} from 'remotion';

const hash=(s:string)=>[...s].reduce((a,c)=>(a*33+c.charCodeAt(0))>>>0,111);
export const families='one-room warehouse job-center apartment street-night station hospital admin supermarket shelter family-home office research abstract cost-map justice convenience bank city macro building ship phone subway emergency'.split(' ');

const assetMap:Record<string,string>={
 'lib-oneroom':'BG_oneroom_night.png',
 'lib-hospital':'BG_hospital.png',
 'lib-supermarket':'BG_supermarket.png',
 'lib-subway':'BG_subway.png',
 'lib-bank':'BG_bank.png',
 'lib-room-day':'BG_ROOM_DAY.png',
 'lib-room-night':'BG_ROOM_NIGHT_ON.png',
 'lib-residential-night':'BG_V46_RESIDENTIAL_STREET_NIGHT.png',
 'lib-apartment':'BG_V46_CITY_APARTMENT_EXTERIOR.png',
 'lib-subway-entrance':'BG_V46_SUBWAY_ENTRANCE.png',
 'lib-office-street':'BG_V46_OFFICE_STREET_NIGHT.png',
 'lib-shelter-counsel':'BG_SHELTER_COUNSEL.png',
 'lib-shelter-corridor':'BG_SHELTER_CORRIDOR.png'
};
const assetFor=(e:string)=>Object.entries(assetMap).find(([k])=>e.startsWith(k))?.[1]??null;

const Desk=({x,y,w=420}:{x:number;y:number;w?:number})=><g><rect x={x} y={y} width={w} height="32" rx="7" fill="#665950"/><rect x={x+26} y={y+32} width="20" height="160" fill="#41474c"/><rect x={x+w-46} y={y+32} width="20" height="160" fill="#41474c"/></g>;
const Screen=({x,y,w=320,h=190,seed=0}:{x:number;y:number;w?:number;h?:number;seed?:number})=><g><rect x={x} y={y} width={w} height={h} rx="12" fill="#152630" stroke="#7f9399" strokeWidth="7"/>{[0,1,2,3].map(i=><rect key={i} x={x+35} y={y+35+i*31} width={Math.max(80,w-85-((seed+i*51)%120))} height="11" rx="5" fill={i===1?"#aa5a56":"#76a099"} opacity=".72"/>)}</g>;

export const Backdrop=({environment,family}:{environment:string;family:string})=>{
 if(!families.includes(family))throw Error('V111 unsupported background family '+family);
 const seed=hash(environment),asset=assetFor(environment),base=['#17242d','#202b33','#262c35','#2b3138'][seed%4];
 return <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}}>
  <rect width="1920" height="1080" fill={base}/>
  {asset?<><image href={staticFile('assets/v111/'+asset)} x="0" y="0" width="1920" height="1080" preserveAspectRatio="xMidYMid slice"/><rect width="1920" height="1080" fill="#08121a" opacity=".28"/></>:null}

  {!asset&&family==='one-room'&&<g><rect y="830" width="1920" height="250" fill="#4a413b"/><rect x="150" y="180" width="770" height="560" rx="22" fill="#293740"/><rect x="1050" y="180" width="580" height="540" rx="24" fill="#3a3431"/><Desk x={1040} y={690} w={600}/><rect x="210" y="580" width="520" height="140" rx="28" fill="#555f68"/></g>}
  {!asset&&family==='warehouse'&&<g><rect y="820" width="1920" height="260" fill="#555a5d"/>{[0,1,2,3].map(i=><g key={i}><rect x={80+i*455} y="160" width="360" height="560" rx="16" fill="#303b42"/>{[0,1,2,3].map(j=><rect key={j} x={120+i*455} y={210+j*120} width="280" height="75" fill="#8a7658" opacity=".75"/>)}</g>)}</g>}
  {!asset&&family==='job-center'&&<g><rect y="830" width="1920" height="250" fill="#555b5e"/>{[0,1,2].map(i=><g key={i}><Desk x={130+i*590} y={640} w={460}/><Screen x={205+i*590} y={390} w={300} h={180} seed={seed+i}/></g>)}<rect x="120" y="150" width="1680" height="90" rx="16" fill="#36454d"/></g>}
  {!asset&&family==='apartment'&&<g><rect y="790" width="1920" height="290" fill="#4c5356"/>{[0,1,2].map(i=><g key={i}><rect x={120+i*600} y={120+(i%2)*40} width="500" height="610" rx="12" fill="#334149"/>{[0,1,2,3].map(j=><rect key={j} x={170+i*600} y={190+j*120+(i%2)*40} width="150" height="80" fill="#1c2a32"/>)}</g>)}</g>}
  {!asset&&family==='street-night'&&<g><rect y="800" width="1920" height="280" fill="#343c42"/><rect width="1920" height="1080" fill="#06111b" opacity=".45"/>{[0,1,2,3].map(i=><rect key={i} x={80+i*470} y={170+(i%2)*40} width="380" height="540" fill="#26333b"/>)}<circle cx="1450" cy="220" r="58" fill="#d1bd79" opacity=".55"/></g>}
  {!asset&&family==='station'&&<g><rect y="800" width="1920" height="280" fill="#4b5256"/><rect x="100" y="120" width="1720" height="560" rx="24" fill="#263740"/>{[0,1,2,3].map(i=><rect key={i} x={180+i*410} y="180" width="320" height="350" fill="#17252d"/>)}<rect x="260" y="670" width="1400" height="80" rx="28" fill="#687176"/></g>}
  {!asset&&(family==='hospital'||family==='emergency')&&<g><rect y="840" width="1920" height="240" fill="#60686c"/><rect x="110" y="130" width="1700" height="600" rx="28" fill="#d2d7d4" opacity=".92"/>{[0,1,2].map(i=><rect key={i} x={180+i*560} y="220" width="420" height="310" rx="16" fill="#52666e"/>)}<path d="M960 210 V500 M815 355 H1105" stroke="#a84f4e" strokeWidth="50"/></g>}
  {!asset&&family==='admin'&&<g><rect y="835" width="1920" height="245" fill="#555b5e"/>{[0,1,2,3].map(i=><g key={i}><Desk x={90+i*455} y={650} w={380}/><rect x={155+i*455} y="360" width="250" height="210" rx="15" fill="#d6d0c0"/></g>)}</g>}
  {!asset&&family==='supermarket'&&<g><rect y="830" width="1920" height="250" fill="#5f6465"/>{[0,1,2,3].map(i=><g key={i}><rect x={90+i*455} y="180" width="370" height="480" rx="14" fill="#39464d"/>{[0,1,2,3].map(j=><rect key={j} x={125+i*455} y={230+j*95} width="300" height="45" fill={j%2?'#b48a58':'#7c966a'}/>)}</g>)}</g>}
  {!asset&&family==='shelter'&&<g><rect y="830" width="1920" height="250" fill="#5d5750"/>{[0,1,2,3].map(i=><g key={i}><rect x={100+i*450} y="300" width="380" height="170" rx="30" fill="#66717a"/><rect x={120+i*450} y="455" width="340" height="150" rx="24" fill="#858d91"/></g>)}</g>}
  {!asset&&family==='family-home'&&<g><rect y="835" width="1920" height="245" fill="#594e47"/><rect x="160" y="170" width="670" height="520" rx="24" fill="#304048"/><rect x="990" y="190" width="700" height="500" rx="24" fill="#423a36"/><Desk x={1040} y={690} w={590}/></g>}
  {!asset&&family==='office'&&<g><rect y="830" width="1920" height="250" fill="#545b5e"/>{[0,1,2].map(i=><g key={i}><Desk x={130+i*590} y={630+(i%2)*55} w={460}/><Screen x={205+i*590} y={390+(i%2)*55} w={300} h={180} seed={seed+i}/></g>)}</g>}
  {!asset&&family==='research'&&<g><rect y="830" width="1920" height="250" fill="#4c555c"/>{[0,1,2].map(i=><Screen key={i} x={110+i*610} y={210+(i%2)*85} w={500} h={300} seed={seed+i}/>)}<Desk x={250} y={700} w={1420}/></g>}
  {!asset&&(family==='cost-map'||family==='macro')&&<g><rect x="90" y="95" width="1740" height="770" rx="28" fill="#172730" stroke="#71858c" strokeWidth="7"/>{[0,1,2,3].map(i=><g key={i}><rect x={145+i*410} y="170" width="335" height="250" rx="16" fill="#263b45"/><rect x={145+i*410} y="470" width="335" height="300" rx="16" fill="#2b4149"/></g>)}</g>}
  {!asset&&family==='justice'&&<g><rect y="830" width="1920" height="250" fill="#4c5054"/><rect x="220" y="190" width="1480" height="480" rx="20" fill="#363f46"/><path d="M960 200 V610 M720 320 H1200" stroke="#c2a265" strokeWidth="18"/><circle cx="720" cy="390" r="90" fill="none" stroke="#c2a265" strokeWidth="10"/><circle cx="1200" cy="390" r="90" fill="none" stroke="#c2a265" strokeWidth="10"/></g>}
  {!asset&&family==='convenience'&&<g><rect y="830" width="1920" height="250" fill="#5e6262"/>{[0,1,2].map(i=><g key={i}><rect x={130+i*600} y="180" width="500" height="450" rx="18" fill="#39464c"/>{[0,1,2,3].map(j=><rect key={j} x={180+i*600} y={230+j*85} width="390" height="42" fill={j%2?'#c0a35f':'#829a73'}/>)}</g>)}</g>}
  {!asset&&family==='bank'&&<g><rect y="840" width="1920" height="240" fill="#5a6061"/><rect x="200" y="150" width="1520" height="550" rx="30" fill="#35434b"/>{[0,1,2,3].map(i=><rect key={i} x={290+i*340} y="260" width="230" height="300" rx="15" fill="#d5cfbf"/>)}</g>}
  {!asset&&family==='city'&&<g><rect y="810" width="1920" height="270" fill="#4f5558"/>{[0,1,2,3,4].map(i=><g key={i}><rect x={50+i*380} y={120+(i%2)*90} width="330" height={610-(i%2)*90} fill="#303c43"/>{[0,1,2,3].map(j=><rect key={j} x={95+i*380} y={190+j*110+(i%2)*90} width="95" height="62" fill="#16252c"/>)}</g>)}</g>}
  {!asset&&family==='building'&&<g><rect y="820" width="1920" height="260" fill="#51575a"/><rect x="400" y="110" width="1120" height="650" rx="20" fill="#323f46"/>{Array.from({length:5},(_,i)=><rect key={i} x="520" y={180+i*105} width="880" height="58" rx="12" fill="#53656c"/>)}<path d="M1360 160 V700" stroke="#c3a365" strokeWidth="18"/></g>}
  {!asset&&family==='ship'&&<g><rect width="1920" height="1080" fill="#132632"/><path d="M0 720 Q450 650 900 720 T1920 700 V1080 H0Z" fill="#32576a"/><path d="M360 590 H1580 L1450 880 H480Z" fill="#4a4b4e" stroke="#c1a260" strokeWidth="10"/>{[0,1,2].map(i=><rect key={i} x={520} y={610+i*80} width="820" height="50" rx="9" fill={i===2?'#6a514d':'#5e6c72'}/>)}</g>}
  {!asset&&family==='phone'&&<g><rect x="710" y="90" width="500" height="870" rx="70" fill="#151f25" stroke="#8d9da1" strokeWidth="14"/><rect x="760" y="185" width="400" height="650" rx="20" fill="#233743"/>{Array.from({length:7},(_,i)=><rect key={i} x="800" y={250+i*72} width={230+(i%3)*60} height="34" rx="10" fill={i%2?'#6e9290':'#684f55'}/>)}</g>}
  {!asset&&family==='subway'&&<g><rect y="800" width="1920" height="280" fill="#4a5054"/><rect x="100" y="130" width="1720" height="520" rx="24" fill="#273840"/>{[0,1,2,3].map(i=><rect key={i} x={155+i*430} y="200" width="350" height="300" fill="#16242b"/>)}<rect x="250" y="650" width="1420" height="80" rx="26" fill="#677075"/></g>}
  {!asset&&family==='abstract'&&<g>{Array.from({length:20},(_,i)=><circle key={i} cx={(seed*17+i*137)%1900} cy={100+((seed*11+i*83)%800)} r={35+(i%5)*23} fill="none" stroke={i%2?'#82a09d':'#c3a76a'} strokeWidth="5" opacity=".17"/>)}</g>}

  <rect width="1920" height="1080" fill="#07101a" opacity=".06"/>
 </svg>;
};