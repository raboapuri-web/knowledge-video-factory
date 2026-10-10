import {access, mkdir, stat, writeFile} from 'node:fs/promises';
import {readFileSync} from 'node:fs';
import {resolve,join} from 'node:path';
import puppeteer from 'puppeteer';
import {createServer} from 'vite';

const root=resolve(import.meta.dirname,'..');
await mkdir(join(root,'output'),{recursive:true});
const ids=process.env.CHAPTERS?process.env.CHAPTERS.split(',').map(Number):[0,1,2,3,4,5,6];
const report=[];
const reloadError=e=>/Execution context was destroyed|Cannot find context with specified id|Navigating frame was detached|frame got detached|net::ERR_ABORTED/i.test(String(e));

for(const id of ids){
  process.env.VITE_CHAPTER=String(id);
  await access(join(root,'public/media',`chapter-${id}.wav`));
  const data=JSON.parse(readFileSync(join(root,'src/generated',`chapter-${id}.json`)));
  const startFor=g=>data.cues.filter(c=>c.group<g).reduce((sum,c)=>sum+c.duration,0);
  const groupIndex=Math.min(5,id===5?0:3);
  const clips=[id===0?0:0.05,id===0?3:3.3,data.introSeconds+startFor(groupIndex)];
  const server=await createServer({root,configFile:join(root,'vite.config.ts'),server:{port:0},logLevel:'warn'});
  await server.listen();
  const addr=server.httpServer?.address();
  if(!addr||typeof addr==='string') throw Error('No TCP');
  const browser=await puppeteer.launch({headless:true,protocolTimeout:1200000,args:['--no-sandbox','--use-gl=swiftshader','--enable-unsafe-swiftshader']});
  try{
    const page=await browser.newPage();
    page.setDefaultTimeout(60000);
    page.on('pageerror',e=>console.error('[smoke:page]',e.message));
    page.on('requestfailed',r=>console.error('[smoke:request]',r.url(),r.failure()?.errorText||''));
    const origin=`http://localhost:${addr.port}`;
    for(const sec of clips){
      let result, lastError;
      // Vite can trigger a one-time full reload after its first dependency optimization.
      // Do not treat that navigation as a failed smoke test. Keep retry bounded.
      for(let attempt=1;attempt<=4;attempt++){
        try{
          await page.goto(origin+'/headless.html',{waitUntil:'networkidle0'});
          await page.waitForFunction(()=>typeof window.renderProject==='function');
          result=await page.evaluate((url,time)=>window.renderProject(url,false,time,1.4),'/src/project.ts?project',sec);
          lastError=undefined;
          break;
        }catch(e){
          lastError=e;
          if(!reloadError(e)||attempt===4) throw e;
          console.warn(`[smoke] Vite reloaded ch${id} t=${sec.toFixed(2)} during warmup (attempt ${attempt}/4); retrying`);
        }
      }
      if(lastError)throw lastError;
      if(result!=='Success')throw Error(`Smoke render failed: ${result}`);
      const name=`aliens-chapter-${id}-smoke-${Math.round(sec)}.mp4`;
      const p=join(root,'output',name);
      const st=await stat(p);
      if(st.size<=1000)throw Error(`Smoke result too small: ${name} ${st.size} bytes`);
      report.push({chapter:id,startSeconds:+sec.toFixed(2),bytes:st.size,passed:true});
    }
    await page.close();
  }finally{
    await browser.close();
    await server.close();
  }
}
await writeFile(join(root,'qa/smoke-report.json'),JSON.stringify(report,null,2));
console.log(report);
