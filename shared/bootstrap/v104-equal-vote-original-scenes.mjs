import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd(),target=path.join(root,'v104-equal-vote-original-scenes'),template=path.join(root,'v44-interaction-attraction');
if(!fs.existsSync(template))throw Error('Remotion source template missing');
fs.rmSync(target,{recursive:true,force:true});fs.cpSync(template,target,{recursive:true});
const sections=[
 ['00-prologue','prologue',16],['01-history','history',24],['02-plural-vote','plural_vote',22],
 ['03-state-vs-company','state_company',21],['04-contribution','contribution',23],['05-epilogue','epilogue',14]
];
const getAllowed=(file,name)=>{const s=fs.readFileSync(path.join(root,'shared/v104',file),'utf8'),m=s.match(new RegExp(name+"='([^']+)'"));if(!m)throw Error('Missing supported '+name);return new Set(m[1].split(' '));};
const families=getAllowed('civic-engine.tsx','AllCivicFamilies'),verbs=getAllowed('civic-engine.tsx','AllCivicVerbs');
const art=fs.readFileSync(path.join(root,'shared/v104/civic-art.tsx'),'utf8');
const obj=art.match(/AllCivicObjects=\[([\s\S]*?)\] as const/);
if(!obj)throw Error('Original object inventory absent');
const supported=new Set([...obj[1].matchAll(/'([^']+)'/g)].map(x=>x[1]));
const backdropSource=fs.readFileSync(path.join(root,'shared/v104/civic-backgrounds.tsx'),'utf8');
if(!backdropSource.includes("throw Error('V104 has no bespoke backdrop: '+environment)"))throw Error('Generic backdrop fallback prohibited');
const sceneSource=fs.readFileSync(path.join(root,'shared/v104/civic-engine.tsx'),'utf8');
for(const f of families)if(!sceneSource.includes("case'"+f+"':"))throw Error('Missing visual family renderer '+f);
if(!sceneSource.includes("default:throw Error('No V104 scene renderer"))throw Error('Generic scene fallback prohibited');
const environments=[],beats=[],phaseCounts={};
for(const [file,phase,count] of sections){
 const lines=fs.readFileSync(path.join(root,'shared/v104/story',file+'.txt'),'utf8').trim().split('\n').filter(Boolean);
 if(lines.length!==count)throw Error('Missing authored V104 narration/actions '+phase+' '+lines.length+'/'+count);
 phaseCounts[phase]=lines.length;
 lines.forEach((line,v)=>{
  const x=line.split('|||');if(x.length!==6)throw Error('Malformed story record '+phase+'/'+v);
  const [narration,family,action,environment,primary,verb]=x.map(t=>t.trim());
  if(!narration||!/[。！？]$/.test(narration)||narration.length<45)throw Error('Short/fragmented narration '+phase+'/'+v);
  if((narration.match(/[。！？]/g)||[]).length!==1)throw Error('V104: exactly one complete sentence per scene '+phase+'/'+v);
  if(!family||!families.has(family))throw Error('Unsupported original family '+family);
  if(!verb||!verbs.has(verb))throw Error('Unsupported physical action '+verb);
  if(!primary||!supported.has(primary))throw Error('Unsupported original object '+primary);
  if(!environment||!action)throw Error('Empty story action '+phase+'/'+v);
  const n=beats.length+1;
  beats.push({id:'S'+String(n).padStart(3,'0'),phase,variant:v,narration,family,action,actionId:'V104-'+action,
   environment,primary,verb,sceneKey:phase+'__'+String(v+1).padStart(2,'0'),visual:'V104-original-'+String(n).padStart(3,'0'),
   bgGroup:environment,shotKind:['establish','medium','detail','tracking','cutaway','macro','overhead'][v%7]});
  environments.push(environment);
 });
}
if(beats.length!==120||Object.keys(phaseCounts).length!==6)throw Error('V104 incomplete scenes');
for(const k of ['id','actionId','sceneKey','visual','bgGroup'])if(new Set(beats.map(b=>b[k])).size!==beats.length)throw Error('Reused '+k);
for(let i=0;i<beats.length;i++){
 const b=beats[i];if(i&&b.family===beats[i-1].family)throw Error('Adjacent visually identical families '+b.id);
 const w=beats.slice(Math.max(0,i-5),i+1);if(w.length===6&&new Set(w.map(x=>x.family)).size<5)throw Error('Too many similar cuts near '+b.id);
}
for(const ph of Object.keys(phaseCounts)){const b=beats.filter(x=>x.phase===ph);if(new Set(b.map(x=>x.family)).size<7)throw Error('Chapter lacks original visual variety '+ph);}
const dst=path.join(target,'src'),scripts=path.join(target,'scripts');fs.mkdirSync(dst,{recursive:true});fs.mkdirSync(scripts,{recursive:true});
fs.writeFileSync(path.join(target,'script.txt'),sections.map(([file])=>fs.readFileSync(path.join(root,'shared/v104/story',file+'.txt'),'utf8').trim().split('\n').map(x=>x.split('|||')[0]).join('\n')).join('\n\n')+'\n');
fs.writeFileSync(path.join(dst,'script-data.json'),JSON.stringify({videoId:'V104-equal-vote-original-scenes',title:'なぜ納税額に関係なく一票の価値が同じなのか？【政治哲学×選挙制度史×公共経済学】',beats},null,2));
fs.writeFileSync(path.join(dst,'scene-data.json'),JSON.stringify(beats,null,2));
fs.writeFileSync(path.join(dst,'sync-timing.json'),JSON.stringify({durationSeconds:1330,beats:[]},null,2));
for(const f of ['index.tsx','scenes.tsx','civic-art.tsx','civic-backgrounds.tsx','civic-engine.tsx'])fs.copyFileSync(path.join(root,'shared/v104',f),path.join(dst,f));
fs.copyFileSync(path.join(root,'shared/v100/primitives.tsx'),path.join(dst,'primitives.tsx'));
for(const f of ['generate-bgm.mjs','plan-segments.mjs'])fs.copyFileSync(path.join(root,'shared/v53',f),path.join(scripts,f));
const prep=[
 "import fs from 'node:fs';import path from 'node:path';",
 "const r=path.resolve(import.meta.dirname,'..'),b=JSON.parse(fs.readFileSync(path.join(r,'src/scene-data.json'),'utf8'));",
 "const phases={},families={},verbs={};for(const s of b){phases[s.phase]=(phases[s.phase]||0)+1;families[s.family]=(families[s.family]||0)+1;verbs[s.verb]=(verbs[s.verb]||0)+1;}",
 "fs.mkdirSync(path.join(r,'qa'),{recursive:true});",
 "fs.writeFileSync(path.join(r,'preproduction-plan.json'),JSON.stringify({videoId:'V104-equal-vote-original-scenes',scenes:b},null,2));",
 "fs.writeFileSync(path.join(r,'qa/preproduction-summary.json'),JSON.stringify({videoId:'V104-equal-vote-original-scenes',sceneCount:b.length,phaseCounts:phases,backgroundCount:new Set(b.map(x=>x.bgGroup)).size,originalActions:new Set(b.map(x=>x.actionId)).size,visualFamilies:families,motionVerbs:verbs,manualActionAssignments:true,approved:true},null,2));"
].join('\n');
fs.writeFileSync(path.join(scripts,'build-preproduction.mjs'),prep);
const voice=[
 "import path from 'node:path';import {fileURLToPath} from 'node:url';",
 "import {generateVoicevox} from '../../shared/voice/generate-voicevox.mjs';",
 "const h=path.dirname(fileURLToPath(import.meta.url));",
 "await generateVoicevox(path.resolve(h,'..'),{speaker:'青山龍星',style:'ノーマル',speed:1.15,pitchScale:-0.026,intonationScale:0.86});"
].join('\n');
fs.writeFileSync(path.join(scripts,'generate-voicevox.mjs'),voice);
const guard=[
 "import fs from 'node:fs';",
 "const b=JSON.parse(fs.readFileSync('src/scene-data.json','utf8')),s=JSON.parse(fs.readFileSync('src/sync-timing.json','utf8'));",
 "if(!Array.isArray(s.beats)||s.beats.length!==b.length)throw Error('VOICEVOX beat count mismatch '+(s.beats?.length||0)+'/'+b.length);",
 "let max=0;for(let i=0;i<b.length;i++){const d=s.beats[i].end-s.beats[i].start;if(!(d>0)||d>=17)throw Error('V104 overlong or invalid scene '+b[i].id+' '+d.toFixed(2)+'sec');max=Math.max(d,max);if(i&&b[i-1].family===b[i].family)throw Error('Repeated visual family '+b[i].id);const w=b.slice(Math.max(0,i-5),i+1);if(w.length===6&&new Set(w.map(x=>x.family)).size<5)throw Error('Six-shot repetition '+b[i].id);}",
 "if(!(s.durationSeconds>700))throw Error('Narration incomplete '+s.durationSeconds);",
 "console.log('V104 voice/original-scene guard PASS; shots='+b.length+' duration='+s.durationSeconds.toFixed(2)+'sec longest='+max.toFixed(2)+'sec');"
].join('\n');
fs.writeFileSync(path.join(scripts,'check-original-scenes.mjs'),guard);
for(const f of ['SOURCES.md','V104_PRODUCTION_SPEC.md'])fs.copyFileSync(path.join(root,'shared/v104',f),path.join(target,f));
fs.writeFileSync(path.join(target,'production-manifest.json'),JSON.stringify({videoId:'V104-equal-vote-original-scenes',method:'V99-original-scene-storyboard',output:{width:1920,height:1080,fps:30,voicevox:'青山龍星',subtitles:true,bgm:true},policy:{exactlyOneCompleteNarrationSentencePerScene:true,manualActionAndMotionPerBeat:true,uniqueBackgroundPerBeat:true,uniqueActionId:true,noGenericVisualOrBackdropFallback:true,minVisualFamiliesInSixScenes:5,maxMeasuredShotSeconds:17,neutralHistoricalTeachingOnly:true}},null,2));
console.log('V104 preflight PASS: '+beats.length+' manually authored narration scenes / '+new Set(beats.map(b=>b.family)).size+' visual families / '+new Set(environments).size+' bespoke background identifiers / '+new Set(beats.map(b=>b.actionId)).size+' physical actions');
