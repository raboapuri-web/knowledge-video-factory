#!/usr/bin/env python3
"""V125 — evidence-led, varied historical motion-graphic documentary.
No repeated generic photo pans: 36 narrated meaning spaces, visual families, timed subs.
"""
import concurrent.futures, glob, io, json, math, os, random, re, subprocess, sys, time, urllib.parse, urllib.request, wave
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT=Path(__file__).resolve().parent
OUT=ROOT/"output"
CONTENT=ROOT/"content"/"script.json"
W,H=1920,1080
CREAM=(241,230,206); PAPER=(223,207,175); DARK=(28,31,34)
INK=(46,44,42); RED=(175,43,36); GOLD=(159,119,65); GREY=(105,98,90)
CHAPTERS=["prologue","chapter1","chapter2","chapter3","chapter4","epilogue"]
NUMBERS={"prologue":"00","chapter1":"01","chapter2":"02","chapter3":"03","chapter4":"04","epilogue":"05"}

def font_path(serif=False):
    pattern="Noto Serif CJK JP" if serif else "Noto Sans CJK JP"
    try:
        p=subprocess.check_output(["fc-match","-f","%{file}",pattern],text=True).strip()
        if Path(p).exists(): return p
    except Exception: pass
    paths=glob.glob("/usr/share/fonts/**/*Noto*"+("Serif" if serif else "Sans")+"*CJK*.*",recursive=True)
    return paths[0] if paths else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"

FONT_S=font_path(True); FONT_N=font_path()
cache={}
def ft(size,serif=False):
    key=(size,serif)
    if key not in cache: cache[key]=ImageFont.truetype(FONT_S if serif else FONT_N,size)
    return cache[key]

def fit_text(draw,s,maxwidth,init=78,minsize=30,serif=False):
    for size in range(init,minsize-1,-2):
        f=ft(size,serif)
        if draw.textbbox((0,0),s,font=f)[2]<=maxwidth: return f
    return ft(minsize,serif)

def wrapped(draw,text,width,fontsize=43,maxlines=3):
    f=ft(fontsize)
    lines=[]; cur=""
    for char in text:
        if char=="\n":
            lines.append(cur);cur="";continue
        if draw.textbbox((0,0),cur+char,font=f)[2]>width and cur:
            lines.append(cur);cur=char
        else: cur+=char
    if cur: lines.append(cur)
    return lines[:maxlines]

def text_center(d,txt,y,f,color=INK):
    bb=d.textbbox((0,0),txt,font=f)
    d.text(((W-(bb[2]-bb[0]))/2,y),txt,font=f,fill=color)

def box(d,xy,fill,outline=None,width=3,radius=12):
    d.rounded_rectangle(xy,radius=radius,fill=fill,outline=outline,width=width)

def line(d,points,fill=INK,width=7):
    d.line(points,fill=fill,width=width,joint="curve")

def people(d,x,y,n,spacing=65,color=INK,scale=1.0):
    for j in range(n):
        px=x+j*spacing; r=12*scale
        d.ellipse((px-r,y-r,px+r,y+r),fill=color)
        line(d,[(px,y+16*scale),(px,y+51*scale)],color,5)
        line(d,[(px-17*scale,y+29*scale),(px+17*scale,y+29*scale)],color,4)
        line(d,[(px,y+50*scale),(px-13*scale,y+72*scale)],color,4)
        line(d,[(px,y+50*scale),(px+13*scale,y+72*scale)],color,4)

def cardtext(d,txt,rect,fontsize=58,color=INK,bold=False):
    x1,y1,x2,y2=rect
    f=fit_text(d,txt,x2-x1-50,fontsize,25,serif=bold)
    bb=d.textbbox((0,0),txt,font=f); tw=bb[2]-bb[0]
    d.text((x1+(x2-x1-tw)/2,y1+(y2-y1-f.size)/2),txt,font=f,fill=color)

def arrow(d,x1,y1,x2,y2,col=RED,wd=11):
    line(d,[(x1,y1),(x2,y2)],col,wd)
    a=math.atan2(y2-y1,x2-x1)
    p1=(x2-25*math.cos(a-0.45),y2-25*math.sin(a-0.45))
    p2=(x2-25*math.cos(a+0.45),y2-25*math.sin(a+0.45))
    d.polygon([(x2,y2),p1,p2],fill=col)

def bare_chart(d,labels,values,x=250,y=430,w=1400,h=260,scale=None,redidx=1):
    maximum=scale or max(values)*1.2
    gap=w//len(values)
    for i,(lbl,v) in enumerate(zip(labels,values)):
        bx=x+i*gap+60; bw=gap-120; ht=max(15,int(h*v/maximum))
        d.rectangle((bx,y+h-ht,bx+bw,y+h),fill=RED if i==redidx else DARK)
        cardtext(d,lbl,(bx-20,y+h+18,bx+bw+20,y+h+97),35,GREY)
        cardtext(d,str(v),(bx,y+h-ht-90,bx+bw,y+h-ht-15),45,RED if i==redidx else DARK)

def scene_art(d,mode,stage,idx):
    """Different diagram grammar for different narration ideas. Coordinates keep clear of burnt captions."""
    X1,Y1,X2,Y2=145,275,1775,817
    accent=RED if idx%3!=1 else GOLD
    if mode in ("manuscript","estates","map","landlabor","harvest"):
        # Engraving-like agricultural landscape, with different quantitative overlays.
        for j in range(6):
            yy=685+j*22
            line(d,[(180,yy),(1660,yy+10)],(131+j*6,109+j*5,81+j*4),3)
        for j in range(7):
            xx=270+j*205
            d.polygon([(xx,545),(xx+75,475),(xx+150,545)],fill=(112,96,73),outline=INK)
            d.rectangle((xx+26,545,xx+120,610),fill=(191,168,132),outline=INK,width=3)
        for j in range(12):
            xx=250+j*110
            line(d,[(xx,688),(xx-8,637)],GOLD,3)
            for dd in [-1,1]:
                d.ellipse((min(xx+dd*10,xx+dd*14),647,max(xx+dd*10,xx+dd*14),662),fill=GOLD)
        if mode=="landlabor":
            box(d,(280,340,810,505),CREAM,INK);box(d,(1120,340,1650,505),CREAM,INK)
            cardtext(d,"土地は残る",(300,350,785,475),70)
            cardtext(d,"人は激減",(1140,350,1620,475),70,RED)
            arrow(d,810,424,1110,424)
        elif mode=="harvest":
            box(d,(690,344,1245,482),DARK)
            cardtext(d,"収穫には期限がある",(710,360,1225,465),56,CREAM,True)
        elif mode=="estates":
            box(d,(410,344,1500,478),CREAM,INK)
            cardtext(d,"土地を持つ者　→　働く者",(425,362,1480,460),58)
        elif mode=="map":
            box(d,(550,345,1400,486),DARK)
            cardtext(d,"1348年　イングランド",(570,354,1380,475),74,CREAM,True)
    elif mode in ("population","market","inflation","nominalreal"):
        if mode=="population":
            bare_chart(d,["1348年 約480万人","1351年 約260万人"],[480,260],redidx=1)
            box(d,(1230,330,1710,423),DARK);cardtext(d,"約46%減（推計）",(1240,343,1690,407),42,CREAM)
            cardtext(d,"※歴史人口学に基づく推計",(240,745,1650,812),35,GREY)
        elif mode=="market":
            box(d,(235,353,770,695),CREAM,INK);box(d,(1135,353,1666,695),CREAM,INK)
            cardtext(d,"必要な仕事 100",(245,398,760,532),59)
            cardtext(d,"働き手 50",(1145,398,1656,532),59,RED)
            arrow(d,785,518,1115,518)
            cardtext(d,"※説明のための仮定",(300,726,1650,801),34,GREY)
        elif mode=="nominalreal":
            box(d,(220,340,900,650),CREAM,INK);box(d,(1020,340,1700,650),DARK)
            cardtext(d,"名目賃金",(250,350,875,470),65)
            cardtext(d,"受け取る金額",(250,494,875,590),44,GREY)
            cardtext(d,"実質賃金",(1030,350,1670,470),65,CREAM)
            cardtext(d,"実際に買える量",(1030,494,1670,590),44,CREAM)
        else:
            bare_chart(d,["賃金","生活費"],[150,200],redidx=1)
            cardtext(d,"※100→150、100→200の模式例",(250,743,1695,802),34,GREY)
    elif mode in ("decree","archive","revolt","research"):
        if mode=="research":
            box(d,(360,336,1570,715),CREAM,INK)
            cardtext(d,"経済史研究　2026",(390,345,1530,462),69,RED,True)
            cardtext(d,"職種・契約で賃金上昇に差",(380,500,1550,626),60,DARK)
        elif mode=="revolt":
            cardtext(d,"1381",(270,315,1640,575),170,RED,True)
            people(d,510,640,15,62,DARK,.85)
        else:
            # An inked decree / source folio, without pretending to be a genuine manuscript.
            d.polygon([(530,315),(1425,308),(1455,731),(505,733)],fill=(243,229,196),outline=INK)
            for i in range(8):
                yy=415+i*30
                line(d,[(610,yy),(1300-(i%3)*90,yy+3)],(142,119,88),4)
            d.ellipse((1170,560,1317,707),fill=RED,outline=INK,width=7)
            cardtext(d,"1351" if mode=="archive" else "1349 → 1351",(540,326,1405,413),67,DARK,True)
    elif mode in ("negotiation","power","hierarchy","custom","women","choices","conclusion"):
        left="領主";right="農民"
        if mode=="power":left,right="地主の利益","労働者の賃金"
        if mode=="hierarchy":left,right="雇い主が選ぶ","働き手が選ぶ"
        if mode=="custom":left,right="市場で決まる報酬","慣習に従う報酬"
        if mode=="women":left,right="日雇い契約","年単位の奉公"
        if mode=="choices":left,right="待遇を改善","移動を拘束"
        if mode=="conclusion":left,right="人手が必要","自由は困る"
        box(d,(190,370,873,690),CREAM,INK);box(d,(1047,370,1730,690),DARK)
        cardtext(d,left,(215,410,848,650),63,DARK,True)
        cardtext(d,right,(1071,410,1700,650),63,CREAM,True)
        arrow(d,884,540,1021,540,RED)
    elif mode in ("timeline","west","east","europe","institutions"):
        pts=[(255,550),(620,550),(985,550),(1350,550),(1680,550)]
        line(d,[(x,y) for x,y in pts],DARK,10)
        labs=(
            ["1348","1351","1381","15世紀","現代"] if mode=="timeline"
            else ["黒死病","労働不足","領主の政治力","国家制度","長期変化"] if mode=="institutions"
            else ["西欧","農奴制の衰退","／","東中欧","拘束強化"] if mode in ("west","east")
            else ["イングランド","フランス","イタリア","欧州各地","規制は多様"]
        )
        for j,(x,y) in enumerate(pts):
            d.ellipse((x-22,y-22,x+22,y+22),fill=RED if j==idx%5 else DARK)
            cardtext(d,labs[j],(x-175,590,x+175,685),46,INK)
        if mode in ("west","east"):
            cardtext(d,"時代も地域も異なる比較",(330,725,1600,807),36,GREY)
    elif mode in ("equation","value","ability","conditions","paradox"):
        words=(
            ("技能","希少性","賃金") if mode=="equation"
            else ("能力","市場環境","制度") if mode in ("value","ability","conditions")
            else ("人手不足","賃金上昇","法的規制")
        )
        for j,s in enumerate(words):
            x=165+j*560
            box(d,(x,375,x+470,635),DARK if j==2 else CREAM,INK)
            cardtext(d,s,(x+8,410,x+463,591),64,CREAM if j==2 else DARK,True)
            if j<2:arrow(d,x+477,507,x+552,507,RED)
    elif mode in ("average","modern"):
        people(d,320,440,16,82,DARK,.83)
        box(d,(380,655,1560,780),CREAM,INK)
        cardtext(d,"全員が同じ利益を得たわけではない" if mode=="average" else "人口減少 ≠ 自動的な賃上げ",(398,670,1540,762),49,RED)
    elif mode in ("closing","question"):
        box(d,(250,375,1665,690),DARK)
        q="あなたの給料は、あなたの価値ですか？" if mode=="closing" else "なぜ賃上げが問題になった？"
        f=fit_text(d,q,1320,83,40,True)
        text_center(d,q,475,f,CREAM)
    else:
        box(d,(265,385,1655,660),CREAM,INK)
        cardtext(d,"経済が変わっても、制度が変わるとは限らない",(280,420,1630,635),58)

def build_slide(beat,idx,stage,chapterfirst):
    rnd=random.Random(92000+idx*31)
    im=Image.new("RGB",(W,H),CREAM);d=ImageDraw.Draw(im)
    # Reproducible ink-paper imperfections; texture never crowds text.
    for _ in range(4200):
        x=rnd.randrange(W);y=rnd.randrange(H);v=rnd.randrange(-19,20)
        p=(max(0,min(255,237+v)),max(0,min(255,224+v)),max(0,min(255,200+v)))
        d.point((x,y),fill=p)
    d.rectangle((0,0,W,18),fill=DARK)
    d.rectangle((0,860,W,H),fill=(29,30,33))
    d.rectangle((76,60,96,140),fill=RED)
    d.text((126,65),"考える夜  /  HISTORY × ECONOMICS",font=ft(34),fill=GREY)
    d.text((1500,70),f"V125  {NUMBERS[beat['chapter']]} / 05",font=ft(33),fill=DARK)
    # Chapter + beat panel, with lots of whitespace.
    chapter_line=beat['chapterTitle'].split("｜")[-1]
    d.text((135,150),chapter_line,font=fit_text(d,chapter_line,1610,46,34),fill=RED)
    d.text((135,204),beat["headline"],font=fit_text(d,beat["headline"],1600,78,46,True),fill=DARK)
    if stage==2:
        box(d,(200,338,1720,750),DARK)
        lines=wrapped(d,beat["callout"],1290,69,3)
        for k,s in enumerate(lines):
            f=fit_text(d,s,1280,80,38,True)
            text_center(d,s,440+k*106,f,CREAM if k!=0 else (239,105,90))
        d.rectangle((300,719,1620,728),fill=RED)
    else:
        scene_art(d,beat["visual"],stage,idx)
        if stage==1:
            box(d,(200,772,1720,839),DARK)
            cardtext(d,beat["callout"],(220,778,1700,834),43,CREAM)
        else:
            # Opening state: highlight an original claim rather than generic object fly-ins.
            d.rectangle((180,800,1690,815),fill=RED)
    # The two-line caption uses space 868..1050; rendered with FFmpeg/libass.
    d.text((112,1041),"※ 史料風再現・図版の一部は説明用の模式図",font=ft(19),fill=(152,149,144))
    d.text((1580,1041),f"{idx+1:02d} / 36",font=ft(20),fill=(177,169,157))
    return im

def prepare():
    OUT.mkdir(parents=True,exist_ok=True)
    script=json.loads(CONTENT.read_text(encoding="utf-8"))
    b=script["beats"]; seq=[]
    for i,beat in enumerate(b):
        for stage in (0,1,2) if i%3==0 or beat["visual"] in ("population","decree","research","closing","question","inflation") else (0,1):
            im=build_slide(beat,i,stage,i==0 or beat["chapter"]!=b[i-1]["chapter"])
            path=OUT/f"shot-{i:02d}-{stage}.png"
            im.save(path,optimize=True)
            seq.append({"index":i,"stage":stage,"path":str(path)})
    (OUT/"slides.json").write_text(json.dumps(seq,ensure_ascii=False,indent=2),encoding="utf-8")
    # Contact sheet includes one distinct semantic diagram per narration beat.
    cw,ch=320,180;sheet=Image.new("RGB",(6*cw,6*ch),(245,237,218))
    for i in range(len(b)):
        path=OUT/f"shot-{i:02d}-1.png"
        thumb=Image.open(path).resize((cw,ch),Image.Resampling.LANCZOS)
        sheet.paste(thumb,((i%6)*cw,(i//6)*ch))
    sheet.save(OUT/"v125-contact-sheet.jpg",quality=90)
    print("visual beats:",len(b),"rendered stages:",len(seq),flush=True)

def segmentation(text):
    # Use Japanese punctuation for semantically stable audio/subtitle chunks,
    # never split inside a number and never display literal backslash-n text.
    raw=re.split(r"(?<=[。！？!?])|(?<=、)",text)
    pieces=[];buf=""
    for rawpart in raw:
        if not rawpart:continue
        if len(buf)+len(rawpart)<42:
            buf+=rawpart
        else:
            if buf:pieces.append(buf);buf=""
            if len(rawpart)>52:
                while len(rawpart)>52:
                    cut=max(25,rawpart.rfind("、",0,51)+1)
                    if cut<25:cut=45
                    pieces.append(rawpart[:cut]);rawpart=rawpart[cut:]
            buf=rawpart
    if buf:pieces.append(buf)
    # Re-chunk any long clause; each subtitle is at most two safe-area lines.
    safe=[]
    for p in pieces:
        p=p.strip()
        while len(p)>46:
            cut=p.rfind("、",20,44)+1
            if cut<20: cut=44
            safe.append(p[:cut].strip());p=p[cut:].strip()
        if p:safe.append(p)
    return safe

DIGITS={
"1348年":"千三百四十八年","1351年":"千三百五十一年","1349年":"千三百四十九年",
"1381年":"千三百八十一年","2026年":"二千二十六年","14世紀":"十四世紀",
"15世紀":"十五世紀","16世紀":"十六世紀","480万人":"四百八十万人",
"260万人":"二百六十万人","46パーセント":"四十六パーセント",
"100人":"百人","50人":"五十人","10軒":"十軒",
"100円":"百円","150円":"百五十円","50パーセント":"五十パーセント",
"2倍":"二倍","3人":"三人"
}
def speech(s):
    for k in sorted(DIGITS,key=len,reverse=True):s=s.replace(k,DIGITS[k])
    return s

def vv_request(endpoint,params,data=None):
    q=urllib.parse.urlencode(params)
    req=urllib.request.Request("http://127.0.0.1:50021/"+endpoint+"?"+q,data=data,headers={"Content-Type":"application/json"} if data is not None else {},method="POST")
    for attempt in range(4):
        try:
            with urllib.request.urlopen(req,timeout=120) as r:return r.read()
        except Exception as e:
            if attempt==3:raise RuntimeError(f"VOICEVOX {endpoint}: {e}") from e
            time.sleep(2*(attempt+1))

def synth(task):
    i,si,sub=task
    query=json.loads(vv_request("audio_query",{"speaker":13,"text":speech(sub)}))
    query["speedScale"]=1.15
    query["prePhonemeLength"]=0.03
    query["postPhonemeLength"]=0.05
    return i,si,sub,vv_request("synthesis",{"speaker":13},json.dumps(query,ensure_ascii=False).encode("utf-8"))

def srt_time(t):
    ms=int(round(t*1000));h,ms=divmod(ms,3600000);m,ms=divmod(ms,60000);s,ms=divmod(ms,1000)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"

def srt_lines(s):
    # ASS renderer 2-line subtitles of no more than 23 Japanese chars per line.
    assert len(s)<=46, f"subtitle too long for safe two-line area: {len(s)}"
    return "\n".join(s[i:i+23] for i in range(0,len(s),23))

def voice():
    OUT.mkdir(exist_ok=True)
    beats=json.loads(CONTENT.read_text(encoding="utf-8"))["beats"]
    tasks=[];bybeat=[]
    for i,beat in enumerate(beats):
        chunks=segmentation(beat["narration"])
        bybeat.append(chunks)
        for si,sub in enumerate(chunks):tasks.append((i,si,sub))
    print("Synthesizing",len(tasks),"speech cues across",len(beats),"unique scenes",flush=True)
    results={}
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
        futures=[pool.submit(synth,t) for t in tasks]
        for k,f in enumerate(concurrent.futures.as_completed(futures),1):
            i,si,sub,p=f.result();results[(i,si)]=(sub,p)
            if k%30==0:print("synth cues:",k,"/",len(tasks),flush=True)
    all_frames=[];subs=[];beatdata=[];global_time=0.0;idx=1
    sample_rate=None;channels=None;sw=None
    for i,chunks in enumerate(bybeat):
        start=global_time
        for si,_ in enumerate(chunks):
            sub,wavdata=results[(i,si)]
            with wave.open(io.BytesIO(wavdata),"rb") as wf:
                if sample_rate is None:
                    sample_rate=wf.getframerate();channels=wf.getnchannels();sw=wf.getsampwidth()
                assert (sample_rate,channels,sw)==(wf.getframerate(),wf.getnchannels(),wf.getsampwidth()),"VOICEVOX wav format mismatch"
                frames=wf.readframes(wf.getnframes())
                dur=wf.getnframes()/sample_rate
            all_frames.append(frames)
            subs.append(f"{idx}\n{srt_time(global_time)} --> {srt_time(global_time+dur+0.03)}\n{srt_lines(sub)}\n")
            idx+=1
            global_time+=dur
            silent=0.08 if si<len(chunks)-1 else 0.36
            all_frames.append(bytes(int(round(silent*sample_rate))*channels*sw))
            global_time+=silent
        beatdata.append({"id":beats[i]["id"],"seconds":global_time-start,"start":start,"end":global_time})
    with wave.open(str(OUT/"narration.wav"),"wb") as wav:
        wav.setnchannels(channels);wav.setsampwidth(sw);wav.setframerate(sample_rate)
        for frame in all_frames:wav.writeframes(frame)
    (OUT/"subtitles.srt").write_text("\n".join(subs),encoding="utf-8")
    (OUT/"timing.json").write_text(json.dumps({"totalSeconds":global_time,"cues":len(tasks),"beats":beatdata},ensure_ascii=False,indent=2),encoding="utf-8")
    print("Measured narration:",global_time,"seconds; subtitle cues:",len(tasks),flush=True)

def render():
    data=json.loads((OUT/"timing.json").read_text(encoding="utf-8"))
    seq=json.loads((OUT/"slides.json").read_text(encoding="utf-8"))
    grouped={}
    for row in seq:grouped.setdefault(row["index"],[]).append(row)
    timing=[]
    for i,beat in enumerate(data["beats"]):
        stages=grouped[i]
        weights=[.38,.62] if len(stages)==2 else [.24,.50,.26]
        assert len(weights)==len(stages)
        sec=beat["seconds"]
        for j,(stage,w) in enumerate(zip(stages,weights)):
            duration=sec*w if j<len(stages)-1 else sec-sum(sec*ww for ww in weights[:-1])
            timing.append((stage["path"],duration))
    ffconcat=["ffconcat version 1.0"]
    for p,sec in timing:
        ffconcat.extend(["file '"+p.replace("'","'\\''")+"'","duration %.6f"%sec])
    ffconcat.append("file '"+timing[-1][0]+"'")
    (OUT/"images.ffconcat").write_text("\n".join(ffconcat)+"\n",encoding="utf-8")
    # True audio clock controls end time. Narration/subtitles and semantics are joined by same beat IDs.
    srt=str(OUT/"subtitles.srt")
    style=("FontName=Noto Sans CJK JP,FontSize=23,PrimaryColour=&H00F6F4EB,"
           "OutlineColour=&H00151519,BorderStyle=1,Outline=2,Shadow=1,"
           "MarginV=12,Alignment=2")
    vf=f"fps=24,subtitles='{srt}':force_style='{style}'"
    out=str(OUT/"v125-black-death-economy-final.mp4")
    cmd=["ffmpeg","-hide_banner","-y","-loglevel","warning",
         "-safe","0","-f","concat","-i",str(OUT/"images.ffconcat"),
         "-i",str(OUT/"narration.wav"),"-map","0:v:0","-map","1:a:0",
         "-vf",vf,"-r","24","-c:v","libx264","-preset","veryfast",
         "-crf","23","-pix_fmt","yuv420p","-c:a","aac","-b:a","160k",
         "-shortest","-movflags","+faststart",out]
    print("Rendering full film, duration:",data["totalSeconds"],flush=True)
    subprocess.run(cmd,check=True)
    probe=json.loads(subprocess.check_output(["ffprobe","-v","error","-show_entries","format=duration,size:stream=index,codec_type,width,height,r_frame_rate","-of","json",out],text=True))
    duration=float(probe["format"]["duration"])
    streams=probe["streams"]
    assert duration>=600, f"video too short for long-form production: {duration:.1f}s"
    assert any(x.get("width")==1920 and x.get("height")==1080 for x in streams),"video resolution wrong"
    assert any(x.get("codec_type")=="audio" for x in streams),"audio missing"
    assert abs(duration-data["totalSeconds"])<3.5, "render narration-duration mismatch"
    qa={"videoId":"V125","complete":True,"durationSeconds":round(duration,1),
        "resolution":"1920x1080","fps":24,"semanticScenes":len(grouped),
        "screenStates":len(seq),"subtitleCues":data["cues"],"audio":True,
        "sizeBytes":int(probe["format"]["size"]),
        "usesIllustrativeFigures":True,"frameTextRule":"subtitle region stays below diagrams"}
    (OUT/"v125-final-qa.json").write_text(json.dumps(qa,ensure_ascii=False,indent=2),encoding="utf-8")
    (OUT/"SOURCES.txt").write_text("\n".join(json.loads(CONTENT.read_text(encoding="utf-8"))["sources"])+"\n",encoding="utf-8")
    print("PRODUCTION_COMPLETE",json.dumps(qa,ensure_ascii=False),flush=True)

if __name__=="__main__":
    mode=sys.argv[1] if len(sys.argv)>1 else "all"
    if mode in ("prepare","all"):prepare()
    if mode in ("voice","all"):voice()
    if mode in ("render","all"):render()
