import React from 'react';
import {useCurrentFrame,useVideoConfig} from 'remotion';
import {clamp,lerp,smooth,type Shot} from './full-motion';

const line=(x1:number,y1:number,x2:number,y2:number)=>'M'+x1+' '+y1+' L'+x2+' '+y2;
const positions=(count:number,cx:number,cy:number,rad:number)=>Array.from({length:count},(_,i)=>{
 const t=i/count*Math.PI*2-Math.PI/2;return [cx+Math.cos(t)*rad,cy+Math.sin(t)*rad] as const;
});
const Node=({x,y,r=21,fill='#c3cfcc',opacity=1}:{x:number;y:number;r?:number;fill?:string;opacity?:number})=>
 <g opacity={opacity}><circle cx={x} cy={y} r={r+5} fill='rgba(0,0,0,.38)'/>
  <circle cx={x} cy={y} r={r} fill={fill} stroke='#e3e9e8' strokeWidth={2.5}/></g>;
const PersonIcon=({x,y,fill='#c3cfcc',scale=1}:{x:number;y:number;fill?:string;scale?:number})=>
 <g transform={'translate('+x+' '+y+') scale('+scale+')'} fill={fill}>
  <circle cy={-37} r={15}/><path d='M-23 -12 Q0 -24 23 -12 L32 46 H-32Z'/>
 </g>;

const SocialGraph=({shot,p}:{shot:Shot;p:number})=>{
 const dependency=shot.template==='DEPENDENCY_GRAPH';
 const choice=shot.template==='CHOICE_PATH';
 const nodes=dependency?[[520,520],[955,270],[955,440],[955,610],[1370,460]]:
   choice?[[490,470],[1020,260],[1020,680],[1515,260],[1515,680]]:
   [[420,470],[770,225],[880,510],[1180,310],[1470,520],[1130,745],[600,735]];
 const center=nodes[0],pulse=.65+.15*Math.sin(p*15);
 const links=dependency?[[0,1],[0,2],[0,3],[1,4],[2,4],[3,4]]:
   choice?[[0,1],[0,2],[1,3],[2,4]]:
   [[0,1],[0,2],[0,6],[1,3],[2,3],[2,5],[3,4],[4,5],[5,6]];
 return <svg viewBox='0 0 1920 1080' style={{position:'absolute',inset:0,width:'100%',height:'100%'}}>
  <rect x={115} y={100} width={1690} height={780} rx={34} fill='#111a26' fillOpacity={.77}
   stroke='#9aabb7' strokeOpacity={.32} strokeWidth={2}/>
  {links.map(([a,b],i)=>{
   const from=nodes[a],to=nodes[b],opacity=clamp((p-i*.065)/.28);
   return <path key={i} d={line(from[0],from[1],to[0],to[1])} fill='none'
    stroke={choice&&a===0&&b===2?'#c26c74':'#d9dcce'} strokeWidth={dependency?5:4}
    opacity={opacity*.75} strokeDasharray={dependency?'14 7':'none'}/>;
  })}
  {nodes.map(([x,y],i)=><Node key={i} x={x} y={y} r={i===0?34:26}
   fill={choice&&i===2?'#bd7882':dependency&&i>0&&i<4?'#d6ba91':i%3===0?'#cfb9ac':'#a8c5b9'}
   opacity={clamp((p-i*.06)/.18)*pulse}/>)}
  {dependency&&[1,2,3].map((i)=><g key={i} opacity={clamp((p-i*.12)/.3)}>
   {i===1?<path d='M916 231 H994 M916 250 H994' stroke='#f3ead8' strokeWidth={7}/>:
    i===2?<rect x={934} y={419} width={40} height={30} rx={8} fill='#f3ead8'/>:
    <path d='M937 594 H975 V627 H937Z' fill='#f3ead8'/>}</g>)}
  {choice&&<><PersonIcon x={center[0]} y={center[1]-56} fill='#f2dfc5' scale={.72}/>
   <path d='M1020 245 L1020 205 M1020 665 L1020 626' stroke='#faf8ed' strokeWidth={4}/></>}
 </svg>;
};

const Crowd=({p,shot}:{p:number;shot:Shot})=>{
 const count=shot.shotId==='C03-02'?38:shot.narrationCue.includes('49人')?49:shot.narrationCue.includes('138人')?138:38;
 const cols=count>100?16:count>40?9:8,rows=Math.ceil(count/cols);
 return <svg viewBox='0 0 1920 1080' style={{position:'absolute',inset:0,width:'100%',height:'100%'}}>
  <rect x={205} y={130} width={1510} height={730} rx={30} fill='#132133' fillOpacity={.85}/>
  {Array.from({length:count},(_,i)=>{
   const w=cols===16?77:cols===9?125:150;
   const x=310+i%cols*w,y=210+Math.floor(i/cols)*(rows>6?70:108);
   return <PersonIcon key={i} x={x} y={y+40} scale={count>100?.49:count>40?.65:.82}
       fill={p>i/count*.85?'#c9d6d3':'#465664'}/>;
  })}
 </svg>;
};
const Dual=({p,shot}:{p:number;shot:Shot})=><svg viewBox='0 0 1920 1080'
 style={{position:'absolute',inset:0,width:'100%',height:'100%'}}>
 <path d='M962 145 V870' stroke='#e6dfce' strokeWidth={4} opacity={.65}/>
 <rect x={145} y={155} width={725} height={690} rx={26} fill='#172d35' fillOpacity={.80}/>
 <rect x={1050} y={155} width={725} height={690} rx={26} fill='#372a2e' fillOpacity={.80}/>
 <PersonIcon x={500} y={420} scale={3.1} fill='#a8cfba'/>
 <PersonIcon x={1410} y={420} scale={3.1} fill='#d4a6a3'/>
 <path d='M550 700 H780 M1140 700 H1370' stroke='#d9e4da' strokeWidth={10}
 strokeLinecap='round' strokeDasharray='20 15'
 opacity={smooth(p)}/>
 </svg>;
const MapToVancouver=({p}:{p:number})=>{
 const t=smooth(p),from=[570,500],to=[1290,455];
 return <svg viewBox='0 0 1920 1080' style={{position:'absolute',inset:0,width:'100%',height:'100%'}}>
 <rect x={200} y={125} width={1510} height={760} rx={36} fill='#111f30' fillOpacity={.89}/>
 <path d='M470 230 Q740 140 890 330 T1390 360 Q1510 600 1280 760 T720 790 Q420 690 470 230Z'
  fill='#2d4b59' opacity={.64} stroke='#7b9a9e' strokeWidth={3}/>
 <path d='M600 450 Q900 250 1280 460' stroke='#d4dacd' strokeWidth={6}
 strokeDasharray='18 15' fill='none' opacity={t}/>
 <circle cx={from[0]} cy={from[1]} r={18} fill='#e6d7b4'/>
 <circle cx={to[0]} cy={to[1]} r={18} fill='#b8d8e2'/>
 <circle cx={lerp(from[0],to[0],t)} cy={lerp(from[1],to[1],t)-Math.sin(Math.PI*t)*120}
 r={12} fill='#f3e8c9' stroke='#ffffff' strokeWidth={3}/>
 <text x={470} y={575} fontFamily='Noto Sans JP,sans-serif' fontSize={54} fill='#e1ebe3'>日本</text>
 <text x={1200} y={550} fontFamily='Noto Sans JP,sans-serif' fontSize={54} fill='#e1ebe3'>カナダ</text>
 </svg>;
};
const countMap:Record<string,number>={'C03-02':38,'C10-01':49,'C18-03':138,'C30-01':80};
const DataSilhouettes=({shot,p}:{shot:Shot;p:number})=>{
 const count=countMap[shot.shotId];
 if(!count)return null;
 const cols=count>=100?15:count>=80?12:count>40?9:8;
 return <svg viewBox='0 0 1920 1080' style={{position:'absolute',inset:0,width:'100%',height:'100%'}}>
 <rect x={1025} y={145} width={755} height={625} rx={26} fill='#112033' fillOpacity={.82}/>
 {Array.from({length:count},(_,i)=><circle key={i}
  cx={1090+(i%cols)*Math.floor(595/cols)} cy={210+Math.floor(i/cols)*(count>=100?55:count>=80?70:87)}
  r={count>=100?10:count>=80?12:16}
  fill={i/count<=p?'#b5d0c7':'#4c606c'} opacity={.9}/>)}
 </svg>;
};

export const ConceptVisual=({shot,p}:{shot:Shot;p:number})=>{
 if(shot.camera==='map_to_city'||shot.camera==='map_to_street'||shot.camera==='map_to_building')
  return <MapToVancouver p={p}/>;
 if(shot.template==='CROWD_GRID')return <Crowd shot={shot} p={p}/>;
 if(shot.template==='SOCIAL_GRAPH'||shot.template==='DEPENDENCY_GRAPH'||shot.template==='CHOICE_PATH')
  return <SocialGraph shot={shot} p={p}/>;
 if(shot.template==='DUAL_COMPARE')return <Dual shot={shot} p={p}/>;
 if(shot.shotId in countMap)return <DataSilhouettes shot={shot} p={p}/>;
 return null;
};

export const Rain=({p,seed=1}:{p:number;seed?:number})=>{
 const frame=useCurrentFrame(),{fps}=useVideoConfig();
 const droplets=Array.from({length:124},(_,i)=>{
  const layer=i%3;
  const x=(i*131+seed*43)%1920;
  const y=((i*291+frame*(layer+1)*14)%1320)-180;
  return {x,y,layer};
 });
 return <svg viewBox='0 0 1920 1080' style={{position:'absolute',inset:0,width:'100%',height:'100%',
 pointerEvents:'none'}} aria-label='Reactによる雨の前景レイヤー'>
  <rect width={1920} height={1080} fill='#0e1b29' opacity={.20}/>
  {droplets.map(({x,y,layer},i)=><path key={i}
   d={'M'+x+' '+y+' l'+(6+layer*3)+' '+(30+layer*13)}
   stroke='#cbddea' strokeWidth={layer===2?2.2:layer===1?1.5:.8}
   strokeLinecap='round' opacity={layer===2?.43:layer===1?.28:.16}/>)}
 </svg>;
};
