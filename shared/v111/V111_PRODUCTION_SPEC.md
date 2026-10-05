# V111 — Welfare floor / social collapse

## Title
なぜ生活保護がなくなると社会は崩壊するのか？底辺階級を救わなければいけない本当の理由。【社会保障×犯罪経済学×貧困研究】

## Visual thesis
生活保護を「受給者への現金」だけでなく、社会の底が抜けないための床・非常口・コスト移転防止装置として描く。

## Visual rules
- 1920×1080 / 30fps / Remotion 2D.
- Fine narration-linked segmentation; target >= 190 beats.
- Same background IDs can repeat only contiguously. During contiguous reuse, the background plate is static and only foreground objects/people/data change.
- A background ID can never reappear after another environment.
- No adjacent duplicate signature of family + semantic subject + physical action + framing.
- Every beat gets a unique actionId, sceneKey and narration-specific verb.
- No generic repeated “talking head” runs: every research claim gets a chart, mechanism diagram, source-country cue or cost-flow visual.
- Low-income characters are depicted neutrally and with dignity; no criminal visual shorthand is attached to poverty itself.

## Dedicated sequences
1. One-room morning: overdue rent notice + utility bill + ¥2,000 wallet + phone + nearly empty refrigerator.
2. Employment-loss cascade: warehouse contract ends → applications → interview → back pain → savings bar falls.
3. Food compression: convenience meal → cup noodles → two meals/day → bread/mayonnaise.
4. Welfare switch removed: bank transfer line disappears; calendar advances; rent meter hits zero.
5. Housing-loss chain: key handed over → address card erased → mailbox/charging/shower/clothes icons disappear.
6. “Work requires stability”: clean shirt, charged phone, address on résumé, alarm clock, bed appear as prerequisites.
7. Camera pullback: landlord, ambulance, hospital, municipal worker, police, family connected to the same event.
8. Cost does not vanish: one welfare invoice morphs into multiple larger invoices to health/emergency/police/family.
9. Social floor diagram: income/asset/health/housing nodes above a red “no floor” void, then a safety floor slides in.
10. Poverty spiral: ¥10,000 short → phone cut → missed hiring call → lower income → unpaid rent → no address → harder job search.
11. Winter station bench: medication bottle empties → meal clock becomes irregular → health bar declines → collapse → ambulance.
12. JAMA housing trial visual: hospitalization −29%, hospital days −29%, ED −24%, clearly labeled as a US homeless-health trial.
13. Housing First cost offset: housing/case-management bar rises while shelter/emergency/outpatient bars fall; “about half offset” callout.
14. Externality river: factory saves on waste treatment while pollution cost flows downstream; then morphs into welfare-cost shifting.
15. Crime-evidence caution screen: poverty ≠ criminality; separate property-crime and serious-violence branches.
16. SSI natural experiment timeline: 1996 → age 18 reassessment → benefit loss vs continuation → 20-year charge paths.
17. Public budget transfer: welfare budget shrinks while police/court/prison bars rise.
18. Denmark spillover map: treated household node → neighboring nodes, explicitly marked as foreign evidence.
19. Finland basic-income counterexample: 2,000 people / €560 / no significant crime effect; balances the prior sequence.
20. Convenience-store choice-space scene: empty wallet / no sleep / no rent versus next-month essentials secured; “options narrow” diagram.
21. Middle-class woman: salary/tax/mortgage ledger → company collapse → unemployment → illness → divorce → savings fall → home sale.
22. Same person across time: taxpayer badge becomes recipient badge, then worker badge again.
23. Life-risk wheel: illness / unemployment / disability / care / divorce / bankruptcy / bereavement.
24. Macro downturn loop: unemployment → income ↓ → consumption ↓ → sales ↓ → layoffs ↑.
25. Automatic stabilizer buffer: market-income shock plunges; disposable-income line falls less; OECD ~60% model estimate labeled across 23 countries, not livelihood protection alone.
26. Emergency staircase metaphor: high-rise employees never use stairs, but risk consequence makes it rational to keep them.
27. Return to original one-room: every unpaid cost sends arrows to landlord/health/family/admin/police.
28. Fire extinguisher / emergency exit analogy.
29. Final ship: first class / second class / cheapest cabin; hole opens below waterline; water rises from bottom through decks.
30. Last image: a floor under the lowest figure extends under every figure above; final line “社会そのものを、底から崩さないため”.

## Fast production
- Structural QA in Node; no 190+ separate Remotion still processes.
- One semantic smoke composition covers unique primary×verb combinations in a single Remotion render.
- VOICEVOX split across 4 runners and reassembled in order.
- Final film split into 12 render segments, max 12 parallel jobs, Remotion concurrency 4 per runner.
- Final contact sheet generated once from completed video.
- Release only after 1920×1080, 30fps, audio, runtime and narration/scene synchronization validation.
