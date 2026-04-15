/**
 * Single source of truth for scene durations and transition lengths.
 * Total = 900 frames (30 seconds @ 30 fps).
 *
 * TransitionSeries crossfades overlap adjacent scenes, so the sum of scene
 * durations is **larger** than 900 — subtract transitions to land on 900.
 *
 * Math:
 *   scenes: 120 + 60 + 90 + 300 + 90 + 60 + 120 + 60 = 900
 *   transitions: 0 — we rely on each scene fading its own content in/out.
 *
 * If you add TransitionSeries crossfades later, bump individual durations
 * by (transition / 2) on each side and keep the total constant.
 */
export const TIMELINE = {
  fps: 30,
  total: 900,
  scenes: {
    hook: 120,
    brand: 60,
    hero: 90,
    form: 300,
    invoice: 90,
    stopwatch: 60,
    phone: 120,
    end: 60,
  },
} as const;

/** Global (composition-level) start frame for each scene. Useful for audio cues. */
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
