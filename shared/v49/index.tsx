import React from 'react';
import {AbsoluteFill,Composition,interpolate,registerRoot,useCurrentFrame,useVideoConfig} from 'remotion';
import scriptData from './script-data.json';
import sync from './sync-timing.json';
import {SceneVisual} from './scenes';

type Beat={id:string;visual:string;narration:string;phase?:string;variant?:number};
type SyncBeat={index:number;start:number;end:number};
const beats=scriptData.beats as Beat[];
const clamp=(v:number)=>Math.max(0,Math.min(1,v));
const font='Noto Sans JP, sans-serif';

const splitSubtitle=(text:string)=>{
  const s=(text.match(/[^。！？]+[。！？]?/g)??[text]).map(v=>v.trim()).filter(Boolean);
  const out:string[]=[];
  for(const q of s){
    if(q.length<=26){out.push(q);continue;}
    const parts=q.split(/(?<=[、，])/).map(v=>v.trim()).filter(Boolean);
    let b='';
    for(const p of parts){if((b+p).length>26&&b){out.push(b);b=p}else b+=p}
    if(b)out.push(b);
  }
  return out.length?out:[text];
};

const activeAt=(sec:number)=>{
  const arr=(sync.beats||[]) as SyncBeat[];
  if(!arr.length)return {index:0,progress:0};
  let i=arr.findIndex(b=>sec>=b.start&&sec<b.end);
  if(i<0)i=arr.length-1;
  const b=arr[i];
  return {index:i,progress:clamp((sec-b.start)/Math.max(.001,b.end-b.start))};
};

const Subtitle=({beat,progress}:{beat:Beat;progress:number})=>{
  const chunks=splitSubtitle(beat.narration);
  const weights=chunks.map(x=>Math.max(1,x.length));
  const total=weights.reduce((a,b)=>a+b,0);
  const target=progress*total;
  let sum=0,k=0;
  for(let i=0;i<chunks.length;i++){sum+=weights[i];if(target<sum){k=i;break}}
  return <div style={{position:'absolute',left:140,right:140,bottom:26,display:'flex',justifyContent:'center',pointerEvents:'none'}}>
    <div style={{maxWidth:1460,padding:'8px 22px 10px',borderRadius:12,background:'rgba(0,0,0,.56)',fontFamily:font,fontWeight:700,fontSize:28,lineHeight:1.35,textAlign:'center',color:'#f5f3ee',textShadow:'0 2px 10px rgba(0,0,0,.96)'}}>{chunks[k]??chunks[chunks.length-1]}</div>
  </div>;
};

const V49=()=>{
  const f=useCurrentFrame(),{fps}=useVideoConfig(),a=activeAt(f/fps),beat=beats[a.index]??beats[0],n=a.index+1;
  const fade=interpolate(a.progress,[0,.025],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  return <AbsoluteFill style={{background:'#020305'}}><AbsoluteFill style={{opacity:fade}}><SceneVisual n={n} progress={a.progress}/></AbsoluteFill><Subtitle beat={beat} progress={a.progress}/></AbsoluteFill>;
};

const Root=()=>{
  const d=Math.max(30,Math.ceil(Number(sync.durationSeconds||840)*30));
  return <Composition id='V49Friends' component={V49} durationInFrames={d} fps={30} width={1920} height={1080}/>;
};
registerRoot(Root);
