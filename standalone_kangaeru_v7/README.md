# 考える夜 v7-1 / v7-2 — デザイン・意味設計の再構築

対象ブランチ: `kangaeru-yoru-v7-design-20261106`。mainには未反映。**YouTubeへの公開機能なし**。

## v7-1: 8013デザイン文法・字幕帯・図解

- `brand.py` は、8013.png の金色細線・円形枠・比較図・棒グラフ・段階的説明という**デザイン文法を元に、データ駆動でSVGを組み立てる**。8013のピクセルを貼り付けるものではない。
- 現時点の編集レパートリー: `hero_question`, `split_choice`, `data_bars`, `causal_flow`, `single_symbol`。無関係な天秤・目の固定ペアを廃止。
- ステージ1の画像は `fixtures/gk_design_samples.json` に含まれる原稿から抜き出した4場面の**デザイン動作証明**。全文動画ではない。
- 描画サイズ 1280×720。字幕専用帯 y=586〜720、中央揃え、原則1行20字以内・最大2行。
- 画面の主見出し18字以内。注釈1項目12字以内、最大3件（場面により2件）、本文の丸写しは禁止。
- 数字は原稿由来に限定し、AIが創作した実験値を表示しない。
- v7-1の検査はSVG構文、文字上限、字幕位置、複数デザイン、元原稿との対応。
- 注意: 8011/8012/8014原画像の制作素材としての正式統合は**未実装**。8013は図版デザイン基準として参照。元ファイルを使っているかのように説明しない。

## v7-2: 原稿と映像の分離

- `planner.py` は全文台本を変更せず、`narration_text` と `subtitle_cues` を計算する。字幕タイムスタンプは音声生成まで未確定。
- AIにはシーンIDと原稿を渡し、`visual_intent`, `evidence_anchor`, `composition`, `display_text`, `primary_visual`, `photo_subject`, `icon_spec` のみ選ばせる。
- `evidence_anchor` はそのシーンの台本内に**実在する部分文字列**でなければならない。
- API出力は厳格なJSON Schema。単一レイアウト35%超、3連続レイアウト、架空の数値、無根拠の画像、意味説明のないアイコンは品質検査で拒否する（全文バッチ間の横断QAは後続段階）。
- AIによる**本当の意味選択**の成功は、API実行後の検査と人間のGate 2を経るまで未確定。

## 新規アイコン生成（画像生成APIは使わない）

- **方式**: GPT-5.6 Terraが、台本の意味に対応したアイコンの形を `paths: [[[x,y],...],...]` と `circles: [[x,y,r],...]` のJSONとして返す。コードがゴールド細線・黒背景に合う512×512pxのSVGへ変換。
- これによりプロンプト注入・外部SVGスクリプト・外部画像URLを拒否できる（LLMの生SVGは許可しない）。線幅・端部・金色は固定し8015の原画と調和させる。
- 出力先: `output/ai_gk_4/icons/generated/<scene_id>.svg`、`icon_registry.json` に生成元、使う場面、意味説明、ファイルを記録。
- 検査: 100×100正規化座標が枠内、複雑さ上限、意味説明、同一形の再使用は2場面以下、実際のSVGが描画できること、Gate 2での目視。
- 生成失敗時: **対応する意味を持つ場合だけ**登録済み8015原画24種へフォールバックする。対応しない場合は使用を停止し、無関係な目や天秤を置かない。オリジナル24種の原画は `standalone_kangaeru_v4/brand/8015.png`。
- フォールバックも台帳で元画像由来と明示。自動生成したと偽らない。

## 正確なAPIキー設定

ユーザーがGitHub UIで手動設定する。**チャット、コミット、スクリプト引数、GitHubログにキーの値を書かない。**

1. リポジトリ `raboapuri-web/knowledge-video-factory` を開く。
2. `Settings → Secrets and variables → Actions → Secrets`。
3. `New repository secret` をクリック。
4. **Name: `OPENAI_API_KEY`**。Secret欄へAPIキーを貼り、`Add secret`。プレーンな文字列、JSON・引用符・先頭の`Bearer `不要。
5. Museのセキュア保管庫はGitHubのActions Secretとは別。自動転送はされないため、Actionsで実行する場合はGitHub側へ登録する。

### どこがSecretを使うか

- GitHub Actions: `.github/workflows/kangaeru-v7-ai-manual.yml` の **`BILLABLE visual planning`** ステップ。環境変数 `OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}` として注入。
- Python: `standalone_kangaeru_v7/planner.py::call_model()` が環境変数の存在と`KANGAERU_V7_API_APPROVED=YES`を検査した後でのみ `OpenAI(api_key=...)` を生成する。
- API: `POST /v1/responses`、モデル **`gpt-5.6-terra`**、Structured Outputsの `json_schema`。画像生成APIを別途呼び出さない。
- 使用料はテキストトークンに基づく**従量課金**。GitHub Actions、Pythonソースでは設定したSecretをログに出さないがAPI使用料は発生し得る。
- APIワークフローは自動では起動しない。GitHub仕様上、新規branchだけにある `workflow_dispatch` はUIでRun workflowボタンが表示されない場合がある。mainには追加しない。
- **branch-only手動承認の確実な方法**: Secret登録を終え、API利用を明示的に承認する段階で、GitHub UIの `kangaeru-yoru-v7-design-20261106` ブランチへ `standalone_kangaeru_v7/approval/authorize.txt` を新規作成する。本文を一行だけ `I_APPROVE_OPENAI_4_SCENES` として、コミットメッセージを**正確に `AUTHORIZE_V7_API_4_SCENES`** とする。ファイルのpushによって、最大4シーンのAPIジョブだけが起動する。**今回の作業ではその承認ファイルは作らない**。
- 既存のdefaultブランチに同名のワークフローがある等の条件でUIの `workflow_dispatch` が使える場合でも、`approve_api_use=true` の明示承認が必要。既定false。
- キー未設定ならAPI呼び出しより前の段階で停止する。

ローカル実行でも環境変数 `OPENAI_API_KEY` をプロセスへ渡す。GitHubへアップロードする`.env`を作成しない。ローカルではOSのシークレット保管庫などから安全に注入する。

### 無課金・無認証でできる検証

- `.github/workflows/kangaeru-v7-stage1.yml`：四場面の静止画・デザイン・字幕検査（API無し）。
- `.github/workflows/kangaeru-v7-stage2.yml`：モデル接続の構文・自動シーン入力・JSONマージ・SVG検査（API無し）。
- `python standalone_kangaeru_v7/planner.py --source standalone_kangaeru_v6/gk_source.json --out standalone_kangaeru_v7/output/stage2/plan.json --max-scenes 4`：入力準備のみ。

## 現段階の制約

- AIの絵コンテ意味精度、生成アイコンの実際の出来、画像検索の意味適合性はまだAPI実行・Gate 2を通していない。
- 全編のMP4出力や写真採用はv7-3以降。v7-1は画像プロトタイプ、v7-2はAPI接続・設計QA段階。
- テストで生成した`thumbnail`等は最終公開用と見なさない。
