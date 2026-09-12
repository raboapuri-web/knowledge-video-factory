import React from 'react';
import {Composition} from 'remotion';
import sync from './sync-timing.json';
import {V29GamblingPoverty} from './V29GamblingPoverty';

export const RemotionRoot:React.FC=()=>{
  const durationInFrames=Math.max(30,Math.ceil(Number(sync.durationSeconds||1200)*30));
  return <Composition id="V29GamblingPoverty" component={V29GamblingPoverty} durationInFrames={durationInFrames} fps={30} width={1920} height={1080}/>;
};
