# Venue references and typography verification

Final result: passed — 5 November 2026.

## Visual target and comparison

The user asked to extract the restaurant's look and group-meal character from four supplied photographs, change the font, and preserve the existing cinematic design. This is an adaptation of those references, rather than an exact photographic reproduction. The original split-menu layout and custom vector logo remain.

Source files, preserved unchanged in `dist/assets/references/`:

- `venue-exterior.jpg`: source `Downloads/maxresdefault.jpg`, 1280 × 720.
- `venue-interior.jpg`: source `Downloads/images (2).jpg`, 515 × 388.
- `group-meal.jpg`: source `Downloads/images (1).jpg`, 335 × 597.
- `chef.jpg`: source `Downloads/images.jpg`, 447 × 447.

The source and actual browser implementation were opened together in `.qa/venue/reference-comparison.png`, 1170 × 1200. The sheet shows the exterior, interior and sharing-meal references beside the respective implemented scenes. Source images are contained without cropping; implementation images are normalized to 700 × 300 display regions. Full-resolution captures were inspected separately to assess the complete framing, typography and controls. Evidence paths resolve from the workspace root one directory above this project.

## Five visual surfaces

- **Typography:** Fraunces and Manrope replace Cormorant Garamond and DM Sans. Browser font loading and computed font families verified. Heading and dish-name sizes adjusted for the wider display face. Desktop and phone captures show intentional wrapping without clipping.
- **Spacing and layout:** The original full-width photo/menu split, fine rules, expanded dish details, sharing planner and reservation dialog remain. Story photography now combines the chef portrait with an inset original interior photo. Mobile menu retains a photograph above the dish list. No horizontal overflow at 390 or 360 CSS pixels.
- **Colour:** Parchment, oxblood and warm brown interface colours remain. The new photography introduces the supplied venue's green pillars, red timber and colourful parasols. Header shading keeps navigation legible over the brighter scenes.
- **Image quality and framing:** Three new 1672 × 941 generated scenes preserve the references' recognizable materials and food arrangement. The exterior has an unobstructed central entrance. The middle scene carries white benches, dark cushions, green supports, a reed canopy and parasols. The final scene and planner feature a foil tray of rice, grilled meats, chips, sausages, fruit and yellow sauce. These are generated concept interpretations. The story portrait and interior inset use the supplied photographs directly; original files are unchanged. The portrait display crop excludes the supplied bottom overlay.
- **Copy and content:** Intro and story language now reflects a relaxed garden and shared meal. Feast contents match the supplied tray. Reservation settings are Garden benches, Under the umbrellas and Sharing table. The pitch continues to use sample prices and local preview/download behavior.

## Opened browser evidence

Desktop viewport: 1440 × 1000 CSS pixels, scale 1. Mobile: 390 × 844; narrow mobile: 360 × 780. Native headless Chrome was used for local screenshots and interaction checks.

- `.qa/venue/01-garden-exterior.png`, `02-umbrellas.png`, `03-group-tray-arrival.png`: entrance sequence.
- `.qa/venue/04-menu-new-type.png`: split menu with new typography.
- `.qa/venue/sharing-full.png`: complete sharing section and six-person planner.
- `.qa/venue/06-chef-story.png`: supplied portrait and interior inset.
- `.qa/venue/07-reservation-garden.png`, `08-reservation-invitation.png`: reservation flow.
- `.qa/venue/09-mobile-arrival.png`, `10-mobile-menu.png`, `11-mobile-bag.png`, `12-mobile-sharing.png`, `13-mobile-planner.png`, `14-mobile-story.png`: phone layouts.
- `.qa/venue/15-small-mobile-full.png`: full narrow-mobile document.

## Checks and fixes

`npm.cmd run check` passed. `qa-venue.mjs` completed successfully with no JavaScript exceptions. Checks verified loaded fonts, the completed entrance, cinematic dish selection, tray imagery and contents, original chef image, group-plan transfer into reservations, all three setting images, personalized invitation, configured bag pricing, reduced-motion behavior, and overflow at both phone widths.

An initial typography replacement left the old curly-apostrophe Chef’s table option unmatched. It was corrected to Sharing table before the successful interaction run. The final reservation image and invitation checks passed.

No unresolved visual or interaction issue was found within this local pitch scope. The server remains available at http://localhost:4173. No deployment was performed. Earlier pitch-enhancement evidence remains in `pitch-qa.md`.
