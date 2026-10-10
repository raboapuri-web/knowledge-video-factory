import {defineConfig} from 'vite';
import {createRequire} from 'node:module';

// Resolve Motion Canvas CommonJS/ESM default exports explicitly.
// Vite bundles this file before running it; using a plain default import
// sometimes leaves a module namespace object, causing "is not a function".
const require = createRequire(import.meta.url);
function factory(packageName: string): (...args: any[]) => any {
  let candidate: any = require(packageName);
  for (let i = 0; i < 5; i++) {
    if (typeof candidate === 'function') return candidate;
    if (candidate && candidate.default) {
      candidate = candidate.default;
      continue;
    }
    throw new Error(packageName + ' did not provide a callable plugin export');
  }
  throw new Error(packageName + ' exceeded CommonJS/ESM export nesting');
}
const motionCanvas = factory('@motion-canvas/vite-plugin');
const ffmpeg = factory('@motion-canvas/ffmpeg');
export default defineConfig({
  optimizeDeps: {
    include: ['@motion-canvas/core','@motion-canvas/2d','@lezer/javascript'],
  },
  plugins: [
    motionCanvas({
      project: [
        './src/projects/prologue.ts',
        './src/projects/chapter1.ts',
        './src/projects/chapter2.ts',
        './src/projects/chapter3.ts',
        './src/projects/chapter4.ts',
        './src/projects/epilogue.ts',
      ],
      output: './output',
    }),
    ffmpeg(),
  ],
  server: {host: '127.0.0.1', port: 9000, strictPort: true},
});
