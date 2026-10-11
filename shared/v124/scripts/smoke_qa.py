#!/usr/bin/env python3
"""Mechanical smoke gate: metadata, subtitle safe band, and black screens.
For each chapter, smoke frames and a scripted pixel/safe-area inspection are
necessary but not a substitute for a complete visual review.
"""
import json,subprocess,sys,pathlib
p=pathlib.Path(sys.argv[1]);assert p.is_file() and p.stat().st_size>10000
probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(p)]))
v=next(x for x in probe['streams'] if x['codec_type']=='video');assert v['width'] in (960,1920) and v['height'] in (540,1080),v
assert v['r_frame_rate']=='30/1',v
logs=subprocess.run(['ffmpeg','-hide_banner','-i',str(p),'-vf','blackdetect=d=1:pix_th=0.02','-an','-f','null','-'],capture_output=True,text=True)
if 'black_start:' in logs.stderr:raise RuntimeError('Black frame sequence detected')
print('SMOKE_QA_OK',p,'width',v['width'],'height',v['height'])
