# V85 PRODUCTION SPEC — 快楽ではなく、苦痛を追い求めよ

## 正本
ユーザー添付の「貼り付けたテキスト（1）(1).txt」を正本とし、ナレーション本文は改稿せずに使用する。Git上では shared/v85/pursue-pain-script.txt に映像用phase markerだけを追加して保持する。見出しは読み上げず、本文のみVOICEVOXへ送る。

## 映像設計
- 約270 narration beat、30の独立した映像世界。
- 原則1 narration beat = 1 visual shot。
- すべてのbeatに固有 visual / bgGroup / actionKey / actionSeed / cameraSeed / motionFingerprintを持たせる。
- 本文から雨、温度、スマホ、食事、移動、読書、会話、運動、古代、選択、快楽・苦痛バランス等を判定し、専用モーションを割り当てる。
- 同じaction categoryでも軌道、速度、振幅、開始位置、小物位置、人物サイズ、カメラをseedで変え、同一モーションを再使用しない。
- 背景にもbeat固有の照明、窓、遠景、家具シルエット、床面、粒子、パララックスを追加する。
- 同じ場所が物語上必要な場合でも、同一構図を再使用しない。
- 人物や小物だけを変えて別カット扱いにしない。背景・カメラ・動作の三要素を同時に変える。

## 30世界
深夜の快適な部屋、無限スクロール、文明パラドックス、先史平原、火と食事、効率化された現代、現代通勤、comfort creep、刺激のフィード、菓子の適応、退屈な電車、ニーチェの山、古代アテネ、熱砂、雪像、最小所有、オデュッセウス、現代self-binding、早朝ラン、筋力適応、ホルミシス研究、読書、難しい会話、安全上の境界、階段、スマホなし通勤、夜の散歩、運動後の食事、現代都市とディオゲネス、最終選択。

## 音声
VOICEVOX 青山龍星・ノーマル・speed 1.13。全beatを個別生成し、実測音声長を字幕・Remotion尺に同期する。字幕必須。

## QA
1. 30 phase / 240〜340 beat。
2. TypeScript check。
3. visual / bgGroup / actionKey / cameraSeed / motionFingerprint の全件unique。
4. 30世界の代表プレビュー。
5. 30世界のbackground-onlyを2時点でレンダーし、静止背景を拒否。
6. 全beat低解像度QA reelから中央frameを抽出。
7. 隣接カットの画素差が小さすぎる場合は失敗。
8. 非隣接カットでも量子化hash一致または極端に近似する場合は失敗。
9. VOICEVOX全beat timing coverage。
10. 8分割H.264本番レンダー。
11. narration+BGM結合。
12. ffprobe: 1920x1080、video+audio、実音声とのduration差2.5秒以内、700秒以上。
13. contact sheet / sources / specをReleaseへ添付。
14. 自動QAを人間による全編視聴と表現しない。
