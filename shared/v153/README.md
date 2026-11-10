# V153 — なぜ深海の生き物は巨大化するのか？

This production package is built from the user-supplied source file as the canonical source.

## Locked specification
- 88 screens: S001–S088
- 78 collected source stills and 10 specified generated conceptual diagrams
- 1920×1080, 30 fps
- VOICEVOX: 青山龍星 (speaker ID 13)
- Subtitles: bottom-centre, two-line layout
- Still images only, with gentle 100→106% zoom or a short pan
- No mascot, character, extra title cards, or added graphic panels
- The exact narration blocks are stored in content/board.json and content/narration_source.txt. The TTS step removes Markdown markers only; it does not rewrite words, numbers, punctuation, or headings.

## Workflow
1. scripts/preflight.py verifies scene IDs and the 78/10 split.
2. scripts/generate_diagrams.py renders the ten text-free conceptual diagrams as SVG-derived PNG stills from the supplied diagram prompts.
3. scripts/collect_assets.py acquires actual stills from the listed NOAA, NASA, Wikimedia Commons, open-access research, and other candidate pages. It records the source page, media URL, credit, and license for each selected image.
4. scripts/check_assets.py blocks rendering if a collection scene is missing, a generated diagram is missing, or a required comparison/collage is incomplete. It never fills missing animal photography with generated imagery.
5. The six chapter jobs synthesize Aoyama Ryusei audio locally with VOICEVOX and render still-image video segments with FFmpeg.
6. The final job joins the six chapters, runs ffprobe QA, and publishes a GitHub Release containing the MP4 and reports.

## Rights policy
- Commons media are used only when the file's own license is Public Domain, CC0, CC BY, or CC BY-SA.
- NOAA/NASA pages are screened for the media credit; clearly third-party credits are skipped unless a separate open license is available.
- Nautilus Live pages are not downloaded directly because the site states that Ocean Exploration Trust holds copyright. A Commons copy with a verified reuse license may be used instead.
- Every chosen image is listed in SOURCES.txt. Unavailable assets and rights exclusions are recorded in assets/asset_manifest.json.

## Render gate
The first push is asset-preflight only. Chapter rendering is deliberately gated on a later commit message containing [render-approved]; the approval marker is not included in the initial commit.
