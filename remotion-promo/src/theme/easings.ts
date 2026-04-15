import { Easing } from "remotion";

/**
 * Brand-wide easing curves used throughout the promo.
 * Prefer `Easing.bezier` so timing can be shared with web designs (CLS cubic-bezier).
 */
export const easings = {
  // Crisp UI entrance (strong ease-out, no overshoot). Default enter.
  enter: Easing.bezier(0.16, 1, 0.3, 1),
  // Editorial / slow fade (balanced ease-in-out). Hero reveals, long holds.
  editorial: Easing.bezier(0.45, 0, 0.55, 1),
  // Playful overshoot — use sparingly on emphasis (CTA pop, stamp-in).
  pop: Easing.bezier(0.34, 1.56, 0.64, 1),
  // Snap exit (accelerate out).
  exit: Easing.bezier(0.7, 0, 0.84, 0),
  // Matches the site's modal transition (from ContactModal.tsx).
  modal: Easing.bezier(0.25, 1, 0.5, 1),
} as const;

export type EasingToken = keyof typeof easings;
