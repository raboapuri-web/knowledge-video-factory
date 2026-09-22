# 関節付き・現代男性会社員 2D Remotion テンプレート

コード: shared/asset-library/人物テンプレート/office-worker-rig.tsx

外部の人物PNGに依存せず、React SVGの部位を階層化したオリジナルのカートゥーン風男性会社員です。顔・スーツ・ネクタイ・上腕・前腕・手・太もも・すね・靴はSVGパーツ。各関節の子パーツ全体が親の回転に追従するため、肘や膝を回すと手や足先もついてきます。背景透過のため共有のオフィス/電車/自宅背景と合成できます。

## Remotion使用例（1920×1080）

```tsx
import React from 'react';
import {AbsoluteFill,Img,staticFile} from 'remotion';
import {OfficeWorkerRig} from '../../shared/asset-library/人物テンプレート/office-worker-rig';

export const CommuteScene=()=>(
  <AbsoluteFill>
    <Img src={staticFile('my-background.png')}
      style={{position:'absolute',width:'100%',height:'100%',objectFit:'cover'}}/>
    <OfficeWorkerRig x={800} y={200} scale={1} action="walk" walkSpeed={1.15}
      suitColor="#304966" pantsColor="#26394d" talking={false}/>
    {/* 字幕は人物より手前の独立レイヤーへ追加する */}
  </AbsoluteFill>
);
```

x,yはキャラクター画像（360×640）の左上座標。scale=1で360×640px、scale=.7なら252×448px。地面に合わせるには画像高さ640×scaleを考慮してyを調整してください。

## 背景画像と同じライブラリ内で合成する（推奨）

このフォルダーの `scene.tsx` に、背景と可動キャラクターを重ねる `OfficeWorkerBackgroundScene` を用意しました。背景の元画像がGitHubに存在するだけではRemotionの `staticFile()` に渡せないため、**動画側のpublicフォルダーへのコピーが必要**です。動画の素材準備後に、次のコマンドを実行してください。

```bash
node shared/bootstrap/v69-free-services.mjs
node shared/asset-library/prepare.mjs v69-free-services
node shared/asset-library/人物テンプレート/stage-background.mjs v69-free-services BG_office.png
```

`BG_office.png` は登録・承認済みの背景のみコピーできます。候補としては `BG_densha.png`（通勤電車）、`BG_oneroom.png`（ワンルーム）もあります。**使いたい背景を人間が選んで指定する方式**で、台本のキーワードだけから背景を強制選択しません。

```tsx
import React from 'react';
import {OfficeWorkerBackgroundScene} from '../../shared/asset-library/人物テンプレート/scene';

export const Example=()=>(
  <OfficeWorkerBackgroundScene
    backgroundFile="BG_office.png"
    worker={{x:780,y:180,scale:1,action:'walk',showBriefcase:true}}>
    {/* 字幕はここに前景として配置 */}
  </OfficeWorkerBackgroundScene>
);
```

`worker` は `OfficeWorkerRig` の `action`、`pose`、`x`、`y`、`scale` 等のすべての設定をそのまま受け付けます。動画の字幕は `children` として渡すと人物より手前に表示できます。背景は静止したまま人物のポーズ・表情を変えることができます。

V69のプレビュー用Compositionとして `OfficeWorkerOfficePreview`（オフィス背景付き、240フレーム）を追加しました。V69本編の映像やナレーションには変更を加えていません。プレビューを開く前に、上記の背景コピーコマンドを実行してください。

## 動作

idle＝待機と微動、walk＝腕と脚の逆位相・両膝の曲げ、wave＝右肩を上げ肘を振る、point＝右肩から水平に指し示す。talkingは口の開閉。すべてRemotionのuseCurrentFrameとfpsから時間を計算し、動画の何フレーム目でも決定的に描画できます。

## 関節の角度を手動指定

```tsx
<OfficeWorkerRig action="idle" pose={{
  leftShoulder:25, leftElbow:-50, rightShoulder:-85, rightElbow:30,
  leftHip:-8, leftKnee:14, rightHip:5, rightKnee:8,
  headTilt:-5, bodyLean:3
}}/>
```

角度は度（時計回りが正）。0は初期の下向き。poseの指定した関節だけ自動アクションより優先。肩を回すと肘以下も追従し、股関節を回すと膝以下も追従。角度は-165〜165度に制限。床との足裏接地を保証する逆運動学IKは実装しておらず、歩行は簡易2Dループです。

## プレビュー

shared/v69/index.tsx のV69ルートに、V69本編から完全に独立した OfficeWorkerRigPreview Composition（1920×1080、30fps、240f）を追加しています。既存の本編映像・尺・字幕・音声は変更しません。

```bash
node shared/bootstrap/v69-free-services.mjs
node shared/asset-library/prepare.mjs v69-free-services
cd v69-free-services
npm install
npx remotion studio src/index.tsx
# Composition: OfficeWorkerRigPreview
# 0〜59f 待機 / 60〜119f 歩行 / 120〜179f 手振り / 180〜239f 指さし
# 動画プレビューを書き出す場合:
npx remotion render src/index.tsx OfficeWorkerRigPreview out/office-worker-preview.mp4
```

運用: ナレーションに意味がある場所だけ人物を重ね、字幕は上のレイヤーへ。隣接するbgGroupでは背景を静止させaction/poseのみ切替可能。年齢・衣装・人物像・構図が台本と合わないときは専用人物を新規作成してください。汎用の動きのregistryは管理台帳との同期が必要なため今回は変更していません。キャラクター本体は素材ライブラリ内のReactコードとして管理し、旧 `shared/remotion-templates/office-worker-rig.tsx` は既存importを壊さないための再エクスポートのみです。
