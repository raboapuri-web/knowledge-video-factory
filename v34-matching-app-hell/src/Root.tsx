import React from 'react';
import {Composition} from 'remotion';
import sync from './sync-timing.json';
import {V34MatchingAppHell} from './V34MatchingAppHell';

export const RemotionRoot:React.FC=()=>{
  const durationInFrames=Math.max(30,Math.ceil(Number(sync.durationSeconds||1000)*30));
  return <Composition id="V34MatchingAppHell" component={V34MatchingAppHell} durationInFrames={durationInFrames} fps={30} width={1920} height={1080}/>;
};
