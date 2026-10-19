# V130 — 倹約のパラドックス
**Motion Canvas 3.17.2 / 考える夜**

## Content
- Narration master: `content/manuscript.txt` (69 semantic paragraphs, eight narrative sections).
- Original geometric diagrams for money circulation, bank credit, 2008 household debt, theoretical Keynesian cross, government demand, and conclusions.
- A central comparative board shows hypothetical income 1,000万円 → 約667万円 and saving 200万円 remaining unchanged despite intended saving rate rising 20% → 30%. Later investment 200万円 → 150万円 and income 500万円 are **theoretical** figures.
- Subtitles permanently occupy the highest visual layer and never cover charts.

## Render
`.github/workflows/v130-paradox-thrift.yml` is the entry point. It uses the proven V124 Motion Canvas runtime (copied at build time), VOICEVOX 青山龍星 speaker 13 at 1.15×, eight chapter-parallel audio and video renders, real measured cue timings, ffprobe gates, ffmpeg stream copy, and GitHub Release publication.

## QA rules
No unmeasured narration is allowed into final rendering. Every subtitle cue is at most two lines of 18 Japanese characters. There are no perspective-skewed diagrams, false historical photos, speculative data series, or added scientific claims without qualifiers.

The uploaded MP4 is valid **only if the GitHub Actions production job passes and its Release is actually published**. The source commit alone is not evidence that the video exists.
