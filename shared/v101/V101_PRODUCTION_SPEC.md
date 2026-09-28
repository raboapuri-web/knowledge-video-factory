# V101 — Greek Mythology Before The Odyssey

## Production objective
Narration-aligned Greek mythology explainer with original 2D animation. Explain gods' relationships, divine succession, human-god tension, Prometheus/Pandora, and the heroes; do not reveal the film's plot or ending.

## Source of truth
- Narration: shared/v101/greek-myths-script.txt (the narration adaptation of the conversation's approved six-phase script).
- Authored shot list: shared/v101/scene-design.json, 114 sentence-level designs.
- Renderer: shared/v101/greek-visuals.tsx, custom myth figures, scene backdrops, symbolic objects and event-specific motion.

## Scene commitments
- Split any exceptionally long complete sentence at natural commas into short VOICEVOX units.
- Each beat has a unique original action ID, matching the script's intended meaning.
- Environment identity may recur only in the immediately contiguous series. The background is frame-independent and pixel-stable throughout that group.
- Changed scene subjects are not merely renamed props: the action list includes physical operations such as loading a boat, imprisoning Titan children, swapping the stone, forging lightning, opening the jar, deflecting a dangerous gaze, extending Ariadne's thread, etc.
- No external movie footage, copyrighted character designs, third-party hero illustrations, or imported generic background plates.
- Use original vector 2D depictions, moving fore- and mid-ground props, animated figure limbs, and small original visual effects.

## Production and checks
- Validate six narrative phases and all 114 sentence-level visual specs.
- Verify no nonadjacent background reuse and no action identity duplicate.
- TypeScript/Remotion compilation and 20 preview stills.
- VOICEVOX 青山龍星 plus per-narration-unit measured audio sync.
- Subtitle display and low-volume BGM.
- Post-audio timing guard: all shots below 17 seconds.
- Parallel segment render, 1920×1080 final video, generated contact sheet, GitHub Release.

Automated identity checks do not replace human review of perceptual similarity; inspect the contact sheet and moving renders before declaring visual QA complete.