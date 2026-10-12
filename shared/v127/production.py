#!/usr/bin/env python3
"""V127 | Ancient Aztec religion, sequel: Spanish conquest and evangelization.
Original diagram-led art, not fabricated historical photographs.
Production uses the VOICEVOX/FFmpeg evidence-checked engine from V125.
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
core.CHAPTERS=["prologue"]+[f"chapter{i}" for i in range(1,7)]+["epilogue"]
core.NUMBERS={c:f"{i:02d}" for i,c in enumerate(core.CHAPTERS)}
OUT=core.OUT
W,H=1920,1080
BG=(14,22,31); PAPER=(236,218,180); INK=(30,35,41)
MID=(39,52,62); RED=(190,56,51); GOLD=(209,164,89); TURQ=(91,179,169)
PALE=(245,239,223); SLATE=(98,113,121); ORANGE=(227,120,69)
NAMES={"prologue":"神々を殺すにはどうすればいいのか",
"chapter1":"まず、相手の神を悪魔にします",
"chapter2":"神殿を壊し、都市の記憶を書き換える",
"chapter3":"子どもを教育すれば、神々は消えていく",
"chapter4":"信仰の自由は、正しい神を選ぶ自由です",
"chapter5":"神だけでなく、結婚の仕方まで変えます",
"chapter6":"古い神々は、本当に消えたのでしょうか",
"epilogue":"500年後、メキシコ人の神は誰になったのか"}
# Deliberately ordered as arguments advance, rather than looping generic animation modes.
PLANS={
"prologue":[("city","1521年8月13日","テノチティトラン陥落"),
 ("collapse","帝国の政治的中心が失われる","武力による征服"),
 ("pantheon","それでも神々は残る","太陽・雨・生と死"),
 ("memory","神殿を壊しても","信仰は人々の中に生きる"),
 ("sequence","征服の次に行うこと","神殿→教育→制度"),
 ("two-claims","救済という名の正義","破壊は善行に変わる")],
"chapter1":[("map","1519年、コルテス上陸","海岸から内陸へ"),
 ("city","湖上都市テノチティトラン","神殿・市場・水路"),
 ("alliance","先住民勢力との同盟","トラスカラ人の政治的利害"),
 ("cross","唯一の神","征服者たちの宗教"),
 ("pantheon","複数の神々","太陽・雨・運命・創造"),
 ("binary","誰が本当の神か","神聖と偶像の境界"),
 ("labels","偶像・邪教・悪魔崇拝","征服者による宗教的定義"),
 ("sacrifice","人身供犠への嫌悪","征服の正当化"),
 ("two-claims","犠牲は双方の宗教にある","しかし意味は異なる"),
 ("binary","正義の定義を奪う","他者の神を悪魔と呼ぶ"),
 ("mission","大義名分が完成する","布教と権力の結合")],
"chapter2":[("ceremony","1520年、トシュカトル祭","神聖な儀礼の最中"),
 ("assault","祭礼を襲った兵士たち","動機には史料上の相違"),
 ("sources","スペイン側と先住民側","記録の食い違い"),
 ("siege","1521年、都市陥落","包囲戦の末"),
 ("temple","テンプロ・マヨール","太陽と雨の神殿"),
 ("replacement","旧宗教の聖地が変わる","都市空間の上書き"),
 ("cathedral","現在のメキシコシティ","神殿遺構と大聖堂"),
 ("codices","神々の記録が焼かれる","絵文書・暦・記憶"),
 ("memory","建物は壊せても","信仰は人間の内側に残る"),
 ("sequence","次は人間を変える","都市→教育")],
"chapter3":[("friars","1524年、十二人の修道士","フランシスコ会の布教"),
 ("baptism","洗礼と宣教","新しい宗教の制度"),
 ("school","将来の指導者に教える","有力者の子どもが対象"),
 ("heir","後継者への教育","1524年のコルテスの命令"),
 ("binary","何が善で、何が罪か","教義の刷り込み"),
 ("idols","祖先の神像を破壊する","改宗した先住民の子どもたち"),
 ("family","親と子の世界が分かれる","信仰の世代間断絶"),
 ("generation","次の世代が受け継がない","宗教的記憶の断絶"),
 ("question","神を殺す別の方法","次世代に信じさせない"),
 ("watch","信仰を続ける人々","取り締まりへ移る")],
"chapter4":[("year1539","1539年、テスココ","ドン・カルロスの裁判"),
 ("document","宗教裁判の告発記録","慣習・政治・婚姻をめぐる訴え"),
 ("trial","信仰と統治の接続","宗教的異端と政治的反発"),
 ("sentence","1539年11月30日","ドン・カルロスは火刑に処された"),
 ("justice","誰が正義を決めるのか","供犠と宗教裁判は別の制度"),
 ("exception","例外的な事件","すべての先住民の典型ではない"),
 ("jurisdiction","1571年の制度変更","正式異端審問所の管轄外"),
 ("watch","宗教的取り締まりは続く","司教などによる監督"),
 ("faith","洗礼と心の中の信仰","一致するとは限らない"),
 ("sequence","次は家庭の内部へ","生活習慣を変える")],
"chapter5":[("household","宗教は結婚まで定義する","暮らしの規則"),
 ("marriage","婚姻制度の違い","従来の慣習と教会の規則"),
 ("family","誰が正式な配偶者か","一夫一婦を原則とする"),
 ("document","新しい規則が生活を動かす","教会の婚姻制度"),
 ("case","1558年、フアナ・ソチトル","研究に残る悲劇"),
 ("power","宗教的規則と生活上の苦難","規則は結果の全責任を意味しない"),
 ("population","植民地の混血社会","婚姻・婚外関係・性暴力"),
 ("status","出自と社会的地位","新しい植民地秩序"),
 ("caution","単一の混血計画ではない","歴史的背景を区別する"),
 ("generation","家族制度が世代を超える","古い習慣が受け継がれない"),
 ("sequence","なお残る古い信仰","信仰の内面は見えない")],
"chapter6":[("church","16世紀後半の布教","教会と修道院の増加"),
 ("faith","外見と内面は違う","本当に改宗したのか"),
 ("scholar","サアグンと先住民の知識人","言語と宗教儀礼の研究"),
 ("hill","テペヤックの丘","母なる神格トナンツィン"),
 ("mary","聖母グアダルーペ","トナンツィンという呼び名"),
 ("faith","宣教師が抱いた疑念","古い信仰は残っているか"),
 ("caution","単純な置換では説明できない","学説が分かれる"),
 ("codices","フィレンツェ絵文書","ナワ人の知識の記録"),
 ("archive","宗教を消そうとして記録した","歴史の皮肉"),
 ("two-claims","残った文化と失われた自由","同時に存在する事実")],
"epilogue":[("church","500年後のメキシコ","現在のキリスト教"),
 ("poll2024","2024年・成人への調査","カトリック67％／プロテスタント9％"),
 ("poll2020","2020年・国勢調査","キリスト教系 約89％"),
 ("caution","別の調査は単純比較できない","対象・方法・年次の差"),
 ("montage","神殿・教育・裁判・婚姻","数世代にわたる変化"),
 ("faith","現在の信仰を否定しない","歴史の暴力とは区別する"),
 ("power","救済を掲げた権力","布教は弾圧も伴った"),
 ("question","統計に表れないもの","信仰の自由を失った人々"),
 ("two-claims","拡大と喪失","同じ歴史の表と裏")]
}
SOURCES=[
"Bernardino de Sahagún and Nahua collaborators, Florentine Codex, Book XII and Book II (Getty Research Institute).",
"INAH: Museo del Templo Mayor — sacred precinct, archaeology and Christian colonial city.",
"Patricia Lopes Don, Bonfires of Culture: Franciscans, Indigenous Leaders, and the Inquisition in Early Mexico, 1524-1540 (2010).",
"Ryan Dominic Crewe, The Mexican Mission: Indigenous Reconstruction and Mendicant Enterprise in New Spain, 1521–1600 (2019).",
"Lisa Sousa, The Woman Who Turned Into a Jaguar, and Other Narratives of Native Women in Archives of Colonial Mexico (2017).",
"Pew Research Center (2026 report on 2024 survey), religious affiliation among Mexican adults.",
"INEGI, Censo de Población y Vivienda 2020, religious affiliation.",
"Art: explanatory, original symbolic infographics; historical source images not falsely presented as originals."
]
def compact(s):
    return re.sub(r"\s+","",s).replace("**","")
def split_beats(raw,target=185):
    s=compact(raw)
    sentences=re.findall(r"[^。！？!?]*[。！？!?]|[^。！？!?]+$",s)
    beats=[];buf=""
    for part in sentences:
        if buf and len(buf)+len(part)>target and len(buf)>95:
            beats.append(buf);buf=""
        buf+=part
    if buf:beats.append(buf)
    if len(beats)>1 and len(beats[-1])<70:
        beats[-2]+=beats.pop()
    assert "".join(beats)==s
    return beats
def compile_script():
    beats=[];audit={}
    for ch in core.CHAPTERS:
        raw=(ROOT/"content"/(ch+".txt")).read_text(encoding="utf-8")
        paragraphs=split_beats(raw,175 if ch!="epilogue" else 190)
        plans=PLANS[ch]
        for i,s in enumerate(paragraphs):
            j=min(len(plans)-1,int((i+.35)*len(plans)/len(paragraphs)))
            mode,headline,callout=plans[j]
            beats.append({"id":f"{ch}-{i+1:02d}","chapter":ch,"chapterTitle":NAMES[ch],
                "visual":mode,"headline":headline,"callout":callout,"narration":s})
        audit[ch]={"characters":len(compact(raw)),"scenes":len(paragraphs)}
    assert sum(d["characters"] for d in audit.values())>11000
    data={"videoId":"V127","title":"キリスト教はいかにアステカの神と文化を破壊したのか？【後編】",
        "speaker":13,"speed":1.15,"chapterAudit":audit,"sources":SOURCES,"beats":beats}
    OUT.mkdir(exist_ok=True)
    core.CONTENT.write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding="utf-8")
    print("V127_MANUSCRIPT_FULL_COVERAGE",audit,"scenes",len(beats),flush=True)
    return data

def ln(d,p,c=GOLD,w=6):d.line(p,fill=c,width=w,joint="curve")
def rect(d,xy,fill=MID,outline=GOLD,wd=3,r=18):
    d.rounded_rectangle(xy,radius=r,fill=fill,outline=outline,width=wd)
def text(d,s,x,y,size=48,color=PALE,serif=False,width=1350):
    f=core.fit_text(d,s,width,size,22,serif)
    d.text((x,y),s,font=f,fill=color)
def center(d,s,x,y,w,size=56,color=PALE,serif=False):
    f=core.fit_text(d,s,w-30,size,22,serif)
    bb=d.textbbox((0,0),s,font=f)
    d.text((x+(w-(bb[2]-bb[0]))/2,y),s,font=f,fill=color)
def roundel(d,x,y,r,c=GOLD,fill=None,wd=7):
    d.ellipse((x-r,y-r,x+r,y+r),fill=fill,outline=c,width=wd)
def person(d,x,y,s=1,col=TURQ):
    roundel(d,x,y-110*s,30*s,GOLD,PALE,2)
    d.polygon([(x-55*s,y-65*s),(x+55*s,y-65*s),
       (x+65*s,y+88*s),(x-65*s,y+88*s)],fill=col)
    ln(d,[(x-26*s,y+80*s),(x-33*s,y+135*s)],GOLD,8)
    ln(d,[(x+26*s,y+80*s),(x+33*s,y+135*s)],GOLD,8)
def temple(d,x=960,y=765,k=1):
    for j in range(6):
        wide=(600-j*80)*k; yy=y-j*61*k
        d.rectangle((x-wide/2,yy,x+wide/2,yy+67*k),fill=(79+int(j*12),70+int(j*11),63+int(j*9)),outline=GOLD,width=4)
    d.rectangle((x-120*k,y-425*k,x+120*k,y-340*k),fill=RED,outline=GOLD,width=6)
def cross(d,x,y,k=1,col=PALE):
    ln(d,[(x,y-150*k),(x,y+150*k)],col,int(22*k))
    ln(d,[(x-100*k,y-45*k),(x+100*k,y-45*k)],col,int(22*k))
def sun(d,x,y,r=116):
    roundel(d,x,y,r,GOLD,(160,85,41),7)
    for j in range(16):
        a=j*math.tau/16
        ln(d,[(x+math.cos(a)*(r+14),y+math.sin(a)*(r+14)),
              (x+math.cos(a)*(r+45),y+math.sin(a)*(r+45))],GOLD,5)
def scroll(d,x1=500,y1=340,x2=1430,y2=755):
    rect(d,(x1,y1,x2,y2),PAPER,(129,93,60),5,8)
    for j in range(8):
        y=y1+75+j*32
        ln(d,[(x1+110,y),(x2-90-(j%4)*105,y)],(153,122,91),4)
    roundel(d,x2-145,y2-85,50,RED,RED,3)
def scene(d,mode,stage,idx):
    # Primarily drawn within 335..830: the subtitle zone is reserved at 862..1025.
    if mode=="city":
        d.rectangle((115,725,1805,824),fill=(31,69,78))
        for j in range(20):
            x=170+j*82; h=45+(j*59)%125
            d.rectangle((x,710-h,x+65,718),fill=(108,97,77),outline=GOLD,width=2)
        temple(d,1060,750,.76)
        if stage: text(d,"湖上の巨大都市",(255,380),56,GOLD,True,690)
    elif mode in ("collapse","siege","assault"):
        temple(d,960,760,1)
        if mode!="siege":
            for j in range(7):
                x=360+j*190; d.polygon([(x,805),(x+48,716),(x+115,806)],fill=(56,62,67))
            if stage: ln(d,[(465,404),(1460,708)],RED,18)
        else:
            for j in range(12):
                x=250+j*125; person(d,x,727,.27,RED if j%2 else TURQ)
            if stage: roundel(d,956,506,214,RED,None,12)
    elif mode in ("pantheon","binary","two-claims","labels"):
        names=([("太陽","ウィツィロポチトリ"),("雨","トラロック"),("運命","テスカトリポカ"),("羽毛ある蛇","ケツァルコアトル")]
               if mode=="pantheon" else [("征服者の正義","唯一の神"),("先住民の信仰","古来の神々")])
        if mode=="labels":names=[("征服者による定義","偶像・邪教・悪魔"),("先住民にとって","祖先の神々")]
        if mode=="two-claims":names=[("布教・救済","正義とされた行為"),("信仰・文化","失われた自由")]
        for j,(a,b) in enumerate(names):
            cols=4 if len(names)==4 else 2
            w=370 if cols==4 else 705
            x=170+j*(395 if cols==4 else 825)
            rect(d,(x,414,x+w,722),MID,GOLD if j%2==0 else RED,5)
            center(d,a,x,450,w,49,TURQ if j%2==0 else GOLD,True)
            center(d,b,x,549,w,55,PALE)
            if stage:roundel(d,x+w-48,453,10,RED,RED,3)
    elif mode in ("memory","faith","question"):
        head=(830,350,1190,750)
        d.ellipse(head,fill=(73,80,78),outline=GOLD,width=10)
        for j in range(23):
            a=j*2.399963
            x=1010+math.cos(a)*(50+j*5);y=526+math.sin(a)*(35+j*5)
            roundel(d,x,y,7,RED if j%3==0 else TURQ,GOLD if stage else MID,1)
        if mode=="faith":
            center(d,"洗礼",(195),492,370,69,PALE,True)
            center(d,"内面の信仰",1330,492,410,55,GOLD,True)
        if mode=="question" and stage: center(d,"誰が正義を決める？",420,754,1080,66,RED,True)
    elif mode=="sequence" or mode=="montage" or mode=="generation":
        entries=(["神殿","学校","裁判","家庭"] if mode=="sequence" else
                 ["祖父母の世代","親の世代","子の世代","次の世代"] if mode=="generation" else
                 ["征服","神殿破壊","宗教教育","宗教裁判"])
        for j,e in enumerate(entries):
            x=155+j*414
            rect(d,(x,458,x+355,665),MID,GOLD if j<=stage+1 else SLATE,4)
            center(d,e,x,518,355,48,PALE,True)
            if j<3:
                ln(d,[(x+355,562),(x+406,562)],RED,9)
        center(d,"支配は社会の内部へ広がる",450,745,1100,45,TURQ)
    elif mode=="map":
        d.polygon([(260,695),(450,425),(750,410),(840,555),(1100,500),
                   (1220,650),(1490,742)],fill=(76,95,81),outline=GOLD)
        ln(d,[(385,500),(705,570),(1000,580),(1330,710)],RED,9)
        for x,y,label in [(420,495,"海岸"),(1010,580,"内陸"),(1320,705,"首都")]:
            roundel(d,x,y,15,PALE,RED,4);text(d,label,x-40,y+34,35,PALE,False,140)
    elif mode=="alliance":
        for j,(x,c,t) in enumerate([(410,GOLD,"スペイン人"),(920,TURQ,"トラスカラ人"),(1430,RED,"アステカ帝国")]):
            person(d,x,540,1.0,c);center(d,t,x-190,728,380,48,PALE)
        if stage:
            ln(d,[(510,560),(825,560)],TURQ,12)
            ln(d,[(1020,560),(1350,560)],RED,12)
    elif mode in ("cross","mission","church","cathedral"):
        if mode=="cross": cross(d,960,560,1.3);sun(d,1370,515,110)
        elif mode=="mission":
            cross(d,580,510,1.0)
            text(d,"「救済」",(900,440),98,GOLD,True,620)
            if stage:text(d,"他者の神を否定する大義",(815,590),55,PALE,False,770)
        else:
            d.polygon([(390,560),(960,372),(1540,560)],fill=(107,111,115),outline=GOLD)
            d.rectangle((425,555,1500,780),fill=(124,116,101),outline=GOLD,width=5)
            for x in [610,960,1310]:
                d.rectangle((x-65,590,x+65,740),fill=BG,outline=GOLD,width=4)
            cross(d,960,316,.47)
    elif mode=="sacrifice":
        sun(d,720,514,160);cross(d,1340,514,.92)
        if stage:center(d,"双方で異なる「犠牲」",490,765,960,54,PALE,True)
    elif mode=="ceremony":
        temple(d,1080,785,.88)
        for j in range(10):
            x=260+j*130;person(d,x,780,.34,TURQ)
        if stage:
            for j in range(7):roundel(d,410+j*135,404,6,GOLD,GOLD,3)
    elif mode in ("temple","replacement"):
        temple(d,690 if mode=="replacement" else 960,800,.8)
        if mode=="replacement":
            d.polygon([(1080,600),(1460,420),(1760,600)],fill=(117,120,120),outline=GOLD)
            d.rectangle((1105,600,1700,800),fill=(153,137,113),outline=GOLD,width=6)
            cross(d,1450,407,.35)
            if stage: ln(d,[(980,505),(1090,505)],RED,12)
        elif stage:
            roundel(d,960,458,95,GOLD,None,9)
    elif mode=="codices" or mode=="codices" or mode=="archive":
        for j in range(3):
            x=310+j*510
            rect(d,(x,370,x+440,735),PAPER,(155,112,64),6)
            for k in range(5):
                y=455+k*42;ln(d,[(x+65,y),(x+368-(k%3)*48,y)],(126,94,71),5)
            if j==1:
                sun(d,x+215,550,58)
        if stage and mode=="codices":
            d.polygon([(830,805),(1040,380),(1200,810)],fill=RED)
    elif mode=="sources":
        for j,(title,desc) in enumerate([("スペイン側","反乱の警戒"),("先住民側","祭礼への不意打ち")]):
            x=218+j*850
            scroll(d,x,380,x+745,747)
            rect(d,(x+65,418,x+675,550),BG,None,0)
            center(d,title,x+75,439,590,59,PALE,True)
            center(d,desc,x+50,611,640,49,INK)
    elif mode=="friars":
        for j in range(12):
            x=315+(j%6)*250; y=460+(j//6)*192
            person(d,x,y,.55,(104,75,51))
        if stage:center(d,"十二使徒",630,747,630,63,GOLD,True)
    elif mode in ("baptism","school","heir","idols","family"):
        if mode=="family":
            person(d,595,565,1.1,TURQ);person(d,1360,565,.82,RED)
            ln(d,[(960,338),(960,780)],RED,10)
            center(d,"親",475,770,240,54,TURQ,True)
            center(d,"子",1255,770,240,54,RED,True)
        elif mode=="idols":
            roundel(d,960,545,156,GOLD,MID,10)
            cross(d,960,540,.75,PALE)
            if stage:ln(d,[(760,350),(1150,745)],RED,15)
        else:
            for j in range(4):
                x=385+j*345
                person(d,x,640,.78,TURQ if j%2 else GOLD)
            d.rectangle((250,770,1660,785),fill=GOLD)
            if stage:
                text(d,"教義・洗礼・読み書き",(500,385),66,PALE,True,1000)
    elif mode in ("year1539","document","trial","sentence","exception","jurisdiction","case"):
        scroll(d)
        if mode=="jurisdiction":
            for j,(year,thing) in enumerate([("1539","カルロス処刑"),("1571","管轄を変更")]):
                x=370+j*650
                rect(d,(x,440,x+565,672),MID,GOLD if j==0 else TURQ,6)
                center(d,year,x,465,565,92,PALE,True)
                center(d,thing,x,580,565,53,GOLD)
        else:
            label={"year1539":"1539年 テスココ","document":"告発と証言の記録",
                   "trial":"信仰と政治の衝突","sentence":"1539年11月30日",
                   "exception":"例外的な火刑の事例","case":"1558年の婚姻記録"}.get(mode,"記録")
            rect(d,(600,420,1360,585),BG,RED if mode=="sentence" else GOLD,5)
            center(d,label,620,451,720,64,RED if mode=="sentence" else PALE,True)
            if stage:center(d,"史料に基づく概要図",595,650,730,37,INK)
    elif mode=="justice":
        ln(d,[(960,370),(960,750)],GOLD,14)
        ln(d,[(525,470),(1395,470)],GOLD,10)
        for x in [570,1370]:
            ln(d,[(x,472),(x-122,670),(x+122,670),(x,472)],RED,6)
            d.ellipse((x-120,630,x+120,720),fill=MID,outline=GOLD,width=8)
        center(d,"宗教的秩序",705,750,510,58,PALE,True)
    elif mode=="watch":
        d.ellipse((500,420,1420,710),fill=MID,outline=GOLD,width=12)
        roundel(d,960,562,130,TURQ,(14,22,31),12)
        roundel(d,960,562,42,RED,RED,0)
        if stage:center(d,"信仰を見極める視線",490,750,940,48,GOLD,True)
    elif mode in ("household","marriage"):
        for j in range(3):
            x=360+j*595
            d.polygon([(x,514),(x+230,355),(x+460,514)],fill=(91,97,94),outline=GOLD)
            d.rectangle((x+42,515,x+420,775),fill=(113,102,85),outline=GOLD,width=5)
            person(d,x+225,655,.37,GOLD if j==0 else TURQ)
        if stage:center(d,"家庭の規則に介入する",575,785,790,47,PALE)
    elif mode=="power":
        rect(d,(225,416,830,736),MID,GOLD,6)
        rect(d,(1090,416,1695,736),MID,RED,6)
        center(d,"教会の規則",245,505,560,59,GOLD,True)
        center(d,"暮らす人々",1110,505,560,59,RED,True)
        if stage:ln(d,[(840,569),(1072,569)],RED,13)
    elif mode in ("population","status","caution"):
        if mode=="caution":
            rect(d,(355,394,1570,718),MID,RED,7)
            center(d,"単一の原因と断定しない",400,480,1100,68,PALE,True)
            center(d,"史料の限界・調査条件・多様な要因",410,601,1090,44,GOLD)
        else:
            names=["スペイン系","先住民","混血など"] if mode=="population" else ["出自","婚姻","地位"]
            for j,s in enumerate(names):
                x=230+j*540;rect(d,(x,420,x+475,706),MID,GOLD if j==1 else TURQ,5)
                person(d,x+238,553,.67,RED if j==2 else TURQ)
                center(d,s,x+25,646,425,42,PALE)
    elif mode in ("scholar","hill","mary"):
        if mode=="hill":
            d.polygon([(360,775),(660,470),(1100,390),(1560,777)],fill=(68,89,68),outline=GOLD)
            if stage:cross(d,960,460,.64,PALE)
        elif mode=="mary":
            for j,(s,col) in enumerate([("トナンツィン",TURQ),("聖母マリア",GOLD)]):
                x=260+j*810
                rect(d,(x,425,x+720,728),MID,col,5)
                center(d,s,x,525,720,74,col,True)
        else:
            scroll(d)
            center(d,"ナワ人知識人と修道士",585,450,750,60,INK,True)
            if stage: center(d,"共同編纂",690,635,540,55,RED,True)
    elif mode in ("poll2024","poll2020"):
        rect(d,(220,390,1700,735),MID,GOLD,5)
        if mode=="poll2024":
            vals=[67,9,20,4];clrs=[GOLD,TURQ,SLATE,RED]
            labs=["カトリック","プロテスタント","無宗教・無所属","その他など"]
            x=296
            for v,c,l in zip(vals,clrs,labs):
                ww=13.2*v
                d.rectangle((x,512,x+ww,603),fill=c);x+=ww
            for j,(v,c,l) in enumerate(zip(vals,clrs,labs)):
                x=290+j*350
                center(d,f"{v}%",x,420,320,60,c,True)
                center(d,l,x,649,320,33,PALE)
            if stage: text(d,"2024年調査／成人",(675,765),42,GOLD,False,630)
        else:
            vals=[89,11];x=300
            for v,c in zip(vals,[GOLD,SLATE]):
                ww=v*13.1
                d.rectangle((x,506,x+ww,605),fill=c);x+=ww
            center(d,"キリスト教系 約89%",370,392,1180,68,PALE,True)
            if stage: center(d,"2020年国勢調査／全年齢",420,681,1060,45,GOLD)
    else:
        temple(d,960,785,.83)
        if stage:cross(d,1380,485,.59)
def slide(beat,i,stage):
    im=Image.new("RGB",(W,H),BG);d=ImageDraw.Draw(im)
    rng=random.Random(i*839+127)
    for j in range(2400):
        x=rng.randrange(W);y=rng.randrange(850)
        v=rng.randrange(18,44);d.point((x,y),fill=(v,v+4,v+4))
    d.rectangle((0,0,W,11),fill=RED)
    d.rectangle((0,865,W,H),fill=(7,11,16))
    d.rectangle((85,80,103,158),fill=RED)
    text(d,"考える夜   /   宗教と征服の歴史",135,88,38,GOLD,False,1130)
    text(d,"後編",1630,91,38,TURQ,True,160)
    title=beat["chapterTitle"]
    text(d,title,142,167,45,TURQ,False,1620)
    text(d,beat["headline"],140,226,72,PALE,True,1580)
    scene(d,beat["visual"],stage,i)
    if stage==1:
        rect(d,(300,752,1615,841),BG,GOLD,3,12)
        center(d,beat["callout"],330,770,1250,48,PALE,False)
    text(d,"史料に基づく説明用の模式図／再構成表現",120,1041,24,SLATE,False,830)
    text(d,f"{i+1:03d}",1758,1040,25,GOLD,True,120)
    return im
def prepare():
    data=compile_script()
    beats=data["beats"];slides=[]
    for i,b in enumerate(beats):
        for s in range(2):
            p=OUT/f"shot-{i:03d}-{s}.png"
            slide(b,i,s).save(p,optimize=True)
            slides.append({"index":i,"stage":s,"path":str(p)})
    (OUT/"slides.json").write_text(json.dumps(slides,ensure_ascii=False,indent=2),encoding="utf-8")
    cw,ch=320,180;cols=8;rows=math.ceil(len(beats)/cols)
    sheet=Image.new("RGB",(cols*cw,rows*ch),BG)
    for i in range(len(beats)):
        image=Image.open(OUT/f"shot-{i:03d}-1.png")
        sheet.paste(image.resize((cw,ch),Image.Resampling.LANCZOS),
                    ((i%cols)*cw,(i//cols)*ch))
    sheet.save(OUT/"v127-contact-sheet.jpg",quality=90)
    print("V127_SCENES_RENDERED",len(beats),"screenStates",len(slides),flush=True)
def render():
    core.render()
    source=OUT/"v125-black-death-economy-final.mp4"
    video=OUT/"v127-aztec-christianization-final.mp4"
    source.rename(video)
    qa=OUT/"v125-final-qa.json"
    data=json.loads(qa.read_text(encoding="utf-8"))
    data.update({"videoId":"V127","title":"キリスト教はいかにアステカの神と文化を破壊したのか？【後編】",
                 "complete":True,"illustrations":"symbolic reconstructions, not archival photos"})
    (OUT/"v127-final-qa.json").write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding="utf-8")
    qa.unlink()
    print("V127_RELEASE_READY",json.dumps(data,ensure_ascii=False),flush=True)
if __name__=="__main__":
    mode=sys.argv[1] if len(sys.argv)>1 else "prepare"
    if mode=="compile":compile_script()
    elif mode=="prepare":prepare()
    elif mode=="voice":
        if not core.CONTENT.exists():compile_script()
        core.voice()
    elif mode=="render":render()
    else:raise SystemExit("Unknown mode: "+mode)
