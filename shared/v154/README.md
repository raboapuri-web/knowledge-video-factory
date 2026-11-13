# V154 — 池の水をぜんぶ抜いた。その後、池はどうなったのか？

## Status
Storyboard and collector setup complete. The 47-screen photo collection is triggered separately; chapter rendering and finalization remain prohibited in this phase.

## Deliverables
- `content/board.json`: canonical structured storyboard; 90 narration scenes and 8 separate chapter cards.
- `画面一覧.md`: complete human-readable scene list with exact narration, image direction, motion, and asset category.
- `content/storyboard.csv`: spreadsheet-friendly scene list.

## Screen design
- Narration scenes: 90 (S001–S090)
- Chapter cards: 8, about 4 seconds each; title text is excluded from both TTS and subtitles.
- Source narration: 6,908 characters; estimated total duration including cards: about 22.5 minutes (preliminary estimate only).
- Asset plan: 54 photo-collection scenes / 36 generated-diagram scenes.
- One scene = one image. No split panels or multi-image collages.
- Motion: 1.20 baseline; pan at 1.20 with about 16.7% travel; static only for legibility-sensitive diagrams, up to 1.04.
- Voice: VOICEVOX 青山龍星 (speaker ID 13).
- Subtitles: fixed opaque black band, full width, about 130px high at 1080p; white centered text.

## Rights gate
Allowed: Public Domain, CC0, and CC BY only. Source page, author, license, and license URL (for CC licenses) must be recorded.
Disallowed: CC BY-SA, NC, ND, rights unknown, no-reuse/All rights reserved, or images whose reuse conditions cannot be verified.
The collection target is the 47 IDs in `assets/collector_screens.json`; pre-secured S014, S021, S028, S037, S043, S053, and S063 are excluded. Only candidates passing both the rights gate and OpenAI Vision checks may be registered as `cleared`. Image dimensions are unrestricted. The collector's output is not a rendering approval.

**Do not start chapter jobs or finalization. This task is limited to photo collection and registration. `assets/asset_gate.json` keeps `render_allowed: false` regardless of collection completeness.**
## TTS QA note

- S001 contains the source-script phrase 「少し」. The format specification flags a possible Aoyama Ryusei misreading. The approved narration text is unchanged in this storyboard; verify the actual synthesized pronunciation during audio QA and only alter the script with explicit approval.
