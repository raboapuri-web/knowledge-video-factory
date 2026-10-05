import {type Project, Renderer, RendererResult} from '@motion-canvas/core';

declare global {
  interface Window {
    renderProject(projectUrl: string, includeAudio: boolean): Promise<string>;
  }
}

window.renderProject = async (projectUrl, includeAudio) => {
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
    name: project.name,
    exporter: {
      ...settings.exporter,
      options: {
        ...(settings.exporter.options as object),
        includeAudio,
      },
    },
  });

  return RendererResult[await finished];
};
