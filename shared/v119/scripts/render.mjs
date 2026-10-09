import {access,mkdir,stat,writeFile} from 'node:fs/promises';
import {dirname,join,resolve} from 'node:path';import {fileURLToPath} from 'node:url';
import puppeteer from 'puppeteer';import {createServer} from 'vite';
const ROOT=resolve(dirname(fileURLToPath(import.meta.url)),'..'),slug=process.argv[2],smoke=process.argv.includes('--smoke');
if(!slug)throw new Error('missing chapter slug');
const name=smoke?'v118-'+slug+'-smoke':'v118-'+slug,pf='src/projects/'+slug+'.ts',wav=join(ROOT,'media',slug,'narration.wav');
const audio=!smoke&&await access(wav).then(()=>true,()=>false);
if(!smoke&&!audio)throw new Error('VOICEVOX WAV missing: '+wav);
async function main(){
 await mkdir(join(ROOT,'output'),{recursive:true});
 const server=await createServer({root:ROOT,configFile:join(ROOT,'vite.config.ts'),server:{port:0},logLevel:'warn'});await server.listen();
 const addr=server.httpServer?.address();if(!addr||typeof addr==='string')throw new Error('vite server address');
 const browser=await puppeteer.launch({protocolTimeout:900000,headless:true,args:['--no-sandbox','--use-gl=swiftshader','--enable-unsafe-swiftshader']});
 const page=await browser.newPage();const origin='http://localhost:'+addr.port;
 page.on('pageerror',e=>console.error('BROWSER_PAGE_ERROR',e.message));
 const start=Date.now();try{
  const run=async()=>{await page.goto(origin+'/headless.html',{waitUntil:'networkidle0'});await page.waitForFunction(()=>typeof window.renderProject==='function');return page.evaluate((p,a,n,end,scale)=>window.renderProject(p,a,n,end,scale),'/'+pf+'?project',audio,name,smoke?7:null,smoke?.5:1)};
  let outcome;try{outcome=await run();}catch(e){if(!(e instanceof Error&&e.message.includes('Execution context was destroyed')))throw e;outcome=await run();}
  if(outcome!=='Success')throw new Error(String(outcome));
 }finally{await page.close();await browser.close();await server.close();}
 const file=join(ROOT,'output',name+'.mp4'),info=await stat(file),report={slug,smoke,seconds:Number(((Date.now()-start)/1000).toFixed(1)),bytes:info.size,file};
 if(!smoke)await writeFile(join(ROOT,'render-report-'+slug+'.json'),JSON.stringify(report,null,2));
 console.log(JSON.stringify(report));
}
main().catch(e=>{console.error(e);process.exitCode=1});
