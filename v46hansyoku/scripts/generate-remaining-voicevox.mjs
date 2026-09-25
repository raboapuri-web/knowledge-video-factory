import fs from 'node:fs';
import path from 'node:path';
import {generateVoicevox} from '../../shared/voice/generate-voicevox.mjs';
const chapter=process.argv[2];if(!['chapter2','chapter3','chapter4','epilogue'].includes(chapter))throw Error('chapter arg required');
const root=path.resolve(import.meta.dirname,'..');
const chapterScript=JSON.parse(fs.readFileSync(path.join(root,'src',chapter+'-script-data.json'),'utf8'));
const genericScript=path.join(root,'src/script-data.json'),genericSync=path.join(root,'src/sync-timing.json');
const backupScript=fs.existsSync(genericScript)?fs.readFileSync(genericScript):null;
const hadSync=fs.existsSync(genericSync),backupSync=hadSync?fs.readFileSync(genericSync):null;
try{
 fs.writeFileSync(genericScript,JSON.stringify(chapterScript,null,2)+'\n');
 const result=await generateVoicevox(root,{speaker:'青山龍星',style:'ノーマル',speed:1.13,pitchScale:-0.026,intonationScale:0.86,volumeScale:0.96,prePhonemeLength:0.09,postPhonemeLength:0.11,padDuration:0.18});
 const sync=JSON.parse(fs.readFileSync(genericSync,'utf8'));
 if(sync.beats.length!==chapterScript.beats.length||sync.beats.some((x,i)=>x.id!==chapterScript.beats[i].id||!(x.end>x.start)))throw Error('measured timing invalid '+chapter);
 sync.status='measured_voicevox_'+chapter;sync.approvedNarration=true;sync.sourceBlobSha=chapterScript.sourceBlobSha;
 sync.voice={speaker:'青山龍星',style:'ノーマル',speed:1.13,pitchScale:-0.026,intonationScale:0.86,volumeScale:0.96};
 fs.writeFileSync(path.join(root,'src',chapter+'-sync-timing.json'),JSON.stringify(sync,null,2)+'\n');
 fs.copyFileSync(path.join(root,'public/audio/narration.m4a'),path.join(root,'public/audio',chapter+'-narration.m4a'));
 fs.copyFileSync(path.join(root,'public/audio/pronunciation-report.json'),path.join(root,'public/audio',chapter+'-pronunciation-report.json'));
 console.log(chapter+' VOICEVOX measured: '+result.durationSeconds+' sec / '+sync.beats.length+' scenes');
}finally{
 if(backupScript)fs.writeFileSync(genericScript,backupScript);else fs.rmSync(genericScript,{force:true});
 if(hadSync&&backupSync)fs.writeFileSync(genericSync,backupSync);else fs.rmSync(genericSync,{force:true});
}
