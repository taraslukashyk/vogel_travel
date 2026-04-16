import React from "react";
import { AbsoluteFill, useCurrentFrame, Img, spring, useVideoConfig } from "remotion";
import { colors } from "../../../theme/colors";
import { e } from "../../../lib/interp";
import { assets } from "../../../lib/staticPath";
import { SceneHeader } from "./Header";

export const LoginScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const spr = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 60 },
  });

  // Breathing motion
  const rotX = 15 * (1 - spr) + Math.sin(frame * 0.05) * 2;
  const rotY = -10 * (1 - spr) + Math.cos(frame * 0.04) * 3;

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
      <SceneHeader title="Безпечний вхід" />

      <div
        style={{
          width: "900px",
          borderRadius: "40px",
          overflow: "hidden",
          boxShadow: "0 40px 80px rgba(0,0,0,0.1)",
          transformOrigin: "center center",
          transform: `perspective(1200px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${0.8 + 0.2 * spr})`,
          opacity: e(frame, [0, 15], [0, 1]),
        }}
      >
        <Img
            src={assets.image.screenshots.admin.login}
            style={{
                width: "100%",
                height: "auto",
            }}
        />
      </div>
    </AbsoluteFill>
  );
};
