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
 * Scene 4 — 0..120 (4s) — Offer Detail Page.
 * Four Seasons Seychelles page loads, cursor scrolls down to the booking form,
 * clicks "Оформити замовлення" button — transitioning to form scene.
 */
export const OfferDetail: React.FC<Props> = ({ website }) => {
  const frame = useCurrentFrame();

  const BTN_CLICK = 98;

  const sceneOpacity = e(frame, [0, 14], [0, 1]);
  const sceneFade = e(frame, [108, 120], [1, 0], "exit");

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
        url={`${website}/ua/offers/four-seasons-seychelles`}
        width={1480}
        height={820}
      >
        {/* Detail page — scroll to the booking form area */}
        <PageScroll
          src={assets.image.screenshots.offerDetailFull}
          imageHeight={3200}
          viewHeight={820}
          viewWidth={1480}
          startFrame={12}
          durationFrames={80}
          easing="editorial"
        />
      </BrowserChrome>

      {/* Cursor: arrive → scroll → hover CTA → click */}
      <AnimatedCursor
        keyframes={[
          { frame: 0, x: 960, y: 300 },
          { frame: 35, x: 960, y: 620 },
          { frame: 80, x: 740, y: 710 },
          { frame: BTN_CLICK - 6, x: 740, y: 710 },
          { frame: BTN_CLICK, x: 740, y: 710, click: true },
        ]}
      />

      {/* Ripple on CTA button click */}
      <RippleClick
        atFrame={BTN_CLICK}
        x={740}
        y={710}
        radius={100}
        durationFrames={18}
        color={colors.teal}
      />
    </AbsoluteFill>
  );
};
