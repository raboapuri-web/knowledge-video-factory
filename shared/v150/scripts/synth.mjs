// V150 考える夜「なぜ親友より、たまに会う知人の方が人生を変えるのか？」
// VOICEVOX による章ナレーション合成 + 実測タイミング生成
// 使い方: node scripts/synth.mjs [chapter] (working directory: shared/v150)
// 必要: VOICEVOX エンジン (http://127.0.0.1:50021)
import {readFileSync, writeFileSync, mkdirSync} from 'node:fs';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BASE = process.env.VOICEVOX_URL || 'http://127.0.0.1:50021';
const SPEED = Number(process.env.VOICEVOX_SPEED || '1.15');
const SPEAKER = Number(process.env.VOICEVOX_SPEAKER_ID || '13');
const PARALLEL = Number(process.env.VOICE_PARALLEL || '3');
const LEAD = 0.3; // スライド冒頭の無音 (秒)
const TRAIL = 0.3; // スライド末尾の無音 (秒)
const EPILOGUE_TAIL = 2.0; // 最終スライドの余韻 (秒)

// 台本を文単位に分割する。台本は1文1行。改行も文の区切りとし、「」の内側では区切らない。
// (compile.mjs と同じ規則。引用行や引用符内の 。？ を含む行も1文として扱う。)
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
    if (depth === 0 && (ch === '。' || ch === '？' || ch === '！')) {
      out.push(cur.trim());
      cur = '';
    }
  }
  if (cur.trim()) out.push(cur.trim());
  return out.filter(Boolean);
}

// WAV (16bit PCM mono) の data チャンクとサンプルレートを読む。
function parseWav(buf) {
  if (buf.toString('ascii', 0, 4) !== 'RIFF') throw new Error('not a RIFF wav');
  let off = 12;
  let sampleRate = 0;
  let data = null;
  while (off + 8 <= buf.length) {
    const id = buf.toString('ascii', off, off + 4);
    const size = buf.readUInt32LE(off + 4);
    if (id === 'fmt ') sampleRate = buf.readUInt32LE(off + 8);
    if (id === 'data') {
      data = buf.subarray(off + 8, off + 8 + size);
      break;
    }
    off += 8 + size + (size % 2);
  }
  if (!data) throw new Error('no data chunk in wav');
  if (!sampleRate) sampleRate = 24000;
  return {sampleRate, samples: data};
}

// PCM サンプル列から WAV (16bit PCM mono) を作る。
function writeWav(samples, sampleRate) {
  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + samples.length, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(sampleRate * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write('data', 36);
  header.writeUInt32LE(samples.length, 40);
  return Buffer.concat([header, samples]);
}

// 文を1つ VOICEVOX で合成する (失敗時は最大3回まで再試行する)。
async function synthOne(text) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const q = new URLSearchParams({text, speaker: String(SPEAKER)});
      const aqRes = await fetch(BASE + '/audio_query?' + q.toString(), {method: 'POST'});
      if (!aqRes.ok) throw new Error('audio_query failed: ' + aqRes.status);
      const aq = await aqRes.json();
      aq.speedScale = SPEED;
      const sRes = await fetch(BASE + '/synthesis?speaker=' + SPEAKER, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(aq),
      });
      if (!sRes.ok) throw new Error('synthesis failed: ' + sRes.status);
      return Buffer.from(await sRes.arrayBuffer());
    } catch (e) {
      if (attempt === 2) throw e;
      await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
    }
  }
  throw new Error('unreachable');
}

// 章ナレーションを合成し、実測タイミング measured-<chapter>.json を生成する。
async function main() {
  const chapter = process.argv[2];
  if (!chapter) throw new Error('usage: node scripts/synth.mjs <chapter>');
  const data = JSON.parse(readFileSync(join(ROOT, 'content', 'slides.json'), 'utf8'));
  const chSlides = data.slides.filter((s) => s.ch === chapter);
  if (!chSlides.length) throw new Error('no slides for chapter ' + chapter);
  const narration = readFileSync(join(ROOT, 'content', 'narration-' + chapter + '.txt'), 'utf8').replace(/\r/g, '');
  const sents = splitSentences(narration);
  // スライド境界をインデックスに写像する (compile.mjs と同じ規則)。
  const spans = [];
  let idx = 0;
  for (const s of chSlides) {
    const si = sents.indexOf(s.start, idx);
    const ei = sents.indexOf(s.end, si);
    if (si === -1 || ei === -1) throw new Error(chapter + ' slide ' + s.id + ': boundary not found');
    spans.push({id: s.id, si, ei});
    idx = ei + 1;
  }
  if (idx !== sents.length) throw new Error(chapter + ': narration not fully covered');
  // 文を並列で合成する。
  const wavs = new Array(sents.length);
  let next = 0;
  async function worker() {
    while (next < sents.length) {
      const i = next++;
      wavs[i] = await synthOne(sents[i]);
    }
  }
  await Promise.all(Array.from({length: Math.min(PARALLEL, sents.length)}, () => worker()));
  // 実測の長さを読み、スライドごとに「0.3秒無音 + 文の音声 + 0.3秒無音」を連結する。
  const sr = 24000;
  const lead = Math.round(LEAD * sr) * 2;
  const trail = Math.round(TRAIL * sr) * 2;
  const parts = [];
  const timing = {chapter, sampleRate: sr, totalDuration: 0, slides: []};
  let cursor = 0;
  for (let k = 0; k < chSlides.length; k++) {
    const sp = spans[k];
    const slideStart = cursor / sr;
    const subs = [];
    const seg = [Buffer.alloc(lead)];
    let offset = LEAD;
    for (let i = sp.si; i <= sp.ei; i++) {
      const parsed = parseWav(wavs[i]);
      const d = parsed.samples.length / 2 / sr;
      subs.push({text: sents[i], start: offset, duration: d});
      seg.push(parsed.samples);
      offset += d;
    }
    seg.push(Buffer.alloc(trail));
    let slideDur = offset + TRAIL;
    if (chapter === 'epilogue' && k === chSlides.length - 1) {
      seg.push(Buffer.alloc(Math.round(EPILOGUE_TAIL * sr) * 2));
      slideDur += EPILOGUE_TAIL;
    }
    const segBuf = Buffer.concat(seg);
    parts.push(segBuf);
    cursor += segBuf.length / 2;
    timing.slides.push({id: sp.id, start: slideStart, duration: slideDur, subs});
  }
  timing.totalDuration = cursor / sr;
  const outDir = join(ROOT, 'media', chapter);
  mkdirSync(outDir, {recursive: true});
  writeFileSync(join(outDir, 'narration.wav'), writeWav(Buffer.concat(parts), sr));
  writeFileSync(join(ROOT, 'content', 'measured-' + chapter + '.json'), JSON.stringify(timing, null, 2));
  console.log('SYNTH OK ' + chapter + ': ' + sents.length + ' sentences, ' + chSlides.length + ' slides, total ' + timing.totalDuration.toFixed(2) + 's');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
