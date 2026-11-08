# V150 制作仕様書

## 動画

- 番号: V150（考える夜ネタ帳 11行目）
- タイトル: なぜ親友より、たまに会う知人の方が人生を変えるのか？
- サムネコピー: よっ友のパラドックス
- 台本ドキュメント: https://docs.google.com/document/d/1E3JRZDKeBCDLJ_7aogIWkhS2KS1cyz4pVkWsiIHwT7c/edit
- 構成（E列）: https://chatgpt.com/s/t_6aef21ef44408191b33e15409e72ae55

## 内容の要点

- グラノヴェッター「弱い紐帯の強さ」（1973年）。転職の83.4%が、頻繁に会わない相手経由（16.7%／55.6%／27.8%）。
- 同類選好：親友は自分と似た世界を生きているため、新しい情報を持ってこない。
- バート「構造的空隙」：異なる集団をつなぐ位置の人が、新しい価値や情報にアクセスしやすい。
- 2022年 LinkedIn 大規模実験：対象2,000万人以上、5年間、約20億件の新規つながり、約60万件の転職移動を分析。
- 結論：親友を捨てるのではなく、知人との「ゆるいつながり」を意図的に保つことが人生の転機を運ぶ。

## 構成

- プロローグ「人生を変えたのは、親友ではなかった」：31文・7スライド
- 第1章「親友は、あなたと同じ世界を生きている」：51文・10スライド
- 第2章「人間関係には、見えない橋がある」：66文・11スライド
- 第3章「人生を変えるのは、努力だけではない」：21文・5スライド
- 第4章「親友を捨てて、知人を増やすべきなのか？」：91文・18スライド
- エピローグ「あなたの人生は、誰とつながっているかで変わる」：31文・7スライド
- 合計：291文・58スライド（表・グラフなし）

## 制作仕様

- 方式: Motion Canvas スライド方式（V149と同一ハーネス）
- 解像度: 1920×1080、30fps
- 色: 背景 #111114、紙 #EDE8DD、赤 #9D303B、青緑 #397A78、灰 #A8A5A0
- エフェクト: fade / slide-right / slide-left / stagger / zoom / pulse を章内で回す
- ナレーション: VOICEVOX 青山龍星（話者ID 13）、速度1.15
- 音声タイミング: 実測の音声長に合わせる。章先頭0.3秒リード＋文間0.3秒トレイル、エピローグ末尾2.0秒
- BGM: common/BGM/Amazon-river-ambience.mp3（音量0.035、あればミックス）

## ファイル

- 台本: shared/v150/content/narration-{prologue,chapter1,chapter2,chapter3,chapter4,epilogue}.txt
- スライド定義: shared/v150/content/slides.json
- スクリプト: shared/v150/scripts/compile.mjs、shared/v150/scripts/synth.mjs
- ワークフロー: .github/workflows/v150-weak-ties-slides.yml
- リリースタグ: v150-weak-ties-slides-<run_id>
- 最終ファイル名: v150-weak-ties-slides-final.mp4
- コンタクトシート: v150-contact-sheet.jpg

## サムネイル（5枚）

順番に ①イラスト ②ピクトグラム ③実写 ④フラットデザイン ⑤記号。

- weak-ties_illust.png
- weak-ties_pictogram.png
- weak-ties_real.png
- weak-ties_flat.png
- weak-ties_symbol.png

Googleドライブのフォルダに保存し、フォルダリンクをネタ帳F列に入力する。
