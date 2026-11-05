# Shishi Foodz

A custom, responsive Tanzanian restaurant concept. A forest green, parchment and lime palette; expressive Cormorant Garamond typography; an editorial menu; original vector logo; generated food photography; and an interactive spice cabinet with hand-drawn SVG illustrations.

Motion includes staggered headline entrances, scroll reveals, gentle plate parallax, a rotating welcome roundel, animated botanical strokes, magnetic buttons, and bag feedback. A persistent pause control and the system reduced-motion preference are respected. The meal bag, menu filters, accessible drawer and downloadable demo meal summaries remain functional.

Run locally with Node.js:

```sh
node server.mjs
```

Open http://localhost:4173. No dependencies or build step are needed. Set PORT to use another port. The website is in `dist/` and can also be served by any static host.

Check JavaScript syntax with `node --check dist/app.js`.

Prices, menu details and ingredients are illustrative. The checkout explicitly creates a demo summary; it does not submit orders or take payments. Real restaurant contact details and an ordering service can be connected later.

Fonts: Cormorant Garamond and DM Sans from Google Fonts. System fallbacks are included. Generated photography and the SVG logo are stored locally in `dist/assets/`.

Desktop and mobile Chrome checks covered filters, bag totals, quantity changes, demo meal creation, mobile navigation, spice tabs, arrow-key navigation, motion pause, reduced motion, JavaScript errors and horizontal overflow.
