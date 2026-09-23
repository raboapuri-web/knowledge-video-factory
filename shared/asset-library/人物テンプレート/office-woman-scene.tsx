import React from 'react';
import {AbsoluteFill,Img,staticFile} from 'remotion';
import {OfficeWomanRig,type OfficeWomanRigProps} from './office-woman-rig';

/** Composition helper: staged 16:9 background + transparent articulated character.
 * Run stage-background.mjs AFTER prepare.mjs; image files in the Git repository
 * are not automatically served by Remotion's public/ directory.
 */
export type OfficeWomanBackgroundSceneProps={
  backgroundFile:string;
  woman?:OfficeWomanRigProps;
  children?:React.ReactNode;
};
export const OfficeWomanBackgroundScene=({
  backgroundFile,woman={},children
}:OfficeWomanBackgroundSceneProps)=>{
  if(!/^[\w.-]+\.(?:png|webp|svg)$/i.test(backgroundFile)||
     backgroundFile.includes('..'))throw Error('backgroundFile must be a filename from 背景/: '+backgroundFile);
  return <AbsoluteFill style={{overflow:'hidden',background:'#1b2735'}}>
    <Img src={staticFile('assets/library/背景/'+backgroundFile)}
      style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover'}}/>
    <OfficeWomanRig {...woman}/>
    {children}
  </AbsoluteFill>;
};
