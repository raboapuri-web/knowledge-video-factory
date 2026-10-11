# V123 — もっと政府に感謝して税金を納めよう

## 2026-10-11 V3 — 物理シーンへの全面置換

視聴レビューで指摘された「同じ動きの繰り返し」は旧 `meaningScene.tsx` の共通6フェーズ演出が原因だったため、**旧描画エンジンを削除**し、全86シーンを `physicalDirector.tsx` へ移行しました。

- 86シーンで重複しない **物理的アクションの組み合わせ**
- 26種類の背景環境、69種類の小道具・人物・乗り物などの演技対象
- 場所に合わせたカメラ構図（クローズアップ、俯瞰、見上げ、追走、二人ショットなど）
- 各シーンは固有の `set / actors / events / lens` を `content/physical-performances-v3.json` で指定
- 背景の中で道具を持つ・橋を修理する・車が移動する・住民が交渉するなどの **動作の因果** を優先
- 字幕は動く背景・役者の上にある最前面レイヤー
- `scripts/physical_qa.py` は全86件の配置とアクション組合せの重複を検査
- 本番ワークフローでは変更のない音声データを前回の `38137823912` の成果物から再利用（成果物失効時はVOICEVOX再生成）
- Releaseタグは以前の `v2` と分離して `v123-grafton-v3-...` とし、以前の完成MP4は上書きしない


2026-10-11 revised manuscript, user-edited WritingBlock 61583. **This revision supersedes the old bear-first script.**

## Exact production sources

- `content/revised/{prologue,cta,chapter1,chapter2,chapter3,chapter4,chapter5,epilogue}.txt` — complete user-edited Japanese narration, in playback order.
- `content/storyboard-v2.json` — **86 individually directed meaning scenes**; each has distinct narration range, physical setting, props and dramatic action.
- `scripts/revised_data.py` — deterministically compiles complete approved text into Motion Canvas projects/scenes and separate subtitle/VOICEVOX speech fields.
- `scripts/revised_qa.py` — validates original-text coverage, unique scene directions, 2-line/19-character subtitles and audio cue clocks.
- `src/lib/meaningScene.tsx` — original environmental set dressing, narrative-specific motion, no cascade of arriving cards; persistent objects for each shot.
- `.github/workflows/v123-motion-canvas-grafton.yml` — production, separate GitHub Actions workflow.

## Story chapters

PROLOGUE (government and tax, NOT bears) → CTA → chapter1 (Grafton 2004 and citizens) → chapter2 (budget/road/fire, bear reveal only at end) → chapter3 (bears and responsibility) → chapter4 (public economics) → chapter5 (government failure, Ostrom) → EPILOGUE (Japan and the paradox).

## Build/production invariants

1. Never summarize or silently rewrite the final revised script; **all source paragraphs must be preserved**. Only voice-specific readings may differ and `subtitle` stays as authored.
2. VOICEVOX `13`, speed `1.15`, measured chapter WAV timings; no estimated cue timing in production.
3. Noto Sans JP from `@fontsource` in npm. 1920×1080 / 30fps; subtitle blackplate plus text are the topmost view layers; no visible literal `\\n`.
4. `prepare` alone calls `npm install`; its tar package distributes `node_modules` and Chromium cache to all chapter renderers.
5. Eight VOICEVOX synth jobs run in parallel; eight independent Motion Canvas chapter renders run in parallel.
6. Manual workflow dispatch `only_chapter=chapter3` (or any other single slug) rerenders only that section and downloads other segments from the **latest v2 Release**. A full v2 Release must exist before selective runs.
7. Combine compatible MP4 segments by FFmpeg `concat -c copy`, then mix BGM with `-c:v copy` to preserve video stream and limit Action time.
8. Production output and per-chapter MP4s are published to GitHub Release when the workflow has **actually succeeded**.

## QA commands
```sh
cd shared/v123
python3 scripts/revised_data.py
python3 scripts/revised_qa.py
npm install --no-audit --no-fund
npm run build
```

Story art is stylized reconstruction, not claimed documentary footage. The bear attack must not be causally attributed to the budget proposal; proposed 30% spending reductions must not be presented as enacted policy.
