# V105 Full Production Specification — なぜ大人になっても「少年」のままの男がいるのか？
Method: V104 original-scene discipline, complete six-part film. The first 24 authored prologue frames from the approved 148-second release are preserved. The full script comprises 116 narration-specific authored beats across prologue, Chapters 1–4, and epilogue.

## Non-negotiable runtime
Minimum **600 seconds measured completed MP4**, enforced at two separate gates:
- After synthesizing *all 116* VOICEVOX narration beats, reject if recorded speech + natural beat padding is shorter than **605 seconds**. Do not satisfy this with silent black frames, looping existing visuals or slowing playback.
- After rendering, concatenating and multiplexing BGM and narration, ffprobe the final MP4 and reject if duration is shorter than **600 seconds** or 1920x1080 video/audio is absent.
A technically successful action run alone does not prove artistic quality; review the video and contact sheet.

## Script, scenes and integrity
Use only the exact authored Japanese narration text from \`shared/v105/story/00-prologue.txt\` to \`05-epilogue.txt\`, in order. Every record has six \`|||\` separated fields: complete narration, visual family, unique physical action slug, scene-specific environment, primary prop, motion verb. Preserve prose verbatim; splitting or adjusting a genuinely overlong beat must not omit or reword content. Do not reuse other creators' video clips, scripts, music or graphics. The concrete scenes are fictional composites, not representative individuals.
Every one of 116 beats has its own nonempty action ID and physical motion assignment. Unique architectural setting identifiers and 60+ contextual families/verbs inventory are validated; no adjacent repeated family and a minimum of five distinct visual families per rolling six scenes. Repeated physical environments require new meaningful activity, not just a recolored plate. Unsupported objects, verbs, families and missing original renderers must **throw**. Do not replace them with generic slideshow panels.
- Prologue (24 shots): previously authored 24 individual Remotion SVG cases.
- Chapters 1–4 and epilogue (92 shots): authored primary objects, motion verbs, scenes, chapter-specific 2D architectural contexts, plus bespoke foreground choreographies for crucial story moments. Real household examples alternate with researched graphics, work/home split compositions and dramatic metaphor.
- VOICEVOX 青山龍星 normal speed 1.15, pitch -0.026, intonation .86. Match scenes and Japanese subtitle chunks to actual synthesized beat timings. SFX disabled, BGM subdued.
- Render 1920x1080, 30fps, H.264, 8-way or beat-aligned parallel segment matrix. Avoid splitting a scene between chunks when possible.

## Deterministic quality gates
1. Exactly [24,19,20,21,20,12] authored records; all 6 fields, every narration 20–100 characters and ending 。！？. Total script >=5800 characters.
2. Unique action IDs and environment identifiers; all 92 chapter props/families/verbs are in supported renderer inventories; original first 24 cases exist; no generic fallback.
3. Rolling six scenes contain >=5 distinct families; no adjacent same-family cuts. Chapters 1–4 have >=10 visual families.
4. npm TypeScript strict check, then representative Remotion stills from all 6 narrative parts *before* voice.
5. Generate measured VOICEVOX; reject unmatched beat ID, any shot >=17.5 seconds, incomplete speech or full voiced duration <605 seconds.
6. Render beat-aligned parallel segments, concat in numeric order without dropped frames, mux narration and BGM, validate actual completed runtime >=600s, audio stream, 1920x1080; contact sheet from *finished* MP4.
7. Publish release with exact completed MP4, contact sheet, complete production plan, QA report, this specification and linked primary sources only after validation succeeds.
