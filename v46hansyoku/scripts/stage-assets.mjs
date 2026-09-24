import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..'),repo=path.resolve(root,'..');
const plan=JSON.parse(fs.readFileSync(path.join(root,'scene-plans/prologue.json'),'utf8'));
const catalog=JSON.parse(fs.readFileSync(path.join(repo,'shared/asset-library/catalog.json'),'utf8'));
const characters=JSON.parse(fs.readFileSync(path.join(repo,'shared/asset-library/人物テンプレート/catalog.json'),'utf8'));
const registry=new Map([...catalog.assets,...characters.characters].map(x=>[x.id,x]));
const paths=new Set();const missing=[];
for(const scene of plan.scenes){
 for(const asset of scene.requiredAssets){if(asset.origin==='scene_implementation')continue;
 const reg=registry.get(asset.assetId);if(!reg||reg.license==='pending-review'||reg.status==='pending-review')missing.push(scene.sceneId+' catalogue '+asset.assetId);
 if(!asset.filePath||!fs.existsSync(path.join(repo,asset.filePath)))missing.push(scene.sceneId+' file '+asset.filePath);
 if(asset.filePath)paths.add(asset.filePath);
 }
 for(const bg of scene.backgroundBindings||[])if(!fs.existsSync(path.join(repo,bg.filePath)))missing.push(scene.sceneId+' background '+bg.filePath);
}
if(missing.length)throw Error(missing.join('\n'));
for(const src of paths){const from=path.join(repo,src);if(!fs.statSync(from).size)throw Error('Empty '+src);
 const to=path.join(root,'public/assets/library',src.slice('shared/asset-library/'.length));fs.mkdirSync(path.dirname(to),{recursive:true});fs.copyFileSync(from,to);
}
console.log('Verified/staged '+paths.size+' distinct registered assets for all '+plan.scenes.length+' prologue scenes');
