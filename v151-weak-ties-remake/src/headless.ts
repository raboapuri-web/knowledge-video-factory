import {Project, Renderer, RendererResult} from '@motion-canvas/core';

declare global {
  interface Window {
    renderV151(projectUrl: string, outputName: string, endFrame: number): Promise<string>;
  }
}

window.renderV151 = async (projectUrl, outputName, endFrame) => {
  const loaded = await import(/* @vite-ignore */ projectUrl) as {default: Project};
  const project = loaded.default;
  const base = project.meta.getFullRenderingSettings();
  const renderer = new Renderer(project);
  const finished = new Promise<RendererResult>(resolve => renderer.onFinished.subscribe(resolve));
  await renderer.render({
    ...base,
    name: outputName,
    fps: 30,
    size: {x: 1920, y: 1080},
    range: [0, endFrame],
    resolutionScale: 1,
    exporter: {
      ...base.exporter,
      name: '@motion-canvas/ffmpeg',
      options: {...(base.exporter.options as object), includeAudio: false, fastStart: true}
    }
  });
  return RendererResult[await finished];
};