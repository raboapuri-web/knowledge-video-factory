"""v9 cue visuals: source-grounded timed panels, v8 motion, fixed bottom subtitles.

One visual instruction per cue. A 'none' cue keeps the prior visual state,
but the subtitle is re-rendered with the NEW cue text in the fixed y>=586 lane.
Scene transitions occur only at scene boundaries.
"""
from __future__ import annotations
import copy,json,math,re,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parent
V7=ROOT.parent/"standalone_kangaeru_v7";V8=ROOT.parent/"standalone_kangaeru_v8"
sys.path.insert(0,str(V8));sys.path.insert(1,str(V7))
import motion,studio,pictograms
import brand
import cue_plan

W,H=1280,720
def static_state(scene):return {"kind":"base","text":"","element_index":-1}
def change_state(scene,decision,previous):
 kind=decision["kind"]
 if kind=="none":return copy.deepcopy(previous),False
 state={"kind":kind,"text":decision["text"],"element_index":decision["element_index"]}
 return state,state!=previous

def full_motion(scene,index,short=.85):
 sp=scene.get("motion")
 if not isinstance(sp,dict) or not all(x in sp for x in motion.CATALOGUE):
  scene=copy.deepcopy(scene)
  studio.add_motion({"scenes":[scene]})
  sp=scene["motion"]
 result=copy.deepcopy(sp)
 for group in ("text","diagram","data","transition"):
  result[group]["duration"]=min(short,result[group]["duration"])
 return result

def header(parts,text,local,spec):
 display=brand.tag_text(99,160,text,43,brand.IVORY,spacing=.6)
 parts.append(motion.tag_header_transition(display,text,local,spec["text"]))

def custom_svg(scene,subtitle,state,local,spec):
 s=copy.deepcopy(scene);s["subtitle_preview"]=subtitle
 group=state["kind"]
 out=['<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">',*brand.top()]
 if group=="keyword":
  keyword=brand.reject(state["text"])
  out.append(brand.tag_text(100,205,"KEY IDEA",20,brand.GOLD,family="sans",spacing=4))
  out.append(brand.line(100,232,1145,232,brand.HAIR,1.5))
  text=brand.tag_text(105,355,keyword,59,brand.IVORY,spacing=1)
  out.append(motion.tag_header_transition(text,keyword,local,spec["text"]))
  out.extend([brand.line(103,394,650,394,brand.GOLD,2.8),
              brand.tag_text(107,488,"考える夜  /  KEY POINT",17,brand.MUTED,family="sans")])
 elif group=="numeric":
  val=brand.reject(state["text"]);numeric=re.search(r"(-?\d+(?:\.\d+)?)",val)
  if not numeric:raise ValueError("Numeric directive without number")
  out.append(brand.tag_text(100,176,s["display_text"]["headline"],41,brand.IVORY))
  out.append(brand.tag_text(106,263,"DATA / SOURCE VERIFIED",20,brand.GOLD,family="sans",spacing=2))
  p=motion.progress(local,spec["data"])
  current=float(numeric.group(1))*min(1,max(0,p))
  # Keep the numeric precision in the original validated string.
  decimals=len(numeric.group(1).split(".")[1]) if "." in numeric.group(1) else 0
  shown=val[:numeric.start()]+f"{current:.{decimals}f}"+val[numeric.end():]
  out.append(brand.tag_text(112,427,shown,111,brand.GOLD,family="sans",spacing=.3))
  out.extend([brand.line(112,465,1030,465,brand.HAIR,1.5),
              brand.tag_text(112,515,"SOURCE-GROUNDED NUMBER",17,brand.MUTED,family="sans")])
 elif group=="diagram_element":
  labs=list(s["display_text"].get("labels",[]));values=list(s.get("values",[]))
  if not labs and not values:raise ValueError("Diagram element without real source labels/values")
  index=state["element_index"]
  elements=[]
  for i in range(index+1):
   label=str(labs[i]) if i<len(labs) else ""
   value=values[i] if i<len(values) else None
   elements.append((label,value))
  out.append(brand.tag_text(100,164,s["display_text"]["headline"],43,brand.IVORY))
  out.append(brand.tag_text(103,214,"STEP-BY-STEP / VERIFIED ELEMENTS",18,brand.GOLD,family="sans",spacing=2))
  width=960/max(1,len(elements))
  pp=min(1,max(0,motion.progress(local,spec["diagram"])))
  for i,(lab,val) in enumerate(elements):
   x=112+i*width; left=x+9
   opacity=(1. if spec["diagram"]["name"]=="none" else min(1,max(0,(pp*len(elements)-i))))
   out.append(f'<g opacity="{opacity:.3f}">')
   out.append(f'<rect x="{x:.1f}" y="268" width="{width-16:.1f}" height="224" rx="4" fill="#171411" stroke="{brand.GOLD}" stroke-width="1.6"/>')
   out.append(brand.tag_text(left+7,326,f"{i+1:02d}",37,brand.GOLD,family="sans"))
   if lab:out.append(brand.tag_text(left+7,403,lab,27,brand.IVORY,family="sans",spacing=0))
   if val is not None:
    out.append(brand.tag_text(left+7,468,str(val)+"%" if s["composition"]=="data_bars" else str(val),39,brand.GOLD,family="sans"))
   out.append("</g>")
  out.append(brand.line(100,529,1100,529,brand.HAIR,2))
 else:raise ValueError("Invalid custom cue visual "+group)
 out+=brand.footer(s);out.append("</svg>")
 return "\n".join(out)

def cue_svg(scene,subtitle,state,local,spec,ledger):
 kind=state["kind"]
 if kind in ("keyword","numeric","diagram_element"):
  return custom_svg(scene,subtitle,state,local,spec)
 s=copy.deepcopy(scene)
 if kind=="photo":
  if s.get("photo_status")!="visually_verified" or s.get("primary_visual")!="photo":
   raise ValueError("Photo cue cannot display unverified photo")
 if kind=="base":
  if s.get("composition")=="data_bars":
   pass
 return motion.animated_svg(s,subtitle,ledger,local,spec)

def visual_changes(board,plans):
 count=0;none=0;per_scene=[]
 by_id={p["scene_id"]:p for p in plans["scenes"]}
 for scene in board["scenes"]:
  states=by_id[scene["id"]]["cue_visuals"];state=static_state(scene);scene_n=1
  for i,d in enumerate(states):
   next_state,changed=change_state(scene,d,state)
   if d["kind"]=="none":none+=1
   if i>0 and changed:scene_n+=1
   state=next_state
  count+=scene_n;per_scene.append({"id":scene["id"],"changes":scene_n})
 return {"visual_changes_including_scene_boundaries":count,"none_cues":none,
         "per_scene":per_scene,"original_v8_scene_changes":len(board["scenes"]),
         "intra_scene_changes":count-len(board["scenes"])}
