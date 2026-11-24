#!/usr/bin/env python3
import json
from pathlib import Path
from PIL import Image
B=Path(__file__).resolve().parents[1]; b=json.loads((B/"board.json").read_text(encoding="utf-8")); s=b["scenes"]
assert [x["scene_id"] for x in s]==[f"S{i:03d}" for i in range(1,143)]
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
assert len([x for x in (B/"chapter_cards.txt").read_text(encoding="utf-8-sig").splitlines() if x.strip()])==6
print(json.dumps({"passed":True,"scenes":149,"blur":[],"chapters":6}))
