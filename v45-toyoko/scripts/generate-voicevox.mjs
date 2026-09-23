import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {generateVoicevox} from '../../shared/voice/generate-voicevox.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const script=JSON.parse(fs.readFileSync(path.join(root,'src/script-data.json'),'utf8'));
if(script.beats?.length!==18)throw Error('Expected 18 narration beats for prologue');
const b=script.beats.map(x=>x.id);
if(new Set(b).size!==18||b.some(x=>!/^P0[1-6]-0[1-3]$/.test(x)))throw Error('Unexpected beat IDs');
const generated=await generateVoicevox(root,{
  speaker:'青山龍星',style:'ノーマル',speed:1.13,pitchScale:-0.026,
  intonationScale:0.86,volumeScale:0.96,prePhonemeLength:0.09,
  postPhonemeLength:0.11,padDuration:0.18
});
const location=path.join(root,'src/sync-timing.json');
const sync=JSON.parse(fs.readFileSync(location,'utf8'));
if(sync.beats.length!==18||sync.beats.some((x,i)=>x.id!==b[i]))throw Error('Audio timing mismatch');
if(sync.beats.some(x=>!(x.end>x.start)))throw Error('Nonpositive VOICEVOX beat length');
if(!(generated.durationSeconds>20))throw Error('Synthesis unexpectedly short');
sync.status='measured_voicevox_provisional_script';
sync.scriptVersion=script.version;
sync.approvedNarration=script.approved===true;
fs.writeFileSync(location,JSON.stringify(sync,null,2)+'\n');
console.log('VOICEVOX 18 beats synthesized, measured seconds: '+generated.durationSeconds.toFixed(2));
