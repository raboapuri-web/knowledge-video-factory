import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const source = fs.readFileSync(path.join(root, 'src/content/beats.ts'), 'utf8');
const texts = [...source.matchAll(/text:\s*'([^']+)'/g)].map(match => match[1]);

if (texts.length !== 9) {
  throw new Error('Expected 9 narration beats, found ' + texts.length);
}

const base = process.env.VOICEVOX_URL || 'http://127.0.0.1:50021';
const speakers = await fetch(base + '/speakers').then(r => r.json());
const speaker = speakers.find(s => s.name === '青山龍星') ?? speakers[0];
const style = speaker.styles.find(s => s.name === 'ノーマル') ?? speaker.styles[0];

const mediaDir = path.join(root, 'media');
const partDir = path.join(mediaDir, 'parts');
fs.mkdirSync(partDir, {recursive: true});

function wavInfo(buffer) {
  if (buffer.toString('ascii', 0, 4) !== 'RIFF' || buffer.toString('ascii', 8, 12) !== 'WAVE') {
    throw new Error('Invalid WAV');
  }
  let pos = 12;
  let byteRate = 0;
  while (pos + 8 <= buffer.length) {
    const id = buffer.toString('ascii', pos, pos + 4);
    const size = buffer.readUInt32LE(pos + 4);
    const dataStart = pos + 8;
    if (id === 'fmt ' && size >= 16) {
      byteRate = buffer.readUInt32LE(dataStart + 8);
    }
    if (id === 'data') {
      if (!byteRate) throw new Error('WAV missing byte rate');
      return {
        dataStart,
        dataSizeOffset: pos + 4,
        dataSize: size,
        duration: size / byteRate,
      };
    }
    pos = dataStart + size + (size % 2);
  }
  throw new Error('WAV missing data chunk');
}

const buffers = [];
const durations = [];

for (let i = 0; i < texts.length; i++) {
  const text = texts[i];
  const queryResponse = await fetch(
    base + '/audio_query?speaker=' + style.id + '&text=' + encodeURIComponent(text),
    {method: 'POST'},
  );
  if (!queryResponse.ok) throw new Error('audio_query failed: ' + queryResponse.status);
  const query = await queryResponse.json();
  query.speedScale = 1.15;
  query.pitchScale = -0.026;
  query.intonationScale = 0.86;
  query.volumeScale = 0.96;
  query.prePhonemeLength = 0.08;
  query.postPhonemeLength = 0.22;

  const synthesis = await fetch(base + '/synthesis?speaker=' + style.id, {
    method: 'POST',
    headers: {'content-type': 'application/json'},
    body: JSON.stringify(query),
  });
  if (!synthesis.ok) throw new Error('synthesis failed: ' + synthesis.status);

  const buffer = Buffer.from(await synthesis.arrayBuffer());
  const info = wavInfo(buffer);
  buffers.push({buffer, info});
  durations.push(info.duration);
  fs.writeFileSync(
    path.join(partDir, 'beat-' + String(i).padStart(2, '0') + '.wav'),
    buffer,
  );
}

const first = buffers[0];
const header = Buffer.from(first.buffer.subarray(0, first.info.dataStart));
const pcm = Buffer.concat(
  buffers.map(({buffer, info}) =>
    buffer.subarray(info.dataStart, info.dataStart + info.dataSize),
  ),
);
const output = Buffer.concat([header, pcm]);
output.writeUInt32LE(output.length - 8, 4);
output.writeUInt32LE(pcm.length, first.info.dataSizeOffset);
fs.writeFileSync(path.join(mediaDir, 'narration.wav'), output);

const timingSource =
  'export const TIMING = [' +
  durations.map(value => Number(value.toFixed(3))).join(', ') +
  '] as const;\n' +
  'export const TOTAL_SECONDS = TIMING.reduce((sum, value) => sum + value, 0);\n';
fs.writeFileSync(path.join(root, 'src/generated/timing.ts'), timingSource);

const report = {
  speaker: speaker.name,
  style: style.name,
  beatCount: texts.length,
  durations: durations.map(v => Number(v.toFixed(3))),
  totalSeconds: Number(durations.reduce((a, b) => a + b, 0).toFixed(3)),
};
fs.writeFileSync(path.join(root, 'voice-report.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report));
