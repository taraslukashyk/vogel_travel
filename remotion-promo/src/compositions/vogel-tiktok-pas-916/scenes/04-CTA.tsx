import React from "react";
import { AbsoluteFill, Img, useCurrentFrame } from "remotion";
import { e } from "../../../lib/interp";
import { colors } from "../../../theme/colors";
import { fonts } from "../../../theme/fonts";
import { Logo } from "../../../components/brand/Logo";
import { BirdParticles } from "../../../components/brand/BirdParticles";
import { assets } from "../../../lib/staticPath";

type Props = {
  website: string;
  phone: string;
  managerName: string;
  ctaPrimary: string;
};

export const CTAScene: React.FC<Props> = ({ website, phone, managerName, ctaPrimary }) => {
  const frame = useCurrentFrame();

  const cardP = e(frame, [0, 26], [0, 1], "pop");
  const websiteP = e(frame, [30, 60], [0, 1]);
  const ctaP = e(frame, [50, 85], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        background: colors.darker,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 48,
        overflow: "hidden",
        padding: 80,
      }}
    >
      <BirdParticles count={16} seed={21} spreadX={1200} driftY={700} opacity={0.55} />

      <div style={{ opacity: cardP, transform: `scale(${0.9 + cardP * 0.1})` }}>
        <Logo width={420} />
      </div>

      {/* Manager card */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 28,
          padding: "22px 36px",
          borderRadius: 24,
          background: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(16px)",
          border: `1px solid ${colors.teal}55`,
          boxShadow: `0 12px 40px ${colors.glow}`,
          opacity: cardP,
          transform: `translateY(${(1 - cardP) * 30}px)`,
        }}
      >
        <Img
          src={assets.image.viktoria}
          style={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            objectFit: "cover",
            border: `3px solid ${colors.teal}`,
          }}
        />
        <div style={{ textAlign: "left" }}>
          <div
            style={{
              fontFamily: fonts.heading,
              fontWeight: 800,
              fontSize: 40,
              color: colors.white,
              letterSpacing: "0.02em",
            }}
          >
            {managerName}
          </div>
          <div
            style={{
              fontFamily: fonts.body,
              fontWeight: 500,
              fontSize: 22,
              color: colors.whiteMuted,
              marginTop: 4,
            }}
          >
            твій консьєрж
          </div>
        </div>
      </div>

      <div
        style={{
          fontFamily: fonts.heading,
          fontWeight: 800,
          fontSize: 64,
          color: colors.white,
          opacity: websiteP,
          transform: `translateY(${(1 - websiteP) * 18}px)`,
        }}
      >
        {website}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          opacity: ctaP,
          transform: `translateY(${(1 - ctaP) * 24}px)`,
        }}
      >
        <div
          style={{
            fontFamily: fonts.script,
            fontSize: 54,
            color: colors.teal,
          }}
        >
          {ctaPrimary}
        </div>
        <div
          style={{
            fontFamily: fonts.body,
            fontWeight: 500,
            fontSize: 28,
            color: colors.whiteSoft,
            letterSpacing: "0.06em",
          }}
        >
          {phone}
        </div>
      </div>
    </AbsoluteFill>
  );
};
