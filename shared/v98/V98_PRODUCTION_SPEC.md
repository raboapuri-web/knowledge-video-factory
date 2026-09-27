# V98 National Borders Rebuild — Production Specification

Title: なぜ国家には「国境」が必要なのか？【政治地理学×国家形成×公共財】

This is a full visual rebuild, not a patch of V97.

## Core visual rule
Do not confuse a high scene count with visual variety. A new scene is only acceptable if the viewer perceives a genuine change in what is being shown. Repositioning the same road, same houses, same paper rectangle, or same person on the same style of background does not count as a meaningful visual change.

The production must alternate among at least 14 visual modes:
cinematic environment, human action, object macro, route/top-down movement, map, map overlay, split screen, document desk, archive, market transaction, institution interior, montage, diagram, system/network, meeting, timeline, and counterfactual visualization.

No two adjacent scenes may use the same visual mode. In every rolling five-scene window, at least three distinct visual modes are required. Every narrative phase must use at least four distinct visual modes.

## Narration-specific animation
Each micro-scene must answer: "What concrete thing should the viewer see while this sentence is spoken?"
Examples:
- "same mountains and river, law changes" → moving truck crosses a sign; landscape stays continuous while legal/institution icons change.
- medieval overlapping authority → stacked translucent territorial overlays over one village, then cut to toll gate, monastery rights, lord's ledger.
- survey/state formation → tripod rotates, chain extends, stake is hammered, then cut to desk map where a line is drawn.
- taxation → merchant physically hands coins; ledger fills; then diagram links tax to road/school/fire service.
- police jurisdiction → police car approaches border, stops, second-country unit takes over; split screen shows two legal systems.
- domestic market → multiple internal toll gates disappear as rail line and standardized measures appear.
- passport history → station crowd, booklet close-up, wartime checkpoint, international meeting table with multiple passport formats.
- Schengen → car passes open internal border, then cut away to external-border systems, shared police data and visa coordination.
- welfare/public goods → four distinct lived scenes: school, hospital, fire response, road repair; do not show them as one repeated icon panel.
- colonial partition → ruler on map, then cut to same community split on the ground; family/market route interrupted by new border post.
- borderless-world thought experiment → barriers disappear first; later tax, police, river, hospital and corporate-jurisdiction conflicts appear as separate scenes.

## Background policy
Every micro-scene has a unique background ID. More importantly, visual family changes are enforced. Scene duration after measured VOICEVOX timing must be under 18 seconds, with target typically 2–8 seconds. User hard limit of 30 seconds is therefore impossible to exceed if QA passes.

Selected existing asset-library backgrounds may be used only when they genuinely match the narration, and each source image may appear at most twice in the whole video. Historical scenes must use purpose-built vector environments rather than forcing modern reusable backgrounds into the wrong era.

## QA before render
- 270–380 narration-aligned scenes.
- Exactly 28 narrative phases.
- At least 14 distinct visual modes.
- No adjacent identical visual mode.
- Every five-scene window: at least 3 visual modes.
- Every phase: at least 4 visual modes.
- Unique visual key and background ID per scene.
- Existing background-image asset reuse <=2.
- TypeScript/Remotion check.
- 14 representative still previews spread across the full storyboard, intentionally sampling different visual modes.
- VOICEVOX generation only after preflight passes.
- Measured timing guard after voice generation: no scene >=18 seconds.
- Parallel render only after all above pass.
- Final: 1920×1080, audio/subtitles/BGM, contact sheet, sources and production spec.

Political neutrality: descriptive institutional analysis only. Do not recommend stricter/looser border, immigration, territorial, party, candidate, or election policy.
