import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { e } from "../../../lib/interp";
import { assets } from "../../../lib/staticPath";
import { colors } from "../../../theme/colors";
import { fonts } from "../../../theme/fonts";
import { BrowserChrome } from "../../../components/brand/BrowserChrome";
import { PageScroll } from "../../../components/ui/PageScroll";
import { AnimatedCursor } from "../../../components/ui/AnimatedCursor";
import { BirdParticles } from "../../../components/brand/BirdParticles";

type Props = { website: string };

/**
 * Scene 2 — 0..180 (6s) — Home Page Scroll.
 * Flat browser, cursor drifts as page scrolls top→bottom.
 * At frame 155 URL bar cross-fades to /ua/offers.
 */
export const HomeScroll: React.FC<Props> = ({ website }) => {
  const frame = useCurrentFrame();

  const sceneOpacity = e(frame, [0, 14], [0, 1]);
  const sceneFade = e(frame, [168, 180], [1, 0], "exit");

  // URL cross-fade: website → /ua/offers at frame 155
  const urlTransition = e(frame, [150, 165], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        background: "#000",
        alignItems: "center",
        justifyContent: "center",
        opacity: Math.min(sceneOpacity, sceneFade),
      }}
    >
      <BirdParticles count={8} spreadX={1600} driftY={400} opacity={0.25} seed={22} />

      <BrowserChrome
        url={urlTransition < 0.5 ? website : `${website}/ua/offers`}
        width={1480}
        height={820}
      >
        {/* Full-page screenshot scrolling */}
        <PageScroll
          src={assets.image.screenshots.homeFull}
          imageHeight={4500}
          viewHeight={820}
          viewWidth={1480}
          startFrame={10}
          durationFrames={148}
          easing="editorial"
        />
      </BrowserChrome>

      {/* URL change indicator pulse */}
      {frame >= 148 && (
        <div
          style={{
            position: "absolute",
            top: 12,
            left: "50%",
            transform: "translateX(-50%)",
            width: 380,
            height: 28,
            borderRadius: 6,
            border: `1px solid ${colors.teal}`,
            opacity: e(frame, [148, 160, 175], [0, 0.7, 0]),
            pointerEvents: "none",
          }}
        />
      )}

      {/* Drifting cursor — no clicks, just guides viewer's eye */}
      <AnimatedCursor
        keyframes={[
          { frame: 5, x: 960, y: 300 },
          { frame: 50, x: 700, y: 500 },
          { frame: 100, x: 1100, y: 620 },
          { frame: 150, x: 960, y: 400 },
          { frame: 170, x: 960, y: 350 },
        ]}
      />

      {/* Caption label */}
      <div
        style={{
          position: "absolute",
          bottom: 36,
          left: "50%",
          transform: "translateX(-50%)",
          fontFamily: fonts.heading,
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.35em",
          textTransform: "uppercase",
          color: colors.whiteMuted,
          opacity: e(frame, [20, 40], [0, 1]),
          whiteSpace: "nowrap",
        }}
      >
        Vogel Travel — відкрийте світ
      </div>
    </AbsoluteFill>
  );
};
