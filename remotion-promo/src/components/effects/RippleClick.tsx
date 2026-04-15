import React from "react";
import { useCurrentFrame } from "remotion";
import { e } from "../../lib/interp";
import { colors } from "../../theme/colors";

type RippleClickProps = {
  /** Frame at which the click occurs (local). */
  atFrame: number;
  x: number;
  y: number;
  /** Peak radius in px. */
  radius?: number;
  /** How long the ripple lives, in frames. */
  durationFrames?: number;
  color?: string;
};

/**
 * A single radial ripple emanating from (x, y) at the click frame.
 * Draws a growing translucent circle that fades out.
 */
export const RippleClick: React.FC<RippleClickProps> = ({
  atFrame,
  x,
  y,
  radius = 120,
  durationFrames = 18,
  color = colors.teal,
}) => {
  const frame = useCurrentFrame();
  if (frame < atFrame || frame > atFrame + durationFrames + 4) return null;
  const t = Math.max(0, frame - atFrame);
  const r = e(t, [0, durationFrames], [0, radius], "exit");
  const opacity = e(t, [0, durationFrames], [0.6, 0], "enter");
  return (
    <div
      style={{
        position: "absolute",
        left: x - r,
        top: y - r,
        width: r * 2,
        height: r * 2,
        borderRadius: "50%",
        border: `3px solid ${color}`,
        opacity,
        pointerEvents: "none",
      }}
    />
  );
};
