#!/usr/bin/env python3
"""Replay a saved paid API answer without calling OpenAI or reading any secret.
Only harmless numerical fields attached to non-chart compositions are normalized;
a real chart with unsupported statistics still fails QA, never invents values.
"""
from __future__ import annotations
import argparse,json
from pathlib import Path
import planner,icons,render_gate2

def replay(path):
 root=Path(path)
 prepared=json.loads((root/"prepared_narration.json").read_text(encoding="utf-8"))
 generated=json.loads((root/"raw_visual_plan.json").read_text(encoding="utf-8"))
 usage=json.loads((root/"api_usage.json").read_text(encoding="utf-8"))
 assert len(prepared["scenes"])==4
 if len(generated.get("scenes",[]))!=4:raise ValueError("Response must contain 4 scenes")
 fixes=[]
 print(json.dumps({"original_model":usage.get("model_returned"),
       "original_token_usage":{k:usage.get(k) for k in ("input_tokens","cached_input_tokens","output_tokens","estimated_cost_usd")},
       "ai_scene_outlines":[{"id":s.get("id"),"composition":s.get("composition"),
                             "headline":(s.get("display_text") or {}).get("headline"),
                             "labels":(s.get("display_text") or {}).get("labels"),
                             "primary_visual":s.get("primary_visual"),
                             "icon_concept":(s.get("icon_spec") or {}).get("concept")}
                           for s in generated["scenes"]]},ensure_ascii=False))
 for s in generated["scenes"]:
  if s.get("composition")!="data_bars" and s.get("values"):
   fixes.append({"id":s["id"],"nonrendered_numeric_values_removed":s["values"]})
   s["values"]=[]
  # Never invent labels; if the AI created an incomplete comparison/flow,
  # downgrade only the presentation, preserve the exact original AI response.
  labels=(s.get("display_text") or {}).get("labels") or []
  required={"split_choice":2,"causal_flow":3}.get(s.get("composition"))
  if required and len(labels)!=required:
   original=s["composition"]
   replacement="single_symbol" if s.get("icon_spec") else "hero_question"
   s["composition"]=replacement
   s["display_text"]["labels"]=[]
   fixes.append({"id":s["id"],"layout_downgrade":original+" => "+replacement,
                 "reason":"AI omitted a mandatory semantic label; nothing fabricated"})
   print(json.dumps({"scene":s["id"],"layout_change":original+" => "+replacement,
                     "reason":"insufficient labels for diagram"},ensure_ascii=False))
 (root/"replay_normalization_audit.json").write_text(json.dumps(fixes,ensure_ascii=False,indent=2),encoding="utf-8")
 (root/"replayed_visual_plan.json").write_text(json.dumps(generated,ensure_ascii=False,indent=2),encoding="utf-8")
 plan=planner.merge_plan(prepared,generated)
 artdir=root/"icons"/"generated";artdir.mkdir(parents=True,exist_ok=True)
 records=[]
 for scene in plan["scenes"]:
  spec=scene.get("icon_spec")
  if spec is None:continue
  dest=icons.export_icon(spec,artdir/(scene["id"]+".svg"))
  records.append({"scene_id":scene["id"],"origin":spec.get("origin","generated"),
                  "concept":spec["concept"],"meaning":spec["meaning"],"svg_file":str(dest)})
 (root/"icon_registry.json").write_text(json.dumps(records,ensure_ascii=False,indent=2),encoding="utf-8")
 plan["qa"].update({"api_executed_in_prior_run":True,"api_called_in_replay":False,
                    "model_returned":usage.get("model_returned"),
                    "cost_estimate_usd":usage.get("estimated_cost_usd"),
                    "icon_count":len(records),"normalization_count":len(fixes)})
 (root/"plan.json").write_text(json.dumps(plan,ensure_ascii=False,indent=2),encoding="utf-8")
 final=render_gate2.make_gallery(root/"plan.json",root/"gate2")
 review={"passed":final["automatic_pass"],
         "api_usage":usage,"scene_summaries":[
            {"id":x["id"],"composition":x["composition"],
             "visual_intent":x["visual_intent"],"headline":x["display_text"]["headline"],
             "primary_visual":x.get("primary_visual"),
             "icon_concept":(x.get("icon_spec") or {}).get("concept"),
             "icon_meaning":(x.get("icon_spec") or {}).get("meaning"),
             "photo_subject":x.get("photo_subject"),"photo_query":x.get("photo_query")}
            for x in plan["scenes"]],"normalizations":fixes,
         "human_gate2_status":"PENDING_REVIEW",
         "note":"This replay made zero OpenAI calls; raw paid-model response remains archived."}
 (root/"review_summary.json").write_text(json.dumps(review,ensure_ascii=False,indent=2),encoding="utf-8")
 print(json.dumps(review,ensure_ascii=False,indent=2))
 return review

if __name__=="__main__":
 p=argparse.ArgumentParser();p.add_argument("--artifact-dir",required=True);a=p.parse_args()
 replay(a.artifact_dir)
