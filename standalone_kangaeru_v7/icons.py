"""Safe branded SVG icon generator. LLM emits *numeric geometry JSON*, not executable SVG.
Reference: 8015 24 original golden line icons, same restrained palette as 8013.
"""
from __future__ import annotations
import base64,hashlib,json,sys
from pathlib import Path

GOLD="#c6a56e"
ROOT=Path(__file__).resolve().parent
V4=ROOT.parent/"standalone_kangaeru_v4"
sys.path.insert(0,str(V4))
# Only concept->icon matches with an intelligible graphic relation can fall back.
FALLBACK={"decision":"brain","attention":"eye","responsibility":"scales","society":"people",
          "knowledge":"book","statistics":"growth_chart","probability":"pie_chart",
          "time":"hourglass","research":"microscope","history":"book",
          "uncertainty":"question","causality":"network","institutions":"temple",
          "process":"arrows","complexity":"gears"}
# Fallback IDs must exist in the v4 original icon registry; do not synthesize replacements.

def validate(spec):
 if not isinstance(spec,dict) or spec.get("origin","generated")!="generated":raise ValueError("Expected generated geometry")
 concept=spec.get("concept","");reason=spec.get("meaning","")
 if not isinstance(concept,str) or not 2<=len(concept)<=80:raise ValueError("Missing precise icon concept")
 if not isinstance(reason,str) or not 8<=len(reason)<=180:raise ValueError("Missing relevance statement")
 paths=spec.get("paths",[]);circles=spec.get("circles",[])
 if not isinstance(paths,list) or not isinstance(circles,list) or len(paths)>12 or len(circles)>8:
  raise ValueError("Icon complexity limit")
 if not paths and not circles:raise ValueError("Empty icon")
 npoints=0
 for path in paths:
  if not isinstance(path,list) or not 2<=len(path)<=16:raise ValueError("Each line has 2-16 points")
  for item in path:
   if not isinstance(item,list) or len(item)!=2:raise ValueError("Bad point")
   if not all(type(x) in (float,int) and 3<=x<=97 for x in item):raise ValueError("Point outside viewport")
   npoints+=1
 for c in circles:
  if not isinstance(c,list) or len(c)!=3 or not all(type(v) in (int,float) for v in c):raise ValueError("Bad circle")
  x,y,r=c
  if r<=1 or x-r<3 or x+r>97 or y-r<3 or y+r>97:raise ValueError("Circle outside viewport")
 if npoints>64:raise ValueError("Too many vectors")
 return True

def fingerprint(spec):
 validate(spec)
 return hashlib.sha256(json.dumps([spec["paths"],spec["circles"]],sort_keys=True,separators=(",",":")).encode()).hexdigest()

def fallback(spec):
 """Only a source-grounded known symbol is allowed; otherwise return no icon."""
 concept=str(spec.get("fallback_concept",""))
 name=FALLBACK.get(concept)
 if not name:return None
 import core
 if name not in core.ICON_NAMES:return None
 return {"origin":"original_8015","id":name,"concept":spec.get("concept",concept),
         "meaning":spec.get("meaning","Existing registered icon matches this concept")}

def geometry(spec,center_x,center_y,scale=1.0):
 source=spec.get("origin","generated")
 if source=="original_8015":
  import core
  from io import BytesIO
  name=spec["id"]
  if name not in core.ICON_NAMES:raise ValueError("Unknown original icon "+name)
  im=core.icon_image(name,256);out=BytesIO();im.save(out,format="PNG")
  img=base64.b64encode(out.getvalue()).decode("ascii")
  size=160*scale
  return [f'<image x="{center_x-size/2}" y="{center_y-size/2}" width="{size}" height="{size}" href="data:image/png;base64,{img}"/>']
 validate(spec)
 # A distinct 7-element semantic goalkeeper silhouette is drawn for GK concepts:
 # goalposts + goal net + head/body/arms/legs + football. The raw model geometry is
 # retained in the icon registry for provenance, but an unreadable model sketch
 # must never silently become the approved on-screen symbol.
 concept=spec.get("concept","")
 if ("GK" in concept or "ゴールキーパー" in concept) and ("ゴール" in concept or "PK" in concept):
  spec={**spec,"paths":[
      [[8,87],[8,13],[92,13],[92,87]],[[8,26],[92,26]],
      [[21,13],[21,87]],[[36,13],[36,87]],[[64,13],[64,87]],[[79,13],[79,87]],
      [[8,43],[92,43]],[[8,62],[92,62]],
      [[45,51],[50,65]],[[45,52],[25,44]],[[45,52],[65,37]],
      [[50,65],[34,80]],[[50,65],[70,77]]],
      "circles":[[43,42,7],[82,42,6]]}
 size=1.45*scale
 parts=[f'<g transform="translate({center_x-size*50:.3f} {center_y-size*50:.3f}) scale({size:.4f})" fill="none" stroke="{GOLD}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">']
 for path in spec["paths"]:
  points=" ".join(f"{x:.2f},{y:.2f}" for x,y in path)
  parts.append(f'<polyline points="{points}"/>')
 for x,y,r in spec["circles"]:
  parts.append(f'<circle cx="{x:.2f}" cy="{y:.2f}" r="{r:.2f}"/>')
 parts.append("</g>")
 return parts

def export_icon(spec,path):
 from xml.etree import ElementTree as ET
 path=Path(path);path.parent.mkdir(parents=True,exist_ok=True)
 body="\n".join(geometry(spec,256,256,scale=3))
 doc='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">'+body+"</svg>"
 ET.fromstring(doc)
 path.write_text(doc,encoding="utf8")
 return path

def check_reuse(scenes,max_reuse=2):
 used={}
 for s in scenes:
  spec=s.get("icon_spec")
  if not spec:continue
  key=fingerprint(spec) if spec.get("origin","generated")=="generated" else spec["id"]
  used.setdefault(key,[]).append(s["id"])
 excessive={k:v for k,v in used.items() if len(v)>max_reuse}
 if excessive:raise ValueError("Repeated icon geometry over limit: "+str(excessive))
 return used
