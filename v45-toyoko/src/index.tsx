import React from 'react';
import {AbsoluteFill, Audio, Composition, Sequence, registerRoot, staticFile, useCurrentFrame} from 'remotion';
import script from './script-data.json';
import syncData from './sync-timing.json';
import storyboard from './toyoko_scene_plan.json';
import {PrologueShot, type ToyokoShot} from './prologue';

type BackgroundAsset={id:string;assetFile?:string;sourceOrBrief?:string};
type Plan={assetRegistry:{backgrounds:BackgroundAsset[]};scenes:{
  id:string;chapterId:string;shots:ToyokoShot[];
}[]};

const plan=storyboard as unknown as Plan;
const chapters=plan.scenes.filter(s=>s.chapterId==='prologue');
const shots=chapters.flatMap(s=>s.shots);
const FPS=30;
const backgrounds=new Map(plan.assetRegistry.backgrounds.map(a=>[a.id,a]));
if(chapters.length!==6||shots.length!==18)throw Error('Expected exact approved prologue: 6 scenes / 18 cuts');

const resolveBackground=(id:string)=>{
  const source=backgrounds.get(id);
  if(!source)throw Error('Background ID is not in asset registry: '+id);
  const rel=source.assetFile||('shared/asset-library/'+(source.sourceOrBrief||''));
  const match=rel.match(/^shared\/asset-library\/背景\/([\w.-]+\.png)$/i);
  if(!match)throw Error('Background asset has no verified PNG binding: '+id);
  return match[1];
};

export const shotRanges=shots.reduce<{shot:ToyokoShot;from:number;frames:number}[]>((list,shot)=>{
  const from=list.length?list[list.length-1].from+list[list.length-1].frames:0;
  const frames=Math.round(shot.timing.targetDurationSeconds*FPS);
  return [...list,{shot,from,frames}];
},[]);
export const previewFrames=shotRanges.reduce((n,x)=>n+x.frames,0);
if(previewFrames!==3600)throw Error('Unexpected provisional preview duration '+previewFrames);

export const ToyokoPrologueReview=()=><AbsoluteFill style={{background:'#101319'}}>
  {shotRanges.map(({shot,from,frames})=><Sequence key={shot.shotId}
    name={shot.shotId} from={from} durationInFrames={frames}>
    <PrologueShot shot={shot} file={resolveBackground(shot.background)}/>
  </Sequence>)}
</AbsoluteFill>;


type SyncBeat={id:string;index:number;start:number;end:number};
type Sync={durationSeconds:number;beats:SyncBeat[];status?:string;approvedNarration?:boolean};
type NarrationBeat={id:string;narration:string;subtitle:string};
const narration=(script.beats as NarrationBeat[]);
const timing=syncData as Sync;
const getVoicedRanges=()=>{
  if(timing.status!=='measured_voicevox_provisional_script'&&timing.status!=='measured_voicevox_approved_script')
    throw Error('VOICEVOX measured timing has not been produced. Run scripts/generate-voicevox.mjs before the voiced render.');
  if(timing.beats.length!==18||narration.length!==18)throw Error('Missing shot-aligned speech and subtitles');
  const ranges=timing.beats.map((beat,i)=>{
    if(beat.id!==shots[i]?.shotId||beat.id!==narration[i]?.id||narration[i].subtitle!==narration[i].narration)
      throw Error('Audio / subtitle / scene-plan binding mismatch at '+beat.id);
    if(!(beat.end>beat.start)||beat.start<0)throw Error('Bad measured timestamp: '+beat.id);
    const from=Math.round(beat.start*FPS);
    const end=Math.round(beat.end*FPS);
    return {shot:shots[i],text:narration[i].subtitle,from,frames:Math.max(1,end-from)};
  });
  for(let i=1;i<ranges.length;i++)if(ranges[i].from!==ranges[i-1].from+ranges[i-1].frames)
    throw Error('VOICEVOX beat frame boundaries not contiguous');
  return ranges;
};

/** Separate, topmost subtitles; displayed text matches the VOICEVOX source verbatim. */
const Subtitle=({text,frames}:{text:string;frames:number})=>{
  const frame=useCurrentFrame();
  const chunks:string[]=[];
  // Chunk only for typography: do not alter or paraphrase the spoken narration.
  let rest=text;
  while(rest.length){
    if(rest.length<=24){chunks.push(rest);break;}
    const p=rest.slice(0,25);
    const match=[...p.matchAll(/[、。！？]/g)].pop();
    const end=match&&match.index!==undefined&&match.index>=10?match.index+1:24;
    chunks.push(rest.slice(0,end));
    rest=rest.slice(end);
  }
  const weights=chunks.map(x=>Math.max(1,x.length));
  const total=weights.reduce((n,x)=>n+x,0);
  const target=Math.max(0,Math.min(1,frame/Math.max(1,frames-1)))*total;
  let current=0,index=0;
  for(let i=0;i<weights.length;i++){current+=weights[i];index=i;if(target<current)break;}
  return <div style={{position:'absolute',left:90,right:90,bottom:29,
    display:'flex',justifyContent:'center',pointerEvents:'none'}}>
    <div style={{maxWidth:1560,borderRadius:12,padding:'12px 25px',
      fontFamily:'Noto Sans JP, sans-serif',fontSize:34,fontWeight:750,
      lineHeight:1.42,textAlign:'center',color:'#fff',background:'rgba(0,0,0,.74)',
      textShadow:'0 2px 7px rgba(0,0,0,.9)',whiteSpace:'pre-wrap'}}>
      {chunks[index]}
    </div>
  </div>;
};

export const ToyokoPrologueVoicedReview=()=>{
  const ranges=getVoicedRanges();
  return <AbsoluteFill style={{background:'#0a101a'}}>
    {ranges.map(({shot,text,from,frames})=><Sequence key={shot.shotId}
      name={shot.shotId} from={from} durationInFrames={frames}>
      <PrologueShot shot={shot} file={resolveBackground(shot.background)} durationSeconds={frames/FPS}/>
      <Subtitle text={text} frames={frames}/>
    </Sequence>)}
    <Audio src={staticFile('audio/narration.m4a')} volume={1}/>
  </AbsoluteFill>;
};

const Root=()=> <>
  <Composition id='ToyokoPrologueReview' component={ToyokoPrologueReview}
    width={1920} height={1080} fps={FPS} durationInFrames={previewFrames}/>
  <Composition id='ToyokoPrologueVoicedReview' component={ToyokoPrologueVoicedReview}
    width={1920} height={1080} fps={FPS} durationInFrames={previewFrames}
    calculateMetadata={async()=>{
      const ranges=getVoicedRanges();
      const final=ranges[ranges.length-1];
      return {durationInFrames:Math.max(1,final.from+final.frames+Math.ceil(.25*FPS))};
    }}/>
</>;

registerRoot(Root);
