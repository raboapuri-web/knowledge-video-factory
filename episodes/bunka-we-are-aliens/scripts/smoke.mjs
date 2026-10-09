import {access, mkdir, stat, writeFile} from 'node:fs/promises';import {resolve,join} from 'node:path';
import puppeteer from 'puppeteer';import {createServer} from 'vite';
const root=resolve(import.meta.dirname,'..');await mkdir(join(root,'output'),{recursive:true});
const ids=process.env.CHAPTERS?process.env.CHAPTERS.split(',').map(Number):[0,1,2,3,4,5,6];
const report=[];
for(const id of ids){
 process.env.VITE_CHAPTER=String(id);
 await access(join(root,'public/media',`chapter-${id}.wav`));
 const data=JSON.parse((await import('node:fs')).readFileSync(join(root,'src/generated',`chapter-${id}.json`)));
 const startFor=(g)=>data.cues.filter(c=>c.group<g).reduce((sum,c)=>sum+c.duration,0);
 const groupIndex=Math.min(5,id===5?0:3); const clips=[0,startFor(groupIndex)];
 const server=await createServer({root,configFile:join(root,'vite.config.ts'),server:{port:0},logLevel:'warn'}); await server.listen();
 const addr=server.httpServer?.address();if(!addr||typeof addr==='string')throw Error('No TCP');
 const browser=await puppeteer.launch({headless:true,args:['--no-sandbox','--use-gl=swiftshader','--enable-unsafe-swiftshader']});
 try{
  const page=await browser.newPage(); page.on('pageerror',e=>console.error('[smoke]',e.message));
  for(const sec of clips){
   await page.goto(`http://localhost:${addr.port}/headless.html`,{waitUntil:'networkidle0'});
   await page.waitForFunction(()=>typeof window.renderProject==='function');
   const result=await page.evaluate((url,time)=>window.renderProject(url,false,time,1.4),'/src/project.ts?project',sec);
   if(result!=='Success')throw Error(`Smoke render failed: ${result}`);
   const name=`aliens-chapter-${id}-smoke-${Math.round(sec)}.mp4`;
   const p=join(root,'output',name);const st=await stat(p);
   report.push({chapter:id,startSeconds:+sec.toFixed(2),bytes:st.size,passed:st.size>1000});
  }
 }finally{await browser.close();await server.close();}
}
await writeFile(join(root,'qa/smoke-report.json'),JSON.stringify(report,null,2));
console.log(report);
