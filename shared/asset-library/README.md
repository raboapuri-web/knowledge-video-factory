# 共有素材ライブラリ — 背景 / パーツ / 人物

既存の `knowledge-video-factory` 内に設置（現在のGitHubリポジトリは公開設定）。動画ごとに別Gitリポジトリを作らず、コード・VOICEVOX・Remotion・QA と同じコミットで素材を固定する。既存の完成動画や映像テンプレートregistryは変更しない。

## ディレクトリと素材登録
- `背景/` — 1920×1080、**文字・人物・動く小物を描き込まない**静止画プレート。
- `パーツ/` — 透過PNG / WebP / SVG。スマホ、請求書、時計など、台本に対応する前景物体。
- `人物/` — 背景透過の独立キャラ。シルエット、服装、視点、姿勢をメタデータに含め、再登場時の一貫性を維持する。
- `catalog.json` — 1素材1件。ユニークなID、カテゴリ、正確な相対ファイル名、テーマ語2個以上、適用phase、除外語、作風、権利、1920×1080空間での配置、モーション。名前だけの曖昧な素材は登録しない。

付属SVGは動作確認用のオリジナル・サンプル。従来の高密度な場面別vector sceneを置き換える完成美術ではない。実写寄りのカットは同じ登録ルールで生成画像のPNG/WebPを追加する。外部素材は権利・商用利用・被写体/既存作品類似を人間が確認してから `cleared-commercial` にする。画像内に字幕・見出しを焼き込まない。

## 台本から動画まで（既存の作り方に合わせる）
1. 学術検証済み原稿から、意味チャンクと `phase, bgGroup, narration, visualIntent` を設計。`bgGroup` は隣接する1〜2シーンだけが同じ固定背景を持ち、離れたシーンへ戻さない。
2. **映像絵コンテが先**。各sceneの特定の背景・物体・人とその動き・構図・前後の接続を指定する。テンプレート/素材があることを理由に脚本の意味を曲げない。
3. ブートストラップで `<episode>/src/script-data.json` を作る。既存の `shared/remotion-templates` とは別レイヤーで、素材はIDとmetadataから候補を選ぶ。
4. `node shared/asset-library/prepare.mjs <episode>` を**VOICEVOX前・プレビュー前**に実行。`src/asset-plan.json`（各beat/Groupの採用・スコア・SHA256・採用理由）、`qa/asset-report.json`（未充足の背景一覧）、および採用品だけ `public/assets/library` へコピー。GitHub Actionsのprepareジョブとrenderジョブ間では、音声と同じく生成済みpublicフォルダをartifactで受け渡す。API呼び出しはゼロ。
5. 既存Remotionシーンが基本。**絵コンテで承認したシーンのみ** `assetComposition: "library"` とし、下記の`AssetScene`に切り替える。背景と意味のある前景（パーツ/人物の少なくとも一方）が基準を満たさなければ処理を停止し、汎用画像を挿入しない。`AssetLayers` で背景だけ/前景だけの採用も可能だが、既存stageや人物と重複しないか動画側で手動指定する。
   新規動画では各beatに `assetComposition: "auto"` と書くと、背景＋意味のある前景が高マッチのときだけ自動採用し、不足ならそのbeatを従来の固有sceneに戻す。既存V69はこの指定をしていないため映像を勝手に置き換えない。
6. VOICEVOX音声実測 → 現在のindex.tsxによる字幕 → Remotionプレビュー → シーンcontact sheet → 本番レンダー → 既存のReleaseとQA。素材の選定は字幕や音声の再生速度に影響しない。

### 新規動画に組み込むサンプル

動画の `src/index.tsx` に以下のように追加する。共有モジュールの相対パスは動画ディレクトリがリポジトリ直下である場合。

```tsx
import assetPlan from './asset-plan.json';
import {AssetScene, type AssetSelection} from '../../shared/asset-library/remotion';
const choice=(assetPlan.scenes as Record<string,AssetSelection>)[beat.id];
const frameVisual=choice?.mode==='library'
  ? <AssetScene selection={choice} progress={beatProgress}/>
  : <SceneVisual n={beatIndex+1} progress={beatProgress}/>;
```

従来の字幕とVOICEVOX timingはその外側に重ねる。単なる書類/スマホ/人物だけを既存の複雑な場面の上へ無条件に重ねない。ライブラリ選択後も、具体的な動作や移動・カメラ・前景オブジェクトの入れ替えはscene固有の実装を行う。連続シーン中の**背景画像およびカメラ座標は静止**させ、入退場と前景のみ動かす。

## 採用基準・予算
- 意味一致：ナレーションまたは画作り意図から **別々のキーワード2件以上＋その素材を直接指す必須語**、適切なphase、除外語なし、同じ作風/色調、スコア0.88以上。スコアは規則ベースの一致度であり、モデルの確率ではない。
- 背景：同じbackground group内では静止して共有、**別groupで同じ素材を使用しない**。1素材につき1group/1動画が初期値。合わないgroupは「新規制作待ち」としてレポートに残し既存Remotion専用画を使う。
- パーツ/人物：最大採用回数と3sceneの間隔を設ける。同一キャラクターの連続登場はbgGroup内で許容。素材総数の少なさを無理な流用で補わない。
- catalogの追加・更新で参照先SHA256が変わるため、過去のepisodeを再構築する際はその実行時のGitコミットに固定する。`src/asset-plan.json` は生成物でありレビュー対象。

## 動作確認
```bash
node shared/asset-library/test-assets.mjs
node shared/asset-library/prepare.mjs v69-free-services
cat v69-free-services/qa/asset-report.json
```

既存V69のworkflowはprepareでasset-planとファイルを用意する。**既存のV69原稿は絵コンテ側でlibraryを許可していないので見た目は従来通り**。次の動画で承認sceneに `assetComposition:"library"` を付ければ、マッチした素材だけ描画される。人間の目によるcontact sheetレビューが必須。

## 再利用せず新規制作する条件
固有の歴史上の人物・特定の年代/土地/職業・遠近感や人物行動が合わない、文字/商標/権利に問題がある、あるいは同じ背景が繰り返し現れるとき。新規PNG/WebPを作ったら、透過/解像度・ファイルサイズ・商用権利・ID・タグ・phase・レイアウトを登録しテストする。背景2倍速のパン/ズーム演出を用いる場合でも、同じbgGroupを跨いで背景の座標が変わることを禁止する（既存V69/V81は背景固定）。
