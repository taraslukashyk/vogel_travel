import React from "react";
import { AbsoluteFill, useCurrentFrame, Img } from "remotion";
import { assets } from "../../../lib/staticPath";
import { e } from "../../../lib/interp";
import { colors } from "../../../theme/colors";
import { SceneHeader } from "./Header";

export const PartnersScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Breathing motion
  const rotX = 10 + Math.sin(frame * 0.05) * 3;
  const rotY = Math.cos(frame * 0.04) * 2;

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
        <SceneHeader prefix="ІНТЕГРАЦІЇ" title="Партнери та авіа" />

        <div style={{
            width: "900px",
            borderRadius: "40px",
            overflow: "hidden",
            boxShadow: "0 40px 80px rgba(0,0,0,0.1)",
            transform: `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${e(frame, [0, 20], [0.9, 1])})`,
            opacity: e(frame, [10, 25], [0, 1])
        }}>
            <Img src={assets.image.screenshots.admin.partners} style={{ width: "100%" }} />
        </div>
    </AbsoluteFill>
  );
};
