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
 if "icon_spec" not in scene:return []
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
  out+=[tag_text(98,150,h,46),line(640,197,640,520,GOLD,1.6),
       tag_text(346,279,labels[0],55,IVORY,"middle"),tag_text(932,279,labels[1],55,IVORY,"middle"),
       circle(346,381,76,GOLD,2),circle(932,381,76,GOLD,2),line(230,495,465,495),line(810,495,1050,495)]
 elif family=="data_bars":
  if len(labels)<2:raise ValueError("Bars require >=2 labels")
  out.append(tag_text(100,150,h,45))
  values=scene.get("values",[])
  if len(values)!=len(labels) or not all(isinstance(v,(int,float)) and 0<=v<=100 for v in values):raise ValueError("Bars need grounded 0-100 values")
  for i,(label,v) in enumerate(zip(labels,values)):
   y=259+i*112
   out.extend([tag_text(105,y,label,27,IVORY,family="sans"),f'<rect x="325" y="{y-25}" width="625" height="24" fill="#27231d"/>',
               f'<rect x="325" y="{y-25}" width="{625*v/100:.2f}" height="24" fill="{GOLD}"/>',
               tag_text(976,y,str(v)+"%",32,GOLD,family="sans")])
 elif family=="causal_flow":
  if len(labels)!=3:raise ValueError("Causal flow needs 3 nodes")
  out.append(tag_text(105,153,h,44))
  for i,(x,lbl) in enumerate(zip((235,640,1045),labels)):
   out.extend([circle(x,328,75,GOLD,1.8),tag_text(x,345,lbl,30,IVORY,"middle",family="sans",spacing=0)])
   if i<2:
    x2=x+150
    out+=[line(x2,328,x+325,328,GOLD,2),f'<path d="M{x+309} 316 L{x+325} 328 L{x+309} 340" fill="none" stroke="{GOLD}" stroke-width="2"/>']
 elif family=="single_symbol":
  out.append(tag_text(99,162,h,49))
  out.extend([circle(634,350,178,HAIR,1.5),circle(634,350,139,GOLD,2),line(634,172,634,528,HAIR,1)])
  out+=icon(scene,635,338)
 else:raise ValueError("Unknown editorial composition")
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
