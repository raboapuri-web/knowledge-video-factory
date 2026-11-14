#!/usr/bin/env python3
"""V155 preflight: verify all 88 stills, rights records, chapter cards, endcard and motion map."""
import json, hashlib
from pathlib import Path
from PIL import Image

ROOT=Path(__file__).resolve().parents[1]
BOARD=json.loads((ROOT/"content/board.json").read_text(encoding="utf-8"))
ASSETS=ROOT/"assets"/"final"
EXPECTED=[f"S{i:03d}" for i in range(1,89)]
ALLOWED={"zoom_in","zoom_out","pan_right","pan_left","pan_up","pan_down","static"}

def main():
    errors=[]
    scenes=BOARD.get("scenes",[])
    chapters=BOARD.get("chapters",[])
    cards=BOARD.get("chapter_cards",[])
    if [s.get("id") for s in scenes] != EXPECTED:
        errors.append("board must contain S001-S088 in exact order")
    if len(chapters)!=7 or len(cards)!=7:
        errors.append(f"expected 7 chapters and 7 chapter cards; got {len(chapters)}/{len(cards)}")
    covered=[]
    for c in chapters:
        covered.extend(range(int(c["start"]),int(c["end"])+1))
    if covered != list(range(1,89)):
        errors.append("chapter ranges must cover S001-S088 exactly once")
    if any(s.get("image_count")!=1 for s in scenes):
        errors.append("every narration scene must contain exactly one image")
    motions=[s.get("motion") for s in scenes]
    for i,m in enumerate(motions):
        if m not in ALLOWED: errors.append(f"{EXPECTED[i]}: unsupported motion {m}")
    for i in range(2,len(motions)):
        if motions[i]==motions[i-1]==motions[i-2]:
            errors.append(f"three consecutive {motions[i]} at {EXPECTED[i-2]}-{EXPECTED[i]}")
    body="\n".join(s["script"] for s in scenes)
    body_chars=len(body.replace("\n",""))
    if body_chars!=8470: errors.append(f"board body character count must be 8470, got {body_chars}")
    if not (ROOT/"assets"/"endcard_v1.png").is_file():
        errors.append("assets/endcard_v1.png missing")
    else:
        with Image.open(ROOT/"assets"/"endcard_v1.png") as im:
            if im.size!=(1920,1080): errors.append(f"endcard must be 1920x1080, got {im.size}")
    card_spec_path=ROOT/"format_v2"/"config"/"chapter_card_spec.json"
    if not card_spec_path.is_file():
        errors.append("chapter_card_spec.json missing")
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
        manifest_text=""
    else:
        manifest_text=manifest.read_text(encoding="utf-8")
    photo_ids=[s["id"] for s in scenes if s["asset_type"]=="photo"]
    for sid in photo_ids:
        if sid not in manifest_text: errors.append(f"{sid}: photo source record missing from ASSET_MANIFEST.md")
    for sid in photo_ids:
        block=manifest_text.split(sid,1)[1][:800] if sid in manifest_text else ""
        if not any(x in block for x in ("Public Domain","CC0","CC BY")):
            errors.append(f"{sid}: rights must be Public Domain, CC0, or CC BY")
    generated=[s["id"] for s in scenes if s["asset_type"]=="generated"]
    gen_manifest=ROOT/"assets"/"generated_manifest.json"
    if not gen_manifest.is_file():
        errors.append("assets/generated_manifest.json missing")
    else:
        gm=json.loads(gen_manifest.read_text(encoding="utf-8"))
        if sorted(gm.get("scene_ids",[])) != sorted(generated):
            errors.append("generated_manifest scene IDs do not match board")
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
            if fmt!="JPEG": errors.append(f"{sid}: expected JPEG, got {fmt}")
            if size[0]<1280 or size[1]<720: errors.append(f"{sid}: image resolution too small {size}")
            image_records.append({"scene_id":sid,"file":f"assets/final/{sid}.jpg","bytes":p.stat().st_size,"width":size[0],"height":size[1]})
        except Exception as e:
            errors.append(f"{sid}: unreadable image: {e}")
    if len(image_records)!=88: errors.append(f"only {len(image_records)} readable final images")
    if errors:
        print("\n".join(errors)); raise SystemExit(1)
    entries=[]
    for s in scenes:
        m=s["motion"]; p=s["motion_parameters"]
        entries.append({"scene_id":s["id"],"chapter":s["chapter"],"motion":m,
                        "scale_from":p["scale_from"],"scale_to":p["scale_to"],
                        "camera_from":p["camera_from"],"camera_to":p["camera_to"]})
    motion_doc={"schema_version":"2.0","project":BOARD["title"],"scene_count":88,
                "render":{"width":1920,"height":1080,"fps":30,"zoompan_baseline":1.2,"pan_travel_percent":16.7,
                          "interpolation":"continuous per-frame subpixel interpolation; no frame hold"},
                "entries":entries}
    motion_path=ROOT/"format_v2"/"config"/"scene_motion_map.json"
    motion_path.parent.mkdir(parents=True,exist_ok=True)
    motion_path.write_text(json.dumps(motion_doc,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    audit={"passed":True,"title":BOARD["title"],"scene_count":88,"chapter_count":7,"script_characters":body_chars,
           "script_sha256":hashlib.sha256(body.encode("utf-8")).hexdigest(),"images":image_records,
           "photo_scenes":photo_ids,"generated_scenes":generated,"image_source":"assets/final only",
           "rights_policy":"Public Domain / CC0 / CC BY only","render_allowed":True}
    (ROOT/"content"/"audit.json").write_text(json.dumps(audit,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    gate={"passed":True,"render_allowed":True,"required_images":88,"verified_images":88,
          "chapter_cards":7,"endcard":"assets/endcard_v1.png","endcard_duration_sec":20,
          "rights_policy":"Public Domain / CC0 / CC BY only"}
    (ROOT/"assets"/"render_gate.json").write_text(json.dumps(gate,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print(json.dumps({"passed":True,"images":88,"photos":len(photo_ids),"generated":len(generated),"chapters":7},ensure_ascii=False))

if __name__=="__main__": main()
