import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const source=JSON.parse(fs.readFileSync(path.join(root,'src/toyoko_scene_plan.json'),'utf8'));
const script=JSON.parse(fs.readFileSync(path.join(root,'src/script-data.json'),'utf8'));
const sync=JSON.parse(fs.readFileSync(path.join(root,'src/sync-timing.json'),'utf8'));
const expected=source.scenes.filter(s=>s.chapterId==='prologue').flatMap(s=>s.shots).map(s=>s.shotId);
if(expected.length!==18||script.beats.length!==18||sync.beats.length!==18)throw Error('Prologue script/timing must have 18 beats');
if(sync.status!=='measured_voicevox_provisional_script'&&sync.status!=='measured_voicevox_approved_script')throw Error('Audio is not VOICEVOX-measured');
if(sync.approvedNarration!==script.approved)throw Error('Voice source approval status changed');
let last=0;
for(let i=0;i<18;i++){
 const b=sync.beats[i],s=script.beats[i];
 if(b.id!==expected[i]||s.id!==expected[i])throw Error('Wrong exact shot ID for audio: '+expected[i]);
 if(s.subtitle!==s.narration||!s.narration?.trim())throw Error('Spoken/subtitle text drift in '+expected[i]);
 if(Math.abs(b.start-last)>.03||!(b.end>b.start))throw Error('VOICEVOX start/end discontinuity: '+b.id);
 last=b.end;
}
if(Math.abs(sync.durationSeconds-last)>.5)throw Error('Final beat not aligned to measured audio');
const audio=path.join(root,'public/audio/narration.m4a');
if(!fs.existsSync(audio)||fs.statSync(audio).size<2000)throw Error('VOICEVOX narration missing');
const audioSeconds=Number(execFileSync('ffprobe',['-v','error','-show_entries','format=duration','-of','default=nw=1:nk=1',audio],{encoding:'utf8'}).trim());
if(Math.abs(audioSeconds-last)>.6)throw Error('Audio stream and beat timings disagree '+audioSeconds+' vs '+last);
console.log('Measured and verified 18/18 speech/subtitle/shot bindings, actual audio seconds='+audioSeconds.toFixed(2));
console.log('Narration status: '+(script.approved?'approved original':'PROVISIONAL RECONSTRUCTION - user approval pending'));
