import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd(),target=path.join(root,'v102-welfare-paradox'),template=path.join(root,'v44-interaction-attraction');
if(!fs.existsSync(template))throw new Error('V44 Remotion template unavailable');
fs.rmSync(target,{recursive:true,force:true});
fs.cpSync(template,target,{recursive:true});

const script=fs.readFileSync(path.join(root,'shared/v102/welfare-paradox-script.txt'),'utf8').trim();
const design=JSON.parse(fs.readFileSync(path.join(root,'shared/v102/scene-design.json'),'utf8'));
const phaseRe=/\[\[([a-z_0-9]+)\]\]\s*([\s\S]*?)(?=\n\s*\[\[|$)/g;
const parsed=[...script.matchAll(phaseRe)];
if(parsed.length!==27)throw new Error('Expected 27 phases, got '+parsed.length);
const expectedDesign=Object.keys(design.phases);
if(expectedDesign.length!==27)throw new Error('Scene-design phase count mismatch');
const beats=[],phaseCounts={};let index=0;
for(const hit of parsed){
 const phase=hit[1],entries=design.phases[phase];
 const sentences=(hit[2].replace(/\n+/g,' ').match(/[^。！？]+[。！？]?/g)||[]).map(x=>x.trim()).filter(Boolean);
 if(!entries||entries.length!==sentences.length)throw new Error('Scene-design coverage mismatch for '+phase+': '+entries?.length+'/'+sentences.length);
 phaseCounts[phase]=sentences.length;
 sentences.forEach((narration,variant)=>{
  const spec=entries[variant];
  if(!spec.action||!spec.family)throw new Error('Incomplete authoring '+phase+'/'+variant);
  const sceneNum=++index;
  beats.push({id:'S'+String(sceneNum).padStart(3,'0'),phase,variant,narration,family:spec.family,
   actionId:spec.action,sceneKey:phase+'__'+String(variant+1).padStart(2,'0'),
   visual:'v102-original-'+String(sceneNum).padStart(3,'0'),bgGroup:'V102BG'+String(sceneNum).padStart(3,'0'),
   shotKind:['establish','medium','detail','reaction','overhead','pushIn','cutaway','macro'][variant%8]});
 });
}
if(beats.length!==142)throw new Error('Expected 142 complete original sentence-scenes, got '+beats.length);
for(const key of ['id','actionId','sceneKey','visual','bgGroup']){
 if(new Set(beats.map(x=>x[key])).size!==beats.length)throw new Error('Nonunique authored scene field '+key);
}
for(let i=0;i<beats.length;i++){
 if(i&&beats[i].family===beats[i-1].family)throw new Error('Adjacent similar visual family at '+beats[i].id);
 const w=beats.slice(Math.max(0,i-5),i+1);
 if(w.length===6&&new Set(w.map(x=>x.family)).size<5)throw new Error('Six-shot visual repetition around '+beats[i].id);
}
for(const phase of expectedDesign){
 const list=beats.filter(x=>x.phase===phase);
 if(!list.length)throw new Error('Design phase missing from narration '+phase);
 if(new Set(list.map(x=>x.family)).size<Math.min(4,list.length))throw new Error('Phase visually repetitive '+phase);
}

// Explicit renderer coverage is checked before costly voice synthesis.
const phaseRenderFiles=['phases-a.tsx','phases-b.tsx','phases-c.tsx','phases-d.tsx'];
const rendererSource=phaseRenderFiles.map(name=>fs.readFileSync(path.join(root,'shared/v102',name),'utf8')).join('\n');
const sceneDispatcher=fs.readFileSync(path.join(root,'shared/v102/scenes.tsx'),'utf8');
for(const [phase,count] of Object.entries(phaseCounts)){
 const fn='render'+phase.split('_').map(word=>word.charAt(0).toUpperCase()+word.slice(1)).join('');
 const needle='export const '+fn+'=';
 const start=rendererSource.indexOf(needle);
 if(start<0)throw new Error('No authored renderer '+fn);
 const end=rendererSource.indexOf('export const render',start+needle.length);
 const body=rendererSource.slice(start,end<0?undefined:end);
 const cases=[...body.matchAll(/case\s+(\d+):return/g)].map(x=>Number(x[1]));
 if(cases.length!==count||cases.some((v,i)=>v!==i))throw new Error('Renderer '+fn+' missing or extra variants '+cases.length+'/'+count);
 if(!body.includes('default:throw new Error'))throw new Error('Renderer has generic fallback '+fn);
 if(!sceneDispatcher.includes("case'"+phase+"'"))throw new Error('Missing dispatcher '+phase);
}
if(sceneDispatcher.includes('default:return'))throw new Error('Generic visual fallback is prohibited');

fs.writeFileSync(path.join(target,'script.txt'),script.replace(/\[\[[a-z_0-9]+\]\]\s*/g,'')+'\n');
fs.writeFileSync(path.join(target,'src/script-data.json'),JSON.stringify({videoId:'V102-welfare-paradox',title:'「弱者を救う制度」が、別の弱者を生む【社会保障論×行動経済学×制度設計】',beats},null,2));
fs.writeFileSync(path.join(target,'src/scene-data.json'),JSON.stringify(beats,null,2));
fs.writeFileSync(path.join(target,'src/storyboard-plan.json'),JSON.stringify(beats.map(b=>({id:b.id,phase:b.phase,variant:b.variant+1,actionId:b.actionId,family:b.family,sceneKey:b.sceneKey,narration:b.narration})),null,2));
fs.writeFileSync(path.join(target,'src/sync-timing.json'),JSON.stringify({durationSeconds:1150,beats:[]},null,2));

for(const name of ['index.tsx','scenes.tsx','welfare-primitives.tsx','phases-a.tsx','phases-b.tsx','phases-c.tsx','phases-d.tsx'])
 fs.copyFileSync(path.join(root,'shared/v102',name),path.join(target,'src',name));
fs.copyFileSync(path.join(root,'shared/v100/primitives.tsx'),path.join(target,'src/primitives.tsx'));
for(const name of ['generate-bgm.mjs','plan-segments.mjs'])
 fs.copyFileSync(path.join(root,'shared/v53',name),path.join(target,'scripts',name));
fs.writeFileSync(path.join(target,'scripts/build-preproduction.mjs'),[
 "import fs from 'node:fs';import path from 'node:path';",
 "const root=path.resolve(import.meta.dirname,'..'),beats=JSON.parse(fs.readFileSync(path.join(root,'src/scene-data.json'),'utf8'));",
 "const families={},phases={};for(const beat of beats){families[beat.family]=(families[beat.family]||0)+1;phases[beat.phase]=(phases[beat.phase]||0)+1;}",
 "fs.mkdirSync(path.join(root,'qa'),{recursive:true});",
 "fs.writeFileSync(path.join(root,'preproduction-plan.json'),JSON.stringify({videoId:'V102-welfare-paradox',scenes:beats},null,2));",
 "fs.writeFileSync(path.join(root,'qa/preproduction-summary.json'),JSON.stringify({sceneCount:beats.length,backgroundCount:new Set(beats.map(x=>x.bgGroup)).size,uniqueActions:new Set(beats.map(x=>x.actionId)).size,phaseCount:Object.keys(phases).length,visualFamilies:families,phaseSceneCounts:phases,approved:true},null,2));"
].join('\n'));
fs.writeFileSync(path.join(target,'scripts/generate-voicevox.mjs'),[
 "import path from 'node:path';import {fileURLToPath} from 'node:url';",
 "import {generateVoicevox} from '../../shared/voice/generate-voicevox.mjs';",
 "const h=path.dirname(fileURLToPath(import.meta.url));",
 "await generateVoicevox(path.resolve(h,'..'),{speaker:'青山龍星',style:'ノーマル',speed:1.18,pitchScale:-0.026,intonationScale:0.86});"
].join('\n'));
fs.writeFileSync(path.join(target,'scripts/check-original-scenes.mjs'),[
 "import fs from 'node:fs';",
 "const beats=JSON.parse(fs.readFileSync('src/scene-data.json','utf8')),sync=JSON.parse(fs.readFileSync('src/sync-timing.json','utf8'));",
 "if(!Array.isArray(sync.beats)||sync.beats.length!==beats.length)throw Error('Timing mismatch');",
 "let longest=0;for(let i=0;i<beats.length;i++){const duration=sync.beats[i].end-sync.beats[i].start;longest=Math.max(longest,duration);if(duration>=15)throw Error('V102 original scene exceeds 15s '+beats[i].id+' '+duration.toFixed(2));if(i&&beats[i].family===beats[i-1].family)throw Error('Adjacent visual repetition '+beats[i].id);const window=beats.slice(Math.max(0,i-5),i+1);if(window.length===6&&new Set(window.map(x=>x.family)).size<5)throw Error('Six-shot repetition '+beats[i].id);}",
 "console.log('V102: 142 original actions, 27 phases; timing/visual guards passed; max duration '+longest.toFixed(2)+'s');"
].join('\n'));
fs.copyFileSync(path.join(root,'shared/v102/SOURCES.md'),path.join(target,'SOURCES.md'));
fs.copyFileSync(path.join(root,'shared/v102/V102_PRODUCTION_SPEC.md'),path.join(target,'V102_PRODUCTION_SPEC.md'));
fs.writeFileSync(path.join(target,'production-manifest.json'),JSON.stringify({productionSystemVersion:10,videoId:'V102-welfare-paradox',method:'V99-original-scene',policy:{sceneCount:142,phaseCount:27,uniqueActionPerSentence:true,uniqueBackgroundPerSentence:true,genericFallbackProhibited:true,minFamiliesInSixShots:5,measuredMaxSceneSeconds:15,originalVectorScenes:true,previewStillsRequired:27,contactSheetRequired:true,measuredVoiceTimingRequired:true}},null,2));
console.log('V102 preflight: '+beats.length+' scenes / '+Object.keys(phaseCounts).length+' phases / '+new Set(beats.map(b=>b.family)).size+' visual families / '+new Set(beats.map(b=>b.actionId)).size+' original actions');