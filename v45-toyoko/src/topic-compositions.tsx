import React from 'react';
import {AbsoluteFill,Audio,Sequence,staticFile,useCurrentFrame} from 'remotion';
import planJson from './toyoko_scene_plan.json';
import {StoryboardShot} from './scene-engine';
import {Caption} from './video-compositions';
import {TopicDiagram} from './topic-diagrams';
import type {Shot} from './full-motion';

export type TopicSegment={
 id:string;fromParagraph:number;toParagraph:number;kind:'scene'|'scene-overlay'|'diagram';
 backgroundId:string|null;diagramId:string|null;startFrame:number;endFrame:number;
 durationFrames:number;sourceExactText:string
};
export type TopicBlock={
 blockId:string;topic:string;primaryCategory:string;sourceParagraphRange:number[];
 startFrame:number;endFrame:number;segments:TopicSegment[]
};
export type TopicChapter={
 chapterId:string;from:number;durationFrames:number;audioFile:string;
 beats:{id:string;from:number;frames:number;text:string;caption:string}[];
 blocks:TopicBlock[]
};
export type TopicMovie={
 schemaVersion:string;status:string;fps:number;durationFrames:number;
 chapters:TopicChapter[]
};
const register=planJson.assetRegistry.backgrounds as {
 id:string;assetFile?:string;sourceOrBrief?:string
}[];
const backgroundMap=new Map(register.map(a=>[a.id,a]));
const fileFor=(id:string)=>{
 const item=backgroundMap.get(id);
 const filename=(item?.assetFile??('shared/asset-library/'+item?.sourceOrBrief))
  .match(/^shared\/asset-library\/背景\/([\w.-]+\.png)$/)?.[1];
 if(!filename)throw Error('Topic scene background not registered: '+id);
 return filename;
};
const actorIds=(segment:TopicSegment,chapterId:string)=>{
 const bg=segment.backgroundId??'';
 if(bg==='BG_LIBRARY_ROOM')return ['GIRL_16','OLDER_MAN'];
 if(bg==='BG_RESEARCH_INTERVIEW')return ['RESEARCHER'];
 if(bg==='BG_GIRL_HOME')return ['GIRL_16'];
 if(bg==='BG_LIBRARY_CLASSROOM')return ['GIRL_16','OTHER_YOUTH'];
 if(bg==='BG_VANCOUVER_RAIN'||bg==='BG_ABROAD_SHELTER')return ['ABROAD_YOUTH'];
 if(bg.startsWith('BG_SHELTER_COUNSEL')||bg.startsWith('BG_YOUTH_CENTER'))return ['GIRL_16','SUPPORTER'];
 if(bg.startsWith('BG_SHELTER'))return ['GIRL_16'];
 if(bg==='BG_KABUKICHO_ALLEY'&&chapterId==='chapter3')return ['GIRL_16','OLDER_MAN'];
 if(bg==='BG_KABUKICHO_ALLEY'&&chapterId==='chapter2')return ['GIRL_16','FRIEND_BOY','OLDER_MAN'];
 return ['GIRL_16','FRIEND_BOY','FRIEND_GIRL'];
};
const cameraModes=['slow_push','side_tracking','medium','over_shoulder','reaction_closeup'];
const relevantDiagram=(segment:TopicSegment,category:string)=>{
 if(segment.diagramId)return segment.diagramId;
 if(category==='town')return 'network';
 if(category==='research')return 'research_process';
 if(category==='youth_center'||category==='facility')return 'safe_icons';
 return 'safe_vs_belonging';
};
const SyntheticScene=({segment,chapter,variant,frames}:{segment:TopicSegment;
 chapter:string;variant:number;frames:number})=>{
 if(!segment.backgroundId)throw Error('Scene missing background '+segment.id);
 const bg=segment.backgroundId;
 const family=actorIds(segment,chapter);
 const shot:Shot={shotId:segment.id+'-V'+variant,visual:segment.sourceExactText,
 narrationCue:segment.sourceExactText,camera:cameraModes[variant%cameraModes.length],
 background:bg,characters:family,props:[],requiredRigActions:variant%3===1?['idle','look_around']:
 bg==='BG_TOYOKO_GROUND'?['sit','idle']:['idle'],template:null,
 timing:{targetDurationSeconds:frames/30},
 weatherEffect:bg==='BG_VANCOUVER_RAIN'?{type:'rain'}:undefined};
 return <StoryboardShot shot={shot} backgroundFile={fileFor(bg)}
   durationSeconds={frames/30}/>;
};

/** At most 7 seconds of one visual composition before a genuinely distinct screen:
 * scene angle -> scene + SVG overlay -> standalone SVG chart -> another angle.
 * All screens stay in the paragraph's approved topic category. */
const TopicSegmentFilm=({segment,chapter,category}:{segment:TopicSegment;
 chapter:string;category:string})=>{
 const frame=useCurrentFrame();
 const unit=210,index=Math.floor(frame/unit);
 const start=index*unit,frames=Math.min(unit,segment.durationFrames-start);
 const diagram=relevantDiagram(segment,category);
 const display=segment.kind==='diagram'?'diagram':
   segment.kind==='scene-overlay'?(['scene','overlay','diagram','scene','overlay'][index%5]):
   (index>=4&&index%5===4?'diagram':index%4===2?'overlay':'scene');
 return <AbsoluteFill style={{background:'#0b1420'}}>
  <Sequence from={start} durationInFrames={frames} name={segment.id+'-screen-'+index}>
   {display==='diagram'?
    <TopicDiagram diagramId={diagram} variant={index}/>:
    <AbsoluteFill>
     <SyntheticScene segment={segment} chapter={chapter}
       variant={index} frames={frames}/>
     {display==='overlay'&&<TopicDiagram diagramId={diagram} overlay variant={index}/>}
    </AbsoluteFill>}
  </Sequence>
 </AbsoluteFill>;
};
const TopicChapterFilm=({chapter}:{chapter:TopicChapter})=>{
 const segments=chapter.blocks.flatMap(b=>b.segments.map(s=>({block:b,segment:s})));
 if(!segments.length||segments[0].segment.startFrame!==0||
    segments.some((x,i)=>i>0&&x.segment.startFrame!==segments[i-1].segment.endFrame))
  throw Error('Topic scene range is not chronologically gapless '+chapter.chapterId);
 return <AbsoluteFill style={{background:'#0b1420'}}>
  {segments.map(({block,segment})=><Sequence key={segment.id} name={segment.id+' '+block.topic}
      from={segment.startFrame} durationInFrames={segment.durationFrames}>
      <TopicSegmentFilm segment={segment} chapter={chapter.chapterId}
        category={block.primaryCategory}/>
   </Sequence>)}
  {/* Retain the PREVIOUSLY APPROVED complete source and measured VOICEVOX audio.
      Captions stay bound to the original speech beats, independent of visuals. */}
  {chapter.beats.map(b=><Sequence key={b.id} from={b.from}
       durationInFrames={b.frames} name={'caption-'+b.id}>
      <Caption text={b.caption} durationFrames={b.frames}/>
   </Sequence>)}
  <Audio src={staticFile(chapter.audioFile)} volume={1}/>
 </AbsoluteFill>;
};
export const CompleteTopicFilm=({data}:{data:TopicMovie})=>{
 const order=['prologue','chapter1','chapter2','chapter3','chapter4','epilogue'];
 if(data.status!=='topic_visual_edit_render_ready'||data.fps!==30||data.chapters.length!==6||
  data.chapters.some((c,i)=>c.chapterId!==order[i])||
  data.chapters.reduce((n,c)=>n+c.blocks.length,0)!==25||
  data.chapters.reduce((n,c)=>n+c.blocks.reduce((m,b)=>m+b.segments.length,0),0)!==82)
   throw Error('The complete approved 25-block / 82-visual-segment film is not prepared');
 let from=0;
 return <AbsoluteFill style={{background:'#0b1420'}}>
  {data.chapters.map(c=>{
    if(c.from!==from)throw Error('Topic movie chapter offset mismatch: '+c.chapterId);
    from+=c.durationFrames;
    return <Sequence key={c.chapterId} from={c.from} durationInFrames={c.durationFrames}
       name={c.chapterId+' topical re-edit'}>
      <TopicChapterFilm chapter={c}/>
    </Sequence>;
  })}
 </AbsoluteFill>;
};
