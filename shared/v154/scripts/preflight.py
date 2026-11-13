#!/usr/bin/env python3
"""Preflight V154's user-approved final assets and prepare format-v2 motion map."""
import json, hashlib
from pathlib import Path
from PIL import Image

ROOT=Path(__file__).resolve().parents[1]
BOARD=json.loads((ROOT/"content/board.json").read_text(encoding="utf-8"))
ASSETS=ROOT/"assets"/"final"
SPECIAL_BLUR={"S018","S028","S032","S057","S090"}
EXPECTED=[f"S{i:03d}" for i in range(1,91)]
ALLOWED={"zoom_in","zoom_out","pan_right","pan_left","pan_up","pan_down","static"}

def main():
    errors=[]
    scenes=BOARD.get("scenes",[])
    chapters=BOARD.get("chapters",[])
    cards=BOARD.get("chapter_cards",[])
    if [s.get("id") for s in scenes] != EXPECTED:
        errors.append("board must contain S001-S090 in exact order")
    if len(chapters)!=8 or len(cards)!=8:
        errors.append(f"expected 8 chapters and 8 chapter cards; got {len(chapters)}/{len(cards)}")
    if not next((s for s in scenes if s.get("id")=="S001"),{}).get("tts_reading_watch"):
        errors.append("S001 tts_reading_watch flag is missing")
    card_spec_path=ROOT/"format_v2"/"config"/"chapter_card_spec.json"
    if not card_spec_path.is_file():
        errors.append("format_v2/config/chapter_card_spec.json missing")
    else:
        card_spec=json.loads(card_spec_path.read_text(encoding="utf-8"))
        if [x.get("chapter") for x in card_spec.get("cards",[])] != [x.get("id") for x in chapters]:
            errors.append("chapter-card spec does not match board chapter order")
        for x in card_spec.get("cards",[]):
            bg=(ROOT/"format_v2"/x.get("background_file","")).resolve()
            if not bg.is_file(): errors.append(f"missing chapter-card background: {bg}")
        sfx=(ROOT/"format_v2"/card_spec.get("typing",{}).get("sfx_file","")).resolve()
        if not sfx.is_file(): errors.append(f"missing chapter-card typing sound: {sfx}")
    manifest=ASSETS/"ASSET_MANIFEST.md"
    if not manifest.is_file():
        errors.append("assets/final/ASSET_MANIFEST.md missing")
    image_records=[]
    for sid in EXPECTED:
        p=ASSETS/f"{sid}.jpg"
        if not p.is_file() or p.stat().st_size==0:
            errors.append(f"{sid}: final JPG missing or empty")
            continue
        try:
            with Image.open(p) as im:
                fmt=im.format; size=im.size
                im.verify()
            if fmt!="JPEG": errors.append(f"{sid}: file extension JPG but actual format is {fmt}")
            image_records.append({"scene_id":sid,"file":f"assets/final/{sid}.jpg","bytes":p.stat().st_size,"width":size[0],"height":size[1],"blurred_background_layout":sid in SPECIAL_BLUR})
        except Exception as e:
            errors.append(f"{sid}: unreadable image: {e}")
    if len(image_records)!=90:
        errors.append(f"only {len(image_records)} readable final images")
    if any(s.get("image_count")!=1 for s in scenes):
        errors.append("board contains a scene without exactly one image")
    motions=[s.get("motion") for s in scenes]
    for i,m in enumerate(motions):
        if m not in ALLOWED: errors.append(f"{EXPECTED[i]}: unsupported motion {m}")
    for i in range(2,len(motions)):
        if motions[i]==motions[i-1]==motions[i-2]:
            errors.append(f"three consecutive {motions[i]} at {EXPECTED[i-2]}-{EXPECTED[i]}")
    chapter_for={}
    for c in chapters:
        for n in range(int(c["start"]),int(c["end"])+1):
            chapter_for[f"S{n:03d}"]=c["id"]
    entries=[]
    for s in scenes:
        sid=s["id"]; m=s["motion"]
        if m=="zoom_in": z0,z1=1.0,1.2; a=b=[0.5,0.5]
        elif m=="zoom_out": z0,z1=1.2,1.0; a=b=[0.5,0.5]
        elif m=="static": z0,z1=1.0,1.0; a=b=[0.5,0.5]
        else:
            z0=z1=1.2
            pairs={"pan_right":([0,0.5],[1,0.5]),"pan_left":([1,0.5],[0,0.5]),"pan_up":([0.5,1],[0.5,0]),"pan_down":([0.5,0],[0.5,1])}
            a,b=pairs[m]
        entries.append({"scene_id":sid,"chapter":chapter_for.get(sid),"motion":m,"scale_from":z0,"scale_to":z1,"camera_from":a,"camera_to":b})
    if errors:
        print("\n".join(errors))
        raise SystemExit(1)
    motion_doc={"schema_version":"2.0","project":BOARD["title"],"scene_count":90,"render":{"width":1920,"height":1080,"fps":30,"zoompan_baseline":1.2,"pan_travel_percent":16.7},"entries":entries}
    motion_path=ROOT/"format_v2"/"config"/"scene_motion_map.json"
    motion_path.parent.mkdir(parents=True,exist_ok=True)
    motion_path.write_text(json.dumps(motion_doc,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    source="\n\n".join(s["script"] for s in scenes)
    audit={"passed":True,"title":BOARD["title"],"scene_count":90,"chapter_count":8,"script_characters":len(source),"script_sha256":hashlib.sha256(source.encode("utf-8")).hexdigest(),"images":image_records,"blurred_background_scenes":sorted(SPECIAL_BLUR),"image_source":"assets/final only","excluded_sources":["assets/collected","assets/generated"],"user_visual_gate_approval":"Explicitly confirmed by user in chat on 2026-11-13","render_allowed":True}
    (ROOT/"content"/"audit.json").write_text(json.dumps(audit,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    (ROOT/"assets"/"render_gate.json").write_text(json.dumps({"passed":True,"render_allowed":True,"approved_by_user":True,"approval_date":"2026-11-13","approved_asset_directory":"assets/final","required_images":90,"verified_images":len(image_records),"manifest":"assets/final/ASSET_MANIFEST.md","legacy_collector_gate":"preserved separately; not used as the render authorization"},ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print(json.dumps({"passed":True,"images":len(image_records),"scenes":90,"chapters":8,"blurred_background_scenes":sorted(SPECIAL_BLUR),"motion_map":str(motion_path.relative_to(ROOT))},ensure_ascii=False))

if __name__=="__main__": main()
