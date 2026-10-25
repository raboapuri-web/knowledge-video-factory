#!/usr/bin/env python3
"""V136 source-preserving Motion Canvas compiler: Japanese script -> 80+ semantic states."""
from pathlib import Path
from collections import Counter
import hashlib, json, re
R=Path(__file__).resolve().parents[1]
C=R/'content';S=R/'src'/'scenes';P=R/'src'/'projects'
for d in [C,S,P]:d.mkdir(parents=True,exist_ok=True)
ORDER=['prologue','chapter1','chapter2','chapter3','chapter4','epilogue']
LABELS={'prologue':'宗教を守る国が、宗教を包囲した','chapter1':'カルトという宗教は存在しない',
'chapter2':'2000年続けば宗教か','chapter3':'信仰が支配に変わる瞬間',
'chapter4':'救済の名で自由を奪うのか','epilogue':'あなたの信仰は疑えるか'}
POOLS={
'prologue':['question','ritual','waco','timeline','warrant','fire','constitution'],
'chapter1':['ritual','vocabulary','comparison','dictionary','minority','evidence','threshold'],
'chapter2':['timeline','charisma','founder','succession','institution','tradition','authority'],
'chapter3':['vocabulary','feedback','reframe','echo','bounded','pressure','exit','influence'],
'chapter4':['waco','negotiation','translation','fire','constitution','rights','dilemma','evidence'],
'epilogue':['workplace','fandom','reflection','exit','freedom','mirror','ending']}
RULES=[
('waco',r'ウェーコ|ブランチ|コレシュ'),
('fire',r'火災|焼け跡|放火|催涙ガス'),
('warrant',r'令状|銃器|連邦法|銃撃戦'),
('constitution',r'憲法|信教の自由|宗教の自由'),
('negotiation',r'交渉|説得|アグネ|トレイシー'),
('translation',r'聖書.*言葉|言葉.*聖書|バブル|理解する.*同意'),
('rights',r'人権|権利|国家介入|国家が|保障'),
('dilemma',r'両立|衝突|どうなる|どこまで'),
('charisma',r'ウェーバー|カリスマ'),
('succession',r'後継|引き継がれ|人物が死ん'),
('institution',r'制度化|組織|役職|規則'),
('tradition',r'伝統|古い宗教|歴史の長さ'),
('vocabulary',r'カルトという言葉|言葉の意味|言葉.*支配'),
('dictionary',r'定義|新宗教運動|中立的'),
('comparison',r'献金|布施|修道院|比較|同じ'),
('minority',r'理解できない|レッテル|常識'),
('feedback',r'疑問|批判.*正し|覚醒'),
('reframe',r'成長|試練|修行|言い替|呼び替'),
('bounded',r'ラリッチ|制約された選択|選択が制限'),
('pressure',r'家族.*絶縁|脱退すれば|離れること'),
('exit',r'辞め|脱退|離れよう|信じない自由'),
('workplace',r'上司|会社|社員|仕事'),
('fandom',r'ファン|政治|共同体'),
('mirror',r'あなた自身|自分が信じ|自分の信仰'),
('ending',r'最後まで|終わら|恐ろしさ|捨てる自由'),
('evidence',r'根拠|危険|搾取|強制')
]
def pick(ch,text,previous):
    pool=POOLS[ch]
    scored=[]
    for j,v in enumerate(pool):
        matched=[k for k,rx in RULES if k==v and re.search(rx,text)]
        score=0 if matched else 5
        score+= 7 if previous and previous[-1]==v else 0
        score+= 2 if v in previous[-4:] else 0
        score+=j*.06
        scored.append((score,v))
    return min(scored)[1]
def chunk_para(p):
    out=[]
    while len(p)>133:
        lim=p[:118]
        k=max(lim.rfind('。'),lim.rfind('？'),lim.rfind('！'))
        k=k+1 if k>43 else 103
        out.append(p[:k]);p=p[k:]
    if p:out.append(p)
    return out
def cue_segments(text,limit=29):
    out=[]
    for sentence in re.findall(r'[^。！？!?]*[。！？!?]|[^。！？!?]+$',text):
        while sentence:
            if len(sentence)<=limit:out.append(sentence);break
            hits=[i+1 for i,c in enumerate(sentence[:limit]) if c in '、，,」』' and i>=12]
            k=max(hits) if hits else limit
            out.append(sentence[:k]);sentence=sentence[k:]
    assert ''.join(out)==text
    return out
def speaker(text):
    for a,b in [
      ('1993','せんきゅうひゃくきゅうじゅうさん'),('2000','にせん'),
      ('FBI','エフビーアイ'),('ATF','エーティーエフ'),
      ('Bible babble','バイブル・バブル'),
      ('2月28日','にがつにじゅうはちにち'),('4月19日','しがつじゅうくにち'),
      ('51日','ごじゅういちにち'),('75人','ななじゅうごにん'),('4人','よにん')]:
       text=text.replace(a,b)
    return text
def captions(txt):
    pieces=cue_segments(txt);out=[];t=0
    for p in pieces:
        lines=p if len(p)<=16 else p[:16]+'\n'+p[16:]
        assert max(len(x) for x in lines.split('\n'))<=16,(lines,len(p))
        dt=max(.7,len(p)/7.4+.1)
        out.append({'text':p,'speech':speaker(p),'display':lines,
            'start':round(t,3),'end':round(t+dt,3)})
        t+=dt
    return out,round(t,3)
def parse():
    txt=(C/'manuscript.md').read_text(encoding='utf-8').replace('\r','')
    pieces=re.split(r'(?m)^# [^\n]+\n',txt)
    assert len(pieces)==7,(len(pieces),'six labeled chapters needed')
    raws=[];all_paras={}
    for i,ch in enumerate(ORDER):
        paras=[x.strip() for x in re.split(r'\n\\s*\n',pieces[i+1].strip()) if x.strip()]
        all_paras[ch]=''.join(paras)
        for p in paras:
            for fragment in chunk_para(p):raws.append((ch,fragment))
    assert all(''.join(t for chapter,t in raws if chapter==ch)==all_paras[ch] for ch in ORDER)
    return txt,raws
def main():
    source,raw=parse()
    scenes=[];last=[]
    for chapter,narration in raw:
        visual=pick(chapter,narration,last);last.append(visual)
        idx=sum(s['chapter']==chapter for s in scenes)+1
        sid=chapter.upper()+str(idx).zfill(3)
        cues,duration=captions(narration)
        row={'id':sid,'chapter':chapter,'section':LABELS[chapter],
        'visual':visual,'title':LABELS[chapter],'note':narration[:22],
        'narration':narration,'focus':visual,'sceneIndex':idx-1,
        'cues':cues,'duration':duration,'durationSource':'PREVIEW_ONLY'}
        scenes.append(row)
        (S/f'{sid}.tsx').write_text(
         "import {makeScene2D} from '@motion-canvas/2d';\n"+
         "import {playScene} from '../lib/director';\n"+
         "import scenes from '../../content/scenes.json';\n"+
         f"const s=scenes.find(x=>x.id==='{sid}')!;\n"+
         "export default makeScene2D(function* (v){yield* playScene(v,s);});\n",encoding='utf-8')
    assert len(scenes)>=78,len(scenes)
    assert len(set(s['visual'] for s in scenes))>=21
    meta={'version':1,'shared':{'background':'rgb(8,12,20)','range':[0,None],
          'size':{'x':1920,'y':1080},'audioOffset':0},
      'preview':{'fps':30,'resolutionScale':.5},
      'rendering':{'fps':30,'resolutionScale':1,'colorSpace':'srgb',
         'exporter':{'name':'@motion-canvas/ffmpeg',
             'options':{'fastStart':True,'includeAudio':True}},
         'fileType':'image/png','quality':1}}
    for chapter in ORDER:
        names=[x['id'] for x in scenes if x['chapter']==chapter]
        imports='\n'.join(f"import s{i} from '../scenes/{name}?scene';" for i,name in enumerate(names))
        (P/f'{chapter}.ts').write_text(
          "import {makeProject} from '@motion-canvas/core';\n"+imports+"\n"+
          f"export default makeProject({{name:'v136-{chapter}',scenes:["+
          ','.join('s'+str(i) for i in range(len(names)))+
          f"],audio:'/media/{chapter}/narration.wav'}});\n",encoding='utf-8')
        (P/f'{chapter}.meta').write_text(json.dumps(meta),encoding='utf-8')
    (C/'scenes.json').write_text(json.dumps(scenes,ensure_ascii=False,indent=2),encoding='utf-8')
    audit={'approvedSource':'content/manuscript.md','sourceSHA256':hashlib.sha256(source.encode()).hexdigest(),
       'narrationCoverage':1.0,'scenes':len(scenes),
       'narrationCharacters':sum(len(s['narration']) for s in scenes),
       'subtitleCues':sum(len(x['cues']) for x in scenes),
       'visualFamilies':dict(Counter(x['visual'] for x in scenes)),
       'chapters':dict(Counter(x['chapter'] for x in scenes))}
    (C/'audit.json').write_text(json.dumps(audit,ensure_ascii=False,indent=2),encoding='utf-8')
    print('V136_COMPILED',len(scenes),'semantic scenes',audit['narrationCharacters'],'characters',audit['subtitleCues'],'cues',len(audit['visualFamilies']),'visuals')
if __name__=='__main__':main()
