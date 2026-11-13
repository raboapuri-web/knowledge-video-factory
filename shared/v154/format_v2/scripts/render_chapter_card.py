#!/usr/bin/env python3
"""Render a 4-5 second V153 chapter card with per-character typing and key SFX."""
import argparse, json, math, os, shutil, subprocess, sys, tempfile, wave
from array import array
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

V154_ROOT = Path(__file__).resolve().parents[2]
FORMAT_ROOT = V154_ROOT / "format_v2"
SPEC_PATH = FORMAT_ROOT / "config" / "chapter_card_spec.json"

def font_path():
    font_dir = Path(os.getenv("V153_FONTS_DIR", str(Path.home()/".local/share/fonts")))
    candidates = [font_dir/"NotoSansCJKjp-Regular.otf",
                  Path("/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc"),
                  Path("/usr/share/fonts/truetype/noto/NotoSansCJK-Regular.ttc")]
    for p in candidates:
        if p.is_file(): return str(p)
    raise FileNotFoundError("Noto Sans CJK JP font not found. Run scripts/install_media_tools.sh first.")

def load_font(path, size):
    return ImageFont.truetype(path, size=size)

def fit_title_font(path, text, max_width, base_size, min_size):
    size = base_size
    while size > min_size:
        f = load_font(path, size)
        box = f.getbbox(text)
        if box[2]-box[0] <= max_width: return f
        size -= 1
    f = load_font(path, min_size)
    if f.getlength(text) > max_width:
        raise ValueError(f"Chapter title is too wide even at {min_size}px: {text}")
    return f

def draw_centered(draw, xy, text, font, fill, outline, shadow, outline_width=2):
    x,y = xy
    draw.text((x+3,y+4), text, font=font, fill=shadow, anchor="mm",
              stroke_width=outline_width+1, stroke_fill=shadow)
    draw.text((x,y), text, font=font, fill=fill, anchor="mm",
              stroke_width=outline_width, stroke_fill=outline)

def read_key_wav(path):
    with wave.open(str(path), "rb") as wf:
        channels=wf.getnchannels(); sr=wf.getframerate(); width=wf.getsampwidth()
        raw=wf.readframes(wf.getnframes())
    if width != 2: raise ValueError("type_key.wav must be 16-bit PCM")
    data=array('h'); data.frombytes(raw)
    if sys.byteorder != "little": data.byteswap()
    if channels > 1:
        mono=array('h')
        for i in range(0,len(data),channels): mono.append(int(sum(data[i:i+channels])/channels))
        data=mono
    return sr, data

def write_typing_audio(out_path, key_path, duration, key_times, gain):
    sr, key = read_key_wav(key_path)
    total=int(math.ceil(duration*sr))
    mix=[0]*total
    for t in key_times:
        start=int(round(t*sr))
        for j,v in enumerate(key):
            k=start+j
            if k>=total: break
            mix[k] += int(v*gain)
    fade=int(sr*0.04)
    for i in range(max(0,total-fade),total):
        mix[i]=int(mix[i]*(total-i)/max(1,fade))
    pcm=b"".join(int(max(-32768,min(32767,v))).to_bytes(2,"little",signed=True) for v in mix)
    with wave.open(str(out_path),"wb") as wf:
        wf.setnchannels(1); wf.setsampwidth(2); wf.setframerate(sr); wf.writeframes(pcm)
    return sr

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("chapter")
    ap.add_argument("--ffmpeg",default="ffmpeg")
    args=ap.parse_args()
    spec=json.loads(SPEC_PATH.read_text(encoding="utf-8"))
    card=next((x for x in spec["cards"] if x["chapter"]==args.chapter),None)
    if not card: raise SystemExit("chapter card not found: "+args.chapter)
    if args.chapter not in {x["chapter"] for x in spec["cards"]}: raise SystemExit("unknown chapter: "+args.chapter)
    allowed = {x["chapter"] for x in spec["cards"]}
    if args.chapter not in allowed: raise SystemExit("unknown chapter: "+args.chapter)
    bg=FORMAT_ROOT/card["background_file"]
    if not bg.is_file(): raise FileNotFoundError(f"Missing chapter background: {bg}")
    t=spec["typing"]; d=spec["duration_policy"]; tx=spec["text"]
    cps=float(t["characters_per_second"])
    label=card["label"]; title=card["title"]
    start_delay=float(d["start_delay_sec"]); inter=float(d["interline_delay_sec"])
    label_time=len(label)/cps
    title_start=start_delay+label_time+inter
    typing_end=title_start+len(title)/cps
    cursor_dur=float(t["cursor_blink_duration_sec"])
    hold=float(d["final_hold_sec"])
    duration=max(float(d["minimum_duration_sec"]),typing_end+cursor_dur+hold)
    fps=int(spec["resolution"]["fps"]); frames=int(math.ceil(duration*fps)); duration=frames/fps
    fpath=font_path(); label_font=load_font(fpath,int(tx["label_font_size_px"]))
    title_font=fit_title_font(fpath,title,int(tx["max_text_width_px"]),int(tx["title_font_size_px"]),int(tx["title_min_font_size_px"]))
    label_rgb=tuple(int(tx["label_color"][i:i+2],16) for i in (1,3,5))+(255,)
    title_rgb=tuple(int(tx["title_color"][i:i+2],16) for i in (1,3,5))+(255,)
    outline=tuple(int(tx["outline_color"][i:i+2],16) for i in (1,3,5))+(255,)
    shadow=(0,0,0,190)
    center_x=int(tx["center_x_px"]); label_y=int(tx["label_center_y_px"]); title_y=int(tx["title_center_y_px"])
    key_times=[start_delay+i/cps for i in range(len(label))]
    key_times += [title_start+i/cps for i in range(len(title))]
    output_dir=V154_ROOT/"output"; output_dir.mkdir(parents=True,exist_ok=True)
    out_mp4=output_dir/f"chapter-card-{args.chapter}.mp4"
    with tempfile.TemporaryDirectory(prefix=f"v153-card-{args.chapter}-") as td:
        td=Path(td); overlay_dir=td/"overlay"; overlay_dir.mkdir()
        for frame in range(frames):
            now=frame/fps
            label_n=0 if now<start_delay else min(len(label),int((now-start_delay)*cps)+1)
            title_n=0 if now<title_start else min(len(title),int((now-title_start)*cps)+1)
            cursor=False
            if title_n==len(title) and typing_end <= now < typing_end+cursor_dur:
                cursor=(int((now-typing_end)*t["cursor_blink_hz"]*2)%2)==0
            overlay=Image.new("RGBA",(1920,1080),(0,0,0,0)); draw=ImageDraw.Draw(overlay)
            if label_n:
                draw_centered(draw,(center_x,label_y),label[:label_n],label_font,label_rgb,outline,shadow,int(tx["outline_width_px"]))
            if title_n:
                visible=title[:title_n]+(t["cursor_glyph"] if cursor else "")
                draw_centered(draw,(center_x,title_y),visible,title_font,title_rgb,outline,shadow,int(tx["outline_width_px"]))
            overlay.save(overlay_dir/f"{frame:05d}.png",compress_level=1)
        audio=td/"typing.wav"
        write_typing_audio(audio,FORMAT_ROOT/t["sfx_file"],duration,key_times,float(t["sfx_gain"]))
        total_frames=frames
        vf=("[0:v]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,"
            f"zoompan=z='min(1+0.02*on/{total_frames},1.02)':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d=1:s=1920x1080:fps={fps}[bg];"
            "[bg][1:v]overlay=0:0:shortest=1,[v]")
        cmd=[args.ffmpeg,"-y","-loglevel","error","-loop","1","-framerate",str(fps),"-i",str(bg),
             "-framerate",str(fps),"-i",str(overlay_dir/"%05d.png"),"-i",str(audio),
             "-filter_complex",vf,"-map","[v]","-map","2:a","-t",f"{duration:.3f}",
             "-r",str(fps),"-fps_mode","cfr","-c:v","libx264","-preset","veryfast","-crf","19",
             "-pix_fmt","yuv420p","-c:a","aac","-b:a","160k","-ar","48000","-ac","1",
             "-shortest","-movflags","+faststart",str(out_mp4)]
        subprocess.run(cmd,check=True)
    if not out_mp4.is_file() or out_mp4.stat().st_size<20000: raise RuntimeError("chapter card render failed")
    report={"chapter":args.chapter,"file":str(out_mp4.relative_to(V154_ROOT)),"duration_sec":round(duration,3),"typing_cps":cps,"label":label,"title":title,"narration":False,"subtitle":False}
    (output_dir/f"chapter-card-{args.chapter}.json").write_text(json.dumps(report,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print(json.dumps(report,ensure_ascii=False))

if __name__=="__main__": main()
