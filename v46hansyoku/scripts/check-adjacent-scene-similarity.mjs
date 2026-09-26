import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';

const chapter=process.argv[2];
if(!chapter)throw new Error('chapter arg required');
const root=path.resolve(import.meta.dirname,'..');
const dir=path.join(root,'.qa-'+chapter+'-frames');
if(!fs.existsSync(dir))throw new Error('QA frame directory missing: '+dir);

const frames=fs.readdirSync(dir).filter(x=>/^scene-\d+\.jpg$/.test(x)).sort();
if(frames.length<2)throw new Error('Not enough QA frames: '+frames.length);

let sampleScene=null;
if(chapter==='chapter3'){
 const plan=JSON.parse(fs.readFileSync(path.join(root,'scene-plans','chapter3.json'),'utf8'));
 sampleScene=[];
 for(let i=0;i<plan.scenes.length;i++){
  const n=Math.max(2,Number(plan.scenes[i].shotCount||2));
  for(let k=0;k<n;k++)sampleScene.push(i+1);
 }
 if(sampleScene.length!==frames.length)throw new Error('chapter3 QA sample mapping mismatch: '+sampleScene.length+' / '+frames.length);
}

const boundaryThreshold=0.95;
const exactIntraThreshold=0.99995;
const scores=[];
for(let i=0;i<frames.length-1;i++){
 const a=path.join(dir,frames[i]),b=path.join(dir,frames[i+1]);
 const filter='[0:v]crop=iw:ih-78:0:38,scale=160:54[a];[1:v]crop=iw:ih-78:0:38,scale=160:54[b];[a][b]ssim';
 const r=spawnSync('ffmpeg',['-hide_banner','-loglevel','info','-i',a,'-i',b,'-filter_complex',filter,'-f','null','-'],{encoding:'utf8'});
 if(r.status!==0)throw new Error('ffmpeg SSIM failed for '+frames[i]+' / '+frames[i+1]+'\n'+r.stderr);
 const m=String(r.stderr).match(/All:([0-9.]+)/g);
 if(!m?.length)throw new Error('SSIM score not found for '+frames[i]+' / '+frames[i+1]);
 const score=Number(m[m.length-1].split(':')[1]);
 const sameScene=sampleScene?sampleScene[i]===sampleScene[i+1]:false;
 scores.push({a:i+1,b:i+2,score,sameScene,sceneA:sampleScene?.[i]??i+1,sceneB:sampleScene?.[i+1]??i+2});
}
scores.sort((x,y)=>y.score-x.score);
console.log(chapter+' adjacent-frame SSIM top scores:');
for(const x of scores.slice(0,16))console.log(String(x.a).padStart(3,'0')+' -> '+String(x.b).padStart(3,'0')+' : '+x.score.toFixed(6)+' / '+(x.sameScene?'intra-scene '+x.sceneA:'scene '+x.sceneA+' -> '+x.sceneB));

const bad=chapter==='chapter3'
 ?scores.filter(x=>(x.sameScene&&x.score>=exactIntraThreshold)||(!x.sameScene&&x.score>=boundaryThreshold))
 :scores.filter(x=>x.score>=boundaryThreshold);

if(bad.length){
 console.error('Rejected '+bad.length+' unacceptable near-duplicate pair(s)');
 for(const x of bad)console.error('  '+x.a+' -> '+x.b+' SSIM='+x.score.toFixed(6)+' / '+(x.sameScene?'intra-scene '+x.sceneA:'scene '+x.sceneA+' -> '+x.sceneB));
 process.exit(1);
}
if(chapter==='chapter3'){
 const boundaries=scores.filter(x=>!x.sameScene);
 const intra=scores.filter(x=>x.sameScene);
 console.log('CHAPTER3 DIVERSITY QA PASSED: '+boundaries.length+' scene boundaries below '+boundaryThreshold+'; '+intra.length+' intra-scene animation pairs contain no exact duplicate above '+exactIntraThreshold);
}else{
 console.log('VISUAL DIVERSITY QA PASSED: '+(frames.length-1)+' adjacent pairs below '+boundaryThreshold);
}
