import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const get=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const plan=get('src/topic-blocks.json');
const approved=fs.readFileSync(path.join(root,'src/approved_original_narration.md'),'utf8').trimEnd();
const refs=get('src/toyoko_scene_plan.json').assetRegistry.backgrounds;
const backgrounds=new Map(refs.map(x=>[x.id,x]));
const heads=[...approved.matchAll(/^# 【(.+?)】$/gm)];
const paragraphs=heads.map((h,i)=>approved.slice(h.index,heads[i+1]?.index??approved.length)
 .split('\n').map(x=>x.trim()).filter(x=>x&&!x.startsWith('#')&&!x.startsWith('約')&&!x.startsWith('---')));
const expected=['prologue','chapter1','chapter2','chapter3','chapter4','epilogue'];
const categoryBackgrounds={
 town:new Set(['BG_TOWN_NIGHT_WIDE','BG_TOWN_DAY_WIDE','BG_TOYOKO_GROUND','BG_KABUKICHO_ALLEY','BG_GIRL_HOME','BG_LIBRARY_CLASSROOM','BG_SHELTER_ENTRANCE']),
 facility:new Set(['BG_TOYOKO_GROUND','BG_SHELTER_ENTRANCE','BG_SHELTER_BEDROOM','BG_SHELTER_DINING','BG_SHELTER_COUNSEL','BG_ABROAD_SHELTER']),
 research:new Set(['BG_VANCOUVER_RAIN','BG_ABROAD_SHELTER','BG_SHELTER_ENTRANCE','BG_TOYOKO_GROUND','BG_LIBRARY_ROOM']),
 youth_center:new Set(['BG_YOUTH_CENTER','BG_YOUTH_CENTER_ENTRANCE','BG_TOYOKO_GROUND']),
 concept:new Set(['BG_SHELTER_ENTRANCE','BG_TOYOKO_GROUND','BG_TOWN_DAY_WIDE'])
};
const allowedDiagrams=new Set(['community','network','safe_icons','safe_vs_belonging','japan_canada',
 'survey38','survey49','survey138','survey80','survey37','odds59','rule_icons','choice_path',
 'trust_gap','autonomy','belonging','network_risk','adult_compare','dependency',
 'resource_trap','clock21','rules_tradeoff','research_process']);
if(plan.blocks.length!==25||heads.length!==6||plan.chapterOrder.join('|')!==expected.join('|'))
 throw Error('Expected precisely the user-requested 25 topic blocks across all six original chapters');
let scenes=0;
for(let i=0;i<6;i++){
 const chapter=expected[i],lines=paragraphs[i];
 const subset=plan.blocks.filter(b=>b.chapterId===chapter);
 let previous=0;
 for(const b of subset){
  const [from,to]=b.sourceParagraphRange;
  if(from!==previous+1||to>lines.length||b.sourceFirstParagraph!==lines[from-1]||
    b.sourceLastParagraph!==lines[to-1])throw Error('Topic block text/range drift '+b.blockId);
  previous=to;
  let prevVisual=from-1;
  for(const v of b.visualSegments){
   scenes++;
   if(v.fromParagraph!==prevVisual+1||v.toParagraph>to||v.fromParagraph>v.toParagraph)
    throw Error('Visual paragraph gap/overlap at '+b.blockId);
   prevVisual=v.toParagraph;
   if(!['scene','scene-overlay','diagram'].includes(v.kind))throw Error('Unknown visual kind');
   if(v.kind==='diagram'&&v.backgroundId!==null)throw Error('Standalone diagram must not have an unrelated background');
   if(v.kind!=='diagram'){
    const bg=backgrounds.get(v.backgroundId);
    if(!bg||!categoryBackgrounds[b.primaryCategory]?.has(v.backgroundId))
     throw Error('Topic/background mismatch '+b.blockId+'/'+v.backgroundId);
    const asset=bg.assetFile??('shared/asset-library/'+bg.sourceOrBrief);
    const match=asset.match(/^shared\/asset-library\/背景\/([\w.-]+\.png)$/);
    if(!match||!fs.existsSync(path.join(root,'public/assets/library/背景',match[1])))
     throw Error('Missing verified background source '+v.backgroundId);
   }
   if(v.diagramId&&!allowedDiagrams.has(v.diagramId))throw Error('Unimplemented React diagram '+v.diagramId);
  }
  if(prevVisual!==to)throw Error('Incomplete visual coverage '+b.blockId);
 }
 if(previous!==lines.length)throw Error('Original chapter omitted '+chapter);
}
if(scenes!==82)throw Error('Expected 82 paragraph-anchored setting/diagram units');
console.log('Verified 25 topic blocks / 82 paragraph-anchored visual units / six unchanged original chapters.');
