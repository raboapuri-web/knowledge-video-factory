import React from 'react';
import {Composition} from 'remotion';
import sync from './sync-timing.json';
import {V32AcademicComplex} from './V32AcademicComplex';

export const RemotionRoot:React.FC=()=>{
  const durationInFrames=Math.max(30,Math.ceil(Number(sync.durationSeconds||1500)*30));
  return <Composition id="V32AcademicComplex" component={V32AcademicComplex} durationInFrames={durationInFrames} fps={30} width={1920} height={1080}/>;
};
