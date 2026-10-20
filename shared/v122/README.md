# V132 — なぜ「官僚制」は人類が発明した完璧な管理システムなのか？

「考える夜」本番 Motion Canvas 版。古代・宋代の官僚登用、ウェーバー、アメリカ猟官制とペンドルトン法、国家能力、マートン、ジェームズ・C・スコットを一つの物語へ統合する。

## Visual system
- 90 meaning scenes / 6 render units / 15 scenes per unit.
- 27 concrete spatial worlds: municipal counter, village, registry, examination hall, ministry, kitchen, chain store, campaign office, rail network, civil-service exam room, data lab, emergency center, disaster desk, land map, forest grid, appeals room, etc.
- 37 information grammars: handoff, checksum, barrier, dissolve, fork, network, memory, pipeline, hierarchy, sieve, scatter, map, goal swap, exception gateway, continuity, assembly, final reveal, etc.
- 90 unique semantic actions and 90 unique motion signatures. No narration shares the same action ID.
- 12 semantic stages per scene, giving at least 1,080 deliberate state changes before camera movement and internal object accents.
- Scene-level rotation is prohibited. Diagrams stay frontal; camera movement is horizontal, vertical, or frontal-scale only.
- Adjacent scenes may not reuse the same space, diagram grammar, camera program, or semantic action. Structural QA blocks the render if they do.
- Background architecture is generated per scene and then transformed by a space-specific environment, preventing one generic background from being recycled throughout the video.

## Production
VOICEVOX: 青山龍星 / speaker 13 / speed 1.15. Prepare runs structural QA and TypeScript/Vite build once. Six VOICEVOX jobs synthesize measured cues, followed by six chapter renders. Every chapter performs measured-timing merge, rebuild, smoke render, pixel subtitle QA, full render with retry, and packaging. Finalize performs concat, BGM mix, 1920×1080/30fps/audio validation, black/freeze scan, contact-sheet generation, and GitHub Release publication.

## Core editorial thesis
Bureaucracy is powerful not because humans are perfect, but because it assumes they are replaceable, forgetful, biased, and temporary—and moves authority, memory, and procedure outside the individual.

## Pipeline retry
GitHub runner checkout stall was isolated from content/render code; this commit retriggers the validated V132 pipeline.
