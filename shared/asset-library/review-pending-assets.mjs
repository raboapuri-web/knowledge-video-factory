import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {validateCatalog} from './prepare.mjs';

const here=path.dirname(fileURLToPath(import.meta.url));
const props={
 name:{type:'string'},description:{type:'string'},
 tags:{type:'array',items:{type:'string'}},
 mustMentionAny:{type:'array',items:{type:'string'}},
 avoid:{type:'array',items:{type:'string'}},
 style:{type:'string',enum:['cinematic-vector','flat-vector','photographic','other']},
 palette:{type:'string',enum:['muted-dark','muted-light','colorful','monochrome']},
 composition:{type:'string'},
 dominantElements:{type:'array',items:{type:'string'}},
 recommendedUses:{type:'array',items:{type:'string'}}
};
const schema={type:'object',additionalProperties:false,required:Object.keys(props),properties:props};

const clean=(xs,min,max)=>{
 if(!Array.isArray(xs))throw Error('Expected metadata array');
 const out=[...new Set(xs.map(x=>String(x).normalize('NFKC').trim()).filter(x=>x.length>=2&&x.length<=42))];
 if(out.length<min||out.length>max)throw Error('Metadata array length '+out.length+' not in '+min+'..'+max);
 return out;
};
const readImage=(full)=>{
 const bytes=fs.readFileSync(full),ext=path.extname(full).toLowerCase();
 if(ext==='.png')return {bytes,mime:'image/png'};
 if(ext==='.webp')return {bytes,mime:'image/webp'};
 if(ext==='.svg'){
  const png=execFileSync('rsvg-convert',['-w','1024','-h','1024','--keep-aspect-ratio',full],
    {timeout:20000,maxBuffer:12*1024*1024});
  return {bytes:png,mime:'image/png'};
 }
 throw Error('Unsupported image '+full);
};
async function analyze(asset,apiKey){
 const full=path.join(here,asset.file),image=readImage(full);
 const role=asset.category==='背景'?'background scene':'foreground prop';
 const instruction=asset.category==='背景'
  ?'Analyze ONE reusable 16:9 video background. Describe only visible content. Focus on location type, time/lighting, major spatial zones, foreground/midground/background objects, empty areas suitable for overlaid characters/subtitles, and scene uses. Do not infer exact city/brand if not visibly certain.'
  :'Analyze ONE reusable foreground video prop. Describe only the visible object, its material/color/form, orientation, transparency/background treatment, and realistic scene uses. Do not infer a brand unless visible and necessary.';
 const body={model:'gpt-4.1-mini',max_output_tokens:850,
  input:[
   {role:'system',content:[{type:'input_text',text:
    'You maintain a Japanese Remotion asset catalog. '+instruction+
    ' Return concise Japanese metadata. tags must contain 3–9 visible/relevant terms; mustMentionAny 1–4 direct anchors and each anchor must appear exactly in tags. avoid should only contain genuinely misleading contexts. composition should be one sentence about framing and usable empty space. dominantElements 2–7 visible elements. recommendedUses 2–6 concrete scene types. Never claim copyright, ownership, exact real-world identity, or hidden details. '+role+'.'}]},
   {role:'user',content:[
    {type:'input_text',text:'カテゴリ: '+asset.category+' / ファイル: '+path.basename(asset.file)+'。画像そのものを詳細に見て、再利用動画素材として登録してください。'},
    {type:'input_image',image_url:'data:'+image.mime+';base64,'+image.bytes.toString('base64'),detail:'low'}
   ]}
  ],text:{format:{type:'json_schema',name:'asset_visual_catalog',strict:true,schema}}};
 let last='';
 for(let attempt=0;attempt<3;attempt++){
  const res=await fetch('https://api.openai.com/v1/responses',{method:'POST',
   headers:{Authorization:'Bearer '+apiKey,'Content-Type':'application/json'},
   body:JSON.stringify(body),signal:AbortSignal.timeout(75000)});
  if(res.ok){
   const payload=await res.json();
   const txt=payload.output?.flatMap(x=>x.content||[]).find(x=>x.type==='output_text')?.text;
   if(payload.status!=='completed'||!txt)throw Error('No completed image analysis for '+asset.file);
   return JSON.parse(txt);
  }
  last='HTTP '+res.status+': '+(await res.text()).slice(0,400);
  if(![429,500,502,503,504].includes(res.status))break;
  await new Promise(r=>setTimeout(r,(attempt+1)*1000));
 }
 throw Error(last||'Image analysis failed for '+asset.file);
}
export async function reviewPending({root=here,apiKey=process.env.OPENAI_API_KEY,maxPerRun=12}={}){
 if(!apiKey)throw Error('Missing OPENAI_API_KEY');
 const catalogPath=path.join(root,'catalog.json');
 const catalog=JSON.parse(fs.readFileSync(catalogPath,'utf8'));
 const pending=catalog.assets.filter(a=>a.autoRegistration?.needsVisualReview===true);
 if(pending.length>maxPerRun)throw Error('Pending detailed reviews '+pending.length+' exceed max '+maxPerRun);
 let reviewed=0;
 for(const asset of pending){
  const m=await analyze(asset,apiKey);
  const tags=clean(m.tags,3,9),must=clean(m.mustMentionAny,1,4),avoid=clean(m.avoid,0,5);
  if(!must.every(x=>tags.includes(x)))throw Error('mustMentionAny must be exact tag for '+asset.file);
  asset.name=String(m.name).slice(0,80);
  asset.description=String(m.description).slice(0,300);
  asset.tags=tags;asset.mustMentionAny=must;asset.avoid=avoid;
  asset.style=m.style;asset.palette=m.palette;
  asset.visualAnalysis={
   composition:String(m.composition).slice(0,320),
   dominantElements:clean(m.dominantElements,2,7),
   recommendedUses:clean(m.recommendedUses,2,6)
  };
  asset.autoRegistration={
   ...(asset.autoRegistration||{}),
   method:'openai-vision-detailed',
   model:'gpt-4.1-mini',
   needsVisualReview:false,
   analyzedAt:'2026-09-23',
   note:'画像本体をOpenAI Visionで詳細分析済み。権利ステータスは別管理のためlicenseは変更していない。'
  };
  reviewed++;
  console.log('Detailed visual analysis: '+asset.file+' -> '+asset.name);
 }
 const next={...catalog,version:Math.max(5,Number(catalog.version)||0),assets:catalog.assets};
 validateCatalog(next,root);
 const encoded=JSON.stringify(next,null,2)+'\n';
 const before=fs.readFileSync(catalogPath,'utf8');
 if(encoded!==before)fs.writeFileSync(catalogPath,encoded);
 return {reviewed,changed:encoded!==before,pendingBefore:pending.length};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 reviewPending().then(x=>console.log('Detailed asset review '+JSON.stringify(x))).catch(e=>{console.error(e);process.exitCode=1});
}
