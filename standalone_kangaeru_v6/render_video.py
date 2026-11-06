#!/usr/bin/env python3
"""Keyless v6 integration: full script -> semantic storyboard -> Commons photos -> VOICEVOX -> video.
Preserves source narration. Not a peer-reviewed scientific fact checker.
"""
from __future__ import annotations
import argparse, hashlib, json, math, os, re, sys, subprocess, wave
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont,ImageOps,ImageEnhance
HERE=Path(__file__).resolve().parent
V4=HERE.parent/"standalone_kangaeru_v4"
sys.path.insert(0,str(V4))
import core as v4
import render as v4render
import storyboard,materials

W,H=1280,720; BAND=586; FPS=15
BG=(11,11,13);GOLD=(213,178,118);IVORY=(245,236,217);DIM=(151,140,124)
def f(sz,serif=True):return v4.font(max(18,int(sz)),serif=serif)

def text_width(s,sz,tracking=0,serif=True):
 font=f(sz,serif);return sum(font.getlength(ch) for ch in s)+max(0,len(s)-1)*tracking*sz

def textblock(draw,text,x,y,max_w,base_sz=55,max_lines=4,center=False,color=IVORY,tracking=.065,serif=True,line_height=1.36):
 s=re.sub(r"\s+"," ",str(text)).strip() or " "
 for sz in range(base_sz,21,-2):
  ls=[];cur=""
  for ch in s:
   if cur and text_width(cur+ch,sz,tracking,serif)>max_w:
    ls.append(cur);cur=ch
   else:cur+=ch
  if cur:ls.append(cur)
  if len(ls)<=max_lines:break
 if len(ls)>max_lines:raise ValueError("Scene text overflow: "+s[:100])
 for line in ls:
  px=x if not center else round(x-text_width(line,sz,tracking,serif)/2)
  curx=px
  for ch in line:
   draw.text((round(curx),int(y)),ch,font=f(sz,serif),fill=color)
   curx+=f(sz,serif).getlength(ch)+sz*tracking
  y+=sz*line_height
 return y

def label(draw,text,x,y,color=GOLD):
 draw.text((x,y),text,font=f(18,False),fill=color)

def cover(path,w,h):
 with Image.open(path) as im:
  im=ImageOps.exif_transpose(im.convert("RGB"))
  im=ImageOps.fit(im,(w,h),Image.Resampling.LANCZOS)
  return ImageEnhance.Color(im).enhance(.78)

def icon(name,size):
 try:return v4.icon_image(name,size)
 except Exception:raise RuntimeError("The original registered 24-icon artwork is mandatory: "+name)

def topic_icon(topic):
 return materials.FALLBACK_ICON.get(topic,"eye")

def draw_background(draw,kind):
 if kind in ("title","chapter","outro"):
  for r in (240,290,346):
   draw.arc((90-r,270-r,90+r,270+r),285,430,fill=(70,56,38),width=2)
 if kind in ("diagram","process","contrast"):
  draw.line((76,118,1195,118),fill=(88,73,49),width=2)

def base_image(scene,asset_paths):
 img=Image.new("RGB",(W,H),BG);d=ImageDraw.Draw(img)
 k=scene["visual_strategy"];hero=scene["hero"]; chapter=scene["chapter_title"]
 draw_background(d,k)
 label(d,"考える夜    /    K A N G A E R U   Y O R U",76,42)
 d.line((76,74,1200,74),fill=(55,49,39),width=1)
 if k=="photo":
  ap=asset_paths.get(scene.get("asset_id"))
  if not ap:raise RuntimeError("Photo scene without licensed image")
  pic=cover(ap,746,464);img.paste(pic,(0,111))
  d=ImageDraw.Draw(img)
  d.rectangle((0,111,746,575),outline=(96,78,49),width=2)
  label(d,"CC0 / PD SOURCE IMAGE",773,153)
  textblock(d,hero,773,238,423,49,5,color=IVORY)
 elif k in ("title","chapter","outro"):
  x=120 if k=="title" else 130
  label(d,("NEW QUESTION" if k=="title" else "CHAPTER / "+scene["chapter_id"] if k=="chapter" else "AFTERTHOUGHT"),x,147)
  textblock(d,hero,x,225,985,64 if k!="chapter" else 50,4,color=IVORY)
  ic=icon(topic_icon(scene.get("topic")),106);img.paste(ic,(1050,390),ic)
 elif k=="stat":
  nums=scene.get("numbers_from_script",[])
  val=nums[0] if nums else ""
  label(d,"EVIDENCE / NUMERICAL CLAIM FROM SCRIPT",105,149)
  if val:textblock(d,val,104,225,1060,116,2,color=GOLD,tracking=.035)
  textblock(d,scene["subtitle"],110,405,1080,37,3,color=IVORY,tracking=.055)
 elif k=="comparison":
  d.line((637,151,637,524),fill=(115,90,59),width=2)
  label(d,"CONTRAST / CHOICES",104,148)
  ic1=icon("scales",190);ic2=icon("eye",190)
  img.paste(ic1,(210,220),ic1);img.paste(ic2,(851,220),ic2)
  textblock(d,hero,114,444,1070,39,3,color=IVORY)
 elif k in ("diagram","process"):
  label(d,"STRUCTURE  /  "+k.upper(),106,145)
  names=["eye","network","scales"] if k=="diagram" else ["eye","gears","growth_chart"]
  for n,x in zip(names,[160,545,930]):
   ii=icon(n,148);img.paste(ii,(x,221),ii)
  d=ImageDraw.Draw(img)
  d.line((325,294,538,294),fill=GOLD,width=3);d.line((713,294,922,294),fill=GOLD,width=3)
  textblock(d,hero,114,430,1070,37,3,color=IVORY)
 elif k=="icon":
  name=topic_icon(scene.get("topic"))
  ii=icon(name,320);img.paste(ii,(106,170),ii)
  label(d,"OBSERVATION",510,145)
  textblock(d,hero,508,256,675,54,4,color=IVORY)
 elif k=="quote":
  label(d,"A QUESTION / REPORTED WORDS",116,154)
  d.line((119,211,119,508),fill=GOLD,width=4)
  textblock(d,hero,172,269,945,56,4,color=IVORY)
 elif k=="question":
  label(d,"WHY?",130,136)
  ic=icon("eye",170);img.paste(ic,(924,290),ic)
  textblock(d,hero,130,268,824,55,4,color=IVORY)
 elif k=="contrast":
  label(d,"ASSUMPTION  /  RECONSIDERED",119,151)
  ic=icon("scales",198);img.paste(ic,(124,251),ic)
  textblock(d,hero,472,269,707,52,4,color=IVORY)
 elif k=="statement":
  label(d,"REFLECTION",112,145)
  d.line((108,214,1194,214),fill=(108,84,54),width=2)
  textblock(d,hero,132,270,998,58,4,color=IVORY)
 else:raise ValueError("Unknown style "+k)
 d=ImageDraw.Draw(img)
 d.line((75,558,1196,558),fill=(60,51,38),width=1)
 label(d,scene["chapter_title"],86,564,color=DIM)
 return img

def subtitles(scene,duration,t):
 # Inherit proven v5 subtitle logic, centered in the reserved bottom zone.
 chunks=v4.pages(scene["subtitle"])
 offset=min(len(chunks)-1,int(max(0,t)/max(duration,0.01)*len(chunks)))
 return chunks[offset]

def render(board,ledger,out,timeline):
 paths={x["id"]:x["file"] for x in ledger["photos"]}
 base={scene["id"]:base_image(scene,paths) for scene in board["scenes"]}
 # Gallery: exact generated images, including licensed photographs.
 sheet=Image.new("RGB",(1280,math.ceil(len(base)/4)*180),BG)
 for i,im in enumerate(base.values()):
  sheet.paste(im.resize((320,180)),((i%4)*320,(i//4)*180))
 sheet.save(out/"contact_sheet.jpg",quality=87)
 first=next(iter(base.values()));first.save(out/"thumbnail.jpg",quality=90)
 outvid=out/"video_only.mp4"
 proc=subprocess.Popen(["ffmpeg","-y","-v","error","-f","rawvideo","-pix_fmt","rgb24",
 "-s",f"{W}x{H}","-r",str(FPS),"-i","pipe:0","-an","-c:v","libx264","-preset","ultrafast",
 "-crf","22","-pix_fmt","yuv420p",str(outvid)],stdin=subprocess.PIPE)
 try:
  ti=0
  for entry in timeline:
   s=board["scenes"][ti];ti+=1
   duration=entry["end"]-entry["start"]
   count=max(1,round(duration*FPS))
   for j in range(count):
    local=j/FPS
    canvas=base[s["id"]].copy()
    # One restrained scene-relevant cue, no repetitive full-screen effects.
    if s["visual_strategy"] in ("diagram","stat","process"):
     d=ImageDraw.Draw(canvas)
     prog=min(1,max(0,local/1.4))
     d.line((88,533,88+int(580*prog),533),fill=GOLD,width=3)
    frame=v4render.subtitle_draw(canvas,subtitles(s,duration,local))
    proc.stdin.write(frame.tobytes())
  proc.stdin.close()
  if proc.wait()!=0:raise RuntimeError("FFmpeg video encoding failed")
 except Exception:
  proc.kill();raise
 audio=v4render.audio_mix(timeline,out)
 final=out/"final.mp4"
 subprocess.run(["ffmpeg","-v","error","-y","-i",str(outvid),"-i",str(audio),
 "-c:v","copy","-c:a","aac","-b:a","160k","-movflags","+faststart","-shortest",str(final)],check=True)
 return final

def audit(board,ledger,timeline,final,out,style_id):
 scene_ids={s["id"] for s in board["scenes"]}
 assets={x["id"] for x in ledger["photos"]}
 checks={
  "source_preserved":len(scene_ids)==len(board["scenes"]) and all(s["source_paragraphs"] for s in board["scenes"]),
  "six_original_chapters":len(board["chapters"])==6,
  "semantic_scene_diversity":len({s["visual_strategy"] for s in board["scenes"]})>=6,
  "all_photos_rights_verified":all(x["license"] in ("CC0","Public Domain") and x["rights_checked"] and hashlib.sha256(Path(x["file"]).read_bytes()).hexdigest()==x["sha256"] for x in ledger["photos"]),
  "all_photo_assignments_valid":all(s.get("asset_id") in assets for s in board["scenes"] if s["visual_strategy"]=="photo"),
  "original_24_icons":v4.ORIGINAL_ATLAS.is_file() and v4.ORIGINAL_ATLAS.stat().st_size==140555,
  "aoyama_normal_talk_13":style_id==13,
  "voicevox_only":all(Path(e["wav"]).exists() and e["wav_duration"]>.3 for e in timeline),
  "subtitles_centered":board["art_direction"]["subtitle_alignment"]=="center",
  "timeline_continuity":all(abs(timeline[i]["start"]-timeline[i-1]["end"])<.01 for i in range(1,len(timeline))),
  "subtitle_text_intact":all("".join(x.replace("\n","") for x in v4.pages(s["subtitle"]))==s["subtitle"] for s in board["scenes"]),
  "output_exists":final.exists() and final.stat().st_size>100000
 }
 try:
  x=subprocess.run(["ffprobe","-v","error","-show_entries","format=duration:stream=codec_type,width,height",
  "-of","json",str(final)],check=True,capture_output=True,text=True)
  result=json.loads(x.stdout)
  kinds={s.get("codec_type") for s in result["streams"]}
  video=next((x for x in result["streams"] if x.get("codec_type")=="video"),{})
  duration=float(result["format"]["duration"])
  checks["mp4_streams"]={"audio","video"}<=kinds and video.get("width")==W and video.get("height")==H
  checks["duration_sync"]=abs(duration-timeline[-1]["end"])<1.2
 except Exception as ex:
  duration=None;checks["mp4_streams"]=False;checks["duration_sync"]=False
 report={"passed":all(checks.values()),"checks":checks,"duration_seconds":duration,
 "scene_count":len(board["scenes"]),"chapter_count":len(board["chapters"]),
 "photographs":len(ledger["photos"]),"voice":"VOICEVOX:青山龍星","style":"ノーマル","voice_style_id":style_id,
 "warnings":["Rule-based semantic planning, not LLM-level understanding.",
 "Photos are category-level illustrations, not necessarily original events described by narration.",
 "No independent academic fact-checking or listening-based pronunciation review.",
 "Storyboard and subtitle timings are scene- and page-based, not word-aligned.",
 "Visual/editorial quality still requires human review."]}
 (out/"qa_final.json").write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding="utf8")
 return report

def main():
 p=argparse.ArgumentParser()
 p.add_argument("--source",required=True);p.add_argument("--output-dir",required=True)
 p.add_argument("--voicevox-url",default=os.getenv("VOICEVOX_URL","http://127.0.0.1:50021"))
 args=p.parse_args()
 out=Path(args.output_dir);out.mkdir(parents=True,exist_ok=True)
 src=json.loads(Path(args.source).read_text(encoding="utf8"))
 board=storyboard.split_source(src)
 (out/"storyboard.json").write_text(json.dumps(board,ensure_ascii=False,indent=2),encoding="utf8")
 (out/"qa_storyboard.json").write_text(json.dumps(storyboard.verify(board,src),ensure_ascii=False,indent=2),encoding="utf8")
 board,ledger,materials_report=materials.choose_materials(board,out)
 # Resolve actual speaker style through live local /speakers; do not silently use another voice.
 style_id=v4.resolve_voicevox_speaker(args.voicevox_url,"青山龍星","ノーマル")
 if style_id!=13:raise RuntimeError("Wrong 青山龍星 talk style ID: "+str(style_id))
 timeline=[];clock=0.0
 (out/"speech").mkdir(exist_ok=True)
 for s in board["scenes"]:
  audio=out/"speech"/(s["id"]+".wav")
  v4.tts_chunk(s["speech"],audio,args.voicevox_url)
  seconds=v4.wav_seconds(audio);length=seconds+.48
  timeline.append({"id":s["id"],"wav":str(audio),"wav_duration":round(seconds,4),
    "start":round(clock,4),"end":round(clock+length,4)})
  clock+=length
 (out/"timeline.json").write_text(json.dumps(timeline,ensure_ascii=False,indent=2),encoding="utf8")
 # SRT captions from audio-derived times, split into <= 2 Japanese centered lines.
 def stamp(x):
  ms=round(x*1000);hr=ms//3600000;mi=(ms//60000)%60;se=(ms//1000)%60
  return f"{hr:02d}:{mi:02d}:{se:02d},{ms%1000:03d}"
 cues=[];n=0
 for s,t in zip(board["scenes"],timeline):
  chunks=v4.pages(s["subtitle"])
  for i,chunk in enumerate(chunks):
   n+=1;start=t["start"]+i*(t["end"]-t["start"])/len(chunks)
   end=t["start"]+(i+1)*(t["end"]-t["start"])/len(chunks)
   cues.extend([str(n),stamp(start)+" --> "+stamp(end),chunk,""])
 (out/"captions.srt").write_text("\n".join(cues),encoding="utf8")
 credits=["ナレーション: VOICEVOX:青山龍星（ノーマル）","写真（各作品の権利表示は個別確認済み）:"]
 for a in ledger["photos"]:
  credits.append(f"- {a['source_page']} / {a['license']} / {a['author']}")
 (out/"description.md").write_text(src["title"]+"\n\n"+"台本出典: "+src.get("source_url","")+"\n\n"+"\n".join(credits),encoding="utf8")
 for n in v4.ICON_NAMES:
  folder=out/"icons";folder.mkdir(exist_ok=True)
  v4.icon_image(n).save(folder/(n+".png"))
 (out/"icon_origin.json").write_text(json.dumps({"original_atlas":str(v4.ORIGINAL_ATLAS),"sha256":hashlib.sha256(v4.ORIGINAL_ATLAS.read_bytes()).hexdigest(),"count":24},ensure_ascii=False,indent=2),encoding="utf8")
 final=render(board,ledger,out,timeline)
 report=audit(board,ledger,timeline,final,out,style_id)
 print(json.dumps(report,ensure_ascii=False,indent=2))
 if not report["passed"]:raise SystemExit("E2E QA FAILED")

if __name__=="__main__":main()
