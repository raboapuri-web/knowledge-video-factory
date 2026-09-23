import fs from 'node:fs';
const plan=JSON.parse(fs.readFileSync(new URL('../src/toyoko_scene_plan.json',import.meta.url),'utf8'));
if(plan.scenes.length!==60)throw Error('All six chapters must remain in source of truth');
const all=plan.scenes.flatMap(s=>s.shots);
if(all.length!==160)throw Error('Storyboard 160 shots changed');
const pro=plan.scenes.filter(s=>s.chapterId==='prologue');
const shots=pro.flatMap(s=>s.shots);
if(pro.length!==6||shots.length!==18)throw Error('Prologue expected 6 scenes / 18 cuts');
const ids=shots.map(s=>s.shotId);
if(new Set(ids).size!==18)throw Error('Duplicate prologue shot ID');
const expected=Array.from({length:6},(_,i)=>Array.from({length:3},(_,j)=>'P0'+(i+1)+'-0'+(j+1))).flat();
if(expected.some((s,i)=>ids[i]!==s))throw Error('Prologue ordering changed');
if(shots.reduce((a,s)=>a+s.timing.targetDurationSeconds,0)!==120)throw Error('Provisional 120-second prologue timing changed');
const renderer=fs.readFileSync(new URL('../src/prologue.tsx',import.meta.url),'utf8');
for(const id of ids)if(!renderer.includes("case '"+id+"'"))throw Error('No bespoke visual branch for '+id);
if(fs.existsSync(new URL('../src/script-data.json',import.meta.url))){
 const script=JSON.parse(fs.readFileSync(new URL('../src/script-data.json',import.meta.url),'utf8'));
 if(script.approved!==true||!script.prologue?.trim())throw Error('Narration must be approved full text, not storyboard narrationCue');
}
console.log('Validated '+pro.length+' prologue scenes / '+shots.length+' bespoke storyboard cuts, no shot omitted.');
console.log('Narration is NOT attached; preview must be unvoiced and must not be published as a completed chapter.');
