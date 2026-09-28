import fs from 'node:fs';
const beats=JSON.parse(fs.readFileSync('src/scene-data.json','utf8'));
const sync=JSON.parse(fs.readFileSync('src/sync-timing.json','utf8'));
if(sync.beats.length!==beats.length)throw Error('VOICEVOX synchronization mismatch: '+sync.beats.length+'/'+beats.length);
let longest=0;const seen=new Set();
for(let i=0;i<beats.length;i++){
 const beat=beats[i],duration=sync.beats[i].end-sync.beats[i].start;
 if(duration<=0||duration>=17)throw Error('Narration cut too long or invalid: '+beat.id+' '+duration.toFixed(2)+'s');
 longest=Math.max(longest,duration);
 if(seen.has(beat.environment)&&(i===0||beats[i-1].environment!==beat.environment))throw Error('Noncontiguous background reuse '+beat.id);
 if(i>0&&beat.actionId===beats[i-1].actionId)throw Error('Repeated foreground action '+beat.id);
 seen.add(beat.environment);
}
console.log('V101 audio and scene check PASS; scenes='+beats.length+' longest='+longest.toFixed(2)+'s.');