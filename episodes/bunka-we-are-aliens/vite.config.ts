import {resolve} from 'node:path';
import {defineConfig} from 'vite';
import motionCanvasPlugin from '@motion-canvas/vite-plugin';
import ffmpegPlugin from '@motion-canvas/ffmpeg';
function interop<T>(v:T):T {return (v as {default?:T}).default??v;}
export default defineConfig({
  optimizeDeps:{include:['@motion-canvas/core','@motion-canvas/2d']},
  publicDir:resolve(process.cwd(),'public'),
  plugins:[interop(motionCanvasPlugin)({project:'./src/project.ts',output:resolve(process.cwd(),'output')}),interop(ffmpegPlugin)()],
});
