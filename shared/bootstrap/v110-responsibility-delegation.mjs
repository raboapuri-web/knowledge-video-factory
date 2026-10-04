import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';

const root=process.cwd(),name='v110-responsibility-delegation',target=path.join(root,name),template=path.join(root,'v44-interaction-attraction'),source=path.join(root,'shared/v110');
if(!fs.existsSync(template))throw Error('V110 Remotion template unavailable');
fs.rmSync(target,{recursive:true,force:true});fs.cpSync(template,target,{recursive:true});

const sections=[['00-prologue','prologue'],['01-ownership','ownership'],['02-delegation','delegation'],['03-bottleneck','bottleneck'],['04-failure-rights','failure'],['05-epilogue','epilogue']];
const objects=new Set('sasaki tanaka client team researcher proposal estimate email handbook role-card schedule mistake-sheet price-card calendar-loop ownership-boundary delegation-bridge dependence-loop slack-storm bottleneck-gate knowledge-network central-node cross-training safe-zone time-exchange future-capacity vacation-map shared-leadership hero-system phone laptop slack-screen client-call mouse-grab handoff presentation sick-day train-reply vacation return-office control-web single-point-failure answer-drop autonomy uncertainty responsibility-control wait-hand decision-rights quality-shield'.split(' '));
const verbs=new Set('enter handover grab type correct point listen wait speak walk open close lean call rewrite reorder approve reply submit check block release rotate document share notify compare own expand delegate loop spawn route centralize distribute cross-train branch bound exchange grow shrink audit reveal question repeat sick return'.split(' '));
const familyList='office-night office-day desk meeting client bedroom abstract research slack transit road network training presentation vacation return corridor lunch home dashboard archive phone calendar'.split(' ');

const splitLong=(s)=>{if(s.length<=78)return[s];const parts=s.split(/(?<=、)/).map(x=>x.trim()).filter(Boolean),out=[];let cur='';for(const p of parts){if(cur&&(cur+p).length>70){out.push(/[。！？]$/.test(cur)?cur:cur+'。');cur=p}else cur+=p}if(cur)out.push(/[。！？]$/.test(cur)?cur:cur+'。');return out};
const segment=(text)=>{const raw=(text.match(/[^。！？]+[。！？]/g)||[]).flatMap(splitLong),out=[];let cur='';for(const s of raw){if(!cur){cur=s;continue}if(cur.length<28&&(cur+s).length<=68){cur+=s;continue}out.push(cur);cur=s}if(cur)out.push(cur);return out.flatMap(s=>s.length>82?splitLong(s):[s]).filter(Boolean)};

const primaryFor=(t,p,i)=>{
 if(/午後九時四十分|十時過ぎ|照明|空席/.test(t))return 'schedule';
 if(/企画書|資料を担当|ページをめく|タイトル/.test(t))return 'proposal';
 if(/佐々木/.test(t)&&!/田中/.test(t)&&!/顧客/.test(t))return 'sasaki';
 if(/部下|田中|若手|新人/.test(t))return 'tanaka';
 if(/顧客/.test(t)&&/電話|頭を下げ/.test(t))return 'client-call';
 if(/顧客/.test(t))return 'client';
 if(/文章を書き換|グラフを作り直|修正/.test(t))return 'proposal';
 if(/翌月|その翌月|半年後|繰り返/.test(t))return 'calendar-loop';
 if(/病欠|高熱|会社を休/.test(t))return 'sick-day';
 if(/Slack|メンション|通知/.test(t))return 'slack-storm';
 if(/スマートフォン|電話を開|スマートフォンを見る/.test(t))return 'phone';
 if(/チームが止|何もできない|いなければ/.test(t))return 'single-point-failure';
 if(/責任感|美徳|コントロール|支配/.test(t))return 'responsibility-control';
 if(/見積書|見積もり|金額の間違/.test(t))return /間違|ミス/.test(t)?'mistake-sheet':'estimate';
 if(/確認が少しずつ|完成した見積|計算式|メールも見る|説明内容まで/.test(t))return 'control-web';
 if(/心理的所有感|自分のもの|自分の領域|所有感/.test(t))return 'ownership-boundary';
 if(/情報共有|領域を守/.test(t))return 'ownership-boundary';
 if(/マウスを受け取|俺だったらこうする/.test(t))return 'mouse-grab';
 if(/顧客へのメール/.test(t))return 'email';
 if(/5％/.test(t))return 'price-card';
 if(/答えを作る|正解が降って/.test(t))return 'answer-drop';
 if(/委任|判断する権利|判断権/.test(t))return 'delegation-bridge';
 if(/心理的エンパワーメント|自己効力感|主体/.test(t))return 'autonomy';
 if(/仕事だけが移動|権限は移動|作業している/.test(t))return 'decision-rights';
 if(/任せない|育たない|任せられない|循環/.test(t))return 'dependence-loop';
 if(/火曜日|午後三時/.test(t))return 'schedule';
 if(/確認お願いします|承認お願いします|判断お願いします/.test(t))return 'slack-screen';
 if(/一件処理すると、二件増/.test(t))return 'slack-storm';
 if(/昼食|会議中|帰りの電車/.test(t))return 'train-reply';
 if(/道路網|料金所|渋滞|道路全体/.test(t))return 'bottleneck-gate';
 if(/能力の上限|最も大きな制約/.test(t))return 'bottleneck-gate';
 if(/トランザクティブ・メモリー|誰が何を知|誰に聞けば/.test(t))return 'knowledge-network';
 if(/顧客Aなら佐々木|見積もりも佐々木|巨大な中心点/.test(t))return 'central-node';
 if(/一人が抜けただけで崩/.test(t))return 'single-point-failure';
 if(/クロストレーニング|役割を学ぶ/.test(t))return 'cross-training';
 if(/自分がコントロールできない/.test(t))return 'uncertainty';
 if(/一人で顧客へ提案|説明を始め|一枚目|二枚目|三枚目/.test(t))return 'presentation';
 if(/顧客の表情|質問が来る/.test(t))return 'client';
 if(/口を挟みたい|黙っている|待つ/.test(t))return 'wait-hand';
 if(/自分で失敗|安全な範囲の失敗|失敗を経験/.test(t))return 'safe-zone';
 if(/全部任せれば|少なすぎる|多すぎる|境界/.test(t))return 'safe-zone';
 if(/何を自分で決め|どこから相談|許容/.test(t))return 'handbook';
 if(/一時間|二時間|三時間|今日の効率/.test(t))return 'time-exchange';
 if(/半年後|未来の組織能力|明日、自分なし/.test(t))return 'future-capacity';
 if(/一週間の休暇|休暇三日目|帰国後/.test(t))return 'vacation';
 if(/顧客Aは田中|山本|鈴木|予定表/.test(t))return 'vacation-map';
 if(/判断基準を文書/.test(t))return 'handbook';
 if(/Slackを開く|閉じる/.test(t))return 'slack-screen';
 if(/共有型リーダーシップ|分散した/.test(t))return 'shared-leadership';
 if(/英雄|十件の仕事|十人が仕事|自分が全部やる/.test(t))return 'hero-system';
 if(/品質|最後に責任/.test(t))return 'quality-shield';
 if(/仕事を渡す|知識を共有|判断を言語化/.test(t))return 'handoff';
 const fall={prologue:['sasaki','proposal','team'],ownership:['sasaki','ownership-boundary','estimate'],delegation:['tanaka','delegation-bridge','answer-drop'],bottleneck:['slack-storm','bottleneck-gate','knowledge-network'],failure:['presentation','safe-zone','future-capacity'],epilogue:['vacation-map','shared-leadership','hero-system']}[p];
 return fall[i%fall.length];
};

const verbFor=(t,p,i)=>{
 if(/渡してきた|仕事を渡す/.test(t))return 'handover';
 if(/マウスを受け取/.test(t))return 'grab';
 if(/書き換|書き直/.test(t))return 'rewrite';
 if(/作り直|順番を入れ替/.test(t))return 'reorder';
 if(/確認/.test(t))return 'check';
 if(/電話/.test(t))return 'call';
 if(/頭を下げ/.test(t))return 'lean';
 if(/提出|納品/.test(t))return 'submit';
 if(/翌月|繰り返/.test(t))return 'repeat';
 if(/休んだ|病欠|高熱/.test(t))return 'sick';
 if(/返信|返事/.test(t))return 'reply';
 if(/通知|メンション|増え/.test(t))return 'spawn';
 if(/所有感|自分の領域|自分のもの/.test(t))return 'own';
 if(/守ろう|妨げ/.test(t))return 'block';
 if(/任せる|委任|権利まで渡/.test(t))return 'delegate';
 if(/循環/.test(t))return 'loop';
 if(/権限|作業|判断/.test(t))return 'compare';
 if(/道路|料金所|一か所へ集/.test(t))return 'route';
 if(/中心点|すべて.*佐々木/.test(t))return 'centralize';
 if(/誰が何を知|ネットワーク|共有型/.test(t))return 'distribute';
 if(/クロストレーニング|役割を学/.test(t))return 'cross-train';
 if(/失敗|範囲|境界/.test(t))return 'bound';
 if(/説明を始め|言う|話/.test(t))return 'speak';
 if(/口を挟み|黙って|待つ/.test(t))return 'wait';
 if(/観察|顔が変わ/.test(t))return 'reveal';
 if(/一時間|二時間|三時間|交換/.test(t))return 'exchange';
 if(/未来|半年後|増やす/.test(t))return 'grow';
 if(/予定表|判断基準|文書/.test(t))return 'document';
 if(/共有/.test(t))return 'share';
 if(/開く/.test(t))return 'open';
 if(/閉じる/.test(t))return 'close';
 if(/帰国後|戻る/.test(t))return 'return';
 if(/弱く|止ま|崩/.test(t))return 'shrink';
 if(/研究|示され/.test(t))return 'reveal';
 if(/なぜ|だろうか|？/.test(t))return 'question';
 return ['reveal','compare','check','audit','expand'][i%5];
};

const familyFor=(text,p,g)=>{
 if(/午後九時|夜|十時/.test(text))return 'office-night';
 if(/企画書|資料|見積書|メール/.test(text))return 'desk';
 if(/病欠|高熱|布団/.test(text))return 'bedroom';
 if(/Slack|通知|メンション/.test(text))return 'slack';
 if(/研究|心理的|トランザクティブ|エンパワ/.test(text))return 'research';
 if(/会議室|会議/.test(text))return 'meeting';
 if(/顧客.*提案|プレゼン|一枚目|二枚目|三枚目/.test(text))return 'presentation';
 if(/顧客/.test(text))return 'client';
 if(/道路|料金所|渋滞/.test(text))return 'road';
 if(/ネットワーク|誰が何を知|中心点/.test(text))return 'network';
 if(/クロストレーニング|役割を学/.test(text))return 'training';
 if(/帰りの電車/.test(text))return 'transit';
 if(/昼食/.test(text))return 'lunch';
 if(/休暇|帰国/.test(text))return 'vacation';
 if(/予定表|翌月|半年後/.test(text))return 'calendar';
 if(/判断基準|記録|文書/.test(text))return 'archive';
 if(/スマートフォン/.test(text))return 'phone';
 if(/戻る|普通に仕事/.test(text))return 'return';
 if(/循環|所有感|責任感|コントロール|境界|効率|能力/.test(text))return 'abstract';
 return familyList[(g*5+p.length)%familyList.length];
};

const assetFor=(phase,g)=>{
 if(phase==='prologue'&&g===0)return ['lib-street-night','office-night'];
 if(phase==='prologue'&&g===2)return ['lib-workspace','desk'];
 if(phase==='prologue'&&g===8)return ['lib-room-night','bedroom'];
 if(phase==='ownership'&&g===1)return ['lib-client','client'];
 if(phase==='ownership'&&g===7)return ['lib-dark','abstract'];
 if(phase==='delegation'&&g===0)return ['lib-office','office-day'];
 if(phase==='delegation'&&g===6)return ['lib-break','lunch'];
 if(phase==='bottleneck'&&g===0)return ['lib-peer-office','office-day'];
 if(phase==='bottleneck'&&g===10)return ['lib-research','research'];
 if(phase==='failure'&&g===0)return ['lib-client','presentation'];
 return null;
};

const beats=[],scriptParts=[],phaseCounts={};
for(const [file,phase] of sections){
 const text=fs.readFileSync(path.join(source,'story',file+'.txt'),'utf8').trim(),units=segment(text);phaseCounts[phase]=units.length;scriptParts.push(units.join('\n'));
 for(let i=0;i<units.length;i++){
  const narration=units[i],g=Math.floor(i/2),pairText=units.slice(g*2,g*2+2).join(' '),asset=assetFor(phase,g);
  const family=asset?asset[1]:familyFor(pairText,phase,g),environment=(asset?asset[0]:family)+'-'+phase+'-'+String(g).padStart(3,'0');
  let primary=primaryFor(narration,phase,i),verb=verbFor(narration,phase,i);
  if(!objects.has(primary)||!verbs.has(verb))throw Error('V110 unsupported semantic scene '+phase+'/'+i+' '+primary+'/'+verb);
  const prior=beats.at(-1);
  if(prior&&prior.environment===environment&&prior.primary===primary&&prior.verb===verb)verb=['reveal','compare','check','audit','expand'][(i+3)%5];
  const n=beats.length+1,no=String(n).padStart(3,'0'),shot=['establish','detail','medium','overhead','low-angle','split','tracking','profile','reverse','macro'][i%10];
  beats.push({id:'V110-'+no,phase,variant:i,narration,environment,family,action:primary+'-'+verb+'-'+shot+'-'+no,primary,verb,mode:'replace',actionId:'V110-'+no+'-'+verb+'-'+primary,sceneKey:'v110-'+phase+'-'+no,visual:'v110-original-'+no,shotKind:shot,continuity:environment,visualIntent:narration,assetComposition:asset?'template-contiguous':'original-procedural'});
 }
}
if(beats.length<180)throw Error('V110 scene segmentation too coarse '+beats.length);
for(const k of ['id','action','actionId','sceneKey','visual'])if(new Set(beats.map(x=>x[k])).size!==beats.length)throw Error('V110 repeated '+k);
const seen=new Set();for(let i=0;i<beats.length;i++){const e=beats[i].environment,p=beats[i-1]?.environment;if(seen.has(e)&&e!==p)throw Error('V110 noncontiguous background reuse '+e);seen.add(e);}

const src=path.join(target,'src'),scripts=path.join(target,'scripts');fs.mkdirSync(src,{recursive:true});fs.mkdirSync(scripts,{recursive:true});fs.mkdirSync(path.join(target,'qa'),{recursive:true});
fs.writeFileSync(path.join(target,'script.txt'),scriptParts.join('\n\n')+'\n');
fs.writeFileSync(path.join(src,'script-data.json'),JSON.stringify({videoId:'V110-responsibility-delegation',title:'なぜ「責任感が強い人」ほど、チームを弱くすることがあるのか？【属人化×委任×コントロール欲求】',beats},null,2));
fs.writeFileSync(path.join(src,'scene-data.json'),JSON.stringify(beats,null,2));
fs.writeFileSync(path.join(src,'sync-timing.json'),JSON.stringify({durationSeconds:1200,beats:[]},null,2));
for(const f of ['index.tsx','scenes.tsx','team-engine.tsx','team-art.tsx','backgrounds.tsx'])fs.copyFileSync(path.join(source,f),path.join(src,f));
for(const f of ['office-worker-rig.tsx','office-woman-rig.tsx'])fs.copyFileSync(path.join(root,'shared/asset-library/人物テンプレート',f),path.join(src,f));
fs.copyFileSync(path.join(root,'shared/v100/primitives.tsx'),path.join(src,'primitives.tsx'));
for(const f of ['generate-voicevox-fast.mjs','check-scenes.mjs','build-preproduction.mjs','plan-segments-fast.mjs'])fs.copyFileSync(path.join(source,f),path.join(scripts,f));
fs.copyFileSync(path.join(root,'shared/v53/generate-bgm.mjs'),path.join(scripts,'generate-bgm.mjs'));
for(const f of ['SOURCES.md','V110_PRODUCTION_SPEC.md'])fs.copyFileSync(path.join(source,f),path.join(target,f));

const approved=['BG_V46_CLIENT_MEETING_ROOM.png','BG_V46_PEER_COMPANY_WORKSPACE.png','BG_V46_OFFICE_BREAK_ROOM.png','BG_kenkyu.png','BG_office.png','BG_darkroom.png','BG_V46_PEER_COMPANY_OFFICE.png','BG_V46_OFFICE_STREET_NIGHT.png','BG_ROOM_NIGHT_ON.png','BG_ROOM_DAY.png'];
const catalog=JSON.parse(fs.readFileSync(path.join(root,'shared/asset-library/catalog.json'),'utf8')),pub=path.join(target,'public/assets/v110'),assets=[];fs.mkdirSync(pub,{recursive:true});
for(const file of approved){const item=catalog.assets.find(x=>x.category==='背景'&&x.file==='背景/'+file);if(!item||item.license!=='cleared-commercial')throw Error('V110 uncleared asset '+file);const original=path.join(root,'shared/asset-library',item.file),dest=path.join(pub,file);fs.copyFileSync(original,dest);const sha=createHash('sha256').update(fs.readFileSync(dest)).digest('hex');if(sha!==item.sourceSha256)throw Error('V110 asset checksum mismatch '+file);assets.push({name:file,id:item.id,sha256:sha,license:item.license});}
fs.writeFileSync(path.join(src,'library-assets.json'),JSON.stringify(assets,null,2));
fs.writeFileSync(path.join(target,'production-manifest.json'),JSON.stringify({videoId:'V110-responsibility-delegation',sceneCount:beats.length,narrationCharacters:beats.reduce((n,b)=>n+b.narration.length,0),backgroundGroups:seen.size,phases:phaseCounts,libraryBackgrounds:assets,characterTemplates:['office-worker-rig','office-woman-rig'],method:'fine narration beats + contiguous static backgrounds + narration-specific foreground action + fast smoke QA + parallel VOICEVOX + 12-way render',measuredVoice:true,subtitles:true,bgm:true,sfx:false,minimumFinalSeconds:1050,output:{width:1920,height:1080,fps:30}},null,2));
console.log('V110 preflight PASS scenes='+beats.length+' chars='+beats.reduce((n,b)=>n+b.narration.length,0)+' backgroundGroups='+seen.size+' families='+new Set(beats.map(x=>x.family)).size+' assets='+assets.length);
