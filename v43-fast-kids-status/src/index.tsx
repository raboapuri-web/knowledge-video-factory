import React from 'react';
import {AbsoluteFill,Composition,interpolate,registerRoot,useCurrentFrame,useVideoConfig} from 'remotion';
import scriptData from './script-data.json';
import sync from './sync-timing.json';
import {SceneVisual} from './scenes';
import {clamp,font} from './visuals';

type Beat={id:string;visual:string;narration:string};
type SyncBeat={index:number;start:number;end:number};
const beats=scriptData.beats as Beat[];

const splitSubtitle=(text:string)=>{const sentences=(text.match(/[^。！？]+[。！？]?/g)??[text]).map(v=>v.trim()).filter(Boolean);const out:string[]=[];for(const sentence of sentences){if(sentence.length<=34){out.push(sentence);continue;}const parts=sentence.split(/(?<=[、，])/).map(v=>v.trim()).filter(Boolean);let buf='';for(const part of parts){if((buf+part).length>34&&buf){out.push(buf);buf=part;}else buf+=part;}if(buf)out.push(buf);}return out.length?out:[text];};
const activeAt=(seconds:number)=>{const arr=(sync.beats||[]) as SyncBeat[];if(!arr.length)return {index:0,progress:0};let idx=arr.findIndex(b=>seconds>=b.start&&seconds<b.end);if(idx<0)idx=arr.length-1;const b=arr[idx];return {index:idx,progress:clamp((seconds-b.start)/Math.max(.001,b.end-b.start))};};
const Subtitle=({beat,progress}:{beat:Beat;progress:number})=>{const chunks=splitSubtitle(beat.narration),lens=chunks.map(c=>Math.max(1,c.length)),total=lens.reduce((a,b)=>a+b,0),target=progress*total;let acc=0,idx=0;for(let i=0;i<chunks.length;i++){acc+=lens[i];if(target<acc){idx=i;break;}}return <div style={{position:'absolute',left:90,right:90,bottom:34,display:'flex',justifyContent:'center'}}><div style={{maxWidth:1680,padding:'14px 34px 17px',borderRadius:16,background:'rgba(2,4,7,.91)',border:'1px solid rgba(240,244,250,.14)',boxShadow:'0 16px 50px rgba(0,0,0,.58)',fontFamily:font,fontWeight:850,fontSize:37,lineHeight:1.42,textAlign:'center',color:'#f5f4ef',textShadow:'0 3px 14px rgba(0,0,0,.95)'}}>{chunks[idx]??chunks[chunks.length-1]}</div></div>};

const V43:React.FC=()=>{const frame=useCurrentFrame(),{fps}=useVideoConfig(),a=activeAt(frame/fps),beat=beats[a.index]??beats[0],n=a.index+1,fade=interpolate(a.progress,[0,.04],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});return <AbsoluteFill style={{background:'#020305'}}><AbsoluteFill style={{opacity:fade}}><SceneVisual n={n}/></AbsoluteFill><Subtitle beat={beat} progress={a.progress}/></AbsoluteFill>};
const Root:React.FC=()=>{const durationInFrames=Math.max(30,Math.ceil(Number(sync.durationSeconds||1080)*30));return <Composition id='V43FastKidsStatus' component={V43} durationInFrames={durationInFrames} fps={30} width={1920} height={1080}/>;};
registerRoot(Root);
