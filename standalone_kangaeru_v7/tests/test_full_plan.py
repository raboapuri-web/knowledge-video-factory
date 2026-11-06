import json,sys,unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT))
import full_plan,planner

class TestFullPlan(unittest.TestCase):
 @classmethod
 def setUpClass(cls):
  cls.src,cls.board,cls.rows=full_plan.source_rows(ROOT.parent/"standalone_kangaeru_v6"/"gk_source.json")
 def sample(self,i=0):
  raw=self.rows[i]
  return {"id":raw["id"],"visual_intent":"ゴールキーパーの判断と行為を別々の視覚要素に変換して示す",
    "evidence_anchor":raw["narration_text"][:6],
    "composition":"single_symbol","display_text":{"headline":"選択の判断","labels":[]},
    "values":[],"primary_visual":"diagram",
    "photo_subject":"","photo_query":"","icon_spec":None}
 def test_full_source_has_original_71_scenes(self):
  self.assertEqual(len(self.rows),71)
  self.assertEqual(len(self.board["chapters"]),6)
 def test_auditable_repair_not_edit_narration(self):
  original=self.rows[0]
  p=self.sample(0)
  p["evidence_anchor"]="ありえない嘘の出典"
  p["values"]=[12,88]
  p["display_text"]["headline"]="画面からはみ出す長い日本語の説明見出しをそのまま入れてしまう危険"
  result,fixes=full_plan.scene_repair(p,original)
  self.assertEqual(result["narration_text"],original["narration_text"])
  self.assertGreater(len(fixes),1)
  self.assertLessEqual(len(result["display_text"]["headline"]),18)
  self.assertEqual(result["values"],[])
 def test_no_unsupported_bars(self):
  p=self.sample(0);p["composition"]="data_bars";p["values"]=[99.98,65.43]
  p["display_text"]["labels"]=["A","B"]
  result,notes=full_plan.scene_repair(p,self.rows[0])
  self.assertNotEqual(result["composition"],"data_bars")
  self.assertTrue(notes)
 def test_no_empty_split_symbol(self):
  p=self.sample(0);p["composition"]="split_choice";p["display_text"]["labels"]=[]
  result,_=full_plan.scene_repair(p,self.rows[0])
  self.assertEqual(result["composition"],"hero_question")
 def test_global_repetition_repaired(self):
  ss=[]
  for i in range(6):
   x,_=full_plan.scene_repair(self.sample(i),self.rows[i]);ss.append(x)
  fixes,dist=full_plan.enforce_global(ss)
  self.assertGreaterEqual(len(fixes),1)
  self.assertFalse(any(ss[i]["composition"]==ss[i-1]["composition"]==ss[i-2]["composition"] for i in range(2,len(ss))))
 def test_subtitle_exact_text(self):
  for row in self.rows:
   condensed="".join(row["narration_text"].split())
   cues="".join(c["text"].replace("\n","") for c in row["subtitle_cues"])
   self.assertEqual(cues,condensed)
if __name__=="__main__":unittest.main()
