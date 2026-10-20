# V131 — なぜ優秀な社員を出世させると会社が弱くなるのか？

「考える夜」本番 Motion Canvas 版。ピーターの法則、昇進制度、トーナメント理論、2019年QJEの企業データ、2026年QJEの管理職実験を一本の物語に統合する。

## Visual direction
- 90 meaning scenes / 9 render units / 10 scenes per unit.
- 38 distinct layout grammars: office ranking, promotion room, factory hierarchy, Peter staircase, research scatter, HR comparison, tournament ladder, management experiment, delegation, dual career tracks, etc.
- 18 temporal motion programs and 10 camera programs. Adjacent scenes may not reuse layout, motion program, or camera program.
- Every scene has a unique motion signature. The renderer does not use the old shared reveal-settle-accent loop.
- No scene-level rotation. Camera motion is horizontal, vertical, or frontal scale only; diagrams remain front-facing.
- Background geometry is generated from the scene motif plus the scene-specific layout, preventing identical background reuse.
- Full subtitles are isolated in their own topmost layer. Main graphics stay above the subtitle-safe boundary.
- 90 scenes × at least 6 semantic actions = at least 540 deliberate visual changes, before internal prop animation and camera movement.

## Production
VOICEVOX: 青山龍星 / speaker 13 / speed 1.15. Each of the 9 chapters is synthesized and rendered independently after one shared prepare/build job. Every render performs smoke rendering and pixel subtitle QA before full rendering. Failed full renders retry once. Final assembly uses ffmpeg concat, low-level BGM mix, structural validation, black/freeze scan, and contact-sheet generation.

## Editorial rule
The video does not argue that high performers should never be promoted. The core distinction is between rewarding past performance and selecting for the requirements of the next role.
