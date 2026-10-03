# V109 — なぜ無能の社員ほど、自分がエースのように振る舞うのか？ Production Spec

## Narrative
- Six sections: prologue, metacognition, statistical counterargument, status signaling, expertise/organization, epilogue.
- Preserve the accepted argument: Dunning–Kruger is the entry point, not the total explanation.
- The turning point is organizational: confidence can function as a visible status signal while actual competence is partly latent.
- The ending distinguishes “ability” from “ability-like performance” and avoids implying that quiet people are inherently more competent.

## Visual direction
- 1920×1080, 30fps, Remotion 2D/vector documentary animation.
- Fine scene segmentation from narration sentences; target well above 150 narration-linked beats.
- Reuse an identical background only for deliberately continuous adjacent sequences. When reused, the backdrop remains static while foreground objects, people, charts, files, and actions change.
- Any background used again after another environment intervenes is forbidden.
- Use cleared template assets where they fit: office, client meeting room, office break room, company workspace, dark abstract room, research room.
- Use office-worker-rig.tsx and office-woman-rig.tsx as character templates. Character identity stays consistent by suit colors and role placement.
- Original procedural environments fill all other scenes: morning meeting, open-plan office, client call desk, late-night workstation, lunch room, test lab, sales simulation, statistical graph room, status ladder, contract desk, incident response, forecast room, server-room example, promotion loop, evaluation dashboard, quiet correction desk.
- Similar-cut suppression: rotate composition families, camera framing and semantic actions; exact duplicate preview hashes fail.
- Every narration beat receives a dedicated action id and a physical/diagrammatic motion verb.

## Key original sequences
1. Monday 9:30 meeting: manager briefing → confident worker interrupts → rises → points at process → quiet experienced worker studies documents.
2. Previous-month rewind: client phone call → old data highlighted → delayed handoff → quiet worker repairs deck at night → next-day delivery → lunch-room boast.
3. Dunning–Kruger study: test sheets → quartile chart → 12th percentile vs estimated 62nd percentile → “double burden” diagram.
4. Writing ability example: bloated proposal physically expands → missing conclusion → weak evidence → reviewer annotations appear.
5. Sales failure: conversation path splits into shallow question / missed need / overlong explanation / premature close.
6. Statistical counter: bounded score axis → 10-point and 95-point cases → error arrows → regression-to-mean visualization.
7. Expert metacognition: novice/expert confidence gauges and error-warning mismatch.
8. Status experiment: three speakers with uncertain/qualified/absolute answers → audience attention shifts → status ladder rises under confident speaker.
9. Invisible work vs visible firefighting: contract corrections quietly disappear before submission vs self-created crisis followed by dramatic overnight response.
10. Confidence–accuracy 0.22: scatter-style visual that prevents treating confidence as competence.
11. Expert complexity: sales forecast branches; server restart vs memory-leak diagnosis.
12. Organizational credit: project success fragments into idea/planning/fix/support/client-friction contributions; self-promoter enlarges one slice.
13. Feedback loop: confidence → visibility → status → speaking opportunities → confidence.
14. Final evaluation dashboard: predictions/results, claims/outcomes, assignments/corrections, prevented failures separated into auditable columns.

## Audio / QA
- VOICEVOX 青山龍星 / ノーマル, speed 1.15, pitch -0.026, intonation 0.86.
- Japanese subtitles synchronized to measured narration.
- Restrained BGM, no SFX.
- Final runtime guard: >= 1050 seconds.
- TypeScript check, all-scene preview render, exact-duplicate rejection, measured narration validation, segmented render, final 1920×1080/30fps validation, contact sheet and GitHub Release.
