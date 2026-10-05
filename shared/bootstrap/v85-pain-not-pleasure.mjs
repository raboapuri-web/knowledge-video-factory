import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const target=path.join(root,'v85-pain-not-pleasure');
const template=path.join(root,'v44-interaction-attraction');
if(!fs.existsSync(template))throw Error('V44 base project is missing');
fs.rmSync(target,{recursive:true,force:true});
fs.cpSync(template,target,{recursive:true,filter:(p)=>!p.includes('node_modules')&&!p.includes('/out/')&&!p.includes('/.git/')});
const source=fs.readFileSync(path.join(root,'shared/v85/pain-not-pleasure-script.txt'),'utf8').trim();
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
if(units.length<120)throw Error('Too few semantic cuts: '+units.length);
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
if(phases.size!==17)throw Error('Expected 17 story worlds, got '+phases.size);
const detect=(s)=>{
 if(/スマートフォン|動画|画面|通知/.test(s))return 'digital-temptation';
 if(/歩|走|運動|筋肉|負荷|階段/.test(s))return 'physical-effort';
 if(/ディオゲネス|アテネ|キュニコス/.test(s))return 'ancient-philosophy';
 if(/快楽|苦痛|刺激|満足|退屈/.test(s))return 'pleasure-pain';
 if(/研究|ニーチェ|レンブケ|Easter|ホルミシス/.test(s))return 'research-concept';
 if(/食事|菓子|空腹/.test(s))return 'food-reward';
 return 'contextual-action';
};
const counts={};
let group=0;
const beats=units.map((u,i)=>{
 group++;
 const variant=counts[u.phase]||0;counts[u.phase]=variant+1;
 return {id:'S'+String(i+1).padStart(3,'0'),phase:u.phase,narration:u.narration,variant,
   visual:'v85-'+String(i+1).padStart(3,'0')+'-'+u.phase,
   bgGroup:'B'+String(group).padStart(3,'0'),bgSeed:group,
   shotKind:['establish','medium','macro','over-shoulder','detail','diagram','wide','reaction'][variant%8],
   foreground:detect(u.narration),cameraSeed:(group*7)%13,assetComposition:'auto'};
});
if(group<120)throw Error('Background group count too low '+group);
fs.writeFileSync(path.join(target,'script.txt'),source.replace(/\[\[[a-z0-9_]+\]\]\s*/g,'')+'\n');
fs.writeFileSync(path.join(target,'src/script-data.json'),JSON.stringify({videoId:'V85-pain-not-pleasure',title:'快楽ではなく、苦痛を追い求めよ【神経科学×古代哲学×ホルミシス×ストレス適応】',beats},null,2));
fs.writeFileSync(path.join(target,'src/scene-data.json'),JSON.stringify(beats,null,2));
fs.writeFileSync(path.join(target,'src/sync-timing.json'),JSON.stringify({durationSeconds:1050,beats:[]}));
for(const name of ['index.tsx','scenes.tsx'])fs.copyFileSync(path.join(root,'shared/v85',name),path.join(target,'src',name));
for(const name of ['generate-bgm.mjs','plan-segments.mjs'])fs.copyFileSync(path.join(root,'shared/v53',name),path.join(target,'scripts',name));
fs.writeFileSync(path.join(target,'scripts/generate-voicevox.mjs'),"import path from 'node:path';import {fileURLToPath} from 'node:url';import {generateVoicevox} from '../../shared/voice/generate-voicevox.mjs';const here=path.dirname(fileURLToPath(import.meta.url));await generateVoicevox(path.resolve(here,'..'),{speaker:'青山龍星',style:'ノーマル',speed:1.13,pitchScale:-0.026,intonationScale:0.86});");
fs.writeFileSync(path.join(target,'scripts/build-preproduction.mjs'),"import fs from 'node:fs';import path from 'node:path';const root=path.resolve(import.meta.dirname,'..');const d=JSON.parse(fs.readFileSync(path.join(root,'src/script-data.json'),'utf8'));fs.mkdirSync(path.join(root,'qa'),{recursive:true});const scenes=d.beats.map((b)=>({video_id:d.videoId,scene_id:b.id,phase:b.phase,narration:b.narration,scene_type:b.shotKind,template_id:'v85-'+b.phase,template_source:'shared/v85/scenes.tsx',foreground_props:b.foreground,visual_intent:b.visual,background_group:b.bgGroup,background_key:b.bgSeed,expected_duration_sec:Math.max(3,b.narration.length*.115),human_review:'pending',automatic_checks:'await production QA'}));fs.writeFileSync(path.join(root,'preproduction-plan.json'),JSON.stringify({videoId:d.videoId,scenes},null,2));fs.writeFileSync(path.join(root,'qa/preproduction-summary.json'),JSON.stringify({videoId:d.videoId,sceneCount:scenes.length,backgroundGroups:new Set(scenes.map(x=>x.background_group)).size,phaseCount:new Set(scenes.map(x=>x.phase)).size},null,2));");
fs.copyFileSync(path.join(root,'shared/v85/SOURCES.md'),path.join(target,'SOURCES.md'));
fs.copyFileSync(path.join(root,'shared/v85/V85_PRODUCTION_SPEC.md'),path.join(target,'V85_PRODUCTION_SPEC.md'));
fs.writeFileSync(path.join(target,'production-manifest.json'),JSON.stringify({productionSystemVersion:4,videoId:'V85-pain-not-pleasure',sceneMode:'microsemantic',requiresPreproductionPlan:true,approvedTemplateBackgrounds:['BG_town.png','BG_syosai.png'],approvedCharacterTemplates:[],policy:{noGenericFallback:true,animatedBackgroundRequired:true,noNonconsecutiveBackgroundReuse:true,meaningfulForegroundMutation:true,measuredVoiceTiming:true,contactSheetRequired:true,maxConsecutiveSameBackground:1,minBackgroundGroups:120,minScenes:120}},null,2));
console.log('V85: '+beats.length+' narration scenes / '+group+' unique plates / '+phases.size+' worlds / '+source.length+' script chars');
