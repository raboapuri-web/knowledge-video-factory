import React from 'react';
import {AbsoluteFill,Audio,Sequence,staticFile} from 'remotion';
import timeline from './chapter-selected-data.json';
import registry from './toyoko_scene_plan.json';
import {StoryboardShot} from './scene-engine';
import {Caption} from './video-compositions';
import {ChapterThreeDiagram} from './chapter3-diagrams';
import type {Shot} from './full-motion';

export type ThirdChapterCut={
 id:string;fromParagraph:number;toParagraph:number;visualRef:string;
 fromFrame:number;durationFrames:number;recommendation:string;
 sourceText:string;originalShot:Shot|null;customShot?:Shot
};
export type ThirdChapterData={
 chapterId:string;status:string;fps:number;durationFrames:number;
 sourceParagraphCount:number;audioFile:string;
 narrationBeats:{id:string;from:number;frames:number;caption:string;text:string}[];
 shots:ThirdChapterCut[]
};
const film=timeline as unknown as ThirdChapterData;
const bg=new Map(registry.assetRegistry.backgrounds.map(x=>[x.id,x]));
const fileFor=(id:string)=>{
 const x=bg.get(id),s=x?.assetFile??('shared/asset-library/'+x?.sourceOrBrief);
 const f=s.match(/^shared\/asset-library\/背景\/([\w.-]+\.png)$/)?.[1];
 if(!f)throw Error('Chapter two visual references an unregistered PNG: '+id);
 return f;
};
const diagramIds=new Set([
 'DG_SUPPORT_PROCESS','DG_ADULT_FIRST_VIEW','DG_CHANGE_ACCEPT','DG_TRUST_ENTRY',
 'DG_HELP_ACCESS','DG_FIRST_IMPRESSION','DG_STUDY_80','DG_STREET_RESOURCES',
 'DG_EXIT_COST','DG_STUDY_40','DG_FEW_OPTIONS','DG_COERCION','DG_OPTION_NOT_FREE',
 'DG_LOSE_SHELTER','DG_NO_ROUTE','DG_GRATITUDE_BURDEN','DG_DEPENDENCY_CYCLE',
 'DG_SURVIVAL_NEEDS','DG_LISTEN_AND_RESOURCES','DG_ZERO_SUM','DG_AGENCY',
 'DG_SAFE_BACKUP'
]);
export const ChapterThreeFilm=()=>{
 if(film.status!=='chapter_preview_ready'||film.chapterId!=='chapter3'||
  film.sourceParagraphCount!==66||film.fps!==32||film.shots.length!==61||
  film.durationFrames<=0||film.narrationBeats.length!==32)
  throw Error('Standalone chapter-three 58-paragraph / 52-scene original VOICEVOX data not prepared');
 const seen=new Set<string>();
 let end=0,paragraph=0,diagramCount=0;
 for(const s of film.shots){
  if(s.fromFrame!==end||s.durationFrames<=0||
      s.fromParagraph!==paragraph+1||s.toParagraph<s.fromParagraph||
      seen.has(s.visualRef))throw Error('Overlapping/missing/repeated chapter-three scene: '+s.id);
  end+=s.durationFrames;paragraph=s.toParagraph;seen.add(s.visualRef);
  if(diagramIds.has(s.visualRef)){diagramCount++;continue;}
  const shot=s.originalShot??s.customShot;
  if(!shot)throw Error('No actual scene asset for '+s.id);
  fileFor(shot.background);
 }
 if(paragraph!==66||end>film.durationFrames||diagramCount!==22)
  throw Error('Chapter two source/audio/diagram coverage incomplete');
 return <AbsoluteFill style={{background:'#0a1422'}}>
  {film.shots.map(s=><Sequence key={s.id} name={s.id+' '+s.recommendation.slice(0,35)}
     from={s.fromFrame} durationInFrames={s.durationFrames}>
    {diagramIds.has(s.visualRef)?
      <ChapterThreeDiagram id={s.visualRef}/>:
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
export {film as chapterThreeData};
