import fs from 'node:fs';
const scenes=JSON.parse(fs.readFileSync('src/scene-data.json','utf8')),sync=JSON.parse(fs.readFileSync('src/sync-timing.json','utf8'));
if(sync.beats.length!==scenes.length)throw Error('Narration timing mismatch '+sync.beats.length+'/'+scenes.length);
let max=0;
for(let i=0;i<scenes.length;i++){
 const b=scenes[i],sec=sync.beats[i].end-sync.beats[i].start;
 if(sec<=0||sec>=17)throw Error('V103 shot too long '+b.id+' '+sec.toFixed(2)+'s');
 max=Math.max(max,sec);
 if(i&&scenes[i-1].family===b.family)throw Error('Adjacent visual family duplicated '+b.id);
 const window=scenes.slice(Math.max(0,i-5),i+1);
 if(window.length===6&&new Set(window.map(x=>x.family)).size<5)throw Error('Six-shot similarity '+b.id);
}
console.log('V103 voice and sequence QA PASS: '+scenes.length+' scenes; longest='+max.toFixed(2)+'s; total='+sync.durationSeconds.toFixed(2)+'s');