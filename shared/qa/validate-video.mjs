import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const repoRoot=path.resolve(here,'../..');
const videoRoot=path.resolve(process.argv[2]||'.');
const phase=process.argv[3]||'pre';
const fail=[];
const warn=[];

const readJson=(p)=>JSON.parse(fs.readFileSync(p,'utf8'));
const scriptPath=path.join(videoRoot,'src/script-data.json');
if(!fs.existsSync(scriptPath)) fail.push('src/script-data.json is missing');
const script=fs.existsSync(scriptPath)?readJson(scriptPath):{beats:[]};
const beats=script.beats||[];

const registryPath=path.join(repoRoot,'shared/production-rules/visual-template-registry.json');
const voiceRulesPath=path.join(repoRoot,'shared/production-rules/voice-pronunciation.json');
const registry=readJson(registryPath);
const voiceRules=readJson(voiceRulesPath);
const knownTemplates=new Set((registry.templates||[]).filter(t=>t.status==='active').map(t=>t.id));

const sceneKeys=beats.map(b=>b.template_id||b.visual).filter(Boolean);
const unique=new Set(sceneKeys);
if(beats.length>=40&&unique.size<30) fail.push(`QA-VIS-01: long-form video has only ${unique.size} unique scene keys for ${beats.length} beats; need >=30`);
const forbidden=sceneKeys.filter(k=>/^(fallback|default)$/i.test(String(k)));
if(forbidden.length) fail.push(`QA-VIS-02: fallback/default scenes found: ${forbidden.join(', ')}`);
for(const beat of beats){
  if(beat.template_id&&!knownTemplates.has(beat.template_id)) fail.push(`Unknown shared template '${beat.template_id}' in ${beat.id}`);
}

const manifestPath=path.join(videoRoot,'production-manifest.json');
if(fs.existsSync(manifestPath)){
  const manifest=readJson(manifestPath);
  if(Number(manifest.productionSystemVersion||0)<1) fail.push('QA-REG-01: productionSystemVersion must be >=1');
  if(Number(manifest.visualRegistryVersion||0)!==Number(registry.version)) fail.push(`QA-REG-02: visualRegistryVersion ${manifest.visualRegistryVersion} does not match registry ${registry.version}`);
  if(Number(manifest.voiceDictionaryVersion||0)!==Number(voiceRules.version)) fail.push(`QA-REG-02: voiceDictionaryVersion ${manifest.voiceDictionaryVersion} does not match dictionary ${voiceRules.version}`);
  if(manifest.sharedVoiceGenerator!==true) fail.push('QA-VOICE-01: production manifest must require sharedVoiceGenerator=true');
}else{
  warn.push('No production-manifest.json. Legacy videos may pass, but all new videos should include one.');
}

const localVoice=path.join(videoRoot,'scripts/generate-voicevox.mjs');
if(fs.existsSync(localVoice)){
  const src=fs.readFileSync(localVoice,'utf8');
  if(!src.includes('shared/voice/generate-voicevox.mjs')) warn.push('QA-VOICE-01: local generate-voicevox.mjs does not reference shared generator. New videos must use shared generator.');
}

if(phase==='post'){
  const syncPath=path.join(videoRoot,'src/sync-timing.json');
  if(!fs.existsSync(syncPath)) fail.push('QA-SYNC-01: sync-timing.json missing after voice generation');
  else{
    const sync=readJson(syncPath);
    if((sync.beats||[]).length!==beats.length) fail.push(`QA-SYNC-01: sync beat count ${(sync.beats||[]).length} != script beat count ${beats.length}`);
    for(const b of sync.beats||[]){if(!(Number.isFinite(b.start)&&Number.isFinite(b.end)&&b.end>b.start)) fail.push(`QA-SYNC-01: invalid timing for ${b.id}`);}
  }
  const reportPath=path.join(videoRoot,'public/audio/pronunciation-report.json');
  if(!fs.existsSync(reportPath)) warn.push('QA-VOICE-02: pronunciation-report.json missing after voice generation');
}

console.log(`Production QA (${phase}): beats=${beats.length}, uniqueScenes=${unique.size}, sharedTemplatesUsed=${beats.filter(b=>b.template_id).length}`);
for(const w of warn) console.warn(`WARNING: ${w}`);
if(fail.length){for(const e of fail) console.error(`ERROR: ${e}`);process.exit(1);}
console.log('Production QA passed');
