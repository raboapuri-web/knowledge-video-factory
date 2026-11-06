#!/usr/bin/env python3
"""v7 full-series GPT visual plan with audit, batching, immutable narration and strict guards.
No API requests without OPENAI_API_KEY and KANGAERU_V7_FULL_APPROVED=YES.
The model generates visual *intent*, not the underlying science.
"""
from __future__ import annotations
import argparse,copy,hashlib,json,os,re,sys,time
from collections import Counter
from pathlib import Path
HERE=Path(__file__).resolve().parent
sys.path.insert(0,str(HERE.parent/"standalone_kangaeru_v6"))
import storyboard as v6
import planner,brand,icons

MODEL="gpt-5.6-terra"
def source_rows(source_path):
 src=json.loads(Path(source_path).read_text(encoding="utf8"))
 board=v6.split_source(src)
 rows=[]
 for s in board["scenes"]:
  rows.append({"id":s["id"],"chapter":s["chapter_title"],
               "narration_text":s["speech"],"subtitle_cues":planner.split_subtitles(s["speech"])})
 assert len(rows)>30
 return src,board,rows

def scene_repair(p,raw):
 """Repair presentational schema only. Never fabricate facts, data, graphics or dialogue."""
 audit=[]
 p=copy.deepcopy(p)
 if p.get("id")!=raw["id"]:raise ValueError("Model lost source scene ID "+raw["id"])
 if not isinstance(p.get("visual_intent"),str) or len(p["visual_intent"])<10:
  raise ValueError("Model omitted scene visual intent "+raw["id"])
 anchor=p.get("evidence_anchor","")
 if not isinstance(anchor,str) or anchor not in raw["narration_text"] or len(anchor)<2:
  # Ground in the exact original narration; track this repair.
  p["evidence_anchor"]=raw["narration_text"][:min(12,len(raw["narration_text"]))]
  audit.append("replaced ungrounded evidence anchor with exact source excerpt")
 d=p.get("display_text")
 if not isinstance(d,dict):raise ValueError("No display_text "+raw["id"])
 h=d.get("headline","")
 if not isinstance(h,str) or not h.strip():raise ValueError("No headline "+raw["id"])
 if len(h)>18:
  d["headline"]=h[:17]+"…"
  audit.append("headline clipped at 18 visual characters")
 labels=d.get("labels")
 if not isinstance(labels,list):labels=[]
 labels=[str(x)[:11]+"…" if len(str(x))>12 else str(x) for x in labels[:3]]
 if labels!=d.get("labels"):audit.append("annotation labels resized to max 12 chars")
 d["labels"]=labels
 comp=p.get("composition","hero_question")
 if comp not in brand.FAMILIES:
  comp="hero_question";audit.append("invalid composition replaced with editorial question")
 if comp!="data_bars" and p.get("values"):
  p["values"]=[];audit.append("non-chart numeric fields omitted")
 if comp=="data_bars":
  vals=p.get("values") or []
  valid=planner.numbers_in(raw["narration_text"])
  if not (len(vals) in (2,3) and len(vals)==len(labels)
          and all(isinstance(v,(int,float)) and 0<=v<=100 for v in vals)
          and all(str(v).rstrip("0").rstrip(".") in valid for v in vals)):
   comp="hero_question";p["values"]=[];d["labels"]=[]
   audit.append("unverifiable data chart replaced with grounded question")
  else:
   cleaned=[]
   for label,v in zip(labels,vals):
    cleaned.append(re.sub(r"\s*"+re.escape(str(v))+r"\s*[％%]\s*$","",label).strip())
   if all(cleaned):d["labels"]=cleaned
 if comp=="split_choice":
  if len(d["labels"])>=2:
   if len(d["labels"])>2:
    d["labels"]=d["labels"][:2]
    audit.append("third commentary label omitted from 2-way comparison")
  else:
   comp="hero_question";d["labels"]=[]
   audit.append("unpaired comparison replaced with editorial question")
 if comp=="causal_flow" and len(d["labels"])!=3:
  comp="hero_question";d["labels"]=[]
  audit.append("incomplete causal path replaced with editorial question")
 p["composition"]=comp
 if p.get("primary_visual") not in ("photo","diagram","icon","none"):
  p["primary_visual"]="diagram";audit.append("unknown media type replaced with diagram")
 spec=p.get("icon_spec")
 if spec is not None:
  try:icons.validate(spec)
  except (ValueError,TypeError,KeyError):
   fb=icons.fallback(spec if isinstance(spec,dict) else {})
   p["icon_spec"]=fb
   if fb is None and p["primary_visual"]=="icon":
    p["primary_visual"]="diagram";audit.append("invalid icon omitted; editorial diagram used")
   else:audit.append("unsafe icon replaced with verified source-symbol fallback")
 if p["primary_visual"]=="icon" and not p.get("icon_spec"):
  p["primary_visual"]="diagram";audit.append("empty icon replaced with diagram")
 if p["primary_visual"]=="photo":
  subject=p.get("photo_subject") or ""
  query=p.get("photo_query") or ""
  if len(subject)<8 or len(query)<6:
   p["primary_visual"]="diagram"
   audit.append("vague photo request replaced with diagram")
 p["narration_text"]=raw["narration_text"]
 p["subtitle_cues"]=raw["subtitle_cues"]
 p["subtitle_preview"]=raw["subtitle_cues"][0]["text"] if raw["subtitle_cues"] else ""
 p["chapter"]=raw["chapter"]
 brand.validate(p)
 return p,audit

def enforce_global(scenes):
 """No repeated identical icon forms and no three consecutive identical compositions."""
 audit=[]
 seen={}
 for scene in scenes:
  spec=scene.get("icon_spec")
  if not spec:continue
  try:key=icons.fingerprint(spec) if spec.get("origin","generated")=="generated" else spec["id"]
  except (TypeError,KeyError,ValueError):
   scene["icon_spec"]=None;scene["primary_visual"]="diagram";audit.append((scene["id"],"invalid icon removed"));continue
  used=seen.setdefault(key,[])
  if len(used)>=2:
   scene["icon_spec"]=None
   if scene.get("primary_visual")=="icon":scene["primary_visual"]="diagram"
   audit.append((scene["id"],"repeated icon geometry suppressed"))
  else:used.append(scene["id"])
 # Keep the scene's original visual intent; alternate a repeated layout only if a
 # neutral text treatment is meaningful and does not require invented labels.
 for i in range(2,len(scenes)):
  if scenes[i]["composition"]==scenes[i-1]["composition"]==scenes[i-2]["composition"]:
   cur=scenes[i]
   cur["composition"]="single_symbol" if cur.get("icon_spec") and cur["composition"]!="single_symbol" else "hero_question"
   if cur["composition"]==scenes[i-1]["composition"]:
    cur["composition"]="single_symbol" if cur["composition"]=="hero_question" else "hero_question"
   audit.append((cur["id"],"third identical composition prevented"))
 distribution=Counter(s["composition"] for s in scenes)
 return audit,distribution

def build(source_path,out,batch_size=6):
 if not os.getenv("OPENAI_API_KEY"):raise RuntimeError("Missing OPENAI_API_KEY, no paid calls made")
 if os.getenv("KANGAERU_V7_FULL_APPROVED")!="YES":raise RuntimeError("Full episode use not explicitly authorized")
 if batch_size<2 or batch_size>8:raise ValueError("Batch size must be 2..8")
 out=Path(out);out.mkdir(parents=True,exist_ok=True);(out/"batches").mkdir(exist_ok=True)
 src,board,rows=source_rows(source_path)
 (out/"prepared_full.json").write_text(json.dumps({"title":board["title"],"chapters":board["chapters"],"scenes":rows},ensure_ascii=False,indent=2),encoding="utf8")
 result=[];records=[];repairs=[]
 for start in range(0,len(rows),batch_size):
  batch=rows[start:start+batch_size]
  ix=start//batch_size+1
  root=out/"batches"/f"batch_{ix:02d}"
  root.mkdir(parents=True,exist_ok=True)
  result_file=root/"raw_response.json"
  usage_file=root/"usage.json"
  if result_file.is_file() and usage_file.is_file():
   plan=json.loads(result_file.read_text(encoding="utf8"))
   usage=json.loads(usage_file.read_text(encoding="utf8"))
  else:
   response=planner.call_model(batch,MODEL)
   usage=response["usage"]
   usage_file.write_text(json.dumps(usage,ensure_ascii=False,indent=2),encoding="utf8")
   result_file.write_text(response["raw_json"],encoding="utf8")
   plan=json.loads(response["raw_json"])
  received=plan.get("scenes")
  if not isinstance(received,list) or len(received)!=len(batch):
   raise ValueError("Model returned wrong number of scenes, batch "+str(ix))
  for b,raw in zip(received,batch):
   scene,notes=scene_repair(b,raw)
   result.append(scene)
   for n in notes:repairs.append({"scene":scene["id"],"adjustment":n})
  records.append({"batch":ix,"scenes":[batch[0]["id"],batch[-1]["id"]],**usage})
  (out/"api_usage.json").write_text(json.dumps({"requests":records,
          "totals":{"calls":len(records),"input_tokens":sum(r.get("input_tokens",0) for r in records),
           "output_tokens":sum(r.get("output_tokens",0) for r in records),
           "cost_estimate_usd":round(sum(r.get("estimated_cost_usd",0) for r in records),6)}},ensure_ascii=False,indent=2),encoding="utf8")
  print(json.dumps({"stage":"model_batch_completed","batch":ix,"scene_count":len(batch),
                    "total_scenes_processed":len(result),"estimated_cost":records[-1].get("estimated_cost_usd")},ensure_ascii=False),flush=True)
  time.sleep(.4)
 if len(result)!=len(rows):raise ValueError("Incomplete full visual plan")
 global_fixes,dist=enforce_global(result)
 repairs.extend({"scene":a,"adjustment":b} for a,b in global_fixes)
 icons_folder=out/"icons"/"generated";icons_folder.mkdir(parents=True,exist_ok=True)
 registry=[]
 for s in result:
  spec=s.get("icon_spec")
  if not spec:continue
  filename=icons_folder/(s["id"]+".svg")
  icons.export_icon(spec,filename)
  registry.append({"scene":s["id"],"source":spec.get("origin","generated"),
   "concept":spec.get("concept"),"meaning":spec.get("meaning"),"file":str(filename)})
 (out/"icon_registry.json").write_text(json.dumps(registry,ensure_ascii=False,indent=2),encoding="utf8")
 (out/"normalizations.json").write_text(json.dumps(repairs,ensure_ascii=False,indent=2),encoding="utf8")
 prepared_chars="".join(re.sub(r"\s+","",s["narration_text"]) for s in rows)
 final_chars="".join(re.sub(r"\s+","",s["narration_text"]) for s in result)
 assert prepared_chars==final_chars,"Original narration lost or changed"
 report={"passed":True,"source_narration_unchanged":True,
         "scene_count":len(result),"chapter_count":len(board["chapters"]),
         "layout_counts":dict(dist),"generated_icon_count":sum(x["source"]=="generated" for x in registry),
         "repaired_fields":len(repairs),"full_script_sha256":hashlib.sha256(prepared_chars.encode()).hexdigest(),
         "api_requested_model":MODEL,
         "api_calls":len(records),
         "human_visual_review_required":True}
 final={"version":"v7-full-1","title":board["title"],"source_document_id":src.get("source_document_id"),
   "source_url":src.get("source_url"),"chapters":board["chapters"],
   "scenes":result,"qa":report}
 (out/"storyboard.json").write_text(json.dumps(final,ensure_ascii=False,indent=2),encoding="utf8")
 (out/"qa_storyboard.json").write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding="utf8")
 print(json.dumps(report,ensure_ascii=False),flush=True)
 return final

if __name__=="__main__":
 p=argparse.ArgumentParser();p.add_argument("--source",required=True);p.add_argument("--out",required=True)
 p.add_argument("--batch-size",type=int,default=6)
 a=p.parse_args();build(a.source,a.out,a.batch_size)
