import '@fontsource/noto-sans-jp/400.css';
import '@fontsource/noto-sans-jp/700.css';
import {makeProject} from '@motion-canvas/core';
import film from './scenes/film?scene';
const chapter=Number(import.meta.env.VITE_CHAPTER || '0');
export default makeProject({
  name:`aliens-chapter-${chapter}`,
  scenes:[film],
  audio:`/media/chapter-${chapter}.wav`,
});
