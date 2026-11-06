# Shishi Foodz — cinematic redesign QA

final result: passed — individual images for all 92 retained menu items, 5 November 2026.

The latest report is [INDIVIDUAL-MENU-IMAGES.md](INDIVIDUAL-MENU-IMAGES.md). Every retained item has its own independently generated image and unique hash. All 92 selections were checked in the browser. Food/contact-sheet review, phone bottle framing, bag thumbnails, bounded loading/cache, rapid transitions and syntax checks passed. Foel plain and Mafyonso were removed at the user's explicit request. Other source names and prices remain unchanged.

### Previous published-menu import

The latest report is [official-menu-qa.md](official-menu-qa.md). All 94 source name/price pairs match both application data and rendered rows. Group tiers and the separate event price are verified. Motto placement, search, categories, bottle/glass quantities, persistence and mobile layouts passed checks. Desktop and phone captures and the supporting-image sheet were visually inspected.

### Previous founder and drinks update

The latest report is [drinks-qa.md](drinks-qa.md). The founder portrait now uses a separately restored 1254-pixel asset. Four drinks were added with dedicated photographs, glass portions, ice choices and correct bag persistence/pricing. Syntax checks and local desktop/mobile browser checks passed. The founder and drinks browser captures were visually inspected.

### Previous venue update

The latest report is [venue-qa.md](venue-qa.md). It covers the supplied-photo comparison, Fraunces/Manrope typography, garden scenes, sharing tray, mobile framing and successful interaction checks. Source references and implemented browser scenes were opened together in `../.qa/venue/reference-comparison.png`. Full-resolution desktop and phone captures were also inspected. JavaScript syntax and browser checks passed, with no exceptions and no horizontal overflow at 390 or 360 pixels.

## Historical cinematic verification

The following report describes the earlier implementation. Its fonts and entrance images have since been replaced as described in the latest report.

## Source and scope

Source visual truth: `C:/Users/WESTeks/Downloads/WhatsApp Image 2026-11-05 at 11.09.39.jpeg`.

The supplied image is a social-video screenshot containing a desktop restaurant UI. The restaurant rectangle, rather than the phone status bar, video controls, surrounding maroon canvas or social interface, is the visual target. The requested adaptation is Shishi's Tanzanian content and cinematic entrance, not the reference restaurant's identity or Italian dishes.

The source is 894 × 1280 px. Its restaurant UI crop is approximately x158/y440, 576 × 360 px. The browser comparison crops that region using CSS and normalizes it to 720 × 450 px. Implementation uses a 1440 × 1000 CSS-pixel desktop viewport, deviceScaleFactor 1; the menu region is 1425 × 1020 px because the desktop scrollbar occupies 15 px. This menu capture is normalized to 720 px wide in the comparison. The difference in content height is intentional: six Tanzanian dishes rather than four food categories.

## Opened visual evidence

- Full-view combined source/implementation comparison: `C:/Users/WESTeks/Desktop/restaurant/.qa/cinema/reference-comparison.png` (1502 × 680 px). Source and implementation were opened together in this one input and compared.
- Full-resolution menu capture: `.qa/cinema/04-menu-biryani.png` (1440 × 1000 px).
- Focused readable menu region: `.qa/cinema/menu-comparison.png` (1425 × 1020 px). Inspected alongside the source crop to assess type, selected rows, image framing and hierarchy.
- Opening exterior, room, final invitation: `.qa/cinema/01-exterior.png`, `02-dining-room.png`, `03-arrival.png`.
- Pilau transition result: `.qa/cinema/05-menu-pilau.png`.
- Bag and reservation states: `.qa/cinema/06-bag.png`, `07-reservation.png`, `08-reservation-preview.png`.
- 390 × 844 CSS-pixel mobile: `.qa/cinema/09-mobile-arrival.png`, `10-mobile-menu.png`, `11-mobile-selection.png`, `12-mobile-reservation.png`.
- 360 × 780 CSS-pixel mobile, full document: `.qa/cinema/13-small-mobile.png`.

All relative evidence paths above resolve from `C:/Users/WESTeks/Desktop/restaurant/`. Evidence was captured in local Chrome because no in-app browser capability is exposed in this session. No Playwright installation was used.

## Fidelity surfaces

- **Fonts and typography:** Cormorant Garamond provides the reference's editorial serif structure and italic selected state; DM Sans is used for controls. Shishi retains its supplied original wordmark. Dish names remain readable and wrap without clipping. Mobile invitation wrapping is intentional. Metadata has stronger contrast after the final pass.
- **Spacing and layout:** The menu is a continuous 50/50 photo and parchment composition. The photograph occupies the complete left panel and remains sticky on desktop. Numbered rows, expanded selected details, fine separators and a clear heading reproduce the reference's organizing idea. On mobile, a sticky photograph sits above the menu instead of compressing two columns. No horizontal overflow at 390 px or 360 px.
- **Colors and tokens:** Warm parchment, oxblood and brass fit the reference and generated restaurant materials. This is an intentional Shishi palette, not a literal copy of the reference's restaurant branding. Muted text was darkened for legibility. Selected rows use wine rather than a filled card.
- **Image quality:** Eight original scene/menu photographs plus one dedicated biryani close-up are local assets. The menu uses individual photographs, not cropped sprite sheets. The first menu photograph now contains food throughout the frame. Captions remain above animated image planes. Photographs are generated concept images; they do not document a verified venue. The entrance is a three-plane photographic zoom/dissolve sequence, not real footage or real-time 3D.
- **Copy and content:** Tanzanian dishes, ingredients, TSh prices and Swahili touches are coherent. Reservation and bag results explicitly state that they are previews. No invented address, phone number, opening hours, live availability or real booking confirmation is shown. Mobile sentence spacing was corrected where a hidden line break previously joined words.

## Comparison history and fixes

1. **[P2, fixed] Too much room in the initial menu photo.** The first full-height biryani crop showed the room in the upper half, while the reference is dominated by food. A dedicated close-up was generated as `dist/assets/menu-biryani.png` and used by both initial menu planes and subsequent selection. Final combined comparison confirms edge-to-edge food framing.
2. **[P2, fixed] Photo transitions could cover the caption.** Animated image children with z-index could paint above the caption after selection. The image stack now has its own z-index 0 context; caption shading, caption and loading state are at 1, 2 and 3. Final mobile selection capture shows the mishkaki caption. Browser inspection confirms caption z-index 2 above the background stack's 0.
3. **[P2, fixed] Mobile copy spacing and small-text contrast.** A hidden line break joined two sentences. Explicit whitespace was added. Muted text and ingredient labels were darkened. Final mobile captures confirm normal sentence spacing and clear selected details.

## Interaction verification

Browser tests passed for:

- Exterior → room → plate entrance and final reservation invitation.
- Pause freezing the camera; skip and replay controls; reduced motion entering the final state directly.
- Six dish selections, keyboard up/down selection, filter state, the juice photograph, and rapid selection resolving to the latest image.
- Image captions remaining visible after transitions and mobile photo selection.
- Bag item additions, quantities, totals and persistent selections.
- Reservation opening, required-field validation, date constraints, party size, preferred time, notes and a clearly marked preview.
- Native dialog focus containment and dismissal; mobile navigation.
- Motion pause preserving the usability of images and drawer; 360 px and 390 px layout widths.
- All non-lazy images loaded; JavaScript exception collection returned an empty list.

`node --check dist/app.js` also passed. The final screenshot-only pass was run after the visual corrections; the primary browser interaction suite passed before and after the menu-image and caption changes.

## Implementation checklist

- [x] Three-scene entrance with pause, skip, replay and reduced-motion support.
- [x] Dedicated full-height food photography and cinematic menu transitions.
- [x] Accessible selection and functional filters.
- [x] Responsive desktop and phone layouts.
- [x] Reservation preview and downloadable sample plan.
- [x] Existing local bag retained.
- [x] Side-by-side visual comparison and focused review.
- [x] Generated-asset paths and prompt set saved in `CINEMATIC-ASSETS.md`.

## Follow-up limitations

A real booking provider, operational contact details and verified availability must be connected before reservations can be sent. True continuous optical movement through a physical venue would require suitable video footage or a 3D scene; the current implementation uses generated photographic planes. No actionable P0/P1/P2 findings remain within this prototype scope.
