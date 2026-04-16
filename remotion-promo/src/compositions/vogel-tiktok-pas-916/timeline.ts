/**
 * Timeline for 15s Vogel TikTok PAS Promo (9:16).
 * 900 frames @ 60fps.
 */
export const TIMELINE = {
  fps: 60,
  total: 900,
  scenes: {
    problem: 180,
    agitation: 300,
    solution: 300,
    cta: 120,
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
