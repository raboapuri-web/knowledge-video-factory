import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const doc=JSON.parse(fs.readFileSync(path.join(root,'src/final-review-data.json'),'utf8'));
if(doc.status!=='all_160_shots_voicevox_measured_approved_original'||doc.fps!==30||
   doc.chapters?.length!==6||!(doc.durationFrames>0))
  throw Error('The six-chapter approved VOICEVOX manifest must be built before segment planning');
const maxFrames=+(process.env.TOYOKO_SEGMENT_MAX_FRAMES||2400);
if(!Number.isInteger(maxFrames)||maxFrames<300||maxFrames>5400)
  throw Error('Segment maximum must be an integer from 300 to 5400 frames');
const all=doc.chapters.flatMap(ch=>ch.beats.map(beat=>({
 id:beat.id,from:ch.from+beat.from,end:ch.from+beat.from+beat.frames,
 chapter:ch.chapterId
})));
if(all.length!==160||all[0].from!==0||all.some((b,i)=>b.end<=b.from||
   i>0&&b.from!==all[i-1].end))
  throw Error('Original storyboard frame timeline is not a gapless 160-shot sequence');
if(all.at(-1).end>doc.durationFrames)
  throw Error('Last storyboard cut extends beyond the movie');
const cuts=all.map(x=>x.end).filter(x=>x>0&&x<doc.durationFrames);
cuts.push(doc.durationFrames);
const segments=[];let start=0;
while(start<doc.durationFrames){
 const upper=Math.min(doc.durationFrames,start+maxFrames);
 // Prefer a cut boundary, so a shot's animation and caption are not needlessly
 // split between runners. Oversized shots are still safely cut on exact frames.
 const safe=cuts.filter(frame=>frame>start+Math.min(150,maxFrames/8)&&frame<=upper);
 const endExclusive=safe.length?safe.at(-1):upper;
 if(endExclusive<=start)throw Error('Segment planner did not advance');
 const id=String(segments.length).padStart(3,'0');
 segments.push({id,start,end:endExclusive-1,frames:endExclusive-start,
   boundaryShot:all.find(s=>s.end===endExclusive)?.id??null});
 start=endExclusive;
}
if(segments.length<2||segments.some((s,i)=>s.frames>maxFrames||s.frames<=0||
  i>0&&s.start!==segments[i-1].end+1)||segments.at(-1).end!==doc.durationFrames-1)
 throw Error('Segment coverage is not exact and gapless');
if(segments.length>256)throw Error('Exceeds GitHub Actions matrix capacity');
const output={version:1,film:'ToyokoFullMovie',fps:30,
 totalFrames:doc.durationFrames,totalShots:160,maxFrames,
 segmentCount:segments.length,segments};
const target=path.join(root,'out/segment-plan.json');
fs.mkdirSync(path.dirname(target),{recursive:true});
fs.writeFileSync(target,JSON.stringify(output,null,2)+'\n');
console.error('Parallel film: '+segments.length+' segments / '+doc.durationFrames+' frames / '+(doc.durationFrames/30).toFixed(2)+' seconds; no cut or frame dropped.');
process.stdout.write(JSON.stringify({include:segments})+'\n');
