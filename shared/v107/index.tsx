import React from 'react';
import {AbsoluteFill,Composition,interpolate,registerRoot,useCurrentFrame,useVideoConfig} from 'remotion';
import scriptData from './script-data.json';
import sync from './sync-timing.json';
import {SceneVisual} from './scenes';
type Beat={id:string;narration:string};
type Timed={index:number;start:number;end:number};
const beats=scriptData.beats as Beat[];
const clamp=(v:number)=>Math.max(0,Math.min(1,v));
const splitText=(text:string)=>{
 const parts=text.split(/(?<=[、，。！？])/).map(x=>x.trim()).filter(Boolean),out:string[]=[];let cur='';
 for(const part of parts){if(cur&&(cur+part).length>30){out.push(cur);cur=part}else cur+=part}if(cur)out.push(cur);
 return out.length?out:[text];
};
const activeAt=(sec:number)=>{
 const arr=(sync.beats??[]) as Timed[];if(!arr.length)return {index:0,progress:0};
 let lo=0,hi=arr.length-1;
 while(lo<=hi){const mid=(lo+hi)>>1,b=arr[mid];if(sec<b.start)hi=mid-1;else if(sec>=b.end)lo=mid+1;else return {index:mid,progress:clamp((sec-b.start)/Math.max(.001,b.end-b.start))};}
 const last=arr.length-1;return {index:last,progress:1};
};
const Subtitle=({beat,progress}:{beat:Beat;progress:number})=>{
 const chunks=splitText(beat.narration),weights=chunks.map(x=>Math.max(1,x.length)),total=weights.reduce((a,b)=>a+b,0),target=progress*total;let acc=0,k=chunks.length-1;
 for(let i=0;i<chunks.length;i++){acc+=weights[i];if(target<acc){k=i;break}}
 const opacity=interpolate(progress,[0,.02,.96,1],[0,1,1,.25],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
 return <div style={{position:'absolute',left:82,right:82,bottom:25,display:'flex',justifyContent:'center',opacity,pointerEvents:'none'}}><div style={{maxWidth:1570,padding:'10px 24px 12px',borderRadius:12,background:'rgba(0,0,0,.64)',fontFamily:'Noto Sans JP,sans-serif',fontWeight:760,fontSize:31,lineHeight:1.42,textAlign:'center',color:'#f6f1e7',textShadow:'0 2px 12px #000'}}>{chunks[k]}</div></div>;
};
const Full=()=>{const f=useCurrentFrame(),{fps}=useVideoConfig(),a=activeAt(f/fps),beat=beats[a.index]??beats[0];return <AbsoluteFill style={{background:'#09131b'}}><SceneVisual n={a.index+1} progress={a.progress}/><Subtitle beat={beat} progress={a.progress}/></AbsoluteFill>};
const Preview=()=>{const f=useCurrentFrame();return <AbsoluteFill style={{background:'#09131b'}}><SceneVisual n={Math.min(beats.length,Math.floor(f/20)+1)} progress={(f%20)/20}/></AbsoluteFill>};
const Root=()=> <><Composition id="V107ComfortFrictionOriginalScenes" component={Full} fps={30} width={1920} height={1080} durationInFrames={Math.max(30,Math.ceil(Number(sync.durationSeconds||900)*30))}/><Composition id="V107ScenePreview" component={Preview} fps={30} width={1920} height={1080} durationInFrames={beats.length*20}/></>;
registerRoot(Root);