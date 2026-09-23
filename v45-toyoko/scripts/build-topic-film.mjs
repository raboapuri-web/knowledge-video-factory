import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const approved=fs.readFileSync(path.join(root,'src/approved_original_narration.md'),'utf8').trimEnd();
const headings=[...approved.matchAll(/^# 【(.+?)】$/gm)];
const parts=headings.map((h,i)=>approved.slice(h.index,headings[i+1]?.index??approved.length)
 .split('\n').map(p=>p.trim()).filter(p=>p&&!p.startsWith('#')&&!p.startsWith('約')&&!p.startsWith('---')));
const plan=read('src/topic-blocks.json');
const movie=read('src/final-review-data.json');
if(parts.length!==6||plan.blocks.length!==25||movie.chapters.length!==6||
 movie.status!=='all_160_shots_voicevox_measured_approved_original'||movie.fps!==30)
 throw Error('Missing full approved 6-chapter audio or 25 topical blocks');

const unique=new Set();
const result=[];
for(let chapterIndex=0;chapterIndex<6;chapterIndex++){
 const chapter=movie.chapters[chapterIndex],id=chapter.chapterId;
 if(id!==plan.chapterOrder[chapterIndex]||plan.sourceParagraphCounts[chapterIndex]!==parts[chapterIndex].length)
  throw Error('Current narration differs from source used to approve block plan: '+id);
 const paragraphs=parts[chapterIndex];
 const concat=paragraphs.join('');
 // Each old narration beat is guaranteed to contain its source fragments in original
 // order, but an old beat can start/end IN a paragraph (prologue P02/P03).
 let cursor=0;
 const clips=chapter.beats.map(b=>{
  const speech=b.sourceFragments.join('');
  if(concat.slice(cursor,cursor+speech.length)!==speech)
    throw Error('Previously voiced approved-source paragraph sequence differs: '+id+' '+b.id);
  const r={charStart:cursor,charEnd:cursor+speech.length,startFrame:b.from,endFrame:b.from+b.frames};
  cursor+=speech.length;return r;
 });
 if(cursor!==concat.length)throw Error('Original narration incomplete in reused voice: '+id);
 const offsets=[0];for(const para of paragraphs)offsets.push(offsets.at(-1)+para.length);
 const timeOf=charOffset=>{
  if(charOffset===concat.length)return clips.at(-1).endFrame;
  const c=clips.find(x=>charOffset>=x.charStart&&charOffset<x.charEnd);
  if(!c)throw Error('Character/audio offset mismatch at '+charOffset+' in '+id);
  return Math.round(c.startFrame+(charOffset-c.charStart)/(c.charEnd-c.charStart)*(c.endFrame-c.startFrame));
 };
 // Approximation is explicitly recorded: segment boundaries inside a previous
 // VOICEVOX beat use source-character interpolation, not phoneme forced alignment.
 const frameMarks=offsets.map(timeOf);
 if(frameMarks[0]!==0||frameMarks.some((f,i)=>i>0&&f<=frameMarks[i-1]))
  throw Error('Source paragraph/VOICEVOX boundary collapsed or reordered in '+id);
 let prevPara=0;
 const blocks=plan.blocks.filter(b=>b.chapterId===id).map(b=>{
  const [from,to]=b.sourceParagraphRange;
  if(from!==prevPara+1||to>paragraphs.length)throw Error('Topical block source gap '+b.blockId);
  if(b.sourceFirstParagraph!==paragraphs[from-1]||b.sourceLastParagraph!==paragraphs[to-1])
   throw Error('Block source was edited since original approved script: '+b.blockId);
  prevPara=to;let prevSegment=from-1;
  const segments=b.visualSegments.map((g,i)=>{
   if(g.fromParagraph!==prevSegment+1||g.toParagraph>to||g.toParagraph<g.fromParagraph)
    throw Error('Visual segment gap/overlap '+b.blockId+'-'+i);
   prevSegment=g.toParagraph;
   const start=frameMarks[g.fromParagraph-1],end=frameMarks[g.toParagraph];
   if(end<=start)throw Error('Visual clip duration is nonpositive '+b.blockId);
   unique.add(b.blockId);
   return {...g,id:b.blockId+'-S'+String(i+1).padStart(2,'0'),
    startFrame:start,endFrame:end,durationFrames:end-start,
    sourceExactText:paragraphs.slice(g.fromParagraph-1,g.toParagraph).join('\n')};
  });
  if(prevSegment!==to)throw Error('Block visual segment source incomplete '+b.blockId);
  return {blockId:b.blockId,topic:b.topic,primaryCategory:b.primaryCategory,
   sourceParagraphRange:b.sourceParagraphRange,
   startFrame:segments[0].startFrame,endFrame:segments.at(-1).endFrame,segments};
 });
 if(prevPara!==paragraphs.length)throw Error('Chapter original narration source not fully covered '+id);
 const segments=blocks.flatMap(b=>b.segments);
 if(segments[0].startFrame!==0||segments.some((g,i)=>i>0&&g.startFrame!==segments[i-1].endFrame)||
    segments.at(-1).endFrame!==chapter.beats.at(-1).from+chapter.beats.at(-1).frames)
  throw Error('Topical screens fail gapless coverage of actual VOICEVOX beats: '+id);
 result.push({chapterId:id,from:chapter.from,durationFrames:chapter.durationFrames,
  audioFile:chapter.audioFile,beats:chapter.beats.map(b=>({id:b.id,from:b.from,frames:b.frames,text:b.text,caption:b.caption})),
  blocks,paragraphTimingMethod:'interpolate source-character positions inside earlier voice beats; verify transitions by ear'});
}
if(unique.size!==25||result.reduce((n,c)=>n+c.blocks.reduce((m,b)=>m+b.segments.length,0),0)!==82)
 throw Error('Incomplete 25-block/82-segment mapping');
const doc={schemaVersion:'2.1-topic-block-voice-retained',sourceOfTruth:'src/approved_original_narration.md',
 status:'topic_visual_edit_render_ready',legacyScenePlan:'src/toyoko_scene_plan.json',
 timingCaveat:'Within previously synthesized VOICEVOX beats, paragraph boundaries are approximated by source-character ratio and are not forced aligned. Topic-level scene correspondence takes priority over literal sentence-level sync.',
 fps:30,durationFrames:movie.durationFrames,chapters:result};
fs.writeFileSync(path.join(root,'src/topic-film-data.json'),JSON.stringify(doc,null,2)+'\n');
fs.mkdirSync(path.join(root,'out'),{recursive:true});
fs.writeFileSync(path.join(root,'out/topic-block-coverage.json'),JSON.stringify({
 topicBlocks:25,visualSegments:82,chapters:6,sourceParagraphs:parts.map(x=>x.length),
 allOriginalNarrationReused:true,perChapter:result.map(c=>({chapterId:c.chapterId,
   blocks:c.blocks.length,segments:c.blocks.flatMap(b=>b.segments).length,
   seconds:c.durationFrames/30})),durationFrames:movie.durationFrames,
 timingCaveat:doc.timingCaveat},null,2)+'\n');
console.log('VIDEO READY: 25 topic blocks, 82 topic-matched visual segments, original 6-chapter narration unchanged, '+movie.durationFrames+' frames.');
