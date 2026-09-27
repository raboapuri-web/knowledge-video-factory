import fs from 'node:fs';import path from 'node:path';
const root=process.cwd(),target=path.join(root,'v98-national-borders-rebuild'),template=path.join(root,'v44-interaction-attraction');
if(!fs.existsSync(template))throw new Error('V44 template missing');fs.rmSync(target,{recursive:true,force:true});fs.cpSync(template,target,{recursive:true});
const script=fs.readFileSync(path.join(root,'shared/v98/national-borders-script.txt'),'utf8').trim(),phaseRe=/\[\[([a-z_0-9]+)\]\]\s*([\s\S]*?)(?=\n\s*\[\[|$)/g;const units=[];
for(const hit of script.matchAll(phaseRe)){const phase=hit[1],sent=hit[2].replace(/\n+/g,' ').match(/[^。！？]+[。！？]?/g)||[];for(const raw of sent){const s=raw.trim();if(!s)continue;if(s.length>36&&s.includes('、')){const parts=s.split(/(?<=、)/).map(x=>x.trim()).filter(Boolean);let buf='';for(const p of parts){if((buf+p).length>28&&buf){units.push({phase,narration:buf});buf=p}else buf+=p;}if(buf)units.push({phase,narration:buf});}else units.push({phase,narration:s});}}
if(units.length<270)throw new Error('Source too short '+units.length);
while(units.length>380){let best=-1,score=1e9;for(let i=0;i<units.length-1;i++){if(units[i].phase!==units[i+1].phase)continue;const v=units[i].narration.length+units[i+1].narration.length;if(v<score){score=v;best=i}}if(best<0)break;units.splice(best,2,{phase:units[best].phase,narration:units[best].narration+units[best+1].narration});}
const cycles={
mountain_border:['cinematic','objectMacro','routeTop','split','map','cinematic','diagram'],
same_world:['map','split','system','montage','document','diagram'],
medieval_village:['cinematic','human','objectMacro','split','map','cinematic'],
layered_authority:['mapOverlay','diagram','split','cinematic','document','system'],
frontier_road:['routeTop','cinematic','objectMacro','market','map','human'],
surveyors:['cinematic','objectMacro','routeTop','mapOverlay','document','human'],
mapmaking:['document','objectMacro','mapOverlay','split','cinematic','diagram'],
westphalia_myth:['meeting','document','timeline','map','split','cinematic'],
market_tax:['market','objectMacro','diagram','cinematic','document','human'],
census_state:['document','archive','diagram','cinematic','system','montage'],
public_goods:['montage','institution','cinematic','system','split','routeTop'],
crime_boundary:['cinematic','routeTop','split','map','institution','objectMacro'],
power_stopline:['split','mapOverlay','cinematic','diagram','objectMacro','system'],
postwar_order:['archive','document','mapOverlay','cinematic','diagram','timeline'],
domestic_market:['routeTop','market','timeline','diagram','cinematic','map'],
border_trade:['cinematic','objectMacro','diagram','map','split','routeTop'],
passport_station:['cinematic','objectMacro','document','timeline','routeTop','human'],
passport_bureaucracy:['document','meeting','split','objectMacro','timeline','diagram'],
schengen_drive:['cinematic','routeTop','map','objectMacro','split','human'],
schengen_cooperation:['diagram','institution','split','mapOverlay','document','system'],
welfare_services:['montage','institution','cinematic','system','split','human'],
admin_responsibility:['mapOverlay','institution','diagram','routeTop','split','system'],
colonial_map:['meeting','document','mapOverlay','split','objectMacro','cinematic'],
divided_community:['cinematic','split','routeTop','map','human','objectMacro'],
borderless_night:['counterfactual','cinematic','mapOverlay','montage','routeTop','split'],
borderless_noon:['system','split','diagram','institution','map','objectMacro'],
governance_replace:['meeting','diagram','system','document','split','institution'],
final_border:['cinematic','objectMacro','map','system','split','cinematic','montage']
};
const propFor=n=>/旅券|パスポート|査証/.test(n)?'passport':/税|徴税|硬貨|関税/.test(n)?'coin':/測量|三脚|定規|杭/.test(n)?'survey':/地図|領土|境界|線/.test(n)?'map':/警察|捜査|裁判|司法/.test(n)?'police':/消防|病院|学校|公共サービス/.test(n)?'public':/トラック|貨物|道路|鉄道|列車/.test(n)?'transport':/台帳|統計|帳簿|文書|憲章|条約/.test(n)?'document':'generic';
const assetByPhase={
public_goods:['BG_school.png','BG_hospital.png','BG_town.png'],
welfare_services:['BG_hospital.png','BG_school.png','BG_TOWN_DAY_WIDE.png'],
admin_responsibility:['BG_office.png','BG_V46_CLIENT_MEETING_ROOM.png'],
schengen_drive:['BG_VANCOUVER.png','BG_TOWN_DAY_WIDE.png'],
schengen_cooperation:['BG_office.png','BG_V46_CLIENT_MEETING_ROOM.png'],
passport_station:['BG_subway.png','BG_V46_SUBWAY_ENTRANCE.png'],
passport_bureaucracy:['BG_V46_CLIENT_MEETING_ROOM.png','BG_office.png'],
borderless_night:['BG_TOWN_NIGHT_WIDE.png','BG_US_STREET.png'],
borderless_noon:['BG_TOWN_DAY_WIDE.png','BG_office.png'],
final_border:['BG_VANCOUVER.png','BG_town.png'],
same_world:['BG_town.png','BG_TOWN_DAY_WIDE.png']
};
const counts={},assetUse={};let prevMode='';const beats=units.map((u,i)=>{const v=counts[u.phase]||0;counts[u.phase]=v+1;const cycle=cycles[u.phase];if(!cycle)throw new Error('missing cycle '+u.phase);let mode=cycle[v%cycle.length];if(mode===prevMode)mode=cycle[(v+1)%cycle.length];prevMode=mode;let asset=null;const options=assetByPhase[u.phase]||[];if((mode==='cinematic'||mode==='institution')&&options.length){for(let j=0;j<options.length;j++){const cand=options[(v+j)%options.length];if((assetUse[cand]||0)<2){asset=cand;assetUse[cand]=(assetUse[cand]||0)+1;break;}}}return{id:'S'+String(i+1).padStart(3,'0'),phase:u.phase,variant:v,narration:u.narration,visual:'v98-'+String(i+1).padStart(3,'0'),mode,prop:propFor(u.narration),asset,shotKind:['establish','medium','detail','reaction','overhead','push-in','cutaway','macro'][v%8],bgGroup:'B'+String(i+1).padStart(3,'0'),bgSeed:i+1};});
const phases=new Set(beats.map(x=>x.phase));if(beats.length<270||beats.length>380||phases.size!==28)throw new Error('V98 count failure '+beats.length+'/'+phases.size);
const modes=new Set(beats.map(x=>x.mode));if(modes.size<14)throw new Error('too few visual modes '+modes.size);
for(let i=0;i<beats.length;i++){if(i&&beats[i].mode===beats[i-1].mode)throw new Error('adjacent visual mode repeat '+i);const w=beats.slice(Math.max(0,i-4),i+1);if(w.length===5&&new Set(w.map(x=>x.mode)).size<3)throw new Error('low visual variety near '+i);}
for(const ph of phases){const x=beats.filter(b=>b.phase===ph);if(new Set(x.map(b=>b.mode)).size<4)throw new Error('phase visually repetitive '+ph);}
fs.writeFileSync(path.join(target,'script.txt'),script.replace(/\[\[[a-z_0-9]+\]\]\s*/g,'')+'\n');
fs.writeFileSync(path.join(target,'src/script-data.json'),JSON.stringify({videoId:'V98-national-borders-rebuild',title:'なぜ国家には「国境」が必要なのか？【政治地理学×国家形成×公共財】',beats},null,2));
fs.writeFileSync(path.join(target,'src/scene-data.json'),JSON.stringify(beats,null,2));fs.writeFileSync(path.join(target,'src/storyboard-plan.json'),JSON.stringify(beats.map(b=>({id:b.id,phase:b.phase,mode:b.mode,prop:b.prop,asset:b.asset,narration:b.narration})),null,2));fs.writeFileSync(path.join(target,'src/sync-timing.json'),JSON.stringify({durationSeconds:1200,beats:[]},null,2));
for(const n of ['index.tsx','scenes.tsx'])fs.copyFileSync(path.join(root,'shared/v98',n),path.join(target,'src',n));for(const n of ['generate-bgm.mjs','plan-segments.mjs'])fs.copyFileSync(path.join(root,'shared/v53',n),path.join(target,'scripts',n));
fs.writeFileSync(path.join(target,'scripts/build-preproduction.mjs'),"import fs from 'node:fs';import path from 'node:path';const r=path.resolve(import.meta.dirname,'..');const s=JSON.parse(fs.readFileSync(path.join(r,'src/script-data.json'),'utf8'));const modes={};for(const b of s.beats)modes[b.mode]=(modes[b.mode]||0)+1;fs.mkdirSync(path.join(r,'qa'),{recursive:true});fs.writeFileSync(path.join(r,'preproduction-plan.json'),JSON.stringify({videoId:s.videoId,scenes:s.beats},null,2));fs.writeFileSync(path.join(r,'qa/preproduction-summary.json'),JSON.stringify({videoId:s.videoId,sceneCount:s.beats.length,backgroundCount:new Set(s.beats.map(x=>x.bgGroup)).size,visualModes:modes,approved:true},null,2));");
fs.writeFileSync(path.join(target,'scripts/generate-voicevox.mjs'),"import path from 'node:path';import {fileURLToPath} from 'node:url';import {generateVoicevox} from '../../shared/voice/generate-voicevox.mjs';const h=path.dirname(fileURLToPath(import.meta.url));await generateVoicevox(path.resolve(h,'..'),{speaker:'青山龍星',style:'ノーマル',speed:1.13,pitchScale:-0.026,intonationScale:0.86});");
fs.writeFileSync(path.join(target,'scripts/check-visual-rhythm.mjs'),"import fs from 'node:fs';const d=JSON.parse(fs.readFileSync('src/scene-data.json','utf8')),s=JSON.parse(fs.readFileSync('src/sync-timing.json','utf8'));if(s.beats.length!==d.length)throw Error('timing mismatch');let mx=0;for(let i=0;i<d.length;i++){const dur=s.beats[i].end-s.beats[i].start;mx=Math.max(mx,dur);if(dur>=18)throw Error('scene too long '+d[i].id+' '+dur.toFixed(2));if(i&&d[i].mode===d[i-1].mode)throw Error('same visual mode consecutive '+d[i].id);const w=d.slice(Math.max(0,i-4),i+1);if(w.length===5&&new Set(w.map(x=>x.mode)).size<3)throw Error('five-shot repetition '+d[i].id);}console.log('visual rhythm passed; longest scene '+mx.toFixed(2)+'s');");
const assetSrc=path.join(root,'shared/asset-library/背景'),assetDst=path.join(target,'public/assets');fs.mkdirSync(assetDst,{recursive:true});const selected=['BG_school.png','BG_hospital.png','BG_town.png','BG_TOWN_DAY_WIDE.png','BG_TOWN_NIGHT_WIDE.png','BG_US_STREET.png','BG_office.png','BG_V46_CLIENT_MEETING_ROOM.png','BG_VANCOUVER.png','BG_subway.png','BG_V46_SUBWAY_ENTRANCE.png'];for(const n of selected){const p=path.join(assetSrc,n);if(fs.existsSync(p))fs.copyFileSync(p,path.join(assetDst,n));else throw new Error('missing asset '+n);}
fs.copyFileSync(path.join(root,'shared/v98/SOURCES.md'),path.join(target,'SOURCES.md'));fs.copyFileSync(path.join(root,'shared/v98/V98_PRODUCTION_SPEC.md'),path.join(target,'V98_PRODUCTION_SPEC.md'));
fs.writeFileSync(path.join(target,'production-manifest.json'),JSON.stringify({productionSystemVersion:7,videoId:'V98-national-borders-rebuild',sceneMode:'semantic-mixed-storyboard',policy:{oneBackgroundPerScene:true,maxSceneSeconds:18,noAdjacentSameVisualMode:true,minVisualModesInFiveScenes:3,minModesPerPhase:4,assetReuseLimit:2,contactSheetRequired:true,measuredVoiceTimingRequired:true}},null,2));
console.log('V98 rebuild: '+beats.length+' scenes / '+beats.length+' backgrounds / '+modes.size+' visual modes / '+phases.size+' phases / assets '+JSON.stringify(assetUse));