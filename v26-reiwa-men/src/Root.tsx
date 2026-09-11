import React from 'react';
import {Composition} from 'remotion';
import {V26ReiwaMen} from './V26ReiwaMen';
import {getRenderDurationSeconds} from './timing';

export const RemotionRoot:React.FC=()=>(
  <Composition id="V26ReiwaMen" component={V26ReiwaMen} durationInFrames={Math.ceil(getRenderDurationSeconds()*30)} fps={30} width={1920} height={1080}/>
);
