import React from "react";
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig, Img } from "remotion";
import { e } from "../../../lib/interp";
import { assets } from "../../../lib/staticPath";
import { SceneHeader } from "./Header";

export const EditorScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const spr = spring({
    frame,
    fps,
    config: { damping: 12 },
  });

  // Breathing motion
  const rotX = 15 * (1 - spr) + Math.sin(frame * 0.04) * 2;
  const floatY = Math.cos(frame * 0.035) * 8;

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
      <SceneHeader prefix="РЕДАКТОР" title="Деталі пропозиції" />

      <div
        style={{
          width: "900px",
          background: "#fff",
          borderRadius: "40px",
          overflow: "hidden",
          boxShadow: "0 40px 100px rgba(0,0,0,0.15)",
          transform: `perspective(1000px) rotateX(${rotX}deg) translateY(${floatY}px) scale(${0.8 + 0.2 * spr})`,
          opacity: e(frame, [0, 15], [0, 1]),
        }}
      >
        <Img
            src={assets.image.screenshots.admin.offerDetail}
            style={{
                width: "100%",
                height: "auto",
            }}
        />
      </div>
    </AbsoluteFill>
  );
};
