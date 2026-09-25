import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..'),repo=path.resolve(root,'..');
const original=fs.readFileSync(path.join(root,'考える夜_繁殖の権利_文学的改稿.txt'),'utf8');
const plan=JSON.parse(fs.readFileSync(path.join(root,'scene-plans/chapter1.json'),'utf8'));
const data=JSON.parse(fs.readFileSync(path.join(root,'src/chapter1-script-data.json'),'utf8'));
if(plan.chapterId!=='chapter1'||plan.scenes.length!==36||data.beats.length!==36)throw Error('Expected exactly 36 Chapter1 scenes');
if(data.sourceBlobSha!==plan.source.blobSha)throw Error('Chapter1 source SHA metadata differs');
for(let i=0;i<36;i++){
 const s=plan.scenes[i],b=data.beats[i],r=s.narrationSourceRange;
 if(s.sceneId!==b.id||s.narrationText!==b.narration||b.narration!==b.subtitle)throw Error('Narration mismatch '+s.sceneId);
 if(original.slice(r.startOffsetUTF16,r.endOffsetExclusiveUTF16)!==s.narrationText)throw Error('Source range mismatch '+s.sceneId);
 for(const a of s.requiredAssets){
  if(a.origin==='scene_implementation')continue;
  if(!a.filePath||!fs.existsSync(path.join(repo,a.filePath)))throw Error('Missing required asset '+s.sceneId+' '+a.assetId+' '+a.filePath);
 }
}
const first=plan.scenes[0].narrationSourceRange.startOffsetUTF16;
const last=plan.scenes.at(-1).narrationSourceRange.endOffsetExclusiveUTF16;
const joined=plan.scenes.map(s=>s.narrationText).join('');
const sourceFlat=original.slice(first,last).replace(/\s+/g,'');
if(joined.replace(/\s+/g,'')!==sourceFlat)throw Error('Whole Chapter1 narration coverage mismatch');
if(plan.missingAssets?.count!==0||plan.productionGate?.missingAssetsResolved!==true)throw Error('Chapter1 asset gate is not open');
console.log('Validated Chapter1: 36 exact narration scenes, source offsets, registered asset paths and open asset gate.');