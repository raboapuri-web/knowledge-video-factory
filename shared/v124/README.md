# V124 — なぜ私たちは「仕事」を人生の目的だと思い込むのか？

**Motion Canvas / 考える夜** — 48 authored meaning spaces, seven chapter projects.

## User-approved artistic thesis
「仕事を通じて幸福になることは間違っていない。しかし、仕事を通じなければ幸福になれないという考え方は間違っている。」

## Exact source
`content/revised/*.txt` are the complete unabridged user-edited WritingBlock 58321, sectioned into narration chapters. Do not paraphrase or truncate. The 48-shot semantic storyboard is `content/storyboard.json`. `scripts/build_data.py` reconstructs every source paragraph in source order; `scripts/static_qa.py` validates no omissions. The scene count is fixed, not one cut per subtitle.

## Production mechanics
- Motion Canvas version 3.17.2, 1920×1080 at 30 fps, H.264+AAC.
- VOICEVOX 青山龍星 ノーマル, speaker 13, `speedScale=1.15`.
- Real VOICEVOX WAV per cue + measured cue times. `director.tsx` throws before rendering if guessed timings are present.
- Permanent subtitle root rendered after content, dark opacity `.90`, two lines at most, 18 characters per line, bottom 163px.
- 48 designed spatial performances; each starts with contextual art and performs 3–5 authored physical state changes; permanent visual props are created before the timeline.
- Event-specific verbs and locations; no same six-phase animation repeatedly spawning cards.
- Seven isolated projects: `prologue`, `cta`, `chapter1`–`chapter4`, `epilogue`. Full voice generation and render are parallel, selective rebuild supported after first Release.
- One dependency install in `prepare`, prepared tar repackaged and unpacked into render workers.
- Source caption clips and recorded audio assembled in correct chapter order; FFmpeg stream copy for video, then BGM mix. Automated ffprobe, blackdetect, freezedetect checks, contact sheet and final QA JSON.

## Run locally
```
python3 scripts/storyboard.py
python3 scripts/build_data.py
python3 scripts/static_qa.py
npm install --no-audit --no-fund
# start VOICEVOX on http://127.0.0.1:50021 first
python3 scripts/synth_chapter.py prologue
python3 scripts/merge_timing.py prologue
npm run build
node scripts/render.mjs prologue --smoke
python3 scripts/smoke_qa.py output/v124-prologue-smoke.mp4
node scripts/render.mjs prologue
```

## Build audit
The local preparation environment has no npm registry or VOICEVOX HTTP connectivity; static data QA passed, but local real VOICEVOX, browser renders, actual video frame QA and MP4 production remain unverified until the GitHub Actions workflow is executed. Do not report final completion from static QA alone.
