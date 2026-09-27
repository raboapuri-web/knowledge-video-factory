# V100 State Myths — V99-method Production Specification

Title: なぜ神話は近代国家にも必要なのか？【ナショナリズム論×集合記憶×市民宗教】

## Mandatory method
V100 follows the V99 method as the default production philosophy:
- one full narration sentence = one authored scene;
- every sentence gets a scene-specific visual action;
- no imported generic background plate may carry a long passage;
- no generic renderer fallback;
- 29 explicit narrative-phase renderers;
- unique scene key and unique background group for every sentence;
- similar composition families may not repeat consecutively;
- any rolling six scenes must contain at least five distinct visual rhythm families;
- measured post-VOICEVOX scene duration must be under 15 seconds.

## What "original scene" means
Changing only the seed, crop, color, character position or prop does not qualify. Each sentence must change the semantic event being shown.

Examples:
- stadium fills: people enter aisles, vendor crosses, family seats fill, then anthem causes independent micro-actions (hat removed, snack lowered, players turn).
- rational-state paragraph: database registration, tax processing, central-bank rate board, courtroom statute, road budget and welfare spreadsheet are separate scenes rather than one office background.
- print capitalism: steam train arrival, newspaper bundle transfer, coin exchange, reader opens newspaper, distant second reader mirrors timing, pages visually join distant events.
- French Revolution: street crowd removes old symbols, public square transformed, procession moves, Festival of the Supreme Being builds an artificial mountain, symbolic authority shifts from monarchic object to republican ritual.
- invented tradition: same child watches ceremony across multiple years; camera and costume age forward; memory attaches family experience to state ritual.
- Renan: lecture hall, branching identity criteria, memory/forgetting visualization, then classroom selection and museum storage/showcase contrast.
- Bellah: inauguration choreography, oath object close-up, public ritual, cemetery walk, parent explaining anonymous graves, then redistribution/public-good scenes.
- Meiji: Edo streets and Western-style officials occupy the same moving city; rail, school, bureaucracy and new institutions appear; education-rescript scene uses classroom ritual and distribution networks.
- disaster solidarity: quake damage, distant taxpayer, budget routing, road repair, temporary housing and medical support all occur as separate physical events.
- future myth: scale-model city becomes full-size future infrastructure; construction extends beyond a contributor's lifetime; unborn generation represented through time-lapse family succession.
- exclusion: school photo with heterogeneous families, narrative frame narrows, some children fall outside the frame, then frame is consciously widened in a critical-reflection scene.
- mythless state: symbols removed one by one while efficient services continue; later citizens compare tax/service offers and the shared-reason problem appears as a concrete decision scene.
- epilogue: stadium empties, cleaners work, lights shut row by row, former crowd disperses into different next-day lives, then remote events reconnect them through shared institutions and media.

## Visual diversity
Use at least these visual grammars across the whole film:
cinematic lived scene, crowd choreography, historical street action, object macro, document interaction, printing/transport chain, split-screen simultaneity, lecture animation, museum/archive contrast, ritual procession, institutional cutaway, system flow, disaster logistics, construction time-lapse, generational transition, inclusion/exclusion framing, counterfactual simulation, final visual thesis.

Do not allow the same main object to dominate more than two consecutive scenes. Do not show paper/documents for more than two consecutive scenes. Do not use the same person pose for more than two consecutive scenes.

## QA
- exactly 195 sentence-scenes from the approved narration;
- exactly 29 phases;
- 195 unique scene keys and 195 unique background IDs;
- all phases explicitly dispatched; no generic fallback;
- TypeScript / Remotion check before voice generation;
- at least 20 preview stills distributed over the full film, including history, modern institutions and thought experiment;
- VOICEVOX 青山龍星 speed 1.13;
- measured scene guard under 15 seconds;
- parallel segmented render only after all guards pass;
- final 1920×1080, synced subtitles, narration, low BGM, contact sheet and scholarly source file.

Political neutrality: the film explains scholarly interpretations and historical mechanisms. It does not tell viewers what national narrative they should adopt or which political project they should support.
