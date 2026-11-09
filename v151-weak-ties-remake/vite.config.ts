import {createRequire} from 'node:module';
import {defineConfig} from 'vite';
const require = createRequire(import.meta.url);
const motionCanvas = require('@motion-canvas/vite-plugin').default;
const ffmpeg = require('@motion-canvas/ffmpeg').default;
export default defineConfig({
  plugins: [motionCanvas({project: './src/project.ts'}), ffmpeg()],
  optimizeDeps: {
    entries: ['headless.html','src/headless.ts','src/project.ts','src/scenes/main.tsx'],
    include: [
      '@motion-canvas/ffmpeg/lib/client',
      '@motion-canvas/2d/lib/jsx-dev-runtime',
      '@motion-canvas/2d/lib/jsx-runtime',
      '@motion-canvas/2d',
      '@motion-canvas/core'
    ],
    holdUntilCrawlEnd: true
  },
  server: {host: '127.0.0.1'},
  build: {target: 'es2022'}
});
