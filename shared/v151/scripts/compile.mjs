#!/usr/bin/env node
/**
 * V151 promotion-lottery storyboard compiler.
 *
 * Uses only Node.js built-in modules.
 *
 * Usage:
 *   node scripts/compile.mjs
 *   node scripts/compile.mjs prologue
 *   node scripts/compile.mjs chapter1
 *
 * No argument:
 *   - validates all six narration files and all 64 slides
 *   - writes normalized content/slides.json
 *   - writes content/audit.json
 *
 * Chapter argument:
 *   - validates the requested chapter
 *   - writes content/slides-<chapter>.json
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(SCRIPT_DIR, '..');
const CONTENT_DIR = path.join(PROJECT_ROOT, 'content');

const CHAPTERS = [
  { id: 'prologue', label: 'プロローグ', expectedSlides: 5 },
  { id: 'chapter1', label: '第1章', expectedSlides: 12 },
  { id: 'chapter2', label: '第2章', expectedSlides: 13 },
  { id: 'chapter3', label: '第3章', expectedSlides: 15 },
  { id: 'chapter4', label: '第4章', expectedSlides: 15 },
  { id: 'epilogue', label: 'エピローグ', expectedSlides: 4 },
];

const EXPECTED_TOTAL_SLIDES = 64;
const EXPECTED_TOTAL_SECONDS = 1609;
const FORBIDDEN_WORDS = ['有性生殖', '無性生殖'];

const EXPECTED_PALETTE = {
  background: '#0B1026',
  surface: '#14213D',
  text: '#F5F1E6',
  accentRed: '#C1272D',
  accentYellow: '#F2C230',
  accentTeal: '#2E6F73',
};

function readUtf8(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(`Required file not found: ${path.relative(PROJECT_ROOT, filePath)}`);
    }
    throw error;
  }
}

function readJson(filePath) {
  try {
    return JSON.parse(readUtf8(filePath));
  } catch (error) {
    throw new Error(`Invalid JSON in ${path.relative(PROJECT_ROOT, filePath)}: ${error.message}`);
  }
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const temporaryPath = `${filePath}.tmp`;
  fs.writeFileSync(temporaryPath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
  fs.renameSync(temporaryPath, filePath);
}

function failIf(errors, message) {
  errors.push(message);
}

function getChapterSource(chapterId) {
  const filePath = path.join(CONTENT_DIR, `narration-${chapterId}.txt`);
  return readUtf8(filePath);
}

function getSlidesForChapter(slides, chapterId) {
  return slides.filter((slide) => slide.chapter === chapterId);
}

function validatePalette(document, errors) {
  if (!document.palette || typeof document.palette !== 'object') {
    failIf(errors, 'Missing top-level palette.');
    return;
  }

  for (const [key, expected] of Object.entries(EXPECTED_PALETTE)) {
    if (document.palette[key] !== expected) {
      failIf(errors, `Palette mismatch: ${key} must be ${expected}.`);
    }
  }

  for (const slide of document.slides) {
    if (!slide.palette || typeof slide.palette !== 'object') {
      failIf(errors, `Slide ${slide.id}: missing slide palette.`);
      continue;
    }

    for (const [key, expected] of Object.entries(EXPECTED_PALETTE)) {
      if (slide.palette[key] !== expected) {
        failIf(errors, `Slide ${slide.id}: palette ${key} must be ${expected}.`);
      }
    }
  }
}

/**
 * Checks that each slide's narration is exactly the source substring
 * designated by its chapter-local [start, end) character offsets.
 *
 * Between adjacent slides, only the single newline separator used by
 * the narration files is allowed. This detects omissions, duplication,
 * reordering, and accidental text edits.
 */
function validateNarrationCoverage(chapterId, chapterSlides, source, errors) {
  let expectedStart = 0;

  for (let index = 0; index < chapterSlides.length; index += 1) {
    const slide = chapterSlides[index];

    if (!Number.isInteger(slide.start) || !Number.isInteger(slide.end)) {
      failIf(errors, `${chapterId} slide ${slide.id}: start/end must be integer character offsets.`);
      continue;
    }

    if (slide.start !== expectedStart) {
      failIf(
        errors,
        `${chapterId} slide ${slide.id}: narration gap, overlap, or reordering; expected start ${expectedStart}, got ${slide.start}.`,
      );
    }

    if (slide.start < 0 || slide.end <= slide.start || slide.end > source.length) {
      failIf(errors, `${chapterId} slide ${slide.id}: invalid character range [${slide.start}, ${slide.end}).`);
      continue;
    }

    const expectedNarration = source.slice(slide.start, slide.end);
    if (slide.narration !== expectedNarration) {
      failIf(errors, `${chapterId} slide ${slide.id}: narration does not match source[start:end].`);
    }

    if (index < chapterSlides.length - 1) {
      const nextSlide = chapterSlides[index + 1];
      const gap = source.slice(slide.end, nextSlide.start);
      if (gap !== '\n') {
        failIf(
          errors,
          `${chapterId} slide ${slide.id}: boundary separator must be exactly one newline; got ${JSON.stringify(gap)}.`,
        );
      }
      expectedStart = nextSlide.start;
    } else {
      if (slide.end !== source.length) {
        failIf(
          errors,
          `${chapterId}: final slide ends at ${slide.end}, but narration length is ${source.length}.`,
        );
      }
      expectedStart = slide.end;
    }
  }

  if (chapterSlides.length > 0 && expectedStart !== source.length) {
    failIf(errors, `${chapterId}: narration is not fully covered.`);
  }
}

function validateSlideShape(slide, errors) {
  if (!slide || typeof slide !== 'object' || Array.isArray(slide)) {
    failIf(errors, 'Every slide must be a JSON object.');
    return;
  }

  const requiredStrings = ['id', 'chapter', 'chapterLabel', 'narration'];
  for (const key of requiredStrings) {
    if (typeof slide[key] !== 'string' || slide[key].length === 0) {
      failIf(errors, `Slide ${slide.id ?? '(unknown)'}: ${key} must be a non-empty string.`);
    }
  }

  if (!Number.isInteger(slide.start) || !Number.isInteger(slide.end)) {
    failIf(errors, `Slide ${slide.id ?? '(unknown)'}: start/end must be integers.`);
  }

  if (!Number.isInteger(slide.durationSec) || slide.durationSec <= 0) {
    failIf(errors, `Slide ${slide.id ?? '(unknown)'}: durationSec must be a positive integer.`);
  }

  if (!slide.screen || typeof slide.screen.heading !== 'string' || !Array.isArray(slide.screen.keywords)) {
    failIf(errors, `Slide ${slide.id ?? '(unknown)'}: screen.heading and screen.keywords are required.`);
  }

  if (!slide.effect || typeof slide.effect.type !== 'string') {
    failIf(errors, `Slide ${slide.id ?? '(unknown)'}: effect.type is required.`);
  }
}

function validateForbiddenWords(document, errors) {
  const serialized = JSON.stringify(document);
  for (const word of FORBIDDEN_WORDS) {
    if (serialized.includes(word)) {
      failIf(errors, `Forbidden word found: ${word}`);
    }
  }
}

function readSpeechTimingIfAvailable() {
  const timingPath = path.join(CONTENT_DIR, 'speech-timing.json');
  if (!fs.existsSync(timingPath)) {
    return null;
  }

  const timing = readJson(timingPath);
  if (!timing || typeof timing !== 'object' || !timing.chapters) {
    throw new Error('content/speech-timing.json must contain a chapters object.');
  }
  return timing;
}

function estimateChapterSeconds(chapterId, slides, narrationSources) {
  const chapterCharacters = narrationSources[chapterId].length;
  const allCharacters = Object.values(narrationSources)
    .reduce((total, source) => total + source.length, 0);

  if (allCharacters === 0) return 0;

  return Number((EXPECTED_TOTAL_SECONDS * chapterCharacters / allCharacters).toFixed(2));
}

function getChapterDuration(chapterId, chapterSlides, speechTiming, narrationSources) {
  const measured = speechTiming?.chapters?.[chapterId]?.totalDuration;

  if (Number.isFinite(measured) && measured > 0) {
    return {
      seconds: Number(measured.toFixed(2)),
      source: 'speech-timing.json',
    };
  }

  return {
    seconds: estimateChapterSeconds(chapterId, chapterSlides, narrationSources),
    source: 'character-count-estimate',
  };
}

function normalizeDocument(document) {
  const chapterOrder = new Map(CHAPTERS.map((chapter, index) => [chapter.id, index]));

  const normalized = {
    ...document,
    palette: { ...EXPECTED_PALETTE },
    chapters: CHAPTERS.map((chapter) => ({
      id: chapter.id,
      label: chapter.label,
      slideCount: chapter.expectedSlides,
    })),
    slides: [...document.slides]
      .sort((a, b) => {
        const chapterDifference =
          (chapterOrder.get(a.chapter) ?? Number.MAX_SAFE_INTEGER) -
          (chapterOrder.get(b.chapter) ?? Number.MAX_SAFE_INTEGER);

        if (chapterDifference !== 0) return chapterDifference;
        return String(a.id).localeCompare(String(b.id), 'en');
      })
      .map((slide) => ({
        ...slide,
        palette: { ...EXPECTED_PALETTE },
      })),
  };

  return normalized;
}

function printSummary(slides, durationByChapter) {
  console.log(`Slide count: ${slides.length} slides`);
  console.log('Chapter breakdown:');

  for (const chapter of CHAPTERS) {
    const count = getSlidesForChapter(slides, chapter.id).length;
    const duration = durationByChapter[chapter.id];
    const durationText = duration
      ? ` / ${duration.seconds.toFixed(2)}s (${duration.source})`
      : '';

    console.log(` - ${chapter.id}: ${count} slides${durationText}`);
  }
}

function main() {
  const requestedChapter = process.argv[2];

  if (process.argv.length > 3) {
    throw new Error('Usage: node scripts/compile.mjs [chapter-name]');
  }

  if (
    requestedChapter !== undefined &&
    !CHAPTERS.some((chapter) => chapter.id === requestedChapter)
  ) {
    throw new Error(
      `Unknown chapter "${requestedChapter}". Valid chapters: ${CHAPTERS.map((chapter) => chapter.id).join(', ')}`,
    );
  }

  const sourcePath = path.join(CONTENT_DIR, 'slides.json');
  const original = readJson(sourcePath);

  if (!Array.isArray(original.slides)) {
    throw new Error('content/slides.json must contain a slides array.');
  }

  const document = normalizeDocument(original);
  const errors = [];

  for (const slide of document.slides) {
    validateSlideShape(slide, errors);
  }

  const narrationSources = {};
  for (const chapter of CHAPTERS) {
    narrationSources[chapter.id] = getChapterSource(chapter.id);
  }

  const durationSum = document.slides.reduce(
    (total, slide) => total + (Number.isFinite(slide.durationSec) ? slide.durationSec : 0),
    0,
  );

  if (document.slides.length !== EXPECTED_TOTAL_SLIDES) {
    failIf(errors, `Expected ${EXPECTED_TOTAL_SLIDES} slides, found ${document.slides.length}.`);
  }

  if (durationSum !== EXPECTED_TOTAL_SECONDS) {
    failIf(errors, `Expected total duration ${EXPECTED_TOTAL_SECONDS}s, found ${durationSum}s.`);
  }

  const actualIds = document.slides.map((slide) => slide.id);
  const expectedIds = Array.from(
    { length: EXPECTED_TOTAL_SLIDES },
    (_, index) => String(index + 1).padStart(2, '0'),
  );

  if (JSON.stringify(actualIds) !== JSON.stringify(expectedIds)) {
    failIf(errors, 'Slide IDs must be sequential strings 01 through 64.');
  }

  for (const chapter of CHAPTERS) {
    const chapterSlides = getSlidesForChapter(document.slides, chapter.id);

    if (chapterSlides.length !== chapter.expectedSlides) {
      failIf(
        errors,
        `${chapter.id}: expected ${chapter.expectedSlides} slides, found ${chapterSlides.length}.`,
      );
    }

    validateNarrationCoverage(
      chapter.id,
      chapterSlides,
      narrationSources[chapter.id],
      errors,
    );
  }

  validatePalette(document, errors);
  validateForbiddenWords(document, errors);

  const speechTiming = readSpeechTimingIfAvailable();
  const durationByChapter = {};

  for (const chapter of CHAPTERS) {
    durationByChapter[chapter.id] = getChapterDuration(
      chapter.id,
      getSlidesForChapter(document.slides, chapter.id),
      speechTiming,
      narrationSources,
    );
  }

  if (requestedChapter) {
    const selectedSlides = getSlidesForChapter(document.slides, requestedChapter);
    const outputPath = path.join(CONTENT_DIR, `slides-${requestedChapter}.json`);

    const chapterDocument = {
      ...document,
      targetDurationSec: durationByChapter[requestedChapter].seconds,
      selectedChapter: requestedChapter,
      slides: selectedSlides,
    };

    // Chapter mode validates the complete source structure above, but only
    // writes the requested chapter's slide records.
    if (errors.length > 0) {
      printSummary(selectedSlides, durationByChapter);
      console.error('VALIDATION FAILED');
      for (const error of errors) console.error(` - ${error}`);
      process.exitCode = 1;
      return;
    }

    writeJson(outputPath, chapterDocument);
    printSummary(selectedSlides, durationByChapter);
    console.log(`Output: ${path.relative(PROJECT_ROOT, outputPath)}`);
    console.log('VALIDATION OK');
    return;
  }

  const audit = {
    project: document.project ?? 'v151-promotion-lottery',
    title: document.title ?? '',
    validatedAt: new Date().toISOString(),
    expected: {
      totalSlides: EXPECTED_TOTAL_SLIDES,
      totalDurationSec: EXPECTED_TOTAL_SECONDS,
      chapterSlides: Object.fromEntries(
        CHAPTERS.map((chapter) => [chapter.id, chapter.expectedSlides]),
      ),
    },
    actual: {
      totalSlides: document.slides.length,
      totalDurationSec: durationSum,
      chapterSlides: Object.fromEntries(
        CHAPTERS.map((chapter) => [
          chapter.id,
          getSlidesForChapter(document.slides, chapter.id).length,
        ]),
      ),
      chapterDurations: durationByChapter,
    },
    checks: {
      jsonParsed: true,
      slideCount: document.slides.length === EXPECTED_TOTAL_SLIDES,
      chapterCounts: CHAPTERS.every(
        (chapter) =>
          getSlidesForChapter(document.slides, chapter.id).length === chapter.expectedSlides,
      ),
      totalDuration: durationSum === EXPECTED_TOTAL_SECONDS,
      narrationCoverage: errors.every(
        (error) => !/narration|character range|boundary separator/i.test(error),
      ),
      forbiddenWords: !FORBIDDEN_WORDS.some((word) =>
        JSON.stringify(document).includes(word),
      ),
      palette: errors.every((error) => !/palette/i.test(error)),
    },
    errors,
  };

  writeJson(path.join(CONTENT_DIR, 'audit.json'), audit);

  printSummary(document.slides, durationByChapter);

  if (errors.length > 0) {
    console.error('VALIDATION FAILED');
    for (const error of errors) console.error(` - ${error}`);
    process.exitCode = 1;
    return;
  }

  writeJson(sourcePath, document);
  console.log(`Total duration: ${durationSum}s`);
  console.log('Narration coverage: PASS');
  console.log('Forbidden-word check: PASS');
  console.log('JSON validity: PASS');
  console.log(`Output: ${path.relative(PROJECT_ROOT, sourcePath)}`);
  console.log(`Audit: ${path.relative(PROJECT_ROOT, path.join(CONTENT_DIR, 'audit.json'))}`);
  console.log('VALIDATION OK');
}

try {
  main();
} catch (error) {
  console.error('COMPILE FAILED');
  console.error(error.stack ?? error.message);
  process.exitCode = 1;
}
