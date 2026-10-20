#!/usr/bin/env python3
from pathlib import Path
import json,subprocess,sys
p=Path(sys.argv[1]);measured=Path(sys.argv[2]);reportp=Path(sys.argv[3]) if len(sys.argv)>3 else None
scenes=json.loads(measured.read_text())
events=[]
for s in scenes:
    base=float(s.get('visualSceneStart',0.0))
    for c in s['cues']:
        st=base+float(c['start']);en=base+float(c['end'])
        if en-st>=.25:events.append((st,en))
if len(events)<3:raise SystemExit('not enough subtitle events')
idxs=sorted(set([0,len(events)//4,len(events)//2,(len(events)*3)//4,len(events)-1]))
samples=[(events[i][0]+events[i][1])/2 for i in idxs]
fail=[];counts={}
for stamp in samples:
 out=subprocess.run(
  ['ffmpeg','-hide_banner','-loglevel','error','-ss',f'{stamp:.3f}','-i',str(p),
   '-frames:v','1','-vf','scale=960:540,format=gray','-f','rawvideo','pipe:1'],
  stdout=subprocess.PIPE,stderr=subprocess.PIPE,check=True).stdout
 if len(out)!=960*540:raise RuntimeError('invalid subtitle raster')
 band=out[445*960:539*960]
 bright=sum(x>164 for x in band)
 counts[f'{stamp:.3f}']=bright
 if bright<90:fail.append(f'{stamp:.3f}:burned subtitle glyphs missing ({bright})')
report={'video':str(p),'samples':samples,'brightCounts':counts,'passed':not fail,'failures':fail}
if reportp:reportp.write_text(json.dumps(report,ensure_ascii=False,indent=2))
print(json.dumps(report,ensure_ascii=False))
if fail:raise SystemExit(2)
