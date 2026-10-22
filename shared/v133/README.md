# V133 — なぜ人間は「罪」を洗い流そうとするのか？
**レディ・マクベス効果 × 道徳心理学** — 「考える夜」本番化実装

## Master source and design
- `content/board.json`: full narration and 73 specifically authored semantic visual beats across six render units. This is the version edited for video production and is not a character-for-character dump of the preceding chat draft.
- `scripts/compile.py`: retains the exact board narration, generates cue-level Japanese subtitles and chapter-specific Motion Canvas source, and marks estimated timings preview-only.
- `src/lib/director.tsx`: original vector scenes with 16 illustration grammars, 68 individually named visual moments, research charts, rituals, juxtaposed people, office scenes and continuous scene-state changes.
- `scripts/qa.py`: exact source-cue coverage, subtitle line-safe validation, measured-audio marker guard, stream probe and export QA.
- `SOURCES.txt`: claims and research caveat register.

## Production command
Use `.github/workflows/v133-lady-macbeth.yml` on the default branch. It compiles the six chapters, synthesizes VOICEVOX 青山龍星ノーマル (speaker=13, speed=1.15), replaces estimated cue timings with actual WAV measurement, typechecks/bundles Motion Canvas and performs smoke renders before full 1920×1080 / 30 fps chapter renders. Individual chapters upload as artifacts, then FFmpeg assembles them, mixes quiet BGM, checks codecs/duration/resolution, and publishes finished MP4 + contact sheet + QA via GitHub Release.

## Editorial choices
- Opening: Lady Macbeth, candle, handwashing and missing blood. No gore.
- Chapter 1: scientific workflow, personal guilt and 74% versus 41% comparison. The two numbers refer to one study and are not presented as general laws.
- Chapter 2: misogi, baptism, Mary Douglas, and the analogy of soil in a field versus on the dinner table.
- Chapter 3: visual cleanliness versus moral character, disgust and potential social exclusion.
- Chapter 4: an office scenario, non-equivalence of regret and restitution, 2018/2024 meta-analyses, and a moral-points parody.
- Epilogue: transition from washing away guilt to choosing the next moral action.
- Subtitles permanently sit above all imagery, in a protected lower 170px. No escaped newline shown as text.

## Acceptance gate
This source-only implementation is NOT a completed film. Verify successful workflow `finalize`, nonempty final MP4, FFmpeg `qa/final.json`, contact sheet, and editorial inspection before treating the video as complete.