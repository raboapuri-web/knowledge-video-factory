import React from 'react';
import {AbsoluteFill,Composition,interpolate,registerRoot,useCurrentFrame,useVideoConfig} from 'remotion';
import scriptData from './script-data.json';
import sceneData from './scene-data.json';
import sync from './sync-timing.json';
import {SceneVisual} from './scenes';

type Beat={id:string;visual:string;narration:string;phase:string;localIndex:number;variant:number;shotKind:string};
type SyncBeat={index:number;start:number;end:number};
const beats=scriptData.beats as Beat[];
const scenes=sceneData as Beat[];
const clamp=(v:number)=>Math.max(0,Math.min(1,v));
const font='Noto Sans JP, sans-serif';

const splitSubtitle=(text:string)=>{
  const s=(text.match(/[^。！？]+[。！？]?/g)??[text]).map(v=>v.trim()).filter(Boolean);
  const out:string[]=[];
  for(const q of s){
    if(q.length<=25){out.push(q);continue;}
    const parts=q.split(/(?<=[、，])/).map(v=>v.trim()).filter(Boolean);
    let b='';
    for(const p of parts){if((b+p).length>25&&b){out.push(b);b=p}else b+=p}
    if(b)out.push(b);
  }
  return out.length?out:[text];
};

const activeAt=(sec:number)=>{
  const arr=(sync.beats||[]) as SyncBeat[];
  if(!arr.length)return {index:0,progress:0,phaseProgress:0};
  let i=arr.findIndex(b=>sec>=b.start&&sec<b.end);
  if(i<0)i=arr.length-1;
  const b=arr[i];
  const progress=clamp((sec-b.start)/Math.max(.001,b.end-b.start));
  const phase=beats[i]?.phase;
  let s=i,e=i;
  while(s>0&&beats[s-1]?.phase===phase)s--;
  while(e<arr.length-1&&beats[e+1]?.phase===phase)e++;
  const phaseStart=arr[s]?.start??b.start;
  const phaseEnd=arr[e]?.end??b.end;
  return {index:i,progress,phaseProgress:clamp((sec-phaseStart)/Math.max(.001,phaseEnd-phaseStart))};
};

const Subtitle=({beat,progress}:{beat:Beat;progress:number})=>{
  const chunks=splitSubtitle(beat.narration);
  const weights=chunks.map(x=>Math.max(1,x.length));
  const total=weights.reduce((a,b)=>a+b,0);
  const target=progress*total;
  let sum=0,k=0;
  for(let i=0;i<chunks.length;i++){sum+=weights[i];if(target<sum){k=i;break}}
  return <div style={{position:'absolute',left:150,right:150,bottom:22,display:'flex',justifyContent:'center',pointerEvents:'none'}}>
    <div style={{maxWidth:1460,padding:'8px 22px 10px',borderRadius:11,background:'rgba(0,0,0,.56)',fontFamily:font,fontWeight:700,fontSize:28,lineHeight:1.36,textAlign:'center',color:'#f7f5ef',textShadow:'0 2px 10px rgba(0,0,0,.96)'}}>{chunks[k]??chunks[chunks.length-1]}</div>
  </div>;
};

const V58=()=>{
  const f=useCurrentFrame();
  const {fps}=useVideoConfig();
  const a=activeAt(f/fps);
  const beat=beats[a.index]??beats[0];
  const scene=scenes[a.index]??scenes[0];
  const startsPhase=a.index===0||beats[a.index-1]?.phase!==beat.phase;
  const fade=startsPhase?interpolate(a.progress,[0,.035],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'}):1;
  return <AbsoluteFill style={{background:'#020305'}}>
    <AbsoluteFill style={{opacity:fade}}><SceneVisual meta={scene} beatProgress={a.progress} phaseProgress={a.phaseProgress}/></AbsoluteFill>
    <Subtitle beat={beat} progress={a.progress}/>
  </AbsoluteFill>;
};

const Root=()=>{
  const d=Math.max(30,Math.ceil(Number(sync.durationSeconds||1100)*30));
  return <Composition id='V58HaikeiHighschool' component={V58} durationInFrames={d} fps={30} width={1920} height={1080}/>;
};
registerRoot(Root);
