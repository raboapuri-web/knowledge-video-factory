# 余談学会 / 青いメガネ猫 2Dリグ

Generate layered 2D cutout assets for Blender and Motion Canvas.

## Output
GitHub Actions workflow: .github/workflows/yodan-cat-rig.yml.
Download the yodan-cat-2d-rig artifact ZIP.

- parts/*.png — full-canvas transparent RGBA images
- trimmed/*.png — tightly cropped sprites for Blender planes
- poses/*.png — 9 composited combinations (three gestures x three expressions)
- previews/contact_sheet.png — 3x3 contact sheet
- rig_manifest.json — pivots, coordinates, layer order
- yodan_cat_rig.blend — Blender orthographic cutout scene

Pose names: think, fist, point.
Expression names: jito, niyari, akire.

## Blender
Open yodan_cat_rig.blend and expand YODAN_CAT_2D_RIG. Toggle eye sprites
eyes_jito / eyes_niyari / eyes_akire and gestures
hand_think / hand_fist / hand_point. Keep only one of each visible.
Animate CTRL_HEAD_TILT, CTRL_TAIL_SWING, and CTRL_LEFT_HAND_GESTURE.
Keep ZIP directory structure intact: image file paths are relative.

## Local build
1. python -m pip install pillow cairosvg
2. python shared/mascots/yodan-cat/generate.py --out out/yodan-cat
3. blender -b -t 2 --python shared/mascots/yodan-cat/build_blend.py -- out/yodan-cat out/yodan-cat/yodan_cat_rig.blend

## Consistency / limitations
- Blue-and-white round glasses cat, broad face, sleepy eyes, white belly, thick striped tail
- All sprites use the same 800 x 960 source coordinates
- Expressions do not change the head outline or body
- The vector image is a MANUALLY AUTHORED RECONSTRUCTION guided by the supplied original mascot.
- It is NOT extracted original illustration art and is not pixel-identical.
- For exact reproduction, provide layered PSD/SVG/AI files or replace the pieces with a pixel-traced version.

This is a Blender 2D cutout puppet, not a volumetric 3D model.
