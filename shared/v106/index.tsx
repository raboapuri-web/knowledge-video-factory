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
 const sentences=(text.match(/[^。！？]+[。！？]?/g)??[text]).map(x=>x.trim()).filter(Boolean);
 const out:string[]=[];
 for(const sentence of sentences){
  if(sentence.length<=29){out.push(sentence);continue;}
  const parts=sentence.split(/(?<=[、，])/).map(x=>x.trim()).filter(Boolean);
  let cur='';
  for(const part of parts){if(cur&&(cur+part).length>29){out.push(cur);cur=part;}else cur+=part;}
  if(cur)out.push(cur);
 }
 return out.length?out:[text];
};
const activeAt=(sec:number)=>{
 const arr=(sync.beats??[]) as Timed[];
 if(!arr.length)return {index:0,progress:0};
 let lo=0,hi=arr.length-1;
 while(lo<=hi){const mid=(lo+hi)>>1;if(sec<arr[mid].start)hi=mid-1;else if(sec>=arr[mid].end)lo=mid+1;else return {index:mid,progress:clamp((sec-arr[mid].start)/Math.max(.001,arr[mid].end-arr[mid].start))};}
 const last=arr.length-1;return {index:last,progress:1};
};
const Subtitle=({beat,progress}:{beat:Beat;progress:number})=>{
 const chunks=splitText(beat.narration),weights=chunks.map(x=>x.length),total=weights.reduce((a,b)=>a+b,0),target=progress*total;
 let acc=0,chosen=chunks.length-1;
 for(let i=0;i<chunks.length;i++){acc+=weights[i];if(target<acc){chosen=i;break;}}
 const opacity=interpolate(progress,[0,.025,.96,1],[0,1,1,.25],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
 return <div style={{position:'absolute',left:78,right:78,bottom:24,display:'flex',justifyContent:'center',pointerEvents:'none',opacity}}><div style={{maxWidth:1550,padding:'9px 21px',borderRadius:11,background:'rgba(0,0,0,.60)',color:'#f5f3ed',fontFamily:'Noto Sans JP,sans-serif',fontWeight:750,fontSize:31,lineHeight:1.43,textAlign:'center',textShadow:'0 2px 11px #000'}}>{chunks[chosen]}</div></div>;
};
const Production=()=>{
 const f=useCurrentFrame(),{fps}=useVideoConfig(),active=activeAt(f/fps),beat=beats[active.index]??beats[0];
 return <AbsoluteFill style={{background:'#090e15'}}><SceneVisual n={active.index+1} progress={active.progress}/><Subtitle beat={beat} progress={active.progress}/></AbsoluteFill>;
};
const Preview=()=>{const f=useCurrentFrame();return <AbsoluteFill style={{background:'#090e15'}}><SceneVisual n={Math.min(beats.length,Math.floor(f/20)+1)} progress={(f%20)/20}/></AbsoluteFill>;};
const Root=()=> <><Composition id="V106SwissNeutralityOriginalScenes" component={Production} fps={30} width={1920} height={1080} durationInFrames={Math.max(30,Math.ceil(Number(sync.durationSeconds||1390)*30))}/><Composition id="V106ScenePreview" component={Preview} fps={30} width={1920} height={1080} durationInFrames={beats.length*20}/></>;
registerRoot(Root);
