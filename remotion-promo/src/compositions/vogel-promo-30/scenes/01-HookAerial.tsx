import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Video } from "@remotion/media";
import { assets } from "../../../lib/staticPath";
import { colors } from "../../../theme/colors";
import { fonts } from "../../../theme/fonts";
import { e, progress } from "../../../lib/interp";
import { BirdParticles } from "../../../components/brand/BirdParticles";

/**
 * Scene 1 — 0..120 (4s) — Hook.
 * Aerial view (strong blur → sharp), Ken-Burns zoom-out,
 * marketing line appears in two beats.
 */
export const HookAerial: React.FC = () => {
  const frame = useCurrentFrame();

  // Blur fades away 0 → 45
  const blur = e(frame, [0, 45], [36, 0], "editorial");
  // Very slow Ken-Burns zoom out
  const scale = e(frame, [0, 120], [1.18, 1.05], "editorial");
  // Darken overlay eases down slightly
  const veil = e(frame, [0, 30], [0.55, 0.38]);

  // Line 1: script "Хочеш на відпочинок?" fades + rises
  const l1Opacity = e(frame, [6, 24], [0, 1]);
  const l1Y = e(frame, [6, 30], [30, 0]);

  // Line 2: "ЛЕГКО!" pops in with overshoot from below
  const l2Opacity = e(frame, [36, 52], [0, 1]);
  const l2Y = e(frame, [36, 58], [80, 0], "pop");
  const l2Scale = e(frame, [36, 54], [0.8, 1], "pop");

  // Exit: both lines drift + fade 100→120
  const exit = progress(frame, 100, 20, "exit");
  const textOpacity = 1 - exit;
  const textTranslateY = -exit * 20;

  return (
    <AbsoluteFill style={{ background: colors.black }}>
      {/* Aerial video */}
      <AbsoluteFill style={{ transform: `scale(${scale})`, filter: `blur(${blur}px)` }}>
        <Video
          src={assets.video.aerial}
          muted
          playbackRate={0.7}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </AbsoluteFill>

      {/* Warm-to-dark veil */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, rgba(0,0,0,${veil * 0.6}) 0%, rgba(0,0,0,${veil}) 60%, rgba(0,0,0,${veil * 0.9}) 100%)`,
        }}
      />

      {/* Glow column behind the text */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            width: 900,
            height: 900,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${colors.glow} 0%, transparent 60%)`,
            opacity: 0.35,
          }}
        />
      </AbsoluteFill>

      {/* Birds flock during last third, ready to carry into scene 2 */}
      <BirdParticles
        count={14}
        spreadX={1400}
        driftY={500}
        startFrame={70}
        opacity={e(frame, [70, 110], [0, 1])}
        seed={7}
      />

      {/* Headline */}
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 4,
          transform: `translateY(${textTranslateY}px)`,
          opacity: textOpacity,
        }}
      >
        <div
          style={{
            fontFamily: fonts.script,
            fontSize: 92,
            color: "#fff",
            opacity: l1Opacity,
            transform: `translateY(${l1Y}px)`,
            lineHeight: 1.05,
            textShadow: "0 10px 40px rgba(0,0,0,0.6)",
          }}
        >
          Хочеш на відпочинок?
        </div>
        <div
          style={{
            fontFamily: fonts.heading,
            fontSize: 170,
            fontWeight: 900,
            letterSpacing: "0.02em",
            color: "#fff",
            opacity: l2Opacity,
            transform: `translateY(${l2Y}px) scale(${l2Scale})`,
            lineHeight: 1,
            textShadow: "0 18px 60px rgba(0,0,0,0.7)",
          }}
        >
          <span>ЛЕГКО</span>
          <span style={{ color: colors.teal }}>.</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
