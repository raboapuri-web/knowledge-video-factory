import fs from 'node:fs';
const beats=JSON.parse(fs.readFileSync('src/scene-data.json','utf8'));
const timing=JSON.parse(fs.readFileSync('src/sync-timing.json','utf8'));
if(beats.length!==263||timing.beats?.length!==beats.length)throw Error('263 original narration records must have one measured voice interval');
let max=0,total=0;
for(let i=0;i<beats.length;i++){
 const beat=beats[i],measure=timing.beats[i],secs=measure.end-measure.start;
 if(measure.id&&measure.id!==beat.id)throw Error('VOICEVOX scene alignment mismatch '+beat.id);
 if(!(secs>0)||secs>=16.5)throw Error('Overlong or invalid original narration cut '+beat.id+' '+secs.toFixed(2));
 if(i>0&&measure.start<timing.beats[i-1].start)throw Error('Audio order regressed at '+beat.id);
 max=Math.max(max,secs);total+=secs;
 const prior=beats[i-1];
 if(prior?.environment===beat.environment&&prior.primary===beat.primary&&prior.verb===beat.verb)
  throw Error('Adjacent scene repeats the same object and motion '+beat.id);
}
if(!(timing.durationSeconds>=950))throw Error('Full literary narration appears truncated '+timing.durationSeconds);
console.log('V106 sync QA PASS: 263 unique narrated scenes, max shot '+max.toFixed(2)+'s, total video '+Number(timing.durationSeconds).toFixed(2)+'s');