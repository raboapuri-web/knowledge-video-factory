import {createRequire} from 'node:module';
import {defineConfig} from 'vite';
import ffmpeg from '@motion-canvas/ffmpeg';

// @motion-canvas/vite-plugin@3.17.2 is published as CommonJS.
// Its TypeScript source uses "export default", which the package build emits
// as module.exports.default. Read that actual CommonJS export explicitly.
const require = createRequire(import.meta.url);
const motionCanvas = require('@motion-canvas/vite-plugin').default;

export default defineConfig({
  plugins: [
    motionCanvas({project: './src/project.ts'}),
    ffmpeg()
  ],
  server: {host: '127.0.0.1'},
  build: {target: 'es2022'}
});
