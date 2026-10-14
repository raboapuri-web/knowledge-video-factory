# V126 なぜ人間は「理想のタイプ」と違う人を好きになるのか？

考える夜 / 恋愛心理学×配偶者選択×予測不能性。

## 制作思想
- prologue + chapter1〜9 + epilogue の11独立レンダー単位。
- 47意味シーン。文章ごとには分割せず、一つの出来事・因果・比較・研究・比喩を一つの連続空間としてまとめる。
- 各意味シーン8 semantic states × reveal / settle / semantic accent = 24 micro beats / scene。設計上約1,128 visual beats。
- 47 motifすべて専用レイアウト、47 motion signatureすべて固有。
- 平均シーン尺を長めに保ち、その内部を2〜5秒ごとの意味変化で動かす。
- 同じ背景が意味上連続する場面では背景を固定し、人物、資料、会話、UI、グラフ、照明、関係線を変化させる。
- 居酒屋、近世の家族会議、心理学研究室、スピードデーティング、機械学習、学生寮、大学講義室、結婚市場、長期縦断研究、ファミレス、マッチングアプリ、職場の反実仮想、駅ホームなど、議論のレイヤーが変わるときだけ空間を変える。
- 台本の文学的な長文を保持し、VOICEVOX用に短文・単語列へ改稿しない。

## 字幕
- contentLayer / headingLayer / subtitleBacking / subtitleTextLayer を完全分離。
- 下170pxを恒久字幕セーフエリアとして予約。
- 字幕は最大2行、1行19文字以内。実測VOICEVOXタイミングで同期する。
- smoke render + pixel subtitle QA を通過しない章は本レンダーを開始しない。

## エラー抑制
build_data → structural QA → TypeScript typecheck + Vite build → 11章並列VOICEVOX実測 → measured timing merge → chapter rebuild → smoke render → pixel subtitle QA → full chapter render with retry → concat/BGM → ffprobe hard gate → anomaly scan → 42-frame contact sheet → release。

QAは47シーン・47ユニークmotif・47ユニークmotion・11章・24 micro beats・字幕最大2行・音声実測同期を機械検証する。
