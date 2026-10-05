import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd(),name='v112-market-value-40s',target=path.join(root,name),template=path.join(root,'v44-interaction-attraction'),source=path.join(root,'shared/v112');
if(!fs.existsSync(template))throw Error('V112 Remotion template unavailable');
fs.rmSync(target,{recursive:true,force:true});fs.cpSync(template,target,{recursive:true});

const sections=[['00-prologue','prologue'],['01-future','future'],['02-two-capitals','capitals'],['03-seniority','seniority'],['04-reproducibility-ai','repro'],['05-epilogue','epilogue']];
const objects=new Set('office-worker friend-message job-posting career-form internal-tasks market-question future-value young-worker human-capital training-investment time-horizon potential-interview age-shift accumulation-question manager-day general-capital firm-specific internal-map company-gate two-currencies salary-slip mixed-price market-sort showa-worker seniority-system deferred-wage training-loop oecd-curve family-costs young-hire midcareer-hire proof-pressure internal-vs-market casino-chip outside-store wage-data age-40 age-45 age-50 fork candidate-a candidate-b reproducibility brand-mask portable-result ai-change metaskills automation-risk problem-solving logo-off i-can employee-badge doors-open badge-down two-price-tags subtract-list portable-core outside-mirror value-separation'.split(' '));
const verbs=new Set('sit hold walk look point speak open close apply type call review compare split shift transfer rise fall erase filter reveal question wait return stack sort invest scan detach rebuild label'.split(' '));
const familyList='office-night train home-night career-site young-training human-capital future-timeline internal-office management-office outside-market job-market showa-office wage-curve family-budget hiring-desk casino interview analytics-room skills-lab ai-office automation two-prices abstract-value home-desk subway'.split(' ');

const splitLong=(s)=>{
 if(s.length<=44)return[s];
 const parts=s.split(/(?<=、)/).map(x=>x.trim()).filter(Boolean),out=[];let cur='';
 for(const p of parts){if(cur&&(cur+p).length>42){out.push(cur);cur=p}else cur+=p}
 if(cur)out.push(cur);
 return out.flatMap(x=>x.length>48?[x.slice(0,Math.ceil(x.length/2)),x.slice(Math.ceil(x.length/2))]:[x]).filter(Boolean);
};
const segment=(text)=>{
 const raw=(text.match(/[^。！？]+[。！？]/g)||[]).flatMap(splitLong),out=[];let cur='';
 for(const s of raw){if(!cur){cur=s;continue}if(cur.length<18&&(cur+s).length<=40){cur+=s;continue}out.push(cur);cur=s}
 if(cur)out.push(cur);return out.filter(Boolean);
};

const primaryFor=(t,p,i)=>{
 if(/一通のメッセージ|大学時代の友人/.test(t))return 'friend-message';
 if(/年収八百万円|一千万円|求人ページ/.test(t))return 'job-posting';
 if(/専門スキル|職務経歴/.test(t))return 'career-form';
 if(/社内調整|部下の育成|予算管理|役員への報告|社内システム/.test(t))return 'internal-tasks';
 if(/会社の名刺|会社の外|いくらの値段/.test(t)&&p==='prologue')return 'market-question';
 if(/四十五歳の会社員|課長|彼は/.test(t)&&p==='prologue')return 'office-worker';

 if(/二十五歳|入社三年目|若手社員/.test(t))return 'young-worker';
 if(/人的資本論|人的資本/.test(t))return 'human-capital';
 if(/教育|職業訓練|社員教育/.test(t)&&p==='future')return 'training-investment';
 if(/六十五歳|回収する時間|長い時間/.test(t))return 'time-horizon';
 if(/将来性|可能性|完成していない/.test(t))return 'potential-interview';
 if(/時間軸|未来の余白|実績/.test(t))return 'age-shift';
 if(/二十年以上の時間|何を蓄積|何を作った/.test(t))return 'accumulation-question';
 if(/未来の時間/.test(t))return 'future-value';

 if(/月曜日の朝|メールを確認|営業部との調整|役員会議|来年度の予算/.test(t))return 'manager-day';
 if(/どこへ行っても使|会計、プログラミング|データ分析|外国語|プロジェクト管理/.test(t))return 'general-capital';
 if(/企業特殊的人的資本|企業固有/.test(t))return 'firm-specific';
 if(/誰に話を通せば|根回し|社内の誰/.test(t))return 'internal-map';
 if(/会社の門|別の会社へ入った瞬間|新しい会社/.test(t))return 'company-gate';
 if(/二つの通貨|社内通貨/.test(t))return 'two-currencies';
 if(/給与明細|毎月四十五万円|役職手当/.test(t))return 'salary-slip';
 if(/一枚の値札|ひとまとめ/.test(t))return 'mixed-price';
 if(/この部分は買います|使えません|仕分け/.test(t))return 'market-sort';

 if(/昭和のオフィス|灰色の事務机|若いうちは/.test(t))return 'showa-worker';
 if(/年功的賃金|年功賃金|長く勤めるほど給料/.test(t))return 'seniority-system';
 if(/若い時期|後から高い賃金|生産性に比べ/.test(t))return 'deferred-wage';
 if(/長期雇用、企業内訓練|互いに支え合う/.test(t))return 'training-loop';
 if(/OECD|勤続年数と賃金|賃金カーブ/.test(t))return 'oecd-curve';
 if(/住宅ローン|教育費|生活水準/.test(t))return 'family-costs';
 if(/二十六歳|年収四百万円/.test(t))return 'young-hire';
 if(/四十六歳|七百五十万円/.test(t))return 'midcareer-hire';
 if(/払う根拠|要求する証明|高く買う/.test(t))return 'proof-pressure';
 if(/社内での値段|市場価格|社内価格/.test(t))return 'internal-vs-market';
 if(/カジノ|チップ/.test(t))return 'casino-chip';
 if(/外のコンビニ|外では使えない/.test(t))return 'outside-store';

 if(/二〇二五年上半期雇用動向調査|転職入職者/.test(t))return 'wage-data';
 if(/四十歳から四十四歳|四七・七/.test(t))return 'age-40';
 if(/四十五歳から四十九歳|四一・一/.test(t))return 'age-45';
 if(/五十歳から五十四歳|二六・五|四四・七/.test(t))return 'age-50';
 if(/分岐|誕生日に突然/.test(t))return 'fork';
 if(/一人目|十五年間、営業部|部下は十二名/.test(t))return 'candidate-a';
 if(/二人目|営業工程を作り直|別の商材/.test(t))return 'candidate-b';
 if(/再現性/.test(t))return 'reproducibility';
 if(/大手企業|会社名があなたを助け/.test(t))return 'brand-mask';
 if(/別の環境|別の会社でも|自社でも/.test(t))return 'portable-result';
 if(/AIである|労働経済白書|AIが職種/.test(t))return 'ai-change';
 if(/メタスキル|論理的思考|批判的思考|コミュニケーション/.test(t))return 'metaskills';
 if(/自動化|熟練/.test(t))return 'automation-risk';
 if(/問題を定義|人を説得|顧客の要求|異なる部署/.test(t))return 'problem-solving';
 if(/会社名を消す|ロゴを消す|役職を消す/.test(t))return 'logo-off';
 if(/私はこれをできます/.test(t))return 'i-can';

 if(/社員証/.test(t))return 'employee-badge';
 if(/多くの扉が開く|会議室へ入れる|アクセスできる/.test(t))return 'doors-open';
 if(/カードを机の上|一人の四十五歳/.test(t))return 'badge-down';
 if(/二つの値札|二つの価格/.test(t))return 'two-price-tags';
 if(/会社のブランドを引く|役職を引く|勤続年数を引く|人脈を引く/.test(t))return 'subtract-list';
 if(/そこに残ったもの|資格かもしれない|問題を発見する力/.test(t))return 'portable-core';
 if(/会社の外から見た|外から/.test(t))return 'outside-mirror';
 if(/会社が持つ価値|自分自身が持つ価値|分離し始める/.test(t))return 'value-separation';

 const fallback={
  prologue:['office-worker','career-form','market-question','job-posting'],
  future:['future-value','young-worker','human-capital','age-shift','training-investment'],
  capitals:['manager-day','general-capital','firm-specific','two-currencies','market-sort'],
  seniority:['seniority-system','deferred-wage','internal-vs-market','proof-pressure'],
  repro:['reproducibility','portable-result','metaskills','ai-change','problem-solving'],
  epilogue:['employee-badge','two-price-tags','subtract-list','portable-core','value-separation']
 };
 return fallback[p][i%fallback[p].length];
};

const verbFor=(t,p,i)=>{
 if(/座|机の上/.test(t))return 'sit';
 if(/スマートフォン|社員証|カード/.test(t))return 'hold';
 if(/帰宅|歩|移る|門を出/.test(t))return 'walk';
 if(/見つめ|見る|確認/.test(t))return 'look';
 if(/言う|話す|答え|質問/.test(t)&&!/質問が変わ/.test(t))return 'speak';
 if(/入力|記入|書き/.test(t))return 'type';
 if(/電話/.test(t))return 'call';
 if(/比較|比べ|二種類|二つ/.test(t))return 'compare';
 if(/分け|分解|二つに/.test(t))return 'split';
 if(/変わ|付け替|移る|切り替/.test(t))return 'shift';
 if(/持ち運|別の会社|外へ/.test(t))return 'transfer';
 if(/上が|増え|高く/.test(t))return 'rise';
 if(/下が|減価|小さく|低く/.test(t))return 'fall';
 if(/消す|外す|引く/.test(t))return 'erase';
 if(/仕分け|残る|換金/.test(t))return 'filter';
 if(/投資/.test(t))return 'invest';
 if(/積み|蓄積|貯め/.test(t))return 'stack';
 if(/市場価値|値段|価格|値札/.test(t))return 'label';
 if(/なぜ|だろうか|？/.test(t))return 'question';
 if(/戻ろう|再び/.test(t))return 'return';
 const f=['reveal','review','compare','shift','scan','sort','rise','split','label','rebuild','wait','detach'];
 return f[(i+p.length)%f.length];
};

const familyFor=(text,p,g)=>{
 if(/金曜日|オフィスビル|会議室|エレベーター/.test(text))return 'office-night';
 if(/電車|帰宅途中/.test(text))return 'train';
 if(/転職サイト|求人ページ|職務経歴|専門スキル/.test(text))return 'career-site';
 if(/夜十一時|リビング|家族が寝静ま/.test(text))return 'home-night';
 if(/二十五歳|入社三年目|若手社員|新卒/.test(text))return 'young-training';
 if(/人的資本|ゲーリー・ベッカー|教育や職業訓練/.test(text))return 'human-capital';
 if(/時間軸|未来|六十五歳|年齢を重ね/.test(text))return 'future-timeline';
 if(/社内調整|役員|経理部|部下/.test(text)&&p==='capitals')return 'internal-office';
 if(/企業特殊|根回し|社内の誰|社内システム/.test(text))return 'management-office';
 if(/会社の門|外でも使える|市場価格|換金/.test(text))return 'outside-market';
 if(/昭和|灰色の事務机|コピー/.test(text))return 'showa-office';
 if(/年功|賃金カーブ|給料が上が/.test(text))return 'wage-curve';
 if(/住宅ローン|教育費|生活水準/.test(text))return 'family-budget';
 if(/採用|年収四百|七百五十|企業は当然/.test(text))return 'hiring-desk';
 if(/カジノ|チップ/.test(text))return 'casino';
 if(/面接|一人目|二人目/.test(text))return 'interview';
 if(/データ|割合|四七・七|四一・一|二六・五|四四・七/.test(text))return 'analytics-room';
 if(/AI|自動化|労働経済白書/.test(text))return 'ai-office';
 if(/メタスキル|問題を定義|論理的思考/.test(text))return 'skills-lab';
 if(/社員証|カード|二つの値札/.test(text)&&p==='epilogue')return 'home-desk';
 if(/会社の価値|自分自身|外から見/.test(text))return 'two-prices';
 return familyList[(g*7+p.length)%familyList.length];
};

const beats=[],scriptParts=[],phaseCounts={};
for(const [file,phase] of sections){
 const text=fs.readFileSync(path.join(source,'story',file+'.txt'),'utf8').trim(),units=segment(text);phaseCounts[phase]=units.length;scriptParts.push(units.join('\n'));
 for(let i=0;i<units.length;i++){
  const narration=units[i],g=Math.floor(i/2),pairText=units.slice(g*2,g*2+2).join(' ');
  const family=familyFor(pairText,phase,g),environment=family+'-'+phase+'-'+String(g).padStart(3,'0');
  let primary=primaryFor(narration,phase,i),verb=verbFor(narration,phase,i);
  if(!objects.has(primary)||!verbs.has(verb))throw Error('V112 unsupported scene '+phase+'/'+i+' '+primary+'/'+verb);
  const prior=beats.at(-1);
  if(prior&&prior.environment===environment&&prior.primary===primary&&prior.verb===verb)verb=['reveal','compare','shift','sort','label'][(i+3)%5];
  const n=beats.length+1,no=String(n).padStart(3,'0'),shot=['establish','detail','medium','overhead','low-angle','split','tracking','profile','reverse','macro'][i%10];
  beats.push({id:'V112-'+no,phase,variant:i,narration,environment,family,action:primary+'-'+verb+'-'+shot+'-'+no,primary,verb,mode:i%2?'replace':'append',actionId:'V112-'+no+'-'+verb+'-'+primary,sceneKey:'v112-'+phase+'-'+no,visual:'v112-original-'+no,shotKind:shot,continuity:environment,visualIntent:narration,assetComposition:'original-procedural'});
 }
}
if(beats.length<185)throw Error('V112 scene segmentation too coarse '+beats.length);
for(const k of ['id','action','actionId','sceneKey','visual'])if(new Set(beats.map(x=>x[k])).size!==beats.length)throw Error('V112 repeated '+k);
const seen=new Set();for(let i=0;i<beats.length;i++){const e=beats[i].environment,p=beats[i-1]?.environment;if(seen.has(e)&&e!==p)throw Error('V112 noncontiguous background reuse '+e);seen.add(e);}
const fam=new Set(beats.map(x=>x.family)),pri=new Set(beats.map(x=>x.primary)),vrb=new Set(beats.map(x=>x.verb));
if(fam.size<14||pri.size<20||vrb.size<12)throw Error('V112 insufficient diversity '+fam.size+'/'+pri.size+'/'+vrb.size);

const src=path.join(target,'src'),scripts=path.join(target,'scripts');fs.mkdirSync(src,{recursive:true});fs.mkdirSync(scripts,{recursive:true});fs.mkdirSync(path.join(target,'qa'),{recursive:true});
fs.writeFileSync(path.join(target,'script.txt'),scriptParts.join('\n\n')+'\n');
fs.writeFileSync(path.join(src,'script-data.json'),JSON.stringify({videoId:'V112-market-value-40s',title:'なぜ40代になると突然「市場価値」を問われるのか？【人的資本論×年功序列×労働市場】',beats},null,2));
fs.writeFileSync(path.join(src,'scene-data.json'),JSON.stringify(beats,null,2));
fs.writeFileSync(path.join(src,'sync-timing.json'),JSON.stringify({durationSeconds:1200,beats:[]},null,2));
for(const f of ['index.tsx','scenes.tsx','market-engine.tsx','market-art.tsx','backgrounds.tsx'])fs.copyFileSync(path.join(source,f),path.join(src,f));
fs.copyFileSync(path.join(root,'shared/asset-library/人物テンプレート/V46_ADULT_MAN_RIG.tsx'),path.join(src,'adult-man-rig.tsx'));
fs.copyFileSync(path.join(root,'shared/asset-library/人物テンプレート/office-woman-rig.tsx'),path.join(src,'office-woman-rig.tsx'));
fs.copyFileSync(path.join(root,'shared/v100/primitives.tsx'),path.join(src,'primitives.tsx'));

for(const f of ['generate-voice-chunk.mjs','assemble-voice.mjs','plan-voice-parts.mjs','check-scenes.mjs','build-preproduction.mjs','plan-segments-fast.mjs']){
 let c=fs.readFileSync(path.join(root,'shared/v111',f),'utf8').replaceAll('V111','V112').replaceAll('v111-welfare-floor','v112-market-value-40s').replaceAll('V111-responsibility-delegation','V112-market-value-40s');
 if(f==='plan-voice-parts.mjs')c=c.replace('parts=4','parts=6');
 if(f==='plan-segments-fast.mjs')c=c.replace('parts=12','parts=16');
 fs.writeFileSync(path.join(scripts,f),c);
}
fs.copyFileSync(path.join(root,'shared/v53/generate-bgm.mjs'),path.join(scripts,'generate-bgm.mjs'));
for(const f of ['SOURCES.md','V112_PRODUCTION_SPEC.md'])fs.copyFileSync(path.join(source,f),path.join(target,f));
fs.writeFileSync(path.join(src,'library-assets.json'),'[]\n');
fs.writeFileSync(path.join(target,'production-manifest.json'),JSON.stringify({videoId:'V112-market-value-40s',sceneCount:beats.length,narrationCharacters:beats.reduce((n,b)=>n+b.narration.length,0),backgroundGroups:seen.size,phases:phaseCounts,visualFamilies:[...fam],semanticSubjects:[...pri],motionVerbs:[...vrb],characterTemplates:['V46_ADULT_MAN_RIG','office-woman-rig'],method:'250-ish narration beats + static contiguous micro-backgrounds + original semantic foreground action + parallel smoke/VOICEVOX + six-way voice + sixteen-way render',measuredVoice:true,subtitles:true,bgm:true,sfx:false,minimumFinalSeconds:900,output:{width:1920,height:1080,fps:30}},null,2));
console.log('V112 preflight PASS scenes='+beats.length+' chars='+beats.reduce((n,b)=>n+b.narration.length,0)+' backgroundGroups='+seen.size+' families='+fam.size+' primaries='+pri.size+' verbs='+vrb.size);
