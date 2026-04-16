/**
 * Timeline for vogel-admin-overview.
 * Total = 450 frames (15s @ 30fps).
 *
 * Scene durations:
 *   login     90   (3s)  — isometric login reveal
 *   dashboard 120  (4s)  — offers list scroll
 *   editing   120  (4s)  — editing an offer form
 *   outro     120  (4s)  — final message + logo
 * ─────────────────────────────────────────
 *   Total    450
 */
export const TIMELINE = {
  fps: 30,
  total: 450,
  scenes: {
    login: 90,
    dashboard: 120,
    editing: 120,
    outro: 120,
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
