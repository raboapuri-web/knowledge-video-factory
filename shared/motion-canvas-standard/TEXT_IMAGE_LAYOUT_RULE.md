# Motion Canvas Text / Illustration Layout Rule

## Purpose
Prevent explanatory text, labels, and keywords from colliding with characters, diagrams, charts, or other focal visuals.

## Non-negotiable rules

1. Never render the literal characters `\\n` in on-screen display text.
   - Do not use escaped newline markers as visible layout control.
   - Split multi-line display copy into separate `Txt` nodes, or use separate rows in a dedicated text container.
   - Subtitle text is handled separately by the subtitle system.

2. Reserve explicit visual lanes before placing content.
   Recommended default for 1920x1080:
   - headline lane: y -360 to -250
   - main content lane: y -220 to +250
   - subtitle safe zone: bottom 150-170 px, permanently reserved

3. When a scene contains both a person/illustration and explanatory text, choose one:
   - horizontal split: text left / visual right
   - horizontal split: visual left / text right
   - vertical split: text above / visual below

4. Never center a character directly over explanatory text.
   Never allow a character body, face, chart, SVG, or card to cover important copy.

5. Text must have its own bounding area.
   Every important `Txt` node should have a deliberate `x/y/width/textAlign` layout rather than relying on default center placement.

6. If text and visual must occupy the same conceptual panel:
   - create separate child lanes inside the panel
   - keep at least 50 px visual separation between text bounds and the focal illustration bounds
   - prefer moving the text above the image rather than overlaying it

7. Do not solve collisions by shrinking text until unreadable.
   Re-layout first. Reduce font size only as a secondary measure.

## QA checklist
Before chapter rendering, representative frames with both text and imagery must satisfy:
- no literal `\\n` visible
- no headline/keyword covered by a person or diagram
- no person face/body covering important text
- no important text inside subtitle safe zone
- no main illustration inside subtitle safe zone
- text readable at contact-sheet scale

If any item fails, the scene must be re-laid out before full render.
