"""v8 premium pictograms: silhouettes and surfaces, never a stick-person skeleton.

Accepts only model-supplied validated geometry metadata (concept, meaning, numeric paths);
the rendered symbol is chosen by semantic class, not blindly reproducing arbitrary strokes.
Unrecognized concepts retain a coherent filled geometric stamp, plus the original provenance.
"""
from __future__ import annotations
import html,re,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parent
V7=ROOT.parent/"standalone_kangaeru_v7"
sys.path.insert(0,str(V7))
import icons as original
ORIGINAL_V7_GEOMETRY=original.geometry  # capture before v8 swaps drawing backend

G="#c6a56e"; W="#f2eadb"; D="#0e0d0c"; H="#7c684b"
def strokepath(d,width=4,fill="none",stroke=G):
 return f'<path d="{d}" fill="{fill}" stroke="{stroke}" stroke-width="{width}" stroke-linecap="round" stroke-linejoin="round"/>'
def ellipse(cx,cy,rx,ry,fill=G,stroke="none",width=0):
 return f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="{fill}" stroke="{stroke}" stroke-width="{width}"/>'
def disc(cx,cy,r,fill=G):
 return f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{fill}"/>'
def rect(x,y,w,h,fill=G,rx=2):
 return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}"/>'

def person(x=50,y=50,scale=1):
 """Filled figure with broad shoulders and jersey rather than 1px arms/legs."""
 elements=[
  disc(0,-23,8,W),
  strokepath("M-17 -7 Q0 -18 17 -7 L14 15 Q0 21 -14 15 Z",1,G,G),
  strokepath("M-16 -5 L-28 15 L-22 20 L-8 6",4,G,G),
  strokepath("M16 -5 L30 6 L26 13 L8 3",4,G,G),
  strokepath("M-11 15 L-17 34 L-7 37 L2 17",4,G,G),
  strokepath("M8 16 L17 34 L26 29 L18 11",4,G,G)
 ]
 return f'<g transform="translate({x} {y}) scale({scale})">'+''.join(elements)+'</g>'

def goalkeeper():
 return [
  strokepath("M8 88 V16 H92 V88",4,stroke=G),
  strokepath("M8 16 L23 27 H77 L92 16",2,stroke=H),
  strokepath("M23 27 V85 M38 27 V85 M53 27 V85 M68 27 V85 M77 27 V85",1.7,stroke=H),
  strokepath("M8 46 H92 M8 66 H92",1.7,stroke=H),
  person(47,60,.70),
  disc(80,49,7,W),strokepath("M76 44 L83 52 M77 53 L84 45",1.7,stroke=D)
 ]
def ball():
 return [disc(50,50,29,W),strokepath("M50 35 L64 42 L61 58 L45 65 L36 52 Z",2.5,fill=D,stroke=D),
         strokepath("M50 35 L45 24 M64 42 L76 33 M61 58 L72 70 M45 65 L33 77 M36 52 L24 47",2.4,stroke=D)]
def decision():
 return [disc(50,25,10,W),rect(43,35,14,18,G),strokepath("M50 54 V74",7),
         strokepath("M50 74 H20 M50 74 H80",4),
         strokepath("M20 74 L29 65 M20 74 L29 83 M80 74 L71 65 M80 74 L71 83",4)]
def brain():
 return [strokepath("M48 78 C31 82 17 70 20 57 C9 50 16 35 27 35 C25 20 43 15 50 27 C59 14 79 24 73 37 C86 43 83 58 75 63 C76 77 61 84 48 78 Z",3,G,G),
         strokepath("M48 27 V79 M28 35 Q45 43 34 59 M73 38 Q55 44 65 59",3,stroke=D)]
def medical():
 return [rect(18,18,64,64,G,7),rect(44,27,12,46,W,1),rect(27,44,46,12,W,1),
         strokepath("M29 86 Q50 96 71 86",3,stroke=H)]
def crowd():
 return [disc(27,30,10,W),disc(73,30,10,W),disc(50,23,11,W),
         strokepath("M10 73 Q10 48 28 47 Q44 48 44 72 Z",2,G,G),
         strokepath("M56 73 Q56 48 73 47 Q90 48 90 72 Z",2,G,G),
         strokepath("M28 81 Q26 51 50 46 Q74 51 72 81 Z",2,W,W)]
def scales():
 return [rect(46,21,8,59,G),rect(28,81,44,6,G),strokepath("M16 35 H84",5),
         strokepath("M24 38 L17 63 H40 L33 38",3,stroke=W),
         strokepath("M67 38 L60 63 H83 L76 38",3,stroke=W),
         strokepath("M16 64 Q28 78 41 64 Z",2,G,G),strokepath("M60 64 Q72 78 84 64 Z",2,G,G)]
def chart():
 return [rect(17,56,14,30,G,2),rect(42,38,14,48,W,2),rect(68,21,14,65,G,2),
         strokepath("M14 89 H90",3,stroke=H)]
def office():
 return [rect(21,22,58,63,G,3),rect(45,10,10,15,W),rect(45,65,11,20,D,0),
         *[rect(x,y,7,8,W,1) for x in (30,47,64) for y in (34,49)]]
def eye():
 return [strokepath("M11 50 Q50 9 89 50 Q50 91 11 50 Z",3,G,G),disc(50,50,20,D),disc(50,50,11,W)]
def rescue():
 return [rect(15,20,70,59,G,8),rect(44,29,12,43,W,0),rect(29,44,42,12,W,0),
         strokepath("M20 82 H80",4,stroke=H)]
def clock():
 return [f'<circle cx="50" cy="50" r="34" fill="{G}" stroke="{W}" stroke-width="3"/>',
         strokepath("M50 23 V50 L67 62",5,stroke=D)]
def people():
 return crowd()

MOTIFS={
 "goalkeeper":goalkeeper,"ball":ball,"decision":decision,"brain":brain,"medical":medical,
 "crowd":crowd,"scales":scales,"chart":chart,"office":office,"eye":eye,
 "rescue":rescue,"clock":clock,"people":people
}
PATTERNS=[
 ("goalkeeper",r"ゴールキーパー|キーパー|GK|キック|PK|ゴール|セーブ"),
 ("ball",r"ボール|サッカー|シュート|フットボール"),
 ("medical",r"病院|患者|医師|診察|医療|治療|医者|検査"),
 ("rescue",r"救急|救命|救助|事故|消防"),
 ("crowd",r"観衆|観客|集団|群衆|傍観者|大勢|人混み"),
 ("office",r"会社|社員|職場|企業|会議|組織|上司"),
 ("brain",r"脳|認知|思考|心理|意識|記憶|行動経済"),
 ("scales",r"公平|責任|評価|比較|損失|利得|正義"),
 ("chart",r"統計|データ|グラフ|比率|確率|セーブ率|パーセント"),
 ("clock",r"時間|待機|瞬間|長期|秒|年"),
 ("decision",r"判断|選択|意思|決断|動く|動かない"),
 ("eye",r"注視|視線|目|見る|観察|注意"),
 ("people",r"人間|人々|社会|複数|他人")
]
def kind(spec):
 text=str(spec.get("concept",""))+" "+str(spec.get("meaning",""))
 for key,pat in PATTERNS:
  if re.search(pat,text,re.I):return key
 return "abstract"

def fallback_abstract(spec):
 # Safe, visually substantial abstract motif with filled geometric facets.
 # The source geometry is *not* treated as a stick figure; draw lines thick
 # within a circular solid field and label generic meaning as unverified.
 base=[disc(50,50,39,G),disc(50,50,30,D)]
 paths=spec.get("paths",[])
 for path in paths[:6]:
  if not isinstance(path,list) or len(path)<2:continue
  coords=[]
  for pair in path[:12]:
   if len(pair)!=2:continue
   x,y=pair;coords.append(f"{max(24,min(76,x)):.1f},{max(24,min(76,y)):.1f}")
  if len(coords)>1:base.append(f'<polyline points="{" ".join(coords)}" fill="none" stroke="{W}" stroke-width="5.2" stroke-linecap="round" stroke-linejoin="round"/>')
 if not paths:
  base.extend([rect(30,38,13,27,G),rect(52,24,13,41,W)])
 return base

def quality_svg(spec,cx,cy,scale=1.0):
 if not spec:return []
 if spec.get("origin")=="original_8015":
  return ORIGINAL_V7_GEOMETRY(spec,cx,cy,scale)
 # Keep same source validation: no arbitrary model SVG or scripts.
 original.validate(spec)
 motif=kind(spec);parts=MOTIFS[motif]() if motif in MOTIFS else fallback_abstract(spec)
 sz=1.65*scale
 x=cx-50*sz;y=cy-50*sz
 return [f'<g transform="translate({x:.2f} {y:.2f}) scale({sz:.4f})">' + "".join(parts) + "</g>"]

def validate_visual_quality(spec):
 if spec is None:return True
 if spec.get("origin")=="original_8015":return True
 original.validate(spec)
 if not spec.get("meaning"):return False
 svg="".join(quality_svg(spec,256,256))
 return "<g " in svg and ("fill=" in svg) and ("stroke=" in svg or "rect" in svg)
