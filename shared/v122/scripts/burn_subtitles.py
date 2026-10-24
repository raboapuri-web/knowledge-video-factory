#!/usr/bin/env python3
from pathlib import Path
import json,subprocess,sys,wave,html

R=Path(__file__).resolve().parents[1]
slug=sys.argv[1]
mp4=R/'output'/f'v134-{slug}.mp4'
wavp=R/'media'/slug/'narration.wav'
measured=R/'content'/f'measured-{slug}.json'
if not (mp4.is_file() and wavp.is_file() and measured.is_file()):raise SystemExit('missing burn inputs')

with wave.open(str(wavp),'rb') as w:
    wav_seconds=w.getnframes()/w.getframerate()

scenes=json.loads(measured.read_text())
events=[]
for s in scenes:
    base=float(s.get('visualSceneStart',0.0))
    for c in s['cues']:
        start=base+float(c['start']);end=base+float(c['end'])
        if end<=start:continue
        text=str(c['display']).replace('\\','\\\\').replace('{','（').replace('}','）').replace('\n','\\N')
        events.append((start,end,text))

def ass_time(t):
    cs=max(0,int(round(t*100)))
    h,rem=divmod(cs,360000);m,rem=divmod(rem,6000);sec,cs=divmod(rem,100)
    return f"{h}:{m:02d}:{sec:02d}.{cs:02d}"

ass=R/'output'/f'v134-{slug}.ass'
header="""[Script Info]
ScriptType: v4.00+
PlayResX: 1920
PlayResY: 1080
WrapStyle: 2
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name,Fontname,Fontsize,PrimaryColour,SecondaryColour,OutlineColour,BackColour,Bold,Italic,Underline,StrikeOut,ScaleX,ScaleY,Spacing,Angle,BorderStyle,Outline,Shadow,Alignment,MarginL,MarginR,MarginV,Encoding
Style: Default,Noto Sans CJK JP,40,&H00F0ECE3,&H00F0ECE3,&H00020406,&H00020406,-1,0,0,0,100,100,0,0,1,2,0,2,70,70,30,1

[Events]
Format: Layer,Start,End,Style,Name,MarginL,MarginR,MarginV,Effect,Text
"""
lines=[header]
for st,en,txt in events:
    lines.append(f"Dialogue: 0,{ass_time(st)},{ass_time(en)},Default,,0,0,0,,{txt}\n")
ass.write_text(''.join(lines),encoding='utf-8')

raw=R/'output'/f'v134-{slug}-raw.mp4'
if raw.exists():raw.unlink()
mp4.rename(raw)
cmd=[
    'ffmpeg','-y','-loglevel','error','-i',str(raw),
    '-vf',f"ass={ass}",
    '-t',f"{wav_seconds:.6f}",
    '-map','0:v:0','-map','0:a:0',
    '-c:v','libx264','-preset','medium','-crf','18','-pix_fmt','yuv420p',
    '-c:a','copy','-movflags','+faststart',str(mp4)
]
subprocess.run(cmd,check=True)
raw.unlink(missing_ok=True)
report={'slug':slug,'events':len(events),'wavSeconds':round(wav_seconds,6),'ass':str(ass),'output':str(mp4),'passed':len(events)>0}
(R/f'subtitle-burn-report-{slug}.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
print(json.dumps(report,ensure_ascii=False))
if not report['passed']:raise SystemExit(2)
