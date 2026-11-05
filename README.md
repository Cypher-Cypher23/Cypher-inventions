# Shishi Foodz

A custom, responsive Tanzanian restaurant concept. Original vector logo, generated food photography, menu filters, a persistent meal bag, accessible drawer controls, and downloadable demo meal summaries.

Run locally with Node.js:

```sh
node server.mjs
```

Open http://localhost:4173. No dependencies or build step are needed. Set PORT to use another port. The website is in `dist/` and can also be served by any static host.

Check JavaScript syntax with `node --check dist/app.js`.

Prices, menu details and ingredients are illustrative. The checkout explicitly creates a demo summary; it does not submit orders or take payments. Real restaurant contact details and an ordering service can be connected later.

Fonts: Anton, DM Sans and Caveat from Google Fonts. System fallbacks are included. Generated photography and the SVG logo are stored locally in `dist/assets/`.

Desktop and mobile Chrome checks covered filters, bag totals, quantity changes, demo meal creation, mobile navigation, JavaScript errors and horizontal overflow.
