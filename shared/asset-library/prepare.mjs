import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';

const here=path.dirname(fileURLToPath(import.meta.url));
export const libraryRoot=here;
const legalCategories=new Set(['背景','パーツ','人物']);
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
  if(!Array.isArray(a.tags)||a.tags.length<2||a.tags.some(t=>typeof t!=='string'||t.length<2))throw Error('at least two descriptive tags required for '+a.id);
  if(a.license!=='original-project'&&a.license!=='cleared-commercial')throw Error('rights not cleared for '+a.id);
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
 const body=String((scene.narration||'')+' '+(scene.visualIntent||'')).normalize('NFKC').toLowerCase();
 const phase=String(scene.phase||'');
 if(asset.phases?.length&&!asset.phases.includes(phase))return null;
 if((asset.avoid||[]).some(t=>contains(body,t)))return null;
 if(asset.mustMentionAny?.length&&!asset.mustMentionAny.some(t=>contains(body,t)))return null;
 const hits=asset.tags.filter(t=>contains(body,t));
 if(hits.length<2)return null; // A topic/phase alone can never cause reuse.
 const score=Math.min(1,.16+.145*Math.min(3,hits.length)+(asset.phases?.includes(phase)?.25:0)
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
 const groups=new Map(),ids=new Set(),seenGroups=new Set();let previous='';
 for(const [i,b] of beats.entries()){
  if(!b.id||ids.has(b.id)||!b.narration||!b.bgGroup)throw Error('beat id/narration/bgGroup missing or duplicate at index '+i);
  ids.add(b.id);
  if(b.bgGroup!==previous&&seenGroups.has(b.bgGroup))throw Error('noncontiguous bgGroup '+b.bgGroup);
  previous=b.bgGroup;seenGroups.add(previous);
  if(!groups.has(b.bgGroup))groups.set(b.bgGroup,[]);
  groups.get(b.bgGroup).push(b);
 }
 const backgrounds=catalog.assets.filter(a=>a.category==='背景');
 const candidates=[];
 for(const [group,rows] of groups){
  const scene={phase:rows[0].phase,narration:rows.map(b=>b.narration).join(' '),
    visualIntent:rows.map(b=>b.visualIntent||'').join(' ')};
  for(const a of backgrounds){const match=rankAsset(a,scene,policy);if(match)candidates.push({group,match});}
 }
 const orderedGroups=[...groups.keys()];
 candidates.sort((x,y)=>y.match.score-x.match.score||orderedGroups.indexOf(x.group)-orderedGroups.indexOf(y.group)||x.match.asset.id.localeCompare(y.match.asset.id));
 const groupMatches=new Map(),usedBackgrounds=new Set();
 for(const x of candidates){
  if(groupMatches.has(x.group)||usedBackgrounds.has(x.match.asset.id))continue;
  groupMatches.set(x.group,x.match);usedBackgrounds.add(x.match.asset.id);
 }
 const counts=new Map(),lastAt=new Map(),lastGroup=new Map(),scenes={};
 for(const [i,b] of beats.entries()){
  const pick=(category,max)=>{
   const ranked=catalog.assets.filter(a=>a.category===category).map(a=>rankAsset(a,b,policy)).filter(Boolean)
    .sort((a,z)=>z.score-a.score||a.asset.id.localeCompare(z.asset.id));
   for(const m of ranked){
    const id=m.asset.id,sameGroup=lastGroup.get(id)===b.bgGroup;
    if(!sameGroup&&i-(lastAt.get(id)??-1000)<=Number(policy.cooldownScenes??3))continue;
    if((counts.get(id)||0)>=max)continue;
    counts.set(id,(counts.get(id)||0)+1);lastAt.set(id,i);lastGroup.set(id,b.bgGroup);
    return serialize(m,root);
   }
   return null;
  };
  const background=serialize(groupMatches.get(b.bgGroup),root);
  const part=pick('パーツ',Number(policy.partMaxScenesPerVideo??9));
  const person=pick('人物',Number(policy.personMaxScenesPerVideo??12));
  const requested=b.assetComposition==='library';
  const automatic=b.assetComposition==='auto';
  const complete=Boolean(background&&(part||person));
  // Preserve hand-authored Remotion scenes unless the storyboard explicitly approves replacement.
  // Do not silently show a generic fallback if a storyboard asks for a library shot.
  if(requested&&!complete)throw Error('library shot '+b.id+' has no high-match background and meaningful foreground');
  scenes[b.id]={bgGroup:b.bgGroup,background,part,person,mode:requested||(automatic&&complete)?'library':'bespoke',
   reason:requested?'explicit storyboard approval':automatic&&complete?'automatic high-match composition':
    automatic?'insufficient match; preserve authored animation':'preserve authored animation'};
 }
 const unmatched=[...groups].filter(([id])=>!groupMatches.has(id)).map(([id,rows])=>({bgGroup:id,phase:rows[0].phase,
  exampleNarration:rows.map(x=>x.narration).join(' ').slice(0,120)}));
 const chosen=new Map();
 for(const s of Object.values(scenes))for(const x of [s.background,s.part,s.person])if(x)chosen.set(x.id,x);
 return {version:1,catalogVersion:catalog.version,threshold:catalog.threshold,beatCount:beats.length,
  backgroundGroups:groups.size,backgroundsMatched:groupMatches.size,scenes,
  selectedAssets:[...chosen.values()].map(x=>({id:x.id,file:x.file,sha256:x.sha256,license:x.license})),
  missingBackgroundExamples:unmatched.slice(0,20),unmatchedBackgroundCount:unmatched.length,
  breakdown:{libraryScenes:Object.values(scenes).filter(x=>x.mode==='library').length,
   matchedParts:Object.values(scenes).filter(x=>x.part).length,matchedPeople:Object.values(scenes).filter(x=>x.person).length}};
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
  ...plan.breakdown,backgroundsMatched:plan.backgroundsMatched,backgroundGroups:plan.backgroundGroups,
  missingBackgroundExamples:plan.missingBackgroundExamples},null,2)+'\n');
 return plan;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const dir=process.argv[2];if(!dir)throw Error('usage: node shared/asset-library/prepare.mjs <episode-dir>');
 const p=prepareEpisode(dir);
 console.log('Asset plan: '+p.backgroundsMatched+'/'+p.backgroundGroups+' distinct background groups; '
  +p.breakdown.matchedParts+' parts; '+p.breakdown.matchedPeople+' people; '
  +p.breakdown.libraryScenes+' explicitly approved library scenes. No low-score filler.');
}
