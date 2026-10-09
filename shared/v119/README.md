# V119 なぜ生物は「生き残ること」を諦めるのか？

「考える夜」専用。**42意味シーン、8独立章、Motion Canvas 1920×1080/30fps、VOICEVOX 青山龍星ノーマル speedScale 1.15**。

正式台本の流れはプロローグ（ナナフシ）→母体食いするクモ→自爆シロアリ→寄生バチ→コノハミドリガイ→チョウチンアンコウ→進化・老化と幸福→エピローグ。原稿は意味単位への映像用再編集稿。各シーンは七つの状態変化を含み、42個の独立シーンにすべてナレーションを対応させる。

ナナフシの卵の消化管通過は観察された事実である一方、鳥による自然条件下の分散は遺伝学的研究が支持する仮説であり、「ナナフシが自ら食べられようとする」とは断定しない。

## 運用

- GitHub Actions: `.github/workflows/v119-motion-canvas-evolution.yml`。本ブランチをmainへ反映すると自動起動。
- まず `scripts/build_data.py` が42意味シーン・字幕分割・8個のMotion Canvas projectを生成。
- 8章並列VOICEVOXで全字幕の実測尺を取得し、全章独立に章別レンダリング。
- 章ごとにスモークQA、完走後にFFmpeg stream copy結合、BGM、FFprobe検証と25フレームのコンタクトシート。
- 単章のみ修正したときは workflow_dispatch の `only_chapter` に章名を指定して直近のReleaseにある他章を再利用。
- 単一空間で前景が状態変化し、字幕専用UIが常に最後に描画される。画面下170pxは常に字幕専用。

## 開発時の確認

```bash
cd shared/v119
python3 scripts/build_data.py
python3 scripts/qa.py
npm install --no-audit --no-fund
npm run build
# VOICEVOX エンジン localhost:50021 起動後
python3 scripts/synth_chapter.py prologue
python3 scripts/merge_timing.py prologue
node scripts/render.mjs prologue --smoke
```

研究出典はSOURCES.mdに記載。工程が失敗した場合は完成MP4と呼ばない。
