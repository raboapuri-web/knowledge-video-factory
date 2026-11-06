import json,sys,unittest,tempfile
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT))
import storyboard,materials

class Resp:
 def __init__(self,v):self.v=v
 def raise_for_status(self):pass
 def json(self):return self.v

class Session:
 def __init__(self,value):self.value=value
 def get(self,*a,**k):return Resp(self.value)

class MaterialTests(unittest.TestCase):
 def test_pd_cc0_only(self):
  self.assertEqual(materials.license_ok({"LicenseShortName":"CC0"}),"CC0")
  self.assertEqual(materials.license_ok({"LicenseShortName":"Public domain"}),"Public Domain")
  self.assertIsNone(materials.license_ok({"LicenseShortName":"CC BY-SA 4.0"}))
  self.assertIsNone(materials.license_ok({"LicenseShortName":"CC BY 4.0"}))
  self.assertIsNone(materials.license_ok({"LicenseShortName":""}))
 def test_reject_noncc0_candidate(self):
  page={"title":"File:goalkeeper football.jpg","imageinfo":[
     {"width":1500,"height":1000,"thumburl":"https://example.com/file.jpg",
      "extmetadata":{"LicenseShortName":{"value":"CC BY 4.0"}}}
  ]}
  x=materials.pick_candidates("goalkeeper football",Session({"query":{"pages":{"8":page}}}))
  self.assertEqual(x,[])
 def test_fallback_no_topic_has_no_unverified_photo(self):
  b={"scenes":[{"id":"s001","visual_strategy":"photo","topic":None,"photo_query":None}]}
  with tempfile.TemporaryDirectory() as t:
   result,ledger,qa=materials.choose_materials(b,t,session=Session({}))
   self.assertEqual(qa["photos_licensed"],0)
   self.assertEqual(qa["fallback_scenes"],1)
   self.assertEqual(result["scenes"][0]["visual_strategy"],"icon")
 def test_gk_pipeline_has_search_plans(self):
  source=json.loads((ROOT/"gk_source.json").read_text(encoding="utf8"))
  board=storyboard.split_source(source)
  self.assertTrue(any(x["photo_query"] and x["topic"]=="football" for x in board["scenes"]))
  self.assertTrue(any(x["topic"]=="medical" for x in board["scenes"]))
if __name__=="__main__":unittest.main()
