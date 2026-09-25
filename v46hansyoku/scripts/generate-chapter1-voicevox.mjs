import fs from 'node:fs';
import path from 'node:path';
import {generateVoicevox} from '../../shared/voice/generate-voicevox.mjs';
const root=path.resolve(import.meta.dirname,'..');
const source=JSON.parse(fs.readFileSync(path.join(root,'src/chapter1-script-data.json'),'utf8'));
const genericScript=path.join(root,'src/script-data.json');
const genericSync=path.join(root,'src/sync-timing.json');
const backupScript=fs.readFileSync(genericScript);
const backupSync=fs.readFileSync(genericSync);
try{
 fs.writeFileSync(genericScript,JSON.stringify(source,null,2)+'\n');
 const result=await generateVoicevox(root,{speaker:'青山龍星',style:'ノーマル',speed:1.13,pitchScale:-0.026,intonationScale:0.86,volumeScale:0.96,prePhonemeLength:0.09,postPhonemeLength:0.11,padDuration:0.18});
 const sync=JSON.parse(fs.readFileSync(genericSync,'utf8'));
 if(sync.beats.length!==36||sync.beats.some((x,i)=>x.id!==source.beats[i].id||!(x.end>x.start)))throw Error('Measured Chapter1 VOICEVOX beats invalid');
 sync.status='measured_voicevox_chapter1';sync.approvedNarration=true;sync.sourceBlobSha=source.sourceBlobSha;
 sync.voice={speaker:'青山龍星',style:'ノーマル',speed:1.13,pitchScale:-0.026,intonationScale:0.86};
 fs.writeFileSync(path.join(root,'src/chapter1-sync-timing.json'),JSON.stringify(sync,null,2)+'\n');
 fs.copyFileSync(path.join(root,'public/audio/narration.m4a'),path.join(root,'public/audio/chapter1-narration.m4a'));
 fs.copyFileSync(path.join(root,'public/audio/pronunciation-report.json'),path.join(root,'public/audio/chapter1-pronunciation-report.json'));
 console.log('Chapter1 exact VOICEVOX beats measured: '+result.durationSeconds+' sec');
}finally{
 fs.writeFileSync(genericScript,backupScript);fs.writeFileSync(genericSync,backupSync);
}