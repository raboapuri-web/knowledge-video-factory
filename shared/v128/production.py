#!/usr/bin/env python3
"""V128: Groupthink and the economics of diversity.
Long-form Japanese explainer. Verbatim voice manuscript, original vector-like
infographics, staged meaning changes, measured VOICEVOX narration + SRT burn-in.
Standalone visual code backed by tested V125 media engine.
"""
from pathlib import Path
import sys, re, json, math, random, subprocess
from PIL import Image, ImageDraw
ROOT=Path(__file__).resolve().parent
sys.path.insert(0,str(ROOT.parent/"v125"))
import production as core
core.ROOT=ROOT
core.OUT=ROOT/"output"
core.CONTENT=ROOT/"content"/"script.json"
core.CHAPTERS=["prologue","chapter1","chapter2","chapter3","chapter4","epilogue"]
core.NUMBERS={x:f"{i:02d}" for i,x in enumerate(core.CHAPTERS)}
core.DIGITS.update({
"3年目":"さんねんめ","3人":"さんにん","20年前":"にじゅうねんまえ",
"1987年":"せんきゅうひゃくはちじゅうななねん",
"1961年":"せんきゅうひゃくろくじゅういちねん",
"1972年":"せんきゅうひゃくななじゅうにねん",
"2025年":"にせんにじゅうごねん",
"2006年":"にせんろくねん","2012年":"にせんじゅうにねん",
"2024年":"にせんにじゅうよねん","2023年":"にせんにじゅうさんねん",
"1999年":"せんきゅうひゃくきゅうじゅうきゅうねん",
"135組":"ひゃくさんじゅうごくみ","65件":"ろくじゅうごけん",
"3189グループ":"さんぜんひゃくはちじゅうきゅうグループ",
"146件":"ひゃくよんじゅうろっけん","ASAモデル":"エーエスエーモデル",
"20分":"にじゅっぷん",
})
OUT=core.OUT
W,H=1920,1080
BG=(17,23,33); BG2=(25,35,45); PANEL=(37,49,60); BORDER=(79,98,105)
PAPER=(245,242,230); MUTED=(158,170,174)
RED=(228,83,81); GOLD=(225,185,108); MINT=(111,199,172); BLUE=(110,157,204)
NAMES={
"prologue":"全員一致で決まった最悪の企画",
"chapter1":"なぜ似た者同士で固まるのか",
"chapter2":"優秀な人間が集まるほど愚かになる？",
"chapter3":"多様性が意思決定を改善する条件",
"chapter4":"人を増やすだけでは意味がない",
"epilogue":"嫌いな同僚が会社を救うかもしれない",
}
# Ordered semantic blocks, never random generic transitions.
PLANS={
"prologue":[
("meeting","月曜、午前10時","いつもの企画会議"),
("meeting","部長の新サービス案","自信満々の提案"),
("vote","全員が賛成する","反対票はゼロ"),
("hidden","若手の手元には","顧客への聞き取り"),
("silence","言いたいことがある","しかし、言わない"),
("vote","予定より20分早く終わる","全員一致の承認"),
("failure","そして半年後","事業計画は見直し"),
("question","最高の会議だった？","誰も議論していない"),
("network","意見が揃う心地よさ","同じ考えに囲まれる"),
("contrast","働きやすさと判断力","実は別の問題"),
("book","古賀史健『集団浅慮』","組織心理学×労働"),
("thesis","多様性は道徳ではなく","判断の経済合理性"),
],
"chapter1":[
("interview","あなたは採用担当者","候補者は二人"),
("interview","一人目は異業種出身","能力は高いが質問が鋭い"),
("interview","二人目は自分に似ている","会話は驚くほど弾む"),
("contrast","採用したくなるのは？","能力と好感は別"),
("network","ホモフィリー","類似した人を好む"),
("cohesion","集団凝集性","強い結束と助け合い"),
("cohesion","結束には副作用がある","異論が減ることも"),
("meeting","古参だけの営業部","『例のやり方』"),
("workflow","異業種からの転職者","新しい提案"),
("silence","『うちでは無理』","説明できない慣習"),
("contrast","何を守っているのか","合理性か、慣習か"),
("asa","ASAモデル／1987","誘引・選抜・離脱"),
("asa","似た人が残りやすい","組織は同質化する"),
("network","価値観も判断も揃う","十人いても同じ視点"),
("cost","摩擦の減少と正確性","同義ではない"),
("thesis","十人分の知性か","一人の意見の反復か"),
],
"chapter2":[
("cuba","1961年4月","ピッグス湾侵攻"),
("cuba","専門家たちの政策判断","それでも作戦は失敗"),
("book","ジャニスの集団浅慮","1972年の古典理論"),
("conformity","合意を優先する集団","批判的検討が弱まる"),
("silence","警告は埋もれていく","全員一致という錯覚"),
("caution","歴史の因果は複雑","集団浅慮だけが原因ではない"),
("book","古賀史健『集団浅慮』","閉鎖的な組織の問題"),
("report","フジテレビ問題／2025","経営・統治・組織風土"),
("hierarchy","問われる意思決定","問題提起が届かない"),
("meeting","ある企業の経営会議","既に決まった上司の案"),
("silence","反対は面倒を生む","黙るのが得？"),
("cost","個人は合理的に沈黙","組織全体は不合理"),
("hierarchy","小さな配慮の累積","大きな企業損失"),
("blindspot","経歴が似た経営陣","同じ成功体験"),
("blindspot","市場の変化を見落とす","自分の視界だけが世界"),
("thesis","全員が同じ方向なら","盲点も全員で共有する"),
],
"chapter3":[
("question","優秀な人だけで十分？","多様性は本当に必要か"),
("research135","Schulz-Hardtほか／2006","135組の3人集団"),
("candidates","四人の候補者を選ぶ","情報は各人で異なる"),
("hidden","隠れたプロフィール","一人では正解が見えない"),
("logistics","物流拠点を選ぶ","営業・経理・物流"),
("logistics","三人とも最初はA案","根拠は不完全"),
("hidden","独自情報を持っている","会議に出さないと消える"),
("vote","全員がA案を支持","共有情報だけが反復"),
("research135","異論のある集団","正解への到達が改善"),
("dissent","反対者は正解を知らない","それでも議論が深まる"),
("research65","Luほか／2012","65研究・3189グループ"),
("hidden","共有情報の偏り","独自情報を見逃す"),
("thesis","全員一致は証拠でない","同じ情報しかないだけかも"),
("jury","Sommers／2006","多様な模擬陪審員"),
("jury","議論する事実の幅","事実誤認にも違い"),
("dissent","多数派の振る舞いも","異なる構成で変化"),
("caution","模擬陪審員の研究","企業の売上の証明ではない"),
("product","冷凍食品の開発","使う人の経験が欠ける"),
("product","生活者の知識を統合","見落とす使用場面"),
("contrast","属性と経験は別物","誰も集団の代表ではない"),
("research146","146研究のメタ分析","革新的成果と関連"),
("tasks","標準作業と新商品開発","必要な能力が異なる"),
("phone","アプリを開発する","顧客の操作を想像できるか"),
("risk","発売前の問題発見","改修費用を抑える可能性"),
("thesis","多様性は情報収集装置","知らないことに気づく"),
],
"chapter4":[
("tradeoff","多様性は魔法ではない","人数を増やすだけでは無理"),
("tradeoff","対立と情報統合","利益もコストも存在"),
("research2024","van Knippenberg／2024","メリットと阻害要因"),
("research2023","2023年のメタ分析","属性の多様性≠自動的な創造性"),
("question","では何が足りない？","異なる視点を使う仕組み"),
("pr","広報写真のダイバーシティ","会議室には多様な顔"),
("pr","『方針はもう決まっています』","議論だけを演出"),
("silence","若手の意見を却下","『うちには合わない』"),
("vote","元の企画に決まる","出席者だけが増えた"),
("contrast","人員の多様性","意思決定の多様性"),
("safety","心理的安全性","発言できる仕組み"),
("research1999","Edmondson／1999","チームの学習行動"),
("safety","優しさと安全性は違う","言いにくいことも言える"),
("departments","営業・経理・開発・製造","合理的な利害の違い"),
("rules","最初に上司が答えない","各自が個別に意見を書く"),
("premortem","プレモーテム","失敗したと仮定する"),
("rules","反論を罰しない","根拠を検討して決断"),
("contrast","属性は知識そのものではない","決めつけない"),
("rules","迎え入れる・聴く・使う","多様性を成果につなぐ"),
("thesis","ポスターでは会社は変わらない","必要なのは意思決定の変革"),
],
"epilogue":[
("meeting","もう一度、あの会議へ","最初の場面を巻き戻す"),
("rules","部長が結論を先に言わない","各自の意見を紙に書く"),
("hidden","若手の顧客調査が共有される","隠れた懸念が見える"),
("departments","サポートコストも検討","異なる専門性が合流"),
("tradeoff","会議は長引く","しかし情報は増える"),
("caution","成功は保証されない","それでも検討は深まる"),
("dissent","面倒な同僚がいる","反論をする人"),
("hidden","その人だけが知る情報","経験という別の視点"),
("cost","摩擦の費用は目につく","見落とした機会は見えない"),
("contrast","賛成する同僚","反論する同僚"),
("ending","間違った答えに","全員が賛成しない仕組み"),
],
}
SOURCES=[
"古賀史健（2025）『集団浅慮――「優秀だった男たち」はなぜ道を誤るのか？』ダイヤモンド社。",
"Schneider, B. (1987). The People Make the Place. Personnel Psychology, 40(3), 437–453.",
"Janis, I. L. (1972). Victims of Groupthink. Houghton Mifflin. Causal interpretation of Bay of Pigs remains debated.",
"Schulz-Hardt, S. et al. (2006). Group Decision Making in Hidden Profile Situations. Journal of Personality and Social Psychology.",
"Lu, L., Yuan, Y. C., & McLeod, P. L. (2012). Twenty-Five Years of Hidden Profiles in Group Decision Making. Personality and Social Psychology Review.",
"Sommers, S. R. (2006). On Racial Diversity and Group Decision Making. Journal of Personality and Social Psychology.",
"van Dijk, H., van Engen, M. L., & van Knippenberg, D. (2012). Defying Conventional Wisdom. Organizational Behavior and Human Decision Processes.",
"Edmondson, A. C. (1999). Psychological Safety and Learning Behavior in Work Teams. Administrative Science Quarterly.",
"van Knippenberg, D. (2024). Team Diversity and Team Performance: Paths to Synergetic and Disruptive Effects.",
"Byron, K. et al. (2023). Building Blocks of Idea Generation and Implementation in Teams. Journal of Applied Psychology.",
"フジテレビ第三者委員会調査報告書（2025年3月31日）および改革関連資料。",
"All office stories and business case diagrams are illustrative fiction; numerical results are not invented.",
]
def norm(s):
    return re.sub(r"\s+","",s).replace("**","")
def split_beats(paras,target=165):
    sentences=[]
    for para in paras:
        sentences += re.findall(r"[^。！？!?]*[。！？!?]|[^。！？!?]+$",norm(para))
    assert sentences
    result=[]; buf=""
    for x in sentences:
        if buf and len(buf)+len(x)>target and len(buf)>=95:
            result.append(buf);buf=""
        buf+=x
    if buf:result.append(buf)
    if len(result)>1 and len(result[-1])<65:
        result[-2]+=result[-1];result.pop()
    assert "".join(result)=="".join(norm(p) for p in paras)
    return result
def compile_manuscript():
    raw=(ROOT/"manuscript.txt").read_text(encoding="utf-8")
    split=re.split(r"(?m)^## (PROLOGUE|CHAPTER1|CHAPTER2|CHAPTER3|CHAPTER4|EPILOGUE)\s*$",raw)
    names=["PROLOGUE","CHAPTER1","CHAPTER2","CHAPTER3","CHAPTER4","EPILOGUE"]
    chunks={split[i]:split[i+1] for i in range(1,len(split)-1,2)}
    assert set(chunks)==set(names)
    chapters=core.CHAPTERS
    beats=[];audit={}
    for tag,ch in zip(names,chapters):
        rawparas=[x for x in chunks[tag].strip().splitlines() if x.strip()]
        texts=split_beats(rawparas)
        plans=PLANS[ch]
        for j,words in enumerate(texts):
            p=min(len(plans)-1,int((j+.35)*len(plans)/len(texts)))
            visual,headline,callout=plans[p]
            beats.append({"id":f"{ch}-{j+1:03d}","chapter":ch,"chapterTitle":NAMES[ch],
                "visual":visual,"headline":headline,"callout":callout,"narration":words})
        audit[ch]={"chars":sum(map(len,map(norm,rawparas))),"beats":len(texts)}
    assert sum(x["chars"] for x in audit.values())>=10000,audit
    assert 55<=len(beats)<=115,len(beats)
    reconstructed="".join(b["narration"] for b in beats)
    original="".join(norm(chunks[t]) for t in names)
    assert reconstructed==original, "Narration content must remain complete and in original order"
    result={"videoId":"V128","title":"労働学としての多様性｜なぜあなたは職場でもっと多様性を認めるべきか？",
        "speaker":13,"speed":1.15,"beats":beats,"sources":SOURCES,"chapterAudit":audit}
    (ROOT/"content").mkdir(parents=True,exist_ok=True)
    OUT.mkdir(parents=True,exist_ok=True)
    core.CONTENT.write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding="utf-8")
    print("MANUSCRIPT_VERBATIM",audit,"scenes",len(beats),flush=True)
    return result

def txt(d,s,x,y,maxw=1200,size=50,color=PAPER,serif=False):
    f=core.fit_text(d,s,maxw,size,22,serif)
    d.text((x,y),s,font=f,fill=color)
def ct(d,s,x,y,w,size=60,color=PAPER,serif=False):
    f=core.fit_text(d,s,w-28,size,22,serif)
    bb=d.textbbox((0,0),s,font=f)
    d.text((x+(w-(bb[2]-bb[0]))/2,y),s,font=f,fill=color)
def box(d,x1,y1,x2,y2,fill=PANEL,border=BORDER,r=16,th=3):
    d.rounded_rectangle((x1,y1,x2,y2),radius=r,fill=fill,outline=border,width=th)
def seg(d,x1,y1,x2,y2,color=MUTED,width=7):
    d.line([(x1,y1),(x2,y2)],fill=color,width=width)
def circle(d,x,y,r,color=MINT,border=None):
    d.ellipse((x-r,y-r,x+r,y+r),fill=color,outline=border,width=3 if border else 1)
def person(d,x,y,col=MINT,scale=1.0):
    r=22*scale
    circle(d,x,y-67*scale,r,PAPER)
    box(d,x-40*scale,y-36*scale,x+40*scale,y+69*scale,col,col,r=19*scale,th=1)
    seg(d,x-18*scale,y+65*scale,x-28*scale,y+92*scale,col,7)
    seg(d,x+18*scale,y+65*scale,x+28*scale,y+92*scale,col,7)
def pill(d,s,x,y,w=300,c=RED):
    box(d,x,y,x+w,y+61,(40,50,61),c,r=29,th=2)
    ct(d,s,x,y+7,w,35,PAPER)
def bar(d,x,y,w,v,col=RED):
    box(d,x,y,x+w,y+22,(42,54,64),(42,54,64),r=8)
    box(d,x,y,x+max(10,w*v),y+22,col,col,r=8,th=1)
def arrow(d,x1,y1,x2,y2,col=GOLD):
    seg(d,x1,y1,x2,y2,col,9)
    a=math.atan2(y2-y1,x2-x1)
    t=25
    d.polygon([(x2,y2),(x2-t*math.cos(a-.5),y2-t*math.sin(a-.5)),
               (x2-t*math.cos(a+.5),y2-t*math.sin(a+.5))],fill=col)
def doc(d,x,y,w,h,title,details=(),accent=GOLD):
    box(d,x,y,x+w,y+h,(233,231,219),(240,240,226),r=12)
    d.rectangle((x,y,x+w,y+14),fill=accent)
    txt(d,title,x+25,y+45,w-50,52,BG)
    for j,t in enumerate(details):
        txt(d,t,x+27,y+137+j*64,w-55,37,(71,85,93))
        seg(d,x+26,y+175+j*64,x+w-26,y+175+j*64,(199,196,183),2)
def speechbubble(d,x,y,s,w=390,accent=GOLD):
    box(d,x,y,x+w,y+94,PANEL,accent,r=16,th=3)
    ct(d,s,x,y+19,w,41,PAPER)
def card(d,label,x,y,w=360,accent=MINT,sub=""):
    box(d,x,y,x+w,y+255,PANEL,accent,r=16,th=3)
    ct(d,label,x,y+46,w,52,PAPER)
    if sub:ct(d,sub,x+9,y+152,w-18,33,MUTED)
def sheet(d,head,narrative=""):
    # Common lower white-on-dark evidence band, reserved subtitle zone starts y=862.
    box(d,185,757,1735,829,(37,48,60),(80,96,105),r=9,th=2)
    ct(d,narrative or head,205,765,1510,39,PAPER)

def art(d,b,idx,stage):
    mode=b["visual"]
    focus=b["callout"]
    # All display elements stay above y=750; subtitles occupy y=872..1020.
    if mode in ("meeting","vote","silence"):
        box(d,560,445,1360,672,(51,63,72),(95,117,120),r=86,th=6)
        for i in range(7):
            xx=490+(i%4)*310
            yy=385 if i<4 else 695
            if yy>690: yy=720
            person(d,xx,yy,RED if (i==6 and stage>=1) else MINT,.70)
        for j,s in enumerate(["部長","課長","若手"]):
            x=590+j*345
            if j==2 and stage==0 and mode=="silence":s="……"
            pill(d,s,x,590,250,RED if j==2 and stage>=1 else BLUE)
        if mode=="vote":
            speechbubble(d,595,278,"賛成",310,MINT)
            speechbubble(d,1020,278,"賛成" if stage==0 else "本当に？",310,RED if stage else MINT)
        elif mode=="silence":
            speechbubble(d,940,278,"異論はありますか？",570,RED)
        else:
            speechbubble(d,700,281,"この企画、どうでしょう？",680,GOLD)
    elif mode in ("interview","contrast","cost","tradeoff","caution"):
        if mode=="interview":
            card(d,"候補者 A",215,380,680,RED,"異業種／別の視点")
            card(d,"候補者 B",1025,380,680,MINT,"同窓／似た経験")
            for x in (550,1360):
                person(d,x,507,RED if x<900 else MINT,.72)
            pill(d,"評価 ≠ 好感",752,695,425,GOLD)
        elif mode=="tradeoff":
            card(d,"情報の多様さ",190,365,720,MINT,"新しい観点・発想")
            card(d,"調整のコスト",1010,365,720,RED,"摩擦・時間・衝突")
            if stage: arrow(d,930,500,1000,500,GOLD)
        elif mode=="cost":
            card(d,"見えるコスト",190,365,720,RED,"会議が長引く／不一致")
            card(d,"見えない損失",1010,365,720,MINT,"検討されなかった可能性")
            if stage:pill(d,"数字には表れにくい",725,685,490,GOLD)
        elif mode=="caution":
            card(d,"研究で言えること",210,370,690,MINT,"情報と議論の質")
            card(d,"直接は言えないこと",1020,370,690,RED,"売上が必ず増える")
        else:
            card(d,"似た意見",200,385,690,MINT,"会議が速く進む")
            card(d,"異なる視点",1030,385,690,RED,"判断の死角が減る可能性")
    elif mode in ("network","cohesion","conformity","dissent"):
        nodes=[(400,425),(540,385),(640,545),(345,595),(530,658),(760,473),
               (1150,403),(1325,505),(1450,374),(1500,611),(1210,640),(1050,566)]
        for i,(x,y) in enumerate(nodes):
            for j,(xx,yy) in enumerate(nodes):
                if j>i and math.hypot(x-xx,y-yy)<265:
                    seg(d,x,y,xx,yy,(58,78,89),3)
        for i,(x,y) in enumerate(nodes):
            col=RED if (mode in ("dissent","conformity") and i==8) or (stage>=1 and mode in ("network","cohesion") and i>=9) else MINT
            circle(d,x,y,38,col)
        if mode in ("dissent","conformity") and stage>=1:
            box(d,1025,279,1595,349,PANEL,RED,th=3)
            ct(d,"異論を口にする",1035,286,550,38,PAPER)
        if mode=="cohesion":pill(d,"結束 ≠ 正しい判断",689,705,555,GOLD)
    elif mode=="asa":
        labs=["誘引","選抜","離脱"];sub=["似た人が集まる","似た人を選ぶ","合わない人が去る"]
        for i in range(3):
            x=200+550*i
            card(d,labs[i],x,380,450,MINT if i!=2 else RED,sub[i])
            if i<2:arrow(d,x+455,507,x+542,507,GOLD)
        if stage>=1:pill(d,"同質化の自己強化",730,691,465,RED)
    elif mode in ("workflow","rules","premortem"):
        headings=(["従来の手順","転職者の提案","検討する"] if mode=="workflow" else
                  ["先に書く","反対を検討","根拠で決定"] if mode=="rules" else
                  ["失敗を想定","原因を列挙","事前に改善"])
        for i,h in enumerate(headings):
            x=190+550*i
            box(d,x,363,x+470,668,PANEL,RED if (stage==1 and i==1) else MINT,r=20,th=4)
            circle(d,x+235,440,51,GOLD)
            ct(d,str(i+1),x+170,408,130,52,BG)
            ct(d,h,x+12,545,446,43,PAPER)
            if i<2:arrow(d,x+474,518,x+535,518,GOLD)
    elif mode=="cuba":
        # Schematic history slide, not a literal cartographic reconstruction.
        d.polygon([(260,505),(610,412),(995,443),(1440,545),(1640,592),(1380,658),
                   (860,602),(510,640)],fill=(53,80,86),outline=MINT)
        for i,(x,y) in enumerate([(360,515),(575,488),(820,520),(1060,545),(1390,574)]):
            circle(d,x,y,22,RED if i==3 else GOLD)
        txt(d,"1961年4月",260,320,740,82,GOLD,True)
        speechbubble(d,995,340,"ピッグス湾侵攻",620,RED)
        txt(d,"※歴史的事件を示す模式図",265,707,730,31,MUTED)
    elif mode in ("book","report","research135","research65","research146","research2024","research2023","research1999"):
        name={
          "book":("集団浅慮","古賀史健／組織の同質性"),
          "report":("2025","第三者委員会／組織ガバナンス"),
          "research135":("135組","Schulz-Hardtほか／2006"),
          "research65":("65研究","Luほか／2012"),
          "research146":("146研究","van Dijkほか／2012"),
          "research2024":("2024","van Knippenberg"),
          "research2023":("2023","チーム創造性のメタ分析"),
          "research1999":("1999","Edmondson／心理的安全性"),
        }[mode]
        doc(d,250,352,1430,385,name[0],[name[1],focus,b["headline"]],GOLD)
        if mode=="research65":pill(d,"3189グループ",725,652,480,RED)
        if mode=="research135":pill(d,"3人×135組",725,652,480,RED)
        if mode=="report":pill(d,"歴史と組織の検証",725,652,480,RED)
    elif mode=="hierarchy":
        box(d,758,341,1160,429,PANEL,RED)
        ct(d,"経営層",770,353,380,48,PAPER)
        for i in range(3):
            x=245+550*i
            seg(d,960,431,x+205,508,BORDER,6)
            box(d,x,508,x+410,623,PANEL,MINT)
            ct(d,["営業","企画","現場"][i],x+8,540,395,42,PAPER)
        if stage>=1:
            box(d,743,672,1181,732,(74,41,46),RED)
            ct(d,"異論が上に届かない",755,686,410,32,PAPER)
    elif mode=="blindspot":
        d.ellipse((456,310,1436,740),outline=MINT,width=15)
        d.pieslice((456,310,1436,740),-28,46,fill=(94,53,57),outline=RED,width=4)
        ct(d,"見えている市場",640,476,610,54,PAPER)
        if stage>=1:ct(d,"見落とした顧客",1270,702,490,36,RED)
    elif mode in ("hidden","logistics","candidates","bias"):
        left=["営業担当","経理担当","物流担当"]
        for i in range(3):
            x=163+i*570
            lab=left[i] if mode in ("hidden","logistics") else "参加者 "+str(i+1)
            box(d,x,350,x+510,686,PANEL,BLUE if i!=1 else GOLD,r=17,th=3)
            ct(d,lab,x+9,370,490,46,PAPER)
            common="共有情報：Aが有利"
            ct(d,common,x+12,468,485,34,MINT)
            if stage:
                secret=["顧客は価格に敏感","将来の維持費が高い","B地区で道路整備"][i]
                box(d,x+19,564,x+491,632,(78,43,51),RED,r=9,th=2)
                ct(d,secret,x+25,579,460,31,PAPER)
            else:ct(d,"独自情報：未共有",x+12,585,485,35,MUTED)
        if mode=="candidates":pill(d,"※実験構造の模式図",739,710,462,GOLD)
        if mode=="logistics":pill(d,"説明用の仮想事例",739,710,462,GOLD)
    elif mode=="jury":
        box(d,210,356,855,682,PANEL,MINT)
        box(d,1060,356,1710,682,PANEL,RED)
        ct(d,"同質のグループ",231,387,605,50,PAPER)
        ct(d,"多様なグループ",1080,387,608,50,PAPER)
        for i in range(6):
            col=BLUE if i%2==0 else GOLD
            circle(d,330+(i%3)*160,520+(i//3)*95,21,BLUE)
            circle(d,1160+(i%3)*160,520+(i//3)*95,21,col)
        if stage:pill(d,"事実の検討に違い",716,710,490,GOLD)
    elif mode in ("product","phone","tasks","risk"):
        if mode=="product":
            box(d,262,372,826,700,PANEL,RED)
            box(d,1118,372,1679,700,PANEL,MINT)
            ct(d,"作る側の想像",282,407,516,46,PAPER)
            ct(d,"使う人の現実",1135,407,525,46,PAPER)
            d.rectangle((408,518,669,641),fill=(226,199,139),outline=GOLD,width=6)
            d.ellipse((1302,519,1483,658),fill=(77,106,119),outline=GOLD,width=8)
            if stage:arrow(d,842,548,1104,548,GOLD)
        elif mode=="phone":
            box(d,710,344,1210,722,(39,48,59),MINT,r=57,th=12)
            d.rounded_rectangle((760,390,1160,666),radius=13,fill=(227,234,230))
            txt(d,"文字が小さい",783,434,354,36,BG)
            txt(d,"操作が複雑",783,511,354,36,RED)
            if stage: pill(d,"実際の利用者を想像できるか",560,705,780,RED)
        elif mode=="tasks":
            card(d,"標準化が有効",190,375,730,MINT,"同じ手順で安定品質")
            card(d,"多角的な発想",1005,375,730,RED,"新しい商品の開発")
        else:
            card(d,"発売前に発見",190,375,730,MINT,"顧客の障害・不便")
            card(d,"発売後に修正",1005,375,730,RED,"改修費・機会損失")
    elif mode=="pr":
        # Publicity photo and actual meeting outcome are contrasted, without stereotypes.
        box(d,250,359,1690,715,PANEL,GOLD,r=16)
        for i in range(7):
            person(d,390+i*187,522,[MINT,BLUE,GOLD,RED][i%4],.81)
        if stage:
            box(d,585,602,1322,680,(79,42,48),RED)
            ct(d,"意見は採用されない",600,617,703,41,PAPER)
    elif mode=="safety":
        box(d,230,374,876,683,PANEL,RED)
        box(d,1048,374,1694,683,PANEL,MINT)
        ct(d,"発言すると損をする",241,466,623,44,PAPER)
        ct(d,"反論しても検討される",1058,466,625,44,PAPER)
        if stage: pill(d,"心理的安全性 ≠ 仲良し",717,705,500,GOLD)
    elif mode=="departments":
        labels=["営業：売上","経理：利益","開発：品質","製造：原価"]
        for i,s in enumerate(labels):
            x=190+(i%2)*827;y=355+(i//2)*186
            box(d,x,y,x+730,y+156,PANEL,[MINT,GOLD,BLUE,RED][i])
            ct(d,s,x+10,y+50,710,48,PAPER)
    elif mode=="failure":
        for i in range(5):
            x=410+i*285
            h=(250,220,159,94,36)[i]
            box(d,x,691-h,x+175,691,RED if i>=3 else BLUE,RED if i>=3 else BLUE,r=6,th=1)
        seg(d,330,700,1650,700,MUTED,3)
        txt(d,"架空の売上推移：企画見直し",420,359,1100,48,PAPER)
        txt(d,"※実データではありません",420,725,700,29,MUTED)
    elif mode=="question":
        box(d,210,374,1710,690,PANEL,RED,r=32,th=5)
        ct(d,"なぜ誰も反論しなかったのか？",240,473,1440,73,PAPER,True)
    elif mode in ("thesis","ending"):
        box(d,195,351,1725,717,(37,41,50),RED if mode=="ending" else GOLD,r=30,th=5)
        words=focus if mode=="thesis" else "間違った答えに全員が賛成しない"
        pieces=[words[:len(words)//2],words[len(words)//2:]] if len(words)>15 else [words]
        for i,s in enumerate(pieces):
            ct(d,s,246,447+i*105,1430,74,GOLD if i==0 else PAPER,True)
    else:
        card(d,"意見A",260,382,600,MINT,"肯定・共有情報")
        card(d,"意見B",1050,382,600,RED,"異論・独自情報")
    if mode not in ("thesis","ending"):
        sheet(d,b["headline"],focus)

def build_slide(beat,idx,stage,first):
    rng=random.Random(128000+idx*53)
    im=Image.new("RGB",(W,H),BG)
    d=ImageDraw.Draw(im)
    for i in range(1200):
        x=rng.randrange(W);y=rng.randrange(850)
        v=rng.randint(-7,7)
        d.point((x,y),fill=(max(0,17+v),max(0,23+v),max(0,33+v)))
    d.rectangle((0,0,W,14),fill=RED)
    d.rectangle((0,857,W,H),fill=(12,17,23))
    box(d,82,61,100,132,RED,RED,r=3,th=1)
    txt(d,"考える夜  /  LABOR × GROUP DECISION",128,66,1330,34,GOLD)
    txt(d,f"V128  {core.NUMBERS[beat['chapter']]} / 05",1520,69,320,32,MUTED)
    txt(d,beat["chapterTitle"],136,143,1590,43,MINT)
    txt(d,beat["headline"],135,208,1584,74,PAPER,True)
    art(d,beat,idx,stage)
    if stage==2:
        # Distinct graphic grammar for punch lines, not a recurring full-frame black card.
        box(d,255,404,1665,705,(30,36,47),RED,r=24,th=5)
        words=beat["callout"]
        ct(d,words,270,505,1380,82,PAPER,True)
    # Render-safe reserved subtitles: 870..1019. No illustrative object can cross.
    txt(d,"LABOR ECONOMICS  /  多様性と判断力",135,1044,1050,23,(124,138,147))
    txt(d,f"{idx+1:03d}",1770,1044,95,24,(124,138,147))
    return im

def prepare():
    data=compile_manuscript()
    beats=data["beats"]
    seq=[]
    for i,b in enumerate(beats):
        stage_list=(0,1,2) if (i%4==0 or b["visual"] in (
            "hidden","logistics","research135","research65","research146",
            "thesis","ending","asa","report","failure","safety")) else (0,1)
        for stage in stage_list:
            p=OUT/f"shot-{i:03d}-{stage}.png"
            build_slide(b,i,stage,i==0 or b["chapter"]!=beats[i-1]["chapter"]).save(p,optimize=True)
            seq.append({"index":i,"stage":stage,"path":str(p)})
    (OUT/"slides.json").write_text(json.dumps(seq,ensure_ascii=False,indent=2),encoding="utf-8")
    # Chapter-aware tiled visual inspection; one distinct screen per meaning beat.
    cols=8;cw=320;ch=180;rows=math.ceil(len(beats)/cols)
    contact=Image.new("RGB",(cols*cw,rows*ch),(20,27,36))
    for i in range(len(beats)):
        image=Image.open(OUT/f"shot-{i:03d}-1.png")
        contact.paste(image.resize((cw,ch),Image.Resampling.LANCZOS),((i%cols)*cw,(i//cols)*ch))
    contact.save(OUT/"v128-contact-sheet.jpg",quality=88)
    (OUT/"SOURCES.txt").write_text("\n".join(SOURCES)+"\n",encoding="utf-8")
    print("VISUAL_READY",len(beats),"scenes",len(seq),"states",flush=True)

def voice():
    # Tested measured-VOICEVOX engine from V125, same beat ids for scene/voice/subtitle.
    core.voice()
    info=json.loads((OUT/"timing.json").read_text())
    assert info["totalSeconds"]>600, f"Narration too short: {info['totalSeconds']:.1f}s"
    assert len(info["beats"])==len(json.loads(core.CONTENT.read_text())["beats"])
    assert info["cues"]>=150
    print("AUDIO_QA",info["totalSeconds"],"seconds",info["cues"],"cues",flush=True)

def render():
    core.render()
    src=OUT/"v125-black-death-economy-final.mp4"
    dst=OUT/"v128-groupthink-diversity-final.mp4"
    src.rename(dst)
    q=json.loads((OUT/"v125-final-qa.json").read_text(encoding="utf-8"))
    q["videoId"]="V128"
    q["title"]="労働学としての多様性"
    q["renderedFilename"]=dst.name
    q["narrationCoverage"]="verbatim exact normalization match"
    q["visualDesign"]="meaning-bound office narrative and varied research graphics"
    (OUT/"v128-final-qa.json").write_text(json.dumps(q,ensure_ascii=False,indent=2),encoding="utf-8")
    (OUT/"v125-final-qa.json").unlink(missing_ok=True)
    print("V128_COMPLETED",json.dumps(q,ensure_ascii=False),flush=True)

if __name__=="__main__":
    mode=sys.argv[1] if len(sys.argv)>1 else "all"
    if mode in ("compile","prepare","all"):prepare()
    if mode in ("voice","all"):voice()
    if mode in ("render","all"):render()
