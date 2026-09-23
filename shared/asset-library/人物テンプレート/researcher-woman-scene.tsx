import React from 'react';
import {AbsoluteFill,Img,staticFile} from 'remotion';
import {RESEARCHER_WOMAN,type RESEARCHER_WOMANProps} from './RESEARCHER_WOMAN';
export type ResearcherWomanSceneProps={
  backgroundFile:string;researcher?:RESEARCHER_WOMANProps;children?:React.ReactNode;
};
/** Registered, approved background staged into Remotion public directory. */
export const ResearcherWomanBackgroundScene=({
  backgroundFile,researcher={},children
}:ResearcherWomanSceneProps)=>{
  if(!/^[\w.-]+\.(?:png|webp|svg)$/i.test(backgroundFile)||backgroundFile.includes('..'))
    throw Error('backgroundFile must be a filename from 背景/: '+backgroundFile);
  return <AbsoluteFill style={{overflow:'hidden',background:'#e6eef0'}}>
    <Img src={staticFile('assets/library/背景/'+backgroundFile)}
      style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover'}}/>
    <RESEARCHER_WOMAN {...researcher}/>
    {children}
  </AbsoluteFill>;
};
