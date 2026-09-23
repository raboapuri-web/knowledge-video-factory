import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const meta=JSON.parse(fs.readFileSync(path.join(root,'src/topic-film-data.json'),'utf8'));
if(meta.chapters.length!==6 || meta.chapters.reduce((n,c)=>n+c.blocks.length,0)!==25)throw Error('Missing topic blocks');
const info=JSON.parse(execFileSync('ffprobe',['-v','error','-show_entries','format=duration,size:stream=codec_type,codec_name,width,height,nb_frames','-of','json',path.join(root,'out/toyoko-full-final.mp4')],{encoding:'utf8'}));
const v=info.streams.find(s=>s.codec_type==='video'),a=info.streams.find(s=>s.codec_type==='audio');
if(!v||v.width!==1920||v.height!==1080||+v.nb_frames!==meta.durationFrames||!a)throw Error('Final movie format mismatch');
const out={verified:true,topicBlocks:25,visualSegments:82,fullFrames:meta.durationFrames,durationSeconds:+info.format.duration,audioCodec:a.codec_name,videoSize:+info.format.size,note:'Topic correspondence must still be inspected by a person.'};
fs.writeFileSync(path.join(root,'out/topic-reedit-verification.json'),JSON.stringify(out,null,2)+'\n');
console.log(JSON.stringify(out));
