import json,os,sys,tempfile,unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT))
import brand,icons,planner

def fake_spec():
 return {"concept":"ゴールの枠とボール","meaning":"PKの場面を具体的に示すためゴールとボールの形を用いる",
         "paths":[[[12,79],[12,22],[88,22],[88,79]],
                  [[20,30],[80,30]],[[50,30],[50,75]],
                  [[12,80],[88,80]]],"circles":[[50,62,8]]}

def fake_plan(prepared):
 choices=[]
 for i,s in enumerate(prepared["scenes"]):
  composition=["hero_question","split_choice","single_symbol","causal_flow"][i%4]
  choices.append({"id":s["id"],"visual_intent":"本文で扱う判断の動きや結果を図形の位置と関係で説明する",
    "evidence_anchor":s["narration_text"][:6],"composition":composition,
    "display_text":{"headline":["動くべきか","選択の分岐","判断の意味","行動と結果"][i%4],
                    "labels":(["飛ぶ","残る"] if composition=="split_choice" else
                             ["判断","行動","結果"] if composition=="causal_flow" else [])},
    "values":[],"primary_visual":"icon" if i==0 else "diagram",
    "photo_subject":"","photo_query":"","icon_spec":fake_spec() if i==0 else None})
 return {"scenes":choices}

class IconTests(unittest.TestCase):
 def test_generated_icon_is_geometry_only(self):
  icon=fake_spec();self.assertTrue(icons.validate(icon))
  drawing="".join(icons.geometry(icon,320,270))
  self.assertIn("<polyline",drawing)
  self.assertNotIn("<script",drawing)
  with tempfile.TemporaryDirectory() as tmp:
   dst=icons.export_icon(icon,Path(tmp)/"gk.svg")
   self.assertTrue(dst.exists());self.assertIn('viewBox="0 0 512 512"',dst.read_text())
 def test_out_of_bounds_icon_is_rejected(self):
  icon=fake_spec();icon["paths"]=[[[0,10],[10,10]]]
  with self.assertRaises(ValueError):icons.validate(icon)
 def test_repeated_icon_limit(self):
  with self.assertRaises(ValueError):
   icons.check_reuse([{"id":str(x),"icon_spec":fake_spec()} for x in range(3)])
 def test_existing_24_icon_fallback_only_when_meaningful(self):
  self.assertIsNone(icons.fallback({"concept":"ゴールキーパー","fallback_concept":"random"}))
  self.assertEqual(icons.fallback({"concept":"責任","fallback_concept":"responsibility"})["origin"],"original_8015")

class PlannerTests(unittest.TestCase):
 @classmethod
 def setUpClass(cls):
  cls.source=ROOT.parent/"standalone_kangaeru_v6/gk_source.json"
  cls.prepared=planner.prepare(cls.source,4)
 def test_narration_and_caption_are_separated(self):
  for s in self.prepared["scenes"]:
   joined="".join(c["text"].replace("\n","") for c in s["subtitle_cues"])
   import re
   self.assertEqual(joined,re.sub(r"\s+","",s["narration_text"]))
   self.assertTrue(all(len(c["text"].split("\n"))<=2 and all(len(line)<=20 for line in c["text"].split("\n")) for c in s["subtitle_cues"]))
 def test_merge_validated_semantic_plan(self):
  out=planner.merge_plan(self.prepared,fake_plan(self.prepared))
  self.assertTrue(out["qa"]["passed"]);self.assertEqual(out["qa"]["distinct_layouts"],4)
  self.assertEqual(out["scenes"][0]["narration_text"],self.prepared["scenes"][0]["narration_text"])
  self.assertNotEqual(out["scenes"][0]["display_text"]["headline"],out["scenes"][0]["narration_text"])
  self.assertIn("<polyline","".join(__import__("icons").geometry(out["scenes"][0]["icon_spec"],800,330)))
 def test_reject_fabricated_statistic(self):
  bad=fake_plan(self.prepared)
  bad["scenes"][0]["composition"]="data_bars"
  bad["scenes"][0]["display_text"]["labels"]=["A","B"]
  bad["scenes"][0]["values"]=[99.99,88.88]
  with self.assertRaises(ValueError):planner.merge_plan(self.prepared,bad)
 def test_reject_unanchored_visual_intent(self):
  bad=fake_plan(self.prepared)
  bad["scenes"][0]["evidence_anchor"]="出典にない架空の文章"
  with self.assertRaises(ValueError):planner.merge_plan(self.prepared,bad)
 def test_api_never_called_without_both_approvals(self):
  save=dict(os.environ)
  try:
   os.environ.pop("OPENAI_API_KEY",None);os.environ.pop("KANGAERU_V7_API_APPROVED",None)
   with self.assertRaisesRegex(RuntimeError,"OPENAI_API_KEY missing"):
    planner.call_model(self.prepared["scenes"])
  finally:
   os.environ.clear();os.environ.update(save)
if __name__=="__main__":unittest.main()
