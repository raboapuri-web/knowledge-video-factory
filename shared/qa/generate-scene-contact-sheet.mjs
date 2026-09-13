import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';

const videoRoot=path.resolve(process.argv[2]||'.');
const videoPath=path.resolve(process.argv[3]||path.join(videoRoot,'out/final.mp4'));
const outputPath=path.resolve(process.argv[4]||path.join(videoRoot,'out/scene-contact-sheet.jpg'));
const sync=JSON.parse(fs.readFileSync(path.join(videoRoot,'src/sync-timing.json'),'utf8'));
const beats=sync.beats||[];
if(!beats.length) throw new Error('No measured beats found in sync-timing.json');

const tmp=path.join(videoRoot,'.qa-scene-frames');
fs.rmSync(tmp,{recursive:true,force:true});
fs.mkdirSync(tmp,{recursive:true});

for(let i=0;i<beats.length;i++){
  const b=beats[i];
  const t=(Number(b.start)+Number(b.end))/2;
  const out=path.join(tmp,`scene-${String(i+1).padStart(3,'0')}.jpg`);
  execFileSync('ffmpeg',['-y','-loglevel','error','-ss',t.toFixed(3),'-i',videoPath,'-frames:v','1','-vf',`scale=320:180,drawbox=x=0:y=0:w=150:h=34:color=black@0.70:t=fill,drawtext=text='S${String(i+1).padStart(2,'0')}  ${t.toFixed(1)}s':x=8:y=5:fontsize=20:fontcolor=white`,out]);
}

const list=path.join(tmp,'frames.txt');
fs.writeFileSync(list,beats.map((_,i)=>`file '${path.join(tmp,`scene-${String(i+1).padStart(3,'0')}.jpg`).replaceAll("'","'\\''")}'\nduration 1`).join('\n')+'\n');
const cols=8;
const rows=Math.ceil(beats.length/cols);
execFileSync('ffmpeg',['-y','-loglevel','error','-f','concat','-safe','0','-i',list,'-vf',`tile=${cols}x${rows}`, '-frames:v','1','-q:v','2',outputPath]);
console.log(`Scene QA contact sheet: ${beats.length} scenes -> ${outputPath}`);
