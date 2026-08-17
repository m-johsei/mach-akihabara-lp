/* =========================================================
   MACH Akihabara LP — instagram-feed.js
   Loads Instagram posts for the "Fresh from Instagram" section.

   SECURITY: never put an Instagram access token in front-end JS.
   This script only reads a pre-generated JSON file. Generate/refresh
   that JSON in a build step, GitHub Action, or serverless function
   that holds the token server-side.

   Load priority (each falls back to the next on failure):
     1) data/instagram-feed.json      (live, refreshed by your build)
     2) data/instagram-fallback.json  (committed placeholder)
     3) window.MACH_IG_FALLBACK       (config.js — file:// preview)
   ========================================================= */
(function () {
  'use strict';

  var MAX_POSTS = 6; // show 6 (set to 9 if you prefer a fuller grid)

  function $(s) { return document.querySelector(s); }
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function fmtDate(iso) {
    if (!iso) return '';
    var d = new Date(iso);
    if (isNaN(d)) return esc(iso);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }
  function clip(s, n) { s = String(s || ''); return s.length > n ? s.slice(0, n - 1) + '…' : s; }

  function tryFetch(url) {
    return fetch(url, { cache: 'no-cache' })
      .then(function (r) { if (!r.ok) throw new Error('http ' + r.status); return r.json(); });
  }

  function loadFeed() {
    return tryFetch('data/instagram-feed.json')
      .catch(function () { return tryFetch('data/instagram-fallback.json'); })
      .catch(function () { return window.MACH_IG_FALLBACK || { posts: [] }; });
  }

  function skeletons(grid, n) {
    grid.innerHTML = '';
    for (var i = 0; i < n; i++) {
      var s = document.createElement('div');
      s.className = 'ig-skel';
      s.innerHTML = '<div class="ig-skel__t sk-shimmer"></div>' +
        '<div class="ig-skel__b">' +
          '<div class="ig-skel__l w40 sk-shimmer"></div>' +
          '<div class="ig-skel__l w90 sk-shimmer"></div>' +
          '<div class="ig-skel__l w65 sk-shimmer"></div>' +
        '</div>';
      grid.appendChild(s);
    }
  }

  function render(grid, data) {
    var posts = (data && data.posts ? data.posts : []).slice(0, MAX_POSTS);
    grid.setAttribute('aria-busy', 'false');
    if (!posts.length) {
      grid.innerHTML = '<p style="text-align:center;font-weight:700">' +
        'Visit us on <a href="https://www.instagram.com/mach_tcg_akihabara/" target="_blank" rel="noopener" style="color:#c1349b">@mach_tcg_akihabara</a></p>';
      return;
    }
    grid.innerHTML = posts.map(function (p) {
      var url = esc(p.url || 'https://www.instagram.com/mach_tcg_akihabara/');
      return '<a class="ig-item" href="' + url + '" target="_blank" rel="noopener">' +
        '<span class="ig-item__thumb"><img src="' + esc(p.image) + '" alt="' + (esc(clip(p.captionEn, 80)) || 'MACH Instagram post') + '" loading="lazy" onerror="this.closest(\'.ig-item\').style.display=\'none\'" /></span>' +
        '<span class="ig-item__body">' +
          '<span class="ig-item__date">📅 ' + fmtDate(p.date) + '</span>' +
          '<span class="ig-item__cap">' + esc(clip(p.captionEn, 120)) +
            (p.captionZh ? '<span class="zh" lang="zh-Hant">' + esc(clip(p.captionZh, 70)) + '</span>' : '') +
          '</span>' +
          '<span class="ig-item__link">View on Instagram →</span>' +
        '</span>' +
      '</a>';
    }).join('');
  }

  document.addEventListener('DOMContentLoaded', function () {
    var grid = $('#ig-grid');
    if (!grid) return;
    skeletons(grid, MAX_POSTS);
    loadFeed()
      .then(function (data) { render(grid, data); })
      .catch(function () { render(grid, window.MACH_IG_FALLBACK || { posts: [] }); });
  });
})();
