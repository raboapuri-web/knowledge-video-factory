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
const renderTimeoutMs=smoke?360_000:Math.max(3_600_000,Math.ceil(timing.duration*30_000));
const startedAt=Date.now();
const log=(message,details={})=>console.log(new Date().toISOString(),'[V151 render]',message,JSON.stringify(details));
await mkdir(join(ROOT,'output'),{recursive:true});
let server,browser,page,hardTimeout;
try {
  log('Starting Vite server with explicit dependency pre-bundling');
  server=await createServer({root:ROOT,configFile:join(ROOT,'vite.config.ts'),server:{port:0,host:'127.0.0.1',strictPort:false},logLevel:'info'});
  await server.listen();
  const addr=server.httpServer?.address();
  if(!addr||typeof addr==='string') throw new Error('Vite did not expose a TCP port');
  const origin='http://127.0.0.1:'+addr.port;
  const url=origin+'/headless.html';
  log('Vite server ready',{url});
  const projectModuleUrl=origin+'/src/project.ts?project';
  log('Prewarming Motion Canvas project module',{projectModuleUrl});
  let warmResponse;
  for(let attempt=1;attempt<=3;attempt++){
    try {
      warmResponse=await fetch(projectModuleUrl,{headers:{'Cache-Control':'no-cache'}});
      log('Project module prewarm response',{attempt,status:warmResponse.status});
      if(warmResponse.ok) break;
    } catch(error) { log('Project module prewarm retry',{attempt,error:String(error)}); }
    await new Promise(resolve=>setTimeout(resolve,1000));
  }
  if(!warmResponse?.ok) throw new Error('Project module prewarm failed: HTTP '+(warmResponse?.status??'no response'));
  await warmResponse.text();
  if(typeof server.waitForRequestsIdle==='function') await server.waitForRequestsIdle('/src/project.ts?project');
  const confirm=await fetch(projectModuleUrl);
  log('Project module optimizer stability check',{status:confirm.status});
  if(!confirm.ok) throw new Error('Project module stability check failed: HTTP '+confirm.status);
  await confirm.arrayBuffer();
  // The full Motion Canvas render is one long page.evaluate() call. At the
  // observed ~43 fps, 25,948 frames take about 10 minutes; the old 120s CDP
  // timeout therefore killed a healthy render at frame ~5,232. Keep CDP
  // commands alive for 15 minutes while the independent render watchdog
  // remains responsible for terminating a genuinely stuck render.
  const protocolTimeoutMs=900_000;
  log('Launching Puppeteer Chromium',{executablePath:puppeteer.executablePath(),protocolTimeoutMs});
  browser=await puppeteer.launch({headless:true,protocolTimeout:protocolTimeoutMs,args:['--no-sandbox','--disable-setuid-sandbox','--disable-dev-shm-usage','--disable-gpu','--use-gl=swiftshader','--enable-unsafe-swiftshader']});
  page=await browser.newPage({viewport:{width:1920,height:1080},deviceScaleFactor:1});
  page.on('console',message=>log('BROWSER '+message.type(),{text:message.text()}));
  page.on('pageerror',error=>log('PAGE_ERROR',{message:error.message,stack:error.stack}));
  page.on('requestfailed',request=>log('REQUEST_FAILED',{url:request.url(),error:request.failure()?.errorText||''}));
  page.on('response',response=>{
    if(response.status()>=400) log('HTTP_ERROR_RESPONSE',{status:response.status(),url:response.url(),method:response.request().method(),resourceType:response.request().resourceType()});
  });
  await page.exposeFunction('reportV151Progress',payload=>log('FRAME_PROGRESS',payload));
  log('Opening headless entrypoint');
  await page.goto(url,{waitUntil:'networkidle0',timeout:60_000});
  log('Headless page loaded; waiting for render bridge');
  await page.waitForFunction(()=>typeof window.renderV151==='function',{timeout:60_000});
  log('Render bridge ready; starting Motion Canvas',{frames:endFrame,seconds:endFrame/30,smoke});
  const renderPromise=page.evaluate((name,frames)=>window.renderV151('/src/project.ts?project',name,frames),outputName,endFrame);
  let rejectRenderTimeout;
  const timeoutPromise=new Promise((_,reject)=>{rejectRenderTimeout=reject;});
  hardTimeout=setTimeout(async()=>{
    log('NODE_RENDER_TIMEOUT',{timeoutMs:renderTimeoutMs});
    rejectRenderTimeout(new Error('NODE_RENDER_TIMEOUT after '+renderTimeoutMs+'ms'));
    try{await page?.evaluate(()=>window.close());}catch{}
    try{await browser?.close();}catch{}
  },renderTimeoutMs);
  const result=await Promise.race([renderPromise,timeoutPromise]);
  if(result!=='Success') throw new Error('Motion Canvas renderer returned '+result);
  log('Motion Canvas render completed');
} finally {
  if(hardTimeout) clearTimeout(hardTimeout);
  try{if(page&&!page.isClosed()) await page.close();}catch{}
  try{if(browser) await browser.close();}catch{}
  try{if(server) await server.close();}catch{}
}
const file=join(ROOT,'output',outputName+'.mp4');
const info=await stat(file);
log('Render output verified',{output:file,bytes:info.size,frames:endFrame,seconds:endFrame/30,smoke,elapsedSeconds:Math.round((Date.now()-startedAt)/1000)});
