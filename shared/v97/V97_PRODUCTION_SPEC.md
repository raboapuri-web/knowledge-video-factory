# V97 National Borders — Production Specification

Title: なぜ国家には「国境」が必要なのか？【政治地理学×国家形成×公共財】

Format: 1920×1080 / 30fps / Remotion original vector-cinematic animation / VOICEVOX 青山龍星 speed 1.13 / Japanese synced subtitles / low BGM.

Narrative: 28 distinct worlds, 270–380 micro-scenes. Every micro-scene gets a new background group; no background plate is reused even in adjacent scenes. The background is not merely recolored: seed changes camera crop, road/building positions, furniture placement, terrain, walls/windows, props and light blocks. Foreground movement changes with narration: truck motion, road signs passing, market coins, bridge gates, survey tripod rotation, measuring chain extension, map ink line drawing, paper stacking, census clerks writing, school/fire/road activity, police approach/stop, military map arrows, train and freight movement, passport booklet handling, barrier opening, Schengen highway traffic, dispatch map pulses, map ruler movement, family crossing, tax/water/service diagrams.

Hard boredom guard: after measured VOICEVOX timing exists, calculate duration of every background group. Fail before render if any unchanged background remains on screen for 30.0 seconds or longer. Production target uses one background per semantic micro-scene and additionally fails at 24.0 seconds to maintain margin. Also fail if any phase remains visually unchanged for 30 seconds by checking the underlying background ID change.

Scene/QA guards before render: 270–380 scenes; exactly 28 phases; unique visual key per scene; unique background group per scene; at least 270 backgrounds; scene engine must not call useCurrentFrame; TypeScript check; 10 representative still renders spread across preview; only then VOICEVOX; after voice generation run timing/background-duration guard; then parallel render. Final release requires 1920×1080, measured duration above 650 seconds, contact sheet, source file and production specification.

No generic talking-head stretches. Shot cycle: establish / medium / detail / reaction / overhead / push-in / cutaway / macro. Background changes every beat, while foreground motion continues to visually explain the exact narration. Neutral factual treatment of borders as institutions; do not recommend immigration or territorial policy.