import React from 'react';
import {AbsoluteFill,Composition,interpolate,registerRoot,useCurrentFrame,useVideoConfig} from 'remotion';
import story from './script-data.json';
import timing from './sync-timing.json';
import {SceneVisual} from './scenes';

type Beat={id:string;phase:string;visual:string;narration:string;bgGroup:string;bgSeed:number;foreground:string;variant:number;shotKind:string};
type Sync={id:string;index:number;start:number;end:number};
const beats=story.beats as Beat[];
const sync=(timing.beats??[]) as Sync[];
const clamp=(v:number)=>Math.min(1,Math.max(0,v));
const split=(s:string)=>{
 const parts=s.split(/(?<=[、，])/).map(x=>x.trim()).filter(Boolean);
 const out:string[]=[];let line='';
 for(const x of parts){if(line.length+x.length>30&&line){out.push(line);line=x;}else line+=x;}
 if(line)out.push(line);
 return out.length?out:[s];
};
const at=(sec:number)=>{
 if(sync.length!==beats.length)return {index:0,progress:0};
 let lo=0,hi=sync.length-1;
 while(lo<hi){const mid=(lo+hi)>>1;if(sync[mid].end<=sec)lo=mid+1;else hi=mid;}
 const b=sync[lo];return {index:lo,progress:clamp((sec-b.start)/Math.max(.001,b.end-b.start))};
};
const Subtitle=({text,progress}:{text:string;progress:number})=>{
 const chunks=split(text),weights=chunks.map(x=>x.length),total=weights.reduce((a,b)=>a+b,0);
 let acc=0,k=chunks.length-1;
 for(let i=0;i<chunks.length;i++){acc+=weights[i];if(progress*total<acc){k=i;break;}}
 const opacity=interpolate(progress,[0,.04,.95,1],[.15,1,1,.55],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
 return <div style={{position:'absolute',bottom:30,left:72,right:72,display:'flex',justifyContent:'center',pointerEvents:'none',opacity}}>
  <div style={{padding:'12px 28px',maxWidth:1540,fontFamily:'Noto Sans JP,sans-serif',fontSize:31,fontWeight:800,lineHeight:1.42,textAlign:'center',background:'rgba(5,10,18,.8)',color:'#fbf6ed',borderRadius:10,textShadow:'0 2px 7px #000'}}>{chunks[k]}</div>
 </div>;
};
const Film=()=>{const f=useCurrentFrame(),{fps}=useVideoConfig(),a=at(f/fps),b=beats[a.index]??beats[0];return <AbsoluteFill style={{background:'#07111a'}}><SceneVisual beat={b} progress={a.progress}/><Subtitle text={b.narration} progress={a.progress}/></AbsoluteFill>;};
const Preview=()=>{const f=useCurrentFrame(),i=Math.min(beats.length-1,Math.floor(f/24));return <AbsoluteFill><SceneVisual beat={beats[i]} progress={(f%24)/24}/></AbsoluteFill>;};
const BackgroundPreview=()=>{const f=useCurrentFrame(),i=Math.min(beats.length-1,Math.floor(f/24));return <AbsoluteFill><SceneVisual beat={beats[i]} progress={(f%24)/24} backgroundOnly/></AbsoluteFill>;};
const Root=()=>{const total=Math.max(30,Math.ceil(Number(timing.durationSeconds||1200)*30));return <>
 <Composition id="V84AIExtinction" component={Film} fps={30} durationInFrames={total} width={1920} height={1080}/>
 <Composition id="V84ScenePreview" component={Preview} fps={30} durationInFrames={beats.length*24} width={1920} height={1080}/>
 <Composition id="V84BackgroundPreview" component={BackgroundPreview} fps={30} durationInFrames={beats.length*24} width={1920} height={1080}/>
 </>;};
registerRoot(Root);
