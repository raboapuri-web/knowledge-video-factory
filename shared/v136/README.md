# V136 — 宗教とカルトは何が違うのか？ (Motion Canvas)

Original six-section Japanese script in `content/manuscript.md`; source text is fully preserved by `scripts/compile.py`. The compiler yields 78+ narration-anchored meaning scenes, 21+ visual grammars. No stock religious portraits, real crime reenactments, third-party footage or gore.

Motion Canvas 3.17.2, 1920×1080, 30 fps, @fontsource Noto Sans JP. Visuals: Waco timeline and legal document; ritual/donation labeling contrasts; Weber's charismatic → tradition/organization; "word" semantic feedback; bounded choice; negotiation language mismatch; rights tension; personal reflection.

VOICEVOX 青山龍星 id 13 / speed 1.15 with per-cue waveform measured timings. Project refuses to render without VOICEVOX_MEASURED. Permanent top-layer subtitles max 16 Japanese code points per line; audio and captions share IDs. Six isolated chapters, smoke render each, final FFmpeg stream copy and BGM mix; ffprobe QA and contact sheet. See SOURCES.txt.

CI reuse: copy core V124 render runtime scripts and V124 package, and run `python3 scripts/compile.py && python3 scripts/qa.py`. Preview timing is NEVER a production substitute. The video only counts as completed when the GitHub release and QA show successful full chapter renders.