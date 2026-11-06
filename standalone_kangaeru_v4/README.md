# 考える夜 standalone v4
独立型の **台本 → 絵コンテ → CC0写真 → TTS → 音声尺に同期した中央字幕 → 映像 → サムネイル → QA** エンジンです。既存のfactory.pyには触れません。

## インストールと実行
sudo apt-get install ffmpeg fonts-noto-cjk
pip install -r standalone_kangaeru_v4/requirements.txt
python standalone_kangaeru_v4/engine.py --script standalone_kangaeru_v4/plant.json --output output/plant

GitHub Actions workflow: .github/workflows/kangaeru-v4-test.yml
Artifact: final.mp4, qa.json, storyboard.json, materials.json, timeline.json, captions.srt, thumbnail.jpg, description.md

## 仕様
- 1280×720, 黒・アンティークゴールド・日本語明朝体・余白重視。
- 下部字幕は水平中央揃え、複数行対応。表示台本とTTS読み台本は分離。
- 音声の実際のWAV長を計測して、字幕時刻と映像シーン時刻を生成。
- TTSは公式VOICEVOX Engine (CPU) による無認証の日本語合成。espeakフォールバックは禁止。
- Wikimedia Commonsの作品単位のCC0情報を検証した写真だけを使用。未検証素材は使わない。
- 24アイコンはユーザー原画 8015.png の切り出しのみ。代替は禁止。
- QAは表示文字・字幕帯・素材権利・レイアウト反復・出力ストリームなど。
- YouTubeへのアップロードや公開は行わない。

## 完了条件
final.mp4 が存在し、QA passed=true と自動テストが合格すること。美的品質には別途人間の確認を要する。

## 2026-11-05 本番音声への切り替え

- 無料・認証不要の公式 VOICEVOX Engine (voicevox/voicevox_engine:cpu-latest) をローカルHTTP APIで起動して日本語TTSを生成する。
- 使用音声: 青山龍星「ノーマル」Talk ID 13。クレジットは VOICEVOX:青山龍星。各音声ライブラリ利用規約を順守する。
- 同じ plant.json で voicevox_preview.py を実行し、voice_qa.json と voicevox_japanese_sample.mp3 を保存する。
- 元アイコン画像の必須条件: ユーザー提供の8015.png（1536×864、140555バイト）を standalone_kangaeru_v4/brand/8015.png に追加してからMP4を生成する。代替線画は使用しない。
- 画像未配置の場合は音声テストだけ行い、動画を完成扱いしない。
- GitHub Actionsの実ログとアーティファクトを完成報告の根拠とする。
