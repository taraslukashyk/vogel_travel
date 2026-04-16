/**
 * Timeline for 25s Vogel 16:9 YouTube FAB Promo (B2B Admin CMS)
 * 750 frames @ 30fps
 */
export const TIMELINE = {
  fps: 30,
  total: 750,
  scenes: {
    features: 180,
    advantages: 240,
    benefits: 240,
    cta: 90,
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
