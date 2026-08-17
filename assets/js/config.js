/*
 * config.js — OFFLINE-PREVIEW FALLBACK ONLY.
 *
 * On a real web server the page loads /data/stores.json and /data/instagram-feed.json
 * via fetch(). When the page is opened directly from disk (file://), browsers block
 * those fetches, so the page falls back to the data defined here.
 *
 * Keep this in sync with data/stores.json if you edit store info and want the
 * file:// preview to match. The canonical source for production is data/stores.json.
 */
window.MACH_CONFIG = {
  instagramAccount: "https://www.instagram.com/mach_tcg_akihabara/",
  stationName: "Akihabara Station",
  stores: [
    {
      id: "radio-kaikan",
      order: 1,
      nameEn: "MACH Radio Kaikan Store",
      nameJa: "マッハ ラジオ会館店",
      nameZh: "MACH 秋葉原無線電會館店",
      role: "Start here",
      badge: "Start Here",
      badgeColor: "red",
      headlineEn: "Start at MACH Radio Kaikan Store.",
      headlineZh: "第一站，就從 MACH Radio Kaikan Store 開始。",
      descriptionEn: "Right by Akihabara Station inside the famous Radio Kaikan building. The easy first stop on your MACH route — packed with cards, lucky draws, figures and supplies.",
      descriptionZh: "就在秋葉原站旁、知名的無線電會館大樓內。MACH 路線輕鬆好逛的第一站，卡牌、一番賞、模型與卡牌週邊應有盡有。",
      strengths: [
        { en: "Easy first stop near Akihabara Station", zh: "鄰近秋葉原站，輕鬆好逛的第一站" },
        { en: "Cards, lucky draws, figures and supplies", zh: "卡牌、一番賞、模型與收納用品" },
        { en: "Great for Pokémon and ONE PIECE card hunters", zh: "寶可夢與航海王卡牌玩家必逛" }
      ],
      googleMapUrl: "https://www.google.com/maps?cid=11216562941460380956",
      lat: 35.6979149, lng: 139.7719571,
      instagramUrl: "https://www.instagram.com/mach_tcg_akihabara/",
      address: "Akihabara Radio Kaikan, 1-15-16 Sotokanda, Chiyoda-ku, Tokyo (floor TBC — confirm before launch)",
      hours: "11:00–20:00 (TBC — confirm before launch)",
      imageFolder: "assets/images/radio-kaikan",
      heroImage: "radio-kaikan-07.jpg",
      featuredImages: ["radio-kaikan-07.jpg", "radio-kaikan-04.jpg", "radio-kaikan-05.jpg", "radio-kaikan-03.jpg"],
      imageCount: 8
    },
    {
      id: "suehirocho",
      order: 2,
      nameEn: "MACH Suehirocho Store",
      nameJa: "マッハ 末広町店",
      nameZh: "MACH 末廣町店",
      role: "Cards & Figures",
      badge: "Cards & Figures",
      badgeColor: "cyan",
      headlineEn: "More cards. More figures. More to hunt.",
      headlineZh: "更多卡牌，更多模型，更多驚喜等你挖掘。",
      descriptionEn: "If you love Pokémon cards and anime figures, don't miss this stop. Shelves packed with product volume — the perfect second stop on the MACH route.",
      descriptionZh: "喜歡寶可夢卡牌和動漫模型，這一站不能錯過。整面貨架滿滿商品，是 MACH 路線完美的第二站。",
      strengths: [
        { en: "Pokémon cards", zh: "寶可夢卡牌" },
        { en: "Anime figures", zh: "動漫模型" },
        { en: "Large product volume", zh: "豐富的商品量" },
        { en: "Great second stop on the MACH route", zh: "MACH 路線的絕佳第二站" }
      ],
      googleMapUrl: "https://www.google.com/maps?cid=11190472113944495200",
      lat: 35.7026471, lng: 139.7719907,
      instagramUrl: "https://www.instagram.com/mach_tcg_akihabara/",
      address: "Sotokanda, Chiyoda-ku, Tokyo (near Suehirocho — full address TBC, confirm before launch)",
      hours: "11:00–20:00 (TBC — confirm before launch)",
      imageFolder: "assets/images/suehirocho",
      heroImage: "suehirocho-01.jpg",
      featuredImages: ["suehirocho-01.jpg", "suehirocho-03.jpg", "suehirocho-04.jpg", "suehirocho-05.jpg"],
      imageCount: 6
    },
    {
      id: "hobby-kan",
      order: 3,
      nameEn: "MACH Hobby Store",
      nameJa: "マッハ ホビー館",
      nameZh: "MACH Hobby 館",
      role: "Figures & hololive",
      badge: "Figures & hololive",
      badgeColor: "orange",
      headlineEn: "Complete your Akihabara hunt here.",
      headlineZh: "在這裡完成你的秋葉原尋寶之旅。",
      descriptionEn: "Figures, hololive goods, cards and more. The final stop on your MACH route — for everyone who loves character goods and collectibles.",
      descriptionZh: "模型、hololive 周邊、卡牌等，最後一站也充滿驚喜。MACH 路線的終點站，獻給所有喜愛角色週邊與收藏的你。",
      strengths: [
        { en: "Anime figures", zh: "動漫模型" },
        { en: "hololive goods", zh: "hololive 周邊" },
        { en: "Character goods and collectibles", zh: "角色週邊與收藏品" },
        { en: "Cards and more", zh: "卡牌等更多商品" }
      ],
      googleMapUrl: "https://www.google.com/maps?cid=15295361548836907329",
      lat: 35.6992923, lng: 139.7701091,
      instagramUrl: "https://www.instagram.com/mach_tcg_akihabara/",
      address: "Sotokanda, Chiyoda-ku, Tokyo (full address TBC — confirm before launch)",
      hours: "11:00–20:00 (TBC — confirm before launch)",
      imageFolder: "assets/images/hobby-kan",
      heroImage: "hobby-kan-01.jpg",
      featuredImages: ["hobby-kan-01.jpg", "hobby-kan-08.jpg", "hobby-kan-03.jpg", "hobby-kan-05.jpg"],
      imageCount: 8
    }
  ]
};

/* Instagram fallback used when both data/instagram-feed.json and
   data/instagram-fallback.json cannot be loaded (e.g. file:// preview). */
window.MACH_IG_FALLBACK = {
  profile: "https://www.instagram.com/mach_tcg_akihabara/",
  posts: [
    { id: "off-1", image: "assets/images/radio-kaikan/radio-kaikan-01-thumb.jpg", captionEn: "Your MACH route starts here — Radio Kaikan Store, right by Akihabara Station.", captionZh: "你的 MACH 路線從這裡開始 — 無線電會館店，就在秋葉原站旁。", date: "2026-06-21", url: "https://www.instagram.com/mach_tcg_akihabara/" },
    { id: "off-2", image: "assets/images/suehirocho/suehirocho-01-thumb.jpg", captionEn: "Look for the yellow MACH sign in Suehirocho. More cards, more figures.", captionZh: "在末廣町尋找黃色 MACH 招牌。更多卡牌，更多模型。", date: "2026-06-19", url: "https://www.instagram.com/mach_tcg_akihabara/" },
    { id: "off-3", image: "assets/images/hobby-kan/hobby-kan-08-thumb.jpg", captionEn: "Figures, hololive goods and more waiting at MACH Hobby Store.", captionZh: "模型、hololive 周邊與更多商品，在 MACH Hobby 館等你。", date: "2026-06-17", url: "https://www.instagram.com/mach_tcg_akihabara/" },
    { id: "off-4", image: "assets/images/radio-kaikan/radio-kaikan-03-thumb.jpg", captionEn: "Cards wall fully stocked. Come find your favorite!", captionZh: "整面卡牌牆補好補滿，快來找到你的最愛！", date: "2026-06-14", url: "https://www.instagram.com/mach_tcg_akihabara/" },
    { id: "off-5", image: "assets/images/suehirocho/suehirocho-04-thumb.jpg", captionEn: "Packed shelves, endless hunting. Don't miss Suehirocho Store.", captionZh: "貨架滿滿，挖寶不停。別錯過末廣町店。", date: "2026-06-11", url: "https://www.instagram.com/mach_tcg_akihabara/" },
    { id: "off-6", image: "assets/images/hobby-kan/hobby-kan-03-thumb.jpg", captionEn: "hololive fans, this is your stop. Complete your Akihabara hunt at MACH.", captionZh: "hololive 粉絲，這就是你的一站。在 MACH 完成你的秋葉原尋寶。", date: "2026-06-09", url: "https://www.instagram.com/mach_tcg_akihabara/" }
  ]
};
