import React from 'react';
import {Composition} from 'remotion';
import sync from './sync-timing.json';
import {V40FlynnEffect} from './V40FlynnEffect';
export const RemotionRoot:React.FC=()=>{const durationInFrames=Math.max(30,Math.ceil(Number(sync.durationSeconds||1020)*30));return <Composition id="V40FlynnEffect" component={V40FlynnEffect} durationInFrames={durationInFrames} fps={30} width={1920} height={1080}/>;};
