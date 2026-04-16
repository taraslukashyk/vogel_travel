import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { e } from "../../../lib/interp";
import { colors } from "../../../theme/colors";
import { Counter } from "../../../components/ui/Counter";
import { fonts } from "../../../theme/fonts";

export const TrustGridScene: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = e(frame, [0, 15], [0, 1]);
  const exitOpacity = e(frame, [75, 90], [1, 0], "exit");

  const cellScale = (delay: number) => e(frame, [delay, delay + 20], [0, 1], "pop");

  return (
    <AbsoluteFill
      style={{
        background: colors.darker,
        opacity: Math.min(opacity, exitOpacity),
        padding: 60,
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gridTemplateRows: "1fr 1.5fr 1fr",
        gap: 30,
      }}
    >
      <div
        style={{
          gridColumn: "span 2",
          background: "rgba(255,255,255,0.03)",
          borderRadius: 30,
          border: `1px solid ${colors.whiteFaint}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${cellScale(0)})`,
        }}
      >
        <Counter label="Мадрівників з нами" increments={[5400, 5800]} initial={5000} />
      </div>

      <div
        style={{
          background: colors.tealDeep,
          borderRadius: 30,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 40,
          textAlign: "center",
          transform: `scale(${cellScale(10)})`,
        }}
      >
         <div style={{ fontSize: 80 }}>✈️</div>
         <div style={{ color: colors.white, fontFamily: fonts.heading, fontWeight: 700, marginTop: 20 }}>120+ Країн</div>
      </div>

      <div
        style={{
          background: "rgba(255,255,255,0.03)",
          borderRadius: 30,
          border: `1px solid ${colors.whiteFaint}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${cellScale(20)})`,
        }}
      >
         <div style={{ fontSize: 80 }}>⭐️</div>
         <div style={{ color: colors.white, fontFamily: fonts.heading, fontWeight: 700, marginTop: 20 }}>TOP Rated</div>
      </div>

      <div
        style={{
          gridColumn: "span 2",
          background: colors.white,
          borderRadius: 30,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${cellScale(30)})`,
        }}
      >
        <div style={{ color: colors.black, fontFamily: fonts.heading, fontWeight: 800, fontSize: 40, textTransform: "uppercase", letterSpacing: "0.2em" }}>
          VOGEL TRAVEL
        </div>
      </div>
    </AbsoluteFill>
  );
};
