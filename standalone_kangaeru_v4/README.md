# 考える夜 standalone v4
独立型の **台本 → 絵コンテ → CC0写真 → TTS → 音声尺に同期した中央字幕 → 映像 → サムネイル → QA** エンジンです。既存のfactory.pyには触れません。

## インストールと実行
sudo apt-get install ffmpeg espeak-ng fonts-noto-cjk
pip install -r standalone_kangaeru_v4/requirements.txt
python standalone_kangaeru_v4/engine.py --script standalone_kangaeru_v4/plant.json --output output/plant

GitHub Actions workflow: .github/workflows/kangaeru-v4-test.yml
Artifact: final.mp4, qa.json, storyboard.json, materials.json, timeline.json, captions.srt, thumbnail.jpg, description.md

## 仕様
- 1280×720, 黒・アンティークゴールド・日本語明朝体・余白重視。
- 下部字幕は水平中央揃え、複数行対応。表示台本とTTS読み台本は分離。
- 音声の実際のWAV長を計測して、字幕時刻と映像シーン時刻を生成。
- テストTTSは無認証のespeak-ng（日本語の声質は本番水準ではない）。VOICEVOX HTTP APIも接続口を用意する。
- Wikimedia Commonsの作品単位のCC0情報を検証した写真だけを使用。未検証素材は使わない。
- 元のアップロード画像をGithubへ転送できない場合は、登録された24概念の線画アイコンで置き換え、同一画像とは表現しない。
- QAは表示文字・字幕帯・素材権利・レイアウト反復・出力ストリームなど。
- YouTubeへのアップロードや公開は行わない。

## 完了条件
final.mp4 が存在し、QA passed=true と自動テストが合格すること。美的品質には別途人間の確認を要する。
