#!/usr/bin/env python3
"""Correct concat timing using measured chapter boundaries, retaining strict QA."""
from pathlib import Path
p=Path(__file__).resolve().parents[1]/"runtime/scripts/finalize.py"
s=p.read_text(encoding="utf-8")
def patch(old,new):
    global s
    if s.count(old)!=1: raise RuntimeError("Unexpected finalizer fragment: "+old)
    s=s.replace(old,new)
patch('        concat_lines.append("file \'"+str(video.resolve())+"\'")', '''        # MP4 concat preserves encoded segment lengths, not requested TTS durations.
        actual=float(subprocess.check_output(["ffprobe","-v","error","-show_entries","format=duration","-of","default=noprint_wrappers=1:nokey=1",str(video)],text=True))
        nominal=elapsed-chapter_start
        drift=actual-nominal
        print(json.dumps({"chapter":chapter,"nominal_seconds":nominal,"encoded_seconds":actual,"delta_seconds":drift}),flush=True)
        # At most 0.10s of mux/frame rounding per clip; reject larger discrepancies.
        if abs(drift)>0.10*(len(scene_rows)+1)+0.05:
            raise RuntimeError(f"{chapter}: excessive encoded timing drift {drift:.6f}s")
        # Reports lack encoded per-scene boundaries: interpolate the small drift
        # within each chapter, but anchor chapter boundaries to measured durations.
        for item in timeline:
            if item["chapter"]==chapter:
                item["start"]=chapter_start+(item["start"]-chapter_start)*actual/nominal
                item["end"]=chapter_start+(item["end"]-chapter_start)*actual/nominal
                item["duration"]=item["end"]-item["start"]
        elapsed=chapter_start+actual
        row=chapter_rows[-1]
        row["nominal_chapter_duration_seconds"]=round(nominal,4)
        row["chapter_duration_seconds"]=round(actual,4)
        row["chapter_card_duration_seconds"]=round(card_d*actual/nominal,4)
        row["narration_start_seconds"]=round(chapter_start+card_d*actual/nominal,3)
        row["narration_start_time"]=clock(row["narration_start_seconds"])
        row["narration_duration_seconds"]=round(actual-card_d*actual/nominal,4)
        concat_lines.append("file '"+str(video.resolve())+"'")''')
patch('    expected=elapsed+20.0','''    main_duration=float(subprocess.check_output(["ffprobe","-v","error","-show_entries","format=duration","-of","default=noprint_wrappers=1:nokey=1",str(main)],text=True))
    end_duration=float(subprocess.check_output(["ffprobe","-v","error","-show_entries","format=duration","-of","default=noprint_wrappers=1:nokey=1",str(endcard)],text=True))
    print(json.dumps({"chapter_sum_seconds":elapsed,"main_seconds":main_duration,"end_card_seconds":end_duration,"final_seconds":duration}),flush=True)
    if abs(main_duration-elapsed)>0.5 or abs(end_duration-20.0)>0.1:
        raise RuntimeError("Main concat or end-card duration mismatch")
    expected=elapsed+20.0''')
patch('scene_sheet=Image.new("RGB",(1920,9*132)', 'scene_sheet=Image.new("RGB",(1920,((len(thumbs)+9)//10)*132)')
patch('"expected_timeline_seconds":round(expected,3),"duration_delta_seconds":round(delta,3),','"expected_timeline_seconds":round(expected,3),"duration_delta_seconds":round(delta,3),') if False else None
compile(s,str(p),"exec")
p.write_text(s,encoding="utf-8")
