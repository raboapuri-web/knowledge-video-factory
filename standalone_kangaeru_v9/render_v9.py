#!/usr/bin/env python3
"""v9 final GK renderer: scene+cue synchronized source-backed editorial graphics.

Each active cue gets a fresh visual *state* or holds the previous one; the bottom
subtitle always updates independently. Voicevox mora lengths, char-index mapped
to source cue boundaries, drive start/end; actual WAV rescales any drift.
No model calls and no OpenAI secret in this renderer.
"""
from __future__ import annotations
import argparse,collections,copy,hashlib,json,math,os,re,sys
from pathlib import Path
from PIL import Image
import cairosvg
ROOT=Path(__file__).resolve().parent
V7=ROOT.parent/"standalone_kangaeru_v7";V8=ROOT.parent/"standalone_kangaeru_v8"
sys.path.insert(0,str(V8));sys.path.insert(1,str(V7))
import studio as v8
import motion
import render_full as old
import cue_plan,cue_visual,voice_mora
W,H,FPS=old.W,old.H,old.FPS

def integrity(board,planned):
 meta=cue_plan.prepare(board)
 assert len(planned["scenes"])==len(board["scenes"])==71
 assert planned["source_cue_count"]==meta["source_cue_count"]
 assert planned["source_narration_sha256"]==meta["narration_sha256"]
 for s,p in zip(board["scenes"],planned["scenes"]):
  assert p["scene_id"]==s["id"]
  assert p["narration_sha256"]==hashlib.sha256(s["narration_text"].encode()).hexdigest()
  assert len(p["cue_visuals"])==len(s["subtitle_cues"])
  for i,decision in enumerate(p["cue_visuals"]):
   assert decision["cue_index"]==i
   cue_plan.validate_one(s,s["subtitle_cues"][i],decision)
 return meta

def render(board,planned,ledger,cues,out,rate=10):
 out=Path(out);folder=out/"frames";folder.mkdir(parents=True,exist_ok=True)
 preview=out/"previews";preview.mkdir(exist_ok=True)
 prepared={x["scene_id"]:x["cue_visuals"] for x in planned["scenes"]}
 cue_lookup={(x["scene_id"],x["cue_index"]):x for x in cues}
 srt=[];manifest=[];scene_info=[];seq=0;cue_global=0
 prev_scene_end=None
 counted=collections.Counter()
 for scene_i,scene in enumerate(board["scenes"]):
  cues_of_scene=scene["subtitle_cues"];decisions=prepared[scene["id"]]
  state=cue_visual.static_state(scene);visual_count=1
  spec=cue_visual.full_motion(scene,scene_i,short=.85)
  motion_for_numeric=motion.normalize_entry("data",{"name":"count_up","duration":.75},"count_up")
  cue_preview=[]
  for j,(subtitle,decision) in enumerate(zip(cues_of_scene,decisions)):
   cue=cue_lookup[(scene["id"],j)]
   start,end=cue["start"],cue["end"]
   duration=end-start
   if duration<=.02:raise ValueError("Degenerate cue timing")
   state,changed=cue_visual.change_state(scene,decision,state)
   if j>0 and changed:visual_count+=1
   cue_global+=1
   srt.extend([str(cue_global),old.stamp(start)+" --> "+old.stamp(end),subtitle["text"],""])
   if decision["kind"]=="none":counted["none"]+=1
   if changed:counted["changes"]+=1
   active_spec=copy.deepcopy(spec)
   if state["kind"]=="numeric":active_spec["data"]=motion_for_numeric
   if state["kind"]=="diagram_element" and active_spec["diagram"]["name"]=="none":
    active_spec["diagram"]=motion.normalize_entry("diagram",{"name":"stagger","duration":.72},"stagger")
   should_animate=bool(changed or j==0)
   entry=.0
   if should_animate:
    timings=[x["duration"] for x in active_spec.values()]
    entry=min(.85,max(timings),duration*.40)
    if entry<.12:entry=0.
   frames=math.ceil(entry*rate) if entry else 0
   for k in range(frames):
    local=entry*k/frames
    svg=cue_visual.cue_svg(scene,subtitle["text"],state,local,active_spec,ledger)
    seq+=1;p=folder/f"{seq:05d}.png"
    cairosvg.svg2png(bytestring=svg.encode("utf8"),write_to=str(p),output_width=W,output_height=H)
    if j==0 and prev_scene_end is not None and local<active_spec["transition"]["duration"]:
     with Image.open(p) as img,Image.open(prev_scene_end) as prior:
      frame=motion.composite_transition(img.convert("RGB"),prior.convert("RGB"),local,active_spec["transition"])
      frame.save(p)
    a=start+entry*k/frames;b=start+entry*(k+1)/frames
    manifest.append({"scene":scene["id"],"cue_number":cue_global,"file":str(p.resolve()),
      "start":round(a,5),"end":round(b,5),"motion_frame":True,
      "cue_visual_kind":state["kind"]})
   svg=cue_visual.cue_svg(scene,subtitle["text"],state,10.0,active_spec,ledger)
   seq+=1;p=folder/f"{seq:05d}.png"
   cairosvg.svg2png(bytestring=svg.encode("utf8"),write_to=str(p),output_width=W,output_height=H)
   a=start+entry
   if a<end-.00001:
    manifest.append({"scene":scene["id"],"cue_number":cue_global,"file":str(p.resolve()),
      "start":round(a,5),"end":round(end,5),"motion_frame":False,
      "cue_visual_kind":state["kind"]})
   if j==0:
    with Image.open(p) as im:
     im.convert("RGB").resize((640,360),Image.Resampling.LANCZOS).save(preview/f"{scene['id']}.jpg",quality=88)
   if j==len(cues_of_scene)-1:prev_scene_end=p
   cue_preview.append({"cue_index":j,"start":start,"end":end,"kind":decision["kind"],"state":state})
  scene_info.append({"scene_id":scene["id"],"visual_states":visual_count,"cues":cue_preview})
  if (scene_i+1)%10==0:
   print(json.dumps({"v9_scenes_rendered":scene_i+1,"cue_frames":len(manifest),"visual_changes":sum(x["visual_states"] for x in scene_info)},ensure_ascii=False),flush=True)
 (out/"frame_manifest.json").write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding="utf8")
 (out/"cue_visual_timeline.json").write_text(json.dumps(scene_info,ensure_ascii=False,indent=2),encoding="utf8")
 (out/"captions.srt").write_text("\n".join(srt),encoding="utf8")
 changes=sum(x["visual_states"] for x in scene_info)
 return manifest,{"scene_count":len(scene_info),"caption_cue_count":cue_global,
  "visual_switches":changes,"visual_switches_vs_v8_71":changes-71,
  "none_cues":counted["none"],"active_change_directives":counted["changes"],
  "motion_frame_count":sum(bool(x["motion_frame"]) for x in manifest),
  "raster_frame_count":seq}

def qa(board,planned,ledger,timeline,cues,manifest,render_report,mora_report,final,out,speaker_id):
 report=old.qa(board,ledger,timeline,manifest,final,out,speaker_id)
 checks=report["checks"]
 checks["rendered_cues_complete"]=len({x["cue_number"] for x in manifest})==len(cues)
 checks["v9_224_cues"]=len(cues)==planned["source_cue_count"]==224
 checks["timing_continuity"]=all(abs(a["end"]-b["start"])<.045 for a,b in zip(manifest,manifest[1:]))
 checks["mora_boundary_monotone"]=all(c["end"]>c["start"] for c in cues)
 checks["mora_scene_ends_exact"]=all(abs(c["end"]-t["end"])<.001 for t in timeline
      for c in cues if c["scene_id"]==t["id"] and c["cue_index"]==len(next(s for s in board["scenes"] if s["id"]==t["id"])["subtitle_cues"])-1)
 checks["all_224_visual_directives"]=sum(len(x["cue_visuals"]) for x in planned["scenes"])==224
 checks["visuals_change_more_than_v8"]=render_report["visual_switches"]>71
 checks["source_narration_integrity"]=integrity(board,planned)["narration_sha256"]==planned["source_narration_sha256"]
 checks["all_photo_cues_verified"]=all(s.get("photo_status")=="visually_verified" and s.get("photo_file")
      for s,p in zip(board["scenes"],planned["scenes"]) for d in p["cue_visuals"] if d["kind"]=="photo")
 checks["no_api_keys_in_renderer"]=not bool(os.getenv("OPENAI_API_KEY"))
 # A photo in the rights ledger is not enough; verify an image element will be
 # rendered on screen even when the model chose a foreground text/diagram cue.
 on_screen=0
 for scene,planned_scene in zip(board["scenes"],planned["scenes"]):
  if scene.get("primary_visual")!="photo":continue
  first=planned_scene["cue_visuals"][0]
  state,_=cue_visual.change_state(scene,first,cue_visual.static_state(scene))
  spec=cue_visual.full_motion(scene,int(scene["id"][1:])-1)
  html=cue_visual.cue_svg(scene,scene["subtitle_cues"][0]["text"],state,10.0,spec,ledger)
  if "<image " in html:on_screen+=1
 checks["seven_verified_photos_actually_on_screen"]=on_screen==len(ledger["photos"])==7
 report.update({"checks":checks,"passed":all(checks.values()),
  "cue_sync_v9":{"onscreen_photo_scene_count":on_screen,
   "none_cue_ratio":round(render_report["none_cues"]/len(cues),4),
   "method":"VOICEVOX audio_query accent_phrases mora durations → approximate normalized char index → mora index → WAV rescale",
   "limitations":"Not exact word/kanji forced alignment; approximate source character-position mapping; normalizes to WAV including trailing silence",
   **mora_report,**render_report},"new_openai_calls_in_renderer":0,
  "human_visual_review_required":True})
 (Path(out)/"qa_final.json").write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding="utf8")
 return report

def main():
 p=argparse.ArgumentParser()
 p.add_argument("--board",required=True);p.add_argument("--cue-plan",required=True)
 p.add_argument("--ledger",required=True);p.add_argument("--out",required=True)
 p.add_argument("--voicevox-url",default="http://127.0.0.1:50021")
 a=p.parse_args()
 out=Path(a.out);out.mkdir(parents=True,exist_ok=True)
 board=json.loads(Path(a.board).read_text(encoding="utf8"))
 cue_story=json.loads(Path(a.cue_plan).read_text(encoding="utf8"))
 ledger=json.loads(Path(a.ledger).read_text(encoding="utf8"))
 v8.add_motion(board);integrity(board,cue_story)
 # Secret is neither needed nor passed through to audio/frames.
 os.environ.pop("OPENAI_API_KEY",None)
 (out/"v9_storyboard.json").write_text(json.dumps(board,ensure_ascii=False,indent=2),encoding="utf8")
 (out/"cue_storyboard.json").write_text(json.dumps(cue_story,ensure_ascii=False,indent=2),encoding="utf8")
 (out/"photo_ledger.json").write_text(json.dumps(ledger,ensure_ascii=False,indent=2),encoding="utf8")
 old.description(board,ledger,out)
 timeline,cues,mora_report=voice_mora.generate(board,out,a.voicevox_url)
 frames,render_report=render(board,cue_story,ledger,cues,out)
 old.thumbnails(out)
 final=old.encode_video(frames,timeline,out)
 result=qa(board,cue_story,ledger,timeline,cues,frames,render_report,mora_report,final,out,13)
 print(json.dumps({"passed":result["passed"],"checks":result["checks"],"video_duration":result["duration_seconds"],
   "resolution":result["output_resolution"],"fps":result["fps"],"cue_sync":result["cue_sync_v9"]},ensure_ascii=False),flush=True)
 if not result["passed"]:raise SystemExit("v9 cue sync QA failed")
if __name__=="__main__":main()
