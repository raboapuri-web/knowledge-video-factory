import React from 'react';
import {Composition} from 'remotion';
import {V29SiblingsDiverge} from './V29SiblingsDiverge';
import {getRenderDurationSeconds} from './timing';

export const RemotionRoot:React.FC=()=>(
  <Composition id="V29SiblingsDiverge" component={V29SiblingsDiverge} durationInFrames={Math.ceil(getRenderDurationSeconds()*30)} fps={30} width={1920} height={1080}/>
);
