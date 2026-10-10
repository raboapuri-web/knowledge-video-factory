#!/usr/bin/env python3
"""Compile reviewed meaning beats into Motion Canvas source metadata and placeholder timings.
Actual VOICEVOX measurements replace timing values before production rendering.
"""
from pathlib import Path
import json, re, math
ROOT=Path(__file__).resolve().parents[1]
(ROOT/'src/scenes').mkdir(parents=True,exist_ok=True)
(ROOT/'src/projects').mkdir(parents=True,exist_ok=True)
(ROOT/'content').mkdir(parents=True,exist_ok=True)
rows=[]
for line in (ROOT/'content/scene_narration.tsv').read_text(encoding='utf-8').strip().splitlines():
    sid,motif,title,narration=line.split('|',3)
    assert '\\n' not in title+narration and not re.search(r'\bPLACEHOLDER\b',narration)
    chapter = 'prologue' if sid.startswith('P') else 'epilogue' if sid.startswith('E') else {'A':'chapter1','B':'chapter2','C':'chapter3','D':'chapter4'}[sid[0]]
    # No more than 36 full-width JP glyphs per cue, favor punctuation boundaries.
    items=[]
    for sentence in re.findall(r'[^。！？!?]+[。！？!?]?', narration):
        sentence=sentence.strip()
        if not sentence: continue
        while len(sentence)>35:
            # natural breath groups over fixed letter boundaries; prefer comma or conjunction
            candidates=[i+1 for i,c in enumerate(sentence[:36]) if c in '、，,。' and i>=12]
            boundary=max(candidates) if candidates else min([i for i in range(17,min(35,len(sentence))) if sentence[i] in 'はがをにでとへ'] or [33])
            items.append(sentence[:boundary]); sentence=sentence[boundary:]
        if sentence: items.append(sentence)
    cues=[];t=0
    for s in items:
        # Not used for the final video. Preview-only until VOICEVOX synthesis succeeds.
        duration=max(1.1,len(s)/6.1+0.18)
        t1=t+duration
        # Wrap to <= 19 JP glyphs per line: max 2 lines, 38 chars.
        text=s if len(s)<=19 else s[:19]+'\n'+s[19:]
        assert max(map(len,text.split('\n')))<=19, (sid,s,text)
        cues.append({'text':s, 'display':text, 'start':round(t,3), 'end':round(t1,3)})
        t=t1
    rows.append({'id':sid,'chapter':chapter,'motif':motif,'title':title,'narration':narration,
                 'cues':cues,'duration':round(t,3),'durationSource':'ESTIMATED_NOT_FOR_FINAL'})
scenes={r['id']:r for r in rows}
(ROOT/'content/scenes.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n')
(ROOT/'content/timing_preview.json').write_text(json.dumps(scenes,ensure_ascii=False,indent=2)+'\n')
# motion canvas scene wrapper per meaning-space, not a cut for each sentence.
for r in rows:
    (ROOT/'src/scenes'/f"{r['id']}.tsx").write_text(
        "import {makeScene2D} from '@motion-canvas/2d';\n"
        "import {playMeaningScene} from '../lib/meaningScene';\n"
        "import sceneData from '../../content/scenes.json';\n"
        f"const scene = sceneData.find(s => s.id === '{r['id']}')!;\n"
        "export default makeScene2D(function* (view) {\n"
        "  yield* playMeaningScene(view, scene);\n"
        "});\n")
for chapter in ['prologue']+[f'chapter{i}' for i in range(1,5)]+['epilogue']:
    chapterScenes=[r['id'] for r in rows if r['chapter']==chapter]
    imports='\n'.join(f"import s{i} from '../scenes/{n}?scene';" for i,n in enumerate(chapterScenes))
    (ROOT/'src/projects'/f'{chapter}.ts').write_text(
        "import {makeProject} from '@motion-canvas/core';\n"+imports+'\n'+
        "export default makeProject({name:'v121-"+chapter+"', scenes: ["+', '.join(f's{i}' for i in range(len(chapterScenes)))+"], audio:'/media/"+chapter+"/narration.wav'});\n")
# Motion Canvas FFmpeg exporter metadata, generated for each independent chapter project.
# Without these project.meta files the renderer can report Success without producing MP4.
MC_META = {
    "version":1,
    "shared":{"background":"rgb(10,18,32)","range":[0,None],"size":{"x":1920,"y":1080},"audioOffset":0},
    "preview":{"fps":30,"resolutionScale":0.5},
    "rendering":{"fps":30,"resolutionScale":1,"colorSpace":"srgb","exporter":{"name":"@motion-canvas/ffmpeg","options":{"fastStart":True,"includeAudio":True}},"fileType":"image/png","quality":1}
}
for ch in ['prologue']+[f'chapter{i}' for i in range(1,5)]+['epilogue']:
    (ROOT/'src/projects'/f'{ch}.meta').write_text(json.dumps(MC_META,ensure_ascii=False,separators=(',',':')))
from collections import defaultdict
chapters=defaultdict(float)
for r in rows: chapters[r['chapter']]+=r['duration']
print(json.dumps({'scene_count':len(rows),'estimated_duration_sec':round(sum(chapters.values()),2),'chapters':chapters,'cue_count':sum(len(r['cues']) for r in rows)},ensure_ascii=False))
