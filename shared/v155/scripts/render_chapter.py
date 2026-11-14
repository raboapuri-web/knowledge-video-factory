#!/usr/bin/env python3
"""Render one V155 chapter: one image per scene, continuous 30fps motion, fixed subtitle band."""
import json, subprocess, sys, os
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
FORMAT=ROOT/"format_v2"
BOARD=json.loads((ROOT/"content"/"board.json").read_text(encoding="utf-8"))
MOTION=json.loads((FORMAT/"config"/"scene_motion_map.json").read_text(encoding="utf-8"))
sys.path.insert(0,str(ROOT.parent))
from motion.continuous_motion import motion_filter as continuous_motion_filter
MOTION_BY_ID={x["scene_id"]:x for x in MOTION["entries"]}

def run(cmd): subprocess.run(cmd,check=True)
def esc(p): return str(p).replace("\\","\\\\").replace(":","\\:").replace("'","\\'")

def main(chapter):
    spec=next((x for x in BOARD["chapters"] if x["id"]==chapter),None)
    if not spec: raise SystemExit("unknown chapter "+chapter)
    if len(MOTION_BY_ID)!=88: raise SystemExit("motion map must contain 88 scenes")
    voice=json.loads((ROOT/"media"/f"voice-report-{chapter}.json").read_text(encoding="utf-8"))
    by_id={x["scene"]:x for x in voice["scenes"]}
    out=ROOT/"output"/"chapter"; out.mkdir(parents=True,exist_ok=True)
    font_dir=os.getenv("V153_FONTS_DIR",str(Path.home()/".local/share/fonts"))
    concat=out/"concat.txt"; lines=[]; reports=[]
    run([sys.executable,str(FORMAT/"scripts"/"render_chapter_card.py"),chapter])
    card_file=ROOT/"output"/f"chapter-card-{chapter}.mp4"
    card_report_path=ROOT/"output"/f"chapter-card-{chapter}.json"
    if not card_file.is_file() or not card_report_path.is_file(): raise FileNotFoundError("chapter card output missing")
    card_report=json.loads(card_report_path.read_text(encoding="utf-8"))
    lines.append("file '"+str(card_file.resolve())+"'")
    scenes=[s for s in BOARD["scenes"] if int(spec["start"])<=int(s["id"][1:])<=int(spec["end"])]
    if [s["id"] for s in scenes] != [x["scene"] for x in voice["scenes"]]:
        raise ValueError(f"{chapter}: board and voice report scene order mismatch")
    for s in scenes:
        sid=s["id"]
        if sid not in MOTION_BY_ID: raise KeyError("missing motion "+sid)
        if sid not in by_id: raise KeyError("missing voice "+sid)
        img=ROOT/"assets"/"final"/(sid+".jpg")
        wav=ROOT/"media"/"speech"/(sid+".wav")
        ass=ROOT/"media"/"captions"/(sid+".ass")
        for f in (img,wav,ass):
            if not f.is_file(): raise FileNotFoundError(f)
        duration=float(by_id[sid]["duration"]); frames=max(1,int(round(duration*30)))
        move=continuous_motion_filter(MOTION_BY_ID[sid],frames)
        ass_path=esc(ass); fonts_path=esc(Path(font_dir))
        vf=("scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,"
            +move+",drawbox=x=0:y=950:w=1920:h=130:color=black:t=fill,"
            +f"ass='{ass_path}':fontsdir='{fonts_path}'")
        dest=out/(sid+".mp4")
        cmd=["ffmpeg","-y","-loglevel","error","-loop","1","-framerate","30","-i",str(img),
             "-i",str(wav),"-vf",vf,"-t",str(duration),"-r","30","-fps_mode","cfr",
             "-c:v","libx264","-preset","veryfast","-crf","19","-pix_fmt","yuv420p",
             "-c:a","aac","-b:a","160k","-ar","48000","-ac","1","-shortest","-movflags","+faststart",str(dest)]
        run(cmd)
        if not dest.is_file() or dest.stat().st_size<20000: raise RuntimeError("empty scene render "+sid)
        lines.append("file '"+str(dest.resolve())+"'")
        reports.append({"scene":sid,"duration":round(duration,4),"file":str(dest.relative_to(ROOT)),
                        "motion":MOTION_BY_ID[sid]["motion"],"scale_from":MOTION_BY_ID[sid]["scale_from"],
                        "scale_to":MOTION_BY_ID[sid]["scale_to"],"layout":"single_image_full_frame",
                        "source_image":f"assets/final/{sid}.jpg","motion_renderer":"shared/motion/continuous_motion.py",
                        "motion_evaluation":"every frame at 30fps, subpixel interpolation"})
        if len(reports)%5==0: print(json.dumps({"chapter":chapter,"rendered_scenes":len(reports),"total":len(scenes)},ensure_ascii=False),flush=True)
    concat.write_text("\n".join(lines)+"\n",encoding="utf-8")
    chapter_mp4=ROOT/"output"/f"v155-{chapter}.mp4"
    run(["ffmpeg","-y","-loglevel","error","-f","concat","-safe","0","-i",str(concat),"-c","copy","-movflags","+faststart",str(chapter_mp4)])
    report={"chapter":chapter,"file":str(chapter_mp4.relative_to(ROOT)),"scene_count":len(reports),
            "chapter_card":card_report,"scenes":reports,"audio_sample_rate":48000,"fps":30}
    (ROOT/"output"/f"render-{chapter}.json").write_text(json.dumps(report,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print(json.dumps({"chapter":chapter,"scenes":len(reports),"file":str(chapter_mp4.relative_to(ROOT))},ensure_ascii=False),flush=True)

if __name__=="__main__":
    if len(sys.argv)!=2: raise SystemExit("usage: render_chapter.py <chapter>")
    main(sys.argv[1])
