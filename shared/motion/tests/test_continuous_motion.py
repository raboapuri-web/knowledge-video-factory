"""Regression checks for the permanent 30fps continuous camera module."""
import pathlib, sys, unittest
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[2]))
from motion.continuous_motion import motion_filter


class MotionFilterTests(unittest.TestCase):
    def test_zoom_in_updates_every_decoded_frame(self):
        s = motion_filter({"motion": "zoom_in", "scale_from": 1.0, "scale_to": 1.2}, 451)
        self.assertIn("perspective=eval=frame", s)
        self.assertIn("on/450", s)
        self.assertIn("interpolation=linear", s)
        self.assertNotIn("zoompan", s)
    def test_zoom_out_updates_every_frame(self):
        s = motion_filter({"motion": "zoom_out", "scale_from": 1.2, "scale_to": 1.0}, 90)
        self.assertIn("on/89", s)
        self.assertIn("-0.200000000", s)
    def test_pan_all_directions_have_subpixel_progress(self):
        for mode in ("pan_right", "pan_left", "pan_up", "pan_down"):
            with self.subTest(mode=mode):
                s = motion_filter({"motion": mode, "scale_from": 1.2, "scale_to": 1.2}, 301)
                self.assertIn("on/300", s)
                self.assertIn("W-W/1.2", s)
                self.assertNotIn("zoompan", s)
    def test_static_has_no_animation(self):
        self.assertEqual(motion_filter({"motion": "static"}, 120), "format=yuv420p")
    def test_wrong_fps_refused(self):
        with self.assertRaises(ValueError):
            motion_filter({"motion": "zoom_in", "scale_from": 1., "scale_to": 1.2}, 100, fps=10)


if __name__ == "__main__":
    unittest.main()
