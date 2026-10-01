# V108 — なぜ人類は、同じ神々を何度も生み出すのか？ Production Spec

## Narrative
- Six sections: prologue, common ancestor, counterargument, transmission, cognition, epilogue.
- Accepted long-form Japanese narration is stored line-by-line under shared/v108/story.
- Each line is one narration-linked scene beat; short rhetorical sentences are grouped before rendering where needed.
- Topic: comparative mythology × historical linguistics × cognitive science.
- The film must not state that Japanese, Greek and Indian myths all share one proven origin. It visually distinguishes evidence-backed Indo-European relationships from looser cross-cultural similarities.

## Visual direction
- 1920x1080, 30fps, original Remotion 2D/vector film.
- Every narration beat receives a unique environment id, action id, scene key and physical animation.
- No background plate is reused by id. Four user-cleared library backgrounds may be used once each; all other plates are authored from code.
- Visual families rotate aggressively to suppress similar cuts: river myth, Japanese myth, Greek myth, Indian myth, underworld, archive, etymology/language, migration/trade, laboratory/cognition, abstract comparison, modern reading.
- Key bespoke sequences: eight-headed Orochi over river, sake-trap progression, Hydra decapitation/regrowth/cauterization, Kaliya river poisoning and Krishna dance, Izanagi torch reveal, Orpheus backward glance, Zeus–Dyaus–Jupiter etymology tree, phylogenetic folktale tree, Pausanias skepticism, caravan relay, snake-attention experiment, minimally-counterintuitive memory test, myth-to-modern-story transition.
- Adjacent equal visual family is forbidden. Exact duplicate preview hashes fail.
- Every beat must have narration-specific subject + verb + motion; unsupported objects or verbs throw rather than silently falling back.

## Continuity
- Because every environment id is unique, backgrounds are never reused non-contiguously.
- Where a motif continues across adjacent beats, the composition carries forward by subject placement rather than by replaying an identical background.
- No stock footage, third-party mythology art, or copied YouTube visuals.

## Audio
- VOICEVOX 青山龍星 / ノーマル, speed 1.15, pitch -0.026, intonation 0.86.
- Beat-synchronized Japanese subtitles, restrained BGM, no SFX.
- Measured narration timing drives Remotion duration.
- Final film must be at least 720 seconds; expected runtime is materially longer.

## QA
1. Validate complete story inventory and scene metadata.
2. Verify unique environment/action/scene ids.
3. TypeScript check.
4. Render every scene preview and reject exact duplicates.
5. Generate VOICEVOX and validate beat timing.
6. Parallel render final segments, concatenate, mix narration+BGM.
7. Verify 1920x1080, 30fps, audio present and duration >=720s.
8. Generate contact sheet and publish GitHub Release.
