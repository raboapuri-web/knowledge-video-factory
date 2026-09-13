import React from 'react';
import {AbsoluteFill,useCurrentFrame} from 'remotion';
import {RichScene as BaseRichScene,type Beat} from './scenes';

const font='"Noto Sans CJK JP",sans-serif';
const C={paper:'#f2eee5',muted:'#a2a7ad',cyan:'#75c7c8',pink:'#c989a3',amber:'#d8ac64',blue:'#7ba4c5',red:'#bd625d'};

const MiniFace=({color}:{color:string})=> <div style={{position:'relative',width:92,height:92,borderRadius:'50%',background:`radial-gradient(circle at 42% 34%,${color},#11151a 74%)`,border:`4px solid ${color}88`,boxShadow:`0 0 20px ${color}44`,margin:'0 auto 10px'}}><div style={{position:'absolute',left:25,top:34,width:11,height:7,borderRadius:10,background:'#05070a'}}/><div style={{position:'absolute',right:25,top:34,width:11,height:7,borderRadius:10,background:'#05070a'}}/><div style={{position:'absolute',left:31,top:59,width:30,height:12,borderBottom:`4px solid ${C.paper}`,borderRadius:'0 0 40px 40px'}}/></div>;

const DatingGridFixed=({beat}:{beat:Beat})=>{const f=useCurrentFrame();const second=beat.id==='b20';return <AbsoluteFill style={{background:'linear-gradient(145deg,#160a10,#2c1822 55%,#040304)',color:C.paper,fontFamily:font,overflow:'hidden'}}><div style={{position:'absolute',left:105,top:70,right:105,fontSize:50,fontWeight:950,textShadow:'0 5px 26px rgba(0,0,0,.78)'}}>{second?'顔面格差が縮むと、別の格差が流れ込む':'恋愛は「顔だけ」の市場ではない'}</div><div style={{position:'absolute',left:170,right:170,top:210,bottom:150,display:'grid',gridTemplateColumns:'repeat(6,1fr)',gridTemplateRows:'repeat(3,1fr)',gap:18}}>{Array.from({length:18},(_,i)=>{const color=i%2?C.pink:C.cyan;const pulse=.96+.04*Math.sin((f+i*8)/22);return <div key={i} style={{position:'relative',borderRadius:26,border:`2px solid ${color}55`,background:'rgba(5,8,12,.72)',padding:'14px 12px',transform:`scale(${pulse})`,boxShadow:'0 14px 35px rgba(0,0,0,.22)'}}><MiniFace color={color}/><div style={{fontSize:19,fontWeight:850,lineHeight:1.4,textAlign:'center',color:C.muted}}>容姿 90<br/><span style={{color:C.blue}}>学歴 {60+i}</span><br/><span style={{color:C.amber}}>年収 {400+i*45}万</span></div></div>})}</div><div style={{position:'absolute',left:600,right:600,bottom:55,textAlign:'center',fontSize:30,fontWeight:950,color:second?C.red:C.paper}}>{second?'容姿が横並びになると、他の属性が順位を作る':'複数の条件でマッチングされる'}</div></AbsoluteFill>};

export const RichSceneV33=({beat}:{beat:Beat})=>beat.visual==='dating_grid'?<DatingGridFixed beat={beat}/>:<BaseRichScene beat={beat}/>;
export type {Beat};
