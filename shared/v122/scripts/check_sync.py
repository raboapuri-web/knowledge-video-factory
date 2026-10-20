#!/usr/bin/env python3
import json,subprocess,sys,wave
from pathlib import Path

if len(sys.argv)<3:
    raise SystemExit("usage: check_sync.py <mp4> <wav> [report.json]")
mp4=Path(sys.argv[1]);wavp=Path(sys.argv[2]);reportp=Path(sys.argv[3]) if len(sys.argv)>3 else None
if not mp4.is_file() or not wavp.is_file():raise SystemExit("missing sync input")

with wave.open(str(wavp),'rb') as w:
    wav_seconds=w.getnframes()/w.getframerate()

raw=subprocess.check_output([
    'ffprobe','-v','error','-show_entries','stream=codec_type,duration:format=duration',
    '-of','json',str(mp4)
],text=True)
info=json.loads(raw)
fmt=float(info.get('format',{}).get('duration') or 0)
video=None;audio=None
for s in info.get('streams',[]):
    dur=s.get('duration')
    if dur in (None,'N/A'):continue
    if s.get('codec_type')=='video' and video is None:video=float(dur)
    if s.get('codec_type')=='audio' and audio is None:audio=float(dur)
video=video if video is not None else fmt
audio=audio if audio is not None else fmt
dv=abs(video-wav_seconds);da=abs(audio-wav_seconds)
threshold=0.12
report={
    'mp4':str(mp4),'wav':str(wavp),'wavSeconds':round(wav_seconds,6),
    'videoSeconds':round(video,6),'audioSeconds':round(audio,6),'formatSeconds':round(fmt,6),
    'videoDeltaSeconds':round(dv,6),'audioDeltaSeconds':round(da,6),
    'thresholdSeconds':threshold,'passed':dv<=threshold and da<=threshold
}
if reportp:
    reportp.write_text(json.dumps(report,ensure_ascii=False,indent=2))
print(json.dumps(report,ensure_ascii=False))
if not report['passed']:raise SystemExit(2)
