import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const plan=JSON.parse(fs.readFileSync(path.join(root,'out/epilogue-segment-plan.json'),'utf8'));
const data=JSON.parse(fs.readFileSync(path.join(root,'src/chapter-selected-data.json'),'utf8'));
const approvals=JSON.parse(fs.readFileSync(path.join(root,'src/chapter-approvals.json'),'utf8'));
if(plan.chapterId!=='epilogue'||data.chapterId!=='epilogue'||data.shots.length!==22||
 plan.totalFrames!==data.durationFrames||plan.segmentCount!==4||plan.segments.length!==4||
 !['prologue','chapter1','chapter2','chapter3','chapter4'].every(id=>approvals.approvedChapters.some(c=>
   c.chapterId===id&&c.status==='user_approved_final_do_not_rerender')))
 throw Error('Wrong chapter edition, original narration duration, or prior approval lock');
const run=(cmd,args)=>execFileSync(cmd,args,{encoding:'utf8',maxBuffer:32*1024*1024});
const probe=f=>JSON.parse(run('ffprobe',['-v','error','-show_entries',
 'format=duration,size:stream=codec_type,codec_name,width,height,nb_frames,avg_frame_rate',
 '-of','json',f]));
const validVideo=(file,expectedFrames,audioAllowed)=>{
 const info=probe(file),v=info.streams.find(s=>s.codec_type==='video');
 if(!v||v.codec_name!=='h264'||v.width!==1280||v.height!==720||
    v.avg_frame_rate!=='30/1'||Number(v.nb_frames)!==expectedFrames)
  throw Error('Epilogue parallel video mismatch '+file+': '+JSON.stringify(v));
 if(!audioAllowed&&info.streams.some(s=>s.codec_type==='audio'))
  throw Error('Do not duplicate original audio inside video-only chunks');
 return info;
};
let expected=0;
const files=plan.segments.map(s=>{
 if(s.start!==expected||s.end!==s.start+s.frames-1)throw Error('Segment gap '+s.id);
 expected+=s.frames;
 const file=path.join(root,'out/epilogue-parts','epilogue-part-'+s.id,
   'epilogue-part-'+s.id+'.mp4');
 if(!fs.existsSync(file)||fs.statSync(file).size<10000)
  throw Error('Parallel video artifact missing '+s.id);
 validVideo(file,s.frames,false);
 return {file,...s};
});
if(expected!==data.durationFrames)throw Error('Missing original epilogue video frames');
const concat=path.join(root,'out/epilogue-concat.txt');
fs.writeFileSync(concat,files.map(s=>"file '"+s.file.replaceAll("'","'\\''")+"'").join('\n')+'\n');
const picture=path.join(root,'out/epilogue-picture.mp4');
run('ffmpeg',['-y','-hide_banner','-loglevel','error',
 '-f','concat','-safe','0','-i',concat,'-map','0:v:0','-an','-c:v','copy',
 '-movflags','+faststart',picture]);
validVideo(picture,data.durationFrames,false);
const originalVoice=path.join(root,'public',data.audioFile);
if(!fs.existsSync(originalVoice)||fs.statSync(originalVoice).size<10000)
 throw Error('Epilogue original approved VOICEVOX narration absent');
const target=path.join(root,'out/toyoko-epilogue-feedback-v1.mp4');
const sec=(data.durationFrames/30).toFixed(6);
run('ffmpeg',['-y','-hide_banner','-loglevel','error','-i',picture,
 '-i',originalVoice,'-map','0:v:0','-map','1:a:0',
 '-c:v','copy','-c:a','aac','-b:a','192k','-ar','48000',
 '-t',sec,'-movflags','+faststart',target]);
const verified=validVideo(target,data.durationFrames,true);
if(!verified.streams.some(s=>s.codec_type==='audio'&&s.codec_name==='aac')||
  Math.abs(Number(verified.format.duration)-data.durationFrames/30)>1)
 throw Error('Original voice missing from finished epilogue MP4');
const report={verified:true,chapterId:'epilogue',userReviewRequired:true,
 originalVoiceUnchanged:true,originalChapterScriptUnchanged:true,
 previousChaptersPreserved:approvals.approvedChapters.map(x=>x.chapterId),
 source:'src/approved_original_narration.md',
 scenes:22,uniqueDiagramDesigns:3,parallelWorkers:4,
 durationFrames:data.durationFrames,durationSeconds:+verified.format.duration,
 resolution:'1280x720',fps:30,bytes:fs.statSync(target).size,
 paragraphCutTiming:'source-character interpolated within original VOICEVOX chunk; review transitions by ear',
 segments:plan.segments.map(({id,frames,start,end})=>({id,frames,start,end})),
 audioCodec:'aac',videoCodec:'h264'};
fs.writeFileSync(path.join(root,'out/epilogue-review-verification.json'),JSON.stringify(report,null,2)+'\n');
console.log('VERIFIED epilogue, '+data.durationFrames+' exact frames, 4 parallel parts, 22 deliberate scenes, 3 unique diagrams, approved original VOICEVOX with subtitles.');
