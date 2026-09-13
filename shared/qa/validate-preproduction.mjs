import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const repoRoot=path.resolve(here,'../..');
const videoRoot=path.resolve(process.argv[2]||'.');
const policy=JSON.parse(fs.readFileSync(path.join(repoRoot,'shared/production-rules/preproduction-policy.json'),'utf8'));
const registry=JSON.parse(fs.readFileSync(path.join(repoRoot,'shared/production-rules/visual-template-registry.json'),'utf8'));
const planPath=path.join(videoRoot,'preproduction-plan.json');
const fail=[];
const warn=[];

if(!fs.existsSync(planPath)){
  console.error('ERROR: preproduction-plan.json is required before production.');
  process.exit(1);
}

const plan=JSON.parse(fs.readFileSync(planPath,'utf8'));
const scenes=Array.isArray(plan.scenes)?plan.scenes:[];
if(!scenes.length) fail.push('Preproduction plan has no scenes.');

const activeTemplates=new Set((registry.templates||[]).filter(t=>t.status==='active').map(t=>t.id));
const allowedSources=new Set(policy.sceneClassification||[]);
const required=policy.requiredSceneFields||[];

for(const scene of scenes){
  for(const key of required){
    if(scene[key]===undefined||scene[key]===null||scene[key]==='') fail.push(`${scene.id||'unknown'} missing required field '${key}'`);
  }
  if(!allowedSources.has(scene.templateSource)) fail.push(`${scene.id||'unknown'} has invalid templateSource '${scene.templateSource}'`);
  if(scene.templateSource==='Existing'){
    if(!scene.templateId) fail.push(`${scene.id||'unknown'} Existing scene requires templateId`);
    else if(!activeTemplates.has(scene.templateId)) fail.push(`${scene.id||'unknown'} uses unregistered/inactive template '${scene.templateId}'`);
  }
  if(scene.templateSource==='New'){
    if(!scene.newTemplateName) fail.push(`${scene.id||'unknown'} New scene requires newTemplateName`);
    if(scene.reusable===true&&!scene.proposedTemplateId) fail.push(`${scene.id||'unknown'} reusable New scene requires proposedTemplateId before render`);
  }
}

const total=Math.max(1,scenes.length);
const existing=scenes.filter(s=>s.templateSource==='Existing'&&s.templateId);
const counts=new Map();
for(const s of existing) counts.set(s.templateId,(counts.get(s.templateId)||0)+1);
for(const [id,count] of counts){
  const share=count/total;
  if(share>Number(policy.diversity.maxExistingTemplateShare||0.2)) fail.push(`Template '${id}' is ${Math.round(share*100)}% of all scenes; max is ${Math.round(policy.diversity.maxExistingTemplateShare*100)}%`);
}

let runId=null,run=0;
for(const s of scenes){
  const id=s.templateSource==='Existing'?s.templateId:null;
  if(id&&id===runId) run+=1; else {runId=id;run=id?1:0;}
  if(run>Number(policy.diversity.maxConsecutiveSameTemplate||2)) fail.push(`Template '${id}' is used ${run} consecutive scenes; max is ${policy.diversity.maxConsecutiveSameTemplate}`);
}

const sceneKeys=scenes.map(s=>s.templateSource==='Existing'?`template:${s.templateId}`:`${s.templateSource}:${s.sceneType}:${s.id}`);
const uniqueSceneKeys=new Set(sceneKeys).size;
if(scenes.length>=Number(policy.diversity.longFormBeatThreshold||40)&&uniqueSceneKeys<Number(policy.diversity.minUniqueSceneKeysForLongForm||30)){
  fail.push(`Long-form preproduction has only ${uniqueSceneKeys} unique scene keys; need >=${policy.diversity.minUniqueSceneKeysForLongForm}`);
}

const newCandidates=scenes.filter(s=>s.templateSource==='New'&&s.reusable===true);
const targetMin=Number(policy.diversity.newTemplateCandidateTargetMin||0);
const targetMax=Number(policy.diversity.newTemplateCandidateTargetMax||999);
if(newCandidates.length<targetMin) warn.push(`Only ${newCandidates.length} reusable new-template candidates; target is ${targetMin}-${targetMax}.`);
if(newCandidates.length>targetMax) warn.push(`${newCandidates.length} reusable new-template candidates may indicate over-templating; target is ${targetMin}-${targetMax}.`);

const summary={
  videoId:plan.videoId||path.basename(videoRoot),
  totalScenes:scenes.length,
  uniqueSceneKeys,
  existingTemplateUsage:Object.fromEntries([...counts.entries()].sort((a,b)=>b[1]-a[1])),
  newTemplateCandidates:newCandidates.map(s=>({sceneId:s.id,proposedTemplateId:s.proposedTemplateId||null,name:s.newTemplateName})),
  oneOffScenes:scenes.filter(s=>s.templateSource==='One-off').map(s=>s.id),
  warnings:warn,
  errors:fail
};

const outDir=path.join(videoRoot,'qa');
fs.mkdirSync(outDir,{recursive:true});
fs.writeFileSync(path.join(outDir,'preproduction-summary.json'),JSON.stringify(summary,null,2));
console.log(JSON.stringify(summary,null,2));
for(const w of warn) console.warn(`WARNING: ${w}`);
if(fail.length){for(const e of fail) console.error(`ERROR: ${e}`);process.exit(1);}
console.log('Preproduction QA passed');
