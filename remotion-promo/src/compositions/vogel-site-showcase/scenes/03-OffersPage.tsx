import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { e } from "../../../lib/interp";
import { assets } from "../../../lib/staticPath";
import { colors } from "../../../theme/colors";
import { BrowserChrome } from "../../../components/brand/BrowserChrome";
import { PageScroll } from "../../../components/ui/PageScroll";
import { AnimatedCursor } from "../../../components/ui/AnimatedCursor";
import { RippleClick } from "../../../components/effects/RippleClick";

type Props = { website: string };

/**
 * Scene 3 — 0..120 (4s) — Offers Page.
 * /offers page scrolls slightly to reveal tour cards.
 * Cursor finds the "Four Seasons Seychelles" card and clicks it.
 * URL updates to /ua/offers/four-seasons-seychelles.
 */
export const OffersPage: React.FC<Props> = ({ website }) => {
  const frame = useCurrentFrame();

  const CARD_CLICK = 88;

  const sceneOpacity = e(frame, [0, 14], [0, 1]);
  const sceneFade = e(frame, [108, 120], [1, 0], "exit");

  const urlAfterClick = frame >= CARD_CLICK + 8;

  return (
    <AbsoluteFill
      style={{
        background: "#000",
        alignItems: "center",
        justifyContent: "center",
        opacity: Math.min(sceneOpacity, sceneFade),
      }}
    >
      <BrowserChrome
        url={urlAfterClick
          ? `${website}/ua/offers/four-seasons-seychelles`
          : `${website}/ua/offers`}
        width={1480}
        height={820}
      >
        {/* Offers page — small scroll to show the tour cards */}
        <PageScroll
          src={assets.image.screenshots.offersFull}
          imageHeight={2800}
          viewHeight={820}
          viewWidth={1480}
          startFrame={8}
          durationFrames={70}
          easing="editorial"
        />
      </BrowserChrome>

      {/* Cursor: drift in → hover card → click */}
      <AnimatedCursor
        keyframes={[
          { frame: 0, x: 1500, y: 200 },
          { frame: 30, x: 960, y: 500 },
          { frame: 70, x: 720, y: 560 },
          { frame: CARD_CLICK - 6, x: 720, y: 540 },
          { frame: CARD_CLICK, x: 720, y: 540, click: true },
        ]}
      />

      {/* Ripple on card click */}
      <RippleClick
        atFrame={CARD_CLICK}
        x={720}
        y={540}
        radius={90}
        durationFrames={18}
        color={colors.teal}
      />

      {/* URL change highlight ring */}
      {frame >= CARD_CLICK && (
        <div
          style={{
            position: "absolute",
            top: 12,
            left: "50%",
            transform: "translateX(-50%)",
            width: 480,
            height: 28,
            borderRadius: 6,
            border: `1px solid ${colors.teal}`,
            opacity: e(frame, [CARD_CLICK, CARD_CLICK + 12, CARD_CLICK + 24], [0, 0.8, 0]),
            pointerEvents: "none",
          }}
        />
      )}
    </AbsoluteFill>
  );
};
