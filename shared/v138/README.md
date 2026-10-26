# V138 — あなたは「推し」を選んだのか、それとも選ばされたのか？
Original educational Motion Canvas film, six independently rendered chapters.
- Narration: content/manuscript.md (complete story, kept intact by compiler)
- Compiler: scripts/compile.py produces 80+ semantic scenes and measured-audio-ready subtitle cues
- Artwork: src/lib/director.tsx contains 58 separate authored 2D visual grammars, 12 micro-action modes, context-specific stage diagrams and layouts
- VOICEVOX 青山龍星 ノーマル id=13 speed=1.15; subtitle strings retained in Japanese while speech is pronunciation-checked
- Real scene timings must be generated from VOICEVOX WAV, never assumed from preview timing
- Motion Canvas 3.17.2; 1920×1080 @30fps, H.264/AAC, subtitle top layer, 15 characters per line maximum / two lines
- Stable shared/v124 headless renderer and synthesis runtime, run only by GitHub Actions. Per-chapter smoke, full parallel renders, FFmpeg final assembly, BGM and ffprobe / contact sheet QA.
- No generic stock-loop footage or third-party artwork. Repetition QA checks visual-family adjacency, source integrity and cue count.
- Source references: SOURCES.txt.
Video is not completed until final Actions job and release succeed. QA is technical, not a substitute for editorial frame review.
