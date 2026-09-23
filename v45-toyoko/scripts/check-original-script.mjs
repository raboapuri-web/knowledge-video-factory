import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const markdown=fs.readFileSync(path.join(root,'src/approved_original_narration.md'),'utf8').trimEnd();
const script=JSON.parse(fs.readFileSync(path.join(root,'src/script-data.json'),'utf8'));
const plan=JSON.parse(fs.readFileSync(path.join(root,'src/toyoko_scene_plan.json'),'utf8'));
const headings=[...markdown.matchAll(/^# 【(.+?)】$/gm)];
if(headings.length!==6)throw Error('Complete original narration should contain 6 chapter headers');
const paragraphs=headings.map((m,i)=>({
  heading:m[1],
  paragraphs:markdown.slice(m.index,headings[i+1]?.index??markdown.length)
    .split('\n').map(x=>x.trim())
    .filter(x=>x&&!x.startsWith('#')&&!x.startsWith('約')&&!x.startsWith('---'))
}));
const expectedCounts=[26,50,58,66,74,25];
for(let i=0;i<6;i++)if(paragraphs[i].paragraphs.length!==expectedCounts[i])
  throw Error('The approved narration has changed or is incomplete in chapter '+i);
if(!script.approved||!script.originalApprovedScriptRecovered||
   script.sourceFile!=='src/approved_original_narration.md')
  throw Error('Preview is not bound to the user-uploaded approved script');
const ids=plan.scenes.filter(x=>x.chapterId==='prologue').flatMap(x=>x.shots.map(s=>s.shotId));
if(ids.length!==18||script.beats.length!==18)throw Error('18 numbered storyboard cuts required');
for(let i=0;i<18;i++){
  const b=script.beats[i];
  if(b.id!==ids[i]||b.subtitle!==b.narration||
     b.narration!==b.sourceFragments.join('\n')||b.sourceStatus!=='approved_original_verbatim')
    throw Error('Narration or subtitles do not match source for '+ids[i]);
}
const source=paragraphs[0].paragraphs.join('');
const exported=script.beats.flatMap(b=>b.sourceFragments).join('');
if(source!==exported)throw Error('Original prologue text is omitted, duplicated or reordered in 18-shot binding');
console.log('Original user-approved 6-chapter source confirmed.');
console.log('Prologue: 26 paragraphs verbatim and losslessly bound in original order to 18 storyboard shots.');
console.log('Remaining chapters retained unchanged in approved_original_narration.md; not yet assigned to numbered shots.');
