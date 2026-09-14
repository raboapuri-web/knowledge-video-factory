# V43 Implementation Plan

## Title
なぜ足が速い小学生はモテたのか？【発達心理学×社会的地位×運動会の歴史】

## Production architecture
- 62 narration beats.
- 62 distinct visual keys.
- 62 explicit scene renderer cases.
- All scenes classified One-off for this episode; no shared visual-template reuse.
- Scene backgrounds and staging change with the script: sports-day morning, starting line, sprint, finish crowd, classroom, recess games, psychology comparison, Meiji-era athletic meet, Monday classroom, cumulative-advantage network, social-comparison ranking, relay anchor, team picking, adult status markets, modern childhood, and the empty evening schoolyard.

## Animation policy
Each scene must express the narration through moving people, props, track lines, balls, crowds, diagrams, camera-space composition, or timeline motion. The production must not fall back to a repeated generic background. Schoolyard scenes use different school variants, track layouts, crowd placements, time-of-day lighting, and foreground actions.

## Voice / subtitles
VOICEVOX 青山龍星（ノーマル） using the shared pronunciation generator and regression dictionary. Subtitle timing follows measured voice duration beat by beat.

## QA
Preproduction validation, visual-diversity guard, shared pronunciation regression, TypeScript, measured-duration guard, post-production timing QA, segmented Remotion rendering, final audio mix, and one QA frame per scene before GitHub Release.
