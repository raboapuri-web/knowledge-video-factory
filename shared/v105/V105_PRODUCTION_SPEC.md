# V105 — なぜ大人になっても「少年」のままの男がいるのか？ / V104方式
Current implementation: **prologue only**. The full four chapters and epilogue are not yet materialized or rendered. Do not publish the prologue as a complete 20-minute video.

## Production contract
- Original Japanese narration only, from \`shared/v105/story/00-prologue.txt\`; 24 manually authored records, six fields separated by \`|||\`.
- Every record has a dedicated physical act, primary visual subject, nonrepeated architectural environment, visual family and uniquely implemented SVG scene case.
- 2D React/Remotion at 1920×1080, 30fps. Match each scene boundary to the **measured** VOICEVOX 青山龍星 normal voice audio (speed 1.15). Japanese subtitle snippets follow each measured beat.
- BGM is restrained; **no sound effects**. Never use generic video plates or placeholder imagery. Returning to a location later in the complete video requires a new meaningful physical action rather than a freeze frame.
- Avoid editorial assertions about all men: dramatized male protagonist is a fictional example, not representative of a population. Prologue contains no empirical statistics.
- The original 24 authored actions are physically distinct: apartment recline, tabletop scan, mother-message bypass, graduation-to-manager, subway commute, work/home comparison, unseen electric bill and empty fridge, deferred future conversation, cross-domain task board, argument gestures, work-as-shield, subjective questioning, bedroom-door closing, clock/game avoidance, dollhouse revelation, graduation/employment/income milestones, rank/maturity axis, dropped home responsibility, imbalanced obligation scale, revealing support hands, isolated question, child inside adult silhouette, social-role mosaic and library book opening.

## Failure gates
1. Exactly 24 nonempty narration/action records; no duplicate action ID, verb, setting, family or scene key.
2. Every renderer numbered 1–24 is defined; unsupported scene numbers must **throw**, not fall through to generic B-roll.
3. npm TypeScript check and 24 individual Remotion still renders must pass **before** voice generation.
4. Generate actual VOICEVOX takes; verify 24 matching beat IDs, positive measured durations and all shots under 17.5 seconds.
5. Render three parallel image-only chunks, concatenate without a cross-chunk frame gap, mix narrated audio plus BGM, validate duration/frame dimensions/audio stream with ffprobe.
6. Generate contact sheet and publish a named prologue-only release after all technical checks. Render success is not a claim of manually inspected artistic quality.
