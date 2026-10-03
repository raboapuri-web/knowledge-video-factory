import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';

const root=process.cwd(),name='v109-overconfidence-work-original-scenes',target=path.join(root,name),template=path.join(root,'v44-interaction-attraction'),source=path.join(root,'shared/v109');
if(!fs.existsSync(template))throw Error('V109 Remotion template unavailable');
fs.rmSync(target,{recursive:true,force:true});fs.cpSync(template,target,{recursive:true});

const sections=[['00-prologue','prologue'],['01-metacognition','metacognition'],['02-counter','counter'],['03-status','status'],['04-expertise','expertise'],['05-epilogue','epilogue']];
const objects=new Set('confident-worker quiet-worker manager colleague researcher expert novice team project-board report old-data contract proposal memo checklist quartile-chart percentile-gap regression-chart confidence-gauge confidence-accuracy status-ladder forecast-tree contribution-wheel feedback-loop evaluation-dashboard score-axis metacognition-loop double-burden invisible-error ability-mask spotlight mirror-question competence-vs-confidence uncertainty branches status-signal fire-crisis prevented-failure phone laptop server-log monitor delivery sales-conversation client-call correction handoff promotion'.split(' '));
const verbs=new Set('enter raise-hand interrupt point boast listen speak lean watch walk call flag delay repair deliver write revise correct inspect calculate restart diagnose handoff prevent extinguish compare overestimate annotate branch regress calibrate assert hedge observe promote reward hide scatter credit loop audit separate measure reveal question rewind wait persist repeat'.split(' '));
const familyList='meeting office client night lunch research test proposal sales stats abstract conference contract incident forecast server evaluation corridor promotion teamwork quiet dashboard'.split(' ');

const splitLong=(s)=>{
 if(s.length<=78)return [s];
 const parts=s.split(/(?<=、)/).map(x=>x.trim()).filter(Boolean),out=[];let cur='';
 for(const p of parts){if(cur&&(cur+p).length>70){out.push(cur.endsWith('。')?cur:cur+'。');cur=p}else cur+=p}
 if(cur)out.push(cur.endsWith('。')||cur.endsWith('！')||cur.endsWith('？')?cur:cur+'。');
 return out;
};
const segment=(text)=>{
 const raw=(text.match(/[^。！？]+[。！？]/g)||[]).flatMap(splitLong),out=[];let cur='';
 for(const s of raw){if(!cur){cur=s;continue}if(cur.length<30&&(cur+s).length<=72){cur+=s;continue}out.push(cur);cur=s}if(cur)out.push(cur);
 return out.flatMap(s=>s.length>82?splitLong(s):[s]).filter(Boolean);
};

const primaryFor=(t,p,i)=>{
 if(/案件一覧|新しいプロジェクト/.test(t))return 'project-board';
 if(/課長|上司/.test(t))return 'manager';
 if(/僕がや|自信満々|エース|手柄|中心人物|絶対に伸び/.test(t))return 'confident-worker';
 if(/黙って|別の社員|静かな社員|残って資料|確認してから/.test(t))return 'quiet-worker';
 if(/電話/.test(t))return 'phone';
 if(/去年|古い数字/.test(t))return 'old-data';
 if(/資料|報告書|説明文/.test(t))return 'report';
 if(/納品|提出/.test(t))return 'delivery';
 if(/1999年|クルーガー|ダニング/.test(t))return 'researcher';
 if(/下位四分|四分の一/.test(t))return 'quartile-chart';
 if(/12パーセンタイル|62パーセンタイル/.test(t))return 'percentile-gap';
 if(/メタ認知|自分が何を知|認知を評価/.test(t))return 'metacognition-loop';
 if(/二重の負担|うまく行えていないこと/.test(t))return 'double-burden';
 if(/企画書|文章は長い|一文|根拠/.test(t))return 'proposal';
 if(/営業|商談|クロージング|ニーズ/.test(t))return 'sales-conversation';
 if(/目に見えない失敗|数字として表示されない/.test(t))return 'invisible-error';
 if(/一枚のグラフ|横軸|縦軸|平均への回帰|測定誤差/.test(t))return 'regression-chart';
 if(/10点|95点|上限|下限/.test(t))return 'score-axis';
 if(/2024年|専門家と非専門家/.test(t))return 'expert';
 if(/専門知識|専門家/.test(t))return 'confidence-gauge';
 if(/三人の社員|一人目|二人目|三人目/.test(t))return 'team';
 if(/話す速度|声の大きさ|姿勢|断定|視線|外側の振る舞い/.test(t))return 'status-signal';
 if(/2012年|Cameron Anderson|社会的地位|地位を得る/.test(t))return 'status-ladder';
 if(/契約書/.test(t))return 'contract';
 if(/トラブル|火事|徹夜で対応|英雄/.test(t))return 'fire-crisis';
 if(/問題が起きない|防いだ|事故を起こさな/.test(t))return 'prevented-failure';
 if(/0.22|213のデータセット|自信と正確さ/.test(t))return 'confidence-accuracy';
 if(/売上予測|競合価格|条件なら伸び|条件分岐|AならB/.test(t))return 'forecast-tree';
 if(/サーバー|メモリリーク|ログ/.test(t))return 'server-log';
 if(/誰の手柄|発案|計画|修正した人|後輩を支え|顧客との摩擦/.test(t))return 'contribution-wheel';
 if(/評価制度|発言機会|リーダー扱い|成功体験/.test(t))return 'promotion';
 if(/自信が地位|地位がさらに自信|循環/.test(t))return 'feedback-loop';
 if(/自信と能力|能力らしさ|能力そのものではない/.test(t))return 'competence-vs-confidence';
 if(/予測と結果|発言と成果|担当と修正|記録が必要|記録が残/.test(t))return 'evaluation-dashboard';
 if(/分からないことを|完全に客観視|何を意味する|だろうか/.test(t))return 'mirror-question';
 const fall={prologue:['confident-worker','quiet-worker','project-board'],metacognition:['metacognition-loop','proposal','researcher'],counter:['regression-chart','confidence-gauge','mirror-question'],status:['status-signal','status-ladder','team'],expertise:['forecast-tree','contribution-wheel','competence-vs-confidence'],epilogue:['evaluation-dashboard','competence-vs-confidence','mirror-question']}[p];
 return fall[i%fall.length];
};
const verbFor=(t,p,i)=>{
 if(/手を挙げ|口を開|先に/.test(t))return /手を挙げ/.test(t)?'raise-hand':'interrupt';
 if(/立つ|ホワイトボード|説明し始め/.test(t))return 'point';
 if(/話している|俺がまとめ|手柄/.test(t))return 'boast';
 if(/電話/.test(t))return 'call';
 if(/古い数字|誤字|問題を発見/.test(t))return 'flag';
 if(/遅れ/.test(t))return 'delay';
 if(/修正|直した/.test(t))return 'repair';
 if(/納品|提出/.test(t))return 'deliver';
 if(/巻き戻/.test(t))return 'rewind';
 if(/高く見積|過大評価/.test(t))return 'overestimate';
 if(/比較|比べ/.test(t))return 'compare';
 if(/書いた|説明文|メモ/.test(t))return 'write';
 if(/見抜|気づ|確認|分析|研究/.test(t))return 'inspect';
 if(/計算/.test(t))return 'calculate';
 if(/平均への回帰|ずれて/.test(t))return 'regress';
 if(/確信|自信/.test(t)&&/高め|強い/.test(t))return 'calibrate';
 if(/断言|絶対|言い切/.test(t))return 'assert';
 if(/可能性|ただし|条件/.test(t))return 'hedge';
 if(/地位|リーダー扱い|任され/.test(t))return 'promote';
 if(/報酬|有利|得をする/.test(t))return 'reward';
 if(/目立ちにく|見えにく|存在感が薄/.test(t))return 'hide';
 if(/再起動/.test(t))return 'restart';
 if(/メモリリーク|根本原因/.test(t))return 'diagnose';
 if(/誰の手柄|貢献/.test(t))return 'credit';
 if(/循環/.test(t))return 'loop';
 if(/記録|評価制度|基準/.test(t))return 'audit';
 if(/切り分け|同じものとして/.test(t))return 'separate';
 if(/測る|測定|正確さ/.test(t))return 'measure';
 if(/問題が起きない|防いだ/.test(t))return 'prevent';
 if(/見える|表示|現れ/.test(t))return 'reveal';
 if(/待|残って/.test(t))return 'wait';
 if(/なぜ|だろうか|？/.test(t))return 'question';
 return ['observe','compare','inspect','reveal','measure'][i%5];
};
const familyFor=(text,p,g)=>{
 if(/会議|ホワイトボード|上司|三人の社員/.test(text))return g%2?'conference':'meeting';
 if(/電話|取引先/.test(text))return 'client';
 if(/夜|残って|夜七時/.test(text))return 'night';
 if(/昼休み/.test(text))return 'lunch';
 if(/研究|1999年|2022年|2024年|2012年/.test(text))return 'research';
 if(/課題|テスト|パーセンタイル/.test(text))return 'test';
 if(/企画書|文章/.test(text))return 'proposal';
 if(/営業|商談/.test(text))return 'sales';
 if(/グラフ|平均への回帰|10点|95点|0.22/.test(text))return 'stats';
 if(/契約書/.test(text))return 'contract';
 if(/トラブル|火事|徹夜/.test(text))return 'incident';
 if(/売上予測|競合価格|条件分岐/.test(text))return 'forecast';
 if(/サーバー|メモリリーク|ログ/.test(text))return 'server';
 if(/評価|記録|基準/.test(text))return 'evaluation';
 if(/地位|リーダー|昇格|発言機会/.test(text))return 'promotion';
 if(/誰の手柄|複数人|チーム/.test(text))return 'teamwork';
 if(/黙って|静か|確認してから/.test(text))return 'quiet';
 return familyList[(g*3+p.length)%familyList.length];
};
const assetFor=(phase,g)=>{
 if(phase==='prologue'&&g===0)return ['lib-client','meeting'];
 if(phase==='prologue'&&g===4)return ['lib-workspace','office'];
 if(phase==='prologue'&&g===7)return ['lib-break','lunch'];
 if(phase==='metacognition'&&g===0)return ['lib-research','research'];
 if(phase==='counter'&&g===0)return ['lib-dark','abstract'];
 if(phase==='epilogue'&&g===0)return ['lib-office','meeting'];
 return null;
};

const beats=[],scriptParts=[],phaseCounts={},assetsUsed=new Set();
for(const [file,phase] of sections){
 const text=fs.readFileSync(path.join(source,'story',file+'.txt'),'utf8').trim(),units=segment(text);phaseCounts[phase]=units.length;scriptParts.push(units.join('\n'));
 for(let i=0;i<units.length;i++){
  const narration=units[i],g=Math.floor(i/2),pairText=units.slice(g*2,g*2+2).join(' '),asset=assetFor(phase,g);
  let family=asset?asset[1]:familyFor(pairText,phase,g),environment=(asset?asset[0]:family)+'-'+phase+'-'+String(g).padStart(3,'0');
  if(asset)assetsUsed.add(asset[0]);
  let primary=primaryFor(narration,phase,i),verb=verbFor(narration,phase,i);
  if(!objects.has(primary)||!verbs.has(verb))throw Error('V109 unsupported semantic scene '+phase+'/'+i+' '+primary+'/'+verb);
  const prior=beats.at(-1);
  if(prior&&prior.environment===environment&&prior.primary===primary&&prior.verb===verb)verb=['observe','compare','inspect','reveal','measure'][(i+2)%5];
  const n=beats.length+1,no=String(n).padStart(3,'0'),shot=['establish','detail','medium','overhead','low-angle','split','tracking','profile','reverse','macro'][i%10];
  beats.push({id:'V109-'+no,phase,variant:i,narration,environment,family,action:primary+'-'+verb+'-'+shot+'-'+no,primary,verb,mode:i%2?'replace':'replace',actionId:'V109-'+no+'-'+verb+'-'+primary,sceneKey:'v109-'+phase+'-'+no,visual:'v109-original-'+no,shotKind:shot,continuity:environment,visualIntent:narration,assetComposition:asset?'template-contiguous':'original-procedural'});
 }
}
if(beats.length<170)throw Error('V109 scene segmentation too coarse '+beats.length);
for(const k of ['id','action','actionId','sceneKey','visual'])if(new Set(beats.map(x=>x[k])).size!==beats.length)throw Error('V109 repeated '+k);
const seen=new Set();for(let i=0;i<beats.length;i++){const e=beats[i].environment,p=beats[i-1]?.environment;if(seen.has(e)&&e!==p)throw Error('V109 noncontiguous background reuse '+e);seen.add(e);}

const src=path.join(target,'src'),scripts=path.join(target,'scripts');fs.mkdirSync(src,{recursive:true});fs.mkdirSync(scripts,{recursive:true});fs.mkdirSync(path.join(target,'qa'),{recursive:true});
fs.writeFileSync(path.join(target,'script.txt'),scriptParts.join('\n\n')+'\n');
fs.writeFileSync(path.join(src,'script-data.json'),JSON.stringify({videoId:'V109-overconfidence-work-original-scenes',title:'なぜ無能の社員ほど、自分がエースのように振る舞うのか？【認知心理学×組織心理学×メタ認知】',beats},null,2));
fs.writeFileSync(path.join(src,'scene-data.json'),JSON.stringify(beats,null,2));
fs.writeFileSync(path.join(src,'sync-timing.json'),JSON.stringify({durationSeconds:1200,beats:[]},null,2));
for(const f of ['index.tsx','scenes.tsx','office-engine.tsx','office-art.tsx','backgrounds.tsx'])fs.copyFileSync(path.join(source,f),path.join(src,f));
for(const f of ['office-worker-rig.tsx','office-woman-rig.tsx'])fs.copyFileSync(path.join(root,'shared/asset-library/人物テンプレート',f),path.join(src,f));
fs.copyFileSync(path.join(root,'shared/v100/primitives.tsx'),path.join(src,'primitives.tsx'));
for(const f of ['generate-voicevox.mjs','check-original-scenes.mjs','build-preproduction.mjs'])fs.copyFileSync(path.join(source,f),path.join(scripts,f));
for(const f of ['generate-bgm.mjs','plan-segments.mjs'])fs.copyFileSync(path.join(root,'shared/v53',f),path.join(scripts,f));
for(const f of ['SOURCES.md','V109_PRODUCTION_SPEC.md'])fs.copyFileSync(path.join(source,f),path.join(target,f));

const approved=['BG_V46_CLIENT_MEETING_ROOM.png','BG_V46_PEER_COMPANY_WORKSPACE.png','BG_V46_OFFICE_BREAK_ROOM.png','BG_kenkyu.png','BG_office.png','BG_darkroom.png'];
const catalog=JSON.parse(fs.readFileSync(path.join(root,'shared/asset-library/catalog.json'),'utf8')),pub=path.join(target,'public/assets/v109'),assets=[];fs.mkdirSync(pub,{recursive:true});
for(const file of approved){const item=catalog.assets.find(x=>x.category==='背景'&&x.file==='背景/'+file);if(!item||item.license!=='cleared-commercial')throw Error('V109 uncleared asset '+file);const original=path.join(root,'shared/asset-library',item.file),dest=path.join(pub,file);fs.copyFileSync(original,dest);const sha=createHash('sha256').update(fs.readFileSync(dest)).digest('hex');if(sha!==item.sourceSha256)throw Error('V109 asset checksum mismatch '+file);assets.push({name:file,id:item.id,sha256:sha,license:item.license});}
fs.writeFileSync(path.join(src,'library-assets.json'),JSON.stringify(assets,null,2));
fs.writeFileSync(path.join(target,'production-manifest.json'),JSON.stringify({videoId:'V109-overconfidence-work-original-scenes',sceneCount:beats.length,narrationCharacters:beats.reduce((n,b)=>n+b.narration.length,0),backgroundGroups:seen.size,phases:phaseCounts,libraryBackgrounds:assets,characterTemplates:['office-worker-rig','office-woman-rig'],method:'fine narration beats + contiguous static background groups + narration-specific foreground action',measuredVoice:true,subtitles:true,bgm:true,sfx:false,minimumFinalSeconds:1050,output:{width:1920,height:1080,fps:30}},null,2));
console.log('V109 preflight PASS scenes='+beats.length+' chars='+beats.reduce((n,b)=>n+b.narration.length,0)+' backgroundGroups='+seen.size+' families='+new Set(beats.map(x=>x.family)).size+' assets='+assets.length);
