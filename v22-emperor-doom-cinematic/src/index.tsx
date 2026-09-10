import React from 'react';
import {AbsoluteFill,Composition,interpolate,registerRoot,useCurrentFrame,useVideoConfig} from 'remotion';
import scriptRaw from '../../v22-emperor-doom-democracy/src/script-data.json';
import timingRaw from './sync-timing.json';
import {CINEMATIC_SCENES,CinematicArt} from './scenes-cinematic';

type Beat={id:string;visual:string;chapter:string;subtitle:string};
type TimingBeat={id:string;index:number;start:number;end:number};
const script=scriptRaw as {title:string;beats:Beat[]};
const timing=timingRaw as {durationSeconds:number;beats:TimingBeat[]};
const clamp=(v:number)=>Math.max(0,Math.min(1,v));

const splitSubtitle=(text:string)=>{
 const parts=text.match(/[^。！？!?]+[。！？!?]?/g)??[text];const out:string[]=[];let buf='';
 for(const raw of parts){const s=raw.trim();if(!s)continue;if((buf+s).length<=31)buf+=s;else{if(buf)out.push(buf);if(s.length<=34)buf=s;else{for(let i=0;i<s.length;i+=31)out.push(s.slice(i,i+31));buf='';}}}
 if(buf)out.push(buf);return out.length?out:[text];
};

const Subtitle=({beat,p}:{beat:Beat;p:number})=>{const chunks=splitSubtitle(beat.subtitle);const idx=Math.min(chunks.length-1,Math.floor(clamp(p*.999)*chunks.length));const local=clamp(p*chunks.length-idx);const op=interpolate(local,[0,.08,.92,1],[0,1,1,.2],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});return <>
 <div style={{position:'absolute',left:70,top:52,color:'rgba(235,231,221,.42)',fontFamily:'Noto Sans CJK JP,sans-serif',fontSize:18,fontWeight:700,letterSpacing:3}}>{beat.chapter}</div>
 <div style={{position:'absolute',left:150,right:150,bottom:54,display:'flex',justifyContent:'center',pointerEvents:'none'}}><div style={{maxWidth:1500,padding:'14px 30px 17px',borderRadius:10,background:'rgba(2,5,4,.70)',color:'#f2eee5',fontFamily:'Noto Sans CJK JP,sans-serif',fontSize:39,fontWeight:800,lineHeight:1.5,textAlign:'center',textShadow:'0 3px 18px #000',opacity:op}}>{chunks[idx]}</div></div>
 </>};

const Film=()=>{const frame=useCurrentFrame();const {fps}=useVideoConfig();const t=frame/fps;const dur=Math.max(.001,timing.durationSeconds);const nt=clamp(t/dur)*940;
 let si=CINEMATIC_SCENES.findIndex(s=>nt>=s.start&&nt<s.end);if(si<0)si=CINEMATIC_SCENES.length-1;const s=CINEMATIC_SCENES[si];const sp=clamp((nt-s.start)/Math.max(.001,s.end-s.start));
 let bi=timing.beats.findIndex(b=>t>=b.start&&t<b.end);if(bi<0)bi=t>=timing.beats[timing.beats.length-1]?.end?Math.max(0,timing.beats.length-1):0;const tb=timing.beats[bi];const beat=script.beats[tb?.index??bi]??script.beats[0];const bp=tb?clamp((t-tb.start)/Math.max(.001,tb.end-tb.start)):0;
 const sceneFadeIn=clamp(sp/.035);const sceneFadeOut=clamp((1-sp)/.035);const sceneOp=Math.min(sceneFadeIn,sceneFadeOut*.7+.3);
 return <AbsoluteFill style={{background:'#030505',overflow:'hidden'}}><div style={{position:'absolute',inset:0,opacity:sceneOp}}><CinematicArt kind={s.kind} p={sp}/></div><AbsoluteFill style={{background:'radial-gradient(ellipse at 50% 45%,transparent 42%,rgba(0,0,0,.13) 72%,rgba(0,0,0,.55) 100%)',pointerEvents:'none'}}/><Subtitle beat={beat} p={bp}/></AbsoluteFill>;
};

const Root=()=> <Composition id="V22EmperorDoomCinematic" component={Film} width={1920} height={1080} fps={30} durationInFrames={Math.max(1,Math.ceil(timing.durationSeconds*30))}/>;
registerRoot(Root);
