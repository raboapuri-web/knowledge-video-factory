import {access,mkdir,stat,writeFile,copyFile} from 'node:fs/promises';
import {join,resolve} from 'node:path';import puppeteer from 'puppeteer';import {createServer} from 'vite';
const root=resolve(import.meta.dirname,'..');const out=join(root,'output');await mkdir(out,{recursive:true});
const ids=process.env.CHAPTERS?process.env.CHAPTERS.split(',').map(Number):[0,1,2,3,4,5,6];
const report=[];
for(const id of ids){
 process.env.VITE_CHAPTER=String(id);
 const narration=join(root,'public/media',`chapter-${id}.wav`);
 await access(narration); // no silent fallback to fake a completed narration
 // Vite serves /media from public/media, but Motion Canvas's FFmpeg exporter
 // resolves the same URL as media/chapter-N.wav relative to the project cwd.
 // Materialize both paths before launching Chromium; do not alter narration.
 const ffmpegAudio=join(root,'media',`chapter-${id}.wav`);
 await mkdir(join(root,'media'),{recursive:true});
 await copyFile(narration,ffmpegAudio);
 await access(ffmpegAudio);
 console.log(`[render] verified FFmpeg narration path: ${ffmpegAudio}`);
 const server=await createServer({root,configFile:join(root,'vite.config.ts'),server:{port:0},logLevel:'warn'});
 await server.listen();const address=server.httpServer?.address();if(!address||typeof address==='string')throw Error('Vite server failed');
 const origin='http://localhost:'+address.port;
 const browser=await puppeteer.launch({headless:true,args:['--no-sandbox','--use-gl=swiftshader','--enable-unsafe-swiftshader']});
 const page=await browser.newPage();page.on('pageerror',e=>console.error(`[ch${id}]`,e.message));
 const t=Date.now();
 try{
   const attempt=async()=>{
     await page.goto(origin+'/headless.html',{waitUntil:'networkidle0'});
     await page.waitForFunction(()=>typeof window.renderProject==='function');
     return page.evaluate((u,a)=>window.renderProject(u,a),'/src/project.ts?project',true);
   };
   let result;try{result=await attempt();}catch(e){if(String(e).includes('Execution context was destroyed'))result=await attempt();else throw e;}
   if(result!=='Success')throw Error(`Motion Canvas failed ch${id}: ${result}`);
 }finally{await page.close();await browser.close();await server.close();}
 const name=`aliens-chapter-${id}.mp4`,p=join(out,name);const st=await stat(p);
 report.push({chapter:id,filename:name,bytes:st.size,wallSeconds:Number(((Date.now()-t)/1000).toFixed(2))});
 console.log(`[render] chapter ${id} ${(st.size/1048576).toFixed(1)} MB`);
}
await writeFile(join(root,'qa/render-report.json'),JSON.stringify(report,null,2));
