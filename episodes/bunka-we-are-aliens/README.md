# 文化的暴飲暴食｜『我々は宇宙人』Motion Canvas 制作パッケージ

## ステータス

**これは制作ソース一式です。完成動画ではありません。** このセッションは `@motion-canvas` と VOICEVOX が未インストールで、外部 npm / Docker へ接続できなかったため、完パケの生成はまだ完了していません。`qa/preflight-report.json` の静的検査は通っていますが、実映像のスモークQA・最終QAには未到達です。

## 仕様と実装

- 最新確定台本を7つの `.txt` に章別分割し、全文を含める（ユーザー編集後の `きょうたろう` 表記も反映）。
- 7つの独立して再生成可能な章、章あたり6つの連続意味空間（計42区間）。文章ごとにカットを切らず、Motion Canvasノードの位置、明暗、関係性を時間経過に合わせて変化させる。
- 主要モチーフ: 放課後の道、平成の記憶の品々、ロトスコープの身体表現を解説するオリジナル図、孤独の構図、客観的相関物、夏至・冬至、歴史の終わりの錯覚、道路の分岐。
- 監督や映画の公式カット、既存アニメーションは無断使用しない。すべてMotion Canvas独自描画。
- `contentLayer` 内だけにすべての映像を置き、最後に `subtitleLayer` を作成。1920×1080・30fps、字幕背景170px・opacity .90、字幕は最大2行。
- 音声: VOICEVOX 青山龍星／ノーマル／speedScale 1.15。`voicevox.mjs`で実測時間にタイムラインを同期。
- SRTは各音声ビートの長さを読みやすさに応じた文字数比で分配する簡易アライメント。厳密な音素タイミングを保証するものではない。
- `qa/preflight-report.json` に現在の見積もり：約30.9分。**実尺は音声生成後に確定する**。

## 自動実行

Ubuntu 24.04、Node.js 22、FFmpeg、Docker、VOICEVOX Engineとインターネット接続が必要。

```bash
npm ci  # lockfile が未付属の場合は npm install --no-audit --no-fund
npm run prepare
# VOICEVOX Engine を localhost:50021 に起動する
npm run voice
npm run build
node scripts/smoke.mjs
npm run render
npm run package
node scripts/music.mjs
npm run qa
python scripts/contact_sheet.py
```

### チャプター単独再生成

```bash
CHAPTERS=3 npm run voice
CHAPTERS=3 node scripts/smoke.mjs
CHAPTERS=3 npm run render
```

出力: `output/aliens-chapter-3.mp4`。全章が揃った状態で `npm run package` を行うとH.264 stream copyで連結。最終結合後、著作権フリーのシンプルなプログラム生成ドローンBGMをAACに追加する。

## QA

`npm run preflight` の代わりに `node scripts/preflight.mjs` で文字欠落・字幕の行数・意味区間カバレッジを検証。

`node scripts/smoke.mjs` は各章の冒頭＋重要中盤を1.4秒ずつ小規模レンダリングし、エラーなら本番へ進まない。`npm run qa` は全章の実ファイル、H.264/1080p/30fps、黒画面、フリーズを検査。字幕z-orderはコード構造上固定しているが、字幕と重要オブジェクトの視覚的な重なりはスモークのフレームチェックも必要。

## 権利と出典

- 作品情報・監督発言は台本内の元の情報をそのまま収録。制作前の最終ファクトチェックは別途必要。
- 研究カードは Quoidbach, Gilbert & Wilson (2013), *The End of History Illusion*, *Science* に対応。模式図は**実際の数量比較ではない**と明記。
- T.S. Eliot (1919), *Hamlet and His Problems* の「客観的相関物」は作品への独立した批評的応用として使う。
- 『デオキシス』はナレーションのみで触れ、ポケモンの絵やロゴを無断で再現しない。
