#!/usr/bin/env python3
"""Render the ten explicitly specified conceptual diagrams as clean, text-free SVG stills."""
import json
from pathlib import Path
import cairosvg

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/"assets/generated"
OUT.mkdir(parents=True,exist_ok=True)
W,H=1920,1080
BG="#071827"; BG2="#0D2B40"; CYAN="#54C9D7"; BLUE="#2786A8"; PALE="#E8F1E9"; CORAL="#E68B68"; GOLD="#E8C46A"; MUTED="#7194A5"

def svg(body):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{BG}"/><stop offset="1" stop-color="{BG2}"/></linearGradient>
      <linearGradient id="water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{CYAN}" stop-opacity=".75"/><stop offset="1" stop-color="{BLUE}" stop-opacity=".45"/></linearGradient>
      <marker id="arrC" markerWidth="12" markerHeight="12" refX="8" refY="6" orient="auto"><path d="M0 0 L12 6 L0 12 Z" fill="{CYAN}"/></marker>
      <marker id="arrG" markerWidth="12" markerHeight="12" refX="8" refY="6" orient="auto"><path d="M0 0 L12 6 L0 12 Z" fill="{GOLD}"/></marker>
      <marker id="arrP" markerWidth="12" markerHeight="12" refX="8" refY="6" orient="auto"><path d="M0 0 L12 6 L0 12 Z" fill="{CORAL}"/></marker>
      <filter id="glow"><feGaussianBlur stdDeviation="10" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    <rect width="1920" height="1080" fill="url(#bg)"/>
    <g opacity=".18" fill="{PALE}">{''.join(f'<circle cx="{x}" cy="{y}" r="{r}"/>' for x,y,r in [(150,180,5),(330,790,4),(520,260,3),(770,900,5),(1090,160,4),(1380,870,3),(1640,240,5),(1780,690,3),(920,540,3),(250,520,3),(1510,520,4)])}</g>
    {body}
    </svg>'''

def arrow(x1,y1,x2,y2,color=CYAN,width=12):
    marker="arrC" if color==CYAN else ("arrG" if color==GOLD else "arrP")
    return f'<path d="M{x1} {y1} L{x2} {y2}" fill="none" stroke="{color}" stroke-width="{width}" stroke-linecap="round" marker-end="url(#{marker})"/>'

def container(x,y,w,h,color=CYAN,water_y=.48):
    top=y+h*water_y
    return f'''<path d="M{x} {y} L{x} {y+h-35} Q{x} {y+h} {x+35} {y+h} L{x+w-35} {y+h} Q{x+w} {y+h} {x+w} {y+h-35} L{x+w} {y}" fill="none" stroke="{PALE}" stroke-width="12"/>
    <path d="M{x+12} {top} Q{x+w/2} {top+18} {x+w-12} {top} L{x+w-12} {y+h-42} Q{x+w-12} {y+h-12} {x+w-42} {y+h-12} L{x+42} {y+h-12} Q{x+12} {y+h-12} {x+12} {y+h-42} Z" fill="url(#water)" opacity=".9"/>
    <ellipse cx="{x+w/2}" cy="{top}" rx="{w/2-12}" ry="18" fill="{color}" opacity=".8"/>'''

def animal(cx,cy,scale,color=CYAN):
    return f'''<g transform="translate({cx} {cy}) scale({scale})" stroke="{color}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" fill="none">
    <ellipse cx="0" cy="0" rx="120" ry="72" fill="{color}" fill-opacity=".22"/>
    <path d="M-95 -30 Q-150 -105 -205 -118 M-75 -45 Q-115 -130 -145 -150 M-80 35 L-150 95 M-35 60 L-65 150 M25 65 L35 150 M75 42 L140 110 M105 8 L190 25"/>
    <path d="M110 -20 Q190 -70 240 -28 Q205 20 120 18" fill="{color}" fill-opacity=".22"/>
    <circle cx="78" cy="-20" r="10" fill="{PALE}" stroke="none"/>
    </g>'''

def amphipod(cx,cy,scale,color=GOLD):
    return f'''<g transform="translate({cx} {cy}) scale({scale})" stroke="{color}" stroke-width="9" stroke-linecap="round" fill="none">
    <path d="M-150 0 Q-100 -85 -10 -75 Q80 -55 140 0 Q95 80 10 82 Q-90 75 -150 0 Z" fill="{color}" fill-opacity=".2"/>
    <path d="M-100 -35 L-165 -95 M-75 -50 L-115 -120 M-50 50 L-95 125 M-5 72 L-20 150 M45 65 L60 145 M95 38 L150 105 M130 0 L205 25"/>
    <path d="M-140 -10 Q-205 -75 -245 -60 M-135 12 Q-205 55 -240 45"/>
    <circle cx="110" cy="-20" r="9" fill="{PALE}" stroke="none"/>
    </g>'''

diagrams={}
# S022: same volume, different surface/volume ratio.
diagrams["S022"]=svg(f'''
  {container(280,300,360,500,GOLD,.42)}
  {container(1040,180,600,690,CYAN,.75)}
  {arrow(250,520,145,520,GOLD,14)}{arrow(650,520,760,520,GOLD,14)}
  {arrow(1050,520,970,520,CYAN,14)}{arrow(1640,520,1740,520,CYAN,14)}
  <g fill="{GOLD}" opacity=".85"><path d="M460 190 l-22 -55 l44 0 Z"/><path d="M460 900 l-22 55 l44 0 Z"/></g>
  <g fill="{CYAN}" opacity=".8"><path d="M1340 100 l-20 -42 l40 0 Z"/></g>
''')
# S023: small and large animal silhouettes with cutaway volumes.
diagrams["S023"]=svg(f'''
  {animal(500,520,.75,GOLD)}
  {animal(1360,520,1.55,CYAN)}
  <circle cx="500" cy="520" r="34" fill="{PALE}" opacity=".6"/>
  <circle cx="1360" cy="520" r="140" fill="{CYAN}" opacity=".12"/>
  <circle cx="1360" cy="520" r="105" fill="none" stroke="{PALE}" stroke-width="8" stroke-dasharray="14 16"/>
''')
# S026: warm vs cold reaction pathways.
diagrams["S026"]=svg(f'''
  <rect x="170" y="180" width="700" height="700" rx="70" fill="{CORAL}" opacity=".09" stroke="{CORAL}" stroke-width="8"/>
  <rect x="1050" y="180" width="700" height="700" rx="70" fill="{CYAN}" opacity=".09" stroke="{CYAN}" stroke-width="8"/>
  {animal(500,510,1.0,CORAL)}{animal(1400,510,1.0,CYAN)}
  {''.join(arrow(300+i*110,260,300+i*110,150,CORAL,8) for i in range(5))}
  {''.join(arrow(1170+i*110,260,1170+i*110,210,CYAN,8) for i in range(3))}
  <g fill="{GOLD}">{''.join(f'<circle cx="{330+i*100}" cy="{760+(i%2)*35}" r="18"/>' for i in range(5))}</g>
  <g fill="{CYAN}">{''.join(f'<circle cx="{1220+i*120}" cy="{760+(i%2)*25}" r="18"/>' for i in range(3))}</g>
''')
# S060: human plateau vs fish/crustacean continuing growth; no axes labels or values.
diagrams["S060"]=svg(f'''
  <path d="M220 820 L220 220 M220 820 L1690 820" stroke="{MUTED}" stroke-width="8" fill="none"/>
  <path d="M260 780 C430 610 520 350 760 300 C960 270 1160 270 1580 270" stroke="{GOLD}" stroke-width="18" fill="none" stroke-linecap="round"/>
  <path d="M260 780 C470 680 700 580 920 490 C1150 390 1390 300 1650 190" stroke="{CYAN}" stroke-width="18" fill="none" stroke-linecap="round"/>
  <circle cx="760" cy="300" r="24" fill="{GOLD}"/><circle cx="1650" cy="190" r="24" fill="{CYAN}"/>
''')
# S065: two habitats; early predation vs longer growth.
diagrams["S065"]=svg(f'''
  <rect x="120" y="150" width="790" height="760" rx="50" fill="{CORAL}" opacity=".08" stroke="{CORAL}" stroke-width="8"/>
  <rect x="1010" y="150" width="790" height="760" rx="50" fill="{CYAN}" opacity=".08" stroke="{CYAN}" stroke-width="8"/>
  {animal(450,600,.5,GOLD)}{animal(1340,600,1.15,CYAN)}
  {''.join(f'<path d="M{x} {y} q55 -55 110 0 q-55 60 -110 0" fill="{CORAL}" opacity=".8"/>' for x,y in [(220,330),(500,260),(700,420),(300,730)])}
  <path d="M220 850 L700 850" stroke="{CORAL}" stroke-width="12" stroke-dasharray="18 18"/>
  <path d="M1100 850 L1680 850" stroke="{CYAN}" stroke-width="12" marker-end="url(#arrC)"/>
''')
# S066: shallow many predators, deep fewer predators.
diagrams["S066"]=svg(f'''
  <rect x="120" y="130" width="1680" height="340" rx="45" fill="{CORAL}" opacity=".08" stroke="{CORAL}" stroke-width="7"/>
  <rect x="120" y="560" width="1680" height="360" rx="45" fill="{CYAN}" opacity=".08" stroke="{CYAN}" stroke-width="7"/>
  {''.join(f'<path d="M{x} 280 q55 -65 120 0 q-65 55 -120 0" fill="{CORAL}" opacity=".9"/>' for x in [260,520,800,1080,1360,1600])}
  {animal(930,390,.38,GOLD)}{animal(930,760,.75,CYAN)}
  <path d="M360 670 Q500 580 640 670" stroke="{MUTED}" stroke-width="10" fill="none" stroke-dasharray="20 18"/>
''')
# S070: cold water has more dissolved oxygen dots.
diagrams["S070"]=svg(f'''
  <rect x="180" y="210" width="700" height="650" rx="65" fill="{CORAL}" opacity=".08" stroke="{CORAL}" stroke-width="9"/>
  <rect x="1040" y="210" width="700" height="650" rx="65" fill="{CYAN}" opacity=".08" stroke="{CYAN}" stroke-width="9"/>
  <g fill="{GOLD}">{''.join(f'<circle cx="{280+(i%4)*145}" cy="{350+(i//4)*150}" r="18"/>' for i in range(8))}</g>
  <g fill="{CYAN}">{''.join(f'<circle cx="{1140+(i%5)*120}" cy="{320+(i//5)*125}" r="18"/>' for i in range(20))}</g>
  <g fill="none" stroke="{PALE}" stroke-width="7" opacity=".5"><path d="M250 700 Q520 640 800 700 M1110 700 Q1400 640 1680 700"/></g>
''')
# S071: oxygen supply into organism and metabolic use out.
diagrams["S071"]=svg(f'''
  <circle cx="960" cy="540" r="250" fill="{CYAN}" fill-opacity=".12" stroke="{PALE}" stroke-width="10"/>
  {animal(960,540,1.1,CYAN)}
  {''.join(arrow(330+i*30,250+i*90,700,390+i*35,CYAN,10) for i in range(4))}
  {''.join(arrow(1220,390+i*70,1570,250+i*90,GOLD,10) for i in range(4))}
  <g fill="{CYAN}">{''.join(f'<circle cx="{390+i*65}" cy="{180+(i%2)*60}" r="17"/>' for i in range(7))}</g>
''')
# S072: many amphipods across size spectrum with oxygen motif; no data points or axes.
diagrams["S072"]=svg(f'''
  {''.join(amphipod(220+i*185,520,(.22+i*.075),GOLD if i<4 else CYAN) for i in range(8))}
  <g fill="none" stroke="{CYAN}" stroke-width="10" opacity=".65">
    <circle cx="300" cy="190" r="38"/><circle cx="300" cy="190" r="13" fill="{CYAN}"/>
    <circle cx="1620" cy="190" r="38"/><circle cx="1620" cy="190" r="13" fill="{CYAN}"/>
    <path d="M380 190 Q960 80 1540 190" stroke-dasharray="18 20"/>
  </g>
''')
# S074: five conditions converge on a giant amphipod silhouette.
diagrams["S074"]=svg(f'''
  {amphipod(960,560,1.55,GOLD)}
  <g stroke="{CYAN}" stroke-width="10" fill="none">
    <path d="M960 170 L960 290" marker-end="url(#arrC)"/>
    <path d="M440 330 L700 440" marker-end="url(#arrC)"/>
    <path d="M1480 330 L1220 440" marker-end="url(#arrC)"/>
    <path d="M520 850 L760 700" marker-end="url(#arrC)"/>
    <path d="M1400 850 L1160 700" marker-end="url(#arrC)"/>
  </g>
  <g fill="{GOLD}" opacity=".95">
    <circle cx="960" cy="130" r="48"/>
    <circle cx="390" cy="310" r="48"/>
    <circle cx="1530" cy="310" r="48"/>
    <circle cx="470" cy="890" r="48"/>
    <circle cx="1450" cy="890" r="48"/>
  </g>
  <g fill="{BG}" opacity=".85">
    <path d="M960 80 L982 130 L960 180 L938 130 Z"/>
    <circle cx="390" cy="310" r="18"/><circle cx="1530" cy="310" r="18"/>
    <path d="M470 855 L505 890 L470 925 L435 890 Z"/><circle cx="1450" cy="890" r="18"/>
  </g>
''')

board=json.loads((ROOT/"content/board.json").read_text(encoding="utf-8"))
expected={s["id"] for s in board["scenes"] if s["mode"]=="生成"}
if set(diagrams)!=expected:
    raise SystemExit(f"Diagram IDs mismatch: expected {sorted(expected)}, got {sorted(diagrams)}")
for sid,markup in diagrams.items():
    cairosvg.svg2png(bytestring=markup.encode("utf-8"),write_to=str(OUT/f"{sid}.png"),output_width=W,output_height=H)
print(json.dumps({"generated_diagrams":len(diagrams),"scene_ids":sorted(diagrams),"resolution":[W,H],"text_baked_in":False},ensure_ascii=False))
