# V124 沖縄は本当に「辺野古を受け入れた」のか？

考える夜 / 民意×選挙×地方自治×安全保障。

2026年沖縄県知事選で辺野古移設を容認する古謝玄太氏が当選した事実と、2019年県民投票で辺野古埋め立て反対が71.7%だった事実を並べ、「どちらが本当の民意か」ではなく「そもそも選挙と住民投票は何を測っているのか」を歴史・政治学・公共経済学から解く。

## 映像設計
- 63意味シーン / 9独立レンダー単位。
- 各シーン8 semantic states × reveal/settle 16アクションに、4段階のscene固有カメラ遷移を加え、設計上20 micro beats / scene、約1,260 visual beats。
- 1945戦後地図、1972復帰、1995抗議、1996 SACO、1997名護市民投票、2013承認、2014県政転換、2019県民投票、2020軟弱地盤、2023代執行、2026知事選まで、時代ごとに背景世界を切り替える。
- 投票箱、スーパーの家計、政策束の圧縮、nested publics、外部性、県庁・霞が関・裁判所、海底断面、出口調査、salience二軸、世代交代など、情景→史実→図解→情景を交互に使う。
- 63 motifすべて専用case。motion signatureも63個すべて固有。汎用カードが左右から順番に出るだけの共通演出は禁止。
- 下170pxは字幕専用。本文オブジェクトは字幕帯に侵入させない。
- 1920×1080 / 30fps / VOICEVOX 青山龍星 speaker 13 / speed 1.15。
- 長文ナレーションを維持し、短文・単語の連発へ分解しない。

## QA / render
build_data → structural QA → npm typecheck/build → 9章並列VOICEVOX → measured timing → chapter rebuild → smoke render → pixel subtitle QA → full chapter render with retry → concat/BGM → ffprobe hard gate → black/freezedetect scan → 36-frame contact sheet → GitHub Release。

※低リスクでV122の検証済みMotion Canvas基盤を継承するため、この制作ブランチではランタイム基盤ディレクトリ shared/v122 をV124用に上書き利用している。成果物・project名・release名はすべてV124として分離する。
