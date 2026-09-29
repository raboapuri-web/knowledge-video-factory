# V104 — Why One Vote Regardless of Taxes? | V99-method production contract

Topic: なぜ納税額に関係なく一票の価値が同じなのか？【政治哲学×選挙制度史×公共経済学】
Production: Remotion 2D, 1920×1080, 30 fps, VOICEVOX 青山龍星 speed ≈1.15, exact measured narration and synced Japanese subtitles, restrained BGM.

## Unconditional content contract
Use only the complete narration stored in shared/v104/story/00-prologue.txt through 05-epilogue.txt in that order. Each manually written record contains one complete narration sentence plus its own visual family, physical action, unique architectural setting, primary subject and animated verb. Do not substitute different wording or regenerate narration from keywords. Retain the complete narrative distinction between voting eligibility, plural voting, public authority, tax incidence and inequality of practical political influence.
Fictional polling, fictional taxation-proportional voting scenario and non-identifiable candidates. Do not use campaign logos, politician portraits or party symbols. Historical examples are descriptive, not endorsements of any electoral rule. Stage a fictional 100万円=10票 / 10万円=1票 election only as an explicitly hypothetical institution; never claim it existed.

## V99 original-scene discipline
Every full narration record maps to an original scene with unique actionId, sceneKey and story-specific verb/primary subject. Do not recycle the visual assets from V99/V100/V102, rename identical icon panels, rotate a reused generic stage or alternate identical backgrounds to meet a scene-count target.
The architecture is authored for this topic: modern Japanese school polling site, Meiji 1890 polling precinct, Victorian cotton mill and property franchise, 1791 French assembly, Taisho street suffrage campaigns, 1928 and 1946 Japanese polling stations, John Stuart Mill’s study, historical university constituency, 1948 Commons, 1960s Virginia poll tax, shareholder assembly, Japanese constitution, corporation-vs-state simulation, paid and unpaid care, indirect tax retail receipts, fluctuating taxable income, turnout-time burdens, unequal constituency populations, and a final modern ballot count.
Production uses 6 chronological chapters and at least 25 meaningfully distinct visual families. No two consecutive scenes use the same family; every rolling six scenes contain at least five distinct families. A contiguous return to a room is allowed only for a meaningful new physical action, and no unchanged background plate may remain for 30 seconds. Each individual narration shot must be below 17 seconds based on measured VOICEVOX timing; split a genuinely overlong narration at a natural comma, keeping full original text, if needed.

## Choreography requirements
Show an executive arriving and receiving ONE ballot, supermarket worker entering on shift, senior woman with a cane taking her ballot, and an electoral worker tallying all ballots without tax weighting. The 1890 tax certificate must be inspected and the worker refused because of historical eligibility, not depicted as a modern condition. Animate eligibility maps, property threshold, Meiji→Taisho→1946 reform, Mill writing plural-vote theory, physically distinct university and residence ballot boxes, UK parliamentary debate, Virginia poll-tax desk, stock votes multiplying, tax money changing next election weights in hypothetical simulation, nursing night shift, unpaid family caregiving, grocery consumption-tax receipt, career/payroll changes, and equal-franchise conclusion.
Every subject and verb from the manually authored storyboard must have a visible semantic action, not just a caption or fade. Visual modes vary among tracking, environmental drama, human gesture, document macro, chart, legal archive, parliamentary interior, city map, split-screen comparison, calendar, research bench, feedback simulation and abstract civic metaphor.

## Deterministic preflight
1. Parse every story record, verify exactly six fields and complete Japanese sentence, record counts and unique action slugs. Verify no duplicate semantic action and no two identical scene keys.
2. Verify each configured visual family is a supported dedicated renderer, each configured primary object is supported, and each motion verb is supported; reject generic fallback.
3. Verify all architecturally identified settings have a stable authored context and return visits are intentional; limit background reuse to contiguous narrative continuity.
4. Test six-shot visual-family diversity and all hero animation IDs. Check TS/Remotion and at least 24 representative still renders across the whole video, spanning every narrative chapter.
5. Generate VOICEVOX only after preflight passes. Run measured timing/scene guard before rendering video. On failure report the actual error, fix the exact failing step, reuse already valid artifacts rather than rerendering work unnecessarily.
6. Render eight parallel segments, concat with ffmpeg, mux narration+BGM, verify 1920x1080 at 30 fps, audio and duration, generate contact sheet, then publish release with production plan, QA summary and sources.

Approval: A GitHub workflow success verifies technical conditions only. Visual quality claims require actual rendered frame review; no promises of zero defects without verification.
