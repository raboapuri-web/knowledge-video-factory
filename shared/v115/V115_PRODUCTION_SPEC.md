# V115 Motion Canvas Production Spec

- Video ID: V115
- Theme: なぜ会社では「成果」より「感じの良さ」が出世を決めるのか？
- Engine: Motion Canvas 3.17.2
- Format: 1920x1080 / 30fps / H.264 / AAC
- Narration: VOICEVOX 青山龍星 ノーマル, speedScale 1.15
- Structure: 6 independently renderable chapters, 42 narration-linked semantic beats
- Visual rule: one environment holds while meaning changes through characters, cards, arrows, graphs, clocks, network links and state transitions
- Meaningful motion target: visual state change every ~2–5 seconds
- Subtitle rule: narration automatically split into short phrase chunks; persistent safe-area caption box
- Human review: representative chapter frames + final contact sheet, not every beat
- Render architecture: six-way chapter narration generation and six-way Motion Canvas rendering; approved chapters can be rerendered independently
- Headless renderer: Vite + Puppeteer + Motion Canvas Renderer API, with one retry for Vite first-load context destruction
- QA: structural plan QA, typecheck/build, per-chapter smoke render, full chapter render, final ffprobe validation, black/frozen-frame heuristic report, contact sheet
- BGM: deterministic low-volume ambient bed generated at finalize, mixed at 4%
- Final concat: stream-copy chapter concat before BGM mix
