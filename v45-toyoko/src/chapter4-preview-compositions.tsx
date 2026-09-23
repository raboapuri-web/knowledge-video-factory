import React from 'react';
import {AbsoluteFill,Audio,Sequence,staticFile} from 'remotion';
import timeline from './chapter-selected-data.json';
import registry from './toyoko_scene_plan.json';
import {StoryboardShot} from './scene-engine';
import {Caption} from './video-compositions';
import {ChapterFourDiagram} from './chapter4-diagrams';
import type {Shot} from './full-motion';

export type FourthChapterCut={
 id:string;fromParagraph:number;toParagraph:number;visualRef:string;
 fromFrame:number;durationFrames:number;recommendation:string;
 sourceText:string;originalShot:Shot|null;customShot?:Shot
};
export type FourthChapterData={
 chapterId:string;status:string;fps:number;durationFrames:number;
 sourceParagraphCount:number;audioFile:string;
 narrationBeats:{id:string;from:number;frames:number;caption:string;text:string}[];
 shots:FourthChapterCut[]
};
const film=timeline as unknown as FourthChapterData;
const bg=new Map(registry.assetRegistry.backgrounds.map(x=>[x.id,x]));
const fileFor=(id:string)=>{
 const x=bg.get(id),s=x?.assetFile??('shared/asset-library/'+x?.sourceOrBrief);
 const f=s.match(/^shared\/asset-library\/背景\/([\w.-]+\.png)$/)?.[1];
 if(!f)throw Error('Chapter four visual references an unregistered PNG: '+id);
 return f;
};
const diagramIds=new Set([
 'DG_OPEN_15',
 'DG_TRUST_TO_SUPPORT',
 'DG_SAFETY_BOUNDARIES',
 'DG_PROTECTION_LIMIT',
 'DG_OPEN_HOURS',
 'DG_NEW_RELATIONSHIP',
 'DG_DAY_NIGHT_LOOP',
 'DG_BUILDING_VS_LIFE',
 'DG_ACCESS_FRICTION',
 'DG_SAFE_NOT_REACHED',
 'DG_SAFETY_AND_ACCESS',
 'DG_STUDY_11_37',
 'DG_STABLE_RULES',
 'DG_AGENCY_BESIDE_SAFETY',
 'DG_YOUTH_PARTICIPATION',
 'DG_CHOICE_BOARD',
 'DG_FRIEND_CONTACT',
 'DG_TRUST_TAKES_TIME',
 'DG_RETURN_PATH',
 'DG_SYSTEM_VIEW',
 'DG_REASON_TO_ENTER',
 'DG_ENTER_LOSS',
 'DG_MANY_DECISIONS',
 'DG_RELOCATION_VS_LIFE',
 'DG_FEAR_OF_LOSS',
 'DG_AFTER_EXIT',
 'DG_CONTINUITY'
]);
export const ChapterFourFilm=()=>{
 if(film.status!=='chapter_preview_ready'||film.chapterId!=='chapter4'||
  film.sourceParagraphCount!==74||film.fps!==30||film.shots.length!==70||
  film.durationFrames<=0||film.narrationBeats.length!==32)
  throw Error('Standalone chapter-four 74-paragraph / 70-scene original VOICEVOX data not prepared');
 const seen=new Set<string>();
 let end=0,paragraph=0,diagramCount=0;
 for(const s of film.shots){
  if(s.fromFrame!==end||s.durationFrames<=0||
      s.fromParagraph!==paragraph+1||s.toParagraph<s.fromParagraph||
      seen.has(s.visualRef))throw Error('Overlapping/missing/repeated chapter-four scene: '+s.id);
  end+=s.durationFrames;paragraph=s.toParagraph;seen.add(s.visualRef);
  if(diagramIds.has(s.visualRef)){diagramCount++;continue;}
  const shot=s.originalShot??s.customShot;
  if(!shot)throw Error('No actual scene asset for '+s.id);
  fileFor(shot.background);
 }
 if(paragraph!==74||end>film.durationFrames||diagramCount!==27)
  throw Error('Chapter four source/audio/diagram coverage incomplete');
 return <AbsoluteFill style={{background:'#0a1422'}}>
  {film.shots.map(s=><Sequence key={s.id} name={s.id+' '+s.recommendation.slice(0,35)}
     from={s.fromFrame} durationInFrames={s.durationFrames}>
    {diagramIds.has(s.visualRef)?
      <ChapterFourDiagram id={s.visualRef}/>:
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
export {film as chapterFourData};
