#!/usr/bin/env python3
"""V134 Herostratus: lossless semantic-board compiler.
Scene source of truth is content/board.json; each narration row is preserved.
VOICEVOX durations generated later, never inferred for production.
"""
from pathlib import Path
import json,re
R=Path(__file__).resolve().parents[1]
C=R/'content'; S=R/'src'/'scenes'; P=R/'src'/'projects'
for d in (C,S,P):d.mkdir(parents=True,exist_ok=True)
ORDER=['prologue','chapter1','chapter2','chapter3','chapter4','epilogue']
HEAD={'prologue':'挑発する観客','chapter1':'名声と創造の不均衡','chapter2':'クレオスと悪名','chapter3':'忘却の逆説','chapter4':'怒りの拡散装置','epilogue':'観客が残す記憶'}
def split_text(t,limit=34):
    chunks=[]
    for s in re.findall(r'[^。！？!?]*[。！？!?]|[^。！？!?]+$',t):
        while s:
            if len(s)<=limit:chunks.append(s);break
            k=[i+1 for i,z in enumerate(s[:limit]) if z in '、。，；」』' and i>=15]
            if not k:k=[i+1 for i,z in enumerate(s[:limit]) if z in 'がをにへとはでもし' and i>=20]
            pos=max(k) if k else limit
            chunks.append(s[:pos]);s=s[pos:]
    assert ''.join(chunks)==t
    return chunks
def speech(t):
    for a,b in [
      ('YouTuber','ユーチューバー'),('SNS','エスエヌエス'),
      ('YouTube','ユーチューブ'),('2017','にせんじゅうなな'),
      ('2400','にせんよんひゃく'),('356','さんびゃくごじゅうろく'),
      ('56万','ごじゅうろくまん'),('4世紀','よんせいき')
    ]:
       t=t.replace(a,b)
    return t
def main():
    data=json.loads((C/'board.json').read_text(encoding='utf-8'))
    assert data['sections']==ORDER
    rows=data['rows'];assert len(rows)>=65
    assert len({r['id'] for r in rows})==len(rows)
    assert sum(len(r['narration']) for r in rows)>=7000
    scenes=[]
    meta={'version':1,'shared':{'background':'rgb(9,17,29)','range':[0,None],'size':{'x':1920,'y':1080},'audioOffset':0},
     'preview':{'fps':30,'resolutionScale':.5},
     'rendering':{'fps':30,'resolutionScale':1,'colorSpace':'srgb','exporter':{'name':'@motion-canvas/ffmpeg','options':{'fastStart':True,'includeAudio':True}},'fileType':'image/png','quality':1}}
    for chapter in ORDER:
        part=[r for r in rows if r['chapter']==chapter]
        assert part
        ids=[]
        for i,r in enumerate(part):
            sid=r['id'];ids.append(sid);narr=r['narration'];assert '\n' not in narr
            assert len(r['title'])<=23 and len(r['note'])<=43
            cues=[];clock=0.0
            for t in split_text(narr):
                duration=max(.85,len(t)/6.7)
                display=t[:18]+('\n'+t[18:] if len(t)>18 else '')
                assert len(display.split('\n'))<=2
                cues.append({'text':t,'speech':speech(t),'display':display,
                 'start':round(clock,5),'end':round(clock+duration,5)})
                clock+=duration
            assert len(cues)>=1,sid
            row={**r,'section':HEAD[chapter],'cues':cues,'duration':round(clock,5),
                 'durationSource':'PREVIEW_ONLY','sceneIndex':i,'sceneTotal':len(part)}
            scenes.append(row)
            (S/f'{sid}.tsx').write_text(
              "import {makeScene2D} from '@motion-canvas/2d';\n"
              "import {playScene} from '../lib/director';\n"
              "import scenes from '../../content/scenes.json';\n"
              f"const scene=scenes.find(s=>s.id==='{sid}')!;\n"
              "export default makeScene2D(function* (view){yield* playScene(view,scene);});\n",
              encoding='utf-8')
        imports='\n'.join(f"import s{i} from '../scenes/{sid}?scene';" for i,sid in enumerate(ids))
        src=("import {makeProject} from '@motion-canvas/core';\n"+imports+
          "\nexport default makeProject({name:'v134-"+chapter+"',scenes:["+
          ','.join('s'+str(i) for i in range(len(ids)))+
          "],audio:'/media/"+chapter+"/narration.wav'});\n")
        (P/f'{chapter}.ts').write_text(src,encoding='utf-8')
        (P/f'{chapter}.meta').write_text(json.dumps(meta),encoding='utf-8')
    (C/'scenes.json').write_text(json.dumps(scenes,ensure_ascii=False,indent=2),encoding='utf-8')
    (C/'audit.json').write_text(json.dumps({'source':'content/board.json','exactCoverage':True,'scenes':len(scenes),
      'characters':sum(len(s['narration']) for s in scenes),'subtitleCues':sum(len(s['cues']) for s in scenes),
      'chapters':{ch:len([s for s in scenes if s['chapter']==ch]) for ch in ORDER}},ensure_ascii=False,indent=2),encoding='utf-8')
    print('COMPILED',len(scenes),'scenes',sum(len(s['cues']) for s in scenes),'cues')
if __name__=='__main__':main()
