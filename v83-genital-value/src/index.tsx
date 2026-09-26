import React from 'react';
import {AbsoluteFill,Audio,Composition,Sequence,interpolate,registerRoot,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import script from './script-data.json';
import sync from './sync-timing.json';
import {V46_ADULT_MAN_RIG} from '../../shared/asset-library/人物テンプレート/V46_ADULT_MAN_RIG';
import {OfficeWorkerRig} from '../../shared/asset-library/人物テンプレート/office-worker-rig';
const fps=30;
if(script.beats.length!==sync.beats.length||script.beats.some((s,i)=>s.id!==sync.beats[i].id))throw Error('Narration timeline mismatch');
const beats=script.beats.map((s,i)=>({...s,start:Math.round(sync.beats[i].start*fps),frames:Math.round(sync.beats[i].end*fps)-Math.round(sync.beats[i].start*fps)}));
const total=Math.ceil(sync.durationSeconds*fps);
const colors=['#75c7d9','#d1a975','#c17b80','#c1af7b','#90a6cf'];
const prop=(x:number,y:number,w:number,h:number,color:string,opacity=1)=><rect x={x} y={y} width={w} height={h} rx={15} fill={color} opacity={opacity}/>;
const silhouette=(x:number,y:number,scale=1,color='#18232e')=><g transform={`translate(${x} ${y}) scale(${scale})`} fill={color}><circle cx="0" cy="0" r="36"/><path d="M-55 47 Q0 16 55 47 L74 195 L-74 195Z"/></g>;
const Phone=({x=1300,y=270,scroll=0}:{x?:number,y?:number,scroll?:number})=><g transform={`translate(${x} ${y}) rotate(-8)`}><rect width="270" height="465" rx="31" fill="#101722" stroke="#9aa7b5" strokeWidth="8"/><rect x="18" y="35" width="234" height="385" rx="8" fill="#293644"/>{[0,1,2,3].map(i=><g key={i} transform={`translate(0 ${((i*105-scroll)%420+420)%420})`}>{prop(34,60,200,80,['#526676','#485968','#6c5b63'][i%3])}<circle cx="72" cy="100" r="24" fill="#91a0a8"/></g>)}<circle cx="135" cy="443" r="10" fill="#75818c"/></g>;
const Gauge=({value=0}:{value?:number})=><g transform="translate(960 460)"><circle r="235" fill="none" stroke="#334a5b" strokeWidth="28"/><path d="M-135 108 L0 -185 L135 108" fill="none" stroke="#e2b879" strokeWidth="12"/><line x1="0" y1="50" x2={Math.sin(value)*165} y2={-Math.cos(value)*165} stroke="#d36a70" strokeWidth="17" strokeLinecap="round"/><circle cy="50" r="20" fill="#d36a70"/></g>;
const Research=({idx,t}:{idx:number,t:number})=><svg viewBox="0 0 1920 1080" style={{width:'100%',height:'100%'}}>
 <g opacity=".9">{[0,1,2,3,4,5,6].map((j)=><g key={j} transform={`translate(${330+j*215} 210)`}>{prop(0,0,144,550,'#223546',.65)}{silhouette(72,84,.53,colors[j%5])}{prop(18,360,108,14,'#a8bcbb',.7)}{prop(18,400,50+(idx%5)*13,11,'#d99782',.9)}</g>)}</g>
 <path d={`M250 ${770-(idx%4)*18} Q640 ${650-40*Math.sin(t)} 960 560 T1700 ${360+(idx%3)*30}`} fill="none" stroke="#e6c181" strokeWidth="7" opacity=".65"/>
 {[0,1,2].map(j=><circle key={j} cx={610+j*340} cy={620-j*100+Math.sin(t*2+j)*20} r="15" fill="#d9767b"/>)}
 </svg>;
const Mirror=({idx,t}:{idx:number,t:number})=><svg viewBox="0 0 1920 1080" style={{width:'100%',height:'100%'}}>
 {prop(320,105,730,790,'#14202b')}{prop(350,128,670,740,'#516778',.55)}<path d="M410 180 L520 150 L390 800" fill="none" stroke="#cedbe0" strokeWidth="22" opacity=".14"/>
 {silhouette(685,335,2.1,'#23313a')}{prop(130,883,1050,170,'#222b32')}
 {(idx%4===0||idx%4===1)&&<Phone x={1290} y={310} scroll={t*30}/>}
 {idx%4===2&&[0,1,2].map(j=><g key={j} opacity={.22+.25*Math.sin(t+j)**2}>{silhouette(400+j*210,380,.48,'#c57676')}</g>)}
 {idx%4===3&&<g><path d="M1140 905 Q1330 830 1500 930" stroke="#88aabc" strokeWidth="22" fill="none"/><circle cx={1350+Math.sin(t*3)*25} cy="875" r="12" fill="#9ec7d4"/></g>}
 </svg>;
const Street=({idx,t}:{idx:number,t:number})=><svg viewBox="0 0 1920 1080" style={{width:'100%',height:'100%'}}>{[0,1,2,3,4].map(j=><g key={j} transform={`translate(${250+j*330+Math.sin(t*.5+j)*24} ${390+j%2*70})`}>{silhouette(0,0,1.6,colors[j])}</g>)}{idx%2===0&&<path d="M180 850 Q940 710 1760 880" fill="none" stroke="#d4897e" strokeWidth="14" opacity=".7"/>}</svg>;
const Cards=({idx,t}:{idx:number,t:number})=><svg viewBox="0 0 1920 1080" style={{width:'100%',height:'100%'}}>{[0,1,2,3,4].map(j=><g key={j} transform={`translate(${180+j*320} ${260+(j%2)*90+Math.sin(t+j)*10}) rotate(${j%2?7:-5})`}>{prop(0,0,255,425,j===idx%5?'#677988':'#2d3a48')}{prop(22,30,211,176,colors[j],.6)}{silhouette(128,100,.7,'#1d2931')}{prop(22,240,130,10,'#e0d6c4',.65)}{prop(22,269,184,10,'#e0d6c4',.38)}</g>)}</svg>;

const Settings=({scene,idx,t}:{scene:any,idx:number,t:number})=>{
 const loc=scene.location, pulse=.5+.5*Math.sin(t*2.3);
 if(loc==='apartment')return <svg viewBox="0 0 1920 1080" style={{width:'100%',height:'100%'}}>
  {prop(1110,720,600,210,'#26323b',.92)}{prop(1180,640,250,65,'#657384',.9)}
  <Phone x={1360} y={230} scroll={t*24+idx*43}/>
  {idx%3===0&&[0,1,2].map(j=><g key={j} transform={`translate(${680+j*145} 390)`}>{prop(0,0,110,160,'#9d8f82',.7)}{silhouette(55,51,.36,'#283742')}</g>)}
  {idx%3===1&&<g><path d="M350 820 L1100 820" stroke="#d57c79" strokeWidth="12" strokeDasharray="30 18"/><circle cx={450+t*25} cy="815" r="18" fill="#e6b780"/></g>}
 </svg>;
 if(loc==='changing')return <svg viewBox="0 0 1920 1080" style={{width:'100%',height:'100%'}}>
  {[0,1,2,3,4].map(j=><g key={j}>{prop(220+j*300,115,250,760,'#314654',.85)}{prop(240+j*300,180,210,7,'#7d969e')}{prop(430+j*300,450,12,55,'#c3aa81')}{j%2===0&&silhouette(330+j*300,530,.43,'#6f8490')}</g>)}
  {prop(140,890,1630,95,'#273743',.9)}
 </svg>;
 if(loc==='interview')return <svg viewBox="0 0 1920 1080" style={{width:'100%',height:'100%'}}>
  {[0,1,2,3,4,5].map(j=><g key={j} opacity={idx%3===j%3?.95:.4}>{prop(240+j*250,595,170,65,'#668092')}{prop(265+j*250,655,15,170,'#334a56')}{prop(370+j*250,655,15,170,'#334a56')}{silhouette(325+j*250,480,.72,colors[j%5])}<ellipse cx={335+j*250} cy={310-j%2*50} rx={65} ry={40} fill="#b4c2c4" opacity={pulse*.5}/></g>)}
 </svg>;
 if(loc==='clinic')return <svg viewBox="0 0 1920 1080" style={{width:'100%',height:'100%'}}>
  {prop(390,160,1130,670,'#182735',.92)}
  <path d="M510 740 C760 730 750 240 950 240 C1160 240 1150 730 1410 740" fill="none" stroke="#c9af83" strokeWidth="13"/>
  <path d="M510 740 C760 730 750 240 950 240 C1160 240 1150 730 1410 740 L1410 750 L510 750Z" fill="#bc8e77" opacity=".23"/>
  <line x1="950" x2="950" y1="270" y2="745" stroke="#e1d6ba" strokeWidth="6" strokeDasharray="20 16"/>
  {[0,1,2].map(j=><circle key={j} cx={690+j*260} cy={570-(j===1?250:0)+Math.sin(t*2+j)*10} r={20} fill={colors[j]}/>)}
 </svg>;
 if(loc==='cafe')return <svg viewBox="0 0 1920 1080" style={{width:'100%',height:'100%'}}>
  <ellipse cx="1050" cy="780" rx="590" ry="120" fill="#7e6858" opacity=".9"/><rect x="1030" y="800" width="40" height="280" fill="#51423b"/>
  {[0,1].map(j=><g key={j} transform={`translate(${740+j*560} 570)`}><ellipse cx="0" cy="110" rx="44" ry="22" fill="#e5dfca"/><path d="M-34 15 L-23 104 L23 104 L34 15Z" fill="#c8d7d3" opacity=".8"/><path d="M-26 16 Q0 45 26 16" stroke="#a2c1bb" fill="none" strokeWidth="7"/></g>)}
  {idx%2===1&&[0,1,2].map(j=><circle key={j} cx={850+j*110} cy={410-Math.sin(t+j)*15} r={22} fill="#a7b5b7" opacity={.25+pulse*.15}/>)}
 </svg>;
 if(loc==='store')return <svg viewBox="0 0 1920 1080" style={{width:'100%',height:'100%'}}>
  <path d="M90 715 L1830 715 L1730 930 L210 930Z" fill="#334756" stroke="#79909a" strokeWidth="11"/>
  {[0,1,2,3,4].map(j=><g key={j} transform={`translate(${260+j*330-((t*26)%330)} 480)`}>{prop(0,0,205,220,colors[j],.75)}{prop(48,46,110,7,'#e6e4d7',.8)}{prop(48,82,85,7,'#e6e4d7',.6)}<circle cx="105" cy="168" r="22" fill="#223441"/></g>)}
 </svg>;
 if(loc==='screen')return <svg viewBox="0 0 1920 1080" style={{width:'100%',height:'100%'}}><Phone x={770} y={100} scroll={t*70+idx*90}/>{idx%2===1&&[0,1,2].map(j=><g key={j} transform={`translate(${250+j*530} 250)`}>{prop(0,0,280,420,'#344857',.7)}{silhouette(140,120,.85,'#a26c70')}</g>)}</svg>;
 return <Research idx={idx} t={t}/>;
};
const Scene=({scene,index,frames}:{scene:any,index:number,frames:number})=>{
 const f=useCurrentFrame(),{fps}=useVideoConfig(),t=f/fps;
 const a=Math.min(1,f/12,(frames-f)/12);const opacity=Math.max(.05,a);
 const bg=scene.asset.endsWith('.png')?staticFile('assets/'+scene.asset):null;
 const isHuman=['bathroom','apartment','cafe','train','clinic','interview','changing'].includes(scene.location);
 const variant=scene.location==='bathroom'?<Mirror idx={index} t={t}/>:scene.location==='research'||scene.location==='projection'||scene.location==='primate'?<Research idx={index} t={t}/>:scene.location==='street'||scene.location==='train'?<Street idx={index} t={t}/>:<Settings scene={scene} idx={index} t={t}/>;
 return <AbsoluteFill style={{background:'#0b1119'}}>
  {bg&&<AbsoluteFill style={{backgroundImage:`url(${bg})`,backgroundSize:'cover',backgroundPosition:'center'}}/>}
  {!bg&&<AbsoluteFill style={{background:'radial-gradient(circle at 35% 30%,#283d4c,#0a1119 78%)'}}/>}
  <AbsoluteFill style={{background:'linear-gradient(0deg,rgba(3,6,10,.83),rgba(3,6,10,.15) 55%,rgba(3,6,10,.42))'}}/>
  <AbsoluteFill style={{opacity}}>{variant}</AbsoluteFill>
  {isHuman&&scene.location!=='bathroom'&&scene.location!=='changing'&&<V46_ADULT_MAN_RIG x={150+Math.sin(t*.5)*14} y={420} scale={.85} action={index%3===0?'walk':'idle'} showBriefcase={false}/>}
  {scene.location==='cafe'&&<OfficeWorkerRig x={1250} y={450} scale={.8} action="idle" suitColor="#714f52" mirror/>}
  <div style={{position:'absolute',left:64,top:44,width:118,height:4,background:colors[['P','C1','C2','C3','C4','E'].indexOf(scene.chapter)%5],opacity:.75}}/>
 </AbsoluteFill>;
};
const splitSubtitle=(source:string)=>{
 const out:string[]=[];let remaining=source;
 while(remaining.length){
  if(remaining.length<=34){out.push(remaining);break;}
  const candidates=[...remaining.slice(22,35).matchAll(/[、。！？]/gu)].map(m=>22+(m.index??0)+1);
  const cut=candidates.length?candidates[candidates.length-1]:34;
  out.push(remaining.slice(0,cut));remaining=remaining.slice(cut);
 }
 if(out.join('')!==source)throw Error('Subtitle text mismatch');
 return out;
};
const Subs=()=>{
 const f=useCurrentFrame(),idx=beats.findIndex(b=>f>=b.start&&f<b.start+b.frames);
 if(idx<0)return null;
 const b=beats[idx],rel=(f-b.start)/b.frames;
 const chunks=splitSubtitle(b.narration);
 const chunk=chunks[Math.min(chunks.length-1,Math.floor(rel*chunks.length))];
 return <AbsoluteFill style={{justifyContent:'flex-end',alignItems:'center',paddingBottom:32,pointerEvents:'none'}}><div style={{maxWidth:1680,padding:'12px 30px',borderRadius:12,background:'rgba(2,5,9,.88)',color:'#f6f5f0',fontFamily:'Noto Sans CJK JP,sans-serif',fontSize:42,fontWeight:700,textAlign:'center',lineHeight:1.4,textShadow:'0 3px 8px #000'}}>{chunk}</div></AbsoluteFill>;
};
const Film=()=><AbsoluteFill style={{background:'#090e13'}}><Audio src={staticFile('audio/narration.m4a')}/>{beats.map((s,i)=><Sequence key={s.id} from={s.start} durationInFrames={s.frames}><Scene scene={s} index={i} frames={s.frames}/></Sequence>)}<Subs/></AbsoluteFill>;
registerRoot(()=><Composition id="V83GenitalValue" component={Film} durationInFrames={total} fps={fps} width={1920} height={1080}/>);
