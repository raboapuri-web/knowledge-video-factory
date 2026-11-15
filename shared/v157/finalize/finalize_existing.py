#!/usr/bin/env python3
"""Finalize V157 using already validated eight chapter artifacts; do not resynthesize."""
import base64, importlib.util
from pathlib import Path
from PIL import Image, ImageDraw, ImageOps, ImageFont

HERE=Path(__file__).resolve().parent
ROOT=HERE.parent
SOURCE=ROOT/"render/render.py"
spec=importlib.util.spec_from_file_location("v157_render",SOURCE)
v=importlib.util.module_from_spec(spec)
spec.loader.exec_module(v)

raw=base64.b64decode((ROOT/"render/moon_character_reference.b64").read_text().strip())
ref=ROOT/"render/moon_character_reference.jpg"
ref.write_bytes(raw)
with Image.open(ref) as img:
    img.verify()
print("MOON_REFERENCE_OK",len(raw),"bytes")

original_card=v.card_background
def final_card(dest,end=False):
    if not end:return original_card(dest,end)
    W,H=1920,1080
    base=Image.new("RGB",(W,H),(7,10,19))
    d=ImageDraw.Draw(base)
    for y in range(H):
        shade=y/H
        d.line((0,y,W,y),fill=(int(8+5*shade),int(11+5*shade),int(20+7*shade)))
    # The original book-reading crescent is given its own placement, clear of
    # YouTube's upper-right subscribe circle and both lower 16:9 video windows.
    moon=Image.open(ref).convert("RGB")
    moon=ImageOps.fit(moon,(300,300),method=Image.Resampling.LANCZOS)
    mask=Image.new("L",(300,300),0)
    ImageDraw.Draw(mask).ellipse((2,2,297,297),fill=255)
    place=(1140,110)
    base.paste(moon,place,mask)
    d.ellipse((1137,107,1443,413),outline=(206,174,104),width=5)
    serif=v.newfont(87)
    caption=v.newfont(49)
    d.text((110,140),"考える夜",font=serif,fill=(219,195,134))
    d.text((110,317),"今夜も、当たり前がひとつ減りました。",font=caption,fill=(225,213,181))
    d.line((98,470,1820,470),fill=(130,105,62),width=2)
    # Two selectable 16:9 videos: 800 x 450 px each; 1600x900 bounds.
    for x in (90,1030):
        d.rounded_rectangle((x,570,x+800,1020),radius=12,outline=(186,151,85),width=4)
    # Upper-right subscribe location remains clear.
    d.ellipse((1560,110,1790,340),outline=(201,163,92),width=6)
    dest.parent.mkdir(parents=True,exist_ok=True)
    base.save(dest)
v.card_background=final_card
v.finalize()
