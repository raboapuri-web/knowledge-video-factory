# V134 — 生活保護で「車」を持つのは贅沢なのか？

「考える夜」本番 Motion Canvas 版。2026年10月23日に報じられた、未就学児を育てるひとり親世帯への生活保護自動車保有要件緩和検討を入口に、自立・地方交通・福祉への公平感・治安・国家コストを扱う。

## Visual design
- 112 meaning scenes / 8 render units / 14 scenes per unit.
- 51 concrete spatial grammars.
- 42 information/diagram grammars.
- 112 unique semantic actions.
- 112 unique motion signatures.
- 112 unique background signatures.
- 12 semantic stages per scene = minimum 1,344 deliberate state changes before internal camera/prop movement.
- Adjacent scenes may not reuse the same space, diagram grammar, camera program or action.
- Any referenced space or diagram without a concrete renderer implementation blocks the build.
- Scene-level rotation prohibited; diagrams remain frontal.
- Subtitles are not timed by Motion Canvas. VOICEVOX measured speech timestamps generate ASS captions, then FFmpeg burns them into the rendered chapter.
- Every final chapter compares MP4 duration to the original narration WAV and fails if the difference exceeds 0.12 seconds.

## Story spaces
Morning apartment parking / car interior / rural road / bus stop / transfer terminal / daycare / welfare office / 1963 Japan / used-car lot / garage / job-access map / commuter train / low-income home / research lab / police station / courtroom / prison / government budget room / policy assessment desk / final return to the same old kei car.

## Production
VOICEVOX: 青山龍星 / speaker 13 / speed 1.15.
8-way parallel voice generation and rendering.
Smoke QA → full render → measured ASS subtitle burn → burned subtitle raster QA → narration/video sync QA → chapter packaging → stream-copy concat → BGM → final black/freeze scan → contact sheet → GitHub Release.

## Thesis
生活保護は困窮者への善意だけではなく、社会の底が抜けることで発生する治安・医療・司法コストを抑える公共インフラでもある。その立場を維持したうえで、車が「売却できる資産」なのか「制度から退出するための労働装置」なのかを地域と世帯の機能から判断する。
