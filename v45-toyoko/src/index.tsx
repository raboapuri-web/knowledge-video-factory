import React from 'react';
import {AbsoluteFill, Composition, Sequence, registerRoot} from 'remotion';
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

const Root=()=> <Composition id='ToyokoPrologueReview'
  component={ToyokoPrologueReview} width={1920} height={1080} fps={FPS}
  durationInFrames={previewFrames}/>;

registerRoot(Root);
