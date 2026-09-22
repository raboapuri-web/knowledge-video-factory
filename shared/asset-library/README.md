# 共有素材ライブラリ（背景はメタデータ登録・パーツはオーバーレイ）

このフォルダーは **パーツ/** とユーザーが追加した **背景/** を保持します。背景は名称・関連語などのマスター登録対象ですが、既存の動画に自動で全面背景として差し込まれるわけではありません。人物共有フォルダーは削除済みです。動画の文脈・時代・構図に合わない背景は使用せず、動画ごとに新規制作します。共通の「動き・図解のテンプレート」は `shared/remotion-templates/` に引き続き存在し、画像パーツとは別の仕組みです。

## 1. 現行の照合方法：AIベクトル検索・画像認識ではない

`prepare.mjs` 内の `rankAsset` は、`src/script-data.json` の **各beatの narration + visualIntent + phase** と、`catalog.json` 内のパーツ登録情報を比較する規則ベースの日本語**部分文字列一致**です。全角半角のNFKC正規化と小文字化のみ行い、語形変化・類義語・否定・誰が何をするか・画角・実際の画像内容は理解しません。タグと一致しても映像の文脈に合う保証はありません。スコアは確率・CLIP類似度・OpenAIの評価値ではありません。

硬い除外条件:
- 登録した `phases` にシーンの `phase` が含まれること。
- `avoid` に含まれる語がナレーション・画作り意図に現れないこと。
- `mustMentionAny` に登録された、対象物を直接表す語が少なくとも一つ現れること。
- `tags` から **2語以上** が部分文字列として見つかること（ただし重複/同義語を別概念として数える限界がある）。
- 下記のスコアが `catalog.threshold`（現在0.88）以上であること。

現行スコアは `min(1, 0.16 + 0.145×min(タグ一致数,3) + 0.25×phase一致 + 0.10×作風一致 + 0.09×色調一致)` です。phaseは候補の前提条件なので一致時に加点します。2タグ・phase・作風・色調一致で **0.89**、3タグなら **1.0** です。タグ・閾値・重みは運用上の便宜的な数値であり、**「0.89＝画像として89%合っている」の意味ではありません**。撮影方向・パーツの重複・画面の空き・権利確認は自動判定できません。

## 2. 誤った流用を防ぐ運用

`assetComposition` を未指定または `bespoke` にすると、映像へのパーツ挿入はありません。素材に一致しただけでは採用しません。

`assetComposition: "auto"` は **候補の提案・QAレポートへの登録のみ** 行い、動画には重ねません。候補をコンタクトシート/絵コンテで確認し、「物体が画面内に存在する必要があり、既存sceneに描かれていない」「サイズ・角度・前後関係・字幕との衝突がない」と判断できたbeatだけ `assetComposition: "parts-overlay"` に変更します。これで実際のRemotion背景・人物の上に高マッチのパーツ1点だけを前景として表示します。`parts-overlay` に候補が無い場合はエラーで本番制作を停止し、無関係な素材で代用しません。

`catalog.policy.partMaxScenesPerVideo=9`、`cooldownScenes=3`。同じ`bgGroup`の連続beatでは同じパーツを使えますが、別の`bgGroup`へ移った場合は3beat以内の再使用を制限します。選択されたファイルのSHA256を `src/asset-plan.json` に記録し、採用素材のみ `<episode>/public/assets/library/パーツ/` へコピーします。`qa/asset-report.json` に一致候補・承認数・不足数を出力します。

## 3. 次の動画を作る手順

1. **台本・学術根拠を先に完成**し、歴史、場所、行為、時間経過を具体的なシーンに分割。`narration` / `visualIntent` / `phase` / `bgGroup` を作成します。`visualIntent` は **台本から独立した捏造キーワードを加えない**。
2. `node shared/asset-library/prepare.mjs <動画ディレクトリ>` をVOICEVOX前・Remotionプレビュー前に実行し、候補と採用予定をレビューします。新しい動画のworkflowにこのコマンドを追加し、prepare jobで作ったpublicファイルをrender jobへ引き継ぎます。
3. `assetComposition:"auto"` で一致した候補を `src/asset-plan.json` の `scenes[beat.id].part` で確認。画作りに本当に必要なものだけ `parts-overlay` に変更して選定を再実行。既存Remotionで既に同じ物体を描いているなら **追加せず、その既存の描画を置換・改修する**。
4. 今まで通り、独自背景・人物・前景行動を作り、VOICEVOX実測尺、字幕（映像に焼き込まず別レイヤー）、Remotion、コンタクトシート、本番レンダー、完成MP4のQAを実行。意味と連続性が優先であり、素材再利用率の数値目標は設けません。

### Remotion統合例

```tsx
import assetPlan from './asset-plan.json';
import {PartOverlay, type AssetSelection} from '../../shared/asset-library/remotion';
const selection=(assetPlan.scenes as Record<string,AssetSelection>)[beat.id];
return <AbsoluteFill>
  <SceneVisual n={beatIndex+1} progress={beatProgress}/>
  <PartOverlay selection={selection} progress={beatProgress}/>
  <Subtitle beat={beat} progress={beatProgress}/>
</AbsoluteFill>;
```

既存V69にこの部品を接続してありますが、既存のbeatには`assetComposition`が無いので視覚は従来と同じです。新しい`index.tsx`へ取り込むときは、元の字幕・音声実測タイミングを残してください。動画の性質によってはRemotion内で一からそのパーツを作り、共有素材に依存しないほうが自然です。

## フォルダーに入れるだけで自動登録する（v4）

**背景／パーツを別々に登録します。人物フォルダーは復活させません。** 背景は `shared/asset-library/背景/` へアップロードすると `auto-register-backgrounds.yml` が画像のファイル名を元に名称・キーワードをJSONへ仮登録します。画像内容のAI解析は行わず、背景レコードは `needsVisualReview:true` と `license:pending-review` で保留されます。実際の画像・権利を確認してから採用してください。背景はRemotionのパーツ用オーバーレイとして自動選択されません。

GitHubのパーツフォルダーを開き、Add file → Upload files からSVG / PNG / WebPを直接アップロードしてmainブランチへコミットしてください。アップロードだけで GitHub Actions の「Auto-register uploaded parts」が起動します。1回の実行で新規・変更画像は最大10点、1画像4MB以下です。既存の手動登録素材は上書きしません。

新しい画像があればOpenAIの画像認識で対象物を読み取り、素材ID、画像の説明、関連語、必須語、除外語、作風・色調と標準配置を catalog.json に自動コミットします。SVGはプレビュー用PNGに変換して解析しますが、元ファイル自体は変更しません。画像を差し替えた場合のみ再解析し、登録済みの素材ID・ライセンス確認状態・配置は保持します。未変更画像でAPIを再呼び出ししません。自動登録画像を削除すると、そのマスター登録も削除します。

**初回設定：** GitHubリポジトリの Settings → Secrets and variables → Actions に OPENAI_API_KEY を登録してください。動画制作のために登録済みなら同じものを使います。画像解析APIは従量課金です。GitHub Actionsの設定でリポジトリへの書き込み許可も必要です。mainへのbot pushがブランチ保護で禁止されている場合は管理者側で許可するか、PR経由の運用へ変更してください。キー未設定や画像解析エラーの場合、素材はフォルダーに残りますが JSON は更新せず、Actionsで失敗理由を表示します。キーを設定した後に Actionsから「Run workflow」で再実行できます。PRのコードには秘密鍵を渡しません。

**安全上の区別：JSONへの登録は自動、商用利用の権利確認と映像への採用は別。** AIは画像の出典・利用権を判定できないため、自動登録素材の license は pending-review とし、素材選定からは除外します。アップロードした素材の商用利用権を確認したら catalog.json の該当素材だけ original-project（自作）または cleared-commercial（商用許諾確認済み）へ変更してください。この確認後も実際の場面への合致・重複・レイアウトを目視して parts-overlay を明示指定するまで動画には重ねません。

画像の外部参照・スクリプト等を含むSVG、フォルダー内の別のサブフォルダー、不正拡張子は拒否します。自動分析が不正なキーワードを返した場合、一部だけ登録せず処理を失敗させます。API使用料を抑えるため同時に10点までに制限しています。手元でのモックテスト: node shared/asset-library/test-register.mjs


## 4. 新しいパーツを登録するとき

`パーツ/` に文字・透かし・背景の無い透過SVG/PNG/WebPを格納すると、Actionsが `catalog.json` に自動登録します。手作業で登録する場合は、ID / 相対ファイル / `phases` / `mustMentionAny` / `tags` / `avoid` / style / palette / commercial-license / layout / motionを追加。`layout` は1920×1080の配置座標なので、動画ごとの構図に合わせて適宜変更・個別指定します。背景は専用の `register-backgrounds.mjs` で自動登録します。人物カテゴリは登録できません。外部由来の素材は商用利用権を確認してください。

```bash
node shared/asset-library/test-assets.mjs
node shared/asset-library/prepare.mjs v69-free-services
cat v69-free-services/qa/asset-report.json
```

**QA通過は素材の画像品質・意味整合性を保証しません。** 審美・意味・連続性・被りを全sceneのコンタクトシートで確認してください。

## 5. 今後の動画制作で使う依頼文

```text
テーマ：「（ここに今回の動画テーマ）」
台本：（このチャットの確定稿または添付の確定台本を使う）

既存の knowledge-video-factory を確認して、現在の制作方式で長尺動画を本番制作してください。
素材ライブラリは shared/asset-library/パーツ/ のみ使用し、背景・人物は今回の
台本・年代・場面・構図に合わせてオリジナルで制作してください。共有パーツは
catalog.json / prepare.mjs の必須語・タグ・phase・除外語・スコアで候補選定し、
採用候補を scene ID / 一致理由 / 既存の描画との重複 / レイアウトとともにレビューしてください。
数値が0.88以上でも意味・時代・実際の画像・配置の不一致があれば必ず不採用。
使用率を上げるために台本や絵コンテを変えないこと。

各beatは assetComposition:"auto" で候補出しし、既存sceneと重複せず、
パーツが意味を直接伝える場面だけ parts-overlay を明示承認して採用。
一致しない箇所は固有sceneを作り、汎用画像・同じ背景の使い回し・
意味のないアイコンの点滅で埋めないでください。
同一背景を連続beatで使うときはカメラと背景を固定し、ナレーションに合わせて
人物の動き・物体の追加/削除・因果の図示を変えること。登場人物は映像内で
時間・場所・衣装・行動の連続性を保つこと。

台本の文ごとに細かくsceneを分け、情景の具体性とアニメーションの密度を優先。
字幕は原文のまま映像と独立レイヤー、VOICEVOXは読みを調整したspeechから生成し
実音声尺に同期。従来のRemotionテンプレート registry と専用sceneを併用し、
事前QA、全sceneプレビュー/コンタクトシート、レンダー、完成MP4の音声・字幕・画質QAまで
実施してください。実装・動作確認後に変更したGitHubコミットと成果物を示してください。
```
