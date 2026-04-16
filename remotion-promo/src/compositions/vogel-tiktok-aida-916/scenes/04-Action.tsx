import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { e } from "../../../lib/interp";
import { colors } from "../../../theme/colors";
import { fonts } from "../../../theme/fonts";
import { Logo } from "../../../components/brand/Logo";
import { BirdParticles } from "../../../components/brand/BirdParticles";

type Props = { website: string; ctaSecondary: string };

export const ActionScene: React.FC<Props> = ({ website, ctaSecondary }) => {
  const frame = useCurrentFrame();

  const logoP = e(frame, [0, 26], [0, 1], "pop");
  const webP = e(frame, [16, 50], [0, 1]);
  const ctaP = e(frame, [36, 70], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        background: colors.darker,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 60,
        overflow: "hidden",
      }}
    >
      <BirdParticles count={18} seed={7} spreadX={1200} driftY={900} opacity={0.6} />

      <div
        style={{
          transform: `scale(${0.85 + logoP * 0.15})`,
          opacity: logoP,
        }}
      >
        <Logo width={560} />
      </div>

      <div
        style={{
          fontFamily: fonts.heading,
          fontWeight: 800,
          fontSize: 84,
          color: colors.white,
          letterSpacing: `${webP * 0.04}em`,
          opacity: webP,
          transform: `translateY(${(1 - webP) * 20}px)`,
        }}
      >
        {website}
      </div>

      <div
        style={{
          fontFamily: fonts.script,
          fontSize: 42,
          color: colors.teal,
          opacity: ctaP,
          transform: `translateY(${(1 - ctaP) * 24}px)`,
        }}
      >
        {ctaSecondary}
      </div>
    </AbsoluteFill>
  );
};
