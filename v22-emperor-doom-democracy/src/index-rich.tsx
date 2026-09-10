import React from 'react';
import {AbsoluteFill,Composition,interpolate,registerRoot,useCurrentFrame,useVideoConfig} from 'remotion';
import scriptRaw from './script-data.json';
import timingRaw from './sync-timing.json';
import {SceneArtRich} from './scenes-rich';

type Beat={id:string;visual:string;chapter:string;subtitle:string};
type TimingBeat={id:string;index:number;start:number;end:number};
const script=scriptRaw as {title:string;beats:Beat[]};
const timing=timingRaw as {durationSeconds:number;beats:TimingBeat[]};
const clamp=(v:number)=>Math.max(0,Math.min(1,v));

const splitSubtitle=(text:string)=>{
  const sentences=text.match(/[^。！？!?]+[。！？!?]?/g)??[text];
  const out:string[]=[];let buf='';
  for(const raw of sentences){
    const s=raw.trim();if(!s)continue;
    if((buf+s).length<=24)buf+=s;
    else{
      if(buf)out.push(buf);
      if(s.length<=28)buf=s;
      else{for(let i=0;i<s.length;i+=25)out.push(s.slice(i,i+25));buf='';}
    }
  }
  if(buf)out.push(buf);
  return out.length?out:[text];
};

const Subtitle=({beat,p}:{beat:Beat;p:number})=>{
  const chunks=splitSubtitle(beat.subtitle);
  const i=Math.min(chunks.length-1,Math.floor(clamp(p*.9999)*chunks.length));
  const local=clamp(p*chunks.length-i);
  const opacity=interpolate(local,[0,.06,.92,1],[0,1,1,.08],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  const rise=interpolate(local,[0,.1],[10,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  return <>
    <div style={{position:'absolute',left:68,top:48,color:'rgba(235,231,220,.46)',fontFamily:'Noto Sans CJK JP, sans-serif',fontSize:18,fontWeight:700,letterSpacing:3.5}}>{beat.chapter}</div>
    <div style={{position:'absolute',left:68,top:78,width:260,height:2,background:'rgba(223,191,120,.22)'}}><div style={{width:`${Math.max(4,p*100)}%`,height:'100%',background:'rgba(223,191,120,.72)',boxShadow:'0 0 10px rgba(223,191,120,.2)'}}/></div>
    <div style={{position:'absolute',left:120,right:120,bottom:50,display:'flex',justifyContent:'center',pointerEvents:'none'}}>
      <div style={{maxWidth:1580,padding:'15px 31px 18px',borderRadius:10,background:'linear-gradient(180deg,rgba(4,7,6,.58),rgba(2,4,3,.78))',border:'1px solid rgba(210,205,190,.08)',backdropFilter:'blur(9px)',color:'#f2eee5',fontFamily:'Noto Sans CJK JP, sans-serif',fontSize:39,fontWeight:800,lineHeight:1.5,textAlign:'center',letterSpacing:.35,textShadow:'0 3px 18px #000',opacity,transform:`translateY(${rise}px)`}}>{chunks[i]}</div>
    </div>
  </>;
};

const Film=()=>{
  const frame=useCurrentFrame();const {fps}=useVideoConfig();const t=frame/fps;
  const ts=timing.beats.length?timing.beats:script.beats.map((b,i)=>({id:b.id,index:i,start:i*11,end:(i+1)*11}));
  let ti=ts.findIndex(b=>t>=b.start&&t<b.end);if(ti<0)ti=t>=ts[ts.length-1].end?ts.length-1:0;
  const tb=ts[ti];const beat=script.beats[tb.index]??script.beats[ti]??script.beats[0];
  const p=clamp((t-tb.start)/Math.max(.001,tb.end-tb.start));
  const enter=clamp(p/.025),exit=clamp((1-p)/.025),opacity=Math.min(enter,exit);
  return <AbsoluteFill style={{background:'#020405',overflow:'hidden'}}>
    <div style={{position:'absolute',inset:0,opacity}}><SceneArtRich visual={beat.visual} p={p}/></div>
    <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at 50% 44%,transparent 37%,rgba(0,0,0,.13) 67%,rgba(0,0,0,.58) 100%)',pointerEvents:'none'}}/>
    <Subtitle beat={beat} p={p}/>
  </AbsoluteFill>;
};

const Root=()=> <Composition id="V22EmperorDoomDemocracyRich" component={Film} width={1920} height={1080} fps={30} durationInFrames={Math.max(1,Math.ceil(timing.durationSeconds*30))}/>;
registerRoot(Root);
