# V118 完璧な独裁国家の運営マニュアル｜考える夜

**V117『イン・ザ・メガチャーチ』とは完全に独立した新規プロジェクト。**

- 8章 / 38意味シーン、ナレーションは正式版の内容・研究・順序に基づく映像用再構成稿。元の全文を逐語収録したものではない。
- 青山龍星ノーマル（VOICEVOX speaker 13, speedScale 1.15）。音声生成後に`content/measured-<chapter>.json`が確定し、Motion Canvasの長さを決定する。
- 同じ空間の中で4段階以上の因果表現を展開。最前面字幕 overlay を独立保持。毎章の冒頭スモークレンダリングを通してから正式レンダリング。
- GitHub Actions: `.github/workflows/v118-motion-canvas-dictator.yml`。pushで本編8章をビルド。手動時に`only_chapter`指定で既存完成チャプターを再利用可能。
- FFmpeg stream copyを優先し、BGMと音声だけAACミックス。MP4本編・章別MP4・QA・コンタクトシートをGitHub Releaseへ出力。

## QAの限界

音声生成失敗、字幕尺未確定、ビルド失敗、動画結合エラーなら完成扱いしない。静的QAは字幕分割・レイヤー構造・シーン数を検証できるが、映像意味の正確性は重要シーンの人間確認が最終的に必要。黒画面・フリーズ検出はQAファイルに警告を記録する。

## 章別制作

`python3 scripts/build_data.py`
`python3 scripts/synth_chapter.py chapter1` (VOICEVOX required)
`python3 scripts/merge_timing.py chapter1`
`npm run build`
`node scripts/render.mjs chapter1 --smoke`
`node scripts/render.mjs chapter1`

元台本の場面・歴史的実例の解釈については`SOURCES.md`参照。
