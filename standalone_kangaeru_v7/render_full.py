#!/usr/bin/env python3
"""Full v7 video: licensed/visually matched photos; generated semantic SVG graphics;
VOICEVOX 青山龍星, caption cues, 1080p30 H.264/AAC and reproducible QA.
No API calls here; the photo selector is a separate stage.
"""
from __future__ import annotations
import argparse,base64,copy,hashlib,io,json,math,os,re,shlex,subprocess,sys,time
from pathlib import Path
from PIL import Image,ImageOps
import cairosvg
ROOT=Path(__file__).resolve().parent
V4=ROOT.parent/"standalone_kangaeru_v4"
sys.path.insert(0,str(V4))
import core as v4
import render as v4render
import brand,icons

W,H,FPS=1920,1080,30

def stamp(t):
 ms=round(t*1000)
 return f"{ms//3600000:02d}:{(ms//60000)%60:02d}:{(ms//1000)%60:02d},{ms%1000:03d}"

def picture_svg(scene,ledger,subtitle):
 """Photo must come from verified ledger. Never use an empty photo rectangle."""
 file=scene.get("photo_file")
 if not file or not Path(file).is_file():
  raise RuntimeError("Photo scene has no verified image: "+scene["id"])
 entry=next((x for x in ledger["photos"] if x["scene"]==scene["id"]),None)
 if not entry or entry["visual_verification"]["is_match"] is not True:
  raise RuntimeError("Missing per-photo visual suitability evidence "+scene["id"])
 raw=Path(file).read_bytes()
 if hashlib.sha256(raw).hexdigest()!=entry["sha256"]:raise RuntimeError("Corrupted Commons image")
 photo=base64.b64encode(raw).decode("ascii")
 local={**scene,"subtitle_preview":subtitle}
 title=brand.reject(scene["display_text"]["headline"])
 s=['<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">',
    '<defs><linearGradient id="overlay" x1="0" x2="1" y1="0" y2="0">',
    '<stop offset="0%" stop-color="#080807" stop-opacity=".91"/>',
    '<stop offset="60%" stop-color="#080807" stop-opacity=".30"/>',
    '<stop offset="100%" stop-color="#080807" stop-opacity=".03"/></linearGradient></defs>',
    '<rect width="1280" height="720" fill="#0e0d0c"/>',
    f'<image x="0" y="100" width="1280" height="480" preserveAspectRatio="xMidYMid slice" href="data:image/jpeg;base64,{photo}"/>',
    '<rect x="0" y="100" width="1280" height="480" fill="url(#overlay)"/>']
 s+=brand.top()[1:]
 s+=[brand.tag_text(93,172,"COMMONS / VERIFIED PD–CC0",21,brand.GOLD,family="sans"),
     brand.tag_text(94,283,title,52,brand.IVORY),
     brand.line(94,329,442,329,brand.GOLD,3),
     brand.tag_text(96,550,"SOURCE: WIKIMEDIA COMMONS",17,brand.MUTED,family="sans")]
 s+=brand.footer(local);s.append("</svg>")
 return "\n".join(s)

def build_svg(scene,subtitle,ledger):
 local=copy.deepcopy(scene)
 local["subtitle_preview"]=subtitle
 if local.get("primary_visual")=="photo":
  return picture_svg(local,ledger,subtitle)
 if local.get("composition")=="single_symbol" and not local.get("icon_spec"):
  local["composition"]="hero_question"
 if local.get("composition")=="split_choice" and len(local["display_text"].get("labels",[]))!=2:
  local["composition"]="hero_question"
 if local.get("composition")=="causal_flow" and len(local["display_text"].get("labels",[]))!=3:
  local["composition"]="hero_question"
 return brand.svg(local)

def render_cues(board,ledger,out,timeline):
 out=Path(out);folder=out/"frames";folder.mkdir(parents=True,exist_ok=True)
 frame_manifest=[];srt=[];seq=0
 for i,(scene,t) in enumerate(zip(board["scenes"],timeline)):
  cues=scene["subtitle_cues"]
  if not cues:raise ValueError("Missing caption cues "+scene["id"])
  length=t["end"]-t["start"]
  # Audio-proportional cue durations, not equal per page; timings remain approximate.
  weights=[max(1,len(c["text"].replace("\n",""))) for c in cues]
  total=sum(weights);pos=t["start"]
  for n,(cue,weight) in enumerate(zip(cues,weights)):
   end=(t["end"] if n==len(cues)-1 else pos+length*weight/total)
   seq+=1
   png=folder/(f"{seq:05d}.png")
   raw=build_svg(scene,cue["text"],ledger)
   try:cairosvg.svg2png(bytestring=raw.encode("utf8"),write_to=str(png),output_width=W,output_height=H)
   except Exception as e:raise RuntimeError("SVG rasterization failed "+scene["id"]+": "+str(e)[:180])
   if n==0:
    # 640x360 stage preview for visual audit; no proxy/placeholder photographs.
    with Image.open(png) as im:
     preview=(out/"previews");preview.mkdir(exist_ok=True)
     im.resize((640,360),Image.Resampling.LANCZOS).save(preview/(scene["id"]+".jpg"),quality=88)
   frame_manifest.append({"scene":scene["id"],"file":str(png.resolve()),
                          "start":round(pos,4),"end":round(end,4)})
   srt.extend([str(seq),stamp(pos)+" --> "+stamp(end),cue["text"],""])
   pos=end
 (out/"captions.srt").write_text("\n".join(srt),encoding="utf8")
 (out/"frame_manifest.json").write_text(json.dumps(frame_manifest,ensure_ascii=False,indent=2),encoding="utf8")
 return frame_manifest

def thumbnails(out):
 out=Path(out)
 photos=sorted((out/"previews").glob("*.jpg"))
 if not photos:raise ValueError("No frames for contact sheets")
 pages=[]
 for offset in range(0,len(photos),12):
  page=Image.new("RGB",(1280,1080),(15,14,12))
  for n,p in enumerate(photos[offset:offset+12]):
   with Image.open(p) as im:page.paste(im,((n%2)*640,(n//2)*180))
  name=out/(f"contact_sheet_{offset//12+1:02d}.jpg")
  page.save(name,quality=90);pages.append(name)
 photos[0].replace(out/"first_preview.jpg") if False else None
 with Image.open(photos[0]) as im:
  im.resize((1280,720),Image.Resampling.LANCZOS).save(out/"thumbnail.jpg",quality=92)
 return pages

def tts(board,out,voicevox_url):
 out=Path(out);(out/"speech").mkdir(exist_ok=True)
 sid=v4.resolve_voicevox_speaker(voicevox_url,"青山龍星","ノーマル")
 if sid!=13:raise RuntimeError("Wrong or unavailable Aoyama Talk style, expected 13")
 clock=0.0;tl=[]
 for i,s in enumerate(board["scenes"]):
  w=out/"speech"/(s["id"]+".wav")
  v4.tts_chunk(s["narration_text"],w,voicevox_url)
  seconds=v4.wav_seconds(w)
  if not .3<seconds<130:raise RuntimeError("Abnormal VOICEVOX duration "+s["id"])
  length=seconds+.48
  tl.append({"id":s["id"],"wav":str(w),"wav_duration":round(seconds,4),
             "start":round(clock,4),"end":round(clock+length,4)})
  clock+=length
  if (i+1)%10==0:print(json.dumps({"tts_scenes_complete":i+1,"total":len(board["scenes"])},ensure_ascii=False),flush=True)
 (out/"timeline.json").write_text(json.dumps(tl,ensure_ascii=False,indent=2),encoding="utf8")
 return tl,sid

def encode_video(manifest,timeline,out):
 out=Path(out)
 txt=out/"video_concat.txt";all_lines=["ffconcat version 1.0"]
 for f in manifest:
  # Filenames generated by Python, not user controlled. ffconcat requires escaped single quotes.
  path=f["file"].replace("'","'\\''")
  all_lines.append("file '"+path+"'")
  all_lines.append("duration "+f"{f['end']-f['start']:.6f}")
 all_lines.append("file '"+manifest[-1]["file"].replace("'","'\\''")+"'")
 txt.write_text("\n".join(all_lines)+"\n",encoding="utf8")
 video=out/"video_only.mp4"
 duration=timeline[-1]["end"]
 cmd=["ffmpeg","-y","-hide_banner","-loglevel","error","-safe","0","-f","concat","-i",str(txt),
      "-vf",f"fps={FPS},format=yuv420p","-t",str(duration),
      "-c:v","libx264","-preset","ultrafast","-crf","23","-r",str(FPS),
      "-movflags","+faststart",str(video)]
 print(json.dumps({"encode":"ffmpeg concat still scenes","resolution":[W,H],"fps":FPS,
                   "scenes":len(timeline),"frames_with_captions":len(manifest),"seconds":round(duration,2)},ensure_ascii=False),flush=True)
 subprocess.run(cmd,check=True,timeout=4000)
 audio=v4render.audio_mix(timeline,out)
 final=out/"final.mp4"
 subprocess.run(["ffmpeg","-y","-hide_banner","-loglevel","error","-i",str(video),"-i",str(audio),
  "-c:v","copy","-c:a","aac","-b:a","160k","-movflags","+faststart","-shortest",str(final)],check=True,timeout=650)
 return final

def qa(board,ledger,timeline,manifest,final,out,speaker_id):
 out=Path(out);scenes=board["scenes"]
 checks={
 "all_original_narration":len(scenes)>30 and all(x.get("narration_text") and x.get("evidence_anchor") in x["narration_text"] for x in scenes),
 "separate_subtitle_display":all(x["display_text"]["headline"]!=x["narration_text"] and len(x["display_text"]["headline"])<=18 for x in scenes),
 "subtitle_text_complete":all("".join(z["text"].replace("\n","") for z in x["subtitle_cues"])==re.sub(r"\s+","",x["narration_text"]) for x in scenes),
 "subtitle_2x20":all(all(len(line)<=20 for line in c["text"].split("\n")) and len(c["text"].split("\n"))<=2 for x in scenes for c in x["subtitle_cues"]),
 "no_empty_photo_placeholders":all(x.get("primary_visual")!="photo" or x.get("photo_status")=="visually_verified" for x in scenes),
 "all_photos_verified_cc0_pd":all(a["license"] in ("CC0","Public Domain") and a["visual_verification"]["is_match"] is True and a["visual_verification"]["confidence"]>=.85 and hashlib.sha256(Path(a["file"]).read_bytes()).hexdigest()==a["sha256"] for a in ledger["photos"]),
 "aoyama_normal_13":speaker_id==13,
 "voicevox_no_fallback":all(Path(x["wav"]).is_file() for x in timeline),
 "original_8015_atlas":v4.ORIGINAL_ATLAS.is_file() and v4.ORIGINAL_ATLAS.stat().st_size==140555,
 "headline_layouts_nonempty":all(x["display_text"]["headline"] for x in scenes),
 "scene_count_matches":len(timeline)==len(scenes),
 "rendered_cues_complete":len(manifest)==sum(len(s["subtitle_cues"]) for s in scenes),
 "video_file_exists":final.is_file() and final.stat().st_size>300000,
 "timestamp_continuity":all(abs(timeline[i]["start"]-timeline[i-1]["end"])<.03 for i in range(1,len(timeline)))}
 fmt={};duration=None
 try:
  p=subprocess.run(["ffprobe","-v","error","-show_entries",
     "format=duration:stream=codec_name,codec_type,width,height,r_frame_rate",
     "-of","json",str(final)],capture_output=True,text=True,check=True)
  fmt=json.loads(p.stdout)
  duration=float(fmt["format"]["duration"])
  vid=next(x for x in fmt["streams"] if x.get("codec_type")=="video")
  aud=next(x for x in fmt["streams"] if x.get("codec_type")=="audio")
  checks["1080p30_h264_aac"]=vid["width"]==W and vid["height"]==H and vid["codec_name"]=="h264" and vid["r_frame_rate"]=="30/1" and aud["codec_name"]=="aac"
  checks["audio_video_duration_match"]=abs(duration-timeline[-1]["end"])<1.5
 except Exception as e:
  checks["1080p30_h264_aac"]=False;checks["audio_video_duration_match"]=False
 report={"passed":all(checks.values()),"checks":checks,"scene_count":len(scenes),
     "duration_seconds":duration,"output_resolution":[W,H],"fps":FPS,"format":"MP4 H.264/AAC",
     "photo_scenes":len(ledger["photos"]),"photo_fallback_scenes":len(ledger["fallbacks"]),
     "generated_icons":sum(x.get("icon_spec") is not None and x["icon_spec"].get("origin","generated")=="generated" for x in scenes),
     "credit":"VOICEVOX:青山龍星",
     "brand_assets_exact":{"8015":True,"8010":False,"8011":False,"8012":False,"8013":False,"8014":False},
     "brand_style_note":"Gold/black vector editorial design reflects 8013 grammar; original 8010-8014 binary files were not in this GitHub branch.",
     "requires_human_visual_review":True,
     "limitations":["Photo suitability model checks can be wrong; each selected image needs human approval.",
       "Subtitles approximately align with voiced scene length and text amount, not forced word alignment.",
       "Original 8010-8014 image binaries absent from repository; aesthetic grammar recreated rather than original pixel assets."]}
 (out/"qa_final.json").write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding="utf8")
 return report

def description(board,ledger,out):
 src=board.get("source_url") or ""
 lines=[board["title"],"","ナレーション：VOICEVOX:青山龍星（ノーマル）",
  "","音楽：使用なし","", "台本原資料："+src,"","写真：Wikimedia Commons／個別CC0・Public Domain確認済み"]
 for a in ledger["photos"]:
  lines.append(f"- {a['scene']} | {a['source_page']} | {a['license']} | {a['author']}")
 lines+=["","アイコン・図解：オリジナルSVG生成および8015原画24アイコン","",
 "注：内容および映像素材は公開前に人間による最終確認が必要です。"]
 (Path(out)/"description.md").write_text("\n".join(lines),encoding="utf8")

def main():
 p=argparse.ArgumentParser()
 p.add_argument("--board",required=True);p.add_argument("--ledger",required=True)
 p.add_argument("--out",required=True);p.add_argument("--voicevox-url",default="http://127.0.0.1:50021")
 a=p.parse_args();out=Path(a.out);out.mkdir(parents=True,exist_ok=True)
 board=json.loads(Path(a.board).read_text(encoding="utf8"))
 ledger=json.loads(Path(a.ledger).read_text(encoding="utf8"))
 style=v4.resolve_voicevox_speaker(a.voicevox_url,"青山龍星","ノーマル")
 if style!=13:raise RuntimeError("Aoyama normal speaker style 13 not present")
 (out/"storyboard.json").write_text(json.dumps(board,ensure_ascii=False,indent=2),encoding="utf8")
 (out/"photo_ledger.json").write_text(json.dumps(ledger,ensure_ascii=False,indent=2),encoding="utf8")
 description(board,ledger,out)
 tl,style=tts(board,out,a.voicevox_url)
 frames=render_cues(board,ledger,out,tl)
 sheets=thumbnails(out)
 final=encode_video(frames,tl,out)
 report=qa(board,ledger,tl,frames,final,out,style)
 print(json.dumps(report,ensure_ascii=False,indent=2),flush=True)
 if not report["passed"]:raise SystemExit("Full E2E video QA failed")
if __name__=="__main__":main()
