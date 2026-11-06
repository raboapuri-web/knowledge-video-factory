#!/usr/bin/env python3
"""v9 cue-level visual planner. Source narration and caption lines are immutable.
All model calls require both OPENAI_API_KEY and explicit full-cue authorization.
Fail closed on invented numerals, unrelated photos, unsupported diagram indices.
"""
from __future__ import annotations
import argparse,copy,hashlib,json,os,re,time
from pathlib import Path

MODEL="gpt-5.6-terra"
KINDS=("keyword","numeric","diagram_element","photo","none")
SCHEMA={
 "type":"object","additionalProperties":False,
 "properties":{"scenes":{"type":"array","items":{
  "type":"object","additionalProperties":False,
  "properties":{"scene_id":{"type":"string"},
    "cues":{"type":"array","items":{
      "type":"object","additionalProperties":False,
      "properties":{"cue_index":{"type":"integer"},"kind":{"type":"string","enum":list(KINDS)},
        "text":{"type":"string"},"element_index":{"type":"integer"}},
      "required":["cue_index","kind","text","element_index"]}}},
  "required":["scene_id","cues"]}}},
 "required":["scenes"]}
PROMPT="""You are a precise Japanese educational documentary visual editor.
Return one visual decision per supplied subtitle cue, keyed by scene_id and cue_index.
Never change narration, subtitles, scene IDs, or scene order.
Choose ONE:
keyword: concise meaningful actual substring (<=18 Japanese chars) in this cue's text,
 or exact preexisting scene display headline/label (not an invented paraphrase).
numeric: an exact number or numeric string ALREADY present in this cue's words,
 or scene's preexisting values/labels. Never invent percentages or measurements.
diagram_element: only if the scene explicitly has nonempty labels/values; element_index
 is the 0-based member index in those existing labels or values; text must be an exact
 existing label or number (not your own description).
photo: only if photo_status is visually_verified and a real rights-verified photo_file exists;
 text must be empty; never select a photo from an unverified or diagram-only scene.
none: hold previous scene visual state without changing graphics; subtitle always refreshes.
For keyword/numeric use element_index=-1.
For photo/none use text="" and element_index=-1.
Visual changes should follow clauses and claims, not random alternation. Prefer
introducing a new visual when another narrated idea or numerical claim becomes salient.
A scene may have several distinct changes. Avoid unnecessary repeated changes.
Do NOT produce pictures, SVGs or new facts, only visual cue instructions.
No outside references, no invented facts or research. Output strict JSON only."""

def normalized(s):return re.sub(r"\s+","",s)
def number_tokens(s):return re.findall(r"\d+(?:\.\d+)?",s)
def allowed_text(scene,cue,text):
 if not text or len(text)>18:return False
 target=normalized(text)
 source=normalized(cue["text"])
 labels=[scene["display_text"].get("headline","")]+scene["display_text"].get("labels",[])
 return target in source or any(target==normalized(str(label)) for label in labels) or any(target==normalized(str(v)) or target==normalized(str(v))+"%" for v in scene.get("values",[]))

def validate_one(scene,cue,decision):
 kind=decision["kind"];label=str(decision["text"]);index=int(decision["element_index"])
 if kind not in KINDS:raise ValueError("Unknown cue kind")
 if kind in ("none","photo"):
  if label!="" or index!=-1:raise ValueError("Spurious text for hold/photo")
  if kind=="photo" and not (scene.get("photo_status")=="visually_verified" and scene.get("primary_visual")=="photo" and scene.get("photo_file")):
   raise ValueError("Photo used without per-scene verification")
 elif kind in ("keyword","numeric"):
  if index!=-1 or not allowed_text(scene,cue,label):raise ValueError("Unanchored visual text: "+label)
  if kind=="numeric":
   if not re.search(r"\d",label):raise ValueError("A numeric cue must contain a number")
   # Numeric expression, not merely a phrase with an irrelevant digit.
   labels=scene["display_text"].get("labels",[])
   numbers=number_tokens(cue["text"]+" "+" ".join(str(v) for v in scene.get("values",[]))+" "+" ".join(str(x) for x in labels))
   if not any(n in label for n in numbers):raise ValueError("Invented numeric display")
 elif kind=="diagram_element":
  labels=list(scene["display_text"].get("labels",[]))
  nums=list(scene.get("values",[]))
  if not (labels or nums):raise ValueError("Diagram has no source elements")
  if index<0 or index>=max(len(labels),len(nums)):raise ValueError("Diagram index out of range")
  allowed=[]
  if index<len(labels):allowed.append(str(labels[index]))
  if index<len(nums):allowed.extend((str(nums[index]),str(nums[index])+"%"))
  if label not in allowed:raise ValueError("Diagram displays unsourced element")
  if len(label)>18:raise ValueError("Diagram label too long")
 return True

def normalize_decision(scene,cue,decision):
 """Suppress unsupported model decisions; NEVER fabricate or repair semantic meaning."""
 try:
  if int(decision.get("cue_index",-1))<0:raise ValueError("Invalid index")
  validate_one(scene,cue,decision)
  return {"cue_index":int(decision["cue_index"]),"kind":decision["kind"],
          "text":str(decision["text"]),"element_index":int(decision["element_index"])},None
 except Exception as e:
  return {"cue_index":int(decision.get("cue_index",0)),"kind":"none","text":"","element_index":-1},str(e)

def merge_batch(batch,model_result):
 incoming=model_result.get("scenes")
 if not isinstance(incoming,list) or len(incoming)!=len(batch):
  raise ValueError("Model omitted scenes in batch")
 output=[];rejected=[]
 for scene,planned in zip(batch,incoming):
  if planned.get("scene_id")!=scene["id"]:raise ValueError("Scene ID reordered")
  decisions=planned.get("cues")
  if not isinstance(decisions,list) or len(decisions)!=len(scene["subtitle_cues"]):
   raise ValueError("Scene cue count differs from original")
  out=[]
  for idx,(cue,item) in enumerate(zip(scene["subtitle_cues"],decisions)):
   if item.get("cue_index")!=idx:raise ValueError("Cue indexes not sequential")
   result,issue=normalize_decision(scene,cue,item)
   if issue:rejected.append({"scene":scene["id"],"cue_index":idx,"reason":issue})
   out.append(result)
  output.append({"scene_id":scene["id"],"narration_sha256":hashlib.sha256(scene["narration_text"].encode()).hexdigest(),
                 "cue_visuals":out})
 return output,rejected

def prepare(board):
 scenes=board["scenes"]
 assert len(scenes)==71,("Expected 71 GK scenes, found",len(scenes))
 for s in scenes:
  assert normalized("".join(c["text"] for c in s["subtitle_cues"]))==normalized(s["narration_text"]),s["id"]
  assert all(0<len(c["text"].replace("\n",""))<=40 for c in s["subtitle_cues"])
 result={"source_title":board["title"],"model":MODEL,"source_scene_count":len(scenes),
  "source_cue_count":sum(len(s["subtitle_cues"]) for s in scenes),
  "narration_sha256":hashlib.sha256("".join(normalized(s["narration_text"]) for s in scenes).encode()).hexdigest()}
 return result

def query_model(batch):
 if not os.environ.get("OPENAI_API_KEY"):raise RuntimeError("OPENAI_API_KEY missing; no request")
 if os.environ.get("KANGAERU_V9_CUE_API_APPROVED")!="YES":raise RuntimeError("No v9 full-cue authorization")
 from openai import OpenAI
 client=OpenAI(api_key=os.environ["OPENAI_API_KEY"],timeout=180,max_retries=0)
 rows=[{"scene_id":s["id"],"narration_text":s["narration_text"][:800],
    "composition":s["composition"],"photo_status":s.get("photo_status","unavailable"),
    "photo_file_verified":bool(s.get("photo_file") and s.get("photo_status")=="visually_verified"),
    "display_text":s["display_text"],"values":s.get("values",[]),
    "cues":[{"cue_index":i,"text":cue["text"]} for i,cue in enumerate(s["subtitle_cues"])]} for s in batch]
 response=client.responses.create(
  model=MODEL,input=[{"role":"system","content":PROMPT},
                     {"role":"user","content":json.dumps({"scenes":rows},ensure_ascii=False)}],
  text={"format":{"type":"json_schema","name":"v9_cue_visual_plan","strict":True,"schema":SCHEMA}},
  max_output_tokens=7500,store=False)
 if not response.output_text:raise RuntimeError("No structured model response")
 u=response.usage.model_dump() if response.usage is not None else {}
 inp=int(u.get("input_tokens",0));out=int(u.get("output_tokens",0))
 cached=int((u.get("input_tokens_details") or {}).get("cached_tokens",0))
 cost=(max(0,inp-cached)*2.0+cached*.2+out*12.0)/1000000
 usage={"model_requested":MODEL,"model_returned":response.model,
        "response_status":response.status,"input_tokens":inp,"cached_input_tokens":cached,
        "output_tokens":out,"estimated_cost_usd":round(cost,7)}
 return json.loads(response.output_text),usage

def full_plan(board,output,batch_size=6):
 metadata=prepare(board);scenes=board["scenes"];output=Path(output);output.mkdir(parents=True,exist_ok=True)
 packets=output/"batches";packets.mkdir(exist_ok=True)
 merged=[];usage_rows=[];rejections=[]
 for offset in range(0,len(scenes),batch_size):
  batch=scenes[offset:offset+batch_size]
  i=1+offset//batch_size
  root=packets/f"{i:02d}";root.mkdir(exist_ok=True)
  # A save allows replay on the same job without a second request, if needed.
  if (root/"response.json").is_file() and (root/"usage.json").is_file():
   result=json.loads((root/"response.json").read_text(encoding="utf8"))
   meter=json.loads((root/"usage.json").read_text(encoding="utf8"))
  else:
   result,meter=query_model(batch)
   (root/"response.json").write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding="utf8")
   (root/"usage.json").write_text(json.dumps(meter,ensure_ascii=False,indent=2),encoding="utf8")
  plans,issues=merge_batch(batch,result)
  merged.extend(plans);rejections.extend(issues);usage_rows.append({"batch":i,"scene_count":len(batch),**meter})
  print(json.dumps({"cue_api_batch":i,"source_scenes":len(batch),
     "cues_completed":sum(len(x["cue_visuals"]) for x in merged),
     "model":meter["model_returned"],"cost_estimate":meter["estimated_cost_usd"]},ensure_ascii=False),flush=True)
  (output/"api_usage_v9.json").write_text(json.dumps({"requests":usage_rows,
    "totals":{"requests":len(usage_rows),"input_tokens":sum(x["input_tokens"] for x in usage_rows),
      "output_tokens":sum(x["output_tokens"] for x in usage_rows),
      "cached_input_tokens":sum(x["cached_input_tokens"] for x in usage_rows),
      "estimated_cost_usd":round(sum(x["estimated_cost_usd"] for x in usage_rows),6)}},ensure_ascii=False,indent=2),encoding="utf8")
 assert len(merged)==len(scenes)
 n=sum(len(x["cue_visuals"]) for x in merged)
 assert n==metadata["source_cue_count"]
 # Visual change counts distinguish an actual change from an identical repeated directive.
 changes=0;none=0;last=None
 for scene in merged:
  last=None
  for decision in scene["cue_visuals"]:
   visual=(decision["kind"],decision["text"],decision["element_index"])
   if decision["kind"]=="none":none+=1;continue
   if visual!=last:changes+=1;last=visual
 summary={**metadata,"source_cue_count":n,"none_cues":none,"visual_change_count":changes,
          "rejected_invalid_directives":len(rejections),
          "photo_directives":sum(x["kind"]=="photo" for s in merged for x in s["cue_visuals"]),
          "diagram_element_directives":sum(x["kind"]=="diagram_element" for s in merged for x in s["cue_visuals"]),
          "qa_passed":True,"human_review_required":True}
 final={"version":"v9-cues","source_scene_count":len(scenes),"source_cue_count":n,
        "source_narration_sha256":metadata["narration_sha256"],"scenes":merged,"qa":summary}
 (output/"cue_storyboard.json").write_text(json.dumps(final,ensure_ascii=False,indent=2),encoding="utf8")
 (output/"cue_qa.json").write_text(json.dumps(summary,ensure_ascii=False,indent=2),encoding="utf8")
 (output/"rejected_cue_decisions.json").write_text(json.dumps(rejections,ensure_ascii=False,indent=2),encoding="utf8")
 print(json.dumps(summary,ensure_ascii=False),flush=True)
 return final

if __name__=="__main__":
 cli=argparse.ArgumentParser();cli.add_argument("--board",required=True);cli.add_argument("--out",required=True)
 cli.add_argument("--batch-size",type=int,default=6);arg=cli.parse_args()
 if not 2<=arg.batch_size<=6:raise ValueError("Limit paid request scope to six scenes each")
 board=json.loads(Path(arg.board).read_text(encoding="utf8"))
 full_plan(board,arg.out,arg.batch_size)
