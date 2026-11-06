"""Kangaeru Yoru v7 editorial SVG renderer. No network, TTS or API keys.
8013 graphic grammar: precise gold hairlines, bars, rings, numbered points,
deliberate whitespace and serif hierarchy. Subtitle is a separate centered lane.
"""
from __future__ import annotations
import argparse, html, json, math, re
from pathlib import Path

W,H,START_SUB=1280,720,586
BG="#0e0d0c"; GOLD="#c6a56e"; HAIR="#7c684b"; IVORY="#f2eadb"; MUTED="#b4a78e"
FAMILIES={"hero_question","split_choice","data_bars","causal_flow","single_symbol"}
MAX_HEAD=18;MAX_NOTE=12;MAX_SUB_LINE=20

def esc(v):return html.escape(str(v),quote=True)
def reject(src):
 if len(src)>MAX_HEAD: raise ValueError("Display headline over 18 characters: "+src)
 if "\n" in src or "\r" in src:raise ValueError("No multiline headline")
 return src
def subtitle_lines(text):
 # This is a preview only. Production uses sound-aligned cues from a separate timeline.
 if not text:return []
 if isinstance(text,list):lines=text
 else:
  t=re.sub(r"\s+","",str(text))
  lines=[t[i:i+MAX_SUB_LINE] for i in range(0,len(t),MAX_SUB_LINE)]
 if len(lines)>2 or any(len(x)>MAX_SUB_LINE for x in lines):raise ValueError("Subtitle cue exceeds 2x20 characters")
 return lines
def tag_text(x,y,txt,size=28,fill=IVORY,anchor="start",weight="normal",family="serif",spacing=1):
 tag="Noto Serif CJK JP" if family=="serif" else "Noto Sans CJK JP"
 return f'<text x="{x}" y="{y}" text-anchor="{anchor}" fill="{fill}" font-family="{tag}" font-size="{size}" font-weight="{weight}" letter-spacing="{spacing}">{esc(txt)}</text>'
def line(x1,y1,x2,y2,color=HAIR,width=1.5):
 return f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{color}" stroke-width="{width}"/>'
def circle(x,y,r,color=GOLD,width=2):
 return f'<circle cx="{x}" cy="{y}" r="{r}" fill="none" stroke="{color}" stroke-width="{width}"/>'
def top():
 return [f'<rect width="{W}" height="{H}" fill="{BG}"/>',
 tag_text(82,61,"考える夜",22,GOLD,spacing=7),
 line(82,83,1198,83,"#463a2d",1)]
def footer(scene):
 # Subtitle safe zone is immune to the main editorial art.
 y=START_SUB;out=[f'<rect x="0" y="{y}" width="{W}" height="{H-y}" fill="#090909"/>',line(0,y,W,y,"#3e342a",1.4)]
 lines=subtitle_lines(scene.get("subtitle_preview",""))
 pos=[655] if len(lines)==1 else [628,677]
 for s,yy in zip(lines,pos):out.append(tag_text(W/2,yy,s,35,IVORY,"middle",family="sans",spacing=.2))
 return out
def icon(scene,x,y):
 # Generated icons are rendered as trusted geometry only. Never embed raw SVG from a model.
 if not scene.get("icon_spec"):return []
 from icons import geometry
 return geometry(scene["icon_spec"],x,y,scale=1.0)
def diagram(scene):
 family=scene["composition"]
 d=scene["display_text"];h=reject(d["headline"])
 labels=d.get("labels",[])
 if len(labels)>3 or any(len(x)>MAX_NOTE for x in labels):raise ValueError("Too many/long labels")
 out=[]
 if family=="hero_question":
  out.extend([circle(980,316,154,HAIR,1),circle(980,316,115,GOLD,2),line(817,316,1143,316,HAIR,1),
  tag_text(102,173,"問い",22,GOLD,spacing=4),tag_text(102,350,h,59,IVORY,spacing=2)])
  out+=icon(scene,950,283)
 elif family=="split_choice":
  if len(labels)!=2:raise ValueError("Split requires two semantic labels")
  # No empty circles: a meaningful A/B typographic/route comparison is visible.
  out += [tag_text(94,152,h,45),line(640,191,640,529,HAIR,1.4),
          tag_text(120,248,"01  /  ACTION",22,GOLD,family="sans"),
          tag_text(710,248,"02  /  ALTERNATIVE",22,GOLD,family="sans"),
          tag_text(335,356,labels[0],47,IVORY,"middle"),
          tag_text(925,356,labels[1],47,IVORY,"middle"),
          line(140,406,522,406,GOLD,3),line(751,406,1135,406,GOLD,3)]
  if "飛" in labels[0] or "左" in labels[0] or "右" in labels[0]:
   # Diving keeper and flying ball; deliberate, not abstract decorative circle.
   out += ['<circle cx="330" cy="460" r="10" fill="none" stroke="'+GOLD+'" stroke-width="3"/>',
           line(344,452,393,430,GOLD,5),line(369,442,404,410,GOLD,4),
           line(369,442,400,474,GOLD,4),circle(431,417,9,IVORY,2)]
  else:
   out += [line(205,459,448,459,GOLD,4),
           '<path d="M431 446 L448 459 L431 472" fill="none" stroke="'+GOLD+'" stroke-width="4"/>']
  if "留" in labels[1] or "残" in labels[1] or "立" in labels[1]:
   out += [circle(924,444,10,GOLD,2),line(924,454,924,494,GOLD,4),
           line(924,462,903,480,GOLD,4),line(924,462,945,480,GOLD,4),
           line(924,494,907,517,GOLD,4),line(924,494,941,517,GOLD,4)]
  else:
   out += [line(832,459,1051,459,GOLD,4),line(1051,459,1051,490,GOLD,4)]
 elif family=="data_bars":
  if len(labels)<2:raise ValueError("Bars require >=2 labels")
  out.append(tag_text(100,150,h,45))
  values=scene.get("values",[])
  if len(values)!=len(labels) or not all(isinstance(v,(int,float)) and 0<=v<=100 for v in values):raise ValueError("Bars need grounded 0-100 values")
  for i,(label,v) in enumerate(zip(labels,values)):
   y=252+i*112
   out.extend([tag_text(295,y,label,24,IVORY,"end",family="sans",spacing=0),
               f'<rect x="342" y="{y-25}" width="602" height="24" fill="#27231d"/>',
               f'<rect x="342" y="{y-25}" width="{602*v/100:.2f}" height="24" fill="{GOLD}"/>',
               tag_text(998,y,str(v)+"%",32,GOLD,family="sans")])
 elif family=="causal_flow":
  if len(labels)!=3:raise ValueError("Causal flow needs 3 nodes")
  out.append(tag_text(105,153,h,44))
  # Large nodes contain ONLY step numerals; captions are far below circles and arrows.
  xs=(235,640,1045)
  for i,(x,lbl) in enumerate(zip(xs,labels)):
   out.extend([circle(x,303,64,GOLD,1.8),
               tag_text(x,321,f"{i+1:02d}",48,GOLD,"middle",family="sans",spacing=1),
               tag_text(x,449,lbl,28,IVORY,"middle",family="sans",spacing=.1)])
   if i<2:
    out += [line(x+81,303,x+313,303,GOLD,2),
            f'<path d="M{x+299} 294 L{x+313} 303 L{x+299} 312" fill="none" stroke="{GOLD}" stroke-width="2"/>']
 elif family=="single_symbol":
  out.append(tag_text(99,162,h,49))
  out.extend([circle(634,350,178,HAIR,1.5),circle(634,350,139,GOLD,2),line(634,172,634,528,HAIR,1)])
  if scene.get("primary_visual")=="photo":
   out.extend([
    '<rect x="408" y="212" width="454" height="262" rx="8" fill="#1d1a17" stroke="#685439" stroke-width="2"/>',
    tag_text(635,304,"写真の被写体指定",23,GOLD,"middle",family="sans"),
    tag_text(635,356,"実画像は未取得",27,IVORY,"middle",family="sans"),
    tag_text(635,403,scene.get("photo_subject","")[:24],18,MUTED,"middle",family="sans")])
  else:out+=icon(scene,635,338)
 else:raise ValueError("Unknown editorial composition")
 if scene.get("primary_visual")=="photo" and family!="single_symbol":
  # A photo query is NOT a photographed scene; never imply unverified retrieval.
  out.append(tag_text(1168,544,"写真候補・未取得",20,GOLD,"end",family="sans",spacing=0))
 return out
def validate(scene):
 assert scene.get("composition") in FAMILIES
 d=scene.get("display_text")
 if not isinstance(d,dict) or not isinstance(d.get("headline"),str):raise ValueError("Missing display text")
 reject(d["headline"])
 if not scene.get("narration_text"):raise ValueError("Missing untouched narration")
 subtitle_lines(scene.get("subtitle_preview",""))
 # On-screen text is not the full script or captions.
 if d["headline"]==scene["narration_text"] or d["headline"]==scene.get("subtitle_preview"):raise ValueError("Duplicated spoken text as headline")
 return True
def svg(scene):
 validate(scene)
 out=['<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">']
 out+=top();out+=diagram(scene);out+=footer(scene);out.append("</svg>")
 return "\n".join(out)
def main():
 p=argparse.ArgumentParser()
 p.add_argument("--fixture",required=True);p.add_argument("--out",required=True)
 a=p.parse_args();out=Path(a.out);out.mkdir(parents=True,exist_ok=True)
 scenes=json.loads(Path(a.fixture).read_text(encoding="utf-8"))["scenes"]
 for scene in scenes:
  raw=svg(scene)
  (out/(scene["id"]+".svg")).write_text(raw,encoding="utf-8")
  try:
   import cairosvg
   cairosvg.svg2png(bytestring=raw.encode(),write_to=str(out/(scene["id"]+".png")))
  except ImportError:pass
 print(json.dumps({"passed":True,"scenes":len(scenes),"files":[x.name for x in out.iterdir()]},ensure_ascii=False))
if __name__=="__main__":main()
