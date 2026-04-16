import React from "react";
import { AbsoluteFill, useCurrentFrame, Img } from "remotion";
import { assets } from "../../../lib/staticPath";
import { e } from "../../../lib/interp";
import { colors } from "../../../theme/colors";
import { SceneHeader } from "./Header";

export const SettingsScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Breathing motion
  const rotX = e(frame, [0, 60], [-10, 5]) + Math.sin(frame * 0.05) * 3;
  const floatY = Math.cos(frame * 0.04) * 8;

  return (
    <AbsoluteFill
      style={{
        padding: "80px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
        <SceneHeader prefix="КОНФІГУРАЦІЯ" title="Налаштування Vogel" />

        <div style={{
            width: "900px",
            background: "#fff",
            borderRadius: "40px",
            overflow: "hidden",
            boxShadow: "0 40px 80px rgba(0,0,0,0.1)",
            transform: `perspective(1000px) rotateX(${rotX}deg) translateY(${floatY}px)`,
            opacity: e(frame, [0, 15], [0, 1])
        }}>
            <Img src={assets.image.screenshots.admin.settings} style={{ width: "100%" }} />
        </div>

        <div style={{
            marginTop: "60px",
            textAlign: "center",
            opacity: e(frame, [30, 50], [0, 1])
        }}>
            <p style={{ color: "#000000", fontSize: "36px", fontWeight: 800 }}>Миттєві сповіщення у Telegram</p>
        </div>
    </AbsoluteFill>
  );
};
