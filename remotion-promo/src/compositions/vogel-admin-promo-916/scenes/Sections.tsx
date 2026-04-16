import React from "react";
import { AbsoluteFill, useCurrentFrame, Img, spring, useVideoConfig } from "remotion";
import { colors } from "../../../theme/colors";
import { e } from "../../../lib/interp";
import { assets } from "../../../lib/staticPath";
import { SceneHeader } from "./Header";

export const SectionsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Breathing motion
  const rotX = e(frame, [0, 40], [10, 0], "enter") + Math.sin(frame * 0.05) * 3;
  const rotY = e(frame, [0, 40], [-10, 0], "enter") + Math.cos(frame * 0.04) * 2;

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
      <div
        style={{
          width: "950px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <SceneHeader prefix="КОНСТРУКТОР КОНТЕНТУ" title="Блог та сторінки" align="left" />

        <div
            style={{
            borderRadius: "32px",
            overflow: "hidden",
            boxShadow: "0 40px 80px rgba(0,0,0,0.15)",
            transform: `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
            opacity: e(frame, [10, 25], [0, 1]),
            }}
        >
            <Img
                src={assets.image.screenshots.admin.contentEditor}
                style={{
                    width: "100%",
                    height: "auto",
                }}
            />
        </div>
      </div>
    </AbsoluteFill>
  );
};
