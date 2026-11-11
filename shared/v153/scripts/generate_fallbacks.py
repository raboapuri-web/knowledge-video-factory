#!/usr/bin/env python3
"""Create original, text-free/labelled vector fallback diagrams only when a suitable source still was not acquired."""
from pathlib import Path
from xml.sax.saxutils import escape
import cairosvg

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/"assets/generated_replacements"
OUT.mkdir(parents=True,exist_ok=True)

def render(scene_id,svg):
    dest=OUT/(scene_id+".png")
    cairosvg.svg2png(bytestring=svg.encode("utf-8"),write_to=str(dest),output_width=1920,output_height=1080)
    print(f"generated fallback {scene_id}: {dest}")
    return dest

def food_web():
    svg=r'''<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
    <defs>
      <linearGradient id="bg" x2="0" y2="1"><stop stop-color="#071d32"/><stop offset="1" stop-color="#020914"/></linearGradient>
      <linearGradient id="water" x2="0" y2="1"><stop stop-color="#1d627b" stop-opacity=".34"/><stop offset="1" stop-color="#061a2a" stop-opacity=".04"/></linearGradient>
      <linearGradient id="sun" x2="0" y2="1"><stop stop-color="#f7d98a"/><stop offset="1" stop-color="#d38a42"/></linearGradient>
      <filter id="glow"><feGaussianBlur stdDeviation="8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      <marker id="arrow" markerWidth="14" markerHeight="14" refX="9" refY="5" orient="auto"><path d="M0 0L10 5L0 10Z" fill="#e6c37c"/></marker>
    </defs>
    <rect width="1920" height="1080" fill="url(#bg)"/>
    <path d="M0 0H1920V250Q1500 190 1100 260T0 245Z" fill="url(#water)"/>
    <g opacity=".23" stroke="#72c6d5" stroke-width="2"><path d="M0 250Q400 210 800 250T1600 250T2200 230"/><path d="M0 340Q500 300 1000 340T2000 330"/><path d="M0 820Q500 770 1000 820T2000 810"/></g>
    <g opacity=".65" fill="#e8d69a" filter="url(#glow)"><circle cx="170" cy="130" r="48" fill="url(#sun)"/></g>
    <g stroke="#e6c37c" stroke-width="7" fill="none" marker-end="url(#arrow)" opacity=".9">
      <path d="M300 700C390 620 450 580 540 540"/><path d="M690 535C790 510 850 480 950 450"/>
      <path d="M1090 450C1190 420 1270 385 1370 350"/><path d="M1080 560C1190 650 1290 710 1420 735"/>
      <path d="M650 700C900 820 1150 840 1430 760"/>
    </g>
    <g fill="#8bd7ae" filter="url(#glow)">
      <circle cx="300" cy="760" r="9"/><circle cx="340" cy="700" r="7"/><circle cx="390" cy="790" r="8"/><circle cx="440" cy="730" r="6"/>
      <circle cx="490" cy="820" r="7"/><circle cx="520" cy="690" r="9"/><circle cx="560" cy="760" r="6"/><circle cx="600" cy="700" r="8"/>
      <circle cx="350" cy="850" r="5"/><circle cx="465" cy="875" r="6"/><circle cx="575" cy="870" r="5"/>
    </g>
    <g transform="translate(650 510)" fill="#74c6d7" stroke="#c4eff4" stroke-width="3">
      <ellipse cx="0" cy="0" rx="88" ry="34"/><path d="M-78 0L-132 -42L-125 0L-132 42Z"/><circle cx="55" cy="-8" r="5" fill="#071d32"/>
      <path d="M-5 -28Q-25 -70 -2 -88Q25 -65 10 -28" fill="none"/><path d="M-5 28Q-25 70 -2 88Q25 65 10 28" fill="none"/>
    </g>
    <g transform="translate(1020 420)" fill="#e78f72" stroke="#ffd0aa" stroke-width="3">
      <path d="M-95 0Q-40 -55 42 -34Q95 -10 55 30Q-20 58 -95 0Z"/><path d="M45 -24Q100 -82 124 -56Q113 -16 66 0Q130 32 112 72Q74 58 48 28" fill="none" stroke-width="8"/>
      <path d="M-55 -12Q-30 -80 -5 -94M-40 4Q-5 75 15 94M-70 5Q-105 65 -120 65" fill="none" stroke-width="6"/>
      <circle cx="25" cy="-12" r="7" fill="#071d32"/>
    </g>
    <g transform="translate(1510 390)" fill="#9bb7d0" stroke="#e1edf4" stroke-width="4">
      <path d="M-180 0Q-90 -85 80 -55Q170 -20 95 48Q-55 105 -180 0Z"/><path d="M70 -45L190 -110L168 -20L210 40L75 25Z"/>
      <circle cx="55" cy="-18" r="9" fill="#071d32"/><path d="M-45 -42Q-10 -110 28 -130" fill="none" stroke-width="7"/>
    </g>
    <g transform="translate(1450 760)" fill="#d49a72" stroke="#ffe0ba" stroke-width="4">
      <path d="M-150 0Q-80 -70 65 -45Q155 -15 90 45Q-50 85 -150 0Z"/><path d="M65 -35L175 -100L155 -20L195 40L75 28Z"/>
      <circle cx="40" cy="-13" r="8" fill="#071d32"/>
    </g>
    <g font-family="Noto Sans CJK JP, sans-serif" fill="#e8f4f6">
      <text x="125" y="235" font-size="30" fill="#f1d49a">太陽光</text>
      <text x="320" y="950" font-size="36">植物プランクトン</text>
      <text x="590" y="665" font-size="36">動物プランクトン</text>
      <text x="930" y="585" font-size="36">小型魚類</text>
      <text x="1430" y="265" font-size="36">大型捕食魚</text>
      <text x="1380" y="885" font-size="36">イカ・甲殻類</text>
      <text x="960" y="1010" font-size="26" fill="#b8d0d8">海の食物網：エネルギーは小さな生物から大型捕食者へとつながる</text>
    </g>
    </svg>'''
    return render("S038",svg)

def oxygen_minimum_zone():
    svg=r'''<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
    <defs>
      <linearGradient id="bg" x2="0" y2="1"><stop stop-color="#061d32"/><stop offset="1" stop-color="#020813"/></linearGradient>
      <linearGradient id="ocean" x2="0" y2="1"><stop stop-color="#1e8eb0"/><stop offset=".32" stop-color="#0c4f75"/><stop offset=".62" stop-color="#17324e"/><stop offset="1" stop-color="#050d1c"/></linearGradient>
      <linearGradient id="omz" x2="0" y2="1"><stop stop-color="#e78a54" stop-opacity=".08"/><stop offset=".4" stop-color="#e75d43" stop-opacity=".75"/><stop offset="1" stop-color="#c9473d" stop-opacity=".18"/></linearGradient>
      <marker id="arr" markerWidth="14" markerHeight="14" refX="9" refY="5" orient="auto"><path d="M0 0L10 5L0 10Z" fill="#f1d18c"/></marker>
    </defs>
    <rect width="1920" height="1080" fill="url(#bg)"/>
    <path d="M0 190Q240 150 480 188T960 180T1440 190T1920 178V1080H0Z" fill="url(#ocean)"/>
    <path d="M0 190Q240 150 480 188T960 180T1440 190T1920 178" fill="none" stroke="#8be0ef" stroke-width="8"/>
    <path d="M0 430Q480 390 960 445T1920 420V720Q1450 750 960 700T0 730Z" fill="url(#omz)"/>
    <path d="M0 780Q350 750 700 800T1400 785T1920 800V1080H0Z" fill="#07101e"/>
    <g opacity=".5" stroke="#6ab9d1" stroke-width="3" fill="none"><path d="M0 300Q480 265 960 300T1920 285"/><path d="M0 560Q480 525 960 560T1920 545"/><path d="M0 850Q480 825 960 850T1920 835"/></g>
    <g stroke="#f1d18c" stroke-width="7" fill="none" marker-end="url(#arr)"><path d="M280 220V340"/><path d="M510 220V350"/><path d="M1480 220V345"/></g>
    <g fill="#91e0c1" opacity=".85"><circle cx="230" cy="260" r="8"/><circle cx="280" cy="300" r="6"/><circle cx="380" cy="270" r="7"/><circle cx="460" cy="320" r="6"/><circle cx="1520" cy="270" r="7"/></g>
    <g fill="#d7e9ef" stroke="#a7d7e3" stroke-width="3">
      <path d="M650 330Q720 280 820 320Q860 345 815 370Q710 395 650 330Z"/><path d="M800 320L870 285L858 330L875 360L805 350Z"/>
      <path d="M1150 850Q1210 805 1320 835Q1370 860 1320 890Q1210 920 1150 850Z"/><path d="M1310 835L1380 800L1365 845L1385 875L1315 865Z"/>
    </g>
    <g fill="#f1c2a0" opacity=".8">
      <path d="M920 475Q970 445 1020 475Q1045 500 1010 520Q960 530 920 475Z"/>
      <path d="M1040 610Q1080 585 1120 610Q1140 630 1110 645Q1070 655 1040 610Z"/>
    </g>
    <g font-family="Noto Sans CJK JP, sans-serif" fill="#edf7fa">
      <text x="90" y="120" font-size="42">海面</text>
      <text x="90" y="290" font-size="34" fill="#a9f0d1">酸素が豊富な表層</text>
      <text x="90" y="520" font-size="42" fill="#ffbd8e">酸素極小層（OMZ）</text>
      <text x="90" y="595" font-size="28" fill="#f3c3a7">分解・呼吸で酸素が消費され、濃度が低下</text>
      <text x="90" y="920" font-size="34">深海底：場所によって酸素量は異なる</text>
      <text x="1550" y="280" font-size="28">0 m</text>
      <text x="1550" y="450" font-size="28">数百 m</text>
      <text x="1550" y="690" font-size="28">1,000 m</text>
      <text x="1550" y="900" font-size="28">深海</text>
    </g>
    <g stroke="#f1d18c" stroke-width="4" fill="none"><path d="M1500 210V900"/><path d="M1484 210H1516M1484 450H1516M1484 690H1516M1484 900H1516"/></g>
    </svg>'''
    return render("S073",svg)

if __name__=="__main__":
    for sid,fn in [("S038",food_web),("S073",oxygen_minimum_zone)]:
        if not (ROOT/"assets/collected"/(sid+".jpg")).is_file():
            fn()
