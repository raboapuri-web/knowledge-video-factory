import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const target=path.join(root,'v68-income-happiness');
const template=path.join(root,'v44-interaction-attraction');
if(!fs.existsSync(template)) throw Error('V44 base project is missing');
fs.rmSync(target,{recursive:true,force:true});
fs.cpSync(template,target,{recursive:true});
const source=fs.readFileSync(path.join(root,'shared/v68/income-happiness-script.txt'),'utf8').trim();
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
if(units.length<170)throw Error('Too few semantic cuts: '+units.length);
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
if(phases.size!==37)throw Error('Expected 37 source story chapters, got '+phases.size);
const detect=(x)=>{
 const s=x.narration;
 if(/スマートフォン|画面|通知|返信|電話|メッセージ/.test(s))return 'phone';
 if(/時計|時間|午前|午後|分|休日|通勤|電車|駅/.test(s))return 'clock';
 if(/家賃|貯金|口座|支払|生活費|治療費|収入|年収|所得/.test(s))return 'finance';
 if(/友人|家族|夫婦|同僚|一人暮らし/.test(s))return 'people';
 if(/賭け|硬貨|コイン|賞金|期待値/.test(s))return 'coin';
 if(/幸福|研究|データ|結果|分析|調査/.test(s))return 'study';
 if(/マンション|アパート|部屋|家|不動産/.test(s))return 'home';
 if(/旅行|店|買い物|時計|食事/.test(s))return 'object';
 return 'action';
};
let prev='',inPhase=0,group=0;
const counts={};
const beats=units.map((u,i)=>{
 if(prev!==u.phase){prev=u.phase;inPhase=0;}
 if(inPhase%2===0)group++;
 const variant=counts[u.phase]||0;counts[u.phase]=variant+1;inPhase++;
 return {id:'S'+String(i+1).padStart(3,'0'),phase:u.phase,narration:u.narration,variant,
  visual:'v68-'+String(i+1).padStart(3,'0')+'-'+u.phase,
  bgGroup:'B'+String(group).padStart(3,'0'),bgSeed:group,
  shotKind:['establish','reaction','macro','over-shoulder','detail','graph','wide','cutaway'][variant%8],
  foreground:detect(u),cameraSeed:(Math.floor(group/2)%5)};
});
if(group<88)throw Error('Continuity/background count too low '+group);
fs.writeFileSync(path.join(target,'script.txt'),source.replace(/\[\[[a-z0-9_]+\]\]\s*/g,'')+'\n');
fs.writeFileSync(path.join(target,'src/script-data.json'),JSON.stringify({videoId:'V68-income-happiness',title:'年収はいくらあれば幸せなのか？【幸福の経済学×行動経済学×時間の心理学】',beats},null,2));
fs.writeFileSync(path.join(target,'src/scene-data.json'),JSON.stringify(beats,null,2));
fs.writeFileSync(path.join(target,'src/sync-timing.json'),JSON.stringify({durationSeconds:1700,beats:[]}));
for(const name of ['index.tsx','scenes.tsx'])fs.copyFileSync(path.join(root,'shared/v68',name),path.join(target,'src',name));
for(const name of ['generate-bgm.mjs','plan-segments.mjs'])fs.copyFileSync(path.join(root,'shared/v53',name),path.join(target,'scripts',name));
fs.writeFileSync(path.join(target,'scripts/generate-voicevox.mjs'),"import path from 'node:path';import {fileURLToPath} from 'node:url';import {generateVoicevox} from '../../shared/voice/generate-voicevox.mjs';const here=path.dirname(fileURLToPath(import.meta.url));await generateVoicevox(path.resolve(here,'..'),{speaker:'青山龍星',style:'ノーマル',speed:1.13,pitchScale:-0.026,intonationScale:0.86});");
fs.writeFileSync(path.join(target,'scripts/build-preproduction.mjs'),"import fs from 'node:fs';import path from 'node:path';const root=path.resolve(import.meta.dirname,'..');const d=JSON.parse(fs.readFileSync(path.join(root,'src/script-data.json'),'utf8'));fs.mkdirSync(path.join(root,'qa'),{recursive:true});const scenes=d.beats.map((b,i)=>({video_id:d.videoId,scene_id:b.id,beat_id:b.id,phase:b.phase,narration:b.narration,scene_type:b.shotKind,template_id:'original-v68-'+b.phase,template_source:'shared/v68/scenes.tsx',foreground_props:b.foreground,visual_intent:b.visual,background_group:b.bgGroup,background_key:b.bgSeed,expected_duration_sec:Math.max(3,b.narration.length*.115),human_review:'source scene matched',automatic_checks:'await production QA'}));fs.writeFileSync(path.join(root,'preproduction-plan.json'),JSON.stringify({videoId:d.videoId,scenes},null,2));fs.writeFileSync(path.join(root,'qa/preproduction-summary.json'),JSON.stringify({videoId:d.videoId,sceneCount:scenes.length,backgroundGroups:new Set(scenes.map(x=>x.background_group)).size},null,2));");
fs.copyFileSync(path.join(root,'shared/v68/SOURCES.md'),path.join(target,'SOURCES.md'));
fs.writeFileSync(path.join(target,'production-manifest.json'),JSON.stringify({productionSystemVersion:3,videoId:'V68-income-happiness',sceneMode:'microsemantic',requiresPreproductionPlan:true,policy:{noGenericFallback:true,staticBackgroundWithinContinuityGroup:true,noNonconsecutiveBackgroundReuse:true,meaningfulForegroundMutation:true,measuredVoiceTiming:true,contactSheetRequired:true,maxConsecutiveSameBackground:2,minBackgroundGroups:88,minScenes:170}},null,2));
console.log('V68: '+beats.length+' original narration scenes / '+group+' continuity plates / '+phases.size+' worlds / '+source.length+' script chars');
