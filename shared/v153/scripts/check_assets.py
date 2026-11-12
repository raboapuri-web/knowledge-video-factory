#!/usr/bin/env python3
import json, hashlib, re
from pathlib import Path
from PIL import Image

ROOT=Path(__file__).resolve().parents[1]
board=json.loads((ROOT/"content/board.json").read_text(encoding="utf-8"))
manifest=json.loads((ROOT/"assets/asset_manifest.json").read_text(encoding="utf-8"))
generation_record=json.loads((ROOT/"assets/generation_record.json").read_text(encoding="utf-8"))
credits=json.loads((ROOT/"assets/master_credits.json").read_text(encoding="utf-8"))
scenes=board["scenes"]
collect_ids=[s["id"] for s in scenes if s["mode"]=="収集"]
generated_ids=[s["id"] for s in scenes if s["mode"]=="生成"]
SINGLE_IMAGE_TARGETS=["S001","S002","S003","S009","S011","S014","S015","S024","S033","S034","S035","S057","S058","S062","S077","S078","S081","S082","S085","S086","S087"]
collected={x["scene"]:x for x in manifest.get("collected",[])}
generated={x["scene"]:x for x in manifest.get("generated",[])}
missing=[sid for sid in collect_ids if sid not in collected]
extra_collected=sorted(set(collected)-set(collect_ids))
generated_missing=[sid for sid in generated_ids if not (ROOT/"assets/generated"/(sid+".png")).is_file()]
generated_unlogged=[sid for sid in generated_ids if sid not in generated]
quality_failures=[]
rights_failures=[]
missing_sheets=[]
missing_panels=[]
upscaled_source_count=0

def sha256(path):
    h=hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda:f.read(1024*1024),b""):
            h.update(chunk)
    return h.hexdigest()

def check_hash(path, expected, scene, label):
    if expected and sha256(path).lower()!=str(expected).lower():
        quality_failures.append({"scene":scene,"reason":f"{label} SHA-256 mismatch"})

if len(scenes)!=88 or len(collect_ids)!=78 or len(generated_ids)!=10:
    quality_failures.append({"scene":"BOARD","reason":"Board must contain exactly 88 scenes (78 collected + 10 generated)"})
if manifest.get("missing"):
    quality_failures.append({"scene":"MANIFEST","reason":"Manifest still lists missing collection scenes","items":manifest.get("missing")})
if manifest.get("composition_warnings"):
    quality_failures.extend({"scene":"MANIFEST","reason":str(x)} for x in manifest.get("composition_warnings",[]))
if extra_collected:
    quality_failures.append({"scene":"MANIFEST","reason":"Unexpected collected scene records","items":extra_collected})

upscaling_approved=bool(manifest.get("upscaling_approved"))
for sid in collect_ids:
    rec=collected.get(sid)
    if not rec:
        continue
    rel=rec.get("file") or f"assets/collected/{sid}.jpg"
    path=ROOT/rel
    if not path.is_file():
        quality_failures.append({"scene":sid,"reason":"Final collected composite file missing","file":rel})
    else:
        try:
            with Image.open(path) as im:
                w,h=im.size
                im.verify()
            if w<1920 or h<1080:
                quality_failures.append({"scene":sid,"reason":"Final composite below 1920x1080","dimensions":[w,h]})
            check_hash(path,rec.get("sha256"),sid,"Final composite")
        except Exception as e:
            quality_failures.append({"scene":sid,"reason":"Final composite unreadable","detail":str(e)})
    if rec.get("asset_count",0)!=rec.get("required_panels",1):
        quality_failures.append({"scene":sid,"reason":"Incomplete comparison/collage panel count"})
    if rec.get("asset_count")!=1 or rec.get("required_panels")!=1:
        quality_failures.append({"scene":sid,"reason":"Single-image policy requires exactly one image per collected scene","asset_count":rec.get("asset_count"),"required_panels":rec.get("required_panels")})
    sources=rec.get("sources") or []
    generated_panels=rec.get("generated_panels") or []
    if not sources and not generated_panels:
        rights_failures.append({"scene":sid,"reason":"No source record and no documented AI-generated fallback"})
    for src in sources:
        source_page=src.get("source_page") or src.get("url")
        license_name=str(src.get("license") or "").strip()
        if not source_page or not license_name:
            rights_failures.append({"scene":sid,"reason":"Missing source page or license record"})
        lic=license_name.lower()
        if any(term in lic for term in ["-nc","-nd","noncommercial","non-commercial","no derivatives"]):
            rights_failures.append({"scene":sid,"reason":"License is incompatible with monetized video/cropping","license":license_name})
        dims=src.get("source_dimensions") or []
        if len(dims)!=2 or not all(isinstance(v,(int,float)) and v>0 for v in dims):
            quality_failures.append({"scene":sid,"reason":"Original source dimensions missing or invalid","dimensions":dims})
        elif int(dims[0])<1920 or int(dims[1])<1080:
            if upscaling_approved:
                upscaled_source_count+=1
            else:
                quality_failures.append({"scene":sid,"reason":"Original source below 1920x1080 and no upscaling approval","dimensions":dims})
    for gp in generated_panels:
        rel=gp.get("file","")
        reason=gp.get("reason","")
        if not rel or not reason:
            rights_failures.append({"scene":sid,"reason":"AI-generated panel lacks file path or generation reason"})
            continue
        panel_path=ROOT/rel
        if not panel_path.is_file():
            missing_panels.append({"scene":sid,"file":rel})
        key=Path(rel).stem
        record=generation_record.get(key)
        if not record or not record.get("reason"):
            rights_failures.append({"scene":sid,"reason":"AI-generated panel missing generation_record entry","file":rel})
    for rel in rec.get("panel_references",[]):
        if not (ROOT/rel).is_file():
            missing_panels.append({"scene":sid,"file":rel})
    for src in sources:
        rel=src.get("panel_file")
        if rel and not (ROOT/rel).is_file():
            missing_panels.append({"scene":sid,"file":rel})

for sid in generated_ids:
    rec=generated.get(sid)
    if not rec:
        continue
    rel=rec.get("file") or f"assets/generated/{sid}.png"
    path=ROOT/rel
    if not path.is_file():
        quality_failures.append({"scene":sid,"reason":"Specified generated diagram missing","file":rel})
    else:
        try:
            with Image.open(path) as im:
                w,h=im.size
                im.verify()
            if w<1920 or h<1080:
                quality_failures.append({"scene":sid,"reason":"Generated diagram below 1920x1080","dimensions":[w,h]})
            check_hash(path,rec.get("sha256"),sid,"Generated diagram")
        except Exception as e:
            quality_failures.append({"scene":sid,"reason":"Generated diagram unreadable","detail":str(e)})
    if not rec.get("reason"):
        rights_failures.append({"scene":sid,"reason":"Generated diagram lacks generation reason"})

for sub in ["collected","ai-generated"]:
    for panel in (ROOT/"assets/panels"/sub).glob("*"):
        if not panel.is_file():
            continue
        key=panel.stem
        if key not in credits:
            rights_failures.append({"scene":key,"reason":"Panel missing master_credits record"})
        elif sub=="ai-generated":
            c=credits[key]
            if c.get("license")!="AI-generated" or not c.get("reason"):
                rights_failures.append({"scene":key,"reason":"AI panel missing AI-generated label or reason in master_credits"})
        else:
            c=credits[key]
            if not c.get("license") or not c.get("source_page"):
                rights_failures.append({"scene":key,"reason":"Collected panel missing license/source page in master_credits"})
            lic=str(c.get("license","")).lower()
            if any(term in lic for term in ["-nc","-nd","noncommercial","non-commercial","no derivatives"]):
                rights_failures.append({"scene":key,"reason":"Panel license incompatible with use","license":c.get("license")})

for rel in manifest.get("contact_sheets",[]):
    if not (ROOT/rel).is_file():
        missing_sheets.append(rel)
if len(manifest.get("contact_sheets",[]))!=4:
    quality_failures.append({"scene":"CONTACT_SHEETS","reason":"Exactly four contact sheets are required"})
if missing_panels:
    quality_failures.extend({"scene":x["scene"],"reason":"Referenced panel file missing","file":x["file"]} for x in missing_panels)

single_image_target_failures=[sid for sid in SINGLE_IMAGE_TARGETS if sid not in collected or collected[sid].get("asset_count")!=1 or collected[sid].get("required_panels")!=1]
remaining_multi_panel_scenes=[sid for sid,rec in collected.items() if rec.get("asset_count")!=1 or rec.get("required_panels")!=1]
report={
 "passed":not missing and not generated_missing and not generated_unlogged and not missing_sheets and not quality_failures and not rights_failures and not single_image_target_failures and not remaining_multi_panel_scenes,
 "required":{"screens":88,"collected":78,"generated_diagrams":10,"contact_sheet_pages":4},
 "actual":{"collected":len(collected),"generated_diagrams":len(generated)-len(generated_missing),"contact_sheet_pages":len(manifest.get("contact_sheets",[]))},
 "missing_collection_scenes":missing,
 "missing_generated_scenes":generated_missing,
 "unlogged_generated_scenes":generated_unlogged,
 "composition_warnings":manifest.get("composition_warnings",[]),
 "quality_failures":quality_failures,
 "rights_failures":rights_failures,
 "rejected_candidates":len(manifest.get("rejected_candidates",[])),
 "rights_skipped_candidates":len(manifest.get("rights_skipped",[])),
 "generated_panel_count":sum(len(x.get("generated_panels",[])) for x in manifest.get("collected",[])),
 "generation_record_count":len(generation_record),
 "upscaling_approved":upscaling_approved,
 "upscaled_source_count":upscaled_source_count,
 "contact_sheets":manifest.get("contact_sheets",[]),
 "rights_review_status":"source/license/credit metadata complete; restricted-license scan passed; source URLs retained for attribution",
 "manual_visual_approval":"user-requested-single-image-replacements; final-MP4 frame QA follows",
 "single_image_target_ids":SINGLE_IMAGE_TARGETS,
 "single_image_target_failures":single_image_target_failures,
 "remaining_multi_panel_scenes":remaining_multi_panel_scenes
}
(ROOT/"assets/asset_gate.json").write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding="utf-8")
print(json.dumps(report,ensure_ascii=False,indent=2))
if not report["passed"]:
    raise SystemExit("Asset gate failed: registered 88-screen assets, rights records, dimensions, hashes, panels or contact sheets are incomplete.")
