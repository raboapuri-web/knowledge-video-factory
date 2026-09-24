import React from 'react';
import {AbsoluteFill,Img,staticFile} from 'remotion';
import {V46_CHILD_RIG_BOY,type ChildBoyProps} from './V46_CHILD_RIG_BOY';
export type ChildBoySceneProps={backgroundFile:string;child?:ChildBoyProps;children?:React.ReactNode;};
export const ChildBoyBackgroundScene=({backgroundFile,child={},children}:ChildBoySceneProps)=>{
  if(!/^[\w.-]+\.(?:png|webp|svg)$/i.test(backgroundFile)||backgroundFile.includes('..'))
    throw Error('backgroundFile must be a filename from 背景/: '+backgroundFile);
  return <AbsoluteFill style={{overflow:'hidden',background:'#e5eee6'}}>
    <Img src={staticFile('assets/library/背景/'+backgroundFile)}
      style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover'}}/>
    <V46_CHILD_RIG_BOY {...child}/>{children}
  </AbsoluteFill>;
};
