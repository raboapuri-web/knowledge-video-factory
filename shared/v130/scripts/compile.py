#!/usr/bin/env python3
"""Compile V130 Japanese master into authored Motion Canvas chapter scenes.
Source text is covered 100%; no approximate timing may be used for final render.
"""
from pathlib import Path
import json,re
ROOT=Path(__file__).resolve().parents[1]
SRC=ROOT/"content"/"manuscript.txt"
CONTENT=ROOT/"content"; SCENES=ROOT/"src"/"scenes";PROJECTS=ROOT/"src"/"projects"
for p in (CONTENT,SCENES,PROJECTS):p.mkdir(parents=True,exist_ok=True)
CHAPTERS=["prologue","chapter1","chapter2","chapter3","chapter4","chapter5","chapter6","epilogue"]
SECTIONS=["PROLOGUE"]+[f"CHAPTER{i}" for i in range(1,7)]+["EPILOGUE"]
HEADINGS={
"prologue":"美徳が国を滅ぼした","chapter1":"あなたの支出は誰かの所得",
"chapter2":"貯蓄率30％の逆転","chapter3":"銀行と投資のすれ違い",
"chapter4":"2008年 金融危機","chapter5":"節約は悪なのか","chapter6":"誰が需要を支えるのか",
"epilogue":"個人の正しさと社会の豊かさ"}
# visual / editorial headline / qualifier: one distinct semantic state per paragraph.
PLANS={
"prologue":[
("hive","繁栄する蜂の国","『蜂の寓話』の想像上の国"),
("luxury","欲望が動かす経済","商人・職人・住民"),
("shutdown","美徳の後に起きたこと","仕事・売上・需要の消失"),
("book","1714年『蜂の寓話』","寓話・実証研究ではない"),
("timeline","1936年 ケインズ","『一般理論』"),
("household","貯蓄は合理的なのに","個人にとっては正しい判断"),
("paradox","個人と全体の逆転","今日の中心命題")],
"chapter1":[
("street","金曜夜の選択","外食する／節約する"),
("wallet","支出を減らして貯蓄","個人家計の合理性"),
("supply","居酒屋から工場へ","客数→売上→雇用→発注"),
("allocation","節約分が消えるとは限らない","別の支出・将来の消費"),
("ledger","支出は誰かの所得","売上・仕入れ・賃金"),
("identity","家計簿と社会の違い","合成の誤謬"),
("audience","全員が立つコンサート","一人の最適≠全員の最適"),
("network","社会の支出が同時に縮小","誰かの所得は自分の所得"),
("bank","使わないお金はどこへ？","核心に向かう反論")],
"chapter2":[
("model","家計と企業だけの経済","政府・海外部門なし／架空モデル"),
("baseline","所得1,000万円の社会","消費800・貯蓄200・投資200"),
("rate","貯蓄率20％→30％","所得が固定なら貯蓄は増える"),
("demand","消費800→700万円","需要不足の発生"),
("loop","生産と所得が減る連鎖","売れ残り→生産減→所得減"),
("collapse","所得は約667万円","貯蓄率30％／実現貯蓄200万円"),
("compare","貯蓄額は増えなかった","所得1,000→約667万円"),
("investment","投資200→150万円","所得500・貯蓄150万円"),
("caveat","この数字は理論モデル","金利・物価・財政等は省略"),
("incomes","所得は固定されていない","個人と社会の決定的な違い"),
("accounting","事後的な貯蓄＝投資","家計の希望と実現額は別"),
("definitions","預金残高と期間貯蓄","混同しない")],
"chapter3":[
("bank","貯蓄が投資を支える場合","貯蓄は悪ではない"),
("research","設備と研究開発","長期の生産力を高める"),
("factory","売れない家具の倉庫","設備には余裕がある"),
("credit","低金利でも借りない","買い手がいなければ投資しない"),
("expectation","将来需要と期待利益","融資条件だけでは決まらない"),
("money","貸出が預金を生み出す","Bank of England／2014"),
("balance","貸出には制約がある","返済・自己資本・事業の採算"),
("feedback","消費減少と投資減少","相互に強め合う悪循環"),
("cycle","不安が予想を実現する","合理的行動の集積")],
"chapter4":[
("timeline","2008年 世界金融危機","住宅バブル崩壊と債務"),
("house","住宅価格が下がっても","借金は同じ割合で減らない"),
("debt","家計の借入を減らす","返済のために消費を削る"),
("research","Mian & Sufi／2010","地域別の債務と耐久財消費"),
("regions","地元の店は逃げられない","非貿易財産業への波及"),
("employment","地域の需要と雇用","Mian & Sufi／2012・2013"),
("inequality","余裕の少ない家計ほど","所得・資産ショックへの反応"),
("qualification","金融危機の原因は複数","相関・因果の射程を限定"),
("debttrap","返済努力が返済力を奪う","家計の合理性と集計結果")],
"chapter5":[
("counter","貯金をやめればいいのか？","それは誤解"),
("investment","短期需要と長期成長","生産能力への投資"),
("capacity","供給不足の経済","消費増加が物価上昇にも"),
("idle","需要不足の経済","工場と労働力が余る"),
("rate","金利・為替・投資の調整","結果は常に同じではない"),
("conditions","善悪でなく条件を問う","需要／供給／投資"),
("paradox","美徳と経済効果は別","経済学の問い")],
"chapter6":[
("idle","誰も買わない社会","失業と余剰設備"),
("government","政府は何をできるか","インフラ・所得保障・税制"),
("support","失業者の消費の下支え","自動安定化装置"),
("research","財政乗数は局面で違う","Auerbach & Gorodnichenko"),
("imf","緊縮と成長予測の誤差","Blanchard & Leigh／2013"),
("inflation","政府支出は万能でない","インフレと財政制約"),
("compare","家計簿と国家財政","個人とマクロの違い"),
("decision","使う／節約する ではない","条件・費用・価値"),
("institutions","悪循環を断つ仕組み","制度的な調整")],
"epilogue":[
("hive","蜂たちの国へ戻る","欲望・美徳・繁栄"),
("judgement","悪人探しで終わらない","社会構造の問題"),
("cycle","合理性の衝突","家計・企業・政府"),
("household","明日から浪費は不要","貯蓄も生活を守る"),
("network","支出は誰かの所得","相互依存の構造"),
("thesis","個人の最適≠社会の最適","倹約のパラドックス"),
("ending","社会の豊かさはどう決まる","考える夜")]}
def segments(src,max_chars=34):
    # Keep all spoken source characters; break at semantic punctuation and particles.
    out=[]
    for unit in re.findall(r'[^。！？!?]*[。！？!?]|[^。！？!?]+$',src):
        while unit:
            if len(unit)<=max_chars:out.append(unit);break
            cuts=[i+1 for i,ch in enumerate(unit[:max_chars]) if ch in "、，,；」』" and i>=15]
            if not cuts: cuts=[i+1 for i,ch in enumerate(unit[:max_chars]) if ch in "はがをにでへともし" and i>=20]
            cut=max(cuts) if cuts else max_chars
            out.append(unit[:cut]);unit=unit[cut:]
    assert ''.join(out)==src
    return out
def speech_fix(s):
    subs=[
      ("1714年","せんななひゃくじゅうよねん"),("1936年","せんきゅうひゃくさんじゅうろくねん"),
      ("2008年","にせんはちねん"),("2010年","にせんじゅうねん"),("2012年","にせんじゅうにねん"),
      ("2013年","にせんじゅうさんねん"),("2014年","にせんじゅうよねん"),
      ("1,000万円","せんまんえん"),("3,000円","さんぜんえん"),
      ("667万円","ろっぴゃくろくじゅうななまんえん"),("800万円","はっぴゃくまんえん"),
      ("700万円","ななひゃくまんえん"),("900万円","きゅうひゃくまんえん"),
      ("500万円","ごひゃくまんえん"),("300万円","さんびゃくまんえん"),
      ("200万円","にひゃくまんえん"),("150万円","ひゃくごじゅうまんえん"),
      ("100万円","ひゃくまんえん"),("80％","はちじゅっぱーせんと"),
      ("70％","ななじゅっぱーせんと"),("30％","さんじゅっぱーせんと"),
      ("20％","にじゅっぱーせんと"),("Mian","ミアン"),("Sufi","スーフィ"),
      ("Bank of England","イングランド銀行"),("IMF","アイエムエフ")
    ]
    for a,b in subs:s=s.replace(a,b)
    return s
def compile():
    raw=SRC.read_text(encoding="utf-8")
    parts=re.split(r"(?m)^## (PROLOGUE|CHAPTER[1-6]|EPILOGUE)\s*$",raw)
    sections={parts[i]:parts[i+1] for i in range(1,len(parts)-1,2)}
    assert set(sections)==set(SECTIONS),(set(sections),SECTIONS)
    scenes=[];info={};meta={"version":1,"shared":{"background":"rgb(9,17,29)","range":[0,None],"size":{"x":1920,"y":1080},"audioOffset":0},"preview":{"fps":30,"resolutionScale":.5},"rendering":{"fps":30,"resolutionScale":1,"colorSpace":"srgb","exporter":{"name":"@motion-canvas/ffmpeg","options":{"fastStart":True,"includeAudio":True}},"fileType":"image/png","quality":1}}
    for chapter,section in zip(CHAPTERS,SECTIONS):
        source=re.sub(r"\r","",sections[section]).strip()
        paragraphs=[re.sub(r"\s+","",p) for p in re.split(r"\n\s*\n",source) if p.strip()]
        plan=PLANS[chapter]
        assert len(paragraphs)==len(plan),(chapter,len(paragraphs),len(plan))
        ids=[]
        for i,(paragraph,(visual,title,note)) in enumerate(zip(paragraphs,plan)):
            id=chapter.upper()+"_"+str(i+1).zfill(2); ids.append(id)
            cues=[];clock=0.0
            for text in segments(paragraph):
                # the following durations are PREVIEW ONLY; voice measurement replaces them.
                duration=max(.85,len(text)/6.9)
                first=text[:18];second=text[18:]
                display=first+("\n"+second if second else "")
                assert len(second)<=18
                cues.append({"text":text,"speech":speech_fix(text),"display":display,
                             "start":round(clock,5),"end":round(clock+duration,5)})
                clock+=duration
            scene={"id":id,"chapter":chapter,"section":HEADINGS[chapter],"visual":visual,
                  "title":title,"note":note,"narration":paragraph,"cues":cues,"duration":round(clock,5),
                  "durationSource":"PREVIEW_ONLY","sceneIndex":i,"sceneTotal":len(plan)}
            scenes.append(scene)
            (SCENES/f"{id}.tsx").write_text(
                "import {makeScene2D} from '@motion-canvas/2d';\n"
                "import {playScene} from '../lib/director';\n"
                "import scenes from '../../content/scenes.json';\n"
                f"const scene=scenes.find(s=>s.id==='{id}')!;\n"
                "export default makeScene2D(function* (view){yield* playScene(view,scene);});\n",encoding="utf-8")
        imports="\n".join(f"import s{i} from '../scenes/{sid}?scene';" for i,sid in enumerate(ids))
        project="import {makeProject} from '@motion-canvas/core';\n"+imports+f"\nexport default makeProject({{name:'v130-{chapter}',scenes:["+','.join(f's{i}' for i in range(len(ids)))+f"],audio:'/media/{chapter}/narration.wav'}});\n"
        (PROJECTS/f"{chapter}.ts").write_text(project,encoding="utf-8")
        (PROJECTS/f"{chapter}.meta").write_text(json.dumps(meta),encoding="utf-8")
        joined="".join(x["narration"] for x in scenes if x["chapter"]==chapter)
        assert joined=="".join(paragraphs)
        info[chapter]={"paragraphs":len(paragraphs),"chars":len(joined),"cues":sum(len(x["cues"]) for x in scenes if x["chapter"]==chapter)}
    assert sum(x["chars"] for x in info.values())>=8000,info
    assert len(scenes)>=65
    CONTENT.joinpath("scenes.json").write_text(json.dumps(scenes,ensure_ascii=False,indent=2),encoding="utf-8")
    CONTENT.joinpath("audit.json").write_text(json.dumps({"chapters":info,"scenes":len(scenes),"cues":sum(len(x["cues"]) for x in scenes),"source":"content/manuscript.txt","exactCoverage":True},ensure_ascii=False,indent=2),encoding="utf-8")
    print("COMPILED",json.dumps(info,ensure_ascii=False),len(scenes))
if __name__=="__main__":compile()
