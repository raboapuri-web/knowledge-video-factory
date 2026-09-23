import React from 'react';
import {Composition,registerRoot} from 'remotion';
import fullJson from './final-review-data.json';
import {CompleteFilm,type CompleteData} from './video-compositions';

const movie=fullJson as CompleteData;
if(movie.status!=='all_160_shots_voicevox_measured_approved_original'||
  !Number.isFinite(movie.durationFrames)||movie.durationFrames<1)
 throw Error('Build approved six-chapter audio manifest before full-film render');
const Root=()=><Composition
 id='ToyokoFullMovie' component={CompleteFilm}
 defaultProps={{data:movie}} width={1920} height={1080}
 fps={30} durationInFrames={movie.durationFrames}/>;
registerRoot(Root);
