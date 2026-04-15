import React from "react";
import { useCurrentFrame } from "remotion";
import { e } from "../../lib/interp";
import { colors } from "../../theme/colors";

export type CursorKeyframe = {
  /** Local frame. */
  frame: number;
  /** Coordinates relative to parent (same coord space as children). */
  x: number;
  y: number;
  /** Optional click at this keyframe. */
  click?: boolean;
};

type AnimatedCursorProps = {
  keyframes: CursorKeyframe[];
  /** Show a subtle teal trail behind the cursor. */
  trail?: boolean;
  size?: number;
  /** Hide the cursor entirely before the first keyframe. */
  hideBeforeStart?: boolean;
};

/**
 * Custom pointer that tweens between provided keyframes using the brand enter easing.
 * Click visual = 0.85 scale pulse for 6 frames. Keyframes must be sorted by `frame`.
 */
export const AnimatedCursor: React.FC<AnimatedCursorProps> = ({
  keyframes,
  trail = true,
  size = 28,
  hideBeforeStart = true,
}) => {
  const frame = useCurrentFrame();
  if (keyframes.length === 0) return null;

  const first = keyframes[0]!;
  if (hideBeforeStart && frame < first.frame) return null;

  // Find surrounding pair
  let a = first;
  let b = keyframes[keyframes.length - 1]!;
  for (let i = 0; i < keyframes.length - 1; i++) {
    const cur = keyframes[i]!;
    const next = keyframes[i + 1]!;
    if (frame >= cur.frame && frame <= next.frame) {
      a = cur;
      b = next;
      break;
    }
    if (frame > next.frame) a = next;
  }

  const t = a.frame === b.frame ? 0 : (frame - a.frame) / (b.frame - a.frame);
  const clamped = Math.max(0, Math.min(1, t));
  // Smooth step
  const s = clamped * clamped * (3 - 2 * clamped);
  const x = a.x + (b.x - a.x) * s;
  const y = a.y + (b.y - a.y) * s;

  // Click detection: any keyframe where click === true within ±4 frames
  const activeClick = keyframes.find(
    (k) => k.click && frame >= k.frame && frame <= k.frame + 8,
  );
  const clickT = activeClick
    ? e(frame, [activeClick.frame, activeClick.frame + 4, activeClick.frame + 8], [0, 1, 0])
    : 0;
  const scale = 1 - clickT * 0.25;

  return (
    <>
      {trail ? (
        <div
          style={{
            position: "absolute",
            left: x - size * 1.8,
            top: y - size * 1.8,
            width: size * 3.6,
            height: size * 3.6,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${colors.glow} 0%, transparent 60%)`,
            pointerEvents: "none",
            opacity: 0.7,
          }}
        />
      ) : null}
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        style={{
          position: "absolute",
          left: x,
          top: y,
          pointerEvents: "none",
          transform: `scale(${scale})`,
          transformOrigin: "4px 4px",
          filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.45))",
          zIndex: 50,
        }}
      >
        <path
          d="M4 2 L4 18 L8 14 L11 20 L13.5 19 L10.5 13 L16 13 Z"
          fill="#ffffff"
          stroke="#000"
          strokeWidth={1}
          strokeLinejoin="round"
        />
      </svg>
    </>
  );
};
