#!/usr/bin/env python3
"""V130 editorial scene compiler: chapter manuscripts are canonical and unabridged."""
from pathlib import Path
from collections import defaultdict
import json, re
ROOT = Path(__file__).resolve().parents[1]
CONTENT = ROOT / "content"
PLAN = json.loads((CONTENT / "v130-shot-plan.json").read_text(encoding="utf-8"))["chapters"]
SCENES = ROOT / "src/scenes"
PROJECTS = ROOT / "src/projects"
SCENES.mkdir(parents=True, exist_ok=True)
PROJECTS.mkdir(parents=True, exist_ok=True)
PREFIX = {"prologue":"P","chapter1":"A","chapter2":"B","chapter3":"C","chapter4":"D","chapter5":"E","chapter6":"F","epilogue":"Z"}
CHAPTERS = list(PREFIX)

def divide(paragraphs, wanted):
    """Divide into exactly 'wanted' contiguous meaning spaces; do not drop words."""
    assert len(paragraphs)>=wanted, (len(paragraphs),wanted)
    grouped=[]; pos=0
    for idx in range(wanted):
        remaining= wanted-idx
        if remaining == 1:
            grouped.append(paragraphs[pos:]); break
        max_end=len(paragraphs)-(remaining-1)
        target=sum(len(x) for x in paragraphs[pos:]) / remaining
        end=pos+1
        while end<max_end and sum(len(x) for x in paragraphs[pos:end]) < target:
            end+=1
        if end>pos+1 and abs(sum(len(x) for x in paragraphs[pos:end-1])-target) < abs(sum(len(x) for x in paragraphs[pos:end])-target):end-=1
        grouped.append(paragraphs[pos:end]);pos=end
    assert len(grouped)==wanted and all(grouped)
    assert "".join(map("".join,grouped))=="".join(paragraphs)
    return grouped

def cue_break(narration):
    """Preserve all speech text and split long lines at natural boundaries."""
    chunks=[]
    for sentence in re.findall(r'[^。！？!?]+[。！？!?]?',narration):
        sentence=sentence.strip()
        if not sentence: continue
        while len(sentence)>35:
            opts=[i+1 for i,c in enumerate(sentence[:36]) if c in '、，,。' and i>=12]
            if opts: boundary=max(opts)
            else:
                opts=[i for i in range(17,min(35,len(sentence))) if sentence[i] in 'はがをにでとへも']
                boundary=min(opts) if opts else 33
            chunks.append(sentence[:boundary]);sentence=sentence[boundary:]
        if sentence:chunks.append(sentence)
    assert "".join(chunks).replace(" ","")==re.sub(r'\s+',"",narration)
    t=0.; cues=[]
    for s in chunks:
        d=max(1.10,len(s)/6.1+.18)
        display=s if len(s)<=19 else s[:19]+"\n"+s[19:]
        assert len(display.split("\n"))<=2 and max(map(len,display.split("\n")))<=19
        cues.append({"text":s,"display":display,"start":round(t,4),"end":round(t+d,4)})
        t+=d
    return cues,round(t,4)

rows=[]; visual={}
for chap in CHAPTERS:
    raw=(CONTENT/f"v130-{chap}.txt").read_text(encoding="utf-8").strip()
    paras=[re.sub(r'\s+','',p) for p in re.split(r'\n\s*\n',raw) if p.strip()]
    plans=PLAN[chap]
    partition=divide(paras,len(plans))
    assert len(rows)==sum(len(PLAN[k]) for k in CHAPTERS[:CHAPTERS.index(chap)])
    for idx,(ps,p) in enumerate(zip(partition,plans)):
        sid=PREFIX[chap]+f"{idx:02d}"
        narration="".join(ps)
        cues,duration=cue_break(narration)
        motif=f"v130_{chap}_{idx:02d}"
        rows.append({"id":sid,"chapter":chap,"motif":motif,"title":p["title"],"narration":narration,
                     "cues":cues,"duration":duration,"durationSource":"ESTIMATED_NOT_FOR_FINAL"})
        visual[motif]={"kind":p["mode"],"motion":p["motion"],"labels":[p["title"]]+p["labels"]}
        (SCENES/f"{sid}.tsx").write_text(
            "import {makeScene2D} from '@motion-canvas/2d';\n"
            "import {playMeaningScene} from '../lib/meaningScene';\n"
            "import sceneData from '../../content/scenes.json';\n"
            f"const scene = sceneData.find(s => s.id === '{sid}')!;\n"
            "export default makeScene2D(function* (view) {yield* playMeaningScene(view, scene);});\n",
            encoding='utf-8'
        )
    actual="".join(x["narration"] for x in rows if x["chapter"]==chap)
    assert actual=="".join(paras),f"Manuscript truncated: {chap}"
(CONTENT/"scenes.json").write_text(json.dumps(rows,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
(CONTENT/"timing_preview.json").write_text(json.dumps({x['id']:x for x in rows},ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
(CONTENT/"visual_plan.json").write_text(json.dumps(visual,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
META={"version":1,"shared":{"background":"rgb(7,16,24)","range":[0,None],"size":{"x":1920,"y":1080},"audioOffset":0},"preview":{"fps":30,"resolutionScale":0.5},"rendering":{"fps":30,"resolutionScale":1,"colorSpace":"srgb","exporter":{"name":"@motion-canvas/ffmpeg","options":{"fastStart":True,"includeAudio":True}},"fileType":"image/png","quality":1}}
for chap in CHAPTERS:
    ids=[x["id"] for x in rows if x["chapter"]==chap]
    imports="\n".join(f"import s{i} from '../scenes/{sid}?scene';" for i,sid in enumerate(ids))
    (PROJECTS/f"{chap}.ts").write_text("import {makeProject} from '@motion-canvas/core';\n"+imports+"\n"+f"export default makeProject({{name:'v130-{chap}',scenes:[{','.join(f's{i}' for i in range(len(ids)))}],audio:'/media/{chap}/narration.wav'}});\n")
    (PROJECTS/f"{chap}.meta").write_text(json.dumps(META,ensure_ascii=False,separators=(',',':')))
print(json.dumps({"video":"V130","scene_count":len(rows),"subtitles":sum(len(x["cues"]) for x in rows),"estimated_sec":sum(x["duration"] for x in rows),"chapters":dict((c,sum(x["chapter"]==c for x in rows)) for c in CHAPTERS)},ensure_ascii=False))
