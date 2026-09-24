import React from 'react';
import {AbsoluteFill,Audio,Composition,Sequence,registerRoot,staticFile,useCurrentFrame} from 'remotion';
import plan from '../scene-plans/prologue.json';
import script from './script-data.json';
import sync from './sync-timing.json';
import subtitles from './subtitle-cues.json';
import {PrologueScene} from './prologue';

const FPS=30;
if(plan.chapterId!=='prologue'||plan.scenes.length!==32||script.beats.length!==32||sync.beats.length!==32)
 throw new Error('Expected exactly 32 prologue scenes with 32 original voice beats');
if(sync.status!=='measured_voicevox_approved_script'||!sync.approvedNarration)
 throw new Error('VOICEVOX measured approved script required before rendering');
const time=sync.beats.map((beat,i)=>{
 const scene=plan.scenes[i],source=script.beats[i];
 if(beat.id!==scene.sceneId||source.id!==beat.id||scene.narrationText!==source.narration||source.subtitle!==source.narration||!(beat.end>beat.start))
  throw new Error('Scene/voice/subtitle content mismatch '+beat.id);
 const from=Math.round(beat.start*FPS),to=Math.round(beat.end*FPS);
 return {scene,from,frames:to-from};
});
if(time.some((beat,i)=>beat.frames<=0||(i>0&&beat.from!==time[i-1].from+time[i-1].frames)))
 throw new Error('Voice segment timing has gaps or overlaps');
const totalFrames=Math.max(Math.ceil(sync.durationSeconds*FPS),time[31].from+time[31].frames);
if(subtitles.cues.some(cue=>!(cue.end>cue.start)||!script.beats.some(b=>b.id===cue.sceneId)))
 throw new Error('Incorrect subtitle cue timing/scene binding');
for(const b of script.beats)if(subtitles.cues.filter(x=>x.sceneId===b.id).map(x=>x.text).join('')!==b.narration)
 throw new Error('Subtitle character exactness failed '+b.id);
const SubtitleLayer=()=>{
 const f=useCurrentFrame(),now=f/FPS;
 const cue=subtitles.cues.find(x=>now>=x.start&&now<x.end);
 return cue?<AbsoluteFill style={{pointerEvents:'none',justifyContent:'flex-end',alignItems:'center',padding:'0 70px 32px',boxSizing:'border-box'}}>
  <div style={{maxWidth:1600,borderRadius:12,background:'rgba(0,0,0,.82)',color:'#fff',fontFamily:'Noto Sans CJK JP,sans-serif',fontSize:36,fontWeight:700,lineHeight:1.38,textAlign:'center',textShadow:'0 3px 7px #000',whiteSpace:'pre-wrap',padding:'13px 23px'}}>
   {cue.text}
  </div>
 </AbsoluteFill>:null;
};
const Film=()=><AbsoluteFill style={{background:'#090e13'}}>
 <Audio src={staticFile('audio/narration.m4a')}/>
 {time.map(({scene,from,frames},index)=><Sequence key={scene.sceneId} name={scene.sceneId} from={from} durationInFrames={frames}>
  <PrologueScene scene={scene} index={index} frames={frames}/>
 </Sequence>)}
 <SubtitleLayer/>
</AbsoluteFill>;
const Root=()=> <Composition id="V46HansyokuPrologue" component={Film} durationInFrames={totalFrames} fps={FPS} width={1920} height={1080}/>;
registerRoot(Root);
