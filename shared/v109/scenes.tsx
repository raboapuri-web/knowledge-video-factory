import React from 'react';
import data from './scene-data.json';
import {SceneVisual as AuthoredScene,type Beat} from './office-engine';
const beats=data as Beat[];
export const SceneVisual=({n,progress}:{n:number;progress:number})=>{const beat=beats[n-1];if(!beat)throw Error('V109 missing authored scene '+n);return <AuthoredScene beat={beat} progress={progress}/>;};