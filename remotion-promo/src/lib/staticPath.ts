import { staticFile } from "remotion";

/**
 * Typed constants for every public asset used across compositions.
 * Keeps a single place to rename / reorganise files in `public/`.
 */
export const assets = {
  video: {
    aerial: staticFile("video/aerial.webm"),
  },
  image: {
    logo: staticFile("image/logo.svg"),
    viktoria: staticFile("image/viktoria.jpg"),
    heroPoster: staticFile("image/hero-poster.jpg"),
    screenshots: {
      homeFull: staticFile("image/screenshots/home-full.jpg"),
      offersFull: staticFile("image/screenshots/offers-full.jpg"),
      offerDetailFull: staticFile("image/screenshots/offer-detail-full.jpg"),
      formEmpty: staticFile("image/screenshots/form-empty.jpg"),
      success: staticFile("image/screenshots/success.jpg"),
      admin: {
        login: staticFile("image/screenshots/admin/login.png"),
        sidebar: staticFile("image/screenshots/admin/sidebar.png"),
        offersList: staticFile("image/screenshots/admin/offers_list.png"),
        offerDetail: staticFile("image/screenshots/admin/offer_detail.png"),
        contentEditor: staticFile("image/screenshots/admin/content_editor.png"),
        seoAi: staticFile("image/screenshots/admin/seo_ai.png"),
        analytics: staticFile("image/screenshots/admin/analytics.png"),
        settings: staticFile("image/screenshots/admin/settings.png"),
        partners: staticFile("image/screenshots/admin/partners.png"),
      },
    },
  },
  audio: {
    music: staticFile("audio/music.mp3"),
    sfx: {
      whoosh: staticFile("audio/sfx/whoosh.mp3"),
      key: staticFile("audio/sfx/key.mp3"),
      click: staticFile("audio/sfx/click.mp3"),
      smsChime: staticFile("audio/sfx/sms-chime.mp3"),
    },
  },
} as const;
