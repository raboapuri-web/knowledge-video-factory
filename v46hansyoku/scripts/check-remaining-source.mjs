import fs from 'node:fs';
import path from 'node:path';
const chapter=process.argv[2];if(!['chapter2','chapter3','chapter4','epilogue'].includes(chapter))throw Error('chapter arg required');
const root=path.resolve(import.meta.dirname,'..'),repo=path.resolve(root,'..');
const original=fs.readFileSync(path.join(root,'考える夜_繁殖の権利_文学的改稿.txt'),'utf8');
const plan=JSON.parse(fs.readFileSync(path.join(root,'scene-plans',chapter+'.json'),'utf8'));
const data=JSON.parse(fs.readFileSync(path.join(root,'src',chapter+'-script-data.json'),'utf8'));
if(plan.chapterId!==chapter||plan.scenes.length!==data.beats.length)throw Error('plan/script count mismatch '+chapter);
let prev=-1;
for(let i=0;i<plan.scenes.length;i++){
 const s=plan.scenes[i],b=data.beats[i],r=s.narrationSourceRange;
 if(s.sceneId!==b.id||s.narrationText!==b.narration||b.narration!==b.subtitle)throw Error('narration mismatch '+s.sceneId);
 if(original.slice(r.startOffsetUTF16,r.endOffsetExclusiveUTF16)!==s.narrationText)throw Error('source range mismatch '+s.sceneId);
 if(r.startOffsetUTF16<=prev)throw Error('scene order mismatch '+s.sceneId);prev=r.startOffsetUTF16;
 for(const a of s.requiredAssets||[]){if(a.origin==='scene_implementation')continue;if(!a.filePath||!fs.existsSync(path.join(repo,a.filePath)))throw Error('missing asset '+s.sceneId+' '+a.filePath);}
}
if(plan.missingAssets?.count!==0||plan.productionGate?.renderAllowed!==true)throw Error('asset/render gate closed '+chapter);
console.log('Validated '+chapter+': '+plan.scenes.length+' exact source scenes / high-motion plan / asset gate open.');
