# 🚀 Deploy guide — MACH Akihabara LP

The site is **plain static files** (HTML/CSS/JS/images/JSON). No build step is required.
Just upload the folder to any static host.

## A. Quick deploy options

### Option 1 — Netlify (drag & drop)
1. Go to https://app.netlify.com/drop
2. Drag the whole `MACH-Akihabara-LP` folder onto the page.
3. Done. Set a custom domain in **Site settings → Domain**.

### Option 2 — Cloudflare Pages / Vercel
- Connect the Git repo (or upload). Framework preset: **None / Other**.
- Build command: *(none)*  ·  Output directory: `/` (project root).

### Option 3 — GitHub Pages
1. Push the project to a GitHub repo.
2. **Settings → Pages → Branch: `main` / root**.
3. Your site: `https://<user>.github.io/<repo>/`.

### Option 4 — Any web host (Xserver, ロリポップ, S3, etc.)
- Upload the folder contents to the web root via FTP. That's it.

> After deploying, update `canonical` / `og:url` in `index.html` and `homeUrl` references
> to your real domain (see PUBLISH-CHECKLIST.md).

---

## B. Instagram feed automation (keep token OFF the front-end)

The front-end only reads `data/instagram-feed.json`. You refresh that file from a place
that can safely hold the access token. Pick one:

### B1. GitHub Action (recommended, free) — ALREADY BUILT
The implementation is included in this project:
- `scripts/fetch-instagram.js` — fetches posts via the Instagram Graph API and writes `data/instagram-feed.json`.
- `.github/workflows/instagram-feed.yml` — runs it every 6 hours + on demand, commits the result.

You only need to provide two GitHub Secrets (`IG_USER_ID`, `IG_TOKEN`).
**Full step-by-step token setup is in [INSTAGRAM-SETUP.md](INSTAGRAM-SETUP.md).**

> The Instagram **Basic Display API is deprecated**; this uses the **Instagram Graph API**
> (Instagram Business/Creator account linked to a Facebook Page). A Page access token
> derived from a long-lived user token is effectively non-expiring.

### B2. Serverless function (Netlify/Vercel/Cloudflare)
- Store the token as an environment secret.
- A scheduled function fetches the Graph API and writes/returns the same JSON shape.
- Point the front-end at it, or have it overwrite `data/instagram-feed.json` on deploy.

### B3. No API yet
- Do nothing. The page already ships `data/instagram-feed.json` + `data/instagram-fallback.json`
  with placeholder posts, so the section renders fine. Replace captions/images later.

**Never** put the token in `assets/js/*.js` or any file served to the browser.

---

## C. Server config tips
- Ensure `.json` is served with `application/json` and `.webp`/`.jpg` with correct types
  (most hosts do this automatically; our local `serve.ps1` already does).
- Enable gzip/brotli + long cache headers on `assets/` for best Lighthouse scores.
- HTTPS only (all hosts above provide it free).

---

## D. Re-optimizing images later
See **README.md → section 4**. Re-run `optimize-images.ps1` per store folder, then update
`imageCount` / `featuredImages` in `data/stores.json`.
