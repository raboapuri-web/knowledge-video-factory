# V99 National Borders — Original Scene Production Specification

Title: なぜ国家には「国境」が必要なのか？【政治地理学×国家形成×公共財】

## Why V99 exists
V97 and V98 changed shots too often but still reused recognizable visual systems. V99 treats each full narration sentence as a single authored visual idea instead of splitting sentences into multiple generic cuts.

## Hard visual rule
- Exactly 195 scenes: one narration sentence = one original scene.
- 28 narrative phases.
- Every scene has a unique background ID and a unique phase/variant key.
- No imported reusable background image assets. All environments are built specifically for this video from vector geometry.
- Reusable primitives are limited to low-level drawing atoms only. The viewer must not see the same completed composition, prop cluster, or background reused.
- Each phase gets its own environment logic and scene progression.
- Visual families are rhythm metadata only; the actual rendering is phase-specific.
- No adjacent identical visual family.
- In any six consecutive scenes, at least five distinct visual families.
- A scene may last no longer than 15 seconds after measured VOICEVOX timing. Target is generally 3–8 seconds.

## What "original scene" means
A scene must directly visualize the current sentence, not merely decorate it.

Examples:
- Same landscape / different law: truck crosses a physical sign while institutional symbols change behind the same continuous mountain/river geography.
- Medieval layered authority: one village is progressively overlaid by lord, church, city and crown claims, then the next sentence becomes a physical toll bridge or monastery privilege scene, not the same map again.
- Surveying: rotate the instrument, stretch the measuring chain, hammer a stake, then cut to a separate cartography room where the measured points become a line on paper.
- Taxation: merchant physically hands coins to an official, ledger entry appears, then later scenes show roads/schools/fire service being funded as different lived environments.
- Police jurisdiction: damaged vehicle, approaching patrol, boundary stop, second-country unit takes over, extradition papers, and jurisdiction diagram are separate authored scenes.
- Domestic market: internal toll gates are physically removed, rail line grows across the country, weights/measures standardize, and a merchant route becomes continuous.
- Passport history: prewar station freedom, wartime checkpoint, document close-up, postwar retention, League of Nations table and standardization each receive different scenes.
- Schengen: open highway crossing, remaining state institutions, external border infrastructure, shared police information and visa coordination are separate settings.
- Colonial partition: conference table and ruler, on-the-ground boundary post, split family route, divided market and grazing route are distinct scenes.
- Borderless-world thought experiment: barriers vanish first; later corporate tax, police, welfare, river and hospital conflicts are visualized separately, followed by a governance replacement scene.

## QA before render
1. Parse exactly 195 sentence-scenes.
2. Exactly 28 phases.
3. Unique sceneKey and background ID for every scene.
4. No adjacent same visual family.
5. Any six-shot window has at least five distinct families.
6. Each phase uses at least five families where its length permits.
7. scenes.tsx contains explicit renderer coverage for all 28 phases and throws on an unsupported phase or variant; no generic fallback.
8. TypeScript/Remotion check.
9. Render 20 representative stills distributed across the entire film.
10. Generate VOICEVOX only after still QA succeeds.
11. Measured timing guard: every scene <15 seconds.
12. Parallel final render, ffmpeg merge, 1920×1080 validation, contact sheet, Release.

## Editorial neutrality
Descriptive institutional analysis only. Do not recommend a party, candidate, immigration restriction level, territorial claim, or electoral choice.
