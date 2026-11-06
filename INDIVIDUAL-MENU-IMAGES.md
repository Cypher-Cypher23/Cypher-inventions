# Individual menu image delivery

Final result: passed — 5 November 2026.

All **92 retained items** now have their own independently generated photograph: 23 food items and 69 drinks. Foel plain and Mafyonso were removed at the user's explicit request. Other published names and prices are unchanged. The original 94-item source remains archived in `menu-source.json`.

## Saved assets and prompts

Built-in imagegen was used, with one independent generation per item. Final images are `dist/assets/menu-items/<item-id>.png`. Full prompts, paths, source research, assumptions and revisions are recorded in:

- `menu-image-food.json` — 23 individual plates.
- `menu-image-whisky.json` — 25 individually photographed product/size entries.
- `menu-image-wine.json` — 18 distinct wines.
- `menu-image-refreshments.json` — 26 spirits, beer/cider, cans and fresh drinks, including cleanup edits to remove unrequested writing from juice/yoghurt glasses.

Every final file has a distinct SHA-256 hash. The audit at `../.qa/individual-menu/catalog-audit.json` records all 92 paths, dimensions, file sizes and hashes. Files are at least 800 pixels wide and 1000 pixels tall; the common drink format is 1086 × 1448. These are generated menu illustrations, not official product photography or proof of the restaurant's exact plating. Unspecified brand variants and interpreted menu spelling are recorded in the respective manifest.

`menu-image-map.json` maps retained menu IDs to final images and records the requested exclusions. `../install-menu-images.py` verifies completeness, dimensions and uniqueness before changing the application. The source-import helper preserves this mapping on future imports.

## Design and loading

The existing menu layout, typography, prices and cinematic image transitions remain. Each selection and bag thumbnail uses that item's dedicated photo. Food stays full bleed. Bottles and cans use contained framing on phones, with a softly blurred version of the same photograph behind them, so caps, bases and size labels remain visible.

The complete library is not preloaded. Only the next visible choice is warmed after a selection; the decoded-image cache is limited to eight entries. A fresh browser load requested one menu-item photo.

## Verification

`../qa-individual-menu.mjs` passed:

- 92 unique asset paths and 92 unique hashes.
- All retained source names and prices unchanged; only the two requested exclusions removed.
- Every one of the 92 selections displays its own successfully decoded image.
- The cache remains bounded after browsing the full catalog.
- Phone bottle/can framing contains the full product; food retains cover framing.
- No horizontal overflow at 360 pixels.
- Bag thumbnails use dedicated images.
- Rapid cinematic selections settle on the correct final dish.
- No JavaScript exceptions.

All food images were opened and inspected on three food contact sheets. Wine, whisky and refreshment images were reviewed on their respective contact sheets; root review also checked wine/fresh-drink sheets and actual desktop/phone application captures. The complete 12-sheet archive is `../.qa/individual-menu/all-review-01.png` through `all-review-12.png`. Actual interface captures are `screen-01-liver-desktop.png` through `screen-09-bag-mobile.png` in that directory. JavaScript syntax checks passed.

The work remains local at http://localhost:4173. No deployment was performed.
