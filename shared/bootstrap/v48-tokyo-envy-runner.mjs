import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const source=path.join(root,'v44-interaction-attraction');
const target=path.join(root,'v48-tokyo-envy');
const template=path.join(root,'template-assets');
if(!fs.existsSync(source)) throw new Error('V44 source template is missing');
if(!fs.existsSync(template)) throw new Error('template-assets checkout is missing');
fs.rmSync(target,{recursive:true,force:true});
fs.cpSync(source,target,{recursive:true});

fs.rmSync(path.join(target,'public/assets'),{recursive:true,force:true});
fs.cpSync(path.join(template,'public/assets'),path.join(target,'public/assets'),{recursive:true});
fs.rmSync(path.join(target,'src/characters'),{recursive:true,force:true});
fs.cpSync(path.join(template,'src/characters'),path.join(target,'src/characters'),{recursive:true});

const title='東京で10年暮らしたら、羨ましいと言えなくなった。';
const scriptUrl='https://raw.githubusercontent.com/raboapuri-web/doga-kojin-tawaman/v24-tokyo-envy-full/v23-marriage-minato/script.txt';
const res=await fetch(scriptUrl);
if(!res.ok) throw new Error(`Failed to fetch canonical script: ${res.status}`);
const script=(await res.text()).trim();
fs.writeFileSync(path.join(target,'script.txt'),script+'\n');

const phaseStarts=[
 ['tokyo_wonder','それでも、東京にいる'],['tokyo_icons','麻布十番なんて'],['first_job','東京に来て四年目'],['young_wedding','別の同期は'],['ebisu_move','二十七歳で転職した'],['negative_reflex','その頃から'],['city_roast','東京に長く住むと'],['roppongi_work','三十歳になった'],['toyosu_visit','三十二歳のとき'],['toyosu_deflect','「すげえな」'],['seen_through','友達は笑った'],['price_search','帰りの有楽町線で'],['meguro_home','三十四歳で'],['hometown_house','ある日、'],['friends_dinner','三十五歳の春'],['shinjuku_night','帰り道、'],['instagram_scroll','その夜、'],['quiet_meguro','部屋は静かだった'],['realization','東京で十年暮らした'],['nakame_memory','大学一年の頃'],['ebisu_students','この前、'],['final_lookback','少し歩いてから振り返った']
];
const paras=script.split(/\n\s*\n/).map(s=>s.trim()).filter(Boolean);
let phase='baba_room';
const raw=[];
for(const p of paras){const hit=phaseStarts.find(([,start])=>p.startsWith(start));if(hit) phase=hit[0];raw.push({phase,text:p});}
const beats=[];
for(const item of raw){
  const prev=beats.at(-1); const dialogue=/^[「『]/.test(item.text); const limit=dialogue?82:122;
  if(prev&&prev.phase===item.phase&&(prev.narration+' '+item.text).length<=limit) prev.narration+=' '+item.text;
  else beats.push({phase:item.phase,narration:item.text});
}
beats.forEach((b,i)=>{b.id=`S${String(i+1).padStart(2,'0')}`;b.visual=`${b.phase}_${String(i+1).padStart(2,'0')}`;b.variant=i%5;});
if(beats.length<45||beats.length>70) throw new Error(`Unexpected beat count: ${beats.length}`);

fs.writeFileSync(path.join(target,'src/script-data.json'),JSON.stringify({videoId:'V48-tokyo-envy',title,beats},null,2));
fs.writeFileSync(path.join(target,'src/scene-data.json'),JSON.stringify(beats.map(({id,phase,variant,visual})=>({id,phase,variant,visual})),null,2));
fs.writeFileSync(path.join(target,'src/sync-timing.json'),JSON.stringify({durationSeconds:760,beats:[]},null,2));
fs.writeFileSync(path.join(target,'production-manifest.json'),JSON.stringify({productionSystemVersion:2,visualRegistryVersion:4,voiceDictionaryVersion:4,qaRulesVersion:3,preproductionPolicyVersion:1,syncManifestVersion:7,requiresPreproductionPlan:true,sharedVoiceGenerator:true,videoId:'V48-tokyo-envy',title},null,2));
fs.copyFileSync(path.join(root,'shared/v48/index.tsx'),path.join(target,'src/index.tsx'));
fs.copyFileSync(path.join(root,'shared/v48/scenes.tsx'),path.join(target,'src/scenes.tsx'));
fs.writeFileSync(path.join(target,'IMPLEMENTATION_PLAN.md'),`# V48 Tokyo Envy\n\n- ${beats.length} measured narration beats across 23 story phases.\n- V46-style measured VOICEVOX narration, segmented Remotion rendering and contact-sheet QA.\n- Reuses SVG and character assets from raboapuri-web/test.\n- Missing motion/UI/metaphor scenes are built procedurally in Remotion.\n- No generated images.\n- Internal camera movement, character blocking, parallax, phone/search/LINE/Instagram UI, transit and memory sequences are mapped directly from the script.\n`);
console.log(`V48 materialized: ${beats.length} beats / ${new Set(beats.map(b=>b.phase)).size} phases`);
