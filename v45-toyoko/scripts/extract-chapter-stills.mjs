import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const chapter=process.argv[2];
const doc=JSON.parse(fs.readFileSync(path.join(root,'src/chapter-review-data.json'),'utf8'));
if(doc.chapterId!==chapter||doc.status!=='voicevox_measured_approved_script')throw Error('Chapter metadata absent');
const movie=path.join(root,'out/chapter-'+chapter+'.mp4');
if(!fs.existsSync(movie)||fs.statSync(movie).size===0)throw Error('Expected successful chapter render');
const images=path.join(root,'out/shot-review',chapter);fs.mkdirSync(images,{recursive:true});
const stamps=[];
for(const beat of doc.beats){
 const time=((beat.from+beat.frames/2)/30).toFixed(3);
 const output=path.join(images,beat.id+'.png');
 const run=spawnSync('ffmpeg',['-y','-loglevel','error','-ss',time,'-i',movie,
 '-frames:v','1',output],{encoding:'utf8'});
 if(run.status!==0||!fs.existsSync(output)||!fs.statSync(output).size)
  throw Error('Cannot inspect '+beat.id+' ('+time+'): '+run.stderr);
 stamps.push(time+'\t'+beat.id);
}
const found=fs.readdirSync(images).filter(f=>f.endsWith('.png'));
if(found.length!==doc.beats.length)throw Error('Incomplete review stills '+found.length);
fs.writeFileSync(path.join(root,'out/timestamps-'+chapter+'.tsv'),stamps.join('\n')+'\n');
console.log(chapter+': '+found.length+' original-storyboard stills successfully exported at measured speech midpoints.');
