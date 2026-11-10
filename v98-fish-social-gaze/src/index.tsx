import React from 'react';
import {AbsoluteFill, Composition, registerRoot, useCurrentFrame, interpolate} from 'remotion';
import data from './data.json';

const W=1920,H=1080,FPS=30;
const IV='#F2E8D8',RED='#BD4A50',BLUE='#60B8C1',GOLD='#D4B078',INK='#07101A';
type Beat={kind:string,section:number,text:string,subtitle:string,id:string,index:number,from:number,durationFrames:number};
const beats=data.beats as Beat[];
const clamp=(x:number)=>Math.max(0,Math.min(1,x));
const lerp=(a:number,b:number,t:number)=>a+(b-a)*clamp(t);
const rnd=(n:number)=>{const x=Math.sin(n*127.1+77.3)*43758.5453;return x-Math.floor(x)};
const style=(s:React.CSSProperties):React.CSSProperties=>s;
const panel=(x:number,y:number,w:number,h:number):React.CSSProperties=>({position:'absolute',left:x,top:y,width:w,height:h});
const ease=(t:number)=>1-Math.pow(1-clamp(t),3);
const Show=({children,x,y,w=500,h=300,opacity=1,scale=1,rotate=0}:any)=><div style={{...panel(x,y,w,h),opacity,transform:`scale(${scale}) rotate(${rotate}deg)`,transformOrigin:'center'}}>{children}</div>;

function Fish({x,y,size=210,color=BLUE,flip=false,t=0,alpha=1}:any){
 return <Show x={x+Math.sin(t*.055+x)*8} y={y+Math.sin(t*.09+x)*5} w={size} h={size*.55} opacity={alpha} scale={1} rotate={Math.sin(t*.028+x)*2}>
  <svg width="100%" height="100%" viewBox="0 0 320 176" style={{transform:flip?'scaleX(-1)':undefined,overflow:'visible'}}>
   <defs><linearGradient id={'fish'+Math.round(x+y+size)} x1="0" y1="0" x2="1" y2="1"><stop stopColor={color}/><stop offset=".65" stopColor={color}/><stop offset="1" stopColor="#153145"/></linearGradient></defs>
   <path d="M74 82 L8 24 Q16 88 8 144 Z" fill={color} opacity=".72"/>
   <path d="M132 47 Q158 3 198 31 L208 55Z" fill={color} opacity=".72"/>
   <path d="M134 127 Q172 175 216 130Z" fill={color} opacity=".8"/>
   <ellipse cx="178" cy="85" rx="126" ry="59" fill={'url(#fish'+Math.round(x+y+size)+')'} stroke="#D8ECDF" strokeOpacity=".55" strokeWidth="2"/>
   <path d="M253 88q26 10 42 0" fill="none" stroke="#091522" strokeWidth="3"/>
   <circle cx="255" cy="67" r="10" fill="#F2F2E8"/><circle cx="258" cy="67" r="5" fill="#07111B"/>
   <path d="M213 42 Q194 83 213 126" stroke="#B8C9C3" strokeWidth="2" opacity=".45" fill="none"/>
   <path d="M105 64 Q150 51 189 65" stroke="#D7DED5" strokeWidth="2" opacity=".2" fill="none"/>
  </svg>
 </Show>;
}
function Eye({x,y,w=340,t=0,opacity=1,stroke=IV}:any){
 return <Show x={x} y={y} w={w} h={w*.52} opacity={opacity}>
  <svg viewBox="0 0 360 185" width="100%" height="100%" style={{overflow:'visible'}}>
   <path d="M11 93 Q180 -61 349 93 Q180 248 11 93Z" fill="#D8D1C4" fillOpacity=".14" stroke={stroke} strokeWidth="7"/>
   <circle cx={180+Math.sin(t*.036)*16} cy="93" r="67" fill="#263D50" stroke={BLUE} strokeWidth="4"/>
   <circle cx={180+Math.sin(t*.036)*16} cy="93" r="34" fill="#020710"/>
   <circle cx={165+Math.sin(t*.036)*16} cy="72" r="13" fill="#fff" fillOpacity=".7"/>
   <circle cx={200+Math.sin(t*.036)*16} cy="106" r="5" fill="#fff" fillOpacity=".3"/>
  </svg>
 </Show>;
}
function Human({x,y,size=220,t=0,alpha=1}:any){
 return <Show x={x} y={y} w={size} h={size*1.7} opacity={alpha}>
  <svg width="100%" height="100%" viewBox="0 0 220 350" style={{overflow:'visible'}}>
   <ellipse cx="110" cy="75" rx="59" ry="71" fill="#CFC6B5" opacity=".91"/>
   <path d="M90 42q11 11 21 0 M136 42q7 9 15 0" stroke="#172331" strokeWidth="4" fill="none"/>
   <circle cx="97" cy="67" r="5" fill="#142231"/><circle cx="137" cy="67" r="5" fill="#142231"/>
   <path d="M70 151 Q10 160 -3 350 H224 Q212 160 149 151 Z" fill="#283746" stroke={IV} strokeOpacity=".2" strokeWidth="2"/>
   <path d="M102 153L113 210L125 153" fill="#D8D1C5"/>
  </svg>
 </Show>;
}
function Line({x1,y1,x2,y2,t=1,color=GOLD,width=3,dashed=false}:any){
 const dx=x2-x1,dy=y2-y1,len=Math.sqrt(dx*dx+dy*dy);
 return <svg style={style({position:'absolute',left:0,top:0,pointerEvents:'none'})} width={W} height={H}>
  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={width} strokeDasharray={dashed?'9 12':len} strokeDashoffset={dashed?(-t*25):(len*(1-clamp(t)))} opacity=".75"/>
 </svg>;
}
function Ring({x,y,r,t,color=BLUE}:any){
 return <div style={{position:'absolute',left:x-r,top:y-r,width:r*2,height:r*2,border:'2px solid '+color,borderRadius:'50%',opacity:(1-clamp(t))*.52,transform:`scale(${.55+clamp(t)*1.8})`}}/>;
}
function Label({children,x,y,size=32,color=IV,bold=false,serif=false,opacity=1,align='left'}:any){
 return <div style={style({...panel(x,y,900,130),fontFamily:serif?'Noto Serif CJK JP,serif':'Noto Sans CJK JP,sans-serif',fontWeight:bold?800:500,fontSize:size,color,letterSpacing:serif?'.025em':'.06em',opacity,textAlign:align as any,textShadow:'0 2px 14px #020508'})}>{children}</div>;
}
function GlobalTexture({f,section}:any){
 return <>
  <div style={{position:'absolute',inset:0,background:section===1||section===2?'radial-gradient(ellipse at 70% 36%,#133D4A 0%,#091E2B 39%,#070C15 80%)':section===3?'radial-gradient(ellipse at 66% 25%,#302238 0%,#131D30 35%,#080E17 78%)':'radial-gradient(ellipse at 25% 30%,#19283A 0%,#08121D 45%,#060A12 100%)'}}/>
  <svg width={W} height={H} style={{position:'absolute',inset:0,opacity:.27}}>
   <defs><pattern id="grain" width="65" height="65" patternUnits="userSpaceOnUse"><circle cx="2" cy="4" r="1.2" fill={IV} opacity=".36"/><circle cx="39" cy="51" r=".8" fill={IV} opacity=".22"/></pattern></defs>
   <rect x="0" y="0" width={W} height={H} fill="url(#grain)"/>
   {Array.from({length:19},(_,i)=><line key={i} x1={i*118-140} y1="0" x2={i*118+190} y2={H} stroke={IV} strokeOpacity=".025" strokeWidth="2"/>)}
  </svg>
  {Array.from({length:42},(_,i)=><div key={i} style={{position:'absolute',width:2+rnd(i)*4,height:2+rnd(i)*4,borderRadius:30,background:section===1||section===2?BLUE:IV,left:(rnd(i+22)*W),top:(rnd(i+93)*H+Math.sin(f/37+i)*19),opacity:.1+rnd(i+45)*.2}}/>)}
  <div style={{position:'absolute',left:45,top:60,width:4,height:80,background:RED}}/>
 </>;
}
const titles=['目だけで、行動は変わる','序列は視線で決まる','海底の評判経済','いない観察者を想像する','社会を動かす視線','自分の意思とは何か'];
const english=['WATCHING EYES','SOCIAL RANK','REPUTATION ECONOMY','IMAGINED OBSERVER','INDIRECT RECIPROCITY','THE INNER GAZE'];
function Lab({v,f,p,text}:any){
 const view=v%5;
 const y=70+Math.sin(f*.017)*7;
 return <>
  {view===0||/2.76/.test(text)?<>
   <Eye x={1190} y={130} w={490} t={f}/>
   <Label x={165} y={210} size={118} serif bold color={GOLD}>2.76×</Label>
   <Label x={165} y={358} size={37}>目の写真がある週の支払額</Label>
   <div style={{...panel(165,510,700,250),borderBottom:'2px solid #53606E',borderLeft:'2px solid #53606E'}}>
    <div style={{position:'absolute',bottom:0,left:90,width:135,height:175,background:'#506775'}}/>
    <div style={{position:'absolute',bottom:0,left:355,width:135,height:lerp(22,230,ease(p)),background:RED}}/>
    <div style={{position:'absolute',bottom:-48,left:85,fontSize:30,color:IV}}>花の写真</div>
    <div style={{position:'absolute',bottom:-48,left:360,fontSize:30,color:IV}}>目の写真</div>
   </div>
  </>:view===1?<>
   <Show x={190} y={240+y} w={850} h={520}>
    <svg width="850" height="520"><path d="M180 118L690 118L755 468L104 468Z" stroke={IV} strokeOpacity=".35" fill="#172A36" strokeWidth="6"/>
    <rect x="335" y="230" width="120" height="145" rx="8" fill="#9E814C"/><path d="M330 225H460" stroke={GOLD} strokeWidth="15"/>
    <path d="M510 245l55 20v90l-55 20Z" fill="#D6D7C9"/><path d="M507 240H600" stroke={IV} strokeWidth="15"/>
    <path d="M558 190q-45-45 0-70 M596 190q-40-50 0-75" stroke="#DDE9DD" strokeWidth="3" fill="none" opacity=".6"/>
    </svg>
   </Show><Eye x={1130} y={240} w={440} t={f}/>
   <Label x={1090} y={590} size={35}>監視しているのは誰か？</Label>
  </>:view===2?<>
   <Eye x={780} y={140} w={580} t={f}/>
   {Array.from({length:5},(_,i)=><Ring key={i} x={1080} y={420} r={115+i*45} t={(p+i*.2)%1} color={RED}/>)}
   <Label x={410} y={690} size={52} serif bold>写真は、何も見ていない。</Label>
  </>:view===3?<>
   {Array.from({length:8},(_,i)=><Eye key={i} x={230+(i%4)*340} y={165+Math.floor(i/4)*260} w={230} t={f+i*12} opacity={.22+i*.07}/>)}
   <Label x={385} y={700} size={60} serif bold>視線の錯覚</Label>
  </>:<>
   <Human x={340} y={228} size={235} t={f}/>
   <Eye x={1060} y={250} w={520} t={f}/>
   <Line x1={750} y1={425} x2={1100} y2={425} t={p} color={RED} dashed/>
   <Label x={580} y={620} size={39}>見る者がいなくても、変わる</Label>
  </>}
 </>;
}
function Hierarchy({v,f,p,text}:any){
 const view=v%5;
 return <>
  {view===0?<>
   <Fish x={1030} y={130} size={610} color={RED} flip t={f}/>
   <Fish x={300} y={525} size={310} color={BLUE} t={f+25}/>
   <Line x1={1120} y1={445} x2={600} y2={640} t={p} color={RED}/>
   <Label x={240} y={165} size={48}>強いオスの視線</Label>
   <Label x={245} y={740} size={35}>弱いオスは求愛を控える</Label>
  </>:view===1?<>
   <Human x={980} y={175} size={275}/>
   <Human x={340} y={345} size={200} alpha={.6}/>
   <Line x1={1120} y1={340} x2={520} y2={510} t={p} color={RED} dashed/>
   <Label x={340} y={180} size={49} serif>上司が現れた瞬間</Label>
  </>:view===2?<>
   <Fish x={230} y={280} size={450} color={BLUE} t={f}/>
   <Fish x={1140} y={235} size={470} color={RED} flip t={f}/>
   <div style={{...panel(970,150,2,640),background:'#A3BCC4',opacity:.4}}/>
   <Label x={350} y={730} size={44}>誰が見ているか</Label>
   <Label x={1180} y={730} size={38}>強者の存在</Label>
  </>:view===3?<>
   <Fish x={670} y={260} size={560} color={BLUE} t={f}/>
   {Array.from({length:5},(_,i)=><Ring key={i} x={950} y={420} r={120+i*50} t={(p+i*.22)%1} color={RED}/>)}
   <Label x={400} y={695} size={45}>行動を変える観察者</Label>
  </>:<>
   {Array.from({length:7},(_,i)=><Fish key={i} x={230+(i%4)*340} y={140+Math.floor(i/4)*250} size={200+i%2*70} color={i%3===0?RED:BLUE} t={f+i*7} alpha={.45+i%2*.25}/>)}
   <Label x={260} y={700} size={55} serif bold>序列という見えないルール</Label>
  </>}
 </>;
}
function Reef({v,f,p,text}:any){
 const view=v%5;
 return <>
  <svg width={W} height={H} style={{position:'absolute',inset:0}}><path d="M0 805 Q380 700 800 815 T1920 790 V1080 H0Z" fill="#11343B" opacity=".65"/>
   {Array.from({length:24},(_,i)=>{const x=55+i*87;const hh=80+rnd(i)*180;return <path key={i} d={`M${x} 885 Q${x-10} ${885-hh/2} ${x-20} ${885-hh} M${x} 880Q${x+20} ${870-hh/2} ${x+45} ${860-hh}`} fill="none" stroke={i%5===0?RED:BLUE} strokeOpacity=".3" strokeWidth={7+i%4*2}/>})}
  </svg>
  {view===0||view===1?<>
   <Fish x={650} y={210} size={900} color="#5B8FA1" t={f}/>
   <Fish x={800+Math.sin(f*.03)*24} y={440} size={230} color={GOLD} t={f+20} flip/>
   {Array.from({length:10},(_,i)=><div key={i} style={{...panel(1100+rnd(i)*200,460+rnd(i+9)*170,8,8),background:GOLD,borderRadius:'50%',opacity:clamp(p*2)}}/>)}
   {view===1&&<><Fish x={180} y={330} size={330} color={RED} t={f} /><Label x={255} y={178} size={43}>次の客が見ている</Label></>}
  </>:view===2?<>
   {Array.from({length:4},(_,i)=><Fish key={i} x={250+i*335} y={250+i%2*70} size={310} color={i===0?GOLD:BLUE} t={f+i*31}/>)}
   <Line x1={350} y1={600} x2={1560} y2={600} t={p} color={GOLD} dashed/>
   <Label x={400} y={655} size={45}>未来の顧客候補</Label>
  </>:view===3?<>
   <Fish x={430} y={210} size={560} color={BLUE} t={f}/>
   <div style={{...panel(1060,260,420,340),border:'2px solid #D4B07880',borderRadius:24,background:'#07141B9c'}}>
    <div style={{padding:35,fontSize:38,color:IV}}>SERVICE RECORD</div>
    <div style={{padding:'14px 35px',fontSize:70,color:GOLD}}>★★★★★</div>
    <div style={{padding:'0 35px',fontSize:32,color:IV}}>評判は、未来の取引になる</div>
   </div>
  </>:<>
   <Fish x={330} y={225} size={440} color={GOLD} t={f}/>
   <Fish x={1100} y={300} size={580} color={RED} flip t={f}/>
   <Line x1={780} y1={470} x2={1130} y2={490} t={p} color={BLUE}/>
   <Label x={415} y={705} size={49}>協力は、利益になる。</Label>
  </>}
 </>;
}
function Observer({v,f,p,text}:any){
 const view=v%5;
 return <>{view===0?<>
  <Human x={730} y={160} size={340}/>
  {Array.from({length:7},(_,i)=>{const a=i*Math.PI*2/7+f*.002;return <Eye key={i} x={980+Math.cos(a)*550-85} y={510+Math.sin(a)*260-50} w={150} t={f+i*2} opacity={.25+i%3*.12}/>})}
  <Label x={260} y={700} size={46}>頭の中の観察者たち</Label>
 </>:view===1?<>
  <Eye x={605} y={220} w={690} t={f}/>
  {Array.from({length:5},(_,i)=><Ring key={i} x={940} y={405} r={135+i*80} t={(p+i*.23)%1} color={RED}/>)}
  <Label x={370} y={710} size={54} serif>「見られている」という感覚</Label>
 </>:view===2?<>
  <div style={{...panel(660,140,510,660),borderRadius:55,border:'10px solid #536E80',background:'linear-gradient(#1B3144,#071420)',boxShadow:'0 25px 90px #0009'}}>
   <div style={{margin:35,height:300,background:'linear-gradient(140deg,#8B7664,#2D3B56)',borderRadius:18}}>
    <Human x={100} y={40} size={130} alpha={.85}/>
   </div>
   <div style={{color:IV,fontSize:29,textAlign:'center'}}>どう見られるだろう？</div>
  </div>
  <Eye x={1200} y={300} w={300} t={f} opacity={.7}/>
 </>:view===3?<>
  <Human x={600} y={155} size={390}/>
  <Human x={930} y={155} size={390} alpha={.17}/>
  <Line x1={950} y1={180} x2={950} y2={825} t={p} color={RED}/>
  <Label x={430} y={730} size={47}>本当の監視者は、外にいない</Label>
 </>:<>
  {Array.from({length:13},(_,i)=><Eye key={i} x={180+i%5*325} y={160+Math.floor(i/5)*192} w={220} t={f+i*4} opacity={.14+i%4*.1}/>)}
  <Label x={270} y={730} size={49} serif bold>見られる前に、自分を裁く。</Label>
 </>}</>;
}
function Society({v,f,p,text}:any){
 const view=v%5;
 const pts=[{x:350,y:440},{x:945,y:270},{x:1460,y:480}];
 return <>{view===0||view===1?<>
  {pts.map((s,i)=><React.Fragment key={i}><Ring x={s.x} y={s.y} r={100} t={(p+i*.25)%1}/><Human x={s.x-68} y={s.y-120} size={130}/></React.Fragment>)}
  <Line x1={450} y1={440} x2={875} y2={300} t={p} color={GOLD}/>
  <Line x1={1030} y1={300} x2={1400} y2={455} t={clamp(p*1.5-.15)} color={BLUE}/>
  <Label x={410} y={670} size={43}>AがBを助ける。CがAを信頼する。</Label>
 </>:view===2?<>
  {Array.from({length:14},(_,i)=>{const a=i*Math.PI*2/14;const x=950+Math.cos(a)*460,y=425+Math.sin(a)*320;return <React.Fragment key={i}><Line x1={950} y1={425} x2={x} y2={y} t={p} color={i%3===0?RED:BLUE} width={1.4}/><div style={{position:'absolute',left:x-24,top:y-24,width:48,height:48,borderRadius:50,background:i%3===0?RED:BLUE,opacity:.45}}/></React.Fragment>})}
  <Eye x={770} y={315} w={370} t={f}/>
  <Label x={490} y={790} size={43}>評判のネットワーク</Label>
 </>:view===3?<>
  <Human x={755} y={200} size={325}/>
  <Eye x={1150} y={270} w={300} t={f} opacity={.65}/>
  <Line x1={1240} y1={460} x2={1060} y2={550} t={p} color={RED} dashed/>
  <Label x={420} y={720} size={47}>外側の目は、内側へ移動する。</Label>
 </>:<>
  <Human x={405} y={235} size={275} alpha={.85}/>
  <div style={{...panel(1020,200,570,550),border:'7px solid #D4B078',boxShadow:'0 0 55px #D4B07830'}}/>
  <Human x={1170} y={260} size={245} alpha={.48}/>
  <Label x={540} y={730} size={44}>規範の内面化</Label>
 </>}</>;
}
function Ending({v,f,p}:any){
 return <>
  <div style={{...panel(440,135,1040,630),border:'5px solid #A59275',background:'linear-gradient(100deg,#17233455,#D4B07810,#17233455)',boxShadow:'0 0 90px #0008'}}/>
  <Human x={690} y={250} size={245} alpha={.7}/>
  <Human x={1030} y={250} size={245} alpha={.25}/>
  <div style={{...panel(959,185,2,540),background:RED,opacity:.5}}/>
  {Array.from({length:4},(_,i)=><Ring key={i} x={950} y={457} r={100+i*100} t={(p+i*.25)%1} color={GOLD}/>)}
  <Label x={380} y={790} size={49} serif bold>誰の目を気にして生きるのか</Label>
 </>;
}
function Scene({b,frame}:any){
 const local=frame-b.from;
 const p=clamp(local/Math.max(1,b.durationFrames));
 const appear=ease(Math.min(1,local/17));
 const disappear=clamp((b.durationFrames-local)/12);
 const alpha=Math.min(appear,disappear);
 const v=(b.index*7+b.section*5+Math.floor(b.index/3))%5;
 const shake=Math.sin(local*.07+b.index)*3;
 const world=style({position:'absolute',inset:0,transform:`translate(${Math.sin(local*.008+b.index)*18}px,${Math.cos(local*.007+b.index)*9}px) scale(${1.01+p*.03})`,transformOrigin:'center center',opacity:alpha});
 return <AbsoluteFill style={{overflow:'hidden',background:INK,color:IV}}>
  <GlobalTexture f={frame} section={b.section}/>
  {b.kind==='chapter'?<>
   <div style={{position:'absolute',left:130,top:240,width:1250,height:520,opacity:appear}}>
    <div style={{fontSize:28,letterSpacing:10,color:GOLD,marginBottom:35}}>CHAPTER {b.section===0?'00':String(b.section).padStart(2,'0')}</div>
    <div style={{fontFamily:'Noto Serif CJK JP,serif',fontSize:88,lineHeight:1.55,fontWeight:700,letterSpacing:2}}>{b.text.split('｜')[1]||b.text}</div>
    <div style={{marginTop:40,width:850,height:3,background:`linear-gradient(to right,${RED} ${p*100}%,#ffffff28 0)`}}/>
   </div>
   <Eye x={1430} y={370} w={360} t={frame} opacity={appear*.7}/>
  </>:<>
   <div style={world}>{b.section===0?<Lab v={v} f={frame} p={p} text={b.text}/>:b.section===1?<Hierarchy v={v} f={frame} p={p} text={b.text}/>:b.section===2?<Reef v={v} f={frame} p={p} text={b.text}/>:b.section===3?<Observer v={v} f={frame} p={p} text={b.text}/>:b.section===4?<Society v={v} f={frame} p={p} text={b.text}/>:<Ending v={v} f={frame} p={p}/>}</div>
   <div style={{position:'absolute',left:105,top:70,color:GOLD,fontSize:22,letterSpacing:6,fontWeight:700}}>{english[b.section]} <span style={{color:IV,opacity:.55}}> / {String(b.index).padStart(3,'0')}</span></div>
   <div style={{position:'absolute',left:105,top:115,color:IV,opacity:.8,fontFamily:'Noto Serif CJK JP,serif',fontSize:43}}>{titles[b.section]}</div>
   <div style={{position:'absolute',left:99,top:174,height:2,width:Math.floor(480*ease(p)),background:RED}}/>
  </>}
  <div style={{position:'absolute',left:98,bottom:74,color:IV,opacity:.35,fontSize:20,letterSpacing:3}}>考える夜 / KANGAERU YORU</div>
  <div style={{position:'absolute',right:105,bottom:74,color:IV,opacity:.38,fontSize:20,letterSpacing:3}}>{String(b.section).padStart(2,'0')}  /  05</div>
  {b.subtitle&&<div style={{position:'absolute',left:100,right:100,bottom:124,display:'flex',justifyContent:'center',opacity:alpha}}>
   <div style={{maxWidth:1715,background:'rgba(2,7,13,0.91)',border:'1px solid #D4B07822',borderRadius:12,padding:'20px 32px',fontFamily:'Noto Sans CJK JP, sans-serif',fontSize:39,fontWeight:750,lineHeight:1.55,color:'#FAF5E8',textAlign:'center',boxShadow:'0 10px 35px #0009',whiteSpace:'pre-wrap'}}>{b.subtitle}</div>
  </div>}
  <div style={{position:'absolute',left:0,bottom:0,width:`${clamp(frame/data.totalFrames)*100}%`,height:4,background:RED}}/>
 </AbsoluteFill>;
}
const Film=()=>{
 const frame=useCurrentFrame();
 let lo=0,hi=beats.length-1,b=beats[0];
 while(lo<=hi){const m=(lo+hi)>>1,at=beats[m];if(frame<at.from)hi=m-1;else if(frame>=at.from+at.durationFrames)lo=m+1;else{b=at;break;}}
 return <Scene b={b} frame={frame}/>;
};
const Root=()=> <Composition id="FishSocialGaze" component={Film} durationInFrames={data.totalFrames} fps={FPS} width={W} height={H}/>;
registerRoot(Root);
