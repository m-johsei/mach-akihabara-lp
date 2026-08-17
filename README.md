# MACH Akihabara — Tourist Route LP

A bilingual (English / 繁體中文) static landing page that guides foreign visitors to
**3 MACH stores in Akihabara** as one "collectible hunt" route, with Google Maps as the
primary call-to-action.

> Concept: **Go MACH in Akihabara. 3 stores. One epic collectible hunt.**
> 秋葉原逛周邊，就來 MACH。三間店，一次開啟收藏尋寶之旅。

---

## 1. File structure

```
MACH-Akihabara-LP/
├─ index.html                      # The page (all 11 sections + SEO/OGP/JSON-LD)
├─ assets/
│  ├─ css/style.css                # All styling (yellow pop theme, mobile-first)
│  ├─ js/
│  │  ├─ config.js                 # Offline-preview fallback config (mirror of data/stores.json)
│  │  ├─ main.js                   # Renders stores/route/gallery/compare/footer + lightbox
│  │  └─ instagram-feed.js         # Loads & renders the Instagram section
│  └─ images/
│     ├─ radio-kaikan/             # radio-kaikan-01.jpg ... + -thumb.jpg (8 photos)
│     ├─ suehirocho/               # suehirocho-01.jpg ... (6 photos)
│     ├─ hobby-kan/                # hobby-kan-01.jpg ... (8 photos)
│     ├─ brand/                    # mach-logo.jpg, mach-icon.jpg (favicon)
│     ├─ map/                      # (reserved for a custom route map image, optional)
│     └─ og-image.jpg              # 1200×633 social share image
├─ data/
│  ├─ stores.json                  # ★ CANONICAL store config (edit this)
│  ├─ instagram-feed.json          # Live IG feed (overwritten by your build/CRON)
│  └─ instagram-fallback.json      # Placeholder IG posts (committed)
├─ serve.ps1                       # Tiny local preview server (no Node/Python needed)
├─ optimize-images.ps1             # Re-run to re-import/optimize store photos
├─ optimize-brand.ps1             # Re-run to optimize logo/icon/OGP
├─ PUBLISH-CHECKLIST.md            # ★ Must-do before going live
└─ DEPLOY.md                       # Hosting + Instagram automation steps
```

## 2. How the data loads (important)

The page renders store sections, the route, the gallery, the comparison and the footer
**from config at runtime**, so you never edit HTML to change store info.

Load order (each falls back to the next):

| Data | 1st (web server) | Fallback (file:// preview) |
|------|------------------|----------------------------|
| Stores | `data/stores.json` | `window.MACH_CONFIG` in `assets/js/config.js` |
| Instagram | `data/instagram-feed.json` → `data/instagram-fallback.json` | `window.MACH_IG_FALLBACK` in `config.js` |

**On a real web server `data/stores.json` is the single source of truth.**
`assets/js/config.js` exists only so the page still works when opened directly from disk
(`file://`), where browsers block `fetch()`. If you change store info in `stores.json` and
want the offline preview to match, mirror the change in `config.js`.

## 3. Local preview

No Node/Python required — a PowerShell static server is included.

```powershell
# from the project folder
powershell -ExecutionPolicy Bypass -File serve.ps1 -Port 8123
# then open http://localhost:8123/
```

(Opening `index.html` directly also works thanks to the `config.js` fallback, but the
Instagram/stores JSON files won't load over `file://` — use the server to test the real path.)

## 4. Importing / updating store photos

Source photos live on the Desktop in **マッハ秋葉原LP素材** with one subfolder per store:

```
Desktop/マッハ秋葉原LP素材/ラジオ会館店/   → assets/images/radio-kaikan/
Desktop/マッハ秋葉原LP素材/末広町店/       → assets/images/suehirocho/
Desktop/マッハ秋葉原LP素材/ホビー館/       → assets/images/hobby-kan/
```

The originals are huge PNGs (16–20 MB). `optimize-images.ps1` resizes & re-encodes them to
web JPEGs (full = max 1600px @ q82, thumb = max 800px @ q78) and names them sequentially
(`radio-kaikan-01.jpg`, `…-01-thumb.jpg`, …).

To re-import after adding/replacing photos:

```powershell
$s   = ".\optimize-images.ps1"
$src = "C:\Users\Owner\Desktop\マッハ秋葉原LP素材"
$out = ".\assets\images"
& $s -InDir "$src\ラジオ会館店" -Slug "radio-kaikan" -OutDir "$out\radio-kaikan"
& $s -InDir "$src\末広町店"     -Slug "suehirocho"   -OutDir "$out\suehirocho"
& $s -InDir "$src\ホビー館"     -Slug "hobby-kan"    -OutDir "$out\hobby-kan"
```

Then update each store's `imageCount`, `heroImage` and `featuredImages` in
`data/stores.json` (and `config.js`) if the number of photos changed. The gallery shows
the first ~8 per filter and a **Show more** button reveals the rest (all are lazy-loaded).

> **WebP note:** Windows' built-in GDI+ encoder can't write WebP, so photos are optimized
> to JPEG (universally supported, already small). If you later install `cwebp`, the
> `<img>` tags can be upgraded to `<picture>` with WebP sources — not required.

## 5. Where to change the important links

| What | Where |
|------|-------|
| **Google Maps URL per store** | `data/stores.json` → each store's `googleMapUrl` (mirror in `config.js`). Currently a **working search-query placeholder** — replace with the exact Google Business Profile share link before launch. |
| **Instagram URL** | `data/stores.json` `instagramUrl` / top-level `instagramAccount` (already `@mach_tcg_akihabara`). |
| **Address / hours** | `data/stores.json` `address` / `hours` (currently marked **TBC** — confirm before launch). Also update the JSON-LD block in `index.html`. |
| **Instagram posts** | `data/instagram-feed.json` (see `DEPLOY.md` for automation). |

See **PUBLISH-CHECKLIST.md** before going live and **DEPLOY.md** for hosting.

## 6. Notes on copy & compliance

- English is primary, 繁體中文 is the secondary line everywhere.
- Allowed hype only (must-visit, don't miss, packed with, treasure hunt, explore…).
- **No** "No.1 / cheapest / guaranteed stock / always available / official only / tax-free"
  claims anywhere. Footer states availability may change.
- Trademarks (Pokémon, ONE PIECE, hololive) are referenced descriptively only.
