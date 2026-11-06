#!/usr/bin/env python3
"""Generate four static Gate-2 proof frames from the actual AI visual storyboard.
No external photo is silently invented. A photo request is visibly marked pending.
No TTS, full-length render, YouTube upload, or API requests in this step.
"""
from __future__ import annotations
import argparse,json,re
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import cairosvg
import brand,icons

def make_gallery(plan_path,out_dir):
 data=json.loads(Path(plan_path).read_text(encoding="utf-8"))
 scenes=data["scenes"]
 if len(scenes)!=4:raise ValueError("Only four explicitly authorized scenes allowed")
 ids=[s["id"] for s in scenes]
 if len(set(ids))!=4:raise ValueError("Duplicated source scenes")
 out=Path(out_dir);out.mkdir(parents=True,exist_ok=True)
 images=[];checks=[];photo_pending=[]
 for s in scenes:
  brand.validate(s)
  if s.get("primary_visual")=="icon" and not s.get("icon_spec"):
   raise ValueError("Icon-primary frame lacks meaningful icon: "+s["id"])
  raw=brand.svg(s)
  svg=out/(s["id"]+".svg");png=out/(s["id"]+".png")
  svg.write_text(raw,encoding="utf-8")
  cairosvg.svg2png(bytestring=raw.encode("utf-8"),write_to=str(png))
  with Image.open(png) as im:
   im.load()
   if im.size!=(1280,720):raise ValueError("Wrong preview resolution")
   images.append(im.convert("RGB").copy())
  if s.get("primary_visual")=="photo":
   photo_pending.append({"scene_id":s["id"],"requested_subject":s.get("photo_subject"),
                         "query":s.get("photo_query"),
                         "note":"No search/download/license verification has been performed; placeholder only"})
  checks.append({"scene_id":s["id"],"composition":s["composition"],
     "headline":s["display_text"]["headline"],"visual_intent":s["visual_intent"],
     "evidence_anchor":s["evidence_anchor"],"primary_visual":s["primary_visual"],
     "icon_concept":(s.get("icon_spec") or {}).get("concept"),
     "icon_meaning":(s.get("icon_spec") or {}).get("meaning"),
     "photo_pending":s.get("primary_visual")=="photo"})
 icons.check_reuse(scenes,max_reuse=2)
 sheet=Image.new("RGB",(1280,720),"#0e0d0c")
 for n,frame in enumerate(images):
  # 4 images, exactly 2 columns x 2 rows.
  thumb=frame.resize((640,360),Image.Resampling.LANCZOS)
  sheet.paste(thumb,((n%2)*640,(n//2)*360))
 sheet.save(out/"contact_sheet.png")
 report={"automatic_pass":True,"human_gate2_status":"PENDING_REVIEW",
         "frame_count":len(scenes),"resolution":[1280,720],
         "narration_untouched":True,"all_frames_generated":len(images)==4,
         "headline_limit":brand.MAX_HEAD,"label_limit":brand.MAX_NOTE,
         "caption_line_limit":brand.MAX_SUB_LINE,
         "distinct_compositions":len(set(x["composition"] for x in scenes)),
         "generated_icon_count":sum(bool(s.get("icon_spec") and s["icon_spec"].get("origin","generated")=="generated") for s in scenes),
         "licensed_photo_count":0,"photo_requests_unfulfilled":photo_pending,
         "frames":checks,
         "warnings":["Human review mandatory: automated checks do not assess visual elegance or semantic truth.",
                     "Photo requests are placeholders: no external photographs were downloaded.",
                     "Subtitles are preview-only; exact timestamps require the audio pipeline."]}
 (out/"gate2_qa.json").write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding="utf-8")
 print(json.dumps({"automatic_pass":report["automatic_pass"],"human_gate2_status":report["human_gate2_status"],
                   "frames":report["frame_count"],"generated_icons":report["generated_icon_count"],
                   "photo_pending":len(photo_pending)},ensure_ascii=False))
 return report

if __name__=="__main__":
 p=argparse.ArgumentParser();p.add_argument("--plan",required=True);p.add_argument("--out",required=True);a=p.parse_args()
 make_gallery(a.plan,a.out)
