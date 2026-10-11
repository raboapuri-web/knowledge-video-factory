#!/usr/bin/env python3
"""Contact sheet of proposed physical scene layouts, NOT actual render frames."""
from PIL import Image,ImageDraw,ImageFont
from pathlib import Path
import json,math
R=Path(__file__).resolve().parents[1]
shots=[(ch['slug'],s) for ch in json.loads((R/'content/storyboard.json').read_text())['chapters'] for s in ch['shots']]
font='/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc'
f=ImageFont.truetype(font,16);fb=ImageFont.truetype(font,24);fc=ImageFont.truetype(font,12)
W,H=392,240;cols=4;rows=math.ceil(len(shots)/cols)
out=Image.new('RGB',(cols*(W+12)+12,rows*(H+12)+12),(12,19,29));p=ImageDraw.Draw(out)
for n,(ch,shot) in enumerate(shots):
 x=12+(n%cols)*(W+12);y=12+(n//cols)*(H+12)
 w=shot['world'];base='#1d3540';p.rounded_rectangle((x,y,x+W,y+H),radius=8,fill=base)
 p.rectangle((x+4,y+4,x+W-4,y+160),fill='#263c4b')
 if any(a in w for a in ('school','classroom','chalkboard')):
  p.rounded_rectangle((x+55,y+25,x+W-25,y+113),radius=6,fill='#225144',outline='#937e62',width=3)
  p.text((x+96,y+36),'将来の夢',font=fb,fill='#e9e6d8')
  for c in range(4):
   xx=x+65+c*75;p.ellipse((xx,y+111,xx+25,y+136),fill='#d7bea0');p.rectangle((xx+3,y+135,xx+21,y+161),fill='#a3b2b7')
 elif any(a in w for a in ('factory','industrial')):
  for c in range(5):
   xx=x+40+c*73;p.ellipse((xx,y+38,xx+57,y+95),outline='#b2c0c2',width=8);p.ellipse((xx+21,y+59,xx+35,y+73),fill='#344d58')
  p.line((x+28,y+134,x+W-20,y+134),fill='#b1aa95',width=8)
 elif any(a in w for a in ('zoo','garden','park','street','town','afternoon','city')):
  p.ellipse((x+288,y+12,x+326,y+50),fill='#d2b27b')
  for c in range(3):
   xx=x+70+c*126;p.rectangle((xx,y+77,xx+12,y+159),fill='#8c7660');p.ellipse((xx-27,y+35,xx+48,y+117),fill='#47775d')
 elif any(a in w for a in ('church','sacred')):
  for c in range(4):p.rectangle((x+34+c*104,y+28,x+85+c*104,y+151),fill='#697989')
  p.text((x+142,y+64),'WORK',font=fb,fill='#e6c08b')
 elif any(a in w for a in ('cinema','drama','media')):
  p.rounded_rectangle((x+31,y+19,x+W-30,y+122),radius=8,fill='#7891a0');p.text((x+102,y+54),'職業ドラマ',font=fb,fill='#f2e5cc')
  for c in range(6):p.ellipse((x+40+c*53,y+127,x+65+c*53,y+153),fill='#8a8c8b')
 elif any(a in w for a in ('study','research','book','keynes','job')):
  for c in range(8):p.rectangle((x+35+c*41,y+29,x+54+c*41,y+118),fill=['#967c67','#6f9891','#c8ab81'][c%3])
  p.rectangle((x+32,y+118,x+W-24,y+135),fill='#927d6c')
 else:
  p.rectangle((x+16,y+25,x+176,y+109),fill='#6e8892');p.rectangle((x+22,y+31,x+170,y+104),fill='#1d4a5a')
  p.rectangle((x+210,y+88,x+W-19,y+147),fill='#786d62')
  p.ellipse((x+150,y+83,x+176,y+109),fill='#e0baa0');p.rectangle((x+148,y+109,x+180,y+160),fill='#75b8aa')
 p.rounded_rectangle((x+4,y+5,x+50,y+27),radius=6,fill='#0a1624');p.text((x+11,y+8),shot['id'],font=fc,fill='#e7ba83')
 p.text((x+13,y+170),shot['title'][:20],font=f,fill='#f5eddf')
 ev=' → '.join(shot['events'][:3]);p.text((x+13,y+204),ev[:45],font=fc,fill='#9db9ba')
 p.line((x+7,y+232,x+W-7,y+232),fill='#607985',width=2)
outpath=R/'qa/storyboard-contact-sheet.jpg';outpath.parent.mkdir(exist_ok=True);out.save(outpath,quality=90)
print(outpath, out.size)
