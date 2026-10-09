import path from 'node:path';import {spawnSync} from 'node:child_process';import fs from 'node:fs';
const root=path.resolve(import.meta.dirname,'..'),out=path.join(root,'output');
const list=Array.from({length:7},(_,i)=>`file 'aliens-chapter-${i}.mp4'`).join('\n')+'\n';
fs.writeFileSync(path.join(out,'concat.txt'),list);
const run=(args)=>spawnSync('ffmpeg',args,{cwd:out,encoding:'utf8'});
let r=run(['-y','-f','concat','-safe','0','-i','concat.txt','-c','copy','we-are-aliens-final.mp4']);
if(r.status!==0){console.error(r.stderr);throw Error('FFmpeg stream-copy concat failed; examine chapter parameters before re-encode');}
console.log(path.join(out,'we-are-aliens-final.mp4'));
