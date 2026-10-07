# V116 Production Spec

Video ID: V116-middle-class-welfare
Title: なぜ貧困層への支援を削ると「中間層」まで貧しくなるのか？【マクロ経済学×社会保障×格差研究】

## Story / visual policy
- 長文ナレーションを維持し、短文・単語の連発にしない。
- 7章、100 scenes以上。
- 1 narration scene内にも最低2種類の時間変化を持たせる。
- 全sceneに固有 action / actionId / sceneKey / visual / environment を割り当てる。
- environmentは全sceneで一意。
- 隣接sceneで同じbackground familyを禁止。
- 隣接sceneで family + primary + verb + shotKind が一致したら失敗。
- 同じスーパーや同じ主人公を再登場させる場合でも、棚配置、時間帯、カメラ角度、商品、小物、周囲の人物を変える。
- 背景のパン・ズームだけでは別カット扱いにしない。
- 背景内部で商品、客、レジ表示、売上グラフ、車、看板、シフト表、工場機械、地域マップ、金銭フローを動かす。
- 人物は「低所得の母親」「スーパーの中間層パート」「店長」「会社員」「1930年代労働者」「政策担当者」を視覚的に区別。
- 現代人物には既存 office-worker-rig / office-woman-rig を意味が合う場面で活用。

## Core visual worlds
supermarket-aisle / checkout / residential-bike / store-backoffice / shift-board / middle-home /
restaurant / student-room / clothing-store / lowincome-household / affluent-household / money-flow /
depression-factory / depression-home / main-street / social-security-1935 / automatic-stabilizer /
town-map / local-multiplier / service-strip / government-budget / fiscal-chain / inequality-flow /
policy-design / safety-net / supermarket-return

## Original actions
各ナレーションに意味対応する固有動作を与える:
- 牛肉を棚へ戻す、洗剤を戻す、レジ金額が下がる
- 店長が売上表を月別に重ね、シフト表から一枠を削る
- 中間層家庭が焼肉予約をキャンセルし、店主が採用枠を閉じる
- 低所得家計と余裕ある家計へ同額を入れ、支出先の速度を比較
- 一万円がスーパー→給与→整備工場→塾→美容院へ姿を変える
- 1930年代の工場閉鎖→家計節約→商店街の閉店を連鎖
- 自動安定化装置で失業率上昇に対し給付が逆方向へ伸びる
- 地域マップ上で受給世帯から非受給企業へ売上が波及
- 政府予算の削減額と民間売上減を別レイヤーで表示
- 所得分布を変えたとき消費と貯蓄の流れを分岐
- 税・国債・給付の壁・行政コストを同時に比較
- 最後に二人の財布から同じ地域経済の床へ線をつなぐ

## QA
Bootstrap -> structural QA -> TypeScript -> semantic smoke -> background-only two-frame hash QA ->
VOICEVOX青山龍星 1.13 -> measured timing -> 8-way H.264 render -> concat -> narration+BGM ->
ffprobe 1920x1080/30fps/audio/duration -> contact sheet -> GitHub Release.
- minimum final runtime: 780 sec
- final duration vs measured narration: <=2.5 sec
- 全編を人間が目視確認したと偽らない。
