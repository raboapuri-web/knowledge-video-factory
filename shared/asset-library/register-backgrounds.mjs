import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {validateCatalog} from './prepare.mjs';

const here=path.dirname(fileURLToPath(import.meta.url));
const imageExt=/\.(?:png|webp|svg)$/i;
const descriptions={
  "BG_VANCOUVER_RAIN": [
    "バンクーバーの海沿い都市景観",
    "バンクーバー",
    "海",
    "山並み",
    "高層ビル",
    "港",
    "カナダ",
    "ベクター",
    "街並み",
    "青空"
  ],
  "BG_MOVIE": [
    "映画館",
    "映画館",
    "劇場",
    "座席",
    "スクリーン",
    "映画鑑賞"
  ],
  "BG_SNS": [
    "SNS画面の空間",
    "SNS",
    "ソーシャルメディア",
    "投稿",
    "情報空間"
  ],
  "BG_Shinden": [
    "神殿",
    "神殿",
    "寺院",
    "古代",
    "宗教施設"
  ],
  "BG_bank": [
    "銀行",
    "銀行",
    "金融機関",
    "店舗",
    "窓口",
    "金融"
  ],
  "BG_cafenaiso": [
    "カフェの店内",
    "カフェ",
    "喫茶店",
    "店内",
    "飲食店"
  ],
  "BG_conviniencestore": [
    "コンビニの外観",
    "コンビニ",
    "コンビニエンスストア",
    "店舗外観",
    "24時間営業"
  ],
  "BG_darkroom": [
    "暗い抽象空間",
    "暗い空間",
    "暗室",
    "抽象空間",
    "展示空間",
    "スタジオ"
  ],
  "BG_densha": [
    "通勤電車の車内",
    "通勤電車",
    "電車",
    "車内",
    "座席",
    "吊り革"
  ],
  "BG_gekizyo": [
    "劇場",
    "劇場",
    "舞台",
    "観客席",
    "演劇"
  ],
  "BG_girisya": [
    "古代ギリシャの街並み",
    "古代ギリシャ",
    "ギリシャ",
    "古代",
    "街並み",
    "広場"
  ],
  "BG_girisya_hote": [
    "古代ギリシャの法廷",
    "古代ギリシャ",
    "ギリシャ",
    "法廷",
    "裁判"
  ],
  "BG_girisya_minato": [
    "古代ギリシャの港",
    "古代ギリシャ",
    "ギリシャ",
    "港",
    "交易"
  ],
  "BG_hensyushitsu": [
    "編集室",
    "編集室",
    "報道",
    "ニュース",
    "制作現場"
  ],
  "BG_honndana": [
    "本棚",
    "本棚",
    "書架",
    "蔵書",
    "本",
    "書斎"
  ],
  "BG_hospital": [
    "病院",
    "病院",
    "医療機関",
    "医療",
    "診察室"
  ],
  "BG_hote": [
    "法廷",
    "法廷",
    "裁判所",
    "裁判",
    "司法"
  ],
  "BG_hudousan": [
    "不動産会社",
    "不動産",
    "不動産会社",
    "物件",
    "賃貸",
    "店舗"
  ],
  "BG_kenkyu": [
    "研究室",
    "研究室",
    "実験室",
    "科学",
    "研究"
  ],
  "BG_kitchen": [
    "キッチン",
    "キッチン",
    "台所",
    "料理",
    "家庭"
  ],
  "BG_konbini": [
    "コンビニ",
    "コンビニ",
    "コンビニエンスストア",
    "店"
  ],
  "BG_kouen": [
    "公園",
    "公園",
    "緑地",
    "散歩",
    "屋外"
  ],
  "BG_minato": [
    "港",
    "港",
    "海辺",
    "船舶",
    "交易"
  ],
  "BG_office": [
    "オフィス",
    "オフィス",
    "職場",
    "会社",
    "事務所"
  ],
  "BG_oneroom": [
    "ワンルームの室内",
    "ワンルーム",
    "一人暮らし",
    "自宅",
    "寝室"
  ],
  "BG_rougoku": [
    "牢獄",
    "牢獄",
    "監獄",
    "監房",
    "拘禁"
  ],
  "BG_school": [
    "学校の教室",
    "学校",
    "教室",
    "教育",
    "授業"
  ],
  "BG_subway": [
    "地下鉄の駅",
    "地下鉄",
    "駅",
    "プラットホーム",
    "ホーム"
  ],
  "BG_suizokukan": [
    "水族館",
    "水族館",
    "水槽",
    "魚",
    "展示"
  ],
  "BG_supermarket": [
    "スーパーマーケット",
    "スーパー",
    "スーパーマーケット",
    "食料品",
    "売り場"
  ],
  "BG_syosai": [
    "書斎",
    "書斎",
    "書物",
    "読書",
    "本棚"
  ],
  "BG_tosyokan": [
    "図書館",
    "図書館",
    "蔵書",
    "書架",
    "読書"
  ],
  "BG_town": [
    "街なか",
    "街並み",
    "市街地",
    "交差点",
    "横断歩道"
  ],
  "BG_washitsu": [
    "和室",
    "和室",
    "畳",
    "日本家屋",
    "座敷"
  ]
};

export function syncBackgrounds(root=here){
 const catalogPath=path.join(root,'catalog.json');
 const catalog=JSON.parse(fs.readFileSync(catalogPath,'utf8'));
 const bgDir=path.join(root,'背景');
 if(!fs.existsSync(bgDir))throw Error('背景 folder is missing');
 const assets=[...catalog.assets],found=new Set();let added=0,updated=0,removed=0;
 for(const ent of fs.readdirSync(bgDir,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name))){
  if(ent.name.startsWith('.'))continue;
  if(!ent.isFile()||ent.isSymbolicLink())throw Error('Backgrounds must be regular image files: '+ent.name);
  if(!imageExt.test(ent.name))throw Error('Only PNG, WebP and SVG backgrounds are supported: '+ent.name);
  const full=path.join(bgDir,ent.name),buffer=fs.readFileSync(full);
  if(buffer.length<100||buffer.length>10*1024*1024)throw Error('Background outside 100 bytes–10MB: '+ent.name);
  const ext=path.extname(ent.name).toLowerCase();
  if(ext==='.png'&&!buffer.subarray(0,8).equals(Buffer.from('89504e470d0a1a0a','hex')))throw Error('Invalid PNG: '+ent.name);
  if(ext==='.webp'&&(buffer.toString('ascii',0,4)!=='RIFF'||buffer.toString('ascii',8,12)!=='WEBP'))throw Error('Invalid WebP: '+ent.name);
  if(ext==='.svg'&&(!buffer.toString().includes('<svg')||/<script\b|<foreignObject\b|<!DOCTYPE|\bon\w+\s*=|(?:href|src)\s*=\s*["'](?:https?:|javascript:|data:)/i.test(buffer.toString())))throw Error('Unsafe SVG: '+ent.name);
  const file='背景/'+ent.name,digest=createHash('sha256').update(buffer).digest('hex');found.add(file);
  const index=assets.findIndex(a=>a.file===file);
  const previous=index<0?null:assets[index];
  if(previous&&previous.category!=='背景')throw Error('Non-background entry points at '+file);
  if(previous?.sourceSha256===digest)continue;
  const stem=ent.name.replace(/\.[^.]+$/,'');
  const info=descriptions[stem]||[stem,stem,'背景素材'];
  const safeName=stem.toLowerCase().replace(/[^a-z0-9-]/g,'-');
  const id=previous?.id??'bg-'+safeName;
  if(!previous&&assets.some(a=>a.id===id))throw Error('Duplicate background ID: '+id);
  const changedImage=Boolean(previous?.sourceSha256&&previous.sourceSha256!==digest);
  const record={id,category:'背景',file,name:previous?.name??info[0],phases:previous?.phases??['*'],
   tags:previous?.tags??[...new Set(info.slice(1))],mustMentionAny:previous?.mustMentionAny??[info[1]],
   avoid:previous?.avoid??[],style:previous?.style??'flat-vector',palette:previous?.palette??'colorful',
   license:changedImage?'pending-review':previous?.license??'pending-review',
   layout:previous?.layout??{x:0,y:0,w:1920,h:1080},motion:previous?.motion??'none',sourceSha256:digest,
   autoRegistration:previous?.autoRegistration??{method:'filename-metadata',needsVisualReview:true,note:'画像の内容ではなくファイル名から仮登録。権利・構図・映像の整合性を要確認。'}};
  if(index<0){assets.push(record);added++;}else{assets[index]=record;updated++;}
 }
 // Do not silently discard missing backgrounds: an accidental rename/delete must be reviewed.
 for(const a of assets)if(a.category==='背景'&&!found.has(a.file))throw Error('Registered background missing; restore file or remove catalog record deliberately: '+a.file);
 const next={...catalog,version:Math.max(4,Number(catalog.version)||0),assets};
 validateCatalog(next,root);
 const encoded=JSON.stringify(next,null,2)+'\n',original=fs.readFileSync(catalogPath,'utf8');
 if(encoded!==original)fs.writeFileSync(catalogPath,encoded);
 return {added,updated,removed,total:assets.filter(a=>a.category==='背景').length,changed:encoded!==original};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{console.log('Background master synchronization: '+JSON.stringify(syncBackgrounds()));}catch(e){console.error(e);process.exitCode=1;}
}
