# 考える夜 v9｜字幕キュー同期の意味演出

## 対象とブランチ

- リポジトリ `raboapuri-web/knowledge-video-factory`
- ブランチ `kangaeru-yoru-v9-cue-sync-20261106`
- **mainには変更なし。YouTubeの投稿コードなし。**
- 元の71シーン・224字幕キュー・ナレーション原文・写真7場面／図解代替5場面を固定。
- 画像・ライセンス台帳はv7のArtifact Run #42170721259、絵コンテはRun #42168254310から継承。

## 4つの実装段階

| 段階 | ワークフロー | 適用 |
|---|---|---|
| 1 | `kangaeru-v9-preflight.yml` | OpenAI・VOICEVOXなしで10単体テスト＋全71シーンのコンタクトシート |
| 2 | `kangaeru-v9-cue-api.yml` | `approval/authorize.txt`を指定文字列でコミットした時だけ最大12回のGPT-5.6 Terraリクエスト |
| 3 | `kangaeru-v9-cue-preview.yml` | 全224キューの表示内容を実際に描画し、静止状態の19枚のシートを生成・切替数をQA |
| 4 | `kangaeru-v9-final.yml` | VOICEVOX 13の音声合成とモーラ近似、各キューの表示更新、1080p30最終MP4 |

## キューごとの絵コンテ形式

```json
{
  "scene_id": "s003",
  "cue_visuals": [
    {"cue_index":0,"kind":"keyword","text":"止める確率","element_index":-1},
    {"cue_index":1,"kind":"diagram_element","text":"飛ぶ","element_index":0},
    {"cue_index":2,"kind":"numeric","text":"13.4","element_index":-1},
    {"cue_index":3,"kind":"none","text":"","element_index":-1}
  ]
}
```

※上記はデータ形式の例であり、シーンs003の実際の生成内容を示すものではありません。実際の内容は`cue_storyboard.json`の値を優先。

- `keyword`: そのキュー文の実在する短い文字列、または元シーンの許可済みラベル。固定見出し枠へ。
- `numeric`: キューに含まれる数値、または元シーンに含まれる既存の数値のみ。固定数値枠にカウントアップ。
- `diagram_element`: 元シーンの存在する`labels/values`の`element_index`まで順に開示。
- `photo`: `photo_status=visually_verified`で、保存済み画像が存在するシーンだけ。
- `none`: 前のグラフィックを保持し、字幕のみ次のキューへ更新。

各キューで文字・図・写真を切り替えるが、**画面外周・見出し枠・字幕帯（720pのy=586以降）の座標は固定**。未指定モーションはv8の24テンプレートから元シーンに適したものを選ぶ。切り替え時の入場演出は最大0.85秒、シーン転換はシーンの最初だけ。

## 音声・同期タイミング

1. 全文ナレーションをそのまま `POST /audio_query?speaker=13` に送る。
2. `speedScale=1.06`、`intonationScale=1.02`、前後無音を設定し、同じqueryを `POST /synthesis?speaker=13` に送る。
3. `accent_phrases[].moras[]`の `consonant_length + vowel_length`、および`pause_mora`を蓄積する。
4. **字幕の開始文字位置を、原稿文字数比によってモーラのインデックスへ近似変換**し、モーラの累積所要秒数を取得。
5. 合成WAVの実尺に合わせてタイミングを伸縮し、最終キューにシーン末尾の0.48秒無音を含める。
6. 単調増加でない場合は最小間隔補正または文字比率による保守的フォールバックを明示・記録する。

**重要**：漢字とカナの読みが一対一に対応しないため、文字位置→モーラは近似であり、forced alignment等の精密な音声と単語の一致ではない。出力`voicevox_mora_timeline.json`と`cue_timeline.json`に元のモーラ情報と近似キュー時刻、フォールバック理由を保存する。

## 品質条件と結果

- 71シーン、224キュー、原文ハッシュ不変。
- キューごとに一つの指示があり、無根拠なキーワード・数値、未検証写真、存在しない図解要素は拒否して`none`で安全に保持。
- 動画QAで表示切替回数がv8の71回を超えることを必須条件にする。
- 動画スペック1920×1080・30fps・H.264/AAC・VOICEVOX 青山龍星（ノーマルID13）。
- キューの単調増加、隣接境界・シーン終端、映像と音声尺の差を検査。
- 人間による視聴品質・単語レベルの誤差評価は別途必要。

## OpenAI API

- モデル：`gpt-5.6-terra`／Responses API／Structured Outputs／`store=false`。
- 71シーンを最大6シーンずつ、12回の入力として処理。
- Repository Secret `OPENAI_API_KEY`のみ使用し、値はログ・コード・コミットに保存しない。
- `cue_storyboard.json`、`api_usage_v9.json`に結果・トークン・料金見積もりを保存。
- 動画再レンダリングではAPIキーを使わず、有料呼び出しを繰り返さない。
