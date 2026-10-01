import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
const root=process.cwd(),name='v108-comparative-mythology-original-scenes',target=path.join(root,name),template=path.join(root,'v44-interaction-attraction'),source=path.join(root,'shared/v108');
if(!fs.existsSync(template))throw Error('Remotion V44 template unavailable');
fs.rmSync(target,{recursive:true,force:true});fs.cpSync(template,target,{recursive:true});

const sections=[['00-prologue','prologue'],['01-common-ancestor','ancestor'],['02-counter','counter'],['03-travel','travel'],['04-cognition','cognition'],['05-epilogue','epilogue']];
const familyAll='river japan greece india underworld archive language migration laboratory abstract modern temple map library'.split(' ');
const verbs=new Set('strike sever dance subdue descend flee turn migrate search read move approach regrow burn reveal vanish transform poison flow open block build branch compare connect transmit narrate converge diverge align weigh separate inspect doubt remember select highlight imagine test question wait persist repeat survive inherit'.split(' '));
const objects=new Set('orochi hydra kaliya vritra naga serpent susanoo heracles krishna izanagi izanami orpheus eurydice zeus dyaus jupiter indra savitri satyavan yama storyteller trader child scholar sword sake-jars fire lyre torch boulder scroll book tablet thunder crown trio-comparison etymology-tree language-tree phylo-tree timeline trade-route river-map family-tree memory-cards attention-grid human-brain myth-tree convergence divergence question evidence-scale story-cards river yomi underworld temple market village camp laboratory library shrine mountain'.split(' '));
const phaseCounts={},beats=[],scriptParts=[],usedAssets=new Set();

const primaryFor=(t)=>{
 if(/ヤマタノオロチ|オロチ/.test(t))return 'orochi';
 if(/ヒュドラ/.test(t))return 'hydra';
 if(/カーリヤ/.test(t))return 'kaliya';
 if(/ヴリトラ/.test(t))return 'vritra';
 if(/スサノオ/.test(t))return 'susanoo';
 if(/ヘラクレス|イオラオス/.test(t))return 'heracles';
 if(/クリシュナ/.test(t))return 'krishna';
 if(/イザナギ/.test(t))return 'izanagi';
 if(/イザナミ/.test(t))return 'izanami';
 if(/オルフェウス/.test(t))return 'orpheus';
 if(/エウリュディケ/.test(t))return 'eurydice';
 if(/ゼウス/.test(t))return 'zeus';
 if(/ディヤウス/.test(t))return 'dyaus';
 if(/ユピテル/.test(t))return 'jupiter';
 if(/インドラ/.test(t))return 'indra';
 if(/サーヴィトリー/.test(t))return 'savitri';
 if(/サティヤヴァン/.test(t))return 'satyavan';
 if(/死神ヤマ/.test(t))return 'yama';
 if(/強い酒|八つの器|酒へ/.test(t))return 'sake-jars';
 if(/剣|草薙/.test(t))return 'sword';
 if(/火を焼|根元を火|火を灯/.test(t))return /黄泉|妻/.test(t)?'torch':'fire';
 if(/雷/.test(t))return 'thunder';
 if(/振り返ってはいけない|見てはいけない|禁忌/.test(t))return 'question';
 if(/黄泉|冥界|死者の世界/.test(t))return 'underworld';
 if(/語源|ゼウス、ディヤウス|親戚関係/.test(t))return 'etymology-tree';
 if(/言語|祖語|発音|インド・ヨーロッパ/.test(t))return 'language-tree';
 if(/系統分析|系統関係|275種類|50の言語|共通祖先/.test(t))return 'phylo-tree';
 if(/商人|旅人|市場|リレー|交易|移住/.test(t))return /商人|旅人|市場/.test(t)?'trader':'trade-route';
 if(/2008年|素早く見つけ|注意を引き/.test(t))return 'attention-grid';
 if(/2006年|最小反直観|一週間後の記憶/.test(t))return 'memory-cards';
 if(/系譜|支配者|政治的な秩序/.test(t))return 'family-tree';
 if(/二つの話|一つ目|二つ目/.test(t))return 'story-cards';
 if(/子どもが物語を読|小説にも|映画にも|漫画にも|ゲームにも/.test(t))return 'child';
 if(/人間そのもの|ホモ・サピエンス|人間の記憶|人間という存在/.test(t))return 'human-brain';
 if(/一枚の地図|地域|大陸|日本、インド、ギリシア/.test(t))return 'river-map';
 if(/共通点|三つの物語|並べて|比較/.test(t))return 'trio-comparison';
 if(/疑問|なぜ|だろうか/.test(t))return 'question';
 if(/蛇|ナーガ|怪物/.test(t))return 'serpent';
 if(/物語|神話/.test(t))return 'myth-tree';
 if(/古代の日本|集落|村/.test(t))return 'village';
 if(/研究|実験|心理学|認知科学/.test(t))return 'laboratory';
 if(/本|書物|記録/.test(t))return 'book';
 return 'storyteller';
};
const verbFor=(t,p)=>{
 if(/切り落|切り伏|倒す|打ち倒|殺され/.test(t))return 'sever';
 if(/再生|新しい頭/.test(t))return 'regrow';
 if(/火で焼|火を灯/.test(t))return 'burn';
 if(/舞う|舞い/.test(t))return 'dance';
 if(/屈服|去るよう命じ/.test(t))return 'subdue';
 if(/冥界へ|黄泉の国へ|向かう/.test(t))return 'descend';
 if(/逃げ/.test(t))return 'flee';
 if(/振り返/.test(t))return 'turn';
 if(/消えて|消える/.test(t))return 'vanish';
 if(/毒/.test(t))return 'poison';
 if(/水|川/.test(t)&&/流|解放|危険/.test(t))return 'flow';
 if(/見る|姿|現れ/.test(t))return 'reveal';
 if(/比べ|比較|並べ/.test(t))return 'compare';
 if(/結び|つなが|親戚|共通/.test(t))return 'connect';
 if(/枝分かれ/.test(t))return 'branch';
 if(/移動|旅を|届いて|大陸を越/.test(t))return 'migrate';
 if(/語る|伝え|受け継|手渡/.test(t))return 'transmit';
 if(/置き換|変化|変わ/.test(t))return 'transform';
 if(/研究|検討|分析|調べ/.test(t))return 'inspect';
 if(/疑い|疑問|簡単に/.test(t))return 'doubt';
 if(/記憶|覚え|忘れ/.test(t))return 'remember';
 if(/選ば|生き残/.test(t))return 'select';
 if(/読む|読んで/.test(t))return 'read';
 if(/生み出|作る|作った/.test(t))return 'build';
 if(/開|始め/.test(t))return 'open';
 if(/同じ|似て/.test(t))return 'compare';
 if(/人々|人間/.test(t))return p==='epilogue'?'narrate':'highlight';
 return 'highlight';
};
const poolFor=(t,p)=>{
 if(/ヤマタノオロチ|スサノオ|古代の日本|イザナギ|イザナミ|黄泉/.test(t))return ['japan','river','underworld','archive','temple','abstract'];
 if(/ヒュドラ|ヘラクレス|オルフェウス|エウリュディケ|ゼウス|パウサニアス/.test(t))return ['greece','temple','underworld','archive','map','abstract'];
 if(/カーリヤ|クリシュナ|インドラ|ヴリトラ|サーヴィトリー|サティヤヴァン|ヤマ|リグ・ヴェーダ|マハーバーラタ/.test(t))return ['india','river','temple','archive','map','abstract'];
 if(/言語|語源|祖語|系統|枝分かれ|共通祖先/.test(t))return ['language','archive','map','abstract','library','migration'];
 if(/商人|旅人|市場|移動|交易|旅を|大陸/.test(t))return ['migration','map','archive','river','abstract','temple'];
 if(/研究|実験|2008|2006|心理学|認知科学|記憶/.test(t))return ['laboratory','archive','abstract','library','language','modern'];
 if(p==='epilogue'||/子ども|小説|映画|漫画|ゲーム/.test(t))return ['modern','library','abstract','archive','language','temple'];
 return ['abstract','archive','map','library','temple','river','language','modern'];
};
const chooseFamily=(pool)=>{
 const recent=beats.slice(-4).map(b=>b.family);
 const all=[...pool,...familyAll];
 return all.find(f=>!recent.includes(f))||all.find(f=>f!==beats.at(-1)?.family)||'abstract';
};
const assetPrefix=(t)=>{
 if(!usedAssets.has('BG_kenkyu.png')&&/研究者|研究を発表|心理学には興味深い研究/.test(t)){usedAssets.add('BG_kenkyu.png');return 'lib-kenkyu';}
 if(!usedAssets.has('BG_honndana.png')&&/子どもが物語を読|本すら存在/.test(t)){usedAssets.add('BG_honndana.png');return 'lib-honndana';}
 if(!usedAssets.has('BG_darkroom.png')&&/厄介な問題|疑問が生まれる|なぜ我々の祖先/.test(t)){usedAssets.add('BG_darkroom.png');return 'lib-darkroom';}
 if(!usedAssets.has('BG_syosai.png')&&/古事記|日本書紀|書物/.test(t)){usedAssets.add('BG_syosai.png');return 'lib-syosai';}
 return null;
};

for(const [file,phase] of sections){
 const lines=fs.readFileSync(path.join(source,'story',file+'.txt'),'utf8').trim().split('\n').map(x=>x.trim()).filter(Boolean);
 if(lines.length<20)throw Error('V108 chapter too short '+phase);
 phaseCounts[phase]=lines.length;scriptParts.push(lines.join('\n'));
 for(let i=0;i<lines.length;i++){
  const narration=lines[i];if(narration.length<24||narration.length>90||!/[。！？]$/.test(narration))throw Error('V108 narration beat length/punctuation '+phase+'/'+i+' '+narration.length);
  let primary=primaryFor(narration),verb=verbFor(narration,phase);if(!objects.has(primary))throw Error('V108 unsupported planned object '+primary);if(!verbs.has(verb))throw Error('V108 unsupported planned verb '+verb);
  let family=chooseFamily(poolFor(narration,phase));const asset=assetPrefix(narration);if(asset){family=asset==='lib-kenkyu'?'laboratory':asset==='lib-honndana'?'library':asset==='lib-syosai'?'archive':'abstract';if(beats.at(-1)?.family===family)family=chooseFamily(poolFor(narration,phase));}
  const n=beats.length+1,no=String(n).padStart(3,'0'),env=(asset?asset+'-':'')+family+'-'+phase+'-'+no+'-'+primary;
  const action=primary+'-'+verb+'-'+no+'-'+['establish','detail','tracking','macro','medium','overhead','split','low-angle','reverse','profile'][i%10];
  beats.push({id:'V108-'+no,phase,variant:i,narration,environment:env,family,action,primary,verb,mode:'replace',actionId:'V108-'+no+'-'+action,sceneKey:'v108-'+phase+'-'+no,visual:'v108-original-'+no,shotKind:['establish','detail','tracking','macro','medium','overhead','split','low-angle','reverse','profile'][i%10],visualIntent:action,assetComposition:asset?'library-once':'bespoke-vector'});
 }
}
if(beats.length!==170)throw Error('V108 expects 170 narration scenes, got '+beats.length);
for(const k of ['id','environment','action','actionId','sceneKey','visual'])if(new Set(beats.map(x=>x[k])).size!==beats.length)throw Error('V108 repeated '+k);
for(let i=1;i<beats.length;i++)if(beats[i].family===beats[i-1].family)throw Error('V108 adjacent similar family '+beats[i].id);

const src=path.join(target,'src'),scripts=path.join(target,'scripts');fs.mkdirSync(src,{recursive:true});fs.mkdirSync(scripts,{recursive:true});fs.mkdirSync(path.join(target,'qa'),{recursive:true});
fs.writeFileSync(path.join(target,'script.txt'),scriptParts.join('\n\n')+'\n');
fs.writeFileSync(path.join(src,'script-data.json'),JSON.stringify({videoId:'V108-comparative-mythology-original-scenes',title:'なぜ人類は、同じ神々を何度も生み出すのか？【比較神話学×歴史言語学×認知科学】',beats},null,2));
fs.writeFileSync(path.join(src,'scene-data.json'),JSON.stringify(beats,null,2));
fs.writeFileSync(path.join(src,'sync-timing.json'),JSON.stringify({durationSeconds:1200,beats:[]},null,2));
for(const file of ['index.tsx','scenes.tsx','myth-engine.tsx','myth-art.tsx','backgrounds.tsx'])fs.copyFileSync(path.join(source,file),path.join(src,file));
fs.copyFileSync(path.join(root,'shared/v100/primitives.tsx'),path.join(src,'primitives.tsx'));
for(const file of ['generate-voicevox.mjs','check-original-scenes.mjs','build-preproduction.mjs'])fs.copyFileSync(path.join(source,file),path.join(scripts,file));
for(const file of ['generate-bgm.mjs','plan-segments.mjs'])fs.copyFileSync(path.join(root,'shared/v53',file),path.join(scripts,file));
for(const file of ['SOURCES.md','V108_PRODUCTION_SPEC.md'])fs.copyFileSync(path.join(source,file),path.join(target,file));

const catalog=JSON.parse(fs.readFileSync(path.join(root,'shared/asset-library/catalog.json'),'utf8'));
const approved=['BG_darkroom.png','BG_honndana.png','BG_kenkyu.png','BG_syosai.png'],assets=[],pub=path.join(target,'public/assets/v108');fs.mkdirSync(pub,{recursive:true});
for(const file of approved){const item=catalog.assets.find(x=>x.category==='背景'&&x.file==='背景/'+file);if(!item||item.license!=='cleared-commercial')throw Error('V108 library asset not approved '+file);const original=path.join(root,'shared/asset-library',item.file),dest=path.join(pub,file);fs.copyFileSync(original,dest);const sha256=createHash('sha256').update(fs.readFileSync(dest)).digest('hex');if(sha256!==item.sourceSha256)throw Error('V108 asset checksum mismatch '+file);assets.push({name:file,id:item.id,sha256,license:item.license});}
fs.writeFileSync(path.join(src,'library-assets.json'),JSON.stringify(assets,null,2));
fs.writeFileSync(path.join(target,'production-manifest.json'),JSON.stringify({videoId:'V108-comparative-mythology-original-scenes',sceneCount:beats.length,narrationCharacters:beats.reduce((n,b)=>n+b.narration.length,0),uniqueEnvironments:beats.length,uniqueActions:beats.length,phases:phaseCounts,libraryBackgrounds:assets,method:'one narration beat = one unique environment + one narration-specific action',measuredVoice:true,subtitles:true,sfx:false,bgm:true,minimumFinalSeconds:720,output:{width:1920,height:1080,fps:30}},null,2));
console.log('V108 preflight PASS '+beats.length+' scenes / '+beats.reduce((n,b)=>n+b.narration.length,0)+' chars / '+new Set(beats.map(x=>x.family)).size+' families / '+assets.length+' verified library backgrounds');
