import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { e } from "../../../lib/interp";
import { colors } from "../../../theme/colors";
import { BirdParticles } from "../../../components/brand/BirdParticles";
import { Logo } from "../../../components/brand/Logo";

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = e(frame, [0, 20], [0, 1]);
  const exitOpacity = e(frame, [70, 90], [1, 0], "exit");
  const scale = e(frame, [0, 30], [0.8, 1], "pop");

  return (
    <AbsoluteFill
      style={{
        background: colors.darker,
        alignItems: "center",
        justifyContent: "center",
        opacity: Math.min(opacity, exitOpacity),
      }}
    >
      <div style={{ transform: `scale(${scale})` }}>
        <Logo width={600} />
      </div>
      <BirdParticles count={15} seed={1} />
    </AbsoluteFill>
  );
};
