import React from "react";
import { AbsoluteFill, Img, useCurrentFrame } from "remotion";
import { e } from "../../../lib/interp";
import { colors } from "../../../theme/colors";
import { fonts } from "../../../theme/fonts";
import { PhoneMockup } from "../../../components/brand/PhoneMockup";
import { VogelButton } from "../../../components/ui/VogelButton";
import { AnimatedCursor } from "../../../components/ui/AnimatedCursor";
import { BlurIn } from "../../../components/effects/BlurIn";
import { assets } from "../../../lib/staticPath";

export const DesireScene: React.FC = () => {
  const frame = useCurrentFrame();

  const enter = e(frame, [0, 20], [0, 1]);
  const priceP = e(frame, [20, 90], [0, 1], "editorial");
  const priceValue = Math.round(priceP * 38400);
  // Success overlay appears after click
  const successP = e(frame, [150, 180], [0, 1]);
  const stampP = e(frame, [160, 186], [0.6, 1], "pop");
  const stampOpacity = e(frame, [160, 180], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        background: colors.darker,
        alignItems: "center",
        justifyContent: "center",
        opacity: enter,
        overflow: "hidden",
      }}
    >
      <div style={{ position: "relative", width: 540 }}>
        <PhoneMockup width={540}>
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <Img
              src={assets.image.screenshots.offerDetailFull}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "auto",
                objectFit: "cover",
                opacity: 1 - successP,
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                opacity: successP,
                background: colors.black,
              }}
            >
              <BlurIn durationFrames={30} startFrame={150} fromBlur={20} toBlur={0}>
                <Img
                  src={assets.image.screenshots.success}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </BlurIn>
            </div>

            {/* Price pill overlay bottom */}
            <div
              style={{
                position: "absolute",
                left: "50%",
                bottom: 300,
                transform: "translateX(-50%)",
                padding: "14px 26px",
                borderRadius: 999,
                background: "rgba(0,0,0,0.55)",
                backdropFilter: "blur(12px)",
                border: `1px solid ${colors.teal}66`,
                color: colors.white,
                fontFamily: fonts.heading,
                fontWeight: 800,
                fontSize: 28,
                letterSpacing: "0.04em",
                opacity: 1 - successP,
              }}
            >
              € {priceValue.toLocaleString("uk-UA")}
            </div>

            {/* CTA button pulses and gets clicked */}
            <div
              style={{
                position: "absolute",
                left: "50%",
                bottom: 180,
                transform: "translateX(-50%)",
                opacity: 1 - successP,
              }}
            >
              <VogelButton
                label="Забронювати"
                hoverAt={60}
                clickAt={130}
                variant="teal"
                width={320}
                height={70}
              />
            </div>
          </div>
        </PhoneMockup>

        <AnimatedCursor
          size={34}
          keyframes={[
            { frame: 0, x: 380, y: 950 },
            { frame: 80, x: 270, y: 720 },
            { frame: 130, x: 270, y: 720, click: true },
            { frame: 200, x: 270, y: 720 },
          ]}
        />
      </div>

      {/* Stamp banner */}
      <div
        style={{
          position: "absolute",
          top: 240,
          left: "50%",
          transform: `translateX(-50%) scale(${stampP})`,
          opacity: stampOpacity,
          padding: "28px 44px",
          borderRadius: 20,
          background: "rgba(92,200,189,0.18)",
          border: `2px solid ${colors.teal}`,
          boxShadow: `0 0 48px ${colors.glow}`,
          fontFamily: fonts.heading,
          fontWeight: 900,
          fontSize: 96,
          color: colors.white,
          letterSpacing: "0.05em",
        }}
      >
        ПІДТВЕРДЖЕНО
      </div>
    </AbsoluteFill>
  );
};
