import {mkdir,stat,readFile} from 'node:fs/promises';
import {dirname,join,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import puppeteer from 'puppeteer';
import {createServer} from 'vite';

const ROOT=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const smoke=process.argv.includes('--smoke');
const timing=JSON.parse(await readFile(join(ROOT,'content/measured-timing.json'),'utf8'));
const outputName=smoke?'v151-smoke':'v151-weak-ties-video';
const endFrame=smoke?150:Math.ceil(timing.duration*30);
await mkdir(join(ROOT,'output'),{recursive:true});
const server=await createServer({root:ROOT,configFile:join(ROOT,'vite.config.ts'),server:{port:0,host:'127.0.0.1'},logLevel:'warn'});
await server.listen();
const addr=server.httpServer?.address();
if(!addr||typeof addr==='string') throw new Error('Vite did not expose a TCP port');
const browser=await puppeteer.launch({headless:true,protocolTimeout:900000,args:['--no-sandbox','--disable-dev-shm-usage','--use-gl=swiftshader','--enable-unsafe-swiftshader']});
const page=await browser.newPage({viewport:{width:1920,height:1080}});
page.on('pageerror',e=>console.error('PAGE_ERROR',e.message));
page.on('requestfailed',r=>console.error('REQUEST_FAILED',r.url(),r.failure()?.errorText||''));
try{
  const url='http://127.0.0.1:'+addr.port+'/headless.html';
  await page.goto(url,{waitUntil:'networkidle0',timeout:120000});
  await page.waitForFunction(()=>typeof window.renderV151==='function',{timeout:120000});
  const result=await page.evaluate((name,frames)=>window.renderV151('/src/project.ts?project',name,frames),outputName,endFrame);
  if(result!=='Success') throw new Error('Motion Canvas renderer returned '+result);
}finally{
  await page.close(); await browser.close(); await server.close();
}
const file=join(ROOT,'output',outputName+'.mp4');
const info=await stat(file);
console.log(JSON.stringify({output:file,bytes:info.size,frames:endFrame,seconds:endFrame/30,smoke},null,2));