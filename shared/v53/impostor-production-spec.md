# V53 Impostor Phenomenon — Production Spec

## Canonical direction
Title: なぜ成功するほど「自分は偽物だ」と思ってしまうのか？【インポスター症候群×自己帰属理論】

Use the latest approved script from the production chat. The conclusion is withheld until the final chapter. Among Us is used only as an explanatory analogy; the psychology term predates the game. Core inversion: the person is genuinely a crew member completing real tasks, but interprets each success as “今回もバレなかった”.

## Fine-scene policy
- Split narration aggressively into meaning-sized scenes; target 95–130 scenes for the full script.
- Every scene gets a unique visual key. No generic fallback scene.
- Prefer concrete animated situations over abstract text cards.
- Every scene description must specify place, actor, objects, action, change/anomaly, camera framing, and transition intent.
- Do not reuse a completed composition later in the video.
- A background group may be used only for one or two consecutive scenes and may never return after leaving that group.
- If two consecutive scenes share one background, the background must remain pixel-static. Do not pan, zoom, parallax, relight, or regenerate it. Change only foreground meaning-bearing objects: add/remove people, task cards, documents, arrows, masks, chat bubbles, status indicators, graphs, shadows, etc.
- On a narration meaning change, remove obsolete foreground objects rather than accumulating decorations.
- Avoid consecutive scenes with the same framing. Rotate wide/mid/detail/insert/diagram/macro/reaction/tracking as appropriate.
- Avoid rectangular-card/template-heavy visuals. Build scene-specific Remotion compositions from low-level primitives.

## Required visual sequences
1. 00:47 bedroom/phone promotion notification: dark bedroom, phone glow, promotion message, stomach-tightening reaction, expectation shadows appearing behind the subject.
2. Office praise sequence: coworkers/manager congratulate; praise bubbles become stacked expectation debt while the office backdrop stays fixed only for its immediately adjacent continuation.
3. Two-self split: public competent self vs private uncertain self, with private search history/mistakes/unfinished drafts appearing as foreground evidence.
4. Attribution sequence: identical SUCCESS result branches into ability / effort / task difficulty / luck explanations; result remains constant while causal tokens swap.
5. Over-preparation sequence: desk accumulates revisions, rehearsal cards, question trees and clocks; successful presentation; foreground rewrites success as “10時間準備したから”.
6. Among Us analogy: original non-infringing flat/vector spaceship-social-deduction visual language, not copied game assets/UI. Explain crew/tasks/hidden impostor mechanics accurately, then invert it: protagonist is a legitimate crew member but self-labels as impostor.
7. “タスク完了” vs “今回もバレませんでした”: same completed task, two interpretation overlays; use this as a recurring motif but rebuild foreground context each time rather than reusing the same shot.
8. Promotion/expectation escalation: desk → team lead → presentation stage → expert panel; external trust rises while internal self-label remains low.
9. Knowledge horizon: beginner sees simple editing timeline; expert view unfolds into color, audio, typography, compression, copyright, retention, etc. Camera/environment changes with each knowledge layer.
10. Asymmetric comparison: protagonist sees own backstage failures/searches/deleted drafts while another creator is visible only through a polished final video. No social-media feed reuse from earlier scenes.
11. Moving goalposts: score 90→95→100, award, promotion; physical goalpost slides away after each achievement.
12. Unfalsifiable hypothesis: evidence board. Success evidence is repeatedly diverted to luck/help/easy-task bins; failure goes directly to “能力がない”.
13. Healthy doubt contrast: doctor, executive, researcher each checks assumptions; doubt acts as verification rather than self-condemnation.
14. Final synthesis: return to the opening 00:47 bedroom as a new final background group, not a reused earlier asset. Reconstruct the room from a different angle/time-state. Completed-task motif resolves from “今回もバレませんでした” to “タスク完了”. End with the hypothesis “自分はインポスターである” becoming the object under suspicion.

## Motion rules
- Background motion is prohibited inside continuity groups.
- Animate foreground only: entrances/exits, object replacement, diagram growth, hand actions, paper movement, status changes, masking, local light from foreground devices, particles only when semantically justified.
- Use narration-measured local scene progress, never a global frame value to drift backgrounds.
- Subtitles stay synchronized to measured VOICEVOX timing and do not inherit background speed effects.

## Production pipeline
Follow V52 architecture: bootstrap/materialize → preproduction plan → fine-scene/static-background guard → shared QA → shared pronunciation regression → TypeScript check → VOICEVOX measured narration → post-QA → 8-way segmented Remotion render → concat → restrained BGM mix → scene-complete contact sheet → GitHub Release.

## QA hard gates
- 95–130 scenes.
- Scene data count equals narration beat count.
- Unique visual key count equals scene count.
- At least 48 background groups.
- Each background group max two consecutive scenes; non-consecutive reuse is an error.
- Renderer backgrounds must not depend on global `useCurrentFrame` motion.
- Contact sheet must include the midpoint of every measured scene, not interval sampling.
- Reject scenes that retain foreground objects whose narrative meaning has expired.
- Reject three consecutive scenes with effectively identical composition/framing.
- Reject generic icon-grid or boxed-text fallback scenes.
