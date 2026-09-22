import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';

const here=path.dirname(fileURLToPath(import.meta.url));
export const libraryRoot=here;
const legalCategories=new Set(['パーツ','背景']);
const sha256=(p)=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const read=(p)=>JSON.parse(fs.readFileSync(p,'utf8'));
const forbiddenSvg=/<script\b|<foreignObject\b|\bon\w+\s*=|(?:href|src)\s*=\s*["'](?:https?:|javascript:|data:)/i;

export function validateCatalog(catalog=read(path.join(here,'catalog.json')),root=here){
 if(!Array.isArray(catalog.assets)||!(Number(catalog.threshold)>=.80&&Number(catalog.threshold)<=1))throw Error('invalid asset catalog');
 const ids=new Set(),paths=new Set();
 for(const a of catalog.assets){
  if(!/^[a-z0-9][a-z0-9-]*$/.test(a.id)||ids.has(a.id))throw Error('duplicate/invalid asset ID: '+a.id);
  ids.add(a.id);
  if(!legalCategories.has(a.category)||typeof a.file!=='string'||!a.file.startsWith(a.category+'/'))throw Error('invalid category or path for '+a.id);
  if(!Array.isArray(a.tags)||a.tags.length<2||a.tags.some(t=>typeof t!=='string'||t.length<2)||!Array.isArray(a.mustMentionAny)||!a.mustMentionAny.length)throw Error('two tags and a direct concept anchor required for '+a.id);
  if(a.license!=='original-project'&&a.license!=='cleared-commercial'&&a.license!=='pending-review')throw Error('rights not cleared for '+a.id);
  if(paths.has(a.file))throw Error('duplicate asset file '+a.file);
  paths.add(a.file);
  if(!/\.(?:svg|png|webp)$/.test(a.file))throw Error('unsupported format '+a.file);
  const full=path.resolve(root,a.file);
  if(!full.startsWith(path.resolve(root)+path.sep)||!fs.existsSync(full)||!fs.lstatSync(full).isFile()||fs.lstatSync(full).isSymbolicLink())throw Error('missing/unsafe asset file '+a.file);
  if(a.file.endsWith('.svg')){
   const xml=fs.readFileSync(full,'utf8');
   if(!xml.includes('<svg')||forbiddenSvg.test(xml))throw Error('untrusted SVG content '+a.file);
  }
  if(!a.layout||[a.layout.x,a.layout.y,a.layout.w,a.layout.h].some(v=>!Number.isFinite(v))||a.layout.w<=0||a.layout.h<=0)throw Error('invalid layout '+a.id);
 }
 return catalog;
}

const contains=(text,term)=>text.includes(String(term).normalize('NFKC').toLowerCase());
export function rankAsset(asset,scene,policy={}){
 if(asset.category!=='パーツ'||asset.license==='pending-review')return null;
 const body=String((scene.narration||'')+' '+(scene.visualIntent||'')).normalize('NFKC').toLowerCase();
 const phase=String(scene.phase||'');
 if(asset.phases?.length&&!asset.phases.includes(phase)&&!asset.phases.includes('*'))return null;
 if((asset.avoid||[]).some(t=>contains(body,t)))return null;
 if(asset.mustMentionAny?.length&&!asset.mustMentionAny.some(t=>contains(body,t)))return null;
 const hits=asset.tags.filter(t=>contains(body,t));
 if(hits.length<2)return null; // A topic/phase alone can never cause reuse.
 const score=Math.min(1,.16+.145*Math.min(3,hits.length)+((asset.phases?.includes(phase)||asset.phases?.includes('*'))?.25:0)
  +(asset.style===policy.visualStyle?.10:0)+(asset.palette===policy.palette?.09:0));
 return score>=Number(policy.threshold||.88)?{asset,score:Number(score.toFixed(3)),matchedTags:hits}:null;
}
const serialize=(match,root)=>{
 if(!match)return null;
 const a=match.asset;
 return {id:a.id,category:a.category,file:'assets/library/'+a.file,sha256:sha256(path.join(root,a.file)),
   score:match.score,matchedTags:match.matchedTags,layout:a.layout,motion:a.motion||'fade',license:a.license};
};
export function buildPlan(beats,catalog=read(path.join(here,'catalog.json')),root=here){
 validateCatalog(catalog,root);
 if(!Array.isArray(beats)||!beats.length)throw Error('script-data.json needs nonempty beats');
 const policy={...catalog.policy,threshold:catalog.threshold};
 const ids=new Set(),seenGroups=new Set();let previous='';
 const counts=new Map(),lastAt=new Map(),lastGroup=new Map(),scenes={};
 let proposals=0,overlays=0;
 for(const [i,b] of beats.entries()){
  if(!b.id||ids.has(b.id)||!b.narration||!b.bgGroup)throw Error('beat id/narration/bgGroup missing or duplicate at index '+i);
  ids.add(b.id);
  if(b.bgGroup!==previous&&seenGroups.has(b.bgGroup))throw Error('noncontiguous bgGroup '+b.bgGroup);
  previous=b.bgGroup;seenGroups.add(previous);
  if(!['parts-overlay','auto','bespoke',undefined].includes(b.assetComposition))throw Error('unsupported assetComposition '+b.id);
  const ranked=catalog.assets.filter(a=>a.category==='パーツ').map(a=>rankAsset(a,b,policy)).filter(Boolean)
   .sort((a,z)=>z.score-a.score||a.asset.id.localeCompare(z.asset.id));
  let part=null;
  for(const m of ranked){
   const id=m.asset.id;
   const sameGroup=lastGroup.get(id)===b.bgGroup;
   if(!sameGroup&&i-(lastAt.get(id)??-1000)<=Number(policy.cooldownScenes??3))continue;
   if((counts.get(id)||0)>=Number(policy.partMaxScenesPerVideo??9))continue;
   part=serialize(m,root);
   counts.set(id,(counts.get(id)||0)+1);lastAt.set(id,i);lastGroup.set(id,b.bgGroup);
   break;
  }
  const explicit=b.assetComposition==='parts-overlay';
  // Explicit overlays are intentional compositions. "auto" is suggestion-only:
  // a machine cannot verify occlusion, duplicate props, or historical consistency.
  if(explicit&&!part)throw Error('explicit parts-overlay '+b.id+' has no high-match prop');
  const mode=explicit?'parts-overlay':part&&b.assetComposition==='auto'?'suggested':'bespoke';
  if(mode==='parts-overlay')overlays++;
  if(mode==='suggested')proposals++;
  scenes[b.id]={bgGroup:b.bgGroup,part,mode,
   reason:mode==='parts-overlay'?'storyboard-approved prop overlay':mode==='suggested'?
    'high lexical match; visual review required before overlay':'preserve original scene'};
 }
 const selectedAssets=[...new Map(Object.values(scenes).filter(s=>s.part).map(s=>[s.part.id,s.part])).values()]
  .map(x=>({id:x.id,file:x.file,sha256:x.sha256,license:x.license}));
 return {version:2,catalogVersion:catalog.version,threshold:catalog.threshold,beatCount:beats.length,scenes,selectedAssets,
  breakdown:{approvedOverlays:overlays,suggestedOverlays:proposals,matchedParts:Object.values(scenes).filter(x=>x.part).length,
   unmatchedBeats:Object.values(scenes).filter(x=>!x.part).length}};
}
export function prepareEpisode(episodeDir){
 const episode=path.resolve(episodeDir);
 const script=read(path.join(episode,'src/script-data.json'));
 const catalog=read(path.join(here,'catalog.json'));
 const plan=buildPlan(script.beats,catalog,here);
 const publicRoot=path.join(episode,'public/assets/library');
 // This folder belongs exclusively to this tool. Never touch other public assets.
 fs.rmSync(publicRoot,{recursive:true,force:true});fs.mkdirSync(publicRoot,{recursive:true});
 for(const item of plan.selectedAssets){
  const relative=item.file.slice('assets/library/'.length);
  const dest=path.join(publicRoot,relative);
  fs.mkdirSync(path.dirname(dest),{recursive:true});
  fs.copyFileSync(path.join(here,relative),dest);
  if(sha256(dest)!==item.sha256)throw Error('asset copy checksum mismatch '+item.id);
 }
 fs.mkdirSync(path.join(episode,'src'),{recursive:true});fs.mkdirSync(path.join(episode,'qa'),{recursive:true});
 fs.writeFileSync(path.join(episode,'src/asset-plan.json'),JSON.stringify(plan,null,2)+'\n');
 fs.writeFileSync(path.join(episode,'qa/asset-report.json'),JSON.stringify({catalogVersion:plan.catalogVersion,
  ...plan.breakdown},null,2)+'\n');
 return plan;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const dir=process.argv[2];if(!dir)throw Error('usage: node shared/asset-library/prepare.mjs <episode-dir>');
 const p=prepareEpisode(dir);
 console.log('Asset plan: '+p.breakdown.matchedParts+' matched props, '+p.breakdown.approvedOverlays+
  ' approved overlays, '+p.breakdown.suggestedOverlays+' review-only suggestions; no backgrounds or people.');
}
