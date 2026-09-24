import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const script=JSON.parse(fs.readFileSync(path.join(root,'src/script-data.json'),'utf8'));
const sync=JSON.parse(fs.readFileSync(path.join(root,'src/sync-timing.json'),'utf8'));
if(sync.status!=='measured_voicevox_approved_script'||sync.beats.length!==32||script.beats.length!==32)throw Error('Missing exact approved measured VOICEVOX');
const stamp=t=>{let ms=Math.round(t*1000);return [Math.floor(ms/3600000),Math.floor(ms/60000)%60,Math.floor(ms/1000)%60].map(x=>String(x).padStart(2,'0')).join(':')+','+String(ms%1000).padStart(3,'0')};
function chunks(text){const parts=[];while(text.length){if(text.length<=28){parts.push(text);break;}const m=[...text.slice(0,29).matchAll(/[、。！？]/g)].reverse().find(x=>x.index>=10);const end=m?m.index+1:28;parts.push(text.slice(0,end));text=text.slice(end);}return parts;}
const out=[],cues=[];let seq=0;
for(let i=0;i<32;i++){const b=sync.beats[i],s=script.beats[i];if(b.id!==s.id||s.subtitle!==s.narration)throw Error('Subtitle mismatch '+s.id);
 const parts=chunks(s.subtitle);let used=0;for(const part of parts){const a=b.start+(b.end-b.start)*(used/s.subtitle.length);used+=part.length;const z=b.start+(b.end-b.start)*(used/s.subtitle.length);if(!(z>a))throw Error('Zero duration subtitle '+s.id);const cue={sceneId:s.id,text:part,start:a,end:z};cues.push(cue);out.push(String(++seq)+'\n'+stamp(a)+' --> '+stamp(z)+'\n'+part+'\n');}
 if(parts.join('')!==s.narration)throw Error('Subtitle characters changed '+s.id);
}
fs.mkdirSync(path.join(root,'out'),{recursive:true});fs.writeFileSync(path.join(root,'out/v46-prologue.srt'),out.join('\n')+'\n');fs.writeFileSync(path.join(root,'src/subtitle-cues.json'),JSON.stringify({cues},null,2)+'\n');console.log('Exact script subtitles: '+cues.length+' cues / 32 scenes. Within-scene timing is apportioned by character length; no forced alignment.');
