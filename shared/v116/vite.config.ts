import {resolve} from 'node:path';
import {defineConfig} from 'vite';
import motionCanvasPlugin from '@motion-canvas/vite-plugin';
import ffmpegPlugin from '@motion-canvas/ffmpeg';
function interop<T>(value:T):T{return (value as {default?:T}).default??value;}
export default defineConfig({
  optimizeDeps:{include:['@motion-canvas/core','@motion-canvas/2d']},
  plugins:[interop(motionCanvasPlugin)({project:'./src/projects/*/project.ts',output:resolve(process.cwd(),'output')}),interop(ffmpegPlugin)()],
});