#!/usr/bin/env python3
from pathlib import Path
import json,re
R=Path(__file__).resolve().parents[1]
C=R/'content'; scenes=R/'src/scenes';projects=R/'src/projects'
scenes.mkdir(parents=True,exist_ok=True);projects.mkdir(parents=True,exist_ok=True)
plan=json.loads((C/'storyboard-v2.json').read_text())
names=['prologue','cta','chapter1','chapter2','chapter3','chapter4','chapter5','epilogue']
prefix='PTABCDFE'
meta={"version":1,"shared":{"background":"rgb(10,18,32)","range":[0,None],"size":{"x":1920,"y":1080},"audioOffset":0},"preview":{"fps":30,"resolutionScale":0.5},"rendering":{"fps":30,"resolutionScale":1,"colorSpace":"srgb","exporter":{"name":"@motion-canvas/ffmpeg","options":{"fastStart":True,"includeAudio":True}},"fileType":"image/png","quality":1}}
def cues_for(text):
 out=[];t=0.
 for sentence in re.findall(r'[^。！？!?]+[。！？!?]?',text):
  sentence=sentence.strip()
  while sentence:
   if len(sentence)<=36: part=sentence;sentence=''
   else:
    candidates=[i+1 for i,ch in enumerate(sentence[:36]) if ch in '、，,' and i>=13]
    cut=max(candidates) if candidates else 28
    part=sentence[:cut];sentence=sentence[cut:]
   speech=part.replace('NPR','エヌピーアール').replace('2004年','二千四年').replace('2014年','二千十四年').replace('2012年6月16日','二千十二年六月十六日').replace('2009年','二千九年').replace('というのがリバタリアンたちの主張します。','というのがリバタリアンたちの主張です。')
   cut=19 if len(part)>19 else len(part)
   if len(part)-cut>19:cut=len(part)-19
   display=part[:cut]+('\n'+part[cut:] if cut<len(part) else '')
   d=max(.85,len(part)/6.2+.18)
   out.append({'text':part,'speech':speech,'display':display,'start':round(t,5),'end':round(t+d,5)});t+=d
 return out,round(t,5)
rows=[]
for ci,chapter in enumerate(plan['chapters']):
 slug=chapter['slug'];assert slug==names[ci]
 paragraphs=[x.strip() for x in re.split(r'\n\s*\n',(C/'revised'/f'{slug}.txt').read_text()) if x.strip()]
 start=0;ids=[]
 for si,shot in enumerate(chapter['shots']):
  end=shot['end'];assert start<=end<len(paragraphs),(slug,start,end,len(paragraphs))
  narration=''.join(paragraphs[start:end+1]);sid=f'{prefix[ci]}{si:02d}'
  cues,duration=cues_for(narration)
  rows.append({'id':sid,'chapter':slug,'motif':shot['motif'],'title':shot['title'],'direction':shot['action'],'paragraphStart':start,'paragraphEnd':end,'narration':narration,'cues':cues,'duration':duration,'durationSource':'ESTIMATED_NOT_FOR_FINAL'})
  ids.append(sid);start=end+1
 assert start==len(paragraphs)
 imports='\n'.join(f"import s{i} from '../scenes/{sid}?scene';" for i,sid in enumerate(ids))
 project="import {makeProject} from '@motion-canvas/core';\n"+imports+'\n'+f"export default makeProject({{name:'v123-{slug}',scenes: ["+', '.join(f's{i}' for i in range(len(ids)))+f"],audio:'/media/{slug}/narration.wav'}});\n"
 (projects/f'{slug}.ts').write_text(project)
 (projects/f'{slug}.meta').write_text(json.dumps(meta))
for s in rows:
 source="import {makeScene2D} from '@motion-canvas/2d';\nimport {playMeaningScene} from '../lib/meaningScene';\nimport sceneData from '../../content/scenes.json';\n"+f"const scene=sceneData.find(s=>s.id==='{s['id']}')!;\n"+"export default makeScene2D(function* (view){yield* playMeaningScene(view,scene);});\n"
 (scenes/f"{s['id']}.tsx").write_text(source)
(C/'scenes.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2))
print(json.dumps({'scenes':len(rows),'cues':sum(len(s['cues']) for s in rows),'estimatedSeconds':sum(s['duration'] for s in rows)},ensure_ascii=False))
