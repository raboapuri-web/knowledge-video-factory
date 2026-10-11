import {access,mkdir,stat,writeFile} from 'node:fs/promises';
import {dirname,join,resolve} from 'node:path';import {fileURLToPath} from 'node:url';
import puppeteer from 'puppeteer';import {createServer} from 'vite';
const ROOT=resolve(dirname(fileURLToPath(import.meta.url)),'..'),slug=process.argv[2],smoke=process.argv.includes('--smoke');
if(!slug)throw new Error('chapter slug required');
const label=smoke?'v124-'+slug+'-smoke':'v124-'+slug;
const wav=join(ROOT,'media',slug,'narration.wav');
if(!smoke)await access(wav);
async function main(){
 await mkdir(join(ROOT,'output'),{recursive:true});
 const server=await createServer({root:ROOT,configFile:join(ROOT,'vite.config.ts'),server:{port:0},logLevel:'warn'});
 await server.listen();const addr=server.httpServer?.address();if(!addr||typeof addr==='string')throw new Error('Bad Vite address');
 const browser=await puppeteer.launch({headless:true,protocolTimeout:900000,args:['--no-sandbox','--disable-dev-shm-usage','--use-gl=swiftshader','--enable-unsafe-swiftshader']});
 const page=await browser.newPage();page.on('pageerror',err=>console.error('PAGE_ERROR',err.message));
 const start=Date.now();try{
  const url='http://localhost:'+addr.port;
  await page.goto(url+'/headless.html',{waitUntil:'networkidle0'});
  await page.waitForFunction(()=>typeof window.renderProject==='function');
  const res=await page.evaluate((pr,a,n,end,scale)=>window.renderProject(pr,a,n,end,scale),'/src/projects/'+slug+'.ts?project',!smoke,label,smoke?8:null,smoke?.5:1);
  if(res!=='Success')throw new Error('RendererResult '+res);
 }finally{await page.close();await browser.close();await server.close();}
 const f=join(ROOT,'output',label+'.mp4'),st=await stat(f);
 if(st.size<10000)throw new Error('Render unexpectedly small');
 const report={chapter:slug,smoke,bytes:st.size,seconds:(Date.now()-start)/1000};
 if(!smoke)await writeFile(join(ROOT,'output',label+'.json'),JSON.stringify(report,null,2));
 console.log(JSON.stringify(report));
}
main().catch(err=>{console.error(err);process.exitCode=1;});
