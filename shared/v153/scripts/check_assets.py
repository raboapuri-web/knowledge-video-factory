#!/usr/bin/env python3
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
board=json.loads((ROOT/"content/board.json").read_text(encoding="utf-8"))
manifest=json.loads((ROOT/"assets/asset_manifest.json").read_text(encoding="utf-8"))
collected={x["scene"] for x in manifest.get("collected",[])}
missing=[s["id"] for s in board["scenes"] if s["mode"]=="収集" and s["id"] not in collected]
generated=[s["id"] for s in board["scenes"] if s["mode"]=="生成"]
generated_missing=[sid for sid in generated if not (ROOT/"assets/generated"/(sid+".png")).is_file()]
warnings=manifest.get("composition_warnings",[])
report={"passed":not missing and not generated_missing and not warnings,
        "required":{"collected":78,"generated":10},"actual":{"collected":len(collected),"generated":len(generated)-len(generated_missing)},
        "missing_collection_scenes":missing,"missing_generated_scenes":generated_missing,
        "composition_warnings":warnings,"rights_skipped":manifest.get("rights_skipped",[])}
(ROOT/"assets/asset_gate.json").write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding="utf-8")
print(json.dumps(report,ensure_ascii=False,indent=2))
if not report["passed"]: raise SystemExit("Asset gate failed: missing source assets or incomplete specified collages. No generated animal-photo substitutions will be made.")
