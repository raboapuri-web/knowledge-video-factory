# V154 — 池の水をぜんぶ抜いた。その後、池はどうなったのか？

## Status
Storyboard only. Asset collection, rights review, chapter rendering, and finalization have not started.

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
Allowed: Public Domain, CC0, CC BY, or another image only when the source page explicitly confirms reuse and the source, author, and license can be recorded.
Disallowed: CC BY-SA, NC, ND, rights unknown, no-reuse/All rights reserved, or images whose reuse conditions cannot be verified.
No image assets have been collected or approved in this storyboard commit. `sources` are empty and every scene is marked `未収集・権利未確認`.

**Do not start chapter jobs or finalization until all 90 scene assets pass rights review and full-size visual-fit review.**
## TTS QA note

- S001 contains the source-script phrase 「少し」. The format specification flags a possible Aoyama Ryusei misreading. The approved narration text is unchanged in this storyboard; verify the actual synthesized pronunciation during audio QA and only alter the script with explicit approval.
