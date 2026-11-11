# 権利ゲート付き画像収集器（考える夜・新方式用）

チャット（ChatGPT）に88画面分の収集・監査を抱えさせる方式の代替。
画面ごとに独立処理し、正本はチャットの要約ではなく `manifest.json`。
数はすべてマニフェストからプログラムが数える（83≠88 のような数え間違いが起きない）。

## 方式（fail-closed）

1. 候補検索：Wikimedia Commons API / Openverse API（ライセンス情報が構造化データで取れる先だけ）
   - Openverse は検索時点で `license=by,cc0,pdm` に事前絞り込み
   - Openverse の匿名リクエストは page_size 上限20（コード側でクランプ済み）
2. 権利ゲート（ダウンロード前）：PD / CC0 / CC BY（クレジットで可）だけ通す
   - NC / ND / SA（デフォルト）/ All rights reserved / fair use / 不明・無記載は自動却下
   - CC 系はライセンスURL必須、出典ページ必須。欠けたら却下
   - 機関名での一括OKはしない（NOAA 等でもアイテム単位で判定）
3. 基本ゲート：画像形式（PDF・文書は不可）、最小サイズ、実寸の再検証、sha256 重複排除
4. 適合ゲート（任意・`--vision`）：OpenAI API で被写体一致／文字・ロゴ焼き込み／
   論文・本のページ混入を判定。`OPENAI_API_KEY` が無い場合は
   `rights_ok_vision_pending` 止まりで、「cleared」とは数えない
5. 出力：`manifest.json`（権利証拠つき）/ `audit.json`（却下理由つき全候補）/
   `credits.txt`（概要欄用）/ `contact_sheet.jpg`（画面番号＋ステータス）
   - 全画面が cleared になるまでは動画工程に入らない。人間の目視OKゲートは従来通り

## 使い方

```bash
# screens.json: [{"id":"S032","query":"giant isopod","subject":"a giant isopod on the deep sea floor"}, ...]
python3 collector.py --screens screens.json --out out_dir
# 本番デフォルト: 最小 1920x1080、候補は画面あたり20件まで、ダウンロード試行は画面あたり5回まで
# 429 が出たホストはその実行中はそれ以上叩かない（audit に skipped_rate_limited として残る）

# API適合判定つき（従量課金は 2026-11-11 に承認済み）
OPENAI_API_KEY=... python3 collector.py --screens screens.json --out out_dir --vision

# 中断後の再開（収集済み画面はスキップ）
python3 collector.py --screens screens.json --out out_dir --resume
```

## GitHub Actions での実行

リポジトリ `knowledge-video-factory` にこのフォルダを入れ、Secret `OPENAI_API_KEY`
（登録済み）を使うワークフローから `collector.py` を呼ぶ。成果物（manifest / audit /
credits / contact_sheet / images）を artifact として保存し、コンタクトシートを
人間が確認してから chapter / finalize に進む。

## テスト結果（2026-11-11）

- 権利ゲート単体テスト：11/11 通過（PD/CC0/CC BY 通過、SA/NC/ND/不明 却下、CC BY の URL 欠け却下）
- Commons ライブ検索：候補の権利判定は動作（CC BY 4.0 等を通過、CC BY-SA・NC を大量に却下）。
  ただし upload.wikimedia.org から 429 が返ったため、その実行ではダウンロードは打ち切り、
  ホスト単位で停止する処理を追加した。Actions 環境（別IP・低頻度）での本番確認が残る
- Openverse ライブ収集（サイズ閾値を検証用に 1024x576 へ緩めた run）：3画面中2画面が
  権利＋基本ゲートを通過してダウンロード成功（いずれも NOAA Photo Library / CC BY 2.0）、
  manifest / credits / contact_sheet の生成まで確認。残り1画面は重複候補のみで missing
- 注意：Openverse の画像は 1024px 級が多く、本番閾値 1920x1080 では大半が落ちる。
  高解像度の本命は Commons で、Openverse は補助と位置づける

## v2 (2026-11-11、Run 42960388082 の監査を受けて改修)

Run1（対象40画面）は 0/40。成果物 audit.json を解凍して集計した内訳：Commons検索API自体の429が10画面、CC BY 2.0で権利通過後にダウンロード429が1件、CC BY-SA却下が1件、残り28画面は候補ゼロ（長いAND検索でヒットなし＋検索結果が監査に残らない設計だった）。

v2の変更（権利ゲートの判定は不変、単体テスト11/11再通過）：
- 全HTTP取得にペーシング（--pace、既定1秒）と429/503リトライ（--retries 既定3、Retry-After尊重＋指数バックオフ）を導入。429でもホスト全体を止めない
- 検索クエリの段階的緩和（全語→先頭4語→先頭2語）と、検索結果（found件数・使用クエリ・エラー）の監査記録
- 画面ごとの却下理由サマリを標準出力に出す（Actionsログで理由が読める）

ローカルスモークテスト（Commons、1画面、サイズ閾値は緩和条件）：緩和クエリで20件ヒット→SA却下2件→ダウンロード429を候補単位で回避→CC BY 4.0を1件取得成功。
