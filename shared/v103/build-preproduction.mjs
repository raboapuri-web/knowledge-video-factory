import fs from 'node:fs';
const beats=JSON.parse(fs.readFileSync('src/scene-data.json','utf8')),asset=JSON.parse(fs.readFileSync('src/asset-plan.json','utf8'));
if(beats.length!==193)throw Error('Expected 193 original narration shots');
const last=new Set(),groups=new Set(),family={};
for(let i=0;i<beats.length;i++){
 const b=beats[i];if(last.has(b.bgGroup)&&(i===0||beats[i-1].bgGroup!==b.bgGroup))throw Error('Noncontiguous historical backdrop '+b.bgGroup);
 last.add(b.bgGroup);groups.add(b.bgGroup);family[b.family]=(family[b.family]||0)+1;
 if(!b.actionId||!b.actionLabel||!b.primary||!b.verb||!b.narration)throw Error('Unauthored narration '+b.id);
}
if(groups.size!==44)throw Error('Expected 44 distinct authored environments, got '+groups.size);
if(new Set(beats.map(x=>x.actionId)).size!==193)throw Error('Duplicate action ID');
fs.mkdirSync('qa',{recursive:true});
fs.writeFileSync('preproduction-plan.json',JSON.stringify({videoId:'V103-codpiece-original-scenes',scenes:beats,libraryAssets:JSON.parse(fs.readFileSync('src/library-assets.json','utf8'))},null,2));
fs.writeFileSync('qa/preproduction-summary.json',JSON.stringify({scenes:193,uniqueActions:193,originalEnvironments:44,visualFamilies:Object.keys(family).length,approvedLibraryBackgrounds:4,matchedPartSuggestions:asset.breakdown?.suggestedOverlays??0},null,2));
console.log('V103 authored QA: 193 scenes / 44 environments / '+Object.keys(family).length+' visual families');