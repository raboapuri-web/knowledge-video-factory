// 考える夜 V150: scenario-first visual production; never modifies main or uploads to YouTube.
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {join,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const ROOT=join(dirname(fileURLToPath(import.meta.url)),'..');
const CHAPTERS=['prologue','chapter1','chapter2','chapter3','chapter4','chapter5','chapter6','epilogue'];
const ONLY=process.argv[2]||null;
if(ONLY&&!CHAPTERS.includes(ONLY))throw new Error('invalid chapter '+ONLY);
function split(text) {
 let out=[],buf='',depth=0;
 for(const ch of text){buf+=ch;
  if(ch==='「'||ch==='『')depth++;
  if(ch==='」'||ch==='』')depth=Math.max(0,depth-1);
  if(ch==='\n'){if(buf.trim())out.push(buf.trim());buf='';continue;}
  if(depth===0&&'。？！'.includes(ch)){out.push(buf.trim());buf='';}
 }
 if(buf.trim())out.push(buf.trim());
 return out.filter(Boolean);
}
const meta={slug:'v150-us-midterm-japan-worst-cases',title:'【トランプ政権に逆風】中間選挙から見える日本に起こる最悪のシナリオとは？',
 width:1920,height:1080,fps:30,chapters:CHAPTERS,
 colors:{bg:'#0E1015',paper:'#F1E9D9',red:'#B2323C',teal:'#4B9A9C',gray:'#A4A9AE'},
 notes:'2026年11月7日時点。事実と仮定シナリオを明確に分離。VOICEVOX青山龍星。実測音声字幕。'};
const slides=[], audit={slug:meta.slug,title:meta.title,chapters:{},totalSlides:0,errors:[],checks:{}};
for(const ch of CHAPTERS){
 const p=join(ROOT,'content','chapters',ch+'.json');
 const obj=JSON.parse(readFileSync(p,'utf8'));
 if(obj.chapter!==ch)audit.errors.push(ch+': chapter name mismatch');
 const raw=(obj.slides||[]).flatMap(x=>x.lines||[]).join('\n')+'\n';
 mkdirSync(join(ROOT,'content'),{recursive:true});
 writeFileSync(join(ROOT,'content','narration-'+ch+'.txt'),raw);
 const sents=split(raw);let cursor=0;
 for(const x of obj.slides||[]){
   const lines=(x.lines||[]).map(t=>t.trim()).filter(Boolean);
   if(!lines.length||!x.display?.length)audit.errors.push(ch+': empty line or display');
   const chunk=split(lines.join('\n'));
   if(JSON.stringify(sents.slice(cursor,cursor+chunk.length))!==JSON.stringify(chunk)) audit.errors.push(ch+': sentence segmentation mismatch '+cursor);
   const id=String(slides.length+1).padStart(3,'0');
   slides.push({id,ch,heading:obj.heading,start:chunk[0],end:chunk.at(-1),viz:x.viz||'cards',effect:x.effect||'fade',display:x.display,scenario:obj.scenario??false,source:x.source||''});
   cursor+=chunk.length;
 }
 if(cursor!==sents.length)audit.errors.push(ch+': gap '+cursor+'/'+sents.length);
 audit.chapters[ch]={slides:(obj.slides||[]).length,sentences:sents.length,characters:raw.length};
}
audit.totalSlides=slides.length;
if(slides.length<48||slides.length>140)audit.errors.push('Unexpected slide count '+slides.length);
const sceneData={meta:{...meta,renderUnits:slides.length},slides};
writeFileSync(join(ROOT,'content','slides.json'),JSON.stringify(sceneData,null,2));
for(const ch of (ONLY?[ONLY]:CHAPTERS)){
 mkdirSync(join(ROOT,'src','scenes'),{recursive:true});mkdirSync(join(ROOT,'src','projects'),{recursive:true});
 writeFileSync(join(ROOT,'src','scenes',ch+'.tsx'),
 "import data from '../../content/slides.json';\nimport timing from '../../content/measured-"+ch+".json';\nimport {createChapterScene} from '../lib/chapter';\nexport default createChapterScene('"+ch+"',data,timing);\n");
 writeFileSync(join(ROOT,'src','projects',ch+'.ts'),
 "import {makeProject} from '@motion-canvas/core';\nimport scene from '../scenes/"+ch+"?scene';\nexport default makeProject({name:'v150-"+ch+"',scenes:[scene]});\n");
}
writeFileSync(join(ROOT,'content','audit.json'),JSON.stringify(audit,null,2));
if(audit.errors.length){console.error(audit.errors);process.exit(1)}
console.log('V150 PREFLIGHT PASS',audit.totalSlides,'slides,',Object.values(audit.chapters).reduce((a,b)=>a+b.sentences,0),'narration cues');