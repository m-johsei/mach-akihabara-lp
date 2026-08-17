/* =========================================================
   MACH Akihabara LP — main.js
   Renders stores, route, gallery, comparison, footer from config.
   Data source priority:
     1) fetch('data/stores.json')   (production / web server)
     2) window.MACH_CONFIG          (config.js — offline file:// preview)
   ========================================================= */
(function () {
  'use strict';

  var GALLERY_INITIAL = 8; // visible per filter before "Show more"

  /* ---------- helpers ---------- */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function badgeClass(c) { return 'badge badge--' + (c || 'red'); }

  /* SVG icons reused */
  var ICON_MAP = '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5A2.5 2.5 0 1112 6.5a2.5 2.5 0 010 5z"/></svg>';
  var ICON_IG = '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.3 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.3-2.2-.4a3.8 3.8 0 01-1.4-.9 3.8 3.8 0 01-.9-1.4c-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.3-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zm0 3.2A6.6 6.6 0 1018.6 12 6.6 6.6 0 0012 5.4zm0 10.9A4.3 4.3 0 1116.3 12 4.3 4.3 0 0112 16.3zm6.8-11.1a1.5 1.5 0 11-1.5-1.5 1.5 1.5 0 011.5 1.5z"/></svg>';

  /* alt text by store role */
  function altFor(store, n) {
    var base = store.nameEn + ' in Akihabara';
    return base + ' — photo ' + n;
  }

  /* ---------- load config ---------- */
  function loadConfig() {
    return fetch('data/stores.json', { cache: 'no-cache' })
      .then(function (r) { if (!r.ok) throw new Error('http ' + r.status); return r.json(); })
      .then(function (j) {
        return { stores: j.stores, instagramAccount: j.instagramAccount, stationName: j.stationName };
      })
      .catch(function () {
        var c = window.MACH_CONFIG || { stores: [] };
        return { stores: c.stores, instagramAccount: c.instagramAccount, stationName: c.stationName };
      });
  }

  /* ---------- build image list for a store ---------- */
  function storeImages(store) {
    var imgs = [];
    var feat = store.featuredImages || [];
    var seen = {};
    feat.forEach(function (f) { if (!seen[f]) { imgs.push(f); seen[f] = 1; } });
    var count = store.imageCount || feat.length;
    for (var i = 1; i <= count; i++) {
      var f = store.id + '-' + pad(i) + '.jpg';
      if (!seen[f]) { imgs.push(f); seen[f] = 1; }
    }
    return imgs.map(function (file, idx) {
      var thumb = file.replace(/\.jpg$/, '-thumb.jpg');
      return {
        store: store.id,
        storeName: store.nameEn,
        full: store.imageFolder + '/' + file,
        thumb: store.imageFolder + '/' + thumb,
        alt: altFor(store, idx + 1)
      };
    });
  }

  /* ========================================================
     RENDER: Model course (numbered itinerary)
     ======================================================== */
  var ICON_TRAIN = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 15V6a3 3 0 013-3h10a3 3 0 013 3v9a3 3 0 01-3 3l1.2 2H16l-1-2H9l-1 2H5.8L7 18a3 3 0 01-3-3zm2-6h12V6H6v3zm2.5 6a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm7 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/></svg>';

  function renderCourse(stores, stationName) {
    var list = $('#course-list');
    if (!list) return;
    // start node
    var start = el('li', 'course__step course__step--start');
    start.innerHTML =
      '<span class="course__marker" aria-hidden="true">' + ICON_TRAIN + '</span>' +
      '<div class="course__card">' +
        '<div class="course__info">' +
          '<span class="course__label">Start</span>' +
          '<p class="course__name">' + esc(stationName || 'Akihabara Station') + '</p>' +
          '<p class="course__name-ja">秋葉原站・秋葉原駅</p>' +
        '</div>' +
      '</div>';
    list.appendChild(start);
    // store nodes
    stores.forEach(function (s) {
      var li = el('li', 'course__step');
      li.innerHTML =
        '<span class="course__marker" aria-hidden="true">' + s.order + '</span>' +
        '<div class="course__card">' +
          '<div class="course__row">' +
            '<a class="course__thumb" href="' + esc(s.googleMapUrl) + '" target="_blank" rel="noopener" aria-label="Open ' + esc(s.nameEn) + ' in Google Maps">' +
              '<img src="' + esc(s.imageFolder) + '/' + esc(s.heroImage).replace(/\.jpg$/, '-thumb.jpg') + '" alt="' + esc(s.nameEn) + ' storefront" loading="lazy" />' +
            '</a>' +
            '<div class="course__info">' +
              '<span class="course__label">Spot ' + pad(s.order) + ' · ' + esc(s.badge) + '</span>' +
              '<p class="course__name">' + esc(s.nameEn) + '</p>' +
            '</div>' +
          '</div>' +
          '<a class="btn btn--map btn--sm" href="' + esc(s.googleMapUrl) + '" target="_blank" rel="noopener">' + ICON_MAP + 'Open in Google Maps</a>' +
        '</div>';
      list.appendChild(li);
    });
  }

  /* ========================================================
     RENDER: Store detail sections (4-6)
     ======================================================== */
  function renderStores(stores) {
    var host = $('#stores');
    if (!host) return;

    stores.forEach(function (s) {
      var imgs = storeImages(s);

      var rail = imgs.map(function (im) {
        return '<button type="button" class="g-item" data-full="' + esc(im.full) + '" data-store="' + esc(s.id) + '" aria-label="View photo: ' + esc(im.alt) + '">' +
          '<img src="' + esc(im.thumb) + '" alt="' + esc(im.alt) + '" loading="lazy" /></button>';
      }).join('');

      var strengths = (s.strengths || []).map(function (st) {
        return '<li><span class="chk" aria-hidden="true">✓</span>' + esc(st.en) + '</li>';
      }).join('');

      var sec = el('section', 'panel reveal spot');
      sec.id = 'store-' + s.id;
      sec.setAttribute('aria-labelledby', 'st-title-' + s.id);
      sec.innerHTML =
        '<div class="spot__topline">' +
          '<span class="spot__no" aria-hidden="true"><b>' + pad(s.order) + '</b><span>Spot</span></span>' +
          '<span class="' + badgeClass(s.badgeColor) + '">' + esc(s.badge) + '</span>' +
        '</div>' +
        '<h2 class="spot__title" id="st-title-' + s.id + '">' + esc(s.headlineEn) +
          '<span class="zh" lang="zh-Hant">' + esc(s.headlineZh) + '</span></h2>' +
        '<p class="spot__name">' + esc(s.nameEn) + '</p>' +
        '<div class="gallery-rail spot__rail">' + rail + '</div>' +
        '<p class="spot__railhint">← swipe ' + (s.imageCount || imgs.length) + ' photos / 滑動看更多 →</p>' +
        '<p class="spot__desc">' + esc(s.descriptionEn) +
          '<span class="zh" lang="zh-Hant">' + esc(s.descriptionZh) + '</span></p>' +
        '<ul class="spot__tags">' + strengths + '</ul>' +
        '<div class="spot__cta">' +
          '<a class="btn btn--map" href="' + esc(s.googleMapUrl) + '" target="_blank" rel="noopener">' + ICON_MAP + 'Open in Google Maps</a>' +
          '<a class="btn btn--white" href="' + esc(s.instagramUrl) + '" target="_blank" rel="noopener">' + ICON_IG + 'Instagram</a>' +
        '</div>';
      host.appendChild(sec);
    });
  }

  /* ========================================================
     RENDER: Gallery (masonry columns) + filter + show more + lightbox
     ======================================================== */
  var GALLERY = [];          // all image objects (for lightbox indexing)
  var currentFilter = 'all'; // which store's photos the lightbox cycles through
  function buildGallery(stores) {
    GALLERY = [];
    stores.forEach(function (s) { GALLERY = GALLERY.concat(storeImages(s)); });
  }

  /* ---------- Lightbox ---------- */
  var lbIndex = 0, lbList = [];
  function visibleList() {
    return GALLERY.map(function (im, i) { return { im: im, i: i }; })
      .filter(function (o) { return currentFilter === 'all' || o.im.store === currentFilter; });
  }
  function openLightbox(globalIndex) {
    lbList = visibleList();
    var pos = lbList.findIndex(function (o) { return o.i === globalIndex; });
    lbIndex = pos < 0 ? 0 : pos;
    showLb();
    var lb = $('#lightbox'); lb.hidden = false;
    document.body.style.overflow = 'hidden';
    $('#lb-close').focus();
  }
  function showLb() {
    var o = lbList[lbIndex]; if (!o) return;
    $('#lb-img').src = o.im.full;
    $('#lb-img').alt = o.im.alt;
    $('#lb-cap').textContent = o.im.storeName;
  }
  function closeLb() { $('#lightbox').hidden = true; document.body.style.overflow = ''; }
  function nav(d) { lbIndex = (lbIndex + d + lbList.length) % lbList.length; showLb(); }
  // Tapping a photo in a store's swipe rail opens the lightbox (cycles that store)
  function bindSpotLightbox() {
    var host = $('#stores');
    if (!host) return;
    host.addEventListener('click', function (e) {
      var item = e.target.closest('[data-full]');
      if (!item) return;
      e.preventDefault();
      var full = item.getAttribute('data-full');
      var gi = GALLERY.findIndex(function (im) { return im.full === full; });
      if (gi >= 0) { currentFilter = item.getAttribute('data-store') || 'all'; openLightbox(gi); }
    });
  }

  function bindLightbox() {
    $('#lb-close').addEventListener('click', closeLb);
    $('#lb-prev').addEventListener('click', function () { nav(-1); });
    $('#lb-next').addEventListener('click', function () { nav(1); });
    $('#lightbox').addEventListener('click', function (e) { if (e.target.id === 'lightbox') closeLb(); });
    document.addEventListener('keydown', function (e) {
      if ($('#lightbox').hidden) return;
      if (e.key === 'Escape') closeLb();
      else if (e.key === 'ArrowLeft') nav(-1);
      else if (e.key === 'ArrowRight') nav(1);
    });
  }

  /* ========================================================
     RENDER: Comparison cards
     ======================================================== */
  function renderCompareCards(stores) {
    var host = $('#compare-cards');
    if (!host) return;
    stores.forEach(function (s) {
      var tags = (s.strengths || []).slice(0, 4).map(function (st) { return '<li>' + esc(st.en) + '</li>'; }).join('');
      var c = el('div', 'cmp-card');
      c.innerHTML =
        '<span class="cmp-no">SPOT ' + pad(s.order) + '</span>' +
        '<span class="' + badgeClass(s.badgeColor) + '"><span class="dot"></span>' + esc(s.badge) + '</span>' +
        '<h3>' + esc(s.nameEn.replace('MACH ', '').replace(' Store', '')) + '</h3>' +
        '<ul>' + tags + '</ul>' +
        '<a class="btn btn--map btn--sm btn--block" href="' + esc(s.googleMapUrl) + '" target="_blank" rel="noopener">' + ICON_MAP + 'Google Maps</a>';
      host.appendChild(c);
    });
  }

  /* ========================================================
     RENDER: Final CTA buttons
     ======================================================== */
  function renderFinalCta(stores) {
    var host = $('#final-cta-grid');
    if (!host) return;
    stores.forEach(function (s) {
      var a = el('a', 'btn btn--map');
      a.href = s.googleMapUrl; a.target = '_blank'; a.rel = 'noopener';
      a.innerHTML = ICON_MAP + esc(s.nameEn.replace('MACH ', ''));
      host.appendChild(a);
    });
  }

  /* ========================================================
     RENDER: Footer stores
     ======================================================== */
  function renderFooter(stores, igAccount) {
    var host = $('#footer-stores');
    if (!host) return;
    stores.forEach(function (s) {
      var d = el('div', 'footer-store');
      d.innerHTML =
        '<h3>' + esc(s.nameEn) + '</h3>' +
        '<p>📍 ' + esc(s.address) + '</p>' +
        '<p>🕒 ' + esc(s.hours) + '</p>' +
        '<div class="f-links">' +
          '<a href="' + esc(s.googleMapUrl) + '" target="_blank" rel="noopener">Google Maps</a>' +
          '<a href="' + esc(s.instagramUrl) + '" target="_blank" rel="noopener">Instagram</a>' +
        '</div>';
      host.appendChild(d);
    });
  }

  /* ========================================================
     Scroll reveal
     ======================================================== */
  function setupReveal() {
    var els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    els.forEach(function (e) { io.observe(e); });
  }

  /* ========================================================
     Init
     ======================================================== */
  function init(cfg) {
    var stores = (cfg.stores || []).slice().sort(function (a, b) { return (a.order || 0) - (b.order || 0); });
    if (!stores.length) { console.warn('MACH: no store config loaded'); return; }
    renderCourse(stores, cfg.stationName);
    buildGallery(stores);
    renderStores(stores);
    renderFinalCta(stores);
    renderFooter(stores, cfg.instagramAccount);
    bindLightbox();
    bindSpotLightbox();
    setupReveal();
    var y = $('#year'); if (y) y.textContent = new Date().getFullYear();
    // expose for instagram-feed.js if it needs the account
    window.__MACH_STORES = stores;
  }

  document.addEventListener('DOMContentLoaded', function () {
    loadConfig().then(init).catch(function (e) { console.error('MACH init failed', e); });
  });
})();
