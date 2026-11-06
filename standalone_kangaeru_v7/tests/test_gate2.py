import json,sys,tempfile,unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT))
import brand,planner,render_gate2

def sample_plans(prepared):
 rows=[]
 for i,s in enumerate(prepared["scenes"]):
  kind=["hero_question","data_bars","single_symbol","causal_flow"][i]
  labels=({"data_bars":["左右に飛ぶ","中央に残る"],"causal_flow":["選択","行動","評価"]}.get(kind,[]))
  svg={"concept":"PKゴール","meaning":"ゴールポストはGKの意思決定の具体的な現場を示す",
       "paths":[[[9,85],[9,20],[91,20],[91,85]],[[17,28],[83,28]]],
       "circles":[[53,60,8]]} if i==0 else None
  rows.append({"id":s["id"],"visual_intent":"原稿に実在するPKの判断と結果を短い図で示し、読ませない映像を目指す",
       "evidence_anchor":s["narration_text"][:7],"composition":kind,
       "display_text":{"headline":["PKの判断","止める確率","飛ぶか止まるか","周囲の評価"][i],"labels":labels},
       "values":[13.4,33.3] if kind=="data_bars" else [],
       "primary_visual":"icon" if i==0 else "diagram",
       "photo_subject":"","photo_query":"","icon_spec":svg})
 return {"scenes":rows}

class Gate2Tests(unittest.TestCase):
 def test_render_four_scenes_and_sheet(self):
  prep=planner.prepare(ROOT.parent/"standalone_kangaeru_v6/gk_source.json",4)
  merged=planner.merge_plan(prep,sample_plans(prep))
  with tempfile.TemporaryDirectory() as t:
   plan=Path(t)/"plan.json";plan.write_text(json.dumps(merged,ensure_ascii=False),encoding="utf8")
   result=render_gate2.make_gallery(plan,Path(t)/"gate2")
   self.assertTrue(result["automatic_pass"])
   self.assertEqual(result["frame_count"],4)
   self.assertEqual(result["generated_icon_count"],1)
   self.assertEqual(result["human_gate2_status"],"PENDING_REVIEW")
   self.assertEqual(len(list((Path(t)/"gate2").glob("s*.png"))),4)
   self.assertTrue((Path(t)/"gate2"/"contact_sheet.png").is_file())
 def test_failed_without_any_icons_in_icon_primary_scene(self):
  prep=planner.prepare(ROOT.parent/"standalone_kangaeru_v6/gk_source.json",4)
  d=sample_plans(prep)
  d["scenes"][0]["icon_spec"]=None
  with self.assertRaises(ValueError):
   result=planner.merge_plan(prep,d)
   with tempfile.TemporaryDirectory() as t:
    p=Path(t)/"plan.json";p.write_text(json.dumps(result,ensure_ascii=False))
    render_gate2.make_gallery(p,Path(t)/"out")

if __name__=="__main__": unittest.main()
