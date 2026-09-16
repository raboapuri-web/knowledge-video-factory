import React from 'react';
import {AbsoluteFill,Composition,interpolate,registerRoot,useCurrentFrame,useVideoConfig} from 'remotion';
import scriptData from './script-data.json';
import sync from './sync-timing.json';
import {SceneVisual} from './scenes';

type Beat={id:string;visual:string;narration:string;phase:string;variant:number;shotKind:string};
type SyncBeat={index:number;start:number;end:number};
const beats=scriptData.beats as Beat[];
const clamp=(v:number)=>Math.max(0,Math.min(1,v));
const font='Noto Sans JP, sans-serif';

const splitSubtitle=(text:string)=>{
  const sentences=(text.match(/[^。！？]+[。！？]?/g)??[text]).map(v=>v.trim()).filter(Boolean);
  const out:string[]=[];
  for(const s of sentences){
    if(s.length<=27){out.push(s);continue;}
    const parts=s.split(/(?<=[、，])/).map(v=>v.trim()).filter(Boolean);
    let buf='';
    for(const part of parts){
      if((buf+part).length>27&&buf){out.push(buf);buf=part}else buf+=part;
    }
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
  for(let i=0;i<chunks.length;i++){acc+=weights[i];if(target<acc){k=i;break}}
  const alpha=interpolate(progress,[0,.035,.95,1],[0,1,1,.35],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  return <div style={{position:'absolute',left:120,right:120,bottom:24,display:'flex',justifyContent:'center',opacity:alpha,pointerEvents:'none'}}>
    <div style={{maxWidth:1500,padding:'9px 24px 11px',borderRadius:13,background:'rgba(0,0,0,.58)',fontFamily:font,fontWeight:750,fontSize:29,lineHeight:1.38,textAlign:'center',color:'#f7f4ed',textShadow:'0 2px 10px rgba(0,0,0,.96)',boxShadow:'0 7px 28px rgba(0,0,0,.24)'}}>{chunks[k]??chunks[chunks.length-1]}</div>
  </div>;
};

const V51=()=>{
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const a=activeAt(frame/fps);
  const beat=beats[a.index]??beats[0];
  const n=a.index+1;
  const inFade=interpolate(a.progress,[0,.025],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  return <AbsoluteFill style={{background:'#020305',fontFamily:font}}>
    <AbsoluteFill style={{opacity:inFade}}><SceneVisual n={n} progress={a.progress}/></AbsoluteFill>
    <Subtitle beat={beat} progress={a.progress}/>
  </AbsoluteFill>;
};

const Root=()=>{
  const duration=Math.max(30,Math.ceil(Number(sync.durationSeconds||1020)*30));
  return <Composition id='V51ShortMen' component={V51} durationInFrames={duration} fps={30} width={1920} height={1080}/>;
};

registerRoot(Root);
