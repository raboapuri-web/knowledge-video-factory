#!/usr/bin/env python3
from pathlib import Path
import json,re
from collections import defaultdict
ROOT=Path(__file__).resolve().parents[1]
(ROOT/'src/scenes').mkdir(parents=True,exist_ok=True)
(ROOT/'src/projects').mkdir(parents=True,exist_ok=True)
rows=[]
chapter_map={'A':'chapter1','B':'chapter2','C':'chapter3','D':'chapter4','E':'chapter5','F':'chapter6','G':'chapter7'}
for line in (ROOT/'content/scene_narration.tsv').read_text(encoding='utf-8').strip().splitlines():
    sid,motif,title,narration=line.split('|',3)
    assert '\\n' not in title+narration
    chapter='prologue' if sid.startswith('P') else 'epilogue' if sid.startswith('Z') else chapter_map[sid[0]]
    items=[]
    for sentence in re.findall(r'[^。！？!?]+[。！？!?]?',narration):
        sentence=sentence.strip()
        if not sentence: continue
        while len(sentence)>35:
            candidates=[i+1 for i,c in enumerate(sentence[:36]) if c in '、，,。' and i>=12]
            boundary=max(candidates) if candidates else min([i for i in range(17,min(35,len(sentence))) if sentence[i] in 'はがをにでとへ'] or [33])
            items.append(sentence[:boundary]);sentence=sentence[boundary:]
        if sentence:items.append(sentence)
    cues=[];t=0.0
    for s in items:
        duration=max(1.1,len(s)/6.1+0.18);t1=t+duration
        display=s if len(s)<=19 else s[:19]+'\n'+s[19:]
        assert len(display.split('\n'))<=2 and max(map(len,display.split('\n')))<=19,(sid,s,display)
        cues.append({'text':s,'display':display,'start':round(t,3),'end':round(t1,3)});t=t1
    rows.append({'id':sid,'chapter':chapter,'motif':motif,'title':title,'narration':narration,'cues':cues,'duration':round(t,3),'durationSource':'ESTIMATED_NOT_FOR_FINAL'})
(ROOT/'content/scenes.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n')
(ROOT/'content/timing_preview.json').write_text(json.dumps({r['id']:r for r in rows},ensure_ascii=False,indent=2)+'\n')
for r in rows:
    (ROOT/'src/scenes'/f"{r['id']}.tsx").write_text(
      "import {makeScene2D} from '@motion-canvas/2d';\n"
      "import {playMeaningScene} from '../lib/meaningScene';\n"
      "import sceneData from '../../content/scenes.json';\n"
      f"const scene = sceneData.find(s => s.id === '{r['id']}')!;\n"
      "export default makeScene2D(function* (view) {yield* playMeaningScene(view, scene);});\n")
chapters=['prologue']+[f'chapter{i}' for i in range(1,8)]+['epilogue']
MC_META={"version":1,"shared":{"background":"rgb(10,18,32)","range":[0,None],"size":{"x":1920,"y":1080},"audioOffset":0},"preview":{"fps":30,"resolutionScale":0.5},"rendering":{"fps":30,"resolutionScale":1,"colorSpace":"srgb","exporter":{"name":"@motion-canvas/ffmpeg","options":{"fastStart":True,"includeAudio":True}},"fileType":"image/png","quality":1}}
for chapter in chapters:
    ids=[r['id'] for r in rows if r['chapter']==chapter]
    imports='\n'.join(f"import s{i} from '../scenes/{sid}?scene';" for i,sid in enumerate(ids))
    (ROOT/'src/projects'/f'{chapter}.ts').write_text("import {makeProject} from '@motion-canvas/core';\n"+imports+'\n'+f"export default makeProject({{name:'v122-{chapter}',scenes:[{','.join(f's{i}' for i in range(len(ids)))}],audio:'/media/{chapter}/narration.wav'}});\n")
    (ROOT/'src/projects'/f'{chapter}.meta').write_text(json.dumps(MC_META,ensure_ascii=False,separators=(',',':')))
chap=defaultdict(float)
for r in rows:chap[r['chapter']]+=r['duration']
print(json.dumps({'scene_count':len(rows),'estimated_duration_sec':round(sum(chap.values()),2),'chapters':chap,'cue_count':sum(len(r['cues']) for r in rows)},ensure_ascii=False))