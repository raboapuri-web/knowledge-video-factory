import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd(),name='v116-middle-class-welfare',target=path.join(root,name),template=path.join(root,'v44-interaction-attraction'),source=path.join(root,'shared/v116');
if(!fs.existsSync(template))throw Error('V116 Remotion template unavailable');
fs.rmSync(target,{recursive:true,force:true});fs.cpSync(template,target,{recursive:true});

const sections=[['00-prologue','prologue'],['01-mpc','mpc'],['02-depression','depression'],['03-multiplier','multiplier'],['04-fiscal-inequality','fiscal'],['05-design','design'],['06-epilogue','epilogue']];
const phasePools={
 prologue:['supermarket-aisle','checkout','residential-bike','store-backoffice','shift-board','middle-home','restaurant','student-room','clothing-store'],
 mpc:['lowincome-household','affluent-household','money-flow','supermarket-aisle','checkout','middle-home'],
 depression:['depression-factory','depression-home','main-street','social-security-1935','automatic-stabilizer'],
 multiplier:['town-map','local-multiplier','service-strip','supermarket-aisle','restaurant','clothing-store'],
 fiscal:['government-budget','fiscal-chain','inequality-flow','automatic-stabilizer','money-flow'],
 design:['policy-design','government-budget','middle-home','safety-net','inequality-flow'],
 epilogue:['supermarket-return','middle-home','safety-net','money-flow','town-map']
};
const primaries=new Set(['mother','basket','support','manager','shift','middleworker','restaurant','student','clothing','twohouseholds','bills','savings','mpc','spendingflow','chain','heterogeneous','depression','thrift','socialsecurity','stabilizer','townmap','cashtransfer','multiplier','spillover','businesscut','budget','fiscal','inequality','saving','tax','benefitcliff','design','lifeshock','safetynet','connected','floor']);
const verbs=new Set(['sit','hold','walk','look','point','speak','open','close','review','compare','split','transfer','rise','fall','remove','cut','spread','highlight','connect','save','wait']);

const sentences=(text)=>{const raw=text.match(/[^。！？]+[。！？]/g)||[],out=[];let pending='';for(const s0 of raw){const s=s0.trim();if(!s)continue;if(s.length<24){pending+=s;continue}if(pending){out.push(pending+s);pending=''}else out.push(s)}if(pending){if(out.length)out[out.length-1]+=pending;else out.push(pending)}return out;};

const primaryFor=(t,p,i)=>{
 if(/女性が買い物|女性は会計|母親|生活に余裕/.test(t))return 'mother';
 if(/牛肉|洗剤|靴も来月|買い物.*削/.test(t))return 'basket';
 if(/可処分所得|二万円ほど減|使えるお金/.test(t))return 'support';
 if(/店長.*売上|売上表|客単価/.test(t))return 'manager';
 if(/シフト|勤務時間/.test(t))return 'shift';
 if(/四十代の女性|中間層.*パート|中間層の女性店員/.test(t))return 'middleworker';
 if(/焼肉|外食|飲食店/.test(t))return 'restaurant';
 if(/大学生|採用/.test(t))return 'student';
 if(/衣料品|ジャケット|買い物延期/.test(t))return 'clothing';
 if(/同じ一万円|二つの銀行口座/.test(t))return 'twohouseholds';
 if(/請求書|靴底|冷蔵庫|先延ばし/.test(t))return 'bills';
 if(/預金|貯蓄/.test(t)&&p==='mpc')return 'savings';
 if(/限界消費性向/.test(t))return 'mpc';
 if(/支出.*所得|給料.*美容院|美容師/.test(t))return 'spendingflow';
 if(/一万円.*移動|複数の取引|連鎖/.test(t))return 'chain';
 if(/異質的家計|家計ごとの消費反応/.test(t))return 'heterogeneous';
 if(/一九三二|工場|失業した労働者/.test(t))return 'depression';
 if(/節約|合成の誤謬/.test(t))return 'thrift';
 if(/一九三五|Social Security Act|制度形成/.test(t))return 'socialsecurity';
 if(/自動安定化装置/.test(t))return 'stabilizer';
 if(/町の地図|地域経済/.test(t))return 'townmap';
 if(/現金移転|支援を受けた世帯/.test(t))return 'cashtransfer';
 if(/乗数|multiplier/.test(t))return 'multiplier';
 if(/非受給|波及/.test(t))return 'spillover';
 if(/残業|新規採用|賞与|人件費|雇用調整/.test(t))return 'businesscut';
 if(/一千億|八百億|歳出|政府.*会議/.test(t))return 'budget';
 if(/財政乗数/.test(t))return 'fiscal';
 if(/格差|所得の分布/.test(t))return 'inequality';
 if(/消費へ回る割合|貯蓄へ回る割合|貯蓄は投資/.test(t))return 'saving';
 if(/税を増や|税、保険料|財源/.test(t))return 'tax';
 if(/給付.*壁|所得が少し増え/.test(t))return 'benefitcliff';
 if(/制度設計|どの家計へ/.test(t))return 'design';
 if(/会社の倒産|病気|介護|離婚|所得ショック/.test(t))return 'lifeshock';
 if(/セーフティーネット|ネットには/.test(t))return 'safetynet';
 if(/財布.*つなが|購買力.*給与へ戻/.test(t))return 'connected';
 if(/経済という建物の床|同じ床/.test(t))return 'floor';
 const fallback={prologue:['mother','basket','manager','shift','middleworker','restaurant','student','clothing'],mpc:['twohouseholds','bills','savings','mpc','spendingflow','chain','heterogeneous'],depression:['depression','thrift','socialsecurity','stabilizer'],multiplier:['townmap','cashtransfer','multiplier','spillover','businesscut'],fiscal:['budget','fiscal','inequality','saving'],design:['tax','benefitcliff','design','lifeshock'],epilogue:['middleworker','safetynet','connected','floor']};
 return fallback[p][i%fallback[p].length];
};
const verbFor=(t,p,i)=>{
 if(/座|会議室|デスク/.test(t))return 'sit';
 if(/手に取|持/.test(t))return 'hold';
 if(/帰って|歩|並ん|向か/.test(t))return 'walk';
 if(/見|確認|気づ/.test(t))return 'look';
 if(/説明|話|答/.test(t))return 'speak';
 if(/開き|開く/.test(t))return 'open';
 if(/閉め|閉じ/.test(t))return 'close';
 if(/減ら|削|見送|戻す/.test(t))return 'cut';
 if(/消え|失わ|取り除/.test(t))return 'remove';
 if(/移動|届|渡|支給/.test(t))return 'transfer';
 if(/波及|連鎖|広が/.test(t))return 'spread';
 if(/増え|上が/.test(t))return 'rise';
 if(/落ち|下が|減少/.test(t))return 'fall';
 if(/二つ|一方|別の/.test(t))return 'split';
 if(/重要|問題|危険|ポイント/.test(t))return 'highlight';
 if(/つなが|関係|ネット/.test(t))return 'connect';
 if(/維持|守|抑え/.test(t))return 'save';
 const arr=['review','compare','look','highlight','connect','wait','point'];
 return arr[(i+p.length)%arr.length];
};
const preferredFamily=(t,p)=>{
 if(/スーパー.*棚|牛肉|洗剤/.test(t))return 'supermarket-aisle';
 if(/レジ|会計/.test(t))return p==='epilogue'?'supermarket-return':'checkout';
 if(/自転車|住宅街/.test(t))return 'residential-bike';
 if(/店長|売上表/.test(t))return 'store-backoffice';
 if(/シフト/.test(t))return 'shift-board';
 if(/中間層.*家庭|住宅ローン/.test(t))return 'middle-home';
 if(/焼肉|飲食店/.test(t))return 'restaurant';
 if(/大学生/.test(t))return 'student-room';
 if(/衣料品|ジャケット/.test(t))return 'clothing-store';
 if(/預金がほとんど|請求書|低所得/.test(t)&&p==='mpc')return 'lowincome-household';
 if(/十分な預金|余裕ある/.test(t))return 'affluent-household';
 if(/支出.*所得|一万円.*移動|消費.*所得/.test(t))return 'money-flow';
 if(/一九三二|工場/.test(t))return 'depression-factory';
 if(/失職.*家|家計を守/.test(t))return 'depression-home';
 if(/衣料品店|家具店|レストラン.*売上/.test(t)&&p==='depression')return 'main-street';
 if(/一九三五|Social Security Act/.test(t))return 'social-security-1935';
 if(/自動安定化装置|失業給付.*増/.test(t))return 'automatic-stabilizer';
 if(/町の地図/.test(t))return 'town-map';
 if(/地域乗数|波及.*企業|非受給/.test(t))return 'local-multiplier';
 if(/美容院|整備工場|学習塾|業種/.test(t))return 'service-strip';
 if(/政府.*会議|一千億|八百億/.test(t))return 'government-budget';
 if(/二次効果|財政乗数|売上.*雇用所得/.test(t))return 'fiscal-chain';
 if(/所得.*下から上|格差|分布/.test(t))return 'inequality-flow';
 if(/税|国債|行政コスト|制度設計/.test(t))return 'policy-design';
 if(/セーフティーネット|ネットには/.test(t))return 'safety-net';
 return null;
};

const beats=[],scriptParts=[];let prevFamily='';
for(const [file,phase] of sections){
 const text=fs.readFileSync(path.join(source,'story',file+'.txt'),'utf8').trim(),units=sentences(text);scriptParts.push(units.join('\n'));
 for(let i=0;i<units.length;i++){
  const narration=units[i],pool=phasePools[phase];let family=preferredFamily(narration,phase)||pool[i%pool.length];
  if(family===prevFamily)family=pool.find(x=>x!==prevFamily)??family;prevFamily=family;
  const primary=primaryFor(narration,phase,i),verb=verbFor(narration,phase,i);
  if(!primaries.has(primary)||!verbs.has(verb))throw Error('V116 unsupported scene '+phase+'/'+i+' '+primary+'/'+verb);
  const n=beats.length+1,no=String(n).padStart(3,'0'),shot=['establish','detail','medium','overhead','low-angle','split','tracking','profile','reverse','macro'][i%10],environment=family+'-'+phase+'-'+no;
  beats.push({id:'V116-'+no,phase,variant:i,narration,environment,family,action:primary+'-'+verb+'-'+shot+'-'+no,primary,verb,mode:i%2?'replace':'append',actionId:'V116-'+no+'-'+verb+'-'+primary,sceneKey:'v116-'+phase+'-'+no,visual:'v116-original-'+no,shotKind:shot,continuity:environment,visualIntent:narration,assetComposition:'original-procedural'});
 }
}
if(beats.length<100)throw Error('V116 too few scenes '+beats.length);
for(const k of ['id','action','actionId','sceneKey','visual','environment'])if(new Set(beats.map(x=>x[k])).size!==beats.length)throw Error('V116 repeated '+k);
for(let i=1;i<beats.length;i++){const a=beats[i-1],b=beats[i];if(a.family===b.family)throw Error('V116 adjacent family reuse '+b.id);if([a.family,a.primary,a.verb,a.shotKind].join('|')===[b.family,b.primary,b.verb,b.shotKind].join('|'))throw Error('V116 similar adjacent cut '+b.id)}
const fam=new Set(beats.map(x=>x.family)),pri=new Set(beats.map(x=>x.primary)),vrb=new Set(beats.map(x=>x.verb));
if(fam.size<20||pri.size<28||vrb.size<12)throw Error('V116 insufficient diversity '+fam.size+'/'+pri.size+'/'+vrb.size);

const src=path.join(target,'src'),scripts=path.join(target,'scripts');fs.mkdirSync(src,{recursive:true});fs.mkdirSync(scripts,{recursive:true});fs.mkdirSync(path.join(target,'qa'),{recursive:true});
fs.writeFileSync(path.join(target,'script.txt'),scriptParts.join('\n\n')+'\n');
fs.writeFileSync(path.join(src,'script-data.json'),JSON.stringify({videoId:'V116-middle-class-welfare',title:'なぜ貧困層への支援を削ると「中間層」まで貧しくなるのか？【マクロ経済学×社会保障×格差研究】',beats},null,2));
fs.writeFileSync(path.join(src,'scene-data.json'),JSON.stringify(beats,null,2));
fs.writeFileSync(path.join(src,'sync-timing.json'),JSON.stringify({durationSeconds:950,beats:[]},null,2));
for(const f of ['index.tsx','scenes.tsx','welfare-engine.tsx','welfare-art.tsx','backgrounds.tsx'])fs.copyFileSync(path.join(source,f),path.join(src,f));
fs.copyFileSync(path.join(root,'shared/asset-library/人物テンプレート/office-worker-rig.tsx'),path.join(src,'office-worker-rig.tsx'));
fs.copyFileSync(path.join(root,'shared/asset-library/人物テンプレート/office-woman-rig.tsx'),path.join(src,'office-woman-rig.tsx'));
fs.copyFileSync(path.join(root,'shared/v53/generate-bgm.mjs'),path.join(scripts,'generate-bgm.mjs'));
fs.copyFileSync(path.join(root,'shared/v53/plan-segments.mjs'),path.join(scripts,'plan-segments.mjs'));
fs.writeFileSync(path.join(scripts,'generate-voicevox.mjs'),"import path from 'node:path';import {fileURLToPath} from 'node:url';import {generateVoicevox} from '../../shared/voice/generate-voicevox.mjs';const here=path.dirname(fileURLToPath(import.meta.url));await generateVoicevox(path.resolve(here,'..'),{speaker:'青山龍星',style:'ノーマル',speed:1.13,pitchScale:-0.026,intonationScale:0.86});");
fs.writeFileSync(path.join(scripts,'build-preproduction.mjs'),"import fs from 'node:fs';const b=JSON.parse(fs.readFileSync('./src/scene-data.json','utf8')),phases={},families={},verbs={},primaries={};for(const s of b){phases[s.phase]=(phases[s.phase]||0)+1;families[s.family]=(families[s.family]||0)+1;verbs[s.verb]=(verbs[s.verb]||0)+1;primaries[s.primary]=(primaries[s.primary]||0)+1;}fs.mkdirSync('./qa',{recursive:true});fs.writeFileSync('./preproduction-plan.json',JSON.stringify({videoId:'V116-middle-class-welfare',sceneCount:b.length,scenes:b},null,2));fs.writeFileSync('./qa/preproduction-summary.json',JSON.stringify({videoId:'V116-middle-class-welfare',sceneCount:b.length,phaseCounts:phases,uniqueActions:new Set(b.map(x=>x.actionId)).size,backgroundGroups:new Set(b.map(x=>x.environment)).size,visualFamilies:families,motionVerbs:verbs,semanticSubjects:primaries,minimumFinalSeconds:780},null,2));");
for(const f of ['SOURCES.md','V116_PRODUCTION_SPEC.md'])fs.copyFileSync(path.join(source,f),path.join(target,f));
console.log('V116 preflight PASS scenes='+beats.length+' chars='+beats.reduce((n,b)=>n+b.narration.length,0)+' families='+fam.size+' primaries='+pri.size+' verbs='+vrb.size);
