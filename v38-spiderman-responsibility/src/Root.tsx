import React from 'react';
import {Composition} from 'remotion';
import sync from './sync-timing.json';
import {V38SpiderResponsibility} from './V38SpiderResponsibility';

export const RemotionRoot:React.FC=()=>{const durationInFrames=Math.max(30,Math.ceil(Number(sync.durationSeconds||1000)*30));return <Composition id="V38SpiderResponsibility" component={V38SpiderResponsibility} durationInFrames={durationInFrames} fps={30} width={1920} height={1080}/>;};
