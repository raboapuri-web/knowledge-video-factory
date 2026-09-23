import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const chapter=process.argv[2];
const CHAPTERS=['prologue','chapter1','chapter2','chapter3','chapter4','epilogue'];
if(!CHAPTERS.includes(chapter))throw Error('Expected six-chapter identifier');
const fps=30;
const plan=JSON.parse(fs.readFileSync(path.join(root,'src/toyoko_scene_plan.json'),'utf8'));
const script=JSON.parse(fs.readFileSync(path.join(root,'src/script-data.json'),'utf8'));
const timing=JSON.parse(fs.readFileSync(path.join(root,'src/sync-timing.json'),'utf8'));
const shots=plan.scenes.filter(s=>s.chapterId===chapter).flatMap(s=>s.shots);
if(!script.approved||!script.originalApprovedScriptRecovered||script.sourceChapter!==chapter&&!(chapter==='prologue'&&script.sourceChapter==='プロローグ'))
  throw Error('Original user-approved narration must be bound to '+chapter);
if(!timing.status?.startsWith('measured_voicevox_approved_script')||timing.approvedNarration!==true)
  throw Error('The complete approved VOICEVOX audio must be synthesized first');
if(shots.length!==script.beats.length||shots.length!==timing.beats.length)
  throw Error('Number of exact storyboard shots does not match VOICEVOX');
let previous=0,previousFrame=0;
const beats=shots.map((shot,i)=>{
 const text=script.beats[i],audio=timing.beats[i];
 if(text.id!==shot.shotId||audio.id!==shot.shotId||text.subtitle!==text.narration||!text.narration)
  throw Error('Exact source/cue binding missing at '+shot.shotId);
 if(Math.abs(audio.start-previous)>.05||!(audio.end>audio.start))
  throw Error('Measured VOICEVOX beat discontinuity at '+shot.shotId);
 const from=Math.round(audio.start*fps),end=Math.round(audio.end*fps),frames=end-from;
 if(frames<1||from!==previousFrame)throw Error('Measured frame discontinuity: '+shot.shotId);
 previous=audio.end;previousFrame=end;
 return {id:shot.shotId,from,frames,text:text.narration,caption:text.subtitle,
  sourceFragments:text.sourceFragments,sourceParagraphRange:text.sourceParagraphRange??null};
});
const last=beats.at(-1);
const durationFrames=Math.max(last.from+last.frames+8,Math.ceil(timing.durationSeconds*fps));
const audioPath=path.join(root,'public/audio/narration.m4a');
if(!fs.existsSync(audioPath)||fs.statSync(audioPath).size<3000)throw Error('Narration audio missing');
const audioSeconds=+execFileSync('ffprobe',['-v','error','-show_entries','format=duration',
 '-of','default=nw=1:nk=1',audioPath],{encoding:'utf8'}).trim();
if(!Number.isFinite(audioSeconds)||Math.abs(audioSeconds-last.from/fps-last.frames/fps)>.75)
 throw Error('Audio stream differs from measured last beat: '+audioSeconds);
const doc={status:'voicevox_measured_approved_script',chapterId:chapter,
 durationFrames,actualVoiceSeconds:audioSeconds,fps,audioFile:'audio/narration.m4a',beats};
fs.writeFileSync(path.join(root,'src/chapter-review-data.json'),JSON.stringify(doc,null,2)+'\n');
const dir=path.join(root,'out/chapter-bundle',chapter);
fs.mkdirSync(dir,{recursive:true});
fs.copyFileSync(audioPath,path.join(dir,'narration.m4a'));
fs.writeFileSync(path.join(dir,'chapter-data.json'),JSON.stringify(doc,null,2)+'\n');
console.log('Chapter '+chapter+': '+beats.length+' cuts, '+audioSeconds.toFixed(2)+'s approved narration, '+durationFrames+' frames.');
