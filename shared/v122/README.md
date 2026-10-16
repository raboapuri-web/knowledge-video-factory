# V127 過去最高の指導者・李世民

考える夜 / 唐太宗×貞観の治×統治論。

## 制作設計
- prologue + chapter1〜9 + epilogue の11独立レンダー単位。
- 69意味シーン。文章ごとの切断ではなく、出来事・因果・比較・研究・比喩を単位に統合。
- 各シーン8 semantic states × reveal / settle / accent = 24 micro beats / scene。設計上約1,656 visual beats。
- 69 motif / 69 motion signatureをすべて固有化。
- 玄武門、隋末の崩壊、制度アーカイブ、朝議、情報ピラミッド、人材配置、草原帝国、高句麗遠征、史官室、統治論という章別の画面文法を採用。
- 同じ場所の出来事は背景固定。人物、馬、門、旗、巻物、報告経路、情報の色、地図、関係線、制度文書、鏡、時間軸を連続的に変化させる。
- 2〜5秒ごとに意味のある状態変化を発生させ、単なるフェード連鎖・カード増殖・パン反復を避ける。
- 外部画像に依存せず、Motion Canvasの安全なRect / Line / Circle / Txtのみで本編を構成。前作で問題化した透明fillなど実行時不安定要素は使用しない。

## 字幕
- contentLayer → headingLayer → subtitleBacking → subtitleTextLayer の固定順。
- 下170pxを字幕専用セーフエリアとして予約。
- 字幕は最大2行・1行19文字以内。VOICEVOX実測時間へ同期。
- 本レンダー前に各章smoke render + pixel subtitle QAを必須化。

## エラー抑制
build_data → structural QA → TypeScript/Vite build → 11章VOICEVOX並列実測 → measured timing merge → chapter rebuild → smoke render → pixel subtitle QA → full render with retry → FFmpeg concat/BGM → ffprobe hard gate → black/freezedetect → contact sheet → release。

## 完成基準
1920×1080 / 30fps / H.264 / AAC / 青山龍星 speaker 13 / speed 1.15 / 字幕必須 / BGMあり。
