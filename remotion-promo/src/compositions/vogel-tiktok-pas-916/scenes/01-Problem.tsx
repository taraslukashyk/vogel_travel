import React from "react";
import { AbsoluteFill, Img, useCurrentFrame } from "remotion";
import { e } from "../../../lib/interp";
import { colors } from "../../../theme/colors";
import { fonts } from "../../../theme/fonts";
import { BrowserChrome } from "../../../components/brand/BrowserChrome";
import { assets } from "../../../lib/staticPath";

const TILES: { url: string; src: string; objectPosition: string }[] = [
  { url: "booking.com", src: assets.image.screenshots.homeFull, objectPosition: "top left" },
  { url: "airbnb.com", src: assets.image.screenshots.offersFull, objectPosition: "top right" },
  { url: "aviasales.com", src: assets.image.screenshots.offerDetailFull, objectPosition: "center" },
  { url: "tripadvisor.com", src: assets.image.screenshots.admin.offersList, objectPosition: "top left" },
  { url: "docs.google.com", src: assets.image.screenshots.admin.contentEditor, objectPosition: "center" },
  { url: "mail.google.com", src: assets.image.screenshots.admin.analytics, objectPosition: "bottom right" },
];

export const ProblemScene: React.FC = () => {
  const frame = useCurrentFrame();
  const entrance = e(frame, [0, 16], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        background: colors.darker,
        overflow: "hidden",
        opacity: entrance,
        padding: 80,
      }}
    >
      {/* 3×2 chaotic grid */}
      <div
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "1fr 1fr 1fr",
          gap: 26,
          alignItems: "center",
          justifyItems: "center",
          width: "100%",
          height: "100%",
        }}
      >
        {TILES.map((t, i) => {
          const jitter = Math.sin((frame + i * 13) * 0.18) * 4;
          const rot = Math.sin((frame + i * 7) * 0.12) * 1.4;
          const tileP = e(frame, [i * 4, i * 4 + 20], [0, 1], "pop");
          return (
            <div
              key={i}
              style={{
                transform: `translate(${jitter}px, ${jitter * 0.6}px) rotate(${rot}deg) scale(${0.88 + 0.12 * tileP})`,
                opacity: tileP,
              }}
            >
              <BrowserChrome url={t.url} width={420} height={260}>
                <Img
                  src={t.src}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: t.objectPosition,
                  }}
                />
              </BrowserChrome>
            </div>
          );
        })}
      </div>

      {/* Red warning caption */}
      <div
        style={{
          position: "absolute",
          top: 110,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: fonts.heading,
          fontWeight: 900,
          fontSize: 92,
          color: "#ef4444",
          letterSpacing: "0.03em",
          textShadow: "0 6px 24px rgba(239,68,68,0.4)",
          transform: `translateX(${Math.sin(frame * 0.4) * 3}px)`,
        }}
      >
        6 ВКЛАДОК.
        <br />
        0 ПЛАНУ.
      </div>
    </AbsoluteFill>
  );
};
