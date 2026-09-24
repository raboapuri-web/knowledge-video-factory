import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const original=fs.readFileSync(path.join(root,'考える夜_繁殖の権利_文学的改稿.txt'),'utf8');
const plan=JSON.parse(fs.readFileSync(path.join(root,'scene-plans/prologue.json'),'utf8'));
const data=JSON.parse(fs.readFileSync(path.join(root,'src/script-data.json'),'utf8'));
if(plan.chapterId!=='prologue'||plan.scenes.length!==32||data.beats.length!==32)throw Error('Expected only 32 prologue scenes');
if(data.sourceBlobSha!==plan.source.blobSha)throw Error('Approved script SHA metadata differs');
let body='';const ids=new Set();
for(let i=0;i<32;i++){
 const s=plan.scenes[i],beat=data.beats[i],r=s.narrationSourceRange;
 if(ids.has(s.sceneId))throw Error('Duplicate '+s.sceneId);ids.add(s.sceneId);
 if(s.sceneId!==beat.id||s.narrationText!==beat.narration||s.narrationText!==beat.subtitle||original.slice(r.startOffsetUTF16,r.endOffsetExclusiveUTF16)!==beat.narration)throw Error('Exact narration mismatch '+s.sceneId);
 if(i&&r.paragraph!==plan.scenes[i-1].narrationSourceRange.paragraph)body+='\n\n';
 body+=beat.narration;
 for(const a of s.requiredAssets){if(a.origin==='scene_implementation')continue;
  if(!a.filePath||!fs.existsSync(path.resolve(root,'..',a.filePath)))throw Error('Missing required asset '+s.sceneId+' '+a.assetId+' '+a.filePath);
 }
 for(const actor of s.characters){if(actor.sourceFile&&!fs.existsSync(path.resolve(root,'..',actor.sourceFile)))throw Error('Missing actor rig '+actor.sourceFile);}
}
if(body!==original.slice(plan.source.bodyStartOffsetUTF16,plan.source.bodyEndOffsetExclusiveUTF16))throw Error('Whole prologue original mismatch');
console.log('Validated full approved narration, scene order, 32 scene source offsets, and registered asset paths.');
