# V120 「底辺職」という言葉は経済学的におかしいのか？

「考える夜」本番用。最新成功作 V119 Evolution のMotion Canvas方式を継承し、映像密度を約2倍へ引き上げる。

## 制作仕様
- 40意味シーン / 8独立章 / 1920×1080 / 30fps。
- VOICEVOX 青山龍星ノーマル speedScale 1.15。
- 長文ナレーションを維持し、映像だけを細かくする。
- 1意味シーンは単一の世界空間を保ちながら **8状態変化** を持つ。
- 各シーンに固有motif、固有environment seed、固有motion patternを割り当てる。
- 隣接シーンで同じworld familyとmotion patternの組み合わせを禁止。
- 背景は人物や前景とは別に常時微動し、ただのパン・ズームを別カット扱いにしない。
- 下170pxは字幕専用。前景・背景・グラフは侵入禁止。
- Typecheck preflight → build_data/QA → 8章並列VOICEVOX → measured timing → chapter smoke QA → chapter full render → final concat/BGM/ffprobe/black-freeze scan/contact sheet。
- 章別MP4をReleaseへ保存し、修正時は完成章を再利用する。

## 映像密度
旧方式の「意味シーン内4段階」ではなく、今回は8段階。
例: 清掃員の夜勤なら、都市俯瞰 → 収集車進入 → 袋回収 → 時計 → 物流センター → 介護夜勤 → 駅清掃 → 朝の通勤者、まで同一ナレーション内で連続変化させる。

## 重要
「底辺職」を肯定・否定する道徳動画ではなく、賃金、参入障壁、交渉力、職業威信、社会的必要性を分離して見せる。
