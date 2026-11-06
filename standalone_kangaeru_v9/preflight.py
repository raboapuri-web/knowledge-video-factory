#!/usr/bin/env python3
"""Keyless/voiceless 71-scene visual proof before any paid GPT v9 run."""
import argparse,json,math,sys
from pathlib import Path
from PIL import Image
import cairosvg
ROOT=Path(__file__).resolve().parent
sys.path.insert(0,str(ROOT.parent/"standalone_kangaeru_v8"))
import studio
import cue_plan,cue_visual

def preview(board,ledger,out,planned=None):
 out=Path(out);out.mkdir(parents=True,exist_ok=True)
 studio.add_motion(board)
 count=0;overview=[]
 decisions={s["scene_id"]:s["cue_visuals"] for s in planned["scenes"]} if planned else {}
 for scene in board["scenes"]:
  if scene["id"] in decisions:
   d=decisions[scene["id"]][0]
   state,_=cue_visual.change_state(scene,d,cue_visual.static_state(scene))
  else:state=cue_visual.static_state(scene)
  subtitle=scene["subtitle_cues"][0]["text"]
  spec=cue_visual.full_motion(scene,int(scene["id"][1:])-1)
  svg=cue_visual.cue_svg(scene,subtitle,state,10.0,spec,ledger)
  path=out/(scene["id"]+".jpg")
  png=out/(scene["id"]+".png")
  cairosvg.svg2png(bytestring=svg.encode(),write_to=str(png),output_width=640,output_height=360)
  with Image.open(png) as img:img.convert("RGB").save(path,quality=86)
  png.unlink();count+=1
  overview.append({"scene":scene["id"],"first_cue_visual":state["kind"],"first_subtitle":subtitle})
 assert count==71
 sheets=[]
 for page in range(math.ceil(count/12)):
  canvas=Image.new("RGB",(1280,1080),(14,13,12))
  for slot,rec in enumerate(overview[page*12:(page+1)*12]):
   with Image.open(out/(rec["scene"]+".jpg")) as img:
    canvas.paste(img,((slot%2)*640,(slot//2)*180))
  dest=out/(f"contact_sheet_{page+1:02d}.jpg")
  canvas.save(dest,quality=87);sheets.append(dest.name)
 result={"passed":True,"scene_previews":count,"contact_sheets":len(sheets),
         "new_api_calls":0,"voice_synthesis":False,
         "real_cue_plan_used":bool(planned),
         "note":"This is a static first-cue design audit, not a full audio-alignment proof."}
 (out/"qa_preflight.json").write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding="utf8")
 print(json.dumps(result,ensure_ascii=False))
 return result
if __name__=="__main__":
 p=argparse.ArgumentParser();p.add_argument("--board",required=True);p.add_argument("--ledger",required=True);p.add_argument("--out",required=True);p.add_argument("--cue-plan")
 a=p.parse_args()
 b=json.loads(Path(a.board).read_text(encoding="utf8"))
 l=json.loads(Path(a.ledger).read_text(encoding="utf8"))
 planned=json.loads(Path(a.cue_plan).read_text(encoding="utf8")) if a.cue_plan else None
 preview(b,l,a.out,planned)
