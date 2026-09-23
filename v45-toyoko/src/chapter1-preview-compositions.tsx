import React from 'react';
import {AbsoluteFill,Audio,Img,Sequence,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import data from './chapter-selected-data.json';
import board from './toyoko_scene_plan.json';
import {StoryboardShot} from './scene-engine';
import {Caption} from './video-compositions';
import type {Shot} from './full-motion';
type Edit={id:string;visualRef:string;recommendation:string;fromFrame:number;durationFrames:number;
 sourceText:string;originalShot:Shot|null;customShot?:Shot};
type Master={status:string;chapterId:string;durationFrames:number;audioFile:string;
 sourceParagraphCount:number;shots:Edit[];
 narrationBeats:{id:string;from:number;frames:number;text:string;caption:string}[]};
const film=data as unknown as Master;
const backgroundById=new Map(board.assetRegistry.backgrounds.map(b=>[b.id,b]));
const resolve=(id:string)=>{
 const b=backgroundById.get(id);
 const candidate=b?.assetFile??('shared/asset-library/'+b?.sourceOrBrief);
 const png=candidate.match(/^shared\/asset-library\/背景\/([\w.-]+\.png)$/)?.[1];
 if(!png)throw Error('Missing registered first-chapter PNG background '+id);
 return png;
};
/**
 * A SINGLE scientific illustration in the 50-paragraph chapter, tied only
 * to its unique paragraph 17. This is not a generic chart to be repeated
 * every n seconds: the shelter bed, rule clock, and door are concrete concepts.
 */
const ShelterRulesIllustration=()=>{
 const f=useCurrentFrame(),{fps}=useVideoConfig();
 const t=Math.max(0,Math.min(1,f/(fps*3)));
 const show=(p:number)=>Math.max(0,Math.min(1,(t-p)*3));
 return <AbsoluteFill style={{background:'#101b2b',fontFamily:'Noto Sans JP,sans-serif'}}>
   <svg viewBox='0 0 1920 1080' style={{width:'100%',height:'100%'}}>
    <rect x={120} y={155} width={850} height={740} rx={36} fill='#273949'
      stroke='#9fbfc9' strokeWidth={4}/>
    <rect x={980} y={155} width={820} height={740} rx={36} fill='#232a36'
      stroke='#d6b28b' strokeWidth={4}/>
    <g opacity={show(0)}>
     <rect x={295} y={498} width={490} height={160} rx={24} fill='#8aa8aa'/>
     <rect x={308} y={485} width={150} height={68} rx={17} fill='#d9dccc'/>
     <rect x={285} y={620} width={510} height={21} fill='#526571'/>
     <rect x={275} y={642} width={20} height={65} fill='#526571'/>
     <rect x={785} y={642} width={20} height={65} fill='#526571'/>
     <path d='M330 440 Q555 335 780 445' fill='none' stroke='#e5dfc9' strokeWidth={14}/>
     <text x={545} y={765} fill='#f1eee5' fontSize={60} textAnchor='middle'>雨から守る寝床</text>
    </g>
    <g opacity={show(.25)}>
     <circle cx={1390} cy={390} r={125} stroke='#ddbf9d' strokeWidth={12} fill='none'/>
     <path d='M1390 295 V395 L1450 440' stroke='#e7d6ba' strokeWidth={13}
      fill='none' strokeLinecap='round'/>
     <path d='M1225 532 H1545 V770 H1225Z' fill='#536779' stroke='#bec8c6'
      strokeWidth={9}/>
     <rect x={1262} y={565} width={244} height={180} fill='#273747'/>
     <circle cx={1477} cy={669} r={11} fill='#e4c99c'/>
     <text x={1390} y={827} fill='#e7dfd2' fontSize={53} textAnchor='middle'>生活のルール</text>
    </g>
    <g opacity={show(.58)}>
     <path d='M960 210 V830' stroke='#cbd8d2' strokeWidth={5} strokeDasharray='13 24'/>
     <path d='M894 515 L935 556 L894 597' stroke='#e5d4af' strokeWidth={9}
      fill='none' strokeLinecap='round'/>
    </g>
   </svg>
 </AbsoluteFill>;
};
const ChapterOnePreviewFilm=()=>{
 if(film.status!=='chapter_preview_ready'||film.chapterId!=='chapter1'||
    film.sourceParagraphCount!==50||film.shots.length!==44||film.durationFrames<=0)
  throw Error('Missing complete chapter-one 50-paragraph editorial cut and original VOICEVOX audio');
 let end=0;
 for(const shot of film.shots){
  if(shot.fromFrame!==end||shot.durationFrames<=0)throw Error('Chapter one shot overlap '+shot.id);
  end+=shot.durationFrames;
  if(shot.visualRef==='CUSTOM_RULES_SAFETY')continue;
  const visual=shot.originalShot??shot.customShot;
  if(!visual||!backgroundById.has(visual.background))throw Error('Unknown intentional chapter-one scene '+shot.id);
 }
 if(end>film.durationFrames)throw Error('Chapter one scenes exceed audio source');
 return <AbsoluteFill style={{background:'#0a1422'}}>
   {film.shots.map(s=>{
    const shot=s.originalShot??s.customShot;
    return <Sequence key={s.id} name={s.id+' '+s.recommendation.slice(0,34)}
      from={s.fromFrame} durationInFrames={s.durationFrames}>
      {s.visualRef==='CUSTOM_RULES_SAFETY'?<ShelterRulesIllustration/>:
       <StoryboardShot shot={shot!} backgroundFile={resolve(shot!.background)}
          durationSeconds={s.durationFrames/30}/>}
    </Sequence>;
   })}
   {film.narrationBeats.map(b=><Sequence key={b.id} from={b.from}
     durationInFrames={b.frames} name={'approved_caption_'+b.id}>
     <Caption text={b.caption} durationFrames={b.frames}/>
   </Sequence>)}
   <Audio src={staticFile(film.audioFile)} volume={1}/>
 </AbsoluteFill>;
};
export {film as chapterOneData,ChapterOnePreviewFilm};
