import React from 'react';
import beats from './scene-data.json';
import {V103Visual,type Beat} from './scene-engine';
export const SceneVisual=({n,progress}:{n:number;progress:number})=>{
 const b=(beats as Beat[])[n-1];
 if(!b)throw new Error('Missing authored V103 narration scene '+n);
 return <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0,overflow:'hidden',background:'#111923'}}>
  <V103Visual beat={b} progress={progress}/>
 </svg>;
};