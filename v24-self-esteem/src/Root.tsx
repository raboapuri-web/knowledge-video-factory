import React from 'react';
import {Composition} from 'remotion';
import {V24SelfEsteem} from './V24SelfEsteem';
import {getRenderDurationSeconds} from './timing';

export const RemotionRoot:React.FC=()=>(
  <Composition id="V24SelfEsteem" component={V24SelfEsteem} durationInFrames={Math.ceil(getRenderDurationSeconds()*30)} fps={30} width={1920} height={1080}/>
);
