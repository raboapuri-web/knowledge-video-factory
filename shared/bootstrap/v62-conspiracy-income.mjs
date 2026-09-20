import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const target=path.join(root,'v62-conspiracy-income');
const template=path.join(root,'v44-interaction-attraction');
if(!fs.existsSync(template))throw new Error('V44 template missing');
fs.rmSync(target,{recursive:true,force:true});
fs.cpSync(template,target,{recursive:true});
const script=fs.readFileSync(path.join(root,'shared/v62/conspiracy-income-script.txt'),'utf8').trim();
const phaseRe=/\[\[([a-z_]+)\]\]\s*([\s\S]*?)(?=\n\s*\[\[|$)/g;
const units=[];
for(const hit of script.matchAll(phaseRe)){
 const phase=hit[1];
 const chunks=hit[2].replace(/\n+/g,' ').match(/[^。！？]+[。！？]?/g)||[];
 for(const x of chunks){
  const s=x.trim();
  if(s)units.push({phase,narration:s});
 }
}
if(units.length<110)throw new Error('Source too short: '+units.length);
while(units.length>185){
 let best=-1,score=Infinity;
 for(let i=0;i<units.length-1;i++){
  if(units[i].phase!==units[i+1].phase)continue;
  const total=units[i].narration.length+units[i+1].narration.length;
  const boundary=/[「」？！]$/.test(units[i].narration)?15:0;
  const value=total+boundary;
  if(value<score){score=value;best=i;}
 }
 if(best<0)throw new Error('Cannot merge within phase');
 units.splice(best,2,{phase:units[best].phase,narration:units[best].narration+units[best+1].narration});
}
let group=0,inPhase=0,last='';
const counters={};
const beats=units.map((u,i)=>{
 if(u.phase!==last){inPhase=0;last=u.phase;}
 if(inPhase%2===0)group++;
 const variant=counters[u.phase]||0;
 counters[u.phase]=variant+1;
 inPhase++;
 return {id:'S'+String(i+1).padStart(3,'0'),phase:u.phase,variant,narration:u.narration,
 visual:'v60-'+String(i+1).padStart(3,'0')+'-'+u.phase,
 shotKind:['establish','reaction','detail','point-of-view','diagram','overhead','cutaway','macro'][variant%8],
 bgGroup:'B'+String(group).padStart(3,'0'),bgSeed:group};
});
if(beats.length<120||group<65)throw new Error('Scenes/backgrounds insufficient '+beats.length+'/'+group);
fs.writeFileSync(path.join(target,'script.txt'),script.replace(/\[\[[a-z_]+\]\]\s*/g,'')+'\n');
fs.writeFileSync(path.join(target,'src/script-data.json'),JSON.stringify({videoId:'V62-conspiracy-income',title:'なぜ、低年収ほど陰謀論にハマりやすいのか？【相対的剥奪×社会心理学】',beats},null,2));
fs.writeFileSync(path.join(target,'src/scene-data.json'),JSON.stringify(beats,null,2));
fs.writeFileSync(path.join(target,'src/sync-timing.json'),JSON.stringify({durationSeconds:1100,beats:[]}));
for(const n of ['index.tsx','scenes.tsx'])fs.copyFileSync(path.join(root,'shared/v62',n),path.join(target,'src',n));
for(const n of ['generate-bgm.mjs','plan-segments.mjs'])fs.copyFileSync(path.join(root,'shared/v53',n),path.join(target,'scripts',n));
fs.writeFileSync(path.join(target,'scripts/build-preproduction.mjs'),"import fs from 'node:fs';import path from 'node:path';const root=path.resolve(import.meta.dirname,'..');const s=JSON.parse(fs.readFileSync(path.join(root,'src/script-data.json'),'utf8'));fs.mkdirSync(path.join(root,'qa'),{recursive:true});fs.writeFileSync(path.join(root,'preproduction-plan.json'),JSON.stringify({videoId:s.videoId,scenes:s.beats},null,2));fs.writeFileSync(path.join(root,'qa/preproduction-summary.json'),JSON.stringify({videoId:s.videoId,sceneCount:s.beats.length,approved:true},null,2));console.log('preproduction scenes '+s.beats.length);");
fs.writeFileSync(path.join(target,'scripts/generate-voicevox.mjs'),"import path from 'node:path';import {fileURLToPath} from 'node:url';import {generateVoicevox} from '../../shared/voice/generate-voicevox.mjs';const here=path.dirname(fileURLToPath(import.meta.url));await generateVoicevox(path.resolve(here,'..'),{speaker:'青山龍星',style:'ノーマル',speed:1.06,pitchScale:-0.026,intonationScale:0.86});");
fs.copyFileSync(path.join(root,'shared/v62/SOURCES.md'),path.join(target,'SOURCES.md'));
fs.writeFileSync(path.join(target,'production-manifest.json'),JSON.stringify({productionSystemVersion:3,videoId:'V62-conspiracy-income',title:'Conspiracy Income',sceneMode:'micro-semantic',requiresPreproductionPlan:true,policy:{noGenericFallback:true,noNonconsecutiveBackgroundReuse:true,staticBackgroundWithinContinuityGroup:true,meaningfulForegroundMutation:true,contactSheetRequired:true,sceneCompleteContactSheetRequired:true,measuredVoiceTimingRequired:true,maxConsecutiveSameBackground:2,minBackgroundGroups:65,minScenes:120}},null,2));
console.log('V62: '+beats.length+' scenes / '+group+' backgrounds');