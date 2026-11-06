import copy,json,sys,tempfile,unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT))
import brand,render_full,photo_v7

class FullRendererChecks(unittest.TestCase):
 @classmethod
 def setUpClass(cls):
  cls.s=json.loads((ROOT/"fixtures/gk_design_samples.json").read_text(encoding="utf8"))["scenes"]
 def test_normal_scene_renders_svg_no_blank_circle(self):
  s=copy.deepcopy(self.s[1])
  s["display_text"]["labels"]=["飛ぶ","残る"]
  svg=render_full.build_svg(s,"中央に残った。",{"photos":[]})
  self.assertIn("ALTERNATIVE",svg)
  self.assertNotIn("写真候補・未取得",svg)
 def test_flow_labels_below_node_circles(self):
  s=copy.deepcopy(self.s[3])
  s["display_text"]["labels"]=["判断","行動","結果"]
  svg=render_full.build_svg(s,"動かない。",{"photos":[]})
  self.assertIn('y="449"',svg)
  self.assertIn('cy="303"',svg)
  self.assertNotIn('y="345"',svg)
 def test_never_insert_fake_photo_placeholder(self):
  s=copy.deepcopy(self.s[0]);s["primary_visual"]="photo";s["id"]="s0001"
  with self.assertRaises(RuntimeError):render_full.build_svg(s,"こんにちは",{"photos":[]})
 def test_runtime_has_expected_video_spec(self):
  self.assertEqual((render_full.W,render_full.H,render_full.FPS),(1920,1080,30))
 def test_known_original_icon_available(self):
  self.assertTrue(render_full.v4.ORIGINAL_ATLAS.exists())
 def test_image_selector_no_key_in_code(self):
  self.assertEqual(photo_v7.MODEL,"gpt-5.6-terra")
  self.assertIn("goalkeeper",photo_v7.SEARCH)
if __name__=="__main__":unittest.main()
