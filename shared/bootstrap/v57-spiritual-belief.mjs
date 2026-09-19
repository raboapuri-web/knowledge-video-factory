import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const source=path.join(root,'v44-interaction-attraction');
const target=path.join(root,'v57-spiritual-belief');
if(!fs.existsSync(source)) throw new Error('V44 source template is missing');
fs.rmSync(target,{recursive:true,force:true});
fs.cpSync(source,target,{recursive:true});

const title='なぜ人は「理解できないもの」を信じたがるのか？―なぜ人はスピるのか【認知科学×不確実性×宗教心理学】';
const rawScript=fs.readFileSync(path.join(root,'shared/v57/spiritual-belief-script.txt'),'utf8').trim();
const script=rawScript.replaceAll('インスタグラム','インスタグラム').replaceAll('B・F・スキナー','ビー・エフ・スキナー');
if(!script.startsWith('午前一時四十七分。暗いワンルームで、三十二歳の女性がベッドの上に座っている。')) throw new Error('Wrong V57 canonical script loaded');
fs.writeFileSync(path.join(target,'script.txt'),script+'\n');

const phaseStarts=[
 ['opening_room','午前一時四十七分。暗いワンルームで、三十二歳の女性がベッドの上に座っている。'],
 ['feed_signs','彼女はインスタグラムを開く。'],
 ['rational_day','ここで重要なのは、彼女が突然、論理的思考能力を失ったわけではないということである。'],
 ['definition','この動画で扱うスピリチュアルは、宗教、瞑想、哲学、祈りを全部まとめて否定する言葉ではない。'],
 ['trobriand_lagoon','時間を百年前へ戻そう。'],
 ['trobriand_ocean','次の場面では、同じ島の男たちが大型カヌーを海へ押し出している。'],
 ['malinowski','マリノフスキは、危険や偶然性が大きい活動ほど呪術的儀礼が発達していると記述し'],
 ['control_lab','二〇〇八年。今度は南太平洋ではなく、現代の心理学実験室へ移動する。'],
 ['pattern_noise','一部の参加者には、その前に「自分では結果をコントロールできなかった」と感じさせる課題を経験させる。'],
 ['roulette_order','ここで画面に、二つの世界を並べる。'],
 ['compensatory_control','心理学では補償的コントロールという考え方が研究されている。'],
 ['story_reframe','再び、別れた女性の部屋へ戻る。'],
 ['teleology','では、なぜその物語は「単なる偶然です」より魅力的なのか。'],
 ['meaning_vs_cause','ここで注意したい。'],
 ['skinner_pigeon','さらに時間を一九四八年へ戻す。'],
 ['bracelet','朝、黄色い石のブレスレットを着けた。'],
 ['causal_illusion','本当は無関係な出来事へ因果関係を感じる現象は、因果錯覚として研究されている。'],
 ['forer','さらにスピリチュアルには、非常に強力な武器がある。'],
 ['universal_reading','ここで映像を逆転させる。'],
 ['pseudo_profound','さらに研究では、意味深そうな単語を組み合わせた'],
 ['incomprehension_depth','ここで重要な逆説がある。'],
 ['repetition','しかも同じ言葉を何度も聞くと、さらに厄介なことが起きる。'],
 ['unfalsifiable','では、なぜ反証されても信念が残ることがあるのか。'],
 ['prophecy_case','ここで、古典的な心理学の有名エピソードをそのまま使うのは危険である。'],
 ['ritual_loss','しかしスピリチュアルが残る理由を、錯覚やバイアスだけで説明すると、まだ半分しか見えていない。'],
 ['ritual_motion','別の研究では、不安を誘発された人の動きが、より反復的で硬いパターンになることが報告されている。'],
 ['community','さらにスピリチュアルは、孤独にも作用する。'],
 ['intelligence_nuance','では、「スピる人は頭が悪い」という説明は正しいのだろうか。'],
 ['evolution_false_positive','ここで、進化的な視点を少し入れよう。'],
 ['algorithm_signs','現代社会では、この古い認知装置がサバンナとは違う対象へ向いている。'],
 ['angel_numbers','ここで冒頭の女性を見る。'],
 ['selective_memory','人間は、現実に存在する情報を全部保存してから結論を出しているわけではない。'],
 ['secular_order','では、スピリチュアルを完全になくせば、人間はもっと合理的になるのだろうか。'],
 ['order_core','つまり、人間が欲しいのはスピリチュアルそのものではない。'],
 ['choice_uncertainty','冒頭の女性は、スマートフォンを閉じる。'],
 ['thesis','ここで、この動画の最初の問いへ戻ろう。'],
 ['stars_final','最後の映像では、夜空いっぱいに星がある。'],
 ['final_message','だからスピリチュアルが何千年経っても消えない理由は、科学がまだ未熟だからだけではない。']
];

const paras=script.split(/\n\s*\n/).map(s=>s.trim()).filter(Boolean);
let phase='opening_room';
const chunks=[];
for(const para of paras){
  for(const [p,start] of phaseStarts){if(para.startsWith(start)) phase=p;}
  const sentences=(para.match(/[^。！？]+[。！？]?/g)||[para]).map(s=>s.trim()).filter(Boolean);
  let buf='';
  for(const s of sentences){
    if((buf+s).length>120&&buf){chunks.push({phase,narration:buf});buf=s;}
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
    visual:`v57_${String(i+1).padStart(3,'0')}_${item.phase}`,
    bgGroup,bgSeed:bgCounter
  };
});

if(beats.length<120||beats.length>150) throw new Error(`Unexpected V57 scene count ${beats.length}`);
if(new Set(beats.map(b=>b.visual)).size!==beats.length) throw new Error('V57 visual keys are not unique');
const groups=new Map();for(const b of beats) groups.set(b.bgGroup,(groups.get(b.bgGroup)||0)+1);
for(const [g,c] of groups) if(c>2) throw new Error(`Background group ${g} used ${c} times`);
const seen=new Set();let prev='';
for(const b of beats){if(b.bgGroup!==prev&&seen.has(b.bgGroup)) throw new Error(`Background reused non-consecutively: ${b.bgGroup}`);seen.add(b.bgGroup);prev=b.bgGroup;}

fs.writeFileSync(path.join(target,'src/script-data.json'),JSON.stringify({videoId:'V57-spiritual-belief',title,beats},null,2));
fs.writeFileSync(path.join(target,'src/scene-data.json'),JSON.stringify(beats.map(({id,phase,variant,shotKind,visual,bgGroup,bgSeed})=>({id,phase,variant,shotKind,visual,bgGroup,bgSeed})),null,2));
fs.writeFileSync(path.join(target,'src/sync-timing.json'),JSON.stringify({durationSeconds:1120,beats:[]},null,2));
fs.writeFileSync(path.join(target,'production-manifest.json'),JSON.stringify({
  productionSystemVersion:2,visualRegistryVersion:4,voiceDictionaryVersion:4,qaRulesVersion:3,
  preproductionPolicyVersion:1,syncManifestVersion:7,requiresPreproductionPlan:true,sharedVoiceGenerator:true,
  videoId:'V57-spiritual-belief',title,sceneMode:'hybrid',
  policy:{noGenericFallback:true,contactSheetRequired:true,sceneCompleteContactSheetRequired:true,measuredVoiceTimingRequired:true,maxExistingTemplateShare:0.2,maxConsecutiveSameRegisteredTemplate:2,preproductionHumanReviewRequired:true}
},null,2));

fs.copyFileSync(path.join(root,'shared/v57/index.tsx'),path.join(target,'src/index.tsx'));
fs.copyFileSync(path.join(root,'shared/v57/scenes.tsx'),path.join(target,'src/scenes.tsx'));
let scenes=fs.readFileSync(path.join(target,'src/scenes.tsx'),'utf8');
scenes=scenes
 .replace("m.shotKind==='detail'?.026:m.shotKind==='macro'?.04:m.shotKind==='tracking'?.02:.012","m.shotKind==='detail' ? .026 : m.shotKind==='macro' ? .04 : m.shotKind==='tracking' ? .02 : .012");
fs.writeFileSync(path.join(target,'src/scenes.tsx'),scenes);

fs.copyFileSync(path.join(root,'shared/v57/SOURCES.md'),path.join(target,'SOURCES.md'));
{
  let bgm=fs.readFileSync(path.join(root,'shared/v52/generate-bgm.mjs'),'utf8');
  bgm=bgm
    .replace("const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..','..','v52-conscious-reality');","const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');")
    .replace('V52 BGM ready','V57 BGM ready');
  fs.writeFileSync(path.join(target,'scripts/generate-bgm.mjs'),bgm);
}
fs.writeFileSync(path.join(target,'scripts/generate-voicevox.mjs'),`import path from 'node:path';\nimport {fileURLToPath} from 'node:url';\nimport {generateVoicevox} from '../../shared/voice/generate-voicevox.mjs';\nconst here=path.dirname(fileURLToPath(import.meta.url));const root=path.resolve(here,'..');\nawait generateVoicevox(root,{speaker:'青山龍星',style:'ノーマル',speed:1.18,pitchScale:-0.028,intonationScale:0.84});\n`);

fs.writeFileSync(path.join(target,'V57_IMPLEMENTATION.md'),`# V57 Spiritual Belief — Production Architecture

- Theme: ${title}
- ${beats.length} narration scenes across ${new Set(beats.map(b=>b.phase)).size} semantic phases.
- Every scene has a unique visual key.
- Background groups are sequential-only, never reused later, and limited to a maximum of two consecutive narration scenes.
- Fine scene design covers 01:47 bedroom, algorithmic spiritual feed, daytime office rationality, Trobriand lagoon/open ocean, Malinowski, control-loss lab, random-noise face detection, roulette/order metaphor, compensatory control, narrative reframing, teleology/rain, Skinner pigeons, bracelet causal illusion, Forer/Barnum effect, pseudo-profound jargon, illusory truth repetition, unfalsifiable belief shield, re-evaluation of When Prophecy Fails, grief rituals, community comments, cognitive nuance, savanna false-positive tradeoff, recommendation algorithms, angel numbers, selective memory, secular order substitutes, uncertainty choice, and final constellation metaphor.
- Scene-local progress drives character gestures, cards, graphs, object entrances, waves, number links, ritual actions and constellation lines; there is no global-loop footage.
- Measured 青山龍星 VOICEVOX timing, synchronized subtitles, segmented Remotion render, BGM mix, and scene-complete QA contact sheet are mandatory before release.
`);
console.log(`V57 materialized: ${beats.length} scenes / ${new Set(beats.map(b=>b.phase)).size} phases / ${groups.size} background groups`);
