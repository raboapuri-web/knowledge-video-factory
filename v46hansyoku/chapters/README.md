# 章別制作データの格納規則

順序: `prologue` → `chapter1` → `chapter2` → `chapter3` → `chapter4` → `epilogue`。

各章のシーン設計を始める時点で、このフォルダー内に `{chapterId}/scene-plan.json`、`{chapterId}/required-assets.json`、`{chapterId}/material-status.json` を作成する。これらは**現時点では未作成**。不足素材一覧は `required-assets.json` に既存素材の採用判定、欠品、権利・登録状態とともに記録する。

シーンJSONは原稿の該当章の全段落・文字範囲／原文の参照、scene ID、visualIntent、場面・背景・人物・小物、アニメーション分類 Existing/New/One-off、候補素材ID、レビュー状態を持たせる。原稿は章別ファイルへの書き写しを正式版として扱わず、ルートにある原稿を参照し、原稿SHAを照合する。音声と字幕は原稿完全一致を検査し、VOICEVOX音声の実測尺に合わせる。

各章のユーザー承認状況は `../chapter-approvals.json`、進捗は `../production-status.json` を正式記録として管理し、承認済み音声・字幕・動画・同期タイミングの版やArtifact IDを登録して固定する。承認前に次章へ進まない。
