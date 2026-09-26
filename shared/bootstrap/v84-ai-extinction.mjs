import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const target=path.join(root,'v84-ai-extinction');
const template=path.join(root,'v44-interaction-attraction');
if(!fs.existsSync(template))throw Error('V44 base project is missing');
fs.rmSync(target,{recursive:true,force:true});
fs.cpSync(template,target,{recursive:true,filter:(p)=>!p.includes('node_modules')&&!p.includes('/out/')&&!p.includes('/.git/')});
const source=fs.readFileSync(path.join(root,'shared/v84/ai-extinction-script.txt'),'utf8').trim();
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
if(units.length<180)throw Error('Too few semantic cuts: '+units.length);
while(units.length>340){
 let best=-1,score=1e10;
 for(let i=0;i<units.length-1;i++){
  if(units[i].phase!==units[i+1].phase)continue;
  const s=units[i].narration.length+units[i+1].narration.length;
  if(s<score){score=s;best=i;}
 }
 if(best<0)throw Error('Unable to merge without crossing worlds');
 units.splice(best,2,{phase:units[best].phase,narration:units[best].narration+units[best+1].narration});
}
const phases=new Set(units.map(x=>x.phase));
if(phases.size!==26)throw Error('Expected 26 story worlds, got '+phases.size);
const detect=(s)=>{
 if(/データセンター|サーバー|計算資源|電力/.test(s))return 'compute-infrastructure';
 if(/停止|電源|修正|制御/.test(s))return 'shutdown-control';
 if(/研究|実験|論文|評価/.test(s))return 'research-evaluation';
 if(/AI|モデル|エージェント|システム/.test(s))return 'ai-agent';
 if(/企業|会社|経営|競争|市場/.test(s))return 'business-race';
 if(/金融|銀行|取引/.test(s))return 'finance';
 if(/行政|役所|申請/.test(s))return 'public-system';
 if(/軍事|安全保障|警戒|指揮/.test(s))return 'security';
 if(/人間|人類|社会|権力/.test(s))return 'human-society';
 return 'contextual-action';
};
const counts={};
let group=0;
const beats=units.map((u,i)=>{
 group++;
 const variant=counts[u.phase]||0;counts[u.phase]=variant+1;
 return {id:'S'+String(i+1).padStart(3,'0'),phase:u.phase,narration:u.narration,variant,
   visual:'v84-'+String(i+1).padStart(3,'0')+'-'+u.phase,
   bgGroup:'B'+String(group).padStart(3,'0'),bgSeed:group,
   shotKind:['establish','medium','macro','over-shoulder','detail','diagram','wide','reaction'][variant%8],
   foreground:detect(u.narration),cameraSeed:(group*7)%13,assetComposition:'auto'};
});
if(group<180)throw Error('Background group count too low '+group);
fs.writeFileSync(path.join(target,'script.txt'),source.replace(/\[\[[a-z0-9_]+\]\]\s*/g,'')+'\n');
fs.writeFileSync(path.join(target,'src/script-data.json'),JSON.stringify({videoId:'V84-ai-extinction',title:'なぜ、感情のないAIによって、人類は滅びるのか？【AIアラインメント×ゲーム理論×自律エージェント×文明論】',beats},null,2));
fs.writeFileSync(path.join(target,'src/scene-data.json'),JSON.stringify(beats,null,2));
fs.writeFileSync(path.join(target,'src/sync-timing.json'),JSON.stringify({durationSeconds:1200,beats:[]}));
for(const name of ['index.tsx','scenes.tsx'])fs.copyFileSync(path.join(root,'shared/v84',name),path.join(target,'src',name));
for(const name of ['generate-bgm.mjs','plan-segments.mjs'])fs.copyFileSync(path.join(root,'shared/v53',name),path.join(target,'scripts',name));
fs.writeFileSync(path.join(target,'scripts/generate-voicevox.mjs'),"import path from 'node:path';import {fileURLToPath} from 'node:url';import {generateVoicevox} from '../../shared/voice/generate-voicevox.mjs';const here=path.dirname(fileURLToPath(import.meta.url));await generateVoicevox(path.resolve(here,'..'),{speaker:'青山龍星',style:'ノーマル',speed:1.13,pitchScale:-0.026,intonationScale:0.86});");
fs.writeFileSync(path.join(target,'scripts/build-preproduction.mjs'),"import fs from 'node:fs';import path from 'node:path';const root=path.resolve(import.meta.dirname,'..');const d=JSON.parse(fs.readFileSync(path.join(root,'src/script-data.json'),'utf8'));fs.mkdirSync(path.join(root,'qa'),{recursive:true});const scenes=d.beats.map((b)=>({video_id:d.videoId,scene_id:b.id,phase:b.phase,narration:b.narration,scene_type:b.shotKind,template_id:'v84-'+b.phase,template_source:'shared/v84/scenes.tsx',foreground_props:b.foreground,visual_intent:b.visual,background_group:b.bgGroup,background_key:b.bgSeed,expected_duration_sec:Math.max(3,b.narration.length*.115),human_review:'pending',automatic_checks:'await production QA'}));fs.writeFileSync(path.join(root,'preproduction-plan.json'),JSON.stringify({videoId:d.videoId,scenes},null,2));fs.writeFileSync(path.join(root,'qa/preproduction-summary.json'),JSON.stringify({videoId:d.videoId,sceneCount:scenes.length,backgroundGroups:new Set(scenes.map(x=>x.background_group)).size,phaseCount:new Set(scenes.map(x=>x.phase)).size},null,2));");
fs.copyFileSync(path.join(root,'shared/v84/SOURCES.md'),path.join(target,'SOURCES.md'));
fs.copyFileSync(path.join(root,'shared/v84/V84_PRODUCTION_SPEC.md'),path.join(target,'V84_PRODUCTION_SPEC.md'));
fs.writeFileSync(path.join(target,'production-manifest.json'),JSON.stringify({productionSystemVersion:4,videoId:'V84-ai-extinction',sceneMode:'microsemantic',requiresPreproductionPlan:true,approvedTemplateBackgrounds:['BG_office.png','BG_kenkyu.png','BG_syosai.png','BG_bank.png','BG_town.png','BG_darkroom.png'],approvedCharacterTemplates:['OfficeWorkerRig','OfficeWomanRig','RESEARCHER_MAN','RESEARCHER_WOMAN','PASSERBY'],policy:{noGenericFallback:true,animatedBackgroundRequired:true,noNonconsecutiveBackgroundReuse:true,meaningfulForegroundMutation:true,measuredVoiceTiming:true,contactSheetRequired:true,maxConsecutiveSameBackground:1,minBackgroundGroups:180,minScenes:180}},null,2));
console.log('V84: '+beats.length+' narration scenes / '+group+' unique plates / '+phases.size+' worlds / '+source.length+' script chars');
