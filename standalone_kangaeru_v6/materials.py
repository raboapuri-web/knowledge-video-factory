#!/usr/bin/env python3
"""Keyless Wikimedia Commons CC0 / public-domain search, verification, selection and safe fallback.

Search results are *not* trusted: each candidate's original Commons metadata
must explicitly identify CC0/Public domain. No stock/CC-BY/unknown-image fallback.
"""
from __future__ import annotations
import argparse, hashlib, io, json, re, time, html
from pathlib import Path
from urllib.parse import quote
import requests
from PIL import Image, ImageOps

API="https://commons.wikimedia.org/w/api.php"
HEADERS={"User-Agent":"KangaeruYoru-v6/1.0 (scholarly video production; https://github.com/raboapuri-web/knowledge-video-factory)"}
EXCLUDE=re.compile(r"logo|watermark|poster|cover|svg|icon|collage|flag|map",re.I)
REJECT=re.compile(r"licens|copyright|protected|noncommercial",re.I)
FALLBACK_ICON={
 "football":"eye","medical":"flask","work":"people","crowd":"people",
 "rescue":"scales","history":"book","nature":"tree","economy":"growth_chart",
 "science":"microscope","technology":"gears","city":"network"}
TOPIC_QUERIES={
 "football":["goalkeeper football", "football penalty kick", "soccer stadium"],
 "medical":["hospital doctor", "medical hospital"],
 "work":["office meeting", "workplace"],
 "crowd":["crowd stadium", "spectators football"],
 "rescue":["firefighters rescue", "ambulance rescue"],
 "history":["historic soldiers", "historical photograph"],
 "nature":["forest landscape", "plants nature"],
 "economy":["banknotes coin", "financial market"],
 "science":["laboratory microscope", "science experiment"],
 "technology":["computer technology", "computer lab"],
 "city":["city street", "road transport"]
}

def plain(text):
 return html.unescape(re.sub(r"<[^>]*>","",str(text or ""))).strip()

def license_ok(meta):
 name=plain(meta.get("LicenseShortName","")).lower().strip()
 url=str(meta.get("LicenseUrl","")).lower()
 # Explicit PD and CC0 only; never treat any CC license as equivalent to CC0.
 if name=="cc0" or "creativecommons.org/publicdomain/zero/1.0" in url:return "CC0"
 if name in ("public domain","pd","pd-self","public domain mark") or "creativecommons.org/publicdomain/mark/1.0" in url:return "Public Domain"
 return None

def api_search(query,max_results=20,session=requests):
 params={"action":"query","format":"json","generator":"search","gsrnamespace":6,
         "gsrsearch":query,"gsrlimit":max_results,"prop":"imageinfo",
         "iiprop":"url|extmetadata|size","iiurlwidth":1280}
 r=session.get(API,params=params,headers=HEADERS,timeout=35)
 r.raise_for_status()
 obj=r.json()
 return list(obj.get("query",{}).get("pages",{}).values())

def relevance(page,query):
 title=str(page.get("title","")).lower().replace("_"," ")
 words=[x.lower() for x in query.split() if len(x)>=4]
 score=sum(2 if w in title else 0 for w in words)
 # Prefer photographic titles, not random metadata-labeled diagrams.
 return score

def pick_candidates(query,session=requests):
 raw=api_search(query,session=session)
 out=[]
 for page in raw:
  title=str(page.get("title",""))
  if EXCLUDE.search(title):continue
  if not re.search(r"\.(?:jpe?g|png|webp)$",title,re.I):continue
  info=(page.get("imageinfo") or [None])[0]
  if not info:continue
  meta={k:v.get("value","") for k,v in info.get("extmetadata",{}).items()}
  lic=license_ok(meta)
  if not lic:continue
  if (info.get("width") or 0)<600 or (info.get("height") or 0)<350:continue
  url=info.get("thumburl") or info.get("url")
  if not isinstance(url,str) or not url.startswith("https://"):continue
  score=relevance(page,query)
  if score<2:continue
  out.append({"title":title,"source_page":"https://commons.wikimedia.org/wiki/"+quote(title.replace(" ","_"),safe=":_"),
      "download_url":url,"license":lic,"license_url":plain(meta.get("LicenseUrl","")),
      "author":plain(meta.get("Artist",""))[:160],"description":plain(meta.get("ImageDescription",""))[:260],
      "score":score,"source_width":info.get("width"),"source_height":info.get("height")})
 return sorted(out,key=lambda x:(-x["score"],-int(x["source_width"] or 0)))

def store_one(candidate,folder,seq,session=requests):
 r=session.get(candidate["download_url"],headers=HEADERS,timeout=50)
 r.raise_for_status()
 raw=r.content
 im=Image.open(io.BytesIO(raw));im.load()
 if im.width<600 or im.height<350:raise ValueError("Candidate too small")
 if im.width/im.height>4 or im.height/im.width>4:raise ValueError("Extremely narrow image")
 fname=folder/f"photo_{seq:02d}.jpg"
 ImageOps.exif_transpose(im).convert("RGB").save(fname,quality=88,optimize=True)
 out={k:v for k,v in candidate.items() if k!="download_url"}
 out.update({"id":f"photo_{seq:02d}","file":str(fname),"width":im.width,"height":im.height,
             "sha256":hashlib.sha256(fname.read_bytes()).hexdigest(),"rights_checked":True})
 return out

def choose_materials(board,out,session=requests,max_downloads=12):
 out=Path(out);out.mkdir(parents=True,exist_ok=True)
 folder=out/"photos";folder.mkdir(exist_ok=True)
 scenes=board["scenes"]
 by_topic={};attempts=[];assets=[];completed=set()
 for scene in scenes:
  scene["asset_id"]=None
  scene["fallback_reason"]=None
  # Only photographic scenes get a Wikimedia photo; other scenes stay editorial graphics.
  if scene["visual_strategy"]!="photo":continue
  topic=scene.get("topic")
  if not topic or topic not in TOPIC_QUERIES:
   scene["fallback_reason"]="No semantically related keyless search phrase"
   scene["visual_strategy"]="icon"
   scene["icon"]=FALLBACK_ICON.get(topic,"eye")
   continue
  if topic in by_topic:
   scene["asset_id"]=by_topic[topic]
   continue
  if len(assets)>=max_downloads:
   scene["fallback_reason"]="Download cap reached"
   scene["visual_strategy"]="diagram"
   scene["icon"]=FALLBACK_ICON.get(topic,"eye")
   continue
  candidates=[]
  for term in TOPIC_QUERIES[topic]:
   try:
    xs=pick_candidates(term,session)
    attempts.append({"topic":topic,"query":term,"license_checked":True,"candidate_count":len(xs)})
    candidates+=xs
    if xs:break
   except Exception as e:
    attempts.append({"topic":topic,"query":term,"error":type(e).__name__+": "+str(e)[:150]})
  seen=set()
  usable=[c for c in candidates if not (c["source_page"] in seen or seen.add(c["source_page"]))]
  selected=None
  for candidate in usable[:6]:
   if candidate["source_page"] in completed:continue
   try:selected=store_one(candidate,folder,len(assets)+1,session);break
   except Exception as e:
    attempts.append({"topic":topic,"title":candidate["title"],"download_error":str(e)[:150]})
  if selected:
   assets.append(selected)
   completed.add(selected["source_page"])
   by_topic[topic]=selected["id"]
   scene["asset_id"]=selected["id"]
  else:
   scene["fallback_reason"]="No relevant image with confirmed CC0/PD rights and usable resolution"
   scene["visual_strategy"]="diagram"
   scene["icon"]=FALLBACK_ICON.get(topic,"eye")
 # Integrity/provenance checks; do not represent fallback icons as photos.
 for scene in scenes:
  if scene["visual_strategy"]=="photo":
   assert scene["asset_id"] in {a["id"] for a in assets}
  if scene["fallback_reason"]:assert scene["visual_strategy"]!="photo"
 for a in assets:
  assert a["license"] in ("CC0","Public Domain")
  assert a["rights_checked"] and Path(a["file"]).is_file()
  assert hashlib.sha256(Path(a["file"]).read_bytes()).hexdigest()==a["sha256"]
 ledger={"version":"v6.0","license_rule":"strict Commons file-level CC0/PD metadata",
         "photos":assets,"search_attempts":attempts,"fallback_scenes":[{"scene_id":s["id"],"reason":s["fallback_reason"],"icon":s.get("icon")} for s in scenes if s["fallback_reason"]]}
 (out/"materials.json").write_text(json.dumps(ledger,ensure_ascii=False,indent=2),encoding="utf8")
 (out/"storyboard_with_assets.json").write_text(json.dumps(board,ensure_ascii=False,indent=2),encoding="utf8")
 report={"passed":True,"photos_licensed":len(assets),"photo_scenes":sum(x["visual_strategy"]=="photo" for x in scenes),
         "fallback_scenes":len(ledger["fallback_scenes"]),
         "rejected_unverified":True,"no_api_key_required":True,
         "all_assets_integrity_checked":True}
 (out/"qa_materials.json").write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding="utf8")
 print(json.dumps(report,ensure_ascii=False))
 return board,ledger,report

def main():
 p=argparse.ArgumentParser()
 p.add_argument("--board",required=True);p.add_argument("--output-dir",required=True)
 args=p.parse_args()
 board=json.loads(Path(args.board).read_text(encoding="utf8"))
 choose_materials(board,args.output_dir)

if __name__=="__main__":main()
