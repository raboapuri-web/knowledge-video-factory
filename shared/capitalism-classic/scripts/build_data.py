#!/usr/bin/env python3
"""Compile verbatim user-edited narration into 65 authored semantic mixed-media scenes.
The temporary estimated timing is only for storyboard preview; CI must replace
it with measured VOICEVOX cue timings before it is permitted to render final.
"""
from pathlib import Path
import json,re
R=Path(__file__).resolve().parents[1]
C=R/'content'; S=R/'src/scenes';P=R/'src/projects';S.mkdir(exist_ok=True,parents=True);P.mkdir(exist_ok=True,parents=True)
board=json.loads((C/'storyboard.json').read_text())
chapters=[c['slug'] for c in board['chapters']]
assert chapters==['prologue','cta','chapter1','chapter2','chapter3','chapter4','chapter5','epilogue']
meta={"version":1,"shared":{"background":"rgb(8,15,25)","range":[0,None],"size":{"x":1920,"y":1080},"audioOffset":0},"preview":{"fps":30,"resolutionScale":.5},"rendering":{"fps":30,"resolutionScale":1,"colorSpace":"srgb","exporter":{"name":"@motion-canvas/ffmpeg","options":{"fastStart":True,"includeAudio":True}},"fileType":"image/png","quality":1}}
def segment(text):
 out=[]
 for sentence in re.findall(r'[^。！？!?]+[。！？!?]?',text):
  sentence=sentence.strip()
  while sentence:
   if len(sentence)<=36: part=sentence;sentence=''
   else:
    mids=[j+1 for j,ch in enumerate(sentence[:36]) if ch in '、，,」』' and j>=15]
    cut=max(mids) if mids else min([j for j in range(17,35) if sentence[j] in 'はがをにでとへも'] or [34])
    part=sentence[:cut];sentence=sentence[cut:]
   if part:out.append(part)
 return out
def make_cues(src):
 out=[];t=0
 for part in segment(src):
  assert len(part)<=36,(len(part),part)
  split=len(part) if len(part)<=18 else min(18,len(part))
  display=part if split==len(part) else part[:split]+'\n'+part[split:]
  assert len(display.split('\n'))<=2 and all(len(line)<=18 for line in display.split('\n'))
  d=max(.75,len(part)/7.2+.12)
  out.append({'text':part,'speech':part,'display':display,'start':round(t,5),'end':round(t+d,5)})
  t+=d
 return out,round(t,5)
rows=[]
for chapter in board['chapters']:
 slug=chapter['slug'];ps=[p.strip() for p in re.split(r'\n\s*\n',(C/'revised'/f'{slug}.txt').read_text()) if p.strip()]
 ids=[];narrated=[]
 for shot in chapter['shots']:
  b=ps[shot['from']:shot['to']+1];assert b
  original=''.join(b);narrated.extend(b)
  cues,duration=make_cues(original)
  row={**shot,'chapter':slug,'narration':original,'cues':cues,'duration':duration,'durationSource':'PREVIEW_ONLY'}
  rows.append(row);ids.append(shot['id'])
  (S/f"{shot['id']}.tsx").write_text("import {makeScene2D} from '@motion-canvas/2d';\nimport {playScene} from '../lib/hybridDirector';\nimport sceneData from '../../content/scenes.json';\nconst shot=sceneData.find(s=>s.id==='"+shot['id']+"')!;\nexport default makeScene2D(function* (view){yield* playScene(view,shot);});\n")
 assert narrated==ps,(slug,len(narrated),len(ps))
 imports='\n'.join(f"import s{i} from '../scenes/{sid}?scene';" for i,sid in enumerate(ids))
 (P/f'{slug}.ts').write_text("import {makeProject} from '@motion-canvas/core';\n"+imports+"\nexport default makeProject({name:'capitalismclassic-"+slug+"',scenes:["+','.join(f's{i}' for i in range(len(ids)))+"],audio:'/media/"+slug+"/narration.wav'});\n")
 (P/f'{slug}.meta').write_text(json.dumps(meta))
(C/'scenes.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2))
print(json.dumps({'scenes':len(rows),'cues':sum(len(x['cues']) for x in rows),'previewSeconds':round(sum(x['duration'] for x in rows),1),'chapters':chapters},ensure_ascii=False))
