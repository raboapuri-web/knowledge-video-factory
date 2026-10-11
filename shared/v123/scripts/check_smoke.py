#!/usr/bin/env python3
"""Fail smoke QA if the last-painted subtitle band is missing or unreadable.
Probe three frames inside the first seven seconds (half-resolution smoke).
This verifies the actual rasterized overlay, not only JSX layer ordering.
"""
import json, subprocess, sys
from pathlib import Path
p=Path(sys.argv[1]);assert p.is_file() and p.stat().st_size>1000,p
fail=[]
for stamp in (1.6,3.4,5.8):
 out=subprocess.run(
  ['ffmpeg','-hide_banner','-loglevel','error','-ss',str(stamp),'-i',str(p),
   '-frames:v','1','-vf','scale=960:540,format=gray','-f','rawvideo','pipe:1'],
  stdout=subprocess.PIPE,stderr=subprocess.PIPE,check=True).stdout
 if len(out)!=960*540:raise RuntimeError('Invalid smoke raster')
 # Bottom 170 logical pixels => 85 physical pixels in the smoke render.
 band=out[445*960:529*960]
 black=sum(x<85 for x in band)/len(band)
 white=sum(x>164 for x in band)
 if black<.67: fail.append(f'{stamp}:subtitle backing missing ({black:.3f} dark)')
 if white<90: fail.append(f'{stamp}:subtitle glyphs missing ({white} bright pixels)')
report={'smoke':str(p),'resolution':'960x540','tested':[1.6,3.4,5.8],
        'passed':not fail,'failures':fail}
print(json.dumps(report,ensure_ascii=False))
if fail:raise SystemExit(2)
