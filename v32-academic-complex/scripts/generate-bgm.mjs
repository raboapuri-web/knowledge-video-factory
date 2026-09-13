import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const sync=JSON.parse(fs.readFileSync(path.join(root,'src/sync-timing.json'),'utf8'));
const out=path.join(root,'public/audio');
fs.mkdirSync(out,{recursive:true});
const d=Math.ceil(sync.durationSeconds+2);
const fadeOut=Math.max(0,d-10);
execFileSync('ffmpeg',['-y','-loglevel','error','-f','lavfi','-i',`sine=frequency=34:duration=${d}`,'-f','lavfi','-i',`sine=frequency=51:duration=${d}`,'-f','lavfi','-i',`anoisesrc=color=brown:duration=${d}:amplitude=0.009`,'-filter_complex',`[0:a]volume=0.0046,lowpass=f=135[a0];[1:a]volume=0.0020,lowpass=f=180[a1];[2:a]lowpass=f=500,highpass=f=30,volume=0.16[a2];[a0][a1][a2]amix=inputs=3,afade=t=in:st=0:d=7,afade=t=out:st=${fadeOut}:d=10,acompressor=threshold=-25dB:ratio=2.0:attack=35:release=500`,'-c:a','aac','-b:a','128k','-ar','48000',path.join(out,'bgm.m4a')]);
console.log(`BGM ready: ${d}s`);
