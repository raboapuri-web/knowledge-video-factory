#!/usr/bin/env python3
"""V157 format-v2 production renderer. 48kHz PCM is the single timeline clock.
Scene H.264 clips are VIDEO ONLY; no intermediate AAC files are created.
"""
import json, math, os, re, sys, time, wave, hashlib, random, shutil, subprocess, struct, tempfile
from pathlib import Path
from PIL import Image, ImageOps, ImageFilter, ImageDraw, ImageFont
import requests

ROOT=Path(__file__).resolve().parents[1]
BOARD=json.loads((ROOT/"content/board.json").read_text(encoding="utf-8"))
WORK=ROOT/"work"
OUT=ROOT/"output"
ASSETS=ROOT/"assets/final"
FPS=30
RATE=48000
SPF=RATE//FPS
W,H=1920,1080
CHAPTER_IDS=[c["id"] for c in BOARD["chapters"]]
SPEAKER=13
VOICEVOX=os.environ.get("VOICEVOX_URL","http://127.0.0.1:50021")
SPEED=1.10
FONT="/usr/share/fonts/opentype/noto/NotoSerifCJK-Regular.ttc"
FONT_B="/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc"
MOON=ROOT/"render/moon_character_reference.jpg"

def ff(*args):
    cmd=["ffmpeg","-hide_banner","-nostdin","-loglevel","error","-y",*map(str,args)]
    subprocess.run(cmd,check=True)
def probe(path):
    z=subprocess.run(["ffprobe","-v","error","-show_entries","format=duration,size:stream=codec_name,width,height,r_frame_rate",
                      "-of","json",str(path)],capture_output=True,text=True,check=True)
    return json.loads(z.stdout)
def check(flag,msg):
    if not flag: raise RuntimeError(msg)
def newfont(size,bold=False):
    p=FONT_B if bold and Path(FONT_B).exists() else FONT
    if Path(p).exists(): return ImageFont.truetype(p,size)
    return ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",size)

def preflight():
    scenes=BOARD["scenes"]
    check(len(scenes)==162 and len(BOARD["chapters"])==8 and len(BOARD["chapter_cards"])==8,"board scene/card count")
    check([s["id"] for s in scenes]==[f"S{i:03d}" for i in range(1,163)],"scene ID/order")
    for s in scenes:
        check((ASSETS/(s["id"]+".jpg")).stat().st_size>1000,f"missing image {s['id']}")
        check(s["image_count"]==1 and s["motion"] in ("zoom_in","zoom_out","pan_left","pan_right","pan_up","pan_down","static"),
              f"invalid board motion {s['id']}")
        check(not s["script"].startswith(s["chapter_heading"]),f"spoken heading {s['id']}")
    check(sum(s["script"].count("少し") for s in scenes)==20,"20 少し readings expected")
    for i in range(2,len(scenes)):
        check(not(scenes[i]["motion"]==scenes[i-1]["motion"]==scenes[i-2]["motion"]),"three consecutive same motions")
    for c in BOARD["chapters"]:
        check(c["heading"]==next(x["title"] for x in BOARD["chapter_cards"] if x["chapter"]==c["id"]),
              "chapter card title must be exact script heading")
    check(MOON.exists(),"moon character reference is required")
    print("PREFLIGHT_OK 162 images 8 cards 20 pronunciation overrides")
    return True

def load_prepare(scene,out):
    im=Image.open(ASSETS/(scene["id"]+".jpg")).convert("RGB")
    iw,ih=im.size
    low=(iw<1280 or ih<720 or ih>iw)
    if low:
        bg=ImageOps.fit(im,(W,H),method=Image.Resampling.BICUBIC).filter(ImageFilter.GaussianBlur(42)).convert("RGB")
        bg=Image.blend(bg,Image.new("RGB",(W,H),(8,13,24)),0.30)
        k=min(1450/iw,870/ih)
        # Preserve low-resolution material's original ratio. Never stretch to full frame.
        fg=im.resize((max(1,int(iw*k)),max(1,int(ih*k))),Image.Resampling.LANCZOS)
        x=(W-fg.width)//2; y=(H-fg.height)//2-20
        sh=Image.new("RGBA",(fg.width+28,fg.height+28),(0,0,0,0))
        d=ImageDraw.Draw(sh);d.rounded_rectangle((4,4,sh.width-4,sh.height-4),radius=8,fill=(0,0,0,180))
        bg.paste(sh,(x-14,y-14),sh)
        bg.paste(fg,(x,y))
        im=bg
    else:
        im=ImageOps.fit(im,(W,H),method=Image.Resampling.LANCZOS)
    out.parent.mkdir(parents=True,exist_ok=True)
    im.save(out,"JPEG",quality=94,subsampling=0)
    return {"source_size":[iw,ih],"blur_bg":low}

def assfmt(t):
    m=int(t//60);s=t%60
    return f"{m//60:d}:{m%60:02d}:{s:05.2f}"
def assheader():
    return f"""[Script Info]
ScriptType: v4.00+
PlayResX: 1920
PlayResY: 1080
WrapStyle: 2
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Main,Noto Sans CJK JP,44,&H00FFFFFF,&H00000000,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,1,0,2,32,32,20,1
Style: Card,Noto Serif CJK JP,69,&H00D6C08A,&H00D6C08A,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,1,0,4,120,120,0,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
def split_cues(text):
    # Characters are always copied from approved scene script; only whitespace
    # and visual line breaks are normalized for 2-line subtitle layout.
    text=re.sub(r"\s+","",text)
    chunks=[]
    while text:
        if len(text)<=48:
            chunks.append(text);break
        end=max(15,min(48,len(text)))
        cut=0
        for mark in ("。","！","？","、","，","；"):
            p=text.rfind(mark,17,end)
            if p>=24: cut=max(cut,p+1)
        if not cut: cut=end
        chunks.append(text[:cut]);text=text[cut:]
    return chunks
def make_scene_ass(scene,path,spoken):
    units=split_cues(scene["script"])
    weighted=sum(len(x) for x in units)
    elapsed=0
    ev=[]
    for i,u in enumerate(units):
        dur=spoken*len(u)/max(1,weighted)
        end=spoken if i==len(units)-1 else elapsed+dur
        # Hard-break at 24 characters; no text changed.
        lines=[u[p:p+24] for p in range(0,len(u),24)]
        check(len(lines)<=2,"subtitle cue has more than 2 lines")
        line=r"\N".join(lines).replace("{","").replace("}","")
        ev.append(f"Dialogue: 0,{assfmt(elapsed)},{assfmt(end)},Main,,0,0,0,,{line}")
        elapsed=end
    path.write_text(assheader()+"\n".join(ev)+"\n",encoding="utf-8")

def qvoice(text,dest):
    # Script/board/subtitles always retain original kanji. Only temporary TTS input changes.
    audio_text=text.replace("少し","すこし")
    for trial in range(4):
        try:
            query=requests.post(VOICEVOX+"/audio_query",
                  params={"text":audio_text,"speaker":SPEAKER},timeout=100)
            query.raise_for_status()
            payload=query.json()
            payload["speedScale"]=SPEED
            payload["outputSamplingRate"]=RATE
            payload["outputStereo"]=False
            r=requests.post(VOICEVOX+"/synthesis",
                  params={"speaker":SPEAKER},json=payload,timeout=250)
            r.raise_for_status()
            dest.write_bytes(r.content)
            check(dest.stat().st_size>200,"empty voice wav")
            return
        except Exception:
            if trial==3:raise
            time.sleep(5*(trial+1))

def wave_bytes(path):
    with wave.open(str(path),"rb") as wav:
        check(wav.getnchannels()==1 and wav.getsampwidth()==2 and wav.getframerate()==RATE,
              f"not mono 48kHz s16 PCM: {path}")
        return wav.readframes(wav.getnframes())

def write_wave(path,pcm):
    with wave.open(str(path),"wb") as f:
        f.setnchannels(1);f.setsampwidth(2);f.setframerate(RATE);f.writeframes(pcm)

def card_background(dest,end=False):
    base=Image.new("RGB",(W,H),(6,9,17));d=ImageDraw.Draw(base)
    for y in range(0,H,3):
        t=y/H;d.line((0,y,W,y),fill=(int(7+7*t),int(9+7*t),int(18+8*t)))
    # Exact book-reading crescent mascot from the supplied reference crop.
    avatar=Image.open(MOON).convert("RGB")
    avatar=ImageOps.fit(avatar,(565,565),method=Image.Resampling.LANCZOS)
    # Circular crop masks screenshot edges; no source text appears.
    avatar=avatar.resize((565,565))
    mask=Image.new("L",(565,565),0);ImageDraw.Draw(mask).ellipse((2,2,562,562),fill=255)
    place=(1180,170)
    base.paste(avatar,place,mask)
    d.ellipse((place[0]-3,place[1]-3,place[0]+568,place[1]+568),outline=(188,145,67),width=4)
    d.line((92,94,1818,94),fill=(141,112,57),width=2)
    d.line((92,906,1818,906),fill=(141,112,57),width=2)
    if end:
        d.text((115,135),"考える夜",font=newfont(84),fill=(224,199,137))
        d.text((115,300),"今夜も、当たり前がひとつ減りました。",font=newfont(47),fill=(226,216,180))
        for x in (85,1000):
            d.rounded_rectangle((x,590,x+800,1039),radius=9,outline=(181,145,80),width=3)
        d.ellipse((1530,94,1770,334),outline=(196,167,104),width=7)
    else:
        d.text((114,250),"考える夜",font=newfont(58),fill=(193,151,79))
        d.line((114,350,1010,350),fill=(173,126,56),width=3)
        d.text((114,758),"THINK AGAIN TONIGHT",font=newfont(27),fill=(117,104,83))
    dest.parent.mkdir(parents=True,exist_ok=True);base.save(dest)

def card_ass(title,path):
    # Type one Japanese character at a time, then hold.
    events=[]
    typed=min(3.2,max(0.7,len(title)/9.0))
    for i in range(len(title)):
        a=(i/len(title))*typed
        b=((i+1)/len(title))*typed
        events.append(f"Dialogue: 0,{assfmt(a)},{assfmt(b)},Card,,0,0,0,,{title[:i+1]}▌")
    events.append(f"Dialogue: 0,{assfmt(typed)},{assfmt(4)},Card,,0,0,0,,{title}")
    path.write_text(assheader()+"\n".join(events)+"\n",encoding="utf-8")
    # Every printed character produces one short synthetic key impulse;
    # use original V153 key file if present.
    sound=ROOT.parent/"v153/format_v2/audio/type_key.wav"
    audio=bytearray(4*RATE*2)
    if sound.exists():
        try: src=wave_bytes(sound)
        except Exception: src=b""
    else:src=b""
    for i in range(len(title)):
        pos=int((i/len(title))*typed*RATE)
        if src:
            part=src[:int(.06*RATE)*2]
            # Apply without clipping by keeping the source event short.
            for j in range(0,len(part)-1,2):
                k=pos*2+j
                if k+1<len(audio):
                    old=struct.unpack_from("<h",audio,k)[0]
                    sample=struct.unpack_from("<h",part,j)[0]
                    struct.pack_into("<h",audio,k,max(-32768,min(32767,old+sample)))
        else:
            rng=random.Random(i+43)
            for j in range(int(.042*RATE)):
                k=(pos+j)*2
                if k+1>=len(audio):break
                envelope=math.exp(-j/(RATE*.009))
                val=int((rng.random()-.5)*2000*envelope)
                struct.pack_into("<h",audio,k,val)
    return bytes(audio)

def motion_filter(motion,frames,ass,diagram=False):
    t=f"(on/{max(1,frames-1)})"
    if motion=="zoom_in":z=f"1+0.20*{t}"
    elif motion=="zoom_out":z=f"1.20-0.20*{t}"
    elif motion=="static" and diagram:z=f"1+0.04*{t}"
    elif motion=="static":z="1"
    else:z="1.20"
    if motion=="pan_left":x=f"(iw-iw/zoom)*(1-{t})"
    elif motion=="pan_right":x=f"(iw-iw/zoom)*{t}"
    else:x="(iw-iw/zoom)/2"
    if motion=="pan_up":y=f"(ih-ih/zoom)*(1-{t})"
    elif motion=="pan_down":y=f"(ih-ih/zoom)*{t}"
    else:y="(ih-ih/zoom)/2"
    ass_path=str(ass).replace("\\","/").replace(":","\\:")
    return (f"zoompan=z='{z}':x='{x}':y='{y}':d=1:s=1920x1080:fps=30,"
            f"drawbox=x=0:y=950:w=1920:h=130:color=black:t=fill,"
            f"ass='{ass_path}'")

def encode_clip(image,ass,frames,motion,dest,diagram=False,card=False):
    dest.parent.mkdir(parents=True,exist_ok=True)
    if card:
        flt=f"scale=1920:1080,ass='{str(ass)}'"
    else:
        flt=motion_filter(motion,frames,ass,diagram)
    ff("-loop","1","-framerate","30","-i",image,"-vf",flt,
       "-frames:v",frames,"-an","-c:v","libx264","-preset","veryfast",
       "-crf","20","-pix_fmt","yuv420p","-r","30","-g","60",dest)
    check(dest.stat().st_size>1000,"failed video scene "+str(dest))

def chapter_render(chapter):
    preflight()
    c=next(c for c in BOARD["chapters"] if c["id"]==chapter)
    home=OUT/chapter;home.mkdir(parents=True,exist_ok=True)
    temp=WORK/chapter;temp.mkdir(parents=True,exist_ok=True)
    clips=[];meta=[];pcm=bytearray();frame_cursor=0
    title=c["heading"]
    background=temp/"chapter-card.jpg"
    card_background(background)
    txt=temp/"chapter-card.ass";card_ass(title,txt)
    clip=temp/"000-card.mp4"
    encode_clip(background,txt,120,"static",clip,card=True)
    clips.append(clip);pcm.extend(card_ass(title,txt))
    frame_cursor+=120
    meta.append({"type":"card","title":title,"start_frame":0,"frames":120})
    for index,scene in enumerate(s for s in BOARD["scenes"] if s["chapter"]==chapter):
        key=scene["id"]
        raw=temp/f"{key}-voice.wav";raw48=temp/f"{key}-48k.wav"
        qvoice(scene["script"],raw)
        ff("-i",raw,"-ar",RATE,"-ac","1","-c:a","pcm_s16le",raw48)
        chunk=wave_bytes(raw48)
        original_samples=len(chunk)//2
        # Exact frame/sample alignment; 0.2 s natural pause after each scene.
        frames=math.ceil((original_samples+int(.20*RATE))/SPF)
        total_samples=frames*SPF
        check(frames>0 and total_samples>=original_samples,"invalid voice samples")
        chunk=chunk+b"\0"*(2*(total_samples-original_samples))
        pcm.extend(chunk)
        visual=temp/f"{key}-image.jpg"; imageQA=load_prepare(scene,visual)
        sub=temp/f"{key}.ass"
        make_scene_ass(scene,sub,original_samples/RATE)
        video=temp/f"{key}.mp4"
        encode_clip(visual,sub,frames,scene["motion"],video,diagram=(scene["image_type"]=="図解"))
        clips.append(video)
        meta.append({"type":"scene","id":key,"start_frame":frame_cursor,"frames":frames,
                     "voice_samples":original_samples,"total_samples":total_samples,
                     "reading_override_count":scene["script"].count("少し"),"image":imageQA})
        frame_cursor+=frames
        print("SCENE_OK",key,"frames",frames,"samples",original_samples,flush=True)
    check(len(pcm)//2==frame_cursor*SPF,"PCM master vs video frame count")
    write_wave(home/"chapter.wav",bytes(pcm))
    listing=temp/"video-concat.txt"
    listing.write_text("\n".join("file '"+str(p.resolve()).replace("'","'\\''")+"'" for p in clips)+"\n")
    ff("-f","concat","-safe","0","-i",listing,"-an","-c","copy",home/"chapter.mp4")
    qa={"chapter":chapter,"heading":title,"frames":frame_cursor,"samples":len(pcm)//2,"rate":RATE,"scenes":meta}
    (home/"timing.json").write_text(json.dumps(qa,ensure_ascii=False,indent=2))
    print("CHAPTER_OK",chapter,"frames",frame_cursor,"duration",frame_cursor/FPS)

def finalize():
    path=OUT/"final";path.mkdir(parents=True,exist_ok=True)
    video_list=[];allpcm=bytearray();timings=[];global_frames=0
    for c in BOARD["chapters"]:
        source=OUT/c["id"]
        info=json.loads((source/"timing.json").read_text())
        chunk=wave_bytes(source/"chapter.wav")
        check(len(chunk)//2==info["frames"]*SPF,c["id"]+" frame/audio drift")
        timings.append({"chapter":c["heading"],"start_seconds":global_frames/FPS,
                       "start_timecode":f"{global_frames//(FPS*3600):02d}:{(global_frames//(FPS*60))%60:02d}:{(global_frames//FPS)%60:02d}.{int((global_frames%FPS)*1000/FPS):03d}"})
        global_frames+=info["frames"]
        allpcm.extend(chunk)
        video_list.append(source/"chapter.mp4")
    end=path/"endcard.jpg"
    card_background(end,end=True)
    ev=path/"endcard.ass";ev.write_text(assheader(),encoding="utf-8")
    end_mp4=path/"endcard.mp4"
    encode_clip(end,ev,600,"static",end_mp4,card=True)
    video_list.append(end_mp4)
    allpcm.extend(b"\0"*(20*RATE*2))
    total_frames=global_frames+600
    check(len(allpcm)//2==total_frames*SPF,"total audio length differs from video frame clock")
    master=path/"narration_pcm_48k.wav";write_wave(master,bytes(allpcm))
    listing=path/"all-videos.txt"
    listing.write_text("\n".join("file '"+str(p.resolve()).replace("'","'\\''")+"'" for p in video_list)+"\n")
    silent=path/"silent-video.mp4"
    ff("-f","concat","-safe","0","-i",listing,"-an","-c","copy","-movflags","+faststart",silent)
    final=path/"V157_brine_pool_master_1080p30.mp4"
    # The ONLY AAC encode in the whole pipeline.
    ff("-i",silent,"-i",master,"-map","0:v:0","-map","1:a:0",
       "-c:v","copy","-c:a","aac","-b:a","192k","-ar","48000",
       "-movflags","+faststart",final)
    info=probe(final)
    duration=float(info["format"]["duration"])
    check(abs(duration-total_frames/FPS)<0.15,"mux duration mismatch")
    check(any(x["codec_name"]=="aac" for x in info["streams"]),"AAC missing")
    check(any(x["codec_name"]=="h264" and x.get("width")==W and x.get("height")==H
              for x in info["streams"]),"1080p H264 missing")
    # Decode the complete AAC stream, including the final scene and silent end card.
    ff("-i",final,"-map","0:a:0","-f","null","-")
    # Decode final 40s of H.264 stream, including full end-card.
    ff("-sseof","-40","-i",final,"-map","0:v:0","-f","null","-")
    s=hashlib.sha256()
    with final.open("rb") as f:
        for b in iter(lambda:f.read(2*1024*1024),b""):s.update(b)
    qa={"filename":final.name,"bytes":final.stat().st_size,"sha256":s.hexdigest(),
        "duration_seconds":duration,"main_seconds":global_frames/FPS,
        "endcard_seconds":20,"total_frames":total_frames,"master_pcm_samples":len(allpcm)//2,
        "reading_override_count":20,"chapter_starts":timings,
        "audio_decoded_through_end":True,"video_decoded_through_end":True,
        "last_scene_text":BOARD["scenes"][-1]["script"],
        "voice_transcription_test":"Requires independent transcription QA; do not claim verified"}
    (path/"qa.json").write_text(json.dumps(qa,ensure_ascii=False,indent=2))
    print("FINAL_OK",json.dumps(qa,ensure_ascii=False))

if __name__=="__main__":
    if len(sys.argv)<2: raise SystemExit("Usage: render.py preflight|chapter <id>|finalize")
    if sys.argv[1]=="preflight":preflight()
    elif sys.argv[1]=="chapter":
        if len(sys.argv)!=3 or sys.argv[2] not in CHAPTER_IDS:raise SystemExit("invalid chapter")
        chapter_render(sys.argv[2])
    elif sys.argv[1]=="finalize":finalize()
    else:raise SystemExit("unknown command")
