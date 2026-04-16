import React from "react";
import { AbsoluteFill, useCurrentFrame, Img } from "remotion";
import { assets } from "../../../lib/staticPath";
import { e } from "../../../lib/interp";
import { colors } from "../../../theme/colors";
import { SceneHeader } from "./Header";

export const ServicesScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Breathing motion
  const rotY = -15 + Math.cos(frame * 0.04) * 3;
  const floatY = Math.sin(frame * 0.035) * 12;

  return (
    <AbsoluteFill
      style={{
        padding: "80px",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
        <div style={{ width: "450px" }}>
            <SceneHeader prefix="ДОДАТКИ" title="Сервіси" align="left" />
            <p style={{ color: "#000000", fontSize: "36px", fontWeight: 700, lineHeight: 1.4, opacity: e(frame, [10, 25], [0, 1]) }}>
                Повний контроль над послугами сайту.
            </p>
        </div>

        <div style={{
            width: "500px",
            height: "800px",
            background: colors.white,
            borderRadius: "40px",
            boxShadow: "0 30px 60px rgba(0,0,0,0.1)",
            overflow: "hidden",
            transform: `perspective(1000px) rotateY(${rotY}deg) translateY(${floatY}px) scale(${e(frame, [0, 20], [0.8, 1])})`,
            opacity: e(frame, [0, 15], [0, 1])
        }}>
             <Img
                src={assets.image.screenshots.admin.sidebar}
                style={{
                    width: "100%",
                }}
            />
        </div>
    </AbsoluteFill>
  );
};
