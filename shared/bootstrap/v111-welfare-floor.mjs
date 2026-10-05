import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';

const root=process.cwd(),name='v111-welfare-floor',target=path.join(root,name),template=path.join(root,'v44-interaction-attraction'),source=path.join(root,'shared/v111');
if(!fs.existsSync(template))throw Error('V111 Remotion template unavailable');
fs.rmSync(target,{recursive:true,force:true});fs.cpSync(template,target,{recursive:true});

const sections=[['00-prologue','prologue'],['01-floor','floor'],['02-cost-shift','cost'],['03-crime','crime'],['04-who-protected','protected'],['05-epilogue','epilogue']];
const objects=new Set('unemployed-man taxpayer-woman landlord doctor municipal police family worker crowd researcher rent-notice utility-bill wallet resume application law-card hospital-bill tax-ledger mortgage insurance-card medicine-bottle budget-card savings-fall food-compression support-floor poverty-spiral prerequisite-chain cost-shift housing-trial housing-offset externality-flow crime-branches ssi-timeline budget-transfer denmark-ripple finland-null choice-space life-risk downturn-loop stabilizer-buffer four-reasons risk-ladder ship-decks phone fridge mailbox charging eviction ambulance job-search interview address-loss station-sleep collapse company-failure illness divorce home-sale welfare-application emergency-exit floor-vs-hole taxpayer-recipient social-floor safety-net bill-recipient options-narrow last-insurance fire-extinguisher sinking-ship public-cost'.split(' '));
const verbs=new Set('sit hold walk look point speak sleep open close apply interview call pay cut charge evict erase pack rescue treat transfer respond spend save tax compare reduce cascade vanish connect shift branch split ripple buffer loop narrow stabilize insure reveal question sink rise wait repeat return'.split(' '));
const familyList='one-room warehouse job-center apartment street-night station hospital admin supermarket shelter family-home office research abstract cost-map justice convenience bank city macro building ship phone subway emergency'.split(' ');

const splitLong=(s)=>{if(s.length<=78)return[s];const parts=s.split(/(?<=、)/).map(x=>x.trim()).filter(Boolean),out=[];let cur='';for(const p of parts){if(cur&&(cur+p).length>70){out.push(/[。！？]$/.test(cur)?cur:cur+'。');cur=p}else cur+=p}if(cur)out.push(/[。！？]$/.test(cur)?cur:cur+'。');return out};
const segment=(text)=>{const raw=(text.match(/[^。！？]+[。！？]/g)||[]).flatMap(splitLong),out=[];let cur='';for(const s of raw){if(!cur){cur=s;continue}if(cur.length<28&&(cur+s).length<=68){cur+=s;continue}out.push(cur);cur=s}if(cur)out.push(cur);return out.flatMap(s=>s.length>82?splitLong(s):[s]).filter(Boolean)};

const primaryFor=(t,p,i)=>{
 if(/四十七歳|男が|彼は|彼を|失業した男/.test(t))return 'unemployed-man';
 if(/督促|家賃.*払込|家賃.*滞納/.test(t))return 'rent-notice';
 if(/電気料金/.test(t))return 'utility-bill';
 if(/財布|二千円|千円札/.test(t))return 'wallet';
 if(/倉庫/.test(t))return 'worker';
 if(/仕事を探|再就職|採用/.test(t)&&!/女性/.test(t))return 'job-search';
 if(/面接/.test(t))return 'interview';
 if(/貯金/.test(t))return 'savings-fall';
 if(/コンビニ弁当|カップ麺|一日二食|食パン|マヨネーズ/.test(t))return 'food-compression';
 if(/冷蔵庫/.test(t))return 'fridge';
 if(/生活保護法第一条|最低限度の生活.*自立/.test(t))return 'law-card';
 if(/生活保護|最後の制度|最低地点|最低ライン|最後の床/.test(t)&&/申請|制度/.test(t))return 'welfare-application';
 if(/生活保護.*なく|床を外|底のない穴/.test(t))return 'floor-vs-hole';
 if(/住所がなく|住所を失/.test(t))return 'address-loss';
 if(/郵便物|住所を書く/.test(t))return 'mailbox';
 if(/充電/.test(t))return 'charging';
 if(/履歴書/.test(t))return 'resume';
 if(/清潔な服|電話を受ける|眠れる場所|仕事を探すため/.test(t))return 'prerequisite-chain';
 if(/大家/.test(t))return 'landlord';
 if(/救急車/.test(t))return 'ambulance';
 if(/病院|医療機関|医療制度/.test(t)&&!/費用/.test(t))return 'doctor';
 if(/自治体|行政/.test(t))return 'municipal';
 if(/警察/.test(t)&&!/警察、裁判所|警察や司法/.test(t))return 'police';
 if(/家族/.test(t)&&!/家族との死別/.test(t))return 'family';
 if(/請求書の宛先|誰が払うか/.test(t))return 'bill-recipient';
 if(/財政負担|税金が使われ|制度の総コスト|公的コスト/.test(t))return 'budget-card';
 if(/底より上|社会の底|最下層/.test(t))return 'social-floor';

 if(/支える人と、支えられる人|税金を払う側|受け取る側/.test(t))return 'taxpayer-recipient';
 if(/利用できる資産|最低生活費|差を補う/.test(t))return 'application';
 if(/人間が再び社会|自己回復/.test(t))return 'support-floor';
 if(/一万円足りない|携帯電話が止|採用連絡|下向きの循環/.test(t))return 'poverty-spiral';
 if(/所得、資産、住居、健康/.test(t))return 'risk-ladder';

 if(/家を失った|部屋を失う|住宅を失/.test(t))return 'eviction';
 if(/冬の夜|駅のベンチ|路上/.test(t))return 'station-sleep';
 if(/糖尿病|薬を飲ま|薬/.test(t))return 'medicine-bottle';
 if(/倒れる|体調が悪化/.test(t))return 'collapse';
 if(/救急という/.test(t))return 'ambulance';
 if(/入院が29|入院日数が29|救急外来受診が24/.test(t))return 'housing-trial';
 if(/Housing First|約半分|ケースマネジメント/.test(t))return 'housing-offset';
 if(/住宅費を削|生活費を削|福祉職員を減|制度ごとに独立/.test(t))return 'cost-shift';
 if(/工場|廃液|川へ流|外部性/.test(t))return 'externality-flow';
 if(/別の場所へ流|費用.*移/.test(t))return 'public-cost';

 if(/慎重|貧しい人.*犯罪者|大部分は犯罪を犯さない|暴力犯罪/.test(t))return 'crime-branches';
 if(/犯罪経済学|財産犯罪|重大な暴力/.test(t))return 'crime-branches';
 if(/SSI|1996年|18歳|20年間|刑事告発|20％増/.test(t))return 'ssi-timeline';
 if(/警察、裁判所、刑務所|福祉予算から/.test(t))return 'budget-transfer';
 if(/デンマーク|近隣住民|波及/.test(t))return 'denmark-ripple';
 if(/フィンランド|2000人|560ユーロ|有意な変化/.test(t))return 'finland-null';
 if(/夜中のコンビニ|財布には何も|三日まとも|眠る場所/.test(t))return 'choice-space';
 if(/合法的な選択肢|選択肢は狭|危険な選択肢/.test(t))return 'options-narrow';

 if(/会社員の女性|四十二歳|年収五百万円|彼女/.test(t))return 'taxpayer-woman';
 if(/税金を払い|社会保険料/.test(t))return 'tax-ledger';
 if(/住宅ローン/.test(t))return 'mortgage';
 if(/会社が倒産/.test(t))return 'company-failure';
 if(/病気が見つ/.test(t))return 'illness';
 if(/離婚/.test(t))return 'divorce';
 if(/住宅を手放/.test(t))return 'home-sale';
 if(/支える側|支えられる側|納税者.*受給者/.test(t))return 'taxpayer-recipient';
 if(/病気。失業。障害。介護|家族との死別/.test(t))return 'life-risk';
 if(/一番最後の保険/.test(t))return 'last-insurance';
 if(/不況|失業が増|所得が減|消費を減|売上が落|会社が人を減/.test(t))return 'downturn-loop';
 if(/自動安定化|約60％|可処分所得/.test(t))return 'stabilizer-buffer';
 if(/一つ目は|二つ目は|三つ目は|四つ目は/.test(t))return 'four-reasons';
 if(/非常階段|高層ビル/.test(t))return 'emergency-exit';

 if(/消火器/.test(t))return 'fire-extinguisher';
 if(/非常口/.test(t))return 'emergency-exit';
 if(/一艘の船|一等船室|二等船室|最も安い部屋/.test(t))return 'ship-decks';
 if(/船底に穴|水は、下から|船は、下から沈/.test(t))return 'sinking-ship';
 if(/我々全員が立って|張られた板/.test(t))return 'safety-net';

 const fall={prologue:['unemployed-man','prerequisite-chain','cost-shift'],floor:['taxpayer-recipient','support-floor','poverty-spiral'],cost:['cost-shift','public-cost','externality-flow'],crime:['crime-branches','ssi-timeline','choice-space'],protected:['taxpayer-woman','life-risk','stabilizer-buffer'],epilogue:['public-cost','emergency-exit','safety-net']}[p];
 return fall[i%fall.length];
};

const verbFor=(t,p,i)=>{
 if(/座って/.test(t))return 'sit';
 if(/財布|書類|スマートフォン/.test(t)&&/手|残って|置か/.test(t))return 'hold';
 if(/探した|面接にも行/.test(t))return /面接/.test(t)?'interview':'apply';
 if(/応募|申請/.test(t))return 'apply';
 if(/電話/.test(t))return 'call';
 if(/家賃を払い|税金を払い|返している/.test(t))return /税金|保険料/.test(t)?'tax':'pay';
 if(/削った|減らす|削減/.test(t))return 'reduce';
 if(/止まる|切れ/.test(t))return 'cut';
 if(/部屋を失|家を失|手放す/.test(t))return 'evict';
 if(/住所がなく|住所を失/.test(t))return 'erase';
 if(/救急車|救急という/.test(t))return 'rescue';
 if(/病院|医療|治療/.test(t))return 'treat';
 if(/請求書の宛先|誰が払う|別の予算|移動した/.test(t))return 'shift';
 if(/負担が移る|コスト.*移|費用.*流/.test(t))return 'transfer';
 if(/貯金を崩|貯金が減/.test(t))return 'save';
 if(/支出|費用|コスト/.test(t)&&/増|発生|高価/.test(t))return 'charge';
 if(/制度.*なく|消える|失う|なくなる/.test(t))return 'vanish';
 if(/下向き|循環/.test(t))return 'loop';
 if(/落下|落ちる/.test(t))return 'cascade';
 if(/つなが|関係|結びつ/.test(t))return 'connect';
 if(/分け|二種類|別の人種/.test(t))return 'split';
 if(/波及/.test(t))return 'ripple';
 if(/ショック|和らげ|相殺|安定化/.test(t))return 'buffer';
 if(/選択肢.*狭|狭く/.test(t))return 'narrow';
 if(/最低ライン|床|保険/.test(t))return 'insure';
 if(/下から沈|水は.*入/.test(t))return 'sink';
 if(/再び働き|戻れる|再び社会/.test(t))return 'rise';
 if(/比較|比べ|一方|反対方向/.test(t))return 'compare';
 if(/分岐|一つ目|二つ目|三つ目|四つ目/.test(t))return 'branch';
 if(/増え|上が|大きく/.test(t))return 'rise';
 if(/減少|少な|下が/.test(t))return 'reduce';
 if(/開く/.test(t))return 'open';
 if(/閉じ/.test(t))return 'close';
 if(/戻ろう|再び/.test(t))return 'return';
 if(/繰り返|その後/.test(t))return 'repeat';
 if(/なぜ|だろうか|？/.test(t))return 'question';
 return ['reveal','compare','connect','shift','stabilize'][i%5];
};

const familyFor=(text,p,g)=>{
 if(/ワンルーム|冷蔵庫|食パン|財布/.test(text))return 'one-room';
 if(/倉庫/.test(text))return 'warehouse';
 if(/仕事を探|履歴書|面接|採用/.test(text))return 'job-center';
 if(/家賃|大家|部屋を失|住宅を手放/.test(text))return 'apartment';
 if(/路上|冬の夜/.test(text))return 'street-night';
 if(/駅|ベンチ/.test(text))return 'station';
 if(/病院|医療|救急|糖尿病/.test(text))return 'hospital';
 if(/生活保護法|厚生労働省|自治体|行政|申請/.test(text))return 'admin';
 if(/弁当|カップ麺|食事/.test(text))return 'supermarket';
 if(/ホームレス|Housing First|シェルター/.test(text))return 'shelter';
 if(/家族|離婚|死別/.test(text))return 'family-home';
 if(/会社員|会社が倒産|年収/.test(text))return 'office';
 if(/研究|JAMA|NBER|OECD|デンマーク|フィンランド|SSI|シカゴ/.test(text))return 'research';
 if(/警察|裁判|刑務所|犯罪/.test(text))return 'justice';
 if(/夜中のコンビニ/.test(text))return 'convenience';
 if(/銀行口座|住宅ローン|貯金/.test(text))return 'bank';
 if(/不況|景気|消費|売上/.test(text))return 'macro';
 if(/高層ビル|非常階段|非常口|消火器/.test(text))return 'building';
 if(/船|船室|船底/.test(text))return 'ship';
 if(/スマートフォン|携帯電話|充電/.test(text))return 'phone';
 if(/地下鉄|駅/.test(text))return 'subway';
 if(/コスト|費用|外部性|請求書/.test(text))return 'cost-map';
 if(/底|最低ライン|床|選択肢|循環/.test(text))return 'abstract';
 return familyList[(g*7+p.length)%familyList.length];
};

const usedAssets=new Set();
const assetFor=(text,family)=>{
 const candidates=[];
 if(family==='one-room')candidates.push(['lib-oneroom','one-room']);
 if(family==='hospital')candidates.push(['lib-hospital','hospital']);
 if(family==='supermarket')candidates.push(['lib-supermarket','supermarket']);
 if(family==='subway'||family==='station')candidates.push(['lib-subway','subway'],['lib-subway-entrance','subway']);
 if(family==='bank')candidates.push(['lib-bank','bank']);
 if(family==='family-home')candidates.push(['lib-room-day','family-home'],['lib-room-night','family-home']);
 if(family==='apartment')candidates.push(['lib-apartment','apartment']);
 if(family==='street-night')candidates.push(['lib-residential-night','street-night'],['lib-office-street','street-night']);
 if(family==='admin')candidates.push(['lib-shelter-counsel','admin']);
 if(family==='shelter')candidates.push(['lib-shelter-corridor','shelter']);
 for(const c of candidates)if(!usedAssets.has(c[0])){usedAssets.add(c[0]);return c}
 return null;
};

const beats=[],scriptParts=[],phaseCounts={};
for(const [file,phase] of sections){
 const text=fs.readFileSync(path.join(source,'story',file+'.txt'),'utf8').trim(),units=segment(text);phaseCounts[phase]=units.length;scriptParts.push(units.join('\n'));
 for(let i=0;i<units.length;i++){
  const narration=units[i],g=Math.floor(i/2),pairText=units.slice(g*2,g*2+2).join(' ');
  let family=familyFor(pairText,phase,g);const asset=assetFor(pairText,family);if(asset)family=asset[1];
  const environment=(asset?asset[0]:family)+'-'+phase+'-'+String(g).padStart(3,'0');
  let primary=primaryFor(narration,phase,i),verb=verbFor(narration,phase,i);
  if(!objects.has(primary)||!verbs.has(verb))throw Error('V111 unsupported semantic scene '+phase+'/'+i+' '+primary+'/'+verb);
  const prior=beats.at(-1);
  if(prior&&prior.environment===environment&&prior.primary===primary&&prior.verb===verb)verb=['reveal','compare','connect','shift','stabilize'][(i+2)%5];
  const n=beats.length+1,no=String(n).padStart(3,'0'),shot=['establish','detail','medium','overhead','low-angle','split','tracking','profile','reverse','macro'][i%10];
  beats.push({id:'V111-'+no,phase,variant:i,narration,environment,family,action:primary+'-'+verb+'-'+shot+'-'+no,primary,verb,mode:i%2?'replace':'append',actionId:'V111-'+no+'-'+verb+'-'+primary,sceneKey:'v111-'+phase+'-'+no,visual:'v111-original-'+no,shotKind:shot,continuity:environment,visualIntent:narration,assetComposition:asset?'template-contiguous':'original-procedural'});
 }
}
if(beats.length<175)throw Error('V111 scene segmentation too coarse '+beats.length);
for(const k of ['id','action','actionId','sceneKey','visual'])if(new Set(beats.map(x=>x[k])).size!==beats.length)throw Error('V111 repeated '+k);
const seen=new Set();for(let i=0;i<beats.length;i++){const e=beats[i].environment,p=beats[i-1]?.environment;if(seen.has(e)&&e!==p)throw Error('V111 noncontiguous background reuse '+e);seen.add(e);}

const src=path.join(target,'src'),scripts=path.join(target,'scripts');fs.mkdirSync(src,{recursive:true});fs.mkdirSync(scripts,{recursive:true});fs.mkdirSync(path.join(target,'qa'),{recursive:true});
fs.writeFileSync(path.join(target,'script.txt'),scriptParts.join('\n\n')+'\n');
fs.writeFileSync(path.join(src,'script-data.json'),JSON.stringify({videoId:'V111-welfare-floor',title:'なぜ生活保護がなくなると社会は崩壊するのか？底辺階級を救わなければいけない本当の理由。【社会保障×犯罪経済学×貧困研究】',beats},null,2));
fs.writeFileSync(path.join(src,'scene-data.json'),JSON.stringify(beats,null,2));
fs.writeFileSync(path.join(src,'sync-timing.json'),JSON.stringify({durationSeconds:1100,beats:[]},null,2));
for(const f of ['index.tsx','scenes.tsx','welfare-engine.tsx','welfare-art.tsx','backgrounds.tsx'])fs.copyFileSync(path.join(source,f),path.join(src,f));
fs.copyFileSync(path.join(root,'shared/asset-library/人物テンプレート/V46_ADULT_MAN_RIG.tsx'),path.join(src,'adult-man-rig.tsx'));
fs.copyFileSync(path.join(root,'shared/asset-library/人物テンプレート/office-worker-rig.tsx'),path.join(src,'office-worker-rig.tsx'));
fs.copyFileSync(path.join(root,'shared/asset-library/人物テンプレート/office-woman-rig.tsx'),path.join(src,'office-woman-rig.tsx'));
fs.copyFileSync(path.join(root,'shared/asset-library/人物テンプレート/PASSERBY.tsx'),path.join(src,'passerby.tsx'));
fs.copyFileSync(path.join(root,'shared/v100/primitives.tsx'),path.join(src,'primitives.tsx'));
for(const f of ['generate-voice-chunk.mjs','assemble-voice.mjs','plan-voice-parts.mjs','check-scenes.mjs','build-preproduction.mjs','plan-segments-fast.mjs'])fs.copyFileSync(path.join(source,f),path.join(scripts,f));
fs.copyFileSync(path.join(root,'shared/v53/generate-bgm.mjs'),path.join(scripts,'generate-bgm.mjs'));
for(const f of ['SOURCES.md','V111_PRODUCTION_SPEC.md'])fs.copyFileSync(path.join(source,f),path.join(target,f));

const approved=['BG_oneroom_night.png','BG_hospital.png','BG_supermarket.png','BG_subway.png','BG_bank.png','BG_ROOM_DAY.png','BG_ROOM_NIGHT_ON.png','BG_V46_RESIDENTIAL_STREET_NIGHT.png','BG_V46_CITY_APARTMENT_EXTERIOR.png','BG_V46_SUBWAY_ENTRANCE.png','BG_V46_OFFICE_STREET_NIGHT.png','BG_SHELTER_COUNSEL.png','BG_SHELTER_CORRIDOR.png'];
const catalog=JSON.parse(fs.readFileSync(path.join(root,'shared/asset-library/catalog.json'),'utf8')),pub=path.join(target,'public/assets/v111'),assets=[];fs.mkdirSync(pub,{recursive:true});
for(const file of approved){const item=catalog.assets.find(x=>x.category==='背景'&&x.file==='背景/'+file);if(!item||item.license!=='cleared-commercial')throw Error('V111 uncleared asset '+file);const original=path.join(root,'shared/asset-library',item.file),dest=path.join(pub,file);fs.copyFileSync(original,dest);const sha=createHash('sha256').update(fs.readFileSync(dest)).digest('hex');if(sha!==item.sourceSha256)throw Error('V111 asset checksum mismatch '+file);assets.push({name:file,id:item.id,sha256:sha,license:item.license});}
fs.writeFileSync(path.join(src,'library-assets.json'),JSON.stringify(assets,null,2));
fs.writeFileSync(path.join(target,'production-manifest.json'),JSON.stringify({videoId:'V111-welfare-floor',sceneCount:beats.length,narrationCharacters:beats.reduce((n,b)=>n+b.narration.length,0),backgroundGroups:seen.size,phases:phaseCounts,libraryBackgrounds:assets,characterTemplates:['V46_ADULT_MAN_RIG','office-woman-rig','PASSERBY'],method:'fine narration beats + contiguous static backgrounds + narration-specific foreground action + one-pass smoke QA + four-way VOICEVOX + 12-way render',measuredVoice:true,subtitles:true,bgm:true,sfx:false,minimumFinalSeconds:900,output:{width:1920,height:1080,fps:30}},null,2));
console.log('V111 preflight PASS scenes='+beats.length+' chars='+beats.reduce((n,b)=>n+b.narration.length,0)+' backgroundGroups='+seen.size+' families='+new Set(beats.map(x=>x.family)).size+' assets='+assets.length);
