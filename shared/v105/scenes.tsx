import React from 'react';
import {SceneVisual as PrologueScene} from './immaturity-scenes';
import {ExtendedScene} from './maturity-engine';
import data from './scene-data.json';
const beats=data as Array<{id:string;phase:string}>;
export const SceneVisual=({n,progress}:{n:number;progress:number})=>{
 if(!Number.isInteger(n)||n<1||n>beats.length)throw Error('V105 scene index out of range '+n);
 if(n<=24)return <PrologueScene n={n} progress={progress}/>;
 return <ExtendedScene n={n} progress={progress}/>;
};
