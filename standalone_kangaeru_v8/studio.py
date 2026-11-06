#!/usr/bin/env python3
"""v8 full GK motion renderer; reuses original paid v7 plan, CC0/PD photos and
unchanged VOICEVOX Aoyama Ryusei. No AI SDK/network calls or API Secret.

Per scene, render motion keyframes to PNG while preserving exact caption cue
durations; FFmpeg converts the frame-duration manifest to true 1080p 30fps.
"""
from __future__ import annotations
import argparse,collections,copy,json,math,os,re,subprocess,sys,time
from pathlib import Path
from PIL import Image
import cairosvg
ROOT=Path(__file__).resolve().parent
V7=ROOT.parent/"standalone_kangaeru_v7"
sys.path.insert(0,str(V7))
import render_full as old
import motion,pictograms

W,H,FPS=old.W,old.H,old.FPS
TEXT_ORDER=("fade_up","type_on","slide_in","soft_scale","mask_wipe","none")
DIAG_ORDER=("pop","stagger","draw_on","float_in","radial","none")
GRAPH_ORDER=("bar_grow","count_up","bar_and_count","grid_wipe","pulse_focus","none")

def add_motion(board):
 for i,scene in enumerate(board["scenes"]):
  # Respect explicit per-scene user overrides. Rotating defaults never depend on script length.
  raw=scene.get("motion")
  if not isinstance(raw,dict):raw={}
  keys={**raw}
  keys.setdefault("text",TEXT_ORDER[i%len(TEXT_ORDER)])
  keys.setdefault("diagram",DIAG_ORDER[i%len(DIAG_ORDER)])
  if scene["composition"]=="data_bars":
   keys.setdefault("data",GRAPH_ORDER[i%len(GRAPH_ORDER)])
  keys.setdefault("transition",motion.TRANSITIONS[i%len(motion.TRANSITIONS)])
  scene["motion"]=motion.spec_for({**scene,"motion":keys},i)
 return board

def render_animated(board,ledger,timeline,out,frame_rate=12):
 """Unique first-cue motion frames plus crisp still for each later subtitle cue."""
 out=Path(out);folder=out/"frames";folder.mkdir(parents=True,exist_ok=True)
 preview=out/"previews";preview.mkdir(exist_ok=True)
 seq=0;manifest=[];srt=[];cue_num=0;scene_summary=[];prev_end=None
 used=collections.defaultdict(collections.Counter)
 for i,(scene,time_entry) in enumerate(zip(board["scenes"],timeline)):
  spec=scene["motion"];cues=scene["subtitle_cues"]
  weights=[max(1,len(c["text"].replace("\n",""))) for c in cues]
  total=sum(weights);pos=time_entry["start"];remaining=time_entry["end"]-pos
  for group,entry in spec.items():used[group][entry["name"]]+=1
  n_animated=0
  for cue_index,(cue,weight) in enumerate(zip(cues,weights)):
   end=(time_entry["end"] if cue_index==len(cues)-1 else pos+remaining*weight/total)
   span=end-pos
   cue_num+=1
   srt.extend([str(cue_num),old.stamp(pos)+" --> "+old.stamp(end),cue["text"],""])
   if cue_index==0:
    maxmotion=max(x["duration"] for x in spec.values())
    # Motion is short; the rest of the cue remains static for unhurried reading.
    anim_len=min(1.05,span*.38,maxmotion)
    n_animated=math.ceil(anim_len*frame_rate) if anim_len>.12 else 0
    for k in range(n_animated):
     t=anim_len*k/n_animated
     raw=motion.animated_svg(scene,cue["text"],ledger,t,spec)
     seq+=1;path=folder/(f"{seq:05d}.png")
     cairosvg.svg2png(bytestring=raw.encode("utf8"),write_to=str(path),output_width=W,output_height=H)
     if prev_end is not None and spec["transition"]["duration"]>t:
      with Image.open(path) as current, Image.open(prev_end) as previous:
       mixed=motion.composite_transition(current.convert("RGB"),previous.convert("RGB"),t,spec["transition"])
       mixed.save(path,optimize=False)
     begin=pos+t;endframe=pos+anim_len*(k+1)/n_animated
     manifest.append({"scene":scene["id"],"file":str(path.resolve()),
                      "start":round(begin,5),"end":round(endframe,5),
                      "cue_number":cue_num,"is_motion_frame":True})
   # End-state static frame per cue is rendered at full 1080 resolution.
   raw=motion.animated_svg(scene,cue["text"],ledger,10.0,spec)
   seq+=1;path=folder/(f"{seq:05d}.png")
   cairosvg.svg2png(bytestring=raw.encode("utf8"),write_to=str(path),output_width=W,output_height=H)
   begin=pos+anim_len if cue_index==0 else pos
   if end-begin>.0001:
    manifest.append({"scene":scene["id"],"file":str(path.resolve()),
                     "start":round(begin,5),"end":round(end,5),
                     "cue_number":cue_num,"is_motion_frame":False})
   if cue_index==0:
    with Image.open(path) as im:
     im.resize((640,360),Image.Resampling.LANCZOS).save(preview/(scene["id"]+".jpg"),quality=89)
   if cue_index==len(cues)-1:prev_end=path
   pos=end
  scene_summary.append({"scene":scene["id"],"motion":spec,"intro_keyframes":n_animated,
                        "cue_count":len(cues)})
  if (i+1)%10==0:
   print(json.dumps({"motion_scenes_rendered":i+1,"total":len(board["scenes"]),
                      "motion_frame_files":seq},ensure_ascii=False),flush=True)
 (out/"captions.srt").write_text("\n".join(srt),encoding="utf8")
 (out/"frame_manifest.json").write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding="utf8")
 (out/"motion_scene_manifest.json").write_text(json.dumps(scene_summary,ensure_ascii=False,indent=2),encoding="utf8")
 return manifest,{"templates_used":{g:dict(c) for g,c in used.items()},
                  "frame_files":seq,"motion_frames":sum(s["intro_keyframes"] for s in scene_summary),
                  "caption_cues":cue_num,
                  "scene_motion":[{"id":s["scene"],"intro_keyframes":s["intro_keyframes"]} for s in scene_summary]}

def qa_v8(board,ledger,timeline,manifest,video,out,voice_id,motion_report):
 # Retain v7 safety checks for source, subtitles, rights, speaker and MP4.
 report=old.qa(board,ledger,timeline,manifest,video,out,voice_id)
 checks=report["checks"]
 checks["rendered_cues_complete"]=len({m["cue_number"] for m in manifest})==sum(len(s["subtitle_cues"]) for s in board["scenes"])
 checks["actual_motion_keyframes"]=motion_report["motion_frames"]>=len(board["scenes"])*4
 checks["all_scenes_have_motion_selection"]=all(all(x in scene["motion"] for x in motion.CATALOGUE) for scene in board["scenes"])
 checks["pictogram_quality"]=all(pictograms.validate_visual_quality(s.get("icon_spec")) for s in board["scenes"])
 checks["all_scene_pictures_or_meaningful_diagrams"]=all(s["primary_visual"]!="photo" or s.get("photo_status")=="visually_verified" for s in board["scenes"])
 checks["timing_continuity"]=all(abs(manifest[i]["start"]-manifest[i-1]["end"])<.045 for i in range(1,len(manifest)))
 checks["motion_catalogue_complete"]=motion.validate_catalogue()
 checks["no_api_key_used"]=not bool(os.environ.get("OPENAI_API_KEY"))
 checks["motion_usage_recorded"]=bool(motion_report["templates_used"].get("text")) and bool(motion_report["templates_used"].get("transition"))
 report["checks"]=checks;report["passed"]=all(checks.values())
 report["motion_v8"]=motion_report;report["pictograms_rendering"]="filled icon motifs + gold heavy stroke, validated against original AI semantic concept"
 report["production_method"]="v7 paid plan and photo artifacts reused; local generated SVG keyframes, unchanged VOICEVOX"
 report["new_openai_api_calls"]=0
 (Path(out)/"qa_final.json").write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding="utf8")
 return report

def main():
 p=argparse.ArgumentParser()
 p.add_argument("--board",required=True)
 p.add_argument("--ledger",required=True)
 p.add_argument("--out",required=True)
 p.add_argument("--voicevox-url",default="http://127.0.0.1:50021")
 p.add_argument("--preview-only",action="store_true")
 args=p.parse_args();out=Path(args.out);out.mkdir(parents=True,exist_ok=True)
 board=json.loads(Path(args.board).read_text(encoding="utf8"))
 ledger=json.loads(Path(args.ledger).read_text(encoding="utf8"))
 add_motion(board)
 (out/"v8_storyboard.json").write_text(json.dumps(board,ensure_ascii=False,indent=2),encoding="utf8")
 (out/"motion_catalogue.json").write_text(json.dumps(motion.metadata(),ensure_ascii=False,indent=2),encoding="utf8")
 if args.preview_only:
  # Render a contact sheet of new SVG/pictogram layouts without TTS or API.
  preview=out/"previews";preview.mkdir(exist_ok=True)
  for scene in board["scenes"]:
   raw=motion.animated_svg(scene,scene["subtitle_cues"][0]["text"],ledger,10.0,scene["motion"])
   image=preview/(scene["id"]+".jpg")
   cairosvg.svg2png(bytestring=raw.encode("utf8"),write_to=str(out/"preview.png"),output_width=640,output_height=360)
   with Image.open(out/"preview.png") as im:im.save(image,quality=86)
  old.thumbnails(out)
  print(json.dumps({"passed":True,"scene_previews":len(board["scenes"]),"API_calls":0},ensure_ascii=False));return
 # Avoid any ambiguity: credential is neither needed nor sent to subprocesses.
 os.environ.pop("OPENAI_API_KEY",None)
 style=old.v4.resolve_voicevox_speaker(args.voicevox_url,"青山龍星","ノーマル")
 if style!=13:raise RuntimeError("Expected Voicevox 青山龍星 ノーマル 13")
 old.description(board,ledger,out)
 timeline,voiceid=old.tts(board,out,args.voicevox_url)
 manifest,motion_report=render_animated(board,ledger,timeline,out)
 old.thumbnails(out)
 final=old.encode_video(manifest,timeline,out)
 report=qa_v8(board,ledger,timeline,manifest,final,out,voiceid,motion_report)
 print(json.dumps({"qa_passed":report["passed"],"checks":report["checks"],
   "duration_sec":report["duration_seconds"],"resolution":report["output_resolution"],
   "fps":report["fps"],"motion_frame_count":motion_report["motion_frames"],
   "photo_scenes":report["photo_scenes"],"fallbacks":report["photo_fallback_scenes"],
   "generated_icons":report["generated_icons"],"new_api_calls":0},ensure_ascii=False),flush=True)
 if not report["passed"]:raise SystemExit("v8 QA failed")
if __name__=="__main__":main()
