"""Optional OpenAI visual-planner adapter; never required for the offline GitHub Actions test.
Environment: OPENAI_API_KEY, OPENAI_MODEL. This file does not modify narration facts.
Usage: python ai_adapter.py --script plant.json --output plant_planned.json
"""
import argparse, json, os
from pathlib import Path
from core import ICON_NAMES,PHOTO_FILES,ROLES

def plan(data):
 from openai import OpenAI
 model=os.environ.get("OPENAI_MODEL")
 if not model or not os.environ.get("OPENAI_API_KEY"):
  raise RuntimeError("Set OPENAI_MODEL and OPENAI_API_KEY in the execution environment, not in files")
 client=OpenAI()
 compact=[{"id":s["id"],"subtitle":s["subtitle"],"role":s.get("role","")} for s in data["scenes"]]
 instruction=(
 "You are the visual editor for the Japanese intellectual documentary 考える夜. "
 "For each script ID, select one scene style, icon, and optional photo reference. "
 "Return ONLY valid JSON: {\"choices\":[{\"id\":\"s01\",\"visual_strategy\":\"title\","
 "\"visual_intent\":\"...\",\"icon\":\"eye\",\"photo\":\"forest\",\"claim\":\"...\"}]}. "
 "Visual styles: "+", ".join(sorted(ROLES))+". "
 "Icon names: "+", ".join(ICON_NAMES)+". "
 "Photo references: "+", ".join(PHOTO_FILES.keys())+". "
 "Do not add new scientific claims, statistics, dates, names, or fake photographs. "
 "Elegant Japanese editorial black-gold layouts, abundant whitespace, varied compositional rhythms. "
 "Claims are brief Japanese headlines, not copied full subtitle. Keep visual claims faithful."
 )
 rsp=client.responses.create(model=model,input=[{"role":"system","content":instruction},
  {"role":"user","content":json.dumps(compact,ensure_ascii=False)}])
 result=json.loads(rsp.output_text)
 choices=result["choices"]
 mapping={c["id"]:c for c in choices}
 expected={s["id"] for s in data["scenes"]}
 if set(mapping)!=expected or len(choices)!=len(expected):
  raise RuntimeError("Visual planner omitted or duplicated script chunks")
 for s in data["scenes"]:
  c=mapping[s["id"]]
  if c["visual_strategy"] not in ROLES:raise RuntimeError("Unknown style")
  if c["icon"] not in ICON_NAMES:raise RuntimeError("Unknown icon")
  if c.get("photo","forest") not in PHOTO_FILES:raise RuntimeError("Unknown photo")
  # Restrict AI to visual choices; subtitles and spoken text stay unchanged.
  for key in ("visual_strategy","visual_intent","icon","photo","claim"):
   if key in c:s[key]=c[key]
 return data

if __name__=="__main__":
 p=argparse.ArgumentParser();p.add_argument("--script",type=Path,required=True)
 p.add_argument("--output",type=Path,required=True)
 a=p.parse_args()
 original=json.loads(a.script.read_text(encoding="utf8"))
 new=plan(original)
 a.output.write_text(json.dumps(new,ensure_ascii=False,indent=2),encoding="utf8")
 print(str(a.output))
