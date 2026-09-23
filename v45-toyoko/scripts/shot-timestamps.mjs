import fs from 'node:fs';
const plan=JSON.parse(fs.readFileSync(new URL('../src/toyoko_scene_plan.json',import.meta.url),'utf8'));
let offset=0;
for(const scene of plan.scenes.filter(x=>x.chapterId==='prologue')){
  for(const shot of scene.shots){
    const d=shot.timing.targetDurationSeconds;
    process.stdout.write((offset+d/2).toFixed(3)+'\t'+shot.shotId+'\n');
    offset+=d;
  }
}
if(offset!==120)throw Error('Expected 120 sec provisional duration');
