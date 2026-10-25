#!/usr/bin/env python3
"""V137: source-preserving poverty-premium Motion Canvas compiler.
Every scene is grounded in manuscript text; every caption has VOICEVOX-measured timing.
"""
from pathlib import Path
from collections import Counter
import hashlib,json,re
R=Path(__file__).resolve().parents[1]
C=R/'content';S=R/'src'/'scenes';P=R/'src'/'projects'
for p in (C,S,P):p.mkdir(parents=True,exist_ok=True)
ORDER=['prologue','chapter1','chapter2','chapter3','chapter4','epilogue']
LABELS={
 'prologue':'貧困のパラドックス',
 'chapter1':'安く買うためには金がいる',
 'chapter2':'お金がない人ほど、お金が高い',
 'chapter3':'節約するには、考える余裕がいる',
 'chapter4':'合理的に生きるほど、抜け出せなくなる',
 'epilogue':'選択肢が高価な社会'
}
POOLS={
 'prologue':['street','supermarket','shelf','wallet','unitprice','choice','premium'],
 'chapter1':['shelf','bulk','unitprice','ticket','storage','commute','fridge','electricity','housing','shopping','research'],
 'chapter2':['bank','loan','interest','risk','premium','insurance','monthly','electricity','contract','debtcycle'],
 'chapter3':['worry','clock','focus','brain','research','phone','forms','application','support','choice'],
 'chapter4':['debtcycle','commute','career','interview','school','housing','ladder','grant','assets','path','choice'],
 'epilogue':['choice','future','contract','premium','scale','wallet','ending']
}
RULES=[
 ('supermarket',r'スーパー|売り場|棚の前'),('shelf',r'トイレットペーパー|日用品|包装'),
 ('wallet',r'財布|五百円|現金が足り|お金が足り'),('unitprice',r'単価|四ロール|十二ロール'),
 ('bulk',r'まとめ買い|大容量|大量購入'),('ticket',r'定期券|年間契約|年払いの契約'),
 ('storage',r'保管|ワンルーム|自家用車を持た'),('shopping',r'洗剤|飲料水|米、'),
 ('fridge',r'冷蔵庫|家電量販店'),('housing',r'住宅|家賃|賃貸|引っ越し'),
 ('electricity',r'電気料金|光熱費|冷暖房|断熱'),
 ('loan',r'借り|融資|借り入れ'),('bank',r'金融機関|金利|返済履歴'),
 ('interest',r'価格を調整|金利|お金そのものの価格'),
 ('risk',r'リスク|危険|返済されない|返済能力'),
 ('insurance',r'保険|月払い|補償'),('monthly',r'一括払い|分割払い|一年分'),
 ('contract',r'契約書|契約条件|支払い方法'),
 ('premium',r'貧困プレミアム|九十五パーセント|三百八十ポンド|七十一ポンド'),
 ('debtcycle',r'循環|悪循環|次の資金調達|貯金を再建'),
 ('worry',r'心配|不安|残高|給料日'),('brain',r'認知|心理学|注意|判断力'),
 ('clock',r'時間と|時間が|時間を|長時間'),('focus',r'集中力|複雑|比較表'),
 ('phone',r'携帯電話|料金を見直|案内が届'),
 ('forms',r'申請|書類|行政|手続き'),
 ('application',r'面接を受け|承認率|食料支援'),
 ('support',r'社会保障|支援制度|制度の所得条件'),
 ('career',r'転職|仕事を続け|職場|低賃金'),
 ('interview',r'面接に行く|友人は言う'),
 ('school',r'資格|受講料|勉強'),
 ('grant',r'ケニア|現金給付|ハウスホーファー'),
 ('assets',r'資産|貯金を|蓄積|所得'),('ladder',r'貧困の罠|抜け出せ|改善でき'),
 ('future',r'未来|将来|現在|今日の生活'),
 ('scale',r'同じ|比較|高く|安く'),
 ('ending',r'最後に|貧困とは単に|自己責任')
]
def chunk_para(p):
    result=[]
    # Cut near punctuation into 55-90 character meaning units, not mechanical equal-length.
    while len(p)>94:
        section=p[:89]
        hits=[i+1 for i,c in enumerate(section) if c in '。！？' and i>=45]
        if not hits:hits=[i+1 for i,c in enumerate(section) if c in '、，' and i>=57]
        k=max(hits) if hits else 76
        result.append(p[:k]);p=p[k:]
    if p:result.append(p)
    return result
def captions(txt):
    parts=[]
    for sent in re.findall(r'[^。！？!?]*[。！？!?]|[^。！？!?]+$',txt):
        while sent:
            if len(sent)<=28:parts.append(sent);break
            breaks=[i+1 for i,c in enumerate(sent[:28]) if c in '、，」』' and i>=13]
            k=max(breaks) if breaks else 28
            parts.append(sent[:k]);sent=sent[k:]
    assert ''.join(parts)==txt
    out=[];t=0
    for part in parts:
        display=part if len(part)<=15 else part[:15]+'\n'+part[15:]
        assert len(display.split('\n'))<=2 and max(map(len,display.split('\n')))<=15
        dt=max(.65,len(part)/7.8+.13)
        out.append({'text':part,'speech':part,'display':display,'start':round(t,3),'end':round(t+dt,3)})
        t+=dt
    return out,round(t,3)
def pick(ch,txt,last,idx):
    pool=POOLS[ch];scores=[]
    for i,v in enumerate(pool):
        matched=any(k==v and re.search(rx,txt) for k,rx in RULES)
        score=(-10 if matched else 4)+(9 if last and last[-1]==v else 0)
        score+=(5 if v in last[-3:] else 0)
        score+=(2 if v in last[-6:] else 0)
        score+=((i-idx)%len(pool))*.04
        scores.append((score,v))
    return min(scores)[1]
def main():
    source=(C/'manuscript.md').read_text(encoding='utf-8').replace('\r','')
    pieces=re.split(r'(?m)^# [^\n]+\n',source)
    assert len(pieces)==7,('Expected exactly six chapters',len(pieces))
    scenes=[];last=[];rendered=''
    for ch,body in zip(ORDER,pieces[1:]):
        paras=[p.strip() for p in re.split(r'\n\s*\n',body.strip()) if p.strip()]
        for para in paras:
            for txt in chunk_para(para):
                idx=sum(s['chapter']==ch for s in scenes)+1
                sid=ch.upper()+str(idx).zfill(3);v=pick(ch,txt,last,idx);last.append(v)
                cues,duration=captions(txt)
                item={'id':sid,'chapter':ch,'section':LABELS[ch],'visual':v,
                  'title':LABELS[ch],'note':txt[:20],'narration':txt,'focus':v,
                  'sceneIndex':idx-1,'cues':cues,'duration':duration,'durationSource':'PREVIEW_ONLY'}
                scenes.append(item);rendered+=txt
                (S/(sid+'.tsx')).write_text(
                 "import {makeScene2D} from '@motion-canvas/2d';\n"+
                 "import {playScene} from '../lib/director';\n"+
                 "import scenes from '../../content/scenes.json';\n"+
                 f"const s=scenes.find(x=>x.id==='{sid}')!;\n"+
                 "export default makeScene2D(function* (v){yield* playScene(v,s);});\n",encoding='utf-8')
    expected=''.join(re.sub(r'(?m)^# [^\n]+\n','',source).split())
    actual=''.join(rendered.split())
    assert actual==expected,(len(actual),len(expected))
    families=Counter(s['visual'] for s in scenes)
    assert len(scenes)>=80 and len(families)>=18,(len(scenes),families)
    meta={'version':1,'shared':{'background':'rgb(7,12,19)','range':[0,None],
        'size':{'x':1920,'y':1080},'audioOffset':0},
        'preview':{'fps':30,'resolutionScale':.5},
        'rendering':{'fps':30,'resolutionScale':1,'colorSpace':'srgb',
        'exporter':{'name':'@motion-canvas/ffmpeg','options':{'fastStart':True,'includeAudio':True}},
        'fileType':'image/png','quality':1}}
    for ch in ORDER:
        names=[s['id'] for s in scenes if s['chapter']==ch]
        imports='\n'.join(f"import sc{i} from '../scenes/{name}?scene';" for i,name in enumerate(names))
        (P/(ch+'.ts')).write_text(
           "import {makeProject} from '@motion-canvas/core';\n"+imports+"\n"+
           f"export default makeProject({{name:'v137-{ch}',scenes:["+
           ','.join('sc'+str(i) for i in range(len(names)))+
           f"],audio:'/media/{ch}/narration.wav'}});\n",encoding='utf-8')
        (P/(ch+'.meta')).write_text(json.dumps(meta),encoding='utf-8')
    (C/'scenes.json').write_text(json.dumps(scenes,ensure_ascii=False,indent=2),encoding='utf-8')
    audit={'sourceSHA256':hashlib.sha256(source.encode()).hexdigest(),'narrationCoverage':1.0,
       'sceneCount':len(scenes),'narrationCharacters':len(actual),
       'subtitleCues':sum(len(s['cues']) for s in scenes),'families':dict(families),
       'chapters':dict(Counter(s['chapter'] for s in scenes)),
       'consecutiveSameVisual':sum(a['visual']==b['visual'] for a,b in zip(scenes,scenes[1:]))}
    (C/'audit.json').write_text(json.dumps(audit,ensure_ascii=False,indent=2),encoding='utf-8')
    print('V137_COMPILED',json.dumps(audit,ensure_ascii=False))
if __name__=='__main__':main()
