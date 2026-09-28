# V102 — Welfare Paradox: V99-method production contract

Narration source: shared/v102/welfare-paradox-script.txt. Script uses 27 explicitly labeled narrative phases, full flowing sentences, no rapid noun lists.
Target: 1920x1080 / 30fps / VOICEVOX 青山龍星 / synchronized subtitles / restrained BGM.

**V99 rule:** one full narration sentence maps to one explicitly authored original scene. The exact sentence determines the visual action. No recycled generic background plate, copied V99/V100 art, template variation masquerading as a new scene, or generic fallback.

## Narrative-specific choreography (selected examples)
- Japanese mother A: ordinary bedroom/kitchen daylight, postal letter physically opened, child building blocks, daycare acceptance, phone call, office bag preparation.
- Japanese mother B: different apartment layout and nighttime or cooler palette, refusal letter, employment listing folded, workplace phone call, day plan collapses. Do not make A and B identical compositions with swapped paper color.
- ESRI study: administrative match of applicants, admission split, actual childcare attendance and work commute. Data chart says 40.3 / 18.8 percentage points as study-specific findings.
- 1834 Britain: industrial mills and separate rural landscape, firelit cottage, thread/sewing, workhouse gate, interior dormitory division, parliamentary debating chamber, local tax ledger.
- US benefit cliff: active grocery shopping, supervisor raises hourly wage, paycheck and ledger, benefits eligibility threshold, household resource graph with a real discontinuity, childcare departure risk and alternative work decisions.
- Multiple programs: different agencies physically process one household's linked wage, childcare, tax and groceries; finish in composite family budget.
- France housing: Paris tenancy inspection, subsidy approval, landlord and agent listing conversation, rent repricing, euro-to-rent flow, nonrecipient declines apartment and moves outward, housing-supply map.
- Earned-income programs: mother at diner, work tax credit, separate home with ill/caring parent, parallel household charts that acknowledge different eligibility.
- Medicaid: post-pandemic renewal workflow, envelopes on family table, mother on phone during work break, form deadline, separate eligibility-versus-process graphic, KFF 25m and 69% with historical date.
- Safety-net benefit: food purchasing to nutritious meals and generational long-term effects, not an assertion that support always fails.
- Policy tradeoffs: tapering line, supply construction, simpler renewal forms, fiscal capacity, all as separate concrete operations.
- Epilogue returns to both apartments and reveals the resource allocation boundary without political recommendation.

## Anti-repetition and continuity
- Explicit renderer case for every sentence/variant; unsupported case throws.
- Each sentence gets unique action ID, scene key and background ID.
- No adjacent identical visual families; at least 5 distinct visual families in any 6 consecutive scenes.
- Context-sensitive visual continuity within a lived scene: actors and room geometry may recur only while foreground physical events evolve, never static still or renamed icon panel.
- Identical main subject/pose/paper/graph may not dominate >2 consecutive shots.
- No unchanged background for >=30 seconds; stronger per-sentence under-15-second guard after measured VOICEVOX timing.
- Preview 20 storyboard positions and sample representative phases before voice generation. Human review of visual output is distinct from structural ID checks.

## QA / delivery
- Check 27 phase labels and each phase's exactly enumerated variant count.
- Detect duplicate action IDs, adjacent visual-family repetition, blank narration, missing explicit phase renderer, forbidden generic fallback.
- TypeScript/Remotion check and rendered still-preview success.
- VOICEVOX/audio timing guard before 8 parallel video segments.
- 1920x1080 final geometry, 30fps, synced narration, subtitles, low BGM, final duration and contact sheet; GitHub release only after all tests succeed.
- Prefer reusing successful prepared artifacts when a downstream assembly-only error occurs; do not redo the animation unnecessarily.
