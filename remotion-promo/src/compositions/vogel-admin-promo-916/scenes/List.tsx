import React from "react";
import { AbsoluteFill, useCurrentFrame, Img, spring, useVideoConfig } from "remotion";
import { colors } from "../../../theme/colors";
import { e } from "../../../lib/interp";
import { assets } from "../../../lib/staticPath";
import { SceneHeader } from "./Header";

export const ListScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const spr = spring({
    frame,
    fps,
    config: { damping: 10 },
  });

  // Breathing motion
  const rotY = e(frame, [0, 30], [20, 0], "enter") + Math.sin(frame * 0.03) * 2;
  const floatY = Math.cos(frame * 0.04) * 5;

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
      <SceneHeader title="Керування турами" />

      <div
        style={{
          width: "1000px",
          borderRadius: "32px",
          overflow: "hidden",
          boxShadow: "0 30px 60px rgba(0,0,0,0.1)",
          transform: `perspective(1200px) rotateY(${rotY}deg) translateY(${floatY}px) scale(${e(frame, [0, 20], [0.9, 1])})`,
          opacity: e(frame, [0, 15], [0, 1]),
        }}
      >
        <Img
            src={assets.image.screenshots.admin.offersList}
            style={{
                width: "100%",
                height: "auto",
            }}
        />
      </div>

      <div style={{
        marginTop: 50,
        background: colors.tealDeep,
        color: colors.white,
        padding: "20px 40px",
        borderRadius: "20px",
        fontSize: "32px",
        fontWeight: 800,
        opacity: e(frame, [30, 50], [0, 1]),
        transform: `translateY(${e(frame, [30, 50], [20, 0], "enter")}px)`,
      }}>
        Зручна робота зі списками
      </div>
    </AbsoluteFill>
  );
};
