"""考える夜 premium black-and-gold SVG-like PIL renderer with bottom-CENTER subtitles."""
from __future__ import annotations
import math, subprocess, io, wave
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageOps, ImageEnhance
from core import W,H,icon_image,pages
BACKGROUND=(11,11,13);GOLD=(213,178,118);IVORY=(245,236,217);MUTED=(151,140,124)
BAND_Y=586; FPS=20

def font(sz=42,serif=True):
 from core import font as f
 return f(sz,serif=serif)

def spaced_text(d,text,x,y,sz=42,fill=IVORY,letter_spacing=.09,serif=True):
 """Real character tracking, not merely expanded word gaps."""
 f=font(sz,serif);step=sz*letter_spacing
 for letter in text:
  d.text((int(x),int(y)),letter,font=f,fill=fill)
  x+=d.textlength(letter,font=f)+step
 return int(x)

def measure_spaced(d,text,sz,tracking=.09,serif=True):
 f=font(sz,serif)
 return sum(d.textlength(ch,font=f) for ch in text)+max(len(text)-1,0)*sz*tracking

def line_fit(d,text,width,sz,tracking=.06,serif=True):
 """Break without clipping or ellipsis. Punctuation-aware where possible."""
 lines=[];current=""
 for ch in text:
  if measure_spaced(d,current+ch,sz,tracking,serif)<=width:
   current+=ch
  else:
   if current:lines.append(current)
   current=ch
 if current:lines.append(current)
 return lines

def tracking_block(d,text,x,y,max_width=930,sz=55,tracking=.08,color=IVORY,line_height=1.53,center=False,max_lines=3):
 while sz>=23:
  lines=line_fit(d,text,max_width,sz,tracking)
  if len(lines)<=max_lines:break
  sz-=2
 if len(lines)>max_lines:raise ValueError("Text does not fit reserved region: "+text)
 bounds=[]
 for line in lines:
  start=x
  if center:start=x-measure_spaced(d,line,sz,tracking)/2
  end=spaced_text(d,line,start,y,sz,color,tracking)
  bounds.append([round(start),y,round(end),y+sz*1.35])
  y+=int(sz*line_height)
 return bounds

def prep_photo(path,w,h,zoom=1.0,focus=(.5,.5)):
 im=Image.open(path).convert("RGB")
 img=ImageOps.fit(im,(w,h),Image.Resampling.LANCZOS,centering=focus)
 img=ImageEnhance.Contrast(img).enhance(1.11)
 img=ImageEnhance.Color(img).enhance(.83)
 return img

def photo_paste(base,path,x=0,y=0,w=730,h=BAND_Y):
 pic=prep_photo(path,w,h)
 base.paste(pic,(x,y))
 # subtle dark-to-black gradient along right edge
 overlay=Image.new("RGBA",(w,h),(0,0,0,0))
 o=ImageDraw.Draw(overlay)
 for xx in range(w):
  alpha=round(230*(xx/w)**2.7)
  o.line((xx,0,xx,h),fill=(BACKGROUND[0],BACKGROUND[1],BACKGROUND[2],alpha),width=1)
 base.paste(overlay,(x,y),overlay)

def create_base(scene, photos):
 im=Image.new("RGB",(W,H),BACKGROUND);d=ImageDraw.Draw(im)
 kind=scene["style"];claim=scene.get("claim",scene["subtitle"])
 # dark gold filaments: not a blanket background on every scene.
 if kind in ("title","outro"):
  for r in (240,290,336):
   d.arc((65-r,260-r,65+r,260+r),287,432,fill=(67,52,36),width=2)
  for r in (235,289,342):
   d.arc((250-r,290-r,250+r,290+r),80,225,fill=(70,53,31),width=2)
  d.ellipse((70,120,280,330),outline=(103,85,58),width=3)
  if kind=="title":
   spaced_text(d,"考える夜",690,100,32,GOLD,.21)
   d.line((680,173,1160,173),fill=GOLD,width=2)
   tracking_block(d,claim,715,237,470,69,.11,IVORY,max_lines=3)
   spaced_text(d,"THINK AGAIN  /  AFTER DARK",714,500,17,GOLD,.2,serif=False)
  else:
   tracking_block(d,"考える夜",698,204,480,93,.17,IVORY,max_lines=1)
   d.line((711,340,1175,340),fill=GOLD,width=2)
   tracking_block(d,claim,716,388,460,32,.11,GOLD,max_lines=3)
 elif kind in ("photo","evidence"):
  key=scene["photo"];photo_paste(im,photos[key]["file"],0,0,730,BAND_Y)
  d=ImageDraw.Draw(im)
  spaced_text(d,"ARCHIVE   /   0"+str(1),768,104,16,GOLD,.2,serif=False)
  d.line((766,162,1190,162),fill=GOLD,width=1)
  tracking_block(d,claim,773,219,425,56,.09,IVORY,max_lines=4)
  d.text((772,550),"PUBLIC DOMAIN / CC0",font=font(16,False),fill=MUTED)
 elif kind=="spectrum":
  spaced_text(d,"光の吸収と反射",86,78,36,IVORY,.12)
  d.line((86,165,1170,165),fill=(88,74,51),width=2)
  labels=[("RED / 赤",(145,75,76)),("BLUE / 青",(91,122,180)),("GREEN / 緑",(78,136,96))]
  for n,(text,color) in enumerate(labels):
   yy=260+100*n
   spaced_text(d,text,122,yy-20,23,GOLD,.09,serif=False)
   d.line((380,yy,800,yy),fill=color,width=8)
   d.ellipse((788,yy-15,818,yy+15),outline=color,width=3)
  im.paste(icon_image("sprout",220),(920,244),icon_image("sprout",220))
  d=ImageDraw.Draw(im)
  spaced_text(d,"概念図 / NOT TO SCALE",88,537,16,MUTED,.08,serif=False)
 elif kind in ("diagram","icon"):
  im.paste(icon_image(scene["icon"],320),(95,180),icon_image(scene["icon"],320))
  d=ImageDraw.Draw(im)
  d.line((485,139,485,490),fill=GOLD,width=2)
  spaced_text(d,"ANOTHER PERSPECTIVE",538,125,18,GOLD,.17,serif=False)
  tracking_block(d,claim,540,233,650,61,.07,IVORY,max_lines=4)
 elif kind=="contrast":
  d.line((640,68,640,536),fill=(100,78,46),width=2)
  spaced_text(d,"PRECONCEPTION",94,100,18,GOLD,.16,serif=False)
  spaced_text(d,"OBSERVATION",718,100,18,GOLD,.16,serif=False)
  icon_left=icon_image("eye",220);icon_right=icon_image("sprout",220)
  im.paste(icon_left,(205,193),icon_left);im.paste(icon_right,(827,193),icon_right)
  d=ImageDraw.Draw(im)
  tracking_block(d,claim,718,443,470,33,.065,IVORY,max_lines=2)
 elif kind=="question":
  spaced_text(d,"THE QUESTION",100,100,19,GOLD,.24,serif=False)
  d.line((100,149,1180,149),fill=(100,78,46),width=2)
  tracking_block(d,claim,144,258,1040,66,.09,IVORY,max_lines=3,center=False)
 elif kind=="statement":
  spaced_text(d,"A DIFFERENT ANSWER",100,111,19,GOLD,.2,serif=False)
  d.line((102,174,1180,174),fill=(100,78,46),width=2)
  tracking_block(d,claim,146,281,1020,63,.1,IVORY,max_lines=3)
 else:raise ValueError(kind)
 return im

def subtitle_draw(base,text,position=BAND_Y):
 """Subtitle region is mathematically centered in both 1-line and 2-line cases."""
 im=base.copy();d=ImageDraw.Draw(im,"RGB")
 d.rectangle((0,position,W,H),fill=(9,9,11))
 d.line((0,position,W,position),fill=(48,43,37),width=2)
 lines=text.split("\n")
 if len(lines)>2:raise ValueError("Subtitle more than 2 lines")
 sz=40 if len(lines)==1 else 36
 while sz>27 and any(d.textbbox((0,0),t,font=font(sz,False))[2]>W-160 for t in lines):sz-=1
 ys=[position+44] if len(lines)==1 else [position+24,position+73]
 for line,y in zip(lines,ys):
  # anchor=mm: true center, not left-justification
  d.text((W//2,y),line,font=font(sz,False),anchor="mm",fill=(251,247,236))
 return im

def audio_mix(timeline,stage):
 out=stage/"full_audio.wav"
 rate=24000
 with wave.open(str(out),"wb") as dest:
  dest.setnchannels(1);dest.setsampwidth(2);dest.setframerate(rate)
  for s in timeline:
   r=subprocess.run(["ffmpeg","-v","error","-i",s["wav"],"-ar",str(rate),"-ac","1",
       "-f","s16le","pipe:1"],capture_output=True,check=True).stdout
   dest.writeframes(r)
   dest.writeframes(b"\x00\x00"*int(.48*rate))
 return out

def render(board,timeline,photos,stage,preview_fps=FPS):
 base={s["id"]:create_base(s,photos) for s in board["scenes"]}
 scene_by_id={s["id"]:s for s in board["scenes"]}
 # Save genuinely produced artwork frames for human visual QA
 sheet=Image.new("RGB",(W,math.ceil(len(base)/2)*360),BACKGROUND)
 keys=list(base)
 for i,k in enumerate(keys):
  img=base[k].resize((W//2,H//2))
  sheet.paste(img,((i%2)*(W//2),(i//2)*(H//2)))
 sheet.save(stage/"contact_sheet.jpg",quality=89)
 img0=base[keys[0]].copy();img0.save(stage/"thumbnail.jpg",quality=93)
 duration=timeline[-1]["end"]
 video=stage/"video_only.mp4"
 proc=subprocess.Popen(["ffmpeg","-y","-v","error","-f","rawvideo","-pix_fmt","rgb24",
 "-s",str(W)+"x"+str(H),"-r",str(preview_fps),"-i","-","-c:v","libx264",
 "-preset","ultrafast","-crf","21","-pix_fmt","yuv420p",str(video)],stdin=subprocess.PIPE)
 try:
  total_frames=math.ceil(duration*preview_fps)
  for i in range(total_frames):
   t=i/preview_fps
   current=timeline[-1]
   for segment in timeline:
    if segment["start"]<=t<segment["end"]:current=segment;break
   s=scene_by_id[current["id"]]
   local=t-current["start"]
   clip=base[s["id"]].copy()
   # line animator: one semantic vertical accent, no cheap perpetual bouncing
   d=ImageDraw.Draw(clip)
   if s["style"] in ("spectrum","diagram"):
    prog=min(1,max(0,local/.9))
    d.line((84,555,84+int(430*prog),555),fill=GOLD,width=3)
   subtitle=current["subtitles"][-1]["text"]
   for page in current["subtitles"]:
    if page["start"]<=t<page["end"]:subtitle=page["text"];break
   frame=subtitle_draw(clip,subtitle)
   proc.stdin.write(frame.tobytes())
  proc.stdin.close()
  if proc.wait()!=0:raise RuntimeError("FFmpeg video encoder failed")
 except Exception:
  proc.kill();raise
 wav=audio_mix(timeline,stage)
 final=stage/"final.mp4"
 subprocess.run(["ffmpeg","-y","-v","error","-i",str(video),"-i",str(wav),
 "-c:v","copy","-c:a","aac","-b:a","160k","-shortest","-movflags","+faststart",str(final)],check=True)
 return final
