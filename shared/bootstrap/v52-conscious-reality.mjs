import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const source=path.join(root,'v44-interaction-attraction');
const target=path.join(root,'v52-conscious-reality');
if(!fs.existsSync(source)) throw new Error('V44 source template is missing');
fs.rmSync(target,{recursive:true,force:true});
fs.cpSync(source,target,{recursive:true});

const title='なぜあなたが見ている世界は「本当の世界」ではないのか？【脳科学×意識】';
const rawScript=fs.readFileSync(path.join(root,'shared/v52/conscious-reality-script.txt'),'utf8').trim();
const script=rawScript.replaceAll('白と金','白と金色').replaceAll('上げた手だけが','挙げた手だけが');
if(!script.startsWith('朝、六時四十七分。')) throw new Error('Wrong V52 canonical script loaded');
if(script.includes('白と金')||script.includes('上げた手だけが')) throw new Error('Unsafe V52 pronunciation phrase remains');
fs.writeFileSync(path.join(target,'script.txt'),script+'\n');

const phaseStarts=[
  ['morning_room','朝、六時四十七分。'],
  ['skull_box','頭蓋骨の中を想像してほしい。'],
  ['basement_detective','ここで、生まれた瞬間から地下室に閉じ込められた探偵を想像してほしい。'],
  ['signal_decode','脳の立場は、これにかなり近い。'],
  ['hallway_coat','深夜。あなたは仕事を終えて家へ帰る。'],
  ['prediction_engine','ここで今日の中心が見えてくる。'],
  ['station_friend','翌日、駅の改札前。'],
  ['prediction_engine','こうした考え方を、脳科学では予測処理などと呼ぶ。'],
  ['illusion','そして、この優秀な仕組みが自信満々に間違える瞬間がある。'],
  ['dress','数年前、インターネット上で一枚のドレスの写真が大騒ぎになった。'],
  ['rubber_hand','では、脳が作っているのは外の世界だけだろうか。'],
  ['self_model','ここで、さらに嫌な質問が出てくる。'],
  ['interoception','その中でも面白いのが、身体の内側から届く情報である。'],
  ['night_road','夜道を一人で歩いている場面を想像してほしい。'],
  ['controlled_hallucination','ここまで来ると、脳科学者アニル・セスが使う「制御された幻覚」という表現が少し分かりやすくなる。'],
  ['office','そして、この話は日常生活にも少し嫌な形でつながる。'],
  ['message','逆に、好きな人から「了解！」という短いメッセージが届く。'],
  ['ambiguity','もちろん、だからといって信じれば何でも現実になるわけではない。'],
  ['social','二人の人間がまったく同じ出来事を経験しながら、「全然違うことが起きた」と本気で思うことがある。'],
  ['limits','ただし、ここで予測処理を万能理論にしてはいけない。'],
  ['return_room','最初の朝へ戻ろう。'],
  ['final','考えてみれば、かなり異常なことである。']
];

const paras=script.split(/\n\s*\n/).map(s=>s.trim()).filter(Boolean);
let phase='morning_room';
const phaseCounts=new Map();
let bgCounter=0,lastPhase='';
const beats=paras.map((narration,i)=>{
  for(const [p,start] of phaseStarts){if(narration.startsWith(start)) phase=p;}
  const local=phaseCounts.get(phase)||0;phaseCounts.set(phase,local+1);
  if(i===0||phase!==lastPhase||i%2===0) bgCounter++;
  const bgGroup=`B${String(bgCounter).padStart(3,'0')}_${phase}`;
  lastPhase=phase;
  return {id:`S${String(i+1).padStart(3,'0')}`,narration,phase,variant:local,shotKind:['wide','mid','detail','insert','diagram','macro','reaction','tracking'][local%8],visual:`v52_${String(i+1).padStart(3,'0')}_${phase}`,bgGroup,bgSeed:bgCounter};
});

if(beats.length<80||beats.length>130) throw new Error(`Unexpected V52 scene count ${beats.length}`);
if(new Set(beats.map(b=>b.visual)).size!==beats.length) throw new Error('V52 visual keys are not unique');
const groups=new Map();for(const b of beats)groups.set(b.bgGroup,(groups.get(b.bgGroup)||0)+1);
for(const [g,c] of groups)if(c>2)throw new Error(`Background group ${g} used ${c} times`);
const seen=new Set();let prev='';for(const b of beats){if(b.bgGroup!==prev&&seen.has(b.bgGroup))throw new Error(`Background reused non-consecutively: ${b.bgGroup}`);seen.add(b.bgGroup);prev=b.bgGroup;}

fs.writeFileSync(path.join(target,'src/script-data.json'),JSON.stringify({videoId:'V52-conscious-reality',title,beats},null,2));
fs.writeFileSync(path.join(target,'src/scene-data.json'),JSON.stringify(beats.map(({id,phase,variant,shotKind,visual,bgGroup,bgSeed})=>({id,phase,variant,shotKind,visual,bgGroup,bgSeed})),null,2));
fs.writeFileSync(path.join(target,'src/sync-timing.json'),JSON.stringify({durationSeconds:960,beats:[]},null,2));
fs.writeFileSync(path.join(target,'production-manifest.json'),JSON.stringify({productionSystemVersion:2,visualRegistryVersion:4,voiceDictionaryVersion:4,qaRulesVersion:3,preproductionPolicyVersion:1,syncManifestVersion:7,requiresPreproductionPlan:true,sharedVoiceGenerator:true,videoId:'V52-conscious-reality',title,sceneMode:'hybrid',policy:{noGenericFallback:true,contactSheetRequired:true,sceneCompleteContactSheetRequired:true,measuredVoiceTimingRequired:true,maxExistingTemplateShare:0.2,maxConsecutiveSameRegisteredTemplate:2,preproductionHumanReviewRequired:true}},null,2));
fs.copyFileSync(path.join(root,'shared/v52/index.tsx'),path.join(target,'src/index.tsx'));
fs.copyFileSync(path.join(root,'shared/v52/scenes.tsx'),path.join(target,'src/scenes.tsx'));
fs.copyFileSync(path.join(root,'shared/v52/SOURCES.md'),path.join(target,'SOURCES.md'));
fs.copyFileSync(path.join(root,'shared/v52/generate-bgm.mjs'),path.join(target,'scripts/generate-bgm.mjs'));
fs.writeFileSync(path.join(target,'scripts/generate-voicevox.mjs'),`import path from 'node:path';\nimport {fileURLToPath} from 'node:url';\nimport {generateVoicevox} from '../../shared/voice/generate-voicevox.mjs';\nconst here=path.dirname(fileURLToPath(import.meta.url));const root=path.resolve(here,'..');\nawait generateVoicevox(root,{speaker:'青山龍星',style:'ノーマル',speed:1.045,pitchScale:-0.025,intonationScale:0.84});\n`);
fs.writeFileSync(path.join(target,'V52_IMPLEMENTATION.md'),`# V52 Conscious Reality — Production Architecture\n\n- Theme: ${title}\n- Canonical narration is split into ${beats.length} fine scenes across ${new Set(beats.map(b=>b.phase)).size} semantic phases.\n- Every scene has a unique visual key. Background groups are sequential-only, never reused later, and are limited to one or two consecutive scenes.\n- When two consecutive scenes share a background group, the backdrop receives no progress value and therefore remains pixel-static; only foreground actors, signals, hands, brushes, light switches, UI, arrows, particles, and labels animate.\n- Visual environments include morning bedroom, skull interior, basement detective, sensory signal pipeline, dark hallway/coat mistake, station crowd, predictive-processing board, brightness illusion, dress-color dispute, rubber-hand laboratory, self-model cockpit, body-signal map, night road/startle, controlled-hallucination diagrams, classroom red-pen analogy, office ambiguity, chat-message inference, social-model collision, theory limits, and return-to-bedroom synthesis.\n- Original Remotion vector/typographic animation only; no artwork or storyboard is copied from After Skool.\n- VOICEVOX timing is measured before render; output is segmented, concatenated, mixed with restrained ambient BGM, then audited with a scene-complete contact sheet.\n`);
console.log(`V52 materialized: ${beats.length} scenes / ${new Set(beats.map(b=>b.phase)).size} phases / ${groups.size} background groups`);
