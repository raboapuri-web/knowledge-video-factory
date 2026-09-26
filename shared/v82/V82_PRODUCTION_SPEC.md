# V82 Basic Income — Production Specification

Title: ベーシックインカムは世界を良くするのか？【労働経済学×福祉国家論×行動経済学】

Format: 1920×1080 / 30fps / Remotion / VOICEVOX 青山龍星 / synchronized Japanese subtitles / subtle BGM.

Narration structure: 38 distinct historical and contemporary phases, 311 sentence-aligned micro-scenes expected before measured-audio timing. Story worlds move from modern Tokyo to 1790s England, US income-maintenance experiments, Dauphin MINCOME, Alaska, Finland, OpenResearch, rural Kenya, fiscal administration, AI automation, essential work and a final Tokyo station sequence.

Visual quality:
- At least 150 unique contiguous background groups; one group may serve only one or two adjacent narration beats.
- Never reuse a background group after leaving it.
- Background geometry must be frame-static within a group; no panning/zooming/shaking while the same plate is held.
- Every new background group receives seeded architectural/set-dressing changes. Similar categories must still differ in window layout, building position, furniture placement, terrain, shelf contents, workstation layout or ambient objects.
- Foreground animation must change semantically with narration: sitting, standing up, sitting while looking at smartphone, walking while looking at smartphone, walking, carrying, working, talking, document handling, bank notification, cash transfer, charts, application forms, machinery, oil pump, robots, shelves, market transactions and train arrival.
- Use frequent scene transitions, with a new continuity plate every 1–2 beats and short neutral transition flashes only; do not use decorative camera movement as a substitute for new staging.
- Do not create wallpaper scenes where only subtitles change.
- Historical figures are symbolic silhouettes/illustrations, not portrait likenesses.
- No real app/company UI logos; use generic bank/job/message interfaces.
- Only subtitles may contain explanatory text.

Reliability / error prevention:
1. Bootstrap must parse exactly 38 phase labels and 270–360 micro-scenes.
2. Preflight rejects duplicate visual keys, nonconsecutive background reuse, background groups with >2 beats, <150 groups, or missing phase-to-world mapping.
3. TypeScript check must pass before any VOICEVOX generation.
4. Eight critical Remotion stills must render successfully before audio synthesis.
5. Measured VOICEVOX timing is the source of final duration; no artificial stretching.
6. Render in 8 parallel chunks with fail-fast=false, concatenate only after every segment exists.
7. Final QA verifies 1920×1080, runtime >1000 seconds, narration+BGM mux, and generates a scene-complete contact sheet.
8. Publish a GitHub Release only after all checks pass.

Do not call the video complete until the final Release contains both MP4 and V82 contact sheet.
