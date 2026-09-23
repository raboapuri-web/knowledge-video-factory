import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const episode=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const root=path.resolve(episode,'..');
const plan=JSON.parse(fs.readFileSync(path.join(episode,'src/toyoko_scene_plan.json'),'utf8'));
const edits=JSON.parse(fs.readFileSync(path.join(episode,'src/chapter-edits/chapter3.json'),'utf8'));
if(edits.chapterId!=='chapter3'||edits.shots.length!==61)
 throw Error('Chapter 3 custom asset staging is bound to its 52 reviewed scenes');
const bg=new Map(plan.assetRegistry.backgrounds.map(x=>[x.id,x]));
const backgroundIDs=[...new Set(edits.shots.map(s=>s.customShot?.background).filter(Boolean))];
let copied=0;
for(const id of backgroundIDs){
 const a=bg.get(id);
 if(!a)throw Error('Unregistered chapter 2 background '+id);
 const rel=a.assetFile??(a.sourceOrBrief?.match(/^背景\/[\w.-]+\.png$/)?
   'shared/asset-library/'+a.sourceOrBrief:null);
 if(!rel||!/^shared\/asset-library\/背景\/[\w.-]+\.png$/.test(rel))
  throw Error('No verified library PNG binding for '+id);
 const from=path.join(root,rel);
 if(!fs.existsSync(from)||fs.statSync(from).size<100)
  throw Error('Registered background source not available '+rel);
 const to=path.join(episode,'public/assets/library/背景',path.basename(rel));
 fs.mkdirSync(path.dirname(to),{recursive:true});
 fs.copyFileSync(from,to);
 if(!fs.existsSync(to)||fs.statSync(to).size!==fs.statSync(from).size)
  throw Error('Chapter 3 asset not staged '+id);
 copied++;
}
if(copied<5)throw Error('Too few additional chapter-three backgrounds staged');
console.log('Validated and staged '+copied+' explicitly storyboarded chapter-three PNG backgrounds, including research/lodging/city custom scenes.');
