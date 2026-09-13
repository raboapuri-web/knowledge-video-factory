import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
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

const registry=readJson(path.join(repoRoot,'shared/production-rules/visual-template-registry.json'));
const voiceRules=readJson(path.join(repoRoot,'shared/production-rules/voice-pronunciation.json'));
const qaRules=readJson(path.join(repoRoot,'shared/production-rules/qa-rules.json'));
const prePolicy=readJson(path.join(repoRoot,'shared/production-rules/preproduction-policy.json'));
const syncManifest=readJson(path.join(repoRoot,'shared/production-rules/sync-manifest.json'));
const knownTemplates=new Set((registry.templates||[]).filter(t=>t.status==='active').map(t=>t.id));

// QA-SYNC-LEDGER: the recorded human-ledger version and GitHub runtime version must agree,
// and the recorded GitHub version must equal the actual runtime JSON version.
const expectedResources={
  'voice-rules':voiceRules.version,
  'visual-template-registry':registry.version,
  'qa-rules':qaRules.version,
  'preproduction-policy':prePolicy.version,
  'sync-manifest':syncManifest.version
};
for(const [stableId,actualVersion] of Object.entries(expectedResources)){
  const row=(syncManifest.resources||[]).find(r=>r.stableId===stableId);
  if(!row){fail.push(`QA-SYNC-LEDGER: sync-manifest missing stableId '${stableId}'`);continue;}
  if(Number(row.githubVersion)!==Number(actualVersion)) fail.push(`QA-SYNC-LEDGER: ${stableId} recorded githubVersion ${row.githubVersion} != actual ${actualVersion}`);
  if(Number(row.sheetVersion)!==Number(row.githubVersion)) fail.push(`QA-SYNC-LEDGER: ${stableId} sheetVersion ${row.sheetVersion} != githubVersion ${row.githubVersion}`);
}

const sceneKeys=beats.map(b=>b.template_id||b.visual).filter(Boolean);
const unique=new Set(sceneKeys);
if(beats.length>=40&&unique.size<30) fail.push(`QA-VIS-01: long-form video has only ${unique.size} unique scene keys for ${beats.length} beats; need >=30`);
const forbidden=sceneKeys.filter(k=>/^(fallback|default)$/i.test(String(k)));
if(forbidden.length) fail.push(`QA-VIS-02: fallback/default scenes found: ${forbidden.join(', ')}`);
for(const beat of beats){
  if(beat.template_id&&!knownTemplates.has(beat.template_id)) fail.push(`Unknown shared template '${beat.template_id}' in ${beat.id}`);
}

const manifestPath=path.join(videoRoot,'production-manifest.json');
let manifest=null;
if(fs.existsSync(manifestPath)){
  manifest=readJson(manifestPath);
  const systemVersion=Number(manifest.productionSystemVersion||0);
  if(systemVersion<1) fail.push('QA-REG-01: productionSystemVersion must be >=1');
  if(Number(manifest.visualRegistryVersion||0)!==Number(registry.version)) fail.push(`QA-REG-02: visualRegistryVersion ${manifest.visualRegistryVersion} does not match registry ${registry.version}`);
  if(Number(manifest.voiceDictionaryVersion||0)!==Number(voiceRules.version)) fail.push(`QA-REG-02: voiceDictionaryVersion ${manifest.voiceDictionaryVersion} does not match dictionary ${voiceRules.version}`);
  if(systemVersion>=2){
    if(Number(manifest.qaRulesVersion||0)!==Number(qaRules.version)) fail.push(`QA-REG-02: qaRulesVersion ${manifest.qaRulesVersion} does not match QA registry ${qaRules.version}`);
    if(Number(manifest.preproductionPolicyVersion||0)!==Number(prePolicy.version)) fail.push(`QA-REG-02: preproductionPolicyVersion ${manifest.preproductionPolicyVersion} does not match policy ${prePolicy.version}`);
    if(Number(manifest.syncManifestVersion||0)!==Number(syncManifest.version)) fail.push(`QA-REG-02: syncManifestVersion ${manifest.syncManifestVersion} does not match sync manifest ${syncManifest.version}`);
    if(manifest.requiresPreproductionPlan!==true) fail.push('QA-PLAN-01: requiresPreproductionPlan must be true for Production System v2+');
    if(phase==='pre'){
      try{
        execFileSync(process.execPath,[path.join(repoRoot,'shared/qa/validate-preproduction.mjs'),videoRoot,'render'],{stdio:'inherit'});
      }catch{
        fail.push('QA-PLAN-01/02/03/04: preproduction plan validation failed');
      }
    }
  }
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

console.log(`Production QA (${phase}): beats=${beats.length}, uniqueScenes=${unique.size}, sharedTemplatesUsed=${beats.filter(b=>b.template_id).length}, systemVersion=${manifest?.productionSystemVersion||'legacy'}`);
for(const w of warn) console.warn(`WARNING: ${w}`);
if(fail.length){for(const e of fail) console.error(`ERROR: ${e}`);process.exit(1);}
console.log('Production QA passed');
