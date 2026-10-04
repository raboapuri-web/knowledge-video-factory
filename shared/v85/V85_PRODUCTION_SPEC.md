# V85 PRODUCTION SPEC — 快楽ではなく、苦痛を追い求めよ

## 目的
台本 shared/v85/pursue-pain-script.txt を、短文や単語の連発へ改変せず、長いナレーションの意味単位ごとにテンポよく切り替わる2D映像へする。30の物語世界、256前後のナレーションbeat。VOICEVOX青山龍星ノーマル、speed 1.13、字幕必須。

## 類似カット排除
- 原則1 narration beat = 1 visual shot。
- すべてのbeatに固有 actionKey / actionSeed / cameraSeed / visual idを付与。
- 同一phase内でも shotKindを8種類で巡回し、カメラscale、XY移動、人物位置、前景prop、内部背景motionを変える。
- 同じ背景画像を連続して貼り付けるだけのシーンは禁止。
- 全beatを低解像度QA動画へレンダーし、各beat中央フレームを抽出。隣接beatの平均画素差が小さすぎる場合はCIを失敗させる。
- visual id、actionKey、camera fingerprintの重複もCIで拒否する。

## 各ナレーション専用動作
各beatの本文から、歩行、スマホ操作、食事、読書、対話、運動、選択、適応模式などのforeground typeを決める。その上でactionSeedにより開始位置、移動量、prop位置、人物のサイズ、カメラをbeat固有にする。意味と無関係なループ動作だけで埋めない。

## 30世界
深夜の快適な部屋、無限スクロール、文明パラドックス、先史平原、火と食事、産業革命、現代通勤、comfort creep、刺激のフィード、菓子の適応、退屈な電車、ニーチェの山、古代アテネ、熱砂、雪像、最小所有、オデュッセウス、現代self-binding、早朝ラン、筋力適応、ホルミシス研究、読書、難しい会話、安全上の境界、階段、スマホなし通勤、夜の散歩、運動後の食事、夜の都市、最終選択。

## QA
1. 30 phase / 240〜340 beat。
2. TypeScript check。
3. 全visual/action/camera fingerprint unique。
4. 30世界の代表プレビュー。
5. 全beat低解像度preview video→中央frame抽出→隣接類似度検査。
6. VOICEVOX全beat timing coverage。
7. 8分割H.264レンダー。
8. narration+BGM結合。
9. ffprobe: 1920x1080、audio+video、実音声とのduration差2.5秒以内、700秒以上。
10. contact sheet / sources / specをReleaseへ添付。
11. 自動QAを人間による全編視聴と表現しない。
