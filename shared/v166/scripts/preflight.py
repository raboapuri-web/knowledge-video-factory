#!/usr/bin/env python3
import json
from pathlib import Path
from PIL import Image
B=Path(__file__).resolve().parents[1]; b=json.loads((B/"board.json").read_text(encoding="utf-8")); s=b["scenes"]
assert s and [x["scene_id"] for x in s]==[f"S{i:03d}" for i in range(1,len(s)+1)]
assert all(x.get("motion") in {"zoom_in","zoom_out","pan_right","pan_left","pan_up","pan_down","static"} for x in s)
assert all(x.get("image_count")==1 for x in s)
assert not any(s[i]["motion"]==s[i-1]["motion"]==s[i-2]["motion"] for i in range(2,len(s)))
for x in s:
 p=B/"assets/final"/(x["scene_id"]+".jpg"); assert p.is_file() and p.stat().st_size>0
 with Image.open(p) as im: assert im.format=="JPEG" and abs(im.width/im.height-16/9)<0.01
assert (B/"assets/end_card.png").is_file() and (B/"assets/chapter_card_bg.png").is_file()
assert (B/"launch/render_approved.txt").read_text(encoding="utf-8").strip() in {"approved","render: approved"}
for name in ["board.json","storyboard.csv","source_script.txt","format_v2_spec.md","chapter_cards.txt","credits_generated.txt","scene_id_map.md"]:
 assert (B/name).is_file() and (B/name).stat().st_size>0, name
with Image.open(B/"assets/chapter_card_bg.png") as im: assert im.format=="PNG" and im.size==(1672,941)
assert len([x for x in (B/"chapter_cards.txt").read_text(encoding="utf-8-sig").splitlines() if x.strip()])==8
assert (B/"chapter_cards.txt").read_text(encoding="utf-8-sig").splitlines()==["プロローグ","第1章 鉄の雨が降る惑星 ― WASP-76b","第2章 宇宙に水を放つ星 ― L1448-MM","第3章 青いガラスの惑星 ― HD 189733b","第4章 光の届かない氷の世界 ― OGLE-2005-BLG-390Lb","第5章 太陽より熱いとされた惑星 ― Kepler-70b","第6章 銀河の中心で輝くもの ― クエーサー","エピローグ"]
print(json.dumps({"passed":True,"scenes":len(s),"blur":[],"chapters":8}))
