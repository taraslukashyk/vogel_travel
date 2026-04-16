/**
 * Timeline for 15s Vogel 9:16 Bento Promo
 * 450 frames @ 30fps
 */
export const TIMELINE = {
  fps: 30,
  total: 450,
  scenes: {
    intro: 90,
    voiceSearch: 120,
    mobileShowcase: 120,
    trustGrid: 90,
    outro: 30,
  },
} as const;

export const START = (() => {
  let t = 0;
  const out = {} as Record<keyof typeof TIMELINE.scenes, number>;
  (Object.keys(TIMELINE.scenes) as (keyof typeof TIMELINE.scenes)[]).forEach(
    (key) => {
      out[key] = t;
      t += TIMELINE.scenes[key];
    },
  );
  return out;
})();
