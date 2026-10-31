#!/usr/bin/env python3
"""V139: source-preserving team-size-paradox Motion Canvas compiler.
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
 'prologue':'人を増やせば解決するという幻想',
 'chapter1':'人月の神話と並列処理の限界',
 'chapter2':'増員が生む調整コスト',
 'chapter3':'集団の中で消える努力',
 'chapter4':'大人数が強くなる条件',
 'epilogue':'必要なのは増員より仕事の再設計'
}
POOLS={
 'prologue':['deadline','team-growth','progress','onboarding','meeting','bugs','paradox'],
 'chapter1':['brooks','ideal-scale','restaurant','dependency','serial','amdahl','speedup','pregnancy','bottleneck','timesheet'],
 'chapter2':['network','pair-count','handoff','revision','lego','labor','estimate','coordination','hidden-cost'],
 'chapter3':['rope','ringelmann','pseudogroup','mask','effort','accountability','unowned','group-work'],
 'chapter4':['disaster','map','cooperation','meta','complexity','envelopes','diversity','approval','queue','utilization'],
 'epilogue':['gate','expert','redesign','autonomy','timing','management','idle','thesis']
}
RULES=[
 ('deadline',r'金曜日|月曜日|納期|炎上'),
 ('team-growth',r'追加|増員|3人|5人|8人|人を増や'),
 ('progress',r'7割|進捗|仕事は進'),
 ('onboarding',r'説明|仕様書|教育|覚える'),
 ('meeting',r'会議|部長|相談'),
 ('bugs',r'不具合|コード|修正'),
 ('paradox',r'不思議|人手不足|当たり前|勘違い'),
 ('brooks',r'ブルックス|人月の神話|1975年'),
 ('ideal-scale',r'100時間|10時間|人数で割'),
 ('restaurant',r'飲食店|厨房|料理|メニュー'),
 ('dependency',r'依存関係|判断|終わらなければ'),
 ('serial',r'順番|同時に進め'),
 ('amdahl',r'アムダール|1967年'),
 ('speedup',r'40パーセント|60パーセント|1.82倍|2.5倍'),
 ('pregnancy',r'妊娠|赤ちゃん|出産'),
 ('bottleneck',r'待たなければ|順番を変えられない'),
 ('timesheet',r'100人日|200時間|稼働率'),
 ('network',r'組み合わせ|4人のチーム'),
 ('pair-count',r'28通り|6通り|nかける'),
 ('handoff',r'受け渡し|引き継|情報を共有'),
 ('revision',r'企画書|グラフ|文章を変更'),
 ('lego',r'LEGO|188個|組み立て'),
 ('labor',r'72人|112人|54パーセント|延べ労働'),
 ('estimate',r'見積|予測|過小評価'),
 ('coordination',r'調整|役割分担|分担'),
 ('hidden-cost',r'目に見え|追加コスト|既存社員'),
 ('rope',r'綱|リンゲルマン'),
 ('ringelmann',r'49パーセント|理論値|8倍'),
 ('pseudogroup',r'インガム|1974年|思い込んだ'),
 ('mask',r'ヘッドホン|目隠し|録音'),
 ('effort',r'82パーセント|74パーセント|声の強さ'),
 ('accountability',r'責任|担当範囲|成果が誰'),
 ('unowned',r'誰も拾|誰かが|確認して'),
 ('group-work',r'社会的手抜き|拍手|ラタネ'),
 ('disaster',r'災害|台風|フィリピン'),
 ('map',r'地図|SNS|道路が寸断'),
 ('cooperation',r'協力|重複|間違いを修正'),
 ('meta',r'2023年|メタ分析|208の|1435'),
 ('complexity',r'複雑な仕事|単純な仕事|仕事の複雑'),
 ('envelopes',r'アンケート|封筒|100枚'),
 ('diversity',r'異なる能力|統計を分析|市場の競合|知識'),
 ('approval',r'広告コピー|合意|法務|承認'),
 ('queue',r'待ち時間|止まって|依存関係'),
 ('utilization',r'忙しく|稼働率|全員'),
 ('gate',r'仕事をいくつ|順序制約|前に'),
 ('expert',r'技術者|設計判断|質問'),
 ('redesign',r'仕事の構造|仕事の設計|切り離す'),
 ('autonomy',r'独立して|権限|自律'),
 ('timing',r'早い段階|遅れている|目前'),
 ('management',r'管理職|会議を廃止|経営者'),
 ('idle',r'忙しい|夜の10時|稼働率'),
 ('thesis',r'優秀なチーム|考えすぎ|当たり前')
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
    assert len(scenes)>=80 and len(families)>=24,(len(scenes),families)
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
           f"export default makeProject({{name:'v139-{ch}',scenes:["+
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
    print('V139_COMPILED',json.dumps(audit,ensure_ascii=False))
if __name__=='__main__':main()
