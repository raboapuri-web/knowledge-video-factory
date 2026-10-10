import {type Project, Renderer, RendererResult} from '@motion-canvas/core';

declare global {
  interface Window {
    renderProject(projectUrl: string, chapterName: string, smokeSeconds: number): Promise<string>;
  }
}
window.renderProject = async (projectUrl, chapterName, smokeSeconds) => {
  const module: {default: Project} = await import(/* @vite-ignore */ projectUrl);
  const project = module.default;
  const settings = project.meta.getFullRenderingSettings();
  await document.fonts.ready;
  const renderer = new Renderer(project);
  const finished = new Promise<RendererResult>(resolve => {
    renderer.onFinished.subscribe(resolve);
  });
  await renderer.render({
    ...settings,
    ...(smokeSeconds > 0 ? {range: [0, smokeSeconds] as [number, number]} : {}),
    name: chapterName,
    exporter: {
      ...settings.exporter,
      name: '@motion-canvas/ffmpeg',
      options: {...(settings.exporter.options as object), includeAudio: false, fastStart: false},
    },
  });
  return RendererResult[await finished];
};
