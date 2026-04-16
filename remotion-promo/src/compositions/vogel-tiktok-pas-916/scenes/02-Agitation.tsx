import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { e } from "../../../lib/interp";
import { colors } from "../../../theme/colors";
import { fonts } from "../../../theme/fonts";

type Props = { problemHours: number };

export const AgitationScene: React.FC<Props> = ({ problemHours }) => {
  const frame = useCurrentFrame();

  const entrance = e(frame, [0, 20], [0, 1]);
  const counterProgress = e(frame, [20, 180], [0, 1], "editorial");
  const current = Math.round(counterProgress * problemHours);
  const finalGlow = e(frame, [180, 220], [0, 1]);

  // Spreadsheet: 12 cols × 18 rows
  const cols = 12;
  const rows = 18;

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, #1a0707 0%, #2a0a0a 50%, #1a0707 100%)`,
        opacity: entrance,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Spreadsheet backdrop */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          opacity: 0.35,
          padding: 24,
          gap: 2,
        }}
      >
        {Array.from({ length: cols * rows }).map((_, i) => {
          const flicker = Math.sin((frame + i * 3) * 0.25) > 0.85 ? 1 : 0;
          return (
            <div
              key={i}
              style={{
                background: flicker
                  ? "rgba(239,68,68,0.55)"
                  : "rgba(255,255,255,0.04)",
                border: "1px solid rgba(239,68,68,0.14)",
              }}
            />
          );
        })}
      </div>

      {/* Center counter */}
      <div
        style={{
          position: "relative",
          textAlign: "center",
          zIndex: 2,
          color: colors.white,
        }}
      >
        <div
          style={{
            fontFamily: fonts.heading,
            fontWeight: 900,
            fontSize: 340,
            color: "#ef4444",
            letterSpacing: "-0.04em",
            lineHeight: 0.9,
            textShadow: `0 0 ${40 + finalGlow * 60}px rgba(239,68,68,${0.5 + finalGlow * 0.3})`,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {current}
        </div>
        <div
          style={{
            fontFamily: fonts.heading,
            fontWeight: 900,
            fontSize: 112,
            color: colors.white,
            letterSpacing: "0.02em",
            marginTop: -20,
          }}
        >
          ГОДИН.
        </div>
        <div
          style={{
            fontFamily: fonts.heading,
            fontWeight: 800,
            fontSize: 72,
            color: "#ef4444",
            letterSpacing: "0.08em",
            marginTop: 16,
          }}
        >
          ВПУСТУ.
        </div>
      </div>

      {/* Flashing "Знову?" label */}
      {frame > 200 && (
        <div
          style={{
            position: "absolute",
            bottom: 240,
            left: 0,
            right: 0,
            textAlign: "center",
            fontFamily: fonts.heading,
            fontWeight: 900,
            fontSize: 96,
            color: colors.white,
            letterSpacing: "0.04em",
            opacity: e(frame, [200, 220, 260, 280], [0, 1, 1, 0]),
            transform: "skewX(-4deg)",
          }}
        >
          ЗНОВУ?
        </div>
      )}
    </AbsoluteFill>
  );
};
