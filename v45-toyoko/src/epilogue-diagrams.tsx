import React from 'react';
import {AbsoluteFill,useCurrentFrame,useVideoConfig} from 'remotion';
const BG='#0c1624',W='#edf1ee',M='#9bb3b8',T='#83c7c4',G='#e4c98f',R='#d28f95';
const tx=(x:number,y:number,s:string,n=48,c=W)=><text x={x} y={y} fill={c} fontSize={n} fontWeight={700} textAnchor="middle" dominantBaseline="middle" fontFamily="Noto Sans JP,sans-serif">{s}</text>;
const line=(x1:number,y1:number,x2:number,y2:number,c=T,w=6)=><line x1={x1} y1={y1} x2={x2} y2={y2} stroke={c} strokeWidth={w} strokeLinecap="round"/>;
const human=(x:number,y:number,c=T,s=1)=><g transform={'translate('+x+' '+y+') scale('+s+')'} fill={c}><circle cy={-35} r={18}/><path d="M-30 -7 Q0 -27 30 -7 L36 58 H-36Z"/></g>;
export const EpilogueDiagram=({id}:{id:string})=>{const f=useCurrentFrame(),{fps}=useVideoConfig(),p=Math.min(1,(f+1)/(fps*2.3));let body:React.ReactNode;
 if(id==='DG_VIEW_CHANGED')body=<g>
  <rect x={160} y={230} width={650} height={500} rx={28} fill="#182534" stroke={R} strokeWidth={5}/>
  <rect x={1110} y={230} width={650} height={500} rx={28} fill="#182534" stroke={T} strokeWidth={5}/>
  {tx(485,335,'最初の見え方',50,M)}{tx(1435,335,'今、見えている構造',50,M)}
  {tx(485,490,'安全  vs  危険',68,R)}
  {human(1300,515,G,1.1)}{human(1535,515,T,1.1)}{line(1330,570,1505,570,T,7)}
  {tx(1435,685,'安全・人間関係・自分で選ぶ生活',38,W)}
 </g>;
 else if(id==='DG_SAFETY_BELONGING')body=<g>
  <circle cx={760} cy={500} r={250} fill={T} opacity={.16+.08*p} stroke={T} strokeWidth={7}/>
  <circle cx={1160} cy={500} r={250} fill={G} opacity={.16+.08*p} stroke={G} strokeWidth={7}/>
  {tx(620,500,'安全',70,T)}{tx(1300,500,'人間関係',64,G)}
  {tx(960,475,'両立',62,W)}{tx(960,550,'できる生活',42,W)}
  {tx(960,835,'本来、対立する必要はない',48,M)}
 </g>;
 else if(id==='DG_MOVE_IS_NOT_SOLVE')body=<g>
  {human(390,415,G,1.35)}{line(505,480,890,480,M,8)}{human(1010,415,T,1.35)}
  {tx(700,390,'場所を移す',44,M)}
  <rect x={1180} y={265} width={560} height={455} rx={30} fill="#182534" stroke={T} strokeWidth={5}/>
  {tx(1460,355,'必要なのは',48,M)}
  {tx(1460,465,'帰れる場所',64,T)}{tx(1460,555,'続けられる生活',58,G)}
  {line(1010,590,1180,590,R,6)}
  {tx(960,835,'移動だけでは、生活上の問題は消えない',49,W)}
 </g>;
 else throw Error('Unknown epilogue diagram '+id);
 return <AbsoluteFill style={{background:BG}}><svg viewBox="0 0 1920 1080" style={{width:'100%',height:'100%'}}><rect width="1920" height="1080" fill={BG}/>{body}</svg></AbsoluteFill>;
};