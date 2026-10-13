# V125 なぜ「問題大臣」をすぐ辞めさせると国民が損をするのか？

考える夜 / 簗農水相問題×閣僚交代×政策継続性。

2026年10月の簗和生農林水産大臣をめぐる問題を時事フックにしつつ、動画の主題は特定政治家の擁護・辞任要求ではなく、「問題大臣を残すコスト」と「大臣を交代させるコスト」を歴史・政治学・行政組織論から比較することに置く。

## 映像設計
- 77意味シーン / prologue + chapter1〜9 + epilogue の11独立レンダー単位。
- 各シーン8 semantic states × reveal / settle / semantic accent の3段階 = 24 micro beats / scene。設計上約1,848 visual beats。
- 77 motifすべて専用レイアウト、77 motion signatureすべて固有。
- 田んぼの水害現場、夜の農水省、霞が関の朝、新任大臣の初日、戦後永田町、吉田・岸期の人事慣行、2007年農水省、比較政治学データ、政策churn、国会時間、信用資本、二本のコスト曲線など、章ごとに背景世界と表現形式を切り替える。
- 「人物やカードが順番に出るだけ」の共通演出を避け、情景、空間変化、履歴タイムライン、ネットワーク、断面、比喩、曲線図を交互に使う。
- 台本の文学的な長文を保持し、VOICEVOX用に短文・単語列へ書き換えない。
- 下170pxは字幕専用。本文オブジェクトと字幕を別レイヤーに固定。
- 1920×1080 / 30fps / VOICEVOX 青山龍星 speaker 13 / speed 1.15。

## エラー抑制
build_data → structural QA → TypeScript typecheck + Vite build → 11章並列VOICEVOX実測 → measured timing merge → chapter rebuild → smoke render → pixel subtitle QA → full chapter render with retry → concat/BGM → ffprobe hard gate → anomaly scan → contact sheet → release。

QAは77シーン・77ユニークmotif・77ユニークmotion・11章・24 micro beats・字幕最大2行・文字数・音声実測同期を検証する。
