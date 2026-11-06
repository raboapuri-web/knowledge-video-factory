#!/usr/bin/env python3
"""VOICEVOX audio-query timing: approximate text-character -> mora-index mapping.

The mapping is deliberately NOT claimed to be exact forced alignment: kanji,
reading differences, punctuation, and pronunciation can differ from source
character positions. Timings are monotone and rescaled to actual synthesized WAV.
"""
from __future__ import annotations
import argparse,json,math,os,re,sys
from pathlib import Path
import requests
ROOT=Path(__file__).resolve().parent
sys.path.insert(0,str(ROOT.parent/"standalone_kangaeru_v4"))
import core

def normalize(s):return re.sub(r"\s+","",s)
def mora_segments(query):
 moras=[]
 for phrase in query.get("accent_phrases",[]):
  for m in phrase.get("moras",[]):
   n=max(0.,float(m.get("consonant_length") or 0.)+float(m.get("vowel_length") or 0.))
   moras.append({"text":str(m.get("text","")),"duration_query":n,"is_pause":False})
  pause=phrase.get("pause_mora")
  if pause:
   n=max(0.,float(pause.get("consonant_length") or 0.)+float(pause.get("vowel_length") or 0.))
   moras.append({"text":str(pause.get("text","、")),"duration_query":n,"is_pause":True})
 return moras

def char_to_mora_cues(scene,query,wav_sec,scene_start=0.,post_silence=.48):
 text=normalize(scene["narration_text"])
 cues=scene["subtitle_cues"];cue_texts=[normalize(x["text"]) for x in cues]
 if "".join(cue_texts)!=text:raise ValueError("Subtitle cues are not an exact copy of source: "+scene["id"])
 if wav_sec<=0.3:raise ValueError("Invalid synthesis duration")
 moras=mora_segments(query)
 positive=sum(x["duration_query"] for x in moras)
 fallback=[]
 if positive<=1e-7:
  fallback.append("No positive VOICEVOX mora lengths; used character-ratio timing")
  moras=[{"text":c,"duration_query":1.,"is_pause":False} for c in text]
  positive=len(moras)
  if not positive:raise ValueError("No source text or moras")
 cumul=[0.]
 for m in moras:cumul.append(cumul[-1]+m["duration_query"])
 boundaries=[0];idx=0
 for chunk in cue_texts[:-1]:
  idx+=len(chunk)
  # Approximate source text character position to mora index. NOT exact kana alignment.
  boundaries.append(min(len(moras),max(0,round(idx/len(text)*len(moras)))))
 boundaries.append(len(moras))
 mapped=[(cumul[k]/positive)*wav_sec for k in boundaries]
 # Constrain estimated boundaries to be monotone, preserving first/last times.
 if any(mapped[i+1]-mapped[i]<.02 for i in range(len(mapped)-1)):
  fallback.append("Mora-index rounding caused near-zero cue duration; enforced 40ms monotone gaps")
  if wav_sec<.04*len(cues):raise ValueError("WAV too short for cue count")
  for i in range(1,len(mapped)-1):
   mapped[i]=max(mapped[i],mapped[i-1]+.04)
  for i in range(len(mapped)-2,0,-1):
   mapped[i]=min(mapped[i],mapped[i+1]-.04)
  if any(mapped[i+1]<=mapped[i] for i in range(len(mapped)-1)):
   fallback.append("Mora timing could not be made monotone; used character-position interpolation")
   mapped=[wav_sec*sum(len(x) for x in cue_texts[:i])/len(text) for i in range(len(cues)+1)]
 results=[]
 for i,cue in enumerate(cues):
  start=scene_start+mapped[i]
  end=(scene_start+wav_sec+post_silence) if i==len(cues)-1 else scene_start+mapped[i+1]
  results.append({"scene_id":scene["id"],"cue_index":i,"text":cue["text"],
     "start":round(start,5),"end":round(end,5),"start_char":sum(len(x) for x in cue_texts[:i]),
     "approx_mora_index":boundaries[i],"method":"character_position_to_mora_index_rescaled_to_wav",
     "fallback_used":bool(fallback)})
 if abs(results[0]["start"]-scene_start)>1e-4 or abs(results[-1]["end"]-(scene_start+wav_sec+post_silence))>1e-3:
  raise ValueError("Scene time boundary lost")
 if not all(results[i]["end"]>results[i]["start"] for i in range(len(results))):raise ValueError("Nonpositive cue")
 if not all(abs(results[i]["end"]-results[i+1]["start"])<.0001 for i in range(len(results)-1)):
  raise ValueError("Noncontiguous cues")
 mora_info={"scene_id":scene["id"],"normalized_character_count":len(text),
   "mora_count":len(moras),"mora_seconds_before_rescaling":round(positive,5),
   "wav_duration_seconds":round(wav_sec,5),"query_speedScale":query.get("speedScale"),
   "moras":moras,"cue_start_mora_indices":boundaries,
   "fallbacks":fallback,"approximation":"character-ratio mapping, not exact kanji/kana alignment"}
 return results,mora_info

def generate(board,out,url="http://127.0.0.1:50021"):
 out=Path(out);out.mkdir(parents=True,exist_ok=True);(out/"speech").mkdir(exist_ok=True)
 base=url.rstrip("/")
 speaker=core.resolve_voicevox_speaker(base,"青山龍星","ノーマル")
 if speaker!=13:raise RuntimeError("VOICEVOX Aoyama Ryusei Normal speaker ID != 13")
 timeline=[];cue_timeline=[];mora_timeline=[];clock=0.;fallback_counts={}
 for i,scene in enumerate(board["scenes"]):
  query_req=requests.post(base+"/audio_query",params={"text":scene["narration_text"],"speaker":speaker},timeout=90)
  query_req.raise_for_status();q=query_req.json()
  q.update({"speedScale":1.06,"intonationScale":1.02,"prePhonemeLength":.08,"postPhonemeLength":.18})
  wave=requests.post(base+"/synthesis",params={"speaker":speaker},json=q,timeout=180)
  wave.raise_for_status()
  if not wave.content.startswith(b"RIFF") or b"WAVE" not in wave.content[:16]:raise RuntimeError("Invalid WAV reply")
  wav=out/"speech"/(scene["id"]+".wav");wav.write_bytes(wave.content)
  seconds=core.wav_seconds(wav)
  if not .3<seconds<130:raise ValueError("Abnormal WAV duration")
  cues,info=char_to_mora_cues(scene,q,seconds,clock)
  scene_end=clock+seconds+.48
  timeline.append({"id":scene["id"],"wav":str(wav),"wav_duration":round(seconds,5),
   "start":round(clock,5),"end":round(scene_end,5),"cue_count":len(cues)})
  cue_timeline.extend(cues);mora_timeline.append(info)
  for reason in info["fallbacks"]:fallback_counts[reason]=fallback_counts.get(reason,0)+1
  clock=scene_end
  if (i+1)%10==0:print(json.dumps({"voicevox_scenes":i+1,"mora_cues":len(cue_timeline)},ensure_ascii=False),flush=True)
 assert len(timeline)==len(board["scenes"])
 assert len(cue_timeline)==sum(len(x["subtitle_cues"]) for x in board["scenes"])
 (out/"timeline.json").write_text(json.dumps(timeline,ensure_ascii=False,indent=2),encoding="utf8")
 (out/"cue_timeline.json").write_text(json.dumps({"method":"VOICEVOX_mora_durations_approximated_by_source_character_positions",
   "speaker":"青山龍星","style":"ノーマル","style_id":13,"speed":1.06,"intonation":1.02,
   "cues":cue_timeline,"fallback_scene_count":sum(bool(x["fallbacks"]) for x in mora_timeline),
   "fallback_reasons":fallback_counts,"approximation_notice":"Kanji/reading-to-mora mapping is NOT exact. Cues use char-position to mora-index approximation rescaled to WAV."},
  ensure_ascii=False,indent=2),encoding="utf8")
 (out/"voicevox_mora_timeline.json").write_text(json.dumps(mora_timeline,ensure_ascii=False,indent=2),encoding="utf8")
 return timeline,cue_timeline,{"scene_count":len(timeline),"cue_count":len(cue_timeline),
  "fallback_scene_count":sum(bool(x["fallbacks"]) for x in mora_timeline),
  "fallback_reasons":fallback_counts,"duration_seconds":round(clock,4),
  "mora_mapping":"approximate character-index to mora-index; scaled to actual WAV"}
if __name__=="__main__":
 a=argparse.ArgumentParser();a.add_argument("--board",required=True);a.add_argument("--out",required=True);a.add_argument("--voicevox-url",default="http://127.0.0.1:50021")
 x=a.parse_args();board=json.loads(Path(x.board).read_text(encoding="utf8"));print(json.dumps(generate(board,x.out,x.voicevox_url)[2],ensure_ascii=False))
