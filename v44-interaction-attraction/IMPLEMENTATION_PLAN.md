# V44 Implementation Plan

## Title
ブサイクなのにモテるやつの特徴を考えてみた【恋愛心理学×社会的学習×シグナリング理論】

## Production architecture
- 62 narration beats.
- 62 distinct visual keys.
- 62 explicit scene renderer cases.
- All scenes classified One-off for this episode; no shared visual-template reuse.
- The story moves through distinct environments rather than recycling one background: late-night bar, white-background profile crop, 1972 attractiveness lab, office ID-photo booth, moving meeting room, 1950 Westgate housing, apartment corridor, communal laundry, repeated-exposure graph, university/work/community markets, dating-app bottleneck, izakaya humor scene, pottery callback, reciprocal-liking lab, speed dating, livehouse home field, social-status network, party social proof, self-deprecation spotlight, information-budget model, and the final scoring-rubric rewrite.

## Animation policy
Every scene must express the narration with moving people, props, camera-space composition, relationship lines, animated graphs, phone interfaces, environmental depth, or time-based transitions. Bar scenes use different camera positions and social configurations. Research scenes use distinct lab layouts. No generic repeated fallback background is permitted.

## Voice / subtitles
VOICEVOX 青山龍星（ノーマル）, shared pronunciation generator, speed 1.18. Subtitle timing follows measured voice duration beat by beat.

## QA
Preproduction validation, 62/62 visual-diversity guard, shared pronunciation regression, TypeScript compile, measured 15–20.5 minute duration guard, post-production timing QA, segmented Remotion rendering, narration+BGM mix, and one QA frame per scene before GitHub Release.
