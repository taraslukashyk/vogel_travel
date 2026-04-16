import React from "react";
import { AbsoluteFill, Img, useCurrentFrame } from "remotion";
import { e } from "../../../lib/interp";
import { assets } from "../../../lib/staticPath";
import { colors } from "../../../theme/colors";
import { IsometricBrowser } from "../../../components/brand/IsometricBrowser";
import { BirdParticles } from "../../../components/brand/BirdParticles";
import { Logo } from "../../../components/brand/Logo";

type Props = { website: string };

/**
 * Scene 1 — 0..90 (3s) — Isometric Reveal.
 * Logo flashes briefly, then BrowserChrome rises in 3D isometric view
 * and eases to flat — setting up the "real site" narrative.
 */
export const IsometricReveal: React.FC<Props> = ({ website }) => {
  const frame = useCurrentFrame();

  // Logo: quick reveal then fade before browser appears
  const logoOpacity = e(frame, [0, 12, 28, 42], [0, 1, 1, 0]);
  const logoScale = e(frame, [0, 14], [0.85, 1], "pop");

  // Browser lifts in from below + isometric → flat (handled by IsometricBrowser)
  const browserOpacity = e(frame, [22, 38], [0, 1]);
  const browserY = e(frame, [22, 50], [60, 0], "enter");

  // Scene fade-out at very end
  const sceneFade = e(frame, [78, 90], [1, 0], "exit");

  return (
    <AbsoluteFill
      style={{
        background: "radial-gradient(ellipse at 50% 40%, #0d2520 0%, #020606 70%, #000 100%)",
        opacity: sceneFade,
      }}
    >
      <BirdParticles count={14} spreadX={1800} driftY={500} opacity={0.4} seed={11} />

      {/* Logo flash */}
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          opacity: logoOpacity,
          transform: `scale(${logoScale})`,
        }}
      >
        <Logo width={360} />
      </AbsoluteFill>

      {/* Isometric browser entering */}
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          opacity: browserOpacity,
          transform: `translateY(${browserY}px)`,
        }}
      >
        <IsometricBrowser
          url={website}
          tiltX={22}
          tiltY={-28}
          initialScale={0.78}
          flatAtFrame={68}
          width={1480}
          height={820}
        >
          {/* Top slice of homepage as static preview */}
          <Img
            src={assets.image.screenshots.homeFull}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "top center",
            }}
          />
        </IsometricBrowser>
      </AbsoluteFill>

      {/* Teal corner glow */}
      <div
        style={{
          position: "absolute",
          bottom: -200,
          left: "50%",
          transform: "translateX(-50%)",
          width: 800,
          height: 400,
          borderRadius: "50%",
          background: `radial-gradient(ellipse, ${colors.glow} 0%, transparent 65%)`,
          filter: "blur(40px)",
          opacity: e(frame, [30, 80], [0, 0.6]),
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
