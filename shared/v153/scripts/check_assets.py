#!/usr/bin/env python3
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
board=json.loads((ROOT/"content/board.json").read_text(encoding="utf-8"))
manifest=json.loads((ROOT/"assets/asset_manifest.json").read_text(encoding="utf-8"))
collected={x["scene"]:x for x in manifest.get("collected",[])}
missing=[s["id"] for s in board["scenes"] if s["mode"]=="収集" and s["id"] not in collected]
generated=[s["id"] for s in board["scenes"] if s["mode"]=="生成"]
generated_missing=[sid for sid in generated if not (ROOT/"assets/generated"/(sid+".png")).is_file()]
generated_records={x["scene"]:x for x in manifest.get("generated",[])}
generated_unlogged=[sid for sid in generated if sid not in generated_records]
quality_failures=[]
rights_failures=[]
for sid,rec in collected.items():
    if rec.get("asset_count",0)!=rec.get("required_panels",1):
        quality_failures.append({"scene":sid,"reason":"Incomplete comparison/collage panel count"})
    if not rec.get("sources"):
        rights_failures.append({"scene":sid,"reason":"No source record"})
    for src in rec.get("sources",[]):
        if not src.get("source_page") or not src.get("license"):
            rights_failures.append({"scene":sid,"reason":"Missing source page or license record"})
        dims=src.get("source_dimensions") or []
        if len(dims)!=2 or int(dims[0])<1920 or int(dims[1])<1080:
            quality_failures.append({"scene":sid,"reason":"Original source image/video below 1920x1080 or dimensions not verified","dimensions":dims})
        if src.get("kind")=="pdf" and not src.get("license"):
            rights_failures.append({"scene":sid,"reason":"PDF figure lacks license record"})
warnings=manifest.get("composition_warnings",[])
contact_sheets=manifest.get("contact_sheets",[])
missing_sheets=[p for p in contact_sheets if not (ROOT/p).is_file()]
replacement_log=ROOT/"assets/replacement_log.json"
if replacement_log.exists():
    audit=json.loads(replacement_log.read_text(encoding="utf-8"))
    replacement_count=len(audit.get("replacements",[]))
else:
    replacement_count=0
report={
 "passed":not missing and not generated_missing and not generated_unlogged and not warnings and not quality_failures and not rights_failures and len(contact_sheets)==4 and not missing_sheets,
 "required":{"screens":88,"collected":78,"generated_diagrams":10,"contact_sheet_pages":4},
 "actual":{"collected":len(collected),"generated_diagrams":len(generated)-len(generated_missing),"contact_sheet_pages":len(contact_sheets)},
 "missing_collection_scenes":missing,
 "missing_generated_scenes":generated_missing,
 "unlogged_generated_scenes":generated_unlogged,
 "composition_warnings":warnings,
 "quality_failures":quality_failures,
 "rights_failures":rights_failures,
 "rejected_candidates":len(manifest.get("rejected_candidates",[])),
 "rights_skipped_candidates":len(manifest.get("rights_skipped",[])),
 "visually_rejected_previous_screens":replacement_count,
 "contact_sheets":contact_sheets,
 "manual_visual_approval":"PENDING"
}
(ROOT/"assets/asset_gate.json").write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding="utf-8")
print(json.dumps(report,ensure_ascii=False,indent=2))
if not report["passed"]:
    raise SystemExit("Asset gate failed: 88-screen rights/fit/resolution/contact-sheet checks are incomplete. Chapter/finalize remain blocked.")
