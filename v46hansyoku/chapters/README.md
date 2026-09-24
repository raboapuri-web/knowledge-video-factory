# 章別制作データの格納規則

正式台本：`../考える夜_繁殖の権利_文学的改稿.txt`（原稿のSHAを各sceneの出典に記録し、一字一句変更しない）。

順序：`prologue` → `chapter1` → `chapter2` → `chapter3` → `chapter4` → `epilogue`。現時点の対象はプロローグのみ。後続章は前章の明示承認まで制作しない。

- **章別シーン設計の正式保存先**：`../scene-plans/{chapterId}.json`（今回作成したファイルは `../scene-plans/prologue.json`）。旧予定の `chapters/{chapterId}/scene-plan.json` は使わず、重複する原稿の発生を防ぐ。
- **章別の必要素材一覧**：`{chapterId}/required-assets.json`（次の素材洗い出し工程で作成）。
- **章別の素材登録状況**：`{chapterId}/material-status.json`（次の素材工程で作成）。
- **章別の進捗・承認**：`../production-status.json`、`../chapter-approvals.json` が正式記録。

シーンJSONは元の段落・文番号、行番号、UTF-16開始・終了オフセット、ナレーション原文、具体的な人物・位置・向き・動作、物体・背景・アングル、必要素材の候補、前後接続を含める。全原文を章内の各sceneに一回ずつ割当、元段落の空行を復元すると元の章本文に完全一致することを必須とする。

現在 `scene-plans/prologue.json` は原稿14段落を32シーンに分解済み。登録済素材は採用候補、`NEW_*` は新規制作候補であり、必要品目・不足品目としては未確定。必要素材の評価とユーザー登録を経てから章別プレビュー制作に移る。VOICEVOX実測音声の尺に合わせ字幕別レイヤーで同期。全章の承認前に全編を連結しない。
