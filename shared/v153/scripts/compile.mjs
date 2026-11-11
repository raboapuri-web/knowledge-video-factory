import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CONTENT = path.join(ROOT, 'content');
const SOURCE = fs.readFileSync(path.join(CONTENT, 'source.txt'), 'utf8').replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
const CHAPTERS = ['prologue', 'chapter1', 'chapter2', 'chapter3', 'chapter4', 'epilogue'];
const CHAPTER_NAMES = ['プロローグ', '第1章', '第2章', '第3章', '第4章', 'エピローグ'];

function splitSentences(text) {
  const out = [];
  let cur = '', depth = 0;
  for (const ch of text) {
    cur += ch;
    if (ch === '「' || ch === '『') depth++;
    if (ch === '」' || ch === '』') depth = Math.max(0, depth - 1);
    if (ch === '\n') {
      if (cur.trim()) out.push(cur.trim());
      cur = '';
      continue;
    }
    if (depth === 0 && (ch === '。' || ch === '？' || ch === '！' || ch === '?' || ch === '!')) {
      if (cur.trim()) out.push(cur.trim());
      cur = '';
    }
  }
  if (cur.trim()) out.push(cur.trim());
  return out.filter(Boolean);
}

const BLOCKS = [];
const header = /^(プロローグ|第[1-4]章|エピローグ)｜(.+)$/;
for (const raw of SOURCE.split('\n')) {
  const line = raw.trim();
  if (!line || /^_{5,}$/.test(line)) continue;
  const match = line.match(header);
  if (match) {
    BLOCKS.push({label: match[1], title: match[2], lines: []});
    continue;
  }
  if (BLOCKS.length) BLOCKS.at(-1).lines.push(line);
}
if (BLOCKS.length !== 6 || BLOCKS.some((b, i) => b.label !== CHAPTER_NAMES[i])) {
  throw Error('Expected source order Prologue + 4 chapters + Epilogue');
}
const SPEC = [
  [/46％|23％/, 'numbers', '実際の注目と、想像した注目', ['予想 46％', '実際 23％'], 'zoom'],
  [/バリー・マニロウ|Tシャツ/, 'shirt', '奇妙なTシャツの実験', ['自分だけが目立つ？', '周囲はどれほど見ていたか'], 'slide-right'],
  [/スポットライト効果/, 'spotlight', 'スポットライト効果', ['あなたが感じる注目', '実際の注目'], 'pulse'],
  [/主人公ではない|専用席が/, 'audience', '他人の頭に、あなたの専用席はない', ['あなたの頭の中', '他人の頭の中'], 'slide-left'],
  [/他人が持っている情報量|すべてを知っている/, 'mirror', '主観は同じ大きさではない', ['自分が知る失敗', '他人が見た一場面'], 'zoom'],
  [/誰も手を挙げていない|全員が黙って/, 'conference', '全員が黙っている会議', ['質問したい', 'しかし、誰も手を挙げない'], 'slide-up'],
  [/実は、誰も理解していなかった|みんなが理解している/, 'audience', '沈黙を、理解だと思い込む', ['自分だけ分からない？', '実はみんな同じ'], 'stagger'],
  [/多元的無知/, 'audience', '多元的無知', ['他人の本音は見えない', '沈黙が「総意」に見える'], 'zoom'],
  [/1993年|プレンティス|ミラー/, 'research', 'Prentice & Miller / 1993', ['大学生の飲酒文化', '本音と予想のずれ'], 'slide-left'],
  [/2000年|ギロビッチ/, 'research', 'Gilovich et al. / 2000', ['自分への注目の過大評価', 'スポットライト効果'], 'slide-up'],
  [/相手に直接聞いたのか|根拠は何だろう/, 'mirror', 'その観客は、実在するか', ['観察した事実', '頭の中の推測'], 'stagger'],
  [/存在するかどうかも分からない観客/, 'empty', '存在しない観客', ['誰もいない席', 'それでも視線を感じる'], 'zoom'],
  [/夜、ベッドに|30分も過去/, 'memory', '夜に現れる、数年前の失敗', ['今の時間', '過去の場面'], 'slide-up'],
  [/反芻思考|ぐるぐる回って/, 'loop', '反芻思考', ['考える', '思い出す', 'また考える'], 'rotate'],
  [/1991年|ノーレン/, 'research', 'Nolen-Hoeksema / 1991', ['感情への反応', '考え続けることの代償'], 'slide-right'],
  [/2008年|ワトキンス/, 'research', 'Watkins / 2008', ['同じ反復でも', '考え方で結果は違う'], 'slide-left'],
  [/次は何を変えるか|未来の行動/, 'fork', '反省と反芻の分岐点', ['次に変えること', '自分を責め続けること'], 'zoom'],
  [/録画データではない|記憶は、過去をそのまま/, 'memory', '記憶は、録画ではない', ['記録ではなく', '思い出すたび再構成'], 'pulse'],
  [/重大な失敗だから|何度も思い出しているから/, 'loop', '思い出すほど、重大になる？', ['重大だから反復する', '反復するから重大になる'], 'stagger'],
  [/1995年|クラーク|ウェルズ/, 'research', 'Clark & Wells / 1995', ['他人の視点を想像する', '社交不安の認知モデル'], 'slide-up'],
  [/二人の自分|評価している自分/, 'mirror', '舞台に立つ自分と、客席の自分', ['失敗した自分', '評価する自分'], 'slide-left'],
  [/集団で生きる|社会的な動物/, 'audience', '社会で生きるための視線', ['信頼', '役割', '関係'], 'stagger'],
  [/二種類の時間|現実の時間|頭の中の時間/, 'clock', '失敗には二つの時間がある', ['現実の時計', '記憶の時計'], 'slide-right'],
  [/裁判を開いている|検察官|証人|裁判官/, 'courtroom', '頭の中の裁判', ['検察官', '証人', '裁判官'], 'zoom'],
  [/有罪判決|無罪になるのが/, 'verdict', '終わらない裁判', ['証拠＝自分の記憶', '証言＝想像した評価'], 'pulse'],
  [/幕は、とっくに下りている|客席には、もう誰もいない/, 'empty', '誰もいない客席', ['舞台は終わった', '頭の中では終わらない'], 'slide-up'],
  [/誰もいない客席に向かって/, 'spotlight', '終わった舞台に、ただ一人', ['誰も見ていない', 'それでも謝り続ける'], 'zoom'],
  [/本当に、それを覚えているのは誰/, 'quote', '覚えているのは、誰か。', ['本当に、誰が覚えている？'], 'fade'],
];
const VIZ = {
  prologue: ['memory','mirror','spotlight','quote','courtroom','empty'],
  chapter1: ['research','shirt','numbers','spotlight','audience','mirror','quote'],
  chapter2: ['conference','audience','mirror','empty','flow','quote'],
  chapter3: ['memory','loop','clock','fork','memory','quote'],
  chapter4: ['mirror','audience','clock','courtroom','verdict','empty'],
  epilogue: ['memory','stage','empty','spotlight','quote'],
};
const EFFECTS = ['fade','slide-left','zoom','stagger','slide-up','pulse','slide-right','rotate','wipe'];
const clean = x => String(x || '').replace(/[「」]/g,'').replace(/^\s*[だがしかしそしてまたここで]\s*[、,]\s*/,'').trim();
function brief(x, n=30) {
  const s = clean(x).replace(/[。！？!?]$/,'');
  return s.length <= n ? s : s.slice(0, n-1) + '…';
}
function groupSentences(sentences) {
  const groups = []; let group = [], size = 0;
  for (const sentence of sentences) {
    const boundary = group.length && (size + sentence.length > 116 || group.length >= 4 ||
      (size >= 72 && /^(だが|しかし|ところが|ここで|そして、|では、|つまり、)/.test(sentence)));
    if (boundary) { groups.push(group); group = []; size = 0; }
    group.push(sentence); size += sentence.length;
  }
  if (group.length) groups.push(group);
  if (groups.length > 1 && groups.at(-1).join('').length < 28) {
    groups[groups.length - 2].push(...groups.pop());
  }
  return groups;
}
const entries = [], report = {}, narration = {};
for (let i=0; i<BLOCKS.length; i++) {
  const id = CHAPTERS[i];
  const b = BLOCKS[i];
  const sentences = splitSentences(b.lines.join('\n'));
  const groups = groupSentences(sentences);
  const flattened = groups.flat();
  if (flattened.join('') !== sentences.join('')) throw Error('Omitted source text: ' + id);
  const txt = sentences.join('\n');
  narration[id] = txt;
  fs.writeFileSync(path.join(CONTENT,'narration-'+id+'.txt'), txt+'\n');
  for (let j=0; j<groups.length; j++) {
    const gs = groups[j];
    const chunk = gs.join('\n');
    const preset = SPEC.find(([re])=>re.test(chunk));
    const viz = preset ? preset[1] : (j===0 ? 'title' : VIZ[id][j%VIZ[id].length]);
    const heading = preset ? preset[2] : j===0 ? b.title : brief(gs[0],21);
    const display = preset ? preset[3] : [brief(gs[0],33),brief(gs[Math.min(gs.length-1,Math.ceil(gs.length/2))],29)].filter(Boolean);
    entries.push({id:String(entries.length+1).padStart(2,'0'),ch:id,heading,start:gs[0],end:gs.at(-1),viz,
      effect:preset ? preset[4] : EFFECTS[(j+i*2)%EFFECTS.length],display});
  }
  report[id] = {sentences:sentences.length,slides:groups.length,characters:txt.length};
}
const data = {meta:{slug:'v153-spotlight-memory',title:'なぜあなたは、誰も覚えていない失敗を反省し続けるのか？',
width:1920,height:1080,fps:30,colors:{bg:'#111114',paper:'#F1ECE0',red:'#A52B40',teal:'#4B8F8A',gray:'#A5A09A'},
chapters:CHAPTERS,renderUnits:entries.length,specSlides:entries.length},slides:entries};
fs.writeFileSync(path.join(CONTENT,'slides.json'),JSON.stringify(data,null,2));
const errors = [];
for (const id of CHAPTERS) {
  const sents = splitSentences(narration[id]);
  const ch = entries.filter(s=>s.ch===id);
  let at=0;
  for (const slide of ch) {
    const start=sents.indexOf(slide.start,at), end=sents.indexOf(slide.end,start);
    if (start!==at || end<start) errors.push(id+' '+slide.id+' boundary mismatch');
    at=end+1;
  }
  if(at!==sents.length)errors.push(id+' coverage '+at+'/'+sents.length);
}
const audit={title:data.meta.title,totalSlides:entries.length,chapterStats:report,errors,
sourceCharacters:SOURCE.length,sourceIncludesKeyData:SOURCE.includes('46％')&&SOURCE.includes('23％')};
fs.writeFileSync(path.join(CONTENT,'audit.json'),JSON.stringify(audit,null,2));
if(errors.length)throw Error(errors.join('\n'));
console.log('AUDIT OK:',entries.length,'slides',JSON.stringify(report));
const only=process.argv[2];
if(only && !CHAPTERS.includes(only))throw Error('Unknown chapter '+only);
for(const id of only ? [only] : CHAPTERS){
  fs.mkdirSync(path.join(ROOT,'src','scenes'),{recursive:true});
  fs.mkdirSync(path.join(ROOT,'src','projects'),{recursive:true});
  fs.writeFileSync(path.join(ROOT,'src','scenes',id+'.tsx'),
    "import data from '../../content/slides.json';\nimport timing from '../../content/measured-"+id+".json';\nimport {createChapterScene} from '../lib/chapter';\nexport default createChapterScene('"+id+"',data,timing);\n");
  fs.writeFileSync(path.join(ROOT,'src','projects',id+'.ts'),
    "import {makeProject} from '@motion-canvas/core';\nimport scene from '../scenes/"+id+"?scene';\nexport default makeProject({name:'v153-"+id+"',scenes:[scene]});\n");
}
