import fs from 'node:fs';
import path from 'node:path';
import {spawn,execFileSync} from 'node:child_process';
const chapter=process.argv[2];if(!chapter)throw Error('chapter arg');
const root=path.resolve(import.meta.dirname,'..');
const video=path.join(root,'out','v46-'+chapter+'.mp4'),output=path.join(root,'out',chapter+'-contact-sheet.jpg');
const sync=JSON.parse(fs.readFileSync(path.join(root,'src',chapter+'-sync-timing.json'),'utf8'));
const plan=JSON.parse(fs.readFileSync(path.join(root,'scene-plans',chapter+'.json'),'utf8'));
const tmp=path.join(root,'.qa-'+chapter+'-frames');fs.rmSync(tmp,{recursive:true,force:true});fs.mkdirSync(tmp,{recursive:true});
const tasks=[];let serial=0;
for(let i=0;i<sync.beats.length;i++){
 const b=sync.beats[i],scene=plan.scenes[i];
 const n=chapter==='chapter3'?Math.max(2,Number(scene.shotCount||2)):1;
 for(let k=0;k<n;k++){
  const frac=(k+1)/(n+1);
  tasks.push({i:serial++,label:String(i+1).padStart(2,'0')+'-'+String(k+1),t:Number(b.start)+(Number(b.end)-Number(b.start))*frac,out:path.join(tmp,'scene-'+String(serial).padStart(3,'0')+'.jpg')});
 }
}
const run=x=>new Promise((ok,bad)=>{const p=spawn('ffmpeg',['-y','-loglevel','error','-ss',x.t.toFixed(3),'-i',video,'-frames:v','1','-vf',"scale=320:180,drawbox=x=0:y=0:w=190:h=34:color=black@0.70:t=fill,drawtext=text='"+chapter+"-"+(x.label||String(x.i+1).padStart(2,'0'))+"':x=8:y=5:fontsize=20:fontcolor=white",x.out]);p.on('exit',c=>c===0?ok():bad(new Error('ffmpeg '+c)));});
let cursor=0;await Promise.all(Array.from({length:4},async()=>{while(cursor<tasks.length)await run(tasks[cursor++]);}));
const cols=8,rows=Math.ceil(tasks.length/cols);
execFileSync('ffmpeg',['-y','-loglevel','error','-framerate','1','-i',path.join(tmp,'scene-%03d.jpg'),'-vf','tile='+cols+'x'+rows,'-frames:v','1','-q:v','2',output]);
console.log(chapter+' QA: '+tasks.length+' frames / concurrency=4 -> '+output);
