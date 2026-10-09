import {spawnSync} from 'node:child_process';import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),duration=Number(process.argv[2]);
if(!Number.isFinite(duration)||duration<=0)throw new Error('duration');
const out=path.join(root,'output/bgm.m4a');fs.mkdirSync(path.dirname(out),{recursive:true});
const args=['-y','-loglevel','error','-f','lavfi','-i',`sine=frequency=55:sample_rate=48000:duration=${duration}`,'-f','lavfi','-i',`sine=frequency=82.41:sample_rate=48000:duration=${duration}`,'-filter_complex',`[0:a]volume=0.1[a0];[1:a]volume=0.055[a1];[a0][a1]amix=inputs=2:normalize=0,lowpass=f=300,afade=t=in:st=0:d=4,afade=t=out:st=${Math.max(0,duration-5)}:d=5[a]`,'-map','[a]','-c:a','aac','-b:a','128k',out];
const p=spawnSync('ffmpeg',args,{stdio:'inherit'});if(p.status!==0)process.exit(p.status??1);
console.log('BGM_OK',out);
