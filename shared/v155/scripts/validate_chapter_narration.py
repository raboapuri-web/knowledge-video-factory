#!/usr/bin/env python3
"""Validate exact V155 body narration, subtitles, and TTS-only pronunciation replacements."""
import json,re,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
BOARD=json.loads((ROOT/"content"/"board.json").read_text(encoding="utf-8"))
def norm(s): return re.sub(r"\s+","",s)
def main(chapter):
    spec=next((c for c in BOARD["chapters"] if c["id"]==chapter),None)
    if not spec: raise SystemExit("unknown chapter "+chapter)
    scenes=[s for s in BOARD["scenes"] if spec["start"]<=int(s["id"][1:])<=spec["end"]]
    report=json.loads((ROOT/"media"/f"voice-report-{chapter}.json").read_text(encoding="utf-8"))
    if [s["id"] for s in scenes] != [x["scene"] for x in report["scenes"]]: raise SystemExit("scene order mismatch")
    errors=[]; first_caption=""
    for s,v in zip(scenes,report["scenes"]):
        text=s["script"].strip()
        if v.get("narration_text")!=text: errors.append(s["id"]+": narration body changed")
        cap="".join(x["text"] for x in v.get("captions",[]))
        if norm(cap)!=norm(text): errors.append(s["id"]+": captions do not preserve exact body text")
        expected_tts=text.replace("少し","すこし") if s.get("tts_reading_watch") else text
        if v.get("tts_input_text")!=expected_tts: errors.append(s["id"]+": TTS-only reading replacement mismatch")
        if not s.get("tts_reading_watch") and v.get("tts_input_text")!=text: errors.append(s["id"]+": unexpected TTS-side text replacement")
        if s.get("tts_reading_watch") and any("すこし" in x.get("text","") for x in v.get("captions",[])):
            errors.append(s["id"]+": TTS replacement leaked into subtitles")
        if not first_caption and v.get("captions"): first_caption=v["captions"][0]["text"]
    if errors:
        print("\n".join(errors)); raise SystemExit(1)
    result={"passed":True,"chapter":chapter,"scene_count":len(scenes),"body_text_preserved":True,
            "chapter_titles_excluded_from_narration_and_subtitles":True,"first_caption":first_caption}
    out=ROOT/"media"/f"narration-qa-{chapter}.json"
    out.write_text(json.dumps(result,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print(json.dumps(result,ensure_ascii=False))
if __name__=="__main__":
    if len(sys.argv)!=2: raise SystemExit("usage: validate_chapter_narration.py <chapter>")
    main(sys.argv[1])
