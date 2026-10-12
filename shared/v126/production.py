#!/usr/bin/env python3
"""V126: 54+ semantic Aztec religion scenes, narration preserved exactly, VOICEVOX + HD master.
Artwork is explicitly original explanatory reconstruction, not claimed to be codex photography.
Uses reliable V125 measured-voice / H.264 production core with a distinct historical visual director.
"""
from pathlib import Path
import sys, math, random, re, json
from PIL import Image, ImageDraw
ROOT=Path(__file__).resolve().parent
sys.path.insert(0,str(ROOT.parent/"v125"))
import production as core

core.ROOT=ROOT
core.OUT=ROOT/"output"
core.CONTENT=ROOT/"content"/"script.json"
core.CHAPTERS=["prologue","chapter1","chapter2","chapter3","chapter4","epilogue"]
core.NUMBERS=dict(zip(core.CHAPTERS,["00","01","02","03","04","05"]))
OUT=core.OUT
W,H=1920,1080
BG=(13,23,33); MID=(30,42,48); PALE=(241,228,194); GOLD=(214,175,104)
TEAL=(87,186,172); RED=(185,60,58); BLUE=(62,110,147)
SECTION_NAMES={"prologue":"太陽が昇らなくなる夜","chapter1":"この世界は、すでに四度滅びている",
"chapter2":"人間は神々に借金をしている","chapter3":"一年間、神として生きた人間",
"chapter4":"神々によって動く国家","epilogue":"神々が生きていた世界"}
# Ordered, individual visual metaphors. Selection is proportional to exact unabridged source section,
# so visual topic develops WITH narration rather than repeating a generic six-phase template.
STORY={
"prologue":[("night","都市から消える火","新しい火の儀式"),("night","52年に一度の夜","宇宙は永遠ではない"),
 ("stars","すばるを待つ人々","天体の運行と世界の存続"),("newfire","山頂で生まれる炎","もう一度、世界が始まる"),
 ("cosmos","血と宇宙の秩序","神々への返礼")],
"chapter1":[("cycle","五つの太陽の時代","世界は繰り返し滅びる"),("cataclysm","四つの滅亡","ジャガー・風・火・洪水"),
 ("pyramid","テオティワカン","神々が集まる場所"),("twogods","太陽になる二柱の神","テクシステカトルとナナワツィン"),
 ("fire","火に身を投じた神","犠牲から光が生まれた"),("sunmoon","太陽と月の誕生","ナナワツィンとテクシステカトル"),
 ("stillsun","動かない太陽","神々はさらに命を捧げた"),("sacrifice","神々の自己犠牲","世界の始まりにある負債"),
 ("question","神々に何を返すのか","命を受け取った人間の問い")],
"chapter2":[("ledger","命の借金","神々から受け取った生命"),("offerings","返礼という義務","与える神々／応える人間"),
 ("serpent","羽毛ある蛇の神","ケツァルコアトル"),("underworld","死者の国ミクトラン","古い人類の骨を取り戻す"),
 ("bone","神の血から生まれた人類","骨と血の創造神話"),("sunmoon","毎朝昇る太陽","恩恵は繰り返される"),
 ("blood","生命の力としての血","もっとも尊い贈り物"),("offerings","血だけではない供物","花・食物・香・歌"),
 ("maguey","自分の血を捧げる儀礼","自らの身体からの返礼"),("reciprocity","世界を動かす相互関係","人間も宇宙を支える"),
 ("ixiptla","人間が神となる儀礼","神の存在を体現する")],
"chapter3":[("ixiptla","神として生きる一年","選ばれた若者"),("mirror","テスカトリポカ","煙る鏡の神"),
 ("obsidian","黒曜石の鏡","運命と神秘の象徴"),("education","神としての教育","歌・踊り・貴族の作法"),
 ("festival","人々から崇敬される","神の代理イシプトラ"),("four","四柱の女神との儀礼","祭礼の最後の二十日間"),
 ("temple","神殿へ向かう若者","神話を儀礼で繰り返す"),("reciprocity","神聖さと犠牲","神々の創造を再現する"),
 ("question","神話は行動を導く","祭礼は宇宙観の実践")],
"chapter4":[("maize","暮らしを支える宗教","雨・農耕・自然"),("rain","雨の神トラロック","恵みと災厄"),
 ("storm","雨と稲妻","豊穣と洪水は同じ神から"),("offerings","雨を祈る儀礼","神々との関係を保つ"),
 ("warriors","戦争を支える神","守護神ウィツィロポチトリ"),("mythwar","神々の戦い","コアトリクエとコヨルシャウキ"),
 ("temple","テンプロ・マヨール","首都の聖なる中心"),("twotemples","二つの神殿","太陽・戦争と雨・農耕"),
 ("moonstone","コヨルシャウキの石彫","神話が建築に刻まれる"),("warriors","戦争と祭礼","政治・貢納・捕虜"),
 ("state","宗教と国家の構造","国家の仕組みそのもの"),("afterlife","死因によって異なる行き先","太陽／トラロカン／ミクトラン"),
 ("underworld","死者の長い旅","ミクトランへの道"),("calendar","二つの暦","260日と365日"),
 ("cycle52","52年で巡る周期","暦の組合せが戻る"),("newfire","新しい火の儀式","終焉と再生の循環"),
 ("cosmos","世界を支える返礼","創造・国家・死後の世界")],
"epilogue":[("cosmos","神々が生きていた世界","太陽と雨と生命"),("ledger","神々への負債","受け取った命を返す"),
 ("temple","神々と共に暮らす","祭礼が支える生活"),("question","もしあなたが生まれていたら","信仰を生きるとは何か"),
 ("ships","1519年、海の向こうから","スペイン人たちの到来"),("cross","異なる神と世界観","十字架がやって来る"),
 ("ruins","神々が否定される時代","次回、キリスト教による宗教征服")]
}

def split_beats(raw,target=205):
    """Only segment between complete narration sentences. Every source character is preserved."""
    para=re.sub(r"\s+","",raw)
    chunks=re.findall(r"[^。！？!?]*[。！？!?]|[^。！？!?]+$",para)
    out=[]; buf=""
    for s in chunks:
        if buf and len(buf)+len(s)>target and len(buf)>=115:
            out.append(buf);buf=""
        buf+=s
    if buf:out.append(buf)
    # absorb final isolated short fragment into preceding beat
    if len(out)>1 and len(out[-1])<70:out[-2]+=out[-1];out.pop()
    assert "".join(out)==para,(len("".join(out)),len(para))
    return out

def compile_script():
    beats=[]; chapters={}
    for chapter in core.CHAPTERS:
        file=ROOT/"content"/(chapter+".txt")
        manuscript=file.read_text(encoding="utf-8")
        groups=split_beats(manuscript,target=205 if chapter!="chapter4" else 185)
        notes=STORY[chapter]
        for i,n in enumerate(groups):
            idx=min(len(notes)-1,int(i*len(notes)/max(1,len(groups))))
            mode,headline,callout=notes[idx]
            beats.append({"id":f"{chapter}-{i+1:02d}","chapter":chapter,
                "chapterTitle":SECTION_NAMES[chapter],"headline":headline,
                "visual":mode,"callout":callout,"narration":n})
        chapters[chapter]={"characters":len(re.sub(r"\s+","",manuscript)),"beats":len(groups)}
    data={"videoId":"V126","title":"人類は神に命の借金をしている。古代アステカの知られざる宗教観【前編】",
          "version":"final-1","voice":{"speaker":13,"speed":1.15},"chapterAudit":chapters,
          "sources":["Sahagún, Florentine Codex, Books 2, 3 and 7 (Getty Research Institute online edition)",
          "INAH Museo del Templo Mayor: Huitzilopochtli, Tlaloc and Templo Mayor",
          "Historia de los mexicanos por sus pinturas / Leyenda de los Soles (Nahua creation traditions)",
          "Matos Moctezuma, Templo Mayor (archaeological interpretation)",
          "Illustrations: newly created explanatory reconstructions, not reproductions of original codices."],
          "beats":beats}
    OUT.mkdir(exist_ok=True)
    core.CONTENT.write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding="utf-8")
    assert sum(len(b["narration"]) for b in beats)>9500
    print("EXACT_SCRIPT_COMPILED",chapters,"scenes",len(beats),flush=True)
    return data

def label(d,s,xy,size=48,color=PALE,serif=False,width=1400):
    f=core.fit_text(d,s,width,size,24,serif)
    d.text(xy,s,font=f,fill=color)
def straight(d,pts,color=GOLD,w=7):d.line(pts,fill=color,width=w,joint="curve")
def circle(d,x,y,r,fill=None,outline=GOLD,w=5):d.ellipse((x-r,y-r,x+r,y+r),fill=fill,outline=outline,width=w)
def flame(d,x,y,k=1,col=RED):
    p=[(x-60*k,y+85*k),(x-41*k,y+9*k),(x-8*k,y-50*k),(x+1*k,y+25*k),
       (x+34*k,y-93*k),(x+67*k,y+19*k),(x+50*k,y+91*k)]
    d.polygon(p,fill=col)
    if k>=.5:d.polygon([(x-15*k,y+65*k),(x+7*k,y-4*k),(x+25*k,y+65*k)],fill=GOLD)
def sun(d,x,y,r=145,moon=False):
    if not moon:
        for j in range(16):
            a=j*math.tau/16
            straight(d,[(x+math.cos(a)*(r+17),y+math.sin(a)*(r+17)),
                        (x+math.cos(a)*(r+51),y+math.sin(a)*(r+51))],GOLD,7)
    circle(d,x,y,r,fill=(191,151,79) if not moon else (174,191,193),outline=GOLD,w=9)
    circle(d,x,y,r*.68,outline=BG,w=4)
    if moon:circle(d,x+43,y-32,r*.82,fill=BG,outline=None,w=0)
def temple(d,x,y,scale=1,steps=7,dual=False):
    base=530*scale;top=175*scale;h=360*scale
    for j in range(steps):
        t=j/max(1,steps-1);wide=base*(1-t)+top*t;yy=y-j*(h/steps)
        d.rectangle((x-wide/2,yy,x+wide/2,yy+h/steps+7),fill=(87+int(57*t),79+int(54*t),69+int(47*t)),outline=GOLD,width=3)
    roofy=y-h-27*scale
    d.rectangle((x-116*scale,roofy,x+116*scale,roofy+65*scale),fill=RED,outline=GOLD,width=5)
    if dual:
        d.rectangle((x-100*scale,roofy-85*scale,x-9*scale,roofy),fill=TEAL)
        d.rectangle((x+9*scale,roofy-85*scale,x+100*scale,roofy),fill=RED)
def figurine(d,x,y,scale=1,halo=False):
    r=32*scale
    circle(d,x,y-130*scale,r,fill=GOLD,outline=GOLD)
    d.polygon([(x-62*scale,y-80*scale),(x+62*scale,y-80*scale),
              (x+91*scale,y+94*scale),(x-90*scale,y+94*scale)],fill=TEAL,outline=GOLD)
    straight(d,[(x-44*scale,y+85*scale),(x-71*scale,y+167*scale)],GOLD,10)
    straight(d,[(x+44*scale,y+85*scale),(x+71*scale,y+167*scale)],GOLD,10)
    if halo:circle(d,x,y-90*scale,125*scale,outline=GOLD,w=7)
def drop(d,x,y,scale=1):
    p=[(x,y-100*scale),(x-62*scale,y+12*scale),(x-49*scale,y+72*scale),
       (x,y+98*scale),(x+49*scale,y+72*scale),(x+62*scale,y+12*scale)]
    d.polygon(p,fill=RED)
def glyph(d,x,y,t=0):
    for k in range(5):
        a=(k+t)*math.tau/5
        circle(d,x+math.cos(a)*44,y+math.sin(a)*44,16,fill=GOLD,outline=None,w=0)
    circle(d,x,y,22,fill=RED,outline=None,w=0)
def arrow(d,start,end,c=TEAL,width=9):
    straight(d,[start,end],c,width)
    a=math.atan2(end[1]-start[1],end[0]-start[0])
    p1=(end[0]-30*math.cos(a-.45),end[1]-30*math.sin(a-.45))
    p2=(end[0]-30*math.cos(a+.45),end[1]-30*math.sin(a+.45))
    d.polygon([end,p1,p2],fill=c)
def moon_disk(d,x,y,r=175):
    circle(d,x,y,r,fill=(83,99,113),outline=GOLD,w=9)
    for j in range(8):
        a=j*math.tau/8
        circle(d,x+math.cos(a)*r*.7,y+math.sin(a)*r*.7,12,fill=GOLD,outline=None,w=0)
def art(d,mode,stage,idx):
    """Distinct visual grammars; all primary shapes within y 290..810, leaving subtitle lane untouched."""
    cx,cy=1000,545
    n=stage+1
    if mode in ("night","newfire"):
        for j in range(15):
            x=100+j*122;h=130+(j*57)%170
            d.rectangle((x,730-h,x+95,735),fill=MID,outline=(60,72,71),width=3)
            for xx in range(x+18,x+77,29):
                for yy in range(750-h,718,46):
                    if (j+xx+yy)%4==0 and (mode=="newfire" or stage==0):d.rectangle((xx,yy,xx+11,yy+12),fill=GOLD)
        if mode=="night":
            for j in range(65):
                x=180+(j*239)%1540;y=304+(j*89)%260
                circle(d,x,y,1.5,fill=PALE,outline=None,w=0)
            if stage>0:label(d,"すべての火を消す", (665,420),65,TEAL,True,850)
        else:
            d.polygon([(480,754),(970,345),(1450,754)],fill=(60,76,75),outline=GOLD)
            flame(d,985,450,.8 if stage==0 else 1.2)
            if stage==2:
                for x in range(240,1600,130):flame(d,x,747,.21,GOLD)
    elif mode=="stars":
        rng=random.Random(55)
        pts=[(rng.randint(250,1700),rng.randint(315,728)) for _ in range(48)]
        for x,y in pts:circle(d,x,y,3,fill=PALE,outline=None,w=0)
        key=[(690,415),(785,488),(930,466),(1050,550),(1180,510),(1320,575)]
        for j,(x,y) in enumerate(key):
            circle(d,x,y,10 if stage else 7,fill=TEAL,outline=None,w=0)
            if j and stage>0:straight(d,[key[j-1],key[j]],TEAL,5)
        label(d,"すばる / 天のしるし",(650,665),52,GOLD,True,780)
    elif mode in ("cycle","cycle52","calendar"):
        if mode=="calendar":
            circle(d,950,540,210,outline=GOLD,w=16);circle(d,950,540,130,outline=TEAL,w=13)
            label(d,"260日",(560,492),73,TEAL,True,280)
            label(d,"365日",(1320,492),73,GOLD,True,310)
            if stage>=1:label(d,"2つの暦が同時に巡る",(560,762),45,PALE,False,900)
        elif mode=="cycle52":
            for j in range(52):
                a=j*math.tau/52
                circle(d,960+math.cos(a)*220,537+math.sin(a)*220,5 if j%4 else 12,
                       fill=GOLD if j<=stage*17 else TEAL,outline=None,w=0)
            label(d,"52",(825,450),143,PALE,True,320)
            label(d,"年",(1000,518),74,GOLD,True,120)
        else:
            for j in range(5):
                x=340+j*306
                sun(d,x,512,82,moon=False)
                if j<4 and stage>0:d.line([(x-35,490),(x+36,551)],fill=RED,width=11)
                label(d,str(j+1),(x-17,652),56,GOLD,True,100)
            label(d,"五番目の太陽の時代",(635,755),48,PALE,True,730)
    elif mode=="cataclysm":
        terms=["ジャガー","風","火","洪水"]
        for j,t in enumerate(terms):
            x=205+j*396
            d.rounded_rectangle((x,372,x+330,665),radius=22,fill=MID,outline=GOLD,width=4)
            label(d,t,(x+57,475),60,GOLD if j<=stage else PALE,True,265)
            circle(d,x+165,407,16,fill=RED if j<=stage else TEAL,outline=None,w=0)
    elif mode in ("pyramid","temple","twotemples","ruins"):
        temple(d,960,780,.92,dual=mode=="twotemples")
        if mode=="pyramid":sun(d,960,352,85)
        if mode=="ruins" and stage>0:
            d.polygon([(530,780),(580,600),(750,705),(960,780)],fill=BG)
            d.polygon([(1080,780),(1340,640),(1480,780)],fill=BG)
        if stage>=1 and mode=="twotemples":
            label(d,"ウィツィロポチトリ",(208,428),48,RED,False,550)
            label(d,"トラロック",(1350,428),52,TEAL,False,410)
    elif mode in ("twogods","fire","sacrifice"):
        figurine(d,590,545,.94); figurine(d,1330,545,.94)
        flame(d,950,505,1.2)
        if stage>0:
            sun(d,960,374,77)
            label(d,"神々が自らを捧げる",(690,740),45,PALE,False,720)
    elif mode in ("sunmoon","stillsun"):
        sun(d,700,513,170)
        sun(d,1290,519,125,moon=True)
        if mode=="stillsun":
            straight(d,[(955,360),(955,700)],RED,10)
            if stage>0:label(d,"太陽が動かない",(758,755),55,RED,True,600)
        else:
            if stage>0:arrow(d,(925,390),(1100,375),TEAL,8)
    elif mode in ("ledger","reciprocity","state"):
        d.rounded_rectangle((255,345,805,710),radius=24,fill=MID,outline=TEAL,width=5)
        d.rounded_rectangle((1110,345,1660,710),radius=24,fill=MID,outline=GOLD,width=5)
        figurine(d,530,528,.62);sun(d,1380,525,96)
        if stage>0:
            arrow(d,(855,440),(1045,440),TEAL)
            arrow(d,(1045,623),(855,623),RED)
        label(d,"人間",(451,707),45,TEAL,True,220)
        label(d,"神々",(1301,707),45,GOLD,True,220)
    elif mode in ("serpent","underworld","bone"):
        if mode=="serpent":
            for k in range(11):
                a=k*.62
                x=450+k*105;y=530+math.sin(a)*145
                circle(d,x,y,43,fill=TEAL if k%2 else GOLD,outline=PALE,w=3)
            d.polygon([(1570,450),(1660,510),(1570,550)],fill=GOLD)
        elif mode=="bone":
            for j in range(6):
                x=490+j*170
                d.rounded_rectangle((x,492+(j%2)*28,x+110,565+(j%2)*28),radius=29,fill=PALE,outline=GOLD,width=5)
            if stage>0:drop(d,981,360,.75)
        else:
            for j in range(5):
                x=315+j*302;y=550+math.sin(j)*85
                circle(d,x,y,75,fill=MID,outline=GOLD,w=5)
                if j>0:straight(d,[(x-210,y-10),(x-70,y-10)],TEAL,6)
            label(d,"ミクトラン",(835,725),70,PALE,True,520)
    elif mode in ("blood","maguey"):
        drop(d,960,505,1.7)
        for a in [-60,-30,0,30,60]:
            x=960+a*5
            if mode=="maguey":straight(d,[(x,744),(960+a*3,470)],TEAL,12)
            else:circle(d,x,725,18,fill=GOLD,outline=None,w=0)
    elif mode=="offerings":
        d.polygon([(480,698),(1420,698),(1300,748),(610,748)],fill=GOLD)
        for x in [660,910,1170]:glyph(d,x,535,x/100)
        if stage>0:
            for j in range(7):
                x=830+j*28
                d.arc((x,315,x+100,533),170,275,fill=PALE,width=4)
    elif mode=="mirror" or mode=="obsidian":
        d.ellipse((645,320,1290,754),fill=(4,11,21),outline=GOLD,width=26)
        for r in [75,125,175]:
            d.arc((950-r,540-r,950+r,540+r),20+stage*12,145+stage*12,fill=TEAL,width=6)
        if stage>0:drop(d,960,520,.5)
    elif mode in ("ixiptla","education","four"):
        figurine(d,970,525,1.3,halo=mode!="education")
        if mode=="education":
            for k in range(4):
                x=450+k*320
                circle(d,x,736,34,fill=GOLD if k<=stage else MID,outline=GOLD,w=3)
        if mode=="four":
            for k in range(4):
                x=430+k*348
                glyph(d,x,695,k)
    elif mode=="festival":
        temple(d,960,750,.76)
        for x in range(270,1600,110):figurine(d,x,736,.28)
    elif mode in ("maize","rain","storm"):
        for x in range(300,1650,150):
            straight(d,[(x,775),(x,470+(x%80))],TEAL,9)
            for k in range(3):
                y=540+k*70
                d.ellipse((x-52,y-16,x-2,y+11),fill=GOLD)
                d.ellipse((x+2,y-28,x+50,y+10),fill=GOLD)
        if mode!="maize":
            for j in range(18):
                x=300+j*76
                straight(d,[(x,340),(x-42,450)],BLUE,6)
        if mode=="storm":straight(d,[(1140,360),(1040,495),(1110,495),(1020,700)],RED,15)
    elif mode in ("warriors","mythwar"):
        for k,x in enumerate([540,950,1360]):
            figurine(d,x,557,.9)
            straight(d,[(x+100,330),(x+100,729)],GOLD,12)
            d.polygon([(x+100,318),(x+75,398),(x+125,398)],fill=RED)
            circle(d,x-100,607,70,fill=MID,outline=TEAL,w=12)
        if mode=="mythwar" and stage>0:moon_disk(d,950,420,88)
    elif mode=="moonstone":moon_disk(d,960,545,210)
    elif mode=="afterlife":
        for j,(t,c) in enumerate([("太陽",GOLD),("トラロカン",TEAL),("ミクトラン",BLUE)]):
            x=240+j*550
            d.rounded_rectangle((x,378,x+480,675),radius=20,fill=MID,outline=c,width=7)
            label(d,t,(x+40,493),66,c,True,420)
    elif mode=="cosmos":
        sun(d,960,492,120)
        nodes=[(480,550),(750,730),(1175,730),(1460,550),(960,315)]
        for j,(x,y) in enumerate(nodes):
            circle(d,x,y,45,fill=TEAL if j%2 else RED,outline=GOLD,w=5)
            if stage>0:straight(d,[(960,494),(x,y)],GOLD,3)
    elif mode=="ships":
        d.polygon([(450,690),(1510,690),(1370,780),(640,780)],fill=(75,85,84),outline=GOLD)
        for x in [785,1190]:
            straight(d,[(x,390),(x,705)],PALE,13)
            d.polygon([(x+16,395),(x+250,545),(x+16,545)],fill=PALE)
    elif mode=="cross":
        straight(d,[(960,335),(960,748)],GOLD,40)
        straight(d,[(760,481),(1160,481)],GOLD,40)
        if stage>0:label(d,"1519",(1450,670),65,RED,True,250)
    else:
        label(d,"？",(821,389),226,GOLD,True,370)
        if stage>0:circle(d,960,540,220,outline=TEAL,w=8)

def make_slide(beat,idx,stage):
    im=Image.new("RGB",(W,H),BG);d=ImageDraw.Draw(im)
    rng=random.Random(26000+idx*131)
    for j in range(2300):
        x=rng.randint(0,W-1);y=rng.randint(0,857)
        c=(34+j%12,43+j%12,46+j%12)
        d.point((x,y),fill=c)
    d.rectangle((0,0,W,12),fill=GOLD)
    for k in range(31):
        x=33+k*62
        d.line([(x,42),(x+23,54),(x+46,42)],fill=(68,83,82),width=3)
        d.line([(x,832),(x+23,820),(x+46,832)],fill=(68,83,82),width=3)
    d.rectangle((0,860,W,H),fill=(5,10,17))
    d.rectangle((88,75,100,154),fill=RED)
    label(d,"考える夜    /    古代アステカの宗教観",(133,85),37,GOLD,False,1200)
    label(d,"前編",(1652,85),35,TEAL,True,180)
    chap=beat["chapterTitle"]
    label(d,chap,(148,165),45,TEAL,False,1550)
    headline=beat["headline"]
    label(d,headline,(146,219),76,PALE,True,1565)
    art(d,beat["visual"],stage,idx)
    # source-specific callout occupies a dedicated visual lane not shared by primary scene art
    if stage==2:
        d.rounded_rectangle((260,720,1660,804),radius=17,fill=(10,20,28),outline=GOLD,width=3)
        label(d,beat["callout"],(305,733),55,PALE,False,1310)
    elif stage==1:
        d.line([(330,794),(1590,794)],fill=TEAL,width=5)
    # all scene graphics end at 810, subtitles occupy y>=860
    label(d,"神話と儀礼の再現模式図  |  史料の原図そのものではありません",(124,1033),24,(139,142,140),False,1140)
    label(d,f"{idx+1:02d}",(1760,1032),24,(151,144,136),True,100)
    return im

def prepare():
    data=compile_script()
    b=data["beats"];slides=[]
    for i,beat in enumerate(b):
        for stage in range(3):
            p=OUT/f"shot-{i:03d}-{stage}.png"
            make_slide(beat,i,stage).save(p,optimize=True)
            slides.append({"index":i,"stage":stage,"path":str(p)})
    (OUT/"slides.json").write_text(json.dumps(slides,ensure_ascii=False,indent=2),encoding="utf-8")
    # Full QA contact sheet: scene-specific middle states, arranged 8 columns.
    cols=8;rows=math.ceil(len(b)/cols);tw,th=320,180
    sheet=Image.new("RGB",(cols*tw,rows*th),(10,20,25))
    for i in range(len(b)):
        img=Image.open(OUT/f"shot-{i:03d}-1.png")
        sheet.paste(img.resize((tw,th),Image.Resampling.LANCZOS),((i%cols)*tw,(i//cols)*th))
    sheet.save(OUT/"v126-contact-sheet.jpg",quality=90)
    print("READY",len(b),"unique narrated meaning scenes",len(slides),"visual stages",flush=True)

def render():
    core.render()
    old=OUT/"v125-black-death-economy-final.mp4"
    new=OUT/"v126-aztec-cosmology-final.mp4"
    old.rename(new)
    q=OUT/"v125-final-qa.json"
    data=json.loads(q.read_text(encoding="utf-8"))
    data.update({"videoId":"V126","title":"人類は神に命の借金をしている。古代アステカの知られざる宗教観【前編】",
        "complete":True,"artworkProvenance":"original explanatory illustrations"})
    (OUT/"v126-final-qa.json").write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding="utf-8")
    q.unlink()
    print("V126_RELEASE_READY",data,flush=True)

if __name__=="__main__":
    mode=sys.argv[1] if len(sys.argv)>1 else "prepare"
    if mode=="prepare":prepare()
    elif mode=="voice":
        if not core.CONTENT.exists():compile_script()
        core.voice()
    elif mode=="render":render()
    elif mode=="compile":compile_script()
    else:raise SystemExit(f"unknown mode: {mode}")
