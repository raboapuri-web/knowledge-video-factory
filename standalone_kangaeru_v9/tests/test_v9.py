import json,sys,unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT))
import cue_plan,voice_mora,cue_visual

def sample_scene(kind="hero_question"):
 return {"id":"s001","chapter":"GK","narration_text":"ゴールキーパーが飛んだ。中央に残れば止めた。",
 "subtitle_cues":[{"text":"ゴールキーパーが飛んだ。"},{"text":"中央に残れば止めた。"}],
 "display_text":{"headline":"行動か静止か","labels":["飛ぶ","残る"]},"values":[13.4,33.3],
 "composition":kind,"primary_visual":"diagram","photo_status":"fallback_diagram"}
class CuePlan(unittest.TestCase):
 def test_valid_keyword(self):
  s=sample_scene();v={"cue_index":0,"kind":"keyword","text":"ゴールキーパー","element_index":-1}
  self.assertTrue(cue_plan.validate_one(s,s["subtitle_cues"][0],v))
 def test_unsourced_number_rejected(self):
  s=sample_scene();v={"cue_index":0,"kind":"numeric","text":"78.99%","element_index":-1}
  with self.assertRaises(ValueError):cue_plan.validate_one(s,s["subtitle_cues"][0],v)
 def test_verified_photos_only(self):
  s=sample_scene();v={"cue_index":0,"kind":"photo","text":"","element_index":-1}
  with self.assertRaises(ValueError):cue_plan.validate_one(s,s["subtitle_cues"][0],v)
 def test_diagram_elements_must_be_in_original_scene(self):
  s=sample_scene();v={"cue_index":0,"kind":"diagram_element","text":"飛ぶ","element_index":0}
  self.assertTrue(cue_plan.validate_one(s,s["subtitle_cues"][0],v))
  v["element_index"]=20
  with self.assertRaises(ValueError):cue_plan.validate_one(s,s["subtitle_cues"][0],v)
 def test_merge_percue_keeps_immutable_narration_hash(self):
  s=sample_scene()
  p={"scenes":[{"scene_id":"s001","cues":[{"cue_index":0,"kind":"keyword","text":"ゴールキーパー","element_index":-1},
     {"cue_index":1,"kind":"none","text":"","element_index":-1}]}]}
  out,issues=cue_plan.merge_batch([s],p)
  self.assertEqual(len(out[0]["cue_visuals"]),2)
  self.assertEqual(issues,[])
  self.assertEqual(out[0]["narration_sha256"],__import__("hashlib").sha256(s["narration_text"].encode()).hexdigest())

class MoraSync(unittest.TestCase):
 def test_approximate_mora_aligned_monotone_cues(self):
  s=sample_scene()
  query={"speedScale":1.06,"accent_phrases":[{"moras":[
   {"text":"ゴ","consonant_length":0.04,"vowel_length":.08},
   {"text":"ー","consonant_length":None,"vowel_length":.11},
   {"text":"ル","consonant_length":.05,"vowel_length":.07},
   {"text":"キ","consonant_length":.04,"vowel_length":.07}],
   "pause_mora":{"text":"、","vowel_length":.13}}]}
  results,metadata=voice_mora.char_to_mora_cues(s,query,6.0,10.0)
  self.assertEqual(results[0]["start"],10.0)
  self.assertAlmostEqual(results[-1]["end"],16.48)
  self.assertEqual(results[0]["end"],results[1]["start"])
  self.assertGreater(results[0]["end"],10)
  self.assertEqual(metadata["mora_count"],5)
 def test_zero_moras_declares_fallback(self):
  s=sample_scene()
  result,metadata=voice_mora.char_to_mora_cues(s,{"accent_phrases":[]},5.0)
  self.assertTrue(metadata["fallbacks"])
  self.assertGreater(result[-1]["end"],5)

class VisualUnit(unittest.TestCase):
 def test_subtitle_hold_preserves_visual_but_updates_text(self):
  s=sample_scene()
  first={"kind":"keyword","text":"ゴールキーパー","element_index":-1}
  state,_=cue_visual.change_state(s,first,cue_visual.static_state(s))
  held,changed=cue_visual.change_state(s,{"kind":"none","text":"","element_index":-1},state)
  self.assertFalse(changed)
  self.assertEqual(held,state)
  spec=cue_visual.full_motion(s,0)
  a=cue_visual.cue_svg(s,"第一字幕",state,5,spec,{"photos":[]})
  b=cue_visual.cue_svg(s,"第二字幕",held,5,spec,{"photos":[]})
  self.assertIn("第二字幕",b);self.assertIn("ゴールキーパー",b)
  self.assertNotEqual(a,b)
 def test_keyword_numeric_and_stepwise_diagram_templates(self):
  s=sample_scene("data_bars");spec=cue_visual.full_motion(s,0)
  for kind,text,index in (("keyword","ゴールキーパー",-1),("numeric","13.4",-1),("diagram_element","飛ぶ",0)):
   doc=cue_visual.cue_svg(s,"説明字幕",{"kind":kind,"text":text,"element_index":index},.6,spec,{"photos":[]})
   self.assertIn('y="586"',doc)
   self.assertIn("説明字幕",doc)
   self.assertIn('<svg ',doc)
 def test_progressive_elements_keep_fixed_slots_across_cues(self):
  s=sample_scene("data_bars")
  sp=cue_visual.full_motion(s,0)
  first=cue_visual.cue_svg(s,"飛ぶ",{"kind":"diagram_element","text":"飛ぶ","element_index":0},10,sp,{"photos":[]})
  second=cue_visual.cue_svg(s,"残る",{"kind":"diagram_element","text":"残る","element_index":1},10,sp,{"photos":[]})
  self.assertIn('x="112.0" y="268" width="464.0"',first)
  self.assertIn('x="112.0" y="268" width="464.0"',second)
  self.assertIn('x="592.0" y="268" width="464.0"',second)
 def test_verifiable_photo_remains_visible_behind_keyword_or_diagram(self):
  import tempfile,hashlib
  from PIL import Image
  with tempfile.TemporaryDirectory() as root:
   path=Path(root)/"verified.jpg"
   Image.new("RGB",(900,600),(80,89,70)).save(path,format="JPEG")
   data=path.read_bytes()
   s=sample_scene("data_bars")
   s["primary_visual"]="photo"
   s["photo_status"]="visually_verified"
   s["photo_file"]=str(path)
   ledger={"photos":[{"scene":s["id"],"license":"CC0",
       "visual_verification":{"is_match":True},"sha256":hashlib.sha256(data).hexdigest()}]}
   sp=cue_visual.full_motion(s,0)
   for kind,txt,idx in (("keyword","ゴールキーパー",-1),("numeric","13.4",-1),("diagram_element","飛ぶ",0)):
    raw=cue_visual.cue_svg(s,"証拠の字幕",{"kind":kind,"text":txt,"element_index":idx},10,sp,ledger)
    self.assertIn('data-role="verified-context-photo"',raw,kind)
    self.assertIn("証拠の字幕",raw,kind)
 def test_visual_switches_more_than_scene_count(self):
  s=sample_scene();board={"scenes":[s]}
  storyboard={"scenes":[{"scene_id":"s001","cue_visuals":[
   {"kind":"keyword","text":"ゴールキーパー","element_index":-1},
   {"kind":"numeric","text":"13.4","element_index":-1}]}]}
  n=cue_visual.visual_changes(board,storyboard)
  self.assertEqual(n["visual_changes_including_scene_boundaries"],2)
if __name__=="__main__":unittest.main()
