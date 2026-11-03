#!/usr/bin/env python3
from pathlib import Path
import json,re,hashlib,collections
R=Path(__file__).resolve().parents[1]; C=R/'content';S=R/'src/scenes';P=R/'src/projects'
for p in (C,S,P):p.mkdir(parents=True,exist_ok=True)
ORDER=["prologue","chapter1","chapter2","chapter3","chapter4","epilogue"]
HEAD=["プロローグ","第1章","第2章","第3章","第4章","エピローグ"]

LABELS=["動かない方が止められる？","何もしなかった失敗","会社員と見えないPK","患者ではなく医師を守る？","人が増えるほど助けない","人は何のために動くか"]
TARGETS={"prologue":9,"chapter1":19,"chapter2":16,"chapter3":18,"chapter4":21,"epilogue":10}
LAYOUTS=["headline","ratio","thesis","bar2","metric2","difference","study","duel","timeline","matrix","contrast","quote","hypothesis","causal","cascade","inversion","framing","method","filter","xray","analogy","gradient","scale","path","cards","layer","dilemma","mechanism","network","divider","competition","locator"]
HEADLINES={
"prologue":["93.7％の選択","286本のPK","ゴールキーパーの常識","セーブ率の逆転","13.4％と33.3％","動かない選択肢","なぜ中央に留まらない？","技術か、心理か","11メートルの意思決定"],
"chapter1":["左へ飛んだ場合","失点という結果","もう一つの選択","留まって失点する","観客はどう評価する？","結果は同じなのに","普通を破ること","規範理論とは","普通の失敗と異常な失敗","32人のプロへの調査","動くのが普通","アクションバイアス","行動が言い訳になる","しかし投資は逆","買い替えた投資家","動かなかった投資家","後悔はなぜ違う？","行動か不作為か","普通は根拠になるか"],
"chapter2":["会社で売上が下がった","新しい施策か現状維持か","同じ失敗、違う批判","改善を試みた証拠","何もしなかった責任","行動のもう一つの機能","会議・ルール・管理表","解決かアピールか","何を最大化するのか","組織と個人の利害","忙しそうに見える社員","成果と努力の混同","努力して損をする人","評価基準の逆説","会社で起きたこと","病院ならどうなる？"],
"chapter3":["検査をしなかった医師","病気を見逃したら","検査した医師の場合","同じ結果、違う説明","防衛医療とは","824人の医師調査","防衛医療93％","必要性を超えた行動","医師の立場で考える","医療費と患者の負担","ゴールキーパーとの共通点","検査しなかった責任","逆の現象：診療を避ける","診療制限42％","動きすぎる／動かなすぎる","行動の目的は何か","責任を避ける合理性","責任が分散したら？"],
"chapter4":["街で人が倒れたら","自分だけなら？","通行人が100人なら？","傍観者効果","1968年の実験","声が途絶える","目撃者数の操作","助けを呼んだ割合","85％ 対 31％","人が増えるほど","責任の分散","なぜ動かなくなる？","ゴールキーパーとの対比","責任の集中と分散","行動する／しない","仮説：責任の所在","仕事を一人に任せたら","10人に任せたら","どちらにも落とし穴","行動が示すもの","見落とした状況"],
"epilogue":["三つの場面","それぞれ異なる行動","何を達成したかったか","行動は証明ではない","再びゴール前へ","飛ばずに失点","観客が問うこと","何を考えていたか","責められなかったら？","今夜も当たり前が減る"]
}
LABEL_BANK={
"prologue":["左右へ飛ぶ","中央に留まる","286本を調査","2007年"],
"chapter1":["失点","行動","普通","後悔"],
"chapter2":["施策","責任","行動の証拠","成果"],
"chapter3":["追加検査","訴訟リスク","診療制限","防衛医療"],
"chapter4":["自分だけ","周囲に4人","救助の報告","責任の分散"],
"epilogue":["ゴールキーパー","医師","傍観者","責任の所在"]
}
def make_ends(raw,n):
    lines=[normalized(s) for s in raw.splitlines() if normalized(s)]
    assert len(lines)>=n,(len(lines),n)
    return [int((j+1)*len(lines)/n) for j in range(n)]
def make_plan(ch,pieces):
    out=[]
    for j,piece in enumerate(pieces):
        lay=LAYOUTS[(j*7+ORDER.index(ch)*9)%len(LAYOUTS)]
        h=HEADLINES[ch][j]
        b=LABEL_BANK[ch]
        tags=[b[j%len(b)],b[(j+1)%len(b)],b[(j+2)%len(b)]]
        if ch=="prologue" and ("93.7" in piece or "6.3" in piece):
            lay="ratio";tags=["93.7％：左右に飛んだ","6.3％：中央に留まる","PK286本／2007年"]
        elif ch=="prologue" and ("13.4" in piece or "33.3" in piece):
            lay="bar2";tags=["左右に飛ぶ 13.4％","中央に留まる 33.3％","2007年の観測値"]
        elif ch=="chapter1" and ("32人" in piece or "25人" in piece):
            lay="metric2";tags=["32人","25人","プロゴールキーパー調査"]
        elif ch=="chapter3" and "824人" in piece:
            lay="scale";tags=["824人","米国ペンシルベニア","2005年の医師調査"]
        elif ch=="chapter3" and "93%" in piece:
            lay="ratio";tags=["93％：防衛医療","残り 7％","医師の自己申告"]
        elif ch=="chapter3" and "42%" in piece:
            lay="ratio";tags=["42％：診療範囲を制限","残り58％","過去3年間"]
        elif ch=="chapter4" and ("85%" in piece or "31%" in piece):
            lay="bar2";tags=["自分だけ 85％","ほかに4人 31％","1968年の実験"]
        elif ch=="chapter4" and ("100人" in piece or "10人" in piece):
            lay="matrix";tags=["1人","10人","100人","責任の分散：思考実験"]
        elif "**" in piece or "結論" in h:
            lay="thesis";tags=[b[0],b[1],b[2]]
        quantitative=(ch=='prologue' and any(v in piece for v in ['93.7','6.3','13.4','33.3'])) or (ch=='chapter3' and any(v in piece for v in ['93%','42%'])) or (ch=='chapter4' and any(v in piece for v in ['85%','31%']))
        if lay in ('ratio','bar2') and not quantitative:
            lay='duel' if lay=='bar2' else 'contrast'
        out.append((lay,h,tags))
    return out
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
    src=(C/'part1.md').read_text(encoding='utf-8')+'\n'+(C/'part2.md').read_text(encoding='utf-8')
    matches=re.findall(r'(?m)^## ([^\n]+)\n(.*?)(?=^## |\Z)',src,re.S|re.M)
    chunks={};raw_chunks={}
    for label,part in matches:
        for word,ch in zip(HEAD,ORDER):
            if label.startswith(word):chunks[ch]=normalized(part);raw_chunks[ch]=part;break
    assert set(chunks)==set(ORDER),chunks.keys()
    scenes=[];slides=[];chapters={}
    for ch in ORDER:
        pieces=partition_by_paragraph(raw_chunks[ch],make_ends(raw_chunks[ch],TARGETS[ch]))
        plan=make_plan(ch,pieces)
        chapters[ch]=len(plan)
        for j,((layout,headline,labels),text) in enumerate(zip(plan,pieces)):
            i=len(scenes)+1;id=f'S{i:03}';cu=captions(text)
            effect=(i*11+i//7*3)%29
            slides.append(dict(id=id,layout=layout,headline=headline,labels=labels,effect=effect))
            scenes.append(dict(id=id,chapter=ch,section=LABELS[ORDER.index(ch)],title=headline,visual=layout,
              visualInstruction='プレゼンの図解のみ。実写・芝居・情景描写なし。',
              motionInstruction=f'レイアウト固有のモーション＋意味に沿った強調 No.{effect}',
              narration=text,cues=cu,sceneIndex=i-1,duration=sum(x['end'] for x in cu),durationSource='PREVIEW_ONLY'))
    for k in range(1,len(slides)):
        if slides[k]['layout']==slides[k-1]['layout']:
            slides[k]['layout']='duel' if slides[k]['layout']!='duel' else 'matrix'
            scenes[k]['visual']=slides[k]['layout']
    assert ''.join(s['narration'] for s in scenes)==''.join(chunks[k] for k in ORDER)
    assert len(set(s['layout'] for s in slides))>=18
    assert all(a['layout']!=b['layout'] for a,b in zip(slides,slides[1:]))
    assert all(a['effect']!=b['effect'] for a,b in zip(slides,slides[1:]))
    (C/'scenes.json').write_text(json.dumps(scenes,ensure_ascii=False,indent=2))
    (C/'slide-spec.json').write_text(json.dumps({'version':'v145','style':'editorial slide documentary','specs':slides},ensure_ascii=False,indent=2))
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
          "\nexport default makeProject({name:'v145-"+ch+"',scenes:["+
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
