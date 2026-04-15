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
