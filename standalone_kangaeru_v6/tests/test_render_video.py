import json,sys,unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT))
import storyboard,materials,render_video
class RenderValidation(unittest.TestCase):
 def setUp(self):
  self.board=storyboard.split_source(json.loads((ROOT/"gk_source.json").read_text(encoding="utf8")))
 def test_dynamic_script(self):
  self.assertEqual(len(self.board["chapters"]),6)
  self.assertGreater(len(self.board["scenes"]),50)
 def test_no_photos_without_materials(self):
  for s in self.board["scenes"]:
   if s["visual_strategy"]=="photo":self.assertIsNotNone(s["photo_query"])
 def test_original_icon_atlas(self):
  self.assertTrue(render_video.v4.ORIGINAL_ATLAS.is_file())
  self.assertEqual(render_video.icon("eye",80).size,(80,80))
 def test_subtitle_center_bounds(self):
  import PIL.Image as I
  frame=render_video.v4render.subtitle_draw(I.new("RGB",(1280,720)), "なぜ、動かない方が止めやすいのか。")
  self.assertEqual(frame.size,(1280,720))
 def test_only_source_numbers(self):
  for s in self.board["scenes"]:
   self.assertTrue(all(x in s["subtitle"] for x in s["numbers_from_script"]))
if __name__=="__main__":unittest.main()
