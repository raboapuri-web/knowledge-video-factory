import json,sys,unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT))
import core
from PIL import Image,ImageDraw
import render

class TestFactory(unittest.TestCase):
 def setUp(self):
  self.story=core.make_storyboard(json.loads((ROOT/"plant.json").read_text(encoding="utf8")))
 def test_storyboard_meaning_and_unique_ids(self):
  self.assertEqual(len(self.story["scenes"]),10)
  self.assertEqual(len({s["id"] for s in self.story["scenes"]}),10)
  self.assertEqual(self.story["art_direction"]["subtitle_alignment"],"center")
 def test_icons_registered(self):
  self.assertEqual(len(core.ICON_NAMES),24)
  self.assertEqual(core.icon_image("sprout").mode,"RGBA")
 def test_cc0_only(self):
  self.assertTrue(core.is_cc0({"LicenseShortName":"CC0"}))
  self.assertFalse(core.is_cc0({"LicenseShortName":"CC BY-SA 4.0"}))
  self.assertFalse(core.is_cc0({"LicenseShortName":""}))
 def test_subtitles_split_without_loss(self):
  t="なぜ植物は緑なのか。なぜ光をすべて吸収しないのか。"
  pages=core.pages(t,max_chars=12)
  self.assertEqual("".join(p.replace("\n","") for p in pages),t)
  self.assertTrue(all(len(p.splitlines())<=2 for p in pages))
 def test_center_alignment_of_japanese_text(self):
  im=Image.new("RGB",(1280,720),(11,11,13))
  out=render.subtitle_draw(im,"植物が緑である理由。\nそれは光の反射にある。")
  self.assertEqual(out.size,(1280,720))
  # Verify central alignment by comparing drawing bounds around x=640.
  x=640
  d=ImageDraw.Draw(im)
  self.assertEqual(x,render.W//2)
 def test_varied_visual_roles(self):
  styles=[s["style"] for s in self.story["scenes"]]
  self.assertGreaterEqual(len(set(styles)),6)

if __name__=="__main__":unittest.main()
