import React from 'react';
import {Composition} from 'remotion';
import sync from './sync-timing.json';
import {V39OvergivingBackfire} from './V39OvergivingBackfire';

export const RemotionRoot:React.FC=()=>{const durationInFrames=Math.max(30,Math.ceil(Number(sync.durationSeconds||1120)*30));return <Composition id="V39OvergivingBackfire" component={V39OvergivingBackfire} durationInFrames={durationInFrames} fps={30} width={1920} height={1080}/>;};
