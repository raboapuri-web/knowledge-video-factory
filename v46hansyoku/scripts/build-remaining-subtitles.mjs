import fs from 'node:fs';
import path from 'node:path';
const chapter=process.argv[2];if(!['chapter2','chapter3','chapter4','epilogue'].includes(chapter))throw Error('chapter arg required');
const root=path.resolve(import.meta.dirname,'..');
const script=JSON.parse(fs.readFileSync(path.join(root,'src',chapter+'-script-data.json'),'utf8'));
const sync=JSON.parse(fs.readFileSync(path.join(root,'src',chapter+'-sync-timing.json'),'utf8'));
if(sync.status!=='measured_voicevox_'+chapter||sync.beats.length!==script.beats.length)throw Error('missing measured voice '+chapter);
const stamp=t=>{let ms=Math.round(t*1000);return [Math.floor(ms/3600000),Math.floor(ms/60000)%60,Math.floor(ms/1000)%60].map(x=>String(x).padStart(2,'0')).join(':')+','+String(ms%1000).padStart(3,'0')};
function chunks(text){const out=[];while(text.length){if(text.length<=28){out.push(text);break;}const m=[...text.slice(0,29).matchAll(/[、。！？]/g)].reverse().find(x=>x.index>=10);const end=m?m.index+1:28;out.push(text.slice(0,end));text=text.slice(end);}return out;}
const cues=[],srt=[];let seq=0;
for(let i=0;i<script.beats.length;i++){
 const s=script.beats[i],b=sync.beats[i];if(s.id!==b.id||s.subtitle!==s.narration)throw Error('subtitle mismatch '+s.id);
 const parts=chunks(s.subtitle);let used=0;
 for(const part of parts){const a=b.start+(b.end-b.start)*(used/s.subtitle.length);used+=part.length;const z=b.start+(b.end-b.start)*(used/s.subtitle.length);cues.push({sceneId:s.id,text:part,start:a,end:z});srt.push(String(++seq)+'\n'+stamp(a)+' --> '+stamp(z)+'\n'+part+'\n');}
 if(parts.join('')!==s.narration)throw Error('subtitle chars changed '+s.id);
}
fs.mkdirSync(path.join(root,'out'),{recursive:true});
fs.writeFileSync(path.join(root,'out','v46-'+chapter+'.srt'),srt.join('\n')+'\n');
fs.writeFileSync(path.join(root,'src',chapter+'-subtitle-cues.json'),JSON.stringify({status:'measured_voicevox_'+chapter,cues},null,2)+'\n');
console.log(chapter+' subtitles: '+cues.length+' cues / '+script.beats.length+' scenes');
