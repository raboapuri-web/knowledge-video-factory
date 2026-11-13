# V154「池の水」確定素材マニフェスト（2026-11-13 ゲート通過）

全90画面の確定素材は assets/final/S001.jpg 〜 S090.jpg。画面割り board.json の各画面にはこのファイルを使うこと。
内訳：写真18画面／生成72画面（生成はすべて Muse が新規生成し目視確認済み。ChatGPT生成のSVG36枚と S012/S015 の出所不明画像は不採用）。

## レイアウト注意
- S018, S028, S032, S057（写真）は小さい/縦型のため、そのまま敷かず「同じ画像をぼかして背景に敷き、中央にシャープな本体を置く」見せ方で処理すること。他の画面で画面に敷けない場合も同方式。
- S090は差し替え済みの2048×1152横長画像のため、通常の全画面表示とし、ぼかし背景処理は行わない。
- S009（生成）には白い縁が入っている。そのまま使用可。
- S048, S050（生成）には日本語風の看板が含まれるが装飾扱いで可。
- 字幕帯は画面最下部 約130px。重要な被写体はそこに置かない（生成済み画像はその前提で作られている）。

## 音声注意
- S001 は board.json の tts_reading_watch 対象。台本本文は変更せず、音声生成時に読み側で対処すること。

## 写真クレジット（概要欄用・18画面）
- S003: See shared/v154/assets/collected/credits.txt (CC BY 2.0, via Openverse)
- S006: Kenrokuen Garden by dalecruse, CC BY 2.0, via https://www.flickr.com/photos/91873384@N04/54261210452
- S007: File:Underwater-photography-pond-plants-1529207.jpg by Reto Gerber, CC0, via https://commons.wikimedia.org/wiki/File:Underwater-photography-pond-plants-1529207.jpg
- S010: Person watches TV while holding a remote control by Shixart1985, CC BY 2.0, via Wikimedia Commons
- S014: File:Capture de juvéniles de bars à la senne de plage à l'Aber Crozon (Ifremer 00936-104837 - 54364).jpg by Stephane Lesbats (IFREMER, Pôle Images, Centre Bretagne - ZI de la Pointe du Diable - CS 10070 - 29280 Plouzané, France), CC BY 4.0, via https://commons.wikimedia.org/wiki/File:Capture_de_juv%C3%A9niles_de_bars_%C3%A0_la_senne_de_plage_%C3%A0_l%27Aber_Crozon_(Ifremer_00936-104837_-_54364).jpg
- S016: File:California Drought Dry Lakebed 2009.jpg by National Oceanic and Atmospheric Administration, Public Domain, via https://commons.wikimedia.org/wiki/File:California_Drought_Dry_Lakebed_2009.jpg
- S018: File:Date Seed sprouting-002.jpg by Amada44, Public Domain, via https://commons.wikimedia.org/wiki/File:Date_Seed_sprouting-002.jpg
- S021: File:Inokashira Park @ Kichijoji (9434339262).jpg by Guilhem Vellut from Annecy, France, CC BY 2.0, via https://commons.wikimedia.org/wiki/File:Inokashira_Park_@_Kichijoji_(9434339262).jpg
- S022: File:Tokyo 1945-3-10-1.jpg by 米軍撮影, Public Domain, via https://commons.wikimedia.org/wiki/File:Tokyo_1945-3-10-1.jpg
- S024: Volunteers clean up Trinity River by David Byers / BLM California, Public domain, via Wikimedia Commons
- S028: File:Closeup of Seed Germination Test - Photo by USFS Region 5.jpg by USFS Region 5, CC BY 2.0, via https://commons.wikimedia.org/wiki/File:Closeup_of_Seed_Germination_Test_-_Photo_by_USFS_Region_5.jpg
- S032: Parent with three chicks - Little grebe, Tachybaptus ruficollis, Smådopping by blondinrikard, CC BY 2.0, via https://www.flickr.com/photos/44093058@N06/51293176822
- S037: File:Procambarus clarkii. White-clawed Crayfish (32290492333).jpg by gailhampshire from Cradley, Malvern, U.K, CC BY 2.0, via https://commons.wikimedia.org/wiki/File:Procambarus_clarkii._White-clawed_Crayfish_(32290492333).jpg
- S043: File:June 4, Analyzing water quality right at the source (4682438355).jpg by USEPA Environmental-Protection-Agency, Public Domain, via https://commons.wikimedia.org/wiki/File:June_4,_Analyzing_water_quality_right_at_the_source_(4682438355).jpg
- S053: File:Healthy Habitats (5716174475).jpg by USFWSmidwest, Public Domain, via https://commons.wikimedia.org/wiki/File:Healthy_Habitats_(5716174475).jpg
- S057: Fishing nets, Essaouira, Morocco by Dimitry B, CC BY 2.0, via https://www.flickr.com/photos/61533954@N00/13485216763
- S063: カダヤシ, カダヤシ（タップミンノー）, alevin, barkaleci, dai to ue, gambouse, gambuse, gambusia, gambusie, gambusino, gambuzia, gambuzia pospolita, gambuzie, gambuzija, guayacón mosquito, gupi, harilik gambuusia, mosquitofish, mosquito fish, western mosquitofish by Samuel Brown, CC BY 4.0, via https://www.inaturalist.org/photos/32903829
- S090: Replacement image (moonlit Japanese pond, 2048×1152) supplied in commit 81e5460. Source/author/license metadata was not included in the replacement handoff.

## 進行許可
素材ゲートは本人の目視OKを取得済み（2026-11-13）。chapter/finalize の動画工程に進んでよい。完成したら Release に上げて報告すること。BGM は付けない（Muse が後処理する）。
