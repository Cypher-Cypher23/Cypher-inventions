# Published menu and motto QA

Final result: passed — 5 November 2026.

## Verified content

The live menu was fetched from `https://shishifood.com/wp-content/uploads/2026/10/Shishifoodmenu.html`. The local browser check independently extracts the 94 name/price pairs from the downloaded HTML, then compares them with both the application data and all rendered menu rows. Both comparisons passed exactly. There are 25 foods, 69 drinks and eight category groups. The source's motto, Kula Kujigalagaza, is in the hero, founder story and footer.

All 14 published Visinia tiers are present. Tests cover every supported guest count from 2 to 17, including both members of the 14–15 and 16–17 ranges. The TSh 260,000 Graduation & Birthday listing is separate from group prices. Seventeen-person and event plans carry their correct price into the reservation preview.

## Interaction checks

`../qa-official-menu.mjs` completed successfully in local Chrome with no JavaScript exceptions:

- All 94 source names and prices equal application data and rendered rows.
- Food/drink filters, category selection, combined search and empty-search recovery work.
- Hennessy 200ML uses bottle quantities; two bottles cost TSh 100,000. Bottle items do not show ice controls.
- Adding one Mango Juice at TSh 5,000 gives a bag total of TSh 105,000, with separate bottle/glass descriptions; the bag survives reload.
- Every group size matches its published price; group and event reservation contexts retain those prices.
- Motto, food names, prices and drink controls fit 390- and 360-pixel viewports without horizontal overflow.
- Rapid selections retain the latest requested item and cinematic transition state settles correctly.
- Every referenced menu photograph loads.

JavaScript syntax checks passed for `dist/app.js` and `dist/menu-data.js`.

## Visual review

Desktop: 1440 × 1000 CSS pixels. Phones: 390/360 × 844, scale 1. Browser evidence is in `../.qa/official-menu/`:

- `01-motto-desktop.png`, `08-motto-mobile-390.png`, `08-motto-mobile-360.png`.
- `02-food-desktop.png`, `03-wine-desktop.png`, `09-food-mobile-390.png`, `09-food-mobile-360.png`, `10-drinks-mobile-390.png`, `10-drinks-mobile-360.png`.
- `04-source-price-bag.png`, `05-large-group-reservation.png`.
- `06-sharing-desktop.png`, `07-event-offer.png`, `11-group-selector-mobile.png`.
- `12-assets-review.png`: all eight new supporting photographs, opened together for composition, colour and quality inspection.

The desktop food menu, phone motto, phone names/prices, expanded sharing planner and supporting photograph sheet were visually inspected. Existing parchment/oxblood colours and split-menu composition remain. Fraunces headings and selected italics remain. New search/category controls sit within the right panel; listed prices align at each row's right edge. The long motto scales down on phones without clipping. Added group-size selection fits the existing planner. Category photographs are illustrative and are identified as such in the menu footer.

No unresolved issue was found in the requested local pitch scope. Local preview: http://localhost:4173. No deployment was performed.
