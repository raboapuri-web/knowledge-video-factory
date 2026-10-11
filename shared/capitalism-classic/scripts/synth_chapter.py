#!/usr/bin/env python3
"""VOICEVOX Aoyama Ryusei Normal 13, speed 1.15; measured cue timings.
No synthetic timing or silent fallback is permitted.
"""
import concurrent.futures,io,json,os,sys,time,urllib.parse,urllib.request,wave
from pathlib import Path
R=Path(__file__).resolve().parents[1]
slug=sys.argv[1] if len(sys.argv)>1 else None
valid=['prologue','cta','chapter1','chapter2','chapter3','chapter4','chapter5','epilogue']
if slug not in valid:raise SystemExit('Unknown chapter')
BASE=os.environ.get('VOICEVOX_URL','http://127.0.0.1:50021')
SP=int(os.environ.get('VOICEVOX_SPEAKER_ID',13));SPEED=float(os.environ.get('VOICEVOX_SPEED','1.15'))
def req(endpoint,data=b''):
 for attempt in range(4):
  try:
   r=urllib.request.Request(BASE+endpoint,data=data,method='POST',headers={'Content-Type':'application/json'})
   with urllib.request.urlopen(r,timeout=160) as f:return f.read()
  except Exception:
   if attempt==3:raise
   time.sleep(1.5*(attempt+1))
def voice(task):
 id,i,cue=task
 text=cue['speech'].replace('AI','エーアイ').replace('Job','ジョブ').replace('Career','キャリア').replace('Calling','コーリング')
 query=json.loads(req('/audio_query?'+urllib.parse.urlencode({'speaker':SP,'text':text})))
 query.update(speedScale=SPEED,prePhonemeLength=.04,postPhonemeLength=.06)
 raw=req('/synthesis?speaker='+str(SP),json.dumps(query,ensure_ascii=False).encode())
 with wave.open(io.BytesIO(raw)) as f:
  fmt=(f.getnchannels(),f.getsampwidth(),f.getframerate());chunk=f.readframes(f.getnframes())
  return (id,i,fmt,chunk,len(chunk)/(fmt[0]*fmt[1]*fmt[2]))
with urllib.request.urlopen(BASE+'/version',timeout=20) as f:print('voicevox',f.read().decode())
data=json.loads((R/'content/scenes.json').read_text());scenes=[s for s in data if s['chapter']==slug]
tasks=[(s['id'],i,c) for s in scenes for i,c in enumerate(s['cues'])]
with concurrent.futures.ThreadPoolExecutor(max_workers=int(os.getenv('VOICE_PARALLEL',3))) as ex:
 records={(sid,i):(fmt,pcm,duration) for sid,i,fmt,pcm,duration in ex.map(voice,tasks)}
chunks=[];output=[];fmt0=None;total=0
for s in scenes:
 s=json.loads(json.dumps(s,ensure_ascii=False));t=0
 for i,c in enumerate(s['cues']):
  fmt,pcm,dur=records[s['id'],i]
  if fmt0 is None:fmt0=fmt
  if fmt!=fmt0:raise ValueError('Inconsistent sample formats')
  c['start']=round(t,6);t+=dur;c['end']=round(t,6);chunks.append(pcm)
 s['duration']=round(t,6);s['durationSource']='VOICEVOX_MEASURED';output.append(s);total+=t
assert chunks
out=R/'media'/slug/'narration.wav';out.parent.mkdir(parents=True,exist_ok=True)
with wave.open(str(out),'wb') as w:
 w.setnchannels(fmt0[0]);w.setsampwidth(fmt0[1]);w.setframerate(fmt0[2]);w.writeframes(b''.join(chunks))
(R/'content'/f'measured-{slug}.json').write_text(json.dumps(output,ensure_ascii=False,indent=2))
(R/f'voice-report-{slug}.json').write_text(json.dumps({'chapter':slug,'speaker':'青山龍星 ノーマル','speakerId':SP,'speed':SPEED,'measuredSeconds':round(total,2),'cues':len(tasks),'scenes':len(scenes)},ensure_ascii=False,indent=2))
print('VOICE_OK',slug,round(total,2))
