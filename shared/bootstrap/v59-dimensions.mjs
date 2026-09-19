import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const source=path.join(root,'v44-interaction-attraction');
const target=path.join(root,'v59-dimensions');
if(!fs.existsSync(source)) throw new Error('V44 source template is missing');
fs.rmSync(target,{recursive:true,force:true});
fs.cpSync(source,target,{recursive:true});

const title='3次元と4次元と5次元の違いが人に説明できるようになる動画【幾何学×相対性理論×高次元物理学】';
const rawScript=fs.readFileSync(path.join(root,'shared/v59/dimensions-script.txt'),'utf8').trim();
const script=rawScript;
if(!script.startsWith('金曜日の午後七時。東京の巨大な駅で、一人の男性が恋人を待っている。')) throw new Error('Wrong V59 canonical script loaded');
fs.writeFileSync(path.join(target,'script.txt'),script+'\n');

const phaseStarts=[
 ['station',"金曜日の午後七時。"],
 ['station_slice',"やがて原因が分かった。"],
 ['question',"この何でもない待ち合わせの失敗には、三次元、四次元、そして五次元を理"],
 ['line_world',"仮に、あなたが一本の細い線路の上でしか生活できない生物だったとする。"],
 ['plane_world',"その瞬間、線路の横へ新しい通路が現れたとしよう。"],
 ['paper_fly',"一枚の紙の上に小さなアリが住んでいると考えてみよう。"],
 ['axes',"左右、前後、上下。"],
 ['flatland_book',"一八八四年のイギリス。"],
 ['flatland_house',"あなたも、この世界の正方形の住人になったとしよう。"],
 ['sphere_section',"もう一つ実験をしよう。"],
 ['fourth_thought',"では、我々の三次元世界にも、四番目の独立した空間方向があると仮定しよ"],
 ['riemann',"ここで、一八五四年のドイツへ戻ろう。"],
 ['dimension_build',"一本の線分を、それ自身に沿う方向とは独立した方向へ移動させよう。"],
 ['tesseract',"そこで定義される四次元立方体は、テッセラクトとも呼ばれる。"],
 ['four_dimensions',"さて、ここまで聞いて、四次元は時間のことではなかったのかと疑問に感じ"],
 ['time_station',"もう一度、金曜日の駅へ戻ろう。"],
 ['einstein',"一九〇五年、特許局で働いていたアルベルト・アインシュタインは特殊相対"],
 ['train',"長い列車が駅を通過する瞬間、列車の前方と後方の線路へ二つの稲妻が落ち"],
 ['simultaneity',"そのため乗客は前方からの光を先に受け取る。"],
 ['minkowski',"一九〇八年、ヘルマン・ミンコフスキーは、特殊相対性理論を空間と時間を"],
 ['worldline',"時空図の横軸を位置、縦軸を時間とし、駅のベンチに座る男性を点で描こう"],
 ['lightcone',"真っ暗な空間で電球を一瞬光らせると、光は周囲へ球状に広がっていく。"],
 ['gps',"四次元時空は、空想のためだけの考え方でもない。"],
 ['four_compare',"ここで二種類の四次元を整理しよう。"],
 ['fifth_geometry',"では、その四次元の先へ、さらに一つ増やしたらどうなるのだろうか。"],
 ['fifth_types',"物理学の五次元時空では、私たちが知っている三つの空間方向と一つの時間"],
 ['kaluza',"一九二〇年代のヨーロッパ。"],
 ['klein_hose',"一九二六年、オスカル・クラインは、追加の空間方向が非常に小さく丸めら"],
 ['compactification',"このように追加次元を小さく丸める発想は、コンパクト化と呼ばれる。"],
 ['collider',"では本当に宇宙には余分な空間方向があるのだろうか。"],
 ['evidence',"ここで、数学と物理学の違いも見えてくる。"],
 ['misconceptions',"五次元なら未来を自由に選べるのではないか。"],
 ['return_station',"さて、あの駅へ戻ろう。"],
 ['teach',"もし誰かに三次元の意味を尋ねられたら、左右、前後、上下という三つの独"],
 ['flatland_house',"ここでもう一度、二次元世界の正方形の住人を思い出してほしい。"],
 ['return_station',"駅の時計台が午後七時十分を指し、男性と女性が人混みの向こうへ歩いてい"],
 ['closing',"我々は四次元の世界を探すために、どこか遠くの宇宙へ旅をする必要はない"],
 ['summary',"だから三次元、四次元、五次元の違いは、魔法の力や理解不能な異世界の違"],
];

const paras=script.split(/\n+/).map(s=>s.trim()).filter(Boolean);
let phase='opening_room';
const chunks=[];
for(const para of paras){
  for(const [p,start] of phaseStarts){if(para.startsWith(start)) phase=p;}
  const sentences=(para.match(/[^。！？]+[。！？]?/g)||[para]).map(s=>s.trim()).filter(Boolean);
  let buf='';
  for(const s of sentences){
    if((buf+s).length>100&&buf){chunks.push({phase,narration:buf});buf=s;}
    else buf+=s;
  }
  if(buf)chunks.push({phase,narration:buf});
}

const phaseCounts=new Map();
let bgCounter=0,lastPhase='';
const beats=chunks.map((item,i)=>{
  const local=phaseCounts.get(item.phase)||0; phaseCounts.set(item.phase,local+1);
  if(i===0||item.phase!==lastPhase||i%2===0) bgCounter++;
  const bgGroup=`B${String(bgCounter).padStart(3,'0')}_${item.phase}`;
  lastPhase=item.phase;
  return {
    id:`S${String(i+1).padStart(3,'0')}`,
    narration:item.narration,phase:item.phase,variant:local,
    shotKind:['wide','mid','detail','insert','diagram','macro','reaction','tracking'][local%8],
    visual:`v59_${String(i+1).padStart(3,'0')}_${item.phase}`,
    bgGroup,bgSeed:bgCounter
  };
});

if(beats.length<115||beats.length>140) throw new Error(`Unexpected V59 scene count ${beats.length}`);
if(new Set(beats.map(b=>b.visual)).size!==beats.length) throw new Error('V59 visual keys are not unique');
const groups=new Map();for(const b of beats) groups.set(b.bgGroup,(groups.get(b.bgGroup)||0)+1);
for(const [g,c] of groups) if(c>2) throw new Error(`Background group ${g} used ${c} times`);
const seen=new Set();let prev='';
for(const b of beats){if(b.bgGroup!==prev&&seen.has(b.bgGroup)) throw new Error(`Background reused non-consecutively: ${b.bgGroup}`);seen.add(b.bgGroup);prev=b.bgGroup;}

fs.writeFileSync(path.join(target,'src/script-data.json'),JSON.stringify({videoId:'V59-spiritual-belief',title,beats},null,2));
fs.writeFileSync(path.join(target,'src/scene-data.json'),JSON.stringify(beats.map(({id,phase,variant,shotKind,visual,bgGroup,bgSeed})=>({id,phase,variant,shotKind,visual,bgGroup,bgSeed})),null,2));
fs.writeFileSync(path.join(target,'src/sync-timing.json'),JSON.stringify({durationSeconds:1200,beats:[]},null,2));
fs.writeFileSync(path.join(target,'production-manifest.json'),JSON.stringify({
  productionSystemVersion:2,visualRegistryVersion:4,voiceDictionaryVersion:4,qaRulesVersion:3,
  preproductionPolicyVersion:1,syncManifestVersion:7,requiresPreproductionPlan:true,sharedVoiceGenerator:true,
  videoId:'V59-spiritual-belief',title,sceneMode:'hybrid',
  policy:{noGenericFallback:true,contactSheetRequired:true,sceneCompleteContactSheetRequired:true,measuredVoiceTimingRequired:true,maxExistingTemplateShare:0.2,maxConsecutiveSameRegisteredTemplate:2,preproductionHumanReviewRequired:true}
},null,2));

fs.copyFileSync(path.join(root,'shared/v59/index.tsx'),path.join(target,'src/index.tsx'));
fs.copyFileSync(path.join(root,'shared/v59/scenes.tsx'),path.join(target,'src/scenes.tsx'));
let scenes=fs.readFileSync(path.join(target,'src/scenes.tsx'),'utf8');
scenes=scenes
 .replace("m.shotKind==='detail'?.026:m.shotKind==='macro'?.04:m.shotKind==='tracking'?.02:.012","m.shotKind==='detail' ? .026 : m.shotKind==='macro' ? .04 : m.shotKind==='tracking' ? .02 : .012");
fs.writeFileSync(path.join(target,'src/scenes.tsx'),scenes);

fs.copyFileSync(path.join(root,'shared/v59/SOURCES.md'),path.join(target,'SOURCES.md'));
{
  let bgm=fs.readFileSync(path.join(root,'shared/v52/generate-bgm.mjs'),'utf8');
  bgm=bgm
    .replace("const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..','..','v52-conscious-reality');","const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');")
    .replace('V52 BGM ready','V59 BGM ready');
  fs.writeFileSync(path.join(target,'scripts/generate-bgm.mjs'),bgm);
}
fs.writeFileSync(path.join(target,'scripts/generate-voicevox.mjs'),`import path from 'node:path';\nimport {fileURLToPath} from 'node:url';\nimport {generateVoicevox} from '../../shared/voice/generate-voicevox.mjs';\nconst here=path.dirname(fileURLToPath(import.meta.url));const root=path.resolve(here,'..');\nawait generateVoicevox(root,{speaker:'青山龍星',style:'ノーマル',speed:1.18,pitchScale:-0.028,intonationScale:0.84});\n`);

fs.writeFileSync(path.join(target,'V59_IMPLEMENTATION.md'),`# V59 Dimensions — Production Architecture

- Theme: ${title}
- ${beats.length} narration scenes across ${new Set(beats.map(b=>b.phase)).size} semantic phases.
- Every scene has a unique visual key.
- Background groups are sequential-only, never reused later, and limited to a maximum of two consecutive narration scenes.
- Bespoke vector motion covers a two-level railway station, robot track and new axis, paper ant and airborne fly, Flatland jewel and sphere cross-section, tesseract projection, Einstein train and separated clocks, Minkowski worldlines and light cone, GPS satellites, Kaluza five-dimensional axes, Klein's coiled hose, collider measurements, and final teach-back with location+time.
- Narration remains a continuous story; scene instructions never appear in the voiceover.
- Scene-local progress drives character gestures, cards, graphs, object entrances, waves, number links, ritual actions and constellation lines; there is no global-loop footage.
- Measured 青山龍星 VOICEVOX timing, synchronized subtitles, segmented Remotion render, BGM mix, and scene-complete QA contact sheet are mandatory before release.
`);
console.log(`V59 materialized: ${beats.length} scenes / ${new Set(beats.map(b=>b.phase)).size} phases / ${groups.size} background groups`);
