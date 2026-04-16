import React from "react";
import { AbsoluteFill, Img, useCurrentFrame } from "remotion";
import { e } from "../../../lib/interp";
import { colors } from "../../../theme/colors";
import { fonts } from "../../../theme/fonts";
import { PhoneMockup } from "../../../components/brand/PhoneMockup";
import { BirdParticles } from "../../../components/brand/BirdParticles";
import { BlurIn } from "../../../components/effects/BlurIn";
import { assets } from "../../../lib/staticPath";

export const AttentionScene: React.FC = () => {
  const frame = useCurrentFrame();

  const phoneScale = e(frame, [0, 28], [0.82, 1], "pop");
  const phoneOpacity = e(frame, [0, 18], [0, 1]);
  const phoneTilt = e(frame, [0, 30], [-12, -4], "enter");
  const captionY = e(frame, [10, 38], [40, 0], "enter");
  const captionOp = e(frame, [10, 30], [0, 1]);
  const captionScale = e(frame, [10, 36], [0.85, 1], "pop");
  const exit = e(frame, [100, 120], [1, 0], "exit");

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 50%, ${colors.tealDeep}22 0%, ${colors.darker} 65%)`,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        opacity: exit,
      }}
    >
      <BirdParticles count={14} seed={11} spreadX={1100} driftY={700} opacity={0.55} />

      <div
        style={{
          opacity: phoneOpacity,
          transform: `scale(${phoneScale}) rotate(${phoneTilt}deg)`,
        }}
      >
        <BlurIn durationFrames={36} startFrame={0} fromBlur={24} toBlur={0}>
          <PhoneMockup width={540}>
            <Img
              src={assets.image.screenshots.homeFull}
              style={{
                width: "100%",
                height: "auto",
                objectFit: "cover",
                display: "block",
              }}
            />
          </PhoneMockup>
        </BlurIn>
      </div>

      {/* Floating glass caption */}
      <div
        style={{
          position: "absolute",
          top: 260,
          left: "50%",
          transform: `translateX(-50%) translateY(${captionY}px) scale(${captionScale})`,
          opacity: captionOp,
          padding: "28px 42px",
          borderRadius: 32,
          background: "rgba(255,255,255,0.12)",
          backdropFilter: "blur(14px)",
          border: "1px solid rgba(255,255,255,0.28)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.45)",
          fontFamily: fonts.heading,
          fontWeight: 900,
          fontSize: 88,
          color: colors.white,
          letterSpacing: "0.02em",
          textAlign: "center",
          lineHeight: 0.96,
        }}
      >
        1 КЛІК
        <br />
        ДО МРІЇ
      </div>
    </AbsoluteFill>
  );
};
