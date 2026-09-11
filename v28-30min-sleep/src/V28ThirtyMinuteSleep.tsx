import React from 'react';
import {AbsoluteFill,interpolate,useCurrentFrame,useVideoConfig} from 'remotion';
import scriptData from './script-data.json';
import {getActiveBeatAtSeconds} from './timing';
import {CaptionLayer,RichScene,type Beat} from './scenes';

const beats=scriptData.beats as Beat[];

export const V28ThirtyMinuteSleep:React.FC=()=>{
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const active=getActiveBeatAtSeconds(frame/fps);
  const beat=beats[active.index]??beats[0];
  const prev=beats[Math.max(0,active.index-1)]??beat;
  const changed=active.index===0||prev.visual!==beat.visual;
  const fade=changed?interpolate(active.progress,[0,.1],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'}):1;
  return <AbsoluteFill style={{background:'#040507'}}><AbsoluteFill style={{opacity:fade}}><RichScene beat={beat}/></AbsoluteFill><CaptionLayer beat={beat} fade={Math.min(1,fade+.18)}/></AbsoluteFill>;
};
