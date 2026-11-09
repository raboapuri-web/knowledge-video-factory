import {Project, Renderer, RendererResult, RendererState} from '@motion-canvas/core';

declare global {
  interface Window {
    reportV151Progress?: (payload: {frame: number; total: number; elapsedSeconds: number; state: string}) => void;
    renderV151(projectUrl: string, outputName: string, endFrame: number): Promise<string>;
  }
}

window.renderV151 = async (projectUrl, outputName, endFrame) => {
  const startedAt = Date.now();
  console.log('[V151] Loading Motion Canvas project:', projectUrl);
  const loaded = await import(/* @vite-ignore */ projectUrl) as {default: Project};
  const project = loaded.default;
  console.log('[V151] Project loaded; initializing renderer');
  const base = project.meta.getFullRenderingSettings();
  const renderer = new Renderer(project);

  const finished = new Promise<RendererResult>((resolve, reject) => {
    renderer.onFinished.subscribe(resolve);
    renderer.onFrameChanged.subscribe(frame => {
      window.reportV151Progress?.({
        frame,
        total: endFrame,
        elapsedSeconds: Math.round((Date.now() - startedAt) / 1000),
        state: 'rendering'
      });
    });
    renderer.onStateChanged.subscribe(state => {
      console.log('[V151] Renderer state:', RendererState[state] ?? state);
    });
  });

  const settings = {
    ...base,
    name: outputName,
    fps: 30,
    range: [0, endFrame] as [number, number],
    resolutionScale: 1,
    exporter: {
      ...base.exporter,
      name: '@motion-canvas/ffmpeg',
      options: {...(base.exporter.options as object), includeAudio: false, fastStart: true}
    }
  };

  console.log('[V151] Starting render:', JSON.stringify({
    frames: endFrame,
    seconds: endFrame / 30,
    fps: 30,
    exporter: settings.exporter.name
  }));

  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  try {
    const timeout = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(() => {
        renderer.abort();
        reject(new Error('V151_RENDER_TIMEOUT after 300 seconds'));
      }, 300_000);
    });
    // Start render without awaiting it so onFrameChanged and onFinished remain observable.
    const renderTask = renderer.render(settings);
    renderTask.catch(error => console.error('[V151] Renderer task rejected:', error));
    const result = await Promise.race([finished, timeout]);
    console.log('[V151] Render finished:', RendererResult[result], 'elapsedSeconds=', Math.round((Date.now() - startedAt) / 1000));
    return RendererResult[result];
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
};
