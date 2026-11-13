#!/usr/bin/env python3
"""Validate exact board narration, heading exclusion, and the S001 TTS-only reading fix."""
import json,re,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
BOARD=json.loads((ROOT/"content"/"board.json").read_text(encoding="utf-8"))
HEADING=re.compile(r"^\s*##\s*(?:プロローグ|第[0-9０-９]+章|エピローグ)(?:\s*[｜|：:]\s*|\s+).+$")
def expected(s):
    kept=[]; removed=[]
    for line in s.splitlines():
        if HEADING.match(line): removed.append(line.strip())
        else: kept.append(line)
    text=re.sub(r"(?m)^##\s*","", "\n".join(kept)).replace("**","").strip()
    return text,removed
def norm(s): return re.sub(r"\s+","",s)
def main(chapter):
    spec=next((c for c in BOARD["chapters"] if c["id"]==chapter),None)
    if not spec: raise SystemExit("unknown chapter "+chapter)
    scenes=[s for s in BOARD["scenes"] if spec["start"]<=int(s["id"][1:])<=spec["end"]]
    report=json.loads((ROOT/"media"/f"voice-report-{chapter}.json").read_text(encoding="utf-8"))
    if [s["id"] for s in scenes] != [x["scene"] for x in report["scenes"]]: raise SystemExit("scene order mismatch")
    errors=[]; first_caption=""
    for s,v in zip(scenes,report["scenes"]):
        text,removed=expected(s["script"])
        if v.get("narration_text")!=text: errors.append(s["id"]+": narration body changed")
        if v.get("removed_chapter_headings",[])!=removed: errors.append(s["id"]+": heading removal mismatch")
        cap="".join(x["text"] for x in v.get("captions",[]))
        if norm(cap)!=norm(text): errors.append(s["id"]+": captions do not preserve exact body text")
        if s["id"]=="S001":
            expected_tts=text.replace("少し","すこし")
            if v.get("tts_input_text")!=expected_tts: errors.append("S001: TTS reading fix missing or incorrect")
            if "少し" not in v.get("narration_text",""): errors.append("S001: approved script text was modified")
            if any(x.get("text","").find("すこし")>=0 for x in v.get("captions",[])): errors.append("S001: reading replacement leaked into subtitles")
        elif v.get("tts_input_text")!=text: errors.append(s["id"]+": unexpected TTS-side text replacement")
        if not first_caption and v.get("captions"): first_caption=v["captions"][0]["text"]
    if errors:
        print("\n".join(errors)); raise SystemExit(1)
    result={"passed":True,"chapter":chapter,"scene_count":len(scenes),"body_text_preserved":True,"chapter_titles_excluded_from_narration_and_subtitles":True,
            "first_caption":first_caption,"S001_tts_only_replacement":"少し → すこし" if any(s["id"]=="S001" for s in scenes) else None}
    out=ROOT/"media"/f"narration-qa-{chapter}.json"
    out.write_text(json.dumps(result,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print(json.dumps(result,ensure_ascii=False))
if __name__=="__main__":
    if len(sys.argv)!=2: raise SystemExit("usage: validate_chapter_narration.py <chapter>")
    main(sys.argv[1])
