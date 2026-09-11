import React from 'react';
import {Composition} from 'remotion';
import {V25InfoProducts} from './V25InfoProducts';
import {getRenderDurationSeconds} from './timing';

export const RemotionRoot:React.FC=()=>(
  <Composition id="V25InfoProducts" component={V25InfoProducts} durationInFrames={Math.ceil(getRenderDurationSeconds()*30)} fps={30} width={1920} height={1080}/>
);
