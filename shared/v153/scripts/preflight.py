#!/usr/bin/env python3
import json, hashlib
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
board=json.loads((ROOT/"content/board.json").read_text(encoding="utf-8"))
scenes=board["scenes"]
counts={}
for s in scenes: counts[s["mode"]]=counts.get(s["mode"],0)+1
errors=[]
if len(scenes)!=88: errors.append(f"scene_count={len(scenes)} (expected 88)")
if counts.get("収集")!=78: errors.append(f"collect_count={counts.get('収集')} (expected 78)")
if counts.get("生成")!=10: errors.append(f"generated_count={counts.get('生成')} (expected 10)")
expected=[f"S{i:03d}" for i in range(1,89)]
actual=[s["id"] for s in scenes]
if actual!=expected: errors.append("scene IDs are missing, duplicated, or out of order")
for s in scenes:
    if not s.get("script"): errors.append(f"{s['id']}: missing source narration")
    if not s.get("image_description"): errors.append(f"{s['id']}: missing image instruction")
    if s["mode"]=="収集" and (not s.get("search_en") or not s.get("sources")):
        errors.append(f"{s['id']}: missing collection query or source")
    if s["mode"]=="生成" and not s.get("generation_prompt"):
        errors.append(f"{s['id']}: missing generation prompt")
script="\n\n".join(s["script"] for s in scenes)
source_hash=hashlib.sha256(script.encode("utf-8")).hexdigest()
audit={
 "passed":not errors,"title":board["title"],"scene_count":len(scenes),
 "counts":counts,"script_characters":len(script),"script_sha256":source_hash,
 "chapters":board["chapters"],"errors":errors,
 "rules":{"narration_source":"scene script blocks copied verbatim from supplied screen design",
          "voice":"VOICEVOX Aoyama Ryusei / speaker 13",
          "frame":"1920x1080 30fps","visuals":"one collected still or specified generated diagram plus subtitles"}
}
(ROOT/"content/audit.json").write_text(json.dumps(audit,ensure_ascii=False,indent=2),encoding="utf-8")
(ROOT/"content/narration_source.txt").write_text(script,encoding="utf-8")
print(json.dumps(audit,ensure_ascii=False,indent=2))
if errors: raise SystemExit(1)
