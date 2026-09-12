import React from 'react';
import {Composition} from 'remotion';
import sync from './sync-timing.json';
import {V30IgnoranceMetacognition} from './V30IgnoranceMetacognition';

export const RemotionRoot:React.FC=()=>{
  const durationInFrames=Math.max(30,Math.ceil(Number(sync.durationSeconds||1500)*30));
  return <Composition id="V30IgnoranceMetacognition" component={V30IgnoranceMetacognition} durationInFrames={durationInFrames} fps={30} width={1920} height={1080}/>;
};
