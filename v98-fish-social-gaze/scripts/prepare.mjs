import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';

const root=process.cwd();
const source=JSON.parse(fs.readFileSync('source.json','utf8'));
const audio=path.join(root,'voice');
fs.mkdirSync(audio,{recursive:true});
fs.mkdirSync('src',{recursive:true});
fs.mkdirSync('public/audio',{recursive:true});
const FPS=30;
const SILENCE=1.65;
const cut=(s,max=43)=>{
 const out=[];
 while(s.length>max){
  const part=s.slice(0,max+1);
  const marks=[...part.matchAll(/[、，,。！？!?；;：:]/g)].map(x=>x.index+1);
  const good=marks.filter(x=>x>=Math.floor(max*.56)&&x<=max);
  const n=good.length?good[good.length-1]:max;
  out.push(s.slice(0,n));s=s.slice(n);
 }
 if(s)out.push(s);
 return out;
};
const units=[];
for(let section=0;section<source.sections.length;section++){
 const act=source.sections[section];
 units.push({kind:'chapter',section,text:act.heading,subtitle:''});
 for(const paragraph of act.paragraphs){
  const chunks=cut(paragraph);
  if(chunks.join('')!==paragraph)throw Error('Original text mismatch');
  for(const chunk of chunks)units.push({kind:'narration',section,text:chunk,subtitle:chunk});
 }
}
const speak=(s)=>s.replaceAll('2.76','にてんななろく').replaceAll('2012年','にせんじゅうにねん').replaceAll('2011年','にせんじゅういちねん').replaceAll('2006年','にせんろくねん').replaceAll('100人','ひゃくにん').replaceAll('SNS','エスエヌエス').replaceAll('Googleマップ','グーグルマップ').replaceAll('アスタトティラピア・ブルトニ','アスタトティラピア・ブルトニ');
const run=(command,args)=>{const r=spawnSync(command,args,{encoding:'utf8',stdio:['ignore','pipe','pipe']});if(r.status!==0)throw Error(command+' '+args.join(' ')+'\n'+r.stderr);return r.stdout;};
const wait=ms=>new Promise(r=>setTimeout(r,ms));
async function post(url,body){
 for(let n=0;n<5;n++){try{
  const res=await fetch(url,{method:'POST',headers:body?{'Content-Type':'application/json'}:{},body:body?JSON.stringify(body):undefined});
  if(!res.ok)throw Error(url+' HTTP '+res.status+' '+(await res.text()).slice(0,200));
  return res;
 }catch(e){if(n===4)throw e;console.error('Retry',n+1,String(e));await wait(500*(n+1));}}
}
async function main(){
 const base='http://127.0.0.1:50021';
 const speakers=await (await fetch(base+'/speakers')).json();
 const available=speakers.flatMap(s=>s.styles.map(st=>({id:st.id,name:s.name,style:st.name})));
 const chosen=available.find(s=>s.id===13)||available.find(s=>s.name.includes('青山龍星'))||available[0];
 console.log('VOICEVOX speaker',chosen);
 const silence=path.join(audio,'silence.wav');
 run('ffmpeg',['-y','-loglevel','error','-f','lavfi','-i','anullsrc=r=24000:cl=mono','-t',String(SILENCE),'-c:a','pcm_s16le',silence]);
 const paths=[];
 for(let i=0;i<units.length;i++){
  const unit=units[i];
  const file=path.join(audio,String(i).padStart(4,'0')+'.wav');
  if(unit.kind==='chapter'){
   fs.copyFileSync(silence,file);
  }else if(!fs.existsSync(file)||fs.statSync(file).size<1000){
   const query=await (await post(base+'/audio_query?text='+encodeURIComponent(speak(unit.text))+'&speaker='+chosen.id)).json();
   query.speedScale=1.08;
   query.intonationScale=1.04;
   query.postPhonemeLength=.16;
   const syn=await post(base+'/synthesis?speaker='+chosen.id,query);
   fs.writeFileSync(file,Buffer.from(await syn.arrayBuffer()));
  }
  paths.push(file);
  if(i%30===0)console.log('Narrated',i,'/',units.length);
 }
 const timing=[];
 let t=0;
 for(let i=0;i<units.length;i++){
  const duration=Number(run('ffprobe',['-v','error','-show_entries','format=duration','-of','default=nw=1:nk=1',paths[i]]).trim());
  if(!(duration>0))throw Error('Bad voice duration '+i);
  const from=Math.round(t*FPS);t+=duration;
  const to=Math.round(t*FPS);
  timing.push({...units[i],id:'b'+String(i+1).padStart(4,'0'),index:i,from,durationFrames:Math.max(1,to-from)});
 }
 const manifest={title:source.title,fps:FPS,width:1920,height:1080,durationSeconds:t,totalFrames:Math.ceil(t*FPS)+3,beats:timing,headings:source.sections.map(x=>x.heading),voice:chosen};
 fs.writeFileSync('src/data.json',JSON.stringify(manifest,null,2));
 const list=paths.map(p=>"file '"+p.replaceAll("'","'\\''")+"'").join('\n');
 fs.writeFileSync('voice-list.txt',list);
 run('ffmpeg',['-y','-loglevel','error','-f','concat','-safe','0','-i','voice-list.txt','-c:a','aac','-b:a','192k','public/audio/narration.m4a']);
 const joined=units.filter(x=>x.kind==='narration').map(x=>x.text).join('');
 const original=source.sections.flatMap(x=>x.paragraphs).join('');
 if(joined!==original)throw Error('Narration is not the original script');
 fs.writeFileSync('preproduction-report.json',JSON.stringify({originalCharacters:original.length,paragraphs:source.sections.reduce((a,s)=>a+s.paragraphs.length,0),beats:timing.length,chapterCount:source.sections.length,durationSeconds:t,speaker:chosen},null,2));
 console.log('Prepared',timing.length,'motion beats',t.toFixed(1),'seconds');
}
main().catch(e=>{console.error(e);process.exit(1)});