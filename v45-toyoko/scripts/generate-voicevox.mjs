import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {generateVoicevox} from '../../shared/voice/generate-voicevox.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const script=JSON.parse(fs.readFileSync(path.join(root,'src/script-data.json'),'utf8'));
const chapter=process.argv[2]??'prologue';
const plan=JSON.parse(fs.readFileSync(path.join(root,'src/toyoko_scene_plan.json'),'utf8'));
const expected=plan.scenes.filter(s=>s.chapterId===chapter).flatMap(s=>s.shots).map(s=>s.shotId);
if(!expected.length||script.beats?.length!==expected.length)throw Error('Narration beats do not match '+chapter);
if(script.approved!==true||script.originalApprovedScriptRecovered!==true||script.sourceFile!=='src/approved_original_narration.md')throw Error('Only actual approved original source may be voiced');
const b=script.beats.map(x=>x.id);
if(new Set(b).size!==expected.length||b.some((id,i)=>id!==expected[i]))throw Error('Narration not matched to exact scene-plan order');
if(chapter!=='prologue'&&script.sourceChapter!==chapter)throw Error('Wrong original source chapter for this VOICEVOX run');
const generated=await generateVoicevox(root,{
  speaker:'青山龍星',style:'ノーマル',speed:1.13,pitchScale:-0.026,
  intonationScale:0.86,volumeScale:0.96,prePhonemeLength:0.09,
  postPhonemeLength:0.11,padDuration:0.18
});
const location=path.join(root,'src/sync-timing.json');
const sync=JSON.parse(fs.readFileSync(location,'utf8'));
if(sync.beats.length!==expected.length||sync.beats.some((x,i)=>x.id!==b[i]))throw Error('Audio timing mismatch');
if(sync.beats.some(x=>!(x.end>x.start)))throw Error('Nonpositive VOICEVOX beat length');
if(!(generated.durationSeconds>20))throw Error('Synthesis unexpectedly short');
sync.status=script.approved===true&&script.originalApprovedScriptRecovered===true?'measured_voicevox_approved_script':'measured_voicevox_provisional_script';
sync.scriptVersion=script.version;
sync.approvedNarration=script.approved===true;
fs.writeFileSync(location,JSON.stringify(sync,null,2)+'\n');
console.log('VOICEVOX '+expected.length+' beats synthesized for '+chapter+', measured seconds: '+generated.durationSeconds.toFixed(2));
