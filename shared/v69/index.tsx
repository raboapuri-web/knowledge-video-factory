import React from 'react';
import {AbsoluteFill,Composition,interpolate,registerRoot,useCurrentFrame,useVideoConfig} from 'remotion';
import scriptData from './script-data.json';
import sync from './sync-timing.json';
import {SceneVisual} from './scenes';
import assetPlan from './asset-plan.json';
import {PartOverlay, type AssetSelection} from '../../shared/asset-library/remotion';
import {OfficeWorkerRigPreview} from '../../shared/remotion-templates/office-worker-rig';

type Beat={id:string;visual:string;narration:string;phase:string;variant:number;shotKind:string;bgGroup:string;bgSeed:number};
type SyncBeat={index:number;start:number;end:number};
const beats=scriptData.beats as Beat[];
const font='Noto Sans JP, sans-serif';
const clamp=(v:number)=>Math.max(0,Math.min(1,v));

const splitSubtitle=(text:string)=>{
  const sentences=(text.match(/[^。！？]+[。！？]?/g)??[text]).map(v=>v.trim()).filter(Boolean);
  const out:string[]=[];
  for(const s of sentences){
    if(s.length<=27){out.push(s);continue;}
    const parts=s.split(/(?<=[、，])/).map(v=>v.trim()).filter(Boolean);
    let buf='';
    for(const part of parts){if((buf+part).length>27&&buf){out.push(buf);buf=part}else buf+=part;}
    if(buf)out.push(buf);
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
  let acc=0,k=0;
  for(let i=0;i<chunks.length;i++){acc+=weights[i];if(target<acc){k=i;break;}}
  const opacity=interpolate(progress,[0,.025,.95,1],[0,1,1,.2],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  return <div style={{position:'absolute',left:90,right:90,bottom:24,display:'flex',justifyContent:'center',opacity,pointerEvents:'none'}}>
    <div style={{maxWidth:1540,padding:'10px 25px 12px',borderRadius:14,background:'rgba(0,0,0,.66)',fontFamily:font,fontWeight:780,fontSize:30,lineHeight:1.4,textAlign:'center',color:'#f8f6ef',textShadow:'0 2px 12px rgba(0,0,0,.98)',boxShadow:'0 8px 30px rgba(0,0,0,.30)'}}>{chunks[k]??chunks[chunks.length-1]}</div>
  </div>;
};

const V69=()=>{
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const a=activeAt(frame/fps);
  const beat=beats[a.index]??beats[0];
  
  return <AbsoluteFill style={{background:'#020306',fontFamily:font}}>
    <AbsoluteFill><SceneVisual n={a.index+1} progress={a.progress}/>
      {<PartOverlay selection={(assetPlan.scenes as Record<string,AssetSelection>)[beat.id]} progress={a.progress}/>}</AbsoluteFill>
    <Subtitle beat={beat} progress={a.progress}/>
  </AbsoluteFill>;
};

const ScenePreview=()=>{const frame=useCurrentFrame();const n=Math.min(beats.length,Math.floor(frame/20)+1);const p=(frame%20)/20;const sel=(assetPlan.scenes as Record<string,AssetSelection>)[beats[n-1].id];return <AbsoluteFill style={{background:'#03070c'}}><SceneVisual n={n} progress={p}/>{<PartOverlay selection={sel} progress={p}/>}</AbsoluteFill>;};

const Root=()=>{
  const duration=Math.max(30,Math.ceil(Number(sync.durationSeconds||1700)*30));
  return <><Composition id='V69FreeServices' component={V69} durationInFrames={duration} fps={30} width={1920} height={1080}/><Composition id='V69ScenePreview' component={ScenePreview} durationInFrames={beats.length*20} fps={30} width={1920} height={1080}/><Composition id='OfficeWorkerRigPreview' component={OfficeWorkerRigPreview} durationInFrames={240} fps={30} width={1920} height={1080}/></>;
};
registerRoot(Root);
