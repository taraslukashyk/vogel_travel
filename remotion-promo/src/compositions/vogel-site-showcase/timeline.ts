/**
 * Timeline for vogel-site-showcase.
 * Total = 900 frames (30s @ 30fps).
 *
 * Scene durations:
 *   intro     90   (3s)  — isometric reveal
 *   home     180   (6s)  — home page scroll
 *   offers   120   (4s)  — /offers, click card
 *   detail   120   (4s)  — offer detail, scroll to form
 *   form     180   (6s)  — fill booking form
 *   voice     90   (3s)  — mic record & send
 *   success  120   (4s)  — success + logo end card
 * ─────────────────────────────────────────
 *   Total    900
 */
export const TIMELINE = {
  fps: 30,
  total: 900,
  scenes: {
    intro: 90,
    home: 180,
    offers: 120,
    detail: 120,
    form: 180,
    voice: 90,
    success: 120,
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
