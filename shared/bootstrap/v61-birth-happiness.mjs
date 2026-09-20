import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const source=path.join(root,'v44-interaction-attraction');
const target=path.join(root,'v61-birth-happiness');
if(!fs.existsSync(source)) throw new Error('V44 source template is missing');
fs.rmSync(target,{recursive:true,force:true});
fs.cpSync(source,target,{recursive:true});

const title='2026年はどの国で生まれるのが一番幸せなのか？【幸福の経済学×出生の偶然×ケイパビリティ】';
const rawScript=fs.readFileSync(path.join(root,'shared/v61/birth-happiness-script.txt'),'utf8').trim();
if(!rawScript.startsWith('[[birth_finland]]')) throw new Error('Wrong V61 canonical script loaded');
const phaseRe=/\[\[([a-z0-9_]+)\]\]\s*([\s\S]*?)(?=\n\s*\[\[|$)/g;
const chunks=[];
const narration=[];
for(const match of rawScript.matchAll(phaseRe)){
 const phase=match[1],text=match[2].replace(/\s*\n+\s*/g,' ').trim();
 if(!text)throw new Error('Empty phase: '+phase);
 narration.push(text);
 const sentences=(text.match(/[^。！？]+[。！？]?/g)||[text]).map(s=>s.trim()).filter(Boolean);
 let buf='';
 for(const s of sentences){
   if((buf+s).length>100&&buf){chunks.push({phase,narration:buf});buf=s;}
   else buf+=s;
 }
 if(buf)chunks.push({phase,narration:buf});
}
if(narration.length!==39)throw new Error('V61 must include exactly 39 narrative phases: '+narration.length);
fs.writeFileSync(path.join(target,'script.txt'),narration.join('\n\n')+'\n');

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

if(beats.length<120||beats.length>160) throw new Error(`Unexpected V61 scene count ${beats.length}`);
if(new Set(beats.map(b=>b.visual)).size!==beats.length) throw new Error('V61 visual keys are not unique');
const groups=new Map();for(const b of beats) groups.set(b.bgGroup,(groups.get(b.bgGroup)||0)+1);
for(const [g,c] of groups) if(c>2) throw new Error(`Background group ${g} used ${c} times`);
const seen=new Set();let prev='';
for(const b of beats){if(b.bgGroup!==prev&&seen.has(b.bgGroup)) throw new Error(`Background reused non-consecutively: ${b.bgGroup}`);seen.add(b.bgGroup);prev=b.bgGroup;}

fs.writeFileSync(path.join(target,'src/script-data.json'),JSON.stringify({videoId:'V61-dimensions',title,beats},null,2));
fs.writeFileSync(path.join(target,'src/scene-data.json'),JSON.stringify(beats.map(({id,phase,variant,shotKind,visual,bgGroup,bgSeed})=>({id,phase,variant,shotKind,visual,bgGroup,bgSeed})),null,2));
fs.writeFileSync(path.join(target,'src/sync-timing.json'),JSON.stringify({durationSeconds:1200,beats:[]},null,2));
fs.writeFileSync(path.join(target,'production-manifest.json'),JSON.stringify({
  productionSystemVersion:2,visualRegistryVersion:4,voiceDictionaryVersion:4,qaRulesVersion:3,
  preproductionPolicyVersion:1,syncManifestVersion:7,requiresPreproductionPlan:true,sharedVoiceGenerator:true,
  videoId:'V61-dimensions',title,sceneMode:'hybrid',
  policy:{noGenericFallback:true,contactSheetRequired:true,sceneCompleteContactSheetRequired:true,measuredVoiceTimingRequired:true,maxExistingTemplateShare:0.2,maxConsecutiveSameRegisteredTemplate:2,preproductionHumanReviewRequired:true}
},null,2));

fs.copyFileSync(path.join(root,'shared/v61/index.tsx'),path.join(target,'src/index.tsx'));
fs.copyFileSync(path.join(root,'shared/v61/scenes.tsx'),path.join(target,'src/scenes.tsx'));
let scenes=fs.readFileSync(path.join(target,'src/scenes.tsx'),'utf8');
scenes=scenes
 .replace("m.shotKind==='detail'?.026:m.shotKind==='macro'?.04:m.shotKind==='tracking'?.02:.012","m.shotKind==='detail' ? .026 : m.shotKind==='macro' ? .04 : m.shotKind==='tracking' ? .02 : .012");
fs.writeFileSync(path.join(target,'src/scenes.tsx'),scenes);

fs.copyFileSync(path.join(root,'shared/v61/SOURCES.md'),path.join(target,'SOURCES.md'));
{
  let bgm=fs.readFileSync(path.join(root,'shared/v52/generate-bgm.mjs'),'utf8');
  bgm=bgm
    .replace("const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..','..','v52-conscious-reality');","const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');")
    .replace('V52 BGM ready','V61 BGM ready');
  fs.writeFileSync(path.join(target,'scripts/generate-bgm.mjs'),bgm);
}
fs.writeFileSync(path.join(target,'scripts/generate-voicevox.mjs'),`import path from 'node:path';\nimport {fileURLToPath} from 'node:url';\nimport {generateVoicevox} from '../../shared/voice/generate-voicevox.mjs';\nconst here=path.dirname(fileURLToPath(import.meta.url));const root=path.resolve(here,'..');\nawait generateVoicevox(root,{speaker:'青山龍星',style:'ノーマル',speed:1.18,pitchScale:-0.028,intonationScale:0.84});\n`);

fs.writeFileSync(path.join(target,'V61_IMPLEMENTATION.md'),`# V61 2026 Country of Birth Happiness — Production Architecture

- Theme: ${title}
- ${beats.length} narration scenes across ${new Set(beats.map(b=>b.phase)).size} semantic phases.
- Each narrative phase has a location-specific vector animation: four newborn hospitals, Finland café, 2026 WHR report, Dutch family breakfast and school, UNICEF child well-being dimensions, historical and modern maternity ward, Japanese classroom, within-country household split, four birthplace doors, Rawls' veil, Costa Rica neighborhoods, 2036/2046 futures, Amartya Sen's capability approach, student/ex-worker/health re-routing and branching final metaphor.
- Canonical narration excludes phase markers and production directions.
- All visual keys are unique; background IDs never repeat after an interposed scene and groups have max two contiguous beats.
- Progress-triggered object motion, actor gestures, camera reframing, bars, branching routes and meaningful temporal changes, synchronized VOICEVOX narration/subtitles, ambient BGM, segment rendering and full-scene QA contact sheet.
- Adult life evaluation (2023–2025 WHR) and observed child outcomes (UNICEF 2026) are separately labelled; no newborn prognosis, causal ranking or false statistical precision.
`);
console.log(`V61 materialized: ${beats.length} scenes / ${new Set(beats.map(b=>b.phase)).size} phases / ${groups.size} background groups`);
