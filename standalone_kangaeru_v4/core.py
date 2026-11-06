"""独立型「考える夜」v4 企画/素材/ナレーション処理。外部APIキー不要のテストモード。
写真は画像ごとに Commons API のCC0権利を確認してから取得する。
"""
from __future__ import annotations
import hashlib, io, json, os, re, shutil, struct, subprocess, time, wave
from pathlib import Path
from urllib.parse import quote
import requests
from PIL import Image, ImageDraw, ImageOps

W,H=1280,720
ROLES={"photo","evidence","spectrum","diagram","contrast","statement","question","title","outro","icon"}
ICON_NAMES=["brain","eye","book","hourglass","globe","institution","microscope","flask","dna","atom",
"sprout","tree","scales","people","network","mind","growth_chart","pie_chart","magnifier","gears",
"cycle","hierarchy","chevrons","fire"]
PHOTO_FILES={
 "forest":("Spruce forest at Holma.jpg","W.carter","トウヒの森林"),
 "moss":("Andreaea rupestris (a, 141109-472338) 9773.JPG","HermannSchachner","クロゴケ")
}
HEADERS={"User-Agent":"Kangaeru-Yoru-Factory/0.4 (academic videos; contact via repository Issues)"}

def make_storyboard(data):
 assert isinstance(data.get("scenes"),list) and len(data["scenes"])>=3
 ids=[]
 scenes=[]
 for i,chunk in enumerate(data["scenes"]):
  for field in ("id","subtitle","speech"):assert chunk.get(field),str(chunk)
  assert chunk["id"] not in ids,"duplicate scene ID"
  ids.append(chunk["id"])
  s=chunk["subtitle"];kind=chunk.get("visual_strategy")
  if kind not in ROLES:
   if i==0:kind="title"
   elif i==len(data["scenes"])-1:kind="outro"
   elif "コケ" in s:kind="evidence"
   elif "葉緑素" in s or "反射" in s:kind="spectrum"
   elif "森" in s or "森林" in s:kind="photo"
   elif "吸収" in s:kind="diagram"
   else:kind=("contrast","icon","statement")[i%3]
  if scenes and kind==scenes[-1]["style"] and kind in ("statement","icon","question"):
   kind="contrast"
  icon=chunk.get("icon","sprout")
  assert icon in ICON_NAMES,"unregistered icon: "+str(icon)
  photo=chunk.get("photo","moss" if kind=="evidence" else "forest")
  assert photo in PHOTO_FILES
  scenes.append({"id":chunk["id"],"subtitle":s,"speech":chunk["speech"],
  "style":kind,"icon":icon,"photo":photo,
  "visual_intent":chunk.get("visual_intent") or "この主張の意味を映像で示す",
  "claim":chunk.get("claim",s)})
 return {"title":data["title"],"scenes":scenes,
         "art_direction":{"name":"premium_black_gold_v3","subtitle_alignment":"center",
          "subtitle_zone":[0,586,1280,134],"colors":{"background":"#0b0b0d","gold":"#d5b276"}}}

def pages(text, max_chars=19):
 """一行が長いときは自然な句読点で分割。文字を勝手に削らない。"""
 a=[];remain=text.strip()
 while remain:
  if len(remain)<=max_chars:a.append(remain);break
  k=max((remain.rfind(p,6,max_chars+1) for p in "、。！？"),default=-1)
  if k<6:k=max_chars
  else:k+=1
  a.append(remain[:k]);remain=remain[k:]
 return ["\n".join(a[i:i+2]) for i in range(0,len(a),2)]

def wav_seconds(filename):
 with wave.open(str(filename),"rb") as f:return f.getnframes()/f.getframerate()

from functools import lru_cache

@lru_cache(maxsize=8)
def resolve_voicevox_speaker(voicevox_url, speaker_name="青山龍星", style_name="ノーマル"):
 """Resolve by actual name rather than guessing an ID; fail when model is absent."""
 base=voicevox_url.rstrip("/")
 r=requests.get(base+"/speakers",timeout=45)
 r.raise_for_status()
 for speaker in r.json():
  if speaker.get("name")==speaker_name:
   for style in speaker.get("styles",[]):
    if style.get("name")==style_name and style.get("type","talk") in ("talk","streaming_talk"):
     resolved=int(style["id"])
     if speaker_name=="青山龍星" and style_name=="ノーマル" and resolved!=13:
      raise RuntimeError("青山龍星 ノーマル Talk ID expected 13, got "+str(resolved))
     return resolved
 raise RuntimeError("VOICEVOX speaker/style unavailable: "+speaker_name+"/"+style_name+"; matching speakers/styles: "+repr([{"name":sp.get("name"),"styles":sp.get("styles")} for sp in r.json() if "青山" in sp.get("name","") or "龍星" in sp.get("name","")]))

def tts_chunk(text,path,voicevox_url=""):
 """Mandatory original VOICEVOX synthesis. Never silently use espeak-ng."""
 if not voicevox_url:
  raise RuntimeError("VOICEVOX_URL is required; no espeak-ng fallback is permitted")
 base=voicevox_url.rstrip("/")
 speaker_name=os.getenv("VOICEVOX_SPEAKER_NAME","青山龍星")
 style=os.getenv("VOICEVOX_STYLE","ノーマル")
 speaker=resolve_voicevox_speaker(base,speaker_name,style)
 q=requests.post(base+"/audio_query",params={"text":text,"speaker":speaker},timeout=90)
 q.raise_for_status()
 body=q.json()
 body["speedScale"]=float(os.getenv("VOICEVOX_SPEED","1.06"))
 body["intonationScale"]=float(os.getenv("VOICEVOX_INTONATION","1.02"))
 body["prePhonemeLength"]=0.08
 body["postPhonemeLength"]=0.18
 r=requests.post(base+"/synthesis",params={"speaker":speaker},json=body,timeout=180)
 r.raise_for_status()
 if not r.content.startswith(b"RIFF") or b"WAVE" not in r.content[:16]:
  raise RuntimeError("VOICEVOX did not return a valid WAV file")
 path.write_bytes(r.content)
 if wav_seconds(path)<0.25:raise RuntimeError("VOICEVOX produced abnormally short WAV: "+str(path))

def make_timeline(board,out,voicevox_url=""):
 (out/"speech").mkdir(parents=True,exist_ok=True)
 timeline=[];t=0.0
 for scene in board["scenes"]:
  fname=out/"speech"/(scene["id"]+".wav")
  tts_chunk(scene["speech"],fname,voicevox_url)
  duration=wav_seconds(fname)
  if duration<0.3:raise RuntimeError("empty narration: "+scene["id"])
  duration+=0.48 # transition silence, keeps subtitles legible
  pgs=pages(scene["subtitle"])
  page_durations=[duration/len(pgs)]*len(pgs)
  timeline.append({"id":scene["id"],"start":round(t,4),"end":round(t+duration,4),
    "wav":str(fname),"wav_duration":round(duration-.48,4),
    "subtitles":[{"text":p,"start":round(t+j*duration/len(pgs),4),
                   "end":round(t+(j+1)*duration/len(pgs),4)}
                 for j,p in enumerate(pgs)]})
  t+=duration
 return timeline

def is_cc0(meta):
 name=str(meta.get("LicenseShortName","")).strip().upper()
 url=str(meta.get("LicenseUrl","")).lower()
 return name in ("CC0","PD","PUBLIC DOMAIN") or "creativecommons.org/publicdomain/zero/1.0" in url

def acquire_photo(key,out,strict=True):
 name,creator,subject=PHOTO_FILES[key]
 page="File:"+name
 param={"action":"query","format":"json","prop":"imageinfo","iiprop":"url|extmetadata",
         "iiurlwidth":1200,"titles":page}
 r=requests.get("https://commons.wikimedia.org/w/api.php",params=param,headers=HEADERS,timeout=30)
 r.raise_for_status()
 info=next(iter(r.json()["query"]["pages"].values()))["imageinfo"][0]
 meta={k:v.get("value","") for k,v in info.get("extmetadata",{}).items()}
 if not is_cc0(meta):raise RuntimeError("License not confirmed CC0 at individual photo: "+page)
 src=info.get("thumburl") or info["url"]
 req=requests.get(src,headers=HEADERS,timeout=45);req.raise_for_status()
 img=Image.open(io.BytesIO(req.content));img.load()
 if min(img.size)<300:raise RuntimeError("Image resolution too low")
 image=out/(key+".jpg")
 img.convert("RGB").save(image,quality=92)
 return {"id":key,"source_page":"https://commons.wikimedia.org/wiki/"+quote(page.replace(" ","_"),safe=":_"),
 "source_url":info["url"],"author":creator,"subject":subject,"license":"CC0",
 "license_url":meta.get("LicenseUrl","https://creativecommons.org/publicdomain/zero/1.0/"),
 "license_verified_at":time.strftime("%Y-%m-%dT%H:%M:%SZ",time.gmtime()),
 "sha256":hashlib.sha256(image.read_bytes()).hexdigest(),"file":str(image),
 "width":img.width,"height":img.height}

def acquire_all(board,out):
 photos=out/"photos";photos.mkdir(parents=True,exist_ok=True)
 names={s["photo"] for s in board["scenes"] if s["style"] in ("photo","evidence")}
 ledger=[]
 for name in sorted(names):
  try:ledger.append(acquire_photo(name,photos))
  except Exception as e:
   ledger.append({"id":name,"license":"UNVERIFIED","error":str(e)})
 (out/"materials.json").write_text(json.dumps(ledger,indent=2,ensure_ascii=False),encoding="utf8")
 if any(x["license"]!="CC0" for x in ledger):
  raise RuntimeError("CC0 image missing/unchecked; video publication prohibited. Check materials.json")
 return {x["id"]:x for x in ledger}

ORIGINAL_ATLAS=Path(__file__).resolve().parent/"brand"/"8015.png"

def icon_image(name,size=152):
 """Crop the user-supplied 6x4 icon atlas, preserving actual silhouettes.
    No generated substitute icons. Source file remains unchanged in repo.
 """
 assert name in ICON_NAMES,"Unregistered original icon: "+str(name)
 if not ORIGINAL_ATLAS.is_file():
  raise FileNotFoundError(
   "Original 24-icon atlas missing: "+str(ORIGINAL_ATLAS)+
   ". Upload the user's 8015.png to this exact GitHub path. No substitution allowed.")
 with Image.open(ORIGINAL_ATLAS) as src:
  if src.size!=(1536,864):
   raise RuntimeError("Original atlas dimensions do not match 1536x864")
  i=ICON_NAMES.index(name)
  cw,ch=src.width//6,src.height//4
  original=src.convert("RGB").crop(((i%6)*cw,(i//6)*ch,((i%6)+1)*cw,((i//6)+1)*ch))
 gray=ImageOps.grayscale(original)
 # Preserve line shapes from original gold-on-black artwork; only black is removed.
 alpha=gray.point(lambda n: max(0,min(255,round((n-18)*1.8))))
 rgba=Image.new("RGBA",original.size,(222,190,135,0))
 rgba.putalpha(alpha)
 bbox=rgba.getbbox()
 if not bbox: raise RuntimeError("The original icon cell is empty: "+name)
 cropped=rgba.crop(bbox)
 cropped.thumbnail((size,size),Image.Resampling.LANCZOS)
 # Transparent padded canvas retains true optical center.
 result=Image.new("RGBA",(size,size),(0,0,0,0))
 result.alpha_composite(cropped,((size-cropped.width)//2,(size-cropped.height)//2))
 return result


def font(size=44,serif=True):
 """System-installed Japanese fonts for the headless CI renderer."""
 from PIL import ImageFont
 from pathlib import Path
 suffix="NotoSerifCJK-Bold.ttc" if serif else "NotoSansCJK-Regular.ttc"
 candidates=[Path("/usr/share/fonts/opentype/noto")/suffix,
             Path("/usr/share/fonts/truetype/noto")/suffix]
 for c in candidates:
  if c.is_file():return ImageFont.truetype(str(c),size)
 for root in (Path("/usr/share/fonts/opentype/noto"),Path("/usr/share/fonts/truetype/noto")):
  for file in root.glob("Noto*CJK*.ttc"):
   return ImageFont.truetype(str(file),size)
 raise RuntimeError("Install fonts-noto-cjk to render Japanese text")
