import React from 'react';
import data from './scene-data.json';
import {V104Visual,V104Beat} from './civic-engine';
import {C,R} from './primitives';
const beats=data as V104Beat[];
export const SceneVisual=({n,progress}:{n:number;progress:number})=>{
 const b=beats[n-1];if(!b)throw Error('Missing authored V104 scene '+n);
 const p=Math.max(0,Math.min(1,progress)),scale=b.shotKind==='macro'?1.05:b.shotKind==='detail'?1.018:1;
 return <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0,overflow:'hidden'}}>
  <g data-scene={b.sceneKey} data-action={b.actionId} data-family={b.family} data-bg={b.bgGroup} transform={'translate('+(960*(1-scale))+' '+(540*(1-scale))+') scale('+scale+')'}><V104Visual beat={b} progress={p}/></g>
  <R x={0} y={0} w={1920} h={1080} c={C.night} o={.027}/>
 </svg>;
};
