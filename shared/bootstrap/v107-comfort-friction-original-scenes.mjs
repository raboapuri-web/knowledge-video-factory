import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd(),name='v107-comfort-friction-original-scenes',target=path.join(root,name),template=path.join(root,'v44-interaction-attraction'),source=path.join(root,'shared/v107');
if(!fs.existsSync(template))throw Error('Remotion V44 template unavailable');
fs.rmSync(target,{recursive:true,force:true});fs.cpSync(template,target,{recursive:true});
const sections=[['00-prologue','prologue',20],['01-civilization','civilization',22],['02-avoidance','avoidance',24],['03-philosophy','philosophy',24],['04-friction','friction',26],['05-epilogue','epilogue',18]];
const art=fs.readFileSync(path.join(source,'comfort-art.tsx'),'utf8'),bg=fs.readFileSync(path.join(source,'backgrounds.tsx'),'utf8'),engine=fs.readFileSync(path.join(source,'comfort-engine.tsx'),'utf8');
const objectBlock=art.match(/export const objectGroups:Record<string,string\[\]>=\{([\s\S]*?)\};/)?.[1];
if(!objectBlock)throw Error('V107 illustrated object inventory missing');
const objectSet=new Set([...objectBlock.matchAll(/list\('([^']+)'\)/g)].flatMap(x=>x[1].split(/\s+/)));
const famMatch=bg.match(/export const visualFamilies='([^']+)'/);
if(!famMatch)throw Error('V107 visual family inventory missing');
const familySet=new Set(famMatch[1].split(/\s+/));
const verbBlock=engine.match(/export const verbGroups:Record<string,string>=\{([\s\S]*?)\};/)?.[1];
if(!verbBlock)throw Error('V107 physical verb inventory missing');
const verbSet=new Set([...verbBlock.matchAll(/'([^']+)'/g)].flatMap(x=>x[1].split(/\s+/)));
const beats=[],scriptParts=[],phaseCounts={};
for(const [file,phase,expected] of sections){
 const lines=fs.readFileSync(path.join(source,'story',file+'.txt'),'utf8').trim().split('\n').map(x=>x.trim()).filter(Boolean);
 if(lines.length!==expected)throw Error('V107 authored narration count '+phase+' '+lines.length+'/'+expected);
 phaseCounts[phase]=lines.length;const narration=[];
 for(let i=0;i<lines.length;i++){
  const f=lines[i].split('|||').map(x=>x.trim());
  if(f.length!==7)throw Error('Malformed V107 seven-field record '+phase+'/'+i);
  const [text,environment,family,action,primary,verb,mode]=f;
  if(!text||!/[。！？]$/.test(text)||text.length<40||text.length>80)throw Error('V107 short/overlong narration '+phase+'/'+i+' len='+text.length);
  if(!environment||!family||!action||!primary||!verb)throw Error('V107 incomplete authored scene '+phase+'/'+i);
  if(!familySet.has(family))throw Error('Unsupported V107 family '+family);
  if(!objectSet.has(primary))throw Error('Unsupported V107 object '+primary);
  if(!verbSet.has(verb))throw Error('Unsupported V107 physical verb '+verb);
  if(mode!=='replace'&&mode!=='append')throw Error('Invalid V107 state mode '+mode);
  const n=beats.length+1,no=String(n).padStart(3,'0');
  beats.push({id:'V107-'+no,phase,variant:i,narration:text,environment,family,action,primary,verb,mode,
    actionId:'V107-'+no+'-'+action,sceneKey:'v107-'+phase+'-'+no,bgGroup:environment,visual:'v107-original-'+no,
    shotKind:['establish','detail','tracking','macro','medium','overhead','split','low-angle','reverse'][i%9],
    visualIntent:action,assetComposition:'bespoke'});
  narration.push(text);
 }
 scriptParts.push(narration.join('\n'));
}
if(beats.length!==134)throw Error('V107 requires exactly 134 complete original narration scenes');
for(const key of ['id','actionId','action','environment','sceneKey','visual'])
 if(new Set(beats.map(x=>x[key])).size!==beats.length)throw Error('V107 repeated '+key);
for(let i=0;i<beats.length;i++){
 const b=beats[i],prev=beats[i-1];
 if(prev&&b.family===prev.family)throw Error('V107 adjacent similar family '+b.id);
 const w=beats.slice(Math.max(0,i-5),i+1);
 if(w.length===6&&new Set(w.map(x=>x.family)).size<5)throw Error('V107 six-cut visual-family repetition '+b.id);
 if(prev&&b.environment===prev.environment&&b.primary===prev.primary&&b.verb===prev.verb)throw Error('V107 unchanged adjacent semantic action '+b.id);
 if(b.mode==='append'&&prev?.environment!==b.environment)throw Error('V107 append without continuous background '+b.id);
}
const chars=beats.reduce((n,b)=>n+b.narration.length,0);
if(chars<7000)throw Error('V107 narration too short for ten-minute production '+chars);
const src=path.join(target,'src'),scripts=path.join(target,'scripts');
fs.mkdirSync(src,{recursive:true});fs.mkdirSync(scripts,{recursive:true});fs.mkdirSync(path.join(target,'qa'),{recursive:true});
fs.writeFileSync(path.join(target,'script.txt'),scriptParts.join('\n\n')+'\n');
fs.writeFileSync(path.join(src,'script-data.json'),JSON.stringify({videoId:'V107-comfort-friction-original-scenes',title:'なぜ快適になるほど、人間は弱くなるのか？【心理学×快楽適応×ストア哲学×努力のパラドックス】',beats},null,2));
fs.writeFileSync(path.join(src,'scene-data.json'),JSON.stringify(beats,null,2));
fs.writeFileSync(path.join(src,'sync-timing.json'),JSON.stringify({durationSeconds:900,beats:[]},null,2));
for(const file of ['index.tsx','scenes.tsx','comfort-engine.tsx','comfort-art.tsx','backgrounds.tsx'])fs.copyFileSync(path.join(source,file),path.join(src,file));
fs.copyFileSync(path.join(root,'shared/v100/primitives.tsx'),path.join(src,'primitives.tsx'));
for(const file of ['generate-voicevox.mjs','check-original-scenes.mjs'])fs.copyFileSync(path.join(source,file),path.join(scripts,file));
fs.copyFileSync(path.join(root,'shared/v53/generate-bgm.mjs'),path.join(scripts,'generate-bgm.mjs'));
fs.copyFileSync(path.join(root,'v44-interaction-attraction/scripts/plan-segments.mjs'),path.join(scripts,'plan-segments.mjs'));
fs.copyFileSync(path.join(source,'build-preproduction.mjs'),path.join(scripts,'build-preproduction.mjs'));
for(const file of ['SOURCES.md','V107_PRODUCTION_SPEC.md'])fs.copyFileSync(path.join(source,file),path.join(target,file));
fs.writeFileSync(path.join(target,'production-manifest.json'),JSON.stringify({videoId:'V107-comfort-friction-original-scenes',sceneCount:134,narrationCharacters:chars,environmentCount:134,uniqueActions:134,phases:phaseCounts,method:'V106-style one narration = unique physical action with nonreused scene environment',measuredVoice:true,subtitles:true,sfx:false,bgm:true,minimumFinalSeconds:600,output:{width:1920,height:1080,fps:30}},null,2));
console.log('V107 preflight PASS: '+beats.length+' authored scenes / '+chars+' narration chars / '+objectSet.size+' objects / '+verbSet.size+' verbs / '+familySet.size+' families');
