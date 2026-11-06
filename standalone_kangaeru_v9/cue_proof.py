#!/usr/bin/env python3
"""Full v9 no-voice, no-key, final cue-directed storyboard preview for all 224 cues."""
from __future__ import annotations
import argparse,json,math,sys
from pathlib import Path
from PIL import Image
import cairosvg
ROOT=Path(__file__).resolve().parent
sys.path.insert(0,str(ROOT.parent/"standalone_kangaeru_v8"))
import studio
import cue_plan,cue_visual

def preview(board,plan,ledger,out):
 metadata=cue_plan.prepare(board)
 if plan["source_cue_count"]!=metadata["source_cue_count"]:raise ValueError("Wrong source cue count")
 if plan["source_narration_sha256"]!=metadata["narration_sha256"]:raise ValueError("Original narration mutated")
 out=Path(out);out.mkdir(parents=True,exist_ok=True)
 proof=out/"cues";proof.mkdir(exist_ok=True)
 studio.add_motion(board)
 choices={p["scene_id"]:p["cue_visuals"] for p in plan["scenes"]}
 allframes=[];changes=0;holds=0;total=0;counts={};visible_photo_scenes=set()
 for scene_i,s in enumerate(board["scenes"]):
  state=cue_visual.static_state(s);last=None
  directives=choices[s["id"]]
  if len(directives)!=len(s["subtitle_cues"]):raise ValueError("Missing cue decisions "+s["id"])
  for j,(cue,d) in enumerate(zip(s["subtitle_cues"],directives)):
   cue_plan.validate_one(s,cue,d)
   next_state,changed=cue_visual.change_state(s,d,state)
   if j==0 or changed:changes+=1
   if d["kind"]=="none":holds+=1
   state=next_state
   sp=cue_visual.full_motion(s,scene_i,short=.85)
   raw=cue_visual.cue_svg(s,cue["text"],state,10.0,sp,ledger)
   if s.get("primary_visual")=="photo" and "<image " in raw:
    visible_photo_scenes.add(s["id"])
   png=proof/(f"{s['id']}_cue{j:02d}.jpg")
   temp=out/"cue_tmp.png"
   cairosvg.svg2png(bytestring=raw.encode("utf8"),write_to=str(temp),output_width=640,output_height=360)
   with Image.open(temp) as im:
    im.convert("RGB").save(png,quality=83)
   temp.unlink()
   allframes.append(png);total+=1
   counts[d["kind"]]=counts.get(d["kind"],0)+1
  if (scene_i+1)%15==0:print(json.dumps({"visual_preview_scenes":scene_i+1,"cues":total},ensure_ascii=False),flush=True)
 for k in range(0,len(allframes),12):
  page=Image.new("RGB",(1280,1080),(14,13,12))
  for i,file in enumerate(allframes[k:k+12]):
   with Image.open(file) as im:page.paste(im,((i%2)*640,(i//2)*180))
  page.save(out/(f"cue_contact_sheet_{k//12+1:02d}.jpg"),quality=83)
 result={"passed":total==224 and changes>71 and len(visible_photo_scenes)==len(ledger["photos"])==7,
   "visible_photo_scene_count":len(visible_photo_scenes),
   "licensed_photo_scene_count":len(ledger["photos"]),
   "scenes":len(board["scenes"]),"cues":total,
   "visual_switches_including_scene_boundaries":changes,"v8_baseline_scene_changes":71,
   "additional_cue_visual_switches":changes-71,"hold_none_cues":holds,
   "kinds":counts,"contact_sheets":math.ceil(total/12),
   "source_narration_unchanged":True,"openai_calls":0,"voicevox_used":False,
   "remaining_uncertainty":"Previews show appearance at completed cue state; audio alignment is verified in final render"}
 (out/"qa_cue_preview.json").write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding="utf8")
 print(json.dumps(result,ensure_ascii=False),flush=True)
 if not result["passed"]:raise ValueError("Visual change frequency/coverage below requested QA gate")
 return result
if __name__=="__main__":
 p=argparse.ArgumentParser();p.add_argument("--board",required=True);p.add_argument("--plan",required=True);p.add_argument("--ledger",required=True);p.add_argument("--out",required=True)
 a=p.parse_args()
 preview(json.loads(Path(a.board).read_text(encoding="utf8")),
         json.loads(Path(a.plan).read_text(encoding="utf8")),
         json.loads(Path(a.ledger).read_text(encoding="utf8")),a.out)
