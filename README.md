# Knowledge Video Factory

知識系YouTube長尺動画を、台本から完成MP4まで自動生成する専用リポジトリです。

## Production flow

1. 台本を原文のまま小さなチャンクへ分割
2. ChatGPT / OpenAIで各チャンクに **表示用台本 `subtitle`** と **読み上げ専用台本 `speech`** を作る
3. OpenAIで意味ベースのシーン設計
4. 各シーン専用の画像・アニメーション設計を生成
5. VOICEVOXで `speech` のみをナレーション生成
6. 実際のWAV尺を使ってシーン開始・終了時刻を確定
7. 字幕は `subtitle` の原文表記から生成
8. 映像へ滑らかなパン・ズーム・Remotionアニメーションを付与
9. BGMと合成してH.264/AACのMP4を書き出し

## 最重要設計：字幕と読み上げを分離する

**字幕原文を機械的にひらがな化してVOICEVOXへ渡してはいけません。**

日本語では数字・助数詞・同形語の読みが文脈依存です。機械的なかな変換では、たとえば `5畳` を「ごたたみ」系、`32歳` を「さんじゅうにとし」系のように誤処理する可能性があります。

そのため各意味チャンクは必ず二つのテキストを持ちます。

- `subtitle`: 視聴者に表示する原文。漢字・英語・数字を通常表記のまま保持する。
- `speech`: ChatGPTが文脈を読んで校正したVOICEVOX専用文。通常の日本語漢字は残してよいが、誤読しやすい数字・助数詞・英字・固有名詞だけ明示的な読みへ置換する。

例：

- subtitle: `32歳。こちらは5畳ですね。`
- speech: `さんじゅうにさい。こちらは、ごじょうですね。`

- subtitle: `OECD平均は3.3だった。`
- speech: `オーイーシーディー平均は、さんてんさんだった。`

### 禁止事項

- `pykakasi` 等による全文の一括ひらがな化
- 音声生成直前に読み方を自動推測して上書きする処理
- `subtitle` をそのままVOICEVOXへ渡すこと

### QA

音声生成前に、`subtitle` と `speech` のチャンクIDが完全一致することを検証します。`speech` 内に未処理の半角数字・ASCII英字が残っている場合は本番生成を停止します。通常の日本語漢字は文脈保持のため許可します。

## 映像同期

画像やアニメーションは「台本全体の何％地点か」では割り当てません。

各シーンは必ず元台本の `chunk_id` を保持し、その `chunk_id` の本文内容から映像を設計します。VOICEVOX音声も同じ `chunk_id` の `speech` から生成するため、説明内容・映像・字幕・音声が同じ意味単位で同期します。

## GitHub Actions secret

画像生成と意味ベースのシーン設計に OpenAI API を使います。

Repository Settings → Secrets and variables → Actions → New repository secret で以下を登録してください。

- `OPENAI_API_KEY`

APIキーをコードやJSONへ直接書かないでください。

## Voice

各エピソードで指定したVOICEVOX話者・スタイルをGitHub Actions内のDockerから使用します。

公開動画ではVOICEVOXの利用条件に従い、概要欄等へ必要なクレジットを記載してください。

## Output

`episodes/<episode>/output/final.mp4`

GitHub Actions実行後はエピソードごとのArtifactまたはGitHub Releaseから取得できます。

## 共有素材（背景 / パーツ / 人物）

`shared/asset-library/README.md` に、意味一致でのみ既存素材を選択するレジストリ、Remotionへの組み込み、V69でのオプトイン、およびQA手順をまとめています。既存の音声・字幕・映像テンプレートとは独立した追加機能です。
