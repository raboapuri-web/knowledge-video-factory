import React from 'react';
import {Composition} from 'remotion';
import {V23LateGenius} from './V23LateGenius';
import {getRenderDurationSeconds} from './timing';

export const RemotionRoot:React.FC=()=>(
  <Composition id="V23LateGenius" component={V23LateGenius} durationInFrames={Math.ceil(getRenderDurationSeconds()*30)} fps={30} width={1920} height={1080}/>
);
