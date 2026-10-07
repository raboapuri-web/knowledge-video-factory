import fs from 'node:fs';
const plan=JSON.parse(fs.readFileSync(new URL('../production-plan.json',import.meta.url),'utf8'));
if(plan.videoId!=='V115') throw new Error('Wrong video ID');
if(plan.chapters.length!==6) throw new Error('Expected six render chapters');
const beats=plan.chapters.flatMap(c=>c.beats.map(b=>({...b,chapter:c.slug})));
if(beats.length<40||beats.length>60) throw new Error('Expected 40-60 semantic beats, got '+beats.length);
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
if(kinds.size<18) throw new Error('Insufficient visual diversity: '+kinds.size);

const productionScene=fs.readFileSync(new URL('../src/production-scene.tsx',import.meta.url),'utf8');
for(const token of [
  'const contentLayer = createRef<Node>();',
  'const subtitleLayer = createRef<Node>();',
  'contentLayer().add(<Node ref={group}',
  "fill={'rgba(0,0,0,0.90)'}",
]){
  if(!productionScene.includes(token)) throw new Error('Subtitle overlay regression: missing '+token);
}
const contentIndex=productionScene.indexOf('<Node ref={contentLayer} />');
const subtitleIndex=productionScene.indexOf('<Node ref={subtitleLayer}>');
if(contentIndex<0||subtitleIndex<0||subtitleIndex<=contentIndex){
  throw new Error('Subtitle overlay regression: subtitle layer must render after content layer');
}
const summary={
  videoId:plan.videoId,
  chapters:plan.chapters.length,
  semanticBeats:beats.length,
  visualKinds:kinds.size,
  uniqueBeatIds:ids.size,
  passed:true,
};
fs.mkdirSync(new URL('../qa/',import.meta.url),{recursive:true});
fs.writeFileSync(new URL('../qa/preproduction-summary.json',import.meta.url),JSON.stringify(summary,null,2));
console.log(summary);
