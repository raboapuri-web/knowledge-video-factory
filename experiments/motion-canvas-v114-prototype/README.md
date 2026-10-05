# Motion Canvas V114 Prototype

V114「なぜ真面目に働く人ほど仕事が増えるのか？」の冒頭を、RemotionではなくMotion Canvasで再構成する比較実験。

## 目的
- カット数を増やすのではなく、同じ空間の中で状態を連続変化させる。
- 仕事カード、時計、人物移動、信頼ラベル、仕事積載を1シーン内部で動かす。
- 人間の手動Render操作を不要にする。
- VOICEVOX → Motion Canvas → MP4までGitHub Actionsで自動化する。

## 構成
- 9 narration beats
- 1 continuous Motion Canvas scene
- 1920x1080 / 30fps
- 青山龍星 VOICEVOX
- Noto Sans JP bundled through npm
- Motion Canvas 3.17.2
- Headless render via Vite + Puppeteer + Motion Canvas Renderer

## 比較ポイント
1. ナレーションと映像の意味一致
2. 1シーン内のアニメーション密度
3. 同じ背景でも退屈に見えないか
4. レンダリング時間
5. 人間の修正工数
6. 将来テンプレート化しやすいか

Motion Canvas公式は情報系ベクターアニメーションと音声同期を主用途としている一方、公式の完全なCLIレンダラーは現時点で整備途上。そのため、この試作ではEditor UIを自動クリックせずRenderer APIをブラウザ内から直接実行する。
