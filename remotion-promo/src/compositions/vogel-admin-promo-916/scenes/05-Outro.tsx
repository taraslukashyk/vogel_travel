import React from "react";
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig } from "remotion";
import { Logo } from "../../../components/brand/Logo";
import { colors } from "../../../theme/colors";
import { e } from "../../../lib/interp";

interface OutroProps {
  url: string;
}

export const OutroScene: React.FC<OutroProps> = ({ url }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const spr = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 80 },
  });

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: `radial-gradient(circle at center, ${colors.tealDeep}88 0%, ${colors.darker} 100%)`,
      }}
    >
      <div
        style={{
          opacity: e(frame, [0, 20], [0, 1]),
          marginBottom: "120px",
          filter: `drop-shadow(0 0 80px ${colors.teal}66)`,
        }}
      >
        <Logo size={800} />
      </div>

      <div
        style={{
          opacity: e(frame, [25, 45], [0, 1]),
          transform: `translateY(${e(frame, [25, 45], [20, 0], "enter")}px)`,
          textAlign: "center",
        }}
      >
        <div
          style={{
            color: colors.white,
            fontSize: "56px",
            fontWeight: 900,
            letterSpacing: "2px",
            background: colors.tealDeep,
            padding: "20px 60px",
            borderRadius: "100px",
            boxShadow: `0 20px 50px rgba(0,0,0,0.3)`,
            display: "inline-block",
            border: `1px solid ${colors.teal}44`,
          }}
        >
          {url}
        </div>
      </div>
    </AbsoluteFill>
  );
};
