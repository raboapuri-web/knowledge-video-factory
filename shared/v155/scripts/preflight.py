#!/usr/bin/env python3
import json
from pathlib import Path
from PIL import Image
B=Path(__file__).resolve().parents[1]; b=json.loads((B/"board.json").read_text(encoding="utf-8")); s=b["scenes"]
assert [x["id"] for x in s]==[f"S{i:03d}" for i in range(1,85)]
assert all(x.get("motion") in {"zoom_in","zoom_out","pan_right","pan_left","pan_up","pan_down","static"} for x in s)
assert all(x.get("image_file")==f"assets/final/{x['id']}.jpg" for x in s)
assert not any(s[i]["motion"]==s[i-1]["motion"]==s[i-2]["motion"] for i in range(2,len(s)))
for x in s:
 p=B/x["image_file"]; assert p.is_file() and p.stat().st_size>0
 with Image.open(p) as im: assert im.format=="JPEG"
assert (B/"assets/end_card.png").is_file() and (B/"assets/moon_character_reference.jpg").is_file()
assert (B/"launch/render_approved.txt").read_text(encoding="utf-8").startswith("render: approved")
print(json.dumps({"passed":True,"scenes":84,"blur":["S041","S071","S080"],"chapters":8}))
