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
    if(q.length<=32){out.push(q);continue;}
    const parts=q.split(/(?<=[、，])/).map(v=>v.trim()).filter(Boolean);
    let b='';
    for(const p of parts){if((b+p).length>32&&b){out.push(b);b=p}else b+=p}
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
  const c=splitSubtitle(beat.narration),l=c.map(x=>Math.max(1,x.length)),tot=l.reduce((a,b)=>a+b,0),tar=progress*tot;
  let a=0,k=0;
  for(let i=0;i<c.length;i++){a+=l[i];if(tar<a){k=i;break}}
  return <div style={{position:'absolute',left:88,right:88,bottom:34,display:'flex',justifyContent:'center'}}>
    <div style={{maxWidth:1690,padding:'14px 34px 17px',borderRadius:16,background:'rgba(2,4,7,.88)',border:'1px solid rgba(240,244,250,.14)',boxShadow:'0 16px 50px rgba(0,0,0,.58)',fontFamily:font,fontWeight:850,fontSize:36,lineHeight:1.42,textAlign:'center',color:'#f5f4ef',textShadow:'0 3px 14px rgba(0,0,0,.95)'}}>{c[k]??c[c.length-1]}</div>
  </div>;
};

const V48=()=>{
  const f=useCurrentFrame(),{fps}=useVideoConfig(),a=activeAt(f/fps),beat=beats[a.index]??beats[0],n=a.index+1;
  const fade=interpolate(a.progress,[0,.028],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  return <AbsoluteFill style={{background:'#020305'}}><AbsoluteFill style={{opacity:fade}}><SceneVisual n={n} progress={a.progress}/></AbsoluteFill><Subtitle beat={beat} progress={a.progress}/></AbsoluteFill>;
};

const Root=()=>{
  const d=Math.max(30,Math.ceil(Number(sync.durationSeconds||760)*30));
  return <Composition id='V48TokyoEnvy' component={V48} durationInFrames={d} fps={30} width={1920} height={1080}/>;
};
registerRoot(Root);
