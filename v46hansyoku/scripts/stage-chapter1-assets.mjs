import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..'),repo=path.resolve(root,'..');
const plan=JSON.parse(fs.readFileSync(path.join(root,'scene-plans/chapter1.json'),'utf8'));
const catalog=JSON.parse(fs.readFileSync(path.join(repo,'shared/asset-library/catalog.json'),'utf8'));
const chars=JSON.parse(fs.readFileSync(path.join(repo,'shared/asset-library/人物テンプレート/catalog.json'),'utf8'));
const registry=new Map([...catalog.assets,...chars.characters].map(x=>[x.id,x]));
const paths=new Set(),errors=[];
for(const s of plan.scenes){
 for(const a of s.requiredAssets){
  if(a.origin==='scene_implementation')continue;
  const reg=registry.get(a.assetId);
  if(!reg)errors.push(s.sceneId+' missing catalogue '+a.assetId);
  if(reg&&(reg.license==='pending-review'||reg.status==='pending-review'))errors.push(s.sceneId+' pending review '+a.assetId);
  if(!a.filePath||!fs.existsSync(path.join(repo,a.filePath)))errors.push(s.sceneId+' missing file '+a.filePath);
  if(a.filePath)paths.add(a.filePath);
 }
 for(const bg of s.backgroundBindings||[]){
  if(!fs.existsSync(path.join(repo,bg.filePath)))errors.push(s.sceneId+' missing background '+bg.filePath);
  else paths.add(bg.filePath);
 }
}
if(errors.length)throw Error(errors.join('\n'));
for(const src of paths){
 const from=path.join(repo,src);if(!fs.statSync(from).size)throw Error('Empty '+src);
 const to=path.join(root,'public/assets/library',src.slice('shared/asset-library/'.length));
 fs.mkdirSync(path.dirname(to),{recursive:true});fs.copyFileSync(from,to);
}
console.log('Verified/staged '+paths.size+' registered assets for all 36 Chapter1 scenes');