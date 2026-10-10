import fs from 'node:fs';import path from 'node:path';import os from 'node:os';
const root=path.resolve(import.meta.dirname,'..');
const base=process.env.VOICEVOX_URL||'http://127.0.0.1:50021';
const workers=Math.max(1,Math.min(4,Number(process.env.VOICE_WORKERS||3)));
const ids=process.env.CHAPTERS?process.env.CHAPTERS.split(',').map(Number):[0,1,2,3,4,5,6];
const speakerList=await fetch(base+'/speakers').then(r=>{if(!r.ok)throw Error('VOICEVOX unavailable '+r.status);return r.json();});
const speaker=speakerList.find(v=>v.name==='青山龍星');
if(!speaker)throw new Error('Required VOICEVOX speaker 青山龍星 not installed');
const style=speaker.styles.find(v=>v.name==='ノーマル');
if(!style)throw new Error('Required VOICEVOX style ノーマル missing');
const partsDir=path.join(root,'media','parts');fs.mkdirSync(partsDir,{recursive:true});
const publicDir=path.join(root,'public/media');fs.mkdirSync(publicDir,{recursive:true});
const srtDir=path.join(root,'media/srt');fs.mkdirSync(srtDir,{recursive:true});
const groups=[];
for(const index of ids){const file=path.join(root,`src/generated/chapter-${index}.json`);const data=JSON.parse(fs.readFileSync(file,'utf8'));groups.push({index,file,data});}
function wavInfo(b){
 if(b.toString('ascii',0,4)!=='RIFF'||b.toString('ascii',8,12)!=='WAVE')throw Error('Invalid WAV from VOICEVOX');
 let pos=12,byteRate=0;
 while(pos+8<=b.length){const id=b.toString('ascii',pos,pos+4),size=b.readUInt32LE(pos+4),start=pos+8;
   if(id==='fmt '&&size>=16)byteRate=b.readUInt32LE(start+8);
   if(id==='data'){if(!byteRate)throw Error('Malformed WAV missing fmt');return {start,size,sizeOffset:pos+4,duration:size/byteRate,byteRate};}
   pos=start+size+size%2;
 }
 throw Error('No WAV data chunk');
}
function concatWav(buffers){const first=wavInfo(buffers[0]),header=Buffer.from(buffers[0].subarray(0,first.start));const pcm=Buffer.concat(buffers.map(b=>{const i=wavInfo(b);return b.subarray(i.start,i.start+i.size);}));const out=Buffer.concat([header,pcm]);out.writeUInt32LE(out.length-8,4);out.writeUInt32LE(pcm.length,first.sizeOffset);return out;}
async function synth(text){
 const q=await fetch(base+'/audio_query?text='+encodeURIComponent(text)+'&speaker='+style.id,{method:'POST'});
 if(!q.ok)throw new Error('VOICEVOX audio_query '+q.status);
 const query=await q.json();query.speedScale=1.15;query.pitchScale=-0.024;query.intonationScale=0.89;query.volumeScale=0.97;query.prePhonemeLength=0.08;query.postPhonemeLength=0.23;
 const a=await fetch(base+'/synthesis?speaker='+style.id,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(query)});
 if(!a.ok)throw new Error('VOICEVOX synthesis '+a.status);return Buffer.from(await a.arrayBuffer());
}
const tasks=groups.flatMap(g=>g.data.cues.map((cue,i)=>({g,i,cue})));
let at=0,done=0;const buffers=new Map();
async function worker(){while(true){const task=tasks[at++];if(!task)break;const partPath=path.join(partsDir,`ch${task.g.index}-beat${String(task.i).padStart(3,'0')}.wav`);let b;
 if(fs.existsSync(partPath))b=fs.readFileSync(partPath);
 else{b=await synth(task.cue.text);fs.writeFileSync(partPath,b);}
 const info=wavInfo(b); buffers.set(`${task.g.index}-${task.i}`,b);task.cue.duration=Number(info.duration.toFixed(5));done++;if(done%20===0)console.log(`[voice] ${done}/${tasks.length}`);
}}
await Promise.all(Array.from({length:workers},()=>worker()));
function silentWavLike(template,secs){
 const i=wavInfo(template);
 const h=Buffer.from(template.subarray(0,i.start));
 const align=template.readUInt16LE(32);
 const count=Math.round((secs*i.byteRate)/align)*align;
 const b=Buffer.concat([h,Buffer.alloc(count)]);
 b.writeUInt32LE(b.length-8,4);b.writeUInt32LE(count,i.sizeOffset);
 return b;
}
const fmt=t=>{const n=Math.max(0,Math.round(t*1000)),h=Math.floor(n/3600000),m=Math.floor(n%3600000/60000),s=Math.floor(n%60000/1000),ms=n%1000;return [h,m,s].map(x=>String(x).padStart(2,'0')).join(':')+','+String(ms).padStart(3,'0');};
const report=[];
for(const g of groups){
 const arr=g.data.cues.map((_,i)=>buffers.get(`${g.index}-${i}`));
 const introSeconds=g.index===0?0:2.5;
 fs.writeFileSync(path.join(publicDir,`chapter-${g.index}.wav`),concatWav(introSeconds?[silentWavLike(arr[0],introSeconds),...arr]:arr));
 let t=introSeconds,seq=0;const captions=[];
 for(const cue of g.data.cues){const weights=cue.subs.map(s=>s.replace(/\n/g,'').length);const total=weights.reduce((a,b)=>a+b,0);
  for(let i=0;i<cue.subs.length;i++){const d=cue.duration*weights[i]/total; captions.push(`${++seq}\n${fmt(t)} --> ${fmt(t+d)}\n${cue.subs[i]}\n`);t+=d;}
 }
 fs.writeFileSync(path.join(srtDir,`chapter-${g.index}.srt`),captions.join('\n'));
 fs.writeFileSync(g.file,JSON.stringify(g.data,null,2));
 report.push({chapter:g.index,beats:g.data.cues.length,seconds:Number(t.toFixed(3)),introSeconds,subtitles:seq,speaker:speaker.name,style:style.name});
}
fs.mkdirSync(path.join(root,'qa'),{recursive:true});fs.writeFileSync(path.join(root,'qa/voice-report.json'),JSON.stringify({measured:true,voiceScale:1.15,chapters:report},null,2));
console.log(JSON.stringify(report,null,2));
