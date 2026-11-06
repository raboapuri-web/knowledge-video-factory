// V146 考える夜「なぜ哺乳類は進化の過程を、非効率なセックスを残し続けたのか？」
// 台本とスライドの整合性監査 + 章プロジェクト生成
// 使い方: node scripts/compile.mjs [chapter]   (working directory: shared/v146)
// 章を指定すると、その章のシーンファイルとプロジェクトだけを生成する。
// （章ジョブでは、未合成の他章の measured-*.json が存在しないため）
import {readFileSync, writeFileSync, mkdirSync} from 'node:fs';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CHAPTERS = ['prologue', 'chapter1', 'chapter2', 'chapter3', 'chapter4', 'chapter5', 'chapter6', 'epilogue'];
const ONLY = process.argv[2] || null;
if (ONLY && !CHAPTERS.includes(ONLY)) throw new Error('unknown chapter: ' + ONLY);

// 台本を文単位に分割する。文末の 。？！ で区切り、終端記号を文に残す。
function splitSentences(text) {
  const out = [];
  let cur = '';
  for (const ch of text) {
    cur += ch;
    if (ch === '。' || ch === '？' || ch === '！') {
      out.push(cur.trim());
      cur = '';
    }
  }
  if (cur.trim()) out.push(cur.trim());
  return out.filter(Boolean);
}

const data = JSON.parse(readFileSync(join(ROOT, 'content', 'slides.json'), 'utf8'));
const meta = data.meta;
if (data.slides.length !== 52) throw new Error('expected 52 render units, got ' + data.slides.length);

const audit = {
  slug: meta.slug,
  title: meta.title,
  totalSlides: 52,
  specSlides: 48,
  renderUnits: 52,
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
  if (idx !== sents.length) {
    audit.errors.push(ch + ': narration not fully covered: ' + idx + '/' + sents.length);
  }
  audit.chapters[ch] = {slides: chSlides.length, sentences: sents.length, spans};

  // 章のシーンファイルと Motion Canvas プロジェクトを生成する（CI でのみ生成し、コミットしない）。
  // measured-<ch>.json は VOICEVOX 合成後にできるため、ここではまだ存在しなくてよい。
  // プロジェクトは V145 と同じく ?scene 付きでシーンを読み込む（型宣言は src/types.d.ts 参照）。
  if (!ONLY || ONLY === ch) {
    const sceneTsx = [
      "import slidesData from '../../content/slides.json';",
      "import timing from '../../content/measured-" + ch + ".json';",
      "import {createChapterScene} from '../lib/chapter';",
      '',
      "export default createChapterScene('" + ch + "', slidesData, timing);",
      '',
    ].join('\n');
    mkdirSync(join(ROOT, 'src', 'scenes'), {recursive: true});
    writeFileSync(join(ROOT, 'src', 'scenes', ch + '.tsx'), sceneTsx);
    const projectTs = [
      "import {makeProject} from '@motion-canvas/core';",
      "import scene from '../scenes/" + ch + "?scene';",
      '',
      'export default makeProject({name: \'v146-' + ch + '\', scenes: [scene]});',
      '',
    ].join('\n');
    mkdirSync(join(ROOT, 'src', 'projects'), {recursive: true});
    writeFileSync(join(ROOT, 'src', 'projects', ch + '.ts'), p
  }
}

mkdirSync(join(ROOT, 'content'), {recursive: true});
writeFileSync(join(ROOT, 'content', 'audit.json'), JSON.stringify(audit, null, 2));

if (audit.errors.length) {
  console.error('AUDIT FAILED');
  for (const e of audit.errors) console.error(' - ' + e);
  process.exit(1);
}
console.log('AUDIT OK: 52 render units / 48 spec slides, all chapters fully covered');
console.log(JSON.stringify(audit.chapters, null, 2));
