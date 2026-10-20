#!/usr/bin/env python3
"""Smoke QA for the rasterized subtitle layer.
The subtitle backing must always be present. Because V132 now hides captions
inside VOICEVOX pre/post-phoneme silence, arbitrary probe frames may
legitimately contain no glyphs. Require glyphs on multiple samples instead of
every sample.
"""
import json, subprocess, sys
from pathlib import Path

p=Path(sys.argv[1]);assert p.is_file() and p.stat().st_size>1000,p
stamps=(1.2,2.3,3.4,4.5,5.6,6.5)
fail=[];glyph_hits=0;glyph_counts={}
for stamp in stamps:
 out=subprocess.run(
  ['ffmpeg','-hide_banner','-loglevel','error','-ss',str(stamp),'-i',str(p),
   '-frames:v','1','-vf','scale=960:540,format=gray','-f','rawvideo','pipe:1'],
  stdout=subprocess.PIPE,stderr=subprocess.PIPE,check=True).stdout
 if len(out)!=960*540:raise RuntimeError('Invalid smoke raster')
 band=out[445*960:529*960]
 black=sum(x<85 for x in band)/len(band)
 white=sum(x>164 for x in band)
 glyph_counts[str(stamp)]=white
 if black<.67: fail.append(f'{stamp}:subtitle backing missing ({black:.3f} dark)')
 if white>=90:glyph_hits+=1
if glyph_hits<2:
 fail.append(f'subtitle glyphs seen in only {glyph_hits}/{len(stamps)} probe frames')
report={'smoke':str(p),'resolution':'960x540','tested':list(stamps),
        'glyphHits':glyph_hits,'glyphCounts':glyph_counts,
        'passed':not fail,'failures':fail}
print(json.dumps(report,ensure_ascii=False))
if fail:raise SystemExit(2)
