# V121 なぜ貧しい家庭の子どもほど「努力しろ」と言われるのか？

「考える夜」本番用。V120の高密度Motion Canvas制作と、直近のMasculinity制作で安定した独立typecheck・smoke diagnostics・chapter reuse思想を統合する。

## 制作仕様
- 40意味シーン / 8独立レンダー単位 / 1920×1080 / 30fps。
- VOICEVOX 青山龍星ノーマル speedScale 1.15。
- 長文ナレーションを維持し、映像のみ細分化。
- 1意味シーンにつき **8状態変化**、設計上約320 semantic visual beats。
- 同じ二人の左右比較だけを繰り返さない。家庭、教室、歴史、進路、時間割、PISA、雪玉、歯車、自転車、就活、競争コースへ世界を変える。
- 各意味シーンに固有motif・world family・motion pattern・environment seedを与える。
- 背景の単純なパン・ズームだけを別カット扱いにしない。
- 下170pxは字幕専用安全領域。
- Typecheck preflight → build_data/QA → VOICEVOX measured timing → chapter Vite build → smoke render → pixel-level smoke QA → full chapter render with retry → concat/BGM → ffprobe → black/freezedetect → contact sheet → Release。
- 章別MP4を保存し、修正時は完成章を再利用する。

## 映像の中心モチーフ
同じ午後9時、見えない装備、身分ピラミッドからメリトクラシー階段、文化資本の通貨、家庭会話として流れる進路情報、努力時間を奪う時間割、PISAの二つの分布、教育格差の雪玉、努力→成果の変換ギア、荷物を積んだ自転車、成功者の透明な足場、同じスタートラインだが違うコース、答案用紙の背後に隠れた条件。
