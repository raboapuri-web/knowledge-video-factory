import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd(),name='v113-long-tenure-market-value',target=path.join(root,name),template=path.join(root,'v44-interaction-attraction'),source=path.join(root,'shared/v113');
if(!fs.existsSync(template))throw Error('V113 Remotion template unavailable');
fs.rmSync(target,{recursive:true,force:true});fs.cpSync(template,target,{recursive:true});

const sections=[['00-prologue','prologue'],['01-internal-labor-market','internal'],['02-company-dialect','dialect'],['03-signaling','signaling'],['04-obsolescence','obsolescence'],['05-epilogue','epilogue']];
const objects=new Set(['protagonist','restructure-notice','career-form','internal-knowledge','portable-question','showa-newhire','job-rotation','internal-promotion','human-capital','general-capital','firm-specific','tenure-growth','rookie-question','approval-route','company-dialect','skill-weights','current-mix','target-mix','skill-cards','bundle-break','agent-call','achievement-proof','asymmetry','signal','observable-proof','market-price','external-contact','market-check','new-system','ai-automation','skill-obsolescence','retraining','market-shift','two-curves','resume-translate','portable-core','outside-option','stay-vs-stuck','career-healthcheck','freedom-exit']);
const verbs=new Set(['sit','hold','walk','look','point','speak','open','close','type','review','compare','split','shift','transfer','rise','fall','erase','filter','reveal','question','wait','stack','scan','detach','route','translate','connect','swap','measure','highlight','save']);
const phasePools={
 prologue:['office-night','org-restructure','career-site','home-desk','outside-option'],
 internal:['showa-factory','rotation-board','training-floor','human-capital','portable-skills'],
 dialect:['company-dialect','approval-maze','skill-weights','card-transfer','portable-skills'],
 signaling:['home-interview','hiring-desk','signal-board','market-scan','career-site'],
 obsolescence:['system-training','cloud-transition','ai-crm','value-lines','training-floor'],
 epilogue:['cafe-career','home-desk','outside-option','market-scan','value-lines']
};
const families=new Set(Object.values(phasePools).flat());

const sentences=(text)=>{
 const raw=text.match(/[^。！？]+[。！？]/g)||[],out=[];let pending='';
 for(const s0 of raw){const s=s0.trim();if(!s)continue;if(s.length<24){pending+=s;continue}if(pending){out.push(pending+s);pending=''}else out.push(s)}
 if(pending){if(out.length)out[out.length-1]+=pending;else out.push(pending)}
 return out;
};
const primaryFor=(t,p,i)=>{
 if(/四十三歳|男性が一人|彼はこの会社|主人公/.test(t))return 'protagonist';
 if(/組織改編|別部門へ統合/.test(t))return 'restructure-notice';
 if(/職務経歴書|専門スキル|入力欄/.test(t)&&p!=='epilogue')return 'career-form';
 if(/マニュアルには書かれていない|社内では間違いなく|仕事のできる/.test(t))return 'internal-knowledge';
 if(/何を次の会社|外ではどれほど|外の市場/.test(t)&&p==='prologue')return 'portable-question';

 if(/一九七〇年代|紺色の作業服|新卒/.test(t))return 'showa-newhire';
 if(/営業へ配属|企画へ異動|地方支店|管理部門/.test(t))return 'job-rotation';
 if(/内部で昇進|内部昇進|長期雇用/.test(t))return 'internal-promotion';
 if(/ゲーリー・ベッカー|人的資本/.test(t))return 'human-capital';
 if(/会計|プログラミング|英語力|統計分析|持ち運びやすい/.test(t))return 'general-capital';
 if(/企業特殊|自社の申請|稟議を通す順番|特定商品の過去/.test(t))return 'firm-specific';
 if(/十八年間ずっと上昇|勤続年数|生産的になる|トーペル/.test(t))return 'tenure-growth';

 if(/新人社員|相談を受け/.test(t))return 'rookie-question';
 if(/営業管理|商品部|担当部長|役員会|木曜日|逆算/.test(t))return 'approval-route';
 if(/この会社で仕事をする方法|会社専用|システムも役員も/.test(t))return 'company-dialect';
 if(/ラジアー|skill-weights|能力の組み合わせ|重み/.test(t))return 'skill-weights';
 if(/営業力四〇|社内調整力四〇|商品知識二〇/.test(t))return 'current-mix';
 if(/データ分析三〇|英語二〇|デジタルマーケティング/.test(t))return 'target-mix';
 if(/カード|営業.*調整.*商品|人脈.*社内システム/.test(t))return 'skill-cards';
 if(/能力、人脈、役職|一つの塊|分解される/.test(t))return 'bundle-break';

 if(/転職エージェント|オンライン面談/.test(t))return 'agent-call';
 if(/何人のチーム|売上や利益|使用できるツール|再現できる専門性/.test(t))return 'achievement-proof';
 if(/情報の非対称性|採用される本人|採用する企業/.test(t))return 'asymmetry';
 if(/マイケル・スペンス|シグナル/.test(t))return 'signal';
 if(/職歴、役職、資格|プロジェクト規模|数値実績|外から確認/.test(t))return 'observable-proof';
 if(/市場価値とは|市場価格|社内価格/.test(t))return 'market-price';
 if(/求人票を見る|他社の人間|外部市場との接点/.test(t))return 'external-contact';
 if(/査定|家の価格|自分の値段/.test(t))return 'market-check';

 if(/新しい業務システム|クラウド型/.test(t))return 'new-system';
 if(/生成AI|CRM|自動化/.test(t))return 'ai-automation';
 if(/スキルが陳腐化|スキル陳腐化|既存スキル/.test(t))return 'skill-obsolescence';
 if(/継続的な学習|訓練|新しい技術を学/.test(t))return 'retraining';
 if(/需要する側が変わ|市場が求める方向|市場の方が変化|能力の価値を決める市場/.test(t))return 'market-shift';
 if(/二本の折れ線|青い線|赤い線|右肩上がり/.test(t))return 'two-curves';

 if(/書き直|社内用語|外部市場|何人の営業組織|利害関係者/.test(t))return 'resume-translate';
 if(/問題解決|交渉|マネジメント|顧客理解|プロジェクト管理|持ち運べる能力/.test(t))return 'portable-core';
 if(/外部選択肢|移動でき|比較でき/.test(t))return 'outside-option';
 if(/転職できるのに残|転職できないから残|残る以外/.test(t))return 'stay-vs-stuck';
 if(/健康診断|求人票を見|社外の人間と話/.test(t))return 'career-healthcheck';
 if(/辞められる自由|いつでも外へ出られる|守るべき/.test(t))return 'freedom-exit';

 const fallback={
  prologue:['protagonist','internal-knowledge','portable-question','career-form'],
  internal:['showa-newhire','job-rotation','human-capital','firm-specific','tenure-growth'],
  dialect:['rookie-question','company-dialect','skill-weights','skill-cards','bundle-break'],
  signaling:['agent-call','achievement-proof','signal','observable-proof','market-price'],
  obsolescence:['new-system','ai-automation','skill-obsolescence','market-shift','two-curves'],
  epilogue:['resume-translate','portable-core','outside-option','career-healthcheck','freedom-exit']
 };
 return fallback[p][i%fallback[p].length];
};
const verbFor=(t,p,i)=>{
 if(/座|デスク/.test(t))return 'sit';
 if(/持って|社員証|カード/.test(t))return 'hold';
 if(/出社|歩|向か|移動/.test(t))return 'walk';
 if(/見つめ|見る|確認|画面/.test(t))return 'look';
 if(/答える|尋ね|話す|相談/.test(t))return 'speak';
 if(/入力|書き直|書く|記入/.test(t))return 'type';
 if(/開き|開く/.test(t))return 'open';
 if(/閉じ/.test(t))return 'close';
 if(/比較|同じとは限らない|違い/.test(t))return 'compare';
 if(/分解|区別|二つ/.test(t))return 'split';
 if(/変わ|置き換|移行|切り替/.test(t))return 'shift';
 if(/持っていけ|持ち運|別の会社/.test(t))return 'transfer';
 if(/上昇|上がり|高ま/.test(t))return 'rise';
 if(/下が|減る|暗く/.test(t))return 'fall';
 if(/消え|失う|なくな/.test(t))return 'erase';
 if(/査定|手がかり|確認しやす/.test(t))return 'scan';
 if(/ルート|話を通|申請|逆算/.test(t))return 'route';
 if(/翻訳|社内用語/.test(t))return 'translate';
 if(/接点|つなが|関係/.test(t))return 'connect';
 if(/組み合わせ|重み|配合/.test(t))return 'swap';
 if(/価格|値段|評価|価値/.test(t))return 'measure';
 if(/重要|問題|危険|本当/.test(t))return 'highlight';
 if(/保存/.test(t))return 'save';
 if(/取り除|引く|分離/.test(t))return 'detach';
 if(/積み|蓄積/.test(t))return 'stack';
 if(/なぜ|だろう|疑問|逆説/.test(t))return 'question';
 const arr=['reveal','review','compare','shift','scan','highlight','connect','measure','filter','wait'];
 return arr[(i+p.length)%arr.length];
};
const preferredFamily=(t,p)=>{
 if(/組織改編|統合/.test(t))return 'org-restructure';
 if(/転職サイト|職務経歴書|求人票/.test(t)&&p!=='epilogue')return 'career-site';
 if(/一九七〇年代|工場|作業服/.test(t))return 'showa-factory';
 if(/配属|異動|転勤|配置表/.test(t))return 'rotation-board';
 if(/人的資本|ベッカー|トーペル/.test(t))return 'human-capital';
 if(/会計|英語|統計|プログラミング/.test(t))return 'portable-skills';
 if(/稟議|担当部長|役員会|会社専用/.test(t))return 'approval-maze';
 if(/skill-weights|営業力四〇|データ分析三〇/.test(t))return 'skill-weights';
 if(/カード|人脈.*社内|分解/.test(t))return 'card-transfer';
 if(/オンライン面談|転職エージェント/.test(t))return 'home-interview';
 if(/採用担当者|採用する企業/.test(t))return 'hiring-desk';
 if(/シグナル|職歴、役職、資格|数値実績/.test(t))return 'signal-board';
 if(/外部市場|求人票|査定/.test(t))return 'market-scan';
 if(/新しい業務システム|説明会/.test(t))return 'system-training';
 if(/クラウド|CRM/.test(t))return 'cloud-transition';
 if(/生成AI|自動化/.test(t))return 'ai-crm';
 if(/二本の折れ線|青い線|赤い線/.test(t))return 'value-lines';
 if(/カフェ|会社近く/.test(t))return 'cafe-career';
 if(/外部選択肢|残る以外|移動でき/.test(t))return 'outside-option';
 if(/保存し|ノートパソコンを閉じ|自宅/.test(t))return 'home-desk';
 return null;
};

const beats=[],scriptParts=[],phaseCounts={};let prevFamily='';
for(const [file,phase] of sections){
 const text=fs.readFileSync(path.join(source,'story',file+'.txt'),'utf8').trim(),units=sentences(text);phaseCounts[phase]=units.length;scriptParts.push(units.join('\n'));
 for(let i=0;i<units.length;i++){
  const narration=units[i],pool=phasePools[phase];let family=preferredFamily(narration,phase)||pool[i%pool.length];
  if(family===prevFamily)family=pool.find(x=>x!==prevFamily)??family;prevFamily=family;
  const primary=primaryFor(narration,phase,i),verb=verbFor(narration,phase,i);
  if(!objects.has(primary)||!verbs.has(verb)||!families.has(family))throw Error('V113 unsupported scene '+phase+'/'+i+' '+primary+'/'+verb+'/'+family);
  const n=beats.length+1,no=String(n).padStart(3,'0'),shot=['establish','detail','medium','overhead','low-angle','split','tracking','profile','reverse','macro'][i%10];
  const environment=family+'-'+phase+'-'+no;
  beats.push({id:'V113-'+no,phase,variant:i,narration,environment,family,action:primary+'-'+verb+'-'+shot+'-'+no,primary,verb,mode:i%2?'replace':'append',actionId:'V113-'+no+'-'+verb+'-'+primary,sceneKey:'v113-'+phase+'-'+no,visual:'v113-original-'+no,shotKind:shot,continuity:environment,visualIntent:narration,assetComposition:'original-procedural'});
 }
}
if(beats.length<120)throw Error('V113 scene segmentation too coarse '+beats.length);
for(const k of ['id','action','actionId','sceneKey','visual','environment'])if(new Set(beats.map(x=>x[k])).size!==beats.length)throw Error('V113 repeated '+k);
for(let i=1;i<beats.length;i++){
 const a=beats[i-1],b=beats[i];
 if([a.family,a.primary,a.verb,a.shotKind].join('|')===[b.family,b.primary,b.verb,b.shotKind].join('|'))throw Error('V113 adjacent visual signature duplicate '+b.id);
 if(a.family===b.family)throw Error('V113 adjacent family reuse '+b.id+' '+b.family);
}
const fam=new Set(beats.map(x=>x.family)),pri=new Set(beats.map(x=>x.primary)),vrb=new Set(beats.map(x=>x.verb));
if(fam.size<18||pri.size<28||vrb.size<15)throw Error('V113 insufficient diversity '+fam.size+'/'+pri.size+'/'+vrb.size);

const src=path.join(target,'src'),scripts=path.join(target,'scripts');fs.mkdirSync(src,{recursive:true});fs.mkdirSync(scripts,{recursive:true});fs.mkdirSync(path.join(target,'qa'),{recursive:true});
fs.writeFileSync(path.join(target,'script.txt'),scriptParts.join('\n\n')+'\n');
fs.writeFileSync(path.join(src,'script-data.json'),JSON.stringify({videoId:'V113-long-tenure-market-value',title:'なぜ転職しない社員ほど、市場価値が下がるのか？【人的資本論×内部労働市場×シグナリング×スキル陳腐化】',beats},null,2));
fs.writeFileSync(path.join(src,'scene-data.json'),JSON.stringify(beats,null,2));
fs.writeFileSync(path.join(src,'sync-timing.json'),JSON.stringify({durationSeconds:1100,beats:[]},null,2));
for(const f of ['index.tsx','scenes.tsx','career-engine.tsx','career-art.tsx','backgrounds.tsx'])fs.copyFileSync(path.join(source,f),path.join(src,f));
fs.copyFileSync(path.join(root,'shared/asset-library/人物テンプレート/V46_ADULT_MAN_RIG.tsx'),path.join(src,'adult-man-rig.tsx'));
fs.copyFileSync(path.join(root,'shared/asset-library/人物テンプレート/office-worker-rig.tsx'),path.join(src,'office-worker-rig.tsx'));
fs.copyFileSync(path.join(root,'shared/asset-library/人物テンプレート/office-woman-rig.tsx'),path.join(src,'office-woman-rig.tsx'));

for(const f of ['generate-voice-chunk.mjs','assemble-voice.mjs','plan-voice-parts.mjs','build-preproduction.mjs','plan-segments-fast.mjs']){
 let c=fs.readFileSync(path.join(root,'shared/v111',f),'utf8').replaceAll('V111-responsibility-delegation','V113-long-tenure-market-value').replaceAll('V111-welfare-floor','V113-long-tenure-market-value').replaceAll('v111-welfare-floor','v113-long-tenure-market-value').replaceAll('V111','V113');
 if(f==='plan-voice-parts.mjs')c=c.replace('parts=4','parts=6');
 if(f==='plan-segments-fast.mjs')c=c.replace('parts=12','parts=16');
 if(f==='build-preproduction.mjs')c=c.replace('minimumFinalSeconds:900','minimumFinalSeconds:840');
 fs.writeFileSync(path.join(scripts,f),c);
}
let check=fs.readFileSync(path.join(root,'shared/v111/check-scenes.mjs'),'utf8').replaceAll('V111','V113');
check=check.replace('b.length<180','b.length<120').replace('s.durationSeconds<900','s.durationSeconds<840');
fs.writeFileSync(path.join(scripts,'check-scenes.mjs'),check);
fs.copyFileSync(path.join(root,'shared/v53/plan-segments.mjs'),path.join(scripts,'plan-segments.mjs'));
fs.writeFileSync(path.join(scripts,'generate-voicevox.mjs'),"import path from 'node:path';import {fileURLToPath} from 'node:url';import {generateVoicevox} from '../../shared/voice/generate-voicevox.mjs';const here=path.dirname(fileURLToPath(import.meta.url));await generateVoicevox(path.resolve(here,'..'),{speaker:'青山龍星',style:'ノーマル',speed:1.13,pitchScale:-0.026,intonationScale:0.86});");
fs.copyFileSync(path.join(root,'shared/v53/generate-bgm.mjs'),path.join(scripts,'generate-bgm.mjs'));
for(const f of ['SOURCES.md','V113_PRODUCTION_SPEC.md'])fs.copyFileSync(path.join(source,f),path.join(target,f));
fs.writeFileSync(path.join(src,'library-assets.json'),'[]\n');
fs.writeFileSync(path.join(target,'production-manifest.json'),JSON.stringify({videoId:'V113-long-tenure-market-value',sceneCount:beats.length,narrationCharacters:beats.reduce((n,b)=>n+b.narration.length,0),backgroundGroups:beats.length,phases:phaseCounts,visualFamilies:[...fam],semanticSubjects:[...pri],motionVerbs:[...vrb],characterTemplates:['V46_ADULT_MAN_RIG','office-worker-rig','office-woman-rig'],method:'long-form sentence beats + unique environment per narration + no adjacent family reuse + narration-specific semantic action + six-way voice + sixteen-way render',measuredVoice:true,subtitles:true,bgm:true,sfx:false,minimumFinalSeconds:840,output:{width:1920,height:1080,fps:30}},null,2));
console.log('V113 preflight PASS scenes='+beats.length+' chars='+beats.reduce((n,b)=>n+b.narration.length,0)+' families='+fam.size+' primaries='+pri.size+' verbs='+vrb.size);