import React, { useMemo } from "react";
import { useCurrentFrame } from "remotion";
import { colors } from "../../theme/colors";

type BirdParticlesProps = {
  /** Number of birds to emit. */
  count?: number;
  /** Horizontal spread in px around the center. */
  spreadX?: number;
  /** Vertical drift range in px. */
  driftY?: number;
  /** Speed in px/frame (average). */
  speed?: number;
  /** Seed for deterministic randomness. */
  seed?: number;
  /** Tint color. */
  color?: string;
  /** Overall opacity multiplier. */
  opacity?: number;
  /** Starting frame (local). */
  startFrame?: number;
};

// Minimal pseudo-random so the same seed always yields the same layout.
// Mulberry32
const mulberry = (a: number) => () => {
  let t = (a += 0x6d2b79f5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

/**
 * A flock of tiny teal "bird" glyphs drifting across screen.
 * Deterministic — per-frame positions only, no RAF, so renders are reproducible.
 * Inspired by the `BirdCursorEffect` in the main Vogel_V5 site.
 */
export const BirdParticles: React.FC<BirdParticlesProps> = ({
  count = 18,
  spreadX = 900,
  driftY = 240,
  speed = 1.2,
  seed = 42,
  color = colors.teal,
  opacity = 1,
  startFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const particles = useMemo(() => {
    const rng = mulberry(seed);
    return Array.from({ length: count }, () => ({
      ox: (rng() - 0.5) * spreadX,
      oy: (rng() - 0.5) * driftY,
      size: 14 + rng() * 22,
      phase: rng() * Math.PI * 2,
      vx: (0.3 + rng() * 0.7) * (rng() > 0.5 ? 1 : -1),
      vy: (rng() - 0.5) * 0.4,
      rot: rng() * 30 - 15,
      life: 60 + rng() * 90,
    }));
  }, [count, spreadX, driftY, seed]);

  const t = Math.max(0, frame - startFrame);

  return (
    <svg
      viewBox="-960 -540 1920 1080"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    >
      {particles.map((p, i) => {
        const px = p.ox + p.vx * t * speed;
        const py = p.oy + p.vy * t * speed + Math.sin((t + p.phase) / 20) * 18;
        const life = (t % p.life) / p.life;
        const fade = life < 0.15
          ? life / 0.15
          : life > 0.85
            ? (1 - life) / 0.15
            : 1;
        return (
          <g
            key={i}
            transform={`translate(${px} ${py}) rotate(${p.rot}) scale(${p.size / 24})`}
            style={{ opacity: fade * opacity }}
          >
            {/* Minimal "seagull" glyph */}
            <path
              d="M -12 0 Q -6 -8 0 0 Q 6 -8 12 0"
              stroke={color}
              strokeWidth={2.2}
              strokeLinecap="round"
              fill="none"
            />
          </g>
        );
      })}
    </svg>
  );
};
