import React from "react";
import { AbsoluteFill, Img, useCurrentFrame } from "remotion";
import { e } from "../../../lib/interp";
import { colors } from "../../../theme/colors";
import { fonts } from "../../../theme/fonts";
import { PhoneMockup } from "../../../components/brand/PhoneMockup";
import { AnimatedCursor } from "../../../components/ui/AnimatedCursor";
import { RippleClick } from "../../../components/effects/RippleClick";
import { assets } from "../../../lib/staticPath";

export const InterestScene: React.FC = () => {
  const frame = useCurrentFrame();

  const screenSwap = e(frame, [60, 90], [0, 1]);
  const entrance = e(frame, [0, 20], [0, 1]);
  const captionP = e(frame, [30, 60], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        background: colors.darker,
        alignItems: "center",
        justifyContent: "center",
        opacity: entrance,
        overflow: "hidden",
      }}
    >
      <div style={{ position: "relative", width: 540 }}>
        <PhoneMockup width={540}>
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            {/* Home screenshot */}
            <Img
              src={assets.image.screenshots.homeFull}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "auto",
                objectFit: "cover",
                opacity: 1 - screenSwap,
              }}
            />
            {/* Offers screenshot swaps in */}
            <Img
              src={assets.image.screenshots.offersFull}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "auto",
                objectFit: "cover",
                opacity: screenSwap,
              }}
            />
          </div>
        </PhoneMockup>

        {/* Cursor that lands on a card and clicks */}
        <AnimatedCursor
          size={34}
          keyframes={[
            { frame: 30, x: 100, y: 900 },
            { frame: 110, x: 280, y: 620 },
            { frame: 150, x: 260, y: 560, click: true },
            { frame: 220, x: 260, y: 560 },
          ]}
        />
        <RippleClick atFrame={150} x={260} y={560} radius={110} />
      </div>

      {/* Kinetic caption beneath the phone */}
      <div
        style={{
          position: "absolute",
          bottom: 180,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: fonts.heading,
          fontWeight: 900,
          fontSize: 86,
          color: colors.white,
          letterSpacing: "0.02em",
          lineHeight: 1,
          opacity: captionP,
          transform: `translateY(${(1 - captionP) * 50}px)`,
        }}
      >
        <span style={{ color: colors.teal }}>50+ ТУРІВ.</span>
        <br />
        БЕЗ ВКЛАДОК.
      </div>
    </AbsoluteFill>
  );
};
