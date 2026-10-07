import {type Project,Renderer,RendererResult} from '@motion-canvas/core';
declare global{interface Window{renderProject(projectUrl:string,includeAudio:boolean,outputName:string,rangeEnd?:number|null,resolutionScale?:number|null):Promise<string>;}}
window.renderProject=async(projectUrl,includeAudio,outputName,rangeEnd=null,resolutionScale=null)=>{
  const module:{default:Project}=await import(/* @vite-ignore */ projectUrl);
  const project=module.default; const settings=project.meta.getFullRenderingSettings();
  await document.fonts.ready;
  const renderer=new Renderer(project);
  const finished=new Promise<RendererResult>(resolve=>renderer.onFinished.subscribe(resolve));
  await renderer.render({...settings,name:outputName,range:rangeEnd==null?settings.range:[0,rangeEnd],resolutionScale:resolutionScale??settings.resolutionScale,exporter:{...settings.exporter,options:{...(settings.exporter.options as object),includeAudio}}});
  return RendererResult[await finished];
};