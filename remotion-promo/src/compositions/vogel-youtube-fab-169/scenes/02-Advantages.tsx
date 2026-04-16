import React from "react";
import { AbsoluteFill, Img, useCurrentFrame } from "remotion";
import { e } from "../../../lib/interp";
import { colors } from "../../../theme/colors";
import { fonts } from "../../../theme/fonts";
import { BrowserChrome } from "../../../components/brand/BrowserChrome";
import { AnimatedCursor } from "../../../components/ui/AnimatedCursor";
import { assets } from "../../../lib/staticPath";

const ADVANTAGES = [
  {
    title: "Без програміста",
    desc: "Редагуй контент так само легко, як пост у Instagram",
  },
  {
    title: "SEO на автопілоті",
    desc: "AI генерує meta-заголовки та описи за кілька секунд",
  },
  {
    title: "UA + EN з коробки",
    desc: "Перемикай мови без зайвих плагінів",
  },
];

export const AdvantagesScene: React.FC = () => {
  const frame = useCurrentFrame();

  const enter = e(frame, [0, 20], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        background: colors.darker,
        opacity: enter,
        overflow: "hidden",
      }}
    >
      {/* Left: Browser with content editor + animated cursor */}
      <div
        style={{
          position: "absolute",
          left: 80,
          top: "50%",
          transform: "translateY(-50%)",
        }}
      >
        <BrowserChrome url="admin.vogel.travel/content" width={900} height={600}>
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <Img
              src={assets.image.screenshots.admin.contentEditor}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "top left",
              }}
            />
          </div>
        </BrowserChrome>

        {/* Cursor editing in the editor */}
        <AnimatedCursor
          size={32}
          keyframes={[
            { frame: 30, x: 200, y: 200 },
            { frame: 90, x: 520, y: 280, click: true },
            { frame: 160, x: 520, y: 280 },
            { frame: 200, x: 720, y: 400, click: true },
          ]}
        />
      </div>

      {/* Right: 3 advantage cards */}
      <div
        style={{
          position: "absolute",
          right: 80,
          top: "50%",
          transform: "translateY(-50%)",
          width: 640,
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        <div
          style={{
            fontFamily: fonts.heading,
            fontWeight: 900,
            fontSize: 58,
            color: colors.white,
            lineHeight: 0.95,
            marginBottom: 8,
            opacity: e(frame, [0, 20], [0, 1]),
          }}
        >
          Керуй сайтом{" "}
          <span style={{ color: colors.teal }}>сам</span>
        </div>

        {ADVANTAGES.map((adv, i) => {
          const start = 30 + i * 30;
          const p = e(frame, [start, start + 26], [0, 1], "pop");
          return (
            <div
              key={adv.title}
              style={{
                padding: "26px 30px",
                borderRadius: 20,
                background: "rgba(255,255,255,0.06)",
                backdropFilter: "blur(14px)",
                border: `1px solid ${colors.teal}44`,
                boxShadow: `0 8px 28px ${colors.glow}55`,
                opacity: p,
                transform: `translateX(${(1 - p) * 40}px)`,
              }}
            >
              <div
                style={{
                  fontFamily: fonts.heading,
                  fontWeight: 800,
                  fontSize: 34,
                  color: colors.teal,
                  letterSpacing: "0.01em",
                }}
              >
                {adv.title}
              </div>
              <div
                style={{
                  marginTop: 8,
                  fontFamily: fonts.body,
                  fontWeight: 500,
                  fontSize: 22,
                  color: colors.whiteSoft,
                  lineHeight: 1.4,
                }}
              >
                {adv.desc}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
