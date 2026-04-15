import React from "react";
import { useCurrentFrame } from "remotion";
import { colors } from "../../theme/colors";
import { fonts } from "../../theme/fonts";
import { e } from "../../lib/interp";

type VogelButtonProps = {
  label: string;
  /** Frame the hover state should engage (local). */
  hoverAt?: number;
  /** Frame the click scale-down happens (local). */
  clickAt?: number;
  /** Fixed width (px). */
  width?: number;
  height?: number;
  /** Variant: filled white (hero CTA) or filled teal (submit). */
  variant?: "white" | "teal";
  style?: React.CSSProperties;
};

/**
 * Button that mimics the real Vogel site: white→teal shimmer on hover,
 * scale-95 on click. All animation driven by `useCurrentFrame`.
 */
export const VogelButton: React.FC<VogelButtonProps> = ({
  label,
  hoverAt = Infinity,
  clickAt = Infinity,
  width = 260,
  height = 64,
  variant = "white",
  style,
}) => {
  const frame = useCurrentFrame();
  const hoverP = e(frame, [hoverAt, hoverAt + 10], [0, 1]);
  const clickP =
    frame >= clickAt && frame <= clickAt + 8
      ? e(frame, [clickAt, clickAt + 4, clickAt + 8], [0, 1, 0])
      : 0;

  // Interpolate background color
  const baseBg = variant === "teal" ? colors.teal : "#ffffff";
  const hoverBg = variant === "teal" ? "#ffffff" : colors.teal;
  const bg = hoverP < 0.5 ? baseBg : hoverBg;
  const baseFg = variant === "teal" ? "#ffffff" : "#000000";
  const hoverFg = variant === "teal" ? "#000000" : "#ffffff";
  const fg = hoverP < 0.5 ? baseFg : hoverFg;

  const scale = 1 - clickP * 0.06;

  // Shimmer band that slides across on hover
  const shimmerX = e(frame, [hoverAt, hoverAt + 28], [-100, 100]);
  const shimmerOpacity = hoverP > 0.3 && hoverP < 0.95 ? 0.35 : 0;

  return (
    <div
      style={{
        width,
        height,
        borderRadius: 2,
        background: bg,
        color: fg,
        fontFamily: fonts.heading,
        fontWeight: 700,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        fontSize: 14,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        transform: `scale(${scale})`,
        transformOrigin: "center",
        boxShadow:
          hoverP > 0.3
            ? "0 12px 40px rgba(92,200,189,0.35)"
            : "0 4px 14px rgba(0,0,0,0.25)",
        ...style,
      }}
    >
      {/* Shimmer band */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          width: "40%",
          transform: `translateX(${shimmerX}%) skewX(-18deg)`,
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)",
          opacity: shimmerOpacity,
          pointerEvents: "none",
          mixBlendMode: "overlay",
        }}
      />
      <span style={{ position: "relative", zIndex: 1 }}>{label}</span>
    </div>
  );
};
