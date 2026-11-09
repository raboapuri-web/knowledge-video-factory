import {mkdir,readFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {join} from 'node:path';
const out=join(process.cwd(),'output');
const timing=JSON.parse(await readFile(join(process.cwd(),'content/measured-timing.json'),'utf8'));
const frames=join(out,'slide-frames'); await mkdir(frames,{recursive:true});
for(const s of timing.slides){
  const at=Math.max(0,s.start+Math.min(0.45,(s.end-s.start)/3));
  const file=join(frames,'slide-'+String(s.id).padStart(3,'0')+'.png');
  const r=spawnSync('ffmpeg',['-y','-ss',String(at),'-i',join(out,'final.mp4'),'-frames:v','1','-vf','scale=480:270','-update','1',file],{stdio:'ignore'});
  if(r.status!==0) throw new Error('Could not extract slide frame '+s.id);
}
const montage=spawnSync('montage',[join(frames,'slide-*.png'),'-tile','6x','-geometry','480x270+8+8','-background','#111114',join(out,'contact-sheet.jpg')],{stdio:'inherit'});
if(montage.status!==0) throw new Error('ImageMagick montage failed');
console.log('CONTACT_SHEET_CREATED',timing.slides.length);