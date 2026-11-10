#!/usr/bin/env node
/**
 * V151 original ambient BGM generator.
 *
 * Usage:
 *   node scripts/gen-bgm.mjs [output-path]
 *
 * Default output:
 *   bgm/ambient-v151.wav
 *
 * Audio format:
 *   44,100 Hz / 16-bit PCM / stereo / 120 seconds
 *
 * No external packages or existing audio assets are used.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(SCRIPT_DIR, '..');

const SAMPLE_RATE = 44100;
const CHANNELS = 2;
const BITS_PER_SAMPLE = 16;
const DURATION_SECONDS = 120;
const FRAME_COUNT = SAMPLE_RATE * DURATION_SECONDS;

const DEFAULT_OUTPUT = path.join(PROJECT_ROOT, 'bgm', 'ambient-v151.wav');
const outputArgument = process.argv[2];
const OUTPUT_PATH = outputArgument
  ? path.resolve(process.cwd(), outputArgument)
  : DEFAULT_OUTPUT;

const TAU = Math.PI * 2;
const MASTER_GAIN = 0.115;
const PAD_GAIN = 0.72;
const ARPEGGIO_GAIN = 0.16;
const FADE_SECONDS = 8;

const BPM = 48;
const BEAT_SECONDS = 60 / BPM;
const BAR_SECONDS = BEAT_SECONDS * 4;

// Original V151 progression: Dm(add9) - Bbmaj7 - F(add9) - Csus2.
// The progression repeats slowly; voicings and upper tones are custom-built here.
const CHORDS = [
  {
    name: 'Dm(add9)',
    pad: [146.832, 174.614, 220.000, 293.665, 329.628],
    arp: [293.665, 349.228, 440.000, 587.330],
  },
  {
    name: 'Bbmaj7',
    pad: [116.541, 146.832, 174.614, 220.000, 261.626],
    arp: [233.082, 293.665, 349.228, 440.000],
  },
  {
    name: 'F(add9)',
    pad: [87.307, 130.813, 174.614, 196.000, 261.626],
    arp: [261.626, 329.628, 392.000, 523.251],
  },
  {
    name: 'Csus2',
    pad: [130.813, 146.832, 196.000, 261.626, 293.665],
    arp: [261.626, 293.665, 392.000, 523.251],
  },
];

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function smoothstep(edge0, edge1, value) {
  const x = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return x * x * (3 - 2 * x);
}

function envelope(time, attack, release, duration) {
  const attackValue = smoothstep(0, attack, time);
  const releaseValue = 1 - smoothstep(duration - release, duration, time);
  return attackValue * releaseValue;
}

function fadeEnvelope(time) {
  const fadeIn = smoothstep(0, FADE_SECONDS, time);
  const fadeOut = 1 - smoothstep(
    DURATION_SECONDS - FADE_SECONDS,
    DURATION_SECONDS,
    time,
  );
  return Math.min(fadeIn, fadeOut);
}

function chordAt(time) {
  const barsPerChord = 2;
  const chordDuration = BAR_SECONDS * barsPerChord;
  const chordIndex = Math.floor(time / chordDuration) % CHORDS.length;
  const localTime = time % chordDuration;
  return {
    chord: CHORDS[chordIndex],
    localTime,
    chordDuration,
  };
}

function padSample(frequency, time, voiceIndex, localTime, chordDuration) {
  // Slightly detuned sine partials create a soft, slowly breathing pad.
  const detune = [0.997, 1.0, 1.003][voiceIndex % 3];
  const slowMod = 1 + 0.0015 * Math.sin(TAU * 0.035 * time + voiceIndex);
  const phase = TAU * frequency * detune * slowMod * time;

  const attackRelease = envelope(localTime, 5.5, 5.5, chordDuration);
  const slowBreath = 0.88 + 0.12 * Math.sin(TAU * 0.018 * time + voiceIndex * 0.7);

  return Math.sin(phase) * attackRelease * slowBreath;
}

function arpeggioSample(chord, time, localTime, chordDuration) {
  const stepSeconds = BEAT_SECONDS;
  const step = Math.floor(localTime / stepSeconds);
  const noteIndex = step % chord.arp.length;
  const noteFrequency = chord.arp[noteIndex];

  const withinStep = localTime % stepSeconds;
  const attack = smoothstep(0, 0.035, withinStep);
  const decay = Math.exp(-withinStep * 2.8);
  const phraseEnvelope = envelope(localTime, 0.6, 3.0, chordDuration);

  // A quiet octave shimmer is mixed far below the pad.
  const fundamental = Math.sin(TAU * noteFrequency * time);
  const shimmer = 0.18 * Math.sin(TAU * noteFrequency * 2 * time);

  return (fundamental + shimmer) * attack * decay * phraseEnvelope;
}

function generateSample(time, channel) {
  const { chord, localTime, chordDuration } = chordAt(time);

  let pad = 0;
  for (let i = 0; i < chord.pad.length; i += 1) {
    pad += padSample(chord.pad[i], time, i, localTime, chordDuration);
  }
  pad /= chord.pad.length;

  const arp = arpeggioSample(chord, time, localTime, chordDuration);

  // Very subtle stereo width; no hard-panned elements.
  const stereoDrift = channel === 0 ? 0.985 : 1.015;
  const stereoPad = pad * stereoDrift;
  const stereoArp = arp * (channel === 0 ? 1.0 : 0.92);

  // A low-level original sine drone adds continuity without masking speech.
  const drone = 0.08 * Math.sin(TAU * 55 * time);

  const mixed = (
    stereoPad * PAD_GAIN +
    stereoArp * ARPEGGIO_GAIN +
    drone
  ) * MASTER_GAIN * fadeEnvelope(time);

  return clamp(mixed, -0.98, 0.98);
}

function writeWavHeader(handle, dataBytes) {
  const header = Buffer.alloc(44);

  header.write('RIFF', 0, 'ascii');
  header.writeUInt32LE(36 + dataBytes, 4);
  header.write('WAVE', 8, 'ascii');

  header.write('fmt ', 12, 'ascii');
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20); // PCM
  header.writeUInt16LE(CHANNELS, 22);
  header.writeUInt32LE(SAMPLE_RATE, 24);
  header.writeUInt32LE(SAMPLE_RATE * CHANNELS * BITS_PER_SAMPLE / 8, 28);
  header.writeUInt16LE(CHANNELS * BITS_PER_SAMPLE / 8, 32);
  header.writeUInt16LE(BITS_PER_SAMPLE, 34);

  header.write('data', 36, 'ascii');
  header.writeUInt32LE(dataBytes, 40);

  fs.writeSync(handle, header, 0, header.length, 0);
}

function main() {
  if (process.argv.length > 3) {
    throw new Error('Usage: node scripts/gen-bgm.mjs [output-path]');
  }

  const outputDirectory = path.dirname(OUTPUT_PATH);
  fs.mkdirSync(outputDirectory, { recursive: true });

  const dataBytes = FRAME_COUNT * CHANNELS * (BITS_PER_SAMPLE / 8);
  const temporaryPath = `${OUTPUT_PATH}.tmp`;

  const handle = fs.openSync(temporaryPath, 'w');

  try {
    writeWavHeader(handle, dataBytes);

    const blockFrames = 16384;
    let frame = 0;
    let byteOffset = 44;

    while (frame < FRAME_COUNT) {
      const framesInBlock = Math.min(blockFrames, FRAME_COUNT - frame);
      const block = Buffer.allocUnsafe(
        framesInBlock * CHANNELS * (BITS_PER_SAMPLE / 8),
      );

      let offset = 0;

      for (let i = 0; i < framesInBlock; i += 1) {
        const absoluteFrame = frame + i;
        const time = absoluteFrame / SAMPLE_RATE;

        for (let channel = 0; channel < CHANNELS; channel += 1) {
          const sample = generateSample(time, channel);
          const pcm = Math.round(sample * 32767);
          block.writeInt16LE(pcm, offset);
          offset += 2;
        }
      }

      fs.writeSync(handle, block, 0, block.length, byteOffset);
      byteOffset += block.length;
      frame += framesInBlock;
    }

    fs.fsyncSync(handle);
  } finally {
    fs.closeSync(handle);
  }

  fs.renameSync(temporaryPath, OUTPUT_PATH);

  const fileSize = fs.statSync(OUTPUT_PATH).size;
  const expectedSize = 44 + dataBytes;

  if (fileSize !== expectedSize) {
    throw new Error(`WAV size mismatch: expected ${expectedSize}, got ${fileSize}.`);
  }

  console.log('V151 original ambient BGM generated.');
  console.log(`Output: ${OUTPUT_PATH}`);
  console.log(`Sample rate: ${SAMPLE_RATE} Hz`);
  console.log(`Bit depth: ${BITS_PER_SAMPLE}-bit PCM`);
  console.log(`Channels: ${CHANNELS} (stereo)`);
  console.log(`Duration: ${DURATION_SECONDS} seconds`);
  console.log(`Peak master gain: ${MASTER_GAIN}`);
  console.log(`Fade in/out: ${FADE_SECONDS} seconds each`);
  console.log(`File size: ${fileSize} bytes`);
}

try {
  main();
} catch (error) {
  console.error('BGM GENERATION FAILED');
  console.error(error.stack ?? error.message);
  process.exitCode = 1;
}
