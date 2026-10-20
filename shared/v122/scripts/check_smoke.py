#!/usr/bin/env python3
"""Smoke QA for Motion Canvas before subtitles are burned.
Only the dedicated subtitle backing is expected at this stage.
Burned glyphs are verified after the full render against measured voice times.
"""
import json, subprocess, sys
from pathlib import Path
p=Path(sys.argv[1]);assert p.is_file() and p.stat().st_size>1000,p
stamps=(1.2,3.4,5.8)
fail=[]
for stamp in stamps:
 out=subprocess.run(
  ['ffmpeg','-hide_banner','-loglevel','error','-ss',str(stamp),'-i',str(p),
   '-frames:v','1','-vf','scale=960:540,format=gray','-f','rawvideo','pipe:1'],
  stdout=subprocess.PIPE,stderr=subprocess.PIPE,check=True).stdout
 if len(out)!=960*540:raise RuntimeError('Invalid smoke raster')
 band=out[445*960:529*960]
 black=sum(x<85 for x in band)/len(band)
 if black<.67:fail.append(f'{stamp}:subtitle backing missing ({black:.3f} dark)')
report={'smoke':str(p),'resolution':'960x540','tested':list(stamps),'passed':not fail,'failures':fail}
print(json.dumps(report,ensure_ascii=False))
if fail:raise SystemExit(2)
