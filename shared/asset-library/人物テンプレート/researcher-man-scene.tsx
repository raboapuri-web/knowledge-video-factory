import React from 'react';
import {AbsoluteFill,Img,staticFile} from 'remotion';
import {RESEARCHER_MAN,type RESEARCHER_MANProps} from './RESEARCHER_MAN';
export type ResearcherSceneProps={
  backgroundFile:string;researcher?:RESEARCHER_MANProps;children?:React.ReactNode;
};
/** Registered, approved background staged into Remotion public directory. */
export const ResearcherBackgroundScene=({
  backgroundFile,researcher={},children
}:ResearcherSceneProps)=>{
  if(!/^[\w.-]+\.(?:png|webp|svg)$/i.test(backgroundFile)||backgroundFile.includes('..'))
    throw Error('backgroundFile must be a filename from 背景/: '+backgroundFile);
  return <AbsoluteFill style={{overflow:'hidden',background:'#e6eef0'}}>
    <Img src={staticFile('assets/library/背景/'+backgroundFile)}
      style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover'}}/>
    <RESEARCHER_MAN {...researcher}/>
    {children}
  </AbsoluteFill>;
};
