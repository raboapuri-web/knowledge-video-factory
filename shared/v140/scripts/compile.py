#!/usr/bin/env python3
"""V140 wildfire × SNS: locked original narration + 100 storyboard anchor shots."""
from pathlib import Path
from collections import Counter
import csv, hashlib, json, re
R=Path(__file__).resolve().parents[1]
C=R/'content'; S=R/'src/scenes'; P=R/'src/projects'
for p in [C,S,P]: p.mkdir(parents=True,exist_ok=True)
ORDER=['prologue','chapter1','chapter2','chapter3','chapter4','epilogue']
HEAD={'プロローグ':'prologue','第1章':'chapter1','第2章':'chapter2','第3章':'chapter3','第4章':'chapter4','エピローグ':'epilogue'}
LABELS={'prologue':'山からの、迷惑なお願い','chapter1':'燃えないと生きられない森',
'chapter2':'火を消すほど、森は燃えやすくなる','chapter3':'山火事を消さないと、何が起こるのか？',
'chapter4':'炎上しない人ほど、大炎上する？','epilogue':'火を消すことは、問題を消すことなのか'}
def normal(s):return re.sub(r'\s+','',s.replace('**',''))
def strip_markdown(source):
    x=re.sub(r'(?m)^#{1,3}[^\n]*\n','',source)
    x=re.sub(r'(?m)^---\s*$','',x)
    return normal(x)
def voice_reading(s):
    repl={'SNS':'エスエヌエス','YouTuber':'ユーチューバー','km²':'平方キロメートル',
    'ロッジポールパイン':'ロッジポールパイン','VOICEVOX':'ボイスボックス','Nature Communications':'ネイチャーコミュニケーションズ',
    '3,301':'さんぜんさんびゃくいち','1,000':'せん','11.4':'じゅういってんよん','58.8':'ごじゅうはってんはち',
    '62〜72':'ろくじゅうにからななじゅうに','4140万':'よんせんひゃくよんじゅうまん',
    '4,140万':'よんせんひゃくよんじゅうまん','2002':'にせんに','2024':'にせんにじゅうよん',
    '1988':'せんきゅうひゃくはちじゅうはち','1700':'せんななひゃく','1880':'せんはっぴゃくはちじゅう',
    '406':'よんひゃくろく','132':'ひゃくさんじゅうに','560':'ごひゃくろくじゅう',
    '110':'ひゃくじゅう','36％':'さんじゅうろくパーセント','32％':'さんじゅうにパーセント',
    '42％':'よんじゅうにパーセント','60':'ろくじゅう','6万':'ろくまん',
    '3,200':'さんぜんにひゃく','2万4千':'にまんよんせん','1日':'いちにち'}
    for k in sorted(repl,key=len,reverse=True):s=s.replace(k,repl[k])
    s=s.replace('まつぼっくりがが','まつぼっくりが')
    s=re.sub(r'([0-9]+)',lambda m:''.join('ぜろいちにさんよんごろくななはちきゅう'[int(c)*2:int(c)*2+2] for c in m.group()),s)
    return s
def captions(txt):
    # Cue segmentation is display-only: lossless concatenation reproduces the approved narration.
    out=[]
    pieces=re.findall(r'[^。！？!?]*[。！？!?]?|[^。！？!?]+$',txt)
    for p in pieces:
        while p:
            if len(p)<=29:part,p=p,'' 
            else:
                cut=max([i+1 for i,c in enumerate(p[:29]) if c in '、，」』' and i>=11] or [25])
                part,p=p[:cut],p[cut:]
            if not part:continue
            display=part if len(part)<=16 else part[:16]+'\n'+part[16:]
            # ensure 2 lines, never 3
            if len(display.split('\n')[-1])>16:
                # preserve exact source with smaller on-screen chunk
                cut=29 if len(part)>29 else 28
                p=part[cut:]+p;part=part[:cut];display=part[:15]+'\n'+part[15:]
            dt=max(.48,len(part)/7.0+.08)
            out.append({'text':part,'speech':voice_reading(part),'display':display,'start':0,'end':round(dt,3)})
    if ''.join(c['text'] for c in out)!=txt: raise AssertionError('subtitle lost narration')
    return out
def main():
    source=(C/'manuscript.md').read_text(encoding='utf-8')
    raw=strip_markdown(source)
    rows=list(csv.DictReader((C/'storyboard.csv').open(encoding='utf-8-sig')))
    assert len(rows)==100,len(rows)
    assert [r['scene_id'] for r in rows]==[f'S{i:03}' for i in range(1,101)]
    anchors=[normal(r['narration_start']) for r in rows]
    starts=[];off=0
    for r,a in zip(rows,anchors):
        idx=raw.find(a,off)
        if idx<0:raise ValueError('Storyboard anchor missing or reordered: '+r['scene_id']+' '+a[:48])
        starts.append(idx);off=idx+len(a)
    if starts[0]!=0:raise ValueError('Unmatched prologue prefix')
    scenes=[]
    for i,row in enumerate(rows):
        text=raw[starts[i]:(starts[i+1] if i<99 else len(raw))]
        section=row['section']
        key=next((slug for word,slug in HEAD.items() if word in section),None)
        if not key:raise ValueError('Bad chapter '+section)
        cues=captions(text)
        scenes.append({'id':row['scene_id'],'chapter':key,'section':LABELS[key],
        'title':row['title'],'visual':row['visual_type'],'visualInstruction':row['visual'],
        'motionInstruction':row['motion'],'narration':text,'cues':cues,
        'sceneIndex':i,'duration':sum(c['end'] for c in cues),'durationSource':'PREVIEW_ONLY'})
    if ''.join(x['narration'] for x in scenes)!=raw:raise ValueError('Source narration mismatch')
    for ch in ORDER:
        shots=[s for s in scenes if s['chapter']==ch]
        names=[s['id'] for s in shots]
        for id in names:
            (S/(id+'.tsx')).write_text("import {makeScene2D} from '@motion-canvas/2d';\n"
             "import {playScene} from '../lib/director';\n"
             "import scenes from '../../content/scenes.json';\n"
             f"const shot=scenes.find(x=>x.id==='{id}')!;\n"
             "export default makeScene2D(function* (view){yield* playScene(view,shot);});\n",encoding='utf-8')
        imports='\n'.join(f"import shot{i} from '../scenes/{id}?scene';" for i,id in enumerate(names))
        (P/(ch+'.ts')).write_text(
             "import {makeProject} from '@motion-canvas/core';\n"+imports+
             f"\nexport default makeProject({{name:'v140-{ch}',scenes:["+
             ','.join('shot'+str(j) for j in range(len(names)))+
             f"],audio:'/media/{ch}/narration.wav'}});\n",encoding='utf-8')
        meta={'version':1,'shared':{'background':'rgb(10,15,22)','range':[0,None],
         'size':{'x':1920,'y':1080},'audioOffset':0},
         'preview':{'fps':30,'resolutionScale':.5},'rendering':{'fps':30,'resolutionScale':1,
         'colorSpace':'srgb','exporter':{'name':'@motion-canvas/ffmpeg','options':{'fastStart':True,'includeAudio':True}},
         'fileType':'image/png','quality':1}}
        (P/(ch+'.meta')).write_text(json.dumps(meta))
    (C/'scenes.json').write_text(json.dumps(scenes,ensure_ascii=False,indent=2))
    counts=Counter(s['chapter'] for s in scenes)
    audit={'sourceSHA256':hashlib.sha256(source.encode()).hexdigest(),'sourceCharacters':len(raw),
       'narrationCoverage':1.0,'scenes':100,'cues':sum(len(s['cues']) for s in scenes),
       'chapters':dict(counts),'visualTypes':len(set(s['visual'] for s in scenes)),
       'sourceChanged':False,'anchorMatches':100}
    (C/'audit.json').write_text(json.dumps(audit,ensure_ascii=False,indent=2))
    print('V140_STORYBOARD_100',json.dumps(audit,ensure_ascii=False))
if __name__=='__main__':main()
