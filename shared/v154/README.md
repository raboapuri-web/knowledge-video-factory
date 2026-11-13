# V154 — 池の水をぜんぶ抜いた。その後、池はどうなったのか？

## Production status
The user approved the final 90-image visual/material gate on 2026-11-13. Production uses only assets/final/S001.jpg–S090.jpg. The earlier collector gate is retained as historical collection status and is not the render authorization.

## Deliverables
- content/board.json: canonical storyboard with 90 narration scenes and 8 separate chapter cards.
- content/format_v2_spec.md: production format specification.
- assets/final/: 90 user-approved final JPG stills and ASSET_MANIFEST.md.
- scripts/preflight.py: validates the final image package and builds the 90-scene motion map.
- scripts/synth.py: VOICEVOX narration and subtitle timing; S001 TTS-only reading replacement.
- scripts/render_chapter.py: renders a chapter from assets/final only.
- scripts/finalize.py: assembles the master, creates final-frame contact sheets and runs QA.

## Rendering
- 90 scenes, 8 chapter cards.
- One image per scene; Ken Burns motion uses 1.20 baseline and no three consecutive identical motions.
- Five low-resolution/portrait images (S018, S028, S032, S057, S090) use the same image as a blurred background and centered sharp foreground.
- Voice: VOICEVOX 青山龍星, speaker ID 13.
- Chapter cards: silent typed titles with original typing SFX and existing approved moon-character backgrounds.
- Subtitles: fixed opaque black band at bottom, about 130px high at 1080p.
- Output: 1920x1080, 30fps, H.264/AAC MP4.
- BGM intentionally omitted at the user's request; Muse will handle any later audio post-production.

## Production gate
The dedicated render preflight verifies all 90 JPGs in assets/final, the asset manifest, chapter-card resources, and motion assignments. It writes assets/render_gate.json. The legacy rights-collector asset_gate.json is preserved separately and does not control this explicitly approved final-assets handoff.
