"""v7 meaning-first AI storyboard. Preparation/tests are keyless, execution is opt-in.
Model: gpt-5.6-terra Responses API with strict JSON schema. Never log the API key.
"""
from __future__ import annotations
import argparse,json,os,re,sys
from pathlib import Path
from collections import Counter
ROOT=Path(__file__).resolve().parent
V6=ROOT.parent/"standalone_kangaeru_v6"
sys.path.insert(0,str(V6))
import storyboard as v6
import brand,icons

MODEL="gpt-5.6-terra"
COMPS=sorted(brand.FAMILIES)
TYPES=["photo","diagram","icon","none"]
NUMERIC={"type":"number"}
ICON_POINT={"type":"array","items":NUMERIC}
ICON_PATH={"type":"array","items":ICON_POINT}
ICON_SCHEMA={
 "type":"object","additionalProperties":False,
 "properties":{
  "concept":{"type":"string"},
  "meaning":{"type":"string"},
  "paths":{"type":"array","items":ICON_PATH},
  "circles":{"type":"array","items":ICON_POINT}
 },
 "required":["concept","meaning","paths","circles"]
}
DISPLAY_SCHEMA={
 "type":"object","additionalProperties":False,
 "properties":{"headline":{"type":"string"},"labels":{"type":"array","items":{"type":"string"}}},
 "required":["headline","labels"]
}
SCENE_PROPERTIES={
 "id":{"type":"string"},
 "visual_intent":{"type":"string"},
 "evidence_anchor":{"type":"string"},
 "composition":{"type":"string","enum":COMPS},
 "display_text":DISPLAY_SCHEMA,
 "values":{"type":"array","items":{"type":"number"}},
 "primary_visual":{"type":"string","enum":TYPES},
 "photo_subject":{"type":"string"},
 "photo_query":{"type":"string"},
 "icon_spec":{"anyOf":[ICON_SCHEMA,{"type":"null"}]}
}
SCENE_SCHEMA={"type":"object","additionalProperties":False,
 "properties":SCENE_PROPERTIES,"required":list(SCENE_PROPERTIES)}
SCHEMA={"type":"object","additionalProperties":False,
 "properties":{"scenes":{"type":"array","items":SCENE_SCHEMA}},
 "required":["scenes"]}

SYSTEM="""You are the meaning-first editor for a premium Japanese scholarly documentary called 考える夜.
The input's narration_text is immutable. Do NOT write narration or captions back; return visual plans only.
For each scene: identify ONE exact evidence_anchor substring from its narration, explain what should VISUALLY
be understood in visual_intent, and make 1 short display headline at most 18 Japanese characters.
Labels: 0-3, at most 12 characters each. Never restate or paraphrase the full narration as a text slide.
Avoid pointless icons: use icon_spec=null if no actual semantically fitting pictogram.
If icon is helpful, build a precise object (e.g. PK goalposts/goalie) with numeric strokes and circles,
not stock eye/scale icons. Icon geometry uses a 100x100 coordinate grid, each point [x,y] 3..97;
circles are [x,y,r]; use <=12 paths and <=8 circles. You must explain meaning tied to evidence_anchor.
DO NOT return SVG or markup. No invented numbers, claims, years, persons, names or evidence.
data_bars only if there are >=2 real percentages described by this or the supplied source_context;
provide exact numeric values and two compact labels. Otherwise use another type.
Draw 8013-style gold hairline graphics, no cards. Choose the *meaning* first, not a layout keyword.
Use a meaningful mix of hero_question / split_choice / data_bars / causal_flow / single_symbol.
Split choice only if there are TWO explicit different choices in the content.
For primary_visual=photo, propose an exact observable concrete subject and search phrase,
never vague office meetings or unrelated institutional buildings. No automatic image adoption here.
No forcing icons or photos. No other channel's mascots, banners or colors.
Return each input id exactly once in original order."""
def split_subtitles(narration,limit=20):
 # Narrative text preserved: only line breaks inserted. Real timestamp alignment is deferred to TTS.
 text=re.sub(r"\s+","",narration)
 if not text:return []
 units=[];remain=text
 while remain:
  chunk=remain[:limit]
  # Prefer a punctuation boundary if it does not yield an extremely short line.
  breaks=[i+1 for i,c in enumerate(chunk) if c in "。、！？!?"]
  if breaks and max(breaks)>=8:chunk=chunk[:max(breaks)]
  units.append(chunk);remain=remain[len(chunk):]
 cues=[]
 for i in range(0,len(units),2):
  lines=units[i:i+2]
  cues.append({"text":"\n".join(lines),"timing":"pending_voicevox_alignment"})
 assert "".join(c["text"].replace("\n","") for c in cues)==text
 return cues

def prepare(source_path,max_scenes=4):
 src=json.loads(Path(source_path).read_text(encoding="utf8"))
 board=v6.split_source(src)
 selected=board["scenes"][:max_scenes]
 rows=[{"id":s["id"],"chapter":s["chapter_title"],"narration_text":s["speech"],
         "subtitle_cues":split_subtitles(s["speech"])} for s in selected]
 return {"title":board["title"],"source_id":board["source_document_id"],"method":"narration immutable, OpenAI only plans visuals",
         "scenes":rows}

def numbers_in(text):
 return set(re.findall(r"\d+(?:\.\d+)?",text))
def merge_plan(prepared,response,full_reference=""):
 candidates=response["scenes"];refs=prepared["scenes"]
 if len(candidates)!=len(refs) or [s["id"] for s in candidates]!=[s["id"] for s in refs]:
  raise ValueError("Planner omitted/reordered scene IDs")
 out=[]
 for raw,p in zip(refs,candidates):
  if not isinstance(p["evidence_anchor"],str) or len(p["evidence_anchor"])<2 or p["evidence_anchor"] not in raw["narration_text"]:
   raise ValueError("Visual claim lacks source anchor: "+raw["id"])
  if not 10<=len(p["visual_intent"])<=220:raise ValueError("Missing meaningful visual intent")
  scene={**raw,**p}
  scene.pop("speech",None)
  # JSON output from model cannot edit the original narration or subtitle_cues.
  scene["narration_text"]=raw["narration_text"]
  scene["subtitle_cues"]=raw["subtitle_cues"]
  scene["subtitle_preview"]=raw["subtitle_cues"][0]["text"] if raw["subtitle_cues"] else ""
  if p["composition"]=="data_bars":
   vals=p["values"]
   if len(vals)<2 or len(vals)!=len(p["display_text"]["labels"]):raise ValueError("Unpaired bars")
   valid=numbers_in(raw["narration_text"]+full_reference)
   for v in vals:
    if str(v).rstrip("0").rstrip(".") not in valid:raise ValueError("Invented stat in "+raw["id"])
  elif p["values"]:raise ValueError("Values only for data bars")
  if p["primary_visual"]=="photo":
   if not 6<=len(p["photo_subject"])<=100 or not p["photo_query"]:raise ValueError("Missing concrete photo intent")
  if p["icon_spec"] is not None:
   try:icons.validate(p["icon_spec"])
   except ValueError:
    replacement=icons.fallback(p["icon_spec"])
    if replacement is None:
     # No arbitrary replacement: reject an icon-primary scene, otherwise omit it.
     if p["primary_visual"]=="icon":raise ValueError("No usable semantically matched icon for "+raw["id"])
     scene["icon_spec"]=None
    else:scene["icon_spec"]=replacement
  brand.validate(scene)
  out.append(scene)
 icons.check_reuse(out,max_reuse=2)
 # On a full set, fail if any family dominates or any three consecutive scenes reuse the family.
 if len(out)>=12:
  groups=Counter(x["composition"] for x in out)
  if max(groups.values())/len(out)>.35:raise ValueError("One composition dominates storyboard")
  for i in range(2,len(out)):
   if out[i]["composition"]==out[i-1]["composition"]==out[i-2]["composition"]:
    raise ValueError("Three consecutive duplicate layouts")
 return {"version":"v7.2","title":prepared["title"],"scenes":out,
         "qa":{"passed":True,"scene_count":len(out),"distinct_layouts":len(set(x["composition"] for x in out)),
               "meaning_anchor_coverage":len(out),"on_screen_text_limit":18,
               "unapproved_icon_count":0,"api_executed":False}}

def call_model(rows,model=MODEL):
 key=os.environ.get("OPENAI_API_KEY","")
 if not key:
  raise RuntimeError("OPENAI_API_KEY missing; call not attempted. Configure repository Actions Secret.")
 if os.environ.get("KANGAERU_V7_API_APPROVED")!="YES":
  raise RuntimeError("Explicit run approval not set; no API call attempted.")
 # SDK import and request occur only after both preflight checks, not during CI dry-run.
 from openai import OpenAI
 client=OpenAI(api_key=key,timeout=90,max_retries=1)
 payload=[{"role":"system","content":SYSTEM},
          {"role":"user","content":json.dumps({"scenes":rows},ensure_ascii=False)}]
 response=client.responses.create(model=model,input=payload,
      text={"format":{"type":"json_schema","name":"kangaeru_v7_visual_plan","strict":True,"schema":SCHEMA}},
      max_output_tokens=6500,store=False)
 if not response.output_text:raise RuntimeError("Planner returned no structured output")
 return json.loads(response.output_text)

def main():
 p=argparse.ArgumentParser()
 p.add_argument("--source",required=True);p.add_argument("--out",required=True)
 p.add_argument("--max-scenes",type=int,default=4)
 p.add_argument("--execute",action="store_true",help="BILLABLE; requires env key and explicit approval")
 a=p.parse_args()
 if not 1<=a.max_scenes<=8:raise ValueError("Safety cap: 1-8 scenes per execution")
 result=prepare(a.source,a.max_scenes)
 out=Path(a.out);out.parent.mkdir(parents=True,exist_ok=True)
 (out.parent/"prepared_narration.json").write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding="utf8")
 if not a.execute:
  print(json.dumps({"passed":True,"phase":"prepared_only","scene_count":len(result["scenes"]),"api_executed":False},ensure_ascii=False));return
 # No unapproved network, secrets remain exclusively in the process environment.
 plan=call_model(result["scenes"],os.environ.get("OPENAI_MODEL",MODEL))
 merged=merge_plan(result,plan)
 icon_dir=out.parent/"icons"/"generated"
 registry=[]
 for scene in merged["scenes"]:
  spec=scene.get("icon_spec")
  if spec:
   target=icons.export_icon(spec,icon_dir/(scene["id"]+".svg"))
   registry.append({"scene_id":scene["id"],"source":spec.get("origin","generated"),"concept":spec["concept"],
                    "meaning":spec["meaning"],"svg_file":str(target)})
 (out.parent/"icon_registry.json").write_text(json.dumps(registry,ensure_ascii=False,indent=2),encoding="utf8")
 merged["qa"]["icon_files"]=len(registry)
 merged["qa"]["api_executed"]=True
 out.write_text(json.dumps(merged,ensure_ascii=False,indent=2),encoding="utf8")
 print(json.dumps(merged["qa"],ensure_ascii=False))
if __name__=="__main__":main()
