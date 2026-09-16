import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const source=path.join(root,'v44-interaction-attraction');
const target=path.join(root,'v51-short-men');
if(!fs.existsSync(source)) throw new Error('V44 source template is missing');
fs.rmSync(target,{recursive:true,force:true});
fs.cpSync(source,target,{recursive:true});

const title='なぜ低身長男子は淘汰されないのか？【性選択×量的遺伝学×進化のトレードオフ】';
const scriptPath=path.join(root,'shared/v51/short-men-script.txt');
const script=fs.readFileSync(scriptPath,'utf8').trim();
if(!script.startsWith('金曜日の午後十一時。')) throw new Error('Wrong V51 canonical script loaded');
fs.writeFileSync(path.join(target,'script.txt'),script+'\n');

const phaseStarts=[
  ['app_market','金曜日の午後十一時。'],
  ['darwin','時間を一八七一年のイギリスへ戻す。'],
  ['selection_context','ただし、ここで「高身長は進化的に勝ち'],
  ['polygenic','ここで舞台を二〇二〇年代の巨大な遺伝子研究室へ移す。'],
  ['galton','この連続的な性質を十九世紀に統計学的に眺めていた人物がフランシス・ゴルトンである。'],
  ['relative_choice','再びマッチングアプリへ戻ろう。'],
  ['mate_multivariate','巨大な婚活会場で、研究者が「今日から身長以外の情報は禁止します」と宣言する場面を想像してみよう。'],
  ['selection_math','ここで百人の男性が暮らす仮想集団を作る。'],
  ['rainforest','今度は熱帯雨林へ入る。'],
  ['tradeoff','もし大きければ大きいほど繁殖上も生存上も無条件に有利なら'],
  ['dutch_history','十九世紀のオランダの軍隊記録を開くと'],
  ['environment','映像の中で、遺伝的には似た身長ポテンシャルを持つ二人の少年を別々の環境へ置く。'],
  ['market_constraint','ここで人口十万人の都市を使った思考実験を行う。'],
  ['artificial_selection','ここで極端な未来社会を想像する。'],
  ['real_selection','黒板に百人分の人型を描き'],
  ['station','夕方の駅前へカメラを戻す。'],
  ['synthesis','だから「女性は高身長男性を好む傾向があるのに'],
  ['final','もし人類の女性が何万年間']
];

const paras=script.split(/\n\s*\n/).map(s=>s.trim()).filter(Boolean);
let phase='app_market';
const phaseCounts=new Map();
const beats=paras.map((narration,i)=>{
  for(const [p,start] of phaseStarts){if(narration.startsWith(start)) phase=p;}
  const local=phaseCounts.get(phase)||0; phaseCounts.set(phase,local+1);
  return {
    id:`S${String(i+1).padStart(3,'0')}`,
    narration,
    phase,
    variant:local,
    shotKind:['wide','mid','detail','insert','diagram','reaction','tracking','macro'][local%8],
    visual:`v51_${phase}_${String(local+1).padStart(2,'0')}`
  };
});

if(beats.length<60||beats.length>95) throw new Error(`Unexpected V51 scene count ${beats.length}`);
if(new Set(beats.map(b=>b.visual)).size!==beats.length) throw new Error('V51 visual keys are not unique');

fs.writeFileSync(path.join(target,'src/script-data.json'),JSON.stringify({videoId:'V51-short-men',title,beats},null,2));
fs.writeFileSync(path.join(target,'src/scene-data.json'),JSON.stringify(beats.map(({id,phase,variant,shotKind,visual})=>({id,phase,variant,shotKind,visual})),null,2));
fs.writeFileSync(path.join(target,'src/sync-timing.json'),JSON.stringify({durationSeconds:1020,beats:[]},null,2));
fs.writeFileSync(path.join(target,'production-manifest.json'),JSON.stringify({productionSystemVersion:2,visualRegistryVersion:4,voiceDictionaryVersion:4,qaRulesVersion:3,preproductionPolicyVersion:1,syncManifestVersion:7,requiresPreproductionPlan:true,sharedVoiceGenerator:true,videoId:'V51-short-men',title},null,2));
fs.copyFileSync(path.join(root,'shared/v51/index.tsx'),path.join(target,'src/index.tsx'));
fs.copyFileSync(path.join(root,'shared/v51/scenes.tsx'),path.join(target,'src/scenes.tsx'));
const scenesPath=path.join(target,'src/scenes.tsx');
let scenes=fs.readFileSync(scenesPath,'utf8');
scenes=scenes
  .replace('opacity={i===1?.28:.68}','opacity={i===1 ? .28 : .68}')
  .replace('opacity=.7','opacity={.7}')
  .replace('opacity={i<4?.3:1}','opacity={i<4 ? .3 : 1}')
  .replace("kind==='wide'?.99:1.025","kind==='wide' ? .99 : 1.025");
fs.writeFileSync(scenesPath,scenes);
fs.copyFileSync(path.join(root,'shared/v51/SOURCES.md'),path.join(target,'SOURCES.md'));
fs.writeFileSync(path.join(target,'IMPLEMENTATION_PLAN.md'),`# V51 Short Men — Production Architecture\n\n- Theme: ${title}\n- Canonical script: ${beats.length} narration scenes across ${new Set(beats.map(b=>b.phase)).size} semantic phases.\n- Every narration scene has a distinct visual key and a scene-specific variant; backgrounds use scene number + phase + local variant so no beat receives an identical background state.\n- The renderer uses distinct visual languages for app UI, Victorian study, sexual-selection diagram, genome lab, Galton scatter plots, relative-height couples, multivariate mate choice, selection mathematics, rainforest life-history, body-size tradeoffs, Dutch historical records, growth environment, constrained matching market, artificial-selection dystopia, realistic allele-frequency drift, station crowd, and final synthesis.\n- Motion design includes parallax camera drift, moving foreground silhouettes, animated distributions, genome tiles, recombination cards, population-frequency dots, layered rainforest depth, timeline growth, matching arrows, and multi-generation distribution shifts.\n- VOICEVOX timing is measured before rendering; final video is rendered in segments, concatenated, mixed with BGM, and audited with a scene-complete contact sheet.\n- Bottom subtitles remain small and narration-led; explanatory screen labels are kept minimal.\n`);
console.log(`V51 materialized: ${beats.length} scenes / ${new Set(beats.map(b=>b.phase)).size} phases`);
