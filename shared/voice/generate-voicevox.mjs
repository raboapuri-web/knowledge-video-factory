import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {applyPronunciationRules,loadPronunciationRules} from './apply-pronunciation.mjs';

export async function generateVoicevox(videoRoot,options={}){
  const root=path.resolve(videoRoot);
  const scriptPath=path.join(root,'src/script-data.json');
  const script=JSON.parse(fs.readFileSync(scriptPath,'utf8'));
  const audioDir=path.join(root,'public/audio');
  const tmp=path.join(root,'.voice-tmp');
  fs.mkdirSync(audioDir,{recursive:true});
  fs.mkdirSync(tmp,{recursive:true});

  const base=options.base||'http://127.0.0.1:50021';
  const speed=options.speed??1.04;
  const rules=loadPronunciationRules(options.dictionaryPath);
  const speakers=await fetch(`${base}/speakers`).then(r=>r.json());
  const speaker=speakers.find(s=>s.name===(options.speaker||'青山龍星'))??speakers[0];
  const style=speaker.styles.find(s=>s.name===(options.style||'ノーマル'))??speaker.styles[0];
  console.log(`VOICEVOX: ${speaker.name} / ${style.name} / ${style.id}`);

  const files=[];
  const timings=[];
  const pronunciationReport=[];
  let cursor=0;

  for(let i=0;i<script.beats.length;i++){
    const beat=script.beats[i];
    const sourceSpeech=beat.speech??beat.narration;
    const normalized=applyPronunciationRules(sourceSpeech,rules);
    const spoken=normalized.text;
    if(normalized.applied.length){
      pronunciationReport.push({id:beat.id,index:i,before:sourceSpeech,after:spoken,rules:normalized.applied});
      console.log(`[pronunciation] ${beat.id}: ${normalized.applied.join(', ')} | ${sourceSpeech} -> ${spoken}`);
    }

    const q=await fetch(`${base}/audio_query?speaker=${style.id}&text=${encodeURIComponent(spoken)}`,{method:'POST'}).then(r=>r.json());
    q.speedScale=speed;
    q.pitchScale=options.pitchScale??-0.02;
    q.intonationScale=options.intonationScale??0.86;
    q.volumeScale=options.volumeScale??0.96;
    q.prePhonemeLength=options.prePhonemeLength??0.09;
    q.postPhonemeLength=options.postPhonemeLength??0.11;

    const wav=Buffer.from(await fetch(`${base}/synthesis?speaker=${style.id}`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(q)}).then(r=>r.arrayBuffer()));
    const raw=path.join(tmp,`beat-${String(i).padStart(3,'0')}.wav`);
    const padded=path.join(tmp,`beat-${String(i).padStart(3,'0')}-pad.wav`);
    fs.writeFileSync(raw,wav);
    execFileSync('ffmpeg',['-y','-loglevel','error','-i',raw,'-af',`apad=pad_dur=${options.padDuration??0.18}`,padded]);
    const duration=Number(execFileSync('ffprobe',['-v','error','-show_entries','format=duration','-of','default=nw=1:nk=1',padded],{encoding:'utf8'}).trim());
    timings.push({id:beat.id,index:i,start:cursor,end:cursor+duration});
    cursor+=duration;
    files.push(padded);
  }

  const list=path.join(tmp,'concat.txt');
  fs.writeFileSync(list,files.map(f=>`file '${f.replaceAll("'","'\\''")}'`).join('\n'));
  const narrationWav=path.join(tmp,'narration.wav');
  execFileSync('ffmpeg',['-y','-loglevel','error','-f','concat','-safe','0','-i',list,'-c','copy',narrationWav]);
  const measured=Number(execFileSync('ffprobe',['-v','error','-show_entries','format=duration','-of','default=nw=1:nk=1',narrationWav],{encoding:'utf8'}).trim());

  fs.writeFileSync(path.join(root,'src/sync-timing.json'),JSON.stringify({durationSeconds:measured+0.25,beats:timings},null,2));
  fs.writeFileSync(path.join(audioDir,'pronunciation-report.json'),JSON.stringify({dictionaryVersion:1,changed:pronunciationReport},null,2));
  execFileSync('ffmpeg',['-y','-loglevel','error','-i',narrationWav,'-c:a','aac','-b:a','160k','-ar','48000',path.join(audioDir,'narration.m4a')]);
  console.log(`Narration duration: ${measured.toFixed(2)}s / pronunciation changes: ${pronunciationReport.length}`);
  return {durationSeconds:measured,pronunciationReport};
}
