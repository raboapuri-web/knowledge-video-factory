import React from 'react';
import data from './scene-data.json';
import {GreekScene,StoryScene} from './greek-visuals';

const beats=data as StoryScene[];
export const SceneVisual=({n,progress}:{n:number;progress:number})=>{
 const b=beats[n-1];
 if(!b)throw new Error('Missing authored V101 scene '+n);
 return <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0,overflow:'hidden',background:'#0b1322'}}>
   <GreekScene scene={b} progress={Math.max(0,Math.min(1,progress))}/>
 </svg>;
};