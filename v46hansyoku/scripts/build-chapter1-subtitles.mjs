import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const script=JSON.parse(fs.readFileSync(path.join(root,'src/chapter1-script-data.json'),'utf8'));
const sync=JSON.parse(fs.readFileSync(path.join(root,'src/chapter1-sync-timing.json'),'utf8'));
if(sync.status!=='measured_voicevox_chapter1'||sync.beats.length!==36||script.beats.length!==36)throw Error('Missing measured Chapter1 VOICEVOX');
const stamp=t=>{let ms=Math.round(t*1000);return [Math.floor(ms/3600000),Math.floor(ms/60000)%60,Math.floor(ms/1000)%60].map(x=>String(x).padStart(2,'0')).join(':')+','+String(ms%1000).padStart(3,'0')};
function chunks(text){const parts=[];while(text.length){if(text.length<=28){parts.push(text);break;}const m=[...text.slice(0,29).matchAll(/[、。！？]/g)].reverse().find(x=>x.index>=10);const end=m?m.index+1:28;parts.push(text.slice(0,end));text=text.slice(end);}return parts;}
const out=[],cues=[];let seq=0;
for(let i=0;i<36;i++){const b=sync.beats[i],s=script.beats[i];if(b.id!==s.id||s.subtitle!==s.narration)throw Error('Subtitle mismatch '+s.id);
 const parts=chunks(s.subtitle);let used=0;for(const part of parts){const a=b.start+(b.end-b.start)*(used/s.subtitle.length);used+=part.length;const z=b.start+(b.end-b.start)*(used/s.subtitle.length);if(!(z>a))throw Error('Zero duration subtitle '+s.id);cues.push({sceneId:s.id,text:part,start:a,end:z});out.push(String(++seq)+'\n'+stamp(a)+' --> '+stamp(z)+'\n'+part+'\n');}
 if(parts.join('')!==s.narration)throw Error('Subtitle chars changed '+s.id);
}
fs.mkdirSync(path.join(root,'out'),{recursive:true});
fs.writeFileSync(path.join(root,'out/v46-chapter1.srt'),out.join('\n')+'\n');
fs.writeFileSync(path.join(root,'src/chapter1-subtitle-cues.json'),JSON.stringify({status:'measured_voicevox_chapter1',cues},null,2)+'\n');
console.log('Chapter1 exact subtitles: '+cues.length+' cues / 36 scenes.');