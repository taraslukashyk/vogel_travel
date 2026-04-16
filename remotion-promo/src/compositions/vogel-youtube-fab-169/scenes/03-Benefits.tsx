import React from "react";
import { AbsoluteFill, Img, useCurrentFrame } from "remotion";
import { e } from "../../../lib/interp";
import { colors } from "../../../theme/colors";
import { fonts } from "../../../theme/fonts";
import { BrowserChrome } from "../../../components/brand/BrowserChrome";
import { assets } from "../../../lib/staticPath";

type Props = {
  kpi: { conversion: number; speedX: number; timeSaved: number };
};

const KpiCard: React.FC<{
  progress: number;
  target: number;
  prefix?: string;
  suffix?: string;
  label: string;
  decimals?: number;
}> = ({ progress, target, prefix = "", suffix = "", label, decimals = 0 }) => {
  const raw = progress * target;
  const value =
    decimals > 0
      ? raw.toFixed(decimals)
      : String(Math.round(raw));
  return (
    <div
      style={{
        flex: 1,
        padding: "40px 28px",
        borderRadius: 24,
        background: "rgba(255,255,255,0.06)",
        backdropFilter: "blur(14px)",
        border: `1px solid ${colors.teal}55`,
        boxShadow: `0 10px 40px ${colors.glow}`,
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontFamily: fonts.heading,
          fontWeight: 900,
          fontSize: 120,
          color: colors.teal,
          lineHeight: 1,
          letterSpacing: "-0.03em",
          fontVariantNumeric: "tabular-nums",
          textShadow: `0 0 40px ${colors.glow}`,
        }}
      >
        {prefix}
        {value}
        {suffix}
      </div>
      <div
        style={{
          marginTop: 14,
          fontFamily: fonts.body,
          fontWeight: 600,
          fontSize: 24,
          color: colors.whiteSoft,
          letterSpacing: "0.03em",
        }}
      >
        {label}
      </div>
    </div>
  );
};

export const BenefitsScene: React.FC<Props> = ({ kpi }) => {
  const frame = useCurrentFrame();

  const enter = e(frame, [0, 18], [0, 1]);
  const countP = e(frame, [30, 150], [0, 1], "editorial");

  const cardsP = (i: number) =>
    e(frame, [30 + i * 12, 60 + i * 12], [0, 1], "pop");

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 40%, ${colors.tealDeep}50 0%, ${colors.darker} 70%)`,
        opacity: enter,
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Analytics browser backdrop (faded) */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%) scale(0.9)",
          opacity: 0.22,
          filter: "blur(2px)",
        }}
      >
        <BrowserChrome url="admin.vogel.travel/analytics" width={1400} height={780}>
          <Img
            src={assets.image.screenshots.admin.analytics}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "top",
            }}
          />
        </BrowserChrome>
      </div>

      {/* Headline */}
      <div
        style={{
          position: "absolute",
          top: 90,
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 2,
        }}
      >
        <div
          style={{
            fontFamily: fonts.heading,
            fontWeight: 900,
            fontSize: 72,
            color: colors.white,
            letterSpacing: "-0.02em",
            opacity: e(frame, [0, 20], [0, 1]),
          }}
        >
          Більше бронювань.{" "}
          <span style={{ color: colors.teal }}>Менше рутини.</span>
        </div>
      </div>

      {/* 3 KPI cards */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          gap: 32,
          padding: "0 120px",
          width: "100%",
          marginTop: 60,
        }}
      >
        <div
          style={{
            flex: 1,
            opacity: cardsP(0),
            transform: `translateY(${(1 - cardsP(0)) * 40}px)`,
          }}
        >
          <KpiCard
            progress={countP}
            target={kpi.conversion}
            prefix="+"
            suffix="%"
            label="конверсії"
          />
        </div>
        <div
          style={{
            flex: 1,
            opacity: cardsP(1),
            transform: `translateY(${(1 - cardsP(1)) * 40}px)`,
          }}
        >
          <KpiCard
            progress={countP}
            target={kpi.speedX}
            suffix="×"
            label="швидше публікація"
          />
        </div>
        <div
          style={{
            flex: 1,
            opacity: cardsP(2),
            transform: `translateY(${(1 - cardsP(2)) * 40}px)`,
          }}
        >
          <KpiCard
            progress={countP}
            target={kpi.timeSaved}
            suffix="г"
            label="економія на тиждень"
          />
        </div>
      </div>

      {/* Bottom caption */}
      <div
        style={{
          position: "absolute",
          bottom: 90,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: fonts.body,
          fontWeight: 500,
          fontSize: 28,
          color: colors.whiteMuted,
          opacity: e(frame, [180, 210], [0, 1]),
          letterSpacing: "0.02em",
        }}
      >
        Реальні метрики агенцій на Vogel
      </div>
    </AbsoluteFill>
  );
};
