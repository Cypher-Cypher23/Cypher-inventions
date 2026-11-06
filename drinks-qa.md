# Founder portrait and expanded drinks QA

Final result: passed — 5 November 2026.

The supplied 447 × 447 portrait was restored using built-in imagegen and saved separately as `dist/assets/founder-restored.png`, 1254 × 1254. The original is unchanged. The original source, restored result and actual story-section screenshot were inspected. The restored image renders at 590 pixels wide on the 1440-pixel desktop viewport, providing more than twice its displayed width. Existing framing, inset venue photograph and page structure remain. Restoration infers detail from the low-resolution source; it is not a new photograph.

Four drink photographs were generated and inspected individually: `menu-mango.png`, `menu-watermelon.png`, `menu-ukwaju.png`, and `menu-hibiscus.png`. All are local 1536 × 1024 assets. The existing passion fruit drink remains. Image framing, warm colours, caption readability and drink-name wrapping were inspected in desktop and phone screenshots. Full prompts and asset paths are in `DRINK-ASSETS.md`.

The menu now has ten items and a dynamic photo counter. Drink handling uses the drinks category throughout choice rendering, descriptions and bag restoration, so new drinks receive glass sizes and ice options rather than plate and spice controls. Existing food behaviour is unchanged.

`npm.cmd run check` and the local Chrome checks in `../qa-drinks.mjs` passed:

- Ten total menu entries and five entries under To sip.
- Each drink loads its own image and has glass/ice controls without a food-side option.
- One chilled mango plus two glasses without ice remain separate bag variants and total TSh 15,000.
- Drink variants and total survive reload.
- Restored portrait uses the new asset and exceeds twice desktop display resolution.
- No horizontal overflow or clipped dish titles at 390 and 360 pixels.
- Rapid drink changes settle on the requested image after the cinematic transition.
- No JavaScript exceptions.

Evidence in `../.qa/drinks/`: `01-hibiscus-desktop.png`, `02-drink-bag.png`, `03-founder-desktop.png`, `04-founder-mobile.png`, `05-drinks-mobile-390.png`, `05-drinks-mobile-360.png`. The desktop founder and mobile drinks captures were opened and visually inspected after the checks. Viewports were 1440 × 1000 and 390/360 × 844 CSS pixels at scale 1.

The local preview remains at http://localhost:4173. No deployment was performed.
