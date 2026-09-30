import React from 'react';
import data from './scene-data.json';
import {SceneVisual as AuthoredScene,type Beat} from './comfort-engine';
const beats=data as Beat[];
export const SceneVisual=({n,progress}:{n:number;progress:number})=>{
 const beat=beats[n-1];
 if(!beat)throw Error('V107 missing authored scene '+n);
 const prior=beats.slice(0,n-1);
 return <AuthoredScene beat={beat} prior={prior} progress={progress}/>;
};