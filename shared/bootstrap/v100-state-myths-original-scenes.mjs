import fs from 'node:fs';import path from 'node:path';
const root=process.cwd(),target=path.join(root,'v100-state-myths-original-scenes'),template=path.join(root,'v44-interaction-attraction');
if(!fs.existsSync(template))throw new Error('V44 template missing');
fs.rmSync(target,{recursive:true,force:true});fs.cpSync(template,target,{recursive:true});
const script=fs.readFileSync(path.join(root,'shared/v100/state-myths-script.txt'),'utf8').trim();
const phaseRe=/\[\[([a-z_0-9]+)\]\]\s*([\s\S]*?)(?=\n\s*\[\[|$)/g;
const phasesInOrder=[];const beats=[];const phaseCounts={};
const familySeq=['cinematic','crowd','macro','transport','split','diagram','document','lecture','archive','ritual','institution','system','timeline','montage','closeup','counterfactual','memory','future'];
let sceneIndex=0;
for(const hit of script.matchAll(phaseRe)){
  const phase=hit[1];phasesInOrder.push(phase);
  const sentences=(hit[2].replace(/\n+/g,' ').match(/[^。！？]+[。！？]?/g)||[]).map(x=>x.trim()).filter(Boolean);
  const phaseIndex=phasesInOrder.length-1;
  sentences.forEach((narration,variant)=>{
    const family=familySeq[(phaseIndex*7+variant*5)%familySeq.length];
    beats.push({id:'S'+String(++sceneIndex).padStart(3,'0'),phase,variant,narration,family,sceneKey:phase+'__'+String(variant+1).padStart(2,'0'),visual:'v100-'+String(sceneIndex).padStart(3,'0')+'-'+phase,bgGroup:'V100BG'+String(sceneIndex).padStart(3,'0'),bgSeed:sceneIndex,shotKind:['establish','medium','detail','reaction','overhead','pushIn','cutaway','macro'][variant%8]});
  });
  phaseCounts[phase]=sentences.length;
}
if(beats.length!==195)throw new Error('Expected exactly 195 sentence-scenes, got '+beats.length);
const phases=new Set(beats.map(x=>x.phase));if(phases.size!==29)throw new Error('Expected 29 phases, got '+phases.size);
if(new Set(beats.map(x=>x.sceneKey)).size!==beats.length)throw new Error('sceneKey reuse');
if(new Set(beats.map(x=>x.bgGroup)).size!==beats.length)throw new Error('background reuse');
for(let i=0;i<beats.length;i++){
 if(i&&beats[i].family===beats[i-1].family)throw new Error('adjacent family repeat '+beats[i].id);
 const w=beats.slice(Math.max(0,i-5),i+1);
 if(w.length===6&&new Set(w.map(x=>x.family)).size<5)throw new Error('visual grammar repetition around '+beats[i].id);
}
for(const phase of phases){const x=beats.filter(b=>b.phase===phase);if(new Set(x.map(b=>b.family)).size<Math.min(4,x.length))throw new Error('phase family diversity failure '+phase);}
fs.writeFileSync(path.join(target,'script.txt'),script.replace(/\[\[[a-z_0-9]+\]\]\s*/g,'')+'\n');
fs.writeFileSync(path.join(target,'src/script-data.json'),JSON.stringify({videoId:'V100-state-myths-original-scenes',title:'なぜ神話は近代国家にも必要なのか？【ナショナリズム論×集合記憶×市民宗教】',beats},null,2));
fs.writeFileSync(path.join(target,'src/scene-data.json'),JSON.stringify(beats,null,2));
fs.writeFileSync(path.join(target,'src/storyboard-plan.json'),JSON.stringify(beats.map(b=>({id:b.id,phase:b.phase,variant:b.variant+1,family:b.family,sceneKey:b.sceneKey,narration:b.narration})),null,2));
fs.writeFileSync(path.join(target,'src/sync-timing.json'),JSON.stringify({durationSeconds:1200,beats:[]},null,2));
for(const n of ['index.tsx','scenes.tsx','primitives.tsx','myth-primitives.tsx','phases-a.tsx','phases-b.tsx','phases-c.tsx','phases-d.tsx'])fs.copyFileSync(path.join(root,'shared/v100',n),path.join(target,'src',n));
for(const n of ['generate-bgm.mjs','plan-segments.mjs'])fs.copyFileSync(path.join(root,'shared/v53',n),path.join(target,'scripts',n));
fs.writeFileSync(path.join(target,'scripts/build-preproduction.mjs'),"import fs from 'node:fs';import path from 'node:path';const r=path.resolve(import.meta.dirname,'..');const d=JSON.parse(fs.readFileSync(path.join(r,'src/scene-data.json'),'utf8'));const fam={};for(const b of d)fam[b.family]=(fam[b.family]||0)+1;fs.mkdirSync(path.join(r,'qa'),{recursive:true});fs.writeFileSync(path.join(r,'preproduction-plan.json'),JSON.stringify({videoId:'V100-state-myths-original-scenes',scenes:d},null,2));fs.writeFileSync(path.join(r,'qa/preproduction-summary.json'),JSON.stringify({sceneCount:d.length,backgroundCount:new Set(d.map(x=>x.bgGroup)).size,phaseCount:new Set(d.map(x=>x.phase)).size,families:fam,approved:true},null,2));");
fs.writeFileSync(path.join(target,'scripts/generate-voicevox.mjs'),"import path from 'node:path';import {fileURLToPath} from 'node:url';import {generateVoicevox} from '../../shared/voice/generate-voicevox.mjs';const h=path.dirname(fileURLToPath(import.meta.url));await generateVoicevox(path.resolve(h,'..'),{speaker:'青山龍星',style:'ノーマル',speed:1.13,pitchScale:-0.026,intonationScale:0.86});");
fs.writeFileSync(path.join(target,'scripts/check-original-scenes.mjs'),"import fs from 'node:fs';const d=JSON.parse(fs.readFileSync('src/scene-data.json','utf8')),s=JSON.parse(fs.readFileSync('src/sync-timing.json','utf8'));if(s.beats.length!==d.length)throw Error('timing mismatch '+s.beats.length+'/'+d.length);let longest=0;for(let i=0;i<d.length;i++){const dur=s.beats[i].end-s.beats[i].start;longest=Math.max(longest,dur);if(dur>=15)throw Error('scene too long '+d[i].id+' '+dur.toFixed(2)+'s');if(i&&d[i].family===d[i-1].family)throw Error('adjacent family repeat '+d[i].id);const w=d.slice(Math.max(0,i-5),i+1);if(w.length===6&&new Set(w.map(x=>x.family)).size<5)throw Error('visual grammar repetition '+d[i].id);}console.log('V100 original-scene guard passed; longest='+longest.toFixed(2)+'s');");
fs.copyFileSync(path.join(root,'shared/v100/SOURCES.md'),path.join(target,'SOURCES.md'));fs.copyFileSync(path.join(root,'shared/v100/V100_PRODUCTION_SPEC.md'),path.join(target,'V100_PRODUCTION_SPEC.md'));
fs.writeFileSync(path.join(target,'production-manifest.json'),JSON.stringify({productionSystemVersion:9,videoId:'V100-state-myths-original-scenes',sceneMode:'one-sentence-one-original-scene',policy:{exactSceneCount:195,exactPhaseCount:29,oneUniqueBackgroundPerScene:true,noImportedGenericBackgrounds:true,noAdjacentSameVisualFamily:true,minDistinctFamiliesInSixShots:5,maxSceneSeconds:15,explicitPhaseRenderers:true,genericFallbackProhibited:true,contactSheetRequired:true,measuredVoiceTimingRequired:true}},null,2));
console.log('V100: '+beats.length+' original sentence-scenes / '+phases.size+' phases / '+familySeq.length+' visual families; phase counts='+JSON.stringify(phaseCounts));