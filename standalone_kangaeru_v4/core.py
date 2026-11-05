"""独立型「考える夜」v4 企画/素材/ナレーション処理。外部APIキー不要のテストモード。
写真は画像ごとに Commons API のCC0権利を確認してから取得する。
"""
from __future__ import annotations
import hashlib, io, json, os, re, shutil, struct, subprocess, time, wave
from pathlib import Path
from urllib.parse import quote
import requests
from PIL import Image, ImageDraw

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

def tts_chunk(text,path,voicevox_url=""):
 if voicevox_url:
  r=requests.post(voicevox_url.rstrip("/")+"/audio_query",params={"text":text,"speaker":1},timeout=45);r.raise_for_status()
  r=requests.post(voicevox_url.rstrip("/")+"/synthesis",params={"speaker":1},json=r.json(),timeout=90);r.raise_for_status()
  path.write_bytes(r.content)
 else:
  if not shutil.which("espeak-ng"):raise RuntimeError("espeak-ng unavailable; install it or set VOICEVOX_URL")
  subprocess.run(["espeak-ng","-v","ja","-s","132","-w",str(path),text],check=True,stdout=subprocess.PIPE,stderr=subprocess.PIPE)
 if wav_seconds(path)<0.25:raise RuntimeError("TTS produced abnormally short WAV: "+str(path))

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

def icon_image(name,size=152):
 """独立環境用の意味対応金線画。ユーザーの元アイコン画像と同一であるとは主張しない。"""
 assert name in ICON_NAMES
 im=Image.new("RGBA",(size,size),(0,0,0,0));d=ImageDraw.Draw(im)
 gold=(213,178,118,255);a=size
 def L(coords,width=3):d.line([(round(x*a/160),round(y*a/160)) for x,y in coords],fill=gold,width=max(2,width*a//160),joint="curve")
 def circle(x,y,r,width=3):d.ellipse(tuple(round(z*a/160) for z in (x-r,y-r,x+r,y+r)),outline=gold,width=max(2,width*a//160))
 if name in ("sprout","tree"):
  L([(80,145),(80,74),(52,42)]);L([(80,103),(113,58)])
  d.ellipse((round(21*a/160),round(13*a/160),round(69*a/160),round(66*a/160)),outline=gold,width=3)
  d.ellipse((round(103*a/160),round(19*a/160),round(153*a/160),round(70*a/160)),outline=gold,width=3)
 elif name=="eye":
  d.arc((15*a//160,43*a//160,145*a//160,112*a//160),185,355,fill=gold,width=3);circle(80,80,24)
 elif name=="fire":
  L([(82,137),(38,114),(51,84),(66,96),(76,33),(104,75),(124,102),(105,132),(82,137)])
 elif name in ("book","institution"):
  d.rectangle((27*a//160,35*a//160,133*a//160,125*a//160),outline=gold,width=3)
  L([(80,37),(80,122)])
 elif name in ("scales","hierarchy"):
  L([(80,22),(80,135),(30,135),(130,135)]);L([(34,57),(126,57)])
  L([(34,57),(18,91),(50,91),(34,57)]);L([(126,57),(110,91),(142,91),(126,57)])
 elif name=="hourglass":
  L([(32,25),(128,25),(50,135),(110,135),(32,25)])
 else:
  circle(80,80,57)
  L([(80,31),(80,128)]);L([(35,80),(125,80)])
 return im


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
