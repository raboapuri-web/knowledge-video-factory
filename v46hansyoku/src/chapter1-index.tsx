import React from 'react';
import {AbsoluteFill,Audio,Composition,Sequence,registerRoot,staticFile,useCurrentFrame} from 'remotion';
import plan from '../scene-plans/chapter1.json';
import script from './chapter1-script-data.json';
import sync from './chapter1-sync-timing.json';
import subtitles from './chapter1-subtitle-cues.json';
import {Chapter1Scene} from './chapter1';

const FPS=30;
if(plan.chapterId!=='chapter1'||plan.scenes.length!==36||script.beats.length!==36||sync.beats.length!==36)
 throw new Error('Expected exactly 36 Chapter1 scenes and measured voice beats');
if(sync.status!=='measured_voicevox_chapter1'||!sync.approvedNarration)
 throw new Error('Measured Chapter1 VOICEVOX is required before rendering');
const timeline=sync.beats.map((beat:any,i:number)=>{
 const scene:any=plan.scenes[i],source:any=script.beats[i];
 if(beat.id!==scene.sceneId||source.id!==beat.id||scene.narrationText!==source.narration||source.subtitle!==source.narration||!(beat.end>beat.start))
  throw new Error('Chapter1 scene/voice/subtitle mismatch '+beat.id);
 const from=Math.round(beat.start*FPS),to=Math.round(beat.end*FPS);
 return {scene,from,frames:to-from};
});
if(timeline.some((b:any,i:number)=>b.frames<=0||(i>0&&b.from!==timeline[i-1].from+timeline[i-1].frames)))
 throw new Error('Chapter1 voice timing has gaps or overlaps');
const totalFrames=Math.max(Math.ceil(sync.durationSeconds*FPS),timeline[35].from+timeline[35].frames);
if((subtitles as any).cues.some((cue:any)=>!(cue.end>cue.start)||!script.beats.some((b:any)=>b.id===cue.sceneId)))
 throw new Error('Incorrect Chapter1 subtitle timing/scene binding');
for(const b of script.beats)if((subtitles as any).cues.filter((x:any)=>x.sceneId===b.id).map((x:any)=>x.text).join('')!==b.narration)
 throw new Error('Chapter1 subtitle exactness failed '+b.id);

const SubtitleLayer=()=>{
 const f=useCurrentFrame(),now=f/FPS;
 const cue=(subtitles as any).cues.find((x:any)=>now>=x.start&&now<x.end);
 return cue?<AbsoluteFill style={{pointerEvents:'none',justifyContent:'flex-end',alignItems:'center',padding:'0 70px 32px',boxSizing:'border-box'}}>
  <div style={{maxWidth:1600,borderRadius:12,background:'rgba(0,0,0,.82)',color:'#fff',fontFamily:'Noto Sans CJK JP,sans-serif',fontSize:36,fontWeight:700,lineHeight:1.38,textAlign:'center',textShadow:'0 3px 7px #000',whiteSpace:'pre-wrap',padding:'13px 23px'}}>
   {cue.text}
  </div>
 </AbsoluteFill>:null;
};
const Film=()=><AbsoluteFill style={{background:'#090e13'}}>
 <Audio src={staticFile('audio/chapter1-narration.m4a')}/>
 {timeline.map(({scene,from,frames}:any,index:number)=><Sequence key={scene.sceneId} name={scene.sceneId} from={from} durationInFrames={frames}>
  <Chapter1Scene scene={scene} index={index} frames={frames}/>
 </Sequence>)}
 <SubtitleLayer/>
</AbsoluteFill>;
const Root=()=> <Composition id="V46HansyokuChapter1" component={Film} durationInFrames={totalFrames} fps={FPS} width={1920} height={1080}/>;
registerRoot(Root);
