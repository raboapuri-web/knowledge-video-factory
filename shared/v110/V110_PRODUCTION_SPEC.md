# V110 — Responsibility, Delegation and Team Fragility

## Title
なぜ「責任感が強い人」ほど、チームを弱くすることがあるのか？【属人化×委任×コントロール欲求】

## Narrative structure
- Prologue: 21:40 office, Sasaki rewrites a subordinate's proposal, recurring rescue pattern, sick-day collapse.
- Chapter 1: one estimation mistake → checking expands → responsibility becomes psychological ownership and control.
- Chapter 2: Sasaki takes Tanaka's mouse and supplies correct answers; short-term efficiency prevents decision-making practice; delegation means transferring some judgment.
- Chapter 3: Slack storm and commute replies; Sasaki becomes a tollgate/bottleneck; transactive memory network versus one giant central node; cross-training.
- Chapter 4: Tanaka's imperfect client presentation; Sasaki deliberately waits; safe failure, delegation boundaries, today-efficiency versus future capacity.
- Epilogue: one-week vacation as a stress test; distributed roles, fewer notifications, shared leadership; “a strong team moves while the hero rests.”

## Visual rules
- 1920×1080 / 30fps / Remotion 2D.
- Fine narration-linked segmentation, target >= 180 beats.
- Identical background IDs may only repeat contiguously. While contiguous, the background plate remains physically static; foreground people, files, messages, charts, arrows, highlights and objects must change every beat.
- A background ID can never return after another environment intervenes.
- Adjacent visual signatures (background family + semantic subject + action + framing) must never be identical.
- Every beat has a unique actionId, sceneKey and narration-specific motion verb.
- Recurring characters remain visually consistent:
  - Sasaki: dark navy suit.
  - Tanaka: muted gray-blue suit.
  - Client/other members: alternate palette.
- Use cleared template office backgrounds and office rigs where appropriate; use custom procedural environments elsewhere.

## Dedicated animated sequences
1. 21:40 office clock → proposal pages → red corrections → graph rebuild → 22:00 finished deck.
2. Monthly repetition calendar → subordinate effort decreases → Sasaki node grows into central hub.
3. Sick-day sequence: empty chair → frozen team → three unresolved questions → Slack mentions multiply → phone lights up in bed.
4. Estimation-error origin: wrong amount circled → client call → apology → “I will check next time.”
5. Check creep: final document → formula → email → presentation → mouse taken away.
6. Psychological ownership: client/file/knowledge objects move inside Sasaki's boundary; information-sharing arrows get blocked.
7. Tanaka training: asks → Sasaki grabs mouse → title reorder → email rewrite → 5% answer card.
8. Answer versus answer-making: finished answer drops from above while decision tree underneath fails to grow.
9. Delegation loop: no delegation → no growth → “cannot delegate” → loop tightens.
10. Slack storm: one reply clears, two notifications spawn; lunch/meeting/train micro-scenes.
11. Tollgate metaphor: five roads collapse into one booth, queue length grows, booth closes and network stops.
12. Transactive-memory network: customer/numbers/technology nodes distributed across members and connected by “who knows what.”
13. Central-node failure: all knowledge edges reroute to Sasaki; node enlarges until single-point failure crack appears.
14. Cross-training: role cards rotate between members; network gains alternate routes.
15. Client presentation: slide 1 too long → client gaze drifts → slide 2 confusion → Sasaki's hand almost rises then stops → Tanaka self-corrects.
16. Safe-failure boundary: green/yellow/red zones define what can be decided alone, consulted, or escalated.
17. Time exchange: “1 hour self-do” versus “2 hours teach / 3 hours delegate” morphs into six-month future capacity.
18. Vacation test: roles distributed, judgment handbook left behind, Slack opened then closed, notification count falls.
19. Return to office: team operates without drama; Sasaki's central node shrinks while network strengthens.
20. Final hero-versus-system image: one hero holding ten tasks dissolves into ten people each owning one decision path.

## Fast pipeline
- No per-scene Remotion process launches.
- Structural uniqueness QA runs in Node.
- One short semantic smoke composition renders representative subject/action pairs in a single Remotion process.
- VOICEVOX generation uses bounded parallel workers while preserving beat order and measured durations.
- Final film uses 12-way segmented rendering, up to 12 concurrent jobs, with Remotion concurrency 4 inside each job.
- Final contact sheet is extracted once from the finished film.
- Release only after resolution/fps/audio/runtime validation.
