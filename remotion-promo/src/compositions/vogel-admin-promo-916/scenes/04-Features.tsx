import React from "react";
import { AbsoluteFill, useCurrentFrame, Img } from "remotion";
import { colors } from "../../../theme/colors";
import { e } from "../../../lib/interp";
import { assets } from "../../../lib/staticPath";
import { SceneHeader } from "./Header";

export const SEOScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Breathing motion
  const rotY = e(frame, [0, 60], [10, -10]) + Math.cos(frame * 0.03) * 3;
  const floatX = Math.sin(frame * 0.04) * 10;

  return (
    <AbsoluteFill
      style={{
        padding: "80px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <SceneHeader prefix="SEO ТА ПРОСУВАННЯ" title="AI SEO Асистент" />

      <div
        style={{
          width: "900px",
          background: "#fff",
          borderRadius: "40px",
          overflow: "hidden",
          boxShadow: "0 40px 100px rgba(0,0,0,0.15)",
          transform: `perspective(1000px) rotateY(${rotY}deg) translateX(${floatX}px)`,
          opacity: e(frame, [10, 25], [0, 1]),
          margin: "0 auto"
        }}
      >
        <Img
          src={assets.image.screenshots.admin.seoAi}
          style={{
            width: "100%",
            height: "auto",
          }}
        />
      </div>

      <div style={{
        marginTop: "60px",
        background: "rgba(0,0,0,0.08)",
        padding: "30px",
        borderRadius: "30px",
        color: "#000000",
        fontSize: "32px",
        fontWeight: 800,
        textAlign: "center",
        opacity: e(frame, [30, 50], [0, 1])
      }}>
        Генерація мета-тегів за один клік
      </div>
    </AbsoluteFill>
  );
};
