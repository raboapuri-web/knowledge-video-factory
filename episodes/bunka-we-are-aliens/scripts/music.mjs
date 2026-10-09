import path from 'node:path';import {spawnSync} from 'node:child_process';import {renameSync} from 'node:fs';
const dir=path.resolve(import.meta.dirname,'../output');
const src=path.join(dir,'we-are-aliens-final.mp4');const dst=path.join(dir,'we-are-aliens-final-mix.mp4');
const args=['-y','-hide_banner','-loglevel','error','-i',src,
 '-f','lavfi','-i','sine=frequency=110:sample_rate=48000',
 '-f','lavfi','-i','sine=frequency=164.81:sample_rate=48000',
 '-f','lavfi','-i','sine=frequency=220:sample_rate=48000',
 '-filter_complex','[1:a]volume=0.021,lowpass=f=220[a1];[2:a]volume=0.013,lowpass=f=230[a2];[3:a]volume=0.008,lowpass=f=250[a3];[a1][a2][a3]amix=inputs=3:normalize=0[bed];[0:a][bed]amix=inputs=2:duration=first:dropout_transition=0,alimiter=limit=0.95[a]',
 '-map','0:v:0','-map','[a]','-c:v','copy','-c:a','aac','-b:a','192k','-ar','48000','-shortest',dst];
const r=spawnSync('ffmpeg',args,{encoding:'utf8',maxBuffer:5_000_000});
if(r.status!==0)throw Error('BGM audio mix failed: '+r.stderr);
renameSync(dst,src);console.log(src);
