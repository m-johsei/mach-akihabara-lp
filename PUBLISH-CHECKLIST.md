# ✅ MACH Akihabara LP — Pre-launch checklist

Work through this before the page goes public. Items marked **PLACEHOLDER** ship with
safe interim values so nothing is broken, but must be confirmed.

## Store facts (edit `data/stores.json` AND mirror in `assets/js/config.js`)
- [ ] **Official store names** — confirm EN / JA / ZH for all 3 (`nameEn`, `nameJa`, `nameZh`).
- [ ] **Addresses** — replace the **PLACEHOLDER / TBC** `address` for all 3 stores.
- [ ] **Opening hours** — replace the **PLACEHOLDER / TBC** `hours` (currently "11:00–20:00 (TBC)").
- [x] **Google Maps URLs** — DONE. Each `googleMapUrl` now uses the real store pin
      (`https://www.google.com/maps?cid=…`): Radio Kaikan = `11216562941460380956`,
      Suehirocho = `11190472113944495200`, Hobby/Akihabara = `15295361548836907329`.
      Geo coordinates also added to the JSON-LD. (Just re-confirm each opens the right pin.)
- [ ] **Instagram URL** — confirm `https://www.instagram.com/mach_tcg_akihabara/`.
- [ ] Update the **JSON-LD** `<script type="application/ld+json">` block in `index.html`
      with the same final addresses / hours / map URLs (structured data for SEO).

## Photos
- [ ] All 3 stores have storefront + interior + product-shelf photos showing.
- [ ] `imageCount`, `heroImage`, `featuredImages` in `stores.json` match the files present.
- [ ] Gallery filter (All / Radio Kaikan / Suehirocho / Hobby) + **Show more** work.
- [ ] All images have meaningful English `alt` text (auto-generated; tweak if desired).

## Copy / compliance
- [ ] Product categories worded correctly (cards, figures, hololive goods, character goods).
- [ ] **No stock-guarantee** wording ("guaranteed stock / always available / 在庫保証").
- [ ] **No TAX-FREE** wording anywhere.
- [ ] **No "official only" / authenticity-guarantee** wording.
- [ ] **No** "No.1 / cheapest / 最安値" wording.
- [ ] Footer disclaimer present: *"Product availability may change depending on the timing of your visit."*

## Technical
- [ ] Mobile view: sticky bottom CTA (Route / Google Maps / Instagram) visible & working.
- [ ] Every **Google Maps** CTA opens the correct store.
- [ ] Instagram section shows posts (live feed or fallback) and never breaks the layout.
- [ ] `data/instagram-feed.json` refresh job configured (see `DEPLOY.md`) — **token NOT in front-end JS**.
- [ ] **OGP image** (`assets/images/og-image.jpg`) looks good when shared on LINE / FB / X.
- [ ] `<title>` = *MACH Akihabara | Pokémon Cards, Anime Figures & hololive Goods*.
- [ ] `<meta name="description">` present and correct.
- [ ] `<link rel="canonical">` and `og:url` updated to the **real domain**
      (currently `https://mach-akihabara.example.com/`).
- [ ] Favicon shows (`assets/images/brand/mach-icon.jpg`).
- [ ] **Display speed** — run Lighthouse (mobile); images are lazy-loaded & optimized.

## Final
- [ ] Test on a real phone (iOS Safari + Android Chrome).
- [ ] Test on desktop (Chrome/Edge/Firefox/Safari).
- [ ] Click every CTA once.
