# V38 Spider-Man Responsibility — Production Specification

## Title
なぜスパイダーマンは、幸せになってはいけないのか？【責任倫理×悲劇論】

## Core thesis
「善は、報われなくても善であり得る」という不都合な希望を、ピーター・パーカーの代表的コミックエピソードを通して描く。

## Visual policy
- 56 measured scenes / scene-complete QA.
- One-off visual intent for every scene; no generic fallback.
- Do not reproduce comic panels or film stills. All visuals are original Remotion vector/typographic abstractions.
- Repeated card layouts are avoided. Alternate city parallax, web trajectories, scales, falling motion, rubble lift, discarded suit, newspaper pages, hospital space, bargain diagram, quiet room, and final swing.
- Dynamic movement must be present in every major narrative turn: parallax, drifting, expansion, falling, lifting, ripples, path motion, or scale movement.
- Main palette: near-black, muted red, deep blue, off-white, restrained gold.
- Subtitles remain independent of scene motion and are synchronized from measured VOICEVOX timing.

## Narrative architecture
1. S01–S06: MJ versus siren; Parker Luck; central thesis.
2. S07–S14: Amazing Fantasy #15; Uncle Ben; power expands responsibility.
3. S15–S23: If This Be My Destiny / Spider-Man No More; responsibility as trap.
4. S24–S29: Gwen Stacy; moral luck; private love versus public duty.
5. S30–S39: Civil War / One More Day; responsibility versus omnipotence.
6. S40–S43: Public hostility; removing reward from goodness.
7. S44–S48: The Kid Who Collects Spider-Man; responsibility redefined at human scale.
8. S49–S56: Reverse question, loss montage, ethics without reward, final thesis.

## Voice
VOICEVOX 青山龍星（ノーマル）。Measured timing required. Slightly deeper and restrained delivery; no dramatic shouting.

## BGM
Dark low-frequency ambient bed, low enough to preserve narration intelligibility. No licensed music.

## QA gates
- Exactly 56 beats.
- 56 distinct visual keys.
- TypeScript must pass before voice generation.
- Shared pronunciation regression suite must pass.
- Measured VOICEVOX timing must exist before rendering.
- Final QA sheet must contain one representative frame per all 56 scenes.
- Final release must include MP4, scene contact sheet, pronunciation report, preproduction summary, and this specification.
