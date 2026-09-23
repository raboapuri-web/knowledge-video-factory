import React from 'react';
import {AbsoluteFill,Img,staticFile} from 'remotion';
import {HoodieGirlRig,type HoodieGirlRigProps} from './hoodie-girl-rig';

export type HoodieGirlBackgroundSceneProps={
  backgroundFile:string;
  girl?:HoodieGirlRigProps;
  children?:React.ReactNode;
};
/** Explicitly select a staged, approved background; place subtitles in children. */
export const HoodieGirlBackgroundScene=({
  backgroundFile,girl={},children
}:HoodieGirlBackgroundSceneProps)=>{
  if(!/^[\w.-]+\.(?:png|webp|svg)$/i.test(backgroundFile)||
     backgroundFile.includes('..'))throw Error('backgroundFile must be a filename from 背景/: '+backgroundFile);
  return <AbsoluteFill style={{overflow:'hidden',background:'#233040'}}>
    <Img src={staticFile('assets/library/背景/'+backgroundFile)}
      style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover'}}/>
    <HoodieGirlRig {...girl}/>
    {children}
  </AbsoluteFill>;
};
