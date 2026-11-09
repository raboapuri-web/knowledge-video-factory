import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {join} from 'node:path';

const ROOT=process.cwd();
const source=await readFile(join(ROOT,'content/narration-original.txt'),'utf8');
const paragraphs=source.split(/\n\s*\n/).map(x=>x.trim()).filter(Boolean);
if(paragraphs.length!==59) throw new Error('Expected 59 narration paragraphs, got '+paragraphs.length);
const speaker=13, speed=1.15, base='http://127.0.0.1:50021';
await mkdir(join(ROOT,'media/cues'),{recursive:true});
await mkdir(join(ROOT,'output'),{recursive:true});

function sentenceParts(p){
  const normalized=p.replace(/\r?\n/g,'');
  const parts=normalized.match(/[^。！？!?]+[。！？!?]?/g)||[normalized];
  if(parts.join('')!==normalized) throw new Error('Sentence split lost source text');
  return parts.filter(Boolean);
}
async function voice(text,index){
  const qUrl=new URL('/audio_query',base); qUrl.searchParams.set('text',text); qUrl.searchParams.set('speaker',String(speaker));
  const qr=await fetch(qUrl,{method:'POST'});
  if(!qr.ok) throw new Error('VOICEVOX audio_query '+qr.status+' cue '+index+': '+await qr.text());
  const query=await qr.json(); query.speedScale=speed;
  const sUrl=new URL('/synthesis',base); sUrl.searchParams.set('speaker',String(speaker));
  const sr=await fetch(sUrl,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(query)});
  if(!sr.ok) throw new Error('VOICEVOX synthesis '+sr.status+' cue '+index+': '+await sr.text());
  return Buffer.from(await sr.arrayBuffer());
}
function duration(file){
  const r=spawnSync('ffprobe',['-v','error','-show_entries','format=duration','-of','default=noprint_wrappers=1:nokey=1',file],{encoding:'utf8'});
  if(r.status!==0) throw new Error('ffprobe failed: '+r.stderr);
  return Number(r.stdout.trim());
}
const cues=[]; const paragraphRows=[]; let cueId=0;
for(let pi=0;pi<paragraphs.length;pi++){
  const text=paragraphs[pi].replace(/\r?\n/g,'');
  const parts=sentenceParts(paragraphs[pi]);
  const cueRows=[];
  for(const part of parts){
    cueId++;
    const file=join(ROOT,'media/cues',String(cueId).padStart(4,'0')+'.wav');
    const wav=await voice(part,cueId);
    await writeFile(file,wav);
    const seconds=duration(file);
    const cue={id:cueId,paragraph:pi+1,text:part,file:'media/cues/'+String(cueId).padStart(4,'0')+'.wav',duration:seconds};
    cues.push(cue); cueRows.push(cue);
    if(cueId%20===0) console.log('VOICE_CUES',cueId);
  }
  if(cueRows.map(c=>c.text).join('')!==text) throw new Error('Paragraph source mismatch at '+(pi+1));
  paragraphRows.push({id:pi+1,text,start:0,end:0,duration:cueRows.reduce((a,c)=>a+c.duration,0),cueIds:cueRows.map(c=>c.id)});
}
const concat=join(ROOT,'media/concat.txt');
await writeFile(concat,cues.map(c=>"file '"+join(ROOT,c.file)+"'").join('\n')+'\n');
const mix=spawnSync('ffmpeg',['-y','-f','concat','-safe','0','-i',concat,'-c:a','pcm_s16le',join(ROOT,'output/narration.wav')],{stdio:'inherit'});
if(mix.status!==0) throw new Error('Narration concat failed');
let cursor=0;
for(const p of paragraphRows){p.start=cursor;p.end=cursor+p.duration;cursor=p.end;}
let cueCursor=0;
for(const p of paragraphRows){
  for(const id of p.cueIds){const c=cues[id-1];c.start=cueCursor;c.end=cueCursor+c.duration;cueCursor=c.end;}
}
const slides=JSON.parse(await readFile(join(ROOT,'content/slide-plan.json'),'utf8'));
const perParagraph=new Map();
for(const s of slides) if(s.paragraphStart===s.paragraphEnd){
  const p=s.paragraphStart; perParagraph.set(p,(perParagraph.get(p)||0)+1);
}
const seen=new Map();
const slideRows=slides.map(s=>{
  const first=paragraphRows[s.paragraphStart-1], last=paragraphRows[s.paragraphEnd-1];
  if(!first||!last) throw new Error('Invalid paragraph mapping in slide '+s.id);
  let start=first.start,end=last.end;
  if(s.paragraphStart===s.paragraphEnd){
    const p=s.paragraphStart, idx=seen.get(p)||0, count=perParagraph.get(p)||1;
    seen.set(p,idx+1);
    const step=first.duration/count; start=first.start+step*idx; end=idx===count-1?first.end:first.start+step*(idx+1);
  }
  return {id:s.id,start,end,duration:end-start};
});
const measured={speaker,speed,paragraphCount:paragraphRows.length,cueCount:cues.length,slideCount:slides.length,duration:cursor,paragraphs:paragraphRows,cues,slides};
await writeFile(join(ROOT,'content/measured-timing.json'),JSON.stringify(measured,null,2));
console.log(JSON.stringify({paragraphs:paragraphRows.length,cues:cues.length,slides:slides.length,durationSeconds:Number(cursor.toFixed(2)),narration:'output/narration.wav'},null,2));