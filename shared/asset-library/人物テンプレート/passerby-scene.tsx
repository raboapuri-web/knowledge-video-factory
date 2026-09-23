import React from 'react';
import {AbsoluteFill,Img,staticFile} from 'remotion';
import {PASSERBY,type PASSERBYProps} from './PASSERBY';

export type PASSERBYSceneProps={
  backgroundFile:string;crowd?:PASSERBYProps;children?:React.ReactNode;
};
/** Combine five featureless articulated pedestrians with an approved staged scene. */
export const PASSERBYScene=({backgroundFile,crowd={},children}:PASSERBYSceneProps)=>{
  if(!/^[\w.-]+\.(?:png|webp|svg)$/i.test(backgroundFile)||backgroundFile.includes('..'))
    throw Error('backgroundFile must be a filename from 背景/: '+backgroundFile);
  return <AbsoluteFill style={{overflow:'hidden',background:'#dde5ee'}}>
    <Img src={staticFile('assets/library/背景/'+backgroundFile)}
      style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover'}}/>
    <PASSERBY {...crowd}/>
    {children}
  </AbsoluteFill>;
};
