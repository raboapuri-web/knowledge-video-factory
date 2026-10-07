import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'..');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'manifest.json'),'utf8'));
if(manifest.videoId!=='V116') throw new Error('Wrong video ID');
if(manifest.chapters.length!==9) throw new Error('Expected 9 chapter render units');

const chapters=manifest.chapters.map(([slug])=>JSON.parse(fs.readFileSync(path.join(root,'chapters',slug+'.json'),'utf8')));
const beats=chapters.flatMap(c=>c.beats.map(b=>({...b,chapter:c.slug})));
if(beats.length<36||beats.length>50) throw new Error('Expected 36-50 semantic scenes, got '+beats.length);

const ids=new Set();
let prevKind='',run=0;
for(const b of beats){
  if(ids.has(b.id)) throw new Error('Duplicate beat '+b.id);
  ids.add(b.id);
  if(!b.narration||b.narration.length<45) throw new Error('Narration too short '+b.id);
  if(!b.headline||!b.kind||!Array.isArray(b.labels)) throw new Error('Incomplete beat '+b.id);
  run=b.kind===prevKind?run+1:1;
  if(run>2) throw new Error('Visual kind repeated >2 times: '+b.kind+' at '+b.id);
  prevKind=b.kind;
}
const kinds=new Set(beats.map(b=>b.kind));
if(kinds.size<20) throw new Error('Insufficient visual diversity: '+kinds.size);

const scene=fs.readFileSync(path.join(root,'src','production-scene.tsx'),'utf8');
for(const token of [
  'const contentLayer=createRef<Node>();',
  'const subtitleLayer=createRef<Node>();',
  'contentLayer().add(<Node ref={group}',
  "fill={'rgba(0,0,0,0.90)'}",
]){
  if(!scene.includes(token)) throw new Error('Subtitle overlay regression: missing '+token);
}
const contentIndex=scene.indexOf('<Node ref={contentLayer}/>');
const subtitleIndex=scene.indexOf('<Node ref={subtitleLayer}>');
if(contentIndex<0||subtitleIndex<0||subtitleIndex<=contentIndex){
  throw new Error('Subtitle overlay regression: subtitle layer must render after content layer');
}

const counts=chapters.map(c=>({slug:c.slug,beats:c.beats.length,chars:c.beats.reduce((s,b)=>s+b.narration.length,0)}));
const summary={
  videoId:'V116',
  chapters:chapters.length,
  semanticScenes:beats.length,
  visualKinds:kinds.size,
  totalChars:counts.reduce((s,x)=>s+x.chars,0),
  counts,
  subtitleOverlay:'topmost',
  passed:true
};
fs.mkdirSync(path.join(root,'qa'),{recursive:true});
fs.writeFileSync(path.join(root,'qa','preproduction-summary.json'),JSON.stringify(summary,null,2));
console.log(summary);
