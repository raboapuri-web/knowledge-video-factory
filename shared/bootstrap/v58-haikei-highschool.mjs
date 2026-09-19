import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const source=path.join(root,'v44-interaction-attraction');
const target=path.join(root,'v58-haikei-highschool');
const template=path.join(root,'template-assets');
if(!fs.existsSync(source)) throw new Error('V44 source template is missing');
if(!fs.existsSync(template)) throw new Error('template-assets checkout is missing');
fs.rmSync(target,{recursive:true,force:true});
fs.cpSync(source,target,{recursive:true});

fs.rmSync(path.join(target,'public/assets'),{recursive:true,force:true});
fs.cpSync(path.join(template,'public/assets'),path.join(target,'public/assets'),{recursive:true});
fs.rmSync(path.join(target,'src/characters'),{recursive:true,force:true});
fs.cpSync(path.join(template,'src/characters'),path.join(target,'src/characters'),{recursive:true});

const title='拝啓、高校生の僕へ';
const script=fs.readFileSync(path.join(root,'shared/v58/haikei-highschool-script.txt'),'utf8').trim();
if(!script.startsWith('拝啓、高校生の君へ。')) throw new Error('Wrong V58 canonical script');
fs.writeFileSync(path.join(target,'script.txt'),script+'\n');

const phaseStarts=[
 ['train_departure','拝啓、高校生の君へ。'],
 ['niigata_memory','高校生の君は、新潟が嫌いだったよな。'],
 ['niigata_station','合格した日、人生の予選を一つ通過したような気がした。'],
 ['college_montage','東京の大学時代の話は、そんなにしなくてもいいと思う。'],
 ['roppongi_club','一度だけ、六本木のクラブにも行った。'],
 ['job_entry','四年生で就職活動をした。'],
 ['first_year','一年目は、楽しかった。'],
 ['misalignment','二年目。'],
 ['powerpoint','例えば、上司から、「来週の役員会用に、この商品の状況まとめておいて」と言われる。'],
 ['sano_gap','消している間、隣の席では、同期の佐野が別案件の打ち合わせをしていた。'],
 ['office_isolation','三年目になる頃、僕は仕事に対する熱を、少しずつ失っていた。'],
 ['evaluation','四年目。'],
 ['ooimachi_sunday','その頃、大井町に住んでいた。'],
 ['restroom','ある月曜日。'],
 ['walkway_break','そして、ある朝。'],
 ['leave_and_resign','一週間後、病院へ行った。'],
 ['mother_call','その日の夕方。'],
 ['packing','それから、大井町の部屋を解約した。'],
 ['return_train','君なら、今の僕をどう見るだろう。'],
 ['tunnel_return','新幹線は、高崎を過ぎた。'],
 ['niigata_arrival','新潟駅に着いたら、外はたぶん寒い。'],

];

const paras=script.split(/\n\s*\n/).map(s=>s.trim()).filter(Boolean);
let phase='train_departure';
let salutationCount=0;
const raw=[];
for(const p of paras){
  const hit=phaseStarts.find(([,start])=>p.startsWith(start));
  if(hit) phase=hit[0];
  if(p==='拝啓、高校生の君へ。') { salutationCount++; if(salutationCount>=2) phase='final_letter'; }
  raw.push({phase,text:p});
}

const beats=[];
for(const item of raw){
  const prev=beats.at(-1);
  const dialogue=/^[「『]/.test(item.text);
  const limit=dialogue?46:68;
  if(prev&&prev.phase===item.phase&&(prev.narration+' '+item.text).length<=limit) prev.narration+=' '+item.text;
  else beats.push({phase:item.phase,narration:item.text});
}
const phaseCounts=new Map();
beats.forEach((b,i)=>{
  const local=phaseCounts.get(b.phase)||0;
  phaseCounts.set(b.phase,local+1);
  b.id='S'+String(i+1).padStart(3,'0');
  b.visual=b.phase+'_'+String(local+1).padStart(2,'0');
  b.localIndex=local;
  b.variant=local%8;
  b.shotKind=['wide','mid','detail','insert','reaction','over-shoulder','foreground','symbolic'][local%8];
});
if(beats.length<95||beats.length>230) throw new Error('Unexpected V58 shot count: '+beats.length);

fs.writeFileSync(path.join(target,'src/script-data.json'),JSON.stringify({videoId:'V58-haikei-highschool',title,beats},null,2));
fs.writeFileSync(path.join(target,'src/scene-data.json'),JSON.stringify(beats.map(({id,phase,visual,localIndex,variant,shotKind})=>({id,phase,visual,localIndex,variant,shotKind})),null,2));
fs.writeFileSync(path.join(target,'src/sync-timing.json'),JSON.stringify({durationSeconds:1100,beats:[]},null,2));
fs.writeFileSync(path.join(target,'production-manifest.json'),JSON.stringify({
 productionSystemVersion:2,visualRegistryVersion:4,voiceDictionaryVersion:4,qaRulesVersion:3,
 preproductionPolicyVersion:1,syncManifestVersion:7,requiresPreproductionPlan:true,sharedVoiceGenerator:true,
 videoId:'V58-haikei-highschool',title
},null,2));
fs.copyFileSync(path.join(root,'shared/v58/index.tsx'),path.join(target,'src/index.tsx'));
fs.copyFileSync(path.join(root,'shared/v58/scenes.tsx'),path.join(target,'src/scenes.tsx'));

fs.writeFileSync(path.join(target,'IMPLEMENTATION_PLAN.md'),`# V58 拝啓、高校生の僕へ

- V46 measured VOICEVOX + segmented Remotion architecture.
- Fine shots with stable S001... IDs and continuous phaseProgress across same-location narration beats.
- Central visual motif: Niigata wet asphalt “びちゃ” vs Shinagawa dry asphalt “カツ” with delayed payoff.
- Company arc is intentionally dense: 20-slide deck collapsing to 4 slides, “そこじゃない”, Sano comparison, office gossip, evaluation interview, Sunday-night Slack checking, restroom vomiting, Shinagawa walkway freeze, leave, resignation and badge return.
- New reusable SVGs in raboapuri-web/test cover Joetsu Shinkansen, Niigata wet road, Niigata station, Roppongi club, Shinagawa office, Shinagawa walkway, office restroom and Oimachi 1K.
- Same scene = background continuity. Foreground people, props, slides, UI, clocks, light and framing change without full reset.
- Final release includes MP4, QA contact sheet, shot table, script/scene data and pronunciation report.
`);
console.log(`V58 materialized: ${beats.length} shots / ${new Set(beats.map(b=>b.phase)).size} phases`);
