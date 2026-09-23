import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const data=JSON.parse(fs.readFileSync(path.join(root,'src/chapter-selected-data.json'),'utf8'));
const approved=JSON.parse(fs.readFileSync(path.join(root,'src/chapter-approvals.json'),'utf8'));
if(data.chapterId!=='epilogue'||data.status!=='chapter_preview_ready'||data.shots.length!==22||
 data.sourceParagraphCount!==25||data.fps!==30||data.durationFrames<1000||
 !['prologue','chapter1','chapter2','chapter3','chapter4'].every(id=>approved.approvedChapters.some(c=>
   c.chapterId===id&&c.status==='user_approved_final_do_not_rerender')))
 throw Error('Previous five locked chapters or epilogue original review manifest unavailable');
const parts=4,total=data.durationFrames;
const candidates=[...new Set([...data.shots.map(x=>x.fromFrame),total])].sort((a,b)=>a-b);
let previous=0;const segments=[];
for(let i=1;i<=parts;i++){
 const target=Math.round(total*i/parts);
 const min=previous+300,max=i===parts?total:total-300*(parts-i);
 const options=candidates.filter(x=>x>=min&&x<=max);
 const stop=i===parts?total:options.sort((a,b)=>Math.abs(a-target)-Math.abs(b-target))[0];
 if(!Number.isInteger(stop)||stop<=previous)throw Error('Missing four parallel frame boundaries at segment '+i);
 segments.push({id:String(i-1).padStart(2,'0'),start:previous,end:stop-1,frames:stop-previous,
  seconds:Math.round((stop-previous)/30*100)/100});
 previous=stop;
}
if(previous!==total||segments.length!==4||segments.some((s,i)=>s.frames<=0||
   i>0&&s.start!==segments[i-1].end+1))
 throw Error('Epilogue six-way parallel segment plan is not continuous');
const result={chapterId:'epilogue',version:1,sourceApprovedOriginal:'src/approved_original_narration.md',
 fps:30,totalFrames:total,totalScenes:22,plannedDiagrams:3,
 renderWidth:1280,renderHeight:720,
 segments,segmentCount:segments.length};
fs.mkdirSync(path.join(root,'out'),{recursive:true});
fs.writeFileSync(path.join(root,'out/epilogue-segment-plan.json'),JSON.stringify(result,null,2)+'\n');
console.error('Epilogue parallel edit: '+segments.length+' independently renderable segments, '+total+' frames, exactly source-aligned, no audio in parts.');
process.stdout.write(JSON.stringify({include:segments})+'\n');
