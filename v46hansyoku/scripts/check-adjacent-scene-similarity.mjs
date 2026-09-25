import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';

const chapter=process.argv[2];
if(!chapter)throw new Error('chapter arg required');
const root=path.resolve(import.meta.dirname,'..');
const dir=path.join(root,'.qa-'+chapter+'-frames');
if(!fs.existsSync(dir))throw new Error('QA frame directory missing: '+dir);

const frames=fs.readdirSync(dir).filter(x=>/^scene-\d+\.jpg$/.test(x)).sort();
if(frames.length<2)throw new Error('Not enough QA frames: '+frames.length);

const threshold=0.95;
const scores=[];
for(let i=0;i<frames.length-1;i++){
 const a=path.join(dir,frames[i]),b=path.join(dir,frames[i+1]);
 const filter='[0:v]crop=iw:ih-78:0:38,scale=160:54[a];[1:v]crop=iw:ih-78:0:38,scale=160:54[b];[a][b]ssim';
 const r=spawnSync('ffmpeg',['-hide_banner','-loglevel','info','-i',a,'-i',b,'-filter_complex',filter,'-f','null','-'],{encoding:'utf8'});
 if(r.status!==0)throw new Error('ffmpeg SSIM failed for '+frames[i]+' / '+frames[i+1]+'\n'+r.stderr);
 const m=String(r.stderr).match(/All:([0-9.]+)/g);
 if(!m?.length)throw new Error('SSIM score not found for '+frames[i]+' / '+frames[i+1]);
 const score=Number(m[m.length-1].split(':')[1]);
 scores.push({a:i+1,b:i+2,score});
}
scores.sort((x,y)=>y.score-x.score);
console.log(chapter+' adjacent-scene SSIM top scores:');
for(const x of scores.slice(0,12))console.log(String(x.a).padStart(2,'0')+' -> '+String(x.b).padStart(2,'0')+' : '+x.score.toFixed(6));
const bad=scores.filter(x=>x.score>=threshold);
if(bad.length){
 console.error('Rejected '+bad.length+' near-duplicate adjacent scene pair(s), threshold='+threshold);
 for(const x of bad)console.error('  '+x.a+' -> '+x.b+' SSIM='+x.score.toFixed(6));
 process.exit(1);
}
console.log('VISUAL DIVERSITY QA PASSED: '+(frames.length-1)+' adjacent pairs below '+threshold);
