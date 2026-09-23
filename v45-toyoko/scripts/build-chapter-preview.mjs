import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const id=process.argv[2]||'prologue';
if(!/^(?:prologue|chapter[1-4]|epilogue)$/.test(id))throw Error('Unknown chapter '+id);
const edit=read('src/chapter-edits/'+id+'.json');
const master=read('src/final-review-data.json');
const chapter=master.chapters.find(c=>c.chapterId===id);
const legacy=read('src/toyoko_scene_plan.json');
const byRef=new Map(legacy.scenes.filter(s=>s.chapterId===id).flatMap(s=>s.shots.map(shot=>[shot.shotId,shot])));
if(!chapter||master.fps!==30||edit.chapterId!==id||!edit.shots?.length)
 throw Error('Missing previously approved chapter audio or editorial shot list: '+id);
const original=fs.readFileSync(path.join(root,'src/approved_original_narration.md'),'utf8').trimEnd();
const headings=[...original.matchAll(/^# 【(.+?)】$/gm)];
const order=['prologue','chapter1','chapter2','chapter3','chapter4','epilogue'];
const index=order.indexOf(id);
const paragraphs=original.slice(headings[index].index,headings[index+1]?.index??original.length)
 .split('\n').map(s=>s.trim()).filter(s=>s&&!s.startsWith('#')&&!s.startsWith('約')&&!s.startsWith('---'));
const speech=paragraphs.join('');
let oldOffset=0;
const audioBeats=chapter.beats.map(b=>{
 const t=b.sourceFragments.join('');
 if(speech.slice(oldOffset,oldOffset+t.length)!==t||b.caption!==b.text||b.frames<=0)
  throw Error('Previously approved VOICEVOX does not match original source: '+b.id);
 const r={charStart:oldOffset,charEnd:oldOffset+t.length,startFrame:b.from,endFrame:b.from+b.frames};
 oldOffset+=t.length;
 return r;
});
if(oldOffset!==speech.length)throw Error('The chapter narration is not complete');
const offsets=[0];
for(const s of paragraphs)offsets.push(offsets.at(-1)+s.length);
const at=pos=>{
 if(pos===speech.length)return audioBeats.at(-1).endFrame;
 const beat=audioBeats.find(b=>pos>=b.charStart&&pos<b.charEnd);
 if(!beat)throw Error('Audio clip for source position missing at '+pos);
 return Math.round(beat.startFrame+(pos-beat.charStart)/(beat.charEnd-beat.charStart)*(beat.endFrame-beat.startFrame));
};
const frameMarks=offsets.map(at);
if(frameMarks.some((f,i)=>i>0&&f<=frameMarks[i-1]))throw Error('Collapsed time for paragraph');
let lastParagraph=0,prevEnd=0;
const shots=edit.shots.map((s,i)=>{
 if(s.fromParagraph!==lastParagraph+1||s.toParagraph>paragraphs.length||
    s.toParagraph<s.fromParagraph)throw Error('Chapter shot source gap/overlap: '+s.id);
 if(s.visualRef.startsWith('P')&&!byRef.has(s.visualRef))throw Error('Unverified original shot '+s.visualRef);
 const from=frameMarks[s.fromParagraph-1],end=frameMarks[s.toParagraph];
 if(from!==prevEnd||end<=from)throw Error('Chapter visual frame gap/overlap '+s.id);
 lastParagraph=s.toParagraph;prevEnd=end;
 return {...s,fromFrame:from,durationFrames:end-from,sourceText:paragraphs.slice(s.fromParagraph-1,s.toParagraph).join('\n'),
  originalShot:s.visualRef.startsWith('P')?byRef.get(s.visualRef):null};
});
if(lastParagraph!==paragraphs.length||shots[0].fromFrame!==0||
 prevEnd!==audioBeats.at(-1).endFrame||prevEnd>chapter.durationFrames)throw Error('Incomplete chapter coverage');
const result={version:'standalone-chapter-preview-v1',status:'chapter_preview_ready',chapterId:id,
 fps:30,durationFrames:chapter.durationFrames,source:'src/approved_original_narration.md',
 sourceParagraphCount:paragraphs.length,originalAudioReused:true,
 timingCaveat:'Paragraph cut boundaries are estimated within an existing VOICEVOX chunk by interpolating source-character positions. Hear-check needed at transitions.',
 audioFile:chapter.audioFile,
 narrationBeats:chapter.beats.map(b=>({id:b.id,text:b.text,caption:b.caption,from:b.from,frames:b.frames})),
 shots};
fs.writeFileSync(path.join(root,'src/chapter-selected-data.json'),JSON.stringify(result,null,2)+'\n');
fs.mkdirSync(path.join(root,'out'),{recursive:true});
fs.writeFileSync(path.join(root,'out/'+id+'-review-scene-list.json'),JSON.stringify({
 chapterId:id,sceneCount:shots.length,paragraphCount:paragraphs.length,
 durationFrames:chapter.durationFrames,sceneList:shots.map(s=>({id:s.id,fromFrame:s.fromFrame,
  durationFrames:s.durationFrames,fromParagraph:s.fromParagraph,toParagraph:s.toParagraph,
  visualRef:s.visualRef,recommendation:s.recommendation}))},null,2)+'\n');
console.log('Chapter '+id+': '+shots.length+' deliberate, paragraph-aligned shots / '+paragraphs.length+
 ' approved original paragraphs / '+chapter.durationFrames+' frames with original VOICEVOX.');
