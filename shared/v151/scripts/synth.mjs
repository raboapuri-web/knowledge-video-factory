#!/usr/bin/env node
/**
 * V151 VOICEVOX chapter synthesizer.
 *
 * Usage:
 *   node scripts/synth.mjs <chapter>
 *
 * Required input:
 *   content/narration-<chapter>.txt
 *
 * Outputs:
 *   audio/<chapter>.wav
 *   audio/speech-timing.json
 *
 * Runtime requirements:
 *   Node.js 18+ (built-in fetch; no npm dependencies)
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(SCRIPT_DIR, '..');
const CONTENT_DIR = path.join(PROJECT_ROOT, 'content');
const AUDIO_DIR = path.join(PROJECT_ROOT, 'audio');

const CHAPTER_ORDER = [
  'prologue',
  'chapter1',
  'chapter2',
  'chapter3',
  'chapter4',
  'epilogue',
];

const VOICEVOX_URL = (process.env.VOICEVOX_URL || 'http://127.0.0.1:50021')
  .replace(/\/+$/, '');
const VOICEVOX_SPEAKER = Number.parseInt(
  process.env.VOICEVOX_SPEAKER || '47',
  10,
);
const VOICEVOX_SPEED = Number.parseFloat(
  process.env.VOICEVOX_SPEED || '1.15',
);

const REQUEST_TIMEOUT_MS = Number.parseInt(
  process.env.VOICEVOX_TIMEOUT_MS || '120000',
  10,
);

function fail(message) {
  console.error(`SYNTH FAILED: ${message}`);
  process.exitCode = 1;
}

function ensureConfiguration() {
  if (!Number.isInteger(VOICEVOX_SPEAKER) || VOICEVOX_SPEAKER < 0) {
    throw new Error(`VOICEVOX_SPEAKER must be a non-negative integer; received "${process.env.VOICEVOX_SPEAKER}".`);
  }

  if (!Number.isFinite(VOICEVOX_SPEED) || VOICEVOX_SPEED <= 0) {
    throw new Error(`VOICEVOX_SPEED must be a positive number; received "${process.env.VOICEVOX_SPEED}".`);
  }

  if (!Number.isInteger(REQUEST_TIMEOUT_MS) || REQUEST_TIMEOUT_MS <= 0) {
    throw new Error('VOICEVOX_TIMEOUT_MS must be a positive integer.');
  }
}

function readNarration(chapter) {
  const filePath = path.join(CONTENT_DIR, `narration-${chapter}.txt`);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Narration file not found: ${path.relative(PROJECT_ROOT, filePath)}`);
  }

  const text = fs.readFileSync(filePath, 'utf8')
    .replace(/^\uFEFF/, '')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .trim();

  if (!text) {
    throw new Error(`Narration file is empty: ${path.relative(PROJECT_ROOT, filePath)}`);
  }

  return text;
}

/**
 * Split Japanese narration into sentence-sized units.
 * Japanese full stops and question/exclamation marks terminate a sentence.
 * Closing brackets/quotes immediately following punctuation stay attached.
 * Newlines are treated as spacing, not spoken sentence boundaries.
 */
function splitSentences(text) {
  const normalized = text.replace(/\s*\n\s*/g, ' ').trim();
  const matches = normalized.match(/[^。！？!?]+[。！？!?」』）】〕〉》]*|[。！？!?]+/g) || [];

  const sentences = [];
  let cursor = 0;

  for (const raw of matches) {
    const sentence = raw.trim();
    if (!sentence) continue;

    const start = normalized.indexOf(sentence, cursor);
    if (start < 0) {
      throw new Error('Could not map a sentence back to the normalized narration text.');
    }

    const end = start + sentence.length;
    sentences.push({
      index: sentences.length + 1,
      text: sentence,
      normalizedStart: start,
      normalizedEnd: end,
    });
    cursor = end;
  }

  if (sentences.length === 0) {
    throw new Error('No sentences could be extracted from the narration.');
  }

  const reconstructed = sentences.map((sentence) => sentence.text).join('');
  const sourceWithoutSpaces = normalized.replace(/\s+/g, '');
  if (reconstructed.replace(/\s+/g, '') !== sourceWithoutSpaces) {
    throw new Error('Sentence splitting did not preserve all narration characters.');
  }

  return sentences;
}

async function requestJson(url, options, description) {
  let response;

  try {
    response = await fetch(url, {
      ...options,
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    if (error.name === 'TimeoutError') {
      throw new Error(`${description} timed out after ${REQUEST_TIMEOUT_MS} ms.`);
    }
    throw new Error(`${description} failed: ${error.message}`);
  }

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(
      `${description} returned HTTP ${response.status} ${response.statusText}${body ? `: ${body.slice(0, 500)}` : ''}`,
    );
  }

  return response;
}

async function checkVoicevox() {
  try {
    const response = await requestJson(
      `${VOICEVOX_URL}/version`,
      { method: 'GET' },
      'VOICEVOX health check',
    );
    const version = await response.text();
    console.log(`VOICEVOX connected: ${version.trim() || 'version unknown'}`);
  } catch (error) {
    throw new Error(
      `VOICEVOXサーバーに接続できません (${VOICEVOX_URL})。\n` +
      'VOICEVOX Engineが起動していること、ポート50021にアクセスできることを確認してください。\n' +
      `詳細: ${error.message}`,
    );
  }
}

async function synthesizeSentence(text) {
  const queryUrl = new URL(`${VOICEVOX_URL}/audio_query`);
  queryUrl.searchParams.set('text', text);
  queryUrl.searchParams.set('speaker', String(VOICEVOX_SPEAKER));

  const queryResponse = await requestJson(
    queryUrl,
    { method: 'POST' },
    'VOICEVOX /audio_query',
  );

  const query = await queryResponse.json();
  query.speedScale = VOICEVOX_SPEED;

  const synthesisUrl = new URL(`${VOICEVOX_URL}/synthesis`);
  synthesisUrl.searchParams.set('speaker', String(VOICEVOX_SPEAKER));

  const synthesisResponse = await requestJson(
    synthesisUrl,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(query),
    },
    'VOICEVOX /synthesis',
  );

  return Buffer.from(await synthesisResponse.arrayBuffer());
}

function readWavChunks(wav, label) {
  if (wav.length < 44 || wav.toString('ascii', 0, 4) !== 'RIFF' ||
      wav.toString('ascii', 8, 12) !== 'WAVE') {
    throw new Error(`${label}: response is not a valid RIFF/WAVE file.`);
  }

  const chunks = [];
  let offset = 12;

  while (offset + 8 <= wav.length) {
    const chunkId = wav.toString('ascii', offset, offset + 4);
    const chunkSize = wav.readUInt32LE(offset + 4);
    const dataStart = offset + 8;
    const dataEnd = dataStart + chunkSize;

    if (dataEnd > wav.length) {
      throw new Error(`${label}: WAV chunk "${chunkId}" exceeds file bounds.`);
    }

    chunks.push({
      id: chunkId,
      data: wav.subarray(dataStart, dataEnd),
    });

    offset = dataEnd + (chunkSize % 2);
  }

  const fmt = chunks.find((chunk) => chunk.id === 'fmt ');
  const data = chunks.find((chunk) => chunk.id === 'data');

  if (!fmt || !data) {
    throw new Error(`${label}: WAV must contain fmt and data chunks.`);
  }

  if (fmt.data.length < 16) {
    throw new Error(`${label}: WAV fmt chunk is too short.`);
  }

  return { fmt: fmt.data, data: data.data };
}

function makeWav(fmtChunk, pcmData) {
  const fmtPadding = fmtChunk.length % 2;
  const dataPadding = pcmData.length % 2;
  const riffSize = 4 + 8 + fmtChunk.length + fmtPadding + 8 + pcmData.length + dataPadding;

  const header = Buffer.alloc(12);
  header.write('RIFF', 0, 'ascii');
  header.writeUInt32LE(riffSize, 4);
  header.write('WAVE', 8, 'ascii');

  const fmtHeader = Buffer.alloc(8);
  fmtHeader.write('fmt ', 0, 'ascii');
  fmtHeader.writeUInt32LE(fmtChunk.length, 4);

  const dataHeader = Buffer.alloc(8);
  dataHeader.write('data', 0, 'ascii');
  dataHeader.writeUInt32LE(pcmData.length, 4);

  const parts = [header, fmtHeader, fmtChunk];
  if (fmtPadding) parts.push(Buffer.from([0]));
  parts.push(dataHeader, pcmData);
  if (dataPadding) parts.push(Buffer.from([0]));

  return Buffer.concat(parts);
}

function getWavDurationSeconds(wavParts) {
  const format = wavParts.fmt;
  const byteRate = format.readUInt32LE(8);
  if (!byteRate) {
    throw new Error('WAV byte rate is zero; cannot calculate audio duration.');
  }
  return wavParts.data.length / byteRate;
}

function appendTimingEntry(timing, chapter, entry) {
  if (!timing.chapters || typeof timing.chapters !== 'object') {
    timing.chapters = {};
  }
  timing.chapters[chapter] = entry;
  timing.version = 1;
  timing.project = 'v151-promotion-lottery';
  timing.updatedAt = new Date().toISOString();
}

function readExistingTiming() {
  const filePath = path.join(AUDIO_DIR, 'speech-timing.json');

  if (!fs.existsSync(filePath)) {
    return { version: 1, project: 'v151-promotion-lottery', chapters: {} };
  }

  try {
    const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if (!parsed || typeof parsed !== 'object') {
      throw new Error('root value must be an object');
    }
    if (!parsed.chapters || typeof parsed.chapters !== 'object') {
      parsed.chapters = {};
    }
    return parsed;
  } catch (error) {
    throw new Error(`Cannot read existing audio/speech-timing.json: ${error.message}`);
  }
}

function writeJsonAtomic(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const temporaryPath = `${filePath}.tmp`;
  fs.writeFileSync(temporaryPath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
  fs.renameSync(temporaryPath, filePath);
}

async function main() {
  const chapter = process.argv[2];

  if (process.argv.length !== 3 || !CHAPTER_ORDER.includes(chapter)) {
    throw new Error(
      `Usage: node scripts/synth.mjs <chapter>\n` +
      `Valid chapters: ${CHAPTER_ORDER.join(' / ')}`,
    );
  }

  ensureConfiguration();

  console.log(`V151 chapter: ${chapter}`);
  console.log(`VOICEVOX_URL: ${VOICEVOX_URL}`);
  console.log(`VOICEVOX_SPEAKER: ${VOICEVOX_SPEAKER}`);
  console.log(`VOICEVOX_SPEED: ${VOICEVOX_SPEED}`);

  await checkVoicevox();

  const narration = readNarration(chapter);
  const sentences = splitSentences(narration);

  console.log(`Sentence count: ${sentences.length}`);

  fs.mkdirSync(AUDIO_DIR, { recursive: true });

  const wavBuffers = [];
  const sentenceTimings = [];
  let referenceFormat = null;
  let elapsedSeconds = 0;

  for (const sentence of sentences) {
    console.log(`Synthesizing ${sentence.index}/${sentences.length}`);

    const wav = await synthesizeSentence(sentence.text);
    const parts = readWavChunks(wav, `Sentence ${sentence.index}`);

    if (referenceFormat === null) {
      referenceFormat = parts.fmt;
    } else if (!referenceFormat.equals(parts.fmt)) {
      throw new Error(
        `Sentence ${sentence.index}: VOICEVOX returned a different WAV format; cannot concatenate safely.`,
      );
    }

    const durationSec = getWavDurationSeconds(parts);
    const startSec = elapsedSeconds;
    const endSec = startSec + durationSec;

    sentenceTimings.push({
      index: sentence.index,
      text: sentence.text,
      startSec: Number(startSec.toFixed(4)),
      endSec: Number(endSec.toFixed(4)),
      durationSec: Number(durationSec.toFixed(4)),
    });

    wavBuffers.push(parts.data);
    elapsedSeconds = endSec;
  }

  if (!referenceFormat || wavBuffers.length === 0) {
    throw new Error('No synthesized audio was produced.');
  }

  const pcmData = Buffer.concat(wavBuffers);
  const finalWav = makeWav(referenceFormat, pcmData);

  const wavPath = path.join(AUDIO_DIR, `${chapter}.wav`);
  const temporaryWavPath = `${wavPath}.tmp`;
  fs.writeFileSync(temporaryWavPath, finalWav);
  fs.renameSync(temporaryWavPath, wavPath);

  const timing = readExistingTiming();
  appendTimingEntry(timing, chapter, {
    chapter,
    speaker: VOICEVOX_SPEAKER,
    speedScale: VOICEVOX_SPEED,
    sentenceCount: sentenceTimings.length,
    totalDuration: Number(elapsedSeconds.toFixed(4)),
    sentences: sentenceTimings,
  });

  const timingPath = path.join(AUDIO_DIR, 'speech-timing.json');
  writeJsonAtomic(timingPath, timing);

  console.log(`WAV output: ${path.relative(PROJECT_ROOT, wavPath)}`);
  console.log(`Timing output: ${path.relative(PROJECT_ROOT, timingPath)}`);
  console.log(`Total duration: ${elapsedSeconds.toFixed(2)} seconds`);
  console.log('SYNTHESIS COMPLETE');
}

main().catch((error) => {
  fail(error.stack ?? error.message);
});
