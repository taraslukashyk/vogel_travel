import React from "react";
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { Logo } from "../../../components/brand/Logo";
import { colors } from "../../../theme/colors";
import { e } from "../../../lib/interp";

interface IntroProps {
  title: string;
  subtitle: string;
}

export const IntroScene: React.FC<IntroProps> = ({ title, subtitle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const spr = spring({
    frame,
    fps,
    config: { damping: 12 },
  });

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "80px",
        background: `radial-gradient(circle at center, ${colors.tealDeep}88 0%, ${colors.darker} 100%)`,
      }}
    >
      <div
        style={{
          opacity: e(frame, [0, 20], [0, 1]),
          marginBottom: "80px",
          filter: `drop-shadow(0 0 120px ${colors.teal}bb)`,
        }}
      >
        <Logo size={1080} />
      </div>

      <p
        style={{
          color: colors.teal,
          fontSize: "56px",
          fontWeight: 800,
          textAlign: "center",
          opacity: e(frame, [25, 45], [0, 1]),
          transform: `translateY(${e(frame, [25, 45], [30, 0], "enter")}px)`,
          marginTop: "40px",
          letterSpacing: "6px",
          textTransform: "uppercase",
        }}
      >
        {subtitle}
      </p>
    </AbsoluteFill>
  );
};
