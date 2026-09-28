import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';

const root=process.cwd(),target=path.join(root,'v103-codpiece-original-scenes');
const template=path.join(root,'v44-interaction-attraction');
if(!fs.existsSync(template))throw Error('Remotion template missing');
fs.rmSync(target,{force:true,recursive:true});fs.cpSync(template,target,{recursive:true});
const sections=[
 ['00-prologue','prologue',19],['01-origins','origins',34],['02-kingship','kingship',36],
 ['03-greek-ideal','greek_ideal',39],['04-presentation','social_presentation',46],
 ['05-epilogue','epilogue',19]
];
const beats=[];let index=0;
for(const [file,phase,count] of sections){
 const narration=fs.readFileSync(path.join(root,'shared/v103/narration',file+'.txt'),'utf8');
 const phaseRe=new RegExp('^\\[\\['+phase+'\\]\\]\\s*');
 if(!phaseRe.test(narration))throw Error('Incorrect phase heading in '+file);
 const sentences=(narration.replace(phaseRe,'').replace(/\n+/g,' ').match(/[^。！？]+[。！？]?/g)||[]).map(x=>x.trim()).filter(Boolean);
 const design=fs.readFileSync(path.join(root,'shared/v103/design',file+'.txt'),'utf8').trim().split('\n').map(x=>x.trim().split('|'));
 if(sentences.length!==count||design.length!==count)throw Error('Script/design count mismatch '+phase+': '+sentences.length+'/'+design.length+'/'+count);
 for(let v=0;v<count;v++){
  const [group,actionLabel,primary,verb,num]=design[v];
  if(Number(num)!==v||!group||!actionLabel||!primary||!verb)throw Error('Malformed manually authored action '+phase+'/'+v);
  const n=++index,environment=file+':'+group;
  beats.push({id:'S'+String(n).padStart(3,'0'),phase,variant:v,narration:sentences[v],environment,
   actionId:'v103-'+file+'-'+String(v).padStart(2,'0')+'-'+verb,
   actionLabel,primary,verb,sceneKey:phase+'__'+String(v+1).padStart(2,'0'),
   visual:'v103-visual-'+String(n).padStart(3,'0'),bgGroup:environment,
   family:['historical-establish','figure-interaction','object-macro','document-action','cause-diagram','craft-hand','multi-actor','artifact-reveal','reaction','time-comparison','split-space','light-event','movement','symbolic-metaphor','overhead-craft','museum-view','material-transform'][(n*7)%17],
   shotKind:['establish','detail','medium','overhead','reverse','macro'][v%6],
   visualIntent:actionLabel,assetComposition:'bespoke'});
 }
}
if(beats.length!==193||new Set(beats.map(x=>x.actionId)).size!==193)throw Error('Missing custom scene actions');
const seen=new Set(),families=new Set(beats.map(x=>x.family));
for(let i=0;i<beats.length;i++){
 const b=beats[i];if(seen.has(b.environment)&&(i===0||beats[i-1].environment!==b.environment))throw Error('Noncontiguous background reuse '+b.environment);
 seen.add(b.environment);
 if(i&&beats[i-1].family===b.family)throw Error('Adjacent composition repeat '+b.id);
 const window=beats.slice(Math.max(0,i-5),i+1);
 if(window.length===6&&new Set(window.map(x=>x.family)).size<5)throw Error('Low visual diversity '+b.id);
}
const src=path.join(target,'src'),pub=path.join(target,'public/assets/v103'),scripts=path.join(target,'scripts');
fs.mkdirSync(src,{recursive:true});fs.mkdirSync(pub,{recursive:true});fs.mkdirSync(scripts,{recursive:true});
fs.writeFileSync(path.join(target,'script.txt'),sections.map(([file])=>fs.readFileSync(path.join(root,'shared/v103/narration',file+'.txt'),'utf8').replace(/^\[\[[^\]]+\]\]\s*/,'')).join('\n\n'));
fs.writeFileSync(path.join(src,'script-data.json'),JSON.stringify({videoId:'V103-codpiece-original-scenes',title:'中世ヨーロッパ、人々は男性器の中に名誉と権力を詰め込んだ',beats},null,2));
fs.writeFileSync(path.join(src,'scene-data.json'),JSON.stringify(beats,null,2));
fs.writeFileSync(path.join(src,'sync-timing.json'),JSON.stringify({durationSeconds:1200,beats:[]},null,2));
for(const file of ['index.tsx','scenes.tsx','scene-engine.tsx','codpiece-primitives.tsx','backgrounds.tsx'])fs.copyFileSync(path.join(root,'shared/v103',file),path.join(src,file));
fs.copyFileSync(path.join(root,'shared/v100/primitives.tsx'),path.join(src,'primitives.tsx'));
for(const file of ['generate-bgm.mjs','plan-segments.mjs'])fs.copyFileSync(path.join(root,'shared/v53',file),path.join(scripts,file));
for(const file of ['build-preproduction.mjs','generate-voicevox.mjs','check-original-scenes.mjs'])fs.copyFileSync(path.join(root,'shared/v103',file),path.join(scripts,file));
const catalog=JSON.parse(fs.readFileSync(path.join(root,'shared/asset-library/catalog.json'),'utf8'));
const bgNames=['BG_girisya.png','BG_honndana.png','BG_darkroom.png','BG_syosai.png'];
const uses=[];
for(const name of bgNames){
 const a=catalog.assets.find(x=>x.category==='背景'&&x.file.endsWith('/'+name));
 if(!a||a.license!=='cleared-commercial')throw Error('Library background not approved: '+name);
 const source=path.join(root,'shared/asset-library',a.file),dest=path.join(pub,name);
 fs.copyFileSync(source,dest);
 const hash=createHash('sha256').update(fs.readFileSync(dest)).digest('hex');
 if(hash!==a.sourceSha256)throw Error('Library hash mismatch '+name);
 uses.push({id:a.id,name,license:a.license,sha256:hash});
}
fs.writeFileSync(path.join(src,'library-assets.json'),JSON.stringify(uses,null,2));
for(const file of ['SOURCES.md','V103_PRODUCTION_SPEC.md'])fs.copyFileSync(path.join(root,'shared/v103',file),path.join(target,file));
fs.writeFileSync(path.join(target,'production-manifest.json'),JSON.stringify({videoId:'V103-codpiece-original-scenes',method:'narration-specific-art',sceneCount:193,originalBackgroundSettings:seen.size,libraryBackgrounds:uses,antiRepetition:{staticAdjacentBackground:true,noncontiguousGroupReuse:false,uniqueActionPerNarration:true,minFamiliesPerSixShots:5},output:{fps:30,width:1920,height:1080,narration:'VOICEVOX 青山龍星',subtitles:true,bgm:true}},null,2));
console.log('V103 prepared: '+beats.length+' individual narration actions, '+seen.size+' contiguous backgrounds, '+families.size+' visual families, '+uses.length+' licensed template backgrounds');
