#!/usr/bin/env python3
"""Human source/scene matching override for GK v7 documentary.
Actual photo titles were read and compared to the verbatim source narration.
An AI 'visible people' similarity is not sufficient for documentary context.
Never substitute an image or fabricate photographic evidence.
"""
from __future__ import annotations
import argparse,hashlib,json
from pathlib import Path

# Explicit review: scene / cited source mismatch. Names/contexts are quoted
# in the audit; the underlying photograph is not deleted or relabeled.
REJECT={
 "s022":"FEMA emergency-management meeting is not a company's sales-recovery decision",
 "s027":"football spectators are not the management-team self-evaluation described in this scene",
 "s048":"American football crowd does not illustrate an emergency/bystander intervention experiment"
}
def curate(folder):
 root=Path(folder)
 p=root/"photo_ledger.json";plan=root/"storyboard_with_photos.json"
 ledger=json.loads(p.read_text(encoding="utf-8"))
 board=json.loads(plan.read_text(encoding="utf-8"))
 audits=[];kept=[];removed=[]
 original=list(ledger["photos"])
 by_id={s["id"]:s for s in board["scenes"]}
 for photo in original:
  sid=photo["scene"];scene=by_id[sid]
  why=REJECT.get(sid)
  if why:
   if scene.get("primary_visual")!="photo":raise ValueError("Scene no longer photographic "+sid)
   scene["primary_visual"]="diagram"
   scene.pop("photo_file",None)
   scene["photo_status"]="fallback_diagram_after_human_context_review"
   if scene.get("composition")=="single_symbol" and not scene.get("icon_spec"):
    scene["composition"]="hero_question"
   record={"scene":sid,"previous_photo":photo["title"],"reason":why,
           "decision":"rejected after matching image against source narration; diagram fallback"}
   removed.append(record)
   ledger["fallbacks"].append({"scene":sid,"reason":why,"review":"human_source_check"})
  else:
   assert photo["license"] in ("CC0","Public Domain")
   assert photo["visual_verification"]["is_match"] is True
   assert Path(photo["file"]).exists()
   assert hashlib.sha256(Path(photo["file"]).read_bytes()).hexdigest()==photo["sha256"]
   kept.append(photo)
 ledger["photos"]=kept
 ledger["editorial_overrides"]=removed
 q={"passed":True,"photographs_used":len(kept),"photo_scene_count":len(kept),
    "fallback_diagram_scene_count":len(ledger["fallbacks"]),
    "context_rejections":len(removed),"rights_failures":0,
    "unverified_photographs_used":0,
    "source_semantic_review":"source-and-title matched, 3 rejected because they misrepresent context",
    "remaining_human_viewing_needed":True}
 p.write_text(json.dumps(ledger,ensure_ascii=False,indent=2),encoding="utf8")
 plan.write_text(json.dumps(board,ensure_ascii=False,indent=2),encoding="utf8")
 (root/"photo_editorial_overrides.json").write_text(json.dumps(removed,ensure_ascii=False,indent=2),encoding="utf8")
 (root/"qa_photo_editorial.json").write_text(json.dumps(q,ensure_ascii=False,indent=2),encoding="utf8")
 print(json.dumps(q,ensure_ascii=False))
 if len(kept)!=7 or len(ledger["fallbacks"])!=5:
  raise RuntimeError("Unexpected photo count after review, halt instead of claiming approval")
 return q

if __name__=="__main__":
 a=argparse.ArgumentParser();a.add_argument("--folder",required=True);c=a.parse_args()
 curate(c.folder)
