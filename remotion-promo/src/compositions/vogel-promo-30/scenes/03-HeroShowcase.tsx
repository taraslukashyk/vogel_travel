import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Video } from "@remotion/media";
import { colors } from "../../../theme/colors";
import { fonts } from "../../../theme/fonts";
import { e } from "../../../lib/interp";
import { assets } from "../../../lib/staticPath";
import { BrowserChrome } from "../../../components/brand/BrowserChrome";
import { VogelButton } from "../../../components/ui/VogelButton";
import { AnimatedCursor } from "../../../components/ui/AnimatedCursor";
import { RippleClick } from "../../../components/effects/RippleClick";

type HeroShowcaseProps = {
  website: string;
};

/**
 * Scene 3 — 0..90 (3s) — Hero Showcase.
 * Browser chrome with the Vogel hero, cursor glides to the CTA and clicks.
 */
export const HeroShowcase: React.FC<HeroShowcaseProps> = ({ website }) => {
  const frame = useCurrentFrame();

  // Entrance: browser window scales up from 0.92 with subtle lift
  const winOpacity = e(frame, [0, 14], [0, 1]);
  const winScale = e(frame, [0, 18], [0.92, 1], "enter");

  const HERO_BUTTON = { x: 700, y: 560, w: 240, h: 56 };
  const CLICK_FRAME = 70;

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 50% 50%, #0a1510 0%, #020405 100%)",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          opacity: winOpacity,
          transform: `scale(${winScale})`,
          transformOrigin: "center",
        }}
      >
        <BrowserChrome url={`https://${website}`} width={1480} height={820}>
          {/* Hero video */}
          <AbsoluteFill>
            <Video
              src={assets.video.aerial}
              muted
              playbackRate={0.6}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </AbsoluteFill>

          {/* Veil */}
          <AbsoluteFill
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.55) 100%)",
            }}
          />

          {/* Hero copy */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              color: "#fff",
              textShadow: "0 10px 40px rgba(0,0,0,0.6)",
              opacity: e(frame, [6, 22], [0, 1]),
              transform: `translateY(${e(frame, [6, 22], [14, 0])}px)`,
            }}
          >
            <div style={{ fontFamily: fonts.script, fontSize: 64 }}>
              Відкрийте світ:
            </div>
            <div
              style={{
                fontFamily: fonts.heading,
                fontSize: 54,
                fontWeight: 800,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              ваша подорож
            </div>
            <div
              style={{
                fontFamily: fonts.script,
                fontSize: 64,
                color: colors.teal,
              }}
            >
              починається
            </div>

            {/* CTA */}
            <div style={{ marginTop: 40 }}>
              <VogelButton
                label="Замовити Тур"
                hoverAt={50}
                clickAt={CLICK_FRAME}
                width={HERO_BUTTON.w}
                height={HERO_BUTTON.h}
              />
            </div>
          </div>

          {/* Animated cursor within the chrome */}
          <AnimatedCursor
            keyframes={[
              { frame: 14, x: 1200, y: 140 },
              { frame: 46, x: HERO_BUTTON.x + 100, y: HERO_BUTTON.y + 10 },
              { frame: 58, x: HERO_BUTTON.x + 120, y: HERO_BUTTON.y + 24 },
              { frame: CLICK_FRAME, x: HERO_BUTTON.x + 120, y: HERO_BUTTON.y + 24, click: true },
              { frame: CLICK_FRAME + 20, x: HERO_BUTTON.x + 120, y: HERO_BUTTON.y + 24 },
            ]}
          />

          <RippleClick
            atFrame={CLICK_FRAME}
            x={HERO_BUTTON.x + 120}
            y={HERO_BUTTON.y + 24}
            radius={140}
          />
        </BrowserChrome>
      </div>
    </AbsoluteFill>
  );
};
