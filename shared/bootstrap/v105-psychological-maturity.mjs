import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const target=path.join(root,'v105-psychological-maturity');
const template=path.join(root,'v44-interaction-attraction');
const sources=path.join(root,'shared/v105');
if(!fs.existsSync(template))throw Error('V44 Remotion production template missing');
fs.rmSync(target,{recursive:true,force:true});
fs.cpSync(template,target,{recursive:true});
const lines=fs.readFileSync(path.join(sources,'story/00-prologue.txt'),'utf8').trim().split('\n').filter(Boolean);
if(lines.length!==24)throw Error('V105 prologue requires 24 fully authored scene actions');
const beats=lines.map((line,i)=>{
 const fields=line.split('|||').map(v=>v.trim());
 if(fields.length!==6)throw Error('Malformed authored scene line '+(i+1));
 const [narration,family,action,environment,primary,verb]=fields;
 if(!narration||!/[。！？]$/.test(narration)||narration.length<20||narration.length>90)throw Error('Missing or overlong V105 narration '+(i+1));
 if(!family||!action||!environment||!primary||!verb)throw Error('Unassigned scene-specific action '+(i+1));
 const no=String(i+1).padStart(3,'0');
 return {id:'P-'+no,phase:'prologue',variant:i,narration,family,action,actionId:'V105-'+action,environment,primary,verb,bgGroup:environment,sceneKey:'v105-prologue-'+no,visual:'V105-unique-'+no,shotKind:['wide','overhead','macro','tracking','medium','split','detail'][i%7]};
});
for(const prop of ['id','actionId','family','bgGroup','sceneKey','visual','verb']){
 if(new Set(beats.map(b=>b[prop])).size!==24)throw Error('Duplicate V105 original '+prop);
}
for(let i=0;i<beats.length;i++){
 if(i&&beats[i-1].family===beats[i].family)throw Error('Adjacent repeat '+beats[i].id);
 const window=beats.slice(Math.max(0,i-5),i+1);
 if(window.length===6&&new Set(window.map(x=>x.family)).size<5)throw Error('Six-cut repetition '+beats[i].id);
}
const engine=fs.readFileSync(path.join(sources,'immaturity-scenes.tsx'),'utf8');
for(let n=1;n<=24;n++)if(!engine.includes('case '+n+':'))throw Error('Dedicated V105 renderer missing: '+n);
if(!engine.includes("default:throw Error('V105 original renderer missing"))throw Error('V105 generic visual fallback detected');
const dst=path.join(target,'src'),scripts=path.join(target,'scripts');
fs.mkdirSync(dst,{recursive:true});fs.mkdirSync(scripts,{recursive:true});
for(const file of ['index.tsx','scenes.tsx','immaturity-scenes.tsx'])fs.copyFileSync(path.join(sources,file),path.join(dst,file));
fs.copyFileSync(path.join(root,'shared/v100/primitives.tsx'),path.join(dst,'primitives.tsx'));
fs.writeFileSync(path.join(target,'script.txt'),beats.map(b=>b.narration).join('\n')+'\n');
fs.writeFileSync(path.join(dst,'script-data.json'),JSON.stringify({videoId:'V105-psychological-maturity',title:'なぜ大人になっても「少年」のままの男がいるのか？',beats},null,2));
fs.writeFileSync(path.join(dst,'scene-data.json'),JSON.stringify(beats,null,2));
fs.writeFileSync(path.join(dst,'sync-timing.json'),JSON.stringify({durationSeconds:240,beats:[]},null,2));
fs.writeFileSync(path.join(scripts,'generate-voicevox.mjs'),"import path from 'node:path';import {fileURLToPath} from 'node:url';import {generateVoicevox} from '../../shared/voice/generate-voicevox.mjs';const h=path.dirname(fileURLToPath(import.meta.url));await generateVoicevox(path.resolve(h,'..'),{speaker:'青山龍星',style:'ノーマル',speed:1.15,pitchScale:-0.026,intonationScale:0.86,padDuration:0.17});");
fs.copyFileSync(path.join(root,'shared/v53/generate-bgm.mjs'),path.join(scripts,'generate-bgm.mjs'));
fs.writeFileSync(path.join(scripts,'plan-segments.mjs'),"import fs from 'node:fs';const s=JSON.parse(fs.readFileSync('src/sync-timing.json','utf8'));const frames=Math.ceil(Number(s.durationSeconds)*30),size=Math.ceil(frames/3);console.log(JSON.stringify({include:Array.from({length:3},(_,i)=>({id:String(i).padStart(2,'0'),start:i*size,end:Math.min(frames-1,(i+1)*size-1)})).filter(x=>x.start<frames)}));");
fs.writeFileSync(path.join(scripts,'check-original-scenes.mjs'),"import fs from 'node:fs';const b=JSON.parse(fs.readFileSync('src/scene-data.json','utf8')),s=JSON.parse(fs.readFileSync('src/sync-timing.json','utf8'));if(s.beats?.length!==24||b.length!==24)throw Error('V105 narration/scene count mismatch');let max=0;for(let i=0;i<24;i++){if(s.beats[i].id!==b[i].id)throw Error('VOICEVOX beat ID mismatch '+i);const duration=s.beats[i].end-s.beats[i].start;if(!(duration>0)||duration>=17.5)throw Error('V105 long or invalid shot '+b[i].id+' '+duration.toFixed(2));max=Math.max(max,duration);if(i&&b[i].family===b[i-1].family)throw Error('Repeated family '+b[i].id);}if(!(s.durationSeconds>60))throw Error('Narration duration invalid');console.log('PASS 24 scene narrations; longest='+max.toFixed(2)+'s; total='+s.durationSeconds.toFixed(2)+'s');");
fs.writeFileSync(path.join(scripts,'build-preproduction.mjs'),"import fs from 'node:fs';const beats=JSON.parse(fs.readFileSync('src/scene-data.json','utf8'));fs.mkdirSync('qa',{recursive:true});fs.writeFileSync('preproduction-plan.json',JSON.stringify({videoId:'V105-psychological-maturity',stage:'prologue',scenes:beats},null,2));fs.writeFileSync('qa/preproduction-summary.json',JSON.stringify({videoId:'V105-psychological-maturity',stage:'prologue',sceneCount:beats.length,originalActions:new Set(beats.map(x=>x.actionId)).size,visualFamilies:new Set(beats.map(x=>x.family)).size,backgroundCount:new Set(beats.map(x=>x.environment)).size,renderState:'preflight'},null,2));");
for(const f of ['V105_PRODUCTION_SPEC.md','SOURCES.md'])if(fs.existsSync(path.join(sources,f)))fs.copyFileSync(path.join(sources,f),path.join(target,f));
fs.writeFileSync(path.join(target,'production-manifest.json'),JSON.stringify({videoId:'V105-psychological-maturity',stage:'prologue',method:'V104 authored narration-specific scenes',render:{width:1920,height:1080,fps:30,voicevox:'青山龍星',subtitles:true,bgm:true,sfx:false},policy:{manualOriginalAnimationPerBeat:true,uniqueSceneAction:true,uniqueEnvironment:true,noGenericFallback:true,maxMeasuredShotSeconds:17.5}},null,2));
console.log('V105 preflight PASS: 24 original narration-specific prologue scenes and 24 distinct backgrounds/actions');
