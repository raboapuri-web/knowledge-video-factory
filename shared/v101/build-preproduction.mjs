import fs from 'node:fs';
const beats=JSON.parse(fs.readFileSync('src/scene-data.json','utf8'));
if(beats.length<114||new Set(beats.map(x=>x.actionId)).size!==beats.length)throw Error('Action coverage incomplete');
const previous=new Set();
for(let i=0;i<beats.length;i++){
 const b=beats[i];
 if(previous.has(b.environment)&&(i===0||beats[i-1].environment!==b.environment))throw Error('Nonadjacent background reuse: '+b.environment);
 previous.add(b.environment);
 if(!b.label||!b.primary||!b.motion||!b.environment)throw Error('Scene missing authored storytelling action: '+b.id);
}
fs.mkdirSync('qa',{recursive:true});
fs.writeFileSync('preproduction-plan.json',JSON.stringify({videoId:'V101-greek-myths-original-scenes',scenes:beats},null,2));
fs.writeFileSync('qa/preproduction-summary.json',JSON.stringify({sceneCount:beats.length,sentenceCount:new Set(beats.map(x=>x.phase+'-'+x.sentenceIndex)).size,uniqueActionCount:new Set(beats.map(x=>x.actionId)).size,uniqueEnvironmentCount:new Set(beats.map(x=>x.environment)).size,phaseCount:new Set(beats.map(x=>x.phase)).size,approved:true},null,2));
console.log('V101 design check: '+beats.length+' acts and '+new Set(beats.map(x=>x.environment)).size+' fixed scene settings.');