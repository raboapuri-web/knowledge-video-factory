#!/usr/bin/env python3
"""V129 ecology / competitive losers: meaning-driven scientific documentary.
Full 8-section manuscript, original evidence diagrams, two/three temporal states
per semantic beat, measured VOICEVOX, subtitle-safe 1080p H.264 master.
"""
from pathlib import Path
import sys, re, json, math, random
from PIL import Image, ImageDraw
ROOT=Path(__file__).resolve().parent
sys.path.insert(0,str(ROOT.parent/"v125"))
import production as core
core.ROOT=ROOT
core.OUT=ROOT/"output"
core.CONTENT=ROOT/"content"/"script.json"
CHAPTERS=["prologue","chapter1","chapter2","chapter3","chapter4","chapter5","chapter6","epilogue"]
core.CHAPTERS=CHAPTERS
core.NUMBERS={k:f"{i:02d}" for i,k in enumerate(CHAPTERS)}
core.DIGITS.update({
"100人":"ひゃくにん","10社":"じゅっしゃ","19世紀":"じゅうきゅうせいき",
"1988年":"せんきゅうひゃくはちじゅうはちねん","128世代":"ひゃくにじゅうはちせだい",
"58パーセント":"ごじゅうはちパーセント","1930年代":"せんきゅうひゃくさんじゅうねんだい",
"2024年":"にせんにじゅうよねん","20パーセント":"にじゅっパーセント",
"80パーセント":"はちじゅっパーセント","1859年":"せんはっぴゃくごじゅうきゅうねん",
"1864年":"せんはっぴゃくろくじゅうよねん","1981年":"せんきゅうひゃくはちじゅういちねん",
"8世代":"はちせだい","1999年":"せんきゅうひゃくきゅうじゅうきゅうねん",
"2015年":"にせんじゅうごねん","46件":"よんじゅうろっけん",
"50パーセント":"ごじゅっパーセント","25パーセント":"にじゅうごパーセント",
"16種類":"じゅうろくしゅるい","32種類":"さんじゅうにしゅるい",
"100人":"ひゃくにん"
})
OUT=core.OUT
W,H=1920,1080
BG=(16,22,30); PANEL=(30,42,52); PANEL2=(42,57,65)
CREAM=(238,234,219); MUTED=(156,168,172)
RED=(225,80,78); GREEN=(99,207,169); BLUE=(103,157,212)
GOLD=(236,189,100); PALE=(207,222,222); LINE=(83,107,119)
NAMES={
"prologue":"敗者のいない世界","chapter1":"競争は生物を強くするのか",
"chapter2":"競争排除と共存の境界","chapter3":"繁殖成功の極端な格差",
"chapter4":"社会ダーウィン主義の問い",
"chapter5":"今日の敗者は明日の勝者か",
"chapter6":"敗者を残す競争社会","epilogue":"敗者はなぜ必要なのか"
}
# Every entry is a semantic storyboard state, not a generic filler illustration.
P={
"prologue":[
("admission","競争に敗れた人々","選抜の結果は避けられない"),
("ranking","勝者と敗者を分ける","結果が同じとは限らない"),
("admission","志望者100人","定員は限られる"),
("business","十社が競争する市場","顧客と資源には限りがある"),
("question","敗者がいなければ？","資源はどう配分される"),
("spencer","適者生存という思想","ハーバート・スペンサー"),
("species","ハエ・ゾウリムシ・ゾウアザラシ","自然界の競争を調べる"),
("thesis","勝者と敗者の意味","自然は何を選んでいるのか"),
],
"chapter1":[
("flies","ショウジョウバエの実験","Mueller／1988"),
("density","低密度と高密度","同じハエでも環境が違う"),
("resource","餌をめぐる競争","資源量と個体数"),
("generations","128世代にわたる選択","集団の形質が変化する"),
("density","密集した実験環境","餌に早く接近する個体"),
("chart58","餌の消費速度が変わる","高密度系統は平均58%速い"),
("genes","努力ではなく自然選択","世代間で集団が変化する"),
("business","競争市場と企業","価格と品質の改善"),
("tradeoff","競争の利益と代償","全能力が向上するわけではない"),
("thesis","勝つ能力は条件付き","強さには環境がある"),
],
"chapter2":[
("paramecium","ガウゼのゾウリムシ実験","1930年代の培養実験"),
("separate","別々なら両種とも増殖","Aurelia と Caudatum"),
("exclusion","一緒にすると一方が排除","競争排除の古典例"),
("exclusion","資源を共有すると","競争で優劣が生じる"),
("market","似た市場で争う企業","資源利用の重なり"),
("paramecium","別の組み合わせでは？","Bursaria を加えた比較"),
("niche","異なる場所・餌を利用","条件によって共存できる"),
("niche","競争する場所を変える","劣等性は絶対ではない"),
("market","市場を変える戦略","小規模・専門化・独自性"),
("thesis","敗北は消滅と同義か","生存できる場所がある"),
],
"chapter3":[
("seals","ゾウアザラシの繁殖期","海岸で争う雄たち"),
("hierarchy","繁殖場所を支配する","優位な雄と下位の雄"),
("seals","争いの代償","体格・力・繁殖機会"),
("chart80","繁殖成功の集中","オスの約20%が子の約80%"),
("chart80","父親を特定できた子","調査個体に限定した割合"),
("hierarchy","繁殖の機会は不平等","分配されるわけではない"),
("fitness","進化適応度と子孫","成果は努力と比例しない"),
("future","若い雄の次の繁殖期","現在の敗北は永遠ではない"),
("thesis","勝者は善良なのか？","繁殖成功≠人格的価値"),
],
"chapter4":[
("timeline","1859年『種の起源』","ダーウィンの自然選択"),
("timeline","1864年『適者生存』","スペンサーの社会思想"),
("spencer","自由と国家介入","競争を抑えるべきなのか"),
("tradeoff","競争の利益と痛み","消費者と競争敗者"),
("market","市場退出という現象","企業の競争と淘汰"),
("species","3つの生物研究","競争・排除・繁殖格差"),
("logic","自然を社会に応用する","事実と価値判断は違う"),
("logic","自然にあること","社会で望ましいとは限らない"),
("thesis","適者は永遠に勝つのか","その前提を疑う"),
],
"chapter5":[
("flies","1981年の別のハエ実験","Mueller と Ayala"),
("matrix","高密度系統と低密度系統","環境を変えて比べる"),
("generations","8世代の選択","集団の増殖能力を比較"),
("matrix","高密度では高密度系統","低密度では低密度系統"),
("matrix","強さは一つではない","環境が勝者を変える"),
("business","産業の勝者は変わる","技術・組織・環境変化"),
("logic","現在の順位は絶対でない","一つの競争の結果"),
("grass","生物多様性の保険仮説","Yachi & Loreau／1999"),
("grass","一種類の草地","環境が変わったら？"),
("grass","異なる種類の草地","生存戦略の幅が広い"),
("chart50","46件の草地実験","Isbell ほか／2015"),
("chart50","低多様性と高多様性","50% と 25% の変動幅"),
("insurance","変化に対する保険","多様性が安定性に寄与"),
("tradeoff","植物と人間は異なる","制度への直接の証明ではない"),
("thesis","不要な能力はあるのか","将来の適応可能性を残す"),
],
"chapter6":[
("triad","3つの命題を区別する","競争・敗北・永久排除"),
("business","売れなかった新商品","市場からの撤退"),
("retry","商品と人間は別","再挑戦の機会"),
("retry","失敗後の新しい商品","別の市場に挑む"),
("ranking","一度の敗北の意味","人格の評価ではない"),
("species","ハエ・ゾウリムシ・ゾウアザラシ","成功は環境に依存"),
("triad","敗者を固定しない","新たな競争者を残す"),
("market","新規参入が消えた社会","今の勝者だけを守る？"),
("retry","再挑戦は競争を保つ","未来の競争を成立させる"),
("tradeoff","費用と制度の検討","生態学だけでは決まらない"),
("thesis","敗北と排除は違う","競争を続ける社会"),
],
"epilogue":[
("species","自然界の競争","生存と繁殖に成果の差"),
("triad","三つの重要な発見","競争・環境・多様性"),
("ranking","敗者は固定された身分か","一度の結果は未来ではない"),
("matrix","環境が変われば勝者も変わる","普遍的な強者はいない"),
("logic","競争の肯定と限界","社会制度を自動では導かない"),
("retry","今日の敗者が明日の挑戦者","新しい可能性を残す"),
("ending","必要なのは再挑戦の余地","競争を続けるために"),
]}
SOURCES=[
"Mueller, L.D. (1988). Evolution of competitive ability in Drosophila by density-dependent natural selection. PNAS 85:4383-4386. doi:10.1073/pnas.85.12.4383",
"Gause, G.F. (1934). The Struggle for Existence. Williams & Wilkins. Classic Paramecium competitive-exclusion and coexistence experiments.",
"Allegue et al. (2024). Offspring sex ratio increases with paternal reproductive success in a colony of southern elephant seals. Marine Mammal Science. doi:10.1111/mms.13108",
"Darwin, C. (1859). On the Origin of Species. London: John Murray.",
"Spencer, H. (1864). Principles of Biology. The expression 'survival of the fittest'.",
"Mueller, L.D. & Ayala, F.J. (1981). Trade-off between r-selection and K-selection in Drosophila populations. PNAS 78:1303-1305. doi:10.1073/pnas.78.2.1303",
"Yachi, S. & Loreau, M. (1999). Biodiversity and ecosystem productivity in a fluctuating environment: The insurance hypothesis. PNAS 96:1463-1468. doi:10.1073/pnas.96.4.1463",
"Isbell, F. et al. (2015). Biodiversity increases the resistance of ecosystem productivity to climate extremes. Nature 526:574-577. doi:10.1038/nature15374",
"All organism drawings, imagined society examples and diagrams are original illustrations. Chart values carry sample/scope notes. No nature photographs or historical primary-source images are implied."
]
def norm(s):
    return re.sub(r"\s+","",s).replace("**","")
def split_beats(paras,target=168):
    # Preserve every character after whitespace normalization and never end mid-sentence.
    sentences=[]
    for p in paras:
        sentences+=re.findall(r"[^。！？!?]*[。！？!?]|[^。！？!?]+$",norm(p))
    out=[];buf=""
    for sentence in sentences:
        if buf and len(buf)+len(sentence)>target and len(buf)>=88:
            out.append(buf);buf=""
        buf+=sentence
    if buf:out.append(buf)
    if len(out)>1 and len(out[-1])<58:
        tail=out.pop()
        out[-1]+=tail
    assert "".join(out)=="".join(map(norm,paras))
    return out
def compile_manuscript():
    raw=(ROOT/"manuscript.txt").read_text(encoding="utf-8")
    items=re.split(r"(?m)^## (PROLOGUE|CHAPTER[1-6]|EPILOGUE)\s*$",raw)
    chunks={items[i]:items[i+1] for i in range(1,len(items)-1,2)}
    expected=["PROLOGUE"]+[f"CHAPTER{i}" for i in range(1,7)]+["EPILOGUE"]
    assert set(chunks)==set(expected),(set(chunks),set(expected))
    beats=[];audit={}
    for label,ch in zip(expected,CHAPTERS):
        paras=[x.strip() for x in chunks[label].strip().splitlines() if x.strip()]
        texts=split_beats(paras)
        plans=P[ch]
        for j,t in enumerate(texts):
            p=min(len(plans)-1,int((j+.45)*len(plans)/len(texts)))
            mode,headline,callout=plans[p]
            beats.append({"id":f"{ch}-{j+1:03d}","chapter":ch,"chapterTitle":NAMES[ch],
                          "visual":mode,"headline":headline,"callout":callout,"narration":t})
        audit[ch]={"chars":sum(len(norm(x)) for x in paras),"beats":len(texts)}
    restored="".join(x["narration"] for x in beats)
    assert restored=="".join(norm(chunks[k]) for k in expected)
    assert sum(v["chars"] for v in audit.values())>=9000,audit
    assert len(beats)>=65,len(beats)
    OUT.mkdir(parents=True,exist_ok=True);(ROOT/"content").mkdir(exist_ok=True)
    result={"videoId":"V129","title":"生態学から学ぶ｜なぜ敗者が社会に必要なのか？",
      "speaker":13,"speed":1.15,"beats":beats,"sources":SOURCES,"chapterAudit":audit}
    core.CONTENT.write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding="utf-8")
    print("SCRIPT_AUDIT",audit,"meaning beats",len(beats),flush=True)
    return result

def ft(n,serif=False):return core.ft(n,serif)
def center(d,s,xy,size=54,color=CREAM,serif=False):
    x1,y1,x2,y2=xy
    f=core.fit_text(d,s,x2-x1-22,size,24,serif)
    bb=d.textbbox((0,0),s,font=f)
    d.text((x1+(x2-x1-(bb[2]-bb[0]))/2,y1+(y2-y1-f.size)/2),s,font=f,fill=color)
def txt(d,s,x,y,w=1550,n=49,c=CREAM,serif=False):
    d.text((x,y),s,font=core.fit_text(d,s,w,n,22,serif),fill=c)
def rect(d,x1,y1,x2,y2,fill=PANEL,border=LINE,r=20,width=3):
    d.rounded_rectangle((x1,y1,x2,y2),radius=r,fill=fill,outline=border,width=width)
def line(d,points,c=LINE,width=5):d.line(points,fill=c,width=width,joint="curve")
def badge(d,s,x,y,w=320,c=RED):
    rect(d,x,y,x+w,y+65,PANEL,c,27,2);center(d,s,(x+8,y,x+w-8,y+62),34)
def card(d,s,x,y,w=635,h=275,c=GREEN,sub=""):
    rect(d,x,y,x+w,y+h,PANEL,c,20,4)
    center(d,s,(x+15,y+27,x+w-15,y+120),52)
    if sub:center(d,sub,(x+20,y+151,x+w-20,y+h-14),33,MUTED)
def arrow(d,x1,y1,x2,y2,c=GOLD):
    line(d,[(x1,y1),(x2,y2)],c,7)
    a=math.atan2(y2-y1,x2-x1);r=24
    d.polygon([(x2,y2),(x2-r*math.cos(a-.48),y2-r*math.sin(a-.48)),(x2-r*math.cos(a+.48),y2-r*math.sin(a+.48))],fill=c)
def fly(d,x,y,k=1.0,c=GOLD):
    d.ellipse((x-19*k,y-50*k,x+14*k,y+18*k),fill=c,outline=BG,width=2)
    d.ellipse((x-38*k,y-46*k,x-9*k,y-4*k),fill=PALE,outline=BLUE,width=3)
    d.ellipse((x+11*k,y-46*k,x+40*k,y-4*k),fill=PALE,outline=BLUE,width=3)
    d.ellipse((x-8*k,y+9*k,x+8*k,y+35*k),fill=RED)
    line(d,[(x-10*k,y+13*k),(x-25*k,y+37*k)],GOLD,2)
    line(d,[(x+10*k,y+13*k),(x+25*k,y+37*k)],GOLD,2)
def paramecium(d,x,y,c=GREEN,k=1.0):
    d.ellipse((x-49*k,y-20*k,x+49*k,y+20*k),fill=c,outline=PALE,width=3)
    d.ellipse((x+5*k,y-7*k,x+23*k,y+8*k),fill=PANEL2)
    for ang in range(0,360,25):
        a=math.radians(ang);xx=x+49*k*math.cos(a);yy=y+20*k*math.sin(a)
        line(d,[(xx,yy),(xx+9*k*math.cos(a),yy+9*k*math.sin(a))],c,2)
def seal(d,x,y,k=1.0,c=GREEN):
    # Original nonviolent stylized marine-mammal shape
    d.ellipse((x-92*k,y-33*k,x+72*k,y+44*k),fill=c)
    d.ellipse((x+45*k,y-81*k,x+111*k,y+10*k),fill=c)
    d.polygon([(x-85*k,y+10*k),(x-136*k,y+39*k),(x-110*k,y-5*k)],fill=c)
    d.ellipse((x+90*k,y-53*k,x+97*k,y-46*k),fill=BG)
def human(d,x,y,k=1.0,c=GREEN):
    d.ellipse((x-15*k,y-68*k,x+15*k,y-38*k),fill=CREAM)
    rect(d,x-24*k,y-32*k,x+24*k,y+50*k,c,c,12*k,1)
    line(d,[(x-14*k,y+45*k),(x-23*k,y+80*k)],c,6)
    line(d,[(x+14*k,y+45*k),(x+23*k,y+80*k)],c,6)
def axis(d):
    line(d,[(310,680),(1640,680)],MUTED,3)
    line(d,[(310,680),(310,347)],MUTED,3)
def bars(d,vals,labels,maxv=None,cols=None):
    mv=maxv or max(vals)*1.13
    n=len(vals);unit=1220/n
    for i,(v,lab) in enumerate(zip(vals,labels)):
        x=374+i*unit;bw=min(240,unit-75)
        h=300*v/mv
        d.rectangle((x,684-h,x+bw,684),fill=(cols[i] if cols else [BLUE,RED,GREEN][i%3]))
        center(d,f"{v}%",(x,681-h-75,x+bw,677-h),55,CREAM)
        center(d,lab,(x-70,699,x+bw+70,771),34,MUTED)
    axis(d)
def tree(d,st):
    for j in range(14):
        x=270+j*108
        col=[GREEN,BLUE,GOLD,RED][j%4] if st else GREEN
        line(d,[(x,680),(x,515)],(133,95,70),9)
        d.ellipse((x-42,445,x+42,535),fill=col)
def content_art(d,b,i,st):
    m=b["visual"];detail=b["callout"];part=(i%4)
    if m=="admission":
        for j in range(100):
            x=255+(j%20)*73;y=355+(j//20)*82
            d.ellipse((x-13,y-13,x+13,y+13),fill=GREEN if j<10 else (RED if st else LINE))
        badge(d,"合格 10 / 志願 100",622,735,620,RED)
    elif m in ("ranking","hierarchy"):
        for j in range(5):
            x=310+j*290
            hh=300*(5-j)/5
            rect(d,x,700-hh,x+160,700,RED if j==0 else PANEL2,RED if j==0 else LINE,9,2)
            human(d,x+80,610-hh,.55,RED if j==0 else BLUE)
        badge(d,"順位は、その競争だけの結果",655,739,610,GOLD)
    elif m in ("business","market"):
        for j in range(3):
            x=200+j*565
            rect(d,x,380,x+480,675,PANEL,[GREEN,GOLD,RED][j])
            center(d,["企業 A","企業 B","企業 C"][j],(x+10,400,x+470,503),65)
            hh=(j+1)*62 if st else 118
            d.rectangle((x+170,625-hh,x+270,625),fill=[GREEN,GOLD,RED][j])
        badge(d,"市場のルールと成果は別問題",650,720,630,RED)
    elif m=="question":
        center(d,"敗者のいない社会は可能か？",(160,375,1760,675),94,CREAM,True)
    elif m in ("spencer","timeline"):
        dates=[("1859","ダーウィン／種の起源"),("1864","スペンサー／適者生存")]
        line(d,[(310,540),(1610,540)],GOLD,9)
        for j,(yr,name) in enumerate(dates):
            x=445+j*1000
            d.ellipse((x-24,516,x+24,564),fill=RED if j else GREEN)
            center(d,yr,(x-210,337,x+210,485),101,CREAM,True)
            center(d,name,(x-250,590,x+250,690),36,MUTED)
        if st:badge(d,"自然選択  ≠  社会制度",685,735,550,RED)
    elif m=="species":
        for x,name in [(390,"ハエ"),(955,"ゾウリムシ"),(1510,"ゾウアザラシ")]:
            if x==390:
                for j in range(4):fly(d,x+(-60+j*40),500+j*19,.75)
            elif x==955:paramecium(d,x,510,GREEN,2.5)
            else:seal(d,x,560,1.1,BLUE)
            center(d,name,(x-230,655,x+230,735),43,CREAM)
    elif m in ("flies","density","resource"):
        for j in range(2):
            x=230+j*770
            rect(d,x,337,x+665,698,PANEL,GREEN if j==0 else RED,17)
            center(d,["低密度","高密度"][j],(x+10,347,x+650,435),54)
            n=[5,16][j]
            if m=="resource":n=[6,18][j]
            if st and j==1:n+=6
            for k in range(n):
                xx=x+95+(k%5)*110;yy=485+(k//5)*56
                fly(d,xx,yy,.47,GOLD if j==0 else RED)
        if st:badge(d,"混雑した環境で選択圧が変わる",670,727,650,GOLD)
    elif m=="generations":
        for j in range(8):
            x=300+j*182
            d.ellipse((x-17,478,x+17,512),fill=RED if j<5 or st else GREEN)
            if j<7:arrow(d,x+35,495,x+138,495,GOLD)
            center(d,f"{j+1}",(x-25,533,x+25,586),35,MUTED)
        center(d,"128世代" if b["chapter"]=="chapter1" else "8世代",
               (470,647,1450,767),82,CREAM,True)
    elif m=="chart58":
        bars(d,[100,158],["低密度系統／基準","高密度系統"],180,[BLUE,RED])
        if st:badge(d,"餌の消費速度  ＋58%",695,293,540,RED)
    elif m in ("genes","fitness"):
        card(d,"個体が努力した",225,364,675,280,RED,"説明としては違う")
        card(d,"世代間の選択",1020,364,675,280,GREEN,"集団の形質が変わる")
        if st:badge(d,"繁殖成功  ≠  人格的価値",710,711,540,GOLD)
    elif m=="tradeoff":
        card(d,"競争の利益",210,365,680,285,GREEN,"改良・進化・技術革新")
        card(d,"競争の代償",1030,365,680,285,RED,"淘汰・損失・衝突")
        if st:badge(d,"この二つを混同しない",700,726,520,GOLD)
    elif m in ("paramecium","separate","exclusion","niche"):
        for j in range(2):
            x=240+j*770
            rect(d,x,355,x+650,707,PANEL,[GREEN,RED][j],21)
            center(d,["Aurelia","Caudatum" if m!="niche" else "Bursaria"][j],
                   (x+10,370,x+640,435),46,CREAM)
            n=9 if (m in ("paramecium","separate") or not st) else (9 if j==0 else (1 if m=="exclusion" else 9))
            for k in range(n):
                xx=x+112+(k%3)*175;yy=492+(k//3)*80
                if m=="niche" and j==1:yy+=35
                paramecium(d,xx,yy,[GREEN,RED][j],.8)
        if m=="niche" and st:badge(d,"利用する場所が違えば共存可能",660,734,650,GREEN)
        if m=="exclusion" and st:badge(d,"競争排除／特定の培養条件",670,734,620,RED)
    elif m=="seals":
        rect(d,200,605,1720,743,(63,77,79),LINE,15,2)
        for j in range(7):
            x=340+j*205
            seal(d,x,565,1.45 if j==3 else .78,RED if j==3 else BLUE)
        if st:badge(d,"繁殖地で生じる序列",745,317,445,RED)
    elif m=="chart80":
        d.rectangle((270,415,1600,585),fill=PANEL2)
        d.rectangle((270,415,1334,585),fill=RED)
        center(d,"80%",(530,442,1000,567),105,CREAM,True)
        center(d,"20%",(1350,442,1585,567),72,CREAM)
        center(d,"調査オスの約20% → 父親特定児の約80%",
              (210,625,1700,734),52,GOLD)
        if st:badge(d,"※ 一つの調査地・標本での結果",610,302,700,RED)
    elif m=="future":
        for j in range(4):
            x=355+j*390
            seal(d,x,555,.55+j*.24,BLUE if j<3 else GREEN)
            if j<3:arrow(d,x+130,565,x+250,565,GOLD)
        center(d,"次の繁殖期へ",(540,711,1390,776),55,GREEN)
    elif m=="logic":
        card(d,"科学が説明する事実",210,350,690,310,GREEN,"何が起こるのか")
        card(d,"社会の価値判断",1020,350,690,310,RED,"何を望むのか")
        if st:badge(d,"自然＝正しい、ではない",715,719,520,GOLD)
    elif m=="matrix":
        rows=[("高密度での競争","高密度系統"),("低密度での競争","低密度系統")]
        for j,(a,z) in enumerate(rows):
            y=376+j*178
            rect(d,275,y,1650,y+148,PANEL,RED if j==0 else GREEN,15,3)
            center(d,a,(310,y+15,865,y+125),43,CREAM)
            arrow(d,865,y+75,1060,y+75,GOLD)
            center(d,z,(1060,y+15,1620,y+125),45,RED if j==0 else GREEN)
        if st:badge(d,"勝者は環境によって変わる",690,737,560,GOLD)
    elif m=="grass":
        tree(d,st)
        center(d,"単一種" if not st else "複数種の共存",(550,711,1370,775),60,CREAM)
    elif m=="chart50":
        bars(d,[50,25],["低多様性 1〜2種","高多様性 16〜32種"],60,[RED,GREEN])
        if st:badge(d,"変化幅が小さいほど安定",706,286,550,GOLD)
    elif m=="insurance":
        for j in range(2):
            x=225+j*800
            card(d,"一つの戦略" if j==0 else "複数の戦略",x,358,675,290,RED if j==0 else GREEN,
                 "変化に弱い可能性" if j==0 else "変動への保険")
        if st:badge(d,"環境変動に備える多様性",693,720,560,GOLD)
    elif m=="triad":
        labels=["競争がある","敗者が生まれる","永久に排除する"]
        for j,lab in enumerate(labels):
            x=156+j*558;card(d,lab,x,385,510,240,[GREEN,GOLD,RED][j])
        if st:badge(d,"この三つは同じではない",700,728,520,RED)
    elif m=="retry":
        card(d,"一度失敗",215,365,670,285,RED,"過去の競争の結果")
        arrow(d,900,495,1020,495,GOLD)
        card(d,"次の挑戦",1035,365,670,285,GREEN,"別の場所・別の方法")
        if st:badge(d,"未来の参加資格を奪わない",674,730,620,GOLD)
    elif m=="thesis":
        rect(d,225,355,1695,708,(38,46,55),RED,32,5)
        center(d,detail,(260,438,1660,626),78,CREAM,True)
        if st:center(d,"競争 × 環境 × 時間",(470,650,1460,735),44,GOLD)
    elif m=="ending":
        center(d,"今日の敗者が",(200,372,1710,502),89,MUTED,True)
        center(d,"明日の挑戦者になる",(190,525,1730,693),102,RED,True)
        if st:badge(d,"再挑戦できる社会",730,730,460,GREEN)
    else:card(d,"競争の仕組み",280,365,1360,285,RED,detail)
    # One semantically grounded secondary state per beat, no generic fades/slides.
    if m not in ("thesis","ending","chart58","chart80","chart50"):
        center(d,detail,(245,790,1680,837),37,GOLD)

def build_frame(b,i,stage):
    im=Image.new("RGB",(W,H),BG);d=ImageDraw.Draw(im)
    rng=random.Random(129129+i*71)
    for k in range(900):
        x=rng.randrange(W);y=rng.randrange(846);v=rng.randint(-5,5)
        d.point((x,y),fill=(17+v,23+v,31+v))
    d.rectangle((0,0,W,12),fill=RED)
    d.rectangle((0,850,W,1080),fill=(9,15,22))
    rect(d,90,57,107,120,RED,RED,4,1)
    txt(d,"考える夜  /  ECOLOGY × COMPETITION",137,70,1300,32,GOLD)
    txt(d,f"V129  {core.NUMBERS[b['chapter']]} / 07",1513,69,360,30,MUTED)
    txt(d,b["chapterTitle"],135,147,1580,40,GREEN)
    txt(d,b["headline"],132,212,1630,74,CREAM,True)
    content_art(d,b,i,stage)
    txt(d,"図表は模式図。割合は個別研究の範囲に限定。",140,1046,1370,21,MUTED)
    txt(d,f"{i+1:03d}",1767,1044,110,24,MUTED)
    return im
def prepare():
    data=compile_manuscript();beats=data["beats"];slides=[]
    for i,b in enumerate(beats):
        stages=[0,1]
        for st in stages:
            # Third state returns to a readable baseline while the narration continues.
            p=OUT/f"shot-{i:03d}-{len([x for x in slides if x['index']==i])}.png"
            build_frame(b,i,st).save(p,optimize=True)
            slides.append({"index":i,"stage":st,"path":str(p)})
    (OUT/"slides.json").write_text(json.dumps(slides,ensure_ascii=False,indent=2),encoding="utf-8")
    cols=8;cw=320;ch=180
    contact=Image.new("RGB",(cols*cw,math.ceil(len(beats)/cols)*ch),BG)
    for i in range(len(beats)):
        p=OUT/f"shot-{i:03d}-1.png"
        contact.paste(Image.open(p).resize((cw,ch),Image.Resampling.LANCZOS),
                     ((i%cols)*cw,(i//cols)*ch))
    contact.save(OUT/"v129-contact-sheet.jpg",quality=85)
    (OUT/"SOURCES.txt").write_text("\n".join(SOURCES)+"\n",encoding="utf-8")
    print("V129_STORYBOARD",len(beats),"beats",len(slides),"screen states",flush=True)
def voice():
    core.voice()
    info=json.loads((OUT/"timing.json").read_text(encoding="utf-8"))
    assert info["totalSeconds"]>=600,"Narration shorter than expected long-form; do not fabricate silent padding"
    assert len(info["beats"])==len(json.loads(core.CONTENT.read_text())["beats"])
    print("MEASURED_AUDIO",info["totalSeconds"],"subtitle cues",info["cues"],flush=True)
def render():
    core.render()
    old=OUT/"v125-black-death-economy-final.mp4"
    final=OUT/"v129-ecology-competition-final.mp4"
    old.rename(final)
    qa=json.loads((OUT/"v125-final-qa.json").read_text(encoding="utf-8"))
    qa.update({"videoId":"V129","title":"生態学から学ぶ｜なぜ敗者が社会に必要なのか？",
        "masterFile":final.name,"sceneDesign":"ecology evidence diagrams, competitive niches, evolutionary trade-offs",
        "narrationCoverage":"complete edited manuscript; normalized exact match"})
    (OUT/"v129-final-qa.json").write_text(json.dumps(qa,ensure_ascii=False,indent=2),encoding="utf-8")
    (OUT/"v125-final-qa.json").unlink(missing_ok=True)
    print("V129_MASTER_COMPLETE",json.dumps(qa,ensure_ascii=False),flush=True)
if __name__=="__main__":
    mode=sys.argv[1] if len(sys.argv)>1 else "all"
    if mode in ("compile","prepare","all"):prepare()
    if mode in ("voice","all"):voice()
    if mode in ("render","all"):render()
