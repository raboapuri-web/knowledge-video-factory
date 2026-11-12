#!/usr/bin/env python3
"""V153 format-v2 renderer: per-scene Ken Burns motion, chapter cards, black subtitle band."""
import json, subprocess, sys, os
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
FORMAT=ROOT/"format_v2"
BOARD=json.loads((ROOT/"content/board.json").read_text(encoding="utf-8"))
MOTION=json.loads((FORMAT/"config/scene_motion_map.json").read_text(encoding="utf-8"))
CHAPTER_SPEC=json.loads((FORMAT/"config/chapter_card_spec.json").read_text(encoding="utf-8"))
MOTION_BY_ID={x["scene_id"]:x for x in MOTION["entries"]}

def run(cmd):
    subprocess.run(cmd,check=True)

def esc_filter_path(p):
    # FFmpeg filter path escaping for Linux paths used in Actions.
    return str(p).replace("\\", "\\\\").replace(":", "\\:").replace("'", "\\'")

def motion_filter(entry, frames):
    motion=entry["motion"]
    z0=float(entry["scale_from"]); z1=float(entry["scale_to"])
    if motion in ("zoom_in","zoom_out"):
        z=f"{z0:.5f}+({z1-z0:.5f})*on/{frames}"
        x="iw/2-iw/zoom/2"; y="ih/2-ih/zoom/2"
    elif motion=="static":
        z="1.0"; x="0"; y="0"
    else:
        a=entry["camera_from"]; b=entry["camera_to"]
        z=f"{z0:.5f}"
        x=f"(iw-iw/zoom)*({a[0]:.5f}+({b[0]-a[0]:.5f})*on/{frames})"
        y=f"(ih-ih/zoom)*({a[1]:.5f}+({b[1]-a[1]:.5f})*on/{frames})"
    return f"zoompan=z='{z}':x='{x}':y='{y}':d=1:s=1920x1080:fps=30"

def main(chapter):
    spec=next((x for x in BOARD["chapters"] if x["id"]==chapter),None)
    if not spec: raise SystemExit("unknown chapter "+chapter)
    if len(MOTION_BY_ID)!=88: raise SystemExit("scene_motion_map.json must contain 88 scene entries")
    voice=json.loads((ROOT/"media"/f"voice-report-{chapter}.json").read_text(encoding="utf-8"))
    by_id={x["scene"]:x for x in voice["scenes"]}
    out=ROOT/"output"/chapter; out.mkdir(parents=True,exist_ok=True)
    font_dir=os.getenv("V153_FONTS_DIR",str(Path.home()/".local/share/fonts"))
    concat=out/"concat.txt"; lines=[]; scene_reports=[]

    # Render and prepend the chapter title card. It has typing SFX only; no narration.
    card_cmd=[sys.executable,str(FORMAT/"scripts/render_chapter_card.py"),chapter]
    run(card_cmd)
    card_file=ROOT/"output"/f"chapter-card-{chapter}.mp4"
    if not card_file.is_file(): raise FileNotFoundError(card_file)
    lines.append("file '"+str(card_file.resolve())+"'")

    scenes=[s for s in BOARD["scenes"] if spec["start"]<=int(s["id"][1:])<=spec["end"]]
    for s in scenes:
        sid=s["id"]
        if sid not in MOTION_BY_ID: raise KeyError("missing motion assignment for "+sid)
        if sid not in by_id: raise KeyError("missing voice timing for "+sid)
        timing=by_id[sid]
        img=(ROOT/"assets/collected"/(sid+".jpg")) if s["mode"]=="収集" else (ROOT/"assets/generated"/(sid+".png"))
        wav=ROOT/"media/speech"/(sid+".wav")
        ass=ROOT/"media/captions"/(sid+".ass")
        for f in (img,wav,ass):
            if not f.is_file(): raise FileNotFoundError(f)
        duration=float(timing["duration"]); frames=max(1,int(round(duration*30)))
        entry=MOTION_BY_ID[sid]
        motion=motion_filter(entry,frames)
        ass_path=esc_filter_path(ass)
        fonts_path=esc_filter_path(Path(font_dir))
        # The black band is a separate, opaque layer. ASS subtitles are composited above it.
        vf=("scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,"
            +motion+",drawbox=x=0:y=950:w=1920:h=130:color=black:t=fill,"
            +f"ass='{ass_path}':fontsdir='{fonts_path}'")
        dest=out/(sid+".mp4")
        cmd=["ffmpeg","-y","-loglevel","error","-loop","1","-framerate","30","-i",str(img),
             "-i",str(wav),"-vf",vf,"-t",str(duration),"-r","30","-fps_mode","cfr",
             "-c:v","libx264","-preset","veryfast","-crf","19","-pix_fmt","yuv420p",
             "-c:a","aac","-b:a","160k","-ar","48000","-ac","1","-shortest","-movflags","+faststart",str(dest)]
        run(cmd)
        if not dest.is_file() or dest.stat().st_size<20000: raise RuntimeError("empty scene render "+sid)
        lines.append("file '"+str(dest.resolve())+"'")
        scene_reports.append({"scene":sid,"duration":round(duration,3),"file":str(dest.relative_to(ROOT)),
                              "motion":entry["motion"],"scale_from":entry["scale_from"],"scale_to":entry["scale_to"]})
        if len(scene_reports)%5==0:
            print(json.dumps({"chapter":chapter,"rendered_scenes":len(scene_reports),"total":len(scenes)},ensure_ascii=False),flush=True)

    concat.write_text("\n".join(lines)+"\n",encoding="utf-8")
    final=ROOT/"output"/f"v153-{chapter}.mp4"
    run(["ffmpeg","-y","-loglevel","error","-f","concat","-safe","0","-i",str(concat),"-c","copy","-movflags","+faststart",str(final)])
    card=next(x for x in CHAPTER_SPEC["cards"] if x["chapter"]==chapter)
    report={"chapter":chapter,"scene_count":len(scene_reports),"duration":sum(x["duration"] for x in scene_reports),
            "chapter_card":{"file":str(card_file.relative_to(ROOT)),"label":card["label"],"title":card["title"]},
            "video":str(final.relative_to(ROOT)),"scenes":scene_reports}
    (ROOT/"output"/f"render-{chapter}.json").write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding="utf-8")
    print(json.dumps({"chapter":chapter,"scene_count":len(scene_reports),"chapter_card":str(card_file),"video":str(final)},ensure_ascii=False),flush=True)

if __name__=="__main__":
    if len(sys.argv)!=2: raise SystemExit("usage: render_chapter.py <chapter>")
    main(sys.argv[1])
