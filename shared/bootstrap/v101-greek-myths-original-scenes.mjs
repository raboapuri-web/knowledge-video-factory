import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const target=path.join(root,'v101-greek-myths-original-scenes');
fs.cpSync(path.join(root,'v44-interaction-attraction'),target,{recursive:true,force:true});
const script=fs.readFileSync('shared/v101/greek-myths-script.txt','utf8');
const plan=JSON.parse(fs.readFileSync('shared/v101/scene-design.json','utf8'));
const chapters=[...script.matchAll(/\[\[([a-z]+)\]\]\s*([\s\S]*?)(?=\n\s*\[\[|$)/g)];
const beats=[];let index=0;
for(const chapter of chapters){
 const phase=chapter[1],sentences=(chapter[2].replace(/\n+/g,' ').match(/[^。！？]+[。！？]?/g)||[]).map(t=>t.trim()).filter(Boolean);
 const shots=plan.phases[phase];
 if(sentences.length!==shots.length)throw Error(phase+' narration/shot count mismatch');
 for(let i=0;i<sentences.length;i++){
  const s=sentences[i],shot=shots[i],parts=[];
  if(s.length<=76)parts.push(s);
  else{const m=s.lastIndexOf('、',75);if(m<26)throw Error('No safe clause split: '+phase+'/'+i);parts.push(s.slice(0,m+1),s.slice(m+1));}
  for(let j=0;j<parts.length;j++){
   const k=phase+'-'+i+'-'+j;beats.push({id:'S'+String(++index).padStart(3,'0'),phase,variant:i,sentenceIndex:i,subpart:j,subparts:parts.length,narration:parts[j],environment:shot.environment,primary:shot.primary,secondaries:shot.secondaries,motion:shot.motion,label:shot.label,actionId:shot.originalActionId+'-'+j,sceneKey:k,visual:'V101-'+k,bgGroup:shot.environment,shotKind:'custom'});
  }
 }
}
if(chapters.length!==6||beats.length<114||new Set(beats.map(x=>x.actionId)).size!==beats.length)throw Error('Scene integrity error');
const src=path.join(target,'src');fs.mkdirSync(src,{recursive:true});
fs.writeFileSync(path.join(target,'script.txt'),script.replace(/\[\[[a-z]+\]\]\s*/g,''));
fs.writeFileSync(path.join(src,'script-data.json'),JSON.stringify({videoId:'V101-greek-myths-original-scenes',title:'ギリシア神話',beats},null,2));
fs.writeFileSync(path.join(src,'scene-data.json'),JSON.stringify(beats,null,2));
fs.writeFileSync(path.join(src,'sync-timing.json'),JSON.stringify({durationSeconds:1050,beats:[]},null,2));
for(const file of ['index.tsx','scenes.tsx','greek-visuals.tsx'])fs.copyFileSync('shared/v101/'+file,path.join(src,file));
fs.copyFileSync('shared/v100/primitives.tsx',path.join(src,'primitives.tsx'));
for(const file of ['generate-bgm.mjs','plan-segments.mjs'])fs.copyFileSync('shared/v53/'+file,path.join(target,'scripts',file));
for(const file of ['build-preproduction.mjs','generate-voicevox.mjs','check-original-scenes.mjs'])fs.copyFileSync('shared/v101/'+file,path.join(target,'scripts',file));
for(const file of ['SOURCES.md','V101_PRODUCTION_SPEC.md'])fs.copyFileSync('shared/v101/'+file,path.join(target,file));
console.log('Prepared '+beats.length+' Greek myth animation beats');
