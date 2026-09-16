import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const source=path.join(root,'v44-interaction-attraction');
const target=path.join(root,'v50-friends-shots');
const template=path.join(root,'template-assets');
if(!fs.existsSync(source)) throw new Error('V44 source template is missing');
if(!fs.existsSync(template)) throw new Error('template-assets checkout is missing');
fs.rmSync(target,{recursive:true,force:true});
fs.cpSync(source,target,{recursive:true});

fs.rmSync(path.join(target,'public/assets'),{recursive:true,force:true});
fs.cpSync(path.join(template,'public/assets'),path.join(target,'public/assets'),{recursive:true});
fs.rmSync(path.join(target,'src/characters'),{recursive:true,force:true});
fs.cpSync(path.join(template,'src/characters'),path.join(target,'src/characters'),{recursive:true});

const title='東京で友達が減ったのは、忙しくなったからじゃなかった。';
const script=fs.readFileSync(path.join(root,'shared/v49/friends-script.txt'),'utf8').trim();
if(!script.startsWith('三十五歳になって、友達が減った。')) throw new Error('Wrong canonical script loaded');
fs.writeFileSync(path.join(target,'script.txt'),script+'\n');

const phaseStarts=[
 ['busy_excuse','「今月ちょっとバタバタしてる」'],['baba_youth','大学時代、'],['career_start','卒業して、'],['mori_transfer','ところが、'],['shirokane_defense','三軒茶屋で飲んだ帰り、'],['wedding_measure','二十九歳で、'],['own_transfer','僕は三十歳で転職した。'],['kobayashi_house','三十一歳で、'],['different_game','別の生活なら、'],['avoidance','三十二歳になった頃から、'],['side_light','森と会うと、'],['juniors_safe','会社の後輩とはよく飲んだ。'],['meguro_buy','三十四歳で、'],['yurakucho_talk','去年の年末。'],['screentime_alibi','帰り。'],['spring_invite','今年の春。'],['no_grading','誰も僕の年収を聞いていない。'],['showwindow','東京で暮らしているうちに、'],['backroom','裏側にある段ボールや、'],['return_baba','四月。'],['stairs_down','四人でよく行った地下の居酒屋は、'],['reunion','佐々木が先に来ていた。'],['acceptance','僕は久しぶりに、'],['walk_home','帰り道。'],['rotary_goodbye','駅前のロータリーで、'],['revision_history','未来へ行く途中で、'],['final_archive','昔の友達の中には、']
];

const paras=script.split(/\n\s*\n/).map(s=>s.trim()).filter(Boolean);
let phase='present_lonely';
const raw=[];
for(const p of paras){const hit=phaseStarts.find(([,start])=>p.startsWith(start));if(hit)phase=hit[0];raw.push({phase,text:p});}

// Finer shot cadence than V49: keep narration chunks short enough that visual information
// can update every few seconds without restarting the location/background animation.
const beats=[];
for(const item of raw){
  const prev=beats.at(-1);
  const dialogue=/^[「『]/.test(item.text);
  const limit=dialogue?72:92;
  if(prev&&prev.phase===item.phase&&(prev.narration+' '+item.text).length<=limit) prev.narration+=' '+item.text;
  else beats.push({phase:item.phase,narration:item.text});
}
const phaseCounts=new Map();
beats.forEach((b,i)=>{
  const local=phaseCounts.get(b.phase)||0; phaseCounts.set(b.phase,local+1);
  b.id=`S${String(i+1).padStart(3,'0')}`;
  b.visual=`${b.phase}_${String(local+1).padStart(2,'0')}`;
  b.variant=local%6;
  b.shotKind=['wide','mid','detail','insert','reaction','foreground'][local%6];
});
if(beats.length<60||beats.length>135) throw new Error(`Unexpected finer-shot beat count: ${beats.length}`);

fs.writeFileSync(path.join(target,'src/script-data.json'),JSON.stringify({videoId:'V50-friends-shots',title,beats},null,2));
fs.writeFileSync(path.join(target,'src/scene-data.json'),JSON.stringify(beats.map(({id,phase,variant,visual,shotKind})=>({id,phase,variant,visual,shotKind})),null,2));
fs.writeFileSync(path.join(target,'src/sync-timing.json'),JSON.stringify({durationSeconds:900,beats:[]},null,2));
fs.writeFileSync(path.join(target,'production-manifest.json'),JSON.stringify({productionSystemVersion:2,visualRegistryVersion:4,voiceDictionaryVersion:4,qaRulesVersion:3,preproductionPolicyVersion:1,syncManifestVersion:7,requiresPreproductionPlan:true,sharedVoiceGenerator:true,videoId:'V50-friends-shots',title},null,2));
fs.copyFileSync(path.join(root,'shared/v50/index.tsx'),path.join(target,'src/index.tsx'));
fs.copyFileSync(path.join(root,'shared/v49/scenes.tsx'),path.join(target,'src/scenes.tsx'));
fs.writeFileSync(path.join(target,'IMPLEMENTATION_PLAN.md'),`# V50 Friends — Fine Shot Continuity\n\n- Canonical script begins: 三十五歳になって、友達が減った。\n- ${beats.length} short narration shots across ${new Set(beats.map(b=>b.phase)).size} semantic locations/phases.\n- Same-location beats share one continuous phase clock: background/camera motion does not restart at each subtitle beat.\n- Full-screen fade is used only when the semantic phase/location actually changes.\n- Each short beat receives a different foreground treatment (table edge, phone glow, passing silhouette, bokeh/reflection, prop insert, framing mask) so repeated backgrounds feel like new shots rather than replayed animation.\n- V46 measured VOICEVOX narration, segmented Remotion render, small bottom subtitles, QA contact sheet and scene table retained.\n- Reuses raboapuri-web/test SVG/background/character library. No generated images.\n`);
console.log(`V50 materialized: ${beats.length} finer shots / ${new Set(beats.map(b=>b.phase)).size} phases`);
