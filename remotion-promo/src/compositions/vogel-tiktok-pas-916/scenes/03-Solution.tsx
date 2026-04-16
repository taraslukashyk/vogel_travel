import React from "react";
import { AbsoluteFill, Img, useCurrentFrame } from "remotion";
import { e } from "../../../lib/interp";
import { colors } from "../../../theme/colors";
import { fonts } from "../../../theme/fonts";
import { IsometricBrowser } from "../../../components/brand/IsometricBrowser";
import { MicRecorder } from "../../../components/ui/MicRecorder";
import { Typewriter } from "../../../components/effects/Typewriter";
import { AnimatedCursor } from "../../../components/ui/AnimatedCursor";
import { assets } from "../../../lib/staticPath";

export const SolutionScene: React.FC = () => {
  const frame = useCurrentFrame();

  const enter = e(frame, [0, 20], [0, 1]);
  // Mic panel visible early, fades out once typing starts
  const micOpacity = e(frame, [30, 60, 150, 180], [0, 1, 1, 0]);
  const cardOpacity = e(frame, [200, 240], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 35%, ${colors.tealDeep}55 0%, ${colors.darker} 70%)`,
        alignItems: "center",
        justifyContent: "center",
        opacity: enter,
        overflow: "hidden",
        perspective: 2200,
      }}
    >
      {/* Isometric browser with home page */}
      <div style={{ position: "relative", transform: "translateY(-80px)" }}>
        <IsometricBrowser
          url="vogel.travel"
          flatAtFrame={110}
          width={880}
          height={560}
        >
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <Img
              src={assets.image.screenshots.homeFull}
              style={{
                width: "100%",
                height: "auto",
                objectFit: "cover",
                objectPosition: "top",
                display: "block",
              }}
            />
            {/* Typewriter overlay simulating hero search input */}
            <div
              style={{
                position: "absolute",
                top: 220,
                left: "50%",
                transform: "translateX(-50%)",
                width: 560,
                height: 64,
                background: "rgba(255,255,255,0.92)",
                borderRadius: 2,
                border: `2px solid ${colors.teal}`,
                display: "flex",
                alignItems: "center",
                padding: "0 24px",
                fontFamily: fonts.body,
                fontWeight: 500,
                fontSize: 24,
                color: "#0b1a15",
                opacity: frame > 120 ? 1 : 0,
              }}
            >
              <Typewriter
                text="Мальдіви на двох"
                startFrame={130}
                cps={22}
                caret
                caretColor={colors.teal}
              />
            </div>
          </div>
        </IsometricBrowser>

        {/* Cursor selecting the result card */}
        <AnimatedCursor
          size={34}
          keyframes={[
            { frame: 180, x: 700, y: 440 },
            { frame: 230, x: 520, y: 400, click: true },
            { frame: 300, x: 520, y: 400 },
          ]}
        />
      </div>

      {/* Mic recorder ribbon */}
      <div
        style={{
          position: "absolute",
          top: 180,
          left: 0,
          right: 0,
          height: 200,
          opacity: micOpacity,
        }}
      >
        <MicRecorder startFrame={40} duration={90} sendAtFrame={130} />
      </div>

      {/* Result card highlight */}
      <div
        style={{
          position: "absolute",
          bottom: 320,
          left: "50%",
          transform: `translateX(-50%) scale(${0.9 + cardOpacity * 0.1})`,
          opacity: cardOpacity,
          padding: "18px 30px",
          borderRadius: 18,
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(12px)",
          border: `2px solid ${colors.teal}`,
          boxShadow: `0 0 42px ${colors.glow}`,
          fontFamily: fonts.heading,
          fontWeight: 800,
          fontSize: 32,
          color: colors.white,
        }}
      >
        ✓ Знайдено 24 тури
      </div>

      {/* Kinetic caption */}
      <div
        style={{
          position: "absolute",
          bottom: 140,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: fonts.heading,
          fontWeight: 900,
          fontSize: 96,
          color: colors.white,
          letterSpacing: "0.02em",
          lineHeight: 0.95,
          opacity: e(frame, [220, 260], [0, 1]),
          transform: `translateY(${(1 - e(frame, [220, 260], [0, 1])) * 40}px)`,
        }}
      >
        <span style={{ color: colors.teal }}>ОДНА</span> ПЛАТФОРМА.
        <br />
        УСЕ.
      </div>
    </AbsoluteFill>
  );
};
