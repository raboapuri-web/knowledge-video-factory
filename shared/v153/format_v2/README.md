# V153 format v2 — handoff package

対象：**なぜ深海の生き物は巨大化するのか？**（V153）

このZIPは、既存のV153制作ブランチへ追加・置換するためのファイル一式である。既存の88シーン、VOICEVOX、素材権利ゲートは維持し、映像工程をformat v2へ更新する。

## ZIP内の配置

- `.github/workflows/v153-deep-sea-gigantism.yml` — 既存workflowの置換版
- `shared/v153/scripts/render_chapter.py` — motion map、章カード、黒い字幕帯に対応した置換版
- `shared/v153/scripts/synth.py` — 字幕帯内に字幕を置くためASS下マージンを調整した置換版
- `shared/v153/format_v2/config/scene_motion_map.json` — S001〜S088の88件
- `shared/v153/format_v2/config/chapter_card_spec.json` — 章カード機械可読仕様
- `shared/v153/format_v2/chapter_card_spec.md` — 章カード仕様書
- `shared/v153/format_v2/audio/type_key.wav` — オリジナル打鍵音
- `shared/v153/format_v2/scripts/render_chapter_card.py` — タイピング章カードの描画・音声合成
- `shared/v153/format_v2/scripts/validate_motion_map.py` — motion map検証
- `shared/v153/format_v2/license_note.md` — 音源・生成画像の権利メモ

## 画像ファイルの配置

生成画像6点は別途受け取ったものを次の名前で配置する。

```text
shared/v153/format_v2/assets/chapter_cards/backgrounds/prologue_bg.png
shared/v153/format_v2/assets/chapter_cards/backgrounds/chapter1_bg.png
shared/v153/format_v2/assets/chapter_cards/backgrounds/chapter2_bg.png
shared/v153/format_v2/assets/chapter_cards/backgrounds/chapter3_bg.png
shared/v153/format_v2/assets/chapter_cards/backgrounds/chapter4_bg.png
shared/v153/format_v2/assets/chapter_cards/backgrounds/epilogue_bg.png
```

7点目の共通ベース画像は章カードには使わず、スタイル参照として保管する。

## 適用手順

1. ZIPをリポジトリのルートで展開し、同名ファイルを置換する。
2. 上記6枚の背景画像を指定パスへ配置する。
3. `python shared/v153/format_v2/scripts/validate_motion_map.py` を実行し、`MOTION_MAP_OK 88 scenes` を確認する。
4. GitHub Actionsのasset-preflightを実行し、既存素材が登録済みの場合に再収集されないことを確認する。
5. 目視確認と素材ゲート承認後、`[render-approved]` を含むコミット、またはworkflow_dispatchで `render_approved=true` を指定してレンダリングする。

## 動作仕様

- 1シーン1画像。既存boardのS001〜S088を維持。
- 通常ズームイン：1.00→1.20。ズームアウト：1.20→1.00。
- パン：1.06固定倍率で、カメラ移動量は約6%。
- 図版：固定または1.00→1.04の緩いズーム。board側の指定がパンでも、図版の可読性を優先する。
- 同一motionの3連続は禁止。
- 章カードは各章動画の先頭に挿入。章カード音声は打鍵音のみ。
- 本編シーンには画面下部130pxの不透明黒帯を描画し、その上に字幕を合成する。
- 本編映像と章カードの音声は48kHz mono AACへ統一し、章単位のconcat stream copyを可能にする。
- FFmpegは既存 `install_media_tools.sh` の静的バイナリを使う。apt経由のFFmpeg導入には戻さない。

## 注意

scene_motion_mapは既存boardの各シーン意図を保ちながら、v2の動作選択肢へ具体化したもの。図版は可読性を優先して固定／ごく緩いズームにしている。レンダリング後は完成MP4の実フレームからコンタクトシートを作り、字幕帯・カード挿入・motionを目視確認する。
