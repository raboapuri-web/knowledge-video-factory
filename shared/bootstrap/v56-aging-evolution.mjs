import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const source=path.join(root,'v44-interaction-attraction');
const target=path.join(root,'v56-aging-evolution');
if(!fs.existsSync(source)) throw new Error('V44 source template is missing');
fs.rmSync(target,{recursive:true,force:true});
fs.cpSync(source,target,{recursive:true});

const title='なぜ生物は老いを克服しないまま進化してきたのか？【進化生物学×老化理論×生命史戦略】';
const rawScript=fs.readFileSync(path.join(root,'shared/v56/aging-evolution-script.txt'),'utf8').trim();
const script=rawScript.replaceAll('Disposable Soma','ディスポーザブル・ソーマ').replaceAll('『Nature』','『ネイチャー』');
if(!script.startsWith('夏の午後、住宅街の公園で九歳の少年が自転車から転ぶ。')) throw new Error('Wrong V56 canonical script loaded');
fs.writeFileSync(path.join(target,'script.txt'),script+'\n');

const phaseStarts=[
 ['opening_repair','夏の午後、住宅街の公園で九歳の少年が自転車から転ぶ。'],
 ['hospital_aging','ところが映像は、その少年と同じ人物の七十年後へ切り替わる。'],
 ['gompertz','この疑問を考えるため、まず二百年前のロンドンへ行こう。'],
 ['weismann','十九世紀末のドイツ。'],
 ['wild_hazard','では自然選択は、老化をどのように見ているのだろうか。'],
 ['gene_demo','ここで仮想的な二つの遺伝子を考えてみよう。'],
 ['medawar','一九五二年、英国。'],
 ['selection_shadow','映像では、人生を一本の長い道路として表現する。'],
 ['williams','ところが一九五七年、アメリカの進化生物学者ジョージ・C・ウィリアムズは'],
 ['body_inside','映像では、一人の若い男性の身体内部へ入っていく。'],
 ['cancer_city','このトレードオフが特に分かりやすいのが、老化とがんである。'],
 ['disposable_soma','一九七七年、舞台は再び英国へ移る。'],
 ['fly_lab','ここで疑問が生まれる。理論は面白い。'],
 ['bats','では、野生でも似た違いは見えるのだろうか。'],
 ['hydra','ここで、この動画最大の反例を出そう。'],
 ['mole_rat','地下へカメラを潜らせる。'],
 ['tree_life','画面いっぱいに生命の系統樹を表示する。'],
 ['kin_selection','ここで人間へ戻る。'],
 ['future_lab','ここで未来の研究所を想像してみよう。'],
 ['constraints','このため「進化なら老化を簡単に直せたはずだ」という発想には'],
 ['ancestral','ではなぜ人間はヒドラにならなかったのか。'],
 ['camp','一万年前の夜を想像してみよう。'],
 ['designer','ここで進化という存在を擬人化した巨大な設計者を画面へ出してみる。'],
 ['synthesis','だから若い時期には有利で、老年期には不利な仕組みが残る。'],
 ['return_hospital','冒頭の病院へ戻ろう。'],
 ['timeline','最後に、一本の長い時間軸を表示する。'],
 ['final','画面には最後に、ヒドラ、ネズミ、コウモリ、人間が横一列に並ぶ。'],
 ['return_park','病院を出た七十九歳の男性が、夕方の街を歩いている。']
];

const paras=script.split(/\n\s*\n/).map(s=>s.trim()).filter(Boolean);
let phase='opening_repair';
const phaseCounts=new Map();
let bgCounter=0,lastPhase='';
const beats=paras.map((narration,i)=>{
  for(const [p,start] of phaseStarts){if(narration.startsWith(start)) phase=p;}
  const local=phaseCounts.get(phase)||0; phaseCounts.set(phase,local+1);
  if(i===0||phase!==lastPhase||i%2===0) bgCounter++;
  const bgGroup=`B${String(bgCounter).padStart(3,'0')}_${phase}`;
  lastPhase=phase;
  return {
    id:`S${String(i+1).padStart(3,'0')}`,
    narration,phase,variant:local,
    shotKind:['wide','mid','detail','insert','diagram','macro','reaction','tracking'][local%8],
    visual:`v56_${String(i+1).padStart(3,'0')}_${phase}`,
    bgGroup,bgSeed:bgCounter
  };
});

if(beats.length<100||beats.length>140) throw new Error(`Unexpected V56 scene count ${beats.length}`);
if(new Set(beats.map(b=>b.visual)).size!==beats.length) throw new Error('V56 visual keys are not unique');
const groups=new Map(); for(const b of beats) groups.set(b.bgGroup,(groups.get(b.bgGroup)||0)+1);
for(const [g,c] of groups) if(c>2) throw new Error(`Background group ${g} used ${c} times`);
const seen=new Set(); let prev='';
for(const b of beats){if(b.bgGroup!==prev&&seen.has(b.bgGroup)) throw new Error(`Background reused non-consecutively: ${b.bgGroup}`); seen.add(b.bgGroup); prev=b.bgGroup;}

fs.writeFileSync(path.join(target,'src/script-data.json'),JSON.stringify({videoId:'V56-aging-evolution',title,beats},null,2));
fs.writeFileSync(path.join(target,'src/scene-data.json'),JSON.stringify(beats.map(({id,phase,variant,shotKind,visual,bgGroup,bgSeed})=>({id,phase,variant,shotKind,visual,bgGroup,bgSeed})),null,2));
fs.writeFileSync(path.join(target,'src/sync-timing.json'),JSON.stringify({durationSeconds:1080,beats:[]},null,2));
fs.writeFileSync(path.join(target,'production-manifest.json'),JSON.stringify({
  productionSystemVersion:2,visualRegistryVersion:4,voiceDictionaryVersion:4,qaRulesVersion:3,
  preproductionPolicyVersion:1,syncManifestVersion:7,requiresPreproductionPlan:true,sharedVoiceGenerator:true,
  videoId:'V56-aging-evolution',title,sceneMode:'hybrid',
  policy:{noGenericFallback:true,contactSheetRequired:true,sceneCompleteContactSheetRequired:true,measuredVoiceTimingRequired:true,maxExistingTemplateShare:0.2,maxConsecutiveSameRegisteredTemplate:2,preproductionHumanReviewRequired:true}
},null,2));

fs.copyFileSync(path.join(root,'shared/v56/index.tsx'),path.join(target,'src/index.tsx'));
fs.copyFileSync(path.join(root,'shared/v56/scenes.tsx'),path.join(target,'src/scenes.tsx'));
let scenes=fs.readFileSync(path.join(target,'src/scenes.tsx'),'utf8');
scenes=scenes
 .replace("i<8?.25:.8","i<8 ? .25 : .8")
 .replace("m.shotKind==='detail'?.028:m.shotKind==='macro'?.045:.012","m.shotKind==='detail' ? .028 : m.shotKind==='macro' ? .045 : .012");
fs.writeFileSync(path.join(target,'src/scenes.tsx'),scenes);

fs.copyFileSync(path.join(root,'shared/v56/SOURCES.md'),path.join(target,'SOURCES.md'));
fs.copyFileSync(path.join(root,'shared/v52/generate-bgm.mjs'),path.join(target,'scripts/generate-bgm.mjs'));
fs.writeFileSync(path.join(target,'scripts/generate-voicevox.mjs'),`import path from 'node:path';\nimport {fileURLToPath} from 'node:url';\nimport {generateVoicevox} from '../../shared/voice/generate-voicevox.mjs';\nconst here=path.dirname(fileURLToPath(import.meta.url));const root=path.resolve(here,'..');\nawait generateVoicevox(root,{speaker:'青山龍星',style:'ノーマル',speed:1.045,pitchScale:-0.028,intonationScale:0.84});\n`);

fs.writeFileSync(path.join(target,'V56_IMPLEMENTATION.md'),`# V56 Aging Evolution — Production Architecture

- Theme: ${title}
- Canonical narration is split into ${beats.length} fine scenes across ${new Set(beats.map(b=>b.phase)).size} semantic phases.
- Every scene has a unique visual key. Background groups are sequential-only, never reused later, and are limited to one or two consecutive scenes.
- The renderer changes historical period, environment, camera framing, foreground objects and explanatory animation across park injury, hospital ageing, 1825 Gompertz office, Weismann study, wild predation, Medawar mutation accumulation, Hamilton selection shadow, Williams antagonistic pleiotropy, cell/cancer city, Kirkwood factory, Drosophila laboratory evolution, bat longevity, Hydra, naked mole-rat tunnels, phylogenetic ageing diversity, grandmother/kin-selection scenes, future rejuvenation lab, evolutionary constraints, ancestral camp, synthesis, and return to the park.
- When two consecutive narration scenes share one background group, the seeded backdrop is pixel-static and only foreground actors/objects change, so continuity is preserved without looping the same footage later.
- VOICEVOX timing is measured before render; output is segmented, concatenated, mixed with restrained ambient BGM, then audited with a scene-complete contact sheet.
- Original Remotion vector/typographic animation only.
`);
console.log(`V56 materialized: ${beats.length} scenes / ${new Set(beats.map(b=>b.phase)).size} phases / ${groups.size} background groups`);
