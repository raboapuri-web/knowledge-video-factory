import React from 'react';
import {AbsoluteFill,Audio,Sequence,staticFile} from 'remotion';
import timeline from './chapter-selected-data.json';
import registry from './toyoko_scene_plan.json';
import {StoryboardShot} from './scene-engine';
import {Caption} from './video-compositions';
import {ChapterTwoDiagram} from './chapter2-diagrams';
import type {Shot} from './full-motion';

export type SecondChapterCut={
 id:string;fromParagraph:number;toParagraph:number;visualRef:string;
 fromFrame:number;durationFrames:number;recommendation:string;
 sourceText:string;originalShot:Shot|null;customShot?:Shot
};
export type SecondChapterData={
 chapterId:string;status:string;fps:number;durationFrames:number;
 sourceParagraphCount:number;audioFile:string;
 narrationBeats:{id:string;from:number;frames:number;caption:string;text:string}[];
 shots:SecondChapterCut[]
};
const film=timeline as unknown as SecondChapterData;
const bg=new Map(registry.assetRegistry.backgrounds.map(x=>[x.id,x]));
const fileFor=(id:string)=>{
 const x=bg.get(id),s=x?.assetFile??('shared/asset-library/'+x?.sourceOrBrief);
 const f=s.match(/^shared\/asset-library\/背景\/([\w.-]+\.png)$/)?.[1];
 if(!f)throw Error('Chapter two visual references an unregistered PNG: '+id);
 return f;
};
const diagramIds=new Set([
 'DG_SHARED_NIGHT','DG_DOUBLE_EDGED','DG_STUDY_138','DG_SIX_MONTHS',
 'DG_ASSOCIATION','DG_ODDS_59','DG_USAGE_CLUSTER','DG_SAME_BUILDING',
 'DG_GROUP_OR_ALONE','DG_TRUST_BRIDGE','DG_SOCIAL_NETWORK',
 'DG_NETWORK_TWO_ROUTES','DG_BELONGING_PARADOX','DG_TRUST_CUES'
]);
export const ChapterTwoFilm=()=>{
 if(film.status!=='chapter_preview_ready'||film.chapterId!=='chapter2'||
  film.sourceParagraphCount!==58||film.fps!==30||film.shots.length!==52||
  film.durationFrames<=0||film.narrationBeats.length!==30)
  throw Error('Standalone chapter-two 58-paragraph / 52-scene original VOICEVOX data not prepared');
 const seen=new Set<string>();
 let end=0,paragraph=0,diagramCount=0;
 for(const s of film.shots){
  if(s.fromFrame!==end||s.durationFrames<=0||
      s.fromParagraph!==paragraph+1||s.toParagraph<s.fromParagraph||
      seen.has(s.visualRef))throw Error('Overlapping/missing/repeated chapter-two scene: '+s.id);
  end+=s.durationFrames;paragraph=s.toParagraph;seen.add(s.visualRef);
  if(diagramIds.has(s.visualRef)){diagramCount++;continue;}
  const shot=s.originalShot??s.customShot;
  if(!shot)throw Error('No actual scene asset for '+s.id);
  fileFor(shot.background);
 }
 if(paragraph!==58||end>film.durationFrames||diagramCount!==14)
  throw Error('Chapter two source/audio/diagram coverage incomplete');
 return <AbsoluteFill style={{background:'#0a1422'}}>
  {film.shots.map(s=><Sequence key={s.id} name={s.id+' '+s.recommendation.slice(0,35)}
     from={s.fromFrame} durationInFrames={s.durationFrames}>
    {diagramIds.has(s.visualRef)?
      <ChapterTwoDiagram id={s.visualRef}/>:
      <StoryboardShot shot={(s.originalShot??s.customShot)!}
        backgroundFile={fileFor((s.originalShot??s.customShot)!.background)}
        durationSeconds={s.durationFrames/30}/>}
   </Sequence>)}
   {film.narrationBeats.map(b=><Sequence key={b.id}
     from={b.from} durationInFrames={b.frames} name={'original_caption_'+b.id}>
     <Caption text={b.caption} durationFrames={b.frames}/>
   </Sequence>)}
   <Audio src={staticFile(film.audioFile)} volume={1}/>
 </AbsoluteFill>;
};
export {film as chapterTwoData};
