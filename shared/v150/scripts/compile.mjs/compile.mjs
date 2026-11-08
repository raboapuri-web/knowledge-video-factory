// V150 考える夜「なぜ親友より、たまに会う知人の方が人生を変えるのか？」
// 台本とスライドの整合性監査 + 章プロジェクト生成
// 使い方: node scripts/compile.mjs [chapter] (省略時は全章生成)
// - 章プロジェクトを生成する (プロジェクト名は v150-<chapter>)
// - スライドの表示単位数を監査する (58枚)
// - 生成物の整合性を監査する (audit.json)
import {readFileSync, writeFileSync, mkdirSync} from 'node:fs';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CHAPTERS = ['prologue', 'chapter1', 'chapter2', 'chapter3', 'chapter4', 'epilogue'];
const ONLY = process.argv[2] || null;
if (ONLY && !CHAPTERS.includes(ONLY)) throw new Error('unknown chapter: ' + ONLY);

// 台本を文単位に分割する。台本は1文1行で書かれているため、改行も文の区切りとみなす。
// 「」で区切るが、」の内側では区切らない（引用文の中の。?は文の終わりではない）。
// 行末に。」で終わる引用行も、改行で1文として切り出す。
function splitSentences(text) {
  const out = [];
  let cur = '';
  let depth = 0;
  for (const ch of text) {
    cur += ch;
    if (ch === '「' || ch === '『') depth++;
    if (ch === '」' || ch === '』') depth = Math.max(0, depth - 1);
    if (ch === '\n') {
      if (cur.trim()) out.push(cur.trim());
      cur = '';
      continue;
    }
    if (depth === 0 && (ch === '。' || ch === '?' || ch === '!')) {
      out.push(cur.trim());
      cur = '';
    }
  }
  if (cur.trim()) out.push(cur.trim());
  return out.filter(Boolean);
}

const data = JSON.parse(readFileSync(join(ROOT, 'content', 'slides.json'), 'utf8'));
const meta = data.meta;
if (data.slides.length !== 58) throw new Error('expected 58 render units, got ' + data.slides.length);

const audit = {
  slug: meta.slug,
  title: meta.title,
  totalSlides: 58,
  specSlides: 58,
  renderUnits: 58,
  chapters: {},
  errors: [],
};

for (const ch of CHAPTERS) {
  const narration = readFileSync(join(ROOT, 'content', 'narration-' + ch + '.txt'), 'utf8').replace(/\r/g, '');
  const sents = splitSentences(narration);
  const chSlides = data.slides.filter((s) => s.ch === ch);
  const spans = [];
  let idx = 0;
  for (const s of chSlides) {
    const si = sents.indexOf(s.start, idx);
    const ei = si === -1 ? -1 : sents.indexOf(s.end, si);
    if (si === -1) {
      audit.errors.push(ch + ' slide ' + s.id + ': start not found: ' + s.start);
      continue;
    }
    if (ei === -1) {
      audit.errors.push(ch + ' slide ' + s.id + ': end not found: ' + s.end);
      continue;
    }
    if (si !== idx) {
      audit.errors.push(ch + ' slide ' + s.id + ': gap before start (expected sentence ' + idx + ', got ' + si + ')');
    }
    spans.push({id: s.id, startIndex: si, endIndex: ei, sentences: ei - si + 1});
    idx = ei + 1;
  }
  if (idx !== sents.length) audit.errors.push(ch + ': narration not fully covered: ' + idx + '/' + sents.length);
  audit.chapters[ch] = {slides: chSlides.length, sentences: sents.length, spans};
}

// 章プロジェクト生成（指定がある場合はその章のみ。）
const targetChapters = ONLY ? [ONLY] : CHAPTERS;
for (const ch of targetChapters) {
  const sceneTsx = [
    "import slidesData from '../content/slides.json';",
    "import timing from '../content/measured-" + ch + ".json';",
    "import {createChapterScene} from '../lib/chapter';",
    "export default createChapterScene('" + ch + "', slidesData, timing);",
  ].join('\n');
  const projectTs = [
    "import {makeProject} from '@motion-canvas/core';",
    "import scene from '../scenes/" + ch + "';",
    "export default makeProject({name: 'v150-" + ch + "', scenes: [scene]});",
  ].join('\n');
  mkdirSync(join(ROOT, 'src', 'scenes'), {recursive: true});
  mkdirSync(join(ROOT, 'src', 'projects'), {recursive: true});
  writeFileSync(join(ROOT, 'src', 'scenes', ch + '.tsx'), sceneTsx + '\n');
  writeFileSync(join(ROOT, 'src', 'projects', ch + '.ts'), projectTs + '\n');
}

writeFileSync(join(ROOT, 'content', 'audit.json'), JSON.stringify(audit, null, 2));
if (audit.errors.length) {
  console.error('AUDIT_FAILED');
  for (const e of audit.errors) console.error(' - ' + e);
  process.exit(1);
}
console.log('AUDIT OK: 58 render units / 58 spec slides, all chapters fully covered');
for (const ch of CHAPTERS) console.log(' -', ch, JSON.stringify(audit.chapters[ch]));
