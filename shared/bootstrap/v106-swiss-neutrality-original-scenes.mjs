import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
const root=process.cwd(),name='v106-swiss-neutrality-original-scenes',target=path.join(root,name),template=path.join(root,'v44-interaction-attraction'),source=path.join(root,'shared/v106');
if(!fs.existsSync(template))throw Error('Remotion V44 template unavailable');
fs.rmSync(target,{recursive:true,force:true});fs.cpSync(template,target,{recursive:true});
const sections=[['00-prologue','prologue',27],['01-history','history',50],['02-reduit','reduit',55],['03-economy','economy',48],['04-modern','modern',54],['05-epilogue','epilogue',29]];
const art=fs.readFileSync(path.join(source,'swiss-art.tsx'),'utf8'),bg=fs.readFileSync(path.join(source,'backgrounds.tsx'),'utf8'),engine=fs.readFileSync(path.join(source,'swiss-engine.tsx'),'utf8');
const categoryBlock=art.slice(art.indexOf('export const objectGroups:'),art.indexOf('const memberships'));
const objectSet=new Set([...categoryBlock.matchAll(/list\('([^']+)'\)/g)].flatMap(x=>x[1].split(/\s+/)));
const envBlock=bg.slice(bg.indexOf('export const environments:'),bg.indexOf('const assetBg'));
const environmentSet=new Set([...envBlock.matchAll(/'([^']+)'/g)].map(x=>x[1]));
const verbBlock=engine.match(/const verbFamilies:Record<string,string>=\{([\s\S]*?)\};/)?.[1];
if(!verbBlock)throw Error('V106 physical animation inventory missing');
const verbSet=new Set([...verbBlock.matchAll(/:\s*'([^']+)'/g)].flatMap(x=>x[1].split(/\s+/)));
const beats=[],srcDir=path.join(target,'src'),script=[];
for(const [name,phase,expected] of sections){
 const text=fs.readFileSync(path.join(source,'story',name+'.txt'),'utf8').trim(),lines=text.split('\n').map(x=>x.trim()).filter(Boolean);
 if(lines.length!==expected)throw Error('Original storyboard narration count '+phase+': '+lines.length+'/'+expected);
 const narrations=[];
 for(let i=0;i<lines.length;i++){
  const fields=lines[i].split('|||').map(x=>x.trim());
  if(fields.length!==7)throw Error('Malformed seven-field scene: '+phase+'/'+i);
  const [narration,environment,family,action,primary,verb,mode]=fields;
  if(!narration||!/[。！？]$/.test(narration)||!family||!action||!primary||!verb)throw Error('Incomplete authored narration/visual '+phase+'/'+i);
  if(!environmentSet.has(environment))throw Error('Unauthored background '+environment);
  if(!objectSet.has(primary))throw Error('Unauthored illustrated object '+primary);
  if(!verbSet.has(verb))throw Error('Unauthored physical animation '+verb+' '+phase+'/'+i);
  if(mode!=='replace'&&mode!=='append')throw Error('Invalid explicit state operation '+phase+'/'+i);
  const seq=beats.length+1,sceneNo=String(seq).padStart(3,'0');
  beats.push({id:'V106-'+sceneNo,phase,variant:i,narration,environment,family,action,primary,verb,mode,
   actionId:'V106-'+sceneNo+'-'+verb+'-'+primary,sceneKey:'v106-'+phase+'-'+sceneNo,bgGroup:environment,
   visual:'v106-original-'+sceneNo,shotKind:['establish','detail','medium','overhead','low-angle','macro','split','tracking','reverse'][i%9],
   visualIntent:action,assetComposition:'bespoke'});
  narrations.push(narration);
 }
 script.push(narrations.join('\n'));
}
if(beats.length!==263)throw Error('V106 expects precisely 263 original narrated cuts, got '+beats.length);
const unique=['id','actionId','sceneKey','visual'];
for(const key of unique)if(new Set(beats.map(x=>x[key])).size!==beats.length)throw Error('Reused '+key);
const actionNames=beats.map(b=>b.action);
if(new Set(actionNames).size!==beats.length)throw Error('One or more narrations lack an original physical action');
const seen=new Set(),priorByGroup=new Map();
for(let i=0;i<beats.length;i++){
 const b=beats[i],previous=beats[i-1];
 if(seen.has(b.bgGroup)&&(!previous||previous.bgGroup!==b.bgGroup))throw Error('Noncontiguous background reuse '+b.bgGroup);
 if(b.mode==='append'&&(!previous||previous.bgGroup!==b.bgGroup))throw Error('Foreground appended to missing previous location '+b.id);
 if(previous&&previous.environment===b.environment&&previous.primary===b.primary&&previous.verb===b.verb)throw Error('Unchanged same-background foreground at '+b.id);
 seen.add(b.bgGroup);priorByGroup.set(b.bgGroup,b.id);
}
if(seen.size!==103)throw Error('V106 requires 103 unique named backgrounds, got '+seen.size);
fs.mkdirSync(srcDir,{recursive:true});fs.mkdirSync(path.join(target,'scripts'),{recursive:true});fs.mkdirSync(path.join(target,'qa'),{recursive:true});
fs.writeFileSync(path.join(target,'script.txt'),script.join('\n\n')+'\n');
fs.writeFileSync(path.join(srcDir,'script-data.json'),JSON.stringify({videoId:'V106-swiss-neutrality-original-scenes',title:'なぜスイスは永世中立国でいられるのか？【国際政治史×地政学×安全保障論】',beats},null,2));
fs.writeFileSync(path.join(srcDir,'scene-data.json'),JSON.stringify(beats,null,2));
fs.writeFileSync(path.join(srcDir,'sync-timing.json'),JSON.stringify({durationSeconds:1410,beats:[]},null,2));
for(const file of ['index.tsx','scenes.tsx','swiss-engine.tsx','swiss-art.tsx','backgrounds.tsx'])fs.copyFileSync(path.join(source,file),path.join(srcDir,file));
fs.copyFileSync(path.join(root,'shared/v100/primitives.tsx'),path.join(srcDir,'primitives.tsx'));
for(const file of ['generate-bgm.mjs','plan-segments.mjs'])fs.copyFileSync(path.join(root,'shared/v53',file),path.join(target,'scripts',file));
for(const file of ['generate-voicevox.mjs','check-original-scenes.mjs','build-preproduction.mjs'])fs.copyFileSync(path.join(source,file),path.join(target,'scripts',file));
const catalog=JSON.parse(fs.readFileSync(path.join(root,'shared/asset-library/catalog.json'),'utf8'));
const approved=['BG_darkroom.png','BG_honndana.png','BG_kenkyu.png','BG_syosai.png'];
const publicRoot=path.join(target,'public/assets/v106');fs.mkdirSync(publicRoot,{recursive:true});
const assets=[];
for(const file of approved){
 const item=catalog.assets.find(x=>x.category==='背景'&&x.file==='背景/'+file);
 if(!item||item.license!=='cleared-commercial')throw Error('Swiss episode library background not approved '+file);
 const original=path.join(root,'shared/asset-library',item.file),dest=path.join(publicRoot,file);
 fs.copyFileSync(original,dest);
 const sha256=createHash('sha256').update(fs.readFileSync(dest)).digest('hex');
 if(sha256!==item.sourceSha256)throw Error('Template background checksum mismatch '+file);
 assets.push({name:file,id:item.id,sha256,license:item.license});
}
fs.writeFileSync(path.join(srcDir,'library-assets.json'),JSON.stringify(assets,null,2));
fs.writeFileSync(path.join(srcDir,'asset-plan.json'),JSON.stringify({version:2,mode:'bespoke-only',approvedBackgrounds:assets,scenes:Object.fromEntries(beats.map(b=>[b.id,{bgGroup:b.bgGroup,mode:'bespoke',part:null}])),breakdown:{suggestedOverlays:0,approvedOverlays:0,unmatchedBeats:beats.length}},null,2));
for(const file of ['SOURCES.md','V106_PRODUCTION_SPEC.md'])fs.copyFileSync(path.join(source,file),path.join(target,file));
fs.writeFileSync(path.join(target,'production-manifest.json'),JSON.stringify({videoId:'V106-swiss-neutrality-original-scenes',sceneCount:263,environmentCount:103,uniqueActions:263,phases:Object.fromEntries(sections.map(x=>[x[1],x[2]])),libraryBackgrounds:assets,method:'one narration = unique documented action and semantic original 2D object',staticContiguousBackground:true,appendReplaceForeground:true,measuredVoice:true,subtitles:true,output:{width:1920,height:1080,fps:30}},null,2));
console.log('V106 source preflight passed: '+beats.length+' original narration-specific actions, '+seen.size+' authored environments, '+objectSet.size+' supported visual objects, '+verbSet.size+' physical verbs; '+assets.length+' SHA-verified library images');
