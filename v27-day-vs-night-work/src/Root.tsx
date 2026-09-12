import React from 'react';
import {Composition} from 'remotion';
import {V27DayVsNightWork} from './V27DayVsNightWork';
import {getRenderDurationSeconds} from './timing';

export const RemotionRoot:React.FC=()=>(
  <Composition id="V27DayVsNightWork" component={V27DayVsNightWork} durationInFrames={Math.ceil(getRenderDurationSeconds()*30)} fps={30} width={1920} height={1080}/>
);
