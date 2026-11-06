#!/usr/bin/env python3
"""v7 selective Commons photo collection with CC0/PD license checks and visual relevance QA.
A non-matching or unverified photo is NEVER used. Original diagram/icon fallback.
"""
from __future__ import annotations
import argparse,base64,hashlib,io,json,os,re,sys,time
from collections import Counter
from pathlib import Path
import requests
from PIL import Image,ImageOps
ROOT=Path(__file__).resolve().parent
sys.path.insert(0,str(ROOT.parent/"standalone_kangaeru_v6"))
import materials

MODEL="gpt-5.6-terra"
KEYWORDS={
 "goalkeeper":("ゴールキーパー","PK","セーブ","キーパー","シュート","飛ぶ"), 
 "hospital":("医師","患者","診断","検査","医療","病院"),
 "office":("職場","責任者","会社","経営","組織","上司","社員"),
 "crowd":("観客","傍観","群衆","周囲","世間"),
 "rescue":("救助","救命","事故","消防","救急"),
}
SEARCH={
 "goalkeeper":["football goalkeeper penalty kick","soccer goalkeeper diving save"],
 "hospital":["doctor patient hospital consultation","doctor hospital surgery"],
 "office":["office workers meeting","employees workplace"],
 "crowd":["football spectators stadium","crowd watching football"],
 "rescue":["rescue paramedic ambulance","firefighters rescue"],
}
SCHEMA={"type":"object","additionalProperties":False,
"properties":{"is_match":{"type":"boolean"},"actual_visible_subject":{"type":"string"},
 "reason":{"type":"string"},"confidence":{"type":"number"}},
"required":["is_match","actual_visible_subject","reason","confidence"]}

def topic(scene):
 txt=(scene.get("narration_text") or "")+" "+(scene.get("photo_subject") or "")
 scores={k:sum(1 for t in words if t in txt) for k,words in KEYWORDS.items()}
 if not scores:return None
 win=max(scores,key=scores.get)
 return win if scores[win]>0 else None

ILLUSTRATIVE_SUBJECTS={
 "goalkeeper":"A real soccer goalkeeper in or in front of a football goal, in sport action or preparation",
 "hospital":"A real doctor visibly interacting with a patient or clinician in a treatment or consultation setting",
 "office":"Real employees collaborating, planning or making decisions in an ordinary workplace, not a political meeting",
 "crowd":"Real soccer spectators reacting or watching a football match at a stadium",
 "rescue":"Real firefighters, paramedics or emergency responders in professional rescue action"
}
def promote_relevant_photo_scenes(scenes,limit=16):
 """Add at most a few contextual photos per chapter; never replace charts or icons.
 All promoted photos must still pass the independent model image-contents check.
 """
 count=sum(s.get("primary_visual")=="photo" for s in scenes)
 per_chapter=Counter()
 per_topic=Counter()
 last=-10
 promoted=[]
 for index,scene in enumerate(scenes):
  ch=scene.get("chapter","")
  if scene.get("primary_visual")=="photo":
   per_chapter[ch]+=1;per_topic[topic(scene)]+=1;last=index
  if count>=limit:break
  if scene.get("primary_visual")=="photo":continue
  if index-last<3:continue
  if scene.get("composition") in ("data_bars","causal_flow","split_choice"):continue
  if scene.get("icon_spec") is not None:continue
  t=topic(scene)
  if t not in ILLUSTRATIVE_SUBJECTS or per_chapter[ch]>=3 or per_topic[t]>=4:continue
  # A physical subject in the actual narration is required; no metaphor only.
  terms=KEYWORDS[t]
  if not any(w in scene.get("narration_text","") for w in terms):continue
  scene["primary_visual"]="photo"
  scene["photo_subject"]=ILLUSTRATIVE_SUBJECTS[t]
  scene["photo_query"]=SEARCH[t][0]
  scene["photo_role"]="illustrative_footage"
  per_chapter[ch]+=1;per_topic[t]+=1;last=index;count+=1
  promoted.append(scene["id"])
 return promoted

def small_image(raw):
 with Image.open(io.BytesIO(raw)) as im:
  im=ImageOps.exif_transpose(im).convert("RGB");im.thumbnail((1024,768),Image.Resampling.LANCZOS)
  buf=io.BytesIO();im.save(buf,format="JPEG",quality=78,optimize=True)
  return buf.getvalue(),im.size

def candidate_images(scene):
 q=scene.get("photo_query","").strip()
 queries=[]
 if q:queries.append(q)
 subject=topic(scene)
 if subject:queries+=SEARCH[subject]
 seen=set()
 for query in queries[:3]:
  try:items=materials.pick_candidates(query)[:8]
  except Exception as e:
   print(json.dumps({"stage":"commons_search_failed","scene":scene["id"],"query":query,
                     "error":type(e).__name__},ensure_ascii=False),flush=True)
   items=[]
  for item in items:
   if item["source_page"] in seen:continue
   seen.add(item["source_page"])
   yield item

def vision_check(image,scene,candidate):
 """One vision call, with scene + photo metadata. Fail closed on error."""
 key=os.getenv("OPENAI_API_KEY")
 if not key:raise RuntimeError("No OPENAI_API_KEY; visual review not attempted")
 if os.getenv("KANGAERU_V7_FULL_APPROVED")!="YES":raise RuntimeError("Full-story approval missing")
 from openai import OpenAI
 client=OpenAI(api_key=key,timeout=90,max_retries=0)
 t=topic(scene)
 reference=ILLUSTRATIVE_SUBJECTS.get(t,scene.get("photo_subject",""))
 prompt=("Select photos for a documentary as VISUAL ILLUSTRATIONS, not photographs "
         "purporting to record the exact historical study or narrated decision. "
         "Judge what is visibly in the image, not whether every incidental detail "
         "in a scene-specific wish list is present. "
         "A clear soccer goalkeeper near a soccer goal is relevant for a GK/PK scene "
         "even if spectators, penalty spot, and exact dive direction are not simultaneously visible. "
         "A real medical consultation is relevant for the doctor decision chapter; "
         "a hospital building by itself is not. A political Oval Office meeting is NOT a "
         "generic workplace decision scene. Reject schematic diagrams, watermarks, "
         "irrelevant stock photos, unrelated entities and ambiguous subjects. "
         "Reject photos that would mislead the audience when labeled 'illustrative photograph'. "
         "Do not assert the photo documents the cited experiment. "
         "Narration: "+scene["narration_text"][:250]+
         "\nCORE VISUAL SUBJECT (must be visibly present): "+reference+
         "\nOriginal detailed request (optional props, not mandatory): "+scene.get("photo_subject","")+
         "\nPhoto filename: "+candidate["title"]+
         "\nFile description: "+candidate.get("description","")[:190]+
         "\nReturn is_match true only for clear visible core-subject matches "
         "with confidence >=0.85. Provide a grounded actual_visible_subject and brief reason.")
 response=client.responses.create(model=MODEL,input=[{"role":"user","content":[
   {"type":"input_text","text":prompt},
   {"type":"input_image","image_url":"data:image/jpeg;base64,"+base64.b64encode(image).decode("ascii"),"detail":"low"}
 ]}],text={"format":{"type":"json_schema","name":"photo_subject_match","strict":True,"schema":SCHEMA}},
 max_output_tokens=650,store=False)
 verdict=json.loads(response.output_text)
 usage=response.usage.model_dump() if response.usage is not None else {}
 input_tokens=int(usage.get("input_tokens",0))
 output_tokens=int(usage.get("output_tokens",0))
 cached=int((usage.get("input_tokens_details") or {}).get("cached_tokens",0))
 cost=(max(0,input_tokens-cached)*2.0+cached*.2+output_tokens*12.0)/1e6
 return verdict,{"model_returned":response.model,"input_tokens":input_tokens,
                 "output_tokens":output_tokens,"cached_input_tokens":cached,
                 "estimated_cost_usd":round(cost,7)}

def select(board,out,max_photos=18,max_vision_calls=30):
 out=Path(out);out.mkdir(parents=True,exist_ok=True)
 (out/"photos").mkdir(exist_ok=True)
 scenes=board["scenes"]
 promoted=promote_relevant_photo_scenes(scenes,limit=16)
 scene_stats=[];accepted=[];usage=[];rejections=[];fallbacks=[]
 uses=Counter();call_count=0
 for s in scenes:
  if s.get("primary_visual")!="photo":continue
  if len(accepted)>=max_photos:
   reason="photograph cap reached";fallbacks.append({"scene":s["id"],"reason":reason})
   s["primary_visual"]="diagram";s["photo_status"]="fallback_diagram";continue
  found=None;reason="no suitable CC0/PD candidate with visually verified subject"
  for c in candidate_images(s):
   if uses[c["source_page"]]>=2:continue
   if call_count>=max_vision_calls:break
   try:
    rr=requests.get(c["download_url"],headers=materials.HEADERS,timeout=40)
    rr.raise_for_status()
    if len(rr.content)>9000000:continue
    raw,size=small_image(rr.content)
    if min(size)<350:continue
    call_count+=1
    verdict,meter=vision_check(raw,s,c)
    usage.append({"scene":s["id"],"image":c["source_page"],"verdict":verdict,"usage":meter})
    if verdict["is_match"] is not True or float(verdict["confidence"])<.85:
     rejections.append({"scene":s["id"],"image":c["source_page"],"reason":verdict["reason"][:180]})
     continue
    fname=out/"photos"/(s["id"]+".jpg")
    fname.write_bytes(raw)
    found={"scene":s["id"],"file":str(fname),"sha256":hashlib.sha256(raw).hexdigest(),
     "source_page":c["source_page"],"title":c["title"],"author":c.get("author",""),
     "license":c["license"],"license_url":c.get("license_url",""),
     "visual_verification":verdict,"model":meter["model_returned"],"photo_role":"illustrative_footage"}
    uses[c["source_page"]]+=1
    break
   except Exception as e:
    rejections.append({"scene":s["id"],"image":c["source_page"],
      "reason":"Failed closed: "+type(e).__name__+": "+str(e)[:150]})
  if found:
   accepted.append(found)
   s["photo_file"]=found["file"];s["photo_status"]="visually_verified"
  else:
   s["primary_visual"]="diagram"
   s["photo_status"]="fallback_diagram"
   if s.get("composition")=="single_symbol" and not s.get("icon_spec"):
    s["composition"]="hero_question"
   fallbacks.append({"scene":s["id"],"reason":reason})
 # Verify every used photograph has license, retained rights metadata and image hash.
 for a in accepted:
  assert a["license"] in ("CC0","Public Domain")
  assert a["visual_verification"]["is_match"] is True and a["visual_verification"]["confidence"]>=.85
  assert Path(a["file"]).is_file() and hashlib.sha256(Path(a["file"]).read_bytes()).hexdigest()==a["sha256"]
 ledger={"version":"v7-photo-qa","photos":accepted,"rejected":rejections,
         "fallbacks":fallbacks,"vision_requests":call_count,
         "vision_usage":{"input_tokens":sum(x["usage"]["input_tokens"] for x in usage),
            "output_tokens":sum(x["usage"]["output_tokens"] for x in usage),
            "estimated_cost_usd":round(sum(x["usage"]["estimated_cost_usd"] for x in usage),6)},
         "vision_log":usage,"promoted_photo_scenes":promoted,
         "limitations":["Vision matching is model judgment and must be visually checked by the user.",
           "Only Commons per-file CC0/Public Domain metadata is accepted.",
           "Unverified or mismatched images are excluded; diagrams are displayed instead."]}
 (out/"photo_ledger.json").write_text(json.dumps(ledger,ensure_ascii=False,indent=2),encoding="utf8")
 (out/"storyboard_with_photos.json").write_text(json.dumps(board,ensure_ascii=False,indent=2),encoding="utf8")
 qa={"passed":True,"photographs_accepted":len(accepted),
     "photo_scene_count":len(accepted),"photo_fallback_scene_count":len(fallbacks),
     "license_failures":0,"unverified_photographs_used":0,
     "vision_requests":call_count,"requests_capped":call_count<=max_vision_calls,"promoted_photo_scenes":len(promoted)}
 (out/"qa_photos.json").write_text(json.dumps(qa,ensure_ascii=False,indent=2),encoding="utf8")
 print(json.dumps(qa,ensure_ascii=False),flush=True)
 return board,ledger,qa

if __name__=="__main__":
 p=argparse.ArgumentParser();p.add_argument("--plan",required=True);p.add_argument("--out",required=True)
 a=p.parse_args();board=json.loads(Path(a.plan).read_text(encoding="utf8"));select(board,a.out)
