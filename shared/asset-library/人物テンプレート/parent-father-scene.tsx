import React from 'react';
import {AbsoluteFill,Img,staticFile} from 'remotion';
import {ParentFatherRig,type ParentFatherRigProps} from './PARENT_FATHER';

/** Keep the parent independent of the background and other family members. */
export type ParentFatherSceneProps={
  backgroundFile:string;
  parent?:ParentFatherRigProps;
  children?:React.ReactNode;
};
export const ParentFatherBackgroundScene=({
  backgroundFile,parent={},children
}:ParentFatherSceneProps)=>{
  if(!/^[\w.-]+\.(?:png|webp|svg)$/i.test(backgroundFile)||backgroundFile.includes('..'))
    throw Error('backgroundFile must be a filename from 背景/: '+backgroundFile);
  return <AbsoluteFill style={{overflow:'hidden',background:'#d9e3df'}}>
    <Img src={staticFile('assets/library/背景/'+backgroundFile)}
      style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover'}}/>
    <ParentFatherRig {...parent}/>
    {children}
  </AbsoluteFill>;
};
