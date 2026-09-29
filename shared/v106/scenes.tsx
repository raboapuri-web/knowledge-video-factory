import React from 'react';
import scenes from './scene-data.json';
import {SceneVisual as AuthoredScene,type Beat} from './swiss-engine';
const data=scenes as Beat[];
export const SceneVisual=({n,progress}:{n:number;progress:number})=>{
 const beat=data[n-1];if(!beat)throw Error('V106 missing original Swiss neutrality cut '+n);
 const prior=data.slice(Math.max(0,n-3),n-1).filter(x=>x.environment===beat.environment);
 return <AuthoredScene beat={beat} prior={prior} progress={progress}/>;
};
