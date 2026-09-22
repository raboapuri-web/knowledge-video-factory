import React from 'react';
import {AbsoluteFill,Img,staticFile} from 'remotion';
import {OfficeWorkerRig,type OfficeWorkerRigProps} from './office-worker-rig';

/** Composition helper: staged 16:9 background + transparent articulated character.
 * Run stage-background.mjs AFTER prepare.mjs; image files in the Git repository
 * are not automatically served by Remotion's public/ directory.
 */
export type OfficeWorkerBackgroundSceneProps={
  backgroundFile:string;
  worker?:OfficeWorkerRigProps;
  children?:React.ReactNode;
};
export const OfficeWorkerBackgroundScene=({
  backgroundFile,worker={},children
}:OfficeWorkerBackgroundSceneProps)=>{
  if(!/^[\w.-]+\.(?:png|webp|svg)$/i.test(backgroundFile)||
     backgroundFile.includes('..'))throw Error('backgroundFile must be a filename from 背景/: '+backgroundFile);
  return <AbsoluteFill style={{overflow:'hidden',background:'#1b2735'}}>
    <Img src={staticFile('assets/library/背景/'+backgroundFile)}
      style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover'}}/>
    <OfficeWorkerRig {...worker}/>
    {children}
  </AbsoluteFill>;
};
