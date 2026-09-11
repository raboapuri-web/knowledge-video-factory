import React from 'react';
import {Composition} from 'remotion';
import sync from './sync-timing.json';
import {V28ThirtyMinuteSleep} from './V28ThirtyMinuteSleep';

export const RemotionRoot:React.FC=()=>{
  const durationInFrames=Math.max(30,Math.ceil(Number(sync.durationSeconds||1200)*30));
  return <Composition id="V28ThirtyMinuteSleep" component={V28ThirtyMinuteSleep} durationInFrames={durationInFrames} fps={30} width={1920} height={1080}/>;
};
