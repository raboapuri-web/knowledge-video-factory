import React from 'react';
import {AbsoluteFill,Img,staticFile} from 'remotion';
import {V46_CHILD_RIG_GIRL,type ChildGirlProps} from './V46_CHILD_RIG_GIRL';
export type ChildGirlSceneProps={backgroundFile:string;child?:ChildGirlProps;children?:React.ReactNode;};
export const ChildGirlBackgroundScene=({backgroundFile,child={},children}:ChildGirlSceneProps)=>{
  if(!/^[\w.-]+\.(?:png|webp|svg)$/i.test(backgroundFile)||backgroundFile.includes('..'))
    throw Error('backgroundFile must be a filename from 背景/: '+backgroundFile);
  return <AbsoluteFill style={{overflow:'hidden',background:'#e5eee6'}}>
    <Img src={staticFile('assets/library/背景/'+backgroundFile)}
      style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover'}}/>
    <V46_CHILD_RIG_GIRL {...child}/>{children}
  </AbsoluteFill>;
};
