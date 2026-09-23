import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const CHAPTERS=['prologue','chapter1','chapter2','chapter3','chapter4','epilogue'];
const expected=[18,32,30,32,32,16],fps=30;
const plan=JSON.parse(fs.readFileSync(path.join(root,'src/toyoko_scene_plan.json'),'utf8'));
if(plan.scenes.length!==60||plan.scenes.flatMap(s=>s.shots).length!==160)
 throw Error('Source-of-truth scene plan must contain 60 scenes, 160 cuts');
let absolute=0;
const chapters=CHAPTERS.map((id,i)=>{
 const base=path.join(root,'out/chapter-audio','toyoko-audio-'+id);
 const data=JSON.parse(fs.readFileSync(path.join(base,'chapter-data.json'),'utf8'));
 if(data.chapterId!==id||data.beats.length!==expected[i]||data.status!=='voicevox_measured_approved_script')
  throw Error('Missing complete approved chapter: '+id);
 const shots=plan.scenes.filter(s=>s.chapterId===id).flatMap(s=>s.shots);
 for(let j=0;j<shots.length;j++)if(shots[j].shotId!==data.beats[j].id)
  throw Error('Incorrect full timeline storyboard shot order in '+id+' '+j);
 if(data.beats[0].from!==0||data.beats.some((b,j)=>b.frames<=0||
    j>0&&b.from!==data.beats[j-1].from+data.beats[j-1].frames))
  throw Error('Noncontinuous VOICEVOX timing for '+id);
 const file=path.join(base,'narration.m4a');
 const actual=+execFileSync('ffprobe',['-v','error','-show_entries','format=duration',
 '-of','default=nw=1:nk=1',file],{encoding:'utf8'}).trim();
 if(!Number.isFinite(actual)||Math.abs(actual-data.actualVoiceSeconds)>.2)
  throw Error('Audio file did not match metadata for '+id);
 const output=path.join(root,'public/audio/chapters',id,'narration.m4a');
 fs.mkdirSync(path.dirname(output),{recursive:true});
 fs.copyFileSync(file,output);
 const chapter={...data,from:absolute,audioFile:'audio/chapters/'+id+'/narration.m4a'};
 absolute+=data.durationFrames;
 return chapter;
});
const data={status:'all_160_shots_voicevox_measured_approved_original',
 source:'src/approved_original_narration.md',fps,
 durationFrames:absolute,chapters};
fs.writeFileSync(path.join(root,'src/final-review-data.json'),JSON.stringify(data,null,2)+'\n');
fs.mkdirSync(path.join(root,'out'),{recursive:true});
fs.writeFileSync(path.join(root,'out/final-audio-manifest.json'),JSON.stringify({
 chapters:chapters.map(c=>({id:c.chapterId,fromFrame:c.from,durationFrames:c.durationFrames,
  voiceSeconds:c.actualVoiceSeconds,shots:c.beats.length})),finalDurationFrames:absolute,
 storyboardShots:160},null,2)+'\n');
console.log('Final Remotion timeline: 6 chapters, 160 cuts, '+(absolute/fps).toFixed(2)+'s, all voices approved original.');
