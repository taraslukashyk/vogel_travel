import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { colors } from "../../../theme/colors";
import { fonts } from "../../../theme/fonts";
import { e } from "../../../lib/interp";
import { Logo } from "../../../components/brand/Logo";
import { BirdParticles } from "../../../components/brand/BirdParticles";

/**
 * Scene 2 — 0..60 (2s) — Brand Reveal.
 * Black backdrop, subtle bokeh, logo scales in with glow.
 * Tagline slides up beneath.
 */
export const BrandReveal: React.FC = () => {
  const frame = useCurrentFrame();

  const logoOpacity = e(frame, [0, 18], [0, 1]);
  const logoScale = e(frame, [0, 22], [0.8, 1], "pop");
  const logoBlur = e(frame, [0, 16], [18, 0], "editorial");

  const lineOpacity = e(frame, [18, 34], [0, 1]);
  const lineY = e(frame, [18, 36], [14, 0]);

  const glowOpacity = e(frame, [4, 24, 42, 60], [0, 0.7, 0.5, 0.3]);

  // Exit fade for last 10 frames
  const exit = e(frame, [50, 60], [0, 1], "exit");

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 50% 50%, #0f2a25 0%, #050b08 70%, #000 100%)",
        opacity: 1 - exit * 0.4,
      }}
    >
      {/* Bokeh / birds dispersing */}
      <BirdParticles
        count={10}
        spreadX={1200}
        driftY={400}
        opacity={0.55}
        seed={18}
      />

      {/* Glow behind logo */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            width: 720,
            height: 720,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${colors.glow} 0%, transparent 55%)`,
            opacity: glowOpacity,
            filter: "blur(24px)",
          }}
        />
      </AbsoluteFill>

      {/* Logo */}
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            opacity: logoOpacity,
            transform: `scale(${logoScale})`,
            filter: `blur(${logoBlur}px) drop-shadow(0 12px 40px rgba(0,0,0,0.5))`,
          }}
        >
          <Logo width={520} />
        </div>

        {/* Horizontal hairline */}
        <div
          style={{
            width: 180,
            height: 1,
            background: colors.whiteFaint,
            marginTop: 24,
            opacity: lineOpacity,
          }}
        />

        {/* Tagline */}
        <div
          style={{
            fontFamily: fonts.heading,
            fontSize: 16,
            fontWeight: 600,
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: colors.whiteSoft,
            marginTop: 18,
            opacity: lineOpacity,
            transform: `translateY(${lineY}px)`,
          }}
        >
          Відкрийте світ з нами
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
