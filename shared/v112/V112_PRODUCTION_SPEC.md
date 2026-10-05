# V112 Production Spec

Video ID: V112-market-value-40s  
Title: なぜ40代になると突然「市場価値」を問われるのか？【人的資本論×年功序列×労働市場】

## Visual rules
- Fine-grained narration-linked segmentation, target 185+ scenes.
- Every scene has a unique action/actionId/sceneKey/visual signature.
- Similar adjacent shots are rejected by QA.
- Background reuse is allowed only inside one contiguous micro-block. Reusing the same environment after leaving the block is a build error.
- If two consecutive scenes share an environment, the background itself remains static. Meaning changes are expressed by adding/removing foreground objects, changing character actions, documents, arrows, prices, charts, or labels.
- Avoid slideshow repetition. Each narration beat receives a semantic subject and physical/diagram motion.
- Rotate visual families: office-night, commuter train, home desk, career site, young-worker training, human-capital timeline, internal office map, outside market, Showa office, wage curve, household budget, hiring desk, casino-chip metaphor, interview comparison, analytics room, AI office, final home-night.
- No gratuitous zoom/pan used as a substitute for new action.

## Character continuity
- Main protagonist: Japanese male office worker, age 45, dark suit. Same rig through prologue and epilogue.
- Young-worker examples are visually distinct and only used in Chapter 1.
- Interview A/B uses two clearly separated candidate positions, not protagonist duplication.

## Pipeline
- VOICEVOX speaker: 青山龍星, slightly faster pace.
- Voice generation: six-way parallel chunks.
- Semantic smoke render runs in parallel with VOICEVOX rather than blocking it.
- Final render: sixteen parallel frame segments.
- npm dependency cache enabled on render runners.
- Final concat uses stream copy before a single audio mix.
- Deliver 1920x1080 / 30fps / H.264 / AAC with subtitles and low BGM.
- Final validation minimum: 900 seconds.
