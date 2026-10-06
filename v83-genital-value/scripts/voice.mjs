import path from 'node:path';
import fs from 'node:fs';
import {generateVoicevox} from '../../shared/voice/generate-voicevox.mjs';
const root=path.resolve(import.meta.dirname,'..');
await generateVoicevox(root,{speaker:'青山龍星',style:'ノーマル',speed:1.13,pitchScale:-0.026,intonationScale:0.86,volumeScale:0.96,prePhonemeLength:0.09,postPhonemeLength:0.11,padDuration:0.18});
const sync=JSON.parse(fs.readFileSync(path.join(root,'src/sync-timing.json'),'utf8'));
if(sync.beats.length!==51)throw Error('Expected 51 measured narration beats');
console.log('Measured runtime '+sync.durationSeconds.toFixed(1)+' seconds');
