import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const source=path.join(root,'v44-interaction-attraction');
const target=path.join(root,'v55-promotion-ghost');
const template=path.join(root,'template-assets');
if(!fs.existsSync(source)) throw new Error('V44 source template is missing');
if(!fs.existsSync(template)) throw new Error('template-assets checkout is missing');
fs.rmSync(target,{recursive:true,force:true});
fs.cpSync(source,target,{recursive:true});

fs.rmSync(path.join(target,'public/assets'),{recursive:true,force:true});
fs.cpSync(path.join(template,'public/assets'),path.join(target,'public/assets'),{recursive:true});
fs.rmSync(path.join(target,'src/characters'),{recursive:true,force:true});
fs.cpSync(path.join(template,'src/characters'),path.join(target,'src/characters'),{recursive:true});

const title='昇進した日に、一番連絡したかった相手はもう他人だった。';
const script=fs.readFileSync(path.join(root,'shared/v55/promotion-ghost-script.txt'),'utf8').trim();
if(!script.startsWith('三十五歳の誕生日から、二週間が経った火曜日。')) throw new Error('Wrong V55 canonical script');
fs.writeFileSync(path.join(target,'script.txt'),script+'\n');

const phaseStarts=[
 ['promotion_meeting','三十五歳の誕生日から、二週間が経った火曜日。'],
 ['promotion_reaction','もっと嬉しいと思っていた。'],
 ['misaki_search','そう言いながら、なぜかスマホを開いた。'],
 ['nakano_life','美咲と付き合い始めたのは、僕が二十六歳のときだった。'],
 ['ebisu_first_date','最初のデートは、恵比寿だった。'],
 ['future_talk','付き合って一年くらい経った頃、僕はよく将来の話をしていた。'],
 ['shinagawa_transfer','二十八歳のとき、僕は転職した。'],
 ['sancha_move','二十九歳で、三軒茶屋に引っ越した。'],
 ['wallet_birthday','三十歳の誕生日、美咲が財布をくれた。'],
 ['gotanda_breakup','三十一歳になる少し前、別れた。'],
 ['after_breakup','別れたあと、僕はさらに仕事をした。'],
 ['meguro_home','三十四歳で目黒に中古マンションを買った。'],
 ['promotion_night','夜、会社の人たちが昇進祝いをしてくれた。'],
 ['ebisu_walk','店を出たのは十一時過ぎだった。'],
 ['meguro_midnight','目黒の部屋に着いた。'],
 ['line_history','またLINEを開いた。'],
 ['unsent_message','試しに入力欄をタップした。'],
 ['proof_witness','美咲に知らせたいわけではなかった。'],
 ['delete_silence','メッセージを全部消した。'],
 ['next_morning','翌朝、会社に行った。'],
 ['final_realization','その文字を見て、']
];

const paras=script.split(/\n\s*\n/).map(s=>s.trim()).filter(Boolean);
let phase='promotion_meeting';
const raw=[];
for(const p of paras){
  const hit=phaseStarts.find(([,start])=>p.startsWith(start));
  if(hit) phase=hit[0];
  raw.push({phase,text:p});
}

const beats=[];
for(const item of raw){
  const prev=beats.at(-1);
  const dialogue=/^[「『]/.test(item.text);
  const limit=dialogue?52:74;
  if(prev&&prev.phase===item.phase&&(prev.narration+' '+item.text).length<=limit) prev.narration+=' '+item.text;
  else beats.push({phase:item.phase,narration:item.text});
}

const phaseCounts=new Map();
beats.forEach((b,i)=>{
  const local=phaseCounts.get(b.phase)||0;
  phaseCounts.set(b.phase,local+1);
  b.id=`S${String(i+1).padStart(3,'0')}`;
  b.visual=`${b.phase}_${String(local+1).padStart(2,'0')}`;
  b.localIndex=local;
  b.variant=local%7;
  b.shotKind=['wide','mid','detail','insert','reaction','over-shoulder','foreground'][local%7];
});
if(beats.length<75||beats.length>155) throw new Error(`Unexpected V55 shot count: ${beats.length}`);

fs.writeFileSync(path.join(target,'src/script-data.json'),JSON.stringify({videoId:'V55-promotion-ghost',title,beats},null,2));
fs.writeFileSync(path.join(target,'src/scene-data.json'),JSON.stringify(beats.map(({id,phase,visual,localIndex,variant,shotKind})=>({id,phase,visual,localIndex,variant,shotKind})),null,2));
fs.writeFileSync(path.join(target,'src/sync-timing.json'),JSON.stringify({durationSeconds:900,beats:[]},null,2));
fs.writeFileSync(path.join(target,'production-manifest.json'),JSON.stringify({
 productionSystemVersion:2,visualRegistryVersion:4,voiceDictionaryVersion:4,qaRulesVersion:3,
 preproductionPolicyVersion:1,syncManifestVersion:7,requiresPreproductionPlan:true,sharedVoiceGenerator:true,
 videoId:'V55-promotion-ghost',title
},null,2));
fs.copyFileSync(path.join(root,'shared/v55/index.tsx'),path.join(target,'src/index.tsx'));
fs.copyFileSync(path.join(root,'shared/v55/scenes.tsx'),path.join(target,'src/scenes.tsx'));

fs.writeFileSync(path.join(target,'IMPLEMENTATION_PLAN.md'),`# V55 Promotion Ghost

- Canonical script: 昇進した日に、一番連絡したかった相手はもう他人だった。
- Built on the V46 measured VOICEVOX + segmented Remotion production architecture.
- ${beats.length} fine-grained shots across ${new Set(beats.map(b=>b.phase)).size} semantic phases.
- Same-location beats share one continuous phase clock. Background and camera motion do not restart when narration advances.
- Foreground characters, props, messages, reflections, office activity and framing change beat-by-beat.
- Existing raboapuri-web/test SVG/character assets are reused where semantically correct.
- Newly created reusable SVG backgrounds cover Shibuya 23F meeting room, Nakano-Shinbashi 1K, Ebisu restaurant, Sangenjaya 1K, Gotanda cafe, Ebisu west rotary and the Ebisu-to-Meguro night walk.
- Story-specific UI/metaphor animation is drawn in React/Remotion: Slack, LINE search/history, future-goal cards, commute route, mortgage contract, achievement half-life, unsent message deletion, old-self witness, and Manager signature.
- No generated images.
- Final release: MP4, QA contact sheet, shot table, script data, scene data, pronunciation report.
`);
console.log(`V55 materialized: ${beats.length} shots / ${new Set(beats.map(b=>b.phase)).size} phases`);