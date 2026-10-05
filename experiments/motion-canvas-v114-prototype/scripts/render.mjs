import {access, mkdir, stat, writeFile} from 'node:fs/promises';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import puppeteer from 'puppeteer';
import {createServer} from 'vite';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUTPUT = resolve(ROOT, 'output');
const PROJECT = 'src/project.ts';

async function main() {
  await mkdir(OUTPUT, {recursive: true});
  const includeAudio = await access(join(ROOT, 'media/narration.wav')).then(() => true, () => false);

  const server = await createServer({
    root: ROOT,
    configFile: join(ROOT, 'vite.config.ts'),
    server: {port: 0},
    logLevel: 'warn',
  });
  await server.listen();

  const address = server.httpServer?.address();
  if (!address || typeof address === 'string') throw new Error('Vite server missing TCP address');
  const origin = 'http://127.0.0.1:' + address.port;

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--use-gl=swiftshader', '--enable-unsafe-swiftshader'],
  });

  const page = await browser.newPage();
  page.on('pageerror', error => console.error('[page]', error.message));
  page.on('requestfailed', request => console.error('[request]', request.url(), request.failure()?.errorText || ''));

  const started = Date.now();
  try {
    await page.goto(origin + '/headless.html', {waitUntil: 'networkidle0'});
    await page.waitForFunction(() => typeof window.renderProject === 'function');
    const result = await page.evaluate(
      (projectUrl, audio) => window.renderProject(projectUrl, audio),
      '/' + PROJECT + '?project',
      includeAudio,
    );
    if (result !== 'Success') throw new Error('Motion Canvas render failed: ' + result);
  } finally {
    await page.close();
    await browser.close();
    await server.close();
  }

  const file = join(OUTPUT, 'v114-motion-canvas-prototype.mp4');
  const info = await stat(file);
  const report = {
    renderSeconds: Number(((Date.now() - started) / 1000).toFixed(2)),
    bytes: info.size,
    megabytes: Number((info.size / 1024 / 1024).toFixed(2)),
    file,
  };
  await writeFile(join(ROOT, 'render-report.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report));
}

main().catch(error => {
  console.error(error instanceof Error ? error.stack : error);
  process.exitCode = 1;
});
