# V54 Production Spec — AI Work Paradox

## Goal
Produce the final Remotion video for 「なぜAIが優秀になるほど、人間の仕事は増えるのか？【ジェボンズのパラドックス×タスク経済学】」 with meaning-driven animation rather than generic background reuse.

## Hard scene rules
- 125–210 micro-scenes.
- Every scene has a unique visual key.
- At least 63 background continuity groups.
- A background group may appear in at most two scenes.
- A background group may never reappear after another background has appeared.
- If two consecutive scenes share a background, the background layer must be pixel-static. Only meaning-bearing foreground objects may enter, leave, transform, highlight, or move.
- No completed background is recycled later in the video.
- The final office scene is a distinct background group from the opening office scene even though it intentionally returns to the same narrative setting.

## Visual grammar by chapter
1. Opening: concrete office desk, monitor, clock, AI output, proliferating deliverables.
2. Automation history: loom/tractor/computer/AI timeline; occupation decomposes into tasks.
3. Jevons: 19th-century industrial visual language; engines multiply while per-unit consumption falls and aggregate use rises.
4. Demand expansion: market-research deliverables multiply by country, segment, cadence.
5. Task economics: task conveyor; old tasks transfer to AI while new human tasks appear downstream.
6. Verification: split-screen generation vs validation; document flood; human review bottleneck; jagged frontier.
7. Quota ratchet: production bars and service expectations rise; saved time becomes new output targets.
8. Obligation: personalization grid; what becomes possible becomes expected, then mandatory.
9. Manager: one human supervising many AI agents; work shifts from execution to orchestration and accountability.
10. Evidence: productivity bars and throughput target ratchet.
11. Displacement: fewer workers plus AI handling more projects; distinguish employment count from workload.
12. Final: return to office with different angle/background; expanding work closes on another Slack request.

## Animation policy
- Background structural geometry must not reference Remotion current frame/progress.
- Foreground progress animation is permitted only when it explains the current narration: arrows, bars, documents appearing, task migration, review bottlenecks, target escalation, agent fan-out.
- Avoid decorative motion with no semantic role.
- Keep text in the visual layer sparse; subtitles carry narration.
- White/gray/black base with cyan/amber/red semantic accents.

## QA
- Typecheck/build must pass.
- Measured VOICEVOX timing is mandatory.
- 8-way segmented render.
- Contact sheet must cover all scenes.
- Final MP4, contact sheet, source list, and preproduction plan must be attached to a GitHub Release.
