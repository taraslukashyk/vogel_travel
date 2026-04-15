import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { colors } from "../../../theme/colors";
import { fonts } from "../../../theme/fonts";
import { e } from "../../../lib/interp";

/**
 * Scene 6 — 0..60 (2s) — Sped-up stopwatch.
 * 00:00 → 00:30 in 2 seconds. Circular progress ring + tabular digits.
 */
export const Stopwatch: React.FC = () => {
  const frame = useCurrentFrame();
  const total = 60;
  const progress = Math.min(1, Math.max(0, frame / total));
  // Slight ease-out for dramatic finish
  const eased = 1 - Math.pow(1 - progress, 1.4);
  const seconds = Math.floor(eased * 30);
  const hundredths = Math.floor((eased * 30 * 100) % 100);

  const pad = (n: number) => n.toString().padStart(2, "0");
  const ring = 320;
  const stroke = 10;
  const radius = ring / 2 - stroke;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - eased);

  const entryOpacity = e(frame, [0, 12], [0, 1]);
  const exitOpacity = e(frame, [48, 60], [1, 0.2], "exit");

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 50% 50%, #0d2520 0%, #020404 100%)",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 30,
        opacity: Math.min(entryOpacity, exitOpacity),
      }}
    >
      {/* Stopwatch ring */}
      <div style={{ position: "relative", width: ring, height: ring }}>
        <svg width={ring} height={ring} style={{ transform: "rotate(-90deg)" }}>
          <circle
            cx={ring / 2}
            cy={ring / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth={stroke}
          />
          <circle
            cx={ring / 2}
            cy={ring / 2}
            r={radius}
            fill="none"
            stroke={colors.teal}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{ filter: `drop-shadow(0 0 20px ${colors.glow})` }}
          />
        </svg>

        {/* Digits */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: fonts.heading,
            fontWeight: 800,
            color: "#fff",
            fontVariantNumeric: "tabular-nums",
            letterSpacing: "0.04em",
          }}
        >
          <span style={{ fontSize: 84 }}>00:{pad(seconds)}</span>
          <span style={{ fontSize: 40, color: colors.teal, marginLeft: 6 }}>
            .{pad(hundredths)}
          </span>
        </div>
      </div>

      {/* Caption */}
      <div
        style={{
          fontFamily: fonts.heading,
          fontWeight: 700,
          color: colors.whiteSoft,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          fontSize: 14,
          marginTop: 10,
        }}
      >
        Менеджер готує пропозицію
      </div>
    </AbsoluteFill>
  );
};
