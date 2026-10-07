# Motion Canvas Standard — Subtitle Overlay Rule

## Mandatory rendering order

All future Motion Canvas productions must use a permanent layer hierarchy:

1. Background layer
2. Main visual/content layer
3. Header / chapter UI layer
4. Subtitle backdrop layer
5. Subtitle text layer
6. Progress / player-safe overlay layer

The subtitle layers are always the topmost visual layers.

## Implementation rule

Never add semantic scene groups directly to `view` after the subtitle overlay has been created.

Use a dedicated content layer:

```tsx
const contentLayer = createRef<Node>();
const subtitleLayer = createRef<Node>();

view.add(
  <>
    <Rect /* background */ />
    <Node ref={contentLayer} />
    <Node ref={subtitleLayer}>
      <Rect
        y={430}
        width={1740}
        height={132}
        radius={22}
        fill={'rgba(0,0,0,0.88)'}
      />
      <Txt
        ref={subtitle}
        y={430}
        width={1580}
        textAlign={'center'}
        textWrap
      />
    </Node>
  </>
);

// Every later scene must be added here:
contentLayer().add(<Node ref={group} />);
```

Because `subtitleLayer` is a sibling rendered after `contentLayer`, no later chart, character, graph, SVG, card, or animation inside `contentLayer` can cover the subtitles.

## Subtitle safe area

For 1920×1080 output:

- Reserve the bottom 150–170 px as the subtitle safe area.
- Primary visual information should remain above approximately y=340 in Motion Canvas centered coordinates.
- Charts, bars, cards, people, labels, and axes may animate behind the subtitle area, but must never be allowed to reduce subtitle readability.
- Prefer repositioning the visual above the safe area rather than relying only on the black subtitle backdrop.

## Subtitle design

- Always render a dark translucent backdrop behind subtitles.
- Recommended opacity: 0.85–0.92.
- Subtitle text must be white/off-white with strong contrast.
- Maximum 2 lines.
- Avoid overly long single chunks.
- Keep left/right inner padding of at least 70 px.
- Subtitle font size should remain readable on desktop and mobile.

## QA rule

Before full rendering, every chapter smoke render must include at least one frame with:

- a large chart or figure extending toward the lower part of the screen;
- a subtitle visible at the same time.

QA must confirm:

1. Subtitle is fully visible.
2. No chart/character/object is rendered over subtitle text.
3. Subtitle backdrop is above all visual content.
4. No subtitle text is clipped outside the safe area.
5. Main visual meaning is still understandable without placing essential information underneath the subtitle bar.

If any check fails, rendering must stop before the full chapter render.

## Absolute rule

**Subtitles are UI, not scene content. UI always renders above scene content.**

This rule applies to every future `考える夜` Motion Canvas production.
