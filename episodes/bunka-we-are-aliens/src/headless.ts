import {type Project, Renderer, RendererResult} from '@motion-canvas/core';
declare global {interface Window {renderProject(projectUrl:string, includeAudio:boolean, clipStart?:number, clipSeconds?:number):Promise<string>}}
window.renderProject=async (url,includeAudio,clipStart,clipSeconds)=>{
  const mod:{default:Project}=await import(/* @vite-ignore */ url);
  const project=mod.default;
  await document.fonts.ready;
  const renderer=new Renderer(project);
  const settings=project.meta.getFullRenderingSettings();
  const finished=new Promise<RendererResult>(resolve=>renderer.onFinished.subscribe(resolve));
  await renderer.render({...settings,name:clipSeconds?`${project.name}-smoke-${Math.round(clipStart??0)}`:project.name,...(clipSeconds?{range:[clipStart??0,(clipStart??0)+clipSeconds]}:{}),exporter:{...settings.exporter,options:{...(settings.exporter.options as object),includeAudio}}});
  return RendererResult[await finished];
};
