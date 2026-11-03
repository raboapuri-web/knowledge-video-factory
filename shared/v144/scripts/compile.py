#!/usr/bin/env python3
from pathlib import Path
import json,re,hashlib,collections
R=Path(__file__).resolve().parents[1]; C=R/'content';S=R/'src/scenes';P=R/'src/projects'
for p in (C,S,P):p.mkdir(parents=True,exist_ok=True)
ORDER=["prologue","chapter1","chapter2","chapter3","chapter4","epilogue"]
HEAD=["プロローグ","第1章","第2章","第3章","第4章","エピローグ"]
LABELS=["早期発見の不都合な真実","リードタイム・バイアス","レングス・バイアスと過剰診断","UKCTOCSとNLST","グッドハートの法則","知らなかった方が健康だった？"]
PLANS={
  "prologue": [
    "headline|2010年の肺がん検診受診率|26.4%|男性40〜69歳|厚生労働省",
    "bar2|肺がん検診は9年で約2倍|26.4%（2010年）|53.4%（2019年）|男性40〜69歳",
    "hypothesis|では平均寿命は？|検診が増えれば|寿命も延びる？",
    "metric2|男性の平均寿命|79.55歳|81.41歳|2010年 → 2019年",
    "difference|2倍と1.86年|検診受診率 約2倍|平均寿命 +1.86年|単純な因果比較ではない",
    "inversion|数字に潜む矛盾|受診率は増加|寿命は比例しない|さらに奇妙な現象",
    "duel|生存率と寿命|5年生存率 上昇|寿命 変化なし|両方は同じか？",
    "thesis|医療の進歩を何で測る？|早期発見|命を救う|数字の錯覚"
  ],
  "chapter1": [
    "divider|寿命を延ばさず生存期間を延ばす|66歳で診断|70歳で死亡",
    "timeline|最初のシナリオ|66歳 診断|70歳 死亡|診断後4年",
    "contrast|診断を3年早めたら|63歳 発見|70歳 死亡|66歳は元の診断日",
    "bar2|見かけの生存期間|4年（従来）|7年（早期発見）|死亡年齢は70歳のまま",
    "metric2|生存期間だけが変わる|4年|7年|5年生存の判定も変化",
    "duel|どこが動いたのか|死亡日 変わらず|診断日 3年前倒し",
    "thesis|リードタイム・バイアス|診断の起点|死亡までの期間|錯覚の仕組み",
    "matrix|同じことが多数に起きたら|100人|1,000人|診断後生存率|死亡日",
    "contrast|数字上の成功と現実|成績は改善|寿命は同じ|架空の思考実験",
    "difference|本当に救えた命か|早期発見の利益|5年生存率だけでは不明",
    "hypothesis|統計の罠はこれだけ？|診断の時期|病気の進行速度"
  ],
  "chapter2": [
    "divider|見つけやすい病気は危険か？|がんは同じ速さで育たない",
    "gradient|進行スピードの違い|ゆっくり|中間|急速",
    "timeline|年1回の検診：ゆっくり|1年目|2年目|3年目|5年間発見機会",
    "duel|速いがんがすり抜ける|5年間の早期段階|数か月の早期段階|検診間隔は1年",
    "headline|レングス・バイアス|成長が遅いがんほど|検診で発見されやすい",
    "filter|検査が選びやすい対象|増殖の遅いがん|症状の出ないがん|検出される集団",
    "thesis|過剰診断とは|存在する病気|生涯問題を起こさない|誤診とは違う",
    "cascade|見つかると何が起きる？|診断|精密検査|手術|合併症の可能性",
    "quote|私は命を救われた|10年後も健康|本当に救命が必要だった？",
    "dilemma|生涯症状がないがんなら|治療で救命|治療なしでも無症状|個別には予測困難",
    "xray|病気を見つけた瞬間|実際に存在|将来の進行は不確実|見つけた＝救った？",
    "contrast|どちらも決めつけられない|見つけなければよかった|見つけたから助かった",
    "study|これは理論だけではない|医学研究|検診の効果|死亡率という結果"
  ],
  "chapter3": [
    "divider|卵巣がん検診 UKCTOCS|英国 約20万人|2021年 Lancet",
    "ratio|早期がんの発見が増えた|47.2%|ステージ1|比較：非検診群",
    "headline|最も進行したがんは減った|24.5%減少|ステージ4",
    "hypothesis|ならば死亡率は下がった？|早期発見に成功|死亡率の結果は？",
    "headline|卵巣がん死亡率|有意な低下なし|約16年間の追跡",
    "difference|発見と救命は別の結果|早期がん 発見増|死亡率 改善確認できず",
    "thesis|医療の逆説|発見能力が向上|治療結果が変わるとは限らない",
    "inversion|早期発見は無意味？|そう断定するのも誤り|別の試験を見よう",
    "study|肺がん検診 NLST|米国 約5万3,000人|胸部X線 vs 低線量CT|高リスク集団",
    "metric2|NLST：実際の死亡率低下|20%減|6.7%減|左：肺がん死 ／ 右：全死因死",
    "duel|同じ検診でも結果が違う|早く見つけた|命を救えた|目的を見誤らない",
    "method|救命につながる条件|発見できる期間|有効な検査|有効な治療|不利益との比較",
    "thesis|早ければいい、ではない|早期発見は手段|未来を変えることが目的"
  ],
  "chapter4": [
    "divider|数字がよければ世界もよい？|医学から経済学へ",
    "quote|グッドハートの法則|指標が目標になると|指標はよい指標でなくなる",
    "method|メール件数で社員を評価|送信件数|たくさん送る|生産性は別問題",
    "difference|数値が伸びても|メール件数 増加|仕事の成果は不明",
    "duel|医療の指標と目的|発見数と生存率|健康で長生き",
    "contrast|測りやすさの罠|死亡率の検証は長期|発見数はわかりやすい",
    "causal|手段が目的に化ける|測定する|目標にする|数字を改善|成果と誤認",
    "study|医療で必要な検証|検診を受けた群|受けない群|病気による死亡率",
    "difference|病気を見つける≠命を救う|診断日の前倒し|死亡日の後ろ倒し",
    "analogy|数字が示すもの|発見という出来事|救命という結果",
    "matrix|別の場所にも同じ錯覚|勉強時間|会議の回数|検挙件数|本当の成果",
    "hypothesis|私たちは何を測っている？|目標に近い数字か|測りやすい数字か"
  ],
  "epilogue": [
    "divider|知らなかった方が健康だった？|検査前後で体は同じ",
    "quote|医師からの一言|10年後も問題ないかも|進行する可能性もある",
    "duel|昨日と今日|健康だと思っていた|病気だと知った|体は変わらない",
    "difference|変化したのは情報だけ|体の状態は同じ|知識と不安は変わる",
    "dilemma|情報は何をもたらす？|適切な治療と救命|不必要な不安",
    "method|問うべき検診の条件|誰に|何を|どの方法で|利益はあるか",
    "inversion|見えるものを全部消す？|発見できる力|介入すべき病気|必ずしも同一でない",
    "outro|あなたにとって健康とは何か|考える夜"
  ]
}
PLAN_ENDS={"prologue":[2,3,4,6,8,10,12,14],"chapter1":[4,6,8,11,14,16,18,21,24,26,28],"chapter2":[5,8,11,14,17,20,23,26,29,32,34,36,38],"chapter3":[4,6,8,10,12,14,17,20,23,26,29,32,35],"chapter4":[5,8,11,14,17,20,23,26,29,32,35,37],"epilogue":[3,5,7,10,12,15,17,20]}
def normalized(text):return re.sub(r'\s+','',text.replace('**',''))
def segments(text):
    out=[s for s in re.findall(r'[^。！？!?]*[。！？!?]?',text) if s]
    assert ''.join(out)==text
    return out
def partition(text,n):
    parts=segments(text); out=[]; i=0
    assert len(parts)>=n, (len(parts),n)
    for step in range(n):
        slots=n-step;limit=len(parts)-(slots-1);want=sum(len(x) for x in parts[i:])/slots
        acc=''
        while i<limit and (len(acc)<want*.84 or not acc):
            acc+=parts[i];i+=1
        out.append(acc)
    assert i==len(parts) and ''.join(out)==text
    return out

def partition_by_paragraph(raw,ends):
    arr=[normalized(s) for s in raw.splitlines() if normalized(s)]
    assert ends[-1]==len(arr),(ends[-1],len(arr))
    out=[];start=0
    for end in ends:
        piece=''.join(arr[start:end])
        assert piece
        out.append(piece);start=end
    assert ''.join(out)==''.join(arr)
    return out

def voice(text):
    d={'YouTuber':'ユーチューバー','YouTube':'ユーチューブ','Instagram':'インスタグラム','ABEMA TIMES':'アベマタイムズ','Baxter':'バクスター','Czarnecka':'チャルネツカ','Clark':'クラーク','Jno-Charles':'ジョノチャールズ','SNS':'エスエヌエス','2026':'にせんにじゅうろく','2025':'にせんにじゅうご','2024':'にせんにじゅうよん','2020':'にせんにじゅう','1938':'せんきゅうひゃくさんじゅうはち','1921':'せんきゅうひゃくにじゅういち','1989':'せんきゅうひゃくはちじゅうきゅう','2,200':'にせんにひゃく','5,253':'ごせんにひゃくごじゅうさん','46.4':'よんじゅうろくてんよん','75':'ななじゅうご'}
    for a,b in sorted(d.items(),key=lambda x:-len(x[0])):text=text.replace(a,b)
    return text.replace('％','パーセント')
def captions(text):
    out=[]
    for sentence in segments(text):
        while sentence:
            if len(sentence)<=30:part,sentence=sentence,''
            else:
                cuts=[j+1 for j,ch in enumerate(sentence[:29]) if ch in '、，」』' and j>=11]
                pos=cuts[-1] if cuts else 27
                part,sentence=sentence[:pos],sentence[pos:]
            cut=(len(part)+1)//2
            display=part if len(part)<=16 else part[:cut]+'\n'+part[cut:]
            assert max(len(x) for x in display.split('\n'))<=16
            out.append(dict(text=part,speech=voice(part),display=display,start=0,end=max(.55,len(part)/7.0)))
    assert ''.join(c['text'] for c in out)==text
    return out
def main():
    src=(C/'manuscript.md').read_text(encoding='utf-8')
    matches=re.findall(r'(?m)^## ([^\n]+)\n(.*?)(?=^## |\Z)',src,re.S|re.M)
    chunks={};raw_chunks={}
    for label,part in matches:
        for word,ch in zip(HEAD,ORDER):
            if label.startswith(word):chunks[ch]=normalized(part);raw_chunks[ch]=part;break
    assert set(chunks)==set(ORDER),chunks.keys()
    scenes=[];slides=[];chapters={}
    for ch in ORDER:
        plan=[(a[0],a[1],a[2:]) for a in [x.split('|') for x in PLANS[ch]]]
        pieces=partition_by_paragraph(raw_chunks[ch],PLAN_ENDS[ch])
        chapters[ch]=len(plan)
        for j,((layout,headline,labels),text) in enumerate(zip(plan,pieces)):
            i=len(scenes)+1;id=f'S{i:03}';cu=captions(text)
            effect=(i*11+i//7*3)%29
            slides.append(dict(id=id,layout=layout,headline=headline,labels=labels,effect=effect))
            scenes.append(dict(id=id,chapter=ch,section=LABELS[ORDER.index(ch)],title=headline,visual=layout,
              visualInstruction='プレゼンの図解のみ。実写・芝居・情景描写なし。',
              motionInstruction=f'レイアウト固有のモーション＋意味に沿った強調 No.{effect}',
              narration=text,cues=cu,sceneIndex=i-1,duration=sum(x['end'] for x in cu),durationSource='PREVIEW_ONLY'))
    assert ''.join(s['narration'] for s in scenes)==''.join(chunks[k] for k in ORDER)
    assert len(set(s['layout'] for s in slides))>=20
    assert all(a['layout']!=b['layout'] for a,b in zip(slides,slides[1:]))
    assert all(a['effect']!=b['effect'] for a,b in zip(slides,slides[1:]))
    (C/'scenes.json').write_text(json.dumps(scenes,ensure_ascii=False,indent=2))
    (C/'slide-spec.json').write_text(json.dumps({'version':'v144','style':'editorial slide documentary','specs':slides},ensure_ascii=False,indent=2))
    for ch in ORDER:
        arr=[s for s in scenes if s['chapter']==ch]
        for s in arr:
            (S/(s['id']+'.tsx')).write_text(
                "import {makeScene2D} from '@motion-canvas/2d';\n"
                "import {playScene} from '../lib/director';\n"
                "import scenes from '../../content/scenes.json';\n"
                "const shot=scenes.find(x=>x.id==='"+s['id']+"')!;\n"
                "export default makeScene2D(function* (view){yield* playScene(view,shot);});\n")
        imports='\n'.join(f"import shot{k} from '../scenes/{s['id']}?scene';" for k,s in enumerate(arr))
        (P/(ch+'.ts')).write_text("import {makeProject} from '@motion-canvas/core';\n"+imports+
          "\nexport default makeProject({name:'v144-"+ch+"',scenes:["+
          ','.join('shot'+str(i) for i in range(len(arr)))+"],audio:'/media/"+ch+"/narration.wav'});\n")
        meta={'version':1,'shared':{'background':'rgb(10,15,22)','range':[0,None],'size':{'x':1920,'y':1080},'audioOffset':0},
          'preview':{'fps':30,'resolutionScale':.5},'rendering':{'fps':30,'resolutionScale':1,'colorSpace':'srgb',
          'exporter':{'name':'@motion-canvas/ffmpeg','options':{'fastStart':True,'includeAudio':True}},'fileType':'image/png','quality':1}}
        (P/(ch+'.meta')).write_text(json.dumps(meta))
    audit={'status':'PASS','sceneCount':len(scenes),'chapterScenes':chapters,'subtitleCues':sum(len(s['cues']) for s in scenes),
       'layouts':len(set(s['layout'] for s in slides)),'motionVariants':len(set(s['effect'] for s in slides)),
       'narrationCoverage':1.0,'sourceSHA256':hashlib.sha256(src.encode()).hexdigest()}
    (C/'audit.json').write_text(json.dumps(audit,ensure_ascii=False,indent=2))
    print('V144_COMPILE_PASS',json.dumps(audit,ensure_ascii=False))
if __name__=='__main__':main()
