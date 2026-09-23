import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const episode=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const plan=JSON.parse(fs.readFileSync(path.join(episode,'src/toyoko_scene_plan.json'),'utf8'));
const shots=plan.scenes.filter(s=>s.chapterId==='prologue').flatMap(s=>s.shots);
if(shots.length!==18)throw Error('Expected exactly 18 prologue cuts');
const video=path.join(episode,'out/toyoko-prologue-review.mp4');
if(!fs.existsSync(video)||fs.statSync(video).size===0)throw Error('Prologue preview MP4 is missing');
const outputDir=path.join(episode,'out/shot-review');
fs.mkdirSync(outputDir,{recursive:true});
let offset=0;
const rows=[];
for(const shot of shots){
  const duration=shot.timing.targetDurationSeconds;
  if(typeof duration!=='number'||duration<=0)throw Error('Invalid cut duration '+shot.shotId);
  const second=(offset+duration/2).toFixed(3);
  const out=path.join(outputDir,shot.shotId+'.png');
  // Invoke ffmpeg with a verified numeric argument instead of parsing a shell TSV.
  const run=spawnSync('ffmpeg',['-y','-loglevel','error','-ss',second,'-i',video,'-frames:v','1',out],
    {encoding:'utf8'});
  if(run.status!==0||!fs.existsSync(out)||fs.statSync(out).size===0){
    throw Error('Could not extract '+shot.shotId+' at '+second+' seconds: '+(run.stderr||run.error));
  }
  rows.push(second+'\t'+shot.shotId);
  console.log(shot.shotId+' -> '+second+'s');
  offset+=duration;
}
if(offset!==120)throw Error('Storyboard preview is not 120s');
const files=fs.readdirSync(outputDir).filter(x=>/^P\d\d-\d\d\.png$/.test(x));
if(files.length!==18)throw Error('Expected 18 review images; found '+files.length);
fs.writeFileSync(path.join(episode,'out/shot-timestamps.tsv'),rows.join('\n')+'\n');
console.log('Review export ready: 18 stills and video');
