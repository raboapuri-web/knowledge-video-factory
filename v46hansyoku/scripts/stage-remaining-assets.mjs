import fs from 'node:fs';
import path from 'node:path';
const chapter=process.argv[2];if(!['chapter2','chapter3','chapter4','epilogue'].includes(chapter))throw Error('chapter arg required');
const root=path.resolve(import.meta.dirname,'..'),repo=path.resolve(root,'..');
const plan=JSON.parse(fs.readFileSync(path.join(root,'scene-plans',chapter+'.json'),'utf8'));
const paths=new Set(),errors=[];
for(const s of plan.scenes)for(const a of s.requiredAssets||[]){
 if(a.origin==='scene_implementation')continue;
 if(!a.filePath||!fs.existsSync(path.join(repo,a.filePath)))errors.push(s.sceneId+' '+a.filePath);
 else paths.add(a.filePath);
}
if(errors.length)throw Error(errors.join('\n'));
for(const src of paths){
 const from=path.join(repo,src),to=path.join(root,'public/assets/library',src.slice('shared/asset-library/'.length));
 fs.mkdirSync(path.dirname(to),{recursive:true});fs.copyFileSync(from,to);
}
console.log('Staged '+paths.size+' registered assets for '+chapter+' / '+plan.scenes.length+' scenes.');
