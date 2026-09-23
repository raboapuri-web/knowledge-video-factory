# 関節付き・現代男性会社員 2D Remotion テンプレート

この人物は **人物テンプレート/catalog.json** に `character-modern-male-office-worker` として登録済みです。登録情報にはReactコードの場所・使用シーン・タグ・可動関節・動作・使用候補背景を含みます。動画へは自動配置せず、台本に合う場合に明示的に選んでください。


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

## 首と顔の接続（2026-09-23修正）

顎下の透過ギャップをなくすため首の描画矩形を x=-14, y=-30, width=28, height=45 とし、顔の下に重なるようにしました。頭部の回転ヒンジ位置は変えず、手足の関節機構も維持。実際の見た目は `OfficeWorkerNeckCloseup` の拡大静止画で確認できます。


## パーカー姿の少女（関節付きReact人物）

[人物テンプレート/catalog.json](./catalog.json) の `character-hoodie-girl` に登録。実装は `hoodie-girl-rig.tsx`、背景合成は `hoodie-girl-scene.tsx`。肩・肘・股関節・膝の左右、首の傾きと上体の傾きを `pose` で制御できます。標準動作は `idle`/`walk`/`wave`/`point`。衣装・髪色・靴の色も変更可能です。

オフィスの会社員とは独立した別人物です。年齢・衣装・場所の一貫性が必要な場合、無条件の流用は避けてください。歩行は簡易ループで足裏接地IKは未実装です。

```tsx
import {HoodieGirlBackgroundScene} from '../../shared/asset-library/人物テンプレート/hoodie-girl-scene';

export const Room=()=>
  <HoodieGirlBackgroundScene backgroundFile="BG_oneroom.png"
    girl={{x:800,y:190,scale:1,action:'walk',pose:{leftElbow:-35}}}/>;
```

プレビュー準備は `prepare.mjs` の**後**に `node shared/asset-library/人物テンプレート/stage-background.mjs v69-free-services BG_oneroom.png` を実行。Remotion Studioから `HoodieGirlRoomPreview`、首元の確認には `HoodieGirlNeckCloseup` を選びます。


## 少女の追加アクション：座る／立つ／スマホ（2026-09-23）

`HoodieGirlRig` の `action` に `sit`・`standUp`・`sitPhone`・`walkPhone` を追加しました。従来の顔（丸顔・ポニーテール）と `idle`・`walk`・`wave`・`point` は保持しています。

`sit` と `standUp` は約1.1秒の**一方向**遷移です。各動作が始まるフレームを `actionStartFrame` に与えてください。Remotion の `<Sequence>` 内でローカルフレームが0から始まる場合は省略できます。

```tsx
<HoodieGirlRig action="sitPhone" x={1100} y={500} scale={0.84}/>
<HoodieGirlRig action="walkPhone" x={1100} y={500} scale={0.84}/>
<HoodieGirlRig action="sit" actionStartFrame={240}/>
<HoodieGirlRig action="standUp" actionStartFrame={360}/>
```

スマートフォンは**右前腕のローカル座標**に固定し、肩→肘→手首の回転と一緒に移動します。固定座標の端末を「右手付近に表示」する実装ではありません。スマホの下端と親指が重なる描画にしています。簡易椅子は `sit`、`sitPhone`、`standUp` で表示され、動画背景に椅子がある場合 `showChair={false}` で隠せます。正面向きの簡易座位なので、床接地IKや3/4方向の座り姿勢は未実装です。

`HoodieGirlRoomPreview` は480フレーム・30fps（16秒）で、待機→歩行→手振り→指さし→座る→座ってスマホ→立ち上がる→歩きスマホを確認できます。手とスマホの位置は `HoodieGirlPhoneCloseup` でも確認してください。


## パーカー姿の少年（少女版の8動作に対応）

人物ID `character-hoodie-boy` を `人物テンプレート/catalog.json` に登録。実装 `hoodie-boy-rig.tsx`、背景合成 `hoodie-boy-scene.tsx`。少女版の座る／立ち上がる／座ってスマホ／歩きスマホ、および従来4動作の合計8動作を引き継ぎ、**短い無造作ヘア・丸顔・青緑のパーカー**の少年として独立したReact SVGを実装しました。少女テンプレート自体は変更しません。

```tsx
import {HoodieBoyBackgroundScene} from '../../shared/asset-library/人物テンプレート/hoodie-boy-scene';

export const Room=()=>
  <HoodieBoyBackgroundScene backgroundFile="BG_oneroom.png"
    boy={{x:1100,y:500,scale:.84,action:'sitPhone'}}/>;
```

スマホは肩・肘と連動する**右前腕のSVG内**に固定され、手の上に表示されます。2D簡易座位のため自然な斜め座り・床接地IKは未実装。

`prepare.mjs` 実行後に `node shared/asset-library/人物テンプレート/stage-background.mjs v69-free-services BG_oneroom.png` で背景を動画publicにコピー。Remotion Studioでは `HoodieBoyRoomPreview`（16秒）、`HoodieBoyFaceCloseup`、`HoodieBoyPhoneCloseup` を確認できます。


## 現代の女性会社員（関節付き2D React）

`character-modern-female-office-worker` は男性会社員と同じ肩・肘・股関節・膝・頭・上体を動かせる別のReact SVGです。女性向けのボブヘア・柔らかな成人の顔・ジャケット・ブラウス・パンツスーツと4動作（待機・歩行・手振り・指さし）に対応します。コードは `office-woman-rig.tsx`、背景合成は `office-woman-scene.tsx`。

```tsx
import {OfficeWomanBackgroundScene} from '../../shared/asset-library/人物テンプレート/office-woman-scene';
export const Office=()=>
  <OfficeWomanBackgroundScene backgroundFile="BG_office.png"
    woman={{x:780,y:180,scale:1,action:'walk',showBriefcase:true}}/>;
```

背景ファイルはRemotionのpublicへステージングが必要です。V69のプレビューCompositionは `OfficeWomanOfficePreview`（8秒）と `OfficeWomanFaceCloseup` です。男性版には手を加えません。簡易2D歩行のため足裏接地IKは未実装です。


### 女性会社員の首元・ワイシャツ修正（2026-09-23）

頭部の回転中心をy=198まで下げ、短い首が顎と白いワイシャツの襟元につながるよう調整。白いシャツ前面の底辺を平らにして矢印状のV字シルエットを廃止。襟を小さく、前立てとボタンだけにし、胸元のハートやリボンは使用しません。


## PASSERBY：男女5人の匿名通行人（React SVG）

`PASSERBY.tsx` / 登録ID `character-passerby-crowd`。男女混合5人（男性3人・女性2人）の顔なしシルエット。全員の**目・口・鼻を描画しません**。服装・髪型・色を変えた5体の関節付きSVGで、`idle`（正面）・`walk`（歩く）・`photoFlash`（スマートフォンで撮影し、瞬間フラッシュ）の3動作に対応します。撮影時は**5人全員**が左腕をまっすぐ下ろし、右腕を内向きのV字に曲げて各自のスマホを持ち、同時に瞬間フラッシュを発光します。スマホはそれぞれの右前腕・手首の可動階層内にあり、腕とともに動きます。

```tsx
import {PASSERBYScene} from '../../shared/asset-library/人物テンプレート/passerby-scene';
export const City=()=>
  <PASSERBYScene backgroundFile="BG_town.png" crowd={{action:'photoFlash',photoStartFrame:0}}/>;
```

背景を使う前に `node shared/asset-library/人物テンプレート/stage-background.mjs v69-free-services BG_town.png` を実行してください。プレビューは独立した `PASSERBYTownPreview`（9秒、正面→歩行→全員で同時撮影）。撮影パートはフレーム202と247付近で5台のスマホから短時間発光します。撮影アクション開始フレームを `photoStartFrame` に渡してください。
