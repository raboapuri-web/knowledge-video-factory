# 考える夜 v6：原稿全文 → 絵コンテ → 画像 → 青山龍星 → MP4

このフォルダは既存 v5 を破壊せず、対象ブランチ上に追加したスタンドアロン制作パイプラインです。**APIキー・有料契約不要**の範囲で動作する設計です。

## 実行対象
- `gk_source.json`：Google Docsの255段落から取得した原稿。本文の248段落をナレーションとして厳密に保持。
- `storyboard.py`：章・段落・比較・数値・問いのルールを使ってシーン割り。LLMではなくルールベースの自動処理であり意味の理解精度は限定的。
- `materials.py`：Wikimedia Commonsの個別ファイル情報からCC0/PD写真だけ採用。合致しなければ図解・元アイコンへ戻す。素材ごとのURL/作者/ライセンス/ハッシュを台帳に残す。
- `render_video.py`：VOICEVOXの `青山龍星 / ノーマル / Talk ID 13` を実行時APIで検証。台本は変更せず、音声から尺を取得し、中央揃えの日本語字幕を付けてMP4を生成。原アイコンは `../standalone_kangaeru_v4/brand/8015.png` に依存。

## GitHub Actions
- [第2段階: シーン割り](../../.github/workflows/kangaeru-v6-stage2.yml)
- [第3段階: Commons素材検索](../../.github/workflows/kangaeru-v6-stage3.yml)
- [第4段階: 全文MP4生成](../../.github/workflows/kangaeru-v6-full.yml)

## 独立実行
```bash
sudo apt-get install ffmpeg fonts-noto-cjk
python3 -m pip install -r standalone_kangaeru_v4/requirements.txt
python3 standalone_kangaeru_v6/storyboard.py --input standalone_kangaeru_v6/gk_source.json --output standalone_kangaeru_v6/output/gk/storyboard.json
python3 standalone_kangaeru_v6/materials.py --board standalone_kangaeru_v6/output/gk/storyboard.json --output-dir standalone_kangaeru_v6/output/gk
docker run --rm -d --name voicevox -p 127.0.0.1:50021:50021 voicevox/voicevox_engine:cpu-latest
VOICEVOX_SPEAKER_NAME=青山龍星 VOICEVOX_STYLE=ノーマル VOICEVOX_SPEED=1.06 VOICEVOX_INTONATION=1.02 \
python3 standalone_kangaeru_v6/render_video.py --source standalone_kangaeru_v6/gk_source.json --output-dir standalone_kangaeru_v6/output/gk
```

## 生成物
`storyboard.json`、`storyboard_with_assets.json`、`materials.json`、`qa_storyboard.json`、`qa_materials.json`、`timeline.json`、`captions.srt`、`description.md`、`thumbnail.jpg`、`contact_sheet.jpg`、`final.mp4`、`qa_final.json`。

## 未実装・公開前の確認
- ユーザーが送った資料についての独立した学術的ファクトチェック。
- 発音・イントネーションを耳で確認する工程、語単位の字幕アラインメント。
- 厳密な画像内容認識や、特定人物・歴史的事件の写真が主張を裏付けるかの専門的確認。
- 語彙ルールを超える意味理解（専用のLLMは未導入）。
- 動画のYouTubeへのアップロード・公開。

**技術QAのpassは、本番公開品質の自動保証ではありません。**
