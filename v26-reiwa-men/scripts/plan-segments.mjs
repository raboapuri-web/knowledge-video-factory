import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const sync=JSON.parse(fs.readFileSync(path.join(root,'src/sync-timing.json'),'utf8'));
const fps=30,targetSeconds=145,maxSeconds=185,segments=[];
let startFrame=0,segmentStartSec=0,lastEndFrame=-1;
for(let i=0;i<sync.beats.length;i++){
  const beat=sync.beats[i]; const elapsed=beat.end-segmentStartSec; const isLast=i===sync.beats.length-1;
  const nextWouldBeTooLong=!isLast&&(sync.beats[i+1].end-segmentStartSec)>maxSeconds;
  if(isLast||elapsed>=targetSeconds||nextWouldBeTooLong){
    const endFrame=isLast?Math.ceil(sync.durationSeconds*fps)-1:Math.max(startFrame,Math.round(beat.end*fps)-1);
    segments.push({id:String(segments.length).padStart(2,'0'),start:startFrame,end:endFrame});
    lastEndFrame=endFrame; startFrame=endFrame+1; segmentStartSec=(endFrame+1)/fps;
  }
}
if(lastEndFrame<Math.ceil(sync.durationSeconds*fps)-1)segments.push({id:String(segments.length).padStart(2,'0'),start:lastEndFrame+1,end:Math.ceil(sync.durationSeconds*fps)-1});
console.log(JSON.stringify({include:segments}));
