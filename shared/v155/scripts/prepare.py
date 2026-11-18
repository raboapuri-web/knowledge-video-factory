#!/usr/bin/env python3
import json, shutil
from pathlib import Path
BASE=Path(__file__).resolve().parents[1]; RUNTIME=BASE/"runtime"; V154=BASE.parent/"v154"
def main():
 b=json.loads((BASE/"board.json").read_text(encoding="utf-8")); scenes=b["scenes"]
 ranges=[("prologue",1,5),("chapter1",6,20),("chapter2",21,33),("chapter3",34,46),("chapter4",47,56),("chapter5",57,66),("chapter6",67,78),("epilogue",79,84)]
 titles=["プロローグ","深海の捕食者","クジラの歌","52ヘルツのクジラ","乳白色の海","ニシオンデンザメ","宇宙の海","エピローグ"]
 if [s["id"] for s in scenes]!=[f"S{i:03d}" for i in range(1,85)]: raise SystemExit("board must contain S001-S084")
 for d in ["content","assets","format_v2/config","format_v2/scripts","scripts","media","output","segments"]: (RUNTIME/d).mkdir(parents=True,exist_ok=True)
 compat={"video_id":"v155","title":"未だ解明されていない海の謎6選","scenes":[{"id":s["id"],"script":s["narration"],"motion":s["motion"],"image_count":1} for s in scenes],
 "chapters":[{"id":cid,"title":titles[i],"start":a,"end":z,"scene_count":z-a+1} for i,(cid,a,z) in enumerate(ranges)],
 "chapter_cards":[{"id":f"T{i+1:03d}","chapter":ranges[i][0],"title":titles[i]} for i in range(8)]}
 (RUNTIME/"content/board.json").write_text(json.dumps(compat,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
 # V154 finalizer expects an asset manifest beside the approved image set; derive it from the supplied credits.
 credits=(BASE/"credits_collected.txt").read_text(encoding="utf-8")
 (BASE/"assets/final/ASSET_MANIFEST.md").write_text("# V155 approved asset credits\\n\\n"+credits+"\\n",encoding="utf-8")
 final=RUNTIME/"assets/final"
 if final.is_symlink(): final.unlink()
 elif final.exists(): shutil.rmtree(final)
 final.symlink_to(BASE/"assets/final",target_is_directory=True)
 spec=json.loads((V154/"format_v2/config/chapter_card_spec.json").read_text(encoding="utf-8"))
 spec["project"]="V155 未だ解明されていない海の謎6選"; spec["typing"]["sfx_file"]="../../../v153/format_v2/audio/type_key.wav"
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
 render=RUNTIME/"scripts/render_chapter.py"; t=render.read_text(encoding="utf-8").replace("len(MOTION_BY_ID)!=90","len(MOTION_BY_ID)!=84").replace('SPECIAL_BLUR={"S018","S028","S032","S057"}','SPECIAL_BLUR={"S041","S071","S080"}').replace("v154-{chapter}.mp4","v155-{chapter}.mp4"); render.write_text(t,encoding="utf-8")
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
 (RUNTIME/"format_v2/config/scene_motion_map.json").write_text(json.dumps({"schema_version":"2.0","project":compat["title"],"scene_count":84,"render":{"width":1920,"height":1080,"fps":30,"zoompan_baseline":1.2,"pan_travel_percent":16.7},"entries":entries},ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
 src=(V154/"scripts/finalize.py").read_text(encoding="utf-8")
 reps=[('EXPECTED_SCENES=[f"S{i:03d}" for i in range(1,91)]','EXPECTED_SCENES=[f"S{i:03d}" for i in range(1,85)]'),('v154-{chapter}.mp4','v155-{chapter}.mp4'),('{"S018","S028","S032","S057"}','{"S041","S071","S080"}'),('S090','S084'),('v154-pond-recovery-final.mp4','v155-sea-mysteries-final.mp4'),('v154-contact-sheet.jpg','v155-contact-sheet.jpg'),('v154-chapter-cards-contact-sheet.jpg','v155-chapter-cards-contact-sheet.jpg'),('len(thumbs)==90','len(thumbs)==84'),('scene_contact_sheet_90_frames','scene_contact_sheet_84_frames'),('"video_id":"v154","title":"池の水をぜんぶ抜いた。その後、池はどうなったのか？"','"video_id":"v155","title":"未だ解明されていない海の謎6選"'),('"image_source":"assets/final/S001.jpg-S090.jpg only"','"image_source":"assets/final/S001.jpg-S084.jpg only"'),('"special_blur_background_scenes":["S018","S028","S032","S057"]','"special_blur_background_scenes":["S041","S071","S080"]'),('expected=elapsed','expected=elapsed+20.0')]
 for a,z in reps: src=src.replace(a,z)
 src=src.replace('final=out/"v155-sea-mysteries-final.mp4"','main=out/"v155-main.mp4"\n    final=out/"v155-sea-mysteries-final.mp4"')
 marker='run(["ffmpeg","-y","-loglevel","error","-f","concat","-safe","0","-i",str(concat),"-c","copy","-movflags","+faststart",str(final)])'
 add='''run(["ffmpeg","-y","-loglevel","error","-f","concat","-safe","0","-i",str(concat),"-c","copy","-movflags","+faststart",str(main)])
    endcard=out/"end-card.mp4"
    run(["ffmpeg","-y","-loglevel","error","-loop","1","-framerate","30","-i",str(BASE/"assets"/"end_card.png"),"-f","lavfi","-i","anullsrc=channel_layout=mono:sample_rate=48000","-t","20","-vf","scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,format=yuv420p","-r","30","-fps_mode","cfr","-c:v","libx264","-preset","veryfast","-crf","19","-c:a","aac","-b:a","160k","-ar","48000","-ac","1","-shortest","-movflags","+faststart",str(endcard)])
    fc=out/"concat-with-endcard.txt"
    fc.write_text("file '"+str(main.resolve())+"'\\\\nfile '"+str(endcard.resolve())+"'\\\\n",encoding="utf-8")
    run(["ffmpeg","-y","-loglevel","error","-f","concat","-safe","0","-i",str(fc),"-c","copy","-movflags","+faststart",str(final)])'''
 if marker not in src: raise SystemExit("finalizer concat insertion point missing")
 src=src.replace(marker,add)
 src=src.replace('"scene_count":len(all_scenes),"chapter_card_count":len(card_thumbs),','"scene_count":len(all_scenes),"chapter_card_count":len(card_thumbs),"end_card_duration_seconds":20,')
 (RUNTIME/"scripts/finalize.py").write_text(src,encoding="utf-8")
 print(json.dumps({"runtime":"shared/v155/runtime","scenes":84,"chapters":8}))
if __name__=="__main__": main()
