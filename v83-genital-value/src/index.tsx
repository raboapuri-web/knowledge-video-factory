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
const Scene=({scene,index,frames}:{scene:any,index:number,frames:number})=>{
 const f=useCurrentFrame(),{fps}=useVideoConfig(),t=f/fps;
 const a=Math.min(1,f/12,(frames-f)/12);const opacity=Math.max(.05,a);
 const bg=scene.asset.endsWith('.png')?staticFile('assets/'+scene.asset):null;
 const isHuman=['bathroom','apartment','cafe','train','clinic','interview','changing'].includes(scene.location);
 const variant=scene.location==='bathroom'?<Mirror idx={index} t={t}/>:scene.location==='research'||scene.location==='projection'||scene.location==='primate'?<Research idx={index} t={t}/>:scene.location==='street'||scene.location==='train'?<Street idx={index} t={t}/>:<Cards idx={index} t={t}/>;
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
const Subs=()=>{
 const f=useCurrentFrame(),idx=beats.findIndex(b=>f>=b.start&&f<b.start+b.frames);
 if(idx<0)return null;
 const b=beats[idx],rel=(f-b.start)/b.frames;
 const chunks=(b.narration.match(/.{1,33}(?:[、。！？]|$)/gu)||[b.narration]).flatMap(s=>s.length>38?[s.slice(0,34),s.slice(34)]:[s]);
 const chunk=chunks[Math.min(chunks.length-1,Math.floor(rel*chunks.length))];
 return <AbsoluteFill style={{justifyContent:'flex-end',alignItems:'center',paddingBottom:32,pointerEvents:'none'}}><div style={{maxWidth:1680,padding:'12px 30px',borderRadius:12,background:'rgba(2,5,9,.88)',color:'#f6f5f0',fontFamily:'Noto Sans CJK JP,sans-serif',fontSize:42,fontWeight:700,textAlign:'center',lineHeight:1.4,textShadow:'0 3px 8px #000'}}>{chunk}</div></AbsoluteFill>;
};
const Film=()=><AbsoluteFill style={{background:'#090e13'}}><Audio src={staticFile('audio/narration.m4a')}/>{beats.map((s,i)=><Sequence key={s.id} from={s.start} durationInFrames={s.frames}><Scene scene={s} index={i} frames={s.frames}/></Sequence>)}<Subs/></AbsoluteFill>;
registerRoot(()=><Composition id="V83GenitalValue" component={Film} durationInFrames={total} fps={fps} width={1920} height={1080}/>);
