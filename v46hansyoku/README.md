# v46hansyoku — 制作準備記録

- 動画ID: `v46`。このプロジェクトの固有識別子は `v46hansyoku`。
- 表示タイトル: なぜ人類は自ら「繁殖の権利」を放棄するのか？【生態学×進化学×社会構造】
- 正式原稿: [考える夜_繁殖の権利_文学的改稿.txt](./考える夜_繁殖の権利_文学的改稿.txt)。このファイルが唯一のナレーション原稿。原稿の表題内の学問表記は表示タイトルと異なるが、原稿を改変しない。
- 原稿blob SHA: `0ee1e5978ca7567f853960801b6404616b5b149d`。以後の設計・読み上げ・字幕時にこの版と照合し、変更があれば処理を停止して差分を確認する。
- 進行順: プロローグ → 第1章 → 第2章 → 第3章 → 第4章 → エピローグ。最初の作業対象はプロローグ。第1章へ進むにはプロローグの明示承認が必要。
- 素材の検索元: [共有ライブラリ](../shared/asset-library/)、[背景とパーツの登録簿](../shared/asset-library/catalog.json)、[人物登録簿](../shared/asset-library/人物テンプレート/catalog.json)。動き・図解は [テンプレート登録簿](../shared/production-rules/visual-template-registry.json) を使用。
- 技術方針: 既存の Remotion / React / TypeScript 2D＋VOICEVOX実測音声＋字幕別レイヤー＋GitHub Actions/FFmpeg。専用のv46制作・レンダリングコードは未実装。
- 管理データ: [project.json](./project.json)、[production-status.json](./production-status.json)、[chapter-approvals.json](./chapter-approvals.json)、[material-status.json](./material-status.json)、[章別データ格納規則](./chapters/README.md)。

## 運用ゲート

今回のコミットは制作準備専用で、シーン設計・新規素材採用・音声合成・字幕生成・レンダリングは実施しない。章ごとにシーン設計、必要／不足素材の提示、ユーザーの素材作成・登録、章別音声／字幕付きプレビュー、ユーザー承認の順に進める。承認済み章の動画・音声・字幕・タイミングは固定し、未承認のまま次章に進めない。原稿の追加・省略・要約・順番変更を禁止する。発音用テキストは読み方のみ調整し、語句・意味・読み上げ内容を変えない。

既存の別案件にも `v46` の番号を使ったワークフローがあるため、将来の実装は `v46hansyoku` の固有名で区別する。既存ワークフローを流用して誤レンダリングしない。
