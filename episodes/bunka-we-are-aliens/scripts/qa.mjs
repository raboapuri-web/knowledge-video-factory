import fs from 'node:fs';import path from 'node:path';import {spawnSync} from 'node:child_process';
const root=path.resolve(import.meta.dirname,'..'), out=path.join(root,'output');
const chapters=JSON.parse(fs.readFileSync(path.join(root,'src/generated/manifest.json')));
let failures=[];const visuals=[];
const cmd=(tool,args)=>{const r=spawnSync(tool,args,{encoding:'utf8',maxBuffer:8_000_000});return {code:r.status,text:(r.stdout||'')+'\n'+(r.stderr||'')}};
for(const item of chapters){
 const f=path.join(root,'src/generated',`chapter-${item.index}.json`);const data=JSON.parse(fs.readFileSync(f));
 for(const cue of data.cues){if(cue.group<0||cue.group>=6)failures.push(`chapter${item.index} invalid group`);
  for(const cap of cue.subs){if(cap.split('\n').length>2)failures.push('subtitle >2 lines');if(cap.split('\n').some(s=>s.length>34))failures.push('subtitle line too long '+item.index+': '+cap);}
 }
 const v=path.join(out,`aliens-chapter-${item.index}.mp4`);if(!fs.existsSync(v)){failures.push('missing rendered '+v);continue;}
 const probe=cmd('ffprobe',['-v','error','-show_entries','stream=codec_name,width,height,r_frame_rate','-of','json',v]);
 if(probe.code)failures.push('ffprobe failed ch'+item.index);else{
  const info=JSON.parse(probe.text);const video=info.streams.find(s=>s.codec_name==='h264');
  if(!video||video.width!==1920||video.height!==1080||video.r_frame_rate!=='30/1')failures.push('format ch'+item.index);
 }
 const black=cmd('ffmpeg',['-hide_banner','-i',v,'-vf','blackdetect=d=0.3:pix_th=0.1','-an','-f','null','-']);
 const count=[...black.text.matchAll(/black_start:/g)].length;
 const freeze=cmd('ffmpeg',['-hide_banner','-i',v,'-vf','freezedetect=n=-45dB:d=12','-an','-f','null','-']);
 visuals.push({chapter:item.index,blackEvents:count,freezeEvents:[...freeze.text.matchAll(/freeze_start:/g)].length});
}
const report={ok:failures.length===0,failures:[...new Set(failures)],visuals,generatedAt:new Date().toISOString()};
fs.writeFileSync(path.join(root,'qa/final-qa.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
if(failures.length)process.exitCode=1;
