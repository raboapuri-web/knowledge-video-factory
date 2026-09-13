# Shared Production Rules

このディレクトリは、知識系YouTube動画の改善を動画単位で終わらせず、次動画へ継承するための共通ルール置き場です。

## 1. 読み上げ

- 人間向け字幕は `beat.narration` のまま保持する。
- VOICEVOXへ渡す直前に `shared/voice/apply-pronunciation.mjs` を通す。
- 読み間違いFBは `voice-pronunciation.json` に追加する。
- 個別動画で同じ語を `speech` 手修正するだけで終わらせない。
- 新規動画の `scripts/generate-voicevox.mjs` は、個別実装ではなく `shared/voice/generate-voicevox.mjs` を呼ぶ薄いwrapperにする。
- 変換結果は `public/audio/pronunciation-report.json` に残す。
- 辞書追加後は `node shared/voice/test-pronunciation.mjs` を実行し、正常系と複合語の例外系を固定する。

## 2. 映像テンプレート

- 文字・数値・リスト・色・強調対象を入れ替えれば再利用できるsceneは共有テンプレートへ昇格する。
- 実装は `shared/remotion-templates/index.tsx` に置く。
- 登録情報は `visual-template-registry.json` に追加する。
- 新規台本では、再利用sceneは `template_id` + `params` で呼び出す。
- 登録済みテンプレートを個別動画の `scenes.tsx` へコピーし直さない。
- 一回限りの固有sceneは `visual` のcustom sceneとして残してよい。

例:

```json
{
  "id": "b12",
  "template_id": "decimal_ranking",
  "params": {
    "headline": "全員90点なら、小数点以下が順位を決める",
    "scores": [90.1, 90.4, 90.7, 91.2]
  },
  "narration": "..."
}
```

Remotion側:

```tsx
<SharedTemplateScene templateId={beat.template_id} params={beat.params} />
```

## 3. FBの登録

新しい指摘は `feedback-log.json` に必ず残し、次のいずれかへ昇格する。

- 読み上げミス -> `voice-pronunciation.json`
- 再利用できる見栄え -> `visual-template-registry.json` + shared component
- 再発してはいけない構造問題 -> `qa-rules.json` + validator

## 4. 新規動画のproduction-manifest.json

V34以降の新規動画には以下を置く。

```json
{
  "productionSystemVersion": 1,
  "visualRegistryVersion": 1,
  "voiceDictionaryVersion": 1,
  "sharedVoiceGenerator": true,
  "sceneMode": "hybrid"
}
```

## 5. QA

新規動画は最低限以下を実行する。

```bash
node ../shared/voice/test-pronunciation.mjs
node ../shared/qa/validate-video.mjs . pre
node scripts/generate-voicevox.mjs
node ../shared/qa/validate-video.mjs . post
```

長尺動画ではsemantic sceneの多様性を保ち、fallback/default sceneを禁止する。VOICEVOX timingは必ず実測し、Release前にcontact sheetを生成する。

## 6. スプレッドシート

人間向けの管理台帳は `knowledge_video_production_rules.xlsx`。スプレッドシートは編集・レビュー用、GitHubのJSON/TSXが実行時のsource of truthです。スプレッドシートに追加したFBは、動画制作時に対応するJSON/テンプレ/QAへ反映してからproductionを回します。
