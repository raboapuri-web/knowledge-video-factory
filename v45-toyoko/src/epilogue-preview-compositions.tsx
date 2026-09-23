import React from 'react';
import {AbsoluteFill,Audio,Sequence,staticFile} from 'remotion';
import timeline from './chapter-selected-data.json';
import registry from './toyoko_scene_plan.json';
import {StoryboardShot} from './scene-engine';
import {Caption} from './video-compositions';
import {EpilogueDiagram} from './epilogue-diagrams';
import type {Shot} from './full-motion';

type EpilogueShot={id:string;fromParagraph:number;toParagraph:number;visualRef:string;fromFrame:number;
 durationFrames:number;recommendation:string;sourceText:string;originalShot:Shot|null;customShot?:Shot};
type EpilogueData={chapterId:string;status:string;fps:number;durationFrames:number;sourceParagraphCount:number;
 audioFile:string;narrationBeats:{id:string;from:number;frames:number;caption:string;text:string}[];
 shots:EpilogueShot[]};
const film=timeline as unknown as EpilogueData;
const backgrounds=new Map(registry.assetRegistry.backgrounds.map(x=>[x.id,x]));
const fileFor=(id:string)=>{
 const x=backgrounds.get(id),s=x?.assetFile??('shared/asset-library/'+x?.sourceOrBrief);
 const f=s.match(/^shared\/asset-library\/背景\/([\w.-]+\.png)$/)?.[1];
 if(!f)throw Error('Unregistered epilogue PNG '+id);
 return f;
};
const diagrams=new Set(['DG_VIEW_CHANGED','DG_SAFETY_BELONGING','DG_MOVE_IS_NOT_SOLVE']);
export const EpilogueFilm=()=>{
 if(film.status!=='chapter_preview_ready'||film.chapterId!=='epilogue'||film.fps!==30||
 film.sourceParagraphCount!==25||film.shots.length!==22||film.narrationBeats.length!==16||
 film.durationFrames<=0)throw Error('Incomplete approved-source epilogue chapter');
 let end=0,lastParagraph=0,dCount=0;
 const seen=new Set<string>();
 for(const s of film.shots){
  if(s.fromFrame!==end||s.durationFrames<=0||s.fromParagraph!==lastParagraph+1||
   s.toParagraph<s.fromParagraph||seen.has(s.visualRef))throw Error('Gap, overlap or repetition '+s.id);
  seen.add(s.visualRef);lastParagraph=s.toParagraph;end+=s.durationFrames;
  if(diagrams.has(s.visualRef)){dCount++;continue;}
  const shot=s.originalShot??s.customShot;
  if(!shot)throw Error('Missing epilogue shot '+s.id);
  fileFor(shot.background);
 }
 if(lastParagraph!==25||end>film.durationFrames||dCount!==3)
  throw Error('Epilogue visuals do not cover original complete 25 paragraphs');
 return <AbsoluteFill style={{background:'#0c1624'}}>
  {film.shots.map(s=><Sequence key={s.id} name={s.id+' '+s.recommendation.slice(0,34)}
   from={s.fromFrame} durationInFrames={s.durationFrames}>
   {diagrams.has(s.visualRef)?<EpilogueDiagram id={s.visualRef}/>:
    <StoryboardShot shot={(s.originalShot??s.customShot)!}
     backgroundFile={fileFor((s.originalShot??s.customShot)!.background)}
     durationSeconds={s.durationFrames/30}/>}
  </Sequence>)}
  {film.narrationBeats.map(b=><Sequence key={b.id} from={b.from}
   durationInFrames={b.frames} name={'original_caption_'+b.id}>
    <Caption text={b.caption} durationFrames={b.frames}/>
  </Sequence>)}
  <Audio src={staticFile(film.audioFile)} volume={1}/>
 </AbsoluteFill>;
};
export {film as epilogueData};
