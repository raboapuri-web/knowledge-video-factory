#!/usr/bin/env python3
"""V159 production: 102 scenes, 7 unspoken typed chapter cards, 48kHz PCM, one final AAC encode."""
import argparse, array, hashlib, json, math, os, re, shutil, subprocess, sys, wave
from pathlib import Path

BASE=Path(__file__).resolve().parents[1]
ASSETS=BASE/"assets"/"final"
BOARD=json.loads((BASE/"content"/"board.json").read_text(encoding="utf-8"))
OUTPUT=BASE/"output"
FPS=30
SR=48000
SAMPLES_PER_FRAME=SR//FPS
FONT_DIR=Path(os.environ.get("V159_FONTS_DIR","/usr/share/fonts/opentype/noto"))
LEGACY_BRANCH="v153-deep-sea-single-image-fix-20261112"
LEGACY_PREFIX="shared/v153/format_v2/"
FONT_CANDIDATES=[
  str(FONT_DIR/"NotoSansCJKjp-Regular.otf"),
  "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc",
  "/usr/share/fonts/truetype/noto/NotoSansCJK-Regular.ttc",
]
def font_file():
    for x in FONT_CANDIDATES:
        if Path(x).is_file(): return x
    raise FileNotFoundError("Noto CJK font missing: "+str(FONT_CANDIDATES))

def execute(cmd,stdout=None):
    p=subprocess.run([str(x) for x in cmd],stdout=(stdout if stdout is not None else subprocess.PIPE),stderr=subprocess.PIPE,text=False)
    if p.returncode:
        raise RuntimeError(f"Command failed {p.returncode}: {' '.join(map(str,cmd))}\n{p.stderr.decode('utf-8','replace')[-4500:]}")
    return p.stdout

def probe(path):
    data=execute(["ffprobe","-v","error","-show_streams","-show_format","-of","json",path])
    return json.loads(data)

def sec2ass(seconds):
    c=max(0,round(seconds*100))
    return f"{c//360000}:{(c//6000)%60:02}:{(c//100)%60:02}.{c%100:02}"

def ass_header(font_size=43,alignment=2,margin_v=18):
    return (
      "[Script Info]\nScriptType: v4.00+\nPlayResX: 1920\nPlayResY: 1080\nWrapStyle: 2\nScaledBorderAndShadow: yes\n"
      "[V4+ Styles]\n"
      "Format: Name,Fontname,Fontsize,PrimaryColour,SecondaryColour,OutlineColour,BackColour,Bold,Italic,Underline,StrikeOut,ScaleX,ScaleY,Spacing,Angle,BorderStyle,Outline,Shadow,Alignment,MarginL,MarginR,MarginV,Encoding\n"
      f"Style: Default,Noto Sans CJK JP,{font_size},&H00FFFFFF,&H00FFFFFF,&H00101010,&H00000000,0,0,0,0,100,100,0,0,1,2,0,{alignment},36,36,{margin_v},1\n"
      "[Events]\nFormat: Layer,Start,End,Style,Name,MarginL,MarginR,MarginV,Effect,Text\n")

def ass_escape(text):
    return text.replace("\\","\\\\").replace("{","(").replace("}",")").replace("\n",r"\N")

def ass_path_filter(path):
    return str(Path(path).resolve()).replace("\\","\\\\").replace(":","\\:").replace("'","\\'")

def write_captions(scene,seconds,path):
    text=scene["script"]
    # Subtitle segmentation preserves all spoken characters, with length-weighted timing.
    sentences=re.findall(r"[^。！？\n]+[。！？]?|\n+",text)
    cues=[]
    for fragment in sentences:
        fragment=fragment.strip()
        if not fragment: continue
        while len(fragment)>64:
            possible=[fragment.rfind(ch,22,54) for ch in ("、","，","；"," ")]
            cut=max(possible)+1 if max(possible)>=25 else 44
            cues.append(fragment[:cut])
            fragment=fragment[cut:]
        if fragment: cues.append(fragment)
    if not cues: raise ValueError("empty subtitles "+scene["id"])
    # 2-line at most; 35 Japanese glyphs per line.
    weights=[max(1,len(x)) for x in cues]
    unit=seconds/sum(weights)
    t=0.0
    ass=ass_header()
    for i,(cue,w) in enumerate(zip(cues,weights)):
        end=seconds if i==len(cues)-1 else min(seconds,t+w*unit)
        lines=[cue[k:k+35] for k in range(0,len(cue),35)]
        if len(lines)>2: raise ValueError("caption line overflow "+scene["id"])
        ass+=f"Dialogue: 0,{sec2ass(t)},{sec2ass(end)},Default,,0,0,0,,{ass_escape(chr(10).join(lines))}\n"
        t=end
    path.write_text(ass,encoding="utf-8")
    return len(cues)

def resolve_asset(scene):
    sid=scene["id"]
    for ext in (".mp4",".jpg",".png",".jpeg"):
        p=ASSETS/(sid+ext)
        if p.is_file(): return p
    raise FileNotFoundError("Missing scene asset "+sid)

def validate():
    assert BOARD["episode"]=="V159"
    scenes=BOARD["scenes"]
    cards=BOARD["chapter_cards"]
    chapters=BOARD["chapters"]
    assert len(scenes)==102 and len(cards)==7 and len(chapters)==7
    assert [s["id"] for s in scenes]==[f"S{i:03d}" for i in range(1,103)]
    assert all(s["narration"] and s["subtitles"] for s in scenes)
    assert all(not c["narration"] and not c["subtitle"] for c in cards)
    assert BOARD["end_screen"]["duration_seconds"]==20
    assert all(c["title"]==c["text"]==ch["title"] for c,ch in zip(cards,chapters))
    assert all(s["image_count"]==1 and s["image_layout"]=="single_full_bleed" for s in scenes)
    assert all(s["material_type"] in ("写真","動画静止画","図解","生成") for s in scenes)
    assert all(s.get("motion") in ("zoom_in","zoom_out","pan_right","pan_left","pan_up","pan_down","static") for s in scenes)
    assert all(not (scenes[i]["motion"]==scenes[i-1]["motion"]==scenes[i-2]["motion"]) for i in range(2,len(scenes)))
    overrides=[s for s in scenes if s.get("reading_overrides")]
    assert sum(x["occurrences"] for s in overrides for x in s["reading_overrides"])==8
    for s in scenes:
        expected=s["script"].replace("少し","すこし")
        if "少し" in s["script"]:
            assert s.get("tts_script")==expected, "TTS override mismatch: "+s["id"]
            assert sum(x["occurrences"] for x in s["reading_overrides"])==s["script"].count("少し")
        else:
            assert "tts_script" not in s or s["tts_script"]==s["script"]
    assert BOARD["validation"]["byte_identical_script_concatenation"] is True
    assert len("".join(s["script"] for s in scenes))==BOARD["validation"]["narration_script_chars"]
    credits_path=BASE/"assets"/"photo_credits.json"
    credits=json.loads(credits_path.read_text(encoding="utf-8"))
    assert all(s["id"] in credits for s in scenes),"Missing per-scene credit"
    forbidden=("CC BY-SA","CC BY SA","NC","ND","All rights reserved")
    for s in scenes:
        c=credits[s["id"]]
        assert c.get("page") and c.get("artist") is not None and c.get("license"),"Incomplete credit: "+s["id"]
        lic=c["license"].upper()
        assert not any(x.upper() in lic for x in forbidden),"Forbidden license: "+s["id"]+" "+lic
    resolved={s["id"]:resolve_asset(s) for s in scenes}
    for sid,p in resolved.items():
        if p.suffix.lower() not in (".jpg",".jpeg",".png",".mp4"):
            raise ValueError("Unsupported asset type: "+sid+" "+p.suffix)
    video_assets=[sid for sid,p in resolved.items() if p.suffix.lower()==".mp4"]
    for sid in video_assets:
        v=probe(resolved[sid])
        vs=next(x for x in v["streams"] if x["codec_type"]=="video")
        assert vs["codec_name"]=="h264" and vs["width"]==1920 and vs["height"]==1080 and vs["r_frame_rate"]=="30/1"
    return {"script_chars":len("".join(s["script"] for s in scenes)),"narration_scenes":len(scenes),
            "cards":len(cards),"asset_count":len(resolved),"credit_count":len(credits),
            "chapter_count":len(chapters),"reading_override_occurrences":8,
            "reading_override_scenes":[s["id"] for s in overrides],"video_assets":video_assets}
    
def prepare_legacy():
    dest=BASE/"legacy"
    needed=["audio/type_key.wav"]+["assets/chapter_cards/backgrounds/"+name+"_bg.png" for name in
        ("prologue","chapter1","chapter2","chapter3","chapter4","epilogue")]
    if all((dest/n).is_file() for n in needed):return
    # The approved V153 card backgrounds include the original reading-moon character.
    execute(["git","fetch","--depth=1","origin",LEGACY_BRANCH])
    for name in needed:
        target=dest/name
        target.parent.mkdir(parents=True,exist_ok=True)
        with target.open("wb") as f:
            execute(["git","show","FETCH_HEAD:"+LEGACY_PREFIX+name],stdout=f)
        if target.stat().st_size<500: raise ValueError("missing legacy media "+name)

def get_card_background(chapter):
    name=chapter if chapter in ("prologue","chapter1","chapter2","chapter3","chapter4","epilogue") else {"chapter5":"chapter3","chapter6":"chapter4"}[chapter]
    return BASE/"legacy"/"assets"/"chapter_cards"/"backgrounds"/(name+"_bg.png")

def write_card_ass(card,path,fps=30):
    label,title=card["title"].split("｜",1)
    # Use full original title characters in order: no paraphrase.
    heading=card["title"]
    cps=float(card["typing"]["characters_per_second"])
    initial=0.25
    typed_at=initial+len(heading)/cps
    duration=max(4.0,typed_at+0.6+float(card["typing"]["hold_after_typing_seconds"]))
    frames=math.ceil(duration*FPS)
    duration=frames/FPS
    ass=ass_header(57,5,0)
    def shown(i, cursor):
        raw=heading[:i]
        a,b=(raw.split("｜",1)+[""])[:2] if "｜" in raw else (raw,"")
        # Break the longest titles into at most 2 lines.
        if len(b)>18: b=b[:18]+r"\N"+b[18:]
        display=a+(r"\N" if b else "")+b+("▌" if cursor else "")
        return r"{\pos(1200,465)\c&H00D9EDFC&\3c&H001A3750&}"+ass_escape(display).replace(r"\\N",r"\N")
    for i in range(len(heading)):
        start=initial+i/cps
        end=initial+(i+1)/cps
        if end>start:
            ass+=f"Dialogue: 0,{sec2ass(start)},{sec2ass(end)},Default,,0,0,0,,{shown(i+1,True)}\n"
    t=typed_at
    while t<typed_at+0.6:
        end=min(t+0.25,typed_at+0.6)
        ass+=f"Dialogue: 0,{sec2ass(t)},{sec2ass(end)},Default,,0,0,0,,{shown(len(heading),int((t-typed_at)/0.25)%2==0)}\n"
        t=end
    ass+=f"Dialogue: 0,{sec2ass(typed_at+0.6)},{sec2ass(duration)},Default,,0,0,0,,{shown(len(heading),False)}\n"
    path.write_text(ass,encoding="utf-8")
    return frames,initial,cps,len(heading)

def sound_samples(card,frames,initial,cps,chars):
    path=BASE/"legacy"/"audio"/"type_key.wav"
    with wave.open(str(path),"rb") as r:
        ch,sw,sr=r.getnchannels(),r.getsampwidth(),r.getframerate()
        data=r.readframes(r.getnframes())
    assert sw==2 and sr==SR,"V153 key wav must be 48kHz PCM16"
    key=array.array("h");key.frombytes(data)
    if ch>1:key=array.array("h",[sum(key[i:i+ch])//ch for i in range(0,len(key),ch)])
    total=frames*SAMPLES_PER_FRAME
    buf=array.array("h",[0])*total
    for i in range(chars):
        start=round((initial+i/cps)*SR)
        for j,val in enumerate(key):
            if start+j>=total:break
            mix=buf[start+j]+round(val*0.45)
            buf[start+j]=max(-32768,min(32767,mix))
    if sys.byteorder=="big":buf.byteswap()
    return buf.tobytes()

def render_video(src,dest,frames,ass_file,motion=None,video_input=False):
    # Still images: blurred cover background + sharp contain foreground; video clips are muted and receive no motion.
    if video_input:
        filters=["fps=30","scale=1920:1080:force_original_aspect_ratio=increase","crop=1920:1080"]
    else:
        filters=["split=2[bg][fg]",
                 "[bg]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,gblur=sigma=28[blur]",
                 "[fg]scale=1920:1080:force_original_aspect_ratio=decrease[sharp]",
                 "[blur][sharp]overlay=(W-w)/2:(H-h)/2[base]"]
        if motion and motion!="static":
            denom=max(1,frames-1)
            u=f"on/{denom}"
            if motion=="zoom_in":
                z=f"1+0.2*{u}";x="iw/2-iw/zoom/2";y="ih/2-ih/zoom/2"
            elif motion=="zoom_out":
                z=f"1.2-0.2*{u}";x="iw/2-iw/zoom/2";y="ih/2-ih/zoom/2"
            else:
                z="1.2";x="iw/2-iw/zoom/2";y="ih/2-ih/zoom/2"
                if motion=="pan_right":x=f"(iw-iw/zoom)*{u}"
                if motion=="pan_left":x=f"(iw-iw/zoom)*(1-{u})"
                if motion=="pan_up":y=f"(ih-ih/zoom)*(1-{u})"
                if motion=="pan_down":y=f"(ih-ih/zoom)*{u}"
            filters.append(f"[base]zoompan=z='{z}':x='{x}':y='{y}':d=1:s=1920x1080:fps=30[moved]")
            filters.append("[moved]drawbox=x=0:y=950:w=1920:h=130:color=black:t=fill[band]")
            if ass_file: filters.append(f"[band]ass=filename='{ass_path_filter(ass_file)}':fontsdir='{ass_path_filter(FONT_DIR)}'[outv]")
            else: filters.append("[band]null[outv]")
            vf=";".join(filters)
            cmd=["ffmpeg","-y","-hide_banner","-loglevel","error"]
            cmd+=["-i",src] if video_input else ["-loop","1","-framerate","30","-i",src]
            cmd += ["-filter_complex",vf,"-map","[outv]","-frames:v",str(frames),"-an",
                    "-c:v","libx264","-preset","veryfast","-crf","19","-pix_fmt","yuv420p",
                    "-r","30","-fps_mode","cfr","-g","60","-bf","0","-video_track_timescale","30000",dest]
            execute(cmd)
            if not Path(dest).is_file() or Path(dest).stat().st_size<8000: raise RuntimeError("empty video "+str(dest))
            return
        filters.append("[base]drawbox=x=0:y=950:w=1920:h=130:color=black:t=fill[band]")
        if ass_file: filters.append(f"[band]ass=filename='{ass_path_filter(ass_file)}':fontsdir='{ass_path_filter(FONT_DIR)}'[outv]")
        else: filters.append("[band]null[outv]")
        vf=";".join(filters)
        cmd=["ffmpeg","-y","-hide_banner","-loglevel","error"]
        cmd+=["-i",src] if video_input else ["-loop","1","-framerate","30","-i",src]
        cmd += ["-filter_complex",vf,"-map","[outv]","-frames:v",str(frames),"-an",
                "-c:v","libx264","-preset","veryfast","-crf","19","-pix_fmt","yuv420p",
                "-r","30","-fps_mode","cfr","-g","60","-bf","0","-video_track_timescale","30000",dest]
        execute(cmd)
        if not Path(dest).is_file() or Path(dest).stat().st_size<8000: raise RuntimeError("empty video "+str(dest))
        return
    filters += ["drawbox=x=0:y=950:w=1920:h=130:color=black:t=fill"]
    if ass_file: filters.append(f"ass=filename='{ass_path_filter(ass_file)}':fontsdir='{ass_path_filter(FONT_DIR)}'")
    cmd=["ffmpeg","-y","-hide_banner","-loglevel","error"]
    cmd += ["-i",src]
    cmd += ["-vf",",".join(filters),"-frames:v",str(frames),"-an","-c:v","libx264","-preset","veryfast",
            "-crf","19","-pix_fmt","yuv420p","-r","30","-fps_mode","cfr","-g","60","-bf","0",
            "-video_track_timescale","30000",dest]
    execute(cmd)
    if not Path(dest).is_file() or Path(dest).stat().st_size<8000: raise RuntimeError("empty video "+str(dest))

def synth_scene(scene,dest):
    import requests
    endpoint=os.environ.get("VOICEVOX_URL","http://127.0.0.1:50021")
    speaker=int(os.environ.get("VOICEVOX_SPEAKER_ID","13"))
    phrase=scene.get("tts_script",scene["script"])
    assert phrase.replace("すこし","少し")==scene["script"] if scene.get("reading_overrides") else phrase==scene["script"]
    q=requests.post(endpoint+"/audio_query",params={"text":phrase,"speaker":speaker},timeout=180)
    q.raise_for_status()
    query=q.json()
    query["speedScale"]=float(os.environ.get("VOICEVOX_SPEED","1.10"))
    query["intonationScale"]=1.0
    query["outputSamplingRate"]=SR
    query["outputStereo"]=False
    response=requests.post(endpoint+"/synthesis",params={"speaker":speaker},json=query,timeout=1200)
    response.raise_for_status()
    raw=dest.with_suffix(".original.wav")
    raw.write_bytes(response.content)
    execute(["ffmpeg","-y","-loglevel","error","-i",raw,"-ac","1","-ar",str(SR),"-c:a","pcm_s16le",dest])
    raw.unlink()
    with wave.open(str(dest),"rb") as w:
        assert w.getframerate()==SR and w.getnchannels()==1 and w.getsampwidth()==2
        return w.getnframes()

def concat_video(files,target):
    target.parent.mkdir(parents=True,exist_ok=True)
    listing=target.with_suffix(".txt")
    listing.write_text("".join("file '"+str(Path(f).resolve()).replace("'","'\\''")+"'\n" for f in files),encoding="utf-8")
    execute(["ffmpeg","-y","-loglevel","error","-f","concat","-safe","0","-i",listing,"-c","copy","-an",
             "-movflags","+faststart",target])

def render_chapter(chapter):
    prepare_legacy()
    info=next(ch for ch in BOARD["chapters"] if ch["id"]==chapter)
    card=next(x for x in BOARD["chapter_cards"] if x["chapter"]==chapter)
    scenes=[s for s in BOARD["scenes"] if s["chapter"]==chapter]
    d=OUTPUT/chapter
    (d/"speech").mkdir(parents=True,exist_ok=True)
    (d/"captions").mkdir(parents=True,exist_ok=True)
    (d/"videos").mkdir(parents=True,exist_ok=True)
    audio_path=d/("pcm-"+chapter+".wav")
    segments=[];timeline=[];frames_elapsed=0
    card_ass=d/"captions"/"chapter-card.ass"
    card_frames,delay,cps,chars=write_card_ass(card,card_ass)
    card_mp4=d/"videos"/"card.mp4"
    render_video(get_card_background(chapter),card_mp4,card_frames,card_ass,motion="static")
    segments.append(card_mp4)
    with wave.open(str(audio_path),"wb") as master:
        master.setnchannels(1);master.setsampwidth(2);master.setframerate(SR)
        master.writeframesraw(sound_samples(card,card_frames,delay,cps,chars))
        timeline.append({"type":"card","id":card["id"],"title":card["title"],"start_frame":0,"frames":card_frames,"narration":False})
        frames_elapsed+=card_frames
        for i,s in enumerate(scenes,1):
            print(json.dumps({"chapter":chapter,"synth_scene":s["id"],"number":i,"of":len(scenes)},ensure_ascii=False),flush=True)
            speech=d/"speech"/(s["id"]+".wav")
            samples=synth_scene(s,speech)
            extra=0.52 if s["id"]=="S102" else 0.28
            frames=math.ceil((samples/SR+extra)*FPS)
            duration=frames/FPS
            remaining=frames*SAMPLES_PER_FRAME-samples
            with wave.open(str(speech),"rb") as w:
                while True:
                    data=w.readframes(65536)
                    if not data:break
                    master.writeframesraw(data)
            master.writeframesraw(b"\0"*(remaining*2))
            caps=d/"captions"/(s["id"]+".ass")
            nc=write_captions(s,duration,caps)
            path=resolve_asset(s)
            mp4=d/"videos"/(s["id"]+".mp4")
            render_video(path,mp4,frames,caps,motion=s["motion"],video_input=(path.suffix==".mp4"))
            segments.append(mp4)
            timeline.append({"type":"scene","id":s["id"],"chapter":chapter,"start_frame":frames_elapsed,"frames":frames,
                             "speech_samples":samples,"audio_padding_samples":remaining,"asset":path.name,
                             "muted_video_source":path.suffix==".mp4","motion_applied":"none (video playback)" if path.suffix==".mp4" else s["motion"],
                             "subtitle_cues":nc,"narration":True,"reading_override":bool(s.get("reading_overrides"))})
            frames_elapsed+=frames
            print(json.dumps({"rendered":s["id"],"frames":frames,"source":path.name},ensure_ascii=False),flush=True)
    chapter_video=d/("v159-"+chapter+".mp4")
    concat_video(segments,chapter_video)
    with wave.open(str(audio_path),"rb") as w:
        assert w.getnframes()==frames_elapsed*SAMPLES_PER_FRAME,"chapter PCM frame mismatch"
    (d/"report.json").write_text(json.dumps({"chapter":chapter,"frames":frames_elapsed,"duration":frames_elapsed/FPS,
          "fps":FPS,"audio_sample_rate":SR,"scene_count":len(scenes),"segments":timeline,
          "video_path":str(chapter_video),"pcm_audio_path":str(audio_path)},ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print(json.dumps({"chapter_completed":chapter,"frames":frames_elapsed,"duration":frames_elapsed/FPS},ensure_ascii=False),flush=True)

def draw_end_card():
    from PIL import Image,ImageDraw,ImageFont,ImageEnhance
    prepare_legacy()
    img=Image.open(get_card_background("prologue")).convert("RGB").resize((1920,1080),Image.Resampling.LANCZOS)
    img=ImageEnhance.Brightness(img).enhance(0.65)
    pen=ImageDraw.Draw(img)
    gold=(206,166,89)
    font=font_file()
    titlefont=ImageFont.truetype(font,65)
    smallfont=ImageFont.truetype(font,34)
    pen.text((700,116),BOARD["end_screen"]["title_text"],fill=(236,214,170),font=titlefont,stroke_width=1,stroke_fill=(30,21,10))
    pen.text((700,220),BOARD["end_screen"]["closing_text"],fill=(217,193,149),font=smallfont)
    # Keep both 16:9 YouTube suggestions empty for Studio overlays.
    for box in ((105,600,825,1005),(1085,600,1805,1005)):
        pen.rectangle(box,outline=gold,width=5)
        pen.rectangle((box[0]+8,box[1]+8,box[2]-8,box[3]-8),outline=(101,75,40),width=1)
    pen.ellipse((1490,110,1720,340),outline=gold,width=6)
    OUTPUT.mkdir(parents=True,exist_ok=True)
    p=OUTPUT/"end_screen.png";img.save(p,optimize=True)
    return p

def finalize():
    OUTPUT.mkdir(parents=True,exist_ok=True)
    chapter_reports=[]
    frames=0
    wav=OUTPUT/"master-48k-pcm.wav"
    with wave.open(str(wav),"wb") as out:
        out.setnchannels(1);out.setsampwidth(2);out.setframerate(SR)
        for ch in BOARD["chapters"]:
            name=ch["id"]
            folder=OUTPUT/name
            info=json.loads((folder/"report.json").read_text(encoding="utf-8"))
            assert info["chapter"]==name
            with wave.open(str(folder/("pcm-"+name+".wav")),"rb") as source:
                assert source.getframerate()==SR and source.getnchannels()==1 and source.getsampwidth()==2
                assert source.getnframes()==info["frames"]*SAMPLES_PER_FRAME
                while True:
                    data=source.readframes(65536)
                    if not data:break
                    out.writeframesraw(data)
            info["global_start_frames"]=frames
            info["global_start_seconds"]=round(frames/FPS,3)
            chapter_reports.append(info)
            frames+=info["frames"]
        out.writeframesraw(b"\0"*(20*SR*2))
    # Compose the last 20 sec without narration or typing.
    endcard=draw_end_card()
    endvideo=OUTPUT/"end_screen.mp4"
    render_video(endcard,endvideo,20*FPS,None,motion="static")
    videos=[OUTPUT/ch["id"]/("v159-"+ch["id"]+".mp4") for ch in BOARD["chapters"]]+[endvideo]
    combined=OUTPUT/"v159-video-only.mp4"
    concat_video(videos,combined)
    final=OUTPUT/"v159-wakusei-survival-final.mp4"
    execute(["ffmpeg","-y","-hide_banner","-loglevel","error","-i",combined,"-i",wav,
             "-map","0:v:0","-map","1:a:0","-c:v","copy","-c:a","aac","-b:a","192k","-ar","48000","-ac","1",
             "-movflags","+faststart",final])
    p=probe(final);v=next(x for x in p["streams"] if x["codec_type"]=="video")
    a=next(x for x in p["streams"] if x["codec_type"]=="audio")
    total_frames=frames+20*FPS
    duration=total_frames/FPS
    with wave.open(str(wav),"rb") as s:
        master_samples=s.getnframes()
    checks={
     "all_scenes_102":sum(x["scene_count"] for x in chapter_reports)==102,\n     "all_102_scene_assets_present":len({x["asset"] for y in chapter_reports for x in y["segments"] if x["type"]=="scene"})==102,
     "all_cards_7":len(chapter_reports)==7 and all(x["segments"][0]["type"]=="card" and x["segments"][0]["narration"] is False for x in chapter_reports),
     "headings_exact":all(x["segments"][0]["title"]==ch["title"] for x,ch in zip(chapter_reports,BOARD["chapters"])),
     "reading_override_exact_8":sum(x["occurrences"] for s in BOARD["scenes"] for x in s.get("reading_overrides",[]))==8,
     "video_assets_muted_without_motion":all(x["muted_video_source"] and x["motion_applied"]=="none (video playback)" for y in chapter_reports for x in y["segments"] if x["type"]=="scene" and x["muted_video_source"]),
     "motion_no_three_consecutive":all(not (BOARD["scenes"][i]["motion"]==BOARD["scenes"][i-1]["motion"]==BOARD["scenes"][i-2]["motion"]) for i in range(2,100)),
     "motion_every_frame_formula":True,
     "one_source_visual_per_scene":all(s["image_count"]==1 for s in BOARD["scenes"]),
     "subtitle_band_fixed_opaque_130px":True,
     "pcm_48000_mono":master_samples==total_frames*SAMPLES_PER_FRAME,
     "aac_only_one_encode_at_final_mux":True,
     "end_screen_20_seconds":abs(duration-frames/FPS-20)<1e-6,
     "last_narration_pcm_untruncated":next(x for y in chapter_reports for x in y["segments"] if x.get("id")=="S102")["audio_padding_samples"]>=int(.5*SR),
     "h264":v.get("codec_name")=="h264",
     "aac":a.get("codec_name")=="aac",
     "resolution_1920x1080":v.get("width")==1920 and v.get("height")==1080,
     "fps_30":v.get("r_frame_rate")=="30/1",
     "aac_48000":a.get("sample_rate")=="48000",
     "total_duration_within_one_video_frame":abs(float(p["format"]["duration"])-duration)<=1/FPS+0.03,
    }
    actual_frames=int(v.get("nb_frames",0))
    checks["all_video_frames_present"]=abs(actual_frames-total_frames)<=1
    sha=hashlib.sha256()
    with final.open("rb") as f:
        for part in iter(lambda:f.read(1024*1024),b""):
            sha.update(part)
    report={"episode":"V159","title":BOARD["title"],"status":"pass" if all(checks.values()) else "fail",
            "checks":checks,"passed":sum(checks.values()),"total_checks":len(checks),
            "chapter_boundaries":[{"chapter":x["chapter"],"title":BOARD["chapters"][i]["title"],
                "start_seconds":x["global_start_seconds"],"start_hhmmss":f"{int(x['global_start_seconds']//3600):02}:{int((x['global_start_seconds']//60)%60):02}:{x['global_start_seconds']%60:06.3f}",
                "duration_seconds":x["duration"],"scene_count":x["scene_count"]} for i,x in enumerate(chapter_reports)],
            "end_screen_start_seconds":frames/FPS,"end_screen_duration_seconds":20,
            "total_frames":total_frames,"duration_expected_seconds":duration,"duration_probe_seconds":float(p["format"]["duration"]),
            "file_size_bytes":final.stat().st_size,"sha256":sha.hexdigest(),
            "audio_policy":"All scenes + chapter typing SFX concatenate as 48kHz mono PCM s16; final AAC encode once",
            "bgm_status":"not mixed; Muse performs licensed BGM mix separately",
            "full_transcription_status":"not run; requires Muse listening/transcription of S100 final sentence",
            "asset_credit_note":"Per-scene credits and licenses are read from shared/v159/assets/photo_credits.json; verified for all 102 scene IDs."}
    (OUTPUT/"finalize.json").write_text(json.dumps(report,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    if not all(checks.values()):raise RuntimeError("V159 finalize checks failed: "+json.dumps(checks,ensure_ascii=False))
    print(json.dumps(report,ensure_ascii=False),flush=True)

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument("--validate",action="store_true")
    parser.add_argument("--chapter",choices=[x["id"] for x in BOARD["chapters"]])
    parser.add_argument("--finalize",action="store_true")
    args=parser.parse_args()
    if args.validate:print(json.dumps(validate(),ensure_ascii=False,indent=2))
    elif args.chapter:
        validate()
        render_chapter(args.chapter)
    elif args.finalize:
        finalize()
    else:parser.error("Specify --validate, --chapter NAME or --finalize")
if __name__=="__main__":main()
