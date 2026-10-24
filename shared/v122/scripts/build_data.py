#!/usr/bin/env python3
from pathlib import Path
from collections import defaultdict
import json,re
ROOT=Path(__file__).resolve().parents[1];CONTENT=ROOT/'content'
PLAN=json.loads((CONTENT/'v134-shot-plan.json').read_text(encoding='utf-8'))['chapters']
SCENES=ROOT/'src/scenes';PROJECTS=ROOT/'src/projects';SCENES.mkdir(parents=True,exist_ok=True);PROJECTS.mkdir(parents=True,exist_ok=True)
CHAPTERS=['prologue','chapter1','chapter2','chapter3','chapter4','chapter5','chapter6','epilogue']
PREFIX={'prologue':'P','chapter1':'A','chapter2':'B','chapter3':'C','chapter4':'D','chapter5':'E','chapter6':'F','epilogue':'Z'}

def units(text):
    return [re.sub(r'\s+','',s) for s in re.findall(r'[^。！？!?]+[。！？!?]?',text) if s.strip()]
def divide(parts,wanted):
    assert len(parts)>=wanted,(len(parts),wanted)
    grouped=[];pos=0
    for idx in range(wanted):
        left=wanted-idx
        if left==1:grouped.append(parts[pos:]);break
        max_end=len(parts)-(left-1);target=sum(map(len,parts[pos:]))/left;end=pos+1
        while end<max_end and sum(map(len,parts[pos:end]))<target:end+=1
        if end>pos+1 and abs(sum(map(len,parts[pos:end-1]))-target)<abs(sum(map(len,parts[pos:end]))-target):end-=1
        grouped.append(parts[pos:end]);pos=end
    assert len(grouped)==wanted and all(grouped);assert ''.join(map(''.join,grouped))==''.join(parts)
    return grouped
def cue_break(narration):
    chunks=[]
    for sentence in re.findall(r'[^。！？!?]+[。！？!?]?',narration):
        sentence=sentence.strip()
        while len(sentence)>35:
            opts=[i+1 for i,c in enumerate(sentence[:36]) if c in '、，,。' and i>=12]
            boundary=max(opts) if opts else min([i for i in range(17,min(35,len(sentence))) if sentence[i] in 'はがをにでとへも'] or [33])
            chunks.append(sentence[:boundary]);sentence=sentence[boundary:]
        if sentence:chunks.append(sentence)
    assert ''.join(chunks).replace(' ','')==re.sub(r'\s+','',narration)
    cues=[];t=0.
    for s in chunks:
        d=max(1.10,len(s)/6.05+.20);display=s if len(s)<=19 else s[:19]+'\n'+s[19:]
        assert len(display.split('\n'))<=2 and max(map(len,display.split('\n')))<=19
        cues.append({'text':s,'display':display,'start':round(t,4),'end':round(t+d,4)});t+=d
    return cues,round(t,4)

rows=[];visual={};tsv=[]
for chap in CHAPTERS:
    raw=(CONTENT/f'v134-{chap}.txt').read_text(encoding='utf-8').strip();plans=PLAN[chap]
    groups=divide(units(raw),len(plans))
    for idx,(group,p) in enumerate(zip(groups,plans)):
        sid=PREFIX[chap]+f'{idx:02d}';narration=''.join(group);cues,duration=cue_break(narration);motif=f'v134_{chap}_{idx:02d}'
        rows.append({'id':sid,'chapter':chap,'motif':motif,'title':p['title'],'narration':narration,'cues':cues,'duration':duration,'durationSource':'ESTIMATED_NOT_FOR_FINAL'})
        visual[motif]={k:p[k] for k in ['space','diagram','labels','action','motionSignature','backgroundSignature','actionProgram','camera','tempo','variant']}
        tsv.append('|'.join([sid,motif,p['title'],narration]))
        (SCENES/f'{sid}.tsx').write_text("import {makeScene2D} from '@motion-canvas/2d';\nimport {playMeaningScene} from '../lib/meaningScene';\nimport sceneData from '../../content/scenes.json';\n"+f"const scene=sceneData.find(s=>s.id==='{sid}')!;\n"+"export default makeScene2D(function* (view){yield* playMeaningScene(view,scene);});\n")
(CONTENT/'scenes.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n')
(CONTENT/'visual_plan.json').write_text(json.dumps(visual,ensure_ascii=False,indent=2)+'\n')
(CONTENT/'scene_narration.tsv').write_text('\n'.join(tsv)+'\n')
META={"version":1,"shared":{"background":"rgb(7,14,20)","range":[0,None],"size":{"x":1920,"y":1080},"audioOffset":0},"preview":{"fps":30,"resolutionScale":0.5},"rendering":{"fps":30,"resolutionScale":1,"colorSpace":"srgb","exporter":{"name":"@motion-canvas/ffmpeg","options":{"fastStart":True,"includeAudio":True}},"fileType":"image/png","quality":1}}
for chap in CHAPTERS:
    ids=[r['id'] for r in rows if r['chapter']==chap];imports='\n'.join(f"import s{i} from '../scenes/{sid}?scene';" for i,sid in enumerate(ids))
    (PROJECTS/f'{chap}.ts').write_text("import {makeProject} from '@motion-canvas/core';\n"+imports+'\n'+f"export default makeProject({{name:'v134-{chap}',scenes:[{','.join(f's{i}' for i in range(len(ids)))}],audio:'/media/{chap}/narration.wav'}});\n")
    (PROJECTS/f'{chap}.meta').write_text(json.dumps(META,ensure_ascii=False,separators=(',',':')))
dur=defaultdict(float)
for r in rows:dur[r['chapter']]+=r['duration']
print(json.dumps({'video':'V134','scene_count':len(rows),'estimated_duration_sec':round(sum(dur.values()),2),'chapters':dur,'cue_count':sum(len(r['cues']) for r in rows)},ensure_ascii=False))
