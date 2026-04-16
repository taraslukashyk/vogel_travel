/**
 * Timeline for 12s Vogel TikTok AIDA Promo (9:16).
 * 720 frames @ 60fps.
 */
export const TIMELINE = {
  fps: 60,
  total: 720,
  scenes: {
    attention: 120,
    interest: 240,
    desire: 240,
    action: 120,
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
