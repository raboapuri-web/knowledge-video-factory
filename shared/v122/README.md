# V122 なぜ「何もしない時期」が人生には必要なのか？

考える夜 / 冬眠×休眠×適応戦略。

V121で成功した prepare一括依存・VOICEVOX実測・章別smoke・pixel subtitle QA・chapter reuse を継承しつつ、V122では45シーンすべてを専用レイアウトへ再設計。汎用カードを左右から出す共通演出を廃止し、意味ごとに異なる画面文法と連続カメラモーションを割り当てる。

- 45意味シーン / 9独立レンダー単位。
- 各意味シーン8 semantic states。各stateを reveal + settle の2段階で動かす16 micro beats、設計上約720 visual beats。
- 1920×1080 / 30fps / 青山龍星 speaker 13 / speed 1.15。
- 長文ナレーション維持。短文や単語列挙へ分解しない。
- 同じ背景のパン・ズームだけを別カットとして扱わない。45 motifすべて専用構図。sceneごとに入口方向・settle挙動・カメラ軌道も変える。
- 冬の森、巣穴、代謝計、昆虫休眠、砂漠種子、微生物、農村、工場、四季のオフィス、自宅と頭内会議、創作机、認知道路、霧の分岐、工場投資、再起動、四季円環まで世界を切り替える。
- 下170pxは字幕専用。前景オブジェクトは侵入禁止。
- build_data/structural QA → npm build → 9章並列VOICEVOX → measured timing → chapter build → smoke render → pixel subtitle QA → full render retry → concat/BGM → ffprobe → black/freezedetect → contact sheet → Release。
