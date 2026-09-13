import React from 'react';
import {AbsoluteFill,interpolate,useCurrentFrame,useVideoConfig} from 'remotion';
import scriptData from './script-data.json';
import {getActiveBeatAtSeconds} from './timing';
import {RichSceneV35,type Beat} from './scenes-v35';

const beats=scriptData.beats as Beat[];
const font='"Noto Sans CJK JP",sans-serif';

const splitSubtitle=(text:string)=>{
  const sentences=(text.match(/[^。！？]+[。！？]?/g)??[text]).map(s=>s.trim()).filter(Boolean);
  const chunks:string[]=[];
  for(const sentence of sentences){
    if(sentence.length<=30){chunks.push(sentence);continue;}
    const parts=sentence.split(/(?<=[、，])/).map(s=>s.trim()).filter(Boolean);
    let buf='';
    for(const part of parts){if((buf+part).length>30&&buf){chunks.push(buf);buf=part;}else buf+=part;}
    if(buf)chunks.push(buf);
  }
  return chunks.length?chunks:[text];
};

const Subtitle=({beat,progress,fade}:{beat:Beat;progress:number;fade:number})=>{
  const chunks=splitSubtitle(beat.narration);
  const lengths=chunks.map(c=>Math.max(1,c.length));
  const total=lengths.reduce((a,b)=>a+b,0);
  const target=Math.max(0,Math.min(total-.001,progress*total));
  let cursor=0,index=0;
  for(let i=0;i<chunks.length;i++){cursor+=lengths[i];if(target<cursor){index=i;break;}}
  const text=chunks[index]??chunks[chunks.length-1];
  return <div style={{position:'absolute',left:100,right:100,bottom:42,opacity:fade,display:'flex',justifyContent:'center',pointerEvents:'none'}}><div style={{maxWidth:1600,padding:'15px 32px 17px',borderRadius:15,background:'rgba(3,5,8,.84)',border:'1px solid rgba(244,239,228,.13)',boxShadow:'0 16px 50px rgba(0,0,0,.52)',fontFamily:font,fontWeight:850,fontSize:38,lineHeight:1.42,textAlign:'center',letterSpacing:.25,color:'#f4efe4',textShadow:'0 3px 14px rgba(0,0,0,.92)'}}>{text}</div></div>;
};

export const V35VillainAttraction:React.FC=()=>{
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const active=getActiveBeatAtSeconds(frame/fps);
  const beat=beats[active.index]??beats[0];
  const prev=beats[Math.max(0,active.index-1)]??beat;
  const changed=active.index===0||prev.visual!==beat.visual;
  const fade=changed?interpolate(active.progress,[0,.055],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'}):1;
  return <AbsoluteFill style={{background:'#020304'}}><AbsoluteFill style={{opacity:fade}}><RichSceneV35 beat={beat}/></AbsoluteFill><Subtitle beat={beat} progress={active.progress} fade={Math.min(1,fade+.24)}/></AbsoluteFill>;
};
