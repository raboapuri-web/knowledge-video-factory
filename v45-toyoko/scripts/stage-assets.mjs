import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const episode=path.join(root,'v45-toyoko');
const plan=JSON.parse(fs.readFileSync(path.join(episode,'src/toyoko_scene_plan.json'),'utf8'));
const shots=plan.scenes.flatMap(s=>s.shots);
if(plan.scenes.length!==60||shots.length!==160)throw Error('Expected all 60 scenes and 160 shots');
const backgrounds=new Map(plan.assetRegistry.backgrounds.map(a=>[a.id,a]));
const props=new Map(plan.assetRegistry.props.map(a=>[a.id,a]));
const required=new Set(), missing=[];
for(const shot of shots){
  const bg=backgrounds.get(shot.background);
  const file=bg?.assetFile||(bg?.sourceOrBrief?.match(/^背景\/[\w.-]+\.png$/)?.[0]&&'shared/asset-library/'+bg.sourceOrBrief);
  if(!file)missing.push(shot.shotId+' BG '+shot.background);
  else required.add(file);
  for(const id of shot.props){
    const prop=props.get(id);
    if(!prop)missing.push(shot.shotId+' PROP '+id);
    else if(prop.assetFile)required.add(prop.assetFile);
    else if(prop.sourceOrBrief?.match(/^パーツ\/[\w.-]+\.(png|svg)$/i))
      required.add('shared/asset-library/'+prop.sourceOrBrief);
    else if(!['DOOR','MEAL_TRAY','FORM'].includes(id))
      missing.push(shot.shotId+' unresolved PROP '+id);
  }
}
if(missing.length)throw Error('Unresolved required assets: '+missing.join('; '));
for(const rel of required){
  if(!/^shared\/asset-library\/(?:背景|パーツ)\/[\w.-]+\.(?:png|svg)$/i.test(rel))
    throw Error('Unexpected source path '+rel);
  const abs=path.join(root,rel);
  if(!fs.existsSync(abs)||fs.statSync(abs).size===0)throw Error('Required library file absent: '+rel);
  const dest=path.join(episode,'public/assets/library',rel.slice('shared/asset-library/'.length));
  fs.mkdirSync(path.dirname(dest),{recursive:true});
  fs.copyFileSync(abs,dest);
}
console.log('Staged '+required.size+' verified library files for all '+shots.length+' storyboard shots');
