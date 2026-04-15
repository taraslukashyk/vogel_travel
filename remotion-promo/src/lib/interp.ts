import { Easing, interpolate } from "remotion";
import { easings } from "../theme/easings";

/**
 * Eased interpolate with clamped extrapolation and brand-preset easings.
 * Removes boilerplate — use this instead of passing `extrapolate*: "clamp"` everywhere.
 */
export const e = (
  frame: number,
  input: readonly [number, number] | readonly number[],
  output: readonly number[],
  easing: keyof typeof easings | ((t: number) => number) = "enter",
) => {
  const fn =
    typeof easing === "function" ? easing : easings[easing] ?? Easing.linear;
  return interpolate(frame, input as number[], output as number[], {
    easing: fn,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

/** Inclusive progress 0→1 over a frame range with an easing preset. */
export const progress = (
  frame: number,
  start: number,
  duration: number,
  easing: keyof typeof easings = "enter",
) => e(frame, [start, start + duration], [0, 1], easing);
