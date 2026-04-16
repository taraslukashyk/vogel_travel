import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { e } from "../../../lib/interp";
import { colors } from "../../../theme/colors";
import { fonts } from "../../../theme/fonts";
import { Logo } from "../../../components/brand/Logo";
import { BirdParticles } from "../../../components/brand/BirdParticles";
import { VogelButton } from "../../../components/ui/VogelButton";

type Props = {
  website: string;
  phone: string;
  ctaLabel: string;
};

export const CTAScene: React.FC<Props> = ({ website, phone, ctaLabel }) => {
  const frame = useCurrentFrame();

  const logoP = e(frame, [0, 24], [0, 1], "pop");
  const siteP = e(frame, [24, 50], [0, 1]);
  const btnP = e(frame, [40, 70], [0, 1], "pop");

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${colors.darker} 0%, ${colors.tealDeep}66 100%)`,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 40,
        overflow: "hidden",
      }}
    >
      <BirdParticles count={18} seed={31} spreadX={1600} driftY={600} opacity={0.6} />

      <div
        style={{
          opacity: logoP,
          transform: `scale(${0.85 + logoP * 0.15})`,
        }}
      >
        <Logo width={560} />
      </div>

      <div
        style={{
          fontFamily: fonts.heading,
          fontWeight: 800,
          fontSize: 72,
          color: colors.white,
          letterSpacing: "0.02em",
          opacity: siteP,
          transform: `translateY(${(1 - siteP) * 20}px)`,
        }}
      >
        {website}
      </div>

      <div
        style={{
          opacity: btnP,
          transform: `translateY(${(1 - btnP) * 24}px) scale(${0.9 + btnP * 0.1})`,
        }}
      >
        <VogelButton label={ctaLabel} width={340} height={72} />
      </div>

      <div
        style={{
          fontFamily: fonts.body,
          fontWeight: 500,
          fontSize: 30,
          color: colors.whiteSoft,
          letterSpacing: "0.08em",
          opacity: siteP,
        }}
      >
        {phone}
      </div>
    </AbsoluteFill>
  );
};
