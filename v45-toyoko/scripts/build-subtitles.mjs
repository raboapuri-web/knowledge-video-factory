import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const script=JSON.parse(fs.readFileSync(path.join(root,'src/script-data.json'),'utf8'));
const sync=JSON.parse(fs.readFileSync(path.join(root,'src/sync-timing.json'),'utf8'));
if(!sync.status?.startsWith('measured_voicevox_')||sync.beats.length!==18||script.beats.length!==18)
  throw Error('SRT requires 18 VOICEVOX-measured beats');
const stamp=seconds=>{
 const ms=Math.round(seconds*1000),h=Math.floor(ms/3600000),m=Math.floor(ms%3600000/60000),s=Math.floor(ms%60000/1000),z=ms%1000;
 return [String(h).padStart(2,'0'),String(m).padStart(2,'0'),String(s).padStart(2,'0')].join(':')+','+String(z).padStart(3,'0');
};
const split=text=>{
 const chunks=[];let rest=text;
 while(rest.length){
  if(rest.length<=24){chunks.push(rest);break;}
  const p=rest.slice(0,25),found=[...p.matchAll(/[、。！？]/g)].pop();
  const end=found&&found.index!==undefined&&found.index>=10?found.index+1:24;
  chunks.push(rest.slice(0,end));rest=rest.slice(end);
 }
 return chunks;
};
let output=[],n=0;
for(let i=0;i<18;i++){
 const b=sync.beats[i],source=script.beats[i];
 if(b.id!==source.id||source.subtitle!==source.narration)throw Error('Audio/subtitle mismatch '+b.id);
 const chunks=split(source.subtitle),total=chunks.reduce((sum,x)=>sum+x.length,0);
 let seen=0;
 for(const chunk of chunks){
  const from=b.start+(b.end-b.start)*(seen/total);
  seen+=chunk.length;
  const to=b.start+(b.end-b.start)*(seen/total);
  output.push(String(++n)+'\n'+stamp(from)+' --> '+stamp(to)+'\n'+chunk.trim()+'\n');
 }
}
const dest=path.join(root,'out/toyoko-prologue-review.srt');
fs.mkdirSync(path.dirname(dest),{recursive:true});
fs.writeFileSync(dest,output.join('\n')+'\n');
console.log('Generated '+n+' subtitle segments for 18 voice-measured beats; within-beat timing is approximate');
