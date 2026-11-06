# 考える夜 v8 — モーションと高品位ピクトグラム

対象ブランチ：`kangaeru-yoru-v8-motion-20261106`。mainは変更しない。YouTube投稿はしない。

## 実装済み：24テンプレート（20動作＋4静止／カット）

| フィールド | name | 秒 | easing | 動作 |
|---|---|---:|---|---|
| text | fade_up | 0.62 | cubic_out | 不透明度0→1＋Y+24px→0 |
| text | type_on | 0.78 | linear | 文字単位の段階表示。折返し無し・見出し枠固定 |
| text | slide_in | 0.55 | cubic_out | 見出し右から38px移動＋フェード |
| text | soft_scale | 0.60 | quint_out | 見出し93→100％に拡大 |
| text | mask_wipe | 0.68 | cubic_in_out | マスクで左から文字を出す |
| text | none | 0 | linear | 固定テキスト |
| diagram | pop | 0.65 | back_out | ピクト／図形70→100％、軽いオーバーシュート |
| diagram | stagger | 0.86 | cubic_out | 図形を順次フェード＋19px上昇 |
| diagram | draw_on | 0.83 | cubic_in_out | 線図を横方向マスクで順番に表示 |
| diagram | float_in | 0.72 | cubic_out | 図形を12px右＋35px下から入れる |
| diagram | radial | 0.68 | quint_out | 図形を中心から82→100％に拡大 |
| diagram | none | 0 | linear | 図形を即時表示 |
| data | bar_grow | 0.95 | cubic_out | 元の確定数値まで棒が伸長 |
| data | count_up | 1.05 | cubic_out | 0から確定数値まで小数桁数を維持して加算 |
| data | bar_and_count | 1.10 | quint_out | 棒＋数値を連動アニメ |
| data | grid_wipe | 0.80 | cubic_in_out | グラフ全体を横方向に開示 |
| data | pulse_focus | 0.88 | cubic_out | 金色の値を一度強調し正確な長さで静止 |
| data | none | 0 | linear | 元の値を即時表示 |
| transition | crossfade | 0.42 | cubic_in_out | 前後場面のオーバーラップ |
| transition | dip_black | 0.48 | cubic_in_out | 暗転から次場面へ |
| transition | wipe_left | 0.46 | cubic_in_out | 次場面を左から覆う |
| transition | push_left | 0.52 | cubic_in_out | 前後場面を連結スライド |
| transition | gold_flash | 0.34 | cubic_out | 一瞬だけ抑制した金色フラッシュ |
| transition | cut | 0 | linear | クイックカット |

数値がある `data_bars` 以外のシーンでは `motion.data` を `none` に正規化する。文字の見出しは最大18文字、注釈最大12文字、字幕帯は画面下部の固定領域（720p内のy=586〜720）。文字・図形は同じ領域に動かさず、座標の移動幅を制限する。

### 絵コンテでの指定例

```json
{
  "id": "s003",
  "composition": "data_bars",
  "motion": {
    "text": {"name": "type_on", "duration": 0.78, "easing": "linear"},
    "diagram": {"name": "stagger", "duration": 0.86, "easing": "cubic_out"},
    "data": {"name": "bar_and_count", "duration": 1.10, "easing": "quint_out"},
    "transition": {"name": "crossfade", "duration": 0.42, "easing": "cubic_in_out"}
  }
}
```

`motion`が未指定でも、レイアウトの種類とシーン番号から決定論的に安全な既定値を設定する。知らないテンプレート名、極端なduration、無効なeasingも安全な既定値へ戻す。適用先は`motion.py::spec_for`。実際の全71シーンの選択は`v8_storyboard.json`に保存。

## ピクトグラムの新規品質規則

- 元の生成SVG座標は**意味と出典の記録**として保存し、完成映像にはジャンル別の**専用シルエット／面付きピクトグラム**を適用。
- 黒 `#0e0d0c`、金 `#c6a56e`、象牙色 `#f2eadb`、背面金 `#7c684b`。
- 線幅2〜7ユニット、丸端、塗りつぶした肩・胴体・四肢、ゴール枠とネットを持つGK、医療防御の盾、倒れた人と通行人、学生の声と音波など。
- v7の全11点のアイコン概念を監査し、それぞれに具体的なモチーフを対応。対応不能な抽象モチーフはQAで**停止**。
- SVG 512×512を`pictograms/`に保存し、`pictogram_contact_sheet.jpg`で全体審査可能。元8015の24アイコンは有効な場合のフォールバックとして保持。
- 未検証の任意のSVGスクリプトを外部LLMから受け取らない。今回の追加OpenAI API使用は**ゼロ**。

## 全編再レンダリング

- 入力：v7の保存済み71シーン絵コンテ（Run 42168254310）＋写真7枚・図解代替5件（Run 42170721259）。
- 音声：無料VOICEVOX `青山龍星／ノーマル／Talk ID 13`。本文ナレーションは不変。
- 出力：1920×1080、30fps、H.264/AAC、字幕224キュー。
- 初回字幕キューの開始約1秒間をアニメーションフレームへ分解し、続きは精細な静止フレームで表示。各シーンのアニメーションは音声時間から計算して上限を適用。字幕の表示位置は固定。
- 場面転換は前シーンの最終フレームとのコンポジットで実際に表現する。
- 従来のCC0/PD権利台帳・写真整合性QAはそのまま再利用。無関係写真は入れない。
- 全24テンプレートの動作テスト、SVG構文、セーフゾーン、アイコン意味、原稿不変、H.264/AACストリームを確認。機械QAと人間の視聴品質審査は区別する。

## 見送るもの

本実装で挙げた24モーション候補はすべて用意した。新規の**実写モーション生成・人物のAI動画化・3Dの複雑なアニメーション**は、入力写真の撮影状況・モデル生成・追加APIやGPU負荷が必要になるため対象外。今回は静止画の入場演出のみ。字幕の文字単位精密アラインメントは未対応で、v7のキュー単位の推定タイミングを継承。

## 生成物

`final.mp4`、`qa_final.json`、`api_usage_v8.json`、`motion_catalogue.json`、`motion_scene_manifest.json`、`v8_storyboard.json`、`pictogram_registry.json`、`pictogram_contact_sheet.jpg`、`pictograms/*.svg`、場面プレビュー／6枚程度のコンタクトシート、字幕・音声タイムライン・写真権利台帳・VOICEVOXクレジット。

品質QAが合格しても、**人間による視聴審査が最終判定**となる。GitHub ActionsへのSecretは新たに渡さず、YouTubeへの公開・投稿もない。
