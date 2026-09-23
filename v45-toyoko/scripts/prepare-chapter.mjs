import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const CHAPTERS=['prologue','chapter1','chapter2','chapter3','chapter4','epilogue'];
const chapter=process.argv[2];
if(!CHAPTERS.includes(chapter))throw Error('Usage: node scripts/prepare-chapter.mjs <'+CHAPTERS.join('|')+'>');
const markdown=fs.readFileSync(path.join(root,'src/approved_original_narration.md'),'utf8').trimEnd();
const plan=JSON.parse(fs.readFileSync(path.join(root,'src/toyoko_scene_plan.json'),'utf8'));
const headings=[...markdown.matchAll(/^# 【(.+?)】$/gm)];
if(headings.length!==6)throw Error('The approved manuscript must have six section headers');
const sections=headings.map((m,i)=>markdown.slice(m.index,headings[i+1]?.index??markdown.length)
  .split('\n').map(t=>t.trim()).filter(t=>t&&!t.startsWith('#')&&!t.startsWith('約')&&!t.startsWith('---')));
const expectedCounts=[26,50,58,66,74,25];
if(sections.some((p,i)=>p.length!==expectedCounts[i]))throw Error('The approved manuscript structure has changed');
const index=CHAPTERS.indexOf(chapter);
const paragraphs=sections[index], shots=plan.scenes.filter(s=>s.chapterId===chapter).flatMap(s=>s.shots);
const expectedShotCounts=[18,32,30,32,32,16];
if(shots.length!==expectedShotCounts[index])throw Error('Unexpected scene-plan shot count for '+chapter);
if(chapter==='prologue'){
 const fixed=JSON.parse(fs.readFileSync(path.join(root,'src/prologue-script-data.json'),'utf8'));
 if(fixed.beats.map(b=>b.sourceFragments.join('')).join('')!==paragraphs.join(''))throw Error('User original prologue has changed');
 fs.writeFileSync(path.join(root,'src/script-data.json'),JSON.stringify(fixed,null,2)+'\n');
 console.log('Prologue: original 26 paragraphs losslessly assigned to 18 user-confirmed shot IDs');
 process.exit(0);
}
const n=paragraphs.length,m=shots.length;
const norm=s=>s.replace(/[\s「」『』、。！？.,，．：:（）()／\-]/g,'');
const share=(cue,para)=>{
 const a=norm(cue),b=norm(para);
 if(!a||!b)return 0;
 if(b.includes(a))return 1;
 if(a.length>=14&&b.includes(a.slice(0,14)))return .7;
 let hits=0;
 for(let i=0;i+2<a.length;i++)if(b.includes(a.slice(i,i+3)))hits++;
 return hits/Math.max(1,a.length-2)*.36;
};
const MAX=6;
// Monotone paragraph-to-shot alignment preserves every original paragraph once
// and never reorders narration to imitate nonchronological scene-plan cues.
const dp=Array.from({length:m+1},()=>new Array(n+1).fill(-Infinity));
const back=Array.from({length:m+1},()=>new Array(n+1).fill(null));
dp[0][0]=0;
for(let si=0;si<m;si++)for(let pi=0;pi<=n;pi++){
 if(!Number.isFinite(dp[si][pi]))continue;
 for(let take=1;take<=MAX&&pi+take<=n;take++){
  if(n-(pi+take)<m-(si+1))continue;
  if(n-(pi+take)>(m-(si+1))*MAX)continue;
  const sub=paragraphs.slice(pi,pi+take);
  const cue=shots[si].narrationCue??'';
  const relevance=Math.max(0,...sub.map(x=>share(cue,x)));
  const center=(pi+take*.5)/n,target=(si+.5)/m;
  const drift=Math.abs(center-target);
  const length=sub.reduce((a,x)=>a+x.length,0);
  const totalLength=paragraphs.reduce((a,x)=>a+x.length,0);
  const lengthCost=Math.abs(length/totalLength-1/m);
  const score=dp[si][pi]+14*relevance-1.9*drift-5.1*lengthCost-0.11*(take-1)**2;
  if(score>dp[si+1][pi+take]){dp[si+1][pi+take]=score;back[si+1][pi+take]={pi,take,relevance};}
 }
}
if(!Number.isFinite(dp[m][n]))throw Error('No lossless narration alignment for '+chapter);
const blocks=Array(m);let pi=n;
for(let si=m;si>0;si--){
 const b=back[si][pi];if(!b)throw Error('Broken backtrack for '+chapter);
 blocks[si-1]={fragments:paragraphs.slice(b.pi,pi),range:[b.pi,pi-1],cueMatch:b.relevance};
 pi=b.pi;
}
if(pi!==0||blocks.flatMap(x=>x.fragments).join('')!==paragraphs.join(''))throw Error('Unmatched original paragraphs');
const beats=shots.map((shot,i)=>({
 id:shot.shotId,sceneId:shot.shotId.split('-')[0],
 narration:blocks[i].fragments.join('\n'),subtitle:blocks[i].fragments.join('\n'),
 sourceFragments:blocks[i].fragments,sourceParagraphRange:blocks[i].range,
 sceneCueMatch:+blocks[i].cueMatch.toFixed(3),sourceStatus:'approved_original_verbatim'
}));
if(beats.some(b=>!b.narration||b.narration!==b.subtitle))throw Error('Text binding integrity failed');
const out={version:'original-approved-narration-2026-09-23',title:plan.title,
 approved:true,originalApprovedScriptRecovered:true,narrationStatus:'user_uploaded_original_script_verbatim',
 sourceFile:'src/approved_original_narration.md',sourceChapter:chapter,
 sourceParagraphCount:paragraphs.length,mappingRule:'Lossless chronological partition, source order preserved. Scene visual/cue mismatch is logged for human inspection, not silently fixed by rewriting original.',
 beats};
fs.writeFileSync(path.join(root,'src/script-data.json'),JSON.stringify(out,null,2)+'\n');
const report={chapter,sourceParagraphs:n,shots:m,
 sourceCharacterCount:paragraphs.join('').length,
 narrationPreservedVerbatim:true,
 needsCueVisualReview:beats.filter(b=>b.sceneCueMatch<.25).map(b=>({shotId:b.id,
  cue:shots.find(x=>x.shotId===b.id)?.narrationCue,
  narrationStart:b.narration.slice(0,70),sourceParagraphRange:b.sourceParagraphRange}))};
const outDir=path.join(root,'out');
fs.mkdirSync(outDir,{recursive:true});
fs.writeFileSync(path.join(outDir,'original-narration-alignment-'+chapter+'.json'),JSON.stringify(report,null,2)+'\n');
console.log('Prepared '+chapter+': '+n+' original paragraphs, '+m+' exact scene-plan shots; '+report.needsCueVisualReview.length+' shots flagged for sequence/cue visual review.');
