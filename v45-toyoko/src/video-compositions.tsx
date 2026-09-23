import React from 'react';
import {AbsoluteFill,Audio,Img,Sequence,staticFile,useCurrentFrame} from 'remotion';
import storyboard from './toyoko_scene_plan.json';
import {PrologueShot,type ToyokoShot} from './prologue';
import {StoryboardShot} from './scene-engine';
import type {Shot} from './full-motion';

export type Beat={
 id:string;from:number;frames:number;text:string;caption:string;
 sourceFragments:string[];sourceParagraphRange?:number[]|null;
};
export type ChapterData={
 chapterId:string;status:string;durationFrames:number;actualVoiceSeconds:number;
 fps:number;audioFile:string;from?:number;beats:Beat[];
};
const plan=storyboard as unknown as {scenes:{id:string;chapterId:string;shots:Shot[]}[];
 assetRegistry:{backgrounds:{id:string;assetFile?:string;sourceOrBrief?:string}[]}};
const lookup=new Map(plan.assetRegistry.backgrounds.map(a=>[a.id,a]));
const byId=new Map<string,Shot>(plan.scenes.flatMap(s=>s.shots.map(shot=>[shot.shotId,shot] as const)));
export const assertStoryboard=()=>{
 if(plan.scenes.length!==60||byId.size!==160)throw Error('Expected exact 60-scene, 160-cut JSON source');
};
assertStoryboard();
const backgroundFile=(shot:Shot)=>{
 const data=lookup.get(shot.background);
 const file=data?.assetFile||('shared/asset-library/'+(data?.sourceOrBrief??''));
 const match=file.match(/^shared\/asset-library\/背景\/([\w.-]+\.png)$/i);
 if(!match)throw Error('No verified background asset for '+shot.shotId+': '+shot.background);
 return match[1];
};

export const splitCaption=(text:string)=>{
 const chunks:string[]=[];
 let rest=text;
 while(rest.length){
  if(rest.length<=24){chunks.push(rest);break;}
  const part=rest.slice(0,25);
  const candidates=[...part.matchAll(/[、。！？\n]/g)];
  const mark=candidates.reverse().find(x=>x.index!==undefined&&x.index>=10);
  const end=mark&&mark.index!==undefined?mark.index+1:24;
  chunks.push(rest.slice(0,end));rest=rest.slice(end);
 }
 if(chunks.join('')!==text)throw Error('Caption text was altered');
 return chunks;
};
export const Caption=({text,durationFrames}:{text:string;durationFrames:number})=>{
 const frame=useCurrentFrame(),parts=splitCaption(text);
 const weights=parts.map(s=>Math.max(1,[...s].length));
 const total=weights.reduce((n,w)=>n+w,0);
 const target=(Math.max(0,frame+.5)/Math.max(1,durationFrames))*total;
 let tally=0,idx=parts.length-1;
 for(let i=0;i<parts.length;i++){tally+=weights[i];if(target<tally){idx=i;break;}}
 return <div style={{position:'absolute',left:90,right:90,bottom:24,
  display:'flex',justifyContent:'center',pointerEvents:'none',zIndex:999}}>
   <div style={{fontFamily:'Noto Sans JP,sans-serif',fontSize:37,fontWeight:750,
    color:'#fff',lineHeight:1.36,whiteSpace:'pre-line',
    maxWidth:1690,background:'rgba(0,0,0,.77)',borderRadius:11,
    textAlign:'center',padding:'10px 27px',
    textShadow:'0 3px 7px rgba(0,0,0,.9)'}}>
    {parts[idx]}
   </div>
 </div>;
};
export const ChapterFilm=({data}:{data:ChapterData})=>{
 if(data.status!=='voicevox_measured_approved_script'||!data.beats.length)
  throw Error('No measured approved narration for '+data.chapterId);
 const expected=plan.scenes.filter(s=>s.chapterId===data.chapterId).flatMap(s=>s.shots);
 if(data.beats.length!==expected.length||!data.beats.every((b,i)=>b.id===expected[i].shotId))
  throw Error('Storyboard changed for '+data.chapterId);
 return <AbsoluteFill style={{background:'#0a0f1a'}}>
  {data.beats.map(beat=>{
   const shot=byId.get(beat.id);
   if(!shot||beat.caption!==beat.text||beat.frames<1)throw Error('Missing approved shot data for '+beat.id);
   return <Sequence key={beat.id} name={beat.id} from={beat.from}
     durationInFrames={beat.frames}>
     {data.chapterId==='prologue'?
       <PrologueShot shot={shot as unknown as ToyokoShot} file={backgroundFile(shot)}
          durationSeconds={beat.frames/30}/>:
       <StoryboardShot shot={shot} backgroundFile={backgroundFile(shot)}
         durationSeconds={beat.frames/30}/>}
     <Caption text={beat.caption} durationFrames={beat.frames}/>
   </Sequence>;
  })}
  <Audio src={staticFile(data.audioFile)} volume={1}/>
 </AbsoluteFill>;
};

export type CompleteData={status:string;durationFrames:number;fps:number;chapters:ChapterData[]};
export const CompleteFilm=({data}:{data:CompleteData})=>{
 const expected=['prologue','chapter1','chapter2','chapter3','chapter4','epilogue'];
 if(data.status!=='all_160_shots_voicevox_measured_approved_original'||
    data.chapters.length!==6||data.chapters.some((c,i)=>c.chapterId!==expected[i])||
    data.chapters.reduce((n,c)=>n+c.beats.length,0)!==160)
   throw Error('Full film must contain all 160 source-of-truth storyboard shots and six measured chapter narrations');
 let frame=0;
 return <AbsoluteFill style={{background:'#0a0f1a'}}>
  {data.chapters.map(c=>{
    if(c.from!==frame)throw Error('Chapter frame offsets are discontinuous '+c.chapterId);
    frame+=c.durationFrames;
    return <Sequence key={c.chapterId} name={c.chapterId}
       from={c.from} durationInFrames={c.durationFrames}>
       <ChapterFilm data={c}/>
    </Sequence>;
  })}
 </AbsoluteFill>;
};
