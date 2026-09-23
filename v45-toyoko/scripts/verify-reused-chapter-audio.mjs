import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const full=fs.readFileSync(path.join(root,'src/approved_original_narration.md'),'utf8').trimEnd();
const headings=[...full.matchAll(/^# 【(.+?)】$/gm)];
const names=['prologue','chapter1','chapter2','chapter3','chapter4','epilogue'];
const counts=[26,50,58,66,74,25];
if(headings.length!==6)throw Error('The approved original must have six complete chapters');
const plan=JSON.parse(fs.readFileSync(path.join(root,'src/toyoko_scene_plan.json'),'utf8'));
const shots=new Set(plan.scenes.flatMap(s=>s.shots.map(x=>x.shotId)));
for(let i=0;i<names.length;i++){
 const id=names[i];
 const text=full.slice(headings[i].index,headings[i+1]?.index??full.length);
 const paragraphs=text.split('\n').map(x=>x.trim()).filter(x=>x&&!x.startsWith('#')&&!x.startsWith('約')&&!x.startsWith('---'));
 if(paragraphs.length!==counts[i])throw Error('Original manuscript has changed for '+id);
 const dir=path.join(root,'out/chapter-audio','toyoko-audio-'+id);
 const doc=JSON.parse(fs.readFileSync(path.join(dir,'chapter-data.json'),'utf8'));
 if(doc.chapterId!==id||doc.status!=='voicevox_measured_approved_script')
  throw Error('Cannot reuse chapter audio with different approval status '+id);
 const fragments=doc.beats.flatMap(x=>x.sourceFragments??[]);
 if(fragments.join('')!==paragraphs.join(''))
  throw Error('Reused chapter audio was generated from a DIFFERENT narration: '+id);
 if(doc.beats.some(x=>!shots.has(x.id)||x.caption!==x.text||
    x.text!==x.sourceFragments.join('\n')))
  throw Error('Reused audio/subtitle/visual binding mismatch in '+id);
 const audio=path.join(dir,'narration.m4a');
 if(!fs.existsSync(audio)||fs.statSync(audio).size<3000)
  throw Error('Prior run chapter audio missing for '+id);
 console.log(id+': '+paragraphs.length+' original paragraphs and '+doc.beats.length+' shot-bound narration chunks verified');
}
console.log('Safe to reuse all 6 approved-original chapter audio artifacts; no VOICEVOX rerun required.');
