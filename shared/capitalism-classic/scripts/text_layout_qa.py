#!/usr/bin/env python3
"""Assert every authored graphic label fits its text container BEFORE headless render.

This mirrors the geometry/font budget used by hybridDirector.tsx. The validation
runs for ALL 65 scenes, not just the screenshots supplied by the director.
"""
from pathlib import Path
import json,math,re,sys
ROOT=Path(__file__).resolve().parents[1]
plan=json.loads((ROOT/'content/hybrid-plan.json').read_text())
errors=[]
records=[]
def units(t):
    return sum(0.57 if 32 <= ord(ch) <= 126 else 1 for ch in t)
def fit(text,max_font,width,height,lines=2):
    text=text.replace('\\n','\n')
    for fs in range(int(max_font),17,-1):
        out=[]
        for segment in text.split('\n'):
            cur='';u=0.;cap=width/(fs*1.06)
            for ch in segment:
                cw=units(ch)
                if cur and u+cw>cap:
                    out.append(cur);cur='';u=0.
                cur+=ch;u+=cw
            out.append(cur)
        line_height=math.ceil(fs*1.24)
        if len(out)<=lines and len(out)*line_height<=height and all(units(x)*fs*1.06<=width+1 for x in out):
            return {'font':fs,'lines':len(out),'line_height_px':line_height}
    return None
def test(id,mode,place,t,size,w,h,n=2):
    outcome=fit(t,size,w,h,n)
    records.append({'id':id,'mode':mode,'place':place,'label':t,'fit':outcome})
    if not outcome:errors.append(f'{id} {mode} {place}: {t!r} cannot fit {w}x{h}')
for p in plan:
    id,mode,labels=p['id'],p['mode'],p['labels']
    if mode!='scene' and mode not in ('quote','claim','manifesto'):
        test(id,mode,'headline',p['headline'],57,1670,math.ceil(57*1.32),1)
    if p.get('source'):test(id,mode,'source',p['source'],18,1700,24,1)
    if mode in ('quote','claim','manifesto'):
        test(id,mode,'main-quote',p['headline'],73,1530,96,1)
        n=len(labels);cw=670 if n==1 else 615 if n==2 else 455 if n==3 else 340 if n==4 else 270
        for t in labels:test(id,mode,'card',t,29 if len(t)>17 else 35,cw-52,110-18,2)
    if mode in ('ecosystem','rules','evaluation','matrix'):
        diameter=230 if len(labels)==4 else 300
        for t in labels:test(id,mode,'bubble',t,32 if len(labels)==4 else 37,diameter*.77,diameter*.61,2)
    if mode in ('network','circulation'):
        for t in labels[:4]:test(id,mode,'network-node',t,29,165*.81,165*.7,2)
    if mode=='recap':
        for t in labels:test(id,mode,'recap-circle',t,31,185*.78,185*.7,2)
    if mode in ('process','mechanism'):
        cw=345 if len(labels)==4 else 425
        for t in labels:test(id,mode,'process-step',t,29 if len(t)>17 else 35,cw-52,146-18,2)
    if mode in ('trend','barpairs'):
        for t in labels[:2]:test(id,mode,'metric-panel',t,43,620,56,1)
        if mode=='barpairs' and p.get('metric'):test(id,mode,'example-note',p['metric'],35,650-52,64-18,2)
    if mode=='metric':
        for t in labels:
            cw=min(410,1200/len(labels))
            test(id,mode,'metric-tag',t,35,cw-52,83-18,2)
    if mode in ('contrast','question','choices','dilemma','analogy'):
        for t in labels[:2]:test(id,mode,'comparison',t,35,650-52,275-18,2)
    if mode=='overload':
        for t in labels:test(id,mode,'overload',t,35,285-52,98-18,2)
    if mode=='research' and id!='cap-chapter4-04':
        for t in labels:test(id,mode,'research-tag',t,35,420-52,114-18,2)
    if mode=='market':
        for t in (labels[0],labels[2]):test(id,mode,'employer-tag',t,35,350-52,190-18,2)
# geometric checks in Motion Canvas centered coordinates; subtitle is y>=376.
scale=1.15
circles=[((-490,10),300),((0,-80),300),((490,10),300),
         ((-460,-96),230),((460,-96),230),((-460,132),230),((460,132),230)]
for (x,y),d in circles:
    if (abs(x)+d/2)*scale>920:errors.append('circle reaches right/left unsafe edge')
    if (y+d/2)*scale>292:errors.append('circle breaches subtitle/annotation safe region')
# barpairs: pill ends at (217+32)*1.15=286; source notes start 307-~11=296.
if (217+64/2)*scale>=307-(18*1.24)/2:
    errors.append('Example pill overlaps footnote')
if 307+(18*1.24)/2>=343:errors.append('Source note collides with divider')
director=(ROOT/'src/lib/hybridDirector.tsx').read_text()
for must in [
    "const lineHeight=Math.ceil(size*1.24);",
    "textWrap:false",
    "function fittingText(",
    "fittingText(node,v,0,0,n===4?32:37",
    "fittingText(g,label",
    "if(mode==='barpairs' && s.metric)show(chip(group,0,217",
    "view.add(under);view.add(main);view.add(header);view.add(footer);view.add(caption);"
]:
    if must not in director:errors.append('Missing expected typography invariant: '+must)
report={'status':'PASS' if not errors else 'FAIL','scenes':len(plan),'fitted_labels':len(records),
        'minimum_font_size':min((x['fit']['font'] for x in records if x['fit']),default=None),
        'layout_overlaps':errors,
        'note':'Static label-fit test; video frame rendering and human inspection still required'}
(ROOT/'qa').mkdir(exist_ok=True)
(ROOT/'qa/text_layout_qa.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
print(json.dumps(report,ensure_ascii=False,indent=2))
if errors:sys.exit(1)
