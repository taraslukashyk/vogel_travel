import React from "react";
import { AbsoluteFill, Img, useCurrentFrame } from "remotion";
import { e } from "../../../lib/interp";
import { colors } from "../../../theme/colors";
import { fonts } from "../../../theme/fonts";
import { IsometricBrowser } from "../../../components/brand/IsometricBrowser";
import { BlurIn } from "../../../components/effects/BlurIn";
import { assets } from "../../../lib/staticPath";

const SCREENS = [
  assets.image.screenshots.admin.login,
  assets.image.screenshots.admin.sidebar,
  assets.image.screenshots.admin.offersList,
  assets.image.screenshots.admin.contentEditor,
];

const CHIPS = ["TipTap Editor", "SEO AI", "Мультимова", "Аналітика"];

export const FeaturesScene: React.FC = () => {
  const frame = useCurrentFrame();

  const enter = e(frame, [0, 18], [0, 1]);
  // Crossfade between admin screens every 40 frames
  const cycleLen = 40;
  const activeIdx = Math.min(
    SCREENS.length - 1,
    Math.floor(frame / cycleLen),
  );

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${colors.darker} 0%, ${colors.tealDeep}30 100%)`,
        alignItems: "center",
        justifyContent: "center",
        opacity: enter,
        overflow: "hidden",
        perspective: 2400,
      }}
    >
      {/* Left: Headline */}
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 120,
          width: 620,
          zIndex: 3,
        }}
      >
        <BlurIn fromBlur={24} toBlur={0} startFrame={0} durationFrames={24}>
          <div
            style={{
              fontFamily: fonts.heading,
              fontWeight: 900,
              fontSize: 84,
              color: colors.white,
              lineHeight: 0.95,
              letterSpacing: "-0.02em",
            }}
          >
            Потужна{" "}
            <span style={{ color: colors.teal }}>адмінка</span>
            <br />
            для агенції
          </div>
        </BlurIn>

        <div
          style={{
            marginTop: 28,
            fontFamily: fonts.body,
            fontWeight: 500,
            fontSize: 28,
            color: colors.whiteMuted,
            opacity: e(frame, [20, 40], [0, 1]),
          }}
        >
          Все, що потрібно, в одному місці
        </div>

        {/* Feature chips */}
        <div
          style={{
            marginTop: 48,
            display: "flex",
            flexWrap: "wrap",
            gap: 14,
          }}
        >
          {CHIPS.map((chip, i) => {
            const chipP = e(
              frame,
              [40 + i * 14, 60 + i * 14],
              [0, 1],
              "pop",
            );
            return (
              <div
                key={chip}
                style={{
                  padding: "14px 24px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.08)",
                  backdropFilter: "blur(12px)",
                  border: `1px solid ${colors.teal}66`,
                  fontFamily: fonts.body,
                  fontWeight: 600,
                  fontSize: 24,
                  color: colors.white,
                  opacity: chipP,
                  transform: `translateY(${(1 - chipP) * 18}px) scale(${0.9 + chipP * 0.1})`,
                }}
              >
                {chip}
              </div>
            );
          })}
        </div>
      </div>

      {/* Right: Admin browser with crossfade */}
      <div
        style={{
          position: "absolute",
          right: 80,
          top: "50%",
          transform: "translateY(-50%)",
        }}
      >
        <IsometricBrowser url="admin.vogel.travel" width={960} height={620}>
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            {SCREENS.map((src, i) => {
              const opacity = i === activeIdx ? 1 : 0;
              return (
                <Img
                  key={src}
                  src={src}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "top",
                    opacity,
                    transition: "opacity 200ms ease",
                  }}
                />
              );
            })}
          </div>
        </IsometricBrowser>
      </div>
    </AbsoluteFill>
  );
};
