import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const doc=JSON.parse(fs.readFileSync(path.join(root,'src/final-review-data.json'),'utf8'));
const plan=JSON.parse(fs.readFileSync(path.join(root,'src/toyoko_scene_plan.json'),'utf8'));
if(doc.status!=='all_160_shots_voicevox_measured_approved_original'||doc.chapters.length!==6)
 throw Error('Full render is not sourced from complete approved narration');
const expected=plan.scenes.flatMap(s=>s.shots.map(x=>x.shotId));
const actual=doc.chapters.flatMap(c=>c.beats.map(b=>b.id));
if(expected.length!==160||actual.length!==160||actual.some((id,i)=>id!==expected[i]))
 throw Error('Finished movie has missing, substituted or reordered storyboard cuts');
const file=path.join(root,'out/toyoko-full-final.mp4');
if(!fs.existsSync(file)||fs.statSync(file).size<200_000)throw Error('Finished video MP4 not found');
const probe=JSON.parse(execFileSync('ffprobe',['-v','error','-show_entries',
 'format=duration,size:stream=index,codec_type,codec_name,width,height,avg_frame_rate',
 '-of','json',file],{encoding:'utf8'}));
const v=probe.streams.find(x=>x.codec_type==='video'),a=probe.streams.find(x=>x.codec_type==='audio');
if(!v||v.width!==1920||v.height!==1080)throw Error('Finished film must be 1920x1080');
if(!a||a.codec_name!=='aac')throw Error('Finished film audio missing or not AAC');
const actualSeconds=+probe.format.duration,expectedSeconds=doc.durationFrames/doc.fps;
if(Math.abs(actualSeconds-expectedSeconds)>2)throw Error('Movie running time differs from exact full timeline '+actualSeconds+' vs '+expectedSeconds);
const report={completed:true,film:'ToyokoFullMovie',file:'out/toyoko-full-final.mp4',
 originalNarration:'src/approved_original_narration.md',chapters:6,
 basicScenes:60,storyboardShots:160,video:{width:v.width,height:v.height,
 fps:v.avg_frame_rate,durationSeconds:actualSeconds,bytes:+probe.format.size},
 audio:{codec:a.codec_name},noApprovedNarrationOmitted:doc.chapters.every(c=>c.beats.every(b=>b.text&&b.caption===b.text))};
fs.writeFileSync(path.join(root,'out/final-render-verification.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
