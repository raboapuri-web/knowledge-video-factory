import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const target=path.join(root,'v85-pursue-pain');
const template=path.join(root,'v44-interaction-attraction');
if(!fs.existsSync(template))throw Error('V44 base project missing');
fs.rmSync(target,{recursive:true,force:true});
fs.cpSync(template,target,{recursive:true,filter:p=>!p.includes('node_modules')&&!p.includes('/out/')&&!p.includes('/.git/')});
const source=fs.readFileSync(path.join(root,'shared/v85/pursue-pain-script.txt'),'utf8').trim();
const re=/\[\[([a-z0-9_]+)\]\]\s*([\s\S]*?)(?=\n\s*\[\[|$)/g;
let units=[];
for(const hit of source.matchAll(re)){
  const phase=hit[1],body=hit[2].replace(/\s*\n\s*/g,' ').trim();
  if(!body)throw Error('empty phase '+phase);
  for(const sentence of (body.match(/[^。！？]+[。！？]?/g)||[])){
    const narration=sentence.trim();
    if(narration)units.push({phase,narration});
  }
}
if(units.length<240||units.length>340)throw Error('V85 semantic scene count outside 240-340: '+units.length);
const phases=new Set(units.map(x=>x.phase));
if(phases.size!==30)throw Error('Expected 30 phases, got '+phases.size);
const foreground=(s)=>{
 if(/歩|走|登|移動|帰|向か|階段/.test(s))return 'locomotion';
 if(/スマートフォン|動画|通知|画面/.test(s))return 'phone';
 if(/食事|料理|菓子|空腹|ご飯|定食/.test(s))return 'food';
 if(/本|文章|読む|読書|理解/.test(s))return 'reading';
 if(/会話|人前|話|相手|伝え/.test(s))return 'dialogue';
 if(/運動|負荷|筋肉|疲労|心拍|適応/.test(s))return 'adaptation';
 if(/選択|自由|決め|避け|我慢|拘束/.test(s))return 'choice';
 if(/研究|ホルミシス|神経|恒常性|脳/.test(s))return 'science';
 return 'contextual';
};
const counts={};
const beats=units.map((u,i)=>{
 const variant=counts[u.phase]||0; counts[u.phase]=variant+1;
 return {
  id:'S'+String(i+1).padStart(3,'0'),
  phase:u.phase,narration:u.narration,variant,
  visual:'v85-'+String(i+1).padStart(3,'0')+'-'+u.phase,
  bgGroup:'B'+String(i+1).padStart(3,'0'),bgSeed:i+1,
  shotKind:['establish','medium','close','over-shoulder','detail','diagram','wide','tracking'][variant%8],
  foreground:foreground(u.narration),
  actionKey:'A'+String(i+1).padStart(3,'0'),
  actionSeed:(i+1)*37%997,
  cameraSeed:(i+1)*53%991
 };
});
for(const k of ['visual','bgGroup','actionKey','cameraSeed']){
 const vals=beats.map(b=>String(b[k]));
 if(new Set(vals).size!==vals.length)throw Error('duplicate '+k);
}
fs.writeFileSync(path.join(target,'script.txt'),source.replace(/\[\[[a-z0-9_]+\]\]\s*/g,'')+'\n');
fs.writeFileSync(path.join(target,'src/script-data.json'),JSON.stringify({videoId:'V85-pursue-pain',title:'快楽ではなく、苦痛を追い求めよ【快楽の神経科学×進化心理学×キュニコス派×ニーチェ】',beats},null,2));
fs.writeFileSync(path.join(target,'src/scene-data.json'),JSON.stringify(beats,null,2));
fs.writeFileSync(path.join(target,'src/sync-timing.json'),JSON.stringify({durationSeconds:1200,beats:[]}));
for(const n of ['index.tsx','scenes.tsx'])fs.copyFileSync(path.join(root,'shared/v85',n),path.join(target,'src',n));
for(const n of ['generate-bgm.mjs','plan-segments.mjs'])fs.copyFileSync(path.join(root,'shared/v53',n),path.join(target,'scripts',n));
fs.writeFileSync(path.join(target,'scripts/generate-voicevox.mjs'),"import path from 'node:path';import {fileURLToPath} from 'node:url';import {generateVoicevox} from '../../shared/voice/generate-voicevox.mjs';const here=path.dirname(fileURLToPath(import.meta.url));await generateVoicevox(path.resolve(here,'..'),{speaker:'青山龍星',style:'ノーマル',speed:1.13,pitchScale:-0.026,intonationScale:0.86});");
fs.writeFileSync(path.join(target,'scripts/build-preproduction.mjs'),"import fs from 'node:fs';import path from 'node:path';const root=path.resolve(import.meta.dirname,'..');const d=JSON.parse(fs.readFileSync(path.join(root,'src/script-data.json'),'utf8'));fs.mkdirSync(path.join(root,'qa'),{recursive:true});const scenes=d.beats.map(b=>({video_id:d.videoId,scene_id:b.id,phase:b.phase,narration:b.narration,scene_type:b.shotKind,visual_intent:b.visual,background_group:b.bgGroup,background_key:b.bgSeed,foreground:b.foreground,action_key:b.actionKey,action_seed:b.actionSeed,camera_seed:b.cameraSeed,human_review:'pending'}));fs.writeFileSync(path.join(root,'preproduction-plan.json'),JSON.stringify({videoId:d.videoId,scenes},null,2));fs.writeFileSync(path.join(root,'qa/preproduction-summary.json'),JSON.stringify({videoId:d.videoId,sceneCount:scenes.length,phaseCount:new Set(scenes.map(x=>x.phase)).size,uniqueActions:new Set(scenes.map(x=>x.action_key)).size,uniqueVisuals:new Set(scenes.map(x=>x.visual_intent)).size},null,2));");
fs.copyFileSync(path.join(root,'shared/v85/SOURCES.md'),path.join(target,'SOURCES.md'));
fs.copyFileSync(path.join(root,'shared/v85/V85_PRODUCTION_SPEC.md'),path.join(target,'V85_PRODUCTION_SPEC.md'));
fs.writeFileSync(path.join(target,'production-manifest.json'),JSON.stringify({productionSystemVersion:5,videoId:'V85-pursue-pain',sceneMode:'microsemantic',policy:{noGenericFallback:true,noAdjacentSimilarShots:true,uniqueActionPerNarration:true,uniqueCameraFingerprint:true,measuredVoiceTiming:true,contactSheetRequired:true,minScenes:240,minPhases:30}},null,2));
console.log('V85: '+beats.length+' scenes / '+phases.size+' phases / '+source.length+' chars');
