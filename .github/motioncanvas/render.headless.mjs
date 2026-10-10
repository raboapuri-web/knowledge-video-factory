/**
 * Headless rendering of one Motion Canvas chapter.
 * The browser page invokes the public Renderer API; no editor UI selectors.
 * Audio is handled at the chapter muxing stage, so visuals are exported silent.
 */
import puppeteer from 'puppeteer';
import {createServer} from 'vite';
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';

const chapters=['prologue','chapter1','chapter2','chapter3','chapter4','epilogue'];
const chapter=process.env.CHAPTER||process.argv[2];
if(!chapters.includes(chapter)) throw new Error('Invalid chapter: '+chapter);
const smokeSeconds=Number(process.env.SMOKE_SECONDS||0);
const cwd=process.cwd();
const output=path.join(cwd,'output');
const qa=path.join(cwd,'qa');
fs.mkdirSync(output,{recursive:true});
fs.mkdirSync(qa,{recursive:true});
const port=Number(process.env.PORT||9000);
const server=await createServer({
  configFile:path.join(cwd,'vite.config.ts'),
  server:{port,strictPort:true,host:'127.0.0.1'},
  logLevel:'info',
});
let browser;
let page;
const pageErrors=[];
function allFiles(dir){
  if(!fs.existsSync(dir))return [];
  return fs.readdirSync(dir,{withFileTypes:true}).flatMap(f=>
    f.isDirectory()?allFiles(path.join(dir,f.name)):[path.join(dir,f.name)]);
}
const before=new Map(allFiles(output).filter(f=>f.endsWith('.mp4')).map(f=>[f,fs.statSync(f).mtimeMs]));
try{
  await server.listen();
  const address=server.httpServer?.address();
  if(!address||typeof address==='string')throw new Error('No server TCP address');
  const origin='http://127.0.0.1:'+address.port;
  browser=await puppeteer.launch({
    headless:true,executablePath:process.env.CHROME_BIN||'/usr/bin/google-chrome',
    protocolTimeout:7200000,
    args:['--no-sandbox','--disable-dev-shm-usage','--use-gl=swiftshader',
          '--enable-unsafe-swiftshader','--autoplay-policy=no-user-gesture-required'],
  });
  page=await browser.newPage();
  await page.setViewport({width:1920,height:1080,deviceScaleFactor:1});
  page.setDefaultTimeout(60000);
  page.on('pageerror',err=>{const x='PAGE: '+err.stack;pageErrors.push(x);console.error(x)});
  page.on('console',msg=>{if(msg.type()==='error'){pageErrors.push('CONSOLE: '+msg.text());console.error(msg.text())}});
  page.on('requestfailed',req=>console.error('REQUEST:',req.url(),req.failure()?.errorText));
  page.on('response',res=>{if(res.status()>=400)console.error('HTTP',res.status(),res.url())});
  const projectUrl='/src/projects/'+chapter+'.ts?project';
  console.log('Rendering',chapter,projectUrl,'smokeSeconds='+smokeSeconds);
  let result;
  for(let retry=0;retry<3;retry++){
    try{
      const resp=await page.goto(origin+'/headless.html',{waitUntil:'networkidle0',timeout:120000});
      if(!resp||resp.status()!==200)throw new Error('Headless entry page returned '+resp?.status());
      await page.waitForFunction(()=>typeof window.renderProject==='function',{timeout:90000});
      result=await page.evaluate((project,chap,smoke)=>
        window.renderProject(project,chap,smoke),
        projectUrl,chapter,smokeSeconds);
      break;
    }catch(err){
      const msg=String(err);
      const viteReload=/Execution context was destroyed|Cannot find context|Navigating frame was detached|Target closed/.test(msg);
      if(!viteReload || retry>=2)throw err;
      console.warn('Vite dependency reload interrupted render, retry '+(retry+1),msg);
      await new Promise(resolve=>setTimeout(resolve,1200));
    }
  }
  console.log('Renderer result:',result);
  if(result!=='Success')throw new Error('Motion Canvas renderer did not succeed: '+result);
  const movies=allFiles(output).filter(f=>f.endsWith('.mp4')&&fs.statSync(f).mtimeMs>(before.get(f)||0));
  if(!movies.length)throw new Error('Renderer returned Success but no MP4 found at '+output);
  const produced=movies.sort((a,b)=>fs.statSync(b).mtimeMs-fs.statSync(a).mtimeMs)[0];
  const target=path.join(output,chapter+'-visual.mp4');
  if(path.resolve(produced)!==path.resolve(target))fs.copyFileSync(produced,target);
  const probe=spawnSync('ffprobe',['-v','error','-show_entries','stream=codec_name,width,height,r_frame_rate','-show_entries','format=duration','-of','json',target],{encoding:'utf8'});
  if(probe.status!==0)throw new Error('ffprobe failed: '+probe.stderr);
  const p=JSON.parse(probe.stdout);
  if(!p.streams?.some(s=>s.codec_name==='h264'&&s.width===1920&&s.height===1080))throw new Error('Wrong render format: '+probe.stdout);
  if(Number(p.format?.duration)<1)throw new Error('Rendered MP4 has too little duration: '+probe.stdout);
  console.log('SUCCESS',target,fs.statSync(target).size,'bytes',p.format.duration,'seconds');
}catch(error){
  console.error('FAILED:',error);
  if(page){
    try{await page.screenshot({path:path.join(qa,'failed-'+chapter+'.png')});}catch{}
    try{fs.writeFileSync(path.join(qa,'failed-'+chapter+'.html'),(await page.content()).slice(0,250000));}catch{}
  }
  fs.writeFileSync(path.join(qa,'errors-'+chapter+'.log'),
    String(error)+'\n'+pageErrors.join('\n'));
  process.exitCode=1;
}finally{
  await browser?.close();
  await server.close();
}
