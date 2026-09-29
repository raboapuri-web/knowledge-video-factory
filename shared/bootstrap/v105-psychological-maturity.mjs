import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const target=path.join(root,'v105-psychological-maturity');
const template=path.join(root,'v44-interaction-attraction');
const sources=path.join(root,'shared/v105');
if(!fs.existsSync(template))throw Error('V44 Remotion production template missing');
fs.rmSync(target,{recursive:true,force:true});
fs.cpSync(template,target,{recursive:true});
const sections=[
 ['00-prologue','prologue',24],['01-adulthood','01-adulthood',19],
 ['02-overprotection','02-overprotection',20],['03-social-roles','03-social-roles',21],
 ['04-masculinity','04-masculinity',20],['05-epilogue','05-epilogue',12]
];
const originalCode=fs.readFileSync(path.join(sources,'immaturity-scenes.tsx'),'utf8');
const art=fs.readFileSync(path.join(sources,'maturity-art.tsx'),'utf8');
const engine=fs.readFileSync(path.join(sources,'maturity-engine.tsx'),'utf8');
const getSet=(source,key)=>{
 const pattern=key+"=new Set\\('([^']+)'\\.split\\(' '\\)\\)";
 const match=source.match(new RegExp(pattern));
 if(!match)throw Error('V105 renderer inventory missing '+key);
 return match[1].split(' ');
};
const objects=new Set(['man','teacher','child','family','parentchild','couple','person','people',...getSet(art,'documents'),...getSet(art,'misc')]);
const families=new Set([...getSet(art,'inner'),...getSet(art,'outside'),...getSet(art,'abstract')]);
const verbs=new Set(['movement','decision','complex','compare','abstract'].flatMap(key=>getSet(engine,key+':')));
for(let n=1;n<=24;n++)if(!originalCode.includes('case '+n+':'))throw Error('Original prologue renderer missing '+n);
if(!originalCode.includes("default:throw Error('V105 original renderer missing"))throw Error('Prologue generic fallback prohibited');
if(!engine.includes("throw Error('V105 missing authored scene object/family/verb"))throw Error('Chapter generic fallback prohibited');
const beats=[],phaseCounts={};
for(const [filename,phase,expected] of sections){
 const lines=fs.readFileSync(path.join(sources,'story',filename+'.txt'),'utf8').trim().split('\n').filter(Boolean);
 if(lines.length!==expected)throw Error('Missing authored '+phase+' narration records '+lines.length+'/'+expected);
 phaseCounts[phase]=lines.length;
 for(let i=0;i<lines.length;i++){
  const fields=lines[i].split('|||').map(x=>x.trim());
  if(fields.length!==6)throw Error('Malformed story record '+phase+'/'+i);
  const [narration,family,action,environment,primary,verb]=fields;
  if(!narration||!/[。！？]$/.test(narration)||narration.length<20||narration.length>100)
   throw Error('Fragment or overlong narration '+phase+'/'+i);
  if(!family||!action||!environment||!primary||!verb)throw Error('Unassigned original-action field '+phase+'/'+i);
  if(phase!=='prologue'&&(!families.has(family)||!objects.has(primary)||!verbs.has(verb)))
   throw Error('Unsupported authored renderer '+phase+'/'+i+' family='+family+' primary='+primary+' verb='+verb);
  const globalNo=beats.length+1,no=String(globalNo).padStart(3,'0');
  beats.push({id:'V105-'+no,phase,variant:i,narration,family,action,actionId:'V105-'+action,environment,primary,verb,
   bgGroup:environment,sceneKey:'v105-'+phase+'-'+no,visual:'V105-original-'+no,
   shotKind:['wide','overhead','detail','tracking','macro','split','medium'][i%7]});
 }
 if(phase!=='prologue'&&new Set(beats.slice(-expected).map(x=>x.family)).size<10)
  throw Error('Insufficient visual-family variation '+phase);
}
if(beats.length!==116)throw Error('V105 full film expects 116 original scenes');
for(const key of ['id','actionId','environment','sceneKey','bgGroup','visual'])
 if(new Set(beats.map(b=>b[key])).size!==116)throw Error('Reused '+key);
for(let i=0;i<beats.length;i++){
 if(i&&beats[i].family===beats[i-1].family)throw Error('Adjacent similar composition '+beats[i].id);
 const w=beats.slice(Math.max(0,i-5),i+1);
 if(w.length===6&&new Set(w.map(x=>x.family)).size<5)throw Error('Six-shot visual-family repetition '+beats[i].id);
}
const characters=beats.reduce((sum,b)=>sum+b.narration.length,0);
if(characters<5800)throw Error('Narration script too short for 10-minute target '+characters);
const dst=path.join(target,'src'),scripts=path.join(target,'scripts');
fs.mkdirSync(dst,{recursive:true});fs.mkdirSync(scripts,{recursive:true});
for(const file of ['index.tsx','scenes.tsx','immaturity-scenes.tsx','maturity-art.tsx','maturity-engine.tsx'])fs.copyFileSync(path.join(sources,file),path.join(dst,file));
fs.copyFileSync(path.join(root,'shared/v100/primitives.tsx'),path.join(dst,'primitives.tsx'));
fs.writeFileSync(path.join(target,'script.txt'),sections.map(([name])=>fs.readFileSync(path.join(sources,'story',name+'.txt'),'utf8').trim().split('\n').map(x=>x.split('|||')[0]).join('\n')).join('\n\n')+'\n');
fs.writeFileSync(path.join(dst,'script-data.json'),JSON.stringify({videoId:'V105-psychological-maturity-full',title:'なぜ大人になっても「少年」のままの男がいるのか？',beats},null,2));
fs.writeFileSync(path.join(dst,'scene-data.json'),JSON.stringify(beats,null,2));
fs.writeFileSync(path.join(dst,'sync-timing.json'),JSON.stringify({durationSeconds:1080,beats:[]},null,2));
fs.writeFileSync(path.join(scripts,'generate-voicevox.mjs'),"import path from 'node:path';import {fileURLToPath} from 'node:url';import {generateVoicevox} from '../../shared/voice/generate-voicevox.mjs';const h=path.dirname(fileURLToPath(import.meta.url));await generateVoicevox(path.resolve(h,'..'),{speaker:'青山龍星',style:'ノーマル',speed:1.15,pitchScale:-0.026,intonationScale:0.86,padDuration:0.17});");
fs.copyFileSync(path.join(root,'shared/v53/generate-bgm.mjs'),path.join(scripts,'generate-bgm.mjs'));
fs.copyFileSync(path.join(root,'v44-interaction-attraction/scripts/plan-segments.mjs'),path.join(scripts,'plan-segments.mjs'));
fs.writeFileSync(path.join(scripts,'check-original-scenes.mjs'),"import fs from 'node:fs';\nconst beats=JSON.parse(fs.readFileSync('src/scene-data.json','utf8')),sync=JSON.parse(fs.readFileSync('src/sync-timing.json','utf8'));\nif(beats.length!==116||sync.beats?.length!==116)throw Error('V105 complete narration/scene count mismatch');\nlet max=0;\nfor(let i=0;i<beats.length;i++){\n if(sync.beats[i].id!==beats[i].id)throw Error('VOICEVOX beat mismatch '+i);\n const duration=sync.beats[i].end-sync.beats[i].start;\n if(!(duration>0)||duration>=17.5)throw Error('Overlong or invalid narration shot '+beats[i].id+' '+duration.toFixed(2)+'s');\n max=Math.max(max,duration);\n if(i&&beats[i].family===beats[i-1].family)throw Error('Adjacent family repetition '+beats[i].id);\n const window=beats.slice(Math.max(0,i-5),i+1);\n if(window.length===6&&new Set(window.map(x=>x.family)).size<5)throw Error('Visual family repetition '+beats[i].id);\n}\nif(!(sync.durationSeconds>=605))throw Error('FAIL: actual voiced duration under ten minutes '+sync.durationSeconds.toFixed(2)+'s');\nconsole.log('PASS '+beats.length+' original scenes; voiced duration '+sync.durationSeconds.toFixed(2)+'s; longest shot '+max.toFixed(2)+'s');");
fs.writeFileSync(path.join(scripts,'build-preproduction.mjs'),"import fs from 'node:fs';\nconst beats=JSON.parse(fs.readFileSync('src/scene-data.json','utf8')),phaseCounts={},families={};\nfor(const b of beats){phaseCounts[b.phase]=(phaseCounts[b.phase]||0)+1;families[b.family]=(families[b.family]||0)+1;}\nfs.mkdirSync('qa',{recursive:true});\nfs.writeFileSync('preproduction-plan.json',JSON.stringify({videoId:'V105-psychological-maturity-full',stage:'full',scenes:beats},null,2));\nfs.writeFileSync('qa/preproduction-summary.json',JSON.stringify({videoId:'V105-psychological-maturity-full',stage:'full',sceneCount:beats.length,phaseCounts,uniqueActions:new Set(beats.map(b=>b.actionId)).size,uniqueEnvironments:new Set(beats.map(b=>b.environment)).size,visualFamilies:families,preflight:true},null,2));");
for(const f of ['V105_PRODUCTION_SPEC.md','SOURCES.md'])if(fs.existsSync(path.join(sources,f)))fs.copyFileSync(path.join(sources,f),path.join(target,f));
fs.writeFileSync(path.join(target,'production-manifest.json'),JSON.stringify({videoId:'V105-psychological-maturity-full',stage:'full',method:'V104 authored 116-scene six-part full film',render:{width:1920,height:1080,fps:30,voicevox:'青山龍星',subtitles:true,bgm:true,sfx:false},policy:{manualOriginalAnimationPerBeat:true,uniqueSceneAction:true,uniqueEnvironment:true,noGenericFallback:true,minMeasuredNarrationSeconds:605,maxMeasuredShotSeconds:17.5}},null,2));
console.log('V105 preflight PASS: 116 original narration-specific scenes in six chapters');
