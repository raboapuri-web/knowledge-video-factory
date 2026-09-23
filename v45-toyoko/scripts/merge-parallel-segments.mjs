import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync,execFileSync} from 'node:child_process';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const run=(command,args)=>{
 const p=spawnSync(command,args,{encoding:'utf8',maxBuffer:16*1024*1024});
 if(p.error||p.status!==0)throw Error(command+' failed: '+args.join(' ')+'\n'+(p.stderr||p.error||p.stdout));
 return p.stdout;
};
const probe=(file)=>{
 const json=run('ffprobe',['-v','error','-show_entries',
  'format=duration,size:stream=codec_type,codec_name,width,height,avg_frame_rate,nb_frames',
  '-of','json',file]);
 return JSON.parse(json);
};
const exactFrames=(info)=>{
 const v=info.streams?.find(s=>s.codec_type==='video');
 if(!v||v.codec_name!=='h264'||v.width!==1920||v.height!==1080||v.avg_frame_rate!=='30/1')
  throw Error('H264 1920x1080 30fps codec mismatch; do not concatenate incompatible segments');
 const n=Number(v.nb_frames);
 if(!Number.isSafeInteger(n)||n<=0)throw Error('MP4 does not expose an exact positive frame count');
 return n;
};
const film=JSON.parse(fs.readFileSync(path.join(root,'src/final-review-data.json'),'utf8'));
const manifest=JSON.parse(fs.readFileSync(path.join(root,'out/segment-plan.json'),'utf8'));
if(film.status!=='all_160_shots_voicevox_measured_approved_original'||
   manifest.totalFrames!==film.durationFrames||manifest.totalShots!==160||
   manifest.fps!==30||manifest.segmentCount!==manifest.segments.length)
 throw Error('Parallel segment plan does not match approved original 160-shot film');
const parts=path.join(root,'out/parallel-parts');
let frame=0;
const output=[];
for(const segment of manifest.segments){
 if(segment.start!==frame||segment.end!==segment.start+segment.frames-1)
  throw Error('Gap or overlap in segment plan at '+segment.id);
 const filename='toyoko-part-'+segment.id+'.mp4';
 const file=path.join(parts,'toyoko-part-'+segment.id,filename);
 if(!fs.existsSync(file)||fs.statSync(file).size<5000)
  throw Error('Missing segment artifact '+segment.id+' at '+file);
 const measured=exactFrames(probe(file));
 if(measured!==segment.frames)
  throw Error('Rendered segment '+segment.id+' has '+measured+' frames; expected '+segment.frames);
 if(probe(file).streams.some(s=>s.codec_type==='audio'))
  throw Error('Segments must be VIDEO-ONLY; original approved narration is applied just once at final mux');
 frame+=measured;
 output.push({id:segment.id,file,frames:measured,start:segment.start,end:segment.end});
}
if(frame!==film.durationFrames)throw Error('Segment frame coverage '+frame+' != '+film.durationFrames);
const safeFile=s=>s.replaceAll("'","'\\''");
const concat=path.join(root,'out/parallel-concat.txt');
fs.writeFileSync(concat,output.map(x=>"file '"+safeFile(x.file)+"'").join('\n')+'\n');
const picture=path.join(root,'out/parallel-picture-only.mp4');
run('ffmpeg',['-y','-hide_banner','-loglevel','error',
 '-f','concat','-safe','0','-i',concat,'-map','0:v:0','-an',
 '-c:v','copy','-movflags','+faststart',picture]);
if(exactFrames(probe(picture))!==film.durationFrames)
 throw Error('Lossless concatenation changed the exact movie frame count');
const ids=['prologue','chapter1','chapter2','chapter3','chapter4','epilogue'];
if(film.chapters.length!==6||film.chapters.some((c,i)=>c.chapterId!==ids[i])||
   film.chapters.reduce((n,c)=>n+c.beats.length,0)!==160)
 throw Error('Full original six-chapter narration metadata is incomplete');
const seconds=film.durationFrames/film.fps;
const audioFiles=film.chapters.map(c=>{
 const file=path.join(root,'public',c.audioFile);
 if(!fs.existsSync(file)||fs.statSync(file).size<2000)
   throw Error('Approved chapter narration absent: '+c.chapterId);
 return file;
});
const filters=film.chapters.map((c,i)=>{
 const offset=Math.round(c.from/film.fps*1000);
 return '['+(i+1)+':a]adelay='+offset+':all=1[a'+i+']';
});
filters.push(film.chapters.map((_,i)=>'[a'+i+']').join('')+
 'amix=inputs=6:duration=longest:dropout_transition=0,'+
 'apad,atrim=0:'+seconds.toFixed(6)+',asetpts=N/SR/TB[master]');
const target=path.join(root,'out/toyoko-full-final.mp4');
run('ffmpeg',['-y','-hide_banner','-loglevel','error','-i',picture,
 ...audioFiles.flatMap(f=>['-i',f]),
 '-filter_complex',filters.join(';'),'-map','0:v:0','-map','[master]',
 '-c:v','copy','-c:a','aac','-b:a','192k','-ar','48000',
 '-t',seconds.toFixed(6),'-movflags','+faststart',target]);
const finished=probe(target);
if(exactFrames(finished)!==film.durationFrames||
   !finished.streams.some(x=>x.codec_type==='audio'&&x.codec_name==='aac')||
   Math.abs(Number(finished.format.duration)-seconds)>1)
 throw Error('Final movie failed exact frame/audio/duration verification');
const report={verified:true,method:'shot-boundary-preferred parallel Remotion rendering; stream-copy video concatenation; approved chapter audio aligned by source frame offset',
 sourceOriginal:'src/approved_original_narration.md',sceneCount:60,cutCount:160,
 output:'out/toyoko-full-final.mp4',dimensions:'1920x1080',fps:30,
 totalFrames:film.durationFrames,durationSeconds:seconds,
 segmentCount:output.length,segments:output.map(({id,frames,start,end})=>({id,frames,start,end})),
 audioChapters:film.chapters.map(c=>({chapterId:c.chapterId,fromFrame:c.from,originalVoiceSeconds:c.actualVoiceSeconds})),
 finalFileSize:fs.statSync(target).size};
fs.writeFileSync(path.join(root,'out/parallel-merge-verification.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({verified:true,segments:output.length,totalFrames:film.durationFrames,seconds,fileBytes:report.finalFileSize},null,2));
