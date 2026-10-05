# V113 Production Spec

Video ID: V113-long-tenure-market-value
Title: なぜ転職しない社員ほど、市場価値が下がるのか？【人的資本論×内部労働市場×シグナリング×スキル陳腐化】

## Narrative / scene rules
- 6章、長文ナレーションを維持し、短文連発にしない。
- 1つの自然なナレーション文を1 sceneの基本単位とする。
- 120 scenes以上。文章を映像都合で不自然な短い語句へ分解しない。
- 全sceneに固有 action / actionId / sceneKey / visual を持たせる。
- 隣接sceneで family + primary + verb + shotKind が完全一致したらbuild failure。
- 同一environmentの非連続再登場は禁止。
- environmentが同じ連続sceneでは背景を固定し、人物動作・カード・資料・グラフ・UI・前景の追加削除で意味を変える。
- 背景の単なるパン・ズームだけを「別カット」と数えない。
- 主人公は43歳男性で統一し、プロローグからエピローグまで服装・顔・体格を維持。
- 1970年代の新卒、現代の新人、転職エージェントは主人公と視覚的に区別する。

## Visual worlds
office-night / org-restructure / career-site / showa-factory / rotation-board / training-floor /
human-capital / portable-skills / company-dialect / approval-maze / skill-weights / card-transfer /
home-interview / hiring-desk / signal-board / market-scan / system-training / cloud-transition /
ai-crm / value-lines / cafe-career / outside-option / home-desk

## Original action policy
各ナレーションに、内容と直接対応する固有動作を割り当てる。例:
- 組織改編通知を開く
- 職務経歴書の入力欄で指が止まる
- 稟議ルートを新人へ指でたどる
- skill cardsを別会社へ移し、無効なカードだけ暗転
- 面談質問が一つずつ画面へ追加
- 会社ロゴ・役職・人脈を能力の束から分離
- 旧システムの画面を新CRMへ置換
- 社内価値と持ち運び可能価値の二本線を別速度で伸ばす
- 職務経歴書の社内用語を外部市場向けの成果表現へ書き換える

## Pipeline / QA
Bootstrap -> structural QA -> TypeScript -> semantic smoke preview -> 6-way VOICEVOX -> measured timing -> 16-way render -> concat -> narration+BGM -> ffprobe -> contact sheet -> release.
- VOICEVOX 青山龍星、speed 1.13。
- 1920x1080 / 30fps / H.264 / AAC。
- 音声実測尺と最終MP4差 2.5秒以内。
- final minimum 840 sec。
- 全編を人間が目視したと偽らない。
