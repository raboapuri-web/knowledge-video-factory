import {createRequire} from 'node:module';
import {defineConfig} from 'vite';

// Both Motion Canvas plugins are published as CommonJS packages in 3.17.2.
// Their source entry points use default exports, emitted as exports.default.
// Resolve both through the same explicit interop path to avoid namespace objects.
const require = createRequire(import.meta.url);
const motionCanvas = require('@motion-canvas/vite-plugin').default;
const ffmpeg = require('@motion-canvas/ffmpeg').default;

export default defineConfig({
  plugins: [
    motionCanvas({project: './src/project.ts'}),
    ffmpeg()
  ],
  server: {host: '127.0.0.1'},
  build: {target: 'es2022'}
});
