import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const episode=path.join(root,'v45-toyoko');
const plan=JSON.parse(fs.readFileSync(path.join(episode,'src/toyoko_scene_plan.json'),'utf8'));
const scenes=plan.scenes.filter(s=>s.chapterId==='prologue');
const shots=scenes.flatMap(s=>s.shots);
const backgrounds=new Map(plan.assetRegistry.backgrounds.map(a=>[a.id,a]));
const props=new Map(plan.assetRegistry.props.map(a=>[a.id,a]));
const required=new Set();
for(const shot of shots){
  const bg=backgrounds.get(shot.background);
  if(!bg)throw Error('Missing background registry: '+shot.background);
  const file=bg.assetFile||(bg.sourceOrBrief?.match(/^背景\/[\w.-]+\.png$/)?.[0]&&'shared/asset-library/'+bg.sourceOrBrief);
  if(!file)throw Error('Unresolved background: '+shot.shotId+' '+shot.background);
  required.add(file);
  for(const id of shot.props){
    const prop=props.get(id);
    if(!prop)throw Error('Missing prop registry: '+id);
    if(prop.assetFile)required.add(prop.assetFile);
  }
}
// Explicitly used in P03-03 as a short second plate for train -> street.
required.add('shared/asset-library/背景/BG_TOWN_NIGHT_WIDE.png');
for(const rel of required){
  if(!rel.startsWith('shared/asset-library/'))throw Error('Unexpected source path '+rel);
  const abs=path.join(root,rel);
  if(!fs.existsSync(abs))throw Error('Required file not present: '+rel);
  const dest=path.join(episode,'public/assets/library',rel.slice('shared/asset-library/'.length));
  fs.mkdirSync(path.dirname(dest),{recursive:true});
  fs.copyFileSync(abs,dest);
}
console.log('Staged '+required.size+' exact library assets for '+shots.length+' prologue shots');
