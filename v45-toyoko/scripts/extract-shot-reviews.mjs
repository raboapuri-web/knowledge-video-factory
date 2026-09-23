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
const sync=JSON.parse(fs.readFileSync(path.join(episode,'src/sync-timing.json'),'utf8'));
if(sync.status!=='measured_voicevox_provisional_script'&&sync.status!=='measured_voicevox_approved_script')throw Error('The review screenshots must use measured VOICEVOX shot durations');
if(sync.beats?.length!==18)throw Error('Missing measured timing for 18 cuts');
const rows=[];
for(let i=0;i<shots.length;i++){
  const shot=shots[i];
  const beat=sync.beats[i];
  if(beat?.id!==shot.shotId||!(beat.end>beat.start))throw Error('Invalid beat '+shot.shotId);
  const second=((beat.start+beat.end)/2).toFixed(3);
  const out=path.join(outputDir,shot.shotId+'.png');
  // Invoke ffmpeg with a verified numeric argument instead of parsing a shell TSV.
  const run=spawnSync('ffmpeg',['-y','-loglevel','error','-ss',second,'-i',video,'-frames:v','1',out],
    {encoding:'utf8'});
  if(run.status!==0||!fs.existsSync(out)||fs.statSync(out).size===0){
    throw Error('Could not extract '+shot.shotId+' at '+second+' seconds: '+(run.stderr||run.error));
  }
  rows.push(second+'\t'+shot.shotId);
  console.log(shot.shotId+' -> '+second+'s');
}
if(!(sync.durationSeconds>20))throw Error('Missing measured audio duration');
const files=fs.readdirSync(outputDir).filter(x=>/^P\d\d-\d\d\.png$/.test(x));
if(files.length!==18)throw Error('Expected 18 review images; found '+files.length);
fs.writeFileSync(path.join(episode,'out/shot-timestamps.tsv'),rows.join('\n')+'\n');
console.log('Review export ready: 18 stills and video');
