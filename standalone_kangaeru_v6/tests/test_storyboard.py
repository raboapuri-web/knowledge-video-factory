import json, sys, unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT))
import storyboard

class StoryboardTests(unittest.TestCase):
 def setUp(self):
  self.source=json.loads((ROOT/"gk_source.json").read_text(encoding="utf8"))
  self.board=storyboard.split_source(self.source)
 def test_full_script_preserved_without_mutation(self):
  report=storyboard.verify(self.board,self.source)
  self.assertTrue(report["source_content_preserved"])
  self.assertGreater(report["narrated_paragraphs"],200)
 def test_chapters_from_original_document(self):
  self.assertEqual(len(self.board["chapters"]),6)
  self.assertTrue(self.board["chapters"][0]["title"].startswith("プロローグ"))
  self.assertTrue(self.board["chapters"][-1]["title"].startswith("エピローグ"))
 def test_automatic_scene_count_and_meaning(self):
  self.assertGreater(len(self.board["scenes"]),30)
  self.assertGreaterEqual(len(set(x["visual_strategy"] for x in self.board["scenes"])),5)
  self.assertTrue(any(s["topic"]=="football" for s in self.board["scenes"]))
  self.assertTrue(any(s["topic"]=="medical" for s in self.board["scenes"]))
 def test_original_figures_only(self):
  for s in self.board["scenes"]:
   for v in s["numbers_from_script"]:
    self.assertIn(v,s["subtitle"])
 def test_no_api_credentials_required(self):
  self.assertEqual(self.board["method"],"deterministic chapter/paragraph + topical heuristics (no external AI API)")

if __name__=="__main__":unittest.main()
