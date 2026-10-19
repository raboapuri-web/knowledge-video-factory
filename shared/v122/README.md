# V129 日本は何教なのか？――「無宗教」という日本最大の宗教

考える夜 / 神道×仏教×宗教社会学×世俗化。

## 制作設計
- prologue + chapter1〜11 + epilogue の13独立レンダー単位。
- 79意味シーン。文章・句読点では切らず、一つの出来事・制度変化・比較・学術概念・比喩を単位に統合。
- 各シーン8 semantic states × reveal / settle / accent = 24 micro beats / scene。設計上約1,896 visual beats。
- 79 motif / 79 motion signatureをすべて固有化。
- 現代の初詣、チャペル結婚式、仏教葬儀、宗教統計、神仏習合、江戸村と寺請、明治の神仏分離、近代宗教概念の分類机、国家神道、現代の式場打合せ、家庭の仏壇、都市化と世俗化、元日夜の三宗教空間という13の画面文法を採用。
- 同一出来事内では背景固定。人物、行列、祈り、証文、宗教施設、行政分類、祭祀カード、家族、統計、時間軸、関係線を連続的に変化させる。
- 2〜5秒ごとに意味のある状態変化を発生させ、フェード連鎖、ズーム反復、同型カード連発を避ける。
- 外部画像に依存せず、Rect / Line / Circle / Txtのみの安全なMotion Canvasプリミティブで構成。前作の実行時エラー要因だった不安定な透明fill等は使用しない。

## 字幕
- contentLayer → headingLayer → subtitleBacking → subtitleTextLayer の固定順。
- 下170pxを恒久字幕セーフエリアとして予約。
- 最大2行、1行19文字以内。VOICEVOX実測タイミングへ同期。
- 本尺前に各章smoke render + pixel subtitle QA必須。

## エラー抑制
build_data → structural QA → TypeScript/Vite build → 13章VOICEVOX並列実測 → measured timing merge → chapter rebuild → smoke render → pixel subtitle QA → full render with retry → FFmpeg concat/BGM → ffprobe hard gate → black/freezedetect → 42-frame contact sheet → release。

## 完成基準
1920×1080 / 30fps / H.264 / AAC / 青山龍星 speaker 13 / speed 1.15 / 字幕必須 / BGMあり。
