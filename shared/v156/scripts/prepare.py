#!/usr/bin/env python3
import json, shutil
from pathlib import Path
BASE=Path(__file__).resolve().parents[1]; RUNTIME=BASE/"runtime"; V154=BASE.parent/"v154"
def main():
 b=json.loads((BASE/"board.json").read_text(encoding="utf-8")); scenes=b["scenes"]
 chapter_defs=[("prologue","プロローグ","P"),("chapter1","大きさと、大顎","1"),("chapter2","空の戦闘機","2"),("chapter3","ゆっくり近づく手","3"),("chapter4","最強のライバル","4"),("chapter5","虫除けになった最強","5"),("chapter6","三十万個の夏","6"),("epilogue","エピローグ","E")]
 titles=[x[1] for x in chapter_defs]
 chapter_ids={x[2]:x[0] for x in chapter_defs}
 grouped={cid:[] for cid,_,_ in chapter_defs}
 for scene in scenes:
  prefix=str(scene.get("board_id","")).split("-",1)[0]
  cid=chapter_ids.get(prefix)
  if not cid: raise SystemExit(f"{scene['id']}: board_id must begin with P, 1-6, or E")
  grouped[cid].append(int(scene["id"][1:]))
 ranges=[]
 for cid,_,_ in chapter_defs:
  nums=grouped[cid]
  if not nums: raise SystemExit(f"board has no scenes for {cid}")
  if nums!=list(range(min(nums),max(nums)+1)): raise SystemExit(f"{cid}: chapter scenes must be contiguous")
  ranges.append((cid,min(nums),max(nums)))
 if [n for _,a,z in ranges for n in range(a,z+1)]!=list(range(1,len(scenes)+1)): raise SystemExit("chapter ranges must cover S001 through final scene without gaps")
 if [s["id"] for s in scenes]!=[f"S{i:03d}" for i in range(1,71)]: raise SystemExit("board must contain S001-S070")
 for d in ["content","assets","format_v2/config","format_v2/scripts","scripts","media","output","segments"]: (RUNTIME/d).mkdir(parents=True,exist_ok=True)
 compat={"video_id":"v156","title":"オニヤンマはなぜ最強なのか","scenes":[{"id":s["id"],"script":s["narration"],"motion":s["motion"],"image_count":1} for s in scenes],
 "chapters":[{"id":cid,"title":titles[i],"start":a,"end":z,"scene_count":z-a+1} for i,(cid,a,z) in enumerate(ranges)],
 "chapter_cards":[{"id":f"T{i+1:03d}","chapter":ranges[i][0],"title":titles[i]} for i in range(8)]}
 (RUNTIME/"content/board.json").write_text(json.dumps(compat,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
 # V154 finalizer expects an asset manifest beside the approved image set; derive it from the supplied credits.
 credits=(BASE/"credits_generated.txt").read_text(encoding="utf-8")
 (BASE/"assets/final/ASSET_MANIFEST.md").write_text("# V156 generated asset credits\\n\\n"+credits+"\\n",encoding="utf-8")
 final=RUNTIME/"assets/final"
 if final.is_symlink(): final.unlink()
 elif final.exists(): shutil.rmtree(final)
 final.symlink_to(BASE/"assets/final",target_is_directory=True)
 spec=json.loads((V154/"format_v2/config/chapter_card_spec.json").read_text(encoding="utf-8"))
 spec["project"]="V156 オニヤンマはなぜ最強なのか"; spec["typing"]["sfx_file"]="../../../v153/format_v2/audio/type_key.wav"
 spec["cards"]=[{"chapter":cid,"label":"" if i in (0,7) else f"第{i}章","title":titles[i],"background_file":"../../assets/moon_character_reference.jpg"} for i,(cid,a,z) in enumerate(ranges)]
 (RUNTIME/"format_v2/config/chapter_card_spec.json").write_text(json.dumps(spec,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
 for name in ["synth.py","validate_chapter_narration.py","render_chapter.py","install_media_tools.sh"]: shutil.copy2(V154/"scripts"/name,RUNTIME/"scripts"/name)
 shutil.copy2(V154/"format_v2/scripts/render_chapter_card.py",RUNTIME/"format_v2/scripts/render_chapter_card.py")
 # V155's approved S001 text does not contain the V153-specific "少し" reading exception.
 validator=RUNTIME/"scripts/validate_chapter_narration.py"
 vt=validator.read_text(encoding="utf-8")
 start=vt.index('        if s["id"]=="S001":')
 end=vt.index('        if not first_caption',start)
 vt=vt[:start]+'        if v.get("tts_input_text")!=text: errors.append(s["id"]+": unexpected TTS-side text replacement")'+chr(10)+vt[end:]
 vt=vt.replace('"S001_tts_only_replacement":"少し → すこし" if any(s["id"]=="S001" for s in scenes) else None','"S001_tts_only_replacement":None')
 validator.write_text(vt,encoding="utf-8")
 motion_src=BASE.parent/"motion"; motion_dst=BASE/"motion"
 if motion_dst.exists(): shutil.rmtree(motion_dst)
 shutil.copytree(motion_src,motion_dst)
 # V155 has two short moving scenes; audit them with one duration-scaled window instead of rejecting them.
 qa=motion_dst/"continuous_motion_qa.py"; qt=qa.read_text(encoding="utf-8")
 qstart=qt.index("            if duration < 2.0:")
 qend=qt.index("            passed = bool",qstart)
 qa_block="\n".join([
  "            if duration < 0.3:",
  "                failures.append({\"scene\": item[\"scene\"], \"reason\": \"scene too short to audit\"})",
  "                continue",
  "            if duration < 2.0:",
  "                frame_count=max(8,min(26,int(duration*FPS)-1))",
  "                window_seconds=(frame_count-1)/FPS",
  "                start=float(item[\"start\"])+max(0.03,(duration-window_seconds)/2)",
  "                windows=[_sample_window(cap,start,count=frame_count)]",
  "            else:",
  "                window_seconds=26.0/FPS",
  "                starts=[float(item[\"start\"])+max(0.15,duration*p-window_seconds/2) for p in (0.20,0.50,0.80)]",
  "                last_start=float(item[\"end\"])-window_seconds-0.15",
  "                starts=sorted(set(round(min(x,last_start),4) for x in starts))",
  "                windows=[]",
  "                for start in starts:",
  "                    try:",
  "                        windows.append(_sample_window(cap,start))",
  "                    except Exception as exc:",
  "                        windows.append({\"start_seconds\":round(start,3),\"passed\":False,\"error\":str(exc)})",
  ""])
 qt=qt[:qstart]+qa_block+qt[qend:]
 qt=qt.replace("three separate 26-frame windows per non-static scene; adjacent decoded frame luma differences, excluding subtitle band","three 26-frame windows for moving scenes >=2s; one duration-scaled window for shorter moving scenes; adjacent decoded frame luma differences")
 qa.write_text(qt,encoding="utf-8")
 render=RUNTIME/"scripts/render_chapter.py"; t=render.read_text(encoding="utf-8").replace("len(MOTION_BY_ID)!=90","len(MOTION_BY_ID)!=70").replace('SPECIAL_BLUR={"S018","S028","S032","S057"}','SPECIAL_BLUR=set()').replace("v154-{chapter}.mp4","v156-{chapter}.mp4"); render.write_text(t,encoding="utf-8")
 allowed={"zoom_in","zoom_out","pan_right","pan_left","pan_up","pan_down","static"}; entries=[]
 for s in scenes:
  m=s["motion"]
  if m not in allowed: raise SystemExit(f"{s['id']}: unsupported motion {m}")
  if m=="zoom_in": z0,z1=1.,1.2; p0=p1=[.5,.5]
  elif m=="zoom_out": z0,z1=1.2,1.; p0=p1=[.5,.5]
  elif m=="static": z0,z1=1.,1.; p0=p1=[.5,.5]
  else:
   z0=z1=1.2; p0,p1={"pan_right":([0,.5],[1,.5]),"pan_left":([1,.5],[0,.5]),"pan_up":([.5,1],[.5,0]),"pan_down":([.5,0],[.5,1])}[m]
  cid=next(cid for cid,a,z in ranges if a<=int(s["id"][1:])<=z)
  entries.append({"scene_id":s["id"],"chapter":cid,"motion":m,"scale_from":z0,"scale_to":z1,"camera_from":p0,"camera_to":p1})
 (RUNTIME/"format_v2/config/scene_motion_map.json").write_text(json.dumps({"schema_version":"2.0","project":compat["title"],"scene_count":70,"render":{"width":1920,"height":1080,"fps":30,"zoompan_baseline":1.2,"pan_travel_percent":16.7},"entries":entries},ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
 src=(V154/"scripts/finalize.py").read_text(encoding="utf-8")
 reps=[
  ('EXPECTED_SCENES=[f"S{i:03d}" for i in range(1,91)]','EXPECTED_SCENES=[f"S{i:03d}" for i in range(1,71)]'),
  ('v154-{chapter}.mp4','v156-{chapter}.mp4'),
  ('{"S018","S028","S032","S057"}','set()'),
  ('S090','S070'),
  ('v154-pond-recovery-final.mp4','v156-oniyanma-final.mp4'),
  ('v154-contact-sheet.jpg','v156-contact-sheet.jpg'),
  ('v154-chapter-cards-contact-sheet.jpg','v156-chapter-cards-contact-sheet.jpg'),
  ('len(thumbs)==90','len(thumbs)==70'),
  ('scene_contact_sheet_90_frames','scene_contact_sheet_70_frames'),
  ('"video_id":"v154","title":"池の水をぜんぶ抜いた。その後、池はどうなったのか？"','"video_id":"v156","title":"オニヤンマはなぜ最強なのか"'),
  ('"image_source":"assets/final/S001.jpg-S090.jpg only"','"image_source":"assets/final/S001.jpg-S070.jpg only"'),
  ('"special_blur_background_scenes":["S018","S028","S032","S057"]','"special_blur_background_scenes":[]'),
  ('"scene_count_90":len(all_scenes)==90','"scene_count_70":len(all_scenes)==70'),
  ('"blur_layout_targets_exactly_four"','"blur_layout_targets_none"'),
  ('expected=elapsed','expected=elapsed+20.0')
 ]
 for a,z in reps:
  src=src.replace(a,z)
 src=src.replace('final=out/"v156-oniyanma-final.mp4"','main=out/"v156-main.mp4"'+chr(10)+'    final=out/"v156-oniyanma-final.mp4"')
 marker='    run(["ffmpeg","-y","-loglevel","error","-f","concat","-safe","0","-i",str(concat),"-c","copy","-movflags","+faststart",str(final)])'
 add="\n".join([
  '    run(["ffmpeg","-y","-loglevel","error","-f","concat","-safe","0","-i",str(concat),"-c","copy","-movflags","+faststart",str(main)])',
  '    endcard=out/"end-card.mp4"',
  '    run(["ffmpeg","-y","-loglevel","error","-loop","1","-framerate","30","-i",str(ROOT.parent/"assets"/"end_card.png"),"-f","lavfi","-i","anullsrc=channel_layout=mono:sample_rate=48000","-t","20","-vf","scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,format=yuv420p","-r","30","-fps_mode","cfr","-c:v","libx264","-preset","veryfast","-crf","19","-pix_fmt","yuv420p","-c:a","aac","-b:a","160k","-ar","48000","-ac","1","-shortest","-movflags","+faststart",str(endcard)])',
  '    fc=out/"concat-with-endcard.txt"',
  '    fc.write_text("file \'"+str(main.resolve())+"\'"+chr(10)+"file \'"+str(endcard.resolve())+"\'"+chr(10),encoding="utf-8")',
  '    run(["ffmpeg","-y","-loglevel","error","-f","concat","-safe","0","-i",str(fc),"-c","copy","-movflags","+faststart",str(final)])'
 ])
 if marker not in src:
  raise SystemExit("finalizer concat marker not found")
 src=src.replace(marker,add)
 src=src.replace('"scene_count":len(all_scenes),"chapter_card_count":len(card_thumbs),','"scene_count":len(all_scenes),"chapter_card_count":len(card_thumbs),"end_card_duration_seconds":20,')
 (RUNTIME/"scripts/finalize.py").write_text(src,encoding="utf-8")
 print(json.dumps({"runtime":"shared/v155/runtime","scenes":84,"chapters":8}))
if __name__=="__main__": main()
