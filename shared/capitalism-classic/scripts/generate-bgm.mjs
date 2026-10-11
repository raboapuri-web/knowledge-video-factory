import {spawnSync} from 'node:child_process';
import {mkdirSync} from 'node:fs';
const dur=Number(process.argv[2]||60);
if(!(dur>0))throw new Error('Need positive duration');
mkdirSync('output',{recursive:true});
// Original low-volume ambient pad: three non-melodic tones. No third-party music.
const filter='[0:a]volume=0.10[a];[1:a]volume=0.075[b];[2:a]volume=0.05[c];[a][b][c]amix=inputs=3:duration=longest,lowpass=f=480,afade=t=in:st=0:d=3,afade=t=out:st='+Math.max(0,dur-5)+':d=4,volume=0.3[m]';
const args=['-y','-hide_banner','-loglevel','error','-f','lavfi','-i','sine=frequency=110:sample_rate=44100:duration='+dur,'-f','lavfi','-i','sine=frequency=164.81:sample_rate=44100:duration='+dur,'-f','lavfi','-i','sine=frequency=220:sample_rate=44100:duration='+dur,'-filter_complex',filter,'-map','[m]','-c:a','aac','-b:a','128k','output/bgm.m4a'];
const r=spawnSync('ffmpeg',args,{stdio:'inherit'});if(r.status!==0)process.exit(r.status??1);
