import React from 'react';
import {AbsoluteFill,Composition,registerRoot,useCurrentFrame,useVideoConfig} from 'remotion';
import scriptData from './script-data.json';
import sceneData from './scene-data.json';
import sync from './sync-timing.json';
import {SceneVisual} from './scenes';

type Beat={id:string;phase:string;location:string;visual:string;localIndex:number;shotKind:string;narration:string};
type SceneMeta=Omit<Beat,'narration'>;
type Timing={index:number;start:number;end:number};
const beats=scriptData.beats as Beat[];
const scenes=sceneData as SceneMeta[];
const timings=(sync.beats||[]) as Timing[];
const clamp=(n:number)=>Math.min(1,Math.max(0,n));
const font='"Noto Sans JP",sans-serif';
const subtitles=(text:string)=>{
 const s=text.replace(/\\n/g,'\n').match(/[^。！？]+[。！？]?/g)||[text];
 const out:string[]=[];
 for(const sentence of s){
  let buffer='';
  for(const phrase of sentence.trim().split(/(?<=[、，])/)){
   if((buffer+phrase).length>26&&buffer){out.push(buffer.trim());buffer=phrase;}
   else buffer+=phrase;
  }
  if(buffer.trim())out.push(buffer.trim());
 }
 return out.length?out:[text];
};
const active=(seconds:number)=>{
 if(!timings.length)return {i:0,progress:0,stageProgress:0,elapsed:0};
 let lo=0,hi=timings.length-1;
 while(lo<hi){const mid=(lo+hi+1)>>1;if(timings[mid].start<=seconds)lo=mid;else hi=mid-1;}
 let i=lo;
 if(seconds<timings[0].start)i=0;
 const current=timings[i];
 let first=i,last=i;
 while(first>0&&beats[first-1]?.location===beats[i]?.location)first--;
 while(last<timings.length-1&&beats[last+1]?.location===beats[i]?.location)last++;
 const stageStart=timings[first].start,stageEnd=timings[last].end;
 return {i,progress:clamp((seconds-current.start)/Math.max(.001,current.end-current.start)),
         stageProgress:clamp((seconds-stageStart)/Math.max(.001,stageEnd-stageStart)),elapsed:seconds-stageStart};
};
const Subtitle=({beat,p}:{beat:Beat;p:number})=>{
 const parts=subtitles(beat.narration);const weight=parts.map(s=>Math.max(1,s.length));
 const sum=weight.reduce((a,b)=>a+b,0);const target=p*sum;
 let cum=0,idx=parts.length-1;
 for(let j=0;j<parts.length;j++){cum+=weight[j];if(target<cum){idx=j;break;}}
 return <div style={{position:'absolute',bottom:34,left:140,right:140,display:'flex',justifyContent:'center',pointerEvents:'none'}}>
  <div style={{maxWidth:1490,padding:'10px 26px',borderRadius:12,background:'rgba(9,13,20,.83)',
       fontFamily:font,fontWeight:750,fontSize:31,lineHeight:1.38,textAlign:'center',color:'#fcf6ed',
       boxShadow:'0 5px 24px #0008',whiteSpace:'pre-line'}}>{parts[idx]?.replace(/\\n/g,'\n')}</div>
 </div>;
};
const V64=()=>{
 const frame=useCurrentFrame(),{fps}=useVideoConfig(),seconds=frame/fps;
 const time=active(seconds),beat=beats[time.i]??beats[0],scene=scenes[time.i]??scenes[0];
 return <AbsoluteFill style={{background:'#080b14'}}>
  <SceneVisual meta={scene} narration={beat.narration} beatProgress={time.progress}
     stageProgress={time.stageProgress} stageElapsed={time.elapsed} seconds={seconds}/>
  <Subtitle beat={beat} p={time.progress}/>
 </AbsoluteFill>;
};
const Root=()=> <Composition id="V64NishiazabuMoon" component={V64}
  durationInFrames={Math.max(30,Math.ceil(Number(sync.durationSeconds||680)*30))}
  fps={30} width={1920} height={1080}/>;
registerRoot(Root);
