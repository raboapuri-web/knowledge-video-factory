import {readFile,readdir} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {join,extname} from 'node:path';
const root=process.cwd(),out=join(root,'output');
const bad=[String.fromCodePoint(0x6709,0x6027,0x751f,0x6b96),String.fromCodePoint(0x7121,0x6027,0x751f,0x6b96)];
const source=await readFile(join(root,'content/narration-original.txt'),'utf8');
const paragraphs=source.split(/\n\s*\n/).map(x=>x.trim()).filter(Boolean);
const plan=JSON.parse(await readFile(join(root,'content/slide-plan.json'),'utf8'));
const timing=JSON.parse(await readFile(join(root,'content/measured-timing.json'),'utf8'));
if(paragraphs.length!==59||timing.paragraphCount!==59) throw new Error('Narration paragraph count mismatch');
if(plan.length!==71||timing.slides.length!==71) throw new Error('Slide count mismatch');
for(let i=0;i<paragraphs.length;i++){
  const normalized=paragraphs[i].replace(/\r?\n/g,'');
  const spoken=timing.cues.filter(c=>c.paragraph===i+1).map(c=>c.text).join('');
  if(normalized!==spoken) throw new Error('Narration source not covered exactly once at paragraph '+(i+1));
}
for(const b of bad){
  if(source.includes(b)) throw new Error('Forbidden phrase in narration source');
  for(const c of timing.cues) if(c.text.includes(b)) throw new Error('Forbidden phrase in spoken cue');
}
async function walk(dir){
  const rows=[];
  for(const ent of await readdir(dir,{withFileTypes:true})){
    if(['node_modules','.git','output','media'].includes(ent.name)) continue;
    const p=join(dir,ent.name);
    if(ent.isDirectory()) rows.push(...await walk(p));
    else if(['.ts','.tsx','.mjs','.json','.md','.txt','.srt','.yml'].includes(extname(ent.name))) rows.push(p);
  }
  return rows;
}
for(const file of await walk(root)){
  const text=await readFile(file,'utf8');
  for(const b of bad) if(text.includes(b)) throw new Error('Forbidden phrase found in '+file);
}
const srt=await readFile(join(out,'subtitles.srt'),'utf8');
for(const b of bad) if(srt.includes(b)) throw new Error('Forbidden phrase in subtitles');
const frames=join(out,'slide-frames');
const frameFiles=(await readdir(frames)).filter(x=>x.endsWith('.png'));
if(frameFiles.length!==71) throw new Error('Expected 71 rendered slide frames, got '+frameFiles.length);
let ocrFrames=0;
for(const f of frameFiles){
  const r=spawnSync('tesseract',[join(frames,f),'stdout','-l','jpn+eng'],{encoding:'utf8'});
  if(r.status===0){
    ocrFrames++;
    for(const b of bad) if((r.stdout||'').includes(b)) throw new Error('Forbidden phrase detected by OCR in '+f);
  }
}
const probe=spawnSync('ffprobe',[
  '-v','error',
  '-show_entries','stream=codec_type,codec_name,width,height,r_frame_rate,duration',
  '-show_entries','format=duration,size',
  '-of','json',join(out,'final.mp4')
],{encoding:'utf8'});
if(probe.error||probe.status!==0) throw new Error('Final MP4 ffprobe failed: '+(probe.stderr||probe.error));
const data=JSON.parse(probe.stdout);
const streams=data.streams||[];
const video=streams.find(s=>s.codec_type==='video');
const audio=streams.find(s=>s.codec_type==='audio');
if(!video||video.width!==1920||video.height!==1080||video.r_frame_rate!=='30/1'||video.codec_name!=='h264') throw new Error('Video format mismatch: '+JSON.stringify(video));
if(!audio||audio.codec_name!=='aac') throw new Error('AAC audio track missing: '+JSON.stringify(audio));
if(!(Number(audio.duration||data.format?.duration)>0)) throw new Error('AAC audio track has no measurable duration');
const report={
  status:'PASS',
  paragraphs:paragraphs.length,
  voiceCues:timing.cueCount,
  slides:plan.length,
  slideFramesInspected:frameFiles.length,
  ocrFrames,
  forbiddenPhraseMatches:0,
  video:{width:video.width,height:video.height,fps:video.r_frame_rate,codec:video.codec_name},
  audioCodec:audio.codec_name,
  audioDurationSeconds:Number(audio.duration||data.format?.duration),
  sourceCoverage:'exact paragraph-by-paragraph concatenation'
};
await (await import('node:fs/promises')).writeFile(join(out,'qa-report.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
