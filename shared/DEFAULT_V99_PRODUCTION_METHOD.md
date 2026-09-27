# Default Video Production Method — V99 Method

User production default: when a future video-production request does not specify another method, use the V99 philosophy.

1. One complete narration sentence maps to one authored scene.
2. The scene must visualize the meaning of that exact narration, not merely swap a background seed, color, crop, person position or generic prop.
3. Avoid similar cuts in sequence. Change semantic event, composition, action and visual grammar.
4. Give every narration sentence an original action: people must do something relevant; objects should move when the narration implies process or change.
5. Use explicit topic/phase renderers. Generic visual fallback is prohibited.
6. Every scene gets a unique scene key and background group.
7. No adjacent identical visual family. In any rolling six-scene window, target at least five different visual families.
8. Renderer coverage must be checked before voice generation: every narration sentence/variant must have an explicit authored renderer case, and the maximum case index must exactly match the sentence count for that phase.
9. Voice timing is measured before render; scenes 15 seconds or longer fail preflight.
10. TypeScript/Remotion and representative still-preview QA must pass before expensive rendering.
11. Final render uses narration, synchronized subtitles, low BGM, segmented parallel rendering, final resolution/duration QA and a contact sheet.

This is a quality rule, not a requirement to copy V99 visual assets. Each new video must design topic-specific original scenes.
