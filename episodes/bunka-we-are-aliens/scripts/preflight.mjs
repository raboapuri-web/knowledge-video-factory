import fs from 'node:fs';import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');const report={chapters:[],issues:[],title:'我々は宇宙人',resolution:[1920,1080],fps:30,sceneGroups:42,subtitleZOrder:['contentLayer','chapterUI','subtitleBackground','subtitleText']};
let grand=0;
for(let n=0;n<7;n++){
 const d=JSON.parse(fs.readFileSync(path.join(root,'src/generated',`chapter-${n}.json`)));
 const fromCues=d.cues.map(c=>c.text).join('');
 const original=fs.readFileSync(path.join(root,'script',fs.readdirSync(path.join(root,'script')).sort()[n]),'utf8').replace(/\s/g,'');
 if(fromCues.replace(/\s/g,'')!==original)report.issues.push(`chapter ${n} narration text mismatch`);
 const counts=Array(6).fill(0),time=Array(6).fill(0);
 for(const c of d.cues){counts[c.group]++;time[c.group]+=c.duration;
  if(c.subs.some(s=>s.split('\n').length>2))report.issues.push(`ch${n} caption >2 rows`);
  for(const s of c.subs){if(s.split('\n').some(l=>l.length>34))report.issues.push(`ch${n} caption over width: ${s}`)}
 }
 if(counts.some(x=>x===0))report.issues.push(`ch${n} empty visual group`);
 const seconds=d.cues.reduce((a,b)=>a+b.duration,0);grand+=seconds;
 report.chapters.push({chapter:n,audioBeats:d.cues.length,subtitles:d.cues.reduce((a,c)=>a+c.subs.length,0),groups:counts,groupSeconds:time.map(x=>+x.toFixed(2)),estimatedMinutes:+(seconds/60).toFixed(1)});
}
report.estimatedTotalMinutes=+(grand/60).toFixed(1);report.ok=report.issues.length===0;
fs.writeFileSync(path.join(root,'qa/preflight-report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));if(!report.ok)process.exitCode=1;
