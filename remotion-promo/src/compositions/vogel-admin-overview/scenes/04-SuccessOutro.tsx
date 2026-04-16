import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { e } from "../../../lib/interp";
import { colors } from "../../../theme/colors";
import { Logo } from "../../../components/brand/Logo";
import { BirdParticles } from "../../../components/brand/BirdParticles";

export const SuccessOutro: React.FC = () => {
  const frame = useCurrentFrame();

  const logoOpacity = e(frame, [10, 30], [0, 1]);
  const logoScale = e(frame, [10, 40], [0.8, 1], "pop");
  
  const textOpacity = e(frame, [35, 55], [0, 1]);
  const textY = e(frame, [35, 60], [20, 0], "enter");

  return (
    <AbsoluteFill
      style={{
        background: "radial-gradient(circle at 50% 50%, #0d2520 0%, #000 100%)",
      }}
    >
      <BirdParticles count={20} spreadX={2000} driftY={400} opacity={0.5} seed={44} />

      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 40,
        }}
      >
        <div style={{ opacity: logoOpacity, transform: `scale(${logoScale})` }}>
          <Logo width={400} />
        </div>

        <div
          style={{
            opacity: textOpacity,
            transform: `translateY(${textY}px)`,
            textAlign: "center",
          }}
        >
          <h1 style={{ color: "#fff", fontSize: 56, fontWeight: 800, margin: 0 }}>
            Vogel <span style={{ color: colors.primary }}>Travel</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 24, marginTop: 10 }}>
            Ваш бізнес під надійним контролем
          </p>
        </div>
      </AbsoluteFill>

      {/* Finishing flash */}
      <AbsoluteFill
        style={{
          background: "white",
          opacity: e(frame, [0, 10], [1, 0]),
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
