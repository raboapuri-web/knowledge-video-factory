# V114 Production Spec

Video ID: V114-workload-trap
Title: なぜ真面目に働く人ほど「仕事が増える」のか？【組織心理学×能力の罠×インセンティブ設計】

## Visual rules
- Target 230+ narration-linked micro scenes.
- Every scene must have a unique actionId, sceneKey, visual signature and semantic action.
- No reused noncontiguous environment IDs.
- Same background may persist only inside one contiguous 2-scene micro-block; background remains static while foreground objects/characters are added, removed, stacked, crossed out, reassigned or transformed.
- Adjacent scenes cannot share the same family + primary + verb + shotKind signature.
- No pan/zoom used as a substitute for semantic action.
- Avoid repeated “person at desk” framing. Alternate concrete office scenes, overhead task accumulation, meeting-room breakdowns, OCB gap-filling diagrams, ratchet gears, target ladders, workload-routing maps, A–E delegation board, JD-R scales, private-life resource extraction, incentive tables, capability-hiding scenes, elevator overload metaphor and empty-desk aftermath.
- The protagonist Sato remains visually consistent across prologue, overload scenes and epilogue.

## Pipeline
- VOICEVOX: 青山龍星, slightly fast narration.
- 8-way narration generation.
- Smoke render runs concurrently with narration.
- 20-way final frame render.
- Remotion dependencies installed only once in prepare and packed with node_modules.
- Final concat is stream-copy; only the final audio mix is encoded.
- 1920x1080 / 30fps / H.264 / AAC.
- Subtitles + low BGM.
- Final runtime validation: minimum 900 sec.
- Contact sheet and structural QA included in release.
