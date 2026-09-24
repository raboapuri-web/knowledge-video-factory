import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const target=path.join(root,'v83-bath-cancel');
const template=path.join(root,'v44-interaction-attraction');
if(!fs.existsSync(template)) throw Error('V44 base project is missing');
fs.rmSync(target,{recursive:true,force:true});
fs.cpSync(template,target,{recursive:true,filter:(p)=>!p.includes('node_modules')&&!p.includes('/out/')&&!p.includes('/.git/')});
const source=fs.readFileSync(path.join(root,'shared/v83/bath-cancel-script.txt'),'utf8').trim();
const re=/\[\[([a-z0-9_]+)\]\]\s*([\s\S]*?)(?=\n\s*\[\[|$)/g;
let units=[];
for(const hit of source.matchAll(re)){
 const phase=hit[1],body=hit[2].replace(/\s*\n\s*/g,' ').trim();
 if(!body)throw Error('empty chapter '+phase);
 for(const line of (body.match(/[^。！？]+[。！？]?/g)||[])){
  const narration=line.trim();
  if(narration)units.push({phase,narration});
 }
}
if(units.length<200)throw Error('Too few semantic cuts: '+units.length);
while(units.length>380){
 let best=-1,score=1e10;
 for(let i=0;i<units.length-1;i++){
  if(units[i].phase!==units[i+1].phase)continue;
  const scoreNow=units[i].narration.length+units[i+1].narration.length+(units[i].narration.includes('「')?5:0);
  if(scoreNow<score){score=scoreNow;best=i;}
 }
 if(best<0)throw Error('Unable to merge without crossing chapters');
 units.splice(best,2,{phase:units[best].phase,narration:units[best].narration+units[best+1].narration});
}
const phases=new Set(units.map(x=>x.phase));
if(phases.size!==24)throw Error('Expected 24 story phases, got '+phases.size);
const detect=(x)=>{
 const s=x.narration;
 if(/湯気|浴室|シャワー|入浴|湯船|蛇口|鏡|水滴/.test(s))return 'bathing';
 if(/微生物|細菌|真菌|角質|皮脂|皮膚|汗腺/.test(s))return 'skin-science';
 if(/靴下|洗濯|衣類|着替|タオル|布団/.test(s))return 'laundry';
 if(/研究|学術|試料|顕微鏡|科学/.test(s))return 'lab';
 if(/通勤|電車|駅|改札|会社|会議/.test(s))return 'commute-work';
 if(/スマートフォン|画面|通知|動画|メッセージ/.test(s))return 'phone';
 if(/睡眠|眠|疲労|疲れ|時刻|時計/.test(s))return 'sleep-time';
 if(/手洗い|衛生|感染|食事|食器/.test(s))return 'hygiene';
 return 'human-action';
};
let prev='',inPhase=0,group=0;
const counts={};
const beats=units.map((u,i)=>{
 if(prev!==u.phase){prev=u.phase;inPhase=0;}
 group++;
 const variant=counts[u.phase]||0;counts[u.phase]=variant+1;inPhase++;
 return {id:'S'+String(i+1).padStart(3,'0'),phase:u.phase,narration:u.narration,variant,
  visual:'v83-'+String(i+1).padStart(3,'0')+'-'+u.phase,
  bgGroup:'B'+String(group).padStart(3,'0'),bgSeed:group,
  shotKind:['establish','reaction','macro','over-shoulder','detail','graph','wide','cutaway'][variant%8],
  foreground:detect(u),cameraSeed:(Math.floor(group/2)%5)};
});
if(group<200)throw Error('Continuity/background count too low '+group);
fs.writeFileSync(path.join(target,'script.txt'),source.replace(/\[\[[a-z0-9_]+\]\]\s*/g,'')+'\n');
fs.writeFileSync(path.join(target,'src/script-data.json'),JSON.stringify({videoId:'V83-bath-cancel',title:'風呂キャンセルしすぎるとどうなるのか？【皮膚科学×微生物学×衛生の歴史×行動心理学】',beats},null,2));
fs.writeFileSync(path.join(target,'src/scene-data.json'),JSON.stringify(beats,null,2));
fs.writeFileSync(path.join(target,'src/sync-timing.json'),JSON.stringify({durationSeconds:1300,beats:[]}));
for(const name of ['index.tsx','scenes.tsx'])fs.copyFileSync(path.join(root,'shared/v83',name),path.join(target,'src',name));
for(const name of ['generate-bgm.mjs','plan-segments.mjs'])fs.copyFileSync(path.join(root,'shared/v53',name),path.join(target,'scripts',name));
fs.writeFileSync(path.join(target,'scripts/generate-voicevox.mjs'),"import path from 'node:path';import {fileURLToPath} from 'node:url';import {generateVoicevox} from '../../shared/voice/generate-voicevox.mjs';const here=path.dirname(fileURLToPath(import.meta.url));await generateVoicevox(path.resolve(here,'..'),{speaker:'青山龍星',style:'ノーマル',speed:1.13,pitchScale:-0.026,intonationScale:0.86});");
fs.writeFileSync(path.join(target,'scripts/build-preproduction.mjs'),"import fs from 'node:fs';import path from 'node:path';const root=path.resolve(import.meta.dirname,'..');const d=JSON.parse(fs.readFileSync(path.join(root,'src/script-data.json'),'utf8'));fs.mkdirSync(path.join(root,'qa'),{recursive:true});const scenes=d.beats.map((b,i)=>({video_id:d.videoId,scene_id:b.id,beat_id:b.id,phase:b.phase,narration:b.narration,scene_type:b.shotKind,template_id:'original-v83-'+b.phase,template_source:'shared/v83/scenes.tsx',foreground_props:b.foreground,visual_intent:b.visual,background_group:b.bgGroup,background_key:b.bgSeed,expected_duration_sec:Math.max(3,b.narration.length*.115),human_review:'pending',automatic_checks:'await production QA'}));fs.writeFileSync(path.join(root,'preproduction-plan.json'),JSON.stringify({videoId:d.videoId,scenes},null,2));fs.writeFileSync(path.join(root,'qa/preproduction-summary.json'),JSON.stringify({videoId:d.videoId,sceneCount:scenes.length,backgroundGroups:new Set(scenes.map(x=>x.background_group)).size},null,2));");
fs.copyFileSync(path.join(root,'shared/v83/SOURCES.md'),path.join(target,'SOURCES.md'));
fs.copyFileSync(path.join(root,'shared/v83/V83_PRODUCTION_SPEC.md'),path.join(target,'V83_PRODUCTION_SPEC.md'));
fs.writeFileSync(path.join(target,'production-manifest.json'),JSON.stringify({productionSystemVersion:3,videoId:'V83-bath-cancel',sceneMode:'microsemantic',requiresPreproductionPlan:true,policy:{noGenericFallback:true,animatedBackgroundRequired:true,staticBackgroundWithinContinuityGroup:false,noNonconsecutiveBackgroundReuse:true,meaningfulForegroundMutation:true,measuredVoiceTiming:true,contactSheetRequired:true,maxConsecutiveSameBackground:1,minBackgroundGroups:200,minScenes:200}},null,2));
console.log('V83: '+beats.length+' original narration scenes / '+group+' continuity plates / '+phases.size+' worlds / '+source.length+' script chars');
