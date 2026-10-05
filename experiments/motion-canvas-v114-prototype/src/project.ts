import '@fontsource/noto-sans-jp/400.css';
import '@fontsource/noto-sans-jp/700.css';
import {makeProject} from '@motion-canvas/core';
import prototype from './scenes/prototype?scene';

export default makeProject({
  name: 'v114-motion-canvas-prototype',
  scenes: [prototype],
  audio: '/media/narration.wav',
});
