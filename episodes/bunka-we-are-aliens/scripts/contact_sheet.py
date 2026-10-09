"""Contact sheet from actual Motion Canvas outputs; needs only ffmpeg and Pillow."""
import io, math, subprocess
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
root=Path(__file__).resolve().parents[1]; out=root/'output'
font_path='/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc'
try:f=ImageFont.truetype(font_path,20)
except Exception:f=ImageFont.load_default()
thumbs=[]
for idx in range(7):
 p=out/f'aliens-chapter-{idx}.mp4'
 if not p.is_file():continue
 probe=subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','default=noprint_wrappers=1:nokey=1',str(p)],capture_output=True,text=True,check=True)
 duration=float(probe.stdout)
 for group in range(6):
  sec=duration*(group+.45)/6
  cmd=['ffmpeg','-loglevel','error','-ss',str(sec),'-i',str(p),'-frames:v','1','-vf','scale=400:225','-f','image2pipe','-vcodec','png','pipe:1']
  res=subprocess.run(cmd,capture_output=True)
  if res.returncode:continue
  thumbs.append((f'Chapter {idx} · Scene {group+1}',Image.open(io.BytesIO(res.stdout)).convert('RGB')))
cols=4;rows=math.ceil(len(thumbs)/cols)
sheet=Image.new('RGB',(cols*420+20,rows*267+20),(19,25,34));d=ImageDraw.Draw(sheet)
for i,(label,im) in enumerate(thumbs):
 x=20+(i%cols)*420;y=20+(i//cols)*267
 sheet.paste(im,(x,y));d.text((x,y+231),label,font=f,fill=(235,230,220))
sheet.save(root/'qa/contact-sheet.jpg',quality=88)
print(f'{len(thumbs)} actual rendered frames -> {root}/qa/contact-sheet.jpg')
