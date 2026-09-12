import React from 'react';
import {AbsoluteFill,interpolate,useCurrentFrame,useVideoConfig} from 'remotion';
import scriptData from './script-data.json';
import {getActiveBeatAtSeconds} from './timing';
import {RichScene,type Beat} from './scenes';

const beats=scriptData.beats as Beat[];
const font='"Noto Sans CJK JP",sans-serif';

const splitSubtitle=(text:string)=>{
  const sentences=(text.match(/[^。！？]+[。！？]?/g)??[text]).map(s=>s.trim()).filter(Boolean);
  const chunks:string[]=[];
  for(const sentence of sentences){
    if(sentence.length<=34){chunks.push(sentence);continue;}
    const parts=sentence.split(/(?<=[、，])/).map(s=>s.trim()).filter(Boolean);
    let buf='';
    for(const part of parts){
      if((buf+part).length>34&&buf){chunks.push(buf);buf=part;}
      else buf+=part;
    }
    if(buf)chunks.push(buf);
  }
  return chunks.length?chunks:[text];
};

const NarrationSubtitle=({beat,progress,fade}:{beat:Beat;progress:number;fade:number})=>{
  const chunks=splitSubtitle(beat.narration);
  const lengths=chunks.map(c=>Math.max(1,c.length));
  const total=lengths.reduce((a,b)=>a+b,0);
  const target=Math.max(0,Math.min(total-.001,progress*total));
  let cursor=0;
  let index=0;
  for(let i=0;i<chunks.length;i++){
    cursor+=lengths[i];
    if(target<cursor){index=i;break;}
  }
  const text=chunks[index]??chunks[chunks.length-1];
  return <div style={{position:'absolute',left:120,right:120,bottom:58,opacity:fade,display:'flex',justifyContent:'center',pointerEvents:'none'}}>
    <div style={{maxWidth:1580,padding:'18px 32px 20px',borderRadius:16,background:'rgba(3,5,7,.76)',border:'1px solid rgba(232,226,211,.14)',boxShadow:'0 14px 46px rgba(0,0,0,.42)',fontFamily:font,fontWeight:800,fontSize:40,lineHeight:1.38,textAlign:'center',letterSpacing:.35,color:'#f0ebdf',textShadow:'0 3px 14px rgba(0,0,0,.82)',whiteSpace:'pre-wrap'}}>{text}</div>
  </div>;
};

export const V29GamblingPoverty:React.FC=()=>{
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const active=getActiveBeatAtSeconds(frame/fps);
  const beat=beats[active.index]??beats[0];
  const prev=beats[Math.max(0,active.index-1)]??beat;
  const changed=active.index===0||prev.visual!==beat.visual;
  const fade=changed?interpolate(active.progress,[0,.1],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'}):1;
  return <AbsoluteFill style={{background:'#040507'}}><AbsoluteFill style={{opacity:fade}}><RichScene beat={beat}/></AbsoluteFill><NarrationSubtitle beat={beat} progress={active.progress} fade={Math.min(1,fade+.18)}/></AbsoluteFill>;
};
