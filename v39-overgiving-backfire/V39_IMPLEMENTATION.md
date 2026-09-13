# V39 Production — なぜ尽くすほど、嫌われるのか？

## Production intent
15–20分想定の長尺知識動画。短文・単語の連打を避け、具体的な情景の中で人類学と社会心理学を説明する。

## Visual architecture
- 56 beats / 56 distinct visual keys.
- 56 scenes are One-off compositions for this episode; no existing shared visual template is repeated.
- Exact background reuse is prohibited. Shared drawing primitives may be reused, but each scene changes environment, camera layout, props, motion, or conceptual grammar.
- Narrative environments include: rainy station and supermarket, domestic kitchen, Roman street and atrium, 1925 study, gift exchange, restaurant, station pickup, job-search apartment, morning kitchen, office lunch, late-night bedroom, university library, presentation workspace, expensive gift, and closing kitchen.
- Conceptual scenes visualize invisible debt, reciprocity, equity, autonomy, competence, support visibility, implicit contracts, and personal boundaries.
- Literal `\\n` sequences are normalized before display and subtitles use `whiteSpace: pre-line` to prevent the V37 newline regression.

## Academic anchors
- Ancient Roman patron–client reciprocity.
- Marcel Mauss, *The Gift* (1925): gift / receive / return and social obligation.
- Gratitude versus indebtedness research.
- Equity theory and relational imbalance.
- Clark & Mills: exchange versus communal relationships.
- Self-determination theory / autonomy support.
- Visible versus invisible social support.

## Core thesis
尽くすこと自体が嫌われるのではない。贈り物が負債へ、援助が能力不足の証明へ、世話が管理へ、献身が上下関係へ、愛情が暗黙の契約へ変わるとき、受け手は愛情ではなく義務から距離を取ろうとする。

Final line: 「愛情の最も難しい部分は、どこまでしてあげられるかではなく、どこまで、してあげずにいられるか。」

## QA
- Preproduction plan reviewed before render.
- Shared pronunciation regression tests must pass.
- TypeScript compilation must pass.
- 56 script beats and 56 visual keys required.
- VOICEVOX measured timing drives Remotion scene timing and subtitles.
- Final QA sheet contains one center frame for every one of the 56 scenes.
