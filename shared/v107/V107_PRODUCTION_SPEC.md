# V107 — なぜ快適になるほど、人間は弱くなるのか？ Full Original-Scene Production

Production method: V106-style authored scene system. Six narrative sections, 134 complete Japanese narration beats, approximately 7,448 Japanese characters. Each beat has a unique action slug and a unique environment identifier; no background identifier is reused.

## Content contract
- Topic: comfort, effort, avoidance learning, hedonic adaptation, ancient philosophy and meaningful friction.
- Keep the accepted long-form narration style. Do not replace it with stacked short phrases or single-word narration.
- Do not copy narration, music, frames or graphic assets from the referenced third-party YouTube video. The reference is thematic only.
- Historical/philosophical examples are descriptive, not instructions to seek severe pain or deprivation.
- Distinguish manageable challenge from harmful adversity. The Seery et al. result is an observational/longitudinal association and not proof that deliberately increasing suffering improves health.
- Avoidance can be adaptive in genuinely dangerous situations; the video discusses excessive avoidance of manageable discomfort, not avoidance of real threats.

## Visual contract
- 1920x1080, 30fps, Remotion 2D/vector.
- Every narration beat maps to its own named physical action, primary object, motion verb and scene environment.
- 134/134 unique environment IDs. No visual plate is reused by identifier.
- No adjacent equal visual family. Every rolling six scenes must contain at least five visual families.
- Representative crucial moments use bespoke choreography beyond the shared verb system: automatic door, delivery route, comfort network, past/present house contrast, IKEA assembly, summit comparison, avoidance relief loop, adversity curve, Seneca letter, lottery comparison, rising comfort baseline, progressive barbell load, human+AI collaboration, choosing stairs and the final stair climb.
- Unsupported family, object, verb, scene ID or append/replace state must throw; no generic fallback.
- All 134 scene previews must render before narration generation. Exact duplicated preview hashes fail the workflow.
- Visual similarity is additionally reviewed through the final contact sheet; technical uniqueness does not by itself prove perceptual uniqueness.

## Runtime and audio
- VOICEVOX 青山龍星 / normal, speed 1.15, pitch -0.026, intonation 0.86.
- Japanese subtitles are synchronized to measured narration beat timings.
- No SFX. Restrained BGM only.
- Any individual narrated beat >=17.5 seconds fails.
- Measured narration duration must be >=605 seconds.
- Final muxed MP4 must be >=600 seconds. The workflow must fail rather than publish a shorter output.
- Runtime may not be padded with silent black frames, duplicated footage or slowed playback merely to reach ten minutes.

## Render QA
1. Validate [20,22,24,24,26,18] complete story records and all seven fields.
2. Validate 134 unique action slugs and 134 unique environment IDs.
3. Validate scene-family diversity and semantic renderer inventories.
4. npm TypeScript strict check.
5. Render all 134 preview stills and reject exact duplicates.
6. Generate measured VOICEVOX narration and enforce duration/shot guards.
7. Plan beat-aligned parallel segments and render.
8. Concatenate segments, mix narration+BGM, verify 1920x1080, 30fps, audio stream and >=600s duration.
9. Generate final contact sheet and publish a GitHub Release only after all gates pass.
