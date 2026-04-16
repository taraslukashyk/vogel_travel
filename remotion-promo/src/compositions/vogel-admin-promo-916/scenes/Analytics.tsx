import React from "react";
import { AbsoluteFill, useCurrentFrame, Img } from "remotion";
import { assets } from "../../../lib/staticPath";
import { e } from "../../../lib/interp";
import { colors } from "../../../theme/colors";
import { SceneHeader } from "./Header";

export const AnalyticsScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Breathing motion
  const rotY = e(frame, [0, 60], [-10, 5]) + Math.cos(frame * 0.04) * 3;
  const floatX = Math.sin(frame * 0.05) * 10;

  return (
    <AbsoluteFill
      style={{
        padding: "60px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
        <SceneHeader prefix="СТАТИСТИКА" title="Аналітика Vogel" />

        <div style={{
            width: "1000px",
            background: "#fff",
            borderRadius: "40px",
            padding: "40px",
            boxShadow: "0 50px 100px rgba(0,0,0,0.1)",
            transform: `perspective(1000px) rotateY(${rotY}deg) translateX(${floatX}px) scale(${e(frame, [0, 20], [0.8, 1])})`,
            opacity: e(frame, [0, 15], [0, 1]),
            overflow: "hidden"
        }}>
            <Img src={assets.image.screenshots.admin.analytics} style={{ width: "100%" }} />
        </div>

        <div style={{
            marginTop: "60px",
            textAlign: "center",
            opacity: e(frame, [20, 40], [0, 1]),
            transform: `translateY(${e(frame, [20, 40], [20, 0], "enter")}px)`
        }}>
            <div style={{ color: "#000000", fontSize: "32px", fontWeight: 700 }}>Відстежуйте відвідувачів та конверсії</div>
        </div>
    </AbsoluteFill>
  );
};
