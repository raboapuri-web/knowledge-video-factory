import React from 'react';
import {AbsoluteFill,Img,staticFile} from 'remotion';
import {ParentMotherRig,type ParentMotherRigProps} from './PARENT_MOTHER';

/** Keep the parent independent of the background and other family members. */
export type ParentMotherSceneProps={
  backgroundFile:string;
  parent?:ParentMotherRigProps;
  children?:React.ReactNode;
};
export const ParentMotherBackgroundScene=({
  backgroundFile,parent={},children
}:ParentMotherSceneProps)=>{
  if(!/^[\w.-]+\.(?:png|webp|svg)$/i.test(backgroundFile)||backgroundFile.includes('..'))
    throw Error('backgroundFile must be a filename from 背景/: '+backgroundFile);
  return <AbsoluteFill style={{overflow:'hidden',background:'#d9e3df'}}>
    <Img src={staticFile('assets/library/背景/'+backgroundFile)}
      style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover'}}/>
    <ParentMotherRig {...parent}/>
    {children}
  </AbsoluteFill>;
};
