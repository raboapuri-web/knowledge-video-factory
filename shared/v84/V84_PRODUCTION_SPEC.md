# V84 本番制作仕様 — なぜ、感情のないAIによって、人類は滅びるのか？

## 画作り
26の独立した物語世界、約190のナレーションbeat。ナレーションは shared/v84/ai-extinction-script.txt を原文としてVOICEVOX青山龍星（ノーマル、speed 1.13）で生成し、実音声の長さへ字幕・Remotion尺を同期する。

既存素材は「意味・時代・構図が合う場合のみ」使用:
- BG_office.png: AI agentを使う現代オフィス
- BG_kenkyu.png: AI研究支援ラボ
- BG_syosai.png: 研究者の目的と手段の比喩
- BG_bank.png: 金融AI
- BG_town.png: gradual disempowermentの都市俯瞰
- BG_darkroom.png: 最終研究室
- OfficeWorkerRig / OfficeWomanRig / RESEARCHER_MAN / RESEARCHER_WOMAN / PASSERBY
これ以外のデータセンター、物流倉庫、評価実験、サイバー運用、行政、軍事指揮、競争ゲーム等はV84専用のベクター背景・アニメーションを新規制作する。

## 背景の動き
背景画像をただ横移動するだけで済ませない。データセンターのランプ、冷却光、物流機器、モニターログ、ネットワーク粒子、研究グラフ、時計、レーダー、タスクボードなど、背景内部の複数要素を異なる速度で動かす。テンプレート背景を使う場合も、カメラ移動・光・画面・人物・前景のパララックスを重ね、静止画の貼り付けに見せない。

## テンポ
原則として1 narration beat = 1 visual shot。約190 sceneを12〜22分の実測音声へ割り当てる。同じ舞台でもbeatごとにカメラseed / 小物 / データ表示 / 人物動作を変える。抽象概念が2 beat以上続く場合は、模式図→現実の人物→別角度の環境へ交互に切り替える。

## エラー防止
1. 26 phaseの欠落をpreflightで拒否。
2. scene 180未満を拒否。
3. TypeScript check。
4. 26 worldすべてのscene preview。
5. 26 worldから10 world以上をbackground-onlyで2時点レンダリングし、画像hash差分が無ければ失敗。
6. 承認済み背景はstage-background.mjsでchecksum確認してepisodeへコピー。
7. 共有asset catalogのvalidateを実行。
8. VOICEVOX全beatの音声ファイル・timing coverageを検証。
9. 8並列H.264レンダリング→連結。
10. ffprobeで1920x1080 / video+audio / 実音声とのduration差2.5秒以内 / 異常に小さいファイルを拒否。
11. contact sheet生成後のみRelease公開。
12. 人間が全編を視聴したと偽らない。
