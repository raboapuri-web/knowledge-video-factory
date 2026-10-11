import '@fontsource/noto-sans-jp/400.css';
import '@fontsource/noto-sans-jp/700.css';
import {makeProject} from '@motion-canvas/core';
import slides from './scenes/slides?scene';
export default makeProject({name: 'capitalism-slide-pilot', scenes: [slides], audio: '/media/narration.wav'});
