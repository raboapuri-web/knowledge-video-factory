import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {validateCatalog} from './prepare.mjs';

const here=path.dirname(fileURLToPath(import.meta.url));
const hash=b=>createHash('sha256').update(b).digest('hex');
const extensions=new Set(['.svg','.png','.webp']);
const unsafeSvg=/<(?:script|foreignObject|image|use)\b|<!DOCTYPE|<!ENTITY|\bon\w+\s*=|url\s*\(|(?:href|src)\s*=\s*["'](?!#)/i;
const props={name:{type:'string'},description:{type:'string'},tags:{type:'array',items:{type:'string'}},
 mustMentionAny:{type:'array',items:{type:'string'}},avoid:{type:'array',items:{type:'string'}},
 style:{type:'string',enum:['cinematic-vector','flat-vector','photographic','other']},
 palette:{type:'string',enum:['muted-dark','muted-light','colorful','monochrome']}};
const schema={type:'object',additionalProperties:false,required:Object.keys(props),properties:props};

export function inspectFile(filename){
 const stat=fs.lstatSync(filename);
 if(!stat.isFile()||stat.isSymbolicLink()||stat.size<20||stat.size>4*1024*1024)
  throw Error('Expected a regular image of 20 bytes–4 MB: '+filename);
 const bytes=fs.readFileSync(filename),ext=path.extname(filename).toLowerCase();
 if(!extensions.has(ext))throw Error('Only SVG, PNG or WebP: '+filename);
 if(ext==='.svg'){
  const xml=bytes.toString('utf8');
  if(!/<svg[\s>]/i.test(xml)||unsafeSvg.test(xml))throw Error('Unsafe SVG; flatten external references: '+filename);
 }else if(ext==='.png'&&!bytes.subarray(0,8).equals(Buffer.from('89504e470d0a1a0a','hex')))
  throw Error('Invalid PNG header: '+filename);
 else if(ext==='.webp'&&(bytes.toString('ascii',0,4)!=='RIFF'||bytes.toString('ascii',8,12)!=='WEBP'))
  throw Error('Invalid WebP header: '+filename);
 return {bytes,ext,sha256:hash(bytes)};
}

export function scan(root=here){
 const folder=path.join(root,'パーツ'),files=[];
 for(const item of fs.readdirSync(folder,{withFileTypes:true})){
  if(item.isSymbolicLink()||item.isDirectory()||!item.isFile())throw Error('Parts must be regular files directly in パーツ/: '+item.name);
  if(item.name.startsWith('.'))continue;
  if(!extensions.has(path.extname(item.name).toLowerCase()))throw Error('Unsupported file extension: '+item.name);
  files.push({file:'パーツ/'+item.name,abs:path.join(folder,item.name)});
 }
 return files.sort((a,b)=>a.file.localeCompare(b.file,'ja'));
}

function strings(xs,min,max){
 if(!Array.isArray(xs))throw Error('AI metadata must contain arrays');
 const out=[...new Set(xs.map(x=>String(x).normalize('NFKC').trim()).filter(x=>x.length>=2&&x.length<=32))];
 if(out.length<min||out.length>max)throw Error('Invalid AI metadata tag count: '+out.length);
 return out;
}

export function buildEntry({file,sha256,metadata,previous=null}){
 const tags=strings(metadata.tags,2,9),mustMentionAny=strings(metadata.mustMentionAny,1,5),avoid=strings(metadata.avoid,0,5);
 if(!mustMentionAny.some(s=>tags.includes(s)))throw Error('Direct object anchor must be included in tags: '+file);
 if(!props.style.enum.includes(metadata.style)||!props.palette.enum.includes(metadata.palette))throw Error('Invalid style or palette: '+file);
 return {
  id:previous?.id??'part-auto-'+hash(Buffer.from(file,'utf8')).slice(0,16),
  category:'パーツ',file,phases:['*'],tags,mustMentionAny,avoid,
  style:metadata.style,palette:metadata.palette,
  // Image classification cannot establish copyright or commercial use rights.
  license:['original-project','cleared-commercial'].includes(previous?.license)?previous.license:'pending-review',
  layout:previous?.layout??{x:1250,y:300,w:350,h:400},motion:previous?.motion??'fade',sourceSha256:sha256,
  autoRegistration:{name:String(metadata.name).slice(0,80),description:String(metadata.description).slice(0,240),
   model:'gpt-4.1-mini',needsVisualReview:true}
 };
}

export async function analyzeWithOpenAI({abs,ext,bytes},apiKey=process.env.OPENAI_API_KEY){
 if(!apiKey)throw Error('Missing OPENAI_API_KEY in GitHub Actions secrets.');
 let image=bytes,mime=ext==='.png'?'image/png':'image/webp';
 if(ext==='.svg'){
  image=execFileSync('rsvg-convert',['-w','768','-h','768','--keep-aspect-ratio',abs],{maxBuffer:8*1024*1024,timeout:20000});
  mime='image/png';
 }
 const body={model:'gpt-4.1-mini',max_output_tokens:500,
 input:[{role:'system',content:[{type:'input_text',text:'Catalog exactly ONE reusable video prop. Inspect the actual image, not just filename. Output short Japanese descriptive nouns. Include 2–8 distinct tags genuinely relevant to the visible object and repeat at least one exact object name in mustMentionAny. Do not hallucinate historical period, user rights, filename-derived concepts, or hidden details. Keep avoid empty unless necessary. cinematic-vector means dark cinematic vector illustration.'}]},
  {role:'user',content:[{type:'input_text',text:'ファイル名 '+path.basename(abs)+'。パーツ素材に映っている物体の短い名前、説明、実際に映っている物体を直接指すキーワードと関連語、作風・配色を登録してください。必須語の少なくとも1つをtagsにも含めてください。'},
   {type:'input_image',image_url:'data:'+mime+';base64,'+image.toString('base64'),detail:'low'}]}],
 text:{format:{type:'json_schema',name:'video_part_catalog',strict:true,schema}}};
 let error;
 for(let attempt=0;attempt<3;attempt++){
  const response=await fetch('https://api.openai.com/v1/responses',{method:'POST',
   headers:{Authorization:'Bearer '+apiKey,'Content-Type':'application/json'},
   body:JSON.stringify(body),signal:AbortSignal.timeout(60000)});
  if(response.ok){
   const payload=await response.json(),content=payload.output?.flatMap(x=>x.content||[]).find(x=>x.type==='output_text')?.text;
   if(payload.status!=='completed'||!content)throw Error('OpenAI image analysis returned no complete metadata');
   return JSON.parse(content);
  }
  error='OpenAI image analysis HTTP '+response.status+': '+(await response.text()).slice(0,250);
  if(![429,500,502,503,504].includes(response.status))break;
  await new Promise(r=>setTimeout(r,(attempt+1)*750));
 }
 throw Error(error);
}

export async function syncCatalog({root=here,analyze=analyzeWithOpenAI,maxPerRun=10}={}){
 const catalogPath=path.join(root,'catalog.json'),original=JSON.parse(fs.readFileSync(catalogPath,'utf8'));
 const files=scan(root),present=new Set(files.map(x=>x.file)),retained=[];
 for(const a of original.assets){
  if(a.category!=='パーツ'){retained.push(a);continue;}
  if(present.has(a.file))retained.push(a);
  else if(a.autoRegistration)console.log('Dropping removed auto entry: '+a.file);
  else throw Error('Manually registered file missing; restore it or edit JSON explicitly: '+a.file);
 }
 const pending=[];
 for(const item of files){
  const previous=retained.find(a=>a.file===item.file);
  if(previous&&!previous.autoRegistration)continue;
  const checked=inspectFile(item.abs);
  if(previous?.sourceSha256!==checked.sha256)pending.push({...item,...checked,previous});
 }
 if(pending.length>maxPerRun)throw Error('At most '+maxPerRun+' new/modified image files per run; found '+pending.length);
 if(pending.length&&!process.env.OPENAI_API_KEY&&analyze===analyzeWithOpenAI)
  throw Error('Set OPENAI_API_KEY in GitHub Actions secrets before uploading images.');
 const nextEntries=[];
 for(const item of pending)nextEntries.push(buildEntry({...item,metadata:await analyze(item)}));
 for(const entry of nextEntries){
  const idx=retained.findIndex(a=>a.file===entry.file);
  if(idx<0)retained.push(entry);else retained[idx]=entry;
  console.log('Registered '+entry.file+'; rights pending review.');
 }
 const next={...original,version:Math.max(3,Number(original.version)||0),assets:retained};
 validateCatalog(next,root);
 const result=JSON.stringify(next,null,2)+'\n',changed=result!==fs.readFileSync(catalogPath,'utf8');
 if(changed)fs.writeFileSync(catalogPath,result);
 return {changed,registered:nextEntries.length};
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 syncCatalog().then(result=>console.log('Catalog sync '+JSON.stringify(result))).catch(err=>{console.error(err);process.exitCode=1});
}
