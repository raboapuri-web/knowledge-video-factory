import {mkdir,readFile,readdir,unlink} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {join} from 'node:path';

const root=process.cwd();
const out=join(root,'output');
const timing=JSON.parse(await readFile(join(root,'content/measured-timing.json'),'utf8'));
const frames=join(out,'slide-frames');
await mkdir(frames,{recursive:true});

// Remove stale frames so the contact sheet contains exactly this run's slides.
for (const name of await readdir(frames)) {
  if (name.endsWith('.png')) await unlink(join(frames,name));
}

for (const slide of timing.slides) {
  const at=Math.max(0,slide.start+Math.min(0.45,(slide.end-slide.start)/3));
  const file=join(frames,'slide-'+String(slide.id).padStart(3,'0')+'.png');
  const result=spawnSync('ffmpeg',[
    '-y','-ss',String(at),'-i',join(out,'final.mp4'),
    '-frames:v','1','-vf','scale=480:270','-update','1',file
  ],{stdio:'ignore'});
  if (result.error) throw result.error;
  if (result.status!==0) throw new Error('Could not extract slide frame '+slide.id+' (exit '+result.status+')');
}

const frameFiles=(await readdir(frames))
  .filter(name=>name.endsWith('.png'))
  .sort()
  .map(name=>join(frames,name));

if (frameFiles.length!==timing.slides.length) {
  throw new Error('Expected '+timing.slides.length+' slide frames, found '+frameFiles.length);
}

const montage=spawnSync('montage',[
  ...frameFiles,
  '-tile','6x',
  '-geometry','480x270+8+8',
  '-background','#111114',
  join(out,'contact-sheet.jpg')
],{stdio:'inherit'});

if (montage.error) throw montage.error;
if (montage.status!==0) throw new Error('ImageMagick montage failed (exit '+montage.status+')');

console.log('CONTACT_SHEET_CREATED',timing.slides.length);
