# Published Shishi menu import

Current display update: Foel plain and Mafyonso were subsequently removed at the user's explicit request. The remaining 92 items now have individual generated images, documented in `INDIVIDUAL-MENU-IMAGES.md`. The 94-item source record below remains preserved as provenance.

Fetched 5 November 2026 from the Menu link on [Shishi Food's homepage](https://shishifood.com/): [published food and drinks menu](https://shishifood.com/wp-content/uploads/2026/10/Shishifoodmenu.html).

The local data in `dist/menu-data.js` and its provenance copy `menu-source.json` contain all 94 item names and listed prices: 25 foods and 69 drinks. The eight groups are Wali / Ugali, Makange, Other meals, Side orders, Whisky, Wines, Spirit, and Imported & Juices. Published names, including unusual spelling, are preserved. The menu's motto is **KULA KUJIGALAGAZA**, styled with sentence case and punctuation in this design.

The menu page was downloaded with curl because the web reader could not open this domain. The raw fetched snapshot is retained at `../.qa/shishi-menu-source.html`. `../import-official-menu.py` parses names, prices and group tiers from that snapshot without executing remote code. The site's About page still contains unrelated template content; it was not used as the restaurant's menu.

## Visinia group tiers

| People | Listed TSh price |
| --- | ---: |
| 2 | 50,000 |
| 3 | 55,000 |
| 4 | 65,000 |
| 5 | 75,000 |
| 6 | 85,000 |
| 7 | 95,000 |
| 8 | 100,000 |
| 9 | 110,000 |
| 10 | 120,000 |
| 11 | 130,000 |
| 12 | 140,000 |
| 13 | 150,000 |
| 14–15 | 180,000 |
| 16–17 | 220,000 |

The published Graduation & Birthday special event listing is **TSh 260,000**. Capacity and inclusions are not specified on the source page and are not invented here. Occasion selection does not silently turn a group meal into this separate event package.

Food quantities multiply the listed item price. Bottle and can quantities multiply their respective listed price and do not use glass portions. Fresh pours have glass quantities. The earlier invented TSh 1,500 kachumbari option was removed. Local bag entries for items that still exist recalculate against the imported prices; unlisted prototype items are excluded.

Photography remains illustrative and the UI says so. Descriptions are original presentation text rather than copied source marketing. Allergen details are deferred to the restaurant. Generated support-image prompts and saved paths are in `OFFICIAL-MENU-ASSETS.md`.

This update preserves the cinematic entrance, split menu, custom logo, garden imagery, Fraunces/Manrope type and founder portrait. It does not replicate the older site's visual template or enable live bookings, orders or payments. Work remains local.
