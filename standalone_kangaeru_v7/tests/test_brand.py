import json,sys,unittest
from pathlib import Path
from xml.etree import ElementTree as ET
HERE=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(HERE))
import brand

class BrandProofTests(unittest.TestCase):
 @classmethod
 def setUpClass(cls):
  cls.data=json.loads((HERE/"fixtures/gk_design_samples.json").read_text(encoding="utf8"))
  cls.original=json.loads((HERE.parent/"standalone_kangaeru_v6/gk_source.json").read_text(encoding="utf8"))
 def test_all_spoken_lines_are_from_original_google_doc(self):
  text="".join(p["text"] for p in self.original["paragraphs"])
  for s in self.data["scenes"]:self.assertIn(s["narration_text"],text)
 def test_four_distinct_editorial_families(self):
  self.assertEqual(len({s["composition"] for s in self.data["scenes"]}),4)
  self.assertEqual(len(self.data["scenes"]),4)
 def test_svg_is_parseable_and_separate_subtitle_lane(self):
  for scene in self.data["scenes"]:
   doc=brand.svg(scene)
   root=ET.fromstring(doc)
   self.assertEqual(root.attrib["viewBox"],"0 0 1280 720")
   self.assertIn('y="586"',doc)
   self.assertIn('text-anchor="middle"',doc)
   self.assertIn(scene["display_text"]["headline"],doc)
 def test_reject_long_headline(self):
  x=dict(self.data["scenes"][0])
  x["display_text"]={"headline":"二十文字を超えた説明文章をそのまま表示してしまう危険な設計","labels":[]}
  with self.assertRaises(ValueError):brand.svg(x)
 def test_reject_subtitle_too_long(self):
  x=dict(self.data["scenes"][0]);x["subtitle_preview"]="あ"*51
  with self.assertRaises(ValueError):brand.svg(x)
 def test_reject_duplicate_spoken_text_as_headline(self):
  x=dict(self.data["scenes"][0]);x["display_text"]={"headline":x["narration_text"],"labels":[]}
  with self.assertRaises(ValueError):brand.svg(x)
 def test_reference_numbers_recoverable_from_real_doc(self):
  text="".join(p["text"] for p in self.original["paragraphs"])
  for n in self.data["scenes"][2]["values"]:self.assertIn(str(n),text)
if __name__=="__main__":unittest.main()
