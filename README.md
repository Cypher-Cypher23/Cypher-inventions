# Shishi Foodz — an evening at our table

A cinematic Tanzanian restaurant concept inspired by the supplied split-menu reference.

Run from this directory:

```powershell
npm.cmd start
```

Open http://localhost:4173. `npm.cmd run dev` and `node server.mjs` also work. There are no dependencies or build steps. Refresh the browser after editing; the server serves the current files from `dist/`.

The entrance uses three original generated photographs based on the supplied venue and meal references: the palm-lined exterior, the colourful open-air garden, and a generous foil-lined sharing tray. Green pillars, white benches, a reed canopy and hanging parasols carry through the scenes. A 14.5-second camera sequence combines continuous zooms and matched dissolves, then reveals the reservation invitation. This is a photographic animation, not recorded footage or a real-time 3D model. Visitors can pause, skip, or replay it; system reduced motion and the footer motion preference are respected.

The motto is **Kula Kujigalagaza.**, taken from the restaurant's published menu. It appears in the hero, founder story and footer.

The menu pairs a full-height photograph on the left with 92 retained items on the right: 23 food items and 69 drinks. Food/drink tabs, eight category groups and search keep the full selection browsable. Every row shows its listed TSh price. Cinematic crossfades, keyboard navigation, quantity controls and bag actions remain. Drinks distinguish bottles, cans and glasses; only appropriate drinks have ice choices. No extra kachumbari charge is added. Each item has its own independently generated photograph in `dist/assets/menu-items/`. Foel plain and Mafyonso were left out at the user’s request. All other published names and prices remain unchanged. See `INDIVIDUAL-MENU-IMAGES.md` for prompts, saved paths and verification. Bottles and cans stay fully visible on phones; photographs load on demand and the decoded cache is bounded. On phones, the photograph sits above the list.

The official menu data is in `dist/menu-data.js`, with a provenance copy in `menu-source.json`. Names, spelling, sizes and prices were copied from https://shishifood.com/wp-content/uploads/2026/10/Shishifoodmenu.html on 5 November 2026. See `OFFICIAL-MENU.md` for source notes. Descriptions and photography are presentation choices; ingredient/allergen details are not claimed as verified.

The sharing-table section preserves the foil-tray photograph and adds all published Visinia prices, from 2 to 17 people. The original 14 group tiers are expanded into individual guest counts; 14 and 15 share TSh 180,000, while 16 and 17 share TSh 220,000. The graduation/birthday listing is TSh 260,000. Both group and event plans can be carried into a reservation preview. Guests can choose garden benches, under the umbrellas or a sharing table with changing photographs.

The story uses a restored 1254-pixel version of the supplied founder portrait and an inset of the original interior. Original photos remain in `dist/assets/references/`. Restoration prompts are in `DRINK-ASSETS.md`; the latest supporting food and drink photographs are documented in `OFFICIAL-MENU-ASSETS.md`.

Reservations use a native dialog with required-field and date validation, Dar es Salaam time, party size, notes, a preview, and a downloadable summary. This does not reserve a real table or check availability. The meal bag persists locally and creates a downloadable sample only. No payment is taken.

The palette is warm parchment, oxblood, and brass, with garden green in the photographic scenes; fonts are Fraunces and Manrope with system fallbacks. All photos and the existing vector logo are local assets. See `CINEMATIC-ASSETS.md` for saved paths and generation prompts; `design-qa.md` records visual and interaction verification.

Check JavaScript syntax with `npm.cmd run check`.

`dist/pitch.css` contains the pitch styling, `dist/venue.css` adapts the typography and venue imagery, and `dist/official-menu.css` styles the expanded menu and motto. The established cinematic entrance and base design remain in `styles.css`. See `pitch-qa.md` for the earlier enhancement checks and design-continuity comparison.
