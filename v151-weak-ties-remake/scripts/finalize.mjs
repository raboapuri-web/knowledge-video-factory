import {mkdir,readFile,writeFile,stat} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {join} from 'node:path';

const ROOT=process.cwd(), out=join(ROOT,'output');
await mkdir(out,{recursive:true});
const timing=JSON.parse(await readFile(join(ROOT,'content/measured-timing.json'),'utf8'));
const video=join(out,'v151-weak-ties-video.mp4');
const voice=join(out,'narration.wav');
const final=join(out,'final.mp4');
const run=(command,args,label)=>{
  const r=spawnSync(command,args,{encoding:'utf8'});
  if(r.error) throw r.error;
  if(r.status!==0) throw new Error(label+': '+(r.stderr||r.stdout||'exit '+r.status));
  return r;
};
function stamp(sec){
  const ms=Math.max(0,Math.round(sec*1000));
  const h=Math.floor(ms/3600000),m=Math.floor(ms%3600000/60000),s=Math.floor(ms%60000/1000),z=ms%1000;
  return [h,m,s].map(x=>String(x).padStart(2,'0')).join(':')+','+String(z).padStart(3,'0');
}
const cues=timing.cues;
let srt='';
for(const c of cues) srt+=(c.id+'\n'+stamp(c.start)+' --> '+stamp(c.end)+'\n'+c.text+'\n\n');
await writeFile(join(out,'subtitles.srt'),srt);

const duration=timing.duration;
const bgm=join(out,'original-ambient.wav');
let bgmStatus='generated';
const bgmArgs=[
  '-y','-f','lavfi','-i','anoisesrc=color=pink:amplitude=0.12:sample_rate=48000',
  '-f','lavfi','-i','sine=frequency=55:sample_rate=48000',
  '-t',String(duration),
  '-filter_complex',`[0:a]lowpass=f=850,volume=0.12[n];[1:a]volume=0.025[s];[n][s]amix=inputs=2:duration=first,afade=t=in:st=0:d=8,afade=t=out:st=${Math.max(0,duration-10)}:d=10[a]`,
  '-map','[a]','-c:a','pcm_s16le',bgm
];
const b=spawnSync('ffmpeg',bgmArgs,{encoding:'utf8'});
if(b.error||b.status!==0){
  bgmStatus='not generated; final video will contain narration only';
  console.error('BGM_GENERATION_ERROR',b.stderr||b.error);
}
const voiceInfo=await stat(voice);
if(voiceInfo.size===0) throw new Error('Narration WAV is empty');
if(bgmStatus==='generated'){
  const bgmInfo=await stat(bgm);
  if(bgmInfo.size===0) throw new Error('Generated ambient BGM WAV is empty');
  run('ffmpeg',[
    '-y','-i',video,'-i',voice,'-i',bgm,
    '-filter_complex','[1:a:0]aresample=48000,volume=1.0[v];[2:a:0]aresample=48000,volume=0.18[b];[v][b]amix=inputs=2:duration=first:dropout_transition=2[a]',
    '-map','0:v:0','-map','[a]',
    '-c:v','copy','-c:a','aac','-b:a','192k',
    '-shortest','-movflags','+faststart',final
  ],'Final audio/BGM mix failed');
}else{
  run('ffmpeg',[
    '-y','-i',video,'-i',voice,
    '-map','0:v:0','-map','1:a:0',
    '-c:v','copy','-c:a','aac','-b:a','192k',
    '-shortest','-movflags','+faststart',final
  ],'Narration mux failed');
}

// Verify the actual mux output before allowing contact-sheet/QA steps to run.
const probe=run('ffprobe',[
  '-v','error',
  '-show_entries','stream=codec_type,codec_name,width,height,r_frame_rate,duration',
  '-show_entries','format=duration,size',
  '-of','json',final
],'Final MP4 ffprobe verification failed');
const probeData=JSON.parse(probe.stdout);
const streams=probeData.streams||[];
const videoStream=streams.find(s=>s.codec_type==='video');
const audioStream=streams.find(s=>s.codec_type==='audio');
if(!videoStream||videoStream.codec_name!=='h264'||videoStream.width!==1920||videoStream.height!==1080||videoStream.r_frame_rate!=='30/1'){
  throw new Error('Final MP4 video stream verification failed: '+JSON.stringify(videoStream));
}
if(!audioStream||audioStream.codec_name!=='aac'){
  throw new Error('Final MP4 AAC audio verification failed: '+JSON.stringify(audioStream));
}
if(!(Number(audioStream.duration||probeData.format?.duration)>0)){
  throw new Error('Final MP4 audio stream has no measurable duration');
}
const finalInfo=await stat(final);
if(finalInfo.size===0) throw new Error('Final MP4 is empty');
console.log('FINAL_MP4_STREAMS_VERIFIED',JSON.stringify({video:videoStream,audio:audioStream,bytes:finalInfo.size}));

const report={
  title:'なぜ親友より、たまに会う知人の方が人生を変えるのか？',
  video:final,
  resolution:'1920x1080',
  fps:30,
  videoCodec:videoStream.codec_name,
  audioCodec:audioStream.codec_name,
  voice:'VOICEVOX 青山龍星 speaker 13',
  speedScale:1.15,
  paragraphs:timing.paragraphCount,
  cues:timing.cueCount,
  slides:timing.slideCount,
  durationSeconds:duration,
  bgm:bgmStatus,
  narrationText:'content/narration-original.txt'
};
await writeFile(join(out,'production-report.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
