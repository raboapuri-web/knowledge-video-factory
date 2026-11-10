#!/usr/bin/env python3
"""Still-image documentary renderer: gentle zoom/pan, bottom-centre subtitles, Aoyama narration."""
import json, subprocess, sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
BOARD=json.loads((ROOT/"content/board.json").read_text(encoding="utf-8"))
def run(cmd):
    subprocess.run(cmd,check=True)
def main(chapter):
    spec=next((x for x in BOARD["chapters"] if x["id"]==chapter),None)
    if not spec: raise SystemExit("unknown chapter "+chapter)
    voice=json.loads((ROOT/"media"/f"voice-report-{chapter}.json").read_text(encoding="utf-8"))
    by_id={x["scene"]:x for x in voice["scenes"]}
    out=ROOT/"output"/chapter; out.mkdir(parents=True,exist_ok=True)
    concat=out/"concat.txt"; lines=[]; scene_reports=[]
    scenes=[s for s in BOARD["scenes"] if spec["start"]<=int(s["id"][1:])<=spec["end"]]
    for s in scenes:
        sid=s["id"]; timing=by_id[sid]
        img=(ROOT/"assets/collected"/(sid+".jpg")) if s["mode"]=="収集" else (ROOT/"assets/generated"/(sid+".png"))
        wav=ROOT/"media/speech"/(sid+".wav")
        ass=ROOT/"media/captions"/(sid+".ass")
        for f in (img,wav,ass):
            if not f.is_file(): raise FileNotFoundError(f)
        duration=float(timing["duration"]); frames=max(1,int(round(duration*30)))
        motion=s.get("motion","")
        if "左から右" in motion or "left to right" in motion.lower():
            x=f"min((iw-iw/zoom)*on/{frames},iw-iw/zoom)"
            y="ih/2-ih/zoom/2"
        elif "右から左" in motion or "right to left" in motion.lower():
            x=f"(iw-iw/zoom)*(1-on/{frames})"
            y="ih/2-ih/zoom/2"
        elif "上から下" in motion:
            x="iw/2-iw/zoom/2"; y=f"min((ih-ih/zoom)*on/{frames},ih-ih/zoom)"
        else:
            x="iw/2-iw/zoom/2"; y="ih/2-ih/zoom/2"
        z=f"min(1+0.06*on/{frames},1.06)"
        ass_rel=ass.relative_to(ROOT).as_posix()
        vf=(f"scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,"
            f"zoompan=z='{z}':x='{x}':y='{y}':d=1:s=1920x1080:fps=30,"
            f"ass={ass_rel}")
        dest=out/(sid+".mp4")
        cmd=["ffmpeg","-y","-loglevel","error","-loop","1","-framerate","30","-i",str(img),
             "-i",str(wav),"-vf",vf,"-t",str(duration),"-r","30","-fps_mode","cfr",
             "-c:v","libx264","-preset","veryfast","-crf","19","-pix_fmt","yuv420p",
             "-c:a","aac","-b:a","160k","-shortest","-movflags","+faststart",str(dest)]
        run(cmd)
        if not dest.is_file() or dest.stat().st_size<20000: raise RuntimeError("empty scene render "+sid)
        lines.append("file '"+str(dest.resolve())+"'")
        scene_reports.append({"scene":sid,"duration":round(duration,3),"file":str(dest.relative_to(ROOT)),
                              "motion":"pan" if "pan" in motion.lower() or "左から右" in motion else "slow zoom"})
        if len(scene_reports)%5==0:
            print(json.dumps({"chapter":chapter,"rendered_scenes":len(scene_reports),"total":len(scenes)},ensure_ascii=False),flush=True)
    concat.write_text("\n".join(lines)+"\n",encoding="utf-8")
    final=ROOT/"output"/f"v153-{chapter}.mp4"
    run(["ffmpeg","-y","-loglevel","error","-f","concat","-safe","0","-i",str(concat),
         "-c","copy","-movflags","+faststart",str(final)])
    report={"chapter":chapter,"scene_count":len(scene_reports),"duration":sum(x["duration"] for x in scene_reports),
            "video":str(final.relative_to(ROOT)),"scenes":scene_reports}
    (ROOT/"output"/f"render-{chapter}.json").write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding="utf-8")
    print(json.dumps({"chapter":chapter,"scene_count":len(scene_reports),"video":str(final)},ensure_ascii=False),flush=True)
if __name__=="__main__":
    if len(sys.argv)!=2: raise SystemExit("usage: render_chapter.py <chapter>")
    main(sys.argv[1])
