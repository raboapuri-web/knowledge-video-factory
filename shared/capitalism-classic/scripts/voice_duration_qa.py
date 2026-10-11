#!/usr/bin/env python3
"""Reject final videos that drift from the sum of independently measured VOICEVOX cues."""
from pathlib import Path
import json,subprocess,sys
R=Path(__file__).resolve().parents[1]
chapters=['prologue','cta','chapter1','chapter2','chapter3','chapter4','chapter5','epilogue']
expected=sum(json.loads((R/f'voice-report-{c}.json').read_text())['measuredSeconds'] for c in chapters)
video=Path(sys.argv[1])
actual=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','default=nw=1:nk=1',str(video)]))
delta=actual-expected
record={'status':'PASS' if abs(delta)<=5 else 'FAIL','measuredVoiceSeconds':expected,'finalVideoSeconds':actual,'deltaSeconds':round(delta,3),'toleranceSeconds':5}
(R/'qa').mkdir(exist_ok=True)
(R/'qa/voice_duration_qa.json').write_text(json.dumps(record,indent=2))
print(json.dumps(record))
if abs(delta)>5:raise SystemExit('Narration/render timeline drift exceeds tolerance')
