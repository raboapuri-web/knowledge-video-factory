# Shared Production Rules

このディレクトリは、知識系YouTube動画の改善を動画単位で終わらせず、次動画へ継承するための共通ルール置き場です。

## Source of truth / Human ledger

- GitHubのJSON/TSX = 動画生成時のruntime source of truth。
- `knowledge_video_production_rules.xlsx` = 人間がレビュー・追記する管理台帳。
- 両者は `stable_id` と `version` を `sync-manifest.json` / `Sync_Control` で一致させる。
- 既知の差分がある状態では新規productionを開始しない。
- Google Drive接続後はDrive上の台帳IDを `sync-manifest.json` に固定し、同じファイルを継続更新する。

## 1. 読み上げ

- 人間向け字幕は `beat.narration` のまま保持する。
- VOICEVOXへ渡す直前に `shared/voice/apply-pronunciation.mjs` を通す。
- 読み間違いFBは `voice-pronunciation.json` に追加する。
- 個別動画で同じ語を `speech` 手修正するだけで終わらせない。
- 新規動画の `scripts/generate-voicevox.mjs` は `shared/voice/generate-voicevox.mjs` を呼ぶ薄いwrapperにする。
- 変換結果は `public/audio/pronunciation-report.json` に残す。
- 辞書追加後は `node shared/voice/test-pronunciation.mjs` を実行し、複合語の例外も回帰テストする。

## 2. 映像テンプレート

- 文字・数値・リスト・色・強調対象を入れ替えれば再利用できるsceneは共有テンプレートへ昇格する。
- 実装は `shared/remotion-templates/index.tsx`、登録情報は `visual-template-registry.json` に置く。
- 新規台本では、再利用sceneは `template_id` + `params` で呼び出す。
- 登録済みテンプレートを個別動画へコピーし直さない。
- 一回限りの固有sceneは `One-off` として残してよい。無理にテンプレ化しない。

## 3. 動画作成前レビュー（必須）

Production System v2以降は、実装・レンダー前に `preproduction-plan.json` を作る。
人間向けには同じ内容をスプレッドシート `Preproduction_Plan` で確認する。

各sceneは必ず以下のどれかに分類する。

- `Existing`: 登録済み共有テンプレートを使用。
- `New`: 今回新しく作る。再利用可能ならレンダー前に登録候補IDを付ける。
- `One-off`: テーマ固有の一回限りのscene。

制作前に必ず提示・確認するもの:

1. シーン割一覧
2. 既存テンプレート使用一覧
3. 新規テンプレート候補一覧
4. One-off一覧
5. テンプレート使用率・連続使用・多様性の指標
6. 警告

## 4. 同一テンプレート偏重を禁止

`shared/qa/validate-preproduction.mjs` が以下を検証する。

- 同一Existing templateは全sceneの20%以下。
- 同じtemplateを3scene以上連続で使わない（最大2連続）。
- 長尺（40scene以上）はunique scene key 30以上。
- Existingはregistryに存在するactive templateのみ。
- 全sceneを Existing / New / One-off に分類。
- reusableなNewは `proposedTemplateId` を持つ。
- 新規再利用テンプレート候補は1本2〜5件を目標（不足・過多はwarning）。

## 5. FBの登録

新しい指摘は `feedback-log.json` とスプレッドシート `Feedback_Log` に残し、次のいずれかへ昇格する。

- 読み上げミス -> `voice-pronunciation.json`
- 再利用できる見栄え -> `visual-template-registry.json` + shared component
- 再発してはいけない構造問題 -> `qa-rules.json` + validator

## 6. 新規動画のproduction-manifest.json

V34以降の新規動画は `shared/scaffold/production-manifest.json` をコピーして使う。現在はProduction System v2。

```json
{
  "productionSystemVersion": 2,
  "visualRegistryVersion": 1,
  "voiceDictionaryVersion": 1,
  "qaRulesVersion": 2,
  "preproductionPolicyVersion": 1,
  "syncManifestVersion": 2,
  "sharedVoiceGenerator": true,
  "sceneMode": "hybrid",
  "requiresPreproductionPlan": true
}
```

## 7. QAフロー

```bash
node ../shared/voice/test-pronunciation.mjs
node ../shared/qa/validate-video.mjs . pre
node scripts/generate-voicevox.mjs
node ../shared/qa/validate-video.mjs . post
```

`validate-video ... pre` から `validate-preproduction.mjs` が自動実行される。
VOICEVOX timingは必ず実測し、Release前にcontact sheetを生成する。

## 8. スプレッドシート運用

管理台帳には以下を持つ。

- `Visual_Templates`: 人間が確認するテンプレート一覧
- `Voice_Dictionary`: 読み上げFB辞書
- `Feedback_Log`: 改善履歴
- `QA_Rules`: 先祖返り防止ルール
- `Preproduction_Plan`: 動画作成前のシーン割・新規/既存テンプレートレビュー
- `Sync_Control`: GitHubとのstable_id/version照合

スプレッドシートだけ、またはGitHubだけを更新して終わらせない。変更時は両方を同一versionへ更新してから次の動画を作る。
