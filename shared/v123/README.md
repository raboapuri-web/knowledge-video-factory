# V123 — もっと政府に感謝して税金を納めよう
考える夜 / 『リバタリアンが社会実験してみた町の話』を手掛かりにした実録解説動画

## 制作内容
- ニューハンプシャー州グラフトンと Free Town Project、税・住民自治・クマ問題。
- 53 meaning-scene / PROLOGUE + 第1〜4章 + EPILOGUE。尺は目標値で固定せずVOICEVOX実測値で決定。
- 文章: content/scene_narration.tsv。個別シーンの日本語朗読、夜のラジオを意識した落ち着いた「である調」。
- 史実: SOURCES.md。社会実験の因果を過度に単純化しない。再構成風イラストは史実映像ではない。
- 映像: src/lib/meaningScene.tsx。森・家・クマ・ゴミ・議会・予算・公的サービス等のシーン固有動作。
- 音声: VOICEVOX 青山龍星 13 / speedScale 1.15、パートごとに実測音声を作り字幕と結合。
- 表示: 1920×1080 / 30fps、字幕は最上位に固定 / 絵・テキストは字幕安全域と分離。
- GitHub Actions: .github/workflows/v123-motion-canvas-grafton.yml。
- 全体QA: 起動→全章煙テスト→音声→各章レンダリング→MP4結合→BGM→映像の解像度・秒数・黒画面・フリーズ点検→Release発行。

## 重要な制作上の判断
- 完全無政府の町、全部の予算削減が実現したという断定を禁止。2014年NPRでは30%削減は当時の「構想」。
- クマの事件を自由至上主義だけが原因と断定しない。州全体の個体数や管理予算、食物の誘引が交絡。
- 2012年クマ襲撃は確認できるが、自宅・屋内での細部は本編では断定せず描写を抑制。
- 住民個人の発言の創作、見せかけの統計や数値グラフは使わない。
- 公共財の定義と外部性は区別し、すべての公的サービスを純粋公共財と呼ばない。

### ローカル検証
```sh
cd shared/v123
python3 scripts/build_data.py
python3 scripts/qa.py
npm install
npm run build
# MP4本番生成にはVOICEVOXサーバーとGitHub Actions workflowが必要
```
